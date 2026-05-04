# SkillGram Hybrid Recommender

A production-style hybrid recommendation system for the **SkillGram** learning platform.
Combines collaborative filtering (implicit ALS), content-based retrieval (sentence
embeddings), and a re-ranker that blends both with quality priors.

> **Resume framing**: *"Built and evaluated a hybrid recommender (implicit ALS +
> sentence-transformer embeddings) over 800+ learning resources and 2k+ user
> interactions. Achieved Precision@10 = X, NDCG@10 = Y, with cold-start support via
> content fallback. Deployed scoring as a Supabase edge function."*

---

## 1. Architecture

```
                    ┌──────────────────────────────┐
                    │   Postgres (Supabase)        │
                    │   • interactions_ml          │
                    │   • resources                │
                    │   • user_preferences         │
                    └──────────┬───────────────────┘
                               │ scripts/export.py
                               ▼
                    ┌──────────────────────────────┐
                    │ data/                        │
                    │   interactions.parquet       │
                    │   resources.parquet          │
                    │   users.parquet              │
                    └──────────┬───────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  models/als.py          models/content.py       eval/metrics.py
  (implicit ALS)         (MiniLM embeddings)    (P@K, R@K, NDCG@K)
        │                      │
        └────────┬─────────────┘
                 ▼
          models/hybrid.py
          score = α·ALS + β·cosine + γ·weighted_rating
                 │
                 ▼
          artifacts/  (npz, faiss index, model card)
```

## 2. Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 1. Export training data from Supabase
export SUPABASE_URL="https://vecdjxbrkaqpvftwoafj.supabase.co"
export SUPABASE_ANON_KEY="..."          # publishable anon key
python scripts/export.py

# 2. Train ALS + content encoder
python -m models.als
python -m models.content

# 3. Evaluate
python -m eval.metrics
```

## 3. Dataset summary (live audit, May 2026)

| Entity                | Count |
|-----------------------|------:|
| Users                 |    16 |
| Active resources      |   783 |
| Interactions          | 2,155 |
| Density (sparsity)    | 17.2% |
| Domains               |     6 |
| Resources w/ outcomes |   710 |

Interaction weights:

| type     | implicit weight |
|----------|----------------:|
| view     | 1               |
| like     | 3               |
| complete | 5               |
| skip     | -2 (filtered)   |

## 4. Models

### 4.1 Collaborative — Implicit ALS
`models/als.py` uses the [`implicit`](https://github.com/benfred/implicit) library.
Hyper-params (held out 20% per user for validation):

- `factors = 64`
- `regularization = 0.05`
- `iterations = 30`
- BM25 weighting on the user-item matrix.

### 4.2 Content — Sentence-Transformers
`models/content.py` encodes `title + " " + description + " " + outcomes` with
`sentence-transformers/all-MiniLM-L6-v2` (384-d). Stored as a FAISS `IndexFlatIP`.
Used both for cold-start users and as a re-ranker feature.

### 4.3 Hybrid
`models/hybrid.py` produces final scores:

```
score(u, i) = α · z(als_score)
            + β · z(cosine_to_user_profile)
            + γ · z(weighted_rating)
            + δ · domain_match(u, i)
```

Defaults: α=0.55, β=0.30, γ=0.10, δ=0.05. Tuned on validation NDCG@10.

## 5. Evaluation

| Model              | P@10 | R@10 | NDCG@10 | Coverage |
|--------------------|-----:|-----:|--------:|---------:|
| Popularity baseline|  ?   |  ?   |    ?    |    ?     |
| ALS only           |  ?   |  ?   |    ?    |    ?     |
| Content only       |  ?   |  ?   |    ?    |    ?     |
| **Hybrid**         |  ?   |  ?   |    ?    |    ?     |

Numbers are filled in by `eval/metrics.py` and written to `artifacts/eval.md`.

## 6. Serving

Predictions are served from a Supabase edge function `ml-recommend` (in the main
SkillGram repo). It loads model artifacts from Supabase Storage, computes scores
on demand, and logs impressions to `recommendation_events` for online CTR tracking.

## 7. Roadmap

- [ ] LightGBM learning-to-rank for feed (post ranking).
- [ ] Sequence model over `user_skill_progress` for next-skill prediction.
- [ ] DistilBERT moderation classifier replacing the SQL keyword filter.
- [ ] Online evaluation: CTR by recommendation `reason` (personalized vs. popular).

## License
MIT — built as a portfolio project for the SkillGram platform.
