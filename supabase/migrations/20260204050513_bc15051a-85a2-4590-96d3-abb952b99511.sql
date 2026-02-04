-- First, remove duplicate resources keeping only one of each
DELETE FROM resources 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY title, link, category 
      ORDER BY created_at ASC
    ) as row_num
    FROM resources
  ) t
  WHERE row_num > 1
);

-- Now add unique constraint on resources to prevent duplicates
ALTER TABLE public.resources 
ADD CONSTRAINT resources_unique_title_link_category 
UNIQUE (title, link, category);

-- Create index for faster duplicate checking
CREATE INDEX IF NOT EXISTS idx_resources_title_link_category 
ON public.resources (title, link, category);

-- Fix the posts SELECT policy - make all public posts visible to all authenticated users
-- Private account posts should only be visible to accepted followers

-- Drop old conflicting policies
DROP POLICY IF EXISTS "Visible posts" ON public.posts;
DROP POLICY IF EXISTS "posts_select_with_privacy" ON public.posts;

-- Create a clear policy for posts visibility:
-- 1. User can always see their own posts
-- 2. Public account posts are visible to all authenticated users  
-- 3. Private account posts are only visible to accepted followers
CREATE POLICY "posts_select_visibility" ON public.posts
FOR SELECT USING (
  -- Always see own posts
  auth.uid() = user_id
  OR
  -- See public account posts (default visibility is public)
  NOT EXISTS (
    SELECT 1 FROM user_preferences up 
    WHERE up.user_id = posts.user_id 
    AND up.profile_visibility = 'private'
  )
  OR
  -- See private account posts if accepted follower
  EXISTS (
    SELECT 1 FROM followers f 
    WHERE f.following_id = posts.user_id 
    AND f.follower_id = auth.uid() 
    AND f.status = 'accepted'
  )
);