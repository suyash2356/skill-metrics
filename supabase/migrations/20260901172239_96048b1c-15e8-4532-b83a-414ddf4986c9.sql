DROP POLICY IF EXISTS "Anyone can read post engagement" ON public.post_engagement;

CREATE POLICY "Signed-in users can read post engagement"
ON public.post_engagement
FOR SELECT
TO authenticated
USING (true);

REVOKE ALL ON TABLE public.post_engagement FROM anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.post_engagement TO authenticated;
GRANT ALL ON TABLE public.post_engagement TO service_role;