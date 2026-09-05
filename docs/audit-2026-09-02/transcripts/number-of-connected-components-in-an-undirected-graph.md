# Number of Connected Components in an Undirected Graph (`number-of-connected-components-in-an-undirected-graph`) — original, undirected-graph

## Problem statement (Description tab)

You are given an undirected graph with `n` nodes, labeled from `0` to `n - 1`. You are also given a list `edges`, where each entry `edges[i] = [a, b]` means there is an edge connecting node `a` and node `b` (you can travel across it in either direction).

A **connected component** is a group of nodes where every node can reach every other node in the group by walking along edges. A node with no edges at all forms a connected component all by itself.

Return the number of connected components in the graph.

### Examples
- Example 1: input `n = 5, edges = [[0,1],[1,2],[3,4]]` → output `2`. Nodes 0, 1, and 2 are all linked together, forming one component. Nodes 3 and 4 form a second component.
- Example 2: input `n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]` → output `1`. Every node can reach every other node through the chain 0-1-2-3-4, so the whole graph is one component.
- Example 3: input `n = 4, edges = []` → output `4`. There are no edges, so each of the 4 nodes is its own separate component.

### Graph rules (authored)
- Nodes: Nodes 0, 1, 2, 3, and 4.
- Edges: Two-way lines 0—1 and 1—2, with no direct line 0—2.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-two`, facet "component count")
Raw input shown:
```
n = 5, edges = [[0,1],[1,2],[3,4]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Nodes 0–2 form one component and nodes 3–4 form another.
- ❌ [near-miss] "3"
    feedback: That result follows the count edges instead of components bug, not the exact picture. (misconception: count-edges-instead-of-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 3—4
"Why" shown after success: Nodes 0–2 form one component and nodes 3–4 form another.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-connected`, facet "two-way edges")
Raw input shown:
```
n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Every node is linked through the chain.
- ❌ [near-miss] "5"
    feedback: That result follows the count each node bug, not the exact picture. (misconception: count-each-node)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—3, 3—4
"Why" shown after success: Every node is linked through the chain.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact edge list")
Raw input shown:
```
n = 5, edges = [[0,1],[1,2],[3,4]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3 / 4
2. Picture B / 0 / 1 / 2 / 3 / 4
3. Picture C / 0 / 1 / 2 / 3 / 4
4. Picture D / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2, 3—4
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 1→2, 3→4
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—2
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-isolated`, facet "all n nodes")
Raw input shown:
```
n = 4, edges = []
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. Each isolated node is its own component.
- ❌ [near-miss] "0"
    feedback: That result follows the count only edge components bug, not the exact picture. (misconception: count-only-edge-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: none
"Why" shown after success: Each isolated node is its own component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "all n nodes")
Raw input shown:
```
For `n = 5` and `edges = [[0,1],[1,2]]`, what is the complete node set?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n = 5 and edges = [[0,1],[1,2]], what is the complete node set?**
Choices as displayed (top to bottom):
1. A / Nodes 0, 1, and 2 only.
2. B / Two nodes: one for edge [0,1] and one for edge [1,2].
3. C / Nodes 0, 1, 2, 3, and 4.
4. D / Three nodes: connected group {0,1,2}, isolated 3, and isolated 4.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-five] "Nodes 0, 1, 2, 3, and 4."
    feedback: Correct. Isolated nodes 3 and 4 each form their own component.
- ❌ [listed-only] "Nodes 0, 1, and 2 only."
    feedback: That loses isolated nodes and undercounts the components. (misconception: omit-isolated-components)
- ❌ [two-components] "Two nodes: one for edge [0,1] and one for edge [1,2]."
    feedback: Edges connect vertex nodes. They are not themselves the items being grouped. (misconception: edge-as-node)
- ❌ [three-groups] "Three nodes: connected group {0,1,2}, isolated 3, and isolated 4."
    feedback: Those are the final components. The graph must first contain five individual vertex nodes. (misconception: component-as-node)
"Why" shown after success: Correct. Isolated nodes 3 and 4 each form their own component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-cycle`, facet "component count")
Raw input shown:
```
n = 3, edges = [[0,1],[1,2],[2,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A cycle is still one connected component.
- ❌ [near-miss] "3"
    feedback: That result follows the count dfs back edges bug, not the exact picture. (misconception: count-dfs-back-edges)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2, 2—0
"Why" shown after success: A cycle is still one connected component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "two-way edges")
Raw input shown:
```
What connections are created by `edges = [[0,1],[1,2]]`?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What connections are created by edges = [[0,1],[1,2]]?**
Choices as displayed (top to bottom):
1. A / Two-way lines 0—1 and 1—2, with no direct line 0—2.
2. B / Lines 0—1, 1—2, and 0—2 because all three are in one component.
3. C / Arrows 0→1 and 1→2 only.
4. D / Also connect node 2 to isolated nodes 3 and 4 so every node belongs to a group.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-lines] "Two-way lines 0—1 and 1—2, with no direct line 0—2."
    feedback: Correct. Nodes 0 and 2 share a path but not an input edge.
- ❌ [triangle] "Lines 0—1, 1—2, and 0—2 because all three are in one component."
    feedback: Being connected by a path does not create the missing direct edge 0—2. (misconception: complete-the-component)
- ❌ [arrows] "Arrows 0→1 and 1→2 only."
    feedback: The graph is undirected, so each listed pair can be crossed both ways. (misconception: treat-edge-list-as-directed)
- ❌ [isolated-bridges] "Also connect node 2 to isolated nodes 3 and 4 so every node belongs to a group."
    feedback: An isolated node is already a one-node component. Invented bridges change the required answer. (misconception: attach-isolated-nodes)
"Why" shown after success: Correct. Nodes 0 and 2 share a path but not an input edge.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "component count")
Raw input shown:
```
n = 5, edges = [[0,1],[1,2],[3,4]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n=5, edges=[[0,1],[1,2],[3,4]], how many components appear?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 1
3. C / 2
4. D / 5
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2"
    feedback: Correct: {0,1,2} and {3,4}.
- ❌ [three] "3"
    feedback: This mistakes the three listed edges for three groups. (misconception: count-edges)
- ❌ [one] "1"
    feedback: No edge joins the two pictured groups. (misconception: assume-connected)
- ❌ [five] "5"
    feedback: Connected vertices do not each remain separate components. (misconception: count-nodes)
"Why" shown after success: Correct: {0,1,2} and {3,4}.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "component count")
Raw input shown:
```
n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the component count for chain 0—1—2—3—4?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 4
3. C / 5
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1"
    feedback: Correct. Every node can reach every other through the chain.
- ❌ [four] "4"
    feedback: This counts edges, not connected groups. (misconception: count-edges)
- ❌ [five] "5"
    feedback: A component may contain many nodes connected indirectly. (misconception: count-nodes)
- ❌ [two] "2"
    feedback: The middle edge connects the left and right portions into one group. (misconception: split-chain)
"Why" shown after success: Correct. Every node can reach every other through the chain.
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
n = 3, edges = [[0,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The connected pair and isolated node 2 make two components.; ❌ "1" — That result follows the drop isolated node bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [listed-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Nodes 0, 1, 2, 3, and 4.
Your choice: That loses isolated nodes and undercounts the components.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
n = 5, edges = [[0,1],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Node 4 exists despite never appearing in an edge.; ❌ "2" — That result follows the build nodes only from edges bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [triangle]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Two-way lines 0—1 and 1—2, with no direct line 0—2.
Your choice: Being connected by a path does not create the missing direct edge 0—2.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
n = 3, edges = [[1,0],[2,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 1
Remedial answer key: ✅ "1" — Correct. Undirected edges connect all three nodes regardless of pair order.; ❌ "3" — That result follows the treat pairs as directed bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0, 2—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: This mistakes the three listed edges for three groups.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
n = 6, edges = [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 6
Remedial answer key: ✅ "2" — Correct. Each triangle is one component.; ❌ "6" — That result follows the count cycle edges bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 1—2, 2—0, 3—4, 4—5, 5—3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: This counts edges, not connected groups.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n = 4, edges = [[0,1],[1,2],[2,0]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The triangle is one component and isolated node 3 is another.; ❌ "1" — That result follows the assume n minus edges bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Component split by order"; authored goal, NOT shown to student: "List a two-way edge opposite the direction needed from the component seed.")
Everything the student sees (text):
```
H
Hailey's broken search

Hailey allows each two-way link to work only in its written order.

Your main goal: Expose Hailey's mistake. Draw two graphs: first the correct graph, then Hailey's graph using the mistake.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
HAILEY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose component seed
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
2 · Hailey's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | HAILEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
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
HAILEY'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Component split too soon"; authored goal, NOT shown to student: "Let the final listed link be the bridge to one more node.")
Everything the student sees (text):
```
B
Benjamin's broken search

Benjamin builds every listed connection except the last one.

Your main goal: Expose Benjamin's mistake. Draw two graphs: first the correct graph, then Benjamin's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
BENJAMIN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose component seed
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
2 · Benjamin's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BENJAMIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
BENJAMIN'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Partial component"; authored goal, NOT shown to student: "Build a branching component where a full DFS must return and explore again.")
Everything the student sees (text):
```
A
Anna's broken search

Anna chooses the first route and forgets the other branches.

Your main goal: Expose Anna's mistake. Draw two graphs: first the correct graph, then Anna's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
ANNA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose component seed
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
2 · Anna's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ANNA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
ANNA'S OUTPUT
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
n = 5, edges = [[0,1],[2,3]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Two nodes: one for edge [0,1] and one for edge [1,2].”"
    feedback if wrong: Edges connect vertex nodes. They are not themselves the items being grouped. Correct node rule: One node for every vertex ID from 0 through n−1.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
×
1 has 1 direct neighbor.
×
Edges connect vertex nodes. They are not themselves the items being grouped. Correct node rule: One node for every vertex ID from 0 through n−1.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "2 and 3 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2—3 as one direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Three nodes: connected group {0,1,2}, isolated 3, and isolated 4.”"
    feedback if wrong: Those are the final components. The graph must first contain five individual vertex nodes. Correct node rule: One node for every vertex ID from 0 through n−1.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. The mini-example lists 2—3 as one direct edge.
×
0 has 1 direct neighbor.
×
Those are the final components. The graph must first contain five individual vertex nodes. Correct node rule: One node for every vertex ID from 0 through n−1.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Nodes 0, 1, and 2 only.”"
    feedback if wrong: That loses isolated nodes and undercounts the components. Correct node rule: One node for every vertex ID from 0 through n−1.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
- [YES is correct] (local-degree) "4 has exactly 0 direct neighbors."
    feedback if wrong: 4 has 0 direct neighbors.
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
n = 3, edges = [[1,0],[2,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0, 2—1
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Three nodes: connected group {0,1,2}, isolated 3, and isolated 4.”"
    feedback if wrong: Those are the final components. The graph must first contain five individual vertex nodes. Correct node rule: One node for every vertex ID from 0 through n−1.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—1 and 1—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
n = 6, edges = [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 1—2, 2—0, 3—4, 4—5, 5—3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "4 and 5 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 4—5 as one direct edge.
- [YES is correct] (local-degree) "4 has exactly 2 direct neighbors."
    feedback if wrong: 4 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Two nodes: one for edge [0,1] and one for edge [1,2].”"
    feedback if wrong: Edges connect vertex nodes. They are not themselves the items being grouped. Correct node rule: One node for every vertex ID from 0 through n−1.
Result: PASSED

### S3 Q4
Raw input shown:
```
n = 4, edges = [[0,1],[1,2],[2,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Nodes 0, 1, and 2 only.”"
    feedback if wrong: That loses isolated nodes and undercounts the components. Correct node rule: One node for every vertex ID from 0 through n−1.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
n = 3, edges = [[0,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Three nodes: connected group {0,1,2}, isolated 3, and isolated 4.”"
    feedback if wrong: Those are the final components. The graph must first contain five individual vertex nodes. Correct node rule: One node for every vertex ID from 0 through n−1.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Edge pairs become one-way arrows
Input shown:
```
REAL PROBLEM INPUT
n = 4, edges = [[1,0],[2,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countComponents(n, edges) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set();
  let groups = 0;
  for (let start = 0; start < numberOfNodes; start++) {
    if (visited.has(start)) {
      continue;
    }
    groups++;
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      for (const next of graph[stack.pop()]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 1—0, 2—1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of connected components" · expected buggy output `4` · real correct output `2`
Diagnosis choices as displayed:
- A Isolated node 3 should not count as a component, which changes the returned value here.
- B The outer loop starts a second search from nodes that the earlier search already reached in this case.
- C Each undirected pair must enter both adjacency lists, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [directed-storage] "Each undirected pair must enter both adjacency lists, changing this input's returned value." — feedback: Correct. Nodes 0, 1, and 2 are one component regardless of how each pair is ordered.
- ❌ [exclude-isolated] "Isolated node 3 should not count as a component, which changes the returned value here." — feedback: No. A lone node is a valid one-node component.
- ❌ [needs-union-find] "The outer loop starts a second search from nodes that the earlier search already reached in this case." — feedback: No. The seen check prevents a new component count for every node reached earlier.
Graph proof shown in feedback: code rule "Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order." → changed graph "The undirected edges form component {0,1,2}, while node 3 forms a second component." → boundary "Each later node points to an already counted earlier node, so no earlier search can discover it." → returned value "Every node starts a new search and the code returns 4 instead of 2."
Output-format probes: ❌ quoted number → `"4"`; ❌ trailing period → `4.`
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
About your diagnosis: No. A lone node is a valid one-node component.
Code rule: Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order. → Changed graph: The undirected edges form component {0,1,2}, while node 3 forms a second component. → Reachable boundary: Each later node points to an already counted earlier node, so no earlier search can discover it.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Edge pairs become one-way arrows
INCORRECT OUTPUT
4
CORRECT OUTPUT
2
Code rule: Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order. → Changed graph: The undirected edges form component {0,1,2}, while node 3 forms a second component. → Reachable boundary: Each later node points to an already counted earlier node, so no earlier search can discover it. → Returned value: Every node starts a new search and the code returns 4 instead of 2.
```

### S4 case 2 — `remedial-3` · bug: Edge pairs become one-way arrows
Input shown:
```
REAL PROBLEM INPUT
n = 3, edges = [[1,0],[2,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countComponents(n, edges) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set();
  let groups = 0;
  for (let start = 0; start < numberOfNodes; start++) {
    if (visited.has(start)) {
      continue;
    }
    groups++;
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      for (const next of graph[stack.pop()]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0, 2—1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of connected components" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A Each undirected pair must enter both adjacency lists, changing this input's returned value.
- B Isolated nodes should not count as connected components.
- C The outer loop starts a second search from nodes that the earlier search already reached in this case.
Diagnosis answer key + feedback:
- ✅ [directed-storage] "Each undirected pair must enter both adjacency lists, changing this input's returned value." — feedback: Correct. Pairs [1,0] and [2,1] form one undirected component 0—1—2; one-way arrows point opposite the ascending outer scan and produce three false starts. Therefore the shown code returns 3, while the real problem returns 1.
- ❌ [exclude-isolated] "Isolated nodes should not count as connected components." — feedback: A lone node is a valid one-node component and must remain in the component count.
- ❌ [needs-union-find] "The outer loop starts a second search from nodes that the earlier search already reached in this case." — feedback: No. The seen check prevents a new component count for every node reached earlier.
Graph proof shown in feedback: code rule "Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order." → changed graph "Nodes: 0, 1, 2. Direct edges: 1—0; 2—1." → boundary "Pairs [1,0] and [2,1] form one undirected component 0—1—2; one-way arrows point opposite the ascending outer scan and produce three false starts." → returned value "The shown code returns 3; the source-repo reference solution returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Edge pairs become one-way arrows
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order. → Changed graph: Nodes: 0, 1, 2. Direct edges: 1—0; 2—1. → Reachable boundary: Pairs [1,0] and [2,1] form one undirected component 0—1—2; one-way arrows point opposite the ascending outer scan and produce three false starts. → Returned value: The shown code returns 3; the source-repo reference solution returns 1.
```

### S4 case 3 — `two-reverse-written-components` · bug: Edge pairs become one-way arrows
Input shown:
```
REAL PROBLEM INPUT
n = 5, edges = [[1,0],[2,1],[4,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function countComponents(n, edges) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set();
  let groups = 0;
  for (let start = 0; start < numberOfNodes; start++) {
    if (visited.has(start)) {
      continue;
    }
    groups++;
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      for (const next of graph[stack.pop()]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 1—0, 2—1, 4—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Number of connected components" · expected buggy output `5` · real correct output `2`
Diagnosis choices as displayed:
- A Isolated nodes should not count as connected components.
- B Each undirected pair must enter both adjacency lists, changing this input's returned value.
- C The outer loop starts a second search from nodes that the earlier search already reached in this case.
Diagnosis answer key + feedback:
- ✅ [directed-storage] "Each undirected pair must enter both adjacency lists, changing this input's returned value." — feedback: Correct. The exact graph has components {0,1,2} and {3,4}; one-way storage makes every low-numbered scan start look separate. Therefore the shown code returns 5, while the real problem returns 2.
- ❌ [exclude-isolated] "Isolated nodes should not count as connected components." — feedback: A lone node is a valid one-node component and must remain in the component count.
- ❌ [needs-union-find] "The outer loop starts a second search from nodes that the earlier search already reached in this case." — feedback: No. The seen check prevents a new component count for every node reached earlier.
Graph proof shown in feedback: code rule "Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order." → changed graph "Nodes: 0, 1, 2, 3, 4. Direct edges: 1—0; 2—1; 4—3." → boundary "The exact graph has components {0,1,2} and {3,4}; one-way storage makes every low-numbered scan start look separate." → returned value "The shown code returns 5; the source-repo reference solution returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Edge pairs become one-way arrows
INCORRECT OUTPUT
5
CORRECT OUTPUT
2
Code rule: Only arrows 1→0 and 2→1 are stored, and starts are tested in ascending order. → Changed graph: Nodes: 0, 1, 2, 3, 4. Direct edges: 1—0; 2—1; 4—3. → Reachable boundary: The exact graph has components {0,1,2} and {3,4}; one-way storage makes every low-numbered scan start look separate. → Returned value: The shown code returns 5; the source-repo reference solution returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```