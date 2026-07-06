
-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts (user_id, created_at DESC);

-- Likes / comments / saved / bookmarks per post
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON public.comments (post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_created ON public.saved_posts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON public.saved_posts (post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON public.bookmarks (post_id);

-- Followers
CREATE INDEX IF NOT EXISTS idx_followers_following_status ON public.followers (following_id, status);
CREATE INDEX IF NOT EXISTS idx_followers_follower_status ON public.followers (follower_id, status);

-- Follow requests
CREATE INDEX IF NOT EXISTS idx_follow_requests_requested_status ON public.follow_requests (requested_id, status);
CREATE INDEX IF NOT EXISTS idx_follow_requests_requester_status ON public.follow_requests (requester_id, status);

-- Resources (admin curated)
CREATE INDEX IF NOT EXISTS idx_resources_active_category ON public.resources (is_active, category);
CREATE INDEX IF NOT EXISTS idx_resources_active_weighted ON public.resources (is_active, weighted_rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_resources_category_lower ON public.resources (lower(category));
CREATE INDEX IF NOT EXISTS idx_resources_domain_lower ON public.resources (lower(domain));

-- User-contributed resources
CREATE INDEX IF NOT EXISTS idx_user_resources_status_active_category ON public.user_resources (status, is_active, category);
CREATE INDEX IF NOT EXISTS idx_user_resources_user_created ON public.user_resources (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_resources_status_created ON public.user_resources (status, created_at DESC);

-- Recommendation events
CREATE INDEX IF NOT EXISTS idx_rec_events_user_created ON public.recommendation_events (user_id, created_at DESC);

-- User activity / sessions
CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON public.user_activity (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_active ON public.user_sessions (user_id, is_active);

-- Focus sessions
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_started ON public.focus_sessions (user_id, started_at DESC);

-- Message reactions
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON public.message_reactions (message_id);

-- Roadmaps
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_created ON public.roadmaps (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roadmap_steps_roadmap_order ON public.roadmap_steps (roadmap_id, order_index);

-- Profiles full-name search (trigram) for search_profiles RPC
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_profiles_full_name_trgm ON public.profiles USING gin (full_name gin_trgm_ops);

-- Resources title/description trigram for universal search
CREATE INDEX IF NOT EXISTS idx_resources_title_trgm ON public.resources USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_user_resources_title_trgm ON public.user_resources USING gin (title gin_trgm_ops);
