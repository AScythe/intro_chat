# update-best-practices

## Purpose
Extracts universal best practices from each coding session and writes them into `docs/PROJECT_BEST_PRACTICES.md`. The result is a reusable reference for developers and AI agents starting new projects.

## When to Trigger
Say "update best practices" or "document lessons from this session" after:
- Fixing a bug — capture the prevention pattern
- Implementing a feature — capture structural decisions
- Running into confusion — capture what should have been obvious
- Ending a session — capture everything that was learned

## What Makes a Good Entry
Every entry must pass four checks:
1. Would someone miss this without help? If not, skip it.
2. Is it universal? Strip project-specific names (they belong only in the **Example** field).
3. Does it follow the format? Context (1 line) + Principle (2-3 lines) + Example (short) + Why it matters (1 line).
4. Is it concise? Turn stories into rules.

## Output Format Reminder
```markdown
**Context**: When/where discovered
**Principle**: The universal rule
**Example**: Code or command snippet
**Why it matters**: Impact on future work
```

## Category Clusters
Practices are organized into 6 groups:
- **Code Structure** — Modularization, Architecture Decisions
- **Quality** — Error Handling, Testing
- **Operations** — Configuration, Version Control
- **Process** — Debugging, Documentation, AI-Assisted Development
- **UI** — Frontend Practices
- **Meta** — Session Lessons Learned (only what doesn't fit elsewhere)

## Tips
- Run after each significant session, not once at the end
- Review the updated doc periodically to reinforce patterns
- Entries should be useful to someone who has never seen this project
