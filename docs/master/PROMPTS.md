<!-- SNAPSHOT 2026-10-31 of platform/docs/PROMPTS.md. Master lives in github.com/gokulsaraswat/platform/docs. If they differ, the master wins. Do not edit here. -->

# Kickoff Prompts

How to use: open a NEW chat in the repo's folder, paste **SHARED BLOCK** + that repo's **REPO SECTION**.
Collaborators: paste **COLLABORATOR ADD-ON** after them (it overrides the "wait for OK" rule).
Planning/coordination chat (the one with the master WORKLOG) stays separate; come back to it to confirm and plan the next repo.

Order: 1 platform → 2 admin → 3 gokulmobilize → 4 bestportofolio → 5 Progress (GSpace) → later Markdown-studio, checkers-gym.

---

## SHARED BLOCK

```
You are working in ONE repo of a 6-repo platform (github.com/gokulsaraswat/*):
- platform: shared packages (@gokulsaraswat/ui, @gokulsaraswat/mdx, @gokulsaraswat/auth, @gokulsaraswat/config) + MASTER docs in docs/
- admin: super admin (Next.js + Supabase Auth), app switcher, per-app admin sections, roles/permissions
- gokulmobilize: hub (Vite + React PWA, proposed) + Capacitor Android/iOS wrapper
- bestportofolio: public portfolio (Next.js 16, Prisma on Supabase Postgres); its admin is moving to `admin`
- Progress: GSpace (Astro 5, vanilla JS, local-first, MD -> MDX, base path /gspace)
- later: Markdown-studio, checkers-gym-management

STARTUP (before any change)
1. Read, in this repo: CLAUDE.md, AGENTS.md, WORKLOG.md, .claude-session.json, docs/CONTRACTS.md, README.md.
   Also read the master: platform/docs/WORKLOG.md and platform/docs/CONTRACTS.md (GitHub: gokulsaraswat/platform).
   If graphify-out/ exists, query it first.
2. Report to me: current state, what this repo must deliver, which other repos it depends on / affects,
   and EVERY doubt. Wait for my answers.

RULES
- Ask as many questions as needed until you are 100% certain. Never assume. Never invent a file, table,
  function, prop, env var or API. If it is not in the code or docs, stop with: [REQ_CONTEXT]: I need <thing>.
- Use skills/plugins by default: ponytail (smallest working solution), caveman (terse output),
  graphify (code map), plus any other fitting skill. Order: reuse -> stdlib/platform -> existing dep -> new code.
- Small steps. Before each step: say what you will change and wait for my OK.
  After each step: build + lint + run, show evidence, then update WORKLOG.md, .claude-session.json,
  docs/CONTRACTS.md (if an interface changed), refresh graphify, commit, push.
- Git: owner pushes to main. Collaborators: branch `<user>-<repo>` + PR only. Never force-push.
- Docs upkeep is automatic: never wait to be told. Keep every file in REPO-KIT current in the same step, and if the process or an
  interface changes, update the affected docs (WORKLOG, CONTRACTS, KICKOFF-PROMPT, master requests) and say what you updated.
- Never edit another repo. Needs from other repos go into platform/docs/WORKLOG.md as a request.
- Shared constants come from @gokulsaraswat/ui (design philosophy, tokens, footer with Privacy, Terms, Cookie Policy,
  Data Deletion Request, Accessibility Statement, Sitemap, FAQ, About, Contact; SEO basics). Per-app: loader, accent, content.
- Simple proof of deploy-ready: run `rm -rf node_modules .next dist && npm ci && npm run build` (or the repo's equivalent) on the pinned Node. If it passes, Vercel will build. Also check file-name CASE in imports (macOS ignores case, Vercel/Linux does not).
- Deploy-ready is part of done: the PRODUCTION build must succeed with the same commands the host runs (clean install from the lockfile, then build), on a pinned Node version
  (`engines` + `.nvmrc`), with every env var listed in .env.example, no reliance on local files, and CI green. A failing host build = not done. Private @gokulsaraswat/* packages
  need an auth token in CI and on the host (.npmrc using ${NODE_AUTH_TOKEN}); never commit the token. Hosting is DECIDED: Vercel for all repos (Gokul, 2026-10-31). Verify with the Vercel build (clean install + production build); Vercel env vars + project settings documented in README. Any exception: ask me.
- Done = builds (production), runs, lint clean, tests pass, docs updated, pushed, GitHub repo tidy.
- Repo kit checklist: platform/docs/REPO-KIT.md. First task in any repo: bring it up to that kit (propose the list, wait for OK).
```

---

## COLLABORATOR ADD-ON

```
Collaborator mode: work on branch `<github-username>-<repo>` off main. One commit per completed step, push after each,
open a PR (never push or merge to main). After each commit: git fetch origin main and merge it in; skip steps already done on main.
Take steps in order from .claude-session.json sprint.todo_next. Ask the owner only for [REQ_CONTEXT] blockers; for design
choices decide, and record the decision in that step's done[] entry. Never mark a step done unless built, run and verified.
Update WORKLOG.md after every step so the next person can continue.
```

---

## REPO SECTIONS

### 1. platform (first)
Scope: master docs + shared packages.
- `docs/`: WORKLOG.md (all repos status + cross-repo requests), CONTRACTS.md, REPO-KIT.md, PROMPTS.md (copy from here).
- Packages (one repo, workspace): `@gokulsaraswat/ui` (tokens, footer + legal/SEO pages, WebWindow shell), `@gokulsaraswat/mdx` (component registry: Calculator, WebWindow, ...; same registry used by admin preview),
  `@gokulsaraswat/auth` (Supabase client + role helpers), `@gokulsaraswat/config` (types/schema for config.json and roles).
- Publish privately to GitHub Packages with a CI workflow; versioning policy (e.g. changesets).
Questions to ask me first: package manager/workspace tool, React-only or also framework-neutral, versioning, who can publish.
Done when: empty repo has the kit + docs + a published `@gokulsaraswat/ui` v0.1 with tokens + footer, installable from another repo.

### 2. admin
Scope: the NEW super admin. Next.js + Supabase Auth + Tailwind, hosted on Vercel. platform is DONE: use the PUBLISHED packages `@gokulsaraswat/ui`, `config`, `auth` (0.1.0; install needs `.npmrc` + `NODE_AUTH_TOKEN` with read:packages; contracts in platform/docs/CONTRACTS.md). `@gokulsaraswat/mdx` does not exist yet.
Already decided (do not re-ask): app ids hub/admin/portfolio/gspace/studio/gym; roles super_admin (row app='*') > admin > member (per app); NO role_permissions table yet; `user_roles` migration + RLS are OWNED BY THIS REPO (columns/PK in CONTRACTS.md); hub config.json v1 shape in `@gokulsaraswat/config` (`parseHubConfig`); database = a NEW Supabase project for the platform (Gokul creates it; see admin/docs/SUPABASE-SETUP.md); the portfolio's data moves into it LATER in a separate planned step.
DESIGN DECISION (Gokul, 2026-10-31): the portfolio's admin UI is static and was built for the portfolio only. Do NOT port or reuse its UI. Treat `bestportofolio/src/components/admin` + `src/app/api/*` as a SPEC for WHAT data exists and HOW it is fetched/validated, then build a better admin from scratch, designed for many apps (super admin).
- Phase 0 (read-only): write `docs/PORTFOLIO-ADMIN-SPEC.md`: per admin feature (blogs, courses, projects, snippets, todos, comments, messages, users, backups, logs, RAG settings, ...): tables, fields, validations, API routes, permissions, quirks, what to keep/drop. Ask me about anything unclear. No code yet.
- Phase 1 (design, my approval before code): information architecture (app switcher -> app sections), roles per screen, mobile behaviour, design system on `@gokulsaraswat/ui` tokens + a component kit (shadcn/ui style), patterns: data tables (sort/filter/bulk), forms (react-hook-form + zod), optimistic updates + skeletons (TanStack Query), command palette, dark mode, audit log, empty/error states. Use the design skills/plugins; show me options and ask which I like. Ask for dashboards I like as references.
- Phase 2 (build, one slice at a time): shell + Supabase login -> `user_roles` migration + RLS (security-critical, max effort, show me the SQL before applying) -> app switcher (route group per app, lazy; an app's admin never loads another's code) -> Portfolio blogs end-to-end on the new design -> remaining sections -> config.json publisher (Supabase Storage public bucket; agree path with me, record in CONTRACTS.md) -> MDX editor with preview (needs @gokulsaraswat/mdx; ask me for Calculator/WebWindow specs) -> migration plan for existing portfolio AdminUser rows + TOTP -> Supabase Auth.
- DATA LAYER DECIDED (Gokul delegated, 2026-10-31): the new admin uses `supabase-js` (`@supabase/ssr`) + Row Level Security, NOT Prisma. Platform tables (`user_roles`, `content`, `app_config`) are plain SQL migrations in THIS repo; generate TS types with `supabase gen types`; policies use `is_super_admin()`/role helpers; service-role key server-only; show me each table's policy SQL before applying.
- PORTFOLIO DATA = LATER STEP (own plan, ask me): until then the portfolio site + its old admin stay on the OLD Supabase project. Migration plan: recreate tables in the new project from `bestportofolio/prisma/schema.prisma` (`prisma db push` to the new DIRECT_URL), dump/restore data, switch the portfolio env vars, verify the site, then add RLS per table. Old project kept as backup until verified. Admin Phase 2 sections for portfolio data come AFTER this migration (build platform-only slices first: login, roles, switcher, config publisher).
- Keep bestportofolio's admin running until the new admin has parity for what I actually use; then remove it from the portfolio (last step, with my OK).
- Also define in CONTRACTS.md (TO BE UPDATED there): `content(app, slug, body)` and `app_config(app, key, value jsonb)` shapes.
FIRST read admin/docs/SUPABASE-SETUP.md (owner checklist + DRAFT SQL for user_roles, RLS, config bucket; review the SQL with me before applying).
ANSWERED by Gokul (2026-10-31): look = SHOW ME 2-3 prototype options and I pick; mobile = fully responsive, mobile-first; features = he uses ALMOST ALL of the portfolio admin (blogs + ideas, courses, projects, snippets, comments, messages, users, todos, backups, logs, RAG settings, and more): keep all in the spec, drop nothing without asking.
Questions to ask me first: reference dashboards I like, Supabase project + keys setup (I create the project; never ask me to paste secrets in chat), migration of existing AdminUser rows + TOTP, config.json bucket/path, admin domain/Vercel project name.

### 3. gokulmobilize
Scope: hub. One repo: web PWA + Capacitor (android/ + ios/). Existing repo has README only (Android idea): ask before replacing.
- Vite + React (proposed, may change; keep data/cache layer plain TS), vite-plugin-pwa, View Transitions API, skeleton screens.
- Fetch `config.json` (Supabase Storage CDN): paint cached copy first, refresh in background (stale-while-revalidate, IndexedDB), offline shell, "save for later" for blogs/courses.
- Sub-sites: separate deploys on one domain (path per app); bundle static apps (GSpace, Markdown Studio) in the native app; others remote; third-party in in-app browser.
- Android: direct APK. iOS: PWA install; native only via personal Xcode sideload (no Apple Developer account).
Questions to ask me first: framework confirmation, hub domain, tile design, which apps are bundled vs remote, config.json fields (agree with admin via CONTRACTS.md).

### 4. bestportofolio
Scope: keep working; become public-only.
- First: make it run end-to-end; seed ONE fake project, blog, course (fix stale `seed.ts` that seeds plaintext admin/admin123 vs scrypt schema); verify every public page.
- Hosting is Vercel: once the build is proven, ask me whether the Dockerfile + Caddyfile (self-host) are still needed or can go (do not delete without my OK).
- Then: adopt @gokulsaraswat/ui footer + legal/SEO pages, read tile/config data if needed, switch MDX to @gokulsaraswat/mdx registry.
- Coordination: the portfolio's data migrates to the NEW Supabase project in a later separate step (plan in admin section 2). Until then do not change DATABASE_URL/Supabase env vars. Do not change the Prisma schema without logging it in WORKLOG/CONTRACTS.
- Last (after admin repo verified): remove admin code + Prisma auth parts, point auth to Supabase Auth.
- Stack decision (2026-10-31): KEEP the stack (Next ^16, React ^19, TS ^5, Tailwind ^4, Prisma ^6, zod ^4, Supabase JS). No rewrite. Verify-then-fix list, one step each, ask me first:
  1. `next-auth` ^4 is in package.json but login is custom: confirm it is unused, then remove.
  2. Dockerfile uses bun + `bun.lock*` but the repo has package-lock.json, and Node 20 vs Node 24 locally: verify the Docker build; fix or ask me.
  3. Run build + lint + start and report real status (not yet verified by anyone).
  4. Check whether a newer Prisma/Next major is worth it; report only, do not upgrade without my OK.
Questions to ask me first: hosting (Dockerfile/Caddyfile in repo), env setup, what "perfect" means for the verification list.

### 5. Progress (GSpace)
Scope: keep running as-is; small changes only now.
- MDX support (`@astrojs/mdx`), build-time; then editor open/preview of .mdx.
- `base: '/gspace'`; check hardcoded paths first (read-only dry run, then ask).
- Later: offline-first sync with Supabase (themes, components, content; decide conflict rules with me), use @gokulsaraswat/mdx, shared footer.
- Keep existing `.claude-session.json` sprint; do NOT touch steps 29 and 35 unless I say so.
Questions to ask me first: what to sync, conflict rules, which pages need the shared footer.

### 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos)
Scope today: static, client-only, local-first markdown workspace (editor + preview, exports, snapshots), deployed on GitHub Pages, PWA (manifest + service-worker.js).
Observed: many patch/agent files in root (PATCH_9_*, FINAL_QA_CHECKLIST.md, implementation_plan.md, .prompts.md, .project-architecture.md): ask before moving or deleting any.
- First: repo kit (WORKLOG.md, AGENTS.md, COLLABORATORS.md, docs/CONTRACTS.md), tidy root with my approval, keep GitHub Pages deploy working.
- Then (not before platform + admin work): base path for the one-domain layout (`/studio`), shared footer + legal/SEO pages from @gokulsaraswat/ui, @gokulsaraswat/mdx registry if MDX is added.
- Later idea: optional Supabase login/sync like GSpace. Nothing decided: ask me.
Questions to ask me first: keep GitHub Pages or move under the main domain, what to clean up, MDX wanted or not, login/sync wanted or not.

### 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works)
Scope today: React 18 + React Router 6 + Material UI + Supabase auth; member dashboard, workout logs, admin panel (plans, members, lifecycle, waivers); `supabase/` has schema.sql, migrations, functions; CI in .github.
Observed: a `.env` file exists in the repo folder: first confirm it is gitignored and never committed (read-only check, report to me).
- First: repo kit; make sure it builds and runs; note which tables/roles exist in `docs/CONTRACTS.md`.
- Then: its admin moves into the super admin (`admin`) as the Gym section (members, plans, waivers); gym keeps staff/client login (visitors need no login) on the shared Supabase project and `user_roles`. Shared footer + legal/SEO pages.
- Decision needed from me: same Supabase project as the other apps or separate (affects RLS and roles).
Questions to ask me first: Supabase project sharing, who logs in early (staff / clients / only me), what is real vs starter/demo, RapidAPI key handling.

### 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform)
Python desktop app (GO Omni Pro 2.4.0, offline, Windows/macOS/Linux). Apply the repo kit only (WORKLOG.md, AGENTS.md, COLLABORATORS.md); no admin/platform wiring planned.
Questions to ask me first: keep it standalone, release/CI status, whether it should appear as a tile in the hub (likely link-only).

---

## CLEANUP REVIEW PROMPT (token-light, optional)

Preferred: run `/cleanscan` in Project (asks and deletes only what you approve; cached reports in `Project/.cleanscan/`). The text below is a cheap extra judgement pass over saved reports:

```text
Read ONLY Project/.cleanscan/*.md. Do not rescan, do not read other files unless a finding is unclear.
For each finding: say keep or remove-candidate and why, in one line. Group by repo. Never delete or edit anything.
I decide. After I answer, delete exactly what I list, then run `git cs -f <repo>` once to confirm, and update WORKLOG.md.
```
