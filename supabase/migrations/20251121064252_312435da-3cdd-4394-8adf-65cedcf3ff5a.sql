-- Add new columns to roadmap_steps for enhanced detailed roadmap data
ALTER TABLE roadmap_steps
ADD COLUMN IF NOT EXISTS estimated_hours integer,
ADD COLUMN IF NOT EXISTS learning_objectives jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS prerequisites jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS milestones jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tasks jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS common_pitfalls jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS assessment_criteria jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS real_world_examples jsonb DEFAULT '[]'::jsonb;

-- Add new columns to roadmap_step_resources for enhanced resource data
ALTER TABLE roadmap_step_resources
ADD COLUMN IF NOT EXISTS duration text,
ADD COLUMN IF NOT EXISTS difficulty text;

-- Add comments for documentation
COMMENT ON COLUMN roadmap_steps.estimated_hours IS 'Estimated hours to complete this step';
COMMENT ON COLUMN roadmap_steps.learning_objectives IS 'Array of specific learning objectives for this step';
COMMENT ON COLUMN roadmap_steps.prerequisites IS 'Array of prerequisites needed before starting this step';
COMMENT ON COLUMN roadmap_steps.milestones IS 'Array of milestone objects with title, description, and estimatedHours';
COMMENT ON COLUMN roadmap_steps.tasks IS 'Array of task objects with title, description, and difficulty';
COMMENT ON COLUMN roadmap_steps.common_pitfalls IS 'Array of common mistakes and how to avoid them';
COMMENT ON COLUMN roadmap_steps.assessment_criteria IS 'Array of criteria to assess mastery of this step';
COMMENT ON COLUMN roadmap_steps.real_world_examples IS 'Array of real-world applications and examples';
COMMENT ON COLUMN roadmap_step_resources.duration IS 'Time to complete/consume this resource';
COMMENT ON COLUMN roadmap_step_resources.difficulty IS 'Difficulty level of the resource (beginner, intermediate, advanced)';