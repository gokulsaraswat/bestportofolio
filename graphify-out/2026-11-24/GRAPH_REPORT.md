# Graph Report - bestportofolio  (2026-11-24)

## Corpus Check
- 220 files · ~130,752 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .toml 1)

## Summary
- 1458 nodes · 3357 edges · 91 communities (75 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f869d6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- dropdown-menu.tsx
- admin-dashboard.tsx
- rag-ingest.mjs
- app/layout.tsx
- cn
- sidebar.tsx
- course-manager.tsx
- package.json
- courses/[slug]/page.tsx
- embed-renderer.tsx
- app/page.tsx
- profile-settings.tsx
- require-admin.ts
- project-manager.tsx
- message-manager.tsx
- next
- use-toast.ts
- rag-settings.tsx
- cards.tsx
- avatar.tsx
- menubar.tsx
- requireAdmin
- admin-layout.tsx
- table-of-contents.tsx
- compilerOptions
- db.ts
- blog/[slug]/page.tsx
- components.json
- requireRole
- operation-logs-viewer.tsx
- blog-ideas-manager.tsx
- chat-widget.tsx
- WORKLOG
- scripts
- projects/[slug]/page.tsx
- Gokul Saraswat — Portfolio Website
- utils.ts
- carousel.tsx
- context-menu.tsx
- WORKLOG: bestportofolio
- form.tsx
- @google/genai
- CONTEXT: read this first in every new session
- devDependencies
- Gokul Saraswat — Portfolio
- navigation-menu.tsx
- 🤖 System Architecture & Co-Worker Protocol
- Prompt Playbook — CLAUDE.md Workflow
- blog-manager.tsx
- navbar.tsx
- eslint.config.mjs
- REPO SECTIONS
- Getting started
- pagination.tsx
- Codebase Blueprint & Structural Graph
- snippet-manager.tsx
- collapsible.tsx
- Kickoff prompt: bestportofolio
- Repo Kit (every repo must have these)
- sync-architecture.sh
- next-env.d.ts
- proxy.ts
- react
- next-themes
- tailwind.config.ts
- COLLABORATORS.md
- PLANNING-CHAT-PROMPT.md
- Security
- @radix-ui/react-aspect-ratio
- @supabase/supabase-js
- Customization Guide
- update-v3.sh
- AGENTS.md
- postcss.config.mjs
- comments/route.ts
- DIAGRAM_TYPE_OPTIONS
- Production Deployment
- hover-card.tsx
- Production Deployment
- Features
- RAG Chatbot Setup (Optional)
- engines
- Security Policy
- projects/[id]/route.ts
- main
- input-otp.tsx
- seed.mjs
- ref_next_types_root_params_d_ts
- ref_next_types_routes_d_ts
- src_components_site_navbar_footer

## God Nodes (most connected - your core abstractions)
1. `cn()` - 236 edges
2. `react` - 111 edges
3. `lucide-react` - 73 edges
4. `next` - 65 edges
5. `requireAdmin()` - 61 edges
6. `Button()` - 44 edges
7. `logOperation()` - 43 edges
8. `framer-motion` - 42 edges
9. `useToast()` - 35 edges
10. `db` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Findings: bestportofolio (read-only, 2026-10-31)` --references--> `requireAdmin()`  [INFERRED]
  docs/master/WORKLOG.md → src/lib/require-admin.ts
- `Authorisation` --references--> `requireAdmin()`  [INFERRED]
  README.md → src/lib/require-admin.ts
- `🧾 Security log` --references--> `pickFields()`  [INFERRED]
  SECURITY.md → src/lib/pick-fields.ts
- `RUNBOOK (one step at a time; Gokul asks "what next", Claude answers from here)` --references--> `Progress()`  [INFERRED]
  docs/master/WORKLOG.md → src/components/ui/progress.tsx
- `Done (oldest first)` --references--> `requireAdmin()`  [INFERRED]
  WORKLOG.md → src/lib/require-admin.ts

## Import Cycles
- None detected.

## Communities (91 total, 16 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.03
Nodes (70): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+62 more)

### Community 1 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (14): @radix-ui/react-dropdown-menu, ExportData(), ExportDataProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+6 more)

### Community 2 - "admin-dashboard.tsx"
Cohesion: 0.06
Nodes (37): @radix-ui/react-popover, recharts, ACTION_COLORS, ActivityChart(), ActivityChartProps, getCategorize(), AdminDashboard(), getActionIcon() (+29 more)

### Community 3 - "rag-ingest.mjs"
Cohesion: 0.31
Nodes (9): ai, chunk(), db, deleteSource(), embed(), ingest(), insertChunks(), sbHeaders (+1 more)

### Community 4 - "app/layout.tsx"
Cohesion: 0.06
Nodes (36): src_app_globals, geistMono, geistSans, metadata, RootLayout(), viewport, CursorState, CustomCursor() (+28 more)

### Community 5 - "cn"
Cohesion: 0.07
Nodes (37): cmdk, @radix-ui/react-accordion, @radix-ui/react-tabs, AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), BreadcrumbEllipsis() (+29 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.06
Nodes (38): @radix-ui/react-slot, Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+30 more)

### Community 7 - "course-manager.tsx"
Cohesion: 0.14
Nodes (13): BlogListItem, Chapter, ChapterForm, ContentMode, Course, CourseForm, CourseManager(), courseSortOptions (+5 more)

### Community 8 - "package.json"
Cohesion: 0.05
Nodes (40): name, private, version, clsx, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, dotenv (+32 more)

### Community 9 - "courses/[slug]/page.tsx"
Cohesion: 0.13
Nodes (11): react-markdown, react-syntax-highlighter, Chapter, chapterTypeColors, chapterTypeLabels, Course, LinkedBlog, LinkedSnippet (+3 more)

### Community 10 - "embed-renderer.tsx"
Cohesion: 0.09
Nodes (23): CodeSnippet, getHljsLang(), getLangColor(), getTypeColor(), getTypeIcon(), LANG_COLORS, langMap, SNIPPET_TYPES (+15 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.09
Nodes (23): Blog, Course, DEFAULT_TYPING_LINES, Home(), Project, AboutProfile, AboutSection(), fadeUp (+15 more)

### Community 12 - "profile-settings.tsx"
Cohesion: 0.32
Nodes (6): DEFAULT_SETTINGS, ProfileSettings(), safeParseStringArray(), safeStringifyArray(), SiteSettings, TABS

### Community 13 - "require-admin.ts"
Cohesion: 0.21
Nodes (20): POST(), PUT(), POST(), DELETE(), GET(), POST(), hashPassword(), isHashed() (+12 more)

### Community 14 - "project-manager.tsx"
Cohesion: 0.09
Nodes (32): date-fns, actionColors, LogEntry, ArchitectureDiagram, ArchitectureDiagramType, Project, ProjectForm, SortBar() (+24 more)

### Community 15 - "message-manager.tsx"
Cohesion: 0.18
Nodes (18): BACKUP_ENTITIES, BackupEntityKey, BackupMeta, Comment, ENTITY_LABEL, FilterValue, Message, messageSortOptions (+10 more)

### Community 16 - "next"
Cohesion: 0.09
Nodes (8): nextConfig, next, metadata, metadata, metadata, metadata, metadata, metadata

### Community 17 - "use-toast.ts"
Cohesion: 0.11
Nodes (24): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, src_components_ui_toast_toastprovider (+16 more)

### Community 18 - "rag-settings.tsx"
Cohesion: 0.12
Nodes (21): ChangePasswordForm(), LoginForm(), Session, AdminLayout(), IngestDoc, ProfileData, RagSettings(), typeOptions (+13 more)

### Community 19 - "cards.tsx"
Cohesion: 0.14
Nodes (13): Blog, types, Course, Project, Blog, BlogCard(), Course, CourseCard() (+5 more)

### Community 20 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar(), AvatarFallback(), AvatarImage()

### Community 21 - "menubar.tsx"
Cohesion: 0.11
Nodes (12): @radix-ui/react-menubar, Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 22 - "requireAdmin"
Cohesion: 0.09
Nodes (45): DELETE(), GET(), PUT(), VALID_PRIORITIES, VALID_STATUSES, GET(), POST(), VALID_PRIORITIES (+37 more)

### Community 23 - "admin-layout.tsx"
Cohesion: 0.11
Nodes (18): ContactPage(), NavItem, navItems, pageTransition, pageVariants, rolePermissions, Section, BackupManager() (+10 more)

### Community 24 - "table-of-contents.tsx"
Cohesion: 0.14
Nodes (17): @radix-ui/react-scroll-area, vaul, ensureHeadingIds(), Heading, slugify(), TableOfContents(), Drawer(), DrawerClose() (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 26 - "db.ts"
Cohesion: 0.12
Nodes (6): LIMITS, DELETE(), diffFields(), PUT(), dynamic, globalForPrisma

### Community 27 - "blog/[slug]/page.tsx"
Cohesion: 0.13
Nodes (15): Blog, BlogDetailPage(), parseResourceLinks(), ResourceLink, typeIcons, ReadingProgress(), formatDate(), getRelevanceScore() (+7 more)

### Community 28 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 29 - "requireRole"
Cohesion: 0.18
Nodes (13): DELETE(), GET(), GET(), POST(), DELETE(), POST(), GET(), GET() (+5 more)

### Community 30 - "operation-logs-viewer.tsx"
Cohesion: 0.22
Nodes (8): Database Schema, ACTION_COLORS, ACTION_ICONS, ENTITY_COLORS, OperationLog, OperationLogsViewer(), Todo, ContactMessage

### Community 31 - "blog-ideas-manager.tsx"
Cohesion: 0.11
Nodes (19): BlogIdea, BlogIdeaForm, emptyForm, IdeaPriority, IdeaStatus, PRIORITY_LABELS, PRIORITY_STYLES, STATUS_COLUMNS (+11 more)

### Community 32 - "chat-widget.tsx"
Cohesion: 0.11
Nodes (16): @radix-ui/react-tooltip, ChatBotWrapper(), ChatWidget(), getSpeechRecognitionCtor(), Message, SpeechRecognitionAlternative, SpeechRecognitionCtor, SpeechRecognitionErrorEvent (+8 more)

### Community 33 - "WORKLOG"
Cohesion: 0.07
Nodes (28): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+20 more)

### Community 34 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, admin:create, admin:migrate-passwords, build, db:check, db:generate, db:migrate, db:push (+9 more)

### Community 35 - "projects/[slug]/page.tsx"
Cohesion: 0.11
Nodes (18): ArchitectureDiagramsGallery(), DIAGRAM_TYPE_META, DiagramEntry, DiagramType, isImageUrl(), isSvgUrl(), parseArchitectureDiagrams(), Project (+10 more)

### Community 36 - "Gokul Saraswat — Portfolio Website"
Cohesion: 0.17
Nodes (11): Admin Panel, Admin Sections, Database, Gokul Saraswat — Portfolio Website, How It Works, Project Structure, Quick Start, RAG Chatbot Setup (Optional) (+3 more)

### Community 37 - "utils.ts"
Cohesion: 0.11
Nodes (17): class-variance-authority, @radix-ui/react-radio-group, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert(), AlertDescription(), AlertTitle(), alertVariants (+9 more)

### Community 38 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): embla-carousel-react, Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 39 - "context-menu.tsx"
Cohesion: 0.12
Nodes (10): @radix-ui/react-context-menu, ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+2 more)

### Community 40 - "WORKLOG: bestportofolio"
Cohesion: 0.22
Nodes (9): Blockers / requests to other repos, Done (oldest first), Findings (report only), Later (from kickoff, in order), Next chat: start here, Open items (need Gokul), Reminders, Todo next (agent, ask Gokul before each) (+1 more)

### Community 41 - "form.tsx"
Cohesion: 0.19
Nodes (12): @radix-ui/react-label, react-hook-form, FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext (+4 more)

### Community 42 - "@google/genai"
Cohesion: 0.25
Nodes (4): @google/genai, ai, ai, docs

### Community 43 - "CONTEXT: read this first in every new session"
Cohesion: 0.22
Nodes (8): CONTEXT: read this first in every new session, Future changes (expect these; do not block them), How repos interact (the contracts), Repo map, This repo: bestportofolio, Vision, Work modes (ask Gokul which one if unclear), Working rules

### Community 44 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/qrcode, @types/react (+3 more)

### Community 45 - "Gokul Saraswat — Portfolio"
Cohesion: 0.20
Nodes (10): Admin Panel Features, Database Models, Environment Variables, Gokul Saraswat — Portfolio, License, Pre-flight checks, Project Structure, Scripts (+2 more)

### Community 46 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (10): @radix-ui/react-navigation-menu, NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger() (+2 more)

### Community 47 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.20
Nodes (9): 🔄 Auto-Sync: System Architecture & Graphify, ⏱️ Communication Constraints (Zero Waste Mode), Context, 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📉 Token-Optimized Communication Mode (+1 more)

### Community 48 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 49 - "blog-manager.tsx"
Cohesion: 0.13
Nodes (18): Blog, BlogForm, BlogManager(), blogSortOptions, CATEGORY_SUGGESTIONS, CustomEmbedDialog(), CustomEmbedDialogProps, emptyForm (+10 more)

### Community 50 - "navbar.tsx"
Cohesion: 0.08
Nodes (22): @gokulsaraswat/ui, achievements, certifications, fadeUp, item, stagger, dynamicParams, findPage() (+14 more)

### Community 51 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): __dirname, eslintConfig, __filename, eslint-config-next, ref_path, ref_url

### Community 52 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 53 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Install, 2. Configure environment, 3. Set up the database, 4. Create your admin account, 5. Index content for the chatbot (optional), 6. Run, Getting started, Prerequisites

### Community 54 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 56 - "Codebase Blueprint & Structural Graph"
Cohesion: 0.40
Nodes (4): 1. High-Level Design (HLD) Topology, 2. Current Target Directory Tree, 3. Low-Level Design (LLD) & SOLID Class Schemas, Codebase Blueprint & Structural Graph

### Community 57 - "snippet-manager.tsx"
Cohesion: 0.15
Nodes (16): CATEGORY_SUGGESTIONS, CodeSnippet, DEMO_TYPES, formatScheduledDate(), getTypeColor(), getTypeIcon(), LANG_COLORS, LANGUAGES (+8 more)

### Community 59 - "Kickoff prompt: bestportofolio"
Cohesion: 0.25
Nodes (5): 4. bestportofolio, COLLABORATOR ADD-ON, Kickoff prompt: bestportofolio, REPO SECTION, SHARED BLOCK

### Community 60 - "Repo Kit (every repo must have these)"
Cohesion: 0.33
Nodes (5): Definition of done (any step), Deploy-ready rules (every repo), Master docs (live in `platform/docs/`), Repo Kit (every repo must have these), Shared constants (from `@gokulsaraswat/ui`, same on every app)

### Community 61 - "sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

### Community 62 - "next-env.d.ts"
Cohesion: 0.50
Nodes (3): NOTE: This file should not be edited, next_types_root_params_d, next_types_routes_d

### Community 63 - "proxy.ts"
Cohesion: 0.27
Nodes (9): buckets, clientIp(), config, isRateLimited(), LIMITS, MUTATING_METHODS, proxy(), PUBLIC_WRITE_ROUTES (+1 more)

### Community 64 - "react"
Cohesion: 0.20
Nodes (7): framer-motion, lucide-react, react, Button(), buttonVariants, Calendar(), CalendarDayButton()

### Community 66 - "tailwind.config.ts"
Cohesion: 0.50
Nodes (3): tailwindcss, tailwindcss-animate, config

### Community 69 - "Security"
Cohesion: 0.29
Nodes (7): Authentication, Authorisation, Database, Rate limiting, Security, Still worth doing, Transport and headers

### Community 72 - "Customization Guide"
Cohesion: 0.33
Nodes (6): Add Your Avatar, Add Your Resume PDF, Change Admin Credentials, Change Port, Change to Your Own Name/Info, Customization Guide

### Community 76 - "comments/route.ts"
Cohesion: 0.53
Nodes (5): entityExists(), GET(), looksLikeSpam(), POST(), getAdminSession()

### Community 78 - "Production Deployment"
Cohesion: 0.40
Nodes (5): Option A: Node.js (Simplest), Option B: Docker, Option C: Caddy (HTTPS + Auto-renew), Option D: Vercel, Production Deployment

### Community 80 - "Production Deployment"
Cohesion: 0.50
Nodes (4): Option A: Node.js Standalone, Option B: Docker, Option C: Caddy Reverse Proxy, Production Deployment

### Community 81 - "Features"
Cohesion: 0.67
Nodes (3): Admin Panel (`/admin`), Features, Public Website

### Community 82 - "RAG Chatbot Setup (Optional)"
Cohesion: 0.67
Nodes (3): How it works, RAG Chatbot Setup (Optional), Step-by-step

### Community 84 - "Security Policy"
Cohesion: 0.12
Nodes (15): Alternative, 📄 Disclosure Policy, 📜 License, ❌ Out of Scope, Preferred, 🏆 Recognition, 📢 Reporting a Vulnerability, ⏱️ Response Timeline (+7 more)

### Community 85 - "projects/[id]/route.ts"
Cohesion: 0.11
Nodes (13): ref_crypto, @prisma/client, db, db, db, DELETE(), PUT(), PUT() (+5 more)

### Community 87 - "main"
Cohesion: 0.25
Nodes (8): Deployment, Other Platforms, Vercel (Recommended), main(), safeJson(), 🛡️ Supported Versions, Current state (2026-10-31, end of session), Decisions (Gokul, 2026-10-31)

### Community 88 - "input-otp.tsx"
Cohesion: 0.33
Nodes (4): input-otp, InputOTP(), InputOTPGroup(), InputOTPSlot()

## Knowledge Gaps
- **535 isolated node(s):** `📐 Engineering Guardrails`, `🎨 Frontend Architecture, UI/UX & Motion Standard`, `📉 Token-Optimized Communication Mode`, `🛠️ Project Execution Modes (Personal vs. Organization)`, `⏱️ Communication Constraints (Zero Waste Mode)` (+530 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 678 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `admin-dashboard.tsx`, `app/layout.tsx`, `package.json`, `courses/[slug]/page.tsx`, `app/page.tsx`, `require-admin.ts`, `rag-settings.tsx`, `cards.tsx`, `requireAdmin`, `db.ts`, `blog/[slug]/page.tsx`, `requireRole`, `projects/[slug]/page.tsx`, `@google/genai`, `navbar.tsx`, `proxy.ts`, `react`, `comments/route.ts`, `projects/[id]/route.ts`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `app/layout.tsx`, `cn`, `sidebar.tsx`, `course-manager.tsx`, `package.json`, `courses/[slug]/page.tsx`, `embed-renderer.tsx`, `app/page.tsx`, `profile-settings.tsx`, `project-manager.tsx`, `message-manager.tsx`, `use-toast.ts`, `rag-settings.tsx`, `cards.tsx`, `avatar.tsx`, `menubar.tsx`, `admin-layout.tsx`, `table-of-contents.tsx`, `blog/[slug]/page.tsx`, `operation-logs-viewer.tsx`, `blog-ideas-manager.tsx`, `chat-widget.tsx`, `projects/[slug]/page.tsx`, `utils.ts`, `carousel.tsx`, `context-menu.tsx`, `form.tsx`, `navigation-menu.tsx`, `blog-manager.tsx`, `navbar.tsx`, `pagination.tsx`, `snippet-manager.tsx`, `hover-card.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `sidebar.tsx`, `course-manager.tsx`, `project-manager.tsx`, `message-manager.tsx`, `use-toast.ts`, `rag-settings.tsx`, `avatar.tsx`, `menubar.tsx`, `table-of-contents.tsx`, `blog-ideas-manager.tsx`, `chat-widget.tsx`, `utils.ts`, `carousel.tsx`, `context-menu.tsx`, `form.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `snippet-manager.tsx`, `react`, `hover-card.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `📐 Engineering Guardrails`, `🎨 Frontend Architecture, UI/UX & Motion Standard`, `📉 Token-Optimized Communication Mode` to the rest of the system?**
  _535 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.02857142857142857 - nodes in this community are weakly interconnected._
- **Should `dropdown-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Should `admin-dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._