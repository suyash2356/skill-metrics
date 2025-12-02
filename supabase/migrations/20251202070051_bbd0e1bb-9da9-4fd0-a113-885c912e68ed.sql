DROP TABLE public.community_members;
DROP TABLE public.communities;

CREATE TABLE public.external_community_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  link TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.external_community_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY ecl_select_own ON public.external_community_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ecl_insert_own ON public.external_community_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ecl_update_own ON public.external_community_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY ecl_delete_own ON public.external_community_links FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_external_community_links BEFORE UPDATE ON public.external_community_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY posts_select_public ON public.posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY comments_select_public ON public.comments FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id));