# Step 2: remove construction hints — September 9, 2026

## Change

All 75 authored Step 2 questions for the 25 active variant problems now use a neutral goal:

> Create a valid input where the mistaken search returns a different answer from the correct solution.

Students still draw the correct graph and the character's mistaken graph, then predict both outputs. Instructions no longer suggest a graph shape, depth, branch placement, edge direction, or particular values that would expose the bug. This includes the saved third question, even though only two questions currently appear.

The goal is separate from the drawing rules. Necessary details remain: character mistake, mistaken starting node, edge numbering, arrow controls, colors, valid input rules, and output formats. Flooded-campsite search still explains that flooded neighbors are skipped before choosing a branch; it no longer suggests a dead end and a second branch.

## Source and preservation

- `step2-specs-variant.json`: authoritative revised goals.
- `visual-library.js`: separates the task from drawing rules.
- `visual-data.js`: regenerated browser data.
- `scripts/validate-visual-data.js`: permits shared neutral goal text for variants. Archived original/new checks remain unchanged.
- `scripts/validate-step2-no-spoilers.js`: browser review of all authored variant questions.

Only goals changed in the Step 2 source bank. Bugs, grading, inputs, and outputs remain intact. Original and new problem banks are unchanged. The earlier construction hints remain available in Git at commit `fef019e`; do not put them back into the initial student prompt.

## Review

Two independent sub-agents reviewed this change: one for adversarial content review and one for browser testing. The content review covered all 75 goals, shared pre-answer text, input help, and necessary drawing rules. It identified the flooded-neighbor rule as a detail to preserve; that fix was made and re-reviewed.

The distractor rubric's no-giveaway rule applies. Step 2 has no multiple-choice answer options to shuffle or balance.

Validation includes the full lesson-data validator, all 225 retained Step 2 starter counterexamples, and 37 actual-engine regression cases. The regression harness needed no-op browser event hooks to load the current app; its grading assertions were unchanged. Browser review checks all 50 active questions plus the 25 preserved third questions using test-only access; production still shows two questions.

Final review: both sub-agents approved with no blockers. The browser reviewer checked 125 question renders (50 active plus all 75 authored), read the visible instructions and placeholders, and verified blank drawings, empty answers, required bug details, and completion. Save the Date was also visually checked on desktop and mobile.
