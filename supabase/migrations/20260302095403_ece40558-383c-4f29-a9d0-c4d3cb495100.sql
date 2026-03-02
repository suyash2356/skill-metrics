-- Allow admins to read all user resources for moderation
CREATE POLICY "Admins can view all user resources"
ON public.user_resources
FOR SELECT
USING (is_admin());

-- Allow admins to update user resources (approve/reject/flag)
CREATE POLICY "Admins can update user resources"
ON public.user_resources
FOR UPDATE
USING (is_admin());
