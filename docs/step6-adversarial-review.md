# Step 6 adversarial review

Reviewed September 4, 2026. Scope: all 25 variant problems. No deployment performed.

## Finding and fix

An uncaught error inside `setTimeout` or `queueMicrotask` reported the next editor line. A deliberate error on line 2 appeared as line 3. The iframe's worker error handler now subtracts the Function constructor's two added lines only when the error belongs to `step6-student.js`. Errors elsewhere receive no guessed editor location. Runtime source-line bounds now also handle CR and CRLF line endings.

Both callback regressions and all three newline forms are covered in `scripts/test-step6-runtime.js`. That suite passes after the fix.

## Checks completed

- Read the runtime, build, fixtures, Step 6 UI, shared output comparison, and AI handler.
- `node scripts/step6-build.js --check` passes: 25 variants, 201 distinct fresh inputs, and all 74 known Step 5 mistakes exposed. Expected outputs agree with the original site's JavaScript and the separate Step 5 checker. Each problem has 8 tests, except runes with 9; no problem has a single constant expected answer across its suite.
- Fixture review covers boundary cases, disconnected regions, direction, shared paths, depth, sorting, exact thresholds, and problem-specific return rules. Grid cases include narrow and rectangular shapes. Path comparisons ignore outer answer order only where the problem permits it.
- Browser runtime checks cover syntax and ordinary runtime lines, top-level errors, recursion, invalid returned values, missing function, promises, capped logs, timeouts without invented locations, cancellation, fake result messages, blocked network calls, and absent document/storage access.
- Independent visible Chrome checks against `http://localhost:4176` rejected a constant wrong solution with 0/8 passes. Named JSON errors identified the parameter. Valid JSON strings reached the function unchanged. Stop removed the runner iframe.
- A mocked AI endpoint in visible Chrome received all eight submitted results. After editing, it received the new code and inputs with no stale test results. This verified request contents, not model-generated advice.
- `node scripts/validate-step6-ai.js` passes. Server context includes numbered current code, reference code, inputs and available errors/results. Instructions explicitly avoid claiming unrun tests failed and accept different correct approaches.

## Signoff

The confirmed error-line issue is fixed and regression-tested. No further blocking issue was found in this adversarial review. This is a Chrome runtime and source review; it does not claim a separate Firefox/Safari run or a live AI quality evaluation. The root review owns final generated-data validation and the all-lesson browser pass.
