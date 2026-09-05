# Is Graph Bipartite? (`is-graph-bipartite`) — original, undirected-graph

## Problem statement (Description tab)

You are given an undirected graph with `n` nodes, labeled from `0` to `n - 1`. The graph is described by an adjacency list `graph`, where `graph[u]` is the array of all nodes connected to node `u` by an edge. The graph may be disconnected, and no node has an edge to itself.

A graph is **bipartite** if you can split its nodes into two groups so that **every edge connects a node from one group to a node from the other group**. In other words: no edge is allowed to connect two nodes in the same group.

Return `true` if the graph is bipartite, and `false` otherwise.

### Examples
- Example 1: input `graph = [[1,3],[0,2],[1,3],[0,2]]` → output `true`. Put nodes 0 and 2 in one group and nodes 1 and 3 in the other. Every edge connects the two groups, so the graph is bipartite.
- Example 2: input `graph = [[1,2,3],[0,2],[0,1,3],[0,2]]` → output `false`. Nodes 0, 1, and 2 form a triangle. With only two groups, two of those three nodes must share a group, but every pair of them is connected. There is no valid split.

### Graph rules (authored)
- Nodes: Nodes 0, 1, and isolated node 2.
- Edges: One undirected line 0—1, whose endpoints must receive opposite colors.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-square`, facet "two-color consistency")
Raw input shown:
```
graph = [[1,3],[0,2],[1,3],[0,2]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. An even cycle alternates cleanly between two groups.
- ❌ [near-miss] "false"
    feedback: That result follows the reject any cycle bug, not the exact picture. (misconception: reject-any-cycle)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—3, 1—2, 2—3
"Why" shown after success: An even cycle alternates cleanly between two groups.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-triangle`, facet "two-color consistency")
Raw input shown:
```
graph = [[1,2],[0,2],[0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. A triangle forces its third edge to join equal colors.
- ❌ [near-miss] "true"
    feedback: That result follows the color neighbors without conflict check bug, not the exact picture. (misconception: color-neighbors-without-conflict-check)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 0—2, 1—2
"Why" shown after success: A triangle forces its third edge to join equal colors.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact adjacency")
Raw input shown:
```
graph = [[1,3],[0,2],[1,3],[0,2]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3
2. Picture B / 0 / 1 / 2 / 3
3. Picture C / 0 / 1 / 2 / 3
4. Picture D / 0 / 1 / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—3, 1—2, 2—3
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—3, 1—2
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→3, 1→2, 2→3
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "all vertices")
Raw input shown:
```
For `graph = [[1],[0],[]]`, which nodes exist before coloring starts?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For graph = [[1],[0],[]], which nodes exist before coloring starts?**
Choices as displayed (top to bottom):
1. A / Only nodes 0 and 1 because node 2 has no neighbors.
2. B / Exactly two nodes: one red team and one blue team.
3. C / One node for each written neighbor entry, so two separate copies for the 0—1 relationship.
4. D / Nodes 0, 1, and isolated node 2.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-indices] "Nodes 0, 1, and isolated node 2."
    feedback: Correct. Every adjacency-list index is a node, even with an empty list.
- ❌ [connected-only] "Only nodes 0 and 1 because node 2 has no neighbors."
    feedback: An isolated node still belongs to the graph and can be placed in either color group. (misconception: drop-isolated-node)
- ❌ [colors] "Exactly two nodes: one red team and one blue team."
    feedback: The teams are color assignments applied to graph nodes; they are not the nodes themselves. (misconception: color-groups-as-nodes)
- ❌ [entries] "One node for each written neighbor entry, so two separate copies for the 0—1 relationship."
    feedback: The symmetric entries describe the same two vertex nodes and the same undirected edge. (misconception: duplicate-adjacency-nodes)
"Why" shown after success: Correct. Every adjacency-list index is a node, even with an empty list.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-disconnected`, facet "all vertices")
Raw input shown:
```
graph = [[1],[0],[3,4],[2,4],[2,3]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. The component containing 0 is fine, but the separate triangle is not.
- ❌ [near-miss] "true"
    feedback: That result follows the search only component zero bug, not the exact picture. (misconception: search-only-component-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3, 2—4, 3—4
"Why" shown after success: The component containing 0 is fine, but the separate triangle is not.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "two-way conflicts")
Raw input shown:
```
How should the entries `graph[0] = [1]` and `graph[1] = [0]` be shown?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should the entries graph[0] = [1] and graph[1] = [0] be shown?**
Choices as displayed (top to bottom):
1. A / One undirected line 0—1, whose endpoints must receive opposite colors.
2. B / Two separate directed arrows, 0→1 and 1→0, each tested as a different relationship.
3. C / One line 0—1 that requires both endpoints to use the same color.
4. D / Connect node 0 to node 1 only because their labels are consecutive.
Answer key + feedback per choice (data):
- ✅ CORRECT [one-line] "One undirected line 0—1, whose endpoints must receive opposite colors."
    feedback: Correct. The mirrored adjacency entries describe one two-way edge.
- ❌ [two-arrows] "Two separate directed arrows, 0→1 and 1→0, each tested as a different relationship."
    feedback: The input represents one undirected graph edge, not two independent directed constraints. (misconception: double-count-mirrored-edge)
- ❌ [same-color] "One line 0—1 that requires both endpoints to use the same color."
    feedback: Bipartite coloring requires every edge to cross between opposite colors. (misconception: invert-color-rule)
- ❌ [index-edge] "Connect node 0 to node 1 only because their labels are consecutive."
    feedback: The edge exists because of the adjacency entries, not because the labels differ by one. (misconception: label-based-edge)
"Why" shown after success: Correct. The mirrored adjacency entries describe one two-way edge.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "two-color consistency")
Raw input shown:
```
graph = [[1,3],[0,2],[1,3],[0,2]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / color {0,2} one color and {1,3} the other
2. B / any cycle prevents two-coloring
3. C / 0 and 2 share a path
4. D / color {0,1} together and {2,3} together
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "color {0,2} one color and {1,3} the other"
    feedback: Correct. Every edge crosses the split.
- ❌ [false-cycle] "any cycle prevents two-coloring"
    feedback: Even cycles are bipartite; odd cycles are the problem. (misconception: all-cycles-fail)
- ❌ [false-diagonal] "0 and 2 share a path"
    feedback: Only direct edges require opposite colors. (misconception: path-endpoints-must-differ)
- ❌ [true-adjacent] "color {0,1} together and {2,3} together"
    feedback: Edges 0—1 and 2—3 would stay inside groups. (misconception: invalid-coloring)
"Why" shown after success: Correct. Every edge crosses the split.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-isolated`, facet "all vertices")
Raw input shown:
```
graph = [[],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Each isolated vertex can belong to either group without conflict.
- ❌ [near-miss] "false"
    feedback: That result follows the require every node to have opposite neighbor bug, not the exact picture. (misconception: require-every-node-to-have-opposite-neighbor)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1" · edges: none
"Why" shown after success: Each isolated vertex can belong to either group without conflict.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "two-color consistency")
Raw input shown:
```
graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / two colors cannot satisfy all three edges
2. B / put two nodes together and one apart
3. C / use a third color
4. D / the graph is disconnected
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "two colors cannot satisfy all three edges"
    feedback: Correct. The third edge forces a same-color conflict.
- ❌ [true-two-one] "put two nodes together and one apart"
    feedback: The two together share an edge and violate the rule. (misconception: ignore-inside-edge)
- ❌ [true-three-colors] "use a third color"
    feedback: The problem allows exactly two groups/colors. (misconception: allow-third-color)
- ❌ [false-disconnected] "the graph is disconnected"
    feedback: The triangle is connected; its odd cycle is the reason it fails. (misconception: wrong-failure-reason)
"Why" shown after success: Correct. The third edge forces a same-color conflict.
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
graph = [[1],[0,2],[1]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. A path alternates colors with no conflict.; ❌ "false" — That result follows the reject three vertex component bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [connected-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Nodes 0, 1, and isolated node 2.
Your choice: An isolated node still belongs to the graph and can be placed in either color group.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
graph = [[],[2,3],[1,3],[1,2]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Node 0 is isolated, but nodes 1–3 form a non-bipartite triangle.; ❌ "true" — That result follows the skip index with empty zero component bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 1—2, 1—3, 2—3
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [two-arrows]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One undirected line 0—1, whose endpoints must receive opposite colors.
Your choice: The input represents one undirected graph edge, not two independent directed constraints.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
graph = [[1],[0]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The symmetric adjacency entries describe one undirected conflict edge.; ❌ "false" — That result follows the require two directed edges in model bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [false-cycle]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
color {0,2} one color and {1,3} the other
Your choice: Even cycles are bipartite; odd cycles are the problem.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
graph = [[1,3],[0,2],[1,3,4],[0,2],[2]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. The square alternates; the tail simply takes the color opposite node 2.; ❌ "false" — That result follows the treat tail as third group bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—3, 1—2, 2—3, 2—4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [true-two-one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
two colors cannot satisfy all three edges
Your choice: The two together share an edge and violate the rule.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
graph = [[1],[0],[3,4],[2,4],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. A correct algorithm must start a color search in every uncolored component.; ❌ "true" — That result follows the start dfs only at zero bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3, 2—4, 3—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Neighbor relation halved"; authored goal, NOT shown to student: "Orient the written pair away from the traversal the coloring check needs.")
Everything the student sees (text):
```
E
Eden's broken search

Eden allows each two-way link to work only in its written order.

Your main goal: Expose Eden's mistake. Draw two graphs: first the correct graph, then Eden's graph using the mistake.

CHOOSE THE COLORING START
coloring start
OUTPUT
CORRECT OUTPUT
EDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose coloring start
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
2 · Eden's graph
Check my graph
→
```
Start field: label "CHOOSE THE COLORING START / coloring start", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3"): accepted
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
EDEN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `skip-leaf-edges` (authored level "Leaf colors forgotten"; authored goal, NOT shown to student: "Attach degree-one neighbors whose opposite colors still matter.")
Everything the student sees (text):
```
R
Rohan's broken search

Rohan erases the outer leaves before searching.

Your main goal: Expose Rohan's mistake. Draw two graphs: first the correct graph, then Rohan's graph using the mistake.

CHOOSE THE COLORING START
coloring start
OUTPUT
CORRECT OUTPUT
ROHAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose coloring start
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
2 · Rohan's graph
Check my graph
→
```
Start field: label "CHOOSE THE COLORING START / coloring start", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ROHAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
ROHAN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Final color branch only"; authored goal, NOT shown to student: "Branch from one node so an earlier neighbor is lost when only the last route is followed.")
Everything the student sees (text):
```
N
Nora's broken search

Nora chooses the final listed route and never returns.

Your main goal: Expose Nora's mistake. Draw two graphs: first the correct graph, then Nora's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE COLORING START
coloring start
OUTPUT
CORRECT OUTPUT
NORA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose coloring start
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
2 · Nora's graph
Check my graph
→
```
Start field: label "CHOOSE THE COLORING START / coloring start", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NORA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
NORA'S OUTPUT
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
graph = [[1],[0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Exactly two nodes: one red team and one blue team.”"
    feedback if wrong: The teams are color assignments applied to graph nodes; they are not the nodes themselves. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The teams are color assignments applied to graph nodes; they are not the nodes themselves. Correct node rule: One node for every adjacency-list index, including isolated nodes.
×
Correct. The mini-example lists 0—1 as one direct edge.
×
1 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "0 has exactly 2 direct neighbors."
    feedback if wrong: 0 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each written neighbor entry, so two separate copies for the 0—1 relationship.”"
    feedback if wrong: The symmetric entries describe the same two vertex nodes and the same undirected edge. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
0 has 1 direct neighbor.
×
The symmetric entries describe the same two vertex nodes and the same undirected edge. Correct node rule: One node for every adjacency-list index, including isolated nodes.
×
The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes 0 and 1 because node 2 has no neighbors.”"
    feedback if wrong: An isolated node still belongs to the graph and can be placed in either color group. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 0 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
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
graph = [[1,3],[0,2],[1,3,4],[0,2],[2]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—3, 1—2, 2—3, 2—4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "2 has exactly 3 direct neighbors."
    feedback if wrong: 2 has 3 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each written neighbor entry, so two separate copies for the 0—1 relationship.”"
    feedback if wrong: The symmetric entries describe the same two vertex nodes and the same undirected edge. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 0, but the graph still has no direct 1—3 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
graph = [[1],[0],[3,4],[2,4],[2,3]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3, 2—4, 3—4
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Exactly two nodes: one red team and one blue team.”"
    feedback if wrong: The teams are color assignments applied to graph nodes; they are not the nodes themselves. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [YES is correct] (direct-vs-reach) "3 and 4 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 3—4 as one direct edge.
- [YES is correct] (local-degree) "4 has exactly 2 direct neighbors."
    feedback if wrong: 4 has 2 direct neighbors.
Result: PASSED

### S3 Q4
Raw input shown:
```
graph = [[1],[0,2],[1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes 0 and 1 because node 2 has no neighbors.”"
    feedback if wrong: An isolated node still belongs to the graph and can be placed in either color group. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0—2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
graph = [[],[2,3],[1,3],[1,2]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 1—2, 1—3, 2—3
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each written neighbor entry, so two separate copies for the 0—1 relationship.”"
    feedback if wrong: The symmetric entries describe the same two vertex nodes and the same undirected edge. Correct node rule: One node for every adjacency-list index, including isolated nodes.
- [NO is correct] (direct-vs-reach) "2 can reach 3, but there is no direct 2—3 edge."
    feedback if wrong: The mini-example lists 2—3 as one direct edge. A direct edge is different from a longer reachable route.
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

### S4 case 1 — `authored-deep-case` · bug: Only the component containing node 0 is checked
Input shown:
```
REAL PROBLEM INPUT
graph = [[1],[0],[3,4],[2,4],[2,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function isBipartite(graph) {
  const color = Array(graph.length).fill(0);
  color[0] = 1;
  const stack = [0];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (color[next] === color[node]) {
        return false;
      }
      if (color[next] === 0) {
        color[next] = -color[node];
        stack.push(next);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3, 3—4, 4—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the whole graph is bipartite" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A It never starts a coloring search in unvisited components.
- B Using 1 and -1 as colors causes the error on the shown input.
- C Any cycle makes a graph non-bipartite for the shown graph.
Diagnosis answer key + feedback:
- ✅ [one-component] "It never starts a coloring search in unvisited components." — feedback: Correct. Nodes 2, 3, and 4 form an odd cycle that cannot use two colors.
- ❌ [color-sign] "Using 1 and -1 as colors causes the error on the shown input." — feedback: No. Opposite signs are a valid two-color representation.
- ❌ [undirected-cycle] "Any cycle makes a graph non-bipartite for the shown graph." — feedback: No. Even cycles are bipartite; specifically an odd cycle is the problem.
Graph proof shown in feedback: code rule "Coloring begins only at node 0, so only its component is inspected." → changed graph "There are two components: the edge 0—1 and the triangle 2—3—4—2." → boundary "The non-bipartite odd cycle is disconnected from node 0." → returned value "The checked component is valid, so the code returns true while the full graph is not bipartite."
Output-format probes: ❌ Capitalized boolean → `True`; ❌ trailing period → `true.`
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
About your diagnosis: No. Opposite signs are a valid two-color representation.
Code rule: Coloring begins only at node 0, so only its component is inspected. → Changed graph: There are two components: the edge 0—1 and the triangle 2—3—4—2. → Reachable boundary: The non-bipartite odd cycle is disconnected from node 0.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the component containing node 0 is checked
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Coloring begins only at node 0, so only its component is inspected. → Changed graph: There are two components: the edge 0—1 and the triangle 2—3—4—2. → Reachable boundary: The non-bipartite odd cycle is disconnected from node 0. → Returned value: The checked component is valid, so the code returns true while the full graph is not bipartite.
```

### S4 case 2 — `remedial-2` · bug: Only the component containing node 0 is checked
Input shown:
```
REAL PROBLEM INPUT
graph = [[],[2,3],[1,3],[1,2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function isBipartite(graph) {
  const color = Array(graph.length).fill(0);
  color[0] = 1;
  const stack = [0];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (color[next] === color[node]) {
        return false;
      }
      if (color[next] === 0) {
        color[next] = -color[node];
        stack.push(next);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 1—2, 1—3, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the whole graph is bipartite" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Using 1 and -1 as colors causes the error on the shown input.
- B It never starts a coloring search in unvisited components.
- C Any cycle makes a graph non-bipartite for the shown graph.
Diagnosis answer key + feedback:
- ✅ [one-component] "It never starts a coloring search in unvisited components." — feedback: Correct. Node 0 is isolated, while disconnected nodes 1,2,3 form an odd triangle; starting only at 0 never inspects the conflicting component. Therefore the shown code returns true, while the real problem returns false.
- ❌ [color-sign] "Using 1 and -1 as colors causes the error on the shown input." — feedback: No. Opposite signs are a valid two-color representation.
- ❌ [undirected-cycle] "Any cycle makes a graph non-bipartite for the shown graph." — feedback: No. Even cycles are bipartite; specifically an odd cycle is the problem.
Graph proof shown in feedback: code rule "Coloring begins only at node 0, so only its component is inspected." → changed graph "Nodes: 0, 1, 2, 3. Direct edges: 1—2; 1—3; 2—3." → boundary "Node 0 is isolated, while disconnected nodes 1,2,3 form an odd triangle; starting only at 0 never inspects the conflicting component." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the component containing node 0 is checked
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Coloring begins only at node 0, so only its component is inspected. → Changed graph: Nodes: 0, 1, 2, 3. Direct edges: 1—2; 1—3; 2—3. → Reachable boundary: Node 0 is isolated, while disconnected nodes 1,2,3 form an odd triangle; starting only at 0 never inspects the conflicting component. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

### S4 case 3 — `odd-cycle-after-isolate` · bug: Only the component containing node 0 is checked
Input shown:
```
REAL PROBLEM INPUT
graph = [[],[2],[1],[4,5],[3,5],[3,4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function isBipartite(graph) {
  const color = Array(graph.length).fill(0);
  color[0] = 1;
  const stack = [0];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (color[next] === color[node]) {
        return false;
      }
      if (color[next] === 0) {
        color[next] = -color[node];
        stack.push(next);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 1—2, 3—4, 4—5, 5—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the whole graph is bipartite" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Using 1 and -1 as colors causes the error on the shown input.
- B Any cycle makes a graph non-bipartite for the shown graph.
- C It never starts a coloring search in unvisited components.
Diagnosis answer key + feedback:
- ✅ [one-component] "It never starts a coloring search in unvisited components." — feedback: Correct. Starting only at node 0 sees an isolate and misses the odd cycle among nodes 3, 4, and 5. Therefore the shown code returns true, while the real problem returns false.
- ❌ [color-sign] "Using 1 and -1 as colors causes the error on the shown input." — feedback: No. Opposite signs are a valid two-color representation.
- ❌ [undirected-cycle] "Any cycle makes a graph non-bipartite for the shown graph." — feedback: No. Even cycles are bipartite; specifically an odd cycle is the problem.
Graph proof shown in feedback: code rule "Coloring begins only at node 0, so only its component is inspected." → changed graph "Nodes: 0, 1, 2, 3, 4, 5. Direct edges: 1—2; 3—4; 4—5; 5—3." → boundary "Starting only at node 0 sees an isolate and misses the odd cycle among nodes 3, 4, and 5." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only the component containing node 0 is checked
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Coloring begins only at node 0, so only its component is inspected. → Changed graph: Nodes: 0, 1, 2, 3, 4, 5. Direct edges: 1—2; 3—4; 4—5; 5—3. → Reachable boundary: Starting only at node 0 sees an isolate and misses the odd cycle among nodes 3, 4, and 5. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```