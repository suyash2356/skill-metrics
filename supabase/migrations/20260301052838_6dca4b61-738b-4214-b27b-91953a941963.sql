
-- Create user_resources table
CREATE TABLE public.user_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL DEFAULT 'link',
  category text NOT NULL,
  link text,
  file_url text,
  file_type text,
  difficulty text NOT NULL DEFAULT 'beginner',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  moderation_note text,
  is_active boolean NOT NULL DEFAULT true,
  view_count integer NOT NULL DEFAULT 0,
  avg_rating numeric,
  total_ratings integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_resources ENABLE ROW LEVEL SECURITY;

-- Users can insert their own resources
CREATE POLICY "Users can insert own resources"
ON public.user_resources FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can see approved resources + their own
CREATE POLICY "Users can view approved or own resources"
ON public.user_resources FOR SELECT
USING (
  (status = 'approved' AND is_active = true)
  OR auth.uid() = user_id
  OR is_admin()
);

-- Users can update their own resources (limited)
CREATE POLICY "Users can update own resources"
ON public.user_resources FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own resources
CREATE POLICY "Users can delete own resources"
ON public.user_resources FOR DELETE
USING (auth.uid() = user_id);

-- Admins can update any resource (for moderation)
CREATE POLICY "Admins can update any resource"
ON public.user_resources FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Updated at trigger
CREATE TRIGGER update_user_resources_updated_at
BEFORE UPDATE ON public.user_resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_resource_ratings table
CREATE TABLE public.user_resource_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.user_resources(id) ON DELETE CASCADE,
  stars integer NOT NULL CHECK (stars >= 1 AND stars <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

ALTER TABLE public.user_resource_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user resource ratings"
ON public.user_resource_ratings FOR SELECT USING (true);

CREATE POLICY "Auth users can rate"
ON public.user_resource_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rating"
ON public.user_resource_ratings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rating"
ON public.user_resource_ratings FOR DELETE
USING (auth.uid() = user_id);

-- Create user_resource_reports table
CREATE TABLE public.user_resource_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.user_resources(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_resource_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can report"
ON public.user_resource_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
ON public.user_resource_reports FOR SELECT
USING (auth.uid() = reporter_id OR is_admin());

-- Storage bucket for user resources
INSERT INTO storage.buckets (id, name, public) VALUES ('user-resources', 'user-resources', true);

-- Storage policies
CREATE POLICY "Anyone can view user resources files"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-resources');

CREATE POLICY "Auth users can upload resource files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-resources' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own resource files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resource files"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Profanity filter function
CREATE OR REPLACE FUNCTION public.check_user_resource_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  blocked_words text[] := ARRAY[
    'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'dick', 'pussy',
    'nigger', 'faggot', 'retard', 'slut', 'whore', 'bastard',
    'porn', 'xxx', 'nude', 'naked', 'sex video', 'hentai'
  ];
  word text;
  combined_text text;
BEGIN
  combined_text := lower(NEW.title || ' ' || NEW.description);
  
  FOREACH word IN ARRAY blocked_words LOOP
    IF combined_text LIKE '%' || word || '%' THEN
      NEW.status := 'flagged';
      NEW.moderation_note := 'Auto-flagged: contains blocked word "' || word || '"';
      RETURN NEW;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_user_resource_content_trigger
BEFORE INSERT OR UPDATE ON public.user_resources
FOR EACH ROW EXECUTE FUNCTION public.check_user_resource_content();

-- Trigger to update avg_rating on user_resource_ratings changes
CREATE OR REPLACE FUNCTION public.update_user_resource_aggregates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_id uuid;
  new_avg numeric;
  new_total integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_id := OLD.resource_id;
  ELSE
    target_id := NEW.resource_id;
  END IF;
  
  SELECT COUNT(*), COALESCE(AVG(stars), NULL)
  INTO new_total, new_avg
  FROM user_resource_ratings
  WHERE resource_id = target_id;
  
  UPDATE user_resources
  SET avg_rating = ROUND(new_avg, 2), total_ratings = new_total
  WHERE id = target_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_user_resource_aggregates_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_resource_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_user_resource_aggregates();
