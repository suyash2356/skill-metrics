
-- Conversations table
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Conversation participants
CREATE TABLE public.conversation_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  last_read_at timestamp with time zone DEFAULT now(),
  is_muted boolean NOT NULL DEFAULT false,
  UNIQUE (conversation_id, user_id)
);

-- Messages table
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text,
  message_type text NOT NULL DEFAULT 'text',
  shared_post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL,
  shared_resource_id uuid REFERENCES public.resources(id) ON DELETE SET NULL,
  is_edited boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  reply_to_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Message reactions
CREATE TABLE public.message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

-- Indexes
CREATE INDEX idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conv ON public.conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_message_reactions_message ON public.message_reactions(message_id);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is participant in a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE user_id = _user_id AND conversation_id = _conversation_id
  )
$$;

-- Helper function: check if user can message another user (must be mutual followers)
CREATE OR REPLACE FUNCTION public.can_message_user(_sender_id uuid, _recipient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    _sender_id = _recipient_id
    OR (
      EXISTS (
        SELECT 1 FROM followers
        WHERE follower_id = _sender_id AND following_id = _recipient_id AND status = 'accepted'
      )
      AND EXISTS (
        SELECT 1 FROM followers
        WHERE follower_id = _recipient_id AND following_id = _sender_id AND status = 'accepted'
      )
    )
$$;

-- Helper function: find or create a direct conversation between two users
CREATE OR REPLACE FUNCTION public.find_or_create_conversation(_user1 uuid, _user2 uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv_id uuid;
BEGIN
  -- Check if users can message each other
  IF NOT can_message_user(_user1, _user2) THEN
    RAISE EXCEPTION 'Users must be mutual followers to message each other';
  END IF;

  -- Find existing conversation
  SELECT cp1.conversation_id INTO conv_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = _user1 AND cp2.user_id = _user2
  LIMIT 1;

  IF conv_id IS NOT NULL THEN
    RETURN conv_id;
  END IF;

  -- Create new conversation
  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conv_id;
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (conv_id, _user1);
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (conv_id, _user2);

  RETURN conv_id;
END;
$$;

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (is_conversation_participant(auth.uid(), id));

CREATE POLICY "Authenticated users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for conversation_participants
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT
USING (is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "System can insert participants"
ON public.conversation_participants FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can update own participation"
ON public.conversation_participants FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND is_conversation_participant(auth.uid(), conversation_id)
);

CREATE POLICY "Users can update own messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can delete own messages"
ON public.messages FOR DELETE
USING (sender_id = auth.uid());

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations"
ON public.message_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM messages m
    WHERE m.id = message_reactions.message_id
    AND is_conversation_participant(auth.uid(), m.conversation_id)
  )
);

CREATE POLICY "Users can add reactions"
ON public.message_reactions FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM messages m
    WHERE m.id = message_reactions.message_id
    AND is_conversation_participant(auth.uid(), m.conversation_id)
  )
);

CREATE POLICY "Users can remove own reactions"
ON public.message_reactions FOR DELETE
USING (user_id = auth.uid());

-- Trigger to update conversation updated_at on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_timestamp
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_on_message();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
