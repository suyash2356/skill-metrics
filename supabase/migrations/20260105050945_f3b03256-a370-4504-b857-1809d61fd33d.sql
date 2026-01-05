-- Fix function search path for is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix function search path for register_first_admin
CREATE OR REPLACE FUNCTION public.register_first_admin(admin_user_id UUID, admin_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF EXISTS (SELECT 1 FROM public.admins LIMIT 1) THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO public.admins (user_id, email) VALUES (admin_user_id, admin_email);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;