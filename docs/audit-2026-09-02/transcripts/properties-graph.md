# Properties Graph (`properties-graph`) — new, undirected-graph

## Problem statement (Description tab)

You are given a 2D integer array `properties` with `n` rows (each row is a list of `m` integers) and an integer `k`.

Define `intersect(a, b)` as the number of **distinct** integers that appear in both array `a` and array `b`.

Build an undirected graph with one node per row: node `i` stands for `properties[i]`. Add an edge between node `i` and node `j` (for `i != j`) exactly when `intersect(properties[i], properties[j]) >= k`.

Return the number of connected components in this graph.

### Examples
- Example 1: input `properties = [[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]], k = 1` → output `3`. As sets of distinct values the rows are {1,2}, {1}, {3,4}, {4,5}, {5,6}, {7}. Edges (at least 1 shared value): 0-1 (share 1), 2-3 (share 4), 3-4 (share 5). That produces components {0,1}, {2,3,4}, and {5}, so there are 3 components.
- Example 2: input `properties = [[1,2,3],[2,3,4],[4,3,5]], k = 2` → output `1`. Rows 0 and 1 share {2,3} (2 values, edge). Rows 1 and 2 share {3,4} (2 values, edge). Rows 0 and 2 share only {3}, so no direct edge, but all three nodes are still connected through node 1. One component.

### Graph rules (authored)
- Nodes: The entire row properties[i], treated as a set for comparison.
- Edges: Their rows share at least k distinct values.
- Node-name format shown in Step 1/3: Name each row `row index: {comma-separated set values}`. Example: `row 1: {2,3}`. Do not add spaces inside the braces. (pattern `^row \d+: \{[^{}]*\}$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "one node per row")
Raw input shown:
```
properties=[[1,2],[2,3],[8]], k=1
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Rows 0 and 1 connect; row 2 is a separate component.
- ❌ [wrong] "1"
    feedback: That follows the drop isolated row bug. (misconception: drop-isolated-row)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "row 0: {1,2}", "row 1: {2,3}", "row 2: {8}" · edges: row 0: {1,2}—row 1: {2,3}
"Why" shown after success: Rows 0 and 1 connect; row 2 is a separate component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "one node per row")
Raw input shown:
```
properties=[[1,2],[2,3],[8]], k=1
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / row 0: {1,2} / row 1: {2,3}
2. Picture C / row 0: {1,2} / row 1: {2,3} / row 2: {8}
3. Picture A / row 0: {1,2} / row 1: {2,3} / row 2: {8}
4. Picture D / row 0: {1,2} / row 1: {2,3} / row 2: {8}
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: row 0: {1,2}, row 1: {2,3}, row 2: {8} · edges: row 0: {1,2}—row 1: {2,3}
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: row 0: {1,2}, row 1: {2,3} · edges: row 0: {1,2}—row 1: {2,3}
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: row 0: {1,2}, row 1: {2,3}, row 2: {8} · edges: none
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: row 0: {1,2}, row 1: {2,3}, row 2: {8} · edges: row 0: {1,2}→row 1: {2,3}
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "row identity")
Raw input shown:
```
What does node i stand for?
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does node i stand for?**
Choices as displayed (top to bottom):
1. A / One distinct integer appearing anywhere in properties.
2. B / One occurrence of every integer, including duplicates in a row.
3. C / One pair of rows whose overlap was tested.
4. D / The entire row properties[i], treated as a set for comparison.
Answer key + feedback per choice (data):
- ✅ CORRECT [row] "The entire row properties[i], treated as a set for comparison."
    feedback: Right. There is exactly one node per input row.
- ❌ [value] "One distinct integer appearing anywhere in properties."
    feedback: Integers are features of row nodes, not graph nodes here. (misconception: uses-values-as-nodes)
- ❌ [duplicate] "One occurrence of every integer, including duplicates in a row."
    feedback: Duplicates do not create nodes and do not increase intersection. (misconception: counts-duplicates)
- ❌ [pair] "One pair of rows whose overlap was tested."
    feedback: A tested pair may become an edge; the rows are nodes. (misconception: uses-pairs-as-nodes)
"Why" shown after success: Right. There is exactly one node per input row.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "row identity")
Raw input shown:
```
properties=[[1,1],[1,2]], k=2
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The rows share only one distinct value.
- ❌ [wrong] "1"
    feedback: That follows the count duplicate values bug. (misconception: count-duplicate-values)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "row 0: {1}", "row 1: {1,2}" · edges: none
"Why" shown after success: The rows share only one distinct value.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "distinct-overlap edges")
Raw input shown:
```
When do row nodes i and j get an edge?
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When do row nodes i and j get an edge?**
Choices as displayed (top to bottom):
1. A / They have at least k matching occurrences, counting duplicates repeatedly.
2. B / Together their rows contain at least k distinct values.
3. C / Their rows share at least k distinct values.
4. D / They can be linked through k other row nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [distinct-k] "Their rows share at least k distinct values."
    feedback: Right. Sets ensure repeated values count only once.
- ❌ [occurrences-k] "They have at least k matching occurrences, counting duplicates repeatedly."
    feedback: The intersection counts distinct shared integers. (misconception: counts-duplicates)
- ❌ [union-k] "Together their rows contain at least k distinct values."
    feedback: The rule uses intersection, not union. (misconception: uses-union)
- ❌ [path-k] "They can be linked through k other row nodes."
    feedback: Connectivity through other rows is a path, not the direct overlap rule. (misconception: confuses-path-with-edge)
"Why" shown after success: Right. Sets ensure repeated values count only once.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "distinct-overlap edges")
Raw input shown:
```
properties=[[1,2],[2,3],[3,4]], k=1
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A chain still forms one component.
- ❌ [wrong] "2"
    feedback: That follows the require a clique bug. (misconception: require-a-clique)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "row 0: {1,2}", "row 1: {2,3}", "row 2: {3,4}" · edges: row 0: {1,2}—row 1: {2,3}, row 1: {2,3}—row 2: {3,4}
"Why" shown after success: A chain still forms one component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "component count")
Raw input shown:
```
properties = [[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]], k = 1
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many connected components are returned for the shown rows and k?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 4
3. C / 6
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: Node 5 is an isolated third component. (misconception: drops-isolated-node)
- ❌ [wrong-2] "4"
    feedback: This counts the three edges plus isolated node 5 as four groups instead of merging connected edges. (misconception: counts-edges-plus-isolated)
- ❌ [wrong-3] "6"
    feedback: Connected rows merge into components. (misconception: counts-nodes)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "component count")
Raw input shown:
```
properties = [[1,2,3],[2,3,4],[4,3,5]], k = 2
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many connected components are returned for the shown rows and k?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 3
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: Node 1 connects all three through a path. (misconception: requires-clique)
- ❌ [wrong-2] "3"
    feedback: Direct edge 0-2 is not needed for connectivity. (misconception: ignores-transitive-connectivity)
- ❌ [wrong-3] "0"
    feedback: A nonempty graph has at least one component. (misconception: returns-zero-for-connected)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "component count")
Raw input shown:
```
properties=[[5]], k=1
```
Node-name guide shown: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. A nonempty graph has one one-node component.
- ❌ [wrong] "0"
    feedback: That follows the drop isolated row bug. (misconception: drop-isolated-row)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "row 0: {5}" · edges: none
"Why" shown after success: A nonempty graph has one one-node component.
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
properties=[[1,2],[1,2]], k=2
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Sharing exactly k distinct values creates an edge.; ❌ "2" — That follows the use strictly more than k bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "row 0: {1,2}", "row 1: {1,2}" · edges: row 0: {1,2}—row 1: {1,2}
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [value]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The entire row properties[i], treated as a set for comparison.
Your choice: Integers are features of row nodes, not graph nodes here.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
properties=[[1],[2],[1]], k=1
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "2" — Correct. Rows 0 and 2 connect even though their indexes are not adjacent.; ❌ "3" — That follows the ignore nonadjacent row pair bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "row 0: {1}", "row 1: {2}", "row 2: {1}" · edges: row 0: {1}—row 2: {1}
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [occurrences-k]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Their rows share at least k distinct values.
Your choice: The intersection counts distinct shared integers.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
properties=[[1,2,3],[2,3,4],[3,4,5]], k=2
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. Edges 0-1 and 1-2 make one component.; ❌ "2" — That follows the ignore transitive connectivity bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "row 0: {1,2,3}", "row 1: {2,3,4}", "row 2: {3,4,5}" · edges: row 0: {1,2,3}—row 1: {2,3,4}, row 1: {2,3,4}—row 2: {3,4,5}
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Node 5 is an isolated third component.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
properties=[[1],[2]], k=1
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. Rows with no shared property stay separate.; ❌ "1" — That follows the connect disjoint rows bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "row 0: {1}", "row 1: {2}" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: Node 1 connects all three through a path.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
properties=[[7,7],[7],[8]], k=1
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. Duplicate 7s do not change the one edge or the isolated third row.; ❌ "1" — That follows the count duplicate as extra edge bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "row 0: {7}", "row 1: {7}", "row 2: {8}" · edges: row 0: {7}—row 1: {7}
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Symmetric overlap"; authored goal, NOT shown to student: "Order two rows so a one-way reading blocks a valid match.")
Everything the student sees (text):
```
M
Maximus's broken search

Maximus allows each two-way link to work only in its written order.

Your main goal: Expose Maximus's mistake. Draw two graphs: first the correct graph, then Maximus's graph using the mistake.

CHOOSE THE CHOSEN ROW
chosen row
OUTPUT
CORRECT OUTPUT
MAXIMUS’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen row
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
2 · Maximus's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN ROW / chosen row", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MAXIMUS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("row 0: {1,2}", "row 1: {2,3}", "row 2: {8}"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
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
MAXIMUS'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Shared-property chain"; authored goal, NOT shown to student: "Reach a row through another row, not by direct overlap alone.")
Everything the student sees (text):
```
J
Jayda's broken search

Jayda stops after one hop instead of continuing.

Your main goal: Expose Jayda's mistake. Draw two graphs: first the correct graph, then Jayda's graph using the mistake.

CHOOSE THE CHOSEN ROW
chosen row
OUTPUT
CORRECT OUTPUT
JAYDA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen row
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
2 · Jayda's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN ROW / chosen row", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JAYDA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JAYDA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Row-index check"; authored goal, NOT shown to student: "Make the chosen row different from the first row listed.")
Everything the student sees (text):
```
R
Ruben's broken search

Ruben ignores the chosen chosen row and uses a different one.

Your main goal: Expose Ruben's mistake. Draw two graphs: first the correct graph, then Ruben's graph using the mistake.

CHOOSE THE CHOSEN ROW
chosen row
OUTPUT
CORRECT OUTPUT
RUBEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen row
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
2 · Ruben's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN ROW / chosen row", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | RUBEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
RUBEN'S OUTPUT
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
properties=[[1,2],[1,2]], k=2
```
Node-name guide: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "row 0: {1,2}", "row 1: {1,2}" · edges: row 0: {1,2}—row 1: {1,2}
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One occurrence of every integer, including duplicates in a row.”"
    feedback if wrong: Duplicates do not create nodes and do not increase intersection. Correct node rule: Input row index i; properties[i] is payload carried by that node.
- [YES is correct] (direct-vs-reach) "row 0: {1,2} and row 1: {1,2} are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge.
- [YES is correct] (local-degree) "row 0: {1,2} has exactly 1 direct neighbor."
    feedback if wrong: row 0: {1,2} has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Duplicates do not create nodes and do not increase intersection. Correct node rule: Input row index i; properties[i] is payload carried by that node.
×
Correct. The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge.
×
row 0: {1,2} has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "row 1: {1,2} has exactly 0 direct neighbors."
    feedback if wrong: row 1: {1,2} has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One pair of rows whose overlap was tested.”"
    feedback if wrong: A tested pair may become an edge; the rows are nodes. Correct node rule: Input row index i; properties[i] is payload carried by that node.
- [NO is correct] (direct-vs-reach) "row 0: {1,2} can reach row 1: {1,2}, but there is no direct row 0: {1,2}—row 1: {1,2} edge."
    feedback if wrong: The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
row 1: {1,2} has 1 direct neighbor.
×
A tested pair may become an edge; the rows are nodes. Correct node rule: Input row index i; properties[i] is payload carried by that node.
×
The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One distinct integer appearing anywhere in properties.”"
    feedback if wrong: Integers are features of row nodes, not graph nodes here. Correct node rule: Input row index i; properties[i] is payload carried by that node.
- [NO is correct] (direct-vs-reach) "row 0: {1,2} can reach row 1: {1,2}, but there is no direct row 0: {1,2}—row 1: {1,2} edge."
    feedback if wrong: The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "row 0: {1,2} has exactly 2 direct neighbors."
    feedback if wrong: row 0: {1,2} has 1 direct neighbor.
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
properties=[[1],[2],[1]], k=1
```
Node-name guide: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "row 0: {1}", "row 1: {2}", "row 2: {1}" · edges: row 0: {1}—row 2: {1}
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "row 0: {1} and row 2: {1} are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists row 0: {1}—row 2: {1} as one direct edge.
- [YES is correct] (local-degree) "row 2: {1} has exactly 1 direct neighbor."
    feedback if wrong: row 2: {1} has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One pair of rows whose overlap was tested.”"
    feedback if wrong: A tested pair may become an edge; the rows are nodes. Correct node rule: Input row index i; properties[i] is payload carried by that node.
Result: PASSED

### S3 Q3
Raw input shown:
```
properties=[[1,2,3],[2,3,4],[3,4,5]], k=2
```
Node-name guide: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "row 0: {1,2,3}", "row 1: {2,3,4}", "row 2: {3,4,5}" · edges: row 0: {1,2,3}—row 1: {2,3,4}, row 1: {2,3,4}—row 2: {3,4,5}
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has row 0: {1,2,3}—row 1: {2,3,4} and row 1: {2,3,4}—row 2: {3,4,5}, so it should also contain a direct row 0: {1,2,3}—row 2: {3,4,5} edge."
    feedback if wrong: Two direct edges through row 1: {2,3,4} do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "row 1: {2,3,4} has exactly 3 direct neighbors."
    feedback if wrong: row 1: {2,3,4} has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One occurrence of every integer, including duplicates in a row.”"
    feedback if wrong: Duplicates do not create nodes and do not increase intersection. Correct node rule: Input row index i; properties[i] is payload carried by that node.
Result: PASSED

### S3 Q4
Raw input shown:
```
properties=[[1],[2]], k=1
```
Node-name guide: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "row 0: {1}", "row 1: {2}" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One distinct integer appearing anywhere in properties.”"
    feedback if wrong: Integers are features of row nodes, not graph nodes here. Correct node rule: Input row index i; properties[i] is payload carried by that node.
- [NO is correct] (direct-vs-reach) "row 0: {1} can reach row 1: {2}, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between row 0: {1} and row 1: {2}.
- [NO is correct] (local-degree) "row 1: {2} has exactly 1 direct neighbor."
    feedback if wrong: row 1: {2} has 0 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
properties=[[7,7],[7],[8]], k=1
```
Node-name guide: Required node-name format: Name each row row index: {comma-separated set values}. Example: row 1: {2,3}. Do not add spaces inside the braces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "row 0: {7}", "row 1: {7}", "row 2: {8}" · edges: row 0: {7}—row 1: {7}
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "row 2: {8} has exactly 0 direct neighbors."
    feedback if wrong: row 2: {8} has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One pair of rows whose overlap was tested.”"
    feedback if wrong: A tested pair may become an edge; the rows are nodes. Correct node rule: Input row index i; properties[i] is payload carried by that node.
- [YES is correct] (direct-vs-reach) "row 0: {7} and row 1: {7} are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists row 0: {7}—row 1: {7} as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Duplicate values inflate row intersection
Input shown:
```
REAL PROBLEM INPUT
properties: [[1, 1], [1, 2], [3]]
k: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numberOfComponents(properties, k) {
  const numberOfNodes = properties.length;
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (let index = 0; index < numberOfNodes; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < numberOfNodes;
      otherIndex++
    ) {
      let common = 0;
      for (const value of properties[index]) {
        if (properties[otherIndex].includes(value)) {
          common++;
        }
      }
      if (common >= k) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  const visited = new Set();
  let groups = 0;
  for (let startNode = 0; startNode < numberOfNodes; startNode++) {
    if (!visited.has(startNode)) {
      groups++;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const currentNode = stack.pop();
        for (const nextNode of next[currentNode]) {
          if (!visited.has(nextNode)) {
            visited.add(nextNode);
            stack.push(nextNode);
          }
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "row 0", "row 1", "row 2" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `3`
Diagnosis choices as displayed:
- A Both copies of 1 in row 0 increment common, even though the shared distinct set is only {1}.
- B Rows 0 and 1 collapse into one node because both contain value 1 for the shown graph.
- C The edge test should use common > k instead of common >= k, changing this input's returned value.
Diagnosis answer key + feedback:
- ❌ [row-identity] "Rows 0 and 1 collapse into one node because both contain value 1 for the shown graph." — feedback: The code keeps one node per row; it invents an edge between them.
- ❌ [threshold-strict] "The edge test should use common > k instead of common >= k, changing this input's returned value." — feedback: At least k means >= k; the count of common values is wrong.
- ✅ [duplicate-intersection] "Both copies of 1 in row 0 increment common, even though the shared distinct set is only {1}." — feedback: Exactly. Intersections must compare sets of distinct values.
Graph proof shown in feedback: code rule "Each occurrence in the first row can increment the common counter." → changed graph "All three row nodes are isolated because no pair shares two distinct values." → boundary "Row 0 repeats 1 twice while row 1 contains one 1." → returned value "The code invents edge 0—1 and returns 2 components; the real graph has 3."
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
About your diagnosis: The code keeps one node per row; it invents an edge between them.
Code rule: Each occurrence in the first row can increment the common counter. → Changed graph: All three row nodes are isolated because no pair shares two distinct values. → Reachable boundary: Row 0 repeats 1 twice while row 1 contains one 1.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Duplicate values inflate row intersection
INCORRECT OUTPUT
2
CORRECT OUTPUT
3
Code rule: Each occurrence in the first row can increment the common counter. → Changed graph: All three row nodes are isolated because no pair shares two distinct values. → Reachable boundary: Row 0 repeats 1 twice while row 1 contains one 1. → Returned value: The code invents edge 0—1 and returns 2 components; the real graph has 3.
```

### S4 case 2 — `build-2` · bug: Duplicate values inflate row intersection
Input shown:
```
REAL PROBLEM INPUT
properties=[[1,1],[1,2]], k=2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numberOfComponents(properties, k) {
  const numberOfNodes = properties.length;
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (let index = 0; index < numberOfNodes; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < numberOfNodes;
      otherIndex++
    ) {
      let common = 0;
      for (const value of properties[index]) {
        if (properties[otherIndex].includes(value)) {
          common++;
        }
      }
      if (common >= k) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  const visited = new Set();
  let groups = 0;
  for (let startNode = 0; startNode < numberOfNodes; startNode++) {
    if (!visited.has(startNode)) {
      groups++;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const currentNode = stack.pop();
        for (const nextNode of next[currentNode]) {
          if (!visited.has(nextNode)) {
            visited.add(nextNode);
            stack.push(nextNode);
          }
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "row 0: {1}", "row 1: {1,2}" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A Rows 0 and 1 collapse into one node because both contain value 1 for the shown graph.
- B Both copies of 1 in row 0 increment common, even though the shared distinct set is only {1}.
- C The edge test should use common > k instead of common >= k, changing this input's returned value.
Diagnosis answer key + feedback:
- ❌ [row-identity] "Rows 0 and 1 collapse into one node because both contain value 1 for the shown graph." — feedback: The code keeps one node per row; it invents an edge between them.
- ❌ [threshold-strict] "The edge test should use common > k instead of common >= k, changing this input's returned value." — feedback: At least k means >= k; the count of common values is wrong.
- ✅ [duplicate-intersection] "Both copies of 1 in row 0 increment common, even though the shared distinct set is only {1}." — feedback: Correct. Rows 0 and 1 share only distinct value {1}; counting row 0's duplicate 1 twice invents edge 0—1 and merges two components.
Graph proof shown in feedback: code rule "Each occurrence in the first row can increment the common counter." → changed graph "Rows 0={1} and 1={1,2} are separate nodes with no edge because their distinct overlap is below two." → boundary "Row 0 repeats value 1, while row 1 contains it once; their distinct intersection has size one, below k=2." → returned value "The shown code returns 1; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Duplicate values inflate row intersection
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Each occurrence in the first row can increment the common counter. → Changed graph: Rows 0={1} and 1={1,2} are separate nodes with no edge because their distinct overlap is below two. → Reachable boundary: Row 0 repeats value 1, while row 1 contains it once; their distinct intersection has size one, below k=2. → Returned value: The shown code returns 1; the real problem returns 2.
```

### S4 case 3 — `new-duplicate-bridge-four-rows` · bug: Duplicate values inflate row intersection
Input shown:
```
REAL PROBLEM INPUT
properties: [[1, 1, 2], [1, 3], [2, 4], [5]]
k: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numberOfComponents(properties, k) {
  const numberOfNodes = properties.length;
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (let index = 0; index < numberOfNodes; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < numberOfNodes;
      otherIndex++
    ) {
      let common = 0;
      for (const value of properties[index]) {
        if (properties[otherIndex].includes(value)) {
          common++;
        }
      }
      if (common >= k) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  const visited = new Set();
  let groups = 0;
  for (let startNode = 0; startNode < numberOfNodes; startNode++) {
    if (!visited.has(startNode)) {
      groups++;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const currentNode = stack.pop();
        for (const nextNode of next[currentNode]) {
          if (!visited.has(nextNode)) {
            visited.add(nextNode);
            stack.push(nextNode);
          }
        }
      }
    }
  }
  return groups;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: none
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `4`
Diagnosis choices as displayed:
- A Row 3 is omitted because value 5 appears in no other row.
- B The edge threshold should be common>k, which would also remove valid size-k edges.
- C The two copies of 1 in row 0 both increment common against row 1, inventing edge 0—1 at k=2.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "Row 3 is omitted because value 5 appears in no other row." — feedback: All four input rows are graph nodes even when a row shares no value with another row.
- ✅ [duplicate-intersection] "The two copies of 1 in row 0 both increment common against row 1, inventing edge 0—1 at k=2." — feedback: Exactly. Distinct intersection {1} has size one, so all four rows stay separate.
- ❌ [wrong-visited] "The edge threshold should be common>k, which would also remove valid size-k edges." — feedback: The rule is at least k distinct shared values; changing it to greater than k would reject valid edges.
Graph proof shown in feedback: code rule "Repeated values in the first row increment common repeatedly." → changed graph "No row pair shares two distinct values, so four row nodes are isolated." → boundary "Only row 0 repeats the one value it shares with row 1." → returned value "The code invents one edge and returns 3 components; the real graph has 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Duplicate values inflate row intersection
INCORRECT OUTPUT
3
CORRECT OUTPUT
4
Code rule: Repeated values in the first row increment common repeatedly. → Changed graph: No row pair shares two distinct values, so four row nodes are isolated. → Reachable boundary: Only row 0 repeats the one value it shares with row 1. → Returned value: The code invents one edge and returns 3 components; the real graph has 4.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```