---
name: readiness-check
description: Gate check before writing any code — verify the plan passes all gates. If all pass, declare ready. If any fail, ask user for input and analyze to resolve. Trigger after grill-plan-and-refine, or when the user says "are we ready to code", "check readiness", "is everything considered", or similar.
---

## What I do
- Evaluate whether all pre-implementation gates are cleared
- If all gates pass, explicitly declare: "✓ Plan is great and ready to implement."
- If any gate fails, list what's missing, ask the user for input, then analyze user input + own knowledge + past chat context to resolve
- Loop until all gates pass, then give explicit go signal
- Confirm go/no-go before the first line of code is written

## Gates
**Only write code when all gates are clear.**

Check each of the following:

| # | Gate | Pass Criteria |
|---|---|---|
| 1 | Context | All necessary context and information has been gathered |
| 2 | Assumptions | All assumptions have been confirmed as valid |
| 3 | Edge Cases | All edge cases and alternatives have been explored and resolved |
| 4 | Ambiguities | All ambiguities have been resolved |
| 5 | Soundness | The approach is logically sound and functionality will work as intended |
| 6 | Testing | A TDD testing strategy with specific test cases is defined |
| 7 | Success Criteria | Verifiable success criteria are defined for every task |

## On Failure

When a gate fails:
1. Clearly list which gates failed and why
2. Ask the user for relevant input
3. Analyze the user's input + your own knowledge of the codebase + the past chat session context to resolve the gap
4. Update the revised plan accordingly
5. Re-check all gates

State clearly on pass: "✓ All gates pass. The plan is great and ready to implement. Shall I proceed?"
