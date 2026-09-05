# Reviewer brief — DFS Visual Proof Library audit

## Context

This site (https://sss-jonathan-attempt.netlify.app, source at `/Users/shreshth/git-repos/jonathan-another-site-attempt`) teaches one struggling high-school student how to turn LeetCode-style DFS problems into graphs. Each of 75 problems has a 4-step lesson:

- **Step 1 "Visual proof"** — 9 questions: 4 "build" questions (student draws the graph from a raw input in a drawing tool, then answers a 2-choice question about the function's return value; the drawing is graded exactly against a hidden canvas) and 5 "concept" questions (4-choice multiple choice; a wrong answer forces a fresh "remedial" build).
- **Step 2 "Counterexample lab"** — 3 questions. A named character has one bug (e.g. "treats undirected links as arrows"). The student invents their own small graph, draws it twice (correct graph, character's graph), picks a start node, and types two outputs: the set of nodes the correct search reaches and the set the buggy search reaches. Both outputs are graded as exact JSON arrays sorted by node label.
- **Step 3 "Graph structure"** — 5 questions. Each shows a raw input, the drawing tool, and one generated Yes/No claim. Across the five questions, the claims cover node membership, direct edge vs reachability, local degree, direction, and an edge detail or reachability boundary. The graph and claim are graded together.
- **Step 4 "Trace lab"** — 3 code cases. Shows a real input, a buggy JavaScript solution, the drawing tool (student must draw the correct problem graph; node labels must match a hidden canvas EXACTLY), a box for the buggy code's exact returned value (graded as JSON), and 3 diagnosis choices.

An automated harness has already played every question of every problem through the real UI and saved a transcript: exactly what the student sees (text), the answer keys, the feedback for every choice, the hidden graded graphs, what output formats the grader accepts/rejects, and whether the correct answer was accepted. Transcripts are in `transcripts-md/<problem-id>.md` (human-readable) and `transcripts/<problem-id>.json` (raw).

The student "really struggles with programming and frequently misunderstands or misinterprets things". The owner wants EVERY deficiency that could trip the student up, waste their time, or confuse them.

## Your job

For each problem assigned to you, read its transcript **carefully and completely** and report every problem you can find. Think like a careful, literal-minded student who only sees what the transcript says is shown on screen (the "hidden"/"data"/"authored, NOT shown" parts are for you, the reviewer, to check correctness against).

Look for, at minimum:

1. **Wrong or debatable answer keys.** Work the problem yourself. Is the "correct" choice actually correct for that raw input? Is any "wrong" choice also defensible? For Step 1 build questions compute the real function output from the raw input yourself. For Step 4, run the shown code on the shown input with node (`/Users/shreshth/.nvm/versions/node/v22.16.0/bin/node`) if you doubt the declared buggy output, and sanity-check the declared correct output against the problem statement.
2. **Hidden requirements.** Anything the grader requires that the screen does not tell the student: exact node-label formats (compare the "Required graph (hidden)" node labels with the node-name guide actually shown on that screen; Step 2 and Step 4 often show NO guide), output formats (brackets, quotes, sort order), directedness, edge weights/colors, which start node, etc.
3. **Unclear, ambiguous, or misleading wording** in prompts, choices, labels, button text, feedback, headings, character-bug descriptions, and success/completion text. Jargon a struggling student wouldn't know. Instructions that say one thing while the grader checks another.
4. **Distractor quality.** Wrong choices that are nonsensical, that give away the answer, that are near-duplicates, or whose feedback is wrong/unhelpful. Feedback that explains a *different* mistake than the one the student made.
5. **Questions that don't test anything useful** (trivial, answerable without the graph, or the same question repeated), and questions whose raw input contradicts the graph rules or the problem statement.
6. **Step 2 specifics:** Is the character's bug description accurate for what the grader simulates? Is it possible for the student to know the wrong start node? Does "output" make sense for this problem (the field is labelled "Correct output" but the grader wants the reached-node set, not the problem's real answer — is that clear?). Is the mistake expressible for this problem at all (see harness FAILED results)?
7. **Step 3 specifics:** Are the generated claims grammatical, unambiguous, and actually true/false as keyed? Watch for claims that read as instructions ("Use this node rule…") rather than statements, edges written in a different order than the input, degree claims on directed graphs (in vs out), and claims about labels that aren't in the input.
8. **Step 4 specifics:** Does the code really produce the declared buggy output? Do the diagnosis choices make sense and is exactly one correct? Is the "graph proof" chain accurate? Are the hidden required node labels something a student could ever guess?
9. **Anything harness-flagged** (`HARNESS-DETECTED ERRORS`, FAILED results, rejected probes) — explain what it means for the student.
10. **Consistency across the problem:** Description tab vs lesson content; Step 1 label format vs Step 2/3/4 requirements; character names; numbering.

Be concrete. Quote the exact on-screen text. Do NOT pad with generic praise or speculation. If a problem is fine in some step, say so in one line.

## Output format

Write your findings to the file path given in your task, as markdown:

```
# Batch <n> findings

## <problem title> (`<id>`)

### Step 1
- **[SEVERITY] Short title.** What the student sees → why it's a problem → suggested fix. (Q number / task id)
...
### Step 2
...
### Step 3
...
### Step 4
...
### Cross-step / other
...
```

Severity scale: **BLOCKER** (student cannot pass or answer key is wrong), **MAJOR** (very likely to confuse or waste significant time), **MINOR** (polish / small clarity issue).

End the file with a section `## One-line summary of every finding in this batch` — one bullet per finding, formatted `- [SEVERITY] <problem-id> S<step>: <short description>`.
