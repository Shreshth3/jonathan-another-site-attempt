# Lesson steps — September 9, 2026

## Before this change

The active site had 25 variant problems with Steps 1–6. Original and new problems were already archived.

- Step 1: five tasks selected from a larger pool (two graph builds and three visual checks), with a fresh remedial build after a missed check. Passing the first three tasks without mistakes or skips offered a choice to move to Step 2. Students could keep practicing instead; eligibility survived reloads and reset cleared it.
- Step 2: three questions. Students designed an input and drew correct and mistaken graphs, then predicted both outputs. Each question tested one mistake.
- Step 3: three Yes/No graph claims with exact graph builds.
- Step 4: problem-specific incorrect code, exact graph reasoning, and correct/buggy output checks.
- Step 5: frozen incorrect pseudocode. Students supplied counterexamples and outputs, then explained the bug and repair. AI graded the explanation against saved answers.
- Step 6: a JavaScript editor, custom inputs, Run, Submit tests, and AI help.

## Current behavior

Students see **Step 1 → Step 2 → Step 3**. Following the same-day naming correction, the code lab is displayed as Step 3. Internally it remains section 6, preserving its URLs and saved code; `sectionLabel()` maps visible numbers to the active order. The header lets students return from the code lab to Step 2. Steps 3–5 are hidden from navigation, and their old direct URLs display Step 1. Their code, content, and saved progress keys remain intact.

Step 2 shows the first two questions in their existing order. Its third question remains in the authored pool. Existing progress is capped at two for display, and skips from the third question do not affect completion. Loading alone does not overwrite the old saved progress.

Step 1 and its optional shortcut are unchanged. No automatic jump was added.

## Where everything is saved

The full working site from before this change is committed as **27c287f**, tagged **before-step-simplification-2026-09-09**. This checkpoint includes the earlier uncommitted lesson, editor, and server changes. Local temporary screenshots and staging folders remain in `tmp/`; they are not needed to restore the product.

No lesson content was deleted:

- `visual-library.js`: all six step renderers and grading behavior. `variantPractice` controls visible steps and the Step 2 question count; `authoredCounterexampleRounds()` retains the full pool.
- `step2-specs-variant.json`: all three authored Step 2 questions per problem.
- `visual-specs-variant.json` and `visual-lessons-variant.json`: Step 1 pools and Step 3 practice selections.
- `step4-specs-variant.json`: Step 4 cases.
- `step5-specs-variant.json`, `scripts/step5-*`, and `netlify/functions/grade-debugging.mjs`: Step 5 content, execution, and explanation grading.
- `scripts/step6-build.js`, its fixtures, and `step6-specs-variant.json`: Step 6.
- `visual-data.js`: generated browser lesson bank, including hidden content.

## Restore later

To restore the hidden steps while keeping newer work, change `variantPractice` in `visual-library.js` to `{ sections: [1, 2, 3, 4, 5, 6], step2Questions: 3 }`. Navigation and Step 2 completion follow that order automatically. Update AGENTS.md and navigation checks to match, regenerate, validate, then deploy.

For an exact separate copy of the earlier site, run:

```sh
git worktree add ../jonathan-before-step-simplification before-step-simplification-2026-09-09
```

This leaves the current checkout intact. Its code can be inspected, copied, or deployed after checks.

## Checks

- Regenerated `visual-data.js`; all 75 retained lesson banks passed validation.
- Browser checks cover all 25 active variants: navigation, two-question completion, old hidden links, saved progress, and the code editor.
- Existing Step 1 checks cover shortcut eligibility, reload, continued practice, mistakes, skips, and reset.
- No prompts or answer choices changed. Under `docs/distractor-review-rubric.md`, there are no new or edited distractors to blind-review.

Public deployment stages only `index.html`, `styles.css`, `graph.js`, `visual-library.js`, `visual-data.js`, and `THIRD_PARTY_NOTICES.md`, with the existing Netlify functions bundled separately. Saved server answers and source banks are not published as standalone files.
