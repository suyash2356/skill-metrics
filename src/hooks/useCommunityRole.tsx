import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useCommunityRole(communityId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["communityRole", communityId, user?.id],
    queryFn: async () => {
      if (!user || !communityId) return null;
      
      const { data, error } = await supabase
        .from("community_member_roles")
        .select("role")
        .eq("community_id", communityId)
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        // User might not have a role yet
        return null;
      }
      
      return data.role;
    },
    enabled: !!user && !!communityId,
  });
}