
-- Add group chat columns to conversations table
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS is_group boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS group_name text,
  ADD COLUMN IF NOT EXISTS group_avatar_url text,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS max_members integer NOT NULL DEFAULT 256;

-- Add role column to conversation_participants
ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS added_by uuid;

-- =====================================================
-- RPC: Create a group conversation
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_group_conversation(
  _name text,
  _member_ids uuid[],
  _description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  conv_id uuid;
  member_id uuid;
BEGIN
  -- Validate
  IF _name IS NULL OR trim(_name) = '' THEN
    RAISE EXCEPTION 'Group name is required';
  END IF;
  IF array_length(_member_ids, 1) IS NULL OR array_length(_member_ids, 1) < 1 THEN
    RAISE EXCEPTION 'At least one other member is required';
  END IF;
  IF array_length(_member_ids, 1) > 255 THEN
    RAISE EXCEPTION 'Too many members (max 256 including you)';
  END IF;

  -- Create conversation
  INSERT INTO conversations (is_group, group_name, created_by, description)
  VALUES (true, _name, auth.uid(), _description)
  RETURNING id INTO conv_id;

  -- Add creator as admin
  INSERT INTO conversation_participants (conversation_id, user_id, role)
  VALUES (conv_id, auth.uid(), 'admin');

  -- Add members
  FOREACH member_id IN ARRAY _member_ids LOOP
    IF member_id != auth.uid() THEN
      INSERT INTO conversation_participants (conversation_id, user_id, role, added_by)
      VALUES (conv_id, member_id, 'member', auth.uid())
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  RETURN conv_id;
END;
$$;

-- =====================================================
-- RPC: Add member to group (admin only)
-- =====================================================
CREATE OR REPLACE FUNCTION public.add_group_member(
  _conversation_id uuid,
  _new_member_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _is_group boolean;
  _member_count integer;
  _max integer;
BEGIN
  -- Check conversation is a group
  SELECT is_group, max_members INTO _is_group, _max
  FROM conversations WHERE id = _conversation_id;
  
  IF NOT _is_group THEN
    RAISE EXCEPTION 'Not a group conversation';
  END IF;

  -- Check caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = _conversation_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only group admins can add members';
  END IF;

  -- Check member limit
  SELECT COUNT(*) INTO _member_count
  FROM conversation_participants WHERE conversation_id = _conversation_id;
  
  IF _member_count >= _max THEN
    RAISE EXCEPTION 'Group is full';
  END IF;

  -- Add member
  INSERT INTO conversation_participants (conversation_id, user_id, role, added_by)
  VALUES (_conversation_id, _new_member_id, 'member', auth.uid())
  ON CONFLICT DO NOTHING;
END;
$$;

-- =====================================================
-- RPC: Remove member from group (admin only)
-- =====================================================
CREATE OR REPLACE FUNCTION public.remove_group_member(
  _conversation_id uuid,
  _member_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = _conversation_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only group admins can remove members';
  END IF;

  -- Cannot remove yourself via this function
  IF _member_id = auth.uid() THEN
    RAISE EXCEPTION 'Use leave_group instead';
  END IF;

  DELETE FROM conversation_participants
  WHERE conversation_id = _conversation_id AND user_id = _member_id;
END;
$$;

-- =====================================================
-- RPC: Leave group
-- =====================================================
CREATE OR REPLACE FUNCTION public.leave_group(
  _conversation_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _is_group boolean;
  _remaining_admins integer;
BEGIN
  SELECT is_group INTO _is_group FROM conversations WHERE id = _conversation_id;
  IF NOT _is_group THEN
    RAISE EXCEPTION 'Not a group conversation';
  END IF;

  -- If user is the only admin, promote the oldest member
  SELECT COUNT(*) INTO _remaining_admins
  FROM conversation_participants
  WHERE conversation_id = _conversation_id AND role = 'admin' AND user_id != auth.uid();

  IF _remaining_admins = 0 THEN
    UPDATE conversation_participants
    SET role = 'admin'
    WHERE id = (
      SELECT id FROM conversation_participants
      WHERE conversation_id = _conversation_id AND user_id != auth.uid()
      ORDER BY joined_at ASC
      LIMIT 1
    );
  END IF;

  DELETE FROM conversation_participants
  WHERE conversation_id = _conversation_id AND user_id = auth.uid();
END;
$$;

-- =====================================================
-- RPC: Update group settings (admin only)
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_group_settings(
  _conversation_id uuid,
  _name text DEFAULT NULL,
  _description text DEFAULT NULL,
  _avatar_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = _conversation_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only group admins can update settings';
  END IF;

  UPDATE conversations SET
    group_name = COALESCE(_name, group_name),
    description = COALESCE(_description, description),
    group_avatar_url = COALESCE(_avatar_url, group_avatar_url),
    updated_at = now()
  WHERE id = _conversation_id AND is_group = true;
END;
$$;

-- =====================================================
-- RPC: Promote/demote member (admin only)
-- =====================================================
CREATE OR REPLACE FUNCTION public.toggle_group_admin(
  _conversation_id uuid,
  _member_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _current_role text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = _conversation_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only group admins can manage roles';
  END IF;

  SELECT role INTO _current_role
  FROM conversation_participants
  WHERE conversation_id = _conversation_id AND user_id = _member_id;

  IF _current_role = 'admin' THEN
    UPDATE conversation_participants SET role = 'member'
    WHERE conversation_id = _conversation_id AND user_id = _member_id;
  ELSE
    UPDATE conversation_participants SET role = 'admin'
    WHERE conversation_id = _conversation_id AND user_id = _member_id;
  END IF;
END;
$$;

-- Update conversations RLS to allow updates for group admins
CREATE POLICY "Group admins can update conversation"
ON public.conversations
FOR UPDATE
TO authenticated
USING (
  is_group = true AND EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  is_group = true AND EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Allow group participants to send messages (already covered by existing policy)
-- Allow group participants to delete their own participation (leave)
CREATE POLICY "Users can leave groups"
ON public.conversation_participants
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id AND c.is_group = true
  )
);
