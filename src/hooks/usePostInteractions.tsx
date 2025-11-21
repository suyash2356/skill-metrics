import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePostInteractions = () => {
  const { user } = useAuth();

  const sendLikeNotification = useCallback(async (postId: string, postOwnerId: string, postTitle: string) => {
    if (!user?.id || user.id === postOwnerId) return;

    try {
      // Get liker's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const likerName = profile?.full_name || 'Someone';

      await supabase.from('notifications').insert({
        user_id: postOwnerId,
        type: 'like',
        title: `${likerName} liked your post`,
        body: postTitle,
        data: { post_id: postId, liker_id: user.id }
      });
    } catch (error) {
      console.error('Error sending like notification:', error);
    }
  }, [user]);

  const sendCommentNotification = useCallback(async (
    postId: string,
    postOwnerId: string,
    postTitle: string,
    commentText: string
  ) => {
    if (!user?.id || user.id === postOwnerId) return;

    try {
      // Get commenter's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const commenterName = profile?.full_name || 'Someone';

      await supabase.from('notifications').insert({
        user_id: postOwnerId,
        type: 'comment',
        title: `${commenterName} commented on your post`,
        body: `"${commentText.slice(0, 100)}${commentText.length > 100 ? '...' : ''}" on "${postTitle}"`,
        data: { post_id: postId, commenter_id: user.id }
      });
    } catch (error) {
      console.error('Error sending comment notification:', error);
    }
  }, [user]);

  return {
    sendLikeNotification,
    sendCommentNotification
  };
};
