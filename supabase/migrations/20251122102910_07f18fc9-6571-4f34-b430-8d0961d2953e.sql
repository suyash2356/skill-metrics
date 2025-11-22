-- Fix critical security issues before deployment

-- 1. Fix user_sessions RLS - only owner should see their sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_select_own" ON public.user_sessions;

CREATE POLICY "Users can only view own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own sessions"
ON public.user_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update own sessions"
ON public.user_sessions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete own sessions"
ON public.user_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Fix user_activity RLS - only owner should see their activity
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
DROP POLICY IF EXISTS "user_activity_select_own" ON public.user_activity;

CREATE POLICY "Users can only view own activity"
ON public.user_activity
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own activity"
ON public.user_activity
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Fix community_members visibility - only community members can see membership
DROP POLICY IF EXISTS "Memberships are viewable by everyone" ON public.community_members;

CREATE POLICY "Members can view community membership"
ON public.community_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = community_members.community_id
    AND cm.user_id = auth.uid()
  )
);

-- 4. Fix support_tickets - require user_id
DROP POLICY IF EXISTS "support_tickets_insert_owner_check" ON public.support_tickets;

CREATE POLICY "Users can only create own tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- 5. Fix videos table conflicting policies
DROP POLICY IF EXISTS "videos_select_none" ON public.videos;

-- Videos remain publicly viewable (keep existing policy)

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);