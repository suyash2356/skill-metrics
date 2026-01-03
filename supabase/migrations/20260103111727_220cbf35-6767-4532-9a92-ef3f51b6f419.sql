-- Create a function to search profiles for all users (basic info only)
-- This allows searching private accounts while respecting data visibility
CREATE OR REPLACE FUNCTION public.search_profiles(search_query text, result_limit integer DEFAULT 10)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url
  FROM public.profiles p
  WHERE 
    p.full_name ILIKE search_query || '%' 
    OR p.full_name ILIKE '%' || search_query || '%'
  ORDER BY 
    CASE WHEN p.full_name ILIKE search_query || '%' THEN 0 ELSE 1 END,
    p.full_name
  LIMIT result_limit;
$$;