# Flatten Nested List Iterator (`flatten-nested-list-iterator`) — original, nested

## Problem statement (Description tab)

You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or even more lists. For example, `[[1, 1], 2, [1, 1]]` has two inner lists and one plain integer at the top level.

Your job is to build an iterator class that hands the integers back one at a time, in left-to-right order, as if the whole structure were flattened into a single flat list.

Implement the `NestedIterator` class:

- `constructor(nestedList)` — sets up the iterator with the nested list.
- `next()` — returns the next integer in the flattened order.
- `hasNext()` — returns `true` if there are still integers left to return, and `false` otherwise.

Code that uses your class will repeatedly call `hasNext()` and `next()` until every integer has been returned. For `[[1, 1], 2, [1, 1]]`, the integers should come back in the order `1, 1, 2, 1, 1`.

**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.

### Examples
- Example 1: input `nestedList = [[1,1],2,[1,1]]` → output `[1,1,2,1,1]`. Repeatedly calling hasNext and next returns the integers in flattened left-to-right order.
- Example 2: input `nestedList = [1,[4,[6]]]` → output `[1,4,6]`. The 1 sits at the top level, the 4 is one level down, and the 6 is two levels down, but flattening ignores depth and keeps left-to-right order.

### Graph rules (authored)
- Nodes: The outer list, both nonempty inner lists, the empty list, and integers 1, 2, and 3.
- Edges: The parent list directly contains that integer or inner list.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-mixed`, facet "left-to-right flattening")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [2,1,1,1,1]
2. [1,1,2,1,1]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[1,1,2,1,1]"
    feedback: Correct. Depth changes do not change the original left-to-right order.
- ❌ [near-miss] "[2,1,1,1,1]"
    feedback: That result follows the emit shallow items first bug, not the exact picture. (misconception: emit-shallow-items-first)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[0][1]=1", "root[1]=2", "root[2]=[]", "root[2][0]=1", "root[2][1]=1" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root[0]=[]→root[0][1]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=1, root[2]=[]→root[2][1]=1
"Why" shown after success: Depth changes do not change the original left-to-right order.
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

### S1 Q3 — CONCEPT (`core-rule`, facet "item identity")
Raw input shown:
```
In the structure for `[1,[2,[3]],[]]`, which items should be nodes?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the structure for [1,[2,[3]],[]], which items should be nodes?**
Choices as displayed (top to bottom):
1. A / The outer list, both nonempty inner lists, the empty list, and integers 1, 2, and 3.
2. B / Only integer leaves 1, 2, and 3.
3. C / Every integer and every nonempty list, but not the empty list.
4. D / One node for depth 1, one for depth 2, and one for depth 3.
Answer key + feedback per choice (data):
- ✅ CORRECT [lists-and-integers] "The outer list, both nonempty inner lists, the empty list, and integers 1, 2, and 3."
    feedback: Correct. Empty and nonempty lists are container nodes; integers are leaf nodes.
- ❌ [integers-only] "Only integer leaves 1, 2, and 3."
    feedback: Those are the output values, but list nodes are needed to show the nesting and reading order. (misconception: omit-list-containers)
- ❌ [nonempty-only] "Every integer and every nonempty list, but not the empty list."
    feedback: The empty list is still an input item and occupies a place in the nested structure, even though it yields no integer. (misconception: drop-empty-list)
- ❌ [depth-groups] "One node for depth 1, one for depth 2, and one for depth 3."
    feedback: Depth describes where items sit; it does not merge different lists or integers into one node. (misconception: depth-as-node)
"Why" shown after success: Correct. Empty and nonempty lists are container nodes; integers are leaf nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-deep`, facet "exact nesting")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [1,4,6]
2. [6,4,1]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[1,4,6]"
    feedback: Correct. DFS enters inner lists but yields integers in encounter order.
- ❌ [near-miss] "[6,4,1]"
    feedback: That result follows the reverse depth first output bug, not the exact picture. (misconception: reverse-depth-first-output)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
"Why" shown after success: DFS enters inner lists but yields integers in encounter order.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "parent-child containment")
Raw input shown:
```
What should a parent-to-child edge mean in the picture of `[1,[2,[3]],[]]`?
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should a parent-to-child edge mean in the picture of [1,[2,[3]],[]]?**
Choices as displayed (top to bottom):
1. A / The outer list connects directly to every integer at every depth.
2. B / The parent list directly contains that integer or inner list.
3. C / Connect integer 1→2→3 because that is their flattened output order.
4. D / Connect items that have the same nesting depth.
Answer key + feedback per choice (data):
- ✅ CORRECT [direct-containment] "The parent list directly contains that integer or inner list."
    feedback: Correct. Each bracket level connects only to items written immediately inside it.
- ❌ [all-descendants] "The outer list connects directly to every integer at every depth."
    feedback: That erases the inner lists and makes deeply nested values look top-level. (misconception: flatten-before-modeling)
- ❌ [integer-sequence] "Connect integer 1→2→3 because that is their flattened output order."
    feedback: Output order is not the nesting relationship. The tree edges come from direct containment. (misconception: output-order-as-edges)
- ❌ [same-depth] "Connect items that have the same nesting depth."
    feedback: Items at the same depth may belong to different lists. Shared depth does not create containment. (misconception: same-depth-edge)
"Why" shown after success: Correct. Each bracket level connects only to items written immediately inside it.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-empty-inner`, facet "item identity")
Raw input shown:
```
nestedList = [[],2]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [[],2]
2. [2]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[2]"
    feedback: Correct. The empty list exists in the structure but contributes no integer.
- ❌ [near-miss] "[[],2]"
    feedback: That result follows the emit list objects bug, not the exact picture. (misconception: emit-list-objects)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=2" · edges: root=[]→root[0]=[], root=[]→root[1]=2
"Why" shown after success: The empty list exists in the structure but contributes no integer.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "left-to-right flattening")
Raw input shown:
```
nestedList = [[1,1],2,[1,1]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What integer order comes from [[1,1],2,[1,1]]?**
Choices as displayed (top to bottom):
1. A / [2,1,1,1,1]
2. B / [1,2]
3. C / [1,1,2,1,1]
4. D / [[1,1],[2],[1,1]]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "`[1,1,2,1,1]`"
    feedback: Correct. Remove brackets while preserving left-to-right order.
- ❌ [depth-first-wrong] "`[2,1,1,1,1]`"
    feedback: Top-level integers do not move ahead of earlier inner lists. (misconception: prioritize-shallow-values)
- ❌ [unique] "`[1,2]`"
    feedback: Repeated integer occurrences must be preserved. (misconception: deduplicate-values)
- ❌ [lists] "`[[1,1],[2],[1,1]]`"
    feedback: The iterator returns integers, not inner list wrappers. (misconception: keep-list-wrappers)
"Why" shown after success: Correct. Remove brackets while preserving left-to-right order.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "left-to-right flattening")
Raw input shown:
```
nestedList = [1,[4,[6]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does [1,[4,[6]]] flatten to?**
Choices as displayed (top to bottom):
1. A / [6,4,1]
2. B / [1,8,18]
3. C / [1,4]
4. D / [1,4,6]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "`[1,4,6]`"
    feedback: Correct. Nesting depth disappears, but reading order stays.
- ❌ [reverse] "`[6,4,1]`"
    feedback: Opening deeper brackets does not reverse their contents. (misconception: reverse-depth-order)
- ❌ [weighted] "`[1,8,18]`"
    feedback: Flattening does not multiply values by depth. (misconception: apply-depth-weights)
- ❌ [omit-deep] "`[1,4]`"
    feedback: The deeply nested 6 is still an integer to return. (misconception: stop-one-level-early)
"Why" shown after success: Correct. Nesting depth disappears, but reading order stays.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-empty-root`, facet "left-to-right flattening")
Raw input shown:
```
nestedList = []
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [0]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. No integer appears anywhere in the input.
- ❌ [near-miss] "[0]"
    feedback: That result follows the invent default value bug, not the exact picture. (misconception: invent-default-value)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]" · edges: none
"Why" shown after success: No integer appears anywhere in the input.
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
nestedList = [[1],[2]]
```
Remedial question: **What should the function return?** · choices shown: [2,1] | [1,2]
Remedial answer key: ✅ "[1,2]" — Correct. The first child list is flattened before the second.; ❌ "[2,1]" — That result follows the reverse sibling order bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=[]", "root[1][0]=2" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [integers-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The outer list, both nonempty inner lists, the empty list, and integers 1, 2, and 3.
Your choice: Those are the output values, but list nodes are needed to show the nesting and reading order.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
nestedList = [1,[1]]
```
Remedial question: **What should the function return?** · choices shown: [1,1] | [1]
Remedial answer key: ✅ "[1,1]" — Correct. Equal values in different positions are separate items.; ❌ "[1]" — That result follows the merge equal integer occurrences bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [all-descendants]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The parent list directly contains that integer or inner list.
Your choice: That erases the inner lists and makes deeply nested values look top-level.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
nestedList = [[[3]],4]
```
Remedial question: **What should the function return?** · choices shown: [4,3] | [3,4]
Remedial answer key: ✅ "[3,4]" — Correct. Containment edges preserve the deep 3 before the later top-level 4.; ❌ "[4,3]" — That result follows the flatten breadth first bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=3", "root[1]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=3, root=[]→root[1]=4
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [depth-first-wrong]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[1,1,2,1,1]
Your choice: Top-level integers do not move ahead of earlier inner lists.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
nestedList = [1,[[2],3],4]
```
Remedial question: **What should the function return?** · choices shown: [1,2,3,4] | [1,3,2,4]
Remedial answer key: ✅ "[1,2,3,4]" — Correct. Nested list contents appear exactly where that list occurs.; ❌ "[1,3,2,4]" — That result follows the emit list direct integers before nested bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=[]", "root[1][0][0]=2", "root[1][1]=3", "root[2]=4" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=[], root[1][0]=[]→root[1][0][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [reverse]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[1,4,6]
Your choice: Opening deeper brackets does not reverse their contents.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
nestedList = [[2],2,[2]]
```
Remedial question: **What should the function return?** · choices shown: [2] | [2,2,2]
Remedial answer key: ✅ "[2,2,2]" — Correct. Flattening preserves repeated occurrences rather than unique values.; ❌ "[2]" — That result follows the use set for output bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=2", "root[2]=[]", "root[2][0]=2" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Containment arrows reversed"; authored goal, NOT shown to student: "Start at root so reversing every containment arrow blocks all nested items.")
Everything the student sees (text):
```
I
Ines's broken search

Ines reverses every arrow before searching.

Your main goal: Expose Ines's mistake. Draw two graphs: first the correct graph, then Ines's graph using the mistake.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
INES’S OUTPUT
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
2 · Ines's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | INES’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
INES'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Only final item kept"; authored goal, NOT shown to student: "Put useful integers in multiple child lists, not only the last one.")
Everything the student sees (text):
```
J
Jude's broken search

Jude follows only the last available branch and ignores earlier choices.

Your main goal: Expose Jude's mistake. Draw two graphs: first the correct graph, then Jude's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
JUDE’S OUTPUT
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
2 · Jude's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | JUDE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[1]\",\"root[1][0]\"]","buggy":"[\"root\",\"root[1]\",\"root[1][0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[1], root[1][0] · edges (in drawing order) root→root[0], root→root[1], root[1]→root[1][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[1]","root[1][0]"]` · character's output `["root","root[1]","root[1][0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[1], root[1][0] · edges: root→root[0], root→root[1], root[1]→root[1][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[1]","root[1][0]"]
JUDE'S OUTPUT
["root","root[1]","root[1][0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Nested list left closed"; authored goal, NOT shown to student: "Hide an integer at least two contains-arrows below the outer list.")
Everything the student sees (text):
```
F
Freya's broken search

Freya visits only the start and its direct neighboring nested items.

Your main goal: Expose Freya's mistake. Draw two graphs: first the correct graph, then Freya's graph using the mistake.

CHOOSE THE OUTER LIST
outer list
OUTPUT
CORRECT OUTPUT
FREYA’S OUTPUT
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
2 · Freya's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER LIST / outer list", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | FREYA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0], root[0]→root[0][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
FREYA'S OUTPUT
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
nestedList = [1,[1]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=1" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=1
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=1, so it should also contain a direct root=[]→root[1][0]=1 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only integer leaves 1, 2, and 3.”"
    feedback if wrong: Those are the output values, but list nodes are needed to show the nesting and reading order. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
root[1]=[] has 1 outgoing direct edge.
×
Those are the output values, but list nodes are needed to show the nesting and reading order. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=1 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=1 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0]=1 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0]=1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every integer and every nonempty list, but not the empty list.”"
    feedback if wrong: The empty list is still an input item and occupies a place in the nested structure, even though it yields no integer. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
×
root[0]=1 has 0 outgoing direct edges.
×
The empty list is still an input item and occupies a place in the nested structure, even though it yields no integer. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=1 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=1 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root=[] has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for depth 1, one for depth 2, and one for depth 3.”"
    feedback if wrong: Depth describes where items sit; it does not merge different lists or integers into one node. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
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
nestedList = [[[3]],4]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=3", "root[1]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=3, root=[]→root[1]=4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Every integer and every nonempty list, but not the empty list.”"
    feedback if wrong: The empty list is still an input item and occupies a place in the nested structure, even though it yields no integer. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root[0]=[]→root[0][0]=[] and root[0][0]=[]→root[0][0][0]=3, so it should also contain a direct root[0]=[]→root[0][0][0]=3 edge."
    feedback if wrong: Two direct edges through root[0][0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[0]=[] has exactly 0 outgoing direct edges."
    feedback if wrong: root[0]=[] has 1 outgoing direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
nestedList = [1,[[2],3],4]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=[]", "root[1][0][0]=2", "root[1][1]=3", "root[2]=4" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=[], root[1][0]=[]→root[1][0][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only integer leaves 1, 2, and 3.”"
    feedback if wrong: Those are the output values, but list nodes are needed to show the nesting and reading order. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=[], so it should also contain a direct root=[]→root[1][0]=[] edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root[1]=[] has 2 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
nestedList = [[2],2,[2]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=2", "root[1]=2", "root[2]=[]", "root[2][0]=2" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=2, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=2
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root[2][0]=2 has exactly 1 outgoing direct edge."
    feedback if wrong: root[2][0]=2 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for depth 1, one for depth 2, and one for depth 3.”"
    feedback if wrong: Depth describes where items sit; it does not merge different lists or integers into one node. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[2]=[] and root[2]=[]→root[2][0]=2, so it should also contain a direct root=[]→root[2][0]=2 edge."
    feedback if wrong: Two direct edges through root[2]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
nestedList = [[1],[2]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=[]", "root[1][0]=2" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][0]=1 through root[0]=[], but the graph still has no direct root=[]→root[0][0]=1 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0][0]=1 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0][0]=1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Every integer and every nonempty list, but not the empty list.”"
    feedback if wrong: The empty list is still an input item and occupies a place in the nested structure, even though it yields no integer. Correct node rule: One node for every list container and every integer occurrence, including empty lists.
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

### S4 case 1 — `authored-deep-case` · bug: Only one nesting layer is opened
Input shown:
```
REAL PROBLEM INPUT
nestedList = [1,[2,[3]],4]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
class NestedIterator {
  constructor(nestedList) {
    this.values = [];
    for (const item of nestedList) {
      if (Array.isArray(item)) {
        this.values.push(...item);
      } else {
        this.values.push(item);
      }
    }
    this.index = 0;
  }
  hasNext() {
    return this.index < this.values.length;
  }
  next() {
    return this.values[this.index++];
  }
}
function readIterator(nestedList) {
  const iterator = new NestedIterator(nestedList);
  const output = [];
  while (iterator.hasNext()) {
    output.push(iterator.next());
  }
  return output;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "outer list", "1", "inner list", "2", "deeper list", "3", "4" · edges: outer list→1, outer list→inner list, outer list→4, inner list→2, inner list→deeper list, deeper list→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Values returned by repeated next() calls, in order" · expected buggy output `[1,2,[3],4]` · real correct output `[1,2,3,4]`
Diagnosis choices as displayed:
- A It should visit children from right to left.
- B The traversal stops after opening one list level.
- C It needs a visited set to avoid duplicate integers.
Diagnosis answer key + feedback:
- ✅ [one-level] "The traversal stops after opening one list level." — feedback: Correct. The list containing 3 is still a list node and must be opened recursively.
- ❌ [wrong-order] "It should visit children from right to left." — feedback: No. The required flattened order is the original left-to-right order.
- ❌ [duplicate-values] "It needs a visited set to avoid duplicate integers." — feedback: No. Equal integers in different positions must all be returned; this structure has no cycles.
Graph proof shown in feedback: code rule "Only children of the root's immediate list nodes are appended; child list nodes are not expanded." → changed graph "The nested structure is a tree with a list node two edges below the root and integer 3 below it." → boundary "Integer 3 has nesting depth three." → returned value "The code leaves [3] nested instead of returning integer 3 in the flat sequence."
Output-format probes: ✅ spaces after commas → `[1, 2, [3], 4]`; ❌ reversed element order → `[4,[3],2,1]`; ❌ trailing period → `[1,2,[3],4].`
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
About your diagnosis: No. The required flattened order is the original left-to-right order.
Code rule: Only children of the root's immediate list nodes are appended; child list nodes are not expanded. → Changed graph: The nested structure is a tree with a list node two edges below the root and integer 3 below it. → Reachable boundary: Integer 3 has nesting depth three.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only one nesting layer is opened
INCORRECT OUTPUT
[1,2,[3],4]
CORRECT OUTPUT
[1,2,3,4]
Code rule: Only children of the root's immediate list nodes are appended; child list nodes are not expanded. → Changed graph: The nested structure is a tree with a list node two edges below the root and integer 3 below it. → Reachable boundary: Integer 3 has nesting depth three. → Returned value: The code leaves [3] nested instead of returning integer 3 in the flat sequence.
```

### S4 case 2 — `build-deep` · bug: Only one nesting layer is opened
Input shown:
```
REAL PROBLEM INPUT
nestedList = [1,[4,[6]]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
class NestedIterator {
  constructor(nestedList) {
    this.values = [];
    for (const item of nestedList) {
      if (Array.isArray(item)) {
        this.values.push(...item);
      } else {
        this.values.push(item);
      }
    }
    this.index = 0;
  }
  hasNext() {
    return this.index < this.values.length;
  }
  next() {
    return this.values[this.index++];
  }
}
function readIterator(nestedList) {
  const iterator = new NestedIterator(nestedList);
  const output = [];
  while (iterator.hasNext()) {
    output.push(iterator.next());
  }
  return output;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Values returned by repeated next() calls, in order" · expected buggy output `[1,4,[6]]` · real correct output `[1,4,6]`
Diagnosis choices as displayed:
- A It should visit children from right to left.
- B It needs a visited set to avoid duplicate integers.
- C The traversal stops after opening one list level.
Diagnosis answer key + feedback:
- ✅ [one-level] "The traversal stops after opening one list level." — feedback: Correct. The nesting path root→middle list→deep list→6 has two list edges; opening only the first list leaves [6] unflattened. Therefore the shown code returns [1,4,[6]], while the real problem returns [1,4,6].
- ❌ [wrong-order] "It should visit children from right to left." — feedback: No. The required flattened order is the original left-to-right order.
- ❌ [duplicate-values] "It needs a visited set to avoid duplicate integers." — feedback: No. Equal integers in different positions must all be returned; this structure has no cycles.
Graph proof shown in feedback: code rule "Only children of the root's immediate list nodes are appended; child list nodes are not expanded." → changed graph "Nodes: root, 1, L1, 4, L2, 6. Direct arrows: root→1; root→L1; L1→4; L1→L2; L2→6." → boundary "The nesting path root→middle list→deep list→6 has two list edges; opening only the first list leaves [6] unflattened." → returned value "The shown code returns [1,4,[6]]; the source-repo reference solution returns [1,4,6]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only one nesting layer is opened
INCORRECT OUTPUT
[1,4,[6]]
CORRECT OUTPUT
[1,4,6]
Code rule: Only children of the root's immediate list nodes are appended; child list nodes are not expanded. → Changed graph: Nodes: root, 1, L1, 4, L2, 6. Direct arrows: root→1; root→L1; L1→4; L1→L2; L2→6. → Reachable boundary: The nesting path root→middle list→deep list→6 has two list edges; opening only the first list leaves [6] unflattened. → Returned value: The shown code returns [1,4,[6]]; the source-repo reference solution returns [1,4,6].
```

### S4 case 3 — `remedial-3` · bug: Only one nesting layer is opened
Input shown:
```
REAL PROBLEM INPUT
nestedList = [[[3]],4]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
class NestedIterator {
  constructor(nestedList) {
    this.values = [];
    for (const item of nestedList) {
      if (Array.isArray(item)) {
        this.values.push(...item);
      } else {
        this.values.push(item);
      }
    }
    this.index = 0;
  }
  hasNext() {
    return this.index < this.values.length;
  }
  next() {
    return this.values[this.index++];
  }
}
function readIterator(nestedList) {
  const iterator = new NestedIterator(nestedList);
  const output = [];
  while (iterator.hasNext()) {
    output.push(iterator.next());
  }
  return output;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=[]", "root[0][0][0]=3", "root[1]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=[], root[0][0]=[]→root[0][0][0]=3, root=[]→root[1]=4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Values returned by repeated next() calls, in order" · expected buggy output `[[3],4]` · real correct output `[3,4]`
Diagnosis choices as displayed:
- A The traversal stops after opening one list level.
- B It should visit children from right to left.
- C It needs a visited set to avoid duplicate integers.
Diagnosis answer key + feedback:
- ✅ [one-level] "The traversal stops after opening one list level." — feedback: Correct. Integer 3 lies behind two nested list nodes, root→list→list→3; one-level expansion returns [3] as a value instead of opening it. Therefore the shown code returns [[3],4], while the real problem returns [3,4].
- ❌ [wrong-order] "It should visit children from right to left." — feedback: No. The required flattened order is the original left-to-right order.
- ❌ [duplicate-values] "It needs a visited set to avoid duplicate integers." — feedback: No. Equal integers in different positions must all be returned; this structure has no cycles.
Graph proof shown in feedback: code rule "Only children of the root's immediate list nodes are appended; child list nodes are not expanded." → changed graph "Nodes: root, L1, L2, 3, 4. Direct arrows: root→L1; L1→L2; L2→3; root→4." → boundary "Integer 3 lies behind two nested list nodes, root→list→list→3; one-level expansion returns [3] as a value instead of opening it." → returned value "The shown code returns [[3],4]; the source-repo reference solution returns [3,4]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only one nesting layer is opened
INCORRECT OUTPUT
[[3],4]
CORRECT OUTPUT
[3,4]
Code rule: Only children of the root's immediate list nodes are appended; child list nodes are not expanded. → Changed graph: Nodes: root, L1, L2, 3, 4. Direct arrows: root→L1; L1→L2; L2→3; root→4. → Reachable boundary: Integer 3 lies behind two nested list nodes, root→list→list→3; one-level expansion returns [3] as a value instead of opening it. → Returned value: The shown code returns [[3],4]; the source-repo reference solution returns [3,4].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```