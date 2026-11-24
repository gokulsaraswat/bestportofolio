# Graph Report - bestportofolio  (2026-11-24)

## Corpus Check
- 237 files · ~150,284 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .example 1, .tex 1)

## Summary
- 1673 nodes · 3560 edges · 109 communities (93 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ffa89a4a`
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
- react
- auth/route.ts
- project-manager.tsx
- blog-ideas-manager.tsx
- next
- use-toast.ts
- card.tsx
- framer-motion
- breadcrumb.tsx
- menubar.tsx
- logOperation
- admin-layout.tsx
- table-of-contents.tsx
- compilerOptions
- db.ts
- related-content.tsx
- components.json
- requireAdmin
- operation-logs-viewer.tsx
- generateSlug
- chat-widget.tsx
- WORKLOG
- scripts
- projects/[slug]/page.tsx
- Gokul Saraswat — Portfolio Website
- toggle-group.tsx
- carousel.tsx
- blog/[slug]/page.tsx
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
- 1.4 Mermaid — Cancellation Sequence Diagrams
- utils.ts
- Codebase Blueprint & Structural Graph
- snippet-manager.tsx
- collapsible.tsx
- Kickoff prompt: bestportofolio
- Repo Kit (every repo must have these)
- sync-architecture.sh
- next-env.d.ts
- snippets/page.tsx
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
- Cancellation — Temporal Workflow
- Production Deployment
- Features
- RAG Chatbot Setup (Optional)
- engines
- Security Policy
- blogs/[id]/route.ts
- 5.20.3 Trip Data Model Changes
- main
- Admin access runbook
- progress.tsx
- ref_next_types_root_params_d_ts
- ref_next_types_routes_d_ts
- src_components_site_navbar_footer
- LLD — Project Repository Initial Setup & Architecture
- context-menu.tsx
- Ideas: One Platform, Many Apps
- REPO SECTIONS
- [legal]/page.tsx
- Supply Cancellation Execute — Success / Failure Event Flow
- command.tsx
- CX Cancellation Flow
- 6.6 Refund Quote Entity
- Prompt Playbook — CLAUDE.md Workflow
- 🤖 System Architecture & Co-Worker Protocol
- Repo Kit (every repo must have these)
- input-otp.tsx
- about-section.tsx
- Agent/sync-architecture.sh
- prompts/PLANNING-CHAT-PROMPT.md

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
- `Done (oldest first)` --references--> `requireAdmin()`  [INFERRED]
  WORKLOG.md → src/lib/require-admin.ts
- `Done (oldest first)` --references--> `Footer()`  [INFERRED]
  WORKLOG.md → src/components/site/footer.tsx

## Import Cycles
- None detected.

## Communities (109 total, 16 thin omitted)

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
Cohesion: 0.07
Nodes (34): src_app_globals, geistMono, geistSans, metadata, RootLayout(), viewport, CursorState, CustomCursor() (+26 more)

### Community 5 - "cn"
Cohesion: 0.07
Nodes (35): @radix-ui/react-accordion, @radix-ui/react-avatar, @radix-ui/react-tabs, AccordionContent(), AccordionItem(), AccordionTrigger(), Alert(), AlertDescription() (+27 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.08
Nodes (30): SheetDescription(), SheetHeader(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+22 more)

### Community 7 - "course-manager.tsx"
Cohesion: 0.10
Nodes (22): BlogListItem, Chapter, ChapterForm, ContentMode, Course, CourseForm, courseSortOptions, emptyChapterForm (+14 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): name, private, version, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, dotenv, eslint (+25 more)

### Community 9 - "courses/[slug]/page.tsx"
Cohesion: 0.13
Nodes (11): react-markdown, react-syntax-highlighter, Chapter, chapterTypeColors, chapterTypeLabels, Course, LinkedBlog, LinkedSnippet (+3 more)

### Community 10 - "embed-renderer.tsx"
Cohesion: 0.15
Nodes (10): ContentWithEmbeds(), EmbedInfo, EmbedRenderer(), extractEmbedsFromText(), parseCustomEmbed(), parseDataUrl(), parseEmbedUrl(), parseSpotify() (+2 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.10
Nodes (20): Blog, Course, DEFAULT_TYPING_LINES, Home(), Project, AnimatedCounter(), ProjectCard(), HeroCarousel() (+12 more)

### Community 12 - "react"
Cohesion: 0.13
Nodes (21): lucide-react, react, DEFAULT_SETTINGS, ProfileSettings(), safeParseStringArray(), safeStringifyArray(), SiteSettings, TABS (+13 more)

### Community 13 - "auth/route.ts"
Cohesion: 0.12
Nodes (31): DELETE(), GET(), POST(), PUT(), POST(), DELETE(), GET(), POST() (+23 more)

### Community 14 - "project-manager.tsx"
Cohesion: 0.09
Nodes (36): date-fns, FilterValue, Message, messageSortOptions, actionColors, LogEntry, ArchitectureDiagram, ArchitectureDiagramType (+28 more)

### Community 15 - "blog-ideas-manager.tsx"
Cohesion: 0.12
Nodes (25): BACKUP_ENTITIES, BackupEntityKey, BackupMeta, BlogIdea, BlogIdeaForm, emptyForm, IdeaPriority, IdeaStatus (+17 more)

### Community 16 - "next"
Cohesion: 0.07
Nodes (19): nextConfig, next, metadata, GET(), POST(), DELETE(), POST(), GET() (+11 more)

### Community 17 - "use-toast.ts"
Cohesion: 0.11
Nodes (24): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, src_components_ui_toast_toastprovider (+16 more)

### Community 18 - "card.tsx"
Cohesion: 0.14
Nodes (17): ChangePasswordForm(), LoginForm(), Session, AdminLayout(), SeoPreview(), SeoPreviewProps, truncate(), BlogCard() (+9 more)

### Community 19 - "framer-motion"
Cohesion: 0.15
Nodes (13): framer-motion, Blog, types, Course, Project, Blog, BlogCard(), Course (+5 more)

### Community 20 - "breadcrumb.tsx"
Cohesion: 0.22
Nodes (7): @radix-ui/react-slot, BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 21 - "menubar.tsx"
Cohesion: 0.11
Nodes (12): @radix-ui/react-menubar, Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 22 - "logOperation"
Cohesion: 0.16
Nodes (20): DELETE(), GET(), PUT(), VALID_PRIORITIES, VALID_STATUSES, GET(), POST(), VALID_PRIORITIES (+12 more)

### Community 23 - "admin-layout.tsx"
Cohesion: 0.08
Nodes (27): @radix-ui/react-dialog, ContactPage(), NavItem, navItems, pageTransition, pageVariants, rolePermissions, Section (+19 more)

### Community 24 - "table-of-contents.tsx"
Cohesion: 0.14
Nodes (17): @radix-ui/react-scroll-area, vaul, ensureHeadingIds(), Heading, slugify(), TableOfContents(), Drawer(), DrawerClose() (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 26 - "db.ts"
Cohesion: 0.20
Nodes (4): LIMITS, dynamic, db, globalForPrisma

### Community 27 - "related-content.tsx"
Cohesion: 0.39
Nodes (7): formatDate(), getRelevanceScore(), gradients, parseTags(), RelatedContent(), RelatedContentProps, RelatedItem

### Community 28 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 29 - "requireAdmin"
Cohesion: 0.15
Nodes (17): DELETE(), GET(), PATCH(), RouteParams, DELETE(), GET(), PUT(), DELETE() (+9 more)

### Community 30 - "operation-logs-viewer.tsx"
Cohesion: 0.22
Nodes (8): Database Schema, ACTION_COLORS, ACTION_ICONS, ENTITY_COLORS, OperationLog, OperationLogsViewer(), Todo, ContactMessage

### Community 31 - "generateSlug"
Cohesion: 0.17
Nodes (10): GET(), normalizeResourceLinks(), POST(), DELETE(), PUT(), POST(), POST(), GET() (+2 more)

### Community 32 - "chat-widget.tsx"
Cohesion: 0.11
Nodes (17): @radix-ui/react-tooltip, ChatBotWrapper(), ChatWidget(), getSpeechRecognitionCtor(), Message, SpeechRecognitionAlternative, SpeechRecognitionCtor, SpeechRecognitionErrorEvent (+9 more)

### Community 33 - "WORKLOG"
Cohesion: 0.07
Nodes (27): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+19 more)

### Community 34 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, admin:create, admin:migrate-passwords, build, db:check, db:generate, db:migrate, db:push (+9 more)

### Community 35 - "projects/[slug]/page.tsx"
Cohesion: 0.13
Nodes (14): ArchitectureDiagramsGallery(), DIAGRAM_TYPE_META, DiagramEntry, DiagramType, isImageUrl(), isSvgUrl(), parseArchitectureDiagrams(), Project (+6 more)

### Community 36 - "Gokul Saraswat — Portfolio Website"
Cohesion: 0.17
Nodes (11): Admin Panel, Admin Sections, Database, Gokul Saraswat — Portfolio Website, How It Works, Project Structure, Quick Start, RAG Chatbot Setup (Optional) (+3 more)

### Community 37 - "toggle-group.tsx"
Cohesion: 0.29
Nodes (8): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 38 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): embla-carousel-react, Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 39 - "blog/[slug]/page.tsx"
Cohesion: 0.18
Nodes (8): Blog, BlogDetailPage(), parseResourceLinks(), ResourceLink, typeIcons, ReadingProgress(), ViewCounter(), estimateReadingTime()

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
Cohesion: 0.20
Nodes (9): CONTEXT: read this first in every new session, Future changes (expect these; do not block them), How repos interact (the contracts), Repo map, STANDING RULES (from Gokul, apply in every session), This repo: bestportofolio, Vision, Work modes (ask Gokul which one if unclear) (+1 more)

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
Cohesion: 0.18
Nodes (10): 🔄 Auto-Sync: System Architecture & Graphify, ⏱️ Communication Constraints (Zero Waste Mode), Context, 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), STANDING RULES (from Gokul, apply in every session), 🤖 System Architecture & Co-Worker Protocol (+2 more)

### Community 48 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 49 - "blog-manager.tsx"
Cohesion: 0.16
Nodes (15): Blog, BlogForm, BlogManager(), blogSortOptions, CATEGORY_SUGGESTIONS, CustomEmbedDialog(), CustomEmbedDialogProps, emptyForm (+7 more)

### Community 50 - "navbar.tsx"
Cohesion: 0.13
Nodes (12): achievements, certifications, fadeUp, item, stagger, metadata, Footer(), GlobalSearch() (+4 more)

### Community 51 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): __dirname, eslintConfig, __filename, eslint-config-next, ref_path, ref_url

### Community 52 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 53 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Install, 2. Configure environment, 3. Set up the database, 4. Create your admin account, 5. Index content for the chatbot (optional), 6. Run, Getting started, Prerequisites

### Community 54 - "1.4 Mermaid — Cancellation Sequence Diagrams"
Cohesion: 0.05
Nodes (37): 1.1 Scope, 1.2 Actors & Boundaries, 1.3 Functional Breakdown (Low-Level), 1.4.1 Discovery, 1.4.2 Quote, 1.4.3 Execute, 1.4.4 Callback & Workflow Completion, 1.4.5 Status Poll (+29 more)

### Community 55 - "utils.ts"
Cohesion: 0.09
Nodes (15): clsx, @radix-ui/react-hover-card, @radix-ui/react-radio-group, @radix-ui/react-slider, react-day-picker, react-resizable-panels, tailwind-merge, Calendar() (+7 more)

### Community 56 - "Codebase Blueprint & Structural Graph"
Cohesion: 0.40
Nodes (4): 1. High-Level Design (HLD) Topology, 2. Current Target Directory Tree, 3. Low-Level Design (LLD) & SOLID Class Schemas, Codebase Blueprint & Structural Graph

### Community 57 - "snippet-manager.tsx"
Cohesion: 0.16
Nodes (15): CATEGORY_SUGGESTIONS, CodeSnippet, DEMO_TYPES, formatScheduledDate(), getTypeColor(), getTypeIcon(), LANG_COLORS, LANGUAGES (+7 more)

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

### Community 63 - "snippets/page.tsx"
Cohesion: 0.19
Nodes (13): CodeSnippet, getHljsLang(), getLangColor(), getTypeColor(), getTypeIcon(), LANG_COLORS, langMap, SNIPPET_TYPES (+5 more)

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

### Community 79 - "Cancellation — Temporal Workflow"
Cohesion: 0.07
Nodes (29): 1.1 Purpose, 1.2 Key design decisions, 1.3 Workflow settings, 1. Overview, 2.1 Three-phase flow, 2.2 Multi-pod signal routing, 2. Architecture, 3.1 Step sequence (+21 more)

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

### Community 85 - "blogs/[id]/route.ts"
Cohesion: 0.09
Nodes (14): ref_crypto, @prisma/client, db, db, db, db, GET(), normalizeResourceLinks() (+6 more)

### Community 86 - "5.20.3 Trip Data Model Changes"
Cohesion: 0.07
Nodes (26): 5.20.1 Overview, 5.20.2.1 Overview, 5.20.2.2 Segment entries, 5.20.2.3 Ancillary entries, 5.20.2.4 Sample hold response (abbreviated), 5.20.2.5 Key principles, 5.20.2 Hold Response Changes, 5.20.3.1 Overview (+18 more)

### Community 87 - "main"
Cohesion: 0.25
Nodes (8): Deployment, Other Platforms, Vercel (Recommended), main(), safeJson(), 🛡️ Supported Versions, Current state (2026-10-31, end of session), Decisions (Gokul, 2026-10-31)

### Community 88 - "Admin access runbook"
Cohesion: 0.40
Nodes (4): Admin access runbook, Alternative (needs reachable DATABASE_URL), Grant admin access (works without DB connectivity), Troubleshooting

### Community 89 - "progress.tsx"
Cohesion: 0.33
Nodes (4): RUNBOOK (one step at a time; Gokul asks "what next", Claude answers from here), Collaborator prompt: DESIGN CHAT (run in this repo, then produce the final prompt), @radix-ui/react-progress, Progress()

### Community 93 - "LLD — Project Repository Initial Setup & Architecture"
Cohesion: 0.08
Nodes (24): 1.1 Purpose, 1.2 Tech Stack, 1.3 High-Level System Context, 1. Executive Summary & Tech Stack, 2.1 Gradle Multi-Module Layout, 2.2 Package Tree (ASCII), 2.3 Module Responsibilities, 2. Directory & Module Structure (+16 more)

### Community 94 - "context-menu.tsx"
Cohesion: 0.12
Nodes (10): @radix-ui/react-context-menu, ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+2 more)

### Community 95 - "Ideas: One Platform, Many Apps"
Cohesion: 0.13
Nodes (14): 10. Open questions, 11. Excellidraw opensource, 1. Vision, 2. Current state (checked in repos), 3. Framework, 4. Content & CMS, 5. Roles (super admin → app admins), 6. Shared packages (so "every component works everywhere") (+6 more)

### Community 96 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 97 - "[legal]/page.tsx"
Cohesion: 0.18
Nodes (10): @gokulsaraswat/ui, dynamicParams, findPage(), generateMetadata(), OWN_PAGES, Props, SharedFooterPage(), sharedPages (+2 more)

### Community 98 - "Supply Cancellation Execute — Success / Failure Event Flow"
Cohesion: 0.18
Nodes (10): 1. Overview, 2. Actors, 3. Success Path, 4.1 Agent Action (Manual Queue), 4. Failure Path, 5. Flow Diagram, 6. Notes, ASCII (+2 more)

### Community 99 - "command.tsx"
Cohesion: 0.18
Nodes (9): cmdk, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+1 more)

### Community 100 - "CX Cancellation Flow"
Cohesion: 0.22
Nodes (8): Actors, CX Cancellation Flow, Flowchart, Notes, Open Issue — `quote_id` on Execute, Phase 1 — Cancel Discovery (via Trips), Phase 2 — Refund Discovery (Quote), Phase 3 — Cancellation Execute

### Community 101 - "6.6 Refund Quote Entity"
Cohesion: 0.22
Nodes (8): 6.6 Refund Quote Entity, 6.6 Refund Quote Entity (Redis), Design principles, Field reference, Penalty fields, Quote API vs Redis (example), Redis JSON, Relationship to §6.5 Snapshot

### Community 102 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 103 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.29
Nodes (6): ⏱️ Communication Constraints (Zero Waste Mode), 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📉 Token-Optimized Communication Mode

### Community 104 - "Repo Kit (every repo must have these)"
Cohesion: 0.33
Nodes (5): Definition of done (any step), Deploy-ready rules (every repo), Master docs (live in `platform/docs/`), Repo Kit (every repo must have these), Shared constants (from `@gokulsaraswat/ui`, same on every app)

### Community 105 - "input-otp.tsx"
Cohesion: 0.33
Nodes (4): input-otp, InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 106 - "about-section.tsx"
Cohesion: 0.40
Nodes (4): AboutProfile, AboutSection(), fadeUp, toParagraphs()

### Community 107 - "Agent/sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

## Knowledge Gaps
- **691 isolated node(s):** `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas`, `1. Starting a New Folder / Project`, `2. Starting with an Existing Project` (+686 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 850 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `admin-dashboard.tsx`, `app/layout.tsx`, `package.json`, `courses/[slug]/page.tsx`, `app/page.tsx`, `react`, `auth/route.ts`, `card.tsx`, `framer-motion`, `logOperation`, `db.ts`, `related-content.tsx`, `requireAdmin`, `generateSlug`, `projects/[slug]/page.tsx`, `blog/[slug]/page.tsx`, `@google/genai`, `navbar.tsx`, `comments/route.ts`, `blogs/[id]/route.ts`, `[legal]/page.tsx`, `about-section.tsx`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `app/layout.tsx`, `cn`, `sidebar.tsx`, `course-manager.tsx`, `package.json`, `courses/[slug]/page.tsx`, `embed-renderer.tsx`, `app/page.tsx`, `project-manager.tsx`, `blog-ideas-manager.tsx`, `use-toast.ts`, `card.tsx`, `framer-motion`, `breadcrumb.tsx`, `menubar.tsx`, `admin-layout.tsx`, `table-of-contents.tsx`, `related-content.tsx`, `operation-logs-viewer.tsx`, `chat-widget.tsx`, `projects/[slug]/page.tsx`, `toggle-group.tsx`, `carousel.tsx`, `blog/[slug]/page.tsx`, `form.tsx`, `navigation-menu.tsx`, `blog-manager.tsx`, `navbar.tsx`, `utils.ts`, `snippet-manager.tsx`, `snippets/page.tsx`, `loader.tsx`, `progress.tsx`, `context-menu.tsx`, `command.tsx`, `input-otp.tsx`, `about-section.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `sidebar.tsx`, `course-manager.tsx`, `react`, `project-manager.tsx`, `blog-ideas-manager.tsx`, `use-toast.ts`, `card.tsx`, `breadcrumb.tsx`, `menubar.tsx`, `admin-layout.tsx`, `table-of-contents.tsx`, `chat-widget.tsx`, `toggle-group.tsx`, `carousel.tsx`, `form.tsx`, `navigation-menu.tsx`, `utils.ts`, `snippet-manager.tsx`, `progress.tsx`, `context-menu.tsx`, `command.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas` to the rest of the system?**
  _691 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.02857142857142857 - nodes in this community are weakly interconnected._
- **Should `dropdown-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Should `admin-dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._