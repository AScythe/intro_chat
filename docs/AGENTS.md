# AGENTS.md

## AGENTS.md Scope
`AGENTS.md` defines *how* agents should work — behavioral rules for thinking, planning, implementing, and verifying, organized by workflow phase. Also defines *what* agents work on — project context, tech stack, commands, and file boundaries.

> **Key idea**: If it's about *how* to behave or *how* to implement during a task → this file. Behavioral rules are organized by workflow phase and map to the skill pipeline defined in `.opencode/skills/`. If it's about *how* the code is structured or data flows → [ARCHITECTURE.md](ARCHITECTURE.md). If it's about product vision, out-of-scope constraints, or privacy requirements → [SPECIFICATIONS.md](SPECIFICATIONS.md).

---

## Project Overview
IntroChat is an anonymous 2-minute micro-chat matching at events. Organizers create events and set up rooms. Users join via QR code or event code, select rooms, and get real-time matched with nearby available users. No accounts needed, no persistent messages, no stored identity.

Key functionalities: event creation, QR codes, room selection, demo-mode person selection, real-time matchmaking, timed chats with prompts, chat extension, Slack connection exchange, and background cleanup of expired matches.

---

## Product Architecture
- **Backend:** FastAPI + Uvicorn (`app/` package)
- **Database:** SQLite (`data/introchat.db`) — 4 tables: `events`, `rooms`, `users`, `matches`
- **Frontend:** Vanilla JS + Jinja2 (`app/templates/`, `app/static/js/`)
- **Real-time:** WebSocket (FastAPI native) with room-based broadcasting via `ConnectionManager`
- **In-memory state** (reset on restart): `active_users`, `active_matches`, `waiting_queue`

For full architecture details, component interactions, and implementation specifics, see [ARCHITECTURE.md](ARCHITECTURE.md).

For which documents to read during each workflow step (with section-specific Grep→Read instructions), see [DOCUMENT_GUIDELINES.md — Section 8: Workflow-to-Document Dependency](DOCUMENT_GUIDELINES.md#8-workflow-to-document-dependency).

---

## Environment
- **Python:** 3.10+
- **Setup:** `python -m venv venv && source venv/bin/activate` (Windows: `venv\Scripts\activate`)
- **Server binding:** Configured in `app/config.py` — `HOST='127.0.0.1'`, `PORT=5000`
- **Windows encoding:** Set `$env:PYTHONIOENCODING='utf-8'` before running Python scripts that output emoji or Unicode (PowerShell quirk)
- **Production:** Add `ENV=production` and configure CORS origins via FastAPI middlewares

---

## File Ownership

| Location | Role | Agent Policy |
|----------|------|--------------|
| `app/` | FastAPI package — routes, matching, WebSocket, schemas, config | ✅ Safe to edit |
| `app/templates/*.html` | Jinja2 UI pages | ✅ Safe to edit |
| `app/static/js/*.js` | Client logic (`utils.js`, `room.js`, `chat.js`, `user-info.js`) | ✅ Safe to edit |
| `data/introchat.db` | Persistent data store | ⚠️ Never delete without explicit user confirmation |
| `tests/test_*.py` | Regression tests | ⚠️ Run only — do not modify unless asked |
| `docs/AGENTS.md` | Agent behavioral rules | ✅ Safe to update with `update-agents` skill |
| `docs/ARCHITECTURE.md` | Technical structure reference | ✅ Safe to update with `update-architecture` skill |
| `docs/README.md` | User-facing README | ✅ Safe to update with `update-readme` skill |
| `docs/SPECIFICATIONS.md` | Product specification | ✅ Safe to update with `update-specifications` skill |
| `docs/DEMO_GUIDE.md` | Demo walkthrough | ✅ Safe to update with `update-demo-guide` skill |
| `docs/PROJECT_BEST_PRACTICES.md` | Best practices guide | ✅ Safe to update with `update-best-practices` skill |
| `docs/DOCUMENT_GUIDELINES.md` | Document governance | ✅ Safe to update |
| `.opencode/skills/*/SKILL.md` | Workflow skill definitions | ✅ Safe to edit with explicit user permission |

---

## Core Commands
```bash
# Setup
pip install -r requirements.txt
python -m app

# Test (run after every change)
python tests/test_app.py          # Backend and database checks
python tests/test_js_modules.py   # JS module validation
```

---

## Agent Behavioral Rules

Rules are organized by workflow phase. Each phase maps to the skill that owns it. For full detail on any phase, read the corresponding skill file at `.opencode/skills/<skill-name>/SKILL.md`.

### Phase 1: Thinking & Analysis — `analyze-and-plan`
- **Layered analysis**: Consult `docs/` first (Grep→Read relevant sections), spot-check 1-2 source files for accuracy, only fall back to full codebase when docs don't cover the need.
- **Confirm understanding**: Describe requirements back to the user. Surface ambiguities and assumptions explicitly. Do not proceed until confirmed.
- **Push back**: If a simpler approach exists, say so. Check logical soundness of proposals.
- **Read-only phase**: No file writes during planning. Verbal output only.
- **Cite sources**: Always note which docs were consulted.

### Phase 2: Probing & Refinement — `grill-and-refine`
- **Analyze alone first**: Before the user walkthrough, explore codebase independently for each dimension (assumptions, edge cases, alternatives, dependencies, risks, consistency).
- **One dimension at a time**: Present findings as concrete options. Resolve before moving on. Flag skippable items upfront for user confirmation.
- **Copy-ready outputs**: Format resolved dimensions as blocks the next stage can paste directly into the plan document.

### Phase 3: Planning & Readiness — `check-plan-readiness`
- **Presence check, not re-probe**: Verify each criterion is *addressed* in the plan. Do not re-analyze from scratch.
- **Sequential numbering**: Plan files use globally unique numbers across ALL directories. Scan `docs/plans/` and increment the highest.
- **Persistent artifacts**: Save the plan as `docs/plans/PLAN_*.md`. This skill is the sole creator — no other step writes to plan files.
- **Triage routing**: Minor gaps (missing doc refs, unclear wording) fix in-place. Significant gaps (unresolved assumptions, soundness risks) route back to grill-and-refine.

### Phase 4: Implementing — `implement-plan`
- **Verify gate status first**: Never start implementation unless Readiness Gate Results show all 7 ✅.
- **TDD: test before code**: Write a failing test → make it pass → refactor. Save all tests to `tests/` as permanent regression tests — never delete after the batch passes.
- **Batch by logical concern**: One complete feature per batch. Each batch must be independently testable. Never split a logical change across batches.
- **Flag every change**: Every changed line carries a flag: `[ADDED]` `[MODIFIED]` `[FIXED]` `[REMOVED]` `[MOVED]` with a short reason.
- **Simplicity first**: Minimum code that solves the problem. Nothing speculative. No abstractions for single-use code.
- **Surgical changes**: Touch only what the requirement demands. Preserve file-level `# Description:` comments — never delete them.
- **Verify locally per batch**: Run the batch's tests before moving to the next. Run full test suite + lint before hand-off.
- **Read plan file as read-only**: Never modify `docs/plans/PLAN_*.md`.

### Phase 5: Reviewing — `review-implementation`
- **Independent verification**: Re-run all checks from scratch. Never trust the implementer's self-test.
- **Only find problems, don't fix them**: Review and fix are separate stages. Report failures clearly and route backward.
- **Verify against plan**: Every item in the plan must be accounted for in the diff. Every success criterion must be met.
- **Second-pass differentiation**: After cleanup, verify all flags are `[CLEANUP]` only. Any non-CLEANUP flag signals a behavioral change — route back.

### Phase 6: Structuring & Cleaning — `modularize-and-clean`
- **Baseline before changes**: Run full test suite + lint before any structural change. Flag pre-existing failures — do not proceed until clean.
- **User approval gate**: Present cleanup candidates. Get explicit user approval before applying.
- **Coverage tests**: When extraction creates a new module, write coverage tests that verify the extracted logic works independently.
- **Adapt test imports**: Update import paths in test files. Never change test logic or assertions.
- **Change-log**: Produce a markdown change-log grouped by scope with `[CLEANUP]` entries for every changed line.

### Phase 7: Committing & Pushing — `push-to-git`
- **Group by logical concern**: A commit tells one complete story. Group files by purpose, not by file count or directory.
- **Present groups for confirmation**: Show proposed grouping to the user before staging anything.
- **Diff analysis over file names**: Analyze the staged diff, not just the file list, to write the commit message.
- **Push per commit**: Push after each commit, not after a batch. One failure blocks only one commit.

### Cross-Phase Universal Rules
- **Read before write**: Analysis and planning phases never modify files.
- **Exit declarations**: Every phase states what it produced, a verification result, and what runs next. Make the handoff explicit.
- **Cross-reference, don't duplicate**: Reference other docs instead of copying their content. A `[See ...](...)` is better than a duplicate.
- **Run full test suite after every change**: Not just the new test — all tests must pass before declaring done.
- **Preserve source description comments**: File-level `# Description:` headers are the canonical source for auto-extraction into ARCHITECTURE.md. Update them when behavior changes. Never delete them.

---

## Cross-References
- For **product boundaries** (out of scope, privacy hard constraints) → [SPECIFICATIONS.md](SPECIFICATIONS.md)
- For **API endpoints and WebSocket events** → [ARCHITECTURE.md — Data Flow](ARCHITECTURE.md#data-flow-technical)
- For **document routing and boundaries** → [DOCUMENT_GUIDELINES.md](DOCUMENT_GUIDELINES.md)
- For **skill pipeline details** → `.opencode/skills/<skill-name>/SKILL.md`

