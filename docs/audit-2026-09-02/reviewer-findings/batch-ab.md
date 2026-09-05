# Batch ab findings

Problems: evaluate-division, find-if-path-exists-in-graph, flatten-nested-list-iterator, is-graph-bipartite, keys-and-rooms, kill-process, letter-combinations-of-a-phone-number.

Verification done: every Step 1 build answer and every Step 4 declared buggy output was recomputed by hand and (for Step 4) by running the shown code with node. All 21 Step 4 buggy outputs match the declared values. Grader facts used below were confirmed in `visual-library.js`: `gradeCanvas()` compares node labels and edge labels as exact trimmed strings (only grid coordinates are normalized); the helper `exactEdgeDetails()` that would print the required edge labels is defined but never called; the Step 2 character drawing must have the arrow toggle in the state the grader expects (`drawing.directed === expected.directed`).

Known systemic issues (Step 3 all-same-answer parity, generic Step 2 output-format strictness, generic missing node guides) are not repeated here except where the instance is concrete for the problem.

---

## Evaluate Division (`evaluate-division`)

### Step 1
- **[BLOCKER] Edge weights are graded against hidden strings in mixed formats and the screen never says weights are required.** Every build checks "Edge labels or weights match the input" against hidden labels: Q1 wants `b→a = "0.5"` but `c→b = "1/3"` in the same drawing; Q2 wants `"0.25"`; the predict-output remedial wants `"0.5"`, `"1/3"`, `"0.25"` together; the bug-trap remedial wants `"1/3"` and `"0.5"`. The only guide shown is "Required node-name format: Use the exact variable name from the input only. Example: rate1." Nothing tells the student (a) that weights are graded, (b) that an edge is labeled by selecting it and pressing "Rename" (the field then says "Edge label"), or (c) that 1/2 must be written `0.5` while 1/3 must be written `1/3`. Typing `1/2`, `.5`, `0.33` or leaving weights off fails with "Not exact yet… The correct model stays hidden." and "× Edge labels or weights match the input". Fix: show the exact edge-label list (call the unused `exactEdgeDetails()`), or compare weights numerically (accept `1/2`, `0.5`, `.5`). (Q1 `build-chain`, Q2 `build-reciprocal`, Q4, Q6, all 5 remedials)
- **[MAJOR] Wrong-answer feedback is an internal bug id turned into a sentence.** Q4: "That result follows the unknown self or target equals one bug, not the exact picture."; Q6: "…follows the reject zero edge path bug…"; remedials: "…the multiply across components bug", "…the store forward edges only bug", "…the ignore reciprocals bug". A struggling student cannot parse "reject zero edge path". Write the mistake in plain words ("This treats a/a as unknown; a is a known variable, so a/a = 1."). (Q4, Q6, remedials)
- **[MINOR] 17-digit float as an answer choice.** Bug-trap remedial choices are "0.16666666666666666 | -1" and the "Why" says "The reverse query succeeds only when reciprocal edges are stored." Show `1/6` (or round) so the student can recognize 1/2 × 1/3.

### Step 2
- **[MAJOR] Step 1 teaches two arrows per equation; Step 2 silently expects one arrow per equation, and drawing what Step 1 taught makes the mistake unexposable.** Step 1 Q7's correct answer is "a→b with weight 2, and b→a with weight 1/2." In Step 2 the harness's accepted correct graph was just `a→b, b→c` with no reverse arrows and no weights. If the student draws the reciprocal pairs (a→b, b→a, b→c, c→b): in Q1 Imani "builds every listed connection except the last one" drops only c→b, and the set reached from a is still {a,b,c} → "× The graph exposes the mistake" with no explanation; in Q3 (June's hidden wrong numerator is `b`) reciprocal arrows make every component symmetric, so a and b always reach the same set and the round can only be passed by putting a and b in different components — the authored goal "Choose a start variable that is not listed first and has a different ratio component" is never shown. Tell the student explicitly that Step 2 uses one arrow per equation with no weights, or simulate reciprocals. (S2 Q1 `drop-last-edge`, Q3 `wrong-start`)
- **[MAJOR] "OUTPUT" for a division query is a number, but the box wants a list of variable names.** The fields read "CHOOSE THE QUERY NUMERATOR" then "OUTPUT / CORRECT OUTPUT / IMANI'S OUTPUT". A query's output in this problem is e.g. 6 or -1; the grader wants `["a","b","c"]` (quoted, alphabetical). No denominator is ever chosen, so the "query" has no answer. Rename the fields to "Variables reached from the numerator" or explain that output = reachable variables. (all 3 rounds)

### Step 3
- **[BLOCKER] Same hidden weight-string requirement as Step 1.** All 5 graphs end with "× Edge labels or weights match the input" unless the student types the hidden mixed formats (Q1: `"3"`, `"1/3"`, `"2"`, `"0.5"`; Q2: `"5"`, `"0.2"`; Q5: `"0.5"`, `"1/3"`, `"0.25"`). See Step 1.
- **[MAJOR] Q2 claim/feedback says the input "lists" an edge it doesn't list.** Input `equations = [["m","n"]], values = [5]`; claim "n can reach m, but there is no direct n→m edge." is keyed NO, and the feedback reads "The mini-example lists n→m as one direct edge." The input lists only m/n; n→m is the inferred reciprocal. A literal student sees no n→m in the input. Reword: "m/n = 5 also gives the reverse edge n→m = 1/5."
- **[MAJOR] Membership claims quote values from a different input.** Q3 (`values = [2,4]`) quotes "Two numeric nodes: 2 and 3."; Q4 (variables p,q,r) quotes "Two nodes: the equation `a/b` and the equation `b/c`."; Q2/Q5 feedback says "Intermediate variables such as b are needed to connect a query like a/c" for inputs with no a/c query.
- **[MINOR] Wrong-answer feedback begins "Right."/"Correct."** Q1 variant 0, Q3, Q4: under a red × the student reads "Right. A multi-step route through v creates reachability…" and "Correct. The mini-example lists a→b as one direct edge."

### Step 4
- **[BLOCKER] Case 1 requires edge labels `"×2"` and `"×1/2"`; cases 2–3 require `"2"`/`"0.5"`/`"3"`/`"1/3"` and `"4"`/`"0.25"`.** No guide is shown ("Node-name guide shown: NONE"). The multiplication sign × (U+00D7) is not on a keyboard, and the format flips between cases. The checklist item "Edge labels or weights match the input" fails with no hint. (case 1 `authored-deep-case`)
- **[MAJOR] All three cases are the same bug with the same correct sentence.** "Reverse equations keep the same weight" ×3; correct choice "The reverse edge should carry the reciprocal weight." appears in all three (only the letter moves). After case 1 the student just re-clicks it; cases 2–3 test nothing. (cases 2–3)
- **[MAJOR] Copy-pasted "Code rule" is false for cases 2 and 3.** All three show "Code rule: Both directions receive weight 2." Case 2 has values [2,3]; case 3 has values [4] — no weight 2 exists there. Case 1's "Reachable boundary: The query walks against the written equation." is also too vague to teach anything.
- **[MINOR] Correct output displayed as `[0.16666666666666666]`** (case 2). Show 1/6 ≈ 0.16667.

### Cross-step / other
- Weight representation is different in every step: Step 1/3 `0.5` and `1/3`; Step 4 case 1 `×2`/`×1/2`; Step 4 cases 2–3 `2`/`0.5`; Step 2 no weights at all. Pick one and print it.

---

## Find if Path Exists in Graph (`find-if-path-exists-in-graph`)

### Step 1
- **[MAJOR] Q9 gives the answer away in the question.** "Which conclusion correctly decides reachability from 0 to 5 in components {0,1,2} and {3,4,5}?" — telling the student the graph is two separate components is the whole task. The correct choice "No edge crosses between the two components, so 0 cannot reach 5." merely restates the question. Ask "does 0 reach 5?" without naming the components. (Q9 `bug-trap`)
- **[MINOR] Q7 choices are sentence fragments.** Under "Which graph reasoning is correct for this case?" the options are "[2,0] points the wrong way", "the cycle blocks DFS", "through 0→1→2; the direct pair cannot be used", "[2,0] is a usable two-way edge". Choice C is not a readable sentence. (Q7 `predict-output`)
- **[MINOR] Bug-id feedback.** "That result follows the assume all listed vertices connect bug", "…the connect isolated destination bug", "…the stop after first failed branch bug", "…the check only source neighbors bug". Same fix as evaluate-division.

### Step 2
- **[MAJOR] Q1: Lila's arrow direction is the click order of an edge the student drew as two-way, and Drawing 2 must have arrows switched on.** "Lila mistakes undirected links for arrows." The harness drew edge 1—0 by clicking 1 then 0, so Lila's required graph is `DIRECTED · 1→0`. A student who clicks 0 then 1 gets Lila's arrow 0→1, from source 0 she reaches {0,1} = correct, and the round fails "× The graph exposes the mistake" with no hint. Drawing 1 shows no arrowheads, so the student cannot see which way their edges "point". Also "character's graph must be exactly: DIRECTED" means the student must flip "Directed edges" on for Drawing 2; nothing says so, and "Duplicate graph from #1" copies an undirected graph. State: "Lila reads each line as an arrow from the first node you clicked to the second."
- **[MINOR] Q3: Esme's source is hidden until Drawing 2.** "Esme runs the search from a different source vertex." Her source `1` is only in Drawing 2's title. To expose it the student must put 1 in a different component from their chosen source (authored goal "Use a nonfirst source whose component differs from the first vertex's component" is not shown). Picking 1 as source gives the error "Choose a source vertex different from the broken search's 1."
- **[MINOR] Output box wants `[0,1]` (vertices reached) while the problem returns `true/false`.** The label "CORRECT OUTPUT" contradicts the Description tab.

### Step 3
- **[MAJOR] Q2: the quoted "wrong" node rule is right for this input, and the feedback names vertices that don't exist.** Input `n = 3, edges = [[0,1]]`. Claim: "Use this node rule for the graph: “Only 0, 1, and 2 because only those labels appear in an edge.”" keyed NO. For n = 3 the correct nodes ARE 0, 1, 2; and 2 does not appear in any edge, so the rule contradicts itself. Feedback: "Vertices 3, 4, and 5 still exist." — there are no such vertices. Same rule/feedback reused in Q5 (`n = 4`, all of 0–3 appear in edges; "vertices 3, 4, and 5" again) and Q1 variant 1.
- **[MINOR] Claims list edges backwards from the input.** Q1: "The correct graph has 2—1 and 1—0…" for `edges = [[0,1],[1,2]]`; Q4: "2—0 and 0—1" for `[[0,1],[1,4],[0,2],…]`.
- **[MINOR] "Right." under a red ×.** Q1 variants 1–2, Q5: "Right. A multi-step route through 1 creates reachability, not a new direct edge."

### Step 4
- **[BLOCKER] Cases 1 and 3 require node labels `"0 source"`, `"2 destination"` / `"0 source"`, `"3 destination"`; case 2 requires plain `"0"`, `"1"`.** Step 1/3 taught "Use each node's 0-based number only. Example: 2." No guide in Step 4. A student who draws 0, 1, 2 fails "× The drawing has every exact node" in case 1, and a student who then learns "0 source" fails case 2 with it. (cases 1, 3)
- **[MAJOR] Copy-pasted "Code rule" is wrong for cases 2 and 3.** All three show "Code rule: The code creates only 1→0 and 2→1." Case 2's input is `edges = [[1,0]]` (no 2→1 exists); case 3's `[[1,0],[2,1],[3,2]]` also creates 3→2.
- **[MAJOR] Same bug thrice.** "An undirected edge is stored one way" ×3; correct choice "Each undirected edge must be stored for both endpoints, changing this input's returned value." ×3. Cases 2–3 test nothing new.

### Cross-step / other
- Step 1 Q1, Q2, Q7 and the Description's Example 1 all use the same triangle `n = 3, edges = [[0,1],[1,2],[2,0]]`; fine but repetitive.

---

## Flatten Nested List Iterator (`flatten-nested-list-iterator`)

### Step 1
- **[MAJOR] The "exact picture" choices use a different node vocabulary from the drawing guide directly above them.** Q2 pictures label nodes "Outer array", "Array at [0]", "1 at [0][0]", "2 at [1]" while the guide says "Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7." A student who copies the picture labels into the next build fails. (Q2 `exact-picture`)
- **[MINOR] "What should the function return?" for a class with `next()`/`hasNext()`.** The Description defines `NestedIterator`, not a function; the build question never says "the integers returned by repeated next() calls". (Q1, Q4, Q6, Q9, remedials)
- **[MINOR] Bug-id feedback.** "…the emit shallow items first bug", "…the emit list objects bug", "…the invent default value bug", "…the emit list direct integers before nested bug".

### Step 2
- **[MAJOR] Step 1's labels are rejected and the iterator's real output cannot be expressed.** Probe with Step 1 names (`root=[]`, `root[0]=[]`, `root[0][0]=1`, …) → "Use root, root[0], root[1], ... to name nested input items." Step 2 nodes therefore carry no integer values, so "CORRECT OUTPUT" cannot be the flattened integers the problem returns; the grader wants `["root","root[0]"]` (list names, quoted, sorted). A student will type `[1,2]`. "Add node" auto-names root, root[0], root[1] but deeper names like `root[0][0]` must be typed by hand with no hint. (all 3 rounds)
- **[MINOR] Q2 Jude "follows only the last available branch" = the last-DRAWN edge out of each node.** With the harness's order (root→root[0] first, root→root[1] second) Jude keeps root[1]. A student who draws root→root[1] first gets a different "last" branch and may not expose the bug. "Edge numbers show drawing order." is the only hint.

### Step 3
- **[MAJOR] The "wrong" node rule about empty lists is keyed wrong on inputs that have no empty list.** Q2 input `[[[3]],4]`, claim "Use this node rule for the graph: “Every integer and every nonempty list, but not the empty list.”" keyed NO — but for this input that rule yields exactly the correct node set. Same in Q1 variant 1 (`[1,[1]]`, keyed YES "It would be a mistake…") and Q5 (`[[1],[2]]`). A literal student who checks the rule against the shown input gets it "wrong".
- **[MAJOR] Membership claims quote values absent from the input.** Q1 variant 0: "Only integer leaves 1, 2, and 3." for `[1,[1]]`; Q4: "One node for depth 1, one for depth 2, and one for depth 3." for `[[2],2,[2]]` (max depth 2).
- **[MINOR] Claims are walls of brackets.** "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=1, so it should also contain a direct root=[]→root[1][0]=1 edge." (Q1) — nearly unreadable for the target student.

### Step 4
- **[BLOCKER] Case 1 requires node labels `"outer list"`, `"inner list"`, `"deeper list"`, `"1"`, `"2"`, `"3"`, `"4"`; cases 2–3 require `"root=[]"`, `"root[1]=[]"`, `"root[1][1][0]=6"`, `"root[0][0][0]=3"`.** No guide in Step 4. Whichever scheme the student uses, at least one case fails "× The drawing has every exact node". (case 1 `authored-deep-case` vs cases 2–3)
- **[MAJOR] Feedback introduces a fourth naming scheme.** Case 2 "Changed graph: Nodes: root, 1, L1, 4, L2, 6. Direct arrows: root→1; root→L1; L1→4; L1→L2; L2→6."; case 3 "Nodes: root, L1, L2, 3, 4." "L1"/"L2" appear nowhere else in the lesson.
- **[MAJOR] Same bug thrice.** "Only one nesting layer is opened" ×3; correct choice "The traversal stops after opening one list level." ×3.

### Cross-step / other
- Node names across the lesson: Step 1/3 `root[1][0]=4`; Step 1 pictures "Array at [1]"; Step 2 `root[1]`; Step 4 case 1 "inner list"; Step 4 feedback "L1". Five schemes for one structure.

---

## Is Graph Bipartite? (`is-graph-bipartite`)

### Step 1
- **[MAJOR] Q7 distractor is a true statement.** Question "Which graph reasoning is correct for this case?" for `graph = [[1,3],[0,2],[1,3],[0,2]]`; choice "0 and 2 share a path" is TRUE (0—1—2). Its feedback "Only direct edges require opposite colors." refutes a claim the choice never makes. A literal student picking a true fact is marked wrong. Reword to state the misconception: "0 and 2 share a path, so they must get different colors." (Q7 `predict-output`)
- **[MAJOR] Q9's correct answer talks about "all three edges" of a five-edge graph.** Input `[[1,2,3],[0,2],[0,1,3],[0,2]]` has edges 0—1, 0—2, 0—3, 1—2, 2—3. Correct choice: "two colors cannot satisfy all three edges"; feedback "The third edge forces a same-color conflict." Only makes sense if the student has already isolated triangle 0-1-2, which the question never mentions. Distractor "put two nodes together and one apart" describes what any 2-coloring attempt of a triangle does, not a wrong belief. (Q9 `bug-trap`)
- **[MINOR] Heavy input reuse.** `[[1],[0],[3,4],[2,4],[2,3]]` is Q5's build, the bug-trap remedial build, Step 3 Q3 and Step 4 case 1; `[[],[2,3],[1,3],[1,2]]` is the core-rule remedial, Step 3 Q5 and Step 4 case 2.
- **[MINOR] Bug-id feedback.** "…the color neighbors without conflict check bug", "…the require every node to have opposite neighbor bug", "…the skip index with empty zero component bug", "…the treat tail as third group bug".

### Step 2
- **[MAJOR] Q2 description contradicts the required drawing.** "Rohan erases the outer leaves before searching." but Rohan's graph "must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none" — the leaf NODES stay, only edges touching a degree-1 node are removed. A student who deletes nodes 0 and 2 (what "erases the leaves" says) fails "× Rohan's drawing exactly shows the mistake". Say "Rohan deletes every edge that touches a leaf but keeps the nodes." (Q2 `skip-leaf-edges`)
- **[MAJOR] Q1 "Eden allows each two-way link to work only in its written order." — nothing is written; the student draws.** Direction = click order (same trap as find-if-path Q1), and Drawing 2 must have "Directed edges" ON ("must be exactly: DIRECTED · 1→0"). Nothing says so.
- **[MINOR] Q3 "Nora chooses the final listed route" — "listed" again means last-drawn.**
- **[MINOR] Step 2 never tests coloring.** "CHOOSE THE COLORING START" and "CORRECT OUTPUT" = `[0,1]` (nodes reached). Nothing about two colors or conflicts is simulated, so the lab is a plain reachability lab wearing a bipartite label.

### Step 3
- **[MAJOR] Q1 variant 2: the quoted rule is right for this input.** Input `graph = [[1],[0]]` (nodes 0, 1 only). Claim "Use this node rule for the graph: “Only nodes 0 and 1 because node 2 has no neighbors.”" keyed NO; but there is no node 2, and {0,1} is the correct node set. Feedback "An isolated node still belongs to the graph…" doesn't apply.
- **[MAJOR] Q5 quotes an edge that isn't in the input.** `graph = [[],[2,3],[1,3],[1,2]]`; claim quotes "…two separate copies for the 0—1 relationship." There is no 0—1 edge here.
- **[MINOR] Q4 rule premise false.** "Only nodes 0 and 1 because node 2 has no neighbors" for `[[1],[0,2],[1]]` where node 2 has neighbor 1.
- **[MINOR] "Correct." under ×.** Q1 variant 0, Q3: "Correct. The mini-example lists 0—1 as one direct edge."

### Step 4
- Node labels are plain digits in all three cases — the only problem in this batch where Step 4 labels match the taught format.
- **[MAJOR] Same bug thrice; cases 2 and 3 are structurally identical** (isolated 0 + odd triangle). "Only the component containing node 0 is checked" ×3; correct choice "It never starts a coloring search in unvisited components." ×3.
- **[MINOR] Awkward choice tails.** "Any cycle makes a graph non-bipartite for the shown graph." / "Using 1 and -1 as colors causes the error on the shown input."

---

## Keys and Rooms (`keys-and-rooms`)

### Step 1
- **[MAJOR] Q8 has two distractors that are true facts.** Input `rooms = [[1],[2],[3],[]]`, question "Which graph reasoning is correct for this case?". "room 0 lacks keys 2 and 3" — TRUE (room 0 holds only key 1). "there is no key back to room 0" — TRUE (no room contains key 0). Feedback "Returning to room 0 is unnecessary." doesn't deny the statement. Only B is the reasoning that *decides* the answer, but the question doesn't ask that. Reword the distractors as conclusions: "room 0 lacks keys 2 and 3, so the answer is false." (Q8 `predict-output`)
- **[MINOR] Bug-id feedback.** "…the start search in every room bug", "…the require at least one key bug", "…the count all mentioned keys as reachable bug", "…the follow only first key bug".

### Step 2
- **[MAJOR] Q1: Elena's drawing must be UNDIRECTED and nothing says so.** "Elena forgets that the listed connections have a direction." Required: "character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0". The student must switch "Directed edges" OFF in Drawing 2; "Duplicate graph from #1" copies a directed graph, so the copy fails "× Elena's drawing exactly shows the mistake". Also "listed" — nothing is listed, the student drew it. (Q1 `make-two-way`)
- **[MINOR] "CORRECT OUTPUT" wants `[0]` (rooms entered) while the problem returns `true/false`.** With "Unlocked room: 0" fixed, a student will likely type `false`.

### Step 3
- **[MINOR] Q1 variant 1 feedback doesn't fit the input.** `rooms = [[1],[0,2],[3],[]]` — every room is reachable. Claim quotes "Only rooms 0 and 1 because those are reachable from the unlocked room." (false premise) and feedback says "Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass." — here the check passes correctly.
- **[MINOR] "Correct." under ×.** Q2/Q3/Q4: "Correct. The mini-example lists 3→2 as one direct edge."

### Step 4
- **[BLOCKER] Case 1 requires node labels `"room 0"`, `"room 1"` AND an edge label `"key 0"` on room 1→room 0.** The checklist for case 1 includes "Edge labels or weights match the input"; cases 2–3 require plain `"0"`, `"1"`, `"2"` with no edge labels; Step 1/3 taught "Use each node's 0-based number only." No guide in Step 4. (case 1 `authored-deep-case`)
- **[MAJOR] Case 1's consume-key feedback is copied into cases 2–3 where it is false.** "…key consumption would not make room 1 reachable here." In cases 2 (`[[1],[],[1]]`) and 3 (`[[1],[],[0]]`) room 1 IS reachable; the unreachable room is 2.
- **[MAJOR] Same bug thrice.** "Keys are treated like two-way doors" ×3; correct choice "It invents a reverse move for every key." ×3.
- **[MINOR] Vague proof line.** Case 1 "Reachable boundary: The only useful-looking connection points into the start room."

---

## Kill Process (`kill-process`)

### Step 1
- **[MINOR] Q9 is Example 2 verbatim and duplicates Q8.** `pid = [1], ppid = [0], kill = 1` is the Description's Example 2 (answer `[1]` shown there); Q8 already built the one-node case (`pid = [7]`) with the same `[]`-vs-`[7]` choice. Distractors `[0]` and `[0,1]` are trivial. (Q9 `bug-trap`)
- **[MINOR] Q7 hands over the edges and repeats Q1.** "For edges 3→1, 3→5, and 5→10, which processes die when kill=5?" — same input and same `[5,10]`/`[3,5,10]` pair as Q1. (Q7 `predict-output`)
- **[MINOR] Bug-id feedback.** "…the kill only selected process bug", "…the include ppid zero bug", "…the stop at grandchildren bug", "…the collect only direct children bug".

### Step 2
- **[MAJOR] Q1 can only be exposed by killing a non-root process, and nothing says so.** "Yara turns every arrow into a two-way connection." Placeholder "Example: 1"; every Step 1 example kills the root or a middle node. If the student draws 1→2 and kills 1 (the root), Yara's two-way graph reaches the same set → "× The graph exposes the mistake" with no hint. The authored goal "Start at a child so an illegal upward move would terminate its parent" is hidden. Yara's drawing must also be UNDIRECTED ("must be exactly: UNDIRECTED · 2—1"), i.e. toggle "Directed edges" off in Drawing 2. (Q1 `make-two-way`)
- **[MINOR] Q2 Louis's process (`2`) is only in Drawing 2's title**, and it must sit in a different subtree from the chosen kill to expose (hidden goal "give them different subtrees").

### Step 3
- **[MINOR] Membership claims quote another input.** Q1 variant 0 and Q3 quote "Processes 0, 3, 1, and 5." for inputs `pid = [1,2,3]` and `pid = [2,6]`.
- **[MINOR] "Correct." under ×.** Q3/Q4: "Correct. The mini-example lists 2→6 as one direct edge."
- **[MINOR] Check rendering of inline code in feedback.** Harness text shows "not a running process in\npid\n." and "stored in\npid\n." — the backticked `pid` may render as its own line/block. Verify visually.

### Step 4
- **[BLOCKER] Case 1 requires node labels `"process 1"`, `"process 3"`, `"process 5"`, `"process 10"`; cases 2–3 require `"4"`, `"8"`, `"9"` and `"1"`, `"2"`, `"3"`.** Step 1/3 taught "Use the exact ID from the input only. Example: 15." No guide in Step 4. (case 1 `authored-deep-case`)
- **[MAJOR] Output order is enforced although the problem says any order.** Description: "The IDs may be returned in any order." Output box: `[3,5]` accepted, `[5,3]` rejected ("× The incorrect solution's exact output is correct"). Either accept any order or tell the student "type the array in the order the code builds it".
- **[MAJOR] Same bug thrice.** "Only direct children are killed" ×3; correct choice "It takes one child step instead of the full descendant subtree." ×3.

---

## Letter Combinations of a Phone Number (`letter-combinations-of-a-phone-number`)

### Step 1
- **[MINOR] `digits = ""` is asked three times with the same `[]` vs `[""]` pair** (Q8 bug-trap, Q9 build-empty, predict-output remedial). Q8's wording "What result belongs at the root when digits = ""?" is odd — nothing "belongs at the root".
- **[MINOR] "unique" flags the correct remedial answer.** Bug-trap remedial choices: "3 unique combinations | 2 combinations" — only the correct one says "unique".
- **[MINOR] No Step 1 build ever draws a two-digit tree.** Builds use "2", "7", "3", "" (all one-level stars from "empty prefix"); Q3/Q5/Q7 ask about "23" but the student never draws a partial string like `ad` until Step 4 demands 13–16 of them.
- **[MINOR] Bug-id feedback.** "…the drop last keypad letter bug", "…the use previous keypad row bug", "…the emit empty prefix bug", "…the merge sibling prefixes bug".

### Step 2
- **[MAJOR] Step 1's root label is rejected and the replacement is untypeable.** Probe with Step 1 names ("empty prefix", "a", "b", "c") → "Use ε for the empty root, then lowercase partial strings like a or ab." The start field is prefilled "ε" read-only and "Add node" auto-names the first node ε, but a student who renames it to "empty prefix" (as Step 1 taught) cannot type ε back on a normal keyboard. (all 3 rounds)
- **[MAJOR] The output must list ε LAST.** Expected `["a","ab","ε"]`; `["ε","a"]` was rejected. The sort is `localeCompare`, which puts the Greek letter after all Latin letters — a student naturally writes the root first. Nothing explains the order. (all 3 rounds)
- **[MINOR] Hidden shape rules.** There is no digit string in Step 2; the validator silently requires every node's parent prefix to exist (node minus its last letter) and "Phone-number prefixes use at most 4 letters." Neither is shown before the error.
- **[MINOR] "CORRECT OUTPUT" includes ε and internal prefixes**, e.g. `["a","ab","ε"]`, whereas the problem's answer for that tree would be `["ab"]`.

### Step 3
- **[MAJOR] Q4 (`digits = ""`) claims are nonsense for a one-node graph.** "Because empty prefix can reach itself, the graph should contain a direct empty prefix→empty prefix edge." and membership "Use this node rule for the graph: “Only the digit 2 or digit 3, so the tree has two nodes.”" — there are no digits at all in this input.
- **[MINOR] Every Step 3 input is one digit or empty, so every direct-vs-reach claim is trivial** (no two-step route exists), e.g. "empty prefix can reach o, but there is no direct empty prefix→o edge." Wrong-feedback "Correct. The mini-example lists empty prefix→y as one direct edge." is under a × and the input (`digits = "9"`) lists no edges.
- **[MINOR] Q1/Q3 quote "Only complete two-letter answers such as `ad` and `cf`"** for inputs "9" and "7".

### Step 4
- **[BLOCKER] The root must be labeled `"start"`.** Step 1/3 taught "Use empty prefix for the root"; Step 2 required "ε"; Step 4 requires "start" with no guide. Every case fails "× The drawing has every exact node" for a student using either taught name. (all 3 cases)
- **[MAJOR] Drawing volume.** Case 1: 13 nodes / 12 edges; case 2 (`"27"`): 16 nodes / 15 edges (`ap`,`aq`,`ar`,`as`,`bp`,…,`cs`); case 3: 13 / 12 — all typed exactly, three times, for the same bug. This is far heavier than anything in Steps 1–3 (max 5 nodes).
- **[MAJOR] Same bug thrice.** "The search stops after one digit" ×3; correct choice "It declares prefixes complete at depth 1 instead of at digits.length." ×3.
- **[MINOR] Output order enforced despite "You may return the answers in any order."** `["c","b","a"]` rejected; only `["a","b","c"]` passes.
- **[MINOR] Artificial code.** `if (index === Math.min(1, digits.length))` — the `Math.min` is there only to make the bug; a student may waste time wondering what it's for.

### Cross-step / other
- Root label: "empty prefix" (Step 1/3) → "ε" (Step 2) → "start" (Step 4). Three names, none announced when it changes.

---

## One-line summary of every finding in this batch
- [BLOCKER] evaluate-division S1: edge weights graded as hidden exact strings in mixed formats ("0.5" vs "1/3"); screen never says weights are required or how to label an edge
- [MAJOR] evaluate-division S1: wrong-answer feedback is bug-id jargon ("reject zero edge path bug", "unknown self or target equals one bug")
- [MINOR] evaluate-division S1: remedial choice shown as 0.16666666666666666 instead of 1/6
- [MAJOR] evaluate-division S2: Step 1 teaches two arrows per equation; drawing that makes drop-last-edge (Q1) and wrong-start (Q3) unexposable, with hidden "different component" goal
- [MAJOR] evaluate-division S2: "OUTPUT" of a division query is a number, grader wants quoted variable list; no denominator chosen
- [BLOCKER] evaluate-division S3: same hidden weight-string requirement on all 5 graphs
- [MAJOR] evaluate-division S3: Q2 feedback "The mini-example lists n→m as one direct edge" — input lists only m/n
- [MAJOR] evaluate-division S3: membership claims quote values from other inputs ("2 and 3" for values [2,4]; "a/b, b/c" for p,q,r)
- [MINOR] evaluate-division S3: "Right."/"Correct." shown under red ×
- [BLOCKER] evaluate-division S4: case 1 requires edge labels "×2" and "×1/2" (untypeable ×), cases 2–3 "2"/"0.5"; no guide
- [MAJOR] evaluate-division S4: same bug and same correct sentence in all 3 cases
- [MAJOR] evaluate-division S4: "Code rule: Both directions receive weight 2." copied into cases with values [2,3] and [4]
- [MINOR] evaluate-division S4: correct output shown as [0.16666666666666666]
- [MAJOR] find-if-path-exists-in-graph S1: Q9 question names "components {0,1,2} and {3,4,5}", giving away the answer
- [MINOR] find-if-path-exists-in-graph S1: Q7 choices are fragments ("through 0→1→2; the direct pair cannot be used")
- [MINOR] find-if-path-exists-in-graph S1: bug-id feedback ("assume all listed vertices connect bug")
- [MAJOR] find-if-path-exists-in-graph S2: Q1 Lila's arrow direction = click order of an undirected edge; Drawing 2 must have arrows ON; neither stated
- [MINOR] find-if-path-exists-in-graph S2: Q3 Esme's source "1" hidden until Drawing 2; must be in a different component to expose
- [MINOR] find-if-path-exists-in-graph S2: output box wants [0,1] though problem returns true/false
- [MAJOR] find-if-path-exists-in-graph S3: Q2/Q5 quoted rule "Only 0, 1, and 2…" is correct for n=3; feedback cites nonexistent "Vertices 3, 4, and 5"
- [MINOR] find-if-path-exists-in-graph S3: claims list edges reversed vs input ("2—1 and 1—0")
- [MINOR] find-if-path-exists-in-graph S3: "Right." under red ×
- [BLOCKER] find-if-path-exists-in-graph S4: cases 1/3 require labels "0 source", "2 destination"/"3 destination"; case 2 plain digits; no guide
- [MAJOR] find-if-path-exists-in-graph S4: "Code rule: The code creates only 1→0 and 2→1." copied into cases where it is false
- [MAJOR] find-if-path-exists-in-graph S4: same bug and correct sentence in all 3 cases
- [MAJOR] flatten-nested-list-iterator S1: Q2 pictures use "Outer array / Array at [0] / 1 at [0][0]" while guide demands root=[] / root[0]=[] / root[0][0]=1
- [MINOR] flatten-nested-list-iterator S1: "What should the function return?" for an iterator class
- [MINOR] flatten-nested-list-iterator S1: bug-id feedback ("emit list direct integers before nested bug")
- [MAJOR] flatten-nested-list-iterator S2: Step 1 labels rejected ("Use root, root[0]…"); nodes carry no values so "CORRECT OUTPUT" cannot be the flattened integers
- [MINOR] flatten-nested-list-iterator S2: Q2 "last branch" = last-drawn edge; drawing order decides exposure
- [MAJOR] flatten-nested-list-iterator S3: "not the empty list" rule keyed wrong on inputs with no empty list (Q1 v1, Q2, Q5)
- [MAJOR] flatten-nested-list-iterator S3: claims quote "1, 2, and 3" for [1,[1]] and "depth 3" for [[2],2,[2]]
- [MINOR] flatten-nested-list-iterator S3: claims are unreadable bracket walls
- [BLOCKER] flatten-nested-list-iterator S4: case 1 requires "outer list"/"inner list"/"deeper list"/"1".."4"; cases 2–3 require root=[] style; no guide
- [MAJOR] flatten-nested-list-iterator S4: feedback introduces "L1"/"L2" node names used nowhere else
- [MAJOR] flatten-nested-list-iterator S4: same bug and correct sentence in all 3 cases
- [MAJOR] is-graph-bipartite S1: Q7 distractor "0 and 2 share a path" is a true statement
- [MAJOR] is-graph-bipartite S1: Q9 correct choice "all three edges" on a five-edge graph; "put two nodes together and one apart" is not a wrong belief
- [MINOR] is-graph-bipartite S1: same two inputs reused across Q5, remedials, S3 Q3/Q5, S4 cases 1–2
- [MINOR] is-graph-bipartite S1: bug-id feedback ("skip index with empty zero component bug")
- [MAJOR] is-graph-bipartite S2: Q2 "Rohan erases the outer leaves" but required drawing keeps nodes 0,1,2 and removes edges
- [MAJOR] is-graph-bipartite S2: Q1 "written order" — nothing is written; direction = click order; Drawing 2 must be directed
- [MINOR] is-graph-bipartite S2: Q3 "final listed route" means last-drawn edge
- [MINOR] is-graph-bipartite S2: lab never simulates coloring; "CORRECT OUTPUT" is [0,1]
- [MAJOR] is-graph-bipartite S3: Q1 v2 quoted rule "Only nodes 0 and 1 because node 2 has no neighbors" on graph [[1],[0]] (no node 2; rule is correct there)
- [MAJOR] is-graph-bipartite S3: Q5 quotes "0—1 relationship" absent from input [[],[2,3],[1,3],[1,2]]
- [MINOR] is-graph-bipartite S3: Q4 rule premise false (node 2 has a neighbor); "Correct." under ×
- [MAJOR] is-graph-bipartite S4: same bug thrice; cases 2 and 3 structurally identical
- [MINOR] is-graph-bipartite S4: awkward choice tails "…for the shown graph"
- [MAJOR] keys-and-rooms S1: Q8 distractors "room 0 lacks keys 2 and 3" and "there is no key back to room 0" are true facts
- [MINOR] keys-and-rooms S1: bug-id feedback ("count all mentioned keys as reachable bug")
- [MAJOR] keys-and-rooms S2: Q1 Elena's drawing must be UNDIRECTED (toggle off) — not stated; "listed connections" nothing is listed
- [MINOR] keys-and-rooms S2: "CORRECT OUTPUT" wants [0] not true/false
- [MINOR] keys-and-rooms S3: Q1 v1 feedback "Room 2 still exists…" on an input where room 2 is reachable; "Correct." under ×
- [BLOCKER] keys-and-rooms S4: case 1 requires "room 0", "room 1" and edge label "key 0"; cases 2–3 plain digits; no guide
- [MAJOR] keys-and-rooms S4: consume-key feedback "would not make room 1 reachable" copied into cases where room 1 is reachable
- [MAJOR] keys-and-rooms S4: same bug and correct sentence in all 3 cases
- [MINOR] keys-and-rooms S4: vague "Reachable boundary: The only useful-looking connection points into the start room."
- [MINOR] kill-process S1: Q9 is Example 2 verbatim and duplicates Q8; Q7 repeats Q1 with edges given
- [MINOR] kill-process S1: bug-id feedback ("include ppid zero bug")
- [MAJOR] kill-process S2: Q1 exposable only by killing a non-root process (hidden goal); Yara's drawing must be UNDIRECTED
- [MINOR] kill-process S2: Q2 Louis's process "2" hidden until Drawing 2; must be in a different subtree
- [MINOR] kill-process S3: claims quote "Processes 0, 3, 1, and 5" for pid=[1,2,3]/[2,6]; "Correct." under ×; check `pid` inline-code rendering
- [BLOCKER] kill-process S4: case 1 requires "process 1", "process 3", "process 5", "process 10"; cases 2–3 plain IDs; no guide
- [MAJOR] kill-process S4: problem says "any order" but [5,3] rejected, only [3,5] accepted
- [MAJOR] kill-process S4: same bug and correct sentence in all 3 cases
- [MINOR] letter-combinations-of-a-phone-number S1: digits="" asked three times; "What result belongs at the root" wording
- [MINOR] letter-combinations-of-a-phone-number S1: "3 unique combinations" — "unique" only on the correct choice
- [MINOR] letter-combinations-of-a-phone-number S1: no build ever draws a two-digit tree though Q3/Q5/Q7 ask about "23"
- [MINOR] letter-combinations-of-a-phone-number S1: bug-id feedback ("use previous keypad row bug")
- [MAJOR] letter-combinations-of-a-phone-number S2: Step 1 root "empty prefix" rejected; required "ε" cannot be typed if renamed
- [MAJOR] letter-combinations-of-a-phone-number S2: output must list ε last (["a","ab","ε"]); ["ε","a"] rejected; order unexplained
- [MINOR] letter-combinations-of-a-phone-number S2: hidden shape rules (parent prefix must exist, max 4 letters); no digits in the lab
- [MINOR] letter-combinations-of-a-phone-number S2: "CORRECT OUTPUT" includes ε and internal prefixes, not the problem's answer
- [MAJOR] letter-combinations-of-a-phone-number S3: Q4 (digits="") claims about a self-edge and "digit 2 or digit 3" on a one-node graph
- [MINOR] letter-combinations-of-a-phone-number S3: all inputs single-digit so direct-vs-reach claims are trivial; "Correct. The mini-example lists empty prefix→y" under ×
- [MINOR] letter-combinations-of-a-phone-number S3: Q1/Q3 quote "ad and cf" for digits "9"/"7"
- [BLOCKER] letter-combinations-of-a-phone-number S4: root must be labeled "start" (Step 1 said "empty prefix", Step 2 "ε"); no guide
- [MAJOR] letter-combinations-of-a-phone-number S4: 13–16 exactly-typed nodes per case, three times, for one bug
- [MAJOR] letter-combinations-of-a-phone-number S4: same bug and correct sentence in all 3 cases
- [MINOR] letter-combinations-of-a-phone-number S4: "any order" in statement but ["c","b","a"] rejected; artificial Math.min(1, …) in code
