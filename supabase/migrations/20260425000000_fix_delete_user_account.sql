-- ============================================
-- Fix delete_user_account function
-- Removes references to dropped tables:
--   community_member_roles, community_members, community_messages,
--   community_resources, community_questions, community_answers,
--   community_leaderboard, progress_updates, project_team_members,
--   community_projects, communities, support_tickets
-- Adds cleanup for newer tables:
--   external_community_links, conversations/messages, resources,
--   focus_sessions, learning_streaks, user_skill_progress,
--   user_encryption_keys, resource_ratings/reviews/votes
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_user_account(user_id_to_delete uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only allow users to delete their own account
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own account';
  END IF;

  -- Delete all user-related data in the correct order (child tables first)

  -- Social / interaction data
  DELETE FROM public.bookmarks WHERE user_id = user_id_to_delete;
  DELETE FROM public.comments WHERE user_id = user_id_to_delete;
  DELETE FROM public.likes WHERE user_id = user_id_to_delete;
  DELETE FROM public.saved_posts WHERE user_id = user_id_to_delete;
  DELETE FROM public.saved_posts_collections WHERE user_id = user_id_to_delete;
  DELETE FROM public.followers WHERE follower_id = user_id_to_delete OR following_id = user_id_to_delete;
  DELETE FROM public.notifications WHERE user_id = user_id_to_delete;

  -- Activity & session tracking
  DELETE FROM public.user_activity WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_sessions WHERE user_id = user_id_to_delete;

  -- User preferences & profile
  DELETE FROM public.user_preferences WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_profile_details WHERE user_id = user_id_to_delete;

  -- External community links (replaced old community tables)
  DELETE FROM public.external_community_links WHERE user_id = user_id_to_delete;

  -- Chat / messaging data
  DELETE FROM public.message_reactions WHERE message_id IN (
    SELECT id FROM public.messages WHERE sender_id = user_id_to_delete
  );
  DELETE FROM public.messages WHERE sender_id = user_id_to_delete;
  DELETE FROM public.conversation_participants WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_encryption_keys WHERE user_id = user_id_to_delete;
  DELETE FROM public.chat_password_otps WHERE user_id = user_id_to_delete;

  -- Resource ratings & reviews
  DELETE FROM public.resource_review_helpful WHERE user_id = user_id_to_delete;
  DELETE FROM public.resource_reviews WHERE user_id = user_id_to_delete;
  DELETE FROM public.resource_ratings WHERE user_id = user_id_to_delete;
  DELETE FROM public.resource_votes WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_resource_ratings WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_resource_reports WHERE reporter_id = user_id_to_delete;
  DELETE FROM public.user_resources WHERE user_id = user_id_to_delete;

  -- Focus sessions & learning streaks
  DELETE FROM public.focus_sessions WHERE user_id = user_id_to_delete;
  DELETE FROM public.learning_streaks WHERE user_id = user_id_to_delete;

  -- Skill progress
  DELETE FROM public.user_skill_progress WHERE user_id = user_id_to_delete;

  -- Roadmaps (child tables first)
  DELETE FROM public.roadmap_step_resources WHERE step_id IN (
    SELECT s.id FROM public.roadmap_steps s
    JOIN public.roadmaps r ON r.id = s.roadmap_id
    WHERE r.user_id = user_id_to_delete
  );
  DELETE FROM public.roadmap_steps WHERE roadmap_id IN (
    SELECT id FROM public.roadmaps WHERE user_id = user_id_to_delete
  );
  DELETE FROM public.roadmap_skills WHERE roadmap_id IN (
    SELECT id FROM public.roadmaps WHERE user_id = user_id_to_delete
  );
  DELETE FROM public.roadmap_templates WHERE user_id = user_id_to_delete;
  DELETE FROM public.roadmaps WHERE user_id = user_id_to_delete;

  -- Posts
  DELETE FROM public.posts WHERE user_id = user_id_to_delete;

  -- Profile
  DELETE FROM public.profiles WHERE user_id = user_id_to_delete;

  -- Delete the auth user (this will cascade to any remaining references)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;
