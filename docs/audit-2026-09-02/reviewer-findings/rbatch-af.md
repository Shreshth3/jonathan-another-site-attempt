# Batch rbatch-af findings

Scope: structy-max-root-to-leaf-path-sum, structy-minimum-island, structy-tree-sum, ten-kinds-of-people, top-of-the-pile, transitive-closure, trusted-courier-networks. Every Step 1 build answer key and every Step 4 declared buggy output was recomputed (Step 4 snippets executed with node); all 21 Step 4 outputs and all Step 1 keys are numerically correct unless stated below. Known systemic issues (Step 2 label scheme, Step 2/4 JSON strictness, Step 3 same-parity claims, imperative "Use this node rule" wording, wrong-start hidden in Drawing 2, first/last-branch = drawing order) are only reported where a concrete, problem-specific instance is worth fixing on its own.

## Max Root-to-Leaf Path Sum (`structy-max-root-to-leaf-path-sum`)

### Step 1
- **[MAJOR] "levelOrderIndex" never says it counts the `null` slots.** Q1 shows `root level-order=[3,11,4,4,-2,null,1]` and the guide "Name each tree node node levelOrderIndex: value. Example: node 2: -3." The grader requires `node 6: 1`. A student who numbers only the nodes that exist (0..5) writes `node 5: 1` and only sees "Every exact node is drawn ×". Same trap in remedial/S3 Q5 `[2,3,null,4]` → required `node 3: 4`. Fix: guide text "the index is the position in the level-order list, counting null slots" plus an example containing a null. (Q1 `build-1`, S3 Q5, remedial after `predict-output`)
- **[MAJOR] The `root level-order=[...]` notation is never explained.** The Description only ever shows `{ val, left, right }` objects and ASCII trees; the very first screen (Q1) uses an array with `null` and expects the student to know heap-style placement. Fix: one sentence in the Description or above Q1 explaining the array form. (Q1, Q2, Q4, Q6)
- **[MINOR] Answers copied from the Description.** Q1 and Q8 use Description Example 1 (output 18 with the path listed); Q2 and Q9 use Example 2 (output 12 with the paths listed). Fix: different numbers. (Q1, Q2, Q8, Q9)
- **[MINOR] Remedial "Why" contradicts a valid path.** Remedial after `bug-trap` (`[4,2,6,1,9,5,3]`) says "The best path is 4→2→9, not necessarily through child 6." but 4→6→5 also sums to 15. A student who found 4→6→5 is told it is not the best. Fix: "4→2→9 and 4→6→5 both give 15".
- **[MINOR] Unclear distractor feedback.** Q8 choice 12: "The function returns the maximum, not the middle branch." — "middle branch" is not a thing in the picture (12 is path 3→11→-2). Fix: "12 is the path 3→11→-2; 3→11→4 is bigger."

### Step 2
- **[BLOCKER] Q2 bug text tells the student to do the wrong thing.** Screen: "Clayton erases the outer leaves before searching." The grader requires Clayton's drawing to be exactly "nodes: L, R, root · edges: none" — leaves kept, only the arrows to them removed. A student who literally erases leaf nodes L and R in Drawing 2 fails "Every exact node is drawn" with no hint. Fix: "Clayton drops every arrow that points to a leaf (the leaf nodes stay)." (S2 Q2 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `maxPathSum` returns a number; the field wants a sorted JSON list of tree positions such as `["L","R","RL","root"]`, and node values play no role at all in Step 2. Nothing on screen says this; a student will type `18`. Fix: label the fields "Nodes the correct search visits" / "Nodes Zion visits" with an example. (S2 Q1–Q3)
- **[MINOR] Q1 "Zion chooses the final listed route and never returns."** A tree has no "listing"; the grader means the last-drawn child arrow at every node, never backtracking. Fix: "At every node Zion follows only the child arrow you drew last, and never goes back." (S2 Q1 `last-branch`)

### Step 3
- **[MINOR] Membership claim untestable on its input.** Q1 variant 2: input `[4,2,6,1,9,5,3]` has only positive values, yet "It would be a mistake to use this node rule: 'Only nodes with positive values.'" is keyed YES. On this input that rule yields the identical graph, so NO is defensible. Fix: pair this rule with an input containing a negative (e.g. `[5,4,4,-10,8]`). (S3 Q1 v2)
- **[MINOR] Wrong-answer feedback starts with "Right."/"Correct."** Q1 v0/v1 and Q2 show "× Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge." and Q4 shows "× Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge." under an × for the student's wrong answer. Fix: drop the leading "Right."/"Correct." from direct-vs-reach feedback. (S3 Q1, Q2, Q4)

### Step 4
- **[BLOCKER] Hidden node labels change format between cases, no guide shown.** Case 1 requires `5`, `-10`, `-20`; case 3 requires `10`, `-2`, `-3`, `-30`; but case 2 requires `node 0: -5`, `node 1: -2`, `node 2: -8` (the Step 1 format). A student who learns bare values from case 1 fails case 2 and vice versa, seeing only "The drawing has every exact node ×". Fix: use one format for all three and show the guide. (S4 cases 1–3)
- **[MINOR] Same code, same three diagnosis sentences three times.** Cases 1 and 2 show the identical snippet and identical choices (reordered); case 3 rewords them. After case 1 the "Math.max includes a synthetic 0" answer is a giveaway. (S4 cases 2–3)
- **[MINOR] Nonsense distractor.** Case 3 choice A "The null base case should return 10 because the root value must be counted twice." is not a believable student mistake. (S4 case 3)
- **[MINOR] "Changed graph" describes the unchanged graph.** Case 1: "Code rule: Every node may choose a synthetic zero branch… → Changed graph: The root has two outgoing child edges, so legal paths end at -10 or -20." The second sentence is the correct graph, not what the code changed. (S4 case 1, case 3)

### Cross-step / other
- **[MAJOR] Four label formats for one problem.** Step 1/3 `node 0: 3`; Step 2 `root`/`L`/`R` (Step 1 names rejected with "Use root, L, R, LL, LR, ... to name tree positions." only after Check); Step 4 bare `5` (cases 1, 3) and `node 0: -5` (case 2).

## Minimum Island (`structy-minimum-island`)

### Step 1
- All nine answer keys are correct. No wording problems in the concept questions.
- **[MINOR] Answers copied from the Description and repeated inputs.** Q7 = Example 1 (output 1 explained), Q9 = Example 2 (output 3 explained). Remedial after `node-rule` reuses `[['L','L'],['L','W']]` (= Q9/Example 2); remedial after `bug-trap` reuses `[['L']]` (= Q8). (Q7, Q9, remedials)

### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `minimumIsland` returns a count; the field wants the list of reached cells, e.g. `["(0,0)","(1,1)"]`. A student will type `1`. (S2 Q1–Q3)
- **[MINOR] "CHOOSE THE ISLAND SEED / island seed"** — "seed" is jargon; nothing says it is the cell the search starts from. Fix: "Choose the starting land cell". (S2 Q1–Q3)
- **[MINOR] Q1 drawings carry no L/W values.** "Lukas treats corner-touching squares as direct neighbors." The grader joins every diagonal pair of drawn cells as if all were land; the student cannot express a diagonal water cell. Works for the obvious counterexample, but the guide never says "every node you draw is land". (S2 Q1)
- **[MINOR] Q3 "Johnny chooses the final listed route and never returns."** Same vague "listed" wording as above; means last-drawn edge at each node. (S2 Q3)

### Step 3
- **[MAJOR] Claim with a false premise, and feedback that repeats it.** Q1 `[['L','W','L']]` (two separate islands, no edges). All three variants show "(0,0) can reach (0,2), so the graph should contain a direct edge between them." keyed NO. But (0,0) cannot reach (0,2) at all. The wrong-answer feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2)." implies they are reachable. A student who correctly sees two islands is confused. Fix: "(0,0) and (0,2) are both land, so they should share a direct edge." (S3 Q1 v0/v1/v2)
- **[MINOR] Border-cell rule is untestable on every input.** "Only L cells on an island's outer border" appears in Q1 v1, Q2, Q5; every Step 3 grid has at most 3 land cells and no interior cell, so the rule yields the identical graph each time and the keyed answer is debatable. (S3 Q1 v1, Q2, Q5)
- **[MINOR] Self-reach claim on the one-cell grid.** Q3 `[['L']]`: "(0,0) can reach itself without using an edge, but the graph still has no direct (0,0)—(0,0) edge." (S3 Q3)
- **[MINOR] Label guidance contradicts Step 1.** The graph-failure box on Q1 says "Both (0,2) and 0,2 work. Do not include the cell value." while the guide above it says "Name each cell (row,column)… Do not add spaces". Harmless but inconsistent. (S3 Q1)
- **[MINOR] "× Right. A multi-step route through (0,1)…"** shown for a wrong answer. (S3 Q2, Q5)

### Step 4
- All three buggy outputs verified (3, 2, 2); labels match the Step 1 `(r,c)` format.
- **[MINOR] Same code and same three choices in all three cases** (only reordered). (S4 cases 2–3)

### Cross-step / other
- Nothing further.

## Tree Sum (`structy-tree-sum`)

### Step 1
- **[BLOCKER] Q8 cannot be answered.** `build-4` shows `root level-order=[]`; the required graph has zero nodes, but the answer buttons "0 / 1" stay disabled until a node is drawn. Drawing any node makes the exact-graph check fail. The harness had to skip it ("FINISHED / Step 1 finished. 8 passed · 1 skipped." instead of PROVEN). Fix: enable the answer buttons when the required graph is empty, or replace the input with a one-node tree. (Q8 `build-4`)
- **[MAJOR] levelOrderIndex counts null slots — never stated, and one input only parses that way.** Q1 requires `node 6: 1`; Q3 `[1,6,0,null,null,-4]` requires `node 5: -4`; remedial after `edge-rule` `[1,null,2,null,null,null,3]` requires `node 2: 2`, `node 6: 3`. In LeetCode's compressed level-order format that last tree is written `[1,null,2,null,3]`, so a student who learned trees from LeetCode cannot even read the input. Fix: explain the array form once and say indexes count nulls. (Q1, Q3, remedial after `edge-rule`, S3 Q5)
- **[MINOR] Q7 and Q9 test arithmetic only.** "What is the sum of tree values 3, 11, 4, -2, 4, and 1?" and "What is the sum of tree values 1, 6, 0, and -4?" list the values in the question, and both are the Description examples with the running totals printed. Fix: ask "What does treeSum return for the shown tree?" (Q7, Q9)
- **[MINOR] Q1 distractor is from a different problem.** 18 (vs 21) is not "skip the negative node" (that gives 23); it is the max root-to-leaf path sum. Not a believable tree-sum mistake. (Q1)

### Step 2
- **[BLOCKER] Q1 bug text tells the student to do the wrong thing.** "Cecilia erases the outer leaves before searching." Grader requires Cecilia's drawing to be exactly "nodes: L, R, root · edges: none" — leaves kept. Same fix as max-root: "Cecilia drops every arrow that points to a leaf." (S2 Q1 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `treeSum` returns a number; the field wants `["L","R","root"]`. (S2 Q1–Q3)
- **[MINOR] Q3 "Madeleine chooses the final listed route and never returns."** Same vague "listed" wording. (S2 Q3)

### Step 3
- **[MINOR] Self-reach claim on `[-3]`.** Q3: "Because node 0: -3 can reach itself, the graph should contain a direct node 0: -3→node 0: -3 edge." (S3 Q3)
- **[MINOR] "× Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge."** shown for a wrong answer in every Q1 variant; "× Right. A multi-step route…" in Q2, Q4, Q5. (S3 Q1, Q2, Q4, Q5)

### Step 4
- **[BLOCKER] Hidden node labels change format between cases.** Case 1 requires `3`, `-5`, `2`; case 2 requires `node 0: 3`, `node 1: 11`, `node 2: 4`, `node 3: 4`, `node 4: -2`, `node 6: 1`; case 3 requires `node 0: 1`, `node 1: 6`, `node 2: 0`, `node 5: -4`. No guide on any of them. (S4 cases 1–3)
- **[MINOR] Ambiguous success text.** Case 2: "The six-node tree has edges 3→11, 3→4, 11→4, 11→-2, and 4→1 by node position." Two nodes are named 4, so "3→4" and "4→1" cannot be told apart. Fix: use the `node 2: 4` / `node 3: 4` names. (S4 case 2)
- **[MINOR] Nonsense distractor.** "Null children should contribute their parent's value instead of zero." (all three cases)
- **[MINOR] Same code and same three choices three times.** (S4 cases 2–3)

### Cross-step / other
- **[MAJOR] Four label formats** as in max-root: `node 0: 3` (S1/S3), `root/L/R` (S2), bare `3` (S4 case 1), `node 0: 3` (S4 cases 2–3).

## 10 Kinds of People (`ten-kinds-of-people`)

### Step 1
- All nine keys verified correct (including every required edge set).
- **[MINOR] First build needs the node rule that is taught two questions later.** Q1 `grid=["110","010"]` requires the isolated 0-cell node `(1,0)` and the 0-edge `(0,2)—(1,2)` even though the query is about 1-cells; the rule "Every grid cell, whether it contains 0 or 1" is only taught in Q3. A student who draws only 1-cells sees "Every exact node is drawn ×" with no explanation. Fix: show the node/edge rule above Q1 or move `node-rule` first. (Q1)
- **[MINOR] Answers copied from the Description.** Q7 = Example 1 and Q8 = Example 2 verbatim, outputs and explanations given. (Q7, Q8)

### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `whoCanTravel` returns labels like `["decimal"]`; the field wants the reached cells `["(0,0)","(0,1)"]`. A student will type `["decimal"]` or `decimal`. (S2 Q1–Q3)
- **[MINOR] "CHOOSE THE QUESTION START / question start".** The problem calls them queries and never says "question". Fix: "Choose the starting cell of the query". (S2 Q1–Q3)
- **[MINOR] Q3 "Santiago keeps only the last branch it sees."** Vaguer than the other problems' text; does not say it happens at every node, that "last" means last-drawn edge, or that he never backtracks. (S2 Q3 `last-branch`)
- **[MINOR] Q1 drawings carry no digit.** "Leonardo allows diagonal steps…" — the grader joins any diagonal pair of drawn cells; the student cannot mark a diagonal cell as the other digit. (S2 Q1)

### Step 3
- **[MINOR] Membership claim untestable on its input.** Q5 `["111"]`: "Use this node rule for the graph: 'Only cells containing 1.'" keyed NO, but every cell is 1 so the rule yields the identical graph; YES is defensible. Fix: use this rule on a grid containing 0s. (S3 Q5)
- **[MINOR] "× Right. A multi-step route through (0,2)…"** for a wrong answer. (S3 Q1 v1/v2)

### Step 4
- All three buggy outputs verified `["decimal"]`; required graphs match the rules (case 2 needs all 9 cells plus the four 0-cell edges).
- **[MAJOR] Output must be a JSON array of quoted strings and nothing says so.** Grader accepts `["decimal"]`, rejects `[decimal]`; the only hint is the placeholder "Example: false, 3, or [1, 2]", which shows no string. All three cases return strings. Fix: placeholder/example `["decimal"]`. (S4 cases 1–3)
- **[MINOR] Nonsense distractor.** Case 3 choice A "The answer label should be binary whenever a route contains an even number of cells." (S4 case 3)
- **[MINOR] Same bug three times.** The correct choice always contains "diagonal"/"corner"/"eight-offset"; after case 1 it is a keyword match. (S4 cases 2–3)

### Cross-step / other
- Label format `(r,c)` is consistent across all four steps — fine.

## Top of the Pile (`top-of-the-pile`)

### Step 1
- All keys verified (Q8: depth-2 integers 5 and 4 → 9; Q9: 6 + (−6) → 0).
- **[MINOR] Two naming schemes on one screen.** Q3 pictures label nodes "Outer array", "Array at [0]", "5 at [0][0][0]" while the guide directly above says `root=[]`, `root[0]=[]`, `root[0][0][0]=5`. (Q3)
- **[MINOR] Distractor with no derivation.** Q9 choice D "1": feedback "Zero is a valid sum; it does not mean the level had no items." describes the zero-means-empty mistake, but that mistake produces −5 (choice C), not 1. Nothing produces 1. (Q9)
- **[MINOR] Q9 choice C shows "−5" (Unicode minus) while every input writes "-5".** (Q9)
- **[MINOR] Q1 = Description Example 1 verbatim** (output 7 explained). (Q1)
- **[MINOR] Remedial titles are jargon:** "Fresh proof · Protect entity identity", "Fresh proof · Protect direct relations", "Fresh proof · Catch a near-miss implementation". (remedials)

### Step 2
- **[MAJOR] Step 1 names rejected because of the `=value` suffix.** Step 1 taught `root[1]=7`; Step 2 rejects it with "Use root, root[0], root[1], ... to name nested input items." only after Check. The only visible hint is the prefilled start "root". (S2 Q1–Q3; known-systemic list, concrete here)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `topLayerSum` returns a sum; the field wants `["root","root[0]"]`. (S2 Q1–Q3)
- **[MINOR] Q2 "Makenzie uses the wrong outer box."** Her start `root[0]` is only revealed in Drawing 2's title, and `root[0]` is an inner box, so "outer box" is misleading. (S2 Q2 `wrong-start`)

### Step 3
- **[MINOR] Empty-array rule tested only on inputs with no empty array.** "Every integer and only arrays that contain at least one integer somewhere below" is used on `[-2,[10]]` (Q1 v1), `[[1,2],[3]]` (Q2), `[[[2]],3]` (Q5); none has an empty array, so the rule yields the identical graph and the keyed answer is debatable. Fix: use `[[],[6,-6],[[9]]]`-style inputs for this rule. (S3 Q1 v1, Q2, Q5)
- **[MINOR] "× Right. A multi-step route through root[0]=[]…"** for a wrong answer. (S3 Q2, Q5)

### Step 4
- All three buggy outputs verified (20, 26, 15); labels match the Step 1 `root[0]=[]` format.
- **[MAJOR] Raw internal token shown on screen.** Cases 2 and 3 display "→ Reachable boundary: branch-local-shallowest →" in both the wrong-diagnosis feedback and the success text. Fix: author real boundary sentences. (S4 cases 2–3)
- **[MAJOR] "Changed graph" uses labels that exist nowhere.** Case 2: "Nodes are root, A, B, 5, 6, 7, C, 8; direct arrows are root→A, A→B, B→5, B→6, root→7, root→C, C→8." Case 3: "Nodes are root, A, 6, 5, B, 4…". The student just drew `root[0]=[]`, `root[0][0]=[]`; A/B/C are never defined. (S4 cases 2–3)
- **[MINOR] Code signature mismatch.** Shown code is `function solve(input) { … sumBox(input.items) }` while the problem defines `topLayerSum(items)`. (S4 cases 1–3)
- **[MINOR] Same code and same three choices three times.** (S4 cases 2–3)

### Cross-step / other
- Nothing further.

## Transitive Closure of a Graph (`transitive-closure`)

### Step 1
- All keys verified (including remedials `[[0,1,0],[0,0,0],[0,1,0]]` → `[[1,1,0],[0,1,0],[0,1,1]]`).
- **[MINOR] One input used five times.** `[[0,1,0],[0,0,1],[0,0,0]]` appears in Q1, Q3, Q8, Step 4 case 2, and Description Example 1 (output printed). Q9 is Description Example 2. (Q1, Q3, Q8, Q9)

### Step 2
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `transitiveClosure` returns an n×n matrix; the field wants the reachable list from one source, `[0,1,2]`. A student will type a matrix. (S2 Q1–Q3)
- **[MINOR] Q2 Allyson's drawing must be UNDIRECTED.** "Allyson turns every arrow into a two-way connection." The grader expects Drawing 2 to be "UNDIRECTED · edges: 1—0"; a student who instead draws two opposite arrows 0→1 and 1→0 in directed mode has no way to know whether that is accepted (harness did not probe it). Fix: say "flip the Directed edges switch off for Allyson's graph". (S2 Q2 `make-two-way`)
- **[MINOR] "CHOOSE THE SOURCE INDEX / source index"** — jargon; "source" is not used in the Description. (S2 Q1–Q3)

### Step 3
- **[MAJOR] Claim with a false premise.** Q4 `[[0,0],[0,0]]`: "0 can reach 1, so the graph should contain a direct edge between them." keyed NO. Node 0 cannot reach 1. Feedback "Reachability never creates a direct edge. This input lists no direct relation between 0 and 1." implies it can. (S3 Q4)
- **[MINOR] "× Right. A multi-step route through 1…"** for a wrong answer. (S3 Q3)

### Step 4
- All three buggy outputs verified.
- **[MAJOR] Correct diagnosis text does not fit cases 2 and 3.** Case 1's sentence "Neither source is seeded as reachable from itself, so both diagonal entries stay zero." is reused verbatim as the correct choice for case 2 (three sources, three diagonal entries) and case 3 (one source, one entry). A literal student rejects it because "neither"/"both" are wrong. Fix: "No source is seeded as reachable from itself, so every diagonal entry stays zero." (S4 cases 2–3)
- **[MINOR] Distractor is observationally true on case 1.** "The code returns the original graph matrix without exploring paths longer than one edge." — on `[[0,1],[0,0]]` the buggy output `[[0,1],[0,0]]` IS the input matrix, so a student comparing output to input can defend it; only the "without exploring" clause is false. Fix: use a 3-node input for case 1 or reword. (S4 case 1)
- **[MINOR] No hint that a nested matrix is expected.** Placeholder "Example: false, 3, or [1, 2]"; answer must be `[[0,1],[0,0]]`. (S4 cases 1–3)
- **[MINOR] Same code three times.** (S4 cases 2–3)

### Cross-step / other
- Label format (bare index) is consistent across steps — fine.

## Trusted Courier Networks (`trusted-courier-networks`)

### Step 1
- All keys verified (Q9: 5, 4, 6 with k=4 → one chain → 1).
- **[MAJOR] Wrong answer is predictable in 7 of 9 builds.** The wrong choice is simply the number of offices n: Q1 "5" (n=5), Q3 "4" (n=4), Q6 "5" (n=5), remedials "5", "4", "4", "5"; the other two use "0". A student learns "never pick the office count or 0" and never needs the graph. Fix: vary distractors (edge count, strict-threshold count, etc.). (Q1, Q3, Q6, Q8, all remedials)
- **[MINOR] Inputs contradict the Description.** Q7 `[[0,8,0,…]` and Q9 `[[0,5,0,0],…]` have 0 on the diagonal; the Description says "trust[i][i] is always 10". (Q7, Q9)
- **[MINOR] Edge rule literally includes self-loops.** "When trust[i][j] >= k" with trust[i][i]=10 ≥ 6, yet required graphs have no self-loops and nothing says to ignore the diagonal. Fix: "for two different offices i and j". (Q5, all builds)
- **[MINOR] Stray instruction in the input box.** Q5 raw input ends with "Focus on one listed relation." — no relation is singled out. (Q5)
- **[MINOR] Remedial titles are jargon:** "Fresh proof · Name the real entities", "Fresh proof · Read one direct relation", "Fresh proof · Catch a realistic bug". (remedials)

### Step 2
- **[MAJOR] Q2 depends on click order that the undirected Drawing 1 cannot show.** "Alana allows each two-way link to work only in its written order." "Written order" is the order the student clicked the endpoints. The harness had to draw the edge as 1—0 (clicking 1 first) so Alana's 1→0 blocks start 0; drawing the same edge as 0—1 gives Alana `[0,1]` = the correct output and the counterexample is rejected. Alana's drawing must also be DIRECTED. Fix: state "the first node you click becomes the arrow's tail" and show the numbers/arrow direction in Drawing 1. (S2 Q2 `make-one-way`)
- **[MAJOR] "CORRECT OUTPUT" is not this function's output.** `countSecureNetworks` returns a count; the field wants `[0,1,2]`. (S2 Q1–Q3)
- **[MINOR] Q1 Cesar's start is hidden.** "Cesar ignores the chosen first office in the network and uses a different one." — he starts at office 1 (revealed only in Drawing 2's title), so the student's correct graph must already contain a node 1 in a different component. (S2 Q1 `wrong-start`)
- **[MINOR] "CHOOSE THE FIRST OFFICE IN THE NETWORK / first office in the network"** is clunky and "first" suggests office 0. Fix: "Choose the starting office". (S2 Q1–Q3)

### Step 3
- **[MAJOR] Claim with a false premise.** Q4 identity matrix (no edges): "0 can reach 1, so the graph should contain a direct edge between them." keyed NO; 0 cannot reach 1, and the feedback "Reachability never creates a direct edge…" implies it can. (S3 Q4)
- **[MINOR] Broken rendering of the node rule in feedback.** Q1 (all variants) shows "Correct node rule: Every office index / 0 / through / n−1 / , even one trusted by nobody." split over five lines because the authored rule contains backticks around `0` and `n−1`. Fix: strip backticks in the Step 3 feedback renderer or the authored rule. (S3 Q1)
- **[MINOR] Membership claim untestable on its input.** Q1 v2 star input (every office has a 7): "Use this node rule: 'Only offices that have at least one trust score at or above k.'" keyed NO, but the rule yields the identical graph here. Fix: use the identity-matrix input for this rule. (S3 Q1 v2)
- **[MINOR] "× Right. A multi-step route through 3…"** for a wrong answer. (S3 Q2)

### Step 4
- All three buggy outputs verified (3, 3, 2).
- **[MINOR] Code signature mismatch.** Shown code is `function solve(input)` using `input.trust` / `input.k`; the problem defines `countSecureNetworks(trust, k)`. (S4 cases 1–3)
- **[MINOR] Wrong noun.** Case 3 choices/feedback say "two strong courier pairs", "from courier 1 to courier 2", "joins all four couriers" — the nodes are offices everywhere else. (S4 case 3)
- **[MINOR] Same code three times** (diagnoses reworded, always the "> k" answer). (S4 cases 2–3)

### Cross-step / other
- Label format (bare index) is consistent across steps — fine.

## One-line summary of every finding in this batch
- [MAJOR] structy-max-root-to-leaf-path-sum S1: "levelOrderIndex" never says it counts null slots; Q1 requires `node 6: 1`, S3 Q5 `node 3: 4`
- [MAJOR] structy-max-root-to-leaf-path-sum S1: `root level-order=[...]` notation never explained; Description only shows objects
- [MINOR] structy-max-root-to-leaf-path-sum S1: Q1/Q8 and Q2/Q9 are the Description examples with answers printed
- [MINOR] structy-max-root-to-leaf-path-sum S1: remedial "Why" says 4→2→9 is the best path but 4→6→5 also gives 15
- [MINOR] structy-max-root-to-leaf-path-sum S1: Q8 feedback "not the middle branch" is unclear
- [BLOCKER] structy-max-root-to-leaf-path-sum S2: Q2 "Clayton erases the outer leaves" but grader requires leaf nodes kept and only their arrows removed
- [MAJOR] structy-max-root-to-leaf-path-sum S2: "CORRECT OUTPUT" wants `["L","R","root"]`, not the path sum; values play no role
- [MINOR] structy-max-root-to-leaf-path-sum S2: Q1 "final listed route" undefined for a drawn tree
- [MINOR] structy-max-root-to-leaf-path-sum S3: Q1 v2 "Only nodes with positive values" is not a mistake on an all-positive input
- [MINOR] structy-max-root-to-leaf-path-sum S3: wrong-answer feedback starts with "Right."/"Correct." under an ×
- [BLOCKER] structy-max-root-to-leaf-path-sum S4: hidden labels are bare `5`,`-10`,`-20` / `10`,`-2`,`-3`,`-30` in cases 1,3 but `node 0: -5` etc. in case 2, no guide
- [MINOR] structy-max-root-to-leaf-path-sum S4: identical code and diagnosis choices in all three cases
- [MINOR] structy-max-root-to-leaf-path-sum S4: case 3 distractor "null base case should return 10" is nonsense
- [MINOR] structy-max-root-to-leaf-path-sum S4: "Changed graph" text describes the unchanged graph (cases 1, 3)
- [MAJOR] structy-max-root-to-leaf-path-sum S-cross: four different label formats across steps
- [MINOR] structy-minimum-island S1: Q7/Q9 are Description examples; two remedials reuse Q8/Q9 grids
- [MAJOR] structy-minimum-island S2: "CORRECT OUTPUT" wants `["(0,0)"]`, not the island size
- [MINOR] structy-minimum-island S2: "island seed" jargon in the start field
- [MINOR] structy-minimum-island S2: Q1 drawn cells have no L/W value; grader treats every drawn cell as land
- [MINOR] structy-minimum-island S2: Q3 "final listed route" undefined
- [MAJOR] structy-minimum-island S3: Q1 claim "(0,0) can reach (0,2)…" on two separate islands; feedback implies reachability
- [MINOR] structy-minimum-island S3: "outer border" rule yields the same graph on every Step 3 grid (Q1 v1, Q2, Q5)
- [MINOR] structy-minimum-island S3: Q3 self-reach claim on `[['L']]`
- [MINOR] structy-minimum-island S3: failure box says "0,2 works" while guide says "(row,column)"
- [MINOR] structy-minimum-island S3: "× Right…" feedback on wrong answers (Q2, Q5)
- [MINOR] structy-minimum-island S4: identical code and choices in all three cases
- [BLOCKER] structy-tree-sum S1: Q8 `root level-order=[]` has an empty required graph and disabled answer buttons; cannot be completed
- [MAJOR] structy-tree-sum S1: levelOrderIndex counts nulls (`node 5: -4`, `node 6: 3`); `[1,null,2,null,null,null,3]` is unreadable in LeetCode format
- [MINOR] structy-tree-sum S1: Q7/Q9 list the values in the question; pure arithmetic and Description examples
- [MINOR] structy-tree-sum S1: Q1 distractor 18 is a max-path-sum answer, not a tree-sum mistake
- [BLOCKER] structy-tree-sum S2: Q1 "Cecilia erases the outer leaves" but grader requires leaf nodes kept, edges removed
- [MAJOR] structy-tree-sum S2: "CORRECT OUTPUT" wants `["L","R","root"]`, not the sum
- [MINOR] structy-tree-sum S2: Q3 "final listed route" undefined
- [MINOR] structy-tree-sum S3: Q3 self-reach claim on `[-3]`
- [MINOR] structy-tree-sum S3: "× Correct…"/"× Right…" feedback on wrong answers (Q1, Q2, Q4, Q5)
- [BLOCKER] structy-tree-sum S4: hidden labels bare `3`,`-5`,`2` in case 1 but `node 0: 3`… / `node 5: -4` in cases 2–3, no guide
- [MINOR] structy-tree-sum S4: case 2 success text "3→4, 11→4, 4→1" is ambiguous with two nodes valued 4
- [MINOR] structy-tree-sum S4: distractor "Null children should contribute their parent's value" is nonsense
- [MINOR] structy-tree-sum S4: identical code and choices in all three cases
- [MAJOR] structy-tree-sum S-cross: four different label formats across steps
- [MINOR] ten-kinds-of-people S1: Q1 requires isolated 0-cell nodes before the node rule is taught in Q3
- [MINOR] ten-kinds-of-people S1: Q7/Q8 are Description examples verbatim
- [MAJOR] ten-kinds-of-people S2: "CORRECT OUTPUT" wants reached cells, not `["decimal"]`
- [MINOR] ten-kinds-of-people S2: "question start" label unexplained
- [MINOR] ten-kinds-of-people S2: Q3 "keeps only the last branch it sees" vaguer than other problems
- [MINOR] ten-kinds-of-people S2: Q1 drawn cells carry no digit; grader joins all diagonals
- [MINOR] ten-kinds-of-people S3: Q5 "Only cells containing 1" yields the same graph on `["111"]`
- [MINOR] ten-kinds-of-people S3: "× Right…" feedback on wrong answers (Q1)
- [MAJOR] ten-kinds-of-people S4: output must be `["decimal"]` with quotes; placeholder shows no string example
- [MINOR] ten-kinds-of-people S4: case 3 distractor "binary whenever a route has an even number of cells" is nonsense
- [MINOR] ten-kinds-of-people S4: correct choice always contains "diagonal/corner/eight-offset"; keyword giveaway
- [MINOR] top-of-the-pile S1: Q3 pictures use "Outer array / Array at [0]" while guide uses `root=[]`
- [MINOR] top-of-the-pile S1: Q9 distractor "1" has no derivation; its feedback describes the −5 mistake
- [MINOR] top-of-the-pile S1: Q9 shows Unicode "−5" while inputs use "-5"
- [MINOR] top-of-the-pile S1: Q1 is Description Example 1 verbatim
- [MINOR] top-of-the-pile S1: remedial titles "Protect entity identity" etc. are jargon
- [MAJOR] top-of-the-pile S2: Step 1 names `root[1]=7` rejected; must drop `=value`; only told after Check
- [MAJOR] top-of-the-pile S2: "CORRECT OUTPUT" wants `["root","root[0]"]`, not the sum
- [MINOR] top-of-the-pile S2: Q2 "wrong outer box" is actually inner box `root[0]`, revealed only in Drawing 2
- [MINOR] top-of-the-pile S3: empty-array node rule tested only on inputs with no empty array (Q1 v1, Q2, Q5)
- [MINOR] top-of-the-pile S3: "× Right…" feedback on wrong answers (Q2, Q5)
- [MAJOR] top-of-the-pile S4: cases 2–3 display raw token "Reachable boundary: branch-local-shallowest"
- [MAJOR] top-of-the-pile S4: cases 2–3 "Changed graph" names nodes A, B, C that exist nowhere
- [MINOR] top-of-the-pile S4: code is `solve(input)`/`input.items`, not `topLayerSum(items)`
- [MINOR] top-of-the-pile S4: identical code and choices in all three cases
- [MINOR] transitive-closure S1: `[[0,1,0],[0,0,1],[0,0,0]]` used in Q1, Q3, Q8, S4 case 2 and Example 1; Q9 is Example 2
- [MAJOR] transitive-closure S2: "CORRECT OUTPUT" wants `[0,1,2]`, not a matrix
- [MINOR] transitive-closure S2: Q2 Allyson's drawing must be UNDIRECTED; two opposite arrows may not be accepted, nothing says
- [MINOR] transitive-closure S2: "source index" jargon
- [MAJOR] transitive-closure S3: Q4 claim "0 can reach 1…" on an edgeless graph; false premise, feedback implies reachability
- [MINOR] transitive-closure S3: "× Right…" feedback on wrong answers (Q3)
- [MAJOR] transitive-closure S4: correct choice "Neither source… both diagonal entries" reused verbatim for 3-node and 1-node cases
- [MINOR] transitive-closure S4: case 1 distractor "returns the original graph matrix" is observationally true on that input
- [MINOR] transitive-closure S4: no hint that a nested matrix `[[0,1],[0,0]]` is expected
- [MINOR] transitive-closure S4: identical code in all three cases
- [MAJOR] trusted-courier-networks S1: wrong build choice is the office count n in 7 of 9 builds (else 0); predictable
- [MINOR] trusted-courier-networks S1: Q7/Q9 inputs have 0 on the diagonal, contradicting "trust[i][i] is always 10"
- [MINOR] trusted-courier-networks S1: edge rule "trust[i][j] >= k" literally includes self-loops; graphs have none
- [MINOR] trusted-courier-networks S1: Q5 input box ends with stray "Focus on one listed relation."
- [MINOR] trusted-courier-networks S1: remedial titles "Name the real entities" etc. are jargon
- [MAJOR] trusted-courier-networks S2: Q2 Alana "written order" = click order; drawing 0—1 instead of 1—0 makes the counterexample fail; Drawing 2 must be directed
- [MAJOR] trusted-courier-networks S2: "CORRECT OUTPUT" wants `[0,1,2]`, not the network count
- [MINOR] trusted-courier-networks S2: Q1 Cesar's start office 1 hidden until Drawing 2
- [MINOR] trusted-courier-networks S2: "first office in the network" label is clunky and suggests office 0
- [MAJOR] trusted-courier-networks S3: Q4 claim "0 can reach 1…" on the identity matrix; false premise
- [MINOR] trusted-courier-networks S3: Q1 feedback renders "Every office index / 0 / through / n−1 /" on five lines (backticks)
- [MINOR] trusted-courier-networks S3: Q1 v2 "only offices with a score ≥ k" yields the same graph on the star input
- [MINOR] trusted-courier-networks S3: "× Right…" feedback on wrong answers (Q2)
- [MINOR] trusted-courier-networks S4: code is `solve(input)`/`input.trust`, not `countSecureNetworks(trust, k)`
- [MINOR] trusted-courier-networks S4: case 3 says "couriers" where every other screen says "offices"
- [MINOR] trusted-courier-networks S4: identical code in all three cases
