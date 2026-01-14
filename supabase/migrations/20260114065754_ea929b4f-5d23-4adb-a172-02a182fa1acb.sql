-- Create categories table to manage domains and exams
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('domain', 'exam')),
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing domains from resources
INSERT INTO public.categories (name, type, description)
SELECT DISTINCT category, 'domain', 'Domain category'
FROM public.resources
WHERE section_type = 'domain' OR section_type IS NULL
ON CONFLICT (name) DO NOTHING;

-- Insert existing exams from resources
INSERT INTO public.categories (name, type, description)
SELECT DISTINCT category, 'exam', 'Exam category'
FROM public.resources
WHERE section_type = 'exam'
ON CONFLICT (name) DO NOTHING;