# Step 6: write and run JavaScript

Step 6 is available at `/<variant-id>?section=6` for all 25 variants. Original and new problems keep their existing steps.

Students start with a named function and write its body in a JavaScript editor with line numbers. Each function parameter has its own blank JSON input field. **Run my input** shows the return value and console messages. **Submit tests** checks eight fresh inputs per problem, or nine for the rune problem, and shows each result.

Code and input fields are saved locally. Editing code clears its previous test pass. Changing only custom inputs preserves the submitted code's pass. New runs, edits, navigation, and Stop cancel old work so late results cannot overwrite the current attempt.

## Errors and execution

The runner uses an opaque-origin sandboxed iframe and a worker, with network access blocked and a time limit. Acorn checks syntax without running the student's code. Runtime errors report editor lines and columns when the browser supplies a location. Timeouts and output-format errors do not invent a line number. Console output and returned data have size limits.

Each test gets a fresh run and its own input copy. Rune results and coffee-route lists allow any outer order; the order within a route still matters. Employee IDs must remain sorted. Undefined returns, non-finite numbers, circular values, and unsupported return types receive clear messages.

## AI help

The button is available before running and after errors. Clicking it sends the current student code, reference solution, named inputs, and available run or test results. The server numbers the student's lines and uses a separate JavaScript tutoring prompt. It distinguishes unrun code, syntax errors, runtime errors, and failed tests. Editing clears old AI feedback and cancels its pending answer.

## Authoring and checks

- `scripts/step6-inputs.js`: authored test inputs and descriptions.
- `scripts/step6-build.js`: imports the real source solutions and parameter names, checks every expected answer against a second implementation, rejects reused authored inputs, and checks coverage of all 74 Step 5 mistakes.
- `step6-specs-variant.json`: generated lesson data.
- `scripts/step6-runtime.js`: isolated browser execution.
- `scripts/step6-acorn.js` and its license: bundled JavaScript parser.

Regenerate with `node scripts/step6-build.js` and `node scripts/build-visual-data.js`. Run `node scripts/validate-visual-data.js`, `node scripts/test-step6-runtime.js`, and `node scripts/validate-step6-browser.js`.

`node scripts/validate-step6-ai.js` checks AI context without using API credits. A real streamed AI request was also checked against an actual editor error on line 2. Review reports record the independent checks and screenshots.
