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
- Technical reviewers evaluating the implementation

---

## Content Rules

### Quality Gates
Every piece of content must pass these four checks:

- **"Would a developer or agent miss this?" litmus test:** Every line must answer "Would a developer or agent likely miss this without help?" If not, leave it out.
- **Technical accuracy:** Every claim must be verifiable against actual source code — not inferred from filenames alone.
- **Executable sources of truth:** Prefer configs, scripts, and code over prose documentation. If docs conflict with code, trust the code.
- **Conciseness:** File tree gets ~10-word descriptions; per-function entries are one-line-only. Full detail belongs in source docstrings, not here.

### What to Include
- **Complete project file tree** — concise (1-line) descriptions per directory and key file for quick navigation.
- **Module Descriptions** — organized into subsections by type (Python, Frontend, Tests). Each entry: 1-sentence lead line, bullet points for key responsibilities and implementation details, and a per-function detail subsection (see Per-Function Detail Rules).
- **Data flow** — authoritative reference for all API endpoints (`METHOD /path`) and WebSocket events (event name, direction, payload).
- **Key design decisions** — include the *why*, not just the *what*. Technical rationale only.
- **Import structure and dependency graph** — how modules depend on each other, circular dependency prevention
- **Running instructions** — full technical startup sequence: env vars, configuration, service startup order, dependencies.
- **Modifying instructions** — how to add routes, events, extend functionality. "If you need to add X, here's how."
- **Critical implementation details** — match expiry logic, cleanup thread behavior, in-memory state management, default rooms, any non-obvious runtime behavior. Standalone section placed AFTER Module Descriptions.
- **Per-function detail** — every named function/class in every module with signature and one-line purpose. **This is a navigation map, not a manual.**

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start, troubleshooting |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | API endpoints, WebSocket events, module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product / Vision | Product vision, user journey, feature rationale, privacy model, design decisions (product), out-of-scope boundaries |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical | Demo walkthrough, testing scenarios, fallback options, reset instructions |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership policies, doc sync triggers, failure triage, cross-phase universal rules |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies, transferable patterns |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries (no dedicated skill) |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` instead of duplicating
- Summary here, details there — each document gets its appropriate level of detail; cross-reference for full content
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

---

> **Per-Function Detail Rules** → see [Workflow §1.75](#175-extract-per-function-details)

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
- What is the full technical startup sequence (env vars, config, service order)?

**Check session history for design rationale:** Review the current conversation for explanations of *why* a pattern was chosen, trade-offs discussed, and decisions made during debugging that reveal architectural intent. Capture only rationale — not session-specific debugging details.

**Ask the user** only when the codebase can't answer: ambiguous design intent, missing technical rationale. One short batch. Never ask what the code makes clear.

### 1.5 Extract Descriptions from Source Files

For every file in `app/` (recursive, skip `__pycache__/`), `frontend/src/` (recursive), `frontend/tests/` (recursive), and `tests/`:

```
Scan first 10 lines for pattern: /Description: (.+)/
```

This single regex matches all comment styles:
- `# Description: ...` (Python `#` comments)
- `// Description: ...` (TS/TSX `//` comments)
- `/* Description: ... */` (CSS `/* */` comments)
- `"""...Description: ..."""` (Python docstrings)

Also scan for filename-header patterns to find files where the description follows the standard two-line convention:
- `// filename.ext` on line 1, `// Description:` on line 2 (TS/TSX)
- `/* filename.ext */` on line 1, `/* Description: */` on line 2 (CSS)

**For each file, record:**
- `filename`: relative path (e.g., `app/routes.py`, `frontend/src/hooks/useTimer.ts`)
- `lead_line`: extracted `Description:` text
- `status`: `ok` (found), `missing` (no header), or `new` (file not in current ARCHITECTURE.md)

**Group into categories by directory:**
1. **Python Modules** — `app/*.py`
2. **Frontend (React SPA)** — `frontend/src/**/*.ts`, `frontend/src/**/*.tsx`
3. **Frontend Tests** — `frontend/tests/**/*.ts`, `frontend/tests/**/*.tsx`
4. **Backend Tests** — `tests/*.py`

Note: `frontend/index.html`, `frontend/vite.config.ts`, and `app/static/css/style.css` are standalone — add to Frontend Source category if they have a `Description:` header.

**Cross-reference against current Module Descriptions section:**
- File exists in both → mark for lead line update
- File exists in codebase but not in ARCHITECTURE.md → mark as `new`
- File exists in ARCHITECTURE.md but not in codebase → mark for removal
- File has no `Description:` header → mark as `missing`

### 1.75 Extract Per-Function Details

For every source file in `app/*.py`, `frontend/src/**/*.ts`, `frontend/src/**/*.tsx`, `frontend/tests/**/*.ts`, `frontend/tests/**/*.tsx`, and `tests/*.py`:

**Parse function declarations:**

| Language | Patterns to match |
|----------|------------------|
| Python | `def func_name(params):`, `async def func_name(params):`, `class ClassName:` |
| JavaScript / TypeScript | `function funcName(params) {`, `const funcName = (params) => {`, `const funcName = function(params) {`, `funcName: function(params) {` (object method), `funcName(params) {` (ES6 method shorthand), `async function funcName`, `const funcName = async`, `export function funcName(params)` |
| TSX Components | `export function ComponentName({` (function component), `const ComponentName: React.FC<Props> = ({` (typed component) |

- Skip: `__init__`, dunder methods, callbacks passed inline to event listeners (e.g., `.on('event', function() {...})`)
- Catch: anonymous functions assigned to module-level variables, nested named functions



**Capture decorator context** (2 lines above each `def`):
- `@app.route('METHOD /path')` → extract METHOD (GET/POST) + path
- `@router.websocket('/ws')` → extract WebSocket endpoint
- `@app.route(...)` with no explicit methods → default to GET

**Check each function for description:**
- **Python:** scan lines after `def:` for `"""..."""` (docstring). If no docstring exists, scan for a `# Description:` comment on the line immediately above the `def`.
- **JavaScript / TypeScript:** scan lines before `function` for `/** ... */` JSDoc block, `// Description:` comment, or `/* ... */` block comment. Prefer the closest comment above the function.
- **TSX Components:** if the function is a React component (named export with JSX return), scan for `// Description:` comment on the line above the component declaration.

**Record for each function:**
- `filename`: relative path
- `function_name`: exact name from declaration
- `params`: parameter list as written in source
- `route_context`: `METHOD /path` or WebSocket `event_name` (or empty)
- `description`: extracted docstring/comment first line (or `⚠️ Description: missing`)
- `is_class_method`: true/false

**For data-only modules** (no function declarations), extract differently:
- `state.py`: scan for `= {}` dict assignments and `= ` constant assignments → `#### Data Structures` + `#### Constants`
- `database.py`: parse `CREATE TABLE` SQL strings → `#### Tables` with column name + type + constraints
- `config/constants.ts` or `config.js`: scan for `CONFIG.* = ...` assignments or exported constants → `#### Configuration Constants`



**Store results** grouped by filename for use in Step 4.

### Per-Function Detail Rules (reference for Steps 1.75 and 4)

Every module entry in Module Descriptions gets a detail subsection. The type depends on the file's content:

| File type | Subsection heading | Content |
|-----------|-------------------|---------|
| Normal module with functions | `#### Functions` | Every function with signature + one-line purpose |
| Data-only module (state.py) | `#### Data Structures` | Dict/object shapes with key-value descriptions |
| | `#### Constants` | Named constants with values |
| DB schema module (database.py) | `#### Tables` | Full column listing (name, type, constraints) per table |
| Config-only module (config.js) | `#### Configuration Constants` | All CONFIG.* properties with values |

**Function entry format:**
```
- `function_name(param1, param2)` — one-line purpose (what it does for the system)
```

**Route handler format** (prepend HTTP method and path from decorator):
```
- `function_name()` — `METHOD /path` → one-line purpose
```

**Socket event handler format** (prepend event name from decorator):
```
- `function_name()` — WebSocket `event_name` → one-line purpose
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



**Where to place the subsection:**
- Insert immediately after the last existing bullet point of the module entry
- Preserve one blank line between the last bullet and the subsection heading
- Do NOT insert subsections for Template entries (`.html`) or CSS — they contain no functions

### 2. Read the Current Document
- Check if `docs/ARCHITECTURE.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated (wrong file tree, missing modules, stale endpoints)
- Flag missing items from **What to Include**
- Flag content that violates the boundary rules above

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
- Does the running instructions section cover the full startup sequence?

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed

**Module Descriptions — lead line auto-replacement:**

For each entry in the Module Descriptions section, match by **filename** (stable key):

```
Found: ### `app/routes.py` (HTTP Routes)
Key:   app/routes.py
```

If the entry exists:
- Replace the 2nd line (lead line text after the heading) with the extracted `Description:` from the source file
- Preserve all existing bullet points below — they contain implementation details not present in code headers
- Log diff: `"[diff] app/routes.py: 'old lead line' → 'new lead line'"`

If the entry is new (`Description:` found but not in ARCHITECTURE.md):
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
  __init__.py → state.py → database.py → config.py → schemas.py → routes.py → matchmaking.py → connection_manager.py → tasks.py → __main__.py

Frontend Source (config/utilities first, pages in user-flow order):
  vite.config.ts → main.tsx → App.tsx → config/constants.ts → types/api.ts → api/client.ts → utils/format.ts → utils/storage.ts → utils/random.ts → utils/demoData.ts → hooks/useSocket.ts → hooks/useTimer.ts → hooks/useDemoMode.ts → hooks/useUser.ts → context/SocketContext.tsx → context/UserContext.tsx → components/Timer.tsx → components/PersonCard.tsx → components/PromptCard.tsx → components/MatchCountdown.tsx → components/ConnectionCard.tsx → components/QRDisplay.tsx → pages/HomePage.tsx → pages/UserInfoPage.tsx → pages/RoomPage.tsx → pages/ChatPage.tsx

Frontend Tests (component first, then hooks, utils, context, pages):
  setup.ts → components/Timer.test.tsx → components/PersonCard.test.tsx → components/PromptCard.test.tsx → components/MatchCountdown.test.tsx → components/ConnectionCard.test.tsx → components/QRDisplay.test.tsx → hooks/useSocket.test.ts → hooks/useTimer.test.ts → hooks/useDemoMode.test.ts → utils/format.test.ts → utils/storage.test.ts → context/UserContext.test.tsx → pages/HomePage.test.tsx → pages/UserInfoPage.test.tsx → pages/RoomPage.test.tsx → pages/ChatPage.test.tsx → App.test.tsx

Backend Tests (breadth of coverage):
  test_app.py → test_js_modules.py → test_db.py
```

Files not in these lists are sorted alphabetically within their subsection.

**Critical Implementation Details — structural fix:**

If CIDs is currently nested inside the Module Descriptions section:
1. Move CIDs to a standalone `## Critical Implementation Details` section placed AFTER the full `## Module Descriptions` section
2. Add a `---` separator before and after

**Per-function subsections — auto-generation:**

For each module entry that has functions extracted in Step 1.75, insert or replace the `#### Functions` (or equivalent) subsection:

1. Insert the subsection after the last bullet point in the entry, with one blank line before `####`
2. List every function in the order they appear in the source file (top to bottom)
3. Format per the Per-Function Detail Rules above — one-line purpose only, no implementation logic
4. For data-only modules, use the appropriate subsection heading

Rules:
- If a `#### Functions` subsection already exists and source hasn't changed → leave it intact
- If a `#### Functions` subsection exists but source has changed → replace the entire subsection
- If no `#### Functions` subsection exists and source has functions → add it
- If functions were removed from source → remove their entries


**Other sections:**

**File tree — auto-sync descriptions from source:**

For every leaf-node entry in the Project Structure tree that has a `# ` inline description:
1. Look up the filename in the Step 1.5 extracted results
2. If the file has `status: ok` → replace the inline `# ` text with the extracted `lead_line`
3. If the file has `status: missing` → append `# ⚠️ Description: missing` after the filename
4. If the entry is new (file exists but not in tree) → add it to the correct position with `# {lead_line}`

Do NOT change existing entries whose source `Description:` hasn't changed (compare extracted lead_line to current inline text). Only update files where the description text differs.

**Other sections (updated manually against codebase):**
- Key functionalities, Data flow, Design decisions, Import structure, Running instructions, Modifying instructions: update manually against the codebase
- Keep language technical — internal logic, not user benefits
- Running instructions must cover the full startup sequence; README's quick-start links here

**Don't rewrite the entire document** — only update outdated or missing sections. The bullet points under each module entry are manually maintained. Only the `#### Functions` subsections and file-tree inline descriptions are auto-generated from source.

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All claims verified against executable sources (code, config, workflows), not just docs
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything a developer or agent doesn't need — no speculative, aspirational, or unverifiable content

**Auto-extraction checks:**
- [ ] All Module Descriptions lead lines match their source file's `Description:` header
- [ ] All Project Structure tree inline `#` descriptions match their source file's `Description:` header
- [ ] No source file with a `Description:` header is missing from the module entry list or Project Structure tree
- [ ] No entries remain for files that no longer exist in the codebase
- [ ] Every `missing` header was either added to the source file or has a `TODO`/fallback entry
- [ ] CIDs is a standalone section, not nested inside Module Descriptions

**Content checks:**
- [ ] Data flow includes all current API endpoints and WebSocket events — this is the authoritative table
- [ ] Design decisions include the *why* (technical rationale only)
- [ ] Running instructions cover the full startup sequence (env vars, config, dependencies, service order)
- [ ] Modifying instructions are accurate for the current codebase
- [ ] Critical implementation details are captured in a standalone section

**Per-function checks:**
- [ ] Every source file with functions has a `#### Functions` subsection (or appropriate data/schema equivalent)
- [ ] Every function declaration in source is represented exactly once
- [ ] Function entries are one-line purpose only — no implementation logic, no parameter details
- [ ] Function signatures match current source code — no stale entries
- [ ] Missing descriptions are flagged with `⚠️` marker — never invent descriptions
- [ ] Route handlers include correct HTTP method + path from decorators
- [ ] Socket event handlers include correct event name from decorator
