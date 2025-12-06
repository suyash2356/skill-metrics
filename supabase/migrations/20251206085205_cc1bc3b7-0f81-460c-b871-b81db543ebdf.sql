-- Fix profiles RLS: Remove overly restrictive policy and add proper public/private logic
DROP POLICY IF EXISTS "profiles_select_owner_only" ON public.profiles;

-- Update the can_view_profile function to handle public profiles
CREATE OR REPLACE FUNCTION public.can_view_profile(_viewer_id uuid, _profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Owner can always view their own profile
    _viewer_id = _profile_user_id
    OR
    -- Check if profile is public or viewer is a follower
    (
      SELECT 
        COALESCE(
          (SELECT profile_visibility FROM user_preferences WHERE user_id = _profile_user_id) = 'public',
          true  -- Default to public if no preferences exist
        )
        OR
        EXISTS (
          SELECT 1 FROM followers 
          WHERE follower_id = _viewer_id 
          AND following_id = _profile_user_id 
          AND status = 'accepted'
        )
    )
$$;

-- Fix posts RLS: Allow viewing posts based on privacy settings
DROP POLICY IF EXISTS "posts_select_owner_only" ON public.posts;
DROP POLICY IF EXISTS "posts_select_public" ON public.posts;

-- Create a proper policy that respects privacy settings
CREATE POLICY "posts_select_with_privacy" ON public.posts
FOR SELECT USING (
  auth.uid() = user_id  -- Owner can always see their posts
  OR
  can_view_profile(auth.uid(), user_id)  -- Others can see if they can view the profile
);

-- Fix likes RLS: Allow viewing likes on visible posts  
DROP POLICY IF EXISTS "likes_select_owner_only" ON public.likes;

CREATE POLICY "likes_select_visible" ON public.likes
FOR SELECT USING (
  auth.uid() = user_id  -- User can see their own likes
  OR
  EXISTS (
    SELECT 1 FROM posts p 
    WHERE p.id = likes.post_id 
    AND can_view_profile(auth.uid(), p.user_id)
  )
);

-- Fix comments RLS: Use a simpler policy
DROP POLICY IF EXISTS "comments_select_public" ON public.comments;

CREATE POLICY "comments_select_with_privacy" ON public.comments
FOR SELECT USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM posts p 
    WHERE p.id = comments.post_id 
    AND can_view_profile(auth.uid(), p.user_id)
  )
);

-- Fix bookmarks - keep owner only (this is correct as bookmarks are private)
-- No changes needed for bookmarks