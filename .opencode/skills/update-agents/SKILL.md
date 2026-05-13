---
name: update-agents
description: Analyze the current codebase and update `AGENTS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agents", "sync agents doc", "agents.md is outdated", or similar.
---

## Purpose
Guide for updating `docs/AGENTS.md` — the authoritative reference for agent behavioral rules, file ownership, commands, and operational constraints. Answers "What can agents touch?", "What commands do I use?", "What are my behavioral rules?".

Analyze the codebase and session history, then update or create `docs/AGENTS.md` so agents can operate accurately on every task.

---

## Audience
- AI agents (e.g., opencode)
- Developers setting up agent permissions

---

## Content Rules

### Quality Gates
Every piece of content must pass these checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **Executable sources of truth:** Prefer configs, scripts, and CI files over prose documentation. If docs conflict with executable sources, trust the executable source.
- **Simple-repo handling:** If the repo is simple, keep the file simple. When in doubt, omit.

### What to Include
- Project overview (1 paragraph + key functionalities summary)
- Architecture summary + entrypoints — key components and where the app starts, enough to navigate; 3-5 lines maximum. Full detail goes in `ARCHITECTURE.md`.
- Environment setup — **agent-specific only**: non-interactive invocation, headless env vars, Python version, venv activation. User-facing install steps go in `README.md`.
- File ownership table — location, role, agent policy (✅ safe / ⚠️ caution / ❌ forbidden). Every entry must include a policy column — file names alone are not enough.
- Core commands (setup + test commands with exact syntax)
- Agent behavioral rules organized by workflow phase — explicit always/never directives, no "consider" or "try to". Verification requirements embedded within each phase's rules, not in a separate section.
- Cross-references — `ARCHITECTURE.md`, `SPECIFICATIONS.md`, and any other docs an agent should consult. Cross-reference instead of duplicating content.

### What NOT to Include

| Document | Routes content about | Audience | Content Type |
|----------|---------------------|----------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product, pitch, vision, spec, privacy |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints ✅ | AI agents | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Meta, governance |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating
- Summary here, details there — AGENTS.md gets navigation-level behavioral rules; other docs get full detail
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- If content belongs elsewhere, note with `→ Redirect to <filename>` — do not include it
- No generic advice, speculative claims, or unverifiable assertions

---

## Workflow

### 1. Investigate the Codebase
Read in priority order:

1. Project manifests (`README*`, `package.json`, `pyproject.toml`, lockfiles, workspace config)
2. Build, test, lint, typecheck, and CI configs
3. Existing `AGENTS.md`, `ARCHITECTURE.md`, `SPECIFICATIONS.md`
4. Representative source files — entrypoints and wiring (only if architecture is still unclear)

For each source, extract items from **What to Include** — files, commands, env vars, boundaries, gotchas.

**Ask the user** only when the repo can't answer: undocumented team conventions, missing prereqs. One short batch. Never ask what the repo makes clear.

### 2. Read the Current Document
- Check if `docs/AGENTS.md` exists — create if not
- Read section by section; flag outdated or missing items from **What to Include**

### 3. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?
For each existing section: does it belong here per **What NOT to Include**? If not → redirect.

### 4. Update the Document
- Add missing sections, fix outdated content
- Redirect out-of-scope content per **What NOT to Include**
- Don't rewrite the entire document — only update what's changed
- Keep concise — agents read the full file on every task

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] File ownership table covers all current files with explicit policies (✅ / ⚠️ / ❌)
- [ ] All commands are accurate and runnable with exact syntax
- [ ] Framework/toolchain quirks captured if present
- [ ] Architecture summary is 3-5 lines maximum — full detail cross-referenced to `ARCHITECTURE.md`
- [ ] Cross-references to `ARCHITECTURE.md` and `SPECIFICATIONS.md` are accurate
- [ ] Agent behavioral rules are imperative — "always/never", not "consider"
- [ ] Every line passes the "Would an agent miss this?" litmus test
- [ ] All content verified against executable sources, not just docs
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise enough for an agent to read 