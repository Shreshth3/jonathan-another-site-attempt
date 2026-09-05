# 10 Kinds of People (`ten-kinds-of-people`) — new, grid

## Problem statement (Description tab)

The world's map is a rectangular grid given as an array of strings, where every character is either `'1'` or `'0'`. Decimal people may only stand on `'1'` cells, and binary people may only stand on `'0'` cells. Anyone can step up, down, left, or right to a neighboring cell of the SAME character - never diagonally, and never onto the other kind of cell.

You are given the map `grid` and a list `queries`. Each query is `[r1, c1, r2, c2]` (all 0-indexed): a starting cell `(r1, c1)` and a target cell `(r2, c2)`.

Write a function `whoCanTravel(grid, queries)` that returns an array with one answer per query, in order:

- `"decimal"` if both cells contain `'1'` and you can walk between them stepping only on `'1'` cells,
- `"binary"` if both cells contain `'0'` and you can walk between them stepping only on `'0'` cells,
- `"neither"` otherwise (for example, if the two cells hold different characters, or they sit in separate regions).

A query may start and end at the same cell - the person standing there can always "travel" to it.

### Examples
- Example 1: input `grid = ["1100"], queries = [[0,0,0,3],[0,0,0,0]]` → output `["neither", "decimal"]`. Query 1: (0,0) holds '1' but (0,3) holds '0', so no single kind of person can stand on both - "neither". Query 2: start and target are the same '1' cell, so a decimal person is already there - "decimal".
- Example 2: input `grid = ["110", "010", "011"], queries = [[0,0,2,2],[2,0,0,2]]` → output `["decimal", "neither"]`. Query 1: the '1' path (0,0) -> (0,1) -> (1,1) -> (2,1) -> (2,2) connects the cells, so "decimal". Query 2: the '0' region around (2,0) is only {(2,0),(1,0)} - the DFS is blocked by '1's - and (0,2) is a separate '0' region, so "neither".

### Graph rules (authored)
- Nodes: Every grid cell, whether it contains 0 or 1.
- Edges: They share a side and contain the same digit.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "exact cells")
Raw input shown:
```
grid=["110","010"], queries=[[0,0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["decimal"]
2. ["neither"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["decimal"]"
    feedback: Correct. The two 1 cells connect through (0,1).
- ❌ [wrong] "["neither"]"
    feedback: That follows the search direct neighbors only bug. (misconception: search-direct-neighbors-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,1)—(1,1), (0,2)—(1,2)
"Why" shown after success: The two 1 cells connect through (0,1).
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact cells")
Raw input shown:
```
grid=["110","010"], queries=[[0,0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (0,2) / (1,0) / (1,1)
2. Picture C / (0,0) / (0,1) / (0,2) / (1,0) / (1,1) / (1,2)
3. Picture A / (0,0) / (0,1) / (0,2) / (1,0) / (1,1) / (1,2)
4. Picture D / (0,0) / (0,1) / (0,2) / (1,0) / (1,1) / (1,2)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (0,2), (1,0), (1,1), (1,2) · edges: (0,0)—(0,1), (0,1)—(1,1), (0,2)—(1,2)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1), (0,2), (1,0), (1,1) · edges: (0,0)—(0,1), (0,1)—(1,1)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (0,1), (0,2), (1,0), (1,1), (1,2) · edges: (0,0)—(0,1), (0,1)—(1,1)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (0,2), (1,0), (1,1), (1,2) · edges: (0,0)→(0,1), (0,1)→(1,1), (0,2)→(1,2)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which cells must appear as nodes when answering every travel query?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells must appear as nodes when answering every travel query?**
Choices as displayed (top to bottom):
1. A / Only cells containing 1.
2. B / Only the two endpoints named in the current query.
3. C / Every grid cell, whether it contains 0 or 1.
4. D / One node for each finished same-digit region.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-cells] "Every grid cell, whether it contains 0 or 1."
    feedback: Right. Either kind of traveler may start on its matching cell.
- ❌ [ones-only] "Only cells containing 1."
    feedback: That erases the regions used by binary travelers. (misconception: ignores-binary-regions)
- ❌ [query-only] "Only the two endpoints named in the current query."
    feedback: The cells between the endpoints are needed to form a route. (misconception: drops-intermediate-cells)
- ❌ [regions] "One node for each finished same-digit region."
    feedback: Regions are results of connecting cells, not the starting nodes. (misconception: confuses-components-with-nodes)
"Why" shown after success: Right. Either kind of traveler may start on its matching cell.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid=["10","01"], queries=[[0,0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["decimal"]
2. ["neither"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["neither"]"
    feedback: Correct. Equal diagonal cells are in different regions.
- ❌ [wrong] "["decimal"]"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: none
"Why" shown after success: Equal diagonal cells are in different regions.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "same-value side edges")
Raw input shown:
```
When is there an edge between two cell nodes?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When is there an edge between two cell nodes?**
Choices as displayed (top to bottom):
1. A / They share a side, even if one is 0 and the other is 1.
2. B / They contain the same digit anywhere in the grid.
3. C / They contain the same digit and touch by a side or corner.
4. D / They share a side and contain the same digit.
Answer key + feedback per choice (data):
- ✅ CORRECT [same-side] "They share a side and contain the same digit."
    feedback: Right. Movement is four-directional and cannot change ground type.
- ❌ [any-side] "They share a side, even if one is 0 and the other is 1."
    feedback: A decimal or binary traveler cannot step onto the other digit. (misconception: crosses-digit-boundary)
- ❌ [same-anywhere] "They contain the same digit anywhere in the grid."
    feedback: Matching digits far apart do not create a one-step move. (misconception: connects-non-neighbors)
- ❌ [same-eight] "They contain the same digit and touch by a side or corner."
    feedback: Corner touching is diagonal and is not allowed here. (misconception: allows-diagonals)
"Why" shown after success: Right. Movement is four-directional and cannot change ground type.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "same-value side edges")
Raw input shown:
```
grid=["00","01"], queries=[[0,0,1,0],[0,0,1,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["binary","neither"]
2. ["binary","binary"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["binary","neither"]"
    feedback: Correct. The first pair shares a 0-region; the second pair has different values.
- ❌ [wrong] "["binary","binary"]"
    feedback: That follows the ignore value mismatch bug. (misconception: ignore-value-mismatch)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1)
"Why" shown after success: The first pair shares a 0-region; the second pair has different values.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "query classification")
Raw input shown:
```
grid = ["1100"], queries = [[0,0,0,3],[0,0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For grid ["1100"], what are the answers to queries (0,0)→(0,3) and (0,0)→itself?**
Choices as displayed (top to bottom):
1. A / ["decimal", "decimal"]
2. B / ["neither", "neither"]
3. C / ["neither", "decimal"]
4. D / ["binary", "decimal"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["neither", "decimal"]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "["decimal", "decimal"]"
    feedback: The first route crosses from 1 ground to 0 ground. (misconception: allows-changing-digit)
- ❌ [wrong-2] "["neither", "neither"]"
    feedback: A zero-step trip on a 1 cell is valid for decimal. (misconception: rejects-same-cell)
- ❌ [wrong-3] "["binary", "decimal"]"
    feedback: The first endpoints have different digits, so neither kind fits both. (misconception: uses-target-digit-only)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "query classification")
Raw input shown:
```
grid = ["110", "010", "011"], queries = [[0,0,2,2],[2,0,0,2]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In grid ["110","010","011"], what are the answers for (0,0)→(2,2) and (2,0)→(0,2)?**
Choices as displayed (top to bottom):
1. A / ["decimal", "binary"]
2. B / ["neither", "neither"]
3. C / ["decimal", "neither"]
4. D / ["binary", "neither"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["decimal", "neither"]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "["decimal", "binary"]"
    feedback: The two 0 endpoints sit in separate 0 regions. (misconception: connects-all-zero-cells)
- ❌ [wrong-2] "["neither", "neither"]"
    feedback: A side-connected 1 path joins the first pair. (misconception: misses-bending-path)
- ❌ [wrong-3] "["binary", "neither"]"
    feedback: The first endpoints are 1 cells, so a successful trip is decimal. (misconception: swaps-traveler-label)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "query classification")
Raw input shown:
```
grid=["1"], queries=[[0,0,0,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["neither"]
2. ["decimal"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["decimal"]"
    feedback: Correct. A cell is connected to itself by a zero-edge path.
- ❌ [wrong] "["neither"]"
    feedback: That follows the require an edge bug. (misconception: require-an-edge)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: A cell is connected to itself by a zero-edge path.
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
grid=["100","110"], queries=[[0,0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: ["decimal"] | ["neither"]
Remedial answer key: ✅ "["decimal"]" — Correct. The L-shaped 1 region connects the endpoints.; ❌ "["neither"]" — That follows the stop after one step bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [ones-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every grid cell, whether it contains 0 or 1.
Your choice: That erases the regions used by binary travelers.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=["01","00"], queries=[[0,0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: ["neither"] | ["binary"]
Remedial answer key: ✅ "["binary"]" — Correct. The 0 route turns through (1,0).; ❌ "["neither"]" — That follows the miss turning path bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [any-side]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
They share a side and contain the same digit.
Your choice: A decimal or binary traveler cannot step onto the other digit.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=["11","00"], queries=[[0,0,1,0]]
```
Remedial question: **What should the function return?** · choices shown: ["neither"] | ["decimal"]
Remedial answer key: ✅ "["neither"]" — Correct. Adjacent cells with different characters do not connect.; ❌ "["decimal"]" — That follows the ignore character value bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
["neither", "decimal"]
Your choice: The first route crosses from 1 ground to 0 ground.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=["101"], queries=[[0,0,0,2]]
```
Remedial question: **What should the function return?** · choices shown: ["decimal"] | ["neither"]
Remedial answer key: ✅ "["neither"]" — Correct. The middle 0 splits the two 1 regions.; ❌ "["decimal"]" — That follows the jump across other value bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
["decimal", "neither"]
Your choice: The two 0 endpoints sit in separate 0 regions.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=["111"], queries=[[0,0,0,2]]
```
Remedial question: **What should the function return?** · choices shown: ["decimal"] | ["neither"]
Remedial answer key: ✅ "["decimal"]" — Correct. Connectivity may use the middle cell.; ❌ "["neither"]" — That follows the check direct adjacency only bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Corner shortcut"; authored goal, NOT shown to student: "Make one corner touch falsely join two same-digit groups.")
Everything the student sees (text):
```
L
Leonardo's broken search

Leonardo allows diagonal steps even though only side moves are legal.

Your main goal: Expose Leonardo's mistake. Draw two graphs: first the correct graph, then Leonardo's graph using the mistake.

CHOOSE THE QUESTION START
question start
OUTPUT
CORRECT OUTPUT
LEONARDO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose question start
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
2 · Leonardo's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUESTION START / question start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LEONARDO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)"): accepted
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
LEONARDO'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Long district"; authored goal, NOT shown to student: "Build a same-digit route that continues beyond one move.")
Everything the student sees (text):
```
S
Summer's broken search

Summer never explores beyond the start's immediate neighbors.

Your main goal: Expose Summer's mistake. Draw two graphs: first the correct graph, then Summer's graph using the mistake.

CHOOSE THE QUESTION START
question start
OUTPUT
CORRECT OUTPUT
SUMMER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose question start
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
2 · Summer's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUESTION START / question start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SUMMER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
SUMMER'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Split neighborhood"; authored goal, NOT shown to student: "Let the start reach two same-digit branches, not just the last.")
Everything the student sees (text):
```
S
Santiago's broken search

Santiago keeps only the last branch it sees.

Your main goal: Expose Santiago's mistake. Draw two graphs: first the correct graph, then Santiago's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE QUESTION START
question start
OUTPUT
CORRECT OUTPUT
SANTIAGO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose question start
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
2 · Santiago's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUESTION START / question start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SANTIAGO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
SANTIAGO'S OUTPUT
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
grid=["100","110"], queries=[[0,0,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each finished same-digit region.”"
    feedback if wrong: Regions are results of connecting cells, not the starting nodes. Correct node rule: Every grid cell, whether it contains 0 or 1.
- [NO is correct] (direct-vs-reach) "The correct graph has (1,1)—(1,0) and (1,0)—(0,0), so it should also contain a direct (1,1)—(0,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,2) has exactly 3 direct neighbors."
    feedback if wrong: (0,2) has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Regions are results of connecting cells, not the starting nodes. Correct node rule: Every grid cell, whether it contains 0 or 1.
×
Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
(0,2) has 2 direct neighbors.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells containing 1.”"
    feedback if wrong: That erases the regions used by binary travelers. Correct node rule: Every grid cell, whether it contains 0 or 1.
- [YES is correct] (direct-vs-reach) "(0,1) can reach (1,2) through (0,2), but the graph still has no direct (0,1)—(1,2) edge."
    feedback if wrong: Right. A multi-step route through (0,2) creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(1,0) has 2 direct neighbors.
×
That erases the regions used by binary travelers. Correct node rule: Every grid cell, whether it contains 0 or 1.
×
Right. A multi-step route through (0,2) creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (1,0), but the graph still has no direct (0,0)—(1,1) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 1 direct neighbor."
    feedback if wrong: (1,1) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the two endpoints named in the current query.”"
    feedback if wrong: The cells between the endpoints are needed to form a route. Correct node rule: Every grid cell, whether it contains 0 or 1.
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
Every grid cell, whether it contains 0 or 1.
EDGES
They share a side and contain the same digit.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=["01","00"], queries=[[0,0,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells containing 1.”"
    feedback if wrong: That erases the regions used by binary travelers. Correct node rule: Every grid cell, whether it contains 0 or 1.
- [NO is correct] (direct-vs-reach) "The correct graph has (1,1)—(1,0) and (1,0)—(0,0), so it should also contain a direct (1,1)—(0,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 0 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=["11","00"], queries=[[0,0,1,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each finished same-digit region.”"
    feedback if wrong: Regions are results of connecting cells, not the starting nodes. Correct node rule: Every grid cell, whether it contains 0 or 1.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 1 direct neighbor."
    feedback if wrong: (1,0) has 1 direct neighbor.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=["101"], queries=[[0,0,0,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the two endpoints named in the current query.”"
    feedback if wrong: The cells between the endpoints are needed to form a route. Correct node rule: Every grid cell, whether it contains 0 or 1.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=["111"], queries=[[0,0,0,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells containing 1.”"
    feedback if wrong: That erases the regions used by binary travelers. Correct node rule: Every grid cell, whether it contains 0 or 1.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(0,1) and (0,1)—(0,2), so it should also contain a direct (0,0)—(0,2) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
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

### S4 case 1 — `authored-deep-case` · bug: Diagonal travel is accepted
Input shown:
```
REAL PROBLEM INPUT
grid: ["10", "01"]
queries: [[0, 0, 1, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function whoCanTravel(grid, queries) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const directions = [-1, 0, 1];
  function connected(startRow, startColumn, targetRow, targetColumn) {
    const digit = grid[startRow][startColumn];
    const visited = new Set([`${startRow},${startColumn}`]);
    const stack = [[startRow, startColumn]];
    while (stack.length) {
      const [row, column] = stack.pop();
      if (row === targetRow && column === targetColumn) {
        return true;
      }
      for (const rowChange of directions) {
        for (const columnChange of directions) {
          if (rowChange === 0 && columnChange === 0) {
            continue;
          }
          const nextRow = row + rowChange;
          const nextColumn = column + columnChange;
          const key = `${nextRow},${nextColumn}`;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === digit &&
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
  return queries.map(([startRow, startColumn, targetRow, targetColumn]) => {
    if (
      grid[startRow][startColumn] !== grid[targetRow][targetColumn] ||
      !connected(startRow, startColumn, targetRow, targetColumn)
    ) {
      return "neither";
    }
    return grid[startRow][startColumn] === "1" ? "decimal" : "binary";
  });
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of query answers" · expected buggy output `["decimal"]` · real correct output `["neither"]`
Diagnosis choices as displayed:
- A The code swaps the words binary and decimal after finding a valid path on the shown input.
- B The code reads the target row and column in the wrong order for the shown graph.
- C The nested direction loops add diagonal moves, joining the two 1 cells across a corner.
Diagnosis answer key + feedback:
- ❌ [wrong-person-label] "The code swaps the words binary and decimal after finding a valid path on the shown input." — feedback: The label mapping is correct; the invalid path is created earlier.
- ✅ [diagonal-neighbors] "The nested direction loops add diagonal moves, joining the two 1 cells across a corner." — feedback: Exactly. The real graph has no edge between (0,0) and (1,1).
- ❌ [query-order] "The code reads the target row and column in the wrong order for the shown graph." — feedback: The query is unpacked correctly; the extra diagonal adjacency causes the result.
Graph proof shown in feedback: code rule "The code connects equal digits for all eight offsets, including dr=1, dc=1." → changed graph "All four cells are nodes, but no same-digit cells share a side, so the graph has four isolated nodes." → boundary "The queried 1 cells touch only at a corner." → returned value "The code invents a path and returns decimal; the real graph has no path and returns neither."
Output-format probes: ✅ spaces after commas → `["decimal"]`; ❌ unquoted strings in array → `[decimal]`; ❌ trailing period → `["decimal"].`
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
About your diagnosis: The label mapping is correct; the invalid path is created earlier.
Code rule: The code connects equal digits for all eight offsets, including dr=1, dc=1. → Changed graph: All four cells are nodes, but no same-digit cells share a side, so the graph has four isolated nodes. → Reachable boundary: The queried 1 cells touch only at a corner.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal travel is accepted
INCORRECT OUTPUT
["decimal"]
CORRECT OUTPUT
["neither"]
Code rule: The code connects equal digits for all eight offsets, including dr=1, dc=1. → Changed graph: All four cells are nodes, but no same-digit cells share a side, so the graph has four isolated nodes. → Reachable boundary: The queried 1 cells touch only at a corner. → Returned value: The code invents a path and returns decimal; the real graph has no path and returns neither.
```

### S4 case 2 — `new-diagonal-chain` · bug: Diagonal travel is accepted
Input shown:
```
REAL PROBLEM INPUT
grid: ["100", "010", "001"]
queries: [[0, 0, 2, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function whoCanTravel(grid, queries) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const directions = [-1, 0, 1];
  function connected(startRow, startColumn, targetRow, targetColumn) {
    const digit = grid[startRow][startColumn];
    const visited = new Set([`${startRow},${startColumn}`]);
    const stack = [[startRow, startColumn]];
    while (stack.length) {
      const [row, column] = stack.pop();
      if (row === targetRow && column === targetColumn) {
        return true;
      }
      for (const rowChange of directions) {
        for (const columnChange of directions) {
          if (rowChange === 0 && columnChange === 0) {
            continue;
          }
          const nextRow = row + rowChange;
          const nextColumn = column + columnChange;
          const key = `${nextRow},${nextColumn}`;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === digit &&
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
  return queries.map(([startRow, startColumn, targetRow, targetColumn]) => {
    if (
      grid[startRow][startColumn] !== grid[targetRow][targetColumn] ||
      !connected(startRow, startColumn, targetRow, targetColumn)
    ) {
      return "neither";
    }
    return grid[startRow][startColumn] === "1" ? "decimal" : "binary";
  });
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)", "(2,0)", "(2,1)", "(2,2)" · edges: (0,1)—(0,2), (0,2)—(1,2), (1,0)—(2,0), (2,0)—(2,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of query answers" · expected buggy output `["decimal"]` · real correct output `["neither"]`
Diagnosis choices as displayed:
- A The eight-offset loop joins (0,0)→(1,1)→(2,2), although both contacts are corners.
- B The query uses zero-based coordinates but the code reads them as one-based coordinates.
- C The shared seen set incorrectly blocks the target after visiting the center.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The query uses zero-based coordinates but the code reads them as one-based coordinates." — feedback: The query coordinates are unpacked as zero-based values exactly as supplied.
- ✅ [diagonal-neighbors] "The eight-offset loop joins (0,0)→(1,1)→(2,2), although both contacts are corners." — feedback: Exactly. The real same-digit graph has three isolated 1-cells.
- ❌ [wrong-visited] "The shared seen set incorrectly blocks the target after visiting the center." — feedback: The center is marked once and then legally popped; seen does not prevent reaching the last diagonal cell.
Graph proof shown in feedback: code rule "Each 1-cell receives edges to equal digits at all eight offsets." → changed graph "All nine cells are nodes. The three 1-cells are isolated; the four shown edges connect side-adjacent 0-cells." → boundary "The apparent route uses two diagonal-only contacts." → returned value "The code returns ["decimal"]; legal side movement returns ["neither"]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal travel is accepted
INCORRECT OUTPUT
["decimal"]
CORRECT OUTPUT
["neither"]
Code rule: Each 1-cell receives edges to equal digits at all eight offsets. → Changed graph: All nine cells are nodes. The three 1-cells are isolated; the four shown edges connect side-adjacent 0-cells. → Reachable boundary: The apparent route uses two diagonal-only contacts. → Returned value: The code returns ["decimal"]; legal side movement returns ["neither"].
```

### S4 case 3 — `new-diagonal-x` · bug: Diagonal travel is accepted
Input shown:
```
REAL PROBLEM INPUT
grid: ["101", "010", "101"]
queries: [[0, 0, 2, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function whoCanTravel(grid, queries) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const directions = [-1, 0, 1];
  function connected(startRow, startColumn, targetRow, targetColumn) {
    const digit = grid[startRow][startColumn];
    const visited = new Set([`${startRow},${startColumn}`]);
    const stack = [[startRow, startColumn]];
    while (stack.length) {
      const [row, column] = stack.pop();
      if (row === targetRow && column === targetColumn) {
        return true;
      }
      for (const rowChange of directions) {
        for (const columnChange of directions) {
          if (rowChange === 0 && columnChange === 0) {
            continue;
          }
          const nextRow = row + rowChange;
          const nextColumn = column + columnChange;
          const key = `${nextRow},${nextColumn}`;
          if (
            isInBounds(grid, nextRow, nextColumn) &&
            grid[nextRow][nextColumn] === digit &&
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
  return queries.map(([startRow, startColumn, targetRow, targetColumn]) => {
    if (
      grid[startRow][startColumn] !== grid[targetRow][targetColumn] ||
      !connected(startRow, startColumn, targetRow, targetColumn)
    ) {
      return "neither";
    }
    return grid[startRow][startColumn] === "1" ? "decimal" : "binary";
  });
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)", "(2,0)", "(2,1)", "(2,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON array of query answers" · expected buggy output `["decimal"]` · real correct output `["neither"]`
Diagnosis choices as displayed:
- A The answer label should be binary whenever a route contains an even number of cells.
- B The loop turns the five corner-touching 1-cells into one X-shaped component.
- C The stack stops too early when it reaches the center cell.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The answer label should be binary whenever a route contains an even number of cells." — feedback: The output name follows the starting digit 1; route length does not change decimal into binary.
- ✅ [diagonal-neighbors] "The loop turns the five corner-touching 1-cells into one X-shaped component." — feedback: Exactly. Side-only travel leaves all five 1-cells separate.
- ❌ [wrong-visited] "The stack stops too early when it reaches the center cell." — feedback: The stack continues after the center and reaches every invented diagonal neighbor.
Graph proof shown in feedback: code rule "Diagonal equality creates four invented edges through center (1,1)." → changed graph "All nine cells are separate nodes here because every side-neighbor pair has different digits." → boundary "Every route from the first corner to the last needs corner moves." → returned value "The invented X path returns ["decimal"] instead of ["neither"]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Diagonal travel is accepted
INCORRECT OUTPUT
["decimal"]
CORRECT OUTPUT
["neither"]
Code rule: Diagonal equality creates four invented edges through center (1,1). → Changed graph: All nine cells are separate nodes here because every side-neighbor pair has different digits. → Reachable boundary: Every route from the first corner to the last needs corner moves. → Returned value: The invented X path returns ["decimal"] instead of ["neither"].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```