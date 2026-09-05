# Connected Cells in a Grid (`hackerrank-connected-cells`) — new, grid

## Problem statement (Description tab)

You are given a grid of 0s and 1s called `grid`.

Two cells containing 1 belong to the same "region" if they touch horizontally, vertically, OR diagonally.

Return the number of cells in the largest region of 1s. If there are no 1s, return 0.

### Examples
- Example 1: input `grid = [[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]` → output `5`. Cells (0,0), (0,1), (1,1), (1,2), (2,2) all connect into one region of size 5 (some touch diagonally). The lone 1 at (3,0) is a region of size 1. The largest is 5.
- Example 2: input `grid = [[1,0,1],[0,1,0],[1,0,1]]` → output `5`. The center cell (1,1) touches all four corner 1s diagonally, so all five 1s form one region of size 5.

### Graph rules (authored)
- Nodes: Each cell containing 1.
- Edges: Any pair touching by a side or a corner.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).

### HARNESS-DETECTED ERRORS
- step1: step1 task 7 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "one-cells")
Raw input shown:
```
grid=[[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The diagonal 1 cells belong to one region.
- ❌ [wrong] "1"
    feedback: That follows the use four directions bug. (misconception: use-four-directions)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: (0,0)—(1,1)
"Why" shown after success: The diagonal 1 cells belong to one region.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "one-cells")
Raw input shown:
```
grid=[[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0)
2. Picture C / (0,0) / (1,1)
3. Picture A / (0,0) / (1,1)
4. Picture D / (0,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0) · edges: none
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (1,1) · edges: none
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (1,1) · edges: (0,0)→(1,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid=[[1,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The zero splits the two cells.
- ❌ [wrong] "2"
    feedback: That follows the jump across zero bug. (misconception: jump-across-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
"Why" shown after success: The zero splits the two cells.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
What is one node when measuring a region?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node when measuring a region?**
Choices as displayed (top to bottom):
1. A / Every 0 and 1 cell.
2. B / Each row containing at least one 1.
3. C / Each completed region of 1s.
4. D / Each cell containing 1.
Answer key + feedback per choice (data):
- ✅ CORRECT [ones] "Each cell containing 1."
    feedback: Right. A region's size is its number of land-cell nodes.
- ❌ [all] "Every 0 and 1 cell."
    feedback: Zero cells are outside every region. (misconception: includes-zero-cells)
- ❌ [row] "Each row containing at least one 1."
    feedback: Several separate regions can occupy one row. (misconception: uses-rows-as-nodes)
- ❌ [region] "Each completed region of 1s."
    feedback: A region is a component made from cell nodes. (misconception: confuses-region-with-node)
"Why" shown after success: Right. A region's size is its number of land-cell nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "eight-way edges")
Raw input shown:
```
Which neighboring 1 cells are directly connected?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which neighboring 1 cells are directly connected?**
Choices as displayed (top to bottom):
1. A / Only pairs touching up, down, left, or right.
2. B / Only pairs touching at a corner.
3. C / Any two 1s in the same row or column.
4. D / Any pair touching by a side or a corner.
Answer key + feedback per choice (data):
- ✅ CORRECT [eight] "Any pair touching by a side or a corner."
    feedback: Right. This problem uses all eight directions.
- ❌ [four] "Only pairs touching up, down, left, or right."
    feedback: This misses the diagonal rule that makes this problem unusual. (misconception: forgets-diagonals)
- ❌ [diagonal] "Only pairs touching at a corner."
    feedback: Side-touching 1s connect too. (misconception: allows-only-diagonals)
- ❌ [same-row] "Any two 1s in the same row or column."
    feedback: Cells must be immediate neighbors, not merely aligned. (misconception: connects-distant-cells)
"Why" shown after success: Right. This problem uses all eight directions.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "eight-way edges")
Raw input shown:
```
grid=[[1,1,0],[0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. All four 1 cells connect, including diagonal contact.
- ❌ [wrong] "2"
    feedback: That follows the count one row only bug. (misconception: count-one-row-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (0,1)—(1,2), (1,1)—(1,2)
"Why" shown after success: All four 1 cells connect, including diagonal contact.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "largest region")
Raw input shown:
```
grid = [[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the largest region size in [[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 6
3. C / 5
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "4"
    feedback: This misses a diagonally connected 1. (misconception: forgets-diagonal)
- ❌ [wrong-2] "6"
    feedback: The lone bottom-left 1 is separate. (misconception: merges-separated-region)
- ❌ [wrong-3] "2"
    feedback: This counts only one row instead of the full region. (misconception: stops-after-row)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "largest region")
Raw input shown:
```
grid=[[0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Zero cells are not graph nodes.
- ❌ [wrong] "1"
    feedback: That follows the count zero cell bug. (misconception: count-zero-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes:  · edges: none
"Why" shown after success: Zero cells are not graph nodes.
Result when solved correctly through the UI: **FAILED / DEAD END** Correct graph has ZERO nodes; answer buttons stay disabled (student cannot answer without drawing a wrong node) · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "largest region")
Raw input shown:
```
grid = [[1,0,1],[0,1,0],[1,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the largest region size in [[1,0,1],[0,1,0],[1,0,1]]?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 4
3. C / 5
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: The center joins all four corners diagonally. (misconception: uses-four-directions)
- ❌ [wrong-2] "4"
    feedback: The center cell counts as part of the region too. (misconception: counts-neighbors-not-center)
- ❌ [wrong-3] "3"
    feedback: All four diagonal links belong to the same component. (misconception: splits-one-component)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

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
grid=[[1,0],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. All three 1 cells share one region.; ❌ "2" — That follows the miss diagonal or branch bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [all]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each cell containing 1.
Your choice: Zero cells are outside every region.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0,1],[0,1,0]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 1
Remedial answer key: ✅ "3" — Correct. The center joins both top corners diagonally.; ❌ "1" — That follows the use four directions bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,1)" · edges: (0,0)—(1,1), (0,2)—(1,1)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Any pair touching by a side or a corner.
Your choice: This misses the diagonal rule that makes this problem unusual.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,1],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 4
Remedial answer key: ✅ "4" — Correct. Region size includes the DFS starting cell.; ❌ "3" — That follows the exclude start cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (0,1)—(1,0), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: This misses a diagonally connected 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0,0],[0,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. The two 1 cells do not touch in any direction.; ❌ "2" — That follows the merge distant cells bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,2)" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: The center joins all four corners diagonally.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1],[1],[1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Vertical neighbors form one region.; ❌ "1" — That follows the horizontal only search bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `remove-diagonals` (authored level "Corner bridge"; authored goal, NOT shown to student: "Join a region only through a legal corner contact.")
Everything the student sees (text):
```
P
Peter's broken search

Peter forgets that diagonal neighbors are allowed.

Your main goal: Expose Peter's mistake. Draw two graphs: first the correct graph, then Peter's graph using the mistake.

CHOOSE THE REGION SEED
region seed
OUTPUT
CORRECT OUTPUT
PETER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose region seed
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
2 · Peter's graph
Check my graph
→
```
Start field: label "CHOOSE THE REGION SEED / region seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | PETER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(1,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(1,1)\"]","buggy":"[\"(0,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) (0,0)—(1,1) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(1,1)"]` · character's output `["(0,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0), (1,1)`; ❌ curly braces → `{(0,0),(1,1)}`; ✅ quoted numbers/strings → `["(0,0)","(1,1)"]`; ❌ reversed order → `["(1,1)","(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" , "(1,1)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0),(1,1)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(1,1)"]
PETER'S OUTPUT
["(0,0)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Eight-way fork"; authored goal, NOT shown to student: "Make several filled neighbors matter, not only the last.")
Everything the student sees (text):
```
V
Violet's broken search

Violet keeps only the last branch it sees.

Your main goal: Expose Violet's mistake. Draw two graphs: first the correct graph, then Violet's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE REGION SEED
region seed
OUTPUT
CORRECT OUTPUT
VIOLET’S OUTPUT
Drawing 1 of 2: Correct graph · Choose region seed
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
2 · Violet's graph
Check my graph
→
```
Start field: label "CHOOSE THE REGION SEED / region seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | VIOLET’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
VIOLET'S OUTPUT
["(0,0)","(1,0)","(2,0)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Growing region"; authored goal, NOT shown to student: "Extend a region past the seed's immediate neighbors.")
Everything the student sees (text):
```
J
Jaylen's broken search

Jaylen never explores beyond the start's immediate neighbors.

Your main goal: Expose Jaylen's mistake. Draw two graphs: first the correct graph, then Jaylen's graph using the mistake.

CHOOSE THE REGION SEED
region seed
OUTPUT
CORRECT OUTPUT
JAYLEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose region seed
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
2 · Jaylen's graph
Check my graph
→
```
Start field: label "CHOOSE THE REGION SEED / region seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JAYLEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
JAYLEN'S OUTPUT
["(0,0)","(0,1)"]
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
grid=[[1,0,0],[0,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,2)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2).
- [NO is correct] (local-degree) "(1,2) has exactly 1 direct neighbor."
    feedback if wrong: (1,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each completed region of 1s.”"
    feedback if wrong: A region is a component made from cell nodes. Correct node rule: Each cell containing 1.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2).
×
(1,2) has 0 direct neighbors.
×
A region is a component made from cell nodes. Correct node rule: Each cell containing 1.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Every 0 and 1 cell.”"
    feedback if wrong: Zero cells are outside every region. Correct node rule: Each cell containing 1.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2).
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Zero cells are outside every region. Correct node rule: Each cell containing 1.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2).
×
(0,0) has 0 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(1,2) has exactly 1 direct neighbor."
    feedback if wrong: (1,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each row containing at least one 1.”"
    feedback if wrong: Several separate regions can occupy one row. Correct node rule: Each cell containing 1.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,2).
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
Each cell containing 1.
EDGES
Any pair touching by a side or a corner.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=[[1],[1],[1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every 0 and 1 cell.”"
    feedback if wrong: Zero cells are outside every region. Correct node rule: Each cell containing 1.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,0) and (1,0)—(2,0), so it should also contain a direct (0,0)—(2,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=[[1,0],[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each completed region of 1s.”"
    feedback if wrong: A region is a component made from cell nodes. Correct node rule: Each cell containing 1.
- [YES is correct] (direct-vs-reach) "(1,0) and (1,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (1,0)—(1,1) as one direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 2 direct neighbors."
    feedback if wrong: (1,1) has 2 direct neighbors.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=[[1,0,1],[0,1,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,1)" · edges: (0,0)—(1,1), (0,2)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,1) and (1,1)—(0,2), so it should also contain a direct (0,0)—(0,2) edge."
    feedback if wrong: Two direct edges through (1,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,2) has exactly 2 direct neighbors."
    feedback if wrong: (0,2) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each row containing at least one 1.”"
    feedback if wrong: Several separate regions can occupy one row. Correct node rule: Each cell containing 1.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=[[1,1],[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (0,1)—(1,0), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every 0 and 1 cell.”"
    feedback if wrong: Zero cells are outside every region. Correct node rule: Each cell containing 1.
- [NO is correct] (direct-vs-reach) "(0,1) can reach (1,1), but there is no direct (0,1)—(1,1) edge."
    feedback if wrong: The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(1,1) has exactly 2 direct neighbors."
    feedback if wrong: (1,1) has 3 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Diagonal region edges are discarded
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 0], [0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestRegion(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    let count = 0;
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
      for (const [rowChange, columnChange] of directions) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, size(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: (0,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A dirs lists only side moves, so the corner-touching land cells become separate components.
- B Sharing seen between component searches prevents the second cell from being counted.
- C best starts at zero instead of one, and that graph-level change determines the returned value.
Diagnosis answer key + feedback:
- ❌ [global-seen] "Sharing seen between component searches prevents the second cell from being counted." — feedback: A global seen set is correct; the missing diagonal edge splits the region.
- ❌ [best-init] "best starts at zero instead of one, and that graph-level change determines the returned value." — feedback: Zero is the right empty-grid baseline and is updated for each found region.
- ✅ [drops-diagonals] "dirs lists only side moves, so the corner-touching land cells become separate components." — feedback: Exactly. This problem's graph includes the diagonal edge.
Graph proof shown in feedback: code rule "The DFS builds neighbors only from four side offsets." → changed graph "The two land nodes have one legal diagonal edge and form a component of size two." → boundary "The input's only connection is a corner connection." → returned value "The code reports two singleton regions and returns 1 instead of 2."
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
About your diagnosis: A global seen set is correct; the missing diagonal edge splits the region.
Code rule: The DFS builds neighbors only from four side offsets. → Changed graph: The two land nodes have one legal diagonal edge and form a component of size two. → Reachable boundary: The input's only connection is a corner connection.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal region edges are discarded
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: The DFS builds neighbors only from four side offsets. → Changed graph: The two land nodes have one legal diagonal edge and form a component of size two. → Reachable boundary: The input's only connection is a corner connection. → Returned value: The code reports two singleton regions and returns 1 instead of 2.
```

### S4 case 2 — `repair-2` · bug: Diagonal region edges are discarded
Input shown:
```
REAL PROBLEM INPUT
grid=[[1,0,1],[0,1,0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestRegion(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    let count = 0;
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
      for (const [rowChange, columnChange] of directions) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, size(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,1)" · edges: (0,0)—(1,1), (0,2)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Sharing seen between component searches prevents the second cell from being counted.
- B dirs lists only side moves, so the corner-touching land cells become separate components.
- C best starts at zero instead of one, and that graph-level change determines the returned value.
Diagnosis answer key + feedback:
- ❌ [global-seen] "Sharing seen between component searches prevents the second cell from being counted." — feedback: A global seen set is correct; the missing diagonal edge splits the region.
- ❌ [best-init] "best starts at zero instead of one, and that graph-level change determines the returned value." — feedback: Zero is the right empty-grid baseline and is updated for each found region.
- ✅ [drops-diagonals] "dirs lists only side moves, so the corner-touching land cells become separate components." — feedback: Correct. The center 1-cell touches both corner 1-cells diagonally, so eight-neighbor connectivity makes one size-3 region while four directions leave singletons.
Graph proof shown in feedback: code rule "The DFS builds neighbors only from four side offsets." → changed graph "The three 1-cells are nodes, with diagonal edges (0,0)—(1,1) and (0,2)—(1,1)." → boundary "The 1-cells at (0,0), (1,1), and (0,2) form one diagonal region through center (1,1)." → returned value "The shown code returns 1; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal region edges are discarded
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: The DFS builds neighbors only from four side offsets. → Changed graph: The three 1-cells are nodes, with diagonal edges (0,0)—(1,1) and (0,2)—(1,1). → Reachable boundary: The 1-cells at (0,0), (1,1), and (0,2) form one diagonal region through center (1,1). → Returned value: The shown code returns 1; the real problem returns 3.
```

### S4 case 3 — `new-five-cell-x` · bug: Diagonal region edges are discarded
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 0, 1], [0, 1, 0], [1, 0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestRegion(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(startRow, startColumn) {
    const stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    let count = 0;
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
      for (const [rowChange, columnChange] of directions) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] === 1 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, size(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,1)", "(2,0)", "(2,2)" · edges: (0,0)—(1,1), (0,2)—(1,1), (1,1)—(2,0), (1,1)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `5`
Diagnosis choices as displayed:
- A best should start at one, which alone would make the correct answer five.
- B The global seen set merges the four corner searches too early.
- C dirs omits all four diagonal edges into the center, splitting one size-5 region into singletons.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "best should start at one, which alone would make the correct answer five." — feedback: Changing best from 0 to 1 still leaves the broken search at 1, not the required 5.
- ✅ [drops-diagonals] "dirs omits all four diagonal edges into the center, splitting one size-5 region into singletons." — feedback: Exactly. This problem counts corner contact as connected.
- ❌ [wrong-visited] "The global seen set merges the four corner searches too early." — feedback: A shared seen set is correct across completed region searches; the four missing diagonal edges cause the split.
Graph proof shown in feedback: code rule "Only up, down, left, and right offsets become edges." → changed graph "The center has diagonal edges to four corners, forming one five-node component." → boundary "All four real component edges are diagonal." → returned value "The code finds five size-1 regions and returns 1 instead of 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal region edges are discarded
INCORRECT OUTPUT
1
CORRECT OUTPUT
5
Code rule: Only up, down, left, and right offsets become edges. → Changed graph: The center has diagonal edges to four corners, forming one five-node component. → Reachable boundary: All four real component edges are diagonal. → Returned value: The code finds five size-1 regions and returns 1 instead of 5.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```