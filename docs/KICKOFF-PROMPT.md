# Kickoff prompt: bestportofolio

Master copy: platform/docs/PROMPTS.md (github.com/gokulsaraswat/platform). If they differ, the master wins.
Use: new chat with this repo as working directory. Paste SHARED BLOCK + REPO SECTION. Collaborators also paste the ADD-ON.

## SHARED BLOCK
```text
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

## COLLABORATOR ADD-ON
```text
Collaborator mode: work on branch `<github-username>-<repo>` off main. One commit per completed step, push after each,
open a PR (never push or merge to main). After each commit: git fetch origin main and merge it in; skip steps already done on main.
Take steps in order from .claude-session.json sprint.todo_next. Ask the owner only for [REQ_CONTEXT] blockers; for design
choices decide, and record the decision in that step's done[] entry. Never mark a step done unless built, run and verified.
Update WORKLOG.md after every step so the next person can continue.
```

## REPO SECTION
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
