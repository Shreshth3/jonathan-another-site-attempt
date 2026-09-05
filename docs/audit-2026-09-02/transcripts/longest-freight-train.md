# Longest Freight Train (`longest-freight-train`) — variant, grid

## Problem statement (Description tab)

A rail yard is shown as a grid. `yard[r][c]` is `"T"` if a train car sits on that square and `"."` if the square is empty track.

Each **train** is a straight line of one or more cars, laid out either **horizontally** (all in one row) or **vertically** (all in one column), and always exactly one square wide. You are guaranteed the yard is valid: **no two different trains touch each other**, not even at a corner — there is always at least one empty square between them.

Write a function `longestTrain(yard)` that returns the number of cars in the **longest** train. If the yard has no train cars at all, return `0`.

### Examples
- Example 1: input `yard = [["T","T","T","."],[".",".",".","."],["T",".",".","T"],["T",".",".","."]]` → output `3`. There are three trains: a horizontal one with 3 cars in the top row, a vertical one with 2 cars on the left, and a single 1-car train at (2,3). The longest has 3 cars.
- Example 2: input `yard = [["T","."],[".","."],["T","."]]` → output `1`. There are two separate trains, each with just 1 car (they do not touch, so they cannot be one train). The longest has 1 car.

### Graph rules (authored)
- Nodes: Each grid cell containing `T`; empty `.` cells are not nodes.
- Edges: Their T cells share one side: up, down, left, or right.
- Node-name format shown in Step 1/3: Name each cell `(row,column)`, starting both numbers at 0. Example: `(0,2)`. Do not add spaces or the cell value. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `coordinate` — Use grid coordinates like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact train cars")
Raw input shown:
```
yard=["T..","...","..T"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is the longest train length?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The longest valid straight train contains 1 car.
- ❌ [bug] "2"
    feedback: This adds cars from separate trains instead of taking the longest one. (misconception: sum-separate-trains)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
"Why" shown after success: The longest valid straight train contains 1 car.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "cell identity")
Raw input shown:
```
yard=["TTT","...",".T."]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is the longest train length?**
Choices as displayed (top to bottom):
1. 4
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The longest valid straight train contains 3 cars.
- ❌ [bug] "4"
    feedback: This adds cars from separate trains instead of taking the longest one. (misconception: sum-separate-trains)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(2,1)" · edges: (0,0)—(0,1), (0,1)—(0,2)
"Why" shown after success: The longest valid straight train contains 3 cars.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact train cars")
Raw input shown:
```
yard=["T..","...","..T"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (2,2)
2. Picture C / (0,0) / (2,2) / (1,1)
3. Picture D / (0,0)
4. Picture A / (0,0) / (2,2)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: (0,0), (2,2) · edges: none
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: (0,0), (2,2) · edges: (0,0)—(2,2)
    feedback: This invents a diagonal connection between distant train cars. (misconception: connect-distant-cars)
- ❌ [wrong-relation] "Picture C" — picture: UNDIRECTED · nodes: (0,0), (2,2), (1,1) · edges: none
    feedback: This adds an empty yard square as a train car. (misconception: include-empty-square)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: (0,0) · edges: none
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-3`, facet "side adjacency")
Raw input shown:
```
yard=["T...T","....T","....."]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is the longest train length?**
Choices as displayed (top to bottom):
1. 2
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The longest valid straight train contains 2 cars.
- ❌ [bug] "3"
    feedback: This adds cars from separate trains instead of taking the longest one. (misconception: sum-separate-trains)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,4)" · edges: (0,4)—(1,4)
"Why" shown after success: The longest valid straight train contains 2 cars.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-node`, facet "cell identity")
Raw input shown:
```
yard = [["T",".",".","T","T"],["T",".",".",".","."],["T",".","T",".","."],[".",".",".",".","."]]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node when the rail yard becomes a graph?**
Choices as displayed (top to bottom):
1. A / Each completed train, no matter how many cars it contains.
2. B / Every yard cell, allowing movement through empty track space.
3. C / Only T cells that have another T directly left or right.
4. D / Each grid cell containing T; empty . cells are not nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [train-cars] "Each grid cell containing `T`; empty `.` cells are not nodes."
    feedback: Correct. A train is one connected component of T-cell nodes.
- ❌ [whole-train] "Each completed train, no matter how many cars it contains."
    feedback: Train size is found by counting its connected car nodes, so a whole train cannot start as one node. (misconception: component-as-node)
- ❌ [all-yard] "Every yard cell, allowing movement through empty track space."
    feedback: Empty cells separate trains. Making them passable would merge different trains. (misconception: empty-passable)
- ❌ [straight-cars] "Only T cells that have another T directly left or right."
    feedback: Vertical cars and isolated one-car trains are valid and must be represented. (misconception: horizontal-only-nodes)
"Why" shown after success: Correct. A train is one connected component of T-cell nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-4`, facet "maximum component size")
Raw input shown:
```
yard=["T"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is the longest train length?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The longest valid straight train contains 1 car.
- ❌ [bug] "0"
    feedback: This counts links instead of car nodes, giving one less on a straight train. (misconception: count-edges)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The longest valid straight train contains 1 car.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-edge`, facet "side adjacency")
Raw input shown:
```
yard = [["T",".",".","T","T"],["T",".",".",".","."],["T",".","T",".","."],[".",".",".",".","."]]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When are two train-car nodes directly connected?**
Choices as displayed (top to bottom):
1. A / Their T cells touch at a side or a diagonal corner.
2. B / They appear anywhere in the same row, even with dots between them.
3. C / Only horizontal T neighbors; vertical neighbors belong to separate trains.
4. D / Their T cells share one side: up, down, left, or right.
Answer key + feedback per choice (data):
- ✅ CORRECT [side-touch] "Their T cells share one side: up, down, left, or right."
    feedback: Correct. Side-connected car cells make one train.
- ❌ [diagonal] "Their T cells touch at a side or a diagonal corner."
    feedback: Corner contact does not join cars in this yard. (misconception: allow-diagonal)
- ❌ [same-row] "They appear anywhere in the same row, even with dots between them."
    feedback: An empty gap splits trains. Cars must be immediate neighbors. (misconception: bridge-gap)
- ❌ [orientation] "Only horizontal T neighbors; vertical neighbors belong to separate trains."
    feedback: The rule includes up and down, so vertical train segments connect too. (misconception: horizontal-only-edges)
"Why" shown after success: Correct. Side-connected car cells make one train.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "maximum component size")
Raw input shown:
```
yard=["T..","T.T","..T","..T"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **This yard has two vertical trains. What longest train length is returned?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 5
3. C / 3
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct: the right column contains a vertical run of three cars.
- ❌ [two] "2"
    feedback: This returns the first train found and never compares the later run. (misconception: return-first-component)
- ❌ [five] "5"
    feedback: This sums cars from two disconnected vertical trains. (misconception: sum-components)
- ❌ [one] "1"
    feedback: This fails to continue from a car to its vertical neighbor. (misconception: no-recursion)
"Why" shown after success: Correct: the right column contains a vertical run of three cars.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "maximum component size")
Raw input shown:
```
yard=["TTT.","....",".TTT"]
```
Node-name guide shown: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What longest train length is returned?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 6
3. C / 2
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct. Each separate run has length 3, so the maximum is 3.
- ❌ [six] "6"
    feedback: This adds separate trains instead of taking their maximum. (misconception: sum-components)
- ❌ [two] "2"
    feedback: This counts links between three cars instead of counting the cars. (misconception: count-edges)
- ❌ [one] "1"
    feedback: This marks neighbors visited without adding their sizes. (misconception: visited-without-aggregation)
"Why" shown after success: Correct. Each separate run has length 3, so the maximum is 3.
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
Your choice: This invents a diagonal connection between distant train cars.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every detail"
Remedial raw input:
```
yard=["TTT"]
```
Remedial question: **What is the longest train length?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. The longest valid straight train contains 3 cars.; ❌ "2" — This counts links instead of car nodes, giving one less on a straight train.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [whole-train]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each grid cell containing T; empty . cells are not nodes.
Your choice: Train size is found by counting its connected car nodes, so a whole train cannot start as one node.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
yard=["T.","..",".T"]
```
Remedial question: **What is the longest train length?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. The longest valid straight train contains 1 car.; ❌ "2" — This adds cars from separate trains instead of taking the longest one.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,1)" · edges: none
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [diagonal]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Their T cells share one side: up, down, left, or right.
Your choice: Corner contact does not join cars in this yard.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
yard=["T...T","T...T","T...."]
```
Remedial question: **What is the longest train length?** · choices shown: 3 | 5
Remedial answer key: ✅ "3" — Correct. The longest valid straight train contains 3 cars.; ❌ "5" — This adds cars from separate trains instead of taking the longest one.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,0)", "(1,4)", "(2,0)" · edges: (0,0)—(1,0), (0,4)—(1,4), (1,0)—(2,0)
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This returns the first train found and never compares the later run.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
yard=[".T.",".T.",".T."]
```
Remedial question: **What is the longest train length?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. The longest valid straight train contains 3 cars.; ❌ "2" — This counts links instead of car nodes, giving one less on a straight train.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,1)", "(2,1)" · edges: (0,1)—(1,1), (1,1)—(2,1)
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This adds separate trains instead of taking their maximum.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
yard=["T..","...","..T"]
```
Remedial question: **What is the longest train length?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. The longest valid straight train contains 1 car.; ❌ "2" — This adds cars from separate trains instead of taking the longest one.
Remedial required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Wrong train selected"; authored goal, NOT shown to student: "Use two valid separated trains, and choose a start car that is not listed first.")
Everything the student sees (text):
```
D
Devin's broken search

Devin uses the wrong first train car.

Your main goal: Expose Devin's mistake. Draw two graphs: first the correct graph, then Devin's graph using the mistake.

CHOOSE THE FIRST TRAIN CAR
first train car
OUTPUT
CORRECT OUTPUT
DEVIN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first train car
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
2 · Devin's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST TRAIN CAR / first train car", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | DEVIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("(0,0)", "(2,2)"): REJECTED with "Also draw (0,1), the wrong first train car used by the broken search."
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
DEVIN'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Last coupling skipped"; authored goal, NOT shown to student: "Make the final listed side coupling necessary to reach the end of one straight train.")
Everything the student sees (text):
```
J
Jada's broken search

Jada stops reading one relation too early and drops the final edge.

Your main goal: Expose Jada's mistake. Draw two graphs: first the correct graph, then Jada's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST TRAIN CAR
first train car
OUTPUT
CORRECT OUTPUT
JADA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first train car
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
2 · Jada's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST TRAIN CAR / first train car", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JADA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
JADA'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Long freight line"; authored goal, NOT shown to student: "Build a train longer than one hop from its first car.")
Everything the student sees (text):
```
J
Jesse's broken search

Jesse visits only the start and its direct neighboring squares.

Your main goal: Expose Jesse's mistake. Draw two graphs: first the correct graph, then Jesse's graph using the mistake.

CHOOSE THE FIRST TRAIN CAR
first train car
OUTPUT
CORRECT OUTPUT
JESSE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first train car
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
2 · Jesse's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST TRAIN CAR / first train car", placeholder "Example: (0,0)", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JESSE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,0)—(0,1), (0,1)—(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,0)—(0,1), (0,1)—(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)"]
JESSE'S OUTPUT
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
yard=["T.","..",".T"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,1)" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "(0,0) has exactly 1 direct neighbor."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each completed train, no matter how many cars it contains.”"
    feedback if wrong: Train size is found by counting its connected car nodes, so a whole train cannot start as one node. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (2,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,1).
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
(0,0) has 0 direct neighbors.
×
Train size is found by counting its connected car nodes, so a whole train cannot start as one node. Correct node rule: Each grid cell containing
T
; empty
.
cells are not nodes.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,1).
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Every yard cell, allowing movement through empty track space.”"
    feedback if wrong: Empty cells separate trains. Making them passable would merge different trains. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (2,1), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,1).
- [NO is correct] (local-degree) "(2,1) has exactly 1 direct neighbor."
    feedback if wrong: (2,1) has 0 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Empty cells separate trains. Making them passable would merge different trains. Correct node rule: Each grid cell containing
T
; empty
.
cells are not nodes.
×
Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,1).
×
(2,1) has 0 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between (0,0) and (2,1); merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "(0,0) has exactly 0 direct neighbors."
    feedback if wrong: (0,0) has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only T cells that have another T directly left or right.”"
    feedback if wrong: Vertical cars and isolated one-car trains are valid and must be represented. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
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
Each grid cell containing T; empty . cells are not nodes.
EDGES
Their T cells share one side: up, down, left, or right.
LABELS
Use only row and column numbers. Rows and columns start at 0. Both (0,2) and 0,2 work. Do not include the cell value.
```
Result: PASSED

### S3 Q2
Raw input shown:
```
yard=["T...T","T...T","T...."]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,0)", "(1,4)", "(2,0)" · edges: (0,0)—(1,0), (0,4)—(1,4), (1,0)—(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every yard cell, allowing movement through empty track space.”"
    feedback if wrong: Empty cells separate trains. Making them passable would merge different trains. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(2,0) can reach (0,0) through (1,0), but the graph still has no direct (2,0)—(0,0) edge."
    feedback if wrong: Right. A multi-step route through (1,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,4) has exactly 1 direct neighbor."
    feedback if wrong: (0,4) has 1 direct neighbor.
Result: PASSED

### S3 Q3
Raw input shown:
```
yard=[".T.",".T.",".T."]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,1)", "(1,1)", "(2,1)" · edges: (0,1)—(1,1), (1,1)—(2,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(0,1) has exactly 1 direct neighbor."
    feedback if wrong: (0,1) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each completed train, no matter how many cars it contains.”"
    feedback if wrong: Train size is found by counting its connected car nodes, so a whole train cannot start as one node. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
- [YES is correct] (direct-vs-reach) "(0,1) can reach (2,1) through (1,1), but the graph still has no direct (0,1)—(2,1) edge."
    feedback if wrong: Right. A multi-step route through (1,1) creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
yard=["T..","...","..T"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(2,2)" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "(0,0) can reach (2,2), so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (2,2).
- [NO is correct] (local-degree) "(2,2) has exactly 1 direct neighbor."
    feedback if wrong: (2,2) has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only T cells that have another T directly left or right.”"
    feedback if wrong: Vertical cars and isolated one-car trains are valid and must be represented. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
Result: PASSED

### S3 Q5
Raw input shown:
```
yard=["TTT"]
```
Node-name guide: Required node-name format: Name each cell (row,column), starting both numbers at 0. Example: (0,2). Do not add spaces or the cell value. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)" · edges: (0,0)—(0,1), (0,1)—(0,2)
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "(0,0) can reach (0,2) through (0,1), but the graph still has no direct (0,0)—(0,2) edge."
    feedback if wrong: Right. A multi-step route through (0,1) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,1) has exactly 2 direct neighbors."
    feedback if wrong: (0,1) has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every yard cell, allowing movement through empty track space.”"
    feedback if wrong: Empty cells separate trains. Making them passable would merge different trains. Correct node rule: Each grid cell containing `T`; empty `.` cells are not nodes.
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

### S4 case 1 — `authored-deep-case` · bug: Returns the first train instead of the longest
Input shown:
```
REAL PROBLEM INPUT
yard: [["T", ".", "T", "T"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.yard;
  const visited = new Set();
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return 0;
    }
    if (grid[row][column] !== "T" || visited.has(key)) {
      return 0;
    }
    visited.add(key);
    let trainSize = 1;
    for (const [rowChange, columnChange] of directions) {
      trainSize += size(row + rowChange, column + columnChange);
    }
    return trainSize;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "T") {
        return size(row, column);
      }
    }
  }
  return 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,2)", "(0,3)" · edges: (0,2)—(0,3)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "longest train length" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The scan returns as soon as it finds the first train, so it never compares later component sizes.
- B The move list joins train cars that touch only at a corner, which changes the returned value here.
- C The size function counts dot cells as train cars, which changes how the shown graph is evaluated.
Diagnosis answer key + feedback:
- ✅ [first-train-return] "The scan returns as soon as it finds the first train, so it never compares later component sizes." — feedback: Correct. The first train has length 1, while the later train has length 2.
- ❌ [diagonal-cars] "The move list joins train cars that touch only at a corner, which changes the returned value here." — feedback: The move list has only four side directions, and this yard has no diagonal contact.
- ❌ [counts-water] "The size function counts dot cells as train cars, which changes how the shown graph is evaluated." — feedback: It returns 0 immediately for every dot.
Graph proof shown in feedback: code rule "The outer scan returns the size of its first T component immediately." → changed graph "Node (0,0) is a one-car component; nodes (0,2) and (0,3) form a separate two-car component." → boundary "The first component is smaller than a later component." → returned value "The code returns 1 without discovering the true longest length 2."
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
About your diagnosis: The move list has only four side directions, and this yard has no diagonal contact.
Code rule: The outer scan returns the size of its first T component immediately. → Changed graph: Node (0,0) is a one-car component; nodes (0,2) and (0,3) form a separate two-car component. → Reachable boundary: The first component is smaller than a later component.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns the first train instead of the longest
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: The outer scan returns the size of its first T component immediately. → Changed graph: Node (0,0) is a one-car component; nodes (0,2) and (0,3) form a separate two-car component. → Reachable boundary: The first component is smaller than a later component. → Returned value: The code returns 1 without discovering the true longest length 2.
```

### S4 case 2 — `case-3` · bug: Returns the first train instead of the longest
Input shown:
```
REAL PROBLEM INPUT
yard=["T...T","....T","....."]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.yard;
  const visited = new Set();
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return 0;
    }
    if (grid[row][column] !== "T" || visited.has(key)) {
      return 0;
    }
    visited.add(key);
    let trainSize = 1;
    for (const [rowChange, columnChange] of directions) {
      trainSize += size(row + rowChange, column + columnChange);
    }
    return trainSize;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "T") {
        return size(row, column);
      }
    }
  }
  return 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,4)", "(1,4)" · edges: (0,4)—(1,4)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "longest train length" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The move list joins train cars that touch only at a corner, which changes the returned value here.
- B The scan returns as soon as it finds the first train, so it never compares later component sizes.
- C The size function counts dot cells as train cars, which changes how the shown graph is evaluated.
Diagnosis answer key + feedback:
- ✅ [first-train-return] "The scan returns as soon as it finds the first train, so it never compares later component sizes." — feedback: Exactly. The outer scan returns the size of its first T component immediately. The shown code returns 1; the real problem returns 2.
- ❌ [diagonal-cars] "The move list joins train cars that touch only at a corner, which changes the returned value here." — feedback: The move list has only four side directions, and this yard has no diagonal contact.
- ❌ [counts-water] "The size function counts dot cells as train cars, which changes how the shown graph is evaluated." — feedback: It returns 0 immediately for every dot.
Graph proof shown in feedback: code rule "The outer scan returns the size of its first T component immediately." → changed graph "Nodes are (0,0), (0,4), (1,4); direct edges are (0,4)—(1,4)." → boundary "first-component-only" → returned value "The shown code returns 1; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns the first train instead of the longest
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: The outer scan returns the size of its first T component immediately. → Changed graph: Nodes are (0,0), (0,4), (1,4); direct edges are (0,4)—(1,4). → Reachable boundary: first-component-only → Returned value: The shown code returns 1; the real problem returns 2.
```

### S4 case 3 — `two-car-first-four-car-later` · bug: Returns the first train instead of the longest
Input shown:
```
REAL PROBLEM INPUT
yard: [["T", "T", ".", ".", "."], [".", ".", ".", ".", "."], [".", "T", "T", "T", "."], [".", "T", ".", ".", "."]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const grid = input.yard;
  const visited = new Set();
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function size(row, column) {
    const key = row + "," + column;
    if (
      row < 0 ||
      column < 0 ||
      row >= grid.length ||
      column >= grid[0].length
    ) {
      return 0;
    }
    if (grid[row][column] !== "T" || visited.has(key)) {
      return 0;
    }
    visited.add(key);
    let trainSize = 1;
    for (const [rowChange, columnChange] of directions) {
      trainSize += size(row + rowChange, column + columnChange);
    }
    return trainSize;
  }
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (grid[row][column] === "T") {
        return size(row, column);
      }
    }
  }
  return 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "(0,0)", "(0,1)", "(2,1)", "(2,2)", "(2,3)", "(3,1)" · edges: (0,0)—(0,1), (2,1)—(2,2), (2,2)—(2,3), (2,1)—(3,1)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "longest train length" · expected buggy output `2` · real correct output `4`
Diagnosis choices as displayed:
- A The move list merges the two trains diagonally.
- B The size helper adds dot cells to the first train.
- C The row scan returns the first two-car component before it discovers the later four-car component.
Diagnosis answer key + feedback:
- ✅ [first-train-return] "The row scan returns the first two-car component before it discovers the later four-car component." — feedback: Correct. The top train has 2 cars; the lower train has 4.
- ❌ [diagonal-cars] "The move list merges the two trains diagonally." — feedback: The trains do not touch, and the moves contain only four side directions.
- ❌ [counts-water] "The size helper adds dot cells to the first train." — feedback: Dot cells return 0 immediately; the early outer return is the bug.
Graph proof shown in feedback: code rule "The outer loop returns after measuring its first T component." → changed graph "The top edge is a size-2 component; the three lower edges form a size-4 component." → boundary "A later component is twice as large as the first component." → returned value "The code returns 2, while the longest train has length 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns the first train instead of the longest
INCORRECT OUTPUT
2
CORRECT OUTPUT
4
Code rule: The outer loop returns after measuring its first T component. → Changed graph: The top edge is a size-2 component; the three lower edges form a size-4 component. → Reachable boundary: A later component is twice as large as the first component. → Returned value: The code returns 2, while the longest train has length 4.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```