import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MLRecommendation {
  id: string;
  title: string;
  score: number;
}

export const useRecommendations = (userId: string | undefined, domain?: string) => {
  return useQuery({
    queryKey: ['ml_recommendations', userId, domain],
    queryFn: async () => {
      if (!userId) return [];

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
  });
};
