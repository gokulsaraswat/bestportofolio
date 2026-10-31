<!-- SNAPSHOT 2026-10-31 of platform/docs/WORKLOG.md. Master lives in github.com/gokulsaraswat/platform/docs. If they differ, the master wins. Do not edit here. -->

# WORKLOG

Shared memory across chats. Claude: read this first in every new chat. Edit only after Gokul says yes.
Source: `Not Repository/Ideas.md` (vision + full to-do list). Updated: 2026-10-31.

## REMINDERS (Claude: raise these in the planning chat, do not let Gokul forget)
- [ ] PRIVACY (found 2026-10-31): `platform` is a PUBLIC repo and its committed docs/WORKLOG.md (commit history too) contains a few employer work to-do lines (see PRIVATE-TODO.md for what they were; not repeated here). Removed from the planning/master copy now and moved to Project/PRIVATE-TODO.md, but already pushed history needs Gokul's decision (rewrite history + force-push, or accept). ALSO check visibility of `Progress` (remote github.com/gokulsaraswatvc-eng/GSpace): it tracks 94 files in `src/files/` incl. work material (OMS JSONs, PDN scripts, postbooking-* repo notes). If public or later shared with collaborators, decide what to untrack/remove. Nothing deleted by Claude.
- [~] Supabase prep STATUS (2026-10-31): Gokul DONE = new project created, email sign-in/sign-ups off, GitHub read:packages token (NODE_AUTH_TOKEN). UPDATE: Gokul says ALL Supabase steps done (user created, keys collected in a private file, token set) = SUPABASE READY. Keys go into admin/.env.local ONLY when the admin chat asks (admin repo has no .gitignore yet: admin chat must create it first). Key file must stay outside every repo folder (/gitmd only catches .env*, *.pem, *.key style names). NEXT: admin chat.
- [~] Supabase prep: `admin/docs/SUPABASE-SETUP.md` written (owner dashboard checklist + DRAFT SQL for user_roles/RLS/config bucket; nothing applied; Claude cannot create the project or authorize the Supabase connector). RISK logged: Prisma drift on shared `public` schema (unverified). SUPERSEDED 2026-10-31 by Gokul: NEW Supabase project for the platform now (see Decisions); portfolio data migrates later.
- [ ] BEFORE the admin chat can finish, Gokul must have: (1) a Supabase project (free tier ok; Supabase connector in this app also needs /mcp authorization if Claude should use it), (2) a GitHub token with `read:packages` as env `NODE_AUTH_TOKEN` + `.npmrc` for installing `@gokulsaraswat/*` locally, (3) decision on migrating existing portfolio AdminUser rows + TOTP. The admin chat will ask; having them ready saves time.
- [ ] Platform owner tasks: GitHub settings (description, topics, branch protection), `graphify hook install`, commit `.claude/` + `.gitattributes`.
- [ ] Token name: packages are private-registry `@gokulsaraswat/*`; consumers' CI and Vercel use env `NODE_AUTH_TOKEN` (read:packages) per platform/docs/CONTRACTS.md (docs now aligned; earlier text said NPM_TOKEN).
- [ ] TO BE UPDATED: Markdown-studio section (scope open; clutter in root: PATCH_9_*, implementation_plan.md, etc.). Revisit after the first 5 repos.
- [ ] TO BE UPDATED: checkers-gym-management section (shared vs separate Supabase, who logs in, confirm `.env` is gitignored/never committed). Revisit after admin works.
- [ ] TO BE UPDATED: gokul-omni-converter (standalone; hub link-only?).
- [ ] TO BE UPDATED: every repo's WORKLOG.md "Current state" is a stub; first agent run in each repo fills it.
- [ ] TO BE UPDATED: docs/CONTRACTS.md does not exist yet in any repo; platform chat creates the master.
- [ ] Add real collaborators to each COLLABORATORS.md when they exist.
- [ ] Footer/legal/SEO page CONTENT (Privacy, Terms, Cookie, Data Deletion, Accessibility, FAQ, About, Contact) needs real text; legal wording should be reviewed by Gokul.
- [ ] Sync this file with platform/docs/WORKLOG.md after each repo chat.
- [ ] Clean-up decisions pending: seed.ts plaintext admin password in bestportofolio; mobile repo `gokulmobilize` README (Android idea) to be replaced after confirmation.

## RUNBOOK (one step at a time; Gokul asks "what next", Claude answers from here)
Resume this planning chat in a new window with `Not Repository/prompts/PLANNING-CHAT-PROMPT.md`.
Status legend: [ ] todo, [~] in progress, [x] done. Update after every report.
- [ ] 0. Decide: commit the kit stubs per repo now, or let each repo chat commit its own (open).
- [x] 1. Chat `platform` DONE 2026-10-31 (verified read-only: main in sync with origin, CI green per its log, 6 commits). Delivered: repo kit, npm workspace + Changesets, `@gokulsaraswat/ui` 0.1.0 (tokens, Tailwind v4 mapping, Footer + LegalPage placeholders, 10 tests), CI + Release + install-smoke workflows, docs/ARCHITECTURE + CONTRACTS. Left for Gokul: (a) step 6 GitHub description/topics/branch protection (web UI; `gh` not installed), (b) run `graphify hook install` in platform, (c) commit untracked `.claude/`, `.gitattributes` (use /gitmd). UPDATE 2026-10-31 (re-verified): platform ALSO shipped step 7+8: `@gokulsaraswat/config` 0.1.0 + `@gokulsaraswat/auth` 0.1.0 published (ui, config, auth on GitHub Packages); graphify hook installed; main in sync with origin. Remaining in platform: step 6 GitHub settings (Gokul, web UI) and `@gokulsaraswat/mdx` (Calculator/WebWindow, waits for their specs, needs REQ_CONTEXT answers from Gokul). Platform is READY for admin.
- [ ] 2. FIRST Gokul creates the NEW Supabase project (admin/docs/SUPABASE-SETUP.md steps). THEN chat `admin` (Opus 5.5, high; max for auth/RLS): shell, Supabase Auth, roles, switcher. Return: sync.
- PARALLEL RUNS (Gokul asked 2026-10-31): separate repos can run at once. Safe now: admin (2) + gokulmobilize (3, use mock/published config contract; admin's bucket path comes later) + bestportofolio (4, ONLY stack checks, seed data, build proof; NOT auth/admin removal) + Progress (5, MDX + base path). Recommended max 3 at a time (usage limit). Rules: no chat edits another repo or platform/docs; cross-repo needs go in the repo's WORKLOG 'Blockers / requests'; planning chat syncs. Markdown-studio, gym, omni: later.
- [ ] 3. Chat `gokulmobilize` (Opus 5.5, high): hub PWA + Capacitor. Return: sync.
- [ ] 4. Chat `bestportofolio` (Sonnet 5.5, medium): seed fake data, verify, adopt shared footer; admin removal LAST. Return: sync.
- [ ] 5. Chat `Progress` (Sonnet 5.5, medium): MDX + /gspace base path. Return: sync.
- [ ] 6. Fill the TO BE UPDATED sections: Markdown-studio, checkers-gym-management, gokul-omni-converter. (REMINDER)
- [ ] 7. Cross-repo integration check: config.json flow, roles, shared components, base paths, CI green everywhere.
- [~] C. Collaborator prompt for GSpace (friend, Opus 5.5 high, unattended, NO questions, PR only). Step 1 DONE: design-chat prompt written at `Progress/docs/COLLABORATOR-DESIGN-CHAT-PROMPT.md` (copy in Not Repository/prompts/). Step 2 (Gokul): new chat in Project/Progress (Opus 5.5, high), paste it, answer its questions; it writes `Progress/docs/COLLABORATOR-PROMPT.md`. Step 3: return here to sync. OPEN RISK: confidentiality of work material in Progress `src/files/` before the friend gets access (see PRIVACY reminder). Final prompt must forbid opening/pushing src/files/**.
- [ ] A. FUTURE (after basics + Claude Code paid plan): automate the runbook. Driver = an orchestrator Claude session (or headless `claude -p` runs, /loop, subagents, git worktrees per repo) that runs each repo's autonomous kickoff in runbook order, reads/updates WORKLOG.md as memory, opens PRs, stops at human gates. Human gates: account/keys/payments (Vercel, Supabase, NODE_AUTH_TOKEN, Apple), legal text, design taste, merge to main. Needs: sandboxed/permissioned unattended mode, plan usage limits checked, `.claude-session.json` steps in every repo, CI green as the stop condition. Prepare now: keep every step small, verifiable, and logged.
  Gokul's chosen mode (2026-10-31): Claude Desktop (Code tab). Orchestrator session in Project/ spawns one session per repo (own worktree/branch), each ends with a PULL REQUEST; Gokul merges to main. Sessions ASK Gokul when blocked (he answers: judgement, payments, legal, secrets, accounts). Prerequisites NOT yet done: GitHub access for PRs (`gh` CLI is NOT installed here; GitHub connector needs authorizing via /mcp), connectors Gokul wants to grant, plan usage check.
- [ ] 8. Then feature work from the to-do list (portfolio content, courses, resume, etc.).

- [ ] Graphify: 6 repos already had it (graphify-out, hooks, sync-architecture.sh). 2026-10-31: installed in `admin` (script, git hooks, merge driver, `graphify claude install` created a minimal CLAUDE.md + .claude/ hook; admin chat must extend CLAUDE.md with the full rules). `platform` chat was already running and wrote its own CLAUDE.md: verify its hooks (`graphify hook status`) later. Run `graphify update .` in admin/platform once real code exists (empty repo = empty graph).


## Commit + push everything: `/gitmd` (Claude slash command)
Run Claude in `Project/` and type `/gitmd` (file: `Project/.claude/commands/gitmd.md`). It checks all 8 repos (git only, no file reading), shows a table, flags secrets, ASKS which repos + message, never force-pushes, stops if behind remote, confirms clean at the end.
Old shell version `gitmd.sh` / `git md` alias: deleted by Gokul 2026-10-31 (verified).

## Cleanup scan: `/cleanscan` (Claude slash command)
Run Claude in `Project/` and type `/cleanscan` (file: `Project/.claude/commands/cleanscan.md`). Token-light: shell pipelines only, per-repo cache (HEAD + status hash) in `Project/.cleanscan/`, unchanged repos skipped. Finds junk, copy names, patch clutter, tracked-but-ignored, >1 MB, exact duplicates. ASKS per group; deletes only what Gokul approves; then tells him to run `/gitmd`.
Old shell version `cleanscan.sh` / `git cs` alias: deleted by Gokul 2026-10-31 (verified). Two test reports (Progress, Markdown-studio) remain in `.cleanscan/` and will be refreshed by the first `/cleanscan` run.
First findings (2026-10-31): Progress has many `src/files/* copy/` duplicates; Markdown-studio has PATCH_* clutter in root and docs/patches. Nothing deleted.
RULE (Gokul): tools/commands are Claude-run .md prompts that ask questions, not .sh scripts.

## Why everything is logged (Gokul, 2026-10-31)
Tokens/context may end at any time. State must live in files so any new chat resumes with: what is done, what is pending, in what order. Update the docs in the same turn as every decision.

## Working agreement
- Chat = advisor. Gokul does the work and reports what they're doing; Claude suggests next step, flags risks, asks questions.
- Claude may read repos (read-only). No edits (incl. this file) without explicit yes.
- Ask questions until 100% clear. New chat when context fills; this file carries state.

## Repos (all under /Users/gokulsaraswat.vc/Documents/Project)
| Folder | What | State (2026-10-31) |
|---|---|---|
| Progress | GSpace, Astro 5 + vanilla JS, local-first | clean, synced with origin/main (v1.0.8) |
| bestportofolio | Portfolio, Next.js 16 + Supabase | clean, synced |
| Markdown-studio | Static HTML/JS | clean, synced |
| checkers-gym-management | React 18 + Supabase | only generated `graphify-out/` files modified |
| gokulmobilize | Android, early | clean, synced |
| gokul-omni-converter | Python desktop | clean, synced |

## Current focus
**GSpace: MDX support, step by step**
1. Astro renders `.mdx` (add `@astrojs/mdx`).
2. File editor opens and previews `.mdx`.
Also: set Astro `base: '/gspace'` now (decided).

Status: GSpace "commit and push pending" → nothing pending (verified by git status).

## Decisions
- 2026-10-27: One `.com`, path per app (`/blog`, `/gspace`, `/studio`, `/gym`); hub proxies via rewrites.
- 2026-10-27: Keep bestportofolio on Next.js (already Supabase); Astro only for new content-only sites.
- 2026-10-27: One Supabase project; `user_roles(user_id, app, role)` + RLS; start with 3 roles (super_admin, admin, member).
- 2026-10-27: Shared packages `@gokulsaraswat/ui`, `@gokulsaraswat/mdx` (with `WebWindow`), `@gokulsaraswat/auth`; separate repos, no monorepo for now.
- 2026-10-27: Payments later: Razorpay hosted checkout + `PaymentProvider` interface; no own gateway.
- 2026-10-31: GSpace gets base path `/gspace` now.
- 2026-10-31: WORKLOG lives at `Project/WORKLOG.md`.
- 2026-10-31: Admin architecture: ONE `admin` repo (Next.js + Supabase) edits DATA in Supabase (MDX content, toggles, JSON config, theme tokens as CSS vars), not code in other repos. Sites read those rows at load/build. Tables: `content(app,slug,body)`, `app_config(app,key,value jsonb)`, `user_roles(user_id,app,role)`.
- 2026-10-31: Two new repos, both LATER: `admin` and `platform` (`@gokulsaraswat/ui`, `@gokulsaraswat/mdx` incl. browser MDX preview via `evaluate()`, `@gokulsaraswat/auth`). Stack unchanged.
- 2026-10-31: MDX preview (browser-side) lives in the admin app only; public sites compile MDX at build/server time. `evaluate()` for trusted admins only.
- 2026-10-31: bestportofolio becomes public-only; its admin moves to `admin` LAST (no breakage).
- 2026-10-31: Login is NOT required for visitors. Login only for admin/workers/clients (e.g. gym mgmt) and light uses (comments, likes, feedback). Analytics = simple click/page counters, no login.
- 2026-10-31: GSpace works offline/local-first AND syncs online via Supabase when connected (new themes, components, content). Multi-user possible later.

## To-do
### Now (2-3 days)
**Work** (employer items moved to private Project/PRIVATE-TODO.md; never commit them to a repo)
- [ ] Collect all docs (Sheets, Docs, PDFs) and upload missing ones to the documents section

**Portfolio (main target: everything works perfectly)**
- [ ] Verify everything works end to end
- [ ] Add completed projects to projects section
- [ ] Add Real-time scheduler to projects
- [ ] Start the courses section
- [ ] Update resume
- [ ] Update resume and about sections on site
- [ ] Design and loading updates, other tweaks

**GSpace**
- [x] Commit and push pending changes (nothing pending, 2026-10-31)
- [ ] Deliverables tracker page for vibe coding (pending vs done per project)
- [ ] Vision board: rework so future ideas get captured
- [ ] Add MDX support (currently MD only) ← in progress
- [ ] Reusable embed component for sites that block embedding (`WebWindow`: iframe, timeout, preview-card fallback)
- [ ] Websites directory section, built as a component
- [ ] Set Astro `base: '/gspace'`

**Other**
- [ ] Gmobilize: create repo, do some work
- [ ] Multi-platform app (not Android-only) to view the website

### Later (design to be discussed)
**Platform**
- [ ] RBAC as shared microservice
- [ ] Single login via Gmobilize
- [ ] One drop-in chatbot for all apps
- [ ] GSpace: Claude setup section (skills, connectors)
- [ ] Books section ("Book" category in portfolio blog, short/voice version e.g. NotebookLM)
- [ ] Portfolio: code snippets as components (Excalidraw, JSON websites, etc.)
- [ ] Portfolio: MD to MDX, move to Astro if possible
- [ ] More MDX components (e.g., calculator)
- [ ] Excalidraw-based website for admin/CRM design drawings

**Four key projects (showcase)**
- [ ] Payment system (high-QPS design; Razorpay clone as reference)
- [ ] Cleartrip clone
- [ ] Core tech project: Spring Boot, Hibernate, Kafka
- [ ] AI project

**Profiles and content**
- [ ] Update READMEs of projects
- [ ] LinkedIn + X; post on LinkedIn
- [ ] YouTube: set up, 2-3 videos
- [ ] Topmate: update profile, downloadable resources
- [ ] Naukri: update
- [ ] LeetCode incl. NeetCode 150
- [ ] Shreyansh Coding School: subscribe, learn, make blogs/courses

**At the end (must do)**
- [ ] Design update for all apps and sites with best AI skills/plugins

### Far later
- [ ] Checkers Gym Management, Omni Converter, Markdown Studio, similar
- [ ] Ground Desk OS (find open-source version)

### Dropped
Goku chat; Udemy Clone etc. old projects; Claude Code SSO subscription item (IntelliJ + Spring Boot repos for the 4 key projects).

## Platform order (from Ideas.md §9)
1. Domain + base paths + hub rewrites
2. Supabase: shared project, `user_roles`, RLS
3. Extract `@gokulsaraswat/ui`, `@gokulsaraswat/mdx` from bestportofolio
4. Admin app (separate repo)
5. Portfolio blog/courses from MDX files to Supabase
6. Supabase login in Markdown Studio and GSpace
7. Hub site + animations + PWA

## Architecture (agreed 2026-10-31)
- **Gmobilize** (`gokulmobilize`): public hub, one responsive animated PWA page with app tiles. Web first; iOS/Android wrapper (Capacitor) later.
- **Super admin** (new repo, name TBD): Next.js + Supabase + Tailwind. Login + app switcher + per-app admin screens (route groups, so each admin loads only its own code). Also monitors GSpace/Gym.
- **Permissions, 2 layers**: app access (which apps) + permission inside app (e.g. can write blogs, can't delete/manage users). Super admin can grant access incl. other super admins. Tables `user_roles(user_id,app,role)`, `role_permissions(role,permission)`, enforced by RLS.
- bestportofolio becomes public-only after its admin moves.

- **Shared components** (e.g. calculator): build once, use in MDX of every site (portfolio blog/courses, GSpace, gym blog). Lives in `platform` repo as `@gokulsaraswat/mdx` (component registry) + `@gokulsaraswat/ui`; each site installs it and passes the registry to its MDX renderer. Admin preview uses the same registry, so preview = real page.
- **Repos created by Gokul, cloned into Project/ (both empty, no commits)**: `admin` (github.com/gokulsaraswat/admin), `platform` (github.com/gokulsaraswat/platform). Mobile app repo(s) link pending.
- Gokul says a portfolio-admin setup already exists (the one in bestportofolio); it will be moved into `admin`.
- Gokul wants production-grade thinking (HLD/LLD, Kafka, Redis, Docker, Kubernetes) kept in mind, introduced only when a real need appears.

## Gmobilize hub design (PROPOSED 2026-10-31, stack not final)
- Goal: after first load, navigation/sub-sites feel instant, native-like, no white screens.
- Hub: Vite + React (shares React components with `platform`); alternative Svelte 5. Keep data/cache layer plain TS so UI framework is swappable.
- App shell precached by service worker; Capacitor bundles built hub inside the app (one repo `gokulmobilize`, android/ + ios/).
- Config: admin publishes static `config.json` to Supabase Storage public bucket (CDN). Hub paints cached copy first, refreshes in background (stale-while-revalidate, IndexedDB).
- Transitions: native View Transitions API + CSS, no animation library.
- Sub-sites: separate deploys on one domain (path per app). Mix by app: static/client-only apps (GSpace, Markdown Studio) bundled in native app; server-backed apps (portfolio, gym) remote; third-party links in in-app browser.
- Offline: cached shell + last config; "save for later" for blogs/courses (Cache API/IndexedDB); online = fetch fresh from remote. GSpace fully usable offline.
- Rollout: web PWA + Android (Capacitor, direct APK install) together. iOS: no Apple Developer account (no spend yet) → iOS users use PWA "Add to Home Screen"; native iOS only via personal Xcode sideload (free Apple ID, 7-day expiry).

## Process (decided 2026-10-31)
- This chat = planning only. Work happens in a separate chat per repo using prompts in `Not Repository/prompts/PROMPTS.md` (SHARED BLOCK + repo section; COLLABORATOR ADD-ON for collaborators). Gokul returns here to confirm and plan the next repo.
- Repo kit checklist: `Not Repository/prompts/REPO-KIT.md` (README, CLAUDE.md, AGENTS.md, WORKLOG.md, .claude-session.json, COLLABORATORS.md, docs/CONTRACTS.md, CI, graphify).
- Master docs + prompts move to `platform/docs/` once platform has its first commit (so collaborators can see them).
- Git: owner pushes to main; collaborators branch + PR. No collaborators yet; any future person must be able to continue from repo docs alone.
- Prompt styles: interactive (owner) and autonomous add-on (collaborators).
- Shared footer set: Privacy, Terms, Cookie Policy, Data Deletion Request, Accessibility Statement, Sitemap, FAQ, About, Contact + SEO basics (from `@gokulsaraswat/ui`). Loader/accent/content per app.
- Repo order: platform → admin → gokulmobilize → bestportofolio → Progress → later Markdown-studio, checkers-gym.
- 2026-10-31: Copied PROMPTS.md, REPO-KIT.md and a WORKLOG.md snapshot into `platform/docs/` (uncommitted). From the platform chat on, `platform/docs/WORKLOG.md` is the master; this Project/WORKLOG.md is the planning-chat copy and must be synced.
- Cloned (empty): `admin`, `platform`. Mobile = existing `gokulmobilize` (Capacitor, one repo). Mobile repo not yet reset.

- 2026-10-31 DECISION: bestportofolio tech stack stays (already current: Next ^16.1.1, React ^19, TS ^5, Tailwind ^4, Prisma ^6.11, zod ^4, Supabase JS ^2.108). No rewrite/framework change. Targeted items for the bestportofolio chat: verify `next-auth` ^4 is unused then remove; Dockerfile uses bun + `bun.lock*` but repo has package-lock.json (verify Docker build); Node 20 in Dockerfile vs Node 24 locally; adopt @gokulsaraswat/mdx; auth moves to Supabase Auth later. Not verified: build status, Prisma 7 availability.

- 2026-10-31 REQUIREMENT (Gokul): all apps will be deployed (Vercel or elsewhere, not decided per repo); production builds MUST succeed on the host. Added to SHARED BLOCK + REPO-KIT "Deploy-ready rules". Known risks: private @gokulsaraswat/* packages need NODE_AUTH_TOKEN on host/CI; bestportofolio Dockerfile/bun/Node mismatch; base paths per app; Supabase env vars per host. bestportofolio also has Dockerfile + Caddyfile (self-host option).

- 2026-10-31 DECIDED: host = **Vercel for ALL repos**. Consequences to handle in repo chats: (1) hub routes /gspace, /studio, /gym etc. to separate Vercel projects via rewrites (vercel.json or Next rewrites), each app with its base path; (2) `NODE_AUTH_TOKEN` env var on every Vercel project that installs @gokulsaraswat/* (GitHub Packages); (3) Supabase env vars per project; (4) bestportofolio Dockerfile/Caddyfile probably obsolete: ask Gokul before removing; (5) CHECK Vercel plan terms: Hobby is for personal non-commercial use, so the gym app with real clients may need Pro; Gokul to verify on vercel.com; (6) static apps (Markdown-studio on GitHub Pages today) can move to Vercel or stay: ask in its chat.

- 2026-10-31 (Gokul): simple standard = `npm run build` must succeed. Added one-command proof (clean install + build on pinned Node) + file-name CASE check to SHARED BLOCK and REPO-KIT.

- 2026-10-31 (platform chat decisions, now master): scope is `@gokulsaraswat/*` (GitHub Packages requires scope = owner; replaces `@gokul/*` everywhere); npm workspaces; tokens as CSS variables + React components; Changesets, version locally then push, CI-only publish on main; Footer = plain CSS (gk- classes), `<a>` default + `linkComponent` prop, `basePath`, fixed 9 legal links (slugs privacy, terms, cookies, data-deletion, accessibility, sitemap, faq, about, contact); tokens from bestportofolio colors/radius, Tailwind v4 type/shadows; TypeScript pinned ~6.0; platform repo public, all rights reserved; legal pages are PLACEHOLDER text (real text needs Gokul's review); GSpace gets tokens only in v0.1. Contract details: platform/docs/CONTRACTS.md. Apps must serve a route per footer slug under their base path.

- 2026-10-31 (platform chat, step 7 decisions): app ids = hub, admin, portfolio, gspace, studio, gym. Roles = super_admin (global row app '*') > admin > member (per app); NO permissions table yet (role_permissions only when needed). Hub config.json v1 = { version: 1, apps: [{ id, name, href, mode: bundled|remote|external, enabled }] } validated with zod 4 (`parseHubConfig`). `@gokulsaraswat/auth` takes the app's own Supabase client as an argument; helpers getUserRoles/hasRole/isSuperAdmin; client checks only shape UI, RLS is the enforcement. Packages are ESM-only. Contracts: platform/docs/CONTRACTS.md.
- OWNERSHIP (from CONTRACTS): `admin` repo creates the `user_roles` migration + RLS (user_id uuid -> auth.users, app text, role text, PK (user_id, app), super_admin iff app='*'). Still TO BE UPDATED in CONTRACTS: `content`, `app_config` shapes, config.json bucket/path, MDX registry, base paths.

- 2026-10-31 (superseded, see next decision): earlier choice was to reuse the portfolio's Supabase project.

- 2026-10-31 DECIDED (Gokul): the NEW admin is built from scratch with a much better design for a multi-app super admin. The portfolio admin UI is NOT ported (static, portfolio-only); it is only a SPEC for data and fetching. Admin chat phases: 0 spec (docs/PORTFOLIO-ADMIN-SPEC.md), 1 design (my approval), 2 build slices. Supersedes the earlier 'moved, not rewritten' rule. Data layer DECIDED (Gokul delegated): supabase-js + RLS, not Prisma, for the admin. DB stays the same Supabase project; only the UI/admin app is new.

- 2026-10-31 (Gokul answers for admin design): look = admin chat prototypes 2-3 options, Gokul picks; fully responsive/mobile-first; uses almost all portfolio admin features (blogs+ideas, courses, projects, snippets, comments, messages, users, todos, backups, logs, RAG settings, more): keep all in the spec, drop nothing without asking.

- 2026-10-31 DECIDED (delegated to Claude): admin data layer = supabase-js (@supabase/ssr) + RLS; platform tables via SQL migrations in admin repo; types via `supabase gen types`; Prisma stays only for existing portfolio tables + public site until admin parity; RLS enabled table by table after verifying Prisma's DB role has BYPASSRLS (UNVERIFIED) and the public site still works; service-role key server-only. Reason: RLS is the one enforcement the multi-app role model needs; keeping Prisma in the admin would duplicate the schema and bypass roles.

- 2026-10-31 DECIDED (Gokul, supersedes 'reuse portfolio's project'): create a NEW Supabase project (suggested name `gokul-platform`) for admin/roles/config. Portfolio site + old admin stay on the OLD project until a later, separately planned data migration (recreate schema from Prisma, dump/restore, switch env vars, verify, then RLS; old project kept as backup). Admin builds platform-only slices first (login, roles, switcher, config publisher); portfolio-data sections come after the migration. Gym project undecided. Prisma-drift risk no longer applies to platform tables.

- 2026-10-31 Supabase new-project options chosen (Claude recommendation, Gokul creating): standard Postgres; GitHub repo integration skipped for now; Data API ON; auto-expose new tables OFF (explicit GRANTs in migrations); automatic RLS ON. Draft SQL in admin/docs/SUPABASE-SETUP.md updated with grants.

## Findings: bestportofolio (read-only, 2026-10-31)
- Data = Supabase Postgres via **Prisma** (models: AdminUser, Profile, BlogPost, BlogIdea, Project, Course, CourseChapter, ContactMessage, Todo, TodoHistory, Comment, CodeSnippet, OperationLog). Supabase REST used only for RAG chatbot (pgvector, Gemini).
- Admin auth is **custom**, not Supabase Auth: `AdminUser` table, scrypt hashes, TOTP, roles admin/editor + `permissions` string, signed HttpOnly session cookie (`AUTH_SECRET`), `requireAdmin()` on API routes.
- ~25 admin components in `src/components/admin`, ~20 API routes.
- `seed.ts` still seeds `admin/admin123` plaintext, stale vs scrypt schema: fix before reuse.
- DECIDED 2026-10-31: **Supabase Auth** for super admin and all apps (one login + RLS). Existing AdminUser rows must be migrated; custom session/TOTP code retired after.

## Agreed order
1. Portfolio: seed fake project/blog/course, confirm public site works. GSpace already runs (leave as is).
2. Decide auth (above), create super-admin repo shell (login, app switcher, roles), move Portfolio admin in.
3. Gmobilize page (responsive, animated, PWA).
4. GSpace + Gym admin sections; mobile wrapper.
5. Later: GSpace MDX + `/gspace` base path, GSpace offline-first sync, visitor comments/likes, counters, `platform` shared packages.

## Open questions
- GSpace offline-first sync design: which data syncs (themes, components, content)? conflict rules? (discuss after MDX)
- Domain name (develop on localhost / free Vercel domain until then).
- Will gym staff/clients log in early, or only Gokul?
- GSpace is local-first (vanilla JS storage): how does it fit Supabase login later?
- MDX in the editor: preview inside GSpace needs a compile step; browser-side or build-time?

## Session log
- 2026-10-31: Standing rule added (Gokul): Claude auto-updates all planning docs/snapshots without being reminded. Planning prompt now in every repo's docs/master/. Gokul starting RUNBOOK step 1 (platform chat).
- 2026-10-31: Created this file. Verified all repos pushed. Started GSpace MDX plan.
