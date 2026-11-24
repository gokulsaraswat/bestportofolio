# Ideas: One Platform, Many Apps

> Draft v1 · 2026-10-27 · Vision from Gokul, recommendations marked **→ Suggest**.

## 1. Vision
Separate repos and apps (portfolio, Markdown Studio, GSpace/Progress, Checkers Gym, Mobilize). One shared **backend, CMS, login and UI kit** behind all of them. Later, one **hub site** links them all with smooth mobile-first transitions.

## 2. Current state (checked in repos)
| Repo | Stack today | Note |
|---|---|---|
| bestportofolio | Next.js 16, React 19, Supabase | Already has auth/DB, so no need for Astro |
| Progress (GSpace) | Astro 5 | Fits static/content use |
| Markdown-studio | Static HTML/JS (GitHub Pages) | Client-only, no backend yet |
| checkers-gym-management | React 18 + Supabase | Has `supabase/` folder |
| gokulmobilize | Android (README only) | Early |
| gokul-omni-converter | Python desktop | Not part of the web platform |

## 3. Framework
- **Astro** for read-only content (blogs, courses). **Next.js App Router** when you need logins and payments.
- **→ Suggest:** Don't rewrite anything. bestportofolio stays on Next.js because it is already on Supabase and will need logins/payments. Use Astro only for new content-only sites.

## 4. Content & CMS
- **MDX files in Git** (now): free, versioned, fast. Fine for 1 author.
- **Supabase as the shared CMS** (soon): MDX body in Postgres, images in Storage, one admin UI.
- **Payload / Sanity** (only if non-technical editors join): skip for now.
- **→ Suggest:** Use **one Supabase project**, one `content` table with an `app` column (`portfolio`, `gym`, ...). Keep MDX in the DB so the admin edits it live, with Git as a backup export.

## 5. Roles (super admin → app admins)
- **super_admin**: everything, all apps.
- **admin:portfolio**: blogs, courses, projects.
- **admin:gym**: members, plans, content.
- **editor / member**: per-app, lower access.
- **→ Suggest:** One `user_roles(user_id, app, role)` table, enforced by Supabase **Row Level Security** (not just hidden buttons). One login for every app. Build **one separate `admin` app** (own repo) that shows only the sections the signed-in role can see.

## 6. Shared packages (so "every component works everywhere")
- `@gokul/ui`: design system, buttons, cards, loaders.
- `@gokul/mdx`: MDX components, including `WebWindow`.
- `@gokul/auth`: Supabase client + role helpers.
- **→ Suggest:** Keep repos separate, but publish these as private packages (GitHub Packages) or use a small `platform` repo. Don't merge into a monorepo unless versioning becomes painful.

## 7. `WebWindow` MDX component
Browser-style frame that embeds a URL inside a page.
- **Problem:** many sites send `X-Frame-Options: DENY` / CSP `frame-ancestors`, so an iframe stays blank.
- **Your own sites:** easy. Allow them with `Content-Security-Policy: frame-ancestors 'self' https://*.yourdomain.com`.
- **Third-party sites:** an iframe can't work. Fall back to a preview card (screenshot + "Open ↗").
- **Don't:** proxy other sites to strip headers. It is fragile, breaks logins and can be a security or ToS problem.
- **→ Suggest:** The component tries an iframe, detects a failed load (timeout), then shows the fallback. Props: `url`, `title`, `height`, `device="mobile|desktop"`.

## 8. Hub site & URL layout (decided: one `.com`, path per app)
`yourdomain.com` = hub · `/blog` · `/gspace` · `/studio` · `/gym` ...
- **Why it's good:** one origin means one login cookie, no CORS, and iframes between your apps work without extra headers.
- **Catch:** each app is its own repo and deploy, so something must route paths to deployments. **→ Suggest:** the hub is the gateway. Use rewrites (Vercel/Next `rewrites`, or a Cloudflare Worker) so `/gspace/*` proxies to the GSpace deploy.
- **Each app must know its base path:** Astro `base: '/gspace'`, Next `basePath: '/gym'`, Vite `base`. Do this early, since changing later breaks links and assets.
- **Hub UX:** grid of app tiles. Tap one, loading animation plays, then it opens. Make it a **PWA** with a bottom nav on mobile. Use View Transitions / Framer Motion.
- **Single-page feel:** same-origin pages can be soft-navigated or shown in an iframe with the hub's loader on top.

## 8b. Login & RBAC
- One Supabase Auth, one login for every app (cookie on the `.com`). The Android app uses the same Supabase project.
- Build RBAC in two steps. First, 3 roles (`super_admin`, `admin`, `member`) per app. Add finer permissions only when needed.

## 8c. Payments (later, undecided)
- **Don't build your own gateway.** Money handling brings PCI compliance, fraud and legal risk. "Open source Razorpay" tools are really *orchestrators* over real processors (e.g. Hyperswitch) or *billing* engines (e.g. Lago).
- **→ Suggest:** Start with Razorpay (India) hosted checkout, with webhooks into Supabase. Keep a `payments` table and one `PaymentProvider` interface, so you can swap in Stripe or Hyperswitch later without touching the apps.
- Don't start payments until logins and roles work.

## 9. Suggested order
1. Pick domain; set base paths (`/gspace` etc.) in each app and the hub gateway rewrites.
2. Supabase: shared project, `user_roles`, RLS.
3. Extract `@gokul/ui` and `@gokul/mdx` (with `WebWindow`) from bestportofolio.
4. Admin app (super admin first, then per-app admins).
5. Move portfolio blog/courses from MDX files to Supabase.
6. Add Supabase login to Markdown Studio and GSpace.
7. Hub site + animations + PWA.

## 10. Open questions
- Domain name (later). Until then, develop with path routing on `localhost` or a free Vercel domain.
- Will gym staff or clients log in early, or only you?


## 11. Excellidraw opensource
-  another webiste use it for drawing designs for admin page as crm 


To-dos
Now (2-3 days)
Work
[ ] Strategy pattern for post-booking service
[ ] FK refund flow: complete as much as possible
[ ] Meeting: OMS values that were returned
[ ] Create foglamp for pending repositories
[ ] Collect all docs (Google Sheets, Docs, PDFs) and upload the missing ones to the existing documents section
Portfolio (main target: everything works perfectly)
[ ] Verify everything works end to end
[ ] Add completed projects to the projects section
[ ] Add Real-time scheduler to projects
[ ] Start the courses section
[ ] Update the resume
[ ] Update the resume and about sections on the site
[ ] Design and loading updates, other tweaks (sub to-dos later)
GSpace
[ ] Commit and push pending changes
[ ] Deliverables tracker page for vibe coding (pending vs done per project)
[ ] Vision board: rework so future ideas get captured
[ ] Add MDX support (currently MD only)
[ ] Reusable embed component for sites that block embedding
[ ] Websites directory section (coding, dev, and other useful sites in one place), built as a component
Other
[ ] Gmobilize: create repo, do some work
[ ] Multi-platform app (not Android-only) to view the website
Later (design to be discussed)
Platform
[ ] RBAC as a shared microservice for all apps
[ ] Single login via Gmobilize: log in once, logged in everywhere
[ ] One drop-in chatbot for all apps and projects, with all their data
[ ] GSpace: Claude setup section (skills, connectors)
[ ] Books section: leaning toward a "Book" category in the portfolio blog, with a short or voice version (e.g., NotebookLM)
[ ] Portfolio: code snippets as components, using open-source tools (Excalidraw, JSON websites and many more :-) etc.)
[ ] Portfolio: MD to MDX and move to Astro, if possible
[ ] More MDX components (e.g., a calculator)
Four key projects (showcase section) all tech & skills you have learn + behavioural ones
[ ] Payment system: personal, integrated everywhere, high-QPS design (Oracle showcase; Razorpay clone as reference)
[ ] Cleartrip clone (Flipkart showcase)
[ ] Core tech project: Spring Boot, Hibernate, Kafka, etc.
[ ] AI project
Profiles and content
[ ] Update the README of "Gokul Saraswat's" projects 
[ ] Update LinkedIn and X; post on LinkedIn
[ ] YouTube: set up, then 2-3 videos on what you learn
[ ] Topmate: update profile, add downloadable resources section
[ ] Naukri: update
[ ] LeetCode: solve questions, including NeetCode 150
[ ] Shreyansh Coding School: buy subscription, learn, make blogs and courses
At the end (must do)
[ ] Design update for all apps and sites, after buying an AI agent subscription, using the best skills and plugins available
Far later (when time allows)
[ ] Checkers Gym Management, Google Omni Converter, Markdown Studio, and similar
[ ] Ground Desk OS: not started; find the open-source version and use it
Dropped
Goku chat
Udemy Clone ETC old projects
Get a Claude Code subscription (SSO login) and use it in IntelliJ across the Spring Boot repos to build the 4 key projects
