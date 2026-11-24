# PRIVATE STATUS (Project root, NOT in any git repo, NOT synced to repos or platform/docs)
Updated 2026-11-17. Never paste this into a repo, snapshot, PR or public doc.

## Security task A: rotate the OLD Supabase DB password (portfolio project)
It was exposed through the `/api/test` route of bestportofolio (route removed in code; Vercel firewall rule `block-api-test` is a stopgap). Rotate it, update `DATABASE_URL`/`DIRECT_URL` in Vercel + local `.env`, redeploy. Deferred by Gokul on 2026-10-31. Details: bestportofolio WORKLOG "Open items" and admin/docs/private/SECURITY-FINDINGS.md (git-ignored).

## Security task B: dev GitHub token
The token in `admin/.env.local` has full account scopes. Replace with a classic token scoped to `read:packages` only (no quotes), revoke the old one, use the new one on Vercel.

## Privacy task
- `Progress` tracks ~94 files in `src/files/` that include employer work material (API JSON samples, scripts, repo notes). Decide what to untrack/remove before any collaborator access; if the remote is public, consider history cleanup. Nothing deleted by Claude.
- `platform` is PUBLIC and its early history contains a few employer work to-do lines (see PRIVATE-TODO.md). Decide: leave or rewrite history.
- Employer to-dos live in `Project/PRIVATE-TODO.md`.
