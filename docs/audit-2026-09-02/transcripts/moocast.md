# Moocast (`moocast`) — new, directed-graph

## Problem statement (Description tab)

Farmer John's cows each carry a walkie-talkie. You are given an array `cows`, where `cows[i] = [x, y, p]` gives cow `i`'s position `(x, y)` and the power `p` of her walkie-talkie.

Cow `i` can transmit DIRECTLY to cow `j` if the distance between them is at most `p` (cow i's own power) — that is, when `(x_i - x_j)^2 + (y_i - y_j)^2 <= p_i^2`.

Note that transmissions are one-way: a strong cow may reach a weak cow that cannot answer back.

Messages can be relayed: if cow `i` reaches cow `j`, cow `j` can pass the message on using her own power, and so on.

Write a function `maxBroadcast(cows)` that returns the largest number of cows (counting the starting cow herself) that can receive a broadcast started by a single, best-chosen cow.

### Examples
- Example 1: input `cows = [[1,3,5],[5,4,3],[7,2,1],[6,1,1]]` → output `3`. Cow 0 (power 5, so 25 squared) reaches cow 1 since (1-5)^2+(3-4)^2 = 17 <= 25. Cow 1 (power 3, so 9) reaches cow 2 since (5-7)^2+(4-2)^2 = 8 <= 9. Cow 2's power 1 reaches no one: her distance-squared to cow 3 is 2 > 1. Starting at cow 0 the broadcast covers cows {0, 1, 2} = 3 cows, which is the best possible.
- Example 2: input `cows = [[0,0,2],[3,0,3],[5,0,1]]` → output `3`. Starting at cow 1 (power 3, so 9): she reaches cow 0 (distance-squared 9 <= 9) and cow 2 (distance-squared 4 <= 9). That covers all 3 cows. Starting at cow 0 covers only herself (9 > 4), and cow 2 also covers only herself (4 > 1).

### Graph rules (authored)
- Nodes: One cow, with its position and transmission power.
- Edges: Cow j is within cow i's power radius; only i's power is used.
- Node-name format shown in Step 1/3: Name each cow `0BasedIndex: (x,y) p=power`. Example: `1: (3,0) p=2`. (pattern `^\d+: \(-?\d+,-?\d+\) p=\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "all cows")
Raw input shown:
```
cows=[[0,0,2],[2,0,2],[4,0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Cow 0 reaches 1, which relays to 2.
- ❌ [wrong] "2"
    feedback: That follows the count direct only bug. (misconception: count-direct-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0: (0,0) p=2", "1: (2,0) p=2", "2: (4,0) p=1" · edges: 0: (0,0) p=2→1: (2,0) p=2, 1: (2,0) p=2→0: (0,0) p=2, 1: (2,0) p=2→2: (4,0) p=1
"Why" shown after success: Cow 0 reaches 1, which relays to 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "cow identity")
Raw input shown:
```
cows=[[0,0,1],[2,0,3]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Starting at cow 1 reaches cow 0 even though the reverse fails.
- ❌ [wrong] "1"
    feedback: That follows the require mutual reach bug. (misconception: require-mutual-reach)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0: (0,0) p=1", "1: (2,0) p=3" · edges: 1: (2,0) p=3→0: (0,0) p=1
"Why" shown after success: Starting at cow 1 reaches cow 0 even though the reverse fails.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "all cows")
Raw input shown:
```
cows=[[0,0,2],[2,0,2],[4,0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0: (0,0) p=2 / 1: (2,0) p=2
2. Picture C / 0: (0,0) p=2 / 1: (2,0) p=2 / 2: (4,0) p=1
3. Picture A / 0: (0,0) p=2 / 1: (2,0) p=2 / 2: (4,0) p=1
4. Picture D / 0: (0,0) p=2 / 1: (2,0) p=2 / 2: (4,0) p=1
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0: (0,0) p=2, 1: (2,0) p=2, 2: (4,0) p=1 · edges: 0: (0,0) p=2→1: (2,0) p=2, 1: (2,0) p=2→0: (0,0) p=2, 1: (2,0) p=2→2: (4,0) p=1
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: DIRECTED · nodes: 0: (0,0) p=2, 1: (2,0) p=2 · edges: 0: (0,0) p=2→1: (2,0) p=2, 1: (2,0) p=2→0: (0,0) p=2
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: DIRECTED · nodes: 0: (0,0) p=2, 1: (2,0) p=2, 2: (4,0) p=1 · edges: 0: (0,0) p=2→1: (2,0) p=2, 1: (2,0) p=2→0: (0,0) p=2
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: 0: (0,0) p=2, 1: (2,0) p=2, 2: (4,0) p=1 · edges: 0: (0,0) p=2→1: (2,0) p=2, 1: (2,0) p=2→0: (0,0) p=2, 2: (4,0) p=1→1: (2,0) p=2
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-3`, facet "sender-power arrows")
Raw input shown:
```
cows=[[0,0,1],[3,0,1],[6,0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. No cow reaches another.
- ❌ [wrong] "3"
    feedback: That follows the count all declared cows bug. (misconception: count-all-declared-cows)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0: (0,0) p=1", "1: (3,0) p=1", "2: (6,0) p=1" · edges: none
"Why" shown after success: No cow reaches another.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "cow identity")
Raw input shown:
```
What does each radio node represent?
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does each radio node represent?**
Choices as displayed (top to bottom):
1. A / One circular transmission range.
2. B / One relayed message.
3. C / One pair of cows close enough in either direction.
4. D / One cow, with its position and transmission power.
Answer key + feedback per choice (data):
- ✅ CORRECT [cow] "One cow, with its position and transmission power."
    feedback: Right. Power is data attached to the sending cow.
- ❌ [range] "One circular transmission range."
    feedback: The range belongs to a cow; the cow is the graph node. (misconception: uses-range-as-node)
- ❌ [message] "One relayed message."
    feedback: Messages travel through the fixed cow graph. (misconception: uses-traversal-event-as-node)
- ❌ [pair] "One pair of cows close enough in either direction."
    feedback: Each cow stays separate because reach can be one-way. (misconception: collapses-pair)
"Why" shown after success: Right. Power is data attached to the sending cow.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-4`, facet "largest relay reach")
Raw input shown:
```
cows=[[5,5,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The broadcast starts with one reached cow.
- ❌ [wrong] "0"
    feedback: That follows the exclude starting cow bug. (misconception: exclude-starting-cow)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0: (5,5) p=1" · edges: none
"Why" shown after success: The broadcast starts with one reached cow.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "sender-power arrows")
Raw input shown:
```
When should arrow i → j be drawn?
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should arrow i → j be drawn?**
Choices as displayed (top to bottom):
1. A / Cow j is within cow i's power radius; only i's power is used.
2. B / Either cow can reach the other, so arrows always go both ways.
3. C / Cow i lies within cow j's power radius.
4. D / Cow j is reachable from i after any number of relays.
Answer key + feedback per choice (data):
- ✅ CORRECT [sender-range] "Cow j is within cow i's power radius; only i's power is used."
    feedback: Right. The sender decides whether this directed transmission exists.
- ❌ [either] "Either cow can reach the other, so arrows always go both ways."
    feedback: A strong cow may reach a weak cow that cannot answer. (misconception: makes-range-symmetric)
- ❌ [receiver] "Cow i lies within cow j's power radius."
    feedback: That condition describes the reverse arrow j → i. (misconception: uses-receiver-power)
- ❌ [relay] "Cow j is reachable from i after any number of relays."
    feedback: A relay chain is a path, not one direct radio edge. (misconception: turns-path-into-edge)
"Why" shown after success: Right. The sender decides whether this directed transmission exists.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "largest relay reach")
Raw input shown:
```
cows = [[1,3,5],[5,4,3],[7,2,1],[6,1,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum broadcast count is returned for the shown cows?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 1
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: Cow 1 relays the message onward to cow 2. (misconception: counts-direct-only)
- ❌ [wrong-2] "1"
    feedback: The starting cow counts and can reach another cow. (misconception: ignores-transmissions)
- ❌ [wrong-3] "4"
    feedback: A cow outside the directed relay chain is not reached. (misconception: counts-all-cows)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "largest relay reach")
Raw input shown:
```
cows = [[0,0,2],[3,0,3],[5,0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum broadcast count is returned for the shown cows?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 2
3. C / 1
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: Start at the middle cow to reach both others. (misconception: chooses-end-cow)
- ❌ [wrong-2] "1"
    feedback: The best start is not required to be cow 0. (misconception: always-starts-zero)
- ❌ [wrong-3] "4"
    feedback: There are only three cows and each counts once. (misconception: double-counts-start)
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
cows=[[0,0,3],[3,0,1],[4,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Cow 0 reaches 1, and cow 1 reaches 2.; ❌ "2" — That follows the stop after first transmission bug.
Remedial required graph (hidden): DIRECTED · nodes: "0: (0,0) p=3", "1: (3,0) p=1", "2: (4,0) p=1" · edges: 0: (0,0) p=3→1: (3,0) p=1, 1: (3,0) p=1→2: (4,0) p=1, 2: (4,0) p=1→1: (3,0) p=1
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [range]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One cow, with its position and transmission power.
Your choice: The range belongs to a cow; the cow is the graph node.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
cows=[[0,0,2],[2,0,5],[7,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. Cow 0 relays through powerful cow 1 to cow 2.; ❌ "2" — That follows the always start cow zero direct only bug.
Remedial required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (2,0) p=5", "2: (7,0) p=1" · edges: 0: (0,0) p=2→1: (2,0) p=5, 1: (2,0) p=5→0: (0,0) p=2, 1: (2,0) p=5→2: (7,0) p=1
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [either]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Cow j is within cow i's power radius; only i's power is used.
Your choice: A strong cow may reach a weak cow that cannot answer.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
cows=[[0,0,2],[3,0,3],[5,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 1
Remedial answer key: ✅ "3" — Correct. The best start is middle cow 1.; ❌ "1" — That follows the always start at index zero bug.
Remedial required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (3,0) p=3", "2: (5,0) p=1" · edges: 1: (3,0) p=3→0: (0,0) p=2, 1: (3,0) p=3→2: (5,0) p=1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Cow 1 relays the message onward to cow 2.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
cows=[[0,0,2],[2,0,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. Only the sender cow 0 needs enough power.; ❌ "1" — That follows the use receiver power bug.
Remedial required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (2,0) p=1" · edges: 0: (0,0) p=2→1: (2,0) p=1
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: Start at the middle cow to reach both others.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
cows=[[0,0,5],[3,4,1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. A cow exactly on the radius boundary is reachable.; ❌ "1" — That follows the use strict distance bound bug.
Remedial required graph (hidden): DIRECTED · nodes: "0: (0,0) p=5", "1: (3,4) p=1" · edges: 0: (0,0) p=5→1: (3,4) p=1
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Unequal radio power"; authored goal, NOT shown to student: "Let a strong cow reach a weak cow that cannot transmit back.")
Everything the student sees (text):
```
T
Tyson's broken search

Tyson forgets that the listed connections have a direction.

Your main goal: Expose Tyson's mistake. Draw two graphs: first the correct graph, then Tyson's graph using the mistake.

CHOOSE THE BROADCASTING COW
broadcasting cow
OUTPUT
CORRECT OUTPUT
TYSON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose broadcasting cow
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
2 · Tyson's graph
Check my graph
→
```
Start field: label "CHOOSE THE BROADCASTING COW / broadcasting cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | TYSON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0: (0,0) p=2", "1: (2,0) p=2", "2: (4,0) p=1"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
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
TYSON'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Relay broadcast"; authored goal, NOT shown to student: "Put a cow in range only through a second broadcaster.")
Everything the student sees (text):
```
F
Fatima's broken search

Fatima never explores beyond the start's immediate neighbors.

Your main goal: Expose Fatima's mistake. Draw two graphs: first the correct graph, then Fatima's graph using the mistake.

CHOOSE THE BROADCASTING COW
broadcasting cow
OUTPUT
CORRECT OUTPUT
FATIMA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose broadcasting cow
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
2 · Fatima's graph
Check my graph
→
```
Start field: label "CHOOSE THE BROADCASTING COW / broadcasting cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | FATIMA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
FATIMA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Competing relays"; authored goal, NOT shown to student: "Give the starting cow two useful transmission branches.")
Everything the student sees (text):
```
C
Caiden's broken search

Caiden keeps only the last branch it sees.

Your main goal: Expose Caiden's mistake. Draw two graphs: first the correct graph, then Caiden's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE BROADCASTING COW
broadcasting cow
OUTPUT
CORRECT OUTPUT
CAIDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose broadcasting cow
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
2 · Caiden's graph
Check my graph
→
```
Start field: label "CHOOSE THE BROADCASTING COW / broadcasting cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CAIDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
CAIDEN'S OUTPUT
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
cows=[[0,0,2],[2,0,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (2,0) p=1" · edges: 0: (0,0) p=2→1: (2,0) p=1
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One pair of cows close enough in either direction.”"
    feedback if wrong: Each cow stays separate because reach can be one-way. Correct node rule: One cow, with its position and transmission power.
- [NO is correct] (direct-vs-reach) "0: (0,0) p=2 can reach 1: (2,0) p=1, but there is no direct 0: (0,0) p=2→1: (2,0) p=1 edge."
    feedback if wrong: The mini-example lists 0: (0,0) p=2→1: (2,0) p=1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0: (0,0) p=2 has exactly 2 outgoing direct edges."
    feedback if wrong: 0: (0,0) p=2 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Each cow stays separate because reach can be one-way. Correct node rule: One cow, with its position and transmission power.
×
The mini-example lists 0: (0,0) p=2→1: (2,0) p=1 as one direct edge. A direct edge is different from a longer reachable route.
×
0: (0,0) p=2 has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "0: (0,0) p=2 can reach 1: (2,0) p=1, but there is no direct 0: (0,0) p=2→1: (2,0) p=1 edge."
    feedback if wrong: The mini-example lists 0: (0,0) p=2→1: (2,0) p=1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1: (2,0) p=1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1: (2,0) p=1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One circular transmission range.”"
    feedback if wrong: The range belongs to a cow; the cow is the graph node. Correct node rule: One cow, with its position and transmission power.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists 0: (0,0) p=2→1: (2,0) p=1 as one direct edge. A direct edge is different from a longer reachable route.
×
1: (2,0) p=1 has 0 outgoing direct edges.
×
The range belongs to a cow; the cow is the graph node. Correct node rule: One cow, with its position and transmission power.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One relayed message.”"
    feedback if wrong: Messages travel through the fixed cow graph. Correct node rule: One cow, with its position and transmission power.
- [NO is correct] (direct-vs-reach) "0: (0,0) p=2 can reach 1: (2,0) p=1, but there is no direct 0: (0,0) p=2→1: (2,0) p=1 edge."
    feedback if wrong: The mini-example lists 0: (0,0) p=2→1: (2,0) p=1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0: (0,0) p=2 has exactly 2 outgoing direct edges."
    feedback if wrong: 0: (0,0) p=2 has 1 outgoing direct edge.
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
cows=[[0,0,5],[3,4,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0: (0,0) p=5", "1: (3,4) p=1" · edges: 0: (0,0) p=5→1: (3,4) p=1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1: (3,4) p=1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1: (3,4) p=1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One circular transmission range.”"
    feedback if wrong: The range belongs to a cow; the cow is the graph node. Correct node rule: One cow, with its position and transmission power.
- [YES is correct] (direct-vs-reach) "0: (0,0) p=5 and 1: (3,4) p=1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0: (0,0) p=5→1: (3,4) p=1 as one direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
cows=[[0,0,3],[3,0,1],[4,0,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0: (0,0) p=3", "1: (3,0) p=1", "2: (4,0) p=1" · edges: 0: (0,0) p=3→1: (3,0) p=1, 1: (3,0) p=1→2: (4,0) p=1, 2: (4,0) p=1→1: (3,0) p=1
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0: (0,0) p=3→1: (3,0) p=1 and 1: (3,0) p=1→2: (4,0) p=1, so it should also contain a direct 0: (0,0) p=3→2: (4,0) p=1 edge."
    feedback if wrong: Two direct edges through 1: (3,0) p=1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2: (4,0) p=1 has exactly 2 outgoing direct edges."
    feedback if wrong: 2: (4,0) p=1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One pair of cows close enough in either direction.”"
    feedback if wrong: Each cow stays separate because reach can be one-way. Correct node rule: One cow, with its position and transmission power.
Result: PASSED

### S3 Q4
Raw input shown:
```
cows=[[0,0,2],[2,0,5],[7,0,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (2,0) p=5", "2: (7,0) p=1" · edges: 0: (0,0) p=2→1: (2,0) p=5, 1: (2,0) p=5→0: (0,0) p=2, 1: (2,0) p=5→2: (7,0) p=1
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One relayed message.”"
    feedback if wrong: Messages travel through the fixed cow graph. Correct node rule: One cow, with its position and transmission power.
- [NO is correct] (direct-vs-reach) "The correct graph has 0: (0,0) p=2→1: (2,0) p=5 and 1: (2,0) p=5→2: (7,0) p=1, so it should also contain a direct 0: (0,0) p=2→2: (7,0) p=1 edge."
    feedback if wrong: Two direct edges through 1: (2,0) p=5 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1: (2,0) p=5 has exactly 1 outgoing direct edge."
    feedback if wrong: 1: (2,0) p=5 has 2 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
cows=[[0,0,2],[3,0,3],[5,0,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex: (x,y) p=power. Example: 1: (3,0) p=2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0: (0,0) p=2", "1: (3,0) p=3", "2: (5,0) p=1" · edges: 1: (3,0) p=3→0: (0,0) p=2, 1: (3,0) p=3→2: (5,0) p=1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0: (0,0) p=2 has exactly 0 outgoing direct edges."
    feedback if wrong: 0: (0,0) p=2 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One circular transmission range.”"
    feedback if wrong: The range belongs to a cow; the cow is the graph node. Correct node rule: One cow, with its position and transmission power.
- [YES is correct] (direct-vs-reach) "1: (3,0) p=3 and 0: (0,0) p=2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1: (3,0) p=3→0: (0,0) p=2 as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: One-way radio links become two-way
Input shown:
```
REAL PROBLEM INPUT
cows: [[0, 0, 3], [3, 0, 1], [5, 0, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxBroadcast(cows) {
  const next = cows.map(() => []);
  for (let index = 0; index < cows.length; index++) {
    for (let otherIndex = index + 1; otherIndex < cows.length; otherIndex++) {
      const xDifference = cows[index][0] - cows[otherIndex][0];
      const yDifference = cows[index][1] - cows[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= cows[index][2] ** 2 ||
        distanceSquared <= cows[otherIndex][2] ** 2
      ) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < cows.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of next[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:p3", "1:p1", "2:p2" · edges: 0:p3→1:p1, 2:p2→1:p1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A The OR test and paired pushes turn 0→1←2 into the undirected chain 0—1—2.
- B The code compares squared distance to unsquared power for the shown graph.
- C The starting cow should not count as receiving her own broadcast.
Diagnosis answer key + feedback:
- ❌ [distance-not-squared] "The code compares squared distance to unsquared power for the shown graph." — feedback: It correctly squares each power; direction is lost after the comparison.
- ✅ [symmetrizes-radio] "The OR test and paired pushes turn 0→1←2 into the undirected chain 0—1—2." — feedback: Exactly. Cow 1 is too weak to send a message back to either neighbor.
- ❌ [exclude-starter] "The starting cow should not count as receiving her own broadcast." — feedback: The problem explicitly counts the starting cow.
Graph proof shown in feedback: code rule "Any one-way reach in a pair creates two adjacency entries." → changed graph "The only arrows are 0→1 and 2→1; no start reaches all three cows." → boundary "Weak middle cow 1 cannot relay outward in the real graph." → returned value "The undirected code reports all 3 connected; the best real broadcast reaches only 2 cows."
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
About your diagnosis: It correctly squares each power; direction is lost after the comparison.
Code rule: Any one-way reach in a pair creates two adjacency entries. → Changed graph: The only arrows are 0→1 and 2→1; no start reaches all three cows. → Reachable boundary: Weak middle cow 1 cannot relay outward in the real graph.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One-way radio links become two-way
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: Any one-way reach in a pair creates two adjacency entries. → Changed graph: The only arrows are 0→1 and 2→1; no start reaches all three cows. → Reachable boundary: Weak middle cow 1 cannot relay outward in the real graph. → Returned value: The undirected code reports all 3 connected; the best real broadcast reaches only 2 cows.
```

### S4 case 2 — `new-four-cow-one-way-chain` · bug: One-way radio links become two-way
Input shown:
```
REAL PROBLEM INPUT
cows: [[0, 0, 4], [4, 0, 0], [8, 0, 4], [12, 0, 0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxBroadcast(cows) {
  const next = cows.map(() => []);
  for (let index = 0; index < cows.length; index++) {
    for (let otherIndex = index + 1; otherIndex < cows.length; otherIndex++) {
      const xDifference = cows[index][0] - cows[otherIndex][0];
      const yDifference = cows[index][1] - cows[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= cows[index][2] ** 2 ||
        distanceSquared <= cows[otherIndex][2] ** 2
      ) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < cows.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of next[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 2→1, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `4` · real correct output `3`
Diagnosis choices as displayed:
- A Squared distance makes the 4-unit transmissions fail because 4² is compared with 4.
- B The OR test and two pushes turn arrows 0→1, 2→1, and 2→3 into one undirected four-cow component.
- C The search must start only at cow 0 rather than trying every broadcaster.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "Squared distance makes the 4-unit transmissions fail because 4² is compared with 4." — feedback: The code compares squared distance 16 with squared power 16, so every intended 4-unit transmission passes.
- ✅ [symmetrizes-radio] "The OR test and two pushes turn arrows 0→1, 2→1, and 2→3 into one undirected four-cow component." — feedback: Exactly. In the real directed graph cow 2 reaches only three cows.
- ❌ [wrong-visited] "The search must start only at cow 0 rather than trying every broadcaster." — feedback: Trying every starting cow is required because the problem asks for the best broadcaster.
Graph proof shown in feedback: code rule "If either cow reaches the pair, adjacency is added both ways." → changed graph "Real arrows are 0→1, 2→1, and 2→3; the best start reaches {2,1,3}." → boundary "Weak cow 1 becomes an illegal bridge from cow 0 to cow 2." → returned value "The code reports 4; the real maximum broadcast is 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One-way radio links become two-way
INCORRECT OUTPUT
4
CORRECT OUTPUT
3
Code rule: If either cow reaches the pair, adjacency is added both ways. → Changed graph: Real arrows are 0→1, 2→1, and 2→3; the best start reaches {2,1,3}. → Reachable boundary: Weak cow 1 becomes an illegal bridge from cow 0 to cow 2. → Returned value: The code reports 4; the real maximum broadcast is 3.
```

### S4 case 3 — `new-five-cow-inward-star` · bug: One-way radio links become two-way
Input shown:
```
REAL PROBLEM INPUT
cows: [[0, 0, 0], [3, 0, 3], [-3, 0, 3], [0, 3, 3], [0, -3, 3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxBroadcast(cows) {
  const next = cows.map(() => []);
  for (let index = 0; index < cows.length; index++) {
    for (let otherIndex = index + 1; otherIndex < cows.length; otherIndex++) {
      const xDifference = cows[index][0] - cows[otherIndex][0];
      const yDifference = cows[index][1] - cows[otherIndex][1];
      const distanceSquared =
        xDifference * xDifference + yDifference * yDifference;
      if (
        distanceSquared <= cows[index][2] ** 2 ||
        distanceSquared <= cows[otherIndex][2] ** 2
      ) {
        next[index].push(otherIndex);
        next[otherIndex].push(index);
      }
    }
  }
  let largestValue = 0;
  for (let startNode = 0; startNode < cows.length; startNode++) {
    const visited = new Set([startNode]);
    const stack = [startNode];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of next[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    largestValue = Math.max(largestValue, visited.size);
  }
  return largestValue;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 1→0, 2→0, 3→0, 4→0
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `2`
Diagnosis choices as displayed:
- A Negative x and y coordinates make the squared-distance calculation negative.
- B The maximum should exclude the starting cow from seen, changing five to four.
- C Each outer cow can reach the center, but the code also lets the powerless center transmit back to every outer cow.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "Negative x and y coordinates make the squared-distance calculation negative." — feedback: Squaring coordinate differences makes negative coordinates safe and distances nonnegative.
- ✅ [symmetrizes-radio] "Each outer cow can reach the center, but the code also lets the powerless center transmit back to every outer cow." — feedback: Exactly. Any real start reaches at most itself and the center.
- ❌ [wrong-visited] "The maximum should exclude the starting cow from seen, changing five to four." — feedback: Reach counts include the starting cow by definition, so removing it would create another error.
Graph proof shown in feedback: code rule "Each inward arrow is stored as a two-way link." → changed graph "Four one-way arrows point inward to powerless center cow 0." → boundary "The center has no real outgoing edge but becomes a four-way relay." → returned value "The helper connects all 5 cows; the correct maximum is 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
One-way radio links become two-way
INCORRECT OUTPUT
5
CORRECT OUTPUT
2
Code rule: Each inward arrow is stored as a two-way link. → Changed graph: Four one-way arrows point inward to powerless center cow 0. → Reachable boundary: The center has no real outgoing edge but becomes a four-way relay. → Returned value: The helper connects all 5 cows; the correct maximum is 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```