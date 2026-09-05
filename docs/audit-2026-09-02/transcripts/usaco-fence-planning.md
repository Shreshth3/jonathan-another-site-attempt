# Fence Planning (`usaco-fence-planning`) — new, undirected-graph

## Problem statement (Description tab)

Farmer John's `N` cows are numbered `0` to `N - 1`, and cow `i` is standing at position `positions[i] = [x, y]` in the pasture (all positions are distinct).

Cows chat by mooing. `pairs[j] = [a, b]` means cows `a` and `b` moo back and forth with each other. Cows form **herds**: two cows belong to the same herd if they moo with each other directly, or are linked through a chain of mooing pairs. Every cow moos with at least one other cow.

Farmer John wants to build **one** rectangular fence, with sides parallel to the x- and y-axes, that contains every cow of **at least one entire herd** (cows from other herds may happen to end up inside too — that's fine). A cow standing exactly on the fence line counts as inside, and the rectangle is allowed to have zero width or zero height. A fence spanning width `w` and height `h` has perimeter `2 * (w + h)`.

Return the smallest perimeter Farmer John can get away with.

**Function signature**

```js
function minFencePerimeter(positions, pairs) {
  // positions: array of [x, y] integer pairs
  // pairs: array of [a, b] cow-number pairs
  // return a number
}
```

### Examples
- Example 1: input `minFencePerimeter(
  [[0, 0], [3, 1], [1, 2], [10, 10], [12, 11]],
  [[0, 1], [1, 2], [3, 4]]
)` → output `6`. Cows 0, 1, 2 form one herd (0 moos with 1, and 1 moos with 2). Cows 3 and 4 form another. Herd {0, 1, 2}: x runs 0 to 3 (width 3), y runs 0 to 2 (height 2), perimeter 2 * (3 + 2) = 10. Herd {3, 4}: x runs 10 to 12 (width 2), y runs 10 to 11 (height 1), perimeter 2 * (2 + 1) = 6. The smaller option is 6.
- Example 2: input `minFencePerimeter(
  [[2, 5], [2, 9], [7, 5], [4, 4], [6, 6]],
  [[0, 2], [1, 3], [3, 4]]
)` → output `10`. The herds are {0, 2} and {1, 3, 4}. Herd {0, 2}: cows at [2, 5] and [7, 5], so width 5 and height 0 — a zero-height fence is allowed — perimeter 2 * (5 + 0) = 10. Herd {1, 3, 4}: x runs 2 to 6 (width 4), y runs 4 to 9 (height 5), perimeter 2 * (4 + 5) = 18. Answer: 10.

### Graph rules (authored)
- Nodes: One cow, carrying its x,y position.
- Edges: Their cow numbers appear together in a listed moo pair.
- Node-name format shown in Step 1/3: Name each cow `0BasedIndex:(x,y)`. Example: `2:(4,1)`. Do not add spaces. (pattern `^\d+:\(-?\d+,-?\d+\)$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact cow roads")
Raw input shown:
```
cows=[[0,0],[2,0],[2,1],[8,8],[9,8]], friendships=[[0,1],[1,2],[3,4]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What minimum fence perimeter is returned?**
Choices as displayed (top to bottom):
1. 2
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The herd perimeters are 6, 2; the minimum is 2.
- ❌ [bug] "6"
    feedback: This chooses the largest herd fence instead of the minimum perimeter among herds. (misconception: take-maximum-perimeter)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:(0,0)", "1:(2,0)", "2:(2,1)", "3:(8,8)", "4:(9,8)" · edges: 0:(0,0)—1:(2,0), 1:(2,0)—2:(2,1), 3:(8,8)—4:(9,8)
"Why" shown after success: The herd perimeters are 6, 2; the minimum is 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact cow roads")
Raw input shown:
```
cows=[[0,0],[2,0],[2,1],[8,8],[9,8]], friendships=[[0,1],[1,2],[3,4]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0:(0,0) / 1:(2,0) / 2:(2,1) / 3:(8,8) / 4:(9,8)
2. Picture C / 0:(0,0) / 1:(2,0) / 2:(2,1) / 3:(8,8) / 4:(9,8)
3. Picture A / 0:(0,0) / 1:(2,0) / 2:(2,1) / 3:(8,8) / 4:(9,8)
4. Picture D / 0:(0,0) / 1:(2,0) / 2:(2,1) / 3:(8,8)
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0:(0,0), 1:(2,0), 2:(2,1), 3:(8,8), 4:(9,8) · edges: 0:(0,0)—1:(2,0), 1:(2,0)—2:(2,1), 3:(8,8)—4:(9,8)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0:(0,0), 1:(2,0), 2:(2,1), 3:(8,8), 4:(9,8) · edges: 0:(0,0)—1:(2,0), 1:(2,0)—2:(2,1)
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0:(0,0), 1:(2,0), 2:(2,1), 3:(8,8), 4:(9,8) · edges: 0:(0,0)→1:(2,0), 1:(2,0)→2:(2,1), 3:(8,8)→4:(9,8)
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0:(0,0), 1:(2,0), 2:(2,1), 3:(8,8) · edges: 0:(0,0)—1:(2,0), 1:(2,0)—2:(2,1)
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`case-2`, facet "cow identity")
Raw input shown:
```
cows=[[1,1],[4,1],[4,3]], friendships=[[0,1],[1,2]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What minimum fence perimeter is returned?**
Choices as displayed (top to bottom):
1. 12
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Correct. The herd perimeters are 10; the minimum is 10.
- ❌ [bug] "12"
    feedback: This adds one unit of padding around a bounding box that may touch the cows. (misconception: add-unrequired-padding)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:(1,1)", "1:(4,1)", "2:(4,3)" · edges: 0:(1,1)—1:(4,1), 1:(4,1)—2:(4,3)
"Why" shown after success: The herd perimeters are 10; the minimum is 10.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "cow identity")
Raw input shown:
```
What belongs at each plotted node?
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What belongs at each plotted node?**
Choices as displayed (top to bottom):
1. A / One mooing pair.
2. B / One whole herd.
3. C / One possible fence corner.
4. D / One cow, carrying its x,y position.
Answer key + feedback per choice (data):
- ✅ CORRECT [cow] "One cow, carrying its x,y position."
    feedback: Right. Herd membership comes from edges; fence bounds come from node coordinates.
- ❌ [pair] "One mooing pair."
    feedback: A pair is an edge between two cow nodes. (misconception: swaps-nodes-and-edges)
- ❌ [herd] "One whole herd."
    feedback: You must first discover a herd from its individual cows. (misconception: collapses-components)
- ❌ [corner] "One possible fence corner."
    feedback: Fence corners are computed from cow coordinates after DFS. (misconception: uses-output-geometry-as-node)
"Why" shown after success: Right. Herd membership comes from edges; fence bounds come from node coordinates.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "two-way roads")
Raw input shown:
```
When do two cow nodes share an edge?
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When do two cow nodes share an edge?**
Choices as displayed (top to bottom):
1. A / Their cow numbers appear together in a listed moo pair.
2. B / Their pasture coordinates are close together.
3. C / They fit inside the same smallest rectangle.
4. D / The first cow in [a,b] can moo only to the second.
Answer key + feedback per choice (data):
- ✅ CORRECT [pair] "Their cow numbers appear together in a listed moo pair."
    feedback: Right. The link is two-way, regardless of coordinate distance.
- ❌ [near] "Their pasture coordinates are close together."
    feedback: Distance does not create moo links in this problem. (misconception: derives-edge-from-distance)
- ❌ [same-box] "They fit inside the same smallest rectangle."
    feedback: The rectangle is measured after the herd is known. (misconception: derives-edge-from-fence)
- ❌ [directed] "The first cow in [a,b] can moo only to the second."
    feedback: Each listed moo pair works in both directions. (misconception: treats-pair-as-directed)
"Why" shown after success: Right. The link is two-way, regardless of coordinate distance.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "two-way roads")
Raw input shown:
```
cows=[[0,0],[1,0]], friendships=[[0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What minimum fence perimeter is returned?**
Choices as displayed (top to bottom):
1. 2
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The herd perimeters are 2; the minimum is 2.
- ❌ [bug] "4"
    feedback: This adds one unit of padding around a bounding box that may touch the cows. (misconception: add-unrequired-padding)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:(0,0)", "1:(1,0)" · edges: 0:(0,0)—1:(1,0)
"Why" shown after success: The herd perimeters are 2; the minimum is 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "minimum herd perimeter")
Raw input shown:
```
minFencePerimeter(
  [[0, 0], [3, 1], [1, 2], [10, 10], [12, 11]],
  [[0, 1], [1, 2], [3, 4]]
)
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What minimum fence perimeter is returned for the shown cows and friendships?**
Choices as displayed (top to bottom):
1. A / 10
2. B / 16
3. C / 8
4. D / 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "10"
    feedback: Only one whole herd must fit, so choose the smaller fence. (misconception: chooses-first-herd)
- ❌ [wrong-2] "16"
    feedback: Do not add the perimeters of separate herd fences. (misconception: sums-herd-perimeters)
- ❌ [wrong-3] "8"
    feedback: The answer is a perimeter, not an average. (misconception: averages-perimeters)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "minimum herd perimeter")
Raw input shown:
```
cows=[[5,7],[5,8]], friendships=[[0,1]]
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What minimum fence perimeter is returned?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The herd perimeters are 2; the minimum is 2.
- ❌ [bug] "4"
    feedback: This adds one unit of padding around a bounding box that may touch the cows. (misconception: add-unrequired-padding)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:(5,7)", "1:(5,8)" · edges: 0:(5,7)—1:(5,8)
"Why" shown after success: The herd perimeters are 2; the minimum is 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "minimum herd perimeter")
Raw input shown:
```
minFencePerimeter(
  [[2, 5], [2, 9], [7, 5], [4, 4], [6, 6]],
  [[0, 2], [1, 3], [3, 4]]
)
```
Node-name guide shown: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What minimum fence perimeter is returned for the shown cows and friendships?**
Choices as displayed (top to bottom):
1. A / 10
2. B / 0
3. C / 5
4. D / 18
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "0"
    feedback: Zero height is allowed, but width 5 still contributes twice. (misconception: zeroes-flat-rectangle)
- ❌ [wrong-2] "5"
    feedback: Perimeter is 2×(width+height). (misconception: forgets-doubling)
- ❌ [wrong-3] "18"
    feedback: This computes the other herd's perimeter correctly but returns the larger herd instead of the minimum. (misconception: chooses-larger-herd)
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
cows=[[0,0],[3,0],[0,4]], friendships=[[0,1],[0,2]]
```
Remedial question: **What minimum fence perimeter is returned?** · choices shown: 14 | 16
Remedial answer key: ✅ "14" — Correct. The herd perimeters are 14; the minimum is 14.; ❌ "16" — This adds one unit of padding around a bounding box that may touch the cows.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(3,0)", "2:(0,4)" · edges: 0:(0,0)—1:(3,0), 0:(0,0)—2:(0,4)
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [pair]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One cow, carrying its x,y position.
Your choice: A pair is an edge between two cow nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
cows=[[1,1],[2,2],[9,1],[9,4]], friendships=[[0,1],[2,3]]
```
Remedial question: **What minimum fence perimeter is returned?** · choices shown: 6 | 4
Remedial answer key: ✅ "4" — Correct. The herd perimeters are 4, 6; the minimum is 4.; ❌ "6" — This chooses the largest herd fence instead of the minimum perimeter among herds.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:(1,1)", "1:(2,2)", "2:(9,1)", "3:(9,4)" · edges: 0:(1,1)—1:(2,2), 2:(9,1)—3:(9,4)
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [near]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Their cow numbers appear together in a listed moo pair.
Your choice: Distance does not create moo links in this problem.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
cows=[[2,5],[7,5]], friendships=[[0,1]]
```
Remedial question: **What minimum fence perimeter is returned?** · choices shown: 10 | 12
Remedial answer key: ✅ "10" — Correct. The herd perimeters are 10; the minimum is 10.; ❌ "12" — This adds one unit of padding around a bounding box that may touch the cows.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:(2,5)", "1:(7,5)" · edges: 0:(2,5)—1:(7,5)
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
6
Your choice: Only one whole herd must fit, so choose the smaller fence.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
cows=[[0,0],[1,0],[10,0]], friendships=[[0,1],[1,2]]
```
Remedial question: **What minimum fence perimeter is returned?** · choices shown: 22 | 20
Remedial answer key: ✅ "20" — Correct. The herd perimeters are 20; the minimum is 20.; ❌ "22" — This adds one unit of padding around a bounding box that may touch the cows.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(1,0)", "2:(10,0)" · edges: 0:(0,0)—1:(1,0), 1:(1,0)—2:(10,0)
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
10
Your choice: Zero height is allowed, but width 5 still contributes twice.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
cows=[[0,0],[2,2],[4,0],[2,1]], friendships=[[0,1],[1,2],[1,3]]
```
Remedial question: **What minimum fence perimeter is returned?** · choices shown: 12 | 14
Remedial answer key: ✅ "12" — Correct. The herd perimeters are 12; the minimum is 12.; ❌ "14" — This adds one unit of padding around a bounding box that may touch the cows.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(2,2)", "2:(4,0)", "3:(2,1)" · edges: 0:(0,0)—1:(2,2), 1:(2,2)—2:(4,0), 1:(2,2)—3:(2,1)
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Backward moo pair"; authored goal, NOT shown to student: "Write a pair backward so its two-way nature is essential.")
Everything the student sees (text):
```
L
Landen's broken search

Landen turns every two-way connection into a one-way arrow.

Your main goal: Expose Landen's mistake. Draw two graphs: first the correct graph, then Landen's graph using the mistake.

CHOOSE THE CHOSEN COW
chosen cow
OUTPUT
CORRECT OUTPUT
LANDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen cow
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
2 · Landen's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN COW / chosen cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LANDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0:(0,0)", "1:(2,0)", "2:(2,1)", "3:(8,8)", "4:(9,8)"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
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
LANDEN'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Herd seed"; authored goal, NOT shown to student: "Make two herds so starting at the wrong cow changes the fence.")
Everything the student sees (text):
```
C
Christina's broken search

Christina uses the wrong chosen cow.

Your main goal: Expose Christina's mistake. Draw two graphs: first the correct graph, then Christina's graph using the mistake.

CHOOSE THE CHOSEN COW
chosen cow
OUTPUT
CORRECT OUTPUT
CHRISTINA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen cow
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
2 · Christina's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN COW / chosen cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CHRISTINA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 1—2 · start 0
Grader's expected answers: correct output `[0]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
CHRISTINA'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Wide pasture chain"; authored goal, NOT shown to student: "Put an extreme-position cow more than one moo away.")
Everything the student sees (text):
```
J
Johnathan's broken search

Johnathan visits only the start and its direct neighboring nodes.

Your main goal: Expose Johnathan's mistake. Draw two graphs: first the correct graph, then Johnathan's graph using the mistake.

CHOOSE THE CHOSEN COW
chosen cow
OUTPUT
CORRECT OUTPUT
JOHNATHAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose chosen cow
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
2 · Johnathan's graph
Check my graph
→
```
Start field: label "CHOOSE THE CHOSEN COW / chosen cow", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JOHNATHAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JOHNATHAN'S OUTPUT
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
cows=[[2,5],[7,5]], friendships=[[0,1]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:(2,5)", "1:(7,5)" · edges: 0:(2,5)—1:(7,5)
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "0:(2,5) and 1:(7,5) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge.
- [YES is correct] (local-degree) "1:(7,5) has exactly 1 direct neighbor."
    feedback if wrong: 1:(7,5) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One mooing pair.”"
    feedback if wrong: A pair is an edge between two cow nodes. Correct node rule: One cow, carrying its x,y position.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge.
×
1:(7,5) has 1 direct neighbor.
×
A pair is an edge between two cow nodes. Correct node rule: One cow, carrying its x,y position.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One whole herd.”"
    feedback if wrong: You must first discover a herd from its individual cows. Correct node rule: One cow, carrying its x,y position.
- [YES is correct] (direct-vs-reach) "0:(2,5) and 1:(7,5) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge.
- [YES is correct] (local-degree) "0:(2,5) has exactly 1 direct neighbor."
    feedback if wrong: 0:(2,5) has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
You must first discover a herd from its individual cows. Correct node rule: One cow, carrying its x,y position.
×
Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge.
×
0:(2,5) has 1 direct neighbor.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0:(2,5) and 1:(7,5) are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge.
- [YES is correct] (local-degree) "1:(7,5) has exactly 1 direct neighbor."
    feedback if wrong: 1:(7,5) has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One possible fence corner.”"
    feedback if wrong: Fence corners are computed from cow coordinates after DFS. Correct node rule: One cow, carrying its x,y position.
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
cows=[[0,0],[1,0],[10,0]], friendships=[[0,1],[1,2]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(1,0)", "2:(10,0)" · edges: 0:(0,0)—1:(1,0), 1:(1,0)—2:(10,0)
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1:(1,0) has exactly 3 direct neighbors."
    feedback if wrong: 1:(1,0) has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One whole herd.”"
    feedback if wrong: You must first discover a herd from its individual cows. Correct node rule: One cow, carrying its x,y position.
- [NO is correct] (direct-vs-reach) "The correct graph has 0:(0,0)—1:(1,0) and 1:(1,0)—2:(10,0), so it should also contain a direct 0:(0,0)—2:(10,0) edge."
    feedback if wrong: Two direct edges through 1:(1,0) do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
cows=[[0,0],[2,2],[4,0],[2,1]], friendships=[[0,1],[1,2],[1,3]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(2,2)", "2:(4,0)", "3:(2,1)" · edges: 0:(0,0)—1:(2,2), 1:(2,2)—2:(4,0), 1:(2,2)—3:(2,1)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One mooing pair.”"
    feedback if wrong: A pair is an edge between two cow nodes. Correct node rule: One cow, carrying its x,y position.
- [NO is correct] (direct-vs-reach) "The correct graph has 2:(4,0)—1:(2,2) and 1:(2,2)—3:(2,1), so it should also contain a direct 2:(4,0)—3:(2,1) edge."
    feedback if wrong: Two direct edges through 1:(2,2) do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1:(2,2) has exactly 2 direct neighbors."
    feedback if wrong: 1:(2,2) has 3 direct neighbors.
Result: PASSED

### S3 Q4
Raw input shown:
```
cows=[[0,0],[3,0],[0,4]], friendships=[[0,1],[0,2]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:(0,0)", "1:(3,0)", "2:(0,4)" · edges: 0:(0,0)—1:(3,0), 0:(0,0)—2:(0,4)
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One possible fence corner.”"
    feedback if wrong: Fence corners are computed from cow coordinates after DFS. Correct node rule: One cow, carrying its x,y position.
- [YES is correct] (direct-vs-reach) "1:(3,0) can reach 2:(0,4) through 0:(0,0), but the graph still has no direct 1:(3,0)—2:(0,4) edge."
    feedback if wrong: Right. A multi-step route through 0:(0,0) creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2:(0,4) has exactly 1 direct neighbor."
    feedback if wrong: 2:(0,4) has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
cows=[[1,1],[2,2],[9,1],[9,4]], friendships=[[0,1],[2,3]]
```
Node-name guide: Required node-name format: Name each cow 0BasedIndex:(x,y). Example: 2:(4,1). Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:(1,1)", "1:(2,2)", "2:(9,1)", "3:(9,4)" · edges: 0:(1,1)—1:(2,2), 2:(9,1)—3:(9,4)
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One whole herd.”"
    feedback if wrong: You must first discover a herd from its individual cows. Correct node rule: One cow, carrying its x,y position.
- [NO is correct] (direct-vs-reach) "2:(9,1) can reach 3:(9,4), but there is no direct 2:(9,1)—3:(9,4) edge."
    feedback if wrong: The mini-example lists 2:(9,1)—3:(9,4) as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "3:(9,4) has exactly 0 direct neighbors."
    feedback if wrong: 3:(9,4) has 1 direct neighbor.
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

### S4 case 1 — `authored-deep-case` · bug: Fence side lengths are not doubled
Input shown:
```
REAL PROBLEM INPUT
positions: [[0, 0], [3, 2]]
pairs: [[0, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minFencePerimeter(positions, pairs) {
  const next = positions.map(() => []);
  for (const [firstValue, secondValue] of pairs) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set();
  let smallestPerimeter = Infinity;
  for (let startNode = 0; startNode < positions.length; startNode++) {
    if (!visited.has(startNode)) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const index = stack.pop();
        const [xCoordinate, yCoordinate] = positions[index];
        minX = Math.min(minX, xCoordinate);
        maxX = Math.max(maxX, xCoordinate);
        minY = Math.min(minY, yCoordinate);
        maxY = Math.max(maxY, yCoordinate);
        for (const otherIndex of next[index]) {
          if (!visited.has(otherIndex)) {
            visited.add(otherIndex);
            stack.push(otherIndex);
          }
        }
      }
      smallestPerimeter = Math.min(smallestPerimeter, maxX - minX + (maxY - minY));
    }
  }
  return smallestPerimeter;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0:(0,0)", "1:(3,2)" · edges: 0:(0,0)—1:(3,2)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `10`
Diagnosis choices as displayed:
- A The code should choose the largest herd box rather than the smallest.
- B It adds one width and one height but a rectangle has two of each side.
- C A herd's fence box needs one unit of padding outside every extreme cow coordinate.
Diagnosis answer key + feedback:
- ❌ [component-min] "The code should choose the largest herd box rather than the smallest." — feedback: The task asks for the cheapest fence around any entire herd, so minimum is correct.
- ✅ [half-perimeter] "It adds one width and one height but a rectangle has two of each side." — feedback: Exactly. The bounding dimensions 3 and 2 require 2×(3+2).
- ❌ [zero-size] "A herd's fence box needs one unit of padding outside every extreme cow coordinate." — feedback: Cows may stand on the fence, so no padding is required.
Graph proof shown in feedback: code rule "After correct component traversal, it scores the box as width+height." → changed graph "The single moo edge makes both cows one component whose coordinate box is width 3 and height 2." → boundary "Both dimensions are nonzero, exposing the missing pair of opposite sides." → returned value "The helper returns 5, exactly half of the required perimeter 10."
Output-format probes: ❌ quoted number → `"5"`; ❌ trailing period → `5.`
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
About your diagnosis: The task asks for the cheapest fence around any entire herd, so minimum is correct.
Code rule: After correct component traversal, it scores the box as width+height. → Changed graph: The single moo edge makes both cows one component whose coordinate box is width 3 and height 2. → Reachable boundary: Both dimensions are nonzero, exposing the missing pair of opposite sides.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Fence side lengths are not doubled
INCORRECT OUTPUT
5
CORRECT OUTPUT
10
Code rule: After correct component traversal, it scores the box as width+height. → Changed graph: The single moo edge makes both cows one component whose coordinate box is width 3 and height 2. → Reachable boundary: Both dimensions are nonzero, exposing the missing pair of opposite sides. → Returned value: The helper returns 5, exactly half of the required perimeter 10.
```

### S4 case 2 — `case-1` · bug: Fence side lengths are not doubled
Input shown:
```
REAL PROBLEM INPUT
cows=[[0,0],[2,0],[2,1],[8,8],[9,8]], friendships=[[0,1],[1,2],[3,4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minFencePerimeter(positions, pairs) {
  const next = positions.map(() => []);
  for (const [firstValue, secondValue] of pairs) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set();
  let smallestPerimeter = Infinity;
  for (let startNode = 0; startNode < positions.length; startNode++) {
    if (!visited.has(startNode)) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const index = stack.pop();
        const [xCoordinate, yCoordinate] = positions[index];
        minX = Math.min(minX, xCoordinate);
        maxX = Math.max(maxX, xCoordinate);
        minY = Math.min(minY, yCoordinate);
        maxY = Math.max(maxY, yCoordinate);
        for (const otherIndex of next[index]) {
          if (!visited.has(otherIndex)) {
            visited.add(otherIndex);
            stack.push(otherIndex);
          }
        }
      }
      smallestPerimeter = Math.min(smallestPerimeter, maxX - minX + (maxY - minY));
    }
  }
  return smallestPerimeter;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0:(0,0)", "1:(2,0)", "2:(2,1)", "3:(8,8)", "4:(9,8)" · edges: 0:(0,0)—1:(2,0), 1:(2,0)—2:(2,1), 3:(8,8)—4:(9,8)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The code should choose the largest herd box rather than the smallest.
- B A herd's fence box needs one unit of padding outside every extreme cow coordinate.
- C It adds one width and one height but a rectangle has two of each side.
Diagnosis answer key + feedback:
- ❌ [component-min] "The code should choose the largest herd box rather than the smallest." — feedback: The task asks for the cheapest fence around any entire herd, so minimum is correct.
- ✅ [half-perimeter] "It adds one width and one height but a rectangle has two of each side." — feedback: Correct. The smaller herd spans one horizontal unit, so width+height is 1 while its full rectangle perimeter is 2.
- ❌ [zero-size] "A herd's fence box needs one unit of padding outside every extreme cow coordinate." — feedback: Cows may stand on the fence, so no padding is required.
Graph proof shown in feedback: code rule "After correct component traversal, it scores the box as width+height." → changed graph "Friendships make components 0—1—2 and 3—4, with each cow carrying its shown coordinate." → boundary "The cheapest component spans a 1-by-0 box, whose full perimeter is twice width plus height." → returned value "The shown code returns 1; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Fence side lengths are not doubled
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: After correct component traversal, it scores the box as width+height. → Changed graph: Friendships make components 0—1—2 and 3—4, with each cow carrying its shown coordinate. → Reachable boundary: The cheapest component spans a 1-by-0 box, whose full perimeter is twice width plus height. → Returned value: The shown code returns 1; the real problem returns 2.
```

### S4 case 3 — `case-2` · bug: Fence side lengths are not doubled
Input shown:
```
REAL PROBLEM INPUT
cows=[[1,1],[4,1],[4,3]], friendships=[[0,1],[1,2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function minFencePerimeter(positions, pairs) {
  const next = positions.map(() => []);
  for (const [firstValue, secondValue] of pairs) {
    next[firstValue].push(secondValue);
    next[secondValue].push(firstValue);
  }
  const visited = new Set();
  let smallestPerimeter = Infinity;
  for (let startNode = 0; startNode < positions.length; startNode++) {
    if (!visited.has(startNode)) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      const stack = [startNode];
      visited.add(startNode);
      while (stack.length) {
        const index = stack.pop();
        const [xCoordinate, yCoordinate] = positions[index];
        minX = Math.min(minX, xCoordinate);
        maxX = Math.max(maxX, xCoordinate);
        minY = Math.min(minY, yCoordinate);
        maxY = Math.max(maxY, yCoordinate);
        for (const otherIndex of next[index]) {
          if (!visited.has(otherIndex)) {
            visited.add(otherIndex);
            stack.push(otherIndex);
          }
        }
      }
      smallestPerimeter = Math.min(smallestPerimeter, maxX - minX + (maxY - minY));
    }
  }
  return smallestPerimeter;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0:(1,1)", "1:(4,1)", "2:(4,3)" · edges: 0:(1,1)—1:(4,1), 1:(4,1)—2:(4,3)
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `10`
Diagnosis choices as displayed:
- A It adds one width and one height but a rectangle has two of each side.
- B The code should choose the largest herd box rather than the smallest.
- C A herd's fence box needs one unit of padding outside every extreme cow coordinate.
Diagnosis answer key + feedback:
- ❌ [component-min] "The code should choose the largest herd box rather than the smallest." — feedback: The task asks for the cheapest fence around any entire herd, so minimum is correct.
- ✅ [half-perimeter] "It adds one width and one height but a rectangle has two of each side." — feedback: Correct. This herd's box spans 3 by 2, so one width plus one height is 5 but two of each side total 10.
- ❌ [zero-size] "A herd's fence box needs one unit of padding outside every extreme cow coordinate." — feedback: Cows may stand on the fence, so no padding is required.
Graph proof shown in feedback: code rule "After correct component traversal, it scores the box as width+height." → changed graph "The three cows form one friendship chain 0—1—2 at coordinates (1,1), (4,1), and (4,3)." → boundary "The connected cows span x=1 through 4 and y=1 through 3, a 3-by-2 box with perimeter 10." → returned value "The shown code returns 5; the real problem returns 10."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Fence side lengths are not doubled
INCORRECT OUTPUT
5
CORRECT OUTPUT
10
Code rule: After correct component traversal, it scores the box as width+height. → Changed graph: The three cows form one friendship chain 0—1—2 at coordinates (1,1), (4,1), and (4,3). → Reachable boundary: The connected cows span x=1 through 4 and y=1 through 3, a 3-by-2 box with perimeter 10. → Returned value: The shown code returns 5; the real problem returns 10.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```