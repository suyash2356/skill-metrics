import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export function useFollowRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all pending requests received by current user
  const { data: pendingRequests, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingFollowRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch follow requests
      const { data: requests, error: requestsError } = await supabase
        .from('follow_requests')
        .select('id, requester_id, status, created_at')
        .eq('requested_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      if (!requests || requests.length === 0) return [];

      // Fetch profiles for all requesters
      const requesterIds = requests.map(r => r.requester_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', requesterIds);
      
      if (profilesError) throw profilesError;

      // Combine data
      return requests.map(request => ({
        ...request,
        requester: profiles?.find(p => p.user_id === request.requester_id) || null
      }));
    },
    enabled: !!user?.id,
  });

  // Get sent requests by current user
  const { data: sentRequests, isLoading: isLoadingSent } = useQuery({
    queryKey: ['sentFollowRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch follow requests
      const { data: requests, error: requestsError } = await supabase
        .from('follow_requests')
        .select('id, requested_id, status, created_at')
        .eq('requester_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      if (!requests || requests.length === 0) return [];

      // Fetch profiles for all requested users
      const requestedIds = requests.map(r => r.requested_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', requestedIds);
      
      if (profilesError) throw profilesError;

      // Combine data
      return requests.map(request => ({
        ...request,
        requested: profiles?.find(p => p.user_id === request.requested_id) || null
      }));
    },
    enabled: !!user?.id,
  });

  const acceptRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('follow_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('requested_id', user.id);

      if (error) throw error;

      toast({ title: "Follow request accepted!" });
      queryClient.invalidateQueries({ queryKey: ['pendingFollowRequests', user.id] });
      queryClient.invalidateQueries({ queryKey: ['followerCount'] });
    } catch (error: any) {
      toast({ title: "Failed to accept request", description: error.message, variant: "destructive" });
    }
  }, [user?.id, toast, queryClient]);

  const rejectRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('follow_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('requested_id', user.id);

      if (error) throw error;

      toast({ title: "Follow request rejected" });
      queryClient.invalidateQueries({ queryKey: ['pendingFollowRequests', user.id] });
    } catch (error: any) {
      toast({ title: "Failed to reject request", description: error.message, variant: "destructive" });
    }
  }, [user?.id, toast, queryClient]);

  const cancelRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('follow_requests')
        .delete()
        .eq('id', requestId)
        .eq('requester_id', user.id);

      if (error) throw error;

      toast({ title: "Follow request cancelled" });
      queryClient.invalidateQueries({ queryKey: ['sentFollowRequests', user.id] });
      queryClient.invalidateQueries({ queryKey: ['followRequestStatus'] });
    } catch (error: any) {
      toast({ title: "Failed to cancel request", description: error.message, variant: "destructive" });
    }
  }, [user?.id, toast, queryClient]);

  return {
    pendingRequests: pendingRequests || [],
    sentRequests: sentRequests || [],
    isLoadingPending,
    isLoadingSent,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  };
}
