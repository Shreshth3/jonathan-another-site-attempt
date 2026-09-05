# Routes to the Summit (`count-routes-to-summit`) — variant, directed-graph

## Problem statement (Description tab)

A mountain has `n` camps, numbered `0` to `n - 1`. Camp `0` is base camp and camp `n - 1` is the summit.

The trails between camps are one-way and always lead uphill: `graph[i]` is the list of camps you can walk to directly from camp `i`. Because every trail goes uphill, you can never walk in a circle back to a camp you already visited.

Two routes are different if the sequence of camps they visit is different.

Return the number of different routes from base camp `0` to the summit `n - 1`.

### Examples
- Example 1: input `graph = [[1,2],[3],[3],[]]` → output `2`. The routes are 0 -> 1 -> 3 and 0 -> 2 -> 3. That makes 2 routes.
- Example 2: input `graph = [[1,2,3],[3],[3],[]]` → output `3`. The routes are 0 -> 1 -> 3, 0 -> 2 -> 3, and the direct trail 0 -> 3. That makes 3 routes.

### Graph rules (authored)
- Nodes: Every camp `0` through `n−1`, including dead ends and the summit.
- Edges: A one-way trail `i → j`.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`diamond`, facet "all summit routes")
Raw input shown:
```
graph=[[1,2],[3],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many routes reach the summit?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Both 0→1→3 and 0→2→3 reach summit 3.
- ❌ [bug] "1"
    feedback: This stops after finding the first complete route. (misconception: stop-after-first-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
"Why" shown after success: Both 0→1→3 and 0→2→3 reach summit 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact adjacency")
Raw input shown:
```
graph=[[1,2],[3],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3
2. Picture B / 0 / 1 / 2 / 3
3. Picture C / 0 / 1 / 2 / 3
4. Picture D / 0 / 1 / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3, 2→3
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 1→0, 2→0, 3→1, 3→2
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 0→2
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`direct-plus-long`, facet "exact adjacency")
Raw input shown:
```
graph=[[1,3],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many routes reach the summit?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The direct route and 0→1→2→3 are different routes.
- ❌ [bug] "1"
    feedback: This counts only the longer DFS branch and misses direct route 0→3. (misconception: miss-direct-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→3, 1→2, 2→3
"Why" shown after success: The direct route and 0→1→2→3 are different routes.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-nodes`, facet "camp identity")
Raw input shown:
```
graph=[[1,3],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does each node represent on the summit map?**
Picture under review: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→3, 1→2, 2→3
Choices as displayed (top to bottom):
1. A / Every camp 0 through n−1, including dead ends and the summit.
2. B / Each full route from the starting camp to the summit.
3. C / Only camps that lie on at least one successful summit route.
4. D / Only camps with two or more outgoing trails.
Answer key + feedback per choice (data):
- ✅ CORRECT [camps] "Every camp `0` through `n−1`, including dead ends and the summit."
    feedback: Correct. Dead ends are still nodes; they simply contribute zero summit routes.
- ❌ [routes] "Each full route from the starting camp to the summit."
    feedback: Routes are sequences of camp nodes produced by following trail edges. (misconception: output-as-node)
- ❌ [summit-reaching] "Only camps that lie on at least one successful summit route."
    feedback: The search must explore a camp to learn whether it reaches the summit. (misconception: pre-filter-success)
- ❌ [branch-points] "Only camps with two or more outgoing trails."
    feedback: Single-trail camps and the summit remain necessary parts of routes. (misconception: omit-linear-camps)
"Why" shown after success: Correct. Dead ends are still nodes; they simply contribute zero summit routes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-relations`, facet "uphill arrows")
Raw input shown:
```
graph=[[1,2],[3],[],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What arrow comes from an entry j inside graph[i]?**
Picture under review: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3
Choices as displayed (top to bottom):
1. A / A one-way trail i → j.
2. B / A one-way trail j → i, because recursion returns from j to i.
3. C / A two-way trail i—j.
4. D / A direct arrow i→summit whenever j can eventually reach the summit.
Answer key + feedback per choice (data):
- ✅ CORRECT [i-to-j] "A one-way trail `i → j`."
    feedback: Correct. From camp i, that entry is one legal next camp.
- ❌ [j-to-i] "A one-way trail `j → i`, because recursion returns from j to i."
    feedback: Call-return direction does not reverse travel. The adjacency list says i can go to j. (misconception: reverse-call-direction)
- ❌ [two-way] "A two-way trail i—j."
    feedback: These trails are directed. Adding a return direction creates extra routes. (misconception: make-undirected)
- ❌ [summit-shortcut] "A direct arrow i→summit whenever j can eventually reach the summit."
    feedback: That reachability is a multi-edge path whose routes must be counted separately. (misconception: collapse-path)
"Why" shown after success: Correct. From camp i, that entry is one legal next camp.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`dead-end`, facet "uphill arrows")
Raw input shown:
```
graph=[[1,2],[3],[],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many routes reach the summit?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Only 0→1→3 reaches summit 3.
- ❌ [bug] "2"
    feedback: This counts every branch leaving base camp, even branch 0→2 that never reaches the summit. (misconception: count-dead-end-branch)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3
"Why" shown after success: Only 0→1→3 reaches summit 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "all summit routes")
Raw input shown:
```
graph = [[1,2],[3],[3,4],[5],[5],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many directed paths run from camp 0 to the summit at node n−1?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 2
3. C / 5
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "`3`"
    feedback: Correct. All three node sequences are distinct complete routes.
- ❌ [two] "`2`"
    feedback: The two routes that share suffix 3→5 still have different prefixes and both count. (misconception: merge-shared-suffix)
- ❌ [five] "`5`"
    feedback: The answer counts complete routes, not intermediate camps visited. (misconception: count-camps)
- ❌ [one] "`1`"
    feedback: The problem asks for every route, not only the first one found. (misconception: first-route-only)
"Why" shown after success: Correct. All three node sequences are distinct complete routes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`single-route`, facet "camp identity")
Raw input shown:
```
graph=[[1],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many routes reach the summit?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The one arrow is one complete route.
- ❌ [bug] "0"
    feedback: This requires an intermediate camp and ignores a direct base-to-summit trail. (misconception: reject-direct-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1
"Why" shown after success: The one arrow is one complete route.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-bug`, facet "all summit routes")
Raw input shown:
```
graph = [[1,2],[4],[3],[],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many directed paths run from camp 0 to the summit at node n−1?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 0
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "`1`"
    feedback: Correct. Only the branch ending at summit 4 counts.
- ❌ [two] "`2`"
    feedback: A dead end at camp 3 is not a summit route. (misconception: count-dead-end)
- ❌ [zero] "`0`"
    feedback: Route 0→1→4 reaches the summit successfully. (misconception: failed-branch-cancels)
- ❌ [four] "`4`"
    feedback: The result counts routes, not the four reachable camps. (misconception: count-reachable-nodes)
"Why" shown after success: Correct. Only the branch ending at summit 4 counts.
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
graph=[[1,2],[3],[3],[4],[]]
```
Remedial question: **How many routes reach the summit?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. Two routes share suffix 3→4 but have different prefixes.; ❌ "1" — This marks merge camp 3 globally visited and blocks the second distinct prefix.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [routes]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every camp 0 through n−1, including dead ends and the summit.
Your choice: Routes are sequences of camp nodes produced by following trail edges.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
graph=[[2],[],[]]
```
Remedial question: **How many camp nodes exist?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Every adjacency-list index names a camp.; ❌ "2" — This drops camp 1 because it has no outgoing trail and is not on a summit route.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [j-to-i]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A one-way trail i → j.
Your choice: Call-return direction does not reverse travel. The adjacency list says i can go to j.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
graph=[[],[0],[]]
```
Remedial question: **How many routes go from base 0 to summit 2?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. Base 0 has no outgoing trail, so it cannot reach 2.; ❌ "1" — This reverses arrow 1→0 so base 0 appears able to climb to 1.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: The two routes that share suffix 3→5 still have different prefixes and both count.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
graph=[[1,2,3],[3],[3],[]]
```
Remedial question: **How many routes reach the summit?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Routes through 1, through 2, and directly to 3 all count.; ❌ "2" — This misses the direct route 0→3.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 0→3, 1→3, 2→3
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: A dead end at camp 3 is not a summit route.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
graph=[[1,2],[3,4],[4],[5],[5],[]]
```
Remedial question: **How many routes reach the summit?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. There is one route through 3 and two different prefixes into 4.; ❌ "2" — This counts merge node 4 only once instead of keeping routes 0→1→4→5 and 0→2→4→5 distinct.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1, 0→2, 1→3, 1→4, 2→4, 3→5, 4→5
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `first-branch` (authored level "Second summit route"; authored goal, NOT shown to student: "Give base camp two distinct uphill branches that both reach the summit.")
Everything the student sees (text):
```
A
Amy's broken search

Amy stops the whole search when its first branch ends.

Your main goal: Expose Amy's mistake. Draw two graphs: first the correct graph, then Amy's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE BASE CAMP
base camp
OUTPUT
CORRECT OUTPUT
AMY’S OUTPUT
Drawing 1 of 2: Correct graph · Base camp: 0
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
2 · Amy's graph
Check my graph
→
```
Start field: label "CHOOSE THE BASE CAMP / base camp", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | AMY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2, 3`; ❌ curly braces → `{0,1,2,3}`; ❌ quoted numbers/strings → `["0","1","2","3"]`; ❌ reversed order → `[3,2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 , 3 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
AMY'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `reverse-arrows` (authored level "Trails downhill"; authored goal, NOT shown to student: "Use one uphill arrow whose reversal prevents leaving base camp.")
Everything the student sees (text):
```
A
Angela's broken search

Angela builds all directed connections in the opposite direction.

Your main goal: Expose Angela's mistake. Draw two graphs: first the correct graph, then Angela's graph using the mistake.

CHOOSE THE BASE CAMP
base camp
OUTPUT
CORRECT OUTPUT
ANGELA’S OUTPUT
Drawing 1 of 2: Correct graph · Base camp: 0
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
2 · Angela's graph
Check my graph
→
```
Start field: label "CHOOSE THE BASE CAMP / base camp", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | ANGELA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
ANGELA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Last climb missing"; authored goal, NOT shown to student: "Make the final listed trail finish one complete summit route.")
Everything the student sees (text):
```
D
Damian's broken search

Damian accidentally leaves the final direct link out of the graph.

Your main goal: Expose Damian's mistake. Draw two graphs: first the correct graph, then Damian's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE BASE CAMP
base camp
OUTPUT
CORRECT OUTPUT
DAMIAN’S OUTPUT
Drawing 1 of 2: Correct graph · Base camp: 0
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
2 · Damian's graph
Check my graph
→
```
Start field: label "CHOOSE THE BASE CAMP / base camp", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | DAMIAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
DAMIAN'S OUTPUT
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
graph=[[2],[],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only camps with two or more outgoing trails.”"
    feedback if wrong: Single-trail camps and the summit remain necessary parts of routes. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Single-trail camps and the summit remain necessary parts of routes. Correct node rule: Every camp
0
through
n−1
, including dead ends and the summit.
×
Correct. The mini-example lists 0→2 as one direct edge.
×
2 has 0 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each full route from the starting camp to the summit.”"
    feedback if wrong: Routes are sequences of camp nodes produced by following trail edges. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Routes are sequences of camp nodes produced by following trail edges. Correct node rule: Every camp
0
through
n−1
, including dead ends and the summit.
×
Correct. The mini-example lists 0→2 as one direct edge.
×
0 has 1 outgoing direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only camps that lie on at least one successful summit route.”"
    feedback if wrong: The search must explore a camp to learn whether it reaches the summit. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
```
Result: PASSED

### S3 Q2
Raw input shown:
```
graph=[[],[0],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each full route from the starting camp to the summit.”"
    feedback if wrong: Routes are sequences of camp nodes produced by following trail edges. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "1 and 0 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→0 as one direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
graph=[[1,2,3],[3],[3],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 0→3, 1→3, 2→3
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only camps with two or more outgoing trails.”"
    feedback if wrong: Single-trail camps and the summit remain necessary parts of routes. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [NO is correct] (direct-vs-reach) "1 can reach 3, but there is no direct 1→3 edge."
    feedback if wrong: The mini-example lists 1→3 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
graph=[[1,2],[3,4],[4],[5],[5],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1, 0→2, 1→3, 1→4, 2→4, 3→5, 4→5
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "4 has exactly 1 outgoing direct edge."
    feedback if wrong: 4 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only camps that lie on at least one successful summit route.”"
    feedback if wrong: The search must explore a camp to learn whether it reaches the summit. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "1 can reach 5 through 4, but the graph still has no direct 1→5 edge."
    feedback if wrong: Right. A multi-step route through 4 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
graph=[[1,2],[3],[3],[4],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each full route from the starting camp to the summit.”"
    feedback if wrong: Routes are sequences of camp nodes produced by following trail edges. Correct node rule: Every camp `0` through `n−1`, including dead ends and the summit.
- [YES is correct] (direct-vs-reach) "2 can reach 4 through 3, but the graph still has no direct 2→4 edge."
    feedback if wrong: Right. A multi-step route through 3 creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Uses one global visited set for distinct routes
Input shown:
```
REAL PROBLEM INPUT
graph: [[1, 2], [3], [3], [4], []]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const visited = new Set();
  function count(node) {
    if (node === target) {
      return 1;
    }
    if (visited.has(node)) {
      return 0;
    }
    visited.add(node);
    let total = 0;
    for (const next of input.graph[node]) {
      total += count(next);
    }
    return total;
  }
  return count(0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of routes" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The global visited set prunes shared node 3 when the second distinct route reaches it.
- B Checking the target before visited lets the same completed route be counted more than once.
- C Adding the recursive branch counts incorrectly combines separate valid routes.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The global visited set prunes shared node 3 when the second distinct route reaches it." — feedback: Correct. A DAG path counter must allow the shared suffix to contribute once per distinct prefix.
- ❌ [target-first] "Checking the target before visited lets the same completed route be counted more than once." — feedback: The target check is correct; the second valid route is lost earlier at shared node 3.
- ❌ [sum-branches] "Adding the recursive branch counts incorrectly combines separate valid routes." — feedback: Summing branch counts is the correct recurrence for route totals.
Graph proof shown in feedback: code rule "Once the first route marks node 3 visited, the second arrival at 3 returns zero." → changed graph "Routes 0→1→3→4 and 0→2→3→4 have different prefixes and a shared suffix." → boundary "The merge occurs at non-target node 3, before summit 4." → returned value "Only one route is counted instead of two."
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
About your diagnosis: The target check is correct; the second valid route is lost earlier at shared node 3.
Code rule: Once the first route marks node 3 visited, the second arrival at 3 returns zero. → Changed graph: Routes 0→1→3→4 and 0→2→3→4 have different prefixes and a shared suffix. → Reachable boundary: The merge occurs at non-target node 3, before summit 4.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses one global visited set for distinct routes
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: Once the first route marks node 3 visited, the second arrival at 3 returns zero. → Changed graph: Routes 0→1→3→4 and 0→2→3→4 have different prefixes and a shared suffix. → Reachable boundary: The merge occurs at non-target node 3, before summit 4. → Returned value: Only one route is counted instead of two.
```

### S4 case 2 — `repair-2` · bug: Uses one global visited set for distinct routes
Input shown:
```
REAL PROBLEM INPUT
graph=[[1,2],[2],[3],[]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const visited = new Set();
  function count(node) {
    if (node === target) {
      return 1;
    }
    if (visited.has(node)) {
      return 0;
    }
    visited.add(node);
    let total = 0;
    for (const next of input.graph[node]) {
      total += count(next);
    }
    return total;
  }
  return count(0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→2, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of routes" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A Checking the target before visited lets the same completed route be counted more than once.
- B The global visited set prunes shared node 2 when route 0→2 arrives after route 0→1→2.
- C Adding the recursive branch counts incorrectly combines separate valid routes.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The global visited set prunes shared node 2 when route 0→2 arrives after route 0→1→2." — feedback: Exactly. Both prefixes lead through 2 to the summit, so both complete routes must count.
- ❌ [target-first] "Checking the target before visited lets the same completed route be counted more than once." — feedback: The target check is correct; the second valid route is lost earlier at shared node 3.
- ❌ [sum-branches] "Adding the recursive branch counts incorrectly combines separate valid routes." — feedback: Summing branch counts is the correct recurrence for route totals.
Graph proof shown in feedback: code rule "After the first route marks shared node 2, the second arrival at 2 returns zero." → changed graph "The two summit routes are 0→2→3 and 0→1→2→3." → boundary "Two distinct prefixes merge at non-target node 2." → returned value "The code returns 1; the real route count is 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses one global visited set for distinct routes
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: After the first route marks shared node 2, the second arrival at 2 returns zero. → Changed graph: The two summit routes are 0→2→3 and 0→1→2→3. → Reachable boundary: Two distinct prefixes merge at non-target node 2. → Returned value: The code returns 1; the real route count is 2.
```

### S4 case 3 — `repair-5` · bug: Uses one global visited set for distinct routes
Input shown:
```
REAL PROBLEM INPUT
graph=[[1,2],[3,4],[4],[5],[5],[]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const visited = new Set();
  function count(node) {
    if (node === target) {
      return 1;
    }
    if (visited.has(node)) {
      return 0;
    }
    visited.add(node);
    let total = 0;
    for (const next of input.graph[node]) {
      total += count(next);
    }
    return total;
  }
  return count(0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1, 0→2, 1→3, 1→4, 2→4, 3→5, 4→5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of routes" · expected buggy output `2` · real correct output `3`
Diagnosis choices as displayed:
- A Checking the target before visited lets the same completed route be counted more than once.
- B Adding the recursive branch counts incorrectly combines separate valid routes.
- C The global visited set prunes shared node 4 when route 0→2→4 arrives after route 0→1→4.
Diagnosis answer key + feedback:
- ✅ [global-visited] "The global visited set prunes shared node 4 when route 0→2→4 arrives after route 0→1→4." — feedback: Exactly. Node 4 begins a valid shared suffix to summit 5 for two different prefixes.
- ❌ [target-first] "Checking the target before visited lets the same completed route be counted more than once." — feedback: The target check is correct; the second valid route is lost earlier at shared node 3.
- ❌ [sum-branches] "Adding the recursive branch counts incorrectly combines separate valid routes." — feedback: Summing branch counts is the correct recurrence for route totals.
Graph proof shown in feedback: code rule "The first visit to shared node 4 blocks its second valid prefix." → changed graph "Routes are 0→1→3→5, 0→1→4→5, and 0→2→4→5." → boundary "Node 4 is a non-target merge whose suffix must be counted twice." → returned value "The code returns 2; all three routes must be counted."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses one global visited set for distinct routes
INCORRECT OUTPUT
2
CORRECT OUTPUT
3
Code rule: The first visit to shared node 4 blocks its second valid prefix. → Changed graph: Routes are 0→1→3→5, 0→1→4→5, and 0→2→4→5. → Reachable boundary: Node 4 is a non-target merge whose suffix must be counted twice. → Returned value: The code returns 2; all three routes must be counted.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```