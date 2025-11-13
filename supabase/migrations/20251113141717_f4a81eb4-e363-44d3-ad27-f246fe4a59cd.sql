-- Fix Critical Security Issue #1: user_activity table RLS
-- Drop any existing permissive policies and add strict owner-only policies
DROP POLICY IF EXISTS "Users can view all activity" ON public.user_activity;
DROP POLICY IF EXISTS "Activity is viewable by everyone" ON public.user_activity;

CREATE POLICY "Users can view own activity only"
ON public.user_activity
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity only"
ON public.user_activity
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix Critical Security Issue #2: user_sessions table RLS
-- Drop any existing permissive policies and add strict owner-only policies
DROP POLICY IF EXISTS "Users can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Sessions are viewable by everyone" ON public.user_sessions;

CREATE POLICY "Users can view own sessions only"
ON public.user_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions only"
ON public.user_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions only"
ON public.user_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions only"
ON public.user_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix Critical Security Issue #3: user_preferences table RLS
-- Drop any existing permissive policies and add strict owner-only policies
DROP POLICY IF EXISTS "Users can view all preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Preferences are viewable by everyone" ON public.user_preferences;

CREATE POLICY "Users can view own preferences only"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences only"
ON public.user_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences only"
ON public.user_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences only"
ON public.user_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix Critical Security Issue #4: user_profile_details table RLS
-- Add strict owner-only policies for profile details
DROP POLICY IF EXISTS "Users can view all profile details" ON public.user_profile_details;
DROP POLICY IF EXISTS "Profile details are viewable by everyone" ON public.user_profile_details;

CREATE POLICY "Users can view own profile details only"
ON public.user_profile_details
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile details only"
ON public.user_profile_details
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile details only"
ON public.user_profile_details
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile details only"
ON public.user_profile_details
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix support_tickets: Ensure only owner or no one can read tickets (they already have good policies, just ensuring)
DROP POLICY IF EXISTS "Anyone can view support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Support tickets are public" ON public.support_tickets;