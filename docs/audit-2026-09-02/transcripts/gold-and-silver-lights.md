# Gold and Silver Lights (`gold-and-silver-lights`) — variant, undirected-graph

## Problem statement (Description tab)

You are decorating with a set of `n` connected light bulbs, numbered `0` to `n - 1`. The list `wires` contains pairs `[a, b]` meaning bulbs `a` and `b` are joined by a wire. There are exactly `n - 1` wires and every bulb is connected to the rest, so the wiring forms a tree: there is exactly one way to travel between any two bulbs, and there are no loops.

You will paint every bulb either **gold** or **silver**, following two rules:

1. Bulb `0` must be gold.
2. Any two bulbs joined by a wire must be different colors.

Because the wiring is a tree, there is exactly one way to paint everything. Return how many bulbs end up **gold**.

### Examples
- Example 1: input `n = 4, wires = [[0,1],[0,2],[1,3]]` → output `2`. Bulb 0 is gold, so bulbs 1 and 2 must be silver. Bulb 3 is wired to silver bulb 1, so bulb 3 is gold. Gold bulbs: 0 and 3, which is 2.
- Example 2: input `n = 5, wires = [[0,1],[1,2],[2,3],[3,4]]` → output `3`. The bulbs form a chain, so the colors alternate: gold, silver, gold, silver, gold. Bulbs 0, 2, and 4 are gold, which is 3.

### Graph rules (authored)
- Nodes: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- Edges: A two-way edge whose endpoints must receive opposite colors.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact wires")
Raw input shown:
```
n=5, wires=[[0,1],[1,2],[1,3],[3,4]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many bulbs are an even number of wires from bulb 0?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The unique tree distances put 3 bulbs at even distance, including bulb 0 at distance 0.
- ❌ [bug] "2"
    feedback: This forgets that the starting bulb has even distance 0 and is gold. (misconception: exclude-distance-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 1—3, 3—4
"Why" shown after success: The unique tree distances put 3 bulbs at even distance, including bulb 0 at distance 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact wires")
Raw input shown:
```
n=5, wires=[[0,1],[1,2],[1,3],[3,4]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / 0 / 1 / 2 / 3 / 4
2. Picture B / 0 / 1 / 2 / 3 / 4
3. Picture C / 0 / 1 / 2 / 3 / 4
4. Picture D / 0 / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2, 1—3, 3—4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2, 1—3
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 1→2, 1→3, 3→4
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—2, 1—3
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`case-2`, facet "bulb identity")
Raw input shown:
```
n=4, wires=[[0,1],[1,2],[2,3]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many bulbs are an even number of wires from bulb 0?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The unique tree distances put 2 bulbs at even distance, including bulb 0 at distance 0.
- ❌ [bug] "1"
    feedback: This forgets that the starting bulb has even distance 0 and is gold. (misconception: exclude-distance-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: The unique tree distances put 2 bulbs at even distance, including bulb 0 at distance 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-node`, facet "bulb identity")
Raw input shown:
```
n = 7, wires = [[0,1],[0,2],[1,3],[1,4],[4,5],[2,6]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What gets one node in the light display?**
Choices as displayed (top to bottom):
1. A / Only bulbs that end up gold, because those are the ones counted.
2. B / Each bulb 0 through n−1, before choosing its gold or silver color.
3. C / Two nodes total: one gold node and one silver node.
4. D / One node for each connected group of wired bulbs.
Answer key + feedback per choice (data):
- ✅ CORRECT [bulbs] "Each bulb `0` through `n−1`, before choosing its gold or silver color."
    feedback: Correct. Color is a state assigned to a bulb node during traversal.
- ❌ [gold-only] "Only bulbs that end up gold, because those are the ones counted."
    feedback: Silver bulbs still constrain their neighbors and are needed to determine which bulbs can be gold. (misconception: omit-silver)
- ❌ [colors] "Two nodes total: one gold node and one silver node."
    feedback: Gold and silver are labels, not bulbs. Many different bulb nodes receive those labels. (misconception: color-as-node)
- ❌ [wire-groups] "One node for each connected group of wired bulbs."
    feedback: The alternating colors must be assigned inside each group, so bulbs cannot be collapsed. (misconception: component-as-node)
"Why" shown after success: Correct. Color is a state assigned to a bulb node during traversal.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-edge`, facet "two-way wires")
Raw input shown:
```
n = 7, wires = [[0,1],[0,2],[1,3],[1,4],[4,5],[2,6]]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does one wire mean in the bulb graph?**
Choices as displayed (top to bottom):
1. A / An arrow from the gold bulb to the silver bulb.
2. B / Join bulbs only when they should receive the same color.
3. C / A two-way edge whose endpoints must receive opposite colors.
4. D / Join bulbs two wires apart because they will share a color.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way-wire] "A two-way edge whose endpoints must receive opposite colors."
    feedback: Correct. The wire is undirected, and it creates the gold/silver constraint.
- ❌ [gold-direction] "An arrow from the gold bulb to the silver bulb."
    feedback: Color is not known while building the graph, and the wire has no direction. (misconception: color-defines-direction)
- ❌ [same-color-edge] "Join bulbs only when they should receive the same color."
    feedback: The rule is the opposite: wired neighbors must alternate colors. (misconception: same-color-neighbors)
- ❌ [distance-two] "Join bulbs two wires apart because they will share a color."
    feedback: Sharing a final color does not make a direct wire. Only listed wire endpoints share an edge. (misconception: derived-color-edge)
"Why" shown after success: Correct. The wire is undirected, and it creates the gold/silver constraint.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "two-way wires")
Raw input shown:
```
n=5, wires=[[0,1],[0,2],[0,3],[0,4]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many bulbs are an even number of wires from bulb 0?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.
- ❌ [bug] "0"
    feedback: This forgets that the starting bulb has even distance 0 and is gold. (misconception: exclude-distance-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
"Why" shown after success: The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "even-distance count")
Raw input shown:
```
n=7, wires=[[0,1],[0,2],[1,3],[1,4],[2,6],[4,5]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Bulbs an even number of wires from bulb 0 are gold. How many bulbs are gold?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 3
3. C / 2
4. D / 7
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "4"
    feedback: Correct: distances 0 and 2 contain bulbs 0, 3, 4, and 6.
- ❌ [three] "3"
    feedback: This excludes the starting bulb even though distance 0 is even. (misconception: exclude-start)
- ❌ [two] "2"
    feedback: This counts only bulbs at distance 2 under the first child and skips the other branch. (misconception: skip-branch)
- ❌ [seven] "7"
    feedback: This counts every reachable bulb instead of only even-distance bulbs. (misconception: ignore-parity)
"Why" shown after success: Correct: distances 0 and 2 contain bulbs 0, 3, 4, and 6.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "even-distance count")
Raw input shown:
```
n=1, wires=[], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many bulbs are an even number of wires from bulb 0?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.
- ❌ [bug] "0"
    feedback: This forgets that the starting bulb has even distance 0 and is gold. (misconception: exclude-distance-zero)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "even-distance count")
Raw input shown:
```
n=6, wires=[[0,1],[1,2],[1,4],[0,3],[3,5]], goldStart=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Using even distance from bulb 0, how many bulbs are gold?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 3
3. C / 4
4. D / 6
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "3"
    feedback: Correct: bulbs 0, 2, and 4 have even distance.
- ❌ [two] "2"
    feedback: This forgets that the starting bulb at distance 0 is gold. (misconception: exclude-start)
- ❌ [four] "4"
    feedback: This marks bulb 5 gold after resetting distance on the second branch. (misconception: reset-depth-per-branch)
- ❌ [six] "6"
    feedback: This treats reachability as enough and ignores distance parity. (misconception: ignore-parity)
"Why" shown after success: Correct: bulbs 0, 2, and 4 have even distance.
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
n=5, wires=[[0,1],[0,2],[0,3],[3,4]], goldStart=0
```
Remedial question: **How many bulbs are an even number of wires from bulb 0?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The unique tree distances put 2 bulbs at even distance, including bulb 0 at distance 0.; ❌ "1" — This forgets that the starting bulb has even distance 0 and is gold.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [gold-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each bulb 0 through n−1, before choosing its gold or silver color.
Your choice: Silver bulbs still constrain their neighbors and are needed to determine which bulbs can be gold.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
n=4, wires=[[0,1],[0,2],[2,3]], goldStart=0
```
Remedial question: **How many bulbs are an even number of wires from bulb 0?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The unique tree distances put 2 bulbs at even distance, including bulb 0 at distance 0.; ❌ "1" — This forgets that the starting bulb has even distance 0 and is gold.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—2, 2—3
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [gold-direction]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way edge whose endpoints must receive opposite colors.
Your choice: Color is not known while building the graph, and the wire has no direction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
n=3, wires=[[0,1],[1,2]], goldStart=0
```
Remedial question: **How many bulbs are an even number of wires from bulb 0?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The unique tree distances put 2 bulbs at even distance, including bulb 0 at distance 0.; ❌ "1" — This forgets that the starting bulb has even distance 0 and is gold.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
4
Your choice: This excludes the starting bulb even though distance 0 is even.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
n=4, wires=[[0,1],[0,2],[0,3]], goldStart=0
```
Remedial question: **How many bulbs are an even number of wires from bulb 0?** · choices shown: 0 | 1
Remedial answer key: ✅ "1" — Correct. The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.; ❌ "0" — This forgets that the starting bulb has even distance 0 and is gold.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—2, 0—3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: This forgets that the starting bulb at distance 0 is gold.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
n=5, wires=[[0,1],[0,2],[0,3],[0,4]], goldStart=0
```
Remedial question: **How many bulbs are an even number of wires from bulb 0?** · choices shown: 1 | 0
Remedial answer key: ✅ "1" — Correct. The unique tree distances put 1 bulb at even distance, including bulb 0 at distance 0.; ❌ "0" — This forgets that the starting bulb has even distance 0 and is gold.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Wire drawn as an arrow"; authored goal, NOT shown to student: "Orient a listed wire toward the gold bulb so a fake arrow blocks coloring.")
Everything the student sees (text):
```
J
Josiah's broken search

Josiah turns every two-way connection into a one-way arrow.

Your main goal: Expose Josiah's mistake. Draw two graphs: first the correct graph, then Josiah's graph using the mistake.

CHOOSE THE FIRST GOLD BULB
first gold bulb
OUTPUT
CORRECT OUTPUT
JOSIAH’S OUTPUT
Drawing 1 of 2: Correct graph · First gold bulb: 0
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
2 · Josiah's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GOLD BULB / first gold bulb", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | JOSIAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1`; ❌ curly braces → `{0,1}`; ❌ quoted numbers/strings → `["0","1"]`; ❌ reversed order → `[1,0]`; ✅ spaces inside brackets → `[ 0 , 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
JOSIAH'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Gold two wires away"; authored goal, NOT shown to student: "Use a wire chain where a later bulb must still receive a color.")
Everything the student sees (text):
```
M
Mary's broken search

Mary visits only the start and its direct neighboring nodes.

Your main goal: Expose Mary's mistake. Draw two graphs: first the correct graph, then Mary's graph using the mistake.

CHOOSE THE FIRST GOLD BULB
first gold bulb
OUTPUT
CORRECT OUTPUT
MARY’S OUTPUT
Drawing 1 of 2: Correct graph · First gold bulb: 0
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
2 · Mary's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GOLD BULB / first gold bulb", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MARY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
MARY'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Two lighting branches"; authored goal, NOT shown to student: "Branch the wiring so following only the last branch leaves bulbs uncolored.")
Everything the student sees (text):
```
K
Kyle's broken search

Kyle follows only the last available branch and ignores earlier choices.

Your main goal: Expose Kyle's mistake. Draw two graphs: first the correct graph, then Kyle's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST GOLD BULB
first gold bulb
OUTPUT
CORRECT OUTPUT
KYLE’S OUTPUT
Drawing 1 of 2: Correct graph · First gold bulb: 0
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
2 · Kyle's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST GOLD BULB / first gold bulb", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | KYLE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,2,3]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,2,3]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
KYLE'S OUTPUT
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
n=4, wires=[[0,1],[0,2],[0,3]], goldStart=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—2, 0—3
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only bulbs that end up gold, because those are the ones counted.”"
    feedback if wrong: Silver bulbs still constrain their neighbors and are needed to determine which bulbs can be gold. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—3, so it should also contain a direct 2—3 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Silver bulbs still constrain their neighbors and are needed to determine which bulbs can be gold. Correct node rule: Each bulb
0
through
n−1
, before choosing its gold or silver color.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
1 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Two nodes total: one gold node and one silver node.”"
    feedback if wrong: Gold and silver are labels, not bulbs. Many different bulb nodes receive those labels. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- [NO is correct] (direct-vs-reach) "The correct graph has 3—0 and 0—1, so it should also contain a direct 3—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 4 direct neighbors."
    feedback if wrong: 0 has 3 direct neighbors.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Gold and silver are labels, not bulbs. Many different bulb nodes receive those labels. Correct node rule: Each bulb
0
through
n−1
, before choosing its gold or silver color.
×
Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
0 has 3 direct neighbors.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 2 through 0, but the graph still has no direct 3—2 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each connected group of wired bulbs.”"
    feedback if wrong: The alternating colors must be assigned inside each group, so bulbs cannot be collapsed. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
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
n=5, wires=[[0,1],[0,2],[0,3],[0,4]], goldStart=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—3, so it should also contain a direct 2—3 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Two nodes total: one gold node and one silver node.”"
    feedback if wrong: Gold and silver are labels, not bulbs. Many different bulb nodes receive those labels. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=5, wires=[[0,1],[0,2],[0,3],[3,4]], goldStart=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 3 direct neighbors."
    feedback if wrong: 0 has 3 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only bulbs that end up gold, because those are the ones counted.”"
    feedback if wrong: Silver bulbs still constrain their neighbors and are needed to determine which bulbs can be gold. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- [YES is correct] (direct-vs-reach) "1 can reach 2 through 0, but the graph still has no direct 1—2 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=4, wires=[[0,1],[0,2],[2,3]], goldStart=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 0—2, 2—3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 3 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each connected group of wired bulbs.”"
    feedback if wrong: The alternating colors must be assigned inside each group, so bulbs cannot be collapsed. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—0 and 0—1, so it should also contain a direct 2—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=3, wires=[[0,1],[1,2]], goldStart=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Two nodes total: one gold node and one silver node.”"
    feedback if wrong: Gold and silver are labels, not bulbs. Many different bulb nodes receive those labels. Correct node rule: Each bulb `0` through `n−1`, before choosing its gold or silver color.
- [NO is correct] (direct-vs-reach) "The correct graph has 2—1 and 1—0, so it should also contain a direct 2—0 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Starts bulb 0 with the wrong color
Input shown:
```
REAL PROBLEM INPUT
n: 5
wires: [[0, 1], [0, 2], [0, 3], [0, 4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.wires) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function countGold(node, parent, isGold) {
    let total = isGold ? 1 : 0;
    for (const next of graph[node]) {
      if (next !== parent) {
        total += countGold(next, node, !isGold);
      }
    }
    return total;
  }
  return countGold(0, -1, false);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of gold bulbs" · expected buggy output `4` · real correct output `1`
Diagnosis choices as displayed:
- A The first call labels required-gold bulb 0 as silver, flipping every color in the tree.
- B The recursion gives every child the same color as its parent throughout the shown tree.
- C The graph stores every wire in one direction, making some leaf bulbs unreachable here.
Diagnosis answer key + feedback:
- ✅ [wrong-root-color] "The first call labels required-gold bulb 0 as silver, flipping every color in the tree." — feedback: Correct. In this star, the flip counts all four leaves instead of the root.
- ❌ [same-color-neighbors] "The recursion gives every child the same color as its parent throughout the shown tree." — feedback: The recursive call uses !isGold, so adjacent bulbs alternate correctly.
- ❌ [directed-wire] "The graph stores every wire in one direction, making some leaf bulbs unreachable here." — feedback: Both directions are added for every wire.
Graph proof shown in feedback: code rule "The root call starts with isGold false and alternates from there." → changed graph "Bulb 0 is the center of a four-leaf star and must be gold; every leaf must be silver." → boundary "The two bipartite color classes have sizes 1 and 4." → returned value "The code counts the wrong color class and returns 4 instead of 1."
Output-format probes: ❌ quoted number → `"4"`; ❌ trailing period → `4.`
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
About your diagnosis: The recursive call uses !isGold, so adjacent bulbs alternate correctly.
Code rule: The root call starts with isGold false and alternates from there. → Changed graph: Bulb 0 is the center of a four-leaf star and must be gold; every leaf must be silver. → Reachable boundary: The two bipartite color classes have sizes 1 and 4.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts bulb 0 with the wrong color
INCORRECT OUTPUT
4
CORRECT OUTPUT
1
Code rule: The root call starts with isGold false and alternates from there. → Changed graph: Bulb 0 is the center of a four-leaf star and must be gold; every leaf must be silver. → Reachable boundary: The two bipartite color classes have sizes 1 and 4. → Returned value: The code counts the wrong color class and returns 4 instead of 1.
```

### S4 case 2 — `case-1` · bug: Starts bulb 0 with the wrong color
Input shown:
```
REAL PROBLEM INPUT
n=5, wires=[[0,1],[1,2],[1,3],[3,4]], goldStart=0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.wires) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function countGold(node, parent, isGold) {
    let total = isGold ? 1 : 0;
    for (const next of graph[node]) {
      if (next !== parent) {
        total += countGold(next, node, !isGold);
      }
    }
    return total;
  }
  return countGold(0, -1, false);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 1—3, 3—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of gold bulbs" · expected buggy output `2` · real correct output `3`
Diagnosis choices as displayed:
- A The recursion gives every child the same color as its parent throughout the shown tree.
- B The first call labels required-gold bulb 0 as silver, flipping every color in the tree.
- C The graph stores every wire in one direction, making some leaf bulbs unreachable here.
Diagnosis answer key + feedback:
- ✅ [wrong-root-color] "The first call labels required-gold bulb 0 as silver, flipping every color in the tree." — feedback: Exactly. The root call starts with isGold false and alternates from there. The shown code returns 2; the real problem returns 3.
- ❌ [same-color-neighbors] "The recursion gives every child the same color as its parent throughout the shown tree." — feedback: The recursive call uses !isGold, so adjacent bulbs alternate correctly.
- ❌ [directed-wire] "The graph stores every wire in one direction, making some leaf bulbs unreachable here." — feedback: Both directions are added for every wire.
Graph proof shown in feedback: code rule "The root call starts with isGold false and alternates from there." → changed graph "Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 1—3, 3—4." → boundary "root-silver" → returned value "The shown code returns 2; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts bulb 0 with the wrong color
INCORRECT OUTPUT
2
CORRECT OUTPUT
3
Code rule: The root call starts with isGold false and alternates from there. → Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 1—2, 1—3, 3—4. → Reachable boundary: root-silver → Returned value: The shown code returns 2; the real problem returns 3.
```

### S4 case 3 — `case-3` · bug: Starts bulb 0 with the wrong color
Input shown:
```
REAL PROBLEM INPUT
n=6, wires=[[0,1],[0,2],[0,3],[0,4],[0,5]], goldStart=0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.wires) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  function countGold(node, parent, isGold) {
    let total = isGold ? 1 : 0;
    for (const next of graph[node]) {
      if (next !== parent) {
        total += countGold(next, node, !isGold);
      }
    }
    return total;
  }
  return countGold(0, -1, false);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 0—2, 0—3, 0—4, 0—5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of gold bulbs" · expected buggy output `5` · real correct output `1`
Diagnosis choices as displayed:
- A The recursion gives every child the same color as its parent throughout the shown tree.
- B The graph stores every wire in one direction, making some leaf bulbs unreachable here.
- C The first call labels required-gold bulb 0 as silver, flipping every color in the tree.
Diagnosis answer key + feedback:
- ✅ [wrong-root-color] "The first call labels required-gold bulb 0 as silver, flipping every color in the tree." — feedback: The flipped coloring counts all five leaves as gold, while the required coloring makes only root 0 gold.
- ❌ [same-color-neighbors] "The recursion gives every child the same color as its parent throughout the shown tree." — feedback: The recursive call uses !isGold, so adjacent bulbs alternate correctly.
- ❌ [directed-wire] "The graph stores every wire in one direction, making some leaf bulbs unreachable here." — feedback: Both directions are added for every wire.
Graph proof shown in feedback: code rule "The first call marks root 0 silver, then alternates all five leaves to gold." → changed graph "Bulb 0 is the center of a five-leaf star." → boundary "The required coloring starts with root 0 gold, so every leaf must be silver." → returned value "The code returns 5 gold bulbs; the correct coloring has 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts bulb 0 with the wrong color
INCORRECT OUTPUT
5
CORRECT OUTPUT
1
Code rule: The first call marks root 0 silver, then alternates all five leaves to gold. → Changed graph: Bulb 0 is the center of a five-leaf star. → Reachable boundary: The required coloring starts with root 0 gold, so every leaf must be silver. → Returned value: The code returns 5 gold bulbs; the correct coloring has 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```