import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { RecentActivity } from '@/lib/personalization';

/**
 * Hook to fetch user's recent activity for personalization
 */
export const useRecentActivity = (limit: number = 50) => {
  const { user } = useAuth();

  const { data: recentActivity, isLoading } = useQuery<RecentActivity[]>({
    queryKey: ['recentActivity', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_activity')
        .select('activity_type, metadata, created_at, post_id, roadmap_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }

      return (data || []).map(item => ({
        activity_type: item.activity_type,
        metadata: item.metadata as Record<string, any> | undefined,
        created_at: item.created_at,
        post_id: item.post_id || undefined,
        roadmap_id: item.roadmap_id || undefined,
      }));
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    recentActivity: recentActivity || [],
    isLoading,
  };
};
