CREATE OR REPLACE FUNCTION public.find_or_create_conversation(_user1 uuid, _user2 uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  conv_id uuid;
BEGIN
  IF NOT can_message_user(_user1, _user2) THEN
    RAISE EXCEPTION 'Users must be mutual followers to message each other';
  END IF;

  -- Find existing 1:1 (non-group) conversation with exactly these two users
  SELECT c.id INTO conv_id
  FROM conversations c
  JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = _user1
  JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = _user2
  WHERE COALESCE(c.is_group, false) = false
    AND (SELECT COUNT(*) FROM conversation_participants cp WHERE cp.conversation_id = c.id) = 2
  LIMIT 1;

  IF conv_id IS NOT NULL THEN
    RETURN conv_id;
  END IF;

  INSERT INTO conversations (is_group) VALUES (false) RETURNING id INTO conv_id;
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (conv_id, _user1);
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (conv_id, _user2);

  RETURN conv_id;
END;
$function$;