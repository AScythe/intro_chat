# Universal Project Best Practices

> Derived from real-world debugging - applies to ALL projects

**Conciseness Rule**: Keep all descriptions 50% shorter than verbose explanations.
- ❌ Bad: "We encountered a problem where the indentation was incorrect in the __init__.py file which caused a syntax error"
- ✅ Good: "Indentation errors in `__init__.py` — verify after edits"

---

## 1. Modularization Techniques

### 1.1 Module Responsibility Pattern
**Context**: From `app/` package structure (1 line per file)

**Principle**: 1 module = 1 responsibility. Leaf modules (state.py, database.py) export only, never import from internal modules.

**Example**:
```
app/
├── __init__.py    # Orchestrator ONLY: init, wire modules
├── state.py       # Shared state & constants ONLY (leaf module)
├── database.py    # DB schema ONLY (leaf module)
├── routes.py      # HTTP endpoints ONLY
├── matchmaking.py # Business logic ONLY
└── tasks.py      # Background jobs ONLY
```

**Why it matters**: Clear ownership, no mixed concerns, easy to navigate.

### 1.2 Circular Import Prevention
**Context**: From fixing import errors in `matchmaking.py`

**Principle**: Leaf module pattern: `state.py`, `database.py` export only. Internal modules import from leafs, never sibling-to-sibling.

**Example**:
```python
# ✅ Good - from project:
from .state import active_users      # Import from leaf
from .matchmaking import find_match  # Import from sibling

# ❌ Bad:
# from .routes import something  ← This causes circular!
```

**Why it matters**: Your `app/` package has ZERO circular import errors.

### 1.3 Separation of Concerns
**Context**: From debugging mixed-state-logic bugs

**Principle**: Separate by layer: config → state → logic → presentation → persistence.

**Example**:
```
Configuration  → config.py / state.py (constants)
State         → state.py / models.py (in-memory)
Logic         → services.py / matchmaking.py (business rules)
Presentation  → templates/ / UI layer
Persistence   → database.py / repository layer
```

**Why it matters**: Changes in one layer don't break others.

### 1.4 Frontend Modularization
**Context**: From `app/static/js/` structure

**Principle**: 1 JS file = 1 purpose. Centralize shared code in `utils.js`, page-specific in `page.js`.

**Example**:
```
app/static/js/
├── config.js        # Central config ONLY (CHAT_DURATION)
├── utils.js         # Shared utilities ONLY (showError)
├── dom-utils.js     # DOM helper functions ONLY
├── api-utils.js     # API calls ONLY (fetchJSON)
├── timer-utils.js   # Timer functions ONLY (createChatTimer)
├── home.js          # Homepage logic ONLY
├── user-info.js     # User profile page logic ONLY
├── room.js          # Room page logic ONLY
└── chat.js          # Chat page logic ONLY
```

**Why it matters**: No 500-line monoliths, easy to find functionality.

### 1.5 Module Communication
**Context**: From tracing import chains in `app/` package

**Principle**: Internal modules import from leaf modules only. Never sibling-to-sibling.

**Example**:
```
routes.py → imports from → state.py, database.py, matchmaking.py
matchmaking.py → imports from → state.py, database.py
```

**Why it matters**: Predictable dependency graph, no circular imports.

### 1.6 When to Split a Module
**Context**: From debugging sessions with large files

**Principle**: Split triggers: >200 lines, mixed concerns, circular imports, parallel dev conflicts.

**Example**: Your `routes.py` (181 lines) stays single-purpose: HTTP endpoints ONLY. Business logic → `matchmaking.py`.

**Why it matters**: File stays maintainable, merge conflicts reduced. Business logic → `matchmaking.py`.

---

## 2. Configuration
**Context**: From fixing hardcoded URLs in QR code generation

**Principle**: Centralize config. Never hardcode. Use config files, env vars.

**Example**:
```python
# ❌ Bad
qr.add_data(f"http://localhost:5000/room/{id}")
# ✅ Good
qr.add_data(f"http://localhost:{Config.PORT}/room/{id}")
```

**Why it matters**: Change once, apply everywhere.

---

## 3. Error Handling
**Context**: From debugging API failures

**Principle**: Defense in depth: Validate input → try/except → graceful degradation.

**Example**:
```python
if not input: return {'error': 'No data'}, 400
try: result = api_call()
except: return {'error': 'Service unavailable'}, 503
```

**Why it matters**: Users get clear errors, not 500 pages.

---

## 4. State Management
**Context**: From fixing 404 errors after server restart

**Principle**: In-memory (fast, volatile) + Persistent (survives restart). Always recover.

**Example**:
```python
if user_id not in active_users:
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    active_users[user_id] = user  # Restore
```

**Why it matters**: Zero data loss on restart.

---

## 5. Testing
**Context**: From catching syntax errors post-edit

**Principle**: Test after every change. Syntax check + test suite.

**Example**:
```bash
python -c "from app import app"  # Syntax check
python -m pytest tests/ -v      # Full suite
```

**Why it matters**: Catch errors before they reach production.

---

## 6. Documentation

### 6.1 One Purpose Per Document
**Context**: From confusion about where content belongs

**Principle**: One document = one purpose. Define each document by the questions it answers. If content answers a different question than the document's purpose, it belongs elsewhere.

**Example**:
| Document | Answers |
|----------|---------|
| README.md | "What is it?", "How do I use it?" |
| ARCHITECTURE.md | "How is it built?", "How do I modify it?" |
| SPECIFICATIONS.md | "Why does it exist?", "What problem does it solve?" |
| DEMO_GUIDE.md | "How do I demonstrate this?" |
| AGENTS.md | "What can agents touch?", "What commands do they use?" |
| PROJECT_BEST_PRACTICES.md | "What lessons were learned?", "What patterns should I reuse?" |
| DOCUMENT_GUIDELINES.md | "Where does this content go?" |

**Why it matters**: Clear purpose prevents content overlap. If two documents answer the same question, one is redundant.

### 6.2 Key Differentiator Per Document
**Context**: From designing boundaries for a 7-doc documentation set

**Principle**: Every document needs a one-line "Key Differentiator" that captures what makes it unique. Bold it. Contrast it against its closest sibling document to prevent ambiguity.

**Example**:
- ARCHITECTURE.md = "**Implementation over vision**" (contrasts with SPECIFICATIONS.md which is "**Vision over implementation**")
- AGENTS.md = "**Operational constraints over technical structure**" (contrasts with ARCHITECTURE.md)
- README.md = "**User-facing benefits over implementation**" (contrasts with ARCHITECTURE.md)
- PROJECT_BEST_PRACTICES.md = "**Universal over project-specific**" (contrasts with every other doc)

**Why it matters**: When documents have similar scope, a single bold differentiator removes all ambiguity about where content goes.

### 6.3 Quality Gates Before Content
**Context**: From restructuring 6 skill files that lacked inclusion filters

**Principle**: Define "What qualifies for inclusion?" before writing any content. Three universal gates apply to most documentation:

1. **Litmus test**: "Would an agent miss this without help?" — filters noise
2. **Executable truth**: "Can I verify this against code/config/scripts?" — filters speculation
3. **Conciseness**: "Can I say this in half the words?" — filters fluff

**Example**:
```markdown
# Before applying gates (would be rejected):
We decided to use Flask because it's a popular Python web framework.

# After applying gates:
Tech stack: Flask + SocketIO. Why Flask? Lightweight, real-time capable.
```
The "popular" claim is speculative (gate 2), and the sentence is fluff (gate 3).

**Why it matters**: Prevents documentation bloat before it happens. Easier to filter upfront than edit later.

### 6.4 Routing Table Over Decision Tree
**Context**: From replacing text-based decision trees in 6 skill files with a single table

**Principle**: A routing table with a "Routes content about" column is more scannable and actionable than a text-based decision tree. Readers scan tables faster than nested trees, and the "about" column is directly actionable — you match your content to the description.

**Example**:
| Document | Routes content about |
|----------|---------------------|
| README.md | User-facing setup, usage, features, benefits, installation |
| ARCHITECTURE.md | Technical structure, modules, file tree, implementation, data flow |
| SPECIFICATIONS.md | Product vision, user journey, problem statement, pitch |
| DEMO_GUIDE.md | Demo presentation, walkthrough, step-by-step instructions |
| AGENTS.md | AI agent permissions, rules, file ownership, operational constraints |

**Why it matters**: Faster routing decisions. One table replaces multiple decision trees and is easier to update.

### 6.5 Document Boundary Tensions
**Context**: From discovering 7 overlap points between documents that could confuse content routing

**Principle**: When documents touch, explicitly document the tension and its resolution. Don't let "this could go in either place" ambiguity persist — it causes inconsistent documentation.

**Example**:
```
Tension: API endpoints in AGENTS.md vs ARCHITECTURE.md
Resolution: AGENTS.md gets a reference table (method, path, purpose) for quick agent lookup.
           ARCHITECTURE.md gets the data flow context — how endpoints interact,
           request/response details, event sequences.

Tension: Product decisions in SPECIFICATIONS.md vs Design decisions in ARCHITECTURE.md
Resolution: SPECIFICATIONS.md = vision rationale ("why anonymous?")
           ARCHITECTURE.md = technical rationale ("why SQLite?")
```

**Why it matters**: Removes decision paralysis. Anyone can resolve the routing question in seconds.

### 6.6 Comments-First Documentation
**Context**: From syncing ARCHITECTURE.md lead lines with source code headers

**Principle**: Write standardized `Description:` headers in source code as the canonical description for each file. Auto-extract into documents rather than authoring descriptions separately in both places.

**Example**:
```python
# database.py
# Description: SQLite database initialization creating events, users, rooms, and matches tables with migration handling
# ====
```
Then ARCHITECTURE.md extracts the lead line from the comment — no manual duplication.

**Why it matters**: Single source of truth. Descriptions stay accurate because they live next to the code they describe.

### 6.7 Lead Line + Bullets Split
**Context**: From designing Module Descriptions in ARCHITECTURE.md

**Principle**: In module reference docs, split each entry into two parts: an auto-generated 1-sentence lead line (extracted from source comments) and manually maintained bullet points (implementation details not in code headers). Never regenerate bullets — they contain context that can't be inferred from code alone.

**Example**:
```markdown
### `app/routes.py` (HTTP Routes)
[auto-generated lead line from source]
- `register_routes(app)` — registers all @app.route handlers  [manually maintained]
- Endpoints: /, /join/<event_id>, ...                          [manually maintained]
```

**Why it matters**: Prevents automation from overwriting hard-won implementation context while keeping the headline always in sync.

### 6.8 Strict Subsection Ordering
**Context**: From fixing Frontend Modules ordering in ARCHITECTURE.md

**Principle**: Within each doc subsection, define explicit ordering (dependency → utility → user flow) rather than alphabetical or arbitrary. Prevents ordering chaos when auto-generating or adding entries.

**Example**:
```
Python Modules: __init__ → state → database → routes → matchmaking → socket_events → tasks → __main__
Frontend Modules: config → utils → dom-utils → api-utils → timer-utils → home → user-info → room → chat
Templates: index → user_info → room → chat
```

**Why it matters**: Entries stay logical and navigable regardless of how many times the section is regenerated.

### 6.9 Standalone Cross-Cutting Sections
**Context**: From finding Critical Implementation Details nested inside Module Descriptions

**Principle**: Don't nest cross-cutting content (configuration notes, critical implementation details, operational constraints) inside auto-generated sections. Make them standalone sections that live beside, not inside, the auto-generated content. This prevents structural corruption on regeneration.

**Example**:
```
❌ ## Module Descriptions (auto-generated)
     ### app/routes.py
     ### Critical Implementation Details  ← nested, will be lost on regen
     ### app/matchmaking.py

✅ ## Module Descriptions (auto-generated)
     ### app/routes.py
     ### app/matchmaking.py
   ## Critical Implementation Details (standalone)
```

**Why it matters**: Auto-generated sections will overwrite anything nested inside them. Standalone sections survive regeneration.

---

## 7. Session Lessons Learned

### 7.1 Syntax Verification
**Context**: Indentation errors hidden until runtime

**Principle**: Verify Python syntax after edits.

**Example**:
```bash
python -m py_compile **/*.py
python -c "from app import app"
```

**Why it matters**: Catch errors before testing.

### 7.2 Import Discipline
**Context**: Wrong import in `matchmaking.py`

**Principle**: Use `import sqlite3`, relative imports (`from .state import`).

**Example**:
```python
# ✅ import sqlite3; from .state import active_users
# ❌ from .database import sqlite3  # Wrong!
```

**Why it matters**: Avoids circular imports, clear dependency chain.

### 7.3 API Contract First
**Context**: Had to add 5 missing endpoints mid-development

**Principle**: Define all API endpoints before frontend expects them.

**Why it matters**: No mid-development surprises.

### 7.4 Immediate Verification
**Context**: From debugging multiple issues at once

**Principle**: Test after every single fix. One change = one verification.

**Why it matters**: Isolate problems, faster debugging.

### 7.5 Investigation Priority Order
**Context**: From designing investigation workflows across 6 different document update skills

**Principle**: Always define the priority order for what to read first. Different document types need different priorities. Don't read randomly — read the highest-signal source first.

**Example**:
- For technical docs (ARCHITECTURE): code → configs → CI → existing doc
- For best practices (PROJECT_BEST_PRACTICES): existing doc → session conversation → code
- For product docs (SPECIFICATIONS): existing doc → code (features only) → README

**Why it matters**: Prevents reading low-signal files first. The right priority order can cut investigation time in half.

### 7.6 Inline Constraints With Items
**Context**: From removing separate "Content Boundaries" sections across 6 skill files

**Principle**: Don't separate "what to include" from "how to format it." Inline formatting/constraint rules directly into the inclusion item. One concept, one place.

**Example**:
- ❌ Two sections: Section A says "Include API endpoints." Section B says "Summary table only."
- ✅ One item: "API endpoints — summary table only, no request/response examples."

**Why it matters**: No need to cross-reference sections. The constraint lives with the item it constrains.

### 7.7 Merge Pre-Verification With Post-Verification
**Context**: From merging "Checklist Before Adding Content" with "Step 5: Verify" across 6 skill files

**Principle**: A checklist before writing and a verification step after writing serve the same purpose. Merge them into one comprehensive verification step instead of maintaining two separate lists that half-overlap.

**Example**:
- Before: "Checklist" (6 items: check purpose, check routing, check duplications) + "Step 5: Verify" (8 items: check purpose, check routing, check duplications, check formatting...)
- After: One "Verify" step with all 8 items — the first 3 address pre-write thinking, the remaining 5 address post-write checking.

**Why it matters**: Eliminates duplicate maintenance. One list to update, one place to look.

### 7.8 Gap Grilling Methodology
**Context**: From comparing /init template against update-agents skill

**Principle**: When comparing two sources (template vs implementation, spec vs code), don't just list differences. Test each gap against four questions: (1) Is it truly additive (not already covered)? (2) Does it affect output or methodology? (3) Which document owns it? (4) What's the cost/benefit? Only act on gaps that survive the grill.

**Example**:
```
Gap found: "Prefer wiring files over leaf files"
Grill: (1) Not currently explicit — additive ✓
       (2) Investigation methodology only — affects skill, not output ✓
       (3) Belongs in update-agents skill ✓
       (4) Low cost — one sentence addendum ✓
Decision: ✅ Add
```

**Why it matters**: Prevents scope creep. Most gaps fail one of the four questions and can be safely skipped.

### 7.9 Docs-First Analysis Pipeline
**Context**: From revising analyze-and-plan skill to prefer docs over full codebase parsing

**Principle**: Before analyzing requirements against a codebase, consult existing docs first. Docs are compact, structured, and token-efficient. Only fall back to full source code examination when the docs don't cover what's needed. Spot-check 1-2 key source files to confirm docs aren't stale — "trust but verify."

**Example**:
```
Task: Add a new API endpoint
1. Read SPECIFICATIONS.md (product context) and ARCHITECTURE.md (existing endpoints)
2. Spot-check app/routes.py to confirm the endpoint table is accurate
3. Only read full codebase if neither doc covers the needed detail
```

**Why it matters**: Saves tokens, builds on existing knowledge, catches stale docs cheaply.

### 7.10 Interactive Walkthrough with Skip Confirmation
**Context**: From redesigning grill-plan-and-refine's user interaction model

**Principle**: When probing a plan or design with a user, don't dump all findings at once or ask open-ended questions. Structure the walkthrough: one dimension at a time, present findings as concrete options, accept free-form input beyond options, and resolve before moving on. Before starting, flag which dimensions are skippable and confirm with the user — prevents tedious drilling on obvious items.

**Example**:
```
Before: "Let me check assumptions, edge cases, alternatives..." (dumps all)
After:
  "I found 6 dimensions. 3 need discussion (Assumptions, Risks, Consistency),
   3 are straightforward (Edge Cases, Alternatives, Dependencies). Shall I skip
   the straightforward ones? [Yes / No / Custom]"
  Then walks through each flagged dimension one at a time with options.
```

**Why it matters**: Keeps the conversation structured and efficient. No open-ended questions, no skipped-in-silence items.

### 7.11 Presence Check Over Re-Probe
**Context**: From reframing readiness-check as document verifier instead of deep analyzer

**Principle**: When verifying a document against a set of criteria, check that each criterion is **explicitly addressed** in the document — don't re-analyze the underlying content from scratch. The document's author already did the analysis; the verifier's job is to confirm coverage. This is faster than re-probing and avoids duplicating the author's work.

**Example**:
```
✅ Presence check: "Does the plan state confirmed assumptions?" → reads the plan, finds "## Grill Outcomes" with assumption notes
❌ Re-probe: "Are these assumptions valid? Let me check the codebase again..."
```
Exception: Soundness verification requires active assessment — "does the plan hold together?" — not just presence.

**Why it matters**: Eliminates rework. The author probes, the verifier checks coverage. Not the other way around.

### 7.12 Triage Routing
**Context**: From designing failure handling in readiness-check and review-implementation

**Principle**: When a verification step finds a failure, don't attempt deep resolution in the verification step. Instead, triage: minor gaps (missing documentation, unclear wording) get a quick fix in-place; significant gaps (unresolved assumptions, soundness risks, failing tests) route backward to the owning stage. Each stage knows when to fix and when to escalate.

**Example**:
```
readiness-check finds:
- Missing doc reference → minor: fix in-place, update plan file, re-check
- Unresolved assumption → significant: route back to grill-plan-and-refine

review-implementation finds:
- Lint issue → minor: fix the formatting, re-run lint
- Test failure → significant: route back to implement-plan
```

**Why it matters**: Prevents verification steps from duplicating the work of earlier stages. Clear ownership of each fix type.

### 8.1 Permission Control
**Context**: From maintaining control during automated edits

**Principle**: Set `"ask"` for edit/write/bash in `.opencode/opencode.json`.

**Example**:
```json
{"agent":{"build":{"permission":{"edit":"ask","write":"ask","bash":"ask"}}}}
```

**Why it matters**: You approve every change.

### 8.2 "Would an Agent Miss This?" Litmus Test
**Context**: From filtering content across 7 document restructurings in a single session

**Principle**: For every piece of documentation or instruction, ask: "Would an agent (or developer) likely miss this without explicit documentation?" If no, leave it out. This is the single strongest filter against bloat.

**Example**:
- ✅ Include: "The default branch is `dev`, not `main`." (An agent would guess wrong.)
- ❌ Exclude: "Python files use .py extension." (Obvious — no one would miss this.)
- ✅ Include: "Command order matters: lint then typecheck then test." (Non-obvious.)
- ❌ Exclude: "Run tests after making changes." (Standard practice — agents know this.)

**Why it matters**: Keeps documentation lean. Every line must earn its place. Reduces token usage and reading time on every session.

### 8.3 Executable Sources of Truth
**Context**: From discovering doc/script conflicts during codebase investigation

**Principle**: When documentation conflicts with code, configs, scripts, or CI files, trust the executable source. Prose is aspirational — code is truth.

**Example**:
- README says "run `python app.py`" but `requirements.txt` shows the entrypoint is `python -m app` → trust the code and fix the docs
- ARCHITECTURE.md describes an old module structure that no longer exists in the actual file tree → update ARCHITECTURE.md to match the code

**Why it matters**: Outdated docs are worse than no docs — they actively mislead. Verifying against executable sources keeps documentation accurate.

### 8.4 Filename as Stable Key
**Context**: From designing auto-update matching for ARCHITECTURE.md

**Principle**: When auto-updating document entries, match by `` `path/file.ext` `` in the section heading as the stable key, not by sequential position or content heuristics. Filenames survive reordering, insertions, and lead line changes.

**Example**:
```markdown
### `app/routes.py` (HTTP Routes)   ← match on `app/routes.py`
Existing entry → update lead line
Missing entry → insert at correct position in ordering
```

**Why it matters**: Sequential position breaks when entries are added or reordered. Filename matching is idempotent.

### 8.5 Preserve Manual, Regenerate Auto
**Context**: From separating auto-extracted lead lines from manually authored bullet points in ARCHITECTURE.md

**Principle**: When automating document updates, clearly split content that has a verifiable source of truth (regenerate automatically) from content that requires human judgment (preserve untouched). Never regenerate what you can't verify against an authoritative source.

**Example**:
```markdown
### `app/routes.py` (HTTP Routes)
[lead line] ← auto-regenerated from source code # Description: header
[bullet points] ← preserved — no source-of-truth exists for these
```

**Why it matters**: Prevents automation from silently deleting human-authored nuance that can't be reconstructed from code alone.

### 8.6 Diff Logging for Automation
**Context**: From building safe auto-update workflows for documentation

**Principle**: Every automated content change should log its action with a clear tag: `[diff]` for content changes, `[REMOVED]` for deletions, `[MISSING]` for unfindable sources. This gives the user a reviewable audit trail and builds trust in the automation.

**Example**:
```
[diff] app/routes.py: 'Old lead line' → 'New lead line'
[REMOVED] app/obsolete.py — entry deleted (file no longer exists)
[MISSING] app/new_file.py has no Description: header — please add one
```

**Why it matters**: Silent automation erodes trust. Logged diffs let the user verify changes at a glance.

### 8.7 Cross-Language Extraction Pattern
**Context**: From extracting file descriptions across Python, JS, HTML in a single codebase

**Principle**: When you need to extract structured metadata from source files across multiple languages, design a uniform header format (`Description: ...`) and a single regex that works across all comment syntaxes. Avoid per-language extraction logic.

**Example**:
```regex
/Description: (.+)/   ← matches all of:
# Description: ...    (Python # comments)
// Description: ...   (JS // comments)
{# Description: ... #} (Jinja2 HTML comments)
"""Description: ...""" (Python docstrings)
```

**Why it matters**: One regex, one extraction function, no per-language maintenance. Simple, correct, and easy to extend to new file types.

### 8.8 One Verb Per Skill
**Context**: From separating implement-plan (TDD+code) from review-implementation (verify+sign-off) into two distinct skills

**Principle**: Each skill or component should do exactly one thing. If a skill description uses "and" to connect distinct responsibilities ("creates plans AND verifies them"), split it. One verb per skill prevents overlap, makes the pipeline obvious, and forces clear stage boundaries.

**Example**:
```
❌ implement-guide: "Code, test, debug, verify, and document"
✅ implement-plan: "TDD + code + flag changes"
✅ review-implementation: "Diff review + test/lint verification + sign-off"

The pipeline: analyze → grill → check → implement → review
Each step has exactly one verb.
```

**Why it matters**: No ambiguity about what each component owns. No overlap between adjacent stages. Clear routing on failure — you always know which door to knock on.

### 8.9 Independent Re-Verification
**Context**: From designing review-implementation to run tests/lint independently instead of trusting implement-plan's self-check

**Principle**: The reviewer runs the same checks independently and does NOT trust the implementer's "I already tested this." Run the full test suite, run lint, read every diff line, check every flag — from scratch. During review, only find problems — never fix them. Fixing belongs to the implementer.

**Example**:
```
implement-plan: codes, tests locally per batch, hands off "Ready for review"
review-implementation: ignores self-test results, re-runs everything from scratch
  - Read full diff → flag check ✅
  - Run all tests → pass ✅
  - Run lint → pass ✅
  - Verify criteria from plan file → met ✅
  - Sign off → "All checks pass. Implementation verified."
```

**Why it matters**: Self-verification is not verification. Independent re-runs catch what the implementer missed.

### 8.10 Stage Gate Pattern
**Context**: From the 5-skill pipeline with explicit go/no-go between every phase

**Principle**: Between every major phase, insert an explicit gate that must pass before the next phase starts. The gate asks "Are we ready to proceed?" and someone (user or automated check) must answer yes. No implicit progression. No phase approving its own output.

**Example**:
```
Phase                  Gate                    Next phase
analyze-and-plan →   "Plan created. Shall I present it?"   → user approves → grill-plan
grill-plan →         "Grill complete. Here is the plan."   → user accepts   → plan-readiness
plan-readiness →     "All gates pass. Ready to implement?" → user says go   → implement-plan
implement-plan →     "Ready for review."                   → user triggers  → review-implementation
review-implementation → "All checks pass. Verified."       → DONE
```

**Why it matters**: Prevents skipping stages. Every handoff requires explicit confirmation.

### 8.11 Batch by Logical Concern, Not Line Count
**Context**: From specifying batching rules for implement-plan

**Principle**: When splitting implementation into reviewable batches, define each batch by its logical completeness — one complete feature, one bug fix, one refactoring — not by lines of code. A batch is complete when its tests pass independently. Never split a single logical change across multiple batches just to make each batch "smaller."

**Example**:
```
✅ Good batch: "Add POST /api/users endpoint + its test" (3 files, ~60 lines)
✅ Good batch: "Fix null pointer in matchmaking + regression test" (2 files, ~15 lines)
❌ Bad batch: "Write test for /api/users + part 1 of the implementation" (incomplete, can't test)
❌ Bad batch: "Write lines 1-30 of the POST handler, continue in next batch" (artificial split)
```

**Why it matters**: Each batch is independently verifiable. Reviewers see a complete change, not a fragment. No "to be continued" across batches.

### 8.12 Persistent Decision Artifacts
**Context**: From saving plans as timestamped, numbered files in docs/plans/ for all downstream stages to consume

**Principle**: Save finalized decisions as persistent files — not just conversation context. Use a consistent naming scheme (PLAN_YYYY_MM_DD_XXX.md) with auto-incrementing numbers. Each downstream stage reads from the artifact file directly, not from memory or chat history. This makes decisions reviewable, auditable, and independent of conversation context.

**Example**:
```
docs/plans/
├── PLAN_2026_05_11_001.md   ← created by plan-readiness, consumed by implement-plan
└── .gitkeep

The file contains:
- Requirements, Solution, Implementation Plan
- Grill Outcomes (resolved dimensions)
- Readiness Gate Results (pass/fail per gate)

implement-plan opens the latest PLAN_*.md, never relies on "as we discussed earlier."
```

**Why it matters**: No hidden state between stages. A plan survives conversation context loss, and any stage can be re-run against the same artifact.

---

## 9. Version Control
**Context**: From recovering lost work

**Principle**: .gitignore binaries, pin versions, descriptive commits.

**Example**:
```bash
git commit -m "Fix: Resolve 404 on user room"
# Pin: Flask==2.3.3 (never Flask without version)
```

**Why it matters**: Reproducible builds, clean history.

---

## 10. Code Review Checklist
**Context**: From shipping bugs to production

**Principle**: Check: syntax, imports, tests, errors, hardcoded values, docs.

**Example**:
```bash
python -m py_compile          # Syntax
python -m pytest tests/ -v    # Tests
```

**Why it matters**: Catch issues before merge.

---

## 11. Frontend Best Practices
**Context**: From debugging 500-line JS monoliths

**Principle**: Modular JS: `config.js` (central), `utils.js` (shared), `page.js` (page-specific).

**Example**:
```javascript
// api-utils.js ONLY: API calls
async function fetchJSON(url, options={}) {
    return parseJSON(await fetchWithTimeout(url, options));
}
```

**Why it matters**: Easy to find, easy to test.

---

## 12. Debugging Process
**Context**: From fixing 404 on `/api/users/xxx/room`

**Principle**: Identify → Isolate → Read → Plan → Apply → Verify → Document.

**Example**: Error: 404 → Cause: state cleared → Fix: restore from DB → Verify: test.

**Why it matters**: Systematic approach, no guesswork.

---

## 13. Document Scope & Distinctions

**Context**: From duplicate content across README, AGENTS, ARCHITECTURE

**Principle**: One purpose per document. Move content to `/docs/` if README >250 lines.

**Example**:
| Document | Purpose |
|----------|---------|
| **README.md** | User-facing: what, how, quick start |
| **SPECIFICATIONS.md** | Product vision, user journey, why it exists |
| **ARCHITECTURE.md** | Technical: *how* it's structured |
| **DEMO_GUIDE.md** | Presenter walkthrough: demo steps |
| **AGENTS.md** | Agent context: *what* agents work on |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns & lessons |
| **DOCUMENT_GUIDELINES.md** | Governance: doc scope & boundaries |

**Why it matters**: No confusion, clear ownership.

---

## Key Takeaways
1. **Modular > Monolithic**
2. **Config > Hardcode**
3. **Test Continuously**
4. **Document as You Go**
5. **Distinct Docs** — one purpose per document, defined by the questions it answers
6. **Key Differentiator** — every doc needs a bold one-line uniqueness statement
7. **Boundary Tensions** — when docs overlap, document the resolution
8. **Quality Gates** — filter content before including it (litmus test, executable truth, conciseness)
9. **Inline Constraints** — don't separate "what" from "how"; keep formatting rules with their items
10. **Merge Verification** — one comprehensive verify step, not separate pre/post checklists
11. **Recover State** — always handle in-memory state recovery
12. **Verify Immediately** — one change, one verification
13. **Update Practices** — use `update-best-practices` skill after every significant session
14. **Source Comments > Doc Duplication** — write `Description:` headers in code as canonical source; auto-extract into docs
15. **Auto Headline, Manual Detail** — auto-generate lead lines from code, manually preserve bullet points
16. **Logical > Alphabetical Ordering** — order entries by dependency flow (dependency → utility → user), not alphabetically
17. **Standalone > Nested for Regenerated Sections** — keep cross-cutting content in standalone sections, not nested inside auto-generated blocks
18. **Grill Gaps Before Acting** — test every template-vs-implementation gap against 4 questions before deciding to act
19. **Filename Keys for Auto-Updates** — match by `path/file.ext` in section headings, not by position or content
20. **Preserve Manual, Regenerate Auto** — only regenerate content with a verifiable source of truth; preserve the rest
21. **Log All Automated Diffs** — tag every automated change as `[diff]`, `[REMOVED]`, or `[MISSING]` for auditability
22. **One Regex Across Languages** — use a single uniform header format + regex across Python, JS, HTML instead of per-language extraction
23. **Docs-First Analysis** — consult docs before raw codebase parsing; spot-check against 1-2 files for accuracy
24. **Structured Walkthrough** — probe one dimension at a time with options; confirm skippable items upfront
25. **Presence Check Over Re-Probe** — verify documents check coverage, don't re-analyze from scratch
26. **Triage Routing** — minor gaps fix in-place, significant gaps route to owning stage
27. **One Verb Per Skill** — each component does exactly one thing; no "and" in descriptions
28. **Independent Re-Verification** — reviewer re-runs all checks from scratch; never trusts self-checks
29. **Stage Gate Pattern** — explicit go/no-go between every phase
30. **Batch by Logical Concern** — one complete feature per batch, not measured by lines of code
31. **Persistent Decision Artifacts** — save finalized plans as timestamped, numbered files for all downstream stages
