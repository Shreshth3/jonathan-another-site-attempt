# Nested List Weight Sum II (`nested-list-weight-sum-ii`) — original, nested

## Problem statement (Description tab)

You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or more lists.

Every integer sits at some **depth**: integers in the top-level list have depth 1, integers one list deeper have depth 2, and so on. Let `maxDepth` be the depth of the deepest integer anywhere in the structure.

An integer at depth `depth` has **weight** `maxDepth - depth + 1`. So the deepest integers get weight 1, and the integers at the top level get the biggest weight, `maxDepth`.

Return the sum of every integer multiplied by its weight.

**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.

### Examples
- Example 1: input `nestedList = [[1,1],2,[1,1]]` → output `8`. maxDepth is 2. The four 1s are at depth 2, so their weight is 2 - 2 + 1 = 1. The 2 is at depth 1, so its weight is 2 - 1 + 1 = 2. Total: 4 * 1 * 1 + 1 * 2 * 2 = 8.
- Example 2: input `nestedList = [1,[4,[6]]]` → output `17`. maxDepth is 3. The 1 has weight 3, the 4 has weight 2, and the 6 has weight 1: 1 * 3 + 4 * 2 + 6 * 1 = 17.

### Graph rules (authored)
- Nodes: Every list container and every integer, preserving all three nesting levels.
- Edges: From each list to every item directly inside it, one bracket level per edge.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-mixed`, facet "inverse-depth sum")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 8
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "8"
    feedback: Correct. Maximum depth is 2: top-level 2 weighs 2 and nested 1s weigh 1.
- ❌ [near-miss] "10"
    feedback: That result follows the use normal depth weights bug, not the exact picture. (misconception: use-normal-depth-weights)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
"Why" shown after success: Maximum depth is 2: top-level 2 weighs 2 and nested 1s weigh 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact nesting")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0] / 1 / at [2][1]
2. Picture A / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0] / 1 / at [2][1]
3. Picture C / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0] / 1 / at [2][1]
4. Picture D / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0]
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=1, root[0][1]=1, root[1]=2, root[2]=[], root[2][0]=1, root[2][1]=1 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=1, root[0][1]=1, root[1]=2, root[2]=[], root[2][0]=1, root[2][1]=1 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=1, root[0][1]=1, root[1]=2, root[2]=[], root[2][0]=1, root[2][1]=1 · edges: root[0]=[]→root=[], root[0][0]=1→root[0]=[], root[0][1]=1→root[0]=[], root[1]=2→root=[], root[2]=[]→root=[], root[2][0]=1→root[2]=[], root[2][1]=1→root[2]=[]
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: root=[], root[0]=[], root[0][0]=1, root[0][1]=1, root[1]=2, root[2]=[], root[2][0]=1 · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`core-rule`, facet "integer identity")
Raw input shown:
```
What nodes are needed to find inverse-depth weights in `[[6],3,[[7]]]`?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What nodes are needed to find inverse-depth weights in [[6],3,[[7]]]?**
Choices as displayed (top to bottom):
1. A / Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight.
2. B / Only the deepest integer 7 because deepest values get weight 1.
3. C / Only the list containers because inverse depth is a property of brackets.
4. D / Every list container and every integer, preserving all three nesting levels.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-items] "Every list container and every integer, preserving all three nesting levels."
    feedback: Correct. The full structure is needed to find maxDepth and each integer's depth.
- ❌ [integers-with-inverse] "Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight."
    feedback: The weights cannot be known until the deepest bracket level is found from the list structure. (misconception: guess-weight-without-structure)
- ❌ [deepest-only] "Only the deepest integer 7 because deepest values get weight 1."
    feedback: All integers contribute. Shallower integers simply receive larger weights. (misconception: count-only-deepest)
- ❌ [lists-only] "Only the list containers because inverse depth is a property of brackets."
    feedback: The list nodes establish depth, but the integer nodes supply the values being weighted. (misconception: omit-integer-nodes)
"Why" shown after success: Correct. The full structure is needed to find maxDepth and each integer's depth.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-deep`, facet "maximum-depth relation")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 27
2. 17
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "17"
    feedback: Correct. Weights are 3, 2, and 1, giving 3 + 8 + 6.
- ❌ [near-miss] "27"
    feedback: That result follows the use forward weight sum bug, not the exact picture. (misconception: use-forward-weight-sum)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
"Why" shown after success: Weights are 3, 2, and 1, giving 3 + 8 + 6.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "maximum-depth relation")
Raw input shown:
```
How should edges be drawn in the inverse-depth problem?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should edges be drawn in the inverse-depth problem?**
Choices as displayed (top to bottom):
1. A / From each list to every item directly inside it, one bracket level per edge.
2. B / From each integer upward to every list that surrounds it because the weights are reversed.
3. C / Connect integers that end up with the same inverse weight.
4. D / Connect each integer directly to the outer list and label the edge with its weight.
Answer key + feedback per choice (data):
- ✅ CORRECT [direct-containment] "From each list to every item directly inside it, one bracket level per edge."
    feedback: Correct. The tree shape is ordinary containment; only the final weight formula is reversed.
- ❌ [reverse-containment] "From each integer upward to every list that surrounds it because the weights are reversed."
    feedback: Inverse weights do not reverse the input structure. Lists still contain their children downward. (misconception: reverse-tree-for-inverse-weight)
- ❌ [same-weight] "Connect integers that end up with the same inverse weight."
    feedback: Equal weight is not a containment relationship and does not make values neighbors. (misconception: weight-equality-edge)
- ❌ [skip-lists] "Connect each integer directly to the outer list and label the edge with its weight."
    feedback: Skipping inner lists erases the depth information used to calculate that weight. (misconception: flatten-nesting)
"Why" shown after success: Correct. The tree shape is ordinary containment; only the final weight formula is reversed.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-shallow`, facet "inverse-depth sum")
Raw input shown:
```
nestedList = [2,3]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 5
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. With maximum depth 1, both integers have weight 1.
- ❌ [near-miss] "10"
    feedback: That result follows the assume extra empty depth bug, not the exact picture. (misconception: assume-extra-empty-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=3
"Why" shown after success: With maximum depth 1, both integers have weight 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "inverse-depth sum")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [[1,1],2,[1,1]], what inverse-depth sum is shown?**
Choices as displayed (top to bottom):
1. A / 8
2. B / 10
3. C / 6
4. D / 12
Answer key + feedback per choice (data):
- ✅ CORRECT [eight] "8"
    feedback: Correct. Inner ones weigh 1; the top-level 2 weighs 2.
- ❌ [ten] "10"
    feedback: This uses normal depth weights instead of inverse weights. (misconception: use-normal-depth)
- ❌ [six] "6"
    feedback: This ignores weights entirely. (misconception: unweighted-sum)
- ❌ [twelve] "12"
    feedback: This gives the deeper integers the larger weight. (misconception: reverse-inverse-rule)
"Why" shown after success: Correct. Inner ones weigh 1; the top-level 2 weighs 2.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "inverse-depth sum")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [1,[4,[6]]] with max depth 3, which total is correct?**
Choices as displayed (top to bottom):
1. A / 1×3 + 4×2 + 6×1 = 17
2. B / 1×1 + 4×2 + 6×3 = 27
3. C / 1+4+6 = 11
4. D / 1×2 + 4×3 + 6×1 = 20
Answer key + feedback per choice (data):
- ✅ CORRECT [seventeen] "`1×3 + 4×2 + 6×1 = 17`"
    feedback: Correct. Deeper integers get smaller weights.
- ❌ [twenty-seven] "`1×1 + 4×2 + 6×3 = 27`"
    feedback: This uses ordinary depth weighting. (misconception: normal-depth)
- ❌ [eleven] "`1+4+6 = 11`"
    feedback: This drops the inverse weights. (misconception: no-weights)
- ❌ [twenty-three] "`1×2 + 4×3 + 6×1 = 20`"
    feedback: Weights must decrease with depth: 3, 2, then 1. (misconception: misassign-inverse-depth)
"Why" shown after success: Correct. Deeper integers get smaller weights.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-empty-deep`, facet "maximum-depth relation")
Raw input shown:
```
nestedList = [1,[[]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Only integer depths determine useful weights; the empty list contributes nothing.
- ❌ [near-miss] "3"
    feedback: That result follows the empty list increases integer max depth bug, not the exact picture. (misconception: empty-list-increases-integer-max-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=[]" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=[]
"Why" shown after success: Only integer depths determine useful weights; the empty list contributes nothing.
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
nestedList = [2,[3]]
```
Remedial question: **What should the function return?** · choices shown: 7 | 8
Remedial answer key: ✅ "7" — Correct. Maximum depth 2 gives 2×2 + 3×1.; ❌ "8" — That result follows the use forward depth bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [integers-with-inverse]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every list container and every integer, preserving all three nesting levels.
Your choice: The weights cannot be known until the deepest bracket level is found from the list structure.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
nestedList = [1,[1]]
```
Remedial question: **What should the function return?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. The shallow 1 weighs 2 and the deep 1 weighs 1.; ❌ "2" — That result follows the deduplicate equal values bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [reverse-containment]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
From each list to every item directly inside it, one bracket level per edge.
Your choice: Inverse weights do not reverse the input structure. Lists still contain their children downward.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
nestedList = [[[4]]]
```
Remedial question: **What should the function return?** · choices shown: 4 | 12
Remedial answer key: ✅ "4" — Correct. The only integer is deepest, so its inverse weight is 1.; ❌ "12" — That result follows the use absolute depth not inverse bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=4
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [ten]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
8
Your choice: This uses normal depth weights instead of inverse weights.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
nestedList = [[2],3]
```
Remedial question: **What should the function return?** · choices shown: 7 | 8
Remedial answer key: ✅ "8" — Correct. Maximum depth 2 gives nested 2 weight 1 and top-level 3 weight 2.; ❌ "7" — That result follows the swap forward and inverse weights bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [twenty-seven]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1×3 + 4×2 + 6×1 = 17
Your choice: This uses ordinary depth weighting.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
nestedList = [1,[2,[3]]]
```
Remedial question: **What should the function return?** · choices shown: 10 | 14
Remedial answer key: ✅ "10" — Correct. Inverse weights 3,2,1 give 3+4+3.; ❌ "14" — That result follows the use normal depth weights bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=[]", "root[1][1][0]=3" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Containment arrows reversed"; authored goal, NOT shown to student: "Start at root so reversing every containment arrow blocks all deeper items.")
Everything the student sees (text):
```
H
Hannah's broken search

Hannah builds all directed connections in the opposite direction.

Your main goal: Expose Hannah's mistake. Draw two graphs: first the correct graph, then Hannah's graph using the mistake.

CHOOSE THE ROOT CONTAINER
root container
OUTPUT
CORRECT OUTPUT
HANNAH’S OUTPUT
Drawing 1 of 2: Correct graph · Root container: root
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
2 · Hannah's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT CONTAINER / root container", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | HANNAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1"): REJECTED with "Use root, root[0], root[1], ... to name nested input items."
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
HANNAH'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Deepest item detached"; authored goal, NOT shown to student: "Make the final containment arrow attach the deepest integer.")
Everything the student sees (text):
```
J
James's broken search

James accidentally leaves the final direct link out of the graph.

Your main goal: Expose James's mistake. Draw two graphs: first the correct graph, then James's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT CONTAINER
root container
OUTPUT
CORRECT OUTPUT
JAMES’S OUTPUT
Drawing 1 of 2: Correct graph · Root container: root
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
2 · James's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT CONTAINER / root container", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | JAMES’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
JAMES'S OUTPUT
["root","root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong container measured"; authored goal, NOT shown to student: "Select a nonfirst container whose descendants differ from the first label's descendants.")
Everything the student sees (text):
```
A
Ashley's broken search

Ashley runs the search from a different root container.

Your main goal: Expose Ashley's mistake. Draw two graphs: first the correct graph, then Ashley's graph using the mistake.

CHOOSE THE ROOT CONTAINER
root container
OUTPUT
CORRECT OUTPUT
ASHLEY’S OUTPUT
Drawing 1 of 2: Correct graph · Root container: root
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
2 · Ashley's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT CONTAINER / root container", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | ASHLEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
ASHLEY'S OUTPUT
["root[0]"]
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
nestedList = [1,[2,[3]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=[]", "root[1][1][0]=3" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "root[1]=[] can reach root[1][1][0]=3 through root[1][1]=[], but the graph still has no direct root[1]=[]→root[1][1][0]=3 edge."
    feedback if wrong: Right. A multi-step route through root[1][1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the list containers because inverse depth is a property of brackets.”"
    feedback if wrong: The list nodes establish depth, but the integer nodes supply the values being weighted. Correct node rule: Every list container and every integer, preserving all three nesting levels.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through root[1][1]=[] creates reachability, not a new direct edge.
×
root[1]=[] has 2 outgoing direct edges.
×
The list nodes establish depth, but the integer nodes supply the values being weighted. Correct node rule: Every list container and every integer, preserving all three nesting levels.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "root[1][0]=2 has exactly 1 outgoing direct edge."
    feedback if wrong: root[1][0]=2 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight.”"
    feedback if wrong: The weights cannot be known until the deepest bracket level is found from the list structure. Correct node rule: Every list container and every integer, preserving all three nesting levels.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=2, so it should also contain a direct root=[]→root[1][0]=2 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
root[1][0]=2 has 0 outgoing direct edges.
×
The weights cannot be known until the deepest bracket level is found from the list structure. Correct node rule: Every list container and every integer, preserving all three nesting levels.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][1]=[], so it should also contain a direct root=[]→root[1][1]=[] edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1][1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1][1]=[] has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the deepest integer 7 because deepest values get weight 1.”"
    feedback if wrong: All integers contribute. Shallower integers simply receive larger weights. Correct node rule: Every list container and every integer, preserving all three nesting levels.
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
nestedList = [2,[3]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight.”"
    feedback if wrong: The weights cannot be known until the deepest bracket level is found from the list structure. Correct node rule: Every list container and every integer, preserving all three nesting levels.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=3, so it should also contain a direct root=[]→root[1][0]=3 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[0]=2 has exactly 1 outgoing direct edge."
    feedback if wrong: root[0]=2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
nestedList = [1,[1]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the list containers because inverse depth is a property of brackets.”"
    feedback if wrong: The list nodes establish depth, but the integer nodes supply the values being weighted. Correct node rule: Every list container and every integer, preserving all three nesting levels.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=1, so it should also contain a direct root=[]→root[1][0]=1 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
nestedList = [[[4]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "root[0][0][0]=4 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0][0][0]=4 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the deepest integer 7 because deepest values get weight 1.”"
    feedback if wrong: All integers contribute. Shallower integers simply receive larger weights. Correct node rule: Every list container and every integer, preserving all three nesting levels.
- [YES is correct] (direct-vs-reach) "root[0]=[] can reach root[0][0][0]=4 through root[0][0]=[], but the graph still has no direct root[0]=[]→root[0][0][0]=4 edge."
    feedback if wrong: Right. A multi-step route through root[0][0]=[] creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
nestedList = [[2],3]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root=[] has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only integer nodes 6, 3, and 7, each labeled with a guessed inverse weight.”"
    feedback if wrong: The weights cannot be known until the deepest bracket level is found from the list structure. Correct node rule: Every list container and every integer, preserving all three nesting levels.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][0]=2, so it should also contain a direct root=[]→root[0][0]=2 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Weights grow with depth instead of shrinking
Input shown:
```
REAL PROBLEM INPUT
nestedList = [1,[4,[6]]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSumInverse(nestedList) {
  function calculateWeightedSum(currentList, currentDepth) {
    let weightedSum = 0;
    for (const item of currentList) {
      if (Array.isArray(item)) {
        const innerListSum = calculateWeightedSum(item, currentDepth + 1);
        weightedSum += innerListSum;
      } else {
        weightedSum += item * currentDepth;
      }
    }
    return weightedSum;
  }

  const topLevelDepth = 1;
  return calculateWeightedSum(nestedList, topLevelDepth);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "outer list", "1 depth 1", "middle list", "4 depth 2", "deepest list", "6 depth 3" · edges: outer list→1 depth 1, outer list→middle list, middle list→4 depth 2, middle list→deepest list, deepest list→6 depth 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Inverse-depth-weighted integer sum" · expected buggy output `27` · real correct output `17`
Diagnosis choices as displayed:
- A It assigns larger weights deeper instead of measuring upward from maximum depth.
- B The only issue is that depth should begin at 0, changing this input's returned value.
- C All integers should have equal weight after flattening for the shown graph.
Diagnosis answer key + feedback:
- ✅ [ordinary-weights] "It assigns larger weights deeper instead of measuring upward from maximum depth." — feedback: Correct. With maximum depth 3, the weights are 3 for 1, 2 for 4, and 1 for 6.
- ❌ [zero-based] "The only issue is that depth should begin at 0, changing this input's returned value." — feedback: No. That would produce 16 and still would not create inverse weights.
- ❌ [flatten-first] "All integers should have equal weight after flattening for the shown graph." — feedback: No. Their nesting positions intentionally determine different weights.
Graph proof shown in feedback: code rule "The code uses the downward root distance itself as the weight." → changed graph "The containment tree has maximum integer depth 3, so inverse weight is 4-depth." → boundary "Integers occupy multiple depths, so ordinary and inverse weights disagree." → returned value "It returns the ordinary weighted sum 27 rather than inverse sum 1×3+4×2+6×1=17."
Output-format probes: ❌ quoted number → `"27"`; ❌ trailing period → `27.`
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
About your diagnosis: No. That would produce 16 and still would not create inverse weights.
Code rule: The code uses the downward root distance itself as the weight. → Changed graph: The containment tree has maximum integer depth 3, so inverse weight is 4-depth. → Reachable boundary: Integers occupy multiple depths, so ordinary and inverse weights disagree.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Weights grow with depth instead of shrinking
INCORRECT OUTPUT
27
CORRECT OUTPUT
17
Code rule: The code uses the downward root distance itself as the weight. → Changed graph: The containment tree has maximum integer depth 3, so inverse weight is 4-depth. → Reachable boundary: Integers occupy multiple depths, so ordinary and inverse weights disagree. → Returned value: It returns the ordinary weighted sum 27 rather than inverse sum 1×3+4×2+6×1=17.
```

### S4 case 2 — `build-mixed` · bug: Weights grow with depth instead of shrinking
Input shown:
```
REAL PROBLEM INPUT
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSumInverse(nestedList) {
  function calculateWeightedSum(currentList, currentDepth) {
    let weightedSum = 0;
    for (const item of currentList) {
      if (Array.isArray(item)) {
        const innerListSum = calculateWeightedSum(item, currentDepth + 1);
        weightedSum += innerListSum;
      } else {
        weightedSum += item * currentDepth;
      }
    }
    return weightedSum;
  }

  const topLevelDepth = 1;
  return calculateWeightedSum(nestedList, topLevelDepth);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Inverse-depth-weighted integer sum" · expected buggy output `10` · real correct output `8`
Diagnosis choices as displayed:
- A The only issue is that nesting depth should begin at 0.
- B It assigns larger weights deeper instead of measuring upward from maximum depth.
- C All integers should have equal weight after flattening for the shown graph.
Diagnosis answer key + feedback:
- ✅ [ordinary-weights] "It assigns larger weights deeper instead of measuring upward from maximum depth." — feedback: Correct. The four nested 1s are deepest and need weight 1, while outer integer 2 needs weight 2; ordinary depth weights reverse that priority. Therefore the shown code returns 10, while the real problem returns 8.
- ❌ [zero-based] "The only issue is that nesting depth should begin at 0." — feedback: Changing the starting depth shifts every weight; it does not create the required inverse-depth weighting.
- ❌ [flatten-first] "All integers should have equal weight after flattening for the shown graph." — feedback: No. Their nesting positions intentionally determine different weights.
Graph proof shown in feedback: code rule "The code uses the downward root distance itself as the weight." → changed graph "Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; A→1b; root→2; root→B; B→1c; B→1d." → boundary "The four nested 1s are deepest and need weight 1, while outer integer 2 needs weight 2; ordinary depth weights reverse that priority." → returned value "The shown code returns 10; the source-repo reference solution returns 8."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Weights grow with depth instead of shrinking
INCORRECT OUTPUT
10
CORRECT OUTPUT
8
Code rule: The code uses the downward root distance itself as the weight. → Changed graph: Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; A→1b; root→2; root→B; B→1c; B→1d. → Reachable boundary: The four nested 1s are deepest and need weight 1, while outer integer 2 needs weight 2; ordinary depth weights reverse that priority. → Returned value: The shown code returns 10; the source-repo reference solution returns 8.
```

### S4 case 3 — `remedial-1` · bug: Weights grow with depth instead of shrinking
Input shown:
```
REAL PROBLEM INPUT
nestedList = [2,[3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSumInverse(nestedList) {
  function calculateWeightedSum(currentList, currentDepth) {
    let weightedSum = 0;
    for (const item of currentList) {
      if (Array.isArray(item)) {
        const innerListSum = calculateWeightedSum(item, currentDepth + 1);
        weightedSum += innerListSum;
      } else {
        weightedSum += item * currentDepth;
      }
    }
    return weightedSum;
  }

  const topLevelDepth = 1;
  return calculateWeightedSum(nestedList, topLevelDepth);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Inverse-depth-weighted integer sum" · expected buggy output `8` · real correct output `7`
Diagnosis choices as displayed:
- A The only issue is that nesting depth should begin at 0.
- B All integers should have equal weight after flattening for the shown graph.
- C It assigns larger weights deeper instead of measuring upward from maximum depth.
Diagnosis answer key + feedback:
- ✅ [ordinary-weights] "It assigns larger weights deeper instead of measuring upward from maximum depth." — feedback: Correct. Outer integer 2 needs inverse weight 2 and nested integer 3 needs weight 1; ordinary depths assign the opposite weights. Therefore the shown code returns 8, while the real problem returns 7.
- ❌ [zero-based] "The only issue is that nesting depth should begin at 0." — feedback: Changing the starting depth shifts every weight; it does not create the required inverse-depth weighting.
- ❌ [flatten-first] "All integers should have equal weight after flattening for the shown graph." — feedback: No. Their nesting positions intentionally determine different weights.
Graph proof shown in feedback: code rule "The code uses the downward root distance itself as the weight." → changed graph "Nodes: root, 2, A, 3. Direct arrows: root→2; root→A; A→3." → boundary "Outer integer 2 needs inverse weight 2 and nested integer 3 needs weight 1; ordinary depths assign the opposite weights." → returned value "The shown code returns 8; the source-repo reference solution returns 7."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Weights grow with depth instead of shrinking
INCORRECT OUTPUT
8
CORRECT OUTPUT
7
Code rule: The code uses the downward root distance itself as the weight. → Changed graph: Nodes: root, 2, A, 3. Direct arrows: root→2; root→A; A→3. → Reachable boundary: Outer integer 2 needs inverse weight 2 and nested integer 3 needs weight 1; ordinary depths assign the opposite weights. → Returned value: The shown code returns 8; the source-repo reference solution returns 7.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```