import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SkillNode {
  id: string;
  name: string;
  domain: string;
  subdomain: string | null;
  description: string | null;
  difficulty_level: string;
  estimated_hours: number;
  content_type: string;
  learning_outcomes: string[];
  display_order: number;
}

export interface SkillDependency {
  id: string;
  skill_id: string;
  prerequisite_id: string;
  dependency_type: string;
}

export interface UserSkillProgress {
  id: string;
  user_id: string;
  skill_node_id: string;
  status: string;
  confidence_level: number;
  started_at: string | null;
  completed_at: string | null;
}

/** Fetch all skill nodes for a domain */
export function useSkillNodes(domain?: string) {
  return useQuery({
    queryKey: ['skill-nodes', domain],
    queryFn: async () => {
      let query = supabase
        .from('skill_nodes' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (domain) {
        query = query.ilike('domain', domain);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as SkillNode[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch skill dependencies for given skill nodes */
export function useSkillDependencies(skillIds?: string[]) {
  return useQuery({
    queryKey: ['skill-dependencies', skillIds],
    queryFn: async () => {
      if (!skillIds?.length) return [];
      const { data, error } = await supabase
        .from('skill_dependencies' as any)
        .select('*')
        .or(`skill_id.in.(${skillIds.join(',')}),prerequisite_id.in.(${skillIds.join(',')})`);
      if (error) throw error;
      return (data || []) as unknown as SkillDependency[];
    },
    enabled: !!skillIds?.length,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch user's skill progress */
export function useUserSkillProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-skill-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_skill_progress' as any)
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []) as unknown as UserSkillProgress[];
    },
    enabled: !!user,
  });
}

/** Update user's skill progress */
export function useUpdateSkillProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillNodeId, status, confidenceLevel }: {
      skillNodeId: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
      confidenceLevel?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const updates: any = {
        user_id: user.id,
        skill_node_id: skillNodeId,
        status,
        confidence_level: confidenceLevel ?? (status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0),
        updated_at: new Date().toISOString(),
      };

      if (status === 'in_progress' && !updates.started_at) {
        updates.started_at = new Date().toISOString();
      }
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_skill_progress' as any)
        .upsert(updates, { onConflict: 'user_id,skill_node_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-skill-progress'] });
    },
  });
}
