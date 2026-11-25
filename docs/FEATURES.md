# FEATURES: bestportofolio (current Next.js site) = parity checklist

Purpose: everything the live Next.js 16 site does today, so the Astro rebuild (PORTFOLIO-ADMIN-ASTRO-PLAN step 3) and the
admin-repo move (step 2) can be checked item by item. One line per item: what it is, then **Verify:** how to check it.
Inventory taken 2026-11-25 from `main` at `b496241` (code read, not a design spec). "Plan:" marks items the plan deliberately
changes or drops (they still need a conscious decision at the parity pass, not a silent loss).

Base URL used below: `$S` = https://bestportofolio.vercel.app (production; note the live deploy is older than `main`,
see Baseline). Admin = signed in at `/admin` with an `admin` role account.

## 1. Public pages (`src/app`)
All public pages are client components (`'use client'`) that fetch `/api/*` in the browser, except `/privacy`,
`/[legal]` and the root layout. Every page renders `Navbar` + `Footer` (`components/site/navbar.tsx`).

| # | Route | What it shows | Verify |
|---|---|---|---|
| P1 | `/` | Hero (rotating carousel images every 3 s, typing animation of `heroTypingLines`, CTAs), stats band (animated counters), About section (from `/api/profile`), "Skills & Technologies" (SkillsMatrix + TechMarquee), "Featured Work" (`/api/projects?featured=true`), "Latest Posts" (`/api/blogs?published=true`), "Courses" (`/api/courses`, hidden when empty), "Let's Work Together" CTA | Open `$S/`; each section renders with data; skeleton cards while loading |
| P2 | `/about` | About page (client component; profile-driven content) | Open `$S/about` |
| P3 | `/projects` | Project cards grid with search box (`Search projects...`) | Type in search, list filters |
| P4 | `/projects/[slug]` | Project detail: breadcrumbs, reading progress, TOC, image gallery + lightbox, markdown body with themed code blocks + embeds, view counter, related content, share buttons, comments (`entityType=project`) | `$S/projects/banking-microservices` |
| P5 | `/blog` | Published post cards with search (`Search posts...`) | `$S/blog` |
| P6 | `/blog/[slug]` | Post: breadcrumbs, reading progress, TOC, reading time, markdown + code blocks, resources section, view counter, related content, share, comments (`entityType=blog`) | Open any post from `/blog` |
| P7 | `/courses` | Course cards (`/api/courses`) | `$S/courses` |
| P8 | `/courses/[slug]` | Course with chapter navigation, chapter markdown + code blocks, linked published blogs/snippets, breadcrumbs, comments | Open a course, switch chapters |
| P9 | `/snippets` | Snippet library (`/api/snippets?...`): search (`/` focuses it), `?view=<slug>` opens one snippet, copy code, copy link | `$S/snippets`, press `/`, open `?view=` link |
| P10 | `/contact` | Form name/email/subject/message → `POST /api/contact`; shows server error text | Submit empty (error) and valid (success toast) |
| P11 | `/privacy` | Static privacy page (server component, static `metadata`) | `$S/privacy` |
| P12 | `/[legal]` | `generateStaticParams`: terms, cookies, data-deletion, accessibility, sitemap, faq; shared `@gokulsaraswat/ui` LegalPage placeholders | `$S/terms` ... `$S/faq` all 200 |
| P13 | 404 (`not-found.tsx`) | Custom client 404 page with links home | `$S/does-not-exist` → 404 page |
| P14 | `/admin-access-denied` | Access denied page for admin routes | Open it directly |
| P15 | `/admin` | Admin SPA (section 4); login form when signed out | Open `$S/admin` signed out → login |

## 2. API routes (`src/app/api`, all dynamic)
Auth legend: **public**; **session** = valid `admin_session` cookie (`requireAdmin`, blocks `mustChangePassword`);
**admin** = `requireRole(request,'admin')`; **pub/adm** = public sees published only, admin sees all.
The proxy (`src/proxy.ts`) also returns 401 for any POST/PUT/PATCH/DELETE on `/api/*` without a session, except
`/api/contact`, `/api/comments`, `/api/auth`, `/api/chat`, and rate-limits POST auth 10/15 min, chat 20/10 min,
contact 5/h, comments 10/h per IP (in-memory). Errors are `{ error: string }` with 4xx/5xx.

| # | Route | Methods + auth | Response shape | Verify |
|---|---|---|---|---|
| A1 | `/api/auth` | GET public; POST public (login, rate-limited); DELETE session | GET `{authenticated:false}` or session details incl. `mustChangePassword`; POST sets cookie, `{success:true,...}` / 401 `{success:false,error}`; DELETE `{success:true}` | `curl $S/api/auth` → `{"authenticated":false}` |
| A2 | `/api/auth/password` | POST session (own password) | `{success:true}` + refreshed cookie; 400/401 | Change password in admin |
| A3 | `/api/admin-users` | GET/POST/PUT/DELETE admin | user list / created user `{id,username,role,permissions}` 201 / `{success:true}`; weak password 400, last-admin delete 400 | `curl` unauthenticated → 401 |
| A4 | `/api/backup` | GET admin (`?entities=`, JSON download); POST admin (restore from uploaded file) | backup JSON / `{success,...counts}` | Backup tab download |
| A5 | `/api/blog-ideas`, `/[id]` | GET/POST, GET/PUT/DELETE session | idea list / idea / `{success:true}` | Admin Blog Ideas tab |
| A6 | `/api/blogs` | GET pub/adm (`published`, `slug`, `limit`, filters; runs scheduled auto-publish `updateMany`); POST session | `BlogPost[]` or one post; 201 post | `curl "$S/api/blogs?published=true"` |
| A7 | `/api/blogs/[id]` | GET pub/adm (draft → 404 without session); PUT/DELETE session | post / `{success:true}` | |
| A8 | `/api/chat` | POST public (rate-limited) body `{messages:[...]}` | `text/plain` stream (Gemini `gemini-2.5-flash`, RAG via `gemini-embedding-001` + Supabase vector search) | Chat widget answers |
| A9 | `/api/chat-status` | GET public | `{enabled:boolean}` (`Profile.chatBotEnabled`) | `curl $S/api/chat-status` |
| A10 | `/api/comments` | GET public `?entityType=&entityId=`; GET `?all=true` session; POST public (rate-limited, length/email/spam checks, 422 on spam, 404 unknown entity) | `Comment[]`; 201 comment (visible immediately, no moderation) | Post a comment on a blog post |
| A11 | `/api/comments/[id]` | PATCH/DELETE session | comment / `{success:true}` | Admin moderation |
| A12 | `/api/contact` | POST public (rate-limited; name 80, email 160, subject 200, message 4000) | 201 ContactMessage; 400 with message | Contact form |
| A13 | `/api/courses` | GET public (list or `?slug=`); POST session | `Course[]` / course | `curl $S/api/courses` |
| A14 | `/api/courses/[courseId]` | GET public; PUT/DELETE session (pickFields, no nested chapter writes) | course / `{success:true}` | |
| A15 | `/api/courses/[courseId]/chapters`, `/[chapterId]` | GET public; POST, PUT/DELETE session | chapter(s) | Course page chapters |
| A16 | `/api/ingest` | POST/DELETE admin (RAG documents; 503 if RAG env missing) | `{success,id}` 201 / `{success:true}` | AI Chat Bot tab |
| A17 | `/api/messages`, `/[id]` | GET/PUT/DELETE (bulk) and GET/PATCH/DELETE session | `ContactMessage[]` / message / `{success,deletedCount}` | Messages tab, notification bell |
| A18 | `/api/operation-logs` | GET admin (`?limit=`) | `OperationLog[]` | Logs tab |
| A19 | `/api/profile` | GET public (full Profile row incl. phone today; Plan: remove phone); PUT admin | Profile / 404 | `curl $S/api/profile` |
| A20 | `/api/projects`, `/[id]` | GET public (`featured`, list/one; no published flag); POST, PUT/DELETE session | `Project[]` / project | `curl $S/api/projects` |
| A21 | `/api/settings` | GET public (siteSettings JSON merged with mapped Profile fields); PUT admin | settings object | `curl $S/api/settings` |
| A22 | `/api/snippets`, `/[id]` | GET pub/adm (`published`, `limit`, `slug`); POST, PUT/DELETE session | `CodeSnippet[]` / snippet | `/snippets` page |
| A23 | `/api/todos`, `/[id]`, `/[id]/history` | GET/POST, PUT/DELETE, GET session | todos / todo / history entries | Todos tab |

## 3. SEO and platform files
| # | Item | Current state | Verify |
|---|---|---|---|
| S1 | Root metadata (`app/layout.tsx`) | Title default "Gokul Saraswat \| Backend Engineer", template `%s \| Gokul Saraswat`, description, keywords, OpenGraph (url `https://gokulsaraswat.com`), Twitter `summary_large_image`, robots index/follow, manifest link, theme-color light/dark | View source of `$S/` |
| S2 | Per-section metadata | `about/blog/contact/courses/projects/snippets/layout.tsx` static titles; `/privacy` static; `/[legal]` `generateMetadata`; detail pages (client) have no per-item metadata/OG image (Plan: per-page title/description/OG) | View source of a blog post |
| S3 | Sitemap `/sitemap.xml` | `force-dynamic`; static pages + published blogs, all projects, all courses, published snippets (`/snippets?view=`); base `https://gokulsaraswat.com` (domain not live) | `curl $S/sitemap.xml` |
| S4 | robots | `public/robots.txt`: Allow all for Googlebot, Bingbot, Twitterbot, facebookexternalhit, `*`; **no Sitemap line** (Plan: add) | `curl $S/robots.txt` |
| S5 | JSON-LD | `lib/jsonld.ts` Person (+ worksFor Organization, PostalAddress, `telephone` from profile phone; Plan: drop phone) injected in root layout via `components/site/jsonld.tsx` | View source, search `application/ld+json` |
| S6 | Manifest `/manifest.webmanifest` | name, short_name, description, start_url `/`, standalone, colors `#0a0a0a`, portrait, icon `/logo.svg` | `curl $S/manifest.webmanifest` |
| S7 | Admin headers | proxy sets `X-Frame-Options: SAMEORIGIN` + `Cache-Control: no-store` on `/admin*` | `curl -I $S/admin` |
| S8 | RSS | none today (Plan: add) | n/a |

## 4. Admin (`/admin` → `components/admin/admin-layout.tsx`, 14 sections)
Login: username + password form (`POST /api/auth`), signed HttpOnly cookie `admin_session` (`lib/session.ts`); accounts with
`mustChangePassword` are forced to the change-password screen (`POST /api/auth/password`) and blocked by proxy/`requireAdmin`.
Sign out = `DELETE /api/auth`. Client nav per role (`rolePermissions`): admin = all 14 sections (comments added in Phase B, F1),
blog_editor = dashboard, blogs, blog-ideas, todos; project_editor = dashboard, projects, todos; course_editor = dashboard,
courses, todos; viewer = dashboard. Server enforcement: content routes need any session; admin-only routes listed in section 2.
Admin header: theme toggle, sign out. (Plan: all of this moves to the `admin` repo with Google sign-in.)

| # | Section (id) | Component | Operations | Verify |
|---|---|---|---|---|
| D1 | Dashboard (`dashboard`) | admin-dashboard.tsx | Counts of blogs/projects/courses/snippets, latest 5 messages, last 20 operation logs, activity chart, content-by-tag + distribution charts, quick links to sections | Open admin, numbers match lists |
| D2 | Blogs (`blogs`) | blog-manager.tsx | List with search/filter/sort, create/edit (markdown body, SEO preview, JSON-array list fields, published, scheduled publish `scheduledAt`), toggle publish (PUT), delete with confirm | Create draft, publish, delete |
| D3 | Blog Ideas (`blog-ideas`) | blog-ideas-manager.tsx | List/filter ideas, create/edit/delete, convert idea → blog draft (`POST /api/blogs` then PUT idea) | Convert an idea |
| D4 | Projects (`projects`) | project-manager.tsx | List, create/edit (SEO preview, architecture-diagram gallery + legacy single diagram, contributors input, featured flag), delete | Edit and save a project |
| D5 | Courses (`courses`) | course-manager.tsx | Course CRUD, chapters (create/edit/delete), a chapter can link a published blog (`linkedBlogSlug`) or snippet (`linkedSnippetSlug`) instead of own content | Add a chapter |
| D6 | Snippets (`snippets`) | snippet-manager.tsx | List (limit 200), create/edit (code tabs, category, embeds, `includeInRag`, published, scheduled publish), copy, delete | Create snippet |
| D7 | Logs (`logs`) | operation-logs-viewer.tsx | View/filter/refresh operation logs (`GET /api/operation-logs`) | Logs show recent edits |
| D8 | Messages (`messages`) | message-manager.tsx | Inbox list, mark read/unread (PATCH), delete one, bulk delete | Send contact message, see it |
| D9 | Comments (`comments`) | comment-manager.tsx | List all (`?all=true`), edit content (PATCH), delete | Admin nav → Comments (F1 fixed in Phase B) |
| D10 | Todos (`todos`) | todo-manager.tsx | List/filter, create, edit, complete, delete, per-todo history | Complete a todo, view history |
| D11 | AI Chat Bot (`rag-bot`) | rag-settings.tsx | Enable/disable bot (`PUT /api/profile`), test chat (`POST /api/chat`, also on mount: spends quota; Plan: fix), ingest text (`POST /api/ingest`), delete by source (`DELETE /api/ingest`), re-ingest | Toggle bot, ingest a note |
| D12 | Backup (`backup`) | backup-manager.tsx | Entity counts, download JSON backup per entity selection (`GET /api/backup?entities=`), restore from file (`POST /api/backup`), export-data helper | Download backup |
| D13 | Users (`users`) | user-manager.tsx | List admin users, create (strength check, forced password change), edit role/permissions/reset password, delete (not last admin) | Create a viewer user |
| D14 | Settings (`settings`) | profile-settings.tsx | Profile fields (name, email, location, avatar, resume, socials, typing lines) + site settings (`title, description, heroGreeting, heroCtaText/Url, colors, font, layoutStyle, enableAnimations, enableParticles, roundedCorners, siteUrl, ogImage, favicon, enableComments/Rag/Contact/Blog/Projects/Courses/Snippets, contactEmail, showVisitorCount, showGithubStats, enableCustomCursor, cursorMagneticSnap, enableAutoEmbeds, footerText, copyrightName, musicUrl, enableMusic`) via `PUT /api/settings` | Change footer text, reload site |

## 5. Global widgets and behaviour
| # | Feature | Current behaviour | Verify |
|---|---|---|---|
| G1 | Chat widget | `ChatBotWrapper` checks `/api/chat-status`; if enabled shows floating chat; streams `POST /api/chat` reply (reader on `text/plain`), Enter sends, Shift+Enter newline | Enable in admin, ask a question |
| G2 | Music player | Reads `musicUrl`/`enableMusic` from `/api/settings`; one looping track (`new Audio(url)`, volume 0.3) starts on first click/key/touch; mute toggle button; files `public/background-music*.mp3`; not persisted across reloads (Plan: playlist player) | Set musicUrl, click page, toggle |
| G3 | Comments | `CommentSection` on project, blog, course pages: list + form (name, optional email, content); posted comments appear immediately (no moderation; spam heuristic only) (Plan: moderation + replies + likes + share) | Post a comment |
| G4 | Contact | See P10/A12; message lands in admin Messages + notification bell | |
| G5 | Global search | In navbar; Ctrl/Cmd+K toggles dialog; client fetches blogs, projects, courses, snippets and filters title/description (top 10), arrow keys + Enter, highlights match | Ctrl+K, type "go" |
| G6 | Notification bell | Navbar; admin session only: unread contact messages, mark read / mark all read; hidden for visitors | Sign in, open bell |
| G7 | Cookie consent | Bottom banner after 1.5 s until accepted/declined; stores `cookie-consent-v1` in localStorage; informational only (Plan: remove) | Clear storage, reload |
| G8 | Custom cursor | `SettingsAwareCursor` renders `CustomCursor` only if `enableCustomCursor` (default false), optional magnetic snap (Plan: drop) | Enable in settings |
| G9 | Keyboard shortcuts | Overlay `?` lists shortcuts; `t` toggles theme; Ctrl+K search; `/` focuses snippet search; Esc closes. `GlobalKeyboardShortcuts` (m mute, w/a/s/d nav) is imported in layout but not mounted | Press `?`, `t` |
| G10 | Theme | `next-themes`, class attribute, default dark, system enabled | Toggle theme, reload |
| G11 | Footer | Shared `@gokulsaraswat/ui` Footer wrapped in `components/site/footer.tsx` (links incl. legal pages) | Footer links resolve |
| G12 | Misc UI | Global loader, skip-to-content link, back-to-top button, page transitions, toasts, local-only view counter (localStorage `views:<id>`, once per day), share buttons (X, LinkedIn, copy link, Web Share API) | Visual check |
| G13 | Legal pages | `/privacy` + 6 `[legal]` placeholder pages (P11, P12) | |
| G14 | 404 | P13 | |

## 6. Planned (not existing yet)
| # | Item | Notes |
|---|---|---|
| PRT-F-001 | GSpace feed section ("Now / learning in public") from `public/gspace-feed.json` | Backlog P2, open. Not built; file does not exist in this repo yet. Verify after build: section renders projects + learning from the feed. |

## 7. Findings recorded during inventory (not fixed in Phase A)
- F1 (FIXED Phase B, PRT-B-002): `rolePermissions.admin` in `admin-layout.tsx` omitted `comments`, so the Comments section (D9) was not in the admin nav.
- F2: `GlobalKeyboardShortcuts` is imported in `app/layout.tsx` but never rendered.
- F3: `/api/profile` GET and JSON-LD expose `phone`; public GET `/api/blogs` writes (auto-publish); `rag-settings` calls `/api/chat` on mount (all already in plan step 0 "Security fixes").
- F4: `robots.txt` has no Sitemap line; sitemap/OG use `https://gokulsaraswat.com` which does not resolve.

## 8. Baseline numbers (2026-11-25, Phase A, before any step-0 change)
Toolchain: Node 24.14.1, npm 11.11.0, Next 16.4.6 (Turbopack), React 19.2.8, Prisma 6.19.3, TypeScript 5.9.3, ESLint 9.39.5.

| Metric | Value | How |
|---|---|---|
| `npm ci` (clean clone) | 62 s, 846 packages, 3 high audit findings | `npm ci` |
| `node_modules` size | 1.0 GB (du; 913 MB apparent) | `du -sh node_modules` |
| `npm run build` cold (clean clone, no .env) | 51 s wall (compile 8.6 s, TS 9.6 s), 38 static pages | `time npm run build` |
| `npm run build` warm (repo, cached) | 12 s | same |
| `npm run lint` | pass, 0 problems, 28 s | |
| `npm run typecheck` | pass, 24 s | |

First Load JS per route (gzip; Next 16 no longer prints it, so computed from `.next` manifests: rootMainFiles + layout and
page `entryJSFiles`; shared root chunks = 129 kB; identical in repo and clean clone):

| Route | First Load JS (gzip kB) | raw kB |
|---|---|---|
| / | 264 | 849 |
| /about | 247 | 795 |
| /projects | 253 | 814 |
| /projects/[slug] | 336 | 1095 |
| /blog | 253 | 816 |
| /blog/[slug] | 332 | 1079 |
| /courses | 252 | 812 |
| /courses/[slug] | 318 | 1034 |
| /snippets | 296 | 969 |
| /contact | 247 | 790 |
| /privacy | 244 | 783 |
| /[legal] | 244 | 783 |
| /_not-found | 227 | 733 |
| /admin-access-denied | 232 | 744 |
| /admin | 461 | 1649 |

Lighthouse 13.6.0 (headless Chrome, single run each) against the LIVE site (`$S`, which still serves the last good deploy
from before 9c4146a, not `main`):

| Page | Form | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 87 | 100 | 96 | 100 | 3.2 s | 170 ms | 0.004 | 2.1 s |
| / | desktop | 99 | 100 | 96 | 100 | 0.8 s | 0 ms | 0.001 | 0.5 s |
| /blog | mobile | 91 | 98 | 96 | 100 | 2.8 s | 110 ms | 0 | 1.7 s |
| /blog | desktop | 95 | 98 | 96 | 100 | 1.5 s | 0 ms | 0.001 | 0.3 s |
| /projects/banking-microservices | mobile | 67 | 100 | 96 | 100 | 8.5 s | 150 ms | 0 | 0.8 s |
| /projects/banking-microservices | desktop | 96 | 100 | 96 | 100 | 0.8 s | 0 ms | 0.05 | 0.2 s |
