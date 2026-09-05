# Package to the Outpost (`package-to-the-outpost`) — variant, undirected-graph

## Problem statement (Description tab)

A delivery company has `n` warehouses, numbered `0` to `n - 1`, connected by two-way roads. `roads[i] = [a, b, hours]` means there is a road between warehouse `a` and warehouse `b` that takes `hours` hours to drive.

There are exactly `n - 1` roads and every warehouse can be reached from every other one. That means there are no shortcut loops: between any two warehouses there is exactly **one** possible route.

A truck starts at warehouse `hq` and drives to warehouse `target` along that one route. Return the total number of hours the drive takes. If `hq` and `target` are the same warehouse, return `0`.

### Examples
- Example 1: input `n = 5, roads = [[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq = 0, target = 4` → output `9`. The only route from 0 to 4 is 0 -> 3 -> 4, which takes 2 + 7 = 9 hours.
- Example 2: input `n = 3, roads = [[1,0,5],[1,2,1]], hq = 2, target = 0` → output `6`. The only route from 2 to 0 is 2 -> 1 -> 0, which takes 1 + 5 = 6 hours.

### Graph rules (authored)
- Nodes: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- Edges: A two-way a—b edge labeled with that road's travel time.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`route-branch`, facet "unique-route time")
Raw input shown:
```
n=5, roads=[[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq=0, target=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What travel time is returned?**
Choices as displayed (top to bottom):
1. 16
2. 9
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "9"
    feedback: Correct. The unique route 0—3—4 costs 2+7=9.
- ❌ [bug] "16"
    feedback: This adds every road in the tree instead of only roads on the hq-to-target route. (misconception: sum-all-tree-edges)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 (weight/label "4"), 1—2 (weight/label "3"), 0—3 (weight/label "2"), 3—4 (weight/label "7")
"Why" shown after success: The unique route 0—3—4 costs 2+7=9.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`reverse-listed`, facet "two-way weighted roads")
Raw input shown:
```
n=3, roads=[[1,0,5],[1,2,1]], hq=2, target=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What travel time is returned?**
Choices as displayed (top to bottom):
1. 6
2. -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Correct. The route 2—1—0 costs 1+5=6.
- ❌ [bug] "-1"
    feedback: This treats roads as one-way in their written endpoint order, so it refuses 2→1. (misconception: treat-roads-as-directed)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0 (weight/label "5"), 1—2 (weight/label "1")
"Why" shown after success: The route 2—1—0 costs 1+5=6.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact roads")
Raw input shown:
```
n=5, roads=[[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq=0, target=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 4 / 3 / 2 / 0 / 1 / 2 / 3 / 4
2. Picture A / 4 / 3 / 2 / 7 / 0 / 1 / 2 / 3 / 4
3. Picture C / 4 / 3 / 2 / 7 / 0 / 1 / 2 / 3 / 4
4. Picture D / 4 / 3 / 2 / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1 (4), 1—2 (3), 0—3 (2), 3—4 (7)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1 (4), 1—2 (3), 0—3 (2)
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1 (4), 1→2 (3), 0→3 (2), 3→4 (7)
    feedback: This turns two-way relations into one-way arrows. (misconception: make-undirected-edges-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1 (4), 1—2 (3), 0—3 (2)
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-nodes`, facet "warehouse identity")
Raw input shown:
```
n=3, roads=[[1,0,5],[1,2,1]], hq=2, target=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What becomes a node on the delivery map?**
Picture under review: UNDIRECTED · nodes: 0, 1, 2 · edges: 1—0 (5), 1—2 (1)
Choices as displayed (top to bottom):
1. A / Each road triple [a,b,hours].
2. B / Every warehouse 0 through n−1; travel time is not part of its identity.
3. C / A separate node for every possible arrival time at a warehouse.
4. D / Only warehouses on the first route found from headquarters to the outpost.
Answer key + feedback per choice (data):
- ✅ CORRECT [warehouses] "Every warehouse `0` through `n−1`; travel time is not part of its identity."
    feedback: Correct. Road times belong on edges between warehouse nodes.
- ❌ [roads] "Each road triple `[a,b,hours]`."
    feedback: A road is a weighted edge. Warehouses a and b are its node endpoints. (misconception: road-as-node)
- ❌ [arrival-times] "A separate node for every possible arrival time at a warehouse."
    feedback: The algorithm stores the best time as state for one warehouse node; it does not duplicate the map by time. (misconception: time-expanded-unneeded)
- ❌ [best-route] "Only warehouses on the first route found from headquarters to the outpost."
    feedback: A later route may be faster, so every warehouse in the road network must remain available. (misconception: first-route-only)
"Why" shown after success: Correct. Road times belong on edges between warehouse nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`ignore-off-route`, facet "exact roads")
Raw input shown:
```
n=4, roads=[[0,1,2],[1,2,3],[1,3,9]], hq=0, target=2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What travel time is returned?**
Choices as displayed (top to bottom):
1. 14
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. Only roads 0—1 and 1—2 lie on the route, so 2+3=5.
- ❌ [bug] "14"
    feedback: This adds the 9-hour branch to warehouse 3 even though that road is not on the route to 2. (misconception: include-off-route-branch)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 (weight/label "2"), 1—2 (weight/label "3"), 1—3 (weight/label "9")
"Why" shown after success: Only roads 0—1 and 1—2 lie on the route, so 2+3=5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-relations`, facet "two-way weighted roads")
Raw input shown:
```
n=4, roads=[[0,1,2],[1,2,3],[1,3,9]], hq=0, target=2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should road [a,b,hours] appear?**
Picture under review: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1 (2), 1—2 (3), 1—3 (9)
Choices as displayed (top to bottom):
1. A / A one-way arrow a→b because a is listed first.
2. B / A two-way a—b edge labeled with that road's travel time.
3. C / An unweighted edge, because only the number of roads matters.
4. D / Insert a new node named hours between a and b.
Answer key + feedback per choice (data):
- ✅ CORRECT [weighted-two-way] "A two-way a—b edge labeled with that road's travel time."
    feedback: Correct. The same road can be driven either way and adds its hours to the trip.
- ❌ [a-to-b] "A one-way arrow a→b because a is listed first."
    feedback: Road pairs are undirected; both warehouses must list the other as a neighbor. (misconception: directed-road)
- ❌ [ignore-weight] "An unweighted edge, because only the number of roads matters."
    feedback: A route with more roads can still be faster. The hours label is essential. (misconception: fewest-edges)
- ❌ [hours-node] "Insert a new node named `hours` between a and b."
    feedback: Hours is the cost of crossing the road, not a location the package visits. (misconception: weight-as-node)
"Why" shown after success: Correct. The same road can be driven either way and adds its hours to the trip.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "unique-route time")
Raw input shown:
```
n = 6, roads = [[0,1,3],[1,2,2],[1,3,4],[0,4,1],[4,5,6]], hq = 2, target = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What total road time lies on the unique route from hq to target?**
Choices as displayed (top to bottom):
1. A / 6
2. B / 12
3. C / 4
4. D / 16
Answer key + feedback per choice (data):
- ✅ CORRECT [twelve] "`12`"
    feedback: Correct. Travel times add: 2 + 3 + 1 + 6.
- ❌ [six] "`6`"
    feedback: That keeps only the final road instead of the full trip total. (misconception: overwrite-total)
- ❌ [four] "`4`"
    feedback: That counts roads rather than their hours. (misconception: count-edges)
- ❌ [sixteen] "`16`"
    feedback: The dead-end branch to warehouse 3 is not part of the route to 5. (misconception: add-dead-end)
"Why" shown after success: Correct. Travel times add: 2 + 3 + 1 + 6.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`same-warehouse`, facet "warehouse identity")
Raw input shown:
```
n=3, roads=[[0,1,4],[1,2,6]], hq=1, target=1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What travel time is returned?**
Choices as displayed (top to bottom):
1. 0
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. The zero-road route from warehouse 1 to itself costs 0.
- ❌ [bug] "10"
    feedback: This traverses the whole tree even though the route starts and ends at warehouse 1. (misconception: ignore-same-endpoint-base-case)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1 (weight/label "4"), 1—2 (weight/label "6")
"Why" shown after success: The zero-road route from warehouse 1 to itself costs 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-bug`, facet "unique-route time")
Raw input shown:
```
n = 4, roads = [[0,1,10],[1,2,1],[1,3,1]], hq = 3, target = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What total road time lies on the unique route from hq to target?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 12
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. The route is 3→1→2, one hour per road.
- ❌ [one] "`1`"
    feedback: Warehouses 3 and 2 have no direct road; both road times must be counted. (misconception: treat-siblings-adjacent)
- ❌ [twelve] "`12`"
    feedback: The 10-hour road from 1 to warehouse 0 is outside this route. (misconception: include-other-branch)
- ❌ [zero] "`0`"
    feedback: Different warehouses require travel; they are not the same starting node. (misconception: shared-parent-zero)
"Why" shown after success: Correct. The route is 3→1→2, one hour per road.
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
Your choice: This drops one direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every input detail"
Remedial raw input:
```
n=4, roads=[[0,1,3],[0,2,8],[2,3,2]], hq=1, target=3
```
Remedial question: **What travel time is returned?** · choices shown: 10 | 13
Remedial answer key: ✅ "13" — Correct. The route 1—0—2—3 costs 3+8+2=13.; ❌ "10" — This starts at warehouse 0 and omits the first road from hq 1 to 0.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 (weight/label "3"), 0—2 (weight/label "8"), 2—3 (weight/label "2")
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [roads]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every warehouse 0 through n−1; travel time is not part of its identity.
Your choice: A road is a weighted edge. Warehouses a and b are its node endpoints.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
n=4, roads=[[0,1,1],[1,2,1],[2,3,1]], hq=0, target=3
```
Remedial question: **How many warehouses are on the route, including both endpoints?** · choices shown: 4 | 3
Remedial answer key: ✅ "4" — Correct. The route contains warehouses 0,1,2,3.; ❌ "3" — This counts roads instead of warehouse nodes on the route.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 (weight/label "1"), 1—2 (weight/label "1"), 2—3 (weight/label "1")
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [a-to-b]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way a—b edge labeled with that road's travel time.
Your choice: Road pairs are undirected; both warehouses must list the other as a neighbor.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
n=3, roads=[[0,1,2],[1,2,7]], hq=2, target=0
```
Remedial question: **What travel time is returned?** · choices shown: 9 | 2
Remedial answer key: ✅ "9" — Correct. Travel in reverse still uses the listed weights: 7+2=9.; ❌ "2" — This reuses the first road's weight for both road segments.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1 (weight/label "2"), 1—2 (weight/label "7")
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
12
Your choice: That keeps only the final road instead of the full trip total.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
n=2, roads=[[0,1,11]], hq=0, target=1
```
Remedial question: **What travel time is returned?** · choices shown: 1 | 11
Remedial answer key: ✅ "11" — Correct. The single road costs 11 hours.; ❌ "1" — This counts one road instead of adding its 11-hour weight.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1 (weight/label "11")
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: Warehouses 3 and 2 have no direct road; both road times must be counted.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n=5, roads=[[0,1,4],[0,2,1],[2,3,2],[3,4,3]], hq=0, target=4
```
Remedial question: **What travel time is returned?** · choices shown: 6 | -1
Remedial answer key: ✅ "6" — Correct. The other branch reaches 4 with cost 1+2+3=6.; ❌ "-1" — This explores dead-end branch 0—1 first and returns failure without trying branch 0—2.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 (weight/label "4"), 0—2 (weight/label "1"), 2—3 (weight/label "2"), 3—4 (weight/label "3")
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Missing final road"; authored goal, NOT shown to student: "Make the last listed road complete the only route to the outpost.")
Everything the student sees (text):
```
A
Ashton's broken search

Ashton stops reading one relation too early and drops the final edge.

Your main goal: Expose Ashton's mistake. Draw two graphs: first the correct graph, then Ashton's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE HEADQUARTERS
headquarters
OUTPUT
CORRECT OUTPUT
ASHTON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose headquarters
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
2 · Ashton's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEADQUARTERS / headquarters", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ASHTON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
ASHTON'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "Road order mistaken"; authored goal, NOT shown to student: "List a road toward HQ so treating it as one-way blocks the package.")
Everything the student sees (text):
```
B
Bella's broken search

Bella turns every two-way connection into a one-way arrow.

Your main goal: Expose Bella's mistake. Draw two graphs: first the correct graph, then Bella's graph using the mistake.

CHOOSE THE HEADQUARTERS
headquarters
OUTPUT
CORRECT OUTPUT
BELLA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose headquarters
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
2 · Bella's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEADQUARTERS / headquarters", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BELLA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
BELLA'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Wrong delivery fork"; authored goal, NOT shown to student: "Branch from HQ so only keeping the last road changes the reached warehouses.")
Everything the student sees (text):
```
C
Cody's broken search

Cody follows only the last available branch and ignores earlier choices.

Your main goal: Expose Cody's mistake. Draw two graphs: first the correct graph, then Cody's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE HEADQUARTERS
headquarters
OUTPUT
CORRECT OUTPUT
CODY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose headquarters
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
2 · Cody's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEADQUARTERS / headquarters", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CODY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
CODY'S OUTPUT
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
n=5, roads=[[0,1,4],[0,2,1],[2,3,2],[3,4,3]], hq=0, target=4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 (weight/label "4"), 0—2 (weight/label "1"), 2—3 (weight/label "2"), 3—4 (weight/label "3")
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "4 has exactly 1 direct neighbor."
    feedback if wrong: 4 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each road triple `[a,b,hours]`.”"
    feedback if wrong: A road is a weighted edge. Warehouses a and b are its node endpoints. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [YES is correct] (direct-vs-reach) "2 can reach 4 through 3, but the graph still has no direct 2—4 edge."
    feedback if wrong: Right. A multi-step route through 3 creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
4 has 1 direct neighbor.
×
A road is a weighted edge. Warehouses a and b are its node endpoints. Correct node rule: Every warehouse
0
through
n−1
; travel time is not part of its identity.
×
Right. A multi-step route through 3 creates reachability, not a new direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “A separate node for every possible arrival time at a warehouse.”"
    feedback if wrong: The algorithm stores the best time as state for one warehouse node; it does not duplicate the map by time. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [YES is correct] (direct-vs-reach) "3 can reach 0 through 2, but the graph still has no direct 3—0 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The algorithm stores the best time as state for one warehouse node; it does not duplicate the map by time. Correct node rule: Every warehouse
0
through
n−1
; travel time is not part of its identity.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
×
3 has 2 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only warehouses on the first route found from headquarters to the outpost.”"
    feedback if wrong: A later route may be faster, so every warehouse in the road network must remain available. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [NO is correct] (direct-vs-reach) "The correct graph has 4—3 and 3—2, so it should also contain a direct 4—2 edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 2 direct neighbors.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
✓
Edge direction matches
×
Edge labels or weights match the input
```
Result: PASSED

### S3 Q2
Raw input shown:
```
n=4, roads=[[0,1,3],[0,2,8],[2,3,2]], hq=1, target=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 (weight/label "3"), 0—2 (weight/label "8"), 2—3 (weight/label "2")
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 3 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “A separate node for every possible arrival time at a warehouse.”"
    feedback if wrong: The algorithm stores the best time as state for one warehouse node; it does not duplicate the map by time. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—1, so it should also contain a direct 2—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=4, roads=[[0,1,1],[1,2,1],[2,3,1]], hq=0, target=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 (weight/label "1"), 1—2 (weight/label "1"), 2—3 (weight/label "1")
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each road triple `[a,b,hours]`.”"
    feedback if wrong: A road is a weighted edge. Warehouses a and b are its node endpoints. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 2, but the graph still has no direct 3—1 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=3, roads=[[0,1,2],[1,2,7]], hq=2, target=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1 (weight/label "2"), 1—2 (weight/label "7")
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only warehouses on the first route found from headquarters to the outpost.”"
    feedback if wrong: A later route may be faster, so every warehouse in the road network must remain available. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0—2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=2, roads=[[0,1,11]], hq=0, target=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1" · edges: 0—1 (weight/label "11")
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 0 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “A separate node for every possible arrival time at a warehouse.”"
    feedback if wrong: The algorithm stores the best time as state for one warehouse node; it does not duplicate the map by time. Correct node rule: Every warehouse `0` through `n−1`; travel time is not part of its identity.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
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

### S4 case 1 — `authored-deep-case` · bug: Counts roads instead of travel hours
Input shown:
```
REAL PROBLEM INPUT
n: 3
roads: [[0, 1, 2], [1, 2, 5]]
hq: 0
target: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.roads) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function travel(node, parent) {
    if (node === input.target) {
      return 0;
    }
    for (const next of graph[node]) {
      if (next === parent) {
        continue;
      }
      const rest = travel(next, node);
      if (rest !== -1) {
        return 1 + rest;
      }
    }
    return -1;
  }
  return travel(input.hq, -1);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1 (weight/label "2"), 1—2 (weight/label "5")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "travel hours" · expected buggy output `2` · real correct output `7`
Diagnosis choices as displayed:
- A The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours.
- B DFS chooses a longer branch even though a shorter route exists, changing this input's returned value.
- C The code cannot traverse a road backward from its listed order, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [drops-weights] "The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours." — feedback: Correct. The unique route costs 2+5 hours, not two hops.
- ❌ [wrong-route] "DFS chooses a longer branch even though a shorter route exists, changing this input's returned value." — feedback: The input is a tree, so there is exactly one route to the target.
- ❌ [directed-road] "The code cannot traverse a road backward from its listed order, changing this input's returned value." — feedback: Each road is pushed into both adjacency lists.
Graph proof shown in feedback: code rule "Each traversed edge contributes the constant 1." → changed graph "The unique route is 0—1—2 with edge weights 2 and 5." → boundary "The real weights are not both 1." → returned value "The code returns hop count 2 instead of travel time 7."
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
About your diagnosis: The input is a tree, so there is exactly one route to the target.
Code rule: Each traversed edge contributes the constant 1. → Changed graph: The unique route is 0—1—2 with edge weights 2 and 5. → Reachable boundary: The real weights are not both 1.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts roads instead of travel hours
INCORRECT OUTPUT
2
CORRECT OUTPUT
7
Code rule: Each traversed edge contributes the constant 1. → Changed graph: The unique route is 0—1—2 with edge weights 2 and 5. → Reachable boundary: The real weights are not both 1. → Returned value: The code returns hop count 2 instead of travel time 7.
```

### S4 case 2 — `route-branch` · bug: Counts roads instead of travel hours
Input shown:
```
REAL PROBLEM INPUT
n=5, roads=[[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq=0, target=4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.roads) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function travel(node, parent) {
    if (node === input.target) {
      return 0;
    }
    for (const next of graph[node]) {
      if (next === parent) {
        continue;
      }
      const rest = travel(next, node);
      if (rest !== -1) {
        return 1 + rest;
      }
    }
    return -1;
  }
  return travel(input.hq, -1);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 (weight/label "4"), 1—2 (weight/label "3"), 0—3 (weight/label "2"), 3—4 (weight/label "7")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "travel hours" · expected buggy output `2` · real correct output `9`
Diagnosis choices as displayed:
- A DFS chooses a longer branch even though a shorter route exists, changing this input's returned value.
- B The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours.
- C The code cannot traverse a road backward from its listed order, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [drops-weights] "The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours." — feedback: Exactly. Each traversed edge contributes the constant 1. The shown code returns 2; the real problem returns 9.
- ❌ [wrong-route] "DFS chooses a longer branch even though a shorter route exists, changing this input's returned value." — feedback: The input is a tree, so there is exactly one route to the target.
- ❌ [directed-road] "The code cannot traverse a road backward from its listed order, changing this input's returned value." — feedback: Each road is pushed into both adjacency lists.
Graph proof shown in feedback: code rule "Each traversed edge contributes the constant 1." → changed graph "Nodes are 0, 1, 2, 3, 4; direct edges are 0—1 (4), 1—2 (3), 0—3 (2), 3—4 (7)." → boundary "unweighted-route" → returned value "The shown code returns 2; the real problem returns 9."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts roads instead of travel hours
INCORRECT OUTPUT
2
CORRECT OUTPUT
9
Code rule: Each traversed edge contributes the constant 1. → Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1 (4), 1—2 (3), 0—3 (2), 3—4 (7). → Reachable boundary: unweighted-route → Returned value: The shown code returns 2; the real problem returns 9.
```

### S4 case 3 — `reverse-listed` · bug: Counts roads instead of travel hours
Input shown:
```
REAL PROBLEM INPUT
n=3, roads=[[1,0,5],[1,2,1]], hq=2, target=0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.roads) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function travel(node, parent) {
    if (node === input.target) {
      return 0;
    }
    for (const next of graph[node]) {
      if (next === parent) {
        continue;
      }
      const rest = travel(next, node);
      if (rest !== -1) {
        return 1 + rest;
      }
    }
    return -1;
  }
  return travel(input.hq, -1);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 1—0 (weight/label "5"), 1—2 (weight/label "1")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "travel hours" · expected buggy output `2` · real correct output `6`
Diagnosis choices as displayed:
- A DFS chooses a longer branch even though a shorter route exists, changing this input's returned value.
- B The code cannot traverse a road backward from its listed order, changing this input's returned value.
- C The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours.
Diagnosis answer key + feedback:
- ✅ [drops-weights] "The graph stores only neighboring warehouses and adds 1 per road instead of each road's hours." — feedback: Exactly. Each traversed edge contributes the constant 1. The shown code returns 2; the real problem returns 6.
- ❌ [wrong-route] "DFS chooses a longer branch even though a shorter route exists, changing this input's returned value." — feedback: The input is a tree, so there is exactly one route to the target.
- ❌ [directed-road] "The code cannot traverse a road backward from its listed order, changing this input's returned value." — feedback: Each road is pushed into both adjacency lists.
Graph proof shown in feedback: code rule "Each traversed edge contributes the constant 1." → changed graph "Nodes are 0, 1, 2; direct edges are 1—0 (5), 1—2 (1)." → boundary "unweighted-route" → returned value "The shown code returns 2; the real problem returns 6."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts roads instead of travel hours
INCORRECT OUTPUT
2
CORRECT OUTPUT
6
Code rule: Each traversed edge contributes the constant 1. → Changed graph: Nodes are 0, 1, 2; direct edges are 1—0 (5), 1—2 (1). → Reachable boundary: unweighted-route → Returned value: The shown code returns 2; the real problem returns 6.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```