# Code editor reliability audit — September 7, 2026

Six independent sub-agents covered keyboard editing, execution and persistence, runtime failures, input formats, fresh adversarial review, and browser compatibility. Additional rounds retested fixes and stressed console clearing. Native computer controls were used to paste, edit, indent, undo, and run code. Browser screenshots were captured and inspected in `tmp/editor-audit/`.

## Problems fixed

- Tab could delete selected code and bypass Undo. Selected lines now indent without replacement; native undo/redo preserves edits. Shift+Tab removes indentation. Selection boundaries, partial indentation, single-line selections, IME, and browser modifier shortcuts are handled.
- Browser storage failure silently discarded new code on reload. A visible warning now tells students to copy code before leaving; successful saving clears the warning.
- Invalid custom inputs were passed into student code. Run now validates types, graph structure, and source problem constraints, with input-specific feedback and focus. The existing validator's bounds were checked against the source repository's 25 problem constraints.
- Seven lessons had example fields that were invalid together. Step 6 now uses fixed, coherent examples authored in `scripts/step6-build.js`, validated during generation. These are independent of student answers and the grading cases.
- Scratch graph changes removed Ask AI Help. The button now returns immediately.
- A stalled AI request could stay pending indefinitely. Step 6 now times out after 45 seconds and offers retry, retaining the student's code. Tests simulate errors, stalled requests, retries, and cancellation after edits.
- Unhandled promise rejection and unusual thrown objects could be mislabeled as timeouts. They now produce actual errors; readable messages survive missing/throwing properties.
- Console format placeholders were not expanded, and profiling/marker methods could crash. Common format placeholders and harmless marker methods now work.
- Sparse arrays could display nulls that differed from the graded value. Return values now use one validated plain snapshot for grading and display, rejecting holes, accessors, nonfinite values, excessive size/depth, and unsupported values clearly.
- Repeated console.clear bypassed message limits. Streaming now caps at 301 updates with a visible notice. Completed runs still show the latest bounded logs.

## Evidence

- 17 real keyboard checks: typing, delete, copy, cut, paste, Undo/Redo, Tab/Shift+Tab, selection edges, Unicode/CRLF, Japanese composition, mobile layout, and 501-line scrolling.
- 91 input checks: every placeholder set, all 59 wrong-type parameter cases, valid simple formats and invalid scalar boundaries.
- All 25 lessons' 201 saved Submit tests passed in browser; content checks also cross-check source solutions and independent oracles.
- 10 execution scenarios: Run, Submit, wrong answers, input errors, Stop, edits during runs, reset, navigation, persistence, and recovery.
- Four AI recovery scenarios; the 45-second timeout was shortened only inside the test browser to exercise recovery promptly.
- 38 existing console scenarios and 29 additional runtime edge scenarios passed.
- 423 independent review checks, including validation of the 201 fixtures, unusual outputs, and bounded console stress. A 10,000-clear loop emitted 301 updates, completed with the latest log, and left the page responsive. A pending loop timed out and recovered.
- Eight compatibility checks passed in installed Chrome. Firefox and WebKit were unavailable and were not tested; no claim of cross-browser coverage is made.
- Storage warning, recovery, reload, and correct invalid-field focus checks passed.
- Existing visual-data, Step 6 content/browser, syntax highlighting, and Dig New Wells console UI checks passed.

Screenshots include `keyboard-mobile.png`, `keyboard-long-code.png`, `save-warning.png`, `execution-ai-timeout.png`, `execution-success.png`, and `cross-chromium-*.png`.

No problem claims, answer choices, correct solutions, or saved test inputs/answers were changed. Per `docs/distractor-review-rubric.md`, there are no changed distractors to blind-review. Changes target the active variant code editor. Archived original/new banks remain intact.

Public deployment uses only the five browser assets and third-party notices, with the existing Netlify functions.

Production deploy: `6a9ee383b3782a3d264d9730`, https://sss-jonathan-attempt.netlify.app. All five served browser assets match the tested staging files. Live-site checks passed all 17 keyboard cases, 10 execution cases, storage warning/recovery and field-focus checks, and Dig New Wells Run/8-test Submit/error/timeout/mobile console checks. Native computer-use verification also pasted code, indented it, undid indentation, entered custom input, and visually confirmed the formatted Set output.
