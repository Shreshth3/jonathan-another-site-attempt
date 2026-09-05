# Word Search (`word-search`) — original, grid

## Problem statement (Description tab)

You are given an `m x n` grid of letters called `board` and a string `word`. Return `true` if `word` can be spelled out by walking through the grid, and `false` otherwise.

The rules for spelling the word:

- You may start at any cell.
- Each next letter must come from a cell that is **directly next to** the previous one (up, down, left, or right — no diagonals).
- You may **not** use the same cell twice in one word.

### Examples
- Example 1: input `board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'` → output `true`. Start at the 'A' in the top-left corner, walk right to 'B', right to 'C', down to 'C', down to 'E', then left to 'D'.
- Example 2: input `board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'SEE'` → output `true`. Start at the 'S' in the top-right area, then walk down to 'E' and left to 'E'.
- Example 3: input `board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCB'` → output `false`. The only way to spell 'ABCB' would reuse the 'B' cell, which is not allowed.

### Graph rules (authored)
- Nodes: Every cell position, keeping equal letters in different cells as separate nodes.
- Edges: Connections only between cells sharing a side; a search path may use each cell at most once.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-found`, facet "single-path backtracking")
Raw input shown:
```
board = [["A","B"],["D","C"]], word = "ABC"
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A→B→C turns downward using side-adjacent cells.
- ❌ [near-miss] "false"
    feedback: That result follows the search only straight lines bug, not the exact picture. (misconception: search-only-straight-lines)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,1)→(1,1)
"Why" shown after success: A→B→C turns downward using side-adjacent cells.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-reuse`, facet "single-path backtracking")
Raw input shown:
```
board = [["A","B"]], word = "ABA"
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. The only A cell was already used before returning from B.
- ❌ [near-miss] "true"
    feedback: That result follows the reuse cell in same path bug, not the exact picture. (misconception: reuse-cell-in-same-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)→(0,1)
"Why" shown after success: The only A cell was already used before returning from B.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact board letters")
Raw input shown:
```
board = [["A","B"],["D","C"]], word = "ABC"
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (0,1) / (1,0) / (1,1)
2. Picture C / (0,0) / (0,1) / (1,0) / (1,1)
3. Picture D / (0,0) / (0,1) / (1,0)
4. Picture A / (0,0) / (0,1) / (1,0) / (1,1)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(0,1), (0,1)→(1,1)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,0)→(0,1)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0), (1,1) · edges: (0,1)→(0,0), (1,1)→(0,1)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: (0,0), (0,1), (1,0) · edges: (0,0)→(0,1)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-diagonal`, facet "four-way next-letter moves")
Raw input shown:
```
board = [["A","X"],["X","B"]], word = "AB"
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. A and B touch only at a corner.
- ❌ [near-miss] "true"
    feedback: That result follows the allow diagonal move bug, not the exact picture. (misconception: allow-diagonal-move)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: none
"Why" shown after success: A and B touch only at a corner.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "cell identity")
Raw input shown:
```
What should the basic nodes be when drawing the board for Word Search?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should the basic nodes be when drawing the board for Word Search?**
Choices as displayed (top to bottom):
1. A / Every cell position, keeping equal letters in different cells as separate nodes.
2. B / One node for each distinct letter found on the board.
3. C / Only board cells whose letters appear somewhere in the target word.
4. D / One node for each prefix of the target word, such as C, CA, and CAT.
Answer key + feedback per choice (data):
- ✅ CORRECT [cell-positions] "Every cell position, keeping equal letters in different cells as separate nodes."
    feedback: Correct. A path uses positions, and one position cannot be reused within the same word.
- ❌ [unique-letters] "One node for each distinct letter found on the board."
    feedback: Two A cells can have different neighbors and can be used at different points, so they cannot be merged. (misconception: merge-equal-letters)
- ❌ [word-letters] "Only board cells whose letters appear somewhere in the target word."
    feedback: The full board is the input picture; filtering early can hide separate copies and their positions. (misconception: filter-board-by-word)
- ❌ [word-prefixes] "One node for each prefix of the target word, such as C, CA, and CAT."
    feedback: Prefixes describe backtracking progress, but the board picture's nodes are the physical cells being visited. (misconception: prefix-as-grid-node)
"Why" shown after success: Correct. A path uses positions, and one position cannot be reused within the same word.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-one`, facet "cell identity")
Raw input shown:
```
board = [["Z"]], word = "Z"
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The starting cell alone matches the whole word.
- ❌ [near-miss] "false"
    feedback: That result follows the require at least one edge bug, not the exact picture. (misconception: require-at-least-one-edge)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The starting cell alone matches the whole word.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "four-way next-letter moves")
Raw input shown:
```
Which direct connections belong between board-cell nodes?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which direct connections belong between board-cell nodes?**
Choices as displayed (top to bottom):
1. A / Connections between cells sharing either a side or a corner.
2. B / Connect a cell directly to every occurrence anywhere on the board of the next needed letter.
3. C / Connections only between cells sharing a side; a search path may use each cell at most once.
4. D / Connect all cells containing the same letter so the search can choose among them.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-neighbors] "Connections only between cells sharing a side; a search path may use each cell at most once."
    feedback: Correct. The word can move up, down, left, or right, never diagonally.
- ❌ [include-diagonal] "Connections between cells sharing either a side or a corner."
    feedback: Diagonal moves can spell words the problem does not allow. (misconception: allow-diagonal-letter)
- ❌ [matching-next-letter] "Connect a cell directly to every occurrence anywhere on the board of the next needed letter."
    feedback: The next letter must be adjacent; matching a letter does not allow a jump. (misconception: jump-to-matching-letter)
- ❌ [same-letter] "Connect all cells containing the same letter so the search can choose among them."
    feedback: Equal letters are alternatives, not neighbors. Only physical side contact creates a move. (misconception: same-letter-edge)
"Why" shown after success: Correct. The word can move up, down, left, or right, never diagonally.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "single-path backtracking")
Raw input shown:
```
board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **On the sample board, which route proves ABCCED exists?**
Choices as displayed (top to bottom):
1. A / A → diagonal B → diagonal C → C → E → D
2. B / Choose any A, then any B, C, C, E, D anywhere
3. C / Top-left A → right B → right C → down C → down E → left D
4. D / Reuse the same C cell for both consecutive Cs
Answer key + feedback per choice (data):
- ✅ CORRECT [route] "Top-left A → right B → right C → down C → down E → left D"
    feedback: Correct. Every step shares a side and no cell repeats.
- ❌ [diagonal] "A → diagonal B → diagonal C → C → E → D"
    feedback: Diagonal moves are forbidden. (misconception: allow-diagonal)
- ❌ [jump] "Choose any A, then any B, C, C, E, D anywhere"
    feedback: Matching letters must also form one adjacent path. (misconception: ignore-adjacency)
- ❌ [reuse] "Reuse the same C cell for both consecutive Cs"
    feedback: A board cell cannot be used twice in one word. (misconception: reuse-cell)
"Why" shown after success: Correct. Every step shares a side and no cell repeats.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "single-path backtracking")
Raw input shown:
```
board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'SEE'
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Why does SEE exist on the sample board?**
Choices as displayed (top to bottom):
1. A / Use one S and the same neighboring E twice.
2. B / Use an S and two diagonal E cells.
3. C / It exists simply because the board contains one S and two Es.
4. D / A right-side S connects down to E, then left to another E.
Answer key + feedback per choice (data):
- ✅ CORRECT [adjacent] "A right-side S connects down to E, then left to another E."
    feedback: Correct. The three distinct cells share sides in order.
- ❌ [same-e] "Use one S and the same neighboring E twice."
    feedback: The same cell cannot supply both E positions. (misconception: reuse-cell)
- ❌ [diagonal-e] "Use an S and two diagonal E cells."
    feedback: Only side-touching moves are allowed. (misconception: diagonal-move)
- ❌ [letters-anywhere] "It exists simply because the board contains one S and two Es."
    feedback: Letter counts alone do not prove an adjacent route. (misconception: ignore-path-order)
"Why" shown after success: Correct. The three distinct cells share sides in order.
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
board = [["C","A","T"]], word = "CAT"
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. All three letters form a side-adjacent path.; ❌ "false" — That result follows the stop before last letter bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)→(0,1), (0,1)→(0,2)
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [unique-letters]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every cell position, keeping equal letters in different cells as separate nodes.
Your choice: Two A cells can have different neighbors and can be used at different points, so they cannot be merged.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
board = [["A","A"]], word = "AA"
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. The two A cells are distinct positions and may be used once each.; ❌ "false" — That result follows the merge equal letter cells bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)→(0,1)
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [include-diagonal]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Connections only between cells sharing a side; a search path may use each cell at most once.
Your choice: Diagonal moves can spell words the problem does not allow.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
board = [["D"],["O"],["G"]], word = "DOG"
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Vertical side moves are legal.; ❌ "false" — That result follows the check horizontal moves only bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)→(1,0), (1,0)→(2,0)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [diagonal]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Top-left A → right B → right C → down C → down E → left D
Your choice: Diagonal moves are forbidden.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
board = [["A","B","X"],["B","C","X"]], word = "ABC"
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. If one B branch fails, backtracking tries the other B branch.; ❌ "false" — That result follows the stop after first failed b branch bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)", "(0,2)", "(1,2)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [same-e]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A right-side S connects down to E, then left to another E.
Your choice: The same cell cannot supply both E positions.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
board = [["A","B"],["B","C"]], word = "ABC"
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Visited cells belong only to the current path and must be unmarked when a branch returns.; ❌ "false" — That result follows the never unmark after backtracking bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `add-diagonals` (authored level "Diagonal spelling"; authored goal, NOT shown to student: "Put the next needed letter only on a corner-touching cell.")
Everything the student sees (text):
```
A
Aidan's broken search

Aidan adds diagonal moves that the real graph does not have.

Your main goal: Expose Aidan's mistake. Draw two graphs: first the correct graph, then Aidan's graph using the mistake.

CHOOSE THE WORD'S FIRST CELL
word's first cell
OUTPUT
CORRECT OUTPUT
AIDAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose word's first cell
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
2 · Aidan's graph
Check my graph
→
```
Start field: label "CHOOSE THE WORD'S FIRST CELL / word's first cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AIDAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(0,1)", "(1,0)", "(1,1)"): REJECTED with "Use two-way edges."
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
AIDAN'S OUTPUT
["(0,0)","(1,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "First matching letter only"; authored goal, NOT shown to student: "Give a letter cell two possible side-neighbor continuations and make both visible.")
Everything the student sees (text):
```
P
Peyton's broken search

Peyton follows only the first available branch and never comes back.

Your main goal: Expose Peyton's mistake. Draw two graphs: first the correct graph, then Peyton's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE WORD'S FIRST CELL
word's first cell
OUTPUT
CORRECT OUTPUT
PEYTON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose word's first cell
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
2 · Peyton's graph
Check my graph
→
```
Start field: label "CHOOSE THE WORD'S FIRST CELL / word's first cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | PEYTON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(1,0)\",\"(2,0)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (1,0), (2,0) · edges (in drawing order) (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(1,0)","(2,0)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (1,0), (2,0) · edges: (0,0)—(0,1), (0,0)—(1,0), (1,0)—(2,0)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(1,0)","(2,0)"]
PEYTON'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Word loses final step"; authored goal, NOT shown to student: "Make the final side link necessary to reach the word's last letter.")
Everything the student sees (text):
```
J
Jason's broken search

Jason stops reading one relation too early and drops the final edge.

Your main goal: Expose Jason's mistake. Draw two graphs: first the correct graph, then Jason's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE WORD'S FIRST CELL
word's first cell
OUTPUT
CORRECT OUTPUT
JASON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose word's first cell
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
2 · Jason's graph
Check my graph
→
```
Start field: label "CHOOSE THE WORD'S FIRST CELL / word's first cell", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JASON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
JASON'S OUTPUT
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
board = [["A","B"],["B","C"]], word = "ABC"
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each distinct letter found on the board.”"
    feedback if wrong: Two A cells can have different neighbors and can be used at different points, so they cannot be merged. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (0,1), but the graph still has no direct (0,0)→(1,1) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,0) has exactly 2 outgoing direct edges."
    feedback if wrong: (0,0) has 2 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two A cells can have different neighbors and can be used at different points, so they cannot be merged. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
×
Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
×
(0,0) has 2 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only board cells whose letters appear somewhere in the target word.”"
    feedback if wrong: The full board is the input picture; filtering early can hide separate copies and their positions. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (1,1) through (1,0), but the graph still has no direct (0,0)→(1,1) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (1,1) has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The full board is the input picture; filtering early can hide separate copies and their positions. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
×
Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
×
(1,1) has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(1,0) has exactly 2 outgoing direct edges."
    feedback if wrong: (1,0) has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each prefix of the target word, such as C, CA, and CAT.”"
    feedback if wrong: Prefixes describe backtracking progress, but the board picture's nodes are the physical cells being visited. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(0,1) and (0,1)→(1,1), so it should also contain a direct (0,0)→(1,1) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
Use this graph model

Other graph models can be valid, but this checker expects this one.

NODES
Every cell position, keeping equal letters in different cells as separate nodes.
EDGES
Connections only between cells sharing a side; a search path may use each cell at most once.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
board = [["C","A","T"]], word = "CAT"
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)→(0,1), (0,1)→(0,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only board cells whose letters appear somewhere in the target word.”"
    feedback if wrong: The full board is the input picture; filtering early can hide separate copies and their positions. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(0,1) and (0,1)→(0,2), so it should also contain a direct (0,0)→(0,2) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (0,1) has 1 outgoing direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
board = [["A","A"]], word = "AA"
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)" · edges: (0,0)→(0,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,1), but there is no direct (0,0)→(0,1) edge."
    feedback if wrong: The mini-example lists (0,0)→(0,1) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "(0,0) has exactly 2 outgoing direct edges."
    feedback if wrong: (0,0) has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each distinct letter found on the board.”"
    feedback if wrong: Two A cells can have different neighbors and can be used at different points, so they cannot be merged. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
Result: PASSED

### S3 Q4
Raw input shown:
```
board = [["D"],["O"],["G"]], word = "DOG"
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(1,0)", "(2,0)" · edges: (0,0)→(1,0), (1,0)→(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each prefix of the target word, such as C, CA, and CAT.”"
    feedback if wrong: Prefixes describe backtracking progress, but the board picture's nodes are the physical cells being visited. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
- [YES is correct] (direct-vs-reach) "(0,0) can reach (2,0) through (1,0), but the graph still has no direct (0,0)→(2,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(2,0) has exactly 0 outgoing direct edges."
    feedback if wrong: (2,0) has 0 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
board = [["A","B","X"],["B","C","X"]], word = "ABC"
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)", "(0,2)", "(1,2)" · edges: (0,0)→(0,1), (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(0,1) and (0,1)→(1,1), so it should also contain a direct (0,0)→(1,1) edge."
    feedback if wrong: Two direct edges through (0,1) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(0,2) has exactly 1 outgoing direct edge."
    feedback if wrong: (0,2) has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only board cells whose letters appear somewhere in the target word.”"
    feedback if wrong: The full board is the input picture; filtering early can hide separate copies and their positions. Correct node rule: Every cell position, keeping equal letters in different cells as separate nodes.
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

### S4 case 1 — `authored-deep-case` · bug: Cells stay blocked after a failed path
Input shown:
```
REAL PROBLEM INPUT
board = [["B","A","A"],["A","A","A"],["A","A","A"]], word = "AAB"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function exist(board, word) {
  const numberOfRows = board.length;
  const numberOfColumns = board[0].length;
  const visited = new Set();
  function search(row, column, index) {
    if (index === word.length) {
      return true;
    }
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= numberOfRows ||
      column >= numberOfColumns ||
      board[row][column] !== word[index] ||
      visited.has(key)
    ) {
      return false;
    }
    visited.add(key);
    return (
      search(row + 1, column, index + 1) ||
      search(row - 1, column, index + 1) ||
      search(row, column + 1, index + 1) ||
      search(row, column - 1, index + 1)
    );
  }
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (search(row, column, 0)) {
        return true;
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)", "(2,0)", "(2,1)", "(2,2)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(0,2), (0,1)—(1,1), (0,2)—(1,2), (1,0)—(1,1), (1,0)—(2,0), (1,1)—(1,2), (1,1)—(2,1), (1,2)—(2,2), (2,0)—(2,1), (2,1)—(2,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the word exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The visited set is global instead of belonging only to the current candidate path.
- B The search needs diagonal moves to reach B, which changes the returned value here.
- C A valid word may use the same cell twice in one path, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [no-backtracking] "The visited set is global instead of belonging only to the current candidate path." — feedback: Correct. Failed A-starts permanently block cells that a later A→A→B path needs.
- ❌ [diagonal-word] "The search needs diagonal moves to reach B, which changes the returned value here." — feedback: No. A valid route uses side neighbors only, such as (0,2)→(0,1)→(0,0).
- ❌ [reuse-cell] "A valid word may use the same cell twice in one path, changing this input's returned value." — feedback: No. A cell cannot repeat within one path; it may be reused by a different attempted path.
Graph proof shown in feedback: code rule "Once a board node is visited in any failed branch, it is removed from every later branch's graph." → changed graph "The nine board cells form the side-neighbor grid shown; each DFS attempt should block only cells on its current path." → boundary "Early A starts fail after marking cells needed by the valid route (0,2)→(0,1)→(0,0)." → returned value "The real grid reaches the final B, but the globally pruned grid does not, so false replaces true."
Output-format probes: ❌ Capitalized boolean → `False`; ❌ trailing period → `false.`
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
About your diagnosis: No. A valid route uses side neighbors only, such as (0,2)→(0,1)→(0,0).
Code rule: Once a board node is visited in any failed branch, it is removed from every later branch's graph. → Changed graph: The nine board cells form the side-neighbor grid shown; each DFS attempt should block only cells on its current path. → Reachable boundary: Early A starts fail after marking cells needed by the valid route (0,2)→(0,1)→(0,0).
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Cells stay blocked after a failed path
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Once a board node is visited in any failed branch, it is removed from every later branch's graph. → Changed graph: The nine board cells form the side-neighbor grid shown; each DFS attempt should block only cells on its current path. → Reachable boundary: Early A starts fail after marking cells needed by the valid route (0,2)→(0,1)→(0,0). → Returned value: The real grid reaches the final B, but the globally pruned grid does not, so false replaces true.
```

### S4 case 2 — `failed-start-blocks-aab` · bug: Cells stay blocked after a failed path
Input shown:
```
REAL PROBLEM INPUT
board = [["B","A"],["A","A"]], word = "AAB"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function exist(board, word) {
  const numberOfRows = board.length;
  const numberOfColumns = board[0].length;
  const visited = new Set();
  function search(row, column, index) {
    if (index === word.length) {
      return true;
    }
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= numberOfRows ||
      column >= numberOfColumns ||
      board[row][column] !== word[index] ||
      visited.has(key)
    ) {
      return false;
    }
    visited.add(key);
    return (
      search(row + 1, column, index + 1) ||
      search(row - 1, column, index + 1) ||
      search(row, column + 1, index + 1) ||
      search(row, column - 1, index + 1)
    );
  }
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (search(row, column, 0)) {
        return true;
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the word exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The word search needs diagonal moves to find the target word.
- B The visited set is global instead of belonging only to the current candidate path.
- C A valid word may use the same cell twice in one path, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [no-backtracking] "The visited set is global instead of belonging only to the current candidate path." — feedback: Correct. A failed A-start leaves shared A cells blocked, but a later fresh path can use two A cells and finish at the B in (0,0). Therefore the shown code returns false, while the real problem returns true.
- ❌ [diagonal-word] "The word search needs diagonal moves to find the target word." — feedback: Use only side neighbors. The valid route exists without a diagonal; failed attempts must release their cells.
- ❌ [reuse-cell] "A valid word may use the same cell twice in one path, changing this input's returned value." — feedback: No. A cell cannot repeat within one path; it may be reused by a different attempted path.
Graph proof shown in feedback: code rule "Once a board node is visited in any failed branch, it is removed from every later branch's graph." → changed graph "Nodes: (0,0), (0,1), (1,0), (1,1). Direct edges: (0,0)—(0,1); (0,0)—(1,0); (0,1)—(1,1); (1,0)—(1,1)." → boundary "A failed A-start leaves shared A cells blocked, but a later fresh path can use two A cells and finish at the B in (0,0)." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Cells stay blocked after a failed path
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Once a board node is visited in any failed branch, it is removed from every later branch's graph. → Changed graph: Nodes: (0,0), (0,1), (1,0), (1,1). Direct edges: (0,0)—(0,1); (0,0)—(1,0); (0,1)—(1,1); (1,0)—(1,1). → Reachable boundary: A failed A-start leaves shared A cells blocked, but a later fresh path can use two A cells and finish at the B in (0,0). → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

### S4 case 3 — `failed-start-blocks-aac` · bug: Cells stay blocked after a failed path
Input shown:
```
REAL PROBLEM INPUT
board = [["C","A"],["A","A"]], word = "AAC"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function exist(board, word) {
  const numberOfRows = board.length;
  const numberOfColumns = board[0].length;
  const visited = new Set();
  function search(row, column, index) {
    if (index === word.length) {
      return true;
    }
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= numberOfRows ||
      column >= numberOfColumns ||
      board[row][column] !== word[index] ||
      visited.has(key)
    ) {
      return false;
    }
    visited.add(key);
    return (
      search(row + 1, column, index + 1) ||
      search(row - 1, column, index + 1) ||
      search(row, column + 1, index + 1) ||
      search(row, column - 1, index + 1)
    );
  }
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (search(row, column, 0)) {
        return true;
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(1,0)", "(1,1)" · edges: (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the word exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The word search needs diagonal moves to find the target word.
- B A valid word may use the same cell twice in one path, changing this input's returned value.
- C The visited set is global instead of belonging only to the current candidate path.
Diagnosis answer key + feedback:
- ✅ [no-backtracking] "The visited set is global instead of belonging only to the current candidate path." — feedback: Correct. Visited cells from the first failed A branch remain globally removed, hiding the later two-A route that reaches C at (0,0). Therefore the shown code returns false, while the real problem returns true.
- ❌ [diagonal-word] "The word search needs diagonal moves to find the target word." — feedback: Use only side neighbors. The valid route exists without a diagonal; failed attempts must release their cells.
- ❌ [reuse-cell] "A valid word may use the same cell twice in one path, changing this input's returned value." — feedback: No. A cell cannot repeat within one path; it may be reused by a different attempted path.
Graph proof shown in feedback: code rule "Once a board node is visited in any failed branch, it is removed from every later branch's graph." → changed graph "Nodes: (0,0), (0,1), (1,0), (1,1). Direct edges: (0,0)—(0,1); (0,0)—(1,0); (0,1)—(1,1); (1,0)—(1,1)." → boundary "Visited cells from the first failed A branch remain globally removed, hiding the later two-A route that reaches C at (0,0)." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Cells stay blocked after a failed path
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Once a board node is visited in any failed branch, it is removed from every later branch's graph. → Changed graph: Nodes: (0,0), (0,1), (1,0), (1,1). Direct edges: (0,0)—(0,1); (0,0)—(1,0); (0,1)—(1,1); (1,0)—(1,1). → Reachable boundary: Visited cells from the first failed A branch remain globally removed, hiding the later two-A route that reaches C at (0,0). → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```