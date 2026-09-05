# Find if Path Exists in Graph (`find-if-path-exists-in-graph`) — original, undirected-graph

## Problem statement (Description tab)

You are given a graph with `n` vertices labeled from `0` to `n - 1`. The graph is **undirected**: each entry `edges[i] = [ui, vi]` is a two-way connection between vertex `ui` and vertex `vi`. Every pair of vertices is connected by at most one edge, and no vertex has an edge to itself.

You are also given two vertices, `source` and `destination`.

Return `true` if there is any path from `source` to `destination` (a walk along edges that starts at `source` and ends at `destination`), and `false` otherwise. Note that a path of length zero counts: if `source` and `destination` are the same vertex, the answer is `true`.

### Examples
- Example 1: input `n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2` → output `true`. There are two ways to get from 0 to 2: go 0 -> 1 -> 2, or go 0 -> 2 directly.
- Example 2: input `n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5` → output `false`. The graph splits into two separate pieces: {0, 1, 2} and {3, 4, 5}. There is no way to cross between them.

### Graph rules (authored)
- Nodes: All six vertices 0, 1, 2, 3, 4, and 5.
- Edges: A two-way line 1—2; DFS may cross it in either direction.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-triangle`, facet "reachability")
Raw input shown:
```
n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A route exists directly and through node 1.
- ❌ [near-miss] "false"
    feedback: That result follows the search direct edge only bug, not the exact picture. (misconception: search-direct-edge-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2, 2—0
"Why" shown after success: A route exists directly and through node 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact edge list")
Raw input shown:
```
n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2
2. Picture A / 0 / 1 / 2
3. Picture C / 0 / 1 / 2
4. Picture D / 0 / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2, 2—0
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2, 2→0
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1 · edges: 0—1
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-components`, facet "exact edge list")
Raw input shown:
```
n = 6, edges = [[0,1],[0,2],[3,5],[5,4]], source = 0, destination = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Source 0 and destination 5 are in different components.
- ❌ [near-miss] "true"
    feedback: That result follows the assume all listed vertices connect bug, not the exact picture. (misconception: assume-all-listed-vertices-connect)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 0—2, 3—5, 5—4
"Why" shown after success: Source 0 and destination 5 are in different components.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`core-rule`, facet "all n vertices")
Raw input shown:
```
For `n = 6` and `edges = [[0,1],[1,2]]`, which nodes must be drawn?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n = 6 and edges = [[0,1],[1,2]], which nodes must be drawn?**
Choices as displayed (top to bottom):
1. A / Only 0, 1, and 2 because only those labels appear in an edge.
2. B / All six vertices 0, 1, 2, 3, 4, and 5.
3. C / Only the source and destination for the current query.
4. D / One node for {0,1,2}, plus one node for each isolated vertex.
Answer key + feedback per choice (data):
- ✅ CORRECT [zero-to-five] "All six vertices 0, 1, 2, 3, 4, and 5."
    feedback: Correct. n defines every vertex, including three isolated ones.
- ❌ [edge-labels] "Only 0, 1, and 2 because only those labels appear in an edge."
    feedback: Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query. (misconception: drop-isolated-vertices)
- ❌ [endpoints] "Only the source and destination for the current query."
    feedback: A valid path may require intermediate vertices, so the whole graph must remain available. (misconception: only-query-endpoints)
- ❌ [components] "One node for {0,1,2}, plus one node for each isolated vertex."
    feedback: The set {0,1,2} is a component made of three nodes, not one node. (misconception: collapse-component)
"Why" shown after success: Correct. n defines every vertex, including three isolated ones.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`relation-rule`, facet "two-way edges")
Raw input shown:
```
What does an input edge `[1,2]` mean in this problem?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does an input edge [1,2] mean in this problem?**
Choices as displayed (top to bottom):
1. A / Only an arrow 1→2 because 1 is listed first.
2. B / Also connect 0—1 and 2—3 because consecutive labels are neighbors.
3. C / A two-way line 1—2; DFS may cross it in either direction.
4. D / Connect 1 directly to every vertex that can eventually be reached from 2.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way] "A two-way line 1—2; DFS may cross it in either direction."
    feedback: Correct. The graph is undirected.
- ❌ [forward] "Only an arrow 1→2 because 1 is listed first."
    feedback: Array order does not set direction here. The same edge also allows 2→1 travel. (misconception: treat-undirected-as-directed)
- ❌ [numeric-neighbors] "Also connect 0—1 and 2—3 because consecutive labels are neighbors."
    feedback: Only listed pairs create edges. Nearby numbers have no automatic connection. (misconception: connect-consecutive-labels)
- ❌ [reachable-shortcuts] "Connect 1 directly to every vertex that can eventually be reached from 2."
    feedback: Those farther vertices are connected by paths, not by this one input edge. (misconception: expand-edge-to-component)
"Why" shown after success: Correct. The graph is undirected.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-reverse-travel`, facet "two-way edges")
Raw input shown:
```
n = 2, edges = [[1,0]], source = 0, destination = 1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The edge can be crossed from 0 to 1 even though the pair lists 1 first.
- ❌ [near-miss] "false"
    feedback: That result follows the treat edge as directed bug, not the exact picture. (misconception: treat-edge-as-directed)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1" · edges: 1—0
"Why" shown after success: The edge can be crossed from 0 to 1 even though the pair lists 1 first.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "reachability")
Raw input shown:
```
n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / [2,0] points the wrong way
2. B / the cycle blocks DFS
3. C / through 0→1→2; the direct pair cannot be used
4. D / [2,0] is a usable two-way edge
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "`[2,0]` is a usable two-way edge"
    feedback: Correct. There is both a direct edge and a route through 1.
- ❌ [false-direction] "`[2,0]` points the wrong way"
    feedback: Edges are undirected, so `[2,0]` also allows 0→2. (misconception: treat-undirected-as-directed)
- ❌ [false-visited] "the cycle blocks DFS"
    feedback: Visited tracking safely handles the cycle; it does not block reachability. (misconception: cycle-means-no-path)
- ❌ [only-indirect] "through 0→1→2; the direct pair cannot be used"
    feedback: The pair `[2,0]` is a usable two-way direct edge. (misconception: ignore-reversed-pair)
"Why" shown after success: Correct. There is both a direct edge and a route through 1.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-same-node`, facet "all n vertices")
Raw input shown:
```
n = 3, edges = [], source = 2, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The zero-edge path already starts and ends at node 2.
- ❌ [near-miss] "false"
    feedback: That result follows the require at least one edge bug, not the exact picture. (misconception: require-at-least-one-edge)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: none
"Why" shown after success: The zero-edge path already starts and ends at node 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "reachability")
Raw input shown:
```
n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which conclusion correctly decides reachability from 0 to 5 in components {0,1,2} and {3,4,5}?**
Choices as displayed (top to bottom):
1. A / Consecutive labels 2 and 3 create an implicit bridge between components.
2. B / No edge crosses between the two components, so 0 cannot reach 5.
3. C / All listed nodes belong to one graph object, so every pair is reachable.
4. D / Reachability cannot be decided until a shortest path length is computed.
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "No edge crosses between the two components, so 0 cannot reach 5."
    feedback: Correct. No edge crosses between the components.
- ❌ [true-labels] "Consecutive labels 2 and 3 create an implicit bridge between components."
    feedback: Consecutive labels do not create edges. (misconception: numeric-adjacency)
- ❌ [true-any-node] "All listed nodes belong to one graph object, so every pair is reachable."
    feedback: A graph may contain disconnected pieces. (misconception: assume-connected)
- ❌ [unknown] "Reachability cannot be decided until a shortest path length is computed."
    feedback: The picture already proves no path of any length crosses the gap. (misconception: require-shortest-path)
"Why" shown after success: Correct. No edge crosses between the components.
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
n = 4, edges = [[0,1],[1,2]], source = 0, destination = 3
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. Node 3 exists but has no edge to the chain.; ❌ "true" — That result follows the connect isolated destination bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [edge-labels]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
All six vertices 0, 1, 2, 3, 4, and 5.
Your choice: Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
n = 3, edges = [[0,1]], source = 2, destination = 0
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Source node 2 is isolated, not absent.; ❌ "true" — That result follows the drop isolated source bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [forward]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way line 1—2; DFS may cross it in either direction.
Your choice: Array order does not set direction here. The same edge also allows 2→1 travel.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
n = 3, edges = [[1,0],[2,1]], source = 0, destination = 2
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Both undirected edges may be crossed against their written order.; ❌ "false" — That result follows the follow pair order only bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0, 2—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [false-direction]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[2,0] is a usable two-way edge
Your choice: Edges are undirected, so [2,0] also allows 0→2.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
n = 5, edges = [[0,1],[1,4],[0,2],[2,3],[3,4]], source = 0, destination = 4
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. At least one branch reaches 4; a failed branch would not disprove reachability.; ❌ "false" — That result follows the stop after first failed branch bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—4, 0—2, 2—3, 3—4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [true-labels]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
No edge crosses between the two components, so 0 cannot reach 5.
Your choice: Consecutive labels do not create edges.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n = 4, edges = [[0,1],[1,2],[2,3]], source = 0, destination = 3
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The destination is three edges away but remains reachable.; ❌ "false" — That result follows the check only source neighbors bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Two-way road made one-way"; authored goal, NOT shown to student: "Write an edge in the opposite order from the trip the source needs.")
Everything the student sees (text):
```
L
Lila's broken search

Lila mistakes undirected links for arrows.

Your main goal: Expose Lila's mistake. Draw two graphs: first the correct graph, then Lila's graph using the mistake.

CHOOSE THE SOURCE VERTEX
source vertex
OUTPUT
CORRECT OUTPUT
LILA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source vertex
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
2 · Lila's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE VERTEX / source vertex", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LILA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
LILA'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "DFS never returns"; authored goal, NOT shown to student: "Give the source a short branch and a separate branch containing more vertices.")
Everything the student sees (text):
```
R
Ravi's broken search

Ravi stops the whole search when its first branch ends.

Your main goal: Expose Ravi's mistake. Draw two graphs: first the correct graph, then Ravi's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE SOURCE VERTEX
source vertex
OUTPUT
CORRECT OUTPUT
RAVI’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source vertex
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
2 · Ravi's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE VERTEX / source vertex", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | RAVI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
RAVI'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Source field ignored"; authored goal, NOT shown to student: "Use a nonfirst source whose component differs from the first vertex's component.")
Everything the student sees (text):
```
E
Esme's broken search

Esme runs the search from a different source vertex.

Your main goal: Expose Esme's mistake. Draw two graphs: first the correct graph, then Esme's graph using the mistake.

CHOOSE THE SOURCE VERTEX
source vertex
OUTPUT
CORRECT OUTPUT
ESME’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source vertex
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
2 · Esme's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE VERTEX / source vertex", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ESME’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
ESME'S OUTPUT
[1,2]
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
n = 4, edges = [[0,1],[1,2]], source = 0, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—1 and 1—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for {0,1,2}, plus one node for each isolated vertex.”"
    feedback if wrong: The set {0,1,2} is a component made of three nodes, not one node. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
1 has 2 direct neighbors.
×
The set {0,1,2} is a component made of three nodes, not one node. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only 0, 1, and 2 because only those labels appear in an edge.”"
    feedback if wrong: Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0—2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
×
Right. A multi-step route through 1 creates reachability, not a new direct edge.
×
0 has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 can reach 0 through 1, but the graph still has no direct 2—0 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the source and destination for the current query.”"
    feedback if wrong: A valid path may require intermediate vertices, so the whole graph must remain available. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
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
n = 3, edges = [[0,1]], source = 2, destination = 0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 2 direct neighbors."
    feedback if wrong: 0 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only 0, 1, and 2 because only those labels appear in an edge.”"
    feedback if wrong: Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q3
Raw input shown:
```
n = 3, edges = [[1,0],[2,1]], source = 0, destination = 2
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0, 2—1
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—1 and 1—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for {0,1,2}, plus one node for each isolated vertex.”"
    feedback if wrong: The set {0,1,2} is a component made of three nodes, not one node. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
Result: PASSED

### S3 Q4
Raw input shown:
```
n = 5, edges = [[0,1],[1,4],[0,2],[2,3],[3,4]], source = 0, destination = 4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—4, 0—2, 2—3, 3—4
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—1, so it should also contain a direct 2—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "4 has exactly 3 direct neighbors."
    feedback if wrong: 4 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the source and destination for the current query.”"
    feedback if wrong: A valid path may require intermediate vertices, so the whole graph must remain available. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
Result: PASSED

### S3 Q5
Raw input shown:
```
n = 4, edges = [[0,1],[1,2],[2,3]], source = 0, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 2, but the graph still has no direct 3—1 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only 0, 1, and 2 because only those labels appear in an edge.”"
    feedback if wrong: Vertices 3, 4, and 5 still exist. Their lack of edges may decide a path query. Correct node rule: One node for every vertex ID from 0 through n−1, including isolated vertices.
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

### S4 case 1 — `authored-deep-case` · bug: An undirected edge is stored one way
Input shown:
```
REAL PROBLEM INPUT
n = 3, edges = [[1,0],[2,1]], source = 0, destination = 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function validPath(n, edges, source, destination) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const stack = [source];
  const visited = new Set([source]);
  while (stack.length) {
    const node = stack.pop();
    if (node === destination) {
      return true;
    }
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0 source", "1", "2 destination" · edges: 1—0 source, 2 destination—1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a path exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A Each undirected edge must be stored for both endpoints, changing this input's returned value.
- B The stack stops after exploring the first dead end instead of trying its remaining branches in this case.
- C The search should start at node 2 because it is the destination for the shown graph.
Diagnosis answer key + feedback:
- ✅ [one-way-storage] "Each undirected edge must be stored for both endpoints, changing this input's returned value." — feedback: Correct. The real path is 0—1—2 even though both pairs are written in the opposite order.
- ❌ [wrong-search] "The stack stops after exploring the first dead end instead of trying its remaining branches in this case." — feedback: No. The loop continues until the stack is empty, so DFS explores every reachable branch.
- ❌ [wrong-source] "The search should start at node 2 because it is the destination for the shown graph." — feedback: No. Starting at 0 works when the undirected graph is built correctly.
Graph proof shown in feedback: code rule "The code creates only 1→0 and 2→1." → changed graph "The undirected chain connects 0—1—2, independent of pair order." → boundary "Every listed pair points opposite the desired walk when misread as directed." → returned value "Node 0 appears to have no neighbors, so the code returns false instead of true."
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
About your diagnosis: No. The loop continues until the stack is empty, so DFS explores every reachable branch.
Code rule: The code creates only 1→0 and 2→1. → Changed graph: The undirected chain connects 0—1—2, independent of pair order. → Reachable boundary: Every listed pair points opposite the desired walk when misread as directed.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
An undirected edge is stored one way
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: The code creates only 1→0 and 2→1. → Changed graph: The undirected chain connects 0—1—2, independent of pair order. → Reachable boundary: Every listed pair points opposite the desired walk when misread as directed. → Returned value: Node 0 appears to have no neighbors, so the code returns false instead of true.
```

### S4 case 2 — `build-reverse-travel` · bug: An undirected edge is stored one way
Input shown:
```
REAL PROBLEM INPUT
n = 2, edges = [[1,0]], source = 0, destination = 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function validPath(n, edges, source, destination) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const stack = [source];
  const visited = new Set([source]);
  while (stack.length) {
    const node = stack.pop();
    if (node === destination) {
      return true;
    }
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1" · edges: 1—0
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a path exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The stack stops after exploring the first dead end instead of trying its remaining branches in this case.
- B Each undirected edge must be stored for both endpoints, changing this input's returned value.
- C The search should start at the destination instead of the declared source.
Diagnosis answer key + feedback:
- ✅ [one-way-storage] "Each undirected edge must be stored for both endpoints, changing this input's returned value." — feedback: Correct. Undirected pair [1,0] is the edge 0—1, but storing only arrow 1→0 strands source 0 away from destination 1. Therefore the shown code returns false, while the real problem returns true.
- ❌ [wrong-search] "The stack stops after exploring the first dead end instead of trying its remaining branches in this case." — feedback: No. The loop continues until the stack is empty, so DFS explores every reachable branch.
- ❌ [wrong-source] "The search should start at the destination instead of the declared source." — feedback: Begin at the declared source. The fix is to store each undirected edge for both endpoints.
Graph proof shown in feedback: code rule "The code creates only 1→0 and 2→1." → changed graph "Nodes: 0, 1. Direct edges: 1—0." → boundary "Undirected pair [1,0] is the edge 0—1, but storing only arrow 1→0 strands source 0 away from destination 1." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
An undirected edge is stored one way
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: The code creates only 1→0 and 2→1. → Changed graph: Nodes: 0, 1. Direct edges: 1—0. → Reachable boundary: Undirected pair [1,0] is the edge 0—1, but storing only arrow 1→0 strands source 0 away from destination 1. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

### S4 case 3 — `reverse-written-four-node-chain` · bug: An undirected edge is stored one way
Input shown:
```
REAL PROBLEM INPUT
n = 4, edges = [[1,0],[2,1],[3,2]], source = 0, destination = 3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function validPath(n, edges, source, destination) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const stack = [source];
  const visited = new Set([source]);
  while (stack.length) {
    const node = stack.pop();
    if (node === destination) {
      return true;
    }
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return false;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0 source", "1", "2", "3 destination" · edges: 1—0 source, 2—1, 3 destination—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a path exists" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The stack stops after exploring the first dead end instead of trying its remaining branches in this case.
- B The search should start at the destination instead of the declared source.
- C Each undirected edge must be stored for both endpoints, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [one-way-storage] "Each undirected edge must be stored for both endpoints, changing this input's returned value." — feedback: Correct. All three undirected pairs form the path 0—1—2—3 even though every pair is written in reverse travel order. Therefore the shown code returns false, while the real problem returns true.
- ❌ [wrong-search] "The stack stops after exploring the first dead end instead of trying its remaining branches in this case." — feedback: No. The loop continues until the stack is empty, so DFS explores every reachable branch.
- ❌ [wrong-source] "The search should start at the destination instead of the declared source." — feedback: Begin at the declared source. The fix is to store each undirected edge for both endpoints.
Graph proof shown in feedback: code rule "The code creates only 1→0 and 2→1." → changed graph "Nodes: 0 source, 1, 2, 3 destination. Direct edges: 1—0 source; 2—1; 3 destination—2." → boundary "All three undirected pairs form the path 0—1—2—3 even though every pair is written in reverse travel order." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
An undirected edge is stored one way
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: The code creates only 1→0 and 2→1. → Changed graph: Nodes: 0 source, 1, 2, 3 destination. Direct edges: 1—0 source; 2—1; 3 destination—2. → Reachable boundary: All three undirected pairs form the path 0—1—2—3 even though every pair is written in reverse travel order. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```