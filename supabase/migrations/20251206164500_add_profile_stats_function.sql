-- Function to get profile stats (counts) bypassing RLS
-- This allows showing "5 Posts", "3 Roadmaps" etc even for private profiles

CREATE OR REPLACE FUNCTION public.get_profile_stats(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_count INTEGER;
  roadmap_count INTEGER;
  follower_count INTEGER;
  following_count INTEGER;
BEGIN
  -- Count posts
  SELECT count(*) INTO post_count
  FROM public.posts
  WHERE user_id = target_user_id;

  -- Count roadmaps
  SELECT count(*) INTO roadmap_count
  FROM public.roadmaps
  WHERE user_id = target_user_id;

  -- Count followers
  SELECT count(*) INTO follower_count
  FROM public.followers
  WHERE following_id = target_user_id;

  -- Count following
  SELECT count(*) INTO following_count
  FROM public.followers
  WHERE follower_id = target_user_id;

  RETURN jsonb_build_object(
    'post_count', post_count,
    'roadmap_count', roadmap_count,
    'follower_count', follower_count,
    'following_count', following_count
  );
END;
$$;
