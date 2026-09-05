# Longest Increasing Path in a Matrix (`longest-increasing-path-in-a-matrix`) — original, grid

## Problem statement (Description tab)

You are given an `m x n` grid of integers called `matrix`. Starting from any cell, you may move up, down, left, or right (no diagonals, and no wrapping around the edges) — but only onto a cell whose value is **strictly greater** than the value of the cell you are standing on.

Return the length of the **longest strictly increasing path** in the matrix, measured in number of cells. A single cell by itself counts as a path of length 1.

### Examples
- Example 1: input `matrix = [[9,9,4],[6,6,8],[2,1,1]]` → output `4`. The longest increasing path is [1, 2, 6, 9], which has 4 cells.
- Example 2: input `matrix = [[3,4,5],[3,2,6],[2,2,1]]` → output `4`. The longest increasing path is [3, 4, 5, 6]. Diagonal moves are not allowed.
- Example 3: input `matrix = [[1]]` → output `1`. A single cell is a path of length 1.

### Graph rules (authored)
- Nodes: Every matrix cell, including duplicate values as separate nodes.
- Edges: Only when B shares a side with A and B's value is strictly larger.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-chain`, facet "longest path length")
Raw input shown:
```
matrix = [[1,2],[4,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The path 1→2→3→4 contains four cells.
- ❌ [near-miss] "3"
    feedback: That result follows the count edges not nodes bug, not the exact picture. (misconception: count-edges-not-nodes)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,1)→(1,0)
"Why" shown after success: The path 1→2→3→4 contains four cells.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-equals`, facet "increasing side moves")
Raw input shown:
```
matrix = [[2,2],[2,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Equal 2s do not form increasing edges.
- ❌ [near-miss] "3"
    feedback: That result follows the allow equal step bug, not the exact picture. (misconception: allow-equal-step)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,1)→(1,1), (1,0)→(1,1)
"Why" shown after success: Equal 2s do not form increasing edges.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact cell values")
Raw input shown:
```
matrix = [[1,2],[4,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (1,0) / (1,1)
2. Picture C / (0,0) / (0,1) / (1,0) / (1,1)
3. Picture D / (0,0) / (0,1) / (1,0)
4. Picture A / (0,0) / (0,1) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,1)→(1,0)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,1)→(0,0), (1,0)→(0,0), (1,1)→(0,1), (1,0)→(1,1)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)→(0,1), (0,0)→(1,0)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "cell identity")
Raw input shown:
```
Which cells become nodes for the longest increasing path problem?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells become nodes for the longest increasing path problem?**
Choices as displayed (top to bottom):
1. A / One node per distinct number appearing in the matrix.
2. B / Only cells that belong to one longest path.
3. C / Only cells larger than all of their side-neighbors.
4. D / Every matrix cell, including duplicate values as separate nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [every-cell] "Every matrix cell, including duplicate values as separate nodes."
    feedback: Correct. Position matters, so equal numbers in different cells are different nodes.
- ❌ [unique-values] "One node per distinct number appearing in the matrix."
    feedback: Merging equal values loses their positions and their different neighbors. (misconception: merge-equal-cell-values)
- ❌ [increasing-only] "Only cells that belong to one longest path."
    feedback: The longest path is unknown until all possible starting cells and moves are modeled. (misconception: only-answer-path-nodes)
- ❌ [local-maxima] "Only cells larger than all of their side-neighbors."
    feedback: Those may be path endpoints, but smaller cells are the starts and middle steps. (misconception: only-peak-nodes)
"Why" shown after success: Correct. Position matters, so equal numbers in different cells are different nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-diagonal`, facet "cell identity")
Raw input shown:
```
matrix = [[1,9],[9,2]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The diagonal 1→2 is not a legal move.
- ❌ [near-miss] "3"
    feedback: That result follows the allow diagonal step bug, not the exact picture. (misconception: allow-diagonal-step)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (1,1)→(0,1), (1,1)→(1,0)
"Why" shown after success: The diagonal 1→2 is not a legal move.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "increasing side moves")
Raw input shown:
```
When should there be an arrow from cell A to a neighboring cell B?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should there be an arrow from cell A to a neighboring cell B?**
Choices as displayed (top to bottom):
1. A / When B shares a side and B's value is greater than or equal to A's.
2. B / When B is larger and touches A by a side or corner.
3. C / Only when B shares a side with A and B's value is strictly larger.
4. D / Draw arrows both ways between side-neighbors whenever their values differ.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-larger] "Only when B shares a side with A and B's value is strictly larger."
    feedback: Correct. Each arrow is one legal increasing step.
- ❌ [side-nondecreasing] "When B shares a side and B's value is greater than or equal to A's."
    feedback: Equal values are not strictly increasing and must not get an arrow. (misconception: allow-equal-step)
- ❌ [eight-way-larger] "When B is larger and touches A by a side or corner."
    feedback: Diagonal moves are not allowed, even when the diagonal value is larger. (misconception: allow-diagonal-step)
- ❌ [both-directions] "Draw arrows both ways between side-neighbors whenever their values differ."
    feedback: Only the smaller-to-larger direction is legal. The reverse move decreases. (misconception: ignore-increasing-direction)
"Why" shown after success: Correct. Each arrow is one legal increasing step.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "longest path length")
Raw input shown:
```
matrix = [[9,9,4],[6,6,8],[2,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In [[9,9,4],[6,6,8],[2,1,1]], how long is the pictured path 1→2→6→9?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 5
3. C / 6
4. D / 4 cells
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "4 cells"
    feedback: Correct. Path length counts cells, not arrows.
- ❌ [three] "3"
    feedback: This counts moves/edges instead of cells. (misconception: count-edges)
- ❌ [five] "5"
    feedback: Equal 9s cannot extend the strictly increasing path. (misconception: allow-equal-nine)
- ❌ [six] "6"
    feedback: The path cannot collect every larger number without respecting side adjacency. (misconception: ignore-adjacency)
"Why" shown after success: Correct. Path length counts cells, not arrows.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-single`, facet "longest path length")
Raw input shown:
```
matrix = [[7]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A one-cell path has length one even with no edge.
- ❌ [near-miss] "0"
    feedback: That result follows the count only moves bug, not the exact picture. (misconception: count-only-moves)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: A one-cell path has length one even with no edge.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "longest path length")
Raw input shown:
```
matrix = [[3,4,5],[3,2,6],[2,2,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [[3,4,5],[3,2,6],[2,2,1]], which longest path is legal?**
Choices as displayed (top to bottom):
1. A / 2→3→4→5→6, length 5
2. B / 3→4→5, length 3
3. C / 3→4→5→6, length 4
4. D / 3→3→2→5→6, length 5
Answer key + feedback per choice (data):
- ✅ CORRECT [3456] "`3→4→5→6`, length 4"
    feedback: Correct. Every step shares a side and increases.
- ❌ [23456] "`2→3→4→5→6`, length 5"
    feedback: The chosen 2 and 3 are diagonal, so that first step is illegal. (misconception: allow-diagonal)
- ❌ [345] "`3→4→5`, length 3"
    feedback: Cell 5 has a side-adjacent larger 6. (misconception: stop-before-valid-neighbor)
- ❌ [33256] "`3→3→2→5→6`, length 5"
    feedback: Equal and decreasing moves are forbidden. (misconception: ignore-strict-increase)
"Why" shown after success: Correct. Every step shares a side and increases.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

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
matrix = [[1],[2],[3],[4]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 4
Remedial answer key: ✅ "4" — Correct. All four cells form one increasing path.; ❌ "3" — That result follows the count edges not cells bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)", "(3,0)" · edges: (0,0)→(1,0), (1,0)→(2,0), (2,0)→(3,0)
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [unique-values]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every matrix cell, including duplicate values as separate nodes.
Your choice: Merging equal values loses their positions and their different neighbors.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
matrix = [[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Two equal cells are distinct nodes but no increasing edge joins them.; ❌ "2" — That result follows the merge or connect equal values bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)" · edges: none
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [side-nondecreasing]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Only when B shares a side with A and B's value is strictly larger.
Your choice: Equal values are not strictly increasing and must not get an arrow.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
matrix = [[3,2,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Edges point from smaller to larger, so the path is 1→2→3.; ❌ "1" — That result follows the follow only input reading direction bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,1)→(0,0), (0,2)→(0,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
4 cells
Your choice: This counts moves/edges instead of cells.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
matrix = [[1,2],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 4
Remedial answer key: ✅ "3" — Correct. A path chooses one of the 2-valued branches; it cannot use both.; ❌ "4" — That result follows the combine two branches bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [23456]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3→4→5→6, length 4
Your choice: The chosen 2 and 3 are diagonal, so that first step is illegal.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
matrix = [[1,3],[2,4]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. Both branches may reach 4; memoization stores a length without deleting the node globally.; ❌ "2" — That result follows the global visited skips shared tail bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Diagonal climb"; authored goal, NOT shown to student: "Place a larger value only at a diagonal, where no legal move exists.")
Everything the student sees (text):
```
A
Ava's broken search

Ava allows diagonal steps even though only side moves are legal.

Your main goal: Expose Ava's mistake. Draw two graphs: first the correct graph, then Ava's graph using the mistake.

CHOOSE THE STARTING CELL
starting cell
OUTPUT
CORRECT OUTPUT
AVA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting cell
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
2 · Ava's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CELL / starting cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AVA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,0)", "(1,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: DIRECTED · nodes: (0,0), (1,1) · edges: (0,0)→(1,1)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0)`; ❌ curly braces → `{(0,0)}`; ✅ quoted numbers/strings → `["(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
AVA'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Climb ends early"; authored goal, NOT shown to student: "Create a strictly increasing side path at least two moves long.")
Everything the student sees (text):
```
D
Daniel's broken search

Daniel never explores beyond the start's immediate neighbors.

Your main goal: Expose Daniel's mistake. Draw two graphs: first the correct graph, then Daniel's graph using the mistake.

CHOOSE THE STARTING CELL
starting cell
OUTPUT
CORRECT OUTPUT
DANIEL’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting cell
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
2 · Daniel's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CELL / starting cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | DANIEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)→(0,1), (0,1)→(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: DIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)→(0,1), (0,1)→(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
DANIEL'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "One ascent kept"; authored goal, NOT shown to student: "Give a low cell two increasing side-neighbors and make the earlier branch distinct.")
Everything the student sees (text):
```
O
Olivia's broken search

Olivia keeps only the last branch it sees.

Your main goal: Expose Olivia's mistake. Draw two graphs: first the correct graph, then Olivia's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE STARTING CELL
starting cell
OUTPUT
CORRECT OUTPUT
OLIVIA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting cell
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
2 · Olivia's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CELL / starting cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | OLIVIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)→(0,1), (0,0)→(1,0), (1,0)→(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: DIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)→(0,1), (0,0)→(1,0), (1,0)→(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
OLIVIA'S OUTPUT
["(0,0)","(1,0)","(2,0)"]
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
matrix = [[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells larger than all of their side-neighbors.”"
    feedback if wrong: Those may be path endpoints, but smaller cells are the starts and middle steps. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,1).
- [NO is correct] (local-degree) "(0,1) has exactly 1 outgoing direct edge."
    feedback if wrong: (0,1) has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Those may be path endpoints, but smaller cells are the starts and middle steps. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,1).
×
(0,1) has 0 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,0) has exactly 0 outgoing direct edges."
    feedback if wrong: (0,0) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node per distinct number appearing in the matrix.”"
    feedback if wrong: Merging equal values loses their positions and their different neighbors. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. Node membership alone creates neither a direct edge nor a route.
×
(0,0) has 0 outgoing direct edges.
×
Merging equal values loses their positions and their different neighbors. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,1) has exactly 1 outgoing direct edge."
    feedback if wrong: (0,1) has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells that belong to one longest path.”"
    feedback if wrong: The longest path is unknown until all possible starting cells and moves are modeled. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,1).
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
Use this graph model

Other graph models can be valid, but this checker expects this one.

NODES
Every matrix cell, including duplicate values as separate nodes.
EDGES
Only when B shares a side with A and B's value is strictly larger.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
matrix = [[3,2,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,1)→(0,0), (0,2)→(0,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 outgoing direct edges."
    feedback if wrong: (0,0) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node per distinct number appearing in the matrix.”"
    feedback if wrong: Merging equal values loses their positions and their different neighbors. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
- [YES is correct] (direct-vs-reach) "(0,2) can reach (0,0) through (0,1), but the graph still has no direct (0,2)→(0,0) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
matrix = [[1,2],[2,3]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(1,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (1,1) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells larger than all of their side-neighbors.”"
    feedback if wrong: Those may be path endpoints, but smaller cells are the starts and middle steps. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (1,0), but the graph still has no direct (0,0)→(1,1) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
matrix = [[1,3],[2,4]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(0,1) and (0,1)→(1,1), so it should also contain a direct (0,0)→(1,1) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 3 outgoing direct edges."
    feedback if wrong: (0,0) has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells that belong to one longest path.”"
    feedback if wrong: The longest path is unknown until all possible starting cells and moves are modeled. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
Result: PASSED

### S3 Q5
Raw input shown:
```
matrix = [[1],[2],[3],[4]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)", "(3,0)" · edges: (0,0)→(1,0), (1,0)→(2,0), (2,0)→(3,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node per distinct number appearing in the matrix.”"
    feedback if wrong: Merging equal values loses their positions and their different neighbors. Correct node rule: Every matrix cell, including duplicate values as separate nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has (1,0)→(2,0) and (2,0)→(3,0), so it should also contain a direct (1,0)→(3,0) edge."
    feedback if wrong: Two direct edges through (2,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,0) has exactly 0 outgoing direct edges."
    feedback if wrong: (1,0) has 1 outgoing direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Movement is limited to right and down
Input shown:
```
REAL PROBLEM INPUT
matrix = [[1,2],[4,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function longestIncreasingPath(matrix) {
  const numberOfRows = matrix.length;
  const numberOfColumns = matrix[0].length;
  const pathLengthFrom = Array.from(
    { length: numberOfRows },
    () => Array(numberOfColumns).fill(0),
  );
  const allowedDirections = [[1, 0], [0, 1]];

  function findPathLength(row, column) {
    if (pathLengthFrom[row][column] > 0) return pathLengthFrom[row][column];
    let longestLength = 1;
    for (const [rowChange, columnChange] of allowedDirections) {
      const nextRow = row + rowChange;
      const nextColumn = column + columnChange;
      const isInBounds = nextRow < numberOfRows && nextColumn < numberOfColumns;
      if (isInBounds && matrix[nextRow][nextColumn] > matrix[row][column]) {
        const candidateLength = 1 + findPathLength(nextRow, nextColumn);
        longestLength = Math.max(longestLength, candidateLength);
      }
    }
    pathLengthFrom[row][column] = longestLength;
    return longestLength;
  }

  let longestLength = 0;
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      longestLength = Math.max(longestLength, findPathLength(row, column));
    }
  }
  return longestLength;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,0)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,1)→(1,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Length of the longest strictly increasing path" · expected buggy output `3` · real correct output `4`
Diagnosis choices as displayed:
- A It must add diagonal neighbors on the shown input.
- B The comparison should allow equal values.
- C It omits legal up and left neighbor moves.
Diagnosis answer key + feedback:
- ✅ [two-directions] "It omits legal up and left neighbor moves." — feedback: Correct. The longest path is 1→2→3→4, and its final move goes left.
- ❌ [diagonals] "It must add diagonal neighbors on the shown input." — feedback: No. Only four side-sharing directions are legal; diagonals would invent edges.
- ❌ [nondecreasing] "The comparison should allow equal values." — feedback: No. The path must be strictly increasing.
Graph proof shown in feedback: code rule "Only down and right candidate edges are generated." → changed graph "Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left." → boundary "The unique length-4 increasing route changes direction and ends with a left move." → returned value "The code sees at most three nodes in one increasing route, so it returns 3 instead of 4."
Output-format probes: ❌ quoted number → `"3"`; ❌ trailing period → `3.`
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
About your diagnosis: No. Only four side-sharing directions are legal; diagonals would invent edges.
Code rule: Only down and right candidate edges are generated. → Changed graph: Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left. → Reachable boundary: The unique length-4 increasing route changes direction and ends with a left move.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Movement is limited to right and down
INCORRECT OUTPUT
3
CORRECT OUTPUT
4
Code rule: Only down and right candidate edges are generated. → Changed graph: Directed edges go from each cell to every larger orthogonal neighbor, including 3→4 to the left. → Reachable boundary: The unique length-4 increasing route changes direction and ends with a left move. → Returned value: The code sees at most three nodes in one increasing route, so it returns 3 instead of 4.
```

### S4 case 2 — `remedial-3` · bug: Movement is limited to right and down
Input shown:
```
REAL PROBLEM INPUT
matrix = [[3,2,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function longestIncreasingPath(matrix) {
  const numberOfRows = matrix.length;
  const numberOfColumns = matrix[0].length;
  const pathLengthFrom = Array.from(
    { length: numberOfRows },
    () => Array(numberOfColumns).fill(0),
  );
  const allowedDirections = [[1, 0], [0, 1]];

  function findPathLength(row, column) {
    if (pathLengthFrom[row][column] > 0) return pathLengthFrom[row][column];
    let longestLength = 1;
    for (const [rowChange, columnChange] of allowedDirections) {
      const nextRow = row + rowChange;
      const nextColumn = column + columnChange;
      const isInBounds = nextRow < numberOfRows && nextColumn < numberOfColumns;
      if (isInBounds && matrix[nextRow][nextColumn] > matrix[row][column]) {
        const candidateLength = 1 + findPathLength(nextRow, nextColumn);
        longestLength = Math.max(longestLength, candidateLength);
      }
    }
    pathLengthFrom[row][column] = longestLength;
    return longestLength;
  }

  let longestLength = 0;
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      longestLength = Math.max(longestLength, findPathLength(row, column));
    }
  }
  return longestLength;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,1)→(0,0), (0,2)→(0,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Length of the longest strictly increasing path" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A It omits legal up and left neighbor moves.
- B It must add diagonal neighbors on the shown input.
- C The comparison should allow equal values.
Diagnosis answer key + feedback:
- ✅ [two-directions] "It omits legal up and left neighbor moves." — feedback: Correct. Values form the leftward increasing chain (0,2)=1→(0,1)=2→(0,0)=3, and the code creates none of those left edges. Therefore the shown code returns 1, while the real problem returns 3.
- ❌ [diagonals] "It must add diagonal neighbors on the shown input." — feedback: No. Only four side-sharing directions are legal; diagonals would invent edges.
- ❌ [nondecreasing] "The comparison should allow equal values." — feedback: No. The path must be strictly increasing.
Graph proof shown in feedback: code rule "Only down and right candidate edges are generated." → changed graph "Nodes: (0,0), (0,1), (0,2). Direct arrows: (0,1)→(0,0); (0,2)→(0,1)." → boundary "Values form the leftward increasing chain (0,2)=1→(0,1)=2→(0,0)=3, and the code creates none of those left edges." → returned value "The shown code returns 1; the source-repo reference solution returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Movement is limited to right and down
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: Only down and right candidate edges are generated. → Changed graph: Nodes: (0,0), (0,1), (0,2). Direct arrows: (0,1)→(0,0); (0,2)→(0,1). → Reachable boundary: Values form the leftward increasing chain (0,2)=1→(0,1)=2→(0,0)=3, and the code creates none of those left edges. → Returned value: The shown code returns 1; the source-repo reference solution returns 3.
```

### S4 case 3 — `increasing-path-moves-left` · bug: Movement is limited to right and down
Input shown:
```
REAL PROBLEM INPUT
matrix = [[4,3,2,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function longestIncreasingPath(matrix) {
  const numberOfRows = matrix.length;
  const numberOfColumns = matrix[0].length;
  const pathLengthFrom = Array.from(
    { length: numberOfRows },
    () => Array(numberOfColumns).fill(0),
  );
  const allowedDirections = [[1, 0], [0, 1]];

  function findPathLength(row, column) {
    if (pathLengthFrom[row][column] > 0) return pathLengthFrom[row][column];
    let longestLength = 1;
    for (const [rowChange, columnChange] of allowedDirections) {
      const nextRow = row + rowChange;
      const nextColumn = column + columnChange;
      const isInBounds = nextRow < numberOfRows && nextColumn < numberOfColumns;
      if (isInBounds && matrix[nextRow][nextColumn] > matrix[row][column]) {
        const candidateLength = 1 + findPathLength(nextRow, nextColumn);
        longestLength = Math.max(longestLength, candidateLength);
      }
    }
    pathLengthFrom[row][column] = longestLength;
    return longestLength;
  }

  let longestLength = 0;
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      longestLength = Math.max(longestLength, findPathLength(row, column));
    }
  }
  return longestLength;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(0,3)" · edges: (0,3)→(0,2), (0,2)→(0,1), (0,1)→(0,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Length of the longest strictly increasing path" · expected buggy output `1` · real correct output `4`
Diagnosis choices as displayed:
- A It must add diagonal neighbors on the shown input.
- B It omits legal up and left neighbor moves.
- C The comparison should allow equal values.
Diagnosis answer key + feedback:
- ✅ [two-directions] "It omits legal up and left neighbor moves." — feedback: Correct. The full increasing chain runs left from value 1 to 4, a direction the code never explores. Therefore the shown code returns 1, while the real problem returns 4.
- ❌ [diagonals] "It must add diagonal neighbors on the shown input." — feedback: No. Only four side-sharing directions are legal; diagonals would invent edges.
- ❌ [nondecreasing] "The comparison should allow equal values." — feedback: No. The path must be strictly increasing.
Graph proof shown in feedback: code rule "Only down and right candidate edges are generated." → changed graph "Nodes: (0,0), (0,1), (0,2), (0,3). Direct arrows: (0,3)→(0,2); (0,2)→(0,1); (0,1)→(0,0)." → boundary "The full increasing chain runs left from value 1 to 4, a direction the code never explores." → returned value "The shown code returns 1; the source-repo reference solution returns 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Movement is limited to right and down
INCORRECT OUTPUT
1
CORRECT OUTPUT
4
Code rule: Only down and right candidate edges are generated. → Changed graph: Nodes: (0,0), (0,1), (0,2), (0,3). Direct arrows: (0,3)→(0,2); (0,2)→(0,1); (0,1)→(0,0). → Reachable boundary: The full increasing chain runs left from value 1 to 4, a direction the code never explores. → Returned value: The shown code returns 1; the source-repo reference solution returns 4.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```