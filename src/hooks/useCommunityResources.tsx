import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityResources(communityId?: string) {
  return useQuery({
    queryKey: ['communityResources', communityId],
    queryFn: async () => {
      if (!communityId) return [];
      
      const { data, error } = await supabase
        .from('community_resources')
        .select('*, profiles!community_resources_user_id_fkey(full_name, avatar_url)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}
