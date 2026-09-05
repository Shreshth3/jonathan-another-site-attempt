# Find All Groups of Farmland (`find-all-groups-of-farmland`) — new, grid

## Problem statement (Description tab)

You are given an `m x n` binary grid `land` where `0` is forested land and `1` is farmland. The farmland comes in **groups**: connected patches of 1s that are guaranteed to form perfect axis-aligned rectangles. Different groups never touch each other up/down/left/right.

For each group, report a 4-number array `[r1, c1, r2, c2]`, where `(r1, c1)` is the group's top-left cell and `(r2, c2)` is its bottom-right cell. Return the list of arrays for all groups, in any order.

### Examples
- Example 1: input `land = [[1,0,0],[0,1,1],[0,1,1]]` → output `[[0,0,0,0],[1,1,2,2]]`. There are two rectangular groups: the single cell at (0,0), reported as [0,0,0,0], and the 2 x 2 patch whose top-left corner is (1,1) and bottom-right corner is (2,2), reported as [1,1,2,2].
- Example 2: input `land = [[1,1],[1,1]]` → output `[[0,0,1,1]]`. The entire grid is one rectangular group of farmland, stretching from corner (0,0) to corner (1,1).

### Graph rules (authored)
- Nodes: Every cell containing 1.
- Edges: Cells containing 1 that share a side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).

### HARNESS-DETECTED ERRORS
- step1: step1 task 8 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "farmland cells")
Raw input shown:
```
land=[[1,1],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,0,0,1],[1,0,1,1]]
2. [[0,0,1,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,0,1,1]]"
    feedback: Correct. All four cells form one rectangle.
- ❌ [wrong] "[[0,0,0,1],[1,0,1,1]]"
    feedback: That follows the split by row bug. (misconception: split-by-row)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
"Why" shown after success: All four cells form one rectangle.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "farmland cells")
Raw input shown:
```
land=[[1,1],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (1,0)
2. Picture C / (0,0) / (0,1) / (1,0) / (1,1)
3. Picture A / (0,0) / (0,1) / (1,0) / (1,1)
4. Picture D / (0,0) / (0,1) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)—(1,0), (0,0)—(0,1)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(1,0), (0,0)→(0,1), (0,1)→(1,1), (1,0)→(1,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which cells become nodes before rectangle corners are reported?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells become nodes before rectangle corners are reported?**
Choices as displayed (top to bottom):
1. A / Only the top-left and bottom-right cell of each group.
2. B / Only a farmland cell with no farmland above or left.
3. C / Every forest and farmland cell.
4. D / Every cell containing 1.
Answer key + feedback per choice (data):
- ✅ CORRECT [farmland] "Every cell containing 1."
    feedback: Right. Each rectangular component is made from its farmland cells.
- ❌ [corners] "Only the top-left and bottom-right cell of each group."
    feedback: Those corners are outputs; the other farmland cells still form the group. (misconception: uses-output-only)
- ❌ [top-left] "Only a farmland cell with no farmland above or left."
    feedback: That can identify a group start, but it is not the full graph. (misconception: uses-scan-starts-as-nodes)
- ❌ [all] "Every forest and farmland cell."
    feedback: Forest cells do not belong to farmland groups. (misconception: includes-forest)
"Why" shown after success: Right. Each rectangular component is made from its farmland cells.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
land=[[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,0,0,0],[1,1,1,1]]
2. [[0,0,1,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,0,0,0],[1,1,1,1]]"
    feedback: Correct. Diagonal cells are separate groups.
- ❌ [wrong] "[[0,0,1,1]]"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal cells are separate groups.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
Which farmland cells share an edge?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which farmland cells share an edge?**
Choices as displayed (top to bottom):
1. A / Cells containing 1 that share a side or corner.
2. B / Any farmland cells in the same row of a rectangle.
3. C / Cells containing 1 that share a side.
4. D / Only the top-left cell connects directly to the bottom-right cell.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "Cells containing 1 that share a side."
    feedback: Right. Side connections form each guaranteed rectangle.
- ❌ [eight] "Cells containing 1 that share a side or corner."
    feedback: Diagonal contact does not join farmland groups. (misconception: allows-diagonals)
- ❌ [row] "Any farmland cells in the same row of a rectangle."
    feedback: Only immediate neighbors create direct edges. (misconception: connects-distant-row-cells)
- ❌ [corner-edge] "Only the top-left cell connects directly to the bottom-right cell."
    feedback: The corners are connected through the intervening cells, not one shortcut edge. (misconception: turns-component-into-edge)
"Why" shown after success: Right. Side connections form each guaranteed rectangle.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
land=[[1,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,0,1,2]]
2. [[0,0,0,1],[1,2,1,2]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,0,0,1],[1,2,1,2]]"
    feedback: Correct. Forest separates the two groups.
- ❌ [wrong] "[[0,0,1,2]]"
    feedback: That follows the use global bounding box bug. (misconception: use-global-bounding-box)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
"Why" shown after success: Forest separates the two groups.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "rectangle bounds")
Raw input shown:
```
land = [[1,0,0],[0,1,1],[0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What rectangles are reported for [[1,0,0],[0,1,1],[0,1,1]]?**
Choices as displayed (top to bottom):
1. A / [[0,0,0,0],[1,1,1,2],[2,1,2,2]]
2. B / [[0,0,2,2]]
3. C / [[0,0,0,0],[1,1,1,1]]
4. D / [[0,0,0,0],[1,1,2,2]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,0,0,0],[1,1,2,2]]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[[0,0,0,0],[1,1,1,2],[2,1,2,2]]"
    feedback: The 2×2 patch is one rectangular group, not two rows. (misconception: splits-rectangle)
- ❌ [wrong-2] "[[0,0,2,2]]"
    feedback: Forest gaps keep the two groups separate. (misconception: uses-whole-bounding-box)
- ❌ [wrong-3] "[[0,0,0,0],[1,1,1,1]]"
    feedback: This uses each group’s top-left cell as both corners and loses the full 2×2 boundary. (misconception: uses-top-left-as-both-corners)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "rectangle bounds")
Raw input shown:
```
land = [[1,1],[1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is reported for farmland [[1,1],[1,1]]?**
Choices as displayed (top to bottom):
1. A / [[0,0,0,1],[1,0,1,1]]
2. B / [[0,0,2,2]]
3. C / [[0,0,1,1]]
4. D / [[1,1,0,0]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,0,1,1]]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[[0,0,0,1],[1,0,1,1]]"
    feedback: All side-connected cells form one group. (misconception: splits-by-row)
- ❌ [wrong-2] "[[0,0,2,2]]"
    feedback: Indexes end at 1 in a 2×2 grid. (misconception: off-by-one-corner)
- ❌ [wrong-3] "[[1,1,0,0]]"
    feedback: Corners are ordered top-left then bottom-right. (misconception: reverses-corners)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "rectangle bounds")
Raw input shown:
```
land=[[0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [[0,0,0,0]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. There is no farmland cell.
- ❌ [wrong] "[[0,0,0,0]]"
    feedback: That follows the treat forest as farmland bug. (misconception: treat-forest-as-farmland)
Graph the grader requires (hidden from student): UNDIRECTED · nodes:  · edges: none
"Why" shown after success: There is no farmland cell.
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
land=[[1],[1],[1]]
```
Remedial question: **What should the function return?** · choices shown: [[0,0,1,0]] | [[0,0,2,0]]
Remedial answer key: ✅ "[[0,0,2,0]]" — Correct. The rectangle reaches row 2.; ❌ "[[0,0,1,0]]" — That follows the off by one bottom bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [corners]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every cell containing 1.
Your choice: Those corners are outputs; the other farmland cells still form the group.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
land=[[0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: [[0,1,0,2]] | [[0,0,0,2]]
Remedial answer key: ✅ "[[0,1,0,2]]" — Correct. The top-left corner starts at column 1.; ❌ "[[0,0,0,2]]" — That follows the include leading forest bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(0,2)" · edges: (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Cells containing 1 that share a side.
Your choice: Diagonal contact does not join farmland groups.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
land=[[1,0,1]]
```
Remedial question: **What should the function return?** · choices shown: [[0,0,0,2]] | [[0,0,0,0],[0,2,0,2]]
Remedial answer key: ✅ "[[0,0,0,0],[0,2,0,2]]" — Correct. The middle forest cell splits the groups.; ❌ "[[0,0,0,2]]" — That follows the bridge through forest bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[0,0,0,0],[1,1,2,2]]
Your choice: The 2×2 patch is one rectangular group, not two rows.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
land=[[1,1],[0,0]]
```
Remedial question: **What should the function return?** · choices shown: [[0,0,0,1]] | [[0,0,1,1]]
Remedial answer key: ✅ "[[0,0,0,1]]" — Correct. The bottom boundary stays on row 0.; ❌ "[[0,0,1,1]]" — That follows the include forest row bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[0,0,1,1]]
Your choice: All side-connected cells form one group.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
land=[[1]]
```
Remedial question: **What should the function return?** · choices shown: [] | [[0,0,0,0]]
Remedial answer key: ✅ "[[0,0,0,0]]" — Correct. A one-cell rectangle is valid.; ❌ "[]" — That follows the drop single cell group bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Long field"; authored goal, NOT shown to student: "Grow a rectangular plot farther than one side step.")
Everything the student sees (text):
```
C
Camden's broken search

Camden stops after one hop instead of continuing.

Your main goal: Expose Camden's mistake. Draw two graphs: first the correct graph, then Camden's graph using the mistake.

CHOOSE THE PLOT SEED
plot seed
OUTPUT
CORRECT OUTPUT
CAMDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose plot seed
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
2 · Camden's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLOT SEED / plot seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CAMDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,0)", "(1,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0), (0,1), (0,2)`; ❌ curly braces → `{(0,0),(0,1),(0,2)}`; ✅ quoted numbers/strings → `["(0,0)","(0,1)","(0,2)"]`; ❌ reversed order → `["(0,2)","(0,1)","(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" , "(0,1)" , "(0,2)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0),(0,1),(0,2)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
CAMDEN'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Plot corner split"; authored goal, NOT shown to student: "Make the seed's row and column branches both necessary.")
Everything the student sees (text):
```
B
Bianca's broken search

Bianca chooses the final listed route and never returns.

Your main goal: Expose Bianca's mistake. Draw two graphs: first the correct graph, then Bianca's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE PLOT SEED
plot seed
OUTPUT
CORRECT OUTPUT
BIANCA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose plot seed
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
2 · Bianca's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLOT SEED / plot seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BIANCA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
BIANCA'S OUTPUT
["(0,0)","(1,0)","(2,0)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `add-diagonals` (authored level "Touching plots"; authored goal, NOT shown to student: "Let two separate plots touch only at a corner.")
Everything the student sees (text):
```
R
Roman's broken search

Roman treats corner-touching squares as direct neighbors.

Your main goal: Expose Roman's mistake. Draw two graphs: first the correct graph, then Roman's graph using the mistake.

CHOOSE THE PLOT SEED
plot seed
OUTPUT
CORRECT OUTPUT
ROMAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose plot seed
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
2 · Roman's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLOT SEED / plot seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ROMAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
ROMAN'S OUTPUT
["(0,0)","(1,1)"]
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
land=[[1,1],[0,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only a farmland cell with no farmland above or left.”"
    feedback if wrong: That can identify a group start, but it is not the full graph. Correct node rule: Every cell containing 1.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
That can identify a group start, but it is not the full graph. Correct node rule: Every cell containing 1.
×
Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
×
(0,0) has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every forest and farmland cell.”"
    feedback if wrong: Forest cells do not belong to farmland groups. Correct node rule: Every cell containing 1.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Forest cells do not belong to farmland groups. Correct node rule: Every cell containing 1.
×
Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
×
(0,1) has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the top-left and bottom-right cell of each group.”"
    feedback if wrong: Those corners are outputs; the other farmland cells still form the group. Correct node rule: Every cell containing 1.
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
Every cell containing 1.
EDGES
Cells containing 1 that share a side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
land=[[1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every forest and farmland cell.”"
    feedback if wrong: Forest cells do not belong to farmland groups. Correct node rule: Every cell containing 1.
- [NO is correct] (direct-vs-reach) "Because (0,0) can reach itself, the graph should contain a direct (0,0)—(0,0) edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct (0,0)—(0,0) self-edge.
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
land=[[1],[1],[1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach (2,0) through (1,0), but the graph still has no direct (0,0)—(2,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only a farmland cell with no farmland above or left.”"
    feedback if wrong: That can identify a group start, but it is not the full graph. Correct node rule: Every cell containing 1.
Result: PASSED

### S3 Q4
Raw input shown:
```
land=[[0,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(0,2)" · edges: (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,1) and (0,2) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,1)—(0,2) as one direct edge.
- [YES is correct] (local-degree) "(0,2) has exactly 1 direct neighbor."
    feedback if wrong: (0,2) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the top-left and bottom-right cell of each group.”"
    feedback if wrong: Those corners are outputs; the other farmland cells still form the group. Correct node rule: Every cell containing 1.
Result: PASSED

### S3 Q5
Raw input shown:
```
land=[[1,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every forest and farmland cell.”"
    feedback if wrong: Forest cells do not belong to farmland groups. Correct node rule: Every cell containing 1.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Rectangle endpoints are returned one cell too far
Input shown:
```
REAL PROBLEM INPUT
land: [[1, 1], [1, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findFarmland(land) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const answer = [];
  for (let row = 0; row < land.length; row++) {
    for (let column = 0; column < land[0].length; column++) {
      if (
        land[row][column] !== 1 ||
        (isInBounds(land, row - 1, column) && land[row - 1][column] === 1) ||
        (isInBounds(land, row, column - 1) && land[row][column - 1] === 1)
      ) {
        continue;
      }
      let bottom = row;
      let right = column;
      while (
        isInBounds(land, bottom + 1, column) &&
        land[bottom + 1][column] === 1
      ) {
        bottom++;
      }
      while (isInBounds(land, row, right + 1) && land[row][right + 1] === 1) {
        right++;
      }
      answer.push([row, column, bottom + 1, right + 1]);
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of [top,left,bottom,right] rectangles" · expected buggy output `[[0,0,2,2]]` · real correct output `[[0,0,1,1]]`
Diagnosis choices as displayed:
- A The top-left test should require both a top neighbor and a left neighbor on the shown input.
- B The boundary scans stop at the first row or column and miss farmland deeper in the rectangle.
- C bottom and right already name the last farmland node, so adding one leaves the component.
Diagnosis answer key + feedback:
- ❌ [top-left-test] "The top-left test should require both a top neighbor and a left neighbor on the shown input." — feedback: A group starts when neither neighbor is farmland; the current guard does that correctly.
- ✅ [exclusive-corner] "bottom and right already name the last farmland node, so adding one leaves the component." — feedback: Exactly. The requested corner coordinates are inclusive.
- ❌ [missing-dfs] "The boundary scans stop at the first row or column and miss farmland deeper in the rectangle." — feedback: The scans continue through the full rectangle; only the final endpoint indexing is wrong.
Graph proof shown in feedback: code rule "It finds the correct component bounds, then increments both final indexes." → changed graph "The four farmland cells form one 2×2 side-connected component ending at node (1,1)." → boundary "The component touches the grid's last valid row and column." → returned value "The helper reports nonexistent corner (2,2) instead of inclusive corner (1,1)."
Output-format probes: ✅ spaces after commas → `[[0, 0, 2, 2]]`; ❌ trailing period → `[[0,0,2,2]].`
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
About your diagnosis: A group starts when neither neighbor is farmland; the current guard does that correctly.
Code rule: It finds the correct component bounds, then increments both final indexes. → Changed graph: The four farmland cells form one 2×2 side-connected component ending at node (1,1). → Reachable boundary: The component touches the grid's last valid row and column.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rectangle endpoints are returned one cell too far
INCORRECT OUTPUT
[[0,0,2,2]]
CORRECT OUTPUT
[[0,0,1,1]]
Code rule: It finds the correct component bounds, then increments both final indexes. → Changed graph: The four farmland cells form one 2×2 side-connected component ending at node (1,1). → Reachable boundary: The component touches the grid's last valid row and column. → Returned value: The helper reports nonexistent corner (2,2) instead of inclusive corner (1,1).
```

### S4 case 2 — `build-2` · bug: Rectangle endpoints are returned one cell too far
Input shown:
```
REAL PROBLEM INPUT
land=[[1,0],[0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findFarmland(land) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const answer = [];
  for (let row = 0; row < land.length; row++) {
    for (let column = 0; column < land[0].length; column++) {
      if (
        land[row][column] !== 1 ||
        (isInBounds(land, row - 1, column) && land[row - 1][column] === 1) ||
        (isInBounds(land, row, column - 1) && land[row][column - 1] === 1)
      ) {
        continue;
      }
      let bottom = row;
      let right = column;
      while (
        isInBounds(land, bottom + 1, column) &&
        land[bottom + 1][column] === 1
      ) {
        bottom++;
      }
      while (isInBounds(land, row, right + 1) && land[row][right + 1] === 1) {
        right++;
      }
      answer.push([row, column, bottom + 1, right + 1]);
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of [top,left,bottom,right] rectangles" · expected buggy output `[[0,0,1,1],[1,1,2,2]]` · real correct output `[[0,0,0,0],[1,1,1,1]]`
Diagnosis choices as displayed:
- A bottom and right already name the last farmland node, so adding one leaves the component.
- B The top-left test should require both a top neighbor and a left neighbor on the shown input.
- C The boundary scans stop at the first row or column and miss farmland deeper in the rectangle.
Diagnosis answer key + feedback:
- ❌ [top-left-test] "The top-left test should require both a top neighbor and a left neighbor on the shown input." — feedback: A group starts when neither neighbor is farmland; the current guard does that correctly.
- ✅ [exclusive-corner] "bottom and right already name the last farmland node, so adding one leaves the component." — feedback: Correct. Each group is one cell, so adding one to its inclusive bottom and right coordinates moves both reported corners outside the farmland.
- ❌ [missing-dfs] "The boundary scans stop at the first row or column and miss farmland deeper in the rectangle." — feedback: The scans continue through the full rectangle; only the final endpoint indexing is wrong.
Graph proof shown in feedback: code rule "It finds the correct component bounds, then increments both final indexes." → changed graph "Land cells (0,0) and (1,1) are two separate singleton farmland groups." → boundary "Each singleton farmland group has the same top-left and bottom-right cell, so adding one overshoots both groups." → returned value "The shown code returns [[0,0,1,1],[1,1,2,2]]; the real problem returns [[0,0,0,0],[1,1,1,1]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rectangle endpoints are returned one cell too far
INCORRECT OUTPUT
[[0,0,1,1],[1,1,2,2]]
CORRECT OUTPUT
[[0,0,0,0],[1,1,1,1]]
Code rule: It finds the correct component bounds, then increments both final indexes. → Changed graph: Land cells (0,0) and (1,1) are two separate singleton farmland groups. → Reachable boundary: Each singleton farmland group has the same top-left and bottom-right cell, so adding one overshoots both groups. → Returned value: The shown code returns [[0,0,1,1],[1,1,2,2]]; the real problem returns [[0,0,0,0],[1,1,1,1]].
```

### S4 case 3 — `build-3` · bug: Rectangle endpoints are returned one cell too far
Input shown:
```
REAL PROBLEM INPUT
land=[[1,1,0],[0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findFarmland(land) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const answer = [];
  for (let row = 0; row < land.length; row++) {
    for (let column = 0; column < land[0].length; column++) {
      if (
        land[row][column] !== 1 ||
        (isInBounds(land, row - 1, column) && land[row - 1][column] === 1) ||
        (isInBounds(land, row, column - 1) && land[row][column - 1] === 1)
      ) {
        continue;
      }
      let bottom = row;
      let right = column;
      while (
        isInBounds(land, bottom + 1, column) &&
        land[bottom + 1][column] === 1
      ) {
        bottom++;
      }
      while (isInBounds(land, row, right + 1) && land[row][right + 1] === 1) {
        right++;
      }
      answer.push([row, column, bottom + 1, right + 1]);
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of [top,left,bottom,right] rectangles" · expected buggy output `[[0,0,1,2],[1,2,2,3]]` · real correct output `[[0,0,0,1],[1,2,1,2]]`
Diagnosis choices as displayed:
- A The top-left test should require both a top neighbor and a left neighbor on the shown input.
- B bottom and right already name the last farmland node, so adding one leaves the component.
- C The boundary scans stop at the first row or column and miss farmland deeper in the rectangle.
Diagnosis answer key + feedback:
- ❌ [top-left-test] "The top-left test should require both a top neighbor and a left neighbor on the shown input." — feedback: A group starts when neither neighbor is farmland; the current guard does that correctly.
- ✅ [exclusive-corner] "bottom and right already name the last farmland node, so adding one leaves the component." — feedback: Correct. The first group ends at (0,1) and the second at (1,2); adding one to either inclusive endpoint overshoots the real rectangles.
- ❌ [missing-dfs] "The boundary scans stop at the first row or column and miss farmland deeper in the rectangle." — feedback: The scans continue through the full rectangle; only the final endpoint indexing is wrong.
Graph proof shown in feedback: code rule "It finds the correct component bounds, then increments both final indexes." → changed graph "Land cells (0,0)—(0,1) form one group, while (1,2) is a singleton group." → boundary "The real inclusive endpoints are (0,1) for the top strip and (1,2) for the lower singleton." → returned value "The shown code returns [[0,0,1,2],[1,2,2,3]]; the real problem returns [[0,0,0,1],[1,2,1,2]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rectangle endpoints are returned one cell too far
INCORRECT OUTPUT
[[0,0,1,2],[1,2,2,3]]
CORRECT OUTPUT
[[0,0,0,1],[1,2,1,2]]
Code rule: It finds the correct component bounds, then increments both final indexes. → Changed graph: Land cells (0,0)—(0,1) form one group, while (1,2) is a singleton group. → Reachable boundary: The real inclusive endpoints are (0,1) for the top strip and (1,2) for the lower singleton. → Returned value: The shown code returns [[0,0,1,2],[1,2,2,3]]; the real problem returns [[0,0,0,1],[1,2,1,2]].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```