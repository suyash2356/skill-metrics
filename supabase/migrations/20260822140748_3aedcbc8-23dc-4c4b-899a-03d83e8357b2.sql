CREATE OR REPLACE FUNCTION public.get_visible_user_activity(target_user_id uuid)
RETURNS TABLE (
  id text,
  user_id uuid,
  activity_type text,
  post_id uuid,
  roadmap_id uuid,
  target_profile_id uuid,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.id::text,
    e.user_id,
    e.event_type::text,
    CASE WHEN e.subject_type::text = 'post' THEN e.subject_id END,
    CASE WHEN e.subject_type::text = 'roadmap' THEN e.subject_id END,
    CASE WHEN e.subject_type::text = 'profile' THEN e.subject_id END,
    e.occurred_at
  FROM public.interaction_events e
  WHERE e.user_id = target_user_id
    AND public.can_view_profile(auth.uid(), target_user_id)
    AND e.event_type::text IN ('like','save','open','rate','vote')
  ORDER BY e.occurred_at DESC
  LIMIT 20
$$;

REVOKE ALL ON FUNCTION public.get_visible_user_activity(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_visible_user_activity(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_visible_user_activity(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_visible_user_activity(uuid) TO service_role;