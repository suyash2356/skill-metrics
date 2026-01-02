-- Fix Critical Security Issue 1: user_profile_details table public exposure
-- Remove any overly permissive SELECT policies and ensure only authorized users can view

-- First, drop any permissive policies that allow public access
DROP POLICY IF EXISTS "Authenticated users can view profile details" ON public.user_profile_details;
DROP POLICY IF EXISTS "Users can view all profile details" ON public.user_profile_details;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.user_profile_details;

-- The existing policies using can_view_profile should be sufficient:
-- "profile_details_select_respect_privacy" and "user_profile_details_select_privacy"
-- These already check (auth.uid() = user_id) OR can_view_profile(auth.uid(), user_id)

-- Fix Critical Security Issue 2: user_sessions table - ensure complete lockdown
-- Drop any policies that might allow broader access
DROP POLICY IF EXISTS "Users can view sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Sessions are viewable" ON public.user_sessions;

-- Ensure ONLY owner can access their own sessions - recreate with strict check
DROP POLICY IF EXISTS "user_sessions_select_owner_only" ON public.user_sessions;
CREATE POLICY "user_sessions_select_owner_only" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sessions_insert_owner_check" ON public.user_sessions;
CREATE POLICY "user_sessions_insert_owner_check" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sessions_update_owner_only" ON public.user_sessions;
CREATE POLICY "user_sessions_update_owner_only" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Remove duplicate policies on user_sessions that might cause confusion
DROP POLICY IF EXISTS "Users can only view own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions only" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can only insert own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions only" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can only update own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions only" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can only delete own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions only" ON public.user_sessions;

-- Recreate clean delete policy
CREATE POLICY "user_sessions_delete_owner_only" 
ON public.user_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Also clean up duplicate policies on user_profile_details
DROP POLICY IF EXISTS "Users can view own profile details" ON public.user_profile_details;
DROP POLICY IF EXISTS "Users can view own profile details only" ON public.user_profile_details;

-- Ensure the privacy-respecting policy exists and is the only SELECT policy
DROP POLICY IF EXISTS "profile_details_select_respect_privacy" ON public.user_profile_details;
DROP POLICY IF EXISTS "user_profile_details_select_privacy" ON public.user_profile_details;

CREATE POLICY "user_profile_details_select_privacy" 
ON public.user_profile_details 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR can_view_profile(auth.uid(), user_id)
);

-- Verify RLS is enabled on both tables
ALTER TABLE public.user_profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE public.user_profile_details IS 'User profile details with privacy-based access control. Only profile owners and authorized viewers (based on privacy settings) can access.';
COMMENT ON TABLE public.user_sessions IS 'User session tracking - strictly owner-only access. IP addresses are not stored for privacy.';