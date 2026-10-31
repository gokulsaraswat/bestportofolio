# WORKLOG: bestportofolio

Master status of all repos: platform/docs/WORKLOG.md (planning chat syncs it from here). Update this file after every step.

## Next chat: start here
1. Paste SHARED BLOCK + REPO SECTION from `docs/KICKOFF-PROMPT.md`, then read this file and `.claude-session.json`.
2. Pick up `.claude-session.json` → `sprint.todo_next` in order (sec-5 first). Ask Gokul before each step.
3. Local gotchas on Gokul's Mac (read before running anything):
   - GlobalProtect VPN blocks Postgres (5432/6543): `npm run db:check` / `db:seed` fail locally. Use the Supabase SQL editor (old project) or another network. Pages that need data can be checked on the live site.
   - Installing needs `NODE_AUTH_TOKEN` (GitHub token, `read:packages`) for `@gokulsaraswat/ui`: `export NODE_AUTH_TOKEN=$(gh auth token)` then `npm ci`.
   - No Docker on this Mac: `docker build` has never been run.
   - Browser pane is often hidden: framer-motion/CSS transitions freeze there; do not report frozen fades as bugs.
4. Another chat may be working here at the same time (security steps sec-*): pull before committing, commit only your own files.

## Current state (2026-10-31, end of session)
- Live: https://bestportofolio.vercel.app (Vercel, auto-deploys `main`; production green since `8a5d378`). `gokulsaraswat.com` does not resolve.
- Data: OLD Supabase project (Prisma). Most live content is the old sample seed (Learn Go, System Design, 5 blogs, Banking Microservices project, snippets), plus test rows like project `asdfasf`.
- Node 24 (`.nvmrc`, `engines >=24 <25`), npm, one lockfile. `npm ci`, `lint`, `typecheck`, `build` pass; build needs no DB.
- Public pages verified live: `/`, about, projects + detail, blog + detail, courses + detail, snippets, contact, privacy, 404, and the 6 shared footer pages.
- `npm audit`: 30 vulnerabilities (1 critical), not addressed.

## Decisions (Gokul, 2026-10-31)
- Keep the stack (Next ^16, React ^19, TS ^5, Tailwind ^4, Prisma ^6, zod ^4). No rewrite.
- Hosting is Vercel. Dockerfile + Caddyfile KEPT as a self-host option and fixed (not deleted).
- Sample data goes to the OLD Supabase project with `sample-` slugs; blog as hidden draft; project/course (no published flag) only briefly, then removed.
- Sitemap rendered on request (no DB at build). Node 24 pinned.
- Footer: shared `@gokulsaraswat/ui` Footer; Admin link and "Built with ♥" dropped; 6 missing footer pages use shared `LegalPage` placeholders; About/Contact/Privacy keep their own pages.
- Auth plan: login will be Google sign-in via Supabase Auth on the NEW platform project; the portfolio switches LAST, after the `admin` repo is verified. Until the planned data migration, do not change `DATABASE_URL`/Supabase env vars.
- Owner mode: commit + push to `main` after each step.

## Done (oldest first)
- `28c5e4e` Startup review; kickoff docs, WORKLOG, `.claude-session.json` committed.
- `80ff3db` `sitemap.ts` is `force-dynamic` (build no longer needs `DATABASE_URL`); Node 24 pinned.
- `b7d3783` Removed unused next-auth, z-ai-web-dev-sdk, next-intl, @wrksz/themes, bun-types.
- `57cae71` Dockerfile rewritten (node:24-alpine, `npm ci`, openssl for Prisma, standalone), `.dockerignore`, Caddyfile = env-driven HTTPS proxy (`DOMAIN`, `UPSTREAM`).
- `7168b56` `scripts/seed.mjs` (`npm run db:seed`, `-- --clean`): `sample-blog` (draft), `sample-project`, `sample-course` + 2 chapters; no admin user, no profile.
- `8d104aa` SECURITY sec-1: deleted `src/app/api/test/route.ts` (publicly returned `DATABASE_URL`) and unused `src/app/api/route.ts`. Vercel firewall rule also denies `/api/test` (403).
- `2b1187c` Live page check (sample rows inserted and deleted via Supabase SQL editor; confirmed gone).
- `f975822` Shared footer: `.npmrc` (`NODE_AUTH_TOKEN`), `tokens.css` + `styles.css` in `layout.tsx`, `footer.tsx` wraps shared `Footer`, `src/app/[legal]/page.tsx` serves terms, cookies, data-deletion, accessibility, sitemap, faq. `NODE_AUTH_TOKEN` set in Vercel by Gokul.
- `8a5d378` Vercel fix: `output: 'standalone'` broke Vercel builds from `57cae71` to `f975822` (`ENOENT .next/next-server.js.nft.json`). Now standalone only when `NEXT_OUTPUT=standalone` (set in Dockerfile).
- `485c935` SECURITY sec-2: `requireRole(request, 'admin')` (also blocks `mustChangePassword`) on admin-users, backup, settings PUT, profile PUT, ingest, operation-logs. Unauthenticated: 401 on all 8; public `GET /api/settings` 200.
- `95f686d` SECURITY sec-3: admin-users POST/PUT validate + hash passwords; `mustChangePassword: true` on create and admin reset. Not run end-to-end.
- `172fe10` SECURITY sec-4: `requireAdmin` on GET `messages/[id]`, `todos/[id]/history`, `blog-ideas/[id]`; blogs/snippets GET return only published items without an admin session (fixes public draft exposure).

## Open items (need Gokul)
- [ ] URGENT: rotate the OLD Supabase DB password (it was publicly exposed via `/api/test`), update `DATABASE_URL`/`DIRECT_URL` in Vercel + local `.env`, redeploy.
- [ ] Delete root `seed.ts` (stale: plaintext `admin`/`admin123` + real phone/email; replaced by `scripts/seed.mjs`). Agent delete was blocked by permissions: say "delete seed.ts".
- [ ] Review real text for the 6 placeholder pages (terms, cookies, data-deletion, accessibility, sitemap, faq).
- [ ] Domain: `gokulsaraswat.com` does not resolve; `layout.tsx` metadata, `sitemap.ts` and `lib/jsonld.ts` use it as the site URL. Point the domain at Vercel or change BASE_URL.
- [ ] Live content is mostly old sample seed + test rows (`asdfasf`): replace with real content (admin) when ready.
- [ ] Vercel plan terms: Hobby is non-commercial (relevant later for client apps).

## Todo next (agent, ask Gokul before each)
1. sec-5: whitelist PUT fields on `blogs/[id]`, `projects/[id]`, `courses/[courseId]`, `profile` (security chat).
2. sec-6: `/api/contact` length/format limits (copy comments route) (security chat).
3. Verify sec-3/sec-4 live (create a user in the old admin; draft blog not visible publicly; admin UI still lists drafts).
4. Repo kit (platform/docs/REPO-KIT.md): `.github/workflows/ci.yml` (npm ci + lint + typecheck + build, `NODE_AUTH_TOKEN` secret), PR template, `docs/CONTRACTS.md`, `docs/ARCHITECTURE.md`, `LICENSE`, GitHub description/topics/branch protection. CI would have caught the Vercel standalone break.
5. `npm audit`: review the 30 vulnerabilities; fix without major upgrades first.
6. Kickoff stack item 4: report whether Prisma 7 / a newer Next major is worth it (report only, no upgrade without OK).
7. Perf: lists fill after 3-10 s (client-side `/api/*` fetches); `/api/settings` fetched twice per page; `/api/auth` + `/api/chat-status` on every public page.
8. `docker build` proof on a machine with Docker: `NODE_AUTH_TOKEN=... docker build --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN -t portfolio .`

## Later (from kickoff, in order)
- Switch MDX/markdown rendering to `@gokulsaraswat/mdx` registry (waits for platform to publish it).
- Read tile/config data from the hub if needed.
- Data migration to the NEW Supabase project (planned in admin section 2; separate step).
- After `admin` repo is verified: remove admin code + Prisma auth parts (`AdminUser`, session, TOTP), point auth to Supabase Auth (Google).
- Add `published` flag to `Project`/`Course` if hidden drafts are needed (Prisma schema change: log in WORKLOG/CONTRACTS first).

## Findings (report only)
- `GET /api/blogs` still runs the scheduled auto-publish `updateMany` on every request (a write in a public GET).
- `Project` and `Course` have no `published` flag; only `BlogPost`/`CodeSnippet` can be hidden.
- `package.json` name is still the scaffold name `nextjs_tailwind_shadcn_ts`.
- README has two overlapping deployment sections.

## Blockers / requests to other repos
- platform: `@gokulsaraswat/mdx` not published yet (blocks MDX switch). CONTRACTS base path for portfolio: root `/` (not yet listed in master CONTRACTS).
- admin: portfolio admin must keep sending the session cookie for drafts (sec-4); Project/Course lack a published flag (spec input).
- Local DB access blocked by company VPN (GlobalProtect) on Gokul's Mac.

## Reminders
- Never change `DATABASE_URL`/Supabase env vars or the Prisma schema without logging it here and in CONTRACTS.
- `.project-architecture.md` is generated (`./sync-architecture.sh`); `graphify-out/` refreshes on commit.
