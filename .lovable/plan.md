

# Google-like Universal Search for Explore Page

## Overview

Transform the Explore search bar into a powerful, Google-like search experience. When a user types a natural language query (e.g., "best resources for machine learning" or "teach me LLM"), the system searches across all database resources, user-contributed resources, categories, certifications, and degrees -- then displays a rich, ranked results page. Clicking a specific resource opens a detailed information page.

## Current State

- Search bar on Explore only shows basic autocomplete suggestions (skills, resource titles)
- `/search` page (`SearchResults.tsx`) is minimal -- just a suggestion dropdown, no actual results display
- `/skills/:skill` page shows resources matching a skill keyword
- Resources exist in `resources` table and `user_resources` table

## What Changes

### 1. New Search Results Page (rewrite `SearchResults.tsx`)

Replace the current minimal SearchResults page with a full Google-style results page:

- **Search bar at top** (same style as Explore, persistent)
- **Result sections**, each showing matched items:
  - **Resources** (from `resources` table): courses, books, videos, websites -- sorted by `weighted_rating` then `avg_rating`
  - **Community Resources** (from `user_resources` where `status='approved'`): user-contributed content
  - **Categories/Domains** (from `resources` where `section_type='domain'`): matching categories
  - **Certifications** (from `resources` where `resource_type='certification'`)
  - **Degrees** (from `resources` where `resource_type='degree'`)
  - **People** (from `profiles`): matching user profiles
- Each result card shows: title, description snippet, type badge, rating stars, difficulty, and a link
- Results are ranked by relevance (title match > category match > skill match) and popularity (weighted_rating)
- "No results" state with suggestions

### 2. Search API Enhancement (`src/api/searchAPI.ts`)

Add a new `fetchUniversalSearch(query, limit)` function that:
- Queries `resources` table with `or(title.ilike, description.ilike, category.ilike, related_skills.cs)` sorted by weighted_rating
- Queries `user_resources` table (approved only) with similar matching
- Queries `profiles` for people matches
- Returns grouped results: `{ resources: [], communityResources: [], people: [] }`

### 3. Resource Detail Page Enhancement (`ResourceView.tsx`)

Currently exists for user-contributed resources. Add support for viewing **admin resources** too (from the `resources` table):
- Route: `/resources/:id` (already exists) -- handle both `user_resources` and `resources` table lookups
- Show: title, full description, embedded content (video/PDF/link), ratings, reviews, related resources
- "Open Resource" button for external links

### 4. Explore Search Bar Update

When user submits search from Explore, navigate to `/search?q=...&scope=all` (new scope) which triggers the universal search.

## Files to Create/Modify

- **Modify** `src/api/searchAPI.ts` -- add `fetchUniversalSearch()` function
- **Rewrite** `src/pages/SearchResults.tsx` -- full results page with sections, cards, sorting
- **Modify** `src/pages/ResourceView.tsx` -- support loading from `resources` table too (not just `user_resources`)
- **Modify** `src/pages/Explore.tsx` -- update search form to use `scope=all`

## Technical Details

### Universal Search Query Strategy

```text
1. Text search across resources table:
   - title ILIKE '%query%'
   - description ILIKE '%query%'  
   - category ILIKE '%query%'
   - related_skills contains query
   ORDER BY weighted_rating DESC NULLS LAST, avg_rating DESC NULLS LAST

2. Text search across user_resources (approved only):
   - Same matching pattern
   ORDER BY avg_rating DESC NULLS LAST, view_count DESC

3. Profile search (existing RPC: search_profiles)
```

### Result Card Design

Each result shows:
- Type icon + badge (Course, Video, Book, Certification, Degree, Community)
- Title (clickable, opens ResourceView or external link)
- Description snippet (2 lines)
- Star rating + vote count (if available)
- Difficulty badge
- Provider name
- Free/Paid indicator

### No Database Changes Needed

All data already exists in `resources` and `user_resources` tables. This is purely a frontend search + display improvement.

