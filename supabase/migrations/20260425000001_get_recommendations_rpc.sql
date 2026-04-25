CREATE OR REPLACE FUNCTION get_recommendations(user_id_input uuid, domain_input text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  title text,
  score numeric
)
AS $$
  SELECT 
    r.id,
    r.title,
    SUM(i.score) as score
  FROM public.interactions_ml i
  JOIN public.resources r ON r.id = i.item_id
  WHERE i.user_id = user_id_input
  AND (domain_input IS NULL OR r.category ILIKE '%' || domain_input || '%')
  AND r.id NOT IN (
    SELECT resource_id 
    FROM public.user_seen_resources 
    WHERE user_id = user_id_input
  )
  GROUP BY r.id
  ORDER BY score DESC
  LIMIT 10;
$$ LANGUAGE sql;
