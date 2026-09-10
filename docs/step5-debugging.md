# Step 5: find an input and explain the repair

Only variants are active. Each challenge shows frozen pseudocode containing one realistic mistake. Students enter each actual function parameter separately, predict both exact outputs, then explain the mistake and how to fix it. No repair menus or object-shaped input form are shown.

Input and output placeholders illustrate types only; they do not depend on the student's input. Values accept ordinary number/boolean/list notation, comma-separated values without outer brackets, and one grid row per line. Text cells do not need quotes. Quoted strings remain supported. Parsing reads literal syntax without executing code. The interpreter verifies the counterexample and both outputs.

`step5-specs-variant.json` stores a correct explanation plus the repaired rule for all 74 challenges. `/api/grade-debugging` loads that reference on the server and uses `gpt-5.6-luna` to grade the explanation. It accepts equivalent wording and requires the specific mistake plus a valid repair. The API uses [structured output](https://developers.openai.com/api/docs/guides/structured-outputs) for its pass/fail response. Client-supplied reference answers are ignored.

After an incorrect explanation, students can choose **Read the correct answer**. The answer stays out of the visible page until that click. Grading outages allow retry without failing the student; edits/navigation cancel an old grade. Drafts survive reload, and edits invalidate an earlier pass.

Author programs in `scripts/step5-programs-{a,b,c}.js`, then run `node scripts/step5-build.js` and `node scripts/build-visual-data.js`. The legacy rule options remain in the authoring bank to describe and validate program semantics; they are not student repair controls.

Verification:

- `node scripts/validate-visual-data.js`: source and generated bank checks.
- `node scripts/validate-step5-grader.js`: trusted reference, evidence checks, model selection, outages, malformed responses and reveal.
- `node scripts/validate-step5-browser.js`: all 74 browser flows with a deterministic test grader.
- `STEP5_REAL_URL=http://localhost:4182 node scripts/validate-step5-browser.js`: the same flows with real Luna through the local preview.
- `node scripts/validate-coding-highlighting.js`: editor coloring, typing, drafts, incomplete syntax, scrolling and mobile.
- `node scripts/validate-variant-archive.js`: all active links and archived routes.

The current change passed all 74 browser flows with real Luna, all 201 Step 6 test cases, seven additional Luna paraphrase/incorrect-answer checks, and archive checks for all 50 inactive lessons.
