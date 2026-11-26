# Proposal p2: Blueprint

Developer-docs feel (developer.x.com, Stripe docs) made personal. The site reads like the reference docs for one
engineer: a visible drafting frame with registration marks, hairline rules between sections, request/response and
file-tab motifs where the content really is code, and a three-pane docs reader for posts and courses. The one bold
thing is the hero's `GET /gokul` card on graph paper; everything after it is quiet reference rows.

## Files
| Path | What |
|---|---|
| `index.html` | Home: hero, stats row, skills, featured project, latest posts, courses, footer, chat launcher |
| `post.html` | Blog post in the docs layout: post nav, article, TOC, like/share, prev/next, comments with replies and a pending comment |
| `projects.html` | Projects list (reference table, stack filter, empty state; includes the test row `asdfasf` as the sparse-data case) |
| `chat.html` | Chat widget: opened with greeting and 4 starters; after an answer with sources and 3 follow-ups; loading and error |
| `player.html` | Music player: compact (playing and resting), expanded, loop states, load error, docked position |
| `states.html` | Stats rail with 6 items, skeleton, empty and error states |
| `blueprint.css` | Flavor block for `--gk-*` names, `--pf-*` additions, `pf` components |
| `blueprint.js` | Mockup behaviour: theme (`?theme=light|dark|system`, default system), role rotation, count-up, rail, toggles, loop cycle, tabs |
| `src/` + `build.py` | Page sources and shared partials (head, top bar, footer, icon sprite). Edit `src/`, then `python build.py` |
| `contrast.py` | Measures every colour pair below (`python contrast.py`) |

Content is the real fixtures (settings, projects, blogs, courses). Invented for the mockup only, and marked as such:
the four comments, the chat answer, playlist tracks 2 and 3 (labelled "from admin") and track durations.
Reading times are estimated. `System Design` keeps its fixture description "Deisgn Big Apps" unedited.

## Decisions and the options considered

### Hero
| Option | Trade-off |
|---|---|
| A. Left-aligned name with the request card beside it (docs landing split) | Strong dev-docs look, but the brief says centered, and the split crowds 390px |
| **B. Centered stack: availability chip, name, rotating role, one-line lede, two CTAs, `GET /gokul` card below** | Chosen. Meets the brief literally; the card is the memorable object and doubles as the "live" profile |
| C. Terminal window as the whole hero (typed command, output) | Most "developer", but typing animation is motion for its own sake and buries the name |

The card has Response/curl tabs, `200 OK` and latency, copy as curl, and the `role` value is bound to the rotating
line (it changes with it). Graph paper sits only behind the hero, masked to fade out, so the grid motif has one home.
"Hi, I'm" is set lighter because it is the admin greeting (`heroGreeting`), the name is the content.

### Music player
| Option | Trade-off |
|---|---|
| A. Footer-only player bar | Always visible on long pages only at the bottom; poor for "persists across pages" |
| **B. Docked compact pill (bottom left) that expands into a panel with playlist** | Chosen. Small at rest, every control one click away, progress shown as a 2px hairline |
| C. Full-width bottom bar (Spotify-like) | Takes 64px from every page, competes with the chat launcher on phones |

Loop cycles off -> all -> one (badge "1" for one), each state has its own `aria-label`; shuffle and loop show an "on"
dot, not only colour. The resting state says "starts on click" and nothing is fetched before play. The footer's
"Now playing" line mirrors it.

### Stats
| Option | Trade-off |
|---|---|
| A. Big-number cards with gradient accents | The generic template look the brief rejects |
| **B. Cells in the frame grid, divided by hairlines; 4 in a row, scroll-snap rail beyond 4 with prev/next and a count, rail on mobile with the next item peeking** | Chosen. The numbers sit in the same drawing grid as everything else |
| C. Inline sentence of numbers under the hero | Compact, but no room for the optional description, and counting up inside a sentence reads badly |

Count-up runs once when 60% visible, eased over 1.1s; with reduced motion the final numbers render immediately. Values
come from fixtures (30% latency, 98% uptime, 12 chapters, 5 posts). Suffix is set smaller so `%` doesn't compete.

### Skills
| Option | Trade-off |
|---|---|
| A. Icon grid of logos | Pretty, but loses the categories and invites "logo wall" |
| **B. Reference table: category on the left (name + count), items as icon chips on the right; primary items get a stronger border and a red square, with a legend** | Chosen. Reads like an API reference index; scans by category |
| C. Tabs per category | Hides most skills behind clicks; fails the "one merged section" spirit |

Icons are Simple Icons by slug (masked, so they take `currentColor` and work in both themes). Items without a slug
(SQL, Microservices, System design) get a mono initial glyph, so no icon is required. No percentages anywhere.

### Type
| Option | Trade-off |
|---|---|
| A. IBM Plex Sans + Plex Mono (v2 Instrument) | Zero deviation, but it makes the portfolio look like the admin tool |
| **B. Schibsted Grotesk (variable 400-900) + JetBrains Mono** | Chosen. A grotesk with editorial warmth and tight display cuts; JetBrains Mono is already the v2 mono for Atelier/Margin |
| C. Geist + Geist Mono | Very docs-like, but it is Vercel's own voice and widely used |

Scale: 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48, hero `clamp(40px, ..., 72px)`; display weight 700 at -0.022em to
-0.03em; body 1.6 line height; prose 17px at 660px measure. Mono is used only where content is code-like: request
card, code, routes, dates, method badges, durations.

### Colour
| Option | Trade-off |
|---|---|
| A. Neutral near-black dark mode with red | The most common generated look |
| **B. Blueprint ink: deep blue-ink dark (`#0D1422`) and cool drafting-paper light (`#F5F7FA`), neutrals built as opacities of one ink, red kept as the markup pen** | Chosen. Red on blueprint ink is the "red pen on drawing" idea; neutrals stay in one hue family |
| C. Warm paper light + red | Moves toward the cream/terracotta cliché |

Red is AA-tuned per theme: light `#C41F1C` for text, links and fills (5.50 on bg, 5.90 white-on-red); dark `#FF6B5E`
for text and focus (6.59) and a deeper `#D62B26` for filled buttons so labels stay white (4.96). Method badges reuse
v2 Instrument info/success/warning, so categories need no new colours: architecture = blue, devops = green,
open source = amber, errors and 404/504 = red.

### Motion
| Option | Trade-off |
|---|---|
| A. Fade-up every section on scroll | Generic and against the brief ("no scroll-triggered fade-ups") |
| **B. One orchestrated moment (role line slides/fades every 2.8s) + one count-up when stats enter view; everything else answers the user** | Chosen |
| C. No motion at all | Loses the required rotating role and count-up |

Durations are v2 tokens (role: `--gk-dur-morph` 400ms with `--gk-ease-enter`, exit with `--gk-ease-exit`), only
`transform`/`opacity` animate. The availability dot pings 3 times then stops. Reduced motion: no rotation (first role
stays), final numbers, no ping, no skeleton pulse.

### Footer
| Option | Trade-off |
|---|---|
| A. Single row of links | Fails the two-tier brief |
| **B. Four groups (Work / Writing / About / Elsewhere) + a side block divided by a hairline holding the System/Light/Dark radio group, now playing with a pause button, and copyright; bottom row with Privacy, Terms, Cookies, Accessibility, Sitemap, RSS and the location in mono** | Chosen. The frame lines and registration marks carry through, so it reads as the drawing's title block |
| C. Big sign-off headline footer ("Let's build something") | Marketing tone; duplicates the hero CTA |

On mobile the groups become 2 columns and the side block moves under them.

## Layout notes
- Navbar has no Home link (brand goes home); current page gets a 2px red underline. Search shows `Ctrl K`.
- Post page: left post nav grouped by category (method-badge headers with counts, filter field), centre article at
  660px, right "On this page" with scroll-spy state plus like, copy link and "Ask about this post". Under 1200px the
  TOC collapses into a disclosure; under 832px both navs become disclosures above the title.
- Comments: one level of replies drawn as an indented rule; author replies carry an "Author" badge; likes are
  `aria-pressed` toggles; the reader's own pending reply is dashed amber with "Awaiting review" and who can see it.
- Share: menu with copy link (confirms "Copied"), X, LinkedIn and "More options" (Web Share); on phones the button
  opens the native share sheet directly.
- Projects: no fixture has an image, so both use reference rows; cards are reserved for projects with images.
- Touch targets: interactive elements are 44px (36px for in-row secondary actions on desktop, still above 24px).

## Deviations from v2 (every one)
| # | v2 token or rule | Blueprint value | Why |
|---|---|---|---|
| 1 | Flavor instrument / atelier / margin | `data-gk-flavor="portfolio"` block setting the same `--gk-*` names | Own direction on the foundation; v2 files untouched |
| 2 | `--gk-font-sans/display/reading` Plex Sans | Schibsted Grotesk | Portfolio voice distinct from the admin tool |
| 3 | `--gk-font-mono` Plex Mono | JetBrains Mono (same as Atelier/Margin) | Better code ligature-free reading at small sizes |
| 4 | `--gk-text-xs..3xl` 12-36 (Instrument) | 13 / 14 / 16 / 18 / 22 / 28 / 36 | 16px reading base for a public site |
| 5 | `--gk-leading-tight/body` 1.2 / 1.5 | 1.08 / 1.6 | Tight display, airy reading |
| 6 | `--gk-weight-display` 600, `--gk-tracking-display` -0.01em | 700, -0.022em | Display type carries the personality |
| 7 | `--gk-control-h` 2.25rem | 2.5rem (buttons 2.75rem) | Public site, touch first |
| 8 | `--gk-measure` 68ch | 41.25rem (660px) | Decision 14: prose about 660px |
| 9 | `--gk-color-bg/surface/sunken` | Light `#F5F7FA / #FFFFFF / #ECEFF4`; dark `#0D1422 / #151C29 / #0A101B` | Blueprint ink palette |
| 10 | Neutrals as fixed hex | `--gk-color-text/-muted/-subtle/border/border-strong` = ink at 94 / 72 / 62 / 12 / 48% | Decision 14: opacity-built neutrals |
| 11 | Accent teal | Red: light `#C41F1C` (hover `#A51815`), dark `#FF6B5E` (hover `#FF8C81`); `on-accent` `#FFF` / `#1A0606`; subtle pair `#FBE6E5`/`#8E1512`, `#3A1D24`/`#FFB4AA`; focus = accent | Keep the red identity, AA-tuned |
| 12 | `--gk-color-overlay`, `--gk-shadow-color` | Built from the portfolio ink | Same hue family |
| 13 | (new) `--pf-fill`, `--pf-fill-hover`, `--pf-on-fill` | `#C41F1C`/`#A51815`/`#FFF` light, `#D62B26`/`#E3403A`/`#FFF` dark | Dark text accent is too light for white labels; filled buttons need their own step |
| 14 | (new) `--pf-rule`, `--pf-grid` | Ink 10%; grid ink 5.5% light, info-blue 7% dark | Frame hairlines and hero graph paper |
| 15 | (new) `--pf-tint` | 14% | Method badge and tag fill strength |
| 16 | (new) `--pf-glass` | bg at 80-82% | Sticky top bar with backdrop blur |
| 17 | (new) `--pf-text-4xl`, `--pf-text-hero`, `--pf-frame`, `--pf-code-key` | 3rem, clamp(2.5rem..4.5rem), 76rem, ink | Sizes v2 has no step for |
| 18 | Theme default light | `data-gk-theme="system"` | Decision 14 |
| 19 | Danger/success/warning/info, radii, spacing, easing, durations, shadows | Unchanged from Instrument | Not deviations; listed for completeness |

Components drafted here from tokens, proposed to platform as v2 `gk-` classes: method badge, stats row/rail,
count-up, availability chip, request card, skills table, reference row, docs layout + TOC, comment thread, share menu,
chat panel + chips, player (mini, panel, loop button), registration-mark frame.

## Contrast (measured with `contrast.py`; neutrals composited over their backdrop)
| Theme | Pair | Ratio | Needs | Result |
|---|---|---|---|---|
| dark | text (ink 94%) on bg | 13.86 | 4.5 | pass |
| dark | text (ink 94%) on surface | 12.86 | 4.5 | pass |
| dark | muted (ink 72%) on bg | 8.43 | 4.5 | pass |
| dark | muted (ink 72%) on surface | 8.00 | 4.5 | pass |
| dark | subtle (ink 62%) on bg | 6.58 | 4.5 | pass |
| dark | subtle (ink 62%) on surface | 6.32 | 4.5 | pass |
| dark | border-strong (ink 48%) on bg [UI] | 4.38 | 3.0 | pass |
| dark | border-strong (ink 48%) on surface [UI] | 4.29 | 3.0 | pass |
| dark | accent #FF6B5E text on bg | 6.59 | 4.5 | pass |
| dark | accent #FF6B5E text on surface | 6.11 | 4.5 | pass |
| dark | accent text on accent 14% tint #362730 | 5.05 | 4.5 | pass |
| dark | info #7EAEEF text on bg | 8.06 | 4.5 | pass |
| dark | info text on its 14% tint #243045 | 5.80 | 4.5 | pass |
| dark | success #5FCB8C text on bg | 9.13 | 4.5 | pass |
| dark | success text on its 14% tint #1F3437 | 6.49 | 4.5 | pass |
| dark | warning #E9B44E text on bg | 9.74 | 4.5 | pass |
| dark | warning text on its 14% tint #33312E | 6.86 | 4.5 | pass |
| dark | white on fill #D62B26 (primary button) | 4.96 | 4.5 | pass |
| dark | fill #D62B26 vs bg [UI] | 3.71 | 3.0 | pass |
| dark | on-accent #1A0606 on accent #FF6B5E | 7.01 | 4.5 | pass |
| dark | on-accent-subtle #FFB4AA on accent-subtle #3A1D24 | 8.95 | 4.5 | pass |
| dark | focus ring (accent) vs bg [UI] | 6.59 | 3.0 | pass |
| light | text (ink 94%) on bg | 14.86 | 4.5 | pass |
| light | text (ink 94%) on surface | 15.92 | 4.5 | pass |
| light | muted (ink 72%) on bg | 7.11 | 4.5 | pass |
| light | muted (ink 72%) on surface | 7.37 | 4.5 | pass |
| light | subtle (ink 62%) on bg | 5.06 | 4.5 | pass |
| light | subtle (ink 62%) on surface | 5.19 | 4.5 | pass |
| light | border-strong (ink 48%) on bg [UI] | 3.23 | 3.0 | pass |
| light | border-strong (ink 48%) on surface [UI] | 3.28 | 3.0 | pass |
| light | accent #C41F1C text on bg | 5.50 | 4.5 | pass |
| light | accent #C41F1C text on surface | 5.90 | 4.5 | pass |
| light | accent text on accent 14% tint #F7E0DF | 4.69 | 4.5 | pass |
| light | info #1D5BA6 text on bg | 6.31 | 4.5 | pass |
| light | info text on its 14% tint #DFE8F3 | 5.48 | 4.5 | pass |
| light | success #16713A text on bg | 5.66 | 4.5 | pass |
| light | success text on its 14% tint #DEEBE3 | 4.95 | 4.5 | pass |
| light | warning #8A5300 text on bg | 5.90 | 4.5 | pass |
| light | warning text on its 14% tint #EFE7DB | 5.16 | 4.5 | pass |
| light | white on fill #C41F1C (primary button) | 5.90 | 4.5 | pass |
| light | fill #C41F1C vs bg [UI] | 5.50 | 3.0 | pass |
| light | on-accent-subtle #8E1512 on accent-subtle #FBE6E5 | 7.75 | 4.5 | pass |
| light | focus ring (accent) vs bg [UI] | 5.50 | 3.0 | pass |

Full output (50 pairs, 0 failing) from `python contrast.py`. Reference: current `#f73b3b` is 3.72 on white and 3.72
for white on it (fails), 4.95 on the new dark bg.

## Iterations (screenshots reviewed each round)
1. First pass: count-up captured mid-animation; post page footer pushed off by a full-height sticky nav; email label
   wrapped and misaligned the form row; chat answer state clipped the follow-up chips; three-column spec sheets let the
   chat panel overflow its cell.
2. Fixed: sticky inner wrapper for the post nav, inline field labels, sheet min column 28rem (2 columns), taller chat
   panel and a shorter answer, `?still` renders final numbers, skeletons visible in dark (border token instead of
   sunken), JSON in the request card wraps on phones instead of scrolling off.
3. Polish: stats rail shows the 5th item peeking so it reads as scrollable; error states get a stronger danger
   border; on phones the share button goes straight to the native sheet; spacing under the mobile post disclosures.

Known gaps: the mobile menu sheet, search dialog and course chapter page are not drawn (the chapter page reuses the
post's docs layout). Fonts and Simple Icons load from Google Fonts and jsDelivr in the mockup; the Astro app should
self-host both.
