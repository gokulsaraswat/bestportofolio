# WORKLOG: bestportofolio

Master status of all repos: platform/docs/WORKLOG.md (planning chat syncs it from here). Update this file after every step.

## Next chat: start here
1. Paste SHARED BLOCK + REPO SECTION from `docs/KICKOFF-PROMPT.md`, then read this file and `.claude-session.json`.
2. Pick up `.claude-session.json` → `sprint.todo_next` in order (see list). Ask Gokul before each step.
3. Local gotchas on Gokul's Mac (read before running anything):
   - GlobalProtect VPN blocks Postgres (5432/6543): `npm run db:check` / `db:seed` fail locally. Use the Supabase SQL editor (old project) or another network. Pages that need data can be checked on the live site.
   - Installing needs `NODE_AUTH_TOKEN` (GitHub token, `read:packages`) for `@gokulsaraswat/ui`: `export NODE_AUTH_TOKEN=$(gh auth token)` then `npm ci`.
   - No Docker on this Mac: `docker build` has never been run.
   - Browser pane is often hidden: framer-motion/CSS transitions freeze there; do not report frozen fades as bugs.
4. Another chat may be working here at the same time (security steps sec-*): pull before committing, commit only your own files.

## Current state (2026-10-31, end of session)
- Live: https://bestportofolio.vercel.app (Vercel, auto-deploys `main`; builds failed from `9c4146a` until the PRT-B-001 fix `03972c2`, so live still serves the last good deploy until Vercel's rate limit resets). `gokulsaraswat.com` does not resolve.
- Data: OLD Supabase project (Prisma). Most live content is the old sample seed (Learn Go, System Design, 5 blogs, Banking Microservices project, snippets), plus test rows like project `asdfasf`.
- Node 24 (`.nvmrc`, `engines >=24 <25`), npm, one lockfile. `npm ci`, `lint`, `typecheck`, `build` pass; build needs no DB.
- Public pages verified live: `/`, about, projects + detail, blog + detail, courses + detail, snippets, contact, privacy, 404, and the 6 shared footer pages.
- `npm audit` (after `npm ci`, 2026-11-25): 3 high, not addressed.
- Security: findings sec-1..sec-6 (admin repo Phase 0 review) all fixed and live (last deploy `af2fcaa`). Summary in README "Security" and SECURITY.md "Security log".

## Decisions (Gokul, 2026-10-31)
- Keep the stack (Next ^16, React ^19, TS ^5, Tailwind ^4, Prisma ^6, zod ^4). No rewrite.
- Hosting is Vercel. Dockerfile + Caddyfile KEPT as a self-host option and fixed (not deleted).
- Sample data goes to the OLD Supabase project with `sample-` slugs; blog as hidden draft; project/course (no published flag) only briefly, then removed.
- Sitemap rendered on request (no DB at build). Node 24 pinned.
- Footer: shared `@gokulsaraswat/ui` Footer; Admin link and "Built with ♥" dropped; 6 missing footer pages use shared `LegalPage` placeholders; About/Contact/Privacy keep their own pages.
- Auth plan: login will be Google sign-in via Supabase Auth on the NEW platform project; the portfolio switches LAST, after the `admin` repo is verified. Until the planned data migration, do not change `DATABASE_URL`/Supabase env vars.
- Owner mode: commit + push to `main` after each step.

## Done (oldest first)
- 2026-11-25 Phase B security + bug fixes (one commit each; Vercel rate limited, verified locally with typecheck + lint + build):
  - PRT-B-003 roles server-side: `src/lib/permissions.ts` (`ROLE_PERMISSIONS`, `hasPermission`) shared by admin nav and `requirePermission(request, section)` in `src/lib/require-admin.ts`; 18 route files gated. Local `next start` matrix (signed test cookies, no writes): viewer + unknown role 403 on all 17 probes, each editor passes only its sections, admin passes all, mustChangePassword 403, no cookie 401.
  - PRT-B-004 phone out of public output: `GET /api/profile` omits `phone` unless the caller has a usable admin session (admin editor still receives it); `getPersonJsonLd` no longer emits `telephone`. tsc and eslint clean on both files.
  - PRT-B-005 no writes in public GETs: anonymous `GET /api/blogs` and `/api/snippets` no longer run `updateMany`; scheduled items whose `scheduledAt` has passed are treated as live at read time (list filter via `AND`, so the search `OR` is untouched; slug lookup uses `isLive`). The flip to `published=true` now runs only on an admin-session GET, so the admin list state is unchanged. tsc + eslint clean.
  - PRT-B-006 chat stops logging visitor content: removed the user-prompt, final-prompt and retrieved-docs console dumps from `src/app/api/chat/route.ts`; request/stage logs without content stay. tsc + eslint clean.
  - PRT-B-007 robots.txt: one `*` group, sitemap line added, `/admin` and `/admin-access-denied` disallowed; `/api/` stays crawlable because public pages render from client-side `/api/*` fetches.
  - PRT-B-008 new admin-guarded `GET /api/chat/config` (`rag-bot` permission) reports whether the three env vars are set without calling Gemini; `rag-settings.tsx` Re-check button and mount check use it. tsc + eslint clean.
  - PRT-B-009 F2 decided: do not mount it. Mounting would add site-wide shortcuts nobody asked for and the public site is being rebuilt in Astro; the component and its unused import in `layout.tsx` go to the Phase C unused-code list (grep proof then).
  - PRT-C-001 Phase C step 1: removed 18 unused dependencies (no import/require/dynamic import/config/script/css reference in src, scripts, prisma or root configs). 182 packages leave the lockfile. With those installed dirs moved out of node_modules (what npm ci would produce) tsc clean, eslint clean, next build ok (15 s, 39/39 pages); node_modules 1069 MB to 1004 MB. Kept: dotenv (zero refs, Prisma tooling may load it; needs Gokul), react-dom and sharp (Next uses them implicitly), @types/*. NOT pushed: npm ci on the new lockfile not run (no GitHub Packages token on this Mac) and main deploys to Vercel.
  - PRT-B-002 F1: `comments` added to `rolePermissions.admin`, Comments section back in the admin nav.
- 2026-11-25 Phase A inventory + baseline: `docs/FEATURES.md` = parity checklist for the Astro rebuild (15 pages, 23 API route groups, 14 admin sections, SEO items, global widgets, PRT-F-001 as planned) with baseline numbers. Baseline: `npm ci` 62 s (clean clone), node_modules 1.0 GB, build 51 s cold / 12 s warm, lint 0 problems, typecheck pass; First Load JS gzip `/` 264 kB, `/blog/[slug]` 332 kB, `/projects/[slug]` 336 kB, `/admin` 461 kB (computed from `.next` manifests; Next 16 no longer prints it). Lighthouse (live, still the pre-9c4146a deploy) mobile/desktop perf: `/` 87/99, `/blog` 91/95, project 67/96 (mobile LCP 8.5 s). Findings F1-F4 in FEATURES.md section 7 (admin nav hides Comments; GlobalKeyboardShortcuts never mounted). Not deployed: Vercel rate limited; verified locally.
- 2026-11-25 Phase A kit fixes: CLAUDE.md standing rule (`626a02f`); `docs/PLATFORM-DOCS.md` replaces `docs/master/`, `docs/project/`, `WORKLOG-PROJECT.md` (`3a376cb`); `docs/ARCHITECTURE.md` added (`c4d3e58`); stale WORKLOG lines removed (seed.ts item, "production green", audit count).
- 2026-11-25 PRT-B-001 (P0): Vercel deploys failed since 9c4146a. Back to Prisma 6.19.3 (matches schema.prisma url/directUrl and the adapter-less src/lib/db.ts), removed unused @prisma/adapter-pg, pg and prisma.config.ts, lockfile regenerated (effect override now in sync). Verified in a clean clone: npm ci ok, npm run build ok (44 s), typecheck ok, lint ok. Vercel is rate limited until ~24 h after the last attempt, so this deploys on the next push after the reset.
- 2026-11-25: UI/motion upgrade queued as TODO only (no source changes). Prompt added to docs/KICKOFF-PROMPT.md; backlog item added; animation libs installed but unused (see backlog). PRT-I-001, PRT-X-001.
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
- `08d06c0` SECURITY sec-5: `src/lib/pick-fields.ts` (`pickFields(body, Prisma.<Model>ScalarFieldEnum)`, drops id/createdAt/updatedAt + non-columns) on PUT `blogs/[id]`, `projects/[id]`, `courses/[courseId]` (blocks nested `chapters` writes) and `profile` create/update. Value types still checked by Prisma.
- `af2fcaa` SECURITY sec-6: `/api/contact` trims and limits name 80, email 160 (format checked), subject 200, message 4000; 400 with a clear message. Contact page now shows the server's error text. Valid submit not run locally (VPN blocks DB).

## Open items (need Gokul)
- [ ] URGENT: rotate the OLD Supabase DB password (it was publicly exposed via `/api/test`), update `DATABASE_URL`/`DIRECT_URL` in Vercel + local `.env`, redeploy. Gokul deferred this on 2026-10-31 ("update later"); until done, anyone who saw `/api/test` can reach the DB.
- [ ] Vercel Firewall rule `block-api-test` (deny path `/api/test`, returns 403) was added as a stopgap. The route is gone from code; keep or delete the rule (deleting it should give 404).
- [ ] Review real text for the 6 placeholder pages (terms, cookies, data-deletion, accessibility, sitemap, faq).
- [ ] Domain: `gokulsaraswat.com` does not resolve; `layout.tsx` metadata, `sitemap.ts` and `lib/jsonld.ts` use it as the site URL. Point the domain at Vercel or change BASE_URL.
- [ ] Live content is mostly old sample seed + test rows (`asdfasf`): replace with real content (admin) when ready.
- [ ] Vercel plan terms: Hobby is non-commercial (relevant later for client apps).

## Todo next (agent, ask Gokul before each)
1. Verify sec-3..sec-6 with the old admin (Gokul): create a user (weak password refused, new user must change password), drafts still listed in admin, edit + save a blog/project/course/profile, send a contact message.
2. Repo kit (platform/docs/REPO-KIT.md): `.github/workflows/ci.yml` (npm ci + lint + typecheck + build, `NODE_AUTH_TOKEN` secret), PR template, `docs/CONTRACTS.md`, `LICENSE`, GitHub description/topics/branch protection. CI would have caught the Vercel standalone break.
3. `npm audit`: review the 3 high findings; fix without major upgrades first.
4. Kickoff stack item 4: report whether Prisma 7 / a newer Next major is worth it (report only, no upgrade without OK).
5. Perf: lists fill after 3-10 s (client-side `/api/*` fetches); `/api/settings` fetched twice per page; `/api/auth` + `/api/chat-status` on every public page.
6. `docker build` proof on a machine with Docker: `NODE_AUTH_TOKEN=... docker build --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN -t portfolio .`

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
- planning chat: sync to master `platform/docs/WORKLOG.md`: bestportofolio security sec-1..sec-6 done and live (`8d104aa`..`af2fcaa`); DB password rotation pending (Gokul).
- admin: role semantics now enforced server-side (only `admin` may use admin-users, backup, settings PUT, profile PUT, ingest, operation-logs; `editor`/`viewer` content only). The new admin should keep or replace this.

## Assumptions (2026-11-25, Phase A agent)
- First Load JS is computed (gzip of rootMainFiles + layout/page entry chunks from `.next` manifests), since Next 16 removed the column; compare later builds with the same method.
- Lighthouse numbers are single runs against the live site, which serves the last good deploy, not `main`.
- `npm ci` hit EPERM because a running `next dev` (port 3000) held `@next/swc-win32-x64-msvc/*.node`; the locked file was moved to the gitignored `build/` folder (not deleted) and `npm ci` then succeeded. Restart that dev server; `build/locked-next-swc.node.old` can be deleted once it is stopped.

## Reminders
- Never change `DATABASE_URL`/Supabase env vars or the Prisma schema without logging it here and in CONTRACTS.
- `.project-architecture.md` is generated (`./sync-architecture.sh`); `graphify-out/` refreshes on commit.
- Line endings are mixed in some files (e.g. `src/app/api/snippets/[id]/route.ts` has CRLF + LF lines, `admin-users/route.ts` is CRLF). Edit in place; do not normalise whole files (it bloats diffs).
- Deploy status without Vercel login: `gh api repos/gokulsaraswat/bestportofolio/commits/<sha>/status --jq '.statuses[]|{context,state}'`. Vercel build logs need Gokul (dashboard login).
- Vercel needs `NODE_AUTH_TOKEN` (read:packages) for `@gokulsaraswat/ui`; never set `NEXT_OUTPUT=standalone` on Vercel (breaks its builder).
- Public GETs of blogs/snippets return only published items without an admin session; public pages must keep requesting `published=true` and the admin UI must send its session cookie.

- 2026-11-26 Upgrade program: status of all 7 repos and how to resume is in platform/docs/UPGRADE-PROGRAM.md (read it first).
