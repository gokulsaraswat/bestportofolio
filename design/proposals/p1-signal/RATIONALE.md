# p1 "Signal": rationale

Dark-first, editorial-technical. One ink, one paper, one red. The portfolio introduces itself the way its owner's
work does: as an API. The hero is a `GET /gokul` request whose response is the profile, and that card is the one
bold thing on the page. Everything around it is quiet: opacity-built neutrals, hairline rows, a single grotesk.

## Files

| File | What |
|---|---|
| `index.html` | Home: centered hero (availability chip, two-tone name, rotating role line with pause, CTAs, `GET /gokul` card), stats row, merged skills, featured project with artifact tabs, latest posts, courses |
| `post.html` | Blog post in docs layout: category side nav, breadcrumbs, 660px prose, code block, resources, like + share menu (open), prev/next, comments (author reply, open reply form, pending-review comment) |
| `projects.html` | Projects list: filter chips, rich row for the real project, graceful sparse row for the fixture test row |
| `chat.html` | Chat widget open: live panel (greeting + 4 starters; click one to get the reply + 3 follow-ups) and the after-reply state |
| `player.html` | Music player: compact dock, pre-play state, expanded player with playlist, shuffle, prev/next, loop off/one/all, volume. `?playing` forces a mid-track state |
| `states.html` | Stats rail beyond 4, project card with banner (image placeholder), skeleton rows, empty state, error state, form error |
| `signal-tokens.css` | The portfolio flavor: v2 `--gk-*` names, own values, plus `--pf-*` additions |
| `signal.css` | Layout and `pf-` components built from tokens |
| `signal.js` | Shared nav/footer/dock/launcher, theme switch, rotator, request reveal, count-up, tabs, rail, likes/share/copy, chat demo, player state |
| `contrast.mjs` | Contrast check of every colour pair (`node contrast.mjs`, `--md` for the table below) |

Every page takes `?theme=light|dark|system` (default: system, or the footer choice stored per device). Open the files
directly from disk; fonts and icons load from Google Fonts and jsDelivr.

## Design plan

- **Colour**: dark paper `#141112`, dark ink `#F3EEEB`, light paper `#FDFCFC`, light ink `#1B1517`, signal red `#F73B3B`
  (dark) / `#C81E1E` (light). Every neutral is the ink mixed over the paper at a fixed percentage
  (`color-mix(in srgb, var(--pf-ink) N%, var(--pf-paper))`), so a theme is four values plus a percentage ladder.
- **Type**: Mona Sans (variable weight 200-900 and width 75-125) for everything; Martian Mono (variable width) only where
  the content is literally code or protocol: the request card, code blocks, stack tags, file names.
- **Layout**: centered hero, everything else left-aligned on a 70rem grid. Lists are rows separated by hairlines; the
  only bordered boxes are things you interact with (request card, featured project, project rows, forms, chat, player).
- **Principles**: one red; one bold thing per screen (the request card on home, the prose column on posts); two-tone
  headings carry hierarchy instead of eyebrows; width axis instead of extra typefaces; motion only where it explains.

Review against the generic default: a dark page with one vermilion accent is a known AI cliché. The brief pins it down
(dark-first, keep the red), so the distinctiveness had to come from elsewhere: the request/response hero, the
width-axis typography (expanded display, condensed numerals), and red that carries meaning (`"available": true`,
progress, current item, primary action) rather than decoration. I dropped two first-draft ideas because they read as
template: a pulsing red "live" dot (red reads as "busy" in presence UIs; the availability dot is the semantic green)
and a monospace eyebrow over each section (replaced by the two-tone heading).

## Options considered

### Hero
| Option | Trade-off |
|---|---|
| A. Centered name + rotating role, request card below (chosen) | Brief-mandated centering; the card sits on the axis like a terminal under a title. Hero is tall, so the card starts just above the fold at 1440x900. |
| B. Split: text left, card right | Shows the card above the fold everywhere, but breaks "centered" and looks like every SaaS hero. |
| C. The card IS the hero (name inside JSON) | Most distinctive, but recruiters skim: the name must be readable type, not a string literal. |

Chosen A. The card loads as the page's single orchestrated moment: status reads `... pending`, then flips to
`200 OK 38 ms` while the JSON lines rise in a 35ms stagger. Tabs switch Body/Headers (headers carry timezone and
reply time), and "Copy curl" copies a real command (the Astro build can serve `/api/gokul` from the same admin data).
The rotating role has a pause button (WCAG 2.2.2: it moves for more than 5 seconds) and does not rotate under reduced motion;
screen readers get all four roles once as text.

### Music player
| Option | Trade-off |
|---|---|
| A. Pill dock bottom-left + expandable panel (chosen) | Always reachable, never covers reading; one state shared with the footer "Now playing". Needs body padding so it never hides the footer. |
| B. Full-width bottom bar | Familiar (Spotify), but too heavy for background music on a portfolio and fights the chat launcher on mobile. |
| C. Player only in the footer | Lightest, but you cannot pause from mid-page. |

Chosen A. The compact pill shows title/artist, play/pause, next, expand, and a 2px red progress line along its bottom
edge. The expanded panel has a seek slider, shuffle, prev, play (the only big red control), next, loop cycling
off -> all -> one (a "1" badge marks one-track loop), mute + volume, and a numbered playlist (numbers are real order here)
with an equaliser glyph on the current track that animates only while playing and stays still under reduced motion.
Before the first click the pill says "Music is off" and nothing is fetched. State (track, position, loop, shuffle, volume)
persists per device.

### Stats
| Option | Trade-off |
|---|---|
| A. Hairline-divided row, condensed numerals (chosen) | Reads like an instrument readout; no cards. |
| B. Four cards with icons | Generic, adds boxes for no information. |
| C. Big-number hero band | The skill flags this as the default treatment; the hero already has a bold thing. |

Chosen A. Numbers use Mona Sans at width 82% and weight 720, suffix in subtle ink. Count-up runs once when 50% in view
(1.1s ease-out); reduced motion and no-JS show final numbers (the HTML ships them). Up to 4 fill the row; with 5+ the row
becomes a scroll-snap rail with a peek of the next item, an edge fade and prev/next buttons that appear only when it
overflows (see `states.html`). On mobile it is always a rail (1.35 items visible). No marquee. The fixture has no stats
table yet, so the four shown are derived from real content (30% / 98% from the project, 5 posts, 12 chapters).

### Skills
| Option | Trade-off |
|---|---|
| A. Category rows: name + one-line note left, icon chips right (chosen) | Scannable, matches the row-list language; primary items get a stronger chip. |
| B. Icon grid (logo wall) | Pretty, but loses grouping and reads as a sticker sheet. |
| C. Columns per category | Uneven column heights with 4-6 items; awkward on mobile. |

Chosen A. Icons come from Simple Icons slugs drawn as a CSS mask in `currentColor`, so brand colours never compete with
the red. Items without a slug get a mono glyph (`SQL`, `{ }`), showing the fallback rule. No % bars.

### Type
| Option | Trade-off |
|---|---|
| A. Mona Sans + Martian Mono (chosen) | One variable family does display (expanded 108%), text (100%) and numerals (condensed 82%); Martian Mono is wide and engineered, clearly distinct. Both OFL. |
| B. Inter + JetBrains Mono | Current site font; the most default pairing available. |
| C. Geist + Geist Mono | Polished but now the Vercel house look; would read as a template. |

Scale: 13 / 14 / 17 (base) / 19 / 24 / 32 / 44, display clamp 42-84px, prose 18px / 1.7 in a 660px column (about 70
characters). Headings use `text-wrap: balance`. Two-tone headings: the statement in ink, the continuation in subtle ink at
medium weight. This is the brief's choice; the dim half is always a full clause, never a single highlighted word.

### Colour
| Option | Trade-off |
|---|---|
| A. Warm carbon paper + warm ink, red kept at `#F73B3B` in dark (chosen) | The brand red survives untouched in the hero mode; filled buttons carry ink-black text (5.04:1). |
| B. Neutral `#0A0A0A` + white text on a deepened red | Conventional white-on-red, but the red has to drop to `#D42A2A` and loses the brand. |
| C. Cool slate ink | Fights a warm red; reads as Instrument (admin). |

Chosen A. Light mode deepens the red to `#C81E1E` (5.60:1 on paper, white text 5.74:1). Semantic colours stay
semantic: green for "open to work" and 200 OK, salmon/brick for errors. Info and highlight are folded into ink and red so
no blue or yellow appears.

### Motion
| Option | Trade-off |
|---|---|
| A. One orchestrated moment (request resolves) + motion that answers actions (chosen) | Matches the brief's "motion answers the user". |
| B. Fade-up on every section | The generic default; scroll jank and noise. |
| C. No motion | Loses the count-up and role rotation the brief asks for. |

Allowed motion: request reveal (once), role rotation (pausable), count-up (once), row hover tick (red 2px bar scales in),
tab underline, toast rise, typing dots, equaliser while playing. All `transform`/`opacity`, v2 easings and durations,
all off under `prefers-reduced-motion`.

### Footer
| Option | Trade-off |
|---|---|
| A. Four link groups + bordered side block, legal row below (chosen) | Brief layout; the side block holds the three live controls so links stay pure lists. |
| B. Side block on the left as an intro | Pushes links right; the theme switch becomes the first thing, which is backwards. |
| C. Single dense row | Fails on mobile and hides the player. |

The side block has a segmented System / Light / Dark switch (real radios), the shared "Now playing" with a play
button, and the copyright. Bottom row: Privacy, Terms, Cookies, Accessibility, Sitemap, RSS, plus a content date.
External links carry an arrow glyph and screen-reader text "(opens in a new tab)". Below 1100px the side block moves
under the groups; on mobile the groups are two columns.

## Deviations from v2 tokens (every one)

| # | v2 | Signal | Why |
|---|---|---|---|
| 1 | Flavors instrument / atelier / margin | `data-gk-flavor="portfolio"` block in `signal-tokens.css`, same `--gk-*` names | Brief: own direction on v2; v2 files untouched |
| 2 | Neutrals as fixed hex per theme | Neutrals = `color-mix` of `--pf-ink` over `--pf-paper` at `--pf-p-*` percentages (surface 3.5/5%, border 12/14%, border-strong 52/46%, subtle 66/60%, muted 78/74%) | "Opacity-built neutrals of one ink"; mixes are opaque so contrast is measurable |
| 3 | `sunken` darker than bg in both themes | Light: ink 6%; dark: deeper paper `#0D0B0C` | Ink mixing can only lighten in dark mode; code wells must sink |
| 4 | Accent teal / indigo / wine | Light `#C81E1E` (hover `#A31616`), dark `#F73B3B` (hover `#FF6663`) | Keep the red, AA-tuned |
| 5 | `on-accent` white in light | Light white; dark ink-black `#141112` | Keeps `#F73B3B` exact on dark buttons at 5.04:1 |
| 6 | `accent-subtle` fixed hex | Red 9% (light) / 15% (dark) over paper; `on-accent-subtle` `#8F1414` / `#FFA9A5` | Same mixing rule as neutrals |
| 7 | `info` blue | `info` = text-muted, `info-subtle` = surface | Red is the only accent |
| 8 | `highlight` yellow | Red 22% over paper (selection, marks) | Same |
| 9 | `danger` per flavor | Light `#A8200F`, dark `#FF8A7A`; always with title/icon | Must differ from the accent by lightness and never rely on colour alone |
| 10 | `success`/`warning` per flavor | Instrument values (light `#16713A`/`#8A5300`, dark `#5FCB8C`/`#E9B44E`); subtle = 12% mix | Semantic only (availability dot, 200 OK) |
| 11 | Fonts per flavor | Mona Sans for sans/display/reading; Martian Mono for mono | One variable grotesk + mono labels |
| 12 | Type scale | xs 0.8125, sm 0.875, base 1.0625, lg 1.1875, xl 1.5, 2xl 2, 3xl 2.75 rem; new `--pf-text-display` clamp(2.6rem..5.25rem), `--pf-text-stat` | 17px base suits a reading site |
| 13 | Leading / weights / tracking | tight 1.02, snug 1.3, body 1.62; medium 530, strong 640, display 680; display tracking -0.035em, body -0.003em | Variable weights tuned to Mona Sans |
| 14 | No width tokens | New `--pf-stretch-display` 108%, `--pf-stretch-stat` 82%, `--pf-mono-stretch` 87.5% | Width axis replaces a second display face |
| 15 | Radius | sm 4, md 8, lg 12, xl 18 px | Between Instrument and Atelier; still rises with hierarchy |
| 16 | `control-h` | 2.5rem (v2 touch rule still lifts to 44px) | Larger type needs taller controls |
| 17 | `--gk-measure` 68ch | 41.25rem (660px) | Brief: prose about 660px |
| 18 | No container token | `--pf-wrap` 70rem | Page grid |
| 19 | Shadow tint per flavor | Ink-tinted `27 21 23` light; dark black with k 2.5 (as v2) | Same ink everywhere |
| 20 | Theme default light | `data-gk-theme="system"`; dark designed first | Decision 14 |
| 21 | `.gk-skeleton` uses sunken | Uses border colour | Dark sunken is darker than bg, so skeletons vanished |
| 22 | `.gk-btn` | `--lg` 48px tall at base size; ghost buttons muted; `[aria-pressed=true]` turns accent | Like/share/toggle states |

New components drafted from tokens only, proposed to platform as v2 `gk-` classes (`needs: PLT-F-<n>`): request card,
stats rail + count-up, skills rows, row list, chips, segmented control, pill player + expanded player, chat panel,
comment thread with reply form and pending state, share menu, docs side nav + pager, pill toast.

## Measured contrast (WCAG 2.2)

Generated by `node contrast.mjs --md`; all 48 pairs pass.

| Theme | Pair | Fg | Bg | Ratio | Min | Result |
|---|---|---|---|---|---|---|
| dark | text on bg | `#F3EEEB` | `#141112` | 16.31 | 4.5 | pass |
| dark | text on surface | `#F3EEEB` | `#1F1C1D` | 14.69 | 4.5 | pass |
| dark | text on sunken | `#F3EEEB` | `#0D0B0C` | 17.04 | 4.5 | pass |
| dark | text-muted on bg | `#B9B5B3` | `#141112` | 9.23 | 4.5 | pass |
| dark | text-muted on surface | `#B9B5B3` | `#1F1C1D` | 8.31 | 4.5 | pass |
| dark | text-muted on sunken | `#B9B5B3` | `#0D0B0C` | 9.65 | 4.5 | pass |
| dark | text-subtle on bg | `#9A9694` | `#141112` | 6.40 | 4.5 | pass |
| dark | text-subtle on surface | `#9A9694` | `#1F1C1D` | 5.77 | 4.5 | pass |
| dark | text-subtle on sunken | `#9A9694` | `#0D0B0C` | 6.69 | 4.5 | pass |
| dark | border-strong on bg | `#7B7776` | `#141112` | 4.24 | 3 | pass |
| dark | border-strong on surface | `#7B7776` | `#1F1C1D` | 3.82 | 3 | pass |
| dark | accent on bg | `#F73B3B` | `#141112` | 5.04 | 4.5 | pass |
| dark | accent on surface | `#F73B3B` | `#1F1C1D` | 4.54 | 4.5 | pass |
| dark | accent on sunken | `#F73B3B` | `#0D0B0C` | 5.27 | 4.5 | pass |
| dark | accent-hover on bg | `#FF6663` | `#141112` | 6.55 | 4.5 | pass |
| dark | on-accent on accent | `#141112` | `#F73B3B` | 5.04 | 4.5 | pass |
| dark | on-accent on accent-hover | `#141112` | `#FF6663` | 6.55 | 4.5 | pass |
| dark | on-accent-subtle on accent-subtle | `#FFA9A5` | `#361718` | 8.87 | 4.5 | pass |
| dark | text on accent-subtle | `#F3EEEB` | `#361718` | 14.11 | 4.5 | pass |
| dark | accent on bg (focus ring vs bg) | `#F73B3B` | `#141112` | 5.04 | 3 | pass |
| dark | accent on surface (focus ring vs surface) | `#F73B3B` | `#1F1C1D` | 4.54 | 3 | pass |
| dark | success on surface | `#5FCB8C` | `#1F1C1D` | 8.38 | 4.5 | pass |
| dark | danger on surface | `#FF8A7A` | `#1F1C1D` | 7.38 | 4.5 | pass |
| dark | warning on surface | `#E9B44E` | `#1F1C1D` | 8.94 | 4.5 | pass |
| light | text on bg | `#1B1517` | `#FDFCFC` | 17.58 | 4.5 | pass |
| light | text on surface | `#1B1517` | `#F5F4F4` | 16.40 | 4.5 | pass |
| light | text on sunken | `#1B1517` | `#EFEEEE` | 15.55 | 4.5 | pass |
| light | text-muted on bg | `#4D4849` | `#FDFCFC` | 8.77 | 4.5 | pass |
| light | text-muted on surface | `#4D4849` | `#F5F4F4` | 8.18 | 4.5 | pass |
| light | text-muted on sunken | `#4D4849` | `#EFEEEE` | 7.75 | 4.5 | pass |
| light | text-subtle on bg | `#686465` | `#FDFCFC` | 5.70 | 4.5 | pass |
| light | text-subtle on surface | `#686465` | `#F5F4F4` | 5.31 | 4.5 | pass |
| light | text-subtle on sunken | `#686465` | `#EFEEEE` | 5.04 | 4.5 | pass |
| light | border-strong on bg | `#878485` | `#FDFCFC` | 3.62 | 3 | pass |
| light | border-strong on surface | `#878485` | `#F5F4F4` | 3.37 | 3 | pass |
| light | accent on bg | `#C81E1E` | `#FDFCFC` | 5.60 | 4.5 | pass |
| light | accent on surface | `#C81E1E` | `#F5F4F4` | 5.23 | 4.5 | pass |
| light | accent on sunken | `#C81E1E` | `#EFEEEE` | 4.95 | 4.5 | pass |
| light | accent-hover on bg | `#A31616` | `#FDFCFC` | 7.64 | 4.5 | pass |
| light | on-accent on accent | `#FFFFFF` | `#C81E1E` | 5.74 | 4.5 | pass |
| light | on-accent on accent-hover | `#FFFFFF` | `#A31616` | 7.83 | 4.5 | pass |
| light | on-accent-subtle on accent-subtle | `#8F1414` | `#F8E8E8` | 7.77 | 4.5 | pass |
| light | text on accent-subtle | `#1B1517` | `#F8E8E8` | 15.18 | 4.5 | pass |
| light | accent on bg (focus ring vs bg) | `#C81E1E` | `#FDFCFC` | 5.60 | 3 | pass |
| light | accent on surface (focus ring vs surface) | `#C81E1E` | `#F5F4F4` | 5.23 | 3 | pass |
| light | success on surface | `#16713A` | `#F5F4F4` | 5.53 | 4.5 | pass |
| light | danger on surface | `#A8200F` | `#F5F4F4` | 6.65 | 4.5 | pass |
| light | warning on surface | `#8A5300` | `#F5F4F4` | 5.77 | 4.5 | pass |

## Accessibility notes
- Skip link, landmarks, `aria-current` in nav and side navs, labelled forms, real buttons for every action.
- Visible 2px red focus ring with offset everywhere; the request card, tabs and rail are keyboard operable (arrow keys on tabs).
- Rotating role: pause button, all roles in an sr-only sentence, no rotation under reduced motion.
- Targets: chips, comment tools, footer and side links grow to 44px on coarse pointers; player icon buttons are 44px.
- Share: Web Share API on touch devices, otherwise a menu (copy link, X, LinkedIn); Escape closes it and returns focus.
- Pending comment is announced with `role="status"` and says who can see it and what happens next.

## Content notes (for Gokul)
- Real fixture copy is used throughout. Placeholders: hero lede, chat greeting and answer, comment authors, playlist titles
  (only "Background music" maps to the real `/background-music.mp3`), stats (derived from fixtures until the stats table exists).
- Fixture copy to fix in admin: course "System Design" description reads "Deisgn Big Apps"; settings description "Hi, Amigos My Boyes";
  roles "FDE"/"SDE" are abbreviations most visitors will not expand.

## Known limits
- Mobile menu button is drawn but its open sheet is not mocked.
- On 390px the JSON in the request card scrolls sideways inside the card rather than wrapping.
- The pause button sits after the widest role, so a short role leaves a gap before it.
- Fonts and icons load from CDNs here; the Astro build should self-host the woff2 files and inline the Simple Icons SVGs.

## Screenshots
Captured at 1440 and 390 wide, light and dark, full page, via Chrome DevTools Protocol (script kept outside the repo):
`<page>-<desktop|mobile>-<light|dark>.png` for index, post, projects, chat, states, player. Three review passes; fixes
made between passes: code font override on `<code>`, nav alignment, section spacing, footer side width, launcher icon on
mobile, chat panel title size and scroll container, comment inline code, comment count, skeleton contrast, rail peek and fade.
