
# SkillGram ML/DL Integration — Audit Report & Roadmap

## Part 1 — Audit of your current recommendation model

### What you already built (verified against the live database)

- Table `interactions_ml` — 1,050 rows, 16 users, 330 unique items. Interaction types: `view` (500), `complete` (200), `like` (200), `skip` (150).
- Table `user_seen_resources` — used to filter out already-seen items.
- View `interactions_training_view` — aggregates `total_score` and `interaction_count` per (user, item).
- RPC `get_recommendations(user_id, [domain])` — returns top-10 unseen resources sorted by summed interaction score.
- Hook `src/hooks/useRecommendations.tsx` — wraps the RPC via React Query.
- Used in `src/pages/SkillRecommendations.tsx` (line 49, passed down to children at lines 301/472).

### Verdict — Is it working?

**Partially.** It returns results, but it is not really an ML model — it is a weighted SQL aggregation (popularity per user). Concretely:

1. **Bug — duplicate function signature.** Two `get_recommendations` overloads exist (1-arg and 2-arg). Calling `get_recommendations(uuid)` fails with `function is not unique`. The hook always passes the 2nd arg so the UI works, but the 1-arg version should be dropped.
2. **No collaborative signal.** It only sums *your own* interactions. A user who has never interacted gets nothing. It cannot recommend items similar users liked.
3. **No content signal.** It ignores `resources.domain`, `subdomain`, `difficulty`, `related_skills`, `learning_outcomes`, `prerequisites` — all of which are populated.
4. **Weak ranking.** Pure `SUM(score)` ties are broken arbitrarily — your test query returned 10 items all tied at score 5.
5. **No evaluation loop.** No precision@k / recall / CTR tracking, so you cannot prove the model works for a resume.
6. **Cold start ignored.** New users see nothing until they interact.
7. **Resume-wise it is too thin** to call a "recommendation system" — it is closer to "personalized SQL".

### Quick wins to make the existing model defensible

- Drop the duplicate overload.
- Add tie-breakers: `weighted_rating DESC, total_ratings DESC`.
- Add a content-based fallback for cold-start users (match `domain` + `difficulty` from `profiles` / `user_preferences`).
- Track `recommendation_impressions` and `recommendation_clicks` to compute CTR.

---

## Part 2 — Where ML/DL genuinely fits in SkillGram

The platform has 8 high-leverage surfaces. For each: what to build, which model, where the training data already exists, and resume framing.

### 1. Resource recommender (the one you started)
- **Models**: Hybrid of (a) Matrix Factorization / ALS on `interactions_ml` for collaborative filtering, (b) a content-based encoder using Sentence-Transformers on `title + description + learning_outcomes`, (c) a re-ranker that blends the two with `weighted_rating` and freshness.
- **Why hybrid**: solves cold-start (content) + personalization (CF).
- **Resume line**: "Built hybrid recommender (ALS + sentence-transformer embeddings) serving 500+ resources, improved CTR by X%."

### 2. Feed ranking (Home page)
- Currently rule-based with bot-pinning + AI scoring. Replace the score with a **learning-to-rank** model (LightGBM ranker) trained on `likes`, `bookmarks`, dwell time, `post_preferences` (Not Interested), and viewer/author affinity.
- Features: author similarity, tag overlap with user skills, post age, engagement velocity.
- **Resume line**: "Implemented LambdaMART learning-to-rank for feed, replaced heuristic baseline."

### 3. Skill graph next-step prediction
- You already have 500+ skill nodes and `user_skill_progress`. Train a **sequence model** (GRU or Transformer) that, given the user's completion sequence, predicts the most likely successful next node — like Duolingo's HLR.
- **Resume line**: "Sequence model for adaptive learning-path prediction over 500-node skill graph."

### 4. Roadmap auto-generation
- Today `generate-roadmap` calls Gemini. Add an ML layer that picks **which resources** to slot into each step using your hybrid recommender + difficulty-fit (predicted from the user's `learning_streaks` and prior `focus_sessions` outcomes).
- **Resume line**: "ML-driven curriculum generator combining LLM structure with embedding-based resource retrieval."

### 5. Semantic search (Explore + global search)
- Replace `ILIKE` queries in `searchAPI.tsx` with **vector search**. Embed every resource/post/roadmap once with `sentence-transformers/all-MiniLM-L6-v2`, store in `pgvector`, query with cosine similarity.
- **Resume line**: "Semantic search over 5 entity types using pgvector + MiniLM embeddings."

### 6. Content moderation (posts, user_resources, comments)
- `check_user_resource_content` uses a hard-coded blocklist. Replace with a fine-tuned **DistilBERT classifier** (toxic / spam / off-topic). Run as an edge function on insert.
- **Resume line**: "Deployed DistilBERT moderation classifier reducing manual review by Y%."

### 7. Duplicate / similar resource detection
- 750+ resources with overlap. Use embedding clustering (HDBSCAN on MiniLM vectors) to flag near-duplicates for the admin panel.
- **Resume line**: "Deduplication pipeline using HDBSCAN over sentence embeddings."

### 8. Engagement / churn prediction
- Train an **XGBoost** model on `user_activity`, `learning_streaks`, `focus_sessions` to predict 7-day churn. Surface "at risk" users to a re-engagement campaign (notification or news-bot DM).
- **Resume line**: "Churn-prediction model (XGBoost, AUC 0.8X) driving retention notifications."

---

## Part 3 — Recommended architecture (works on free tiers)

```text
            ┌─────────────────────────────────────────┐
            │  React app (Lovable)                    │
            │   • useRecommendations                  │
            │   • useFeedRanking                      │
            │   • useSemanticSearch                   │
            └──────────────┬──────────────────────────┘
                           │ supabase.functions.invoke
                           ▼
            ┌─────────────────────────────────────────┐
            │  Supabase Edge Functions (Deno)         │
            │   • ml-recommend     (hybrid recsys)    │
            │   • ml-rank-feed     (LTR scoring)      │
            │   • ml-semantic-search (pgvector query) │
            │   • ml-moderate      (text classifier)  │
            └──────┬─────────────────────────┬────────┘
                   │ HF Inference API        │ pgvector
                   ▼                         ▼
            ┌──────────────┐       ┌────────────────────┐
            │ Hugging Face │       │ Postgres           │
            │ hosted model │       │ • interactions_ml  │
            │ (your repo)  │       │ • resource_embed   │
            └──────────────┘       │ • user_embed       │
                                   └────────────────────┘
                   ▲
                   │ nightly retrain (GitHub Action / Colab)
            ┌──────┴───────┐
            │ Python repo  │
            │ • train.py   │  (ALS, LightGBM, embeddings)
            │ • eval.py    │
            │ • push to HF │
            └──────────────┘
```

Why this works: training stays in **your own Python repo** (real ML code for the resume), serving stays in edge functions you already have, and Hugging Face Inference API is free for low traffic.

---

## Part 4 — Suggested build order (so you have a real portfolio piece)

1. **Fix the existing recommender** — drop duplicate RPC, add tie-break, add cold-start fallback, add impression/click logging. *(1 file + 1 migration)*
2. **Add `pgvector` + embeddings** for resources and posts (one-time backfill edge function).
3. **Build `ml-recommend` edge function** that calls a Python model on Hugging Face (your repo) and returns hybrid scores.
4. **Build the Python training repo** (separate GitHub repo you control) with ALS + content encoder, eval script, README — this is the actual resume artifact.
5. **Replace feed AI scoring with LTR model** trained on real interaction logs.
6. **Add semantic search**, then moderation classifier, then churn model in that order.

---

## Technical notes

- All models can be hosted free on Hugging Face Hub; the edge function calls `https://api-inference.huggingface.co/...` using the existing `HUGGING_FACE_ACCESS_TOKEN` secret.
- `pgvector` requires `CREATE EXTENSION vector;` — done via migration.
- Training data export: the `interactions_training_view` already exists and is a clean training set.
- For resume credibility, keep the Python repo **separate from Lovable**, with notebooks, metrics, and a model card — recruiters will look at that, not the React code.

---

## What I would do first if you approve

Concrete next coding step (one focused PR):

1. Migration: drop the 1-arg `get_recommendations`, rewrite the 2-arg version with tie-breakers + content fallback, create `recommendation_events` table for impressions/clicks.
2. Update `useRecommendations` to log impressions.
3. Add a small "Why recommended" badge in `SkillRecommendations.tsx` so the personalization is visible.

After you approve, I will switch to build mode and start with step 1. Tell me if you want to begin there, or jump straight to pgvector + embeddings, or scaffold the Python training repo structure first.
