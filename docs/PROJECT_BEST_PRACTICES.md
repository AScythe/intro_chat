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
**Context**: From `static/js/` structure

**Principle**: 1 JS file = 1 purpose. Centralize shared code in `utils.js`, page-specific in `page.js`.

**Example**:
```
static/js/
├── config.js      # Central config ONLY (CHAT_DURATION)
├── utils.js       # Shared utilities ONLY (showError)
├── api-utils.js   # API calls ONLY (fetchJSON)
├── room.js        # Room page logic ONLY
└── chat.js        # Chat page logic ONLY
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
**Context**: From confusion about where to find info

**Principle**: One doc = one purpose. README (user), ARCHITECTURE (technical), CONTRIBUTING (workflow).

**Example**:
- `README.md` — What it is, how to run (200-800 words)
- `ARCHITECTURE.md` — How it's structured
- `CONTRIBUTING.md` — Dev setup, PR process

**Why it matters**: Users find info fast, no hunting.

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

---

## 8. AI-Assisted Dev (opencode)
**Context**: From maintaining control during automated edits

**Principle**: Set `"ask"` for edit/write/bash in `.opencode/opencode.json`.

**Example**:
```json
{"agent":{"build":{"permission":{"edit":"ask","write":"ask","bash":"ask"}}}}
```

**Why it matters**: You approve every change.

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
| **AGENTS.md** | Agent context: *what* agents work on |
| **ARCHITECTURE.md** | Technical: *how* it's structured |
| **CONTRIBUTING.md** | Workflow: dev setup, PR process |

**Why it matters**: No confusion, clear ownership.

---

## Key Takeaways
1. **Modular > Monolithic** 2. **Config > Hardcode** 3. **Test Continuously** 4. **Document as You Go** 5. **Distinct Docs** 6. **Recover State** 7. **Verify Immediately** 8. **Update Practices** (use `update-best-practices` skill)

---
> Good architecture is invisible. Use `update-best-practices` skill to capture lessons from every session!
