import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MLRecommendation {
  id: string;
  title: string;
  score: number;
  reason: string;
  reasons?: string[];
  description?: string | null;
  link?: string | null;
  category?: string | null;
  domain?: string | null;
  difficulty?: string | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
}

export interface MLRecommendMeta {
  surface: string;
  mode: 'hybrid' | 'cold_start' | string;
  domain: string | null;
  candidate_count: number;
}

type Surface = 'home' | 'explore' | 'search' | 'skill';

interface MLRecommendResponse {
  items: MLRecommendation[];
  meta?: MLRecommendMeta;
}

/**
 * Calls the ml-recommend edge function (hybrid ranker). Falls back to the
 * `get_recommendations` SQL RPC if the function fails — keeps the UI
 * always populated, even during cold-start or outage scenarios.
 */
async function fetchHybridRecommendations(
  userId: string,
  opts: { domain?: string | null; surface?: Surface; query?: string | null; limit?: number },
): Promise<{ items: MLRecommendation[]; meta?: MLRecommendMeta; fallback: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke<MLRecommendResponse>(
      'ml-recommend',
      {
        body: {
          domain: opts.domain ?? null,
          surface: opts.surface ?? 'home',
          query: opts.query ?? null,
          limit: opts.limit ?? 12,
        },
      },
    );

    if (error || !data?.items) throw error ?? new Error('Empty response');
    return { items: data.items, meta: data.meta, fallback: false };
  } catch (err) {
    console.warn('[ml-recommend] falling back to RPC:', err);
    const { data, error } = await supabase.rpc('get_recommendations' as any, {
      user_id_input: userId,
      domain_input: opts.domain ?? null,
    });
    if (error) {
      console.error('Fallback RPC failed:', error);
      return { items: [], fallback: true };
    }
    const items = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      score: Number(r.score ?? 0),
      reason: r.reason ?? 'Recommended for you',
    })) as MLRecommendation[];
    return { items, fallback: true };
  }
}

/**
 * Skill-page recommendations (legacy entry-point — preserved API).
 */
export const useRecommendations = (userId: string | undefined, domain?: string) => {
  return useQuery({
    queryKey: ['ml_recommendations', 'skill', userId, domain],
    queryFn: async () => {
      if (!userId) return [] as MLRecommendation[];
      const { items } = await fetchHybridRecommendations(userId, {
        domain,
        surface: 'skill',
      });
      return items;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
};

/**
 * Generic hybrid recommendations hook for home / explore / search surfaces.
 */
export const useHybridRecommendations = (
  userId: string | undefined,
  opts: { surface: Surface; domain?: string | null; query?: string | null; limit?: number } = {
    surface: 'home',
  },
) => {
  return useQuery({
    queryKey: ['ml_recommendations', opts.surface, userId, opts.domain, opts.query, opts.limit],
    queryFn: async () => {
      if (!userId) return { items: [] as MLRecommendation[], fallback: false };
      return fetchHybridRecommendations(userId, opts);
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
};

/**
 * Logs an "impression" event for each recommendation the first time the user sees it.
 */
export function useLogImpressions(
  userId: string | undefined,
  recs: MLRecommendation[] | undefined,
  surface: Surface = 'skill',
) {
  const loggedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !recs?.length) return;

    const fresh = recs.filter((r) => !loggedRef.current.has(r.id));
    if (fresh.length === 0) return;
    fresh.forEach((r) => loggedRef.current.add(r.id));

    const rows = fresh.map((r) => ({
      user_id: userId,
      resource_id: r.id,
      event_type: 'impression' as const,
      reason: r.reason,
      surface,
      rank_position: recs.findIndex((x) => x.id === r.id) + 1,
    }));

    supabase
      .from('recommendation_events' as any)
      .insert(rows)
      .then(({ error }) => {
        if (error) console.warn('impression log failed', error);
      });
  }, [userId, recs, surface]);
}

/**
 * Logs a "click" event when the user opens a recommended item.
 */
export async function logRecommendationClick(
  userId: string,
  rec: MLRecommendation,
  rankPosition: number,
  surface: Surface = 'skill',
) {
  await supabase.from('recommendation_events' as any).insert({
    user_id: userId,
    resource_id: rec.id,
    event_type: 'click',
    reason: rec.reason,
    surface,
    rank_position: rankPosition,
  });
}
