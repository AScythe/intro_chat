---
name: pre-code-checklist
description: Gate check before writing any code — verify all assumptions are confirmed, ambiguities resolved, the approach is logically sound, and if functionality will work as intended. Trigger after analyze-requirements or grill-plan, or when the user says "is eveything considered", "are we ready to code", "check if we are ready to proceed", or similar.
---


## What I do
- Evaluate whether all pre-implementation gates are cleared
- Block coding if any gate is red and loop back to `analyze-requirements`
- Confirm go/no-go before the first line of code is written

## Guidelines

### Pre-Code Checklist
**Only write code when all gates are clear.**

Proceed to implementation only when:
- Necessary context/info has been gathered.
- All assumptions are confirmed.
- All edge cases and alternatives have been explored and resolved.
- Ambiguities are resolved.
- Shared understanding and clarity has been reached.
- The proposed approach is logically sound and functionality will work as intended.