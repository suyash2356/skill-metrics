
-- Drop both overloads to allow signature change
DROP FUNCTION IF EXISTS public.get_recommendations(uuid);
DROP FUNCTION IF EXISTS public.get_recommendations(uuid, text);

-- Hybrid recommender: personalized when interactions exist, content-based fallback otherwise
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
    SELECT 1 FROM interactions_ml
    WHERE user_id = user_id_input AND score > 0
  ) INTO has_interactions;

  IF has_interactions THEN
    RETURN QUERY
    SELECT
      r.id,
      r.title,
      (COALESCE(SUM(i.score), 0)
        + COALESCE(r.weighted_rating, 0) * 0.5
        + COALESCE(r.total_ratings, 0) * 0.01)::numeric AS score,
      'personalized'::text AS reason
    FROM resources r
    LEFT JOIN interactions_ml i
      ON i.item_id = r.id AND i.user_id = user_id_input
    WHERE r.is_active = true
      AND (
        domain_input IS NULL
        OR r.category ILIKE '%' || domain_input || '%'
        OR r.domain ILIKE '%' || domain_input || '%'
      )
      AND r.id NOT IN (
        SELECT resource_id FROM user_seen_resources WHERE user_id = user_id_input
      )
    GROUP BY r.id, r.title, r.weighted_rating, r.total_ratings
    HAVING COALESCE(SUM(i.score), 0) >= 0
    ORDER BY score DESC,
             r.weighted_rating DESC NULLS LAST,
             r.total_ratings DESC NULLS LAST
    LIMIT 10;
  ELSE
    RETURN QUERY
    SELECT
      r.id,
      r.title,
      (COALESCE(r.weighted_rating, 0) * 2 + COALESCE(r.total_ratings, 0) * 0.05)::numeric AS score,
      'popular_in_domain'::text AS reason
    FROM resources r
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

-- Recommendation events for CTR / evaluation
CREATE TABLE IF NOT EXISTS public.recommendation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('impression', 'click')),
  reason text,
  rank_position integer,
  model_version text DEFAULT 'v1_hybrid_sql',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rec_events_user ON public.recommendation_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rec_events_resource ON public.recommendation_events(resource_id);

ALTER TABLE public.recommendation_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rec_events_insert_own" ON public.recommendation_events;
DROP POLICY IF EXISTS "rec_events_select_own" ON public.recommendation_events;

CREATE POLICY "rec_events_insert_own"
ON public.recommendation_events
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rec_events_select_own"
ON public.recommendation_events
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
