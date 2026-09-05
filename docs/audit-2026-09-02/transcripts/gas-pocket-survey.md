# Gas Pocket Survey (`gas-pocket-survey`) — variant, grid

## Problem statement (Description tab)

You are surveying a cave system shown as a grid. `cave[r][c]` is one of:

- `"U"` — unexplored rock
- `"G"` — a hidden gas pocket (dangerous!)

You drill into one cell, given by `row` and `col`. Gas seeps only through the four flat walls of a cell, so in this problem **only the 4 orthogonal neighbors matter** — up, down, left, and right. Diagonal cells are NOT neighbors.

Apply these rules, then return the updated grid:

1. If you drill into a gas pocket (`"G"`), it ruptures: change that cell to `"X"` and stop.
2. Otherwise, count the gas pockets among the cell's **4 orthogonal neighbors**.
   - If the count is 1 or more, change the cell to that count as a digit character (`"1"`, `"2"`, `"3"`, or `"4"`) and stop expanding from this cell.
   - If the count is 0, change the cell to `"S"` (safe) and automatically reveal **each of its 4 orthogonal neighbors** the same way (this can keep spreading).

Cells that are never revealed stay exactly as they were.

Write a function `surveyCave(cave, row, col)` that returns the final grid. The drilled cell is guaranteed to be `"U"` or `"G"`.

### Examples
- Example 1: input `cave = [["U","U","U"],["U","U","U"],["U","G","U"]], row = 0, col = 0` → output `[["S","S","S"],["S","1","S"],["1","G","1"]]`. The gas pocket is at (2,1). Cell (1,1) has it directly below, so it shows "1". Cells (2,0) and (2,2) have it directly beside them, so they show "1". Cells like (1,0) and (1,2) only touch the gas DIAGONALLY, which does not count in this problem, so they are safe "S" and keep spreading the reveal. The pocket itself is never drilled, so it stays "G".
- Example 2: input `cave = [["G","U"],["U","U"]], row = 0, col = 0` → output `[["X","U"],["U","U"]]`. You drilled straight into the gas pocket. It becomes "X" and nothing else changes.

### Graph rules (authored)
- Nodes: Each cave cell at its own `(row,column)` position.
- Edges: Only cells sharing a side: up, down, left, or right.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "four-way danger")
Raw input shown:
```
cave=["UG","GU"], drill=(0,0)
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What label is written at the drilled cell?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Exactly 2 side-adjacent gas cells must be counted.
- ❌ [bug] "1"
    feedback: This stops after the first gas neighbor and misses another side direction. (misconception: stop-after-first-neighbor)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
"Why" shown after success: Exactly 2 side-adjacent gas cells must be counted.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "four-way danger")
Raw input shown:
```
cave=["UUU","UGU","UUU"], drill=(0,0)
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What label is written at the drilled cell?**
Choices as displayed (top to bottom):
1. S
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "S"
    feedback: Correct. No side-adjacent gas exists, so the drill cell is safe S.
- ❌ [bug] "1"
    feedback: This borrows the eight-neighbor Minesweeper rule and counts diagonal gas. (misconception: count-diagonal-gas)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)", "(2,0)", "(2,1)", "(2,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(2,0), (1,0)—(1,1), (1,1)—(2,1), (1,1)—(1,2), (1,2)—(2,2), (2,0)—(2,1), (2,1)—(2,2)
"Why" shown after success: No side-adjacent gas exists, so the drill cell is safe S.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact cave cells")
Raw input shown:
```
cave=["UG","GU"], drill=(0,0)
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (1,0) / (1,1)
2. Picture C / (0,0) / (0,1) / (1,0) / (1,1)
3. Picture D / (0,0) / (0,1) / (1,0)
4. Picture A / (0,0) / (0,1) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1)
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(1,0), (0,0)→(0,1), (0,1)→(1,1), (1,0)→(1,1)
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)—(1,0), (0,0)—(0,1)
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-3`, facet "four-way danger")
Raw input shown:
```
cave=["GGU","UUU"], drill=(1,1)
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What label is written at the drilled cell?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Exactly 1 side-adjacent gas cell must be counted.
- ❌ [bug] "2"
    feedback: This counts the diagonal gas at (0,0) along with the one side-adjacent gas cell. (misconception: count-diagonal-gas)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
"Why" shown after success: Exactly 1 side-adjacent gas cell must be counted.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-node`, facet "position identity")
Raw input shown:
```
cave = [["U","U","U","U"],["U","G","U","U"],["U","U","U","U"]], row = 0, col = 3
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should be treated as a position node during the cave survey?**
Choices as displayed (top to bottom):
1. A / Only cells currently marked unknown U.
2. B / Only gas cells, because the task is a gas survey.
3. C / One node for each area that will eventually be revealed.
4. D / Each cave cell at its own (row,column) position.
Answer key + feedback per choice (data):
- ✅ CORRECT [cells] "Each cave cell at its own `(row,column)` position."
    feedback: Correct. Contents may change as cells are revealed, but the positions are the states visited.
- ❌ [unknown-only] "Only cells currently marked unknown `U`."
    feedback: Known gas cells still matter when counting danger around an unknown cell. (misconception: omit-known-gas)
- ❌ [gas-only] "Only gas cells, because the task is a gas survey."
    feedback: The reveal spreads through safe unknown cells, so those positions must be modeled too. (misconception: gas-only)
- ❌ [regions] "One node for each area that will eventually be revealed."
    feedback: The revealed areas are outcomes of walking between individual cells. (misconception: region-as-node)
"Why" shown after success: Correct. Contents may change as cells are revealed, but the positions are the states visited.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-4`, facet "four-way danger")
Raw input shown:
```
cave=["U"], drill=(0,0)
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What label is written at the drilled cell?**
Choices as displayed (top to bottom):
1. S
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "S"
    feedback: Correct. No side-adjacent gas exists, so the drill cell is safe S.
- ❌ [bug] "0"
    feedback: This writes numeric zero instead of the required safe label S. (misconception: zero-instead-of-safe)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: No side-adjacent gas exists, so the drill cell is safe S.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-edge`, facet "four-way danger")
Raw input shown:
```
cave = [["U","U","U","U"],["U","G","U","U"],["U","U","U","U"]], row = 0, col = 3
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells are direct neighbors for both danger counting and reveal spreading?**
Choices as displayed (top to bottom):
1. A / All eight surrounding cells, including the four diagonals.
2. B / Any gas cell in the same row or column until a wall is reached.
3. C / Only cells sharing a side: up, down, left, or right.
4. D / Any two unknown cells connected by a chain of safe cells share one direct edge.
Answer key + feedback per choice (data):
- ✅ CORRECT [four-way] "Only cells sharing a side: up, down, left, or right."
    feedback: Correct. Diagonal gas neither raises the count nor blocks the side-based spread.
- ❌ [eight-way] "All eight surrounding cells, including the four diagonals."
    feedback: That is a common Minesweeper rule, but this survey uses four directions only. (misconception: borrow-minesweeper-rule)
- ❌ [gas-jumps] "Any gas cell in the same row or column until a wall is reached."
    feedback: Danger comes only from immediately adjacent side cells, not line of sight. (misconception: line-of-sight)
- ❌ [unknown-chain-edge] "Any two unknown cells connected by a chain of safe cells share one direct edge."
    feedback: That chain is a path made of several side edges, not one edge. (misconception: path-as-edge)
"Why" shown after success: Correct. Diagonal gas neither raises the count nor blocks the side-based spread.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "revealed drill label")
Raw input shown:
```
cave=[["U","G"],["G","U"]], row=0, col=0
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Drill at (0,0) in the 2×2 cave U G / G U. What does the drilled cell become?**
Choices as displayed (top to bottom):
1. A / 0
2. B / 1
3. C / S
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. Gas is directly right and directly below.
- ❌ [zero] "`0`"
    feedback: Both side-neighbor gas cells must be counted. (misconception: miss-side-gas)
- ❌ [one] "`1`"
    feedback: There are two gas neighbors, not just the first one checked. (misconception: stop-after-first)
- ❌ [safe] "`S`"
    feedback: A cell becomes S only when it has no side-adjacent gas. (misconception: ignore-danger-count)
"Why" shown after success: Correct. Gas is directly right and directly below.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "revealed drill label")
Raw input shown:
```
cave=[["U","U","U","U"],["U","G","U","U"],["U","U","U","U"]], row=0, col=3
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the larger cave picture, cell (0,2) touches gas only diagonally. What label does the reveal place there?**
Choices as displayed (top to bottom):
1. A / S
2. B / 1
3. C / G
4. D / U
Answer key + feedback per choice (data):
- ✅ CORRECT [safe] "`S`"
    feedback: Correct. Diagonal gas does not count, so the cell is safe and the reveal can spread through it.
- ❌ [one] "`1`"
    feedback: That incorrectly counts diagonal gas as a neighbor. (misconception: count-diagonal)
- ❌ [gas] "`G`"
    feedback: The survey never turns an unknown cell into a gas pocket. (misconception: copy-neighbor-type)
- ❌ [unknown] "`U`"
    feedback: This cell is reachable from the drill through safe cells, so it is revealed. (misconception: stop-spread-too-soon)
"Why" shown after success: Correct. Diagonal gas does not count, so the cell is safe and the reveal can spread through it.
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
#### After answering concept `concept-picture` wrong with choice [missing-edge]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Picture A
Your choice: This drops a direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every detail"
Remedial raw input:
```
cave=["G"], drill=(0,0)
```
Remedial question: **What does the drilled cell become?** · choices shown: X | G
Remedial answer key: ✅ "X" — Correct. A drilled gas pocket changes from G to X and the reveal stops.; ❌ "G" — This leaves the drilled gas pocket unchanged instead of marking the rupture X.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [unknown-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each cave cell at its own (row,column) position.
Your choice: Known gas cells still matter when counting danger around an unknown cell.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
cave=["UGU"], drill=(0,2)
```
Remedial question: **What label is written at the drilled cell?** · choices shown: 0 | 1
Remedial answer key: ✅ "1" — Correct. Exactly 1 side-adjacent gas cell must be counted.; ❌ "0" — This checks only down and right, so it misses the gas immediately to the drilled cell's left.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [eight-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Only cells sharing a side: up, down, left, or right.
Your choice: That is a common Minesweeper rule, but this survey uses four directions only.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
cave=["UU","GU"], drill=(0,1)
```
Remedial question: **What label is written at the drilled cell?** · choices shown: S | 1
Remedial answer key: ✅ "S" — Correct. No side-adjacent gas exists, so the drill cell is safe S.; ❌ "1" — This borrows the eight-neighbor Minesweeper rule and counts diagonal gas.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [zero]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: Both side-neighbor gas cells must be counted.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
cave=["GUG","UUU"], drill=(1,1)
```
Remedial question: **What label is written at the drilled cell?** · choices shown: 2 | S
Remedial answer key: ✅ "S" — Correct. No side-adjacent gas exists, so the drill cell is safe S.; ❌ "2" — This borrows the eight-neighbor Minesweeper rule and counts diagonal gas.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
S
Your choice: That incorrectly counts diagonal gas as a neighbor.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
cave=["UUU","UUG"], drill=(0,0)
```
Remedial question: **What label is written at the drilled cell?** · choices shown: S | 0
Remedial answer key: ✅ "S" — Correct. No side-adjacent gas exists, so the drill cell is safe S.; ❌ "0" — This writes numeric zero instead of the required safe label S.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Diagonal gas warning"; authored goal, NOT shown to student: "Place gas at a corner touch so an invented diagonal changes the reveal.")
Everything the student sees (text):
```
C
Cooper's broken search

Cooper allows diagonal steps even though only side moves are legal.

Your main goal: Expose Cooper's mistake. Draw two graphs: first the correct graph, then Cooper's graph using the mistake.

CHOOSE THE DRILL SQUARE
drill square
OUTPUT
CORRECT OUTPUT
COOPER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose drill square
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
2 · Cooper's graph
Check my graph
→
```
Start field: label "CHOOSE THE DRILL SQUARE / drill square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | COOPER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,0)", "(1,1)"): accepted
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
COOPER'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Long safe tunnel"; authored goal, NOT shown to student: "Make safe cave squares continue beyond the drill's immediate neighbors.")
Everything the student sees (text):
```
I
Isabelle's broken search

Isabelle never explores beyond the start's immediate neighbors.

Your main goal: Expose Isabelle's mistake. Draw two graphs: first the correct graph, then Isabelle's graph using the mistake.

CHOOSE THE DRILL SQUARE
drill square
OUTPUT
CORRECT OUTPUT
ISABELLE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose drill square
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
2 · Isabelle's graph
Check my graph
→
```
Start field: label "CHOOSE THE DRILL SQUARE / drill square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ISABELLE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
ISABELLE'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Fork in the cave"; authored goal, NOT shown to student: "Create two safe branches so the survey must return after exploring the first.")
Everything the student sees (text):
```
D
Dominic's broken search

Dominic stops the whole search when its first branch ends.

Your main goal: Expose Dominic's mistake. Draw two graphs: first the correct graph, then Dominic's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE DRILL SQUARE
drill square
OUTPUT
CORRECT OUTPUT
DOMINIC’S OUTPUT
Drawing 1 of 2: Correct graph · Choose drill square
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
2 · Dominic's graph
Check my graph
→
```
Start field: label "CHOOSE THE DRILL SQUARE / drill square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | DOMINIC’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
DOMINIC'S OUTPUT
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
cave=["UU","GU"], drill=(0,1)
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "(0,0) has exactly 3 direct neighbors."
    feedback if wrong: (0,0) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each area that will eventually be revealed.”"
    feedback if wrong: The revealed areas are outcomes of walking between individual cells. Correct node rule: Each cave cell at its own `(row,column)` position.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,0) and (1,0)—(1,1), so it should also contain a direct (0,0)—(1,1) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,0) has 2 direct neighbors.
×
The revealed areas are outcomes of walking between individual cells. Correct node rule: Each cave cell at its own
(row,column)
position.
×
Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "(1,1) has exactly 1 direct neighbor."
    feedback if wrong: (1,1) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells currently marked unknown `U`.”"
    feedback if wrong: Known gas cells still matter when counting danger around an unknown cell. Correct node rule: Each cave cell at its own `(row,column)` position.
- [NO is correct] (direct-vs-reach) "The correct graph has (1,1)—(1,0) and (1,0)—(0,0), so it should also contain a direct (1,1)—(0,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(1,1) has 2 direct neighbors.
×
Known gas cells still matter when counting danger around an unknown cell. Correct node rule: Each cave cell at its own
(row,column)
position.
×
Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(1,0) has exactly 2 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only gas cells, because the task is a gas survey.”"
    feedback if wrong: The reveal spreads through safe unknown cells, so those positions must be modeled too. Correct node rule: Each cave cell at its own `(row,column)` position.
- [YES is correct] (direct-vs-reach) "(1,1) can reach (0,0) through (0,1), but the graph still has no direct (1,1)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
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
Each cave cell at its own (row,column) position.
EDGES
Only cells sharing a side: up, down, left, or right.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
cave=["GUG","UUU"], drill=(1,1)
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells currently marked unknown `U`.”"
    feedback if wrong: Known gas cells still matter when counting danger around an unknown cell. Correct node rule: Each cave cell at its own `(row,column)` position.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,2)—(0,1) and (0,1)—(0,0), so it should also contain a direct (0,2)—(0,0) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,0) has exactly 1 direct neighbor."
    feedback if wrong: (1,0) has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
cave=["UUU","UUG"], drill=(0,0)
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,2) has exactly 2 direct neighbors."
    feedback if wrong: (0,2) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each area that will eventually be revealed.”"
    feedback if wrong: The revealed areas are outcomes of walking between individual cells. Correct node rule: Each cave cell at its own `(row,column)` position.
- [YES is correct] (direct-vs-reach) "(0,1) can reach (1,0) through (1,1), but the graph still has no direct (0,1)—(1,0) edge."
    feedback if wrong: Right. A multi-step route through (1,1) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
cave=["G"], drill=(0,0)
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only gas cells, because the task is a gas survey.”"
    feedback if wrong: The reveal spreads through safe unknown cells, so those positions must be modeled too. Correct node rule: Each cave cell at its own `(row,column)` position.
- [NO is correct] (direct-vs-reach) "Because (0,0) can reach itself, the graph should contain a direct (0,0)—(0,0) edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct (0,0)—(0,0) self-edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
cave=["UGU"], drill=(0,2)
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cells currently marked unknown `U`.”"
    feedback if wrong: Known gas cells still matter when counting danger around an unknown cell. Correct node rule: Each cave cell at its own `(row,column)` position.
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

### S4 case 1 — `authored-deep-case` · bug: A diagonal gas pocket stops the reveal
Input shown:
```
REAL PROBLEM INPUT
cave: [["U", "U"], ["U", "G"]]
row: 0
col: 0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const cave = input.cave.map((row) => [...row]);
  const visited = new Set();
  const around = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const sides = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function reveal(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= cave.length ||
      column >= cave[0].length ||
      visited.has(key)
    ) {
      return;
    }
    if (cave[row][column] !== "U") {
      return;
    }
    visited.add(key);
    let nearbyGasCount = 0;
    for (const [rowChange, columnChange] of around) {
      if (
        isInBounds(cave, row + rowChange, column + columnChange) &&
        cave[row + rowChange][column + columnChange] === "G"
      ) {
        nearbyGasCount++;
      }
    }
    if (nearbyGasCount) {
      cave[row][column] = String(nearbyGasCount);
      return;
    }
    cave[row][column] = "S";
    for (const [rowChange, columnChange] of sides) {
      reveal(row + rowChange, column + columnChange);
    }
  }
  if (cave[input.row][input.col] === "G") {
    cave[input.row][input.col] = "X";
  } else {
    reveal(input.row, input.col);
  }
  return cave;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "updated cave grid" · expected buggy output `[["1","U"],["U","G"]]` · real correct output `[["S","1"],["1","G"]]`
Diagnosis choices as displayed:
- A The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search.
- B The gas counter uses eight directions, so diagonal G at (1,1) falsely stops the drill cell.
- C The function fails because it edits the original cave in place for the shown graph.
Diagnosis answer key + feedback:
- ✅ [eight-neighbor-count] "The gas counter uses eight directions, so diagonal G at (1,1) falsely stops the drill cell." — feedback: Correct. This cave uses only shared-side neighbors.
- ❌ [spread-diagonal] "The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search." — feedback: The recursion uses the four-entry sides list. The error occurs while counting gas.
- ❌ [mutates-input] "The function fails because it edits the original cave in place for the shown graph." — feedback: It clones every row before revealing, so the caller's grid is not the problem.
Graph proof shown in feedback: code rule "The gas test adds diagonal adjacency before deciding whether expansion stops." → changed graph "The drill node (0,0) has side edges only to (0,1) and (1,0); gas at (1,1) is two side steps away." → boundary "The only gas is diagonal to the start but side-adjacent to both other U cells." → returned value "The code writes 1 at the start and stops; correct traversal reveals S,1,1 around the gas."
Output-format probes: ✅ spaces after commas → `[["1", "U"], ["U", "G"]]`; ❌ reversed element order → `[["U","G"],["1","U"]]`; ❌ trailing period → `[["1","U"],["U","G"]].`
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
About your diagnosis: The recursion uses the four-entry sides list. The error occurs while counting gas.
Code rule: The gas test adds diagonal adjacency before deciding whether expansion stops. → Changed graph: The drill node (0,0) has side edges only to (0,1) and (1,0); gas at (1,1) is two side steps away. → Reachable boundary: The only gas is diagonal to the start but side-adjacent to both other U cells.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A diagonal gas pocket stops the reveal
INCORRECT OUTPUT
[["1","U"],["U","G"]]
CORRECT OUTPUT
[["S","1"],["1","G"]]
Code rule: The gas test adds diagonal adjacency before deciding whether expansion stops. → Changed graph: The drill node (0,0) has side edges only to (0,1) and (1,0); gas at (1,1) is two side steps away. → Reachable boundary: The only gas is diagonal to the start but side-adjacent to both other U cells. → Returned value: The code writes 1 at the start and stops; correct traversal reveals S,1,1 around the gas.
```

### S4 case 2 — `case-1` · bug: A diagonal gas pocket stops the reveal
Input shown:
```
REAL PROBLEM INPUT
cave=["UUU","UUG"], drill=(0,1)
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const cave = input.cave.map((row) => [...row]);
  const visited = new Set();
  const around = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const sides = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function reveal(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= cave.length ||
      column >= cave[0].length ||
      visited.has(key)
    ) {
      return;
    }
    if (cave[row][column] !== "U") {
      return;
    }
    visited.add(key);
    let nearbyGasCount = 0;
    for (const [rowChange, columnChange] of around) {
      if (
        isInBounds(cave, row + rowChange, column + columnChange) &&
        cave[row + rowChange][column + columnChange] === "G"
      ) {
        nearbyGasCount++;
      }
    }
    if (nearbyGasCount) {
      cave[row][column] = String(nearbyGasCount);
      return;
    }
    cave[row][column] = "S";
    for (const [rowChange, columnChange] of sides) {
      reveal(row + rowChange, column + columnChange);
    }
  }
  if (cave[input.row][input.col] === "G") {
    cave[input.row][input.col] = "X";
  } else {
    reveal(input.row, input.col);
  }
  return cave;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(0,2), (0,1)—(1,1), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "updated cave grid" · expected buggy output `[["U","1","U"],["U","U","G"]]` · real correct output `[["S","S","1"],["S","1","G"]]`
Diagnosis choices as displayed:
- A The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search.
- B The function fails because it edits the original cave in place for the shown graph.
- C The eight-direction counter treats gas at (1,2) as adjacent to drill cell (0,1), although they touch only diagonally.
Diagnosis answer key + feedback:
- ✅ [eight-neighbor-count] "The eight-direction counter treats gas at (1,2) as adjacent to drill cell (0,1), although they touch only diagonally." — feedback: Exactly. Side-only counting finds zero gas at the drill cell, so reveal must continue into the surrounding safe cells.
- ❌ [spread-diagonal] "The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search." — feedback: The recursion uses the four-entry sides list. The error occurs while counting gas.
- ❌ [mutates-input] "The function fails because it edits the original cave in place for the shown graph." — feedback: It clones every row before revealing, so the caller's grid is not the problem.
Graph proof shown in feedback: code rule "The around list counts diagonal gas before deciding whether reveal expands." → changed graph "Drill cell (0,1) has side neighbors (0,0), (0,2), and (1,1); gas (1,2) is not one of them." → boundary "Gas (1,2) is diagonal to the start but side-adjacent to (0,2) and (1,1)." → returned value "The code stops with 1 at the drill; correct reveal returns [["S","S","1"],["S","1","G"]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A diagonal gas pocket stops the reveal
INCORRECT OUTPUT
[["U","1","U"],["U","U","G"]]
CORRECT OUTPUT
[["S","S","1"],["S","1","G"]]
Code rule: The around list counts diagonal gas before deciding whether reveal expands. → Changed graph: Drill cell (0,1) has side neighbors (0,0), (0,2), and (1,1); gas (1,2) is not one of them. → Reachable boundary: Gas (1,2) is diagonal to the start but side-adjacent to (0,2) and (1,1). → Returned value: The code stops with 1 at the drill; correct reveal returns [["S","S","1"],["S","1","G"]].
```

### S4 case 3 — `case-3` · bug: A diagonal gas pocket stops the reveal
Input shown:
```
REAL PROBLEM INPUT
cave=["GGU","UUU"], drill=(1,1)
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const cave = input.cave.map((row) => [...row]);
  const visited = new Set();
  const around = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const sides = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function reveal(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= cave.length ||
      column >= cave[0].length ||
      visited.has(key)
    ) {
      return;
    }
    if (cave[row][column] !== "U") {
      return;
    }
    visited.add(key);
    let nearbyGasCount = 0;
    for (const [rowChange, columnChange] of around) {
      if (
        isInBounds(cave, row + rowChange, column + columnChange) &&
        cave[row + rowChange][column + columnChange] === "G"
      ) {
        nearbyGasCount++;
      }
    }
    if (nearbyGasCount) {
      cave[row][column] = String(nearbyGasCount);
      return;
    }
    cave[row][column] = "S";
    for (const [rowChange, columnChange] of sides) {
      reveal(row + rowChange, column + columnChange);
    }
  }
  if (cave[input.row][input.col] === "G") {
    cave[input.row][input.col] = "X";
  } else {
    reveal(input.row, input.col);
  }
  return cave;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (0,1)—(0,2), (0,2)—(1,2), (1,0)—(1,1), (1,1)—(1,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "updated cave grid" · expected buggy output `[["G","G","U"],["U","2","U"]]` · real correct output `[["G","G","U"],["U","1","U"]]`
Diagnosis choices as displayed:
- A The counter includes diagonal gas (0,0) as well as side-adjacent gas (0,1), so drill cell (1,1) gets 2 instead of 1.
- B The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search.
- C The function fails because it edits the original cave in place for the shown graph.
Diagnosis answer key + feedback:
- ✅ [eight-neighbor-count] "The counter includes diagonal gas (0,0) as well as side-adjacent gas (0,1), so drill cell (1,1) gets 2 instead of 1." — feedback: Exactly. Only shared-side gas at (0,1) should contribute to the drill cell.
- ❌ [spread-diagonal] "The reveal recursion spreads diagonally from each safe cell into unsafe neighboring cells during this search." — feedback: The recursion uses the four-entry sides list. The error occurs while counting gas.
- ❌ [mutates-input] "The function fails because it edits the original cave in place for the shown graph." — feedback: It clones every row before revealing, so the caller's grid is not the problem.
Graph proof shown in feedback: code rule "The eight-entry around list counts both the side gas and diagonal gas." → changed graph "Drill cell (1,1) has side edge to gas (0,1); gas (0,0) is diagonal to it." → boundary "One legal gas neighbor plus one illegal diagonal neighbor changes the clue from 1 to 2." → returned value "The code writes 2; the correct returned cave writes 1 at (1,1)."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A diagonal gas pocket stops the reveal
INCORRECT OUTPUT
[["G","G","U"],["U","2","U"]]
CORRECT OUTPUT
[["G","G","U"],["U","1","U"]]
Code rule: The eight-entry around list counts both the side gas and diagonal gas. → Changed graph: Drill cell (1,1) has side edge to gas (0,1); gas (0,0) is diagonal to it. → Reachable boundary: One legal gas neighbor plus one illegal diagonal neighbor changes the clue from 1 to 2. → Returned value: The code writes 2; the correct returned cave writes 1 at (1,1).
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```