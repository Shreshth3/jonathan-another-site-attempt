# Network Delay Time (`network-delay-time`) — original, directed-graph

## Problem statement (Description tab)

You have a network of `n` nodes, labeled from `1` to `n`. You are given a list `times`, where each entry `times[i] = [ui, vi, wi]` describes a **one-way** wire: a signal sent from node `ui` reaches node `vi` after `wi` units of time.

At time `0`, a signal is sent out from node `k`. The signal travels along every outgoing wire at once, and a node passes the signal along the moment it receives it.

Return the time at which **all** `n` nodes have received the signal. If some node can never receive it, return `-1`.

### Examples
- Example 1: input `times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2` → output `2`. Nodes 1 and 3 hear the signal at time 1, and node 4 hears it at time 2 (through node 3). Everyone has it by time 2.
- Example 2: input `times = [[1,2,1]], n = 2, k = 1` → output `1`. The signal travels from node 1 to node 2 in 1 unit of time.
- Example 3: input `times = [[1,2,1]], n = 2, k = 2` → output `-1`. The only wire points INTO node 2, so a signal starting at node 2 can never reach node 1.

### Graph rules (authored)
- Nodes: Nodes 1, 2, 3, and 4, including any node with no wire.
- Edges: A one-way arrow 1→3 labeled 5.
- Node-name format shown in Step 1/3: Use each node's 1-based number only. Example: `2`. (pattern `^[1-9]\d*$`)
- Step 2 node-label rule: `contiguous-one` — Use numeric IDs 1, 2, 3, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-branch`, facet "maximum shortest time")
Raw input shown:
```
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Shortest arrival times are 0,1,1,2; the slowest is 2.
- ❌ [near-miss] "3"
    feedback: That result follows the sum all edge times bug, not the exact picture. (misconception: sum-all-edge-times)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3", "4" · edges: 2→1 (weight/label "1"), 2→3 (weight/label "1"), 3→4 (weight/label "1")
"Why" shown after success: Shortest arrival times are 0,1,1,2; the slowest is 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-unreachable`, facet "all n nodes")
Raw input shown:
```
times = [[1,2,1]], n = 2, k = 2
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. -1
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-1"
    feedback: Correct. Starting at 2 cannot traverse the incoming edge from 1.
- ❌ [near-miss] "1"
    feedback: That result follows the reverse directed edge bug, not the exact picture. (misconception: reverse-directed-edge)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2" · edges: 1→2 (weight/label "1")
"Why" shown after success: Starting at 2 cannot traverse the incoming edge from 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact weighted arcs")
Raw input shown:
```
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 1 / 1 / 1 / 2 / 3 / 4
2. Picture C / 1 / 1 / 1 / 1 / 2 / 3 / 4
3. Picture D / 1 / 1 / 1 / 2 / 3
4. Picture A / 1 / 1 / 1 / 1 / 2 / 3 / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 1, 2, 3, 4 · edges: 2→1 (1), 2→3 (1), 3→4 (1)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 1, 2, 3, 4 · edges: 2→1 (1), 2→3 (1)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 1, 2, 3, 4 · edges: 1→2 (1), 3→2 (1), 4→3 (1)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 1, 2, 3 · edges: 2→1 (1), 2→3 (1)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "all n nodes")
Raw input shown:
```
For `n = 4` and signal start `k = 2`, which network nodes should be drawn?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n = 4 and signal start k = 2, which network nodes should be drawn?**
Choices as displayed (top to bottom):
1. A / Only node 2 and nodes reachable from it.
2. B / One node for each travel time value appearing in times.
3. C / Only labels that appear in a [u,v,w] wire entry.
4. D / Nodes 1, 2, 3, and 4, including any node with no wire.
Answer key + feedback per choice (data):
- ✅ CORRECT [one-through-four] "Nodes 1, 2, 3, and 4, including any node with no wire."
    feedback: Correct. Every label from 1 through n must receive the signal for success.
- ❌ [from-k] "Only node 2 and nodes reachable from it."
    feedback: An unreachable node must remain visible so the algorithm can return -1. (misconception: omit-unreachable-network-node)
- ❌ [wire-times] "One node for each travel time value appearing in `times`."
    feedback: Travel times are weights on wires. The numbered network locations are the nodes. (misconception: weight-as-node)
- ❌ [wire-endpoints] "Only labels that appear in a `[u,v,w]` wire entry."
    feedback: n may define isolated nodes that appear in no entry, and those make full delivery impossible. (misconception: drop-isolated-network-node)
"Why" shown after success: Correct. Every label from 1 through n must receive the signal for success.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-better-route`, facet "exact weighted arcs")
Raw input shown:
```
times = [[1,2,10],[1,3,2],[3,2,2]], n = 3, k = 1
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 10
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. Node 2 arrives in 4 through node 3, cheaper than the direct time 10.
- ❌ [near-miss] "10"
    feedback: That result follows the use first or direct path bug, not the exact picture. (misconception: use-first-or-direct-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "10"), 1→3 (weight/label "2"), 3→2 (weight/label "2")
"Why" shown after success: Node 2 arrives in 4 through node 3, cheaper than the direct time 10.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "one-way travel times")
Raw input shown:
```
How should the wire `[1,3,5]` be drawn?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should the wire [1,3,5] be drawn?**
Choices as displayed (top to bottom):
1. A / A one-way arrow 3→1 labeled 5.
2. B / A two-way line 1—3 labeled 5.
3. C / A one-way arrow 1→3 labeled 5.
4. D / Five parallel arrows from 1 to 3, one for each time unit.
Answer key + feedback per choice (data):
- ✅ CORRECT [weighted-arrow] "A one-way arrow 1→3 labeled 5."
    feedback: Correct. The signal travels from 1 to 3 in five time units.
- ❌ [reverse-arrow] "A one-way arrow 3→1 labeled 5."
    feedback: The first endpoint is the sender and the second is the receiver. (misconception: reverse-wire)
- ❌ [two-way-wire] "A two-way line 1—3 labeled 5."
    feedback: The times input is directed. A wire into node 3 does not provide a route back out to node 1. (misconception: make-wire-undirected)
- ❌ [five-edges] "Five parallel arrows from 1 to 3, one for each time unit."
    feedback: The value 5 is one edge's cost, not the number of edges. (misconception: weight-as-edge-count)
"Why" shown after success: Correct. The signal travels from 1 to 3 in five time units.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "maximum shortest time")
Raw input shown:
```
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For wires 2→1 (1), 2→3 (1), 3→4 (1), when has everyone heard from start 2?**
Choices as displayed (top to bottom):
1. A / Time 2
2. B / Time 1
3. C / Time 3
4. D / Time -1
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "Time 2"
    feedback: Correct. Node 4 is last, reached through node 3.
- ❌ [one] "Time 1"
    feedback: This checks only direct neighbors and misses node 4. (misconception: direct-neighbors-only)
- ❌ [three] "Time 3"
    feedback: Signals to nodes 1 and 3 travel in parallel, not one after another. (misconception: sum-parallel-branches)
- ❌ [minus-one] "Time -1"
    feedback: Every node is reachable from node 2. (misconception: miss-multistep-route)
"Why" shown after success: Correct. Node 4 is last, reached through node 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-single`, facet "maximum shortest time")
Raw input shown:
```
times = [], n = 1, k = 1
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The only node receives the signal at time zero.
- ❌ [near-miss] "-1"
    feedback: That result follows the require at least one edge bug, not the exact picture. (misconception: require-at-least-one-edge)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1" · edges: none
"Why" shown after success: The only node receives the signal at time zero.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "maximum shortest time")
Raw input shown:
```
times = [[1,2,1]], n = 2, k = 1
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For one wire 1→2 taking 1 unit, with start 1, what is the delay?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 0
3. C / 2
4. D / -1
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1"
    feedback: Correct. Node 2 receives at time 1.
- ❌ [zero] "0"
    feedback: Only the start knows at time 0; node 2 must wait for the wire. (misconception: ignore-edge-time)
- ❌ [two] "2"
    feedback: The answer is elapsed time, not the number of informed nodes. (misconception: count-nodes)
- ❌ [minus-one] "-1"
    feedback: The directed wire points from the start to node 2, so all nodes are reachable. (misconception: reverse-arrow)
"Why" shown after success: Correct. Node 2 receives at time 1.
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
times = [[1,2,3],[2,3,4]], n = 3, k = 1
```
Remedial question: **What should the function return?** · choices shown: 4 | 7
Remedial answer key: ✅ "7" — Correct. Node 3 receives the signal after cumulative time 7.; ❌ "4" — That result follows the take largest single edge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "3"), 2→3 (weight/label "4")
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [from-k]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Nodes 1, 2, 3, and 4, including any node with no wire.
Your choice: An unreachable node must remain visible so the algorithm can return -1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
times = [[1,2,1]], n = 3, k = 1
```
Remedial question: **What should the function return?** · choices shown: -1 | 1
Remedial answer key: ✅ "-1" — Correct. Node 3 still exists and never receives the signal.; ❌ "1" — That result follows the drop node not in times bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "1")
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [reverse-arrow]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A one-way arrow 1→3 labeled 5.
Your choice: The first endpoint is the sender and the second is the receiver.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
times = [[2,1,5]], n = 2, k = 1
```
Remedial question: **What should the function return?** · choices shown: 5 | -1
Remedial answer key: ✅ "-1" — Correct. The listed arc goes toward source 1, not away from it.; ❌ "5" — That result follows the treat times as undirected bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2" · edges: 2→1 (weight/label "5")
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Time 2
Your choice: This checks only direct neighbors and misses node 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
times = [[1,2,5],[1,3,1],[3,2,1]], n = 3, k = 1
```
Remedial question: **What should the function return?** · choices shown: 2 | 5
Remedial answer key: ✅ "2" — Correct. The route 1→3→2 delivers to node 2 at time 2.; ❌ "5" — That result follows the ignore relaxation bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "5"), 1→3 (weight/label "1"), 3→2 (weight/label "1")
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [zero]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: Only the start knows at time 0; node 2 must wait for the wire.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
times = [[1,2,9],[1,3,1],[3,2,1],[2,4,1]], n = 4, k = 1
```
Remedial question: **What should the function return?** · choices shown: 10 | 3
Remedial answer key: ✅ "3" — Correct. A later-discovered cheaper route to 2 must update 2 and then 4.; ❌ "10" — That result follows the mark visited before shorter path bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2 (weight/label "9"), 1→3 (weight/label "1"), 3→2 (weight/label "1"), 2→4 (weight/label "1")
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Wire sends backward"; authored goal, NOT shown to student: "Aim a wire toward the source so a false return direction reaches its sender.")
Everything the student sees (text):
```
G
Grace's broken search

Grace turns every arrow into a two-way connection.

Your main goal: Expose Grace's mistake. Draw two graphs: first the correct graph, then Grace's graph using the mistake.

CHOOSE THE SIGNAL SOURCE
signal source
OUTPUT
CORRECT OUTPUT
GRACE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose signal source
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
2 · Grace's graph
Check my graph
→
```
Start field: label "CHOOSE THE SIGNAL SOURCE / signal source", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | GRACE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2 · edges: 2—1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1`; ❌ curly braces → `{1}`; ❌ quoted numbers/strings → `["1"]`; ✅ spaces inside brackets → `[ 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
GRACE'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Only final wire followed"; authored goal, NOT shown to student: "Give the signal source two outgoing routes and put a receiver on the earlier one.")
Everything the student sees (text):
```
N
Nathan's broken search

Nathan follows only the last available branch and ignores earlier choices.

Your main goal: Expose Nathan's mistake. Draw two graphs: first the correct graph, then Nathan's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE SIGNAL SOURCE
signal source
OUTPUT
CORRECT OUTPUT
NATHAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose signal source
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
2 · Nathan's graph
Check my graph
→
```
Start field: label "CHOOSE THE SIGNAL SOURCE / signal source", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NATHAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,3,4]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1→2, 1→3, 3→4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,3,4]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3, 4 · edges: 1→2, 1→3, 3→4
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
NATHAN'S OUTPUT
[1,3,4]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Relay never forwards"; authored goal, NOT shown to student: "Require a middle node to relay the signal to a node two hops away.")
Everything the student sees (text):
```
T
Taylor's broken search

Taylor visits only the start and its direct neighboring nodes.

Your main goal: Expose Taylor's mistake. Draw two graphs: first the correct graph, then Taylor's graph using the mistake.

CHOOSE THE SIGNAL SOURCE
signal source
OUTPUT
CORRECT OUTPUT
TAYLOR’S OUTPUT
Drawing 1 of 2: Correct graph · Choose signal source
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
2 · Taylor's graph
Check my graph
→
```
Start field: label "CHOOSE THE SIGNAL SOURCE / signal source", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | TAYLOR’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 1→2, 2→3 · start 1
Grader's expected answers: correct output `[1,2,3]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 1→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3]
TAYLOR'S OUTPUT
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
times = [[1,2,3],[2,3,4]], n = 3, k = 1
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "3"), 2→3 (weight/label "4")
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only node 2 and nodes reachable from it.”"
    feedback if wrong: An unreachable node must remain visible so the algorithm can return -1. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→3, so it should also contain a direct 1→3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 outgoing direct edge.
×
An unreachable node must remain visible so the algorithm can return -1. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each travel time value appearing in `times`.”"
    feedback if wrong: Travel times are weights on wires. The numbered network locations are the nodes. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1→3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Travel times are weights on wires. The numbered network locations are the nodes. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
×
2 has 1 outgoing direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1→3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 0 outgoing direct edges."
    feedback if wrong: 3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only labels that appear in a `[u,v,w]` wire entry.”"
    feedback if wrong: n may define isolated nodes that appear in no entry, and those make full delivery impossible. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
×
Edge labels or weights match the input
```
Result: PASSED

### S3 Q2
Raw input shown:
```
times = [[1,2,1]], n = 3, k = 1
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "1")
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each travel time value appearing in `times`.”"
    feedback if wrong: Travel times are weights on wires. The numbered network locations are the nodes. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1→2 edge."
    feedback if wrong: The mini-example lists 1→2 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q3
Raw input shown:
```
times = [[2,1,5]], n = 2, k = 1
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2" · edges: 2→1 (weight/label "5")
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2→1 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only node 2 and nodes reachable from it.”"
    feedback if wrong: An unreachable node must remain visible so the algorithm can return -1. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
Result: PASSED

### S3 Q4
Raw input shown:
```
times = [[1,2,5],[1,3,1],[3,2,1]], n = 3, k = 1
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2 (weight/label "5"), 1→3 (weight/label "1"), 3→2 (weight/label "1")
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "3 can reach 2, but there is no direct 3→2 edge."
    feedback if wrong: The mini-example lists 3→2 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "3 has exactly 2 outgoing direct edges."
    feedback if wrong: 3 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only labels that appear in a `[u,v,w]` wire entry.”"
    feedback if wrong: n may define isolated nodes that appear in no entry, and those make full delivery impossible. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
Result: PASSED

### S3 Q5
Raw input shown:
```
times = [[1,2,9],[1,3,1],[3,2,1],[2,4,1]], n = 4, k = 1
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2 (weight/label "9"), 1→3 (weight/label "1"), 3→2 (weight/label "1"), 2→4 (weight/label "1")
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 4 through 2, but the graph still has no direct 3→4 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each travel time value appearing in `times`.”"
    feedback if wrong: Travel times are weights on wires. The numbered network locations are the nodes. Correct node rule: One node for every network node ID from 1 through n, including nodes with no wire.
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

### S4 case 1 — `authored-deep-case` · bug: Signal roads are treated as two-way
Input shown:
```
REAL PROBLEM INPUT
times = [[2,1,1],[2,3,1],[4,3,1]], n = 4, k = 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function networkDelayTime(times, n, k) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [fromNode, nextNode, weight] of times) {
    graph[fromNode].push([nextNode, weight]);
    graph[nextNode].push([fromNode, weight]);
  }
  const dist = Array(numberOfNodes + 1).fill(Infinity);
  dist[k] = 0;
  const todo = [[0, k]];
  while (todo.length) {
    todo.sort((firstValue, secondValue) => secondValue[0] - firstValue[0]);
    const [time, node] = todo.pop();
    if (time !== dist[node]) {
      continue;
    }
    for (const [next, weight] of graph[node]) {
      if (time + weight < dist[next]) {
        dist[next] = time + weight;
        todo.push([dist[next], next]);
      }
    }
  }
  const answer = Math.max(...dist.slice(1));
  return Number.isFinite(answer) ? answer : -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2 source", "3", "4" · edges: 2 source→1 (weight/label "1"), 2 source→3 (weight/label "1"), 4→3 (weight/label "1")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Time until all nodes receive the signal, or -1" · expected buggy output `2` · real correct output `-1`
Diagnosis choices as displayed:
- A The priority queue processes the largest tentative time before the smallest one.
- B The answer should be the smallest arrival time, changing this input's returned value.
- C It adds a reverse edge for every directed travel time for the shown graph.
Diagnosis answer key + feedback:
- ✅ [undirected-times] "It adds a reverse edge for every directed travel time for the shown graph." — feedback: Correct. The listed 4→3 edge does not let a signal at 3 travel to 4.
- ❌ [needs-dfs] "The priority queue processes the largest tentative time before the smallest one." — feedback: No. The descending sort followed by pop removes the smallest tentative time first.
- ❌ [take-min] "The answer should be the smallest arrival time, changing this input's returned value." — feedback: No. Everyone has received the signal only at the largest shortest-arrival time.
Graph proof shown in feedback: code rule "Every weighted arrow is duplicated in reverse." → changed graph "From source 2, arrows reach 1 and 3, while the only edge touching 4 points outward from 4." → boundary "Node 4 has an edge to a reachable node but no incoming route from the source." → returned value "The invented 3→4 route gives delay 2; in the real graph node 4 is unreachable, so the answer is -1."
Output-format probes: ❌ quoted number → `"2"`; ❌ trailing period → `2.`
Feedback after a wrong diagnosis:
```
Check the graph and try again.
✓
The drawing has every exact node
✓
The drawing has every exact edge
✓
The drawing uses the problem's direction
✓
Edge labels or weights match the input
×
The graph-level diagnosis is correct
✓
The incorrect solution's exact output is correct
About your diagnosis: No. The descending sort followed by pop removes the smallest tentative time first.
Code rule: Every weighted arrow is duplicated in reverse. → Changed graph: From source 2, arrows reach 1 and 3, while the only edge touching 4 points outward from 4. → Reachable boundary: Node 4 has an edge to a reachable node but no incoming route from the source.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Signal roads are treated as two-way
INCORRECT OUTPUT
2
CORRECT OUTPUT
-1
Code rule: Every weighted arrow is duplicated in reverse. → Changed graph: From source 2, arrows reach 1 and 3, while the only edge touching 4 points outward from 4. → Reachable boundary: Node 4 has an edge to a reachable node but no incoming route from the source. → Returned value: The invented 3→4 route gives delay 2; in the real graph node 4 is unreachable, so the answer is -1.
```

### S4 case 2 — `build-unreachable` · bug: Signal roads are treated as two-way
Input shown:
```
REAL PROBLEM INPUT
times = [[1,2,1]], n = 2, k = 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function networkDelayTime(times, n, k) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [fromNode, nextNode, weight] of times) {
    graph[fromNode].push([nextNode, weight]);
    graph[nextNode].push([fromNode, weight]);
  }
  const dist = Array(numberOfNodes + 1).fill(Infinity);
  dist[k] = 0;
  const todo = [[0, k]];
  while (todo.length) {
    todo.sort((firstValue, secondValue) => secondValue[0] - firstValue[0]);
    const [time, node] = todo.pop();
    if (time !== dist[node]) {
      continue;
    }
    for (const [next, weight] of graph[node]) {
      if (time + weight < dist[next]) {
        dist[next] = time + weight;
        todo.push([dist[next], next]);
      }
    }
  }
  const answer = Math.max(...dist.slice(1));
  return Number.isFinite(answer) ? answer : -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2" · edges: 1→2 (weight/label "1")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Time until all nodes receive the signal, or -1" · expected buggy output `1` · real correct output `-1`
Diagnosis choices as displayed:
- A It adds a reverse edge for every directed travel time for the shown graph.
- B The priority queue processes the largest tentative time before the smallest one.
- C The answer should be the smallest arrival time, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [undirected-times] "It adds a reverse edge for every directed travel time for the shown graph." — feedback: Correct. The only arrow is 1→2, so source 2 cannot reach node 1; the code invents reverse edge 2→1 with weight 1. Therefore the shown code returns 1, while the real problem returns -1.
- ❌ [needs-dfs] "The priority queue processes the largest tentative time before the smallest one." — feedback: No. The descending sort followed by pop removes the smallest tentative time first.
- ❌ [take-min] "The answer should be the smallest arrival time, changing this input's returned value." — feedback: No. Everyone has received the signal only at the largest shortest-arrival time.
Graph proof shown in feedback: code rule "Every weighted arrow is duplicated in reverse." → changed graph "Nodes: 1, 2. Direct arrows: 1→2 (1)." → boundary "The only arrow is 1→2, so source 2 cannot reach node 1; the code invents reverse edge 2→1 with weight 1." → returned value "The shown code returns 1; the source-repo reference solution returns -1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Signal roads are treated as two-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
-1
Code rule: Every weighted arrow is duplicated in reverse. → Changed graph: Nodes: 1, 2. Direct arrows: 1→2 (1). → Reachable boundary: The only arrow is 1→2, so source 2 cannot reach node 1; the code invents reverse edge 2→1 with weight 1. → Returned value: The shown code returns 1; the source-repo reference solution returns -1.
```

### S4 case 3 — `remedial-3` · bug: Signal roads are treated as two-way
Input shown:
```
REAL PROBLEM INPUT
times = [[2,1,5]], n = 2, k = 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function networkDelayTime(times, n, k) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [fromNode, nextNode, weight] of times) {
    graph[fromNode].push([nextNode, weight]);
    graph[nextNode].push([fromNode, weight]);
  }
  const dist = Array(numberOfNodes + 1).fill(Infinity);
  dist[k] = 0;
  const todo = [[0, k]];
  while (todo.length) {
    todo.sort((firstValue, secondValue) => secondValue[0] - firstValue[0]);
    const [time, node] = todo.pop();
    if (time !== dist[node]) {
      continue;
    }
    for (const [next, weight] of graph[node]) {
      if (time + weight < dist[next]) {
        dist[next] = time + weight;
        todo.push([dist[next], next]);
      }
    }
  }
  const answer = Math.max(...dist.slice(1));
  return Number.isFinite(answer) ? answer : -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2" · edges: 2→1 (weight/label "5")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Time until all nodes receive the signal, or -1" · expected buggy output `5` · real correct output `-1`
Diagnosis choices as displayed:
- A The priority queue processes the largest tentative time before the smallest one.
- B It adds a reverse edge for every directed travel time for the shown graph.
- C The answer should be the smallest arrival time, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [undirected-times] "It adds a reverse edge for every directed travel time for the shown graph." — feedback: Correct. The only arrow is 2→1 with weight 5, so source 1 cannot reach node 2; the code invents 1→2. Therefore the shown code returns 5, while the real problem returns -1.
- ❌ [needs-dfs] "The priority queue processes the largest tentative time before the smallest one." — feedback: No. The descending sort followed by pop removes the smallest tentative time first.
- ❌ [take-min] "The answer should be the smallest arrival time, changing this input's returned value." — feedback: No. Everyone has received the signal only at the largest shortest-arrival time.
Graph proof shown in feedback: code rule "Every weighted arrow is duplicated in reverse." → changed graph "Nodes: 1, 2. Direct arrows: 2→1 (5)." → boundary "The only arrow is 2→1 with weight 5, so source 1 cannot reach node 2; the code invents 1→2." → returned value "The shown code returns 5; the source-repo reference solution returns -1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Signal roads are treated as two-way
INCORRECT OUTPUT
5
CORRECT OUTPUT
-1
Code rule: Every weighted arrow is duplicated in reverse. → Changed graph: Nodes: 1, 2. Direct arrows: 2→1 (5). → Reachable boundary: The only arrow is 2→1 with weight 5, so source 1 cannot reach node 2; the code invents 1→2. → Returned value: The shown code returns 5; the source-repo reference solution returns -1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```