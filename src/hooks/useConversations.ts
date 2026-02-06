import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ConversationWithDetails {
  id: string;
  updated_at: string;
  other_user: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  last_message?: {
    content: string | null;
    sender_id: string;
    created_at: string;
    message_type: string;
    is_deleted: boolean;
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

      // Get conversation details
      const { data: convData } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .in('id', convIds)
        .order('updated_at', { ascending: false });

      if (!convData?.length) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Get other participants
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', convIds)
        .neq('user_id', user.id);

      const otherUserIds = [...new Set((allParticipants || []).map(p => p.user_id))];
      const otherUserMap = Object.fromEntries((allParticipants || []).map(p => [p.conversation_id, p.user_id]));

      // Get profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', otherUserIds);

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));

      // Get last messages
      const convResults: ConversationWithDetails[] = [];

      for (const conv of convData) {
        const otherUserId = otherUserMap[conv.id];
        if (!otherUserId) continue;

        const profile = profileMap[otherUserId] || { user_id: otherUserId, full_name: 'Unknown', avatar_url: null };

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

        convResults.push({
          id: conv.id,
          updated_at: conv.updated_at,
          other_user: profile,
          last_message: lastMsg || undefined,
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
