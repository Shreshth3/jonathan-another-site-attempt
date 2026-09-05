# Maximum Number of Fish in a Grid (`maximum-number-of-fish-in-a-grid`) — new, grid

## Problem statement (Description tab)

You are given an `m x n` grid describing a pond. If `grid[i][j] == 0`, that cell is land and cannot be entered. If `grid[i][j] > 0`, that cell is water and currently holds exactly that many fish.

A fisher chooses any water cell to start from. On each cell they visit, they catch **all** of its fish, and they may then move up, down, left, or right to a neighboring water cell and repeat.

Return the largest total number of fish the fisher can catch if they pick the best possible starting cell. If the grid has no water cells at all, return `0`.

### Examples
- Example 1: input `grid = [[0,2,1,0],[4,0,0,3],[1,0,0,4],[0,3,2,0]]` → output `7`. The best pool of connected water cells is on the right side: the cells holding 3 and 4 fish are vertically adjacent, giving 3 + 4 = 7. The other pools total 5 (4+1 on the left), 3 (2+1 on top), and 5 (3+2 on the bottom).
- Example 2: input `grid = [[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]]` → output `1`. The only water cells are the two opposite corners. Each holds 1 fish and is not connected to any other water, so the best possible catch is 1.

### Graph rules (authored)
- Nodes: Every cell with a value greater than 0, weighted by its fish count.
- Edges: The positive cells share a side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).

### HARNESS-DETECTED ERRORS
- step1: step1 task 7 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "positive water cells")
Raw input shown:
```
grid=[[2,1],[0,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Correct. The three positive cells are side-connected and their fish add.
- ❌ [wrong] "3"
    feedback: That follows the take largest cell only bug. (misconception: take-largest-cell-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
"Why" shown after success: The three positive cells are side-connected and their fish add.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "positive water cells")
Raw input shown:
```
grid=[[2,1],[0,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1)
2. Picture A / (0,0) / (0,1) / (1,1)
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

### S1 Q3 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid=[[2,0],[0,3]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Diagonal water cells are separate components.
- ❌ [wrong] "5"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal water cells are separate components.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which pond cells become weighted nodes?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which pond cells become weighted nodes?**
Choices as displayed (top to bottom):
1. A / Every cell with a value greater than 0, weighted by its fish count.
2. B / Every cell, including 0-valued land.
3. C / Only cells tied for the largest individual fish value.
4. D / One node per finished pool, storing only its largest cell.
Answer key + feedback per choice (data):
- ✅ CORRECT [water] "Every cell with a value greater than 0, weighted by its fish count."
    feedback: Right. A component's total is the sum of its node weights.
- ❌ [all] "Every cell, including 0-valued land."
    feedback: Land cannot be entered and must separate pools. (misconception: walks-on-land)
- ❌ [max] "Only cells tied for the largest individual fish value."
    feedback: Several smaller connected cells can have the best total. (misconception: chooses-largest-cell)
- ❌ [pool] "One node per finished pool, storing only its largest cell."
    feedback: A pool total uses all connected water-cell values. (misconception: collapses-and-maxes-component)
"Why" shown after success: Right. A component's total is the sum of its node weights.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
When can the fisher move between two water nodes?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When can the fisher move between two water nodes?**
Choices as displayed (top to bottom):
1. A / The positive cells share a side.
2. B / The positive cells share a side or corner.
3. C / The cells contain the same number of fish.
4. D / The cells are in the same row with only 0s between them.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "The positive cells share a side."
    feedback: Right. Movement is up, down, left, or right.
- ❌ [eight] "The positive cells share a side or corner."
    feedback: Diagonal pools stay separate. (misconception: allows-diagonals)
- ❌ [same-fish] "The cells contain the same number of fish."
    feedback: Fish amounts do not control movement. (misconception: connects-equal-values)
- ❌ [through-zero] "The cells are in the same row with only 0s between them."
    feedback: Land blocks movement; it cannot be crossed. (misconception: crosses-land)
"Why" shown after success: Right. Movement is up, down, left, or right.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
grid=[[1,2,0],[0,3,4]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 7
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Correct. All four positive cells form one bent component.
- ❌ [wrong] "7"
    feedback: That follows the omit upstream cells bug. (misconception: omit-upstream-cells)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,1)—(1,1), (1,1)—(1,2)
"Why" shown after success: All four positive cells form one bent component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "largest fish sum")
Raw input shown:
```
grid = [[0,2,1,0],[4,0,0,3],[1,0,0,4],[0,3,2,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum fish total is returned for the shown grid?**
Choices as displayed (top to bottom):
1. A / 20
2. B / 7
3. C / 5
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "7"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "20"
    feedback: The fisher chooses one pool, not all disconnected water. (misconception: sums-all-pools)
- ❌ [wrong-2] "5"
    feedback: A different connected pool has a larger total. (misconception: chooses-first-pool)
- ❌ [wrong-3] "4"
    feedback: The answer is fish total, not number of pools. (misconception: counts-components)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "largest fish sum")
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
    feedback: Correct. Land contains no fish and is not a graph node.
- ❌ [wrong] "1"
    feedback: That follows the count land cell bug. (misconception: count-land-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes:  · edges: none
"Why" shown after success: Land contains no fish and is not a graph node.
Result when solved correctly through the UI: **FAILED / DEAD END** Correct graph has ZERO nodes; answer buttons stay disabled (student cannot answer without drawing a wrong node) · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "largest fish sum")
Raw input shown:
```
grid = [[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum fish total is returned for the shown grid?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 0
4. D / 16
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: The fisher cannot cross land between the corners. (misconception: combines-disconnected-water)
- ❌ [wrong-2] "0"
    feedback: Either corner is a valid starting water cell. (misconception: requires-movement)
- ❌ [wrong-3] "16"
    feedback: This treats each of the 16 grid cells as one fish; land contributes zero and separates the two water cells. (misconception: counts-grid-cells)
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
grid=[[5,0,2],[0,0,2]]
```
Remedial question: **What should the function return?** · choices shown: 4 | 5
Remedial answer key: ✅ "5" — Correct. The isolated 5 beats the two-cell component totaling 4.; ❌ "4" — That follows the choose most cells not most fish bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,2)" · edges: (0,2)—(1,2)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [all]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every cell with a value greater than 0, weighted by its fish count.
Your choice: Land cannot be entered and must separate pools.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,1],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 4 | 1
Remedial answer key: ✅ "4" — Correct. Fish are summed across the whole component.; ❌ "1" — That follows the take maximum cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The positive cells share a side.
Your choice: Diagonal pools stay separate.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[3],[4],[0]]
```
Remedial question: **What should the function return?** · choices shown: 4 | 7
Remedial answer key: ✅ "7" — Correct. The two vertical water cells connect.; ❌ "4" — That follows the horizontal only search bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)" · edges: (0,0)—(1,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
7
Your choice: The fisher chooses one pool, not all disconnected water.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[2,0,2]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. The zero splits the two fishing areas.; ❌ "4" — That follows the cross land gap bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: The fisher cannot cross land between the corners.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[[1,2],[3,0]]
```
Remedial question: **What should the function return?** · choices shown: 5 | 6
Remedial answer key: ✅ "6" — Correct. The L-shaped component includes all three values.; ❌ "5" — That follows the exclude start cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(1,0), (0,0)—(0,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Boat launch"; authored goal, NOT shown to student: "Create two water regions so the chosen start matters.")
Everything the student sees (text):
```
T
Tucker's broken search

Tucker runs the search from a different fishing start.

Your main goal: Expose Tucker's mistake. Draw two graphs: first the correct graph, then Tucker's graph using the mistake.

CHOOSE THE FISHING START
fishing start
OUTPUT
CORRECT OUTPUT
TUCKER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose fishing start
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
2 · Tucker's graph
Check my graph
→
```
Start field: label "CHOOSE THE FISHING START / fishing start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | TUCKER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,1)"): accepted
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
TUCKER'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Fish upstream"; authored goal, NOT shown to student: "Place valuable fish more than one move from the start.")
Everything the student sees (text):
```
K
Karina's broken search

Karina never explores beyond the start's immediate neighbors.

Your main goal: Expose Karina's mistake. Draw two graphs: first the correct graph, then Karina's graph using the mistake.

CHOOSE THE FISHING START
fishing start
OUTPUT
CORRECT OUTPUT
KARINA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose fishing start
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
2 · Karina's graph
Check my graph
→
```
Start field: label "CHOOSE THE FISHING START / fishing start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KARINA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
KARINA'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `add-diagonals` (authored level "Dry corner"; authored goal, NOT shown to student: "Keep diagonally touching fish in separate water regions.")
Everything the student sees (text):
```
R
Rafael's broken search

Rafael allows diagonal steps even though only side moves are legal.

Your main goal: Expose Rafael's mistake. Draw two graphs: first the correct graph, then Rafael's graph using the mistake.

CHOOSE THE FISHING START
fishing start
OUTPUT
CORRECT OUTPUT
RAFAEL’S OUTPUT
Drawing 1 of 2: Correct graph · Choose fishing start
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
2 · Rafael's graph
Check my graph
→
```
Start field: label "CHOOSE THE FISHING START / fishing start", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | RAFAEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(1,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) none · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(1,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
RAFAEL'S OUTPUT
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
grid=[[5,0,2],[0,0,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,2)" · edges: (0,2)—(1,2)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "(1,2) has exactly 1 direct neighbor."
    feedback if wrong: (1,2) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node per finished pool, storing only its largest cell.”"
    feedback if wrong: A pool total uses all connected water-cell values. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [YES is correct] (direct-vs-reach) "(0,2) and (1,2) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,2)—(1,2) as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(1,2) has 1 direct neighbor.
×
A pool total uses all connected water-cell values. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
×
Correct. The mini-example lists (0,2)—(1,2) as one direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every cell, including 0-valued land.”"
    feedback if wrong: Land cannot be entered and must separate pools. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [YES is correct] (direct-vs-reach) "(0,2) and (1,2) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,2)—(1,2) as one direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Land cannot be entered and must separate pools. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
×
Correct. The mini-example lists (0,2)—(1,2) as one direct edge.
×
(0,0) has 0 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,2) has exactly 1 direct neighbor."
    feedback if wrong: (0,2) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells tied for the largest individual fish value.”"
    feedback if wrong: Several smaller connected cells can have the best total. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [YES is correct] (direct-vs-reach) "(0,2) and (1,2) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,2)—(1,2) as one direct edge.
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
Every cell with a value greater than 0, weighted by its fish count.
EDGES
The positive cells share a side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=[[1,1],[1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every cell, including 0-valued land.”"
    feedback if wrong: Land cannot be entered and must separate pools. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,0) and (1,0)—(1,1), so it should also contain a direct (0,0)—(1,1) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,0) has exactly 3 direct neighbors."
    feedback if wrong: (0,0) has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=[[3],[4],[0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)" · edges: (0,0)—(1,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,0), but there is no direct (0,0)—(1,0) edge."
    feedback if wrong: The mini-example lists (0,0)—(1,0) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(1,0) has exactly 0 direct neighbors."
    feedback if wrong: (1,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node per finished pool, storing only its largest cell.”"
    feedback if wrong: A pool total uses all connected water-cell values. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=[[2,0,2]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cells tied for the largest individual fish value.”"
    feedback if wrong: Several smaller connected cells can have the best total. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=[[1,2],[3,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(1,0), (0,0)—(0,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Every cell, including 0-valued land.”"
    feedback if wrong: Land cannot be entered and must separate pools. Correct node rule: Every cell with a value greater than 0, weighted by its fish count.
- [NO is correct] (direct-vs-reach) "The correct graph has (1,0)—(0,0) and (0,0)—(0,1), so it should also contain a direct (1,0)—(0,1) edge."
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

### S4 case 1 — `authored-deep-case` · bug: Water cells are counted instead of fish
Input shown:
```
REAL PROBLEM INPUT
grid: [[2, 3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findMaxFish(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function catchPool(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total += 1;
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] > 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] > 0 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, catchPool(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)—(0,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `5`
Diagnosis choices as displayed:
- A The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case.
- B total += 1 measures component area instead of adding grid[r][c] fish at each node.
- C Using one seen set prevents a later start from catching the same pool again.
Diagnosis answer key + feedback:
- ❌ [choose-start] "The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case." — feedback: The algorithm may start in any positive component; the bug is counting cells instead of their fish weights.
- ✅ [drops-node-weights] "total += 1 measures component area instead of adding grid[r][c] fish at each node." — feedback: Exactly. The component's node weights are 2 and 3.
- ❌ [global-seen] "Using one seen set prevents a later start from catching the same pool again." — feedback: Each pool only needs one total; the wrong total is caused by ignoring weights.
Graph proof shown in feedback: code rule "A visited node contributes constant weight 1." → changed graph "One component contains two adjacent weighted nodes carrying 2 and 3 fish." → boundary "Fish weights differ from one and sum to 5 while area is 2." → returned value "The helper returns component size 2 instead of fish total 5."
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
About your diagnosis: The algorithm may start in any positive component; the bug is counting cells instead of their fish weights.
Code rule: A visited node contributes constant weight 1. → Changed graph: One component contains two adjacent weighted nodes carrying 2 and 3 fish. → Reachable boundary: Fish weights differ from one and sum to 5 while area is 2.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Water cells are counted instead of fish
INCORRECT OUTPUT
2
CORRECT OUTPUT
5
Code rule: A visited node contributes constant weight 1. → Changed graph: One component contains two adjacent weighted nodes carrying 2 and 3 fish. → Reachable boundary: Fish weights differ from one and sum to 5 while area is 2. → Returned value: The helper returns component size 2 instead of fish total 5.
```

### S4 case 2 — `build-1` · bug: Water cells are counted instead of fish
Input shown:
```
REAL PROBLEM INPUT
grid=[[2,1],[0,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findMaxFish(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function catchPool(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total += 1;
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] > 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] > 0 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, catchPool(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `6`
Diagnosis choices as displayed:
- A The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case.
- B Using one seen set prevents a later start from catching the same pool again.
- C total += 1 measures component area instead of adding grid[r][c] fish at each node.
Diagnosis answer key + feedback:
- ❌ [choose-start] "The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case." — feedback: The algorithm may start in any positive component; the bug is counting cells instead of their fish weights.
- ✅ [drops-node-weights] "total += 1 measures component area instead of adding grid[r][c] fish at each node." — feedback: Correct. The connected cells hold 2, 1, and 3 fish, so counting three nodes loses their weights and returns 3 instead of 6.
- ❌ [global-seen] "Using one seen set prevents a later start from catching the same pool again." — feedback: Each pool only needs one total; the wrong total is caused by ignoring weights.
Graph proof shown in feedback: code rule "A visited node contributes constant weight 1." → changed graph "Positive cells (0,0)—(0,1)—(1,1) form one pool with weights 2, 1, and 3." → boundary "One connected pool contains weights 2, 1, and 3, so its node count 3 differs from its fish total 6." → returned value "The shown code returns 3; the real problem returns 6."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Water cells are counted instead of fish
INCORRECT OUTPUT
3
CORRECT OUTPUT
6
Code rule: A visited node contributes constant weight 1. → Changed graph: Positive cells (0,0)—(0,1)—(1,1) form one pool with weights 2, 1, and 3. → Reachable boundary: One connected pool contains weights 2, 1, and 3, so its node count 3 differs from its fish total 6. → Returned value: The shown code returns 3; the real problem returns 6.
```

### S4 case 3 — `build-2` · bug: Water cells are counted instead of fish
Input shown:
```
REAL PROBLEM INPUT
grid=[[2,0],[0,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findMaxFish(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let largestValue = 0;
  function catchPool(startRow, startColumn) {
    let total = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      total += 1;
      for (const [rowChange, columnChange] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        const key = `${nextRow},${nextColumn}`;
        if (
          isInBounds(grid, nextRow, nextColumn) &&
          grid[nextRow][nextColumn] > 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return total;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] > 0 && !visited.has(`${row},${column}`)) {
        largestValue = Math.max(largestValue, catchPool(row, column));
      }
    }
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A total += 1 measures component area instead of adding grid[r][c] fish at each node.
- B The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case.
- C Using one seen set prevents a later start from catching the same pool again.
Diagnosis answer key + feedback:
- ❌ [choose-start] "The fisher must start on the cell containing 3, so the 2 cell cannot be visited in this case." — feedback: The algorithm may start in any positive component; the bug is counting cells instead of their fish weights.
- ✅ [drops-node-weights] "total += 1 measures component area instead of adding grid[r][c] fish at each node." — feedback: Correct. The isolated positive cell contains 3 fish; treating its node weight as one changes the best pool from 3 to 1.
- ❌ [global-seen] "Using one seen set prevents a later start from catching the same pool again." — feedback: Each pool only needs one total; the wrong total is caused by ignoring weights.
Graph proof shown in feedback: code rule "A visited node contributes constant weight 1." → changed graph "The fish graph has isolated weighted nodes (0,0)=2 and (1,1)=3." → boundary "The best component is one isolated node weighted 3, separating component size 1 from fish total 3." → returned value "The shown code returns 1; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Water cells are counted instead of fish
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: A visited node contributes constant weight 1. → Changed graph: The fish graph has isolated weighted nodes (0,0)=2 and (1,1)=3. → Reachable boundary: The best component is one isolated node weighted 3, separating component size 1 from fish total 3. → Returned value: The shown code returns 1; the real problem returns 3.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```