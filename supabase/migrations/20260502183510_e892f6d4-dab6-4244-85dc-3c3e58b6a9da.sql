
-- Fix 1: Restrict user_encryption_keys SELECT to owner only
DROP POLICY IF EXISTS "Anyone authenticated can read public keys" ON public.user_encryption_keys;

CREATE POLICY "Users can read own encryption keys"
ON public.user_encryption_keys
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Public keys for other users are accessible via the SECURITY DEFINER
-- function public.get_user_public_key(target_user_id uuid).

-- Fix 2: Restrict Realtime subscriptions to conversation participants
-- Topic convention: 'conversation:<conversation_id>'

-- Drop any prior conversation-topic policies if they exist
DROP POLICY IF EXISTS "users_can_read_conversation_broadcasts" ON realtime.messages;
DROP POLICY IF EXISTS "authenticated_can_receive_conversation_broadcasts" ON realtime.messages;

CREATE POLICY "authenticated_can_receive_conversation_broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN realtime.topic() LIKE 'conversation:%' THEN
      public.is_conversation_participant(
        auth.uid(),
        NULLIF(split_part(realtime.topic(), ':', 2), '')::uuid
      )
    WHEN realtime.topic() LIKE 'notifications:%' THEN
      realtime.topic() = ('notifications:' || (auth.uid())::text)
    ELSE
      false
  END
);
