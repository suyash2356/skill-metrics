-- Create function to completely delete user account and all related data
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id_to_delete uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to delete their own account
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own account';
  END IF;

  -- Delete all user-related data in the correct order (child tables first)
  DELETE FROM public.bookmarks WHERE user_id = user_id_to_delete;
  DELETE FROM public.comments WHERE user_id = user_id_to_delete;
  DELETE FROM public.likes WHERE user_id = user_id_to_delete;
  DELETE FROM public.saved_posts WHERE user_id = user_id_to_delete;
  DELETE FROM public.saved_posts_collections WHERE user_id = user_id_to_delete;
  DELETE FROM public.followers WHERE follower_id = user_id_to_delete OR following_id = user_id_to_delete;
  DELETE FROM public.notifications WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_activity WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_sessions WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_preferences WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_profile_details WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_member_roles WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_members WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_messages WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_resources WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_questions WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_answers WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_leaderboard WHERE user_id = user_id_to_delete;
  DELETE FROM public.progress_updates WHERE user_id = user_id_to_delete;
  DELETE FROM public.project_team_members WHERE user_id = user_id_to_delete;
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
  DELETE FROM public.community_projects WHERE created_by = user_id_to_delete;
  DELETE FROM public.communities WHERE created_by = user_id_to_delete;
  DELETE FROM public.posts WHERE user_id = user_id_to_delete;
  DELETE FROM public.support_tickets WHERE user_id = user_id_to_delete;
  DELETE FROM public.profiles WHERE user_id = user_id_to_delete;

  -- Delete the auth user (this will cascade to any remaining references)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;