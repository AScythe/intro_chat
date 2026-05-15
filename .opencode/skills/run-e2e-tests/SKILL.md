---
name: run-e2e-tests
mode: build
description: '[Build mode — standalone] Run Playwright E2E tests against all app pages — Home, Join (optional name), Save, Room, Chat — including a two-user matchmaking flow. Auto-installs Playwright + Chromium, builds the SPA, starts the app with a temp database, runs tests, reports results.'
---

## What I do
> **Standalone skill** — not part of the core dev workflow. Invoke manually after any implementation that changes page behavior, form logic, or navigation flow.

- Check if `@playwright/test` is installed — if missing, run `npm install -D @playwright/test && npx playwright install chromium`
- Build the frontend SPA via `npm run build`
- Run `npx playwright test` — Playwright manages the app server lifecycle (start, wait for port, kill on exit) via `webServer` config
- Report pass/fail per scenario
- Stop on any error — a failed build or test suite means something is broken

## Documents to Read

- `frontend/playwright.config.ts` — verify webServer config, base URL, test directory
- `frontend/tests/e2e/userFlow.spec.ts` — review test scenarios if adding new ones

## Workflow

### 1. Install Playwright (if missing)
Check `frontend/node_modules/@playwright/test`. If absent:
```bash
cd frontend && npm install -D @playwright/test && npx playwright install chromium
```

### 2. Build the SPA
```bash
cd frontend && npm run build
```
If build fails, report the error and stop. Do not run tests against stale artifacts.

### 3. Run E2E Tests
```bash
cd frontend && npx playwright test
```
Playwright's `webServer` config handles:
- Starting `python -m app` with `DB_PATH` set to `data/e2e_test.db` (temp database)
- Waiting for port 5000 to be ready
- Killing the server on exit

### 4. Report Results
- All tests pass → "✅ All E2E tests pass"
- Any test fails → report which scenario failed with error message

## Test Scenarios

| # | Scenario | What it verifies |
|---|----------|------------------|
| 1 | Home page loads | Event code input, Create/Join buttons visible |
| 2 | Join page renders | Optional name field, LinkedIn/Slack fields, Save enabled |
| 3 | Save auto-generated username | Empty name → `User_XXXXX` in POST body, success state |
| 4 | Save custom name | Entered name in POST body, success state |
| 5 | Two-user match + chat page | Match created via API polling, chat page renders |

## Edge Cases

- **Port 5000 in use** — Playwright `webServer` reports the conflict; skill reports the failure
- **Chromium not installed** — Skill auto-installs via `npx playwright install chromium`
- **Build fails** — Skill stops and reports build error
- **Temp database** — `e2e_test.db` is created in `data/` and cleaned up on server exit (or manually)
- **Tests already running** — `reuseExistingServer: !process.env.CI` allows reusing a running server in dev

## Output

Exit with clear pass/fail. If any test fails, the user should investigate before proceeding with other work.
