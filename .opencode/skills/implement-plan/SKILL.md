---
name: implement-plan
description: 'Execute the approved plan following TDD in reviewable batches. Flag every change. Verify locally per batch. Use after check-plan-readiness passes, or when the user says "implement", "implement plan", "proceed", "start coding", or similar. Reads the plan file as read-only — never writes to it.'
---

## What I do
- Read the approved plan file (`docs/PLAN_*.md`) and verify all 8 gates pass
- Split implementation into batches mapped to the plan's Task Breakdown
- For each batch: write test (TDD) → implement → flag changes → verify
- Run full test suite + lint + audits after all batches
- Hand off to review-implementation with all tests passing

## Boundaries
- **Plan file is read-only.** Never create or modify `docs/PLAN_*.md`.
- **No scope creep.** Only implement what the plan specifies — nothing speculative, no unrelated fixes.

## Documents to Read

- **`SPECIFICATIONS.md`**: "Out of Scope"
- **`docs/ARCHITECTURE.md`**: "Project Structure", "Import Structure", "Modifying Instructions", relevant module descriptions only
- **`docs/PLAN_*.md`**: Task Breakdown section (batches map 1:1)

## Phase 0: Prerequisites

- [ ] Read the approved plan (docs/PLAN_*) — verify all 8 gates pass
- [ ] Run baseline tests — all must pass before any changes
- [ ] Identify all files to create/modify/remove
- [ ] Apply Smart Tool Selection per task type (see AGENTS.md §Smart Tool Selection)

## Implementation Workflow

### Phase 1: Setup

**Verify readiness and map the work.**

- Verify all 8 gates pass. Do not proceed if any failed.
- Read the plan fully — batches map 1:1 to the plan's Task Breakdown items.
- Identify files to create, modify, or remove. Map each test file to a plan task.
- If anything is unclear, ask before proceeding.

### Smart Tool Selection

See [AGENTS.md §Smart Tool Selection](../../../AGENTS.md) for the full decision framework. This skill has additional tool guidance specific to implementation work:

**Assessing impact:** Before starting a batch, use the pipeline (graphify→cocoindex→ast-grep) to understand blast radius. Start with `graphify query "impact of changing $MODULE"` to discover all connected concepts, or `graphify path "X" "Y"` to find the relationship path between two modules. This prevents missing downstream effects.

**Finding code:** Prefer **cocoindex-code** semantic search over `grep` when searching by purpose or intent (e.g. "find where we validate emails"). Prefer **ast_grep_search** over `grep` when searching by code structure (e.g. all `try/except` blocks with `pass`, or all calls to a deprecated function).

**Rewriting code:** Prefer **ast_grep_replace** over `edit` for:
- Pattern-based rewrites across multiple files (e.g. replace `get_user(id)` with `User.fetch(id)` everywhere)
- Structural changes where whitespace, comment, or formatting variations must not break the match
- Any rewrite where syntactic validity matters — ast-grep output is always valid AST, avoiding the "forgot closing brace" class of errors

`ast_grep_replace` defaults to `dryRun: true`. Preview results first, then set `dryRun: false` to apply.

### Guiding Principles

#### Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features, abstractions, or flexibility beyond what was asked
- No error handling for impossible scenarios
- Concise and straightforward — prioritize readability; if code is long, make it shorter
- Self-documenting names — name reveals intent. If you need a comment to explain what a function does, rename the function.
- Structure control flow so bugs have nowhere to hide

#### Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing:
- Do not refactor code not related to the requirement
- Match existing style
- Flag unrelated dead code. Do not delete it.
- Never remove file-level `Description:` comments. May edit for accuracy.

When adding imports — only to files you're actively modifying; only directly referenced imports.

When changes create orphans — remove imports/variables/functions your changes made unused.

#### Code Optimization for Testing and AI Collaboration

- **Deep Modules**: Simple, minimal public interfaces hiding high internal complexity.
- **High Cohesion**: Classes and functions dedicated to a single, tightly focused responsibility.
- **Referential Transparency**: Pure functions with zero side effects that always return the same output for the same input.
- **Explicit Dependency Injection**: Passing required tools and services into a module rather than hardcoding them inside.
- **Immutability**: Data structures that cannot be modified after creation, preventing accidental state bugs.
- **Low Coupling**: Minimal, well-defined dependencies between different modules to ensure they can change independently.
- **Small Functional Footprint**: Keeping individual files and functions short, compact, and scannable.

#### File Description Header
Every file requires a file-level `# Description:`/`// Description:`/`/* Description: */` header stating its main responsibility. Include on new files; update if the there is a change in responsibilities.

#### Strict Type Safety
- Use typed dataclasses over raw dicts — type errors caught at import time, not runtime
- Avoid `Any`/`any` in new code; if a type is truly unknown, narrow it explicitly
- Schema-validate external data at the boundary; core logic operates on validated types only

#### Logging Convention
- Every Python file requires the standard logging setup block after imports:
  ```python
  import logging

  logging.basicConfig(
      level=logging.INFO,
      format='%(asctime)s - %(levelname)s - %(message)s',
      handlers=[logging.StreamHandler()]
  )
  logger = logging.getLogger(__name__)
  ```
- Use `logger.info()`, `logger.warning()`, `logger.error()`, `logger.debug()` for all operational messages
- Pass `exc_info=True` on `logger.exception()` to capture tracebacks
- Never use bare `print()` for operational output
- User-facing CLI output (menus, prompts, structured JSON to stdout) stays as `print()` — it is not operational logging

#### Failure Triage
When a test fails after a change, classify before acting. See "Failure Triage" table in `AGENTS.md`. Never auto-revert on first failure.

### Phase 2: Iterate

**Per-batch TDD loop: test → implement → flag → verify.**

For each batch in order:

0. **Make one edit per logical change** — one function, one section, or one test case per edit call.
1. **Write tests first (TDD)** — failing test → implement → make pass → refactor
2. **Flag every changed line** — use the flags table below with a short reason
3. **Update all test references in the same batch** — imports, mock setups, and assertions simultaneously. Source and tests are one unit.
4. **Verify batch** — tests pass before starting the next batch.
5. **Tighten assertions** — after batch passes, re-read. `assertIsNotNone` when you know the expected value is a false positive.

#### TDD First

**Test Double Discipline** — use the simplest substitute that makes the test pass:

**Rule of thumb:** Stub data → Fake infra → Spy outputs → Mock interactions (last resort)

| Substitute | What it is | Use when |
|------------|-----------|----------|
| **Stub** | Returns canned data, no assertions | Need a return value — don't care how it's called |
| **Fake** | Lightweight real implementation (e.g., in-memory DB) | Need realistic behavior without real infra cost |
| **Spy** | Records calls, asserts after the fact | Need to observe behavior without replacing it |
| **Mock** | Asserts it was called in a specific way | Need to verify an interaction (use sparingly) |

Over-mocking 3+ collaborators for one test signals tight coupling (see Testability Anti-Patterns: AP3 above).

**Non-Determinism Injection:**

- **Clocks** — inject `datetime.now` as a parameter
- **RNG** — inject `random` or seed explicitly
- **Network/external services** — inject an HTTP client or use a fake
- **File system** — inject paths or use `tmp_path` fixtures
- A function calling `datetime.now()` or `random.random()` internally is untestable as written. Refactor to inject.

Canonical pattern — defaulted parameter (production callers require no change):
```python
def create_session(now=None, new_id=None):
    return {"id": str(new_id or uuid4()), "created_at": now or datetime.now()}
```

**Testability Anti-Patterns** — watch for these 8 during test design:

| # | Anti-Pattern | Symptom |
|---|-------------|---------|
| AP1 | Non-determinism | Clocks, RNG, or network calls make tests non-repeatable |
| AP2 | Untestable I/O fusion | A function reads external state AND contains decision logic based on that state |
| AP3 | Tight coupling | Mocking 3+ collaborators to test one unit |
| AP4 | Shared mutable state | Global state modified by multiple tests causes order-dependent flaky tests |
| AP5 | Missing seams | No place to substitute behavior without patching internals |
| AP6 | Type ambiguity | `Any`/`any` types, untyped dicts, or missing schemas in function signatures |
| AP7 | Non-idempotent writes | Running the same write operation twice produces different state |
| AP8 | Mutable outputs | Function returns a list/dict the caller can accidentally mutate |

**Characterization Tests (for untested code)** — when existing code has no tests:
- Run against known input, record output → write test asserting that exact oracle
- Must pass before and after your change
- If full infrastructure required, that's coupling (see Testability Anti-Patterns: AP3, AP5 above). Write a mock-based bridge test, fix coupling, then replace with injection-proof test.
- Save as permanent regression test in `tests/`.

**Non-Testable Changes** — config changes, renames, typo fixes, infra with no observable behavior. When in doubt, write the test.

#### Batch Flags

**Format:** `[FLAG]: short_reason — what/why`
**Example:** `[ADDED]: validate_email helper — validates email before registration`

| Flag | When to use |
|------|------------|
| `[ADDED]` | New code, new file, new function |
| `[MODIFIED]` | Changed existing code |
| `[FIXED]` | Bug fix |
| `[REMOVED]` | Deleted code or file |
| `[MOVED]` | Relocated code without logic change |

Every batch that adds or modifies logic must include its test file(s) in `tests/`. A batch is not complete until its tests are saved and passing.

### Phase 3: Verify

**After all batches, run full verification and audit.**

1. **Run full test suite** — all pass
2. **Run lint and typecheck** — clean
3. **Logic clarity** — control flow easy to follow at a glance? If you need a comment to explain it, rewrite until obvious.
4. **Minimal dependencies** — every new import justified? Benefit outweigh cost?
5. **Error strategy audit** — every failure case has a consistent strategy? No ad hoc patches.
6. **Performance audit** — close enough to optimal that no one will hack workarounds later?
7. **Single responsibility** — each module/function does one thing?
8. **Scope audit** — no features beyond the plan, no speculative abstractions
9. **Surgical changes audit** — only required files touched. Description comments preserved.
10. **Flag audit** — every changed line carries a valid [FLAG] with a clear reason
11. **Plan file unchanged** — read-only constraint verified
12. **Idempotency check** — re-running the same operation produces the same result? No state changes on repeated calls?

## Hand-off
- Phase 1: Plan verified (8 gates ✅), batches mapped to Task Breakdown
- Phase 2: All batches implemented with TDD + flags, verified per batch
- Phase 3: Full test suite passes, lint clean, all audits passed
- Pass → route to review-implementation. Plan file unchanged. Tests saved in `tests/`.

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
All code changes with `[FLAG]` annotations. Full test suite passes. All success criteria from the plan are met. Plan file is unchanged.

### Exit Declaration
State clearly: "**Implementation complete. Proceed to review the implementation? Say 'review' to trigger review of the implementation.**"

### Next Step
User invokes `review-implementation` — **switch to Plan mode before proceeding**.