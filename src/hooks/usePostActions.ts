import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePostInteractions } from './usePostInteractions';
import { useToast } from './use-toast';

export const usePostActions = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { sendLikeNotification } = usePostInteractions();

    const toggleLike = async (
        postId: string,
        hasLiked: boolean,
        postOwnerId: string,
        postTitle: string
    ) => {
        if (!user) {
            toast({ title: "Please sign in to like posts", variant: "destructive" });
            return false;
        }

        try {
            if (hasLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .match({ post_id: postId, user_id: user.id });

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .insert({ post_id: postId, user_id: user.id });

                if (error) throw error;

                // Send notification
                if (postOwnerId && postTitle) {
                    sendLikeNotification(postId, postOwnerId, postTitle);
                }
            }
            return true;
        } catch (error) {
            console.error('Error toggling like:', error);
            toast({ title: "Failed to update like", variant: "destructive" });
            return false;
        }
    };

    const toggleBookmark = async (postId: string, hasBookmarked: boolean) => {
        if (!user) {
            toast({ title: "Please sign in to save posts", variant: "destructive" });
            return false;
        }

        try {
            if (hasBookmarked) {
                const { error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .match({ post_id: postId, user_id: user.id });

                if (error) throw error;
                toast({ title: "Removed from saved posts" });
            } else {
                const { error } = await supabase
                    .from('bookmarks')
                    .insert({ post_id: postId, user_id: user.id });

                if (error) throw error;
                toast({ title: "Added to saved posts" });
            }
            return true;
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            toast({ title: "Failed to update bookmark", variant: "destructive" });
            return false;
        }
    };

    return {
        toggleLike,
        toggleBookmark
    };
};
