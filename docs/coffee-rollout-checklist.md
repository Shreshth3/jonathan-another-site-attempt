# Coffee lesson changes to apply across the library

This is the acceptance checklist for all 75 lessons.

## Whole lesson

- Keep the lesson focused. Remove decorative labels, repeated directions, keyboard-help paragraphs, format reminders, and other text that does not help the student complete the current action.
- Use **question** for a small activity inside a step. Never call it a separate problem.
- “Skip to next question” stays inside the current problem and current step.
- Remove the top-right **All problems** button and old mastery-flow copy.
- Make graph layouts visibly different across questions instead of starting every graph in the same shape.
- When a numeric node is deleted, the next new node reuses the smallest missing number.

## Step 1

- Show the raw input, then the graph canvas immediately.
- The student draws before answering the output question.
- Remove repeated headings, build counters, generic graph-building rules, and “your drawing must be exact” reminders.
- Every Step 1 question shows the drawing tool after its raw input and before its question and answers. Concept-question drawings are optional and ungraded.

## Step 2

- The main goal is short: expose one character’s one mistake by drawing the correct graph and then the character’s graph.
- Every problem has exactly three questions. Every question contains exactly one misconception.
- Never create a boss question, final two-mistake question, or any instruction to expose multiple mistakes.
- Put both graph drawings above all predictions or other answer fields.
- Use this order everywhere: correct graph, character’s graph, correct output, character’s output.
- Let the student open graph #2 at any time; graph #1 does not have to be finished first.
- In graph #2, provide **Duplicate graph from #1** as an optional starting point.
- Infer nodes and edges from the drawings. Do not make the student type the same node list, start node, or edge list again.
- Infer a fixed start from the problem when possible; otherwise represent the start directly in the drawing instead of duplicating the graph in a text form.
- Keep only genuinely problem-specific visual information that cannot be inferred, such as marking the coffee-cart node Amber.
- Require both drawings to be internally consistent and to differ exactly as the stated misconception requires.
- Predictions use clear labels: **Predicted output on correct graph** and **Predicted output of [character]’s graph**.
- Leave both Step 2 output boxes empty. Do not show placeholder answers or example values inside them.
- Strictly grade the real output format, including brackets, separators, ordering, and the correct data type. Do not accept a loose semicolon list when the problem requires a JSON list.
- The graph order and prediction order must match.

## Step 3

- Show the raw input without a redundant “Mini-example input” label.
- Put the exact graph build before the three Yes/No claims.
- Keep exactly five concise claims total, one beside each exact graph build.
- Across those five claims, cover node membership, direct edge versus reachability, local degree, direction, and one edge-detail or reachability-boundary idea.
- Do not reveal a prewritten correct graph model.
- Reveal claim feedback only after all answers and the graph are submitted.
- Remove extra case labels, headings, directions, and repeated check-button instructions.

## Step 4

- Use at least three deep, real, problem-specific code-reasoning questions.
- Make every question test a different, realistic, single code mistake. Never repeat one bug on new inputs.
- Show the raw input and graph build before the code and answer fields.
- Do not reveal a prewritten correct graph model.
- Grade the exact graph, the code’s graph-level behavior, and the exact returned value.
- Keep the code, declared buggy output, and grading logic consistent.
- Keep feedback concise and teach: code rule → changed graph → reachable boundary → returned value.
- Remove decorative case labels, repeated drawing directions, code-window slogans, and generic microcopy.

## Proof required before deployment

- Generated lesson data contains exactly 25 original, 25 variant, and 25 new problems.
- All 75 lessons pass structure and content validation.
- All 225 Step 2 questions have exactly one misconception.
- Automated checks cover the actual rendered fallback paths, not only saved JSON.
- Representative desktop and mobile playthroughs cover all four steps, success and failure, drawing switches, duplication, skipping, and output-format rejection.
- Fresh reviewers separately check teaching quality, visual quality, gameplay, desktop, mobile, and accessibility; important findings are fixed and reviewed again.
