# Detonate the Maximum Bombs (`detonate-the-maximum-bombs`) — original, directed-graph

## Problem statement (Description tab)

You are given a list of bombs sitting on a 2D plane. Each bomb has a position and a circular blast range: `bombs[i] = [xi, yi, ri]` means bomb `i` sits at the point `(xi, yi)` and its explosion reaches every point within distance `ri` of that point.

When a bomb explodes, it sets off every other bomb whose **center** lies inside (or exactly on the edge of) its blast circle. Each bomb that gets set off then explodes with its **own** range, possibly triggering even more bombs — a chain reaction.

You are allowed to detonate **exactly one** bomb of your choice by hand. Return the largest total number of bombs that can end up exploding (including the one you detonate).

### Examples
- Example 1: input `bombs = [[2,1,3],[6,1,4]]` → output `2`. The bombs are 4 units apart. Bomb 0 (range 3) cannot reach bomb 1, but bomb 1 (range 4) reaches bomb 0. Detonating bomb 1 sets off both bombs.
- Example 2: input `bombs = [[1,1,5],[10,10,5]]` → output `1`. The two bombs are too far apart to reach each other, so detonating either one only explodes that single bomb.
- Example 3: input `bombs = [[1,2,3],[2,3,1],[3,4,2],[4,5,3],[5,6,4]]` → output `5`. Detonating bomb 0 sets off bombs 1 and 2. Bomb 2 sets off bomb 3, and bomb 3 sets off bomb 4, so all 5 bombs explode.

### Graph rules (authored)
- Nodes: One entire bomb at a specific array index, carrying its center and radius.
- Edges: When j's center is at most i's radius away from i's center.
- Node-name format shown in Step 1/3: Name bombs `A`, `B`, `C`, ... in their input-array order. (pattern `^[A-Z]$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-one-way`, facet "one-way blast edges")
Raw input shown:
```
bombs = [[0,0,5],[4,0,1]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Bomb A reaches B; B does not need to reach A for A to trigger both.
- ❌ [near-miss] "1"
    feedback: That result follows the require mutual reach bug, not the exact picture. (misconception: require-mutual-reach)
Graph the grader requires (hidden from student): DIRECTED · nodes: "A", "B" · edges: A→B
"Why" shown after success: Bomb A reaches B; B does not need to reach A for A to trigger both.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-separated`, facet "exact bomb reach")
Raw input shown:
```
bombs = [[0,0,1],[4,0,1]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Neither center lies inside the other's radius.
- ❌ [near-miss] "2"
    feedback: That result follows the compare diameter not radius bug, not the exact picture. (misconception: compare-diameter-not-radius)
Graph the grader requires (hidden from student): DIRECTED · nodes: "A", "B" · edges: none
"Why" shown after success: Neither center lies inside the other's radius.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact bomb reach")
Raw input shown:
```
bombs = [[0,0,5],[4,0,1]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / A / B
2. Picture C / A / B
3. Picture A / A / B
4. Picture D / A
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: A, B · edges: A→B
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: A, B · edges: none
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: A, B · edges: B→A
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: A · edges: none
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "bomb identity")
Raw input shown:
```
What should one node represent in the bomb-chain graph?
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should one node represent in the bomb-chain graph?**
Choices as displayed (top to bottom):
1. A / One entire bomb at a specific array index, carrying its center and radius.
2. B / Each x-coordinate and y-coordinate should be a separate node.
3. C / Each overlapping patch of blast area should be one node.
4. D / Only bombs that could be chosen as the first detonation should be nodes.
Answer key + feedback per choice (data):
- ✅ CORRECT [bomb-index] "One entire bomb at a specific array index, carrying its center and radius."
    feedback: Correct. DFS visits bombs, and each bomb uses its own blast radius.
- ❌ [center] "Each x-coordinate and y-coordinate should be a separate node."
    feedback: A center's two coordinates describe one bomb; they are not independently detonated. (misconception: split-bomb-coordinates)
- ❌ [blast-zone] "Each overlapping patch of blast area should be one node."
    feedback: The task counts detonated bombs, not regions of the plane. (misconception: region-as-node)
- ❌ [starting-bombs] "Only bombs that could be chosen as the first detonation should be nodes."
    feedback: Every bomb can be a start and can also be reached later in a chain, so every bomb needs a node. (misconception: omit-chain-bombs)
"Why" shown after success: Correct. DFS visits bombs, and each bomb uses its own blast radius.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-chain`, facet "largest chain reaction")
Raw input shown:
```
bombs = [[0,0,3],[3,0,3],[6,0,1]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Starting at A reaches B, which then reaches C.
- ❌ [near-miss] "2"
    feedback: That result follows the count only direct blasts bug, not the exact picture. (misconception: count-only-direct-blasts)
Graph the grader requires (hidden from student): DIRECTED · nodes: "A", "B", "C" · edges: A→B, B→A, B→C
"Why" shown after success: Starting at A reaches B, which then reaches C.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "one-way blast edges")
Raw input shown:
```
When should the graph contain an arrow from bomb i to bomb j?
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should the graph contain an arrow from bomb i to bomb j?**
Choices as displayed (top to bottom):
1. A / Whenever the two blast circles touch, using the sum of both radii.
2. B / Whenever i reaches j, draw both i→j and j→i.
3. C / When j's center is at most i's radius away from i's center.
4. D / Draw i→j whenever j can be reached after any number of chain reactions from i.
Answer key + feedback per choice (data):
- ✅ CORRECT [center-in-radius] "When j's center is at most i's radius away from i's center."
    feedback: Correct. Then exploding i directly detonates j.
- ❌ [circles-touch] "Whenever the two blast circles touch, using the sum of both radii."
    feedback: Only the exploding bomb's radius matters. Two blast boundaries touching does not mean i reaches j's center. (misconception: sum-both-radii)
- ❌ [always-two-way] "Whenever i reaches j, draw both i→j and j→i."
    feedback: Bomb radii can differ. A large bomb may reach a small one that cannot reach back. (misconception: assume-symmetric-trigger)
- ❌ [chain-shortcut] "Draw i→j whenever j can be reached after any number of chain reactions from i."
    feedback: That is a path. A direct arrow should represent only one immediate detonation. (misconception: transitive-edge)
"Why" shown after success: Correct. Then exploding i directly detonates j.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "largest chain reaction")
Raw input shown:
```
bombs = [[2,1,3],[6,1,4]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which detonation reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / A chain counts only if both bombs can reach each other.
2. B / Either starting bomb reaches the other.
3. C / Starting at the radius-4 bomb reaches both bombs.
4. D / Different center coordinates prevent every detonation.
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "Starting at the radius-4 bomb reaches both bombs."
    feedback: Correct. Bomb 1 reaches bomb 0, though bomb 0 cannot reach back.
- ❌ [one-both] "A chain counts only if both bombs can reach each other."
    feedback: A chain needs only a one-way trigger from the chosen start. (misconception: require-mutual-reach)
- ❌ [two-either] "Either starting bomb reaches the other."
    feedback: The radius-3 bomb cannot cover distance 4. (misconception: assume-symmetric-reach)
- ❌ [zero] "Different center coordinates prevent every detonation."
    feedback: The manually chosen bomb always detonates itself. (misconception: exclude-start-bomb)
"Why" shown after success: Correct. Bomb 1 reaches bomb 0, though bomb 0 cannot reach back.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-single`, facet "bomb identity")
Raw input shown:
```
bombs = [[2,7,4]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The starting bomb itself counts in the detonation total.
- ❌ [near-miss] "0"
    feedback: That result follows the count only triggered neighbors bug, not the exact picture. (misconception: count-only-triggered-neighbors)
Graph the grader requires (hidden from student): DIRECTED · nodes: "A" · edges: none
"Why" shown after success: The starting bomb itself counts in the detonation total.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "largest chain reaction")
Raw input shown:
```
bombs = [[1,1,5],[10,10,5]]
```
Node-name guide shown: Required node-name format: Name bombs A, B, C, ... in their input-array order.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which detonation reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / Neither center lies within the other bomb’s radius.
2. B / Equal radii make bombs connect regardless of distance.
3. C / Add both radii when deciding whether one bomb triggers the other.
4. D / A hand-chosen starting bomb does not count itself.
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "Neither center lies within the other bomb’s radius."
    feedback: Correct. Neither center lies inside the other's radius.
- ❌ [two-overlap] "Equal radii make bombs connect regardless of distance."
    feedback: Equal radii do not matter when the centers are too far apart. (misconception: equal-radius-means-edge)
- ❌ [two-sum] "Add both radii when deciding whether one bomb triggers the other."
    feedback: The rule uses the exploding bomb's radius, not the sum of radii. (misconception: sum-radii)
- ❌ [zero] "A hand-chosen starting bomb does not count itself."
    feedback: You may always hand-detonate one bomb. (misconception: forget-manual-start)
"Why" shown after success: Correct. Neither center lies inside the other's radius.
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
bombs = [[0,0,2],[2,0,5]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. A center exactly on the radius boundary is reachable, and B also reaches A.; ❌ "1" — That result follows the miss boundary reach bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "A", "B" · edges: A→B, B→A
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [center]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One entire bomb at a specific array index, carrying its center and radius.
Your choice: A center's two coordinates describe one bomb; they are not independently detonated.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
bombs = [[0,0,1],[0,0,2]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. Two input rows are two bombs even when their centers match.; ❌ "1" — That result follows the merge same coordinate bombs bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "A", "B" · edges: A→B, B→A
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [circles-touch]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
When j's center is at most i's radius away from i's center.
Your choice: Only the exploding bomb's radius matters. Two blast boundaries touching does not mean i reaches j's center.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
bombs = [[0,0,1],[1,0,4],[5,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Starting at A triggers B, and B reaches C.; ❌ "2" — That result follows the discard directed reach bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: A→B, B→A, B→C, C→B
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [one-both]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Starting at the radius-4 bomb reaches both bombs.
Your choice: A chain needs only a one-way trigger from the chosen start.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
bombs = [[0,0,1],[3,0,3],[6,0,3]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. Starting at B reaches both other bombs; starting at A would not.; ❌ "2" — That result follows the always start first bomb bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: B→A, B→C, C→B
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [two-overlap]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Neither center lies within the other bomb’s radius.
Your choice: Equal radii do not matter when the centers are too far apart.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
bombs = [[0,0,2],[2,0,2],[4,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. A reaches only B directly, but B continues the chain to C.; ❌ "2" — That result follows the count only outdegree bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: A→B, B→A, B→C
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "One-sided blast"; authored goal, NOT shown to student: "Use a small bomb inside a large bomb's range but not the reverse.")
Everything the student sees (text):
```
M
Mina's broken search

Mina turns every arrow into a two-way connection.

Your main goal: Expose Mina's mistake. Draw two graphs: first the correct graph, then Mina's graph using the mistake.

CHOOSE THE FIRST DETONATED BOMB
first detonated bomb
OUTPUT
CORRECT OUTPUT
MINA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first detonated bomb
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
2 · Mina's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST DETONATED BOMB / first detonated bomb", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MINA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("A", "B"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0`; ❌ curly braces → `{0}`; ❌ quoted numbers/strings → `["0"]`; ✅ spaces inside brackets → `[ 0 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
MINA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Only the final fuse"; authored goal, NOT shown to student: "Give the starting bomb two trigger routes and make the earlier one matter.")
Everything the student sees (text):
```
E
Ezra's broken search

Ezra follows only the last available branch and ignores earlier choices.

Your main goal: Expose Ezra's mistake. Draw two graphs: first the correct graph, then Ezra's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST DETONATED BOMB
first detonated bomb
OUTPUT
CORRECT OUTPUT
EZRA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first detonated bomb
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
2 · Ezra's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST DETONATED BOMB / first detonated bomb", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EZRA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
EZRA'S OUTPUT
[0,2,3]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Lost chain reaction"; authored goal, NOT shown to student: "End a multi-bomb chain with one essential final trigger arrow.")
Everything the student sees (text):
```
R
Rosa's broken search

Rosa stops reading one relation too early and drops the final edge.

Your main goal: Expose Rosa's mistake. Draw two graphs: first the correct graph, then Rosa's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST DETONATED BOMB
first detonated bomb
OUTPUT
CORRECT OUTPUT
ROSA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first detonated bomb
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
2 · Rosa's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST DETONATED BOMB / first detonated bomb", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ROSA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
ROSA'S OUTPUT
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
bombs = [[0,0,1],[3,0,3],[6,0,3]]
```
Node-name guide: Required node-name format: Name bombs A, B, C, ... in their input-array order. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: B→A, B→C, C→B
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Each x-coordinate and y-coordinate should be a separate node.”"
    feedback if wrong: A center's two coordinates describe one bomb; they are not independently detonated. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
- [NO is correct] (direct-vs-reach) "The correct graph has C→B and B→A, so it should also contain a direct C→A edge."
    feedback if wrong: Two direct edges through B do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "A has exactly 1 outgoing direct edge."
    feedback if wrong: A has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
A center's two coordinates describe one bomb; they are not independently detonated. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
×
Two direct edges through B do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
A has 0 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "B has exactly 2 outgoing direct edges."
    feedback if wrong: B has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each overlapping patch of blast area should be one node.”"
    feedback if wrong: The task counts detonated bombs, not regions of the plane. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
- [YES is correct] (direct-vs-reach) "C can reach A through B, but the graph still has no direct C→A edge."
    feedback if wrong: Right. A multi-step route through B creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
B has 2 outgoing direct edges.
×
The task counts detonated bombs, not regions of the plane. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
×
Right. A multi-step route through B creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "C can reach A through B, but the graph still has no direct C→A edge."
    feedback if wrong: Right. A multi-step route through B creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "C has exactly 1 outgoing direct edge."
    feedback if wrong: C has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only bombs that could be chosen as the first detonation should be nodes.”"
    feedback if wrong: Every bomb can be a start and can also be reached later in a chain, so every bomb needs a node. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
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
bombs = [[0,0,2],[2,0,2],[4,0,1]]
```
Node-name guide: Required node-name format: Name bombs A, B, C, ... in their input-array order. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: A→B, B→A, B→C
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "B has exactly 2 outgoing direct edges."
    feedback if wrong: B has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each overlapping patch of blast area should be one node.”"
    feedback if wrong: The task counts detonated bombs, not regions of the plane. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
- [YES is correct] (direct-vs-reach) "A can reach C through B, but the graph still has no direct A→C edge."
    feedback if wrong: Right. A multi-step route through B creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
bombs = [[0,0,2],[2,0,5]]
```
Node-name guide: Required node-name format: Name bombs A, B, C, ... in their input-array order. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "A", "B" · edges: A→B, B→A
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "B can reach A, but there is no direct B→A edge."
    feedback if wrong: The mini-example lists B→A as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "B has exactly 0 outgoing direct edges."
    feedback if wrong: B has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Each x-coordinate and y-coordinate should be a separate node.”"
    feedback if wrong: A center's two coordinates describe one bomb; they are not independently detonated. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
Result: PASSED

### S3 Q4
Raw input shown:
```
bombs = [[0,0,1],[0,0,2]]
```
Node-name guide: Required node-name format: Name bombs A, B, C, ... in their input-array order. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "A", "B" · edges: A→B, B→A
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "A has exactly 2 outgoing direct edges."
    feedback if wrong: A has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only bombs that could be chosen as the first detonation should be nodes.”"
    feedback if wrong: Every bomb can be a start and can also be reached later in a chain, so every bomb needs a node. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
- [NO is correct] (direct-vs-reach) "A can reach B, but there is no direct A→B edge."
    feedback if wrong: The mini-example lists A→B as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
bombs = [[0,0,1],[1,0,4],[5,0,1]]
```
Node-name guide: Required node-name format: Name bombs A, B, C, ... in their input-array order. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "A", "B", "C" · edges: A→B, B→A, B→C, C→B
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "B has exactly 1 outgoing direct edge."
    feedback if wrong: B has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Each overlapping patch of blast area should be one node.”"
    feedback if wrong: The task counts detonated bombs, not regions of the plane. Correct node rule: One entire bomb at a specific array index, carrying its center and radius.
- [NO is correct] (direct-vs-reach) "The correct graph has C→B and B→A, so it should also contain a direct C→A edge."
    feedback if wrong: Two direct edges through B do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Blast reach is treated as two-way
Input shown:
```
REAL PROBLEM INPUT
bombs = [[0,0,5],[4,0,1],[8,0,5]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maximumDetonation(bombs) {
  const graph = Array.from({ length: bombs.length }, () => []);
  for (let index = 0; index < bombs.length; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < bombs.length;
      otherIndex++
    ) {
      const xDifference = bombs[index][0] - bombs[otherIndex][0];
      const yDifference = bombs[index][1] - bombs[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= bombs[index][2] ** 2 ||
        distanceSquared <= bombs[otherIndex][2] ** 2
      ) {
        graph[index].push(otherIndex);
        graph[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < bombs.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      for (const nextBomb of graph[stack.pop()]) {
        if (!visited.has(nextBomb)) {
          visited.add(nextBomb);
          stack.push(nextBomb);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "A (0,0), r=5", "B (4,0), r=1", "C (8,0), r=5" · edges: A (0,0), r=5→B (4,0), r=1, C (8,0), r=5→B (4,0), r=1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Maximum number of detonated bombs" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A It should take a square root before comparing distances in this case.
- B It adds both arrows when either bomb can reach the other.
- C It checks only bombs hit directly by the starting bomb.
Diagnosis answer key + feedback:
- ✅ [symmetric-blast] "It adds both arrows when either bomb can reach the other." — feedback: Correct. A and C can each reach small-radius B, but B cannot continue the chain to either side.
- ❌ [uses-squared-distance] "It should take a square root before comparing distances in this case." — feedback: No. Comparing squared distance with squared radius is exact and avoids the square root.
- ❌ [misses-chain] "It checks only bombs hit directly by the starting bomb." — feedback: No. Its stack does follow chains; the problem is that the graph contains invented reverse arrows.
Graph proof shown in feedback: code rule "If either radius covers a pair, the code inserts arrows in both directions." → changed graph "The only blast arrows are A→B and C→B because B's radius is too small to reach back." → boundary "B is a one-way sink between two large bombs." → returned value "The invented B→C or B→A arrow creates a three-bomb chain, raising the answer from 2 to 3."
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
About your diagnosis: No. Comparing squared distance with squared radius is exact and avoids the square root.
Code rule: If either radius covers a pair, the code inserts arrows in both directions. → Changed graph: The only blast arrows are A→B and C→B because B's radius is too small to reach back. → Reachable boundary: B is a one-way sink between two large bombs.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Blast reach is treated as two-way
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: If either radius covers a pair, the code inserts arrows in both directions. → Changed graph: The only blast arrows are A→B and C→B because B's radius is too small to reach back. → Reachable boundary: B is a one-way sink between two large bombs. → Returned value: The invented B→C or B→A arrow creates a three-bomb chain, raising the answer from 2 to 3.
```

### S4 case 2 — `asymmetric-four-bomb-chain` · bug: Blast reach is treated as two-way
Input shown:
```
REAL PROBLEM INPUT
bombs = [[0,0,4],[3,0,1],[6,0,4],[9,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maximumDetonation(bombs) {
  const graph = Array.from({ length: bombs.length }, () => []);
  for (let index = 0; index < bombs.length; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < bombs.length;
      otherIndex++
    ) {
      const xDifference = bombs[index][0] - bombs[otherIndex][0];
      const yDifference = bombs[index][1] - bombs[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= bombs[index][2] ** 2 ||
        distanceSquared <= bombs[otherIndex][2] ** 2
      ) {
        graph[index].push(otherIndex);
        graph[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < bombs.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      for (const nextBomb of graph[stack.pop()]) {
        if (!visited.has(nextBomb)) {
          visited.add(nextBomb);
          stack.push(nextBomb);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "bomb 0", "bomb 1", "bomb 2", "bomb 3" · edges: bomb 0→bomb 1, bomb 2→bomb 1, bomb 2→bomb 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Maximum number of detonated bombs" · expected buggy output `4` · real correct output `3`
Diagnosis choices as displayed:
- A It should take a square root before comparing distances in this case.
- B It checks only bombs hit directly by the starting bomb.
- C It adds both arrows when either bomb can reach the other.
Diagnosis answer key + feedback:
- ✅ [symmetric-blast] "It adds both arrows when either bomb can reach the other." — feedback: Correct. Bomb 2 reaches bombs 1 and 3, but weak bomb 1 cannot send the chain backward to bomb 0. Therefore the shown code returns 4, while the real problem returns 3.
- ❌ [uses-squared-distance] "It should take a square root before comparing distances in this case." — feedback: No. Comparing squared distance with squared radius is exact and avoids the square root.
- ❌ [misses-chain] "It checks only bombs hit directly by the starting bomb." — feedback: No. Its stack does follow chains; the problem is that the graph contains invented reverse arrows.
Graph proof shown in feedback: code rule "If either radius covers a pair, the code inserts arrows in both directions." → changed graph "Nodes: bomb 0, bomb 1, bomb 2, bomb 3. Direct arrows: bomb 0→bomb 1; bomb 2→bomb 1; bomb 2→bomb 3." → boundary "Bomb 2 reaches bombs 1 and 3, but weak bomb 1 cannot send the chain backward to bomb 0." → returned value "The shown code returns 4; the source-repo reference solution returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Blast reach is treated as two-way
INCORRECT OUTPUT
4
CORRECT OUTPUT
3
Code rule: If either radius covers a pair, the code inserts arrows in both directions. → Changed graph: Nodes: bomb 0, bomb 1, bomb 2, bomb 3. Direct arrows: bomb 0→bomb 1; bomb 2→bomb 1; bomb 2→bomb 3. → Reachable boundary: Bomb 2 reaches bombs 1 and 3, but weak bomb 1 cannot send the chain backward to bomb 0. → Returned value: The shown code returns 4; the source-repo reference solution returns 3.
```

### S4 case 3 — `three-strong-leaves-one-weak-center` · bug: Blast reach is treated as two-way
Input shown:
```
REAL PROBLEM INPUT
bombs = [[0,0,1],[4,0,4],[-4,0,4],[0,4,4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maximumDetonation(bombs) {
  const graph = Array.from({ length: bombs.length }, () => []);
  for (let index = 0; index < bombs.length; index++) {
    for (
      let otherIndex = index + 1;
      otherIndex < bombs.length;
      otherIndex++
    ) {
      const xDifference = bombs[index][0] - bombs[otherIndex][0];
      const yDifference = bombs[index][1] - bombs[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= bombs[index][2] ** 2 ||
        distanceSquared <= bombs[otherIndex][2] ** 2
      ) {
        graph[index].push(otherIndex);
        graph[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < bombs.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      for (const nextBomb of graph[stack.pop()]) {
        if (!visited.has(nextBomb)) {
          visited.add(nextBomb);
          stack.push(nextBomb);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "center bomb", "east bomb", "west bomb", "north bomb" · edges: east bomb→center bomb, west bomb→center bomb, north bomb→center bomb
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Maximum number of detonated bombs" · expected buggy output `4` · real correct output `2`
Diagnosis choices as displayed:
- A It adds both arrows when either bomb can reach the other.
- B It should take a square root before comparing distances in this case.
- C It checks only bombs hit directly by the starting bomb.
Diagnosis answer key + feedback:
- ✅ [symmetric-blast] "It adds both arrows when either bomb can reach the other." — feedback: Correct. Each outer bomb can trigger only the weak center; the center cannot bridge from one outer bomb to another. Therefore the shown code returns 4, while the real problem returns 2.
- ❌ [uses-squared-distance] "It should take a square root before comparing distances in this case." — feedback: No. Comparing squared distance with squared radius is exact and avoids the square root.
- ❌ [misses-chain] "It checks only bombs hit directly by the starting bomb." — feedback: No. Its stack does follow chains; the problem is that the graph contains invented reverse arrows.
Graph proof shown in feedback: code rule "If either radius covers a pair, the code inserts arrows in both directions." → changed graph "Nodes: center bomb, east bomb, west bomb, north bomb. Direct arrows: east bomb→center bomb; west bomb→center bomb; north bomb→center bomb." → boundary "Each outer bomb can trigger only the weak center; the center cannot bridge from one outer bomb to another." → returned value "The shown code returns 4; the source-repo reference solution returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Blast reach is treated as two-way
INCORRECT OUTPUT
4
CORRECT OUTPUT
2
Code rule: If either radius covers a pair, the code inserts arrows in both directions. → Changed graph: Nodes: center bomb, east bomb, west bomb, north bomb. Direct arrows: east bomb→center bomb; west bomb→center bomb; north bomb→center bomb. → Reachable boundary: Each outer bomb can trigger only the weak center; the center cannot bridge from one outer bomb to another. → Returned value: The shown code returns 4; the source-repo reference solution returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```