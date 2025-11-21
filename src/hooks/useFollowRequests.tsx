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
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          id,
          requester_id,
          status,
          created_at,
          requester:profiles!follow_requests_requester_id_fkey(user_id, full_name, avatar_url)
        `)
        .eq('requested_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Get sent requests by current user
  const { data: sentRequests, isLoading: isLoadingSent } = useQuery({
    queryKey: ['sentFollowRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          id,
          requested_id,
          status,
          created_at,
          requested:profiles!follow_requests_requested_id_fkey(user_id, full_name, avatar_url)
        `)
        .eq('requester_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
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
