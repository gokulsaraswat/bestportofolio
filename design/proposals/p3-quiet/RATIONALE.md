# p3 "Quiet craft": rationale

A personal site, not a product page. One reading column, generous space, a reading serif for anything you read
and a plain grotesk for anything you operate. The red stays, but it only marks things you act on or where you are:
the primary button, the current section, an active loop/shuffle mode, a liked heart, the hover underline.

The one bold thing: the hero name set large in Newsreader at optical size 72, centred, with the role line changing
underneath. Everything below it is lists and hairlines.

## Files

| Path | What |
|---|---|
| `index.html` | Home: centred hero, sticky identity column (wide desktop), stats, skills, selected work, writing, courses, footer, docked player, chat launcher |
| `post.html` | Blog post in docs layout: post index (left), prose, TOC (right), like + share (menu open), prev/next, comments with replies, Author badge, pending state, reply form |
| `projects.html` | Featured project + archive table (year, project, role, stack), filters, empty-field handling (`asdfasf` test row) |
| `chat.html` | Chat widget: first open (greeting + 4 starters), after a reply (source + 3 follow-ups), loading + error |
| `player.html` | Music player: compact paused/playing, loop states, expanded (shuffle on, loop one, volume, playlist), loading + error |
| `states.html` | Stats rail with 6 items (rail + edge fade + buttons), skeleton list, empty state, form error |
| `assets/quiet.css` | Portfolio flavor tokens (`data-gk-flavor="portfolio"`) + components on top of `vendor/tokens.css` + `vendor/components.css` |
| `assets/quiet.js` | Theme (system/light/dark, saved), rotating role, count-up, rail, section spy, like, share, player UI state, chips |
| `contrast.mjs` | `node contrast.mjs` measures every colour pair below (exit code 1 on any failure) |

Open any page directly from disk. `?theme=light|dark` forces a theme, `?still` freezes motion (used for screenshots).
All copy is from `fixtures/*.json` except where listed under "Invented content".

## Decisions and the options considered

### Hero
1. **Centred name + rotating role + request card (chosen).** Brief asks for centred; the name in a large reading serif
   is the most personal first sight, and the `GET /gokul` card sits underneath as the technical counterpoint, set small,
   on a sunken header, so it reads as a detail rather than a second hero.
2. Left-aligned split (name left, card right). Stronger "developer" signal, but contradicts decision 13 and makes the card
   compete with the name.
3. Name only, card moved into the About page. Quietest, but loses a brief requirement.
Trade-off: the card adds about 180px before the first section; acceptable because the rest of the page is short lists.
The role rotates with a 150ms exit then a 300ms enter (no overlap), pauses on hover, and stops for reduced motion;
screen readers get all roles once as a sentence instead of a live region that would chatter.

### Music player
1. **Compact pill + expandable panel (chosen).** Compact: play, title, artist, small level bars, open. Expanded: seek,
   shuffle/prev/play/next/loop in one row, volume, playlist. On wide desktop the compact pill lives in the sticky identity
   column ("what I'm listening to" is part of the identity); elsewhere it docks bottom-left, away from the chat button.
2. Footer-only player. Very quiet, but controls disappear while reading, and decision 9 wants it persistent.
3. Full-width bottom bar (Spotify-style). Clear, but it is chrome on every page and fights the reading column.
Loop is one button cycling off -> playlist -> this track; active modes are red plus a dot (and a "1" badge for one track),
so state never depends on colour alone. Level bars animate only while playing and never under reduced motion.

### Stats
1. **Hairline row with serif figures (chosen).** Four columns divided by 1px rules, number in Newsreader with lining
   tabular figures, label in sans. Beyond four, or on mobile, the same grid becomes a scroll-snap rail with an edge fade
   and two small buttons (`states.html`).
2. Cards per stat. Rejected: the card-kit look and four boxes would be the heaviest thing on the page.
3. Inline sentence ("30% lower latency, 98% uptime..."). Most "quiet", but can't do count-up or admin ordering.
Count-up runs once per number at 60% visibility, 1.1s ease-out; the HTML already holds the final number, so no-JS,
crawlers and reduced motion see the real value.

### Skills
1. **Definition list: category in serif, items with monochrome Simple Icons (chosen).** Primary items in full text colour
   and medium weight, the rest muted, with a one-line legend ("Darker names are daily tools"). Icons inherit text colour
   via CSS mask, so brand colours never break the palette. Items without a slug get an empty outlined square.
2. Icon grid / logo wall. Scannable but loud, and the brand colours fight the red.
3. Tag chips per category. Familiar, but chips everywhere become noise next to the chat chips.

### Type
1. **Newsreader (display + reading) + Instrument Sans (UI) + JetBrains Mono (code only) (chosen).** All three are already
   v2 fonts (Margin flavor), so the platform caches and licences are shared and no new family enters the system.
   Newsreader's optical sizes let the same family work at 72px (hero) and 17px (chat answers).
2. One variable grotesk + mono labels (the README default). More "technical", but the angle asks for a reading accent
   and mono labels are a known template tell.
3. Source Serif 4 + Inter. Solid, but Inter is the old site's font and the pairing is the most common default.
Scale: 13 / 14 / 16 / 19 / 24 / 30 / 40, hero clamp 42-72px, prose 19px / 1.68 at 66ch. Headings weight 400, no
italics-on-one-word, no all-caps labels, sentence case throughout.

### Colour
1. **Opacity-built neutrals on one ink + a single red (chosen).** Light: `#FBFBFA` page, ink `rgb(27 27 31)`, muted 72%,
   subtle 64%. Dark: graphite `#18171A` (not near-black), ink `rgb(237 235 239)`. Red `#CC2929` light / `#F94C4A` dark,
   same hue as the current `#f73b3b`.
2. Warm paper + red. Rejected: cream backgrounds are the most common generated look.
3. Pure black + bright red. Too loud for a reading site and harsher for long dark-mode reading.
Focus rings use the ink colour, not red, so focus is never mistaken for an error.

### Motion
1. **One orchestrated entrance + responsive micro-motion (chosen).** Hero children rise 10px with 60ms stagger, once.
   After that only motion that answers a person: index line grows on hover, TOC marker moves, like heart pops, share menu
   scales in from its corner, role line rotates, stats count once.
2. Scroll-triggered fade-ups per section. Rejected by the brief (principle 5).
3. No motion at all. Loses the count-up and rotating role required by decisions 11 and 13.
All custom keyframes are inside `prefers-reduced-motion: no-preference`, plus a global reduce guard.

### Footer
1. **Four groups + side block (chosen).** Work / Writing / About / Elsewhere as serif headings over muted links; a side
   column (divided by a hairline on desktop) with the System/Light/Dark radio switch, "Now playing", copyright; bottom row
   Privacy, Terms, Cookies, Accessibility, Sitemap, RSS. Mobile: groups 2x2, side block under them.
2. One-line footer (leerob style). Quietest, but cannot hold the side block required by decision 15.
3. Big sign-off footer with a huge name. Repeats the hero and spends the "bold" budget twice.

## Deviations from v2

| # | v2 says | p3 does | Why |
|---|---|---|---|
| 1 | Flavor = instrument / atelier / margin | `data-gk-flavor="portfolio"`, same `--gk-*` names, values overridden in `assets/quiet.css` | Own direction on the v2 foundation (README deviation 1); vendor files untouched |
| 2 | Theme default light | `data-gk-theme="system"`, saved choice wins | Decision 14 |
| 3 | Accent per flavor | `--gk-color-accent` `#CC2929` / `#F94C4A`, `accent-hover` `#A82020` / `#FF7472`, `on-accent` `#FFFFFF` / `#1B0606`, `accent-subtle` `#FBEAE9` / `#3A1B1C`, `on-accent-subtle` `#8F1C1C` / `#FFC4C1` | Keep the red, AA-tuned |
| 4 | Solid hex neutrals | `text-muted`, `text-subtle`, `border`, `border-strong` are `rgb(ink / alpha)`; `bg` `#FBFBFA`/`#18171A`, `surface` `#FFFFFF`/`#201F23`, `sunken` `#F3F3F1`/`#121114` | Brief: opacity-built neutrals |
| 5 | `focus` = accent | `focus` = ink (`text`) | Red focus reads as an error state |
| 6 | Status colours per flavor | Margin's danger/success/warning/info/highlight values reused | Calm status colours that sit next to red |
| 7 | Fonts per flavor | sans Instrument Sans, display + reading Newsreader, mono JetBrains Mono | Reading serif accent; all three already in v2 |
| 8 | Text scale per flavor | xs 13, sm 14, base 16, lg 19, xl 24, 2xl 30, 3xl 40px (Margin's, xs raised 12 -> 13) | Margin's reading scale, slightly larger smallest size for UI text |
| 9 | Leading / weights / tracking | tight 1.1, body 1.6; display weight 400; display tracking -0.018em | Serif display at light weight |
| 10 | Radius per flavor | sm 4, md 6, lg 10, xl 14px; buttons are pills (`--gk-radius-full`) | Softer than Margin, still rising with hierarchy |
| 11 | `--gk-control-h` | 2.5rem (2.75rem on touch, unchanged rule) | Same as Margin |
| 12 | `--gk-press` | `translateY(1px)` | Quiet press, no scale bounce |
| 13 | `--gk-measure` 68ch | 66ch | About 660px prose at 19px (brief: prose ~660px) |
| 14 | `--gk-shadow-k` dark | 2.2 | Shadows otherwise vanish on graphite |
| 15 | (none) | Own tokens: `--q-ink`, `--q-hero`, `--q-col` 41rem, `--q-aside` 17rem, `--q-gutter`, `--q-section` 6rem, `--q-ok` availability green | No v2 role exists for these |
| 16 | Components | New, drafted from tokens, proposed as v2 `gk-` classes (needs PLT-F-n): stats rail, count-up, availability chip, request card, skill list, row list, player (mini + panel + loop button), chat panel + chips, comment thread + Author/pending badges, share menu, theme radio, TOC + doc nav | DESIGN-BRIEF section 6 |
| 17 | `gk-btn` | adds `--quiet` variant (text-only, muted) | Low-emphasis actions in comments and code bars |

## Contrast (measured with `node contrast.mjs`)

Alpha neutrals are composited over the surface they sit on. 46 pairs, 0 failures.

| Theme | Pair | Ratio | Needs |
|---|---|---|---|
| light | text on bg | 16.58 | 4.5 |
| light | text-muted on bg / surface / sunken | 6.65 / 6.77 / 6.48 | 4.5 |
| light | text-subtle on bg / surface / sunken | 5.06 / 5.16 / 4.93 | 4.5 |
| light | accent text on bg / surface / sunken | 5.18 / 5.36 / 4.83 | 4.5 |
| light | white on accent (primary button) | 5.36 | 4.5 |
| light | white on accent-hover | 7.26 | 4.5 |
| light | Author badge (on-accent-subtle on accent-subtle) | 7.68 | 4.5 |
| light | border-strong on surface / bg (inputs) | 3.53 / 3.47 | 3 |
| light | availability dot on surface | 4.62 | 3 |
| light | danger alert / warning alert | 5.62 / 5.85 | 4.5 |
| light | bg on ink (player button, own chat bubble) | 16.58 | 4.5 |
| dark | text on bg | 15.07 | 4.5 |
| dark | text-muted on bg / surface / sunken | 8.27 / 7.79 / 8.55 | 4.5 |
| dark | text-subtle on bg / surface / sunken | 6.09 / 5.80 / 6.24 | 4.5 |
| dark | accent text on bg / surface / sunken | 5.24 / 4.81 / 5.52 | 4.5 |
| dark | `#1B0606` on accent (primary button) | 5.73 | 4.5 |
| dark | `#1B0606` on accent-hover | 7.43 | 4.5 |
| dark | Author badge | 10.28 | 4.5 |
| dark | border-strong on surface / bg | 3.79 / 3.86 | 3 |
| dark | availability dot on surface | 7.35 | 3 |
| dark | danger alert / warning alert | 6.26 / 7.48 | 4.5 |
| dark | bg on ink | 15.07 | 4.5 |

For reference, the old `#f73b3b` measures 3.72 on white and 3.72 for white on it, so light mode cannot keep it for
text or filled buttons; `#CC2929` is the lightest step of the same hue that clears 4.5 on all three light surfaces.

## Accessibility notes
- Skip link, one `h1` per page, labelled landmarks (`Main`, `Footer`, `On this page`, `Writing`), `aria-current` on nav,
  doc nav and TOC.
- Rotating role: full list given once to screen readers; visual rotor is `aria-hidden`.
- Like buttons are `aria-pressed`; share is `aria-haspopup="menu"` + `aria-expanded`, Escape closes and returns focus;
  Web Share API is used on coarse pointers, the menu elsewhere.
- Chat log is `role="log"` `aria-live="polite"`; errors use `role="alert"`; the failed question stays in the box.
- Player controls are real buttons with labels that change with state (Play/Pause, Loop off/playlist/this track); ranges
  are native inputs with `aria-valuetext` for position.
- Touch: every control reaches 44px under `pointer: coarse`. Grid children use `minmax(0, 1fr)` so long code lines scroll
  inside their box instead of widening the page at 390px.

## Invented content (no fixture exists)
- Stats values derive from fixtures (30% / 98% from the banking project, 12 = 4 + 8 course chapters, 5 posts).
- Skills list is inferred from project stack and post tags; the real list comes from the admin skills editor.
- Playlist titles and artists (Monsoon Study / Saanjh, Paper Lanterns / Kiran Vale, Night Shift / Low Tide Radio) are
  placeholders; "Background music" stands for the existing `/background-music.mp3`.
- Comments and commenter names, the hero intro sentence (the live `description` is "Hi, Amigos My Boyes"),
  the chat greeting/starters/answer, and "Open to work from January".
- Course "System Design" keeps its live description "Deisgn Big Apps" and project `asdfasf` keeps "adsf" on purpose:
  they show how real admin data sits in the layout.

## Known limits
- Static mockups: no audio file, no real chat; JS only toggles UI state.
- Fonts and Simple Icons load from Google Fonts / jsDelivr; the Astro build self-hosts both.
- Images: no project has a banner, so the image-card variant of a project is described, not drawn.
