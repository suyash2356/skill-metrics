import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MLRecommendation {
  id: string;
  title: string;
  score: number;
  reason: 'personalized' | 'popular_in_domain' | string;
}

export const useRecommendations = (userId: string | undefined, domain?: string) => {
  return useQuery({
    queryKey: ['ml_recommendations', userId, domain],
    queryFn: async () => {
      if (!userId) return [] as MLRecommendation[];

      const { data, error } = await supabase.rpc('get_recommendations' as any, {
        user_id_input: userId,
        domain_input: domain || null,
      });

      if (error) {
        console.error('Error fetching ML recommendations:', error);
        throw error;
      }

      return (data || []) as unknown as MLRecommendation[];
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
};

/**
 * Logs an "impression" event for each recommendation the first time the user sees it.
 * Used to compute click-through rate for the recommender.
 */
export function useLogImpressions(
  userId: string | undefined,
  recs: MLRecommendation[] | undefined
) {
  const loggedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !recs?.length) return;

    const fresh = recs.filter((r) => !loggedRef.current.has(r.id));
    if (fresh.length === 0) return;

    fresh.forEach((r) => loggedRef.current.add(r.id));

    const rows = fresh.map((r, idx) => ({
      user_id: userId,
      resource_id: r.id,
      event_type: 'impression' as const,
      reason: r.reason,
      rank_position: recs.findIndex((x) => x.id === r.id) + 1,
    }));

    supabase
      .from('recommendation_events' as any)
      .insert(rows)
      .then(({ error }) => {
        if (error) console.warn('impression log failed', error);
      });
  }, [userId, recs]);
}

/**
 * Logs a "click" event when the user opens a recommended item.
 */
export async function logRecommendationClick(
  userId: string,
  rec: MLRecommendation,
  rankPosition: number
) {
  await supabase.from('recommendation_events' as any).insert({
    user_id: userId,
    resource_id: rec.id,
    event_type: 'click',
    reason: rec.reason,
    rank_position: rankPosition,
  });
}
