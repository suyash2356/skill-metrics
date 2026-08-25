# Pre-launch security pass

Scan finished: **zero critical findings**. Five warnings, three of which are expected for this app's design. Nothing blocks publishing.

## Verdict

The site is ready for public use at your expected scale. This plan closes the two warnings that actually matter once the app is public, and tells you the one toggle to flip yourself.

## What to fix

### 1. Anonymous visitors can read post engagement
The `post_engagement` table currently allows any unauthenticated visitor to read the whole table, which reveals which user engaged with which post. That is private behaviour data, unlike ratings and reviews which are public on purpose.

Fix: replace the "Anyone can read post engagement" policy with one scoped to signed-in users, keeping aggregate counts working through the existing count paths so nothing in the feed UI changes.

### 2. MCP server is open once published
The app's MCP server has authentication disabled. After publishing, anyone with the URL could call `search_resources`, `list_domains`, and `get_resource`.

Fix: require auth on the MCP endpoint so only signed-in callers can use the tools. The catalog data itself is already public in the app, so the practical risk is unmetered scraping rather than data leakage — but it should still be gated.

## What stays as-is (documented, not fixed)

- **SECURITY DEFINER functions callable by anon / authenticated** — these are your intentional user-facing RPCs (`track_interaction`, `find_or_create_conversation`, `send_like_notification`, `has_role`, etc.). They must be callable to work, and each one validates its own caller. Internal trigger and utility functions already had EXECUTE revoked in an earlier pass. I'll record this in security memory so future scans stop re-raising it.

- **Leaked password protection disabled** — this is a Supabase Auth dashboard toggle, not code. Turn it on at Authentication → Providers → Password so signups are checked against known breached passwords. One click, recommended before launch.

## Technical details

- One migration: drop the permissive SELECT policy on `public.post_engagement`, add a policy restricted to `authenticated`, and adjust the `anon` grant accordingly. Verify feed like/comment counts still render for signed-out visitors; if any count path depends on anon reads, route it through an existing aggregate view instead of widening the policy back.
- MCP: enable OAuth/JWT verification on the MCP surface (`supabase/functions/mcp` and `.lovable/mcp/manifest.json`), matching how the other authenticated functions declare `verify_jwt = true` in `supabase/config.toml`.
- Update security memory to record the SECURITY DEFINER rationale so it isn't re-flagged.
- Re-run the scan afterwards to confirm both warnings clear.

## Not in scope

No feature, UI, or recommendation changes. Publishing itself is a separate step you trigger when ready.
