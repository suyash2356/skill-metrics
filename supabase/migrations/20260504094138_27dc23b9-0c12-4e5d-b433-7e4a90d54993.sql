ALTER TABLE public.recommendation_events
  ADD COLUMN IF NOT EXISTS surface text;

CREATE INDEX IF NOT EXISTS idx_recommendation_events_surface
  ON public.recommendation_events(surface, event_type, created_at DESC);