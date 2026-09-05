# Battleships in a Board (`battleships-in-a-board`) — original, grid

## Problem statement (Description tab)

You are given an `m x n` grid called `board` where every cell is one of two characters:

- `'X'` — part of a battleship
- `'.'` — empty water

Return the number of battleships on the board.

Each battleship is a straight line of one or more `'X'` cells, placed either fully horizontally (all in one row) or fully vertically (all in one column). Ships never touch each other: between any two different battleships there is always at least one cell of empty water, even diagonally-adjacent ships never share an edge.

### Examples
- Example 1: input `board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]` → output `2`. There is a 1-cell ship in the top-left corner and a vertical 3-cell ship in the last column.
- Example 2: input `board = [["."]]` → output `0`. The board is all water, so there are no battleships.

### Graph rules (authored)
- Nodes: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- Edges: Only when the two `X` cells share a horizontal or vertical side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-two-ships`, facet "component count")
Raw input shown:
```
board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The lone X is one component and the vertical run is a second ship.
- ❌ [near-miss] "4"
    feedback: That result follows the count every x cell bug, not the exact picture. (misconception: count-every-x-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,3)", "(1,3)", "(2,3)" · edges: (0,3)—(1,3), (1,3)—(2,3)
"Why" shown after success: The lone X is one component and the vertical run is a second ship.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact ship cells")
Raw input shown:
```
board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (0,3) / (1,3) / (2,3)
2. Picture B / (0,0) / (0,3) / (1,3) / (2,3)
3. Picture C / (0,0) / (0,3) / (1,3) / (2,3)
4. Picture D / (0,0) / (0,3) / (1,3)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,3), (1,3), (2,3) · edges: (0,3)—(1,3), (1,3)—(2,3)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,3), (1,3), (2,3) · edges: (0,3)—(1,3)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,3), (1,3), (2,3) · edges: (0,3)→(1,3), (1,3)→(2,3)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (0,3), (1,3) · edges: (0,3)—(1,3)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-one-horizontal`, facet "side adjacency")
Raw input shown:
```
board = [["X","X","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. All three X cells connect through shared sides.
- ❌ [near-miss] "3"
    feedback: That result follows the count cells not components bug, not the exact picture. (misconception: count-cells-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
"Why" shown after success: All three X cells connect through shared sides.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`core-rule`, facet "cell identity")
Raw input shown:
```
On a Battleships board, which cells should become nodes when we model the ships?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **On a Battleships board, which cells should become nodes when we model the ships?**
Choices as displayed (top to bottom):
1. A / Each whole horizontal or vertical ship should be one node.
2. B / Only the leftmost or topmost X of each ship should be a node.
3. C / Every board cell, both X and ., should be a ship node.
4. D / Every cell containing X, including a lone X with no neighboring ship part.
Answer key + feedback per choice (data):
- ✅ CORRECT [x-cells] "Every cell containing `X`, including a lone `X` with no neighboring ship part."
    feedback: Correct. Every ship cell is a node; water is only background.
- ❌ [whole-ships] "Each whole horizontal or vertical ship should be one node."
    feedback: A ship is a connected group found after the graph is built. Its individual X cells are the nodes. (misconception: component-as-node)
- ❌ [ship-starts] "Only the leftmost or topmost `X` of each ship should be a node."
    feedback: That shortcut may help count ships, but it does not model the cells DFS can visit along a ship. (misconception: only-ship-heads)
- ❌ [all-cells] "Every board cell, both `X` and `.`, should be a ship node."
    feedback: Water cannot belong to or connect two ships, so it should not be in this land-only graph. (misconception: include-water-nodes)
"Why" shown after success: Correct. Every ship cell is a node; water is only background.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`relation-rule`, facet "side adjacency")
Raw input shown:
```
When should two `X` nodes be connected in the ship picture?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should two X nodes be connected in the ship picture?**
Choices as displayed (top to bottom):
1. A / When they touch by a side or by a corner.
2. B / Whenever they are anywhere in the same row or column, even with water between them.
3. C / Only when the two X cells share a horizontal or vertical side.
4. D / Connect the nearest X cells from separate ships so every ship can be reached.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-x] "Only when the two `X` cells share a horizontal or vertical side."
    feedback: Correct. Side-touching X cells are consecutive pieces of one ship.
- ❌ [eight-way] "When they touch by a side or by a corner."
    feedback: Diagonal touching does not join cells in this problem. Treating corners as edges can merge ships. (misconception: allow-diagonal-edge)
- ❌ [same-row-column] "Whenever they are anywhere in the same row or column, even with water between them."
    feedback: Water breaks a ship. Only immediately adjacent X cells have an edge. (misconception: jump-across-water)
- ❌ [different-ships] "Connect the nearest `X` cells from separate ships so every ship can be reached."
    feedback: Separate ships must remain separate components. Adding bridges changes the count. (misconception: connect-components)
"Why" shown after success: Correct. Side-touching X cells are consecutive pieces of one ship.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-separated`, facet "exact ship cells")
Raw input shown:
```
board = [["X",".","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Water between the X cells prevents an edge.
- ❌ [near-miss] "1"
    feedback: That result follows the jump across water bug, not the exact picture. (misconception: jump-across-water)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
"Why" shown after success: Water between the X cells prevents an edge.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "component count")
Raw input shown:
```
board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]], how many ships are pictured?**
Choices as displayed (top to bottom):
1. A / 4 ships
2. B / 2 ships
3. C / 1 ship
4. D / 3 ships
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2 ships"
    feedback: Correct: one single-cell ship and one vertical ship.
- ❌ [four] "4 ships"
    feedback: This counts X cells instead of connected ships. (misconception: count-cells)
- ❌ [one] "1 ship"
    feedback: Water separates the left X from the right column. (misconception: merge-separated-ships)
- ❌ [three] "3 ships"
    feedback: The three side-touching X cells in the last column form one ship, not three. (misconception: split-vertical-ship)
"Why" shown after success: Correct: one single-cell ship and one vertical ship.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-empty`, facet "cell identity")
Raw input shown:
```
board = [["X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A lone X is still a complete one-cell ship.
- ❌ [near-miss] "0"
    feedback: That result follows the require neighbor for ship bug, not the exact picture. (misconception: require-neighbor-for-ship)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: A lone X is still a complete one-cell ship.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "component count")
Raw input shown:
```
board = [["X",".","X"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does the one-row board [["X",".","X"]] contain?**
Choices as displayed (top to bottom):
1. A / 1 ship
2. B / 2 ships
3. C / 3 ships
4. D / 0 ships
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2 ships"
    feedback: Correct. Water separates the two one-cell ships.
- ❌ [one] "1 ship"
    feedback: This jumps across the water cell and merges separated X cells. (misconception: bridge-across-water)
- ❌ [three] "3 ships"
    feedback: This counts the water cell as though every board position were a ship. (misconception: count-water-as-ship)
- ❌ [zero] "0 ships"
    feedback: This drops valid one-cell ships because each X has no X neighbor. (misconception: drop-single-cell-ships)
"Why" shown after success: Correct. Water separates the two one-cell ships.
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
board = [["X",".","."],[".","X","."],[".",".","X"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Diagonal contact does not join any of the three ships.; ❌ "1" — That result follows the connect diagonals bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [whole-ships]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every cell containing X, including a lone X with no neighboring ship part.
Your choice: A ship is a connected group found after the graph is built. Its individual X cells are the nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
board = [[".","X"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Only the X cell belongs to the ship graph.; ❌ "2" — That result follows the include water node bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)" · edges: none
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [eight-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Only when the two X cells share a horizontal or vertical side.
Your choice: Diagonal touching does not join cells in this problem. Treating corners as edges can merge ships.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
board = [["X","X"]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. The two side-connected X cells form one valid straight ship.; ❌ "2" — That result follows the count cells not ships bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2 ships
Your choice: This counts X cells instead of connected ships.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
board = [["X",".","X"],["X",".","."]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "2" — Correct. The left pair is one ship; the top-right X is another.; ❌ "3" — That result follows the count every x cell bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(0,2)" · edges: (0,0)—(1,0)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2 ships
Your choice: This jumps across the water cell and merges separated X cells.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
board = [["X","."],[".","X"]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. A DFS using eight directions would incorrectly merge these two ships.; ❌ "1" — That result follows the eight direction dfs bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Wrong ship selected"; authored goal, NOT shown to student: "Use two valid separated ships, and choose a start cell that is not listed first.")
Everything the student sees (text):
```
P
Priya's broken search

Priya ignores the chosen first ship cell and uses a different one.

Your main goal: Expose Priya's mistake. Draw two graphs: first the correct graph, then Priya's graph using the mistake.

CHOOSE THE FIRST SHIP CELL
first ship cell
OUTPUT
CORRECT OUTPUT
PRIYA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first ship cell
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
2 · Priya's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST SHIP CELL / first ship cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | PRIYA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,3)", "(1,3)", "(2,3)"): REJECTED with "Also draw (0,1), the wrong first ship cell used by the broken search."
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
PRIYA'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Missing hull segment"; authored goal, NOT shown to student: "Make the final side link necessary to reach the end of one straight ship.")
Everything the student sees (text):
```
O
Owen's broken search

Owen builds every listed connection except the last one.

Your main goal: Expose Owen's mistake. Draw two graphs: first the correct graph, then Owen's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST SHIP CELL
first ship cell
OUTPUT
CORRECT OUTPUT
OWEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first ship cell
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
2 · Owen's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST SHIP CELL / first ship cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | OWEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
OWEN'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Long ship stopped early"; authored goal, NOT shown to student: "Use one legal straight ship with an X cell more than one side-step from the start.")
Everything the student sees (text):
```
Z
Zara's broken search

Zara stops after one hop instead of continuing.

Your main goal: Expose Zara's mistake. Draw two graphs: first the correct graph, then Zara's graph using the mistake.

CHOOSE THE FIRST SHIP CELL
first ship cell
OUTPUT
CORRECT OUTPUT
ZARA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first ship cell
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
2 · Zara's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST SHIP CELL / first ship cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ZARA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
ZARA'S OUTPUT
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
board = [[".","X"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the leftmost or topmost `X` of each ship should be a node.”"
    feedback if wrong: That shortcut may help count ships, but it does not model the cells DFS can visit along a ship. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- [YES is correct] (direct-vs-reach) "(0,1) can reach itself without using an edge, but the graph still has no direct (0,1)—(0,1) edge."
    feedback if wrong: Correct. A zero-step path makes (0,1) reachable from itself; it does not invent a self-edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,1) has 0 direct neighbors.
×
That shortcut may help count ships, but it does not model the cells DFS can visit along a ship. Correct node rule: Every cell containing
X
, including a lone
X
with no neighboring ship part.
×
Correct. A zero-step path makes (0,1) reachable from itself; it does not invent a self-edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "Because (0,1) can reach itself, the graph should contain a direct (0,1)—(0,1) edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct (0,1)—(0,1) self-edge.
- [NO is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Every board cell, both `X` and `.`, should be a ship node.”"
    feedback if wrong: Water cannot belong to or connect two ships, so it should not be in this land-only graph. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Self-reachability can use zero edges. The input does not define a direct (0,1)—(0,1) self-edge.
×
(0,1) has 0 direct neighbors.
×
Water cannot belong to or connect two ships, so it should not be in this land-only graph. Correct node rule: Every cell containing
X
, including a lone
X
with no neighboring ship part.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each whole horizontal or vertical ship should be one node.”"
    feedback if wrong: A ship is a connected group found after the graph is built. Its individual X cells are the nodes. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- [YES is correct] (direct-vs-reach) "(0,1) can reach itself without using an edge, but the graph still has no direct (0,1)—(0,1) edge."
    feedback if wrong: Correct. A zero-step path makes (0,1) reachable from itself; it does not invent a self-edge.
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
Every cell containing X, including a lone X with no neighboring ship part.
EDGES
Only when the two X cells share a horizontal or vertical side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
board = [["X","X"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Every board cell, both `X` and `.`, should be a ship node.”"
    feedback if wrong: Water cannot belong to or connect two ships, so it should not be in this land-only graph. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)—(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q3
Raw input shown:
```
board = [["X",".","X"],["X",".","."]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(0,2)" · edges: (0,0)—(1,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the leftmost or topmost `X` of each ship should be a node.”"
    feedback if wrong: That shortcut may help count ships, but it does not model the cells DFS can visit along a ship. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- [YES is correct] (direct-vs-reach) "(0,0) and (1,0) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(1,0) as one direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 1 direct neighbor."
    feedback if wrong: (1,0) has 1 direct neighbor.
Result: PASSED

### S3 Q4
Raw input shown:
```
board = [["X","."],[".","X"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each whole horizontal or vertical ship should be one node.”"
    feedback if wrong: A ship is a connected group found after the graph is built. Its individual X cells are the nodes. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (1,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Result: PASSED

### S3 Q5
Raw input shown:
```
board = [["X",".","."],[".","X","."],[".",".","X"]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (1,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(2,2) has exactly 0 direct neighbors."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every board cell, both `X` and `.`, should be a ship node.”"
    feedback if wrong: Water cannot belong to or connect two ships, so it should not be in this land-only graph. Correct node rule: Every cell containing `X`, including a lone `X` with no neighboring ship part.
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

### S4 case 1 — `authored-deep-case` · bug: Only horizontal ship starts are counted
Input shown:
```
REAL PROBLEM INPUT
board = [["X",".","X"],["X",".","."],[".",".","."]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countBattleships(board) {
  let ships = 0;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      if (board[row][column] !== "X") {
        continue;
      }
      const leftIsShip = column > 0 && board[row][column - 1] === "X";
      const hasRight =
        column + 1 < board[0].length && board[row][column + 1] === "X";
      if (!leftIsShip && hasRight) {
        ships++;
      }
    }
  }
  return ships;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(0,2)" · edges: (0,0)—(1,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of battleships" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A It wrongly joins ships that touch diagonally in this case.
- B It recognizes only ships with a right neighbor.
- C It counts every X cell as a separate ship.
Diagnosis answer key + feedback:
- ✅ [horizontal-only] "It recognizes only ships with a right neighbor." — feedback: Correct. The vertical pair is one ship and the isolated X is another valid one-cell ship; neither has a right neighbor.
- ❌ [diagonal-touch] "It wrongly joins ships that touch diagonally in this case." — feedback: No. These ships do not touch diagonally, and the code never checks diagonals.
- ❌ [counts-cells] "It counts every X cell as a separate ship." — feedback: No. That bug would return 3, not 0.
Graph proof shown in feedback: code rule "A component is counted only when its first cell also has an X to the right." → changed graph "Orthogonally adjacent X cells form ship components: {(0,0),(1,0)} and {(0,2)}." → boundary "The input contains a vertical component and a one-node component, with no horizontal component." → returned value "Both real components are skipped, so 0 is returned instead of 2."
Output-format probes: ❌ quoted number → `"0"`; ❌ trailing period → `0.`
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
About your diagnosis: No. These ships do not touch diagonally, and the code never checks diagonals.
Code rule: A component is counted only when its first cell also has an X to the right. → Changed graph: Orthogonally adjacent X cells form ship components: {(0,0),(1,0)} and {(0,2)}. → Reachable boundary: The input contains a vertical component and a one-node component, with no horizontal component.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only horizontal ship starts are counted
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: A component is counted only when its first cell also has an X to the right. → Changed graph: Orthogonally adjacent X cells form ship components: {(0,0),(1,0)} and {(0,2)}. → Reachable boundary: The input contains a vertical component and a one-node component, with no horizontal component. → Returned value: Both real components are skipped, so 0 is returned instead of 2.
```

### S4 case 2 — `build-two-ships` · bug: Only horizontal ship starts are counted
Input shown:
```
REAL PROBLEM INPUT
board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countBattleships(board) {
  let ships = 0;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      if (board[row][column] !== "X") {
        continue;
      }
      const leftIsShip = column > 0 && board[row][column - 1] === "X";
      const hasRight =
        column + 1 < board[0].length && board[row][column + 1] === "X";
      if (!leftIsShip && hasRight) {
        ships++;
      }
    }
  }
  return ships;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,3)", "(1,3)", "(2,3)" · edges: (0,3)—(1,3), (1,3)—(2,3)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of battleships" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A It wrongly joins ships that touch diagonally in this case.
- B The code counts every X cell as a separate ship.
- C It recognizes only ships with a right neighbor.
Diagnosis answer key + feedback:
- ✅ [horizontal-only] "It recognizes only ships with a right neighbor." — feedback: Correct. The board has singleton (0,0) and vertical ship (0,3)—(1,3)—(2,3); neither start has an X immediately to its right. Therefore the shown code returns 0, while the real problem returns 2.
- ❌ [diagonal-touch] "It wrongly joins ships that touch diagonally in this case." — feedback: No. These ships do not touch diagonally, and the code never checks diagonals.
- ❌ [counts-cells] "The code counts every X cell as a separate ship." — feedback: The code tests for a right neighbor; it is not counting every X. Count one start cell per complete ship instead.
Graph proof shown in feedback: code rule "A component is counted only when its first cell also has an X to the right." → changed graph "Nodes: (0,0), (0,3), (1,3), (2,3). Direct edges: (0,3)—(1,3); (1,3)—(2,3)." → boundary "The board has singleton (0,0) and vertical ship (0,3)—(1,3)—(2,3); neither start has an X immediately to its right." → returned value "The shown code returns 0; the source-repo reference solution returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only horizontal ship starts are counted
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: A component is counted only when its first cell also has an X to the right. → Changed graph: Nodes: (0,0), (0,3), (1,3), (2,3). Direct edges: (0,3)—(1,3); (1,3)—(2,3). → Reachable boundary: The board has singleton (0,0) and vertical ship (0,3)—(1,3)—(2,3); neither start has an X immediately to its right. → Returned value: The shown code returns 0; the source-repo reference solution returns 2.
```

### S4 case 3 — `build-separated` · bug: Only horizontal ship starts are counted
Input shown:
```
REAL PROBLEM INPUT
board = [["X",".","X"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countBattleships(board) {
  let ships = 0;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      if (board[row][column] !== "X") {
        continue;
      }
      const leftIsShip = column > 0 && board[row][column - 1] === "X";
      const hasRight =
        column + 1 < board[0].length && board[row][column + 1] === "X";
      if (!leftIsShip && hasRight) {
        ships++;
      }
    }
  }
  return ships;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of battleships" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A It recognizes only ships with a right neighbor.
- B It wrongly joins ships that touch diagonally in this case.
- C The code counts every X cell as a separate ship.
Diagnosis answer key + feedback:
- ✅ [horizontal-only] "It recognizes only ships with a right neighbor." — feedback: Correct. Cells (0,0) and (0,2) are two separate singleton ships, and both are rejected because neither has a right neighbor. Therefore the shown code returns 0, while the real problem returns 2.
- ❌ [diagonal-touch] "It wrongly joins ships that touch diagonally in this case." — feedback: No. These ships do not touch diagonally, and the code never checks diagonals.
- ❌ [counts-cells] "The code counts every X cell as a separate ship." — feedback: The code tests for a right neighbor; it is not counting every X. Count one start cell per complete ship instead.
Graph proof shown in feedback: code rule "A component is counted only when its first cell also has an X to the right." → changed graph "Nodes: (0,0), (0,2). Direct edges: none." → boundary "Cells (0,0) and (0,2) are two separate singleton ships, and both are rejected because neither has a right neighbor." → returned value "The shown code returns 0; the source-repo reference solution returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only horizontal ship starts are counted
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: A component is counted only when its first cell also has an X to the right. → Changed graph: Nodes: (0,0), (0,2). Direct edges: none. → Reachable boundary: Cells (0,0) and (0,2) are two separate singleton ships, and both are rejected because neither has a right neighbor. → Returned value: The shown code returns 0; the source-repo reference solution returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```