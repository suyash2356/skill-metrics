DROP POLICY IF EXISTS "comments_select_owner_or_post_public" ON public.comments;
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "posts_select_respect_privacy" ON public.posts;

ALTER TABLE public.posts DROP CONSTRAINT posts_community_id_fkey;
ALTER TABLE public.user_activity DROP CONSTRAINT user_activity_community_id_fkey;
ALTER TABLE public.posts DROP COLUMN community_id;
ALTER TABLE public.user_activity DROP COLUMN community_id;