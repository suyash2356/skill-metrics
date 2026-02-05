-- Fix infinite recursion in admins table RLS policies
-- The issue is that policies query the admins table directly, causing recursion

-- Drop the problematic policies on admins table
DROP POLICY IF EXISTS "Admin can view own row" ON public.admins;
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admins;

-- Create a simple self-check policy that doesn't cause recursion
CREATE POLICY "Users can view own admin status"
ON public.admins
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Drop problematic policies on resources table that query admins directly
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Only admins can insert resources" ON public.resources;

-- Recreate policies using the security definer is_admin() function
CREATE POLICY "Admins can insert resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update resources"
ON public.resources
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete resources"
ON public.resources
FOR DELETE
TO authenticated
USING (public.is_admin());