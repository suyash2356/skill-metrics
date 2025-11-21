-- Create table to track user post preferences
CREATE TABLE IF NOT EXISTS public.post_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  preference_type text NOT NULL CHECK (preference_type IN ('interested', 'not_interested')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE public.post_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_preferences
CREATE POLICY "Users can view own preferences"
ON public.post_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
ON public.post_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON public.post_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
ON public.post_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create table for post reports
CREATE TABLE IF NOT EXISTS public.post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))
);

-- Enable RLS
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_reports
CREATE POLICY "Users can create reports"
ON public.post_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
ON public.post_reports
FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_preferences_user_post ON public.post_preferences(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_post_reports_post ON public.post_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reports_status ON public.post_reports(status);