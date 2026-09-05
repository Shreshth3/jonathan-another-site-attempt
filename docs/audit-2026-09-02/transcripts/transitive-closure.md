# Transitive Closure of a Graph (`transitive-closure`) — new, directed-graph

## Problem statement (Description tab)

You are given a directed graph with `n` nodes, numbered `0` to `n - 1`, as an `n x n` matrix `graph`, where `graph[i][j] = 1` means there is a one-way road from node `i` to node `j` (and `0` means there is not).

The TRANSITIVE CLOSURE of the graph answers, for every ordered pair, the question: "can I get from `i` to `j` by following one-way roads?"

Write a function `transitiveClosure(graph)` that returns a new `n x n` matrix `reach`, where `reach[i][j] = 1` if node `j` can be reached from node `i` by following zero or more roads, and `0` otherwise. Every node can reach itself, so `reach[i][i]` is always `1`.

### Examples
- Example 1: input `graph = [[0,1,0],[0,0,1],[0,0,0]]` → output `[[1,1,1],[0,1,1],[0,0,1]]`. Roads: 0 -> 1 and 1 -> 2. From node 0 you reach {0, 1, 2}; from node 1 you reach {1, 2}; from node 2 only {2}.
- Example 2: input `graph = [[0,1,0,0],[1,0,1,0],[0,0,0,1],[0,0,0,0]]` → output `[[1,1,1,1],[1,1,1,1],[0,0,1,1],[0,0,0,1]]`. Nodes 0 and 1 point at each other (a cycle), and 1 -> 2 -> 3. So both 0 and 1 reach everything. Node 2 reaches {2, 3}, and node 3 reaches only itself. The DFS's visited set keeps the 0 <-> 1 loop from recursing forever.

### Graph rules (authored)
- Nodes: Every index 0 through n−1, including isolated nodes.
- Edges: One arrow i → j.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "matrix vertices")
Raw input shown:
```
graph=[[0,1,0],[0,0,1],[0,0,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,1,0],[0,0,1],[0,0,0]]
2. [[1,1,1],[0,1,1],[0,0,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[1,1,1],[0,1,1],[0,0,1]]"
    feedback: Correct. Closure adds self reachability and the path 0→2.
- ❌ [wrong] "[[0,1,0],[0,0,1],[0,0,0]]"
    feedback: That follows the copy direct roads only bug. (misconception: copy-direct-roads-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
"Why" shown after success: Closure adds self reachability and the path 0→2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "vertex identity")
Raw input shown:
```
graph=[[0,1],[0,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[1,1],[0,1]]
2. [[1,1],[1,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[1,1],[0,1]]"
    feedback: Correct. Node 1 cannot travel backward to 0.
- ❌ [wrong] "[[1,1],[1,1]]"
    feedback: That follows the make roads undirected bug. (misconception: make-roads-undirected)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1
"Why" shown after success: Node 1 cannot travel backward to 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "matrix vertices")
Raw input shown:
```
graph=[[0,1,0],[0,0,1],[0,0,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2
2. Picture B / 0 / 1
3. Picture C / 0 / 1 / 2
4. Picture D / 0 / 1 / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: DIRECTED · nodes: 0, 1 · edges: 0→1
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 1→0, 1→2
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-3`, facet "directed road edges")
Raw input shown:
```
graph=[[0,1],[1,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[1,1],[0,1]]
2. [[1,1],[1,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[1,1],[1,1]]"
    feedback: Correct. The two-node cycle makes both nodes mutually reachable.
- ❌ [wrong] "[[1,1],[0,1]]"
    feedback: That follows the miss cycle return bug. (misconception: miss-cycle-return)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1, 1→0
"Why" shown after success: The two-node cycle makes both nodes mutually reachable.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "vertex identity")
Raw input shown:
```
What should be a node in the road graph?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should be a node in the road graph?**
Choices as displayed (top to bottom):
1. A / Every matrix cell containing 1.
2. B / Only indexes whose row contains an outgoing 1.
3. C / Every index 0 through n−1, including isolated nodes.
4. D / Every ordered pair (i,j).
Answer key + feedback per choice (data):
- ✅ CORRECT [indices] "Every index 0 through n−1, including isolated nodes."
    feedback: Right. Every index must also reach itself in the output.
- ❌ [ones] "Every matrix cell containing 1."
    feedback: A 1 describes a road between two indexed nodes. (misconception: uses-matrix-entries-as-nodes)
- ❌ [active] "Only indexes whose row contains an outgoing 1."
    feedback: A node with no outgoing road still exists and reaches itself. (misconception: drops-sinks)
- ❌ [pairs] "Every ordered pair (i,j)."
    feedback: Ordered pairs are output questions about reachability, not graph nodes. (misconception: uses-output-cells-as-nodes)
"Why" shown after success: Right. Every index must also reach itself in the output.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-4`, facet "all reachability")
Raw input shown:
```
graph=[[0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[1]]
2. [[0]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[1]]"
    feedback: Correct. Every node reaches itself with zero roads.
- ❌ [wrong] "[[0]]"
    feedback: That follows the forget self reachability bug. (misconception: forget-self-reachability)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0" · edges: none
"Why" shown after success: Every node reaches itself with zero roads.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "directed road edges")
Raw input shown:
```
What direct edge is encoded by graph[i][j] = 1?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What direct edge is encoded by graph[i][j] = 1?**
Choices as displayed (top to bottom):
1. A / One arrow i → j.
2. B / A two-way connection between i and j.
3. C / One arrow j → i.
4. D / An arrow i → j whenever j is eventually reachable from i.
Answer key + feedback per choice (data):
- ✅ CORRECT [i-j] "One arrow i → j."
    feedback: Right. Row i lists direct destinations from i.
- ❌ [both] "A two-way connection between i and j."
    feedback: Roads are directed unless the reverse matrix entry is also 1. (misconception: makes-roads-undirected)
- ❌ [reverse] "One arrow j → i."
    feedback: That reads the matrix direction backward. (misconception: reverses-matrix)
- ❌ [reachable] "An arrow i → j whenever j is eventually reachable from i."
    feedback: That describes the closure result, not an input edge. (misconception: confuses-path-with-direct-edge)
"Why" shown after success: Right. Row i lists direct destinations from i.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "all reachability")
Raw input shown:
```
graph = [[0,1,0],[0,0,1],[0,0,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For roads 0→1 and 1→2, which reachability matrix is correct?**
Choices as displayed (top to bottom):
1. A / [[0,1,0],[0,0,1],[0,0,0]]
2. B / [[1,1,1],[1,1,1],[1,1,1]]
3. C / [[0,1,1],[0,0,1],[0,0,0]]
4. D / [[1,1,1],[0,1,1],[0,0,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[1,1,1],[0,1,1],[0,0,1]]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[[0,1,0],[0,0,1],[0,0,0]]"
    feedback: Closure includes paths and self-reachability, not only direct roads. (misconception: copies-input-matrix)
- ❌ [wrong-2] "[[1,1,1],[1,1,1],[1,1,1]]"
    feedback: Directed roads do not allow travel backward. (misconception: makes-graph-undirected)
- ❌ [wrong-3] "[[0,1,1],[0,0,1],[0,0,0]]"
    feedback: Every diagonal entry must be 1. (misconception: forgets-self-reachability)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "all reachability")
Raw input shown:
```
graph = [[0,1,0,0],[1,0,1,0],[0,0,0,1],[0,0,0,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In 0↔1→2→3, which rows should be all 1s?**
Choices as displayed (top to bottom):
1. A / Row 0 only.
2. B / Rows 0, 1, and 2.
3. C / Rows 0 and 1.
4. D / All four rows.
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "Rows 0 and 1."
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "Row 0 only."
    feedback: Node 1 returns to 0, so it reaches everything 0 reaches. (misconception: misses-cycle-reach)
- ❌ [wrong-2] "Rows 0, 1, and 2."
    feedback: Node 2 cannot travel backward to 0 or 1. (misconception: reverses-directed-path)
- ❌ [wrong-3] "All four rows."
    feedback: Node 3 has no outgoing path except to itself. (misconception: makes-all-nodes-mutual)
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
graph=[[0,0],[0,0]]
```
Remedial question: **What should the function return?** · choices shown: [[0,0],[0,0]] | [[1,0],[0,1]]
Remedial answer key: ✅ "[[1,0],[0,1]]" — Correct. Both isolated nodes still reach themselves.; ❌ "[[0,0],[0,0]]" — That follows the omit diagonal bug.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: none
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [ones]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every index 0 through n−1, including isolated nodes.
Your choice: A 1 describes a road between two indexed nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
graph=[[0,1,0],[0,0,0],[0,1,0]]
```
Remedial question: **What should the function return?** · choices shown: [[1,1,0],[0,1,0],[0,1,1]] | [[1,1,1],[1,1,1],[1,1,1]]
Remedial answer key: ✅ "[[1,1,0],[0,1,0],[0,1,1]]" — Correct. Sharing destination 1 does not connect sources 0 and 2.; ❌ "[[1,1,1],[1,1,1],[1,1,1]]" — That follows the merge shared destination bug.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→1
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [both]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One arrow i → j.
Your choice: Roads are directed unless the reverse matrix entry is also 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
graph=[[0,1,0],[0,0,1],[1,0,0]]
```
Remedial question: **What should the function return?** · choices shown: [[0,1,0],[0,0,1],[1,0,0]] | [[1,1,1],[1,1,1],[1,1,1]]
Remedial answer key: ✅ "[[1,1,1],[1,1,1],[1,1,1]]" — Correct. A directed cycle reaches every node from every node.; ❌ "[[0,1,0],[0,0,1],[1,0,0]]" — That follows the direct edges only bug.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2, 2→0
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[1,1,1],[0,1,1],[0,0,1]]
Your choice: Closure includes paths and self-reachability, not only direct roads.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
graph=[[0,1,1],[0,0,0],[0,0,0]]
```
Remedial question: **What should the function return?** · choices shown: [[1,1,1],[0,1,0],[0,0,1]] | [[1,1,1],[1,1,0],[1,0,1]]
Remedial answer key: ✅ "[[1,1,1],[0,1,0],[0,0,1]]" — Correct. The two sink nodes cannot return to 0.; ❌ "[[1,1,1],[1,1,0],[1,0,1]]" — That follows the reverse outgoing roads bug.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Rows 0 and 1.
Your choice: Node 1 returns to 0, so it reaches everything 0 reaches.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
graph=[[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,0,0]]
```
Remedial question: **What should the function return?** · choices shown: [[1,1,0,0],[0,1,1,0],[0,0,1,1],[0,0,0,1]] | [[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]]
Remedial answer key: ✅ "[[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]]" — Correct. Closure follows the whole three-edge chain.; ❌ "[[1,1,0,0],[0,1,1,0],[0,0,1,1],[0,0,0,1]]" — That follows the stop after one edge bug.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Multi-hop closure"; authored goal, NOT shown to student: "Make a source reach a node only through an intermediate index.")
Everything the student sees (text):
```
M
Myles's broken search

Myles visits only the start and its direct neighboring nodes.

Your main goal: Expose Myles's mistake. Draw two graphs: first the correct graph, then Myles's graph using the mistake.

CHOOSE THE SOURCE INDEX
source index
OUTPUT
CORRECT OUTPUT
MYLES’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source index
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
2 · Myles's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE INDEX / source index", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MYLES’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
MYLES'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-two-way` (authored level "False backward reach"; authored goal, NOT shown to student: "Use one arrow whose reverse must stay unreachable.")
Everything the student sees (text):
```
A
Allyson's broken search

Allyson turns every arrow into a two-way connection.

Your main goal: Expose Allyson's mistake. Draw two graphs: first the correct graph, then Allyson's graph using the mistake.

CHOOSE THE SOURCE INDEX
source index
OUTPUT
CORRECT OUTPUT
ALLYSON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source index
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
2 · Allyson's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE INDEX / source index", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALLYSON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
ALLYSON'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `reverse-arrows` (authored level "Closure transpose"; authored goal, NOT shown to student: "Build an arrow chain whose reversed reachability is clearly different.")
Everything the student sees (text):
```
X
Xander's broken search

Xander reverses every arrow before searching.

Your main goal: Expose Xander's mistake. Draw two graphs: first the correct graph, then Xander's graph using the mistake.

CHOOSE THE SOURCE INDEX
source index
OUTPUT
CORRECT OUTPUT
XANDER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source index
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
2 · Xander's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE INDEX / source index", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | XANDER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
XANDER'S OUTPUT
[0,1]
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
graph=[[0,1,0],[0,0,1],[1,0,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2, 2→0
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 2 outgoing direct edges."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Every matrix cell containing 1.”"
    feedback if wrong: A 1 describes a road between two indexed nodes. Correct node rule: Every index 0 through n−1, including isolated nodes.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
0 has 1 outgoing direct edge.
×
A 1 describes a road between two indexed nodes. Correct node rule: Every index 0 through n−1, including isolated nodes.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→0, so it should also contain a direct 1→0 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only indexes whose row contains an outgoing 1.”"
    feedback if wrong: A node with no outgoing road still exists and reaches itself. Correct node rule: Every index 0 through n−1, including isolated nodes.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
1 has 1 outgoing direct edge.
×
A node with no outgoing road still exists and reaches itself. Correct node rule: Every index 0 through n−1, including isolated nodes.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every ordered pair (i,j).”"
    feedback if wrong: Ordered pairs are output questions about reachability, not graph nodes. Correct node rule: Every index 0 through n−1, including isolated nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has 2→0 and 0→1, so it should also contain a direct 2→1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 2 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
```
Result: PASSED

### S3 Q2
Raw input shown:
```
graph=[[0,1,1],[0,0,0],[0,0,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only indexes whose row contains an outgoing 1.”"
    feedback if wrong: A node with no outgoing road still exists and reaches itself. Correct node rule: Every index 0 through n−1, including isolated nodes.
- [NO is correct] (direct-vs-reach) "0 can reach 2, but there is no direct 0→2 edge."
    feedback if wrong: The mini-example lists 0→2 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q3
Raw input shown:
```
graph=[[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,0,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→3
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every matrix cell containing 1.”"
    feedback if wrong: A 1 describes a road between two indexed nodes. Correct node rule: Every index 0 through n−1, including isolated nodes.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0→2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
graph=[[0,0],[0,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Every ordered pair (i,j).”"
    feedback if wrong: Ordered pairs are output questions about reachability, not graph nodes. Correct node rule: Every index 0 through n−1, including isolated nodes.
- [NO is correct] (direct-vs-reach) "0 can reach 1, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between 0 and 1.
Result: PASSED

### S3 Q5
Raw input shown:
```
graph=[[0,1,0],[0,0,0],[0,1,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→1
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only indexes whose row contains an outgoing 1.”"
    feedback if wrong: A node with no outgoing road still exists and reaches itself. Correct node rule: Every index 0 through n−1, including isolated nodes.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0→1 edge."
    feedback if wrong: The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: Zero-length self paths are missing
Input shown:
```
REAL PROBLEM INPUT
graph: [[0, 1], [0, 0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function transitiveClosure(graph) {
  const numberOfNodes = graph.length;
  const reach = Array.from({ length: numberOfNodes }, () =>
    Array(numberOfNodes).fill(0),
  );
  for (let start = 0; start < numberOfNodes; start++) {
    const visited = new Set();
    const stack = [];
    for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
      if (graph[start][otherIndex] === 1) {
        stack.push(otherIndex);
      }
    }
    while (stack.length) {
      const currentNode = stack.pop();
      if (visited.has(currentNode)) {
        continue;
      }
      visited.add(currentNode);
      reach[start][currentNode] = 1;
      for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
        if (graph[currentNode][otherIndex] === 1) {
          stack.push(otherIndex);
        }
      }
    }
  }
  return reach;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1" · edges: 0→1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON reachability matrix" · expected buggy output `[[0,1],[0,0]]` · real correct output `[[1,1],[0,1]]`
Diagnosis choices as displayed:
- A Every directed road should also create reverse reachability.
- B The code returns the original graph matrix without exploring paths longer than one edge.
- C Neither source is seeded as reachable from itself, so both diagonal entries stay zero.
Diagnosis answer key + feedback:
- ❌ [reverse-road] "Every directed road should also create reverse reachability." — feedback: Roads are directed; a path exists only in the listed arrow direction.
- ✅ [missing-reflexive] "Neither source is seeded as reachable from itself, so both diagonal entries stay zero." — feedback: Exactly. Zero roads form a valid path from every node to itself.
- ❌ [copy-input] "The code returns the original graph matrix without exploring paths longer than one edge." — feedback: It does explore longer paths; this tiny input isolates the missing self rule.
Graph proof shown in feedback: code rule "Only nodes reached after following at least one stored arrow are marked." → changed graph "There are nodes 0 and 1 with arrow 0→1; each node also reaches itself by a zero-edge path." → boundary "Node 1 has no outgoing edge or cycle that could rediscover itself." → returned value "The helper leaves both diagonal cells 0; the true closure has ones on the diagonal."
Output-format probes: ✅ spaces after commas → `[[0, 1], [0, 0]]`; ❌ reversed element order → `[[0,0],[0,1]]`; ❌ trailing period → `[[0,1],[0,0]].`
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
About your diagnosis: Roads are directed; a path exists only in the listed arrow direction.
Code rule: Only nodes reached after following at least one stored arrow are marked. → Changed graph: There are nodes 0 and 1 with arrow 0→1; each node also reaches itself by a zero-edge path. → Reachable boundary: Node 1 has no outgoing edge or cycle that could rediscover itself.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Zero-length self paths are missing
INCORRECT OUTPUT
[[0,1],[0,0]]
CORRECT OUTPUT
[[1,1],[0,1]]
Code rule: Only nodes reached after following at least one stored arrow are marked. → Changed graph: There are nodes 0 and 1 with arrow 0→1; each node also reaches itself by a zero-edge path. → Reachable boundary: Node 1 has no outgoing edge or cycle that could rediscover itself. → Returned value: The helper leaves both diagonal cells 0; the true closure has ones on the diagonal.
```

### S4 case 2 — `build-1` · bug: Zero-length self paths are missing
Input shown:
```
REAL PROBLEM INPUT
graph=[[0,1,0],[0,0,1],[0,0,0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function transitiveClosure(graph) {
  const numberOfNodes = graph.length;
  const reach = Array.from({ length: numberOfNodes }, () =>
    Array(numberOfNodes).fill(0),
  );
  for (let start = 0; start < numberOfNodes; start++) {
    const visited = new Set();
    const stack = [];
    for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
      if (graph[start][otherIndex] === 1) {
        stack.push(otherIndex);
      }
    }
    while (stack.length) {
      const currentNode = stack.pop();
      if (visited.has(currentNode)) {
        continue;
      }
      visited.add(currentNode);
      reach[start][currentNode] = 1;
      for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
        if (graph[currentNode][otherIndex] === 1) {
          stack.push(otherIndex);
        }
      }
    }
  }
  return reach;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON reachability matrix" · expected buggy output `[[0,1,1],[0,0,1],[0,0,0]]` · real correct output `[[1,1,1],[0,1,1],[0,0,1]]`
Diagnosis choices as displayed:
- A Neither source is seeded as reachable from itself, so both diagonal entries stay zero.
- B Every directed road should also create reverse reachability.
- C The code returns the original graph matrix without exploring paths longer than one edge.
Diagnosis answer key + feedback:
- ❌ [reverse-road] "Every directed road should also create reverse reachability." — feedback: Roads are directed; a path exists only in the listed arrow direction.
- ✅ [missing-reflexive] "Neither source is seeded as reachable from itself, so both diagonal entries stay zero." — feedback: Correct. The chain 0→1→2 gives the off-diagonal reachability, but every source must also mark its own diagonal cell reachable.
- ❌ [copy-input] "The code returns the original graph matrix without exploring paths longer than one edge." — feedback: It does explore longer paths; this tiny input isolates the missing self rule.
Graph proof shown in feedback: code rule "Only nodes reached after following at least one stored arrow are marked." → changed graph "The input graph is the directed chain 0→1→2; its transitive closure also needs three self paths." → boundary "The chain supplies 0→1, 1→2, and 0→2, but all three diagonal self-reachability entries are absent." → returned value "The shown code returns [[0,1,1],[0,0,1],[0,0,0]]; the real problem returns [[1,1,1],[0,1,1],[0,0,1]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Zero-length self paths are missing
INCORRECT OUTPUT
[[0,1,1],[0,0,1],[0,0,0]]
CORRECT OUTPUT
[[1,1,1],[0,1,1],[0,0,1]]
Code rule: Only nodes reached after following at least one stored arrow are marked. → Changed graph: The input graph is the directed chain 0→1→2; its transitive closure also needs three self paths. → Reachable boundary: The chain supplies 0→1, 1→2, and 0→2, but all three diagonal self-reachability entries are absent. → Returned value: The shown code returns [[0,1,1],[0,0,1],[0,0,0]]; the real problem returns [[1,1,1],[0,1,1],[0,0,1]].
```

### S4 case 3 — `build-4` · bug: Zero-length self paths are missing
Input shown:
```
REAL PROBLEM INPUT
graph=[[0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function transitiveClosure(graph) {
  const numberOfNodes = graph.length;
  const reach = Array.from({ length: numberOfNodes }, () =>
    Array(numberOfNodes).fill(0),
  );
  for (let start = 0; start < numberOfNodes; start++) {
    const visited = new Set();
    const stack = [];
    for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
      if (graph[start][otherIndex] === 1) {
        stack.push(otherIndex);
      }
    }
    while (stack.length) {
      const currentNode = stack.pop();
      if (visited.has(currentNode)) {
        continue;
      }
      visited.add(currentNode);
      reach[start][currentNode] = 1;
      for (let otherIndex = 0; otherIndex < numberOfNodes; otherIndex++) {
        if (graph[currentNode][otherIndex] === 1) {
          stack.push(otherIndex);
        }
      }
    }
  }
  return reach;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON reachability matrix" · expected buggy output `[[0]]` · real correct output `[[1]]`
Diagnosis choices as displayed:
- A Every directed road should also create reverse reachability.
- B Neither source is seeded as reachable from itself, so both diagonal entries stay zero.
- C The code returns the original graph matrix without exploring paths longer than one edge.
Diagnosis answer key + feedback:
- ❌ [reverse-road] "Every directed road should also create reverse reachability." — feedback: Roads are directed; a path exists only in the listed arrow direction.
- ✅ [missing-reflexive] "Neither source is seeded as reachable from itself, so both diagonal entries stay zero." — feedback: Correct. Even isolated node 0 reaches itself by a zero-edge path, so leaving reach[0][0] unmarked changes 1 to 0.
- ❌ [copy-input] "The code returns the original graph matrix without exploring paths longer than one edge." — feedback: It does explore longer paths; this tiny input isolates the missing self rule.
Graph proof shown in feedback: code rule "Only nodes reached after following at least one stored arrow are marked." → changed graph "Node 0 is the graph's only node and has no listed outgoing edge." → boundary "The one-node graph has no outgoing edge, isolating the missing zero-length path 0→0." → returned value "The shown code returns [[0]]; the real problem returns [[1]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Zero-length self paths are missing
INCORRECT OUTPUT
[[0]]
CORRECT OUTPUT
[[1]]
Code rule: Only nodes reached after following at least one stored arrow are marked. → Changed graph: Node 0 is the graph's only node and has no listed outgoing edge. → Reachable boundary: The one-node graph has no outgoing edge, isolating the missing zero-length path 0→0. → Returned value: The shown code returns [[0]]; the real problem returns [[1]].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```