# WORKLOG: bestportofolio

Master status of all repos: platform/docs/WORKLOG.md. Update this file after every step.

## Current state
- 2026-10-31 (Node 24.14.1, npm 11.11): `npm ci` OK (npm audit: 30 vulns, 1 critical, not addressed); `npm run lint` OK; `npm run typecheck` OK; `npm run build` FAILS without `DATABASE_URL` (`/sitemap.xml` queries DB at build).
- Public pages fetch `/api/*` client-side; content (blogs, courses) is markdown in Postgres, not MDX files.
- Dockerfile broken (bun.lock vs package-lock.json, missing /app/db, no standalone output); Caddyfile is a z.ai sandbox leftover. No Docker on owner's Mac.
- `Project` and `Course` have no `published` flag; only `BlogPost`/`CodeSnippet` can be hidden.

## Decisions (Gokul, 2026-10-31)
- Seed against the OLD Supabase project (site is live): blog seeded as hidden draft; sample project/course seeded briefly for the page check, then deleted. All seed slugs start with `sample-`.
- Sitemap rendered on request (no DB at build). Pin Node 24. Remove next-auth, z-ai-web-dev-sdk, next-intl, @wrksz/themes, bun-types. Fix both Dockerfile and Caddyfile (keep self-host option).
- Owner mode: commit + push to main after each step.

## Done
- Startup review; repo kit files `.claude-session.json`, kickoff docs committed.
- Build no longer needs DB: `sitemap.ts` is `force-dynamic`. Node pinned to 24 (`.nvmrc`, `engines`).
- Removed unused next-auth, z-ai-web-dev-sdk, next-intl, @wrksz/themes, bun-types.
- Dockerfile rewritten (node:24-alpine, `npm ci`, `output: 'standalone'`, openssl for Prisma), `.dockerignore` added, Caddyfile = env-driven HTTPS proxy. Standalone server smoke test: all public pages 200, `/sitemap.xml` 500 without DB (expected). `docker build` NOT verified (no Docker locally).
- SECURITY sec-1 (2026-10-31): deleted `src/app/api/test/route.ts` (publicly returned `DATABASE_URL`, live HTTP 200) and unused `src/app/api/route.ts`. Lint+typecheck+build pass. Owner action: rotate OLD Supabase DB password, update `DATABASE_URL`/`DIRECT_URL` in Vercel + local `.env`, redeploy, confirm `/api/test` 404. Next: sec-2..sec-6 (see `.claude-session.json`).
- `scripts/seed.mjs` (`npm run db:seed`, `-- --clean`): `sample-blog` (draft), `sample-project`, `sample-course` + 2 chapters; no admin user, no profile. Root `seed.ts` still present (stale; delete pending OK).
- Page check 2026-10-31 on live `bestportofolio.vercel.app` (old Supabase DB): seeded sample rows via Supabase SQL editor (this Mac's GlobalProtect VPN blocks Postgres ports 5432/6543). All public pages render (`/`, about, projects + detail, blog + detail, courses + detail, snippets, contact, privacy, 404); draft blog hidden from list. Only console error: expected 404. Sample rows deleted and confirmed gone. `gokulsaraswat.com` does not resolve.

## In progress / next
- See `.claude-session.json` sprint.todo_next.
- Later: repo kit (CI, CONTRACTS, ARCHITECTURE, LICENSE), @gokulsaraswat/ui footer, npm audit.

## Blockers / requests to other repos
- Local DB access: GlobalProtect VPN blocks Postgres from this Mac; use Supabase SQL editor or another network for `npm run db:seed`/`db:check`.
- Perf (report only): lists load after 3-10s (client-side `/api/*` fetches); `/api/settings` called twice per page; `/api/auth` + `/api/chat-status` on every public page.
- Auth plan (Gokul, 2026-10-31): login will be Google sign-in via Supabase Auth on the NEW platform project; portfolio switches LAST, after `admin` is verified.
- Found (report only): public `GET /api/blogs?slug=` / `?published=false` expose unpublished drafts; GET also writes (auto-publish `updateMany`). Relevant for the admin/API move.
- none logged (cross-repo requests go here during parallel runs; planning chat syncs to platform/docs/WORKLOG.md)

## Reminders
- TO BE UPDATED: scope of this repo is not final; see docs/KICKOFF-PROMPT.md "Questions to ask me first".
