# design/: portfolio design system + mockups (branch `astro`)

Purpose: the design system and static HTML mockups for the planned **Astro rebuild** of the public portfolio
(Step 3 of the portfolio + admin + Astro program). Nothing here is wired into the live Next.js app on `main`;
this folder lives on branch `astro`, which reaches `main` only through the Step 3 "merge" gate (Gokul).

- Decisions: workspace plan `PORTFOLIO-ADMIN-ASTRO-PLAN.md`, section 0, items 9-18 (lives at the workspace root, outside every repo).
- Foundation: `@gokulsaraswat/ui` 0.2.0, v2 (`v2/tokens.css`, `v2/components.css`, `v2/tailwind.css`).
  Brief: `platform/docs/DESIGN-BRIEF.md` (source of truth). The brief gives bestportofolio its **own direction on the v2
  foundation**; every deviation from v2 is listed below, nowhere else.

## The brief (from Gokul)
| Area | What it must do |
|---|---|
| Hero | Centered. Rotating role line (fade/slide) fed from admin. "Open to work" availability chip (admin toggle). CTAs from admin. A `GET /gokul` request/response card showing live role, stack and location. Old carousel moves to the About gallery; the navbar drops "Home". |
| Stats | Admin-managed list (value, suffix, label, optional icon/description, order, enabled). Desktop row of up to 4, scroll-snap rail beyond that and on mobile. Count-up once in view. **No marquee.** Reduced motion shows the final numbers. |
| Skills | One merged section: categories -> items (name, optional Simple Icons slug, optional primary flag). Icons, no % bars. |
| Chat widget | Starter chips (admin-managed, hidden after the first message), model follow-up chips (up to 3, same response), greeting from admin. Gemini 2.5 Flash + RAG unchanged. |
| Music player | Own `<audio>` playlist: play/pause, prev/next, loop off/one/all, shuffle, title/artist, volume. Click to start, remembers state, persists across page navigations, lazy-loaded. Not Spotify/YouTube. |
| Comments | Moderated (pending -> approved). One level of replies (reply to a top comment; author replies badged "Author"). Likes (anonymous, one per device) and share (Web Share API on mobile, copy link, X, LinkedIn); likes + share also on posts/projects. |
| Footer | Two tiers: groups Work / Writing / About / Elsewhere + side block (theme switch, now playing, copyright); bottom row Privacy, Terms, Cookies, Accessibility, Sitemap, RSS. Groups editable in admin. |
| Look | Dark-first, editorial-technical. Opacity-built neutrals. Red accent kept and AA-tuned (current primary `#f73b3b`). One variable grotesk + mono labels. Prose about 660px. Row lists for blog/snippets/courses; cards only for projects with images; docs layout (TOC, prev/next) for posts and courses; legal pages = plain summary + effective date. |
| Theme | Default `system`. Light and dark both fully designed; dark is designed first. |
| Effects | No custom cursor, no particles, no splash screen (skeletons instead). |

Quality bar for every mockup: WCAG 2.2 AA, visible focus, reduced motion, touch targets >= 44px on touch,
loading / empty / error states, light + dark, mobile (390px) + desktop (1440px).

## Accent: why it needs tuning
Measured contrast of the current primary `#f73b3b`:

| Pair | Ratio | AA (4.5:1 text, 3:1 UI) |
|---|---|---|
| `#f73b3b` text on white | 3.72 | fails for body text, passes UI/large text |
| white text on `#f73b3b` | 3.72 | fails for button labels |
| `#f73b3b` text on `#0a0a0a` | 5.32 | passes |

So the red stays recognisably the same hue, but light mode needs a deeper step for text and filled buttons
(candidates measured: `#d42a2a` 5.04 on white, `#c81e1e` 5.74 on white), and dark mode can keep a value close to
the current one. Final values are fixed in the token mockup and checked pair by pair.

## Deviations from v2 (kept current; empty rows are not allowed)
| # | v2 says | Portfolio does | Why |
|---|---|---|---|
| 1 | Flavor = one of instrument / atelier / margin | Own flavor block `data-gk-flavor="portfolio"` using the same `--gk-*` token names | Brief: own direction on the v2 foundation. Proposed (least risky: v2 files stay untouched, a local block overrides values only) |
| 2 | Accent per flavor (teal / indigo / wine) | Red accent, AA-tuned per theme | Gokul: keep the red identity |
| 3 | Theme default light | Default `system`, dark designed first | Decision 14 |

Missing components (stats rail, count-up, chips, player controls, comment thread) are drafted here from tokens only and
proposed to platform as v2 `gk-` classes (`needs: PLT-F-<n>`), per DESIGN-BRIEF section 6.

## Layout of this folder
| Path | What |
|---|---|
| `vendor/tokens.css`, `vendor/components.css` | Verbatim copies of `platform/packages/ui/src/v2/` at `@gokulsaraswat/ui` 0.2.0, so the static mockups open with no install. Do not edit; re-copy on a v2 release. The Astro app imports the package instead. |
| `fixtures/*.json` | Public content of the live site for realistic mockups (see below). |
| `mockups/` (next) | Static HTML pages: tokens sheet, home, about, projects + detail, blog + post, courses + chapter, snippets, contact, legal, 404, chat widget, player, comments. |

## Fixtures
Fetched from the public API of https://bestportofolio.vercel.app on the date in `fixtures/_manifest.json`:
`/api/projects`, `/api/blogs?published=true`, `/api/courses`, `/api/snippets?published=true`, `/api/settings`.

- Dropped: phone (not present in these responses), internal editorial fields `acceptedBy` / `writtenBy` (blogs), `includeInRag` (snippets).
- Sanitized: project `banking-microservices` had employer-identifying detail (employer site, job title, long-form work
  description); those fields were blanked or replaced with the project's own short description. Listed in `_manifest.json`.
- Shapes are the OLD Prisma API (several fields are JSON inside strings, e.g. `stack`, `heroTypingLines`). The rebuild reads
  the NEW schema (plan section 3); use the fixtures for copy and volume, not as a data contract.
- Test rows (`asdfasf`, `test-ing-snipped`) are kept on purpose to design edge cases (empty fields, odd titles).
