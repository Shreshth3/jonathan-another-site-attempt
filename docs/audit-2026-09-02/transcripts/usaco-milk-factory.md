# Milk Factory (`usaco-milk-factory`) — new, directed-graph

## Problem statement (Description tab)

A milk factory has `n` processing stations, numbered `1` to `n`, connected by exactly `n - 1` conveyor belts. Each belt is ONE-WAY: `belts[i] = [a, b]` means a crate on station `a` can be sent to station `b` (never the other way). Ignoring direction, the belts connect all the stations.

The factory wants a single pickup station: a station that EVERY other station can send a crate to, possibly passing through several belts along the way. (A station can trivially reach itself.)

Return the smallest-numbered station that all other stations can reach. If no such station exists, return `-1`.

### Examples
- Example 1: input `n = 3, belts = [[1,2],[3,2]]` → output `2`. Station 1 reaches 2 directly, and station 3 reaches 2 directly. Every other station can reach station 2, so the answer is 2.
- Example 2: input `n = 3, belts = [[2,1],[2,3]]` → output `-1`. Station 1 can be reached from 2 but not from 3. Station 3 can be reached from 2 but not from 1. Station 2 cannot be reached from anyone. No station works, so the answer is -1.

### Graph rules (authored)
- Nodes: Each station numbered 1 through n.
- Edges: One arrow a → b.
- Node-name format shown in Step 1/3: Use each node's 1-based number only. Example: `2`. (pattern `^[1-9]\d*$`)
- Step 2 node-label rule: `contiguous-one` — Use numeric IDs 1, 2, 3, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "all stations")
Raw input shown:
```
n=3, belts=[[1,2],[3,2]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Stations 1 and 3 both send crates to station 2.
- ❌ [wrong] "-1"
    feedback: That follows the miss common sink bug. (misconception: miss-common-sink)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 3→2
"Why" shown after success: Stations 1 and 3 both send crates to station 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "all stations")
Raw input shown:
```
n=3, belts=[[1,2],[3,2]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 1 / 2
2. Picture A / 1 / 2 / 3
3. Picture C / 1 / 2 / 3
4. Picture D / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 1, 2, 3 · edges: 1→2, 3→2
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: DIRECTED · nodes: 1, 2 · edges: 1→2
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: DIRECTED · nodes: 1, 2, 3 · edges: 1→2
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: 1, 2, 3 · edges: 2→1, 3→2
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`node-rule`, facet "station identity")
Raw input shown:
```
What does one node represent in the factory graph?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does one node represent in the factory graph?**
Choices as displayed (top to bottom):
1. A / Each conveyor belt.
2. B / Each station numbered 1 through n.
3. C / Only stations with no outgoing belt.
4. D / Only the smallest-numbered possible pickup station.
Answer key + feedback per choice (data):
- ✅ CORRECT [station] "Each station numbered 1 through n."
    feedback: Right. Every station must be able to reach the chosen pickup node.
- ❌ [belt] "Each conveyor belt."
    feedback: Belts are directed edges between station nodes. (misconception: swaps-nodes-and-edges)
- ❌ [sink-only] "Only stations with no outgoing belt."
    feedback: All stations matter when checking whether everyone can send a crate. (misconception: drops-sources)
- ❌ [candidate] "Only the smallest-numbered possible pickup station."
    feedback: The candidate cannot be known before reachability is checked. (misconception: assumes-answer)
"Why" shown after success: Right. Every station must be able to reach the chosen pickup node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-2`, facet "station identity")
Raw input shown:
```
n=3, belts=[[2,1],[2,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 2
2. -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-1"
    feedback: Correct. Neither leaf station can send a crate to the other.
- ❌ [wrong] "2"
    feedback: That follows the treat belts as undirected bug. (misconception: treat-belts-as-undirected)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3" · edges: 2→1, 2→3
"Why" shown after success: Neither leaf station can send a crate to the other.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`edge-rule`, facet "one-way belts")
Raw input shown:
```
How should belt [a,b] be drawn?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should belt [a,b] be drawn?**
Choices as displayed (top to bottom):
1. A / A two-way line between a and b.
2. B / One arrow b → a.
3. C / An arrow from the larger number toward the smaller number.
4. D / One arrow a → b.
Answer key + feedback per choice (data):
- ✅ CORRECT [a-to-b] "One arrow a → b."
    feedback: Right. A crate can travel only in the listed direction.
- ❌ [both] "A two-way line between a and b."
    feedback: Belts are one-way, even though the underlying stations form a tree. (misconception: makes-belts-undirected)
- ❌ [reverse] "One arrow b → a."
    feedback: That reverses the input's direction. (misconception: reverses-belts)
- ❌ [toward-small] "An arrow from the larger number toward the smaller number."
    feedback: Station numbers do not decide belt direction. (misconception: derives-direction-from-label)
"Why" shown after success: Right. A crate can travel only in the listed direction.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "one-way belts")
Raw input shown:
```
n=4, belts=[[1,2],[2,3],[4,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Station 1 reaches 3 through station 2, and station 4 reaches 3 directly.
- ❌ [wrong] "2"
    feedback: That follows the check direct belts only bug. (misconception: check-direct-belts-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 2→3, 4→3
"Why" shown after success: Station 1 reaches 3 through station 2, and station 4 reaches 3 directly.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "common reachable sink")
Raw input shown:
```
n = 3, belts = [[1,2],[3,2]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For belts 1→2 and 3→2, which pickup station works?**
Choices as displayed (top to bottom):
1. A / 1
2. B / 2
3. C / 3
4. D / -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: Station 3 cannot send a crate to 1. (misconception: chooses-source)
- ❌ [wrong-2] "3"
    feedback: Station 1 cannot send a crate to 3. (misconception: reverses-belt)
- ❌ [wrong-3] "-1"
    feedback: Both other stations can reach 2. (misconception: misses-common-sink)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "common reachable sink")
Raw input shown:
```
n = 3, belts = [[2,1],[2,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For belts 2→1 and 2→3, which pickup station works?**
Choices as displayed (top to bottom):
1. A / 1
2. B / -1
3. C / 2
4. D / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "1"
    feedback: Station 3 cannot reach 1. (misconception: checks-some-stations)
- ❌ [wrong-2] "2"
    feedback: The arrows leave 2; stations 1 and 3 cannot return to it. (misconception: treats-belts-undirected)
- ❌ [wrong-3] "3"
    feedback: Station 1 cannot reach 3. (misconception: checks-some-stations)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-4`, facet "common reachable sink")
Raw input shown:
```
n=1, belts=[]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. -1
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The only station already works for every station.
- ❌ [wrong] "-1"
    feedback: That follows the require an incoming belt bug. (misconception: require-an-incoming-belt)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1" · edges: none
"Why" shown after success: The only station already works for every station.
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
n=4, belts=[[1,4],[2,4],[3,4]]
```
Remedial question: **What should the function return?** · choices shown: 4 | 1
Remedial answer key: ✅ "4" — Correct. Every other station points to 4.; ❌ "1" — That follows the choose smallest station bug.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→4, 2→4, 3→4
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [belt]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each station numbered 1 through n.
Your choice: Belts are directed edges between station nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=4, belts=[[1,2],[3,2],[2,4]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 4
Remedial answer key: ✅ "4" — Correct. All crates continue from 2 to station 4.; ❌ "2" — That follows the stop at intermediate merge bug.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 3→2, 2→4
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [both]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One arrow a → b.
Your choice: Belts are one-way, even though the underlying stations form a tree.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=3, belts=[[1,2],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 1
Remedial answer key: ✅ "3" — Correct. The arrows flow toward station 3.; ❌ "1" — That follows the reverse belts bug.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: Station 3 cannot send a crate to 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=4, belts=[[1,2],[3,2],[3,4]]
```
Remedial question: **What should the function return?** · choices shown: 2 | -1
Remedial answer key: ✅ "-1" — Correct. Station 1 can reach 2, but station 4 cannot reach that candidate.; ❌ "2" — That follows the check one branch only bug.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 3→2, 3→4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
-1
Your choice: Station 3 cannot reach 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
n=3, belts=[[3,2],[2,1]]
```
Remedial question: **What should the function return?** · choices shown: 1 | 3
Remedial answer key: ✅ "1" — Correct. Every station can follow arrows to station 1.; ❌ "3" — That follows the pick source not sink bug.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 3→2, 2→1
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "One-way factory path"; authored goal, NOT shown to student: "Make backward travel falsely create a universal station.")
Everything the student sees (text):
```
E
Ezekiel's broken search

Ezekiel turns every arrow into a two-way connection.

Your main goal: Expose Ezekiel's mistake. Draw two graphs: first the correct graph, then Ezekiel's graph using the mistake.

CHOOSE THE TEST STATION
test station
OUTPUT
CORRECT OUTPUT
EZEKIEL’S OUTPUT
Drawing 1 of 2: Correct graph · Choose test station
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
2 · Ezekiel's graph
Check my graph
→
```
Start field: label "CHOOSE THE TEST STATION / test station", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EZEKIEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1", "2", "3"): REJECTED with "A directed tree needs exactly one root with no incoming edge."
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2 · edges: 2—1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1`; ❌ curly braces → `{1}`; ❌ quoted numbers/strings → `["1"]`; ✅ spaces inside brackets → `[ 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
EZEKIEL'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `reverse-arrows` (authored level "Reversed milk routes"; authored goal, NOT shown to student: "Choose arrows whose reversal changes the candidate station.")
Everything the student sees (text):
```
K
Kiara's broken search

Kiara reverses every arrow before searching.

Your main goal: Expose Kiara's mistake. Draw two graphs: first the correct graph, then Kiara's graph using the mistake.

CHOOSE THE TEST STATION
test station
OUTPUT
CORRECT OUTPUT
KIARA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose test station
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
2 · Kiara's graph
Check my graph
→
```
Start field: label "CHOOSE THE TEST STATION / test station", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KIARA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
KIARA'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Candidate mix-up"; authored goal, NOT shown to student: "Make the declared test station differ from station 1.")
Everything the student sees (text):
```
G
Griffin's broken search

Griffin uses the wrong test station.

Your main goal: Expose Griffin's mistake. Draw two graphs: first the correct graph, then Griffin's graph using the mistake.

CHOOSE THE TEST STATION
test station
OUTPUT
CORRECT OUTPUT
GRIFFIN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose test station
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
2 · Griffin's graph
Check my graph
→
```
Start field: label "CHOOSE THE TEST STATION / test station", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | GRIFFIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
GRIFFIN'S OUTPUT
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
n=4, belts=[[1,2],[3,2],[2,4]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 3→2, 2→4
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→4, so it should also contain a direct 1→4 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 2 outgoing direct edges."
    feedback if wrong: 3 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Each conveyor belt.”"
    feedback if wrong: Belts are directed edges between station nodes. Correct node rule: Each station numbered 1 through n.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
3 has 1 outgoing direct edge.
×
Belts are directed edges between station nodes. Correct node rule: Each station numbered 1 through n.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 3→2 and 2→4, so it should also contain a direct 3→4 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only stations with no outgoing belt.”"
    feedback if wrong: All stations matter when checking whether everyone can send a crate. Correct node rule: Each station numbered 1 through n.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
2 has 1 outgoing direct edge.
×
All stations matter when checking whether everyone can send a crate. Correct node rule: Each station numbered 1 through n.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the smallest-numbered possible pickup station.”"
    feedback if wrong: The candidate cannot be known before reachability is checked. Correct node rule: Each station numbered 1 through n.
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→4, so it should also contain a direct 1→4 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 2 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
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
n=3, belts=[[1,2],[2,3]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only stations with no outgoing belt.”"
    feedback if wrong: All stations matter when checking whether everyone can send a crate. Correct node rule: Each station numbered 1 through n.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1→3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 1 outgoing direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=4, belts=[[1,2],[3,2],[3,4]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 3→2, 3→4
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→2 as one direct edge.
- [YES is correct] (local-degree) "3 has exactly 2 outgoing direct edges."
    feedback if wrong: 3 has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each conveyor belt.”"
    feedback if wrong: Belts are directed edges between station nodes. Correct node rule: Each station numbered 1 through n.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=3, belts=[[3,2],[2,1]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 3→2, 2→1
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "3 has exactly 0 outgoing direct edges."
    feedback if wrong: 3 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the smallest-numbered possible pickup station.”"
    feedback if wrong: The candidate cannot be known before reachability is checked. Correct node rule: Each station numbered 1 through n.
- [NO is correct] (direct-vs-reach) "The correct graph has 3→2 and 2→1, so it should also contain a direct 3→1 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=4, belts=[[1,4],[2,4],[3,4]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→4, 2→4, 3→4
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 and 4 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2→4 as one direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only stations with no outgoing belt.”"
    feedback if wrong: All stations matter when checking whether everyone can send a crate. Correct node rule: Each station numbered 1 through n.
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

### S4 case 1 — `authored-deep-case` · bug: Conveyor arrows are made two-way
Input shown:
```
REAL PROBLEM INPUT
n: 3
belts: [[1, 2], [3, 2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pickupStation(n, belts) {
  const numberOfNodes = n;
  const reverse = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of belts) {
    reverse[secondValue].push(firstValue);
    reverse[firstValue].push(secondValue);
  }
  for (let candidate = 1; candidate <= numberOfNodes; candidate++) {
    const visited = new Set([candidate]);
    const stack = [candidate];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of reverse[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    if (visited.size === numberOfNodes) {
      return candidate;
    }
  }
  return -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 3→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A Starting at the candidate in a reverse graph checks the wrong direction of travel.
- B Adding next[b].push(a) lets station 1 travel backward through 2 to station 3.
- C Returning the first valid station violates the smallest-numbered requirement.
Diagnosis answer key + feedback:
- ❌ [search-direction] "Starting at the candidate in a reverse graph checks the wrong direction of travel." — feedback: Starting there is correct: reverse edges reveal every station that can reach the candidate. The extra opposite edge is the bug.
- ❌ [smallest-rule] "Returning the first valid station violates the smallest-numbered requirement." — feedback: Returning the first ascending valid candidate is correct.
- ✅ [undirects-belts] "Adding next[b].push(a) lets station 1 travel backward through 2 to station 3." — feedback: Exactly. The real arrows both point into station 2.
Graph proof shown in feedback: code rule "The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions." → changed graph "The directed graph is 1→2←3, so every station can send to 2 only." → boundary "From candidate 1, the proper reverse graph stops immediately; the invented reverse relation lets the search cross 1—2—3." → returned value "The helper accepts smallest candidate 1; the real pickup station is 2."
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
About your diagnosis: Starting there is correct: reverse edges reveal every station that can reach the candidate. The extra opposite edge is the bug.
Code rule: The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions. → Changed graph: The directed graph is 1→2←3, so every station can send to 2 only. → Reachable boundary: From candidate 1, the proper reverse graph stops immediately; the invented reverse relation lets the search cross 1—2—3.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Conveyor arrows are made two-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions. → Changed graph: The directed graph is 1→2←3, so every station can send to 2 only. → Reachable boundary: From candidate 1, the proper reverse graph stops immediately; the invented reverse relation lets the search cross 1—2—3. → Returned value: The helper accepts smallest candidate 1; the real pickup station is 2.
```

### S4 case 2 — `build-2` · bug: Conveyor arrows are made two-way
Input shown:
```
REAL PROBLEM INPUT
n=3, belts=[[2,1],[2,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pickupStation(n, belts) {
  const numberOfNodes = n;
  const reverse = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of belts) {
    reverse[secondValue].push(firstValue);
    reverse[firstValue].push(secondValue);
  }
  for (let candidate = 1; candidate <= numberOfNodes; candidate++) {
    const visited = new Set([candidate]);
    const stack = [candidate];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of reverse[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    if (visited.size === numberOfNodes) {
      return candidate;
    }
  }
  return -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3" · edges: 2→1, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `-1`
Diagnosis choices as displayed:
- A Starting at the candidate in a reverse graph checks the wrong direction of travel.
- B Returning the first valid station violates the smallest-numbered requirement.
- C Adding next[b].push(a) lets station 1 travel backward through 2 to station 3.
Diagnosis answer key + feedback:
- ❌ [search-direction] "Starting at the candidate in a reverse graph checks the wrong direction of travel." — feedback: Starting there is correct: reverse edges reveal every station that can reach the candidate. The extra opposite edge is the bug.
- ❌ [smallest-rule] "Returning the first valid station violates the smallest-numbered requirement." — feedback: Returning the first ascending valid candidate is correct.
- ✅ [undirects-belts] "Adding next[b].push(a) lets station 1 travel backward through 2 to station 3." — feedback: Correct. Making belts 2→1 and 2→3 two-way invents routes from station 1 to every station, although no real gathering station exists.
Graph proof shown in feedback: code rule "The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions." → changed graph "The belt graph has arrows 2→1 and 2→3, leaving two distinct sinks." → boundary "Belts 2→1 and 2→3 have no common destination reachable from stations 1 and 3, but reverse edges connect all three." → returned value "The shown code returns 1; the real problem returns -1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Conveyor arrows are made two-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
-1
Code rule: The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions. → Changed graph: The belt graph has arrows 2→1 and 2→3, leaving two distinct sinks. → Reachable boundary: Belts 2→1 and 2→3 have no common destination reachable from stations 1 and 3, but reverse edges connect all three. → Returned value: The shown code returns 1; the real problem returns -1.
```

### S4 case 3 — `build-3` · bug: Conveyor arrows are made two-way
Input shown:
```
REAL PROBLEM INPUT
n=4, belts=[[1,2],[2,3],[4,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function pickupStation(n, belts) {
  const numberOfNodes = n;
  const reverse = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of belts) {
    reverse[secondValue].push(firstValue);
    reverse[firstValue].push(secondValue);
  }
  for (let candidate = 1; candidate <= numberOfNodes; candidate++) {
    const visited = new Set([candidate]);
    const stack = [candidate];
    while (stack.length) {
      const currentNode = stack.pop();
      for (const nextNode of reverse[currentNode]) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          stack.push(nextNode);
        }
      }
    }
    if (visited.size === numberOfNodes) {
      return candidate;
    }
  }
  return -1;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 2→3, 4→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Adding next[b].push(a) lets station 1 travel backward through 2 to station 3.
- B Starting at the candidate in a reverse graph checks the wrong direction of travel.
- C Returning the first valid station violates the smallest-numbered requirement.
Diagnosis answer key + feedback:
- ❌ [search-direction] "Starting at the candidate in a reverse graph checks the wrong direction of travel." — feedback: Starting there is correct: reverse edges reveal every station that can reach the candidate. The extra opposite edge is the bug.
- ❌ [smallest-rule] "Returning the first valid station violates the smallest-numbered requirement." — feedback: Returning the first ascending valid candidate is correct.
- ✅ [undirects-belts] "Adding next[b].push(a) lets station 1 travel backward through 2 to station 3." — feedback: Correct. Reverse edges let station 1 cross 1←2→3, but with the listed arrows only station 3 is reachable from every station.
Graph proof shown in feedback: code rule "The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions." → changed graph "The belt arrows are 1→2→3 and 4→3, so station 3 is the common destination." → boundary "Station 3 is the true sink of arrows 1→2→3 and 4→3; undirecting them wrongly makes station 1 look valid." → returned value "The shown code returns 1; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Conveyor arrows are made two-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: The search correctly starts at a candidate in the reverse graph, but each belt is inserted in both directions. → Changed graph: The belt arrows are 1→2→3 and 4→3, so station 3 is the common destination. → Reachable boundary: Station 3 is the true sink of arrows 1→2→3 and 4→3; undirecting them wrongly makes station 1 look valid. → Returned value: The shown code returns 1; the real problem returns 3.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```