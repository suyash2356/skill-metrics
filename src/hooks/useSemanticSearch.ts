/**
 * src/hooks/useSemanticSearch.ts
 *
 * Plain async functions (not React hooks) wrapping the Supabase semantic RPCs.
 * Also exports navigation helpers, deduplication, and localStorage recent-searches.
 */

import { supabase } from '@/integrations/supabase/client';
import { encode, isModelLoaded } from '@/lib/skillEncoder';

// ── Types ────────────────────────────────────────────────────────────────────

export interface SuggestRow {
  item_key: string;
  entity_type: 'resource' | 'skill' | 'topic' | 'domain' | 'post';
  entity_id: string;
  display_title: string;
  subtitle: string | null;
}

export interface SearchRow extends SuggestRow {
  score: number;
  dense: number;
  lexical: number;
}

export interface RelatedRow {
  item_key: string;
  entity_type: string;
  display_title: string;
  reason: string;
  score: number;
}

export interface NextStepRow {
  item_key: string;
  display_title: string;
  reason: string;
}

// ── Navigation helper ─────────────────────────────────────────────────────────

/**
 * Convert a search result row to its app route.
 * skill/tag-* → full-text search on /semantic-search
 * topic/domain entity_id is a slug → /skills/<slug>
 * resource entity_id is a UUID  → /resources/<id>?source=resources
 */
export function getItemRoute(
  row: Pick<SuggestRow, 'entity_type' | 'entity_id' | 'display_title'>,
): string {
  const { entity_type, entity_id, display_title } = row;
  switch (entity_type) {
    case 'resource':
      return `/resources/${entity_id}?source=resources`;
    case 'skill':
      if (entity_id.startsWith('tag-')) {
        return `/semantic-search?q=${encodeURIComponent(display_title)}`;
      }
      return `/skills/${encodeURIComponent(display_title)}`;
    case 'topic':
    case 'domain':
      return `/skills/${encodeURIComponent(entity_id)}`;
    case 'post':
      return `/semantic-search?q=${encodeURIComponent(display_title)}`;
    default:
      return `/semantic-search?q=${encodeURIComponent(display_title)}`;
  }
}

// ── RPC wrappers ──────────────────────────────────────────────────────────────

// Bypass TS generated-type constraints for RPCs not yet in types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _rpc = (fn: string, args: Record<string, unknown>) => (supabase as any).rpc(fn, args);

/** Fast autocomplete — no vector needed. Returns up to per_type rows per entity_type. */
export async function callSuggest(qText: string, perType = 4): Promise<SuggestRow[]> {
  if (!qText || qText.length < 2) return [];
  try {
    const { data, error } = await _rpc('suggest', { q_text: qText, per_type: perType });
    if (error) { console.warn('[suggest]', error.message); return []; }
    return (data as SuggestRow[]) ?? [];
  } catch (e) {
    console.warn('[suggest] exception', e);
    return [];
  }
}

/**
 * Full semantic search with vector + lexical scoring.
 * Uses the loaded encoder if available, falls back to zero-vector (text-only mode).
 */
export async function callSearchItems(
  qText: string,
  pK = 20,
  types: string[] | null = null,
): Promise<SearchRow[]> {
  if (!qText || qText.length < 2) return [];

  let qVecJson: string;
  if (isModelLoaded()) {
    try {
      qVecJson = JSON.stringify(Array.from(encode(qText)));
    } catch {
      qVecJson = JSON.stringify(new Array(64).fill(0));
    }
  } else {
    qVecJson = JSON.stringify(new Array(64).fill(0));
  }

  const params: Record<string, unknown> = {
    q_text: qText,
    q_vec: qVecJson,
    p_k: pK,
  };
  if (types && types.length > 0) params.types = types;

  try {
    const { data, error } = await _rpc('search_items', params);
    if (error) { console.warn('[search_items]', error.message); return []; }
    return (data as SearchRow[]) ?? [];
  } catch (e) {
    console.warn('[search_items] exception', e);
    return [];
  }
}

/** Items semantically related to p_key, sorted by score. */
export async function callRelatedItems(pKey: string, pK = 8): Promise<RelatedRow[]> {
  if (!pKey) return [];
  const keysToTry = Array.from(new Set([
    pKey,
    pKey.replace(/-/g, ' '),
    pKey.replace(/\s+/g, '-'),
    pKey.startsWith('skill:') ? pKey.replace(/^skill:/, 'domain:') : pKey.replace(/^domain:/, 'skill:'),
    pKey.startsWith('skill:') ? pKey.replace(/^skill:/, 'domain:').replace(/-/g, ' ') : pKey.replace(/^domain:/, 'skill:').replace(/-/g, ' '),
  ]));

  for (const key of keysToTry) {
    try {
      const { data, error } = await _rpc('related_items', { p_key: key, p_k: pK });
      if (!error && data && (data as RelatedRow[]).length > 0) {
        return data as RelatedRow[];
      }
    } catch (e) {
      console.warn('[related_items] exception for key:', key, e);
    }
  }
  return [];
}

/** Recommended next steps after p_key (for skills). */
export async function callNextSteps(pKey: string, pK = 5): Promise<NextStepRow[]> {
  if (!pKey) return [];
  const keysToTry = Array.from(new Set([
    pKey,
    pKey.replace(/-/g, ' '),
    pKey.replace(/\s+/g, '-'),
    pKey.startsWith('skill:') ? pKey.replace(/^skill:/, 'domain:') : pKey.replace(/^domain:/, 'skill:'),
    pKey.startsWith('skill:') ? pKey.replace(/^skill:/, 'domain:').replace(/-/g, ' ') : pKey.replace(/^domain:/, 'skill:').replace(/-/g, ' '),
  ]));

  for (const key of keysToTry) {
    try {
      const { data, error } = await _rpc('next_steps', { p_key: key, p_k: pK });
      if (!error && data && (data as NextStepRow[]).length > 0) {
        return data as NextStepRow[];
      }
    } catch (e) {
      console.warn('[next_steps] exception for key:', key, e);
    }
  }
  return [];
}

// ── Event logging ─────────────────────────────────────────────────────────────

/** Insert into search_events. Errors are swallowed — logging must never block navigation. */
export async function logSearchEvent(params: {
  userId: string | null;
  query: string;
  clickedKey: string;
  position: number;
  nResults: number;
}): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('search_events').insert({
      user_id: params.userId ?? null,
      query: params.query,
      clicked_key: params.clickedKey,
      position: params.position,
      n_results: params.nResults,
    });
  } catch (e) {
    console.warn('[search_events] log failed (non-blocking)', e);
  }
}

// ── Recent searches (localStorage, per-device) ────────────────────────────────

const RECENT_KEY = 'sm:recent_searches_v1';

export function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(q: string): void {
  if (!q.trim()) return;
  try {
    const prev = getRecentSearches();
    const next = [q.trim(), ...prev.filter((s) => s !== q.trim())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

export function clearRecentSearches(): void {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/** Keep the highest-score row per (entity_type, lowercased display_title) pair. */
export function deduplicateResults(rows: SearchRow[]): SearchRow[] {
  const seen = new Map<string, SearchRow>();
  for (const row of rows) {
    const key = `${row.entity_type}:${row.display_title.toLowerCase().trim()}`;
    const prev = seen.get(key);
    if (!prev || row.score > prev.score) seen.set(key, row);
  }
  return Array.from(seen.values());
}
