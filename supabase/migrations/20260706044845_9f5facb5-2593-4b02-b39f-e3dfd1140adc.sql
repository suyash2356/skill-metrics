
-- 1. Fix broken conversations group admin update policy (self-join bug)
DROP POLICY IF EXISTS "Group admins can update conversation" ON public.conversations;
CREATE POLICY "Group admins can update conversation" ON public.conversations
FOR UPDATE
USING (
  is_group = true AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
      AND cp.role = 'admin'
  )
)
WITH CHECK (
  is_group = true AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
      AND cp.role = 'admin'
  )
);

-- 2. interactions_ml: add owner-only SELECT
DROP POLICY IF EXISTS "Users can read own interactions" ON public.interactions_ml;
CREATE POLICY "Users can read own interactions" ON public.interactions_ml
FOR SELECT USING (auth.uid() = user_id);

-- 3. user_seen_resources: add owner-only SELECT
DROP POLICY IF EXISTS "Users can read own seen resources" ON public.user_seen_resources;
CREATE POLICY "Users can read own seen resources" ON public.user_seen_resources
FOR SELECT USING (auth.uid() = user_id);

-- 4. user_activity: drop broad/legacy SELECT policies that leaked IP + device data
DROP POLICY IF EXISTS "Activity visibility" ON public.user_activity;
DROP POLICY IF EXISTS "activity_select_respect_privacy" ON public.user_activity;
DROP POLICY IF EXISTS "Users can only view own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can view own activity only" ON public.user_activity;
-- Keep single owner-only SELECT
DROP POLICY IF EXISTS "user_activity_select_owner_only" ON public.user_activity;
CREATE POLICY "user_activity_select_owner_only" ON public.user_activity
FOR SELECT USING (auth.uid() = user_id);
-- Consolidate duplicate INSERT policies
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can insert own activity only" ON public.user_activity;
DROP POLICY IF EXISTS "Users can only insert own activity" ON public.user_activity;

-- 5. Fix SECURITY DEFINER view: recreate as invoker
DROP VIEW IF EXISTS public.interactions_training_view;
CREATE VIEW public.interactions_training_view
WITH (security_invoker = true) AS
SELECT * FROM public.interactions_ml;
GRANT SELECT ON public.interactions_training_view TO authenticated, service_role;

-- 6. Storage: drop broad SELECT list policies on public buckets
--    Direct public-URL reads still work because buckets remain public.
DROP POLICY IF EXISTS "Anyone can view post media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view user resources files" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- 7. Fix is_admin() (no-arg) search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
$function$;

-- 8. Revoke EXECUTE on all public SECURITY DEFINER functions from anon/PUBLIC.
--    Signed-in users still access them via GRANT to authenticated below,
--    and edge functions use service_role which retains ALL by default.
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon',
                   fn.nspname, fn.proname, fn.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO authenticated, service_role',
                   fn.nspname, fn.proname, fn.args);
  END LOOP;
END $$;
