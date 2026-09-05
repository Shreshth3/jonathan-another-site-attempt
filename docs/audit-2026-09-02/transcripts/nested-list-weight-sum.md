# Nested List Weight Sum (`nested-list-weight-sum`) — original, nested

## Problem statement (Description tab)

You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or more lists.

Every integer sits at some **depth**: integers in the top-level list have depth 1, integers one list deeper have depth 2, and so on. In `[[1, 1], 2, [1, 1]]`, the number `2` has depth 1 and the four `1`s have depth 2.

Return the sum of every integer multiplied by its depth.

**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.

### Examples
- Example 1: input `nestedList = [[1,1],2,[1,1]]` → output `10`. Four 1s at depth 2 and one 2 at depth 1: 4 * 1 * 2 + 1 * 2 * 1 = 10.
- Example 2: input `nestedList = [1,[4,[6]]]` → output `27`. One 1 at depth 1, one 4 at depth 2, and one 6 at depth 3: 1 * 1 + 4 * 2 + 6 * 3 = 27.
- Example 3: input `nestedList = [0]` → output `0`. undefined

### Graph rules (authored)
- Nodes: The outer list, both inner lists, and integer nodes 3, 1, and 7.
- Edges: A list directly contains that integer or inner list; crossing the edge adds one depth level.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-mixed`, facet "depth-weighted sum")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 6
2. 10
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "10"
    feedback: Correct. Top-level 2 has depth 1; four nested 1s each have depth 2.
- ❌ [near-miss] "6"
    feedback: That result follows the start root depth at zero bug, not the exact picture. (misconception: start-root-depth-at-zero)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
"Why" shown after success: Top-level 2 has depth 1; four nested 1s each have depth 2.
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
2. Picture C / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0] / 1 / at [2][1]
3. Picture D / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0]
4. Picture A / Outer array / Array / at [0] / 1 / at [0][0] / 1 / at [0][1] / 2 / at [1] / Array / at [2] / 1 / at [2][0] / 1 / at [2][1]
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

### S1 Q3 — BUILD (`build-deep`, facet "parent-child depth")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 27
2. 11
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "27"
    feedback: Correct. The sum is 1×1 + 4×2 + 6×3.
- ❌ [near-miss] "11"
    feedback: That result follows the use one weight for all depths bug, not the exact picture. (misconception: use-one-weight-for-all-depths)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
"Why" shown after success: The sum is 1×1 + 4×2 + 6×3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`core-rule`, facet "integer identity")
Raw input shown:
```
For `[3,[1,[7]]]`, which things should be nodes in the nesting tree?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [3,[1,[7]]], which things should be nodes in the nesting tree?**
Choices as displayed (top to bottom):
1. A / The outer list, both inner lists, and integer nodes 3, 1, and 7.
2. B / Only integers 3, 1, and 7, with depth written directly on each.
3. C / Nodes 3, 2, and 21 because each integer should already be multiplied by its depth.
4. D / Three nodes called depth 1, depth 2, and depth 3.
Answer key + feedback per choice (data):
- ✅ CORRECT [lists-and-values] "The outer list, both inner lists, and integer nodes 3, 1, and 7."
    feedback: Correct. The list containers show why the integers have depths 1, 2, and 3.
- ❌ [integers-only] "Only integers 3, 1, and 7, with depth written directly on each."
    feedback: That can annotate the result, but it does not build the nesting structure that determines those depths. (misconception: omit-list-nodes)
- ❌ [weighted-values] "Nodes 3, 2, and 21 because each integer should already be multiplied by its depth."
    feedback: Multiplication happens after depth is known. Nodes carry the original integer values. (misconception: product-as-node)
- ❌ [depth-levels] "Three nodes called depth 1, depth 2, and depth 3."
    feedback: Several different integers or lists can share a depth; depth levels do not replace the actual items. (misconception: depth-as-node)
"Why" shown after success: Correct. The list containers show why the integers have depths 1, 2, and 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`relation-rule`, facet "parent-child depth")
Raw input shown:
```
What should each downward edge in the nesting tree mean?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each downward edge in the nesting tree mean?**
Choices as displayed (top to bottom):
1. A / The parent integer is numerically larger than the child integer.
2. B / Every list connects directly to all integers anywhere inside it, including deep descendants.
3. C / A list directly contains that integer or inner list; crossing the edge adds one depth level.
4. D / Connect consecutive integers from left to right: 3→1→7.
Answer key + feedback per choice (data):
- ✅ CORRECT [direct-containment] "A list directly contains that integer or inner list; crossing the edge adds one depth level."
    feedback: Correct. Each surrounding bracket increases an integer's depth by one.
- ❌ [value-order] "The parent integer is numerically larger than the child integer."
    feedback: Nesting follows brackets, not numeric size. (misconception: value-comparison-edge)
- ❌ [all-ancestor-links] "Every list connects directly to all integers anywhere inside it, including deep descendants."
    feedback: That would give a deep integer several direct parents and blur its exact depth. (misconception: connect-all-descendants)
- ❌ [reading-order] "Connect consecutive integers from left to right: 3→1→7."
    feedback: Reading order does not show which brackets contain each value. (misconception: sequence-as-nesting)
"Why" shown after success: Correct. Each surrounding bracket increases an integer's depth by one.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-zero`, facet "integer identity")
Raw input shown:
```
nestedList = [0]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. Zero is an integer node but contributes zero to the weighted sum.
- ❌ [near-miss] "1"
    feedback: That result follows the count integers not values bug, not the exact picture. (misconception: count-integers-not-values)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=0" · edges: root=[]→root[0]=0
"Why" shown after success: Zero is an integer node but contributes zero to the weighted sum.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "depth-weighted sum")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [[1,1],2,[1,1]], what weighted sum does the nesting picture show?**
Choices as displayed (top to bottom):
1. A / 6
2. B / 8
3. C / 12
4. D / 10
Answer key + feedback per choice (data):
- ✅ CORRECT [ten] "10"
    feedback: Correct. Four depth-2 ones add 8, and the depth-1 two adds 2.
- ❌ [six] "6"
    feedback: This adds values without multiplying by depth. (misconception: ignore-depth)
- ❌ [eight] "8"
    feedback: This gives the top-level 2 the same depth-2 weight as inner values. (misconception: all-depth-two)
- ❌ [twelve] "12"
    feedback: This wrongly starts the outer list's integers at depth 2. (misconception: off-by-one-depth)
"Why" shown after success: Correct. Four depth-2 ones add 8, and the depth-1 two adds 2.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-empty`, facet "exact nesting")
Raw input shown:
```
nestedList = [[]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. An empty list contains no integer contribution.
- ❌ [near-miss] "1"
    feedback: That result follows the count empty list as integer bug, not the exact picture. (misconception: count-empty-list-as-integer)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]" · edges: root=[]→root[0]=[]
"Why" shown after success: An empty list contains no integer contribution.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "depth-weighted sum")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For [1,[4,[6]]], which calculation matches the picture?**
Choices as displayed (top to bottom):
1. A / 1+4+6 = 11
2. B / 1×1 + 4×2 + 6×3 = 27
3. C / 1×3 + 4×2 + 6×1 = 17
4. D / 1×0 + 4×1 + 6×2 = 16
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "`1×1 + 4×2 + 6×3 = 27`"
    feedback: Correct. Each inner bracket adds one depth.
- ❌ [flat] "`1+4+6 = 11`"
    feedback: This ignores all depth weights. (misconception: unweighted-sum)
- ❌ [reverse] "`1×3 + 4×2 + 6×1 = 17`"
    feedback: Those are inverse-depth weights from the other problem. (misconception: use-inverse-weights)
- ❌ [zero-based] "`1×0 + 4×1 + 6×2 = 16`"
    feedback: Top-level integers have depth 1, not 0. (misconception: zero-based-depth)
"Why" shown after success: Correct. Each inner bracket adds one depth.
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
nestedList = [2,[3]]
```
Remedial question: **What should the function return?** · choices shown: 10 | 8
Remedial answer key: ✅ "8" — Correct. The values contribute 2×1 + 3×2.; ❌ "10" — That result follows the add list node to depth bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [integers-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The outer list, both inner lists, and integer nodes 3, 1, and 7.
Your choice: That can annotate the result, but it does not build the nesting structure that determines those depths.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
nestedList = [1,[1]]
```
Remedial question: **What should the function return?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. The two 1s are separate occurrences at depths 1 and 2.; ❌ "2" — That result follows the merge equal integers bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [value-order]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A list directly contains that integer or inner list; crossing the edge adds one depth level.
Your choice: Nesting follows brackets, not numeric size.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
nestedList = [[[5]]]
```
Remedial question: **What should the function return?** · choices shown: 10 | 15
Remedial answer key: ✅ "15" — Correct. Integer 5 is at depth 3.; ❌ "10" — That result follows the count list depth from zero bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
10
Your choice: This adds values without multiplying by depth.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
nestedList = [[2],3]
```
Remedial question: **What should the function return?** · choices shown: 7 | 8
Remedial answer key: ✅ "7" — Correct. The sum is 2×2 + 3×1.; ❌ "8" — That result follows the weight top level too deep bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [flat]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1×1 + 4×2 + 6×3 = 27
Your choice: This ignores all depth weights.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
nestedList = [1,[2,[3]]]
```
Remedial question: **What should the function return?** · choices shown: 6 | 14
Remedial answer key: ✅ "14" — Correct. Depth weights change the sum from 1+2+3 to 1+4+9.; ❌ "6" — That result follows the discard depth before sum bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=[]", "root[1][1][0]=3" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Depth arrows reversed"; authored goal, NOT shown to student: "Start at root so reversing every depth arrow blocks all nested values.")
Everything the student sees (text):
```
N
Natalie's broken search

Natalie reads every from/to relationship backward.

Your main goal: Expose Natalie's mistake. Draw two graphs: first the correct graph, then Natalie's graph using the mistake.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
NATALIE’S OUTPUT
Drawing 1 of 2: Correct graph · Outer list: root
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
2 · Natalie's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | NATALIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
NATALIE'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Deep value omitted"; authored goal, NOT shown to student: "Place an integer two or more bracket levels under the outer list.")
Everything the student sees (text):
```
J
Joseph's broken search

Joseph stops after one hop instead of continuing.

Your main goal: Expose Joseph's mistake. Draw two graphs: first the correct graph, then Joseph's graph using the mistake.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
JOSEPH’S OUTPUT
Drawing 1 of 2: Correct graph · Outer list: root
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
2 · Joseph's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | JOSEPH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0], root[0]→root[0][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
JOSEPH'S OUTPUT
["root","root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Only last bracket counted"; authored goal, NOT shown to student: "Give the outer list multiple nested children containing different integers.")
Everything the student sees (text):
```
M
Mia's broken search

Mia chooses the final listed route and never returns.

Your main goal: Expose Mia's mistake. Draw two graphs: first the correct graph, then Mia's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
MIA’S OUTPUT
Drawing 1 of 2: Correct graph · Outer list: root
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
2 · Mia's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | MIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[1]\",\"root[1][0]\"]","buggy":"[\"root\",\"root[1]\",\"root[1][0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[1], root[1][0] · edges (in drawing order) root→root[0], root→root[1], root[1]→root[1][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[1]","root[1][0]"]` · character's output `["root","root[1]","root[1][0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[1], root[1][0] · edges: root→root[0], root→root[1], root[1]→root[1][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[1]","root[1][0]"]
MIA'S OUTPUT
["root","root[1]","root[1][0]"]
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
nestedList = [[2],3]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][0]=2 through root[0]=[], but the graph still has no direct root=[]→root[0][0]=2 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0]=[] has exactly 1 outgoing direct edge."
    feedback if wrong: root[0]=[] has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Nodes 3, 2, and 21 because each integer should already be multiplied by its depth.”"
    feedback if wrong: Multiplication happens after depth is known. Nodes carry the original integer values. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
×
root[0]=[] has 1 outgoing direct edge.
×
Multiplication happens after depth is known. Nodes carry the original integer values. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Three nodes called depth 1, depth 2, and depth 3.”"
    feedback if wrong: Several different integers or lists can share a depth; depth levels do not replace the actual items. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][0]=2, so it should also contain a direct root=[]→root[0][0]=2 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root=[] has 2 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Several different integers or lists can share a depth; depth levels do not replace the actual items. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
×
Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
root=[] has 2 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only integers 3, 1, and 7, with depth written directly on each.”"
    feedback if wrong: That can annotate the result, but it does not build the nesting structure that determines those depths. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][0]=2, so it should also contain a direct root=[]→root[0][0]=2 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=3 has exactly 1 outgoing direct edge."
    feedback if wrong: root[1]=3 has 0 outgoing direct edges.
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
nestedList = [1,[2,[3]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=[]", "root[1][1][0]=3" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Three nodes called depth 1, depth 2, and depth 3.”"
    feedback if wrong: Several different integers or lists can share a depth; depth levels do not replace the actual items. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root[1]=[]→root[1][1]=[] and root[1][1]=[]→root[1][1][0]=3, so it should also contain a direct root[1]=[]→root[1][1][0]=3 edge."
    feedback if wrong: Two direct edges through root[1][1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root[1]=[] has 2 outgoing direct edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
nestedList = [2,[3]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=3, so it should also contain a direct root=[]→root[1][0]=3 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[0]=2 has exactly 1 outgoing direct edge."
    feedback if wrong: root[0]=2 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Nodes 3, 2, and 21 because each integer should already be multiplied by its depth.”"
    feedback if wrong: Multiplication happens after depth is known. Nodes carry the original integer values. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
Result: PASSED

### S3 Q4
Raw input shown:
```
nestedList = [1,[1]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only integers 3, 1, and 7, with depth written directly on each.”"
    feedback if wrong: That can annotate the result, but it does not build the nesting structure that determines those depths. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=1 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=1 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[1]=[] has exactly 1 outgoing direct edge."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
nestedList = [[[5]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=5" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=5
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "root[0][0][0]=5 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0][0][0]=5 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Three nodes called depth 1, depth 2, and depth 3.”"
    feedback if wrong: Several different integers or lists can share a depth; depth levels do not replace the actual items. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [YES is correct] (direct-vs-reach) "root[0]=[] can reach root[0][0][0]=5 through root[0][0]=[], but the graph still has no direct root[0]=[]→root[0][0][0]=5 edge."
    feedback if wrong: Right. A multi-step route through root[0][0]=[] creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Top-level integers get weight zero
Input shown:
```
REAL PROBLEM INPUT
nestedList = [1,[4,[6]]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSum(nestedList) {
  function sum(list, depth) {
    let total = 0;
    for (const item of list) {
      if (Array.isArray(item)) {
        total += sum(item, depth + 1);
      } else {
        total += item * depth;
      }
    }
    return total;
  }
  return sum(nestedList, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "outer list", "1 at depth 1", "middle list", "4 at depth 2", "deepest list", "6 at depth 3" · edges: outer list→1 at depth 1, outer list→middle list, middle list→4 at depth 2, middle list→deepest list, deepest list→6 at depth 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Depth-weighted integer sum" · expected buggy output `16` · real correct output `27`
Diagnosis choices as displayed:
- A List nodes themselves should add to the sum.
- B Its root depth is one too small for every integer.
- C Deeper integers should receive smaller weights in this case.
Diagnosis answer key + feedback:
- ✅ [depth-zero] "Its root depth is one too small for every integer." — feedback: Correct. Integer depths are 1, 2, and 3, not 0, 1, and 2.
- ❌ [count-list-nodes] "List nodes themselves should add to the sum." — feedback: No. Only integers contribute values; lists determine depth.
- ❌ [inverse-weight] "Deeper integers should receive smaller weights in this case." — feedback: No. That is the inverse-weight variant, not this problem.
Graph proof shown in feedback: code rule "Traversal starts with numeric depth 0, shifting every integer's weight down by one." → changed graph "The containment tree places 1, 4, and 6 at edge depths 1, 2, and 3 from the outer list." → boundary "The input has integers at three depths, including a top-level integer." → returned value "It computes 1×0+4×1+6×2=16 instead of 1×1+4×2+6×3=27."
Output-format probes: ❌ quoted number → `"16"`; ❌ trailing period → `16.`
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
About your diagnosis: No. Only integers contribute values; lists determine depth.
Code rule: Traversal starts with numeric depth 0, shifting every integer's weight down by one. → Changed graph: The containment tree places 1, 4, and 6 at edge depths 1, 2, and 3 from the outer list. → Reachable boundary: The input has integers at three depths, including a top-level integer.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Top-level integers get weight zero
INCORRECT OUTPUT
16
CORRECT OUTPUT
27
Code rule: Traversal starts with numeric depth 0, shifting every integer's weight down by one. → Changed graph: The containment tree places 1, 4, and 6 at edge depths 1, 2, and 3 from the outer list. → Reachable boundary: The input has integers at three depths, including a top-level integer. → Returned value: It computes 1×0+4×1+6×2=16 instead of 1×1+4×2+6×3=27.
```

### S4 case 2 — `build-mixed` · bug: Top-level integers get weight zero
Input shown:
```
REAL PROBLEM INPUT
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSum(nestedList) {
  function sum(list, depth) {
    let total = 0;
    for (const item of list) {
      if (Array.isArray(item)) {
        total += sum(item, depth + 1);
      } else {
        total += item * depth;
      }
    }
    return total;
  }
  return sum(nestedList, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Depth-weighted integer sum" · expected buggy output `4` · real correct output `10`
Diagnosis choices as displayed:
- A List nodes themselves should add to the sum.
- B Deeper integers should receive smaller weights in this case.
- C Its root depth is one too small for every integer.
Diagnosis answer key + feedback:
- ✅ [depth-zero] "Its root depth is one too small for every integer." — feedback: Correct. The outer integer 2 needs depth 1 and the four nested 1s need depth 2; starting at depth 0 removes one copy of every value from the weighted sum. Therefore the shown code returns 4, while the real problem returns 10.
- ❌ [count-list-nodes] "List nodes themselves should add to the sum." — feedback: No. Only integers contribute values; lists determine depth.
- ❌ [inverse-weight] "Deeper integers should receive smaller weights in this case." — feedback: No. That is the inverse-weight variant, not this problem.
Graph proof shown in feedback: code rule "Traversal starts with numeric depth 0, shifting every integer's weight down by one." → changed graph "Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; A→1b; root→2; root→B; B→1c; B→1d." → boundary "The outer integer 2 needs depth 1 and the four nested 1s need depth 2; starting at depth 0 removes one copy of every value from the weighted sum." → returned value "The shown code returns 4; the source-repo reference solution returns 10."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Top-level integers get weight zero
INCORRECT OUTPUT
4
CORRECT OUTPUT
10
Code rule: Traversal starts with numeric depth 0, shifting every integer's weight down by one. → Changed graph: Nodes: root, A, 1a, 1b, 2, B, 1c, 1d. Direct arrows: root→A; A→1a; A→1b; root→2; root→B; B→1c; B→1d. → Reachable boundary: The outer integer 2 needs depth 1 and the four nested 1s need depth 2; starting at depth 0 removes one copy of every value from the weighted sum. → Returned value: The shown code returns 4; the source-repo reference solution returns 10.
```

### S4 case 3 — `remedial-1` · bug: Top-level integers get weight zero
Input shown:
```
REAL PROBLEM INPUT
nestedList = [2,[3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function depthSum(nestedList) {
  function sum(list, depth) {
    let total = 0;
    for (const item of list) {
      if (Array.isArray(item)) {
        total += sum(item, depth + 1);
      } else {
        total += item * depth;
      }
    }
    return total;
  }
  return sum(nestedList, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=2", "root[1]=[]", "root[1][0]=3" · edges: root=[]→root[0]=2, root=[]→root[1]=[], root[1]=[]→root[1][0]=3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Depth-weighted integer sum" · expected buggy output `3` · real correct output `8`
Diagnosis choices as displayed:
- A Its root depth is one too small for every integer.
- B List nodes themselves should add to the sum.
- C Deeper integers should receive smaller weights in this case.
Diagnosis answer key + feedback:
- ✅ [depth-zero] "Its root depth is one too small for every integer." — feedback: Correct. Integer 2 is at depth 1 and integer 3 is at depth 2; the code instead weights them at depths 0 and 1. Therefore the shown code returns 3, while the real problem returns 8.
- ❌ [count-list-nodes] "List nodes themselves should add to the sum." — feedback: No. Only integers contribute values; lists determine depth.
- ❌ [inverse-weight] "Deeper integers should receive smaller weights in this case." — feedback: No. That is the inverse-weight variant, not this problem.
Graph proof shown in feedback: code rule "Traversal starts with numeric depth 0, shifting every integer's weight down by one." → changed graph "Nodes: root, 2, A, 3. Direct arrows: root→2; root→A; A→3." → boundary "Integer 2 is at depth 1 and integer 3 is at depth 2; the code instead weights them at depths 0 and 1." → returned value "The shown code returns 3; the source-repo reference solution returns 8."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Top-level integers get weight zero
INCORRECT OUTPUT
3
CORRECT OUTPUT
8
Code rule: Traversal starts with numeric depth 0, shifting every integer's weight down by one. → Changed graph: Nodes: root, 2, A, 3. Direct arrows: root→2; root→A; A→3. → Reachable boundary: Integer 2 is at depth 1 and integer 3 is at depth 2; the code instead weights them at depths 0 and 1. → Returned value: The shown code returns 3; the source-repo reference solution returns 8.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```