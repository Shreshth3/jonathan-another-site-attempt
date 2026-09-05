# Counting Constellations (`counting-constellations`) — variant, grid

## Problem statement (Description tab)

You are studying a photo of the night sky, stored as a grid of numbers. `sky[r][c]` is `1` if there is a star at that spot and `0` if that spot is empty.

Astronomers in your club draw lines between stars that are **next to each other in any of the 8 directions**: up, down, left, right, or any of the 4 diagonals. A **constellation** is a group of stars where you can travel from any star to any other star by repeatedly stepping to a neighboring star (using those 8 directions). A single star with no neighbors is its own constellation.

Write a function `countConstellations(sky)` that returns the number of constellations in the photo.

### Examples
- Example 1: input `sky = [[1,0,0,1],[0,1,0,0],[0,0,0,0],[1,0,0,1]]` → output `4`. The stars at (0,0) and (1,1) touch diagonally, so they form ONE constellation together. The stars at (0,3), (3,0), and (3,3) each have no neighbors at all, so each is its own constellation. Total: 4.
- Example 2: input `sky = [[1,1,0],[0,0,1],[0,0,0]]` → output `1`. (0,0) and (0,1) are side by side. (0,1) and (1,2) touch diagonally. So all three stars are one single constellation.

### Graph rules (authored)
- Nodes: Every cell containing `1`; empty `0` cells are not nodes.
- Edges: When their cells touch by a side or a corner: any of 8 directions.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact star cells")
Raw input shown:
```
sky=[[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many constellations are in this sky?**
Choices as displayed (top to bottom):
1. 1
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Side-or-corner touching joins the stars into 1 constellation.
- ❌ [bug] "3"
    feedback: This uses the four-direction island rule and misses diagonal star connections. (misconception: omit-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: (0,0)—(1,1), (1,1)—(2,2)
"Why" shown after success: Side-or-corner touching joins the stars into 1 constellation.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "cell identity")
Raw input shown:
```
sky=[[1,1,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many constellations are in this sky?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Side-or-corner touching joins the stars into 1 constellation.
- ❌ [bug] "2"
    feedback: This uses the four-direction island rule and misses diagonal star connections. (misconception: omit-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(2,2)" · edges: (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (1,1)—(2,2)
"Why" shown after success: Side-or-corner touching joins the stars into 1 constellation.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact star cells")
Raw input shown:
```
sky=[[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (1,1) / (2,2)
2. Picture B / (0,0) / (1,1) / (2,2)
3. Picture C / (0,0) / (1,1) / (2,2)
4. Picture D / (0,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (1,1), (2,2) · edges: (0,0)—(1,1), (1,1)—(2,2)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (1,1), (2,2) · edges: (0,0)—(1,1)
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (1,1), (2,2) · edges: (0,0)→(1,1), (1,1)→(2,2)
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0), (1,1) · edges: (0,0)—(1,1)
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-3`, facet "eight-way touching")
Raw input shown:
```
sky=[[1,0,1],[0,0,0],[1,1,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many constellations are in this sky?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Side-or-corner touching joins the stars into 3 constellations.
- ❌ [bug] "4"
    feedback: This counts individual star cells instead of connected constellations. (misconception: count-star-cells)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(2,0)", "(2,1)" · edges: (2,0)—(2,1)
"Why" shown after success: Side-or-corner touching joins the stars into 3 constellations.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-node`, facet "cell identity")
Raw input shown:
```
sky=[[1,0,1],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which cells should become nodes when drawing the star graph?**
Choices as displayed (top to bottom):
1. A / Every grid cell, with 0 cells acting as passable space between stars.
2. B / Only star cells in rows containing at least two stars.
3. C / One node for each finished constellation.
4. D / Every cell containing 1; empty 0 cells are not nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [stars] "Every cell containing `1`; empty `0` cells are not nodes."
    feedback: Correct. A constellation is a connected group of star cells.
- ❌ [all-cells] "Every grid cell, with `0` cells acting as passable space between stars."
    feedback: Empty cells cannot carry a connection. Making them nodes would join stars across empty space. (misconception: empty-passable)
- ❌ [brightest-row] "Only star cells in rows containing at least two stars."
    feedback: A single isolated star is still a one-node constellation. (misconception: omit-isolated)
- ❌ [constellations] "One node for each finished constellation."
    feedback: Constellations are the connected components we must discover, not the starting nodes. (misconception: component-as-node)
"Why" shown after success: Correct. A constellation is a connected group of star cells.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-4`, facet "constellation count")
Raw input shown:
```
sky=[[1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many constellations are in this sky?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Side-or-corner touching joins the stars into 1 constellation.
- ❌ [bug] "0"
    feedback: This drops an isolated star because it has no neighboring star. (misconception: omit-isolated-star)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: Side-or-corner touching joins the stars into 1 constellation.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-edge`, facet "eight-way touching")
Raw input shown:
```
sky=[[1,0,1],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Exactly when do two star nodes share an edge?**
Choices as displayed (top to bottom):
1. A / Only when they share a side; diagonal stars stay separate.
2. B / When their cells touch by a side or a corner: any of 8 directions.
3. C / Any two stars lying somewhere on the same diagonal line.
4. D / Any two stars in the same row or column, even with zeros between them.
Answer key + feedback per choice (data):
- ✅ CORRECT [eight-way] "When their cells touch by a side or a corner: any of 8 directions."
    feedback: Correct. Diagonal corner contact joins stars in this problem.
- ❌ [four-way] "Only when they share a side; diagonal stars stay separate."
    feedback: That is the common island rule, but constellations also connect diagonally. (misconception: omit-diagonals)
- ❌ [same-diagonal] "Any two stars lying somewhere on the same diagonal line."
    feedback: They must be immediate neighboring cells. Empty gaps do not create an edge. (misconception: long-range-diagonal)
- ❌ [same-row-column] "Any two stars in the same row or column, even with zeros between them."
    feedback: Only touching cells connect; a row or column does not bridge empty space. (misconception: line-of-sight)
"Why" shown after success: Correct. Diagonal corner contact joins stars in this problem.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "constellation count")
Raw input shown:
```
sky=[[1,0,0,0,1],[0,1,0,0,0],[0,0,0,1,0],[0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **With diagonal touching allowed, how many constellations are in this sky?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 5
3. C / 2
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct: the top-left pair and bottom-right pair are two groups, and the top-right star is alone.
- ❌ [five] "5"
    feedback: This counts stars instead of connected star groups. (misconception: count-cells)
- ❌ [two] "2"
    feedback: This finds the two diagonal pairs but drops the isolated top-right star. (misconception: drop-isolated-component)
- ❌ [one] "1"
    feedback: This merges separate diagonal pairs even though no chain joins them. (misconception: merge-disconnected-groups)
"Why" shown after success: Correct: the top-left pair and bottom-right pair are two groups, and the top-right star is alone.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "constellation count")
Raw input shown:
```
sky=[[0,1,0],[1,0,1],[0,1,0]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many constellations are in the diamond-shaped sky?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 4
3. C / 2
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1"
    feedback: Correct: all four stars connect through diagonal steps.
- ❌ [four] "4"
    feedback: This checks side neighbors only and misses every diagonal connection. (misconception: side-only-search)
- ❌ [two] "2"
    feedback: This pairs diagonals but fails to continue through already connected stars. (misconception: pair-without-transitive-search)
- ❌ [three] "3"
    feedback: This explores from one top star only one diagonal direction, then starts two extra searches. (misconception: skip-one-diagonal-direction)
"Why" shown after success: Correct: all four stars connect through diagonal steps.
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
sky=[[1,1,1]]
```
Remedial question: **How many constellations are in this sky?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. Side-or-corner touching joins the stars into 1 constellation.; ❌ "3" — This counts individual star cells instead of connected constellations.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [all-cells]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every cell containing 1; empty 0 cells are not nodes.
Your choice: Empty cells cannot carry a connection. Making them nodes would join stars across empty space.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
sky=[[1,0],[0,1]]
```
Remedial question: **How many constellations are in this sky?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. Side-or-corner touching joins the stars into 1 constellation.; ❌ "2" — This uses the four-direction island rule and misses diagonal star connections.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: (0,0)—(1,1)
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [four-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
When their cells touch by a side or a corner: any of 8 directions.
Your choice: That is the common island rule, but constellations also connect diagonally.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
sky=[[1,0,0],[1,0,0],[1,1,1]]
```
Remedial question: **How many constellations are in this sky?** · choices shown: 1 | 5
Remedial answer key: ✅ "1" — Correct. Side-or-corner touching joins the stars into 1 constellation.; ❌ "5" — This counts individual star cells instead of connected constellations.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)", "(2,1)", "(2,2)" · edges: (0,0)—(1,0), (1,0)—(2,0), (1,0)—(2,1), (2,0)—(2,1), (2,1)—(2,2)
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [five]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This counts stars instead of connected star groups.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
sky=[[0,1,0],[1,1,1],[0,1,0]]
```
Remedial question: **How many constellations are in this sky?** · choices shown: 5 | 1
Remedial answer key: ✅ "1" — Correct. Side-or-corner touching joins the stars into 1 constellation.; ❌ "5" — This counts individual star cells instead of connected constellations.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,0)", "(1,1)", "(1,2)", "(2,1)" · edges: (0,1)—(1,1), (0,1)—(1,2), (0,1)—(1,0), (1,0)—(1,1), (1,0)—(2,1), (1,1)—(2,1), (1,1)—(1,2), (1,2)—(2,1)
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: This checks side neighbors only and misses every diagonal connection.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
sky=[[1,0,0],[0,0,0],[0,0,1]]
```
Remedial question: **How many constellations are in this sky?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. Side-or-corner touching joins the stars into 2 constellations.; ❌ "1" — This joins the two stars merely because they lie on the same long diagonal, even though they do not touch.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `remove-diagonals` (authored level "Corner-touching stars"; authored goal, NOT shown to student: "Use two stars whose only legal connection is diagonal.")
Everything the student sees (text):
```
V
Vanessa's broken search

Vanessa keeps only side moves and loses corner neighbors.

Your main goal: Expose Vanessa's mistake. Draw two graphs: first the correct graph, then Vanessa's graph using the mistake.

CHOOSE THE FIRST STAR
first star
OUTPUT
CORRECT OUTPUT
VANESSA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first star
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
2 · Vanessa's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STAR / first star", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | VANESSA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(1,1)", "(2,2)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(1,1)\"]","buggy":"[\"(0,0)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (1,1) · edges (in drawing order) (0,0)—(1,1) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(1,1)"]` · character's output `["(0,0)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (1,1) · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0), (1,1)`; ❌ curly braces → `{(0,0),(1,1)}`; ✅ quoted numbers/strings → `["(0,0)","(1,1)"]`; ❌ reversed order → `["(1,1)","(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" , "(1,1)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0),(1,1)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(1,1)"]
VANESSA'S OUTPUT
["(0,0)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "Forked constellation"; authored goal, NOT shown to student: "Make one star touch two branches so stopping after the first loses stars.")
Everything the student sees (text):
```
H
Hayden's broken search

Hayden chooses the first route and forgets the other branches.

Your main goal: Expose Hayden's mistake. Draw two graphs: first the correct graph, then Hayden's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST STAR
first star
OUTPUT
CORRECT OUTPUT
HAYDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first star
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
2 · Hayden's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STAR / first star", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | HAYDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
HAYDEN'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong star chosen"; authored goal, NOT shown to student: "Separate two star groups so the selected starting star matters.")
Everything the student sees (text):
```
A
Aaliyah's broken search

Aaliyah ignores the chosen first star and uses a different one.

Your main goal: Expose Aaliyah's mistake. Draw two graphs: first the correct graph, then Aaliyah's graph using the mistake.

CHOOSE THE FIRST STAR
first star
OUTPUT
CORRECT OUTPUT
AALIYAH’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first star
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
2 · Aaliyah's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STAR / first star", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AALIYAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
AALIYAH'S OUTPUT
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
sky=[[0,1,0],[1,1,1],[0,1,0]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,0)", "(1,1)", "(1,2)", "(2,1)" · edges: (0,1)—(1,1), (0,1)—(1,2), (0,1)—(1,0), (1,0)—(1,1), (1,0)—(2,1), (1,1)—(2,1), (1,1)—(1,2), (1,2)—(2,1)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has (1,0)—(1,1) and (1,1)—(1,2), so it should also contain a direct (1,0)—(1,2) edge."
    feedback if wrong: Two direct edges through (1,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,2) has exactly 4 direct neighbors."
    feedback if wrong: (1,2) has 3 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only star cells in rows containing at least two stars.”"
    feedback if wrong: A single isolated star is still a one-node constellation. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through (1,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
(1,2) has 3 direct neighbors.
×
A single isolated star is still a one-node constellation. Correct node rule: Every cell containing
1
; empty
0
cells are not nodes.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each finished constellation.”"
    feedback if wrong: Constellations are the connected components we must discover, not the starting nodes. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has (2,1)—(1,2) and (1,2)—(0,1), so it should also contain a direct (2,1)—(0,1) edge."
    feedback if wrong: Two direct edges through (1,2) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,1) has exactly 3 direct neighbors."
    feedback if wrong: (1,1) has 4 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Constellations are the connected components we must discover, not the starting nodes. Correct node rule: Every cell containing
1
; empty
0
cells are not nodes.
×
Two direct edges through (1,2) do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
(1,1) has 4 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every grid cell, with `0` cells acting as passable space between stars.”"
    feedback if wrong: Empty cells cannot carry a connection. Making them nodes would join stars across empty space. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(1,2) can reach (1,0) through (0,1), but the graph still has no direct (1,2)—(1,0) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,0) has exactly 3 direct neighbors."
    feedback if wrong: (1,0) has 3 direct neighbors.
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
Every cell containing 1; empty 0 cells are not nodes.
EDGES
When their cells touch by a side or a corner: any of 8 directions.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
sky=[[1,0,0],[0,0,0],[0,0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (2,2); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(2,2) has exactly 0 direct neighbors."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each finished constellation.”"
    feedback if wrong: Constellations are the connected components we must discover, not the starting nodes. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
Result: PASSED

### S3 Q3
Raw input shown:
```
sky=[[1,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,1) has exactly 3 direct neighbors."
    feedback if wrong: (0,1) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only star cells in rows containing at least two stars.”"
    feedback if wrong: A single isolated star is still a one-node constellation. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)—(0,1) and (0,1)—(0,2), so it should also contain a direct (0,0)—(0,2) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
sky=[[1,0],[0,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: (0,0)—(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(1,1) has exactly 0 direct neighbors."
    feedback if wrong: (1,1) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Every grid cell, with `0` cells acting as passable space between stars.”"
    feedback if wrong: Empty cells cannot carry a connection. Making them nodes would join stars across empty space. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,1), but there is no direct (0,0)—(1,1) edge."
    feedback if wrong: The mini-example lists (0,0)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
sky=[[1,0,0],[1,0,0],[1,1,1]]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)", "(2,1)", "(2,2)" · edges: (0,0)—(1,0), (1,0)—(2,0), (1,0)—(2,1), (2,0)—(2,1), (2,1)—(2,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(2,2) has exactly 1 direct neighbor."
    feedback if wrong: (2,2) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each finished constellation.”"
    feedback if wrong: Constellations are the connected components we must discover, not the starting nodes. Correct node rule: Every cell containing `1`; empty `0` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(2,2) can reach (1,0) through (2,1), but the graph still has no direct (2,2)—(1,0) edge."
    feedback if wrong: Right. A multi-step route through (2,1) creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Forgets diagonal star connections
Input shown:
```
REAL PROBLEM INPUT
sky: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  const sideDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    const rowIsValid = row >= 0 && row < sky.length;
    const columnIsValid = column >= 0 && column < sky[0].length;
    return rowIsValid && columnIsValid;
  }

  function visitConstellation(row, column) {
    if (!isInBounds(row, column)) return;
    const currentPosition = positionKey(row, column);
    if (sky[row][column] !== 1 || visited.has(currentPosition)) return;

    visited.add(currentPosition);
    for (const [rowChange, columnChange] of sideDirections) {
      visitConstellation(row + rowChange, column + columnChange);
    }
  }

  let numberOfConstellations = 0;
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      const currentPosition = positionKey(row, column);
      const isUnvisitedStar = sky[row][column] === 1 && !visited.has(currentPosition);
      if (isUnvisitedStar) {
        numberOfConstellations++;
        visitConstellation(row, column);
      }
    }
  }
  return numberOfConstellations;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: (0,0)—(1,1), (1,1)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of constellations" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A The outer loops start a constellation from empty cells for the shown graph.
- B A shared seen set incorrectly merges separate constellations on the shown input.
- C The direction list includes four side moves but omits all four diagonal moves.
Diagnosis answer key + feedback:
- ✅ [missing-diagonals] "The direction list includes four side moves but omits all four diagonal moves." — feedback: Correct. The three stars form one diagonal chain under the eight-direction rule.
- ❌ [counts-empty] "The outer loops start a constellation from empty cells for the shown graph." — feedback: The start condition explicitly requires a 1.
- ❌ [global-seen] "A shared seen set incorrectly merges separate constellations on the shown input." — feedback: A shared seen set is required; it prevents counting one component more than once.
Graph proof shown in feedback: code rule "The DFS can traverse only horizontal and vertical edges." → changed graph "The three star nodes form a two-edge diagonal chain." → boundary "Every real edge in this input is diagonal." → returned value "The code sees three isolated stars and returns 3 instead of one constellation."
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
About your diagnosis: The start condition explicitly requires a 1.
Code rule: The DFS can traverse only horizontal and vertical edges. → Changed graph: The three star nodes form a two-edge diagonal chain. → Reachable boundary: Every real edge in this input is diagonal.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forgets diagonal star connections
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: The DFS can traverse only horizontal and vertical edges. → Changed graph: The three star nodes form a two-edge diagonal chain. → Reachable boundary: Every real edge in this input is diagonal. → Returned value: The code sees three isolated stars and returns 3 instead of one constellation.
```

### S4 case 2 — `case-2` · bug: Forgets diagonal star connections
Input shown:
```
REAL PROBLEM INPUT
sky=[[1,1,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  const sideDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    const rowIsValid = row >= 0 && row < sky.length;
    const columnIsValid = column >= 0 && column < sky[0].length;
    return rowIsValid && columnIsValid;
  }

  function visitConstellation(row, column) {
    if (!isInBounds(row, column)) return;
    const currentPosition = positionKey(row, column);
    if (sky[row][column] !== 1 || visited.has(currentPosition)) return;

    visited.add(currentPosition);
    for (const [rowChange, columnChange] of sideDirections) {
      visitConstellation(row + rowChange, column + columnChange);
    }
  }

  let numberOfConstellations = 0;
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      const currentPosition = positionKey(row, column);
      const isUnvisitedStar = sky[row][column] === 1 && !visited.has(currentPosition);
      if (isUnvisitedStar) {
        numberOfConstellations++;
        visitConstellation(row, column);
      }
    }
  }
  return numberOfConstellations;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(2,2)" · edges: (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (1,1)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of constellations" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A The direction list includes four side moves but omits all four diagonal moves.
- B The outer loops start a constellation from empty cells for the shown graph.
- C A shared seen set incorrectly merges separate constellations on the shown input.
Diagnosis answer key + feedback:
- ✅ [missing-diagonals] "The direction list includes four side moves but omits all four diagonal moves." — feedback: Exactly. The DFS can traverse only horizontal and vertical edges. The shown code returns 2; the real problem returns 1.
- ❌ [counts-empty] "The outer loops start a constellation from empty cells for the shown graph." — feedback: The start condition explicitly requires a 1.
- ❌ [global-seen] "A shared seen set incorrectly merges separate constellations on the shown input." — feedback: A shared seen set is required; it prevents counting one component more than once.
Graph proof shown in feedback: code rule "The DFS can traverse only horizontal and vertical edges." → changed graph "Nodes are (0,0), (0,1), (1,1), (2,2); direct edges are (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (1,1)—(2,2)." → boundary "four-direction-constellations" → returned value "The shown code returns 2; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forgets diagonal star connections
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: The DFS can traverse only horizontal and vertical edges. → Changed graph: Nodes are (0,0), (0,1), (1,1), (2,2); direct edges are (0,0)—(0,1), (0,0)—(1,1), (0,1)—(1,1), (1,1)—(2,2). → Reachable boundary: four-direction-constellations → Returned value: The shown code returns 2; the real problem returns 1.
```

### S4 case 3 — `repair-2` · bug: Forgets diagonal star connections
Input shown:
```
REAL PROBLEM INPUT
sky=[[1,0],[0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  const sideDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    const rowIsValid = row >= 0 && row < sky.length;
    const columnIsValid = column >= 0 && column < sky[0].length;
    return rowIsValid && columnIsValid;
  }

  function visitConstellation(row, column) {
    if (!isInBounds(row, column)) return;
    const currentPosition = positionKey(row, column);
    if (sky[row][column] !== 1 || visited.has(currentPosition)) return;

    visited.add(currentPosition);
    for (const [rowChange, columnChange] of sideDirections) {
      visitConstellation(row + rowChange, column + columnChange);
    }
  }

  let numberOfConstellations = 0;
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      const currentPosition = positionKey(row, column);
      const isUnvisitedStar = sky[row][column] === 1 && !visited.has(currentPosition);
      if (isUnvisitedStar) {
        numberOfConstellations++;
        visitConstellation(row, column);
      }
    }
  }
  return numberOfConstellations;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: (0,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of constellations" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A The outer loops start a constellation from empty cells for the shown graph.
- B The direction list includes four side moves but omits all four diagonal moves.
- C A shared seen set incorrectly merges separate constellations on the shown input.
Diagnosis answer key + feedback:
- ✅ [missing-diagonals] "The direction list includes four side moves but omits all four diagonal moves." — feedback: Exactly. The DFS can traverse only horizontal and vertical edges. The shown code returns 2; the real problem returns 1.
- ❌ [counts-empty] "The outer loops start a constellation from empty cells for the shown graph." — feedback: The start condition explicitly requires a 1.
- ❌ [global-seen] "A shared seen set incorrectly merges separate constellations on the shown input." — feedback: A shared seen set is required; it prevents counting one component more than once.
Graph proof shown in feedback: code rule "The DFS can traverse only horizontal and vertical edges." → changed graph "Nodes are (0,0), (1,1); direct edges are (0,0)—(1,1)." → boundary "four-direction-constellations" → returned value "The shown code returns 2; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forgets diagonal star connections
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: The DFS can traverse only horizontal and vertical edges. → Changed graph: Nodes are (0,0), (1,1); direct edges are (0,0)—(1,1). → Reachable boundary: four-direction-constellations → Returned value: The shown code returns 2; the real problem returns 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```