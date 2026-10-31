# Graph Report - bestportofolio  (2026-10-31)

## Corpus Check
- 218 files · ~127,846 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .toml 1)

## Summary
- 1432 nodes · 3315 edges · 88 communities (75 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `172fe100`
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
- project-manager.tsx
- package.json
- input.tsx
- embed-renderer.tsx
- app/page.tsx
- react
- auth/route.ts
- blog-ideas-manager.tsx
- course-manager.tsx
- next
- use-toast.ts
- rag-settings.tsx
- cards.tsx
- utils.ts
- generateSlug
- requireAdmin
- admin-layout.tsx
- table-of-contents.tsx
- compilerOptions
- db.ts
- related-content.tsx
- components.json
- context-menu.tsx
- snippets/page.tsx
- blog/[slug]/page.tsx
- chat-widget.tsx
- WORKLOG
- scripts
- projects/[slug]/page.tsx
- Gokul Saraswat — Portfolio Website
- toggle-group.tsx
- carousel.tsx
- navbar.tsx
- snippet-manager.tsx
- form.tsx
- devDependencies
- Gokul Saraswat — Portfolio
- navigation-menu.tsx
- 🤖 System Architecture & Co-Worker Protocol
- Prompt Playbook — CLAUDE.md Workflow
- blog-manager.tsx
- [legal]/page.tsx
- eslint.config.mjs
- REPO SECTIONS
- Getting started
- menubar.tsx
- Codebase Blueprint & Structural Graph
- WORKLOG: bestportofolio
- collapsible.tsx
- Kickoff prompt: bestportofolio
- Repo Kit (every repo must have these)
- sync-architecture.sh
- next-env.d.ts
- profile-settings.tsx
- sonner.tsx
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
- input-otp.tsx
- DIAGRAM_TYPE_OPTIONS
- Production Deployment
- operation-logs-viewer.tsx
- Production Deployment
- Features
- RAG Chatbot Setup (Optional)
- engines
- Security Policy
- @prisma/client
- require-admin.ts
- @google/genai
- seed.mjs
- 📢 Reporting a Vulnerability
- avatar.tsx

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
- `Done` --references--> `Footer()`  [INFERRED]
  WORKLOG.md → src/components/site/footer.tsx
- `Done` --references--> `validatePasswordStrength()`  [INFERRED]
  WORKLOG.md → src/lib/password.ts
- `Done` --references--> `requireAdmin()`  [INFERRED]
  WORKLOG.md → src/lib/require-admin.ts

## Import Cycles
- None detected.

## Communities (88 total, 13 thin omitted)

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
Cohesion: 0.24
Nodes (12): ai, chunk(), db, deleteSource(), embed(), ingest(), insertChunks(), main() (+4 more)

### Community 4 - "app/layout.tsx"
Cohesion: 0.06
Nodes (33): src_app_globals, geistMono, geistSans, metadata, RootLayout(), viewport, CursorState, CustomCursor() (+25 more)

### Community 5 - "cn"
Cohesion: 0.07
Nodes (39): cmdk, @radix-ui/react-slot, @radix-ui/react-tabs, AlertDialogOverlay(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList() (+31 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.06
Nodes (38): @radix-ui/react-dialog, Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+30 more)

### Community 7 - "project-manager.tsx"
Cohesion: 0.09
Nodes (35): date-fns, FilterValue, Message, messageSortOptions, actionColors, LogEntry, ArchitectureDiagram, ArchitectureDiagramType (+27 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): name, private, version, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, dotenv, eslint (+26 more)

### Community 9 - "input.tsx"
Cohesion: 0.24
Nodes (7): Contributor, ContributorsDisplay(), ContributorsDisplayProps, ContributorsInput(), ContributorsInputProps, Input(), Switch()

### Community 10 - "embed-renderer.tsx"
Cohesion: 0.15
Nodes (10): ContentWithEmbeds(), EmbedInfo, EmbedRenderer(), extractEmbedsFromText(), parseCustomEmbed(), parseDataUrl(), parseEmbedUrl(), parseSpotify() (+2 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.11
Nodes (19): Blog, Course, DEFAULT_TYPING_LINES, Home(), Project, AnimatedCounter(), HeroCarousel(), HeroCarouselProps (+11 more)

### Community 12 - "react"
Cohesion: 0.19
Nodes (11): framer-motion, lucide-react, react, AboutProfile, AboutSection(), fadeUp, toParagraphs(), Button() (+3 more)

### Community 13 - "auth/route.ts"
Cohesion: 0.15
Nodes (24): POST(), DELETE(), GET(), POST(), isHashed(), verifyPassword(), b64urlDecode(), b64urlEncode() (+16 more)

### Community 14 - "blog-ideas-manager.tsx"
Cohesion: 0.11
Nodes (19): BlogIdea, BlogIdeaForm, emptyForm, IdeaPriority, IdeaStatus, PRIORITY_LABELS, PRIORITY_STYLES, STATUS_COLUMNS (+11 more)

### Community 15 - "course-manager.tsx"
Cohesion: 0.12
Nodes (23): BACKUP_ENTITIES, BackupEntityKey, BackupMeta, Comment, ENTITY_LABEL, BlogListItem, Chapter, ChapterForm (+15 more)

### Community 16 - "next"
Cohesion: 0.09
Nodes (8): nextConfig, next, metadata, metadata, metadata, metadata, metadata, metadata

### Community 17 - "use-toast.ts"
Cohesion: 0.11
Nodes (24): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, src_components_ui_toast_toastprovider (+16 more)

### Community 18 - "rag-settings.tsx"
Cohesion: 0.10
Nodes (25): ChangePasswordForm(), LoginForm(), Session, AdminLayout(), IngestDoc, ProfileData, RagSettings(), typeOptions (+17 more)

### Community 19 - "cards.tsx"
Cohesion: 0.14
Nodes (13): Blog, types, Course, Project, Blog, BlogCard(), Course, CourseCard() (+5 more)

### Community 20 - "utils.ts"
Cohesion: 0.08
Nodes (16): clsx, @radix-ui/react-accordion, @radix-ui/react-hover-card, @radix-ui/react-radio-group, @radix-ui/react-slider, react-resizable-panels, tailwind-merge, AccordionContent() (+8 more)

### Community 21 - "generateSlug"
Cohesion: 0.14
Nodes (12): GET(), normalizeResourceLinks(), POST(), POST(), DELETE(), PUT(), POST(), normalizeJsonArrayField() (+4 more)

### Community 22 - "requireAdmin"
Cohesion: 0.12
Nodes (34): DELETE(), GET(), PUT(), VALID_PRIORITIES, VALID_STATUSES, GET(), POST(), VALID_PRIORITIES (+26 more)

### Community 23 - "admin-layout.tsx"
Cohesion: 0.11
Nodes (19): ContactPage(), NavItem, navItems, pageTransition, pageVariants, rolePermissions, Section, BackupManager() (+11 more)

### Community 24 - "table-of-contents.tsx"
Cohesion: 0.14
Nodes (17): @radix-ui/react-scroll-area, vaul, ensureHeadingIds(), Heading, slugify(), TableOfContents(), Drawer(), DrawerClose() (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 26 - "db.ts"
Cohesion: 0.13
Nodes (9): GET(), DELETE(), diffFields(), PUT(), GET(), POST(), dynamic, db (+1 more)

### Community 27 - "related-content.tsx"
Cohesion: 0.39
Nodes (7): formatDate(), getRelevanceScore(), gradients, parseTags(), RelatedContent(), RelatedContentProps, RelatedItem

### Community 28 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 29 - "context-menu.tsx"
Cohesion: 0.12
Nodes (10): @radix-ui/react-context-menu, ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+2 more)

### Community 30 - "snippets/page.tsx"
Cohesion: 0.14
Nodes (15): next-themes, react-syntax-highlighter, CodeSnippet, getHljsLang(), getLangColor(), getTypeColor(), getTypeIcon(), LANG_COLORS (+7 more)

### Community 31 - "blog/[slug]/page.tsx"
Cohesion: 0.09
Nodes (18): react-markdown, Blog, BlogDetailPage(), parseResourceLinks(), ResourceLink, typeIcons, Chapter, chapterTypeColors (+10 more)

### Community 32 - "chat-widget.tsx"
Cohesion: 0.11
Nodes (17): @radix-ui/react-tooltip, ChatBotWrapper(), ChatWidget(), getSpeechRecognitionCtor(), Message, SpeechRecognitionAlternative, SpeechRecognitionCtor, SpeechRecognitionErrorEvent (+9 more)

### Community 33 - "WORKLOG"
Cohesion: 0.08
Nodes (25): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+17 more)

### Community 34 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, admin:create, admin:migrate-passwords, build, db:check, db:generate, db:migrate, db:push (+9 more)

### Community 35 - "projects/[slug]/page.tsx"
Cohesion: 0.14
Nodes (13): ArchitectureDiagramsGallery(), DIAGRAM_TYPE_META, DiagramEntry, DiagramType, isImageUrl(), isSvgUrl(), parseArchitectureDiagrams(), Project (+5 more)

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
Cohesion: 0.10
Nodes (18): @gokulsaraswat/ui, achievements, certifications, fadeUp, item, stagger, metadata, columns (+10 more)

### Community 40 - "snippet-manager.tsx"
Cohesion: 0.15
Nodes (16): CATEGORY_SUGGESTIONS, CodeSnippet, DEMO_TYPES, formatScheduledDate(), getTypeColor(), getTypeIcon(), LANG_COLORS, LANGUAGES (+8 more)

### Community 41 - "form.tsx"
Cohesion: 0.19
Nodes (12): @radix-ui/react-label, react-hook-form, FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext (+4 more)

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

### Community 50 - "[legal]/page.tsx"
Cohesion: 0.24
Nodes (8): dynamicParams, findPage(), generateMetadata(), OWN_PAGES, Props, SharedFooterPage(), sharedPages, src_components_site_navbar_footer

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

### Community 63 - "profile-settings.tsx"
Cohesion: 0.32
Nodes (6): DEFAULT_SETTINGS, ProfileSettings(), safeParseStringArray(), safeStringifyArray(), SiteSettings, TABS

### Community 66 - "tailwind.config.ts"
Cohesion: 0.50
Nodes (3): tailwindcss, tailwindcss-animate, config

### Community 69 - "Security"
Cohesion: 0.29
Nodes (7): Authentication, Authorisation, Database, Rate limiting, Security, Still worth doing, Transport and headers

### Community 72 - "Customization Guide"
Cohesion: 0.33
Nodes (6): Add Your Avatar, Add Your Resume PDF, Change Admin Credentials, Change Port, Change to Your Own Name/Info, Customization Guide

### Community 76 - "input-otp.tsx"
Cohesion: 0.33
Nodes (4): input-otp, InputOTP(), InputOTPGroup(), InputOTPSlot()

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

### Community 86 - "require-admin.ts"
Cohesion: 0.12
Nodes (24): DELETE(), GET(), POST(), PUT(), GET(), POST(), entityExists(), GET() (+16 more)

### Community 87 - "@google/genai"
Cohesion: 0.25
Nodes (4): @google/genai, ai, ai, docs

### Community 89 - "📢 Reporting a Vulnerability"
Cohesion: 0.67
Nodes (3): Alternative, Preferred, 📢 Reporting a Vulnerability

### Community 90 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar(), AvatarFallback(), AvatarImage()

## Knowledge Gaps
- **519 isolated node(s):** `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas`, `Current state`, `Decisions (Gokul, 2026-10-31)` (+514 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 662 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `app/layout.tsx`, `cn`, `sidebar.tsx`, `project-manager.tsx`, `package.json`, `input.tsx`, `embed-renderer.tsx`, `app/page.tsx`, `blog-ideas-manager.tsx`, `course-manager.tsx`, `use-toast.ts`, `rag-settings.tsx`, `cards.tsx`, `utils.ts`, `admin-layout.tsx`, `table-of-contents.tsx`, `related-content.tsx`, `context-menu.tsx`, `snippets/page.tsx`, `blog/[slug]/page.tsx`, `chat-widget.tsx`, `WORKLOG`, `projects/[slug]/page.tsx`, `toggle-group.tsx`, `carousel.tsx`, `navbar.tsx`, `snippet-manager.tsx`, `form.tsx`, `navigation-menu.tsx`, `blog-manager.tsx`, `menubar.tsx`, `profile-settings.tsx`, `loader.tsx`, `input-otp.tsx`, `operation-logs-viewer.tsx`, `avatar.tsx`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `admin-dashboard.tsx`, `projects/[slug]/page.tsx`, `app/layout.tsx`, `navbar.tsx`, `package.json`, `app/page.tsx`, `react`, `auth/route.ts`, `rag-settings.tsx`, `[legal]/page.tsx`, `cards.tsx`, `generateSlug`, `require-admin.ts`, `requireAdmin`, `@google/genai`, `db.ts`, `related-content.tsx`, `blog/[slug]/page.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dropdown-menu.tsx`, `admin-dashboard.tsx`, `sidebar.tsx`, `project-manager.tsx`, `input.tsx`, `react`, `blog-ideas-manager.tsx`, `course-manager.tsx`, `use-toast.ts`, `rag-settings.tsx`, `utils.ts`, `table-of-contents.tsx`, `context-menu.tsx`, `chat-widget.tsx`, `WORKLOG`, `toggle-group.tsx`, `carousel.tsx`, `snippet-manager.tsx`, `form.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `input-otp.tsx`, `avatar.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas` to the rest of the system?**
  _519 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.02857142857142857 - nodes in this community are weakly interconnected._
- **Should `dropdown-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Should `admin-dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._