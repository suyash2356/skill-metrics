# Event-Sourced Schema for Two Recommendation Models

## Goal

Split the database into three clearly separated zones so the same user data is never stored twice and so two independent recommendation models can be trained from clean sources:

```text
ZONE A  IDENTITY        who the user is (one row per user per fact)
ZONE B  CATALOG         what a resource is (content model trains here)
ZONE C  ACTIVITY        what happened (behavior model trains here)
```

Today these are mixed: `interactions_ml`, `user_activity`, `user_seen_resources`, `recommendation_events`, `resource_votes`, `resource_ratings`, `likes`, `bookmarks` all record "a user touched a thing" in eight different shapes, and profile facts live in `profiles`, `user_profile_details`, and `user_preferences` at once.

## Zone A — Identity (consolidate 3 tables into 2)

| Table | Purpose | Key fields |
| --- | --- | --- |
| `profiles` | Public identity, one row per user. Stays the source of truth for display. | `user_id` PK/FK auth.users, `full_name`, `avatar_url`, `banner_url`, `bio`, `title`, `location` |
| `user_settings` | Private settings + learning taxonomy interests, one row per user. Merges `user_preferences` + the non-public half of `user_profile_details`. | `user_id` PK, `profile_visibility`, notification flags, `theme`, `language`, `timezone`, `primary_domain`, `interests[]`, `experience_level`, `skills` jsonb, social links jsonb |

Removed: duplicated `bio` / `location` / `job_title` in `user_profile_details`, duplicated `display_name` in `user_preferences`, and the stale denormalized counters (`total_posts`, `total_likes_received`, …) which become views over Zone C.

## Zone B — Catalog (resource-based model)

| Table | Purpose |
| --- | --- |
| `resources` | Trimmed to true content metadata only: title, description, link, `resource_type`, `domain`, `subdomain`, `category`, `subcategory`, `difficulty`, `language`, `provider`, `duration`, `is_free`, `is_active`. |
| `resource_skills` | Junction `(resource_id, skill_node_id)` replacing the free-text `related_skills[]`, so skills are joinable and typo-free. |
| `resource_stats` | All aggregates that today sit inside `resources` (`avg_rating`, `weighted_rating`, `total_ratings`, `recommend_percent`, `total_votes`, `total_reviews`, `view_count`). One row per resource, refreshed by trigger. |
| `skill_nodes`, `skill_dependencies` | Unchanged — already clean. |

Why split stats out of `resources`: the content model reads a stable, low-churn feature table, while write-heavy counters no longer invalidate resource cache rows on every vote.

## Zone C — Activity (user-behavior model)

One append-only event spine plus small typed satellites.

### `interaction_events` — the spine
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | bigint identity PK | monotonic, cheap for ordering |
| `user_id` | uuid FK | actor |
| `session_id` | uuid FK `user_sessions` | groups events into a visit → gives navigation path |
| `subject_type` | enum(`resource`,`post`,`roadmap`,`skill`,`profile`,`search`) | polymorphic target class |
| `subject_id` | uuid | target |
| `event_type` | enum(`impression`,`click`,`open`,`dwell`,`download`,`like`,`unlike`,`save`,`share`,`comment`,`rate`,`vote`,`complete`,`search`) | verb |
| `dwell_ms` | integer null | **session duration on a resource**, sent on `dwell` |
| `position` | integer null | rank in the list where it was seen (for CTR / A/B) |
| `surface` | text | `home`, `explore.degrees`, `skill_graph.step`, `search` … |
| `variant` | text null | A/B bucket |
| `model_version` | text null | which recommender produced the impression |
| `sequence_no` | integer | index of the event within its session → **navigation path** |
| `context` | jsonb | query text, filters, device — free-form, never used for joins |
| `occurred_at` | timestamptz | client time |
| `created_at` | timestamptz | server time |

Constraints: FK on `user_id`/`session_id`; partial unique on `(user_id, subject_id, event_type)` for idempotent verbs (`like`, `save`); RLS `user_id = auth.uid()` for insert/select, `service_role` full for training exports.

Indexes: `(user_id, occurred_at desc)`, `(subject_type, subject_id, event_type)`, `(session_id, sequence_no)`, BRIN on `occurred_at`. Monthly range partitioning on `occurred_at` so old partitions can be dropped or exported cheaply.

### Satellites (state, not events)
| Table | Purpose |
| --- | --- |
| `resource_ratings` | current 1–5 star per `(user_id, resource_id)`. Kept — it is state, not an event. |
| `resource_reviews` | review text. Kept. |
| `saved_items` | replaces `bookmarks` + `saved_posts` with `(user_id, subject_type, subject_id, collection_id, notes)`. |
| `post_engagement` | replaces `likes` — `(user_id, post_id)`; comments stay in `comments`. |

### Retired
`interactions_ml`, `user_activity`, `user_seen_resources`, `recommendation_events`, `bookmarks`, `resource_votes`, `post_preferences` — every one of these becomes a filter over `interaction_events`. `interactions_ml.score` becomes a derived view rather than stored data.

### Training views (stable model contracts)
- `v_user_item_implicit` — `(user_id, resource_id, score)` where score = weighted sum of event types + log-scaled `dwell_ms`, decayed by age. Input to the behavior model (ALS / sequence model).
- `v_session_sequences` — ordered `subject_id` arrays per session. Input to next-item / session-based models.
- `v_resource_features` — `resources ⋈ resource_stats ⋈ resource_skills`. Input to the content model.
- `v_recommendation_outcomes` — impressions joined to downstream clicks per `variant` / `model_version`, for offline eval and A/B readout.

## Why feed and resource data must be separate

- **Different write profiles.** Events are append-only and grow without bound; resources are edited rarely by admins. Mixing them forces one table to serve two incompatible index and vacuum strategies.
- **Different lifecycles.** Events are partitioned and expirable; catalog rows are permanent and referenced by roadmaps.
- **Different privacy classes.** Events are personal data behind strict RLS; the catalog is largely public. Separation makes that policy boundary trivial instead of per-column.
- **Different model inputs.** The content model must never see user identifiers; the behavior model must never depend on catalog text. Two zones, two views, two clean feature contracts.

## Migration approach (non-destructive, 5 stages)

1. Create Zone C spine + satellites + Zone B `resource_stats` / `resource_skills`. Nothing removed.
2. Backfill: copy `user_activity`, `interactions_ml`, `user_seen_resources`, `recommendation_events`, `likes`, `bookmarks`, `resource_votes` into `interaction_events` with mapped `event_type`; copy resource aggregates into `resource_stats`; split `related_skills[]` into `resource_skills`.
3. Add a single client tracking hook (`useTracking`) that writes only to `interaction_events`, including session start, `sequence_no`, and a `dwell` event on resource unmount/visibility change. Point `ml-recommend` and `useRecommendations` at the new views.
4. Run both paths in parallel, verify counts and recommendation output match, then stop writing to the legacy tables.
5. Drop legacy tables and the moved columns in a final migration.

Stages 1–3 are additive and reversible; the app keeps working throughout. Stage 5 is the only destructive step and happens only after verification.

## Technical notes

- Enums as Postgres `enum` types for `event_type` / `subject_type`, so bad verbs fail at insert time.
- Every new public table gets explicit `GRANT`s (`authenticated` scoped by RLS, `service_role` for edge functions and training exports) plus `ENABLE ROW LEVEL SECURITY`.
- Aggregates in `resource_stats` maintained by the existing trigger functions, retargeted.
- Dwell capture: `visibilitychange` + unmount timer in the resource preview components, capped at 30 min to reject idle tabs.
- Partitioning is created up front with a monthly `pg_cron` job to add the next partition.

## What I will not touch

Chat/messaging, roadmaps, notifications, follow graph, and admin tables stay as they are — they are already normalized and out of scope for the recommendation rework.
