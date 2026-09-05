# All Paths From Source to Target (`all-paths-from-source-to-target`) — original, directed-graph

## Problem statement (Description tab)

You are given a **directed acyclic graph** (a graph with one-way edges and no cycles) with `n` nodes labeled from `0` to `n - 1`.

The graph is given as an adjacency list: `graph[i]` is the list of nodes you can travel to directly from node `i` (an edge points from `i` to each node in `graph[i]`).

Find **every possible path** that starts at node `0` and ends at node `n - 1`, and return them as a list of paths. Each path is the list of nodes it visits, in order. You may return the paths in any order.

### Examples
- Example 1: input `graph = [[1,2],[3],[3],[]]` → output `[[0,1,3],[0,2,3]]`. From node 0 you can go to node 1 or node 2, and both of those lead to node 3. So there are two paths: 0 -> 1 -> 3 and 0 -> 2 -> 3.
- Example 2: input `graph = [[4,3,1],[3,2,4],[3],[4],[]]` → output `[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]`. There are five different ways to travel from node 0 to node 4.
- Example 3: input `graph = [[1],[]]` → output `[[0,1]]`. The only path is the single edge from node 0 straight to node 1.

### Graph rules (authored)
- Nodes: One node for each adjacency-list index: 0, 1, 2, and 3.
- Edges: Draw 0→1, 0→2, 1→3, and 2→3.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-diamond`, facet "exact adjacency")
Raw input shown:
```
graph = [[1,2],[3],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,1,3]]
2. [[0,1,3],[0,2,3]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,1,3],[0,2,3]]"
    feedback: Correct. Both branches reach target 3, so both complete paths belong in the result.
- ❌ [near-miss] "[[0,1,3]]"
    feedback: That result follows the stop after first path bug, not the exact picture. (misconception: stop-after-first-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
"Why" shown after success: Both branches reach target 3, so both complete paths belong in the result.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-direct-and-long`, facet "all complete paths")
Raw input shown:
```
graph = [[1,3],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,1,2,3],[0,3]]
2. [[0,1,2,3]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,1,2,3],[0,3]]"
    feedback: Correct. The direct edge 0→3 is a complete path as well as the longer branch.
- ❌ [near-miss] "[[0,1,2,3]]"
    feedback: That result follows the miss direct path bug, not the exact picture. (misconception: miss-direct-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→3, 1→2, 2→3
"Why" shown after success: The direct edge 0→3 is a complete path as well as the longer branch.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact adjacency")
Raw input shown:
```
graph = [[1,2],[3],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3
2. Picture C / 0 / 1 / 2 / 3
3. Picture D / 0 / 1 / 2
4. Picture A / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3, 2→3
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 1→0, 2→0, 3→1, 3→2
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 0→2
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-merge`, facet "vertex identity")
Raw input shown:
```
graph = [[1,2],[3],[3],[4],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,1,3,4]]
2. [[0,1,3,4],[0,2,3,4]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,1,3,4],[0,2,3,4]]"
    feedback: Correct. A DAG may merge at node 3; both distinct prefixes still make valid paths.
- ❌ [near-miss] "[[0,1,3,4]]"
    feedback: That result follows the global visited prunes path bug, not the exact picture. (misconception: global-visited-prunes-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
"Why" shown after success: A DAG may merge at node 3; both distinct prefixes still make valid paths.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "vertex identity")
Raw input shown:
```
For `graph = [[1,2],[3],[3],[]]`, what should each node in the picture represent?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For graph = [[1,2],[3],[3],[]], what should each node in the picture represent?**
Choices as displayed (top to bottom):
1. A / One node for each complete route, such as 0→1→3 and 0→2→3.
2. B / One node only for indices 0, 1, and 2 because their lists contain neighbors.
3. C / One node for every number written inside the inner lists, including repeated copies of 3.
4. D / One node for each adjacency-list index: 0, 1, 2, and 3.
Answer key + feedback per choice (data):
- ✅ CORRECT [indices] "One node for each adjacency-list index: 0, 1, 2, and 3."
    feedback: Correct. Each index names one graph vertex, including node 3 with an empty neighbor list.
- ❌ [paths] "One node for each complete route, such as 0→1→3 and 0→2→3."
    feedback: Routes are the answers we collect. They are made by walking through vertex nodes. (misconception: treat-output-paths-as-nodes)
- ❌ [nonempty] "One node only for indices 0, 1, and 2 because their lists contain neighbors."
    feedback: Node 3 still exists. An empty list means it has no outgoing arrows, not that the node disappears. (misconception: drop-sink-node)
- ❌ [entries] "One node for every number written inside the inner lists, including repeated copies of 3."
    feedback: Repeated references to 3 point to the same vertex. They do not create new copies of node 3. (misconception: duplicate-referenced-node)
"Why" shown after success: Correct. Each index names one graph vertex, including node 3 with an empty neighbor list.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-single-edge`, facet "all complete paths")
Raw input shown:
```
graph = [[1],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[0,1]]
2. []
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[[0,1]]"
    feedback: Correct. The single listed arrow already reaches the target.
- ❌ [near-miss] "[]"
    feedback: That result follows the ignore direct target bug, not the exact picture. (misconception: ignore-direct-target)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1
"Why" shown after success: The single listed arrow already reaches the target.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "arrow direction")
Raw input shown:
```
How should `graph = [[1,2],[3],[3],[]]` become arrows?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should graph = [[1,2],[3],[3],[]] become arrows?**
Choices as displayed (top to bottom):
1. A / Draw those four connections as two-way lines.
2. B / Draw 0→1, 0→2, 1→3, and 2→3.
3. C / Also draw 0→3 because node 3 is eventually reachable from node 0.
4. D / Draw 1→0, 2→0, 3→1, and 3→2.
Answer key + feedback per choice (data):
- ✅ CORRECT [listed-arrows] "Draw 0→1, 0→2, 1→3, and 2→3."
    feedback: Correct. Every value in `graph[i]` creates one arrow leaving i.
- ❌ [two-way] "Draw those four connections as two-way lines."
    feedback: The input is directed. For example, 0 can go to 1, but `graph[1]` does not say 1 can go to 0. (misconception: ignore-direction)
- ❌ [shortcut] "Also draw 0→3 because node 3 is eventually reachable from node 0."
    feedback: Reachability through two steps is a path, not a direct edge. Adding 0→3 invents a new route. (misconception: turn-path-into-edge)
- ❌ [reverse] "Draw 1→0, 2→0, 3→1, and 3→2."
    feedback: That reverses the adjacency list. `graph[i]` lists where arrows go from i. (misconception: reverse-adjacency-arrows)
"Why" shown after success: Correct. Every value in `graph[i]` creates one arrow leaving i.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "all complete paths")
Raw input shown:
```
graph = [[1,2],[3],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For graph = [[1,2],[3],[3],[]], which complete 0-to-3 paths appear in the picture?**
Choices as displayed (top to bottom):
1. A / [[0,1,3]]
2. B / [[0,1],[0,2]]
3. C / [[0,1,3],[0,2,3]]
4. D / [[0,3]]
Answer key + feedback per choice (data):
- ✅ CORRECT [both] "`[[0,1,3],[0,2,3]]`"
    feedback: Correct. Both branches from 0 reach target 3.
- ❌ [first] "`[[0,1,3]]`"
    feedback: This stops after the first valid branch and misses 0→2→3. (misconception: stop-after-first-path)
- ❌ [prefix] "`[[0,1],[0,2]]`"
    feedback: These stop before target node 3. (misconception: return-path-prefixes)
- ❌ [shortcut] "`[[0,3]]`"
    feedback: There is no direct 0→3 arrow. (misconception: invent-shortcut)
"Why" shown after success: Correct. Both branches from 0 reach target 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "all complete paths")
Raw input shown:
```
graph = [[4,3,1],[3,2,4],[3],[4],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In graph = [[4,3,1],[3,2,4],[3],[4],[]], how many different paths run from 0 to target 4?**
Choices as displayed (top to bottom):
1. A / 5 paths
2. B / 3 paths
3. C / 4 paths
4. D / 6 paths
Answer key + feedback per choice (data):
- ✅ CORRECT [five] "5 paths"
    feedback: Correct. The picture contains the direct route plus four longer routes.
- ❌ [three] "3 paths"
    feedback: This counts only one route through each first neighbor and misses branching below node 1. (misconception: one-path-per-first-edge)
- ❌ [four] "4 paths"
    feedback: This commonly misses the direct 0→4 route. (misconception: miss-direct-path)
- ❌ [six] "6 paths"
    feedback: This treats the dead-end-free branches as freely interchangeable and invents a route. (misconception: combine-incompatible-branches)
"Why" shown after success: Correct. The picture contains the direct route plus four longer routes.
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
graph = [[2],[2],[]]
```
Remedial question: **What should the function return?** · choices shown: [[0,2],[0,1,2]] | [[0,2]]
Remedial answer key: ✅ "[[0,2]]" — Correct. Only paths beginning at node 0 count, and 0 has only the direct arrow to 2.; ❌ "[[0,2],[0,1,2]]" — That result follows the invent unlisted edge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2, 1→2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [paths]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One node for each adjacency-list index: 0, 1, 2, and 3.
Your choice: Routes are the answers we collect. They are made by walking through vertex nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
graph = [[],[0]]
```
Remedial question: **What should the function return?** · choices shown: [] | [[0]]
Remedial answer key: ✅ "[]" — Correct. Source 0 is not target 1 and has no outgoing arrow.; ❌ "[[0]]" — That result follows the treat start as complete without target bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [two-way]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Draw 0→1, 0→2, 1→3, and 2→3.
Your choice: The input is directed. For example, 0 can go to 1, but graph[1] does not say 1 can go to 0.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
graph = [[],[0],[]]
```
Remedial question: **What should the function return?** · choices shown: [[0,1,2]] | []
Remedial answer key: ✅ "[]" — Correct. An arrow into node 0 cannot be followed out of node 0.; ❌ "[[0,1,2]]" — That result follows the reverse arrows bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [first]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[0,1,3],[0,2,3]]
Your choice: This stops after the first valid branch and misses 0→2→3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
graph = [[1,2],[2],[]]
```
Remedial question: **What should the function return?** · choices shown: [[0,1,2],[0,2]] | [[0,1,2]]
Remedial answer key: ✅ "[[0,1,2],[0,2]]" — Correct. Both the two-edge route and direct route end at target 2.; ❌ "[[0,1,2]]" — That result follows the miss shorter path bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5 paths
Your choice: This counts only one route through each first neighbor and misses branching below node 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
graph = [[1,2],[3],[3],[4],[]]
```
Remedial question: **How many complete paths should be returned?** · choices shown: 2 paths | 1 path
Remedial answer key: ✅ "2 paths" — Correct. Two routes may share a suffix without becoming the same path.; ❌ "1 path" — That result follows the global visited prunes merge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Illegal return trip"; authored goal, NOT shown to student: "Use one arrow whose backward trip invents a route from the source.")
Everything the student sees (text):
```
M
Maya's broken search

Maya turns every arrow into a two-way connection.

Your main goal: Expose Maya's mistake. Draw two graphs: first the correct graph, then Maya's graph using the mistake.

CHOOSE THE SOURCE NODE
source node
OUTPUT
CORRECT OUTPUT
MAYA’S OUTPUT
Drawing 1 of 2: Correct graph · Source node: 0
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
2 · Maya's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE NODE / source node", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MAYA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0`; ❌ curly braces → `{0}`; ❌ quoted numbers/strings → `["0"]`; ✅ spaces inside brackets → `[ 0 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
MAYA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Path cut short"; authored goal, NOT shown to student: "Make the target reachable only after at least two arrows.")
Everything the student sees (text):
```
T
Theo's broken search

Theo visits only the start and its direct neighboring nodes.

Your main goal: Expose Theo's mistake. Draw two graphs: first the correct graph, then Theo's graph using the mistake.

CHOOSE THE SOURCE NODE
source node
OUTPUT
CORRECT OUTPUT
THEO’S OUTPUT
Drawing 1 of 2: Correct graph · Source node: 0
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
2 · Theo's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE NODE / source node", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | THEO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
THEO'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Earlier path erased"; authored goal, NOT shown to student: "Branch toward two destinations so keeping only the last branch loses nodes.")
Everything the student sees (text):
```
N
Nia's broken search

Nia follows only the last available branch and ignores earlier choices.

Your main goal: Expose Nia's mistake. Draw two graphs: first the correct graph, then Nia's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE SOURCE NODE
source node
OUTPUT
CORRECT OUTPUT
NIA’S OUTPUT
Drawing 1 of 2: Correct graph · Source node: 0
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
2 · Nia's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE NODE / source node", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | NIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
NIA'S OUTPUT
[0,2,3]
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
graph = [[2],[2],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2, 1→2
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each complete route, such as 0→1→3 and 0→2→3.”"
    feedback if wrong: Routes are the answers we collect. They are made by walking through vertex nodes. Correct node rule: One node for every adjacency-list index, including sinks.
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Routes are the answers we collect. They are made by walking through vertex nodes. Correct node rule: One node for every adjacency-list index, including sinks.
×
Correct. The mini-example lists 0→2 as one direct edge.
×
0 has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node only for indices 0, 1, and 2 because their lists contain neighbors.”"
    feedback if wrong: Node 3 still exists. An empty list means it has no outgoing arrows, not that the node disappears. Correct node rule: One node for every adjacency-list index, including sinks.
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→2 as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 outgoing direct edge.
×
Node 3 still exists. An empty list means it has no outgoing arrows, not that the node disappears. Correct node rule: One node for every adjacency-list index, including sinks.
×
Correct. The mini-example lists 1→2 as one direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for every number written inside the inner lists, including repeated copies of 3.”"
    feedback if wrong: Repeated references to 3 point to the same vertex. They do not create new copies of node 3. Correct node rule: One node for every adjacency-list index, including sinks.
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
graph = [[],[0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node only for indices 0, 1, and 2 because their lists contain neighbors.”"
    feedback if wrong: Node 3 still exists. An empty list means it has no outgoing arrows, not that the node disappears. Correct node rule: One node for every adjacency-list index, including sinks.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q3
Raw input shown:
```
graph = [[],[0],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each complete route, such as 0→1→3 and 0→2→3.”"
    feedback if wrong: Routes are the answers we collect. They are made by walking through vertex nodes. Correct node rule: One node for every adjacency-list index, including sinks.
- [YES is correct] (direct-vs-reach) "1 and 0 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→0 as one direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
graph = [[1,2],[2],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for every number written inside the inner lists, including repeated copies of 3.”"
    feedback if wrong: Repeated references to 3 point to the same vertex. They do not create new copies of node 3. Correct node rule: One node for every adjacency-list index, including sinks.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1→2 edge."
    feedback if wrong: The mini-example lists 1→2 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
graph = [[1,2],[3],[3],[4],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node only for indices 0, 1, and 2 because their lists contain neighbors.”"
    feedback if wrong: Node 3 still exists. An empty list means it has no outgoing arrows, not that the node disappears. Correct node rule: One node for every adjacency-list index, including sinks.
- [YES is correct] (direct-vs-reach) "1 can reach 4 through 3, but the graph still has no direct 1→4 edge."
    feedback if wrong: Right. A multi-step route through 3 creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: One visited set erases a valid path
Input shown:
```
REAL PROBLEM INPUT
graph = [[1,2],[3],[3],[4],[]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const answer = [];
  const visited = new Set();
  function search(node, path) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    if (node === target) {
      answer.push(path.slice());
      return;
    }
    for (const next of graph[node]) {
      search(next, [...path, next]);
    }
  }
  search(0, [0]);
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of complete source-to-target paths" · expected buggy output `[[0,1,3,4]]` · real correct output `[[0,1,3,4],[0,2,3,4]]`
Diagnosis choices as displayed:
- A The search treats a shared merge node as permanently finished.
- B The graph needs a direct arrow from 0 to 4 for the shown graph.
- C The arrows should be two-way so DFS can return to a branch.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The search treats a shared merge node as permanently finished." — feedback: Correct. Node 3 belongs to two different paths, so reaching it through node 1 must not block the path through node 2.
- ❌ [missing-direct-edge] "The graph needs a direct arrow from 0 to 4 for the shown graph." — feedback: No. A path may use several listed arrows; adding 0→4 would change the input.
- ❌ [undirected] "The arrows should be two-way so DFS can return to a branch." — feedback: No. This graph is directed, and DFS returns through its call stack without reverse edges.
Graph proof shown in feedback: code rule "The single visited set allows node 3 to expand only for the first prefix." → changed graph "The DAG has two prefixes, 0→1→3 and 0→2→3, that merge before 3→4." → boundary "A merge node lies on two valid source-to-target paths." → returned value "The real graph has two paths, but the code reports only the path whose branch reaches node 3 first."
Output-format probes: ✅ spaces after commas → `[[0, 1, 3, 4]]`; ❌ trailing period → `[[0,1,3,4]].`
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
About your diagnosis: No. A path may use several listed arrows; adding 0→4 would change the input.
Code rule: The single visited set allows node 3 to expand only for the first prefix. → Changed graph: The DAG has two prefixes, 0→1→3 and 0→2→3, that merge before 3→4. → Reachable boundary: A merge node lies on two valid source-to-target paths.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One visited set erases a valid path
INCORRECT OUTPUT
[[0,1,3,4]]
CORRECT OUTPUT
[[0,1,3,4],[0,2,3,4]]
Code rule: The single visited set allows node 3 to expand only for the first prefix. → Changed graph: The DAG has two prefixes, 0→1→3 and 0→2→3, that merge before 3→4. → Reachable boundary: A merge node lies on two valid source-to-target paths. → Returned value: The real graph has two paths, but the code reports only the path whose branch reaches node 3 first.
```

### S4 case 2 — `build-diamond` · bug: One visited set erases a valid path
Input shown:
```
REAL PROBLEM INPUT
graph = [[1,2],[3],[3],[]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const answer = [];
  const visited = new Set();
  function search(node, path) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    if (node === target) {
      answer.push(path.slice());
      return;
    }
    for (const next of graph[node]) {
      search(next, [...path, next]);
    }
  }
  search(0, [0]);
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of complete source-to-target paths" · expected buggy output `[[0,1,3]]` · real correct output `[[0,1,3],[0,2,3]]`
Diagnosis choices as displayed:
- A The source needs an extra direct arrow to the target for this result.
- B The search treats a shared merge node as permanently finished.
- C The arrows should be two-way so DFS can return to a branch.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The search treats a shared merge node as permanently finished." — feedback: Correct. Paths 0→1→3 and 0→2→3 share target 3; visiting 3 through node 1 must not erase the second complete path through node 2. Therefore the shown code returns [[0,1,3]], while the real problem returns [[0,1,3],[0,2,3]].
- ❌ [missing-direct-edge] "The source needs an extra direct arrow to the target for this result." — feedback: Do not invent a shortcut. A valid path may use several listed arrows to reach the target.
- ❌ [undirected] "The arrows should be two-way so DFS can return to a branch." — feedback: No. This graph is directed, and DFS returns through its call stack without reverse edges.
Graph proof shown in feedback: code rule "The single visited set allows node 3 to expand only for the first prefix." → changed graph "Nodes: 0, 1, 2, 3. Direct arrows: 0→1; 0→2; 1→3; 2→3." → boundary "Paths 0→1→3 and 0→2→3 share target 3; visiting 3 through node 1 must not erase the second complete path through node 2." → returned value "The shown code returns [[0,1,3]]; the source-repo reference solution returns [[0,1,3],[0,2,3]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One visited set erases a valid path
INCORRECT OUTPUT
[[0,1,3]]
CORRECT OUTPUT
[[0,1,3],[0,2,3]]
Code rule: The single visited set allows node 3 to expand only for the first prefix. → Changed graph: Nodes: 0, 1, 2, 3. Direct arrows: 0→1; 0→2; 1→3; 2→3. → Reachable boundary: Paths 0→1→3 and 0→2→3 share target 3; visiting 3 through node 1 must not erase the second complete path through node 2. → Returned value: The shown code returns [[0,1,3]]; the source-repo reference solution returns [[0,1,3],[0,2,3]].
```

### S4 case 3 — `build-direct-and-long` · bug: One visited set erases a valid path
Input shown:
```
REAL PROBLEM INPUT
graph = [[1,3],[2],[3],[]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const answer = [];
  const visited = new Set();
  function search(node, path) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    if (node === target) {
      answer.push(path.slice());
      return;
    }
    for (const next of graph[node]) {
      search(next, [...path, next]);
    }
  }
  search(0, [0]);
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→3, 1→2, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of complete source-to-target paths" · expected buggy output `[[0,1,2,3]]` · real correct output `[[0,1,2,3],[0,3]]`
Diagnosis choices as displayed:
- A The source needs an extra direct arrow to the target for this result.
- B The arrows should be two-way so DFS can return to a branch.
- C The search treats a shared merge node as permanently finished.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The search treats a shared merge node as permanently finished." — feedback: Correct. The long route 0→1→2→3 reaches target 3 first, so the global set wrongly blocks the separate direct route 0→3. Therefore the shown code returns [[0,1,2,3]], while the real problem returns [[0,1,2,3],[0,3]].
- ❌ [missing-direct-edge] "The source needs an extra direct arrow to the target for this result." — feedback: Do not invent a shortcut. A valid path may use several listed arrows to reach the target.
- ❌ [undirected] "The arrows should be two-way so DFS can return to a branch." — feedback: No. This graph is directed, and DFS returns through its call stack without reverse edges.
Graph proof shown in feedback: code rule "The single visited set allows node 3 to expand only for the first prefix." → changed graph "Nodes: 0, 1, 2, 3. Direct arrows: 0→1; 0→3; 1→2; 2→3." → boundary "The long route 0→1→2→3 reaches target 3 first, so the global set wrongly blocks the separate direct route 0→3." → returned value "The shown code returns [[0,1,2,3]]; the source-repo reference solution returns [[0,1,2,3],[0,3]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One visited set erases a valid path
INCORRECT OUTPUT
[[0,1,2,3]]
CORRECT OUTPUT
[[0,1,2,3],[0,3]]
Code rule: The single visited set allows node 3 to expand only for the first prefix. → Changed graph: Nodes: 0, 1, 2, 3. Direct arrows: 0→1; 0→3; 1→2; 2→3. → Reachable boundary: The long route 0→1→2→3 reaches target 3 first, so the global set wrongly blocks the separate direct route 0→3. → Returned value: The shown code returns [[0,1,2,3]]; the source-repo reference solution returns [[0,1,2,3],[0,3]].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```