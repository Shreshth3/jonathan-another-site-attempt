# Dig New Wells (`villages-without-wells`) — variant, undirected-graph

## Problem statement (Description tab)

A valley has `n` villages, numbered `0` to `n - 1`. You are given a list `paths`, where each entry `[a, b]` is a two-way footpath between villages `a` and `b`. You are also given a list `wells` of village numbers that already have a water well.

Villagers can fetch water from a well in their own village **or** in any village they can reach by walking along footpaths (through as many villages as needed).

A group of villages that are all reachable from each other is called a **cluster**. If a cluster contains no well at all, the government must dig exactly **one** new well somewhere in that cluster.

Write a function `countWellsToDig(n, paths, wells)` that returns how many new wells must be dug so that every village can reach water.

### Examples
- Example 1: input `n = 6, paths = [[0,1],[1,2],[3,4]], wells = [1]` → output `2`. The clusters are {0,1,2}, {3,4}, and {5}. Cluster {0,1,2} contains the well at village 1, so it is fine. Clusters {3,4} and {5} have no well, so each needs one new well. Answer: 2.
- Example 2: input `n = 4, paths = [[0,1],[2,3]], wells = [0,3]` → output `0`. The clusters are {0,1} and {2,3}. The first contains the well at 0, the second contains the well at 3. Nobody needs a new well.

### Graph rules (authored)
- Nodes: Every village `0` through `n−1`, even a village with no footpaths.
- Edges: One two-way footpath between villages a and b.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact roads")
Raw input shown:
```
n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many new wells are needed?**
Choices as displayed (top to bottom):
1. 3
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Exactly 0 road components have no existing well.
- ❌ [bug] "3"
    feedback: This counts individual villages without wells instead of one needed well per road component. (misconception: count-villages-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 3—4
"Why" shown after success: Exactly 0 road components have no existing well.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "village identity")
Raw input shown:
```
n=4, roads=[[0,1],[1,2],[2,3]], wells=[3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many new wells are needed?**
Choices as displayed (top to bottom):
1. 0
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Exactly 0 road components have no existing well.
- ❌ [bug] "3"
    feedback: This counts individual villages without wells instead of one needed well per road component. (misconception: count-villages-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: Exactly 0 road components have no existing well.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact roads")
Raw input shown:
```
n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4
2. Picture C / 0 / 1 / 2 / 3 / 4
3. Picture A / 0 / 1 / 2 / 3 / 4
4. Picture D / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2, 3—4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 1→2, 3→4
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—2
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-node`, facet "village identity")
Raw input shown:
```
n = 7, paths = [[0,1],[2,3],[3,4],[5,6]], wells = [4,6]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which villages belong as nodes?**
Choices as displayed (top to bottom):
1. A / Every village 0 through n−1, even a village with no footpaths.
2. B / Only village numbers that appear in paths.
3. C / Only villages not already listed in wells.
4. D / One node per connected village cluster.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-villages] "Every village `0` through `n−1`, even a village with no footpaths."
    feedback: Correct. An isolated village is its own cluster and may need its own well.
- ❌ [path-villages] "Only village numbers that appear in `paths`."
    feedback: That drops isolated villages, which are valid one-village clusters. (misconception: omit-isolated)
- ❌ [without-wells] "Only villages not already listed in `wells`."
    feedback: Well villages must remain in the graph so their whole cluster is recognized as supplied. (misconception: remove-well-nodes)
- ❌ [clusters] "One node per connected village cluster."
    feedback: Clusters are discovered from village nodes and footpath edges; they are not known first. (misconception: cluster-as-node)
"Why" shown after success: Correct. An isolated village is its own cluster and may need its own well.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`case-3`, facet "two-way roads")
Raw input shown:
```
n=5, roads=[[0,1],[2,3]], wells=[0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many new wells are needed?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Exactly 2 road components have no existing well.
- ❌ [bug] "4"
    feedback: This counts individual villages without wells instead of one needed well per road component. (misconception: count-villages-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
"Why" shown after success: Exactly 2 road components have no existing well.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-edge`, facet "two-way roads")
Raw input shown:
```
n = 7, paths = [[0,1],[2,3],[3,4],[5,6]], wells = [4,6]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What connection does one path [a,b] create?**
Choices as displayed (top to bottom):
1. A / A one-way path from a to b only, following the pair's written order.
2. B / An edge between any two villages that both have wells.
3. C / A direct edge between every pair that can be reached through a chain of paths.
4. D / One two-way footpath between villages a and b.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way-path] "One two-way footpath between villages a and b."
    feedback: Correct. A cluster can be explored from either endpoint.
- ❌ [a-to-b] "A one-way path from a to b only, following the pair's written order."
    feedback: Footpaths are walkable both ways; array order does not create direction. (misconception: directed-by-order)
- ❌ [well-bridge] "An edge between any two villages that both have wells."
    feedback: Wells are properties of nodes. Only listed footpaths join villages. (misconception: well-creates-edge)
- ❌ [same-cluster-shortcut] "A direct edge between every pair that can be reached through a chain of paths."
    feedback: A chain is a multi-edge route. Adding shortcuts changes the given graph. (misconception: transitive-edge)
"Why" shown after success: Correct. A cluster can be explored from either endpoint.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "components without wells")
Raw input shown:
```
n = 7, paths = [[0,1],[2,3],[3,4],[5,6]], wells = [4,6]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **The map has clusters {0,1}, {2,3,4}, and {5,6}. Wells are at 4 and 6. How many new wells are needed?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 3
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "`1`"
    feedback: Correct. Only cluster {0,1} has no well.
- ❌ [two] "`2`"
    feedback: A well at 4 supplies all of {2,3,4}, and a well at 6 supplies {5,6}. (misconception: well-covers-only-node)
- ❌ [three] "`3`"
    feedback: The answer counts dry clusters, not all clusters. (misconception: one-per-cluster)
- ❌ [zero] "`0`"
    feedback: No path connects cluster {0,1} to either existing well. (misconception: wells-global)
"Why" shown after success: Correct. Only cluster {0,1} has no well.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "components without wells")
Raw input shown:
```
n=1, roads=[], wells=[0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many new wells are needed?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Exactly 0 road components have no existing well.
- ❌ [bug] "1"
    feedback: This counts individual villages without wells instead of one needed well per road component. (misconception: count-villages-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: Exactly 0 road components have no existing well.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "components without wells")
Raw input shown:
```
n = 5, paths = [[0,1],[1,2],[2,0],[3,4]], wells = []
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Villages {0,1,2} form one cycle and {3,4} form another cluster. There are no wells. How many are needed?**
Choices as displayed (top to bottom):
1. A / 5
2. B / 3
3. C / 2
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "`2`"
    feedback: Correct. One new well is enough for each of the two clusters.
- ❌ [five] "`5`"
    feedback: Villages in one cluster can share a well through paths. (misconception: one-per-village)
- ❌ [three] "`3`"
    feedback: The cycle has three villages but is still one supplied cluster. (misconception: count-cycle-edges)
- ❌ [one] "`1`"
    feedback: The two clusters have no path between them, so one well cannot supply both. (misconception: merge-components)
"Why" shown after success: Correct. One new well is enough for each of the two clusters.
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
Your choice: This drops a direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every detail"
Remedial raw input:
```
n=5, roads=[[0,1],[0,2],[0,3],[3,4]], wells=[4]
```
Remedial question: **How many new wells are needed?** · choices shown: 4 | 0
Remedial answer key: ✅ "0" — Correct. Exactly 0 road components have no existing well.; ❌ "4" — This counts individual villages without wells instead of one needed well per road component.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [path-villages]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every village 0 through n−1, even a village with no footpaths.
Your choice: That drops isolated villages, which are valid one-village clusters.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
n=4, roads=[[0,1],[1,2],[2,0]], wells=[0]
```
Remedial question: **How many new wells are needed?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. Exactly 1 road component has no existing well.; ❌ "3" — This counts individual villages without wells instead of one needed well per road component.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [a-to-b]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One two-way footpath between villages a and b.
Your choice: Footpaths are walkable both ways; array order does not create direction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
n=3, roads=[], wells=[]
```
Remedial question: **How many new wells are needed?** · choices shown: 0 | 3
Remedial answer key: ✅ "3" — Correct. Exactly 3 road components have no existing well.; ❌ "0" — This returns early when the well list is empty instead of adding one well to each isolated village component.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: A well at 4 supplies all of {2,3,4}, and a well at 6 supplies {5,6}.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
n=4, roads=[[0,1],[2,3]], wells=[1]
```
Remedial question: **How many new wells are needed?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. Exactly 1 road component has no existing well.; ❌ "3" — This counts individual villages without wells instead of one needed well per road component.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [five]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: Villages in one cluster can share a well through paths.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
n=5, roads=[[0,1],[0,2],[0,3],[0,4]], wells=[2]
```
Remedial question: **How many new wells are needed?** · choices shown: 4 | 0
Remedial answer key: ✅ "0" — Correct. Exactly 0 road components have no existing well.; ❌ "4" — This counts individual villages without wells instead of one needed well per road component.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `skip-leaf-edges` (authored level "End-of-road village"; authored goal, NOT shown to student: "Make a village at the end of a footpath depend on its only link to a well.")
Everything the student sees (text):
```
J
Jaden's broken search

Jaden erases the outer leaves before searching.

Your main goal: Expose Jaden's mistake. Draw two graphs: first the correct graph, then Jaden's graph using the mistake.

CHOOSE THE VILLAGE WITH A WELL
village with a well
OUTPUT
CORRECT OUTPUT
JADEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose village with a well
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
2 · Jaden's graph
Check my graph
→
```
Start field: label "CHOOSE THE VILLAGE WITH A WELL / village with a well", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JADEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JADEN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Well in the other village"; authored goal, NOT shown to student: "List a non-well village first so ignoring the chosen well changes the served group.")
Everything the student sees (text):
```
A
Autumn's broken search

Autumn ignores the chosen village with a well and uses a different one.

Your main goal: Expose Autumn's mistake. Draw two graphs: first the correct graph, then Autumn's graph using the mistake.

CHOOSE THE VILLAGE WITH A WELL
village with a well
OUTPUT
CORRECT OUTPUT
AUTUMN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose village with a well
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
2 · Autumn's graph
Check my graph
→
```
Start field: label "CHOOSE THE VILLAGE WITH A WELL / village with a well", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AUTUMN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
AUTUMN'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Two paths from the well"; authored goal, NOT shown to student: "Branch from a well so following only the last path leaves a village unserved.")
Everything the student sees (text):
```
C
Carson's broken search

Carson chooses the final listed route and never returns.

Your main goal: Expose Carson's mistake. Draw two graphs: first the correct graph, then Carson's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE VILLAGE WITH A WELL
village with a well
OUTPUT
CORRECT OUTPUT
CARSON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose village with a well
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
2 · Carson's graph
Check my graph
→
```
Start field: label "CHOOSE THE VILLAGE WITH A WELL / village with a well", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CARSON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
CARSON'S OUTPUT
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
n=4, roads=[[0,1],[1,2],[2,0]], wells=[0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only villages not already listed in `wells`.”"
    feedback if wrong: Well villages must remain in the graph so their whole cluster is recognized as supplied. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1—2 edge."
    feedback if wrong: The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
3 has 0 direct neighbors.
×
Well villages must remain in the graph so their whole cluster is recognized as supplied. Correct node rule: Every village
0
through
n−1
, even a village with no footpaths.
×
The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node per connected village cluster.”"
    feedback if wrong: Clusters are discovered from village nodes and footpath edges; they are not known first. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [NO is correct] (direct-vs-reach) "2 can reach 0, but there is no direct 2—0 edge."
    feedback if wrong: The mini-example lists 2—0 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "2 has exactly 3 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Clusters are discovered from village nodes and footpath edges; they are not known first. Correct node rule: Every village
0
through
n−1
, even a village with no footpaths.
×
The mini-example lists 2—0 as one direct edge. A direct edge is different from a longer reachable route.
×
2 has 2 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only village numbers that appear in `paths`.”"
    feedback if wrong: That drops isolated villages, which are valid one-village clusters. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
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
n=3, roads=[], wells=[]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "0 can reach 1, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between 0 and 1.
- [NO is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node per connected village cluster.”"
    feedback if wrong: Clusters are discovered from village nodes and footpath edges; they are not known first. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=4, roads=[[0,1],[2,3]], wells=[1]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only villages not already listed in `wells`.”"
    feedback if wrong: Well villages must remain in the graph so their whole cluster is recognized as supplied. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [YES is correct] (direct-vs-reach) "2 and 3 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2—3 as one direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=5, roads=[[0,1],[0,2],[0,3],[0,4]], wells=[2]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 5 direct neighbors."
    feedback if wrong: 0 has 4 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only village numbers that appear in `paths`.”"
    feedback if wrong: That drops isolated villages, which are valid one-village clusters. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—0 and 0—2, so it should also contain a direct 1—2 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=5, roads=[[0,1],[0,2],[0,3],[3,4]], wells=[4]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node per connected village cluster.”"
    feedback if wrong: Clusters are discovered from village nodes and footpath edges; they are not known first. Correct node rule: Every village `0` through `n−1`, even a village with no footpaths.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—0 and 0—2, so it should also contain a direct 1—2 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Checks a well only at the component start
Input shown:
```
REAL PROBLEM INPUT
n: 3
paths: [[0, 1], [1, 2]]
wells: [2]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.paths) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const wells = new Set(input.wells);
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (const next of graph[node]) {
      visit(next);
    }
  }
  let newWells = 0;
  for (let node = 0; node < input.n; node++) {
    if (visited.has(node)) {
      continue;
    }
    const startHasWell = wells.has(node);
    visit(node);
    if (!startHasWell) {
      newWells++;
    }
  }
  return newWells;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of new wells needed" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The graph stores each footpath in only one direction, changing this input's returned value.
- B The loop skips villages that have no path entry, which changes the returned value here.
- C The DFS marks the component but never records that reachable village 2 already has a well.
Diagnosis answer key + feedback:
- ✅ [well-not-propagated] "The DFS marks the component but never records that reachable village 2 already has a well." — feedback: Correct. One well supplies the entire 0—1—2 cluster.
- ❌ [directed-paths] "The graph stores each footpath in only one direction, changing this input's returned value." — feedback: Both adjacency pushes are present, so paths are two-way.
- ❌ [isolated-village] "The loop skips villages that have no path entry, which changes the returned value here." — feedback: The graph is initialized with all n villages, including isolated ones.
Graph proof shown in feedback: code rule "Well status is sampled only from the first node of a component." → changed graph "Villages 0, 1, and 2 form one connected chain, and node 2 has a well." → boundary "The component starts at 0 but its well is two steps away at 2." → returned value "The code asks for one unnecessary new well instead of returning 0."
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
About your diagnosis: Both adjacency pushes are present, so paths are two-way.
Code rule: Well status is sampled only from the first node of a component. → Changed graph: Villages 0, 1, and 2 form one connected chain, and node 2 has a well. → Reachable boundary: The component starts at 0 but its well is two steps away at 2.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks a well only at the component start
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: Well status is sampled only from the first node of a component. → Changed graph: Villages 0, 1, and 2 form one connected chain, and node 2 has a well. → Reachable boundary: The component starts at 0 but its well is two steps away at 2. → Returned value: The code asks for one unnecessary new well instead of returning 0.
```

### S4 case 2 — `case-1` · bug: Checks a well only at the component start
Input shown:
```
REAL PROBLEM INPUT
n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.paths) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const wells = new Set(input.wells);
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (const next of graph[node]) {
      visit(next);
    }
  }
  let newWells = 0;
  for (let node = 0; node < input.n; node++) {
    if (visited.has(node)) {
      continue;
    }
    const startHasWell = wells.has(node);
    visit(node);
    if (!startHasWell) {
      newWells++;
    }
  }
  return newWells;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 3—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of new wells needed" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The DFS marks component 0—1—2 but never records that reachable village 1 already has a well.
- B The graph stores each footpath in only one direction, changing this input's returned value.
- C The loop skips villages that have no path entry, which changes the returned value here.
Diagnosis answer key + feedback:
- ✅ [well-not-propagated] "The DFS marks component 0—1—2 but never records that reachable village 1 already has a well." — feedback: Exactly. Well 1 supplies the first component, and well 3 supplies component 3—4, so no new well is needed.
- ❌ [directed-paths] "The graph stores each footpath in only one direction, changing this input's returned value." — feedback: Both adjacency pushes are present, so paths are two-way.
- ❌ [isolated-village] "The loop skips villages that have no path entry, which changes the returned value here." — feedback: The graph is initialized with all n villages, including isolated ones.
Graph proof shown in feedback: code rule "Well status is sampled only from the first node of a component." → changed graph "Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 3—4." → boundary "The first component starts at village 0 but contains well 1; the second starts at well 3." → returned value "The shown code returns 1; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks a well only at the component start
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: Well status is sampled only from the first node of a component. → Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 3—4. → Reachable boundary: The first component starts at village 0 but contains well 1; the second starts at well 3. → Returned value: The shown code returns 1; the real problem returns 0.
```

### S4 case 3 — `case-2` · bug: Checks a well only at the component start
Input shown:
```
REAL PROBLEM INPUT
n=4, roads=[[0,1],[1,2],[2,3]], wells=[3]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.paths) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const wells = new Set(input.wells);
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (const next of graph[node]) {
      visit(next);
    }
  }
  let newWells = 0;
  for (let node = 0; node < input.n; node++) {
    if (visited.has(node)) {
      continue;
    }
    const startHasWell = wells.has(node);
    visit(node);
    if (!startHasWell) {
      newWells++;
    }
  }
  return newWells;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of new wells needed" · expected buggy output `1` · real correct output `0`
Diagnosis choices as displayed:
- A The graph stores each footpath in only one direction, changing this input's returned value.
- B The DFS marks chain 0—1—2—3 but never records the well at reachable village 3.
- C The loop skips villages that have no path entry, which changes the returned value here.
Diagnosis answer key + feedback:
- ✅ [well-not-propagated] "The DFS marks chain 0—1—2—3 but never records the well at reachable village 3." — feedback: Exactly. One connected chain already contains well 3, so it needs zero new wells.
- ❌ [directed-paths] "The graph stores each footpath in only one direction, changing this input's returned value." — feedback: Both adjacency pushes are present, so paths are two-way.
- ❌ [isolated-village] "The loop skips villages that have no path entry, which changes the returned value here." — feedback: The graph is initialized with all n villages, including isolated ones.
Graph proof shown in feedback: code rule "Well status is sampled only from the first node of a component." → changed graph "Nodes are 0, 1, 2, 3; direct edges are 0—1, 1—2, 2—3." → boundary "The component scan starts at 0, three edges before its existing well at 3." → returned value "The shown code returns 1; the real problem returns 0."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Checks a well only at the component start
INCORRECT OUTPUT
1
CORRECT OUTPUT
0
Code rule: Well status is sampled only from the first node of a component. → Changed graph: Nodes are 0, 1, 2, 3; direct edges are 0—1, 1—2, 2—3. → Reachable boundary: The component scan starts at 0, three edges before its existing well at 3. → Returned value: The shown code returns 1; the real problem returns 0.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```