-- Create follow_requests table for Instagram-style follow system
CREATE TABLE IF NOT EXISTS public.follow_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(requester_id, requested_id)
);

-- Enable RLS on follow_requests
ALTER TABLE public.follow_requests ENABLE ROW LEVEL SECURITY;

-- Users can create follow requests
CREATE POLICY "Users can create follow requests"
ON public.follow_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

-- Users can view their own sent requests
CREATE POLICY "Users can view sent requests"
ON public.follow_requests
FOR SELECT
TO authenticated
USING (auth.uid() = requester_id);

-- Users can view requests sent to them
CREATE POLICY "Users can view received requests"
ON public.follow_requests
FOR SELECT
TO authenticated
USING (auth.uid() = requested_id);

-- Users can update requests sent to them (accept/reject)
CREATE POLICY "Users can update received requests"
ON public.follow_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = requested_id)
WITH CHECK (auth.uid() = requested_id);

-- Users can delete their own sent requests (cancel request)
CREATE POLICY "Users can delete sent requests"
ON public.follow_requests
FOR DELETE
TO authenticated
USING (auth.uid() = requester_id);

-- Add status column to followers table to track if it's from accepted request
ALTER TABLE public.followers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'accepted' CHECK (status IN ('accepted', 'direct'));

-- Create function to handle follow request acceptance
CREATE OR REPLACE FUNCTION public.handle_follow_request_acceptance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If request is accepted, create follower relationship
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Insert into followers table
    INSERT INTO public.followers (follower_id, following_id, status)
    VALUES (NEW.requester_id, NEW.requested_id, 'accepted')
    ON CONFLICT (follower_id, following_id) DO NOTHING;
    
    -- Send acceptance notification
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (
      NEW.requester_id,
      'follow_accepted',
      'Follow request accepted!',
      (SELECT full_name FROM public.profiles WHERE user_id = NEW.requested_id LIMIT 1) || ' accepted your follow request!'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for follow request acceptance
DROP TRIGGER IF EXISTS on_follow_request_acceptance ON public.follow_requests;
CREATE TRIGGER on_follow_request_acceptance
  AFTER UPDATE ON public.follow_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_follow_request_acceptance();

-- Create function to send notification when follow request is created
CREATE OR REPLACE FUNCTION public.notify_follow_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Send notification to requested user
  INSERT INTO public.notifications (user_id, type, title, body)
  VALUES (
    NEW.requested_id,
    'follow_request',
    'New follow request',
    (SELECT full_name FROM public.profiles WHERE user_id = NEW.requester_id LIMIT 1) || ' wants to follow you!'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new follow requests
DROP TRIGGER IF EXISTS on_new_follow_request ON public.follow_requests;
CREATE TRIGGER on_new_follow_request
  AFTER INSERT ON public.follow_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_follow_request();

-- Add unique constraint on followers to prevent duplicates
ALTER TABLE public.followers DROP CONSTRAINT IF EXISTS followers_unique_pair;
ALTER TABLE public.followers ADD CONSTRAINT followers_unique_pair UNIQUE (follower_id, following_id);