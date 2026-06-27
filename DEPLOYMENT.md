# Gokul Saraswat — Portfolio Website

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npx prisma generate
npx prisma db push

# 3. Start development server
npm run dev
# Open http://localhost:3000
```

## Admin Panel

Go to `/admin` and log in with:
- **Username:** `admin`
- **Password:** `admin123`

### Admin Sections

| Section | Purpose |
|---------|---------|
| Dashboard | Overview stats |
| Blogs | Create/edit blog posts (article, YouTube, Spotify, tweet types) |
| Projects | Create/edit projects with complexity rating (1-3 stars) |
| Courses | Create/edit courses with nested chapter tree |
| Messages | View contact form submissions |
| Todos | Task management with assignees, completion workflow, history logs |
| AI Chat Bot | RAG chatbot configuration, ingestion, visibility toggle |
| Backup | Database backup & restore |
| Users | Manage admin accounts |
| Settings | Profile settings, typing animation lines, social links |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (hero, featured projects, blog cards)
│   ├── admin/             # Admin panel (login + CMS)
│   ├── blog/[slug]/       # Blog detail page
│   ├── projects/[slug]/   # Project detail page
│   ├── courses/[slug]/    # Course detail page
│   ├── about/             # About page
│   ├── contact/           # Contact form page
│   ├── privacy/           # Privacy policy
│   └── api/               # API routes
│       ├── auth/          # Admin authentication
│       ├── blogs/         # Blog CRUD
│       ├── projects/      # Project CRUD
│       ├── courses/       # Course + chapter CRUD
│       ├── messages/      # Contact messages
│       ├── todos/         # Todo CRUD + history
│       ├── profile/       # Profile settings
│       ├── chat/          # RAG chatbot (streaming)
│       ├── chat-status/   # Chat widget visibility check
│       ├── ingest/        # RAG document ingestion
│       ├── comments/      # Comment system
│       ├── contact/       # Contact form submission
│       ├── backup/        # DB backup/restore
│       └── admin-users/   # User management
├── components/
│   ├── admin/             # Admin panel components
│   │   ├── admin-layout.tsx    # Sidebar navigation + tab routing
│   │   ├── blog-manager.tsx    # Blog CRUD with sort, search
│   │   ├── project-manager.tsx # Project CRUD with sort, complexity stars
│   │   ├── course-manager.tsx  # Course + chapter tree CRUD
│   │   ├── todo-manager.tsx    # Todo system with completion workflow
│   │   ├── rag-settings.tsx    # RAG chatbot config + ingestion
│   │   ├── message-manager.tsx # Contact messages with sort
│   │   ├── profile-settings.tsx # Profile form
│   │   ├── backup-manager.tsx  # DB backup/restore
│   │   ├── user-manager.tsx    # Admin user management
│   │   ├── admin-dashboard.tsx # Stats overview
│   │   └── sort-bar.tsx        # Reusable sort dropdown
│   └── site/              # Public-facing components
│       ├── cards.tsx           # Blog, Project, Course cards
│       ├── chat-widget.tsx     # Floating RAG chat widget
│       ├── chat-bot-wrapper.tsx # Visibility-gated wrapper
│       ├── navbar.tsx          # Top navigation
│       ├── themed-code-block.tsx # Dark/light code blocks
│       ├── comment-section.tsx  # Comment system
│       ├── skills-matrix.tsx    # Skills filter
│       └── typing-animation.tsx # Hero typing effect
├── lib/
│   └── db.ts               # Prisma client singleton
prisma/
├── schema.prisma           # Database schema (SQLite)
└── db/custom.db            # SQLite database file
supabase/
└── migrations/
    └── 001_rag_schema.sql  # RAG chatbot schema (run in Supabase)
```

## Database

**Local:** SQLite (via Prisma) — no setup needed, just run `npx prisma db push`

### Schema Models
- **AdminUser** — Admin login accounts
- **Profile** — Your personal info, social links, skills, chatbot toggle
- **BlogPost** — Blog posts (article/YouTube/Spotify/tweet)
- **Project** — Projects with complexity rating (1-3 stars), tech deep-dive fields
- **Course** + **CourseChapter** — Nested chapter tree
- **ContactMessage** — Contact form submissions
- **Todo** + **TodoHistory** — Task management with audit trail
- **Comment** — Polymorphic comments on any entity

## RAG Chatbot Setup (Optional)

The chatbot uses Supabase (pgvector) + OpenAI. Cost is typically **<$1/month**.

### Step-by-step

1. **Create Supabase project** at [supabase.com](https://supabase.com) (Free Tier)
2. **Run the SQL migration** in Supabase SQL Editor:
   ```
   Copy contents of supabase/migrations/001_rag_schema.sql
   ```
3. **Get your API keys:**
   - Supabase: Dashboard → Settings → API (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
   - OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (`OPENAI_API_KEY`)
4. **Add to `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   OPENAI_API_KEY=sk-...
   ```
5. **Ingest content:** Admin → AI Chat Bot → Batch Ingest
6. **Enable the bot:** Toggle "Show chat widget on website"

### How It Works
- `/api/ingest` — Generates OpenAI embeddings and stores in Supabase pgvector
- `/api/chat` — Takes user message → generates embedding → searches Supabase for relevant chunks → sends context + question to GPT-4o-mini → streams response
- History logs are NOT loaded on page render (memory efficient)
- The widget is gated behind a visibility toggle in admin

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Set environment variables in Vercel Dashboard. For the SQLite database, use the backup/restore feature to export your local DB and import it in production.

### Other Platforms
```bash
npm run build    # Produces optimized production build
npm run start    # Runs production server on port 3000
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
- **Database:** Prisma ORM + SQLite (local), Supabase (RAG)
- **AI:** OpenAI gpt-4o-mini (chat) + text-embedding-3-small (embeddings)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes (dark/light)