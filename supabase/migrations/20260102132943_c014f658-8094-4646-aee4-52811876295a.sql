-- Fix SECURITY DEFINER view warning by dropping it and using the RPC function instead
DROP VIEW IF EXISTS public.user_sessions_safe;

-- The get_my_sessions() function is the proper secure way to access session data
-- It uses SECURITY DEFINER but explicitly checks auth.uid() which is safe