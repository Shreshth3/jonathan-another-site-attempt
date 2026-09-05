# Getting Gold (`kattis-getting-gold`) — new, state

## Problem statement (Description tab)

You're writing the scoring screen for a text-based treasure game. The dungeon map is a rectangular grid, given to you as an array of strings — one string per row. Each character is one of:

- `P` — the explorer's starting square (exactly one on the map)
- `G` — a piece of gold
- `T` — a hidden trap
- `#` — a wall
- `.` — open floor

The outer border of the map is always solid wall.

The explorer moves one square at a time — up, down, left, or right, never diagonally, and never into a wall. She automatically picks up the gold on any square she stands on (including her starting square, if it had gold).

She can't see traps. But while standing on a square, she **feels a draft** if one or more traps sit directly next to her (up, down, left, or right). She plays it perfectly safe:

- On a square with **no draft**, every neighboring non-wall square is guaranteed trap-free, so she can step onto any of them.
- On a square **with a draft**, she can't tell which neighbor hides a trap, so she will never step onto a square she hasn't already stood on. She can only retrace her steps back the way she came.

Return the number of gold pieces she can collect while playing this cautiously.

**Function signature**

```js
function collectSafeGold(grid) {
  // grid: array of equal-length strings
  // return a number
}
```

### Examples
- Example 1: input `collectSafeGold([
  "#######",
  "#P.GTG#",
  "#..TGG#",
  "#######"
])` → output `1`. She starts at row 1, col 1 (no draft there). The floor at row 1, col 2 has no draft, so she can move through it to the gold at row 1, col 3. Standing on that gold she feels a draft (trap at row 1, col 4), so she takes it and backs out. The floor at row 2, col 2 has a draft too (trap at row 2, col 3), so she can stand there but go no further. All remaining gold lies past trap-guarded squares, so she collects just 1 piece.
- Example 2: input `collectSafeGold([
  "########",
  "#...GTG#",
  "#..PG.G#",
  "#...G#G#",
  "#..TG.G#",
  "########"
])` → output `4`. From P at row 2, col 3 she steps onto the gold at row 2, col 4 (no draft) and continues to the gold at row 3, col 4 (also no draft). From those safe squares she can grab the gold at row 1, col 4 (draft — trap at row 1, col 5) and at row 4, col 4 (draft — trap at row 4, col 3), backing out each time. That's 4 pieces. The three gold pieces in the rightmost open column are only reachable through draft squares like row 2, col 5, so she can never get them.

### Graph rules (authored)
- Nodes: Every non-wall square: floor, start, gold, and trap.
- Edges: A safe non-trap square points to non-trap side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `interior-coordinate` — Use interior grid coordinates like (1,1); row 0 and column 0 are walls.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact dungeon cells")
Raw input shown:
```
dungeon=["#####","#P.G#","#...#","#..T#","#####"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many gold pieces are safely collected?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The safe search reaches 1 gold piece and stops expanding beside traps.
- ❌ [bug] "0"
    feedback: This forgets to count gold on the square when it is safely reached. (misconception: skip-current-gold)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
"Why" shown after success: The safe search reaches 1 gold piece and stops expanding beside traps.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "cell identity")
Raw input shown:
```
dungeon=["#####","#P..#","#.T.#","#..G#","#####"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many gold pieces are safely collected?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The safe search reaches 0 gold pieces and stops expanding beside traps.
- ❌ [bug] "1"
    feedback: This keeps walking from a square beside a trap and collects unsafe gold. (misconception: expand-next-to-trap)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,3)→(2,3), (1,3)→(1,2), (3,1)→(2,1), (3,1)→(3,2), (3,3)→(2,3), (3,3)→(3,2)
"Why" shown after success: The safe search reaches 0 gold pieces and stops expanding beside traps.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact dungeon cells")
Raw input shown:
```
dungeon=["#####","#P.G#","#...#","#..T#","#####"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / (1,1) / (1,2) / (1,3) / (2,1) / (2,2) / (2,3) / (3,1) / (3,2) / (3,3)
2. Picture C / (1,1) / (1,2) / (1,3) / (2,1) / (2,2) / (2,3) / (3,1) / (3,2) / (3,3)
3. Picture D / (1,1) / (1,2) / (1,3) / (2,1) / (2,2) / (2,3) / (3,1) / (3,2)
4. Picture A / (1,1) / (1,2) / (1,3) / (2,1) / (2,2) / (2,3) / (3,1) / (3,2) / (3,3)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: (1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3) · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: (1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3) · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1)
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3) · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (2,3)→(1,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
    feedback: This reverses one listed arrow. (misconception: reverse-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: (1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2) · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-3`, facet "side movement")
Raw input shown:
```
dungeon=["####","#PG#","####"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many gold pieces are safely collected?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The safe search reaches 1 gold piece and stops expanding beside traps.
- ❌ [bug] "0"
    feedback: This forgets to count gold on the square when it is safely reached. (misconception: skip-current-gold)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(1,1)", "(1,2)" · edges: (1,1)→(1,2), (1,2)→(1,1)
"Why" shown after success: The safe search reaches 1 gold piece and stops expanding beside traps.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "cell identity")
Raw input shown:
```
What should be a location node in the dungeon picture?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should be a location node in the dungeon picture?**
Choices as displayed (top to bottom):
1. A / Only squares that are not traps and not beside traps.
2. B / Only the start and squares containing gold.
3. C / Every square, including walls.
4. D / Every non-wall square: floor, start, gold, and trap.
Answer key + feedback per choice (data):
- ✅ CORRECT [nonwall] "Every non-wall square: floor, start, gold, and trap."
    feedback: Right. The movement rule will prevent unsafe outgoing steps.
- ❌ [safe-known] "Only squares that are not traps and not beside traps."
    feedback: The explorer may enter a draft square; it becomes a stopping point. (misconception: removes-draft-squares)
- ❌ [gold] "Only the start and squares containing gold."
    feedback: Plain floor squares can connect the route to gold. (misconception: drops-floor)
- ❌ [all] "Every square, including walls."
    feedback: Walls can never be entered. (misconception: includes-walls)
"Why" shown after success: Right. The movement rule will prevent unsafe outgoing steps.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-4`, facet "stop beside traps")
Raw input shown:
```
dungeon=["###","#P#","###"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many gold pieces are safely collected?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The safe search reaches 0 gold pieces and stops expanding beside traps.
- ❌ [bug] "1"
    feedback: This counts the starting P tile as one gold piece. (misconception: count-start-as-gold)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(1,1)" · edges: none
"Why" shown after success: The safe search reaches 0 gold pieces and stops expanding beside traps.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "side movement")
Raw input shown:
```
Which movement arrows should leave a square?
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which movement arrows should leave a square?**
Choices as displayed (top to bottom):
1. A / Every non-wall square points to all non-wall side neighbors.
2. B / A safe non-trap square points to non-trap side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows.
3. C / No arrow may enter or leave a square beside a trap.
4. D / Only trap squares have no outgoing arrows.
Answer key + feedback per choice (data):
- ✅ CORRECT [draft-rule] "A safe non-trap square points to non-trap side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows."
    feedback: Right. A draft square may be entered but cannot expand, while a trap cannot be entered at all.
- ❌ [normal] "Every non-wall square points to all non-wall side neighbors."
    feedback: That ignores the rule to stop exploring when a draft is felt. (misconception: ignores-drafts)
- ❌ [remove-draft] "No arrow may enter or leave a square beside a trap."
    feedback: The explorer may safely enter a draft square before stopping. (misconception: cannot-enter-draft)
- ❌ [trap-only] "Only trap squares have no outgoing arrows."
    feedback: The stopping rule applies one square before the trap. (misconception: stops-too-late)
"Why" shown after success: Right. A draft square may be entered but cannot expand, while a trap cannot be entered at all.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "stop beside traps")
Raw input shown:
```
collectSafeGold([
  "#######",
  "#P.GTG#",
  "#..TGG#",
  "#######"
])
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the first shown dungeon, how many safe gold pieces can the explorer collect?**
Choices as displayed (top to bottom):
1. A / 0
2. B / 1
3. C / 3
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "0"
    feedback: One gold is reachable before the draft stops expansion. (misconception: stops-before-draft-cell)
- ❌ [wrong-2] "3"
    feedback: Gold beyond a draft square cannot be explored. (misconception: walks-through-draft)
- ❌ [wrong-3] "4"
    feedback: This counts all four G tiles, including three that safe exploration cannot reach. (misconception: counts-all-gold)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "stop beside traps")
Raw input shown:
```
collectSafeGold([
  "########",
  "#...GTG#",
  "#..PG.G#",
  "#...G#G#",
  "#..TG.G#",
  "########"
])
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the second shown dungeon, how many safe gold pieces are collectible?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 3
3. C / 7
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "3"
    feedback: A gold square with a draft may be entered and collected before stopping. (misconception: cannot-enter-draft)
- ❌ [wrong-2] "7"
    feedback: Three right-column gold pieces lie beyond draft squares. (misconception: ignores-draft-stop)
- ❌ [wrong-3] "2"
    feedback: Safe exploration branches to two additional draft-edge gold squares. (misconception: stops-search-too-early)
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
#### After answering concept `exact-picture` wrong with choice [missing-edge]
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
dungeon=["#####","#P.G#","#.T.#","#G..#","#####"]
```
Remedial question: **How many gold pieces are safely collected?** · choices shown: 2 | 0
Remedial answer key: ✅ "0" — Correct. The safe search reaches 0 gold pieces and stops expanding beside traps.; ❌ "2" — This keeps walking from a square beside a trap and collects unsafe gold.
Remedial required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,3)→(2,3), (1,3)→(1,2), (3,1)→(2,1), (3,1)→(3,2), (3,3)→(2,3), (3,3)→(3,2)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [safe-known]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every non-wall square: floor, start, gold, and trap.
Your choice: The explorer may enter a draft square; it becomes a stopping point.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
dungeon=["#####","#P#G#","#...#","#####"]
```
Remedial question: **How many gold pieces are safely collected?** · choices shown: 1 | 0
Remedial answer key: ✅ "1" — Correct. The safe search reaches 1 gold piece and stops expanding beside traps.; ❌ "0" — This forgets to count gold on the square when it is safely reached.
Remedial required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,3)", "(2,1)", "(2,2)", "(2,3)" · edges: (1,1)→(2,1), (1,3)→(2,3), (2,1)→(1,1), (2,1)→(2,2), (2,2)→(2,1), (2,2)→(2,3), (2,3)→(1,3), (2,3)→(2,2)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [normal]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A safe non-trap square points to non-trap side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows.
Your choice: That ignores the rule to stop exploring when a draft is felt.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
dungeon=["#####","#P..#","#T.G#","#####"]
```
Remedial question: **How many gold pieces are safely collected?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. The safe search reaches 0 gold pieces and stops expanding beside traps.; ❌ "1" — This keeps walking from a square beside a trap and collects unsafe gold.
Remedial required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)" · edges: (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,3)→(1,3), (2,3)→(2,2)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: One gold is reachable before the draft stops expansion.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
dungeon=["#####","#P.G#","#...#","#G.T#","#####"]
```
Remedial question: **How many gold pieces are safely collected?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The safe search reaches 2 gold pieces and stops expanding beside traps.; ❌ "1" — This forgets to count gold on the square when it is safely reached.
Remedial required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
4
Your choice: A gold square with a draft may be entered and collected before stopping.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
dungeon=["#####","#P..#","#.#.#","#G.G#","#####"]
```
Remedial question: **How many gold pieces are safely collected?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The safe search reaches 2 gold pieces and stops expanding beside traps.; ❌ "1" — This forgets to count gold on the square when it is safely reached.
Remedial required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,3)→(1,3), (2,3)→(3,3), (3,1)→(2,1), (3,1)→(3,2), (3,2)→(3,1), (3,2)→(3,3), (3,3)→(2,3), (3,3)→(3,2)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Lost corridor"; authored goal, NOT shown to student: "Put reachable gold behind the final safe move.")
Everything the student sees (text):
```
C
Cadence's broken search

Cadence stops reading one relation too early and drops the final edge.

Your main goal: Expose Cadence's mistake. Draw two graphs: first the correct graph, then Cadence's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE PLAYER SQUARE
player square
OUTPUT
CORRECT OUTPUT
CADENCE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose player square
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
2 · Cadence's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLAYER SQUARE / player square", placeholder "Example: (1,1)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CADENCE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)"): REJECTED with "Draw 1–8 nodes."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(1,1)\",\"(1,2)\",\"(1,3)\"]","buggy":"[\"(1,1)\",\"(1,2)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (1,1), (1,2), (1,3) · edges (in drawing order) (1,1)→(1,2), (1,2)→(1,3) · start (1,1)
Grader's expected answers: correct output `["(1,1)","(1,2)","(1,3)"]` · character's output `["(1,1)","(1,2)"]` · character's graph must be exactly: DIRECTED · nodes: (1,1), (1,2), (1,3) · edges: (1,1)→(1,2)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(1,1), (1,2), (1,3)`; ❌ curly braces → `{(1,1),(1,2),(1,3)}`; ✅ quoted numbers/strings → `["(1,1)","(1,2)","(1,3)"]`; ❌ reversed order → `["(1,3)","(1,2)","(1,1)"]`; ✅ spaces inside brackets → `[ "(1,1)" , "(1,2)" , "(1,3)" ]`; ❌ unquoted labels (if non-numeric) → `[(1,1),(1,2),(1,3)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(1,1)","(1,2)","(1,3)"]
CADENCE'S OUTPUT
["(1,1)","(1,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "Gold-room fork"; authored goal, NOT shown to student: "Place gold on two safe branches from one room.")
Everything the student sees (text):
```
E
Erik's broken search

Erik follows only the first available branch and never comes back.

Your main goal: Expose Erik's mistake. Draw two graphs: first the correct graph, then Erik's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE PLAYER SQUARE
player square
OUTPUT
CORRECT OUTPUT
ERIK’S OUTPUT
Drawing 1 of 2: Correct graph · Choose player square
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
2 · Erik's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLAYER SQUARE / player square", placeholder "Example: (1,1)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ERIK’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(1,1)\",\"(1,2)\",\"(2,1)\",\"(3,1)\"]","buggy":"[\"(1,1)\",\"(1,2)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (1,1), (1,2), (2,1), (3,1) · edges (in drawing order) (1,1)→(1,2), (1,1)→(2,1), (2,1)→(3,1) · start (1,1)
Grader's expected answers: correct output `["(1,1)","(1,2)","(2,1)","(3,1)"]` · character's output `["(1,1)","(1,2)"]` · character's graph must be exactly: DIRECTED · nodes: (1,1), (1,2), (2,1), (3,1) · edges: (1,1)→(1,2), (1,1)→(2,1), (2,1)→(3,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(1,1)","(1,2)","(2,1)","(3,1)"]
ERIK'S OUTPUT
["(1,1)","(1,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Player-position check"; authored goal, NOT shown to student: "Make the player start away from the first floor square.")
Everything the student sees (text):
```
A
Alexia's broken search

Alexia uses the wrong player square.

Your main goal: Expose Alexia's mistake. Draw two graphs: first the correct graph, then Alexia's graph using the mistake.

CHOOSE THE PLAYER SQUARE
player square
OUTPUT
CORRECT OUTPUT
ALEXIA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose player square
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
2 · Alexia's graph
Check my graph
→
```
Start field: label "CHOOSE THE PLAYER SQUARE / player square", placeholder "Example: (1,1)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALEXIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(1,2)" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(1,1)\"]","buggy":"[\"(1,2)\",\"(1,3)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (1,1), (1,2), (1,3) · edges (in drawing order) (1,2)→(1,3) · start (1,1)
Grader's expected answers: correct output `["(1,1)"]` · character's output `["(1,2)","(1,3)"]` · character's graph must be exactly: DIRECTED · nodes: (1,1), (1,2), (1,3) · edges: (1,2)→(1,3)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(1,1)"]
ALEXIA'S OUTPUT
["(1,2)","(1,3)"]
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
dungeon=["#####","#P.G#","#.T.#","#G..#","#####"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,3)→(2,3), (1,3)→(1,2), (3,1)→(2,1), (3,1)→(3,2), (3,3)→(2,3), (3,3)→(3,2)
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "(3,1) has exactly 3 outgoing direct edges."
    feedback if wrong: (3,1) has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only squares that are not traps and not beside traps.”"
    feedback if wrong: The explorer may enter a draft square; it becomes a stopping point. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
- [NO is correct] (direct-vs-reach) "(3,1) can reach (2,1), but there is no direct (3,1)→(2,1) edge."
    feedback if wrong: The mini-example lists (3,1)→(2,1) as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(3,1) has 2 outgoing direct edges.
×
The explorer may enter a draft square; it becomes a stopping point. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
×
The mini-example lists (3,1)→(2,1) as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "(2,2) has exactly 0 outgoing direct edges."
    feedback if wrong: (2,2) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the start and squares containing gold.”"
    feedback if wrong: Plain floor squares can connect the route to gold. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
- [YES is correct] (direct-vs-reach) "(1,3) and (1,2) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (1,3)→(1,2) as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(2,2) has 0 outgoing direct edges.
×
Plain floor squares can connect the route to gold. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
×
Correct. The mini-example lists (1,3)→(1,2) as one direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(1,3) has exactly 2 outgoing direct edges."
    feedback if wrong: (1,3) has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every square, including walls.”"
    feedback if wrong: Walls can never be entered. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
- [YES is correct] (direct-vs-reach) "(1,3) and (2,3) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (1,3)→(2,3) as one direct edge.
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
Every non-wall square: floor, start, gold, and trap.
EDGES
A safe non-trap square points to non-trap side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
dungeon=["#####","#P#G#","#...#","#####"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,3)", "(2,1)", "(2,2)", "(2,3)" · edges: (1,1)→(2,1), (1,3)→(2,3), (2,1)→(1,1), (2,1)→(2,2), (2,2)→(2,1), (2,2)→(2,3), (2,3)→(1,3), (2,3)→(2,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (1,3)→(2,3) and (2,3)→(2,2), so it should also contain a direct (1,3)→(2,2) edge."
    feedback if wrong: Two direct edges through (2,3) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(1,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (1,1) has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the start and squares containing gold.”"
    feedback if wrong: Plain floor squares can connect the route to gold. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
dungeon=["#####","#P..#","#T.G#","#####"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)" · edges: (1,2)→(1,1), (1,2)→(1,3), (1,2)→(2,2), (1,3)→(1,2), (1,3)→(2,3), (2,3)→(1,3), (2,3)→(2,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(1,3) can reach (2,2) through (1,2), but the graph still has no direct (1,3)→(2,2) edge."
    feedback if wrong: Right. A multi-step route through (1,2) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(1,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (1,1) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only squares that are not traps and not beside traps.”"
    feedback if wrong: The explorer may enter a draft square; it becomes a stopping point. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
dungeon=["#####","#P.G#","#...#","#G.T#","#####"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(2,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,1)→(2,2), (2,2)→(1,2), (2,2)→(3,2), (2,2)→(2,1), (2,2)→(2,3), (3,1)→(2,1), (3,1)→(3,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(3,3) has exactly 0 outgoing direct edges."
    feedback if wrong: (3,3) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every square, including walls.”"
    feedback if wrong: Walls can never be entered. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
- [YES is correct] (direct-vs-reach) "(1,2) can reach (2,1) through (2,2), but the graph still has no direct (1,2)→(2,1) edge."
    feedback if wrong: Right. A multi-step route through (2,2) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
dungeon=["#####","#P..#","#.#.#","#G.G#","#####"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,2)→(1,1), (1,2)→(1,3), (1,3)→(2,3), (1,3)→(1,2), (2,1)→(1,1), (2,1)→(3,1), (2,3)→(1,3), (2,3)→(3,3), (3,1)→(2,1), (3,1)→(3,2), (3,2)→(3,1), (3,2)→(3,3), (3,3)→(2,3), (3,3)→(3,2)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(3,2) has exactly 3 outgoing direct edges."
    feedback if wrong: (3,2) has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the start and squares containing gold.”"
    feedback if wrong: Plain floor squares can connect the route to gold. Correct node rule: Every non-wall square, including each trap as an obstacle node with no movement edges.
- [NO is correct] (direct-vs-reach) "The correct graph has (3,3)→(2,3) and (2,3)→(1,3), so it should also contain a direct (3,3)→(1,3) edge."
    feedback if wrong: Two direct edges through (2,3) do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: DFS continues from a draft square
Input shown:
```
REAL PROBLEM INPUT
grid: ["#####", "#P.G#", "#.T.#", "#####"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function collectSafeGold(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "P") {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  let gold = 0;
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === "G") {
      gold++;
    }
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
        grid[nextRow][nextColumn] !== "#" &&
        grid[nextRow][nextColumn] !== "T" &&
        !visited.has(key)
      ) {
        visited.add(key);
        stack.push([nextRow, nextColumn]);
      }
    }
  }
  return gold;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)" · edges: (1,1)→(1,2), (1,1)→(2,1), (1,3)→(1,2), (1,3)→(2,3)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The start square P should count as one gold piece for the shown graph.
- B At (1,2) the code keeps exploring even though trap (2,2) is adjacent.
- C The code pushes the trap square itself and walks through it on the shown input.
Diagnosis answer key + feedback:
- ❌ [count-start] "The start square P should count as one gold piece for the shown graph." — feedback: Only G squares count; the illegal expansion reaches the actual gold.
- ❌ [enter-trap] "The code pushes the trap square itself and walks through it on the shown input." — feedback: It explicitly rejects T; the mistake is expanding from safe-looking draft squares.
- ✅ [expand-from-draft] "At (1,2) the code keeps exploring even though trap (2,2) is adjacent." — feedback: Exactly. A draft node may be entered but has no outgoing exploration edges.
Graph proof shown in feedback: code rule "Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps." → changed graph "P points to draft squares (1,2) and (2,1), which have no outgoing arrows. Safe gold square (1,3) points to its draft neighbors, but P cannot reach it." → boundary "The gold lies immediately beyond a draft square." → returned value "The helper crosses the stopped boundary and counts one gold; cautious play collects zero."
Output-format probes: ❌ quoted number → `"1"`; ❌ trailing period → `1.`
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
About your diagnosis: Only G squares count; the illegal expansion reaches the actual gold.
Code rule: Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps. → Changed graph: P points to draft squares (1,2) and (2,1), which have no outgoing arrows. Safe gold square (1,3) points to its draft neighbors, but P cannot reach it. → Reachable boundary: The gold lies immediately beyond a draft square.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
DFS continues from a draft square
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps. → Changed graph: P points to draft squares (1,2) and (2,1), which have no outgoing arrows. Safe gold square (1,3) points to its draft neighbors, but P cannot reach it. → Reachable boundary: The gold lies immediately beyond a draft square. → Returned value: The helper crosses the stopped boundary and counts one gold; cautious play collects zero.
```

### S4 case 2 — `case-2` · bug: DFS continues from a draft square
Input shown:
```
REAL PROBLEM INPUT
dungeon=["#####","#P..#","#.T.#","#..G#","#####"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function collectSafeGold(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "P") {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  let gold = 0;
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === "G") {
      gold++;
    }
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
        grid[nextRow][nextColumn] !== "#" &&
        grid[nextRow][nextColumn] !== "T" &&
        !visited.has(key)
      ) {
        visited.add(key);
        stack.push([nextRow, nextColumn]);
      }
    }
  }
  return gold;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,3)→(2,3), (1,3)→(1,2), (3,1)→(2,1), (3,1)→(3,2), (3,3)→(2,3), (3,3)→(3,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The start square P should count as one gold piece for the shown graph.
- B The code pushes the trap square itself and walks through it on the shown input.
- C At (1,2) the code keeps exploring even though trap (2,2) is adjacent.
Diagnosis answer key + feedback:
- ❌ [count-start] "The start square P should count as one gold piece for the shown graph." — feedback: Only G squares count; the illegal expansion reaches the actual gold.
- ❌ [enter-trap] "The code pushes the trap square itself and walks through it on the shown input." — feedback: It explicitly rejects T; the mistake is expanding from safe-looking draft squares.
- ✅ [expand-from-draft] "At (1,2) the code keeps exploring even though trap (2,2) is adjacent." — feedback: Correct. Draft square (1,2) touches trap (2,2), so legal search stops there; expanding once more incorrectly reaches the gold.
Graph proof shown in feedback: code rule "Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps." → changed graph "The nine interior squares are nodes; only the four safe corners have outgoing arrows, two toward their side neighbors each." → boundary "Square (1,2) is beside trap (2,2), so it may be entered but must have no outgoing movement arrows." → returned value "The shown code returns 1; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
DFS continues from a draft square
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps. → Changed graph: The nine interior squares are nodes; only the four safe corners have outgoing arrows, two toward their side neighbors each. → Reachable boundary: Square (1,2) is beside trap (2,2), so it may be entered but must have no outgoing movement arrows. → Returned value: The shown code returns 1; the real problem returns 0.
```

### S4 case 3 — `repair-1` · bug: DFS continues from a draft square
Input shown:
```
REAL PROBLEM INPUT
dungeon=["#####","#P.G#","#.T.#","#G..#","#####"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function collectSafeGold(grid) {
  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "P") {
        start = [row, column];
      }
    }
  }
  const visited = new Set([start.join(",")]);
  const stack = [start];
  let gold = 0;
  while (stack.length) {
    const [row, column] = stack.pop();
    if (grid[row][column] === "G") {
      gold++;
    }
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
        grid[nextRow][nextColumn] !== "#" &&
        grid[nextRow][nextColumn] !== "T" &&
        !visited.has(key)
      ) {
        visited.add(key);
        stack.push([nextRow, nextColumn]);
      }
    }
  }
  return gold;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)", "(3,1)", "(3,2)", "(3,3)" · edges: (1,1)→(2,1), (1,1)→(1,2), (1,3)→(2,3), (1,3)→(1,2), (3,1)→(2,1), (3,1)→(3,2), (3,3)→(2,3), (3,3)→(3,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `0`
Diagnosis choices as displayed:
- A At (1,2) the code keeps exploring even though trap (2,2) is adjacent.
- B The start square P should count as one gold piece for the shown graph.
- C The code pushes the trap square itself and walks through it on the shown input.
Diagnosis answer key + feedback:
- ❌ [count-start] "The start square P should count as one gold piece for the shown graph." — feedback: Only G squares count; the illegal expansion reaches the actual gold.
- ❌ [enter-trap] "The code pushes the trap square itself and walks through it on the shown input." — feedback: It explicitly rejects T; the mistake is expanding from safe-looking draft squares.
- ✅ [expand-from-draft] "At (1,2) the code keeps exploring even though trap (2,2) is adjacent." — feedback: Correct. Draft squares (1,2) and (2,1) both touch trap (2,2); illegal expansion past them reaches two gold squares.
Graph proof shown in feedback: code rule "Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps." → changed graph "The nine non-wall squares include trap (2,2); the four trap-adjacent draft squares have no outgoing arrows." → boundary "Both routes toward the two gold cells hit draft squares adjacent to trap (2,2) and must stop there." → returned value "The shown code returns 2; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
DFS continues from a draft square
INCORRECT OUTPUT
2
CORRECT OUTPUT
0
Code rule: Every non-wall, non-trap side neighbor is expanded regardless of adjacent traps. → Changed graph: The nine non-wall squares include trap (2,2); the four trap-adjacent draft squares have no outgoing arrows. → Reachable boundary: Both routes toward the two gold cells hit draft squares adjacent to trap (2,2) and must stop there. → Returned value: The shown code returns 2; the real problem returns 0.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```