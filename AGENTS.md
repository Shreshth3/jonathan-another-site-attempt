# Current lesson steps (2026-09-09)

- Active variants show **Step 1 → Step 2 → Step 3**. The displayed Step 3 is the code lab (internal section 6; keep existing URLs and saved code). Steps 3–5 are hidden, including direct links; preserve their code and content.
- Step 2 shows the first **two** authored questions. Keep all three in the source pool.
- Keep the optional Step 2 shortcut after the first three Step 1 tasks pass without a mistake or skip.
- See [the dated summary and restore guide](docs/lesson-steps-2026-09-09.md) before changing this setup. Historical Step 3–5 instructions below apply to their preserved content, not current navigation.

# Current scope

- Unless explicitly stated otherwise, apply changes only to problems in the **variant** category.
- Leave original and new problems alone for now. We will sync those categories later.
- The variant list follows `variant-order.json`: parent groups use the user's pasted DFS curriculum order, and siblings use the manually reviewed easiest-to-hardest order. Do not replace this with global Easy/Medium/Hard or alphabetical sorting. Validate parent links against the source repo.

# Project source

This site imports and adapts problems from Jonathan's DFS practice site:

- Website: https://jonathan-algos-site.netlify.app
- Local source repo: `/Users/shreshth/git-repos/jonathan-study-site`

Use that site and repo when checking or importing the original problem content.

## Visual problem library

- Picker: https://sss-jonathan-attempt.netlify.app/
- Shareable lessons: `/<problem-id>` (for example, `/flood-fill`)
- Old `/visual/<problem-id>` links remain supported.
- The visual lesson is the entire product. Do not add the old multi-step mastery flow back.
- The browser loads only `visual-data.js`, `graph.js`, and `visual-library.js`.
- Step 2 is available at `/<problem-id>?section=2` and from the lesson header.
- Step 2 must accept student-designed graphs through simple node, start, and edge fields, compare the drawing to those fields, and calculate both the correct and buggy reachable sets. Never replace it with fixed stored inputs or answer-string lookup.
- Step 2 goals explain the task: invent a valid input that makes the mistaken search return a wrong answer, draw both graphs, and predict both outputs. Never suggest the graph shape, depth, branch placement, edge order, values, or other construction that exposes the bug. Keep necessary bug definitions and drawing/format rules clear. See [the spoiler review](docs/step2-no-spoilers-2026-09-09.md).
- Active nested-array variants use Array/Number nodes in Steps 1–2 and the code-lab scratchpad. Right-click changes type; numbers live on nodes. Step 2 checks the drawing against the student’s typed nested array, derives values internally, and preserves repeated values and empty arrays. Never restore visible `root[...]` names or separate value-marker fields. See [the editor fix](docs/nested-array-step2-2026-09-10.md).
- Step 2 retains exactly three authored single-misconception cases; active variants show only the first two. Never add a case with multiple misconceptions. Each problem has its own character name.
- Every active variant input/output text field must have a problem-specific format placeholder. Never derive placeholders from the current answer. Use separate fields per input variable, simple lists/grid rows, and no JSON instructions or strict JSON requirement.
- Step 3 is currently hidden; its preserved route was `/<problem-id>?section=3`. Variants show exactly three concise Yes/No claims with three exact graph builds; original/new retain five.
- In variants, prioritize node membership, direct edges versus reachability, and an edge-detail or reachability boundary. In original/new, across the five Step 3 claims, test node membership, direct edges versus reachability, local degree, direction, and one edge-detail or reachability-boundary idea. Show feedback only after submission.
- Every Step 3 membership claim must test an authored misconception about what becomes a node. Never use a trivial claim that a listed node remains a node because it is a leaf or has no edges in one direction.
- Steps 3 and 4 must not reveal a prewritten correct graph model. Their input and exact drawing requirements must still make strict grading fair.
- Step 4 is currently hidden; its preserved route was `/<problem-id>?section=4`. It uses at least three deep, real, problem-specific code-reasoning cases per problem.
- Each Step 4 case must test a different, realistic, single misconception with different incorrect code and an input that exposes that exact mistake. Never repeat one bug on several inputs.
- Step 4 must grade the exact graph, the code's graph-level behavior, and the real problem's exact output. Its shown code and declared buggy output must always agree.
- Step 4 feedback teaches `code rule → changed graph → reachable boundary → returned value`. Never make students trace every line.
- Author Step 4 in `step4-specs-*.json`, then regenerate and validate `visual-data.js`.
- Step 5 is currently hidden; its preserved variant route was `/<problem-id>?section=5` and from the lesson header.
- For Step 5, read each correct solution and identify its most likely problem-specific mistakes (usually 2–4). Author one question per mistake, with exactly that one bug.
- Show a frozen incorrect solution in pseudocode. Ask students to construct an input that exposes the bug and give both the correct output and the buggy output. Use one field per actual function input, with type-correct format placeholders. Outputs are direct values, with format examples. Do not ask for a JSON object. Then ask for a written explanation of the mistake and its repair; do not show repair menus.
- Execute the student's input to check the counterexample and both outputs. Grade the written explanation with GPT-5.6 Luna against the server-owned saved correct answer. Accept equivalent wording. After an incorrect explanation, offer a button to reveal the saved answer. API failures are retryable and never count as a wrong answer.
- Keep Step 5 source content and execution checks authoritative, regenerate `visual-data.js`, and review correctness and browser behavior before shipping.
- Step 6 is available for all variant problems at `/<problem-id>?section=6`. Students write a complete JavaScript solution in an editor with line numbers and syntax highlighting. Do not show the top test-progress strip.
- Provide one custom-input field per function parameter, a Run button that shows the output, and a Submit button that grades 5–10 diverse tests per problem. Test inputs must be distinct from examples used in earlier steps.
- Run student code in an isolated, cancellable browser runner with a time limit. Show syntax and runtime errors with accurate editor line numbers where available; never invent a location for a timeout.
- Step 6 Ask AI Help receives the correct solution, current student code, input, and available run/test results. Explain actual mistakes simply, including relevant student line numbers. Never claim unrun code passed or failed tests.
- Author Step 6 in `scripts/step6-build.js` and its fixtures, regenerate `step6-specs-variant.json` and `visual-data.js`, and validate the lessons and real browser execution.
- The active app contains only the 25 variant problems. Original and new problems are archived: hide them from the picker and disable their lesson routes. Keep their source banks (25 original and 25 new) intact for future use and variant parent links. `activeCategories` in `visual-library.js` is the explicit archive switch.
- Variant lessons use `practicePlan` in `visual-specs-variant.json` (mirrored in `visual-lessons-variant.json`): Step 1 serves five tasks (two builds and three checks), and Step 3 serves three. Keep the full authored pools for reuse and validation. A fresh remedial build follows a missed check.
- Offer the optional Step 2 shortcut immediately after the first three Step 1 tasks are passed without any mistake or skip. Save eligibility; keep the remaining tasks available. Reset clears eligibility.
- Every lesson retains the metro-style v3 authoring pool in `visual-lessons-*.json`: 4 exact scratch-graph builds, 5 visual checks, and a fresh remedial build after each missed visual check.
- Every Step 1 visual check shows a blank, optional drawing tool after its raw input and before its question and answers. The scratch drawing is not graded.
- Edit the authoritative `visual-specs-*.json` / lesson-authoring scripts, regenerate `visual-lessons-*.json`, then run `node scripts/build-visual-data.js` and `node scripts/validate-visual-data.js`.
- Wrong answers must describe believable student mistakes and include specific feedback. Never make the correct letter predictable.
- Use `docs/distractor-review-rubric.md` for blind distractor review before deployment.
