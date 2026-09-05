# Batch aa findings

Problems reviewed: all-paths-from-source-to-target, battleships-in-a-board, busiest-shelf-level, coins-on-level-k, counting-constellations, course-schedule, detonate-the-maximum-bombs. Every Step 1 build/remedial answer and every Step 4 buggy output was recomputed (Step 4 code was executed with node). Known systemic issues are only mentioned where the instance is concrete.

## All Paths From Source to Target (`all-paths-from-source-to-target`)

### Step 1
- **[MINOR] Q9 bug-trap answer is printed in the Description tab.** Q9 asks "In graph = [[4,3,1],[3,2,4],[3],[4],[]], how many different paths run from 0 to target 4?" — this is Description Example 2, whose text says "There are five different ways to travel from node 0 to node 4." Q1/Q3 likewise reuse Example 1 with its output shown. Fix: use a fresh input for the bug-trap. (Q9 `bug-trap`)
- **[MINOR] Q9 distractor feedback is jargon.** "6 paths" → "This treats the dead-end-free branches as freely interchangeable and invents a route." A struggling student cannot parse "dead-end-free branches … freely interchangeable". Rewrite as e.g. "You counted 0→1→2→4, but there is no arrow 2→4." (Q9)
- **[MINOR] `relation-rule` remedial does not test the rule and its distractor feedback is false.** Input `graph = [[],[0],[]]`, correct `[]`. Wrong choice `[[0,1,2]]` is explained as "That result follows the reverse arrows bug" — reversing gives only 0→1; nothing ever enters node 2, so the reversed graph ALSO returns `[]`. No reading of this input yields `[[0,1,2]]`. (S1 remedial after `relation-rule`)
- **[MINOR] Same input built three times.** `[[1,2],[3],[3],[4],[]]` is Q4 (build-merge), the `bug-trap` remedial, and Step 4 case 1. (Q4 / remedial 5 / S4 case 1)

### Step 2
- **[MAJOR] "CORRECT OUTPUT" invites the problem's real answer, which is rejected.** Step 1 asked "What should the function return?" nine times with answers like `[[0,1,3]]`. Step 2's field "CORRECT OUTPUT" (no hint anywhere) actually wants the reached-node set, e.g. `[0,1]`. For this problem the two look almost identical (`[[0,1]]` vs `[0,1]`), so the student will type the path list and be marked wrong with no explanation. Fix: relabel "Nodes the search reaches (e.g. [0,1])". (S2 Q1–Q3)
- **[MINOR] Field is titled "CHOOSE THE SOURCE NODE" but is read-only** (prefilled "0", `readonly=true`). Say "Source node: 0 (fixed)". (S2 Q1–Q3)
- **[MINOR] Q3 prompt says "Edge numbers show drawing order" but the harness recorded `edge drawing-order numbers visible: false`.** If the numbers really do not render, the only hint for what "last available branch" means is gone. Verify in the UI. (S2 Q3 `last-branch`)

### Step 3
- **[MAJOR] Wrong-answer feedback starts with "Correct."** After answering NO to "0 and 2 are directly connected, not merely reachable through a longer route." the student sees "× Correct. The mini-example lists 0→2 as one direct edge." An × mark followed by "Correct." reads as a contradiction. Same in Q1 variant 1 ("× Correct. The mini-example lists 1→2…") and Q5 ("Right. A multi-step route through 3…"). The verdict cue is not being stripped for these claim types. (S3 Q1, Q3, Q5 — appears in every problem in this batch)
- **[MINOR] Membership claims quote values that are not in the shown input.** Q1 (`[[2],[2],[]]`): rule text "such as 0→1→3 and 0→2→3" and feedback "Node 3 still exists" — no node 3, no 0→1. Q2 (`[[],[0]]`): "One node only for indices 0, 1, and 2…" / "Node 3 still exists" — only indices 0 and 1 exist. Q4 (`[[1,2],[2],[]]`): "including repeated copies of 3". (S3 Q1, Q2, Q4)

### Step 4
- **[MAJOR] Cases 2 and 3 are copies of case 1.** Identical code, identical bug title "One visited set erases a valid path", identical three diagnosis sentences (only reordered), identical correct choice. After case 1 the student just re-picks "The search treats a shared merge node as permanently finished." twice. Two of three cases test nothing new. (S4 cases 2, 3)
- Verified by running the code: buggy outputs `[[0,1,3,4]]`, `[[0,1,3]]`, `[[0,1,2,3]]` are right; required labels `0`–`4` match the Step 1 guide. Diagnosis distractors are clearly wrong. Fine.

### Cross-step / other
- Label format is consistent across all four steps (`0`, `1`, …). Fine.

## Battleships in a Board (`battleships-in-a-board`)

### Step 1
- **[MINOR] Q2 Picture D feedback describes the wrong mistake.** Picture D drops `(2,3)`; feedback says "This drops an item that still exists even when it has no outgoing move." `(2,3)` has a neighbour `(1,3)`; the sentence is a directed-graph template pasted onto an undirected grid. (Q2 `exact-picture`)
- **[MINOR] Heavy input reuse.** Example 1's board is Q1, Q2, Q7 and S4 case 2; `[["X",".","X"]]` is Q6 (build), Q9 (bug-trap) and S4 case 3. Q9 asks the count the student just gave in Q6. (Q6/Q9)
- **[MINOR] Q9 wording.** "What does the one-row board [["X",".","X"]] contain?" — the choices are ship counts but the question does not ask for a count. Use "How many ships…". (Q9)
- All build/remedial answers verified (2, 1, 2, 1; 3, 1, 1, 2, 2). Fine.

### Step 2
- **[MAJOR] Q1 hidden requirement: the drawing must contain a cell named `(0,1)`, the start must not be `(0,1)`, and on a legal board the start must not even touch `(0,1)`.** Priya's fixed wrong start `(0,1)` is only revealed after clicking Check ("Also draw (0,1), the wrong first ship cell used by the broken search.") or in Drawing 2's title. On a real board, any start that shares a side with `(0,1)` — `(0,0)`, `(0,2)`, `(1,1)` — is part of the same ship, so Priya reaches the same cells and there is no counterexample. The answer the grader accepted (nodes `(0,0)`, `(0,1)`, `(0,2)`, edge only `(0,1)—(0,2)`, start `(0,0)`) is an impossible board: `(0,0)` and `(0,1)` are side-by-side X's with no edge. A student who obeys the ship rules has to guess "start at least one cell away from (0,1), e.g. (2,0)". Fix: tell the student Priya starts at (0,1) up front, or let the student choose Priya's start. (S2 Q1 `wrong-start`)
- **[MINOR] Q2 "Owen builds every listed connection except the last one."** A board has no listed connections; "last one" means the last edge the student drew. Say "the last edge you draw". (S2 Q2)
- Output format for this problem is `["(0,0)"]` (quotes required); the screen never says so.

### Step 3
- **[MINOR] Several "mistaken" node rules give the identical graph for the shown input, so the keyed answer is debatable.** Q1 `[[".","X"]]`: "Only the leftmost or topmost X of each ship should be a node" and "Each whole horizontal or vertical ship should be one node" — a one-cell ship yields the same single node either way, yet "It would be a mistake" is keyed YES. Q2 `[["X","X"]]`: "Every board cell, both X and ., should be a ship node" — there are no `.` cells, so the rule gives the same graph; keyed NO. Q4 `[["X","."],[".","X"]]`: "Each whole ship should be one node" — both ships are one cell. (S3 Q1, Q2, Q4)
- **[MINOR] "× Correct. A zero-step path makes (0,1) reachable from itself…"** shown after a wrong answer. (S3 Q1)
- Degree/edge claims verified correct as keyed for all five questions.

### Step 4
- **[MINOR] Cases 2 and 3 repeat case 1's bug, code and diagnosis sentences.** (S4)
- Buggy outputs verified (0, 0, 0); real outputs 2, 2, 2 correct; labels `(0,0)` match the Step 1 guide. Diagnosis feedback "That bug would return 3, not 0." is helpful. Fine.

## Busiest Shelf Level (`busiest-shelf-level`)

### Step 1
- **[MAJOR] Correct-answer feedback contradicts the tie rule.** Q4 `items=[[],1,[2,[]]]`: depth 1 and depth 2 each hold one item. The correct choice "1" is explained as "Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth." — "more than any other depth" is false here. The same false sentence appears for the `concept-picture` remedial `[1,[4,[6]]]` (three-way tie, answer 1) and the `concept-counterexample` remedial `[0,[0,[9]]]` (three-way tie, answer 1). A student who counted correctly will think they mis-counted. Fix: on ties say "Depth 1 ties depth 2 with 1 item each; ties go to the shallower depth." (Q4, remedials 1 and 5)
- **[MINOR] Q8 states its own answer and repeats Q4.** "For items = [[],1,[2,[]]], depths 1 and 2 each hold one item. Which depth is returned?" — the tie is given, so only the tiebreak sentence from the Description is needed, and the input is the one just built in Q4. Distractor feedback "The depth-3 box is empty" is also off: the empty box is at depth 2 (its contents would be depth 3). (Q8)
- **[MINOR] Q9 distractor feedback does not fit.** `items=[7]`, wrong "0" → "This shifts integer depth when crossing an array container." There is no inner container; the mistake is counting from 0. (Q9)
- **[MINOR] Q5 raw-input box shows the line "Focus on one listed relation."** under the input, with no meaning for the student. (Q5)
- All build/remedial answers verified (2, 1, 2, 1; 1, 2, 2, 2, 1). Fine.

### Step 2
- **[MAJOR] Step 1's taught labels are rejected.** Submitting `root=[]`, `root[0]=1`, … → "Use root, root[0], root[1], ... to name nested input items." Discovered only after Check; expected output looks like `["root","root[0]"]`, nothing like the depth number the student has been answering with. (S2 Q1)
- **[MINOR] "CHOOSE THE OUTER SHELF" is read-only** (prefilled `root`). (S2 Q1–3)
- **[MINOR] "Diego keeps only the last branch it sees."** — "it" for a person. (S2 Q3)

### Step 3
- **[MINOR] "× Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge."** shown after a wrong answer (Q1 variants 0 and 1). (S3 Q1)
- All 15 claims verified correct as keyed.

### Step 4
- **[BLOCKER] Case 1 requires secret labels `root`, `1`, `box A`, `2`, `3`, `box B`, `box C`, `4`.** Steps 1 and 3 taught `root=[]`, `root[0]=1`, `root[1]=[]`, …, and cases 2 and 3 of this same step require that taught format (`root[0]=[]`, `root[0][0]=3`, …). No guide is shown. The student would also have to guess that `[2,3]` is "box A", `[[4]]` is "box B" and the inner `[4]` is "box C". A correct drawing in the taught format fails with only "× The drawing has every exact node". Fix: relabel the case-1 canvas to the `root[...]=` format. (S4 case 1)
- **[MAJOR] Internal slug shown to the student.** Cases 2 and 3 print "→ Reachable boundary: count-container-nodes → Returned value: …" in both the wrong-diagnosis feedback chain and the success text. (S4 cases 2, 3)
- **[MINOR] Case 1 input formatting differs from every other screen:** `items: [1, [2, 3], [[4]]]` vs `items=[1,[2,3],[[4]]]`. (S4 case 1)
- Buggy outputs verified (1, 1, 1); real outputs 2, 2, 2 correct; diagnosis distractors clearly wrong. Fine.

## Coins on Level K (`coins-on-level-k`)

### Step 1
- **[MINOR] Q1 distractor value does not match its feedback.** `items=[1,[2,3],[[4]]], k=1`: wrong "5" (= 2+3, the depth-2 sum) is explained as "This includes coins one level deeper than k" — including deeper coins would give 1+2+3 = 6. The 5 is really an off-by-one-depth answer. (Q1)
- **[MINOR] Two remedial distractors are impossible values with false feedback.** `[[],[5]], k=2`: wrong "6" → "This includes coins one level deeper than k" — there are no coins below depth 2. `[0,[0,[9]]], k=3`: wrong "10" → same feedback; nothing is deeper than 9. (remedials 3 and 5)
- All build/remedial answers verified (1, 2, 4, 7; 4, 0, 5, 4, 9). Fine.

### Step 2
- **[MAJOR] Step 1's taught labels are rejected** ("Use root, root[0], root[1], ... to name nested input items."), same as busiest-shelf. (S2 Q1)
- **[MAJOR] Q2 wrong start `root[0]` is hidden.** "Adam uses the wrong outer box." The start field is read-only `root`; Adam secretly starts at `root[0]` (shown only in Drawing 2's title). The student must make `root[0]` reach a different set than `root` without being told which box Adam opens. (S2 Q2 `wrong-start`)
- **[MINOR] "CHOOSE THE OUTER BOX" is read-only.** (S2 Q1–3)

### Step 3
- **[MINOR] Q2 `[[1],2,[3]]`: "It would be a mistake to use this node rule: Only positive-valued coins…"** — no negative coins exist, so the rule gives the identical graph. (S3 Q2)
- All 15 claims verified correct as keyed.

### Step 4
- **[BLOCKER] Case 1 requires secret labels `root`, `box A`, `3`, `2`, `5`, `box B`, `box C`, `4`** while cases 2 and 3 require the taught `root=[]`, `root[0]=[]`, `root[0][0]=3`, … format. No guide is shown. (S4 case 1)
- **[MAJOR] Slug "zero-based-depth" shown as the Reachable boundary** in cases 2 and 3 ("→ Reachable boundary: zero-based-depth →"). (S4 cases 2, 3)
- **[MINOR] Case 1 "Changed graph" sentence is garbled:** "Coins 3 and 2 are two edges below the root container's contents convention and belong to level 2; coin 4 belongs to level 3." (S4 case 1)
- Buggy outputs verified (4, 5, 0); real outputs 5, 1, 2 correct. Diagnosis fine.

## Counting Constellations (`counting-constellations`)

### Step 1
- **[MINOR] The correct answer is predictable.** 7 of the 9 two-choice builds (Q1, Q2, Q6 and remedials 1–4) have answer "1"; only Q4 (3) and remedial 5 (2) differ. (S1)
- **[MINOR] Q9 distractor feedback is unreadable.** "3" → "This explores from one top star only one diagonal direction, then starts two extra searches." (Q9)
- All build/remedial answers verified (1, 1, 3, 1; 1, 1, 1, 1, 2). Remedial 4 requires all 8 edges of the plus shape including 4 diagonals — heavy but correct.

### Step 2
- **[MAJOR] Q3 wrong start `(0,1)` is hidden, and on a legal sky the student must start at least two cells away.** "Aaliyah ignores the chosen first star and uses a different one." With 8-direction touching every cell within one step of `(0,1)` — `(0,0)`, `(0,2)`, `(1,0)`, `(1,1)`, `(1,2)` — is in the same constellation as `(0,1)`, so starting there gives Aaliyah the same set. The answer the grader accepted (start `(0,0)`, node `(0,1)` joined only to `(0,2)`) is an impossible sky: `(0,0)` and `(0,1)` are side-by-side stars with no edge. The grader does not enforce the adjacency rule, and a student who does follow it gets no hint. (S2 Q3 `wrong-start`)
- Q1/Q2 fine apart from the unstated `["(0,0)","(1,1)"]` output format.

### Step 3
- **[MINOR] Q3 `[[1,1,1]]`: "Use this node rule: Only star cells in rows containing at least two stars."** The only row has three stars, so the rule gives the identical graph; NO is keyed. (S3 Q3)
- **[MINOR] "× Right. A multi-step route through (0,1)…"** after a wrong answer (Q1 variant 2, Q5). (S3)
- Degree claims verified: (1,2)=3, (1,1)=4, (1,0)=3, (0,1)=2, (2,2)=1. Fine.

### Step 4
- **[MAJOR] Slug "four-direction-constellations" shown as the Reachable boundary** in cases 2 and 3. (S4 cases 2, 3)
- **[MINOR] Cases 1 and 3 are the same idea** (a pure diagonal chain), case 2 is Step 1 Q2's input, and all three use the same diagnosis sentence. (S4)
- Buggy outputs verified (3, 2, 2); real outputs 1, 1, 1 correct; labels `(0,0)` match the guide. Fine.

## Course Schedule (`course-schedule`)

### Step 1
- **[MINOR] Q4 and Q8 are the same input `[[1,0],[0,1]]`**, which is Description Example 2 with its explanation; Q7 is Example 1; Q1 is Example 3. (Q1/Q4/Q7/Q8)
- **[MINOR] `relation-rule` remedial admits it does not test the rule, and its distractor feedback is false.** `numCourses = 2, prerequisites = [[1,0]]` → "true": "either orientation is acyclic here, but the exact picture is 0→1". The wrong choice "false" is attributed to "the reverse pair semantics bug" — reversing the arrow still returns true. (remedial 3)
- All build/remedial answers verified (true, false, true, false; true, true, true, false, true). Fine.

### Step 2
- **[MAJOR] "CORRECT OUTPUT" on a true/false problem.** The Description says "Return true … and false otherwise" and Step 1 answered true/false nine times. Step 2's "CORRECT OUTPUT" box wants `[0]` (courses reached from the inspected course). Typing `true` is rejected with no hint. (S2 Q1–3)
- **[MAJOR] Q2 hides that the student must inspect course 0 and that Jasper secretly starts at course 1.** Screen: "Jasper runs the search from a different course to inspect." The authored goal ("Use course 0 as the chosen course, but make the mistaken search begin at course 1") is not shown; the start field is free text, so a student who inspects course 1 can never expose Jasper. (S2 Q2 `wrong-start`)
- **[MINOR] Q1 requires Drawing 2 to be undirected** (grader: "character's graph must be exactly: UNDIRECTED"); nothing says to switch the "Directed edges" toggle. (S2 Q1)

### Step 3
- **[MINOR] "Use this node rule: Only courses that appear somewhere in prerequisites"** is asked on `[[1,0]]` (n=2) and `[[1,0],[2,1],[0,2],[3,2]]` (n=4), where every course appears — the rule gives the identical graph; NO is keyed. (S3 Q1 variant 1, Q2)
- **[MINOR] "× Correct. The mini-example lists 0→1 as one direct edge."** after a wrong answer. (S3 Q1)
- All 15 claims verified correct as keyed.

### Step 4
- **[BLOCKER] Case 1 requires labels `course 0`, `course 1`, `course 2`, `course 3`; cases 2 and 3 require `0`, `1`, `2`.** Step 1/3 guide: "Use each node's 0-based number only. Example: 2." A student who draws `0`–`3` as taught fails case 1 with only "× The drawing has every exact node". (S4 case 1)
- **[MAJOR] Distractor "The search should begin only at course 0, changing this input's returned value." is literally TRUE for cases 2 and 3.** With only `search(0)`, the shown code returns `true` on `[[1,0],[2,1]]` and on `[[1,0]]` (the correct answers) instead of `false`, because on those inputs the false is produced by the outer loop re-entering an already-visited course 1. A literal student who traces this picks it and is told "No. A cycle could exist in a disconnected group, so all courses must be checked." — true in general, but not an answer to "does it change this input's returned value". Fix: reword the distractor so it is false on these inputs, or drop cases 2–3. (S4 cases 2, 3)
- **[MINOR] Misconception title "A merge is mistaken for a cycle" is wrong for cases 2 and 3** (a chain and a single edge; no merge). In fact the shown code returns `false` for every input with at least one edge (verified: `canFinish(2,[])` → true, all three cases → false). (S4 cases 2, 3)
- **[MINOR] The outer loop variable is named `column`** (`for (let column = 0; column < numCourses; …)`) in a course problem. (S4 code)
- Buggy outputs verified (false, false, false); real outputs true, true, true. Case 1 diagnosis fine.

## Detonate the Maximum Bombs (`detonate-the-maximum-bombs`)

### Step 1
- **[BLOCKER] `relation-rule` remedial requires an edge that does not exist.** Input `bombs = [[0,0,1],[1,0,4],[5,0,1]]`. Real reach: A→B (distance 1 ≤ 1), B→A (1 ≤ 4), B→C (4 ≤ 4). C→B would need distance 4 ≤ C's radius 1 — false. The hidden required graph is "A→B, B→A, B→C, C→B" (confirmed in `visual-lessons-original.json`, remedial-3 canvas). This remedial is shown right after the student is corrected on the edge rule ("When j's center is at most i's radius away from i's center"); a student who applies that rule draws the right graph and is failed. Fix: delete the C→B edge from the canvas. (S1 remedial after `relation-rule`; same canvas reused in S3 Q5)
- **[MINOR] Q2 distractor feedback names a bug that does not produce the value.** `[[0,0,1],[4,0,1]]`, wrong "2" → "compare diameter not radius bug": diameter 2 is still less than distance 4 (so is the radius sum 2). No plausible bug returns 2. (Q2)
- **[MINOR] Q7 and Q9 are Description Examples 1 and 2 verbatim**, whose explanations give the answers. (Q7/Q9)
- Other builds verified (2, 1, 3, 1) and remedials (2, 2, 3, 3, 3) — the numeric answers are right; only remedial 3's drawing is wrong.

### Step 2
- **[MAJOR] Step 1's taught labels A, B are rejected:** "Use numeric IDs 0, 1, 2, ... with no gaps." Shown only after Check; placeholder "Example: 0" is the sole hint that the naming changed. (S2 Q1)
- **[MINOR] Q3 "Rosa stops reading one relation too early and drops the final edge."** Bomb edges are computed from distances, not read from a list; "final edge" means the last edge drawn. (S2 Q3)

### Step 3
- **[BLOCKER] Q5 uses the same wrong canvas** (`[[0,0,1],[1,0,4],[5,0,1]]` with the bogus C→B). A correct drawing is rejected ("× Every exact direct edge is drawn"). The direct-vs-reach claim also states a false premise: "The correct graph has C→B and B→A, so it should also contain a direct C→A edge." (S3 Q5)
- **[MINOR] "× Right. A multi-step route through B…"** after a wrong answer (Q1 variant 1). (S3 Q1)
- Q1–Q4 claims verified correct as keyed.

### Step 4
- **[BLOCKER] Three different secret label schemes, none matching Step 1's A/B/C.** Case 1: `A (0,0), r=5`, `B (4,0), r=1`, `C (8,0), r=5`. Case 2: `bomb 0`, `bomb 1`, `bomb 2`, `bomb 3`. Case 3: `center bomb`, `east bomb`, `west bomb`, `north bomb` (the student must also map `[4,0,4]`→"east", `[-4,0,4]`→"west", `[0,4,4]`→"north"). No guide is shown; the taught `A`, `B`, `C` fails all three. (S4 cases 1–3)
- Buggy outputs verified (3, 4, 4) and real outputs (2, 3, 2); diagnosis choices fine.

### Cross-step / other
- Node naming changes at every step: Description/Step 1/Step 3 say `A, B, C`; Step 2 demands `0, 1, 2`; Step 4 demands three other formats.

## One-line summary of every finding in this batch
- [MINOR] all-paths-from-source-to-target S1: Q9 bug-trap answer ("five different ways") is printed in Description Example 2; Q1/Q3 reuse Example 1
- [MINOR] all-paths-from-source-to-target S1: Q9 "6 paths" feedback is jargon ("dead-end-free branches … freely interchangeable")
- [MINOR] all-paths-from-source-to-target S1: relation-rule remedial `[[],[0],[]]` distractor `[[0,1,2]]` cannot come from "reverse arrows" (reversed graph also returns [])
- [MINOR] all-paths-from-source-to-target S1: input `[[1,2],[3],[3],[4],[]]` built three times (Q4, bug-trap remedial, S4 case 1)
- [MAJOR] all-paths-from-source-to-target S2: "CORRECT OUTPUT" wants `[0,1]` but Step 1 trained `[[0,1]]`-style path lists; no hint
- [MINOR] all-paths-from-source-to-target S2: "CHOOSE THE SOURCE NODE" field is read-only
- [MINOR] all-paths-from-source-to-target S2: Q3 says "Edge numbers show drawing order" but harness saw no numbers
- [MAJOR] all-paths-from-source-to-target S3: wrong-answer feedback reads "× Correct. The mini-example lists 0→2 as one direct edge." (also Q3, Q5; every problem in batch)
- [MINOR] all-paths-from-source-to-target S3: membership claims/feedback cite node 3 / 0→1→3 on inputs that have no node 3
- [MAJOR] all-paths-from-source-to-target S4: cases 2 and 3 are exact repeats of case 1 (same code, bug, diagnosis sentences)
- [MINOR] battleships-in-a-board S1: Q2 Picture D feedback "has no outgoing move" for a cell that has a neighbour
- [MINOR] battleships-in-a-board S1: Example-1 board used in Q1, Q2, Q7, S4 case 2; `[["X",".","X"]]` in Q6, Q9, S4 case 3
- [MINOR] battleships-in-a-board S1: Q9 "What does the one-row board … contain?" doesn't ask for a count
- [MAJOR] battleships-in-a-board S2: Q1 must contain `(0,1)`, start elsewhere and (on a legal board) not touching it; only revealed after Check; grader accepted an impossible board
- [MINOR] battleships-in-a-board S2: Q2 "every listed connection except the last one" — a board has no listed connections
- [MINOR] battleships-in-a-board S3: Q1/Q2/Q4 "mistaken" node rules give the identical graph for the shown input (one-cell ships, no water cells)
- [MINOR] battleships-in-a-board S3: "× Correct. A zero-step path…" after a wrong answer
- [MINOR] battleships-in-a-board S4: cases 2–3 repeat case 1's bug and diagnosis text
- [MAJOR] busiest-shelf-level S1: tie-case correct feedback says "more than any other depth" (Q4, remedials 1 and 5) — false and contradicts the tie rule
- [MINOR] busiest-shelf-level S1: Q8 states the tie in the question and repeats Q4's input; "depth-3 box is empty" is at depth 2
- [MINOR] busiest-shelf-level S1: Q9 `items=[7]` distractor feedback "shifts depth when crossing an array container" — no container to cross
- [MINOR] busiest-shelf-level S1: Q5 input box shows stray line "Focus on one listed relation."
- [MAJOR] busiest-shelf-level S2: Step 1 labels `root=[]`… rejected; only "Use root, root[0]…" error after Check
- [MINOR] busiest-shelf-level S2: "CHOOSE THE OUTER SHELF" read-only; "Diego keeps only the last branch it sees"
- [MINOR] busiest-shelf-level S3: "× Right. A multi-step route…" after a wrong answer
- [BLOCKER] busiest-shelf-level S4: case 1 needs secret labels `root`, `1`, `box A`, `2`, `3`, `box B`, `box C`, `4`; cases 2–3 need `root[0]=[]` format
- [MAJOR] busiest-shelf-level S4: slug "count-container-nodes" shown as Reachable boundary in cases 2–3
- [MINOR] busiest-shelf-level S4: case 1 input shown as `items: [1, [2, 3], [[4]]]` (different format)
- [MINOR] coins-on-level-k S1: Q1 distractor 5 is the depth-2 sum but feedback says "includes coins one level deeper" (that would be 6)
- [MINOR] coins-on-level-k S1: remedial distractors 6 (`[[],[5]]`) and 10 (`[0,[0,[9]]]`) are impossible with false "deeper coins" feedback
- [MAJOR] coins-on-level-k S2: Step 1 labels rejected ("Use root, root[0], root[1]…")
- [MAJOR] coins-on-level-k S2: Q2 Adam's wrong start `root[0]` hidden; start field read-only
- [MINOR] coins-on-level-k S2: "CHOOSE THE OUTER BOX" read-only
- [MINOR] coins-on-level-k S3: Q2 "Only positive-valued coins" rule gives identical graph (no negatives)
- [BLOCKER] coins-on-level-k S4: case 1 needs secret labels `root`, `box A`, `3`, `2`, `5`, `box B`, `box C`, `4`; cases 2–3 need `root[0]=[]` format
- [MAJOR] coins-on-level-k S4: slug "zero-based-depth" shown as Reachable boundary in cases 2–3
- [MINOR] coins-on-level-k S4: case 1 "Changed graph" sentence garbled ("two edges below the root container's contents convention")
- [MINOR] counting-constellations S1: answer "1" on 7 of 9 two-choice builds
- [MINOR] counting-constellations S1: Q9 "3" feedback unreadable ("explores from one top star only one diagonal direction, then starts two extra searches")
- [MAJOR] counting-constellations S2: Q3 Aaliyah's start `(0,1)` hidden; on a legal sky the start must be ≥2 cells away; grader accepted an impossible sky
- [MINOR] counting-constellations S3: Q3 `[[1,1,1]]` "rows with at least two stars" rule gives identical graph
- [MINOR] counting-constellations S3: "× Right. A multi-step route…" after a wrong answer
- [MAJOR] counting-constellations S4: slug "four-direction-constellations" shown as Reachable boundary in cases 2–3
- [MINOR] counting-constellations S4: cases 1 and 3 same idea, case 2 = Step 1 Q2; same diagnosis sentence thrice
- [MINOR] course-schedule S1: Q4 and Q8 same input (Description Example 2); Q1/Q7 are Examples 3/1
- [MINOR] course-schedule S1: relation-rule remedial admits either orientation gives true; "reverse pair semantics bug" feedback false
- [MAJOR] course-schedule S2: "CORRECT OUTPUT" wants `[0]` on a problem whose answer is true/false
- [MAJOR] course-schedule S2: Q2 requires inspecting course 0 with Jasper secretly starting at 1; not shown, start is free text
- [MINOR] course-schedule S2: Q1 needs Drawing 2 undirected; toggle never mentioned
- [MINOR] course-schedule S3: "Only courses that appear in prerequisites" rule asked on inputs where every course appears (Q1 var1, Q2)
- [MINOR] course-schedule S3: "× Correct. The mini-example lists 0→1…" after a wrong answer
- [BLOCKER] course-schedule S4: case 1 needs labels `course 0`…`course 3`; cases 2–3 need `0`,`1`,`2`; guide says numbers only
- [MAJOR] course-schedule S4: distractor "The search should begin only at course 0, changing this input's returned value" is literally true for cases 2 and 3
- [MINOR] course-schedule S4: misconception title "A merge is mistaken for a cycle" wrong for cases 2–3 (no merge; code fails on any edge)
- [MINOR] course-schedule S4: outer loop variable named `column`
- [BLOCKER] detonate-the-maximum-bombs S1: relation-rule remedial `[[0,0,1],[1,0,4],[5,0,1]]` hidden graph includes impossible edge C→B (distance 4 > radius 1); correct drawing fails
- [MINOR] detonate-the-maximum-bombs S1: Q2 distractor "2" attributed to "compare diameter" bug that still gives 1
- [MINOR] detonate-the-maximum-bombs S1: Q7 and Q9 are Description Examples 1 and 2 verbatim
- [MAJOR] detonate-the-maximum-bombs S2: taught labels A, B rejected ("Use numeric IDs 0, 1, 2…") only after Check
- [MINOR] detonate-the-maximum-bombs S2: Q3 "stops reading one relation too early" — bomb edges are computed, not read
- [BLOCKER] detonate-the-maximum-bombs S3: Q5 reuses the wrong C→B canvas; correct drawing rejected; claim premise "The correct graph has C→B" is false
- [MINOR] detonate-the-maximum-bombs S3: "× Right. A multi-step route through B…" after a wrong answer
- [BLOCKER] detonate-the-maximum-bombs S4: secret labels `A (0,0), r=5` / `bomb 0` / `center bomb, east bomb, west bomb, north bomb` — three schemes, none the taught A/B/C
