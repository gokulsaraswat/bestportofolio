# BACKLOG: bestportofolio (PRT)

Rules: `RULES.md` section 4. Architecture: `docs/ARCHITECTURE.md`. Public-safe: no secrets, no employer material.
Priority: P0 broken/blocking or security, P1 important, P2 worthwhile, P3 nice to have.
Status: open, doing, blocked, done, dropped. Cross-repo: `needs:` waits on, `blocks:` is waited on by.

## Bugs
| ID | Title | Pri | Status | Needs/Blocks | Notes (where, repro, evidence) |
|---|---|---|---|---|---|

## Improvements
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| PRT-I-001 | UI/motion upgrade in 3 passes: site, chat widget (visual only, /api/chat stream untouched), own admin | P2 | open | master: PLT-I-001 | Prompt: docs/KICKOFF-PROMPT.md "UI UPGRADE ADD-ON". Installed 2026-11-25: gsap, @gsap/react, lenis, @formkit/auto-animate (unused so far); keeps framer-motion ^12. Verify: typecheck, lint, build. |

## Features
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

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
