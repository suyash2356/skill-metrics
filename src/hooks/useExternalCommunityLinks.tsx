import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ExternalCommunityLink {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  link: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export function useExternalCommunityLinks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['externalCommunityLinks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('external_community_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ExternalCommunityLink[];
    },
    enabled: !!user?.id,
  });

  const addLink = useMutation({
    mutationFn: async (newLink: { name: string; description?: string; link: string; icon?: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from('external_community_links')
        .insert({
          user_id: user.id,
          name: newLink.name,
          description: newLink.description || null,
          link: newLink.link,
          icon: newLink.icon || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalCommunityLinks', user?.id] });
      toast({ title: "Community link added" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add link", description: error.message, variant: "destructive" });
    },
  });

  const updateLink = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; description?: string; link?: string; icon?: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from('external_community_links')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalCommunityLinks', user?.id] });
      toast({ title: "Community link updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update link", description: error.message, variant: "destructive" });
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('external_community_links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalCommunityLinks', user?.id] });
      toast({ title: "Community link removed" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to remove link", description: error.message, variant: "destructive" });
    },
  });

  return {
    links,
    isLoading,
    addLink,
    updateLink,
    deleteLink,
  };
}