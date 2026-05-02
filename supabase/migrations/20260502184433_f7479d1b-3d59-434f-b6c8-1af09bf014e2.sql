
DROP FUNCTION IF EXISTS public.get_recommendations(uuid, text);

CREATE OR REPLACE FUNCTION public.get_recommendations(
  user_id_input uuid,
  domain_input text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  score numeric,
  reason text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_interactions boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.interactions_ml im
    WHERE im.user_id = user_id_input AND im.score > 0
  ) INTO has_interactions;

  IF has_interactions THEN
    RETURN QUERY
    SELECT
      r.id,
      r.title,
      (COALESCE(SUM(i.score), 0)
        + COALESCE(r.weighted_rating, 0) * 0.5
        + COALESCE(r.total_ratings, 0) * 0.01)::numeric,
      'personalized'::text
    FROM public.resources r
    LEFT JOIN public.interactions_ml i
      ON i.item_id = r.id AND i.user_id = user_id_input
    WHERE r.is_active = true
      AND (
        domain_input IS NULL
        OR r.category ILIKE '%' || domain_input || '%'
        OR r.domain ILIKE '%' || domain_input || '%'
      )
      AND r.id NOT IN (
        SELECT usr.resource_id FROM public.user_seen_resources usr WHERE usr.user_id = user_id_input
      )
    GROUP BY r.id, r.title, r.weighted_rating, r.total_ratings
    HAVING COALESCE(SUM(i.score), 0) >= 0
    ORDER BY 3 DESC,
             r.weighted_rating DESC NULLS LAST,
             r.total_ratings DESC NULLS LAST
    LIMIT 10;
  ELSE
    RETURN QUERY
    SELECT
      r.id,
      r.title,
      (COALESCE(r.weighted_rating, 0) * 2 + COALESCE(r.total_ratings, 0) * 0.05)::numeric,
      'popular_in_domain'::text
    FROM public.resources r
    WHERE r.is_active = true
      AND (
        domain_input IS NULL
        OR r.category ILIKE '%' || domain_input || '%'
        OR r.domain ILIKE '%' || domain_input || '%'
      )
      AND r.difficulty = 'beginner'
    ORDER BY r.weighted_rating DESC NULLS LAST,
             r.total_ratings DESC NULLS LAST
    LIMIT 10;
  END IF;
END;
$$;
