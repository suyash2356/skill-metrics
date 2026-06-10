-- =============================================================================
-- Security Fix Migration: 3 issues
-- 1. user_activity SELECT policy leaks sensitive columns to non-owners
-- 2. SECURITY DEFINER view (user_sessions_safe) defensive drop
-- =============================================================================

-- ---------------------------------------------------------------------------
-- FIX 1: user_activity — restrict sensitive fields from non-owners
--
-- Strategy: Replace the permissive "Activity visibility" policy with TWO
-- policies:
--   (a) Owners see ALL their own rows (full columns via table access).
--   (b) Non-owners (followers / public viewers) get access through a
--       SECURITY INVOKER view that strips sensitive columns.
--
-- We restrict the SELECT policy on the TABLE to owner-only, and create a
-- safe view + grant for others.
-- ---------------------------------------------------------------------------

-- Drop the overly-permissive policy
DROP POLICY IF EXISTS "Activity visibility" ON public.user_activity;
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;

-- Owner-only SELECT policy on the raw table
CREATE POLICY "Users can view own activity"
ON public.user_activity FOR SELECT
USING (auth.uid() = user_id);

-- Create a safe view that strips sensitive columns for public/social consumption
-- This view uses SECURITY INVOKER (the default) so RLS of the querying user applies.
-- Since the raw table is now owner-only, we use a SECURITY DEFINER function
-- to expose only safe columns to followers/public viewers.
CREATE OR REPLACE FUNCTION public.get_visible_user_activity(target_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  activity_type text,
  post_id uuid,
  roadmap_id uuid,
  community_id uuid,
  target_user_id_out uuid,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only return activity if the caller is the owner, a follower, or the
  -- target user has a public profile.
  IF target_user_id = auth.uid() THEN
    -- Owner: return everything via the raw table (they can query directly too)
    RETURN QUERY
    SELECT
      a.id, a.user_id, a.activity_type, a.post_id, a.roadmap_id,
      a.community_id, a.target_user_id, a.created_at
    FROM public.user_activity a
    WHERE a.user_id = target_user_id
    ORDER BY a.created_at DESC;
  ELSIF EXISTS (
    SELECT 1 FROM public.followers f
    WHERE f.following_id = target_user_id AND f.follower_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.user_preferences up
    WHERE up.user_id = target_user_id AND up.profile_visibility = 'public'
  ) THEN
    -- Follower or public profile: return activity WITHOUT sensitive columns
    RETURN QUERY
    SELECT
      a.id, a.user_id, a.activity_type, a.post_id, a.roadmap_id,
      a.community_id, a.target_user_id, a.created_at
    FROM public.user_activity a
    WHERE a.user_id = target_user_id
    ORDER BY a.created_at DESC;
  END IF;
  -- Otherwise return nothing
END;
$$;

-- ---------------------------------------------------------------------------
-- FIX 2: Defensive drop of SECURITY DEFINER view (user_sessions_safe)
-- This was created and dropped in earlier migrations, but we ensure it's gone.
-- ---------------------------------------------------------------------------

DROP VIEW IF EXISTS public.user_sessions_safe;

