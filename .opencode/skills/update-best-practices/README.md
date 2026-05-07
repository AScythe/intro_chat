# Quick Reference: update-best-practices

## What it does
Analyzes your current coding session AND existing product code structure, then updates `PROJECT_BEST_PRACTICES.md` with new lessons learned.

**Self-Contained**: Embeds all rules (One purpose per document, Universal principles, Context + Why it matters).

## How to use
Simply say: **"update best practices"** or **"document lessons from this session"**

## What it captures

From your session, it extracts:
- ✅ Code structure decisions
- ✅ Errors found & fixes applied  
- ✅ Architecture patterns used
- ✅ Testing strategies employed
- ✅ Tool configs (opencode.json, skills used)

From existing code structure, it extracts:
- ✅ Universal principles (not project-specific)
- ✅ Module organization patterns
- ✅ Import structure patterns
- ✅ Document scope rules (One purpose per document)

## HOW it extracts

### FROM SESSIONS:
1. Review conversation for errors + fixes
2. Look for patterns: indentation fixes, import corrections, missing endpoints
3. Identify: What worked well? What caused issues?
4. Generalize: Use "your project", not specific names

### FROM EXISTING CODE STRUCTURE:
1. Read `docs/*.md` → check: Does each doc have ONE clear purpose?
2. Read `app/*.py` → analyze module structure, imports, responsibilities
3. Check: Are modules following "1 module = 1 responsibility"?
4. Extract patterns using: Context, Principle, Example, Why it matters

**Self-Contained Decision Tree:**
```
Is it about... → README.md / ARCHITECTURE.md / SPECIFICATIONS.md / DEMO_GUIDE.md / AGENTS.md / PROJECT_BEST_PRACTICES.md
```

**Key Focus: Document Scope & Distinctions**
- "One purpose per document. Use cross-references, not duplication."
- Apply anti-duplication rules (embedded in skill)

## Example

**You**: "Update the best practices based on our session"

**opencode**: 
1. Reviews session (indentation fixes, import errors, missing endpoints, state management)
2. Analyzes code structure (checks "One purpose per document" compliance)
3. Updates `PROJECT_BEST_PRACTICES.md` with format:
   - Context (1 line)
   - Principle (2-3 lines, universal)
   - Example (short snippet, reference project files as context)
   - Why it matters (1 line)
4. Shows you what was added (generalized, not project-specific)

## Output Format
```markdown
## X. New Practice Category

### X.1 Practice Name
**Context**: What happened in session (requirement)

**Principle**: The best practice (universal, not project-specific)

**Example**:
```python
# From your project
```

**Why it matters**: Future project impact (requirement)
```

## Files Created/Updated
- `PROJECT_BEST_PRACTICES.md` - Updated with new practices (self-contained format)
- `.opencode/skills/update-best-practices/` - Skill definition (WHAT + HOW)

## Tips
- Run after fixing multiple bugs
- Run after implementing new features
- Review the updated doc to reinforce learning
- Practices are generalized for ALL future projects
- Examples reference project files (e.g., `app/__init__.py`) as context ONLY
- Uses embedded "One purpose per document" rule
