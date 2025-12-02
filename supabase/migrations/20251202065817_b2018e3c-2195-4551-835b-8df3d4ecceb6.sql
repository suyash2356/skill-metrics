DROP POLICY IF EXISTS "communities_select_creator_or_member_only" ON public.communities;
DROP POLICY IF EXISTS "Public communities viewable by all" ON public.communities;
DROP POLICY IF EXISTS "communities_delete_creator_only" ON public.communities;
DROP POLICY IF EXISTS "communities_insert_creator_check" ON public.communities;
DROP POLICY IF EXISTS "communities_update_creator_only" ON public.communities;

DROP POLICY IF EXISTS "Members can view community membership" ON public.community_members;
DROP POLICY IF EXISTS "Users can join community" ON public.community_members;
DROP POLICY IF EXISTS "Users can leave community" ON public.community_members;
DROP POLICY IF EXISTS "community_members_delete_member_only" ON public.community_members;
DROP POLICY IF EXISTS "community_members_insert_member_check" ON public.community_members;
DROP POLICY IF EXISTS "community_members_select_member_only" ON public.community_members;