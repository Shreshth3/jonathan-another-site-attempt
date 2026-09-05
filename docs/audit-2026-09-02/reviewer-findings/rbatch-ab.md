# Batch rbatch-ab findings

Problems: evaluate-boolean-binary-tree, find-all-groups-of-farmland, flood-fill, flooded-campsite-trails, gas-pocket-survey, gfg-grid-path-exists, gold-and-silver-lights.

Every Step 1 build key and every Step 4 buggy/correct output was recomputed by hand and (where in doubt) executed with node. Two Step 1 answer keys are wrong (evaluate-boolean Q6, gold-and-silver Q9). Known systemic issues from SYSTEMIC-NOTES are only mentioned where the instance is concrete.

Five patterns recur in all seven problems and are NOT in SYSTEMIC-NOTES; each is written out in full the first time it appears and referenced afterwards:

- P1 "Picture" choices print the node-name list, so the missing-node distractor is identifiable by counting names (first: evaluate-boolean S1 Q3).
- P2 Step 4 uses one bug, one code listing and one set of three diagnosis sentences for all three cases, so cases 2 and 3 are answered by pattern matching (first: evaluate-boolean S4).
- P3 Step 4 wrong-diagnosis feedback prints the correct "Code rule" sentence before the retry (first: evaluate-boolean S4).
- P4 In `last-branch` / `first-branch` rounds the character's graph must be IDENTICAL to the correct graph, contradicting "then <Name>'s graph using the mistake" (first: evaluate-boolean S2 Q2).
- P5 Step 3 direct-vs-reach "feedback if wrong" begins with "Correct." / "Right." under a red × (first: evaluate-boolean S3 Q2).

## Evaluate Boolean Binary Tree (`evaluate-boolean-binary-tree`)

### Step 1
- **[BLOCKER] Q6 answer key is wrong.** Raw input `values=[3,1,2,0,1], edges=[[0,1],[0,2],[2,3],[2,4]]`, question "What does the root evaluate to?". Node 2 is OR with children 3=false and 4=true → true; root is AND with children 1=true and 2=true → **true**. The key marks `false` correct and tells a student who picks `true`: "This accepts one true child at an AND node instead of requiring both children." The hidden required graph (`0:AND→1:true, 0:AND→2:OR, 2:OR→3:false, 2:OR→4:true`) confirms the reading. Verified with node. Fix in `scripts/author-new-final-six.js` line 27 (`{v:[3,1,2,0,1],…,a:false}`): either set `a:true` or change values to `[3,1,2,0,0]` so the OR subtree is false; regenerate `visual-lessons-new.json` / `visual-data.js`. (S1 Q6 / `case-4`)
- **[MINOR] P1: missing-node picture gives itself away.** Choices are displayed as "Picture B / 0:OR / 1:true / 2:false … Picture D / 0:OR / 1:true". Picture D lists two names while the others list three, so the `missing-node` distractor can be eliminated without looking at any picture. Same in all six other problems in this batch (farmland/flood-fill/gfg Picture B; flooded/gas/gold Picture D). Fix: do not print node names under the picture label, or print the same count for every picture. (S1 Q3)
- **[MINOR] Two unexplained input notations.** Builds use `values=[2,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)`; the Description and Q8/Q9 use `root = {val: 2, left: {val: 1}, …}`. Nothing says that `edges [0,1]` means "node 0's child is node 1", that the first listed child is `left`, or that the array index is the `levelOrderIndex` required by the node-name guide. (S1 Q1, Q2, Q4, Q6, Q8)
- **[MINOR] "Why" text explains nothing.** After every build the same sentence appears: "Evaluating children before their parent makes the root true." (or "…false."). It never says which gate/leaf produced the result. (S1 all builds)

### Step 2
- **[MAJOR] "CHOOSE THE ROOT GATE" cannot be chosen and there are no gates.** The start field is read-only "root" under a label that says CHOOSE; nodes in Step 2 carry no value (no AND/OR/true/false), so the boolean problem is absent. "CORRECT OUTPUT" must be the reached position list `["L","R","root"]`, while the problem returns a boolean — a student who types `true` gets no hint. Also the taught Step 1 names `0:OR`/`1:true` are rejected here with "Use root, L, R, LL, LR, ... to name tree positions." (already listed in SYSTEMIC-NOTES). (S2 Q1–Q3)
- **[MAJOR] P4: Khloe's graph must be identical to the correct graph.** Grader: "character's graph must be exactly: … edges: root→L, root→R, L→LL, L→LR, R→RL, R→RR" (same as drawing 1). The prompt says "then Khloe's graph using the mistake", so a literal student draws only the last branches (root→R, R→RR) and fails. Fix: for search-order bugs say "Draw the same graph again; the mistake is in how Khloe walks it", or auto-copy drawing 1. (S2 Q2 `last-branch`)
- **[MINOR] Validation message uses an undefined notion.** Drawing 1 rejects a node with one child: "A Boolean operator node needs both a left and a right child." Nothing tells the student that any node with a child counts as an operator, and Trenton's drawing 2 (`root→L` only) is accepted. (S2 Q2, Q3)

### Step 3
- **[MINOR] "Wrong" node rule produces the required graph on one-leaf inputs.** Q1 (`values=[0]`) variant 1: "Use this node rule for the graph: “Only leaves containing 0 or 1.”" keyed NO; Q5 (`values=[1]`): "It would be a mistake to use this node rule: “Only leaves containing 0 or 1.”" keyed YES. For these inputs that rule yields exactly the required one-node graph (`0:false` / `0:true`), so a student who tests the rule against the shown input is marked wrong. Fix: only quote rules that actually change the graph for the mini-input. (S3 Q1, Q5)
- **[MINOR] P5: wrong-answer feedback starts with "Correct."** Q2 claim "0:OR and 2:false are directly connected…" → shown after a wrong answer under ×: "Correct. The mini-example lists 0:OR→2:false as one direct edge." Same in Q3 and Q5 ("Correct. A zero-step path…"). (S3 Q2, Q3, Q5)

### Step 4
- **[BLOCKER] Case 1 requires node names "AND", "true", "false"; cases 2–3 require "0:AND", "1:true", "2:false".** No node-name guide is shown in Step 4. Step 1/3 taught `levelOrderIndex:value` (e.g. `0:AND`). A student using the taught names fails case 1 with only "The drawing has every exact node ×"; a student who then drops the index fails case 2. Fix: relabel case 1's canvas to `0:AND`, `1:true`, `2:false`. (S4 case 1 `authored-deep-case`)
- **[MAJOR] P2: one bug, one code listing, one diagnosis set for all three cases.** All three show the same `evaluateTree` with `return left || right;` as the fallback and the same three sentences (shuffled). After case 1, cases 2 and 3 ("values=[3,1,0]" = S1 Q2's input, "values=[3,0,2,1,1]") are solved by picking the sentence containing "left || right". Fix: give cases 2/3 a different bug (leaf inversion, short-circuit, wrong base case). (S4 cases 2–3)
- **[MINOR] P3: feedback reveals the diagnosis.** After a wrong diagnosis the panel prints "Code rule: Every internal node returns the OR of its child results." — the correct answer in plain words — before the retry. (S4 all cases)
- **[MINOR] Case 1 input in object form, cases 2–3 in `values=`/`edges=` form** with no bridge between them. (S4)

### Cross-step / other
- **[MAJOR] Four naming schemes in one lesson.** Step 1/3: `0:OR`; Step 2: `root`, `L`, `R`; Step 4 case 1: `AND`, `true`; Step 4 cases 2–3: `0:AND`. Only Step 1/3 show a guide.

## Find All Groups of Farmland (`find-all-groups-of-farmland`)

### Step 1
- **[BLOCKER] Q9 cannot be completed.** Input `land=[[0]]`, question "What should the function return?" with choices `[]` / `[[0,0,0,0]]`. The required graph has ZERO nodes and "answer buttons were disabled until a node was drawn", so the student can only unlock the buttons by drawing a wrong node. Harness: "FAILED / DEAD END". The completion screen then says "FINISHED / Step 1 finished. / 8 passed · 1 skipped." and the strip reads "8 OF 9 VISUAL CHECKS PASSED". Fix: enable the buttons when the required graph is empty, or replace the input (e.g. `land=[[0,1]]`). (S1 Q9 / `build-4`)
- **[MINOR] Q8 repeats Q1.** `land = [[1,1],[1,1]]` with correct `[[0,0,1,1]]` and the same distractor `[[0,0,0,1],[1,0,1,1]]` (split by row) was already Q1; the same grid is also Q2's picture and Step 4 case 1. (S1 Q8 `bug-trap`)
- **[MINOR] "Which picture exactly matches this fresh input?"** — Q2's input is Q1's input, not fresh. Same wording in flood-fill Q3 and gfg Q3. (S1 Q2)
- P1 applies (Picture B lists three names, the others four). (S1 Q2)

### Step 2
- **[MAJOR] Output field contradicts nine Step 1 questions.** Step 1 asked "What should the function return?" nine times with rectangle answers like `[[0,0,0,1],[1,2,1,2]]`. Here "CORRECT OUTPUT" must be the reached-cell list `["(0,0)","(0,1)","(0,2)"]`; rectangles, `(0,0), (0,1)` and `[(0,0),(0,1)]` are all rejected with no hint. Fix: label the field "Cells the search reaches" and show one example. (S2 Q1–Q3)
- **[MAJOR] P4: Bianca's graph must be identical to the correct graph.** Grader: "character's graph must be exactly: … edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)" (same as drawing 1) although the prompt says "then Bianca's graph using the mistake". (S2 Q2 `last-branch`)
- **[MINOR] "plot seed" is a term used nowhere else**, and nothing enforces the problem's guarantee that groups are rectangles (the harness's L-shaped plot was accepted). (S2 all)

### Step 3
- **[MAJOR] Claim asserts a false premise.** Q5 `land=[[1,0,1]]` (two isolated nodes): "(0,0) can reach (0,2), so the graph should contain a direct edge between them." (0,0) cannot reach (0,2) at all. NO is keyed correct, but the wrong-answer feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2)." leaves the false premise standing. Fix: use the template used in gfg Q5: "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable." (S3 Q5)
- **[MINOR] Wrong rule gives the right graph.** Q2 `land=[[1]]`: "Use this node rule for the graph: “Every forest and farmland cell.”" keyed NO, but with no forest cell that rule yields exactly the required graph `(0,0)`. (S3 Q2)
- **[MINOR] Guide contradiction on failure.** After a wrong graph, "Use this graph model … LABELS: Both (0,2) and 0,2 work." appears under a guide that says "Name each cell (row,column) … Do not add spaces". Only shown after failing. (S3 Q1)
- P5 applies: Q1 "Correct. The mini-example lists (0,0)—(0,1) as one direct edge." shown under ×. (S3 Q1, Q4)

### Step 4
- **[MAJOR] P2: one bug for all three cases.** All three show the same `findFarmland` with `answer.push([row, column, bottom + 1, right + 1])` and the same three sentences; cases 2 and 3 are Step 1's Q4 and Q6 grids. (S4 cases 2–3)
- **[MINOR] The shown code contains no DFS or graph.** It is a double loop with two `while` scans, so the graph the student must draw plays no part in the code; the distractor "The boundary scans stop at the first row or column and miss farmland deeper in the rectangle" (id `missing-dfs`) refers to a search that isn't there. (S4 all cases)
- P3 applies ("Code rule: It finds the correct component bounds, then increments both final indexes."). Buggy outputs `[[0,0,2,2]]`, `[[0,0,1,1],[1,1,2,2]]`, `[[0,0,1,2],[1,2,2,3]]` verified with node.

### Cross-step / other
- `land=[[1,1],[1,1]]` appears four times (S1 Q1, Q2, Q8; S4 case 1).

## Flood Fill (`flood-fill`)

### Step 1
- All nine keys and five remedial keys are correct.
- **[MINOR] "fresh input" wording** — Q3's input is Q1's. (S1 Q3)
- P1 applies (Picture B lists two names). (S1 Q3)

### Step 2
- **[MAJOR] Output field contradicts Step 1.** Step 1 drilled "What should the function return?" with image matrices (`[[2,2],[2,0]]`); here "CORRECT OUTPUT" must be `["(0,0)"]` (reached pixels). No hint. (S2 Q1–Q3)
- **[MINOR] Hidden wrong start "(0,1)".** "Josephine runs the search from a different starting pixel." The student's graph must contain a node named exactly `(0,1)` or Josephine has nowhere to start; if the student picks `(0,1)` as their own start no counterexample is possible. Only revealed in Drawing 2's title. (S2 Q2)

### Step 3
- **[MAJOR] Claim asserts a false premise.** Q3 `image=[[1,2,1]], sr=0, sc=0` (nodes (0,0),(0,2), no edges): "(0,0) can reach (0,2), so the graph should contain a direct edge between them." — (0,0) cannot reach (0,2). Feedback never corrects the premise. (S3 Q3)
- **[MINOR] Wrong rule gives the right graph.** Q5 `image=[[1,1],[1,1]]`: "It would be a mistake to use this node rule: “Every pixel in the image.”" keyed YES, but every pixel IS start-colour here, so that rule yields exactly the required four-node graph. (S3 Q5)
- P5 applies (Q2 "Right. A multi-step route…" under ×).

### Step 4
- **[MAJOR] P2: "Paint spreads across corners" in all three cases.** Same eight-offset `floodFill` each time; the correct sentence always contains "diagonal"/"corner". (S4 cases 2–3)
- **[MINOR] Self-refuting distractor.** Case 3: "The start row and column are swapped, so fill begins at (0,0) by accident." — sr and sc are both 0, so swapping changes nothing; the feedback admits it ("both happen to be 0 here anyway"). (S4 case 3)
- P3 applies. Buggy outputs `[[2,0],[0,2]]`, `[[2,0,0],[0,2,0],[0,0,2]]`, `[[2,2,0],[0,0,2],[0,0,2]]` verified by hand.

### Cross-step / other
- None beyond the above.

## Hiking Around the Flood (`flooded-campsite-trails`)

### Step 1
- All keys are correct.
- **[MINOR] Odd-one-out answer sets.** Q7 offers "false — DFS first reaches flooded campsite 4", "false — one flooded campsite invalidates the whole map", "false — campsite 5 touches a route through flooded 4", "true — use 0→1→2→5": three `false` and one `true`, so a student who computes `true` has nothing to decide, and the correct letter is the odd one out. Q9 is the mirror (three "true —", one "false —") and its answer is quoted verbatim in the Description: "If start or finish is itself flooded, return false." (S1 Q7, Q9)
- **[MINOR] "Fresh proof · Read one direct relation" has no relations.** The remedial for the edge-rule concept is `n=3, trails=[], flooded=[], start=0, finish=2`. (S1 remedial `concept-edge`)
- P1 applies (Picture D lists three names). (S1 Q3)

### Step 2
- **[MAJOR] Step 2 never touches flooding.** There is no way to mark a campsite flooded, so all three rounds (wrong start, one-way, first-branch) test generic reachability, and "CORRECT OUTPUT" is a list like `[0,1,2,3]` although the problem returns `true`/`false`. (S2 Q1–Q3)
- **[MAJOR] Alejandro round depends on click order and a hidden goal.** Hidden authored goal: "Write a trail in reverse order so treating it as an arrow blocks the dry route." The harness had to draw `1—0` (far node first) so Alejandro's arrow is `1→0`; drawing `0—1` by clicking 0 first makes Alejandro's reach `[0,1]` = correct reach, no counterexample, and nothing on screen says so. (S2 Q2 `make-one-way`)
- **[MINOR] Hidden wrong start "1".** If the student chooses 1 as the start, Stephanie's search equals the correct one. (S2 Q1)
- P4 applies to Nicole (character graph must equal the correct graph). (S2 Q3)

### Step 3
- **[MAJOR] Reachability claims walk through flooded campsites.** Q2 `trails=[[0,1],[1,2],[2,3]], flooded=[1]`: "2 can reach 0 through 1, but the graph still has no direct 2—0 edge." keyed YES; Q1 variant 2 (`flooded=[1]`): "1 can reach 3 through 4, but the graph still has no direct 1—3 edge." keyed YES although 1 itself is flooded. Step 1's own edge rule says "traversal may use it only when the next campsite is dry", so a student applying the lesson answers NO and is marked wrong. Fix: generate reach claims only along dry nodes, or word them "ignoring flooding, …". (S3 Q1, Q2)
- **[MINOR] Degree counts include flooded neighbours without saying so.** Q1 "0 has exactly 1 direct neighbor." → feedback "0 has 2 direct neighbors." (one of them flooded 1). (S3 Q1)
- **[MINOR] Feedback renders backticks as line breaks.** Shown text: "Correct node rule: Every campsite / 0 / through / n−1 / , with flooded status marked on the affected nodes." (each on its own line). Same in gas-pocket ("(row,column)" on its own line) and gold-and-silver ("0", "n−1"). (S3 Q1)

### Step 4
- **[MAJOR] P2: "Accepts a flooded destination" in all three cases**; the correct sentence always says the finish check runs before the flooded check. (S4 cases 2–3)
- **[MINOR] Choice and feedback name a variable that does not exist.** Case 3: "The cycle makes recursion loop forever because nodes are never marked seen." / "Safe nodes enter seen before their neighbors are explored" — the code's set is `visited`. (S4 case 3)
- P3 applies. Buggy `true` for cases 2 and 3 verified with node; correct `false` (finish is flooded) matches the statement.

### Cross-step / other
- Step 4 code is `solve(input)` reading `input.n`, `input.trails`; the statement never names a function or an `input` object.

## Gas Pocket Survey (`gas-pocket-survey`)

### Step 1
- All keys are correct.
- **[MINOR] Q8 repeats Q1 in a second notation.** Q1 `cave=["UG","GU"], drill=(0,0)` → "2"; Q8 `cave=[["U","G"],["G","U"]], row=0, col=0` → "2". Two input notations (`["UG"]`/`drill=` vs `[["U","G"]]`/`row=, col=`) are used without explanation; Step 4 mixes them again. (S1 Q1, Q8)
- **[MINOR] Q9 answers itself.** "In the larger cave picture, cell (0,2) touches gas only diagonally. What label does the reveal place there?" — the sentence already says the gas is diagonal, and "the larger cave picture" refers to a drawing the student may not have made (drawing is optional). (S1 Q9)
- **[MINOR] Q2 is a drawing marathon for a two-neighbour question.** `cave=["UUU","UGU","UUU"]` requires 9 exact nodes and 12 exact edges while the decision only depends on (0,1) and (1,0). (S1 Q2)
- P1 applies (Picture D lists three names). (S1 Q3)

### Step 2
- **[MINOR] No gas exists in Step 2**, so "drill square" reach set ≠ the reveal, and "CORRECT OUTPUT" is `["(0,0)","(0,1)","(0,2)"]` where the problem returns a grid. (S2 Q1–Q3)
- P4 applies to Dominic. (S2 Q3)

### Step 3
- **[MINOR] Wrong rule gives the right graph.** Q4 `cave=["G"]`: "Use this node rule for the graph: “Only gas cells, because the task is a gas survey.”" keyed NO, but the only cell is gas, so the rule yields the required graph. (S3 Q4)
- **[MINOR] Feedback renders `(row,column)` on its own line** ("Correct node rule: Each cave cell at its own / (row,column) / position."). (S3 Q1)

### Step 4
- **[MAJOR] Input notation ≠ required output notation.** Cases 2 and 3 show `cave=["UUU","UUG"], drill=(0,1)` (rows as strings, `drill=`), but the code reads `input.row`/`input.col` and the graded answer must be `[["U","1","U"],["U","U","G"]]` (nested arrays of quoted letters). A student who mirrors the shown input and types `["U1U","UUG"]` is rejected with no explanation. Case 1 shows the nested-array form. Fix: show cases 2/3 as `cave: [["U","U","U"],["U","U","G"]] / row: 0 / col: 1`. (S4 cases 2–3)
- **[MINOR] Misconception title wrong for case 3.** "A diagonal gas pocket stops the reveal" — in `["GGU","UUU"], drill=(1,1)` the reveal stops in both versions; the bug changes the digit from 1 to 2. (S4 case 3)
- **[MAJOR] P2: same bug and same two distractors** ("spreads diagonally…", "edits the original cave in place…") in all three cases; the second distractor is refuted by the code's second line (`input.cave.map((row) => [...row])`). (S4 cases 2–3)
- P3 applies. Buggy outputs verified with node.

### Cross-step / other
- Statement names `surveyCave(cave, row, col)`; Step 4 shows `solve(input)`.

## Check for Path in a 2D Grid with Obstacles (`gfg-grid-path-exists`)

### Step 1
- All keys are correct.
- **[MAJOR] Q8 distractors are fragments or true statements.** Question "Which graph reasoning is correct for this case?" for `[[1,3,0],[0,3,0],[0,3,2]]`; choices "the 3 cells form a side-connected route", "the route must be a straight line", "with diagonal moves", "3 is not the destination". "with diagonal moves" is not a sentence, and "3 is not the destination" is literally true (the destination is 2), so a literal student can defend D. Fix: make each choice a complete claim about why the function returns true. (S1 Q8)
- **[MAJOR] Q9 has two true-statement distractors.** For `[[1,0,3],[0,0,3],[3,3,2]]`: "the lower 3 region touches the destination" is true ((2,1)—(2,2)); "source is on an edge" is true ((0,0)); "by moving diagonally" is a fragment. Only "walls box the source away from every 3" explains the `false`, but the question does not ask for the explanation of the returned value. (S1 Q9)
- **[MINOR] "fresh input"** — Q3's input is Q1's. (S1 Q3)
- P1 applies (Picture B lists two names). (S1 Q3)

### Step 2
- **[MINOR] Hidden wrong start "(0,1)".** "Erick ignores the chosen source cell and uses a different one." — the student's graph must contain `(0,1)` and must not use it as the start. (S2 Q1)
- P4 applies to Jace. (S2 Q3)

### Step 3
- All 15 claims are correctly keyed; no problem-specific issue beyond SYSTEMIC-NOTES.

### Step 4
- **[MAJOR] P2: "Walls can be crossed diagonally" in all three cases**; the correct sentence always contains "diagonal". (S4 cases 2–3)
- **[MINOR] Nonsensical distractor naming a variable that does not exist.** Case 2: "The seen key confuses row 1,column 1 with row 11,column 0." — the code uses `visited`, and the scenario cannot occur. (S4 case 2)
- P3 applies. Buggy `true` for all three cases verified by hand (8-offset loop).

### Cross-step / other
- None beyond the above.

## Gold and Silver Lights (`gold-and-silver-lights`)

### Step 1
- **[BLOCKER] Q9 answer key is wrong.** Raw input `n=6, wires=[[0,1],[1,2],[1,4],[0,3],[3,5]], goldStart=0`, question "Using even distance from bulb 0, how many bulbs are gold?". Distances: 0→0, 1→1, 3→1, 2→2, 4→2, 5→2. Even-distance (gold) bulbs are 0, 2, 4 **and 5** → **4**. The key marks `3` correct ("Correct: bulbs 0, 2, and 4 have even distance.") and tells a student who answers 4: "This marks bulb 5 gold after resetting distance on the second branch." — but bulb 5 really is two wires from bulb 0 (0—3—5) and really is gold. Verified with node. Source: `scripts/build-variant-lessons-v3.js` line 140. Fix: change the wires so 5 is at odd distance (e.g. `[[0,1],[1,2],[1,4],[0,3],[4,5]]` gives gold {0,2,4} = 3) and regenerate, or change the key to 4. (S1 Q9 / `concept-counterexample`)
- **[MINOR] Builds ask an unexplained question.** All four builds and all five remedials ask "How many bulbs are an even number of wires from bulb 0?", but the lesson first states that even distance = gold only in Q7. Every one of these nine builds has the same single trick (does distance 0 count as "an even number of wires"?) with the same distractor. (S1 Q1, Q3, Q6, Q8, remedials)
- **[MINOR] `goldStart=0` is not a parameter of the problem.** It appears in builds and Step 4 cases 2–3, is absent from Q4/Q5 and Step 4 case 1, and the Description says bulb 0 is always gold. (S1, S4)
- **[MINOR] Remedial for `concept-counterexample` is Q6's input** (`n=5` star). (S1 remedial)
- P1 applies (Picture D lists four names). (S1 Q2)

### Step 2
- **[MAJOR] Josiah round needs a hidden drawing trick.** Start is read-only "0" under "CHOOSE THE FIRST GOLD BULB". Hidden goal: "Orient a listed wire toward the gold bulb so a fake arrow blocks coloring." — the student must click the far bulb first on every wire so Josiah's arrow points into 0 (harness drew `1—0`). Drawing `0—1` by clicking 0 first gives Josiah reach `[0,1]` = correct reach and no counterexample; nothing on screen explains this. (S2 Q1 `make-one-way`)
- **[MINOR] "CORRECT OUTPUT" is `[0,1]`** for a problem whose output is a count. (S2 all)
- P4 applies to Kyle. (S2 Q3)

### Step 3
- All claims correctly keyed.
- **[MINOR] Feedback renders `0` and `n−1` on their own lines** ("Correct node rule: Each bulb / 0 / through / n−1 / , before choosing its gold or silver color."). (S3 Q1)

### Step 4
- **[MAJOR] Unfinished text shown to the student.** Case 2 graph proof: "→ Reachable boundary: root-silver →" — an internal token, shown both after a wrong diagnosis and in the success text. The same chain's "Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 1—3, 3—4." spells out the exact required graph. Fix: write a real sentence (e.g. "Bulb 0 is coloured silver, so the two colour classes swap.") and drop the node/edge list. (S4 case 2)
- **[MAJOR] P2: same bug, identical three sentences in all three cases**; case 3 (5-leaf star → 5) is case 1 (4-leaf star → 4) with one more leaf. (S4 cases 2–3)
- **[MINOR] Input notation differs between cases.** Case 1 "n: 5 / wires: [[0, 1], …]"; cases 2–3 "n=5, wires=[[0,1],…], goldStart=0" while the code reads `input.n`/`input.wires` and ignores `goldStart`. (S4)
- P3 applies. Buggy outputs 4 / 2 / 5 verified with node; correct 1 / 3 / 1 verified.

### Cross-step / other
- None beyond the above.

## One-line summary of every finding in this batch
- [BLOCKER] evaluate-boolean-binary-tree S1: Q6 key says `false` for values=[3,1,2,0,1] but the root evaluates to `true`
- [MINOR] evaluate-boolean-binary-tree S1: picture choices print node-name lists, exposing the missing-node distractor (P1, all 7 problems)
- [MINOR] evaluate-boolean-binary-tree S1: `values=/edges=` notation never explained; Description and Q8/Q9 use object form
- [MINOR] evaluate-boolean-binary-tree S1: generic "Why" text after every build
- [MAJOR] evaluate-boolean-binary-tree S2: "CHOOSE THE ROOT GATE" is read-only, nodes have no gate values, output must be `["L","R","root"]` not a boolean
- [MAJOR] evaluate-boolean-binary-tree S2: Khloe's (last-branch) graph must be identical to the correct graph despite "using the mistake" (P4)
- [MINOR] evaluate-boolean-binary-tree S2: "A Boolean operator node needs both a left and a right child" applied only to drawing 1
- [MINOR] evaluate-boolean-binary-tree S3: "Only leaves containing 0 or 1" rule yields the required graph for values=[0]/[1] yet is keyed as a mistake
- [MINOR] evaluate-boolean-binary-tree S3: wrong-answer feedback begins "Correct." (P5)
- [BLOCKER] evaluate-boolean-binary-tree S4: case 1 hidden labels "AND","true","false" vs "0:AND","1:true","2:false" in cases 2–3 and Step 1
- [MAJOR] evaluate-boolean-binary-tree S4: same bug/code/diagnosis sentences in all 3 cases (P2)
- [MINOR] evaluate-boolean-binary-tree S4: wrong-diagnosis feedback prints the correct "Code rule" (P3)
- [MINOR] evaluate-boolean-binary-tree S4: case 1 object-form input vs values-form in cases 2–3
- [MAJOR] evaluate-boolean-binary-tree S1-4: four different node-naming schemes across the lesson
- [BLOCKER] find-all-groups-of-farmland S1: Q9 land=[[0]] has an empty required graph and disabled answer buttons — dead end, "8 passed · 1 skipped"
- [MINOR] find-all-groups-of-farmland S1: Q8 repeats Q1 (same grid, answer, distractor)
- [MINOR] find-all-groups-of-farmland S1: "fresh input" wording for a repeated input
- [MAJOR] find-all-groups-of-farmland S2: output must be reached cells `["(0,0)",…]` after Step 1 trained rectangle answers
- [MAJOR] find-all-groups-of-farmland S2: Bianca's (last-branch) graph must equal the correct graph (P4)
- [MINOR] find-all-groups-of-farmland S2: "plot seed" term; rectangle guarantee not enforced
- [MAJOR] find-all-groups-of-farmland S3: Q5 claim "(0,0) can reach (0,2)" has a false premise on land=[[1,0,1]]
- [MINOR] find-all-groups-of-farmland S3: Q2 "Every forest and farmland cell" rule yields the required graph for land=[[1]]
- [MINOR] find-all-groups-of-farmland S3: failure panel "Both (0,2) and 0,2 work" contradicts the guide
- [MAJOR] find-all-groups-of-farmland S4: same bug/code/diagnosis sentences in all 3 cases (P2)
- [MINOR] find-all-groups-of-farmland S4: shown code has no DFS/graph; "missing-dfs" distractor refers to a search that isn't there
- [MINOR] flood-fill S1: "fresh input" wording for a repeated input
- [MAJOR] flood-fill S2: output must be reached pixels `["(0,0)"]` after Step 1 trained image-matrix answers
- [MINOR] flood-fill S2: Josephine's hidden start "(0,1)" must exist in the student's graph
- [MAJOR] flood-fill S3: Q3 claim "(0,0) can reach (0,2)" has a false premise on image=[[1,2,1]]
- [MINOR] flood-fill S3: Q5 "Every pixel in the image" rule yields the required graph for [[1,1],[1,1]]
- [MAJOR] flood-fill S4: same "diagonal" bug in all 3 cases (P2)
- [MINOR] flood-fill S4: case 3 distractor "start row and column are swapped" is self-refuting (sr=sc=0)
- [MINOR] flooded-campsite-trails S1: Q7/Q9 are 3-vs-1 odd-one-out answer sets; Q9's answer is quoted in the Description
- [MINOR] flooded-campsite-trails S1: edge-rule remedial "Read one direct relation" has trails=[]
- [MAJOR] flooded-campsite-trails S2: flooding cannot be expressed, so no round tests the problem's rule; output is a reach list not true/false
- [MAJOR] flooded-campsite-trails S2: Alejandro round only works if wires are drawn far-node-first (hidden goal "Write a trail in reverse order")
- [MINOR] flooded-campsite-trails S2: Stephanie's hidden start "1" collides if the student starts at 1
- [MAJOR] flooded-campsite-trails S3: Q1/Q2 reach claims pass through flooded campsites ("2 can reach 0 through 1" with 1 flooded) keyed YES
- [MINOR] flooded-campsite-trails S3: degree counts include flooded neighbours without saying so
- [MINOR] flooded-campsite-trails S3: backticked `0`/`n−1` render as separate lines in feedback
- [MAJOR] flooded-campsite-trails S4: same bug in all 3 cases (P2)
- [MINOR] flooded-campsite-trails S4: case 3 choice/feedback say "seen" but the code uses `visited`
- [MINOR] gas-pocket-survey S1: Q8 repeats Q1 in a second, unexplained input notation
- [MINOR] gas-pocket-survey S1: Q9 states "touches gas only diagonally" in the question, giving the answer
- [MINOR] gas-pocket-survey S1: Q2 requires 9 nodes/12 edges for a two-neighbour decision
- [MINOR] gas-pocket-survey S2: no gas in Step 2; output is reached cells, problem returns a grid
- [MINOR] gas-pocket-survey S3: Q4 "Only gas cells" rule yields the required graph for cave=["G"]
- [MINOR] gas-pocket-survey S3: `(row,column)` rendered on its own line in feedback
- [MAJOR] gas-pocket-survey S4: cases 2–3 show string-row input `["UUU","UUG"], drill=(0,1)` but require nested-array output `[["U","1","U"],…]`
- [MINOR] gas-pocket-survey S4: misconception title "stops the reveal" is wrong for case 3 (digit 1→2)
- [MAJOR] gas-pocket-survey S4: same bug and same two weak distractors in all 3 cases (P2)
- [MAJOR] gfg-grid-path-exists S1: Q8 distractors "with diagonal moves" (fragment) and "3 is not the destination" (true statement)
- [MAJOR] gfg-grid-path-exists S1: Q9 distractors "the lower 3 region touches the destination" and "source is on an edge" are true statements
- [MINOR] gfg-grid-path-exists S1: "fresh input" wording for a repeated input
- [MINOR] gfg-grid-path-exists S2: Erick's hidden start "(0,1)"
- [MAJOR] gfg-grid-path-exists S4: same "diagonal" bug in all 3 cases (P2)
- [MINOR] gfg-grid-path-exists S4: case 2 distractor "The seen key confuses row 1,column 1 with row 11,column 0" names a non-existent variable
- [BLOCKER] gold-and-silver-lights S1: Q9 key says 3 but wires [[0,1],[1,2],[1,4],[0,3],[3,5]] give 4 gold bulbs (0,2,4,5); feedback wrongly says bulb 5 is not gold
- [MINOR] gold-and-silver-lights S1: builds ask "even number of wires from bulb 0" before gold=even is taught; all 9 builds hinge on the same distance-0 trick
- [MINOR] gold-and-silver-lights S1: `goldStart=0` is not a problem parameter and appears inconsistently
- [MINOR] gold-and-silver-lights S1: counterexample remedial reuses Q6's input
- [MAJOR] gold-and-silver-lights S2: Josiah round requires drawing every wire far-node-first (hidden goal "Orient a listed wire toward the gold bulb")
- [MINOR] gold-and-silver-lights S2: output `[0,1]` for a count problem
- [MINOR] gold-and-silver-lights S3: backticked `0`/`n−1` render as separate lines in feedback
- [MAJOR] gold-and-silver-lights S4: case 2 shows raw token "Reachable boundary: root-silver" and lists the exact required nodes/edges
- [MAJOR] gold-and-silver-lights S4: same bug, identical sentences in all 3 cases (P2)
- [MINOR] gold-and-silver-lights S4: input notation differs between case 1 and cases 2–3
