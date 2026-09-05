# Check for Path in a 2D Grid with Obstacles (`gfg-grid-path-exists`) — new, grid

## Problem statement (Description tab)

You are given a square grid `grid` of size n x n. Each cell holds one of four numbers:

- `1` — the source (where you start); there is exactly one
- `2` — the destination (where you want to go); there is exactly one
- `3` — an open cell you may walk through
- `0` — a wall you can never enter

You can move up, down, left, or right between non-wall cells.

Return `true` if there is any way to walk from the source to the destination, and `false` otherwise.

### Examples
- Example 1: input `grid = [[1,3,0],[0,3,0],[0,3,2]]` → output `true`. Start at (0,0). Walk right to (0,1), down to (1,1), down to (2,1), then right to the destination at (2,2).
- Example 2: input `grid = [[1,0,3],[0,0,3],[3,3,2]]` → output `false`. The source at (0,0) is boxed in: its right neighbor (0,1) and lower neighbor (1,0) are both walls, so you can never leave the starting cell.

### Graph rules (authored)
- Nodes: The source, destination, and every open 3 cell.
- Edges: Two non-wall cells that share a side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "non-wall cells")
Raw input shown:
```
grid=[[1,3,2],[0,0,0],[0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The open 3 cell connects source to destination.
- ❌ [wrong] "false"
    feedback: That follows the require direct source target bug. (misconception: require-direct-source-target)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
"Why" shown after success: The open 3 cell connects source to destination.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid=[[1,0],[0,2]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Walls separate the diagonal endpoints.
- ❌ [wrong] "true"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Walls separate the diagonal endpoints.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "non-wall cells")
Raw input shown:
```
grid=[[1,3,2],[0,0,0],[0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (0,1) / (0,2)
2. Picture B / (0,0) / (0,1)
3. Picture C / (0,0) / (0,1) / (0,2)
4. Picture D / (0,0) / (0,1) / (0,2)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1) · edges: (0,0)—(0,1)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)→(0,1), (0,1)→(0,2)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
grid=[[1,3,0],[0,3,2],[0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The route turns down and then right.
- ❌ [wrong] "false"
    feedback: That follows the stop at turn bug. (misconception: stop-at-turn)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,1)—(1,1), (1,1)—(1,2)
"Why" shown after success: The route turns down and then right.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which squares belong in the walkable graph?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which squares belong in the walkable graph?**
Choices as displayed (top to bottom):
1. A / Only the source 1 and destination 2.
2. B / Every square, including walls marked 0.
3. C / Only cells marked 3.
4. D / The source, destination, and every open 3 cell.
Answer key + feedback per choice (data):
- ✅ CORRECT [nonwalls] "The source, destination, and every open 3 cell."
    feedback: Right. Every non-wall square can be part of a route.
- ❌ [special] "Only the source 1 and destination 2."
    feedback: Open 3 cells are the intermediate steps of a path. (misconception: drops-open-cells)
- ❌ [all] "Every square, including walls marked 0."
    feedback: Walls cannot be entered and should not be graph nodes. (misconception: treats-walls-as-walkable)
- ❌ [threes] "Only cells marked 3."
    feedback: The route must include its source and destination too. (misconception: drops-endpoints)
"Why" shown after success: Right. Every non-wall square can be part of a route.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-4`, facet "path existence")
Raw input shown:
```
grid=[[1,2],[0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The source touches the destination directly.
- ❌ [wrong] "false"
    feedback: That follows the require an intermediate cell bug. (misconception: require-an-intermediate-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
"Why" shown after success: The source touches the destination directly.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
Which pair gets a walkable edge?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which pair gets a walkable edge?**
Choices as displayed (top to bottom):
1. A / Two non-wall cells that share a side or corner.
2. B / Two non-wall cells that share a side.
3. C / Two open cells with one wall between them.
4. D / Only moves that get geometrically closer to the destination.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-open] "Two non-wall cells that share a side."
    feedback: Right. That is one legal up, down, left, or right step.
- ❌ [diag-open] "Two non-wall cells that share a side or corner."
    feedback: Diagonal movement is not allowed. (misconception: allows-diagonals)
- ❌ [through-wall] "Two open cells with one wall between them."
    feedback: A wall blocks the route; it cannot be jumped. (misconception: jumps-walls)
- ❌ [toward-target] "Only moves that get geometrically closer to the destination."
    feedback: A valid path may need to detour around walls. (misconception: forbids-detours)
"Why" shown after success: Right. That is one legal up, down, left, or right step.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "path existence")
Raw input shown:
```
grid = [[1,3,0],[0,3,0],[0,3,2]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / the 3 cells form a side-connected route
2. B / the route must be a straight line
3. C / with diagonal moves
4. D / 3 is not the destination
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "the 3 cells form a side-connected route"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "the route must be a straight line"
    feedback: The open 3 cells make a winding side-connected route. (misconception: checks-direct-line-only)
- ❌ [wrong-2] "with diagonal moves"
    feedback: No diagonal is needed; every step shares a side. (misconception: misreads-valid-route)
- ❌ [wrong-3] "3 is not the destination"
    feedback: Cells marked 3 are legal intermediate steps. (misconception: treats-open-as-wall)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "path existence")
Raw input shown:
```
grid = [[1,0,3],[0,0,3],[3,3,2]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / walls box the source away from every 3
2. B / the lower 3 region touches the destination
3. C / by moving diagonally
4. D / source is on an edge
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "walls box the source away from every 3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "the lower 3 region touches the destination"
    feedback: The source is boxed by walls and cannot reach the lower open region. (misconception: ignores-source-enclosure)
- ❌ [wrong-2] "by moving diagonally"
    feedback: Diagonal movement is never allowed. (misconception: allows-diagonals)
- ❌ [wrong-3] "source is on an edge"
    feedback: Being on the grid edge is legal; the walls cause failure. (misconception: blames-border)
"Why" shown after success: Right. The picture gives exactly this result.
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
grid=[[1,3],[0,2]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The 3 touches both endpoints by sides.; ❌ "false" — That follows the miss final down step bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [special]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The source, destination, and every open 3 cell.
Your choice: Open 3 cells are the intermediate steps of a path.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0,2],[0,0,0],[0,0,0]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. The 0 cell is not a node.; ❌ "true" — That follows the walk through wall bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [diag-open]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Two non-wall cells that share a side.
Your choice: Diagonal movement is not allowed.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0,0],[3,0,0],[2,0,0]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Vertical side moves are legal.; ❌ "false" — That follows the horizontal only search bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
the 3 cells form a side-connected route
Your choice: The open 3 cells make a winding side-connected route.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,3],[3,2]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Either side-connected branch reaches 2.; ❌ "false" — That follows the mark before exploring bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
walls box the source away from every 3
Your choice: The source is boxed by walls and cannot reach the lower open region.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,0],[3,2]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The route goes down then right.; ❌ "false" — That follows the require straight route bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Source mix-up"; authored goal, NOT shown to student: "Use (0,0) as the real source, but make the mistaken search begin at (0,1).")
Everything the student sees (text):
```
E
Erick's broken search

Erick ignores the chosen source cell and uses a different one.

Your main goal: Expose Erick's mistake. Draw two graphs: first the correct graph, then Erick's graph using the mistake.

CHOOSE THE SOURCE CELL
source cell
OUTPUT
CORRECT OUTPUT
ERICK’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source cell
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
2 · Erick's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE CELL / source cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ERICK’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(0,2)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,1)\",\"(0,2)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,1)","(0,2)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,1)—(0,2)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0)`; ❌ curly braces → `{(0,0)}`; ✅ quoted numbers/strings → `["(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
ERICK'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `add-diagonals` (authored level "Blocked corner"; authored goal, NOT shown to student: "Use a corner touch that must not become a path.")
Everything the student sees (text):
```
M
Margaret's broken search

Margaret treats corner-touching squares as direct neighbors.

Your main goal: Expose Margaret's mistake. Draw two graphs: first the correct graph, then Margaret's graph using the mistake.

CHOOSE THE SOURCE CELL
source cell
OUTPUT
CORRECT OUTPUT
MARGARET’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source cell
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
2 · Margaret's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE CELL / source cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MARGARET’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
MARGARET'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Dead-end detour"; authored goal, NOT shown to student: "Give the source a dead end before the route to the destination.")
Everything the student sees (text):
```
J
Jace's broken search

Jace chooses the first route and forgets the other branches.

Your main goal: Expose Jace's mistake. Draw two graphs: first the correct graph, then Jace's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE SOURCE CELL
source cell
OUTPUT
CORRECT OUTPUT
JACE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source cell
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
2 · Jace's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE CELL / source cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JACE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
JACE'S OUTPUT
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
grid=[[1,0,0],[3,0,0],[2,0,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every square, including walls marked 0.”"
    feedback if wrong: Walls cannot be entered and should not be graph nodes. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (2,0) through (1,0), but the graph still has no direct (0,0)—(2,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Walls cannot be entered and should not be graph nodes. Correct node rule: The source, destination, and every open 3 cell.
×
Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
×
(1,0) has 2 direct neighbors.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "(2,0) has exactly 1 direct neighbor."
    feedback if wrong: (2,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells marked 3.”"
    feedback if wrong: The route must include its source and destination too. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "(2,0) can reach (0,0) through (1,0), but the graph still has no direct (2,0)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(2,0) has 1 direct neighbor.
×
The route must include its source and destination too. Correct node rule: The source, destination, and every open 3 cell.
×
Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the source 1 and destination 2.”"
    feedback if wrong: Open 3 cells are the intermediate steps of a path. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (2,0) through (1,0), but the graph still has no direct (0,0)—(2,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
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
The source, destination, and every open 3 cell.
EDGES
Two non-wall cells that share a side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=[[1,3],[3,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells marked 3.”"
    feedback if wrong: The route must include its source and destination too. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "(0,1) can reach (1,0) through (1,1), but the graph still has no direct (0,1)—(1,0) edge."
    feedback if wrong: Right. A multi-step route through (1,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 2 direct neighbors."
    feedback if wrong: (1,1) has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=[[1,0],[3,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,0) and (1,0)—(1,1), so it should also contain a direct (0,0)—(1,1) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,0) has exactly 3 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Every square, including walls marked 0.”"
    feedback if wrong: Walls cannot be entered and should not be graph nodes. Correct node rule: The source, destination, and every open 3 cell.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=[[1,3],[0,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the source 1 and destination 2.”"
    feedback if wrong: Open 3 cells are the intermediate steps of a path. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "(1,1) can reach (0,0) through (0,1), but the graph still has no direct (1,1)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=[[1,0,2],[0,0,0],[0,0,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells marked 3.”"
    feedback if wrong: The route must include its source and destination too. Correct node rule: The source, destination, and every open 3 cell.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
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

### S4 case 1 — `authored-deep-case` · bug: Walls can be crossed diagonally
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 0], [0, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pathExists(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1) {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === 2) {
      return true;
    }
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
          grid[nextRow][nextColumn] !== 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The scan fails to save the destination before DFS begins for the shown graph.
- B The code treats value 2 as a wall because it is not value 3 for the shown graph.
- C The two direction loops allow the source to jump diagonally to the destination.
Diagnosis answer key + feedback:
- ❌ [missing-destination] "The scan fails to save the destination before DFS begins for the shown graph." — feedback: The destination is detected when it is popped; the illegal move is the issue.
- ✅ [eight-directions] "The two direction loops allow the source to jump diagonally to the destination." — feedback: Exactly. The real graph contains two isolated walkable cells.
- ❌ [wall-test] "The code treats value 2 as a wall because it is not value 3 for the shown graph." — feedback: The condition accepts every nonzero cell, including the destination.
Graph proof shown in feedback: code rule "Every nonzero cell within any of eight offsets becomes a neighbor." → changed graph "Source (0,0) and destination (1,1) are walkable nodes with no side edge between them." → boundary "The only geometric contact is diagonal, with walls on both side routes." → returned value "The helper reaches 2 and returns true, while legal movement returns false."
Output-format probes: ❌ Capitalized boolean → `True`; ❌ trailing period → `true.`
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
About your diagnosis: The destination is detected when it is popped; the illegal move is the issue.
Code rule: Every nonzero cell within any of eight offsets becomes a neighbor. → Changed graph: Source (0,0) and destination (1,1) are walkable nodes with no side edge between them. → Reachable boundary: The only geometric contact is diagonal, with walls on both side routes.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Walls can be crossed diagonally
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every nonzero cell within any of eight offsets becomes a neighbor. → Changed graph: Source (0,0) and destination (1,1) are walkable nodes with no side edge between them. → Reachable boundary: The only geometric contact is diagonal, with walls on both side routes. → Returned value: The helper reaches 2 and returns true, while legal movement returns false.
```

### S4 case 2 — `new-three-cell-diagonal` · bug: Walls can be crossed diagonally
Input shown:
```
REAL PROBLEM INPUT
grid: [[1, 0, 0], [0, 3, 0], [0, 0, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pathExists(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1) {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === 2) {
      return true;
    }
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
          grid[nextRow][nextColumn] !== 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The direction loops create source→3→destination using two diagonal jumps.
- B The source scan overwrites the source with the middle value 3.
- C The seen key confuses row 1,column 1 with row 11,column 0.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The source scan overwrites the source with the middle value 3." — feedback: Only cells equal to 1 set start, so the middle 3 cannot replace it.
- ✅ [eight-directions] "The direction loops create source→3→destination using two diagonal jumps." — feedback: Exactly. None of the three walkable cells share a side.
- ❌ [wrong-visited] "The seen key confuses row 1,column 1 with row 11,column 0." — feedback: Keys include a comma, so (1,1) cannot collide with a different row-column pair.
Graph proof shown in feedback: code rule "All eight offsets become walkable-neighbor edges." → changed graph "Source, open cell, and destination are three isolated walkable nodes." → boundary "The only visual chain is diagonal at both steps." → returned value "The code reaches value 2 and returns true; the real graph returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Walls can be crossed diagonally
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: All eight offsets become walkable-neighbor edges. → Changed graph: Source, open cell, and destination are three isolated walkable nodes. → Reachable boundary: The only visual chain is diagonal at both steps. → Returned value: The code reaches value 2 and returns true; the real graph returns false.
```

### S4 case 3 — `new-reverse-diagonal` · bug: Walls can be crossed diagonally
Input shown:
```
REAL PROBLEM INPUT
grid: [[0, 0, 1], [0, 3, 0], [2, 0, 0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pathExists(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === 1) {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === 2) {
      return true;
    }
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
          grid[nextRow][nextColumn] !== 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,2)", "(1,1)", "(2,0)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The scan begins from the last nonzero cell rather than the cell containing 1.
- B The DFS crosses the reverse diagonal from (0,2) through (1,1) to (2,0).
- C The destination value 2 is mistaken for an ordinary open cell and never recognized.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The scan begins from the last nonzero cell rather than the cell containing 1." — feedback: The source scan tests value 1 and correctly selects (0,2).
- ✅ [eight-directions] "The DFS crosses the reverse diagonal from (0,2) through (1,1) to (2,0)." — feedback: Exactly. Legal four-way movement cannot leave the source.
- ❌ [wrong-visited] "The destination value 2 is mistaken for an ordinary open cell and never recognized." — feedback: Value 2 is explicitly recognized when popped; the problem is how DFS reaches it.
Graph proof shown in feedback: code rule "Eight-direction expansion invents both diagonal links." → changed graph "The reverse-diagonal walkable cells have no side edges." → boundary "Walls occupy every legal first side move from the source." → returned value "The helper returns true through illegal corners; the correct result is false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Walls can be crossed diagonally
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Eight-direction expansion invents both diagonal links. → Changed graph: The reverse-diagonal walkable cells have no side edges. → Reachable boundary: Walls occupy every legal first side move from the source. → Returned value: The helper returns true through illegal corners; the correct result is false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```