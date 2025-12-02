DROP POLICY IF EXISTS "Admins can update their communities" ON public.communities;
DROP POLICY IF EXISTS "Admins can delete their communities" ON public.communities;

DROP POLICY IF EXISTS "Users can view answers in their communities" ON public.community_answers;
DROP POLICY IF EXISTS "Users can create answers" ON public.community_answers;
DROP POLICY IF EXISTS "Users can update own answers" ON public.community_answers;
DROP POLICY IF EXISTS "Users can delete own answers" ON public.community_answers;
DROP POLICY IF EXISTS "community_answers_select_member_only" ON public.community_answers;
DROP POLICY IF EXISTS "community_answers_insert_member_check" ON public.community_answers;

DROP POLICY IF EXISTS "Users can view questions in their communities" ON public.community_questions;
DROP POLICY IF EXISTS "Users can create questions" ON public.community_questions;
DROP POLICY IF EXISTS "Users can update own questions" ON public.community_questions;
DROP POLICY IF EXISTS "Users can delete own questions" ON public.community_questions;
DROP POLICY IF EXISTS "community_questions_select_member_only" ON public.community_questions;
DROP POLICY IF EXISTS "community_questions_insert_member_check" ON public.community_questions;

DROP POLICY IF EXISTS "Users can view resources in their communities" ON public.community_resources;
DROP POLICY IF EXISTS "Users can create resources" ON public.community_resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.community_resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.community_resources;
DROP POLICY IF EXISTS "community_resources_select_member_only" ON public.community_resources;
DROP POLICY IF EXISTS "community_resources_insert_member_check" ON public.community_resources;

DROP POLICY IF EXISTS "Users can view projects in their communities" ON public.community_projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.community_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.community_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.community_projects;

DROP POLICY IF EXISTS "Users can view progress in their communities" ON public.progress_updates;
DROP POLICY IF EXISTS "Users can create own progress updates" ON public.progress_updates;
DROP POLICY IF EXISTS "Users can update own progress" ON public.progress_updates;
DROP POLICY IF EXISTS "Users can delete own progress" ON public.progress_updates;
DROP POLICY IF EXISTS "progress_updates_select_member_or_owner" ON public.progress_updates;
DROP POLICY IF EXISTS "progress_updates_insert_member_check" ON public.progress_updates;

DROP POLICY IF EXISTS "Users can view leaderboard in their communities" ON public.community_leaderboard;

DROP POLICY IF EXISTS "Users can view team members of their projects" ON public.project_team_members;
DROP POLICY IF EXISTS "Project owners can add team members" ON public.project_team_members;
DROP POLICY IF EXISTS "Project owners can remove team members" ON public.project_team_members;

DROP POLICY IF EXISTS "Members can view roles in their communities" ON public.community_member_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON public.community_member_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.community_member_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.community_member_roles;
DROP POLICY IF EXISTS "community_member_roles_insert_admin_only" ON public.community_member_roles;
DROP POLICY IF EXISTS "community_member_roles_update_admin_only" ON public.community_member_roles;

DROP POLICY IF EXISTS "Members can view messages in their communities" ON public.community_messages;
DROP POLICY IF EXISTS "Members can send messages in their communities" ON public.community_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.community_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.community_messages;
DROP POLICY IF EXISTS "community_messages_select_member_only" ON public.community_messages;
DROP POLICY IF EXISTS "community_messages_insert_member_check" ON public.community_messages;
DROP POLICY IF EXISTS "community_messages_update_owner_only" ON public.community_messages;
DROP POLICY IF EXISTS "community_messages_delete_owner_only" ON public.community_messages;