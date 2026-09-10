# Student input formats

Active variant lessons do not require JSON entry. Each function parameter has its own labeled field with a format example. Output fields use the problem's return type. Examples are fixed format examples, never calculated from the student's input.

- Numbers: `3`.
- Booleans: `true` or `false`.
- Lists: `0, 2` or `[0, 2]`.
- Text lists: `red, blue`; quotes also work.
- Grids: one comma-separated row per line, or nested brackets.
- Nested lists: `[6, [2, 9]]`.
- Node/edge markers retain their labeled `node=value` or `from->to=value` format, with a matching placeholder.

`parseLessonValue` reads these values without evaluating code. Step 2 semantic fields and outputs, Step 4 output checks, Step 5 evidence, and Step 6 custom runs use it. Existing quoted/bracketed entries and saved drafts remain supported. The graph rename field also has a context-specific example.

Author metadata in `step2-specs-variant.json` and `scripts/step6-build.js`. Shared format examples and parsing live in `visual-library.js`. Archived categories remain unchanged.

Run `node scripts/validate-plain-inputs.js` to check all 150 variant step pages, 621 input/output cases, all 25 custom runs, and invalid-text rejection. Step 5 and Step 6 browser suites also cover their full grading flows.
