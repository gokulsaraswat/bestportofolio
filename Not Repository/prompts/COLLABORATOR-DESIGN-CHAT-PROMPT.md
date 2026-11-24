# Collaborator prompt: DESIGN CHAT (run in this repo, then produce the final prompt)

Purpose: Gokul will pair with Claude in a NEW chat to design ONE self-contained, no-questions prompt for a friend (collaborator) to run on GSpace (repo `Progress`).
Use: open a chat with working directory `Project/Progress` (Opus 5.5, high effort). Paste the block below. Output: `docs/COLLABORATOR-PROMPT.md`.
Existing base to reuse and improve: `collaborator-prompt.md` (repo root; autonomous loop over `.claude-session.json`).

```text
You are helping Gokul DESIGN a single, self-contained prompt for a collaborator who will run it unattended on GSpace (repo Progress) with Claude Opus 5.5 (high effort).
You are NOT doing the GSpace work in this chat. Your product is the file docs/COLLABORATOR-PROMPT.md.

STARTUP (read-only)
1. Read: CLAUDE.md, README.md, WORKLOG.md, .claude-session.json (sprint.done / sprint.todo_next), collaborator-prompt.md (existing template),
   docs/KICKOFF-PROMPT.md, docs/master/ (PROMPTS, REPO-KIT, WORKLOG, PLANNING-CHAT-PROMPT), package.json, astro.config.mjs. Run `git status -sb` and `git log -5 --oneline`.
   Use graphify (graphify-out/) before reading source. Do not read src/files/** contents (private/work material); list names only if needed.
2. Tell Gokul, short: current GSpace state, what the existing prompt already does, gaps you see, and your first questions.

INTERVIEW (ask as many questions as needed, in rounds of up to 4; never assume; never invent file or function names)
Cover at least:
- Scope: exactly which tasks/steps (from .claude-session.json and Gokul's new wishes: MDX support, base path /gspace, deliverables tracker page, vision board rework,
  embed component/WebWindow, websites directory, shared footer/legal pages from @gokulsaraswat/ui, offline-first sync later). Order, step ranges, what is OUT of scope (today: steps 29 and 35).
- Pre-answer every decision the collaborator could hit (design choices, naming, libraries, MDX details, base path behaviour, what to do when a step is ambiguous). The final prompt must contain ALL answers: the collaborator is told NOT to ask questions.
- Fallback policy when truly blocked: decide, record the decision in the step's done[] entry, continue; if impossible (missing credential/external info), mark the step blocked in WORKLOG.md, skip to the next step.
- Git: branch name `<github-username>-gspace`, one commit per step, push after each, merge origin/main after each commit, PR only, never push/merge to main, never force-push.
- Verification per step: `rm -rf node_modules dist .astro && npm ci && npm run build` (and `npm run check` if it exists) on the pinned Node; no step is "done" unless the production build passes (Vercel hosts GSpace). Quick UI sanity check for UI changes.
- Docs upkeep per step: WORKLOG.md, .claude-session.json (done[]/todo_next), docs/CONTRACTS.md if an interface changes, graphify update.
- Skills/plugins to use (ponytail, caveman, graphify), model/effort, session-budget behaviour (if budget ends mid-step: WIP commit, leave step in todo_next, say so in WORKLOG.md).
- CONFIDENTIALITY: GSpace tracks work-related material under src/files/. Decide with Gokul BEFORE the friend gets access: private repo? untrack/move out? Tell the collaborator never to open, copy, quote or push content from src/files/** and never to put it in commits, PRs or logs. Put the final rule in the prompt.
- Secrets: never ask for or commit secrets/.env; use .env.example.
- Anything the friend must NOT touch (platform/other repos, Supabase config, graphify-out regeneration conflicts, package versions).
- Expected final report format (what the friend sends back: PR link, steps done/blocked, decisions made).

OUTPUT (after Gokul says the design is final)
1. Write docs/COLLABORATOR-PROMPT.md: one fenced block the friend pastes, containing context, ordered tasks with full requirement text, all pre-made decisions, hard rules, verification, docs upkeep, fallback policy, confidentiality rule, final report format. Self-contained: it must not depend on this chat.
2. Add a short "Notes for Gokul (not for the friend)" section: access to grant, model/effort, how to merge, what to review.
3. Update WORKLOG.md + COLLABORATORS.md (who has it, scope, date) and the master/planning log note for the planning chat (Project/WORKLOG.md runbook item C). Ask me before editing anything else. Never commit/push unless I say so.
Quality bar: another instance with zero context could execute it correctly and finish with a green production build and a PR.
```
