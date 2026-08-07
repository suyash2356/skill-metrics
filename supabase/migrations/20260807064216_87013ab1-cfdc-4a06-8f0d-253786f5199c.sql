
-- ============================================================
-- 1. Wrap auth.uid() in a scalar subquery in every RLS policy
--    so it is evaluated ONCE per statement, not once per row.
-- ============================================================
DO $do$
DECLARE
  r record;
  v_qual text;
  v_check text;
  v_sql text;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (coalesce(qual,'') || coalesce(with_check,'')) LIKE '%auth.uid()%'
  LOOP
    -- unwrap already-wrapped forms first so we never double wrap
    v_qual := replace(coalesce(r.qual, ''), '( SELECT auth.uid() AS uid)', 'auth.uid()');
    v_check := replace(coalesce(r.with_check, ''), '( SELECT auth.uid() AS uid)', 'auth.uid()');
    v_qual := replace(v_qual, 'auth.uid()', '(SELECT auth.uid())');
    v_check := replace(v_check, 'auth.uid()', '(SELECT auth.uid())');

    v_sql := format('ALTER POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    IF r.qual IS NOT NULL THEN
      v_sql := v_sql || format(' USING (%s)', v_qual);
    END IF;
    IF r.with_check IS NOT NULL THEN
      v_sql := v_sql || format(' WITH CHECK (%s)', v_check);
    END IF;

    BEGIN
      EXECUTE v_sql;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'skipped policy % on %: %', r.policyname, r.tablename, SQLERRM;
    END;
  END LOOP;
END
$do$;

-- ============================================================
-- 2. Drop semantically duplicate permissive policies
--    (same table, same command, same roles, same expression)
-- ============================================================
DO $do$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tablename, policyname
    FROM (
      SELECT tablename, policyname,
             row_number() OVER (
               PARTITION BY tablename, cmd, roles::text,
                            coalesce(qual,''), coalesce(with_check,'')
               ORDER BY policyname
             ) AS rn
      FROM pg_policies
      WHERE schemaname = 'public' AND permissive = 'PERMISSIVE'
    ) d
    WHERE d.rn > 1
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END
$do$;

-- ============================================================
-- 3. Missing foreign-key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_comments_roadmap_id ON public.comments (roadmap_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_step_id ON public.focus_sessions (step_id);
CREATE INDEX IF NOT EXISTS idx_messages_shared_resource_id ON public.messages (shared_resource_id);
CREATE INDEX IF NOT EXISTS idx_messages_shared_post_id ON public.messages (shared_post_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id ON public.messages (reply_to_id);
CREATE INDEX IF NOT EXISTS idx_post_preferences_post_id ON public.post_preferences (post_id);
CREATE INDEX IF NOT EXISTS idx_post_reports_reporter_id ON public.post_reports (reporter_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_step_resources_step_id ON public.roadmap_step_resources (step_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_templates_roadmap_id ON public.roadmap_templates (roadmap_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_collection_id ON public.saved_items (collection_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_collection_id ON public.saved_posts (collection_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_target_user_id ON public.user_activity (target_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_post_id ON public.user_activity (post_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_roadmap_id ON public.user_activity (roadmap_id);
CREATE INDEX IF NOT EXISTS idx_user_resource_ratings_resource_id ON public.user_resource_ratings (resource_id);
CREATE INDEX IF NOT EXISTS idx_user_resource_reports_resource_id ON public.user_resource_reports (resource_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_progress_skill_node_id ON public.user_skill_progress (skill_node_id);

-- ============================================================
-- 4. Indexes matched to the slowest observed catalogue queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resources_featured_weighted
  ON public.resources (is_active, is_featured, weighted_rating DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_resources_type_title
  ON public.resources (resource_type, title);

CREATE INDEX IF NOT EXISTS idx_resources_section_category_created
  ON public.resources (section_type, category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resources_category_created
  ON public.resources (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resources_active_created
  ON public.resources (is_active, created_at DESC);

-- ============================================================
-- 5. Refresh planner statistics on the hottest tables
-- ============================================================
ANALYZE public.resources;
ANALYZE public.posts;
ANALYZE public.profiles;
ANALYZE public.messages;
ANALYZE public.conversation_participants;
