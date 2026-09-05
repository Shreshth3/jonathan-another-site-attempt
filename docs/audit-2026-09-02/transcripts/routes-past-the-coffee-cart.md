# Detour for Coffee (`routes-past-the-coffee-cart`) — variant, backtracking

## Problem statement (Description tab)

A courier works in a city with `n` intersections, numbered `0` to `n - 1`. All streets are one-way: `graph[i]` is the list of intersections you can drive to directly from intersection `i`. The streets are laid out so you can never drive in a circle back to an intersection you already visited (there are no cycles).

The courier starts at the depot, intersection `0`, and must end at the customer, intersection `n - 1`. On the way, they insist on passing the coffee cart at intersection `checkpoint`.

Return a list of **all** routes from `0` to `n - 1` that pass through `checkpoint`. Each route is the list of intersections visited, in order. You may return the routes in any order. If no such route exists, return an empty list.

### Examples
- Example 1: input `graph = [[1,2],[3],[3],[]], checkpoint = 1` → output `[[0,1,3]]`. The two routes from 0 to 3 are [0,1,3] and [0,2,3]. Only [0,1,3] passes through intersection 1.
- Example 2: input `graph = [[1,2],[2,3],[3],[]], checkpoint = 2` → output `[[0,1,2,3],[0,2,3]]`. The routes from 0 to 3 are [0,1,2,3], [0,1,3], and [0,2,3]. The route [0,1,3] skips the coffee cart at 2, so only the other two count.

### Graph rules (authored)
- Nodes: Every intersection `0` through `n−1`, including the depot, cart, and customer.
- Edges: Draw `i → j` for each `j` listed in `graph[i]`.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "routes through cart")
Raw input shown:
```
roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many complete customer routes should be returned?**
Choices as displayed (top to bottom):
1. 2
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. 1 complete route reaches the customer after visiting checkpoint 1.
- ❌ [bug] "2"
    feedback: This returns every start-to-customer route without filtering for the coffee cart. (misconception: ignore-required-checkpoint)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
"Why" shown after success: 1 complete route reaches the customer after visiting checkpoint 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact directed roads")
Raw input shown:
```
roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4
2. Picture C / 0 / 1 / 2 / 3 / 4
3. Picture A / 0 / 1 / 2 / 3 / 4
4. Picture D / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 0→2, 1→3, 2→3, 3→4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 0→2, 1→3, 2→3
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 1→0, 0→2, 1→3, 2→3, 3→4
    feedback: This reverses one listed arrow. (misconception: reverse-listed-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 1→3, 2→3
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`concept-node`, facet "checkpoint identity")
Raw input shown:
```
graph = [[1,2],[3],[3,4],[5],[5],[]], checkpoint = 3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each node represent in the route picture?**
Choices as displayed (top to bottom):
1. A / Each complete depot-to-customer route that passes the cart.
2. B / Only intersection 0, the checkpoint, and intersection n−1.
3. C / Every intersection 0 through n−1, including the depot, cart, and customer.
4. D / Each listed one-way street.
Answer key + feedback per choice (data):
- ✅ CORRECT [intersections] "Every intersection `0` through `n−1`, including the depot, cart, and customer."
    feedback: Correct. Those special places are ordinary intersections with special roles.
- ❌ [valid-routes] "Each complete depot-to-customer route that passes the cart."
    feedback: Those routes are outputs assembled by walking the graph, not its starting nodes. (misconception: output-as-node)
- ❌ [special-only] "Only intersection 0, the checkpoint, and intersection `n−1`."
    feedback: Other intersections can be required steps along a valid route. (misconception: omit-intermediate)
- ❌ [streets] "Each listed one-way street."
    feedback: Streets are edges; their endpoint intersections are nodes. (misconception: street-as-node)
"Why" shown after success: Correct. Those special places are ordinary intersections with special roles.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-2`, facet "routes through cart")
Raw input shown:
```
roads=[[1],[2],[3],[]], start=0, customer=3, coffeeCart=1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many complete customer routes should be returned?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. 1 complete route reaches the customer after visiting checkpoint 1.
- ❌ [bug] "0"
    feedback: This reaches the customer after the coffee cart but forgets to append the completed route. (misconception: fail-to-record-complete-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→3
"Why" shown after success: 1 complete route reaches the customer after visiting checkpoint 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-edge`, facet "arrow direction")
Raw input shown:
```
graph = [[1,2],[3],[3,4],[5],[5],[]], checkpoint = 3
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How does graph[i] become arrows in the picture?**
Choices as displayed (top to bottom):
1. A / Draw i → j for each j listed in graph[i].
2. B / Draw j → i, because a route later returns its nodes in reverse recursion order.
3. C / Draw both i → j and j → i for every listed street.
4. D / Keep only streets touching the checkpoint, since every accepted route must visit it.
Answer key + feedback per choice (data):
- ✅ CORRECT [listed-arrows] "Draw `i → j` for each `j` listed in `graph[i]`."
    feedback: Correct. The adjacency list already gives every legal one-step direction.
- ❌ [reverse-arrows] "Draw `j → i`, because a route later returns its nodes in reverse recursion order."
    feedback: Return order does not reverse the streets. Travel follows i to each value listed in graph[i]. (misconception: reverse-adjacency)
- ❌ [two-way] "Draw both `i → j` and `j → i` for every listed street."
    feedback: The streets are one-way. Adding reverse arrows invents routes that do not exist. (misconception: make-street-undirected)
- ❌ [cart-only] "Keep only streets touching the checkpoint, since every accepted route must visit it."
    feedback: A valid route also needs streets from the depot to the cart and from the cart to the customer. (misconception: filter-edges-early)
"Why" shown after success: Correct. The adjacency list already gives every legal one-step direction.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "routes through cart")
Raw input shown:
```
roads=[[1,2],[4],[3],[],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many complete customer routes should be returned?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. 1 complete route reaches the customer after visiting checkpoint 1.
- ❌ [bug] "0"
    feedback: This reaches the customer after the coffee cart but forgets to append the completed route. (misconception: fail-to-record-complete-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→4, 2→3
"Why" shown after success: 1 complete route reaches the customer after visiting checkpoint 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "routes through cart")
Raw input shown:
```
graph = [[1,2],[3],[3,4],[5],[5],[]], checkpoint = 3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **The picture has three depot-to-customer routes; two pass intersection 3, the coffee cart. What is returned?**
Choices as displayed (top to bottom):
1. A / [[0,1,3,5],[0,2,3,5],[0,2,4,5]]
2. B / [[0,1,3],[0,2,3]]
3. C / [[0,1,3,5],[0,2,3,5]]
4. D / [[0,1,3,5]]
Answer key + feedback per choice (data):
- ✅ CORRECT [two-routes] "`[[0,1,3,5],[0,2,3,5]]`"
    feedback: Correct. Those are exactly the complete routes containing checkpoint 3.
- ❌ [all-routes] "`[[0,1,3,5],[0,2,3,5],[0,2,4,5]]`"
    feedback: The last route reaches the customer but skips checkpoint 3. (misconception: ignore-checkpoint)
- ❌ [cart-prefixes] "`[[0,1,3],[0,2,3]]`"
    feedback: A route must continue from the cart to customer 5. (misconception: stop-at-checkpoint)
- ❌ [one-route] "`[[0,1,3,5]]`"
    feedback: The separate prefix 0→2 also reaches 3 and then 5. (misconception: return-first-route)
"Why" shown after success: Correct. Those are exactly the complete routes containing checkpoint 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-counterexample`, facet "routes through cart")
Raw input shown:
```
graph = [[1,3],[2],[],[4],[]], checkpoint = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **One branch reaches checkpoint 2 but stops there; the only customer route skips 2. What route list is returned?**
Choices as displayed (top to bottom):
1. A / [[0,1,2]]
2. B / [[0,3,4]]
3. C / []
4. D / [[0,1,2],[0,3,4]]
Answer key + feedback per choice (data):
- ✅ CORRECT [empty] "`[]`"
    feedback: Correct. No complete depot-to-customer route includes the checkpoint.
- ❌ [checkpoint-prefix] "`[[0,1,2]]`"
    feedback: That path reaches the cart but never reaches the customer. (misconception: accept-incomplete-route)
- ❌ [customer-route] "`[[0,3,4]]`"
    feedback: That route reaches the customer but skips checkpoint 2. (misconception: ignore-checkpoint)
- ❌ [both] "`[[0,1,2],[0,3,4]]`"
    feedback: Neither listed path satisfies both requirements at once. (misconception: separate-requirements)
"Why" shown after success: Correct. No complete depot-to-customer route includes the checkpoint.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`case-4`, facet "routes through cart")
Raw input shown:
```
roads=[[]], start=0, customer=0, coffeeCart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many complete customer routes should be returned?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. 1 complete route reaches the customer after visiting checkpoint 0.
- ❌ [bug] "0"
    feedback: This reaches the customer after the coffee cart but forgets to append the completed route. (misconception: fail-to-record-complete-route)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0" · edges: none
"Why" shown after success: 1 complete route reaches the customer after visiting checkpoint 0.
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
roads=[[1,2],[4],[4],[],[]], start=0, customer=4, coffeeCart=1
```
Remedial question: **How many complete customer routes should be returned?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. 1 complete route reaches the customer after visiting checkpoint 1.; ❌ "2" — This returns every start-to-customer route without filtering for the coffee cart.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→4, 0→2, 2→4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [valid-routes]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every intersection 0 through n−1, including the depot, cart, and customer.
Your choice: Those routes are outputs assembled by walking the graph, not its starting nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
roads=[[1,2],[3],[3],[]], start=0, customer=3, coffeeCart=1
```
Remedial question: **How many complete customer routes should be returned?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. 1 complete route reaches the customer after visiting checkpoint 1.; ❌ "2" — This returns every start-to-customer route without filtering for the coffee cart.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [reverse-arrows]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Draw i → j for each j listed in graph[i].
Your choice: Return order does not reverse the streets. Travel follows i to each value listed in graph[i].
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
roads=[[1],[2],[],[4],[]], start=0, customer=4, coffeeCart=1
```
Remedial question: **How many complete customer routes should be returned?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. 0 complete routes reaches the customer after visiting checkpoint 1.; ❌ "1" — This saves a prefix that visits the coffee cart even though that prefix never reaches the customer.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→2, 3→4
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [all-routes]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[[0,1,3,5],[0,2,3,5]]
Your choice: The last route reaches the customer but skips checkpoint 3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
roads=[[3,1],[2],[3],[]], start=0, customer=3, coffeeCart=1
```
Remedial question: **How many complete customer routes should be returned?** · choices shown: 1 | 2
Remedial answer key: ✅ "1" — Correct. 1 complete route reaches the customer after visiting checkpoint 1.; ❌ "2" — This returns every start-to-customer route without filtering for the coffee cart.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→3, 0→1, 1→2, 2→3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [checkpoint-prefix]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[]
Your choice: That path reaches the cart but never reaches the customer.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
roads=[[1],[2],[4],[],[]], start=0, customer=4, coffeeCart=1
```
Remedial question: **How many complete customer routes should be returned?** · choices shown: 0 | 1
Remedial answer key: ✅ "1" — Correct. 1 complete route reaches the customer after visiting checkpoint 1.; ❌ "0" — This reaches the customer after the coffee cart but forgets to append the completed route.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→2, 2→4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Road signs backward"; authored goal, NOT shown to student: "Choose one-way roads where reversing every arrow blocks the coffee-cart route.")
Everything the student sees (text):
```
J
Jennifer's broken search

Jennifer reverses every arrow before searching.

Your main goal: Expose Jennifer's mistake. Draw two graphs: first the correct graph, then Jennifer's graph using the mistake. Color the coffee-cart intersection Amber in both.

CHOOSE THE START INTERSECTION
start intersection
OUTPUT
CORRECT OUTPUT
JENNIFER’S OUTPUT
Drawing 1 of 2: Correct graph · Start intersection: 0
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
2 · Jennifer's graph
Check my graph
→
```
Start field: label "CHOOSE THE START INTERSECTION / start intersection", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | JENNIFER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): REJECTED with "Color exactly one node Amber to mark the coffee cart."
Minimal starter graph evaluation: {"error":"The coffee cart must be an interior intersection, not node 0 or the last node."}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 3, 2, 1 · edges (in drawing order) 0→2, 0→3, 0→1 · start 0 · amber checkpoint 2
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 2→0, 3→0, 1→0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2, 3`; ❌ curly braces → `{0,1,2,3}`; ❌ quoted numbers/strings → `["0","1","2","3"]`; ❌ reversed order → `[3,2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 , 3 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
JENNIFER'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "Coffee on the other branch"; authored goal, NOT shown to student: "Put the coffee cart on a valid route that is not explored first.")
Everything the student sees (text):
```
M
Melanie's broken search

Melanie follows only the first available branch and never comes back.

Your main goal: Expose Melanie's mistake. Draw two graphs: first the correct graph, then Melanie's graph using the mistake. Color the coffee-cart intersection Amber in both. Edge numbers show drawing order.

CHOOSE THE START INTERSECTION
start intersection
OUTPUT
CORRECT OUTPUT
MELANIE’S OUTPUT
Drawing 1 of 2: Correct graph · Start intersection: 0
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
2 · Melanie's graph
Check my graph
→
```
Start field: label "CHOOSE THE START INTERSECTION / start intersection", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MELANIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":false,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 2, 5, 0, 3, 4, 1 · edges (in drawing order) 3→4, 5→3, 4→1, 0→1, 0→3 · start 0 · amber checkpoint 4
Grader's expected answers: correct output `[0,1,3,4]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 3→4, 5→3, 4→1, 0→1, 0→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,3,4]
MELANIE'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Cart two turns away"; authored goal, NOT shown to student: "Put the checkpoint beyond a direct neighbor so one-hop search cannot reach it.")
Everything the student sees (text):
```
A
Alex's broken search

Alex visits only the start and its direct neighboring choices.

Your main goal: Expose Alex's mistake. Draw two graphs: first the correct graph, then Alex's graph using the mistake. Color the coffee-cart intersection Amber in both.

CHOOSE THE START INTERSECTION
start intersection
OUTPUT
CORRECT OUTPUT
ALEX’S OUTPUT
Drawing 1 of 2: Correct graph · Start intersection: 0
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
2 · Alex's graph
Check my graph
→
```
Start field: label "CHOOSE THE START INTERSECTION / start intersection", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | ALEX’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":false,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 5, 0, 3, 2, 1, 4 · edges (in drawing order) 3→2, 0→3, 2→4, 0→1, 5→0, 3→4, 3→1, 5→2, 2→1 · start 0 · amber checkpoint 2
Grader's expected answers: correct output `[0,1,2,3,4]` · character's output `[0,1,3]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 3→2, 0→3, 2→4, 0→1, 5→0, 3→4, 3→1, 5→2, 2→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3,4]
ALEX'S OUTPUT
[0,1,3]
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
roads=[[1,2],[4],[4],[],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→4, 0→2, 2→4
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→4, so it should also contain a direct 0→4 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 3 outgoing direct edges."
    feedback if wrong: 0 has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Each complete depot-to-customer route that passes the cart.”"
    feedback if wrong: Those routes are outputs assembled by walking the graph, not its starting nodes. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
0 has 2 outgoing direct edges.
×
Those routes are outputs assembled by walking the graph, not its starting nodes. Correct node rule: Every intersection
0
through
n−1
, including the depot, cart, and customer.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "0 can reach 4 through 2, but the graph still has no direct 0→4 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "4 has exactly 0 outgoing direct edges."
    feedback if wrong: 4 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only intersection 0, the checkpoint, and intersection `n−1`.”"
    feedback if wrong: Other intersections can be required steps along a valid route. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
×
4 has 0 outgoing direct edges.
×
Other intersections can be required steps along a valid route. Correct node rule: Every intersection
0
through
n−1
, including the depot, cart, and customer.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→4, so it should also contain a direct 0→4 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 1 outgoing direct edge."
    feedback if wrong: 3 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Each listed one-way street.”"
    feedback if wrong: Streets are edges; their endpoint intersections are nodes. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
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
roads=[[1,2],[3],[3],[]], start=0, customer=3, coffeeCart=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→2 and 2→3, so it should also contain a direct 0→3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only intersection 0, the checkpoint, and intersection `n−1`.”"
    feedback if wrong: Other intersections can be required steps along a valid route. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
Result: PASSED

### S3 Q3
Raw input shown:
```
roads=[[1],[2],[],[4],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→2, 3→4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each complete depot-to-customer route that passes the cart.”"
    feedback if wrong: Those routes are outputs assembled by walking the graph, not its starting nodes. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0→2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
roads=[[3,1],[2],[3],[]], start=0, customer=3, coffeeCart=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→3, 0→1, 1→2, 2→3
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3 has exactly 0 outgoing direct edges."
    feedback if wrong: 3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each listed one-way street.”"
    feedback if wrong: Streets are edges; their endpoint intersections are nodes. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1→3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
roads=[[1],[2],[4],[],[]], start=0, customer=4, coffeeCart=1
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 1→2, 2→4
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 2 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only intersection 0, the checkpoint, and intersection `n−1`.”"
    feedback if wrong: Other intersections can be required steps along a valid route. Correct node rule: Every intersection `0` through `n−1`, including the depot, cart, and customer.
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

### S4 case 1 — `authored-deep-case` · bug: Returns after the first depot branch
Input shown:
```
REAL PROBLEM INPUT
graph: [[1, 2], [3], [3], []]
checkpoint: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const routes = [];
  function search(node, path, sawCheckpoint) {
    const nextPath = [...path, node];
    const hasSeenCheckpoint = sawCheckpoint || node === input.checkpoint;
    if (node === target) {
      if (hasSeenCheckpoint) {
        routes.push(nextPath);
      }
      return;
    }
    for (const next of input.graph[node]) {
      return search(next, nextPath, hasSeenCheckpoint);
    }
  }
  search(0, [], false);
  return routes;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid paths" · expected buggy output `[]` · real correct output `[[0,2,3]]`
Diagnosis choices as displayed:
- A The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value.
- B Returning inside the neighbor loop commits to route 0→1→3 and never tries the checkpoint branch through 2.
- C The target is computed as the wrong graph index, and that graph-level change determines the returned value.
Diagnosis answer key + feedback:
- ✅ [return-in-loop] "Returning inside the neighbor loop commits to route 0→1→3 and never tries the checkpoint branch through 2." — feedback: Correct. The first branch is valid graph travel but misses the required checkpoint.
- ❌ [checkpoint-global] "The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value." — feedback: The flag is a separate function argument for each call, so it does not leak.
- ❌ [target-off-by-one] "The target is computed as the wrong graph index, and that graph-level change determines the returned value." — feedback: For four adjacency lists, length minus one correctly names target 3.
Graph proof shown in feedback: code rule "The first recursive call is immediately returned from the neighbor loop." → changed graph "Node 0 has two routes to target 3; only 0→2→3 contains checkpoint 2." → boundary "The useful route is the second outgoing branch of node 0." → returned value "Only the non-checkpoint branch is examined, leaving the returned path list empty."
Output-format probes: ✅ spaces after commas → `[]`; ✅ unquoted strings in array → `[]`; ✅ quoted numbers in array → `[]`; ❌ trailing period → `[].`
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
About your diagnosis: The flag is a separate function argument for each call, so it does not leak.
Code rule: The first recursive call is immediately returned from the neighbor loop. → Changed graph: Node 0 has two routes to target 3; only 0→2→3 contains checkpoint 2. → Reachable boundary: The useful route is the second outgoing branch of node 0.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns after the first depot branch
INCORRECT OUTPUT
[]
CORRECT OUTPUT
[[0,2,3]]
Code rule: The first recursive call is immediately returned from the neighbor loop. → Changed graph: Node 0 has two routes to target 3; only 0→2→3 contains checkpoint 2. → Reachable boundary: The useful route is the second outgoing branch of node 0. → Returned value: Only the non-checkpoint branch is examined, leaving the returned path list empty.
```

### S4 case 2 — `case-1` · bug: Returns after the first depot branch
Input shown:
```
REAL PROBLEM INPUT
roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const routes = [];
  function search(node, path, sawCheckpoint) {
    const nextPath = [...path, node];
    const hasSeenCheckpoint = sawCheckpoint || node === input.checkpoint;
    if (node === target) {
      if (hasSeenCheckpoint) {
        routes.push(nextPath);
      }
      return;
    }
    for (const next of input.graph[node]) {
      return search(next, nextPath, hasSeenCheckpoint);
    }
  }
  search(0, [], false);
  return routes;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→3, 3→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid paths" · expected buggy output `[]` · real correct output `[[0,2,3,4]]`
Diagnosis choices as displayed:
- A The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value.
- B The target is computed as the wrong graph index, and that graph-level change determines the returned value.
- C Returning inside node 0's loop commits to 0→1→3→4 and never tries the checkpoint branch 0→2→3→4.
Diagnosis answer key + feedback:
- ✅ [return-in-loop] "Returning inside node 0's loop commits to 0→1→3→4 and never tries the checkpoint branch 0→2→3→4." — feedback: Exactly. The first route reaches the target but misses coffee cart 2; the skipped second route is the only valid result.
- ❌ [checkpoint-global] "The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value." — feedback: The flag is a separate function argument for each call, so it does not leak.
- ❌ [target-off-by-one] "The target is computed as the wrong graph index, and that graph-level change determines the returned value." — feedback: There are five adjacency lists, so length minus one correctly names target 4.
Graph proof shown in feedback: code rule "The return inside node 0's neighbor loop explores only its first outgoing branch." → changed graph "Two routes reach target 4: 0→1→3→4 and 0→2→3→4; only the second includes cart 2." → boundary "The required coffee-cart route is node 0's second branch." → returned value "The code returns []; the correct route list is [[0,2,3,4]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns after the first depot branch
INCORRECT OUTPUT
[]
CORRECT OUTPUT
[[0,2,3,4]]
Code rule: The return inside node 0's neighbor loop explores only its first outgoing branch. → Changed graph: Two routes reach target 4: 0→1→3→4 and 0→2→3→4; only the second includes cart 2. → Reachable boundary: The required coffee-cart route is node 0's second branch. → Returned value: The code returns []; the correct route list is [[0,2,3,4]].
```

### S4 case 3 — `case-2` · bug: Returns after the first depot branch
Input shown:
```
REAL PROBLEM INPUT
roads=[[1,2],[4],[3],[4],[]], start=0, customer=4, coffeeCart=2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const target = input.graph.length - 1;
  const routes = [];
  function search(node, path, sawCheckpoint) {
    const nextPath = [...path, node];
    const hasSeenCheckpoint = sawCheckpoint || node === input.checkpoint;
    if (node === target) {
      if (hasSeenCheckpoint) {
        routes.push(nextPath);
      }
      return;
    }
    for (const next of input.graph[node]) {
      return search(next, nextPath, hasSeenCheckpoint);
    }
  }
  search(0, [], false);
  return routes;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→4, 2→3, 3→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid paths" · expected buggy output `[]` · real correct output `[[0,2,3,4]]`
Diagnosis choices as displayed:
- A Returning from the first neighbor of 0 commits to short route 0→1→4 and skips checkpoint route 0→2→3→4.
- B The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value.
- C The target is computed as the wrong graph index, and that graph-level change determines the returned value.
Diagnosis answer key + feedback:
- ✅ [return-in-loop] "Returning from the first neighbor of 0 commits to short route 0→1→4 and skips checkpoint route 0→2→3→4." — feedback: Exactly. The first completed route lacks cart 2, while the unvisited second branch contains it.
- ❌ [checkpoint-global] "The checkpoint flag is shared globally and leaks from one path into another, changing this input's returned value." — feedback: The flag is a separate function argument for each call, so it does not leak.
- ❌ [target-off-by-one] "The target is computed as the wrong graph index, and that graph-level change determines the returned value." — feedback: Five adjacency lists correctly make node 4 the target.
Graph proof shown in feedback: code rule "The neighbor-loop return prevents node 0 from exploring neighbor 2." → changed graph "Route 0→1→4 misses checkpoint 2; route 0→2→3→4 includes it." → boundary "The valid route begins with the second outgoing arrow 0→2." → returned value "The code returns []; the real result is [[0,2,3,4]]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Returns after the first depot branch
INCORRECT OUTPUT
[]
CORRECT OUTPUT
[[0,2,3,4]]
Code rule: The neighbor-loop return prevents node 0 from exploring neighbor 2. → Changed graph: Route 0→1→4 misses checkpoint 2; route 0→2→3→4 includes it. → Reachable boundary: The valid route begins with the second outgoing arrow 0→2. → Returned value: The code returns []; the real result is [[0,2,3,4]].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```