# Hiking Around the Flood (`flooded-campsite-trails`) — variant, undirected-graph

## Problem statement (Description tab)

A national park has `n` campsites, numbered `0` to `n - 1`, connected by two-way trails. `trails[i] = [a, b]` means you can hike directly between campsites `a` and `b`.

A storm has flooded some campsites. The list `flooded` contains the numbers of the flooded campsites, and you cannot set foot in a flooded campsite at all, not even to pass through.

Return `true` if you can hike from campsite `start` to campsite `finish` while stepping only on dry campsites, and `false` otherwise. If `start` or `finish` is itself flooded, return `false`.

### Examples
- Example 1: input `n = 5, trails = [[0,1],[1,2],[2,4],[0,3],[3,4]], flooded = [2], start = 0, finish = 4` → output `true`. The route 0 -> 1 -> 2 -> 4 is blocked because campsite 2 is flooded, but the route 0 -> 3 -> 4 stays dry the whole way.
- Example 2: input `n = 4, trails = [[0,1],[1,3],[0,2],[2,3]], flooded = [1,2], start = 0, finish = 3` → output `false`. Every trail out of campsite 0 leads to a flooded campsite (1 or 2), so there is no dry route to campsite 3.

### Graph rules (authored)
- Nodes: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
- Edges: A two-way edge a—b; traversal may use it only when the next campsite is dry.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact trails")
Raw input shown:
```
n=4, trails=[[0,1],[1,3],[0,2],[2,3]], flooded=[1], start=0, finish=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Can the start reach the finish without entering a flooded campsite?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A complete dry path connects start to finish.
- ❌ [bug] "false"
    feedback: This returns after exploring a flooded or dead branch instead of trying the remaining dry branch. (misconception: return-after-first-branch)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—3, 0—2, 2—3
"Why" shown after success: A complete dry path connects start to finish.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "campsite identity")
Raw input shown:
```
n=4, trails=[[0,1],[1,2],[2,3]], flooded=[2], start=0, finish=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Can the start reach the finish without entering a flooded campsite?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Every possible route is cut off, absent, or enters a flooded campsite.
- ❌ [bug] "true"
    feedback: This searches the original graph without removing the flooded campsite that cuts the route. (misconception: ignore-flooded-set)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: Every possible route is cut off, absent, or enters a flooded campsite.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact trails")
Raw input shown:
```
n=4, trails=[[0,1],[1,3],[0,2],[2,3]], flooded=[1], start=0, finish=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3
2. Picture C / 0 / 1 / 2 / 3
3. Picture D / 0 / 1 / 2
4. Picture A / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—3, 0—2, 2—3
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—3, 0—2
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 1→3, 0→2, 2→3
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 0—2
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-node`, facet "campsite identity")
Raw input shown:
```
n = 6, trails = [[0,3],[3,4],[4,5],[0,1],[1,2],[2,5]], flooded = [4], start = 0, finish = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which campsites belong in the trail graph?**
Choices as displayed (top to bottom):
1. A / Only flooded campsites, because those are the places that can stop a trip.
2. B / Only campsites on the shortest-looking route from start to finish.
3. C / Every campsite 0 through n−1, with flooded status marked on the affected nodes.
4. D / One node for all flooded campsites and one node for all dry campsites.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-camps] "Every campsite `0` through `n−1`, with flooded status marked on the affected nodes."
    feedback: Correct. Flooded camps remain known locations, but the search must not enter them.
- ❌ [flooded-only] "Only flooded campsites, because those are the places that can stop a trip."
    feedback: Dry campsites are the places the route actually explores, so they must be the graph nodes too. (misconception: model-obstacles-only)
- ❌ [route-only] "Only campsites on the shortest-looking route from start to finish."
    feedback: A longer dry detour may be the only valid route, so all campsites must remain available. (misconception: keep-shortest-only)
- ❌ [flood-zones] "One node for all flooded campsites and one node for all dry campsites."
    feedback: Different dry camps may be disconnected. Combining by status invents connections. (misconception: collapse-by-status)
"Why" shown after success: Correct. Flooded camps remain known locations, but the search must not enter them.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`case-3`, facet "two-way trails")
Raw input shown:
```
n=4, trails=[[0,1],[1,2],[0,3]], flooded=[1], start=0, finish=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Can the start reach the finish without entering a flooded campsite?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A complete dry path connects start to finish.
- ❌ [bug] "false"
    feedback: This returns after exploring a flooded or dead branch instead of trying the remaining dry branch. (misconception: return-after-first-branch)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 0—3
"Why" shown after success: A complete dry path connects start to finish.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-edge`, facet "two-way trails")
Raw input shown:
```
n = 6, trails = [[0,3],[3,4],[4,5],[0,1],[1,2],[2,5]], flooded = [4], start = 0, finish = 5
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should one listed trail [a,b] appear?**
Choices as displayed (top to bottom):
1. A / An arrow a→b because a is listed first.
2. B / Delete every trail touching a campsite next to a flooded campsite.
3. C / Join any two dry campsites if some route connects them through flooded camps.
4. D / A two-way edge a—b; traversal may use it only when the next campsite is dry.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way-trail] "A two-way edge a—b; traversal may use it only when the next campsite is dry."
    feedback: Correct. The trail is undirected, while flooding blocks entry to a node.
- ❌ [ordered-trail] "An arrow a→b because a is listed first."
    feedback: Trail pairs have no travel direction; they can be walked both ways. (misconception: array-order-direction)
- ❌ [delete-near-flood] "Delete every trail touching a campsite next to a flooded campsite."
    feedback: Only entering the flooded campsite is forbidden. Nearby dry trails still work. (misconception: flood-spreads)
- ❌ [dry-shortcut] "Join any two dry campsites if some route connects them through flooded camps."
    feedback: A route through a flooded node is unusable; it cannot become a shortcut edge. (misconception: path-through-blocked)
"Why" shown after success: Correct. The trail is undirected, while flooding blocks entry to a node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "avoid flooded nodes")
Raw input shown:
```
n=6, trails=[[0,3],[3,4],[4,5],[0,1],[1,2],[2,5]], flooded=[4], start=0, finish=5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Can the hiker reach the finish without entering a flooded campsite?**
Choices as displayed (top to bottom):
1. A / false — DFS first reaches flooded campsite 4
2. B / false — one flooded campsite invalidates the whole map
3. C / false — campsite 5 touches a route through flooded 4
4. D / true — use 0→1→2→5
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "true — use 0→1→2→5"
    feedback: Correct. The dry branch reaches campsite 5.
- ❌ [blocked-first] "false — DFS first reaches flooded campsite 4"
    feedback: This returns after one failed branch instead of trying the other neighbor of 0. (misconception: return-after-first-branch)
- ❌ [any-flood] "false — one flooded campsite invalidates the whole map"
    feedback: Flooding removes that node, not every trail elsewhere. (misconception: globalize-local-block)
- ❌ [avoid-finish] "false — campsite 5 touches a route through flooded 4"
    feedback: A node may touch a flooded branch and still be reached by a separate dry branch. (misconception: taint-neighbor-of-flood)
"Why" shown after success: Correct. The dry branch reaches campsite 5.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "avoid flooded nodes")
Raw input shown:
```
n=1, trails=[], flooded=[], start=0, finish=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Can the start reach the finish without entering a flooded campsite?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A complete dry path connects start to finish.
- ❌ [bug] "false"
    feedback: This wrongly requires at least one trail even when start already equals finish. (misconception: require-nonempty-path)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: A complete dry path connects start to finish.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "avoid flooded nodes")
Raw input shown:
```
n=4, trails=[[0,1],[1,2],[0,3],[3,2]], flooded=[2], start=0, finish=2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should the function return when the finish campsite itself is flooded?**
Choices as displayed (top to bottom):
1. A / true — check finish before checking flooded
2. B / true — two graph paths reach campsite 2
3. C / true — campsite 1 is dry
4. D / false — the finish cannot be entered
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "false — the finish cannot be entered"
    feedback: Correct. Reaching a forbidden node is not a valid trip.
- ❌ [goal-first] "true — check finish before checking flooded"
    feedback: This uses the wrong base-case order and accepts a forbidden destination. (misconception: goal-before-blocked-check)
- ❌ [path-exists] "true — two graph paths reach campsite 2"
    feedback: Both routes end by entering the flooded finish. (misconception: ignore-restrictions)
- ❌ [one-dry-parent] "true — campsite 1 is dry"
    feedback: A dry predecessor does not make its flooded neighbor enterable. (misconception: check-parent-not-destination)
"Why" shown after success: Correct. Reaching a forbidden node is not a valid trip.
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
n=5, trails=[[0,1],[1,4],[0,2],[2,3],[3,4]], flooded=[1], start=0, finish=4
```
Remedial question: **Can the start reach the finish without entering a flooded campsite?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. A complete dry path connects start to finish.; ❌ "false" — This returns after exploring a flooded or dead branch instead of trying the remaining dry branch.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—4, 0—2, 2—3, 3—4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [flooded-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every campsite 0 through n−1, with flooded status marked on the affected nodes.
Your choice: Dry campsites are the places the route actually explores, so they must be the graph nodes too.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
n=4, trails=[[0,1],[1,2],[2,3]], flooded=[1], start=0, finish=3
```
Remedial question: **Can the start reach the finish without entering a flooded campsite?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. Every possible route is cut off, absent, or enters a flooded campsite.; ❌ "true" — This searches the original graph without removing the flooded campsite that cuts the route.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [ordered-trail]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way edge a—b; traversal may use it only when the next campsite is dry.
Your choice: Trail pairs have no travel direction; they can be walked both ways.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
n=3, trails=[], flooded=[], start=0, finish=2
```
Remedial question: **Can the start reach the finish without entering a flooded campsite?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Every possible route is cut off, absent, or enters a flooded campsite.; ❌ "true" — This assumes that having no flooded campsites guarantees reachability, even with no trail to the finish.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [blocked-first]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
true — use 0→1→2→5
Your choice: This returns after one failed branch instead of trying the other neighbor of 0.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
n=4, trails=[[0,1],[1,3],[0,2]], flooded=[2], start=0, finish=3
```
Remedial question: **Can the start reach the finish without entering a flooded campsite?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. A complete dry path connects start to finish.; ❌ "false" — This returns after exploring a flooded or dead branch instead of trying the remaining dry branch.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—3, 0—2
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [goal-first]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
false — the finish cannot be entered
Your choice: This uses the wrong base-case order and accepts a forbidden destination.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
n=5, trails=[[0,4],[0,1],[0,2],[0,3]], flooded=[3], start=0, finish=4
```
Remedial question: **Can the start reach the finish without entering a flooded campsite?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. A complete dry path connects start to finish.; ❌ "false" — This returns after exploring a flooded or dead branch instead of trying the remaining dry branch.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—4, 0—1, 0—2, 0—3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Wrong trailhead"; authored goal, NOT shown to student: "Separate the listed first campsite from the chosen dry trailhead.")
Everything the student sees (text):
```
S
Stephanie's broken search

Stephanie runs the search from a different starting campsite.

Your main goal: Expose Stephanie's mistake. Draw two graphs: first the correct graph, then Stephanie's graph using the mistake.

CHOOSE THE STARTING CAMPSITE
starting campsite
OUTPUT
CORRECT OUTPUT
STEPHANIE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting campsite
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
2 · Stephanie's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CAMPSITE / starting campsite", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | STEPHANIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3"): accepted
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
STEPHANIE'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-one-way` (authored level "One-way hiking trail"; authored goal, NOT shown to student: "Write a trail in reverse order so treating it as an arrow blocks the dry route.")
Everything the student sees (text):
```
A
Alejandro's broken search

Alejandro mistakes undirected links for arrows.

Your main goal: Expose Alejandro's mistake. Draw two graphs: first the correct graph, then Alejandro's graph using the mistake.

CHOOSE THE STARTING CAMPSITE
starting campsite
OUTPUT
CORRECT OUTPUT
ALEJANDRO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting campsite
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
2 · Alejandro's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CAMPSITE / starting campsite", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALEJANDRO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
ALEJANDRO'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Flooded dead end"; authored goal, NOT shown to student: "Put a flooded or dead branch before a second branch that reaches the finish.")
Everything the student sees (text):
```
N
Nicole's broken search

Nicole stops the whole search when its first branch ends.

Your main goal: Expose Nicole's mistake. Draw two graphs: first the correct graph, then Nicole's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE STARTING CAMPSITE
starting campsite
OUTPUT
CORRECT OUTPUT
NICOLE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose starting campsite
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
2 · Nicole's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING CAMPSITE / starting campsite", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NICOLE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
NICOLE'S OUTPUT
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
n=5, trails=[[0,1],[1,4],[0,2],[2,3],[3,4]], flooded=[1], start=0, finish=4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—4, 0—2, 2—3, 3—4
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—3 and 3—4, so it should also contain a direct 2—4 edge."
    feedback if wrong: Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for all flooded campsites and one node for all dry campsites.”"
    feedback if wrong: Different dry camps may be disconnected. Combining by status invents connections. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
0 has 2 direct neighbors.
×
Different dry camps may be disconnected. Combining by status invents connections. Correct node rule: Every campsite
0
through
n−1
, with flooded status marked on the affected nodes.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only flooded campsites, because those are the places that can stop a trip.”"
    feedback if wrong: Dry campsites are the places the route actually explores, so they must be the graph nodes too. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—1, so it should also contain a direct 2—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "4 has exactly 3 direct neighbors."
    feedback if wrong: 4 has 2 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Dry campsites are the places the route actually explores, so they must be the graph nodes too. Correct node rule: Every campsite
0
through
n−1
, with flooded status marked on the affected nodes.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
4 has 2 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only campsites on the shortest-looking route from start to finish.”"
    feedback if wrong: A longer dry detour may be the only valid route, so all campsites must remain available. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 4, but the graph still has no direct 1—3 edge."
    feedback if wrong: Right. A multi-step route through 4 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 2 direct neighbors.
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
n=4, trails=[[0,1],[1,2],[2,3]], flooded=[1], start=0, finish=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 can reach 0 through 1, but the graph still has no direct 2—0 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 2 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only flooded campsites, because those are the places that can stop a trip.”"
    feedback if wrong: Dry campsites are the places the route actually explores, so they must be the graph nodes too. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=3, trails=[], flooded=[], start=0, finish=2
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "There is no direct edge between 0 and 1; merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "2 has exactly 0 direct neighbors."
    feedback if wrong: 2 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for all flooded campsites and one node for all dry campsites.”"
    feedback if wrong: Different dry camps may be disconnected. Combining by status invents connections. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=4, trails=[[0,1],[1,3],[0,2]], flooded=[2], start=0, finish=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—3, 0—2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only campsites on the shortest-looking route from start to finish.”"
    feedback if wrong: A longer dry detour may be the only valid route, so all campsites must remain available. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
- [NO is correct] (direct-vs-reach) "The correct graph has 0—1 and 1—3, so it should also contain a direct 0—3 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 3 direct neighbors."
    feedback if wrong: 0 has 2 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=5, trails=[[0,4],[0,1],[0,2],[0,3]], flooded=[3], start=0, finish=4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—4, 0—1, 0—2, 0—3
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only flooded campsites, because those are the places that can stop a trip.”"
    feedback if wrong: Dry campsites are the places the route actually explores, so they must be the graph nodes too. Correct node rule: Every campsite `0` through `n−1`, with flooded status marked on the affected nodes.
- [YES is correct] (direct-vs-reach) "4 can reach 1 through 0, but the graph still has no direct 4—1 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Accepts a flooded destination
Input shown:
```
REAL PROBLEM INPUT
n: 3
trails: [[0, 1], [1, 2]]
flooded: [2]
start: 0
finish: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.trails) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const flooded = new Set(input.flooded);
  const visited = new Set();
  function canReach(node) {
    if (node === input.finish) {
      return true;
    }
    if (flooded.has(node) || visited.has(node)) {
      return false;
    }
    visited.add(node);
    for (const next of graph[node]) {
      if (canReach(next)) {
        return true;
      }
    }
    return false;
  }
  return canReach(input.start);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The function returns false after the first dead-end and never tries another trail on the shown input.
- B The code treats each trail as one-way, and that graph-level change determines the returned value.
- C The finish check runs before the flooded check, so stepping onto flooded node 2 is accepted.
Diagnosis answer key + feedback:
- ✅ [base-case-order] "The finish check runs before the flooded check, so stepping onto flooded node 2 is accepted." — feedback: Correct. A forbidden destination is still forbidden.
- ❌ [no-backtracking] "The function returns false after the first dead-end and never tries another trail on the shown input." — feedback: The loop continues after false calls; this input has only one route anyway.
- ❌ [directed-trails] "The code treats each trail as one-way, and that graph-level change determines the returned value." — feedback: Both adjacency directions are stored.
Graph proof shown in feedback: code rule "Arrival at finish returns true before node restrictions are examined." → changed graph "The only route is 0—1—2, and finish node 2 is flooded." → boundary "The target itself is the forbidden node." → returned value "The code returns true for an illegal hike; the correct result is false."
Output-format probes: ❌ Capitalized boolean → `True`; ❌ trailing period → `true.`
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
About your diagnosis: The loop continues after false calls; this input has only one route anyway.
Code rule: Arrival at finish returns true before node restrictions are examined. → Changed graph: The only route is 0—1—2, and finish node 2 is flooded. → Reachable boundary: The target itself is the forbidden node.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Accepts a flooded destination
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Arrival at finish returns true before node restrictions are examined. → Changed graph: The only route is 0—1—2, and finish node 2 is flooded. → Reachable boundary: The target itself is the forbidden node. → Returned value: The code returns true for an illegal hike; the correct result is false.
```

### S4 case 2 — `flooded-finish-after-safe-branch` · bug: Accepts a flooded destination
Input shown:
```
REAL PROBLEM INPUT
n: 5
trails: [[4, 3], [3, 0], [4, 1], [1, 2]]
flooded: [0, 2]
start: 4
finish: 0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.trails) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const flooded = new Set(input.flooded);
  const visited = new Set();
  function canReach(node) {
    if (node === input.finish) {
      return true;
    }
    if (flooded.has(node) || visited.has(node)) {
      return false;
    }
    visited.add(node);
    for (const next of graph[node]) {
      if (canReach(next)) {
        return true;
      }
    }
    return false;
  }
  return canReach(input.start);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 4—3, 3—0, 4—1, 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The finish check accepts flooded node 0 before the flooded-node guard can reject it.
- B The search stops forever after exploring flooded dead end 2.
- C The code stores 4—3 as one-way and cannot return toward node 4.
Diagnosis answer key + feedback:
- ✅ [base-case-order] "The finish check accepts flooded node 0 before the flooded-node guard can reject it." — feedback: Correct. Reaching finish 0 is not legal because 0 is flooded.
- ❌ [no-backtracking] "The search stops forever after exploring flooded dead end 2." — feedback: The loop can continue after a false branch; the illegal success comes from finish 0.
- ❌ [directed-trails] "The code stores 4—3 as one-way and cannot return toward node 4." — feedback: Every trail is stored in both directions.
Graph proof shown in feedback: code rule "Equality with finish is tested before membership in flooded." → changed graph "Start 4 branches to 1—2 and 3—0; both leaves 2 and finish 0 are flooded." → boundary "The only finish node is itself forbidden." → returned value "The code accepts route 4—3—0 and returns true; the correct answer is false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Accepts a flooded destination
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Equality with finish is tested before membership in flooded. → Changed graph: Start 4 branches to 1—2 and 3—0; both leaves 2 and finish 0 are flooded. → Reachable boundary: The only finish node is itself forbidden. → Returned value: The code accepts route 4—3—0 and returns true; the correct answer is false.
```

### S4 case 3 — `flooded-finish-beyond-cycle` · bug: Accepts a flooded destination
Input shown:
```
REAL PROBLEM INPUT
n: 6
trails: [[0, 1], [1, 2], [2, 0], [2, 5], [0, 3], [3, 4]]
flooded: [4, 5]
start: 0
finish: 5
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.trails) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const flooded = new Set(input.flooded);
  const visited = new Set();
  function canReach(node) {
    if (node === input.finish) {
      return true;
    }
    if (flooded.has(node) || visited.has(node)) {
      return false;
    }
    visited.add(node);
    for (const next of graph[node]) {
      if (canReach(next)) {
        return true;
      }
    }
    return false;
  }
  return canReach(input.start);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 1—2, 2—0, 2—5, 0—3, 3—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The cycle makes recursion loop forever because nodes are never marked seen.
- B The search walks through the safe cycle and accepts flooded finish 5 before checking its restriction.
- C The trail 2—5 is stored only from 2 to 5, changing reachability.
Diagnosis answer key + feedback:
- ✅ [base-case-order] "The search walks through the safe cycle and accepts flooded finish 5 before checking its restriction." — feedback: Correct. The cycle is harmless; the early finish check makes flooded node 5 an illegal success.
- ❌ [no-backtracking] "The cycle makes recursion loop forever because nodes are never marked seen." — feedback: Safe nodes enter seen before their neighbors are explored, so the cycle terminates.
- ❌ [directed-trails] "The trail 2—5 is stored only from 2 to 5, changing reachability." — feedback: Both directions are stored; direction is not the bug.
Graph proof shown in feedback: code rule "The finish test runs before the flooded test." → changed graph "Safe nodes 0,1,2 form a cycle; 2 touches flooded finish 5, while branch 0—3 ends at flooded 4." → boundary "A safe region has an edge into a forbidden destination." → returned value "The shown code returns true on arrival at 5; legal reachability returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Accepts a flooded destination
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: The finish test runs before the flooded test. → Changed graph: Safe nodes 0,1,2 form a cycle; 2 touches flooded finish 5, while branch 0—3 ends at flooded 4. → Reachable boundary: A safe region has an edge into a forbidden destination. → Returned value: The shown code returns true on arrival at 5; legal reachability returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```