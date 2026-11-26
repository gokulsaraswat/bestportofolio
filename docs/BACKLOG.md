# BACKLOG: bestportofolio (PRT)

Rules: `RULES.md` section 4. Architecture: `docs/ARCHITECTURE.md`. Public-safe: no secrets, no employer material.
Priority: P0 broken/blocking or security, P1 important, P2 worthwhile, P3 nice to have.
Status: open, doing, blocked, done, dropped. Cross-repo: `needs:` waits on, `blocks:` is waited on by.

## Bugs
| ID | Title | Pri | Status | Needs/Blocks | Notes (where, repro, evidence) |
|---|---|---|---|---|---|
| PRT-B-001 | Vercel builds fail since 9c4146a (Prisma 7 upgrade + effect override without lockfile sync); live site stuck on 5973bc2 | P0 | done | | npm ci failed: "Missing: effect@3.22.5 from lock file"; schema.prisma + src/lib/db.ts are Prisma 6 style (url in schema, no adapter). Fix: Prisma 6.19.3, drop unused @prisma/adapter-pg + pg, remove prisma.config.ts, regenerate lockfile. Deploy waits for Vercel rate limit reset. |

## Improvements
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| PRT-I-001 | UI/motion upgrade in 3 passes: site, chat widget (visual only, /api/chat stream untouched), own admin | P2 | open | master: PLT-I-001 | Prompt: docs/KICKOFF-PROMPT.md "UI UPGRADE ADD-ON". Installed 2026-11-25: gsap, @gsap/react, lenis, @formkit/auto-animate (unused so far); keeps framer-motion ^12. Verify: typecheck, lint, build. |

## Features
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| PRT-F-001 | Show GSpace feed (`public/gspace-feed.json`: public projects + learning) as a "Now / learning in public" section | P2 | open | needs: GSP-X-010 (done) | Feed written by GSpace Projects → Portfolio sync. Shape: { generatedAt, source, projects[{name,summary,status,stack[],repo,updatedAt}], learning[{title,status,url,tags[]}] } |

## Ideas (unscoped, not committed to)
| ID | Idea | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| PRT-X-001 | Evaluate copy-in animation kits (Magic UI, React Bits, Aceternity UI) via the shadcn registry (components.json exists) | P3 | open | after PRT-I-001 pass A | Source-copy kits, not npm deps; each component needs review for a11y, reduced motion and bundle size. |

## Tech debt
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Done (recent)
| ID | Title | Commit | Date |
|---|---|---|---|
| PRT-B-011 | Privacy page said no personal data is collected automatically; it did not mention the chat assistant (Gemini), the admin session cookie or host logs | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-010 | Cookie banner mounted although the site sets no tracking cookies (contradicted the privacy page) | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-C-003 | Removed 21 dependencies that only the deleted files used (grep proof; build green on a simulated clean install) | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-C-002 | Deleted 30 unreferenced source files (grep proof); `src/proxy.ts` kept (Next loads it) | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-C-001 | Removed 18 unused dependencies (grep proof; tsc, eslint, build green without them); dotenv, react-dom, sharp, @types/* kept | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-009 | F2 decision: `GlobalKeyboardShortcuts` stays unmounted (no behaviour change) | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-008 | rag-settings status check POSTed a real chat request (Gemini call) on every open and reported OK on any HTTP result | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-007 | robots.txt had no sitemap and let crawlers into /admin | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-006 | `/api/chat` logged every visitor prompt (and the final RAG prompt) to the server console | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-005 | Public `GET /api/blogs` and `/api/snippets` wrote to the DB (auto-publish of scheduled items) on every anonymous request | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-004 | Public `GET /api/profile` and the Person JSON-LD exposed the phone number | (Phase B, see WORKLOG) | 2026-11-26 |
| PRT-B-003 | Roles were client-side only: any signed-in role (incl. viewer) could write every content/inbox/todo API | (Phase B, see WORKLOG) | 2026-11-25 |
| PRT-B-002 | Admin nav hid the Comments section (`rolePermissions.admin` lacked `comments`, FEATURES F1) | (Phase B, see WORKLOG) | 2026-11-25 |
