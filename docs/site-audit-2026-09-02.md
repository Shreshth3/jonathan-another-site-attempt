# Site audit — every problem, every step (2026-09-02)

## How this audit was done

- An automated harness opened the real site in a headless Chrome and played **every question of all 75 problems, all 4 steps** (9 Step 1 questions including the 5 remedial builds, 3 Step 2 rounds, 5 Step 3 rounds, 3 Step 4 code cases = 20 to 25 graded screens per problem, about 1,700 screens total). It drew the required graphs in the real drawing tool, clicked the real buttons, and recorded exactly what the screen said and what the grader accepted or rejected.
- It also tried "reasonable but slightly different" answers (for example `0, 1` instead of `[0,1]`, or `True` instead of `true`) to see how strict the grader is.
- Every transcript was then read by a reviewer that worked each question by hand (and ran each Step 4 code snippet on its input) looking for wrong answer keys, confusing wording, hidden requirements, bad distractors, and questions that don't test anything.
- The source code of the lesson engine (`visual-library.js`, `graph.js`) was read to confirm the cause of anything that looked like a bug.
- Where things live: the per-problem transcripts (exactly what each screen shows, plus the hidden answer keys) are in `docs/audit-2026-09-02/transcripts/`, the raw reviewer notes in `docs/audit-2026-09-02/reviewer-findings/`, and the replayable harness in `scripts/audit-harness/` (run `audit-harness.js --workers 1` with the node binary under `~/.nvm/versions/node/v22.16.0/bin`; it needs the Playwright install at `/Users/shreshth/git-repos/try-5.4-computer-use/node_modules/playwright`).

Severity used below: **BLOCKER** = the student cannot pass, or the answer key is wrong. **MAJOR** = very likely to confuse or waste real time. **MINOR** = polish.

---

## Part 1 — Problems that affect the whole site (fix these first)

### 1.0 BLOCKER — Wrong answer keys and impossible inputs (verified against the data)

These are individual questions where the site's own answer is wrong, so the student is marked wrong for being right. The first six were re-checked by hand; the rest were reported by the reviewers and are listed under their problems in Part 2.

- **Evaluate Boolean Binary Tree, Step 1 build `case-4`** (`values=[3,1,2,0,1], edges=[[0,1],[0,2],[2,3],[2,4]]`): the root is AND(true, OR(false, true)) = **true**, but the key says `false` ("Evaluating children before their parent makes the root false").
- **Gold and Silver Lights, Step 1 concept `concept-counterexample`** (`wires=[[0,1],[1,2],[1,4],[0,3],[3,5]]`): bulbs 0, 2, 4 **and 5** are an even distance from bulb 0, so the answer is 4, but the key says 3 and the feedback for 4 wrongly says bulb 5 is not gold.
- **Detonate the Maximum Bombs, Step 1 remedial `remedial-3` and Step 3 question 5** (`bombs = [[0,0,1],[1,0,4],[5,0,1]]`): the hidden answer graph contains the arrow C→B, but C has radius 1 and B is 4 away, so that arrow cannot exist. A correct drawing is rejected, and the Step 3 claim "The correct graph has C→B …" is built on the same wrong graph.
- **Ladder Takahashi, Step 4 cases 1 and 2**: the two cases' diagnosis texts are swapped. Case 1 (`[[4,1],[4,10]]`) says the answer is about "the pair [8,3]", which is not in its input; case 2 (`[[1,4],[4,3],[8,3]]`) says "[4,1] is stored only as 4→1", but its pair is `[1,4]`. Neither case has a true correct choice.
- **Path Sum, Step 4 case 2** (`[1,2,null,3], targetSum=3`): the correct choice and proof text ("prefix 5→3 equal 8") are copied from case 1 and are false for this input.
- **Milk Factory, Step 4 case 1**: the correct choice talks about `next[b].push(a)`, but the code has no `next`; the real bug line is `reverse[firstValue].push(secondValue)`.
- Reviewer-reported, see Part 2: Time Needed to Inform Step 1 `informTime=[4]` for a leaf breaks the problem's own constraint; Longest Freight Train Step 4 case 3 has an L-shaped train that the statement forbids; Milk Factory Step 2 rejects the problem's own example shape ("A directed tree needs exactly one root"); Water and Jug and Word Search grade different graph conventions in different steps for the same input; Evaluate Division and the four other weighted problems grade edge weights in mixed formats (`0.5` vs `1/3` vs `×2`); Is Graph Bipartite, Keys and Rooms, Number of Islands, Properties Graph and Course Schedule have "wrong" choices that are literally true statements.

### 1.1 BLOCKER — Step 4 secretly requires node names the student is never told (about 30 problems)

- **What happens:** In Step 4 the student must draw the graph, and the grader compares every node name letter-for-letter against a hidden answer graph. Step 4 shows no "Required node-name format" box at all. In about 30 problems the hidden names are not the plain names taught in Step 1. Examples of what the student would have to type, with no hint:
  - Find if Path Exists: `0 source`, `1`, `2 destination`
  - Course Schedule: `course 0` … `course 3` (case 1) but plain `0`, `1`, `2` in cases 2 and 3
  - Keys and Rooms: `room 0`, `room 1` plus an edge label `key 0`
  - Kill Process: `process 1`, `process 3`, `process 5`, `process 10`
  - Possible Bipartition: `person 1` … `person 7` in all three cases
  - Number of Provinces: `city 0`, `city 1`, `city 2`
  - Network Delay Time: `2 source`
  - Time Needed to Inform: `head 0, delay 1`, `manager 1, delay 5`, `employee 3`
  - Smallest String With Swaps: `index 0: b`
  - Water and Jug case 3: `0,0` without parentheses, although the taught format is `(0,0)`
  - Flatten Nested List: `outer list`, `inner list`, `deeper list`, `1`, `2`; Nested List Weight Sum: `1 at depth 1`; Weight Sum II: `1 depth 1`
  - Busiest Shelf Level and Coins on Level K: `box A`, `box B`, `box C`
  - Detonate the Maximum Bombs: `A (0,0), r=5` (case 1), `bomb 0` (case 2), `center bomb` / `east bomb` (case 3)
  - Evaluate Division: edge labels `×2` and `×1/2` (the `×` character is not on a keyboard)
  - Evaluate Boolean Binary Tree: `AND`, `true`, `false`; Path Sum / Tree Sum / Max Root-to-Leaf: bare values like `5`, `-10`
  - Moocast: `0:p3`; Properties Graph: `row 0`; Reachable Nodes: `1 restricted` (taught: `1 (restricted)`); Dungeon Gold Run, Shut the Valve, Employee Importance: bare ids although Step 1 taught `id:value` names.
- **Why it matters:** The only feedback is "× The drawing has every exact node". The student can never pass these cases. Often case 1 uses one naming scheme and cases 2–3 use another, so even after solving one case the next one fails.
- **Fix:** Regenerate every Step 4 canvas with the exact same node-name format as Step 1 (the `nodeLabelFormat` pattern), and show the "Required node-name format" box in Step 4. Never require characters like `×`.

### 1.2 BLOCKER — Six Step 1 build questions cannot be completed (empty graphs)

- Hackerrank Connected Cells, Count Sub Islands, Find All Groups of Farmland, Max Area of Island, Maximum Number of Fish, and Tree Sum each have a build question whose input has no nodes at all (for example `grid=[[0]]` or `root level-order=[]`).
- The answer buttons only unlock after the student adds a node. But the correct drawing has zero nodes, so if they add a node to unlock the buttons, the graph check fails ("no missing or extra node"). The question is a dead end; the only way out is "Skip to next question", which marks it skipped.
- **Fix:** unlock the answer buttons when the expected graph is empty (or drop these inputs from the build slot and use them as concept questions).

### 1.3 BLOCKER — Step 3: the three Yes/No claims always have the same answer

- In every one of the 375 Step 3 questions the three claims are all "Yes" or all "No" (verified for 100% of questions the harness saw). Once the student knows one answer, the other two are free.
- **Cause (code):** `stableChoiceSlot(text, 2)` in `visual-library.js` decides Yes/No by the parity of an FNV hash. Parity of that hash is just the XOR of the characters' parities, and the three seed strings (`…:membership:N`, `…:relation:N`, `…:degree:N`) have the same parity, so all three claims flip together.
- **Fix:** use a proper hash bit (for example `(hash >>> 8) & 1`) or independent random seeds per claim, and make sure mixed answers are common.

### 1.4 MAJOR — Step 2 wants an output format it never describes

- The two boxes are labelled only "Correct output" and "<Name>'s output". The grader requires a JSON array of the node names the search reaches, sorted by name, with numbers bare and everything else quoted: `[0,1,2]`, `["(0,0)","(0,1)"]`, `["root","root[0]"]`, `["L","LL","LR","R","RL","root","RR"]`, `["a","ab","ε"]`.
- Rejected by the grader in testing: `0, 1`, `{0,1}`, `["0","1"]` (numbers in quotes), `[1,0]` (not sorted), `[(0,0)]` (coordinates without quotes). The sort order for letters is strange (`root` sorts between `RL` and `RR`; `ε` sorts last) and impossible to guess.
- "Output" is also misleading: it is not the problem's real answer (Battleships returns a count; Course Schedule returns true/false; here the box wants the list of reached nodes). The authored hint text (for example "vertices reachable from source") exists in the data but is never displayed.
- **Fix:** show a one-line format hint next to the boxes ("Type the reached node names as a list, smallest first, like `[0,1,2]` or `["(0,0)","(0,1)"]`"), accept any order and loose formats, and rename the boxes ("Nodes the correct search reaches").

### 1.5 MAJOR — Step 2 rejects the node names Step 1 just taught (23 problems)

- Step 2 shows no node-name guide, but enforces a different naming rule than Step 1. A student who names nodes the way Step 1 required gets an error only after clicking Check. Problems: Detonate Bombs (`A`, `B` → must be `0`, `1`), all nested-list problems (`root=[]`, `root[0]=1` → must be `root`, `root[0]`), Letter Combinations (`empty prefix` → `ε`), Runes (`start` → `ε`), Smallest String (`0:d` → `0`), Dungeon Gold Run (`0:1g` → `0`), Shut the Valve (`1:5` → `1`), Employee Importance, Evaluate Boolean Tree (`0:OR` → `root`, `L`, `R`), Fence Planning, Max Root-to-Leaf, Moocast, Path Sum, Properties Graph, Reachable Nodes (`3 (restricted)` → `3`), Tree Sum, Codewars Array Deep Count.
- The `ε` root name cannot be typed on a normal keyboard; if the student renames that node they cannot get it back.
- **Fix:** use one naming rule per problem across all four steps, and show it in Step 2.

### 1.6 MAJOR — Step 2 hides facts the student needs to predict the buggy output

- **Wrong-start rounds (35 rounds):** the text only says "<Name> runs the search from a different source vertex". Which one is revealed only inside the title of Drawing 2 ("Wrong source vertex: 1"), which many students will not open before predicting.
- **"Treats undirected links as arrows" rounds (17):** the arrow direction in the character's graph is whichever node the student clicked first when drawing each two-way edge. Nothing says this, and the correct drawing shows no direction.
- **First-branch / last-branch / drop-last-edge rounds (80):** "first branch" means the edge the student drew first, and "last" means drawn last. The only hint is "Edge numbers show drawing order". "Follows only the first available branch and never comes back" is really a greedy walk that stops at the first dead end; students will read it as a normal DFS.
- **Drawing 2 direction toggle:** for "make two-way" / "make one-way" bugs Drawing 2 must have the "Directed edges" box flipped compared with Drawing 1; this is never stated.
- Several rounds are only solvable with a hidden shape requirement (for example Kill Process round 1 only works if the killed process is not the root; Evaluate Division rounds need variables in different components; Battleships / Constellations wrong-start rounds need the wrong start in a different ship). The authored "goal" text that explains this exists in the data but is never shown.

### 1.7 MAJOR — Step 3 claims are built from the wrong input and read like instructions

- The "node rule" claim quotes a wrong rule written for the Step 1 concept question, so it mentions values that are not in the Step 3 input (for example "repeated copies of 3" when the input is `graph = [[2],[2],[]]`, or "Only the digit 2 or digit 3" when `digits = ""`). Sometimes the "wrong" rule is actually true for the shown input (Find if Path: "Only 0, 1, and 2 …" is correct when n = 3, but the key says it is wrong).
- Claims are phrased as commands ("Use this node rule for the graph: “…”") followed by "Correct? Yes / No", which is hard to parse.
- On one-node inputs the direct-edge claim becomes "(0,1) can reach itself without using an edge, but the graph still has no direct (0,1)—(0,1) edge" — meaningless to a beginner.
- Edges in claims are written backwards from the input ("2—1 and 1—0" for `edges = [[0,1],[1,2]]`).
- After a wrong answer the feedback for a true claim starts with "Correct." or "Right." under a red ×, so it looks like the student was right.

### 1.8 MAJOR — Step 4 code cases repeat and the proof text is sometimes a code slug

- In all 75 problems the three Step 4 cases use the identical code and identical bug; only the input changes. The diagnosis sentences are often word-for-word the same, so cases 2 and 3 test nothing new but still require 10–16 exactly named nodes each.
- In 23 cases the "Reachable boundary" line shown in feedback is an internal slug such as `count-container-nodes`, `zero-based-depth`, `ignore-found-keys`, `listener-wait-time`.
- "Code rule" sentences are copied from case 1 into cases where they are false (for example "The code creates only 1→0 and 2→1" on a different input).
- Wrong diagnosis choices are easy to spot by wording: 157 of the 450 wrong choices contain "should", only 3 correct ones do; wrong ones also end in "for the shown graph" / "changing this input's returned value".
- Output box strictness: strings must be quoted (`"ba"`), `True`/`False` are rejected, arrays must be in the code's exact order even when the problem statement says "any order" (All Paths, Kill Process, Letter Combinations, Runes, Farmland). The placeholder "Example: false, 3, or [1, 2]" is the only hint.

### 1.9 MAJOR — Step 1 build questions are 50/50 guesses and give no explanation

- All 300 build questions have exactly two answer choices. When the student picks the wrong one the screen only shows "× The decision matches the finished picture"; the authored explanation for the wrong choice is never displayed.
- 100 of the 375 concept questions put the question text inside the grey "raw input" box and then repeat it as the heading, under a drawing tool titled "Optional: draw this input before answering" (there is no input to draw).
- Many builds reuse the Description tab's examples verbatim, so the answer is printed on the left side of the screen.

### 1.10 MAJOR — Edge weights and colours are graded but never explained

- Five problems grade edge labels (Network Delay Time, Evaluate Division, Keys and Rooms, Package to the Outpost, Save the Date) and one grades edge colours (No Transfers, Please). The checklist line "Edge labels or weights match the input" appears only after a failed check. No screen says that an edge needs a label, what text to put on it (`5`? `0.5`? `1/3`? `×2`?), or how to add one (double-click the edge, or select it and press F2 / "Rename"). Evaluate Division mixes `0.5` and `1/3` in the same lesson.
- **Fix:** show a one-line instruction on weighted problems ("Label each arrow with its number: double-click the arrow") and accept equivalent numbers.

### 1.11 MINOR — Layout and small site-wide things

- In Step 2 the two drawing tabs ("1 · Correct graph", "2 · <Name>'s graph") sit at the very bottom of the canvas, below the status line, so a student may never notice there is a second drawing to make. The output boxes sit above the drawings even though the design checklist says drawings come first.
- The "#1", "#2" drawing-order badges on edges are small orange text and easy to miss; they are the only clue in first-branch / last-branch / drop-last-edge rounds.
- The drawing canvas is tall, so on a laptop the actual question and answer buttons in Step 1 are below the fold; a student can miss that there is a question at all.
- The "Edge width" slider is decorative and appears in Steps 1, 2 and 4 but not Step 3.
- The "Examples" tab is hidden until two builds are finished and then silently appears.
- "Skip to next question" marks the question skipped, but Step 1 remedial builds after a wrong concept answer still count as "passed" in the progress strip ("9 of 9 visual checks passed · 5 corrections").
- The Step 2 start box shows "Example: 0" as a placeholder even when the value is fixed and read-only, and the field label repeats itself ("CHOOSE THE SOURCE VERTEX / source vertex").
- Character names change every round, and the same first names are reused across problems, which adds nothing.
- Step 4 case 1 shows its input as `key: value` lines while cases 2–3 show `key = value` text.
- Phone layout works (no horizontal overflow, Lesson/Problem switcher present, code window fits).

---

## Part 2 — Problem-by-problem findings

### All Paths From Source to Target (`all-paths-from-source-to-target`, original)

#### Step 1
- **[MINOR] Q9 bug-trap answer is printed in the Description tab.** Q9 asks "In graph = [[4,3,1],[3,2,4],[3],[4],[]], how many different paths run from 0 to target 4?" — this is Description Example 2, whose text says "There are five different ways to travel from node 0 to node 4." Q1/Q3 likewise reuse Example 1 with its output shown. Fix: use a fresh input for the bug-trap. (Q9 `bug-trap`)
- **[MINOR] Q9 distractor feedback is jargon.** "6 paths" → "This treats the dead-end-free branches as freely interchangeable and invents a route." A struggling student cannot parse "dead-end-free branches … freely interchangeable". Rewrite as e.g. "You counted 0→1→2→4, but there is no arrow 2→4." (Q9)
- **[MINOR] `relation-rule` remedial does not test the rule and its distractor feedback is false.** Input `graph = [[],[0],[]]`, correct `[]`. Wrong choice `[[0,1,2]]` is explained as "That result follows the reverse arrows bug" — reversing gives only 0→1; nothing ever enters node 2, so the reversed graph ALSO returns `[]`. No reading of this input yields `[[0,1,2]]`. (S1 remedial after `relation-rule`)
- **[MINOR] Same input built three times.** `[[1,2],[3],[3],[4],[]]` is Q4 (build-merge), the `bug-trap` remedial, and Step 4 case 1. (Q4 / remedial 5 / S4 case 1)

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" invites the problem's real answer, which is rejected.** Step 1 asked "What should the function return?" nine times with answers like `[[0,1,3]]`. Step 2's field "CORRECT OUTPUT" (no hint anywhere) actually wants the reached-node set, e.g. `[0,1]`. For this problem the two look almost identical (`[[0,1]]` vs `[0,1]`), so the student will type the path list and be marked wrong with no explanation. Fix: relabel "Nodes the search reaches (e.g. [0,1])". (S2 Q1–Q3)
- **[MINOR] Field is titled "CHOOSE THE SOURCE NODE" but is read-only** (prefilled "0", `readonly=true`). Say "Source node: 0 (fixed)". (S2 Q1–Q3)
- **[MINOR] Q3 prompt says "Edge numbers show drawing order" but the harness recorded `edge drawing-order numbers visible: false`.** If the numbers really do not render, the only hint for what "last available branch" means is gone. Verify in the UI. (S2 Q3 `last-branch`)

#### Step 3
- **[MAJOR] Wrong-answer feedback starts with "Correct."** After answering NO to "0 and 2 are directly connected, not merely reachable through a longer route." the student sees "× Correct. The mini-example lists 0→2 as one direct edge." An × mark followed by "Correct." reads as a contradiction. Same in Q1 variant 1 ("× Correct. The mini-example lists 1→2…") and Q5 ("Right. A multi-step route through 3…"). The verdict cue is not being stripped for these claim types. (S3 Q1, Q3, Q5 — appears in every problem in this batch)
- **[MINOR] Membership claims quote values that are not in the shown input.** Q1 (`[[2],[2],[]]`): rule text "such as 0→1→3 and 0→2→3" and feedback "Node 3 still exists" — no node 3, no 0→1. Q2 (`[[],[0]]`): "One node only for indices 0, 1, and 2…" / "Node 3 still exists" — only indices 0 and 1 exist. Q4 (`[[1,2],[2],[]]`): "including repeated copies of 3". (S3 Q1, Q2, Q4)

#### Step 4
- **[MAJOR] Cases 2 and 3 are copies of case 1.** Identical code, identical bug title "One visited set erases a valid path", identical three diagnosis sentences (only reordered), identical correct choice. After case 1 the student just re-picks "The search treats a shared merge node as permanently finished." twice. Two of three cases test nothing new. (S4 cases 2, 3)
- Verified by running the code: buggy outputs `[[0,1,3,4]]`, `[[0,1,3]]`, `[[0,1,2,3]]` are right; required labels `0`–`4` match the Step 1 guide. Diagnosis distractors are clearly wrong. Fine.

#### Cross-step / other
- Label format is consistent across all four steps (`0`, `1`, …). Fine.

### Battleships in a Board (`battleships-in-a-board`, original)

#### Step 1
- **[MINOR] Q2 Picture D feedback describes the wrong mistake.** Picture D drops `(2,3)`; feedback says "This drops an item that still exists even when it has no outgoing move." `(2,3)` has a neighbour `(1,3)`; the sentence is a directed-graph template pasted onto an undirected grid. (Q2 `exact-picture`)
- **[MINOR] Heavy input reuse.** Example 1's board is Q1, Q2, Q7 and S4 case 2; `[["X",".","X"]]` is Q6 (build), Q9 (bug-trap) and S4 case 3. Q9 asks the count the student just gave in Q6. (Q6/Q9)
- **[MINOR] Q9 wording.** "What does the one-row board [["X",".","X"]] contain?" — the choices are ship counts but the question does not ask for a count. Use "How many ships…". (Q9)
- All build/remedial answers verified (2, 1, 2, 1; 3, 1, 1, 2, 2). Fine.

#### Step 2
- **[MAJOR] Q1 hidden requirement: the drawing must contain a cell named `(0,1)`, the start must not be `(0,1)`, and on a legal board the start must not even touch `(0,1)`.** Priya's fixed wrong start `(0,1)` is only revealed after clicking Check ("Also draw (0,1), the wrong first ship cell used by the broken search.") or in Drawing 2's title. On a real board, any start that shares a side with `(0,1)` — `(0,0)`, `(0,2)`, `(1,1)` — is part of the same ship, so Priya reaches the same cells and there is no counterexample. The answer the grader accepted (nodes `(0,0)`, `(0,1)`, `(0,2)`, edge only `(0,1)—(0,2)`, start `(0,0)`) is an impossible board: `(0,0)` and `(0,1)` are side-by-side X's with no edge. A student who obeys the ship rules has to guess "start at least one cell away from (0,1), e.g. (2,0)". Fix: tell the student Priya starts at (0,1) up front, or let the student choose Priya's start. (S2 Q1 `wrong-start`)
- **[MINOR] Q2 "Owen builds every listed connection except the last one."** A board has no listed connections; "last one" means the last edge the student drew. Say "the last edge you draw". (S2 Q2)
- Output format for this problem is `["(0,0)"]` (quotes required); the screen never says so.

#### Step 3
- **[MINOR] Several "mistaken" node rules give the identical graph for the shown input, so the keyed answer is debatable.** Q1 `[[".","X"]]`: "Only the leftmost or topmost X of each ship should be a node" and "Each whole horizontal or vertical ship should be one node" — a one-cell ship yields the same single node either way, yet "It would be a mistake" is keyed YES. Q2 `[["X","X"]]`: "Every board cell, both X and ., should be a ship node" — there are no `.` cells, so the rule gives the same graph; keyed NO. Q4 `[["X","."],[".","X"]]`: "Each whole ship should be one node" — both ships are one cell. (S3 Q1, Q2, Q4)
- **[MINOR] "× Correct. A zero-step path makes (0,1) reachable from itself…"** shown after a wrong answer. (S3 Q1)
- Degree/edge claims verified correct as keyed for all five questions.

#### Step 4
- **[MINOR] Cases 2 and 3 repeat case 1's bug, code and diagnosis sentences.** (S4)
- Buggy outputs verified (0, 0, 0); real outputs 2, 2, 2 correct; labels `(0,0)` match the Step 1 guide. Diagnosis feedback "That bug would return 3, not 0." is helpful. Fine.

### Course Schedule (`course-schedule`, original)

#### Step 1
- **[MINOR] Q4 and Q8 are the same input `[[1,0],[0,1]]`**, which is Description Example 2 with its explanation; Q7 is Example 1; Q1 is Example 3. (Q1/Q4/Q7/Q8)
- **[MINOR] `relation-rule` remedial admits it does not test the rule, and its distractor feedback is false.** `numCourses = 2, prerequisites = [[1,0]]` → "true": "either orientation is acyclic here, but the exact picture is 0→1". The wrong choice "false" is attributed to "the reverse pair semantics bug" — reversing the arrow still returns true. (remedial 3)
- All build/remedial answers verified (true, false, true, false; true, true, true, false, true). Fine.

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" on a true/false problem.** The Description says "Return true … and false otherwise" and Step 1 answered true/false nine times. Step 2's "CORRECT OUTPUT" box wants `[0]` (courses reached from the inspected course). Typing `true` is rejected with no hint. (S2 Q1–3)
- **[MAJOR] Q2 hides that the student must inspect course 0 and that Jasper secretly starts at course 1.** Screen: "Jasper runs the search from a different course to inspect." The authored goal ("Use course 0 as the chosen course, but make the mistaken search begin at course 1") is not shown; the start field is free text, so a student who inspects course 1 can never expose Jasper. (S2 Q2 `wrong-start`)
- **[MINOR] Q1 requires Drawing 2 to be undirected** (grader: "character's graph must be exactly: UNDIRECTED"); nothing says to switch the "Directed edges" toggle. (S2 Q1)

#### Step 3
- **[MINOR] "Use this node rule: Only courses that appear somewhere in prerequisites"** is asked on `[[1,0]]` (n=2) and `[[1,0],[2,1],[0,2],[3,2]]` (n=4), where every course appears — the rule gives the identical graph; NO is keyed. (S3 Q1 variant 1, Q2)
- **[MINOR] "× Correct. The mini-example lists 0→1 as one direct edge."** after a wrong answer. (S3 Q1)
- All 15 claims verified correct as keyed.

#### Step 4
- **[BLOCKER] Case 1 requires labels `course 0`, `course 1`, `course 2`, `course 3`; cases 2 and 3 require `0`, `1`, `2`.** Step 1/3 guide: "Use each node's 0-based number only. Example: 2." A student who draws `0`–`3` as taught fails case 1 with only "× The drawing has every exact node". (S4 case 1)
- **[MAJOR] Distractor "The search should begin only at course 0, changing this input's returned value." is literally TRUE for cases 2 and 3.** With only `search(0)`, the shown code returns `true` on `[[1,0],[2,1]]` and on `[[1,0]]` (the correct answers) instead of `false`, because on those inputs the false is produced by the outer loop re-entering an already-visited course 1. A literal student who traces this picks it and is told "No. A cycle could exist in a disconnected group, so all courses must be checked." — true in general, but not an answer to "does it change this input's returned value". Fix: reword the distractor so it is false on these inputs, or drop cases 2–3. (S4 cases 2, 3)
- **[MINOR] Misconception title "A merge is mistaken for a cycle" is wrong for cases 2 and 3** (a chain and a single edge; no merge). In fact the shown code returns `false` for every input with at least one edge (verified: `canFinish(2,[])` → true, all three cases → false). (S4 cases 2, 3)
- **[MINOR] The outer loop variable is named `column`** (`for (let column = 0; column < numCourses; …)`) in a course problem. (S4 code)
- Buggy outputs verified (false, false, false); real outputs true, true, true. Case 1 diagnosis fine.

### Detonate the Maximum Bombs (`detonate-the-maximum-bombs`, original)

#### Step 1
- **[BLOCKER] `relation-rule` remedial requires an edge that does not exist.** Input `bombs = [[0,0,1],[1,0,4],[5,0,1]]`. Real reach: A→B (distance 1 ≤ 1), B→A (1 ≤ 4), B→C (4 ≤ 4). C→B would need distance 4 ≤ C's radius 1 — false. The hidden required graph is "A→B, B→A, B→C, C→B" (confirmed in `visual-lessons-original.json`, remedial-3 canvas). This remedial is shown right after the student is corrected on the edge rule ("When j's center is at most i's radius away from i's center"); a student who applies that rule draws the right graph and is failed. Fix: delete the C→B edge from the canvas. (S1 remedial after `relation-rule`; same canvas reused in S3 Q5)
- **[MINOR] Q2 distractor feedback names a bug that does not produce the value.** `[[0,0,1],[4,0,1]]`, wrong "2" → "compare diameter not radius bug": diameter 2 is still less than distance 4 (so is the radius sum 2). No plausible bug returns 2. (Q2)
- **[MINOR] Q7 and Q9 are Description Examples 1 and 2 verbatim**, whose explanations give the answers. (Q7/Q9)
- Other builds verified (2, 1, 3, 1) and remedials (2, 2, 3, 3, 3) — the numeric answers are right; only remedial 3's drawing is wrong.

#### Step 2
- **[MAJOR] Step 1's taught labels A, B are rejected:** "Use numeric IDs 0, 1, 2, ... with no gaps." Shown only after Check; placeholder "Example: 0" is the sole hint that the naming changed. (S2 Q1)
- **[MINOR] Q3 "Rosa stops reading one relation too early and drops the final edge."** Bomb edges are computed from distances, not read from a list; "final edge" means the last edge drawn. (S2 Q3)

#### Step 3
- **[BLOCKER] Q5 uses the same wrong canvas** (`[[0,0,1],[1,0,4],[5,0,1]]` with the bogus C→B). A correct drawing is rejected ("× Every exact direct edge is drawn"). The direct-vs-reach claim also states a false premise: "The correct graph has C→B and B→A, so it should also contain a direct C→A edge." (S3 Q5)
- **[MINOR] "× Right. A multi-step route through B…"** after a wrong answer (Q1 variant 1). (S3 Q1)
- Q1–Q4 claims verified correct as keyed.

#### Step 4
- **[BLOCKER] Three different secret label schemes, none matching Step 1's A/B/C.** Case 1: `A (0,0), r=5`, `B (4,0), r=1`, `C (8,0), r=5`. Case 2: `bomb 0`, `bomb 1`, `bomb 2`, `bomb 3`. Case 3: `center bomb`, `east bomb`, `west bomb`, `north bomb` (the student must also map `[4,0,4]`→"east", `[-4,0,4]`→"west", `[0,4,4]`→"north"). No guide is shown; the taught `A`, `B`, `C` fails all three. (S4 cases 1–3)
- Buggy outputs verified (3, 4, 4) and real outputs (2, 3, 2); diagnosis choices fine.

#### Cross-step / other
- Node naming changes at every step: Description/Step 1/Step 3 say `A, B, C`; Step 2 demands `0, 1, 2`; Step 4 demands three other formats.

### Evaluate Division (`evaluate-division`, original)

#### Step 1
- **[BLOCKER] Edge weights are graded against hidden strings in mixed formats and the screen never says weights are required.** Every build checks "Edge labels or weights match the input" against hidden labels: Q1 wants `b→a = "0.5"` but `c→b = "1/3"` in the same drawing; Q2 wants `"0.25"`; the predict-output remedial wants `"0.5"`, `"1/3"`, `"0.25"` together; the bug-trap remedial wants `"1/3"` and `"0.5"`. The only guide shown is "Required node-name format: Use the exact variable name from the input only. Example: rate1." Nothing tells the student (a) that weights are graded, (b) that an edge is labeled by selecting it and pressing "Rename" (the field then says "Edge label"), or (c) that 1/2 must be written `0.5` while 1/3 must be written `1/3`. Typing `1/2`, `.5`, `0.33` or leaving weights off fails with "Not exact yet… The correct model stays hidden." and "× Edge labels or weights match the input". Fix: show the exact edge-label list (call the unused `exactEdgeDetails()`), or compare weights numerically (accept `1/2`, `0.5`, `.5`). (Q1 `build-chain`, Q2 `build-reciprocal`, Q4, Q6, all 5 remedials)
- **[MAJOR] Wrong-answer feedback is an internal bug id turned into a sentence.** Q4: "That result follows the unknown self or target equals one bug, not the exact picture."; Q6: "…follows the reject zero edge path bug…"; remedials: "…the multiply across components bug", "…the store forward edges only bug", "…the ignore reciprocals bug". A struggling student cannot parse "reject zero edge path". Write the mistake in plain words ("This treats a/a as unknown; a is a known variable, so a/a = 1."). (Q4, Q6, remedials)
- **[MINOR] 17-digit float as an answer choice.** Bug-trap remedial choices are "0.16666666666666666 | -1" and the "Why" says "The reverse query succeeds only when reciprocal edges are stored." Show `1/6` (or round) so the student can recognize 1/2 × 1/3.

#### Step 2
- **[MAJOR] Step 1 teaches two arrows per equation; Step 2 silently expects one arrow per equation, and drawing what Step 1 taught makes the mistake unexposable.** Step 1 Q7's correct answer is "a→b with weight 2, and b→a with weight 1/2." In Step 2 the harness's accepted correct graph was just `a→b, b→c` with no reverse arrows and no weights. If the student draws the reciprocal pairs (a→b, b→a, b→c, c→b): in Q1 Imani "builds every listed connection except the last one" drops only c→b, and the set reached from a is still {a,b,c} → "× The graph exposes the mistake" with no explanation; in Q3 (June's hidden wrong numerator is `b`) reciprocal arrows make every component symmetric, so a and b always reach the same set and the round can only be passed by putting a and b in different components — the authored goal "Choose a start variable that is not listed first and has a different ratio component" is never shown. Tell the student explicitly that Step 2 uses one arrow per equation with no weights, or simulate reciprocals. (S2 Q1 `drop-last-edge`, Q3 `wrong-start`)
- **[MAJOR] "OUTPUT" for a division query is a number, but the box wants a list of variable names.** The fields read "CHOOSE THE QUERY NUMERATOR" then "OUTPUT / CORRECT OUTPUT / IMANI'S OUTPUT". A query's output in this problem is e.g. 6 or -1; the grader wants `["a","b","c"]` (quoted, alphabetical). No denominator is ever chosen, so the "query" has no answer. Rename the fields to "Variables reached from the numerator" or explain that output = reachable variables. (all 3 rounds)

#### Step 3
- **[BLOCKER] Same hidden weight-string requirement as Step 1.** All 5 graphs end with "× Edge labels or weights match the input" unless the student types the hidden mixed formats (Q1: `"3"`, `"1/3"`, `"2"`, `"0.5"`; Q2: `"5"`, `"0.2"`; Q5: `"0.5"`, `"1/3"`, `"0.25"`). See Step 1.
- **[MAJOR] Q2 claim/feedback says the input "lists" an edge it doesn't list.** Input `equations = [["m","n"]], values = [5]`; claim "n can reach m, but there is no direct n→m edge." is keyed NO, and the feedback reads "The mini-example lists n→m as one direct edge." The input lists only m/n; n→m is the inferred reciprocal. A literal student sees no n→m in the input. Reword: "m/n = 5 also gives the reverse edge n→m = 1/5."
- **[MAJOR] Membership claims quote values from a different input.** Q3 (`values = [2,4]`) quotes "Two numeric nodes: 2 and 3."; Q4 (variables p,q,r) quotes "Two nodes: the equation `a/b` and the equation `b/c`."; Q2/Q5 feedback says "Intermediate variables such as b are needed to connect a query like a/c" for inputs with no a/c query.
- **[MINOR] Wrong-answer feedback begins "Right."/"Correct."** Q1 variant 0, Q3, Q4: under a red × the student reads "Right. A multi-step route through v creates reachability…" and "Correct. The mini-example lists a→b as one direct edge."

#### Step 4
- **[BLOCKER] Case 1 requires edge labels `"×2"` and `"×1/2"`; cases 2–3 require `"2"`/`"0.5"`/`"3"`/`"1/3"` and `"4"`/`"0.25"`.** No guide is shown ("Node-name guide shown: NONE"). The multiplication sign × (U+00D7) is not on a keyboard, and the format flips between cases. The checklist item "Edge labels or weights match the input" fails with no hint. (case 1 `authored-deep-case`)
- **[MAJOR] All three cases are the same bug with the same correct sentence.** "Reverse equations keep the same weight" ×3; correct choice "The reverse edge should carry the reciprocal weight." appears in all three (only the letter moves). After case 1 the student just re-clicks it; cases 2–3 test nothing. (cases 2–3)
- **[MAJOR] Copy-pasted "Code rule" is false for cases 2 and 3.** All three show "Code rule: Both directions receive weight 2." Case 2 has values [2,3]; case 3 has values [4] — no weight 2 exists there. Case 1's "Reachable boundary: The query walks against the written equation." is also too vague to teach anything.
- **[MINOR] Correct output displayed as `[0.16666666666666666]`** (case 2). Show 1/6 ≈ 0.16667.

#### Cross-step / other
- Weight representation is different in every step: Step 1/3 `0.5` and `1/3`; Step 4 case 1 `×2`/`×1/2`; Step 4 cases 2–3 `2`/`0.5`; Step 2 no weights at all. Pick one and print it.

---

### Find if Path Exists in Graph (`find-if-path-exists-in-graph`, original)

#### Step 1
- **[MAJOR] Q9 gives the answer away in the question.** "Which conclusion correctly decides reachability from 0 to 5 in components {0,1,2} and {3,4,5}?" — telling the student the graph is two separate components is the whole task. The correct choice "No edge crosses between the two components, so 0 cannot reach 5." merely restates the question. Ask "does 0 reach 5?" without naming the components. (Q9 `bug-trap`)
- **[MINOR] Q7 choices are sentence fragments.** Under "Which graph reasoning is correct for this case?" the options are "[2,0] points the wrong way", "the cycle blocks DFS", "through 0→1→2; the direct pair cannot be used", "[2,0] is a usable two-way edge". Choice C is not a readable sentence. (Q7 `predict-output`)
- **[MINOR] Bug-id feedback.** "That result follows the assume all listed vertices connect bug", "…the connect isolated destination bug", "…the stop after first failed branch bug", "…the check only source neighbors bug". Same fix as evaluate-division.

#### Step 2
- **[MAJOR] Q1: Lila's arrow direction is the click order of an edge the student drew as two-way, and Drawing 2 must have arrows switched on.** "Lila mistakes undirected links for arrows." The harness drew edge 1—0 by clicking 1 then 0, so Lila's required graph is `DIRECTED · 1→0`. A student who clicks 0 then 1 gets Lila's arrow 0→1, from source 0 she reaches {0,1} = correct, and the round fails "× The graph exposes the mistake" with no hint. Drawing 1 shows no arrowheads, so the student cannot see which way their edges "point". Also "character's graph must be exactly: DIRECTED" means the student must flip "Directed edges" on for Drawing 2; nothing says so, and "Duplicate graph from #1" copies an undirected graph. State: "Lila reads each line as an arrow from the first node you clicked to the second."
- **[MINOR] Q3: Esme's source is hidden until Drawing 2.** "Esme runs the search from a different source vertex." Her source `1` is only in Drawing 2's title. To expose it the student must put 1 in a different component from their chosen source (authored goal "Use a nonfirst source whose component differs from the first vertex's component" is not shown). Picking 1 as source gives the error "Choose a source vertex different from the broken search's 1."
- **[MINOR] Output box wants `[0,1]` (vertices reached) while the problem returns `true/false`.** The label "CORRECT OUTPUT" contradicts the Description tab.

#### Step 3
- **[MAJOR] Q2: the quoted "wrong" node rule is right for this input, and the feedback names vertices that don't exist.** Input `n = 3, edges = [[0,1]]`. Claim: "Use this node rule for the graph: “Only 0, 1, and 2 because only those labels appear in an edge.”" keyed NO. For n = 3 the correct nodes ARE 0, 1, 2; and 2 does not appear in any edge, so the rule contradicts itself. Feedback: "Vertices 3, 4, and 5 still exist." — there are no such vertices. Same rule/feedback reused in Q5 (`n = 4`, all of 0–3 appear in edges; "vertices 3, 4, and 5" again) and Q1 variant 1.
- **[MINOR] Claims list edges backwards from the input.** Q1: "The correct graph has 2—1 and 1—0…" for `edges = [[0,1],[1,2]]`; Q4: "2—0 and 0—1" for `[[0,1],[1,4],[0,2],…]`.
- **[MINOR] "Right." under a red ×.** Q1 variants 1–2, Q5: "Right. A multi-step route through 1 creates reachability, not a new direct edge."

#### Step 4
- **[BLOCKER] Cases 1 and 3 require node labels `"0 source"`, `"2 destination"` / `"0 source"`, `"3 destination"`; case 2 requires plain `"0"`, `"1"`.** Step 1/3 taught "Use each node's 0-based number only. Example: 2." No guide in Step 4. A student who draws 0, 1, 2 fails "× The drawing has every exact node" in case 1, and a student who then learns "0 source" fails case 2 with it. (cases 1, 3)
- **[MAJOR] Copy-pasted "Code rule" is wrong for cases 2 and 3.** All three show "Code rule: The code creates only 1→0 and 2→1." Case 2's input is `edges = [[1,0]]` (no 2→1 exists); case 3's `[[1,0],[2,1],[3,2]]` also creates 3→2.
- **[MAJOR] Same bug thrice.** "An undirected edge is stored one way" ×3; correct choice "Each undirected edge must be stored for both endpoints, changing this input's returned value." ×3. Cases 2–3 test nothing new.

#### Cross-step / other
- Step 1 Q1, Q2, Q7 and the Description's Example 1 all use the same triangle `n = 3, edges = [[0,1],[1,2],[2,0]]`; fine but repetitive.

---

### Flatten Nested List Iterator (`flatten-nested-list-iterator`, original)

#### Step 1
- **[MAJOR] The "exact picture" choices use a different node vocabulary from the drawing guide directly above them.** Q2 pictures label nodes "Outer array", "Array at [0]", "1 at [0][0]", "2 at [1]" while the guide says "Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7." A student who copies the picture labels into the next build fails. (Q2 `exact-picture`)
- **[MINOR] "What should the function return?" for a class with `next()`/`hasNext()`.** The Description defines `NestedIterator`, not a function; the build question never says "the integers returned by repeated next() calls". (Q1, Q4, Q6, Q9, remedials)
- **[MINOR] Bug-id feedback.** "…the emit shallow items first bug", "…the emit list objects bug", "…the invent default value bug", "…the emit list direct integers before nested bug".

#### Step 2
- **[MAJOR] Step 1's labels are rejected and the iterator's real output cannot be expressed.** Probe with Step 1 names (`root=[]`, `root[0]=[]`, `root[0][0]=1`, …) → "Use root, root[0], root[1], ... to name nested input items." Step 2 nodes therefore carry no integer values, so "CORRECT OUTPUT" cannot be the flattened integers the problem returns; the grader wants `["root","root[0]"]` (list names, quoted, sorted). A student will type `[1,2]`. "Add node" auto-names root, root[0], root[1] but deeper names like `root[0][0]` must be typed by hand with no hint. (all 3 rounds)
- **[MINOR] Q2 Jude "follows only the last available branch" = the last-DRAWN edge out of each node.** With the harness's order (root→root[0] first, root→root[1] second) Jude keeps root[1]. A student who draws root→root[1] first gets a different "last" branch and may not expose the bug. "Edge numbers show drawing order." is the only hint.

#### Step 3
- **[MAJOR] The "wrong" node rule about empty lists is keyed wrong on inputs that have no empty list.** Q2 input `[[[3]],4]`, claim "Use this node rule for the graph: “Every integer and every nonempty list, but not the empty list.”" keyed NO — but for this input that rule yields exactly the correct node set. Same in Q1 variant 1 (`[1,[1]]`, keyed YES "It would be a mistake…") and Q5 (`[[1],[2]]`). A literal student who checks the rule against the shown input gets it "wrong".
- **[MAJOR] Membership claims quote values absent from the input.** Q1 variant 0: "Only integer leaves 1, 2, and 3." for `[1,[1]]`; Q4: "One node for depth 1, one for depth 2, and one for depth 3." for `[[2],2,[2]]` (max depth 2).
- **[MINOR] Claims are walls of brackets.** "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=1, so it should also contain a direct root=[]→root[1][0]=1 edge." (Q1) — nearly unreadable for the target student.

#### Step 4
- **[BLOCKER] Case 1 requires node labels `"outer list"`, `"inner list"`, `"deeper list"`, `"1"`, `"2"`, `"3"`, `"4"`; cases 2–3 require `"root=[]"`, `"root[1]=[]"`, `"root[1][1][0]=6"`, `"root[0][0][0]=3"`.** No guide in Step 4. Whichever scheme the student uses, at least one case fails "× The drawing has every exact node". (case 1 `authored-deep-case` vs cases 2–3)
- **[MAJOR] Feedback introduces a fourth naming scheme.** Case 2 "Changed graph: Nodes: root, 1, L1, 4, L2, 6. Direct arrows: root→1; root→L1; L1→4; L1→L2; L2→6."; case 3 "Nodes: root, L1, L2, 3, 4." "L1"/"L2" appear nowhere else in the lesson.
- **[MAJOR] Same bug thrice.** "Only one nesting layer is opened" ×3; correct choice "The traversal stops after opening one list level." ×3.

#### Cross-step / other
- Node names across the lesson: Step 1/3 `root[1][0]=4`; Step 1 pictures "Array at [1]"; Step 2 `root[1]`; Step 4 case 1 "inner list"; Step 4 feedback "L1". Five schemes for one structure.

---

### Is Graph Bipartite? (`is-graph-bipartite`, original)

#### Step 1
- **[MAJOR] Q7 distractor is a true statement.** Question "Which graph reasoning is correct for this case?" for `graph = [[1,3],[0,2],[1,3],[0,2]]`; choice "0 and 2 share a path" is TRUE (0—1—2). Its feedback "Only direct edges require opposite colors." refutes a claim the choice never makes. A literal student picking a true fact is marked wrong. Reword to state the misconception: "0 and 2 share a path, so they must get different colors." (Q7 `predict-output`)
- **[MAJOR] Q9's correct answer talks about "all three edges" of a five-edge graph.** Input `[[1,2,3],[0,2],[0,1,3],[0,2]]` has edges 0—1, 0—2, 0—3, 1—2, 2—3. Correct choice: "two colors cannot satisfy all three edges"; feedback "The third edge forces a same-color conflict." Only makes sense if the student has already isolated triangle 0-1-2, which the question never mentions. Distractor "put two nodes together and one apart" describes what any 2-coloring attempt of a triangle does, not a wrong belief. (Q9 `bug-trap`)
- **[MINOR] Heavy input reuse.** `[[1],[0],[3,4],[2,4],[2,3]]` is Q5's build, the bug-trap remedial build, Step 3 Q3 and Step 4 case 1; `[[],[2,3],[1,3],[1,2]]` is the core-rule remedial, Step 3 Q5 and Step 4 case 2.
- **[MINOR] Bug-id feedback.** "…the color neighbors without conflict check bug", "…the require every node to have opposite neighbor bug", "…the skip index with empty zero component bug", "…the treat tail as third group bug".

#### Step 2
- **[MAJOR] Q2 description contradicts the required drawing.** "Rohan erases the outer leaves before searching." but Rohan's graph "must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none" — the leaf NODES stay, only edges touching a degree-1 node are removed. A student who deletes nodes 0 and 2 (what "erases the leaves" says) fails "× Rohan's drawing exactly shows the mistake". Say "Rohan deletes every edge that touches a leaf but keeps the nodes." (Q2 `skip-leaf-edges`)
- **[MAJOR] Q1 "Eden allows each two-way link to work only in its written order." — nothing is written; the student draws.** Direction = click order (same trap as find-if-path Q1), and Drawing 2 must have "Directed edges" ON ("must be exactly: DIRECTED · 1→0"). Nothing says so.
- **[MINOR] Q3 "Nora chooses the final listed route" — "listed" again means last-drawn.**
- **[MINOR] Step 2 never tests coloring.** "CHOOSE THE COLORING START" and "CORRECT OUTPUT" = `[0,1]` (nodes reached). Nothing about two colors or conflicts is simulated, so the lab is a plain reachability lab wearing a bipartite label.

#### Step 3
- **[MAJOR] Q1 variant 2: the quoted rule is right for this input.** Input `graph = [[1],[0]]` (nodes 0, 1 only). Claim "Use this node rule for the graph: “Only nodes 0 and 1 because node 2 has no neighbors.”" keyed NO; but there is no node 2, and {0,1} is the correct node set. Feedback "An isolated node still belongs to the graph…" doesn't apply.
- **[MAJOR] Q5 quotes an edge that isn't in the input.** `graph = [[],[2,3],[1,3],[1,2]]`; claim quotes "…two separate copies for the 0—1 relationship." There is no 0—1 edge here.
- **[MINOR] Q4 rule premise false.** "Only nodes 0 and 1 because node 2 has no neighbors" for `[[1],[0,2],[1]]` where node 2 has neighbor 1.
- **[MINOR] "Correct." under ×.** Q1 variant 0, Q3: "Correct. The mini-example lists 0—1 as one direct edge."

#### Step 4
- Node labels are plain digits in all three cases — the only problem in this batch where Step 4 labels match the taught format.
- **[MAJOR] Same bug thrice; cases 2 and 3 are structurally identical** (isolated 0 + odd triangle). "Only the component containing node 0 is checked" ×3; correct choice "It never starts a coloring search in unvisited components." ×3.
- **[MINOR] Awkward choice tails.** "Any cycle makes a graph non-bipartite for the shown graph." / "Using 1 and -1 as colors causes the error on the shown input."

---

### Keys and Rooms (`keys-and-rooms`, original)

#### Step 1
- **[MAJOR] Q8 has two distractors that are true facts.** Input `rooms = [[1],[2],[3],[]]`, question "Which graph reasoning is correct for this case?". "room 0 lacks keys 2 and 3" — TRUE (room 0 holds only key 1). "there is no key back to room 0" — TRUE (no room contains key 0). Feedback "Returning to room 0 is unnecessary." doesn't deny the statement. Only B is the reasoning that *decides* the answer, but the question doesn't ask that. Reword the distractors as conclusions: "room 0 lacks keys 2 and 3, so the answer is false." (Q8 `predict-output`)
- **[MINOR] Bug-id feedback.** "…the start search in every room bug", "…the require at least one key bug", "…the count all mentioned keys as reachable bug", "…the follow only first key bug".

#### Step 2
- **[MAJOR] Q1: Elena's drawing must be UNDIRECTED and nothing says so.** "Elena forgets that the listed connections have a direction." Required: "character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0". The student must switch "Directed edges" OFF in Drawing 2; "Duplicate graph from #1" copies a directed graph, so the copy fails "× Elena's drawing exactly shows the mistake". Also "listed" — nothing is listed, the student drew it. (Q1 `make-two-way`)
- **[MINOR] "CORRECT OUTPUT" wants `[0]` (rooms entered) while the problem returns `true/false`.** With "Unlocked room: 0" fixed, a student will likely type `false`.

#### Step 3
- **[MINOR] Q1 variant 1 feedback doesn't fit the input.** `rooms = [[1],[0,2],[3],[]]` — every room is reachable. Claim quotes "Only rooms 0 and 1 because those are reachable from the unlocked room." (false premise) and feedback says "Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass." — here the check passes correctly.
- **[MINOR] "Correct." under ×.** Q2/Q3/Q4: "Correct. The mini-example lists 3→2 as one direct edge."

#### Step 4
- **[BLOCKER] Case 1 requires node labels `"room 0"`, `"room 1"` AND an edge label `"key 0"` on room 1→room 0.** The checklist for case 1 includes "Edge labels or weights match the input"; cases 2–3 require plain `"0"`, `"1"`, `"2"` with no edge labels; Step 1/3 taught "Use each node's 0-based number only." No guide in Step 4. (case 1 `authored-deep-case`)
- **[MAJOR] Case 1's consume-key feedback is copied into cases 2–3 where it is false.** "…key consumption would not make room 1 reachable here." In cases 2 (`[[1],[],[1]]`) and 3 (`[[1],[],[0]]`) room 1 IS reachable; the unreachable room is 2.
- **[MAJOR] Same bug thrice.** "Keys are treated like two-way doors" ×3; correct choice "It invents a reverse move for every key." ×3.
- **[MINOR] Vague proof line.** Case 1 "Reachable boundary: The only useful-looking connection points into the start room."

---

### Kill Process (`kill-process`, original)

#### Step 1
- **[MINOR] Q9 is Example 2 verbatim and duplicates Q8.** `pid = [1], ppid = [0], kill = 1` is the Description's Example 2 (answer `[1]` shown there); Q8 already built the one-node case (`pid = [7]`) with the same `[]`-vs-`[7]` choice. Distractors `[0]` and `[0,1]` are trivial. (Q9 `bug-trap`)
- **[MINOR] Q7 hands over the edges and repeats Q1.** "For edges 3→1, 3→5, and 5→10, which processes die when kill=5?" — same input and same `[5,10]`/`[3,5,10]` pair as Q1. (Q7 `predict-output`)
- **[MINOR] Bug-id feedback.** "…the kill only selected process bug", "…the include ppid zero bug", "…the stop at grandchildren bug", "…the collect only direct children bug".

#### Step 2
- **[MAJOR] Q1 can only be exposed by killing a non-root process, and nothing says so.** "Yara turns every arrow into a two-way connection." Placeholder "Example: 1"; every Step 1 example kills the root or a middle node. If the student draws 1→2 and kills 1 (the root), Yara's two-way graph reaches the same set → "× The graph exposes the mistake" with no hint. The authored goal "Start at a child so an illegal upward move would terminate its parent" is hidden. Yara's drawing must also be UNDIRECTED ("must be exactly: UNDIRECTED · 2—1"), i.e. toggle "Directed edges" off in Drawing 2. (Q1 `make-two-way`)
- **[MINOR] Q2 Louis's process (`2`) is only in Drawing 2's title**, and it must sit in a different subtree from the chosen kill to expose (hidden goal "give them different subtrees").

#### Step 3
- **[MINOR] Membership claims quote another input.** Q1 variant 0 and Q3 quote "Processes 0, 3, 1, and 5." for inputs `pid = [1,2,3]` and `pid = [2,6]`.
- **[MINOR] "Correct." under ×.** Q3/Q4: "Correct. The mini-example lists 2→6 as one direct edge."
- **[MINOR] Check rendering of inline code in feedback.** Harness text shows "not a running process in\npid\n." and "stored in\npid\n." — the backticked `pid` may render as its own line/block. Verify visually.

#### Step 4
- **[BLOCKER] Case 1 requires node labels `"process 1"`, `"process 3"`, `"process 5"`, `"process 10"`; cases 2–3 require `"4"`, `"8"`, `"9"` and `"1"`, `"2"`, `"3"`.** Step 1/3 taught "Use the exact ID from the input only. Example: 15." No guide in Step 4. (case 1 `authored-deep-case`)
- **[MAJOR] Output order is enforced although the problem says any order.** Description: "The IDs may be returned in any order." Output box: `[3,5]` accepted, `[5,3]` rejected ("× The incorrect solution's exact output is correct"). Either accept any order or tell the student "type the array in the order the code builds it".
- **[MAJOR] Same bug thrice.** "Only direct children are killed" ×3; correct choice "It takes one child step instead of the full descendant subtree." ×3.

---

### Letter Combinations of a Phone Number (`letter-combinations-of-a-phone-number`, original)

#### Step 1
- **[MINOR] `digits = ""` is asked three times with the same `[]` vs `[""]` pair** (Q8 bug-trap, Q9 build-empty, predict-output remedial). Q8's wording "What result belongs at the root when digits = ""?" is odd — nothing "belongs at the root".
- **[MINOR] "unique" flags the correct remedial answer.** Bug-trap remedial choices: "3 unique combinations | 2 combinations" — only the correct one says "unique".
- **[MINOR] No Step 1 build ever draws a two-digit tree.** Builds use "2", "7", "3", "" (all one-level stars from "empty prefix"); Q3/Q5/Q7 ask about "23" but the student never draws a partial string like `ad` until Step 4 demands 13–16 of them.
- **[MINOR] Bug-id feedback.** "…the drop last keypad letter bug", "…the use previous keypad row bug", "…the emit empty prefix bug", "…the merge sibling prefixes bug".

#### Step 2
- **[MAJOR] Step 1's root label is rejected and the replacement is untypeable.** Probe with Step 1 names ("empty prefix", "a", "b", "c") → "Use ε for the empty root, then lowercase partial strings like a or ab." The start field is prefilled "ε" read-only and "Add node" auto-names the first node ε, but a student who renames it to "empty prefix" (as Step 1 taught) cannot type ε back on a normal keyboard. (all 3 rounds)
- **[MAJOR] The output must list ε LAST.** Expected `["a","ab","ε"]`; `["ε","a"]` was rejected. The sort is `localeCompare`, which puts the Greek letter after all Latin letters — a student naturally writes the root first. Nothing explains the order. (all 3 rounds)
- **[MINOR] Hidden shape rules.** There is no digit string in Step 2; the validator silently requires every node's parent prefix to exist (node minus its last letter) and "Phone-number prefixes use at most 4 letters." Neither is shown before the error.
- **[MINOR] "CORRECT OUTPUT" includes ε and internal prefixes**, e.g. `["a","ab","ε"]`, whereas the problem's answer for that tree would be `["ab"]`.

#### Step 3
- **[MAJOR] Q4 (`digits = ""`) claims are nonsense for a one-node graph.** "Because empty prefix can reach itself, the graph should contain a direct empty prefix→empty prefix edge." and membership "Use this node rule for the graph: “Only the digit 2 or digit 3, so the tree has two nodes.”" — there are no digits at all in this input.
- **[MINOR] Every Step 3 input is one digit or empty, so every direct-vs-reach claim is trivial** (no two-step route exists), e.g. "empty prefix can reach o, but there is no direct empty prefix→o edge." Wrong-feedback "Correct. The mini-example lists empty prefix→y as one direct edge." is under a × and the input (`digits = "9"`) lists no edges.
- **[MINOR] Q1/Q3 quote "Only complete two-letter answers such as `ad` and `cf`"** for inputs "9" and "7".

#### Step 4
- **[BLOCKER] The root must be labeled `"start"`.** Step 1/3 taught "Use empty prefix for the root"; Step 2 required "ε"; Step 4 requires "start" with no guide. Every case fails "× The drawing has every exact node" for a student using either taught name. (all 3 cases)
- **[MAJOR] Drawing volume.** Case 1: 13 nodes / 12 edges; case 2 (`"27"`): 16 nodes / 15 edges (`ap`,`aq`,`ar`,`as`,`bp`,…,`cs`); case 3: 13 / 12 — all typed exactly, three times, for the same bug. This is far heavier than anything in Steps 1–3 (max 5 nodes).
- **[MAJOR] Same bug thrice.** "The search stops after one digit" ×3; correct choice "It declares prefixes complete at depth 1 instead of at digits.length." ×3.
- **[MINOR] Output order enforced despite "You may return the answers in any order."** `["c","b","a"]` rejected; only `["a","b","c"]` passes.
- **[MINOR] Artificial code.** `if (index === Math.min(1, digits.length))` — the `Math.min` is there only to make the bug; a student may waste time wondering what it's for.

#### Cross-step / other
- Root label: "empty prefix" (Step 1/3) → "ε" (Step 2) → "start" (Step 4). Three names, none announced when it changes.

---

### Longest Increasing Path in a Matrix (`longest-increasing-path-in-a-matrix`, original)

#### Step 1
- **[MINOR] Q7 correct choice is the odd one out.** Choices are "3", "5", "6", "4 cells" — only the right answer carries a unit word, so the letter is predictable. The question "how long is the pictured path 1→2→6→9?" also prints the four cells, so counting the numbers answers it, and nothing is "pictured" (the drawing tool is blank/optional). Fix: format all four alike and ask for the longest path length without listing the path. (S1 Q7)
- **[MINOR] Q9 distractor feedback is factually wrong for the grid.** For [[3,4,5],[3,2,6],[2,2,1]] choice "2→3→4→5→6, length 5" gets "The chosen 2 and 3 are diagonal, so that first step is illegal." But the 2 at (1,1) and the 2 at (2,0) are both side-adjacent to the 3 at (1,0); the path fails because no 4 touches that 3. A student who checks the grid will find the feedback contradicts it. (S1 Q9)
- **[MINOR] bug-trap remedial distractor names a bug that doesn't give that number.** On [[1,3],[2,4]] choice "2" says "That result follows the global visited skips shared tail bug" — a global-visited DFS from (0,0) still returns 3 here (it reaches 4 on its first branch). (S1 remedial after Q9)
- **[MINOR] Cryptic template feedback**: "follow only input reading direction bug" (relation remedial, [[3,2,1]]), "combine two branches bug", "count only moves bug", "count edges not nodes bug". (batch-wide pattern)

#### Step 2
- **[MAJOR] Q1 (Ava, "allows diagonal steps"): the drawn nodes have no cell values, so the site cannot know which diagonal cell is larger.** `mistakenGraph` adds a one-way arrow from the *earlier-created* node to the *later-created* node for every diagonally adjacent pair, ignoring values. If the student adds (1,1) before (0,0) and starts at (0,0), Ava's arrow is (1,1)→(0,0), Ava reaches nothing new, and the check fails with only "× The graph exposes the mistake". Drawing 2 must also contain exactly that arrow direction. Nothing on screen mentions creation order or that values are ignored. Fix: say "Ava's diagonal arrows point from the first-added cell to the second-added cell" or make the invented diagonal edges two-way. (S2 Q1)
- **[MINOR] "CHOOSE THE STARTING CELL" / "OUTPUT" contradict the problem.** LIP has no start cell (paths start anywhere) and returns a length; the lab's "CORRECT OUTPUT" is the list of cells reachable from the chosen cell, e.g. `["(0,0)","(0,1)","(0,2)"]`. A student who types the real answer (3) is rejected with no hint. (S2 all rounds)
- **[MINOR] Q3 (Olivia): text promises "Edge numbers show drawing order." but the harness saw no order badges on the initial screen** (graph.js shows "#1/#2" only when the context key contains `:last-branch:`). Verify they appear once edges are drawn; if not, the "last branch" rule is unknowable. (S2 Q3)

#### Step 3
- **[MAJOR] "Correct."/"Right." shown next to × for a wrong answer** — Q1 v1 "There is no direct edge between (0,0) and (0,1); merely naming both nodes does not make them reachable." wrong → "× Correct. Node membership alone creates neither a direct edge nor a route."; Q2/Q3 "× Right. A multi-step route through (0,1) creates reachability, not a new direct edge." (batch-wide pattern)
- **[MINOR] Q1 v0/v2 claim has a false premise.** On matrix [[1,1]]: "(0,0) can reach (0,1), so the graph should contain a direct edge between them." (0,0) cannot reach (0,1) at all. NO is keyed, but a literal student cannot tell whether they are judging the premise or the conclusion. (S3 Q1)
- **[MINOR] Label guidance conflicts on one screen.** Node-name guide: "Name each cell (row,column)… Do not add spaces" (pattern `^\(\d+,\d+\)# Site audit — every problem, every step (2026-09-02)

## How this audit was done

- An automated harness opened the real site in a headless Chrome and played **every question of all 75 problems, all 4 steps** (9 Step 1 questions including the 5 remedial builds, 3 Step 2 rounds, 5 Step 3 rounds, 3 Step 4 code cases = 20 to 25 graded screens per problem, about 1,700 screens total). It drew the required graphs in the real drawing tool, clicked the real buttons, and recorded exactly what the screen said and what the grader accepted or rejected.
- It also tried "reasonable but slightly different" answers (for example `0, 1` instead of `[0,1]`, or `True` instead of `true`) to see how strict the grader is.
- Every transcript was then read by a reviewer that worked each question by hand (and ran each Step 4 code snippet on its input) looking for wrong answer keys, confusing wording, hidden requirements, bad distractors, and questions that don't test anything.
- The source code of the lesson engine (`visual-library.js`, `graph.js`) was read to confirm the cause of anything that looked like a bug.
- Where things live: the per-problem transcripts (exactly what each screen shows, plus the hidden answer keys) are in `docs/audit-2026-09-02/transcripts/`, the raw reviewer notes in `docs/audit-2026-09-02/reviewer-findings/`, and the replayable harness in `scripts/audit-harness/` (run `audit-harness.js --workers 1` with the node binary under `~/.nvm/versions/node/v22.16.0/bin`; it needs the Playwright install at `/Users/shreshth/git-repos/try-5.4-computer-use/node_modules/playwright`).

Severity used below: **BLOCKER** = the student cannot pass, or the answer key is wrong. **MAJOR** = very likely to confuse or waste real time. **MINOR** = polish.

---

## Part 1 — Problems that affect the whole site (fix these first)

### 1.1 BLOCKER — Step 4 secretly requires node names the student is never told (about 30 problems)

- **What happens:** In Step 4 the student must draw the graph, and the grader compares every node name letter-for-letter against a hidden answer graph. Step 4 shows no "Required node-name format" box at all. In about 30 problems the hidden names are not the plain names taught in Step 1. Examples of what the student would have to type, with no hint:
  - Find if Path Exists: `0 source`, `1`, `2 destination`
  - Course Schedule: `course 0` … `course 3` (case 1) but plain `0`, `1`, `2` in cases 2 and 3
  - Keys and Rooms: `room 0`, `room 1` plus an edge label `key 0`
  - Kill Process: `process 1`, `process 3`, `process 5`, `process 10`
  - Possible Bipartition: `person 1` … `person 7` in all three cases
  - Number of Provinces: `city 0`, `city 1`, `city 2`
  - Network Delay Time: `2 source`
  - Time Needed to Inform: `head 0, delay 1`, `manager 1, delay 5`, `employee 3`
  - Smallest String With Swaps: `index 0: b`
  - Water and Jug case 3: `0,0` without parentheses, although the taught format is `(0,0)`
  - Flatten Nested List: `outer list`, `inner list`, `deeper list`, `1`, `2`; Nested List Weight Sum: `1 at depth 1`; Weight Sum II: `1 depth 1`
  - Busiest Shelf Level and Coins on Level K: `box A`, `box B`, `box C`
  - Detonate the Maximum Bombs: `A (0,0), r=5` (case 1), `bomb 0` (case 2), `center bomb` / `east bomb` (case 3)
  - Evaluate Division: edge labels `×2` and `×1/2` (the `×` character is not on a keyboard)
  - Evaluate Boolean Binary Tree: `AND`, `true`, `false`; Path Sum / Tree Sum / Max Root-to-Leaf: bare values like `5`, `-10`
  - Moocast: `0:p3`; Properties Graph: `row 0`; Reachable Nodes: `1 restricted` (taught: `1 (restricted)`); Dungeon Gold Run, Shut the Valve, Employee Importance: bare ids although Step 1 taught `id:value` names.
- **Why it matters:** The only feedback is "× The drawing has every exact node". The student can never pass these cases. Often case 1 uses one naming scheme and cases 2–3 use another, so even after solving one case the next one fails.
- **Fix:** Regenerate every Step 4 canvas with the exact same node-name format as Step 1 (the `nodeLabelFormat` pattern), and show the "Required node-name format" box in Step 4. Never require characters like `×`.

### 1.2 BLOCKER — Six Step 1 build questions cannot be completed (empty graphs)

- Hackerrank Connected Cells, Count Sub Islands, Find All Groups of Farmland, Max Area of Island, Maximum Number of Fish, and Tree Sum each have a build question whose input has no nodes at all (for example `grid=[[0]]` or `root level-order=[]`).
- The answer buttons only unlock after the student adds a node. But the correct drawing has zero nodes, so if they add a node to unlock the buttons, the graph check fails ("no missing or extra node"). The question is a dead end; the only way out is "Skip to next question", which marks it skipped.
- **Fix:** unlock the answer buttons when the expected graph is empty (or drop these inputs from the build slot and use them as concept questions).

### 1.3 BLOCKER — Step 3: the three Yes/No claims always have the same answer

- In every one of the 375 Step 3 questions the three claims are all "Yes" or all "No" (verified for 100% of questions the harness saw). Once the student knows one answer, the other two are free.
- **Cause (code):** `stableChoiceSlot(text, 2)` in `visual-library.js` decides Yes/No by the parity of an FNV hash. Parity of that hash is just the XOR of the characters' parities, and the three seed strings (`…:membership:N`, `…:relation:N`, `…:degree:N`) have the same parity, so all three claims flip together.
- **Fix:** use a proper hash bit (for example `(hash >>> 8) & 1`) or independent random seeds per claim, and make sure mixed answers are common.

### 1.4 MAJOR — Step 2 wants an output format it never describes

- The two boxes are labelled only "Correct output" and "<Name>'s output". The grader requires a JSON array of the node names the search reaches, sorted by name, with numbers bare and everything else quoted: `[0,1,2]`, `["(0,0)","(0,1)"]`, `["root","root[0]"]`, `["L","LL","LR","R","RL","root","RR"]`, `["a","ab","ε"]`.
- Rejected by the grader in testing: `0, 1`, `{0,1}`, `["0","1"]` (numbers in quotes), `[1,0]` (not sorted), `[(0,0)]` (coordinates without quotes). The sort order for letters is strange (`root` sorts between `RL` and `RR`; `ε` sorts last) and impossible to guess.
- "Output" is also misleading: it is not the problem's real answer (Battleships returns a count; Course Schedule returns true/false; here the box wants the list of reached nodes). The authored hint text (for example "vertices reachable from source") exists in the data but is never displayed.
- **Fix:** show a one-line format hint next to the boxes ("Type the reached node names as a list, smallest first, like `[0,1,2]` or `["(0,0)","(0,1)"]`"), accept any order and loose formats, and rename the boxes ("Nodes the correct search reaches").

### 1.5 MAJOR — Step 2 rejects the node names Step 1 just taught (23 problems)

- Step 2 shows no node-name guide, but enforces a different naming rule than Step 1. A student who names nodes the way Step 1 required gets an error only after clicking Check. Problems: Detonate Bombs (`A`, `B` → must be `0`, `1`), all nested-list problems (`root=[]`, `root[0]=1` → must be `root`, `root[0]`), Letter Combinations (`empty prefix` → `ε`), Runes (`start` → `ε`), Smallest String (`0:d` → `0`), Dungeon Gold Run (`0:1g` → `0`), Shut the Valve (`1:5` → `1`), Employee Importance, Evaluate Boolean Tree (`0:OR` → `root`, `L`, `R`), Fence Planning, Max Root-to-Leaf, Moocast, Path Sum, Properties Graph, Reachable Nodes (`3 (restricted)` → `3`), Tree Sum, Codewars Array Deep Count.
- The `ε` root name cannot be typed on a normal keyboard; if the student renames that node they cannot get it back.
- **Fix:** use one naming rule per problem across all four steps, and show it in Step 2.

### 1.6 MAJOR — Step 2 hides facts the student needs to predict the buggy output

- **Wrong-start rounds (35 rounds):** the text only says "<Name> runs the search from a different source vertex". Which one is revealed only inside the title of Drawing 2 ("Wrong source vertex: 1"), which many students will not open before predicting.
- **"Treats undirected links as arrows" rounds (17):** the arrow direction in the character's graph is whichever node the student clicked first when drawing each two-way edge. Nothing says this, and the correct drawing shows no direction.
- **First-branch / last-branch / drop-last-edge rounds (80):** "first branch" means the edge the student drew first, and "last" means drawn last. The only hint is "Edge numbers show drawing order". "Follows only the first available branch and never comes back" is really a greedy walk that stops at the first dead end; students will read it as a normal DFS.
- **Drawing 2 direction toggle:** for "make two-way" / "make one-way" bugs Drawing 2 must have the "Directed edges" box flipped compared with Drawing 1; this is never stated.
- Several rounds are only solvable with a hidden shape requirement (for example Kill Process round 1 only works if the killed process is not the root; Evaluate Division rounds need variables in different components; Battleships / Constellations wrong-start rounds need the wrong start in a different ship). The authored "goal" text that explains this exists in the data but is never shown.

### 1.7 MAJOR — Step 3 claims are built from the wrong input and read like instructions

- The "node rule" claim quotes a wrong rule written for the Step 1 concept question, so it mentions values that are not in the Step 3 input (for example "repeated copies of 3" when the input is `graph = [[2],[2],[]]`, or "Only the digit 2 or digit 3" when `digits = ""`). Sometimes the "wrong" rule is actually true for the shown input (Find if Path: "Only 0, 1, and 2 …" is correct when n = 3, but the key says it is wrong).
- Claims are phrased as commands ("Use this node rule for the graph: “…”") followed by "Correct? Yes / No", which is hard to parse.
- On one-node inputs the direct-edge claim becomes "(0,1) can reach itself without using an edge, but the graph still has no direct (0,1)—(0,1) edge" — meaningless to a beginner.
- Edges in claims are written backwards from the input ("2—1 and 1—0" for `edges = [[0,1],[1,2]]`).
- After a wrong answer the feedback for a true claim starts with "Correct." or "Right." under a red ×, so it looks like the student was right.

### 1.8 MAJOR — Step 4 code cases repeat and the proof text is sometimes a code slug

- In all 75 problems the three Step 4 cases use the identical code and identical bug; only the input changes. The diagnosis sentences are often word-for-word the same, so cases 2 and 3 test nothing new but still require 10–16 exactly named nodes each.
- In 23 cases the "Reachable boundary" line shown in feedback is an internal slug such as `count-container-nodes`, `zero-based-depth`, `ignore-found-keys`, `listener-wait-time`.
- "Code rule" sentences are copied from case 1 into cases where they are false (for example "The code creates only 1→0 and 2→1" on a different input).
- Wrong diagnosis choices are easy to spot by wording: 157 of the 450 wrong choices contain "should", only 3 correct ones do; wrong ones also end in "for the shown graph" / "changing this input's returned value".
- Output box strictness: strings must be quoted (`"ba"`), `True`/`False` are rejected, arrays must be in the code's exact order even when the problem statement says "any order" (All Paths, Kill Process, Letter Combinations, Runes, Farmland). The placeholder "Example: false, 3, or [1, 2]" is the only hint.

### 1.9 MAJOR — Step 1 build questions are 50/50 guesses and give no explanation

- All 300 build questions have exactly two answer choices. When the student picks the wrong one the screen only shows "× The decision matches the finished picture"; the authored explanation for the wrong choice is never displayed.
- 100 of the 375 concept questions put the question text inside the grey "raw input" box and then repeat it as the heading, under a drawing tool titled "Optional: draw this input before answering" (there is no input to draw).
- Many builds reuse the Description tab's examples verbatim, so the answer is printed on the left side of the screen.

### 1.10 MAJOR — Edge weights and colours are graded but never explained

- Five problems grade edge labels (Network Delay Time, Evaluate Division, Keys and Rooms, Package to the Outpost, Save the Date) and one grades edge colours (No Transfers, Please). The checklist line "Edge labels or weights match the input" appears only after a failed check. No screen says that an edge needs a label, what text to put on it (`5`? `0.5`? `1/3`? `×2`?), or how to add one (double-click the edge, or select it and press F2 / "Rename"). Evaluate Division mixes `0.5` and `1/3` in the same lesson.
- **Fix:** show a one-line instruction on weighted problems ("Label each arrow with its number: double-click the arrow") and accept equivalent numbers.

### 1.11 MINOR — Layout and small site-wide things

- In Step 2 the two drawing tabs ("1 · Correct graph", "2 · <Name>'s graph") sit at the very bottom of the canvas, below the status line, so a student may never notice there is a second drawing to make. The output boxes sit above the drawings even though the design checklist says drawings come first.
- The "#1", "#2" drawing-order badges on edges are small orange text and easy to miss; they are the only clue in first-branch / last-branch / drop-last-edge rounds.
- The drawing canvas is tall, so on a laptop the actual question and answer buttons in Step 1 are below the fold; a student can miss that there is a question at all.
- The "Edge width" slider is decorative and appears in Steps 1, 2 and 4 but not Step 3.
- The "Examples" tab is hidden until two builds are finished and then silently appears.
- "Skip to next question" marks the question skipped, but Step 1 remedial builds after a wrong concept answer still count as "passed" in the progress strip ("9 of 9 visual checks passed · 5 corrections").
- The Step 2 start box shows "Example: 0" as a placeholder even when the value is fixed and read-only, and the field label repeats itself ("CHOOSE THE SOURCE VERTEX / source vertex").
- Character names change every round, and the same first names are reused across problems, which adds nothing.
- Step 4 case 1 shows its input as `key: value` lines while cases 2–3 show `key = value` text.
- Phone layout works (no horizontal overflow, Lesson/Problem switcher present, code window fits).

---

## Part 2 — Problem-by-problem findings

); the failure panel: "Both (0,2) and 0,2 work." (S3 Q1 failure panel)

#### Step 4
- **[MAJOR] Same bug three times** ("Movement is limited to right and down"); cases 2 and 3 are the 1-row grids [[3,2,1]] and [[4,3,2,1]] whose answer (1) is immediate. (batch-wide pattern)
- **[MINOR] "Changed graph" describes the correct graph** — case 1: "Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left." (the code drops exactly that edge); cases 2/3 list the full correct arrow set under "Changed graph". "orthogonal" is jargon. (batch-wide pattern)
- Hidden labels are plain (row,column) and grid labels are normalised, so Step 4 labels are guessable here — fine.

#### Cross-step / other
- **[MINOR] Heavy input reuse**: [[1,2],[4,3]] is S1 Q1, S1 Q3 and S4 case 1; [[3,2,1]] is the relation remedial, S3 Q2 and S4 case 2; [[1,2],[2,3]] is the predict remedial and S3 Q3. Step 4's drawings are already known before the code is read.

---

### Minesweeper (`minesweeper`, original)

#### Step 1
- **[MAJOR] relation-rule remedial cannot distinguish the rule it remediates, and its distractor feedback is false.** Input [["E","E"],["E","E"]], click [0,0]; choices "only three side-connected cells become B" vs "all four become B". A four-direction-only reveal ALSO turns all four cells B ((1,1) is side-adjacent to (0,1) and (1,0)), so "That result follows the expand four directions only bug" is untrue, and the correct answer holds under both rules. Fix: use a board where diagonals matter, e.g. [["E","E"],["E","M"]], click [0,0] (8-neighbour → "1" and stop; 4-neighbour → [["B","1"],["1","M"]]). (S1 remedial after Q7)
- **[MINOR] bug-trap remedial is a verbatim repeat of Q4**: [["M","E"],["E","E"]], click [1,1], same two choices, same answer "clicked cell becomes 1". The same input is also S3 Q3 and S4 case 1. (S1 remedial after Q9)
- **[MINOR] Q8 wording**: "A click lands on an empty square with no adjacent mine. What should the picture do next?" — pictures do not "do" things, and the 4×5 board shown above the question is never used by it. (S1 Q8)
- **[MINOR] core-rule remedial distractor** "[["B","1"]]" is explained as the "count revealed blank as mine bug" — not a believable student mistake. (S1 remedial after Q5)

#### Step 2
- **[MINOR] "Output" clash is acute here.** The real function returns a board, but "CORRECT OUTPUT" wants `["(0,0)","(1,1)"]` (squares reached). The drawn graph carries no E/M contents, so "reached" ignores Minesweeper's stop-at-number rule the student just learned. Typing a board such as [["B","B"]] is rejected with no hint. (S2 all rounds)
- **[MINOR] Q2 (Christopher): the wrong click "(0,1)" is not in the bug text** ("uses the wrong clicked square"); it appears only in Drawing 2's title or in the post-Check error "Also draw (0,1), the wrong clicked square used by the broken search." (S2 Q2)
- **[MINOR] The "correct graph" is never checked against the 8-neighbour rule.** The harness passed Q3 with an L of cells (0,0),(0,1),(1,0),(2,0) that omits the diagonal (0,1)—(1,0) edge. Conversely a student who draws the real 8-neighbour graph for those cells cannot expose Chloe (the greedy walk reaches everything). No text says the shape may be any graph. (S2 Q3)

#### Step 3
- **[MAJOR] "Correct."/"Right." shown for a wrong answer** — Q1 v0 "(0,0) and (0,1) are directly connected…" wrong → "× Correct. The mini-example lists (0,0)—(0,1) as one direct edge."; Q5 same; Q4 "× Right. …". (batch-wide pattern)
- **[MINOR] Node-rule feedback renders with line breaks around code spans** as captured: "…whether it currently contains / E / , / M / , a digit, or / B / ." Verify inline `<code>` styling in the feedback list; if it really breaks lines the sentence is unreadable. (S3 Q1 feedback)

#### Step 4
- **[MAJOR] Same bug three times** ("Diagonal mines are not counted"); case 1 input equals S1 Q4, the bug-trap remedial and S3 Q3. (batch-wide pattern)
- **[MINOR] "Changed graph" describes the correct graph**: "In a 2×2 board, every pair of cells shares a side or corner, so the real eight-neighbor graph is complete with six edges." (batch-wide pattern)
- **[MINOR] Case 3 needs 6 nodes and all 11 edges** of the 2×3 eight-neighbour graph, including three edges into the mine cell (0,2); the only place the student learned that mine cells get edges is a Q7 distractor's feedback. Heavy but consistent. (S4 case 3)
- Buggy outputs verified: [["M","1"],["1","B"]], [["1","M"],["B","1"]], [["B","1","M"],["B","B","1"]]; correct outputs match the statement.

---

### Nested List Weight Sum (`nested-list-weight-sum`, original)

#### Description tab
- **[MINOR] Example 3 prints the word "undefined"**: "input nestedList = [0] → output 0. undefined" (missing explanation string). (Description)

#### Step 1
- **[MAJOR] Q1 distractor feedback is wrong.** Choice "6" says "That result follows the start root depth at zero bug". Starting depth at 0 on [[1,1],2,[1,1]] gives 4 — the site's own Step 4 case 2 says "the shown code returns 4". 6 is the plain unweighted sum. A student who forgot the depth weights is told they used depth 0. (S1 Q1)
- **[MAJOR] Q7 distractor feedback describes different mistakes than the numbers chosen.** "8" → "This gives the top-level 2 the same depth-2 weight as inner values" (that bug gives 6×2 = 12, not 8). "12" → "This wrongly starts the outer list's integers at depth 2" (that gives 2×2 + 4×3 = 16, not 12). 12 is actually the all-weight-2 result; 8 is "nested 1s at depth 2, top-level 2 dropped". (S1 Q7)
- **[MINOR] Q9 distractor feedback** "Those are inverse-depth weights from the other problem." — "the other problem" means nothing unless the student knows Nested List Weight Sum II. (S1 Q9)
- **[MINOR] Q2 picture choices use a different naming scheme** ("Outer array", "Array at [0]", "1 at [0][0]") from the required drawing labels shown on the same screen ("root=[]", "root[0]=[]", "root[0][0]=1"). (S1 Q2)
- **[MINOR] Node rule has two wordings**: Q4's correct answer "The outer list, both inner lists, and integer nodes 3, 1, and 7." (written for [3,[1,[7]]]) vs Step 3's "Correct node rule: One node for every list container and every integer occurrence, including empty lists." (S1 Q4 / S3)
- **[MINOR] Remedial bug names don't map to the numbers**: "add list node to depth bug" for 10 on [2,[3]]; "weight top level too deep bug" for 8 on [[2],3] (8 is the swapped-depth result). (S1 remedials)

#### Step 2
- **[MAJOR] Step 1's node names are rejected.** Submitting "root=[]", "root[0]=[]", "root[1]=2"… returns "Use root, root[0], root[1], ... to name nested input items." — the new scheme is only revealed by that error; no guide is shown. (S2 Q1; concrete instance of the systemic note)
- **[MINOR] "CHOOSE THE OUTER LIST" heading sits over a read-only field prefilled "root"** — there is nothing to choose. (S2 all rounds)
- **[MINOR] Q1 bug text** "Natalie reads every from/to relationship backward." — "from/to" is undefined for a containment tree; say "draws each arrow from item to list instead of list to item". (S2 Q1)
- **[MINOR] Hidden tree constraints appear only as post-Check errors**: "This problem's input must form one tree: use exactly one fewer edge than nodes.", "A directed tree needs exactly one root with no incoming edge." (S2 all rounds)

#### Step 3
- **[MAJOR] "Right." shown for a wrong answer** (Q1 v0, Q4, Q5). (batch-wide pattern)
- **[MAJOR] Membership claim numbers collide with the input.** On [[2],3] (Q1 v0) and [2,[3]] (Q3): "Nodes 3, 2, and 21 because each integer should already be multiplied by its depth." The input really contains 3 and 2, so this looks input-specific, but 21 is 7×3 from the Step 1 example [3,[1,[7]]]; for [[2],3] the products would be 4 and 3. Also "Only integers 3, 1, and 7, with depth written directly on each." is quoted on [[2],3] and [1,[1]]. (S3 Q1, Q3, Q4)
- **[MINOR] No model panel on graph failure** — after "Your three answers are right. Fix the graph below." the student sees only three × lines, no reminder that labels must look like root[0]=2. (S3 Q1; batch-wide pattern)

#### Step 4
- **[BLOCKER] Case 1 hidden node labels are unguessable**: "outer list", "1 at depth 1", "middle list", "4 at depth 2", "deepest list", "6 at depth 3". Step 1/3 taught root=[], root[0]=1, root[1]=[], root[1][0]=4, root[1][1]=[], root[1][1][0]=6; Step 2 taught root, root[0], root[1][0]. No guide is shown; feedback only says "The drawing has every exact node ×". Cases 2 and 3 then require the root=[] scheme again — the lesson uses three label schemes in one step. (S4 case 1)
- **[MAJOR] Cases 2/3 feedback shows a fourth naming scheme as the model**: "Changed graph: Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; …" and "Nodes: root, 2, A, 3." — names the grader never accepts. (S4 cases 2, 3)
- **[MAJOR] Same bug three times** ("Top-level integers get weight zero"; same sentence "Its root depth is one too small for every integer."). (batch-wide pattern)
- **[MINOR] Case 1 distractor feedback** "No. That is the inverse-weight variant, not this problem." — jargon. (S4 case 1)
- Buggy outputs verified 16, 4, 3; correct 27, 10, 8.

---

### Nested List Weight Sum II (`nested-list-weight-sum-ii`, original)

#### Step 1
- **[MAJOR] Q7 distractor "12" feedback is wrong and duplicates B's.** "This gives the deeper integers the larger weight." is the normal-depth bug, which yields 10 — choice B, whose feedback already says "uses normal depth weights". 12 is 6×2 (every integer weighted 2). (S1 Q7)
- **[MINOR] Q9 ([1,[[]]] → 1) rests on maxDepth counting integers only.** The Description does define it that way ("depth of the deepest integer"), so the key is right, but the distractor 3 is what list-depth solutions produce; the "Why" should say explicitly that the empty list's depth does not count. (S1 Q9)
- **[MINOR] Q3 correct answer is input-specific but reused as the general rule**: "Every list container and every integer, preserving all three nesting levels." (for [[6],3,[[7]]]) is quoted verbatim as "Correct node rule" in Step 3 on inputs with two or four levels ([2,[3]], [[[4]]]). (S1 Q3 / S3)
- **[MINOR] Q2 picture naming "Outer array / Array at [0]…" vs required "root=[]"** (as NLWS). (S1 Q2)
- **[MINOR] Template bug names**: "assume extra empty depth bug" (Q6), "deduplicate equal values bug", "swap forward and inverse weights bug", "use absolute depth not inverse bug". (S1)

#### Step 2
- **[MAJOR] Step 1's node names are rejected** with "Use root, root[0], root[1], ... to name nested input items." (S2 Q1; concrete instance)
- **[MINOR] Q3 (Ashley, wrong-start): the wrong container "root[0]" is not in the bug text** ("runs the search from a different root container"); it surfaces only in Drawing 2's title or the error "Also draw root[0], the wrong root container used by the broken search." (S2 Q3)
- **[MINOR] Q2 (James, drop-last-edge)**: "leaves the final direct link out" — "final" means the last edge the student happened to draw; plus the hidden tree-shape errors as in NLWS. (S2 Q2)
- **[MINOR] "CHOOSE THE ROOT CONTAINER" over a read-only field.** (S2 all rounds)

#### Step 3
- **[MAJOR] "Right." shown for a wrong answer** (Q1 v0, Q4). (batch-wide pattern)
- **[MAJOR] Membership claims name integers that are not in the input**: "Only the deepest integer 7 because deepest values get weight 1." on [1,[2,[3]]] (deepest is 3) and [[[4]]] (deepest is 4); "Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight." on [2,[3]] and [[2],3]. A literal student hunts for a 7. (S3 Q1 v2, Q2, Q4, Q5)
- **[MINOR] No model panel on graph failure.** (batch-wide pattern)

#### Step 4
- **[BLOCKER] Case 1 hidden node labels are unguessable and differ from NLWS's**: "outer list", "1 depth 1", "middle list", "4 depth 2", "deepest list", "6 depth 3" (NLWS uses "1 at depth 1"). Cases 2/3 require the root=[] scheme. (S4 case 1)
- **[MAJOR] Cases 2/3 "Changed graph" uses "root, A, 1a, 1b…" / "root, 2, A, 3" names** never accepted by the grader. (S4 cases 2, 3)
- **[MAJOR] Same bug three times** ("Weights grow with depth instead of shrinking"). (batch-wide pattern)
- **[MINOR] Case 1 chain text**: "Changed graph: The containment tree has maximum integer depth 3, so inverse weight is 4-depth." — "4-depth" reads like a label (means 4 − depth), and this bug does not change the graph at all, so the "changed graph" step is misleading. (S4 case 1)
- Buggy outputs verified 27, 10, 8; correct 17, 8, 7.

---

### Network Delay Time (`network-delay-time`, original)

#### Step 1
- **[MAJOR] Edge weights are graded but never requested.** Every build canvas requires labelled edges (e.g. "2→1 (weight/label "1")", "1→2 (10)") and checkBuild grades "Edge labels or weights match the input", yet the only on-screen guide is "Required node-name format: Use each node's 1-based number only. Example: 2." Nothing says to label each arrow with its time (edge labels are set by selecting the edge and using Rename/F2). The student learns it only from the × line after a failed check. Same hidden requirement in Step 3 ("× Edge labels or weights match the input") and Step 4. Fix: add "Label each arrow with its travel time" to the guide for weighted problems. (S1 Q1, Q2, Q5, Q8, all remedials; S3; S4)
- **[MINOR] Q7 re-asks Q1**: same input [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2; Q1's success text already said "Shortest arrival times are 0,1,1,2; the slowest is 2." and it is Description Example 1. Q9 is Description Example 2 ([[1,2,1]], n=2, k=1 → 1). Both are answerable by lookup. (S1 Q7, Q9)
- **[MINOR] Template bug names with jargon**: "ignore relaxation bug" (predict remedial), "mark visited before shorter path bug", "require at least one edge bug". (S1 remedials)
- **[MINOR] Authored graph rules are example answers, not rules**: "Nodes: Nodes 1, 2, 3, and 4, including any node with no wire." / "Edges: A one-way arrow 1→3 labeled 5." Harmless today only because the model panel is grid-only. (data)

#### Step 2
- **[MAJOR] Q1 (Grace, make-two-way): Drawing 2 must have "Directed edges" switched OFF.** The grader requires Grace's graph to be exactly "UNDIRECTED · nodes: 1, 2 · edges: 2—1" and checks `direction`. "Duplicate graph from #1" copies the directed state, so duplicate-and-submit fails with only "× Grace's drawing exactly shows the mistake". Nothing tells the student to flip the toggle. (S2 Q1)
- **[MINOR] Weights vanish and "output" is the reached set.** The lab graphs have no travel times, and CORRECT OUTPUT is `[1,2]`, although the student just spent Step 1 computing times; the OUTPUT label invites typing a time like 1. (S2 all rounds)

#### Step 3
- **[MAJOR] "Right."/"Correct." shown for wrong answers** (Q1 v1/v2, Q3, Q5). (batch-wide pattern)
- **[MINOR] Membership claim "Only node 2 and nodes reachable from it." is quoted on inputs with k=1** (Q1, Q3) — the "2" comes from the Step 1 example with k=2. (S3 Q1 v0, Q3)
- **[MINOR] Edge labels graded with no instruction; no model panel on failure.** (S3 Q1; see Step 1)

#### Step 4
- **[BLOCKER] Case 1 hidden labels: "1", "2 source", "3", "4"** (plus edge labels "1"). The source node must be named "2 source" — never taught. Cases 2 and 3 then require plain "1", "2" with no suffix, so a student who learns case 1's trick and applies it to case 2 fails again. (S4 case 1 vs 2/3)
- **[MAJOR] Same bug three times** ("Signal roads are treated as two-way"); cases 2/3 are S1 Q2 and the relation remedial; the same sentence "It adds a reverse edge for every directed travel time for the shown graph." is correct each time. (batch-wide pattern)
- **[MINOR] Distractor jargon**: "The priority queue processes the largest tentative time before the smallest one." — the shown code has no named priority queue (sort + pop); "tentative time" is Dijkstra vocabulary. (S4 all cases)
- **[MINOR] "Changed graph" describes the correct graph**: "From source 2, arrows reach 1 and 3, while the only edge touching 4 points outward from 4." (batch-wide pattern)
- Buggy outputs verified 2, 1, 5; correct -1, -1, -1.

---

### Number of Connected Components in an Undirected Graph (`number-of-connected-components-in-an-undirected-graph`, original)

#### Step 1
- **[MAJOR] Q8 and Q9 re-ask Q1 and Q2 with the same inputs.** Q8 "For n=5, edges=[[0,1],[1,2],[3,4]], how many components appear?" → 2 (Q1's success text: "Nodes 0–2 form one component and nodes 3–4 form another."; Description Example 1). Q9 "What is the component count for chain 0—1—2—3—4?" → 1 (Q2 and Example 2). Two of the five concept checks test nothing new. (S1 Q8, Q9)
- **[MINOR] Q7 distractor refers to nodes not in the question.** "What connections are created by edges = [[0,1],[1,2]]?" gives no n, yet choice D says "Also connect node 2 to isolated nodes 3 and 4 so every node belongs to a group." (S1 Q7)
- **[MINOR] Template bug names**: "count dfs back edges bug" (Q6), "count only edge components bug" (Q4), "assume n minus edges bug" (bug-trap remedial — this one is actually a good distractor, 4−3=1, but the name obscures it). (S1)

#### Step 2
- **[MAJOR] Q1 (Hailey, make-one-way): Drawing 2 must have "Directed edges" switched ON, and the arrow direction is the click order from Drawing 1.** Grader: "character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0". Bug text "allows each two-way link to work only in its written order" has no meaning here — there is no edge list; the "written order" is the order the student clicked the two endpoints. If they clicked 0 then 1 with seed 0, Hailey reaches [0,1] = correct and the check fails "× The graph exposes the mistake" with no explanation. (S2 Q1)
- **[MINOR] Q2 (Benjamin) "builds every listed connection except the last one"** — "listed" means drawn order; acceptable only because "Edge numbers show drawing order." is appended. (S2 Q2)

#### Step 3
- **[MAJOR] "Correct." shown for wrong answers** (Q1 v1/v2, Q3, Q5). (batch-wide pattern)
- **[MAJOR] Membership claims name nodes that don't exist in the input.** On n=3, edges=[[1,0],[2,1]] (Q2) and n=3, edges=[[0,1]] (Q5): "Three nodes: connected group {0,1,2}, isolated 3, and isolated 4." — n=3 has no node 3 or 4. On n=5, edges=[[0,1],[2,3]] (Q1 v0) and the triangles (Q3): "Two nodes: one for edge [0,1] and one for edge [1,2]." — edge [1,2] is not in the input. (S3 Q1, Q2, Q3, Q5)
- **[MINOR] No model panel on graph failure.** (batch-wide pattern)

#### Step 4
- **[MAJOR] Same bug three times** ("Edge pairs become one-way arrows"; same correct sentence "Each undirected pair must enter both adjacency lists, changing this input's returned value."). Case 2 is the relation remedial input. (batch-wide pattern)
- **[MINOR] Case 3 "Code rule" was copied from case 1**: "Only arrows 1→0 and 2→1 are stored" — case 3 (edges [[1,0],[2,1],[4,3]]) also stores 4→3. (S4 case 3)
- **[MINOR] Case 2 distractor is irrelevant to the input**: "Isolated nodes should not count as connected components." on n=3 with no isolated node — trivially wrong. (S4 case 2)
- **[MINOR] "Changed graph" describes the correct graph**: "The undirected edges form component {0,1,2}, while node 3 forms a second component." (batch-wide pattern)
- Buggy outputs verified 4, 3, 5; correct 2, 1, 2.

---

### Number of Increasing Paths in a Grid (`number-of-increasing-paths-in-a-grid`, original)

#### Step 1
- **[MAJOR] [[1],[2]] is used three times and Q9 gives nothing new.** Q1 build → 3 (success text: "The paths are [1], [2], and [1→2]."), Q2 exact picture, Q9 bug-trap "For the column [[1],[2]], which paths count?" → "3: [1], [2], and [1,2]". Q7 is Description Example 1 ([[1,1],[3,4]] → 8, worked out in the description as "4 + 3 + 1 = 8 paths"). (S1 Q9, Q7)
- **[MINOR] bug-trap remedial is identical to Q6**: [[1,2],[2,3]], choices 8 | 10. (S1 remedial after Q9)
- **[MINOR] Q7 distractor "9" feedback** "The two equal 1 cells cannot connect as an increasing step." — allowing the equal step gives 13 paths, not 9. (S1 Q7)
- **[MINOR] Template bug names**: "count only multi cell paths bug", "merge paths at shared end bug", "count shared suffix once bug", "follow only left to right bug", "require at least one move bug". (S1)

#### Step 2
- **[MAJOR] Q1 (Lillian, add-diagonals): same defect as LIP** — values are ignored and the invented diagonal arrow goes from the earlier-created node to the later-created one; whether the mistake is "exposed" depends on node creation order, with no hint. (S2 Q1)
- **[MINOR] "CHOOSE THE PATH'S FIRST CELL"**: the problem counts paths starting from every cell; the lab's OUTPUT is the set of cells reachable from one chosen cell, not a path count. (S2 all rounds)

#### Step 3
- **[MAJOR] "Right."/"Correct." shown for wrong answers** (Q1 v0, Q2, Q4). (batch-wide pattern)
- **[MINOR] Q5 ([[2,2]]) claim has a false premise**: "(0,0) can reach (0,1), so the graph should contain a direct edge between them." — (0,0) cannot reach (0,1). (S3 Q5)
- **[MINOR] Guide vs failure panel conflict** ("Do not add spaces" / pattern (row,column) vs "Both (0,2) and 0,2 work."). (S3 Q1)

#### Step 4
- **[MAJOR] Same bug three times** ("Increasing paths may move only right or down"); cases 2/3 are the relation and predict remedials ([[3,2,1]], [[2,1,2]]). (batch-wide pattern)
- **[MINOR] Case 1 "Changed graph" describes the correct graph and names cells by value**: "Each smaller cell points to every larger orthogonal neighbor, producing edges 1→2, 1→4, 2→3, and 3→4." while the drawing must use (row,column). (S4 case 1)
- Buggy outputs verified 5, 3, 4; correct 11, 6, 5.

---

### Number of Islands (`number-of-islands`, original)

#### Step 1
- **[MAJOR] Q7 and Q8 are the Description's Example 1 and Example 2, and the prompts give the answer away.** Q7 shows Example 1's grid (Description: "→ output 1") and asks "A bent patch of land stays side-connected throughout. How many islands is it?" — "stays side-connected throughout" is the answer. Q8 shows Example 2's grid ("→ output 3") and asks "A 2×2 land block, a diagonal lone land cell, and a separate two-cell pair are pictured. How many islands?" — it lists three separate patches, and nothing is "pictured" (only the raw grid is shown). Fix: fresh grids, no narration of the shape. (S1 Q7 `predict-output`, Q8 `bug-trap`)
- **[MINOR] Slug-generated feedback on every build/remedial distractor.** "That result follows the count land cells bug", "…the require neighbor for island bug", "…the use eight direction dfs bug", "…the check horizontal neighbors only bug", "…the fail to join branching land bug", "…the jump across water bug", "…the include water node bug". A struggling student cannot parse "the use eight direction dfs bug". Fix: write a sentence per distractor. (Q1, Q4, Q6, Q9, all 5 remedials)
- Keys: all 4 builds and 5 remedials verified correct.

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" box means something different from the problem's output.** The Description says "Return how many islands", and every Step 1 question asked "What should the function return?" with numbers. Here the grader wants the list of reached cells as a quoted JSON array, e.g. `["(0,0)"]`; `1`, `(0,0)`, `{(0,0)}` and `[(0,0)]` are all rejected (harness probes). No hint is shown. Fix: label the boxes "Land cells the correct search reaches, e.g. ["(0,0)","(0,1)"]". (S2 Q1–Q3)
- **[MAJOR] Q3 Nevaeh: the wrong start "(0,1)" is never stated before Drawing 2.** Bug text is only "Nevaeh uses the wrong first land cell." The grader always makes her start at (0,1). A student whose own "first land cell" is (0,1) (natural for a one-row strip) can never expose her, and a student who omits cell (0,1) from the graph cannot either. Fix: "Nevaeh always starts at (0,1) instead of the cell you chose." (S2 Q3 `wrong-start`)

#### Step 3
- **[MAJOR] Q1 variant 1 claim has a false premise.** On grid [["1","0","0"],["0","1","0"],["0","0","1"]] the claim reads "(0,0) can reach (1,1), so the graph should contain a direct edge between them." — (0,0) cannot reach (1,1) at all (no edges). It is keyed NO, and the feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,1)." never says the premise is false. A literal student does not know what they are agreeing/disagreeing with. Fix: generate this claim only when the two nodes really are reachable. (S3 Q1 v1 `direct-vs-reach`)
- **[MINOR] Wrong-answer feedback starts with "Correct."/"Right."** Shown under a × after a wrong answer: Q1 v0 "Correct. Node membership alone creates neither a direct edge nor a route."; Q2 "Right. A multi-step route through (1,0) creates reachability, not a new direct edge."; Q3 "Correct. Node membership alone…"; Q4 "Correct. A zero-step path makes (0,1) reachable from itself…". Fix: strip the verdict word from `feedback if wrong`.
- **[MINOR] Label guidance contradicts itself.** Guide above the drawing: "Name each cell (row,column)… Do not add spaces or the cell value." Graph-wrong feedback below: "LABELS: … Both (0,2) and 0,2 work." Harmless (grid labels are normalised) but a literal student sees two rules.

#### Step 4
- **[MAJOR] Distractor "The answer should equal the number of land cells in this case." is true for all three cases.** Inputs have 2, 3 and 4 diagonal land cells and the real answers are 2, 3 and 4. A student who picks it is literally right, and the feedback "No. Adjacent land cells may form one island; components, not cells, are counted." argues about other inputs, not "this case". Fix: make it a claim about the code, e.g. "It counts every land cell as its own island". (S4 cases 1–3, choice `count-land`)
- **[MAJOR] Three identical cases.** Same 8-direction code, same bug title "Diagonal land is joined into one island", same three diagnosis choices (only reordered), buggy output `1` every time; inputs are diagonal chains of length 2, 3, 4 (case 2's grid is also Step 1's remedial and Step 3 Q1). After case 1 the student copies. Fix: three different bugs. (S4 cases 1–3)
- **[MINOR] Mixed framing makes the answer stand out.** The correct choice describes the code ("It creates edges between corner-touching land cells."); both distractors are "should" statements ("Water cells should be traversed as bridge nodes.", "The answer should equal…"). The only "It …" sentence is the answer.
- **[MINOR] Proof-chain wording.** Case 1 "Changed graph: The two land nodes share only a corner, so the four-neighbor land graph has no edge between them." describes the *correct* graph, not the changed one. Cases 2–3 "Returned value: The shown code returns 1; the source-repo reference solution returns 3." — "source-repo reference solution" is authoring jargon. Fix: "The correct answer is 3."
- Hidden node labels are "(0,0)"-style and are normalised for grid problems, so no secret-label problem here. Buggy outputs verified (1, 1, 1).

#### Cross-step / other
- **[MINOR] Heavy input reuse.** [["1","0"],["0","1"]] is Step 1 Q4 and Step 4 case 1; the 3×3 diagonal grid is a Step 1 remedial, Step 3 Q1 and Step 4 case 2; [["1"],["1"],["1"]], [["1","0","1"]], [["0","1"]], [["1","1"],["1","0"]] are each a Step 1 remedial and a Step 3 question.

---

### Number of Provinces (`number-of-provinces`, original)

#### Step 1
- **[MAJOR] Q7 and Q9 repeat inputs the student already built, and both are Description examples.** Q7 (`predict-output`) uses [[1,1,0],[1,1,0],[0,0,1]] — the same matrix as Q1 (build, answered "2"), Q3 (exact-picture) and Description Example 1 ("→ output 2"). Q9 (`bug-trap`) uses the 3×3 identity matrix — same as Q2 (build, answered "3") and Example 2 ("→ output 3"). Both can be answered from the Description tab or memory. Fix: fresh matrices.
- **[MINOR] Jargon / odd wording in prompts.** Q9 "What is the province count for a 3×3 identity matrix?" — "identity matrix" is never explained (the matrix is shown anyway). Q7 "For matrix […], how many provinces are shown?" — nothing is shown but numbers.
- **[MINOR] Q6 distractor B is defensible.** "Draw a separate arrow i→j for every 1, including a second reverse arrow from the mirrored entry." — two opposite arrows behave exactly like one two-way road; feedback "The matrix is symmetric and represents one undirected road per city pair." does not say why the pair of arrows is wrong. Fix: make it clearly wrong (e.g. "only one arrow i→j, from the upper triangle").
- **[MINOR] Slug-generated feedback:** "the connect through diagonal ones bug", "the ignore diagonal only cities bug", "the count direct groups only bug", "the count only off diagonal edges bug", "the merge all matrix rows bug", "the build only cities with off diagonal one bug", "the count mirrored entries as two components bug", "the split cycle into pairs bug", "the count distinct adjacency rows bug".
- Keys: all builds/remedials verified correct.

#### Step 2
- **[MAJOR] Q1 Evan "allows each two-way link to work only in its written order."** A matrix has no "written order" for a road (both [i][j] and [j][i] are 1), and the student draws their own graph, so the grader actually uses the order the student clicked the two endpoints (harness: edge drawn 1→0 became arrow 1→0; the required Evan graph was DIRECTED 1→0). Nothing on screen says click order matters and no edge numbers are shown for this round. A student who drew 0—1 starting at 0 gets an arrow 0→1, Evan reaches [0,1] = correct, "no counterexample", with no explanation. Fix: "Evan turns every road into an arrow from the city you clicked first to the city you clicked second." (S2 Q1 `make-one-way`)
- **[MAJOR] Q3 Jack "erases the outer leaves before searching."** The grader keeps every leaf city and deletes only the roads touching it: for the path 0—1—2 Jack's graph must be exactly nodes 0,1,2 with no edges. A student who literally erases the leaf cities 0 and 2 fails the drawing check. "Outer leaves" (degree-1 cities) is also jargon. Fix: "Jack deletes every road that touches a city with only one road; the cities stay." (S2 Q3 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1]` (cities reached), not the province count** the student has been answering with all through Step 1. Rejected probes: `0, 1`, `{0,1}`, `["0","1"]`, `[1,0]`. No hint shown. (S2 Q1–Q3)
- **[MINOR] Q2 Riley's substitute city is hidden and "province seed city" is jargon.** "Riley ignores the chosen province seed city and uses a different one." — the different one is 1 (only shown in Drawing 2's title); if the student's own seed city is 1 no counterexample exists. Fix: "Riley always starts at city 1" and call it "the city the search starts from".

#### Step 3
- **[MAJOR] Membership claim keyed NO is true for the shown input.** Q1 variant 1 and Q5 ask "Use this node rule for the graph: “Only cities that have an off-diagonal `1` connecting them to another city.”" on [[1,1,0],[1,1,1],[0,1,1]] and on the 4-cycle matrix — every city there has an off-diagonal 1, so that rule produces exactly the correct node set. A literal student who tests the rule on the input says Yes and is marked wrong. Fix: only quote a wrong node rule on inputs where it changes the node set (Q2/Q3, which have an isolated city). (S3 Q1 v1, Q5 `membership`)
- **[MINOR] Wrong-answer feedback starts with a verdict word:** Q1 v0 "Right. A multi-step route through 1 creates reachability…"; Q2/Q3/Q4 "Correct. The mini-example lists 1—2 as one direct edge." ("mini-example" is also jargon).
- **[MINOR] Third wording of the node rule.** Feedback says "Correct node rule: One node for each matrix row and column index." while Step 1 Q4's correct choice was "Cities 0, 1, 2, and 3—one node for each row and column."

#### Step 4
- **[BLOCKER] Case 1 hidden node labels are "city 0", "city 1", "city 2".** Step 1/3 taught "Use each node's 0-based number only. Example: 2.", cases 2 and 3 of this same step require "0","1","2", and Step 4 shows no guide. The student draws 0,1,2, gets "× The drawing has every exact node" and no hint. Fix: change case 1's canvas labels to "0","1","2". (S4 case 1 `authored-deep-case`)
- **[MAJOR] Three identical cases.** Same code (`return visited.size > 0 ? 1 : 0` — always 1), same bug "Only city 0's province is counted", same three choices; cases 2 and 3 are Step 1's build-isolated and exact-picture remedial inputs whose answers (3, 2) the student already gave. (S4 cases 1–3)
- **[MINOR] Feedback talks about "friendship".** "No. Friendship is mutual and the matrix is symmetric." (all cases) and case 2 "Cities 0,1,2 have no off-diagonal friendship edges" — the lesson is about cities and roads; "friendship" comes from the old LeetCode framing and is never introduced.
- **[MINOR] Mixed framing / tacked-on phrases.** Distractors "Diagonal 1 entries should each add another province for the shown graph." and "The matrix should be read as one-way roads, changing this input's returned value." are "should" statements; the answer is the only sentence describing what the code does.
- Buggy outputs verified (1, 1, 1); correct outputs 2, 3, 2 verified.

#### Cross-step / other
- **[MINOR] Every Step 3 input is a Step 1 remedial input**, and Step 4 cases 2–3 are Step 1 inputs; the identity matrix appears in Step 1 Q2, Q9 and Step 4 case 2.

---

### Possible Bipartition (`possible-bipartition`, original)

#### Step 1
- **[MINOR] Q1's success text gives away Q8.** Q1 (`n = 4, dislikes = [[1,2],[1,3],[2,4]]`) shows after success: "A valid split is {1,4} and {2,3}; group sizes need not be prescribed." Q8 then asks the same input "For dislikes [1,2],[1,3],[2,4], which split works?" and the correct choice is "Group {1,4} and group {2,3}". Q9 likewise reuses Q2's triangle after "People 2 and 3 also dislike each other, forcing a contradiction." → Use fresh inputs for predict-output / bug-trap. (S1 Q8, Q9)
- **[MINOR] Q9 correct choice is the only verdict among three procedures.** "put 1 alone, then put both 2 and 3 opposite 1", "color 1 and 3 differently, then reuse 1's color for 2", "mark each person visited before checking already-colored neighbors" are algorithm steps; "the triangle cannot be colored with only two groups" is a conclusion, so it stands out. D is jargon ("mark … visited", "already-colored neighbors") for this student. → Make all four choices verdict+reason. (S1 Q9)
- **[MINOR] Q3 Picture D feedback uses directed wording on an undirected graph.** Displayed feedback: "This drops an item that still exists even when it has no outgoing move." Person 4 has a dislike edge; "outgoing move" means nothing here. (S1 Q3)
- Answer keys: all 4 builds and 5 remedials verified correct.

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" for a true/false problem wants a list of people.** The function returns true/false, but the grader wants `[1,2]` (people the coloring reached from the "first person colored"). Nothing on screen says so; a literal student types `true`. → Relabel "People reached by the correct search" and add a format hint. (S2 all)
- **[MAJOR] Q2 requires drawing the identical graph twice.** Jasmine "keeps only the last branch it sees"; grader: "character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 3—4" = drawing 1. But the prompt says "Draw two graphs: first the correct graph, then Jasmine's graph using the mistake." The student will change drawing 2 and fail. → Say "Jasmine's graph is the same picture; only her search differs — copy it exactly." (S2 Q2)
- **[MINOR] Start label duplicated:** "CHOOSE THE FIRST PERSON COLORED" followed by "first person colored". (S2 all)

#### Step 3
- **[MINOR] Wrong-answer feedback starts with "Right."** After answering the direct-vs-reach claim wrong the × line reads "Right. A multi-step route through 2 creates reachability, not a new direct edge." (Q1 v0, v1, v2, Q5). → Drop the leading "Right."/"Correct." in the wrong-review list. (S3 Q1, Q5)
- **[MINOR] Degree feedback only restates the claim.** Claim "2 has exactly 2 direct neighbors." → feedback "2 has 2 direct neighbors." with no pointer to the two edges. (S3 Q1 v2, Q4, Q5)
- Claims verified true/false as keyed; membership rules here don't name absent values.

#### Step 4
- **[BLOCKER] Hidden labels "person N" contradict the taught format.** Step 1/3 guide: "Use each node's 1-based number only. Example: 2." Step 4 shows no guide and the code uses bare numbers, yet every case requires exactly "person 1", "person 2", … : case 1 "person 1"–"person 5", case 2 "person 1"–"person 6" (person 6 isolated), case 3 "person 1"–"person 7" (person 7 isolated). A student drawing "1", "2", … only sees "× The drawing has every exact node". → Relabel canvases to bare numbers. (S4 cases 1–3)
- **[MAJOR] All three cases are the same question.** Identical code, same bug "A disconnected dislike group is ignored", identical diagnosis choices, same correct choice "It colors only person 1's connected component for the shown graph." Case 1's input is Step 1 Q4's input (answer false already shown). Cases 2–3 test nothing new. (S4 cases 2, 3)
- **[MINOR] "Changed graph" describes an unchanged graph.** Cases 2–3: "Changed graph: Nodes: person 1, … Direct edges: person 1—person 2; …" — the bug changes where coloring starts, not the graph. "the source-repo reference solution returns false" is jargon. (S4 cases 2, 3)
- **[MINOR] Distractors are phrased as fixes, the answer as a description.** "Person labels should be converted to zero-based indexes…" and "Each dislike should point only from the first person to the second." vs "It colors only…". (S4 all)
- Declared outputs verified by running the code: `true`,`true`,`true`; real answers `false`.

#### Cross-step / other
- **[MINOR] Label format per step:** Step 1/3 "1"; Step 2 "1" (accepted); Step 4 "person 1".

### Smallest String With Swaps (`smallest-string-with-swaps`, original)

#### Step 1
- **[MINOR] Q7 and Q9 repeat build questions whose answers were already shown.** Q7 (`s = "dcab", pairs = [[0,3],[1,2]]` → "bacd") = Q1's input/answer after "Each pair is a separate component…". Q9 (`[[0,3],[1,2],[0,2]]` → "abcd") = Q3's; its stem "Adding pair [0,2] connects all four indices." states the reason. (S1 Q7, Q9)
- **[MINOR] Q2 Picture D feedback "…even when it has no outgoing move"** on an undirected swap graph. (S1 Q2)
- Keys verified: "bacd", "abcd", "cba", "aba"; remedials "ab", "abc", "abc", "cdab", "abcd".

#### Step 2
- **[MAJOR] Step 1's node names are rejected and there is no string.** Probe with "0:d","1:c","2:a","3:b" → "Use numeric IDs 0, 1, 2, ... with no gaps." Step 1 and Step 3 both say "Name each position index:letter … Do not add spaces." Step 2 shows no guide and wants bare "0","1". There is no `s` in Step 2, so "CHOOSE THE POSITION TO GROUP" refers to positions of a string that does not exist. → Show a Step 2 label guide and explain the drawing is only the swap graph. (S2 all)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1]` (positions reached), not a string.** The problem returns a string; nothing explains the switch. (S2 all)
- **[MINOR] Q3 Zachary's wrong position (1) is only revealed in Drawing 2's title;** the student must pick a graph where 0 and 1 reach different sets before knowing 1 is the wrong start. (S2 Q3)

#### Step 3
- **[MAJOR] Membership claim names a letter absent from the input.** Input `s = "cba"`, claim: "Use this node rule for the graph: “The distinct letters d, c, a, and b, without their positions.”" There is no d. (S3 Q1 v0)
- **[MINOR] "Right."/"Correct." leading wrong-answer feedback:** Q2 "Right. A multi-step route through 1:b…", Q3 "Correct. The mini-example lists 2:b—3:a…". (S3 Q2, Q3)
- **[MINOR] Degree feedback restates the claim** ("2:a has 1 direct neighbor."). (S3 Q1 v2)

#### Step 4
- **[BLOCKER] Hidden label format changes between cases and none is shown.** Case 1 requires "index 0: b", "index 1: a"; case 2 requires "0:d","1:c","2:a","3:b" (the Step 1 format); case 3 requires "index 0: c", "index 1: b", "index 2: a". A student who passes case 2 with the taught format fails cases 1 and 3 with only "× The drawing has every exact node". → Use `index:letter` on every canvas. (S4 cases 1, 3)
- **[MAJOR] Graph-proof "Code rule" is factually wrong in cases 2 and 3.** All three show "Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0." Case 2 input `pairs = [[0,3],[1,2],[0,2]]` has no pair [1,0]; the stored arrows are 0→3, 1→2, 0→2. Case 3 stores 2→1 and 1→0. → Per-case rule: "Only the arrow first→second of each pair is stored." (S4 cases 2, 3)
- **[MAJOR] Three cases, one bug.** Same code, same bug "Swap pairs are treated as one-way", same correct choice "A swap pair must connect both indexes in one component on the shown input." Case 2's input is Step 1 Q3 (answer known). (S4 cases 2, 3)
- **[MINOR] Hard-to-parse text:** boundary "The pair is written opposite the ascending scan direction."; distractor "The pair may be used only once, so components should not be formed in this case." (S4 case 1)
- **[MINOR] Output must be a double-quoted string:** `ba` and `'ba'` rejected, only `"ba"`; placeholder "Example: false, 3, or [1, 2]" shows no string example. (S4 all)
- Declared outputs verified by trace: `"ba"`, `"acbd"`, `"cba"`.

#### Cross-step / other
- **[MAJOR] One node, three label formats:** Step 1/3 "0:d"; Step 2 "0"; Step 4 "index 0: b" (cases 1, 3) or "0:d" (case 2).

### Time Needed to Inform All Employees (`time-needed-to-inform-all-employees`, original)

#### Step 1
- **[MAJOR] Q7's input violates the problem statement, making the key debatable.** Description: "Employees with no reports have informTime[i] == 0." Q7 shows `n = 1, headID = 0, manager = [-1], informTime = [4]` and keys "0 minutes". A common accepted solution that records `time + informTime[i]` when visiting a node returns 4 on this input; the statement's own constraint excludes it. → Use `informTime = [0]` (the Description's Example 1) or say explicitly "the head's 4 minutes are never spent because nobody is waiting". (S1 Q7)
- **[MINOR] Q8 restates Q1 with the answer in the stem.** "Head 2 needs 1 minute and directly manages all five other employees. Total time?" is Q1's input, whose success text was "The head informs direct reports in parallel, so all hear after one minute." (S1 Q8)
- **[MINOR] Q5 wording/distractor.** "which arrow should appear in the useful traversal graph?" — "useful traversal graph" is undefined. Distractor A "4→1 because the manager array points employee 4 at boss 1." is a defensible model (walking up also solves it); its own feedback concedes "That is how the input is read". → Ask "which arrow lets the news flow downward?" (S1 Q5)
- Keys verified: 1, 6, 5, 0; remedials 2, 0, 3, 7, 4.

#### Step 2
- **[MAJOR] Hidden rule: the chosen head must be the root of the drawing.** Probe rejected with "The chosen company head must be the graph root." Nothing before Check says the drawing must be a tree with no arrow into the chosen head. → State it under the start field. (S2 Q1)
- **[MAJOR] Q3 requires the identical graph twice.** Brayden "stops after one hop"; grader: "character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2" = drawing 1, but the prompt says "then Brayden's graph using the mistake." (S2 Q3)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1,2]` (employees reached), not minutes.** The problem returns a number; no hint. (S2 all)

#### Step 3
- **[MINOR] Wrong-answer feedback begins "Correct."**: "× Correct. The mini-example lists 1→0 as one direct edge." shown after a wrong answer. (S3 Q1 v0, v1; Q4, Q5)
- **[MINOR] Q1 is trivial and its feedback only restates.** Two nodes, one edge: "0 has exactly 0 outgoing direct edges." → "0 has 0 outgoing direct edges." (S3 Q1)
- Claims verified as keyed.

#### Step 4
- **[BLOCKER] Hidden labels are comma-containing phrases in cases 1 and 3, bare numbers in case 2.** Case 1 requires exactly "head 0, delay 1", "manager 1, delay 5", "manager 2, delay 1", "employee 3", "employee 4"; case 3 requires "head 0, delay 2", "manager 1, delay 3", "manager 2, delay 4", "employee 3", "employee 4", "employee 5"; case 2 requires "0"–"4". No guide shown. → Bare numbers everywhere. (S4 cases 1, 3)
- **[MAJOR] Case 3 proof text is unreadable because labels contain commas.** "Changed graph: Nodes: head 0, delay 2, manager 1, delay 3, manager 2, delay 4, employee 3, employee 4, employee 5. Direct arrows: head 0, delay 2→manager 1, delay 3; …" — the student cannot tell where one name ends. (S4 case 3)
- **[MAJOR] Three cases, one bug, and the code has no graph to reason about.** The 10-line loop sums positive `informTime`; all cases key "It sums delays from separate branches instead of taking the slowest root-to-leaf path." Case 2 input = Step 1 Q6 (answer 5 known). "Reachable boundary: The head has two branches that receive information concurrently." is not a boundary. (S4 cases 2, 3)
- **[MINOR] Both distractors end "…changing this input's returned value." and the correct choice does not** — predictable. (S4 all)
- Declared outputs verified: 7/6, 7/5, 9/6.

#### Cross-step / other
- **[MAJOR] Label formats:** Step 1/3 "2"; Step 2 "2"; Step 4 "manager 2, delay 1" (cases 1, 3).

### Water and Jug Problem (`water-and-jug-problem`, original)

#### Step 1
- **[BLOCKER] Builds are graded against arbitrary partial state graphs that contradict the lesson's own edge rule.** Q6's correct rule: an edge exists "When one legal fill, empty, or pour operation changes the first state into the second." gradeCanvas requires the sorted node list and edge list to match exactly, yet:
  - Q1 (2, 3, target 1) requires nodes (0,0),(2,0),(0,3),(2,3),(0,2),(2,1) and edges (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3), (0,3)→(2,1). Legal moves it forbids: (2,0)→(0,0) (empty jug 1), (0,3)→(0,0), every move out of (2,3), (0,2), (2,1), and the reachable states (2,2), (1,3), (1,0), (0,1). Full graph: 10 nodes / 34 edges.
  - Q5 (1, 2, target 3) requires 4 nodes / 4 edges; omits pours (1,0)→(0,1), (0,2)→(1,1) and empties back to (0,0). Full graph: 6 nodes / 18 edges — exactly what Step 4 case 2 demands for the same input.
  - Q8 (3, 5, target 0) requires ONLY the node "(0,0)" with no edges, while the exact-picture remedial (3, 5, target 5) requires (0,0)→(3,0) and (0,0)→(0,5).
  - relation-rule remedial (2, 3, target 1) requires just "(0,3)", "(2,1)" with edge (0,3)→(2,1) and no (0,0) — the same input Q1 graded as 6 nodes.
  - core-rule remedial (2, 3, target 2) requires nodes (0,0),(2,0),(0,2) with the single edge (0,0)→(2,0): (0,2) is isolated with nothing leading to it.
  - bug-trap remedial (4, 8, target 3) requires node (4,8) with no edges although (4,0)→(4,8) and (0,8)→(4,8) are fills.
  The implicit convention (BFS-order forward edges, stop when the target appears) is never stated; the screen says only "1 · Draw the graph". A student who applies the taught rule fails every build. → Either grade the complete reachable graph (as Step 4 does) with "draw every legal move", or state exactly which moves to draw. (S1 Q1, Q2, Q5, Q8 + all remedials)
- **[MAJOR] Q7 and Q9 distractors are true statements.** Q7 "Which graph reasoning is correct for this case?" (3, 5, target 4) offers "neither jug has capacity 4" and "3+5 is not 4" — both literally true. Q9 (2, 6, target 5) offers "only because 5 is larger than jug 1". Choices are lowercase fragments with no verdict attached. → "The answer is true because…" / "false because…". (S1 Q7, Q9)
- **[MINOR] Q7/Q9 are the Description's Examples 1 and 2,** whose explanations give the reasoning ("Every reachable amount is a multiple of 2, so 5 liters is impossible" ≈ Q9's correct "every reachable amount remains even"). (S1 Q7, Q9)
- **[MINOR] Q3 Picture B feedback "This picture drops a connection that appears in the input."** — the input is three numbers; no connections appear in it. (S1 Q3)

#### Step 2
- **[MAJOR] Outputs must be JSON arrays of quoted state strings** (`["(0,0)"]`); probes `(0,0)`, `{(0,0)}`, `[(0,0)]` rejected. No hint anywhere; the problem itself returns true/false. (S2 all)
- **[MINOR] "CHOOSE THE STARTING STATE" is read-only and prefilled "(0,0)".** Label says choose; the student cannot. (S2 all)
- **[MINOR] Q2 Austin's wrong start "(0,1)" is only revealed in Drawing 2's title.** (S2 Q2)

#### Step 3
- **[BLOCKER] Degree claims are keyed to the hand-picked partial graph and are false under the problem's rules.**
  - Q1 (4, 6, 5): "(0,6) has exactly 1 outgoing direct edge." keyed YES — real moves from (0,6): fill→(4,6), empty→(0,0), pour→(4,2) = 3. "(4,2) has exactly 1 outgoing direct edge." keyed YES — real = 4. v2 feedback "(2,0) has 0 outgoing direct edges." — real = 4.
  - Q4 (2, 3, 2): "(2,0) has exactly 0 outgoing direct edges." keyed YES — real: (2,3), (0,0), (0,2) = 3.
  - Q5 (2, 3, 1): "(2,1) has exactly 0 outgoing direct edges." keyed YES — real: (2,3), (0,1), (2,0), (0,3) = 4.
  - Q3 (3, 5, 5) feedback "(0,5) has 0 outgoing direct edges." — real = 3.
  A student who knows the jug moves answers correctly and is marked wrong. (S3 Q1, Q3, Q4, Q5)
- **[BLOCKER] Required graphs are the same arbitrary fragments:** Q5 (2, 3, 1) wants only "(0,3)", "(2,1)" + one edge (no start state); Q4 wants an isolated (0,2); Q2 (4, 8, 3) wants an edgeless (4,8). (S3 Q2, Q4, Q5)
- **[MAJOR] Membership claim quotes capacities not in the input.** Input 4 and 6; claim: "It would be a mistake to use this node rule: “One node for capacity 3 and one node for capacity 5.”" (S3 Q1 v0)
- **[MINOR] "Right." leading wrong-answer feedback** (Q1 v0, v1). (S3 Q1)

#### Step 4
- **[BLOCKER] Case 3 hidden labels have no parentheses.** Required: "0,0", "0,1", "0,2", "0,3", "1,0", "1,1", "1,2", "1,3" with 26 arrows. Step 1/3 guide: "Name a state (jug1Amount,jug2Amount). Example: (2,3)." and cases 1–2 require "(0,0)". `normalizeNodeLabel` strips parentheses only when `usesGridCellLabels()` (visualKind "grid" or kattis-getting-gold), so "(0,0)" ≠ "0,0" and case 3 cannot be passed with the taught format. The proof text "Nodes: 0,0, 0,1, 0,2, …" is unreadable too. → Relabel to "(0,0)". (S4 case 3)
- **[BLOCKER] Step 4 requires the COMPLETE state graph that Step 1 rejected.** Case 1 text: "The complete reachable state graph has four amount pairs … with every legal fill, empty, and pour transition shown." Case 2 (1, 2, target 3) requires 6 nodes / 18 arrows; Step 1 Q5, same input, required 4 nodes / 4 arrows. Case 3 requires 8 nodes / 26 arrows drawn exactly (verified complete by enumeration). Nothing says the convention changed. (S4 cases 1–3)
- **[MAJOR] The code is gcd arithmetic, not a search, and three cases share one bug.** Same correct choice "It rejects targets above the larger jug instead of above the two-jug total." in all three; case 2 input = Step 1 Q5. (S4 cases 2, 3)
- **[MINOR] Distractor states a false rule as a diagnosis:** "Filling a jug directly is not an allowed move, changing this input's returned value."; "The gcd test should require target to equal the gcd for the shown graph." is jargon. (S4 all)
- Declared outputs verified: `false` ×3 (target > larger jug); real answers `true`.

#### Cross-step / other
- **[BLOCKER] Same input, different "correct" graphs:** (2, 3, 1) → 6 nodes (S1 Q1) vs 2 nodes (S1 relation remedial, S3 Q5); (1, 2, 3) → 4 nodes / 4 edges (S1 Q5) vs 6 nodes / 18 edges (S4 case 2).

### Word Search (`word-search`, original)

#### Step 1
- **[BLOCKER] Builds grade a hidden directed "word-step" graph that contradicts the taught edge rule.** Q7's correct answer (and Step 3's "Use this graph model" panel) says EDGES = "Connections only between cells sharing a side". The required drawings are DIRECTED and keep only side-steps whose letters are consecutive letters of the word:
  - Q1 board [[A,B],[D,C]], "ABC": only (0,0)→(0,1), (0,1)→(1,1); side pairs (0,0)—(1,0), (1,0)—(1,1) must be left out.
  - Q4 board [[A,X],[X,B]], "AB": 4 nodes and NO edges, although every cell has two side neighbors.
  - Q2 board [[A,B]], "ABA": only (0,0)→(0,1); B→A omitted.
  - core-rule remedial [[A,A]], "AA": only (0,0)→(0,1) — (0,1)→(0,0) is an equally valid A→A step; the direction is arbitrary.
  The screen says only "1 · Draw the graph". A student drawing the side grid as taught fails every build. → State "draw an arrow for each move that spells the next letter", or grade the plain side grid. (S1 Q1, Q2, Q4, remedials)
- **[MINOR] Q8/Q9 answers are printed in the Description tab.** Example 1's explanation "walk right to 'B', right to 'C', down to 'C', down to 'E', then left to 'D'" is Q8's correct choice; Example 2's "walk down to 'E' and left to 'E'" is Q9's. (S1 Q8, Q9)
- **[MINOR] Q3 Picture B feedback "drops a connection that appears in the input"** — a board lists no connections. (S1 Q3)
- Keys verified: true, false, false, true; remedials true ×5.

#### Step 2
- **[MAJOR] Step 1's directed drawing is rejected.** Probe → "Use two-way edges." Steps 1/3 required arrows; Step 2 silently requires undirected and only says so after Check. (S2 Q1)
- **[MAJOR] "CHOOSE THE WORD'S FIRST CELL" with no word or board.** Step 2 has no letters; the student invents bare coordinate nodes. "CORRECT OUTPUT" wants `["(0,0)","(0,1)"]` (cells reached), not true/false, and `[(0,0)]` is rejected. (S2 all)
- **[MINOR] Q1 Aidan: "diagonal" is decided from the coordinates in the labels,** so the two nodes must be named as real diagonal cells (e.g. (0,0) and (1,1)); not stated. (S2 Q1)

#### Step 3
- **[BLOCKER] Keys/feedback contradict the on-screen graph model.** The panel shown after a wrong graph says EDGES = "Connections only between cells sharing a side", yet: Q1 [[A,B],[B,C]] v2 "(1,0) has exactly 2 outgoing direct edges." keyed NO, feedback "(1,0) has 1 outgoing direct edge." — (1,0) shares sides with (0,0) and (1,1). Q5 [[A,B,X],[B,C,X]] feedback "(0,2) has 0 outgoing direct edges." — (0,2) touches (0,1) and (1,2); the required graph omits (0,1)—(0,2), (1,1)—(1,2), (0,2)—(1,2). Q2 [[C,A,T]] feedback "(0,1) has 1 outgoing direct edge." — it touches two cells. (S3 Q1, Q2, Q5)
- **[BLOCKER] Q3 [[A,A]], "AA" requires (0,0)→(0,1) only;** (0,1)→(0,0) is equally an A→A move. Unguessable direction. (S3 Q3)
- **[MAJOR] Membership claims quote "such as C, CA, and CAT"** on boards with no CAT (Q1 [[A,B],[B,C]]) or no C at all (Q4 [[D],[O],[G]]). (S3 Q1 v2, Q4)
- **[MINOR] "Right." leading wrong-answer feedback** (Q1 v0, v1; Q4). (S3 Q1, Q4)

#### Step 4
- **[BLOCKER] Step 4 requires the UNDIRECTED full side grid — the opposite of Steps 1/3.** Case 2 board [[B,A],[A,A]] requires exactly (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1) undirected; case 1 requires all 12 side edges of the 3×3 board. A student drawing Step 1-style arrows (A→A, A→B steps only) fails both the edge check and "The drawing uses the problem's direction". Nothing says the convention changed. (S4 cases 1–3)
- **[MAJOR] Three cases, one bug.** Same code, same bug "Cells stay blocked after a failed path", same correct choice "The visited set is global instead of belonging only to the current candidate path." Cases 2 and 3 are the same 2×2 board with B renamed to C. (S4 cases 2, 3)
- Declared outputs verified by running the code: `false` ×3; real answers `true`.

#### Cross-step / other
- **[BLOCKER] Edge convention flips across steps:** Step 1/3 directed word-steps → Step 2 undirected → Step 4 undirected full grid.

### After the Big Resignation (`who-keeps-their-job`, variant)

#### Step 1
- **[MAJOR] Q7 and Q9 re-ask builds the student just passed, with the tree narrated.** Q7 uses Q1/Q2's input (ids=[10,2,7,15]…) and says "The chart has 10 above 2 and 7, and 2 above 15. If employee 2 quits, which sorted IDs remain?" — the student already chose "[7,10]" in Q1. Q9 uses Q3's input and says "The chart has 6 above 1 and 8, and 1 above leaf employee 3." — the student already chose "[1,6,8]" in Q3. Neither the raw input nor a drawing is needed. Fix: fresh inputs, no narration. (S1 Q7 `concept-output`, Q9 `concept-counterexample`)
- **[MINOR] Q8 distractor "[5,7,20,90]" includes the quitter** in "who still works", with feedback "This treats quitId 5 as an array position, fails to find that position, and therefore removes nobody." — "array position" is code jargon for this student.
- **[MINOR] Q4 distractor cites IDs not in the input.** "One reporting relationship such as `10 → 20`." while the shown ids are [4,9,2,7,12,5,3,8]; Step 3 re-quotes the same "10 → 20" on inputs [50,4,6] and [42].
- Keys: all builds/remedials verified.

#### Step 2
- **[MINOR] Here "CORRECT OUTPUT" really is the problem's answer (remaining IDs; `result: "unreached-nodes"`), but the success text still says "Why it works: the same input produces different reachable sets under the broken and correct rules."** The boxes show `[2]` / `[]` — remaining employees, not reachable sets. Also inconsistent with every other problem in this batch, where the same box means "nodes reached". Fix: "…produce different lists of remaining employees."
- **[MINOR] Bug wording.** Q1 "Charles reads every from/to relationship backward." — the lesson's words are boss/report, not from/to. Q3 "Luis builds every listed connection except the last one." — there is no list; it means the last edge the student draws ("Edge numbers show drawing order." is appended, but a student may still look for a "list"). Q2 "Maria stops after one hop" — "hop" undefined. Fix: "the last edge you draw", "boss→report arrow", "one level down".

#### Step 3
- **[MINOR] Q5 one-node input (ids=[42]) self-edge claim:** "Because 42 can reach itself, the graph should contain a direct 42→42 edge." — keyed NO; nothing in the lesson taught "reach itself".
- **[MINOR] Wrong-answer feedback starts with "Right."/"Correct."** (Q1 v0 and v1 "Right. A multi-step route through 8…", Q4 "Correct. The mini-example lists 11→2 as one direct edge.").
- All 15 claims otherwise verified true/false as keyed; degree claims correctly say "outgoing direct edge".

#### Step 4
- **[MAJOR] Three identical cases whose inputs are Step 1's Q1, Q6 and Q8 builds.** Same 8-line code, same bug "Stops the resignation at one employee", same three choices; the correct output of each case was already the student's Step 1 answer, and the buggy output is always "that answer plus the quitter's reports". (S4 cases 1–3)
- **[MINOR] Code and input presentation.** The code is `function solve(input) { const { ids, quitId } = input; …` — object destructuring, never explained, and `bosses` is never read; case 1 shows the input as three lines "ids: [10, 2, 7, 15] / bosses: [0, 10, 10, 2] / quitId: 2" while cases 2–3 show "ids=[4,9,2], bosses=[0,4,4], quitId=4". The "Changed graph" line ("10 points to direct reports 2 and 7; 2 points to direct report 15.") is just the correct graph because the code builds none.
- **[MINOR] Distractor feedback jargon.** "The comparator is numeric. The extra employee, not the order, causes the failure."
- Hidden labels match the taught format; buggy outputs verified ([7,10,15], [2,9], [7,20,90]).

---

### Busiest Shelf Level (`busiest-shelf-level`, variant)

#### Step 1
- **[MAJOR] Correct-answer feedback contradicts the tie rule.** Q4 `items=[[],1,[2,[]]]`: depth 1 and depth 2 each hold one item. The correct choice "1" is explained as "Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth." — "more than any other depth" is false here. The same false sentence appears for the `concept-picture` remedial `[1,[4,[6]]]` (three-way tie, answer 1) and the `concept-counterexample` remedial `[0,[0,[9]]]` (three-way tie, answer 1). A student who counted correctly will think they mis-counted. Fix: on ties say "Depth 1 ties depth 2 with 1 item each; ties go to the shallower depth." (Q4, remedials 1 and 5)
- **[MINOR] Q8 states its own answer and repeats Q4.** "For items = [[],1,[2,[]]], depths 1 and 2 each hold one item. Which depth is returned?" — the tie is given, so only the tiebreak sentence from the Description is needed, and the input is the one just built in Q4. Distractor feedback "The depth-3 box is empty" is also off: the empty box is at depth 2 (its contents would be depth 3). (Q8)
- **[MINOR] Q9 distractor feedback does not fit.** `items=[7]`, wrong "0" → "This shifts integer depth when crossing an array container." There is no inner container; the mistake is counting from 0. (Q9)
- **[MINOR] Q5 raw-input box shows the line "Focus on one listed relation."** under the input, with no meaning for the student. (Q5)
- All build/remedial answers verified (2, 1, 2, 1; 1, 2, 2, 2, 1). Fine.

#### Step 2
- **[MAJOR] Step 1's taught labels are rejected.** Submitting `root=[]`, `root[0]=1`, … → "Use root, root[0], root[1], ... to name nested input items." Discovered only after Check; expected output looks like `["root","root[0]"]`, nothing like the depth number the student has been answering with. (S2 Q1)
- **[MINOR] "CHOOSE THE OUTER SHELF" is read-only** (prefilled `root`). (S2 Q1–3)
- **[MINOR] "Diego keeps only the last branch it sees."** — "it" for a person. (S2 Q3)

#### Step 3
- **[MINOR] "× Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge."** shown after a wrong answer (Q1 variants 0 and 1). (S3 Q1)
- All 15 claims verified correct as keyed.

#### Step 4
- **[BLOCKER] Case 1 requires secret labels `root`, `1`, `box A`, `2`, `3`, `box B`, `box C`, `4`.** Steps 1 and 3 taught `root=[]`, `root[0]=1`, `root[1]=[]`, …, and cases 2 and 3 of this same step require that taught format (`root[0]=[]`, `root[0][0]=3`, …). No guide is shown. The student would also have to guess that `[2,3]` is "box A", `[[4]]` is "box B" and the inner `[4]` is "box C". A correct drawing in the taught format fails with only "× The drawing has every exact node". Fix: relabel the case-1 canvas to the `root[...]=` format. (S4 case 1)
- **[MAJOR] Internal slug shown to the student.** Cases 2 and 3 print "→ Reachable boundary: count-container-nodes → Returned value: …" in both the wrong-diagnosis feedback chain and the success text. (S4 cases 2, 3)
- **[MINOR] Case 1 input formatting differs from every other screen:** `items: [1, [2, 3], [[4]]]` vs `items=[1,[2,3],[[4]]]`. (S4 case 1)
- Buggy outputs verified (1, 1, 1); real outputs 2, 2, 2 correct; diagnosis distractors clearly wrong. Fine.

### Coins on Level K (`coins-on-level-k`, variant)

#### Step 1
- **[MINOR] Q1 distractor value does not match its feedback.** `items=[1,[2,3],[[4]]], k=1`: wrong "5" (= 2+3, the depth-2 sum) is explained as "This includes coins one level deeper than k" — including deeper coins would give 1+2+3 = 6. The 5 is really an off-by-one-depth answer. (Q1)
- **[MINOR] Two remedial distractors are impossible values with false feedback.** `[[],[5]], k=2`: wrong "6" → "This includes coins one level deeper than k" — there are no coins below depth 2. `[0,[0,[9]]], k=3`: wrong "10" → same feedback; nothing is deeper than 9. (remedials 3 and 5)
- All build/remedial answers verified (1, 2, 4, 7; 4, 0, 5, 4, 9). Fine.

#### Step 2
- **[MAJOR] Step 1's taught labels are rejected** ("Use root, root[0], root[1], ... to name nested input items."), same as busiest-shelf. (S2 Q1)
- **[MAJOR] Q2 wrong start `root[0]` is hidden.** "Adam uses the wrong outer box." The start field is read-only `root`; Adam secretly starts at `root[0]` (shown only in Drawing 2's title). The student must make `root[0]` reach a different set than `root` without being told which box Adam opens. (S2 Q2 `wrong-start`)
- **[MINOR] "CHOOSE THE OUTER BOX" is read-only.** (S2 Q1–3)

#### Step 3
- **[MINOR] Q2 `[[1],2,[3]]`: "It would be a mistake to use this node rule: Only positive-valued coins…"** — no negative coins exist, so the rule gives the identical graph. (S3 Q2)
- All 15 claims verified correct as keyed.

#### Step 4
- **[BLOCKER] Case 1 requires secret labels `root`, `box A`, `3`, `2`, `5`, `box B`, `box C`, `4`** while cases 2 and 3 require the taught `root=[]`, `root[0]=[]`, `root[0][0]=3`, … format. No guide is shown. (S4 case 1)
- **[MAJOR] Slug "zero-based-depth" shown as the Reachable boundary** in cases 2 and 3 ("→ Reachable boundary: zero-based-depth →"). (S4 cases 2, 3)
- **[MINOR] Case 1 "Changed graph" sentence is garbled:** "Coins 3 and 2 are two edges below the root container's contents convention and belong to level 2; coin 4 belongs to level 3." (S4 case 1)
- Buggy outputs verified (4, 5, 0); real outputs 5, 1, 2 correct. Diagnosis fine.

### Counting Constellations (`counting-constellations`, variant)

#### Step 1
- **[MINOR] The correct answer is predictable.** 7 of the 9 two-choice builds (Q1, Q2, Q6 and remedials 1–4) have answer "1"; only Q4 (3) and remedial 5 (2) differ. (S1)
- **[MINOR] Q9 distractor feedback is unreadable.** "3" → "This explores from one top star only one diagonal direction, then starts two extra searches." (Q9)
- All build/remedial answers verified (1, 1, 3, 1; 1, 1, 1, 1, 2). Remedial 4 requires all 8 edges of the plus shape including 4 diagonals — heavy but correct.

#### Step 2
- **[MAJOR] Q3 wrong start `(0,1)` is hidden, and on a legal sky the student must start at least two cells away.** "Aaliyah ignores the chosen first star and uses a different one." With 8-direction touching every cell within one step of `(0,1)` — `(0,0)`, `(0,2)`, `(1,0)`, `(1,1)`, `(1,2)` — is in the same constellation as `(0,1)`, so starting there gives Aaliyah the same set. The answer the grader accepted (start `(0,0)`, node `(0,1)` joined only to `(0,2)`) is an impossible sky: `(0,0)` and `(0,1)` are side-by-side stars with no edge. The grader does not enforce the adjacency rule, and a student who does follow it gets no hint. (S2 Q3 `wrong-start`)
- Q1/Q2 fine apart from the unstated `["(0,0)","(1,1)"]` output format.

#### Step 3
- **[MINOR] Q3 `[[1,1,1]]`: "Use this node rule: Only star cells in rows containing at least two stars."** The only row has three stars, so the rule gives the identical graph; NO is keyed. (S3 Q3)
- **[MINOR] "× Right. A multi-step route through (0,1)…"** after a wrong answer (Q1 variant 2, Q5). (S3)
- Degree claims verified: (1,2)=3, (1,1)=4, (1,0)=3, (0,1)=2, (2,2)=1. Fine.

#### Step 4
- **[MAJOR] Slug "four-direction-constellations" shown as the Reachable boundary** in cases 2 and 3. (S4 cases 2, 3)
- **[MINOR] Cases 1 and 3 are the same idea** (a pure diagonal chain), case 2 is Step 1 Q2's input, and all three use the same diagnosis sentence. (S4)
- Buggy outputs verified (3, 2, 2); real outputs 1, 1, 1 correct; labels `(0,0)` match the guide. Fine.

### Counting Docked Boats (`counting-docked-boats`, variant)

#### Step 1
- **[MINOR] Two input notations, one never explained.** Builds Q1/Q3/Q6/Q8, all remedials and all Step 3 inputs use string rows (`marina=["B...B",".....",...]`), while the Description, Q4/Q5/Q7/Q9 and every Step 4 case use arrays of characters (`[[".","B",...]]`). The string form is never defined; a literal student may not know "B...B" means five squares. (Q1 `case-1` etc.)
- **[MINOR] Q5 raw-input box contains "Focus on one listed relation."** after the marina, as if it were input. (Q5 `concept-edge`)
- Build keys (3, 2, 2, 1), concept keys (Q7 → 2, Q9 → 2) and remedial keys (1, 2, 2, 0, 2) verified.

#### Step 2
- **[MAJOR] Q1 (`wrong-start`): hidden requirement to draw "(0,1)".** Bug text: "Katelyn runs the search from a different first boat cell." A valid graph without (0,1) is rejected with "Also draw (0,1), the wrong first boat cell used by the broken search." (harness probe) — the first time the cell is named. Worse, (0,1) is side-adjacent to (0,0): a student who starts at (0,0) and obeys the boat rule (touching B squares are one boat) cannot expose the bug at all; they must pick a start not touching (0,1), which nothing suggests.
- Q2 (`shallow-search`) / Q3 (`drop-last-edge`): only systemic issues.

#### Step 3
- **[MINOR] Q1 v2 claim rests on a false premise.** "(0,0) can reach (2,2), so the graph should contain a direct edge between them." keyed NO — correct, but (0,0) cannot reach (2,2) at all (two isolated boats). A student answering No because "they aren't reachable" gets feedback about a different idea ("Reachability never creates a direct edge…"). (Q1)
- Other claims verified.

#### Step 4
- **[MINOR] Choices and feedback refer to a `seen` set; the code uses `visited`.** Case 1: "The code forgets seen and counts each boat square separately…" / "The seen set correctly keeps this component together."; case 2: "The seen set correctly groups the three squares…"; case 3: "Seen prevents repeats…". No `seen` in the shown code. (cases 1–3)
- **[MINOR] Grammar:** case 2 feedback "all two links are vertical side links."
- **[MINOR] Case 3's correct choice restates the answer.** "The code counts the top-border singleton but misses the second boat whose right-border square is reached after its interior start." vs two short generic distractors — identifiable by length/specificity. (case `one-counted-one-missed`)
- Buggy outputs 0 / 0 / 1 and correct 1 / 1 / 2 verified. Hidden "(r,c)" labels match Step 1.

#### Cross-step / other
- Nothing further.

### Detour for Coffee (`routes-past-the-coffee-cart`, variant)

#### Step 1
- **[MAJOR] Two vocabularies for the same input.** Description and concept questions use `graph = …, checkpoint = 3`; the four builds and every remedial use `roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=1` — `roads`, `start`, `customer`, `coffeeCart` appear nowhere in the problem statement. Fix: use `graph`/`checkpoint` everywhere.
- **[MAJOR] Q9 contradicts Step 2's rule.** Q9 `roads=[[]], start=0, customer=0, coffeeCart=0` is keyed 1 route, but Step 2's grader rejects graphs with "The coffee cart must be an interior intersection, not node 0 or the last node." A student who learned Q9 (cart may be node 0) is then told the opposite. Also debatable on its own: a zero-street "route" that "passes" a cart you never move to. (Q9 `case-4`)
- **[MINOR] Q7 and Q8 stems give the answer.** Q7: "The picture has three depot-to-customer routes; two pass intersection 3…" → only choice C has exactly two complete routes. Q8: "…the only customer route skips 2. What route list is returned?" → `[]` follows from the sentence. (Q7 `concept-output`, Q8 `concept-counterexample`)
- **[MINOR] Grammar in concept-edge remedial feedback:** "0 complete routes reaches the customer after visiting checkpoint 1."

#### Step 2
- **[MAJOR] Hidden acceptance rule never shown.** Only after Check: "The coffee cart must be an interior intersection, not node 0 or the last node." "Last node" is undefined on this screen (the student is never told the customer is the highest-numbered node here). Fix: put this rule in the prompt.
- **[MAJOR] A different reachable set is not enough, and the student isn't told.** The harness's minimal graphs with different correct/buggy sets were rejected: Q2 `{"exposes":false,"correct":"[0,1,2,3]","buggy":"[0,1]"}`, Q3 `{"exposes":false,"correct":"[0,1,2],"buggy":"[0,1]"}`. The unshown authored goals require the buggy search to miss the amber cart. The screen says only "Expose Melanie's mistake." Fix: state "Melanie's search must fail to reach the coffee cart."
- **[MAJOR] "CORRECT OUTPUT" wants a flat reached set `[0,1,2,3]`,** while every Step 1 output was a list of routes like `[[0,1,3,5],[0,2,3,5]]`. Direct conflict for this problem; the student will type routes.
- **[MINOR] Q3 "Alex visits only the start and its direct neighboring choices."** — "neighboring choices" is odd; say "direct neighbors".

#### Step 3
- **[MINOR] Markdown backticks leak.** Feedback prints "Every intersection / 0 / through / n−1 / , including the depot…" on separate lines, and the membership claim shows literal backticks: "Only intersection 0, the checkpoint, and intersection `n−1`." (Q1 all variants, Q2, Q5)
- Claims and keys otherwise correct; degree claims correctly say "outgoing".

#### Step 4
- **[MAJOR] Shown input and shown code disagree in cases 2 and 3.** Input: `roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=2`; code reads `input.graph.length` and `input.checkpoint`. Run literally it throws "Cannot read properties of undefined (reading 'length')", not `[]`. Case 1 correctly shows `graph:` / `checkpoint:`. Fix: show `graph`/`checkpoint` in cases 2 and 3. (case 2 `case-1`, case 3 `case-2`)
- **[MAJOR] Same bug ×3 with the same two distractors** ("The checkpoint flag is shared globally…", "The target is computed as the wrong graph index…"); case 2 is Step 1 Q1's graph with the cart moved.
- Buggy outputs `[]`, `[]`, `[]` verified; hidden labels `0`–`4` match the taught format.

#### Cross-step / other
- Title "Detour for Coffee" vs id "routes-past-the-coffee-cart" — fine. Cart-at-node-0 rule conflicts between Step 1 Q9 and Step 2 (above).

---

### Dig New Wells (`villages-without-wells`, variant)

#### Step 1
- **[MAJOR] Builds are answerable by "pick the smaller number" and mostly have answer 0.** Q1 `3 | 0` → 0; Q2 `0 | 3` → 0; Q5 `4 | 2` → 2; Q8 `0 | 1` → 0; remedials `4 | 0` → 0, `1 | 3` → 1, `1 | 3` → 1, `4 | 0` → 0; only the edge-rule remedial (`0 | 3` → 3) breaks it. The distractor is always "count villages without wells" (a bigger number). Fix: add smaller-than-answer distractors (e.g. "0 because wells is non-empty", "forgot the isolated village"). (case-1 … case-4, remedials)
- **[MAJOR] Q1 and Q2 are the same test.** Both inputs (`n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]` and `n=4, roads=[[0,1],[1,2],[2,3]], wells=[3]`) have every cluster already supplied, answer 0, same distractor type. Q2's facet is "village identity" but there is no isolated village to identify. Q8 (`n=1, roads=[], wells=[0]`) is a third 0. Fix: make Q2 include an isolated village (e.g. n=5 with the same roads → 1). (case-2)
- **[MINOR] Vocabulary drifts.** Description: `paths`, "cluster"; builds: `roads=`; concept questions: `paths =`; success text: "Exactly 0 road components have no existing well." ("road components" is never defined). Title "Dig New Wells" vs Step 4 function `solve(input)` vs promised `countWellsToDig(n, paths, wells)`.
- **[MINOR] Q7 and Q9 do the graph work for the student.** "The map has clusters {0,1}, {2,3,4}, and {5,6}. Wells are at 4 and 6." / "Villages {0,1,2} form one cycle and {3,4} form another cluster." — the questions hand over the components, so only counting is tested.
- **[MINOR] Q6 raw-input box contains an instruction line** "Focus on one listed relation." after the input, inside the code box, so it looks like data. (concept-edge)

#### Step 2
- **[MAJOR] Jaden's bug text does not describe what the grader wants drawn.** Shown: "Jaden erases the outer leaves before searching." The simulation (`skip-leaf-edges`) deletes every EDGE that touches a degree-1 node but KEEPS the nodes: for the harness graph 0—1—2 (start 0) "Jaden's graph must be exactly: nodes 0, 1, 2 · edges: none". A student who literally erases the leaf villages 0 and 2 fails Drawing 2 with no explanation; and the "erased" leaf 0 is still the start and outputs `[0]`. The phrasing is fixed for this problem (`problemIndex % 3`). Fix: use the accurate variant "drops every connection touching a degree-one node". (Q1)
- **[MINOR] "Correct output" is a village list after nine "How many new wells" questions.** Here the reached set (villages served by the chosen well) is at least meaningful, but the box gives no hint that a list, not a count, is wanted. (Q1–Q3)
- **[MINOR] "CHOOSE THE VILLAGE WITH A WELL"** — the problem has a `wells` list, but only one well can be chosen here; Autumn's wrong well "1" appears only in Drawing 2's title. (Q2)
- **[MINOR] Carson: "chooses the final listed route and never returns."** "listed" means drawing order; the goal text adds "Edge numbers show drawing order." but the harness recorded the order numbers as not visible on that screen. Verify they appear as soon as an edge is drawn. (Q3)

#### Step 3
- **[MAJOR] Q2 claim has a false premise.** Input `n=3, roads=[], wells=[]` (no edges); claim: "0 can reach 1, so the graph should contain a direct edge between them." 0 cannot reach 1 at all. Keyed NO with feedback "Reachability never creates a direct edge. This input lists no direct relation between 0 and 1." — the student is right to say No but for a reason the feedback does not acknowledge, and a literal reader is left wondering whether the site thinks 0 can reach 1. Fix: on edgeless inputs generate "0 and 1 are directly connected" (No) instead. (Q2)
- **[MAJOR] Membership polarity flips.** Q1/Q2/Q4/Q5: "Use this node rule for the graph: “…”" → NO; Q3: "It would be a mistake to use this node rule: “Only villages not already listed in `wells`.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."** Q3 direct-vs-reach: "Correct. The mini-example lists 2—3 as one direct edge."
- **[MINOR] Q4 and Q5 use the identical claim** "The correct graph has 1—0 and 0—2, so it should also contain a direct 1—2 edge." (and both write 1—0 although the input lists [0,1]).
- **[MINOR] Backtick code spans in feedback captured as separate lines:** "Every village / 0 / through / n−1 / , even a village with no footpaths." Verify `<code>` renders inline inside the feedback list; if it wraps, the sentence is unreadable. (Q1)

#### Step 4
- **[MAJOR] Cases 2–3 show `roads=` but the code reads `input.paths`.** Input: "n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]"; code: `for (const [firstValue, secondValue] of input.paths)`. Case 1 correctly shows `paths:`. Also the function is `solve(input)` although the Description promised `countWellsToDig(n, paths, wells)`. A literal student cannot connect the input to the code. (case-1, case-2)
- **[MAJOR] All three cases are the same case.** Same bug ("Checks a well only at the component start"), same code, buggy `1` / correct `0` every time, identical distractors; cases 2–3 reuse Step 1 Q1/Q2 inputs whose answer (0) was shown. (case-1, case-2)
- **[MINOR] Distractor "The loop skips villages that have no path entry…"** cannot apply to any of the three inputs (no isolated village anywhere), so it is never a believable mistake here; and distractor "The graph stores each footpath in only one direction" is refuted by two adjacent `push` lines the student can see.
- **[MINOR] Input formatting differs:** case 1 `n: 3 / paths: … / wells: [2]` vs cases 2–3 `n=5, roads=…`.

#### Cross-step / other
- `paths` vs `roads` vs `input.paths` naming runs through Steps 1, 3 and 4 (see above).

---

### Gas Pocket Survey (`gas-pocket-survey`, variant)

#### Step 1
- All keys are correct.
- **[MINOR] Q8 repeats Q1 in a second notation.** Q1 `cave=["UG","GU"], drill=(0,0)` → "2"; Q8 `cave=[["U","G"],["G","U"]], row=0, col=0` → "2". Two input notations (`["UG"]`/`drill=` vs `[["U","G"]]`/`row=, col=`) are used without explanation; Step 4 mixes them again. (S1 Q1, Q8)
- **[MINOR] Q9 answers itself.** "In the larger cave picture, cell (0,2) touches gas only diagonally. What label does the reveal place there?" — the sentence already says the gas is diagonal, and "the larger cave picture" refers to a drawing the student may not have made (drawing is optional). (S1 Q9)
- **[MINOR] Q2 is a drawing marathon for a two-neighbour question.** `cave=["UUU","UGU","UUU"]` requires 9 exact nodes and 12 exact edges while the decision only depends on (0,1) and (1,0). (S1 Q2)
- P1 applies (Picture D lists three names). (S1 Q3)

#### Step 2
- **[MINOR] No gas exists in Step 2**, so "drill square" reach set ≠ the reveal, and "CORRECT OUTPUT" is `["(0,0)","(0,1)","(0,2)"]` where the problem returns a grid. (S2 Q1–Q3)
- P4 applies to Dominic. (S2 Q3)

#### Step 3
- **[MINOR] Wrong rule gives the right graph.** Q4 `cave=["G"]`: "Use this node rule for the graph: “Only gas cells, because the task is a gas survey.”" keyed NO, but the only cell is gas, so the rule yields the required graph. (S3 Q4)
- **[MINOR] Feedback renders `(row,column)` on its own line** ("Correct node rule: Each cave cell at its own / (row,column) / position."). (S3 Q1)

#### Step 4
- **[MAJOR] Input notation ≠ required output notation.** Cases 2 and 3 show `cave=["UUU","UUG"], drill=(0,1)` (rows as strings, `drill=`), but the code reads `input.row`/`input.col` and the graded answer must be `[["U","1","U"],["U","U","G"]]` (nested arrays of quoted letters). A student who mirrors the shown input and types `["U1U","UUG"]` is rejected with no explanation. Case 1 shows the nested-array form. Fix: show cases 2/3 as `cave: [["U","U","U"],["U","U","G"]] / row: 0 / col: 1`. (S4 cases 2–3)
- **[MINOR] Misconception title wrong for case 3.** "A diagonal gas pocket stops the reveal" — in `["GGU","UUU"], drill=(1,1)` the reveal stops in both versions; the bug changes the digit from 1 to 2. (S4 case 3)
- **[MAJOR] P2: same bug and same two distractors** ("spreads diagonally…", "edits the original cave in place…") in all three cases; the second distractor is refuted by the code's second line (`input.cave.map((row) => [...row])`). (S4 cases 2–3)
- P3 applies. Buggy outputs verified with node.

#### Cross-step / other
- Statement names `surveyCave(cave, row, col)`; Step 4 shows `solve(input)`.

### Gold and Silver Lights (`gold-and-silver-lights`, variant)

#### Step 1
- **[BLOCKER] Q9 answer key is wrong.** Raw input `n=6, wires=[[0,1],[1,2],[1,4],[0,3],[3,5]], goldStart=0`, question "Using even distance from bulb 0, how many bulbs are gold?". Distances: 0→0, 1→1, 3→1, 2→2, 4→2, 5→2. Even-distance (gold) bulbs are 0, 2, 4 **and 5** → **4**. The key marks `3` correct ("Correct: bulbs 0, 2, and 4 have even distance.") and tells a student who answers 4: "This marks bulb 5 gold after resetting distance on the second branch." — but bulb 5 really is two wires from bulb 0 (0—3—5) and really is gold. Verified with node. Source: `scripts/build-variant-lessons-v3.js` line 140. Fix: change the wires so 5 is at odd distance (e.g. `[[0,1],[1,2],[1,4],[0,3],[4,5]]` gives gold {0,2,4} = 3) and regenerate, or change the key to 4. (S1 Q9 / `concept-counterexample`)
- **[MINOR] Builds ask an unexplained question.** All four builds and all five remedials ask "How many bulbs are an even number of wires from bulb 0?", but the lesson first states that even distance = gold only in Q7. Every one of these nine builds has the same single trick (does distance 0 count as "an even number of wires"?) with the same distractor. (S1 Q1, Q3, Q6, Q8, remedials)
- **[MINOR] `goldStart=0` is not a parameter of the problem.** It appears in builds and Step 4 cases 2–3, is absent from Q4/Q5 and Step 4 case 1, and the Description says bulb 0 is always gold. (S1, S4)
- **[MINOR] Remedial for `concept-counterexample` is Q6's input** (`n=5` star). (S1 remedial)
- P1 applies (Picture D lists four names). (S1 Q2)

#### Step 2
- **[MAJOR] Josiah round needs a hidden drawing trick.** Start is read-only "0" under "CHOOSE THE FIRST GOLD BULB". Hidden goal: "Orient a listed wire toward the gold bulb so a fake arrow blocks coloring." — the student must click the far bulb first on every wire so Josiah's arrow points into 0 (harness drew `1—0`). Drawing `0—1` by clicking 0 first gives Josiah reach `[0,1]` = correct reach and no counterexample; nothing on screen explains this. (S2 Q1 `make-one-way`)
- **[MINOR] "CORRECT OUTPUT" is `[0,1]`** for a problem whose output is a count. (S2 all)
- P4 applies to Kyle. (S2 Q3)

#### Step 3
- All claims correctly keyed.
- **[MINOR] Feedback renders `0` and `n−1` on their own lines** ("Correct node rule: Each bulb / 0 / through / n−1 / , before choosing its gold or silver color."). (S3 Q1)

#### Step 4
- **[MAJOR] Unfinished text shown to the student.** Case 2 graph proof: "→ Reachable boundary: root-silver →" — an internal token, shown both after a wrong diagnosis and in the success text. The same chain's "Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 1—3, 3—4." spells out the exact required graph. Fix: write a real sentence (e.g. "Bulb 0 is coloured silver, so the two colour classes swap.") and drop the node/edge list. (S4 case 2)
- **[MAJOR] P2: same bug, identical three sentences in all three cases**; case 3 (5-leaf star → 5) is case 1 (4-leaf star → 4) with one more leaf. (S4 cases 2–3)
- **[MINOR] Input notation differs between cases.** Case 1 "n: 5 / wires: [[0, 1], …]"; cases 2–3 "n=5, wires=[[0,1],…], goldStart=0" while the code reads `input.n`/`input.wires` and ignores `goldStart`. (S4)
- P3 applies. Buggy outputs 4 / 2 / 5 verified with node; correct 1 / 3 / 1 verified.

#### Cross-step / other
- None beyond the above.

### Gold in the Locked Dungeon (`dungeon-gold-run`, variant)

#### Step 1
- **[MINOR] Q7 and Q8 give the answer inside the question.** Q7: "From room 0, rooms 0,1,2,3 are reachable with gold 5,10,1,8; rooms 4 and 5 are locked away with 50 each. What total is collected?" — the student only has to add 5+10+1+8; the `rooms` list is irrelevant. Q8: "Room 0 has 7 gold and only a key back to room 0. Rooms 1 and 2 are unreachable. What total is collected?" — same. Ask from the raw input alone. (Q7 `concept-output`, Q8 `concept-counterexample`)
- **[MINOR] Q5 raw-input box contains "Focus on one listed relation."** (Q5 `concept-edge`)
- Build keys (15, 20, 45, 1) and remedial keys (22, 30, 6, 20, 33) verified.

#### Step 2
- **[MAJOR] Q2 (`wrong-start`): hidden requirement to draw room "1".** Bug text: "Miguel ignores the chosen starting room and uses a different one." The grader requires node 1 ("Also draw 1, the wrong starting room used by the broken search.") and the room number is otherwise shown only in Drawing 2's title. The heading "CHOOSE THE STARTING ROOM" sits over a readonly "0", and the story says only room 0 is unlocked, so "Miguel starts in room 1" needs to be stated explicitly.
- **[MINOR] Q1 (`make-two-way`) needs Drawing 2 to be undirected.** "Haley walks backward across arrows that only point forward." suggests the arrows stay; the grader requires Haley's graph as UNDIRECTED (`1—0`), i.e. the student must switch "Directed edges" off for Drawing 2. Not stated.
- Concrete instance of the known label issue: Step 1 names "0:1g" are rejected with "Use numeric IDs 0, 1, 2, ... with no gaps."

#### Step 3
- **[MINOR] Membership claims about zero-gold / unreachable rooms on inputs that have none.** Q1 v2 and Q4 use "Only rooms holding at least one piece of gold." but every room in `gold=[3,6,9,12,15]` / `[1,2,3,4,5]` has gold; Q2 (`rooms=[[1,2],[4],[4],[],[]]`) and Q5 (`[[3,1],[2],[3],[]]`) use "Only rooms already known to be reachable from room 0." but every room there is reachable. For the shown input the wrong rule gives the same graph. (Q1, Q2, Q4, Q5)
- Degree and direct-vs-reach claims verified.

#### Step 4
- **[BLOCKER] Case 1 requires hidden labels "0", "1", "2" while cases 2 and 3 require "0:1g"-style labels.** No guide in Step 4; the taught format is `roomIndex:goldAmountg`. Writing "0:5g", "1:3g", "2:10g" in case 1 fails with only "The drawing has every exact node ×"; writing "0","1","2" in case 2 then fails again. (case `authored-deep-case` vs `case-1`, `case-2`)
- **[MAJOR] The shown code reads a field that does not exist and never touches `rooms`.** `for (const key of input.startKeys || [0])` — `startKeys` is not part of the problem input, so the code relies on the JS idiom "undefined || [0]" to mean "just room 0". A struggling student cannot know what `input.startKeys` is or that it is undefined; the case title "Uses only the starting keyring" uses a word ("keyring") the problem never defines; the feedback itself admits "The code never reads rooms at all". Replace with a solution that reads `rooms` but never enqueues the keys it finds. (cases 1–3)
- **[MAJOR] Internal slug displayed as the "Reachable boundary" in cases 2 and 3:** "→ Reachable boundary: ignore-found-keys →". (cases `case-1`, `case-2`)
- **[MINOR] Correct choice says "worklist"** ("never adds that room's newly found keys to the worklist") — no worklist exists in the code.
- Buggy outputs 5 / 1 / 2 and correct 18 / 15 / 20 verified.

#### Cross-step / other
- Case 1 input shown as `rooms: [[1], [2], []]` / `gold: [5, 3, 10]`; cases 2/3 use Step 1's `rooms=[...], gold=[...]`.

### Hiking Around the Flood (`flooded-campsite-trails`, variant)

#### Step 1
- All keys are correct.
- **[MINOR] Odd-one-out answer sets.** Q7 offers "false — DFS first reaches flooded campsite 4", "false — one flooded campsite invalidates the whole map", "false — campsite 5 touches a route through flooded 4", "true — use 0→1→2→5": three `false` and one `true`, so a student who computes `true` has nothing to decide, and the correct letter is the odd one out. Q9 is the mirror (three "true —", one "false —") and its answer is quoted verbatim in the Description: "If start or finish is itself flooded, return false." (S1 Q7, Q9)
- **[MINOR] "Fresh proof · Read one direct relation" has no relations.** The remedial for the edge-rule concept is `n=3, trails=[], flooded=[], start=0, finish=2`. (S1 remedial `concept-edge`)
- P1 applies (Picture D lists three names). (S1 Q3)

#### Step 2
- **[MAJOR] Step 2 never touches flooding.** There is no way to mark a campsite flooded, so all three rounds (wrong start, one-way, first-branch) test generic reachability, and "CORRECT OUTPUT" is a list like `[0,1,2,3]` although the problem returns `true`/`false`. (S2 Q1–Q3)
- **[MAJOR] Alejandro round depends on click order and a hidden goal.** Hidden authored goal: "Write a trail in reverse order so treating it as an arrow blocks the dry route." The harness had to draw `1—0` (far node first) so Alejandro's arrow is `1→0`; drawing `0—1` by clicking 0 first makes Alejandro's reach `[0,1]` = correct reach, no counterexample, and nothing on screen says so. (S2 Q2 `make-one-way`)
- **[MINOR] Hidden wrong start "1".** If the student chooses 1 as the start, Stephanie's search equals the correct one. (S2 Q1)
- P4 applies to Nicole (character graph must equal the correct graph). (S2 Q3)

#### Step 3
- **[MAJOR] Reachability claims walk through flooded campsites.** Q2 `trails=[[0,1],[1,2],[2,3]], flooded=[1]`: "2 can reach 0 through 1, but the graph still has no direct 2—0 edge." keyed YES; Q1 variant 2 (`flooded=[1]`): "1 can reach 3 through 4, but the graph still has no direct 1—3 edge." keyed YES although 1 itself is flooded. Step 1's own edge rule says "traversal may use it only when the next campsite is dry", so a student applying the lesson answers NO and is marked wrong. Fix: generate reach claims only along dry nodes, or word them "ignoring flooding, …". (S3 Q1, Q2)
- **[MINOR] Degree counts include flooded neighbours without saying so.** Q1 "0 has exactly 1 direct neighbor." → feedback "0 has 2 direct neighbors." (one of them flooded 1). (S3 Q1)
- **[MINOR] Feedback renders backticks as line breaks.** Shown text: "Correct node rule: Every campsite / 0 / through / n−1 / , with flooded status marked on the affected nodes." (each on its own line). Same in gas-pocket ("(row,column)" on its own line) and gold-and-silver ("0", "n−1"). (S3 Q1)

#### Step 4
- **[MAJOR] P2: "Accepts a flooded destination" in all three cases**; the correct sentence always says the finish check runs before the flooded check. (S4 cases 2–3)
- **[MINOR] Choice and feedback name a variable that does not exist.** Case 3: "The cycle makes recursion loop forever because nodes are never marked seen." / "Safe nodes enter seen before their neighbors are explored" — the code's set is `visited`. (S4 case 3)
- P3 applies. Buggy `true` for cases 2 and 3 verified with node; correct `false` (finish is flooded) matches the statement.

#### Cross-step / other
- Step 4 code is `solve(input)` reading `input.n`, `input.trails`; the statement never names a function or an `input` object.

### Longest Freight Train (`longest-freight-train`, variant)

#### Step 1
- **[MINOR] Q7's raw-input box contains a stray instruction line "Focus on one listed relation." under the grid.** Also distractor A "Their T cells touch at a side or a diagonal corner." is harmless for every valid yard (the Description guarantees trains never touch "not even at a corner"), so a thoughtful student can argue it gives the same answer; the feedback "Corner contact does not join cars in this yard." does not address that.
- **[MINOR] The concept-counterexample remedial reuses Q1's input `["T..","...","..T"]`** (already drawn in Q1, and used again as Step 3 Q4).
- Builds verified: 1, 3, 2, 1; remedials 3, 1, 3, 3, 1. Q8/Q9 verified 3/3.

#### Step 2
- **[MINOR] "CHOOSE THE FIRST TRAIN CAR" has no meaning in this problem** (the real algorithm starts a search from every car), and Devin's wrong car (0,1) is revealed only by the error "Also draw (0,1), the wrong first train car used by the broken search." or Drawing 2's title. The grader also accepted a "correct graph" with side-adjacent T cells (0,0) and (0,1) and no edge between them — an impossible yard — so nothing checks the student's drawing is a legal input.

#### Step 3
- **[MINOR] Q1 and Q4 relation claim asserts a false premise.** `["T.","..",".T"]` / `["T..","...","..T"]` show "(0,0) can reach (2,1), so the graph should contain a direct edge between them." / "(0,0) can reach (2,2), so…" — the cells are isolated and cannot reach each other (NO is keyed, but the sentence is false). Q1 variant 2 already has the good wording "There is no direct edge between (0,0) and (2,1); merely naming both nodes does not make them reachable."
- **[MINOR] Node-rule feedback renders broken.** Shown text (Q1, after wrong answers): "Correct node rule: Each grid cell containing / T / ; empty / . / cells are not nodes." — the backticks in the authored rule are rendered as separate lines. Also Q1 v2 wrong-feedback begins "Correct. Node membership alone…" under ×.

#### Step 4
- **[MAJOR] Case 3's input breaks the problem's own guarantee.** `yard: [["T","T",".",".","."],[".",".",".",".","."],[".","T","T","T","."],[".","T",".",".","."]]` — the lower cells (2,1),(2,2),(2,3) and (3,1) form an L, but the Description says every train "is a straight line … horizontally or vertically … always exactly one square wide" and "You are guaranteed the yard is valid". The keyed correct answer relies on an L-shaped "four-car component" (correct output 4; choice C "the later four-car component"). A student who trusts the statement sees two touching trains, which the statement says cannot happen, and may answer 3. Replace with a straight 4-car train (e.g. row 2 = `.TTTT`).
- **[MINOR] Case 2 shows an internal slug as feedback:** "Reachable boundary: first-component-only". Case 2's input is Step 1 Q4 again; all three cases show the identical function.
- **[MINOR] Input formats disagree.** Cases 1 and 3 use arrays of arrays (`yard: [["T", ".", "T", "T"]]`), case 2 uses strings (`yard=["T...T","....T","....."]`), Step 1/3 always use strings, the Description examples use arrays, and the code is `function solve(input)` with `input.yard` instead of `longestTrain(yard)`.

#### Cross-step / other
- Node-label format consistent across steps.

### No Transfers, Please (`one-color-metro-ride`, variant)

#### Step 1
- **[MAJOR] Q2 `match-picture` captions give away the answer.** Choices are literally labelled "Picture A · correct colors, but arrows", "Picture C · four stations, but every track blue", "Picture D · omit station 3 and its last track", "Picture B · four stations and three two-way tracks". The student picks B by reading the captions, never looking at the pictures. Fix: caption pictures neutrally ("Picture A", …). (Q9's captions also describe each picture, but there the student still has to reason about which one exposes the bug — acceptable.)
- **[MAJOR] Hidden requirement: edges must be coloured red/blue.** The only guide shown is the node-name format. The hidden graph for every build carries `[red]`/`[blue]` on each edge, and the checklist item "Edge colors match the input" only appears after a failed check (S3/S4 transcripts). Nothing before the first failure tells the student to use the "Color" button, or which palette entries count as "red" and "blue". Fix: add "Colour each track red or blue with the Color button" to the guide.
- **[MINOR] Q7 has two "true" choices and asks "what should the function return".** C "true, because the mixed route 0—2—4—3—5 reaches 5" and D "true, because 0—1—3—5 is entirely red" both return true; only the justification differs. A student who reads the question literally has a coin flip. Fix: ask "Which reasoning is correct?" (as path-sum does).
- **[MINOR] Q4/Q7/Q9 raw-input box shows only `source = 0, destination = 2`** under "Optional: draw this input before answering" — there is nothing to draw (the picture is separate).
- All build keys and remedial keys verified (Q1 true, Q3 false, Q6 true, Q8 true; remedials false/false/true/true/false).

#### Step 2
- **[MAJOR] What "CORRECT OUTPUT" means here is undiscoverable.** The real function returns true/false and needs a destination; Step 2 has no destination field and expects the *union of stations reachable by an all-red trip or an all-blue trip* from the source (e.g. `[0,1]` for 0—1 red, 1—2 blue). Nothing on screen defines this. Fix: label the field "Stations reachable without a transfer".
- **[MAJOR] Q2 Eva's graph must have edges coloured exactly `slate`.** Grader expects "edges: 0—1 [slate], 1—2 [slate]". The bug text says "Eva erases track colors" but never says which palette colour means "no colour". If Drawing 2 starts as a copy of Drawing 1 the student must recolour every edge to the right neutral swatch. Fix: say "give Eva's tracks the default grey (slate) colour", or accept any non-red/blue colour.
- **[MAJOR] Q1 Joel: student must know to draw a blue edge.** Joel's graph = correct graph minus blue edges; a red-only drawing produces identical outputs and fails with no explanation. The authored goal "Give the rider a complete blue route and no complete red route" is hidden. Fix: show the goal line.
- Q3 first-branch semantics depend on drawing order (systemic).

#### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1 "3 and 1 are directly connected…" → wrong-answer feedback "Correct. The mini-example lists 3—1 as one direct edge."; Q4 → "Right. A multi-step route…".
- **[MINOR] Membership distractor "One red copy and one blue copy of every station" is a legitimate model** (layered graph) and the feedback rejects it with jargon: "That duplicates one real station. Color is an edge property in the committed model." A student who has seen the two-layer approach will answer Yes and be told they're wrong without a reason they can follow. Fix: "This lesson's model keeps one node per station and puts the colour on the track."
- **[MINOR] Step 3's "correct node rule" wording differs from Step 1's**: S3 says "One node for each station number, including stations with no track"; Step 1 rules say "Every station 0 through n−1, even if it has no track." Step 1 has no node-rule concept question at all, so the three wrong rules quoted in S3 are the first time the student sees them.
- Keys verified (Q2 "2 has exactly 4" NO — it has 3; Q3 "1 has exactly 1" NO — it has 2; etc.).

#### Step 4
- **[MAJOR] (P2)** Case 2 success/feedback text: "→ Reachable boundary: ignore-track-colors →".
- **[MINOR] Case 1 is the Description's Example 2 verbatim** (`n=3, tracks=[[0,1],[1,2]], colors=["red","blue"], 0→2` → false); case 2 is Step 1 Q3; case 3 is the match-picture remedial and S3 Q4. Correct outputs are all already known; only the buggy `true` is new — and it is `true` in all three cases.
- **[MINOR] Distractor feedback says "The source enters seen immediately"** — the code uses `visited`, not `seen`.
- **[MINOR] Input format differs between cases** (case 1 `n: 3` / `tracks: […]` lines; cases 2–3 `n = 4` / `tracks = […]`).
- Buggy true ×3 and correct false ×3 verified. Edge colours are graded here too ("✓ Edge colors match the input") with no guide.

#### Cross-step / other
- Fine otherwise.

---

### Office Rumor (`office-rumor-reach`, variant)

#### Step 1
- **[MINOR] Q9 build choices are `1 | 2` for `n=1, friendships=[], start=0`.** With one employee no mistake yields 2, so the "decision" is a giveaway. Same for the `concept-counterexample` remedial (`n=5` star, choices `6 | 5` — nothing yields 6). Fix: use inputs where the bug value is possible.
- **[MINOR] Q8 question omits "Including the starter".** Q1/Q4/Q6/Q9/Q7 all say "Including employee 0 / the starter, how many…"; Q8 just says "How many employees hear the rumor?" for start=6. A student who reads the change as meaningful may answer 1. Fix: consistent wording.
- **[MINOR] `concept-edge` remedial ("Fresh proof · Read one direct relation") has no relations**: `n=3, friendships=[], start=0`. It cannot exercise the two-way-edge idea the student just got wrong. Fix: e.g. `friendships=[[2,0]], start=0`.
- **[MINOR] Q5 raw-input box contains an instruction line**: "Focus on one listed relation." appears inside the code box after the input.
- Q1 differs from Description Example 1 only by n=5 vs 6 (same answer 3). All keys verified.

#### Step 2
- **[MINOR] Q2 "Naomi keeps the middle of the graph but disconnects every leaf."** "Leaf" is never defined for this problem (an employee with exactly one friend). With the natural 3-node chain, *both* ends are leaves so Naomi's graph has no edges at all — "keeps the middle" then keeps nothing. Fix: "Naomi deletes every friendship of anyone who has only one friend."
- Q3 hidden wrong start `1` (systemic). Step 1 labels accepted.

#### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1, Q3, Q4: wrong-answer feedback "Correct. The mini-example lists 0—1 as one direct edge." / "Right. A multi-step route…".
- **[MINOR] Q5 claim asserts a false premise**: for `friendships=[]`, "0 can reach 1, so the graph should contain a direct edge between them." 0 cannot reach 1. Keyed NO is still right, but a literal student is stuck on the first half. Fix: "If 0 could reach 1, would that require a direct edge?" or pick a connected input.
- **[MINOR] Edge order reversed vs input** in Q2: "The correct graph has 4—0 and 0—1…" for input `[0,4]`.
- **[MINOR]** Code-span line-break rendering ("Each employee / 0 / through / n−1 / , including…") in Q1 feedback.
- Keys for all 5 questions verified.

#### Step 4
- Buggy outputs 1 / 2 / 1 and correct 3 / 5 / 6 verified by running the code. Diagnosis keys correct; hidden labels are bare numbers matching Step 1.
- **[MINOR] Same three distractor ideas (counts-start / shallow / missing-reverse) in all three cases**; after case 1 the answer is recognisable by shape.

#### Cross-step / other
- Fine otherwise.

---

### Package to the Outpost (`package-to-the-outpost`, variant)

#### Step 1
- **[MAJOR] Q4 feedback contradicts the problem statement.** Distractor D "Only warehouses on the first route found from headquarters to the outpost." → displayed feedback: "A later route may be faster, so every warehouse in the road network must remain available." The Description says "between any two warehouses there is exactly **one** possible route." There is never a later/faster route. The same sentence is shown in Step 3 (Q1 variant 2, Q4 membership feedback). Fix: "Even though there is only one route, you don't know which warehouses are on it until you search, so every warehouse must be a node."
- **[MINOR] Q4 distractor C feedback uses Dijkstra language**: "The algorithm stores the best time as state for one warehouse node" — there is no "best time" in a tree with one route. Also repeated in S3 Q1 variant 1, Q2, Q5.
- **[MINOR] Q6 distractor C feedback**: "A route with more roads can still be faster." — again implies multiple routes.
- **[MAJOR] Hidden requirement: every edge must carry its hours as a label, format unknown.** Hidden graphs require `0—1 (weight/label "4")`. The only guide shown is the node-name format; "Edge labels or weights match the input" appears only in the after-failure checklist (S3/S4). Nothing says whether to type `4`, `4h`, or `4 hours`, or how (the toolbar shows Edge width / Rename / Color). Fix: guide line "Label each road with just its hours number, e.g. 4".
- **[MINOR] Q1 and Q2 are the Description's Example 1 and Example 2 verbatim** (answers 9 and 6 printed on the Description tab). They are reused again as Step 4 cases 2 and 3.
- All build/remedial keys verified (9, 6, 5, 0; remedials 13, 4, 9, 11, 6).

#### Step 2
- **[MAJOR] Q2 Bella (make-one-way): the student must draw the edge "backwards".** Bella's arrow goes from the first-clicked node to the second; with start 0 the only way to expose her is to click the *other* node first (harness drew `1—0`). The authored goal "List a road toward HQ so treating it as one-way blocks the package" is hidden, and Drawing 1 (undirected) shows no direction. A student who draws 0→1 gets Bella's output = correct output and a failure with no hint. Fix: show the goal line and say "Bella's arrow points from the node you clicked first to the node you clicked second."
- Weights are not needed in Step 2 (harness passed without them) but nothing says so after Step 1 demanded them.

#### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1, Q3, Q4: wrong-answer feedback begins "Right. A multi-step route through 3 creates reachability…".
- **[MAJOR]** Wrong feedback "A later route may be faster…" (see Step 1) shown on Q1 variant 2 and Q4.
- **[MINOR]** Code-span line-break rendering in Q1 feedback ("Every warehouse / 0 / through / n−1 / ; travel time…").
- Keys verified for all 5 questions.

#### Step 4
- **[MAJOR] (P2)** Cases 2 and 3: "→ Reachable boundary: unweighted-route →".
- **[MINOR] All three buggy outputs are `2`** (hop counts of 2 in every case); after case 1 the student types 2 twice more. Fix: a case with a 3-hop route.
- **[MINOR]** Input format differs (case 1 multi-line `n: 3 / roads: …`; cases 2–3 `n=5, roads=…`).
- Buggy 2/2/2 and correct 7/9/6 verified by running the code. Hidden node labels are bare numbers (ok); edge weights are graded ("✓ Edge labels or weights match the input") with no guide.

#### Cross-step / other
- Fine otherwise.

---

### Perfect-Size Campsites (`perfect-size-campsites`, variant)

#### Step 1
- **[MINOR] Q1 is the Description's Example 1 verbatim** (answer 2 printed there).
- **[MINOR] Q3 success "Why" mentions "direction, and edge label"** — the grid graph has neither.
- All build/remedial keys verified (2, 2, 0, 1; remedials 2, 4, 1, 2, 3). Concept keys Q8 (=2: components 3,3,1,2) and Q9 (=3) verified.

#### Step 2
- **[MAJOR] Q2 Patrick's hidden start is `(0,1)`.** "Patrick ignores the chosen first grass square and uses a different one." The student's own drawing must contain a node named exactly `(0,1)`, in a different patch from their chosen start, or the counterexample cannot work; the label is only revealed in Drawing 2's title. Fix: state "Patrick always starts at (0,1)" in the bug text.
- **[MINOR] "CHOOSE THE FIRST GRASS SQUARE" / reachable-set output** has no counterpart in the real problem (which scans every cell and returns a count) — the student has just spent Step 1 answering counts and is now asked for `["(0,0)"]` with no explanation of the switch.
- Step 1 `(r,c)` labels accepted (probe passed); outputs must be quoted strings (systemic).

#### Step 3
- **[MAJOR] (P1)** Q1 variants 0/2 "(0,0) and (0,1) are directly connected…" → wrong-answer feedback "Correct. The mini-example lists (0,0)—(0,1) as one direct edge."; Q5 → "Correct. Node membership alone creates neither…".
- **[MINOR]** Code-span line-break rendering in Q1 feedback ("Each grass cell marked / 1 / ; non-grass / 0 / cells are not nodes.").
- **[MINOR] Q5 claim wording is odd**: "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable." — two statements joined; a student may answer Yes to the first half and No to the second.
- The after-failure "Use this graph model" panel says "Both (0,2) and 0,2 work" — good, but this is the only problem in the batch where such a panel appears; the other six give no model panel at all.
- Keys verified for all 5 questions.

#### Step 4
- Buggy 0 / 0 / 0 and correct 2 / 5 / 2 verified by hand; hidden labels are `(r,c)` matching Step 1; diagnosis keys correct and case-specific.
- **[MINOR] All three buggy outputs are `0`**; after case 1 the student types 0 twice.
- **[MINOR]** Case 1 reuses Step 1 Q2/Q5 input. Distractor feedback in case 3 says "marked seen" — code uses `visited`.

#### Cross-step / other
- Cleanest problem in the batch.

---

### Routes to the Summit (`count-routes-to-summit`, variant)

#### Step 1
- **[MINOR] Remedial input `graph=[[],[0],[]]` contradicts the story.** The Description says trails "always lead uphill" from base camp 0; a trail 1→0 leads back down to base. The question "How many routes go from base 0 to summit 2?" (→ 0) is gradable, but the input breaks the rule the student was told to trust. Same input is reused as Step 3 Q2. (remedial after `concept-relations`)
- **[MINOR] Q2 "Why" text mentions edge labels.** "An exact picture keeps every entity, direct relation, direction, and edge label from the input." — this problem has no edge labels. (Q2 `concept-picture`)
- Build keys (2, 2, 1, 1), concept keys (Q7 → 3, Q9 → 1) and remedial keys (2, 3, 0, 3, 3) verified.

#### Step 2
- **[MINOR] "CHOOSE THE BASE CAMP" over a readonly field "0".** Nothing to choose. (all 3 rounds)
- Q1–Q3 otherwise fine apart from systemic issues.

#### Step 3
- Q2 uses the downhill input noted above. All 15 claims verified true/false as keyed; degree claims correctly say "outgoing".

#### Step 4
- **[MAJOR] Cases 2 and 3 show wrong-node feedback copied from case 1.** Picking "Checking the target before visited lets the same completed route be counted more than once." displays "The target check is correct; the second valid route is lost earlier at shared node 3." In case 2 (`graph=[[1,2],[2],[3],[]]`) the shared node is 2 and node 3 is the summit; in case 3 (`[[1,2],[3,4],[4],[5],[5],[]]`) the shared node is 4 and node 3 is not shared at all. Fix per case. (cases `repair-2`, `repair-5`)
- **[MINOR] The correct choice is the only one naming input-specific nodes.** Case 1 "…prunes shared node 3…", case 2 "…shared node 2 when route 0→2 arrives after route 0→1→2", case 3 "…shared node 4 when route 0→2→4 arrives after route 0→1→4", versus two generic distractors. Guessable by specificity.
- **[MINOR] Distractor "Adding the recursive branch counts incorrectly combines separate valid routes." is too vague** for a struggling student to know what mistake it describes.
- Buggy outputs 1 / 1 / 2 and correct 2 / 2 / 3 verified. Hidden labels "0"…"5" match Step 1.

#### Cross-step / other
- Case 1 input shown as `graph: [[1, 2], [3], [3], [4], []]`, cases 2/3 as `graph=[[1,2],...]`.

### Runes on the Castle Door (`runes-on-the-castle-door`, variant)

#### Step 1
- **[MINOR] Inputs lose their quotes in Q7/Q8:** `dials = [ab,ab,a]` and `dials = [ab,c,c]` vs `dials=["ab","ab"]` everywhere else. A literal student may think these are different data types.
- **[MINOR] Q2 "Why" mentions edge labels that don't exist:** "An exact picture keeps every entity, direct relation, direction, and edge label from the input."
- **[MINOR] concept-nodes remedial question is jargon:** "How many complete prefix-state leaves exist?" (answer 2 for `["ab","c"]`). Say "How many complete codes are there?"
- **[MINOR] concept-output remedial is Description Example 2** (`["xy","x"]` → `["yx"]`, answer printed in the Description).
- All build/remedial keys verified (`["ab","ba"]`, `["ab"]`, `[]`, `["x","y"]`; remedials `["ab","ac"]`, 2, `["ba"]`, `["yx"]`, `["ba"]`).

#### Step 2
- **[MAJOR] Root node has three names across the lesson:** `start` (Step 1/3 guide), `ε` (Step 2: "Use ε for the empty root, then lowercase partial strings like a or ab."), `empty` (Step 4 hidden canvas). Fix: one name everywhere.
- **[MAJOR] Required output order puts the root LAST.** Expected `["a","b","ε"]`; the natural root-first `["ε","a","b"]` is rejected (harness: reversed order `["ε","b","a"]` ❌). Nothing explains the ε-last sort. (Q1–Q3)
- **[MAJOR] "Correct output" means the set of prefix nodes including the root** (`["a","ab","ε"]`), whereas Step 1's "output" was the list of complete codes (`["ab"]`). A student will type the code list.
- **[MINOR] Q1 bug text is gibberish:** "Kenneth uses the wrong empty code." Kenneth starts from prefix `a` (only in Drawing 2's title). Fix: "Kenneth starts building from the prefix a instead of the empty code."

#### Step 3
- **[MINOR] Q1's three variants repeat the identical claim** "start can reach ba through b, but the graph still has no direct start→ba edge." — after two wrong tries the third check is not a fresh check.
- Claims/keys otherwise correct.

#### Step 4
- **[BLOCKER] Hidden root label `empty`.** Case 1 requires `empty`, `a`, `ab`, `aba`; case 2 `empty`, `a`, `ab`, `aba`, `abac`; case 3 `empty`, `a`, `b`, `ac`, `bc`, `aca`, `acb`, `bca`, `bcb`. No guide is shown; Step 1 taught `start`, Step 2 `ε`. A student cannot guess `empty`. Fix: use `start` in the Step 4 canvases.
- **[MINOR] Dial numbering is 1-based in diagnosis text but 0-based in the Description.** "The used set rejects rune a on dial 3" (3-dial input; `dials[3]` doesn't exist), "Dial 3 repeats a non-adjacent rune after b" (0-based dial 3 is `c`), "their final rune appeared on dial 1" (0-based dial 1 is `c`). (cases 1–3)
- **[MAJOR] Same bug ×3;** every correct choice contains "used set", every case has the same "no-backtrack" and "accepts-prefix" distractors. Buggy outputs `[]`, `[]`, `["acb","bca"]` verified.

#### Cross-step / other
- Root naming inconsistency (start / ε / empty) is the single biggest trap in this lesson.

---

### Save the Date (`save-the-date-phone-chain`, variant)

#### Step 1
- **[BLOCKER] Every graph requires exact edge labels, and no screen says so.** Q1's hidden canvas: `0→1 "+2"`, `0→2 "+2"`, `1→3 "+3"`, `1→4 "+3"`, `2→5 "+1"`; Q2: `2→0 "+5"`, `2→1 "+5"`; Q5: `"+4","+4"`; Q8: `"+2","+2","+1"`; all five remedials likewise. The only guide is "Use each node's 0-based number only. Example: 2." `gradeCanvas` compares the trimmed label string exactly, so `2` ≠ `+2` and an unlabeled arrow fails. The checklist line "Edge labels or weights match the input ×" appears only after a failed Check, and the code's hint `exactEdgeDetails` ("Use these exact edge labels: …") is defined but never called. Q1 is the first screen of the lesson; the picture question that shows "+2" labels is Q3. Fix: add "Label each arrow with the caller's wait, written like +2" to the guide, or drop label grading in Step 1.
- **[MAJOR] Q9 is Q8 again.** Q8 build `n=4, headId=2, caller=[2,0,-1,2], waitDays=[1,0,2,0], deadline=0` (answer 1) is immediately followed by concept Q9 with the identical input and answer 1. Q9 tests nothing new. (Q8 `deadline-zero`, Q9 `concept-bug`)
- **[MINOR] Q1 and Q2 are Description Examples 1 and 2 verbatim** (answers 4 and 1 printed in the Description).
- **[MINOR] concept-nodes remedial asks "How many person nodes are in the tree?" for `n=3`** — the answer is literally `n`; wrong-choice feedback "mistakes headId 1 for an array length boundary" is odd. (remedial after `concept-nodes`)
- Keys verified: Q1 4, Q2 1, Q5 3, Q7 5, Q8 1, Q9 1; remedials 4, 3, 3, 3, 3.

#### Step 2
- Step 1 numeric names are accepted (good). Output is the reached-people set `[0,1,2]` rather than a count — instance of the systemic issue; no wait days exist in Step 2, so the lesson's timing idea disappears entirely for three rounds.
- Bug texts are clear ("Reagan stops after one hop", "Eduardo builds every listed connection except the last one", "Jordyn reads every from/to relationship backward").

#### Step 3
- **[MAJOR] Edge labels still required, still no guide.** Failed-graph checklist shows "Edge labels or weights match the input ×" (Q1); required labels `+2`, `+3` (Q1), `+1,+2,+3` (Q2), `+1,+1,+4,+2` (Q3), `+2,+2` (Q4), `+3` (Q5).
- **[MINOR] Q1's three variants repeat the same claim** "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
- **[MINOR] Backtick leak:** "Correct node rule: Each of the n people, with / headId / as the root." rendered on separate lines.

#### Step 4
- **[BLOCKER] Cases 2 and 3 require edge labels with no guide; case 1 requires none.** Case 1 hidden edges `0→1`, `1→2` (unlabeled; label check is skipped); case 2 requires `+2,+2,+3,+3,+1`; case 3 requires `+5,+5`. The student who passes case 1 without labels then fails case 2 with "The drawing has every exact edge ×" (label mismatch is reported under the labels line only after nodes pass).
- **[MAJOR] Raw token leaks into student text:** "Reachable boundary: listener-wait-time" in the success text of cases 2 and 3 (and in the pre-success chain).
- **[MAJOR] Same bug ×3, identical three choices;** cases 2 and 3 are Step 1 Q1 and Q2 (Description Examples 1 and 2). Buggy outputs 3, 6, 3 verified.

#### Cross-step / other
- Step 1/3/4 grade "+N" edge labels that the lesson never teaches how to write; Step 2 has no weights at all.

---

### Shut the Valve (`shut-the-garden-valve`, variant)

#### Step 1
- **[MAJOR] The same graph is drawn twice in a row, and it is the Description's example.** Q1 and Q2 both use `ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40]` (shutId 2 then 1); the hidden canvases are identical (`1:5, 2:10, 3:20, 4:40`); the answers 50 and 75 are Examples 1 and 2 in the Description. Q3 and Q5 show the same input a third and fourth time. Fix: give Q2 a fresh tree.
- **[MINOR] Q9's input equals the concept-nodes remedial input** (`ids=[30,10,20], feeds=[0,30,10], liters=[7,1,9], shutId=10`, answer 10 both times), and the correct answer "10" is also the shutId, inviting "it's the ID" confusion.
- Keys verified: Q1 50, Q2 75, Q4 4, Q6 13, Q8 21, Q9 10; remedials 10, 10, 7, 21, 102.

#### Step 2
- **[MAJOR] Q3 requires a node named 2 and the student is never told.** "Marley runs the search from a different shut sprinkler." — the authored wrong start is `2` (only in Drawing 2's title) and the authored goal "Shut sprinkler 1, but make the mistaken search begin at sprinkler 2" is hidden. IDs here are free positive integers, so a student who reuses Step 1's `5, 9, 2` or shuts sprinkler 3 has no way to know what Marley does.
- **[MINOR] Step 1 format `1:5` rejected** with "Use positive integer IDs, like 1, 3, or 10." and "CORRECT OUTPUT" is a list of shut sprinkler IDs (`[1]`), not liters — instance of the systemic issues; nothing on screen prepares the student for either.

#### Step 3
- **[MINOR] Wrong-answer feedback begins with "Correct."** ("Correct. The mini-example lists 4:100→5:1 as one direct edge." under ×, Q1 v0/v1/v2).
- Claims and keys otherwise correct.

#### Step 4
- **[BLOCKER] Case 1 hidden labels are bare IDs `1`, `2`, `3`, `4`,** while cases 2 and 3 require the Step 1 format `1:5, 2:10, 3:20, 4:40` and `10:2, 20:3, 30:5, 40:7`. No guide on any case. A student using the taught format fails case 1; one who then switches to bare IDs fails case 2.
- **[MAJOR] Raw token leaks:** "Reachable boundary: ignore-downstream-subtree" in the success text of cases 2 and 3.
- **[MAJOR] The "trace" is a 5-line lookup, repeated three times.** Code is `return input.liters[input.ids.indexOf(input.shutId)]` — no graph is built or traversed, so drawing the graph has nothing to do with predicting the output. Case 2 is Step 1 Q2; case 3 is the concept-picture remedial. Buggy outputs 10, 5, 3 verified.
- **[MINOR] Padded distractors:** "…which changes how the shown graph is evaluated." appended to both wrong choices in case 1.

#### Cross-step / other
- Labels: `1:5` (Step 1/3), `1` (Step 2), `1` then `1:5` (Step 4).

---

### The Biggest Study Group (`biggest-study-group`, variant)

#### Step 1
- **[MINOR] Q7 and Q9 re-ask builds the student already answered.** Q7 "What largest study-group size is returned from this worked-together matrix?" uses the exact Q1 matrix (student already picked 4 in Q1); Q9 uses the exact Q3 matrix (already picked 2 in Q3). Neither tests anything new. Fix: use fresh matrices (the remedial inputs are unused elsewhere). (Q7 `concept-output`, Q9 `concept-counterexample`)
- **[MINOR] Q5 raw-input box contains an instruction line.** The code box shows the matrix followed by "Focus on one listed relation." — a literal student may read that as part of the input. Move it into the prompt or drop it. (Q5 `concept-edge`)
- **[MINOR] Q5 choice B does not answer the question asked.** Question: "Which matrix entries create edges between different students?" Choice B: "Each diagonal 1 must be drawn as a self-loop and counted as another group member." A self-loop is by definition not "between different students", so the option is dismissable from the wording alone, and it smuggles a node-count claim into an edge question. (Q5)
- Build keys (Q1 → 4, Q3 → 2, Q6 → 4, Q8 → 1) and all five remedial keys (2, 2, 3, 3, 1) verified correct.

#### Step 2
- **[MINOR] "CHOOSE THE FIRST STUDENT IN THE GROUP" is a misleading name for the search start.** In a problem about "the largest study group", "first student in the group" reads as "first member of the biggest group", not "where the search begins". Suggest "Starting student". (all 3 rounds)
- **[MINOR] Q3 bug text uses untaught jargon.** "Liliana drops every connection touching a degree-one node." "Degree" is never defined in this lesson (Step 3 says "direct neighbors"). Rephrase: "drops every connection that touches a student who has only one teammate". (Q3 `skip-leaf-edges`)
- Q1 (`make-one-way`) / Q2 (`first-branch`): only the systemic issues apply.

#### Step 3
- **[MINOR] Q5 self-edge claim conflicts with the visible diagonal 1.** Input `worked=[[1]]`; claim "0 can reach itself without using an edge, but the graph still has no direct 0—0 edge." keyed YES. The input literally shows worked[0][0]=1, and Step 1 Q5 offered "draw the diagonal as a self-loop" as a tempting option, so a literal student may answer NO ("there is a 0—0 entry"). Feedback ("A zero-step path makes 0 reachable from itself; it does not invent a self-edge.") never says the diagonal 1 is excluded by the "different i and j" rule. Add that sentence. (Q5)
- All degree and direct-vs-reach claims verified for the 5 inputs. Q1's "1 has exactly 2 direct neighbors" / "2 has exactly 1 direct neighbor" (both NO) usefully catch students who count the diagonal.

#### Step 4
- **[MAJOR] Internal slug displayed as the "Reachable boundary" in cases 2 and 3.** Success text and wrong-diagnosis feedback show "→ Reachable boundary: self-entry-adds-member →". That is an unrendered key, not a sentence. Replace with prose like case 1's ("The self-entry is 1 as guaranteed by the input."). (cases `ring-and-pair`, `two-tied-pairs`)
- **[MINOR] Wrong choices carry a boilerplate tail the correct choice lacks.** In all three cases the two distractors end "…which changes how the shown graph is evaluated." / "…changing this input's returned value." while the correct choice has no tail — the answer is identifiable by shape.
- **[MINOR] Case 1 input notation differs from cases 2/3.** `worked: [[1, 1], [1, 1]]` vs `worked=[[1,1,0,...]]`.
- Buggy outputs 3 / 5 / 3 and correct outputs 2 / 4 / 2 verified. Hidden labels "0"…"6" match the Step 1 format.

#### Cross-step / other
- Nothing further.

### The K-th Song (`kth-song-in-playlist`, variant)

#### Step 1
- **[MINOR] Q2 pictures use a different label vocabulary from the node-name guide.** Choices show "Outer array / Array at [0] / 1 at [0][0] / …" while the guide on the same screen says "Use root=[] … root[1][0]=7". The student is asked to compare a picture in one notation against a rule in another.
- **[MINOR] Q1 is Description Example 1 verbatim (answer 4 printed).** Also the exact-picture remedial reuses Q7's input `[3,[8,[5,9]],[],4], k=4` and the concept-relations remedial reuses Q8's input `[[[2]],6], k=1`, so a student who misses Q2/Q5 meets the same input again minutes later.
- Answer keys all verified (4, 9, 2, 9, 2, -1; remedials 9, 2, 2, 10, 2).

#### Step 2
- **[MAJOR] Node names change between Step 1 and Step 2 with no on-screen guide, and the first error message points elsewhere.** Step 1 taught `root=[]`, `root[0]=[]`, `root[0][0]=1`; Step 2 requires `root`, `root[0]`, `root[0][0]`. Submitting Step 1's Q1 graph is rejected with "Draw 1–8 nodes." (it has 9 nodes) — nothing about labels; a smaller graph in Step 1 notation is rejected with "Use root, root[0], root[1], ... to name nested input items." only after clicking Check. The graph must also be a tree ("This problem's input must form one connected tree.") — not stated. The field "CHOOSE THE PLAYLIST ROOT" is read-only ("root"), so "Choose" is misleading.
- **[MINOR] "CORRECT OUTPUT" for this problem is a song ID, but the field wants `["root","root[0]","root[1]","root[1][0]"]`** — the node set, not a song. (Instance of the systemic issue; especially confusing here because the Description's whole point is "returns the ID of the k-th song".)

#### Step 3
- Claims and keys verified for all five inputs; no problem-specific issues.

#### Step 4
- **[MAJOR] Hidden node labels revert to Step 1 notation right after Step 2 taught the other notation, with no guide.** Required labels: case 1 `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=[]`, `root[0][1][0]=2`, `root[1]=3`; case 2 `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=2`, `root[1]=[]`, `root[1][0]=3`, `root[1][1]=[]`, `root[1][1][0]=4`, `root[1][1][1]=5`; case 3 `root=[]`, `root[0]=7`, `root[1]=[]`, `root[1][0]=[]`, `root[2]=[]`, `root[2][0]=8`, `root[2][1]=[]`, `root[2][1][0]=9`. A student who writes `root[0]` (Step 2 style) fails "The drawing has every exact node" with no explanation.
- **[MAJOR] Graph-proof feedback names folders that exist nowhere on screen and contradict the required labels.** Case 1: "Traversal stops at depth two and never crosses folder A→folder B." Case 2: "Nodes are root, A, 1, 2, B, 3, C, 4, 5; direct arrows are root→A, A→1, A→2, root→B, B→3, B→C, C→4, C→5." Case 3: "Nodes are root, 7, A, empty, B, 8, C, 9; direct arrows are root→7, root→A, A→empty…" The Step 1 build feedback for Q1 also says "counts folder B". If the student adopts A/B/C on a retry, the grader rejects the drawing. Rewrite using the `root[i]=[]` labels.
- **[MINOR] Code is `function solve(input)` reading `input.playlist` / `input.k`,** not the Description's `kthSong(playlist, k)`; case 1 input is shown as two lines "playlist: [[1, [2]], 3] / k: 2" while cases 2–3 show "playlist=[[1,2],[3,[4,5]]], k=4". Case 2/3 inputs are Step 1 Q1/Q4 again; all three cases show the identical 14-line function, so the correct diagnosis text repeats verbatim.
- **[MINOR] Distractor wording.** "The code treats k as a zero-based index, which changes how the shown graph is evaluated." — the tail clause is meaningless (k does not change a graph).

#### Cross-step / other
- Description's examples use `playlist = …, k = 4`; lesson inputs `playlist=…, k=4`. Fine.

### The Night Guard's Keyring (`museum-vault-keyring`, variant)

#### Step 1
- **[MINOR] Q7 repeats Q1; Q9 repeats Q2.** Q7 shows the identical input `vaults = [[1],[2],[],[2,5],[],[]], startKeys = [0,3]` the student just built in Q1 (and answered "5"), asking "How many distinct vaults can the starting keyring eventually open?" → 5. Q9 shows Q2's input (answered "3") → 3. Two of the five concept checks test nothing new. Fix: fresh inputs.
- **[MINOR] Q7 distractor "7" has feedback that doesn't produce 7.** Feedback: "Vault 2 is reached from both chains but must be counted once." Adding the two chains {0,1,2} + {3,2,5} gives 6, not 7 — and 6 is already the "assume-all-open" distractor. 7 is not a believable single mistake. Fix: replace with a derivable value or fix feedback.
- **[MINOR] Q3 success "Why" mentions "edge label"**: "An exact picture keeps every entity, direct relation, direction, and edge label from the input." This problem has no edge labels.
- All 4 build keys and 5 remedial keys verified.

#### Step 2
- Step 1's bare-number labels are accepted (probe passed). Bug texts are accurate. Q3 hidden wrong start `1` (systemic).
- **[MINOR] "CHOOSE THE INITIAL KEY"** — the real problem has a *list* `startKeys`; here the student may only give one. Not stated. Fix: "Choose ONE starting key."

#### Step 3
- **[MAJOR] (P1) "Right."/"Correct." shown on a wrong answer.** Q2 "0 can reach 1 through 2, but the graph still has no direct 0→1 edge." → wrong-answer feedback "Right. A multi-step route through 2 creates reachability…"; Q3 and Q5 "…directly connected…" → "Correct. The mini-example lists 1→2 as one direct edge."
- **[MINOR] Feedback text is broken into separate lines around code spans.** Q1 on-screen: "Correct node rule: Every vault index / 0 / through / n−1 / , whether initially openable or not." (each on its own line). Looks like garbage to a student. Fix: render backticks inline.
- Q1 membership claim "Each physical key, even when two vaults contain a key for the same vault" is quoted for `vaults=[[],[0]]`, which has no duplicate keys (systemic).
- Keys for all 5 questions checked and correct.

#### Step 4
- **[MAJOR] (P2) Raw slug shown to student.** Cases 2 and 3 success text: "→ Reachable boundary: initial-keys-only →". Fix: write a sentence ("Only vaults named in startKeys are ever opened").
- **[MINOR] Cases 2 and 3 reuse Step 1 Q1 and Q2 inputs** whose correct answers (5, 3) the student already gave, and all three cases show the same 9-line code with the same three diagnosis sentences in shuffled order. After case 1 the student just re-picks "opens initial keys but never reads…". Fix: vary the bug or the code.
- **[MINOR] The shown code contains no graph traversal at all** (it only sizes a Set of startKeys), so the "Code rule → Changed graph → Reachable boundary" chain has no code to point at; distractor "The code follows every found key backward…" is refuted by "It follows no vault edges at all." Fix: use a buggy DFS that opens vaults but forgets to push found keys.
- **[MINOR] Input format differs between cases**: case 1 `vaults: [[1], [2], []]` / `startKeys: [0]` on two lines; cases 2–3 `vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]`.
- Buggy outputs 1 / 2 / 1 and correct 3 / 5 / 3 verified.

#### Cross-step / other
- Fine otherwise.

---

### Top of the Pile (`top-of-the-pile`, variant)

#### Step 1
- All keys verified (Q8: depth-2 integers 5 and 4 → 9; Q9: 6 + (−6) → 0).
- **[MINOR] Two naming schemes on one screen.** Q3 pictures label nodes "Outer array", "Array at [0]", "5 at [0][0][0]" while the guide directly above says `root=[]`, `root[0]=[]`, `root[0][0][0]=5`. (Q3)
- **[MINOR] Distractor with no derivation.** Q9 choice D "1": feedback "Zero is a valid sum; it does not mean the level had no items." describes the zero-means-empty mistake, but that mistake produces −5 (choice C), not 1. Nothing produces 1. (Q9)
- **[MINOR] Q9 choice C shows "−5" (Unicode minus) while every input writes "-5".** (Q9)
- **[MINOR] Q1 = Description Example 1 verbatim** (output 7 explained). (Q1)
- **[MINOR] Remedial titles are jargon:** "Fresh proof · Protect entity identity", "Fresh proof · Protect direct relations", "Fresh proof · Catch a near-miss implementation". (remedials)

#### Step 2
- **[MAJOR] Step 1 names rejected because of the `=value` suffix.** Step 1 taught `root[1]=7`; Step 2 rejects it with "Use root, root[0], root[1], ... to name nested input items." only after Check. The only visible hint is the prefilled start "root". (S2 Q1–Q3; known-systemic list, concrete here)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `topLayerSum` returns a sum; the field wants `["root","root[0]"]`. (S2 Q1–Q3)
- **[MINOR] Q2 "Makenzie uses the wrong outer box."** Her start `root[0]` is only revealed in Drawing 2's title, and `root[0]` is an inner box, so "outer box" is misleading. (S2 Q2 `wrong-start`)

#### Step 3
- **[MINOR] Empty-array rule tested only on inputs with no empty array.** "Every integer and only arrays that contain at least one integer somewhere below" is used on `[-2,[10]]` (Q1 v1), `[[1,2],[3]]` (Q2), `[[[2]],3]` (Q5); none has an empty array, so the rule yields the identical graph and the keyed answer is debatable. Fix: use `[[],[6,-6],[[9]]]`-style inputs for this rule. (S3 Q1 v1, Q2, Q5)
- **[MINOR] "× Right. A multi-step route through root[0]=[]…"** for a wrong answer. (S3 Q2, Q5)

#### Step 4
- All three buggy outputs verified (20, 26, 15); labels match the Step 1 `root[0]=[]` format.
- **[MAJOR] Raw internal token shown on screen.** Cases 2 and 3 display "→ Reachable boundary: branch-local-shallowest →" in both the wrong-diagnosis feedback and the success text. Fix: author real boundary sentences. (S4 cases 2–3)
- **[MAJOR] "Changed graph" uses labels that exist nowhere.** Case 2: "Nodes are root, A, B, 5, 6, 7, C, 8; direct arrows are root→A, A→B, B→5, B→6, root→7, root→C, C→8." Case 3: "Nodes are root, A, 6, 5, B, 4…". The student just drew `root[0]=[]`, `root[0][0]=[]`; A/B/C are never defined. (S4 cases 2–3)
- **[MINOR] Code signature mismatch.** Shown code is `function solve(input) { … sumBox(input.items) }` while the problem defines `topLayerSum(items)`. (S4 cases 1–3)
- **[MINOR] Same code and same three choices three times.** (S4 cases 2–3)

#### Cross-step / other
- Nothing further.

### Trusted Courier Networks (`trusted-courier-networks`, variant)

#### Step 1
- All keys verified (Q9: 5, 4, 6 with k=4 → one chain → 1).
- **[MAJOR] Wrong answer is predictable in 7 of 9 builds.** The wrong choice is simply the number of offices n: Q1 "5" (n=5), Q3 "4" (n=4), Q6 "5" (n=5), remedials "5", "4", "4", "5"; the other two use "0". A student learns "never pick the office count or 0" and never needs the graph. Fix: vary distractors (edge count, strict-threshold count, etc.). (Q1, Q3, Q6, Q8, all remedials)
- **[MINOR] Inputs contradict the Description.** Q7 `[[0,8,0,…]` and Q9 `[[0,5,0,0],…]` have 0 on the diagonal; the Description says "trust[i][i] is always 10". (Q7, Q9)
- **[MINOR] Edge rule literally includes self-loops.** "When trust[i][j] >= k" with trust[i][i]=10 ≥ 6, yet required graphs have no self-loops and nothing says to ignore the diagonal. Fix: "for two different offices i and j". (Q5, all builds)
- **[MINOR] Stray instruction in the input box.** Q5 raw input ends with "Focus on one listed relation." — no relation is singled out. (Q5)
- **[MINOR] Remedial titles are jargon:** "Fresh proof · Name the real entities", "Fresh proof · Read one direct relation", "Fresh proof · Catch a realistic bug". (remedials)

#### Step 2
- **[MAJOR] Q2 depends on click order that the undirected Drawing 1 cannot show.** "Alana allows each two-way link to work only in its written order." "Written order" is the order the student clicked the endpoints. The harness had to draw the edge as 1—0 (clicking 1 first) so Alana's 1→0 blocks start 0; drawing the same edge as 0—1 gives Alana `[0,1]` = the correct output and the counterexample is rejected. Alana's drawing must also be DIRECTED. Fix: state "the first node you click becomes the arrow's tail" and show the numbers/arrow direction in Drawing 1. (S2 Q2 `make-one-way`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `countSecureNetworks` returns a count; the field wants `[0,1,2]`. (S2 Q1–Q3)
- **[MINOR] Q1 Cesar's start is hidden.** "Cesar ignores the chosen first office in the network and uses a different one." — he starts at office 1 (revealed only in Drawing 2's title), so the student's correct graph must already contain a node 1 in a different component. (S2 Q1 `wrong-start`)
- **[MINOR] "CHOOSE THE FIRST OFFICE IN THE NETWORK / first office in the network"** is clunky and "first" suggests office 0. Fix: "Choose the starting office". (S2 Q1–Q3)

#### Step 3
- **[MAJOR] Claim with a false premise.** Q4 identity matrix (no edges): "0 can reach 1, so the graph should contain a direct edge between them." keyed NO; 0 cannot reach 1, and the feedback "Reachability never creates a direct edge…" implies it can. (S3 Q4)
- **[MINOR] Broken rendering of the node rule in feedback.** Q1 (all variants) shows "Correct node rule: Every office index / 0 / through / n−1 / , even one trusted by nobody." split over five lines because the authored rule contains backticks around `0` and `n−1`. Fix: strip backticks in the Step 3 feedback renderer or the authored rule. (S3 Q1)
- **[MINOR] Membership claim untestable on its input.** Q1 v2 star input (every office has a 7): "Use this node rule: 'Only offices that have at least one trust score at or above k.'" keyed NO, but the rule yields the identical graph here. Fix: use the identity-matrix input for this rule. (S3 Q1 v2)
- **[MINOR] "× Right. A multi-step route through 3…"** for a wrong answer. (S3 Q2)

#### Step 4
- All three buggy outputs verified (3, 3, 2).
- **[MINOR] Code signature mismatch.** Shown code is `function solve(input)` using `input.trust` / `input.k`; the problem defines `countSecureNetworks(trust, k)`. (S4 cases 1–3)
- **[MINOR] Wrong noun.** Case 3 choices/feedback say "two strong courier pairs", "from courier 1 to courier 2", "joins all four couriers" — the nodes are offices everywhere else. (S4 case 3)
- **[MINOR] Same code three times** (diagnoses reworded, always the "> k" answer). (S4 cases 2–3)

#### Cross-step / other
- Label format (bare index) is consistent across steps — fine.

### 10 Kinds of People (`ten-kinds-of-people`, new)

#### Step 1
- All nine keys verified correct (including every required edge set).
- **[MINOR] First build needs the node rule that is taught two questions later.** Q1 `grid=["110","010"]` requires the isolated 0-cell node `(1,0)` and the 0-edge `(0,2)—(1,2)` even though the query is about 1-cells; the rule "Every grid cell, whether it contains 0 or 1" is only taught in Q3. A student who draws only 1-cells sees "Every exact node is drawn ×" with no explanation. Fix: show the node/edge rule above Q1 or move `node-rule` first. (Q1)
- **[MINOR] Answers copied from the Description.** Q7 = Example 1 and Q8 = Example 2 verbatim, outputs and explanations given. (Q7, Q8)

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `whoCanTravel` returns labels like `["decimal"]`; the field wants the reached cells `["(0,0)","(0,1)"]`. A student will type `["decimal"]` or `decimal`. (S2 Q1–Q3)
- **[MINOR] "CHOOSE THE QUESTION START / question start".** The problem calls them queries and never says "question". Fix: "Choose the starting cell of the query". (S2 Q1–Q3)
- **[MINOR] Q3 "Santiago keeps only the last branch it sees."** Vaguer than the other problems' text; does not say it happens at every node, that "last" means last-drawn edge, or that he never backtracks. (S2 Q3 `last-branch`)
- **[MINOR] Q1 drawings carry no digit.** "Leonardo allows diagonal steps…" — the grader joins any diagonal pair of drawn cells; the student cannot mark a diagonal cell as the other digit. (S2 Q1)

#### Step 3
- **[MINOR] Membership claim untestable on its input.** Q5 `["111"]`: "Use this node rule for the graph: 'Only cells containing 1.'" keyed NO, but every cell is 1 so the rule yields the identical graph; YES is defensible. Fix: use this rule on a grid containing 0s. (S3 Q5)
- **[MINOR] "× Right. A multi-step route through (0,2)…"** for a wrong answer. (S3 Q1 v1/v2)

#### Step 4
- All three buggy outputs verified `["decimal"]`; required graphs match the rules (case 2 needs all 9 cells plus the four 0-cell edges).
- **[MAJOR] Output must be a JSON array of quoted strings and nothing says so.** Grader accepts `["decimal"]`, rejects `[decimal]`; the only hint is the placeholder "Example: false, 3, or [1, 2]", which shows no string. All three cases return strings. Fix: placeholder/example `["decimal"]`. (S4 cases 1–3)
- **[MINOR] Nonsense distractor.** Case 3 choice A "The answer label should be binary whenever a route contains an even number of cells." (S4 case 3)
- **[MINOR] Same bug three times.** The correct choice always contains "diagonal"/"corner"/"eight-offset"; after case 1 it is a keyword match. (S4 cases 2–3)

#### Cross-step / other
- Label format `(r,c)` is consistent across all four steps — fine.

### Array Deep Count (`codewars-array-deep-count`, new)

#### Step 1
- **[MINOR] Q3 feedback for Picture D describes a different mistake.** Picture D only reverses one arrow (`[0]=1→outer array`); the displayed feedback says "This changes whether direct relations are arrows or two-way links." Nothing became two-way. Say "This reverses the arrow between outer array and [0]=1." (Q3 `exact-picture`)
- **[MINOR] Picture labels never match the names the student must type.** Q3's pictures label nodes "Outer array", "1 at [0]", "Array at [1]", "2 at [1][0]", while the guide and grader require "outer array", "[0]=1", "[1] array", "[1][0]=2". The student learns names from pictures that are then rejected in builds. (Q3)
- **[MINOR] Q8 requires typing straight double quotes: `[0]="x"`.** The guide says "Copy values exactly, including quotes around text", but smart-quote autocorrect (iPad/macOS) yields `“x”` and the only feedback is the generic node checklist. Accept both quote styles or normalise them. (Q8 `build-4`)
- **[MINOR] Q7 and Q9 are the Description tab's Example 1 and Example 2, with answers printed there** (`[1, 2, [3, 4, [5]]]` → 7; `["x", "y", ["z"]]` → 4). (Q7 `predict-output`, Q9 `bug-trap`)
- Build keys (3, 3, 0, 1) and remedial keys (4, 3, 2, 3, 4) verified.

#### Step 2
- **[MAJOR] Concrete instance: Step 1 names are rejected only after clicking Check.** Submitting "outer array", "[0]=1", "[1] array", "[1][0]=2" fails with "Use root, root[0], root[1], ... to name nested input items." The word "root" appears nowhere earlier in the lesson, and the heading "CHOOSE THE OUTER ARRAY" sits over a readonly field already containing "root" — nothing to choose. (all 3 rounds)
- **[MINOR] "CORRECT OUTPUT" is a list of paths, not a count.** The function returns a number in Step 1; here the field expects `["root","root[0]","root[0][0]"]`. This mismatch is more jarring here than in graph problems because the student has just spent nine questions predicting numbers.
- Bug descriptions (shallow-search, reverse-arrows, drop-last-edge) match what the grader simulates.

#### Step 3
- **[MINOR] Empty-array membership claims on inputs with no empty array.** Q1 v2 (`[[1],2]`) and Q4 (`[1,1,[1]]`) use the rule "Only items inside non-empty arrays." with feedback "An empty inner array still counts as one element." For these inputs that rule yields the identical graph, so "it would be a mistake" is only true in general. Use the claim only on Q2's `[[],1]`. (Q1, Q4)
- All degree ("outgoing") and direct-vs-reach claims verified.

#### Step 4
- **[BLOCKER] Case 1 requires hidden labels "outer", "1", "inner", "2", "empty".** Input `arr: [1, [2, []]]`; no guide is shown; the taught names are "outer array", "[0]=1", "[1] array", "[1][0]=2", "[1][1] array" — and cases 2 and 3 of this same step DO require the taught names. "inner"/"empty" cannot be guessed; the only feedback is "The drawing has every exact node ×". Fix: regenerate case 1's canvas with pattern-conformant labels. (case `authored-deep-case`)
- **[MINOR] Distractor "The empty array should contribute the number of its missing children for the shown graph." is meaningless** ("number of its missing children" = ?), and in case 2 (`[1,[2]]`) there is no empty array at all. (cases 1–3)
- **[MINOR] Mixed choice framing.** Distractors A/C are phrased as what the code "should" do (claims about the right answer); the correct choice B is phrased as what the code does wrong. A student hunting for "the bug" can discard A/C on form alone.
- Buggy outputs 2 / 2 / 0 and correct 4 / 3 / 3 verified.

#### Cross-step / other
- Node naming changes four times across the lesson: pictures ("1 at [0]"), Step 1/3 typing ("[0]=1"), Step 2 ("root[0]"), Step 4 case 1 ("1", "inner", "empty").

### Check for Path in a 2D Grid with Obstacles (`gfg-grid-path-exists`, new)

#### Step 1
- All keys are correct.
- **[MAJOR] Q8 distractors are fragments or true statements.** Question "Which graph reasoning is correct for this case?" for `[[1,3,0],[0,3,0],[0,3,2]]`; choices "the 3 cells form a side-connected route", "the route must be a straight line", "with diagonal moves", "3 is not the destination". "with diagonal moves" is not a sentence, and "3 is not the destination" is literally true (the destination is 2), so a literal student can defend D. Fix: make each choice a complete claim about why the function returns true. (S1 Q8)
- **[MAJOR] Q9 has two true-statement distractors.** For `[[1,0,3],[0,0,3],[3,3,2]]`: "the lower 3 region touches the destination" is true ((2,1)—(2,2)); "source is on an edge" is true ((0,0)); "by moving diagonally" is a fragment. Only "walls box the source away from every 3" explains the `false`, but the question does not ask for the explanation of the returned value. (S1 Q9)
- **[MINOR] "fresh input"** — Q3's input is Q1's. (S1 Q3)
- P1 applies (Picture B lists two names). (S1 Q3)

#### Step 2
- **[MINOR] Hidden wrong start "(0,1)".** "Erick ignores the chosen source cell and uses a different one." — the student's graph must contain `(0,1)` and must not use it as the start. (S2 Q1)
- P4 applies to Jace. (S2 Q3)

#### Step 3
- All 15 claims are correctly keyed; no problem-specific issue beyond SYSTEMIC-NOTES.

#### Step 4
- **[MAJOR] P2: "Walls can be crossed diagonally" in all three cases**; the correct sentence always contains "diagonal". (S4 cases 2–3)
- **[MINOR] Nonsensical distractor naming a variable that does not exist.** Case 2: "The seen key confuses row 1,column 1 with row 11,column 0." — the code uses `visited`, and the scenario cannot occur. (S4 case 2)
- P3 applies. Buggy `true` for all three cases verified by hand (8-offset loop).

#### Cross-step / other
- None beyond the above.

### Connected Cells in a Grid (`hackerrank-connected-cells`, new)

#### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** Raw input `grid=[[0]]`, hidden correct graph has zero nodes, and the answer buttons "were disabled until a node was drawn". The student is asked "What should the function return?" but cannot click 0 without first drawing a node, which then fails "Every exact node label". Harness skipped it ("8 passed · 1 skipped"). Fix: allow answering when the expected graph is empty, or use an input with at least one 1-cell (e.g. `[[0,1]]`).
- **[MINOR] Q7 and Q9 are the Description's Example 1 and Example 2 verbatim, with the answers printed there.** Q7 `[[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]` → Description says "output 5"; Q9 `[[1,0,1],[0,1,0],[1,0,1]]` → Description says "output 5". Both concept checks are answerable by flipping to the Description tab. Q9's input is reused again as Step 4 case 3.

#### Step 2
- **[MINOR] "CHOOSE THE REGION SEED / region seed" is undefined jargon.** Nothing tells the student that "region seed" means the cell the search starts from. Suggest "Choose the start cell".
- Bug simulation for Peter/Violet/Jaylen is accurate for what the grader does (remove-diagonals only strips edges between diagonally adjacent coordinates; last-branch/shallow-search as described). No problem-specific issues beyond the systemic ones.

#### Step 3
- **[MAJOR] Q1 relation claim has a false premise.** Input `grid=[[1,0,0],[0,0,1]]` (two isolated cells) shows "(0,0) can reach (1,2), so the graph should contain a direct edge between them." — (0,0) cannot reach (1,2) at all. NO is keyed correct, but the sentence tells the student a falsehood, and the feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2)." still implies they are reachable. The same wording appears in all three variants of Q1. Use the phrasing already used elsewhere: "There is no direct edge between (0,0) and (1,2); merely naming both nodes does not make them reachable."
- **[MINOR] Q3 wrong-answer feedback starts with "Correct."** Claim "(1,0) and (1,1) are directly connected, not merely reachable through a longer route." (YES) has feedback-if-wrong "Correct. The mini-example lists (1,0)—(1,1) as one direct edge." A student who answered NO sees an × followed by "Correct." Drop the word.

#### Step 4
- **[MAJOR] Diagnosis choices and feedback use variable names that are not in the shown code.** Code declares `directions`, `visited`, `largestValue`; the choices say "dirs lists only side moves…" (keyed correct, cases 1–2), "dirs omits all four diagonal edges…" (keyed correct, case 3), "Sharing seen between component searches…", "best starts at zero instead of one…", "The global seen set merges…"; feedback says "A global seen set is correct". A literal student searching the code for `dirs`, `seen`, or `best` finds nothing. Rename in `step4-specs-new.json` to match the code (`directions`, `visited`, `largestValue`).
- **[MINOR] Nonsensical distractor wording.** Case 1 C: "best starts at zero instead of one, and that graph-level change determines the returned value." (an initial value is not a graph-level change). Case 3 A: "best should start at one, which alone would make the correct answer five." Neither describes a believable student mistake.
- **[MINOR] All three cases show the identical function and identical bug ("Diagonal region edges are discarded").** After case 1 the student re-picks the same diagnosis twice; case 2's input is Step 1's node-rule remedial and Step 3 Q4, case 3's is Step 1 Q9 / Description Example 2. Input shown as `grid: [[1, 0], [0, 1]]` in case 1 but `grid=[[1,0,1],[0,1,0]]` in case 2.

#### Cross-step / other
- Fine otherwise; node-label format is consistent across steps ("(r,c)"; Step 2 placeholder "Example: (0,0)").

### Count Sub Islands (`count-sub-islands`, new)

#### Step 1
- **[BLOCKER] Q9 (`build-4`) cannot be completed.** Input `grid1=[[0]], grid2=[[0]]`; the required graph has zero nodes, but the answer buttons stay disabled until a node is drawn. Drawing any node makes the drawing wrong; drawing nothing leaves the buttons disabled. The student is stuck at the last question (harness: "8 passed · 1 skipped"). Fix: enable the answer buttons for empty-graph builds, or use an input with at least one grid2 land cell (e.g. `grid1=[[0]], grid2=[[1]]` → 0).
- **[MINOR] Q8 repeats Q6 exactly.** Q6 build: `grid1=[[1,1],[1,1]], grid2=[[1,0],[0,1]]` → 2. Q8 concept: "If grid1 is all land and grid2 is [[1,0],[0,1]], how many sub-islands are there?" → 2. The Q7 remedial (`[[1,0],[0,1]]` twice) is the same picture a third time. (Q6 `build-3`, Q8 `bug-trap`)
- **[MINOR] Q7 and Q8 are the Description's Example 1 and Example 2**, whose answers (1, 2) are printed in the Description tab.
- Build keys (1, 0, 2, 0) and remedial keys (0, 2, 0, 2, 1) verified.

#### Step 2
- **[MAJOR] Q3 (`wrong-start`): the student must draw the character's secret start cell "(0,1)" and must not start there.** On-screen bug text is only "Grayson uses the wrong island seed." The grader (visual-library.js line 656–659) rejects any drawing without node (0,1): "Also draw (0,1), the wrong island seed used by the broken search.", and rejects start (0,1). The student only learns this after clicking Check. State it up front: "Grayson always starts at (0,1)."
- **[MINOR] The accepted counterexample can violate the grid's own edge rule.** The harness passed with land at (0,0) and (0,1) and no edge between them — side-adjacent land cells must be joined by the problem's rule. The grader never checks coordinates against adjacency, so an impossible grid passes; conversely a careful student who keeps (0,0)—(0,1) joined must choose a start far from (0,1), which is never hinted. (Q3)
- **[MINOR] "island seed" is jargon** ("CHOOSE THE ISLAND SEED", "Choose island seed"). Use "starting land cell".

#### Step 3
- **[MINOR] Membership claims where the wrong rule gives the same graph.** Q3 (`grid1=[[1,0,1]], grid2=[[1,0,1]]`): "It would be a mistake to use this node rule: “Only positions that are land in both grids.”" keyed YES, but here that rule yields exactly the same nodes. Q5 (`grid1=[[1,0],[0,1]], grid2=[[1,0],[0,1]]`): "It would be a mistake to use this node rule: “Every land cell in grid1.”" — same nodes again. A literal student can defensibly answer No for these inputs. (Q3, Q5)
- Degree and direct-vs-reach claims verified for all 5 inputs.

#### Step 4
- **[MINOR] Distractor refers to a variable `seen` that is not in the shown code.** "The traversal should turn visited grid2 land into water instead of using seen on the shown input." The code uses `visited`. A literal student searches for `seen` and finds nothing. (cases 1–3)
- **[MINOR] Cases 1 and 2 are near-duplicates.** Both: 2×2 all-land grid2, one grid1 water cell at (1,1) (`grid1=[[1,1],[1,0]]` vs `[[1,0],[1,1]]`), same required graph, buggy 1 / correct 0. Case 2 is also identical to Step 1 Q4; case 3 identical to a Step 1 remedial.
- Buggy outputs 1 / 1 / 1 and correct 0 / 0 / 0 verified. Hidden "(r,c)" labels match Step 1.

#### Cross-step / other
- Step 3's "Use this graph model" panel says "Both (0,2) and 0,2 work" while the guide says "Name each cell (row,column)". Harmless but inconsistent.

### Employee Importance (`employee-importance`, new)

#### Step 1
- **[MINOR] Q7 and Q9 are the Description's two examples with answers printed there, and the question text restates every number** ("Employee 1 has importance 5 and direct reports 2 and 3, each worth 3. What total is returned for id 1?"; "Employee 5 has importance -3 and report 6 has importance 2. What total is returned for id 5?"). Answerable without the input or a graph. (Q7 `predict-output`, Q9 `bug-trap`)
- Build keys (15, 20, 45, 1) and remedial keys (30, 22, 15, 20, 45) verified.

#### Step 2
- **[MAJOR] Step 2 rejects id 0, which every other step uses as the root.** Label rule `positive-integer` (`/^[1-9]\d*$/`, visual-library.js line 688) → "Use positive integer IDs, like 1, 3, or 10." All four Step 1 builds, all five Step 3 inputs and Step 4 cases 2/3 use `id: 0`. A student who copies Step 1 (nodes 0, 1, 2) is rejected by a message that never says "0 is not allowed". The "0:1" format is rejected too. Either allow 0 or stop using id 0 elsewhere. (all 3 rounds)
- **[MAJOR] Q3 (`wrong-start`): hidden requirement to draw employee "2" and not to start there.** Bug text: "Stephen ignores the chosen requested employee and uses a different one." Grader: "Also draw 2, the wrong requested employee used by the broken search." / "Choose a requested employee different from the broken search's 2." Only discoverable after Check.
- Q1 (`reverse-arrows`) / Q2 (`shallow-search`): only systemic issues.

#### Step 3
- All 15 claims verified true/false as keyed; degree claims say "outgoing". Fine.

#### Step 4
- **[BLOCKER] Case 1 requires hidden labels "1", "2", "3" while cases 2 and 3 require "0:1"-style labels.** The taught format is `id:importance` ("1:5", "2:3", "3:4"), which fails case 1; the plain-id format then fails cases 2/3. No guide shown. (case `authored-deep-case` vs `case-1`, `case-2`)
- **[MAJOR] Case 3's correct choice describes edges the code never follows.** Input is the chain 0→1→2→3 with `id=0`; the keyed-correct choice reads "The loop follows edge 1→2 but never continues along 2→3, changing this input's returned value." Called with id 0, the code follows 0→1 and never follows 1→2. The success text itself says "the helper stops after 0→1". A literal student may reject the correct choice because "the code never follows 1→2". (Text evidently copied from case 1, whose ids are 1, 2, 3.) (case `case-2`)
- **[MINOR] Distractor "The boss's importance is added before the subordinate loop and should be added afterward in this case." is not a believable bug** — addition order cannot change a sum, and the feedback has to say exactly that. Its internal id `double-boss` describes a different mistake than the text. (cases 1–3)
- Buggy outputs 8 / 6 / 6 and correct 12 / 15 / 20 verified.

#### Cross-step / other
- Id conventions: Description examples use 1–3 and 5–6; Step 1/3 and Step 4 cases 2–3 use 0–4 with "id:importance" labels; Step 2 forbids 0; Step 4 case 1 uses bare 1–3. Four conventions in one lesson.

### Evaluate Boolean Binary Tree (`evaluate-boolean-binary-tree`, new)

#### Step 1
- **[BLOCKER] Q6 answer key is wrong.** Raw input `values=[3,1,2,0,1], edges=[[0,1],[0,2],[2,3],[2,4]]`, question "What does the root evaluate to?". Node 2 is OR with children 3=false and 4=true → true; root is AND with children 1=true and 2=true → **true**. The key marks `false` correct and tells a student who picks `true`: "This accepts one true child at an AND node instead of requiring both children." The hidden required graph (`0:AND→1:true, 0:AND→2:OR, 2:OR→3:false, 2:OR→4:true`) confirms the reading. Verified with node. Fix in `scripts/author-new-final-six.js` line 27 (`{v:[3,1,2,0,1],…,a:false}`): either set `a:true` or change values to `[3,1,2,0,0]` so the OR subtree is false; regenerate `visual-lessons-new.json` / `visual-data.js`. (S1 Q6 / `case-4`)
- **[MINOR] P1: missing-node picture gives itself away.** Choices are displayed as "Picture B / 0:OR / 1:true / 2:false … Picture D / 0:OR / 1:true". Picture D lists two names while the others list three, so the `missing-node` distractor can be eliminated without looking at any picture. Same in all six other problems in this batch (farmland/flood-fill/gfg Picture B; flooded/gas/gold Picture D). Fix: do not print node names under the picture label, or print the same count for every picture. (S1 Q3)
- **[MINOR] Two unexplained input notations.** Builds use `values=[2,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)`; the Description and Q8/Q9 use `root = {val: 2, left: {val: 1}, …}`. Nothing says that `edges [0,1]` means "node 0's child is node 1", that the first listed child is `left`, or that the array index is the `levelOrderIndex` required by the node-name guide. (S1 Q1, Q2, Q4, Q6, Q8)
- **[MINOR] "Why" text explains nothing.** After every build the same sentence appears: "Evaluating children before their parent makes the root true." (or "…false."). It never says which gate/leaf produced the result. (S1 all builds)

#### Step 2
- **[MAJOR] "CHOOSE THE ROOT GATE" cannot be chosen and there are no gates.** The start field is read-only "root" under a label that says CHOOSE; nodes in Step 2 carry no value (no AND/OR/true/false), so the boolean problem is absent. "CORRECT OUTPUT" must be the reached position list `["L","R","root"]`, while the problem returns a boolean — a student who types `true` gets no hint. Also the taught Step 1 names `0:OR`/`1:true` are rejected here with "Use root, L, R, LL, LR, ... to name tree positions." (already listed in SYSTEMIC-NOTES). (S2 Q1–Q3)
- **[MAJOR] P4: Khloe's graph must be identical to the correct graph.** Grader: "character's graph must be exactly: … edges: root→L, root→R, L→LL, L→LR, R→RL, R→RR" (same as drawing 1). The prompt says "then Khloe's graph using the mistake", so a literal student draws only the last branches (root→R, R→RR) and fails. Fix: for search-order bugs say "Draw the same graph again; the mistake is in how Khloe walks it", or auto-copy drawing 1. (S2 Q2 `last-branch`)
- **[MINOR] Validation message uses an undefined notion.** Drawing 1 rejects a node with one child: "A Boolean operator node needs both a left and a right child." Nothing tells the student that any node with a child counts as an operator, and Trenton's drawing 2 (`root→L` only) is accepted. (S2 Q2, Q3)

#### Step 3
- **[MINOR] "Wrong" node rule produces the required graph on one-leaf inputs.** Q1 (`values=[0]`) variant 1: "Use this node rule for the graph: “Only leaves containing 0 or 1.”" keyed NO; Q5 (`values=[1]`): "It would be a mistake to use this node rule: “Only leaves containing 0 or 1.”" keyed YES. For these inputs that rule yields exactly the required one-node graph (`0:false` / `0:true`), so a student who tests the rule against the shown input is marked wrong. Fix: only quote rules that actually change the graph for the mini-input. (S3 Q1, Q5)
- **[MINOR] P5: wrong-answer feedback starts with "Correct."** Q2 claim "0:OR and 2:false are directly connected…" → shown after a wrong answer under ×: "Correct. The mini-example lists 0:OR→2:false as one direct edge." Same in Q3 and Q5 ("Correct. A zero-step path…"). (S3 Q2, Q3, Q5)

#### Step 4
- **[BLOCKER] Case 1 requires node names "AND", "true", "false"; cases 2–3 require "0:AND", "1:true", "2:false".** No node-name guide is shown in Step 4. Step 1/3 taught `levelOrderIndex:value` (e.g. `0:AND`). A student using the taught names fails case 1 with only "The drawing has every exact node ×"; a student who then drops the index fails case 2. Fix: relabel case 1's canvas to `0:AND`, `1:true`, `2:false`. (S4 case 1 `authored-deep-case`)
- **[MAJOR] P2: one bug, one code listing, one diagnosis set for all three cases.** All three show the same `evaluateTree` with `return left || right;` as the fallback and the same three sentences (shuffled). After case 1, cases 2 and 3 ("values=[3,1,0]" = S1 Q2's input, "values=[3,0,2,1,1]") are solved by picking the sentence containing "left || right". Fix: give cases 2/3 a different bug (leaf inversion, short-circuit, wrong base case). (S4 cases 2–3)
- **[MINOR] P3: feedback reveals the diagnosis.** After a wrong diagnosis the panel prints "Code rule: Every internal node returns the OR of its child results." — the correct answer in plain words — before the retry. (S4 all cases)
- **[MINOR] Case 1 input in object form, cases 2–3 in `values=`/`edges=` form** with no bridge between them. (S4)

#### Cross-step / other
- **[MAJOR] Four naming schemes in one lesson.** Step 1/3: `0:OR`; Step 2: `root`, `L`, `R`; Step 4 case 1: `AND`, `true`; Step 4 cases 2–3: `0:AND`. Only Step 1/3 show a guide.

### Fence Planning (`usaco-fence-planning`, new)

#### Step 1
- **[MAJOR] "Pick the smaller number" is right in every build and remedial.** Choices shown: Q1 `2 | 6` → 2; Q3 `12 | 10` → 10; Q6 `2 | 4` → 2; Q8 `4 | 2` → 2; remedials `14 | 16` → 14, `6 | 4` → 4, `10 | 12` → 10, `22 | 20` → 20, `12 | 14` → 12. Concept Q7 too (`10 / 16 / 8 / 6` → 6 is the smallest). Only Q9 breaks the pattern. A struggling student learns "click the smaller one" and never computes a perimeter. Fix: add distractors that are smaller than the answer (forgot the ×2 → half perimeter; zero-height → 0; other herd's perimeter when it is larger). (case-1, case-2, case-3, case-4, all remedials)
- **[MAJOR] Q8 tests nothing new.** Facet is "minimum herd perimeter" but the input `cows=[[5,7],[5,8]], friendships=[[0,1]]` has one herd, so there is no minimum to take. It is the same shape as Q6 (`cows=[[0,0],[1,0]]`): two cows, one edge, answer 2, distractor 4 with the same "padding" misconception. Fix: give Q8 two herds with different perimeters. (case-4)
- **[MINOR] Input variable names differ from the problem statement.** Description and signature use `positions` / `pairs`; every Step 1 and Step 3 raw input says `cows=` / `friendships=`; Q7/Q9 show a bare call `minFencePerimeter([...],[...])`. A literal student looking for "friendships" in the statement will not find it. Fix: use `positions=` / `pairs=` everywhere. (all builds)
- **[MINOR] Q4 raw-input box contains the question** "What belongs at each plotted node?" above a drawing tool titled "Optional: draw this input before answering" (systemic instance); "plotted node" is jargon. (node-rule)

#### Step 2
- **[MAJOR] "Correct output" wants a list of cow IDs, but this lesson has only ever asked for a perimeter.** The student has answered "What minimum fence perimeter is returned?" nine times; now the field "CORRECT OUTPUT" with no hint expects `[0,1]`. Worse, Step 2 nodes are bare numbers with no coordinates, so a perimeter cannot even be computed here. Typing `2` or `10` is rejected with no explanation. Fix: label the box "Cows the search reaches, e.g. [0,1]". (Q1–Q3)
- **[MAJOR] "CHOOSE THE CHOSEN COW / chosen cow" describes something the real problem does not have.** `minFencePerimeter` loops over every cow; there is no start cow, so Christina's bug "uses the wrong chosen cow" cannot change the fence in the real problem, and the label is circular. The authored goal "Make two herds so starting at the wrong cow changes the fence" is hidden and no fence is computed. Fix: rename to "start cow" and explain in one line that Step 2 only compares which cows a search visits. (Q2)
- **[MAJOR] Node names flip-flop: Step 1 drilled `0:(0,0)`, Step 2 rejects it, Step 4 secretly requires it again.** Submitting `0:(0,0)` … `4:(9,8)` in Step 2 gives "Use numeric IDs 0, 1, 2, ... with no gaps." Then Step 4 (no guide shown) requires exactly `"0:(0,0)","1:(3,2)"` (case 1), `"0:(0,0)","1:(2,0)","2:(2,1)","3:(8,8)","4:(9,8)"` (case 2), `"0:(1,1)","1:(4,1)","2:(4,3)"` (case 3). A student who just learned to type `0`, `1` in Step 2 fails Step 4's "The drawing has every exact node ×" with no hint. Fix: show the node-name guide in Steps 2 and 4, or accept bare IDs in Step 4. (Q1 / S4 all cases)
- **[MINOR] Landen (make-one-way) depends on click order.** Harness drew the edge 1→0 (clicked 1 first) with start 0 so Landen reaches `[0]`. A student who clicks 0 first gets arrow 0→1, Landen reaches `[0,1]`, nothing is exposed, and no message says why. (systemic instance) (Q1)

#### Step 3
- **[MAJOR] Membership claim polarity flips.** Q1/Q4: "It would be a mistake to use this node rule: “One mooing pair.”" → YES. Q2/Q3/Q5: "Use this node rule for the graph: “One whole herd.”" → NO. A student who learns "the node-rule line is No" in Q2 gets Q4 wrong. Fix: use one phrasing throughout, as a statement ("Each node should be one whole herd." → No).
- **[MAJOR] Wrong-answer feedback starts with "Correct."/"Right."** Q1 (all three variants), after answering No to "0:(2,5) and 1:(7,5) are directly connected…", the × line reads "Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge." Q4 direct-vs-reach: "Right. A multi-step route through 0:(0,0) creates reachability, not a new direct edge." Fix: strip the leading verdict word in wrong-answer feedback.
- **[MINOR] Q1 (2 nodes, 1 edge) is trivial and repeats itself.** All three variants use the identical claim "0:(2,5) and 1:(7,5) are directly connected, not merely reachable through a longer route." and a degree-1 claim; there is nothing to reason about.
- **[MINOR] Q3 writes edges backwards vs the input.** Claim: "The correct graph has 2:(4,0)—1:(2,2) and 1:(2,2)—3:(2,1)…" while the input lists `[1,2],[1,3]`. (systemic instance)
- Step 3 raw inputs are the five Step 1 remedial inputs; labels match the shown guide — fine.

#### Step 4
- **[MAJOR] All three cases are the same case.** Same bug ("Fence side lengths are not doubled"), same code, same three diagnosis sentences (only the letters move: correct is B, C, then A). After case 1 the student knows the answer; cases 2–3 reuse Step 1 Q1/Q3 inputs whose correct perimeters (2 and 10) were already shown. CLAUDE.md asks for one deep problem-specific case; the other two test nothing. Fix: give cases 2–3 different bugs (e.g. padding, max instead of min) or drop them. (case-1, case-2)
- **[MAJOR] Cases 2–3 label the input `cows=` / `friendships=` but the code's parameters are `positions, pairs`.** Case 1 correctly shows `positions:` / `pairs:`. A literal student cannot see how `friendships` becomes `pairs`. (case-1, case-2)
- **[MINOR] Diagnosis choices mix three framings.** A is a proposed fix ("The code should choose the largest herd box rather than the smallest."), B describes the bug, C states a false requirement. A is not a description of anything the code does, so it reads as nonsense rather than a believable mistake. (all cases)
- **[MINOR] "The helper returns 5"** (case 1 proof chain) — there is no helper; the function itself returns 5.
- **[MINOR] Wrong-diagnosis checklist line "✓ The incorrect solution's exact output is correct"** — double negative; reads as if the output were wrong. (likely systemic)

#### Cross-step / other
- Node-label format is taught (Step 1/3) → rejected (Step 2) → silently required (Step 4); see Step 2 above.
- Wording "cows/friendships" (Steps 1, 3, 4 cases 2–3) vs "positions/pairs" (Description, code, Step 4 case 1) is inconsistent across the whole lesson.

---

### Find All Groups of Farmland (`find-all-groups-of-farmland`, new)

#### Step 1
- **[BLOCKER] Q9 cannot be completed.** Input `land=[[0]]`, question "What should the function return?" with choices `[]` / `[[0,0,0,0]]`. The required graph has ZERO nodes and "answer buttons were disabled until a node was drawn", so the student can only unlock the buttons by drawing a wrong node. Harness: "FAILED / DEAD END". The completion screen then says "FINISHED / Step 1 finished. / 8 passed · 1 skipped." and the strip reads "8 OF 9 VISUAL CHECKS PASSED". Fix: enable the buttons when the required graph is empty, or replace the input (e.g. `land=[[0,1]]`). (S1 Q9 / `build-4`)
- **[MINOR] Q8 repeats Q1.** `land = [[1,1],[1,1]]` with correct `[[0,0,1,1]]` and the same distractor `[[0,0,0,1],[1,0,1,1]]` (split by row) was already Q1; the same grid is also Q2's picture and Step 4 case 1. (S1 Q8 `bug-trap`)
- **[MINOR] "Which picture exactly matches this fresh input?"** — Q2's input is Q1's input, not fresh. Same wording in flood-fill Q3 and gfg Q3. (S1 Q2)
- P1 applies (Picture B lists three names, the others four). (S1 Q2)

#### Step 2
- **[MAJOR] Output field contradicts nine Step 1 questions.** Step 1 asked "What should the function return?" nine times with rectangle answers like `[[0,0,0,1],[1,2,1,2]]`. Here "CORRECT OUTPUT" must be the reached-cell list `["(0,0)","(0,1)","(0,2)"]`; rectangles, `(0,0), (0,1)` and `[(0,0),(0,1)]` are all rejected with no hint. Fix: label the field "Cells the search reaches" and show one example. (S2 Q1–Q3)
- **[MAJOR] P4: Bianca's graph must be identical to the correct graph.** Grader: "character's graph must be exactly: … edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)" (same as drawing 1) although the prompt says "then Bianca's graph using the mistake". (S2 Q2 `last-branch`)
- **[MINOR] "plot seed" is a term used nowhere else**, and nothing enforces the problem's guarantee that groups are rectangles (the harness's L-shaped plot was accepted). (S2 all)

#### Step 3
- **[MAJOR] Claim asserts a false premise.** Q5 `land=[[1,0,1]]` (two isolated nodes): "(0,0) can reach (0,2), so the graph should contain a direct edge between them." (0,0) cannot reach (0,2) at all. NO is keyed correct, but the wrong-answer feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2)." leaves the false premise standing. Fix: use the template used in gfg Q5: "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable." (S3 Q5)
- **[MINOR] Wrong rule gives the right graph.** Q2 `land=[[1]]`: "Use this node rule for the graph: “Every forest and farmland cell.”" keyed NO, but with no forest cell that rule yields exactly the required graph `(0,0)`. (S3 Q2)
- **[MINOR] Guide contradiction on failure.** After a wrong graph, "Use this graph model … LABELS: Both (0,2) and 0,2 work." appears under a guide that says "Name each cell (row,column) … Do not add spaces". Only shown after failing. (S3 Q1)
- P5 applies: Q1 "Correct. The mini-example lists (0,0)—(0,1) as one direct edge." shown under ×. (S3 Q1, Q4)

#### Step 4
- **[MAJOR] P2: one bug for all three cases.** All three show the same `findFarmland` with `answer.push([row, column, bottom + 1, right + 1])` and the same three sentences; cases 2 and 3 are Step 1's Q4 and Q6 grids. (S4 cases 2–3)
- **[MINOR] The shown code contains no DFS or graph.** It is a double loop with two `while` scans, so the graph the student must draw plays no part in the code; the distractor "The boundary scans stop at the first row or column and miss farmland deeper in the rectangle" (id `missing-dfs`) refers to a search that isn't there. (S4 all cases)
- P3 applies ("Code rule: It finds the correct component bounds, then increments both final indexes."). Buggy outputs `[[0,0,2,2]]`, `[[0,0,1,1],[1,1,2,2]]`, `[[0,0,1,2],[1,2,2,3]]` verified with node.

#### Cross-step / other
- `land=[[1,1],[1,1]]` appears four times (S1 Q1, Q2, Q8; S4 case 1).

### Flood Fill (`flood-fill`, new)

#### Step 1
- All nine keys and five remedial keys are correct.
- **[MINOR] "fresh input" wording** — Q3's input is Q1's. (S1 Q3)
- P1 applies (Picture B lists two names). (S1 Q3)

#### Step 2
- **[MAJOR] Output field contradicts Step 1.** Step 1 drilled "What should the function return?" with image matrices (`[[2,2],[2,0]]`); here "CORRECT OUTPUT" must be `["(0,0)"]` (reached pixels). No hint. (S2 Q1–Q3)
- **[MINOR] Hidden wrong start "(0,1)".** "Josephine runs the search from a different starting pixel." The student's graph must contain a node named exactly `(0,1)` or Josephine has nowhere to start; if the student picks `(0,1)` as their own start no counterexample is possible. Only revealed in Drawing 2's title. (S2 Q2)

#### Step 3
- **[MAJOR] Claim asserts a false premise.** Q3 `image=[[1,2,1]], sr=0, sc=0` (nodes (0,0),(0,2), no edges): "(0,0) can reach (0,2), so the graph should contain a direct edge between them." — (0,0) cannot reach (0,2). Feedback never corrects the premise. (S3 Q3)
- **[MINOR] Wrong rule gives the right graph.** Q5 `image=[[1,1],[1,1]]`: "It would be a mistake to use this node rule: “Every pixel in the image.”" keyed YES, but every pixel IS start-colour here, so that rule yields exactly the required four-node graph. (S3 Q5)
- P5 applies (Q2 "Right. A multi-step route…" under ×).

#### Step 4
- **[MAJOR] P2: "Paint spreads across corners" in all three cases.** Same eight-offset `floodFill` each time; the correct sentence always contains "diagonal"/"corner". (S4 cases 2–3)
- **[MINOR] Self-refuting distractor.** Case 3: "The start row and column are swapped, so fill begins at (0,0) by accident." — sr and sc are both 0, so swapping changes nothing; the feedback admits it ("both happen to be 0 here anyway"). (S4 case 3)
- P3 applies. Buggy outputs `[[2,0],[0,2]]`, `[[2,0,0],[0,2,0],[0,0,2]]`, `[[2,2,0],[0,0,2],[0,0,2]]` verified by hand.

#### Cross-step / other
- None beyond the above.

### Getting Gold (`kattis-getting-gold`, new)

#### Step 1
- **[MAJOR] Q1 and Q2 (the first two screens) require a graph model the lesson has not taught yet and the Description never states.** Hidden Q1 graph: 9 nodes including the trap cell "(3,3)" as an isolated node, DIRECTED, 16 arrows, with draft squares (2,3) and (3,2) having incoming but no outgoing arrows. The Description says "She can't see traps" and never mentions traps being nodes or arrows being one-way; the node rule ("Every non-wall square: floor, start, gold, and trap") is only revealed as the answer to Q5 and the edge rule only at Q7, both after the builds. On failure Step 1 says only "Not exact yet. Recheck the problem and input. The correct model stays hidden." with × marks. A literal student will draw 8 floor cells with two-way lines and has no way to discover "trap is a node" or "draft square = no outgoing arrow" except by guessing. Move the node-rule/edge-rule concept questions before the first build, or show the graph model for this problem in Step 1.
- **[MAJOR] Drawing burden is extreme for a first question.** Q1 needs 9 nodes and 16 directed arrows drawn exactly (8 two-way pairs each drawn as two arrows); the predict-output remedial and bug-trap remedial also need 16 arrows; Step 3 Q4 and Q5 need 16 arrows; Step 4 cases 2–3 need 9 nodes + 8 arrows. A struggling student will spend most of the lesson clicking arrows. Consider 2×2/1×3 interiors for builds.
- **[MINOR] Q3 exact-picture is a visual needle-in-haystack.** Picture C differs from the correct Picture A only by one arrow reversed among 16: (2,3)→(1,3) instead of (1,3)→(2,3). Picture B drops only (3,1)→(3,2). Spotting one arrowhead among 16 in a small picture is not a concept test.
- **[MINOR] Q8/Q9 are Description Examples 1/2 with answers printed ("output 1", "output 4"), and their prompts say "In the first shown dungeon" / "In the second shown dungeon" although only one dungeon is on screen.**
- **[MINOR] Two different wordings of the node rule.** Q5's correct choice reads "Every non-wall square: floor, start, gold, and trap." but every Step 3 feedback says "Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges." (from the `kattis-getting-gold` override in visual-library.js ~line 1281). Pick one.

#### Step 2
- **[MINOR] Three hidden requirements surface only as errors after "Check my graph".** (1) Must switch on the "Directed edges" toggle → otherwise "Turn on directed arrows."; (2) labels must be interior coordinates → "This board has a wall border. Use interior coordinates starting at (1,1)." (placeholder "Example: (1,1)" is the only hint); (3) reusing Step 1's 9-node graph → "Draw 1–8 nodes." None of this is on the screen text.
- **[MINOR] Q3 Alexia "uses the wrong player square" — the square (1,2) is shown only in Drawing 2's title.** The student must draw (1,2) in the correct graph too, and learns that only from the error "Also draw (1,2), the wrong player square used by the broken search."

#### Step 3
- **[MINOR] Q1 v1 claim "(1,3) and (1,2) are directly connected, not merely reachable through a longer route." on a directed graph where only (1,3)→(1,2) exists ((1,2) is a draft square with no outgoing arrow).** "Directly connected" is undefined for one-way arrows; a student who reasons "(1,2) cannot go to (1,3)" answers NO and is marked wrong with feedback that begins "Correct. The mini-example lists (1,3)→(1,2) as one direct edge." (shown under ×). Same pattern in v2 "(1,3) and (2,3) are directly connected".
- Other claims (degree/out-degree, shortcut claims) are correctly keyed.

#### Step 4
- **[MINOR] The trap cell must be drawn as an isolated node with no guide.** Hidden graphs list "(2,2)" (trap) as a required node in all three cases; a student who omits it fails "The drawing has every exact node" with no hint. The Step 3 "Use this graph model" hint is not shown in Step 4.
- **[MINOR] Cases 2 and 3 repeat case 1's code and its exact correct-choice text** "At (1,2) the code keeps exploring even though trap (2,2) is adjacent." Case 2's input is Step 1 Q2; case 3's is Step 1's exact-picture remedial and Step 3 Q1. Case 1 labels the input `grid: [...]`, cases 2–3 `dungeon=[...]`, while the signature is `collectSafeGold(grid)`.
- Declared buggy outputs 1/1/2 verified; correct outputs 0/0/0 verified against the rules.

#### Cross-step / other
- Description variable is `grid`; Step 1/3 raw inputs say `dungeon=`. Minor naming drift.

### Ladder Takahashi (`ladder-takahashi`, new)

#### Step 1
- **[MAJOR] Q7 is the same question as Q1.** Q1 (build) shows `ladders=[[1,4],[4,3],[4,10],[8,3]]`, "What highest floor is reachable from floor 1?" → 10. Q7 (concept) shows the same input and asks "From floor 1 with ladders [[1,4],[4,3],[4,10],[8,3]], what highest floor is reachable?" → 10. Both are Description Example 1 with "output 10" printed. Q9 is Description Example 2 with "output 1" printed. Three of nine checks test nothing new.
- Remaining builds verified: Q3 → 9, Q6 `[[7,20]]` → 1 (graph must include isolated node "1"), Q8 `[[2,3]]` → 1; remedials 2, 8, 9, 3, 1.

#### Step 2
- **[MAJOR] Q2 (Dalton, "allows each two-way link to work only in its written order") can only be exposed by drawing the ladder backwards, and nothing says so.** The grader turns each edge into an arrow from the first-clicked node to the second. The harness had to draw `2—1` (click 2, then 1) so Dalton's graph became `2→1` and his output `[1]`. A student who draws the natural `1—2` gets Dalton `1→2`, output `[1,2]` = correct output, and no counterexample, with no hint that click order is "written order". Q3 (Elise, last-branch) likewise depends on the order edges were drawn; the harness drew 1—2 before 1—3 so the "last" branch was 3.
- **[MINOR] Field label "CHOOSE THE FLOOR 1 / floor 1" is read-only and reads as a grammatical slip.** Suggest "Start floor: 1".

#### Step 3
- **[MINOR] Q1 writes the ladder `[8,3]` as "3—8" ("The correct graph has 4—3 and 3—8, so it should also contain a direct 4—8 edge.");** Q3 wrong-answer feedback for "6 and 10 are directly connected" begins "Correct. The mini-example lists 6—10…". Keys otherwise verified (Q4 requires the isolated node "1": "1 has exactly 1 direct neighbor" → NO).

#### Step 4
- **[BLOCKER] Case 1: the keyed-correct diagnosis describes a ladder that is not in the input, and the distractor is literally true.** Input `ladders: [[4, 1], [4, 10]]`. Keyed-correct choice B: "The pair [8,3] is stored only as 8→3, so the code cannot continue from floor 3 to floor 8." — there is no `[8,3]`, no floor 3 and no floor 8 in this case. Distractor A: "Floor 1 is absent from the map because it never appears as a first endpoint on the shown input." — this is exactly true here (`next` has keys 4 only, `next.get(1)` is undefined, so the loop body never runs) and is graded wrong with feedback "The seen set correctly creates floor 1; its reverse ladder edge is missing." A careful student cannot pass this on merit.
- **[BLOCKER] Case 2: no displayed choice is true.** Input `ladders=[[1,4],[4,3],[8,3]]`. Keyed-correct choice C: "The pair [4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible in the code." — the input pair is `[1,4]`, and the code does climb 1→4 (that is why the buggy output is 4). The true diagnosis is case 1's text about `[8,3]`. The two correct-choice labels are swapped between cases 1 and 2 (`step4-specs-new.json` lines 2661 and 2731). Swap them back.
- **[MINOR] Feedback refers to a "seen set" ("The seen set correctly creates floor 1…", "Math.max sees only floors in seen…") but the code's set is `visited`.** Case 3 distractor "Math.max ignores floor 12 because it is larger than the number of ladders." is not a believable mistake. Input format "ladders: [[4, 1], [4, 10]]" (case 1, 3) vs "ladders=[[1,4],[4,3],[8,3]]" (case 2).
- Case 3 (`[[1,5],[9,5],[9,12]]` → 5, correct 12, choice A) is correct.

#### Cross-step / other
- Node labels are plain floor numbers in every step (consistent); Step 2 output `[1,2,3]` uses unquoted numbers, matching.

### Largest Component (`structy-largest-component`, new)

#### Step 1
- **[MAJOR] No build ever has more than one component, and the wrong choice is always "count − 1".** Q1 `{"0":[1,2],"1":[0,3],"2":[0,4],"3":[1],"4":[2]}` → 5 vs 4; Q4 → 4 vs 3; Q6 → 5 vs 4; Q9 `{"0":[]}` → 1 vs 0; all five remedials → 5/4, 4/3, 5/4, 4/3, 5/4. "Largest component" is never exercised in a build, and "pick the bigger number" is always right. Fix: include a two-component input (e.g. the Description's Example 1) as a build.
- **[MINOR] Guide vs data mismatch.** Guide: "Use the exact object key from graph only. Example: 2." with a digits-only pattern, while the Description and Step 4 use keys `a`–`h`; Step 1 inputs mix quoted keys with unquoted neighbors (`"0":[1,2]`).
- **[MINOR] Q7 and Q8 are Description Examples 1 and 2 verbatim** (answers 3 and 2 printed there).

#### Step 2
- **[MAJOR] Q1 "Chelsea keeps the middle of the graph but disconnects every leaf."** "Leaf" is never defined for a general graph in this lesson. On the harness's path A—B—C both ends are leaves, so Chelsea's graph must have zero edges and, because the seed A is itself a leaf, her output is `["A"]`. A student cannot predict that from the sentence. Fix: "Chelsea deletes every edge that touches a node with only one connection."
- **[MINOR] "CHOOSE THE COMPONENT SEED / component seed"** — the problem has no seed or start; the term is unexplained. Output is a node list (`["A","B","C"]`) though the problem returns a size.

#### Step 3
- Claims and keys correct; only the systemic same-answer pattern applies (Q1, Q2, Q4, Q5 all-Yes, Q3 all-No).

#### Step 4
- **[MINOR] Distractors are absurd, so the answer is obvious.** Case 2: "The isolated node e is accidentally counted as four nodes because its list is empty." / "String keys make b and d compare equal in the seen set." Case 3: "The isolated node h should be excluded from Object.keys and from all counts." (a "should", not a bug). Case 1 feedback refers to `seen` but the code's set is `visited`, and calls the function "The helper".
- **[MAJOR] Same bug ×3** ("components … returned instead of the maximum…"). Buggy outputs 2, 2, 3 verified; hidden labels `a`–`h` match the shown keys (though Step 1's guide said digits only).

#### Cross-step / other
- Step 1 never shows a multi-component build; Step 4 is the first time the student must handle one while also predicting a buggy value.

---

### Max Area of Island (`max-area-of-island`, new)

#### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** `grid=[[0]]`, hidden graph has zero nodes, answer buttons stay disabled until a node is drawn; harness result "FAILED / DEAD END", completion "8 passed · 1 skipped". Same fix as connected-cells.
- **[MINOR] Q7 and Q9 are Description Examples 1/2 with the answers printed ("output 5", "output 0").** Q9 additionally shows "Optional: draw this input before answering" for `[[0,0],[0,0]]`, which has nothing to draw.
- Builds verified: 3, 1, 4; remedials 3, 1, 4, 2, 3.

#### Step 2
- No problem-specific issues beyond the systemic ones (jargon "island seed"; last-branch depends on drawing order; add-diagonals needs two corner-touching cells with no edge in Drawing 1).

#### Step 3
- **[MINOR] Q1 wrong-answer feedback displayed under × begins "Correct."** Shown text after answering all wrong: "× Correct. The mini-example lists (0,0)—(0,1) as one direct edge." (all three Q1 variants). Keys verified for Q1–Q5.

#### Step 4
- **[MAJOR] Keyed-correct diagnosis and distractors name variables that do not exist in the shown code.** Cases 1–2 correct choice: "Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells." — the code uses `rowChange`/`columnChange`, never `dr`/`dc`. Distractors: "The same seen set should be cleared…", "best should add every island area…", case 3 "seen is shared across island searches", feedback "A global seen set is correct…", "best uses Math.max…" — the code has `visited` and `largestValue`. Rename to the code's identifiers.
- **[MINOR] Three identical functions/bugs; case 2's input `[[1,1,0],[0,0,1]]` is Step 1's predict-output remedial and Step 3 Q1; case 1's `[[1,0],[0,1]]` is Step 1 Q2.** Input shown as `grid: [[1, 0], [0, 1]]` (cases 1, 3) vs `grid=[[1,1,0],[0,0,1]]` (case 2).

#### Cross-step / other
- Fine.

### Max Root-to-Leaf Path Sum (`structy-max-root-to-leaf-path-sum`, new)

#### Step 1
- **[MAJOR] "levelOrderIndex" never says it counts the `null` slots.** Q1 shows `root level-order=[3,11,4,4,-2,null,1]` and the guide "Name each tree node node levelOrderIndex: value. Example: node 2: -3." The grader requires `node 6: 1`. A student who numbers only the nodes that exist (0..5) writes `node 5: 1` and only sees "Every exact node is drawn ×". Same trap in remedial/S3 Q5 `[2,3,null,4]` → required `node 3: 4`. Fix: guide text "the index is the position in the level-order list, counting null slots" plus an example containing a null. (Q1 `build-1`, S3 Q5, remedial after `predict-output`)
- **[MAJOR] The `root level-order=[...]` notation is never explained.** The Description only ever shows `{ val, left, right }` objects and ASCII trees; the very first screen (Q1) uses an array with `null` and expects the student to know heap-style placement. Fix: one sentence in the Description or above Q1 explaining the array form. (Q1, Q2, Q4, Q6)
- **[MINOR] Answers copied from the Description.** Q1 and Q8 use Description Example 1 (output 18 with the path listed); Q2 and Q9 use Example 2 (output 12 with the paths listed). Fix: different numbers. (Q1, Q2, Q8, Q9)
- **[MINOR] Remedial "Why" contradicts a valid path.** Remedial after `bug-trap` (`[4,2,6,1,9,5,3]`) says "The best path is 4→2→9, not necessarily through child 6." but 4→6→5 also sums to 15. A student who found 4→6→5 is told it is not the best. Fix: "4→2→9 and 4→6→5 both give 15".
- **[MINOR] Unclear distractor feedback.** Q8 choice 12: "The function returns the maximum, not the middle branch." — "middle branch" is not a thing in the picture (12 is path 3→11→-2). Fix: "12 is the path 3→11→-2; 3→11→4 is bigger."

#### Step 2
- **[BLOCKER] Q2 bug text tells the student to do the wrong thing.** Screen: "Clayton erases the outer leaves before searching." The grader requires Clayton's drawing to be exactly "nodes: L, R, root · edges: none" — leaves kept, only the arrows to them removed. A student who literally erases leaf nodes L and R in Drawing 2 fails "Every exact node is drawn" with no hint. Fix: "Clayton drops every arrow that points to a leaf (the leaf nodes stay)." (S2 Q2 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `maxPathSum` returns a number; the field wants a sorted JSON list of tree positions such as `["L","R","RL","root"]`, and node values play no role at all in Step 2. Nothing on screen says this; a student will type `18`. Fix: label the fields "Nodes the correct search visits" / "Nodes Zion visits" with an example. (S2 Q1–Q3)
- **[MINOR] Q1 "Zion chooses the final listed route and never returns."** A tree has no "listing"; the grader means the last-drawn child arrow at every node, never backtracking. Fix: "At every node Zion follows only the child arrow you drew last, and never goes back." (S2 Q1 `last-branch`)

#### Step 3
- **[MINOR] Membership claim untestable on its input.** Q1 variant 2: input `[4,2,6,1,9,5,3]` has only positive values, yet "It would be a mistake to use this node rule: 'Only nodes with positive values.'" is keyed YES. On this input that rule yields the identical graph, so NO is defensible. Fix: pair this rule with an input containing a negative (e.g. `[5,4,4,-10,8]`). (S3 Q1 v2)
- **[MINOR] Wrong-answer feedback starts with "Right."/"Correct."** Q1 v0/v1 and Q2 show "× Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge." and Q4 shows "× Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge." under an × for the student's wrong answer. Fix: drop the leading "Right."/"Correct." from direct-vs-reach feedback. (S3 Q1, Q2, Q4)

#### Step 4
- **[BLOCKER] Hidden node labels change format between cases, no guide shown.** Case 1 requires `5`, `-10`, `-20`; case 3 requires `10`, `-2`, `-3`, `-30`; but case 2 requires `node 0: -5`, `node 1: -2`, `node 2: -8` (the Step 1 format). A student who learns bare values from case 1 fails case 2 and vice versa, seeing only "The drawing has every exact node ×". Fix: use one format for all three and show the guide. (S4 cases 1–3)
- **[MINOR] Same code, same three diagnosis sentences three times.** Cases 1 and 2 show the identical snippet and identical choices (reordered); case 3 rewords them. After case 1 the "Math.max includes a synthetic 0" answer is a giveaway. (S4 cases 2–3)
- **[MINOR] Nonsense distractor.** Case 3 choice A "The null base case should return 10 because the root value must be counted twice." is not a believable student mistake. (S4 case 3)
- **[MINOR] "Changed graph" describes the unchanged graph.** Case 1: "Code rule: Every node may choose a synthetic zero branch… → Changed graph: The root has two outgoing child edges, so legal paths end at -10 or -20." The second sentence is the correct graph, not what the code changed. (S4 case 1, case 3)

#### Cross-step / other
- **[MAJOR] Four label formats for one problem.** Step 1/3 `node 0: 3`; Step 2 `root`/`L`/`R` (Step 1 names rejected with "Use root, L, R, LL, LR, ... to name tree positions." only after Check); Step 4 bare `5` (cases 1, 3) and `node 0: -5` (case 2).

### Maximum Number of Fish in a Grid (`maximum-number-of-fish-in-a-grid`, new)

#### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** `grid=[[0]]`, zero-node hidden graph, buttons disabled until a node is drawn; "8 passed · 1 skipped".
- **[MINOR] Q7 and Q9 are Description Examples 1/2 with answers printed ("output 7", "output 1").**
- Builds verified: 6, 3, 10; remedials 5, 4, 7, 2, 6.

#### Step 2
- **[MINOR] Q1 "Tucker runs the search from a different fishing start" does not fit this problem.** The Description says the fisher "chooses any water cell to start from" and the answer is the best over all starts, so "wrong start" is not a bug in this problem, and "CORRECT OUTPUT ["(0,0)"]" (cells reached from the chosen start) is not the problem's output (a fish total). Tucker's start (0,1) appears only in Drawing 2's title / the error "Also draw (0,1)…".

#### Step 3
- **[MINOR] Q1 wrong-answer feedback under × begins "Correct."** ("× Correct. The mini-example lists (0,2)—(1,2) as one direct edge.", shown in the transcript's all-wrong feedback for variants 0 and 1). Keys verified.

#### Step 4
- **[MINOR] Choice/feedback identifiers differ from the code.** Correct choice "total += 1 measures component area instead of adding grid[r][c] fish at each node." (code indexes `grid[row][column]`); distractor "Using one seen set…" (code: `visited`). Case 3's graph proof writes nodes as "(0,0)=2 and (1,1)=3" — a label format the Step 1 guide forbids ("Do not add … the cell value") and the grader would reject.
- **[MINOR] The drawing cannot express the thing the bug is about.** Required graphs are unweighted coordinate nodes ("(0,0)", "(0,1)"), so the graph a student draws is identical whether they think in cells or in fish; the "graph" step does not help diagnose "Water cells are counted instead of fish". Cases 2–3 reuse Step 1 Q1/Q3 inputs; identical code in all three cases; distractor "The fisher must start on the cell containing 3, so the 2 cell cannot be visited" is not a believable mistake.

#### Cross-step / other
- Node rule says nodes are "weighted by its fish count" while the label guide says never to write the value; the weight has no place in the drawing tool. Consider stating "weights are not drawn".

### Milk Factory (`usaco-milk-factory`, new)

#### Step 1
- **[MAJOR] Q2 Picture D feedback is wrong.** Picture D is DIRECTED with edges 2→1, 3→2 (the belt [1,2] reversed), but the displayed feedback says "This changes whether direct relations are arrows or two-way links." It does not — every relation is still an arrow; one arrow is reversed. The student is told the wrong reason. Fix: "This reverses belt [1,2] into 2→1." (exact-picture)
- **[MAJOR] Q7 and Q8 re-ask Q1 and Q4.** Q7 input `n = 3, belts = [[1,2],[3,2]]` is Q1's input (and Example 1); Q1's success text already said "Stations 1 and 3 both send crates to station 2." Q8 input `[[2,1],[2,3]]` is Q4's input (Example 2). The question text even draws the arrows for the student ("For belts 1→2 and 3→2, which pickup station works?"). Two of five concept checks are pure recall. Fix: use fresh inputs (e.g. the remedial ones). (predict-output, bug-trap)
- **[MINOR] Q2 says "Which picture exactly matches this fresh input?"** but it is Q1's input, not fresh. (exact-picture)
- Build answer keys Q1=2, Q4=-1, Q6=3, Q9=1 and all five remedials verified correct; answers are not predictable by position or size — fine.

#### Step 2
- **[BLOCKER] Step 2 rejects the problem's own valid inputs with an unexplained "tree" rule.** `usaco-milk-factory` is in `counterexampleRequiresTree()`, and for directed drawings the validator demands "A directed tree needs exactly one root with no incoming edge." and "Each child in this tree can have only one parent." The Description says only "Ignoring direction, the belts connect all the stations", which allows several sources. So the Example 1 shape 1→2, 3→2 — the input of Step 1 Q1 and Step 4 case 1, and the obvious counterexample for Ezekiel's "turns every arrow into a two-way connection" — is REJECTED (harness probe with nodes 1,2,3 confirmed the message). Nothing on screen states this rule. In the only shapes allowed (all arrows pointing away from one root) the real pickup answer is always -1, so the student cannot draw the situation the lesson is about. Fix: for this problem keep only the "n−1 edges + connected ignoring direction" checks and drop the one-root / one-parent checks, or print the rule above the drawing. (Q1–Q3)
- **[MAJOR] "Correct output" runs the search in the opposite direction from the problem.** The grader's set is what the test station can reach by following arrows (authored resultLabel "stations reachable by following arrows", never displayed). The problem and Step 4 are about which stations can reach the pickup station. Concrete: harness graph 2→1, test station 1: grader wants `[1]`; the stations that can send to 1 are `[1,2]` — which is exactly Ezekiel's expected buggy output. A student applying the problem's meaning types the buggy answer into the CORRECT box and is marked wrong with no hint. Fix: label the box "Stations reached by following arrows from the test station". (Q1–Q3)
- **[MAJOR] "test station" is never defined.** The Description talks about a "pickup station"; the field says "CHOOSE THE TEST STATION / test station" with no sentence saying the search starts there and follows arrows outward. (Q1–Q3)
- **[MINOR] Griffin's wrong start "2"** is only visible in Drawing 2's title; the bug text is just "Griffin uses the wrong test station." (systemic instance) (Q3)

#### Step 3
- **[MAJOR] Membership polarity flips.** Q1/Q4: "Use this node rule for the graph: “Each conveyor belt.”" → NO; Q2/Q3/Q5: "It would be a mistake to use this node rule: “Only stations with no outgoing belt.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."/"Right."** Q3: "Correct. The mini-example lists 1→2 as one direct edge."; Q5: "Correct. The mini-example lists 2→4 as one direct edge."; Q2: "Right. A multi-step route through 2 creates reachability, not a new direct edge."
- **[MINOR] "1 and 2 are directly connected" on a directed graph** (Q3, Q5) hides direction; a student who drew 2→1 by mistake would still say Yes. Say "there is a direct 1→2 arrow".
- Degree claims correctly say "outgoing direct edges" — fine. Inputs reuse the five remedial builds — fine.

#### Step 4
- **[MAJOR] The correct diagnosis names a line that is not in the code, and the line it names is the correct one.** Choice: "Adding next[b].push(a) lets station 1 travel backward through 2 to station 3." The code has no `next`; it builds `reverse`. With belt `[a,b]` = `[firstValue, secondValue]`, the legitimate reverse edge is `reverse[secondValue].push(firstValue)` = `reverse[b].push(a)`, and the BUGGY extra line is `reverse[firstValue].push(secondValue)` = `reverse[a].push(b)`. A student who checks the code sees this choice blaming the correct line. Fix: "Adding reverse[a].push(b) (the second push) lets …". (all 3 cases)
- **[MAJOR] All three cases are the same case.** Same bug ("Conveyor arrows are made two-way"), same code, identical diagnosis sentences (case 3 still says "station 1 travel backward through 2 to station 3" although the input has stations 1–4 and the bug path is 1→2→3 anyway), buggy output `1` every time. Cases 2–3 reuse Step 1 Q4/Q6 inputs whose answers (-1, 3) were shown. (build-2, build-3)
- **[MINOR] Input formatting differs between cases:** case 1 `n: 3 / belts: [[1, 2], [3, 2]]`, cases 2–3 `n=3, belts=[[2,1],[2,3]]`.
- **[MINOR] "The helper accepts smallest candidate 1"** (case 1 proof chain) — no helper exists.
- **[MINOR] "reverse graph" is used in choices A and the feedback** ("Starting there is correct: reverse edges reveal every station that can reach the candidate") without ever being explained; nothing earlier in the lesson introduced reversed edges.

#### Cross-step / other
- Step 2 searches forward from the "test station"; Step 4's code searches the reverse graph from the "candidate"; the Description asks who can reach the pickup station. Three different framings of direction with no bridge sentence.
- Step 2's tree-only rule contradicts Step 1 Q1, Step 4 case 1 and the Description's Example 1 (see Step 2 BLOCKER).

---

### Minimum Island (`structy-minimum-island`, new)

#### Step 1
- All nine answer keys are correct. No wording problems in the concept questions.
- **[MINOR] Answers copied from the Description and repeated inputs.** Q7 = Example 1 (output 1 explained), Q9 = Example 2 (output 3 explained). Remedial after `node-rule` reuses `[['L','L'],['L','W']]` (= Q9/Example 2); remedial after `bug-trap` reuses `[['L']]` (= Q8). (Q7, Q9, remedials)

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `minimumIsland` returns a count; the field wants the list of reached cells, e.g. `["(0,0)","(1,1)"]`. A student will type `1`. (S2 Q1–Q3)
- **[MINOR] "CHOOSE THE ISLAND SEED / island seed"** — "seed" is jargon; nothing says it is the cell the search starts from. Fix: "Choose the starting land cell". (S2 Q1–Q3)
- **[MINOR] Q1 drawings carry no L/W values.** "Lukas treats corner-touching squares as direct neighbors." The grader joins every diagonal pair of drawn cells as if all were land; the student cannot express a diagonal water cell. Works for the obvious counterexample, but the guide never says "every node you draw is land". (S2 Q1)
- **[MINOR] Q3 "Johnny chooses the final listed route and never returns."** Same vague "listed" wording as above; means last-drawn edge at each node. (S2 Q3)

#### Step 3
- **[MAJOR] Claim with a false premise, and feedback that repeats it.** Q1 `[['L','W','L']]` (two separate islands, no edges). All three variants show "(0,0) can reach (0,2), so the graph should contain a direct edge between them." keyed NO. But (0,0) cannot reach (0,2) at all. The wrong-answer feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2)." implies they are reachable. A student who correctly sees two islands is confused. Fix: "(0,0) and (0,2) are both land, so they should share a direct edge." (S3 Q1 v0/v1/v2)
- **[MINOR] Border-cell rule is untestable on every input.** "Only L cells on an island's outer border" appears in Q1 v1, Q2, Q5; every Step 3 grid has at most 3 land cells and no interior cell, so the rule yields the identical graph each time and the keyed answer is debatable. (S3 Q1 v1, Q2, Q5)
- **[MINOR] Self-reach claim on the one-cell grid.** Q3 `[['L']]`: "(0,0) can reach itself without using an edge, but the graph still has no direct (0,0)—(0,0) edge." (S3 Q3)
- **[MINOR] Label guidance contradicts Step 1.** The graph-failure box on Q1 says "Both (0,2) and 0,2 work. Do not include the cell value." while the guide above it says "Name each cell (row,column)… Do not add spaces". Harmless but inconsistent. (S3 Q1)
- **[MINOR] "× Right. A multi-step route through (0,1)…"** shown for a wrong answer. (S3 Q2, Q5)

#### Step 4
- All three buggy outputs verified (3, 2, 2); labels match the Step 1 `(r,c)` format.
- **[MINOR] Same code and same three choices in all three cases** (only reordered). (S4 cases 2–3)

#### Cross-step / other
- Nothing further.

### Moocast (`moocast`, new)

#### Step 1
- **[MINOR] Picture D feedback describes a different mistake.** Q3 `exact-picture`, Picture D has edges `0→1, 1→0, 2→1` (the 1→2 arrow is reversed). Displayed feedback: "This changes whether direct relations are arrows or two-way links." Nothing about two-way links changed; one arrow was flipped. Fix: "This points the 1→2 transmission the wrong way; cow 2 (p=1) is too weak to reach cow 1."
- **[MINOR] Q8 and Q9 are the Description tab's Example 1 and Example 2 verbatim** (`[[1,3,5],[5,4,3],[7,2,1],[6,1,1]]` → 3 and `[[0,0,2],[3,0,3],[5,0,1]]` → 3), so both "predict" concept checks are answerable by flipping to the Description tab. Q9's input is also reused as the edge-rule remedial and as S3 Q5. Fix: use fresh cow lists.
- **[MINOR] Concept-question raw-input box contains the question, not an input.** Q5 and Q7 show `What does each radio node represent?` / `When should arrow i → j be drawn?` inside the code box under "Optional: draw this input before answering". (Known systemic, noted here only because "radio node" is also odd wording — the lesson never calls nodes "radio nodes" anywhere else.)

#### Step 2
- **[MAJOR] Node-name rule flips from Step 1 with no warning.** Step 1/3 require `0: (0,0) p=2`; the harness probe shows submitting those names in Q1 is rejected with "Use numeric IDs 0, 1, 2, ... with no gaps." No guide is shown. Concrete instance of the systemic issue; for this problem the taught format is long and the student has just typed it 9+ times.
- **[MINOR] "Tyson forgets that the listed connections have a direction."** In Moocast nothing is "listed" — edges are computed from position and power. A literal student looks for a list of connections in the input. Fix: "Tyson treats every radio link as two-way."
- **[MINOR] Q3 says "Edge numbers show drawing order" but the transcript records `edge drawing-order numbers visible: false`** at the moment the screen is captured. If numbers only appear after edges are drawn, fine; otherwise the sentence points at nothing.

#### Step 3
- **[MAJOR] (P1) Wrong-answer feedback starts with "Correct."** Q2 claim "0: (0,0) p=5 and 1: (3,4) p=1 are directly connected, not merely reachable through a longer route." — if the student answers No they see "× Correct. The mini-example lists 0: (0,0) p=5→1: (3,4) p=1 as one direct edge." Same on Q5. Fix: drop the leading "Correct."
- **[MINOR] Claims are very hard to read because the full label is repeated.** e.g. Q3: "The correct graph has 0: (0,0) p=3→1: (3,0) p=1 and 1: (3,0) p=1→2: (4,0) p=1, so it should also contain a direct 0: (0,0) p=3→2: (4,0) p=1 edge." Fix: refer to cows by index in claim text ("cow 0→cow 2").
- Answer keys for all 5 questions checked and correct.

#### Step 4
- **[BLOCKER] Case 1 requires secret labels `0:p3`, `1:p1`, `2:p2`.** No guide is shown; Step 1/3 taught `0: (0,0) p=3`; Step 2 taught `0`. Neither works here. The student cannot pass without guessing this third format. Fix: accept bare index or show the required format.
- **[BLOCKER] Cases 2 and 3 require a DIFFERENT format from case 1** — bare `0`,`1`,`2`,`3` and `0`..`4`. A student who finally discovers `0:p4` from case 1 is rejected again in case 2. Fix: one format for all three cases.
- **[MINOR] Case 3 distractor B says "exclude the starting cow from seen"** — the code has no `seen`; it uses `visited`. Fix wording.
- **[MINOR] Case 2 distractor id `wrong-visited` text is about starting only at cow 0** — fine as a distractor, but its feedback "Trying every starting cow is required..." is the only place the student learns the loop over `startNode` is intentional; ok.
- Buggy outputs 3 / 4 / 5 and correct outputs 2 / 3 / 2 verified by running the code and by hand.

#### Cross-step / other
- Four different node-name schemes in one lesson: `0: (0,0) p=2` (S1, S3), `0` (S2), `0:p3` (S4 case 1), `0` (S4 cases 2–3).

---

### Path Sum (`path-sum`, new)

#### Step 1
- **[MAJOR] "levelOrderIndex" is ambiguous when the array contains `null`.** Q1 `[5,4,8,11,null,13,4]` requires `node 5: 13` and `node 6: 4` (the null at index 4 consumes a number); Q6 `[-2,null,-3]` requires `node 2: -3`. A student who numbers the *existing* nodes in level order writes `node 4: 13`, `node 5: 4`, `node 1: -3` and fails with only "every exact node ×". Same trap in the edge-rule remedial (`node 3: 3`), bug-trap remedial (`node 6: 5`), S3 Q1 (`node 6: 5`), S3 Q4 (`node 3: 3`), S4 case 2 (`node 3: 3`). Fix: guide text "use the position in the level-order array, counting null slots".
- **[MINOR] Q2 Picture D feedback describes a different mistake**: Picture D reverses one arrow (`node 1: 4→node 0: 5`); feedback says "This changes whether direct relations are arrows or two-way links."
- **[MINOR] Q5 distractor A is not a "link"**: question "Which links may a root-to-leaf path follow?"; A "A path may stop at any inner node as soon as its running sum hits targetSum." answers a different question.
- **[MINOR] Q3, Q7, Q9 are the Description's examples verbatim** (Example 2 → false; Example 1 with all four path sums listed → "one complete path has sum 22"; Example 2 → "neither complete path has sum 5").
- All build/remedial keys verified (true, false, true, true; remedials true, true, false, true, true).

#### Step 2
- **[MAJOR] Q3 "Esmeralda drops every connection touching a degree-one tree node."** "Degree-one" is undefined jargon, and in a chain `root→L→LL` the root itself has degree one — a literal student cannot tell whether Esmeralda also deletes `root→L`. Office-rumor describes the same bug id as "disconnects every leaf". Fix: "Esmeralda deletes every edge that touches a leaf (a node with no children)."
- **[MAJOR] Node names must be `root, L, R, LL…`** — Step 1 taught `node 0: 5`; probe rejected with "Use root, L, R, LL, LR, ... to name tree positions." Only discovered after clicking Check. Output must be quoted and sorted `["L","LL","root"]` (root last). Concrete instance of the systemic issue.
- **[MINOR] Q1 "Mallory stops reading one relation too early"** — a nested object has no list of relations to "read"; "drops the last child arrow you drew" is clearer.

#### Step 3
- **[MAJOR] (P1)** Q2 and Q5 "…directly connected…" → wrong-answer feedback "Correct. The mini-example lists node 0: 2→node 1: 3 as one direct edge."
- **[MINOR] Q2 and Q3 use the identical tree `[2,3,4]`** (only targetSum differs, which Step 3 ignores) — the student draws the same three nodes twice.
- **[MINOR] Correct node rule wording differs from Step 1**: S3 "Every existing tree node object, including root, inner nodes, and leaves." vs Step 1 Q4 "Every tree node object on the route, including root and leaf."
- Keys verified for all 5 questions.

#### Step 4
- **[BLOCKER] Case 2's correct diagnosis is copied from case 1 and is false for the shown input.** Input `root level-order=[1,2,null,3], targetSum=3`; the keyed-correct choice reads "Node 3 makes prefix 5→3 equal 8, but node 3 still has child 1 and is not a leaf." There is no node 5, no prefix 8, and node 3 is the leaf. The shown proof chain also says "Code rule: Any visited node whose prefix sum is 8 returns true immediately." (target is 3). A literal student rejects the only correct option. Fix: "Node 2 makes prefix 1→2 equal 3, but node 2 still has child 3 and is not a leaf." and "…prefix sum is 3…".
- **[BLOCKER] Hidden node labels flip format between cases.** Case 1 requires bare values `5`, `3`, `1`, `10`; case 2 requires `node 0: 1`, `node 1: 2`, `node 3: 3`; case 3 requires bare `2`, `4`, `1`, `3`, `10`. No guide is shown. A student using Step 1's format fails case 1, switches to bare values, then fails case 2.
- **[MINOR] Case 1 and 3 inputs are nested objects, case 2 is level-order** — the level-order index needed for case 2 labels doesn't exist in the object form.
- **[MINOR]** Case 2 reuses the edge-rule remedial / S3 Q4 input; the student already knows the correct answer is false.
- Buggy true ×3 and correct false ×3 verified by running the code.

#### Cross-step / other
- Three label schemes: `node i: v` (S1, S3, S4 case 2), `root/L/R` (S2), bare value (S4 cases 1 and 3).

---

### Properties Graph (`properties-graph`, new)

#### Step 1
- **[MAJOR] Node names must be de-duplicated, but nothing says so.** Guide: "Name each row row index: {comma-separated set values}. Example: row 1: {2,3}." Q4 input `[[1,1],[1,2]]` requires the hidden label `row 0: {1}` (not `row 0: {1,1}`); the bug-trap remedial `[[7,7],[7],[8]]` requires `row 0: {7}`; Step 3 Q5 requires `row 0: {7}` too. A literal student copies the row as written and gets only "Every exact node label… ×". Fix: add "write each value once — row [1,1] is `row 0: {1}`" to the guide. (Q4 `build-2`, bug-trap remedial, S3 Q5)
- **[MINOR] Q7 and Q8 are the Description's Example 1 and Example 2 verbatim** (`[[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]], k=1` → 3 and `[[1,2,3],[2,3,4],[4,3,5]], k=2` → 1). Both answers are printed with explanations in the Description tab, so the two "predict" questions test reading, not the graph. (Q7 `predict-output`, Q8 `bug-trap`)

#### Step 2
- **[MAJOR] The problem has no start node, but Step 2 invents one and asks for a reachable-row list.** Field "CHOOSE THE CHOSEN ROW / chosen row"; outputs "CORRECT OUTPUT" = `[0,1]` (rows reached) whereas the problem returns a component count. Q3 bug text has a stutter: "Ruben ignores the chosen chosen row and uses a different one." Fix: word the field "Which row does the search start from?" and label outputs "rows reached".
- **[MAJOR] Q1 "Maximus allows each two-way link to work only in its written order."** In this problem edges are never written in the input (they are computed from overlaps), so "written order" can only mean the order the student clicked the two endpoints, which is never said. Grader expected `1→0` for a link drawn 1-then-0. Fix: "…only from the node you clicked first to the node you clicked second."
- **[MINOR] Step 1 label format rejected** ("row 0: {1,2}" → "Use numeric IDs 0, 1, 2, ... with no gaps.") — instance of the known systemic issue; nothing on screen says the format changed.

#### Step 3
- **[MINOR] Wrong-answer feedback begins with "Correct."** Under the × mark the student reads "Correct. The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge." (Q1 variant 0, Q2, Q5). Drop the leading "Correct."
- **[MINOR] Feedback's "Correct node rule" contradicts Step 1 wording.** Step 1 taught "The entire row properties[i], treated as a set for comparison"; Step 3 feedback says "Correct node rule: Input row index i; properties[i] is payload carried by that node." ("payload" is jargon). (all membership claims)
- **[MINOR] Q4 claim has a false premise.** "row 0: {1} can reach row 1: {2}, so the graph should contain a direct edge between them." — row 0 cannot reach row 1 at all (k=1, no shared value). The keyed No is right, but the feedback ("Reachability never creates a direct edge") argues from a premise the student knows is false. (Q4 variant 2)

#### Step 4
- **[BLOCKER] Three different hidden label formats across the three cases, none shown.** Case 1 requires `row 0`, `row 1`, `row 2`; case 2 requires `row 0: {1}`, `row 1: {1,2}` (Step 1 format); case 3 requires `0`, `1`, `2`, `3`. A student who uses the Step 1 format fails cases 1 and 3 with only "The drawing has every exact node ×". Fix: make all three canvases use the Step 1 format and show the guide.
- **[MAJOR] Distractor is literally true on these inputs.** Cases 1 and 2 offer "The edge test should use common > k instead of common >= k, changing this input's returned value." Running the code with `>` returns 3 (case 1) and 2 (case 2) — exactly the correct outputs — so a student who tests the idea finds it "fixes" the code. Feedback "At least k means >= k; the count of common values is wrong." does not address that it worked. Fix: use an input where `>` gives a different wrong answer, or drop "changing this input's returned value". (case 1 `authored-deep-case`, case 2 `build-2`)
- **[MAJOR] All three cases are the same bug, same code, same correct diagnosis text** ("Both copies of 1 in row 0 increment common…" in cases 1 and 2; "The two copies of 1 in row 0 both increment common…" in case 3). Case 2's input is Step 1 Q4's input. After case 1 the student pattern-matches.
- **[MINOR] Chain wording is meaningless for a counting problem.** "Reachable boundary: Row 0 repeats 1 twice while row 1 contains one 1." is not a boundary. (case 1)

#### Cross-step / other
- Step 1 says nodes are `row i: {…}`, Step 2 wants `0,1,2`, Step 4 wants three formats (above). Four label schemes in one lesson.

---

### Reachable Nodes With Restrictions (`reachable-nodes-with-restrictions`, new)

#### Step 1
- **[MINOR] Q3 picture lists show `3(restricted)` (no space)** while the guide/grader require `3 (restricted)`. A student copying the picture label into the drawing tool is rejected. (Q3 `exact-picture`, all four pictures)
- **[MINOR] Q7 and Q9 are Description Examples 1 and 2 verbatim** (answers 4 and 3 printed in the Description tab).
- **[MINOR] Q4 choice A is garbled:** "Only unrestricted nodes; erase restricted nodes and all context immediately." — "and all context immediately" means nothing. (Q4 `node-rule`)
- Build keys Q1 (3), Q2 (1), Q5 (4), Q8 (1) and all five remedials verified correct.

#### Step 2
- **[MAJOR] Q1 bug text is gibberish:** "Corbin runs the search from a different node 0." and field "CHOOSE THE NODE 0 / node 0" (readonly "0"). The template pasted the start-name "node 0" into the sentence. Corbin actually starts at 1, visible only in Drawing 2's title. Fix: "Corbin starts the search at node 1 instead of node 0."
- **[MAJOR] Restrictions cannot be drawn at all.** Label rule is numeric-only; Step 1's `3 (restricted)` is rejected with "Use numeric IDs 0, 1, 2, ... with no gaps." Q3's authored level is "Restricted dead end" yet no node can be marked restricted; a student will try to reproduce the lesson's restricted nodes and be rejected without being told restrictions are simply absent from Step 2.
- **[MINOR] Q3 says "Edge numbers show drawing order."** but the harness saw no drawing-order numbers on the canvas.

#### Step 3
- **[MAJOR] Reachability claims start from a restricted node.** Q1 variant 2: "1 (restricted) can reach 3 through 0, but the graph still has no direct 1 (restricted)—3 edge." (keyed YES). Q3: "2 (restricted) can reach 1 through 0, but the graph still has no direct 2 (restricted)—1 edge." (keyed YES). The lesson just drilled "You may NEVER step on a restricted node", so a literal student answers No ("a restricted node can't reach anything"). Debatable key. Fix: only generate reach claims between unrestricted nodes, or say "ignoring the restriction".
- **[MINOR] Edge order flipped vs input.** Q1 v0 writes "3—0" for input `[0,3]`; Q4 writes "0—1 and 1—2 (restricted)" for input `[[1,0],[2,1]]`.

#### Step 4
- **[BLOCKER] Case 1 hidden label `1 restricted` (no parentheses).** Cases 2 and 3 require `3 (restricted)` / `1 (restricted)` (the taught format). Case 1 alone requires `0`, `1 restricted`, `2`, `3`. A student who writes `1 (restricted)` as taught fails case 1 with only "The drawing has every exact node ×". Fix: change case 1's canvas label to `1 (restricted)`.
- **[MAJOR] Same bug and identical three diagnosis choices in all three cases;** cases 2 and 3 are Step 1 Q1 and Q2 inputs (correct outputs 3 and 1 already answered there). Only the buggy number is new.
- **[MINOR] Jargon in case 1 chain:** "Allowed node 2 is separated from 0 by a forbidden articulation node."

#### Cross-step / other
- Description node rule: "All nodes 0 through n−1, with restricted nodes clearly marked." — but Step 2 forbids marking them and Step 4 case 1 marks them differently.

---

### Transitive Closure of a Graph (`transitive-closure`, new)

#### Step 1
- All keys verified (including remedials `[[0,1,0],[0,0,0],[0,1,0]]` → `[[1,1,0],[0,1,0],[0,1,1]]`).
- **[MINOR] One input used five times.** `[[0,1,0],[0,0,1],[0,0,0]]` appears in Q1, Q3, Q8, Step 4 case 2, and Description Example 1 (output printed). Q9 is Description Example 2. (Q1, Q3, Q8, Q9)

#### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `transitiveClosure` returns an n×n matrix; the field wants the reachable list from one source, `[0,1,2]`. A student will type a matrix. (S2 Q1–Q3)
- **[MINOR] Q2 Allyson's drawing must be UNDIRECTED.** "Allyson turns every arrow into a two-way connection." The grader expects Drawing 2 to be "UNDIRECTED · edges: 1—0"; a student who instead draws two opposite arrows 0→1 and 1→0 in directed mode has no way to know whether that is accepted (harness did not probe it). Fix: say "flip the Directed edges switch off for Allyson's graph". (S2 Q2 `make-two-way`)
- **[MINOR] "CHOOSE THE SOURCE INDEX / source index"** — jargon; "source" is not used in the Description. (S2 Q1–Q3)

#### Step 3
- **[MAJOR] Claim with a false premise.** Q4 `[[0,0],[0,0]]`: "0 can reach 1, so the graph should contain a direct edge between them." keyed NO. Node 0 cannot reach 1. Feedback "Reachability never creates a direct edge. This input lists no direct relation between 0 and 1." implies it can. (S3 Q4)
- **[MINOR] "× Right. A multi-step route through 1…"** for a wrong answer. (S3 Q3)

#### Step 4
- All three buggy outputs verified.
- **[MAJOR] Correct diagnosis text does not fit cases 2 and 3.** Case 1's sentence "Neither source is seeded as reachable from itself, so both diagonal entries stay zero." is reused verbatim as the correct choice for case 2 (three sources, three diagonal entries) and case 3 (one source, one entry). A literal student rejects it because "neither"/"both" are wrong. Fix: "No source is seeded as reachable from itself, so every diagonal entry stays zero." (S4 cases 2–3)
- **[MINOR] Distractor is observationally true on case 1.** "The code returns the original graph matrix without exploring paths longer than one edge." — on `[[0,1],[0,0]]` the buggy output `[[0,1],[0,0]]` IS the input matrix, so a student comparing output to input can defend it; only the "without exploring" clause is false. Fix: use a 3-node input for case 1 or reword. (S4 case 1)
- **[MINOR] No hint that a nested matrix is expected.** Placeholder "Example: false, 3, or [1, 2]"; answer must be `[[0,1],[0,0]]`. (S4 cases 1–3)
- **[MINOR] Same code three times.** (S4 cases 2–3)

#### Cross-step / other
- Label format (bare index) is consistent across steps — fine.

### Tree Sum (`structy-tree-sum`, new)

#### Step 1
- **[BLOCKER] Q8 cannot be answered.** `build-4` shows `root level-order=[]`; the required graph has zero nodes, but the answer buttons "0 / 1" stay disabled until a node is drawn. Drawing any node makes the exact-graph check fail. The harness had to skip it ("FINISHED / Step 1 finished. 8 passed · 1 skipped." instead of PROVEN). Fix: enable the answer buttons when the required graph is empty, or replace the input with a one-node tree. (Q8 `build-4`)
- **[MAJOR] levelOrderIndex counts null slots — never stated, and one input only parses that way.** Q1 requires `node 6: 1`; Q3 `[1,6,0,null,null,-4]` requires `node 5: -4`; remedial after `edge-rule` `[1,null,2,null,null,null,3]` requires `node 2: 2`, `node 6: 3`. In LeetCode's compressed level-order format that last tree is written `[1,null,2,null,3]`, so a student who learned trees from LeetCode cannot even read the input. Fix: explain the array form once and say indexes count nulls. (Q1, Q3, remedial after `edge-rule`, S3 Q5)
- **[MINOR] Q7 and Q9 test arithmetic only.** "What is the sum of tree values 3, 11, 4, -2, 4, and 1?" and "What is the sum of tree values 1, 6, 0, and -4?" list the values in the question, and both are the Description examples with the running totals printed. Fix: ask "What does treeSum return for the shown tree?" (Q7, Q9)
- **[MINOR] Q1 distractor is from a different problem.** 18 (vs 21) is not "skip the negative node" (that gives 23); it is the max root-to-leaf path sum. Not a believable tree-sum mistake. (Q1)

#### Step 2
- **[BLOCKER] Q1 bug text tells the student to do the wrong thing.** "Cecilia erases the outer leaves before searching." Grader requires Cecilia's drawing to be exactly "nodes: L, R, root · edges: none" — leaves kept. Same fix as max-root: "Cecilia drops every arrow that points to a leaf." (S2 Q1 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `treeSum` returns a number; the field wants `["L","R","root"]`. (S2 Q1–Q3)
- **[MINOR] Q3 "Madeleine chooses the final listed route and never returns."** Same vague "listed" wording. (S2 Q3)

#### Step 3
- **[MINOR] Self-reach claim on `[-3]`.** Q3: "Because node 0: -3 can reach itself, the graph should contain a direct node 0: -3→node 0: -3 edge." (S3 Q3)
- **[MINOR] "× Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge."** shown for a wrong answer in every Q1 variant; "× Right. A multi-step route…" in Q2, Q4, Q5. (S3 Q1, Q2, Q4, Q5)

#### Step 4
- **[BLOCKER] Hidden node labels change format between cases.** Case 1 requires `3`, `-5`, `2`; case 2 requires `node 0: 3`, `node 1: 11`, `node 2: 4`, `node 3: 4`, `node 4: -2`, `node 6: 1`; case 3 requires `node 0: 1`, `node 1: 6`, `node 2: 0`, `node 5: -4`. No guide on any of them. (S4 cases 1–3)
- **[MINOR] Ambiguous success text.** Case 2: "The six-node tree has edges 3→11, 3→4, 11→4, 11→-2, and 4→1 by node position." Two nodes are named 4, so "3→4" and "4→1" cannot be told apart. Fix: use the `node 2: 4` / `node 3: 4` names. (S4 case 2)
- **[MINOR] Nonsense distractor.** "Null children should contribute their parent's value instead of zero." (all three cases)
- **[MINOR] Same code and same three choices three times.** (S4 cases 2–3)

#### Cross-step / other
- **[MAJOR] Four label formats** as in max-root: `node 0: 3` (S1/S3), `root/L/R` (S2), bare `3` (S4 case 1), `node 0: 3` (S4 cases 2–3).

### Where's My Internet?? (`wheres-my-internet`, new)

#### Step 1
- **[MAJOR] Q7 and Q8 are the Description's examples, and Q7 is also Q1.** Q7 input `n = 6, cables = [[1,2],[2,3],[3,4],[5,6]]` = Q1 input = Example 1; Q1's success text already said "Only houses in house 1's component are online." and the Description says the output is `[5, 6]`. Q8 is Example 2 verbatim ("For n=2 and cable [2,1]…") with its answer `[]` printed in the Description tab. Fix: use fresh inputs. (predict-output, bug-trap)
- **[MINOR] Q7 wording "For cables 1-2-3-4 and a separate cable 5-6"** uses a chain notation that a literal student can read as one cable named "1-2-3-4". Say "cables 1—2, 2—3, 3—4".
- **[MINOR] Q2 says "this fresh input"** but it is Q1's input.
- Build keys Q1=[5,6], Q4=[], Q6=[3,4], Q9=[] and all remedials verified; no positional or size pattern — fine.

#### Step 2
- **[MAJOR] "Correct output" is the opposite set from the problem's output.** `findOfflineHouses` returns OFFLINE houses; the grader wants the houses reachable from house 1 (the ONLINE set). Concrete: harness graph 1—2, 1—3, 3—4: the real answer is `[]`, the grader wants `[1,2,3,4]`; Joaquin's box wants `[1,3,4]` (houses he reaches), not his offline list `[2]`. No hint on screen. Fix: label the boxes "Houses the search reaches from house 1". (Q1–Q3)
- **[MAJOR] Heaven (make-one-way) can only be exposed by drawing cables toward house 1, and nothing says so.** The start is locked at 1, and the mistaken arrow follows click order. Any cable the student draws starting from house 1 becomes 1→x, which Heaven still follows, so both outputs match and "Counterexample confirmed" never appears. The harness had to draw 2→1 (click 2 first). The authored goal "List a cable toward house 1 so direction must not matter" is hidden. Fix: show the goal line, or show the arrow direction rule ("Heaven's arrow points from the first house you clicked to the second"). (Q2)
- **[MINOR] "CHOOSE THE HOUSE 1 / house 1"** — the field is readonly and prefilled "1", so "Choose" is misleading; say "Start: house 1 (fixed)". (Q1–Q3)
- **[MINOR] "Joaquin keeps only the last branch it sees."** — "it" for a named person. (Q1)
- **[MINOR] Edge-order numbers.** Both Joaquin (Q1) and Aubree (Q3) say "Edge numbers show drawing order." but the harness recorded the numbers visible for Q1 and not for Q3. Verify they appear for drop-last-edge rounds. (Q3)

#### Step 3
- **[MAJOR] Q5 claim has a false premise.** Input `n=4, cables=[]`; claim "1 can reach 2, so the graph should contain a direct edge between them." 1 cannot reach 2. Keyed NO; feedback "Reachability never creates a direct edge. This input lists no direct relation between 1 and 2." Same confusion as villages Q2. (Q5)
- **[MAJOR] Membership polarity flips.** Q1/Q2/Q4/Q5 "Use this node rule for the graph: “…”" → NO; Q3 "It would be a mistake to use this node rule: “One node for the online group and one for every offline group.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."** Q3: "Correct. The mini-example lists 1—2 as one direct edge."
- **[MINOR] Q1 variant 1 writes edges backwards:** "The correct graph has 3—2 and 2—1…" for input `[[1,2],[2,3]]`. (systemic instance)

#### Step 4
- **[MAJOR] All three cases are the same case.** Same bug ("Only houses directly cabled to house 1 go online"), same code, the identical correct sentence "The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline." in all three (case 3's input lists the cable as `[3,2]`), identical distractors; cases 2–3 reuse Step 1 Q1/Q4 inputs whose answers were shown. (build-1, build-2)
- **[MINOR] Distractor "Each cable pair works only in its written direction, blocking reverse travel during the reachability search."** — the code has no search at all, and "reachability search" is jargon the lesson never used; a literal student rejects it for the wrong reason. Distractor "A house with no listed cable entry should be omitted from the offline result." is a false requirement, not a diagnosis, and only relevant in case 1 (house 4).
- **[MINOR] "The helper reports [3,4]"** (case 1) — no helper.
- **[MINOR] Input formatting differs:** case 1 `n: 4 / cables: [[1, 2], [2, 3]]` vs cases 2–3 `n=6, cables=[…]`.
- Required labels `"1"…"6"` match the format taught in Step 1 — fine.

#### Cross-step / other
- Step 2's "output" (online set) vs the problem's output (offline list) is the biggest source of confusion in this lesson; see Step 2.

---

---

## Part 3 — Short list of every finding

Counts of per-problem findings from the reviewers: 64 blocker, 276 major, 480 minor (site-wide items from Part 1 are listed first and not repeated per problem).

### Site-wide (from Part 1)
- [BLOCKER] site-wide answer keys: Evaluate Boolean Binary Tree S1 `case-4` (true keyed as false), Gold and Silver Lights S1 Q9 (4 keyed as 3), Detonate Bombs S1 remedial-3 + S3 Q5 (impossible C→B arrow), Ladder Takahashi S4 cases 1–2 (diagnosis texts swapped), Path Sum S4 case 2 (text copied from case 1), Milk Factory S4 case 1 (names a variable the code lacks).
- [BLOCKER] site-wide S4: about 30 problems require hidden node names (`0 source`, `course 0`, `person 1`, `box A`, `×2`…) that no screen ever shows; those Step 4 cases cannot be passed.
- [BLOCKER] site-wide S1: 6 build questions (Connected Cells, Count Sub Islands, Farmland, Max Area of Island, Max Fish, Tree Sum) have an empty correct graph, but the answer buttons only unlock after drawing a node — dead end.
- [BLOCKER] site-wide S3: the three Yes/No claims in every question always share one answer (all Yes or all No) because of a hash-parity bug in `stableChoiceSlot`.
- [MAJOR] site-wide S2: the "Correct output" boxes want a sorted JSON list of reached node names (`["(0,0)","(0,1)"]`) but never say so; loose formats, other orders, and quoted numbers are rejected; the label "output" is not the problem's output.
- [MAJOR] site-wide S2: 23 problems reject the node-name format that Step 1 required (e.g. `root=[]` → `root`, `A` → `0`, `empty prefix` → `ε`); no guide is shown, only a post-Check error.
- [MAJOR] site-wide S2: wrong-start rounds hide which start the character used (only in Drawing 2's title); one-way rounds depend on click order; first/last-branch rounds depend on edge drawing order; Drawing 2 needs the direction toggle flipped — none of this is stated.
- [MAJOR] site-wide S3: membership claims quote wrong rules written for a different input (mention values not in the input, or are actually correct for it); claims are phrased as commands; one-node inputs produce "can reach itself" claims; edges printed backwards.
- [MAJOR] site-wide S3: feedback for a true claim starts with "Correct."/"Right." even when shown under a red × for a wrong answer.
- [MAJOR] site-wide S4: all three cases per problem share identical code and bug; 23 cases show an internal slug (e.g. `count-container-nodes`) as the "Reachable boundary"; "Code rule" text copied into cases where it is false; wrong choices are recognisable by the word "should".
- [MAJOR] site-wide S4: no node-name guide; strings must be quoted, `True` rejected, array order must match the code even when the problem says "any order".
- [MAJOR] site-wide S1: all 300 build questions are 2-choice coin flips; the explanation for a wrong build choice is never shown; 100 concept questions print the question inside the "raw input" box under "Optional: draw this input".
- [MINOR] site-wide: Examples tab hidden until 2 builds; skipped/remedial questions still show as "passed"; placeholder "Example: 0" on read-only start boxes; Step 4 case 1 input shown in a different format than cases 2–3.
- [MAJOR] site-wide S1/S3/S4: weighted problems (Network Delay, Evaluate Division, Keys and Rooms, Package to the Outpost, Save the Date) and the coloured-metro problem grade edge labels/colours, but no screen says edges need them or how to add one.
- [MINOR] site-wide S2 layout: the two drawing tabs are at the bottom of the canvas below the status line; output boxes sit above the drawings; drawing-order badges are tiny; Step 1 question sits below the fold under the tall canvas.

### Blockers
- [BLOCKER] course-schedule S4: case 1 needs labels `course 0`…`course 3`; cases 2–3 need `0`,`1`,`2`; guide says numbers only
- [BLOCKER] detonate-the-maximum-bombs S1: relation-rule remedial `[[0,0,1],[1,0,4],[5,0,1]]` hidden graph includes impossible edge C→B (distance 4 > radius 1); correct drawing fails
- [BLOCKER] detonate-the-maximum-bombs S3: Q5 reuses the wrong C→B canvas; correct drawing rejected; claim premise "The correct graph has C→B" is false
- [BLOCKER] detonate-the-maximum-bombs S4: secret labels `A (0,0), r=5` / `bomb 0` / `center bomb, east bomb, west bomb, north bomb` — three schemes, none the taught A/B/C
- [BLOCKER] evaluate-division S1: edge weights graded as hidden exact strings in mixed formats ("0.5" vs "1/3"); screen never says weights are required or how to label an edge
- [BLOCKER] evaluate-division S3: same hidden weight-string requirement on all 5 graphs
- [BLOCKER] evaluate-division S4: case 1 requires edge labels "×2" and "×1/2" (untypeable ×), cases 2–3 "2"/"0.5"; no guide
- [BLOCKER] find-if-path-exists-in-graph S4: cases 1/3 require labels "0 source", "2 destination"/"3 destination"; case 2 plain digits; no guide
- [BLOCKER] flatten-nested-list-iterator S4: case 1 requires "outer list"/"inner list"/"deeper list"/"1".."4"; cases 2–3 require root=[] style; no guide
- [BLOCKER] keys-and-rooms S4: case 1 requires "room 0", "room 1" and edge label "key 0"; cases 2–3 plain digits; no guide
- [BLOCKER] kill-process S4: case 1 requires "process 1", "process 3", "process 5", "process 10"; cases 2–3 plain IDs; no guide
- [BLOCKER] letter-combinations-of-a-phone-number S4: root must be labeled "start" (Step 1 said "empty prefix", Step 2 "ε"); no guide
- [BLOCKER] nested-list-weight-sum S4: case 1 hidden labels "outer list", "1 at depth 1", "middle list", "4 at depth 2", "deepest list", "6 at depth 3"; cases 2–3 need root=[]
- [BLOCKER] nested-list-weight-sum-ii S4: case 1 hidden labels "outer list", "1 depth 1", "middle list", "4 depth 2", "deepest list", "6 depth 3" (differ from NLWS)
- [BLOCKER] network-delay-time S4: case 1 hidden labels "1", "2 source", "3", "4"; cases 2–3 use plain "2"
- [BLOCKER] number-of-provinces S4: case 1 requires secret labels "city 0/1/2" while cases 2–3 and Step 1/3 use "0/1/2".
- [BLOCKER] possible-bipartition S4: hidden labels "person 1"–"person 7" vs taught "Use each node's 1-based number only"; no guide.
- [BLOCKER] smallest-string-with-swaps S4: hidden labels "index 0: b" (cases 1, 3) vs "0:d" (case 2); no guide.
- [BLOCKER] time-needed-to-inform-all-employees S4: hidden labels "head 0, delay 1"/"manager 1, delay 5"/"employee 3" (cases 1, 3) vs "0" (case 2); no guide.
- [BLOCKER] water-and-jug-problem S1: builds require arbitrary partial state graphs (Q1 6/6 of 10/34, Q5 4/4 of 6/18, Q8 single node, remedials with isolated/absent states) contradicting the taught "one legal move = edge" rule.
- [BLOCKER] water-and-jug-problem S3: degree claims keyed to partial graphs are false under jug rules (e.g. "(0,6) has exactly 1 outgoing direct edge." keyed YES, real 3; "(2,0) has exactly 0" keyed YES, real 3; "(2,1) has exactly 0" keyed YES, real 4).
- [BLOCKER] water-and-jug-problem S3: required graphs are fragments (Q5 no (0,0); Q4 isolated (0,2); Q2 edgeless (4,8)).
- [BLOCKER] water-and-jug-problem S4: case 3 hidden labels "0,0" without parentheses; normalization is grid-only so "(0,0)" never matches.
- [BLOCKER] water-and-jug-problem S4: requires the complete state graph (case 2: 6 nodes/18 arrows) that Step 1 rejected for the same input.
- [BLOCKER] water-and-jug-problem cross-step: same input has different "correct" graphs in S1/S3/S4.
- [BLOCKER] word-search S1: builds grade a hidden directed word-step graph (Q4 4 nodes/0 edges; Q1 omits side pairs) contradicting the taught "cells sharing a side" rule; [[A,A]] direction arbitrary.
- [BLOCKER] word-search S3: keys/feedback contradict the shown "sharing a side" model (e.g. "(1,0) has 1 outgoing direct edge." for [[A,B],[B,C]]; "(0,2) has 0" for [[A,B,X],[B,C,X]]).
- [BLOCKER] word-search S3: Q3 [[A,A]] requires (0,0)→(0,1) only; reverse is equally valid.
- [BLOCKER] word-search S4: requires undirected full side grid (case 2: four edges; case 1: twelve), opposite of Steps 1/3 arrows.
- [BLOCKER] word-search cross-step: edge convention flips directed word-steps → undirected → undirected full grid.
- [BLOCKER] busiest-shelf-level S4: case 1 needs secret labels `root`, `1`, `box A`, `2`, `3`, `box B`, `box C`, `4`; cases 2–3 need `root[0]=[]` format
- [BLOCKER] coins-on-level-k S4: case 1 needs secret labels `root`, `box A`, `3`, `2`, `5`, `box B`, `box C`, `4`; cases 2–3 need `root[0]=[]` format
- [BLOCKER] gold-and-silver-lights S1: Q9 key says 3 but wires [[0,1],[1,2],[1,4],[0,3],[3,5]] give 4 gold bulbs (0,2,4,5); feedback wrongly says bulb 5 is not gold
- [BLOCKER] dungeon-gold-run S4: case 1 hidden labels "0","1","2" vs cases 2/3 "0:1g" format; no guide
- [BLOCKER] runes-on-the-castle-door S4: hidden root label `empty` in all 3 cases, never shown (taught `start`)
- [BLOCKER] save-the-date-phone-chain S1: every build requires exact edge labels `+2`, `+3`, `+1`, `+5`, `+4` with no instruction anywhere (guide only covers node names; hint code never called)
- [BLOCKER] save-the-date-phone-chain S4: case 1 needs no labels but cases 2–3 require `+2,+2,+3,+3,+1` / `+5,+5` with no guide
- [BLOCKER] shut-the-garden-valve S4: case 1 hidden labels bare `1,2,3,4` but cases 2–3 require `1:5…` / `10:2…`; no guide
- [BLOCKER] codewars-array-deep-count S4: case 1 hidden labels "outer","1","inner","2","empty" contradict taught format and cases 2/3
- [BLOCKER] hackerrank-connected-cells S1: Q8 `grid=[[0]]` has an empty correct graph; answer buttons stay disabled, question cannot be completed
- [BLOCKER] count-sub-islands S1: Q9 build-4 (grid2=[[0]]) has an empty correct graph and answer buttons never enable — dead end
- [BLOCKER] employee-importance S4: case 1 hidden labels "1","2","3" vs cases 2/3 "0:1" format; no guide
- [BLOCKER] evaluate-boolean-binary-tree S1: Q6 key says `false` for values=[3,1,2,0,1] but the root evaluates to `true`
- [BLOCKER] evaluate-boolean-binary-tree S4: case 1 hidden labels "AND","true","false" vs "0:AND","1:true","2:false" in cases 2–3 and Step 1
- [BLOCKER] find-all-groups-of-farmland S1: Q9 land=[[0]] has an empty required graph and disabled answer buttons — dead end, "8 passed · 1 skipped"
- [BLOCKER] ladder-takahashi S4: case 1 (`[[4,1],[4,10]]`) keyed-correct choice cites non-existent pair [8,3]; distractor "Floor 1 is absent from the map…" is literally true and graded wrong
- [BLOCKER] ladder-takahashi S4: case 2 (`[[1,4],[4,3],[8,3]]`) keyed-correct choice "[4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible" is false; no true choice; labels swapped with case 1 (step4-specs-new.json:2661/2731)
- [BLOCKER] max-area-of-island S1: Q8 `grid=[[0]]` empty correct graph; question cannot be completed
- [BLOCKER] structy-max-root-to-leaf-path-sum S2: Q2 "Clayton erases the outer leaves" but grader requires leaf nodes kept and only their arrows removed
- [BLOCKER] structy-max-root-to-leaf-path-sum S4: hidden labels are bare `5`,`-10`,`-20` / `10`,`-2`,`-3`,`-30` in cases 1,3 but `node 0: -5` etc. in case 2, no guide
- [BLOCKER] maximum-number-of-fish-in-a-grid S1: Q8 `grid=[[0]]` empty correct graph; question cannot be completed
- [BLOCKER] usaco-milk-factory S2: tree-only validator rejects the problem's own Example 1 shape (1→2, 3→2) with "A directed tree needs exactly one root with no incoming edge."; rule never shown; allowed shapes always have answer -1
- [BLOCKER] moocast S4: case 1 requires secret labels 0:p3 / 1:p1 / 2:p2 (no guide; differs from S1, S2)
- [BLOCKER] moocast S4: cases 2–3 require bare 0..3 / 0..4, a different format from case 1
- [BLOCKER] path-sum S4: case 2's correct choice "Node 3 makes prefix 5→3 equal 8…" and proof "prefix sum is 8" are copied from case 1 and false for [1,2,null,3], target 3
- [BLOCKER] path-sum S4: hidden labels are bare values in cases 1/3 (5,3,1,10 / 2,4,1,3,10) but "node 0: 1" style in case 2
- [BLOCKER] properties-graph S4: hidden labels differ per case — `row 0` / `row 0: {1}` / `0` — no guide
- [BLOCKER] reachable-nodes-with-restrictions S4: case 1 hidden label `1 restricted` (no parentheses) vs taught `1 (restricted)` used in cases 2–3
- [BLOCKER] structy-tree-sum S1: Q8 `root level-order=[]` has an empty required graph and disabled answer buttons; cannot be completed
- [BLOCKER] structy-tree-sum S2: Q1 "Cecilia erases the outer leaves" but grader requires leaf nodes kept, edges removed
- [BLOCKER] structy-tree-sum S4: hidden labels bare `3`,`-5`,`2` in case 1 but `node 0: 3`… / `node 5: -4` in cases 2–3, no guide
- [BLOCKER] time-needed S4: cases 1 and 3 require secret labels "head 0, delay 1", "manager 1, delay 5", "employee 3"…; case 2 uses plain IDs.
- [BLOCKER] water-and-jug S1: hidden graphs are arbitrary partial subgraphs (no empties, unstated stopping rule; remedial-3 lacks (0,0); remedial-2 has isolated (0,2); build-sum vs Step 4 case 2 require different graphs for the same input).
- [BLOCKER] water-and-jug S4: case 3 requires "0,0" labels without parentheses; cases 1–2 and Step 1/3 use "(0,0)"; not normalised for state problems.

### Major
- [MAJOR] all-paths-from-source-to-target S2: "CORRECT OUTPUT" wants `[0,1]` but Step 1 trained `[[0,1]]`-style path lists; no hint
- [MAJOR] all-paths-from-source-to-target S3: wrong-answer feedback reads "× Correct. The mini-example lists 0→2 as one direct edge." (also Q3, Q5; every problem in batch)
- [MAJOR] all-paths-from-source-to-target S4: cases 2 and 3 are exact repeats of case 1 (same code, bug, diagnosis sentences)
- [MAJOR] battleships-in-a-board S2: Q1 must contain `(0,1)`, start elsewhere and (on a legal board) not touching it; only revealed after Check; grader accepted an impossible board
- [MAJOR] course-schedule S2: "CORRECT OUTPUT" wants `[0]` on a problem whose answer is true/false
- [MAJOR] course-schedule S2: Q2 requires inspecting course 0 with Jasper secretly starting at 1; not shown, start is free text
- [MAJOR] course-schedule S4: distractor "The search should begin only at course 0, changing this input's returned value" is literally true for cases 2 and 3
- [MAJOR] detonate-the-maximum-bombs S2: taught labels A, B rejected ("Use numeric IDs 0, 1, 2…") only after Check
- [MAJOR] evaluate-division S1: wrong-answer feedback is bug-id jargon ("reject zero edge path bug", "unknown self or target equals one bug")
- [MAJOR] evaluate-division S2: Step 1 teaches two arrows per equation; drawing that makes drop-last-edge (Q1) and wrong-start (Q3) unexposable, with hidden "different component" goal
- [MAJOR] evaluate-division S2: "OUTPUT" of a division query is a number, grader wants quoted variable list; no denominator chosen
- [MAJOR] evaluate-division S3: Q2 feedback "The mini-example lists n→m as one direct edge" — input lists only m/n
- [MAJOR] evaluate-division S3: membership claims quote values from other inputs ("2 and 3" for values [2,4]; "a/b, b/c" for p,q,r)
- [MAJOR] evaluate-division S4: same bug and same correct sentence in all 3 cases
- [MAJOR] evaluate-division S4: "Code rule: Both directions receive weight 2." copied into cases with values [2,3] and [4]
- [MAJOR] find-if-path-exists-in-graph S1: Q9 question names "components {0,1,2} and {3,4,5}", giving away the answer
- [MAJOR] find-if-path-exists-in-graph S2: Q1 Lila's arrow direction = click order of an undirected edge; Drawing 2 must have arrows ON; neither stated
- [MAJOR] find-if-path-exists-in-graph S3: Q2/Q5 quoted rule "Only 0, 1, and 2…" is correct for n=3; feedback cites nonexistent "Vertices 3, 4, and 5"
- [MAJOR] find-if-path-exists-in-graph S4: "Code rule: The code creates only 1→0 and 2→1." copied into cases where it is false
- [MAJOR] find-if-path-exists-in-graph S4: same bug and correct sentence in all 3 cases
- [MAJOR] flatten-nested-list-iterator S1: Q2 pictures use "Outer array / Array at [0] / 1 at [0][0]" while guide demands root=[] / root[0]=[] / root[0][0]=1
- [MAJOR] flatten-nested-list-iterator S2: Step 1 labels rejected ("Use root, root[0]…"); nodes carry no values so "CORRECT OUTPUT" cannot be the flattened integers
- [MAJOR] flatten-nested-list-iterator S3: "not the empty list" rule keyed wrong on inputs with no empty list (Q1 v1, Q2, Q5)
- [MAJOR] flatten-nested-list-iterator S3: claims quote "1, 2, and 3" for [1,[1]] and "depth 3" for [[2],2,[2]]
- [MAJOR] flatten-nested-list-iterator S4: feedback introduces "L1"/"L2" node names used nowhere else
- [MAJOR] flatten-nested-list-iterator S4: same bug and correct sentence in all 3 cases
- [MAJOR] is-graph-bipartite S1: Q7 distractor "0 and 2 share a path" is a true statement
- [MAJOR] is-graph-bipartite S1: Q9 correct choice "all three edges" on a five-edge graph; "put two nodes together and one apart" is not a wrong belief
- [MAJOR] is-graph-bipartite S2: Q2 "Rohan erases the outer leaves" but required drawing keeps nodes 0,1,2 and removes edges
- [MAJOR] is-graph-bipartite S2: Q1 "written order" — nothing is written; direction = click order; Drawing 2 must be directed
- [MAJOR] is-graph-bipartite S3: Q1 v2 quoted rule "Only nodes 0 and 1 because node 2 has no neighbors" on graph [[1],[0]] (no node 2; rule is correct there)
- [MAJOR] is-graph-bipartite S3: Q5 quotes "0—1 relationship" absent from input [[],[2,3],[1,3],[1,2]]
- [MAJOR] is-graph-bipartite S4: same bug thrice; cases 2 and 3 structurally identical
- [MAJOR] keys-and-rooms S1: Q8 distractors "room 0 lacks keys 2 and 3" and "there is no key back to room 0" are true facts
- [MAJOR] keys-and-rooms S2: Q1 Elena's drawing must be UNDIRECTED (toggle off) — not stated; "listed connections" nothing is listed
- [MAJOR] keys-and-rooms S4: consume-key feedback "would not make room 1 reachable" copied into cases where room 1 is reachable
- [MAJOR] keys-and-rooms S4: same bug and correct sentence in all 3 cases
- [MAJOR] kill-process S2: Q1 exposable only by killing a non-root process (hidden goal); Yara's drawing must be UNDIRECTED
- [MAJOR] kill-process S4: problem says "any order" but [5,3] rejected, only [3,5] accepted
- [MAJOR] kill-process S4: same bug and correct sentence in all 3 cases
- [MAJOR] letter-combinations-of-a-phone-number S2: Step 1 root "empty prefix" rejected; required "ε" cannot be typed if renamed
- [MAJOR] letter-combinations-of-a-phone-number S2: output must list ε last (["a","ab","ε"]); ["ε","a"] rejected; order unexplained
- [MAJOR] letter-combinations-of-a-phone-number S3: Q4 (digits="") claims about a self-edge and "digit 2 or digit 3" on a one-node graph
- [MAJOR] letter-combinations-of-a-phone-number S4: 13–16 exactly-typed nodes per case, three times, for one bug
- [MAJOR] letter-combinations-of-a-phone-number S4: same bug and correct sentence in all 3 cases
- [MAJOR] longest-increasing-path-in-a-matrix S2: Ava's diagonal arrow direction = node creation order, values ignored; unexposable without knowing this
- [MAJOR] minesweeper S1: relation-rule remedial ([["E","E"],["E","E"]]) — 4-direction reveal also makes all four B; distractor feedback false, concept untested
- [MAJOR] nested-list-weight-sum S1: Q1 distractor "6" attributed to depth-zero bug, which gives 4 (S4 case 2 says so)
- [MAJOR] nested-list-weight-sum S1: Q7 feedback for "8" and "12" describes bugs that yield 12 and 16
- [MAJOR] nested-list-weight-sum S2: Step 1 labels "root=[]…" rejected; "root, root[0]" scheme revealed only by the error
- [MAJOR] nested-list-weight-sum S3: claim "Nodes 3, 2, and 21" on inputs [[2],3] / [2,[3]] — numbers collide with the input; 21 from another example
- [MAJOR] nested-list-weight-sum S4: cases 2–3 feedback models the graph as "root, A, 1a, 1b, 2, B, 1c, 1d" / "root, 2, A, 3"
- [MAJOR] nested-list-weight-sum-ii S1: Q7 "12" feedback describes the normal-depth bug (=10, choice B)
- [MAJOR] nested-list-weight-sum-ii S2: Step 1 labels rejected; new scheme only in the error
- [MAJOR] nested-list-weight-sum-ii S3: claims cite "deepest integer 7" / "integer nodes 6, 3, and 7" on inputs without 6 or 7
- [MAJOR] nested-list-weight-sum-ii S4: cases 2–3 feedback uses "root, A, 1a…" / "root, 2, A, 3" names
- [MAJOR] network-delay-time S1: edge weights graded ("Edge labels or weights match the input") but the guide never says to label arrows
- [MAJOR] network-delay-time S2: Grace's Drawing 2 must be UNDIRECTED — toggle must be switched off; duplicate-from-#1 fails silently
- [MAJOR] number-of-increasing-paths-in-a-grid S1: [[1],[2]] used in Q1, Q2 and Q9 (answer given in Q1 feedback); Q7 is Example 1 verbatim
- [MAJOR] number-of-increasing-paths-in-a-grid S2: Lillian's diagonal arrow direction = node creation order, values ignored
- [MAJOR] number-of-islands S1: Q7/Q8 are Description Examples 1–2 and their prompts state the answer ("stays side-connected throughout", "three patches… are pictured").
- [MAJOR] number-of-islands S2: "CORRECT OUTPUT" wants `["(0,0)"]` cell list, not the island count the student has been answering.
- [MAJOR] number-of-islands S2: Q3 Nevaeh's fixed start (0,1) is never stated; no counterexample if the student picks (0,1).
- [MAJOR] number-of-islands S3: Q1 v1 claim "(0,0) can reach (1,1), so…" has a false premise on the diagonal grid; feedback doesn't say so.
- [MAJOR] number-of-islands S4: distractor "The answer should equal the number of land cells in this case." is true for all three inputs.
- [MAJOR] number-of-islands S4: three identical cases (same code, bug, choices; diagonal chains 2/3/4).
- [MAJOR] number-of-provinces S1: Q7/Q9 reuse Q1/Q2's matrices (= Description Examples 1–2, answers shown).
- [MAJOR] number-of-provinces S2: Evan "only in its written order" — matrix has no written order; grader uses click order, never stated.
- [MAJOR] number-of-provinces S2: Jack "erases the outer leaves" but the grader requires leaf cities kept and only their roads removed.
- [MAJOR] number-of-provinces S2: "CORRECT OUTPUT" wants `[0,1]` city list, not the province count.
- [MAJOR] number-of-provinces S3: "Only cities that have an off-diagonal 1" rule keyed NO on inputs where it yields the correct node set (Q1 v1, Q5).
- [MAJOR] number-of-provinces S4: three identical cases; cases 2–3 are Step 1 inputs with answers already given.
- [MAJOR] possible-bipartition S2: "CORRECT OUTPUT" wants `[1,2]` for a true/false problem, no hint.
- [MAJOR] possible-bipartition S2: Q2 (last-branch) requires drawing 2 identical to drawing 1 while telling the student to draw "using the mistake".
- [MAJOR] possible-bipartition S4: three cases share one bug/code/diagnosis; case 1 input = S1 Q4.
- [MAJOR] smallest-string-with-swaps S2: Step 1 labels "0:d" rejected ("Use numeric IDs 0, 1, 2, ... with no gaps."); no string exists in Step 2.
- [MAJOR] smallest-string-with-swaps S2: "CORRECT OUTPUT" wants `[0,1]` positions, not a string.
- [MAJOR] smallest-string-with-swaps S3: Q1 v0 membership claim names letter d for input "cba".
- [MAJOR] smallest-string-with-swaps S4: "Code rule: Only arrow 1→0 is stored" is false for cases 2 and 3.
- [MAJOR] smallest-string-with-swaps S4: three cases share one bug/code/diagnosis; case 2 input = S1 Q3.
- [MAJOR] smallest-string-with-swaps cross-step: one node has three label formats across steps.
- [MAJOR] time-needed-to-inform-all-employees S1: Q7 input `informTime = [4]` for a leaf violates "Employees with no reports have informTime[i] == 0"; key 0 is debatable.
- [MAJOR] time-needed-to-inform-all-employees S2: hidden rule "The chosen company head must be the graph root." only after Check.
- [MAJOR] time-needed-to-inform-all-employees S2: Q3 (shallow-search) requires identical drawing 2 while saying "using the mistake".
- [MAJOR] time-needed-to-inform-all-employees S2: "CORRECT OUTPUT" wants `[0,1,2]` employees, not minutes.
- [MAJOR] time-needed-to-inform-all-employees S4: case 3 proof text unreadable because labels contain commas.
- [MAJOR] time-needed-to-inform-all-employees S4: three cases share one bug; code has no graph; case 2 input = S1 Q6.
- [MAJOR] time-needed-to-inform-all-employees cross-step: label format flips to "manager 2, delay 1" in Step 4.
- [MAJOR] water-and-jug-problem S1: Q7/Q9 distractors "neither jug has capacity 4", "3+5 is not 4" are true statements; choices carry no verdict.
- [MAJOR] water-and-jug-problem S2: outputs must be `["(0,0)"]` quoted JSON; no hint.
- [MAJOR] water-and-jug-problem S3: Q1 membership claim quotes capacities 3 and 5 for input 4 and 6.
- [MAJOR] water-and-jug-problem S4: gcd code has no search; three cases share one bug; case 2 input = S1 Q5.
- [MAJOR] word-search S2: Step 1's directed drawing rejected with "Use two-way edges." only after Check.
- [MAJOR] word-search S2: "CHOOSE THE WORD'S FIRST CELL" with no word/board; output wants quoted cell list, not true/false.
- [MAJOR] word-search S3: membership claims quote "C, CA, and CAT" on boards without them.
- [MAJOR] word-search S4: three cases share one bug; cases 2 and 3 are the same board with B renamed C.
- [MAJOR] who-keeps-their-job S1: Q7/Q9 re-ask Q1/Q3's inputs with the tree narrated; drawing and input irrelevant.
- [MAJOR] who-keeps-their-job S4: three identical cases whose inputs are Step 1 Q1/Q6/Q8 builds.
- [MAJOR] busiest-shelf-level S1: tie-case correct feedback says "more than any other depth" (Q4, remedials 1 and 5) — false and contradicts the tie rule
- [MAJOR] busiest-shelf-level S2: Step 1 labels `root=[]`… rejected; only "Use root, root[0]…" error after Check
- [MAJOR] busiest-shelf-level S4: slug "count-container-nodes" shown as Reachable boundary in cases 2–3
- [MAJOR] coins-on-level-k S2: Step 1 labels rejected ("Use root, root[0], root[1]…")
- [MAJOR] coins-on-level-k S2: Q2 Adam's wrong start `root[0]` hidden; start field read-only
- [MAJOR] coins-on-level-k S4: slug "zero-based-depth" shown as Reachable boundary in cases 2–3
- [MAJOR] counting-constellations S2: Q3 Aaliyah's start `(0,1)` hidden; on a legal sky the start must be ≥2 cells away; grader accepted an impossible sky
- [MAJOR] counting-constellations S4: slug "four-direction-constellations" shown as Reachable boundary in cases 2–3
- [MAJOR] counting-docked-boats S2: Q1 wrong-start requires drawing secret cell (0,1); start (0,0) can't expose it without breaking the boat rule
- [MAJOR] routes-past-the-coffee-cart S1: builds use `roads/start/customer/coffeeCart`, Description and concepts use `graph/checkpoint`
- [MAJOR] routes-past-the-coffee-cart S1: Q9 keys cart-at-node-0 as a valid route while Step 2 rejects "cart … not node 0 or the last node"
- [MAJOR] routes-past-the-coffee-cart S2: hidden rule "cart must be an interior intersection, not node 0 or the last node" only appears as an error
- [MAJOR] routes-past-the-coffee-cart S2: differing reachable sets are rejected unless the buggy search misses the cart — never stated (Q2, Q3 exposes:false)
- [MAJOR] routes-past-the-coffee-cart S2: "CORRECT OUTPUT" wants a flat node set while Step 1 outputs were route lists
- [MAJOR] routes-past-the-coffee-cart S4: cases 2–3 show `roads/coffeeCart` input but code reads `input.graph/input.checkpoint` (throws when run literally)
- [MAJOR] routes-past-the-coffee-cart S4: same bug and same two distractors ×3; case 2 reuses Step 1 Q1's graph
- [MAJOR] villages-without-wells S1: builds answerable by "pick the smaller number"; answer is 0 in 6 of 9 builds/remedials
- [MAJOR] villages-without-wells S1: Q1 and Q2 test the same thing (all clusters supplied, answer 0); Q2 has no isolated village despite facet "village identity"
- [MAJOR] villages-without-wells S2: "Jaden erases the outer leaves" but grader keeps leaf nodes and deletes their edges (required: nodes 0,1,2, no edges)
- [MAJOR] villages-without-wells S3: Q2 claim "0 can reach 1, so…" on an edgeless input has a false premise
- [MAJOR] villages-without-wells S3: membership claim polarity flips (Q1/Q2/Q4/Q5 vs Q3)
- [MAJOR] villages-without-wells S3: Q3 wrong-answer feedback begins "Correct."
- [MAJOR] villages-without-wells S4: cases 2–3 show roads= but code reads input.paths; function is solve(input) not countWellsToDig
- [MAJOR] villages-without-wells S4: all 3 cases same bug/code, buggy 1 / correct 0 every time; cases 2–3 reuse Step 1 inputs
- [MAJOR] gas-pocket-survey S4: cases 2–3 show string-row input `["UUU","UUG"], drill=(0,1)` but require nested-array output `[["U","1","U"],…]`
- [MAJOR] gas-pocket-survey S4: same bug and same two weak distractors in all 3 cases (P2)
- [MAJOR] gold-and-silver-lights S2: Josiah round requires drawing every wire far-node-first (hidden goal "Orient a listed wire toward the gold bulb")
- [MAJOR] gold-and-silver-lights S4: case 2 shows raw token "Reachable boundary: root-silver" and lists the exact required nodes/edges
- [MAJOR] gold-and-silver-lights S4: same bug, identical sentences in all 3 cases (P2)
- [MAJOR] dungeon-gold-run S2: Q2 wrong-start requires drawing secret room 1; "CHOOSE THE STARTING ROOM" is readonly
- [MAJOR] dungeon-gold-run S4: code uses nonexistent `input.startKeys || [0]` and never reads `rooms`; "keyring" undefined
- [MAJOR] dungeon-gold-run S4: cases 2/3 display raw slug "Reachable boundary: ignore-found-keys"
- [MAJOR] flooded-campsite-trails S2: flooding cannot be expressed, so no round tests the problem's rule; output is a reach list not true/false
- [MAJOR] flooded-campsite-trails S2: Alejandro round only works if wires are drawn far-node-first (hidden goal "Write a trail in reverse order")
- [MAJOR] flooded-campsite-trails S3: Q1/Q2 reach claims pass through flooded campsites ("2 can reach 0 through 1" with 1 flooded) keyed YES
- [MAJOR] flooded-campsite-trails S4: same bug in all 3 cases (P2)
- [MAJOR] longest-freight-train S4: case 3 input has an L-shaped 4-cell train, violating "straight line … guaranteed valid"; correct answer 4 depends on it
- [MAJOR] one-color-metro-ride S1: Q2 picture captions state each picture's flaw, giving away the answer
- [MAJOR] one-color-metro-ride S1: edges must be coloured red/blue; no guide before first failure
- [MAJOR] one-color-metro-ride S2: "CORRECT OUTPUT" = union of one-colour reachable stations, no destination field, never explained
- [MAJOR] one-color-metro-ride S2: Eva's graph must use edge colour exactly "slate"; not stated
- [MAJOR] one-color-metro-ride S2: Joel round needs a blue edge; hidden goal, red-only drawing fails silently
- [MAJOR] one-color-metro-ride S3: Q1/Q4 wrong-answer feedback begins "Correct."/"Right."
- [MAJOR] one-color-metro-ride S4: case 2 shows raw slug "Reachable boundary: ignore-track-colors"
- [MAJOR] office-rumor-reach S3: Q1/Q3/Q4 wrong-answer feedback begins "Correct."/"Right."
- [MAJOR] package-to-the-outpost S1: Q4 feedback "A later route may be faster" contradicts the one-route tree guarantee (also shown in S3 Q1/Q4)
- [MAJOR] package-to-the-outpost S1: edge hours must be typed as labels (e.g. "4"); format and tool never shown before failure
- [MAJOR] package-to-the-outpost S2: Bella's arrow direction follows click order; must click non-HQ node first; goal hidden
- [MAJOR] package-to-the-outpost S3: Q1/Q3/Q4 wrong-answer feedback begins "Right."
- [MAJOR] package-to-the-outpost S4: cases 2–3 show raw slug "Reachable boundary: unweighted-route"
- [MAJOR] perfect-size-campsites S2: Patrick's hidden start "(0,1)" must exist in the student's drawing; only shown in Drawing 2 title
- [MAJOR] perfect-size-campsites S3: Q1/Q5 wrong-answer feedback begins "Correct."
- [MAJOR] count-routes-to-summit S4: cases 2/3 wrong-choice feedback says "lost earlier at shared node 3" (shared node is 2 / 4)
- [MAJOR] runes-on-the-castle-door S2: root named `start` (S1/S3), `ε` (S2), `empty` (S4)
- [MAJOR] runes-on-the-castle-door S2: required output order puts ε last (`["a","b","ε"]`); root-first is rejected
- [MAJOR] runes-on-the-castle-door S2: "output" is the prefix-node set incl. root, not the code list taught in Step 1
- [MAJOR] runes-on-the-castle-door S4: same bug ×3, "used set" in every correct choice
- [MAJOR] save-the-date-phone-chain S1: Q9 is the identical input and answer as Q8
- [MAJOR] save-the-date-phone-chain S3: edge labels graded ("Edge labels or weights match the input ×") with no guide
- [MAJOR] save-the-date-phone-chain S4: raw token "Reachable boundary: listener-wait-time" shown in cases 2–3
- [MAJOR] save-the-date-phone-chain S4: same bug and identical choices ×3; cases 2–3 are Step 1 Q1/Q2
- [MAJOR] shut-the-garden-valve S1: Q1 and Q2 require the identical drawing (Description example) back-to-back; same input shown 4 times
- [MAJOR] shut-the-garden-valve S2: Q3 Marley starts at hidden node `2`; free positive-integer IDs mean the student may not even have a node 2
- [MAJOR] shut-the-garden-valve S4: raw token "Reachable boundary: ignore-downstream-subtree" shown in cases 2–3
- [MAJOR] shut-the-garden-valve S4: 5-line non-traversing code repeated ×3; cases 2–3 reuse Step 1 inputs
- [MAJOR] biggest-study-group S4: cases 2/3 display raw slug "Reachable boundary: self-entry-adds-member"
- [MAJOR] kth-song-in-playlist S2: labels change from `root=[]` to `root`/`root[0]` with no guide; first error is "Draw 1–8 nodes."; tree requirement unstated; read-only "CHOOSE THE PLAYLIST ROOT"
- [MAJOR] kth-song-in-playlist S4: hidden labels revert to `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=[]`, `root[0][1][0]=2`, `root[1]=3` (etc.) right after Step 2 taught `root[0]`; no guide
- [MAJOR] kth-song-in-playlist S4: graph-proof text names folders A/B/C/"empty" ("Nodes are root, A, 1, 2, B, 3, C, 4, 5…") that appear nowhere and contradict required labels
- [MAJOR] museum-vault-keyring S3: Q2/Q3/Q5 wrong-answer feedback begins "Right."/"Correct."
- [MAJOR] museum-vault-keyring S4: cases 2–3 show raw slug "Reachable boundary: initial-keys-only"
- [MAJOR] top-of-the-pile S2: Step 1 names `root[1]=7` rejected; must drop `=value`; only told after Check
- [MAJOR] top-of-the-pile S2: "CORRECT OUTPUT" wants `["root","root[0]"]`, not the sum
- [MAJOR] top-of-the-pile S4: cases 2–3 display raw token "Reachable boundary: branch-local-shallowest"
- [MAJOR] top-of-the-pile S4: cases 2–3 "Changed graph" names nodes A, B, C that exist nowhere
- [MAJOR] trusted-courier-networks S1: wrong build choice is the office count n in 7 of 9 builds (else 0); predictable
- [MAJOR] trusted-courier-networks S2: Q2 Alana "written order" = click order; drawing 0—1 instead of 1—0 makes the counterexample fail; Drawing 2 must be directed
- [MAJOR] trusted-courier-networks S2: "CORRECT OUTPUT" wants `[0,1,2]`, not the network count
- [MAJOR] trusted-courier-networks S3: Q4 claim "0 can reach 1…" on the identity matrix; false premise
- [MAJOR] ten-kinds-of-people S2: "CORRECT OUTPUT" wants reached cells, not `["decimal"]`
- [MAJOR] ten-kinds-of-people S4: output must be `["decimal"]` with quotes; placeholder shows no string example
- [MAJOR] codewars-array-deep-count S2: Step 1 names rejected ("Use root, root[0]…"); "root" never introduced; "CHOOSE THE OUTER ARRAY" over a readonly field
- [MAJOR] gfg-grid-path-exists S1: Q8 distractors "with diagonal moves" (fragment) and "3 is not the destination" (true statement)
- [MAJOR] gfg-grid-path-exists S1: Q9 distractors "the lower 3 region touches the destination" and "source is on an edge" are true statements
- [MAJOR] gfg-grid-path-exists S4: same "diagonal" bug in all 3 cases (P2)
- [MAJOR] hackerrank-connected-cells S3: Q1 claim "(0,0) can reach (1,2), so…" has a false premise on `[[1,0,0],[0,0,1]]` (cells are isolated); feedback repeats it
- [MAJOR] hackerrank-connected-cells S4: choices/feedback use `dirs`, `seen`, `best` but code has `directions`, `visited`, `largestValue` (all 3 cases)
- [MAJOR] count-sub-islands S2: Q3 wrong-start requires drawing secret cell (0,1) and not starting there; only revealed by the Check error
- [MAJOR] employee-importance S2: label rule rejects id 0 ("Use positive integer IDs") though Steps 1/3/4 all use id 0
- [MAJOR] employee-importance S2: Q3 wrong-start requires drawing secret employee 2 and not starting there
- [MAJOR] employee-importance S4: case 3 correct choice says "follows edge 1→2 but never continues along 2→3" — code called with id 0 follows 0→1 only
- [MAJOR] evaluate-boolean-binary-tree S2: "CHOOSE THE ROOT GATE" is read-only, nodes have no gate values, output must be `["L","R","root"]` not a boolean
- [MAJOR] evaluate-boolean-binary-tree S2: Khloe's (last-branch) graph must be identical to the correct graph despite "using the mistake" (P4)
- [MAJOR] evaluate-boolean-binary-tree S4: same bug/code/diagnosis sentences in all 3 cases (P2)
- [MAJOR] evaluate-boolean-binary-tree S1-4: four different node-naming schemes across the lesson
- [MAJOR] usaco-fence-planning S1: correct answer is always the smaller number in all 9 builds/remedials (and concept Q7)
- [MAJOR] usaco-fence-planning S1: Q8 has one herd (no minimum to take) and duplicates Q6
- [MAJOR] usaco-fence-planning S2: "Correct output" wants a cow-ID list after nine perimeter questions; no coordinates exist to compute a perimeter
- [MAJOR] usaco-fence-planning S2: "CHOOSE THE CHOSEN COW" / wrong-chosen-cow bug describes a concept the real problem does not have
- [MAJOR] usaco-fence-planning S2: `0:(0,0)` labels rejected in Step 2, then secretly required in Step 4 (`0:(0,0)`,`1:(3,2)` etc.) with no guide
- [MAJOR] usaco-fence-planning S3: membership claims flip between "It would be a mistake to use…" (Yes) and "Use this node rule…" (No)
- [MAJOR] usaco-fence-planning S3: wrong-answer feedback begins "Correct."/"Right." (Q1, Q4)
- [MAJOR] usaco-fence-planning S4: all 3 cases same bug/code/choices; cases 2–3 reuse Step 1 inputs with revealed answers
- [MAJOR] usaco-fence-planning S4: cases 2–3 label input cows=/friendships= while code takes positions, pairs
- [MAJOR] find-all-groups-of-farmland S2: output must be reached cells `["(0,0)",…]` after Step 1 trained rectangle answers
- [MAJOR] find-all-groups-of-farmland S2: Bianca's (last-branch) graph must equal the correct graph (P4)
- [MAJOR] find-all-groups-of-farmland S3: Q5 claim "(0,0) can reach (0,2)" has a false premise on land=[[1,0,1]]
- [MAJOR] find-all-groups-of-farmland S4: same bug/code/diagnosis sentences in all 3 cases (P2)
- [MAJOR] flood-fill S2: output must be reached pixels `["(0,0)"]` after Step 1 trained image-matrix answers
- [MAJOR] flood-fill S3: Q3 claim "(0,0) can reach (0,2)" has a false premise on image=[[1,2,1]]
- [MAJOR] flood-fill S4: same "diagonal" bug in all 3 cases (P2)
- [MAJOR] kattis-getting-gold S1: Q1/Q2 require trap-as-isolated-node, directed arrows, draft squares with no outgoing arrows before Q5/Q7 teach them; Description never says so; failure text "The correct model stays hidden"
- [MAJOR] kattis-getting-gold S1: Q1 needs 9 nodes + 16 directed arrows; 16-arrow builds recur in remedials, Step 3 Q4/Q5
- [MAJOR] ladder-takahashi S1: Q7 repeats Q1 (same input, same answer 10); Q1/Q7/Q9 are Description examples with answers printed
- [MAJOR] ladder-takahashi S2: Q2 Dalton (make-one-way) only exposable by clicking the higher floor first (edge 2→1); natural 1—2 drawing yields no counterexample and no hint; Q3 depends on drawing order
- [MAJOR] structy-largest-component S1: no build has more than one component; wrong choice is always count−1 so "bigger number" always wins
- [MAJOR] structy-largest-component S2: "disconnects every leaf" undefined; on a path the seed itself is a leaf so output collapses to `["A"]`
- [MAJOR] structy-largest-component S4: same bug ×3
- [MAJOR] max-area-of-island S4: correct choice says "Offsets with both dr and dc nonzero…" and distractors/feedback say `seen`, `best`; code has `rowChange`/`columnChange`, `visited`, `largestValue`
- [MAJOR] structy-max-root-to-leaf-path-sum S1: "levelOrderIndex" never says it counts null slots; Q1 requires `node 6: 1`, S3 Q5 `node 3: 4`
- [MAJOR] structy-max-root-to-leaf-path-sum S1: `root level-order=[...]` notation never explained; Description only shows objects
- [MAJOR] structy-max-root-to-leaf-path-sum S2: "CORRECT OUTPUT" wants `["L","R","root"]`, not the path sum; values play no role
- [MAJOR] structy-max-root-to-leaf-path-sum S-cross: four different label formats across steps
- [MAJOR] usaco-milk-factory S1: Q2 Picture D feedback says arrows became two-way links, but the picture only reverses one arrow
- [MAJOR] usaco-milk-factory S1: Q7/Q8 re-ask Q1/Q4 inputs (the Description's examples) with answers already shown
- [MAJOR] usaco-milk-factory S2: "Correct output" is forward reach from the test station, opposite to the problem's "who can reach the pickup"; the problem-correct set equals Ezekiel's buggy output
- [MAJOR] usaco-milk-factory S2: "test station" never defined
- [MAJOR] usaco-milk-factory S3: membership claim polarity flips between questions
- [MAJOR] usaco-milk-factory S3: wrong-answer feedback begins "Correct."/"Right." (Q2, Q3, Q5)
- [MAJOR] usaco-milk-factory S4: correct diagnosis cites `next[b].push(a)` — no `next` in code, and `reverse[b].push(a)` is the correct line; the bug is `reverse[a].push(b)`
- [MAJOR] usaco-milk-factory S4: all 3 cases same bug/code/identical diagnosis text; buggy output 1 every time; cases 2–3 reuse Step 1 inputs
- [MAJOR] structy-minimum-island S2: "CORRECT OUTPUT" wants `["(0,0)"]`, not the island size
- [MAJOR] structy-minimum-island S3: Q1 claim "(0,0) can reach (0,2)…" on two separate islands; feedback implies reachability
- [MAJOR] moocast S2: Step 1 format "0: (0,0) p=2" rejected with "Use numeric IDs 0, 1, 2…" and no guide shown
- [MAJOR] moocast S3: Q2/Q5 wrong-answer feedback begins "Correct." next to a red ×
- [MAJOR] path-sum S1: "levelOrderIndex" ambiguous with null slots (node 5: 13, node 6: 4, node 2: -3, node 3: 3, node 6: 5)
- [MAJOR] path-sum S2: Esmeralda "degree-one tree node" undefined; unclear whether a single-child root counts
- [MAJOR] path-sum S2: labels must be root/L/R/LL and output ["L","LL","root"]; Step 1 format rejected with no guide
- [MAJOR] path-sum S3: Q2/Q5 wrong-answer feedback begins "Correct."
- [MAJOR] properties-graph S1: node labels must be de-duplicated sets (`row 0: {1}` for `[1,1]`) but the guide never says so (Q4, bug-trap remedial, S3 Q5)
- [MAJOR] properties-graph S2: invented "chosen row" start for a problem with no start; "Ruben ignores the chosen chosen row" typo
- [MAJOR] properties-graph S2: Q1 "only in its written order" — edges aren't written in this problem's input; means click order
- [MAJOR] properties-graph S4: distractor "use common > k … changing this input's returned value" is literally true and yields the correct answers (cases 1–2)
- [MAJOR] properties-graph S4: same bug/code/diagnosis in all 3 cases; case 2 = Step 1 Q4 input
- [MAJOR] reachable-nodes-with-restrictions S2: "Corbin runs the search from a different node 0" / "CHOOSE THE NODE 0" gibberish; real start 1 hidden
- [MAJOR] reachable-nodes-with-restrictions S2: restrictions cannot be drawn (numeric-only labels) though the round is "Restricted dead end"
- [MAJOR] reachable-nodes-with-restrictions S3: keyed-YES claims that a restricted node "can reach" another (Q1 v2, Q3) contradict the taught rule
- [MAJOR] reachable-nodes-with-restrictions S4: same bug and identical choices ×3; cases 2–3 reuse Step 1 Q1/Q2 inputs
- [MAJOR] transitive-closure S2: "CORRECT OUTPUT" wants `[0,1,2]`, not a matrix
- [MAJOR] transitive-closure S3: Q4 claim "0 can reach 1…" on an edgeless graph; false premise, feedback implies reachability
- [MAJOR] transitive-closure S4: correct choice "Neither source… both diagonal entries" reused verbatim for 3-node and 1-node cases
- [MAJOR] structy-tree-sum S1: levelOrderIndex counts nulls (`node 5: -4`, `node 6: 3`); `[1,null,2,null,null,null,3]` is unreadable in LeetCode format
- [MAJOR] structy-tree-sum S2: "CORRECT OUTPUT" wants `["L","R","root"]`, not the sum
- [MAJOR] structy-tree-sum S-cross: four different label formats across steps
- [MAJOR] wheres-my-internet S1: Q7 = Q1 input = Example 1 (answer already shown); Q8 = Example 2 verbatim
- [MAJOR] wheres-my-internet S2: "Correct output" is the ONLINE set while the function returns OFFLINE houses (real answer [] vs required [1,2,3,4])
- [MAJOR] wheres-my-internet S2: Heaven (make-one-way) with start locked at 1 can only be exposed by clicking the other house first; no hint
- [MAJOR] wheres-my-internet S3: Q5 claim "1 can reach 2, so…" on an edgeless input has a false premise
- [MAJOR] wheres-my-internet S3: membership claim polarity flips (Q3 vs others)
- [MAJOR] wheres-my-internet S3: Q3 wrong-answer feedback begins "Correct."
- [MAJOR] wheres-my-internet S4: all 3 cases same bug/code/identical correct sentence; cases 2–3 reuse Step 1 inputs
- [MAJOR] all-7 S3: wrong-answer feedback on YES-keyed claims begins "Correct."/"Right." next to an × mark
- [MAJOR] all-7 S4: three cases share one bug, identical code and the same correct diagnosis sentence; cases 2–3 are repeats
- [MAJOR] number-of-connected-components S1: Q8 and Q9 re-ask Q1 and Q2 with identical inputs (also Examples 1–2)
- [MAJOR] number-of-connected-components S2: Hailey's Drawing 2 must be DIRECTED with arrows in click order; "written order" meaningless without an edge list
- [MAJOR] number-of-connected-components S3: claims cite "isolated 3, and isolated 4" on n=3 inputs and "edge [1,2]" on inputs without it
- [MAJOR] time-needed harness: all four steps crashed; nothing verified in the UI.
- [MAJOR] time-needed S1: predict-output input informTime=[4] for a head with no reports contradicts the Description ("informTime[i] == 0").
- [MAJOR] time-needed S1: bug-trap = build-star = Description Example 2 (narrated); predict-output = Example 1.
- [MAJOR] time-needed S2: "Correct output" for a minutes problem wants `[0,1,2]` employee list.
- [MAJOR] time-needed S4: case 3 proof text unreadable ("Nodes: head 0, delay 2, manager 1, delay 3, …").
- [MAJOR] time-needed S4: three identical cases; code never builds a graph; case 2 = Step 1 build-branch.
- [MAJOR] water-and-jug harness: all four steps crashed; nothing verified in the UI.
- [MAJOR] water-and-jug S1: predict-output/bug-trap are Description Examples 1–2; correct choice paraphrases the Description; fragment choices.
- [MAJOR] water-and-jug S2: "Correct output" for a true/false problem wants `["(0,0)","(1,0)"]` state list.
- [MAJOR] water-and-jug S2: wrong-start round needs a state unreachable from the fixed start (0,0), impossible in a real jug graph; legality never checked.
- [MAJOR] water-and-jug S3 (predicted): degree claims keyed against the partial canvases contradict the jug move rule.
- [MAJOR] water-and-jug S4: exact drawings of 10/18/26 arrows (with empties) for code that never uses a graph, after Step 1 taught 4-edge partial graphs.

### Minor
- [MINOR] all-paths-from-source-to-target S1: Q9 bug-trap answer ("five different ways") is printed in Description Example 2; Q1/Q3 reuse Example 1
- [MINOR] all-paths-from-source-to-target S1: Q9 "6 paths" feedback is jargon ("dead-end-free branches … freely interchangeable")
- [MINOR] all-paths-from-source-to-target S1: relation-rule remedial `[[],[0],[]]` distractor `[[0,1,2]]` cannot come from "reverse arrows" (reversed graph also returns [])
- [MINOR] all-paths-from-source-to-target S1: input `[[1,2],[3],[3],[4],[]]` built three times (Q4, bug-trap remedial, S4 case 1)
- [MINOR] all-paths-from-source-to-target S2: "CHOOSE THE SOURCE NODE" field is read-only
- [MINOR] all-paths-from-source-to-target S2: Q3 says "Edge numbers show drawing order" but harness saw no numbers
- [MINOR] all-paths-from-source-to-target S3: membership claims/feedback cite node 3 / 0→1→3 on inputs that have no node 3
- [MINOR] battleships-in-a-board S1: Q2 Picture D feedback "has no outgoing move" for a cell that has a neighbour
- [MINOR] battleships-in-a-board S1: Example-1 board used in Q1, Q2, Q7, S4 case 2; `[["X",".","X"]]` in Q6, Q9, S4 case 3
- [MINOR] battleships-in-a-board S1: Q9 "What does the one-row board … contain?" doesn't ask for a count
- [MINOR] battleships-in-a-board S2: Q2 "every listed connection except the last one" — a board has no listed connections
- [MINOR] battleships-in-a-board S3: Q1/Q2/Q4 "mistaken" node rules give the identical graph for the shown input (one-cell ships, no water cells)
- [MINOR] battleships-in-a-board S3: "× Correct. A zero-step path…" after a wrong answer
- [MINOR] battleships-in-a-board S4: cases 2–3 repeat case 1's bug and diagnosis text
- [MINOR] course-schedule S1: Q4 and Q8 same input (Description Example 2); Q1/Q7 are Examples 3/1
- [MINOR] course-schedule S1: relation-rule remedial admits either orientation gives true; "reverse pair semantics bug" feedback false
- [MINOR] course-schedule S2: Q1 needs Drawing 2 undirected; toggle never mentioned
- [MINOR] course-schedule S3: "Only courses that appear in prerequisites" rule asked on inputs where every course appears (Q1 var1, Q2)
- [MINOR] course-schedule S3: "× Correct. The mini-example lists 0→1…" after a wrong answer
- [MINOR] course-schedule S4: misconception title "A merge is mistaken for a cycle" wrong for cases 2–3 (no merge; code fails on any edge)
- [MINOR] course-schedule S4: outer loop variable named `column`
- [MINOR] detonate-the-maximum-bombs S1: Q2 distractor "2" attributed to "compare diameter" bug that still gives 1
- [MINOR] detonate-the-maximum-bombs S1: Q7 and Q9 are Description Examples 1 and 2 verbatim
- [MINOR] detonate-the-maximum-bombs S2: Q3 "stops reading one relation too early" — bomb edges are computed, not read
- [MINOR] detonate-the-maximum-bombs S3: "× Right. A multi-step route through B…" after a wrong answer
- [MINOR] evaluate-division S1: remedial choice shown as 0.16666666666666666 instead of 1/6
- [MINOR] evaluate-division S3: "Right."/"Correct." shown under red ×
- [MINOR] evaluate-division S4: correct output shown as [0.16666666666666666]
- [MINOR] find-if-path-exists-in-graph S1: Q7 choices are fragments ("through 0→1→2; the direct pair cannot be used")
- [MINOR] find-if-path-exists-in-graph S1: bug-id feedback ("assume all listed vertices connect bug")
- [MINOR] find-if-path-exists-in-graph S2: Q3 Esme's source "1" hidden until Drawing 2; must be in a different component to expose
- [MINOR] find-if-path-exists-in-graph S2: output box wants [0,1] though problem returns true/false
- [MINOR] find-if-path-exists-in-graph S3: claims list edges reversed vs input ("2—1 and 1—0")
- [MINOR] find-if-path-exists-in-graph S3: "Right." under red ×
- [MINOR] flatten-nested-list-iterator S1: "What should the function return?" for an iterator class
- [MINOR] flatten-nested-list-iterator S1: bug-id feedback ("emit list direct integers before nested bug")
- [MINOR] flatten-nested-list-iterator S2: Q2 "last branch" = last-drawn edge; drawing order decides exposure
- [MINOR] flatten-nested-list-iterator S3: claims are unreadable bracket walls
- [MINOR] is-graph-bipartite S1: same two inputs reused across Q5, remedials, S3 Q3/Q5, S4 cases 1–2
- [MINOR] is-graph-bipartite S1: bug-id feedback ("skip index with empty zero component bug")
- [MINOR] is-graph-bipartite S2: Q3 "final listed route" means last-drawn edge
- [MINOR] is-graph-bipartite S2: lab never simulates coloring; "CORRECT OUTPUT" is [0,1]
- [MINOR] is-graph-bipartite S3: Q4 rule premise false (node 2 has a neighbor); "Correct." under ×
- [MINOR] is-graph-bipartite S4: awkward choice tails "…for the shown graph"
- [MINOR] keys-and-rooms S1: bug-id feedback ("count all mentioned keys as reachable bug")
- [MINOR] keys-and-rooms S2: "CORRECT OUTPUT" wants [0] not true/false
- [MINOR] keys-and-rooms S3: Q1 v1 feedback "Room 2 still exists…" on an input where room 2 is reachable; "Correct." under ×
- [MINOR] keys-and-rooms S4: vague "Reachable boundary: The only useful-looking connection points into the start room."
- [MINOR] kill-process S1: Q9 is Example 2 verbatim and duplicates Q8; Q7 repeats Q1 with edges given
- [MINOR] kill-process S1: bug-id feedback ("include ppid zero bug")
- [MINOR] kill-process S2: Q2 Louis's process "2" hidden until Drawing 2; must be in a different subtree
- [MINOR] kill-process S3: claims quote "Processes 0, 3, 1, and 5" for pid=[1,2,3]/[2,6]; "Correct." under ×; check `pid` inline-code rendering
- [MINOR] letter-combinations-of-a-phone-number S1: digits="" asked three times; "What result belongs at the root" wording
- [MINOR] letter-combinations-of-a-phone-number S1: "3 unique combinations" — "unique" only on the correct choice
- [MINOR] letter-combinations-of-a-phone-number S1: no build ever draws a two-digit tree though Q3/Q5/Q7 ask about "23"
- [MINOR] letter-combinations-of-a-phone-number S1: bug-id feedback ("use previous keypad row bug")
- [MINOR] letter-combinations-of-a-phone-number S2: hidden shape rules (parent prefix must exist, max 4 letters); no digits in the lab
- [MINOR] letter-combinations-of-a-phone-number S2: "CORRECT OUTPUT" includes ε and internal prefixes, not the problem's answer
- [MINOR] letter-combinations-of-a-phone-number S3: all inputs single-digit so direct-vs-reach claims are trivial; "Correct. The mini-example lists empty prefix→y" under ×
- [MINOR] letter-combinations-of-a-phone-number S3: Q1/Q3 quote "ad and cf" for digits "9"/"7"
- [MINOR] letter-combinations-of-a-phone-number S4: "any order" in statement but ["c","b","a"] rejected; artificial Math.min(1, …) in code
- [MINOR] longest-increasing-path-in-a-matrix S1: Q7 correct choice "4 cells" formatted unlike "3/5/6"; path printed in the question
- [MINOR] longest-increasing-path-in-a-matrix S1: Q9 feedback "2 and 3 are diagonal" is false for the grid (2 at (1,1) touches 3 at (1,0))
- [MINOR] longest-increasing-path-in-a-matrix S1: bug-trap remedial distractor "2" attributed to a global-visited bug that returns 3
- [MINOR] longest-increasing-path-in-a-matrix S2: "starting cell"/"OUTPUT" contradict a problem with no start and a numeric answer
- [MINOR] longest-increasing-path-in-a-matrix S2: "Edge numbers show drawing order." shown but no order badges captured — verify
- [MINOR] longest-increasing-path-in-a-matrix S3: Q1 claim "(0,0) can reach (0,1), so…" has a false premise on [[1,1]]
- [MINOR] longest-increasing-path-in-a-matrix S3: guide "Do not add spaces / (row,column)" vs panel "Both (0,2) and 0,2 work"
- [MINOR] longest-increasing-path-in-a-matrix cross-step: [[1,2],[4,3]], [[3,2,1]], [[1,2],[2,3]] reused across S1/S3/S4
- [MINOR] minesweeper S1: bug-trap remedial is a verbatim repeat of Q4 (also S3 Q3 and S4 case 1)
- [MINOR] minesweeper S1: Q8 "What should the picture do next?" wording; shown board unused
- [MINOR] minesweeper S1: core-rule remedial distractor explained as "count revealed blank as mine bug"
- [MINOR] minesweeper S2: OUTPUT wants reached squares while the function returns a board; graph has no E/M contents
- [MINOR] minesweeper S2: Christopher's wrong click "(0,1)" only in Drawing 2 title / post-Check error
- [MINOR] minesweeper S2: correct graph never checked against the 8-neighbour rule; real 8-neighbour graph cannot expose Chloe
- [MINOR] minesweeper S3: node-rule feedback captured with line breaks around E / M / B code spans — verify rendering
- [MINOR] minesweeper S4: case 3 requires all 11 edges of a 2×3 eight-neighbour graph incl. edges into the mine
- [MINOR] nested-list-weight-sum Description: Example 3 prints "undefined"
- [MINOR] nested-list-weight-sum S1: Q9 feedback "from the other problem" is meaningless
- [MINOR] nested-list-weight-sum S1: Q2 pictures named "Outer array / Array at [0]" vs required "root=[]"
- [MINOR] nested-list-weight-sum S1: node rule worded differently in Q4 ("integer nodes 3, 1, and 7") and Step 3
- [MINOR] nested-list-weight-sum S1: remedial bug names ("add list node to depth", "weight top level too deep") don't map to the numbers
- [MINOR] nested-list-weight-sum S2: "CHOOSE THE OUTER LIST" over a read-only field
- [MINOR] nested-list-weight-sum S2: "reads every from/to relationship backward" undefined for a containment tree
- [MINOR] nested-list-weight-sum S2: tree-shape constraints only appear as post-Check errors
- [MINOR] nested-list-weight-sum S4: "inverse-weight variant" jargon in distractor feedback
- [MINOR] nested-list-weight-sum-ii S1: Q9 [1,[[]]] "Why" should state that list depth doesn't count toward maxDepth
- [MINOR] nested-list-weight-sum-ii S1: Q3 answer "preserving all three nesting levels" reused as the general rule in Step 3
- [MINOR] nested-list-weight-sum-ii S1: Q2 picture naming vs required labels
- [MINOR] nested-list-weight-sum-ii S1: template bug names ("assume extra empty depth bug", etc.)
- [MINOR] nested-list-weight-sum-ii S2: Ashley's wrong container "root[0]" not in bug text
- [MINOR] nested-list-weight-sum-ii S2: James "final direct link" = last-drawn edge; hidden tree errors
- [MINOR] nested-list-weight-sum-ii S2: "CHOOSE THE ROOT CONTAINER" over a read-only field
- [MINOR] nested-list-weight-sum-ii S4: "inverse weight is 4-depth" wording; bug doesn't change the graph
- [MINOR] network-delay-time S1: Q7 repeats Q1 (answer shown in Q1 feedback and Example 1); Q9 is Example 2
- [MINOR] network-delay-time S1: "ignore relaxation bug" and other template names
- [MINOR] network-delay-time data: authored graph rules are example answers ("A one-way arrow 1→3 labeled 5")
- [MINOR] network-delay-time S2: weights vanish; OUTPUT is the reached set, not a time
- [MINOR] network-delay-time S3: claim "Only node 2 and nodes reachable from it" quoted on k=1 inputs
- [MINOR] network-delay-time S3: edge labels graded with no instruction; no model panel
- [MINOR] network-delay-time S4: "priority queue"/"tentative time" distractor jargon
- [MINOR] number-of-increasing-paths-in-a-grid S1: bug-trap remedial identical to Q6
- [MINOR] number-of-increasing-paths-in-a-grid S1: Q7 "9" feedback — allowing equal steps gives 13
- [MINOR] number-of-increasing-paths-in-a-grid S1: template bug names
- [MINOR] number-of-increasing-paths-in-a-grid S2: "path's first cell"/OUTPUT mismatch with a path-count problem
- [MINOR] number-of-increasing-paths-in-a-grid S3: Q5 claim with false premise on [[2,2]]
- [MINOR] number-of-increasing-paths-in-a-grid S3: guide vs panel label-format conflict
- [MINOR] number-of-increasing-paths-in-a-grid S4: case 1 "Changed graph" names cells by value (1→2, 1→4) while drawing needs coordinates
- [MINOR] number-of-islands S1: slug feedback "the use eight direction dfs bug" etc. on every build/remedial distractor.
- [MINOR] number-of-islands S3: wrong-answer feedback begins "Correct."/"Right." (Q1, Q2, Q3, Q4).
- [MINOR] number-of-islands S3: guide says "(row,column)… no spaces" while graph-wrong feedback says "Both (0,2) and 0,2 work."
- [MINOR] number-of-islands S4: only the correct choice is an "It …" description; distractors are "should" statements.
- [MINOR] number-of-islands S4: "Changed graph" text describes the correct graph; "source-repo reference solution" jargon.
- [MINOR] number-of-islands cross: same grids reused across Step 1 remedials, Step 3 and Step 4.
- [MINOR] number-of-provinces S1: "identity matrix" jargon (Q9); "how many provinces are shown?" (Q7).
- [MINOR] number-of-provinces S1: Q6 distractor "two opposite arrows" is behaviourally equivalent and defensible.
- [MINOR] number-of-provinces S1: slug feedback ("the count mirrored entries as two components bug" …).
- [MINOR] number-of-provinces S2: Riley's substitute city 1 hidden; "province seed city" jargon.
- [MINOR] number-of-provinces S3: wrong-answer feedback begins "Right."/"Correct."; "mini-example" jargon.
- [MINOR] number-of-provinces S3: third wording of node rule ("One node for each matrix row and column index").
- [MINOR] number-of-provinces S4: feedback says "Friendship is mutual" / "friendship edges" — lesson is about cities and roads.
- [MINOR] number-of-provinces S4: "should" distractors with "changing this input's returned value" tail; answer is the only "It …".
- [MINOR] number-of-provinces cross: every Step 3 input and Step 4 cases 2–3 are Step 1 inputs.
- [MINOR] possible-bipartition S1: Q1 success text "A valid split is {1,4} and {2,3}" gives away Q8; Q9 reuses Q2's input.
- [MINOR] possible-bipartition S1: Q9 correct choice is the only verdict among three procedure-style distractors.
- [MINOR] possible-bipartition S1: Q3 Picture D feedback says "no outgoing move" on an undirected graph.
- [MINOR] possible-bipartition S2: start label duplicated ("CHOOSE THE FIRST PERSON COLORED / first person colored").
- [MINOR] possible-bipartition S3: wrong-answer feedback starts with "Right."; degree feedback just restates the claim.
- [MINOR] possible-bipartition S4: "Changed graph" line lists an unchanged graph; "should"-phrased distractors stand out.
- [MINOR] smallest-string-with-swaps S1: Q7/Q9 repeat Q1/Q3 inputs whose answers were shown; Q9 stem states the reason.
- [MINOR] smallest-string-with-swaps S1: Q2 Picture D feedback "no outgoing move" on an undirected graph.
- [MINOR] smallest-string-with-swaps S2: Q3 wrong position (1) only revealed in Drawing 2's title.
- [MINOR] smallest-string-with-swaps S3: "Right."/"Correct." leading wrong-answer feedback; restating degree feedback.
- [MINOR] smallest-string-with-swaps S4: opaque boundary/distractor text; output must be `"ba"` with double quotes, placeholder shows no string example.
- [MINOR] time-needed-to-inform-all-employees S1: Q8 restates Q1 with the answer in the stem.
- [MINOR] time-needed-to-inform-all-employees S1: Q5 "useful traversal graph" undefined; distractor 4→1 is a defensible model.
- [MINOR] time-needed-to-inform-all-employees S3: "Correct." leading wrong-answer feedback; Q1 trivial with restating feedback.
- [MINOR] time-needed-to-inform-all-employees S4: both distractors end "…changing this input's returned value."
- [MINOR] water-and-jug-problem S1: Q7/Q9 are Description Examples 1–2 with the reasoning printed; Q3 feedback "connection that appears in the input".
- [MINOR] water-and-jug-problem S2: "CHOOSE THE STARTING STATE" is read-only; Austin's start "(0,1)" only in Drawing 2 title.
- [MINOR] water-and-jug-problem S3: "Right." leading wrong-answer feedback.
- [MINOR] water-and-jug-problem S4: distractor "Filling a jug directly is not an allowed move…" states a false rule; gcd distractor is jargon.
- [MINOR] word-search S1: Q8/Q9 answers printed in Description examples; Q3 feedback "connection that appears in the input".
- [MINOR] word-search S2: Q1 diagonal detection relies on coordinate labels; not stated.
- [MINOR] word-search S3: "Right." leading wrong-answer feedback.
- [MINOR] who-keeps-their-job S1: Q8 distractor includes the quitter; "array position" jargon in feedback.
- [MINOR] who-keeps-their-job S1: Q4 distractor cites "10 → 20", IDs not in the input (re-quoted in Step 3).
- [MINOR] who-keeps-their-job S2: output box is the real answer (remaining IDs) but success text says "different reachable sets"; inconsistent with other problems.
- [MINOR] who-keeps-their-job S2: bug wording "from/to relationship", "listed connection except the last one", "one hop".
- [MINOR] who-keeps-their-job S3: Q5 one-node self-edge claim "Because 42 can reach itself…".
- [MINOR] who-keeps-their-job S3: wrong-answer feedback begins "Right."/"Correct.".
- [MINOR] who-keeps-their-job S4: `const { ids, quitId } = input` destructuring unexplained; input shown in two formats; "Changed graph" is the correct graph.
- [MINOR] who-keeps-their-job S4: "The comparator is numeric." jargon.
- [MINOR] busiest-shelf-level S1: Q8 states the tie in the question and repeats Q4's input; "depth-3 box is empty" is at depth 2
- [MINOR] busiest-shelf-level S1: Q9 `items=[7]` distractor feedback "shifts depth when crossing an array container" — no container to cross
- [MINOR] busiest-shelf-level S1: Q5 input box shows stray line "Focus on one listed relation."
- [MINOR] busiest-shelf-level S2: "CHOOSE THE OUTER SHELF" read-only; "Diego keeps only the last branch it sees"
- [MINOR] busiest-shelf-level S3: "× Right. A multi-step route…" after a wrong answer
- [MINOR] busiest-shelf-level S4: case 1 input shown as `items: [1, [2, 3], [[4]]]` (different format)
- [MINOR] coins-on-level-k S1: Q1 distractor 5 is the depth-2 sum but feedback says "includes coins one level deeper" (that would be 6)
- [MINOR] coins-on-level-k S1: remedial distractors 6 (`[[],[5]]`) and 10 (`[0,[0,[9]]]`) are impossible with false "deeper coins" feedback
- [MINOR] coins-on-level-k S2: "CHOOSE THE OUTER BOX" read-only
- [MINOR] coins-on-level-k S3: Q2 "Only positive-valued coins" rule gives identical graph (no negatives)
- [MINOR] coins-on-level-k S4: case 1 "Changed graph" sentence garbled ("two edges below the root container's contents convention")
- [MINOR] counting-constellations S1: answer "1" on 7 of 9 two-choice builds
- [MINOR] counting-constellations S1: Q9 "3" feedback unreadable ("explores from one top star only one diagonal direction, then starts two extra searches")
- [MINOR] counting-constellations S3: Q3 `[[1,1,1]]` "rows with at least two stars" rule gives identical graph
- [MINOR] counting-constellations S3: "× Right. A multi-step route…" after a wrong answer
- [MINOR] counting-constellations S4: cases 1 and 3 same idea, case 2 = Step 1 Q2; same diagnosis sentence thrice
- [MINOR] counting-docked-boats S1: string-row marina notation ("B...B") never defined; array notation used elsewhere
- [MINOR] counting-docked-boats S1: Q5 code box contains "Focus on one listed relation."
- [MINOR] counting-docked-boats S3: Q1 v2 claim "(0,0) can reach (2,2), so…" has a false premise
- [MINOR] counting-docked-boats S4: choices/feedback say "seen"; code uses `visited`
- [MINOR] counting-docked-boats S4: case 2 feedback grammar "all two links"
- [MINOR] counting-docked-boats S4: case 3 correct choice restates the answer vs terse distractors
- [MINOR] routes-past-the-coffee-cart S1: Q7/Q8 stems state the answer ("two pass intersection 3", "the only customer route skips 2")
- [MINOR] routes-past-the-coffee-cart S1: "0 complete routes reaches the customer" grammar in remedial feedback
- [MINOR] routes-past-the-coffee-cart S2: "direct neighboring choices" wording
- [MINOR] routes-past-the-coffee-cart S3: backticks/markdown leak into feedback and claim text
- [MINOR] villages-without-wells S1: paths/roads/"road components"/solve vs countWellsToDig vocabulary drift
- [MINOR] villages-without-wells S1: Q7/Q9 state the clusters in the question, leaving only counting
- [MINOR] villages-without-wells S1: Q6 raw-input box contains the instruction "Focus on one listed relation."
- [MINOR] villages-without-wells S2: output box wants a village list after nine "how many wells" questions, no hint
- [MINOR] villages-without-wells S2: "CHOOSE THE VILLAGE WITH A WELL" allows one well; Autumn's wrong well only in Drawing 2 title
- [MINOR] villages-without-wells S2: Carson "final listed route" = drawing order; verify edge numbers show
- [MINOR] villages-without-wells S3: Q4 and Q5 use the identical direct-vs-reach claim (edges written reversed)
- [MINOR] villages-without-wells S3: backtick code spans in feedback captured on separate lines; verify inline rendering
- [MINOR] villages-without-wells S4: isolated-village distractor applies to none of the inputs; directed-paths distractor refuted by visible code
- [MINOR] villages-without-wells S4: input formatting differs between case 1 and cases 2–3
- [MINOR] gas-pocket-survey S1: Q8 repeats Q1 in a second, unexplained input notation
- [MINOR] gas-pocket-survey S1: Q9 states "touches gas only diagonally" in the question, giving the answer
- [MINOR] gas-pocket-survey S1: Q2 requires 9 nodes/12 edges for a two-neighbour decision
- [MINOR] gas-pocket-survey S2: no gas in Step 2; output is reached cells, problem returns a grid
- [MINOR] gas-pocket-survey S3: Q4 "Only gas cells" rule yields the required graph for cave=["G"]
- [MINOR] gas-pocket-survey S3: `(row,column)` rendered on its own line in feedback
- [MINOR] gas-pocket-survey S4: misconception title "stops the reveal" is wrong for case 3 (digit 1→2)
- [MINOR] gold-and-silver-lights S1: builds ask "even number of wires from bulb 0" before gold=even is taught; all 9 builds hinge on the same distance-0 trick
- [MINOR] gold-and-silver-lights S1: `goldStart=0` is not a problem parameter and appears inconsistently
- [MINOR] gold-and-silver-lights S1: counterexample remedial reuses Q6's input
- [MINOR] gold-and-silver-lights S2: output `[0,1]` for a count problem
- [MINOR] gold-and-silver-lights S3: backticked `0`/`n−1` render as separate lines in feedback
- [MINOR] gold-and-silver-lights S4: input notation differs between case 1 and cases 2–3
- [MINOR] dungeon-gold-run S1: Q7/Q8 question text lists the reachable rooms and gold, so the input is unnecessary
- [MINOR] dungeon-gold-run S1: Q5 code box contains "Focus on one listed relation."
- [MINOR] dungeon-gold-run S2: Q1 make-two-way needs Drawing 2 switched to undirected; not stated
- [MINOR] dungeon-gold-run S3: zero-gold / unreachable-room membership claims on inputs where every room has gold / is reachable
- [MINOR] dungeon-gold-run S4: correct choice says "worklist" though none exists in the code
- [MINOR] flooded-campsite-trails S1: Q7/Q9 are 3-vs-1 odd-one-out answer sets; Q9's answer is quoted in the Description
- [MINOR] flooded-campsite-trails S1: edge-rule remedial "Read one direct relation" has trails=[]
- [MINOR] flooded-campsite-trails S2: Stephanie's hidden start "1" collides if the student starts at 1
- [MINOR] flooded-campsite-trails S3: degree counts include flooded neighbours without saying so
- [MINOR] flooded-campsite-trails S3: backticked `0`/`n−1` render as separate lines in feedback
- [MINOR] flooded-campsite-trails S4: case 3 choice/feedback say "seen" but the code uses `visited`
- [MINOR] longest-freight-train S1: Q7 input box contains stray line "Focus on one listed relation."; diagonal distractor is harmless under the no-corner-touch guarantee
- [MINOR] longest-freight-train S1: concept-counterexample remedial reuses Q1's input (also Step 3 Q4)
- [MINOR] longest-freight-train S2: "first train car" has no meaning in this problem; wrong car (0,1) only in error/Drawing 2 title; grader accepts impossible yards (adjacent T cells with no edge)
- [MINOR] longest-freight-train S3: Q1/Q4 "(0,0) can reach (2,1)/(2,2), so…" false premise; node-rule feedback renders as broken lines "containing / T / ; empty / . / cells"; "Correct." under ×
- [MINOR] longest-freight-train S4: case 2 shows raw slug "Reachable boundary: first-component-only"; identical code ×3; case 2 input = Step 1 Q4
- [MINOR] longest-freight-train S4: array-of-arrays vs array-of-strings inputs across cases/steps; `solve(input)` vs `longestTrain(yard)`
- [MINOR] one-color-metro-ride S1: Q7 has two "true" choices while asking what the function returns
- [MINOR] one-color-metro-ride S1: Q4/Q7/Q9 raw-input box shows only "source = 0, destination = 2" under "draw this input"
- [MINOR] one-color-metro-ride S3: "red copy and blue copy of every station" is a valid model; feedback uses "committed model" jargon
- [MINOR] one-color-metro-ride S3: node-rule wording differs from Step 1; Step 1 has no node-rule question
- [MINOR] one-color-metro-ride S4: case 1 is Description Example 2; buggy output true in all three cases
- [MINOR] one-color-metro-ride S4: feedback says "enters seen"; code uses visited; input format differs between cases
- [MINOR] office-rumor-reach S1: Q9 (n=1) choices 1|2 and counterexample-remedial choices 6|5 contain impossible values
- [MINOR] office-rumor-reach S1: Q8 drops "Including the starter" used by every other question
- [MINOR] office-rumor-reach S1: concept-edge remedial "Read one direct relation" has friendships=[]
- [MINOR] office-rumor-reach S1: Q5 raw-input box contains "Focus on one listed relation."
- [MINOR] office-rumor-reach S2: Naomi "disconnects every leaf" — leaf undefined; 3-node chain loses all edges
- [MINOR] office-rumor-reach S3: Q5 claim asserts false premise "0 can reach 1" for friendships=[]
- [MINOR] office-rumor-reach S3: Q2 edge written "4—0" for input [0,4]; Q1 feedback code-span line breaks
- [MINOR] office-rumor-reach S4: same three diagnosis shapes in all cases
- [MINOR] package-to-the-outpost S1: Q4/Q6 feedback uses "best time"/"more roads can still be faster" language from a non-tree problem
- [MINOR] package-to-the-outpost S1: Q1/Q2 are Description Examples 1 and 2 verbatim, reused as S4 cases 2–3
- [MINOR] package-to-the-outpost S3: Q1 feedback code-span line breaks
- [MINOR] package-to-the-outpost S4: buggy output is 2 in all three cases; input format differs between cases
- [MINOR] perfect-size-campsites S1: Q1 is Description Example 1; Q3 "Why" mentions direction and edge label
- [MINOR] perfect-size-campsites S2: "first grass square"/reachable-set output has no counterpart in the count-returning problem
- [MINOR] perfect-size-campsites S3: Q1 feedback code-span line breaks; Q5 claim joins two statements
- [MINOR] perfect-size-campsites S4: buggy output 0 in all three cases; case 1 reuses S1 Q2 input; "marked seen" vs visited
- [MINOR] count-routes-to-summit S1: remedial input graph=[[],[0],[]] (trail 1→0) contradicts "always uphill"; reused in S3 Q2
- [MINOR] count-routes-to-summit S1: Q2 "Why" mentions "edge label" though the problem has none
- [MINOR] count-routes-to-summit S2: "CHOOSE THE BASE CAMP" over a readonly field
- [MINOR] count-routes-to-summit S4: only the correct choice names input-specific nodes
- [MINOR] count-routes-to-summit S4: distractor "Adding the recursive branch counts…" too vague
- [MINOR] runes-on-the-castle-door S1: Q7/Q8 inputs drop the quotes (`[ab,ab,a]`)
- [MINOR] runes-on-the-castle-door S1: Q2 "Why" mentions edge labels that don't exist
- [MINOR] runes-on-the-castle-door S1: remedial question "How many complete prefix-state leaves exist?" is jargon
- [MINOR] runes-on-the-castle-door S1: concept-output remedial is Description Example 2
- [MINOR] runes-on-the-castle-door S2: "Kenneth uses the wrong empty code" gibberish; real start `a` hidden
- [MINOR] runes-on-the-castle-door S3: Q1 variants repeat the identical reach claim three times
- [MINOR] runes-on-the-castle-door S4: diagnosis text numbers dials 1-based ("dial 3", "dial 1") vs 0-based `dials[i]`
- [MINOR] save-the-date-phone-chain S1: Q1/Q2 are Description Examples 1/2 verbatim
- [MINOR] save-the-date-phone-chain S1: remedial "How many person nodes are in the tree?" answer is just n
- [MINOR] save-the-date-phone-chain S2: reached-set output, no wait days at all in Step 2
- [MINOR] save-the-date-phone-chain S3: Q1 variants repeat the same claim; backtick leak "with / headId / as the root"
- [MINOR] shut-the-garden-valve S1: Q9 input repeats the concept-nodes remedial; answer 10 equals shutId 10
- [MINOR] shut-the-garden-valve S2: `1:5` format rejected; output is a list of IDs not liters
- [MINOR] shut-the-garden-valve S3: wrong-answer feedback starts with "Correct."
- [MINOR] shut-the-garden-valve S4: distractors padded with "which changes how the shown graph is evaluated"
- [MINOR] biggest-study-group S1: Q7/Q9 reuse Q1/Q3 inputs whose answers the student already gave
- [MINOR] biggest-study-group S1: Q5 code box contains "Focus on one listed relation."
- [MINOR] biggest-study-group S1: Q5 choice B (diagonal self-loop) doesn't address "between different students"
- [MINOR] biggest-study-group S2: "CHOOSE THE FIRST STUDENT IN THE GROUP" misnames the search start
- [MINOR] biggest-study-group S2: Q3 bug text uses untaught term "degree-one node"
- [MINOR] biggest-study-group S3: Q5 "no direct 0—0 edge" claim on worked=[[1]] conflicts with visible diagonal 1
- [MINOR] biggest-study-group S4: distractors carry boilerplate tails the correct choice lacks
- [MINOR] biggest-study-group S4: case 1 input notation differs from cases 2/3
- [MINOR] kth-song-in-playlist S1: Q2 pictures labelled "Outer array / Array at [0] / 1 at [0][0]" vs guide's `root=[]` notation
- [MINOR] kth-song-in-playlist S1: Q1 is Description Example 1; remedials reuse Q7 and Q8 inputs
- [MINOR] kth-song-in-playlist S2: "CORRECT OUTPUT" wants a node list, not the song ID the Description defines
- [MINOR] kth-song-in-playlist S4: code is `solve(input)`/`input.playlist` not `kthSong(playlist, k)`; input format differs between cases; identical code ×3; inputs reused from Step 1
- [MINOR] kth-song-in-playlist S4: distractor "…which changes how the shown graph is evaluated" is meaningless
- [MINOR] museum-vault-keyring S1: Q7 and Q9 repeat Q1 and Q2 inputs and answers (5, 3)
- [MINOR] museum-vault-keyring S1: Q7 distractor "7" feedback (double-count vault 2) actually yields 6
- [MINOR] museum-vault-keyring S1: Q3 "Why" mentions "edge label" though none exist
- [MINOR] museum-vault-keyring S2: "CHOOSE THE INITIAL KEY" allows one key while the problem has a startKeys list
- [MINOR] museum-vault-keyring S3: Q1 feedback renders "Every vault index / 0 / through / n−1" on separate lines
- [MINOR] museum-vault-keyring S4: cases 2–3 reuse S1 Q1/Q2 inputs; same code and same 3 diagnosis sentences in all cases
- [MINOR] museum-vault-keyring S4: shown code has no traversal at all, so graph-proof chain has nothing in the code to point at
- [MINOR] museum-vault-keyring S4: input format differs between case 1 and cases 2–3
- [MINOR] top-of-the-pile S1: Q3 pictures use "Outer array / Array at [0]" while guide uses `root=[]`
- [MINOR] top-of-the-pile S1: Q9 distractor "1" has no derivation; its feedback describes the −5 mistake
- [MINOR] top-of-the-pile S1: Q9 shows Unicode "−5" while inputs use "-5"
- [MINOR] top-of-the-pile S1: Q1 is Description Example 1 verbatim
- [MINOR] top-of-the-pile S1: remedial titles "Protect entity identity" etc. are jargon
- [MINOR] top-of-the-pile S2: Q2 "wrong outer box" is actually inner box `root[0]`, revealed only in Drawing 2
- [MINOR] top-of-the-pile S3: empty-array node rule tested only on inputs with no empty array (Q1 v1, Q2, Q5)
- [MINOR] top-of-the-pile S3: "× Right…" feedback on wrong answers (Q2, Q5)
- [MINOR] top-of-the-pile S4: code is `solve(input)`/`input.items`, not `topLayerSum(items)`
- [MINOR] top-of-the-pile S4: identical code and choices in all three cases
- [MINOR] trusted-courier-networks S1: Q7/Q9 inputs have 0 on the diagonal, contradicting "trust[i][i] is always 10"
- [MINOR] trusted-courier-networks S1: edge rule "trust[i][j] >= k" literally includes self-loops; graphs have none
- [MINOR] trusted-courier-networks S1: Q5 input box ends with stray "Focus on one listed relation."
- [MINOR] trusted-courier-networks S1: remedial titles "Name the real entities" etc. are jargon
- [MINOR] trusted-courier-networks S2: Q1 Cesar's start office 1 hidden until Drawing 2
- [MINOR] trusted-courier-networks S2: "first office in the network" label is clunky and suggests office 0
- [MINOR] trusted-courier-networks S3: Q1 feedback renders "Every office index / 0 / through / n−1 /" on five lines (backticks)
- [MINOR] trusted-courier-networks S3: Q1 v2 "only offices with a score ≥ k" yields the same graph on the star input
- [MINOR] trusted-courier-networks S3: "× Right…" feedback on wrong answers (Q2)
- [MINOR] trusted-courier-networks S4: code is `solve(input)`/`input.trust`, not `countSecureNetworks(trust, k)`
- [MINOR] trusted-courier-networks S4: case 3 says "couriers" where every other screen says "offices"
- [MINOR] trusted-courier-networks S4: identical code in all three cases
- [MINOR] ten-kinds-of-people S1: Q1 requires isolated 0-cell nodes before the node rule is taught in Q3
- [MINOR] ten-kinds-of-people S1: Q7/Q8 are Description examples verbatim
- [MINOR] ten-kinds-of-people S2: "question start" label unexplained
- [MINOR] ten-kinds-of-people S2: Q3 "keeps only the last branch it sees" vaguer than other problems
- [MINOR] ten-kinds-of-people S2: Q1 drawn cells carry no digit; grader joins all diagonals
- [MINOR] ten-kinds-of-people S3: Q5 "Only cells containing 1" yields the same graph on `["111"]`
- [MINOR] ten-kinds-of-people S3: "× Right…" feedback on wrong answers (Q1)
- [MINOR] ten-kinds-of-people S4: case 3 distractor "binary whenever a route has an even number of cells" is nonsense
- [MINOR] ten-kinds-of-people S4: correct choice always contains "diagonal/corner/eight-offset"; keyword giveaway
- [MINOR] codewars-array-deep-count S1: Q3 Picture D feedback ("arrows or two-way links") describes a different mistake than a reversed arrow
- [MINOR] codewars-array-deep-count S1: picture labels ("1 at [0]") never match the required typed names ("[0]=1")
- [MINOR] codewars-array-deep-count S1: Q8 requires straight double quotes in `[0]="x"`
- [MINOR] codewars-array-deep-count S1: Q7/Q9 are the Description examples with answers shown
- [MINOR] codewars-array-deep-count S2: "CORRECT OUTPUT" expects a path list where Step 1 taught a number
- [MINOR] codewars-array-deep-count S3: empty-array membership claims on Q1/Q4 inputs that contain no empty array
- [MINOR] codewars-array-deep-count S4: distractor "number of its missing children" is meaningless / references absent empty array
- [MINOR] codewars-array-deep-count S4: mixed "should"/"does" framing lets the correct choice be spotted by form
- [MINOR] gfg-grid-path-exists S1: "fresh input" wording for a repeated input
- [MINOR] gfg-grid-path-exists S2: Erick's hidden start "(0,1)"
- [MINOR] gfg-grid-path-exists S4: case 2 distractor "The seen key confuses row 1,column 1 with row 11,column 0" names a non-existent variable
- [MINOR] hackerrank-connected-cells S1: Q7/Q9 are Description Examples 1/2 with answers printed; Q9 input reused as Step 4 case 3
- [MINOR] hackerrank-connected-cells S2: "CHOOSE THE REGION SEED / region seed" jargon undefined
- [MINOR] hackerrank-connected-cells S3: Q3 wrong-answer feedback begins "Correct."
- [MINOR] hackerrank-connected-cells S4: nonsense distractors ("best starts at zero … graph-level change", "best should start at one, which alone would make the correct answer five")
- [MINOR] hackerrank-connected-cells S4: three identical code/bug cases; inputs reused from Step 1/3; `grid:` vs `grid=` formats
- [MINOR] count-sub-islands S1: Q8 concept repeats Q6 build input exactly (and the Q7 remedial again)
- [MINOR] count-sub-islands S1: Q7/Q8 are the Description examples with answers shown
- [MINOR] count-sub-islands S2: Q3 passes with side-adjacent land cells left unconnected (grid rule not enforced)
- [MINOR] count-sub-islands S2: "island seed" jargon
- [MINOR] count-sub-islands S3: Q3/Q5 membership claims where the wrong rule yields the same nodes
- [MINOR] count-sub-islands S4: distractor mentions `seen` but code uses `visited`
- [MINOR] count-sub-islands S4: cases 1 and 2 are near-duplicates; cases 2/3 reuse Step 1 inputs
- [MINOR] employee-importance S1: Q7/Q9 are the Description examples and restate every number in the question
- [MINOR] employee-importance S4: "boss's importance added before the loop" distractor is not a believable bug
- [MINOR] evaluate-boolean-binary-tree S1: picture choices print node-name lists, exposing the missing-node distractor (P1, all 7 problems)
- [MINOR] evaluate-boolean-binary-tree S1: `values=/edges=` notation never explained; Description and Q8/Q9 use object form
- [MINOR] evaluate-boolean-binary-tree S1: generic "Why" text after every build
- [MINOR] evaluate-boolean-binary-tree S2: "A Boolean operator node needs both a left and a right child" applied only to drawing 1
- [MINOR] evaluate-boolean-binary-tree S3: "Only leaves containing 0 or 1" rule yields the required graph for values=[0]/[1] yet is keyed as a mistake
- [MINOR] evaluate-boolean-binary-tree S3: wrong-answer feedback begins "Correct." (P5)
- [MINOR] evaluate-boolean-binary-tree S4: wrong-diagnosis feedback prints the correct "Code rule" (P3)
- [MINOR] evaluate-boolean-binary-tree S4: case 1 object-form input vs values-form in cases 2–3
- [MINOR] usaco-fence-planning S1: raw inputs say cows=/friendships= while statement/code say positions/pairs
- [MINOR] usaco-fence-planning S1: Q4 question text shown inside raw-input box; "plotted node" jargon
- [MINOR] usaco-fence-planning S2: Landen's arrow direction depends on click order; clicking 0 first can never expose the bug
- [MINOR] usaco-fence-planning S3: Q1 two-node graph repeats the same claim in all variants
- [MINOR] usaco-fence-planning S3: Q3 claim writes edges reversed vs input
- [MINOR] usaco-fence-planning S4: diagnosis choices mix fix/bug/requirement framings; choice A is not a diagnosis
- [MINOR] usaco-fence-planning S4: "The helper returns 5" — no helper exists
- [MINOR] usaco-fence-planning S4: checklist line "The incorrect solution's exact output is correct" is a confusing double negative
- [MINOR] find-all-groups-of-farmland S1: Q8 repeats Q1 (same grid, answer, distractor)
- [MINOR] find-all-groups-of-farmland S1: "fresh input" wording for a repeated input
- [MINOR] find-all-groups-of-farmland S2: "plot seed" term; rectangle guarantee not enforced
- [MINOR] find-all-groups-of-farmland S3: Q2 "Every forest and farmland cell" rule yields the required graph for land=[[1]]
- [MINOR] find-all-groups-of-farmland S3: failure panel "Both (0,2) and 0,2 work" contradicts the guide
- [MINOR] find-all-groups-of-farmland S4: shown code has no DFS/graph; "missing-dfs" distractor refers to a search that isn't there
- [MINOR] flood-fill S1: "fresh input" wording for a repeated input
- [MINOR] flood-fill S2: Josephine's hidden start "(0,1)" must exist in the student's graph
- [MINOR] flood-fill S3: Q5 "Every pixel in the image" rule yields the required graph for [[1,1],[1,1]]
- [MINOR] flood-fill S4: case 3 distractor "start row and column are swapped" is self-refuting (sr=sc=0)
- [MINOR] kattis-getting-gold S1: Q3 exact-picture differs by one reversed arrow among 16 ((2,3)→(1,3))
- [MINOR] kattis-getting-gold S1: Q8/Q9 are Description examples with answers printed; "first/second shown dungeon" wording
- [MINOR] kattis-getting-gold S1: node rule worded differently in Q5 vs every Step 3 feedback ("including each trap as an obstacle node…")
- [MINOR] kattis-getting-gold S2: must toggle "Directed edges", use interior coords ≥ (1,1), and ≤ 8 nodes — all learned only from post-Check errors
- [MINOR] kattis-getting-gold S2: Q3 wrong player square (1,2) shown only in Drawing 2 title / error text
- [MINOR] kattis-getting-gold S3: "(1,3) and (1,2) are directly connected" on a one-way edge is ambiguous; wrong feedback begins "Correct."
- [MINOR] kattis-getting-gold S4: trap node "(2,2)" required as an isolated node with no guide
- [MINOR] kattis-getting-gold S4: cases 2–3 repeat case 1's code and identical correct-choice text; `grid:` vs `dungeon=` naming
- [MINOR] kattis-getting-gold cross: Description variable `grid` vs lesson inputs `dungeon=`
- [MINOR] ladder-takahashi S2: read-only field labelled "CHOOSE THE FLOOR 1 / floor 1"
- [MINOR] ladder-takahashi S3: ladder [8,3] written "3—8" in Q1; Q3 wrong feedback begins "Correct."
- [MINOR] ladder-takahashi S4: feedback says "seen set" but code uses `visited`; silly distractor "floor 12 … larger than the number of ladders"; `ladders:` vs `ladders=` formats
- [MINOR] structy-largest-component S1: guide "Example: 2" digits-only vs letter keys in Description/Step 4; mixed quoted/unquoted keys
- [MINOR] structy-largest-component S1: Q7/Q8 are Description Examples 1/2 verbatim
- [MINOR] structy-largest-component S2: "component seed" jargon; output is a node list though the problem returns a size
- [MINOR] structy-largest-component S4: absurd distractors ("e counted as four nodes", "b and d compare equal"); feedback names `seen`/"helper" that aren't in the code
- [MINOR] max-area-of-island S1: Q7/Q9 are Description examples with answers printed; Q9 offers "draw this input" for a grid with no nodes
- [MINOR] max-area-of-island S3: Q1 feedback shown under × begins "Correct. The mini-example lists (0,0)—(0,1)…"
- [MINOR] max-area-of-island S4: identical code ×3; case 1/2 inputs reused from Step 1/3; `grid:` vs `grid=` formats
- [MINOR] structy-max-root-to-leaf-path-sum S1: Q1/Q8 and Q2/Q9 are the Description examples with answers printed
- [MINOR] structy-max-root-to-leaf-path-sum S1: remedial "Why" says 4→2→9 is the best path but 4→6→5 also gives 15
- [MINOR] structy-max-root-to-leaf-path-sum S1: Q8 feedback "not the middle branch" is unclear
- [MINOR] structy-max-root-to-leaf-path-sum S2: Q1 "final listed route" undefined for a drawn tree
- [MINOR] structy-max-root-to-leaf-path-sum S3: Q1 v2 "Only nodes with positive values" is not a mistake on an all-positive input
- [MINOR] structy-max-root-to-leaf-path-sum S3: wrong-answer feedback starts with "Right."/"Correct." under an ×
- [MINOR] structy-max-root-to-leaf-path-sum S4: identical code and diagnosis choices in all three cases
- [MINOR] structy-max-root-to-leaf-path-sum S4: case 3 distractor "null base case should return 10" is nonsense
- [MINOR] structy-max-root-to-leaf-path-sum S4: "Changed graph" text describes the unchanged graph (cases 1, 3)
- [MINOR] maximum-number-of-fish-in-a-grid S1: Q7/Q9 are Description examples with answers printed
- [MINOR] maximum-number-of-fish-in-a-grid S2: "wrong fishing start" bug and reached-set "output" don't fit a problem that tries every start; start (0,1) hidden in Drawing 2 title
- [MINOR] maximum-number-of-fish-in-a-grid S3: Q1 feedback shown under × begins "Correct."
- [MINOR] maximum-number-of-fish-in-a-grid S4: choices say `grid[r][c]`/`seen` (code: `grid[row][column]`/`visited`); case 3 proof writes "(0,0)=2" labels the guide forbids
- [MINOR] maximum-number-of-fish-in-a-grid S4: unweighted drawing cannot express the bug; inputs reused from Step 1 Q1/Q3; identical code ×3; implausible "must start on the cell containing 3" distractor
- [MINOR] maximum-number-of-fish-in-a-grid cross: node rule says "weighted by its fish count" but weights cannot be drawn and the guide forbids writing the value
- [MINOR] usaco-milk-factory S1: Q2 calls Q1's input "fresh"
- [MINOR] usaco-milk-factory S2: Griffin's wrong start "2" only visible in Drawing 2 title
- [MINOR] usaco-milk-factory S3: "1 and 2 are directly connected" hides arrow direction
- [MINOR] usaco-milk-factory S4: input formatting differs between case 1 and cases 2–3
- [MINOR] usaco-milk-factory S4: "The helper accepts smallest candidate 1" — no helper
- [MINOR] usaco-milk-factory S4: "reverse graph" used in choices/feedback without ever being introduced
- [MINOR] structy-minimum-island S1: Q7/Q9 are Description examples; two remedials reuse Q8/Q9 grids
- [MINOR] structy-minimum-island S2: "island seed" jargon in the start field
- [MINOR] structy-minimum-island S2: Q1 drawn cells have no L/W value; grader treats every drawn cell as land
- [MINOR] structy-minimum-island S2: Q3 "final listed route" undefined
- [MINOR] structy-minimum-island S3: "outer border" rule yields the same graph on every Step 3 grid (Q1 v1, Q2, Q5)
- [MINOR] structy-minimum-island S3: Q3 self-reach claim on `[['L']]`
- [MINOR] structy-minimum-island S3: failure box says "0,2 works" while guide says "(row,column)"
- [MINOR] structy-minimum-island S3: "× Right…" feedback on wrong answers (Q2, Q5)
- [MINOR] structy-minimum-island S4: identical code and choices in all three cases
- [MINOR] moocast S1: Q3 Picture D feedback ("arrows or two-way links") describes a different mistake than the reversed 1→2 arrow
- [MINOR] moocast S1: Q8/Q9 are Description Examples 1 and 2 verbatim; Q9 input reused in remedial and S3 Q5
- [MINOR] moocast S1: Q5/Q7 raw-input box holds the question; "radio node" wording unexplained
- [MINOR] moocast S2: "Tyson forgets that the listed connections have a direction" — nothing is listed in this problem
- [MINOR] moocast S2: Q3 says "Edge numbers show drawing order" while numbers not visible on capture
- [MINOR] moocast S3: claims repeat full "0: (0,0) p=3" labels three times each and are hard to read
- [MINOR] moocast S4: case 3 distractor says "from seen"; code uses visited
- [MINOR] path-sum S1: Q2 Picture D feedback describes a different mistake than the reversed arrow
- [MINOR] path-sum S1: Q5 distractor A is not a "link"
- [MINOR] path-sum S1: Q3/Q7/Q9 are Description examples verbatim
- [MINOR] path-sum S2: Mallory "stops reading one relation too early" — nested object has no relation list
- [MINOR] path-sum S3: Q2 and Q3 use the identical tree [2,3,4]
- [MINOR] path-sum S3: correct node-rule wording differs from Step 1
- [MINOR] path-sum S4: case 1/3 inputs are nested objects, case 2 level-order; case 2 reuses remedial/S3 input
- [MINOR] properties-graph S1: Q7/Q8 are Description Examples 1/2 with answers printed in the Description
- [MINOR] properties-graph S2: Step 1 label format rejected with no on-screen warning
- [MINOR] properties-graph S3: wrong-answer feedback starts with "Correct."
- [MINOR] properties-graph S3: "Correct node rule … payload carried by that node" contradicts Step 1 wording
- [MINOR] properties-graph S3: Q4 reach claim has a false premise (row 0 cannot reach row 1)
- [MINOR] properties-graph S4: "Reachable boundary" chain text meaningless for a count problem
- [MINOR] reachable-nodes-with-restrictions S1: Q3 pictures show `3(restricted)` without the required space
- [MINOR] reachable-nodes-with-restrictions S1: Q7/Q9 are Description Examples 1/2 verbatim
- [MINOR] reachable-nodes-with-restrictions S1: Q4 choice "erase restricted nodes and all context immediately" is garbled
- [MINOR] reachable-nodes-with-restrictions S2: Q3 promises edge drawing-order numbers that weren't visible
- [MINOR] reachable-nodes-with-restrictions S3: claim edge order flipped vs input (Q1 v0, Q4)
- [MINOR] reachable-nodes-with-restrictions S4: "forbidden articulation node" jargon
- [MINOR] transitive-closure S1: `[[0,1,0],[0,0,1],[0,0,0]]` used in Q1, Q3, Q8, S4 case 2 and Example 1; Q9 is Example 2
- [MINOR] transitive-closure S2: Q2 Allyson's drawing must be UNDIRECTED; two opposite arrows may not be accepted, nothing says
- [MINOR] transitive-closure S2: "source index" jargon
- [MINOR] transitive-closure S3: "× Right…" feedback on wrong answers (Q3)
- [MINOR] transitive-closure S4: case 1 distractor "returns the original graph matrix" is observationally true on that input
- [MINOR] transitive-closure S4: no hint that a nested matrix `[[0,1],[0,0]]` is expected
- [MINOR] transitive-closure S4: identical code in all three cases
- [MINOR] structy-tree-sum S1: Q7/Q9 list the values in the question; pure arithmetic and Description examples
- [MINOR] structy-tree-sum S1: Q1 distractor 18 is a max-path-sum answer, not a tree-sum mistake
- [MINOR] structy-tree-sum S2: Q3 "final listed route" undefined
- [MINOR] structy-tree-sum S3: Q3 self-reach claim on `[-3]`
- [MINOR] structy-tree-sum S3: "× Correct…"/"× Right…" feedback on wrong answers (Q1, Q2, Q4, Q5)
- [MINOR] structy-tree-sum S4: case 2 success text "3→4, 11→4, 4→1" is ambiguous with two nodes valued 4
- [MINOR] structy-tree-sum S4: distractor "Null children should contribute their parent's value" is nonsense
- [MINOR] structy-tree-sum S4: identical code and choices in all three cases
- [MINOR] wheres-my-internet S1: "cables 1-2-3-4" chain notation can be read as one cable
- [MINOR] wheres-my-internet S1: Q2 calls Q1's input "fresh"
- [MINOR] wheres-my-internet S2: "CHOOSE THE HOUSE 1" on a readonly prefilled field
- [MINOR] wheres-my-internet S2: "Joaquin keeps only the last branch it sees" — "it" for a person
- [MINOR] wheres-my-internet S2: edge-order numbers reported visible for Joaquin but not Aubree though both say "Edge numbers show drawing order."
- [MINOR] wheres-my-internet S3: Q1 variant 1 writes edges reversed vs input
- [MINOR] wheres-my-internet S4: distractor mentions a "reachability search" the code does not contain; isolated-house distractor only relevant in case 1
- [MINOR] wheres-my-internet S4: "The helper reports [3,4]" — no helper
- [MINOR] wheres-my-internet S4: input formatting differs between case 1 and cases 2–3
- [MINOR] all-7 S4: "Changed graph" step describes the correct graph, not the code's graph; "source-repo reference solution" jargon
- [MINOR] all-7 S1: build wrong-answer feedback is a bug-id template ("follows the count dfs back edges bug, not the exact picture")
- [MINOR] NLWS/NLWS-II/NDT/CC S3: no "Use this graph model" panel on graph failure (grid-only)
- [MINOR] number-of-connected-components S1: Q7 distractor mentions nodes 3 and 4 although no n is given
- [MINOR] number-of-connected-components S1: template names ("count dfs back edges bug", "assume n minus edges bug")
- [MINOR] number-of-connected-components S2: Benjamin "listed connection" = drawn order
- [MINOR] number-of-connected-components S4: case 3 code rule omits the stored 4→3 arrow (copied from case 1)
- [MINOR] number-of-connected-components S4: case 2 distractor about isolated nodes on an input with none
- [MINOR] time-needed S1: "-1 minutes" nonsense distractor; feedback uses "reachable".
- [MINOR] time-needed S1: "useful traversal graph" jargon in relation-rule prompt.
- [MINOR] time-needed S1: drawings carry no times so they cannot help answer any build.
- [MINOR] time-needed S1: slug feedback ("the count edge as unit time bug" …).
- [MINOR] time-needed S4: "should" distractors with "changing this input's returned value" tail.
- [MINOR] time-needed cross: graphRules are input-specific ("1→4, from manager 1 down to direct report 4").
- [MINOR] water-and-jug S1: slug feedback incl. "the ignore gcd restriction bug".
- [MINOR] water-and-jug S2: make-two-way witness needs a partially-filled state; no hint.
- [MINOR] water-and-jug S4: gcd unexplained; "for the shown graph" tail; three identical cases.
