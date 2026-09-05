# Max Area of Island (`max-area-of-island`) — new, grid

## Problem statement (Description tab)

You are given a grid of 0s and 1s called `grid`. A `1` is land and a `0` is water.

An island is a group of land cells that are connected up, down, left, or right (not diagonally).

The area of an island is how many cells it contains.

Return the area of the biggest island in the grid. If there is no land at all, return 0.

### Examples
- Example 1: input `grid = [[0,1,0,0],[1,1,0,1],[0,0,0,1],[0,1,1,1]]` → output `5`. There are two islands. One is the 3-cell island in the top-left (cells (0,1), (1,0), (1,1)). The other has 5 cells: (1,3), (2,3), (3,3), (3,2), (3,1). The biggest area is 5.
- Example 2: input `grid = [[0,0],[0,0]]` → output `0`. There is no land anywhere, so the answer is 0.

### Graph rules (authored)
- Nodes: Each cell containing 1.
- Edges: Immediate land neighbors up, down, left, or right.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).

### HARNESS-DETECTED ERRORS
- step1: step1 task 7 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "land cells")
Raw input shown:
```
grid=[[1,1],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. All three side-connected land cells form one island.
- ❌ [wrong] "2"
    feedback: That follows the count one row only bug. (misconception: count-one-row-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
"Why" shown after success: All three side-connected land cells form one island.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "cell identity")
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
- ✅ CORRECT [correct] "1"
    feedback: Correct. Diagonal contact does not join islands.
- ❌ [wrong] "2"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal contact does not join islands.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "land cells")
Raw input shown:
```
grid=[[1,1],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (0,1) / (1,1)
2. Picture B / (0,0) / (0,1)
3. Picture C / (0,0) / (0,1) / (1,1)
4. Picture D / (0,0) / (0,1) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,1) · edges: (0,0)—(0,1), (0,1)—(1,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1) · edges: (0,0)—(0,1)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,1) · edges: (0,0)—(0,1)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (1,1) · edges: (0,0)→(0,1), (0,1)→(1,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
What contributes one unit to an island's area?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What contributes one unit to an island's area?**
Choices as displayed (top to bottom):
1. A / Each cell containing 1.
2. B / Every land and water cell inside the island's bounding box.
3. C / Each side shared by two land cells.
4. D / Each whole island counts as one node and one area unit.
Answer key + feedback per choice (data):
- ✅ CORRECT [land] "Each cell containing 1."
    feedback: Right. Component size equals its number of land nodes.
- ❌ [all] "Every land and water cell inside the island's bounding box."
    feedback: Water gaps are not island area. (misconception: counts-bounding-box)
- ❌ [edge] "Each side shared by two land cells."
    feedback: The output counts cells, not connections. (misconception: counts-edges)
- ❌ [island] "Each whole island counts as one node and one area unit."
    feedback: Area is the number of cells inside the component. (misconception: counts-components)
"Why" shown after success: Right. Component size equals its number of land nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
grid=[[1,1,0],[0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The component continues to the lower-right cell.
- ❌ [wrong] "3"
    feedback: That follows the stop before last branch bug. (misconception: stop-before-last-branch)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,1)—(1,1), (1,1)—(1,2)
"Why" shown after success: The component continues to the lower-right cell.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
Which land cells join the same island?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which land cells join the same island?**
Choices as displayed (top to bottom):
1. A / Land cells touching by a side or corner.
2. B / Immediate land neighbors up, down, left, or right.
3. C / Any land cells in the same row or column.
4. D / Only edges inside the island that will turn out largest.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "Immediate land neighbors up, down, left, or right."
    feedback: Right. Side contact creates the island component.
- ❌ [eight] "Land cells touching by a side or corner."
    feedback: Diagonal contact does not join islands. (misconception: allows-diagonals)
- ❌ [row] "Any land cells in the same row or column."
    feedback: Water or distance between cells breaks a direct connection. (misconception: jumps-water)
- ❌ [largest-only] "Only edges inside the island that will turn out largest."
    feedback: All islands must be explored before the maximum is known. (misconception: assumes-winner-up-front)
"Why" shown after success: Right. Side contact creates the island component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "largest area")
Raw input shown:
```
grid = [[0,1,0,0],[1,1,0,1],[0,0,0,1],[0,1,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum island area is returned for the shown grid?**
Choices as displayed (top to bottom):
1. A / 8
2. B / 3
3. C / 5
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "8"
    feedback: Separate islands are not combined. (misconception: sums-islands)
- ❌ [wrong-2] "3"
    feedback: The output asks for the larger island. (misconception: chooses-first-island)
- ❌ [wrong-3] "2"
    feedback: The output is cells, not the number of islands. (misconception: counts-components)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "largest area")
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
    feedback: Correct. There is no land node.
- ❌ [wrong] "1"
    feedback: That follows the count water as land bug. (misconception: count-water-as-land)
Graph the grader requires (hidden from student): UNDIRECTED · nodes:  · edges: none
"Why" shown after success: There is no land node.
Result when solved correctly through the UI: **FAILED / DEAD END** Correct graph has ZERO nodes; answer buttons stay disabled (student cannot answer without drawing a wrong node) · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "largest area")
Raw input shown:
```
grid = [[0,0],[0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is max area for [[0,0],[0,0]]?**
Choices as displayed (top to bottom):
1. A / 0
2. B / 1
3. C / 4
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: No land means there is not even a one-cell island. (misconception: forces-minimum-one)
- ❌ [wrong-2] "4"
    feedback: Water cells do not count as area. (misconception: counts-water)
- ❌ [wrong-3] "2"
    feedback: Rows are not islands. (misconception: counts-rows)
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
grid=[[1],[1],[1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Vertical side neighbors form one island.; ❌ "1" — That follows the horizontal only search bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [all]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each cell containing 1.
Your choice: Water gaps are not island area.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Water separates the two cells.; ❌ "2" — That follows the jump across water bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Immediate land neighbors up, down, left, or right.
Your choice: Diagonal contact does not join islands.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,1],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 4
Remedial answer key: ✅ "4" — Correct. Area includes the DFS starting cell.; ❌ "3" — That follows the exclude start cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: Separate islands are not combined.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,1,0],[0,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "2" — Correct. The isolated lower-right cell is not part of the size-2 island.; ❌ "3" — That follows the sum separate islands bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0
Your choice: No land means there is not even a one-cell island.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. The L-shape is one side-connected component.; ❌ "2" — That follows the miss turning path bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `last-branch` (authored level "Area fork"; authored goal, NOT shown to student: "Shape an island with two arms that both add area.")
Everything the student sees (text):
```
C
Caitlyn's broken search

Caitlyn follows only the last available branch and ignores earlier choices.

Your main goal: Expose Caitlyn's mistake. Draw two graphs: first the correct graph, then Caitlyn's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
CAITLYN’S OUTPUT
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
2 · Caitlyn's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CAITLYN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0), (0,1), (1,0), (2,0)`; ❌ curly braces → `{(0,0),(0,1),(1,0),(2,0)}`; ✅ quoted numbers/strings → `["(0,0)","(0,1)","(1,0)","(2,0)"]`; ❌ reversed order → `["(2,0)","(1,0)","(0,1)","(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" , "(0,1)" , "(1,0)" , "(2,0)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0),(0,1),(1,0),(2,0)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
CAITLYN'S OUTPUT
["(0,0)","(1,0)","(2,0)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `add-diagonals` (authored level "Corner islands"; authored goal, NOT shown to student: "Make two islands touch only at one corner.")
Everything the student sees (text):
```
C
Calvin's broken search

Calvin adds diagonal moves that the real graph does not have.

Your main goal: Expose Calvin's mistake. Draw two graphs: first the correct graph, then Calvin's graph using the mistake.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
CALVIN’S OUTPUT
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
2 · Calvin's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CALVIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
CALVIN'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Long coastline"; authored goal, NOT shown to student: "Extend land beyond every direct neighbor of the seed.")
Everything the student sees (text):
```
C
Cassidy's broken search

Cassidy visits only the start and its direct neighboring squares.

Your main goal: Expose Cassidy's mistake. Draw two graphs: first the correct graph, then Cassidy's graph using the mistake.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
CASSIDY’S OUTPUT
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
2 · Cassidy's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CASSIDY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
CASSIDY'S OUTPUT
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
grid=[[1,1,0],[0,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every land and water cell inside the island's bounding box.”"
    feedback if wrong: Water gaps are not island area. Correct node rule: Each cell containing 1.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
×
(0,0) has 1 direct neighbor.
×
Water gaps are not island area. Correct node rule: Each cell containing 1.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each side shared by two land cells.”"
    feedback if wrong: The output counts cells, not connections. Correct node rule: Each cell containing 1.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The output counts cells, not connections. Correct node rule: Each cell containing 1.
×
Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
×
(0,1) has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(1,2) has exactly 0 direct neighbors."
    feedback if wrong: (1,2) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each whole island counts as one node and one area unit.”"
    feedback if wrong: Area is the number of cells inside the component. Correct node rule: Each cell containing 1.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
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
Immediate land neighbors up, down, left, or right.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=[[1,0],[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (1,0), but the graph still has no direct (0,0)—(1,1) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each side shared by two land cells.”"
    feedback if wrong: The output counts cells, not connections. Correct node rule: Each cell containing 1.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=[[1],[1],[1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every land and water cell inside the island's bounding box.”"
    feedback if wrong: Water gaps are not island area. Correct node rule: Each cell containing 1.
- [NO is correct] (direct-vs-reach) "The correct graph has (2,0)—(1,0) and (1,0)—(0,0), so it should also contain a direct (2,0)—(0,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=[[1,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each whole island counts as one node and one area unit.”"
    feedback if wrong: Area is the number of cells inside the component. Correct node rule: Each cell containing 1.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=[[1,1],[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each side shared by two land cells.”"
    feedback if wrong: The output counts cells, not connections. Correct node rule: Each cell containing 1.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (0,1), but the graph still has no direct (0,0)—(1,1) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,1) has exactly 2 direct neighbors."
    feedback if wrong: (0,1) has 2 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Corner-touching islands are merged
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 0], [0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxAreaOfIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function area(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total++;
      for (let rowChange = -1; rowChange <= 1; rowChange++) {
        for (let columnChange = -1; columnChange <= 1; columnChange++) {
          if (!rowChange && !columnChange) {
            continue;
          }
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
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, area(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A The same seen set should be cleared before measuring each island, changing this input's returned value.
- B Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells.
- C best should add every island area rather than take the maximum, changing this input's returned value.
Diagnosis answer key + feedback:
- ❌ [seen-across-islands] "The same seen set should be cleared before measuring each island, changing this input's returned value." — feedback: A global seen set is correct and prevents recounting; diagonal movement merges the islands.
- ✅ [corner-merge] "Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells." — feedback: Exactly. Side-only islands remain two singletons.
- ❌ [best-sum] "best should add every island area rather than take the maximum, changing this input's returned value." — feedback: The requested value is one largest island, so maximum is correct.
Graph proof shown in feedback: code rule "The DFS connects land at all eight neighboring offsets." → changed graph "There are two land nodes and no edge, producing two islands of area 1." → boundary "The land cells meet only diagonally." → returned value "The helper merges them into area 2; the true maximum is 1."
Output-format probes: ❌ quoted number → `"2"`; ❌ trailing period → `2.`
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
About your diagnosis: A global seen set is correct and prevents recounting; diagonal movement merges the islands.
Code rule: The DFS connects land at all eight neighboring offsets. → Changed graph: There are two land nodes and no edge, producing two islands of area 1. → Reachable boundary: The land cells meet only diagonally.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Corner-touching islands are merged
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: The DFS connects land at all eight neighboring offsets. → Changed graph: There are two land nodes and no edge, producing two islands of area 1. → Reachable boundary: The land cells meet only diagonally. → Returned value: The helper merges them into area 2; the true maximum is 1.
```

### S4 case 2 — `repair-4` · bug: Corner-touching islands are merged
Input shown:
```
REAL PROBLEM INPUT
grid=[[1,1,0],[0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxAreaOfIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function area(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total++;
      for (let rowChange = -1; rowChange <= 1; rowChange++) {
        for (let columnChange = -1; columnChange <= 1; columnChange++) {
          if (!rowChange && !columnChange) {
            continue;
          }
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
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, area(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A The same seen set should be cleared before measuring each island, changing this input's returned value.
- B best should add every island area rather than take the maximum, changing this input's returned value.
- C Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells.
Diagnosis answer key + feedback:
- ❌ [seen-across-islands] "The same seen set should be cleared before measuring each island, changing this input's returned value." — feedback: A global seen set is correct and prevents recounting; diagonal movement merges the islands.
- ✅ [corner-merge] "Offsets with both dr and dc nonzero create an edge between the two corner-touching land cells." — feedback: Correct. The top size-2 island and the lower singleton touch only at a corner; the diagonal edge merges them into an illegal size-3 island.
- ❌ [best-sum] "best should add every island area rather than take the maximum, changing this input's returned value." — feedback: The requested value is one largest island, so maximum is correct.
Graph proof shown in feedback: code rule "The DFS connects land at all eight neighboring offsets." → changed graph "Land cells (0,0)—(0,1) form a size-2 island; (1,2) is a separate singleton." → boundary "The top pair and lower singleton meet only across corner (0,1)/(1,2), so no legal edge joins them." → returned value "The shown code returns 3; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Corner-touching islands are merged
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: The DFS connects land at all eight neighboring offsets. → Changed graph: Land cells (0,0)—(0,1) form a size-2 island; (1,2) is a separate singleton. → Reachable boundary: The top pair and lower singleton meet only across corner (0,1)/(1,2), so no legal edge joins them. → Returned value: The shown code returns 3; the real problem returns 2.
```

### S4 case 3 — `new-diagonal-component-bridge` · bug: Corner-touching islands are merged
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 1, 0], [0, 0, 1], [0, 0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxAreaOfIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function area(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total++;
      for (let rowChange = -1; rowChange <= 1; rowChange++) {
        for (let columnChange = -1; columnChange <= 1; columnChange++) {
          if (!rowChange && !columnChange) {
            continue;
          }
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
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, area(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)", "(2,2)" · edges: (0,0)—(0,1), (1,2)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `4` · real correct output `2`
Diagnosis choices as displayed:
- A Eight-neighbor DFS joins the two area-2 islands across the corner (0,1)/(1,2).
- B best adds the areas of every island instead of taking a maximum.
- C The bottom island is skipped because seen is shared across island searches.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "best adds the areas of every island instead of taking a maximum." — feedback: best uses Math.max for each search and never sums separate island areas.
- ✅ [corner-merge] "Eight-neighbor DFS joins the two area-2 islands across the corner (0,1)/(1,2)." — feedback: Exactly. Side connectivity leaves two separate islands of area 2.
- ❌ [wrong-visited] "The bottom island is skipped because seen is shared across island searches." — feedback: A global seen set is correct; the illegal diagonal causes the bottom island to be seen from the top one.
Graph proof shown in feedback: code rule "A diagonal neighbor adds a bridge between those components." → changed graph "Two separate side-connected edges form two islands of area 2." → boundary "The only cross-component contact is one corner." → returned value "The helper returns merged area 4; the true maximum is 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Corner-touching islands are merged
INCORRECT OUTPUT
4
CORRECT OUTPUT
2
Code rule: A diagonal neighbor adds a bridge between those components. → Changed graph: Two separate side-connected edges form two islands of area 2. → Reachable boundary: The only cross-component contact is one corner. → Returned value: The helper returns merged area 4; the true maximum is 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```