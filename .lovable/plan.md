
# Resource Rating & Review System Implementation Plan

## Overview
This plan implements a comprehensive, trustworthy resource rating system inspired by IMDb and Rotten Tomatoes. Users will be able to rate resources (1-5 stars), recommend/not recommend (binary vote), and write detailed reviews. The system includes anti-fraud measures and weighted scoring algorithms.

---

## Database Schema Design

### Table 1: `resource_ratings` - Star Ratings (1-5)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users (NOT NULL) |
| resource_id | uuid | Foreign key to resources |
| stars | integer | Rating value 1-5 |
| created_at | timestamp | When rating was created |
| updated_at | timestamp | When rating was last modified |

**Constraints:**
- UNIQUE(user_id, resource_id) - One rating per user per resource
- CHECK(stars >= 1 AND stars <= 5)

### Table 2: `resource_votes` - Recommend/Not Recommend
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users (NOT NULL) |
| resource_id | uuid | Foreign key to resources |
| vote_type | text | Either 'up' or 'down' |
| created_at | timestamp | When vote was cast |

**Constraints:**
- UNIQUE(user_id, resource_id)
- CHECK(vote_type IN ('up', 'down'))

### Table 3: `resource_reviews` - Written Reviews
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users (NOT NULL) |
| resource_id | uuid | Foreign key to resources |
| review_text | text | The review content (max 2000 chars) |
| is_verified | boolean | User marked "I completed this" |
| helpful_count | integer | Number of "helpful" votes |
| created_at | timestamp | When review was written |
| updated_at | timestamp | When review was last edited |

**Constraints:**
- UNIQUE(user_id, resource_id)
- CHECK(length(review_text) >= 20 AND length(review_text) <= 2000)

### Table 4: `resource_review_helpful` - Helpful Votes for Reviews
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Who found it helpful |
| review_id | uuid | Which review |
| created_at | timestamp | When marked helpful |

**Constraints:**
- UNIQUE(user_id, review_id)

### Update `resources` Table - Add Aggregate Columns
| New Column | Type | Description |
|------------|------|-------------|
| avg_rating | numeric(3,2) | Calculated average rating |
| weighted_rating | numeric(3,2) | IMDb-style weighted rating |
| total_ratings | integer | Total number of ratings |
| recommend_percent | integer | Percentage recommending (0-100) |
| total_votes | integer | Total up + down votes |
| total_reviews | integer | Number of written reviews |

---

## Row Level Security (RLS) Policies

### resource_ratings
- **SELECT**: Anyone can view ratings (public data)
- **INSERT**: Authenticated users can rate (user_id = auth.uid())
- **UPDATE**: Users can update their own rating only
- **DELETE**: Users can delete their own rating only

### resource_votes
- **SELECT**: Anyone can view votes
- **INSERT**: Authenticated users only (user_id = auth.uid())
- **UPDATE**: Users can change their own vote
- **DELETE**: Users can remove their vote

### resource_reviews
- **SELECT**: Anyone can view reviews
- **INSERT**: Authenticated users only (user_id = auth.uid())
- **UPDATE**: Users can edit their own reviews
- **DELETE**: Users can delete their own reviews

---

## Database Functions

### 1. `calculate_weighted_rating(resource_id uuid)`
Implements the IMDb weighted rating formula:
```
WR = (v / (v + m)) * R + (m / (v + m)) * C
```
Where:
- R = average rating of the resource
- v = number of votes for the resource
- m = minimum votes required (10)
- C = average rating across all resources

### 2. `update_resource_aggregates()`
Trigger function that updates the aggregate columns on the resources table when ratings/votes change.

### 3. `check_rating_rate_limit(user_id uuid)`
Anti-abuse function that checks if user has exceeded daily rating limit (5 per day).

---

## Anti-Fraud Measures

1. **Logged-in Users Only** - RLS enforces authentication
2. **One Rating Per Resource** - UNIQUE constraint prevents duplicates
3. **Minimum Votes to Display** - Show "Not enough ratings" when < 10 votes
4. **Weighted Rating Algorithm** - Prevents gaming with few high votes
5. **Rate Limiting** - Max 5 ratings per day per user (database function)
6. **New Account Restrictions** - Accounts < 24 hours old cannot rate (optional)
7. **Verified Completion Badge** - Reviews from users who marked "I completed this" get highlighted

---

## Frontend Implementation

### New Hook: `useResourceRatings.tsx`
```text
Functions:
- submitRating(resourceId, stars) - Rate a resource
- submitVote(resourceId, voteType) - Up/down vote
- submitReview(resourceId, reviewText, isVerified) - Write review
- getUserRating(resourceId) - Get current user's rating
- getResourceStats(resourceId) - Get aggregate stats
- getReviews(resourceId) - Get all reviews with pagination
- markReviewHelpful(reviewId) - Mark a review as helpful
```

### New Component: `ResourceRatingCard.tsx`
A card component showing:
- Star rating display (interactive if logged in)
- Current average rating with vote count
- Recommend percentage bar
- "Rate Now" / "Recommend" / "Not Recommend" buttons
- Top review preview
- "Write Review" button

### New Component: `ResourceReviewsDialog.tsx`
A dialog/sheet showing:
- All reviews with pagination
- Sort by: Most Recent, Most Helpful, Highest Rated
- Filter by: Verified Completers Only
- Each review shows: user avatar, rating, review text, helpful count
- "Mark as Helpful" button

### New Component: `WriteReviewDialog.tsx`
A form dialog for writing reviews:
- Star rating selector
- "I completed this resource" checkbox
- Text area for review (min 20, max 2000 chars)
- Character counter
- Submit button

---

## UI/UX Integration Points

### 1. SkillRecommendations Page (`/skills/:skill`)
Each resource card will show:
```text
┌─────────────────────────────────────┐
│  📚 Python ML Course                │
│  Coursera                           │
│                                     │
│  ⭐ 4.6 (2.3k ratings)              │
│  ✅ 91% Recommend                   │
│                                     │
│  Top Review:                        │
│  "Best beginner friendly course..." │
│                                     │
│  [Rate] [👍 Recommend] [👎 Not]     │
└─────────────────────────────────────┘
```

### 2. Explore Page Resources Tab
Add rating display to all resource cards.

### 3. Roadmap View Page
Show ratings for resources linked to roadmap steps.

---

## Implementation Steps

### Phase 1: Database Setup
1. Create migration for new tables (resource_ratings, resource_votes, resource_reviews, resource_review_helpful)
2. Add aggregate columns to resources table
3. Create RLS policies for all new tables
4. Create database functions for weighted rating calculation
5. Create triggers to update aggregates on changes

### Phase 2: Backend Hooks
1. Create `useResourceRatings.tsx` hook with all rating functions
2. Add optimistic updates for immediate UI feedback
3. Implement rate limiting check
4. Add React Query for caching and invalidation

### Phase 3: UI Components
1. Create `ResourceRatingCard.tsx` component
2. Create `ResourceReviewsDialog.tsx` for viewing reviews
3. Create `WriteReviewDialog.tsx` for submitting reviews
4. Create `StarRatingInput.tsx` for interactive star selection

### Phase 4: Integration
1. Update `SkillRecommendations.tsx` to include rating cards
2. Update `Explore.tsx` resources tab with ratings
3. Update `RoadmapView.tsx` to show resource ratings
4. Add rating column to admin ResourceTable

### Phase 5: Polish
1. Add loading states and skeletons
2. Add toast notifications for actions
3. Add error handling and retry logic
4. Implement "Not enough ratings" display
5. Add verified badge styling

---

## Technical Details

### Files to Create
- `supabase/migrations/[timestamp]_add_resource_ratings_system.sql`
- `src/hooks/useResourceRatings.tsx`
- `src/components/ResourceRatingCard.tsx`
- `src/components/ResourceReviewsDialog.tsx`
- `src/components/WriteReviewDialog.tsx`
- `src/components/StarRatingInput.tsx`

### Files to Modify
- `src/pages/SkillRecommendations.tsx` - Add rating display
- `src/pages/Explore.tsx` - Add rating to resource cards
- `src/pages/RoadmapView.tsx` - Add rating to step resources
- `src/components/admin/ResourceTable.tsx` - Add rating column
- `src/integrations/supabase/types.ts` - Will auto-update

---

## Display Logic

### Rating Display Rules
```text
IF total_ratings >= 10:
  Show: "⭐ 4.6 (2.3k ratings)"
  Show: "91% Recommend"
ELSE:
  Show: "Not enough ratings yet"
  Show: "Be the first to rate!"
```

### Weighted Rating Formula
```
weighted_score = (v / (v + 10)) * avg_rating + (10 / (v + 10)) * site_average
```

This ensures:
- Resources with 2 votes averaging 5.0 won't outrank resources with 500 votes averaging 4.6
- New resources start closer to the site average
- More votes = closer to true average

---

## Security Considerations

1. All tables have RLS enabled with strict policies
2. User_id is NOT NULL to prevent anonymous ratings
3. Rate limiting prevents spam (5 ratings/day)
4. Review text length is validated (20-2000 chars)
5. No direct access to update aggregate columns - only through triggers
6. Unique constraints prevent duplicate voting
