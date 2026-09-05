# Minimum Island (`structy-minimum-island`) — new, grid

## Problem statement (Description tab)

You are given a grid of characters where `'W'` is water and `'L'` is land.

An island is a group of `'L'` cells connected up, down, left, or right (not diagonally).

Return the size (number of cells) of the SMALLEST island in the grid.

You may assume the grid has at least one island.

### Examples
- Example 1: input `grid = [['W','L','W'],['W','L','W'],['W','W','L']]` → output `1`. There are two islands: {(0,1),(1,1)} with size 2, and {(2,2)} with size 1. The smallest size is 1.
- Example 2: input `grid = [['L','L'],['L','W']]` → output `3`. All three L cells connect into a single island of size 3, so the smallest (and only) island size is 3.

### Graph rules (authored)
- Nodes: Each cell containing L.
- Edges: Immediate land neighbors through a shared side.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "land cells")
Raw input shown:
```
grid=[['L','W'],['L','L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The three L cells form one island of size 3.
- ❌ [wrong] "1"
    feedback: That follows the take smallest cell value bug. (misconception: take-smallest-cell-value)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (1,0)—(1,1)
"Why" shown after success: The three L cells form one island of size 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
grid=[['L','W'],['W','L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Diagonal land cells are separate size-1 islands.
- ❌ [wrong] "2"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: Diagonal land cells are separate size-1 islands.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "land cells")
Raw input shown:
```
grid=[['L','W'],['L','L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (1,0)
2. Picture C / (0,0) / (1,0) / (1,1)
3. Picture D / (0,0) / (1,0) / (1,1)
4. Picture A / (0,0) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)—(1,0), (1,0)—(1,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (1,0) · edges: (0,0)—(1,0)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)—(1,0)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (1,0), (1,1) · edges: (0,0)→(1,0), (1,0)→(1,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
What should count as one unit when measuring an island?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should count as one unit when measuring an island?**
Choices as displayed (top to bottom):
1. A / Each W cell surrounding the island.
2. B / Each cell containing L.
3. C / Each whole island as one node.
4. D / Only L cells on an island's outer border.
Answer key + feedback per choice (data):
- ✅ CORRECT [land] "Each cell containing L."
    feedback: Right. The smallest component size is its land-node count.
- ❌ [water] "Each W cell surrounding the island."
    feedback: Water separates islands but is not part of their size. (misconception: counts-water)
- ❌ [island] "Each whole island as one node."
    feedback: You need the individual land cells to measure island size. (misconception: counts-components-not-cells)
- ❌ [border] "Only L cells on an island's outer border."
    feedback: Interior land cells count toward size too. (misconception: counts-perimeter-cells)
"Why" shown after success: Right. The smallest component size is its land-node count.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
grid=[['L','L','W'],['W','W','L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The later isolated cell is smaller than the first island.
- ❌ [wrong] "2"
    feedback: That follows the return first island bug. (misconception: return-first-island)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
"Why" shown after success: The later isolated cell is smaller than the first island.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
Which L cells belong together by one-step connections?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which L cells belong together by one-step connections?**
Choices as displayed (top to bottom):
1. A / Land cells touching by a side or corner.
2. B / Only connections inside the island that looks smallest.
3. C / Any L cells in the same row.
4. D / Immediate land neighbors through a shared side.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "Immediate land neighbors through a shared side."
    feedback: Right. This problem uses four-directional islands.
- ❌ [eight] "Land cells touching by a side or corner."
    feedback: Diagonal touching does not merge islands. (misconception: allows-diagonals)
- ❌ [smallest] "Only connections inside the island that looks smallest."
    feedback: Every island must be measured before choosing the minimum. (misconception: assumes-smallest-up-front)
- ❌ [same-row] "Any L cells in the same row."
    feedback: Cells separated by water do not connect. (misconception: jumps-water)
"Why" shown after success: Right. This problem uses four-directional islands.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "smallest island")
Raw input shown:
```
grid = [['W','L','W'],['W','L','W'],['W','W','L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What minimum island size is returned for the shown grid?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 3
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: The smaller island is the one-cell island. (misconception: chooses-first-island)
- ❌ [wrong-2] "3"
    feedback: Do not add separate island sizes. (misconception: sums-islands)
- ❌ [wrong-3] "0"
    feedback: The problem guarantees at least one land island. (misconception: returns-water-default)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "smallest island")
Raw input shown:
```
grid=[['L']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The guaranteed land cell forms a size-1 island.
- ❌ [wrong] "0"
    feedback: That follows the exclude single land cell bug. (misconception: exclude-single-land-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The guaranteed land cell forms a size-1 island.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "smallest island")
Raw input shown:
```
grid = [['L','L'],['L','W']]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What minimum island size is returned for the shown grid?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 3
3. C / 2
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: Connected land cells form one size-3 island. (misconception: counts-cell-as-island)
- ❌ [wrong-2] "2"
    feedback: There is no separate two-cell component. (misconception: splits-component)
- ❌ [wrong-3] "0"
    feedback: Water is not an island. (misconception: chooses-water)
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
grid=[['L'],['L'],['W'],['L']]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. The bottom isolated land cell is the minimum island.; ❌ "2" — That follows the ignore last component bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(3,0)" · edges: (0,0)—(1,0)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [water]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each cell containing L.
Your choice: Water separates islands but is not part of their size.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[['L','L'],['L','W']]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. Area counts all three land cells.; ❌ "2" — That follows the count edges not cells bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(1,0), (0,0)—(0,1)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Immediate land neighbors through a shared side.
Your choice: Diagonal touching does not merge islands.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[['L','W','L']]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Water separates two size-1 islands.; ❌ "2" — That follows the bridge through water bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: The smaller island is the one-cell island.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[['L','L'],['W','L']]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. The bent side-connected cells form one island.; ❌ "1" — That follows the reset size at turn bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Connected land cells form one size-3 island.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
grid=[['L']]
```
Remedial question: **What should the function return?** · choices shown: 1 | 0
Remedial answer key: ✅ "1" — Correct. A single land cell has size 1.; ❌ "0" — That follows the exclude start cell bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Corner merger"; authored goal, NOT shown to student: "Make a tiny island touch a larger one only diagonally.")
Everything the student sees (text):
```
L
Lukas's broken search

Lukas treats corner-touching squares as direct neighbors.

Your main goal: Expose Lukas's mistake. Draw two graphs: first the correct graph, then Lukas's graph using the mistake.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
LUKAS’S OUTPUT
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
2 · Lukas's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LUKAS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(1,0)", "(1,1)"): accepted
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
LUKAS'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Split smallest island"; authored goal, NOT shown to student: "Make the final side contact change an island's size.")
Everything the student sees (text):
```
A
Alina's broken search

Alina builds every listed connection except the last one.

Your main goal: Expose Alina's mistake. Draw two graphs: first the correct graph, then Alina's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
ALINA’S OUTPUT
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
2 · Alina's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALINA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
ALINA'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Branching shoreline"; authored goal, NOT shown to student: "Shape one island so counting only its last arm is misleading.")
Everything the student sees (text):
```
J
Johnny's broken search

Johnny chooses the final listed route and never returns.

Your main goal: Expose Johnny's mistake. Draw two graphs: first the correct graph, then Johnny's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ISLAND SEED
island seed
OUTPUT
CORRECT OUTPUT
JOHNNY’S OUTPUT
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
2 · Johnny's graph
Check my graph
→
```
Start field: label "CHOOSE THE ISLAND SEED / island seed", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JOHNNY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
JOHNNY'S OUTPUT
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
grid=[['L','W','L']]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Each whole island as one node.”"
    feedback if wrong: You need the individual land cells to measure island size. Correct node rule: Each cell containing L.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
- [NO is correct] (local-degree) "(0,2) has exactly 1 direct neighbor."
    feedback if wrong: (0,2) has 0 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
You need the individual land cells to measure island size. Correct node rule: Each cell containing L.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
×
(0,2) has 0 direct neighbors.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only L cells on an island's outer border.”"
    feedback if wrong: Interior land cells count toward size too. Correct node rule: Each cell containing L.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
×
(0,0) has 0 direct neighbors.
×
Interior land cells count toward size too. Correct node rule: Each cell containing L.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
- [NO is correct] (local-degree) "(0,2) has exactly 1 direct neighbor."
    feedback if wrong: (0,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each W cell surrounding the island.”"
    feedback if wrong: Water separates islands but is not part of their size. Correct node rule: Each cell containing L.
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
Each cell containing L.
EDGES
Immediate land neighbors through a shared side.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
grid=[['L','L'],['W','L']]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (0,1), but the graph still has no direct (0,0)—(1,1) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 1 direct neighbor."
    feedback if wrong: (1,1) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only L cells on an island's outer border.”"
    feedback if wrong: Interior land cells count toward size too. Correct node rule: Each cell containing L.
Result: PASSED

### S3 Q3
Raw input shown:
```
grid=[['L']]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach itself without using an edge, but the graph still has no direct (0,0)—(0,0) edge."
    feedback if wrong: Correct. A zero-step path makes (0,0) reachable from itself; it does not invent a self-edge.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each whole island as one node.”"
    feedback if wrong: You need the individual land cells to measure island size. Correct node rule: Each cell containing L.
Result: PASSED

### S3 Q4
Raw input shown:
```
grid=[['L'],['L'],['W'],['L']]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(3,0)" · edges: (0,0)—(1,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Each W cell surrounding the island.”"
    feedback if wrong: Water separates islands but is not part of their size. Correct node rule: Each cell containing L.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,0), but there is no direct (0,0)—(1,0) edge."
    feedback if wrong: The mini-example lists (0,0)—(1,0) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
grid=[['L','L'],['L','W']]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(1,0), (0,0)—(0,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(1,0) has exactly 1 direct neighbor."
    feedback if wrong: (1,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only L cells on an island's outer border.”"
    feedback if wrong: Interior land cells count toward size too. Correct node rule: Each cell containing L.
- [YES is correct] (direct-vs-reach) "(1,0) can reach (0,1) through (0,0), but the graph still has no direct (1,0)—(0,1) edge."
    feedback if wrong: Right. A multi-step route through (0,0) creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: The largest island wins
Input shown:
```
REAL PROBLEM INPUT
grid: [["L", "L"], ["W", "L"], ["W", "W"], ["L", "W"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minimumIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function size(startRow, startColumn) {
    let count = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
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
          grid[nextRow][nextColumn] === "L" &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "L" && !visited.has(`${row},${column}`)) {
        answer = Math.max(answer, size(row, column));
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(3,0)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A An isolated land cell is skipped because its surrounding cells are water.
- B Initializing answer to zero makes the first island disappear on the shown input.
- C Math.max selects a larger component instead of the required 1-node component.
Diagnosis answer key + feedback:
- ❌ [water-node] "An isolated land cell is skipped because its surrounding cells are water." — feedback: The outer scan starts a DFS at every unseen L, including the singleton.
- ✅ [max-not-min] "Math.max selects a larger component instead of the required 1-node component." — feedback: Exactly. Component discovery is correct; the final aggregation is reversed.
- ❌ [answer-zero] "Initializing answer to zero makes the first island disappear on the shown input." — feedback: Zero works for a maximum, but the real fix is a minimum initialized to Infinity.
Graph proof shown in feedback: code rule "Every component size is compared with Math.max." → changed graph "The land graph has a 3-node component and an isolated 1-node component." → boundary "The component sizes are unequal: 3 and 1." → returned value "The code returns 3 while the smallest island size is 1."
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
About your diagnosis: The outer scan starts a DFS at every unseen L, including the singleton.
Code rule: Every component size is compared with Math.max. → Changed graph: The land graph has a 3-node component and an isolated 1-node component. → Reachable boundary: The component sizes are unequal: 3 and 1.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The largest island wins
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: Every component size is compared with Math.max. → Changed graph: The land graph has a 3-node component and an isolated 1-node component. → Reachable boundary: The component sizes are unequal: 3 and 1. → Returned value: The code returns 3 while the smallest island size is 1.
```

### S4 case 2 — `build-3` · bug: The largest island wins
Input shown:
```
REAL PROBLEM INPUT
grid=[['L','L','W'],['W','W','L']]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minimumIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function size(startRow, startColumn) {
    let count = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
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
          grid[nextRow][nextColumn] === "L" &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "L" && !visited.has(`${row},${column}`)) {
        answer = Math.max(answer, size(row, column));
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)" · edges: (0,0)—(0,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A Math.max selects a larger component instead of the required 1-node component.
- B An isolated land cell is skipped because its surrounding cells are water.
- C Initializing answer to zero makes the first island disappear on the shown input.
Diagnosis answer key + feedback:
- ❌ [water-node] "An isolated land cell is skipped because its surrounding cells are water." — feedback: The outer scan starts a DFS at every unseen L, including the singleton.
- ✅ [max-not-min] "Math.max selects a larger component instead of the required 1-node component." — feedback: Correct. The land graph has a size-2 island and a singleton; choosing the maximum returns 2 instead of the required minimum 1.
- ❌ [answer-zero] "Initializing answer to zero makes the first island disappear on the shown input." — feedback: Zero works for a maximum, but the real fix is a minimum initialized to Infinity.
Graph proof shown in feedback: code rule "Every component size is compared with Math.max." → changed graph "Land cells (0,0)—(0,1) form size 2, while (1,2) is an isolated size-1 island." → boundary "The graph contains component sizes 2 and 1, so maximum and minimum return different islands." → returned value "The shown code returns 2; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The largest island wins
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: Every component size is compared with Math.max. → Changed graph: Land cells (0,0)—(0,1) form size 2, while (1,2) is an isolated size-1 island. → Reachable boundary: The graph contains component sizes 2 and 1, so maximum and minimum return different islands. → Returned value: The shown code returns 2; the real problem returns 1.
```

### S4 case 3 — `repair-1` · bug: The largest island wins
Input shown:
```
REAL PROBLEM INPUT
grid=[['L'],['L'],['W'],['L']]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minimumIsland(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const visited = new Set();
  let answer = 0;
  function size(startRow, startColumn) {
    let count = 0;
    let stack = [[startRow, startColumn]];
    visited.add(`${startRow},${startColumn}`);
    while (stack.length) {
      const [row, column] = stack.pop();
      count++;
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
          grid[nextRow][nextColumn] === "L" &&
          !visited.has(key)
        ) {
          visited.add(key);
          stack.push([nextRow, nextColumn]);
        }
      }
    }
    return count;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "L" && !visited.has(`${row},${column}`)) {
        answer = Math.max(answer, size(row, column));
      }
    }
  }
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(3,0)" · edges: (0,0)—(1,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A An isolated land cell is skipped because its surrounding cells are water.
- B Math.max selects a larger component instead of the required 1-node component.
- C Initializing answer to zero makes the first island disappear on the shown input.
Diagnosis answer key + feedback:
- ❌ [water-node] "An isolated land cell is skipped because its surrounding cells are water." — feedback: The outer scan starts a DFS at every unseen L, including the singleton.
- ✅ [max-not-min] "Math.max selects a larger component instead of the required 1-node component." — feedback: Correct. Cells (0,0) and (1,0) form size 2, while (3,0) is a singleton; Math.max selects the wrong component.
- ❌ [answer-zero] "Initializing answer to zero makes the first island disappear on the shown input." — feedback: Zero works for a maximum, but the real fix is a minimum initialized to Infinity.
Graph proof shown in feedback: code rule "Every component size is compared with Math.max." → changed graph "Land cells (0,0)—(1,0) form size 2, while (3,0) is an isolated size-1 island." → boundary "The vertical pair at rows 0–1 has size 2 while land at row 3 is an isolated size-1 island." → returned value "The shown code returns 2; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The largest island wins
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: Every component size is compared with Math.max. → Changed graph: Land cells (0,0)—(1,0) form size 2, while (3,0) is an isolated size-1 island. → Reachable boundary: The vertical pair at rows 0–1 has size 2 while land at row 3 is an isolated size-1 island. → Returned value: The shown code returns 2; the real problem returns 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```