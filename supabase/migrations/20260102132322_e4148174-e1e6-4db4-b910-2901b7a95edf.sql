-- =============================================
-- Instagram-Style Privacy System - Fix RLS
-- =============================================

-- 1. Drop overly permissive policies that bypass privacy
DROP POLICY IF EXISTS "Authenticated users can view profile details" ON public.user_profile_details;
DROP POLICY IF EXISTS "Users can view own profile details only" ON public.user_profile_details;
DROP POLICY IF EXISTS "user_profile_details_select_owner_only" ON public.user_profile_details;

-- 2. Update can_view_profile function to be more robust
CREATE OR REPLACE FUNCTION public.can_view_profile(_viewer_id uuid, _profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Owner can always view their own profile
    _viewer_id = _profile_user_id
    OR
    -- If viewer is null (unauthenticated), can only view public profiles
    (_viewer_id IS NULL AND (
      SELECT COALESCE(profile_visibility, 'public') = 'public' 
      FROM user_preferences 
      WHERE user_id = _profile_user_id
    ))
    OR
    -- Check if profile is public
    (
      SELECT COALESCE(profile_visibility, 'public') = 'public'
      FROM user_preferences 
      WHERE user_id = _profile_user_id
    )
    OR
    -- Check if viewer is an accepted follower
    EXISTS (
      SELECT 1 FROM followers 
      WHERE follower_id = _viewer_id 
      AND following_id = _profile_user_id 
      AND status = 'accepted'
    )
$$;

-- 3. Create function to get basic profile info (always accessible) 
-- This bypasses RLS for minimal public info
CREATE OR REPLACE FUNCTION public.get_basic_profile_info(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'user_id', p.user_id,
    'full_name', p.full_name,
    'avatar_url', p.avatar_url,
    'is_private', COALESCE(
      (SELECT profile_visibility = 'private' FROM user_preferences WHERE user_id = target_user_id),
      false
    )
  ) INTO result
  FROM profiles p
  WHERE p.user_id = target_user_id;
  
  RETURN COALESCE(result, jsonb_build_object(
    'user_id', target_user_id,
    'full_name', 'Anonymous',
    'avatar_url', null,
    'is_private', false
  ));
END;
$$;

-- 4. Create function to get post author info respecting privacy
CREATE OR REPLACE FUNCTION public.get_post_author_info(_viewer_id uuid, _author_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
  can_view boolean;
BEGIN
  -- Check if viewer can see this profile
  can_view := can_view_profile(_viewer_id, _author_id);
  
  IF can_view THEN
    SELECT jsonb_build_object(
      'full_name', p.full_name,
      'avatar_url', p.avatar_url,
      'title', p.title
    ) INTO result
    FROM profiles p
    WHERE p.user_id = _author_id;
    
    RETURN COALESCE(result, jsonb_build_object(
      'full_name', 'Anonymous',
      'avatar_url', null,
      'title', null
    ));
  ELSE
    -- Private account, return minimal info
    RETURN jsonb_build_object(
      'full_name', 'Private User',
      'avatar_url', null,
      'title', null
    );
  END IF;
END;
$$;

-- 5. Ensure user_profile_details respects privacy with single clean policy
CREATE POLICY "user_profile_details_select_privacy" 
ON public.user_profile_details 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR can_view_profile(auth.uid(), user_id)
);

-- 6. Drop conflicting profile policies and keep only what we need
DROP POLICY IF EXISTS "profiles_select_owner_only" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

-- 7. Ensure profiles table has proper privacy policy (should already exist but ensure it)
-- The existing "profiles_select_respect_privacy" policy should work

-- 8. Add policy for profiles if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'profiles_select_respect_privacy'
  ) THEN
    CREATE POLICY "profiles_select_respect_privacy" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = user_id OR can_view_profile(auth.uid(), user_id));
  END IF;
END;
$$;

-- 9. Grant execute on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_basic_profile_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_basic_profile_info(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_post_author_info(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_post_author_info(uuid, uuid) TO anon;