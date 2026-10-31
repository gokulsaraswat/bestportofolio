# Gokul Saraswat — Portfolio

A production-grade, full-stack portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Prisma + Supabase Postgres**, and **shadcn/ui**. Features a complete admin CMS, RAG-powered AI chatbot (Google Gemini + pgvector), and pixel-perfect dark/light mode.

> **Setup:** copy `.env.example` to `.env` and fill it in, then create your admin
> account with `npm run admin:create <username>`. See [Getting started](#getting-started).

---

## Features

### Public Website
- **Homepage**: Animated hero with typing effect, skill matrix with project filtering (max 5), featured projects, recent blogs, courses
- **About Page**: Experience timeline, certifications (clickable links), achievements, engineering philosophy, resume download
- **Projects Page**: Filterable project cards with skill/technology multi-select filters (max 5), complexity ratings
- **Project Detail**: Tabbed view (Overview / Technical Deep-Dive / Process & Results) with architecture diagrams, CI/CD snippets, Swagger embeds, terminal sessions
- **Blog Page**: Type filters (article, youtube, spotify, tweet), tag-based filtering (max 5), search
- **Blog Detail**: Markdown rendering with syntax highlighting, embed support (YouTube, Spotify, Tweets), behind-the-scenes section, comments
- **Courses Page**: Course listing with chapter counts
- **Course Detail**: Chapter navigation with section grouping, markdown rendering, HLD/LLD/API design/code block chapter types
- **Contact Page**: Form with validation, contact info sidebar
- **Global Search**: Command-K style search across all content
- **Background Music**: Autoplay on first interaction, bottom-left mute/unmute button
- **AI Chatbot**: RAG-powered floating widget with streaming responses and voice input (requires Google Gemini + Supabase pgvector setup)
- **Dark/Light Mode**: System-aware with manual toggle
- **SEO**: Auto-generated sitemap, OpenGraph/Twitter meta tags
- **404 Page**: Animated not-found page
- **Responsive**: Mobile-first design with sheet navigation

### Admin Panel (`/admin`)
- **Login**: scrypt-hashed passwords, signed HttpOnly session cookie, rate limiting. There is no default account — create one with `npm run admin:create <username>`
- **Dashboard**: Stats cards (blogs, projects, courses, unread messages), recent items
- **Blog Manager**: Full CRUD, search, sort, type selector, tag management, maker-checker (written by / accepted by), markdown editor with live preview
- **Project Manager**: Full CRUD with 20+ fields (banner, screenshots, architecture diagrams, DB schemas, ADR, CI/CD, IaC, observability, test coverage, Swagger, terminal sessions), complexity rating (1-3 stars)
- **Course Manager**: Course CRUD with drag-and-drop chapter ordering, nested sections, chapter types (content, HLD, LLD, API design, code block)
- **Message Manager**: Inbox with read/unread status, sort, detail view
- **Todo Manager**: Full task management with status workflow (draft → in-progress → review → done), priority levels, assignee tracking, inline status changes, completion with remarks, archiving, per-todo history, search, sort
- **Operation Logs**: Admin-only panel showing last 1000 operations across the entire system
- **AI Chat Bot Settings**: Enable/disable chatbot, check Supabase/Gemini configuration, batch RAG ingestion
- **Comment Moderation**: Search, filter by content type, inline edit, delete
- **Backup Manager**: Export/import full database backup as JSON
- **Profile Settings**: Edit all profile fields (name, bio, social links, skills, certifications, typing animation lines, carousel images, chatbot toggle)
- **User Manager**: Create/manage admin users with role-based access (admin, blog_editor, project_editor, course_editor, viewer)
- **Theme Toggle**: Dark/light mode within admin panel
- **Logout**: Redirects to homepage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router; standalone output for Docker only) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Components | shadcn/ui (New York style), Lucide Icons |
| Animations | Framer Motion |
| Database | Supabase Postgres via Prisma ORM |
| Styling | CSS Variables (oklch), tw-animate-css |
| Auth | scrypt password hashing + signed HttpOnly session cookies |
| Chatbot | Google Gemini 2.5 Flash + Supabase pgvector (optional) |
| Markdown | react-markdown, react-syntax-highlighter |
| Forms | react-hook-form + zod + hookform resolvers |
| Icons | Lucide React |

---


## Getting started

### Prerequisites

- **Node.js 20+** (22 LTS recommended) — [nodejs.org](https://nodejs.org)
- A **Supabase** project (free tier is fine) for Postgres + pgvector
- A **Google Gemini** API key, if you want the AI chatbot

> This project standardises on **npm**. `bun.lock` was removed to end the
> dual-lockfile conflict; `package-lock.json` is the source of truth.

### 1. Install

```bash
git clone https://github.com/gokulsaraswat/bestportofolio.git
cd bestportofolio
export NODE_AUTH_TOKEN=$(gh auth token)   # GitHub token with read:packages, for @gokulsaraswat/*
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`. Every variable is documented in `.env.example`.

> **Gotcha:** if your database password contains `@`, `:`, `/`, `?`, `#`, `[`, `]`
> or `%`, it must be URL-encoded inside the connection string. An unencoded `@`
> makes the URL parse against the wrong host and the connection fails with a
> confusing error. `@` becomes `%40`.

Generate the session signing secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run db:check      # verifies connectivity and prints row counts
```

Optionally seed sample content:

```bash
npm run db:seed            # remove again: npm run db:seed -- --clean
```

### 4. Create your admin account

There is **no default account** — the old `admin` / `admin123` bootstrap was
removed because it silently created a publicly-known credential on first request.

```bash
npm run admin:create yourname
```

With no password argument the script generates a strong one and prints it once.
Store it in a password manager.

If you are upgrading an existing deployment that still has plaintext passwords:

```bash
npm run admin:migrate-passwords
```

This hashes them in place and flags each account so the owner must choose a new
password at next sign-in. A flagged account can call nothing but the
password-change endpoint.

### 5. Index content for the chatbot (optional)

```bash
npm run rag:ingest -- --purge     # embed profile, blogs, projects, courses, snippets
npm run rag:check "what does Gokul work on?"   # verify retrieval
```

The `documents` and `chat_logs` tables and the `match_documents` function come
from `supabase/migrations/001_rag_schema.sql`. Apply it to your Supabase project
before ingesting, or the chatbot will fail at the vector-search step.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then sign in at `/admin`.

---

## Production Deployment

### Option A: Node.js Standalone

```bash
npm run build
npm run start
```

This runs the optimized standalone build on port 3000.

### Option B: Docker

```bash
NODE_AUTH_TOKEN=<github-token-read:packages> docker build --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```

### Option C: Caddy Reverse Proxy

A `Caddyfile` is included (HTTPS via Caddy, self-host only):

```bash
DOMAIN=your-domain.com UPSTREAM=localhost:3000 caddy run
```

---

## Project Structure

```
portfolio/
├── prisma/
│   └── schema.prisma           # 11 database models
├── public/
│   ├── logo.svg                # Site logo
│   └── robots.txt              # Search engine directives
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout (theme, chat widget, music)
│   │   ├── globals.css         # Tailwind CSS 4 + CSS variables
│   │   ├── not-found.tsx       # Animated 404
│   │   ├── sitemap.ts          # Dynamic sitemap.xml
│   │   ├── middleware.ts       # Auth rate limiting + security headers
│   │   ├── admin/              # Admin panel (login + CMS layout)
│   │   ├── about/              # About page
│   │   ├── blog/               # Blog listing + [slug] detail
│   │   ├── projects/           # Projects listing + [slug] detail
│   │   ├── courses/            # Courses listing + [slug] detail
│   │   ├── contact/            # Contact form
│   │   ├── privacy/            # Privacy policy
│   │   └── api/                # REST API routes
│   │       ├── auth/           # Admin login
│   │       ├── blogs/          # Blog CRUD
│   │       ├── projects/       # Project CRUD
│   │       ├── courses/        # Course + Chapter CRUD
│   │       ├── todos/          # Todo CRUD + per-todo history
│   │       ├── messages/       # Contact messages
│   │       ├── profile/        # Profile settings
│   │       ├── comments/       # Comment system
│   │       ├── contact/        # Contact form submission
│   │       ├── chat/           # RAG chatbot (streaming)
│   │       ├── chat-status/    # Chat widget visibility check
│   │       ├── operation-logs/ # Operation log retrieval
│   │       ├── backup/         # Database export/import
│   │       ├── ingest/         # RAG batch document ingestion
│   │       └── admin-users/    # User management
│   ├── components/
│   │   ├── admin/              # Admin panel components (13 files)
│   │   ├── site/               # Public-facing components (14 files)
│   │   └── ui/                 # shadcn/ui primitives (48 files)
│   ├── hooks/                  # React hooks
│   └── lib/
│       ├── db.ts               # Prisma singleton client
│       ├── utils.ts            # cn() utility
│       ├── slug.ts             # URL slug generator
│       └── log-operation.ts    # Operation audit logger (cap: 1000)
├── supabase/
│   └── migrations/
│       └── 001_rag_schema.sql  # RAG tables (run in Supabase SQL Editor)
├── upload/
│   └── Gokul_Saraswat.pdf     # Resume PDF
├── db/
│   └── (legacy SQLite files removed — the app uses Supabase Postgres)
├── seed.ts                    # Database seeder
├── Dockerfile                 # Multi-stage production Docker build
├── Caddyfile                  # Caddy reverse proxy config
├── .env.example               # Environment variable template
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js (standalone output, security headers)
├── tailwind.config.ts         # Tailwind CSS 4 configuration
├── postcss.config.mjs         # PostCSS config
├── eslint.config.mjs          # ESLint config
└── components.json            # shadcn/ui config (New York style)
```

---

## Database Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **AdminUser** | Admin accounts | username, password, role, TOTP 2FA |
| **Profile** | Your personal info | name, bio, skills (JSON), social links, chatbot toggle |
| **BlogPost** | Blog posts | title, slug, content (Markdown), type, tags, maker-checker |
| **Project** | Portfolio projects | 20+ fields: banners, screenshots, ADR, CI/CD, complexity (1-3) |
| **Course** | Online courses | title, slug, chapters (nested) |
| **CourseChapter** | Course sections | title, content, type (content/HLD/LLD/API/code), self-referential tree |
| **ContactMessage** | Contact form | name, email, message, read status |
| **Todo** | Task management | status workflow, priority, assignee, entity linking |
| **TodoHistory** | Todo audit trail | action, field, oldValue, newValue, actor |
| **Comment** | Polymorphic comments | entityType, entityId (works on blogs/projects) |
| **OperationLog** | System audit log | action, entityType, entityId, actor (auto-capped at 1000) |

---

## Admin Panel Features

| Section | What You Can Do |
|---------|----------------|
| **Dashboard** | See stats: total blogs, projects, courses, unread messages |
| **Blogs** | Create/edit/delete posts, Markdown editor with live preview, type selector (article/YouTube/Spotify/tweet), tag management, search, sort, maker-checker (written by / accepted by) |
| **Projects** | Full CRUD with 20+ fields, complexity rating (1-3 stars), tech stack, architecture diagrams, DB schemas, ADR, CI/CD snippets, IaC, observability, test coverage, Swagger embeds, terminal sessions |
| **Courses** | Course CRUD with drag-and-drop chapter ordering, nested sections, chapter types (content, HLD, LLD, API design, code block) |
| **Messages** | View contact form submissions, mark read/unread, sort |
| **Todos** | Task management: draft -> in-progress -> review -> done, priority levels, assignee, completion with remarks, archiving, per-todo history, search, sort |
| **Operation Logs** | Admin-only panel: last 1000 operations across the entire system with filters |
| **AI Chat Bot** | Enable/disable chatbot, check Supabase + Gemini configuration, batch RAG ingestion |
| **Backup** | Export full database as JSON, import from backup |
| **Users** | Create/manage admin accounts with roles (admin, blog_editor, project_editor, course_editor, viewer) |
| **Settings** | Edit profile: name, bio, social links, skills, certifications, typing animation lines, carousel images, chatbot toggle |

---

## Database Schema

8 models: `AdminUser`, `Profile`, `BlogPost`, `Project`, `Course`, `CourseChapter`, `ContactMessage`, `Todo`, `TodoHistory`, `Comment`, `OperationLog`

Key features:
- **Maker-Checker** on BlogPost (`writtenBy`, `acceptedBy`)
- **Operation Logging** with automatic 1000-record cap
- **Todo History** tracking all field changes with actor info
- **Course Chapters** with self-referential parent/child for nested sections
- **Project Complexity** rating (1-3 scale)

---

## Security

### Authentication
- Passwords are **scrypt** hashes (`node:crypto`, N=16384), verified in constant
  time. A stored value that is not a hash is refused rather than trusted.
- Sign-in issues a **signed HttpOnly SameSite=Lax cookie** (HMAC-SHA256).
  JavaScript cannot read or forge it. Verification uses Web Crypto so the same
  code runs at the edge and in Node.
- **No default account.** Seeding an admin is an explicit operator action.
- Accounts carrying a known-compromised password are flagged
  `mustChangePassword` and may call nothing but `/api/auth/password` — enforced
  in the proxy *and* in every route guard, so the UI gate cannot be skipped.
- Sign-in failures do not reveal whether a username exists.

### Authorisation
- Every mutating route calls `requireAdmin()` directly. The edge proxy is
  defence in depth, not the only gate — internal rewrites can bypass a proxy.
- Endpoints serving private data (`/api/backup`, `/api/messages`,
  `/api/operation-logs`, `/api/todos`, `/api/blog-ideas`, `/api/admin-users`,
  and comment moderation) require a session for reads as well as writes.
- Public reads never return commenter email addresses.
- `GET /api/messages` is side-effect free; retention cleanup is opt-in via
  `?cleanup=true` and floors the window at 30 days.

### Rate limiting
Per-IP, per-endpoint: auth 10/15min, chat 20/10min, contact 5/hr, comments 10/hr.

### Transport and headers
- Security headers on all API routes (X-Content-Type-Options, X-Frame-Options,
  X-XSS-Protection, Referrer-Policy)
- Admin panel protected from clickjacking (SAMEORIGIN) and marked `no-store`
- `poweredByHeader` disabled
- Prisma query logging disabled in production

### Database
- `documents` and `chat_logs` have RLS enabled with no policies and are revoked
  from `anon`/`authenticated`; only the server's service-role key reaches them.
- The application tables still have **RLS disabled**. That is acceptable only
  while the anon key is never used client-side — every query in this app goes
  through server routes. If you ever call Supabase directly from the browser,
  enable RLS and add policies first.

### Still worth doing
- Add TOTP enforcement (the `totpSecret`/`totpEnabled` columns exist but no flow
  uses them yet)
- Move rate-limit state to Redis if you run more than one instance; the current
  map is per-process

---

## Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 (hot reload) |
| `npm run build` | Production build (`NEXT_OUTPUT=standalone` for `.next/standalone/`, used by Docker) |
| `npm run start` | Run production build on port 3000 |
| `npm run lint` | ESLint check |
| `npx prisma generate` | Regenerate Prisma client types |
| `npx prisma db push` | Push schema changes to Supabase Postgres |
| `npx prisma studio` | Open visual database browser |
| `npm run db:seed` | Seed `sample-` blog (draft), project, course; `-- --clean` removes them |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:check` | Verify DB connectivity, print row counts |
| `npm run admin:create <user>` | Create/reset an admin account |
| `npm run admin:migrate-passwords` | Hash any legacy plaintext passwords |
| `npm run rag:ingest` | Rebuild the RAG index (`-- --purge` to wipe first) |
| `npm run rag:check "question"` | Test vector retrieval |

---


## RAG Chatbot Setup (Optional)

The chatbot uses **Supabase (pgvector)** for vector storage and **Google Gemini**
for embeddings and chat.

### Step-by-step

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier)
2. **Run the SQL migration** in the Supabase SQL editor — copy the full contents
   of `supabase/migrations/001_rag_schema.sql` and execute it. This creates the
   `documents` and `chat_logs` tables plus `match_documents()`.
   Without it, `/api/chat` fails at the vector-search step.
3. **Get your keys** — Supabase: Dashboard > Settings > API.
   Gemini: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
4. **Add them to `.env`** (see `.env.example`)
5. **Restart the dev server** — env changes are not hot-reloaded
6. **Index your content:** `npm run rag:ingest -- --purge`
7. **In Admin > AI Chat Bot**, toggle "Show chat widget on website" on

### How it works
- `scripts/rag-ingest.mjs` chunks each blog, project, course, snippet and the
  profile, embeds them with `gemini-embedding-001` (768 dims) and upserts them
  into `documents`, keyed by `(type, source_id)` so re-running replaces a
  source's chunks rather than duplicating them
- `/api/chat` embeds the question, retrieves the top 5 chunks by cosine
  similarity via `match_documents()`, then streams an answer from
  `gemini-2.5-flash` grounded only in that context
- The chat widget supports voice input via the Web Speech API, degrading
  gracefully where unsupported
- Chat history is session-only — nothing is persisted
- `/api/chat` is public, so it is rate limited to 20 requests per 10 minutes
  per IP to bound Gemini spend

---

## Production Deployment

### Option A: Node.js (Simplest)

```bash
npm run build
npm run start    # Runs on port 3000

npm pack # to pack all in small files 
```

### Option B: Docker

```bash
NODE_AUTH_TOKEN=<github-token-read:packages> docker build --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```

The Dockerfile uses multi-stage builds for a minimal final image.

### Option C: Caddy (HTTPS + Auto-renew)

```
your-domain.com {
    reverse_proxy localhost:3000
}
```

### Option D: Vercel

```bash
npm i -g vercel
vercel
```

> For Vercel: set env vars in the dashboard, including `NODE_AUTH_TOKEN` (GitHub token with `read:packages`; needed to install the private `@gokulsaraswat/ui` package via `.npmrc`). Data already lives in Supabase, so no database import is needed — but do set `AUTH_SECRET` and keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

---

## Customization Guide

### Change to Your Own Name/Info

1. **Fastest:** Log into Admin > Settings and edit all profile fields (name, bio, skills, social links, certifications, typing animation lines, carousel images)

### Add Your Resume PDF

Place your PDF at `public/your-resume.pdf`, then update the resume URL in Admin > Settings.

### Add Your Avatar

Place your photo at `public/avatar.jpeg` (or `.png`), then update the avatar URL in Admin > Settings.

### Change Admin Credentials

1. Go to Admin > Users
2. Edit the `admin` user or create a new one
3. Delete the default user if desired

### Change Port

```bash
PORT=4000 npm run dev
# or set HOSTNAME="0.0.0.0" for external access
```

---

---
## Troubleshooting

| Issue | Solution |
|-------|---------|
| `prisma generate` fails | Ensure Node.js 20+ is installed. Run `npm install -D @prisma/client prisma` then retry |
| `npx prisma db push` says "No datasource" | Make sure `.env` exists and contains `DATABASE_URL` and `DIRECT_URL` |
| Database connection fails with a host error | Your password almost certainly contains an unencoded special character. `@` must be `%40` inside the connection string. |
| Port 3000 already in use | Run `npx next dev -p 3001`, or kill the process on 3000 |
| Chatbot shows "not configured" | Set `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY`, then restart. The site works fine without the chatbot. |
| Chatbot answers "I don't have that information" for everything | The RAG index is empty or the schema is missing. Run `npm run rag:ingest -- --purge`, then `npm run rag:check "test"`. |
| Cannot sign in to `/admin` | There is no default account. Run `npm run admin:create <username>`. |
| Signed in but every action returns 403 | The account is flagged `mustChangePassword`. Set a new password when prompted. |
| Seed fails with "unique constraint" | The seed uses `upsert`, so re-running is safe |
| Images not loading | Place your images in `public/` folder. They're accessible at `/filename.ext` |
| Build fails with type errors | Run `npx prisma generate` first, then `npm run build` |
| Docker build fails | Ensure you have Docker 20+. The Dockerfile uses `npm ci` with `package-lock.json` on Node 24 |

---

--- 

## Environment Variables

See `.env.example` for the annotated version.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase Postgres, **transaction** pooler (port 6543). URL-encode special characters in the password — `@` must be `%40`. |
| `DIRECT_URL` | Yes | Supabase Postgres, **session** pooler (port 5432). Used by `prisma migrate` / `db push`. |
| `AUTH_SECRET` | Yes | Signs the admin session cookie. 32+ chars. Changing it invalidates all sessions. |
| `NEXT_PUBLIC_SUPABASE_URL` | Chatbot only | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Chatbot only | Service role key — **server-side only**, never expose to the browser |
| `GEMINI_API_KEY` | Chatbot only | Google Gemini key for embeddings + chat |

---

## Pre-flight checks

```bash
npm run lint
npm run typecheck
npm run build
```

---

## License

Private — All rights reserved.

Built by [Gokul Saraswat](https://gokulsaraswat.com)