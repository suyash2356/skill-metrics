-- Fix notification spoofing vulnerability
-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

-- Create a restrictive policy - users can only insert notifications for themselves (test notifications)
CREATE POLICY "Users can create own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create SECURITY DEFINER functions for inter-user notifications

-- Function to send like notification
CREATE OR REPLACE FUNCTION public.send_like_notification(
  p_post_id uuid,
  p_post_owner_id uuid,
  p_post_title text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  liker_name text;
BEGIN
  -- Don't notify if user is liking their own post
  IF auth.uid() = p_post_owner_id THEN
    RETURN;
  END IF;
  
  -- Get the liker's name
  SELECT full_name INTO liker_name FROM profiles WHERE user_id = auth.uid();
  liker_name := COALESCE(liker_name, 'Someone');
  
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    p_post_owner_id,
    'like',
    liker_name || ' liked your post',
    p_post_title
  );
END;
$$;

-- Function to send comment notification
CREATE OR REPLACE FUNCTION public.send_comment_notification(
  p_post_id uuid,
  p_post_owner_id uuid,
  p_post_title text,
  p_comment_text text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  commenter_name text;
  truncated_comment text;
BEGIN
  -- Don't notify if user is commenting on their own post
  IF auth.uid() = p_post_owner_id THEN
    RETURN;
  END IF;
  
  -- Get the commenter's name
  SELECT full_name INTO commenter_name FROM profiles WHERE user_id = auth.uid();
  commenter_name := COALESCE(commenter_name, 'Someone');
  
  -- Truncate comment if too long
  truncated_comment := LEFT(p_comment_text, 100);
  IF LENGTH(p_comment_text) > 100 THEN
    truncated_comment := truncated_comment || '...';
  END IF;
  
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    p_post_owner_id,
    'comment',
    commenter_name || ' commented on your post',
    '"' || truncated_comment || '" on "' || p_post_title || '"'
  );
END;
$$;

-- Function to send follow notification
CREATE OR REPLACE FUNCTION public.send_follow_notification(
  p_followed_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_name text;
BEGIN
  -- Don't notify if following self
  IF auth.uid() = p_followed_user_id THEN
    RETURN;
  END IF;
  
  -- Get the follower's name
  SELECT full_name INTO follower_name FROM profiles WHERE user_id = auth.uid();
  follower_name := COALESCE(follower_name, 'Someone');
  
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    p_followed_user_id,
    'follow',
    follower_name || ' started following you',
    'You have a new follower!'
  );
END;
$$;

-- Function to send follow request notification
CREATE OR REPLACE FUNCTION public.send_follow_request_notification(
  p_requested_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_name text;
BEGIN
  -- Don't notify if requesting self
  IF auth.uid() = p_requested_user_id THEN
    RETURN;
  END IF;
  
  -- Get the requester's name
  SELECT full_name INTO requester_name FROM profiles WHERE user_id = auth.uid();
  requester_name := COALESCE(requester_name, 'Someone');
  
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    p_requested_user_id,
    'follow_request',
    requester_name || ' wants to follow you',
    'You have a new follow request'
  );
END;
$$;

-- Function to send follow accepted notification
CREATE OR REPLACE FUNCTION public.send_follow_accepted_notification(
  p_requester_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  accepter_name text;
BEGIN
  -- Don't notify if accepting self
  IF auth.uid() = p_requester_id THEN
    RETURN;
  END IF;
  
  -- Get the accepter's name
  SELECT full_name INTO accepter_name FROM profiles WHERE user_id = auth.uid();
  accepter_name := COALESCE(accepter_name, 'Someone');
  
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    p_requester_id,
    'follow_accepted',
    accepter_name || ' accepted your follow request',
    'You can now see their posts'
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.send_like_notification(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_comment_notification(uuid, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_follow_notification(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_follow_request_notification(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_follow_accepted_notification(uuid) TO authenticated;