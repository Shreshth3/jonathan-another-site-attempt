# Water and Jug Problem (`water-and-jug-problem`) — original, state

## Problem statement (Description tab)

You have two water jugs with capacities of `jug1Capacity` and `jug2Capacity` liters. There is an unlimited water supply, but the jugs have no measurement markings. Both jugs start empty.

At any point you may do one of these moves:

- **Fill** either jug completely to the top.
- **Empty** either jug completely.
- **Pour** water from one jug into the other, until either the source jug is empty or the destination jug is full.

Return `true` if it is possible to reach a moment where the water you are holding measures exactly `targetCapacity` liters — either inside one jug, or as the combined total in both jugs. Otherwise return `false`.

### Examples
- Example 1: input `jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 4` → output `true`. Fill the 5-liter jug, pour it into the 3-liter jug (leaving 2), empty the 3-liter jug, pour the 2 liters in, fill the 5-liter jug again, and top off the 3-liter jug. That pours off exactly 1 liter, leaving 4 liters in the 5-liter jug.
- Example 2: input `jug1Capacity = 2, jug2Capacity = 6, targetCapacity = 5` → output `false`. Every reachable amount is a multiple of 2, so 5 liters is impossible.
- Example 3: input `jug1Capacity = 1, jug2Capacity = 2, targetCapacity = 3` → output `true`. Fill both jugs; together they hold exactly 3 liters.

### Graph rules (authored)
- Nodes: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- Edges: When one legal fill, empty, or pour operation changes the first state into the second.
- Node-name format shown in Step 1/3: Name a state `(jug1Amount,jug2Amount)`. Example: `(2,3)`. Do not add spaces. (pattern `^\(\d+,\d+\)$`)
- Step 2 node-label rule: `state-pair` — Use jug states like (0,0).


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-reachable`, facet "target reachability")
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Pouring the 3-liter jug into the 2-liter jug leaves 1 liter.
- ❌ [near-miss] "false"
    feedback: That result follows the target must equal capacity bug, not the exact picture. (misconception: target-must-equal-capacity)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(2,0)", "(0,3)", "(2,3)", "(0,2)", "(2,1)" · edges: (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3), (0,3)→(2,1)
"Why" shown after success: Pouring the 3-liter jug into the 2-liter jug leaves 1 liter.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-gcd-fail`, facet "target reachability")
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 4, targetCapacity = 3
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. All reachable amounts are even, so no state contains exactly 3.
- ❌ [near-miss] "true"
    feedback: That result follows the allow arbitrary measured pour bug, not the exact picture. (misconception: allow-arbitrary-measured-pour)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(2,0)", "(0,4)", "(2,4)", "(0,2)", "(2,2)" · edges: (0,0)→(2,0), (0,0)→(0,4), (2,0)→(2,4), (2,0)→(0,2), (0,4)→(2,4), (0,4)→(2,2), (0,2)→(2,2)
"Why" shown after success: All reachable amounts are even, so no state contains exactly 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact capacities")
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / (0,0) / (2,0) / (0,3) / (2,3) / (0,2) / (2,1)
2. Picture C / (0,0) / (2,0) / (0,3) / (2,3) / (0,2) / (2,1)
3. Picture A / (0,0) / (2,0) / (0,3) / (2,3) / (0,2) / (2,1)
4. Picture D / (0,0) / (2,0) / (0,3) / (2,3) / (0,2)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: (0,0), (2,0), (0,3), (2,3), (0,2), (2,1) · edges: (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3), (0,3)→(2,1)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: (0,0), (2,0), (0,3), (2,3), (0,2), (2,1) · edges: (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: (0,0), (2,0), (0,3), (2,3), (0,2), (2,1) · edges: (2,0)→(0,0), (0,3)→(0,0), (2,3)→(2,0), (0,2)→(2,0), (2,3)→(0,3), (2,1)→(0,3)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: (0,0), (2,0), (0,3), (2,3), (0,2) · edges: (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`core-rule`, facet "amount-pair states")
Raw input shown:
```
With 3-liter and 5-liter jugs, what should one search node record?
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **With 3-liter and 5-liter jugs, what should one search node record?**
Choices as displayed (top to bottom):
1. A / Only the total a+b currently held across both jugs.
2. B / The complete ordered list of every fill, empty, and pour used so far.
3. C / A pair (a,b) giving the current liters in jug 1 and jug 2.
4. D / One node for capacity 3 and one node for capacity 5.
Answer key + feedback per choice (data):
- ✅ CORRECT [amount-pair] "A pair `(a,b)` giving the current liters in jug 1 and jug 2."
    feedback: Correct. The pair fully determines which moves are available next.
- ❌ [total-only] "Only the total `a+b` currently held across both jugs."
    feedback: States (3,0) and (0,3) have the same total but allow different pours and fills. (misconception: lose-per-jug-amount)
- ❌ [move-history] "The complete ordered list of every fill, empty, and pour used so far."
    feedback: Different histories reaching the same `(a,b)` have identical futures, so history is unnecessary state. (misconception: history-as-state)
- ❌ [capacities] "One node for capacity 3 and one node for capacity 5."
    feedback: Capacities are fixed limits. Search nodes must show the changing amounts inside the jugs. (misconception: capacity-as-state)
"Why" shown after success: Correct. The pair fully determines which moves are available next.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`build-sum`, facet "exact capacities")
Raw input shown:
```
jug1Capacity = 1, jug2Capacity = 2, targetCapacity = 3
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. State (1,2) holds 3 liters total.
- ❌ [near-miss] "false"
    feedback: That result follows the require target in one jug bug, not the exact picture. (misconception: require-target-in-one-jug)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)", "(1,0)", "(0,2)", "(1,2)" · edges: (0,0)→(1,0), (0,0)→(0,2), (1,0)→(1,2), (0,2)→(1,2)
"Why" shown after success: State (1,2) holds 3 liters total.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`relation-rule`, facet "one legal move edges")
Raw input shown:
```
When should two jug-state nodes share a directed edge?
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should two jug-state nodes share a directed edge?**
Choices as displayed (top to bottom):
1. A / Whenever both states hold the same total amount of water.
2. B / Connect every state directly to any target state that can eventually be reached.
3. C / Allow an edge for pouring any chosen amount, even when neither jug becomes full or empty.
4. D / When one legal fill, empty, or pour operation changes the first state into the second.
Answer key + feedback per choice (data):
- ✅ CORRECT [one-legal-move] "When one legal fill, empty, or pour operation changes the first state into the second."
    feedback: Correct. Each edge is exactly one allowed action.
- ❌ [same-total] "Whenever both states hold the same total amount of water."
    feedback: Equal totals do not guarantee a one-move transition; fills and empties can also change totals. (misconception: same-total-edge)
- ❌ [target-reachable] "Connect every state directly to any target state that can eventually be reached."
    feedback: That turns a multi-move route into one edge and hides the actual jug operations. (misconception: path-as-state-edge)
- ❌ [partial-pour] "Allow an edge for pouring any chosen amount, even when neither jug becomes full or empty."
    feedback: With unmarked jugs, a pour stops only when the source is empty or the destination is full. (misconception: allow-arbitrary-pour)
"Why" shown after success: Correct. Each edge is exactly one allowed action.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "target reachability")
Raw input shown:
```
jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 4
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / neither jug has capacity 4
2. B / legal fill and pour moves can leave 4 liters
3. C / 3+5 is not 4
4. D / by simply pouring one chosen liter out
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "legal fill and pour moves can leave 4 liters"
    feedback: Correct. Repeated fill, pour, and empty moves can leave 4 in the 5-liter jug.
- ❌ [false-capacity] "neither jug has capacity 4"
    feedback: The target can be a partial amount left after pouring. (misconception: target-must-equal-capacity)
- ❌ [false-sum] "3+5 is not 4"
    feedback: The target is an amount held, not necessarily the sum of both capacities. (misconception: use-capacity-sum)
- ❌ [true-half-pour] "by simply pouring one chosen liter out"
    feedback: The result is true, but arbitrary measured pours are not allowed. (misconception: allow-measured-pour)
"Why" shown after success: Correct. Repeated fill, pour, and empty moves can leave 4 in the 5-liter jug.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-zero`, facet "amount-pair states")
Raw input shown:
```
jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 0
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The initial state already holds zero liters.
- ❌ [near-miss] "false"
    feedback: That result follows the require at least one move bug, not the exact picture. (misconception: require-at-least-one-move)
Graph the grader requires (hidden from student): DIRECTED · nodes: "(0,0)" · edges: none
"Why" shown after success: The initial state already holds zero liters.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "target reachability")
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 6, targetCapacity = 5
```
Node-name guide shown: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / fill 6 and pour out exactly 1
2. B / combine capacities 2 and 6 to make 5
3. C / only because 5 is larger than jug 1
4. D / every reachable amount remains even
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "every reachable amount remains even"
    feedback: Correct. Every reachable amount is even.
- ❌ [true-six-minus-one] "fill 6 and pour out exactly 1"
    feedback: Unmarked jugs cannot measure an arbitrary one-liter pour. (misconception: arbitrary-pour)
- ❌ [true-combine] "combine capacities 2 and 6 to make 5"
    feedback: Legal moves preserve amounts that are multiples of 2 here. (misconception: ignore-gcd-limit)
- ❌ [false-too-large] "only because 5 is larger than jug 1"
    feedback: A target may fit in either jug; the real obstacle is reachability. (misconception: compare-only-first-jug)
"Why" shown after success: Correct. Every reachable amount is even.
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
jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 5
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Filling the 5-liter jug reaches the target in one move.; ❌ "false" — That result follows the search only pour moves bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(3,0)", "(0,5)" · edges: (0,0)→(3,0), (0,0)→(0,5)
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [total-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A pair (a,b) giving the current liters in jug 1 and jug 2.
Your choice: States (3,0) and (0,3) have the same total but allow different pours and fills.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 2
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. State (2,0) is directly reachable; amount pairs, not totals alone, define moves.; ❌ "false" — That result follows the track total only bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(2,0)", "(0,2)" · edges: (0,0)→(2,0)
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [same-total]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
When one legal fill, empty, or pour operation changes the first state into the second.
Your choice: Equal totals do not guarantee a one-move transition; fills and empties can also change totals.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. A legal pour stops when the 2-liter destination fills, leaving 1 in the source.; ❌ "false" — That result follows the require pour to empty source bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,3)", "(2,1)" · edges: (0,3)→(2,1)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [false-capacity]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
legal fill and pour moves can leave 4 liters
Your choice: The target can be a partial amount left after pouring.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
jug1Capacity = 4, jug2Capacity = 6, targetCapacity = 5
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. Legal moves preserve even amounts, so 5 cannot be measured.; ❌ "true" — That result follows the ignore gcd restriction bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(4,0)", "(0,6)", "(0,4)", "(4,2)", "(0,2)", "(2,0)" · edges: (0,0)→(4,0), (0,0)→(0,6), (4,0)→(0,4), (0,6)→(4,2), (4,2)→(0,2), (0,2)→(2,0)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [true-six-minus-one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
every reachable amount remains even
Your choice: Unmarked jugs cannot measure an arbitrary one-liter pour.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
jug1Capacity = 4, jug2Capacity = 8, targetCapacity = 3
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Unmarked jugs cannot stop a pour after an arbitrary amount to leave exactly 3.; ❌ "true" — That result follows the pour chosen one liter bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "(0,0)", "(4,0)", "(0,8)", "(4,8)", "(0,4)", "(4,4)" · edges: (0,0)→(4,0), (0,0)→(0,8), (4,0)→(0,4), (0,8)→(4,4)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Operation undone for free"; authored goal, NOT shown to student: "Use a legal operation whose reverse is not one legal operation from the chosen state.")
Everything the student sees (text):
```
H
Hunter's broken search

Hunter forgets that the listed connections have a direction.

Your main goal: Expose Hunter's mistake. Draw two graphs: first the correct graph, then Hunter's graph using the mistake.

CHOOSE THE STARTING STATE
starting state
OUTPUT
CORRECT OUTPUT
HUNTER’S OUTPUT
Drawing 1 of 2: Correct graph · Starting state: (0,0)
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
2 · Hunter's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING STATE / starting state", placeholder "Example: (0,0)", prefilled "(0,0)", readonly=true
Output labels: CORRECT OUTPUT | HUNTER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("(0,0)", "(2,0)", "(0,3)", "(2,3)", "(0,2)", "(2,1)"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,0)\",\"(0,1)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (0,1) · edges (in drawing order) (0,1)→(0,0) · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,0)","(0,1)"]` · character's graph must be exactly: UNDIRECTED · nodes: (0,0), (0,1) · edges: (0,1)—(0,0)
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `(0,0)`; ❌ curly braces → `{(0,0)}`; ✅ quoted numbers/strings → `["(0,0)"]`; ✅ spaces inside brackets → `[ "(0,0)" ]`; ❌ unquoted labels (if non-numeric) → `[(0,0)]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
HUNTER'S OUTPUT
["(0,0)","(0,1)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong jug state loaded"; authored goal, NOT shown to student: "Choose a start state other than the first label and give the two states different legal futures.")
Everything the student sees (text):
```
A
Austin's broken search

Austin runs the search from a different starting state.

Your main goal: Expose Austin's mistake. Draw two graphs: first the correct graph, then Austin's graph using the mistake.

CHOOSE THE STARTING STATE
starting state
OUTPUT
CORRECT OUTPUT
AUSTIN’S OUTPUT
Drawing 1 of 2: Correct graph · Starting state: (0,0)
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
2 · Austin's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING STATE / starting state", placeholder "Example: (0,0)", prefilled "(0,0)", readonly=true
Output labels: CORRECT OUTPUT | AUSTIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "(0,1)" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\"]","buggy":"[\"(0,1)\",\"(0,2)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (0,1), (0,2) · edges (in drawing order) (0,1)→(0,2) · start (0,0)
Grader's expected answers: correct output `["(0,0)"]` · character's output `["(0,1)","(0,2)"]` · character's graph must be exactly: DIRECTED · nodes: (0,0), (0,1), (0,2) · edges: (0,1)→(0,2)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)"]
AUSTIN'S OUTPUT
["(0,1)","(0,2)"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Only one pour tried"; authored goal, NOT shown to student: "Offer several legal operations from one state and extend an earlier option.")
Everything the student sees (text):
```
M
Madeline's broken search

Madeline keeps only the last branch it sees.

Your main goal: Expose Madeline's mistake. Draw two graphs: first the correct graph, then Madeline's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE STARTING STATE
starting state
OUTPUT
CORRECT OUTPUT
MADELINE’S OUTPUT
Drawing 1 of 2: Correct graph · Starting state: (0,0)
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
2 · Madeline's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING STATE / starting state", placeholder "Example: (0,0)", prefilled "(0,0)", readonly=true
Output labels: CORRECT OUTPUT | MADELINE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"(0,0)\",\"(0,1)\",\"(0,2)\",\"(0,3)\"]","buggy":"[\"(0,0)\",\"(0,2)\",\"(0,3)\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes (0,0), (0,1), (0,2), (0,3) · edges (in drawing order) (0,0)→(0,1), (0,0)→(0,2), (0,2)→(0,3) · start (0,0)
Grader's expected answers: correct output `["(0,0)","(0,1)","(0,2)","(0,3)"]` · character's output `["(0,0)","(0,2)","(0,3)"]` · character's graph must be exactly: DIRECTED · nodes: (0,0), (0,1), (0,2), (0,3) · edges: (0,0)→(0,1), (0,0)→(0,2), (0,2)→(0,3)
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["(0,0)","(0,1)","(0,2)","(0,3)"]
MADELINE'S OUTPUT
["(0,0)","(0,2)","(0,3)"]
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
jug1Capacity = 4, jug2Capacity = 6, targetCapacity = 5
```
Node-name guide: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(4,0)", "(0,6)", "(0,4)", "(4,2)", "(0,2)", "(2,0)" · edges: (0,0)→(4,0), (0,0)→(0,6), (4,0)→(0,4), (0,6)→(4,2), (4,2)→(0,2), (0,2)→(2,0)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for capacity 3 and one node for capacity 5.”"
    feedback if wrong: Capacities are fixed limits. Search nodes must show the changing amounts inside the jugs. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- [YES is correct] (direct-vs-reach) "(4,2) can reach (2,0) through (0,2), but the graph still has no direct (4,2)→(2,0) edge."
    feedback if wrong: Right. A multi-step route through (0,2) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(0,6) has exactly 1 outgoing direct edge."
    feedback if wrong: (0,6) has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Capacities are fixed limits. Search nodes must show the changing amounts inside the jugs. Correct node rule: A pair
(a,b)
giving the current liters in jug 1 and jug 2.
×
Right. A multi-step route through (0,2) creates reachability, not a new direct edge.
×
(0,6) has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "(0,6) can reach (0,2) through (4,2), but the graph still has no direct (0,6)→(0,2) edge."
    feedback if wrong: Right. A multi-step route through (4,2) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "(4,2) has exactly 1 outgoing direct edge."
    feedback if wrong: (4,2) has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the total `a+b` currently held across both jugs.”"
    feedback if wrong: States (3,0) and (0,3) have the same total but allow different pours and fills. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through (4,2) creates reachability, not a new direct edge.
×
(4,2) has 1 outgoing direct edge.
×
States (3,0) and (0,3) have the same total but allow different pours and fills. Correct node rule: A pair
(a,b)
giving the current liters in jug 1 and jug 2.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(0,6) and (0,6)→(4,2), so it should also contain a direct (0,0)→(4,2) edge."
    feedback if wrong: Two direct edges through (0,6) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "(2,0) has exactly 1 outgoing direct edge."
    feedback if wrong: (2,0) has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “The complete ordered list of every fill, empty, and pour used so far.”"
    feedback if wrong: Different histories reaching the same `(a,b)` have identical futures, so history is unnecessary state. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
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
jug1Capacity = 4, jug2Capacity = 8, targetCapacity = 3
```
Node-name guide: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(4,0)", "(0,8)", "(4,8)", "(0,4)", "(4,4)" · edges: (0,0)→(4,0), (0,0)→(0,8), (4,0)→(0,4), (0,8)→(4,4)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,0) has exactly 3 outgoing direct edges."
    feedback if wrong: (0,0) has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the total `a+b` currently held across both jugs.”"
    feedback if wrong: States (3,0) and (0,3) have the same total but allow different pours and fills. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- [NO is correct] (direct-vs-reach) "The correct graph has (0,0)→(4,0) and (4,0)→(0,4), so it should also contain a direct (0,0)→(0,4) edge."
    feedback if wrong: Two direct edges through (4,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 5
```
Node-name guide: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(3,0)", "(0,5)" · edges: (0,0)→(3,0), (0,0)→(0,5)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "(0,5) has exactly 1 outgoing direct edge."
    feedback if wrong: (0,5) has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for capacity 3 and one node for capacity 5.”"
    feedback if wrong: Capacities are fixed limits. Search nodes must show the changing amounts inside the jugs. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- [NO is correct] (direct-vs-reach) "(0,0) can reach (0,5), but there is no direct (0,0)→(0,5) edge."
    feedback if wrong: The mini-example lists (0,0)→(0,5) as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q4
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 2
```
Node-name guide: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,0)", "(2,0)", "(0,2)" · edges: (0,0)→(2,0)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “The complete ordered list of every fill, empty, and pour used so far.”"
    feedback if wrong: Different histories reaching the same `(a,b)` have identical futures, so history is unnecessary state. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- [YES is correct] (direct-vs-reach) "(0,0) and (2,0) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,0)→(2,0) as one direct edge.
- [YES is correct] (local-degree) "(2,0) has exactly 0 outgoing direct edges."
    feedback if wrong: (2,0) has 0 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1
```
Node-name guide: Required node-name format: Name a state (jug1Amount,jug2Amount). Example: (2,3). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "(0,3)", "(2,1)" · edges: (0,3)→(2,1)
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "(2,1) has exactly 0 outgoing direct edges."
    feedback if wrong: (2,1) has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the total `a+b` currently held across both jugs.”"
    feedback if wrong: States (3,0) and (0,3) have the same total but allow different pours and fills. Correct node rule: A pair `(a,b)` giving the current liters in jug 1 and jug 2.
- [YES is correct] (direct-vs-reach) "(0,3) and (2,1) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists (0,3)→(2,1) as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: The target must fit in one jug
Input shown:
```
REAL PROBLEM INPUT
jug1Capacity = 1, jug2Capacity = 1, targetCapacity = 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canMeasureWater(jug1Capacity, jug2Capacity, targetCapacity) {
  if (targetCapacity === 0) {
    return true;
  }
  if (targetCapacity > Math.max(jug1Capacity, jug2Capacity)) {
    return false;
  }
  function gcd(firstValue, secondValue) {
    while (secondValue) {
      [firstValue, secondValue] = [secondValue, firstValue % secondValue];
    }

    return firstValue;
  }
  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(0,0)", "(1,0)", "(0,1)", "(1,1)" · edges: (0,0)→(1,0), (0,0)→(0,1), (1,0)→(0,0), (1,0)→(1,1), (1,0)→(0,1), (0,1)→(0,0), (0,1)→(1,1), (0,1)→(1,0), (1,1)→(0,1), (1,1)→(1,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the target amount can be measured" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The gcd test should require target to equal the gcd for the shown graph.
- B It rejects targets above the larger jug instead of above the two-jug total.
- C Filling a jug directly is not an allowed move, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [single-jug-limit] "It rejects targets above the larger jug instead of above the two-jug total." — feedback: Correct. Filling both one-unit jugs gives a total of 2.
- ❌ [gcd-rule] "The gcd test should require target to equal the gcd for the shown graph." — feedback: No. The target only needs to be divisible by the gcd and fit in the total capacity.
- ❌ [pour-only] "Filling a jug directly is not an allowed move, changing this input's returned value." — feedback: No. Filling either jug is one of the allowed state transitions.
Graph proof shown in feedback: code rule "A target above the larger single capacity is rejected before state reachability matters." → changed graph "The complete reachable state graph has four amount pairs: (0,0), (1,0), (0,1), and target state (1,1), with every legal fill, empty, and pour transition shown." → boundary "Target 2 equals the combined capacity but exceeds each one-unit jug alone." → returned value "Reachable state (1,1) measures 2, yet the early rule returns false."
Output-format probes: ❌ Capitalized boolean → `False`; ❌ trailing period → `false.`
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
About your diagnosis: No. The target only needs to be divisible by the gcd and fit in the total capacity.
Code rule: A target above the larger single capacity is rejected before state reachability matters. → Changed graph: The complete reachable state graph has four amount pairs: (0,0), (1,0), (0,1), and target state (1,1), with every legal fill, empty, and pour transition shown. → Reachable boundary: Target 2 equals the combined capacity but exceeds each one-unit jug alone.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The target must fit in one jug
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: A target above the larger single capacity is rejected before state reachability matters. → Changed graph: The complete reachable state graph has four amount pairs: (0,0), (1,0), (0,1), and target state (1,1), with every legal fill, empty, and pour transition shown. → Reachable boundary: Target 2 equals the combined capacity but exceeds each one-unit jug alone. → Returned value: Reachable state (1,1) measures 2, yet the early rule returns false.
```

### S4 case 2 — `build-sum` · bug: The target must fit in one jug
Input shown:
```
REAL PROBLEM INPUT
jug1Capacity = 1, jug2Capacity = 2, targetCapacity = 3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canMeasureWater(jug1Capacity, jug2Capacity, targetCapacity) {
  if (targetCapacity === 0) {
    return true;
  }
  if (targetCapacity > Math.max(jug1Capacity, jug2Capacity)) {
    return false;
  }
  function gcd(firstValue, secondValue) {
    while (secondValue) {
      [firstValue, secondValue] = [secondValue, firstValue % secondValue];
    }

    return firstValue;
  }
  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,1)", "(1,2)" · edges: (0,0)→(1,0), (0,0)→(0,2), (0,1)→(1,1), (0,1)→(0,2), (0,1)→(0,0), (0,1)→(1,0), (0,2)→(1,2), (0,2)→(0,0), (0,2)→(1,1), (1,0)→(1,2), (1,0)→(0,0), (1,0)→(0,1), (1,1)→(1,2), (1,1)→(0,1), (1,1)→(1,0), (1,1)→(0,2), (1,2)→(0,2), (1,2)→(1,0)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the target amount can be measured" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The gcd test should require target to equal the gcd for the shown graph.
- B Filling a jug directly is not an allowed move, changing this input's returned value.
- C It rejects targets above the larger jug instead of above the two-jug total.
Diagnosis answer key + feedback:
- ✅ [single-jug-limit] "It rejects targets above the larger jug instead of above the two-jug total." — feedback: Correct. Reachable state (1,2) holds the target total 3 across both jugs; the early max-capacity check rejects it before exploring any state edge. Therefore the shown code returns false, while the real problem returns true.
- ❌ [gcd-rule] "The gcd test should require target to equal the gcd for the shown graph." — feedback: No. The target only needs to be divisible by the gcd and fit in the total capacity.
- ❌ [pour-only] "Filling a jug directly is not an allowed move, changing this input's returned value." — feedback: No. Filling either jug is one of the allowed state transitions.
Graph proof shown in feedback: code rule "A target above the larger single capacity is rejected before state reachability matters." → changed graph "Nodes: (0,0), (0,1), (0,2), (1,0), (1,1), (1,2). Direct arrows: (0,0)→(1,0); (0,0)→(0,2); (0,1)→(1,1); (0,1)→(0,2); (0,1)→(0,0); (0,1)→(1,0); (0,2)→(1,2); (0,2)→(0,0); (0,2)→(1,1); (1,0)→(1,2); (1,0)→(0,0); (1,0)→(0,1); (1,1)→(1,2); (1,1)→(0,1); (1,1)→(1,0); (1,1)→(0,2); (1,2)→(0,2); (1,2)→(1,0)." → boundary "Reachable state (1,2) holds the target total 3 across both jugs; the early max-capacity check rejects it before exploring any state edge." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The target must fit in one jug
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: A target above the larger single capacity is rejected before state reachability matters. → Changed graph: Nodes: (0,0), (0,1), (0,2), (1,0), (1,1), (1,2). Direct arrows: (0,0)→(1,0); (0,0)→(0,2); (0,1)→(1,1); (0,1)→(0,2); (0,1)→(0,0); (0,1)→(1,0); (0,2)→(1,2); (0,2)→(0,0); (0,2)→(1,1); (1,0)→(1,2); (1,0)→(0,0); (1,0)→(0,1); (1,1)→(1,2); (1,1)→(0,1); (1,1)→(1,0); (1,1)→(0,2); (1,2)→(0,2); (1,2)→(1,0). → Reachable boundary: Reachable state (1,2) holds the target total 3 across both jugs; the early max-capacity check rejects it before exploring any state edge. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

### S4 case 3 — `four-unit-target-needs-both-jugs` · bug: The target must fit in one jug
Input shown:
```
REAL PROBLEM INPUT
jug1Capacity = 1, jug2Capacity = 3, targetCapacity = 4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canMeasureWater(jug1Capacity, jug2Capacity, targetCapacity) {
  if (targetCapacity === 0) {
    return true;
  }
  if (targetCapacity > Math.max(jug1Capacity, jug2Capacity)) {
    return false;
  }
  function gcd(firstValue, secondValue) {
    while (secondValue) {
      [firstValue, secondValue] = [secondValue, firstValue % secondValue];
    }

    return firstValue;
  }
  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0,0", "0,1", "0,2", "0,3", "1,0", "1,1", "1,2", "1,3" · edges: 0,0→1,0, 0,0→0,3, 0,1→1,1, 0,1→0,3, 0,1→0,0, 0,1→1,0, 0,2→1,2, 0,2→0,3, 0,2→0,0, 0,2→1,1, 0,3→1,3, 0,3→0,0, 0,3→1,2, 1,0→1,3, 1,0→0,0, 1,0→0,1, 1,1→1,3, 1,1→0,1, 1,1→1,0, 1,1→0,2, 1,2→1,3, 1,2→0,2, 1,2→1,0, 1,2→0,3, 1,3→0,3, 1,3→1,0
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether the target amount can be measured" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A It rejects targets above the larger jug instead of above the two-jug total.
- B The gcd test should require target to equal the gcd for the shown graph.
- C Filling a jug directly is not an allowed move, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [single-jug-limit] "It rejects targets above the larger jug instead of above the two-jug total." — feedback: Correct. State (1,3) holds all four target units across both jugs, so the one-jug capacity guard deletes a valid goal. Therefore the shown code returns false, while the real problem returns true.
- ❌ [gcd-rule] "The gcd test should require target to equal the gcd for the shown graph." — feedback: No. The target only needs to be divisible by the gcd and fit in the total capacity.
- ❌ [pour-only] "Filling a jug directly is not an allowed move, changing this input's returned value." — feedback: No. Filling either jug is one of the allowed state transitions.
Graph proof shown in feedback: code rule "A target above the larger single capacity is rejected before state reachability matters." → changed graph "Nodes: 0,0, 0,1, 0,2, 0,3, 1,0, 1,1, 1,2, 1,3. Direct arrows: 0,0→1,0; 0,0→0,3; 0,1→1,1; 0,1→0,3; 0,1→0,0; 0,1→1,0; 0,2→1,2; 0,2→0,3; 0,2→0,0; 0,2→1,1; 0,3→1,3; 0,3→0,0; 0,3→1,2; 1,0→1,3; 1,0→0,0; 1,0→0,1; 1,1→1,3; 1,1→0,1; 1,1→1,0; 1,1→0,2; 1,2→1,3; 1,2→0,2; 1,2→1,0; 1,2→0,3; 1,3→0,3; 1,3→1,0." → boundary "State (1,3) holds all four target units across both jugs, so the one-jug capacity guard deletes a valid goal." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The target must fit in one jug
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: A target above the larger single capacity is rejected before state reachability matters. → Changed graph: Nodes: 0,0, 0,1, 0,2, 0,3, 1,0, 1,1, 1,2, 1,3. Direct arrows: 0,0→1,0; 0,0→0,3; 0,1→1,1; 0,1→0,3; 0,1→0,0; 0,1→1,0; 0,2→1,2; 0,2→0,3; 0,2→0,0; 0,2→1,1; 0,3→1,3; 0,3→0,0; 0,3→1,2; 1,0→1,3; 1,0→0,0; 1,0→0,1; 1,1→1,3; 1,1→0,1; 1,1→1,0; 1,1→0,2; 1,2→1,3; 1,2→0,2; 1,2→1,0; 1,2→0,3; 1,3→0,3; 1,3→1,0. → Reachable boundary: State (1,3) holds all four target units across both jugs, so the one-jug capacity guard deletes a valid goal. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```