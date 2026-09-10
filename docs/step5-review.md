# Step 5 adversarial review

Reviewed 2026-09-04. **Approved: no known blocking issues remain.** Scope: 74 debugging questions across all 25 variant problems.

## Educational accuracy

- Read all 25 source problem statements and compared authored pseudocode with their correct solutions in `../jonathan-study-site/data/variants-final-*.json`.
- Compared the engine with 140 source examples and 1,250 deterministic generated inputs: **1,390 matching answers**. Generated expected answers came from the source solutions, not the new engine.
- Every authored bug has a valid exposing input. Each question changes one realistic problem rule; repairs are checked on additional inputs.
- Checked strict ordering for employee IDs and order-independent lists for routes/rune codes.
- Fixed predictable correct-first menu positions, two mismatches between combined edited rules and their displayed pseudocode, and input limits/self-loop rules. A separate fresh reviewer checked engine and grading after fixes, including extra-field interference and largest matrix inputs.

## Visual consistency

The frozen code is clearly labeled. Input, predictions, repair, and feedback appear in that order. The repair stays readable because the full selected rule wraps beneath its menu. Blank input/output fields contain no answers. Styling matches the existing lesson.

## Full gameplay

Computer-use testing completed all three resignation questions using independently chosen inputs, reaching **3 of 3 repairs passed**. Checked a correct counterexample with an unrepaired program (rejected), valid repair (accepted), editing after success (invalidates pass), reload (preserves drafts/progress), and final completion.

The durable browser suite covers all 74 questions. Root additionally verified the restart confirmation clears progress and returns to a blank first question. Original/new lessons retain four steps.

## Desktop and mobile

Computer-use inspection covered desktop and a **390 × 844** phone viewport. Code wraps, five step buttons fit, and phone controls remain usable. The final completion screen fits without horizontal scrolling. Root independently confirmed no mobile overflow.

Screenshots:

- `tmp/step5/desktop-question.png`
- `tmp/step5/mobile-question.png`
- `tmp/step5/cua-mobile-complete.png`

## Accessibility

Inputs have visible labels; repair menus have distinct accessible names. Frozen code is keyboard-focusable. Progress exposes its numeric value; feedback uses a live status region. Computer-use accessibility trees exposed all required controls. This was a focused accessibility check, not a full screen-reader audit.

## Test limitations

The computer-use adapter stalled on the native restart confirmation and subsequent viewport cleanup. The independent Playwright restart test passed. No product failure was observed from this tool interruption. Mobile testing used a browser viewport, not a physical phone.
