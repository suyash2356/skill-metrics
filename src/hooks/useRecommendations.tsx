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
 * Fetches hybrid recommendations from the `ml-recommend` Supabase edge
 * function. Candidate resources are sourced from the admin-managed
 * `resources` table (NOT the legacy parquet/FastAPI dataset) so admins can
 * curate what the model recommends.
 *
 * Behavior contract (per product spec):
 *  - Explore page tabs (degree / certification / resource): pass
 *    `ignoreDomain: true` so the model considers ALL admin-curated domains
 *    together, then filters by `resourceType`.
 *  - Skill-graph / SkillRecommendations: pass the searched `domain` so we
 *    only feed admin resources from that domain into the model.
 */
async function fetchHybridRecommendations(
  userId: string,
  opts: {
    domain?: string | null;
    surface?: Surface;
    query?: string | null;
    limit?: number;
    resourceType?: string | null;
    resourceTypes?: string[] | null;
    ignoreDomain?: boolean;
  },
): Promise<{ items: MLRecommendation[]; meta?: MLRecommendMeta; fallback: boolean }> {
  const limit = opts.limit ?? 12;

  // ── Primary: ml-recommend edge function (admin resources) ──────────────
  try {
    const { data, error } = await supabase.functions.invoke<MLRecommendResponse>(
      'ml-recommend',
      {
        body: {
          domain: opts.domain ?? null,
          surface: opts.surface ?? 'home',
          query: opts.query ?? null,
          limit,
          resource_type: opts.resourceType ?? null,
          resource_types: opts.resourceTypes ?? null,
          ignore_domain: !!opts.ignoreDomain,
        },
      },
    );
    if (error || !data?.items) throw error ?? new Error('Empty response');
    return { items: data.items.slice(0, limit), meta: data.meta, fallback: false };
  } catch (edgeFnErr) {
    console.warn('[ml-recommend] edge fn failed, trying RPC:', edgeFnErr);
  }

  // ── Fallback: Supabase RPC (admin `resources` based) ───────────────────
  try {
    const { data, error } = await supabase.rpc('get_recommendations' as any, {
      user_id_input: userId,
      domain_input: opts.ignoreDomain ? null : (opts.domain ?? null),
    });
    if (error) throw error;
    const items = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      score: Number(r.score ?? 0),
      reason: r.reason ?? 'Recommended for you',
    })) as MLRecommendation[];
    return { items: items.slice(0, limit), fallback: true };
  } catch (rpcErr) {
    console.error('All recommendation sources failed:', rpcErr);
    return { items: [], fallback: true };
  }
}

/**
 * Skill-page recommendations — domain-scoped (uses admin resources for the
 * specific domain the user searched in skill graph).
 */
export const useRecommendations = (userId: string | undefined, domain?: string) => {
  return useQuery({
    queryKey: ['ml_recommendations', 'skill', userId, domain],
    queryFn: async () => {
      if (!userId) return [] as MLRecommendation[];
      const { items } = await fetchHybridRecommendations(userId, {
        domain,
        surface: 'skill',
        ignoreDomain: false, // skill graph: domain-specific admin resources
      });
      return items;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
};

/**
 * Generic hybrid recommendations hook for home / explore / search surfaces.
 * For explore tabs, callers should pass `ignoreDomain: true` to feed the
 * model with all admin-curated domains together.
 */
export const useHybridRecommendations = (
  userId: string | undefined,
  opts: {
    surface: Surface;
    domain?: string | null;
    query?: string | null;
    limit?: number;
    resourceType?: string | null;
    resourceTypes?: string[] | null;
    ignoreDomain?: boolean;
  } = { surface: 'home' },
) => {
  return useQuery({
    queryKey: [
      'ml_recommendations',
      opts.surface,
      userId,
      opts.domain,
      opts.query,
      opts.limit,
      opts.resourceType,
      (opts.resourceTypes ?? []).join(','),
      opts.ignoreDomain,
    ],
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
