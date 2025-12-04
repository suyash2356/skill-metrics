import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePostInteractions = () => {
  const { user } = useAuth();

  const getProfileName = useCallback(async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .maybeSingle();
    return profile?.full_name || 'Someone';
  }, []);

  const sendLikeNotification = useCallback(async (postId: string, postOwnerId: string, postTitle: string) => {
    if (!user?.id || user.id === postOwnerId) return;

    try {
      const likerName = await getProfileName(user.id);
      await supabase.from('notifications').insert({
        user_id: postOwnerId,
        type: 'like',
        title: `${likerName} liked your post`,
        body: postTitle
      });
    } catch (error) {
      console.error('Error sending like notification:', error);
    }
  }, [user, getProfileName]);

  const sendCommentNotification = useCallback(async (
    postId: string,
    postOwnerId: string,
    postTitle: string,
    commentText: string
  ) => {
    if (!user?.id || user.id === postOwnerId) return;

    try {
      const commenterName = await getProfileName(user.id);
      await supabase.from('notifications').insert({
        user_id: postOwnerId,
        type: 'comment',
        title: `${commenterName} commented on your post`,
        body: `"${commentText.slice(0, 100)}${commentText.length > 100 ? '...' : ''}" on "${postTitle}"`
      });
    } catch (error) {
      console.error('Error sending comment notification:', error);
    }
  }, [user, getProfileName]);

  const sendFollowNotification = useCallback(async (followedUserId: string) => {
    if (!user?.id || user.id === followedUserId) return;

    try {
      const followerName = await getProfileName(user.id);
      await supabase.from('notifications').insert({
        user_id: followedUserId,
        type: 'follow',
        title: `${followerName} started following you`,
        body: 'You have a new follower!'
      });
    } catch (error) {
      console.error('Error sending follow notification:', error);
    }
  }, [user, getProfileName]);

  const sendFollowRequestNotification = useCallback(async (requestedUserId: string) => {
    if (!user?.id || user.id === requestedUserId) return;

    try {
      const requesterName = await getProfileName(user.id);
      await supabase.from('notifications').insert({
        user_id: requestedUserId,
        type: 'follow_request',
        title: `${requesterName} wants to follow you`,
        body: 'You have a new follow request'
      });
    } catch (error) {
      console.error('Error sending follow request notification:', error);
    }
  }, [user, getProfileName]);

  const sendFollowAcceptedNotification = useCallback(async (requesterId: string) => {
    if (!user?.id || user.id === requesterId) return;

    try {
      const accepterName = await getProfileName(user.id);
      await supabase.from('notifications').insert({
        user_id: requesterId,
        type: 'follow_accepted',
        title: `${accepterName} accepted your follow request`,
        body: 'You can now see their posts'
      });
    } catch (error) {
      console.error('Error sending follow accepted notification:', error);
    }
  }, [user, getProfileName]);

  return {
    sendLikeNotification,
    sendCommentNotification,
    sendFollowNotification,
    sendFollowRequestNotification,
    sendFollowAcceptedNotification
  };
};
