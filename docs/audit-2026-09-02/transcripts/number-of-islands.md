# Number of Islands (`number-of-islands`) — original, grid

## Problem statement (Description tab)

You are given a 2D grid of characters where `'1'` represents land and `'0'` represents water.

An **island** is a patch of land cells that are joined together up/down/left/right (diagonal touches do not count). You can assume everything beyond the edges of the grid is water, so islands are always fully surrounded by water.

Return how many islands are in the grid.

### Examples
- Example 1: input `grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]` → output `1`. All the land cells touch each other through their sides, so they form a single island.
- Example 2: input `grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]` → output `3`. There are three separate patches of land: the 2x2 block in the top-left, the single cell in the middle, and the pair of cells in the bottom-right.
- Example 3: input `grid = [["1","0","1"],["0","1","0"],["1","0","1"]]` → output `5`. The five land cells only touch diagonally, and diagonals do not connect land — so each cell is its own island.

### Graph rules (authored)
- Nodes: Every `1` land cell, including a lone land cell surrounded by water.
- Edges: Only when their cells share a side: up, down, left, or right.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-three`, facet "island count")
Raw input shown:
```
grid = [["1","1","0"],["0","0","0"],["1","0","1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The top pair is one island and the two bottom cells are separate islands.
- ❌ [near-miss] "4"
    feedback: That result follows the count land cells bug, not the exact picture. (misconception: count-land-cells)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(2,0)", "(2,2)" · edges: (0,0)—(0,1)
"Why" shown after success: The top pair is one island and the two bottom cells are separate islands.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact land cells")
Raw input shown:
```
grid = [["1","1","0"],["0","0","0"],["1","0","1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (2,0) / (2,2)
2. Picture A / (0,0) / (0,1) / (2,0) / (2,2)
3. Picture C / (0,0) / (0,1) / (2,0) / (2,2)
4. Picture D / (0,0) / (0,1) / (2,0)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (2,0), (2,2) · edges: (0,0)—(0,1)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1), (2,0), (2,2) · edges: none
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,1), (2,0), (2,2) · edges: (0,0)→(0,1)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (0,1), (2,0) · edges: (0,0)—(0,1)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`core-rule`, facet "cell identity")
Raw input shown:
```
Which grid cells should be nodes in the island graph?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which grid cells should be nodes in the island graph?**
Choices as displayed (top to bottom):
1. A / Each entire visible island should be one node.
2. B / Only land cells that touch at least one other land cell.
3. C / Both 1 land and 0 water cells.
4. D / Every 1 land cell, including a lone land cell surrounded by water.
Answer key + feedback per choice (data):
- ✅ CORRECT [land-cells] "Every `1` land cell, including a lone land cell surrounded by water."
    feedback: Correct. A lone land node is an island of size one.
- ❌ [islands] "Each entire visible island should be one node."
    feedback: An island is the connected component that DFS discovers from individual land-cell nodes. (misconception: island-as-node)
- ❌ [connected-land] "Only land cells that touch at least one other land cell."
    feedback: Isolated land still counts as an island and must not be dropped. (misconception: drop-single-cell-island)
- ❌ [all-cells] "Both `1` land and `0` water cells."
    feedback: Water blocks travel and should not join separate land regions in this graph model. (misconception: include-water)
"Why" shown after success: Correct. A lone land node is an island of size one.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-diagonal`, facet "four-way land edges")
Raw input shown:
```
grid = [["1","0"],["0","1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Diagonal contact does not form an edge.
- ❌ [near-miss] "1"
    feedback: That result follows the connect diagonal land bug, not the exact picture. (misconception: connect-diagonal-land)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal contact does not form an edge.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "four-way land edges")
Raw input shown:
```
When should two land-cell nodes share an edge?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should two land-cell nodes share an edge?**
Choices as displayed (top to bottom):
1. A / Only when their cells share a side: up, down, left, or right.
2. B / When they share either a side or a corner.
3. C / Whenever they are in the same row or column, even with water between them.
4. D / Connect a land cell to every water cell touching its side.
Answer key + feedback per choice (data):
- ✅ CORRECT [four-direction] "Only when their cells share a side: up, down, left, or right."
    feedback: Correct. Side connections define each island.
- ❌ [eight-direction] "When they share either a side or a corner."
    feedback: Diagonal land belongs to separate islands in this problem. (misconception: connect-diagonals)
- ❌ [same-row-column] "Whenever they are in the same row or column, even with water between them."
    feedback: Water interrupts the connection. Only immediately adjacent cells get an edge. (misconception: bridge-over-water)
- ❌ [shoreline] "Connect a land cell to every water cell touching its side."
    feedback: Water is not a node in the land graph, so shoreline contacts are not graph edges. (misconception: land-water-edge)
"Why" shown after success: Correct. Side connections define each island.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-solid`, facet "exact land cells")
Raw input shown:
```
grid = [["1","1"],["1","1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. All four land cells connect through sides.
- ❌ [near-miss] "4"
    feedback: That result follows the count each land cell bug, not the exact picture. (misconception: count-each-land-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
"Why" shown after success: All four land cells connect through sides.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "island count")
Raw input shown:
```
grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **A bent patch of land stays side-connected throughout. How many islands is it?**
Choices as displayed (top to bottom):
1. A / 9 islands
2. B / 3 islands
3. C / 4 islands
4. D / 1 island
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1 island"
    feedback: Correct. Bends do not split a side-connected component.
- ❌ [cells] "9 islands"
    feedback: Side-touching land cells belong to the same island. (misconception: count-land-cells)
- ❌ [rows] "3 islands"
    feedback: Vertical side connections join land across rows. (misconception: split-by-row)
- ❌ [turns] "4 islands"
    feedback: Shape direction does not matter; side connectivity does. (misconception: split-at-bend)
"Why" shown after success: Correct. Bends do not split a side-connected component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "island count")
Raw input shown:
```
grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **A 2×2 land block, a diagonal lone land cell, and a separate two-cell pair are pictured. How many islands?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 7
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct. The three patches share no sides.
- ❌ [two] "2"
    feedback: This merges the lone diagonal cell with another patch. (misconception: connect-diagonal)
- ❌ [seven] "7"
    feedback: This counts land cells instead of groups. (misconception: count-cells)
- ❌ [one] "1"
    feedback: Water gaps prevent travel between the patches. (misconception: merge-all-land)
"Why" shown after success: Correct. The three patches share no sides.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-water`, facet "cell identity")
Raw input shown:
```
grid = [["1"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A lone land cell is one island.
- ❌ [near-miss] "0"
    feedback: That result follows the require neighbor for island bug, not the exact picture. (misconception: require-neighbor-for-island)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: A lone land cell is one island.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

Completion screen text: ```
PROVEN
Step 1 complete.

You built four fresh inputs and checked five realistic mistakes.

Start Step 2
→
Choose another problem
Practice Step 1 again
```
Progress strip after answering every concept question WRONG and then passing each remedial build: "9 OF 9 VISUAL CHECKS PASSED" · "5 CORRECTIONS"

### S1 remedial builds (shown after a wrong concept answer)
#### After answering concept `exact-picture` wrong with choice [missing-edge]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Picture A
Your choice: This picture drops a connection that appears in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every input detail"
Remedial raw input:
```
grid = [["1","0","1"]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The water gap separates the land cells.; ❌ "1" — That result follows the jump across water bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [islands]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every 1 land cell, including a lone land cell surrounded by water.
Your choice: An island is the connected component that DFS discovers from individual land-cell nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
grid = [["0","1"]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. Only the 1 cell belongs to the land graph.; ❌ "2" — That result follows the include water node bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)" · edges: none
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [eight-direction]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Only when their cells share a side: up, down, left, or right.
Your choice: Diagonal land belongs to separate islands in this problem.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
grid = [["1","1"],["1","0"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Both arms share the top-left land cell.; ❌ "2" — That result follows the fail to join branching land bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(0,1), (0,0)—(1,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [cells]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1 island
Your choice: Side-touching land cells belong to the same island.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
grid = [["1","0","0"],["0","1","0"],["0","0","1"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Each land cell touches the next only at a corner.; ❌ "1" — That result follows the use eight direction dfs bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This merges the lone diagonal cell with another patch.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
grid = [["1"],["1"],["1"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. Vertical side connections make one island.; ❌ "3" — That result follows the check horizontal neighbors only bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Two islands fused"; authored goal, NOT shown to student: "Use two land cells that meet at a corner but do not share a side.")
Everything the student sees (text):
```
S
Savannah's broken search

Savannah adds diagonal moves that the real graph does not have.

Your main goal: Expose Savannah's mistake. Draw two graphs: first the correct graph, then Savannah's graph using the mistake.

CHOOSE THE FIRST LAND CELL
first land cell
OUTPUT
CORRECT OUTPUT
SAVANNAH’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first land cell
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
2 · Savannah's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST LAND CELL / first land cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SAVANNAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(2,0)", "(2,2)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0)`; ❌ curly braces → `{(0,0)}`; ✅ quoted numbers/strings → `["(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
SAVANNAH'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Long island clipped"; authored goal, NOT shown to student: "Make a land strip that extends beyond the starting cell's direct neighbors.")
Everything the student sees (text):
```
B
Brandon's broken search

Brandon visits only the start and its direct neighboring squares.

Your main goal: Expose Brandon's mistake. Draw two graphs: first the correct graph, then Brandon's graph using the mistake.

CHOOSE THE FIRST LAND CELL
first land cell
OUTPUT
CORRECT OUTPUT
BRANDON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first land cell
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
2 · Brandon's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST LAND CELL / first land cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BRANDON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
BRANDON'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Different island chosen"; authored goal, NOT shown to student: "Choose a nonfirst land cell in a component different from the first coordinate.")
Everything the student sees (text):
```
N
Nevaeh's broken search

Nevaeh uses the wrong first land cell.

Your main goal: Expose Nevaeh's mistake. Draw two graphs: first the correct graph, then Nevaeh's graph using the mistake.

CHOOSE THE FIRST LAND CELL
first land cell
OUTPUT
CORRECT OUTPUT
NEVAEH’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first land cell
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
2 · Nevaeh's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST LAND CELL / first land cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NEVAEH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
NEVAEH'S OUTPUT
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
grid = [["1","0","0"],["0","1","0"],["0","0","1"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each entire visible island should be one node.”"
    feedback if wrong: An island is the connected component that DFS discovers from individual land-cell nodes. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (1,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,0) has 0 direct neighbors.
×
An island is the connected component that DFS discovers from individual land-cell nodes. Correct node rule: Every
1
land cell, including a lone land cell surrounded by water.
×
Correct. Node membership alone creates neither a direct edge nor a route.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "(1,1) has exactly 1 direct neighbor."
    feedback if wrong: (1,1) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only land cells that touch at least one other land cell.”"
    feedback if wrong: Isolated land still counts as an island and must not be dropped. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,1).
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(1,1) has 0 direct neighbors.
×
Isolated land still counts as an island and must not be dropped. Correct node rule: Every
1
land cell, including a lone land cell surrounded by water.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,1).
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,1).
- [NO is correct] (local-degree) "(2,2) has exactly 1 direct neighbor."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Both `1` land and `0` water cells.”"
    feedback if wrong: Water blocks travel and should not join separate land regions in this graph model. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
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
Every 1 land cell, including a lone land cell surrounded by water.
EDGES
Only when their cells share a side: up, down, left, or right.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid = [["1"],["1"],["1"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only land cells that touch at least one other land cell.”"
    feedback if wrong: Isolated land still counts as an island and must not be dropped. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
- [YES is correct] (direct-vs-reach) "(2,0) can reach (0,0) through (1,0), but the graph still has no direct (2,0)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid = [["1","0","1"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each entire visible island should be one node.”"
    feedback if wrong: An island is the connected component that DFS discovers from individual land-cell nodes. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid = [["0","1"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Both `1` land and `0` water cells.”"
    feedback if wrong: Water blocks travel and should not join separate land regions in this graph model. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
- [YES is correct] (direct-vs-reach) "(0,1) can reach itself without using an edge, but the graph still has no direct (0,1)—(0,1) edge."
    feedback if wrong: Correct. A zero-step path makes (0,1) reachable from itself; it does not invent a self-edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid = [["1","1"],["1","0"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(0,1), (0,0)—(1,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,1) has exactly 2 direct neighbors."
    feedback if wrong: (0,1) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only land cells that touch at least one other land cell.”"
    feedback if wrong: Isolated land still counts as an island and must not be dropped. Correct node rule: Every `1` land cell, including a lone land cell surrounded by water.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,1)—(0,0) and (0,0)—(1,0), so it should also contain a direct (0,1)—(1,0) edge."
    feedback if wrong: Two direct edges through (0,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Diagonal land is joined into one island
Input shown:
```
REAL PROBLEM INPUT
grid = [["1","0"],["0","1"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numIslands(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const numberOfRows = grid.length;
  const numberOfColumns = grid[0].length;
  const visited = new Set();
  let islands = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (grid[row][column] !== "1" || visited.has(row + "," + column)) {
        continue;
      }
      islands++;
      const stack = [[row, column]];
      visited.add(row + "," + column);
      while (stack.length) {
        const [currentRow, currentColumn] = stack.pop();
        for (const [rowChange, columnChange] of directions) {
          const nextRow = currentRow + rowChange;
          const nextColumn = currentColumn + columnChange;
          const key = nextRow + "," + nextColumn;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === "1" &&
            !visited.has(key)
          ) {
            visited.add(key);
            stack.push([nextRow, nextColumn]);
          }
        }
      }
    }
  }
  return islands;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of islands" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A Water cells should be traversed as bridge nodes.
- B It creates edges between corner-touching land cells.
- C The answer should equal the number of land cells in this case.
Diagnosis answer key + feedback:
- ✅ [diagonal-edge] "It creates edges between corner-touching land cells." — feedback: Correct. Islands connect only through shared sides, so these two cells are separate.
- ❌ [water-node] "Water cells should be traversed as bridge nodes." — feedback: No. Water separates land components and cannot connect them.
- ❌ [count-land] "The answer should equal the number of land cells in this case." — feedback: No. Adjacent land cells may form one island; components, not cells, are counted.
Graph proof shown in feedback: code rule "Eight directions are used, adding a diagonal edge." → changed graph "The two land nodes share only a corner, so the four-neighbor land graph has no edge between them." → boundary "All land is diagonal and none shares a side." → returned value "Two real components collapse into one, changing the island count from 2 to 1."
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
About your diagnosis: No. Water separates land components and cannot connect them.
Code rule: Eight directions are used, adding a diagonal edge. → Changed graph: The two land nodes share only a corner, so the four-neighbor land graph has no edge between them. → Reachable boundary: All land is diagonal and none shares a side.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal land is joined into one island
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Eight directions are used, adding a diagonal edge. → Changed graph: The two land nodes share only a corner, so the four-neighbor land graph has no edge between them. → Reachable boundary: All land is diagonal and none shares a side. → Returned value: Two real components collapse into one, changing the island count from 2 to 1.
```

### S4 case 2 — `remedial-4` · bug: Diagonal land is joined into one island
Input shown:
```
REAL PROBLEM INPUT
grid = [["1","0","0"],["0","1","0"],["0","0","1"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numIslands(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const numberOfRows = grid.length;
  const numberOfColumns = grid[0].length;
  const visited = new Set();
  let islands = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (grid[row][column] !== "1" || visited.has(row + "," + column)) {
        continue;
      }
      islands++;
      const stack = [[row, column]];
      visited.add(row + "," + column);
      while (stack.length) {
        const [currentRow, currentColumn] = stack.pop();
        for (const [rowChange, columnChange] of directions) {
          const nextRow = currentRow + rowChange;
          const nextColumn = currentColumn + columnChange;
          const key = nextRow + "," + nextColumn;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === "1" &&
            !visited.has(key)
          ) {
            visited.add(key);
            stack.push([nextRow, nextColumn]);
          }
        }
      }
    }
  }
  return islands;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of islands" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Water cells should be traversed as bridge nodes.
- B The answer should equal the number of land cells in this case.
- C It creates edges between corner-touching land cells.
Diagnosis answer key + feedback:
- ✅ [diagonal-edge] "It creates edges between corner-touching land cells." — feedback: Correct. Land nodes (0,0), (1,1), and (2,2) share no sides, so they are three islands; diagonal moves invent a chain joining all three. Therefore the shown code returns 1, while the real problem returns 3.
- ❌ [water-node] "Water cells should be traversed as bridge nodes." — feedback: No. Water separates land components and cannot connect them.
- ❌ [count-land] "The answer should equal the number of land cells in this case." — feedback: No. Adjacent land cells may form one island; components, not cells, are counted.
Graph proof shown in feedback: code rule "Eight directions are used, adding a diagonal edge." → changed graph "Nodes: (0,0), (1,1), (2,2). Direct edges: none." → boundary "Land nodes (0,0), (1,1), and (2,2) share no sides, so they are three islands; diagonal moves invent a chain joining all three." → returned value "The shown code returns 1; the source-repo reference solution returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal land is joined into one island
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: Eight directions are used, adding a diagonal edge. → Changed graph: Nodes: (0,0), (1,1), (2,2). Direct edges: none. → Reachable boundary: Land nodes (0,0), (1,1), and (2,2) share no sides, so they are three islands; diagonal moves invent a chain joining all three. → Returned value: The shown code returns 1; the source-repo reference solution returns 3.
```

### S4 case 3 — `four-diagonal-islands` · bug: Diagonal land is joined into one island
Input shown:
```
REAL PROBLEM INPUT
grid = [["1","0","0","0"],["0","1","0","0"],["0","0","1","0"],["0","0","0","1"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numIslands(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const numberOfRows = grid.length;
  const numberOfColumns = grid[0].length;
  const visited = new Set();
  let islands = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (grid[row][column] !== "1" || visited.has(row + "," + column)) {
        continue;
      }
      islands++;
      const stack = [[row, column]];
      visited.add(row + "," + column);
      while (stack.length) {
        const [currentRow, currentColumn] = stack.pop();
        for (const [rowChange, columnChange] of directions) {
          const nextRow = currentRow + rowChange;
          const nextColumn = currentColumn + columnChange;
          const key = nextRow + "," + nextColumn;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === "1" &&
            !visited.has(key)
          ) {
            visited.add(key);
            stack.push([nextRow, nextColumn]);
          }
        }
      }
    }
  }
  return islands;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)", "(3,3)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of islands" · expected buggy output `1` · real correct output `4`
Diagnosis choices as displayed:
- A It creates edges between corner-touching land cells.
- B Water cells should be traversed as bridge nodes.
- C The answer should equal the number of land cells in this case.
Diagnosis answer key + feedback:
- ✅ [diagonal-edge] "It creates edges between corner-touching land cells." — feedback: Correct. The four land cells touch only at corners, so the real graph has four isolated nodes rather than one diagonal chain. Therefore the shown code returns 1, while the real problem returns 4.
- ❌ [water-node] "Water cells should be traversed as bridge nodes." — feedback: No. Water separates land components and cannot connect them.
- ❌ [count-land] "The answer should equal the number of land cells in this case." — feedback: No. Adjacent land cells may form one island; components, not cells, are counted.
Graph proof shown in feedback: code rule "Eight directions are used, adding a diagonal edge." → changed graph "Nodes: (0,0), (1,1), (2,2), (3,3). Direct edges: none." → boundary "The four land cells touch only at corners, so the real graph has four isolated nodes rather than one diagonal chain." → returned value "The shown code returns 1; the source-repo reference solution returns 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal land is joined into one island
INCORRECT OUTPUT
1
CORRECT OUTPUT
4
Code rule: Eight directions are used, adding a diagonal edge. → Changed graph: Nodes: (0,0), (1,1), (2,2), (3,3). Direct edges: none. → Reachable boundary: The four land cells touch only at corners, so the real graph has four isolated nodes rather than one diagonal chain. → Returned value: The shown code returns 1; the source-repo reference solution returns 4.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```