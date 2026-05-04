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

/** URL of the local FastAPI ML recommendation server. */
const FASTAPI_URL = 'http://127.0.0.1:8000';

/**
 * Fetches recommendations from the local FastAPI hybrid model, enriches them
 * with full resource details from Supabase, then falls back to the Supabase
 * edge function / RPC chain if the local API is unreachable.
 */
async function fetchHybridRecommendations(
  userId: string,
  opts: { domain?: string | null; surface?: Surface; query?: string | null; limit?: number; resourceType?: string | null },
): Promise<{ items: MLRecommendation[]; meta?: MLRecommendMeta; fallback: boolean }> {
  const limit = opts.limit ?? 12;
  // When filtering by resource type, fetch a larger batch so we have enough after filtering
  const fetchLimit = opts.resourceType ? Math.max(limit * 5, 50) : limit;

  // ── 1. Try local FastAPI ML model ──────────────────────────────────────
  try {
    const res = await fetch(
      `${FASTAPI_URL}/recommend?user_id=0&top_k=${fetchLimit}`,
      { signal: AbortSignal.timeout(5000) }, // 5s timeout
    );
    if (!res.ok) throw new Error(`FastAPI responded ${res.status}`);

    const json = await res.json() as {
      user_id: number;
      recommendations: { title: string; domain: string }[];
    };

    if (!json.recommendations?.length) throw new Error('Empty FastAPI response');

    // Grab the recommended titles so we can look up full resource details
    const titles = json.recommendations.map((r) => r.title);

    // Query Supabase resources table for matching titles
    const { data: resources } = await supabase
      .from('resources')
      .select('id, title, description, link, domain, category, difficulty, resource_type, weighted_rating, total_ratings')
      .in('title', titles);

    // Build a lookup map: title -> resource row
    const resourceMap = new Map<string, any>();
    (resources || []).forEach((r: any) => {
      resourceMap.set(r.title, r);
    });

    // Merge: keep FastAPI ordering, enrich with Supabase details
    const items: MLRecommendation[] = json.recommendations.map((rec, idx) => {
      const dbRow = resourceMap.get(rec.title);
      return {
        id: dbRow?.id ?? `fastapi-${idx}`,
        title: rec.title,
        score: 100 - idx, // higher rank = higher score
        reason: `Recommended in ${rec.domain}`,
        description: dbRow?.description ?? null,
        link: dbRow?.link ?? null,
        category: dbRow?.category ?? null,
        domain: rec.domain,
        difficulty: dbRow?.difficulty ?? null,
        weighted_rating: dbRow?.weighted_rating ?? null,
        total_ratings: dbRow?.total_ratings ?? null,
      };
    });

    // Apply filters: resource type first, then domain
    let filtered = items;
    if (opts.resourceType) {
      filtered = filtered.filter((i) => {
        const dbRow = resourceMap.get(i.title);
        return dbRow?.resource_type?.toLowerCase() === opts.resourceType!.toLowerCase();
      });
    }
    if (opts.domain) {
      const domainFiltered = filtered.filter((i) => i.domain?.toLowerCase() === opts.domain!.toLowerCase());
      if (domainFiltered.length > 0) filtered = domainFiltered;
    }

    return {
      items: (filtered.length > 0 ? filtered : items).slice(0, limit),
      meta: {
        surface: opts.surface ?? 'explore',
        mode: 'hybrid',
        domain: opts.domain ?? null,
        candidate_count: items.length,
      },
      fallback: false,
    };
  } catch (fastApiErr) {
    console.warn('[ml-recommend] FastAPI unavailable, trying Supabase edge fn:', fastApiErr);
  }

  // ── 2. Fallback: Supabase edge function ────────────────────────────────
  try {
    const { data, error } = await supabase.functions.invoke<MLRecommendResponse>(
      'ml-recommend',
      {
        body: {
          domain: opts.domain ?? null,
          surface: opts.surface ?? 'home',
          query: opts.query ?? null,
          limit,
        },
      },
    );

    if (error || !data?.items) throw error ?? new Error('Empty response');
    return { items: data.items, meta: data.meta, fallback: false };
  } catch (edgeFnErr) {
    console.warn('[ml-recommend] edge fn failed, trying RPC:', edgeFnErr);
  }

  // ── 3. Fallback: Supabase RPC ──────────────────────────────────────────
  try {
    const { data, error } = await supabase.rpc('get_recommendations' as any, {
      user_id_input: userId,
      domain_input: opts.domain ?? null,
    });
    if (error) throw error;
    const items = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      score: Number(r.score ?? 0),
      reason: r.reason ?? 'Recommended for you',
    })) as MLRecommendation[];
    return { items, fallback: true };
  } catch (rpcErr) {
    console.error('All recommendation sources failed:', rpcErr);
    return { items: [], fallback: true };
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
  opts: { surface: Surface; domain?: string | null; query?: string | null; limit?: number; resourceType?: string | null } = {
    surface: 'home',
  },
) => {
  return useQuery({
    queryKey: ['ml_recommendations', opts.surface, userId, opts.domain, opts.query, opts.limit, opts.resourceType],
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
