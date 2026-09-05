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
- Step 2 has exactly three single-misconception cases. Never add a case with multiple misconceptions. Each problem has its own character name.
- Step 2 output fields must not contain placeholder answers or example values.
- Step 3 is available at `/<problem-id>?section=3`. It has exactly five concise Yes/No claims total, with one claim beside each of five exact graph builds.
- Across the five Step 3 claims, test node membership, direct edges versus reachability, local degree, direction, and one edge-detail or reachability-boundary idea. Show feedback only after submission.
- Every Step 3 membership claim must test an authored misconception about what becomes a node. Never use a trivial claim that a listed node remains a node because it is a leaf or has no edges in one direction.
- Steps 3 and 4 must not reveal a prewritten correct graph model. Their input and exact drawing requirements must still make strict grading fair.
- Step 4 is available at `/<problem-id>?section=4`. It uses at least three deep, real problem-specific code-reasoning cases per problem.
- Each Step 4 case must test a different, realistic, single misconception with different incorrect code and an input that exposes it.
- Step 4 must grade the exact graph, the code's graph-level behavior, and the real problem's exact output. Its shown code and declared buggy output must always agree.
- Step 4 feedback teaches `code rule → changed graph → reachable boundary → returned value`. Never make students trace every line.
- Author Step 4 in `step4-specs-*.json`, then regenerate and validate `visual-data.js`.
- The library must contain exactly 25 original, 25 variant, and 25 new problems.
- Every lesson uses the metro-style v3 structure in `visual-lessons-*.json`: 4 exact scratch-graph builds, 5 visual checks, and a fresh remedial build after each missed visual check.
- Every Step 1 visual check shows a blank, optional drawing tool after its raw input and before its question and answers. The scratch drawing is not graded.
- Edit the authoritative `visual-specs-*.json` / lesson-authoring scripts, regenerate `visual-lessons-*.json`, then run `node scripts/build-visual-data.js` and `node scripts/validate-visual-data.js`.
- Wrong answers must describe believable student mistakes and include specific feedback. Never make the correct letter predictable.
- Use `docs/distractor-review-rubric.md` for blind distractor review before deployment.
