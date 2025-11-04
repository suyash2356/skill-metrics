-- Create community_messages table for real-time chat
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_messages
CREATE POLICY "Members can view messages in their communities"
  ON public.community_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_messages.community_id
    )
  );

CREATE POLICY "Members can send messages in their communities"
  ON public.community_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_messages.community_id
    )
  );

CREATE POLICY "Users can delete their own messages"
  ON public.community_messages
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON public.community_messages
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime for community_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;

-- Create indexes for better performance
CREATE INDEX idx_community_messages_community_id ON public.community_messages(community_id);
CREATE INDEX idx_community_messages_created_at ON public.community_messages(created_at DESC);

-- Trigger to update updated_at
CREATE TRIGGER update_community_messages_updated_at
  BEFORE UPDATE ON public.community_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();