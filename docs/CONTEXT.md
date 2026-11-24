# CONTEXT: read this first in every new session

Owner: Gokul. This file is identical in every repo except the last section ("This repo"). Keep it public-safe: no secrets, no private notes.

## Vision
Separate repos/apps behind ONE shared backend, login, admin and UI kit, later joined by a hub site with smooth mobile-first transitions. Single `.com`, one path per app (`/` portfolio, `/apps/` hub, `/admin`, `/gspace`, `/studio`, `/gym`). One Supabase project (`user_roles(user_id, app, role)` + RLS) for all web apps. Payments are later (Razorpay hosted checkout behind a `PaymentProvider` interface; not before logins/roles work).

## Repo map
| Repo | Role | Stack |
|---|---|---|
| platform | Shared `@gokulsaraswat/{ui,config,auth}` (+ `mdx` planned) via GitHub Packages; master docs + `docs/CONTRACTS.md` | npm workspace, TS, Changesets |
| admin | One admin app, role-aware, per-app areas, hub config editor | Next.js + Supabase |
| gokulmobilize | Hub web app at `/apps/` (PWA) + Android Capacitor app | Astro 7, Capacitor |
| bestportofolio | Portfolio at `/` (live on Vercel) | Next.js 16, Supabase |
| Progress (GSpace) | Content/course site at `/gspace` | Astro 7 |
| Markdown-studio | Client-side markdown tool at `/studio` | static HTML/JS |
| checkers-gym-management | Gym app at `/gym` | React (CRA, to move to Vite) + Supabase |
| gokul-omni-converter | Standalone Python desktop app; hub link only | Python |

## How repos interact (the contracts)
- `platform` publishes `@gokulsaraswat/ui|config|auth`; consumers install them with env `NODE_AUTH_TOKEN` (read:packages) and `.npmrc`. Never copy shared code between repos; change it in `platform`, release, then bump.
- `admin` writes hub config to Supabase Storage (`public-config` bucket, `hub/config.json`); `gokulmobilize` hub and Android read it. CORS must allow the web domain, `https://localhost`, `capacitor://localhost`.
- Roles/permissions live in Supabase (`user_roles`, RLS); apps never rely on hidden buttons for security.
- Each app must set its base path (Astro `base`, Next `basePath`, Vite `base`) to fit the URL layout above.
- Source of truth for interfaces: `platform/docs/CONTRACTS.md` and `platform/docs/ARCHITECTURE.md`. Do not guess names; if missing, stop and ask (`[REQ_CONTEXT]`).

## Work modes (ask Gokul which one if unclear)
1. **Integration session:** make apps work together end to end (shared auth, config, base paths, packages, deploys, CORS). Read `platform/docs/CONTRACTS.md` + the other repo's `docs/CONTEXT.md` first. Change contracts in `platform` first, then adapt consumers. Verify cross-repo flows, not just builds.
2. **Single-repo session:** improve one frontend or add features. Stay inside this repo; do not change shared contracts or other repos. If a shared change is needed, write it up as a request for `platform` (add to this repo's `WORKLOG.md`) instead of hacking around it.

## Future changes (expect these; do not block them)
- New APIs / backend services, tech-stack changes (e.g. gym off CRA to Vite), payments, MDX shared components, iOS, delegated admin (`role_permissions`).
- Keep seams clean: shared logic behind small interfaces, config in env, no hardcoded URLs or secrets, ADR-style note in `WORKLOG.md` for any stack decision.

## Working rules
- Start: read `CLAUDE.md`, this file, `WORKLOG.md`, then `docs/master/WORKLOG.md` if present (master snapshot may lag; the Project-level planning chat owns it).
- Use `/gitmd` to commit/push all repos; never commit `.env*`, keys, tokens.
- Update this repo's `WORKLOG.md` (current state + next step) at the end of every session.
- Do not undo Gokul's in-progress or uncommitted work without asking.

## This repo: bestportofolio
Live on Vercel (auto-deploy main). Pending: npm audit vulns, remove seed data, real legal text, domain, migrate data to the new shared Supabase project, switch to MDX once `@gokulsaraswat/mdx` exists.

(Status as of 2026-11-24; `WORKLOG.md` is more current.)
