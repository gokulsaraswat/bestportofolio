# Graph Report - bestportofolio  (2026-10-31)

## Corpus Check
- 219 files · ~126,996 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .toml 1)

## Summary
- 1424 nodes · 3278 edges · 90 communities (78 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7168b563`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- related-content.tsx
- admin-dashboard.tsx
- rag-ingest.mjs
- app/layout.tsx
- cn
- sidebar.tsx
- todo-manager.tsx
- package.json
- blog-ideas-manager.tsx
- embed-renderer.tsx
- app/page.tsx
- lucide-react
- auth/route.ts
- rag-settings.tsx
- project-manager.tsx
- next
- use-toast.ts
- badge.tsx
- cards.tsx
- utils.ts
- generateSlug
- logOperation
- course-manager.tsx
- table-of-contents.tsx
- compilerOptions
- db.ts
- requireAdmin
- components.json
- context-menu.tsx
- pagination.tsx
- blog/[slug]/page.tsx
- chat-widget.tsx
- WORKLOG
- scripts
- admin-layout.tsx
- Gokul Saraswat — Portfolio Website
- toggle-group.tsx
- carousel.tsx
- navbar.tsx
- snippet-manager.tsx
- form.tsx
- require-admin.ts
- settings/route.ts
- devDependencies
- Gokul Saraswat — Portfolio
- navigation-menu.tsx
- 🤖 System Architecture & Co-Worker Protocol
- Prompt Playbook — CLAUDE.md Workflow
- blog-manager.tsx
- breadcrumb.tsx
- eslint.config.mjs
- REPO SECTIONS
- Getting started
- menubar.tsx
- projects/[slug]/page.tsx
- Codebase Blueprint & Structural Graph
- WORKLOG: bestportofolio
- collapsible.tsx
- Kickoff prompt: bestportofolio
- Repo Kit (every repo must have these)
- sync-architecture.sh
- next-env.d.ts
- projects/[id]/route.ts
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
- snippets/page.tsx
- DIAGRAM_TYPE_OPTIONS
- Production Deployment
- operation-logs-viewer.tsx
- Production Deployment
- Features
- RAG Chatbot Setup (Optional)
- engines
- Security Policy
- @prisma/client
- chart.tsx
- @google/genai
- seed.mjs
- 📢 Reporting a Vulnerability

## God Nodes (most connected - your core abstractions)
1. `cn()` - 236 edges
2. `react` - 111 edges
3. `lucide-react` - 73 edges
4. `requireAdmin()` - 68 edges
5. `next` - 66 edges
6. `Button()` - 44 edges
7. `logOperation()` - 43 edges
8. `framer-motion` - 42 edges
9. `useToast()` - 35 edges
10. `db` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Authorisation` --references--> `requireAdmin()`  [INFERRED]
  README.md → src/lib/require-admin.ts
- `Findings: bestportofolio (read-only, 2026-10-31)` --references--> `requireAdmin()`  [INFERRED]
  docs/master/WORKLOG.md → src/lib/require-admin.ts
- `Database Schema` --references--> `OperationLog`  [INFERRED]
  README.md → src/components/admin/operation-logs-viewer.tsx
- `Database Schema` --references--> `Todo`  [INFERRED]
  README.md → src/components/admin/todo-manager.tsx
- `Database Schema` --references--> `ContactMessage`  [INFERRED]
  README.md → src/components/site/notification-bell.tsx

## Import Cycles
- None detected.

## Communities (90 total, 12 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.03
Nodes (69): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+61 more)

### Community 1 - "related-content.tsx"
Cohesion: 0.39
Nodes (7): formatDate(), getRelevanceScore(), gradients, parseTags(), RelatedContent(), RelatedContentProps, RelatedItem

### Community 2 - "admin-dashboard.tsx"
Cohesion: 0.05
Nodes (42): @radix-ui/react-dropdown-menu, @radix-ui/react-popover, recharts, ACTION_COLORS, ActivityChart(), ActivityChartProps, getCategorize(), AdminDashboard() (+34 more)

### Community 3 - "rag-ingest.mjs"
Cohesion: 0.24
Nodes (12): ai, chunk(), db, deleteSource(), embed(), ingest(), insertChunks(), main() (+4 more)

### Community 4 - "app/layout.tsx"
Cohesion: 0.07
Nodes (32): src_app_globals, geistMono, geistSans, metadata, RootLayout(), viewport, CursorState, CustomCursor() (+24 more)

### Community 5 - "cn"
Cohesion: 0.07
Nodes (35): cmdk, input-otp, @radix-ui/react-accordion, @radix-ui/react-avatar, @radix-ui/react-tabs, AccordionContent(), AccordionItem(), AccordionTrigger() (+27 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.06
Nodes (39): @radix-ui/react-dialog, Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+31 more)

### Community 7 - "todo-manager.tsx"
Cohesion: 0.14
Nodes (19): FilterValue, Message, messageSortOptions, completedSortOptions, emptyForm, entityTypeOptions, HistoryEntry, priorityConfig (+11 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): name, private, version, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, dotenv, eslint (+25 more)

### Community 9 - "blog-ideas-manager.tsx"
Cohesion: 0.11
Nodes (19): BlogIdea, BlogIdeaForm, emptyForm, IdeaPriority, IdeaStatus, PRIORITY_LABELS, PRIORITY_STYLES, STATUS_COLUMNS (+11 more)

### Community 10 - "embed-renderer.tsx"
Cohesion: 0.15
Nodes (10): ContentWithEmbeds(), EmbedInfo, EmbedRenderer(), extractEmbedsFromText(), parseCustomEmbed(), parseDataUrl(), parseEmbedUrl(), parseSpotify() (+2 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.09
Nodes (23): Blog, Course, DEFAULT_TYPING_LINES, Home(), Project, AboutProfile, AboutSection(), fadeUp (+15 more)

### Community 12 - "lucide-react"
Cohesion: 0.20
Nodes (7): lucide-react, Contributor, ContributorsDisplay(), ContributorsDisplayProps, ContributorsInput(), ContributorsInputProps, Button()

### Community 13 - "auth/route.ts"
Cohesion: 0.14
Nodes (27): POST(), DELETE(), GET(), POST(), hashPassword(), isHashed(), validatePasswordStrength(), verifyPassword() (+19 more)

### Community 14 - "rag-settings.tsx"
Cohesion: 0.15
Nodes (15): DEFAULT_SETTINGS, ProfileSettings(), safeParseStringArray(), safeStringifyArray(), SiteSettings, TABS, IngestDoc, ProfileData (+7 more)

### Community 15 - "project-manager.tsx"
Cohesion: 0.13
Nodes (17): BACKUP_ENTITIES, BackupEntityKey, BackupMeta, Comment, ENTITY_LABEL, ArchitectureDiagram, ArchitectureDiagramType, Project (+9 more)

### Community 16 - "next"
Cohesion: 0.07
Nodes (8): nextConfig, next, metadata, metadata, metadata, metadata, metadata, metadata

### Community 17 - "use-toast.ts"
Cohesion: 0.11
Nodes (24): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, src_components_ui_toast_toastprovider (+16 more)

### Community 18 - "badge.tsx"
Cohesion: 0.16
Nodes (17): SeoPreview(), SeoPreviewProps, truncate(), BlogCard(), BlogCardProps, formatDate(), typeConfig, ProjectCardProps (+9 more)

### Community 19 - "cards.tsx"
Cohesion: 0.14
Nodes (13): Blog, types, Course, Project, Blog, BlogCard(), Course, CourseCard() (+5 more)

### Community 20 - "utils.ts"
Cohesion: 0.10
Nodes (12): clsx, @radix-ui/react-hover-card, @radix-ui/react-radio-group, @radix-ui/react-slider, react-resizable-panels, tailwind-merge, HoverCardContent(), RadioGroup() (+4 more)

### Community 21 - "generateSlug"
Cohesion: 0.14
Nodes (10): DELETE(), PUT(), POST(), DELETE(), PUT(), POST(), normalizeJsonArrayField(), POST() (+2 more)

### Community 22 - "logOperation"
Cohesion: 0.14
Nodes (22): DELETE(), GET(), PUT(), VALID_PRIORITIES, VALID_STATUSES, GET(), POST(), VALID_PRIORITIES (+14 more)

### Community 23 - "course-manager.tsx"
Cohesion: 0.12
Nodes (21): date-fns, BlogListItem, Chapter, ChapterForm, ContentMode, Course, CourseForm, courseSortOptions (+13 more)

### Community 24 - "table-of-contents.tsx"
Cohesion: 0.15
Nodes (16): @radix-ui/react-scroll-area, vaul, ensureHeadingIds(), Heading, slugify(), Drawer(), DrawerClose(), DrawerContent() (+8 more)

### Community 25 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 26 - "db.ts"
Cohesion: 0.14
Nodes (5): GET(), PUT(), dynamic, db, globalForPrisma

### Community 27 - "requireAdmin"
Cohesion: 0.15
Nodes (16): DELETE(), GET(), POST(), PUT(), GET(), POST(), DELETE(), POST() (+8 more)

### Community 28 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 29 - "context-menu.tsx"
Cohesion: 0.12
Nodes (10): @radix-ui/react-context-menu, ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+2 more)

### Community 30 - "pagination.tsx"
Cohesion: 0.18
Nodes (11): react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink() (+3 more)

### Community 31 - "blog/[slug]/page.tsx"
Cohesion: 0.08
Nodes (22): react-markdown, react-syntax-highlighter, Blog, BlogDetailPage(), parseResourceLinks(), ResourceLink, typeIcons, Chapter (+14 more)

### Community 32 - "chat-widget.tsx"
Cohesion: 0.12
Nodes (15): @radix-ui/react-tooltip, ChatBotWrapper(), ChatWidget(), getSpeechRecognitionCtor(), Message, SpeechRecognitionAlternative, SpeechRecognitionCtor, SpeechRecognitionErrorEvent (+7 more)

### Community 33 - "WORKLOG"
Cohesion: 0.08
Nodes (25): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+17 more)

### Community 34 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, admin:create, admin:migrate-passwords, build, db:check, db:generate, db:migrate, db:push (+9 more)

### Community 35 - "admin-layout.tsx"
Cohesion: 0.09
Nodes (24): ChangePasswordForm(), LoginForm(), Session, ContactPage(), AdminLayout(), NavItem, navItems, pageTransition (+16 more)

### Community 36 - "Gokul Saraswat — Portfolio Website"
Cohesion: 0.13
Nodes (14): Admin Panel, Admin Sections, Database, Deployment, Gokul Saraswat — Portfolio Website, How It Works, Other Platforms, Project Structure (+6 more)

### Community 37 - "toggle-group.tsx"
Cohesion: 0.18
Nodes (12): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert(), AlertDescription(), AlertTitle(), alertVariants, ToggleGroup() (+4 more)

### Community 38 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): embla-carousel-react, Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 39 - "navbar.tsx"
Cohesion: 0.12
Nodes (14): achievements, certifications, fadeUp, item, stagger, metadata, Footer(), footerNav (+6 more)

### Community 40 - "snippet-manager.tsx"
Cohesion: 0.16
Nodes (15): CATEGORY_SUGGESTIONS, CodeSnippet, DEMO_TYPES, formatScheduledDate(), getTypeColor(), getTypeIcon(), LANG_COLORS, LANGUAGES (+7 more)

### Community 41 - "form.tsx"
Cohesion: 0.19
Nodes (12): @radix-ui/react-label, react-hook-form, FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext (+4 more)

### Community 42 - "require-admin.ts"
Cohesion: 0.22
Nodes (9): entityExists(), GET(), looksLikeSpam(), POST(), DELETE(), PATCH(), RouteParams, getAdminSession() (+1 more)

### Community 43 - "settings/route.ts"
Cohesion: 0.47
Nodes (5): GET(), parseSiteSettings(), PROFILE_FIELD_MAP, PUT(), SITE_SETTINGS_KEYS

### Community 44 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/qrcode, @types/react (+3 more)

### Community 45 - "Gokul Saraswat — Portfolio"
Cohesion: 0.18
Nodes (10): Admin Panel Features, Database Models, Environment Variables, Gokul Saraswat — Portfolio, License, Pre-flight checks, Project Structure, Scripts (+2 more)

### Community 46 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (10): @radix-ui/react-navigation-menu, NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger() (+2 more)

### Community 47 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.22
Nodes (8): 🔄 Auto-Sync: System Architecture & Graphify, ⏱️ Communication Constraints (Zero Waste Mode), 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📉 Token-Optimized Communication Mode, 🧪 Verification Scope (Token-Efficient Testing)

### Community 48 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 49 - "blog-manager.tsx"
Cohesion: 0.16
Nodes (15): Blog, BlogForm, BlogManager(), blogSortOptions, CATEGORY_SUGGESTIONS, CustomEmbedDialog(), CustomEmbedDialogProps, emptyForm (+7 more)

### Community 50 - "breadcrumb.tsx"
Cohesion: 0.22
Nodes (7): @radix-ui/react-slot, BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 51 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): __dirname, eslintConfig, __filename, eslint-config-next, ref_path, ref_url

### Community 52 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 53 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Install, 2. Configure environment, 3. Set up the database, 4. Create your admin account, 5. Index content for the chatbot (optional), 6. Run, Getting started, Prerequisites

### Community 54 - "menubar.tsx"
Cohesion: 0.11
Nodes (12): @radix-ui/react-menubar, Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 55 - "projects/[slug]/page.tsx"
Cohesion: 0.14
Nodes (13): ArchitectureDiagramsGallery(), DIAGRAM_TYPE_META, DiagramEntry, DiagramType, isImageUrl(), isSvgUrl(), parseArchitectureDiagrams(), Project (+5 more)

### Community 56 - "Codebase Blueprint & Structural Graph"
Cohesion: 0.40
Nodes (4): 1. High-Level Design (HLD) Topology, 2. Current Target Directory Tree, 3. Low-Level Design (LLD) & SOLID Class Schemas, Codebase Blueprint & Structural Graph

### Community 57 - "WORKLOG: bestportofolio"
Cohesion: 0.25
Nodes (7): Blockers / requests to other repos, Current state, Decisions (Gokul, 2026-10-31), Done, In progress / next, Reminders, WORKLOG: bestportofolio

### Community 59 - "Kickoff prompt: bestportofolio"
Cohesion: 0.33
Nodes (5): 4. bestportofolio, COLLABORATOR ADD-ON, Kickoff prompt: bestportofolio, REPO SECTION, SHARED BLOCK

### Community 60 - "Repo Kit (every repo must have these)"
Cohesion: 0.33
Nodes (5): Definition of done (any step), Deploy-ready rules (every repo), Master docs (live in `platform/docs/`), Repo Kit (every repo must have these), Shared constants (from `@gokulsaraswat/ui`, same on every app)

### Community 61 - "sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

### Community 62 - "next-env.d.ts"
Cohesion: 0.50
Nodes (3): NOTE: This file should not be edited, ref_next_types_root_params_d_ts, ref_next_types_routes_d_ts

### Community 63 - "projects/[id]/route.ts"
Cohesion: 0.50
Nodes (3): DELETE(), normalizeJsonArrayField(), PUT()

### Community 64 - "react"
Cohesion: 0.22
Nodes (5): framer-motion, react, MusicPlayer(), emptySubscribe(), useMounted()

### Community 66 - "tailwind.config.ts"
Cohesion: 0.50
Nodes (3): tailwindcss, tailwindcss-animate, config

### Community 69 - "Security"
Cohesion: 0.29
Nodes (7): Authentication, Authorisation, Database, Rate limiting, Security, Still worth doing, Transport and headers

### Community 72 - "Customization Guide"
Cohesion: 0.33
Nodes (6): Add Your Avatar, Add Your Resume PDF, Change Admin Credentials, Change Port, Change to Your Own Name/Info, Customization Guide

### Community 76 - "snippets/page.tsx"
Cohesion: 0.19
Nodes (13): CodeSnippet, getHljsLang(), getLangColor(), getTypeColor(), getTypeIcon(), LANG_COLORS, langMap, SNIPPET_TYPES (+5 more)

### Community 78 - "Production Deployment"
Cohesion: 0.40
Nodes (5): Option A: Node.js (Simplest), Option B: Docker, Option C: Caddy (HTTPS + Auto-renew), Option D: Vercel, Production Deployment

### Community 79 - "operation-logs-viewer.tsx"
Cohesion: 0.22
Nodes (8): Database Schema, ACTION_COLORS, ACTION_ICONS, ENTITY_COLORS, OperationLog, OperationLogsViewer(), Todo, ContactMessage

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
Cohesion: 0.17
Nodes (11): 📄 Disclosure Policy, 📜 License, ❌ Out of Scope, 🏆 Recognition, ⏱️ Response Timeline, 🤝 Responsible Disclosure Guidelines, 🔒 Security Best Practices, Security Policy (+3 more)

### Community 85 - "@prisma/client"
Cohesion: 0.20
Nodes (5): ref_crypto, @prisma/client, db, db, db

### Community 86 - "chart.tsx"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 87 - "@google/genai"
Cohesion: 0.25
Nodes (4): @google/genai, ai, ai, docs

### Community 89 - "📢 Reporting a Vulnerability"
Cohesion: 0.67
Nodes (3): Alternative, Preferred, 📢 Reporting a Vulnerability

## Knowledge Gaps
- **515 isolated node(s):** `Public Website`, `Admin Panel (`/admin`)`, `Tech Stack`, `Prerequisites`, `1. Install` (+510 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 664 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `related-content.tsx`, `admin-dashboard.tsx`, `app/layout.tsx`, `package.json`, `app/page.tsx`, `lucide-react`, `auth/route.ts`, `cards.tsx`, `generateSlug`, `logOperation`, `db.ts`, `requireAdmin`, `blog/[slug]/page.tsx`, `admin-layout.tsx`, `navbar.tsx`, `require-admin.ts`, `settings/route.ts`, `projects/[slug]/page.tsx`, `projects/[id]/route.ts`, `react`, `@google/genai`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `related-content.tsx`, `admin-dashboard.tsx`, `app/layout.tsx`, `cn`, `sidebar.tsx`, `todo-manager.tsx`, `package.json`, `blog-ideas-manager.tsx`, `embed-renderer.tsx`, `app/page.tsx`, `lucide-react`, `rag-settings.tsx`, `project-manager.tsx`, `use-toast.ts`, `badge.tsx`, `cards.tsx`, `utils.ts`, `course-manager.tsx`, `table-of-contents.tsx`, `context-menu.tsx`, `pagination.tsx`, `blog/[slug]/page.tsx`, `chat-widget.tsx`, `WORKLOG`, `admin-layout.tsx`, `toggle-group.tsx`, `carousel.tsx`, `navbar.tsx`, `snippet-manager.tsx`, `form.tsx`, `navigation-menu.tsx`, `blog-manager.tsx`, `breadcrumb.tsx`, `menubar.tsx`, `projects/[slug]/page.tsx`, `snippets/page.tsx`, `operation-logs-viewer.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `admin-dashboard.tsx`, `sidebar.tsx`, `todo-manager.tsx`, `blog-ideas-manager.tsx`, `lucide-react`, `rag-settings.tsx`, `project-manager.tsx`, `use-toast.ts`, `badge.tsx`, `utils.ts`, `course-manager.tsx`, `table-of-contents.tsx`, `context-menu.tsx`, `pagination.tsx`, `blog/[slug]/page.tsx`, `chat-widget.tsx`, `WORKLOG`, `toggle-group.tsx`, `carousel.tsx`, `snippet-manager.tsx`, `form.tsx`, `navigation-menu.tsx`, `breadcrumb.tsx`, `menubar.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `requireAdmin()` (e.g. with `Findings: bestportofolio (read-only, 2026-10-31)` and `Authorisation`) actually correct?**
  _`requireAdmin()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Public Website`, `Admin Panel (`/admin`)`, `Tech Stack` to the rest of the system?**
  _515 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `admin-dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05021173623714459 - nodes in this community are weakly interconnected._