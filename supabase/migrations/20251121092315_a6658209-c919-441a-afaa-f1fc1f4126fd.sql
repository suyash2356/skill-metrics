-- Add DELETE policy for followers table to allow users to unfollow
CREATE POLICY "followers_delete_owner_only"
ON public.followers
FOR DELETE
USING (auth.uid() = follower_id);