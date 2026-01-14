-- Fix INPUT_VALIDATION: Add database-level validation for posts table

-- 1. Add CHECK constraint for valid post categories (including all existing categories)
ALTER TABLE public.posts 
ADD CONSTRAINT valid_post_category 
CHECK (category IS NULL OR category IN (
  'Technology', 'Career', 'Resources', 'General', 'Non-Tech', 'Exam Prep', 
  'Education', 'Programming', 'Design', 'Business', 'Science', 'Other',
  'Discussion', 'News', 'Projects', 'Web Development'
));

-- 2. Create function to validate tags array
CREATE OR REPLACE FUNCTION public.validate_post_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow NULL tags
  IF NEW.tags IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check maximum number of tags (10)
  IF array_length(NEW.tags, 1) > 10 THEN
    RAISE EXCEPTION 'Too many tags. Maximum allowed is 10 tags per post.';
  END IF;
  
  -- Check each tag length (max 50 characters)
  FOR i IN 1..COALESCE(array_length(NEW.tags, 1), 0) LOOP
    IF length(NEW.tags[i]) > 50 THEN
      RAISE EXCEPTION 'Tag "%" is too long. Maximum tag length is 50 characters.', NEW.tags[i];
    END IF;
    
    -- Ensure no empty tags
    IF trim(NEW.tags[i]) = '' THEN
      RAISE EXCEPTION 'Empty tags are not allowed.';
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 3. Create trigger to validate tags on insert or update
DROP TRIGGER IF EXISTS check_post_tags_trigger ON public.posts;
CREATE TRIGGER check_post_tags_trigger
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_post_tags();