## Complete List of Recommendation & Rule-Based Filtering (per page)

### 1. Home (`/`) — `src/pages/Home.tsx`
- **Feed posts**: chronological (newest-first) from `posts` table, enriched with relevance scores from `recommend-content` edge function (Gemini AI scoring per `usePersonalizedFeed`). News-bot posts pinned to score 100. Followed-users boost. Posts with score > 70 flagged "Recommended".
- **Suggested roadmaps sidebar**: AI relevance score from `recommend-content` (filtered > 30, sorted desc).
- **Top videos section**: `videosData` ranked by view count (top 3–4).
- **Rule filters**: RLS privacy (`can_view_profile`), follower-only visibility.

### 2. Explore (`/explore`) — `src/pages/Explore.tsx` + tabs
- **All tabs use `usePersonalizedExplore`** → `PersonalizationEngine` (`src/lib/personalization.ts`):
  - Rule-based weighted scoring on user `experience_level`, `skills`, `background`, `education`, `learning_path`, plus IMDb weighted_rating and recommend_percent.
- **ResourcesTab / CertificationsTab / DegreesTab / PopularTab**: `MLRecommendationsSection` → `ml-recommend` edge function (hybrid: CF z-score from `interactions_ml` + content match + popularity), `ignoreDomain: true` (all admin domains).
- **PopularTab**: `useTrendingResources` sorted by `weighted_rating`.
- **BlogsTab**: `useBlogsAndPapers` — rule-based filter by user onboarding (skills, background, education, experience).

### 3. Skill View / Skill Recommendations (`/skill/:id`, `/skill-recommendations`)
- **`MLRecommendationsSection`** → `ml-recommend` edge function, `ignoreDomain: false` (domain-scoped admin resources).
- **`fetchRecommendations`** (`src/api/searchAPI.tsx`) → topic-allowlist filter + `scoreResource` (rule-based) from `src/lib/resourceMatcher.ts` (skill match +8, goal match +6, free preference +5, beginner/expert boosts).

### 4. Search Results (`/search`) — `src/pages/SearchResults.tsx`
- `fetchUniversalSearch` — parallel DB queries (profiles, resources, posts, roadmaps), category-partitioned, rule-based ranking by trigram similarity + `is_free` badges.

### 5. Layout search bar (global) — `src/components/Layout.tsx`
- `fetchPeopleCommunitySuggestions` + `fetchExploreSuggestions` — autocomplete via `search_profiles` RPC + skills/domain allowlist.

### 6. New Videos (`/new-videos`)
- Pure rule-based: category filter + sort by views / newest / shortest / longest (local `videosData`).

### 7. Watch Hub / Watch Queue
- `useWatchQueue` — localStorage queue, daily target rule, like-based reordering. No ML.

### 8. My Roadmaps (`/my-roadmaps`)
- Rule-based status filter (in-progress / completed / not-started), ordered by `created_at` desc.

### 9. Create Roadmap / AI Roadmap (`/create-roadmap`)
- `generate-roadmap` edge function (Lovable AI / Gemini) generates structure; admin-verified `resources` table joined by rule-based matching on domain + difficulty.

### 10. Profile — Suggested follows / Resources tab
- `fetchPeopleCommunitySuggestions` (mutual followers + trigram similarity).
- `ProfileResourcesTab` — rule-based filter by user_id + section_type.

### 11. Chat / Share Post target list
- Mutual followers (rule: must follow each other) + groups user is in. No ranking model.

### 12. Notifications
- Chronological, type-filtered (rule-based), via SECURITY DEFINER RPCs.

### 13. Saved Posts / My Posts / Comments
- Pure SQL filter + chronological (newest-first). No recommendation.

### 14. Daily Tech News (background)
- `daily-tech-news` edge function — GNews API + Gemini summarization; rule-based dedup; 48-hour auto-cleanup.

---

### Recommendation engines summary
| Engine | Type | Where used |
|---|---|---|
| `ml-recommend` (Deno edge) | Hybrid: ALS-like CF (z-score on `interactions_ml`) + content + weighted_rating | Explore tabs, Skill pages |
| `recommend-content` (Gemini) | LLM relevance scoring | Home feed + sidebar roadmaps |
| `PersonalizationEngine` (`personalization.ts`) | Rule-based weighted scoring | Explore page entirely |
| `resourceMatcher.ts` (`scoreResource`) | Rule-based skill/goal/level matching | Skill pages, search results |
| `useBlogsAndPapers` | Rule-based onboarding filter | Explore Blogs tab |
| `useTrendingResources` | Popularity sort (`weighted_rating`) | Explore Popular tab |
| `fetchUniversalSearch` | Trigram + category partition | Search results |
| `videosData` sort | Rule-based (views/date/duration) | New Videos |
| `useWatchQueue` | Rule-based goals/streaks | Video Learning Hub |
| `daily-tech-news` (Gemini) | LLM summarization + dedup | News bot |
| `generate-roadmap` (Gemini) | LLM generation + DB rule-join | Roadmap creation |
