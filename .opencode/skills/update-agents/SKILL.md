---
name: update-agents
description: Analyze the current codebase and update `AGENTS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agents", "sync agents doc", "agents.md is outdated", or similar.
---

## Purpose
AI agent operational guidelines for the project. Answers "What can agents touch?", "What commands do they use?", "What are they forbidden from doing?".

Analyze the codebase and session history, then update or create `docs/AGENTS.md` so agents can operate accurately on every task.

---

## Audience
- AI agents (e.g., opencode)
- Developers setting up agent permissions

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **Executable sources of truth:** Prefer configs, scripts, and CI files over prose documentation. If docs conflict with executable sources, trust the executable source. Only keep what you can verify.
- **Simple-repo handling:** If the repo is simple, keep the file simple. Don't force complexity onto a straightforward project. When in doubt, omit.

### What to Include
- Project overview (1 paragraph + key functionalities summary)
- Architecture summary + entrypoints — key components and where the app starts, enough to navigate; full detail goes in `ARCHITECTURE.md`
- Environment setup (Python version, venv, production env vars)
- File ownership table — location, role, agent policy (✅ safe / ⚠️ caution / ❌ forbidden), not just file names
- Core commands (setup + test commands)
- Command ordering — when sequence matters (e.g., `lint → typecheck → test`)
- Agent rules — explicit always/never, no "consider" or "try to"
- Verification requirements — what must pass before a task is done
- Framework/toolchain quirks — generated code, migrations, codegen, build artifacts, dev servers, special env loading, infra deploy flow
- Testing quirks — fixtures, integration prereqs, snapshot workflows, required services, flaky/expensive suites
- Repo-specific style conventions that differ from language/framework defaults
- API endpoints + WebSocket events tables
- Out of scope — explicit forbidden implementations, not suggestions
- Privacy requirements — hard constraints only, not guidelines
- References to other instruction sources — list of docs an agent should consult for deeper context on specific topics

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints ✅ | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in AGENTS.md:**
- Generic software advice
- Long tutorials or exhaustive file trees
- Obvious language/framework conventions (e.g., "Python uses .py files")
- Speculative claims or anything unverifiable against the codebase
- Content that belongs in another file (use cross-reference instead)

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating
- Summary here, details there — AGENTS.md gets navigation-level; other docs get full detail
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `AGENTS.md`.

---

## Workflow

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. `README*`, root manifests (`package.json`, `pyproject.toml`, etc.), workspace config, lockfiles
2. Build, test, lint, formatter, typecheck, and codegen config
3. CI workflows, pre-commit / task runner config
4. Existing `AGENTS.md`, repo-local opencode config (`opencode.json`)
5. If architecture is still unclear — inspect a small number of representative code files to find entrypoints, package boundaries, and execution flow, preferring files that wire the system together over random leaf files

For each source, look for items listed in **What to Include** above — files, commands, command order, boundaries, endpoints, env vars, toolchain quirks, testing quirks, style conventions, gotchas, and failure modes.

**Asking the user:** Only ask if the repo cannot answer something important. Good topics: undocumented team conventions (branch/PR/release expectations), missing setup/test prereqs known but not written down. Limit to one short batch. Never ask about anything the repo already makes clear.

### 2. Read the Current Document
- Check if `docs/AGENTS.md` exists — create it if not
- Read existing content section by section
- Flag outdated content (wrong commands, missing files, stale endpoints)
- Flag missing items from **What to Include**

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current document? Is it accurate against the codebase?
- Does the file ownership table reflect all current files with correct policies?
- Do API endpoint and WebSocket tables match the codebase?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Don't rewrite the entire document — only update outdated or missing sections
- Keep it concise — agents read the entire file on every task

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] If content spans multiple purposes, split appropriately
- [ ] File ownership table covers all current files with explicit policies
- [ ] All commands are accurate and runnable — command order documented where it matters
- [ ] Framework/toolchain quirks captured if present
- [ ] Testing quirks documented if present
- [ ] API endpoints and WebSocket events match the codebase
- [ ] Agent rules are imperative — no vague language
- [ ] Out of scope list covers all forbidden implementations
- [ ] Privacy requirements are hard constraints, not guidelines
- [ ] Every line passes the "Would an agent miss this?" litmus test
- [ ] All content verified against executable sources, not just docs
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise enough for an agent to read entirely on each task
