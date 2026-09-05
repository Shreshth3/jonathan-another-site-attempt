# Ladder Takahashi (`ladder-takahashi`) — new, undirected-graph

## Problem statement (Description tab)

You are in a skyscraper with floors numbered `1` up to `1,000,000,000` (one billion), standing on floor `1`.

The ONLY way to change floors is by ladder. You are given an array `ladders`, where each `ladders[k] = [a, b]` is a ladder connecting floor `a` and floor `b`; you can climb it in either direction. You can freely walk around on whatever floor you are on, so from one floor you may use any ladder that touches it.

Write a function `highestFloor(ladders)` that returns the highest floor number you can possibly reach starting from floor `1`. If no ladder touches floor 1, the answer is `1`.

### Examples
- Example 1: input `ladders = [[1,4],[4,3],[4,10],[8,3]]` → output `10`. From floor 1 climb to 4. From 4 you can reach 3 and 10, and from 3 you can reach 8. Everything reachable is {1, 3, 4, 8, 10}, and the highest is 10.
- Example 2: input `ladders = [[500000000,600000000],[600000000,700000000],[700000000,800000000]]` → output `1`. No ladder touches floor 1, so you can never leave it. The answer is 1.

### Graph rules (authored)
- Nodes: Floor 1 and every floor number appearing in a ladder.
- Edges: One two-way edge between floors a and b.
- Node-name format shown in Step 1/3: Use the exact floor number only. Example: `500000000`. (pattern `^\d+$`)
- Step 2 node-label rule: `positive-integer` — Use positive integer IDs, matching the problem input.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact ladders")
Raw input shown:
```
ladders=[[1,4],[4,3],[4,10],[8,3]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What highest floor is reachable from floor 1?**
Choices as displayed (top to bottom):
1. 10
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Correct. The component containing floor 1 has highest label 10.
- ❌ [bug] "4"
    feedback: This checks only ladders directly touching floor 1 and stops before a ladder chain. (misconception: direct-ladders-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "4", "3", "10", "8" · edges: 1—4, 4—3, 4—10, 8—3
"Why" shown after success: The component containing floor 1 has highest label 10.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact ladders")
Raw input shown:
```
ladders=[[1,4],[4,3],[4,10],[8,3]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 1 / 4 / 3 / 10 / 8
2. Picture C / 1 / 4 / 3 / 10 / 8
3. Picture A / 1 / 4 / 3 / 10 / 8
4. Picture D / 1 / 4 / 3 / 10
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 1, 4, 3, 10, 8 · edges: 1—4, 4—3, 4—10, 8—3
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 1, 4, 3, 10, 8 · edges: 1—4, 4—3, 4—10
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 1, 4, 3, 10, 8 · edges: 1→4, 4→3, 4→10, 8→3
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 1, 4, 3, 10 · edges: 1—4, 4—3, 4—10
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`case-2`, facet "floor identity")
Raw input shown:
```
ladders=[[1,2],[2,5],[5,9]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What highest floor is reachable from floor 1?**
Choices as displayed (top to bottom):
1. 2
2. 9
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "9"
    feedback: Correct. The component containing floor 1 has highest label 9.
- ❌ [bug] "2"
    feedback: This checks only ladders directly touching floor 1 and stops before a ladder chain. (misconception: direct-ladders-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "5", "9" · edges: 1—2, 2—5, 5—9
"Why" shown after success: The component containing floor 1 has highest label 9.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "floor identity")
Raw input shown:
```
Which floors need nodes in this sparse skyscraper graph?
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which floors need nodes in this sparse skyscraper graph?**
Choices as displayed (top to bottom):
1. A / Floor 1 and every floor number appearing in a ladder.
2. B / All one billion possible floors.
3. C / Only the higher endpoint of each ladder.
4. D / Only floors already known to be reachable from floor 1.
Answer key + feedback per choice (data):
- ✅ CORRECT [listed-plus-one] "Floor 1 and every floor number appearing in a ladder."
    feedback: Right. Unlisted floors cannot be reached or affect the answer.
- ❌ [billion] "All one billion possible floors."
    feedback: The graph is sparse; almost all floors have no ladder and need no stored node. (misconception: builds-huge-empty-graph)
- ❌ [high] "Only the higher endpoint of each ladder."
    feedback: Both endpoints are places the climber can stand. (misconception: drops-lower-endpoints)
- ❌ [reachable] "Only floors already known to be reachable from floor 1."
    feedback: DFS must discover which listed floors are reachable. (misconception: assumes-search-result)
"Why" shown after success: Right. Unlisted floors cannot be reached or affect the answer.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "two-way ladders")
Raw input shown:
```
What connection does ladder [a,b] create?
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What connection does ladder [a,b] create?**
Choices as displayed (top to bottom):
1. A / Only a → b when b is higher.
2. B / One two-way edge between floors a and b.
3. C / Edges between every numbered floor from a through b.
4. D / An edge only when one endpoint is floor 1.
Answer key + feedback per choice (data):
- ✅ CORRECT [both] "One two-way edge between floors a and b."
    feedback: Right. The ladder may be climbed in either direction.
- ❌ [up] "Only a → b when b is higher."
    feedback: Ladders also allow climbing back down. (misconception: makes-ladders-one-way)
- ❌ [adjacent] "Edges between every numbered floor from a through b."
    feedback: The ladder connects only its two endpoints; intermediate numbers are irrelevant. (misconception: creates-intermediate-floors)
- ❌ [floor-one] "An edge only when one endpoint is floor 1."
    feedback: Reachable ladders can continue the route far beyond floor 1. (misconception: searches-one-step-only)
"Why" shown after success: Right. The ladder may be climbed in either direction.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "two-way ladders")
Raw input shown:
```
ladders=[[7,20]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What highest floor is reachable from floor 1?**
Choices as displayed (top to bottom):
1. 1
2. 20
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The component containing floor 1 has highest label 1.
- ❌ [bug] "20"
    feedback: This returns the largest floor named anywhere, even though its ladder component does not include floor 1. (misconception: ignore-reachability)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "7", "20" · edges: 7—20
"Why" shown after success: The component containing floor 1 has highest label 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "highest reachable floor")
Raw input shown:
```
ladders = [[1,4],[4,3],[4,10],[8,3]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **From floor 1 with ladders [[1,4],[4,3],[4,10],[8,3]], what highest floor is reachable?**
Choices as displayed (top to bottom):
1. A / 10
2. B / 8
3. C / 4
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "8"
    feedback: Floor 10 is directly connected to reachable floor 4. (misconception: chooses-last-discovered)
- ❌ [wrong-2] "4"
    feedback: The route may continue through more ladders after leaving floor 1. (misconception: checks-one-step)
- ❌ [wrong-3] "1"
    feedback: A ladder touches floor 1, so movement is possible. (misconception: ignores-ladders)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "highest reachable floor")
Raw input shown:
```
ladders=[[2,3]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What highest floor is reachable from floor 1?**
Choices as displayed (top to bottom):
1. 3
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The component containing floor 1 has highest label 1.
- ❌ [bug] "3"
    feedback: This returns the largest floor named anywhere, even though its ladder component does not include floor 1. (misconception: ignore-reachability)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3" · edges: 2—3
"Why" shown after success: The component containing floor 1 has highest label 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "highest reachable floor")
Raw input shown:
```
ladders = [[500000000,600000000],[600000000,700000000],[700000000,800000000]]
```
Node-name guide shown: Required node-name format: Use the exact floor number only. Example: 500000000.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If ladders connect only floors 500000000 through 800000000, what is the answer from floor 1?**
Choices as displayed (top to bottom):
1. A / 800000000
2. B / 500000000
3. C / 0
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "800000000"
    feedback: The globally highest ladder is disconnected from floor 1. (misconception: takes-global-maximum)
- ❌ [wrong-2] "500000000"
    feedback: No route reaches the lowest listed endpoint either. (misconception: assumes-first-ladder-reachable)
- ❌ [wrong-3] "0"
    feedback: The starting floor itself is always reachable. (misconception: forgets-start-node)
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
ladders=[[1,2]]
```
Remedial question: **What highest floor is reachable from floor 1?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The component containing floor 1 has highest label 2.; ❌ "1" — This checks only starting floor 1 and ignores its listed ladder to floor 2.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2" · edges: 1—2
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [billion]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Floor 1 and every floor number appearing in a ladder.
Your choice: The graph is sparse; almost all floors have no ladder and need no stored node.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
ladders=[[1,4],[4,3],[8,3]]
```
Remedial question: **What highest floor is reachable from floor 1?** · choices shown: 4 | 8
Remedial answer key: ✅ "8" — Correct. The component containing floor 1 has highest label 8.; ❌ "4" — This checks only ladders directly touching floor 1 and stops before a ladder chain.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "4", "8", "3" · edges: 1—4, 4—3, 8—3
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [up]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One two-way edge between floors a and b.
Your choice: Ladders also allow climbing back down.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
ladders=[[1,5],[1,2],[2,9]]
```
Remedial question: **What highest floor is reachable from floor 1?** · choices shown: 9 | 5
Remedial answer key: ✅ "9" — Correct. The component containing floor 1 has highest label 9.; ❌ "5" — This checks only ladders directly touching floor 1 and stops before a ladder chain.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "5", "2", "9" · edges: 1—5, 1—2, 2—9
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
10
Your choice: Floor 10 is directly connected to reachable floor 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
ladders=[[1,3],[6,10]]
```
Remedial question: **What highest floor is reachable from floor 1?** · choices shown: 10 | 3
Remedial answer key: ✅ "3" — Correct. The component containing floor 1 has highest label 3.; ❌ "10" — This returns the largest floor named anywhere, even though its ladder component does not include floor 1.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "3", "6", "10" · edges: 1—3, 6—10
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: The globally highest ladder is disconnected from floor 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
ladders=[[500000000,800000000]]
```
Remedial question: **What highest floor is reachable from floor 1?** · choices shown: 1 | 800000000
Remedial answer key: ✅ "1" — Correct. The component containing floor 1 has highest label 1.; ❌ "800000000" — This returns the largest floor named anywhere, even though its ladder component does not include floor 1.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "500000000", "800000000" · edges: 500000000—800000000
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Ladder chain"; authored goal, NOT shown to student: "Reach the highest floor through two or more ladders.")
Everything the student sees (text):
```
A
Ariel's broken search

Ariel stops after one hop instead of continuing.

Your main goal: Expose Ariel's mistake. Draw two graphs: first the correct graph, then Ariel's graph using the mistake.

CHOOSE THE FLOOR 1
floor 1
OUTPUT
CORRECT OUTPUT
ARIEL’S OUTPUT
Drawing 1 of 2: Correct graph · Floor 1: 1
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
2 · Ariel's graph
Check my graph
→
```
Start field: label "CHOOSE THE FLOOR 1 / floor 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | ARIEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1", "4", "3", "10", "8"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3 · edges (in drawing order) 1—2, 2—3 · start 1
Grader's expected answers: correct output `[1,2,3]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3 · edges: 1—2, 2—3
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1, 2, 3`; ❌ curly braces → `{1,2,3}`; ❌ quoted numbers/strings → `["1","2","3"]`; ❌ reversed order → `[3,2,1]`; ✅ spaces inside brackets → `[ 1 , 2 , 3 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3]
ARIEL'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "Down-listed ladder"; authored goal, NOT shown to student: "List a useful ladder in the opposite order of the climb.")
Everything the student sees (text):
```
D
Dalton's broken search

Dalton allows each two-way link to work only in its written order.

Your main goal: Expose Dalton's mistake. Draw two graphs: first the correct graph, then Dalton's graph using the mistake.

CHOOSE THE FLOOR 1
floor 1
OUTPUT
CORRECT OUTPUT
DALTON’S OUTPUT
Drawing 1 of 2: Correct graph · Floor 1: 1
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
2 · Dalton's graph
Check my graph
→
```
Start field: label "CHOOSE THE FLOOR 1 / floor 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | DALTON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2]","buggy":"[1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2 · edges (in drawing order) 2—1 · start 1
Grader's expected answers: correct output `[1,2]` · character's output `[1]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 2→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2]
DALTON'S OUTPUT
[1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Two stairwells"; authored goal, NOT shown to student: "Give floor 1 two ladder branches with different high points.")
Everything the student sees (text):
```
E
Elise's broken search

Elise chooses the final listed route and never returns.

Your main goal: Expose Elise's mistake. Draw two graphs: first the correct graph, then Elise's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FLOOR 1
floor 1
OUTPUT
CORRECT OUTPUT
ELISE’S OUTPUT
Drawing 1 of 2: Correct graph · Floor 1: 1
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
2 · Elise's graph
Check my graph
→
```
Start field: label "CHOOSE THE FLOOR 1 / floor 1", placeholder "Example: 1", prefilled "1", readonly=true
Output labels: CORRECT OUTPUT | ELISE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,3,4]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1—2, 1—3, 3—4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,3,4]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 3—4
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
ELISE'S OUTPUT
[1,3,4]
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
ladders=[[1,4],[4,3],[8,3]]
```
Node-name guide: Required node-name format: Use the exact floor number only. Example: 500000000. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "4", "8", "3" · edges: 1—4, 4—3, 8—3
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "4 has exactly 1 direct neighbor."
    feedback if wrong: 4 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the higher endpoint of each ladder.”"
    feedback if wrong: Both endpoints are places the climber can stand. Correct node rule: Floor 1 and every floor number appearing in a ladder.
- [NO is correct] (direct-vs-reach) "The correct graph has 4—3 and 3—8, so it should also contain a direct 4—8 edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
4 has 2 direct neighbors.
×
Both endpoints are places the climber can stand. Correct node rule: Floor 1 and every floor number appearing in a ladder.
×
Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Only floors already known to be reachable from floor 1.”"
    feedback if wrong: DFS must discover which listed floors are reachable. Correct node rule: Floor 1 and every floor number appearing in a ladder.
- [NO is correct] (direct-vs-reach) "The correct graph has 1—4 and 4—3, so it should also contain a direct 1—3 edge."
    feedback if wrong: Two direct edges through 4 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 direct neighbor.
×
DFS must discover which listed floors are reachable. Correct node rule: Floor 1 and every floor number appearing in a ladder.
×
Two direct edges through 4 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 4, but the graph still has no direct 3—1 edge."
    feedback if wrong: Right. A multi-step route through 4 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “All one billion possible floors.”"
    feedback if wrong: The graph is sparse; almost all floors have no ladder and need no stored node. Correct node rule: Floor 1 and every floor number appearing in a ladder.
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
ladders=[[1,5],[1,2],[2,9]]
```
Node-name guide: Required node-name format: Use the exact floor number only. Example: 500000000. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "5", "2", "9" · edges: 1—5, 1—2, 2—9
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 1—2 and 2—9, so it should also contain a direct 1—9 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 3 direct neighbors."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only floors already known to be reachable from floor 1.”"
    feedback if wrong: DFS must discover which listed floors are reachable. Correct node rule: Floor 1 and every floor number appearing in a ladder.
Result: PASSED

### S3 Q3
Raw input shown:
```
ladders=[[1,3],[6,10]]
```
Node-name guide: Required node-name format: Use the exact floor number only. Example: 500000000. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "3", "6", "10" · edges: 1—3, 6—10
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the higher endpoint of each ladder.”"
    feedback if wrong: Both endpoints are places the climber can stand. Correct node rule: Floor 1 and every floor number appearing in a ladder.
- [YES is correct] (direct-vs-reach) "6 and 10 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 6—10 as one direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
ladders=[[500000000,800000000]]
```
Node-name guide: Required node-name format: Use the exact floor number only. Example: 500000000. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "500000000", "800000000" · edges: 500000000—800000000
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “All one billion possible floors.”"
    feedback if wrong: The graph is sparse; almost all floors have no ladder and need no stored node. Correct node rule: Floor 1 and every floor number appearing in a ladder.
- [NO is correct] (direct-vs-reach) "500000000 can reach 800000000, but there is no direct 500000000—800000000 edge."
    feedback if wrong: The mini-example lists 500000000—800000000 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
ladders=[[1,2]]
```
Node-name guide: Required node-name format: Use the exact floor number only. Example: 500000000. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2" · edges: 1—2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only floors already known to be reachable from floor 1.”"
    feedback if wrong: DFS must discover which listed floors are reachable. Correct node rule: Floor 1 and every floor number appearing in a ladder.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1—2 edge."
    feedback if wrong: The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 1 direct neighbor.
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

### S4 case 1 — `authored-deep-case` · bug: Ladders work only in listed order
Input shown:
```
REAL PROBLEM INPUT
ladders: [[4, 1], [4, 10]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function highestFloor(ladders) {
  const next = new Map();
  for (const [firstValue, secondValue] of ladders) {
    if (!next.has(firstValue)) {
      next.set(firstValue, []);
    }
    next.get(firstValue).push(secondValue);
  }
  const visited = new Set([1]);
  const stack = [1];
  while (stack.length) {
    const floor = stack.pop();
    for (const other of next.get(floor) || []) {
      if (!visited.has(other)) {
        visited.add(other);
        stack.push(other);
      }
    }
  }
  return Math.max(...visited);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "4", "10" · edges: 1—4, 4—10
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `10`
Diagnosis choices as displayed:
- A Floor 1 is absent from the map because it never appears as a first endpoint on the shown input.
- B The pair [8,3] is stored only as 8→3, so the code cannot continue from floor 3 to floor 8.
- C Math.max is called before all reachable floors are inserted for the shown graph.
Diagnosis answer key + feedback:
- ❌ [missing-floor-nodes] "Floor 1 is absent from the map because it never appears as a first endpoint on the shown input." — feedback: The seen set correctly creates floor 1; its reverse ladder edge is missing.
- ❌ [max-before-search] "Math.max is called before all reachable floors are inserted for the shown graph." — feedback: It runs after the traversal; the traversal cannot move from 1.
- ✅ [one-way-ladders] "The pair [8,3] is stored only as 8→3, so the code cannot continue from floor 3 to floor 8." — feedback: Exactly. Each ladder needs both adjacency directions.
Graph proof shown in feedback: code rule "Only the written first endpoint receives the second as a neighbor." → changed graph "The undirected path is 1—4—10, entirely reachable from floor 1." → boundary "The first needed climb uses [4,1] backward." → returned value "The code stays at 1; the real path reaches highest floor 10."
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
About your diagnosis: The seen set correctly creates floor 1; its reverse ladder edge is missing.
Code rule: Only the written first endpoint receives the second as a neighbor. → Changed graph: The undirected path is 1—4—10, entirely reachable from floor 1. → Reachable boundary: The first needed climb uses [4,1] backward.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Ladders work only in listed order
INCORRECT OUTPUT
1
CORRECT OUTPUT
10
Code rule: Only the written first endpoint receives the second as a neighbor. → Changed graph: The undirected path is 1—4—10, entirely reachable from floor 1. → Reachable boundary: The first needed climb uses [4,1] backward. → Returned value: The code stays at 1; the real path reaches highest floor 10.
```

### S4 case 2 — `repair-2` · bug: Ladders work only in listed order
Input shown:
```
REAL PROBLEM INPUT
ladders=[[1,4],[4,3],[8,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function highestFloor(ladders) {
  const next = new Map();
  for (const [firstValue, secondValue] of ladders) {
    if (!next.has(firstValue)) {
      next.set(firstValue, []);
    }
    next.get(firstValue).push(secondValue);
  }
  const visited = new Set([1]);
  const stack = [1];
  while (stack.length) {
    const floor = stack.pop();
    for (const other of next.get(floor) || []) {
      if (!visited.has(other)) {
        visited.add(other);
        stack.push(other);
      }
    }
  }
  return Math.max(...visited);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "4", "8", "3" · edges: 1—4, 4—3, 8—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `4` · real correct output `8`
Diagnosis choices as displayed:
- A Floor 1 is absent from the map because it never appears as a first endpoint on the shown input.
- B Math.max is called before all reachable floors are inserted for the shown graph.
- C The pair [4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible in the code.
Diagnosis answer key + feedback:
- ❌ [missing-floor-nodes] "Floor 1 is absent from the map because it never appears as a first endpoint on the shown input." — feedback: The seen set correctly creates floor 1; its reverse ladder edge is missing.
- ❌ [max-before-search] "Math.max is called before all reachable floors are inserted for the shown graph." — feedback: It runs after the traversal; the traversal cannot move from 1.
- ✅ [one-way-ladders] "The pair [4,1] is stored only as 4→1, so climbing from 1 to 4 is impossible in the code." — feedback: Correct. The stored arrow 8→3 cannot be followed from floor 3, while the real two-way ladder continues the route from 1 to floor 8.
Graph proof shown in feedback: code rule "Only the written first endpoint receives the second as a neighbor." → changed graph "Floors 1, 4, 3, and 8 form the two-way chain 1—4—3—8." → boundary "The real edge 3—8 must be traversable from floor 3, but the stored arrow points only 8→3." → returned value "The shown code returns 4; the real problem returns 8."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Ladders work only in listed order
INCORRECT OUTPUT
4
CORRECT OUTPUT
8
Code rule: Only the written first endpoint receives the second as a neighbor. → Changed graph: Floors 1, 4, 3, and 8 form the two-way chain 1—4—3—8. → Reachable boundary: The real edge 3—8 must be traversable from floor 3, but the stored arrow points only 8→3. → Returned value: The shown code returns 4; the real problem returns 8.
```

### S4 case 3 — `new-reversed-middle-ladder` · bug: Ladders work only in listed order
Input shown:
```
REAL PROBLEM INPUT
ladders: [[1, 5], [9, 5], [9, 12]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function highestFloor(ladders) {
  const next = new Map();
  for (const [firstValue, secondValue] of ladders) {
    if (!next.has(firstValue)) {
      next.set(firstValue, []);
    }
    next.get(firstValue).push(secondValue);
  }
  const visited = new Set([1]);
  const stack = [1];
  while (stack.length) {
    const floor = stack.pop();
    for (const other of next.get(floor) || []) {
      if (!visited.has(other)) {
        visited.add(other);
        stack.push(other);
      }
    }
  }
  return Math.max(...visited);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "1", "5", "9", "12" · edges: 1—5, 5—9, 9—12
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `12`
Diagnosis choices as displayed:
- A The directed map cannot traverse listed ladder [9,5] from floor 5 to floor 9.
- B Math.max ignores floor 12 because it is larger than the number of ladders.
- C The traversal must begin at the smallest listed endpoint, which is already 1.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "Math.max ignores floor 12 because it is larger than the number of ladders." — feedback: Math.max sees only floors in seen; floor 12 never enters seen because the middle ladder is reversed.
- ✅ [one-way-ladders] "The directed map cannot traverse listed ladder [9,5] from floor 5 to floor 9." — feedback: Exactly. Real ladders work in both directions, so floor 12 is reachable.
- ❌ [wrong-visited] "The traversal must begin at the smallest listed endpoint, which is already 1." — feedback: The problem always starts from floor 1, and this code does so correctly.
Graph proof shown in feedback: code rule "Each pair adds only first-endpoint→second-endpoint." → changed graph "The undirected chain is 1—5—9—12." → boundary "The middle link must be used opposite its listed order." → returned value "The code stops at 5; the real highest reachable floor is 12."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Ladders work only in listed order
INCORRECT OUTPUT
5
CORRECT OUTPUT
12
Code rule: Each pair adds only first-endpoint→second-endpoint. → Changed graph: The undirected chain is 1—5—9—12. → Reachable boundary: The middle link must be used opposite its listed order. → Returned value: The code stops at 5; the real highest reachable floor is 12.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```