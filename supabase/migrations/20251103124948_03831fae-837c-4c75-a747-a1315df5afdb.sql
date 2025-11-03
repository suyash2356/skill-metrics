-- Create community roles enum
CREATE TYPE public.community_role AS ENUM ('admin', 'moderator', 'member');

-- Create community_member_roles table
CREATE TABLE public.community_member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role community_role NOT NULL DEFAULT 'member',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(community_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_member_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_member_roles
CREATE POLICY "Members can view roles in their communities"
  ON public.community_member_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_member_roles.community_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can assign roles"
  ON public.community_member_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_member_roles cmr
      WHERE cmr.community_id = community_member_roles.community_id
      AND cmr.user_id = auth.uid()
      AND cmr.role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles"
  ON public.community_member_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_member_roles cmr
      WHERE cmr.community_id = community_member_roles.community_id
      AND cmr.user_id = auth.uid()
      AND cmr.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete roles"
  ON public.community_member_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_member_roles cmr
      WHERE cmr.community_id = community_member_roles.community_id
      AND cmr.user_id = auth.uid()
      AND cmr.role = 'admin'
    )
  );

-- Add logo and banner to communities table
ALTER TABLE public.communities 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS banner TEXT,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create index for faster role lookups
CREATE INDEX idx_community_member_roles_lookup ON public.community_member_roles(community_id, user_id);

-- Function to check if user has role in community
CREATE OR REPLACE FUNCTION public.has_community_role(_user_id UUID, _community_id UUID, _role community_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_member_roles
    WHERE user_id = _user_id
    AND community_id = _community_id
    AND role = _role
  )
$$;

-- Function to automatically assign admin role to community creator
CREATE OR REPLACE FUNCTION public.assign_admin_role_to_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin role for the creator
  INSERT INTO public.community_member_roles (community_id, user_id, role, assigned_by)
  VALUES (NEW.id, NEW.created_by, 'admin', NEW.created_by);
  
  RETURN NEW;
END;
$$;

-- Trigger to assign admin role when community is created
CREATE TRIGGER on_community_created
  AFTER INSERT ON public.communities
  FOR EACH ROW
  WHEN (NEW.created_by IS NOT NULL)
  EXECUTE FUNCTION public.assign_admin_role_to_creator();

-- Function to assign member role when user joins
CREATE OR REPLACE FUNCTION public.assign_member_role_on_join()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only assign if they don't already have a role
  INSERT INTO public.community_member_roles (community_id, user_id, role)
  VALUES (NEW.community_id, NEW.user_id, 'member')
  ON CONFLICT (community_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to assign member role when joining
CREATE TRIGGER on_member_joined
  AFTER INSERT ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_member_role_on_join();

-- Update communities policy to allow admins to update
CREATE POLICY "Admins can update their communities"
  ON public.communities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_member_roles cmr
      WHERE cmr.community_id = communities.id
      AND cmr.user_id = auth.uid()
      AND cmr.role = 'admin'
    )
  );

-- Update communities policy to allow admins to delete
CREATE POLICY "Admins can delete their communities"
  ON public.communities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_member_roles cmr
      WHERE cmr.community_id = communities.id
      AND cmr.user_id = auth.uid()
      AND cmr.role = 'admin'
    )
  );