import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityStats(communityId: string | undefined) {
  return useQuery({
    queryKey: ["communityStats", communityId],
    queryFn: async () => {
      if (!communityId) return null;

      // Get member count
      const { count: memberCount } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId);

      // Get resource count (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: recentPosts } = await supabase
        .from("community_resources")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)
        .gte("created_at", weekAgo.toISOString());

      // Get top contributors (most posts in last 30 days)
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const { data: topContributors } = await supabase
        .from("posts")
        .select("user_id, profiles!posts_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .gte("created_at", monthAgo.toISOString());

      // Count posts per user
      const contributorCounts: Record<string, { count: number; profile: any }> = {};
      topContributors?.forEach((post: any) => {
        if (!contributorCounts[post.user_id]) {
          contributorCounts[post.user_id] = { count: 0, profile: post.profiles };
        }
        contributorCounts[post.user_id].count++;
      });

      const topThree = Object.entries(contributorCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 3)
        .map(([userId, data]) => ({
          userId,
          name: data.profile?.full_name || "Unknown",
          avatar: data.profile?.avatar_url,
          postCount: data.count,
        }));

      return {
        memberCount: memberCount || 0,
        recentPosts: recentPosts || 0,
        topContributors: topThree,
      };
    },
    enabled: !!communityId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });
}