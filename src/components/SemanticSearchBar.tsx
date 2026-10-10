/**
 * src/components/SemanticSearchBar.tsx
 *
 * Drop-in search bar for the Explore page.
 * - Loads the encoder lazily on first focus.
 * - Debounced suggest() dropdown grouped by entity_type (max 4 per group).
 * - Keyboard: ArrowUp/Down, Enter, Escape.
 * - Matching text highlighted.
 * - Empty-focus: shows recent searches (localStorage, max 5).
 * - Enter / "See all" -> /semantic-search?q=...
 * - Click result -> navigate to entity page, log search_events (non-blocking).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Cpu, BookOpen, Tag, Compass, FileText,
  Clock, X, ArrowRight, Sparkles,
} from 'lucide-react';
import { loadModel, cleanQuery } from '@/lib/skillEncoder';
import {
  callSuggest,
  SuggestRow,
  logSearchEvent,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getItemRoute,
} from '@/hooks/useSemanticSearch';

// ── Entity-type display config ───────────────────────────────────────────────

type EntityType = 'skill' | 'resource' | 'topic' | 'domain' | 'post';

const TYPE_CONFIG: Record<EntityType, {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}> = {
  skill:    { label: 'Skills',    Icon: Cpu,      color: 'text-purple-500', bg: 'bg-purple-500/10' },
  resource: { label: 'Resources', Icon: BookOpen,  color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
  topic:    { label: 'Topics',    Icon: Tag,       color: 'text-green-500',  bg: 'bg-green-500/10'  },
  domain:   { label: 'Domains',   Icon: Compass,   color: 'text-orange-500', bg: 'bg-orange-500/10' },
  post:     { label: 'Posts',     Icon: FileText,  color: 'text-pink-500',   bg: 'bg-pink-500/10'   },
};

const GROUP_ORDER: EntityType[] = ['skill', 'resource', 'topic', 'domain', 'post'];
const MAX_PER_GROUP = 4;

// ── Highlight helper ──────────────────────────────────────────────────────────

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm px-0.5 not-italic font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Simple debounce hook ──────────────────────────────────────────────────────

function useDebounced<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SemanticSearchBarProps {
  /** Extra class for the container div */
  className?: string;
  placeholder?: string;
  /** Wrap in framer-motion slide-up animation (default true) */
  animate?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SemanticSearchBar({
  className = '',
  placeholder = 'Search skills, courses, topics…',
  animate = true,
}: SemanticSearchBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rawQuery, setRawQuery]           = useState('');
  const [isOpen, setIsOpen]               = useState(false);
  const [suggestions, setSuggestions]     = useState<SuggestRow[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [activeIdx, setActiveIdx]         = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [modelTriggered, setModelTriggered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounced(rawQuery, 150);

  // ── Trigger model load on first focus ────────────────────────────────────
  const handleFocus = useCallback(() => {
    setIsOpen(true);
    setRecentSearches(getRecentSearches());
    if (!modelTriggered) {
      setModelTriggered(true);
      loadModel().catch((e) =>
        console.warn('[SemanticSearchBar] model load failed; text-only mode', e),
      );
    }
  }, [modelTriggered]);

  // ── Fetch suggestions on debounced query ─────────────────────────────────
  useEffect(() => {
    const raw = debouncedQuery.trim();
    if (!raw || raw.length < 2) {
      setSuggestions([]);
      return;
    }
    // Clean filler words before sending q_text
    const q = cleanQuery(raw);
    const qFinal = q.length >= 2 ? q : raw;

    let cancelled = false;
    setSuggestLoading(true);
    callSuggest(qFinal, MAX_PER_GROUP).then((rows) => {
      if (!cancelled) {
        setSuggestions(rows);
        setSuggestLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Reset active idx when suggestions change
  useEffect(() => { setActiveIdx(-1); }, [suggestions]);

  // ── Click outside closes dropdown ────────────────────────────────────────
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // ── Build grouped + flat lists for rendering & keyboard nav ──────────────
  const grouped: Partial<Record<EntityType, SuggestRow[]>> = {};
  for (const row of suggestions) {
    const t = row.entity_type as EntityType;
    if (TYPE_CONFIG[t]) {
      if (!grouped[t]) grouped[t] = [];
      if (grouped[t]!.length < MAX_PER_GROUP) grouped[t]!.push(row);
    }
  }

  // Pre-compute flat list with stable indices
  const flatSuggestions: SuggestRow[] = GROUP_ORDER.flatMap((t) => grouped[t] ?? []);
  const rowToIdx = new Map<string, number>();
  flatSuggestions.forEach((r, i) => rowToIdx.set(r.item_key, i));

  const showRecent  = isOpen && rawQuery.trim().length === 0 && recentSearches.length > 0;
  const showSuggest = isOpen && rawQuery.trim().length >= 2;
  // Total navigable items: flatSuggestions + "See all" row
  const totalNavItems = flatSuggestions.length + (showSuggest ? 1 : 0);

  // ── Navigate to result ────────────────────────────────────────────────────
  const navigateToItem = useCallback((row: SuggestRow, position: number) => {
    const q = rawQuery.trim();
    void logSearchEvent({
      userId: user?.id ?? null,
      query: q,
      clickedKey: row.item_key,
      position,
      nResults: flatSuggestions.length,
    });
    addRecentSearch(q);
    setIsOpen(false);
    navigate(getItemRoute(row));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery, user, flatSuggestions.length, navigate]);

  // ── Full search ───────────────────────────────────────────────────────────
  const runFullSearch = useCallback(() => {
    const q = rawQuery.trim();
    if (!q) return;
    addRecentSearch(q);
    setIsOpen(false);
    navigate(`/semantic-search?q=${encodeURIComponent(q)}`);
  }, [rawQuery, navigate]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, totalNavItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < flatSuggestions.length) {
        navigateToItem(flatSuggestions[activeIdx], activeIdx);
      } else {
        // "See all" row selected or no selection
        runFullSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [isOpen, activeIdx, totalNavItems, flatSuggestions, navigateToItem, runFullSearch]);

  // ── Dropdown content ──────────────────────────────────────────────────────
  const hasDropdownContent =
    isOpen && (showRecent || (showSuggest && (suggestLoading || flatSuggestions.length > 0 || debouncedQuery.trim().length >= 2)));

  const dropdownContent = (
    <AnimatePresence>
      {hasDropdownContent && (
        <motion.div
          key="dropdown"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.13 }}
          className="absolute top-full mt-2 w-full bg-card border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[72vh] overflow-y-auto"
        >
          {/* ── Recent Searches ─────────────────────────────────────────── */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Recent Searches
                </span>
                <button
                  type="button"
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearRecentSearches();
                    setRecentSearches([]);
                  }}
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              </div>
              {recentSearches.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setRawQuery(q);
                    navigate(`/semantic-search?q=${encodeURIComponent(q)}`);
                    setIsOpen(false);
                  }}
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm">{q}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── Loading skeletons ────────────────────────────────────────── */}
          {showSuggest && suggestLoading && (
            <div className="p-3 space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-0.5">
                  <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Grouped results ──────────────────────────────────────────── */}
          {showSuggest && !suggestLoading && flatSuggestions.length > 0 && (
            <>
              {GROUP_ORDER.map((type) => {
                const rows = grouped[type];
                if (!rows || rows.length === 0) return null;
                const { label, Icon, color, bg } = TYPE_CONFIG[type];
                return (
                  <div key={type}>
                    {/* Group header */}
                    <div className="px-4 py-1.5 bg-muted/20 border-b border-border/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                    </div>
                    {rows.map((row) => {
                      const idx = rowToIdx.get(row.item_key) ?? 0;
                      const isActive = activeIdx === idx;
                      return (
                        <button
                          key={row.item_key}
                          type="button"
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                            isActive ? 'bg-primary/10' : 'hover:bg-muted/40'
                          }`}
                          onMouseDown={(e) => { e.preventDefault(); navigateToItem(row, idx); }}
                          onMouseEnter={() => setActiveIdx(idx)}
                        >
                          <div className={`p-1.5 rounded-lg ${bg} shrink-0`}>
                            <Icon className={`h-3.5 w-3.5 ${color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              <HighlightMatch text={row.display_title} query={rawQuery.trim()} />
                            </div>
                            {row.subtitle && (
                              <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {row.subtitle}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[9px] shrink-0 capitalize px-1.5 py-0 h-4"
                          >
                            {type}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {/* See all results */}
              <button
                type="button"
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 border-t border-border/40 font-semibold text-sm text-primary transition-colors ${
                  activeIdx === flatSuggestions.length ? 'bg-primary/10' : 'hover:bg-primary/5'
                }`}
                onMouseDown={(e) => { e.preventDefault(); runFullSearch(); }}
                onMouseEnter={() => setActiveIdx(flatSuggestions.length)}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  See all results for &ldquo;{rawQuery.trim()}&rdquo;
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </>
          )}

          {/* ── No quick matches ─────────────────────────────────────────── */}
          {showSuggest && !suggestLoading && flatSuggestions.length === 0 && debouncedQuery.trim().length >= 2 && (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground">
                No quick matches — press{' '}
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border">
                  Enter
                </kbd>{' '}
                for full search
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Input + container ─────────────────────────────────────────────────────
  const bar = (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={rawQuery}
          onChange={(e) => {
            setRawQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-28 h-14 text-base rounded-2xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <Button
          type="button"
          onClick={() => { if (rawQuery.trim()) runFullSearch(); }}
          className="absolute right-2 h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
        >
          Search
        </Button>
      </div>
      {dropdownContent}
    </div>
  );

  if (!animate) return bar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {bar}
    </motion.div>
  );
}
