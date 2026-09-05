# Batch AC findings

Problems: hackerrank-connected-cells, kattis-getting-gold, kth-song-in-playlist, ladder-takahashi, longest-freight-train, max-area-of-island, maximum-number-of-fish-in-a-grid.

All Step 4 buggy outputs were re-run with node; every declared "expected buggy output" matches the shown code (cc 1/1/1, gold 1/1/2, kth 3/-1/-1, ladder 1/4/5, freight 1/1/2, island 2/3/4, fish 2/3/1). Every Step 1 build answer key was re-derived by hand and is correct unless listed below.

## Connected Cells in a Grid (`hackerrank-connected-cells`)

### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** Raw input `grid=[[0]]`, hidden correct graph has zero nodes, and the answer buttons "were disabled until a node was drawn". The student is asked "What should the function return?" but cannot click 0 without first drawing a node, which then fails "Every exact node label". Harness skipped it ("8 passed · 1 skipped"). Fix: allow answering when the expected graph is empty, or use an input with at least one 1-cell (e.g. `[[0,1]]`).
- **[MINOR] Q7 and Q9 are the Description's Example 1 and Example 2 verbatim, with the answers printed there.** Q7 `[[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]` → Description says "output 5"; Q9 `[[1,0,1],[0,1,0],[1,0,1]]` → Description says "output 5". Both concept checks are answerable by flipping to the Description tab. Q9's input is reused again as Step 4 case 3.

### Step 2
- **[MINOR] "CHOOSE THE REGION SEED / region seed" is undefined jargon.** Nothing tells the student that "region seed" means the cell the search starts from. Suggest "Choose the start cell".
- Bug simulation for Peter/Violet/Jaylen is accurate for what the grader does (remove-diagonals only strips edges between diagonally adjacent coordinates; last-branch/shallow-search as described). No problem-specific issues beyond the systemic ones.

### Step 3
- **[MAJOR] Q1 relation claim has a false premise.** Input `grid=[[1,0,0],[0,0,1]]` (two isolated cells) shows "(0,0) can reach (1,2), so the graph should contain a direct edge between them." — (0,0) cannot reach (1,2) at all. NO is keyed correct, but the sentence tells the student a falsehood, and the feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2)." still implies they are reachable. The same wording appears in all three variants of Q1. Use the phrasing already used elsewhere: "There is no direct edge between (0,0) and (1,2); merely naming both nodes does not make them reachable."
- **[MINOR] Q3 wrong-answer feedback starts with "Correct."** Claim "(1,0) and (1,1) are directly connected, not merely reachable through a longer route." (YES) has feedback-if-wrong "Correct. The mini-example lists (1,0)—(1,1) as one direct edge." A student who answered NO sees an × followed by "Correct." Drop the word.

### Step 4
- **[MAJOR] Diagnosis choices and feedback use variable names that are not in the shown code.** Code declares `directions`, `visited`, `largestValue`; the choices say "dirs lists only side moves…" (keyed correct, cases 1–2), "dirs omits all four diagonal edges…" (keyed correct, case 3), "Sharing seen between component searches…", "best starts at zero instead of one…", "The global seen set merges…"; feedback says "A global seen set is correct". A literal student searching the code for `dirs`, `seen`, or `best` finds nothing. Rename in `step4-specs-new.json` to match the code (`directions`, `visited`, `largestValue`).
- **[MINOR] Nonsensical distractor wording.** Case 1 C: "best starts at zero instead of one, and that graph-level change determines the returned value." (an initial value is not a graph-level change). Case 3 A: "best should start at one, which alone would make the correct answer five." Neither describes a believable student mistake.
- **[MINOR] All three cases show the identical function and identical bug ("Diagonal region edges are discarded").** After case 1 the student re-picks the same diagnosis twice; case 2's input is Step 1's node-rule remedial and Step 3 Q4, case 3's is Step 1 Q9 / Description Example 2. Input shown as `grid: [[1, 0], [0, 1]]` in case 1 but `grid=[[1,0,1],[0,1,0]]` in case 2.

### Cross-step / other
- Fine otherwise; node-label format is consistent across steps ("(r,c)"; Step 2 placeholder "Example: (0,0)").

## Getting Gold (`kattis-getting-gold`)

### Step 1
- **[MAJOR] Q1 and Q2 (the first two screens) require a graph model the lesson has not taught yet and the Description never states.** Hidden Q1 graph: 9 nodes including the trap cell "(3,3)" as an isolated node, DIRECTED, 16 arrows, with draft squares (2,3) and (3,2) having incoming but no outgoing arrows. The Description says "She can't see traps" and never mentions traps being nodes or arrows being one-way; the node rule ("Every non-wall square: floor, start, gold, and trap") is only revealed as the answer to Q5 and the edge rule only at Q7, both after the builds. On failure Step 1 says only "Not exact yet. Recheck the problem and input. The correct model stays hidden." with × marks. A literal student will draw 8 floor cells with two-way lines and has no way to discover "trap is a node" or "draft square = no outgoing arrow" except by guessing. Move the node-rule/edge-rule concept questions before the first build, or show the graph model for this problem in Step 1.
- **[MAJOR] Drawing burden is extreme for a first question.** Q1 needs 9 nodes and 16 directed arrows drawn exactly (8 two-way pairs each drawn as two arrows); the predict-output remedial and bug-trap remedial also need 16 arrows; Step 3 Q4 and Q5 need 16 arrows; Step 4 cases 2–3 need 9 nodes + 8 arrows. A struggling student will spend most of the lesson clicking arrows. Consider 2×2/1×3 interiors for builds.
- **[MINOR] Q3 exact-picture is a visual needle-in-haystack.** Picture C differs from the correct Picture A only by one arrow reversed among 16: (2,3)→(1,3) instead of (1,3)→(2,3). Picture B drops only (3,1)→(3,2). Spotting one arrowhead among 16 in a small picture is not a concept test.
- **[MINOR] Q8/Q9 are Description Examples 1/2 with answers printed ("output 1", "output 4"), and their prompts say "In the first shown dungeon" / "In the second shown dungeon" although only one dungeon is on screen.**
- **[MINOR] Two different wordings of the node rule.** Q5's correct choice reads "Every non-wall square: floor, start, gold, and trap." but every Step 3 feedback says "Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges." (from the `kattis-getting-gold` override in visual-library.js ~line 1281). Pick one.

### Step 2
- **[MINOR] Three hidden requirements surface only as errors after "Check my graph".** (1) Must switch on the "Directed edges" toggle → otherwise "Turn on directed arrows."; (2) labels must be interior coordinates → "This board has a wall border. Use interior coordinates starting at (1,1)." (placeholder "Example: (1,1)" is the only hint); (3) reusing Step 1's 9-node graph → "Draw 1–8 nodes." None of this is on the screen text.
- **[MINOR] Q3 Alexia "uses the wrong player square" — the square (1,2) is shown only in Drawing 2's title.** The student must draw (1,2) in the correct graph too, and learns that only from the error "Also draw (1,2), the wrong player square used by the broken search."

### Step 3
- **[MINOR] Q1 v1 claim "(1,3) and (1,2) are directly connected, not merely reachable through a longer route." on a directed graph where only (1,3)→(1,2) exists ((1,2) is a draft square with no outgoing arrow).** "Directly connected" is undefined for one-way arrows; a student who reasons "(1,2) cannot go to (1,3)" answers NO and is marked wrong with feedback that begins "Correct. The mini-example lists (1,3)→(1,2) as one direct edge." (shown under ×). Same pattern in v2 "(1,3) and (2,3) are directly connected".
- Other claims (degree/out-degree, shortcut claims) are correctly keyed.

### Step 4
- **[MINOR] The trap cell must be drawn as an isolated node with no guide.** Hidden graphs list "(2,2)" (trap) as a required node in all three cases; a student who omits it fails "The drawing has every exact node" with no hint. The Step 3 "Use this graph model" hint is not shown in Step 4.
- **[MINOR] Cases 2 and 3 repeat case 1's code and its exact correct-choice text** "At (1,2) the code keeps exploring even though trap (2,2) is adjacent." Case 2's input is Step 1 Q2; case 3's is Step 1's exact-picture remedial and Step 3 Q1. Case 1 labels the input `grid: [...]`, cases 2–3 `dungeon=[...]`, while the signature is `collectSafeGold(grid)`.
- Declared buggy outputs 1/1/2 verified; correct outputs 0/0/0 verified against the rules.

### Cross-step / other
- Description variable is `grid`; Step 1/3 raw inputs say `dungeon=`. Minor naming drift.

## The K-th Song (`kth-song-in-playlist`)

### Step 1
- **[MINOR] Q2 pictures use a different label vocabulary from the node-name guide.** Choices show "Outer array / Array at [0] / 1 at [0][0] / …" while the guide on the same screen says "Use root=[] … root[1][0]=7". The student is asked to compare a picture in one notation against a rule in another.
- **[MINOR] Q1 is Description Example 1 verbatim (answer 4 printed).** Also the exact-picture remedial reuses Q7's input `[3,[8,[5,9]],[],4], k=4` and the concept-relations remedial reuses Q8's input `[[[2]],6], k=1`, so a student who misses Q2/Q5 meets the same input again minutes later.
- Answer keys all verified (4, 9, 2, 9, 2, -1; remedials 9, 2, 2, 10, 2).

### Step 2
- **[MAJOR] Node names change between Step 1 and Step 2 with no on-screen guide, and the first error message points elsewhere.** Step 1 taught `root=[]`, `root[0]=[]`, `root[0][0]=1`; Step 2 requires `root`, `root[0]`, `root[0][0]`. Submitting Step 1's Q1 graph is rejected with "Draw 1–8 nodes." (it has 9 nodes) — nothing about labels; a smaller graph in Step 1 notation is rejected with "Use root, root[0], root[1], ... to name nested input items." only after clicking Check. The graph must also be a tree ("This problem's input must form one connected tree.") — not stated. The field "CHOOSE THE PLAYLIST ROOT" is read-only ("root"), so "Choose" is misleading.
- **[MINOR] "CORRECT OUTPUT" for this problem is a song ID, but the field wants `["root","root[0]","root[1]","root[1][0]"]`** — the node set, not a song. (Instance of the systemic issue; especially confusing here because the Description's whole point is "returns the ID of the k-th song".)

### Step 3
- Claims and keys verified for all five inputs; no problem-specific issues.

### Step 4
- **[MAJOR] Hidden node labels revert to Step 1 notation right after Step 2 taught the other notation, with no guide.** Required labels: case 1 `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=[]`, `root[0][1][0]=2`, `root[1]=3`; case 2 `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=2`, `root[1]=[]`, `root[1][0]=3`, `root[1][1]=[]`, `root[1][1][0]=4`, `root[1][1][1]=5`; case 3 `root=[]`, `root[0]=7`, `root[1]=[]`, `root[1][0]=[]`, `root[2]=[]`, `root[2][0]=8`, `root[2][1]=[]`, `root[2][1][0]=9`. A student who writes `root[0]` (Step 2 style) fails "The drawing has every exact node" with no explanation.
- **[MAJOR] Graph-proof feedback names folders that exist nowhere on screen and contradict the required labels.** Case 1: "Traversal stops at depth two and never crosses folder A→folder B." Case 2: "Nodes are root, A, 1, 2, B, 3, C, 4, 5; direct arrows are root→A, A→1, A→2, root→B, B→3, B→C, C→4, C→5." Case 3: "Nodes are root, 7, A, empty, B, 8, C, 9; direct arrows are root→7, root→A, A→empty…" The Step 1 build feedback for Q1 also says "counts folder B". If the student adopts A/B/C on a retry, the grader rejects the drawing. Rewrite using the `root[i]=[]` labels.
- **[MINOR] Code is `function solve(input)` reading `input.playlist` / `input.k`,** not the Description's `kthSong(playlist, k)`; case 1 input is shown as two lines "playlist: [[1, [2]], 3] / k: 2" while cases 2–3 show "playlist=[[1,2],[3,[4,5]]], k=4". Case 2/3 inputs are Step 1 Q1/Q4 again; all three cases show the identical 14-line function, so the correct diagnosis text repeats verbatim.
- **[MINOR] Distractor wording.** "The code treats k as a zero-based index, which changes how the shown graph is evaluated." — the tail clause is meaningless (k does not change a graph).

### Cross-step / other
- Description's examples use `playlist = …, k = 4`; lesson inputs `playlist=…, k=4`. Fine.

## Ladder Takahashi (`ladder-takahashi`)

### Step 1
- **[MAJOR] Q7 is the same question as Q1.** Q1 (build) shows `ladders=[[1,4],[4,3],[4,10],[8,3]]`, "What highest floor is reachable from floor 1?" → 10. Q7 (concept) shows the same input and asks "From floor 1 with ladders [[1,4],[4,3],[4,10],[8,3]], what highest floor is reachable?" → 10. Both are Description Example 1 with "output 10" printed. Q9 is Description Example 2 with "output 1" printed. Three of nine checks test nothing new.
- Remaining builds verified: Q3 → 9, Q6 `[[7,20]]` → 1 (graph must include isolated node "1"), Q8 `[[2,3]]` → 1; remedials 2, 8, 9, 3, 1.

### Step 2
- **[MAJOR] Q2 (Dalton, "allows each two-way link to work only in its written order") can only be exposed by drawing the ladder backwards, and nothing says so.** The grader turns each edge into an arrow from the first-clicked node to the second. The harness had to draw `2—1` (click 2, then 1) so Dalton's graph became `2→1` and his output `[1]`. A student who draws the natural `1—2` gets Dalton `1→2`, output `[1,2]` = correct output, and no counterexample, with no hint that click order is "written order". Q3 (Elise, last-branch) likewise depends on the order edges were drawn; the harness drew 1—2 before 1—3 so the "last" branch was 3.
- **[MINOR] Field label "CHOOSE THE FLOOR 1 / floor 1" is read-only and reads as a grammatical slip.** Suggest "Start floor: 1".

### Step 3
- **[MINOR] Q1 writes the ladder `[8,3]` as "3—8" ("The correct graph has 4—3 and 3—8, so it should also contain a direct 4—8 edge.");** Q3 wrong-answer feedback for "6 and 10 are directly connected" begins "Correct. The mini-example lists 6—10…". Keys otherwise verified (Q4 requires the isolated node "1": "1 has exactly 1 direct neighbor" → NO).

### Step 4
- **[BLOCKER] Case 1: the keyed-correct diagnosis describes a ladder that is not in the input, and the distractor is literally true.** Input `ladders: [[4, 1], [4, 10]]`. Keyed-correct choice B: "The pair [8,3] is stored only as 8→3, so the code cannot continue from floor 3 to floor 8." — there is no `[8,3]`, no floor 3 and no floor 8 in this case. Distractor A: "Floor 1 is absent from the map because it never appears as a first endpoint on the shown input." — this is exactly true here (`next` has keys 4 only, `next.get(1)` is undefined, so the loop body never runs) and is graded wrong with feedback "The seen set correctly creates floor 1; its reverse ladder edge is missing." A careful student cannot pass this on merit.
- **[BLOCKER] Case 2: no displayed choice is true.** Input `ladders=[[1,4],[4,3],[8,3]]`. Keyed-correct choice C: "The pair [4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible in the code." — the input pair is `[1,4]`, and the code does climb 1→4 (that is why the buggy output is 4). The true diagnosis is case 1's text about `[8,3]`. The two correct-choice labels are swapped between cases 1 and 2 (`step4-specs-new.json` lines 2661 and 2731). Swap them back.
- **[MINOR] Feedback refers to a "seen set" ("The seen set correctly creates floor 1…", "Math.max sees only floors in seen…") but the code's set is `visited`.** Case 3 distractor "Math.max ignores floor 12 because it is larger than the number of ladders." is not a believable mistake. Input format "ladders: [[4, 1], [4, 10]]" (case 1, 3) vs "ladders=[[1,4],[4,3],[8,3]]" (case 2).
- Case 3 (`[[1,5],[9,5],[9,12]]` → 5, correct 12, choice A) is correct.

### Cross-step / other
- Node labels are plain floor numbers in every step (consistent); Step 2 output `[1,2,3]` uses unquoted numbers, matching.

## Longest Freight Train (`longest-freight-train`)

### Step 1
- **[MINOR] Q7's raw-input box contains a stray instruction line "Focus on one listed relation." under the grid.** Also distractor A "Their T cells touch at a side or a diagonal corner." is harmless for every valid yard (the Description guarantees trains never touch "not even at a corner"), so a thoughtful student can argue it gives the same answer; the feedback "Corner contact does not join cars in this yard." does not address that.
- **[MINOR] The concept-counterexample remedial reuses Q1's input `["T..","...","..T"]`** (already drawn in Q1, and used again as Step 3 Q4).
- Builds verified: 1, 3, 2, 1; remedials 3, 1, 3, 3, 1. Q8/Q9 verified 3/3.

### Step 2
- **[MINOR] "CHOOSE THE FIRST TRAIN CAR" has no meaning in this problem** (the real algorithm starts a search from every car), and Devin's wrong car (0,1) is revealed only by the error "Also draw (0,1), the wrong first train car used by the broken search." or Drawing 2's title. The grader also accepted a "correct graph" with side-adjacent T cells (0,0) and (0,1) and no edge between them — an impossible yard — so nothing checks the student's drawing is a legal input.

### Step 3
- **[MINOR] Q1 and Q4 relation claim asserts a false premise.** `["T.","..",".T"]` / `["T..","...","..T"]` show "(0,0) can reach (2,1), so the graph should contain a direct edge between them." / "(0,0) can reach (2,2), so…" — the cells are isolated and cannot reach each other (NO is keyed, but the sentence is false). Q1 variant 2 already has the good wording "There is no direct edge between (0,0) and (2,1); merely naming both nodes does not make them reachable."
- **[MINOR] Node-rule feedback renders broken.** Shown text (Q1, after wrong answers): "Correct node rule: Each grid cell containing / T / ; empty / . / cells are not nodes." — the backticks in the authored rule are rendered as separate lines. Also Q1 v2 wrong-feedback begins "Correct. Node membership alone…" under ×.

### Step 4
- **[MAJOR] Case 3's input breaks the problem's own guarantee.** `yard: [["T","T",".",".","."],[".",".",".",".","."],[".","T","T","T","."],[".","T",".",".","."]]` — the lower cells (2,1),(2,2),(2,3) and (3,1) form an L, but the Description says every train "is a straight line … horizontally or vertically … always exactly one square wide" and "You are guaranteed the yard is valid". The keyed correct answer relies on an L-shaped "four-car component" (correct output 4; choice C "the later four-car component"). A student who trusts the statement sees two touching trains, which the statement says cannot happen, and may answer 3. Replace with a straight 4-car train (e.g. row 2 = `.TTTT`).
- **[MINOR] Case 2 shows an internal slug as feedback:** "Reachable boundary: first-component-only". Case 2's input is Step 1 Q4 again; all three cases show the identical function.
- **[MINOR] Input formats disagree.** Cases 1 and 3 use arrays of arrays (`yard: [["T", ".", "T", "T"]]`), case 2 uses strings (`yard=["T...T","....T","....."]`), Step 1/3 always use strings, the Description examples use arrays, and the code is `function solve(input)` with `input.yard` instead of `longestTrain(yard)`.

### Cross-step / other
- Node-label format consistent across steps.

## Max Area of Island (`max-area-of-island`)

### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** `grid=[[0]]`, hidden graph has zero nodes, answer buttons stay disabled until a node is drawn; harness result "FAILED / DEAD END", completion "8 passed · 1 skipped". Same fix as connected-cells.
- **[MINOR] Q7 and Q9 are Description Examples 1/2 with the answers printed ("output 5", "output 0").** Q9 additionally shows "Optional: draw this input before answering" for `[[0,0],[0,0]]`, which has nothing to draw.
- Builds verified: 3, 1, 4; remedials 3, 1, 4, 2, 3.

### Step 2
- No problem-specific issues beyond the systemic ones (jargon "island seed"; last-branch depends on drawing order; add-diagonals needs two corner-touching cells with no edge in Drawing 1).

### Step 3
- **[MINOR] Q1 wrong-answer feedback displayed under × begins "Correct."** Shown text after answering all wrong: "× Correct. The mini-example lists (0,0)—(0,1) as one direct edge." (all three Q1 variants). Keys verified for Q1–Q5.

### Step 4
- **[MAJOR] Keyed-correct diagnosis and distractors name variables that do not exist in the shown code.** Cases 1–2 correct choice: "Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells." — the code uses `rowChange`/`columnChange`, never `dr`/`dc`. Distractors: "The same seen set should be cleared…", "best should add every island area…", case 3 "seen is shared across island searches", feedback "A global seen set is correct…", "best uses Math.max…" — the code has `visited` and `largestValue`. Rename to the code's identifiers.
- **[MINOR] Three identical functions/bugs; case 2's input `[[1,1,0],[0,0,1]]` is Step 1's predict-output remedial and Step 3 Q1; case 1's `[[1,0],[0,1]]` is Step 1 Q2.** Input shown as `grid: [[1, 0], [0, 1]]` (cases 1, 3) vs `grid=[[1,1,0],[0,0,1]]` (case 2).

### Cross-step / other
- Fine.

## Maximum Number of Fish in a Grid (`maximum-number-of-fish-in-a-grid`)

### Step 1
- **[BLOCKER] Q8 `build-4` cannot be completed.** `grid=[[0]]`, zero-node hidden graph, buttons disabled until a node is drawn; "8 passed · 1 skipped".
- **[MINOR] Q7 and Q9 are Description Examples 1/2 with answers printed ("output 7", "output 1").**
- Builds verified: 6, 3, 10; remedials 5, 4, 7, 2, 6.

### Step 2
- **[MINOR] Q1 "Tucker runs the search from a different fishing start" does not fit this problem.** The Description says the fisher "chooses any water cell to start from" and the answer is the best over all starts, so "wrong start" is not a bug in this problem, and "CORRECT OUTPUT ["(0,0)"]" (cells reached from the chosen start) is not the problem's output (a fish total). Tucker's start (0,1) appears only in Drawing 2's title / the error "Also draw (0,1)…".

### Step 3
- **[MINOR] Q1 wrong-answer feedback under × begins "Correct."** ("× Correct. The mini-example lists (0,2)—(1,2) as one direct edge.", shown in the transcript's all-wrong feedback for variants 0 and 1). Keys verified.

### Step 4
- **[MINOR] Choice/feedback identifiers differ from the code.** Correct choice "total += 1 measures component area instead of adding grid[r][c] fish at each node." (code indexes `grid[row][column]`); distractor "Using one seen set…" (code: `visited`). Case 3's graph proof writes nodes as "(0,0)=2 and (1,1)=3" — a label format the Step 1 guide forbids ("Do not add … the cell value") and the grader would reject.
- **[MINOR] The drawing cannot express the thing the bug is about.** Required graphs are unweighted coordinate nodes ("(0,0)", "(0,1)"), so the graph a student draws is identical whether they think in cells or in fish; the "graph" step does not help diagnose "Water cells are counted instead of fish". Cases 2–3 reuse Step 1 Q1/Q3 inputs; identical code in all three cases; distractor "The fisher must start on the cell containing 3, so the 2 cell cannot be visited" is not a believable mistake.

### Cross-step / other
- Node rule says nodes are "weighted by its fish count" while the label guide says never to write the value; the weight has no place in the drawing tool. Consider stating "weights are not drawn".

## One-line summary of every finding in this batch
- [BLOCKER] hackerrank-connected-cells S1: Q8 `grid=[[0]]` has an empty correct graph; answer buttons stay disabled, question cannot be completed
- [MINOR] hackerrank-connected-cells S1: Q7/Q9 are Description Examples 1/2 with answers printed; Q9 input reused as Step 4 case 3
- [MINOR] hackerrank-connected-cells S2: "CHOOSE THE REGION SEED / region seed" jargon undefined
- [MAJOR] hackerrank-connected-cells S3: Q1 claim "(0,0) can reach (1,2), so…" has a false premise on `[[1,0,0],[0,0,1]]` (cells are isolated); feedback repeats it
- [MINOR] hackerrank-connected-cells S3: Q3 wrong-answer feedback begins "Correct."
- [MAJOR] hackerrank-connected-cells S4: choices/feedback use `dirs`, `seen`, `best` but code has `directions`, `visited`, `largestValue` (all 3 cases)
- [MINOR] hackerrank-connected-cells S4: nonsense distractors ("best starts at zero … graph-level change", "best should start at one, which alone would make the correct answer five")
- [MINOR] hackerrank-connected-cells S4: three identical code/bug cases; inputs reused from Step 1/3; `grid:` vs `grid=` formats
- [MAJOR] kattis-getting-gold S1: Q1/Q2 require trap-as-isolated-node, directed arrows, draft squares with no outgoing arrows before Q5/Q7 teach them; Description never says so; failure text "The correct model stays hidden"
- [MAJOR] kattis-getting-gold S1: Q1 needs 9 nodes + 16 directed arrows; 16-arrow builds recur in remedials, Step 3 Q4/Q5
- [MINOR] kattis-getting-gold S1: Q3 exact-picture differs by one reversed arrow among 16 ((2,3)→(1,3))
- [MINOR] kattis-getting-gold S1: Q8/Q9 are Description examples with answers printed; "first/second shown dungeon" wording
- [MINOR] kattis-getting-gold S1: node rule worded differently in Q5 vs every Step 3 feedback ("including each trap as an obstacle node…")
- [MINOR] kattis-getting-gold S2: must toggle "Directed edges", use interior coords ≥ (1,1), and ≤ 8 nodes — all learned only from post-Check errors
- [MINOR] kattis-getting-gold S2: Q3 wrong player square (1,2) shown only in Drawing 2 title / error text
- [MINOR] kattis-getting-gold S3: "(1,3) and (1,2) are directly connected" on a one-way edge is ambiguous; wrong feedback begins "Correct."
- [MINOR] kattis-getting-gold S4: trap node "(2,2)" required as an isolated node with no guide
- [MINOR] kattis-getting-gold S4: cases 2–3 repeat case 1's code and identical correct-choice text; `grid:` vs `dungeon=` naming
- [MINOR] kattis-getting-gold cross: Description variable `grid` vs lesson inputs `dungeon=`
- [MINOR] kth-song-in-playlist S1: Q2 pictures labelled "Outer array / Array at [0] / 1 at [0][0]" vs guide's `root=[]` notation
- [MINOR] kth-song-in-playlist S1: Q1 is Description Example 1; remedials reuse Q7 and Q8 inputs
- [MAJOR] kth-song-in-playlist S2: labels change from `root=[]` to `root`/`root[0]` with no guide; first error is "Draw 1–8 nodes."; tree requirement unstated; read-only "CHOOSE THE PLAYLIST ROOT"
- [MINOR] kth-song-in-playlist S2: "CORRECT OUTPUT" wants a node list, not the song ID the Description defines
- [MAJOR] kth-song-in-playlist S4: hidden labels revert to `root=[]`, `root[0]=[]`, `root[0][0]=1`, `root[0][1]=[]`, `root[0][1][0]=2`, `root[1]=3` (etc.) right after Step 2 taught `root[0]`; no guide
- [MAJOR] kth-song-in-playlist S4: graph-proof text names folders A/B/C/"empty" ("Nodes are root, A, 1, 2, B, 3, C, 4, 5…") that appear nowhere and contradict required labels
- [MINOR] kth-song-in-playlist S4: code is `solve(input)`/`input.playlist` not `kthSong(playlist, k)`; input format differs between cases; identical code ×3; inputs reused from Step 1
- [MINOR] kth-song-in-playlist S4: distractor "…which changes how the shown graph is evaluated" is meaningless
- [MAJOR] ladder-takahashi S1: Q7 repeats Q1 (same input, same answer 10); Q1/Q7/Q9 are Description examples with answers printed
- [MAJOR] ladder-takahashi S2: Q2 Dalton (make-one-way) only exposable by clicking the higher floor first (edge 2→1); natural 1—2 drawing yields no counterexample and no hint; Q3 depends on drawing order
- [MINOR] ladder-takahashi S2: read-only field labelled "CHOOSE THE FLOOR 1 / floor 1"
- [MINOR] ladder-takahashi S3: ladder [8,3] written "3—8" in Q1; Q3 wrong feedback begins "Correct."
- [BLOCKER] ladder-takahashi S4: case 1 (`[[4,1],[4,10]]`) keyed-correct choice cites non-existent pair [8,3]; distractor "Floor 1 is absent from the map…" is literally true and graded wrong
- [BLOCKER] ladder-takahashi S4: case 2 (`[[1,4],[4,3],[8,3]]`) keyed-correct choice "[4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible" is false; no true choice; labels swapped with case 1 (step4-specs-new.json:2661/2731)
- [MINOR] ladder-takahashi S4: feedback says "seen set" but code uses `visited`; silly distractor "floor 12 … larger than the number of ladders"; `ladders:` vs `ladders=` formats
- [MINOR] longest-freight-train S1: Q7 input box contains stray line "Focus on one listed relation."; diagonal distractor is harmless under the no-corner-touch guarantee
- [MINOR] longest-freight-train S1: concept-counterexample remedial reuses Q1's input (also Step 3 Q4)
- [MINOR] longest-freight-train S2: "first train car" has no meaning in this problem; wrong car (0,1) only in error/Drawing 2 title; grader accepts impossible yards (adjacent T cells with no edge)
- [MINOR] longest-freight-train S3: Q1/Q4 "(0,0) can reach (2,1)/(2,2), so…" false premise; node-rule feedback renders as broken lines "containing / T / ; empty / . / cells"; "Correct." under ×
- [MAJOR] longest-freight-train S4: case 3 input has an L-shaped 4-cell train, violating "straight line … guaranteed valid"; correct answer 4 depends on it
- [MINOR] longest-freight-train S4: case 2 shows raw slug "Reachable boundary: first-component-only"; identical code ×3; case 2 input = Step 1 Q4
- [MINOR] longest-freight-train S4: array-of-arrays vs array-of-strings inputs across cases/steps; `solve(input)` vs `longestTrain(yard)`
- [BLOCKER] max-area-of-island S1: Q8 `grid=[[0]]` empty correct graph; question cannot be completed
- [MINOR] max-area-of-island S1: Q7/Q9 are Description examples with answers printed; Q9 offers "draw this input" for a grid with no nodes
- [MINOR] max-area-of-island S3: Q1 feedback shown under × begins "Correct. The mini-example lists (0,0)—(0,1)…"
- [MAJOR] max-area-of-island S4: correct choice says "Offsets with both dr and dc nonzero…" and distractors/feedback say `seen`, `best`; code has `rowChange`/`columnChange`, `visited`, `largestValue`
- [MINOR] max-area-of-island S4: identical code ×3; case 1/2 inputs reused from Step 1/3; `grid:` vs `grid=` formats
- [BLOCKER] maximum-number-of-fish-in-a-grid S1: Q8 `grid=[[0]]` empty correct graph; question cannot be completed
- [MINOR] maximum-number-of-fish-in-a-grid S1: Q7/Q9 are Description examples with answers printed
- [MINOR] maximum-number-of-fish-in-a-grid S2: "wrong fishing start" bug and reached-set "output" don't fit a problem that tries every start; start (0,1) hidden in Drawing 2 title
- [MINOR] maximum-number-of-fish-in-a-grid S3: Q1 feedback shown under × begins "Correct."
- [MINOR] maximum-number-of-fish-in-a-grid S4: choices say `grid[r][c]`/`seen` (code: `grid[row][column]`/`visited`); case 3 proof writes "(0,0)=2" labels the guide forbids
- [MINOR] maximum-number-of-fish-in-a-grid S4: unweighted drawing cannot express the bug; inputs reused from Step 1 Q1/Q3; identical code ×3; implausible "must start on the cell containing 3" distractor
- [MINOR] maximum-number-of-fish-in-a-grid cross: node rule says "weighted by its fish count" but weights cannot be drawn and the guide forbids writing the value
