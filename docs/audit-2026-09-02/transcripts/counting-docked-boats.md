# Counting Docked Boats (`counting-docked-boats`) — variant, grid

## Problem statement (Description tab)

A marina is shown as a grid. `marina[r][c]` is `"B"` if a boat occupies that square and `"."` if it is open water.

Each **boat** is a straight line of one or more squares, laid out either **horizontally** or **vertically**, exactly one square wide. The layout is guaranteed valid: **no two different boats touch each other**, not even diagonally.

A boat is **docked** if at least one of its squares lies on the **border** of the grid — that is, in the first row, the last row, the first column, or the last column. Boats that touch no border square are anchored out in open water.

Write a function `countDockedBoats(marina)` that returns how many boats are docked.

### Examples
- Example 1: input `marina = [[".",".",".","."],[".","B","B","."],[".",".",".","."],["B",".",".","."]]` → output `1`. There are two boats. The horizontal boat at (1,1)-(1,2) sits entirely in the middle, so it is not docked. The 1-square boat at (3,0) is in the last row (and first column), so it is docked. Answer: 1.
- Example 2: input `marina = [["B","B",".",".","."],[".",".",".","B","."],[".",".",".","B","."],[".",".",".","B","."],["B",".",".",".","."]]` → output `2`. Three boats: the horizontal boat at (0,0)-(0,1) touches the top row (docked), the vertical boat at (1,3)-(3,3) touches no border row or column (not docked), and the 1-square boat at (4,0) is on the bottom row (docked). Answer: 2.

### Graph rules (authored)
- Nodes: Each grid square marked `B`, including border squares.
- Edges: Two `B` squares that share an up, down, left, or right side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "border component count")
Raw input shown:
```
marina=["B...B",".....","..B..",".....","BB..."]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many boats are docked?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. 3 side-connected boat components touch a marina border.
- ❌ [bug] "4"
    feedback: This counts the fully offshore center boat along with the three boats that touch a border. (misconception: count-offshore-boats)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(2,2)", "(4,0)", "(4,1)" · edges: (4,0)—(4,1)
"Why" shown after success: 3 side-connected boat components touch a marina border.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact boat cells")
Raw input shown:
```
marina=["B...B",".....","..B..",".....","BB..."]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,4) / (2,2) / (4,0) / (4,1)
2. Picture C / (0,0) / (0,4) / (2,2) / (4,0) / (4,1)
3. Picture D / (0,0) / (0,4) / (2,2) / (4,0)
4. Picture A / (0,0) / (0,4) / (2,2) / (4,0) / (4,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,4), (2,2), (4,0), (4,1) · edges: (4,0)—(4,1)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,4), (2,2), (4,0), (4,1) · edges: none
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,4), (2,2), (4,0), (4,1) · edges: (4,0)→(4,1)
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (0,4), (2,2), (4,0) · edges: none
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`case-2`, facet "border component count")
Raw input shown:
```
marina=["BB.","...",".B."]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many boats are docked?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. 2 side-connected boat components touch a marina border.
- ❌ [bug] "3"
    feedback: This counts the three B cells separately, but the two touching top cells are one boat. (misconception: count-boat-cells)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(2,1)" · edges: (0,0)—(0,1)
"Why" shown after success: 2 side-connected boat components touch a marina border.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-node`, facet "cell identity")
Raw input shown:
```
marina = [[".","B","B",".",".","."],[".",".",".",".",".","."],["B",".","B",".","B","."],["B",".",".",".","B","."],["B",".",".",".",".","."]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node in the marina graph?**
Choices as displayed (top to bottom):
1. A / One completed boat, whether it covers one square or many.
2. B / Only B squares that are not on the marina border.
3. C / Both water and B squares, so DFS can move around the marina.
4. D / Each grid square marked B, including border squares.
Answer key + feedback per choice (data):
- ✅ CORRECT [boat-square] "Each grid square marked `B`, including border squares."
    feedback: Correct. Connected B squares combine into one boat.
- ❌ [whole-boat] "One completed boat, whether it covers one square or many."
    feedback: A boat is the component the search discovers. Its individual B squares are the nodes. (misconception: boat-as-node)
- ❌ [docked-only] "Only `B` squares that are not on the marina border."
    feedback: Border B squares still belong to boats; the border decides whether a boat is docked. (misconception: drop-border)
- ❌ [water-and-boat] "Both water and `B` squares, so DFS can move around the marina."
    feedback: Water separates boats. Making it traversable would merge unrelated B groups. (misconception: water-passable)
"Why" shown after success: Correct. Connected B squares combine into one boat.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-edge`, facet "side adjacency")
Raw input shown:
```
marina = [[".","B","B",".",".","."],[".",".",".",".",".","."],["B",".","B",".","B","."],["B",".",".",".","B","."],["B",".",".",".",".","."]]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which neighboring boat squares should be joined?**
Choices as displayed (top to bottom):
1. A / Two B squares that touch by a side or just a corner.
2. B / Two B squares that share an up, down, left, or right side.
3. C / Connect every B square on the same border of the marina.
4. D / Join horizontal neighbors only for horizontal boats and vertical neighbors only for vertical boats, deciding orientation first.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-boat] "Two `B` squares that share an up, down, left, or right side."
    feedback: Correct. Side-connected B squares form one boat.
- ❌ [eight-way] "Two `B` squares that touch by a side or just a corner."
    feedback: Diagonal contact is not part of a boat. Only shared sides create edges. (misconception: allow-diagonal)
- ❌ [border-link] "Connect every `B` square on the same border of the marina."
    feedback: Border position tells whether a boat is docked; it does not join separated boats. (misconception: border-as-edge)
- ❌ [straight-only] "Join horizontal neighbors only for horizontal boats and vertical neighbors only for vertical boats, deciding orientation first."
    feedback: The search can simply join every side-touching B pair; no guessed orientation is needed. (misconception: preclassify-orientation)
"Why" shown after success: Correct. Side-connected B squares form one boat.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "border component count")
Raw input shown:
```
marina=["B.B"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many boats are docked?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. 2 side-connected boat components touch a marina border.
- ❌ [bug] "1"
    feedback: This merges separate border cells into one boat merely because both touch the same border. (misconception: merge-same-border-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
"Why" shown after success: 2 side-connected boat components touch a marina border.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "border component count")
Raw input shown:
```
marina=[[".","B","B",".",".","."],[".",".",".",".",".","."],["B",".","B",".","B","."],["B",".",".",".","B","."],["B",".",".",".",".","."]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many side-connected boats in this marina touch any border?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 2
3. C / 5
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. Only the top-row boat and left-column boat touch the marina border.
- ❌ [four] "`4`"
    feedback: That counts offshore boats too; a docked boat must touch a border. (misconception: count-all-boats)
- ❌ [five] "`5`"
    feedback: Connected B squares form one boat, so multi-square boats are not counted per cell. (misconception: count-border-cells)
- ❌ [one] "`1`"
    feedback: Both the top border and left border qualify, so two separate boats are docked. (misconception: top-border-only)
"Why" shown after success: Correct. Only the top-row boat and left-column boat touch the marina border.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "border component count")
Raw input shown:
```
marina=["B"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many boats are docked?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. 1 side-connected boat component touches a marina border.
- ❌ [bug] "0"
    feedback: This drops a one-cell boat because it has no neighboring B cell. (misconception: drop-single-cell-boat)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: 1 side-connected boat component touches a marina border.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "border component count")
Raw input shown:
```
marina=[["B",".","B","B"]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the one-row marina B . B B, how many docked boats are shown?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 1
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. Both the lone B and the connected BB pair are boats on the border.
- ❌ [three] "`3`"
    feedback: The adjacent final two B cells are one boat, not two. (misconception: count-cells)
- ❌ [one] "`1`"
    feedback: The B at column 0 and the BB pair are separated by water. (misconception: merge-row-boats)
- ❌ [zero] "`0`"
    feedback: In a one-row grid, that row is both the top and bottom border. (misconception: miss-degenerate-border)
"Why" shown after success: Correct. Both the lone B and the connected BB pair are boats on the border.
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
marina=["BBB"]
```
Remedial question: **How many boats are docked?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. 1 side-connected boat component touches a marina border.; ❌ "3" — This either counts separate B cells or overlooks a border-touching component instead of counting connected boats that touch any border.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [whole-boat]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each grid square marked B, including border squares.
Your choice: A boat is the component the search discovers. Its individual B squares are the nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
marina=["B.","..",".B"]
```
Remedial question: **How many boats are docked?** · choices shown: 0 | 2
Remedial answer key: ✅ "2" — Correct. 2 side-connected boat components touch a marina border.; ❌ "0" — This drops both one-cell boats because neither has a neighboring B cell.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,1)" · edges: none
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [eight-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Two B squares that share an up, down, left, or right side.
Your choice: Diagonal contact is not part of a boat. Only shared sides create edges.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
marina=["B...B","B...B","B...."]
```
Remedial question: **How many boats are docked?** · choices shown: 2 | 5
Remedial answer key: ✅ "2" — Correct. 2 side-connected boat components touch a marina border.; ❌ "5" — This either counts separate B cells or overlooks a border-touching component instead of counting connected boats that touch any border.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,0)", "(1,4)", "(2,0)" · edges: (0,0)—(1,0), (0,4)—(1,4), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: That counts offshore boats too; a docked boat must touch a border.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
marina=["...",".B.","..."]
```
Remedial question: **How many boats are docked?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. 0 side-connected boat components touch a marina border.; ❌ "1" — This either counts separate B cells or overlooks a border-touching component instead of counting connected boats that touch any border.
Remedial required graph (hidden): UNDIRECTED · nodes: "(1,1)" · edges: none
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: The adjacent final two B cells are one boat, not two.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
marina=["B..","...","..B"]
```
Remedial question: **How many boats are docked?** · choices shown: 2 | 0
Remedial answer key: ✅ "2" — Correct. 2 side-connected boat components touch a marina border.; ❌ "0" — This drops both one-cell boats because neither has a neighboring B cell.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Wrong docked boat"; authored goal, NOT shown to student: "Use two valid separated boats, and choose a start cell that is not listed first.")
Everything the student sees (text):
```
K
Katelyn's broken search

Katelyn runs the search from a different first boat cell.

Your main goal: Expose Katelyn's mistake. Draw two graphs: first the correct graph, then Katelyn's graph using the mistake.

CHOOSE THE FIRST BOAT CELL
first boat cell
OUTPUT
CORRECT OUTPUT
KATELYN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first boat cell
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
2 · Katelyn's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST BOAT CELL / first boat cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KATELYN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,4)", "(2,2)", "(4,0)", "(4,1)"): REJECTED with "Also draw (0,1), the wrong first boat cell used by the broken search."
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
KATELYN'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Long hull stopped early"; authored goal, NOT shown to student: "Build one straight boat with cells more than one side-step from the start.")
Everything the student sees (text):
```
I
Ian's broken search

Ian never explores beyond the start's immediate neighbors.

Your main goal: Expose Ian's mistake. Draw two graphs: first the correct graph, then Ian's graph using the mistake.

CHOOSE THE FIRST BOAT CELL
first boat cell
OUTPUT
CORRECT OUTPUT
IAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first boat cell
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
2 · Ian's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST BOAT CELL / first boat cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | IAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
IAN'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Loose dock line"; authored goal, NOT shown to student: "Make the final side connection decide whether the boat reaches the border.")
Everything the student sees (text):
```
A
Ariana's broken search

Ariana accidentally leaves the final direct link out of the graph.

Your main goal: Expose Ariana's mistake. Draw two graphs: first the correct graph, then Ariana's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST BOAT CELL
first boat cell
OUTPUT
CORRECT OUTPUT
ARIANA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first boat cell
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
2 · Ariana's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST BOAT CELL / first boat cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ARIANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
ARIANA'S OUTPUT
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
marina=["B..","...","..B"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (2,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(2,2) has exactly 0 direct neighbors."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Both water and `B` squares, so DFS can move around the marina.”"
    feedback if wrong: Water separates boats. Making it traversable would merge unrelated B groups. Correct node rule: Each grid square marked `B`, including border squares.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. Node membership alone creates neither a direct edge nor a route.
×
(2,2) has 0 direct neighbors.
×
Water separates boats. Making it traversable would merge unrelated B groups. Correct node rule: Each grid square marked
B
, including border squares.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One completed boat, whether it covers one square or many.”"
    feedback if wrong: A boat is the component the search discovers. Its individual B squares are the nodes. Correct node rule: Each grid square marked `B`, including border squares.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (2,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
A boat is the component the search discovers. Its individual B squares are the nodes. Correct node rule: Each grid square marked
B
, including border squares.
×
Correct. Node membership alone creates neither a direct edge nor a route.
×
(0,0) has 0 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (2,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,2).
- [NO is correct] (local-degree) "(2,2) has exactly 1 direct neighbor."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only `B` squares that are not on the marina border.”"
    feedback if wrong: Border B squares still belong to boats; the border decides whether a boat is docked. Correct node rule: Each grid square marked `B`, including border squares.
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
Each grid square marked B, including border squares.
EDGES
Two B squares that share an up, down, left, or right side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
marina=["BBB"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One completed boat, whether it covers one square or many.”"
    feedback if wrong: A boat is the component the search discovers. Its individual B squares are the nodes. Correct node rule: Each grid square marked `B`, including border squares.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(0,1) and (0,1)—(0,2), so it should also contain a direct (0,0)—(0,2) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
Result: PASSED

### S3 Q3
Raw input shown:
```
marina=["B.","..",".B"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,1)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(2,1) has exactly 0 direct neighbors."
    feedback if wrong: (2,1) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Both water and `B` squares, so DFS can move around the marina.”"
    feedback if wrong: Water separates boats. Making it traversable would merge unrelated B groups. Correct node rule: Each grid square marked `B`, including border squares.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (2,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
Result: PASSED

### S3 Q4
Raw input shown:
```
marina=["B...B","B...B","B...."]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,0)", "(1,4)", "(2,0)" · edges: (0,0)—(1,0), (0,4)—(1,4), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only `B` squares that are not on the marina border.”"
    feedback if wrong: Border B squares still belong to boats; the border decides whether a boat is docked. Correct node rule: Each grid square marked `B`, including border squares.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (2,0) through (1,0), but the graph still has no direct (0,0)—(2,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,4) has exactly 1 direct neighbor."
    feedback if wrong: (1,4) has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
marina=["...",".B.","..."]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(1,1)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(1,1) has exactly 1 direct neighbor."
    feedback if wrong: (1,1) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One completed boat, whether it covers one square or many.”"
    feedback if wrong: A boat is the component the search discovers. Its individual B squares are the nodes. Correct node rule: Each grid square marked `B`, including border squares.
- [NO is correct] (direct-vs-reach) "Because (1,1) can reach itself, the graph should contain a direct (1,1)—(1,1) edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct (1,1)—(1,1) self-edge.
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

### S4 case 1 — `authored-deep-case` · bug: Checks only the first square for docking
Input shown:
```
REAL PROBLEM INPUT
marina: [[".", ".", "."], [".", "B", "."], [".", "B", "."]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.marina;
  const visited = new Set();
  function flood(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return;
    }
    if (grid[row][column] !== "B" || visited.has(key)) {
      return;
    }
    visited.add(key);
    flood(row + 1, column);
    flood(row - 1, column);
    flood(row, column + 1);
    flood(row, column - 1);
  }
  let docked = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] !== "B" || visited.has(row + "," + column)) {
        continue;
      }
      const startsOnBorder =
        row === 0 ||
        column === 0 ||
        row === grid.length - 1 ||
        column === grid[0].length - 1;
      flood(row, column);
      if (startsOnBorder) {
        docked++;
      }
    }
  }
  return docked;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(1,1)", "(2,1)" · edges: (1,1)—(2,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of docked boats" · expected buggy output `0` · real correct output `1`
Diagnosis choices as displayed:
- A The flood incorrectly joins boats that touch diagonally, which changes the result produced for this input.
- B The code checks the first discovered square, not whether any square in the whole boat touches the border.
- C The code forgets seen and counts each boat square separately, which changes how the shown graph is evaluated.
Diagnosis answer key + feedback:
- ✅ [start-only-border] "The code checks the first discovered square, not whether any square in the whole boat touches the border." — feedback: Correct. The interior square is scanned first, but its connected partner is on the bottom border.
- ❌ [diagonal-boats] "The flood incorrectly joins boats that touch diagonally, which changes the result produced for this input." — feedback: The flood uses only four side moves, and there is no diagonal boat here.
- ❌ [double-count] "The code forgets seen and counts each boat square separately, which changes how the shown graph is evaluated." — feedback: The seen set correctly keeps this component together.
Graph proof shown in feedback: code rule "Docked status is frozen from the first node before the component is explored." → changed graph "The B at (1,1) connects to the B at (2,1), which lies on the border." → boundary "The first node is interior while a later node in the same component is on the border." → returned value "The only boat is rejected, so the code returns 0 instead of 1."
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
About your diagnosis: The flood uses only four side moves, and there is no diagonal boat here.
Code rule: Docked status is frozen from the first node before the component is explored. → Changed graph: The B at (1,1) connects to the B at (2,1), which lies on the border. → Reachable boundary: The first node is interior while a later node in the same component is on the border.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks only the first square for docking
INCORRECT OUTPUT
0
CORRECT OUTPUT
1
Code rule: Docked status is frozen from the first node before the component is explored. → Changed graph: The B at (1,1) connects to the B at (2,1), which lies on the border. → Reachable boundary: The first node is interior while a later node in the same component is on the border. → Returned value: The only boat is rejected, so the code returns 0 instead of 1.
```

### S4 case 2 — `bottom-border-after-interior-start` · bug: Checks only the first square for docking
Input shown:
```
REAL PROBLEM INPUT
marina: [[".", ".", ".", ".", "."], [".", ".", "B", ".", "."], [".", ".", "B", ".", "."], [".", ".", "B", ".", "."]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.marina;
  const visited = new Set();
  function flood(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return;
    }
    if (grid[row][column] !== "B" || visited.has(key)) {
      return;
    }
    visited.add(key);
    flood(row + 1, column);
    flood(row - 1, column);
    flood(row, column + 1);
    flood(row, column - 1);
  }
  let docked = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] !== "B" || visited.has(row + "," + column)) {
        continue;
      }
      const startsOnBorder =
        row === 0 ||
        column === 0 ||
        row === grid.length - 1 ||
        column === grid[0].length - 1;
      flood(row, column);
      if (startsOnBorder) {
        docked++;
      }
    }
  }
  return docked;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(1,2)", "(2,2)", "(3,2)" · edges: (1,2)—(2,2), (2,2)—(3,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of docked boats" · expected buggy output `0` · real correct output `1`
Diagnosis choices as displayed:
- A The flood joins corner-touching boats, merging separate boats in this marina.
- B The code counts all three squares as separate docked boats.
- C The code freezes docked status at the first square, so it misses the bottom-border square reached later.
Diagnosis answer key + feedback:
- ✅ [start-only-border] "The code freezes docked status at the first square, so it misses the bottom-border square reached later." — feedback: Correct. The scan starts at interior square (1,2), but the same boat reaches bottom-border square (3,2).
- ❌ [diagonal-boats] "The flood joins corner-touching boats, merging separate boats in this marina." — feedback: No boat squares touch diagonally here; all two links are vertical side links.
- ❌ [double-count] "The code counts all three squares as separate docked boats." — feedback: The seen set correctly groups the three squares into one boat.
Graph proof shown in feedback: code rule "Docked status is recorded only from first-scanned node (1,2)." → changed graph "The vertical component (1,2)—(2,2)—(3,2) reaches the bottom border." → boundary "The first node is interior, while the last node of the same boat is on the border." → returned value "The code returns 0; the boat-level rule returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks only the first square for docking
INCORRECT OUTPUT
0
CORRECT OUTPUT
1
Code rule: Docked status is recorded only from first-scanned node (1,2). → Changed graph: The vertical component (1,2)—(2,2)—(3,2) reaches the bottom border. → Reachable boundary: The first node is interior, while the last node of the same boat is on the border. → Returned value: The code returns 0; the boat-level rule returns 1.
```

### S4 case 3 — `one-counted-one-missed` · bug: Checks only the first square for docking
Input shown:
```
REAL PROBLEM INPUT
marina: [["B", ".", ".", ".", "."], [".", ".", ".", ".", "."], [".", ".", "B", "B", "B"], [".", ".", ".", ".", "."]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.marina;
  const visited = new Set();
  function flood(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return;
    }
    if (grid[row][column] !== "B" || visited.has(key)) {
      return;
    }
    visited.add(key);
    flood(row + 1, column);
    flood(row - 1, column);
    flood(row, column + 1);
    flood(row, column - 1);
  }
  let docked = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] !== "B" || visited.has(row + "," + column)) {
        continue;
      }
      const startsOnBorder =
        row === 0 ||
        column === 0 ||
        row === grid.length - 1 ||
        column === grid[0].length - 1;
      flood(row, column);
      if (startsOnBorder) {
        docked++;
      }
    }
  }
  return docked;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(2,2)", "(2,3)", "(2,4)" · edges: (2,2)—(2,3), (2,3)—(2,4)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of docked boats" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The code counts the top-border singleton but misses the second boat whose right-border square is reached after its interior start.
- B The code merges the two boats through a diagonal connection.
- C The code counts each square of the horizontal boat separately.
Diagnosis answer key + feedback:
- ✅ [start-only-border] "The code counts the top-border singleton but misses the second boat whose right-border square is reached after its interior start." — feedback: Correct. Boat (0,0) is counted, but the component beginning at (2,2) is wrongly rejected even though it reaches (2,4).
- ❌ [diagonal-boats] "The code merges the two boats through a diagonal connection." — feedback: The boats are far apart, and the flood uses only side moves.
- ❌ [double-count] "The code counts each square of the horizontal boat separately." — feedback: Seen prevents repeats; the error is the frozen border flag.
Graph proof shown in feedback: code rule "Each component's border status comes only from its first scanned square." → changed graph "There are two components: border singleton (0,0), and path (2,2)—(2,3)—(2,4) ending on the right border." → boundary "The second component starts inside the marina and reaches the border later." → returned value "The code counts only one docked boat; the correct count is two."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks only the first square for docking
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Each component's border status comes only from its first scanned square. → Changed graph: There are two components: border singleton (0,0), and path (2,2)—(2,3)—(2,4) ending on the right border. → Reachable boundary: The second component starts inside the marina and reaches the border later. → Returned value: The code counts only one docked boat; the correct count is two.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```