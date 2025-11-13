-- ============================================
-- HIGH PRIORITY FIX #1: Remove Conflicting RLS Policies
-- ============================================

-- PROFILES TABLE: Remove conflicting policies, keep only correct ones
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_upsert_own" ON public.profiles;
-- Keep: profiles_select_owner_only, profiles_insert_owner_check, profiles_update_owner_only

-- POSTS TABLE: Remove conflicting policies, keep only correct ones
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
-- Keep: posts_select_owner_only, posts_insert_owner_check, posts_update_owner_only, posts_delete_owner_only

-- Allow everyone to view public posts (not in communities)
CREATE POLICY "Public posts are viewable by everyone"
ON public.posts
FOR SELECT
TO authenticated
USING (community_id IS NULL);

-- COMMENTS TABLE: Remove conflicting policies, keep only correct ones
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
-- Keep: comments_select_owner_or_post_public (already correct)

-- COMMUNITIES TABLE: Remove conflicting policies, keep only correct ones
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Users can create communities" ON public.communities;
-- Keep: communities_select_creator_or_member_only (already correct for private)

-- Allow public communities to be viewable by everyone
CREATE POLICY "Public communities viewable by all"
ON public.communities
FOR SELECT
TO authenticated
USING (is_private = false);


-- ============================================
-- HIGH PRIORITY FIX #2: Restrict User Behavior Data (Bookmarks, Likes, Followers)
-- ============================================

-- BOOKMARKS: Remove public access, restrict to owner only
DROP POLICY IF EXISTS "Bookmarks are viewable by everyone" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can bookmark" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can remove bookmark" ON public.bookmarks;
-- Keep only the secure owner-only policies already in place

-- LIKES: Remove public access, restrict to owner only
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
DROP POLICY IF EXISTS "Users can like" ON public.likes;
DROP POLICY IF EXISTS "Users can unlike" ON public.likes;
-- Keep only the secure owner-only policies already in place

-- FOLLOWERS: Remove public access, restrict to owner only
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.followers;
DROP POLICY IF EXISTS "Users can insert their own follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.followers;
-- Keep only the secure owner-only policies already in place


-- ============================================
-- HIGH PRIORITY FIX #3: Update Database Functions with Immutable search_path
-- ============================================

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Update set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update set_updated_at_profiles function
CREATE OR REPLACE FUNCTION public.set_updated_at_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update create_default_collection function
CREATE OR REPLACE FUNCTION public.create_default_collection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.saved_posts_collections (user_id, name, is_default)
  VALUES (NEW.user_id, 'All', true);
  RETURN NEW;
END;
$$;

-- Update update_session_activity function
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  UPDATE public.user_sessions 
  SET last_activity = NOW() 
  WHERE user_id = NEW.user_id AND is_active = true;
  RETURN NEW;
END;
$$;

-- Update cleanup_old_activity function
CREATE OR REPLACE FUNCTION public.cleanup_old_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  DELETE FROM public.user_activity 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$;

-- Update assign_admin_role_to_creator function
CREATE OR REPLACE FUNCTION public.assign_admin_role_to_creator()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.community_member_roles (community_id, user_id, role, assigned_by)
  VALUES (NEW.id, NEW.created_by, 'admin', NEW.created_by);
  RETURN NEW;
END;
$$;

-- Update assign_member_role_on_join function
CREATE OR REPLACE FUNCTION public.assign_member_role_on_join()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.community_member_roles (community_id, user_id, role)
  VALUES (NEW.community_id, NEW.user_id, 'member')
  ON CONFLICT (community_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Update update_community_leaderboard function
CREATE OR REPLACE FUNCTION public.update_community_leaderboard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.community_leaderboard (user_id, community_id, points, last_update)
  VALUES (NEW.user_id, NEW.community_id, 10, NOW())
  ON CONFLICT (user_id, community_id) 
  DO UPDATE SET 
    points = community_leaderboard.points + 10,
    last_update = NOW();
  RETURN NEW;
END;
$$;

-- Update has_community_role function
CREATE OR REPLACE FUNCTION public.has_community_role(_user_id uuid, _community_id uuid, _role community_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_member_roles
    WHERE user_id = _user_id
    AND community_id = _community_id
    AND role = _role
  )
$$;