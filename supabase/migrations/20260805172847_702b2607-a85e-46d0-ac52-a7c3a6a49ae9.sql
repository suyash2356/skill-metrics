DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_inherits i ON i.inhrelid = c.oid
    JOIN pg_class p ON p.oid = i.inhparent
    WHERE n.nspname = 'public' AND p.relname = 'interaction_events'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t.relname);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t.relname);
    EXECUTE format('GRANT SELECT, INSERT ON public.%I TO authenticated', t.relname);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t.relname);
    EXECUTE format($f$CREATE POLICY "part_insert_own" ON public.%I FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())$f$, t.relname);
    EXECUTE format($f$CREATE POLICY "part_select_own" ON public.%I FOR SELECT TO authenticated USING (user_id = auth.uid())$f$, t.relname);
  END LOOP;
END $$;