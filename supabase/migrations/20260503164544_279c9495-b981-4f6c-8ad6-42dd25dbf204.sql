
-- 1. Schema additions for user interests
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS primary_domain text,
  ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_user_preferences_primary_domain ON public.user_preferences(primary_domain);

-- 2. Deactivate duplicate resources by link (keep best weighted_rating, then most ratings)
WITH ranked AS (
  SELECT id, link,
    ROW_NUMBER() OVER (
      PARTITION BY link
      ORDER BY COALESCE(weighted_rating,0) DESC, COALESCE(total_ratings,0) DESC, created_at ASC
    ) AS rn
  FROM public.resources
  WHERE is_active = true AND link IS NOT NULL
)
UPDATE public.resources r
SET is_active = false
FROM ranked
WHERE r.id = ranked.id AND ranked.rn > 1;

-- 3. Backfill learning_outcomes from description (split first 4 sentences)
UPDATE public.resources
SET learning_outcomes = (
  SELECT ARRAY(
    SELECT trim(s)
    FROM regexp_split_to_table(description, E'(?<=[.!?])\\s+') AS s
    WHERE length(trim(s)) > 12
    LIMIT 4
  )
)
WHERE is_active = true
  AND (learning_outcomes IS NULL OR array_length(learning_outcomes,1) IS NULL)
  AND description IS NOT NULL
  AND length(description) > 30;

-- 4. Synthetic interactions seeded by user×domain affinity
-- Step 4a: assign a primary_domain per existing user_preferences row (round-robin across real domains)
WITH domains AS (
  SELECT ARRAY['Machine Learning','Web Development','Arts','Finance','Exam Prep','General'] AS arr
),
numbered AS (
  SELECT user_id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn FROM public.user_preferences
)
UPDATE public.user_preferences up
SET primary_domain = (SELECT arr[1 + ((numbered.rn - 1) % 6)] FROM domains, numbered WHERE numbered.user_id = up.user_id)
WHERE up.primary_domain IS NULL;

-- Step 4b: ensure every profile has a user_preferences row
INSERT INTO public.user_preferences (user_id, primary_domain)
SELECT p.user_id,
  (ARRAY['Machine Learning','Web Development','Arts','Finance','Exam Prep','General'])[1 + (abs(hashtext(p.user_id::text)) % 6)]
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.user_preferences up WHERE up.user_id = p.user_id);

-- Step 4c: generate synthetic interactions
-- For each user, pick ~80 resources weighted toward their primary_domain (70%) and 30% from other domains
DO $$
DECLARE
  u record;
  r record;
  itype text;
  iscore numeric;
  pick_in_domain int;
  pick_out_domain int;
BEGIN
  FOR u IN SELECT p.user_id, COALESCE(up.primary_domain,'General') AS pd
           FROM public.profiles p
           LEFT JOIN public.user_preferences up ON up.user_id = p.user_id
  LOOP
    -- 60 in-domain picks
    FOR r IN
      SELECT id, domain FROM public.resources
      WHERE is_active = true AND domain = u.pd
      ORDER BY random() LIMIT 60
    LOOP
      -- weighted random interaction type
      SELECT t, s INTO itype, iscore FROM (VALUES
        ('view',1.0),('view',1.0),('view',1.0),
        ('like',3.0),('like',3.0),
        ('complete',5.0),
        ('skip',-2.0)
      ) AS x(t,s) ORDER BY random() LIMIT 1;

      INSERT INTO public.interactions_ml(user_id,item_id,item_type,interaction_type,score,created_at)
      VALUES (u.user_id, r.id, 'resource', itype, iscore, now() - (random()*30 || ' days')::interval)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- 30 out-of-domain picks (for diversity / cross-domain signal)
    FOR r IN
      SELECT id, domain FROM public.resources
      WHERE is_active = true AND domain <> u.pd
      ORDER BY random() LIMIT 30
    LOOP
      SELECT t, s INTO itype, iscore FROM (VALUES
        ('view',1.0),('view',1.0),('view',1.0),('view',1.0),
        ('skip',-2.0),('skip',-2.0),
        ('like',3.0)
      ) AS x(t,s) ORDER BY random() LIMIT 1;

      INSERT INTO public.interactions_ml(user_id,item_id,item_type,interaction_type,score,created_at)
      VALUES (u.user_id, r.id, 'resource', itype, iscore, now() - (random()*30 || ' days')::interval)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
