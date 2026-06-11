# E2E Testing — IntroChat

<!-- AUTO-GENERATED SECTION — content hash: c61f8ee6156150b559165505f0a3d1f328f99b3a0cc49cf89e22512c27b79482 -->
<!-- Regenerate by running: skill(name: "generate-and-run-e2e-tests") -->

## Project Info
- **Package manager:** npm
- **Build command:** `tsc -b && vite build`

## WebServer Config
- **Command:** `uv run python -m app`
- **URL:** `http://127.0.0.1:5000`
- **Base URL:** `http://127.0.0.1:5000`

## Run Command
```bash
cd frontend && npx playwright test
```

## Test Scenarios

| Spec File | Scenario | Tests |
|-----------|----------|-------|
| `organizerFlow.spec.ts` | Organizer Flow | 1: Create event via UI, configure rooms/topics, save — 2: Edit event — verify state persists, remove defaults, save again — 3: Test event — full user flow through join, room, people, chat |
| `participantFlow.spec.ts` | Participant Flow | 1: Home page — join via event code input — 2: Save profile with auto-generated username — 3: Save profile with custom name — 4: Save profile, select room, verify people page — 5: Two-user match + chat page renders — 6a: Full chat flow — connection exchanged — 6b: Full chat flow — connection declined |

## Manual

<!-- Add notes, known issues, or custom setup instructions below this line. -->
<!-- Content below this marker is preserved across regenerations. -->

<!-- Example:
### Known Issues
- Test 6a occasionally flakes on slow CI runners — increase timeout to 60s

### Custom Setup
- Requires `data/e2e_test.db` to be writable
-->
