---
name: implement-plan
description: 'Execute the approved plan following TDD in reviewable batches. Flag every change. Verify locally per batch. Use after check-plan-readiness passes, or when the user says "implement", "implement plan", "proceed", "start coding", or similar. Reads the plan file as read-only — never writes to it.'
---

## What I do
- Read the approved plan file (`docs/PLAN_*.md`) and verify all 7 gates pass
- Split implementation into batches mapped to the plan's Task Breakdown
- For each batch: write test (TDD) → implement → flag changes → verify
- Run full test suite + lint + audits after all batches
- Hand off to review-implementation with all tests passing

## Boundaries
- **Plan file is read-only.** Never create or modify `docs/PLAN_*.md`.
- **No scope creep.** Only implement what the plan specifies — nothing speculative, no unrelated fixes.

## Documents to Read

- **`SPECIFICATIONS.md`**: "Out of Scope"
- **`ARCHITECTURE.md`**: "Project Structure", "Import Structure", "Modifying Instructions", relevant module descriptions only

## Implementation Workflow

### Phase 1: Setup

**Verify readiness and map the work.**

- Verify all 7 gates pass. Do not proceed if any failed.
- Read the plan fully — batch each task to one implementation batch.
- Identify files to create, modify, or remove. Map each test file to a plan task.
- If anything is unclear, ask before proceeding.

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

| Substitute | What it is | Use when |
|------------|-----------|----------|
| **Stub** | Returns canned data, no assertions | Need a return value — don't care how it's called |
| **Fake** | Lightweight real implementation (e.g., in-memory DB) | Need realistic behavior without real infra cost |
| **Mock** | Asserts it was called in a specific way | Need to verify an interaction (use sparingly) |
| **Spy** | Records calls, asserts after the fact | Need to observe behavior without replacing it |

Prefer fakes and stubs over mocks. Over-mocking 3+ collaborators for one test signals tight coupling (see grill's AP3).

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

**Characterization Tests (for existing code)** — when code has no tests and TDD (write failing test first) is not possible:
- Run against known input, record output → write test asserting that exact oracle
- Must pass before and after your change
- If full infrastructure required, that's coupling (see grill's AP3, AP5). Write a mock-based bridge test, fix coupling, then replace with injection-proof test.
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

## General Methodology

### Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked
- No abstractions for single-use code
- No flexibility not requested
- No error handling for impossible scenarios
- Concise and straightforward — prioritize readability
- If code is long, make it shorter
- Structure control flow so bugs have nowhere to hide

### Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing:
- Do not refactor code not related to the requirement
- Match existing style
- Flag unrelated dead code. Do not delete it.
- Never remove file-level `Description:` comments. May edit for accuracy.

When creating new files — must include a file-level description comment:
- Python: `# Description: ...`
- TS/TSX: `// Description: ...`
- CSS: `/* Description: ... */`
- One concise line stating the module's single responsibility.

When adding imports — only to files you're actively modifying; only directly referenced imports.

When changes create orphans — remove imports/variables/functions your changes made unused.

### Write Deep Modules
Simple public interface, complex implementation hidden inside:
- **Pull complexity inward** — if the caller needs setup before calling, pull it inside
- **Hide configuration** — don't expose 8 params if 6 can be defaulted
- **Minimal surface area** — fewer public methods = fewer required test cases
- **Single responsibility** — one thing per module; four things requires exponentially more tests

A deep module test: pass 1-2 inputs, assert final output. No mocking of internals, no complex setup.

### Failure Triage
When a test fails after a change, classify before acting. See "Failure Triage" table in `AGENTS.md`. Never auto-revert on first failure.

## Hand-off
- Phase 1: Plan verified (7 gates ✅), batches mapped
- Phase 2: All batches implemented with TDD + flags, verified per batch
- Phase 3: Full test suite passes, lint clean, all audits passed
- Plan file unchanged. All tests saved in `tests/`.

---

## Outputs & Triggers

### Output
All code changes with `[FLAG]` annotations. Full test suite passes. All success criteria from the plan are met. Plan file is unchanged.

### Exit Declaration
State clearly: "**Implementation complete. Proceed to review the implementation? Say 'review' to trigger review of the implementation.**"

### Next Step
User invokes `review-implementation` — **switch to Plan mode before proceeding**.