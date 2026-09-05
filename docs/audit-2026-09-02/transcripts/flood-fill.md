# Flood Fill (`flood-fill`) — new, grid

## Problem statement (Description tab)

You are given a picture as a grid of numbers called `image`, where `image[i][j]` is the color of one pixel.

You are also given a starting pixel at row `sr` and column `sc`, and a new color `color`.

Do a "paint bucket" fill, just like in a drawing app:

- Change the starting pixel to the new color.
- Then keep spreading: any pixel that touches an already-filled pixel up, down, left, or right, AND originally had the same color as the starting pixel, also gets the new color.
- Diagonal touching does NOT count.

Return the image after the fill is finished.

### Examples
- Example 1: input `image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2` → output `[[2,2,2],[2,2,0],[2,0,1]]`. Starting at the center (row 1, col 1), every 1 you can reach by up/down/left/right steps through 1s gets painted 2. The 1 in the bottom-right corner only touches the blob diagonally, so it stays 1.
- Example 2: input `image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0` → output `[[0,0,0],[0,0,0]]`. The new color is the same as the starting pixel's color, so the image stays exactly the same.

### Graph rules (authored)
- Nodes: Every pixel whose original color equals the start pixel's color.
- Edges: Across a shared side to a pixel of the original start color.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "start-color pixels")
Raw input shown:
```
image=[[1,1],[1,0]], sr=0, sc=0, color=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[2,2],[2,0]]
2. [[2,2],[2,2]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[2,2],[2,0]]"
    feedback: Correct. Only the connected original-color region changes.
- ❌ [wrong] "[[2,2],[2,2]]"
    feedback: That follows the paint other colors bug. (misconception: paint-other-colors)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)" · edges: (0,0)—(1,0), (0,0)—(0,1)
"Why" shown after success: Only the connected original-color region changes.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "cell identity")
Raw input shown:
```
image=[[1,0],[0,1]], sr=0, sc=0, color=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[2,0],[0,2]]
2. [[2,0],[0,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[2,0],[0,1]]"
    feedback: Correct. The lower-right 1 is only diagonal.
- ❌ [wrong] "[[2,0],[0,2]]"
    feedback: That follows the allow diagonals bug. (misconception: allow-diagonals)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
"Why" shown after success: The lower-right 1 is only diagonal.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "start-color pixels")
Raw input shown:
```
image=[[1,1],[1,0]], sr=0, sc=0, color=2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture A / (0,0) / (0,1) / (1,0)
2. Picture B / (0,0) / (0,1)
3. Picture C / (0,0) / (0,1) / (1,0)
4. Picture D / (0,0) / (0,1) / (1,0)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)—(1,0), (0,0)—(0,1)
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (0,1) · edges: (0,0)—(0,1)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)—(1,0)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)→(1,0), (0,0)→(0,1)
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
Which pixels belong to the graph explored by the paint bucket?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which pixels belong to the graph explored by the paint bucket?**
Choices as displayed (top to bottom):
1. A / Every pixel whose original color equals the start pixel's color.
2. B / Every pixel in the image.
3. C / Only pixels that already have the requested new color.
4. D / Only pixels already known to be reachable from the start.
Answer key + feedback per choice (data):
- ✅ CORRECT [start-color] "Every pixel whose original color equals the start pixel's color."
    feedback: Right. Reachability then decides which of those pixels actually changes.
- ❌ [all] "Every pixel in the image."
    feedback: Other colors are boundaries the fill cannot cross. (misconception: crosses-color-boundaries)
- ❌ [new-color] "Only pixels that already have the requested new color."
    feedback: The search follows the original start color, not the replacement color. (misconception: searches-new-color)
- ❌ [reachable-only] "Only pixels already known to be reachable from the start."
    feedback: Reachability is what DFS discovers from the candidate nodes and edges. (misconception: assumes-result-up-front)
"Why" shown after success: Right. Reachability then decides which of those pixels actually changes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-3`, facet "side edges")
Raw input shown:
```
image=[[1,1,0],[0,1,1]], sr=0, sc=0, color=3
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[3,3,0],[0,3,3]]
2. [[3,3,0],[0,3,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[3,3,0],[0,3,3]]"
    feedback: Correct. The region continues through (1,1) to (1,2).
- ❌ [wrong] "[[3,3,0],[0,3,1]]"
    feedback: That follows the stop one step early bug. (misconception: stop-one-step-early)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)", "(1,2)" · edges: (0,0)—(0,1), (0,1)—(1,1), (1,1)—(1,2)
"Why" shown after success: The region continues through (1,1) to (1,2).
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`edge-rule`, facet "side edges")
Raw input shown:
```
How may paint spread from one candidate pixel to another?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How may paint spread from one candidate pixel to another?**
Choices as displayed (top to bottom):
1. A / Across a shared side or corner to the original color.
2. B / Across a shared side to a pixel of the original start color.
3. C / Across a shared side regardless of the neighbor's original color.
4. D / To any matching-color pixel in the same row or column.
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "Across a shared side to a pixel of the original start color."
    feedback: Right. Paint spreads up, down, left, and right only.
- ❌ [eight] "Across a shared side or corner to the original color."
    feedback: Diagonal pixels do not touch for flood fill. (misconception: allows-diagonals)
- ❌ [any-color] "Across a shared side regardless of the neighbor's original color."
    feedback: That would leak through color boundaries. (misconception: ignores-original-color)
- ❌ [same-row] "To any matching-color pixel in the same row or column."
    feedback: The fill moves one adjacent pixel at a time. (misconception: jumps-gaps)
"Why" shown after success: Right. Paint spreads up, down, left, and right only.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "reachable repaint")
Raw input shown:
```
image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Starting at the center of [[1,1,1],[1,1,0],[1,0,1]] and painting 2, what image results?**
Choices as displayed (top to bottom):
1. A / [[2,2,2],[2,2,0],[2,0,2]]
2. B / [[1,2,1],[2,2,0],[1,0,1]]
3. C / [[2,2,2],[2,2,2],[2,2,2]]
4. D / [[2,2,2],[2,2,0],[2,0,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[2,2,2],[2,2,0],[2,0,1]]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[[2,2,2],[2,2,0],[2,0,2]]"
    feedback: The bottom-right 1 touches only diagonally. (misconception: paints-diagonal)
- ❌ [wrong-2] "[[1,2,1],[2,2,0],[1,0,1]]"
    feedback: The fill continues through every connected original-color pixel. (misconception: paints-direct-neighbors-only)
- ❌ [wrong-3] "[[2,2,2],[2,2,2],[2,2,2]]"
    feedback: Zero pixels are color boundaries. (misconception: paints-all-cells)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "reachable repaint")
Raw input shown:
```
image=[[5]], sr=0, sc=0, color=5
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [[5]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[5]]"
    feedback: Correct. The image stays unchanged when old and new colors match.
- ❌ [wrong] "[]"
    feedback: That follows the return empty on same color bug. (misconception: return-empty-on-same-color)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The image stays unchanged when old and new colors match.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "reachable repaint")
Raw input shown:
```
image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What happens when a grid of 0s is flood-filled from 0 to new color 0?**
Choices as displayed (top to bottom):
1. A / Every 0 is changed to 1.
2. B / The image stays unchanged.
3. C / Only the starting 0 is removed.
4. D / The function returns an empty image.
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "The image stays unchanged."
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "Every 0 is changed to 1."
    feedback: The requested replacement is 0, not 1. (misconception: uses-default-color)
- ❌ [wrong-2] "Only the starting 0 is removed."
    feedback: Flood fill does not remove pixels. (misconception: deletes-start)
- ❌ [wrong-3] "The function returns an empty image."
    feedback: Equal colors are a no-op, not deletion. (misconception: returns-empty-on-no-op)
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
image=[[2,2],[0,2]], sr=1, sc=1, color=7
```
Remedial question: **What should the function return?** · choices shown: [[7,7],[0,7]] | [[2,7],[0,7]]
Remedial answer key: ✅ "[[7,7],[0,7]]" — Correct. All three side-connected 2 pixels repaint.; ❌ "[[2,7],[0,7]]" — That follows the miss upward branch bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [all]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every pixel whose original color equals the start pixel's color.
Your choice: Other colors are boundaries the fill cannot cross.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
image=[[1,2,1]], sr=0, sc=0, color=9
```
Remedial question: **What should the function return?** · choices shown: [[9,2,9]] | [[9,2,1]]
Remedial answer key: ✅ "[[9,2,1]]" — Correct. The 2 blocks the second 1.; ❌ "[[9,2,9]]" — That follows the cross different color wall bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Across a shared side to a pixel of the original start color.
Your choice: Diagonal pixels do not touch for flood fill.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
image=[[3],[3],[4]], sr=0, sc=0, color=8
```
Remedial question: **What should the function return?** · choices shown: [[8],[8],[4]] | [[8],[3],[4]]
Remedial answer key: ✅ "[[8],[8],[4]]" — Correct. Vertical side neighbors repaint.; ❌ "[[8],[3],[4]]" — That follows the horizontal only search bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)" · edges: (0,0)—(1,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[2,2,2],[2,2,0],[2,0,1]]
Your choice: The bottom-right 1 touches only diagonally.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
image=[[1,1],[1,1]], sr=0, sc=1, color=0
```
Remedial question: **What should the function return?** · choices shown: [[1,0],[1,0]] | [[0,0],[0,0]]
Remedial answer key: ✅ "[[0,0],[0,0]]" — Correct. The whole square is one connected region.; ❌ "[[1,0],[1,0]]" — That follows the one direction only bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The image stays unchanged.
Your choice: The requested replacement is 0, not 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
image=[[1,0],[1,0]], sr=0, sc=1, color=4
```
Remedial question: **What should the function return?** · choices shown: [[1,4],[1,4]] | [[4,4],[4,4]]
Remedial answer key: ✅ "[[1,4],[1,4]]" — Correct. The starting color is 0, so the 1 column stays unchanged.; ❌ "[[4,4],[4,4]]" — That follows the use wrong start color bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,1)" · edges: (0,1)—(1,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Color at the corner"; authored goal, NOT shown to student: "Place matching colors diagonally with no side path between them.")
Everything the student sees (text):
```
M
Maddox's broken search

Maddox allows diagonal steps even though only side moves are legal.

Your main goal: Expose Maddox's mistake. Draw two graphs: first the correct graph, then Maddox's graph using the mistake.

CHOOSE THE STARTING PIXEL
starting pixel
OUTPUT
CORRECT OUTPUT
MADDOX’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting pixel
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
2 · Maddox's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING PIXEL / starting pixel", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MADDOX’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,0)"): accepted
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
MADDOX'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Pixel-coordinate check"; authored goal, NOT shown to student: "Make the selected pixel different from the first matching pixel.")
Everything the student sees (text):
```
J
Josephine's broken search

Josephine runs the search from a different starting pixel.

Your main goal: Expose Josephine's mistake. Draw two graphs: first the correct graph, then Josephine's graph using the mistake.

CHOOSE THE STARTING PIXEL
starting pixel
OUTPUT
CORRECT OUTPUT
JOSEPHINE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting pixel
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
2 · Josephine's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING PIXEL / starting pixel", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JOSEPHINE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
JOSEPHINE'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Last color bridge"; authored goal, NOT shown to student: "Make the final side contact carry the fill to another pixel.")
Everything the student sees (text):
```
S
Sergio's broken search

Sergio accidentally leaves the final direct link out of the graph.

Your main goal: Expose Sergio's mistake. Draw two graphs: first the correct graph, then Sergio's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE STARTING PIXEL
starting pixel
OUTPUT
CORRECT OUTPUT
SERGIO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting pixel
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
2 · Sergio's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING PIXEL / starting pixel", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SERGIO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
SERGIO'S OUTPUT
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
image=[[1,0],[1,0]], sr=0, sc=1, color=4
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,1)" · edges: (0,1)—(1,1)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only pixels already known to be reachable from the start.”"
    feedback if wrong: Reachability is what DFS discovers from the candidate nodes and edges. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [NO is correct] (direct-vs-reach) "(0,1) can reach (1,1), but there is no direct (0,1)—(1,1) edge."
    feedback if wrong: The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(1,1) has exactly 0 direct neighbors."
    feedback if wrong: (1,1) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Reachability is what DFS discovers from the candidate nodes and edges. Correct node rule: Every pixel whose original color equals the start pixel's color.
×
The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
×
(1,1) has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "(0,1) has exactly 2 direct neighbors."
    feedback if wrong: (0,1) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Every pixel in the image.”"
    feedback if wrong: Other colors are boundaries the fill cannot cross. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [NO is correct] (direct-vs-reach) "(0,1) can reach (1,1), but there is no direct (0,1)—(1,1) edge."
    feedback if wrong: The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,1) has 1 direct neighbor.
×
Other colors are boundaries the fill cannot cross. Correct node rule: Every pixel whose original color equals the start pixel's color.
×
The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(1,1) has exactly 0 direct neighbors."
    feedback if wrong: (1,1) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only pixels that already have the requested new color.”"
    feedback if wrong: The search follows the original start color, not the replacement color. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [NO is correct] (direct-vs-reach) "(0,1) can reach (1,1), but there is no direct (0,1)—(1,1) edge."
    feedback if wrong: The mini-example lists (0,1)—(1,1) as one direct edge. A direct edge is different from a longer reachable route.
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
Every pixel whose original color equals the start pixel's color.
EDGES
Across a shared side to a pixel of the original start color.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
image=[[2,2],[0,2]], sr=1, sc=1, color=7
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,1)" · edges: (0,0)—(0,1), (0,1)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every pixel in the image.”"
    feedback if wrong: Other colors are boundaries the fill cannot cross. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (0,1), but the graph still has no direct (0,0)—(1,1) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
image=[[1,2,1]], sr=0, sc=0, color=9
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,2)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,2) has exactly 1 direct neighbor."
    feedback if wrong: (0,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only pixels already known to be reachable from the start.”"
    feedback if wrong: Reachability is what DFS discovers from the candidate nodes and edges. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (0,2).
Result: PASSED

### S3 Q4
Raw input shown:
```
image=[[3],[3],[4]], sr=0, sc=0, color=8
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(1,0)" · edges: (0,0)—(1,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 2 direct neighbors."
    feedback if wrong: (0,0) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only pixels that already have the requested new color.”"
    feedback if wrong: The search follows the original start color, not the replacement color. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (1,0), but there is no direct (0,0)—(1,0) edge."
    feedback if wrong: The mini-example lists (0,0)—(1,0) as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
image=[[1,1],[1,1]], sr=0, sc=1, color=0
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(1,0), (0,0)—(0,1), (0,1)—(1,1), (1,0)—(1,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every pixel in the image.”"
    feedback if wrong: Other colors are boundaries the fill cannot cross. Correct node rule: Every pixel whose original color equals the start pixel's color.
- [YES is correct] (direct-vs-reach) "(1,0) can reach (0,1) through (1,1), but the graph still has no direct (1,0)—(0,1) edge."
    feedback if wrong: Right. A multi-step route through (1,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,1) has exactly 2 direct neighbors."
    feedback if wrong: (0,1) has 2 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Paint spreads across corners
Input shown:
```
REAL PROBLEM INPUT
image: [[1, 0], [0, 1]]
sr: 0
sc: 0
color: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function floodFill(image, sr, sc, color) {
  const startRow = sr;
  const startColumn = sc;
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const originalColor = image[startRow][startColumn];
  if (originalColor === color) {
    return image;
  }
  const stack = [[startRow, startColumn]];
  image[startRow][startColumn] = color;
  while (stack.length) {
    const [row, column] = stack.pop();
    for (let rowChange = -1; rowChange <= 1; rowChange++) {
      for (let columnChange = -1; columnChange <= 1; columnChange++) {
        if (!rowChange && !columnChange) {
          continue;
        }
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        if (
          isInBounds(image, nextRow, nextColumn) &&
          image[nextRow][nextColumn] === originalColor
        ) {
          image[nextRow][nextColumn] = color;
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return image;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON image matrix" · expected buggy output `[[2,0],[0,2]]` · real correct output `[[2,0],[0,1]]`
Diagnosis choices as displayed:
- A Recoloring a pixel before pushing it prevents its neighbors from being explored.
- B The nested offsets repaint the disconnected 1 at (1,1) through a diagonal step.
- C The old===color guard returns before painting the start for the shown graph.
Diagnosis answer key + feedback:
- ❌ [early-recolor] "Recoloring a pixel before pushing it prevents its neighbors from being explored." — feedback: Early recoloring is a valid visited mark; the direction set is too broad.
- ✅ [diagonal-fill] "The nested offsets repaint the disconnected 1 at (1,1) through a diagonal step." — feedback: Exactly. The committed graph has no edge between the two candidate pixels.
- ❌ [same-color-guard] "The old===color guard returns before painting the start for the shown graph." — feedback: Here old is 1 and color is 2, so that guard does not run.
Graph proof shown in feedback: code rule "All eight offsets are treated as paint-spread edges." → changed graph "The two original-color nodes touch only diagonally and are separate components." → boundary "The second 1 is visible but has no side-connected route from the start." → returned value "The bug paints both 1s; the real result paints only (0,0)."
Output-format probes: ✅ spaces after commas → `[[2, 0], [0, 2]]`; ❌ reversed element order → `[[0,2],[2,0]]`; ❌ trailing period → `[[2,0],[0,2]].`
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
About your diagnosis: Early recoloring is a valid visited mark; the direction set is too broad.
Code rule: All eight offsets are treated as paint-spread edges. → Changed graph: The two original-color nodes touch only diagonally and are separate components. → Reachable boundary: The second 1 is visible but has no side-connected route from the start.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Paint spreads across corners
INCORRECT OUTPUT
[[2,0],[0,2]]
CORRECT OUTPUT
[[2,0],[0,1]]
Code rule: All eight offsets are treated as paint-spread edges. → Changed graph: The two original-color nodes touch only diagonally and are separate components. → Reachable boundary: The second 1 is visible but has no side-connected route from the start. → Returned value: The bug paints both 1s; the real result paints only (0,0).
```

### S4 case 2 — `new-diagonal-paint-chain` · bug: Paint spreads across corners
Input shown:
```
REAL PROBLEM INPUT
image: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
sr: 0
sc: 0
color: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function floodFill(image, sr, sc, color) {
  const startRow = sr;
  const startColumn = sc;
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const originalColor = image[startRow][startColumn];
  if (originalColor === color) {
    return image;
  }
  const stack = [[startRow, startColumn]];
  image[startRow][startColumn] = color;
  while (stack.length) {
    const [row, column] = stack.pop();
    for (let rowChange = -1; rowChange <= 1; rowChange++) {
      for (let columnChange = -1; columnChange <= 1; columnChange++) {
        if (!rowChange && !columnChange) {
          continue;
        }
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        if (
          isInBounds(image, nextRow, nextColumn) &&
          image[nextRow][nextColumn] === originalColor
        ) {
          image[nextRow][nextColumn] = color;
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return image;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(1,1)", "(2,2)" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON image matrix" · expected buggy output `[[2,0,0],[0,2,0],[0,0,2]]` · real correct output `[[2,0,0],[0,1,0],[0,0,1]]`
Diagnosis choices as displayed:
- A The code compares against the new color instead of the original color.
- B Marking pixels before pushing them causes the two distant pixels to be revisited.
- C The nested offsets spread paint through two corner-only contacts.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The code compares against the new color instead of the original color." — feedback: old is captured as 1 before any recoloring and stays 1 for every neighbor test.
- ✅ [diagonal-fill] "The nested offsets spread paint through two corner-only contacts." — feedback: Exactly. The start component contains only (0,0).
- ❌ [wrong-visited] "Marking pixels before pushing them causes the two distant pixels to be revisited." — feedback: Early recoloring is a sound visited mark and cannot create a connection to another component.
Graph proof shown in feedback: code rule "Eight-offset expansion adds a diagonal chain." → changed graph "The three old-color pixels are isolated in the side-neighbor graph." → boundary "No side-connected old-color pixel touches the start." → returned value "The bug paints all three pixels; the correct fill paints only the start."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Paint spreads across corners
INCORRECT OUTPUT
[[2,0,0],[0,2,0],[0,0,2]]
CORRECT OUTPUT
[[2,0,0],[0,1,0],[0,0,1]]
Code rule: Eight-offset expansion adds a diagonal chain. → Changed graph: The three old-color pixels are isolated in the side-neighbor graph. → Reachable boundary: No side-connected old-color pixel touches the start. → Returned value: The bug paints all three pixels; the correct fill paints only the start.
```

### S4 case 3 — `new-diagonal-bridge` · bug: Paint spreads across corners
Input shown:
```
REAL PROBLEM INPUT
image: [[1, 1, 0], [0, 0, 1], [0, 0, 1]]
sr: 0
sc: 0
color: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function floodFill(image, sr, sc, color) {
  const startRow = sr;
  const startColumn = sc;
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  const originalColor = image[startRow][startColumn];
  if (originalColor === color) {
    return image;
  }
  const stack = [[startRow, startColumn]];
  image[startRow][startColumn] = color;
  while (stack.length) {
    const [row, column] = stack.pop();
    for (let rowChange = -1; rowChange <= 1; rowChange++) {
      for (let columnChange = -1; columnChange <= 1; columnChange++) {
        if (!rowChange && !columnChange) {
          continue;
        }
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;
        if (
          isInBounds(image, nextRow, nextColumn) &&
          image[nextRow][nextColumn] === originalColor
        ) {
          image[nextRow][nextColumn] = color;
          stack.push([nextRow, nextColumn]);
        }
      }
    }
  }
  return image;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,2)", "(2,2)" · edges: (0,0)—(0,1), (1,2)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON image matrix" · expected buggy output `[[2,2,0],[0,0,2],[0,0,2]]` · real correct output `[[2,2,0],[0,0,1],[0,0,1]]`
Diagnosis choices as displayed:
- A The code invents a diagonal bridge from (0,1) to (1,2), merging two size-2 components.
- B The start row and column are swapped, so fill begins at (0,0) by accident.
- C The old-color variable changes after the first pixel is recolored.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The start row and column are swapped, so fill begins at (0,0) by accident." — feedback: sr and sc are used in their declared order; both happen to be 0 here anyway.
- ✅ [diagonal-fill] "The code invents a diagonal bridge from (0,1) to (1,2), merging two size-2 components." — feedback: Exactly. Only the top pair belongs to the start component.
- ❌ [wrong-visited] "The old-color variable changes after the first pixel is recolored." — feedback: old is a constant holding 1, so recoloring the top pair cannot change the comparison color.
Graph proof shown in feedback: code rule "A diagonal offset joins the top component to the right component." → changed graph "There are two separate two-node side-connected components." → boundary "The components touch only at the corner between (0,1) and (1,2)." → returned value "The code paints four pixels; the correct image paints only the top two."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Paint spreads across corners
INCORRECT OUTPUT
[[2,2,0],[0,0,2],[0,0,2]]
CORRECT OUTPUT
[[2,2,0],[0,0,1],[0,0,1]]
Code rule: A diagonal offset joins the top component to the right component. → Changed graph: There are two separate two-node side-connected components. → Reachable boundary: The components touch only at the corner between (0,1) and (1,2). → Returned value: The code paints four pixels; the correct image paints only the top two.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```