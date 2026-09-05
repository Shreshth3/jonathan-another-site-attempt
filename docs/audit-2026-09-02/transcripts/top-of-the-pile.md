# Top of the Pile (`top-of-the-pile`) — variant, nested

## Problem statement (Description tab)

A moving company stacks boxes inside boxes. The load is written as a **nested array**: each element is either an integer (the weight of a loose item) or another array (a box containing more things).

Elements directly in the top-level array are at depth `1`; each layer of nesting adds `1`. For example, in `[[9],5]`, the item `5` is at depth 1 and the item `9` is at depth 2.

When unloading the truck, workers only grab the items that are the **least buried** — the items at the smallest depth where any loose item exists at all. Everything deeper stays in its boxes for now.

Write a function `topLayerSum(items)` that finds the **smallest depth containing at least one integer** and returns the **sum of all integers at that depth**. You are guaranteed the nested array contains at least one integer.

### Examples
- Example 1: input `items = [[[5,6]],7,[8]]` → output `7`. Depth 1 contains the integer 7, so depth 1 is the least-buried level with any items. Only 7 is at depth 1 (5, 6 are at depth 3 and 8 is at depth 2), so the answer is 7.
- Example 2: input `items = [[[2,3]],[[4],[5,[6]]]]` → output `14`. Depths 1 and 2 contain only arrays, no integers. The shallowest integers appear at depth 3: 2, 3, 4, and 5. (The 6 is at depth 4.) 2 + 3 + 4 + 5 = 14.

### Graph rules (authored)
- Nodes: Every array box and every integer item; the outer array is the root.
- Edges: An array connects to each item or inner array directly inside it.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`top-item`, facet "shallowest occupied depth sum")
Raw input shown:
```
items=[[[5,6]],7,[8]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned?**
Choices as displayed (top to bottom):
1. 15
2. 7
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "7"
    feedback: Correct. Item 7 is the only integer at depth 1.
- ❌ [bug] "15"
    feedback: This adds every integer at every depth. (misconception: sum-all-depths)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5", "root[0][0][1]=6", "root[1]=7", "root[2]=[]", "root[2][0]=8" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[0][0]=[]→root[0][0][1]=6, root=[]→root[1]=7, root=[]→root[2]=[], root[2]=[]→root[2][0]=8
"Why" shown after success: Item 7 is the only integer at depth 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`empty-top`, facet "direct containment edges")
Raw input shown:
```
items=[[],[[2,3]],[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned?**
Choices as displayed (top to bottom):
1. 9
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "9"
    feedback: Correct. The shallowest integers 2,3,4 all occur at depth 3.
- ❌ [bug] "0"
    feedback: This treats top-level arrays as occupied loose-item nodes and stops before reaching integers. (misconception: container-counts-as-item)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=[]", "root[1][0][0]=2", "root[1][0][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=[], root[1][0]=[]→root[1][0][0]=2, root[1][0]=[]→root[1][0][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
"Why" shown after success: The shallowest integers 2,3,4 all occur at depth 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact nesting")
Raw input shown:
```
items=[[[5,6]],7,[8]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / Outer array / Array / at [0] / Array / at [0][0] / 5 / at [0][0][0] / 6 / at [0][0][1] / 7 / at [1] / Array / at [2] / 8 / at [2][0]
2. Picture C / Outer array / Array / at [0] / Array / at [0][0] / 5 / at [0][0][0] / 6 / at [0][0][1] / 7 / at [1] / Array / at [2] / 8 / at [2][0]
3. Picture A / Outer array / Array / at [0] / Array / at [0][0] / 5 / at [0][0][0] / 6 / at [0][0][1] / 7 / at [1] / Array / at [2] / 8 / at [2][0]
4. Picture D / Outer array / Array / at [0] / Array / at [0][0] / 5 / at [0][0][0] / 6 / at [0][0][1] / 7 / at [1] / Array / at [2]
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=[], root[0][0][0]=5, root[0][0][1]=6, root[1]=7, root[2]=[], root[2][0]=8 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[0][0]=[]→root[0][0][1]=6, root=[]→root[1]=7, root=[]→root[2]=[], root[2]=[]→root[2][0]=8
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=[], root[0][0][0]=5, root[0][0][1]=6, root[1]=7, root[2]=[], root[2][0]=8 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[0][0]=[]→root[0][0][1]=6, root=[]→root[1]=7, root=[]→root[2]=[]
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=[], root[0][0][0]=5, root[0][0][1]=6, root[1]=7, root[2]=[], root[2][0]=8 · edges: root[0]=[]→root=[], root[0][0]=[]→root[0]=[], root[0][0][0]=5→root[0][0]=[], root[0][0][1]=6→root[0][0]=[], root[1]=7→root=[], root[2]=[]→root=[], root[2][0]=8→root[2]=[]
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=[], root[0][0][0]=5, root[0][0][1]=6, root[1]=7, root[2]=[] · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[0][0]=[]→root[0][0][1]=6, root=[]→root[1]=7, root=[]→root[2]=[]
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`two-shallow`, facet "exact nesting")
Raw input shown:
```
items=[[6],5,[4]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned?**
Choices as displayed (top to bottom):
1. 15
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. Item 5 is alone at depth 1.
- ❌ [bug] "15"
    feedback: This includes deeper items 6 and 4 after finding top-level item 5. (misconception: continue-below-first-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=6", "root[1]=5", "root[2]=[]", "root[2][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=6, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=4
"Why" shown after success: Item 5 is alone at depth 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-nodes`, facet "container and item identity")
Raw input shown:
```
items=[[],[[2,3]],[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What gets its own node in the pile's nesting tree?**
Picture under review: DIRECTED · nodes: root=[], root[0]=[], root[1]=[], root[1][0]=[], root[1][0][0]=2, root[1][0][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4 · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=[], root[1][0]=[]→root[1][0][0]=2, root[1][0]=[]→root[1][0][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
Choices as displayed (top to bottom):
1. A / Only integers, labeled with their final depth.
2. B / Every integer and only arrays that contain at least one integer somewhere below.
3. C / One node per depth, holding all item values found there.
4. D / Every array box and every integer item; the outer array is the root.
Answer key + feedback per choice (data):
- ✅ CORRECT [arrays-integers] "Every array box and every integer item; the outer array is the root."
    feedback: Correct. Box nodes determine depth, and integer leaves are the values that may be summed.
- ❌ [integers-only] "Only integers, labeled with their final depth."
    feedback: That records an answer after depth is known but does not model how recursion discovers depth through boxes. (misconception: omit-boxes)
- ❌ [nonempty-arrays] "Every integer and only arrays that contain at least one integer somewhere below."
    feedback: Empty arrays still occupy positions and matter when finding whether a level has items. (misconception: drop-empty-boxes)
- ❌ [depths] "One node per depth, holding all item values found there."
    feedback: That collapses separate branches and hides parent-child nesting. (misconception: collapse-by-depth)
"Why" shown after success: Correct. Box nodes determine depth, and integer leaves are the values that may be summed.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`zero-sum`, facet "shallowest occupied depth sum")
Raw input shown:
```
items=[[],[6,-6],[[9]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned?**
Choices as displayed (top to bottom):
1. 0
2. 9
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Items 6 and -6 occupy depth 2; their sum is 0.
- ❌ [bug] "9"
    feedback: This treats sum zero as no shallow items and continues deeper. (misconception: zero-sum-means-empty-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=6", "root[1][1]=-6", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=9" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=6, root[1]=[]→root[1][1]=-6, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=9
"Why" shown after success: Items 6 and -6 occupy depth 2; their sum is 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-relations`, facet "direct containment edges")
Raw input shown:
```
items=[[6],5,[4]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which direct containment relationship becomes an edge?**
Picture under review: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=6, root[1]=5, root[2]=[], root[2][0]=4 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=6, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=4
Choices as displayed (top to bottom):
1. A / Connect the root directly to every item at the shallowest occupied depth.
2. B / An array connects to each item or inner array directly inside it.
3. C / Every outer array connects directly to all integers anywhere inside it.
4. D / Connect integers that appear next to each other when the input is printed.
Answer key + feedback per choice (data):
- ✅ CORRECT [array-child] "An array connects to each item or inner array directly inside it."
    feedback: Correct. Crossing one such edge moves to contents one level deeper.
- ❌ [shallowest-only] "Connect the root directly to every item at the shallowest occupied depth."
    feedback: That uses the result to redraw the input and removes deeper branches needed to find that result. (misconception: answer-driven-edges)
- ❌ [all-descendants] "Every outer array connects directly to all integers anywhere inside it."
    feedback: Skipping intermediate boxes makes deep items appear too shallow. (misconception: skip-nesting-levels)
- ❌ [adjacent-values] "Connect integers that appear next to each other when the input is printed."
    feedback: Printed neighbors may live in different boxes. Containment, not text position, defines edges. (misconception: text-adjacency)
"Why" shown after success: Correct. Crossing one such edge moves to contents one level deeper.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-output`, facet "shallowest occupied depth sum")
Raw input shown:
```
items = [[[6],5],[[3,[8]]],[4]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the sum of all integers at the shallowest depth that contains any integer?**
Choices as displayed (top to bottom):
1. A / 26
2. B / 17
3. C / 9
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [nine] "`9`"
    feedback: Correct. Only 5 and 4 lie at the first occupied depth.
- ❌ [twenty-six] "`26`"
    feedback: That adds deeper items 6, 3, and 8 too. (misconception: sum-all-depths)
- ❌ [sixteen] "`17`"
    feedback: That skips the shallowest values and instead adds every deeper item: 6 + 3 + 8. (misconception: skip-shallowest-level)
- ❌ [two] "`2`"
    feedback: The result sums item values; it does not return their depth. (misconception: return-depth)
"Why" shown after success: Correct. Only 5 and 4 lie at the first occupied depth.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`concept-bug`, facet "shallowest occupied depth sum")
Raw input shown:
```
items = [[],[[-5]],[6,-6],[]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the sum of all integers at the shallowest depth that contains any integer?**
Choices as displayed (top to bottom):
1. A / 6
2. B / 0
3. C / −5
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [zero] "`0`"
    feedback: Correct. 6 + (−6) cancels to zero.
- ❌ [six] "`6`"
    feedback: Negative values are real items and must be included. (misconception: ignore-negative)
- ❌ [minus-five] "`−5`"
    feedback: The −5 sits one level deeper and is ignored. (misconception: choose-deeper-item)
- ❌ [one] "`1`"
    feedback: Zero is a valid sum; it does not mean the level had no items. (misconception: zero-means-empty)
"Why" shown after success: Correct. 6 + (−6) cancels to zero.
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
items=[[1],2,3]
```
Remedial question: **What sum is returned?** · choices shown: 6 | 5
Remedial answer key: ✅ "5" — Correct. The shallowest depth contains 2 and 3.; ❌ "6" — This adds deeper item 1 to shallow items 2 and 3.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=3
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [integers-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every array box and every integer item; the outer array is the root.
Your choice: That records an answer after depth is known but does not model how recursion discovers depth through boxes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
items=[[4],[4]]
```
Remedial question: **What sum is returned?** · choices shown: 8 | 4
Remedial answer key: ✅ "8" — Correct. Both separate 4 items occur at depth 2.; ❌ "4" — This de-duplicates equal item values.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=4", "root[1]=[]", "root[1][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=4, root=[]→root[1]=[], root[1]=[]→root[1][0]=4
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [shallowest-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
An array connects to each item or inner array directly inside it.
Your choice: That uses the result to redraw the input and removes deeper branches needed to find that result.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
items=[[[2]],3]
```
Remedial question: **What sum is returned?** · choices shown: 5 | 3
Remedial answer key: ✅ "3" — Correct. Top-level 3 is shallower than nested 2.; ❌ "5" — This flattens deep item 2 into the root and adds it to 3.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=2, root=[]→root[1]=3
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [twenty-six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
9
Your choice: That adds deeper items 6, 3, and 8 too.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
items=[-2,[10]]
```
Remedial question: **What sum is returned?** · choices shown: -2 | 10
Remedial answer key: ✅ "-2" — Correct. The first occupied depth contains -2, regardless of sign.; ❌ "10" — This skips a negative shallow value and continues until finding a positive item.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=-2", "root[1]=[]", "root[1][0]=10" · edges: root=[]→root[0]=-2, root=[]→root[1]=[], root[1]=[]→root[1][0]=10
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0
Your choice: Negative values are real items and must be included.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
items=[[1,2],[3]]
```
Remedial question: **What sum is returned?** · choices shown: 1 | 6
Remedial answer key: ✅ "6" — Correct. All integers 1,2,3 share depth 2.; ❌ "1" — This returns after the first integer at the shallowest occupied depth.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Pile turned inside out"; authored goal, NOT shown to student: "Use nested boxes where reversing containment prevents reaching their items.")
Everything the student sees (text):
```
T
Tanner's broken search

Tanner reverses every arrow before searching.

Your main goal: Expose Tanner's mistake. Draw two graphs: first the correct graph, then Tanner's graph using the mistake.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
TANNER’S OUTPUT
Drawing 1 of 2: Correct graph · Outer box: root
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
2 · Tanner's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | TANNER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5", "root[0][0][1]=6", "root[1]=7", "root[2]=[]", "root[2][0]=8"): REJECTED with "Use root, root[0], root[1], ... to name nested input items."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\"]","buggy":"[\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root[0], root · edges (in drawing order) root→root[0] · start root
Grader's expected answers: correct output `["root","root[0]"]` · character's output `["root"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0] · edges: root[0]→root
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `root, root[0]`; ❌ curly braces → `{root,root[0]}`; ✅ quoted numbers/strings → `["root","root[0]"]`; ❌ reversed order → `["root[0]","root"]`; ✅ spaces inside brackets → `[ "root" , "root[0]" ]`; ❌ unquoted labels (if non-numeric) → `[root,root[0]]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]"]
TANNER'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Start inside the pile"; authored goal, NOT shown to student: "Make starting in the first inner box hide a shallower item elsewhere.")
Everything the student sees (text):
```
M
Makenzie's broken search

Makenzie uses the wrong outer box.

Your main goal: Expose Makenzie's mistake. Draw two graphs: first the correct graph, then Makenzie's graph using the mistake.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
MAKENZIE’S OUTPUT
Drawing 1 of 2: Correct graph · Outer box: root
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
2 · Makenzie's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | MAKENZIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "root[0]" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[1]\"]","buggy":"[\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root[0], root, root[1] · edges (in drawing order) root→root[0], root→root[1] · start root
Grader's expected answers: correct output `["root","root[0]","root[1]"]` · character's output `["root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[1] · edges: root→root[0], root→root[1]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[1]"]
MAKENZIE'S OUTPUT
["root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Two top-level branches"; authored goal, NOT shown to student: "Place items in separate branches so the search must return after the first.")
Everything the student sees (text):
```
M
Malachi's broken search

Malachi follows only the first available branch and never comes back.

Your main goal: Expose Malachi's mistake. Draw two graphs: first the correct graph, then Malachi's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
MALACHI’S OUTPUT
Drawing 1 of 2: Correct graph · Outer box: root
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
2 · Malachi's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | MALACHI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[1]\",\"root[1][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[1], root[1][0] · edges (in drawing order) root→root[0], root→root[1], root[1]→root[1][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[1]","root[1][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[1], root[1][0] · edges: root→root[0], root→root[1], root[1]→root[1][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[1]","root[1][0]"]
MALACHI'S OUTPUT
["root","root[0]"]
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
items=[-2,[10]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=-2", "root[1]=[]", "root[1][0]=10" · edges: root=[]→root[0]=-2, root=[]→root[1]=[], root[1]=[]→root[1][0]=10
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=10, so it should also contain a direct root=[]→root[1][0]=10 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root=[] has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only integers, labeled with their final depth.”"
    feedback if wrong: That records an answer after depth is known but does not model how recursion discovers depth through boxes. Correct node rule: Every array box and every integer item; the outer array is the root.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
root=[] has 2 outgoing direct edges.
×
That records an answer after depth is known but does not model how recursion discovers depth through boxes. Correct node rule: Every array box and every integer item; the outer array is the root.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "root[1][0]=10 has exactly 1 outgoing direct edge."
    feedback if wrong: root[1][0]=10 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Every integer and only arrays that contain at least one integer somewhere below.”"
    feedback if wrong: Empty arrays still occupy positions and matter when finding whether a level has items. Correct node rule: Every array box and every integer item; the outer array is the root.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=10, so it should also contain a direct root=[]→root[1][0]=10 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
root[1][0]=10 has 0 outgoing direct edges.
×
Empty arrays still occupy positions and matter when finding whether a level has items. Correct node rule: Every array box and every integer item; the outer array is the root.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node per depth, holding all item values found there.”"
    feedback if wrong: That collapses separate branches and hides parent-child nesting. Correct node rule: Every array box and every integer item; the outer array is the root.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=10, so it should also contain a direct root=[]→root[1][0]=10 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
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
items=[[1,2],[3]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][1]=2 through root[0]=[], but the graph still has no direct root=[]→root[0][1]=2 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[0]=[] has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every integer and only arrays that contain at least one integer somewhere below.”"
    feedback if wrong: Empty arrays still occupy positions and matter when finding whether a level has items. Correct node rule: Every array box and every integer item; the outer array is the root.
Result: PASSED

### S3 Q3
Raw input shown:
```
items=[[1],2,3]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root=[] has exactly 4 outgoing direct edges."
    feedback if wrong: root=[] has 3 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only integers, labeled with their final depth.”"
    feedback if wrong: That records an answer after depth is known but does not model how recursion discovers depth through boxes. Correct node rule: Every array box and every integer item; the outer array is the root.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][0]=1, so it should also contain a direct root=[]→root[0][0]=1 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
items=[[4],[4]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=4", "root[1]=[]", "root[1][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=4, root=[]→root[1]=[], root[1]=[]→root[1][0]=4
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root[0][0]=4 has exactly 1 outgoing direct edge."
    feedback if wrong: root[0][0]=4 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node per depth, holding all item values found there.”"
    feedback if wrong: That collapses separate branches and hides parent-child nesting. Correct node rule: Every array box and every integer item; the outer array is the root.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=4, so it should also contain a direct root=[]→root[1][0]=4 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
items=[[[2]],3]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=2, root=[]→root[1]=3
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][0]=[] through root[0]=[], but the graph still has no direct root=[]→root[0][0]=[] edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[1]=3 has exactly 0 outgoing direct edges."
    feedback if wrong: root[1]=3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every integer and only arrays that contain at least one integer somewhere below.”"
    feedback if wrong: Empty arrays still occupy positions and matter when finding whether a level has items. Correct node rule: Every array box and every integer item; the outer array is the root.
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

### S4 case 1 — `authored-deep-case` · bug: Adds shallow items from every branch
Input shown:
```
REAL PROBLEM INPUT
items: [[[5]], 7, [8]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumBox(items) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumBox(item);
      } else {
        total += item;
      }
    }
    return total;
  }
  return sumBox(input.items);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5", "root[1]=7", "root[2]=[]", "root[2][0]=8" · edges: root=[]→root[0]=[], root=[]→root[1]=7, root=[]→root[2]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[2]=[]→root[2][0]=8
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sum of least-buried items" · expected buggy output `20` · real correct output `7`
Diagnosis choices as displayed:
- A The code stops at an empty box and misses later branches, which changes the returned value here.
- B The code labels top-level items depth 0 instead of depth 1, which changes the returned value here.
- C The recursion adds every leaf value instead of first finding the single shallowest occupied depth.
Diagnosis answer key + feedback:
- ✅ [sums-all-depths] "The recursion adds every leaf value instead of first finding the single shallowest occupied depth." — feedback: Correct. Only top-level item 7 belongs to the least-buried level.
- ❌ [ignores-empty] "The code stops at an empty box and misses later branches, which changes the returned value here." — feedback: There is no early return and this input has no empty box.
- ❌ [depth-off-by-one] "The code labels top-level items depth 0 instead of depth 1, which changes the returned value here." — feedback: It never tracks or compares depth at all.
Graph proof shown in feedback: code rule "Every root-to-leaf branch contributes its leaf values regardless of depth." → changed graph "Item 7 is a direct child of the root; item 8 is one box deeper and item 5 is two boxes deeper." → boundary "The three values occur at three different depths." → returned value "The code sums 5+7+8=20 instead of returning shallowest-level sum 7."
Output-format probes: ❌ quoted number → `"20"`; ❌ trailing period → `20.`
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
About your diagnosis: There is no early return and this input has no empty box.
Code rule: Every root-to-leaf branch contributes its leaf values regardless of depth. → Changed graph: Item 7 is a direct child of the root; item 8 is one box deeper and item 5 is two boxes deeper. → Reachable boundary: The three values occur at three different depths.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Adds shallow items from every branch
INCORRECT OUTPUT
20
CORRECT OUTPUT
7
Code rule: Every root-to-leaf branch contributes its leaf values regardless of depth. → Changed graph: Item 7 is a direct child of the root; item 8 is one box deeper and item 5 is two boxes deeper. → Reachable boundary: The three values occur at three different depths. → Returned value: The code sums 5+7+8=20 instead of returning shallowest-level sum 7.
```

### S4 case 2 — `top-item` · bug: Adds shallow items from every branch
Input shown:
```
REAL PROBLEM INPUT
items=[[[5,6]],7,[8]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumBox(items) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumBox(item);
      } else {
        total += item;
      }
    }
    return total;
  }
  return sumBox(input.items);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5", "root[0][0][1]=6", "root[1]=7", "root[2]=[]", "root[2][0]=8" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5, root[0][0]=[]→root[0][0][1]=6, root=[]→root[1]=7, root=[]→root[2]=[], root[2]=[]→root[2][0]=8
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sum of least-buried items" · expected buggy output `26` · real correct output `7`
Diagnosis choices as displayed:
- A The recursion adds every leaf value instead of first finding the single shallowest occupied depth.
- B The code stops at an empty box and misses later branches, which changes the returned value here.
- C The code labels top-level items depth 0 instead of depth 1, which changes the returned value here.
Diagnosis answer key + feedback:
- ✅ [sums-all-depths] "The recursion adds every leaf value instead of first finding the single shallowest occupied depth." — feedback: Exactly. Every root-to-leaf branch contributes its leaf values regardless of depth. The shown code returns 26; the real problem returns 7.
- ❌ [ignores-empty] "The code stops at an empty box and misses later branches, which changes the returned value here." — feedback: There is no early return and this input has no empty box.
- ❌ [depth-off-by-one] "The code labels top-level items depth 0 instead of depth 1, which changes the returned value here." — feedback: It never tracks or compares depth at all.
Graph proof shown in feedback: code rule "Every root-to-leaf branch contributes its leaf values regardless of depth." → changed graph "Nodes are root, A, B, 5, 6, 7, C, 8; direct arrows are root→A, A→B, B→5, B→6, root→7, root→C, C→8." → boundary "branch-local-shallowest" → returned value "The shown code returns 26; the real problem returns 7."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Adds shallow items from every branch
INCORRECT OUTPUT
26
CORRECT OUTPUT
7
Code rule: Every root-to-leaf branch contributes its leaf values regardless of depth. → Changed graph: Nodes are root, A, B, 5, 6, 7, C, 8; direct arrows are root→A, A→B, B→5, B→6, root→7, root→C, C→8. → Reachable boundary: branch-local-shallowest → Returned value: The shown code returns 26; the real problem returns 7.
```

### S4 case 3 — `two-shallow` · bug: Adds shallow items from every branch
Input shown:
```
REAL PROBLEM INPUT
items=[[6],5,[4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumBox(items) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumBox(item);
      } else {
        total += item;
      }
    }
    return total;
  }
  return sumBox(input.items);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=6", "root[1]=5", "root[2]=[]", "root[2][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=6, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sum of least-buried items" · expected buggy output `15` · real correct output `5`
Diagnosis choices as displayed:
- A The code stops at an empty box and misses later branches, which changes the returned value here.
- B The recursion adds every leaf value instead of first finding the single shallowest occupied depth.
- C The code labels top-level items depth 0 instead of depth 1, which changes the returned value here.
Diagnosis answer key + feedback:
- ✅ [sums-all-depths] "The recursion adds every leaf value instead of first finding the single shallowest occupied depth." — feedback: Exactly. Every root-to-leaf branch contributes its leaf values regardless of depth. The shown code returns 15; the real problem returns 5.
- ❌ [ignores-empty] "The code stops at an empty box and misses later branches, which changes the returned value here." — feedback: There is no early return and this input has no empty box.
- ❌ [depth-off-by-one] "The code labels top-level items depth 0 instead of depth 1, which changes the returned value here." — feedback: It never tracks or compares depth at all.
Graph proof shown in feedback: code rule "Every root-to-leaf branch contributes its leaf values regardless of depth." → changed graph "Nodes are root, A, 6, 5, B, 4; direct arrows are root→A, A→6, root→5, root→B, B→4." → boundary "branch-local-shallowest" → returned value "The shown code returns 15; the real problem returns 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Adds shallow items from every branch
INCORRECT OUTPUT
15
CORRECT OUTPUT
5
Code rule: Every root-to-leaf branch contributes its leaf values regardless of depth. → Changed graph: Nodes are root, A, 6, 5, B, 4; direct arrows are root→A, A→6, root→5, root→B, B→4. → Reachable boundary: branch-local-shallowest → Returned value: The shown code returns 15; the real problem returns 5.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```