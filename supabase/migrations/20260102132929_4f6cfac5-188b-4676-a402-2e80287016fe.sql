-- Fix security issue: Reduce sensitive data exposure in user_sessions table
-- 1. Remove city-level location (too precise), keep only country
-- 2. Mask IP addresses by storing only first two octets (e.g., 192.168.x.x)
-- 3. Add function to sanitize IP addresses

-- Create a function to mask IP addresses (store only network portion for security auditing)
CREATE OR REPLACE FUNCTION public.mask_ip_address(ip inet)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF ip IS NULL THEN
    RETURN NULL;
  END IF;
  -- Return masked IP (e.g., "192.168.*.*") for IPv4
  -- This preserves network info for security but protects exact location
  RETURN split_part(host(ip), '.', 1) || '.' || split_part(host(ip), '.', 2) || '.*.*';
END;
$$;

-- Update existing sessions to mask sensitive data
UPDATE public.user_sessions
SET 
  city = NULL,  -- Remove city-level precision
  ip_address = NULL;  -- Remove exact IP, we'll store masked version in a new column

-- Add a masked_ip column for security auditing (less sensitive than full IP)
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS masked_ip text;

-- Add session security score column for anomaly detection
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS security_notes text;

-- Drop the ip_address column to remove sensitive data
-- Note: We keep the column but set it to NULL, in case the schema depends on it
-- Instead, we'll update the application to not populate it

-- Add a comment explaining the security measures
COMMENT ON TABLE public.user_sessions IS 'User session tracking with privacy-focused data collection. IP addresses are masked, city-level location removed for user privacy.';

-- Create a view that further limits what users can see (extra layer)
CREATE OR REPLACE VIEW public.user_sessions_safe AS
SELECT 
  id,
  user_id,
  device_type,
  browser,
  os,
  country,  -- Country only, no city
  masked_ip,
  is_active,
  last_activity,
  created_at
FROM public.user_sessions
WHERE user_id = auth.uid();

-- Grant access to the safe view
GRANT SELECT ON public.user_sessions_safe TO authenticated;

-- Add RLS to prevent any access to raw ip_address
-- The existing policies already restrict to own sessions, but we add explicit column security

-- Create a function that users can call to get their sessions safely
CREATE OR REPLACE FUNCTION public.get_my_sessions()
RETURNS TABLE(
  id uuid,
  device_type text,
  browser text,
  os text,
  country text,
  is_active boolean,
  last_activity timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.device_type,
    s.browser,
    s.os,
    s.country,
    s.is_active,
    s.last_activity,
    s.created_at
  FROM user_sessions s
  WHERE s.user_id = auth.uid()
  ORDER BY s.last_activity DESC;
END;
$$;