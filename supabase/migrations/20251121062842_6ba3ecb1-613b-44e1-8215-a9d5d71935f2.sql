-- Create helper function to check if user can view another user's profile based on privacy settings
CREATE OR REPLACE FUNCTION public.can_view_profile(_viewer_id uuid, _profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  -- User can always view their own profile
  SELECT CASE 
    WHEN _viewer_id = _profile_user_id THEN true
    ELSE (
      -- Check if profile is public or if viewer is following the user
      SELECT COALESCE(
        (SELECT 
          CASE 
            WHEN up.profile_visibility = 'public' THEN true
            WHEN up.profile_visibility = 'private' THEN EXISTS (
              SELECT 1 FROM public.followers f 
              WHERE f.follower_id = _viewer_id 
              AND f.following_id = _profile_user_id
            )
            ELSE false
          END
        FROM public.user_preferences up 
        WHERE up.user_id = _profile_user_id),
        true -- Default to public if no preferences set
      )
    )
  END;
$$;

-- Update profiles RLS policy to respect privacy settings
DROP POLICY IF EXISTS "profiles_select_respect_privacy" ON public.profiles;
CREATE POLICY "profiles_select_respect_privacy"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.can_view_profile(auth.uid(), user_id)
);

-- Update user_profile_details RLS policy to respect privacy settings
DROP POLICY IF EXISTS "profile_details_select_respect_privacy" ON public.user_profile_details;
CREATE POLICY "profile_details_select_respect_privacy"
ON public.user_profile_details
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.can_view_profile(auth.uid(), user_id)
);

-- Update posts RLS to respect user privacy when viewing posts
DROP POLICY IF EXISTS "posts_select_respect_privacy" ON public.posts;
CREATE POLICY "posts_select_respect_privacy"
ON public.posts
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (community_id IS NULL AND public.can_view_profile(auth.uid(), user_id))
);

-- Update roadmaps RLS to respect user privacy
DROP POLICY IF EXISTS "roadmaps_select_respect_privacy" ON public.roadmaps;
CREATE POLICY "roadmaps_select_respect_privacy"
ON public.roadmaps
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (is_public = true AND public.can_view_profile(auth.uid(), user_id))
);

-- Update user_activity RLS to respect privacy
DROP POLICY IF EXISTS "activity_select_respect_privacy" ON public.user_activity;
CREATE POLICY "activity_select_respect_privacy"
ON public.user_activity
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  public.can_view_profile(auth.uid(), user_id)
);