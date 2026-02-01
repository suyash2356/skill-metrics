-- =====================================================
-- Resource Rating & Review System - Complete Schema
-- =====================================================

-- 1. Add aggregate columns to resources table
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS avg_rating numeric(3,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS weighted_rating numeric(3,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS recommend_percent integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS total_votes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- 2. Create resource_ratings table (1-5 stars)
CREATE TABLE public.resource_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  stars integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resource_ratings_stars_check CHECK (stars >= 1 AND stars <= 5),
  CONSTRAINT resource_ratings_unique UNIQUE (user_id, resource_id)
);

-- 3. Create resource_votes table (recommend/not recommend)
CREATE TABLE public.resource_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  vote_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resource_votes_type_check CHECK (vote_type IN ('up', 'down')),
  CONSTRAINT resource_votes_unique UNIQUE (user_id, resource_id)
);

-- 4. Create resource_reviews table
CREATE TABLE public.resource_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  review_text text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resource_reviews_text_length CHECK (length(review_text) >= 20 AND length(review_text) <= 2000),
  CONSTRAINT resource_reviews_unique UNIQUE (user_id, resource_id)
);

-- 5. Create resource_review_helpful table
CREATE TABLE public.resource_review_helpful (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  review_id uuid NOT NULL REFERENCES public.resource_reviews(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resource_review_helpful_unique UNIQUE (user_id, review_id)
);

-- =====================================================
-- Enable RLS on all new tables
-- =====================================================
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_review_helpful ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for resource_ratings
-- =====================================================
CREATE POLICY "Anyone can view ratings"
  ON public.resource_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate"
  ON public.resource_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rating"
  ON public.resource_ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rating"
  ON public.resource_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS Policies for resource_votes
-- =====================================================
CREATE POLICY "Anyone can view votes"
  ON public.resource_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.resource_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vote"
  ON public.resource_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vote"
  ON public.resource_votes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS Policies for resource_reviews
-- =====================================================
CREATE POLICY "Anyone can view reviews"
  ON public.resource_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can write reviews"
  ON public.resource_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.resource_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.resource_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS Policies for resource_review_helpful
-- =====================================================
CREATE POLICY "Anyone can view helpful votes"
  ON public.resource_review_helpful FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can mark helpful"
  ON public.resource_review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own helpful vote"
  ON public.resource_review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Database Functions
-- =====================================================

-- Function to check rate limit (max 5 ratings per day)
CREATE OR REPLACE FUNCTION public.check_rating_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  rating_count integer;
BEGIN
  SELECT COUNT(*) INTO rating_count
  FROM resource_ratings
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  RETURN rating_count < 5;
END;
$$;

-- Function to get site-wide average rating
CREATE OR REPLACE FUNCTION public.get_site_average_rating()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  avg_val numeric;
BEGIN
  SELECT COALESCE(AVG(stars), 3.5) INTO avg_val
  FROM resource_ratings;
  
  RETURN avg_val;
END;
$$;

-- Function to calculate weighted rating (IMDb formula)
CREATE OR REPLACE FUNCTION public.calculate_weighted_rating(p_resource_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v integer;      -- number of votes
  m integer := 10; -- minimum votes required
  r numeric;      -- average rating
  c numeric;      -- site average
  wr numeric;     -- weighted rating
BEGIN
  -- Get count and average for this resource
  SELECT COUNT(*), COALESCE(AVG(stars), 0)
  INTO v, r
  FROM resource_ratings
  WHERE resource_id = p_resource_id;
  
  -- Get site average
  c := get_site_average_rating();
  
  -- Calculate weighted rating: WR = (v/(v+m)) * R + (m/(v+m)) * C
  IF v = 0 THEN
    RETURN NULL;
  END IF;
  
  wr := (v::numeric / (v + m)::numeric) * r + (m::numeric / (v + m)::numeric) * c;
  
  RETURN ROUND(wr, 2);
END;
$$;

-- Function to update resource aggregates
CREATE OR REPLACE FUNCTION public.update_resource_aggregates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_resource_id uuid;
  new_avg numeric;
  new_weighted numeric;
  new_total integer;
  new_recommend_percent integer;
  new_total_votes integer;
  new_total_reviews integer;
  up_votes integer;
  down_votes integer;
BEGIN
  -- Determine which resource_id to update
  IF TG_OP = 'DELETE' THEN
    target_resource_id := OLD.resource_id;
  ELSE
    target_resource_id := NEW.resource_id;
  END IF;
  
  -- Calculate ratings aggregates
  SELECT COUNT(*), COALESCE(AVG(stars), NULL)
  INTO new_total, new_avg
  FROM resource_ratings
  WHERE resource_id = target_resource_id;
  
  -- Calculate weighted rating
  new_weighted := calculate_weighted_rating(target_resource_id);
  
  -- Calculate vote aggregates
  SELECT 
    COUNT(*) FILTER (WHERE vote_type = 'up'),
    COUNT(*) FILTER (WHERE vote_type = 'down')
  INTO up_votes, down_votes
  FROM resource_votes
  WHERE resource_id = target_resource_id;
  
  new_total_votes := up_votes + down_votes;
  
  IF new_total_votes > 0 THEN
    new_recommend_percent := ROUND((up_votes::numeric / new_total_votes::numeric) * 100);
  ELSE
    new_recommend_percent := NULL;
  END IF;
  
  -- Count reviews
  SELECT COUNT(*)
  INTO new_total_reviews
  FROM resource_reviews
  WHERE resource_id = target_resource_id;
  
  -- Update the resources table
  UPDATE resources
  SET 
    avg_rating = ROUND(new_avg, 2),
    weighted_rating = new_weighted,
    total_ratings = new_total,
    recommend_percent = new_recommend_percent,
    total_votes = new_total_votes,
    total_reviews = new_total_reviews
  WHERE id = target_resource_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Function to update helpful count on reviews
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_review_id uuid;
  new_count integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_review_id := OLD.review_id;
  ELSE
    target_review_id := NEW.review_id;
  END IF;
  
  SELECT COUNT(*)
  INTO new_count
  FROM resource_review_helpful
  WHERE review_id = target_review_id;
  
  UPDATE resource_reviews
  SET helpful_count = new_count
  WHERE id = target_review_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger for ratings changes
CREATE TRIGGER update_resource_aggregates_on_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.resource_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_aggregates();

-- Trigger for votes changes
CREATE TRIGGER update_resource_aggregates_on_vote
  AFTER INSERT OR UPDATE OR DELETE ON public.resource_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_aggregates();

-- Trigger for reviews changes
CREATE TRIGGER update_resource_aggregates_on_review
  AFTER INSERT OR DELETE ON public.resource_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_aggregates();

-- Trigger for helpful votes
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON public.resource_review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_helpful_count();

-- Trigger to update updated_at on ratings
CREATE TRIGGER set_updated_at_resource_ratings
  BEFORE UPDATE ON public.resource_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Trigger to update updated_at on reviews
CREATE TRIGGER set_updated_at_resource_reviews
  BEFORE UPDATE ON public.resource_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX idx_resource_ratings_resource_id ON public.resource_ratings(resource_id);
CREATE INDEX idx_resource_ratings_user_id ON public.resource_ratings(user_id);
CREATE INDEX idx_resource_votes_resource_id ON public.resource_votes(resource_id);
CREATE INDEX idx_resource_votes_user_id ON public.resource_votes(user_id);
CREATE INDEX idx_resource_reviews_resource_id ON public.resource_reviews(resource_id);
CREATE INDEX idx_resource_reviews_user_id ON public.resource_reviews(user_id);
CREATE INDEX idx_resource_review_helpful_review_id ON public.resource_review_helpful(review_id);