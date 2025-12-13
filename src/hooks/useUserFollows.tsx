import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePostInteractions } from "@/hooks/usePostInteractions";

export function useUserFollows(targetUserId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendFollowRequestNotification } = usePostInteractions();
  const currentUserId = user?.id;

  // Check if currently following
  const { data: isFollowing, isLoading: isLoadingFollowStatus } = useQuery({
    queryKey: ['isFollowing', currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId || currentUserId === targetUserId) return false;
      const { count, error } = await supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId);

      if (error) throw new Error("Failed to fetch follow status");
      return (count || 0) > 0;
    },
    enabled: !!currentUserId && !!targetUserId && currentUserId !== targetUserId,
    staleTime: 1 * 60 * 1000,
  });

  // Check if there's a pending follow request
  const { data: followRequestStatus } = useQuery({
    queryKey: ['followRequestStatus', currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId || currentUserId === targetUserId) return null;
      const { data, error } = await supabase
        .from('follow_requests')
        .select('id, status')
        .eq('requester_id', currentUserId)
        .eq('requested_id', targetUserId)
        .eq('status', 'pending')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentUserId && !!targetUserId && currentUserId !== targetUserId,
    staleTime: 1 * 60 * 1000,
  });

  const [isToggling, setIsToggling] = useState(false);

  const toggleFollow = useCallback(async () => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      toast({ title: "Cannot follow yourself", variant: "destructive" });
      return;
    }

    if (isToggling) return;
    setIsToggling(true);

    try {
      if (isFollowing) {
        // Unfollow - remove from followers
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        if (error) throw error;
        toast({ title: "Unfollowed successfully" });

        queryClient.invalidateQueries({ queryKey: ['isFollowing', currentUserId, targetUserId] });
        queryClient.invalidateQueries({ queryKey: ['followerCount', targetUserId] });
        queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
        queryClient.invalidateQueries({ queryKey: ['personalizedFeed'] });
      } else if (followRequestStatus) {
        // Cancel pending request
        const { error } = await supabase
          .from('follow_requests')
          .delete()
          .eq('id', followRequestStatus.id);

        if (error) throw error;
        toast({ title: "Follow request cancelled" });

        queryClient.invalidateQueries({ queryKey: ['followRequestStatus', currentUserId, targetUserId] });
      } else {
        // Send follow request
        const { error } = await supabase
          .from('follow_requests')
          .insert({
            requester_id: currentUserId,
            requested_id: targetUserId,
            status: 'pending'
          });

        if (error) throw error;

        // Note: Notification is sent via database trigger 'on_new_follow_request'

        toast({ title: "Follow request sent!" });

        queryClient.invalidateQueries({ queryKey: ['followRequestStatus', currentUserId, targetUserId] });
      }
    } catch (e: any) {
      toast({ title: `Failed: ${e.message}`, variant: "destructive" });
    } finally {
      setIsToggling(false);
    }
  }, [currentUserId, targetUserId, isFollowing, followRequestStatus, toast, queryClient, isToggling]);

  // Optionally fetch followers/following counts for a profile
  const { data: followerCount, isLoading: isLoadingFollowerCount } = useQuery({
    queryKey: ['followerCount', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return 0;
      const { count, error } = await supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', targetUserId);
      if (error) throw new Error("Failed to fetch follower count");
      return count || 0;
    },
    enabled: !!targetUserId,
    staleTime: 1 * 60 * 1000,
  });

  const { data: followingCount, isLoading: isLoadingFollowingCount } = useQuery({
    queryKey: ['followingCount', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return 0;
      const { count, error } = await supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);
      if (error) throw new Error("Failed to fetch following count");
      return count || 0;
    },
    enabled: !!targetUserId,
    staleTime: 1 * 60 * 1000,
  });

  // Get button state
  const getFollowButtonState = () => {
    if (isFollowing) return { text: 'Following', variant: 'secondary' as const };
    if (followRequestStatus) return { text: 'Requested', variant: 'outline' as const };
    return { text: 'Follow', variant: 'default' as const };
  };

  return {
    isFollowing: isFollowing || false,
    isLoadingFollowStatus,
    toggleFollow,
    followerCount: followerCount || 0,
    isLoadingFollowerCount,
    followingCount: followingCount || 0,
    isLoadingFollowingCount,
    followRequestStatus,
    getFollowButtonState,
  };
}
