import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePostInteractions = () => {
  const { user } = useAuth();

  const sendLikeNotification = useCallback(async (postId: string, postOwnerId: string, postTitle: string) => {
    if (!user?.id || user.id === postOwnerId) return;

    try {
      await supabase.rpc('send_like_notification', {
        p_post_id: postId,
        p_post_owner_id: postOwnerId,
        p_post_title: postTitle
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
      await supabase.rpc('send_comment_notification', {
        p_post_id: postId,
        p_post_owner_id: postOwnerId,
        p_post_title: postTitle,
        p_comment_text: commentText
      });
    } catch (error) {
      console.error('Error sending comment notification:', error);
    }
  }, [user]);

  const sendFollowNotification = useCallback(async (followedUserId: string) => {
    if (!user?.id || user.id === followedUserId) return;

    try {
      await supabase.rpc('send_follow_notification', {
        p_followed_user_id: followedUserId
      });
    } catch (error) {
      console.error('Error sending follow notification:', error);
    }
  }, [user]);

  const sendFollowRequestNotification = useCallback(async (requestedUserId: string) => {
    if (!user?.id || user.id === requestedUserId) return;

    try {
      await supabase.rpc('send_follow_request_notification', {
        p_requested_user_id: requestedUserId
      });
    } catch (error) {
      console.error('Error sending follow request notification:', error);
    }
  }, [user]);

  const sendFollowAcceptedNotification = useCallback(async (requesterId: string) => {
    if (!user?.id || user.id === requesterId) return;

    try {
      await supabase.rpc('send_follow_accepted_notification', {
        p_requester_id: requesterId
      });
    } catch (error) {
      console.error('Error sending follow accepted notification:', error);
    }
  }, [user]);

  return {
    sendLikeNotification,
    sendCommentNotification,
    sendFollowNotification,
    sendFollowRequestNotification,
    sendFollowAcceptedNotification
  };
};
