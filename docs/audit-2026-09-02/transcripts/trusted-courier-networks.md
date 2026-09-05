# Trusted Courier Networks (`trusted-courier-networks`) — variant, undirected-graph

## Problem statement (Description tab)

A delivery company has `n` offices, numbered `0` to `n - 1`. You are given an `n x n` matrix `trust`, where `trust[i][j]` is a **trust score** between office `i` and office `j`, from `0` (strangers) to `10` (fully trusted). The matrix is symmetric (`trust[i][j] = trust[j][i]`), and `trust[i][i]` is always `10`.

Two offices open a **direct secure line** only if their trust score is **at least `k`**.

Offices belong to the same **network** if you can get from one to the other through a chain of direct secure lines (possibly passing through other offices along the way). An office with no secure lines is a network all by itself.

Write a function `countSecureNetworks(trust, k)` that returns how many separate networks there are.

### Examples
- Example 1: input `trust = [[10,5,1],[5,10,7],[1,7,10]], k = 5` → output `1`. Offices 0 and 1 have score 5 (>= 5), so they link. Offices 1 and 2 have score 7 (>= 5), so they link. Offices 0 and 2 only score 1, but they are still in the same network through office 1. Everyone is connected: 1 network.
- Example 2: input `trust = [[10,5,1],[5,10,7],[1,7,10]], k = 8` → output `3`. With k = 8, no pair reaches a score of 8, so no secure lines exist at all. Each office is its own network: 3 networks.

### Graph rules (authored)
- Nodes: Every office index `0` through `n−1`, even one trusted by nobody.
- Edges: When `trust[i][j] >= k`; the qualifying edge is undirected.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact trust scores")
Raw input shown:
```
trust=[[10,7,0,0,0],[7,10,7,0,0],[0,7,10,0,0],[0,0,0,10,7],[0,0,0,7,10]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many trusted networks are formed?**
Choices as displayed (top to bottom):
1. 5
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The qualifying score-7 links form 2 connected components.
- ❌ [bug] "5"
    feedback: This counts offices (or qualifying entries) rather than connected trust components. (misconception: count-nodes-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 3—4
"Why" shown after success: The qualifying score-7 links form 2 connected components.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact trust scores")
Raw input shown:
```
trust=[[10,7,0,0,0],[7,10,7,0,0],[0,7,10,0,0],[0,0,0,10,7],[0,0,0,7,10]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3 / 4
2. Picture B / 0 / 1 / 2 / 3 / 4
3. Picture C / 0 / 1 / 2 / 3 / 4
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

### S1 Q3 — BUILD (`case-2`, facet "office identity")
Raw input shown:
```
trust=[[10,7,0,0],[7,10,7,0],[0,7,10,7],[0,0,7,10]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many trusted networks are formed?**
Choices as displayed (top to bottom):
1. 1
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The qualifying score-7 links form 1 connected component.
- ❌ [bug] "4"
    feedback: This counts offices (or qualifying entries) rather than connected trust components. (misconception: count-nodes-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: The qualifying score-7 links form 1 connected component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-node`, facet "office identity")
Raw input shown:
```
trust = [[10,9,0,0,0,0],[9,10,7,0,0,0],[0,7,10,5,0,0],[0,0,5,10,8,0],[0,0,0,8,10,4],[0,0,0,0,4,10]], k = 6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each node represent in the courier network?**
Choices as displayed (top to bottom):
1. A / Only offices that have at least one trust score at or above k.
2. B / Each distinct score found in the trust matrix.
3. C / Every office index 0 through n−1, even one trusted by nobody.
4. D / One node for each final trusted component.
Answer key + feedback per choice (data):
- ✅ CORRECT [offices] "Every office index `0` through `n−1`, even one trusted by nobody."
    feedback: Correct. An isolated office forms its own one-office network.
- ❌ [trusted-offices] "Only offices that have at least one trust score at or above k."
    feedback: An office with no qualifying line still exists as an isolated network. (misconception: omit-isolated)
- ❌ [trust-scores] "Each distinct score found in the trust matrix."
    feedback: Scores decide whether office pairs have edges; they are not places in the network. (misconception: weight-as-node)
- ❌ [networks] "One node for each final trusted component."
    feedback: Those components are what DFS must discover from office nodes. (misconception: component-as-node)
"Why" shown after success: Correct. An isolated office forms its own one-office network.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-edge`, facet "threshold edges")
Raw input shown:
```
trust = [[10,9,0,0,0,0],[9,10,7,0,0,0],[0,7,10,5,0,0],[0,0,5,10,8,0],[0,0,0,8,10,4],[0,0,0,0,4,10]], k = 6
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should offices i and j share an edge?**
Choices as displayed (top to bottom):
1. A / Whenever trust[i][j] > 0, with low scores treated as weak edges.
2. B / Only when trust[i][j] > k; a score exactly k is rejected.
3. C / When trust[i][j] >= k; the qualifying edge is undirected.
4. D / Connect i and j directly when a chain of high-trust offices links them.
Answer key + feedback per choice (data):
- ✅ CORRECT [threshold] "When `trust[i][j] >= k`; the qualifying edge is undirected."
    feedback: Correct. Meeting the threshold creates a usable secure line in both directions.
- ❌ [positive] "Whenever `trust[i][j] > 0`, with low scores treated as weak edges."
    feedback: A below-k score creates no edge at all, not a weaker usable connection. (misconception: ignore-threshold)
- ❌ [strict] "Only when `trust[i][j] > k`; a score exactly k is rejected."
    feedback: The rule is at least k, so equality must create an edge. (misconception: strict-threshold)
- ❌ [transitive-trust] "Connect i and j directly when a chain of high-trust offices links them."
    feedback: That chain makes them reachable in one component, but it is not one direct trust edge. (misconception: path-as-edge)
"Why" shown after success: Correct. Meeting the threshold creates a usable secure line in both directions.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "threshold edges")
Raw input shown:
```
trust=[[10,7,0,0,0],[7,10,0,0,0],[0,0,10,7,0],[0,0,7,10,0],[0,0,0,0,10]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many trusted networks are formed?**
Choices as displayed (top to bottom):
1. 5
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The qualifying score-7 links form 3 connected components.
- ❌ [bug] "5"
    feedback: This counts offices (or qualifying entries) rather than connected trust components. (misconception: count-nodes-not-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
"Why" shown after success: The qualifying score-7 links form 3 connected components.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "trusted components")
Raw input shown:
```
trust=[[0,8,0,0,0,0],[8,0,7,0,0,0],[0,7,0,0,0,0],[0,0,0,0,9,0],[0,0,0,9,0,0],[0,0,0,0,0,0]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many trusted networks remain after keeping scores at least k?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 6
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct: {0,1,2}, {3,4}, and isolated office {5}.
- ❌ [two] "2"
    feedback: This drops isolated office 5 instead of counting its one-node component. (misconception: drop-isolated-node)
- ❌ [one] "1"
    feedback: This keeps zero-score matrix entries as edges and joins unrelated offices. (misconception: treat-zero-as-edge)
- ❌ [six] "6"
    feedback: This counts offices rather than connected components. (misconception: count-nodes)
"Why" shown after success: Correct: {0,1,2}, {3,4}, and isolated office {5}.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "trusted components")
Raw input shown:
```
trust=[[10]], k=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many trusted networks are formed?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The lone office is one network, so the answer is 1.
- ❌ [bug] "0"
    feedback: This drops isolated offices even though each one is its own network. (misconception: drop-isolated-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: The lone office is one network, so the answer is 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "trusted components")
Raw input shown:
```
trust=[[0,5,0,0],[5,0,4,0],[0,4,0,6],[0,0,6,0]], k=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many trusted networks are formed?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 4
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1"
    feedback: Correct. Scores 5, 4, and 6 form one chain across all offices.
- ❌ [two] "2"
    feedback: This uses score > k and wrongly drops the score exactly equal to 4. (misconception: strict-threshold)
- ❌ [three] "3"
    feedback: This counts qualifying edges instead of connected components. (misconception: count-edges)
- ❌ [four] "4"
    feedback: This requires every pair in a component to have a direct qualifying edge. (misconception: require-clique)
"Why" shown after success: Correct. Scores 5, 4, and 6 form one chain across all offices.
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
trust=[[10,7,7,7,0],[7,10,0,0,0],[7,0,10,0,0],[7,0,0,10,7],[0,0,0,7,10]], k=6
```
Remedial question: **How many trusted networks are formed?** · choices shown: 5 | 1
Remedial answer key: ✅ "1" — Correct. The qualifying score-7 links form 1 connected component.; ❌ "5" — This counts offices (or qualifying entries) rather than connected trust components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [trusted-offices]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every office index 0 through n−1, even one trusted by nobody.
Your choice: An office with no qualifying line still exists as an isolated network.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
trust=[[10,7,7,0],[7,10,7,0],[7,7,10,0],[0,0,0,10]], k=6
```
Remedial question: **How many trusted networks are formed?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. The qualifying score-7 links form 2 connected components.; ❌ "4" — This counts offices (or qualifying entries) rather than connected trust components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [positive]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
When trust[i][j] >= k; the qualifying edge is undirected.
Your choice: A below-k score creates no edge at all, not a weaker usable connection.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
trust=[[10,0,0],[0,10,0],[0,0,10]], k=6
```
Remedial question: **How many trusted networks are formed?** · choices shown: 0 | 3
Remedial answer key: ✅ "3" — Correct. Each isolated office forms its own network, giving 3 components.; ❌ "0" — This drops isolated offices even though each one is its own network.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This drops isolated office 5 instead of counting its one-node component.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
trust=[[10,7,0,0],[7,10,0,0],[0,0,10,7],[0,0,7,10]], k=6
```
Remedial question: **How many trusted networks are formed?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. The qualifying score-7 links form 2 connected components.; ❌ "4" — This counts offices (or qualifying entries) rather than connected trust components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: This uses score > k and wrongly drops the score exactly equal to 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
trust=[[10,7,7,7,7],[7,10,0,0,0],[7,0,10,0,0],[7,0,0,10,0],[7,0,0,0,10]], k=6
```
Remedial question: **How many trusted networks are formed?** · choices shown: 5 | 1
Remedial answer key: ✅ "1" — Correct. The qualifying score-7 links form 1 connected component.; ❌ "5" — This counts offices (or qualifying entries) rather than connected trust components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Different trusted network"; authored goal, NOT shown to student: "Create separate office networks so the selected starting office matters.")
Everything the student sees (text):
```
C
Cesar's broken search

Cesar ignores the chosen first office in the network and uses a different one.

Your main goal: Expose Cesar's mistake. Draw two graphs: first the correct graph, then Cesar's graph using the mistake.

CHOOSE THE FIRST OFFICE IN THE NETWORK
first office in the network
OUTPUT
CORRECT OUTPUT
CESAR’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first office in the network
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
2 · Cesar's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST OFFICE IN THE NETWORK / first office in the network", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CESAR’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 1—2 · start 0
Grader's expected answers: correct output `[0]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 1—2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0`; ❌ curly braces → `{0}`; ❌ quoted numbers/strings → `["0"]`; ✅ spaces inside brackets → `[ 0 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
CESAR'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "Trust treated one-way"; authored goal, NOT shown to student: "List a qualifying trust link toward the start so a fake arrow blocks it.")
Everything the student sees (text):
```
A
Alana's broken search

Alana allows each two-way link to work only in its written order.

Your main goal: Expose Alana's mistake. Draw two graphs: first the correct graph, then Alana's graph using the mistake.

CHOOSE THE FIRST OFFICE IN THE NETWORK
first office in the network
OUTPUT
CORRECT OUTPUT
ALANA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first office in the network
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
2 · Alana's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST OFFICE IN THE NETWORK / first office in the network", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
ALANA'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Trust through a partner"; authored goal, NOT shown to student: "Connect an office through an intermediate trusted partner, not directly.")
Everything the student sees (text):
```
J
Javier's broken search

Javier stops after one hop instead of continuing.

Your main goal: Expose Javier's mistake. Draw two graphs: first the correct graph, then Javier's graph using the mistake.

CHOOSE THE FIRST OFFICE IN THE NETWORK
first office in the network
OUTPUT
CORRECT OUTPUT
JAVIER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first office in the network
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
2 · Javier's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST OFFICE IN THE NETWORK / first office in the network", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JAVIER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JAVIER'S OUTPUT
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
trust=[[10,7,7,7,7],[7,10,0,0,0],[7,0,10,0,0],[7,0,0,10,0],[7,0,0,0,10]], k=6
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "4 has exactly 0 direct neighbors."
    feedback if wrong: 4 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each distinct score found in the trust matrix.”"
    feedback if wrong: Scores decide whether office pairs have edges; they are not places in the network. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—0 and 0—3, so it should also contain a direct 1—3 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
4 has 1 direct neighbor.
×
Scores decide whether office pairs have edges; they are not places in the network. Correct node rule: Every office index
0
through
n−1
, even one trusted by nobody.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each final trusted component.”"
    feedback if wrong: Those components are what DFS must discover from office nodes. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
- [NO is correct] (direct-vs-reach) "The correct graph has 3—0 and 0—4, so it should also contain a direct 3—4 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Those components are what DFS must discover from office nodes. Correct node rule: Every office index
0
through
n−1
, even one trusted by nobody.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
3 has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only offices that have at least one trust score at or above k.”"
    feedback if wrong: An office with no qualifying line still exists as an isolated network. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—1, so it should also contain a direct 2—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
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
trust=[[10,7,7,7,0],[7,10,0,0,0],[7,0,10,0,0],[7,0,0,10,7],[0,0,0,7,10]], k=6
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0 can reach 4 through 3, but the graph still has no direct 0—4 edge."
    feedback if wrong: Right. A multi-step route through 3 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "4 has exactly 1 direct neighbor."
    feedback if wrong: 4 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each final trusted component.”"
    feedback if wrong: Those components are what DFS must discover from office nodes. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
Result: PASSED

### S3 Q3
Raw input shown:
```
trust=[[10,7,7,0],[7,10,7,0],[7,7,10,0],[0,0,0,10]], k=6
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each distinct score found in the trust matrix.”"
    feedback if wrong: Scores decide whether office pairs have edges; they are not places in the network. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1—2 edge."
    feedback if wrong: The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q4
Raw input shown:
```
trust=[[10,0,0],[0,10,0],[0,0,10]], k=6
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only offices that have at least one trust score at or above k.”"
    feedback if wrong: An office with no qualifying line still exists as an isolated network. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
- [NO is correct] (direct-vs-reach) "0 can reach 1, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between 0 and 1.
- [NO is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 0 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
trust=[[10,7,0,0],[7,10,0,0],[0,0,10,7],[0,0,7,10]], k=6
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 and 3 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2—3 as one direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each final trusted component.”"
    feedback if wrong: Those components are what DFS must discover from office nodes. Correct node rule: Every office index `0` through `n−1`, even one trusted by nobody.
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

### S4 case 1 — `authored-deep-case` · bug: Rejects trust scores equal to the threshold
Input shown:
```
REAL PROBLEM INPUT
trust: [[10, 5, 0], [5, 10, 5], [0, 5, 10]]
k: 5
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const numberOfNodes = input.trust.length;
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (let next = 0; next < numberOfNodes; next++) {
      if (next !== node && input.trust[node][next] > input.k) {
        visit(next);
      }
    }
  }
  let networks = 0;
  for (let node = 0; node < numberOfNodes; node++) {
    if (!visited.has(node)) {
      networks++;
      visit(node);
    }
  }
  return networks;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of trusted networks" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A The code turns diagonal score 10 into self-loop networks, changing this input's returned value.
- B The code can traverse trust only from lower indexes to higher indexes for the shown graph.
- C The edge test uses > k, excluding both direct trust scores that equal the allowed threshold 5.
Diagnosis answer key + feedback:
- ✅ [greater-not-at-least] "The edge test uses > k, excluding both direct trust scores that equal the allowed threshold 5." — feedback: Correct. The rule is at least k, so both edges must exist.
- ❌ [counts-diagonal] "The code turns diagonal score 10 into self-loop networks, changing this input's returned value." — feedback: It explicitly skips next === node.
- ❌ [directed-trust] "The code can traverse trust only from lower indexes to higher indexes for the shown graph." — feedback: It scans every possible next index from every visited node; the strict threshold removes the edges.
Graph proof shown in feedback: code rule "Only scores strictly greater than 5 create traversal." → changed graph "Scores 5 create edges 0—1 and 1—2, forming one connected network." → boundary "Every useful off-diagonal score is exactly the threshold." → returned value "The code removes both edges and returns three networks instead of one."
Output-format probes: ❌ quoted number → `"3"`; ❌ trailing period → `3.`
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
About your diagnosis: It explicitly skips next === node.
Code rule: Only scores strictly greater than 5 create traversal. → Changed graph: Scores 5 create edges 0—1 and 1—2, forming one connected network. → Reachable boundary: Every useful off-diagonal score is exactly the threshold.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rejects trust scores equal to the threshold
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: Only scores strictly greater than 5 create traversal. → Changed graph: Scores 5 create edges 0—1 and 1—2, forming one connected network. → Reachable boundary: Every useful off-diagonal score is exactly the threshold. → Returned value: The code removes both edges and returns three networks instead of one.
```

### S4 case 2 — `threshold-chain-with-strong-tail` · bug: Rejects trust scores equal to the threshold
Input shown:
```
REAL PROBLEM INPUT
trust: [[10, 7, 0, 0], [7, 10, 7, 0], [0, 7, 10, 8], [0, 0, 8, 10]]
k: 7
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const numberOfNodes = input.trust.length;
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (let next = 0; next < numberOfNodes; next++) {
      if (next !== node && input.trust[node][next] > input.k) {
        visit(next);
      }
    }
  }
  let networks = 0;
  for (let node = 0; node < numberOfNodes; node++) {
    if (!visited.has(node)) {
      networks++;
      visit(node);
    }
  }
  return networks;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of trusted networks" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A Using > 7 deletes threshold edges 0—1 and 1—2, leaving only strong edge 2—3.
- B Diagonal score 10 creates four extra self-loop networks.
- C The code keeps 2→3 but drops 3→2, splitting the strong pair.
Diagnosis answer key + feedback:
- ✅ [greater-not-at-least] "Using > 7 deletes threshold edges 0—1 and 1—2, leaving only strong edge 2—3." — feedback: Correct. Scores equal to 7 qualify, so the real graph is one chain.
- ❌ [counts-diagonal] "Diagonal score 10 creates four extra self-loop networks." — feedback: The code skips next === node, so diagonal values never create traversal.
- ❌ [directed-trust] "The code keeps 2→3 but drops 3→2, splitting the strong pair." — feedback: Both matrix entries are 8; the pair remains connected in both directions.
Graph proof shown in feedback: code rule "The strict comparison retains only score-8 edge 2—3." → changed graph "Threshold edges 0—1 and 1—2 plus strong edge 2—3 make one connected chain." → boundary "Two threshold edges attach two otherwise isolated nodes to the strong pair." → returned value "The code returns 3 networks; the at-least-threshold rule returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rejects trust scores equal to the threshold
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: The strict comparison retains only score-8 edge 2—3. → Changed graph: Threshold edges 0—1 and 1—2 plus strong edge 2—3 make one connected chain. → Reachable boundary: Two threshold edges attach two otherwise isolated nodes to the strong pair. → Returned value: The code returns 3 networks; the at-least-threshold rule returns 1.
```

### S4 case 3 — `threshold-bridge-between-strong-pairs` · bug: Rejects trust scores equal to the threshold
Input shown:
```
REAL PROBLEM INPUT
trust: [[10, 9, 0, 0], [9, 10, 5, 0], [0, 5, 10, 9], [0, 0, 9, 10]]
k: 5
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const numberOfNodes = input.trust.length;
  const visited = new Set();
  function visit(node) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (let next = 0; next < numberOfNodes; next++) {
      if (next !== node && input.trust[node][next] > input.k) {
        visit(next);
      }
    }
  }
  let networks = 0;
  for (let node = 0; node < numberOfNodes; node++) {
    if (!visited.has(node)) {
      networks++;
      visit(node);
    }
  }
  return networks;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of trusted networks" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A The four diagonal 10s are treated as separate networks.
- B The strict test removes threshold bridge 1—2 and splits two strong courier pairs.
- C The bridge exists only from courier 1 to courier 2, so reverse traversal fails.
Diagnosis answer key + feedback:
- ✅ [greater-not-at-least] "The strict test removes threshold bridge 1—2 and splits two strong courier pairs." — feedback: Correct. Trust 5 is allowed, so the bridge joins all four couriers.
- ❌ [counts-diagonal] "The four diagonal 10s are treated as separate networks." — feedback: Self positions are skipped; the two components come from the missing bridge.
- ❌ [directed-trust] "The bridge exists only from courier 1 to courier 2, so reverse traversal fails." — feedback: Both trust[1][2] and trust[2][1] equal 5; the strict comparison removes both.
Graph proof shown in feedback: code rule "The code keeps the score-9 edges but rejects bridge score 5 because it is not greater than k." → changed graph "Strong edges 0—1 and 2—3 are connected by qualifying threshold edge 1—2." → boundary "One exactly-threshold bridge is the only connection between two strong clusters." → returned value "The code returns 2 networks instead of 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Rejects trust scores equal to the threshold
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: The code keeps the score-9 edges but rejects bridge score 5 because it is not greater than k. → Changed graph: Strong edges 0—1 and 2—3 are connected by qualifying threshold edge 1—2. → Reachable boundary: One exactly-threshold bridge is the only connection between two strong clusters. → Returned value: The code returns 2 networks instead of 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```