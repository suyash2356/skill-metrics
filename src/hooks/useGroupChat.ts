import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface GroupMember {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  joined_at: string;
}

export interface GroupInfo {
  id: string;
  group_name: string | null;
  group_avatar_url: string | null;
  description: string | null;
  created_by: string | null;
  is_group: boolean;
  members: GroupMember[];
  currentUserRole: string;
}

export function useGroupChat() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const createGroup = useCallback(async (name: string, memberIds: string[], description?: string): Promise<string | null> => {
    if (!user) return null;
    setIsCreating(true);
    try {
      const { data, error } = await supabase.rpc('create_group_conversation', {
        _name: name,
        _member_ids: memberIds,
        _description: description || null,
      });
      if (error) throw error;
      toast.success('Group created!');
      return data as string;
    } catch (err: any) {
      console.error('Error creating group:', err);
      toast.error(err.message || 'Failed to create group');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user]);

  const getGroupInfo = useCallback(async (conversationId: string): Promise<GroupInfo | null> => {
    if (!user) return null;
    try {
      // Get conversation details
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .select('id, group_name, group_avatar_url, description, created_by, is_group')
        .eq('id', conversationId)
        .maybeSingle();

      if (convErr || !conv) return null;

      // Get participants with profiles
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, role, joined_at')
        .eq('conversation_id', conversationId);

      const userIds = (participants || []).map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));

      const members: GroupMember[] = (participants || []).map(p => ({
        user_id: p.user_id,
        full_name: profileMap[p.user_id]?.full_name || 'Unknown',
        avatar_url: profileMap[p.user_id]?.avatar_url || null,
        role: p.role,
        joined_at: p.joined_at,
      }));

      const currentUserRole = (participants || []).find(p => p.user_id === user.id)?.role || 'member';

      return {
        ...conv,
        members,
        currentUserRole,
      };
    } catch (err) {
      console.error('Error fetching group info:', err);
      return null;
    }
  }, [user]);

  const addMember = useCallback(async (conversationId: string, memberId: string) => {
    try {
      const { error } = await supabase.rpc('add_group_member', {
        _conversation_id: conversationId,
        _new_member_id: memberId,
      });
      if (error) throw error;
      toast.success('Member added');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add member');
      throw err;
    }
  }, []);

  const removeMember = useCallback(async (conversationId: string, memberId: string) => {
    try {
      const { error } = await supabase.rpc('remove_group_member', {
        _conversation_id: conversationId,
        _member_id: memberId,
      });
      if (error) throw error;
      toast.success('Member removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove member');
      throw err;
    }
  }, []);

  const leaveGroup = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase.rpc('leave_group', {
        _conversation_id: conversationId,
      });
      if (error) throw error;
      toast.success('You left the group');
    } catch (err: any) {
      toast.error(err.message || 'Failed to leave group');
      throw err;
    }
  }, []);

  const updateGroupSettings = useCallback(async (conversationId: string, settings: { name?: string; description?: string; avatarUrl?: string }) => {
    try {
      const { error } = await supabase.rpc('update_group_settings', {
        _conversation_id: conversationId,
        _name: settings.name || null,
        _description: settings.description || null,
        _avatar_url: settings.avatarUrl || null,
      });
      if (error) throw error;
      toast.success('Group updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update group');
      throw err;
    }
  }, []);

  const toggleAdmin = useCallback(async (conversationId: string, memberId: string) => {
    try {
      const { error } = await supabase.rpc('toggle_group_admin', {
        _conversation_id: conversationId,
        _member_id: memberId,
      });
      if (error) throw error;
      toast.success('Role updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
      throw err;
    }
  }, []);

  return {
    createGroup,
    getGroupInfo,
    addMember,
    removeMember,
    leaveGroup,
    updateGroupSettings,
    toggleAdmin,
    isCreating,
  };
}
