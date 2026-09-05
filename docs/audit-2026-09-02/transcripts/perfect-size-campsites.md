# Perfect-Size Campsites (`perfect-size-campsites`) — variant, grid

## Problem statement (Description tab)

A national park gives you a map as a grid. `park[r][c]` is `1` if that square is open grass and `0` if it is forest (you cannot camp in forest).

A **campsite** is a group of grass squares that are connected **up, down, left, or right** (diagonal squares are NOT connected). Every grass square belongs to exactly one campsite.

A scout troop needs a campsite made of **exactly `k` grass squares** — no more, no less — so their tents fit snugly.

Write a function `countPerfectCampsites(park, k)` that returns how many campsites have exactly `k` squares.

### Examples
- Example 1: input `park = [[1,1,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]], k = 2` → output `2`. There are three campsites: {(0,0),(0,1),(1,1)} with 3 squares, {(0,3),(1,3)} with 2 squares, and {(3,0),(3,1)} with 2 squares. Exactly two of them have size 2.
- Example 2: input `park = [[1,0,1],[0,0,0],[1,1,1]], k = 1` → output `2`. The campsites are {(0,0)} (size 1), {(0,2)} (size 1), and the bottom row {(2,0),(2,1),(2,2)} (size 3). Two campsites have exactly 1 square.

### Graph rules (authored)
- Nodes: Each grass cell marked `1`; non-grass `0` cells are not nodes.
- Edges: Grass cells that share a side: up, down, left, or right.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`two-perfect`, facet "exact-size component count")
Raw input shown:
```
park=[[1,1,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]], k=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many campsites have exactly k cells?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The component sizes are 3,2,2; two match k=2.
- ❌ [bug] "3"
    feedback: This counts every grass component and ignores whether its size equals k. (misconception: ignore-target-size)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(0,3)", "(1,3)", "(3,0)", "(3,1)" · edges: (0,0)—(0,1), (0,1)—(1,1), (0,3)—(1,3), (3,0)—(3,1)
"Why" shown after success: The component sizes are 3,2,2; two match k=2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`diagonal-separate`, facet "four-way grass edges")
Raw input shown:
```
park=[[1,0],[0,1]], k=1
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many campsites have exactly k cells?**
Choices as displayed (top to bottom):
1. 2
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The two diagonal grass cells are separate one-cell campsites.
- ❌ [bug] "0"
    feedback: This joins the diagonal cells into one size-2 component, so neither seems to match k=1. (misconception: connect-diagonal-cells)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: The two diagonal grass cells are separate one-cell campsites.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact grass cells")
Raw input shown:
```
park=[[1,1,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]], k=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (1,1) / (0,3) / (1,3) / (3,0) / (3,1)
2. Picture A / (0,0) / (0,1) / (1,1) / (0,3) / (1,3) / (3,0) / (3,1)
3. Picture C / (0,0) / (0,1) / (1,1) / (0,3) / (1,3) / (3,0) / (3,1)
4. Picture D / (0,0) / (0,1) / (1,1) / (0,3) / (1,3) / (3,0)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,1), (0,3), (1,3), (3,0), (3,1) · edges: (0,0)—(0,1), (0,1)—(1,1), (0,3)—(1,3), (3,0)—(3,1)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,1), (0,3), (1,3), (3,0), (3,1) · edges: (0,0)—(0,1), (0,1)—(1,1), (0,3)—(1,3)
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,1), (1,1), (0,3), (1,3), (3,0), (3,1) · edges: (0,0)→(0,1), (0,1)→(1,1), (0,3)→(1,3), (3,0)→(3,1)
    feedback: This turns two-way relations into one-way arrows. (misconception: make-undirected-edges-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,1), (0,3), (1,3), (3,0) · edges: (0,0)—(0,1), (0,1)—(1,1), (0,3)—(1,3)
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`one-too-large`, facet "exact grass cells")
Raw input shown:
```
park=[[1,1],[1,0]], k=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many campsites have exactly k cells?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The only component has size 3, not exactly 2.
- ❌ [bug] "1"
    feedback: This accepts a component whose size 3 is at least k instead of exactly k. (misconception: use-at-least-k)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(0,1), (0,0)—(1,0)
"Why" shown after success: The only component has size 3, not exactly 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-nodes`, facet "cell identity")
Raw input shown:
```
park=[[1,0],[0,1]], k=1
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node in the park's grass graph?**
Picture under review: UNDIRECTED · nodes: (0,0), (1,1) · edges: none
Choices as displayed (top to bottom):
1. A / Only grass cells that eventually belong to a component of size k.
2. B / One node for each completed patch of grass.
3. C / Every park cell, with zeros usable to cross between grass patches.
4. D / Each grass cell marked 1; non-grass 0 cells are not nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [grass-cells] "Each grass cell marked `1`; non-grass `0` cells are not nodes."
    feedback: Correct. A campsite's size is the number of connected grass-cell nodes.
- ❌ [size-k-only] "Only grass cells that eventually belong to a component of size k."
    feedback: Component size is unknown until DFS explores its cells, so they cannot be filtered first. (misconception: pre-filter-size)
- ❌ [whole-campsites] "One node for each completed patch of grass."
    feedback: Those patches are connected components formed from individual grass nodes. (misconception: component-as-node)
- ❌ [all-cells] "Every park cell, with zeros usable to cross between grass patches."
    feedback: Zeros separate campsites. Making them nodes would merge distinct patches. (misconception: zero-passable)
"Why" shown after success: Correct. A campsite's size is the number of connected grass-cell nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`single-grass`, facet "cell identity")
Raw input shown:
```
park=[[1]], k=1
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many campsites have exactly k cells?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The lone grass cell is one size-1 campsite.
- ❌ [bug] "0"
    feedback: This drops a grass cell that has no grass neighbor. (misconception: drop-isolated-grass-cell)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The lone grass cell is one size-1 campsite.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-relations`, facet "four-way grass edges")
Raw input shown:
```
park=[[1,1],[1,0]], k=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which grass cells share a direct edge?**
Picture under review: UNDIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)—(0,1), (0,0)—(1,0)
Choices as displayed (top to bottom):
1. A / Grass cells that share a side: up, down, left, or right.
2. B / Grass cells touching by a side or a diagonal corner.
3. C / Any two grass cells at most k steps apart.
4. D / All grass cells in one row, even across zero cells.
Answer key + feedback per choice (data):
- ✅ CORRECT [four-way] "Grass cells that share a side: up, down, left, or right."
    feedback: Correct. DFS counts each side-connected grass component.
- ❌ [eight-way] "Grass cells touching by a side or a diagonal corner."
    feedback: Diagonal contact does not join campsites here. (misconception: allow-diagonal)
- ❌ [within-k] "Any two grass cells at most k steps apart."
    feedback: k describes the desired component size, not an edge distance. (misconception: k-as-distance)
- ❌ [same-row] "All grass cells in one row, even across zero cells."
    feedback: Only immediate side neighbors connect; zero gaps break a campsite. (misconception: bridge-zero-gap)
"Why" shown after success: Correct. DFS counts each side-connected grass component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "exact-size component count")
Raw input shown:
```
park = [[1,1,0,1,1],[0,1,0,0,1],[0,0,0,0,0],[1,0,0,1,1]], k = 3
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many side-connected grass components have exactly k cells?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 2
3. C / 9
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. Exactly the two size-3 components match k.
- ❌ [three] "`3`"
    feedback: That confuses target size 3 with the number of qualifying campsites. (misconception: return-k)
- ❌ [nine] "`9`"
    feedback: The answer counts matching campsites, not all grass squares. (misconception: count-cells)
- ❌ [four] "`4`"
    feedback: The size-1 and size-2 campsites do not match k. (misconception: count-all-components)
"Why" shown after success: Correct. Exactly the two size-3 components match k.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-bug`, facet "exact-size component count")
Raw input shown:
```
park = [[1,0,1],[1,0,1],[0,0,0],[1,1,0]], k = 2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many side-connected grass components have exactly k cells?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 6
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "`3`"
    feedback: Correct. All three components have exactly two squares.
- ❌ [two] "`2`"
    feedback: That returns the target size rather than how many campsites match it. (misconception: return-k)
- ❌ [six] "`6`"
    feedback: That counts qualifying grass cells, not qualifying campsites. (misconception: sum-matching-area)
- ❌ [one] "`1`"
    feedback: A tie does not reduce three separate matching campsites to one. (misconception: unique-size-only)
"Why" shown after success: Correct. All three components have exactly two squares.
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
Your choice: This drops one direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every input detail"
Remedial raw input:
```
park=[[1,1,0],[0,0,0],[1,0,1]], k=1
```
Remedial question: **How many campsites have exactly k cells?** · choices shown: 3 | 2
Remedial answer key: ✅ "2" — Correct. Only the two bottom one-cell patches match k=1.; ❌ "3" — This includes the top size-2 component along with the two singletons.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(2,0)", "(2,2)" · edges: (0,0)—(0,1)
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [size-k-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each grass cell marked 1; non-grass 0 cells are not nodes.
Your choice: Component size is unknown until DFS explores its cells, so they cannot be filtered first.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
park=[[1,1],[1,1]], k=4
```
Remedial question: **How many grass nodes are in the matching campsite?** · choices shown: 1 | 4
Remedial answer key: ✅ "4" — Correct. Each grass position is a node; all four form one component.; ❌ "1" — This treats the whole campsite as one node instead of four cell nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [eight-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Grass cells that share a side: up, down, left, or right.
Your choice: Diagonal contact does not join campsites here.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
park=[[1],[1],[1]], k=3
```
Remedial question: **How many campsites match k?** · choices shown: 3 | 1
Remedial answer key: ✅ "1" — Correct. Vertical side edges join all three cells into one size-3 campsite.; ❌ "3" — This checks horizontal neighbors only and splits the vertical run into three singletons.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: That confuses target size 3 with the number of qualifying campsites.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
park=[[1,1,0,1,1]], k=2
```
Remedial question: **How many campsites match k?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. There are two separate size-2 components.; ❌ "4" — This returns the number of grass cells inside matching campsites instead of the number of campsites.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,3)", "(0,4)" · edges: (0,0)—(0,1), (0,3)—(0,4)
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: That returns the target size rather than how many campsites match it.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
park=[[1,0,1,0,1]], k=1
```
Remedial question: **How many campsites match k?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. All three isolated grass cells are matching size-1 campsites.; ❌ "1" — This returns as soon as the first matching campsite is found.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(0,4)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Corner-touching campsites"; authored goal, NOT shown to student: "Make two separate grass groups touch only at a corner.")
Everything the student sees (text):
```
M
Miley's broken search

Miley treats corner-touching squares as direct neighbors.

Your main goal: Expose Miley's mistake. Draw two graphs: first the correct graph, then Miley's graph using the mistake.

CHOOSE THE FIRST GRASS SQUARE
first grass square
OUTPUT
CORRECT OUTPUT
MILEY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first grass square
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
2 · Miley's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GRASS SQUARE / first grass square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MILEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,1)", "(0,3)", "(1,3)", "(3,0)", "(3,1)"): accepted
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
MILEY'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Other campsite first"; authored goal, NOT shown to student: "Include differently sized campsites so the chosen starting square matters.")
Everything the student sees (text):
```
P
Patrick's broken search

Patrick ignores the chosen first grass square and uses a different one.

Your main goal: Expose Patrick's mistake. Draw two graphs: first the correct graph, then Patrick's graph using the mistake.

CHOOSE THE FIRST GRASS SQUARE
first grass square
OUTPUT
CORRECT OUTPUT
PATRICK’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first grass square
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
2 · Patrick's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GRASS SQUARE / first grass square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | PATRICK’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
PATRICK'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Forked patch"; authored goal, NOT shown to student: "Build one grass patch with multiple side branches that all count toward its size.")
Everything the student sees (text):
```
K
Katie's broken search

Katie chooses the final listed route and never returns.

Your main goal: Expose Katie's mistake. Draw two graphs: first the correct graph, then Katie's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST GRASS SQUARE
first grass square
OUTPUT
CORRECT OUTPUT
KATIE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first grass square
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
2 · Katie's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GRASS SQUARE / first grass square", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KATIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(1,0)\",\"(2,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(1,0)","(2,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
KATIE'S OUTPUT
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
park=[[1,1,0],[0,0,0],[1,0,1]], k=1
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(2,0)", "(2,2)" · edges: (0,0)—(0,1)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each completed patch of grass.”"
    feedback if wrong: Those patches are connected components formed from individual grass nodes. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,0) has 1 direct neighbor.
×
Those patches are connected components formed from individual grass nodes. Correct node rule: Each grass cell marked
1
; non-grass
0
cells are not nodes.
×
Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "(2,2) has exactly 1 direct neighbor."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Every park cell, with zeros usable to cross between grass patches.”"
    feedback if wrong: Zeros separate campsites. Making them nodes would merge distinct patches. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)—(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(2,2) has 0 direct neighbors.
×
Zeros separate campsites. Making them nodes would merge distinct patches. Correct node rule: Each grass cell marked
1
; non-grass
0
cells are not nodes.
×
The mini-example lists (0,0)—(0,1) as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) and (0,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)—(0,1) as one direct edge.
- [YES is correct] (local-degree) "(2,0) has exactly 0 direct neighbors."
    feedback if wrong: (2,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only grass cells that eventually belong to a component of size k.”"
    feedback if wrong: Component size is unknown until DFS explores its cells, so they cannot be filtered first. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
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
Each grass cell marked 1; non-grass 0 cells are not nodes.
EDGES
Grass cells that share a side: up, down, left, or right.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
park=[[1,1],[1,1]], k=4
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every park cell, with zeros usable to cross between grass patches.”"
    feedback if wrong: Zeros separate campsites. Making them nodes would merge distinct patches. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(1,1) can reach (0,0) through (1,0), but the graph still has no direct (1,1)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 2 direct neighbors."
    feedback if wrong: (1,1) has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
park=[[1],[1],[1]], k=3
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)—(1,0), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(1,0) and (1,0)—(2,0), so it should also contain a direct (0,0)—(2,0) edge."
    feedback if wrong: Two direct edges through (1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,0) has exactly 3 direct neighbors."
    feedback if wrong: (1,0) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each completed patch of grass.”"
    feedback if wrong: Those patches are connected components formed from individual grass nodes. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
Result: PASSED

### S3 Q4
Raw input shown:
```
park=[[1,1,0,1,1]], k=2
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,3)", "(0,4)" · edges: (0,0)—(0,1), (0,3)—(0,4)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,3) can reach (0,4), but there is no direct (0,3)—(0,4) edge."
    feedback if wrong: The mini-example lists (0,3)—(0,4) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(0,1) has exactly 0 direct neighbors."
    feedback if wrong: (0,1) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only grass cells that eventually belong to a component of size k.”"
    feedback if wrong: Component size is unknown until DFS explores its cells, so they cannot be filtered first. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
Result: PASSED

### S3 Q5
Raw input shown:
```
park=[[1,0,1,0,1]], k=1
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(0,4)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,4) has exactly 0 direct neighbors."
    feedback if wrong: (0,4) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every park cell, with zeros usable to cross between grass patches.”"
    feedback if wrong: Zeros separate campsites. Making them nodes would merge distinct patches. Correct node rule: Each grass cell marked `1`; non-grass `0` cells are not nodes.
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

### S4 case 1 — `authored-deep-case` · bug: Merges diagonal grass patches
Input shown:
```
REAL PROBLEM INPUT
park: [[1, 0], [0, 1]]
k: 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const park = input.park;
  const visited = new Set();
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    return row >= 0 && row < park.length && column >= 0 && column < park[0].length;
  }

  function findCampsiteArea(row, column) {
    if (!isInBounds(row, column)) return 0;
    const currentPosition = positionKey(row, column);
    if (park[row][column] !== 1 || visited.has(currentPosition)) return 0;
    visited.add(currentPosition);

    let campsiteArea = 1;
    for (const [rowChange, columnChange] of directions) {
      campsiteArea += findCampsiteArea(row + rowChange, column + columnChange);
    }
    return campsiteArea;
  }

  let numberOfPerfectCampsites = 0;
  for (let row = 0; row < park.length; row++) {
    for (let column = 0; column < park[0].length; column++) {
      if (findCampsiteArea(row, column) === input.k) numberOfPerfectCampsites++;
    }
  }
  return numberOfPerfectCampsites;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of size-k campsites" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A Eight-direction recursion joins the two corner-touching grass cells into one size-2 patch.
- B The area function counts forest cells as campsite area, changing this input's returned value.
- C The scan counts already-seen cells as new size-0 campsites, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [adds-diagonals] "Eight-direction recursion joins the two corner-touching grass cells into one size-2 patch." — feedback: Correct. Side-only adjacency makes two separate size-1 campsites.
- ❌ [counts-forest] "The area function counts forest cells as campsite area, changing this input's returned value." — feedback: It returns 0 for every cell not equal to 1.
- ❌ [counts-seen-zero] "The scan counts already-seen cells as new size-0 campsites, changing this input's returned value." — feedback: Only area equal to k=1 increments the result.
Graph proof shown in feedback: code rule "Diagonal moves add one edge between the two nodes." → changed graph "The two grass nodes have no side edge, so each is a singleton component." → boundary "Both real components have target size 1, but the invented merged component has size 2." → returned value "The code finds zero perfect campsites instead of two."
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
About your diagnosis: It returns 0 for every cell not equal to 1.
Code rule: Diagonal moves add one edge between the two nodes. → Changed graph: The two grass nodes have no side edge, so each is a singleton component. → Reachable boundary: Both real components have target size 1, but the invented merged component has size 2.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Merges diagonal grass patches
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: Diagonal moves add one edge between the two nodes. → Changed graph: The two grass nodes have no side edge, so each is a singleton component. → Reachable boundary: Both real components have target size 1, but the invented merged component has size 2. → Returned value: The code finds zero perfect campsites instead of two.
```

### S4 case 2 — `five-diagonal-singletons` · bug: Merges diagonal grass patches
Input shown:
```
REAL PROBLEM INPUT
park: [[1, 0, 1], [0, 1, 0], [1, 0, 1]]
k: 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const park = input.park;
  const visited = new Set();
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    return row >= 0 && row < park.length && column >= 0 && column < park[0].length;
  }

  function findCampsiteArea(row, column) {
    if (!isInBounds(row, column)) return 0;
    const currentPosition = positionKey(row, column);
    if (park[row][column] !== 1 || visited.has(currentPosition)) return 0;
    visited.add(currentPosition);

    let campsiteArea = 1;
    for (const [rowChange, columnChange] of directions) {
      campsiteArea += findCampsiteArea(row + rowChange, column + columnChange);
    }
    return campsiteArea;
  }

  let numberOfPerfectCampsites = 0;
  for (let row = 0; row < park.length; row++) {
    for (let column = 0; column < park[0].length; column++) {
      if (findCampsiteArea(row, column) === input.k) numberOfPerfectCampsites++;
    }
  }
  return numberOfPerfectCampsites;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(1,1)", "(2,0)", "(2,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of size-k campsites" · expected buggy output `0` · real correct output `5`
Diagnosis choices as displayed:
- A The area helper counts the four forest cells as grass.
- B Diagonal moves merge five real singleton campsites into one size-5 component.
- C Already-seen grass cells are counted again as size-1 campsites.
Diagnosis answer key + feedback:
- ✅ [adds-diagonals] "Diagonal moves merge five real singleton campsites into one size-5 component." — feedback: Correct. With side-only edges, all five grass cells are separate size-1 campsites.
- ❌ [counts-forest] "The area helper counts the four forest cells as grass." — feedback: Forest cells return 0; invented diagonal edges merge the grass cells.
- ❌ [counts-seen-zero] "Already-seen grass cells are counted again as size-1 campsites." — feedback: A seen cell returns 0, which cannot equal k=1.
Graph proof shown in feedback: code rule "Eight-direction recursion adds diagonal edges through the center node." → changed graph "All five grass nodes are isolated under side-only adjacency." → boundary "Five target-size singleton components become one non-target size-5 component." → returned value "The code returns 0 instead of 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Merges diagonal grass patches
INCORRECT OUTPUT
0
CORRECT OUTPUT
5
Code rule: Eight-direction recursion adds diagonal edges through the center node. → Changed graph: All five grass nodes are isolated under side-only adjacency. → Reachable boundary: Five target-size singleton components become one non-target size-5 component. → Returned value: The code returns 0 instead of 5.
```

### S4 case 3 — `two-size-two-patches-touch-diagonally` · bug: Merges diagonal grass patches
Input shown:
```
REAL PROBLEM INPUT
park: [[1, 1, 0], [0, 0, 1], [0, 0, 1]]
k: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const park = input.park;
  const visited = new Set();
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    return row >= 0 && row < park.length && column >= 0 && column < park[0].length;
  }

  function findCampsiteArea(row, column) {
    if (!isInBounds(row, column)) return 0;
    const currentPosition = positionKey(row, column);
    if (park[row][column] !== 1 || visited.has(currentPosition)) return 0;
    visited.add(currentPosition);

    let campsiteArea = 1;
    for (const [rowChange, columnChange] of directions) {
      campsiteArea += findCampsiteArea(row + rowChange, column + columnChange);
    }
    return campsiteArea;
  }

  let numberOfPerfectCampsites = 0;
  for (let row = 0; row < park.length; row++) {
    for (let column = 0; column < park[0].length; column++) {
      if (findCampsiteArea(row, column) === input.k) numberOfPerfectCampsites++;
    }
  }
  return numberOfPerfectCampsites;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)", "(2,2)" · edges: (0,0)—(0,1), (1,2)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of size-k campsites" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A A forest cell between the two patches is counted as grass and joins them.
- B The second campsite is skipped only because its cells were marked seen before any connection existed.
- C The diagonal move from (0,1) to (1,2) merges two size-2 campsites into one size-4 patch.
Diagnosis answer key + feedback:
- ✅ [adds-diagonals] "The diagonal move from (0,1) to (1,2) merges two size-2 campsites into one size-4 patch." — feedback: Correct. Without that invented edge, both real components have the requested size 2.
- ❌ [counts-forest] "A forest cell between the two patches is counted as grass and joins them." — feedback: Forest cells return 0; the direct diagonal move joins the patches.
- ❌ [counts-seen-zero] "The second campsite is skipped only because its cells were marked seen before any connection existed." — feedback: They are marked seen through the invented diagonal connection, not before it.
Graph proof shown in feedback: code rule "Eight-direction recursion adds edge (0,1)—(1,2)." → changed graph "Edges (0,0)—(0,1) and (1,2)—(2,2) form two separate size-2 components." → boundary "Two target-size components touch only at a corner." → returned value "The code sees one size-4 component and returns 0; the correct count is 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Merges diagonal grass patches
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: Eight-direction recursion adds edge (0,1)—(1,2). → Changed graph: Edges (0,0)—(0,1) and (1,2)—(2,2) form two separate size-2 components. → Reachable boundary: Two target-size components touch only at a corner. → Returned value: The code sees one size-4 component and returns 0; the correct count is 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```