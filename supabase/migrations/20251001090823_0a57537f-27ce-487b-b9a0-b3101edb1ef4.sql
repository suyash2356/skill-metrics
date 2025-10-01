-- Enable RLS on tables that are missing it
ALTER TABLE IF EXISTS community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS community_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS community_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_team_members ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for community_answers
CREATE POLICY "Users can view answers in their communities" ON community_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      JOIN community_questions cq ON cq.community_id = cm.community_id
      WHERE cm.user_id = auth.uid() AND cq.id = community_answers.question_id
    )
  );

CREATE POLICY "Users can create answers" ON community_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers" ON community_answers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own answers" ON community_answers
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for community_questions
CREATE POLICY "Users can view questions in their communities" ON community_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_questions.community_id
    )
  );

CREATE POLICY "Users can create questions" ON community_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions" ON community_questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions" ON community_questions
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for community_resources
CREATE POLICY "Users can view resources in their communities" ON community_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_resources.community_id
    )
  );

CREATE POLICY "Users can create resources" ON community_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources" ON community_resources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources" ON community_resources
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for community_projects
CREATE POLICY "Users can view projects in their communities" ON community_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_projects.community_id
    )
  );

CREATE POLICY "Users can create projects" ON community_projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own projects" ON community_projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own projects" ON community_projects
  FOR DELETE USING (auth.uid() = created_by);

-- Add RLS policies for progress_updates
CREATE POLICY "Users can view progress in their communities" ON progress_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = progress_updates.community_id
    )
  );

CREATE POLICY "Users can create own progress updates" ON progress_updates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress_updates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON progress_updates
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for community_leaderboard
CREATE POLICY "Users can view leaderboard in their communities" ON community_leaderboard
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() AND cm.community_id = community_leaderboard.community_id
    )
  );

-- Add RLS policies for project_team_members
CREATE POLICY "Users can view team members of their projects" ON project_team_members
  FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM community_projects cp
      WHERE cp.id = project_team_members.project_id AND cp.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can add team members" ON project_team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_projects cp
      WHERE cp.id = project_team_members.project_id AND cp.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove team members" ON project_team_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM community_projects cp
      WHERE cp.id = project_team_members.project_id AND cp.created_by = auth.uid()
    )
  );