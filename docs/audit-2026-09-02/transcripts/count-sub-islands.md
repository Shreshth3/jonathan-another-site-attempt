# Count Sub Islands (`count-sub-islands`) — new, grid

## Problem statement (Description tab)

You are given two grids of the same size, `grid1` and `grid2`. In both, `1` is land and `0` is water, and an island is a group of 1s connected up, down, left, or right.

An island in `grid2` is called a "sub-island" if EVERY one of its cells is also a land cell in `grid1` (at the same positions).

Return how many islands of `grid2` are sub-islands.

### Examples
- Example 1: input `grid1 = [[1,1,0],[0,1,1],[0,0,0]], grid2 = [[1,0,0],[0,1,1],[0,1,0]]` → output `1`. grid2 has two islands: {(0,0)} and {(1,1), (1,2), (2,1)}. The first one sits on land in grid1 (grid1[0][0] = 1), so it is a sub-island. The second fails because grid1[2][1] = 0. Answer: 1.
- Example 2: input `grid1 = [[1,1],[1,1]], grid2 = [[1,0],[0,1]]` → output `2`. grid2 has two single-cell islands, at (0,0) and (1,1). grid1 is all land, so both are sub-islands. Answer: 2.

### Graph rules (authored)
- Nodes: Every land cell in grid2.
- Edges: They touch up, down, left, or right in grid2.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).

### HARNESS-DETECTED ERRORS
- step1: step1 task 8 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "grid2 land")
Raw input shown:
```
grid1=[[1,1],[1,1]], grid2=[[1,0],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Every grid2 land cell is supported by grid1 land.
- ❌ [wrong] "0"
    feedback: That follows the reject multi cell island bug. (misconception: reject-multi-cell-island)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
"Why" shown after success: Every grid2 land cell is supported by grid1 land.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "grid2 land")
Raw input shown:
```
grid1=[[1,1],[1,1]], grid2=[[1,0],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (1,0) / (1,1)
2. Picture B / (0,0) / (1,0)
3. Picture C / (0,0) / (1,0) / (1,1)
4. Picture D / (0,0) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)—(1,0), (1,0)—(1,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (1,0) · edges: (0,0)—(1,0)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)—(1,0)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)→(1,0), (1,0)→(1,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which cells form the islands that are being judged?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells form the islands that are being judged?**
Choices as displayed (top to bottom):
1. A / Only positions that are land in both grids.
2. B / Every land cell in grid1.
3. C / Every land cell in grid2.
4. D / Only grid2 land cells sitting over grid1 water.
Answer key + feedback per choice (data):
- ✅ CORRECT [grid2-land] "Every land cell in grid2."
    feedback: Right. First find each complete grid2 island, then compare its cells with grid1.
- ❌ [both-land] "Only positions that are land in both grids."
    feedback: Removing a bad grid2 cell can split or hide an island that should fail as a whole. (misconception: filters-before-flood-fill)
- ❌ [grid1-land] "Every land cell in grid1."
    feedback: The counted islands belong to grid2, not grid1. (misconception: searches-wrong-grid)
- ❌ [mismatches] "Only grid2 land cells sitting over grid1 water."
    feedback: Those cells mark failure, but they are not the whole island graph. (misconception: uses-only-invalid-cells)
"Why" shown after success: Right. First find each complete grid2 island, then compare its cells with grid1.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid1=[[1,0],[1,1]], grid2=[[1,1],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The one grid2 island includes unsupported cell (0,1).
- ❌ [wrong] "1"
    feedback: That follows the check first cell only bug. (misconception: check-first-cell-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
"Why" shown after success: The one grid2 island includes unsupported cell (0,1).
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
How do two grid2 land nodes join the same island?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How do two grid2 land nodes join the same island?**
Choices as displayed (top to bottom):
1. A / They share a side and both positions must also be land in grid1.
2. B / They touch by a side or corner in grid2.
3. C / They touch up, down, left, or right in grid2.
4. D / Their surrounding 3×3 patterns match in both grids.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "They touch up, down, left, or right in grid2."
    feedback: Right. Grid1 changes validity, not grid2 connectivity.
- ❌ [both-grids] "They share a side and both positions must also be land in grid1."
    feedback: A bad overlap still remains part of its grid2 island and makes it fail. (misconception: changes-connectivity-with-grid1)
- ❌ [eight] "They touch by a side or corner in grid2."
    feedback: Diagonal cells belong to separate islands here. (misconception: allows-diagonals)
- ❌ [matching-shape] "Their surrounding 3×3 patterns match in both grids."
    feedback: Only direct side contact defines an island edge. (misconception: compares-neighborhoods)
"Why" shown after success: Right. Grid1 changes validity, not grid2 connectivity.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
grid1=[[1,1],[1,1]], grid2=[[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Diagonal land cells are separate islands.
- ❌ [wrong] "1"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal land cells are separate islands.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "full support")
Raw input shown:
```
grid1 = [[1,1,0],[0,1,1],[0,0,0]], grid2 = [[1,0,0],[0,1,1],[0,1,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For grid1 [[1,1,0],[0,1,1],[0,0,0]] and grid2 [[1,0,0],[0,1,1],[0,1,0]], how many sub-islands are there?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 1
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: The larger grid2 island contains a cell over grid1 water. (misconception: checks-some-cells-only)
- ❌ [wrong-2] "3"
    feedback: Grid2 has only two islands, not three. (misconception: counts-cells-as-islands)
- ❌ [wrong-3] "0"
    feedback: The single cell at (0,0) is fully supported by grid1 land. (misconception: rejects-valid-single-cell)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "full support")
Raw input shown:
```
grid1 = [[1,1],[1,1]], grid2 = [[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If grid1 is all land and grid2 is [[1,0],[0,1]], how many sub-islands are there?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 0
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: Diagonal land cells are separate islands. (misconception: allows-diagonals)
- ❌ [wrong-2] "0"
    feedback: Both single-cell islands sit on grid1 land. (misconception: rejects-single-cell-islands)
- ❌ [wrong-3] "4"
    feedback: The answer counts grid2 islands, not all grid1 land cells. (misconception: counts-grid1-cells)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "full support")
Raw input shown:
```
grid1=[[0]], grid2=[[0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Grid2 contains no island.
- ❌ [wrong] "1"
    feedback: That follows the count grid1 not grid2 bug. (misconception: count-grid1-not-grid2)
Graph the grader requires (hidden from student): UNDIRECTED · nodes:  · edges: none
"Why" shown after success: Grid2 contains no island.
Result when solved correctly through the UI: **FAILED / DEAD END** Correct graph has ZERO nodes; answer buttons stay disabled (student cannot answer without drawing a wrong node) · (answer buttons were disabled until a node was drawn)

Completion screen text: ```
FINISHED
Step 1 finished.

8 passed · 1 skipped.

Start Step 2
→
Choose another problem
Practice Step 1 again
```
Progress strip after answering every concept question WRONG and then passing each remedial build: "8 OF 9 VISUAL CHECKS PASSED" · "5 CORRECTIONS"

### S1 remedial builds (shown after a wrong concept answer)
#### After answering concept `exact-picture` wrong with choice [omit]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Picture A
Your choice: This drops an item that still belongs in the picture.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid1=[[1,1,0]], grid2=[[1,1,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. One unsupported cell rejects the whole island.; ❌ "1" — That follows the accept partially supported island bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [both-land]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every land cell in grid2.
Your choice: Removing a bad grid2 cell can split or hide an island that should fail as a whole.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid1=[[1,0,1]], grid2=[[1,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The two supported cells are separate islands.; ❌ "1" — That follows the merge across water bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [both-grids]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
They touch up, down, left, or right in grid2.
Your choice: A bad overlap still remains part of its grid2 island and makes it fail.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid1=[[1],[1],[0]], grid2=[[1],[1],[1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. The bottom unsupported cell invalidates the connected island.; ❌ "1" — That follows the stop checking before last cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: The larger grid2 island contains a cell over grid1 water.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid1=[[1,0],[0,1]], grid2=[[1,0],[0,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 0
Remedial answer key: ✅ "2" — Correct. Each single grid2 land cell is fully supported.; ❌ "0" — That follows the reject single cell islands bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: Diagonal land cells are separate islands.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid1=[[1,1],[0,1]], grid2=[[1,1],[0,0]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. The two adjacent cells form one sub-island.; ❌ "2" — That follows the count cells not islands bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Missing shoreline link"; authored goal, NOT shown to student: "Make the last side link decide whether all cells are checked.")
Everything the student sees (text):
```
A
Abraham's broken search

Abraham stops reading one relation too early and drops the final edge.

Your main goal: Expose Abraham's mistake. Draw two graphs: first the correct graph, then Abraham's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
ABRAHAM’S OUTPUT
Drawing 1 of 2: Correct graph · Choose island seed
Directed edges
＋
Add node
Edge width
4px
Rename
Color
Clear
＋
Use “Add node” above.
1 · Correct graph
2 · Abraham's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ABRAHAM’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("(0,0)", "(1,0)", "(1,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0), (0,1), (0,2)`; ❌ curly braces → `{(0,0),(0,1),(0,2)}`; ✅ quoted numbers/strings → `["(0,0)","(0,1)","(0,2)"]`; ❌ reversed order → `["(0,2)","(0,1)","(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" , "(0,1)" , "(0,2)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0),(0,1),(0,2)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
ABRAHAM'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `add-diagonals` (authored level "False island merge"; authored goal, NOT shown to student: "Keep corner-touching grid2 land in separate islands.")
Everything the student sees (text):
```
A
Annabelle's broken search

Annabelle adds diagonal moves that the real graph does not have.

Your main goal: Expose Annabelle's mistake. Draw two graphs: first the correct graph, then Annabelle's graph using the mistake.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
ANNABELLE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose island seed
Directed edges
＋
Add node
Edge width
4px
Rename
Color
Clear
＋
Use “Add node” above.
1 · Correct graph
2 · Annabelle's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ANNABELLE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
ANNABELLE'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong island seed"; authored goal, NOT shown to student: "Make the declared seed differ from the first land cell.")
Everything the student sees (text):
```
G
Grayson's broken search

Grayson uses the wrong island seed.

Your main goal: Expose Grayson's mistake. Draw two graphs: first the correct graph, then Grayson's graph using the mistake.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
GRAYSON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose island seed
Directed edges
＋
Add node
Edge width
4px
Rename
Color
Clear
＋
Use “Add node” above.
1 · Correct graph
2 · Grayson's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | GRAYSON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,1)\",\"(0,2)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,1)","(0,2)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
GRAYSON'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

Completion screen: ```
DISPROVEN
Step 2 complete.
Start Step 3
→
Choose another problem
Practice Step 2 again
```

## STEP 3 · Graph structure (5 questions; claims are generated, "variant" changes after a wrong check)

### S3 Q1
Raw input shown:
```
grid1=[[1,1],[0,1]], grid2=[[1,1],[0,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)—(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only positions that are land in both grids.”"
    feedback if wrong: Removing a bad grid2 cell can split or hide an island that should fail as a whole. Correct node rule: Every land cell in grid2.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
×
(0,0) has 1 direct neighbor.
×
Removing a bad grid2 cell can split or hide an island that should fail as a whole. Correct node rule: Every land cell in grid2.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Every land cell in grid1.”"
    feedback if wrong: The counted islands belong to grid2, not grid1. Correct node rule: Every land cell in grid2.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)—(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The counted islands belong to grid2, not grid1. Correct node rule: Every land cell in grid2.
×
The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
×
(0,1) has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only grid2 land cells sitting over grid1 water.”"
    feedback if wrong: Those cells mark failure, but they are not the whole island graph. Correct node rule: Every land cell in grid2.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)—(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
✓
Edge direction matches
Use this graph model

Other graph models can be valid, but this checker expects this one.

NODES
Every land cell in grid2.
EDGES
They touch up, down, left, or right in grid2.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid1=[[1,1,0]], grid2=[[1,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Every land cell in grid1.”"
    feedback if wrong: The counted islands belong to grid2, not grid1. Correct node rule: Every land cell in grid2.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,2)—(0,1) and (0,1)—(0,0), so it should also contain a direct (0,2)—(0,0) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid1=[[1,0,1]], grid2=[[1,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only positions that are land in both grids.”"
    feedback if wrong: Removing a bad grid2 cell can split or hide an island that should fail as a whole. Correct node rule: Every land cell in grid2.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid1=[[1],[1],[0]], grid2=[[1],[1],[1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (2,0)—(1,0) and (1,0)—(0,0), so it should also contain a direct (2,0)—(0,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(2,0) has exactly 0 direct neighbors."
    feedback if wrong: (2,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only grid2 land cells sitting over grid1 water.”"
    feedback if wrong: Those cells mark failure, but they are not the whole island graph. Correct node rule: Every land cell in grid2.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid1=[[1,0],[0,1]], grid2=[[1,0],[0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every land cell in grid1.”"
    feedback if wrong: The counted islands belong to grid2, not grid1. Correct node rule: Every land cell in grid2.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (1,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Result: PASSED

Completion screen: ```
DEFINED
Step 3 complete.

You built 5 different graphs and checked 15 useful claims.

Start Step 4
→
Choose another problem
Practice Step 3 again
```

## STEP 4 · Trace lab (3 code cases)

### S4 case 1 — `authored-deep-case` · bug: Only the island's first cell is validated
Input shown:
```
REAL PROBLEM INPUT
grid1: [[1, 1], [1, 0]]
grid2: [[1, 1], [1, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countSubIslands(grid1, grid2) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function erase(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid2, nextRow, nextColumn) &&
          grid2[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  for (let row = 0; row < grid2.length; row++) {
    for (let column = 0; column < grid2[0].length; column++) {
      if (grid2[row][column] === 1 && !visited.has(`${row},${column}`)) {
        const valid = grid1[row][column] === 1;
        erase(row, column);
        if (valid) {
          answer++;
        }
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A valid is read only at the component's first cell, so a later mismatching cell never invalidates the island.
- B The traversal should turn visited grid2 land into water instead of using seen on the shown input.
- C The code should also connect diagonally touching grid2 land for the shown graph.
Diagnosis answer key + feedback:
- ❌ [mutates-grid2] "The traversal should turn visited grid2 land into water instead of using seen on the shown input." — feedback: Either marking method works; validation of all component cells is missing.
- ✅ [checks-root-only] "valid is read only at the component's first cell, so a later mismatching cell never invalidates the island." — feedback: Exactly. One bad cell makes the whole component fail.
- ❌ [diagonal-rule] "The code should also connect diagonally touching grid2 land for the shown graph." — feedback: Sub-islands use side adjacency only; the component edges are correct.
Graph proof shown in feedback: code rule "The whole component is erased, but grid1 is checked only at the DFS seed." → changed graph "All four grid2 land cells form one side-connected square component." → boundary "The seed overlaps grid1 land while node (1,1) overlaps water." → returned value "The code counts the component as one sub-island; the real answer rejects it and returns zero."
Output-format probes: ❌ quoted number → `"1"`; ❌ trailing period → `1.`
Feedback after a wrong diagnosis:
```
Check the graph and try again.
✓
The drawing has every exact node
✓
The drawing has every exact edge
✓
The drawing uses the problem's direction
×
The graph-level diagnosis is correct
✓
The incorrect solution's exact output is correct
About your diagnosis: Either marking method works; validation of all component cells is missing.
Code rule: The whole component is erased, but grid1 is checked only at the DFS seed. → Changed graph: All four grid2 land cells form one side-connected square component. → Reachable boundary: The seed overlaps grid1 land while node (1,1) overlaps water.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the island's first cell is validated
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: The whole component is erased, but grid1 is checked only at the DFS seed. → Changed graph: All four grid2 land cells form one side-connected square component. → Reachable boundary: The seed overlaps grid1 land while node (1,1) overlaps water. → Returned value: The code counts the component as one sub-island; the real answer rejects it and returns zero.
```

### S4 case 2 — `build-2` · bug: Only the island's first cell is validated
Input shown:
```
REAL PROBLEM INPUT
grid1=[[1,0],[1,1]], grid2=[[1,1],[1,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countSubIslands(grid1, grid2) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function erase(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid2, nextRow, nextColumn) &&
          grid2[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  for (let row = 0; row < grid2.length; row++) {
    for (let column = 0; column < grid2[0].length; column++) {
      if (grid2[row][column] === 1 && !visited.has(`${row},${column}`)) {
        const valid = grid1[row][column] === 1;
        erase(row, column);
        if (valid) {
          answer++;
        }
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The traversal should turn visited grid2 land into water instead of using seen on the shown input.
- B valid is read only at the component's first cell, so a later mismatching cell never invalidates the island.
- C The code should also connect diagonally touching grid2 land for the shown graph.
Diagnosis answer key + feedback:
- ❌ [mutates-grid2] "The traversal should turn visited grid2 land into water instead of using seen on the shown input." — feedback: Either marking method works; validation of all component cells is missing.
- ✅ [checks-root-only] "valid is read only at the component's first cell, so a later mismatching cell never invalidates the island." — feedback: Correct. Cell (1,1) belongs to grid2's component but is water in grid1, so checking only root (0,0) wrongly counts the component.
- ❌ [diagonal-rule] "The code should also connect diagonally touching grid2 land for the shown graph." — feedback: Sub-islands use side adjacency only; the component edges are correct.
Graph proof shown in feedback: code rule "The whole component is erased, but grid1 is checked only at the DFS seed." → changed graph "All four grid2 land cells form one 2-by-2 side-connected component." → boundary "The component starts on valid (0,0) but includes invalid grid1 water at (1,1)." → returned value "The shown code returns 1; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the island's first cell is validated
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: The whole component is erased, but grid1 is checked only at the DFS seed. → Changed graph: All four grid2 land cells form one 2-by-2 side-connected component. → Reachable boundary: The component starts on valid (0,0) but includes invalid grid1 water at (1,1). → Returned value: The shown code returns 1; the real problem returns 0.
```

### S4 case 3 — `repair-1` · bug: Only the island's first cell is validated
Input shown:
```
REAL PROBLEM INPUT
grid1=[[1,1,0]], grid2=[[1,1,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countSubIslands(grid1, grid2) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function erase(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid2, nextRow, nextColumn) &&
          grid2[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  for (let row = 0; row < grid2.length; row++) {
    for (let column = 0; column < grid2[0].length; column++) {
      if (grid2[row][column] === 1 && !visited.has(`${row},${column}`)) {
        const valid = grid1[row][column] === 1;
        erase(row, column);
        if (valid) {
          answer++;
        }
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The traversal should turn visited grid2 land into water instead of using seen on the shown input.
- B The code should also connect diagonally touching grid2 land for the shown graph.
- C valid is read only at the component's first cell, so a later mismatching cell never invalidates the island.
Diagnosis answer key + feedback:
- ❌ [mutates-grid2] "The traversal should turn visited grid2 land into water instead of using seen on the shown input." — feedback: Either marking method works; validation of all component cells is missing.
- ✅ [checks-root-only] "valid is read only at the component's first cell, so a later mismatching cell never invalidates the island." — feedback: Correct. Cell (0,2) extends the grid2 component onto water in grid1, so the whole component must fail instead of being counted.
- ❌ [diagonal-rule] "The code should also connect diagonally touching grid2 land for the shown graph." — feedback: Sub-islands use side adjacency only; the component edges are correct.
Graph proof shown in feedback: code rule "The whole component is erased, but grid1 is checked only at the DFS seed." → changed graph "Grid2's row has nodes (0,0)—(0,1)—(0,2) in one component." → boundary "The row component starts on valid (0,0) but ends on invalid grid1 water at (0,2)." → returned value "The shown code returns 1; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the island's first cell is validated
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: The whole component is erased, but grid1 is checked only at the DFS seed. → Changed graph: Grid2's row has nodes (0,0)—(0,1)—(0,2) in one component. → Reachable boundary: The row component starts on valid (0,0) but ends on invalid grid1 water at (0,2). → Returned value: The shown code returns 1; the real problem returns 0.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```