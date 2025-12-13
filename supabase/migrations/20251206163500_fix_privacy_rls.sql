-- Fix RLS for posts to respect account privacy
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Visible posts" ON public.posts;

CREATE POLICY "Visible posts"
ON public.posts FOR SELECT
USING (
  auth.uid() = user_id -- I am owner
  OR EXISTS (
    SELECT 1 FROM public.user_preferences up
    WHERE up.user_id = posts.user_id
    AND up.profile_visibility = 'public' -- Public profile
  )
  OR EXISTS (
    SELECT 1 FROM public.followers f
    WHERE f.following_id = posts.user_id
    AND f.follower_id = auth.uid()
  )
);

-- Fix RLS for roadmaps to respect account privacy
DROP POLICY IF EXISTS "Roadmaps are viewable by owner or when public" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps visibility" ON public.roadmaps;

CREATE POLICY "Roadmaps visibility"
ON public.roadmaps FOR SELECT
USING (
  auth.uid() = user_id -- Owner
  OR (
    is_public = true -- Roadmap itself is public
    AND (
      EXISTS (
        SELECT 1 FROM public.user_preferences up
        WHERE up.user_id = roadmaps.user_id
        AND up.profile_visibility = 'public'
      )
      OR EXISTS (
        SELECT 1 FROM public.followers f
        WHERE f.following_id = roadmaps.user_id
        AND f.follower_id = auth.uid()
      )
    )
  )
);

-- Fix RLS for user_activity to respect account privacy
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Activity visibility" ON public.user_activity;

CREATE POLICY "Activity visibility"
ON public.user_activity FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.user_preferences up
    WHERE up.user_id = user_activity.user_id
    AND up.profile_visibility = 'public'
  )
  OR EXISTS (
    SELECT 1 FROM public.followers f
    WHERE f.following_id = user_activity.user_id
    AND f.follower_id = auth.uid()
  )
);
