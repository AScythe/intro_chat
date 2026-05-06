# Quick Reference: update-best-practices

## What it does
Analyzes your current coding session and updates `PROJECT_BEST_PRACTICES.md` with new lessons learned.

## How to use
Simply say: **"update best practices"** or **"document lessons from this session"**

## What it captures
From your session, it extracts:
- ✅ Code structure decisions
- ✅ Errors found & fixes applied  
- ✅ Architecture patterns used
- ✅ Testing strategies employed
- ✅ Tool configs (opencode.json, skills used)

## Example
**You**: "Update the best practices based on our session"

**opencode**: 
1. Reviews session (indentation fixes, import errors, missing endpoints, state management)
2. Updates `PROJECT_BEST_PRACTICES.md`
3. Adds new section: "Session Updates"
4. Shows you what was added

## Output Format
```markdown
## X. New Practice Category

### X.1 Practice Name
**Context**: What happened in session

**Principle**: The best practice

**Example**:
```python
# From our session
```

**Why it matters**: Future project impact
```

## Files Created/Updated
- `PROJECT_BEST_PRACTICES.md` - Updated with new practices
- `.opencode/skills/update-best-practices/` - Skill definition

## Tips
- Run after fixing multiple bugs
- Run after implementing new features
- Review the updated doc to reinforce learning
- Practices are generalized for ALL future projects
