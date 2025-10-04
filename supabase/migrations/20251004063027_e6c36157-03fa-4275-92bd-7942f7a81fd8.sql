-- Fix foreign key constraints to reference profiles.user_id instead of profiles.id
-- This resolves the "Key is not present in table profiles" errors

-- Drop existing incorrect foreign keys if they exist
ALTER TABLE IF EXISTS public.progress_updates 
DROP CONSTRAINT IF EXISTS progress_updates_user_id_fkey;

ALTER TABLE IF EXISTS public.community_members 
DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;

ALTER TABLE IF EXISTS public.community_questions 
DROP CONSTRAINT IF EXISTS community_questions_user_id_fkey;

ALTER TABLE IF EXISTS public.community_answers 
DROP CONSTRAINT IF EXISTS community_answers_user_id_fkey;

ALTER TABLE IF EXISTS public.community_resources 
DROP CONSTRAINT IF EXISTS community_resources_user_id_fkey;

ALTER TABLE IF EXISTS public.community_leaderboard 
DROP CONSTRAINT IF EXISTS community_leaderboard_user_id_fkey;

-- Add correct foreign keys referencing profiles.user_id
ALTER TABLE public.progress_updates 
ADD CONSTRAINT progress_updates_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.community_members 
ADD CONSTRAINT community_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.community_questions 
ADD CONSTRAINT community_questions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.community_answers 
ADD CONSTRAINT community_answers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.community_resources 
ADD CONSTRAINT community_resources_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.community_leaderboard 
ADD CONSTRAINT community_leaderboard_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for community references
ALTER TABLE IF EXISTS public.progress_updates 
DROP CONSTRAINT IF EXISTS progress_updates_community_id_fkey;

ALTER TABLE public.progress_updates 
ADD CONSTRAINT progress_updates_community_id_fkey 
FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;

-- Add trigger to update community leaderboard when progress is added
CREATE OR REPLACE FUNCTION update_community_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.community_leaderboard (user_id, community_id, points, last_update)
  VALUES (NEW.user_id, NEW.community_id, 10, NOW())
  ON CONFLICT (user_id, community_id) 
  DO UPDATE SET 
    points = community_leaderboard.points + 10,
    last_update = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_leaderboard_on_progress
AFTER INSERT ON public.progress_updates
FOR EACH ROW
EXECUTE FUNCTION update_community_leaderboard();

-- Add unique constraint to leaderboard
ALTER TABLE public.community_leaderboard
DROP CONSTRAINT IF EXISTS community_leaderboard_user_community_unique;

ALTER TABLE public.community_leaderboard
ADD CONSTRAINT community_leaderboard_user_community_unique
UNIQUE (user_id, community_id);