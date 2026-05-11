---
name: update-architecture
description: Analyze the current codebase and update `ARCHITECTURE.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update architecture", "sync architecture doc", "architecture is outdated", or similar.
---

## Purpose
Technical structure reference for the project. Answers "How is it built?", "What are the modules?", "How do I modify it?".

Analyze the codebase and session history, then update or create `docs/ARCHITECTURE.md` so developers and AI agents have an accurate technical reference for making code changes.

---

## Audience
- Developers working on the codebase
- AI agents making code changes
- Technical reviewers

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **Technical accuracy:** Every claim must be verifiable against actual source code — not inferred from filenames alone.
- **Executable sources of truth:** Prefer configs, scripts, and code over prose documentation. If docs conflict with code, trust the code.

### What to Include
- **Complete project file tree** — concise (1-line) descriptions per directory and key file for quick navigation. Full detail goes in Module Descriptions.
- **Module Descriptions** — organized into 4 subsections:
  - **Python Modules** — all `app/*.py` files (excluding `__pycache__`)
  - **Frontend Modules** — all `app/static/js/*.js` files
  - **Templates** — all `app/templates/*.html` files
  - **Tests** — all `tests/*.py` files
  - Each entry: 1-sentence **lead line** extracted from source code's `Description:` header, then **bullet points** for key responsibilities and implementation details
  - Lead lines are auto-sourced from code comments — see Workflow Step 1.5 for extraction
- Key functionalities list — technical focus on what the code does, not why users want it
- Data flow — MUST include API endpoints (e.g., `POST /api/events`) and WebSocket events with direction and payload
- Key design decisions — include the *why*, not just the *what*
- Import structure and dependency graph between modules
- Running instructions (technical: env vars, startup sequence)
- Modifying instructions — how to add routes, events, extend functionality
- Critical implementation details (match expiry, default rooms, cleanup thread, in-memory state, etc.) — as a standalone section after Module Descriptions, NOT nested inside it

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow ✅ | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in ARCHITECTURE.md:**
- User-facing benefits or marketing language
- Product vision, pitch, or user journey narrative
- Demo walkthrough or presentation steps
- AI agent permissions or operational rules

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See README.md](README.md)` for user-facing setup instead of duplicating
- Summary here, details there — file tree gets ~10-word descriptions; Module Descriptions gets the full lead line + bullets
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `ARCHITECTURE.md`.

---

## Workflow

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. Source code files — entrypoints, route definitions, module structure
2. `README*`, root manifests (`package.json`, `pyproject.toml`, etc.), lockfiles, workspace config
3. Build, test, lint, formatter, typecheck, and codegen config
4. CI workflows, pre-commit / task runner config
5. Existing `ARCHITECTURE.md`, repo-local opencode config (`opencode.json`)

For each source, extract:
- What modules exist and what does each do?
- What are all current API endpoints and WebSocket events?
- What are the import dependencies between modules?
- What critical implementation details exist (expiry logic, thread behavior, in-memory state)?
- What design decisions are visible in the code structure?
- What are the modifying patterns (how to add a route, event, etc.)?

**Check session history for design rationale:** Review the current conversation for explanations of *why* a pattern was chosen, trade-offs discussed, and decisions made during debugging that reveal architectural intent. Capture only rationale — not session-specific debugging details.

### 1.5 Extract Descriptions from Source Files

For every file in `app/` (recursive, skip `__pycache__/`) and `tests/`:

```
Scan first 10 lines for pattern: /Description: (.+)/
```

This single regex matches all three comment styles:
- `# Description: ...` (Python `#` comments)
- `// Description: ...` (JS `//` comments)
- `{# Description: ... #}` (Jinja2 `{# #}` comments)
- `"""...Description: ..."""` (Python docstrings — also captured since `Description:` appears on its own line within the docstring)

**For each file, record:**
- `filename`: relative path (e.g., `app/routes.py`)
- `lead_line`: extracted `Description:` text
- `status`: `ok` (found), `missing` (no header), or `new` (file not in current ARCHITECTURE.md)

**Group into 4 categories by directory:**
1. **Python Modules** — `app/*.py`
2. **Frontend Modules** — `app/static/js/*.js`
3. **Templates** — `app/templates/*.html`
4. **Tests** — `tests/*.py`

**Cross-reference against current Module Descriptions section:**
- File exists in both → mark for lead line update
- File exists in codebase but not in ARCHITECTURE.md → mark as `new`
- File exists in ARCHITECTURE.md but not in codebase → mark for removal
- File has no `Description:` header → mark as `missing`

### 2. Read the Current Document
- Check if `docs/ARCHITECTURE.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated (wrong file tree, missing modules, stale endpoints)
- Flag missing items from **What to Include**

### 3. Identify Gaps and Issues

**From Investigation Step 1.5:**
- Files marked `new` → need entries added
- Files marked `missing` → flag for manual fix or generate fallback entry from directory/purpose
- Files marked for removal → remove their entries
- Files with stale lead lines → update lead line from extraction
- If Critical Implementation Details is nested inside Module Descriptions → move to standalone section

**From document review:**
- Is the file tree current? Are all directories described?
- Does the data flow reflect all current endpoints and events?
- Do bullets reference functions or variables that no longer exist?

### 4. Update the Document

**Module Descriptions — lead line auto-replacement:**

For each entry in the Module Descriptions section, match by **filename** (stable key — the `` `path/file.ext` `` in the heading):

```
Found: ### `app/routes.py` (HTTP Routes)
Key:   app/routes.py
```

If the entry exists:
- Replace the 2nd line (lead line text after the heading) with the extracted `Description:` from the source file
- Preserve all existing bullet points below — they contain implementation details not present in code headers
- Log diff: `"[diff] app/routes.py: 'old lead line' → 'new lead line'"`

If the entry is new (`/Description:` found but not in ARCHITECTURE.md):
- Add it to the correct subsection in the correct position
- Lead line = extracted `Description:` text
- Add a `- TODO: add bullet points` note so manual detail can be filled in

If the file is deleted (in ARCHITECTURE.md but not in codebase):
- Remove the entry entirely
- Log: `"[REMOVED] app/obsolete.py — entry deleted (file no longer exists)"`

If `Description:` is missing from the source file:
- Do NOT remove the entry — leave existing lead line intact
- Add a `<!-- MISSING: app/somefile.py has no Description: header in source -->` comment above the entry
- Log: `"[MISSING] app/somefile.py has no Description: header — please add one"`

**File ordering within each subsection (strict):**

```
Python Modules (dependency order):
  __init__.py → state.py → database.py → routes.py → matchmaking.py → socket_events.py → tasks.py → __main__.py

Frontend Modules (config/utilities first, page controllers in user flow order):
  config.js → utils.js → dom-utils.js → api-utils.js → timer-utils.js → home.js → user-info.js → room.js → chat.js

Templates (user flow order):
  index.html → user_info.html → room.html → chat.html

Tests (breadth of coverage):
  test_app.py → test_js_modules.py → test_db.py
```

Files not in these lists are sorted alphabetically within their subsection.

**Critical Implementation Details — structural fix:**

If CIDs is currently nested inside the Module Descriptions section (between route and matchmaking entries):
1. Move CIDs to a standalone `## Critical Implementation Details` section placed AFTER the full `## Module Descriptions` section
2. Add a `---` separator before and after

**Other sections (not auto-generated):**
- File tree: keep as concise navigation. Update directory entries to match actual structure. Verify descriptions don't contradict Module Descriptions lead lines.
- Key functionalities, Data flow, Design decisions, Import structure, Running instructions, Modifying instructions: update manually against the codebase
- Keep language technical — internal logic, not user benefits

**Don't rewrite the entire document** — only update outdated or missing sections. The bullet points under each module entry are manually maintained and should not be auto-regenerated.

### 5. Verify

**Auto-extraction checks:**
- [ ] All Module Descriptions lead lines match their source file's `Description:` header
- [ ] No source file with a `Description:` header is missing from the module entry list
- [ ] No entries remain for files that no longer exist in the codebase
- [ ] Every `missing` header was either added to the source file or has a `TODO`/fallback entry
- [ ] Lead line changes were logged as diffs for confirmation
- [ ] Entries follow the defined ordering within each subsection
- [ ] CIDs is a standalone section, not nested inside Module Descriptions

**Content checks:**
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] File tree descriptions don't contradict Module Descriptions lead lines
- [ ] Data flow includes all current API endpoints and WebSocket events
- [ ] Design decisions include the *why*, not just the *what*
- [ ] Modifying instructions are accurate for the current codebase
- [ ] Critical implementation details are captured
- [ ] Bullet points reference current functions/variables — flag stale ones without auto-removing
- [ ] Every claim verified against executable sources, not just docs
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise enough — no unnecessary detail, but all critical technical information is included
