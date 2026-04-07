

## Automated Daily Tech News System

### Overview
A scheduled edge function runs daily at 6:00 AM IST, fetches tech news from a free News API, uses Gemini AI to process and format the news into an engaging post, and publishes it under a dedicated "SkillGram News" bot account.

### Architecture

```text
pg_cron (6:00 AM IST / 0:30 UTC)
  → HTTP call to Edge Function: "daily-tech-news"
      → Fetch news from GNews API (last 24h)
      → Send to Gemini AI for summarization
      → Insert formatted post into `posts` table
      → Post appears in everyone's feed automatically
```

### Step 1: Set Up News API Key

We'll use **GNews.io** (free tier: 100 requests/day, sufficient for 1 daily call). You'll need to:
1. Sign up at [gnews.io](https://gnews.io)
2. Get your free API key
3. We'll store it as a Supabase secret (`GNEWS_API_KEY`)

### Step 2: Create System Bot Account

- Create a dedicated Supabase auth user for the bot (e.g., "SkillGram News")
- Store the bot's `user_id` as a secret (`NEWS_BOT_USER_ID`) so the edge function can post under it
- Add a profile entry with name "SkillGram News" and a news-themed avatar

### Step 3: Build the Edge Function (`daily-tech-news`)

The function will:
1. Call GNews API for top 10 tech news from last 24 hours
2. Send headlines + descriptions to Gemini AI with a prompt to create an engaging, well-formatted post summarizing the day's tech news
3. Insert the result into the `posts` table with `user_id = NEWS_BOT_USER_ID`, category "Tech News", and relevant tags
4. Include a deduplication check (skip if a news post already exists for today)

### Step 4: Schedule with pg_cron

- Enable `pg_cron` and `pg_net` extensions
- Create a cron job: `'30 0 * * *'` (0:30 UTC = 6:00 AM IST)
- The job calls the edge function via `net.http_post`

### Step 5: UI Enhancements (Minor)

- Add a "News" badge/icon on posts from the bot account so users can visually distinguish news posts
- The posts will appear in the regular feed — no special page needed

### What You'll Need To Provide

1. **GNews API Key** — free from [gnews.io](https://gnews.io)
2. **Bot account creation** — we'll create this via Supabase auth or you can create it manually in the dashboard

### Technical Details

- **Edge Function**: `supabase/functions/daily-tech-news/index.ts`
- **Database**: Migration to enable `pg_cron` + `pg_net` extensions
- **Secrets needed**: `GNEWS_API_KEY`, `NEWS_BOT_USER_ID`
- **Existing secrets used**: `GEMINI_API_KEY` (for summarization)
- **Cron schedule**: Daily at 0:30 UTC (6:00 AM IST)

