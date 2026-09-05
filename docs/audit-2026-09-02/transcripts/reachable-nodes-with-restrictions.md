# Reachable Nodes With Restrictions (`reachable-nodes-with-restrictions`) — new, undirected-graph

## Problem statement (Description tab)

You have an undirected tree with `n` nodes numbered `0` to `n - 1`, described by an array `edges` where each `edges[i] = [a, b]` means there is a two-way connection between nodes `a` and `b`. (There are exactly `n - 1` edges, so everything is connected with no cycles.)

You are also given an array `restricted` of forbidden nodes. You may NEVER step on a restricted node.

Starting from node 0 (which is never restricted), count how many nodes you can reach by walking along edges without ever entering a restricted node. Node 0 itself counts.

Return that count.

### Examples
- Example 1: input `n = 7, edges = [[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]], restricted = [4,5]` → output `4`. From 0 you can go to 1, then to 2 and 3. You cannot enter 4 or 5 (restricted), and 6 is only reachable through 5, so it is cut off too. Reachable nodes: {0, 1, 2, 3} — that's 4.
- Example 2: input `n = 7, edges = [[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]], restricted = [4,2,1]` → output `3`. From 0 the only allowed neighbor is 5, and from 5 you can reach 6. Nodes 1, 2, 4 are restricted and 3 is hidden behind 2. Reachable: {0, 5, 6} — that's 3.

### Graph rules (authored)
- Nodes: All nodes 0 through n−1, with restricted nodes clearly marked.
- Edges: It is two-way, but traversal must not enter a restricted endpoint.
- Node-name format shown in Step 1/3: Use the 0-based node number. Add ` (restricted)` only to restricted nodes. Example: `3 (restricted)`. (pattern `^\d+(?: \(restricted\))?$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "all n nodes")
Raw input shown:
```
n=5, edges=[[0,1],[1,2],[0,3],[3,4]], restricted=[3]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Only 0,1,2 are reachable; node 4 is behind restricted 3.
- ❌ [wrong] "4"
    feedback: That follows the walk through restricted bug. (misconception: walk-through-restricted)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3 (restricted)", "4" · edges: 0—1, 1—2, 0—3 (restricted), 3 (restricted)—4
"Why" shown after success: Only 0,1,2 are reachable; node 4 is behind restricted 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "node identity")
Raw input shown:
```
n=3, edges=[[0,1],[1,2]], restricted=[1]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The search cannot enter node 1.
- ❌ [wrong] "2"
    feedback: That follows the count restricted node bug. (misconception: count-restricted-node)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1 (restricted)", "2" · edges: 0—1 (restricted), 1 (restricted)—2
"Why" shown after success: The search cannot enter node 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "all n nodes")
Raw input shown:
```
n=5, edges=[[0,1],[1,2],[0,3],[3,4]], restricted=[3]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3(restricted)
2. Picture C / 0 / 1 / 2 / 3(restricted) / 4
3. Picture A / 0 / 1 / 2 / 3(restricted) / 4
4. Picture D / 0 / 1 / 2 / 3(restricted) / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 (restricted), 4 · edges: 0—1, 1—2, 0—3 (restricted), 3 (restricted)—4
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 (restricted) · edges: 0—1, 1—2, 0—3 (restricted)
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 (restricted), 4 · edges: 0—1, 1—2, 0—3 (restricted)
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2, 3 (restricted), 4 · edges: 0→1, 1→2, 0→3 (restricted), 3 (restricted)→4
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
Which items remain nodes in the tree picture?
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which items remain nodes in the tree picture?**
Choices as displayed (top to bottom):
1. A / Only unrestricted nodes; erase restricted nodes and all context immediately.
2. B / Only nodes already known reachable from 0.
3. C / All nodes 0 through n−1, with restricted nodes clearly marked.
4. D / Only the forbidden nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [all] "All nodes 0 through n−1, with restricted nodes clearly marked."
    feedback: Right. Restricted nodes remain in the input tree but cannot be entered.
- ❌ [allowed] "Only unrestricted nodes; erase restricted nodes and all context immediately."
    feedback: Traversal may treat them as blocked, but the picture should show where they cut off branches. (misconception: hides-restriction-boundaries)
- ❌ [reachable] "Only nodes already known reachable from 0."
    feedback: Reachability is the result DFS must discover. (misconception: assumes-result)
- ❌ [restricted] "Only the forbidden nodes."
    feedback: The answer counts allowed nodes reached from 0. (misconception: focuses-only-on-blockers)
"Why" shown after success: Right. Restricted nodes remain in the input tree but cannot be entered.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-3`, facet "two-way tree edges")
Raw input shown:
```
n=5, edges=[[1,0],[2,1],[3,2],[4,3]], restricted=[4]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 4
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. Every unrestricted tree edge is two-way regardless of pair order.
- ❌ [wrong] "1"
    feedback: That follows the treat edges as directed bug. (misconception: treat-edges-as-directed)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4 (restricted)" · edges: 1—0, 2—1, 3—2, 4 (restricted)—3
"Why" shown after success: Every unrestricted tree edge is two-way regardless of pair order.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`edge-rule`, facet "two-way tree edges")
Raw input shown:
```
How should a listed edge [a,b] behave?
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should a listed edge [a,b] behave?**
Choices as displayed (top to bottom):
1. A / It goes only from a to b.
2. B / If b is restricted, connect a directly to b's children instead.
3. C / It is two-way, but traversal must not enter a restricted endpoint.
4. D / Only edges touching unrestricted nodes that are already reachable should be drawn.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way-blocked] "It is two-way, but traversal must not enter a restricted endpoint."
    feedback: Right. A restriction blocks that node and every route through it.
- ❌ [directed] "It goes only from a to b."
    feedback: The tree edges are undirected. (misconception: treats-tree-as-directed)
- ❌ [skip] "If b is restricted, connect a directly to b's children instead."
    feedback: You cannot jump over a forbidden node. (misconception: bypasses-restricted-node)
- ❌ [remove-branch-edges] "Only edges touching unrestricted nodes that are already reachable should be drawn."
    feedback: That assumes the traversal result instead of modeling the input tree. (misconception: prunes-before-search)
"Why" shown after success: Right. A restriction blocks that node and every route through it.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "restricted traversal")
Raw input shown:
```
n = 7, edges = [[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]], restricted = [4,5]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many nodes are reachable from 0 for the shown tree and restrictions?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 6
3. C / 7
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "6"
    feedback: This counts restricted neighbors 4 and 5 as reachable but correctly stops before node 6. (misconception: counts-restricted-neighbors)
- ❌ [wrong-2] "7"
    feedback: This ignores both restrictions and walks through node 5 to count all seven nodes. (misconception: walks-through-restricted)
- ❌ [wrong-3] "3"
    feedback: The starting node 0 counts too. (misconception: omits-start)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "restricted traversal")
Raw input shown:
```
n=2, edges=[[0,1]], restricted=[1]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Starting node 0 counts even when its only neighbor is restricted.
- ❌ [wrong] "0"
    feedback: That follows the omit start node bug. (misconception: omit-start-node)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1 (restricted)" · edges: 0—1 (restricted)
"Why" shown after success: Starting node 0 counts even when its only neighbor is restricted.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "restricted traversal")
Raw input shown:
```
n = 7, edges = [[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]], restricted = [4,2,1]
```
Node-name guide shown: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted).
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many nodes are reachable from 0 for the shown tree and restrictions?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 6
3. C / 3
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "4"
    feedback: Node 3 cannot be reached without entering restricted node 2. (misconception: jumps-restricted-node)
- ❌ [wrong-2] "6"
    feedback: This adds restricted neighbors 1, 2, and 4 to valid nodes 0, 5, and 6, producing 6. (misconception: counts-all-nonhidden)
- ❌ [wrong-3] "2"
    feedback: Node 0 counts along with 5 and 6. (misconception: omits-start)
"Why" shown after success: Right. The picture gives exactly this result.
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
n=6, edges=[[0,1],[1,2],[0,3],[3,4],[4,5]], restricted=[4]
```
Remedial question: **What should the function return?** · choices shown: 4 | 5
Remedial answer key: ✅ "4" — Correct. Nodes 0,1,2,3 are reachable; 4 and 5 are blocked.; ❌ "5" — That follows the walk through restricted bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4 (restricted)", "5" · edges: 0—1, 1—2, 0—3, 3—4 (restricted), 4 (restricted)—5
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [allowed]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
All nodes 0 through n−1, with restricted nodes clearly marked.
Your choice: Traversal may treat them as blocked, but the picture should show where they cut off branches.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=4, edges=[[0,1],[0,2],[0,3]], restricted=[1,2]
```
Remedial question: **What should the function return?** · choices shown: 4 | 2
Remedial answer key: ✅ "2" — Correct. Only 0 and unrestricted child 3 count.; ❌ "4" — That follows the ignore restrictions bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1 (restricted)", "2 (restricted)", "3" · edges: 0—1 (restricted), 0—2 (restricted), 0—3
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [directed]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
It is two-way, but traversal must not enter a restricted endpoint.
Your choice: The tree edges are undirected.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=5, edges=[[0,1],[1,2],[2,3],[3,4]], restricted=[2]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "2" — Correct. Nodes 0 and 1 are reachable; restricted 2 is not.; ❌ "3" — That follows the count first restricted node bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)", "3", "4" · edges: 0—1, 1—2 (restricted), 2 (restricted)—3, 3—4
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
4
Your choice: This counts restricted neighbors 4 and 5 as reachable but correctly stops before node 6.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=3, edges=[[0,1],[0,2]], restricted=[2]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The legal branch to node 1 still runs.; ❌ "1" — That follows the stop after restricted neighbor bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)" · edges: 0—1, 0—2 (restricted)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Node 3 cannot be reached without entering restricted node 2.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=3, edges=[[1,0],[2,1]], restricted=[2]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The reversed pair still connects node 0 to unrestricted node 1.; ❌ "1" — That follows the use written direction bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)" · edges: 1—0, 2 (restricted)—1
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Source-zero rule"; authored goal, NOT shown to student: "List another node first while keeping node 0 as the source.")
Everything the student sees (text):
```
C
Corbin's broken search

Corbin runs the search from a different node 0.

Your main goal: Expose Corbin's mistake. Draw two graphs: first the correct graph, then Corbin's graph using the mistake.

CHOOSE THE NODE 0
node 0
OUTPUT
CORRECT OUTPUT
CORBIN’S OUTPUT
Drawing 1 of 2: Correct graph · Node 0: 0
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
2 · Corbin's graph
Check my graph
→
```
Start field: label "CHOOSE THE NODE 0 / node 0", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | CORBIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3 (restricted)", "4"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
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
CORBIN'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "Reverse-listed road"; authored goal, NOT shown to student: "Write a usable undirected edge opposite the travel direction.")
Everything the student sees (text):
```
C
Carmen's broken search

Carmen mistakes undirected links for arrows.

Your main goal: Expose Carmen's mistake. Draw two graphs: first the correct graph, then Carmen's graph using the mistake.

CHOOSE THE NODE 0
node 0
OUTPUT
CORRECT OUTPUT
CARMEN’S OUTPUT
Drawing 1 of 2: Correct graph · Node 0: 0
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
2 · Carmen's graph
Check my graph
→
```
Start field: label "CHOOSE THE NODE 0 / node 0", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | CARMEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
CARMEN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Restricted dead end"; authored goal, NOT shown to student: "Put a blocked branch before a separate allowed route.")
Everything the student sees (text):
```
B
Brennan's broken search

Brennan stops the whole search when its first branch ends.

Your main goal: Expose Brennan's mistake. Draw two graphs: first the correct graph, then Brennan's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE NODE 0
node 0
OUTPUT
CORRECT OUTPUT
BRENNAN’S OUTPUT
Drawing 1 of 2: Correct graph · Node 0: 0
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
2 · Brennan's graph
Check my graph
→
```
Start field: label "CHOOSE THE NODE 0 / node 0", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | BRENNAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
BRENNAN'S OUTPUT
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
n=4, edges=[[0,1],[0,2],[0,3]], restricted=[1,2]
```
Node-name guide: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted). · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1 (restricted)", "2 (restricted)", "3" · edges: 0—1 (restricted), 0—2 (restricted), 0—3
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the forbidden nodes.”"
    feedback if wrong: The answer counts allowed nodes reached from 0. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
- [NO is correct] (direct-vs-reach) "The correct graph has 3—0 and 0—2 (restricted), so it should also contain a direct 3—2 (restricted) edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The answer counts allowed nodes reached from 0. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
3 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 1 (restricted)—0 and 0—2 (restricted), so it should also contain a direct 1 (restricted)—2 (restricted) edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 (restricted) has exactly 2 direct neighbors."
    feedback if wrong: 2 (restricted) has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only unrestricted nodes; erase restricted nodes and all context immediately.”"
    feedback if wrong: Traversal may treat them as blocked, but the picture should show where they cut off branches. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
2 (restricted) has 1 direct neighbor.
×
Traversal may treat them as blocked, but the picture should show where they cut off branches. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 (restricted) can reach 3 through 0, but the graph still has no direct 1 (restricted)—3 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 (restricted) has exactly 1 direct neighbor."
    feedback if wrong: 1 (restricted) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes already known reachable from 0.”"
    feedback if wrong: Reachability is the result DFS must discover. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
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
n=5, edges=[[0,1],[1,2],[2,3],[3,4]], restricted=[2]
```
Node-name guide: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted). · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)", "3", "4" · edges: 0—1, 1—2 (restricted), 2 (restricted)—3, 3—4
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0—1 and 1—2 (restricted), so it should also contain a direct 0—2 (restricted) edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 3 direct neighbors."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only unrestricted nodes; erase restricted nodes and all context immediately.”"
    feedback if wrong: Traversal may treat them as blocked, but the picture should show where they cut off branches. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=3, edges=[[0,1],[0,2]], restricted=[2]
```
Node-name guide: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted). · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)" · edges: 0—1, 0—2 (restricted)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the forbidden nodes.”"
    feedback if wrong: The answer counts allowed nodes reached from 0. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
- [YES is correct] (direct-vs-reach) "2 (restricted) can reach 1 through 0, but the graph still has no direct 2 (restricted)—1 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 (restricted) has exactly 1 direct neighbor."
    feedback if wrong: 2 (restricted) has 1 direct neighbor.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=3, edges=[[1,0],[2,1]], restricted=[2]
```
Node-name guide: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted). · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2 (restricted)" · edges: 1—0, 2 (restricted)—1
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0—1 and 1—2 (restricted), so it should also contain a direct 0—2 (restricted) edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 3 direct neighbors."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes already known reachable from 0.”"
    feedback if wrong: Reachability is the result DFS must discover. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=6, edges=[[0,1],[1,2],[0,3],[3,4],[4,5]], restricted=[4]
```
Node-name guide: Required node-name format: Use the 0-based node number. Add (restricted) only to restricted nodes. Example: 3 (restricted). · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4 (restricted)", "5" · edges: 0—1, 1—2, 0—3, 3—4 (restricted), 4 (restricted)—5
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only unrestricted nodes; erase restricted nodes and all context immediately.”"
    feedback if wrong: Traversal may treat them as blocked, but the picture should show where they cut off branches. Correct node rule: All nodes 0 through n−1, with restricted nodes clearly marked.
- [NO is correct] (direct-vs-reach) "The correct graph has 0—3 and 3—4 (restricted), so it should also contain a direct 0—4 (restricted) edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Restricted nodes remain traversal bridges
Input shown:
```
REAL PROBLEM INPUT
n: 4
edges: [[0, 1], [1, 2], [0, 3]]
restricted: [1]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function reachableNodes(n, edges, restricted) {
  const numberOfNodes = n;
  const blocked = new Set(restricted);
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const currentNode = stack.pop();
    for (const nextNode of next[currentNode]) {
      if (!visited.has(nextNode)) {
        visited.add(nextNode);
        stack.push(nextNode);
      }
    }
  }
  let count = 0;
  for (const node of visited) {
    if (!blocked.has(node)) {
      count++;
    }
  }
  return count;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1 restricted", "2", "3" · edges: 0—1 restricted, 1 restricted—2, 0—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A The final count accidentally includes a restricted node on the shown input.
- B The undirected tree edges should be followed only from smaller to larger ids.
- C The stack enters a restricted node and then reaches an otherwise blocked node behind it.
Diagnosis answer key + feedback:
- ❌ [count-restricted] "The final count accidentally includes a restricted node on the shown input." — feedback: The restricted node itself is excluded from count, but illegal traversal can still expose nodes behind it.
- ❌ [directed-tree] "The undirected tree edges should be followed only from smaller to larger ids." — feedback: Tree edges are two-way; restricted traversal is the missing rule.
- ✅ [traverse-through-blocked] "The stack enters a restricted node and then reaches an otherwise blocked node behind it." — feedback: Exactly. Restricted nodes must never enter seen or stack.
Graph proof shown in feedback: code rule "DFS crosses every tree edge, then subtracts blocked nodes only from the count." → changed graph "Node 0 connects to restricted 1 and allowed 3; node 2 lies beyond restricted 1." → boundary "Allowed node 2 is separated from 0 by a forbidden articulation node." → returned value "The code counts {0,2,3}=3; legal traversal reaches only {0,3}=2."
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
About your diagnosis: The restricted node itself is excluded from count, but illegal traversal can still expose nodes behind it.
Code rule: DFS crosses every tree edge, then subtracts blocked nodes only from the count. → Changed graph: Node 0 connects to restricted 1 and allowed 3; node 2 lies beyond restricted 1. → Reachable boundary: Allowed node 2 is separated from 0 by a forbidden articulation node.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Restricted nodes remain traversal bridges
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: DFS crosses every tree edge, then subtracts blocked nodes only from the count. → Changed graph: Node 0 connects to restricted 1 and allowed 3; node 2 lies beyond restricted 1. → Reachable boundary: Allowed node 2 is separated from 0 by a forbidden articulation node. → Returned value: The code counts {0,2,3}=3; legal traversal reaches only {0,3}=2.
```

### S4 case 2 — `build-1` · bug: Restricted nodes remain traversal bridges
Input shown:
```
REAL PROBLEM INPUT
n=5, edges=[[0,1],[1,2],[0,3],[3,4]], restricted=[3]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function reachableNodes(n, edges, restricted) {
  const numberOfNodes = n;
  const blocked = new Set(restricted);
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const currentNode = stack.pop();
    for (const nextNode of next[currentNode]) {
      if (!visited.has(nextNode)) {
        visited.add(nextNode);
        stack.push(nextNode);
      }
    }
  }
  let count = 0;
  for (const node of visited) {
    if (!blocked.has(node)) {
      count++;
    }
  }
  return count;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3 (restricted)", "4" · edges: 0—1, 1—2, 0—3 (restricted), 3 (restricted)—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `4` · real correct output `3`
Diagnosis choices as displayed:
- A The stack enters a restricted node and then reaches an otherwise blocked node behind it.
- B The final count accidentally includes a restricted node on the shown input.
- C The undirected tree edges should be followed only from smaller to larger ids.
Diagnosis answer key + feedback:
- ❌ [count-restricted] "The final count accidentally includes a restricted node on the shown input." — feedback: The restricted node itself is excluded from count, but illegal traversal can still expose nodes behind it.
- ❌ [directed-tree] "The undirected tree edges should be followed only from smaller to larger ids." — feedback: Tree edges are two-way; restricted traversal is the missing rule.
- ✅ [traverse-through-blocked] "The stack enters a restricted node and then reaches an otherwise blocked node behind it." — feedback: Correct. Restricted node 3 is not counted, but entering it exposes node 4; legal traversal stops at edge 0—3 and reaches only 0, 1, and 2.
Graph proof shown in feedback: code rule "DFS crosses every tree edge, then subtracts blocked nodes only from the count." → changed graph "The tree edges are 0—1—2 and 0—3—4, with node 3 marked restricted." → boundary "Restricted node 3 lies between reachable node 0 and node 4, so crossing it expands the boundary by one." → returned value "The shown code returns 4; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Restricted nodes remain traversal bridges
INCORRECT OUTPUT
4
CORRECT OUTPUT
3
Code rule: DFS crosses every tree edge, then subtracts blocked nodes only from the count. → Changed graph: The tree edges are 0—1—2 and 0—3—4, with node 3 marked restricted. → Reachable boundary: Restricted node 3 lies between reachable node 0 and node 4, so crossing it expands the boundary by one. → Returned value: The shown code returns 4; the real problem returns 3.
```

### S4 case 3 — `build-2` · bug: Restricted nodes remain traversal bridges
Input shown:
```
REAL PROBLEM INPUT
n=3, edges=[[0,1],[1,2]], restricted=[1]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function reachableNodes(n, edges, restricted) {
  const numberOfNodes = n;
  const blocked = new Set(restricted);
  const next = Array.from({ length: numberOfNodes }, () => []);
  for (const [firstValue, secondValue] of edges) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const currentNode = stack.pop();
    for (const nextNode of next[currentNode]) {
      if (!visited.has(nextNode)) {
        visited.add(nextNode);
        stack.push(nextNode);
      }
    }
  }
  let count = 0;
  for (const node of visited) {
    if (!blocked.has(node)) {
      count++;
    }
  }
  return count;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1 (restricted)", "2" · edges: 0—1 (restricted), 1 (restricted)—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `2` · real correct output `1`
Diagnosis choices as displayed:
- A The final count accidentally includes a restricted node on the shown input.
- B The stack enters a restricted node and then reaches an otherwise blocked node behind it.
- C The undirected tree edges should be followed only from smaller to larger ids.
Diagnosis answer key + feedback:
- ❌ [count-restricted] "The final count accidentally includes a restricted node on the shown input." — feedback: The restricted node itself is excluded from count, but illegal traversal can still expose nodes behind it.
- ❌ [directed-tree] "The undirected tree edges should be followed only from smaller to larger ids." — feedback: Tree edges are two-way; restricted traversal is the missing rule.
- ✅ [traverse-through-blocked] "The stack enters a restricted node and then reaches an otherwise blocked node behind it." — feedback: Correct. Entering restricted node 1 exposes node 2; the legal reachable boundary contains only start node 0.
Graph proof shown in feedback: code rule "DFS crosses every tree edge, then subtracts blocked nodes only from the count." → changed graph "The chain is 0—1—2, with bridge node 1 marked restricted." → boundary "Restricted node 1 is the only bridge from start 0 to node 2, so legal traversal cannot leave node 0." → returned value "The shown code returns 2; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Restricted nodes remain traversal bridges
INCORRECT OUTPUT
2
CORRECT OUTPUT
1
Code rule: DFS crosses every tree edge, then subtracts blocked nodes only from the count. → Changed graph: The chain is 0—1—2, with bridge node 1 marked restricted. → Reachable boundary: Restricted node 1 is the only bridge from start 0 to node 2, so legal traversal cannot leave node 0. → Returned value: The shown code returns 2; the real problem returns 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```