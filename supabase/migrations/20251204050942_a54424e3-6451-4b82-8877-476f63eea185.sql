-- Drop restrictive INSERT policies on notifications
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;

-- Create a policy that allows authenticated users to insert notifications for any user
-- This is needed for like, comment, follow notifications to work
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep existing policies for SELECT, UPDATE, DELETE (users can only manage their own)