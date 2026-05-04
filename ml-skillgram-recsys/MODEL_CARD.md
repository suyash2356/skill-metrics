# Model Card — SkillGram Hybrid Recommender v1

**Owner**: Suyash Anil Babad — portfolio project, May 2026.

## Intended use
Recommend learning resources (courses, articles, videos) to logged-in SkillGram
users, both for personalized "for you" surfaces and cold-start onboarding.

## Training data
- 2,155 implicit-feedback interactions from 16 users over 612 of 783 active resources.
- Synthetic boost: ~1,500 rows generated from each user's `primary_domain` to break
  the cold-start floor while real engagement accrues. Synthetic-only rows are tagged
  in `metadata` for later filtering.
- Resource text: `title + description + learning_outcomes + related_skills`.

## Architecture
Hybrid: implicit ALS (factors=64) + sentence-transformer (`all-MiniLM-L6-v2`) +
weighted_rating prior + domain match. Final score is a z-score weighted sum.

## Evaluation
Leave-one-out per user, K=10. Metrics: Precision, Recall, NDCG, Coverage.
See `artifacts/eval.md` after running `python -m eval.metrics`.

## Limitations
- Tiny user base (16). Collaborative signal is weak; content + popularity dominate.
- Synthetic interactions bias the model toward declared `primary_domain`.
- No demographic, fairness, or toxicity filters in this version.

## Ethical considerations
- Recommendations may amplify popularity bias. Diversity penalty is on the roadmap.
- Free vs paid resources are not yet balanced — could discourage open content.

## Maintenance
Re-train weekly as `interactions_ml` grows. Promote to v2 once organic interactions
exceed 10k and synthetic share drops below 20%.
