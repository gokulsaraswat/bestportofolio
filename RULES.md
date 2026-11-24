# RULES: global agent rules (all repos)

Source of truth: `platform/docs/RULES.md`. Every other repo holds a copy at `RULES.md`, written by `platform/scripts/sync-kit.sh`. Do not edit copies; change this file, then run the script.
Public-safe: no secrets, no employer material (that lives only in `Project/PRIVATE-*.md`, outside every repo).

## 1. Session start (in order)
1. `RULES.md` (this file), `CLAUDE.md`, `AGENTS.md`.
2. `docs/CONTEXT.md` (vision, repo map, contracts).
3. `docs/ARCHITECTURE.md` (what exists) and `docs/CONTRACTS.md` (interfaces) if present.
4. `docs/BACKLOG.md` (open bugs, improvements, features, ideas) and `WORKLOG.md` (current state).
5. `graphify-out/GRAPH_REPORT.md` if present, before any architecture question.
Cross-repo work: also read `platform/docs/BACKLOG.md` (master index) and `platform/docs/CONTRACTS.md`.

## 2. Commit and push after every unit of work
- One logical change = one commit = pushed straight away. Never end a turn with uncommitted or unpushed work you created.
- Stage only the files you changed (`git add <paths>`). Never `git add -A` when the tree holds Gokul's in-progress work; never undo it.
- `git pull --rebase` first if behind. Never force-push, never skip hooks, never commit `.env*`, keys, tokens, `*.pem`.
- Message: `type(scope): what` (feat, fix, docs, chore, refactor, test). Add the Co-Authored-By line your harness requires.
- Collaborators (not the owner) never push to `main`: branch + PR (see `COLLABORATORS.md`).

## 3. Ask before guessing
Ask Gokul (one round, up to 4 questions, each with options and trade-offs) when scope, naming, trade-offs or cross-repo impact would change the result. Do not ask what the repo already answers. Never invent a class, route, table or package name: if absent from ARCHITECTURE/CONTRACTS/code, stop with `[REQ_CONTEXT]: I need <thing>`.

## 4. Backlog protocol (`docs/BACKLOG.md`)
- Found a bug, smell, missing feature or idea while working? Add it to the right section immediately, in the same commit as your other work. Do not fix unrelated items silently.
- ID: `<PREFIX>-<B|I|F|X|D>-<nnn>` (B bug, I improvement, F feature, X idea, D tech debt). Never renumber or reuse IDs.
- Prefixes: PLT platform, ADM admin, MOB gokulmobilize, PRT bestportofolio, GSP Progress, MDS Markdown-studio, GYM checkers-gym-management, OMN gokul-omni-converter.
- Row: `ID | title | priority P0-P3 | status | needs/blocks | notes`. Status: `open`, `doing`, `blocked`, `done`, `dropped`.
- Cross-repo dependency: write `needs: PLT-F-012` (this item waits on that) or `blocks: ADM-F-004`. If the other repo owns it, add the item there too and link both ways.
- Finishing an item: set `done`, put the commit short hash in notes, move the row to "Done (recent)". Keep the last ~20 done rows, then prune.
- Master index `platform/docs/BACKLOG.md` lists P0/P1 and cross-repo items; regenerate it with `platform/scripts/sync-kit.sh --index`.

## 5. Keep docs in sync (same commit as the change)
| Change | Update |
|---|---|
| Route, module, package, dependency, data flow | `docs/ARCHITECTURE.md`, then `graphify update .` |
| Exported API, Supabase table, config schema, env var, package version | `docs/CONTRACTS.md` (platform first, then consumers), `.env.example` |
| Any step | `WORKLOG.md` (state + next step), `docs/BACKLOG.md` |
| Rule change | `platform/docs/RULES.md`, then `sync-kit.sh` |
ARCHITECTURE describes only what exists. Wishes go to the backlog.

## 6. Cross-repo discipline
- Shared code is changed in `platform`, released, then consumers bump. Never copy shared code between repos.
- Single-repo session: stay in this repo. Need a shared change? Add `needs:` backlog items and a request in `WORKLOG.md`; do not hack around it.
- Integration session: change contracts in `platform` first, adapt consumers, verify the flow end to end.
- Interconnection map: `platform/docs/ARCHITECTURE.md` (system view) and `docs/CONTEXT.md` (repo map).

## 7. Privacy and safety
- Seven of eight repos are public. Nothing private, no tokens, no employer data in any repo, commit, issue or PR.
- Employer items and security to-dos go to `Project/PRIVATE-TODO.md` / `PRIVATE-STATUS.md` (not in git).
- Never commit generated secrets; check `git status` for `.env*` before every commit.

## 8. Quality bar (definition of done)
Build passes (`rm -rf node_modules dist && npm ci && npm run build` or repo equivalent), lint clean, tests pass where they exist, evidence shown, docs + backlog + WORKLOG updated, committed, pushed. Add a test only for non-trivial logic with none yet; otherwise leave a one-line note in the backlog naming the gap.

## 9. Style
Terse. Answer first. Diffs, not whole files. No narration comments in code. Match surrounding code idiom. Reuse before writing: existing code, then stdlib/platform, then existing dependency, then new code.

## 10. Session end
1. Backlog rows updated. 2. `WORKLOG.md` state + next step. 3. Architecture/contracts if structure changed. 4. `graphify update .`. 5. Commit, push. 6. Run `Project/platform/scripts/sync-kit.sh` (or `/gitmd`) if you touched shared docs.
