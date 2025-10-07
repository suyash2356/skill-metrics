-- Create table to store roadmap skills/topics with their checked state
CREATE TABLE IF NOT EXISTS public.roadmap_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roadmap_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for roadmap skills
CREATE POLICY "Skills are viewable when roadmap is viewable"
ON public.roadmap_skills
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.roadmaps r
    WHERE r.id = roadmap_skills.roadmap_id
    AND (auth.uid() = r.user_id OR r.is_public = true)
  )
);

CREATE POLICY "Owner can insert skills"
ON public.roadmap_skills
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.roadmaps r
    WHERE r.id = roadmap_skills.roadmap_id
    AND auth.uid() = r.user_id
  )
);

CREATE POLICY "Owner can update skills"
ON public.roadmap_skills
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.roadmaps r
    WHERE r.id = roadmap_skills.roadmap_id
    AND auth.uid() = r.user_id
  )
);

CREATE POLICY "Owner can delete skills"
ON public.roadmap_skills
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.roadmaps r
    WHERE r.id = roadmap_skills.roadmap_id
    AND auth.uid() = r.user_id
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_roadmap_skills_updated_at
BEFORE UPDATE ON public.roadmap_skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();