# Largest Component (`structy-largest-component`) — new, undirected-graph

## Problem statement (Description tab)

You are given an undirected graph as a plain object `graph`, where each key is a node and its value is an array of that node's neighbors. A node with no connections maps to an empty array.

The graph may be split into several disconnected "components" — groups of nodes that can reach each other.

Return the number of nodes in the LARGEST component. If the graph is empty, return 0.

### Examples
- Example 1: input `graph = { a: ['b'], b: ['a','c'], c: ['b'], d: ['e'], e: ['d'] }` → output `3`. There are two components: {a, b, c} with 3 nodes and {d, e} with 2 nodes. The largest has 3.
- Example 2: input `graph = { x: [], y: ['z'], z: ['y'] }` → output `2`. Node x is alone (component of size 1), and {y, z} form a component of size 2. The largest has 2.

### Graph rules (authored)
- Nodes: Each object key, including keys with an empty neighbor list.
- Edges: Each appears in the other's neighbor list, because the graph is undirected.
- Node-name format shown in Step 1/3: Use the exact object key from `graph` only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `free` — Use short, unique names for separate input objects.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact adjacency")
Raw input shown:
```
graph={"0":[1,2],"1":[0,3],"2":[0,4],"3":[1],"4":[2]}
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest-component size is returned?**
Choices as displayed (top to bottom):
1. 5
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. The component sizes are 5; the maximum is 5.
- ❌ [bug] "4"
    feedback: This counts edges in a tree-like component instead of counting nodes. (misconception: count-edges-not-nodes)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 1—3, 2—4
"Why" shown after success: The component sizes are 5; the maximum is 5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact adjacency")
Raw input shown:
```
graph={"0":[1,2],"1":[0,3],"2":[0,4],"3":[1],"4":[2]}
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3 / 4
2. Picture B / 0 / 1 / 2 / 3 / 4
3. Picture C / 0 / 1 / 2 / 3 / 4
4. Picture D / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 0—2, 1—3, 2—4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 0—2, 1—3
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 0→2, 1→3, 2→4
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 1—3
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
What is one node in the adjacency-list object?
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node in the adjacency-list object?**
Choices as displayed (top to bottom):
1. A / Each object key, including keys with an empty neighbor list.
2. B / Only keys whose neighbor array is non-empty.
3. C / Each neighbor array.
4. D / Each already-completed connected component.
Answer key + feedback per choice (data):
- ✅ CORRECT [keys] "Each object key, including keys with an empty neighbor list."
    feedback: Right. An isolated key is a one-node component.
- ❌ [nonempty] "Only keys whose neighbor array is non-empty."
    feedback: This wrongly drops isolated nodes. (misconception: drops-isolated-nodes)
- ❌ [arrays] "Each neighbor array."
    feedback: The arrays describe edges leaving the keyed nodes. (misconception: uses-adjacency-arrays-as-nodes)
- ❌ [component] "Each already-completed connected component."
    feedback: Components must be found by traversing individual nodes. (misconception: confuses-components-with-nodes)
"Why" shown after success: Right. An isolated key is a one-node component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-2`, facet "node identity")
Raw input shown:
```
graph={"0":[1],"1":[0,2],"2":[1,3],"3":[2]}
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest-component size is returned?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The component sizes are 4; the maximum is 4.
- ❌ [bug] "3"
    feedback: This counts edges in a tree-like component instead of counting nodes. (misconception: count-edges-not-nodes)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: The component sizes are 4; the maximum is 4.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "two-way edges")
Raw input shown:
```
When do two keyed nodes share an edge?
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When do two keyed nodes share an edge?**
Choices as displayed (top to bottom):
1. A / Only from a key to names in its own list; reverse travel is forbidden.
2. B / Each appears in the other's neighbor list, because the graph is undirected.
3. C / Any two nodes that eventually belong to the same component.
4. D / Keys next to each other alphabetically.
Answer key + feedback per choice (data):
- ✅ CORRECT [listed] "Each appears in the other's neighbor list, because the graph is undirected."
    feedback: Right. The two adjacency entries describe one two-way connection.
- ❌ [oneway] "Only from a key to names in its own list; reverse travel is forbidden."
    feedback: The problem promises an undirected graph. (misconception: treats-graph-as-directed)
- ❌ [same-component] "Any two nodes that eventually belong to the same component."
    feedback: A path through other nodes is not one direct edge. (misconception: turns-path-into-edge)
- ❌ [alphabetical] "Keys next to each other alphabetically."
    feedback: Names do not create graph connections. (misconception: derives-edge-from-label)
"Why" shown after success: Right. The two adjacency entries describe one two-way connection.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "two-way edges")
Raw input shown:
```
graph={"0":[1],"1":[0,2,3],"2":[1],"3":[1,4],"4":[3]}
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest-component size is returned?**
Choices as displayed (top to bottom):
1. 5
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. The component sizes are 5; the maximum is 5.
- ❌ [bug] "4"
    feedback: This counts edges in a tree-like component instead of counting nodes. (misconception: count-edges-not-nodes)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 1—3, 3—4
"Why" shown after success: The component sizes are 5; the maximum is 5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "largest component")
Raw input shown:
```
graph = { a: ['b'], b: ['a','c'], c: ['b'], d: ['e'], e: ['d'] }
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What largest-component size is returned for the shown adjacency list?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 2
3. C / 5
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: The function chooses the larger component. (misconception: chooses-smaller-component)
- ❌ [wrong-2] "5"
    feedback: Disconnected components are not added together. (misconception: counts-all-nodes)
- ❌ [wrong-3] "4"
    feedback: This counts the two undirected edges twice from the adjacency lists instead of counting three nodes. (misconception: counts-adjacency-entries)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "largest component")
Raw input shown:
```
graph = { x: [], y: ['z'], z: ['y'] }
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For graph {x:[], y:[z], z:[y]}, what size is returned?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 3
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: The connected pair is larger than isolated x. (misconception: chooses-isolated-node)
- ❌ [wrong-2] "3"
    feedback: x is disconnected from y and z. (misconception: merges-components)
- ❌ [wrong-3] "0"
    feedback: An undirected y-z edge forms a nonempty component. (misconception: ignores-listed-edge)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`case-4`, facet "largest component")
Raw input shown:
```
graph={"0":[]}
```
Node-name guide shown: Required node-name format: Use the exact object key from graph only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest-component size is returned?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The component sizes are 1; the maximum is 1.
- ❌ [bug] "0"
    feedback: This counts edges in a tree-like component instead of counting nodes. (misconception: count-edges-not-nodes)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: The component sizes are 1; the maximum is 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

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
Your choice: This drops a direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every detail"
Remedial raw input:
```
graph={"0":[1,2],"1":[0],"2":[0,3,4],"3":[2],"4":[2]}
```
Remedial question: **What largest-component size is returned?** · choices shown: 5 | 4
Remedial answer key: ✅ "5" — Correct. The component sizes are 5; the maximum is 5.; ❌ "4" — This counts edges in a tree-like component instead of counting nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 2—3, 2—4
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [nonempty]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each object key, including keys with an empty neighbor list.
Your choice: This wrongly drops isolated nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
graph={"0":[1,3],"1":[0,2],"2":[1],"3":[0]}
```
Remedial question: **What largest-component size is returned?** · choices shown: 3 | 4
Remedial answer key: ✅ "4" — Correct. The component sizes are 4; the maximum is 4.; ❌ "3" — This counts edges in a tree-like component instead of counting nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 0—3
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [oneway]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each appears in the other's neighbor list, because the graph is undirected.
Your choice: The problem promises an undirected graph.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
graph={"0":[1],"1":[0,2],"2":[1,3],"3":[2,4],"4":[3]}
```
Remedial question: **What largest-component size is returned?** · choices shown: 5 | 4
Remedial answer key: ✅ "5" — Correct. The component sizes are 5; the maximum is 5.; ❌ "4" — This counts edges in a tree-like component instead of counting nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—3, 3—4
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: The function chooses the larger component.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
graph={"0":[2,1],"1":[0],"2":[0,3],"3":[2]}
```
Remedial question: **What largest-component size is returned?** · choices shown: 3 | 4
Remedial answer key: ✅ "4" — Correct. The component sizes are 4; the maximum is 4.; ❌ "3" — This counts edges in a tree-like component instead of counting nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—2, 2—3, 0—1
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: The connected pair is larger than isolated x.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
graph={"0":[1,3],"1":[0,2],"2":[1,4],"3":[0],"4":[2]}
```
Remedial question: **What largest-component size is returned?** · choices shown: 5 | 4
Remedial answer key: ✅ "5" — Correct. The component sizes are 5; the maximum is 5.; ❌ "4" — This counts edges in a tree-like component instead of counting nodes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—4, 0—3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `skip-leaf-edges` (authored level "Outer-node loss"; authored goal, NOT shown to student: "Make degree-one nodes decide which component is largest.")
Everything the student sees (text):
```
C
Chelsea's broken search

Chelsea keeps the middle of the graph but disconnects every leaf.

Your main goal: Expose Chelsea's mistake. Draw two graphs: first the correct graph, then Chelsea's graph using the mistake.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
CHELSEA’S OUTPUT
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
2 · Chelsea's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: A", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CHELSEA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"A\",\"B\",\"C\"]","buggy":"[\"A\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes A, B, C · edges (in drawing order) A—B, B—C · start A
Grader's expected answers: correct output `["A","B","C"]` · character's output `["A"]` · character's graph must be exactly: UNDIRECTED · nodes: A, B, C · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `A, B, C`; ❌ curly braces → `{A,B,C}`; ✅ quoted numbers/strings → `["A","B","C"]`; ❌ reversed order → `["C","B","A"]`; ✅ spaces inside brackets → `[ "A" , "B" , "C" ]`; ❌ unquoted labels (if non-numeric) → `[A,B,C]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["A","B","C"]
CHELSEA'S OUTPUT
["A"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Deep component"; authored goal, NOT shown to student: "Build a component whose size is hidden beyond one hop.")
Everything the student sees (text):
```
K
Keegan's broken search

Keegan never explores beyond the start's immediate neighbors.

Your main goal: Expose Keegan's mistake. Draw two graphs: first the correct graph, then Keegan's graph using the mistake.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
KEEGAN’S OUTPUT
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
2 · Keegan's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: A", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KEEGAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"A\",\"B\",\"C\"]","buggy":"[\"A\",\"B\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes A, B, C · edges (in drawing order) A—B, B—C · start A
Grader's expected answers: correct output `["A","B","C"]` · character's output `["A","B"]` · character's graph must be exactly: UNDIRECTED · nodes: A, B, C · edges: A—B, B—C
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["A","B","C"]
KEEGAN'S OUTPUT
["A","B"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `make-one-way` (authored level "Neighbor-list order"; authored goal, NOT shown to student: "Start where a written two-way link would point the wrong way.")
Everything the student sees (text):
```
L
Lyla's broken search

Lyla mistakes undirected links for arrows.

Your main goal: Expose Lyla's mistake. Draw two graphs: first the correct graph, then Lyla's graph using the mistake.

CHOOSE THE COMPONENT SEED
component seed
OUTPUT
CORRECT OUTPUT
LYLA’S OUTPUT
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
2 · Lyla's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPONENT SEED / component seed", placeholder "Example: A", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LYLA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"A\",\"B\"]","buggy":"[\"A\"]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes A, B · edges (in drawing order) B—A · start A
Grader's expected answers: correct output `["A","B"]` · character's output `["A"]` · character's graph must be exactly: DIRECTED · nodes: A, B · edges: B→A
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["A","B"]
LYLA'S OUTPUT
["A"]
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
graph={"0":[1],"1":[0,2],"2":[1,3],"3":[2,4],"4":[3]}
```
Node-name guide: Required node-name format: Use the exact object key from graph only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—3, 3—4
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each already-completed connected component.”"
    feedback if wrong: Components must be found by traversing individual nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
- [YES is correct] (direct-vs-reach) "2 can reach 0 through 1, but the graph still has no direct 2—0 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 2 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Components must be found by traversing individual nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
×
Right. A multi-step route through 1 creates reachability, not a new direct edge.
×
2 has 2 direct neighbors.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "2 can reach 4 through 3, but the graph still has no direct 2—4 edge."
    feedback if wrong: Right. A multi-step route through 3 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only keys whose neighbor array is non-empty.”"
    feedback if wrong: This wrongly drops isolated nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through 3 creates reachability, not a new direct edge.
×
1 has 2 direct neighbors.
×
This wrongly drops isolated nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each neighbor array.”"
    feedback if wrong: The arrays describe edges leaving the keyed nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 2, but the graph still has no direct 3—1 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
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
graph={"0":[2,1],"1":[0],"2":[0,3],"3":[2]}
```
Node-name guide: Required node-name format: Use the exact object key from graph only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—2, 2—3, 0—1
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 can reach 2 through 0, but the graph still has no direct 1—2 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only keys whose neighbor array is non-empty.”"
    feedback if wrong: This wrongly drops isolated nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
Result: PASSED

### S3 Q3
Raw input shown:
```
graph={"0":[1,3],"1":[0,2],"2":[1,4],"3":[0],"4":[2]}
```
Node-name guide: Required node-name format: Use the exact object key from graph only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—4, 0—3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "4 has exactly 2 direct neighbors."
    feedback if wrong: 4 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each already-completed connected component.”"
    feedback if wrong: Components must be found by traversing individual nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—2 and 2—4, so it should also contain a direct 1—4 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
graph={"0":[1,2],"1":[0],"2":[0,3,4],"3":[2],"4":[2]}
```
Node-name guide: Required node-name format: Use the exact object key from graph only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 2—3, 2—4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each neighbor array.”"
    feedback if wrong: The arrays describe edges leaving the keyed nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
- [YES is correct] (direct-vs-reach) "4 can reach 3 through 2, but the graph still has no direct 4—3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
graph={"0":[1,3],"1":[0,2],"2":[1],"3":[0]}
```
Node-name guide: Required node-name format: Use the exact object key from graph only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 0—3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0—2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 2 direct neighbors."
    feedback if wrong: 0 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only keys whose neighbor array is non-empty.”"
    feedback if wrong: This wrongly drops isolated nodes. Correct node rule: Each object key, including keys with an empty neighbor list.
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

### S4 case 1 — `authored-deep-case` · bug: Components are counted instead of their sizes
Input shown:
```
REAL PROBLEM INPUT
graph: { a: ["b"], b: ["a", "c"], c: ["b"], d: ["e"], e: ["d"] }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestComponent(graph) {
  const visited = new Set();
  let components = 0;
  for (const node of Object.keys(graph)) {
    if (visited.has(node)) {
      continue;
    }
    components++;
    const stack = [node];
    visited.add(node);
    while (stack.length) {
      const currentNode = stack.pop();
      for (const next of graph[currentNode]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return components;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "a", "b", "c", "d", "e" · edges: a—b, b—c, d—e
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `3`
Diagnosis choices as displayed:
- A The traversal visits both directions of every edge, causing every component size to be doubled on this shown graph.
- B components increments once per DFS seed and is returned instead of the maximum number of nodes reached by one DFS.
- C Object keys with empty arrays would be skipped, and this altered graph rule changes the value returned here.
Diagnosis answer key + feedback:
- ❌ [undirected-double] "The traversal visits both directions of every edge, causing every component size to be doubled on this shown graph." — feedback: seen prevents double visits; no component size is tracked at all.
- ✅ [counts-components] "components increments once per DFS seed and is returned instead of the maximum number of nodes reached by one DFS." — feedback: Exactly. The two searches have sizes 3 and 2.
- ❌ [missing-isolates] "Object keys with empty arrays would be skipped, and this altered graph rule changes the value returned here." — feedback: The outer key loop includes isolates; this input exposes the wrong quantity returned.
Graph proof shown in feedback: code rule "One counter increments per connected-component traversal." → changed graph "The graph has components {a,b,c} of size 3 and {d,e} of size 2." → boundary "The number of components, 2, differs from the largest component size, 3." → returned value "The helper returns 2 instead of 3."
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
×
The graph-level diagnosis is correct
✓
The incorrect solution's exact output is correct
About your diagnosis: seen prevents double visits; no component size is tracked at all.
Code rule: One counter increments per connected-component traversal. → Changed graph: The graph has components {a,b,c} of size 3 and {d,e} of size 2. → Reachable boundary: The number of components, 2, differs from the largest component size, 3.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Components are counted instead of their sizes
INCORRECT OUTPUT
2
CORRECT OUTPUT
3
Code rule: One counter increments per connected-component traversal. → Changed graph: The graph has components {a,b,c} of size 3 and {d,e} of size 2. → Reachable boundary: The number of components, 2, differs from the largest component size, 3. → Returned value: The helper returns 2 instead of 3.
```

### S4 case 2 — `new-long-chain-plus-isolate` · bug: Components are counted instead of their sizes
Input shown:
```
REAL PROBLEM INPUT
graph: { a: ["b"], b: ["a", "c"], c: ["b", "d"], d: ["c"], e: [] }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestComponent(graph) {
  const visited = new Set();
  let components = 0;
  for (const node of Object.keys(graph)) {
    if (visited.has(node)) {
      continue;
    }
    components++;
    const stack = [node];
    visited.add(node);
    while (stack.length) {
      const currentNode = stack.pop();
      for (const next of graph[currentNode]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return components;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "a", "b", "c", "d", "e" · edges: a—b, b—c, c—d
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `4`
Diagnosis choices as displayed:
- A The isolated node e is accidentally counted as four nodes because its list is empty.
- B String keys make b and d compare equal in the seen set.
- C The function increments once per traversal and returns two traversals instead of the largest traversal size four.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The isolated node e is accidentally counted as four nodes because its list is empty." — feedback: The empty neighbor list makes e a normal singleton component, not four nodes.
- ✅ [counts-components] "The function increments once per traversal and returns two traversals instead of the largest traversal size four." — feedback: Exactly. It never counts nodes inside either traversal.
- ❌ [wrong-visited] "String keys make b and d compare equal in the seen set." — feedback: Set membership keeps the distinct string keys b and d separate.
Graph proof shown in feedback: code rule "components increments only when a new DFS starts." → changed graph "One component is a—b—c—d with size 4; e is isolated." → boundary "Two component starts and largest size four are different quantities." → returned value "The helper returns 2; the requested largest component size is 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Components are counted instead of their sizes
INCORRECT OUTPUT
2
CORRECT OUTPUT
4
Code rule: components increments only when a new DFS starts. → Changed graph: One component is a—b—c—d with size 4; e is isolated. → Reachable boundary: Two component starts and largest size four are different quantities. → Returned value: The helper returns 2; the requested largest component size is 4.
```

### S4 case 3 — `new-four-three-one` · bug: Components are counted instead of their sizes
Input shown:
```
REAL PROBLEM INPUT
graph: { a: ["b", "c"], b: ["a", "d"], c: ["a"], d: ["b"], e: ["f"], f: ["e", "g"], g: ["f"], h: [] }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function largestComponent(graph) {
  const visited = new Set();
  let components = 0;
  for (const node of Object.keys(graph)) {
    if (visited.has(node)) {
      continue;
    }
    components++;
    const stack = [node];
    visited.add(node);
    while (stack.length) {
      const currentNode = stack.pop();
      for (const next of graph[currentNode]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
  }
  return components;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "a", "b", "c", "d", "e", "f", "g", "h" · edges: a—b, a—c, b—d, e—f, f—g
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `4`
Diagnosis choices as displayed:
- A The returned counter is the three components, not the four nodes in the largest one.
- B The branch at a makes node c start a second component after DFS returns.
- C The isolated node h should be excluded from Object.keys and from all counts.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The branch at a makes node c start a second component after DFS returns." — feedback: DFS from a reaches c before another outer loop iteration, so c cannot start a second component.
- ✅ [counts-components] "The returned counter is the three components, not the four nodes in the largest one." — feedback: Exactly. Traversal sizes 4, 3, and 1 are never recorded.
- ❌ [wrong-visited] "The isolated node h should be excluded from Object.keys and from all counts." — feedback: Every object key is a graph node; isolated h must count as its own component.
Graph proof shown in feedback: code rule "The code records only how many DFS launches occur." → changed graph "The component sizes are 4, 3, and 1." → boundary "Three launches differ from maximum traversal size four." → returned value "The code returns 3 components; the correct largest size is 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Components are counted instead of their sizes
INCORRECT OUTPUT
3
CORRECT OUTPUT
4
Code rule: The code records only how many DFS launches occur. → Changed graph: The component sizes are 4, 3, and 1. → Reachable boundary: Three launches differ from maximum traversal size four. → Returned value: The code returns 3 components; the correct largest size is 4.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```