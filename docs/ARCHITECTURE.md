# ARCHITECTURE: bestportofolio (current Next.js app)

Describes only what exists on `main` (2026-11-25). Feature-level checklist: `docs/FEATURES.md`. Planned replacement (Astro
public site + admin in the `admin` repo): workspace `PORTFOLIO-ADMIN-ASTRO-PLAN.md`; nothing of it is built here yet.

## Stack
- Next.js 16 App Router (Turbopack build), React 19, TypeScript 5, Tailwind CSS 4 + shadcn/ui (`src/components/ui`),
  `@gokulsaraswat/ui` (shared tokens, styles, Footer, LegalPage; GitHub Packages, needs `NODE_AUTH_TOKEN`).
- Data: Prisma 6.19 (`prisma-client-js`) on the OLD Supabase Postgres (`DATABASE_URL`, `DIRECT_URL`); singleton client in
  `src/lib/db.ts` (no driver adapter). RAG: Supabase vector table via `@supabase/supabase-js` + Google Gemini
  (`@google/genai`), schema in `supabase/migrations/001_rag_schema.sql`.
- Node 24 (`.nvmrc`, `engines >=24 <25`), npm with one lockfile. Env names: `.env.example`.
- Hosting: Vercel (auto-deploys `main`). Optional self-host: `Dockerfile` (`NEXT_OUTPUT=standalone`) + `Caddyfile`.

## Layout
```
src/app/            pages (public + /admin), route handlers under src/app/api/*/route.ts, sitemap.ts, manifest.ts
src/proxy.ts        Next 16 proxy (ex-middleware): per-IP rate limits, session gate for mutating /api calls, /admin headers
src/components/site public UI (navbar, footer, cards, chat widget, music player, comments, search, ...)
src/components/admin admin SPA sections (admin-layout.tsx switches 14 sections)
src/components/ui   shadcn/ui primitives
src/hooks           client hooks (admin session, app settings, keyboard shortcuts, toast, mobile)
src/lib             db, session (signed cookie), require-admin, password, pick-fields, jsonld, log-operation, slug, utils
prisma/             schema.prisma + one migration (init)
scripts/            *.mjs ops scripts run with node --env-file=.env (db-check, seed, create-admin, rag-ingest, ...)
public/             robots.txt, logo.svg, resume PDF, background music mp3s
```

## Request flow
- Public pages are client components: they render a shell, then `fetch('/api/...')` in the browser (lists fill after the
  API responds). `/privacy` and `/[legal]` are server-rendered; root layout is a server component that adds Person JSON-LD.
- Route handlers query Prisma directly (no service layer). Most writes call `logOperation` (OperationLog table).
- Auth: `POST /api/auth` checks `AdminUser` (hashed password, `src/lib/password.ts`) and sets the signed HttpOnly
  `admin_session` cookie (`src/lib/session.ts`). `requireAdmin` / `requireRole(request,'admin')` in
  `src/lib/require-admin.ts` guard handlers; `src/proxy.ts` additionally rejects unauthenticated mutating `/api/*` calls
  except contact, comments, auth, chat.
- Chat: `POST /api/chat` embeds the question (`gemini-embedding-001`), searches Supabase vectors, streams a
  `gemini-2.5-flash` answer as `text/plain`. Enabled by `Profile.chatBotEnabled` (`/api/chat-status`).
- Settings: `Profile` row holds profile fields plus a `siteSettings` JSON string; `/api/settings` merges both for the client.

## Data model (prisma/schema.prisma)
AdminUser, Profile, BlogPost, BlogIdea, Project, Course, CourseChapter, ContactMessage, Todo, TodoHistory, Comment,
CodeSnippet, OperationLog. Several list fields are JSON stored in strings (tags, resources, architecture diagrams,
contributors, snippet tabs). Only BlogPost and CodeSnippet have `published`; Project and Course do not.

## Build and checks
`npm ci` (postinstall `prisma generate`), `npm run lint`, `npm run typecheck`, `npm run build` (needs no DB:
`sitemap.ts` is `force-dynamic`). No test suite or CI workflow yet. Pre-commit hook regenerates `.project-architecture.md`
(`sync-architecture.sh`); graphify refreshes `graphify-out/` post-commit.
