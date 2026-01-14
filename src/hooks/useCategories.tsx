import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  type: 'domain' | 'exam';
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

export const useCategories = (type?: 'domain' | 'exam') => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('display_order')
        .order('name');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data as Category[];
    },
    staleTime: 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CategoryInsert) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      toast.success('Category created successfully!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      console.error('Error creating category:', error);
      if (error.code === '23505') {
        toast.error('A category with this name already exists');
      } else {
        toast.error('Failed to create category');
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CategoryUpdate }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      toast.success('Category updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      console.error('Error updating category:', error);
      if (error.code === '23505') {
        toast.error('A category with this name already exists');
      } else {
        toast.error('Failed to update category');
      }
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Category deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. It may have associated resources.');
    },
  });
};
