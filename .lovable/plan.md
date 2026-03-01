

# User-Contributed Resources (YouTube-like Resource Sharing)

## Overview

Allow authenticated users to share educational resources (PDFs, videos, courses, links, documents) that get recommended to other users based on interest matching. Resources go through the existing recommendation engine and rating system. Rename "My Posts" to "My Contributions" and add a "Resources" tab there and on the Profile page.

---

## Database Changes

### New table: `user_resources`
```text
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, not null) -- who shared it
- title (text, not null)
- description (text, not null)
- resource_type (text, not null, default 'link') -- course, book, video, document, link, pdf
- category (text, not null) -- same categories as admin resources
- link (text) -- external URL
- file_url (text) -- uploaded file URL (from storage)
- file_type (text) -- mime type of uploaded file
- difficulty (text, default 'beginner')
- tags (text[], default '{}')
- status (text, default 'pending') -- pending, approved, rejected, flagged
- moderation_note (text) -- reason for rejection/flagging
- is_active (boolean, default true)
- view_count (integer, default 0)
- avg_rating (numeric)
- total_ratings (integer, default 0)
- created_at, updated_at (timestamptz)
```

**RLS**: Users can INSERT own, SELECT approved + own, UPDATE own (limited fields), DELETE own. Everyone can SELECT where status='approved' AND is_active=true.

### New table: `user_resource_ratings`
```text
- id, user_id, resource_id (FK to user_resources), stars (1-5), created_at
```

### New table: `user_resource_reports`
```text
- id, reporter_id, resource_id, reason, description, created_at
```

### Storage bucket: `user-resources` (public)
For uploaded PDFs, videos, documents.

### Moderation function
A `moderate_user_resource()` trigger that auto-flags resources containing blocked words in title/description (basic profanity filter). Admin can then approve/reject from the admin panel.

---

## Implementation Steps

### Step 1: Migration
- Create `user_resources`, `user_resource_ratings`, `user_resource_reports` tables
- Create `user-resources` storage bucket
- Add RLS policies
- Add profanity check trigger
- Add a function to sync approved user resources into the main `resources` table (so they appear in explore/recommendations)

### Step 2: Share Resource Form (`src/pages/ShareResource.tsx`)
- Clean, step-by-step form:
  1. Choose type (Video, PDF, Course Link, Book, Document)
  2. Upload file OR paste link (depending on type)
  3. Title, description, category (dropdown matching admin categories), difficulty, tags
  4. Preview before submit
- File upload to `user-resources` bucket
- Inline video/PDF/document preview
- Submit creates row with status='pending'

### Step 3: Resource Viewer Page (`src/pages/ResourceView.tsx`)
- Route: `/resources/:id`
- Renders the resource inline:
  - Video: HTML5 `<video>` player
  - PDF: embedded `<iframe>` or `<object>` viewer
  - External link: metadata preview + "Open" button
  - Image: full display
- Star rating widget (reuse existing `StarRatingInput`)
- Report button
- Related resources sidebar

### Step 4: Update Explore Page
- Add "Community Resources" section showing top-rated user-contributed resources
- Add "Share a Resource" CTA button
- Personalization engine scores user resources same as admin resources

### Step 5: Rename MyPosts → MyContributions + Resources Tab
- Rename page title and route label to "My Contributions"
- Add a "Resources" tab alongside existing post tabs
- Resources tab shows user's shared resources in a grid/list with status badges (pending/approved/rejected)
- CRUD: edit, delete, view from this tab

### Step 6: Profile Page → Resources Tab
- Add "Resources" tab to profile page tabs (alongside Roadmaps, Skills, Achievements, Activity)
- Shows approved resources shared by that user
- Grid of resource cards with ratings

### Step 7: Admin Panel Integration
- Add "User Resources" section in admin dashboard
- Moderation queue: pending resources for approve/reject
- When approved, auto-insert into main `resources` table with `contributed_by` field
- Bulk approve/reject

### Step 8: Recommendation Engine Integration
- Approved user resources join the main `resources` table
- Existing personalization engine (`src/lib/personalization.ts`) already scores resources
- Popular resources (high ratings, high views) get boosted in recommendations
- Low-rated resources get deprioritized automatically

---

## Content Safety
- Profanity filter trigger on INSERT/UPDATE of `user_resources` (checks title + description against a blocked words list)
- All resources start as `status='pending'` — not visible to others until approved
- Report system for flagging inappropriate content
- Admin moderation queue with approve/reject workflow
- File type validation: only allow pdf, mp4, webm, jpg, png, doc, docx, ppt, pptx
- File size limit enforced via storage bucket policy

## Privacy & Security
- RLS ensures users only manage their own resources
- Unapproved resources only visible to the owner
- Rating limited to authenticated users
- Report system for community moderation

## Files to Create
- `src/pages/ShareResource.tsx` -- resource submission form
- `src/pages/ResourceView.tsx` -- inline resource viewer
- `src/hooks/useUserResources.tsx` -- CRUD hook for user resources
- Migration SQL

## Files to Modify
- `src/pages/MyPosts.tsx` -- rename to MyContributions, add Resources tab
- `src/pages/Profile.tsx` -- add Resources tab
- `src/pages/Explore.tsx` -- add Community Resources section + Share CTA
- `src/App.tsx` -- add new routes
- `src/components/Layout.tsx` / `src/components/BottomNav.tsx` -- update nav label
- `src/pages/AdminDashboard.tsx` -- add moderation queue

