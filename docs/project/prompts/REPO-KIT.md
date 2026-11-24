# Repo Kit (every repo must have these)

Goal: anyone (human or agent) can clone ONE repo and continue the plan with no other context.
Repos: platform, admin, gokulmobilize, bestportofolio, Progress (GSpace), Markdown-studio, checkers-gym-management.

| File | Purpose | Rule |
|---|---|---|
| `README.md` | What it is, run, build, deploy, env vars, links to master docs | Verified commands only |
| `CLAUDE.md` | Agent rules (SOLID, anti-hallucination `[REQ_CONTEXT]`, design standard, verification scope) | Reuse existing text from Progress/CLAUDE.md |
| `AGENTS.md` | 10-line pointer to CLAUDE.md + WORKLOG.md + CONTRACTS.md | Keep short |
| `WORKLOG.md` | This repo: current state, done, in progress, next, blockers | Update every step |
| `.claude-session.json` | Step list: `sprint.todo_next[]` / `sprint.done[]` | Existing format; no renumbering by collaborators |
| `COLLABORATORS.md` | Branch + PR rules, collaborator prompt, ownership | Main: owner pushes; collaborators PR only |
| `docs/CONTRACTS.md` | What this repo exposes / expects (tables, JSON shape, package versions, routes) | Update when an interface changes |
| `docs/ARCHITECTURE.md` | HLD + key LLD (diagram in text) | Only what exists, no wishes |
| `.env.example` | Every env var, no secrets | Must match code |
| `.github/pull_request_template.md`, `.github/workflows/ci.yml` | PR checklist, build+lint+test | CI must pass before merge |
| `SECURITY.md`, `LICENSE`, `.gitignore` | Safety, license | |
| `graphify-out/` | Code map | Refresh after each step |
| GitHub | Description, topics, default branch main, branch protection on main | |

## Master docs (live in `platform/docs/`)
- `WORKLOG.md`: status of ALL repos + cross-repo requests ("repo X needs Y from repo Z").
- `CONTRACTS.md`: Supabase tables, `config.json` schema, MDX component registry, roles/permissions, base paths, package versions.
- `PROMPTS.md`: kickoff prompts (this folder's PROMPTS.md moves there).
- `REPO-KIT.md`: this file.

## Shared constants (from `@gokulsaraswat/ui`, same on every app)
- Design philosophy + tokens (colors, type scale, radius, shadows, motion timings), per Progress/CLAUDE.md standard.
- Footer with all SEO + legal pages: Privacy Policy, Terms, Cookie Policy, Data Deletion Request, Accessibility Statement, Sitemap (HTML + `sitemap.xml`), FAQ, About, Contact.
- SEO basics per site: title/meta/OG, JSON-LD, `robots.txt`, `sitemap.xml`.
- NOT shared (per app): loader, accent theme, content.

## Deploy-ready rules (every repo)
- One-command proof: `rm -rf node_modules .next dist && npm ci && npm run build` (repo equivalent) passes on the pinned Node. Imports must match file-name CASE exactly (macOS ignores case, Vercel/Linux does not).
- Production build passes locally AND in CI using the host's commands (clean install from lockfile, then build). Node pinned (`engines`, `.nvmrc`). One package manager, one lockfile.
- `.env.example` lists every variable; host env vars documented in README.
- Private `@gokulsaraswat/*` packages: `.npmrc` with `${NODE_AUTH_TOKEN}`, token set in CI + host (Vercel env), never committed.
- Base paths/rewrites for the one-domain layout (/gspace, /studio, ...) set and tested in a production build.
- Hosting: Vercel for all repos (decided 2026-10-31). README states Vercel project name, build/install commands, required env vars, deploy steps. Build failure on the host = not done.

## Definition of done (any step)
Production build passes, lint clean, tests pass where they exist, evidence shown, docs + WORKLOG + session JSON + graphify updated, committed, pushed.
