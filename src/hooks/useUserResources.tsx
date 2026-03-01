import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface UserResource {
  id: string;
  user_id: string;
  title: string;
  description: string;
  resource_type: string;
  category: string;
  link: string | null;
  file_url: string | null;
  file_type: string | null;
  difficulty: string;
  tags: string[];
  status: string;
  moderation_note: string | null;
  is_active: boolean;
  view_count: number;
  avg_rating: number | null;
  total_ratings: number;
  created_at: string;
  updated_at: string;
}

export const useUserResources = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myResources = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['userResources', 'my', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserResource[];
    },
    enabled: !!user,
  });

  const { data: approvedResources = [], isLoading: isLoadingApproved } = useQuery({
    queryKey: ['userResources', 'approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('avg_rating', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as UserResource[];
    },
  });

  const { data: userPublicResources = [], isLoading: isLoadingUserPublic } = useQuery({
    queryKey: ['userResources', 'public', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserResource[];
    },
    enabled: !!userId,
  });

  const createResource = useMutation({
    mutationFn: async (resource: {
      title: string;
      description: string;
      resource_type: string;
      category: string;
      link?: string;
      file_url?: string;
      file_type?: string;
      difficulty: string;
      tags: string[];
    }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('user_resources')
        .insert({ ...resource, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
      toast({ title: 'Resource submitted for review!' });
    },
    onError: (err: any) => {
      toast({ title: 'Failed to submit resource', description: err.message, variant: 'destructive' });
    },
  });

  const updateResource = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserResource> & { id: string }) => {
      const { error } = await supabase
        .from('user_resources')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
      toast({ title: 'Resource updated' });
    },
    onError: () => {
      toast({ title: 'Failed to update', variant: 'destructive' });
    },
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_resources').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
      toast({ title: 'Resource deleted' });
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const rateResource = useMutation({
    mutationFn: async ({ resourceId, stars }: { resourceId: string; stars: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_resource_ratings')
        .upsert({ user_id: user.id, resource_id: resourceId, stars }, { onConflict: 'user_id,resource_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
      toast({ title: 'Rating submitted' });
    },
  });

  const reportResource = useMutation({
    mutationFn: async ({ resourceId, reason, description }: { resourceId: string; reason: string; description?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_resource_reports')
        .insert({ reporter_id: user.id, resource_id: resourceId, reason, description });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Report submitted. Thank you!' });
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('user-resources').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('user-resources').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    myResources,
    approvedResources,
    userPublicResources,
    isLoadingMy,
    isLoadingApproved,
    isLoadingUserPublic,
    createResource,
    updateResource,
    deleteResource,
    rateResource,
    reportResource,
    uploadFile,
  };
};
