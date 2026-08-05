import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { RecentActivity } from '@/lib/personalization';

/**
 * Recent activity for personalization, read from the unified
 * `interaction_events` spine (Zone C) rather than the retired
 * `user_activity` table.
 */
export const useRecentActivity = (limit: number = 50) => {
  const { user } = useAuth();

  const { data: recentActivity, isLoading } = useQuery<RecentActivity[]>({
    queryKey: ['recentActivity', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await (supabase as any)
        .from('interaction_events')
        .select('event_type, subject_type, subject_id, context, occurred_at')
        .eq('user_id', user.id)
        .order('occurred_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        activity_type: item.event_type,
        metadata: {
          ...(item.context ?? {}),
          subject_type: item.subject_type,
          subject_id: item.subject_id,
        } as Record<string, any>,
        created_at: item.occurred_at,
        post_id: item.subject_type === 'post' ? item.subject_id ?? undefined : undefined,
        roadmap_id:
          item.subject_type === 'roadmap' ? item.subject_id ?? undefined : undefined,
      }));
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    recentActivity: recentActivity || [],
    isLoading,
  };
};
