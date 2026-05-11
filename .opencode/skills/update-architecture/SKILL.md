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
  - Each entry: 1-sentence **lead line** extracted from source code's `Description:` header, then **bullet points** for key responsibilities and implementation details, then a **`#### Functions` subsection** for per-function detail (see Step 1.75)
  - Lead lines are auto-sourced from code comments — see Workflow Step 1.5 for extraction
  - Per-function details are auto-extracted from source code declarations and docstrings — see Workflow Step 1.75 for extraction
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
- Summary here, details there — file tree gets ~10-word descriptions; Module Descriptions gets the full lead line + bullets + per-function detail
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `ARCHITECTURE.md`.

---

### Per-Function Detail Rules

Every module entry in Module Descriptions gets a detail subsection. The type depends on the file's content:

| File type | Subsection heading | Content |
|-----------|-------------------|---------|
| Normal module with functions | `#### Functions` | Every function with signature + description |
| Data-only module (state.py) | `#### Data Structures` | Dict/object shapes with key-value descriptions |
| | `#### Constants` | Named constants with values |
| DB schema module (database.py) | `#### Tables` | Full column listing (name, type, constraints) per table |
| Config-only module (config.js) | `#### Configuration Constants` | All CONFIG.* properties with values |

**Function entry format:**
```
- `function_name(param1, param2)` — one-line description
```

**Route handler format** (prepend HTTP method and path from decorator):
```
- `function_name()` — `METHOD /path` → description
```

**Socket event handler format** (prepend event name from decorator):
```
- `function_name()` — SocketIO `event_name` → description
```

**Missing description format** (flag, never invent):
```
- `function_name()` — `⚠️ Description: missing`
```

**Data structure format:**
```
- `name = {}` — `{key: {nested_key: type, ...}}` — purpose
```

**Constant format:**
```
- `NAME = value` — purpose / where it's used
```

**Table format:**
```
| Table | Columns |
|-------|---------|
| `name` | `col` (TYPE PK/FK), `col` (TYPE DEFAULT val) |
```

**Initialization note format** (for JS files with DOMContentLoaded wrappers that wire UI state):
```
*Behavior summary (wired in DOMContentLoaded):* description of key input/button state listeners
```

**Where to place the subsection:**
- Insert immediately after the last existing bullet point of the module entry
- Preserve one blank line between the last bullet and the subsection heading
- Do NOT insert subsections for Template entries (`.html`) or CSS — they contain no functions
- For initialization notes: place as an italic `*note*` line immediately after the `#### Functions` list (or at the end of the module entry if there are no named functions and the init logic is significant)

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

### 1.75 Extract Per-Function Details

For every source file in `app/*.py`, `app/static/js/*.js`, and `tests/*.py`:

**Parse function declarations:**

| Language | Patterns to match |
|----------|------------------|
| Python | `def func_name(params):`, `async def func_name(params):`, `class ClassName:` |
| JavaScript | `function funcName(params) {`, `const funcName = (params) => {`, `const funcName = function(params) {`, `funcName: function(params) {` (object method), `funcName(params) {` (ES6 method shorthand), `async function funcName`, `const funcName = async` |

- Skip: `__init__`, dunder methods, callbacks passed inline to event listeners (e.g., `.on('event', function() {...})`)
- Catch: anonymous functions assigned to module-level variables, nested named functions

**Extract initialization behavior from DOMContentLoaded wrappers** (JS files only):
- After parsing all named functions, check if the file has a `DOMContentLoaded` wrapper
- If yes, scan inside it for key `addEventListener` calls that wire UI state management:
  - Input → button enable/disable: `element.disabled = !this.value.trim()`
  - Button clicks that trigger page navigation or API calls
  - Socket event listeners wired outside named functions
- Skip trivial listeners (e.g., `console.log` only, focus calls)
- Record a prose summary of the initialization behaviors

**Capture decorator context** (2 lines above each `def`):
- `@app.route('METHOD /path')` → extract METHOD (GET/POST) + path
- `@socketio.on('event_name')` → extract event name
- `@app.route(...)` with no explicit methods → default to GET

**Check each function for description:**
- **Python:** scan lines after `def:` for `"""..."""` (docstring). If no docstring exists, scan for a `# Description:` comment on the line immediately above the `def`.
- **JavaScript:** scan lines before `function` for `/** ... */` JSDoc block, `// Description:` comment, or `/* ... */` block comment. Prefer the closest comment above the function.

**Record for each function:**
- `filename`: relative path (e.g., `app/routes.py`)
- `function_name`: exact name from declaration
- `params`: parameter list as written in source
- `route_context`: `METHOD /path` or SocketIO `event_name` (or empty)
- `description`: extracted docstring/comment first line (or `⚠️ Description: missing`)
- `is_class_method`: true/false

**For data-only modules** (no function declarations), extract differently:
- `state.py`: scan for `= {}` dict assignments and `= ` constant assignments → `#### Data Structures` + `#### Constants`
- `database.py`: parse `CREATE TABLE` SQL strings → `#### Tables` with column name + type + constraints
- `config.js`: scan for `CONFIG.* = ...` assignments → `#### Configuration Constants`

**Record initialization behavior** for JS files with DOMContentLoaded wrappers:
- `filename`: relative path
- `behavior_summary`: prose description of key DOMContentLoaded initialization (e.g., "join button disabled until 8-char code entered; create button disabled until name entered")
- If no significant initialization behavior is found, leave empty

**Store results** grouped by filename for use in Step 4 (Update the Document).

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

**Per-function subsections — auto-generation:**

For each module entry that has functions extracted in Step 1.75, insert or replace the `#### Functions` (or equivalent) subsection:

1. Insert the subsection after the last bullet point in the entry, with one blank line before `####`
2. List every function in the order they appear in the source file (top to bottom)
3. Format per the "Per-Function Detail Rules" section above
4. For data-only modules (state.py, config.js, database.py), use the appropriate subsection heading (`#### Data Structures`, `#### Constants`, `#### Configuration Constants`, `#### Tables`)

Rules:
- If a `#### Functions` subsection already exists and source hasn't changed → leave it intact
- If a `#### Functions` subsection exists but source has changed → replace the entire subsection
- If no `#### Functions` subsection exists and source has functions → add it
- If functions were removed from source → remove their entries from the subsection
- If initialization behavior was recorded (DOMContentLoaded wiring), append a `*note*` line after the Functions list using the initialization note format
- If the initialization note already exists and behavior hasn't changed → leave it intact
- If the initialization note exists but behavior changed → replace it

**Other sections (not auto-generated):**
- File tree: keep as concise navigation. Update directory entries to match actual structure. Verify descriptions don't contradict Module Descriptions lead lines.
- Key functionalities, Data flow, Design decisions, Import structure, Running instructions, Modifying instructions: update manually against the codebase
- Keep language technical — internal logic, not user benefits

**Don't rewrite the entire document** — only update outdated or missing sections. The bullet points under each module entry are manually maintained and should not be auto-regenerated. Only the `#### Functions` subsections are auto-generated.

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

**Per-function checks:**
- [ ] Every source file with functions has a `#### Functions` subsection (or `#### Data Structures` / `#### Constants` / `#### Tables` / `#### Configuration Constants` for data-only modules)
- [ ] Every function declaration in source is represented exactly once in the subsection
- [ ] Function signatures match current source code — no stale entries
- [ ] Missing descriptions are flagged with `⚠️` marker — never invent descriptions
- [ ] Route handlers include correct HTTP method + path from decorators
- [ ] Socket event handlers include correct event name from decorator
- [ ] No function entries remain for functions that no longer exist in source
- [ ] Subsection type matches file content (Functions for code, Data Structures/Constants for data, Tables for DB schema, Configuration Constants for config)
- [ ] Functions listed in source order (top to bottom within file)

**Initialization behavior checks:**
- [ ] JS files with DOMContentLoaded wrappers have an initialization note if they wire significant UI state (button enable/disable, input validation)
- [ ] Initialization notes describe key `addEventListener` wiring, not trivial setup
- [ ] Notes use the `*italic note*` format placed after the Functions list
