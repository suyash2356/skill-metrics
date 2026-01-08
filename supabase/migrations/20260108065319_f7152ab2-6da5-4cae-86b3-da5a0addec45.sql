-- Add new columns to resources table for better organization
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS resource_type text NOT NULL DEFAULT 'course',
ADD COLUMN IF NOT EXISTS section_type text NOT NULL DEFAULT 'domain',
ADD COLUMN IF NOT EXISTS target_countries text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estimated_time text,
ADD COLUMN IF NOT EXISTS prerequisites text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education_levels text[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.resources.resource_type IS 'Type of resource: course, video, book, blog, website, certification, degree, learning_path, coaching, exam_prep';
COMMENT ON COLUMN public.resources.section_type IS 'Section type: domain or exam';
COMMENT ON COLUMN public.resources.target_countries IS 'Countries where this resource is relevant';
COMMENT ON COLUMN public.resources.estimated_time IS 'Estimated time to complete';
COMMENT ON COLUMN public.resources.prerequisites IS 'Prerequisites needed';
COMMENT ON COLUMN public.resources.education_levels IS 'Relevant education levels: high-school, bachelors, masters, phd';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_resources_section_type ON public.resources(section_type);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);