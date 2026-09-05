# Shut the Valve (`shut-the-garden-valve`) — variant, tree

## Problem statement (Description tab)

A garden watering system has several sprinklers, described by three lists of the same length. `ids[i]` is the ID of a sprinkler, `feeds[i]` is the ID of the sprinkler that passes water along to it, and `liters[i]` is how many liters of water sprinkler `ids[i]` sprays per hour. A sprinkler with `feeds[i] = 0` gets its water straight from the main line. Every other sprinkler receives water through exactly one other sprinkler, and the piping never loops, so it forms a tree. All IDs are unique positive numbers.

If you shut off sprinkler `shutId`, it stops spraying, and so does every sprinkler that receives its water through it (directly or through a chain of other sprinklers).

Return the total number of liters per hour you save by shutting off sprinkler `shutId`.

### Examples
- Example 1: input `ids = [1,2,3,4], feeds = [0,1,1,2], liters = [5,10,20,40], shutId = 2` → output `50`. Sprinkler 2 feeds sprinkler 4. Shutting 2 stops sprinklers 2 and 4, saving 10 + 40 = 50 liters per hour.
- Example 2: input `ids = [1,2,3,4], feeds = [0,1,1,2], liters = [5,10,20,40], shutId = 1` → output `75`. Sprinkler 1 feeds 2 and 3, and 2 feeds 4, so shutting 1 stops everything: 5 + 10 + 20 + 40 = 75 liters per hour.

### Graph rules (authored)
- Nodes: Each sprinkler ID, including the root sprinkler fed by 0.
- Edges: `feeds[i] → ids[i]`, from the feeder down to the sprinkler it supplies.
- Node-name format shown in Step 1/3: Name each sprinkler `id:litersPerHour`. Example: sprinkler 7 using 10 L/h is `7:10`. Do not add spaces. (pattern `^\d+:\d+$`)
- Step 2 node-label rule: `positive-integer` — Use positive integer IDs, matching the problem input.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`shut-middle`, facet "shut-subtree flow sum")
Raw input shown:
```
ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=2
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many liters per hour are saved?**
Choices as displayed (top to bottom):
1. 50
2. 40
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "50"
    feedback: Correct. Sprinklers 2 and 4 stop, saving 10+40=50.
- ❌ [bug] "40"
    feedback: This sums only descendants and forgets shut sprinkler 2's own 10 L/h. (misconception: exclude-shut-sprinkler)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1:5", "2:10", "3:20", "4:40" · edges: 1:5→2:10, 1:5→3:20, 2:10→4:40
"Why" shown after success: Sprinklers 2 and 4 stop, saving 10+40=50.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`shut-root`, facet "shut-subtree flow sum")
Raw input shown:
```
ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=1
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many liters per hour are saved?**
Choices as displayed (top to bottom):
1. 70
2. 75
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "75"
    feedback: Correct. Every sprinkler is below 1, so 5+10+20+40=75.
- ❌ [bug] "70"
    feedback: This omits the root sprinkler's own 5 L/h. (misconception: sum-descendants-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1:5", "2:10", "3:20", "4:40" · edges: 1:5→2:10, 1:5→3:20, 2:10→4:40
"Why" shown after success: Every sprinkler is below 1, so 5+10+20+40=75.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact sprinkler rows")
Raw input shown:
```
ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=2
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 1:5 / 2:10 / 3:20 / 4:40
2. Picture C / 1:5 / 2:10 / 3:20 / 4:40
3. Picture A / 1:5 / 2:10 / 3:20 / 4:40
4. Picture D / 1:5 / 2:10 / 3:20
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 1:5, 2:10, 3:20, 4:40 · edges: 1:5→2:10, 1:5→3:20, 2:10→4:40
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 1:5, 2:10, 3:20, 4:40 · edges: 1:5→2:10, 1:5→3:20
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 1:5, 2:10, 3:20, 4:40 · edges: 2:10→1:5, 3:20→1:5, 4:40→2:10
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 1:5, 2:10, 3:20 · edges: 1:5→2:10, 1:5→3:20
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`shut-leaf`, facet "feed-to-child arrows")
Raw input shown:
```
ids=[5,9,2], feeds=[0,5,5], liters=[7,4,6], shutId=9
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many liters per hour are saved?**
Choices as displayed (top to bottom):
1. 4
2. 11
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. Leaf 9 stops alone.
- ❌ [bug] "11"
    feedback: This follows the feed edge backward and includes parent sprinkler 5. (misconception: reverse-feed-direction)
Graph the grader requires (hidden from student): DIRECTED · nodes: "5:7", "9:4", "2:6" · edges: 5:7→9:4, 5:7→2:6
"Why" shown after success: Leaf 9 stops alone.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-nodes`, facet "sprinkler identity and flow")
Raw input shown:
```
ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=1
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What becomes a node in the sprinkler tree?**
Picture under review: DIRECTED · nodes: 1:5, 2:10, 3:20, 4:40 · edges: 1:5→2:10, 1:5→3:20, 2:10→4:40
Choices as displayed (top to bottom):
1. A / One node for each distinct liters-per-hour amount.
2. B / Each feeder relationship in the arrays.
3. C / Each sprinkler ID, including the root sprinkler fed by 0.
4. D / Only the sprinkler being shut and descendants already known to be below it.
Answer key + feedback per choice (data):
- ✅ CORRECT [sprinklers] "Each sprinkler ID, including the root sprinkler fed by 0."
    feedback: Correct. Each node carries its own liters-per-hour value.
- ❌ [liters] "One node for each distinct liters-per-hour amount."
    feedback: Two sprinklers can use the same amount and still be separate parts of the tree. (misconception: merge-by-value)
- ❌ [pipes] "Each feeder relationship in the arrays."
    feedback: Feeder relationships are edges. Sprinkler IDs are their endpoints. (misconception: pipe-as-node)
- ❌ [shut-subtree] "Only the sprinkler being shut and descendants already known to be below it."
    feedback: The full feeder tree must be built before the descendants of an arbitrary shut sprinkler are known. (misconception: pre-filter-subtree)
"Why" shown after success: Correct. Each node carries its own liters-per-hour value.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`single`, facet "sprinkler identity and flow")
Raw input shown:
```
ids=[42], feeds=[0], liters=[13], shutId=42
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many liters per hour are saved?**
Choices as displayed (top to bottom):
1. 0
2. 13
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "13"
    feedback: Correct. The single sprinkler itself stops spraying 13 L/h.
- ❌ [bug] "0"
    feedback: This requires at least one outgoing feed edge before counting the shut sprinkler. (misconception: drop-leaf-shut-node)
Graph the grader requires (hidden from student): DIRECTED · nodes: "42:13" · edges: none
"Why" shown after success: The single sprinkler itself stops spraying 13 L/h.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-relations`, facet "feed-to-child arrows")
Raw input shown:
```
ids=[5,9,2], feeds=[0,5,5], liters=[7,4,6], shutId=9
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For index i, what arrow is described by feeds[i] and ids[i]?**
Picture under review: DIRECTED · nodes: 5:7, 9:4, 2:6 · edges: 5:7→9:4, 5:7→2:6
Choices as displayed (top to bottom):
1. A / ids[i] → feeds[i], from a sprinkler back toward its source.
2. B / Edges in both directions because water pipes are physically connected.
3. C / Join sprinklers whenever they use the same liters per hour.
4. D / feeds[i] → ids[i], from the feeder down to the sprinkler it supplies.
Answer key + feedback per choice (data):
- ✅ CORRECT [feeder-to-sprinkler] "`feeds[i] → ids[i]`, from the feeder down to the sprinkler it supplies."
    feedback: Correct. Following arrows from a shut sprinkler finds every downstream sprinkler that also loses water.
- ❌ [sprinkler-to-feeder] "`ids[i] → feeds[i]`, from a sprinkler back toward its source."
    feedback: That would sum ancestors rather than the downstream subtree affected by the shut valve. (misconception: reverse-pipes)
- ❌ [two-way-pipe] "Edges in both directions because water pipes are physically connected."
    feedback: Supply has a direction. Walking upward would wrongly include unaffected ancestors and branches. (misconception: make-pipe-undirected)
- ❌ [same-flow] "Join sprinklers whenever they use the same liters per hour."
    feedback: Flow amount is a node value; only the feeds array defines the supply tree. (misconception: flow-creates-edge)
"Why" shown after success: Correct. Following arrows from a shut sprinkler finds every downstream sprinkler that also loses water.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "shut-subtree flow sum")
Raw input shown:
```
ids = [1,2,3,4,5,6,7], feeds = [0,1,1,2,2,3,4], liters = [4,6,3,8,2,10,5], shutId = 2
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How much total flow belongs to shutId and every sprinkler below it?**
Choices as displayed (top to bottom):
1. A / 21
2. B / 16
3. C / 15
4. D / 10
Answer key + feedback per choice (data):
- ✅ CORRECT [twenty-one] "`21`"
    feedback: Correct. 6 + 8 + 2 + 5 = 21 L/h.
- ❌ [sixteen] "`16`"
    feedback: That misses sprinkler 7, which is downstream through sprinkler 4. (misconception: direct-children-only)
- ❌ [fifteen] "`15`"
    feedback: That counts descendants but omits the shut sprinkler's own 6 L/h. (misconception: exclude-shut-node)
- ❌ [ten] "`10`"
    feedback: That adds sprinkler 2 and its upstream parent 1 instead of downstream sprinklers. (misconception: sum-ancestors)
"Why" shown after success: Correct. 6 + 8 + 2 + 5 = 21 L/h.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-bug`, facet "shut-subtree flow sum")
Raw input shown:
```
ids = [30,10,20], feeds = [0,30,10], liters = [7,1,9], shutId = 10
```
Node-name guide shown: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How much total flow belongs to shutId and every sprinkler below it?**
Choices as displayed (top to bottom):
1. A / 10
2. B / 17
3. C / 1
4. D / 9
Answer key + feedback per choice (data):
- ✅ CORRECT [ten] "`10`"
    feedback: Correct. Sprinklers 10 and 20 stop: 1 + 9.
- ❌ [seventeen] "`17`"
    feedback: Root sprinkler 30 is upstream of the shut valve and keeps running. (misconception: include-ancestor)
- ❌ [one] "`1`"
    feedback: Sprinkler 20 depends on 10 and also stops. (misconception: shut-node-only)
- ❌ [nine] "`9`"
    feedback: The shut sprinkler's own 1 L/h is saved along with its descendant. (misconception: descendants-only)
"Why" shown after success: Correct. Sprinklers 10 and 20 stop: 1 + 9.
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
ids=[10,20,30,40], feeds=[0,10,10,20], liters=[2,3,5,7], shutId=20
```
Remedial question: **How many liters per hour are saved?** · choices shown: 10 | 15
Remedial answer key: ✅ "10" — Correct. Sprinklers 20 and 40 save 3+7=10.; ❌ "15" — This includes sibling sprinkler 30 even though it is not fed through 20.
Remedial required graph (hidden): DIRECTED · nodes: "10:2", "20:3", "30:5", "40:7" · edges: 10:2→20:3, 10:2→30:5, 20:3→40:7
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [liters]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each sprinkler ID, including the root sprinkler fed by 0.
Your choice: Two sprinklers can use the same amount and still be separate parts of the tree.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
ids=[30,10,20], feeds=[0,30,10], liters=[7,1,9], shutId=10
```
Remedial question: **How many liters per hour are saved?** · choices shown: 9 | 10
Remedial answer key: ✅ "10" — Correct. IDs 10 and 20 stop, saving 1+9=10.; ❌ "9" — This finds the row at array index 10 incorrectly and counts only child 20's flow.
Remedial required graph (hidden): DIRECTED · nodes: "30:7", "10:1", "20:9" · edges: 30:7→10:1, 10:1→20:9
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [sprinkler-to-feeder]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
feeds[i] → ids[i], from the feeder down to the sprinkler it supplies.
Your choice: That would sum ancestors rather than the downstream subtree affected by the shut valve.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
ids=[8,3,6], feeds=[0,8,3], liters=[4,5,2], shutId=3
```
Remedial question: **How many liters per hour are saved?** · choices shown: 7 | 9
Remedial answer key: ✅ "7" — Correct. Shutting 3 stops 3 and child 6: 5+2=7.; ❌ "9" — This walks upward to feeder 8 and adds its 4 L/h instead of descendant 6's 2 L/h.
Remedial required graph (hidden): DIRECTED · nodes: "8:4", "3:5", "6:2" · edges: 8:4→3:5, 3:5→6:2
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [sixteen]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
21
Your choice: That misses sprinkler 7, which is downstream through sprinkler 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
ids=[1,2,3], feeds=[0,1,2], liters=[6,7,8], shutId=1
```
Remedial question: **How many liters per hour are saved?** · choices shown: 13 | 21
Remedial answer key: ✅ "21" — Correct. All three flows stop: 6+7+8=21.; ❌ "13" — This stops after the direct child and misses grandchild sprinkler 3.
Remedial required graph (hidden): DIRECTED · nodes: "1:6", "2:7", "3:8" · edges: 1:6→2:7, 2:7→3:8
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [seventeen]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
10
Your choice: Root sprinkler 30 is upstream of the shut valve and keeps running.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
ids=[4,5,6], feeds=[0,4,4], liters=[100,1,1], shutId=4
```
Remedial question: **How many liters per hour are saved?** · choices shown: 102 | 3
Remedial answer key: ✅ "102" — Correct. Three sprinklers stop, but their flows total 100+1+1=102.; ❌ "3" — This returns the number of stopped sprinklers instead of summing their flow values.
Remedial required graph (hidden): DIRECTED · nodes: "4:100", "5:1", "6:1" · edges: 4:100→5:1, 4:100→6:1
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Water flows backward"; authored goal, NOT shown to student: "Use one feeder pipe where reversing flow shuts the wrong sprinkler.")
Everything the student sees (text):
```
B
Briana's broken search

Briana builds all directed connections in the opposite direction.

Your main goal: Expose Briana's mistake. Draw two graphs: first the correct graph, then Briana's graph using the mistake.

WHICH SPRINKLER IS SHUT?
shut sprinkler
OUTPUT
CORRECT OUTPUT
BRIANA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose shut sprinkler
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
2 · Briana's graph
Check my graph
→
```
Start field: label "WHICH SPRINKLER IS SHUT? / shut sprinkler", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BRIANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1:5", "2:10", "3:20", "4:40"): REJECTED with "Use positive integer IDs, like 1, 3, or 10."
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 1→2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1`; ❌ curly braces → `{1}`; ❌ quoted numbers/strings → `["1"]`; ✅ spaces inside brackets → `[ 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
BRIANA'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "Half-watered fork"; authored goal, NOT shown to student: "Give one feeder multiple child pipes so every downstream branch must shut.")
Everything the student sees (text):
```
O
Omar's broken search

Omar stops the whole search when its first branch ends.

Your main goal: Expose Omar's mistake. Draw two graphs: first the correct graph, then Omar's graph using the mistake. Edge numbers show drawing order.

WHICH SPRINKLER IS SHUT?
shut sprinkler
OUTPUT
CORRECT OUTPUT
OMAR’S OUTPUT
Drawing 1 of 2: Correct graph · Choose shut sprinkler
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
2 · Omar's graph
Check my graph
→
```
Start field: label "WHICH SPRINKLER IS SHUT? / shut sprinkler", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | OMAR’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1→2, 1→3, 3→4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3, 4 · edges: 1→2, 1→3, 3→4
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
OMAR'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong valve closed"; authored goal, NOT shown to student: "Shut sprinkler 1, but make the mistaken search begin at sprinkler 2.")
Everything the student sees (text):
```
M
Marley's broken search

Marley runs the search from a different shut sprinkler.

Your main goal: Expose Marley's mistake. Draw two graphs: first the correct graph, then Marley's graph using the mistake.

WHICH SPRINKLER IS SHUT?
shut sprinkler
OUTPUT
CORRECT OUTPUT
MARLEY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose shut sprinkler
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
2 · Marley's graph
Check my graph
→
```
Start field: label "WHICH SPRINKLER IS SHUT? / shut sprinkler", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MARLEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "2" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2,3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 2→1, 2→3 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2,3]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 2→1, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
MARLEY'S OUTPUT
[1,2,3]
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
ids=[4,5,6], feeds=[0,4,4], liters=[100,1,1], shutId=4
```
Node-name guide: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "4:100", "5:1", "6:1" · edges: 4:100→5:1, 4:100→6:1
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the sprinkler being shut and descendants already known to be below it.”"
    feedback if wrong: The full feeder tree must be built before the descendants of an arbitrary shut sprinkler are known. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [YES is correct] (direct-vs-reach) "4:100 and 5:1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 4:100→5:1 as one direct edge.
- [YES is correct] (local-degree) "6:1 has exactly 0 outgoing direct edges."
    feedback if wrong: 6:1 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The full feeder tree must be built before the descendants of an arbitrary shut sprinkler are known. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
×
Correct. The mini-example lists 4:100→5:1 as one direct edge.
×
6:1 has 0 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each distinct liters-per-hour amount.”"
    feedback if wrong: Two sprinklers can use the same amount and still be separate parts of the tree. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [YES is correct] (direct-vs-reach) "4:100 and 6:1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 4:100→6:1 as one direct edge.
- [YES is correct] (local-degree) "4:100 has exactly 2 outgoing direct edges."
    feedback if wrong: 4:100 has 2 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two sprinklers can use the same amount and still be separate parts of the tree. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
×
Correct. The mini-example lists 4:100→6:1 as one direct edge.
×
4:100 has 2 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each feeder relationship in the arrays.”"
    feedback if wrong: Feeder relationships are edges. Sprinkler IDs are their endpoints. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [YES is correct] (direct-vs-reach) "4:100 and 5:1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 4:100→5:1 as one direct edge.
- [YES is correct] (local-degree) "5:1 has exactly 0 outgoing direct edges."
    feedback if wrong: 5:1 has 0 outgoing direct edges.
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
ids=[10,20,30,40], feeds=[0,10,10,20], liters=[2,3,5,7], shutId=20
```
Node-name guide: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "10:2", "20:3", "30:5", "40:7" · edges: 10:2→20:3, 10:2→30:5, 20:3→40:7
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "40:7 has exactly 0 outgoing direct edges."
    feedback if wrong: 40:7 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each distinct liters-per-hour amount.”"
    feedback if wrong: Two sprinklers can use the same amount and still be separate parts of the tree. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [YES is correct] (direct-vs-reach) "10:2 can reach 40:7 through 20:3, but the graph still has no direct 10:2→40:7 edge."
    feedback if wrong: Right. A multi-step route through 20:3 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
ids=[30,10,20], feeds=[0,30,10], liters=[7,1,9], shutId=10
```
Node-name guide: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "30:7", "10:1", "20:9" · edges: 30:7→10:1, 10:1→20:9
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the sprinkler being shut and descendants already known to be below it.”"
    feedback if wrong: The full feeder tree must be built before the descendants of an arbitrary shut sprinkler are known. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [NO is correct] (direct-vs-reach) "The correct graph has 30:7→10:1 and 10:1→20:9, so it should also contain a direct 30:7→20:9 edge."
    feedback if wrong: Two direct edges through 10:1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "20:9 has exactly 1 outgoing direct edge."
    feedback if wrong: 20:9 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
ids=[8,3,6], feeds=[0,8,3], liters=[4,5,2], shutId=3
```
Node-name guide: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "8:4", "3:5", "6:2" · edges: 8:4→3:5, 3:5→6:2
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3:5 has exactly 1 outgoing direct edge."
    feedback if wrong: 3:5 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each feeder relationship in the arrays.”"
    feedback if wrong: Feeder relationships are edges. Sprinkler IDs are their endpoints. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
- [YES is correct] (direct-vs-reach) "8:4 can reach 6:2 through 3:5, but the graph still has no direct 8:4→6:2 edge."
    feedback if wrong: Right. A multi-step route through 3:5 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
ids=[1,2,3], feeds=[0,1,2], liters=[6,7,8], shutId=1
```
Node-name guide: Required node-name format: Name each sprinkler id:litersPerHour. Example: sprinkler 7 using 10 L/h is 7:10. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1:6", "2:7", "3:8" · edges: 1:6→2:7, 2:7→3:8
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 1:6→2:7 and 2:7→3:8, so it should also contain a direct 1:6→3:8 edge."
    feedback if wrong: Two direct edges through 2:7 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1:6 has exactly 2 outgoing direct edges."
    feedback if wrong: 1:6 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each distinct liters-per-hour amount.”"
    feedback if wrong: Two sprinklers can use the same amount and still be separate parts of the tree. Correct node rule: Each sprinkler ID, including the root sprinkler fed by 0.
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

### S4 case 1 — `authored-deep-case` · bug: Counts only the selected sprinkler
Input shown:
```
REAL PROBLEM INPUT
ids: [1, 2, 3, 4]
feeds: [0, 1, 1, 2]
liters: [5, 10, 20, 40]
shutId: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const index = input.ids.indexOf(input.shutId);
  if (index === -1) {
    return 0;
  }
  return input.liters[index];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 1→3, 2→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "liters per hour stopped" · expected buggy output `10` · real correct output `50`
Diagnosis choices as displayed:
- A The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated.
- B The code adds upstream sprinkler 1 even though it still sprays, which changes how the shown graph is evaluated.
- C The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree.
Diagnosis answer key + feedback:
- ✅ [selected-only] "The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree." — feedback: Correct. Shutting 2 also stops child 4, adding 40 liters.
- ❌ [wrong-id-index] "The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated." — feedback: It uses indexOf, so ID 2 is mapped to its actual array position.
- ❌ [includes-ancestors] "The code adds upstream sprinkler 1 even though it still sprays, which changes how the shown graph is evaluated." — feedback: The code adds no ancestor; it omits the descendant.
Graph proof shown in feedback: code rule "The result reads one node weight and performs no traversal." → changed graph "Sprinkler 2 has downstream child 4 in the feeder tree." → boundary "The shut node has a 40-liter descendant." → returned value "The code returns 10 instead of subtree total 10+40=50."
Output-format probes: ❌ quoted number → `"10"`; ❌ trailing period → `10.`
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
About your diagnosis: It uses indexOf, so ID 2 is mapped to its actual array position.
Code rule: The result reads one node weight and performs no traversal. → Changed graph: Sprinkler 2 has downstream child 4 in the feeder tree. → Reachable boundary: The shut node has a 40-liter descendant.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts only the selected sprinkler
INCORRECT OUTPUT
10
CORRECT OUTPUT
50
Code rule: The result reads one node weight and performs no traversal. → Changed graph: Sprinkler 2 has downstream child 4 in the feeder tree. → Reachable boundary: The shut node has a 40-liter descendant. → Returned value: The code returns 10 instead of subtree total 10+40=50.
```

### S4 case 2 — `shut-root` · bug: Counts only the selected sprinkler
Input shown:
```
REAL PROBLEM INPUT
ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const index = input.ids.indexOf(input.shutId);
  if (index === -1) {
    return 0;
  }
  return input.liters[index];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1:5", "2:10", "3:20", "4:40" · edges: 1:5→2:10, 1:5→3:20, 2:10→4:40
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "liters per hour stopped" · expected buggy output `5` · real correct output `75`
Diagnosis choices as displayed:
- A The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree.
- B The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated.
- C The code wrongly adds an upstream sprinkler when shutting root sprinkler 1.
Diagnosis answer key + feedback:
- ✅ [selected-only] "The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree." — feedback: Exactly. The result reads one node weight and performs no traversal. The shown code returns 5; the real problem returns 75.
- ❌ [wrong-id-index] "The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated." — feedback: indexOf maps shut ID 1 to its actual array position 0.
- ❌ [includes-ancestors] "The code wrongly adds an upstream sprinkler when shutting root sprinkler 1." — feedback: Sprinkler 1 is the root and has no upstream sprinkler; the code only reads its own 5 liters.
Graph proof shown in feedback: code rule "The result reads one node weight and performs no traversal." → changed graph "Nodes are 1:5, 2:10, 3:20, 4:40; direct arrows are 1:5→2:10, 1:5→3:20, 2:10→4:40." → boundary "ignore-downstream-subtree" → returned value "The shown code returns 5; the real problem returns 75."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts only the selected sprinkler
INCORRECT OUTPUT
5
CORRECT OUTPUT
75
Code rule: The result reads one node weight and performs no traversal. → Changed graph: Nodes are 1:5, 2:10, 3:20, 4:40; direct arrows are 1:5→2:10, 1:5→3:20, 2:10→4:40. → Reachable boundary: ignore-downstream-subtree → Returned value: The shown code returns 5; the real problem returns 75.
```

### S4 case 3 — `repair-1` · bug: Counts only the selected sprinkler
Input shown:
```
REAL PROBLEM INPUT
ids=[10,20,30,40], feeds=[0,10,10,20], liters=[2,3,5,7], shutId=20
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const index = input.ids.indexOf(input.shutId);
  if (index === -1) {
    return 0;
  }
  return input.liters[index];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "10:2", "20:3", "30:5", "40:7" · edges: 10:2→20:3, 10:2→30:5, 20:3→40:7
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "liters per hour stopped" · expected buggy output `3` · real correct output `10`
Diagnosis choices as displayed:
- A The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated.
- B The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree.
- C The code adds upstream sprinkler 10 even though shutting 20 should affect only 20 and descendant 40.
Diagnosis answer key + feedback:
- ✅ [selected-only] "The code reads shutId's own liters but never follows feeder-to-sprinkler edges into its downstream subtree." — feedback: Exactly. The result reads one node weight and performs no traversal. The shown code returns 3; the real problem returns 10.
- ❌ [wrong-id-index] "The code assumes a sprinkler ID is the same as its array index, which changes how the shown graph is evaluated." — feedback: indexOf correctly maps non-contiguous shut ID 20 to array position 1.
- ❌ [includes-ancestors] "The code adds upstream sprinkler 10 even though shutting 20 should affect only 20 and descendant 40." — feedback: The helper returns only sprinkler 20's 3 liters; it adds neither ancestor 10 nor descendant 40.
Graph proof shown in feedback: code rule "The result reads one node weight and performs no traversal." → changed graph "Nodes are 10:2, 20:3, 30:5, 40:7; direct arrows are 10:2→20:3, 10:2→30:5, 20:3→40:7." → boundary "ignore-downstream-subtree" → returned value "The shown code returns 3; the real problem returns 10."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts only the selected sprinkler
INCORRECT OUTPUT
3
CORRECT OUTPUT
10
Code rule: The result reads one node weight and performs no traversal. → Changed graph: Nodes are 10:2, 20:3, 30:5, 40:7; direct arrows are 10:2→20:3, 10:2→30:5, 20:3→40:7. → Reachable boundary: ignore-downstream-subtree → Returned value: The shown code returns 3; the real problem returns 10.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```