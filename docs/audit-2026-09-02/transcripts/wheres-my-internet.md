# Where's My Internet?? (`wheres-my-internet`) — new, undirected-graph

## Problem statement (Description tab)

A brand-new town has `n` houses, numbered `1` to `n`. House `1` is the only house with a direct internet line to the outside world.

Some pairs of houses are already joined by network cables, and cables carry internet in both directions. A house is online if it is house `1`, or if it is connected by a cable to a house that is already online. In other words, a house is online exactly when you can walk from it to house `1` through a chain of cables.

You are given `n` and an array `cables`, where each `cables[k] = [a, b]` means houses `a` and `b` are joined by a cable.

Write a function `findOfflineHouses(n, cables)` that returns an array of all house numbers that do NOT have internet, sorted from smallest to largest. If every house is online, return an empty array `[]`.

### Examples
- Example 1: input `n = 6, cables = [[1,2],[2,3],[3,4],[5,6]]` → output `[5, 6]`. Houses 2, 3 and 4 are joined to house 1 by a chain of cables, so they are online. Houses 5 and 6 are only cabled to each other, so neither can reach house 1 and both are offline.
- Example 2: input `n = 2, cables = [[2,1]]` → output `[]`. House 2 is cabled directly to house 1, so every house in town is online and the answer is an empty array.

### Graph rules (authored)
- Nodes: Every house numbered 1 through n, even if it has no cable.
- Edges: A two-way connection between houses a and b.
- Node-name format shown in Step 1/3: Use each node's 1-based number only. Example: `2`. (pattern `^[1-9]\d*$`)
- Step 2 node-label rule: `contiguous-one` — Use numeric IDs 1, 2, 3, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "all houses")
Raw input shown:
```
n=6, cables=[[1,2],[2,3],[3,4],[5,6]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [5,6]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[5,6]"
    feedback: Correct. Only houses in house 1’s component are online.
- ❌ [wrong] "[]"
    feedback: That follows the assume any cable gives internet bug. (misconception: assume-any-cable-gives-internet)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3", "4", "5", "6" · edges: 1—2, 2—3, 3—4, 5—6
"Why" shown after success: Only houses in house 1’s component are online.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "all houses")
Raw input shown:
```
n=6, cables=[[1,2],[2,3],[3,4],[5,6]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 1 / 2 / 3 / 4 / 5
2. Picture C / 1 / 2 / 3 / 4 / 5 / 6
3. Picture A / 1 / 2 / 3 / 4 / 5 / 6
4. Picture D / 1 / 2 / 3 / 4 / 5 / 6
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 1, 2, 3, 4, 5, 6 · edges: 1—2, 2—3, 3—4, 5—6
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: UNDIRECTED · nodes: 1, 2, 3, 4, 5 · edges: 1—2, 2—3, 3—4
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: UNDIRECTED · nodes: 1, 2, 3, 4, 5, 6 · edges: 1—2, 2—3, 3—4
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: 1, 2, 3, 4, 5, 6 · edges: 1→2, 2→3, 3→4, 5→6
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "house identity")
Raw input shown:
```
Which houses must appear as nodes?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which houses must appear as nodes?**
Choices as displayed (top to bottom):
1. A / Only house numbers appearing in cables.
2. B / Only house 1 and houses already known online.
3. C / Every house numbered 1 through n, even if it has no cable.
4. D / One node for the online group and one for every offline group.
Answer key + feedback per choice (data):
- ✅ CORRECT [all] "Every house numbered 1 through n, even if it has no cable."
    feedback: Right. An isolated house is still a house and is offline unless it is 1.
- ❌ [cabled] "Only house numbers appearing in cables."
    feedback: This would lose isolated offline houses. (misconception: drops-isolated-houses)
- ❌ [online] "Only house 1 and houses already known online."
    feedback: DFS must determine which of all houses are online. (misconception: assumes-result)
- ❌ [components] "One node for the online group and one for every offline group."
    feedback: Groups are components made from individual house nodes. (misconception: collapses-components)
"Why" shown after success: Right. An isolated house is still a house and is offline unless it is 1.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "house identity")
Raw input shown:
```
n=3, cables=[[2,1],[3,2]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [2,3]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. Cables work both ways.
- ❌ [wrong] "[2,3]"
    feedback: That follows the treat cables as directed bug. (misconception: treat-cables-as-directed)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3" · edges: 2—1, 3—2
"Why" shown after success: Cables work both ways.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "two-way cables")
Raw input shown:
```
What does cable [a,b] add to the network?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does cable [a,b] add to the network?**
Choices as displayed (top to bottom):
1. A / A one-way arrow a → b.
2. B / A two-way connection between houses a and b.
3. C / An edge only when one endpoint is house 1.
4. D / An edge between any two houses that are both online or both offline.
Answer key + feedback per choice (data):
- ✅ CORRECT [both] "A two-way connection between houses a and b."
    feedback: Right. Internet can travel through the cable in either direction.
- ❌ [a-b] "A one-way arrow a → b."
    feedback: The cables are not directed. (misconception: makes-cable-directed)
- ❌ [toward-one] "An edge only when one endpoint is house 1."
    feedback: Chains through other houses can carry internet farther. (misconception: checks-direct-cables-only)
- ❌ [same-status] "An edge between any two houses that are both online or both offline."
    feedback: Status comes from listed cable paths; it does not create cables. (misconception: derives-edge-from-status)
"Why" shown after success: Right. Internet can travel through the cable in either direction.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "two-way cables")
Raw input shown:
```
n=4, cables=[[1,2]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [4]
2. [3,4]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[3,4]"
    feedback: Correct. Every offline house must be listed.
- ❌ [wrong] "[4]"
    feedback: That follows the report one per component bug. (misconception: report-one-per-component)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2
"Why" shown after success: Every offline house must be listed.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "offline houses")
Raw input shown:
```
n = 6, cables = [[1,2],[2,3],[3,4],[5,6]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For cables 1-2-3-4 and a separate cable 5-6, which houses are offline?**
Choices as displayed (top to bottom):
1. A / []
2. B / [4, 5, 6]
3. C / [6]
4. D / [5, 6]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[5, 6]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[]"
    feedback: The 5-6 group has no cable path to house 1. (misconception: assumes-any-cable-gives-internet)
- ❌ [wrong-2] "[4, 5, 6]"
    feedback: House 4 reaches house 1 through 3 and 2. (misconception: checks-direct-cable-only)
- ❌ [wrong-3] "[6]"
    feedback: House 5 and 6 share the same disconnected component. (misconception: marks-one-per-component)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "offline houses")
Raw input shown:
```
n = 2, cables = [[2,1]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n=2 and cable [2,1], which houses are offline?**
Choices as displayed (top to bottom):
1. A / [2]
2. B / []
3. C / [1]
4. D / [1, 2]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "[2]"
    feedback: The cable works both ways, so house 2 reaches 1. (misconception: treats-cable-as-directed)
- ❌ [wrong-2] "[1]"
    feedback: House 1 is the internet source and is always online. (misconception: marks-source-offline)
- ❌ [wrong-3] "[1, 2]"
    feedback: The listed cable connects the entire two-house town. (misconception: ignores-cable)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "offline houses")
Raw input shown:
```
n=1, cables=[]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [1]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. House 1 is the internet source.
- ❌ [wrong] "[1]"
    feedback: That follows the mark source offline bug. (misconception: mark-source-offline)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1" · edges: none
"Why" shown after success: House 1 is the internet source.
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
n=5, cables=[[1,2],[2,3],[3,4],[4,5]]
```
Remedial question: **What should the function return?** · choices shown: [5] | []
Remedial answer key: ✅ "[]" — Correct. The chain reaches house 5.; ❌ "[5]" — That follows the stop before last cable bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4", "5" · edges: 1—2, 2—3, 3—4, 4—5
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [cabled]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every house numbered 1 through n, even if it has no cable.
Your choice: This would lose isolated offline houses.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=5, cables=[[1,2],[3,4]]
```
Remedial question: **What should the function return?** · choices shown: [3,4,5] | [5]
Remedial answer key: ✅ "[3,4,5]" — Correct. Houses 3 and 4 have a cable but no route to house 1.; ❌ "[5]" — That follows the ignore disconnected cabled component bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4", "5" · edges: 1—2, 3—4
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [a-b]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way connection between houses a and b.
Your choice: The cables are not directed.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=4, cables=[[4,3],[3,2],[2,1]]
```
Remedial question: **What should the function return?** · choices shown: [2,3,4] | []
Remedial answer key: ✅ "[]" — Correct. Reverse-listed cables still carry internet both ways.; ❌ "[2,3,4]" — That follows the use pair order as direction bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 4—3, 3—2, 2—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[5, 6]
Your choice: The 5-6 group has no cable path to house 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=4, cables=[]
```
Remedial question: **What should the function return?** · choices shown: [2,3,4] | []
Remedial answer key: ✅ "[2,3,4]" — Correct. Only source house 1 is online without cables.; ❌ "[]" — That follows the assume declared houses online bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[]
Your choice: The cable works both ways, so house 2 reaches 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=3, cables=[[1,2],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: [3] | []
Remedial answer key: ✅ "[]" — Correct. The final cable connects house 3 to house 1 through house 2.; ❌ "[3]" — That follows the stop before final cable bug.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3" · edges: 1—2, 2—3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `last-branch` (authored level "Neighborhood split"; authored goal, NOT shown to student: "Cable house 1 into two branches with online houses in both.")
Everything the student sees (text):
```
J
Joaquin's broken search

Joaquin keeps only the last branch it sees.

Your main goal: Expose Joaquin's mistake. Draw two graphs: first the correct graph, then Joaquin's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE HOUSE 1
house 1
OUTPUT
CORRECT OUTPUT
JOAQUIN’S OUTPUT
Drawing 1 of 2: Correct graph · House 1: 1
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
2 · Joaquin's graph
Check my graph
→
```
Start field: label "CHOOSE THE HOUSE 1 / house 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | JOAQUIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("1", "2", "3", "4", "5", "6"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,3,4]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1—2, 1—3, 3—4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,3,4]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 3—4
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1, 2, 3, 4`; ❌ curly braces → `{1,2,3,4}`; ❌ quoted numbers/strings → `["1","2","3","4"]`; ❌ reversed order → `[4,3,2,1]`; ✅ spaces inside brackets → `[ 1 , 2 , 3 , 4 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
JOAQUIN'S OUTPUT
[1,3,4]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "Reverse cable listing"; authored goal, NOT shown to student: "List a cable toward house 1 so direction must not matter.")
Everything the student sees (text):
```
H
Heaven's broken search

Heaven mistakes undirected links for arrows.

Your main goal: Expose Heaven's mistake. Draw two graphs: first the correct graph, then Heaven's graph using the mistake.

CHOOSE THE HOUSE 1
house 1
OUTPUT
CORRECT OUTPUT
HEAVEN’S OUTPUT
Drawing 1 of 2: Correct graph · House 1: 1
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
2 · Heaven's graph
Check my graph
→
```
Start field: label "CHOOSE THE HOUSE 1 / house 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | HEAVEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2]","buggy":"[1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2 · edges (in drawing order) 2—1 · start 1
Grader's expected answers: correct output `[1,2]` · character's output `[1]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 2→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2]
HEAVEN'S OUTPUT
[1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Final hookup"; authored goal, NOT shown to student: "Make the last cable bring a distant house online.")
Everything the student sees (text):
```
A
Aubree's broken search

Aubree accidentally leaves the final direct link out of the graph.

Your main goal: Expose Aubree's mistake. Draw two graphs: first the correct graph, then Aubree's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE HOUSE 1
house 1
OUTPUT
CORRECT OUTPUT
AUBREE’S OUTPUT
Drawing 1 of 2: Correct graph · House 1: 1
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
2 · Aubree's graph
Check my graph
→
```
Start field: label "CHOOSE THE HOUSE 1 / house 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | AUBREE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3 · edges (in drawing order) 1—2, 2—3 · start 1
Grader's expected answers: correct output `[1,2,3]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3 · edges: 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3]
AUBREE'S OUTPUT
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
n=3, cables=[[1,2],[2,3]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3" · edges: 1—2, 2—3
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for the online group and one for every offline group.”"
    feedback if wrong: Groups are components made from individual house nodes. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—2 and 2—3, so it should also contain a direct 1—3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Groups are components made from individual house nodes. Correct node rule: Every house numbered 1 through n, even if it has no cable.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
3 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only house numbers appearing in cables.”"
    feedback if wrong: This would lose isolated offline houses. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [NO is correct] (direct-vs-reach) "The correct graph has 3—2 and 2—1, so it should also contain a direct 3—1 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
This would lose isolated offline houses. Correct node rule: Every house numbered 1 through n, even if it has no cable.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
1 has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only house 1 and houses already known online.”"
    feedback if wrong: DFS must determine which of all houses are online. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—2 and 2—3, so it should also contain a direct 1—3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 3 direct neighbors."
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
```
Result: PASSED

### S3 Q2
Raw input shown:
```
n=5, cables=[[1,2],[2,3],[3,4],[4,5]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4", "5" · edges: 1—2, 2—3, 3—4, 4—5
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 3—4 and 4—5, so it should also contain a direct 3—5 edge."
    feedback if wrong: Two direct edges through 4 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "5 has exactly 0 direct neighbors."
    feedback if wrong: 5 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only house numbers appearing in cables.”"
    feedback if wrong: This would lose isolated offline houses. Correct node rule: Every house numbered 1 through n, even if it has no cable.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=5, cables=[[1,2],[3,4]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4", "5" · edges: 1—2, 3—4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for the online group and one for every offline group.”"
    feedback if wrong: Groups are components made from individual house nodes. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1—2 as one direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=4, cables=[[4,3],[3,2],[2,1]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 4—3, 3—2, 2—1
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "4 has exactly 0 direct neighbors."
    feedback if wrong: 4 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only house 1 and houses already known online.”"
    feedback if wrong: DFS must determine which of all houses are online. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [NO is correct] (direct-vs-reach) "The correct graph has 4—3 and 3—2, so it should also contain a direct 4—2 edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=4, cables=[]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only house numbers appearing in cables.”"
    feedback if wrong: This would lose isolated offline houses. Correct node rule: Every house numbered 1 through n, even if it has no cable.
- [NO is correct] (direct-vs-reach) "1 can reach 2, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between 1 and 2.
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 0 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Only houses directly cabled to house 1 go online
Input shown:
```
REAL PROBLEM INPUT
n: 4
cables: [[1, 2], [2, 3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findOfflineHouses(n, cables) {
  const numberOfNodes = n;
  const online = new Set([1]);
  for (const [firstValue, secondValue] of cables) {
    if (firstValue === 1) {
      online.add(secondValue);
    }
    if (secondValue === 1) {
      online.add(firstValue);
    }
  }
  const offline = [];
  for (let house = 1; house <= numberOfNodes; house++) {
    if (!online.has(house)) {
      offline.push(house);
    }
  }
  return offline;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON sorted array of offline house numbers" · expected buggy output `[3,4]` · real correct output `[4]`
Diagnosis choices as displayed:
- A The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline.
- B A house with no listed cable entry should be omitted from the offline result.
- C Each cable pair works only in its written direction, blocking reverse travel during the reachability search.
Diagnosis answer key + feedback:
- ❌ [isolated-house] "A house with no listed cable entry should be omitted from the offline result." — feedback: Every house 1 through n is a node, so every unreachable house must be reported.
- ❌ [cable-direction] "Each cable pair works only in its written direction, blocking reverse travel during the reachability search." — feedback: Cables are two-way; the missing multi-hop traversal is the issue.
- ✅ [one-hop-online] "The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline." — feedback: Exactly. Online status is the whole component containing house 1.
Graph proof shown in feedback: code rule "Only edges incident directly to node 1 can add an online node." → changed graph "Houses 1—2—3 form one cable component; house 4 is isolated." → boundary "House 3 is two edges from the internet source." → returned value "The helper reports [3,4], while only isolated house 4 is offline."
Output-format probes: ✅ spaces after commas → `[3, 4]`; ❌ reversed element order → `[4,3]`; ❌ quoted numbers in array → `["3","4"]`; ❌ trailing period → `[3,4].`
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
About your diagnosis: Every house 1 through n is a node, so every unreachable house must be reported.
Code rule: Only edges incident directly to node 1 can add an online node. → Changed graph: Houses 1—2—3 form one cable component; house 4 is isolated. → Reachable boundary: House 3 is two edges from the internet source.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only houses directly cabled to house 1 go online
INCORRECT OUTPUT
[3,4]
CORRECT OUTPUT
[4]
Code rule: Only edges incident directly to node 1 can add an online node. → Changed graph: Houses 1—2—3 form one cable component; house 4 is isolated. → Reachable boundary: House 3 is two edges from the internet source. → Returned value: The helper reports [3,4], while only isolated house 4 is offline.
```

### S4 case 2 — `build-1` · bug: Only houses directly cabled to house 1 go online
Input shown:
```
REAL PROBLEM INPUT
n=6, cables=[[1,2],[2,3],[3,4],[5,6]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findOfflineHouses(n, cables) {
  const numberOfNodes = n;
  const online = new Set([1]);
  for (const [firstValue, secondValue] of cables) {
    if (firstValue === 1) {
      online.add(secondValue);
    }
    if (secondValue === 1) {
      online.add(firstValue);
    }
  }
  const offline = [];
  for (let house = 1; house <= numberOfNodes; house++) {
    if (!online.has(house)) {
      offline.push(house);
    }
  }
  return offline;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "2", "3", "4", "5", "6" · edges: 1—2, 2—3, 3—4, 5—6
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON sorted array of offline house numbers" · expected buggy output `[3,4,5,6]` · real correct output `[5,6]`
Diagnosis choices as displayed:
- A A house with no listed cable entry should be omitted from the offline result.
- B The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline.
- C Each cable pair works only in its written direction, blocking reverse travel during the reachability search.
Diagnosis answer key + feedback:
- ❌ [isolated-house] "A house with no listed cable entry should be omitted from the offline result." — feedback: Every house 1 through n is a node, so every unreachable house must be reported.
- ❌ [cable-direction] "Each cable pair works only in its written direction, blocking reverse travel during the reachability search." — feedback: Cables are two-way; the missing multi-hop traversal is the issue.
- ✅ [one-hop-online] "The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline." — feedback: Correct. Houses 3 and 4 lie on the cable chain 1—2—3—4; stopping after house 2 wrongly reports them with the separate 5—6 component.
Graph proof shown in feedback: code rule "Only edges incident directly to node 1 can add an online node." → changed graph "Houses 1—2—3—4 form one cable component, while houses 5—6 form the other." → boundary "Cable chain 1—2—3—4 requires three hops, while houses 5—6 form the only offline component." → returned value "The shown code returns [3,4,5,6]; the real problem returns [5,6]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only houses directly cabled to house 1 go online
INCORRECT OUTPUT
[3,4,5,6]
CORRECT OUTPUT
[5,6]
Code rule: Only edges incident directly to node 1 can add an online node. → Changed graph: Houses 1—2—3—4 form one cable component, while houses 5—6 form the other. → Reachable boundary: Cable chain 1—2—3—4 requires three hops, while houses 5—6 form the only offline component. → Returned value: The shown code returns [3,4,5,6]; the real problem returns [5,6].
```

### S4 case 3 — `build-2` · bug: Only houses directly cabled to house 1 go online
Input shown:
```
REAL PROBLEM INPUT
n=3, cables=[[2,1],[3,2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function findOfflineHouses(n, cables) {
  const numberOfNodes = n;
  const online = new Set([1]);
  for (const [firstValue, secondValue] of cables) {
    if (firstValue === 1) {
      online.add(secondValue);
    }
    if (secondValue === 1) {
      online.add(firstValue);
    }
  }
  const offline = [];
  for (let house = 1; house <= numberOfNodes; house++) {
    if (!online.has(house)) {
      offline.push(house);
    }
  }
  return offline;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "2", "3" · edges: 2—1, 3—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON sorted array of offline house numbers" · expected buggy output `[3]` · real correct output `[]`
Diagnosis choices as displayed:
- A A house with no listed cable entry should be omitted from the offline result.
- B Each cable pair works only in its written direction, blocking reverse travel during the reachability search.
- C The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline.
Diagnosis answer key + feedback:
- ❌ [isolated-house] "A house with no listed cable entry should be omitted from the offline result." — feedback: Every house 1 through n is a node, so every unreachable house must be reported.
- ❌ [cable-direction] "Each cable pair works only in its written direction, blocking reverse travel during the reachability search." — feedback: Cables are two-way; the missing multi-hop traversal is the issue.
- ✅ [one-hop-online] "The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline." — feedback: Correct. House 3 is two cable hops from house 1 through house 2, so one-hop checking wrongly reports an online house as offline.
Graph proof shown in feedback: code rule "Only edges incident directly to node 1 can add an online node." → changed graph "All three houses belong to the cable chain 1—2—3." → boundary "House 3 is reached only after following 1—2 and then 2—3, so a one-hop check misses it." → returned value "The shown code returns [3]; the real problem returns []."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only houses directly cabled to house 1 go online
INCORRECT OUTPUT
[3]
CORRECT OUTPUT
[]
Code rule: Only edges incident directly to node 1 can add an online node. → Changed graph: All three houses belong to the cable chain 1—2—3. → Reachable boundary: House 3 is reached only after following 1—2 and then 2—3, so a one-hop check misses it. → Returned value: The shown code returns [3]; the real problem returns [].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```