-- ============================================
-- Fix Remaining Functions with Immutable search_path
-- ============================================

-- Update delete_user_account function
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

-- Update migrate_profile_data function
CREATE OR REPLACE FUNCTION public.migrate_profile_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT user_id, bio, location, title, avatar_url, full_name
    FROM public.profiles 
    WHERE bio IS NOT NULL OR location IS NOT NULL OR title IS NOT NULL
  LOOP
    INSERT INTO public.user_profile_details (
      user_id, bio, location, job_title, updated_at
    ) VALUES (
      profile_record.user_id,
      profile_record.bio,
      profile_record.location,
      profile_record.title,
      NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      bio = COALESCE(EXCLUDED.bio, user_profile_details.bio),
      location = COALESCE(EXCLUDED.location, user_profile_details.location),
      job_title = COALESCE(EXCLUDED.job_title, user_profile_details.job_title),
      updated_at = NOW();
  END LOOP;
  
  RAISE NOTICE 'Profile data migration completed';
END;
$$;

-- Update create_default_collections_for_existing_users function
CREATE OR REPLACE FUNCTION public.create_default_collections_for_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.profiles
  LOOP
    INSERT INTO public.saved_posts_collections (user_id, name, is_default)
    VALUES (user_record.user_id, 'All', true)
    ON CONFLICT (user_id, name) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Default collections created for existing users';
END;
$$;

-- Update create_default_preferences_for_existing_users function
CREATE OR REPLACE FUNCTION public.create_default_preferences_for_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.profiles
  LOOP
    INSERT INTO public.user_preferences (user_id)
    VALUES (user_record.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Default preferences created for existing users';
END;
$$;

-- Update community_messages_broadcast_trigger function
CREATE OR REPLACE FUNCTION public.community_messages_broadcast_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'community:' || COALESCE(NEW.community_id, OLD.community_id)::text || ':messages',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    to_jsonb(NEW),
    to_jsonb(OLD)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Update community_messages_summary_sync function
CREATE OR REPLACE FUNCTION public.community_messages_summary_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.community_messages_summary (id, community_id, user_id, excerpt, created_at)
    VALUES (NEW.id, NEW.community_id, NEW.user_id, LEFT(NEW.content, 300), NEW.created_at);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.community_messages_summary
    SET community_id = NEW.community_id,
        user_id = NEW.user_id,
        excerpt = LEFT(NEW.content, 300),
        created_at = NEW.created_at
    WHERE id = NEW.id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.community_messages_summary WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;