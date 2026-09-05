# Batch AC findings

Problems: longest-increasing-path-in-a-matrix, minesweeper, nested-list-weight-sum, nested-list-weight-sum-ii, network-delay-time, number-of-connected-components-in-an-undirected-graph, number-of-increasing-paths-in-a-grid.

All 21 Step 4 buggy outputs were re-run with node (`scratchpad/s4check.js`) and match the declared values; all declared correct outputs match the problem statements. Every Step 1 build/remedial answer key was worked by hand; all keys are right. The problems below are about feedback, wording, hidden requirements, repetition and distractors.

## Batch-wide patterns seen in all 7 problems (NOT in SYSTEMIC-NOTES; concrete instances are listed per problem)

- **[MAJOR] Step 3 "feedback if wrong" on YES-keyed direct-vs-reach claims starts with "Correct." or "Right."** The student answers No, gets an × mark, and next to it reads "Correct. The mini-example lists 0—1 as one direct edge." or "Right. A multi-step route through (0,1) creates reachability, not a new direct edge." Seen in every problem in this batch (LIP S3 Q1 v1/Q2/Q3, MS Q1 v0/Q4/Q5, NLWS Q1 v0/Q4/Q5, NLWS-II Q1 v0/Q4, NDT Q1 v1-v2/Q3/Q5, CC Q1 v1-v2/Q3/Q5, NIP Q1 v0/Q2/Q4). Fix: generate wrong-answer feedback that starts with "No —" / "That claim is true because …".
- **[MAJOR] Step 4 gives the same bug three times.** In all 7 problems the three cases share one misconception title, byte-identical code, and the same correct diagnosis sentence (only the A/B/C order changes). Cases 2 and 3 are tiny 1-row inputs already used as Step 1 remedials. After case 1 the student re-picks the same sentence twice. CLAUDE.md asks for "one deep … case per problem" — the extra two add only repeated drawing.
- **[MINOR] Step 4 "Changed graph" step describes the CORRECT graph, not the code's changed graph**, so the taught chain "code rule → changed graph → boundary → returned value" contradicts itself (e.g. LIP case 1 "Changed graph: Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left." — that is precisely the edge the code lacks). Cases 2/3 also end with "the source-repo reference solution returns N" — jargon the student cannot parse.
- **[MINOR] Step 1 build wrong-answer feedback is a template with a bug id turned into words**: "That result follows the follow only input reading direction bug, not the exact picture." / "…the count dfs back edges bug…" / "…the assume extra empty depth bug…". Unreadable for the target student; some of the named bugs do not even produce the number chosen (instances below).
- **[MINOR] Non-grid problems get no "Use this graph model" panel on a Step 3 graph failure** (gridGraphScheme() is grid-only). NLWS, NLWS-II, NDT and CC show only "× Every exact node is drawn / × Every exact direct edge is drawn / × Edge direction matches" and nothing about the required label format.

---

## Longest Increasing Path in a Matrix (`longest-increasing-path-in-a-matrix`)

### Step 1
- **[MINOR] Q7 correct choice is the odd one out.** Choices are "3", "5", "6", "4 cells" — only the right answer carries a unit word, so the letter is predictable. The question "how long is the pictured path 1→2→6→9?" also prints the four cells, so counting the numbers answers it, and nothing is "pictured" (the drawing tool is blank/optional). Fix: format all four alike and ask for the longest path length without listing the path. (S1 Q7)
- **[MINOR] Q9 distractor feedback is factually wrong for the grid.** For [[3,4,5],[3,2,6],[2,2,1]] choice "2→3→4→5→6, length 5" gets "The chosen 2 and 3 are diagonal, so that first step is illegal." But the 2 at (1,1) and the 2 at (2,0) are both side-adjacent to the 3 at (1,0); the path fails because no 4 touches that 3. A student who checks the grid will find the feedback contradicts it. (S1 Q9)
- **[MINOR] bug-trap remedial distractor names a bug that doesn't give that number.** On [[1,3],[2,4]] choice "2" says "That result follows the global visited skips shared tail bug" — a global-visited DFS from (0,0) still returns 3 here (it reaches 4 on its first branch). (S1 remedial after Q9)
- **[MINOR] Cryptic template feedback**: "follow only input reading direction bug" (relation remedial, [[3,2,1]]), "combine two branches bug", "count only moves bug", "count edges not nodes bug". (batch-wide pattern)

### Step 2
- **[MAJOR] Q1 (Ava, "allows diagonal steps"): the drawn nodes have no cell values, so the site cannot know which diagonal cell is larger.** `mistakenGraph` adds a one-way arrow from the *earlier-created* node to the *later-created* node for every diagonally adjacent pair, ignoring values. If the student adds (1,1) before (0,0) and starts at (0,0), Ava's arrow is (1,1)→(0,0), Ava reaches nothing new, and the check fails with only "× The graph exposes the mistake". Drawing 2 must also contain exactly that arrow direction. Nothing on screen mentions creation order or that values are ignored. Fix: say "Ava's diagonal arrows point from the first-added cell to the second-added cell" or make the invented diagonal edges two-way. (S2 Q1)
- **[MINOR] "CHOOSE THE STARTING CELL" / "OUTPUT" contradict the problem.** LIP has no start cell (paths start anywhere) and returns a length; the lab's "CORRECT OUTPUT" is the list of cells reachable from the chosen cell, e.g. `["(0,0)","(0,1)","(0,2)"]`. A student who types the real answer (3) is rejected with no hint. (S2 all rounds)
- **[MINOR] Q3 (Olivia): text promises "Edge numbers show drawing order." but the harness saw no order badges on the initial screen** (graph.js shows "#1/#2" only when the context key contains `:last-branch:`). Verify they appear once edges are drawn; if not, the "last branch" rule is unknowable. (S2 Q3)

### Step 3
- **[MAJOR] "Correct."/"Right." shown next to × for a wrong answer** — Q1 v1 "There is no direct edge between (0,0) and (0,1); merely naming both nodes does not make them reachable." wrong → "× Correct. Node membership alone creates neither a direct edge nor a route."; Q2/Q3 "× Right. A multi-step route through (0,1) creates reachability, not a new direct edge." (batch-wide pattern)
- **[MINOR] Q1 v0/v2 claim has a false premise.** On matrix [[1,1]]: "(0,0) can reach (0,1), so the graph should contain a direct edge between them." (0,0) cannot reach (0,1) at all. NO is keyed, but a literal student cannot tell whether they are judging the premise or the conclusion. (S3 Q1)
- **[MINOR] Label guidance conflicts on one screen.** Node-name guide: "Name each cell (row,column)… Do not add spaces" (pattern `^\(\d+,\d+\)$`); the failure panel: "Both (0,2) and 0,2 work." (S3 Q1 failure panel)

### Step 4
- **[MAJOR] Same bug three times** ("Movement is limited to right and down"); cases 2 and 3 are the 1-row grids [[3,2,1]] and [[4,3,2,1]] whose answer (1) is immediate. (batch-wide pattern)
- **[MINOR] "Changed graph" describes the correct graph** — case 1: "Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left." (the code drops exactly that edge); cases 2/3 list the full correct arrow set under "Changed graph". "orthogonal" is jargon. (batch-wide pattern)
- Hidden labels are plain (row,column) and grid labels are normalised, so Step 4 labels are guessable here — fine.

### Cross-step / other
- **[MINOR] Heavy input reuse**: [[1,2],[4,3]] is S1 Q1, S1 Q3 and S4 case 1; [[3,2,1]] is the relation remedial, S3 Q2 and S4 case 2; [[1,2],[2,3]] is the predict remedial and S3 Q3. Step 4's drawings are already known before the code is read.

---

## Minesweeper (`minesweeper`)

### Step 1
- **[MAJOR] relation-rule remedial cannot distinguish the rule it remediates, and its distractor feedback is false.** Input [["E","E"],["E","E"]], click [0,0]; choices "only three side-connected cells become B" vs "all four become B". A four-direction-only reveal ALSO turns all four cells B ((1,1) is side-adjacent to (0,1) and (1,0)), so "That result follows the expand four directions only bug" is untrue, and the correct answer holds under both rules. Fix: use a board where diagonals matter, e.g. [["E","E"],["E","M"]], click [0,0] (8-neighbour → "1" and stop; 4-neighbour → [["B","1"],["1","M"]]). (S1 remedial after Q7)
- **[MINOR] bug-trap remedial is a verbatim repeat of Q4**: [["M","E"],["E","E"]], click [1,1], same two choices, same answer "clicked cell becomes 1". The same input is also S3 Q3 and S4 case 1. (S1 remedial after Q9)
- **[MINOR] Q8 wording**: "A click lands on an empty square with no adjacent mine. What should the picture do next?" — pictures do not "do" things, and the 4×5 board shown above the question is never used by it. (S1 Q8)
- **[MINOR] core-rule remedial distractor** "[["B","1"]]" is explained as the "count revealed blank as mine bug" — not a believable student mistake. (S1 remedial after Q5)

### Step 2
- **[MINOR] "Output" clash is acute here.** The real function returns a board, but "CORRECT OUTPUT" wants `["(0,0)","(1,1)"]` (squares reached). The drawn graph carries no E/M contents, so "reached" ignores Minesweeper's stop-at-number rule the student just learned. Typing a board such as [["B","B"]] is rejected with no hint. (S2 all rounds)
- **[MINOR] Q2 (Christopher): the wrong click "(0,1)" is not in the bug text** ("uses the wrong clicked square"); it appears only in Drawing 2's title or in the post-Check error "Also draw (0,1), the wrong clicked square used by the broken search." (S2 Q2)
- **[MINOR] The "correct graph" is never checked against the 8-neighbour rule.** The harness passed Q3 with an L of cells (0,0),(0,1),(1,0),(2,0) that omits the diagonal (0,1)—(1,0) edge. Conversely a student who draws the real 8-neighbour graph for those cells cannot expose Chloe (the greedy walk reaches everything). No text says the shape may be any graph. (S2 Q3)

### Step 3
- **[MAJOR] "Correct."/"Right." shown for a wrong answer** — Q1 v0 "(0,0) and (0,1) are directly connected…" wrong → "× Correct. The mini-example lists (0,0)—(0,1) as one direct edge."; Q5 same; Q4 "× Right. …". (batch-wide pattern)
- **[MINOR] Node-rule feedback renders with line breaks around code spans** as captured: "…whether it currently contains / E / , / M / , a digit, or / B / ." Verify inline `<code>` styling in the feedback list; if it really breaks lines the sentence is unreadable. (S3 Q1 feedback)

### Step 4
- **[MAJOR] Same bug three times** ("Diagonal mines are not counted"); case 1 input equals S1 Q4, the bug-trap remedial and S3 Q3. (batch-wide pattern)
- **[MINOR] "Changed graph" describes the correct graph**: "In a 2×2 board, every pair of cells shares a side or corner, so the real eight-neighbor graph is complete with six edges." (batch-wide pattern)
- **[MINOR] Case 3 needs 6 nodes and all 11 edges** of the 2×3 eight-neighbour graph, including three edges into the mine cell (0,2); the only place the student learned that mine cells get edges is a Q7 distractor's feedback. Heavy but consistent. (S4 case 3)
- Buggy outputs verified: [["M","1"],["1","B"]], [["1","M"],["B","1"]], [["B","1","M"],["B","B","1"]]; correct outputs match the statement.

---

## Nested List Weight Sum (`nested-list-weight-sum`)

### Description tab
- **[MINOR] Example 3 prints the word "undefined"**: "input nestedList = [0] → output 0. undefined" (missing explanation string). (Description)

### Step 1
- **[MAJOR] Q1 distractor feedback is wrong.** Choice "6" says "That result follows the start root depth at zero bug". Starting depth at 0 on [[1,1],2,[1,1]] gives 4 — the site's own Step 4 case 2 says "the shown code returns 4". 6 is the plain unweighted sum. A student who forgot the depth weights is told they used depth 0. (S1 Q1)
- **[MAJOR] Q7 distractor feedback describes different mistakes than the numbers chosen.** "8" → "This gives the top-level 2 the same depth-2 weight as inner values" (that bug gives 6×2 = 12, not 8). "12" → "This wrongly starts the outer list's integers at depth 2" (that gives 2×2 + 4×3 = 16, not 12). 12 is actually the all-weight-2 result; 8 is "nested 1s at depth 2, top-level 2 dropped". (S1 Q7)
- **[MINOR] Q9 distractor feedback** "Those are inverse-depth weights from the other problem." — "the other problem" means nothing unless the student knows Nested List Weight Sum II. (S1 Q9)
- **[MINOR] Q2 picture choices use a different naming scheme** ("Outer array", "Array at [0]", "1 at [0][0]") from the required drawing labels shown on the same screen ("root=[]", "root[0]=[]", "root[0][0]=1"). (S1 Q2)
- **[MINOR] Node rule has two wordings**: Q4's correct answer "The outer list, both inner lists, and integer nodes 3, 1, and 7." (written for [3,[1,[7]]]) vs Step 3's "Correct node rule: One node for every list container and every integer occurrence, including empty lists." (S1 Q4 / S3)
- **[MINOR] Remedial bug names don't map to the numbers**: "add list node to depth bug" for 10 on [2,[3]]; "weight top level too deep bug" for 8 on [[2],3] (8 is the swapped-depth result). (S1 remedials)

### Step 2
- **[MAJOR] Step 1's node names are rejected.** Submitting "root=[]", "root[0]=[]", "root[1]=2"… returns "Use root, root[0], root[1], ... to name nested input items." — the new scheme is only revealed by that error; no guide is shown. (S2 Q1; concrete instance of the systemic note)
- **[MINOR] "CHOOSE THE OUTER LIST" heading sits over a read-only field prefilled "root"** — there is nothing to choose. (S2 all rounds)
- **[MINOR] Q1 bug text** "Natalie reads every from/to relationship backward." — "from/to" is undefined for a containment tree; say "draws each arrow from item to list instead of list to item". (S2 Q1)
- **[MINOR] Hidden tree constraints appear only as post-Check errors**: "This problem's input must form one tree: use exactly one fewer edge than nodes.", "A directed tree needs exactly one root with no incoming edge." (S2 all rounds)

### Step 3
- **[MAJOR] "Right." shown for a wrong answer** (Q1 v0, Q4, Q5). (batch-wide pattern)
- **[MAJOR] Membership claim numbers collide with the input.** On [[2],3] (Q1 v0) and [2,[3]] (Q3): "Nodes 3, 2, and 21 because each integer should already be multiplied by its depth." The input really contains 3 and 2, so this looks input-specific, but 21 is 7×3 from the Step 1 example [3,[1,[7]]]; for [[2],3] the products would be 4 and 3. Also "Only integers 3, 1, and 7, with depth written directly on each." is quoted on [[2],3] and [1,[1]]. (S3 Q1, Q3, Q4)
- **[MINOR] No model panel on graph failure** — after "Your three answers are right. Fix the graph below." the student sees only three × lines, no reminder that labels must look like root[0]=2. (S3 Q1; batch-wide pattern)

### Step 4
- **[BLOCKER] Case 1 hidden node labels are unguessable**: "outer list", "1 at depth 1", "middle list", "4 at depth 2", "deepest list", "6 at depth 3". Step 1/3 taught root=[], root[0]=1, root[1]=[], root[1][0]=4, root[1][1]=[], root[1][1][0]=6; Step 2 taught root, root[0], root[1][0]. No guide is shown; feedback only says "The drawing has every exact node ×". Cases 2 and 3 then require the root=[] scheme again — the lesson uses three label schemes in one step. (S4 case 1)
- **[MAJOR] Cases 2/3 feedback shows a fourth naming scheme as the model**: "Changed graph: Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; …" and "Nodes: root, 2, A, 3." — names the grader never accepts. (S4 cases 2, 3)
- **[MAJOR] Same bug three times** ("Top-level integers get weight zero"; same sentence "Its root depth is one too small for every integer."). (batch-wide pattern)
- **[MINOR] Case 1 distractor feedback** "No. That is the inverse-weight variant, not this problem." — jargon. (S4 case 1)
- Buggy outputs verified 16, 4, 3; correct 27, 10, 8.

---

## Nested List Weight Sum II (`nested-list-weight-sum-ii`)

### Step 1
- **[MAJOR] Q7 distractor "12" feedback is wrong and duplicates B's.** "This gives the deeper integers the larger weight." is the normal-depth bug, which yields 10 — choice B, whose feedback already says "uses normal depth weights". 12 is 6×2 (every integer weighted 2). (S1 Q7)
- **[MINOR] Q9 ([1,[[]]] → 1) rests on maxDepth counting integers only.** The Description does define it that way ("depth of the deepest integer"), so the key is right, but the distractor 3 is what list-depth solutions produce; the "Why" should say explicitly that the empty list's depth does not count. (S1 Q9)
- **[MINOR] Q3 correct answer is input-specific but reused as the general rule**: "Every list container and every integer, preserving all three nesting levels." (for [[6],3,[[7]]]) is quoted verbatim as "Correct node rule" in Step 3 on inputs with two or four levels ([2,[3]], [[[4]]]). (S1 Q3 / S3)
- **[MINOR] Q2 picture naming "Outer array / Array at [0]…" vs required "root=[]"** (as NLWS). (S1 Q2)
- **[MINOR] Template bug names**: "assume extra empty depth bug" (Q6), "deduplicate equal values bug", "swap forward and inverse weights bug", "use absolute depth not inverse bug". (S1)

### Step 2
- **[MAJOR] Step 1's node names are rejected** with "Use root, root[0], root[1], ... to name nested input items." (S2 Q1; concrete instance)
- **[MINOR] Q3 (Ashley, wrong-start): the wrong container "root[0]" is not in the bug text** ("runs the search from a different root container"); it surfaces only in Drawing 2's title or the error "Also draw root[0], the wrong root container used by the broken search." (S2 Q3)
- **[MINOR] Q2 (James, drop-last-edge)**: "leaves the final direct link out" — "final" means the last edge the student happened to draw; plus the hidden tree-shape errors as in NLWS. (S2 Q2)
- **[MINOR] "CHOOSE THE ROOT CONTAINER" over a read-only field.** (S2 all rounds)

### Step 3
- **[MAJOR] "Right." shown for a wrong answer** (Q1 v0, Q4). (batch-wide pattern)
- **[MAJOR] Membership claims name integers that are not in the input**: "Only the deepest integer 7 because deepest values get weight 1." on [1,[2,[3]]] (deepest is 3) and [[[4]]] (deepest is 4); "Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight." on [2,[3]] and [[2],3]. A literal student hunts for a 7. (S3 Q1 v2, Q2, Q4, Q5)
- **[MINOR] No model panel on graph failure.** (batch-wide pattern)

### Step 4
- **[BLOCKER] Case 1 hidden node labels are unguessable and differ from NLWS's**: "outer list", "1 depth 1", "middle list", "4 depth 2", "deepest list", "6 depth 3" (NLWS uses "1 at depth 1"). Cases 2/3 require the root=[] scheme. (S4 case 1)
- **[MAJOR] Cases 2/3 "Changed graph" uses "root, A, 1a, 1b…" / "root, 2, A, 3" names** never accepted by the grader. (S4 cases 2, 3)
- **[MAJOR] Same bug three times** ("Weights grow with depth instead of shrinking"). (batch-wide pattern)
- **[MINOR] Case 1 chain text**: "Changed graph: The containment tree has maximum integer depth 3, so inverse weight is 4-depth." — "4-depth" reads like a label (means 4 − depth), and this bug does not change the graph at all, so the "changed graph" step is misleading. (S4 case 1)
- Buggy outputs verified 27, 10, 8; correct 17, 8, 7.

---

## Network Delay Time (`network-delay-time`)

### Step 1
- **[MAJOR] Edge weights are graded but never requested.** Every build canvas requires labelled edges (e.g. "2→1 (weight/label "1")", "1→2 (10)") and checkBuild grades "Edge labels or weights match the input", yet the only on-screen guide is "Required node-name format: Use each node's 1-based number only. Example: 2." Nothing says to label each arrow with its time (edge labels are set by selecting the edge and using Rename/F2). The student learns it only from the × line after a failed check. Same hidden requirement in Step 3 ("× Edge labels or weights match the input") and Step 4. Fix: add "Label each arrow with its travel time" to the guide for weighted problems. (S1 Q1, Q2, Q5, Q8, all remedials; S3; S4)
- **[MINOR] Q7 re-asks Q1**: same input [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2; Q1's success text already said "Shortest arrival times are 0,1,1,2; the slowest is 2." and it is Description Example 1. Q9 is Description Example 2 ([[1,2,1]], n=2, k=1 → 1). Both are answerable by lookup. (S1 Q7, Q9)
- **[MINOR] Template bug names with jargon**: "ignore relaxation bug" (predict remedial), "mark visited before shorter path bug", "require at least one edge bug". (S1 remedials)
- **[MINOR] Authored graph rules are example answers, not rules**: "Nodes: Nodes 1, 2, 3, and 4, including any node with no wire." / "Edges: A one-way arrow 1→3 labeled 5." Harmless today only because the model panel is grid-only. (data)

### Step 2
- **[MAJOR] Q1 (Grace, make-two-way): Drawing 2 must have "Directed edges" switched OFF.** The grader requires Grace's graph to be exactly "UNDIRECTED · nodes: 1, 2 · edges: 2—1" and checks `direction`. "Duplicate graph from #1" copies the directed state, so duplicate-and-submit fails with only "× Grace's drawing exactly shows the mistake". Nothing tells the student to flip the toggle. (S2 Q1)
- **[MINOR] Weights vanish and "output" is the reached set.** The lab graphs have no travel times, and CORRECT OUTPUT is `[1,2]`, although the student just spent Step 1 computing times; the OUTPUT label invites typing a time like 1. (S2 all rounds)

### Step 3
- **[MAJOR] "Right."/"Correct." shown for wrong answers** (Q1 v1/v2, Q3, Q5). (batch-wide pattern)
- **[MINOR] Membership claim "Only node 2 and nodes reachable from it." is quoted on inputs with k=1** (Q1, Q3) — the "2" comes from the Step 1 example with k=2. (S3 Q1 v0, Q3)
- **[MINOR] Edge labels graded with no instruction; no model panel on failure.** (S3 Q1; see Step 1)

### Step 4
- **[BLOCKER] Case 1 hidden labels: "1", "2 source", "3", "4"** (plus edge labels "1"). The source node must be named "2 source" — never taught. Cases 2 and 3 then require plain "1", "2" with no suffix, so a student who learns case 1's trick and applies it to case 2 fails again. (S4 case 1 vs 2/3)
- **[MAJOR] Same bug three times** ("Signal roads are treated as two-way"); cases 2/3 are S1 Q2 and the relation remedial; the same sentence "It adds a reverse edge for every directed travel time for the shown graph." is correct each time. (batch-wide pattern)
- **[MINOR] Distractor jargon**: "The priority queue processes the largest tentative time before the smallest one." — the shown code has no named priority queue (sort + pop); "tentative time" is Dijkstra vocabulary. (S4 all cases)
- **[MINOR] "Changed graph" describes the correct graph**: "From source 2, arrows reach 1 and 3, while the only edge touching 4 points outward from 4." (batch-wide pattern)
- Buggy outputs verified 2, 1, 5; correct -1, -1, -1.

---

## Number of Connected Components in an Undirected Graph (`number-of-connected-components-in-an-undirected-graph`)

### Step 1
- **[MAJOR] Q8 and Q9 re-ask Q1 and Q2 with the same inputs.** Q8 "For n=5, edges=[[0,1],[1,2],[3,4]], how many components appear?" → 2 (Q1's success text: "Nodes 0–2 form one component and nodes 3–4 form another."; Description Example 1). Q9 "What is the component count for chain 0—1—2—3—4?" → 1 (Q2 and Example 2). Two of the five concept checks test nothing new. (S1 Q8, Q9)
- **[MINOR] Q7 distractor refers to nodes not in the question.** "What connections are created by edges = [[0,1],[1,2]]?" gives no n, yet choice D says "Also connect node 2 to isolated nodes 3 and 4 so every node belongs to a group." (S1 Q7)
- **[MINOR] Template bug names**: "count dfs back edges bug" (Q6), "count only edge components bug" (Q4), "assume n minus edges bug" (bug-trap remedial — this one is actually a good distractor, 4−3=1, but the name obscures it). (S1)

### Step 2
- **[MAJOR] Q1 (Hailey, make-one-way): Drawing 2 must have "Directed edges" switched ON, and the arrow direction is the click order from Drawing 1.** Grader: "character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0". Bug text "allows each two-way link to work only in its written order" has no meaning here — there is no edge list; the "written order" is the order the student clicked the two endpoints. If they clicked 0 then 1 with seed 0, Hailey reaches [0,1] = correct and the check fails "× The graph exposes the mistake" with no explanation. (S2 Q1)
- **[MINOR] Q2 (Benjamin) "builds every listed connection except the last one"** — "listed" means drawn order; acceptable only because "Edge numbers show drawing order." is appended. (S2 Q2)

### Step 3
- **[MAJOR] "Correct." shown for wrong answers** (Q1 v1/v2, Q3, Q5). (batch-wide pattern)
- **[MAJOR] Membership claims name nodes that don't exist in the input.** On n=3, edges=[[1,0],[2,1]] (Q2) and n=3, edges=[[0,1]] (Q5): "Three nodes: connected group {0,1,2}, isolated 3, and isolated 4." — n=3 has no node 3 or 4. On n=5, edges=[[0,1],[2,3]] (Q1 v0) and the triangles (Q3): "Two nodes: one for edge [0,1] and one for edge [1,2]." — edge [1,2] is not in the input. (S3 Q1, Q2, Q3, Q5)
- **[MINOR] No model panel on graph failure.** (batch-wide pattern)

### Step 4
- **[MAJOR] Same bug three times** ("Edge pairs become one-way arrows"; same correct sentence "Each undirected pair must enter both adjacency lists, changing this input's returned value."). Case 2 is the relation remedial input. (batch-wide pattern)
- **[MINOR] Case 3 "Code rule" was copied from case 1**: "Only arrows 1→0 and 2→1 are stored" — case 3 (edges [[1,0],[2,1],[4,3]]) also stores 4→3. (S4 case 3)
- **[MINOR] Case 2 distractor is irrelevant to the input**: "Isolated nodes should not count as connected components." on n=3 with no isolated node — trivially wrong. (S4 case 2)
- **[MINOR] "Changed graph" describes the correct graph**: "The undirected edges form component {0,1,2}, while node 3 forms a second component." (batch-wide pattern)
- Buggy outputs verified 4, 3, 5; correct 2, 1, 2.

---

## Number of Increasing Paths in a Grid (`number-of-increasing-paths-in-a-grid`)

### Step 1
- **[MAJOR] [[1],[2]] is used three times and Q9 gives nothing new.** Q1 build → 3 (success text: "The paths are [1], [2], and [1→2]."), Q2 exact picture, Q9 bug-trap "For the column [[1],[2]], which paths count?" → "3: [1], [2], and [1,2]". Q7 is Description Example 1 ([[1,1],[3,4]] → 8, worked out in the description as "4 + 3 + 1 = 8 paths"). (S1 Q9, Q7)
- **[MINOR] bug-trap remedial is identical to Q6**: [[1,2],[2,3]], choices 8 | 10. (S1 remedial after Q9)
- **[MINOR] Q7 distractor "9" feedback** "The two equal 1 cells cannot connect as an increasing step." — allowing the equal step gives 13 paths, not 9. (S1 Q7)
- **[MINOR] Template bug names**: "count only multi cell paths bug", "merge paths at shared end bug", "count shared suffix once bug", "follow only left to right bug", "require at least one move bug". (S1)

### Step 2
- **[MAJOR] Q1 (Lillian, add-diagonals): same defect as LIP** — values are ignored and the invented diagonal arrow goes from the earlier-created node to the later-created one; whether the mistake is "exposed" depends on node creation order, with no hint. (S2 Q1)
- **[MINOR] "CHOOSE THE PATH'S FIRST CELL"**: the problem counts paths starting from every cell; the lab's OUTPUT is the set of cells reachable from one chosen cell, not a path count. (S2 all rounds)

### Step 3
- **[MAJOR] "Right."/"Correct." shown for wrong answers** (Q1 v0, Q2, Q4). (batch-wide pattern)
- **[MINOR] Q5 ([[2,2]]) claim has a false premise**: "(0,0) can reach (0,1), so the graph should contain a direct edge between them." — (0,0) cannot reach (0,1). (S3 Q5)
- **[MINOR] Guide vs failure panel conflict** ("Do not add spaces" / pattern (row,column) vs "Both (0,2) and 0,2 work."). (S3 Q1)

### Step 4
- **[MAJOR] Same bug three times** ("Increasing paths may move only right or down"); cases 2/3 are the relation and predict remedials ([[3,2,1]], [[2,1,2]]). (batch-wide pattern)
- **[MINOR] Case 1 "Changed graph" describes the correct graph and names cells by value**: "Each smaller cell points to every larger orthogonal neighbor, producing edges 1→2, 1→4, 2→3, and 3→4." while the drawing must use (row,column). (S4 case 1)
- Buggy outputs verified 5, 3, 4; correct 11, 6, 5.

---

## One-line summary of every finding in this batch

- [MAJOR] all-7 S3: wrong-answer feedback on YES-keyed claims begins "Correct."/"Right." next to an × mark
- [MAJOR] all-7 S4: three cases share one bug, identical code and the same correct diagnosis sentence; cases 2–3 are repeats
- [MINOR] all-7 S4: "Changed graph" step describes the correct graph, not the code's graph; "source-repo reference solution" jargon
- [MINOR] all-7 S1: build wrong-answer feedback is a bug-id template ("follows the count dfs back edges bug, not the exact picture")
- [MINOR] NLWS/NLWS-II/NDT/CC S3: no "Use this graph model" panel on graph failure (grid-only)
- [MINOR] longest-increasing-path-in-a-matrix S1: Q7 correct choice "4 cells" formatted unlike "3/5/6"; path printed in the question
- [MINOR] longest-increasing-path-in-a-matrix S1: Q9 feedback "2 and 3 are diagonal" is false for the grid (2 at (1,1) touches 3 at (1,0))
- [MINOR] longest-increasing-path-in-a-matrix S1: bug-trap remedial distractor "2" attributed to a global-visited bug that returns 3
- [MAJOR] longest-increasing-path-in-a-matrix S2: Ava's diagonal arrow direction = node creation order, values ignored; unexposable without knowing this
- [MINOR] longest-increasing-path-in-a-matrix S2: "starting cell"/"OUTPUT" contradict a problem with no start and a numeric answer
- [MINOR] longest-increasing-path-in-a-matrix S2: "Edge numbers show drawing order." shown but no order badges captured — verify
- [MINOR] longest-increasing-path-in-a-matrix S3: Q1 claim "(0,0) can reach (0,1), so…" has a false premise on [[1,1]]
- [MINOR] longest-increasing-path-in-a-matrix S3: guide "Do not add spaces / (row,column)" vs panel "Both (0,2) and 0,2 work"
- [MINOR] longest-increasing-path-in-a-matrix cross-step: [[1,2],[4,3]], [[3,2,1]], [[1,2],[2,3]] reused across S1/S3/S4
- [MAJOR] minesweeper S1: relation-rule remedial ([["E","E"],["E","E"]]) — 4-direction reveal also makes all four B; distractor feedback false, concept untested
- [MINOR] minesweeper S1: bug-trap remedial is a verbatim repeat of Q4 (also S3 Q3 and S4 case 1)
- [MINOR] minesweeper S1: Q8 "What should the picture do next?" wording; shown board unused
- [MINOR] minesweeper S1: core-rule remedial distractor explained as "count revealed blank as mine bug"
- [MINOR] minesweeper S2: OUTPUT wants reached squares while the function returns a board; graph has no E/M contents
- [MINOR] minesweeper S2: Christopher's wrong click "(0,1)" only in Drawing 2 title / post-Check error
- [MINOR] minesweeper S2: correct graph never checked against the 8-neighbour rule; real 8-neighbour graph cannot expose Chloe
- [MINOR] minesweeper S3: node-rule feedback captured with line breaks around E / M / B code spans — verify rendering
- [MINOR] minesweeper S4: case 3 requires all 11 edges of a 2×3 eight-neighbour graph incl. edges into the mine
- [MINOR] nested-list-weight-sum Description: Example 3 prints "undefined"
- [MAJOR] nested-list-weight-sum S1: Q1 distractor "6" attributed to depth-zero bug, which gives 4 (S4 case 2 says so)
- [MAJOR] nested-list-weight-sum S1: Q7 feedback for "8" and "12" describes bugs that yield 12 and 16
- [MINOR] nested-list-weight-sum S1: Q9 feedback "from the other problem" is meaningless
- [MINOR] nested-list-weight-sum S1: Q2 pictures named "Outer array / Array at [0]" vs required "root=[]"
- [MINOR] nested-list-weight-sum S1: node rule worded differently in Q4 ("integer nodes 3, 1, and 7") and Step 3
- [MINOR] nested-list-weight-sum S1: remedial bug names ("add list node to depth", "weight top level too deep") don't map to the numbers
- [MAJOR] nested-list-weight-sum S2: Step 1 labels "root=[]…" rejected; "root, root[0]" scheme revealed only by the error
- [MINOR] nested-list-weight-sum S2: "CHOOSE THE OUTER LIST" over a read-only field
- [MINOR] nested-list-weight-sum S2: "reads every from/to relationship backward" undefined for a containment tree
- [MINOR] nested-list-weight-sum S2: tree-shape constraints only appear as post-Check errors
- [MAJOR] nested-list-weight-sum S3: claim "Nodes 3, 2, and 21" on inputs [[2],3] / [2,[3]] — numbers collide with the input; 21 from another example
- [BLOCKER] nested-list-weight-sum S4: case 1 hidden labels "outer list", "1 at depth 1", "middle list", "4 at depth 2", "deepest list", "6 at depth 3"; cases 2–3 need root=[]
- [MAJOR] nested-list-weight-sum S4: cases 2–3 feedback models the graph as "root, A, 1a, 1b, 2, B, 1c, 1d" / "root, 2, A, 3"
- [MINOR] nested-list-weight-sum S4: "inverse-weight variant" jargon in distractor feedback
- [MAJOR] nested-list-weight-sum-ii S1: Q7 "12" feedback describes the normal-depth bug (=10, choice B)
- [MINOR] nested-list-weight-sum-ii S1: Q9 [1,[[]]] "Why" should state that list depth doesn't count toward maxDepth
- [MINOR] nested-list-weight-sum-ii S1: Q3 answer "preserving all three nesting levels" reused as the general rule in Step 3
- [MINOR] nested-list-weight-sum-ii S1: Q2 picture naming vs required labels
- [MINOR] nested-list-weight-sum-ii S1: template bug names ("assume extra empty depth bug", etc.)
- [MAJOR] nested-list-weight-sum-ii S2: Step 1 labels rejected; new scheme only in the error
- [MINOR] nested-list-weight-sum-ii S2: Ashley's wrong container "root[0]" not in bug text
- [MINOR] nested-list-weight-sum-ii S2: James "final direct link" = last-drawn edge; hidden tree errors
- [MINOR] nested-list-weight-sum-ii S2: "CHOOSE THE ROOT CONTAINER" over a read-only field
- [MAJOR] nested-list-weight-sum-ii S3: claims cite "deepest integer 7" / "integer nodes 6, 3, and 7" on inputs without 6 or 7
- [BLOCKER] nested-list-weight-sum-ii S4: case 1 hidden labels "outer list", "1 depth 1", "middle list", "4 depth 2", "deepest list", "6 depth 3" (differ from NLWS)
- [MAJOR] nested-list-weight-sum-ii S4: cases 2–3 feedback uses "root, A, 1a…" / "root, 2, A, 3" names
- [MINOR] nested-list-weight-sum-ii S4: "inverse weight is 4-depth" wording; bug doesn't change the graph
- [MAJOR] network-delay-time S1: edge weights graded ("Edge labels or weights match the input") but the guide never says to label arrows
- [MINOR] network-delay-time S1: Q7 repeats Q1 (answer shown in Q1 feedback and Example 1); Q9 is Example 2
- [MINOR] network-delay-time S1: "ignore relaxation bug" and other template names
- [MINOR] network-delay-time data: authored graph rules are example answers ("A one-way arrow 1→3 labeled 5")
- [MAJOR] network-delay-time S2: Grace's Drawing 2 must be UNDIRECTED — toggle must be switched off; duplicate-from-#1 fails silently
- [MINOR] network-delay-time S2: weights vanish; OUTPUT is the reached set, not a time
- [MINOR] network-delay-time S3: claim "Only node 2 and nodes reachable from it" quoted on k=1 inputs
- [MINOR] network-delay-time S3: edge labels graded with no instruction; no model panel
- [BLOCKER] network-delay-time S4: case 1 hidden labels "1", "2 source", "3", "4"; cases 2–3 use plain "2"
- [MINOR] network-delay-time S4: "priority queue"/"tentative time" distractor jargon
- [MAJOR] number-of-connected-components S1: Q8 and Q9 re-ask Q1 and Q2 with identical inputs (also Examples 1–2)
- [MINOR] number-of-connected-components S1: Q7 distractor mentions nodes 3 and 4 although no n is given
- [MINOR] number-of-connected-components S1: template names ("count dfs back edges bug", "assume n minus edges bug")
- [MAJOR] number-of-connected-components S2: Hailey's Drawing 2 must be DIRECTED with arrows in click order; "written order" meaningless without an edge list
- [MINOR] number-of-connected-components S2: Benjamin "listed connection" = drawn order
- [MAJOR] number-of-connected-components S3: claims cite "isolated 3, and isolated 4" on n=3 inputs and "edge [1,2]" on inputs without it
- [MINOR] number-of-connected-components S4: case 3 code rule omits the stored 4→3 arrow (copied from case 1)
- [MINOR] number-of-connected-components S4: case 2 distractor about isolated nodes on an input with none
- [MAJOR] number-of-increasing-paths-in-a-grid S1: [[1],[2]] used in Q1, Q2 and Q9 (answer given in Q1 feedback); Q7 is Example 1 verbatim
- [MINOR] number-of-increasing-paths-in-a-grid S1: bug-trap remedial identical to Q6
- [MINOR] number-of-increasing-paths-in-a-grid S1: Q7 "9" feedback — allowing equal steps gives 13
- [MINOR] number-of-increasing-paths-in-a-grid S1: template bug names
- [MAJOR] number-of-increasing-paths-in-a-grid S2: Lillian's diagonal arrow direction = node creation order, values ignored
- [MINOR] number-of-increasing-paths-in-a-grid S2: "path's first cell"/OUTPUT mismatch with a path-count problem
- [MINOR] number-of-increasing-paths-in-a-grid S3: Q5 claim with false premise on [[2,2]]
- [MINOR] number-of-increasing-paths-in-a-grid S3: guide vs panel label-format conflict
- [MINOR] number-of-increasing-paths-in-a-grid S4: case 1 "Changed graph" names cells by value (1→2, 1→4) while drawing needs coordinates
