-- keep user_settings in sync with the legacy identity tables
CREATE OR REPLACE FUNCTION public.sync_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'user_preferences' THEN
    INSERT INTO user_settings (
      user_id, profile_visibility, show_online_status, allow_follow_requests,
      email_notifications, push_notifications, marketing_emails, login_notifications,
      two_factor_enabled, theme, language, timezone, primary_domain, interests
    ) VALUES (
      NEW.user_id,
      COALESCE(NEW.profile_visibility, 'public'),
      COALESCE(NEW.show_online_status, true),
      COALESCE(NEW.allow_follow_requests, true),
      COALESCE(NEW.email_notifications, true),
      COALESCE(NEW.push_notifications, true),
      COALESCE(NEW.marketing_emails, false),
      COALESCE(NEW.login_notifications, true),
      COALESCE(NEW.two_factor_enabled, false),
      COALESCE(NEW.theme, 'system'),
      COALESCE(NEW.language, 'en'),
      NEW.timezone, NEW.primary_domain, COALESCE(NEW.interests, '{}')
    )
    ON CONFLICT (user_id) DO UPDATE SET
      profile_visibility = EXCLUDED.profile_visibility,
      show_online_status = EXCLUDED.show_online_status,
      allow_follow_requests = EXCLUDED.allow_follow_requests,
      email_notifications = EXCLUDED.email_notifications,
      push_notifications = EXCLUDED.push_notifications,
      marketing_emails = EXCLUDED.marketing_emails,
      login_notifications = EXCLUDED.login_notifications,
      two_factor_enabled = EXCLUDED.two_factor_enabled,
      theme = EXCLUDED.theme,
      language = EXCLUDED.language,
      timezone = EXCLUDED.timezone,
      primary_domain = EXCLUDED.primary_domain,
      interests = EXCLUDED.interests,
      updated_at = now();
  ELSE
    INSERT INTO user_settings (
      user_id, interested_domains, interested_subdomains, experience_level,
      skills, social_links, portfolio_url, company
    ) VALUES (
      NEW.user_id,
      COALESCE(NEW.interested_domains, '{}'),
      COALESCE(NEW.interested_subdomains, '{}'),
      NEW.experience_level,
      COALESCE(NEW.skills, '[]'::jsonb),
      COALESCE(NEW.social_links, '{}'::jsonb),
      NEW.portfolio_url, NEW.company
    )
    ON CONFLICT (user_id) DO UPDATE SET
      interested_domains = EXCLUDED.interested_domains,
      interested_subdomains = EXCLUDED.interested_subdomains,
      experience_level = EXCLUDED.experience_level,
      skills = EXCLUDED.skills,
      social_links = EXCLUDED.social_links,
      portfolio_url = EXCLUDED.portfolio_url,
      company = EXCLUDED.company,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_settings_from_prefs
  AFTER INSERT OR UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_settings();

CREATE TRIGGER trg_sync_settings_from_details
  AFTER INSERT OR UPDATE ON public.user_profile_details
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_settings();

-- mirror resource aggregate changes into resource_stats + seed rows/skills
CREATE OR REPLACE FUNCTION public.sync_resource_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO resource_stats (
    resource_id, avg_rating, weighted_rating, total_ratings,
    recommend_percent, total_votes, total_reviews
  ) VALUES (
    NEW.id, NEW.avg_rating, NEW.weighted_rating, COALESCE(NEW.total_ratings, 0),
    NEW.recommend_percent, COALESCE(NEW.total_votes, 0), COALESCE(NEW.total_reviews, 0)
  )
  ON CONFLICT (resource_id) DO UPDATE SET
    avg_rating = EXCLUDED.avg_rating,
    weighted_rating = EXCLUDED.weighted_rating,
    total_ratings = EXCLUDED.total_ratings,
    recommend_percent = EXCLUDED.recommend_percent,
    total_votes = EXCLUDED.total_votes,
    total_reviews = EXCLUDED.total_reviews,
    updated_at = now();

  IF TG_OP = 'INSERT'
     OR NEW.related_skills IS DISTINCT FROM OLD.related_skills THEN
    DELETE FROM resource_skills WHERE resource_id = NEW.id;
    INSERT INTO resource_skills (resource_id, skill_name, skill_node_id)
    SELECT DISTINCT NEW.id, btrim(s),
           (SELECT sn.id FROM skill_nodes sn WHERE lower(sn.name) = lower(btrim(s)) LIMIT 1)
    FROM unnest(COALESCE(NEW.related_skills, '{}')) AS s
    WHERE btrim(s) <> ''
    ON CONFLICT (resource_id, skill_name) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_resource_stats
  AFTER INSERT OR UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.sync_resource_stats();

-- roll engagement counters from the event spine into resource_stats
CREATE OR REPLACE FUNCTION public.apply_event_to_resource_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.subject_type <> 'resource' OR NEW.subject_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO resource_stats (resource_id, view_count, click_count, total_dwell_ms)
  VALUES (
    NEW.subject_id,
    CASE WHEN NEW.event_type IN ('open','impression') THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'click' THEN 1 ELSE 0 END,
    COALESCE(NEW.dwell_ms, 0)
  )
  ON CONFLICT (resource_id) DO UPDATE SET
    view_count = resource_stats.view_count + EXCLUDED.view_count,
    click_count = resource_stats.click_count + EXCLUDED.click_count,
    total_dwell_ms = resource_stats.total_dwell_ms + EXCLUDED.total_dwell_ms,
    updated_at = now();

  RETURN NEW;
EXCEPTION WHEN foreign_key_violation THEN
  -- subject_id points at a non-resource row; ignore
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_event_resource_stats
  AFTER INSERT ON public.interaction_events
  FOR EACH ROW EXECUTE FUNCTION public.apply_event_to_resource_stats();

REVOKE ALL ON FUNCTION public.sync_user_settings() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_resource_stats() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_event_to_resource_stats() FROM anon, authenticated;