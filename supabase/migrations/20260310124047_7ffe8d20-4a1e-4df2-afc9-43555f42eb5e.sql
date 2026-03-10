
-- Skill Graph: Nodes represent individual skills/topics
CREATE TABLE public.skill_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  domain text NOT NULL,
  subdomain text,
  description text,
  difficulty_level text NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer DEFAULT 10,
  content_type text NOT NULL DEFAULT 'tech' CHECK (content_type IN ('tech', 'exam', 'non-tech')),
  learning_outcomes text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skill Dependencies: Edges in the graph (prerequisite relationships)
CREATE TABLE public.skill_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES public.skill_nodes(id) ON DELETE CASCADE NOT NULL,
  prerequisite_id uuid REFERENCES public.skill_nodes(id) ON DELETE CASCADE NOT NULL,
  dependency_type text NOT NULL DEFAULT 'required' CHECK (dependency_type IN ('required', 'recommended', 'optional')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(skill_id, prerequisite_id)
);

-- User skill progress: Tracks which skills a user has completed/started
CREATE TABLE public.user_skill_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill_node_id uuid REFERENCES public.skill_nodes(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  confidence_level integer DEFAULT 0 CHECK (confidence_level >= 0 AND confidence_level <= 100),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_node_id)
);

-- Add new metadata columns to resources table
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS subdomain text,
  ADD COLUMN IF NOT EXISTS learning_outcomes text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS quality_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS recommended_stage text DEFAULT 'any',
  ADD COLUMN IF NOT EXISTS skill_node_id uuid REFERENCES public.skill_nodes(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_progress ENABLE ROW LEVEL SECURITY;

-- Skill nodes: publicly readable
CREATE POLICY "Anyone can view skill nodes" ON public.skill_nodes FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage skill nodes" ON public.skill_nodes FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Skill dependencies: publicly readable
CREATE POLICY "Anyone can view skill dependencies" ON public.skill_dependencies FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage skill dependencies" ON public.skill_dependencies FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- User skill progress: user-owned
CREATE POLICY "Users can view own progress" ON public.user_skill_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_skill_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_skill_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.user_skill_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_skill_nodes_domain ON public.skill_nodes(domain);
CREATE INDEX idx_skill_nodes_content_type ON public.skill_nodes(content_type);
CREATE INDEX idx_skill_dependencies_skill ON public.skill_dependencies(skill_id);
CREATE INDEX idx_skill_dependencies_prereq ON public.skill_dependencies(prerequisite_id);
CREATE INDEX idx_user_skill_progress_user ON public.user_skill_progress(user_id);
CREATE INDEX idx_resources_skill_node ON public.resources(skill_node_id);
CREATE INDEX idx_resources_subdomain ON public.resources(subdomain);
