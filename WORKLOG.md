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

## In progress / next
- See `.claude-session.json` sprint.todo_next.
- Later: repo kit (CI, CONTRACTS, ARCHITECTURE, LICENSE), @gokulsaraswat/ui footer, npm audit.

## Blockers / requests to other repos
- none logged (cross-repo requests go here during parallel runs; planning chat syncs to platform/docs/WORKLOG.md)

## Reminders
- TO BE UPDATED: scope of this repo is not final; see docs/KICKOFF-PROMPT.md "Questions to ask me first".
