import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { encryptMessage, decryptMessage, isEncryptedMessage } from '@/lib/chatCrypto';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: string;
  shared_post_id: string | null;
  shared_resource_id: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to_id: string | null;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  reactions?: MessageReaction[];
  reply_to?: Message | null;
  decryption_failed?: boolean;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

interface UseMessagesOptions {
  privateKey?: JsonWebKey | null;
  userId?: string;
}

export function useMessages(conversationId: string | null, options?: UseMessagesOptions) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  const currentUserId = options?.userId || user?.id;
  const privateKey = options?.privateKey;

  // Decrypt a single message content
  const tryDecrypt = useCallback(async (content: string | null): Promise<{ text: string | null; failed: boolean }> => {
    if (!content || !isEncryptedMessage(content)) {
      return { text: content, failed: false };
    }
    if (!privateKey || !currentUserId) {
      return { text: '🔒 Encrypted message', failed: false };
    }
    try {
      const decrypted = await decryptMessage(content, privateKey, currentUserId);
      return { text: decrypted, failed: false };
    } catch {
      return { text: '🔒 Cannot decrypt (password was reset)', failed: true };
    }
  }, [privateKey, currentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const senderIds = [...new Set((data || []).map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', senderIds);

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));

      // Fetch reactions
      const msgIds = (data || []).map(m => m.id);
      let reactionsMap: Record<string, MessageReaction[]> = {};
      if (msgIds.length > 0) {
        const { data: reactions } = await supabase
          .from('message_reactions')
          .select('*')
          .in('message_id', msgIds);

        (reactions || []).forEach(r => {
          if (!reactionsMap[r.message_id]) reactionsMap[r.message_id] = [];
          reactionsMap[r.message_id].push(r);
        });
      }

      // Build reply map
      const replyIds = (data || []).filter(m => m.reply_to_id).map(m => m.reply_to_id!);
      let replyMap: Record<string, any> = {};
      if (replyIds.length > 0) {
        const { data: replies } = await supabase
          .from('messages')
          .select('id, content, sender_id, is_deleted')
          .in('id', replyIds);
        (replies || []).forEach(r => { replyMap[r.id] = r; });
      }

      // Decrypt all messages
      const msgs: Message[] = await Promise.all(
        (data || []).map(async (m) => {
          const { text: decryptedContent, failed } = await tryDecrypt(m.content);

          // Also try to decrypt reply content
          let replyData = m.reply_to_id ? replyMap[m.reply_to_id] || null : null;
          if (replyData && replyData.content && isEncryptedMessage(replyData.content)) {
            const { text: decryptedReply } = await tryDecrypt(replyData.content);
            replyData = { ...replyData, content: decryptedReply };
          }

          return {
            ...m,
            content: decryptedContent,
            sender_profile: profileMap[m.sender_id] || { full_name: 'Unknown', avatar_url: null },
            reactions: reactionsMap[m.id] || [],
            reply_to: replyData,
            decryption_failed: failed,
          };
        })
      );

      setMessages(msgs);
      messagesRef.current = msgs;

      // Mark as read
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user, tryDecrypt]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        fetchMessages();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_reactions',
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user, fetchMessages]);

  const sendMessage = async (
    content: string,
    messageType = 'text',
    sharedPostId?: string,
    sharedResourceId?: string,
    replyToId?: string,
    encryptionKeys?: {
      senderPublicKey: JsonWebKey;
      recipientPublicKey: JsonWebKey;
      senderId: string;
      recipientId: string;
    }
  ) => {
    if (!conversationId || !user) return;
    setIsSending(true);
    try {
      let finalContent = content;

      // Encrypt if keys are provided and it's a text message
      if (encryptionKeys && messageType === 'text') {
        finalContent = await encryptMessage(
          content,
          encryptionKeys.senderPublicKey,
          encryptionKeys.recipientPublicKey,
          encryptionKeys.senderId,
          encryptionKeys.recipientId
        );
      }

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: finalContent,
        message_type: messageType,
        shared_post_id: sharedPostId || null,
        shared_resource_id: sharedResourceId || null,
        reply_to_id: replyToId || null,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const editMessage = async (
    messageId: string,
    newContent: string,
    encryptionKeys?: {
      senderPublicKey: JsonWebKey;
      recipientPublicKey: JsonWebKey;
      senderId: string;
      recipientId: string;
    }
  ) => {
    if (!user) return;
    try {
      let finalContent = newContent;
      if (encryptionKeys) {
        finalContent = await encryptMessage(
          newContent,
          encryptionKeys.senderPublicKey,
          encryptionKeys.recipientPublicKey,
          encryptionKeys.senderId,
          encryptionKeys.recipientId
        );
      }

      const { error } = await supabase
        .from('messages')
        .update({ content: finalContent, is_edited: true, updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id);
      if (error) throw error;
    } catch (err) {
      console.error('Error editing message:', err);
      throw err;
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true, content: null, updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    try {
      const { data: existing } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
        .maybeSingle();

      if (existing) {
        await supabase.from('message_reactions').delete().eq('id', existing.id);
      } else {
        await supabase.from('message_reactions').insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        });
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    editMessage,
    deleteMessage,
    toggleReaction,
    fetchMessages,
  };
}
