-- Fix 1: Restrict profiles to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Restrict profile details to authenticated users only
DROP POLICY IF EXISTS "Profile details are viewable by everyone" ON public.user_profile_details;

CREATE POLICY "Authenticated users can view profile details"
ON public.user_profile_details FOR SELECT
TO authenticated
USING (true);

-- Fix 3: Add search_path to all functions for security
CREATE OR REPLACE FUNCTION public.set_updated_at_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_activity()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_activity 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_sessions 
  SET last_activity = NOW() 
  WHERE user_id = NEW.user_id AND is_active = true;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_default_collection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.saved_posts_collections (user_id, name, is_default)
  VALUES (NEW.user_id, 'All', true);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.migrate_profile_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT user_id, bio, location, title, avatar_url, full_name
    FROM public.profiles 
    WHERE bio IS NOT NULL OR location IS NOT NULL OR title IS NOT NULL
  LOOP
    INSERT INTO public.user_profile_details (
      user_id, bio, location, job_title, updated_at
    ) VALUES (
      profile_record.user_id,
      profile_record.bio,
      profile_record.location,
      profile_record.title,
      NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      bio = COALESCE(EXCLUDED.bio, user_profile_details.bio),
      location = COALESCE(EXCLUDED.location, user_profile_details.location),
      job_title = COALESCE(EXCLUDED.job_title, user_profile_details.job_title),
      updated_at = NOW();
  END LOOP;
  
  RAISE NOTICE 'Profile data migration completed';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_default_collections_for_existing_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.profiles
  LOOP
    INSERT INTO public.saved_posts_collections (user_id, name, is_default)
    VALUES (user_record.user_id, 'All', true)
    ON CONFLICT (user_id, name) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Default collections created for existing users';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_default_preferences_for_existing_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.profiles
  LOOP
    INSERT INTO public.user_preferences (user_id)
    VALUES (user_record.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Default preferences created for existing users';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Fix 4: Add database constraints for input validation
DO $$ 
BEGIN
  ALTER TABLE public.posts ADD CONSTRAINT title_length CHECK (char_length(title) <= 200);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.posts ADD CONSTRAINT content_length CHECK (char_length(content) <= 50000);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.comments ADD CONSTRAINT content_length CHECK (char_length(content) <= 5000);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT bio_length CHECK (char_length(bio) <= 500);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT full_name_length CHECK (char_length(full_name) <= 100);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Fix 5: Add explicit deny policies for videos table
CREATE POLICY "Only service role can insert videos"
ON public.videos FOR INSERT
WITH CHECK (false);

CREATE POLICY "Only service role can update videos"
ON public.videos FOR UPDATE
USING (false);

CREATE POLICY "Only service role can delete videos"
ON public.videos FOR DELETE
USING (false);