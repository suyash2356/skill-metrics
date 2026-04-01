import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ConversationWithDetails {
  id: string;
  updated_at: string;
  is_group: boolean;
  group_name: string | null;
  group_avatar_url: string | null;
  other_user: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  group_members?: {
    user_id: string;
    full_name: string | null;
  }[];
  last_message?: {
    content: string | null;
    sender_id: string;
    created_at: string;
    message_type: string;
    is_deleted: boolean;
    sender_name?: string | null;
  };
  unread_count: number;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Get all conversations the user participates in
      const { data: participations, error: pError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, last_read_at')
        .eq('user_id', user.id);

      if (pError || !participations?.length) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      const convIds = participations.map(p => p.conversation_id);
      const lastReadMap = Object.fromEntries(participations.map(p => [p.conversation_id, p.last_read_at]));

      // Get conversation details including group fields
      const { data: convData } = await supabase
        .from('conversations')
        .select('id, updated_at, is_group, group_name, group_avatar_url')
        .in('id', convIds)
        .order('updated_at', { ascending: false });

      if (!convData?.length) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Get ALL participants for these conversations
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', convIds);

      // Collect all other user IDs
      const otherUserIds = [...new Set(
        (allParticipants || [])
          .filter(p => p.user_id !== user.id)
          .map(p => p.user_id)
      )];

      // Get profiles for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', otherUserIds.length > 0 ? otherUserIds : ['00000000-0000-0000-0000-000000000000']);

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));

      // Group participants by conversation
      const convParticipantsMap: Record<string, string[]> = {};
      (allParticipants || []).forEach(p => {
        if (p.user_id !== user.id) {
          if (!convParticipantsMap[p.conversation_id]) convParticipantsMap[p.conversation_id] = [];
          convParticipantsMap[p.conversation_id].push(p.user_id);
        }
      });

      // Get last messages
      const convResults: ConversationWithDetails[] = [];

      for (const conv of convData) {
        const otherIds = convParticipantsMap[conv.id] || [];
        const firstOtherId = otherIds[0];

        // For 1:1, get the other user. For groups, we use group info.
        const otherProfile = firstOtherId
          ? profileMap[firstOtherId] || { user_id: firstOtherId, full_name: 'Unknown', avatar_url: null }
          : { user_id: '', full_name: 'Unknown', avatar_url: null };

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, sender_id, created_at, message_type, is_deleted')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Count unread
        const lastRead = lastReadMap[conv.id];
        let unread = 0;
        if (lastRead) {
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .gt('created_at', lastRead);
          unread = count || 0;
        }

        // For groups, get sender name on last message
        let senderName: string | null = null;
        if (conv.is_group && lastMsg) {
          if (lastMsg.sender_id === user.id) {
            senderName = 'You';
          } else {
            senderName = profileMap[lastMsg.sender_id]?.full_name || 'Someone';
          }
        }

        convResults.push({
          id: conv.id,
          updated_at: conv.updated_at,
          is_group: conv.is_group || false,
          group_name: conv.group_name,
          group_avatar_url: conv.group_avatar_url,
          other_user: otherProfile,
          group_members: conv.is_group
            ? otherIds.map(id => ({
                user_id: id,
                full_name: profileMap[id]?.full_name || 'Unknown',
              }))
            : undefined,
          last_message: lastMsg
            ? { ...lastMsg, sender_name: senderName }
            : undefined,
          unread_count: unread,
        });
      }

      setConversations(convResults);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  const startConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.rpc('find_or_create_conversation', {
        _user1: user.id,
        _user2: otherUserId,
      });
      if (error) throw error;
      return data as string;
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      throw err;
    }
  };

  return { conversations, isLoading, fetchConversations, startConversation };
}
