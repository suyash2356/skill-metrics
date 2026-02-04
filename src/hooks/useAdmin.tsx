import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  difficulty: string;
  is_free: boolean;
  icon: string | null;
  color: string | null;
  related_skills: string[] | null;
  relevant_backgrounds: string[] | null;
  provider: string | null;
  duration: string | null;
  rating: number | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  // New fields
  resource_type: string;
  section_type: string;
  target_countries: string[] | null;
  estimated_time: string | null;
  prerequisites: string[] | null;
  education_levels: string[] | null;
}

export type ResourceInsert = Omit<Resource, 'id' | 'created_at' | 'updated_at'>;
export type ResourceUpdate = Partial<ResourceInsert>;

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .rpc('is_admin', { user_uuid: user.id });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data as boolean;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRegisterFirstAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, email }: { userId: string; email: string }) => {
      const { data, error } = await supabase
        .rpc('register_first_admin', { 
          admin_user_id: userId, 
          admin_email: email 
        });

      if (error) throw error;
      return data as boolean;
    },
    onSuccess: (success) => {
      if (success) {
        toast.success('Admin registered successfully!');
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      } else {
        toast.error('Could not register admin. An admin already exists.');
      }
    },
    onError: (error) => {
      console.error('Error registering admin:', error);
      toast.error('Failed to register admin');
    },
  });
};

export const useResources = (showInactive = false) => {
  return useQuery({
    queryKey: ['adminResources', showInactive],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('category')
        .order('created_at', { ascending: false });

      // For admin view, we need to see all resources including inactive
      // But RLS only allows seeing active ones for regular users
      // Admins can see all through their elevated permissions

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resources:', error);
        throw error;
      }

      return data as Resource[];
    },
    staleTime: 60 * 1000,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: ResourceInsert) => {
      // Use upsert to handle duplicates - skip if already exists
      const { data, error } = await supabase
        .from('resources')
        .upsert(resource, { 
          onConflict: 'title,link,category',
          ignoreDuplicates: true 
        })
        .select()
        .single();

      if (error) {
        // If no rows returned due to duplicate, it's not an error
        if (error.code === 'PGRST116') {
          throw new Error('Resource already exists with same title, link and category');
        }
        throw error;
      }
      return data as Resource;
    },
    onSuccess: () => {
      toast.success('Resource created successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminResources'] });
    },
    onError: (error: Error) => {
      console.error('Error creating resource:', error);
      if (error.message.includes('already exists')) {
        toast.error('Resource already exists');
      } else {
        toast.error('Failed to create resource');
      }
    },
  });
};

// Bulk insert for import - uses upsert to skip duplicates
export const useBulkCreateResources = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resources: ResourceInsert[]) => {
      const BATCH_SIZE = 100;
      const results: Resource[] = [];
      const errors: string[] = [];
      let skippedCount = 0;

      // Process in batches to avoid timeouts
      for (let i = 0; i < resources.length; i += BATCH_SIZE) {
        const batch = resources.slice(i, i + BATCH_SIZE);
        
        // Use upsert with ignoreDuplicates to skip existing resources
        const { data, error } = await supabase
          .from('resources')
          .upsert(batch, { 
            onConflict: 'title,link,category',
            ignoreDuplicates: true 
          })
          .select();

        if (error) {
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
        } else if (data) {
          results.push(...(data as Resource[]));
          // Calculate skipped (batch size - inserted)
          skippedCount += batch.length - data.length;
        }

        // Small delay to prevent overwhelming the database
        if (i + BATCH_SIZE < resources.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      return { inserted: results, errors, skipped: skippedCount };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['adminResources'] });
      if (result.errors.length > 0) {
        console.error('Bulk insert errors:', result.errors);
      }
    },
    onError: (error) => {
      console.error('Error bulk creating resources:', error);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ResourceUpdate }) => {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    },
    onSuccess: () => {
      toast.success('Resource updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminResources'] });
    },
    onError: (error) => {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Resource deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminResources'] });
    },
    onError: (error) => {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    },
  });
};
