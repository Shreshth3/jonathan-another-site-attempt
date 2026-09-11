# Nested-array editor — September 10, 2026

The previous Array/Number editor applied only to Step 1. Step 2 still required path names such as `root[0]`, unique node labels, and separate value-marker fields.

All four active nested-array variants now use Array/Number nodes in Step 2 and the optional code-lab scratchpad: Busiest Shelf Level, Coins on Level K, Kth Song in Playlist, and Top of the Pile. Archived original/new lessons are unchanged.

Students enter their own nested array and any `k` parameter, then draw both graphs. Right-click or Type / value switches a node between Array and Number. Every array and number occurrence gets a separate node, including empty arrays and repeated numbers. The correct graph starts at its outer Array; no path names are displayed or entered.

Step 2 derives hidden occurrence paths and numeric markers from the student's drawing, checks it against their typed array, and runs the existing correct and mistaken searches. Correct drawings must be one containment tree. Mistaken drawings are matched structurally, allowing reversed arrows and disconnected nodes when the stated bug requires them. All original nodes must remain.

For each Array, children follow input order. Step 2 arrow numbers show global drawing order, so the existing “drop the last edge” bug remains unambiguous. Wrong-start questions name the first element of the outer Array. Coins' mistaken start has depth 0.

New drawing and draft keys prevent old path-based drawings from mixing with the new format. Old saved data is retained. AI help receives the correct editor rules and a clear instruction to keep internal paths private.

## Review and checks

Independent adversarial reviews covered duplicate values, empty arrays, ordering, reversed arrows, disconnected mistaken graphs, wrong starts, storage, and AI context. Reviewer findings were fixed and reviewed again. No blockers remained.

- `node scripts/validate-nested-step2-browser.js`: all eight active questions; valid and invalid drawings, input mismatch, right-click type controls, drafts, and mobile layout.
- `node scripts/validate-array-counter-grader.js`: 24 graph cases plus malformed/order checks.
- `node scripts/validate-nested-array-drawing.js`: existing Step 1 nested lessons, 72 builds/repairs, and 32 picture choices.
- Full data validation, exact Step 2 result checks, no-spoiler checks, archive/navigation checks, and code-lab browser checks.
- Native Chrome: added a node, right-clicked, selected Number, entered 7, and checked the rendered node.

No authored answer choices changed, so the distractor rubric requires no new blind choice review.

## Deployment

Published to https://sss-jonathan-attempt.netlify.app/ as deploy `6aa34d8e072c9b4a17bea456`. All four JS/CSS browser assets match the tested local files byte for byte. Served HTML differs only by Netlify's hosting metadata. Live Chrome confirmed the Array/Number menu and the input-before-drawing layout.

The extended browser checks also cover all four code scratchpads, navigation back to Step 2, and the AI request's editor options and private-ID instructions. Live AI text was not generated as part of this check.
