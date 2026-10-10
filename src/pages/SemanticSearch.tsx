/**
 * src/pages/SemanticSearch.tsx
 *
 * Full semantic search page for Skill-Metrics.
 * - Reads ?q= from URL search params.
 * - Encodes query with custom 64-dim FNV-1a encoder (if loaded) or text-only vector.
 * - Calls search_items RPC via callSearchItems.
 * - Displays results grouped or filtered by entity_type.
 * - Clicking a result logs search_event and navigates to the entity page.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageSEO } from '@/components/PageSEO';
import { SemanticSearchBar } from '@/components/SemanticSearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  Search, Cpu, BookOpen, Tag, Compass, FileText,
  ExternalLink, Sparkles, ArrowLeft, Layers,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  callSearchItems,
  SearchRow,
  deduplicateResults,
  getItemRoute,
  logSearchEvent,
} from '@/hooks/useSemanticSearch';
import { loadModel } from '@/lib/skillEncoder';

type EntityTypeFilter = 'all' | 'skill' | 'resource' | 'topic' | 'domain' | 'post';

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  skill: Cpu,
  resource: BookOpen,
  topic: Tag,
  domain: Compass,
  post: FileText,
};

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  skill: { color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  resource: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  topic: { color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
  domain: { color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  post: { color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
};

export default function SemanticSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EntityTypeFilter>('all');

  useEffect(() => {
    // Ensure model is loaded on search page
    loadModel().catch(() => {});
  }, []);

  useEffect(() => {
    async function runSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const rawResults = await callSearchItems(query.trim(), 30);
        const deduped = deduplicateResults(rawResults);
        setResults(deduped);
      } catch (err) {
        console.error('[SemanticSearch] error running search:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    runSearch();
  }, [query]);

  const filteredResults = results.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.entity_type === activeFilter;
  });

  const counts: Record<EntityTypeFilter, number> = {
    all: results.length,
    skill: results.filter((r) => r.entity_type === 'skill').length,
    resource: results.filter((r) => r.entity_type === 'resource').length,
    topic: results.filter((r) => r.entity_type === 'topic').length,
    domain: results.filter((r) => r.entity_type === 'domain').length,
    post: results.filter((r) => r.entity_type === 'post').length,
  };

  const handleResultClick = (row: SearchRow, index: number) => {
    logSearchEvent({
      userId: user?.id ?? null,
      query,
      clickedKey: row.item_key,
      position: index,
      nResults: filteredResults.length,
    });
    navigate(getItemRoute(row));
  };

  return (
    <Layout>
      <PageSEO
        title={query ? `Search results for "${query}"` : 'Semantic Search'}
        description="Search skills, resources, topics, and domains using AI-powered semantic matching."
        path="/semantic-search"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button & Header Search Bar */}
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <SemanticSearchBar animate={false} placeholder="Search skills, topics, resources…" />
            </div>
          </div>

          {/* Search Header Info */}
          {query && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Results for <span className="text-primary font-extrabold">"{query}"</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Found {results.length} semantic {results.length === 1 ? 'match' : 'matches'}
                </p>
              </div>

              {/* Entity Filter Tabs */}
              {results.length > 0 && (
                <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as EntityTypeFilter)}>
                  <TabsList className="bg-muted/60 p-1 rounded-xl flex flex-wrap gap-1">
                    <TabsTrigger value="all" className="text-xs px-3 py-1.5 rounded-lg">
                      All ({counts.all})
                    </TabsTrigger>
                    {counts.skill > 0 && (
                      <TabsTrigger value="skill" className="text-xs px-3 py-1.5 rounded-lg">
                        Skills ({counts.skill})
                      </TabsTrigger>
                    )}
                    {counts.resource > 0 && (
                      <TabsTrigger value="resource" className="text-xs px-3 py-1.5 rounded-lg">
                        Resources ({counts.resource})
                      </TabsTrigger>
                    )}
                    {counts.topic > 0 && (
                      <TabsTrigger value="topic" className="text-xs px-3 py-1.5 rounded-lg">
                        Topics ({counts.topic})
                      </TabsTrigger>
                    )}
                    {counts.domain > 0 && (
                      <TabsTrigger value="domain" className="text-xs px-3 py-1.5 rounded-lg">
                        Domains ({counts.domain})
                      </TabsTrigger>
                    )}
                    {counts.post > 0 && (
                      <TabsTrigger value="post" className="text-xs px-3 py-1.5 rounded-lg">
                        Posts ({counts.post})
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              )}
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query && filteredResults.length === 0 && (
            <div className="text-center py-16 bg-card border border-border/50 rounded-2xl p-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No matching items found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any items matching "{query}". Try checking your spelling or searching for broader terms like "python", "machine learning", or "react".
              </p>
            </div>
          )}

          {/* Empty Query Prompt */}
          {!query && (
            <div className="text-center py-16 bg-card border border-border/50 rounded-2xl p-8">
              <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Semantic AI Search</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Type a query in the search bar above to find relevant skills, learning resources, topics, and domains using vector embeddings.
              </p>
            </div>
          )}

          {/* Results List */}
          {!loading && filteredResults.length > 0 && (
            <div className="space-y-3">
              {filteredResults.map((row, idx) => {
                const IconComponent = TYPE_ICONS[row.entity_type] || Search;
                const typeStyle = TYPE_COLORS[row.entity_type] || { color: 'text-muted-foreground', bg: 'bg-muted' };

                return (
                  <motion.div
                    key={`${row.item_key}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                  >
                    <Card
                      className="group cursor-pointer hover:border-primary/40 hover:shadow-md transition-all border-border/60"
                      onClick={() => handleResultClick(row, idx)}
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-2.5 rounded-xl ${typeStyle.bg} shrink-0 mt-0.5`}>
                          <IconComponent className={`h-5 w-5 ${typeStyle.color}`} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                              {row.display_title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-bold tracking-wider ${typeStyle.color} ${typeStyle.bg}`}
                            >
                              {row.entity_type}
                            </Badge>
                            {row.score > 0 && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                Score: {(row.score * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                          {row.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {row.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Action Link Icon */}
                        <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors pt-1">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
