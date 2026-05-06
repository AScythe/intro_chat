# update-best-practices

**Purpose**: Extract best practices from coding session → update `PROJECT_BEST_PRACTICES.md`

**Trigger**: User says "update best practices" or "document lessons learned" or similar

## Steps

### 1. Analyze Session
Review conversation for:
- Code structure decisions (modularization, file organization)
- Errors found + fixes (syntax, import, logic errors)
- Architecture patterns used (separation of concerns, leaf modules)
- Testing strategies (syntax checks, unit tests, integration tests)
- Tools/configs (`.opencode/opencode.json`, skills used)

### 2. Read Current Practices
- Check if `docs/PROJECT_BEST_PRACTICES.md` exists, create if none
- Read current content to understand existing practices
- Identify gaps or areas needing updates

### 3. Extract New Practices
Extract from these categories:
**A. Code Organization**: File structure, modularization patterns
- Look for: 1 module = 1 responsibility, leaf vs internal modules
**B. Error Handling**: Types of errors + how fixed
- Look for: Syntax errors, import errors, runtime errors, prevention strategies
**C. Testing Approach**: Verification steps used
- Look for: Syntax checks (`python -c "from app import app"`), test suites, manual testing
**D. Tool Configuration**: opencode configs, permissions, skills
- Look for: `.opencode/opencode.json` settings, skill usage
**E. Debugging Process**: Step-by-step fix approach
- Look for: How issues were isolated, tools used (grep, read, bash)
**F. Architecture Decisions**: Why patterns chosen
- Look for: Trade-offs, what worked well vs poorly

#### Modularization (extract 4 aspects):
1. **Module Responsibility**: 1 module = 1 responsibility
   - Extract as: "Leaf modules (state.py, database.py) export only, never import from internal modules"
2. **Circular Import Prevention**: Relative imports, lazy imports, leaf modules
   - Extract as: "Import from leafs, never sibling-to-sibling"
3. **When to Split**: File size, mixed concerns, circular errors
   - Extract as: "Split triggers: >200 lines, mixed concerns, circular imports, parallel dev conflicts"

### 4. Apply Conciseness Rule
**Keep it concise, straightforward, and actionable**:
- ❌ "We encountered a problem where the indentation was incorrect in the __init__.py file which caused a syntax error"
- ✅ "Indentation errors in `__init__.py` — verify after edits"

**Format per practice**:
```markdown
## X. Category
### X.1 Practice Name
**Context**: When discovered (1 line max)
**Principle**: The practice (2-3 lines max)
**Example**: Short code snippet
**Why it matters**: Impact on future projects (1 line)
```

### 5. Update Document
- Add new sections or update existing in `docs/PROJECT_BEST_PRACTICES.md`
- Use format from Step 4
- Include concrete examples from session (short snippets)
- Ensure practices are generalized (use "from your project", not specific names)

### 6. Verify Update
- Read back updated document
- Confirm new practices are clearly documented
- Ensure examples are accurate and helpful
- Check conciseness (about 50% shorter than verbose)

## Rules
- Keep practices generalized - don't reference specific project names
- Include both TO DO and NOT TO DO examples
- Document tool configurations (`.opencode/opencode.json`)
- Save to `docs/PROJECT_BEST_PRACTICES.md`
- **Conciseness first**: few lines per section, no verbose explanations
