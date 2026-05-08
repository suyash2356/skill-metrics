
-- 1. Add language column
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'English';
CREATE INDEX IF NOT EXISTS idx_resources_language ON public.resources(language);
CREATE INDEX IF NOT EXISTS idx_resources_domain ON public.resources(domain);
CREATE INDEX IF NOT EXISTS idx_resources_difficulty ON public.resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON public.resources(resource_type);

-- 2. Normalize section_type 'content' -> 'domain'
UPDATE public.resources SET section_type='domain' WHERE section_type='content';

-- 3. Preserve granular category as subdomain
UPDATE public.resources
SET subdomain = category
WHERE (subdomain IS NULL OR subdomain = '') AND category IS NOT NULL;

-- 4. Canonical domain backfill from category + section_type
UPDATE public.resources r
SET domain = CASE
  WHEN r.section_type = 'exam' THEN 'Exam Prep'
  WHEN r.category ILIKE 'Exam Prep%' THEN 'Exam Prep'
  WHEN r.category IN (
    'Web Development','Mobile Development','Game Development','JavaScript','Python',
    'DSA','System Design','Database','Computer Science','DevOps','Cloud Computing',
    'Cybersecurity','Blockchain'
  ) THEN 'Technology'
  WHEN r.category IN (
    'AI/ML','Data Science','Machine Learning','Artificial Intelligence'
  ) THEN 'AI & Data'
  WHEN r.category IN (
    'UI/UX Design','Graphic Design','Design','Fashion Design','Interior Design',
    'Architecture','Animation','Film & Video','Photography','Fine Arts',
    'Arts & Painting','Performing Arts','Music','Dance','Creative Writing','Culinary Arts'
  ) THEN 'Arts & Design'
  WHEN r.category IN (
    'Finance','Finance & Accounting','Accounting','Investment','Business',
    'Business & Management','Management','Marketing','Digital Marketing',
    'Project Management','Communication'
  ) THEN 'Business & Finance'
  WHEN r.category IN (
    'Education','Psychology','Philosophy','Law','Journalism',
    'Health & Fitness','Environmental Science'
  ) THEN 'General Studies'
  ELSE COALESCE(NULLIF(r.domain,''), 'General')
END;

-- 5. Re-map existing domain='General' rows that did slip through but have a useful category
UPDATE public.resources r
SET domain = 'Technology'
WHERE domain = 'General' AND category IN (
  'Web Development','Mobile Development','Game Development','JavaScript','Python',
  'DSA','System Design','Database','Computer Science','DevOps','Cloud Computing',
  'Cybersecurity','Blockchain'
);

-- 6. Normalize difficulty values to canonical set
UPDATE public.resources
SET difficulty = lower(trim(difficulty));

UPDATE public.resources
SET difficulty = CASE
  WHEN difficulty IN ('beginner','intermediate','advanced','expert') THEN difficulty
  WHEN difficulty IN ('basic','easy','novice','starter') THEN 'beginner'
  WHEN difficulty IN ('medium','mid') THEN 'intermediate'
  WHEN difficulty IN ('hard','pro','professional') THEN 'advanced'
  WHEN difficulty IN ('master') THEN 'expert'
  ELSE 'beginner'
END;

-- 7. Normalize resource_type to canonical set
UPDATE public.resources
SET resource_type = lower(trim(resource_type));

UPDATE public.resources
SET resource_type = CASE
  WHEN resource_type IN ('article','blog post') THEN 'blog'
  WHEN resource_type IN ('tutorial') THEN 'course'
  WHEN resource_type IN ('specialization','learning_path') THEN 'learning_path'
  WHEN resource_type IN ('docs','documentation') THEN 'documentation'
  WHEN resource_type IN ('platform','tool','website') THEN 'website'
  WHEN resource_type IN ('test','practice','exam_prep') THEN 'exam_prep'
  ELSE resource_type
END
WHERE resource_type IS NOT NULL;

-- 8. Detect language from title/description for non-English content (basic heuristic: Hindi/Devanagari etc.)
UPDATE public.resources
SET language = 'Hindi'
WHERE (title ~ '[\u0900-\u097F]' OR description ~ '[\u0900-\u097F]');
