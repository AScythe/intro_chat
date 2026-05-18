---
name: implement-plan
description: 'Execute the approved plan following TDD in reviewable batches. Flag every change. Verify locally per batch. Hand off to review-implementation for final sign-off. Trigger after check-plan-readiness passes, or when the user says "implement", "proceed", "start coding", or similar. Reads the plan file as read-only — never writes to it.'
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

## Pipeline Position

This skill is the fourth stage in the planning-to-implementation pipeline. It receives the approved plan and produces verified code for review.

| Input | From | Format |
|-------|------|--------|
| Approved plan (7 gates ✅) | check-plan-readiness | `docs/PLAN_*.md` |
| Resolved dimensions + testability probe | grill-and-refine (via plan's Grill Outcomes) | Plan file sections |
| Design quality principles | brainstorm-and-plan (Phase 2) | Verbal reference |

| Output | To | Format |
|--------|----|--------|
| Code changes with [FLAG] annotations | review-implementation | Source files |
| Passing test suite | review-implementation | `tests/` (permanent regression) |
| Plan file unchanged | review-implementation | Read-only `docs/PLAN_*.md` |

## Documents to Read

Read for implementation conventions and structural context — do not re-analyze requirements already verified upstream.

- **`SPECIFICATIONS.md`**: "Out of Scope"
- **`ARCHITECTURE.md`**: "Project Structure", "Import Structure", "Modifying Instructions", relevant module descriptions only

## Implementation Workflow

### Phase 1: Setup

**Before writing any code, verify readiness and map the work.**

- Verify that the plan's Readiness Gate Results show all 7 ✅. Do not proceed if any gate failed.
- Open `docs/PLAN_*.md` — read every change and success criterion.
- Map the plan's Task Breakdown to implementation batches. Each task in the breakdown maps to one batch.
- Identify which files will be created, modified, or removed.
- Map each test file to a plan task.
- If anything is unclear, ask before proceeding.
- Plan file is read-only — do not modify it.

### Phase 2: Iterate

**Per-batch TDD loop: test → implement → flag → verify.**

For each batch in order:

0. **Make one edit per logical change** — within a batch, split work into focused edit calls. Each edit should touch one function, one section, or one test case. Do not batch multiple unrelated changes into a single edit call — each edit produces one diff block for review and approval.
1. **Write tests first (TDD)** — write a failing test → implement → make it pass → refactor
2. **Flag every changed line** — use the flags table below with a short reason
3. **Update all test references in the same batch** — if you rename or change a signature, update imports, mock setups, and assertions simultaneously. Source and tests are one unit — never split them across batches.
4. **Verify batch** — batch tests pass before starting the next batch. Do not mix unrelated concerns in the same batch.
5. **After batch tests pass** — re-read assertions. Tighten any that are too loose (e.g., `assertIsNotNone` when you know the expected value). A passing test with weak assertions is a false positive.

#### TDD First

**Test Double Discipline** — use the simplest substitute that makes the test pass:

| Substitute | What it is | Use when |
|------------|-----------|----------|
| **Stub** | Returns canned data, no assertions | You need a dependency to return a value — you don't care how it's called |
| **Fake** | Lightweight real implementation (e.g., in-memory DB) | You need realistic behavior without the real infrastructure cost |
| **Mock** | Asserts it was called in a specific way | You need to verify an interaction occurred (use sparingly) |
| **Spy** | Records calls, asserts after the fact | You need to observe behavior without replacing it |

Prefer fakes and stubs over mocks. Over-reliance on mocks is a signal that the design is too tightly coupled — the test is verifying *how* code works instead of *what* it produces. If you find yourself mocking 3+ collaborators for a single unit test, flag the coupling and consider a design change. (See grill-and-refine's Testability Probe — AP3: Tight coupling.)

**Non-Determinism Injection** — never let tests touch non-deterministic sources directly:

- **Clocks** — inject `datetime.now` as a parameter or callable; never call it inside the function under test
- **RNG** — inject `random` or seed it explicitly in tests
- **Network/external services** — inject an HTTP client or use a fake; never make live network calls in unit tests
- **File system** — inject paths or use `tmp_path` fixtures; avoid hardcoded paths
- If a function under test calls `datetime.now()` or `random.random()` internally, it is untestable as written. Refactor to inject the source before writing the test.

Canonical injection pattern — use a defaulted parameter so production callers require no change:
```python
def create_session(now=None, new_id=None):
    return {"id": str(new_id or uuid4()), "created_at": now or datetime.now()}
```

**Characterization Tests (for existing code)** — when modifying code that has no existing tests, and where TDD (write failing test first) is not possible because the code already exists, write a characterization test first:

- Run the existing code against a known input and record the output
- Write a test that asserts that exact output — this captures current behavior as your oracle
- The characterization test must pass before and after your change
- If you cannot write a characterization test without full infrastructure running (live DB, live server), that is evidence of coupling issues (see grill-and-refine's Testability Probe — AP3, AP5). Write a mock-based bridge test as a temporary oracle, apply the structural fix, then replace the bridge with an injection-proof test.
- Characterization tests are permanent regression tests — save them in `tests/` alongside all other tests.

**Non-Testable Changes (edge case)** — config changes, renames without logic changes, typo fixes, or infrastructure with no observable behavior. When in doubt, write the test.

#### Batch Flags

| Flag | When to use |
|------|------------|
| `[ADDED]` | New code, new file, new function |
| `[MODIFIED]` | Changed existing code |
| `[FIXED]` | Bug fix |
| `[REMOVED]` | Deleted code or file |
| `[MOVED]` | Relocated code without logic change |

Format: `[FLAG]: short_reason — what/why`
Example: `[ADDED]: validate_email helper — validates email before registration`

Every batch that adds or modifies logic must include its test file(s) in `tests/`. A batch is not complete until its tests are saved and passing.

### Phase 3: Verify

**After all batches, run full verification and audit.**

1. **Run full test suite** — all tests pass
2. **Run lint and typecheck** — clean
3. **Logic clarity** — is every control flow path easy to follow at a glance? Nested conditions, multiple returns, and tangled logic are warning signs. If you need a comment to explain what the flow is doing, rewrite until it's obvious.
4. **Minimal dependencies** — has every new import or library been justified? Does the benefit clearly outweigh the cost? Prefer self-contained solutions.
5. **Error strategy audit** — is every failure case covered by a consistent strategy? No ad hoc patches or scattered try/except. State what can fail and how it is handled before writing the function.
6. **Performance audit** — is performance close enough to optimal that no one will need to "fix" it later with unprincipled optimizations? Messy workarounds are a symptom of code that wasn't efficient enough from the start.
7. **Single responsibility** — does each module/function do one thing and do it well?
8. **Scope audit** — no features beyond what the plan specified, no speculative abstractions, no unrelated fixes
9. **Surgical changes audit** — only required files touched. File-level `# Description:` comments preserved. New files include a description comment matching project convention.
10. **Flag audit** — every changed line carries a valid [FLAG] annotation with a clear reason
11. **Plan file unchanged** — read-only constraint verified

## General Methodology

### Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't requested
- No error handling for impossible scenarios
- Make it concise and straightforward — prioritize readability and maintainability
- If code is long and could be shorter, rewrite it shorter
- Structure control flow so bugs have nowhere to hide

### Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't revise, refactor, or "improve" code not related to the requirement
- Match existing style
- Flag unrelated dead code. Do not delete it.
- Never remove file-level description comments. You may edit them for accuracy after your changes, but never delete them.

When creating new files:
- Every new file must include a file-level description comment matching the project convention:
  - `.py`: `# filename.py` + `# Description: ...`
  - `.ts` / `.tsx`: `// filename.ext` + `// Description: ...`
  - `.css`: `/* filename.ext */` + `/* Description: ... */`
- The description must state the module's single responsibility in one concise line.

When introducing new dependencies:
- Add imports only to files you are actively modifying
- Only include imports directly referenced in your changes — remove any unused or duplicate imports

When your changes create orphans:
- Remove imports, variables, or functions that your changes made unused
- Do not remove pre-existing dead code unless asked

### Write Deep Modules
Aim for modules with a simple public interface that hides complex implementation:
- **Pull complexity inward** — if the caller (or the test) has to perform setup before calling your module, pull that setup inside the module
- **Hide configuration** — don't expose 8 parameters if 6 can be safely defaulted or calculated internally
- **Minimal surface area** — the fewer public methods a module exposes, the fewer test cases are required to verify it fully
- **Single responsibility** — a module that does one thing can be tested with a narrow set of inputs. A module that does four things requires exponentially more test cases.

A deep module test looks like: pass one or two inputs, assert the final output. No mocking of internals, no complex setup. If your test requires significant ceremony to reach a testable state, the module is too shallow.

### Failure Triage
When a test fails after a change, classify before acting. See "Failure Triage" table in `AGENTS.md`. Never auto-revert on first failure.

## Hand-off

Before declaring completion:
- Phase 1: Plan verified (7 gates ✅), batches mapped from task breakdown
- Phase 2: All batches implemented with TDD + flags, verified per batch
- Phase 3: Full test suite passes, lint clean, all 11 audits passed
- Plan file unchanged (read-only constraint verified)
- All TDD tests saved in `tests/` — no transient or deleted tests

---

## Outputs & Triggers

### Output
All code changes with `[FLAG]` annotations. Full test suite passes. All success criteria from the plan are met. Plan file is unchanged.

### Exit Declaration
State clearly: "**Implementation complete. Proceed to review the implementation?**"

### Next Step
User invokes `review-implementation` — **switch to Plan mode before proceeding**.