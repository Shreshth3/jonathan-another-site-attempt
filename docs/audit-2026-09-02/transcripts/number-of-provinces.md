# Number of Provinces (`number-of-provinces`) — original, undirected-graph

## Problem statement (Description tab)

You are given `n` cities. Some pairs of cities are directly connected to each other, and connection is a two-way street: if city `a` is connected to city `b`, then city `b` is connected to city `a`. Cities can also be connected *indirectly* — if `a` connects to `b` and `b` connects to `c`, then `a` and `c` are in the same group even though they have no direct link.

A **province** is a group of cities that are all connected to each other, directly or indirectly, with no connections to any city outside the group.

The connections are described by an `n x n` matrix `isConnected`, where `isConnected[i][j] = 1` means city `i` and city `j` are directly connected, and `isConnected[i][j] = 0` means they are not. Every city is considered connected to itself, so `isConnected[i][i]` is always `1`.

Return the total number of provinces.

### Examples
- Example 1: input `isConnected = [[1,1,0],[1,1,0],[0,0,1]]` → output `2`. Cities 0 and 1 are directly connected, so they form one province. City 2 is on its own, forming a second province.
- Example 2: input `isConnected = [[1,0,0],[0,1,0],[0,0,1]]` → output `3`. No city is connected to any other, so each of the 3 cities is its own province.
- Example 3: input `isConnected = [[1,0,0,1],[0,1,1,0],[0,1,1,1],[1,0,1,1]]` → output `1`. City 0 connects to city 3, city 3 connects to city 2, and city 2 connects to city 1 — so every city ends up in one big province.

### Graph rules (authored)
- Nodes: Cities 0, 1, 2, and 3—one node for each row and column.
- Edges: For i ≠ j, a `1` at `[i][j]` means one two-way road i—j; ignore diagonal self-entries.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-two`, facet "province count")
Raw input shown:
```
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Cities 0 and 1 form one province; city 2 forms another.
- ❌ [near-miss] "1"
    feedback: That result follows the connect through diagonal ones bug, not the exact picture. (misconception: connect-through-diagonal-ones)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
"Why" shown after success: Cities 0 and 1 form one province; city 2 forms another.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-isolated`, facet "all cities")
Raw input shown:
```
isConnected = [[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Each city exists even when it connects only to itself in the matrix.
- ❌ [near-miss] "0"
    feedback: That result follows the ignore diagonal only cities bug, not the exact picture. (misconception: ignore-diagonal-only-cities)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: none
"Why" shown after success: Each city exists even when it connects only to itself in the matrix.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact matrix")
Raw input shown:
```
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2
2. Picture B / 0 / 1 / 2
3. Picture C / 0 / 1 / 2
4. Picture D / 0 / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: none
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1 · edges: 0—1
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "all cities")
Raw input shown:
```
For a 4×4 `isConnected` matrix, what should the graph nodes be?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For a 4×4 isConnected matrix, what should the graph nodes be?**
Choices as displayed (top to bottom):
1. A / Cities 0, 1, 2, and 3—one node for each row and column.
2. B / One node for every 1 entry in the matrix.
3. C / One node for each connected province visible in the matrix.
4. D / Only cities that have an off-diagonal 1 connecting them to another city.
Answer key + feedback per choice (data):
- ✅ CORRECT [four-cities] "Cities 0, 1, 2, and 3—one node for each row and column."
    feedback: Correct. The matrix dimensions define all city nodes.
- ❌ [ones] "One node for every `1` entry in the matrix."
    feedback: A 1 describes a relationship between city nodes; it is not a new city. (misconception: matrix-entry-as-node)
- ❌ [provinces] "One node for each connected province visible in the matrix."
    feedback: Provinces are the components found after building the city graph. (misconception: province-as-node)
- ❌ [off-diagonal] "Only cities that have an off-diagonal `1` connecting them to another city."
    feedback: A city with only its diagonal 1 still exists and forms a province by itself. (misconception: drop-isolated-city)
"Why" shown after success: Correct. The matrix dimensions define all city nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-chain`, facet "symmetric city links")
Raw input shown:
```
isConnected = [[1,1,0],[1,1,1],[0,1,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. City 1 joins cities 0 and 2 into one province.
- ❌ [near-miss] "2"
    feedback: That result follows the count direct groups only bug, not the exact picture. (misconception: count-direct-groups-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
"Why" shown after success: City 1 joins cities 0 and 2 into one province.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "symmetric city links")
Raw input shown:
```
How should matrix values create roads between city nodes?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should matrix values create roads between city nodes?**
Choices as displayed (top to bottom):
1. A / Draw a self-loop at every city because every diagonal entry is 1.
2. B / Draw a separate arrow i→j for every 1, including a second reverse arrow from the mirrored entry.
3. C / Also draw a direct road i—k whenever i connects to j and j connects to k.
4. D / For i ≠ j, a 1 at [i][j] means one two-way road i—j; ignore diagonal self-entries.
Answer key + feedback per choice (data):
- ✅ CORRECT [off-diagonal-one] "For i ≠ j, a `1` at `[i][j]` means one two-way road i—j; ignore diagonal self-entries."
    feedback: Correct. The symmetric matrix describes undirected city links.
- ❌ [self-loops] "Draw a self-loop at every city because every diagonal entry is 1."
    feedback: The diagonal only says a city reaches itself. It is not a road that changes connectivity. (misconception: draw-diagonal-self-loops)
- ❌ [directed-cells] "Draw a separate arrow i→j for every 1, including a second reverse arrow from the mirrored entry."
    feedback: The matrix is symmetric and represents one undirected road per city pair. (misconception: double-directed-matrix)
- ❌ [transitive-road] "Also draw a direct road i—k whenever i connects to j and j connects to k."
    feedback: That creates a shortcut not present in the matrix. i and k have a path, not necessarily a road. (misconception: add-transitive-road)
"Why" shown after success: Correct. The symmetric matrix describes undirected city links.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "province count")
Raw input shown:
```
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For matrix [[1,1,0],[1,1,0],[0,0,1]], how many provinces are shown?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 3
3. C / 2
4. D / 5
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2"
    feedback: Correct: cities {0,1} and isolated city {2}.
- ❌ [one] "1"
    feedback: City 2 has no road to cities 0 or 1. (misconception: ignore-isolated-city)
- ❌ [three] "3"
    feedback: Cities 0 and 1 share a road and form one province. (misconception: count-cities)
- ❌ [five] "5"
    feedback: Matrix 1s are not provinces. (misconception: count-ones)
"Why" shown after success: Correct: cities {0,1} and isolated city {2}.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-single`, facet "all cities")
Raw input shown:
```
isConnected = [[1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The city itself is one province.
- ❌ [near-miss] "0"
    feedback: That result follows the count only off diagonal edges bug, not the exact picture. (misconception: count-only-off-diagonal-edges)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: The city itself is one province.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "province count")
Raw input shown:
```
isConnected = [[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the province count for a 3×3 identity matrix?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 0
3. C / 9
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct. Every city is isolated from the others.
- ❌ [one] "1"
    feedback: Diagonal 1s do not connect different cities. (misconception: diagonal-connects-all)
- ❌ [zero] "0"
    feedback: An isolated city is still a one-city province. (misconception: require-road-for-province)
- ❌ [nine] "9"
    feedback: Matrix cells are not city groups. (misconception: count-matrix-cells)
"Why" shown after success: Correct. Every city is isolated from the others.
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
isConnected = [[1,0,0],[0,1,1],[0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. City 0 is separate from the connected pair 1–2.; ❌ "1" — That result follows the merge all matrix rows bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [ones]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Cities 0, 1, 2, and 3—one node for each row and column.
Your choice: A 1 describes a relationship between city nodes; it is not a new city.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
isConnected = [[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "3" — Correct. Cities 2 and 3 are isolated but each forms a province.; ❌ "1" — That result follows the build only cities with off diagonal one bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [self-loops]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
For i ≠ j, a 1 at [i][j] means one two-way road i—j; ignore diagonal self-entries.
Your choice: The diagonal only says a city reaches itself. It is not a road that changes connectivity.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
isConnected = [[1,1],[1,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. The two symmetric 1s describe one undirected city connection.; ❌ "2" — That result follows the count mirrored entries as two components bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: City 2 has no road to cities 0 or 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
isConnected = [[1,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. The four links form one connected cycle.; ❌ "2" — That result follows the split cycle into pairs bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—3, 1—2, 2—3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Diagonal 1s do not connect different cities.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
isConnected = [[1,1,0],[1,1,1],[0,1,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Different rows can still belong to one transitive province.; ❌ "2" — That result follows the count distinct adjacency rows bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Road direction invented"; authored goal, NOT shown to student: "Write a road pair opposite the trip needed from the chosen city.")
Everything the student sees (text):
```
E
Evan's broken search

Evan allows each two-way link to work only in its written order.

Your main goal: Expose Evan's mistake. Draw two graphs: first the correct graph, then Evan's graph using the mistake.

CHOOSE THE PROVINCE SEED CITY
province seed city
OUTPUT
CORRECT OUTPUT
EVAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose province seed city
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
2 · Evan's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROVINCE SEED CITY / province seed city", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EVAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1`; ❌ curly braces → `{0,1}`; ❌ quoted numbers/strings → `["0","1"]`; ❌ reversed order → `[1,0]`; ✅ spaces inside brackets → `[ 0 , 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
EVAN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong city surveyed"; authored goal, NOT shown to student: "Select a city other than the first label and place it in another province.")
Everything the student sees (text):
```
R
Riley's broken search

Riley ignores the chosen province seed city and uses a different one.

Your main goal: Expose Riley's mistake. Draw two graphs: first the correct graph, then Riley's graph using the mistake.

CHOOSE THE PROVINCE SEED CITY
province seed city
OUTPUT
CORRECT OUTPUT
RILEY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose province seed city
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
2 · Riley's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROVINCE SEED CITY / province seed city", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | RILEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 1—2 · start 0
Grader's expected answers: correct output `[0]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
RILEY'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `skip-leaf-edges` (authored level "Small city cut off"; authored goal, NOT shown to student: "Attach degree-one cities that still belong to their province.")
Everything the student sees (text):
```
J
Jack's broken search

Jack erases the outer leaves before searching.

Your main goal: Expose Jack's mistake. Draw two graphs: first the correct graph, then Jack's graph using the mistake.

CHOOSE THE PROVINCE SEED CITY
province seed city
OUTPUT
CORRECT OUTPUT
JACK’S OUTPUT
Drawing 1 of 2: Correct graph · Choose province seed city
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
2 · Jack's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROVINCE SEED CITY / province seed city", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JACK’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JACK'S OUTPUT
[0]
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
isConnected = [[1,1,0],[1,1,1],[0,1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each connected province visible in the matrix.”"
    feedback if wrong: Provinces are the components found after building the city graph. Correct node rule: One node for each matrix row and column index.
- [YES is correct] (direct-vs-reach) "2 can reach 0 through 1, but the graph still has no direct 2—0 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Provinces are the components found after building the city graph. Correct node rule: One node for each matrix row and column index.
×
Right. A multi-step route through 1 creates reachability, not a new direct edge.
×
1 has 2 direct neighbors.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cities that have an off-diagonal `1` connecting them to another city.”"
    feedback if wrong: A city with only its diagonal 1 still exists and forms a province by itself. Correct node rule: One node for each matrix row and column index.
- [NO is correct] (direct-vs-reach) "The correct graph has 0—1 and 1—2, so it should also contain a direct 0—2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 2 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
A city with only its diagonal 1 still exists and forms a province by itself. Correct node rule: One node for each matrix row and column index.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
2 has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—1 and 1—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 0 direct neighbors."
    feedback if wrong: 0 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for every `1` entry in the matrix.”"
    feedback if wrong: A 1 describes a relationship between city nodes; it is not a new city. Correct node rule: One node for each matrix row and column index.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
✓
Edge direction matches
```
Result: PASSED

### S3 Q2
Raw input shown:
```
isConnected = [[1,0,0],[0,1,1],[0,1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—2
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1—2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only cities that have an off-diagonal `1` connecting them to another city.”"
    feedback if wrong: A city with only its diagonal 1 still exists and forms a province by itself. Correct node rule: One node for each matrix row and column index.
Result: PASSED

### S3 Q3
Raw input shown:
```
isConnected = [[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
- [YES is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each connected province visible in the matrix.”"
    feedback if wrong: Provinces are the components found after building the city graph. Correct node rule: One node for each matrix row and column index.
Result: PASSED

### S3 Q4
Raw input shown:
```
isConnected = [[1,1],[1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for every `1` entry in the matrix.”"
    feedback if wrong: A 1 describes a relationship between city nodes; it is not a new city. Correct node rule: One node for each matrix row and column index.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
isConnected = [[1,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—3, 1—2, 2—3
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only cities that have an off-diagonal `1` connecting them to another city.”"
    feedback if wrong: A city with only its diagonal 1 still exists and forms a province by itself. Correct node rule: One node for each matrix row and column index.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—3 and 3—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Only city 0's province is counted
Input shown:
```
REAL PROBLEM INPUT
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findCircleNum(isConnected) {
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const city = stack.pop();
    for (let next = 0; next < isConnected.length; next++) {
      if (isConnected[city][next] === 1 && !visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size > 0 ? 1 : 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "city 0", "city 1", "city 2" · edges: city 0—city 1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of provinces" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A It never starts a search from an unvisited city after city 0's component ends.
- B Diagonal 1 entries should each add another province for the shown graph.
- C The matrix should be read as one-way roads, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [first-province-only] "It never starts a search from an unvisited city after city 0's component ends." — feedback: Correct. Isolated city 2 is a second province.
- ❌ [self-loops] "Diagonal 1 entries should each add another province for the shown graph." — feedback: No. They say each city connects to itself; they do not create extra components.
- ❌ [matrix-directed] "The matrix should be read as one-way roads, changing this input's returned value." — feedback: No. Friendship is mutual and the matrix is symmetric.
Graph proof shown in feedback: code rule "Exactly one DFS starts, from city 0, and the function always reports one found group." → changed graph "Cities 0 and 1 form one component; isolated city 2 forms another." → boundary "A valid province is disconnected from city 0." → returned value "The second component is never counted, so 1 is returned instead of 2."
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
About your diagnosis: No. They say each city connects to itself; they do not create extra components.
Code rule: Exactly one DFS starts, from city 0, and the function always reports one found group. → Changed graph: Cities 0 and 1 form one component; isolated city 2 forms another. → Reachable boundary: A valid province is disconnected from city 0.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only city 0's province is counted
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Exactly one DFS starts, from city 0, and the function always reports one found group. → Changed graph: Cities 0 and 1 form one component; isolated city 2 forms another. → Reachable boundary: A valid province is disconnected from city 0. → Returned value: The second component is never counted, so 1 is returned instead of 2.
```

### S4 case 2 — `build-isolated` · bug: Only city 0's province is counted
Input shown:
```
REAL PROBLEM INPUT
isConnected = [[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findCircleNum(isConnected) {
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const city = stack.pop();
    for (let next = 0; next < isConnected.length; next++) {
      if (isConnected[city][next] === 1 && !visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size > 0 ? 1 : 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of provinces" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Diagonal 1 entries should each add another province for the shown graph.
- B It never starts a search from an unvisited city after city 0's component ends.
- C The matrix should be read as one-way roads, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [first-province-only] "It never starts a search from an unvisited city after city 0's component ends." — feedback: Correct. Cities 0,1,2 have no off-diagonal friendship edges, so all three are separate provinces; searching only from city 0 counts one. Therefore the shown code returns 1, while the real problem returns 3.
- ❌ [self-loops] "Diagonal 1 entries should each add another province for the shown graph." — feedback: No. They say each city connects to itself; they do not create extra components.
- ❌ [matrix-directed] "The matrix should be read as one-way roads, changing this input's returned value." — feedback: No. Friendship is mutual and the matrix is symmetric.
Graph proof shown in feedback: code rule "Exactly one DFS starts, from city 0, and the function always reports one found group." → changed graph "Nodes: 0, 1, 2. Direct edges: none." → boundary "Cities 0,1,2 have no off-diagonal friendship edges, so all three are separate provinces; searching only from city 0 counts one." → returned value "The shown code returns 1; the source-repo reference solution returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only city 0's province is counted
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: Exactly one DFS starts, from city 0, and the function always reports one found group. → Changed graph: Nodes: 0, 1, 2. Direct edges: none. → Reachable boundary: Cities 0,1,2 have no off-diagonal friendship edges, so all three are separate provinces; searching only from city 0 counts one. → Returned value: The shown code returns 1; the source-repo reference solution returns 3.
```

### S4 case 3 — `remedial-1` · bug: Only city 0's province is counted
Input shown:
```
REAL PROBLEM INPUT
isConnected = [[1,0,0],[0,1,1],[0,1,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findCircleNum(isConnected) {
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const city = stack.pop();
    for (let next = 0; next < isConnected.length; next++) {
      if (isConnected[city][next] === 1 && !visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size > 0 ? 1 : 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of provinces" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A Diagonal 1 entries should each add another province for the shown graph.
- B The matrix should be read as one-way roads, changing this input's returned value.
- C It never starts a search from an unvisited city after city 0's component ends.
Diagnosis answer key + feedback:
- ✅ [first-province-only] "It never starts a search from an unvisited city after city 0's component ends." — feedback: Correct. City 0 is one province and edge 1—2 forms a second; the single DFS from 0 never starts inside component {1,2}. Therefore the shown code returns 1, while the real problem returns 2.
- ❌ [self-loops] "Diagonal 1 entries should each add another province for the shown graph." — feedback: No. They say each city connects to itself; they do not create extra components.
- ❌ [matrix-directed] "The matrix should be read as one-way roads, changing this input's returned value." — feedback: No. Friendship is mutual and the matrix is symmetric.
Graph proof shown in feedback: code rule "Exactly one DFS starts, from city 0, and the function always reports one found group." → changed graph "Nodes: 0, 1, 2. Direct edges: 1—2." → boundary "City 0 is one province and edge 1—2 forms a second; the single DFS from 0 never starts inside component {1,2}." → returned value "The shown code returns 1; the source-repo reference solution returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only city 0's province is counted
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Exactly one DFS starts, from city 0, and the function always reports one found group. → Changed graph: Nodes: 0, 1, 2. Direct edges: 1—2. → Reachable boundary: City 0 is one province and edge 1—2 forms a second; the single DFS from 0 never starts inside component {1,2}. → Returned value: The shown code returns 1; the source-repo reference solution returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```