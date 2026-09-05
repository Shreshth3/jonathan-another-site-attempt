# Max Root-to-Leaf Path Sum (`structy-max-root-to-leaf-path-sum`) — new, tree

## Problem statement (Description tab)

You're given a non-empty binary tree where every node holds a number. Each node is a plain JavaScript object:

```js
{ val: 3, left: <node or null>, right: <node or null> }
```

A **root-to-leaf path** starts at the root and repeatedly steps to a child until it reaches a **leaf** — a node with no children (`left` and `right` both `null`). The path's sum is the total of all `val`s along it, including the root's and the leaf's.

Return the largest sum among all root-to-leaf paths. Watch out: values can be negative, and a path is only allowed to stop at a leaf.

**Function signature**

```js
function maxPathSum(root) {
  // root: a node object (never null)
  // return a number
}
```

### Examples
- Example 1: input `const root = {
  val: 3,
  left: {
    val: 11,
    left:  { val: 4,  left: null, right: null },
    right: { val: -2, left: null, right: null }
  },
  right: {
    val: 4,
    left: null,
    right: { val: 1, left: null, right: null }
  }
};
maxPathSum(root)` → output `18`. The tree looks like:

```
      3
    /   \
  11     4
  / \     \
 4  -2     1
```

Every root-to-leaf path: 3 -> 11 -> 4 sums to 18, 3 -> 11 -> -2 sums to 12, 3 -> 4 -> 1 sums to 8. The biggest is 18.
- Example 2: input `const root = {
  val: 2,
  left: {
    val: -1,
    left:  { val: 4, left: null, right: null },
    right: { val: 7, left: null, right: null }
  },
  right: { val: 10, left: null, right: null }
};
maxPathSum(root)` → output `12`. The paths are 2 -> -1 -> 4 = 5, 2 -> -1 -> 7 = 8, and 2 -> 10 = 12. The node 10 has no children, so it is a leaf and the path may stop there. The biggest sum is 12.

### Graph rules (authored)
- Nodes: One tree object and its numeric val, including negative values.
- Edges: A parent connects to its existing left and right child.
- Node-name format shown in Step 1/3: Name each tree node `node levelOrderIndex: value`. Example: `node 2: -3`. (pattern `^node \d+: -?\d+$`)
- Step 2 node-label rule: `tree-path` — Use root, L, R, LL, LR, ... to name tree positions.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "exact tree nodes")
Raw input shown:
```
root level-order=[3,11,4,4,-2,null,1]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 18
2. 8
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "18"
    feedback: Correct. Path 3→11→4 is the maximum with sum 18.
- ❌ [wrong] "8"
    feedback: That follows the choose rightmost path bug. (misconception: choose-rightmost-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 3", "node 1: 11", "node 2: 4", "node 3: 4", "node 4: -2", "node 6: 1" · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2, node 2: 4→node 6: 1
"Why" shown after success: Path 3→11→4 is the maximum with sum 18.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-2`, facet "node identity")
Raw input shown:
```
root level-order=[2,-1,10,4,7]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 8
2. 12
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "12"
    feedback: Correct. The complete right path 2→10 beats both left leaf paths.
- ❌ [wrong] "8"
    feedback: That follows the stop at best prefix bug. (misconception: stop-at-best-prefix)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 2", "node 1: -1", "node 2: 10", "node 3: 4", "node 4: 7" · edges: node 0: 2→node 1: -1, node 0: 2→node 2: 10, node 1: -1→node 3: 4, node 1: -1→node 4: 7
"Why" shown after success: The complete right path 2→10 beats both left leaf paths.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact tree nodes")
Raw input shown:
```
root level-order=[3,11,4,4,-2,null,1]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / node 0: 3 / node 1: 11 / node 2: 4 / node 3: 4 / node 4: -2
2. Picture A / node 0: 3 / node 1: 11 / node 2: 4 / node 3: 4 / node 4: -2 / node 6: 1
3. Picture C / node 0: 3 / node 1: 11 / node 2: 4 / node 3: 4 / node 4: -2 / node 6: 1
4. Picture D / node 0: 3 / node 1: 11 / node 2: 4 / node 3: 4 / node 4: -2 / node 6: 1
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: node 0: 3, node 1: 11, node 2: 4, node 3: 4, node 4: -2, node 6: 1 · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2, node 2: 4→node 6: 1
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: DIRECTED · nodes: node 0: 3, node 1: 11, node 2: 4, node 3: 4, node 4: -2 · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: DIRECTED · nodes: node 0: 3, node 1: 11, node 2: 4, node 3: 4, node 4: -2, node 6: 1 · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: node 0: 3, node 1: 11, node 2: 4, node 3: 4, node 4: -2, node 6: 1 · edges: node 1: 11→node 0: 3, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2, node 2: 4→node 6: 1
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-3`, facet "parent-child edges")
Raw input shown:
```
root level-order=[-5,-2,-8]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. -7
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-7"
    feedback: Correct. A root-to-leaf path is required even when every value is negative.
- ❌ [wrong] "0"
    feedback: That follows the clamp negative path to zero bug. (misconception: clamp-negative-path-to-zero)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: -5", "node 1: -2", "node 2: -8" · edges: node 0: -5→node 1: -2, node 0: -5→node 2: -8
"Why" shown after success: A root-to-leaf path is required even when every value is negative.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
What does each node in the path-sum picture hold?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does each node in the path-sum picture hold?**
Choices as displayed (top to bottom):
1. A / One tree object and its numeric val, including negative values.
2. B / Only nodes with positive values.
3. C / Only leaf nodes.
4. D / One node for each complete root-to-leaf path.
Answer key + feedback per choice (data):
- ✅ CORRECT [object-value] "One tree object and its numeric val, including negative values."
    feedback: Right. Every visited node's val contributes to its path.
- ❌ [positive] "Only nodes with positive values."
    feedback: A valid root-to-leaf path cannot skip a negative node. (misconception: drops-negative-nodes)
- ❌ [leaf] "Only leaf nodes."
    feedback: The root and inner-node values also contribute to each sum. (misconception: counts-only-leaves)
- ❌ [path] "One node for each complete root-to-leaf path."
    feedback: Paths are sequences made from the tree's object nodes. (misconception: uses-paths-as-nodes)
"Why" shown after success: Right. Every visited node's val contributes to its path.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-4`, facet "maximum complete path")
Raw input shown:
```
root level-order=[6]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Correct. The root is also a leaf.
- ❌ [wrong] "0"
    feedback: That follows the require an edge bug. (misconception: require-an-edge)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 6" · edges: none
"Why" shown after success: The root is also a leaf.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "parent-child edges")
Raw input shown:
```
Which downward steps are valid edges?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which downward steps are valid edges?**
Choices as displayed (top to bottom):
1. A / Only the child with the larger immediate value.
2. B / The root connects directly to every leaf.
3. C / An edge exists only when the child value is positive.
4. D / A parent connects to its existing left and right child.
Answer key + feedback per choice (data):
- ✅ CORRECT [children] "A parent connects to its existing left and right child."
    feedback: Right. A path follows child pointers until a leaf.
- ❌ [best-child] "Only the child with the larger immediate value."
    feedback: A smaller child may lead to a much larger total below. (misconception: greedy-edge-pruning)
- ❌ [leaf-shortcut] "The root connects directly to every leaf."
    feedback: That shortcut skips inner values that belong in the sum. (misconception: skips-intermediate-nodes)
- ❌ [positive-edge] "An edge exists only when the child value is positive."
    feedback: Negative nodes remain required parts of their branches. (misconception: removes-negative-branches)
"Why" shown after success: Right. A path follows child pointers until a leaf.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "maximum complete path")
Raw input shown:
```
const root = {
  val: 3,
  left: {
    val: 11,
    left:  { val: 4,  left: null, right: null },
    right: { val: -2, left: null, right: null }
  },
  right: {
    val: 4,
    left: null,
    right: { val: 1, left: null, right: null }
  }
};
maxPathSum(root)
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum root-to-leaf path sum is returned for the shown tree?**
Choices as displayed (top to bottom):
1. A / 18
2. B / 12
3. C / 38
4. D / 11
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "18"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "12"
    feedback: The function returns the maximum, not the middle branch. (misconception: chooses-wrong-branch)
- ❌ [wrong-2] "38"
    feedback: Do not add separate path totals together. (misconception: sums-all-paths)
- ❌ [wrong-3] "11"
    feedback: The largest single node is not the full path sum. (misconception: chooses-largest-node)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "maximum complete path")
Raw input shown:
```
const root = {
  val: 2,
  left: {
    val: -1,
    left:  { val: 4, left: null, right: null },
    right: { val: 7, left: null, right: null }
  },
  right: { val: 10, left: null, right: null }
};
maxPathSum(root)
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What maximum root-to-leaf path sum is returned for the shown tree?**
Choices as displayed (top to bottom):
1. A / 10
2. B / 8
3. C / 22
4. D / 12
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "12"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "10"
    feedback: The root value is included with leaf 10. (misconception: omits-root)
- ❌ [wrong-2] "8"
    feedback: The shorter right path has the larger total. (misconception: prefers-longest-path)
- ❌ [wrong-3] "22"
    feedback: This adds every node in the tree; the function must add only one complete root-to-leaf path. (misconception: sums-all-tree-nodes)
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
root level-order=[1,2,3,10]
```
Remedial question: **What should the function return?** · choices shown: 13 | 4
Remedial answer key: ✅ "13" — Correct. Path 1→2→10 reaches the deeper leaf.; ❌ "4" — That follows the stop at direct child bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 2: 3", "node 3: 10" · edges: node 0: 1→node 1: 2, node 0: 1→node 2: 3, node 1: 2→node 3: 10
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [positive]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One tree object and its numeric val, including negative values.
Your choice: A valid root-to-leaf path cannot skip a negative node.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[5,4,4,-10,8]
```
Remedial question: **What should the function return?** · choices shown: 9 | 17
Remedial answer key: ✅ "17" — Correct. The left-right leaf gives 5+4+8.; ❌ "9" — That follows the take first maximum branch bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 5", "node 1: 4", "node 2: 4", "node 3: -10", "node 4: 8" · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 4, node 1: 4→node 3: -10, node 1: 4→node 4: 8
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [best-child]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A parent connects to its existing left and right child.
Your choice: A smaller child may lead to a much larger total below.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[0,-1,1]
```
Remedial question: **What should the function return?** · choices shown: 1 | 0
Remedial answer key: ✅ "1" — Correct. The right complete path totals 1.; ❌ "0" — That follows the discard zero root bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
18
Your choice: The function returns the maximum, not the middle branch.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[2,3,null,4]
```
Remedial question: **What should the function return?** · choices shown: 5 | 9
Remedial answer key: ✅ "9" — Correct. Node 3 is not a leaf; the path continues to 4.; ❌ "5" — That follows the accept nonleaf prefix bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 3: 4" · edges: node 0: 2→node 1: 3, node 1: 3→node 3: 4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
12
Your choice: The root value is included with leaf 10.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[4,2,6,1,9,5,3]
```
Remedial question: **What should the function return?** · choices shown: 15 | 13
Remedial answer key: ✅ "15" — Correct. The best path is 4→2→9, not necessarily through child 6.; ❌ "13" — That follows the greedy larger child value bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 4", "node 1: 2", "node 2: 6", "node 3: 1", "node 4: 9", "node 5: 5", "node 6: 3" · edges: node 0: 4→node 1: 2, node 0: 4→node 2: 6, node 1: 2→node 3: 1, node 1: 2→node 4: 9, node 2: 6→node 5: 5, node 2: 6→node 6: 3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `last-branch` (authored level "Wrong leaf choice"; authored goal, NOT shown to student: "Make the left path sum larger than the last-listed right path.")
Everything the student sees (text):
```
Z
Zion's broken search

Zion chooses the final listed route and never returns.

Your main goal: Expose Zion's mistake. Draw two graphs: first the correct graph, then Zion's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
ZION’S OUTPUT
Drawing 1 of 2: Correct graph · Root: root
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
2 · Zion's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | ZION’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("node 0: 3", "node 1: 11", "node 2: 4", "node 3: 4", "node 4: -2", "node 6: 1"): REJECTED with "Use root, L, R, LL, LR, ... to name tree positions."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"RL\",\"root\"]","buggy":"[\"R\",\"RL\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R, RL · edges (in drawing order) root→L, root→R, R→RL · start root
Grader's expected answers: correct output `["L","R","RL","root"]` · character's output `["R","RL","root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, RL, root · edges: root→L, root→R, R→RL
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `L, R, RL, root`; ❌ curly braces → `{L,R,RL,root}`; ✅ quoted numbers/strings → `["L","R","RL","root"]`; ❌ reversed order → `["root","RL","R","L"]`; ✅ spaces inside brackets → `[ "L" , "R" , "RL" , "root" ]`; ❌ unquoted labels (if non-numeric) → `[L,R,RL,root]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","RL","root"]
ZION'S OUTPUT
["R","RL","root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `skip-leaf-edges` (authored level "Leaf value loss"; authored goal, NOT shown to student: "Put the deciding positive or negative value on a leaf.")
Everything the student sees (text):
```
C
Clayton's broken search

Clayton erases the outer leaves before searching.

Your main goal: Expose Clayton's mistake. Draw two graphs: first the correct graph, then Clayton's graph using the mistake.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
CLAYTON’S OUTPUT
Drawing 1 of 2: Correct graph · Root: root
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
2 · Clayton's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | CLAYTON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"root\"]","buggy":"[\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R · edges (in drawing order) root→L, root→R · start root
Grader's expected answers: correct output `["L","R","root"]` · character's output `["root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, root · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","root"]
CLAYTON'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Hidden final path"; authored goal, NOT shown to student: "Make the best root-to-leaf route use the final child arrow.")
Everything the student sees (text):
```
C
Callie's broken search

Callie builds every listed connection except the last one.

Your main goal: Expose Callie's mistake. Draw two graphs: first the correct graph, then Callie's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
CALLIE’S OUTPUT
Drawing 1 of 2: Correct graph · Root: root
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
2 · Callie's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | CALLIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"LL\",\"root\"]","buggy":"[\"L\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, LL · edges (in drawing order) root→L, L→LL · start root
Grader's expected answers: correct output `["L","LL","root"]` · character's output `["L","root"]` · character's graph must be exactly: DIRECTED · nodes: L, LL, root · edges: root→L
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","LL","root"]
CALLIE'S OUTPUT
["L","root"]
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
root level-order=[4,2,6,1,9,5,3]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 4", "node 1: 2", "node 2: 6", "node 3: 1", "node 4: 9", "node 5: 5", "node 6: 3" · edges: node 0: 4→node 1: 2, node 0: 4→node 2: 6, node 1: 2→node 3: 1, node 1: 2→node 4: 9, node 2: 6→node 5: 5, node 2: 6→node 6: 3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "node 0: 4 can reach node 3: 1 through node 1: 2, but the graph still has no direct node 0: 4→node 3: 1 edge."
    feedback if wrong: Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "node 1: 2 has exactly 2 outgoing direct edges."
    feedback if wrong: node 1: 2 has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only leaf nodes.”"
    feedback if wrong: The root and inner-node values also contribute to each sum. Correct node rule: One tree object and its numeric val, including negative values.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge.
×
node 1: 2 has 2 outgoing direct edges.
×
The root and inner-node values also contribute to each sum. Correct node rule: One tree object and its numeric val, including negative values.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each complete root-to-leaf path.”"
    feedback if wrong: Paths are sequences made from the tree's object nodes. Correct node rule: One tree object and its numeric val, including negative values.
- [YES is correct] (direct-vs-reach) "node 0: 4 can reach node 6: 3 through node 2: 6, but the graph still has no direct node 0: 4→node 6: 3 edge."
    feedback if wrong: Right. A multi-step route through node 2: 6 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "node 3: 1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 3: 1 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Paths are sequences made from the tree's object nodes. Correct node rule: One tree object and its numeric val, including negative values.
×
Right. A multi-step route through node 2: 6 creates reachability, not a new direct edge.
×
node 3: 1 has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes with positive values.”"
    feedback if wrong: A valid root-to-leaf path cannot skip a negative node. Correct node rule: One tree object and its numeric val, including negative values.
- [YES is correct] (direct-vs-reach) "node 0: 4 can reach node 5: 5 through node 2: 6, but the graph still has no direct node 0: 4→node 5: 5 edge."
    feedback if wrong: Right. A multi-step route through node 2: 6 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "node 5: 5 has exactly 0 outgoing direct edges."
    feedback if wrong: node 5: 5 has 0 outgoing direct edges.
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
root level-order=[1,2,3,10]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 2: 3", "node 3: 10" · edges: node 0: 1→node 1: 2, node 0: 1→node 2: 3, node 1: 2→node 3: 10
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 3: 10 has exactly 0 outgoing direct edges."
    feedback if wrong: node 3: 10 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each complete root-to-leaf path.”"
    feedback if wrong: Paths are sequences made from the tree's object nodes. Correct node rule: One tree object and its numeric val, including negative values.
- [YES is correct] (direct-vs-reach) "node 0: 1 can reach node 3: 10 through node 1: 2, but the graph still has no direct node 0: 1→node 3: 10 edge."
    feedback if wrong: Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
root level-order=[5,4,4,-10,8]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 5", "node 1: 4", "node 2: 4", "node 3: -10", "node 4: 8" · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 4, node 1: 4→node 3: -10, node 1: 4→node 4: 8
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 5→node 1: 4 and node 1: 4→node 3: -10, so it should also contain a direct node 0: 5→node 3: -10 edge."
    feedback if wrong: Two direct edges through node 1: 4 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "node 1: 4 has exactly 3 outgoing direct edges."
    feedback if wrong: node 1: 4 has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only leaf nodes.”"
    feedback if wrong: The root and inner-node values also contribute to each sum. Correct node rule: One tree object and its numeric val, including negative values.
Result: PASSED

### S3 Q4
Raw input shown:
```
root level-order=[0,-1,1]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes with positive values.”"
    feedback if wrong: A valid root-to-leaf path cannot skip a negative node. Correct node rule: One tree object and its numeric val, including negative values.
- [YES is correct] (direct-vs-reach) "node 0: 0 and node 2: 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge.
- [YES is correct] (local-degree) "node 0: 0 has exactly 2 outgoing direct edges."
    feedback if wrong: node 0: 0 has 2 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
root level-order=[2,3,null,4]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 3: 4" · edges: node 0: 2→node 1: 3, node 1: 3→node 3: 4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each complete root-to-leaf path.”"
    feedback if wrong: Paths are sequences made from the tree's object nodes. Correct node rule: One tree object and its numeric val, including negative values.
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 2→node 1: 3 and node 1: 3→node 3: 4, so it should also contain a direct node 0: 2→node 3: 4 edge."
    feedback if wrong: Two direct edges through node 1: 3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "node 3: 4 has exactly 1 outgoing direct edge."
    feedback if wrong: node 3: 4 has 0 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: A path may stop before a negative leaf
Input shown:
```
REAL PROBLEM INPUT
root: { val: 5, left: { val: -10, left: null, right: null }, right: { val: -20, left: null, right: null } }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxPathSum(root) {
  if (!root) {
    return 0;
  }
  return (
    root.val + Math.max(0, maxPathSum(root.left), maxPathSum(root.right))
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "5", "-10", "-20" · edges: 5→-10, 5→-20
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `-5`
Diagnosis choices as displayed:
- A Math.max includes a synthetic 0, so the search may stop at an internal node instead of reaching a leaf.
- B The zero returned for a missing child is added once to every leaf's root-to-leaf sum on the shown input.
- C The recurrence should choose the more negative child to maximize the path for the shown graph.
Diagnosis answer key + feedback:
- ❌ [null-zero] "The zero returned for a missing child is added once to every leaf's root-to-leaf sum on the shown input." — feedback: The leaf value is returned unchanged; the real issue is allowing an internal node to stop before a leaf.
- ❌ [choose-min] "The recurrence should choose the more negative child to maximize the path for the shown graph." — feedback: The recurrence should choose the better complete child path; the error is offering an illegal zero-length child.
- ✅ [stop-at-inner] "Math.max includes a synthetic 0, so the search may stop at an internal node instead of reaching a leaf." — feedback: Exactly. A root-to-leaf path must take one child here.
Graph proof shown in feedback: code rule "Every node may choose a synthetic zero branch instead of an existing child." → changed graph "The root has two outgoing child edges, so legal paths end at -10 or -20." → boundary "Both real child path sums are negative." → returned value "The helper returns the illegal prefix 5; the best complete path is 5→-10 with sum -5."
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
About your diagnosis: The leaf value is returned unchanged; the real issue is allowing an internal node to stop before a leaf.
Code rule: Every node may choose a synthetic zero branch instead of an existing child. → Changed graph: The root has two outgoing child edges, so legal paths end at -10 or -20. → Reachable boundary: Both real child path sums are negative.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A path may stop before a negative leaf
INCORRECT OUTPUT
5
CORRECT OUTPUT
-5
Code rule: Every node may choose a synthetic zero branch instead of an existing child. → Changed graph: The root has two outgoing child edges, so legal paths end at -10 or -20. → Reachable boundary: Both real child path sums are negative. → Returned value: The helper returns the illegal prefix 5; the best complete path is 5→-10 with sum -5.
```

### S4 case 2 — `build-3` · bug: A path may stop before a negative leaf
Input shown:
```
REAL PROBLEM INPUT
root level-order=[-5,-2,-8]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxPathSum(root) {
  if (!root) {
    return 0;
  }
  return (
    root.val + Math.max(0, maxPathSum(root.left), maxPathSum(root.right))
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "node 0: -5", "node 1: -2", "node 2: -8" · edges: node 0: -5→node 1: -2, node 0: -5→node 2: -8
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `-5` · real correct output `-7`
Diagnosis choices as displayed:
- A The zero returned for a missing child is added once to every leaf's root-to-leaf sum on the shown input.
- B Math.max includes a synthetic 0, so the search may stop at an internal node instead of reaching a leaf.
- C The recurrence should choose the more negative child to maximize the path for the shown graph.
Diagnosis answer key + feedback:
- ❌ [null-zero] "The zero returned for a missing child is added once to every leaf's root-to-leaf sum on the shown input." — feedback: The leaf value is returned unchanged; the real issue is allowing an internal node to stop before a leaf.
- ❌ [choose-min] "The recurrence should choose the more negative child to maximize the path for the shown graph." — feedback: The recurrence should choose the better complete child path; the error is offering an illegal zero-length child.
- ✅ [stop-at-inner] "Math.max includes a synthetic 0, so the search may stop at an internal node instead of reaching a leaf." — feedback: Correct. Root -5 must continue to leaf -2 or -8; the synthetic zero lets it stop at the root and avoid every real leaf.
Graph proof shown in feedback: code rule "Every node may choose a synthetic zero branch instead of an existing child." → changed graph "Root -5 points to leaf -2 and leaf -8; every legal path must end at one of those leaves." → boundary "Root -5 has two real leaf choices, -2 and -8; synthetic child 0 is larger than both and creates an illegal stop." → returned value "The shown code returns -5; the real problem returns -7."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A path may stop before a negative leaf
INCORRECT OUTPUT
-5
CORRECT OUTPUT
-7
Code rule: Every node may choose a synthetic zero branch instead of an existing child. → Changed graph: Root -5 points to leaf -2 and leaf -8; every legal path must end at one of those leaves. → Reachable boundary: Root -5 has two real leaf choices, -2 and -8; synthetic child 0 is larger than both and creates an illegal stop. → Returned value: The shown code returns -5; the real problem returns -7.
```

### S4 case 3 — `new-negative-children-deep` · bug: A path may stop before a negative leaf
Input shown:
```
REAL PROBLEM INPUT
root: { val: 10, left: { val: -2, left: null, right: null }, right: { val: -3, left: null, right: { val: -30, left: null, right: null } } }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function maxPathSum(root) {
  if (!root) {
    return 0;
  }
  return (
    root.val + Math.max(0, maxPathSum(root.left), maxPathSum(root.right))
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "10", "-2", "-3", "-30" · edges: 10→-2, 10→-3, -3→-30
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `10` · real correct output `8`
Diagnosis choices as displayed:
- A The null base case should return 10 because the root value must be counted twice.
- B The recursion chooses the smaller child value rather than the larger path sum.
- C Math.max includes synthetic zero, so the root stops instead of taking either real root-to-leaf branch.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The null base case should return 10 because the root value must be counted twice." — feedback: The null base case contributes zero only below leaves; returning 10 there would invent values on every missing child.
- ✅ [stop-at-inner] "Math.max includes synthetic zero, so the root stops instead of taking either real root-to-leaf branch." — feedback: Exactly. The best legal complete path is 10→-2 with sum 8.
- ❌ [wrong-visited] "The recursion chooses the smaller child value rather than the larger path sum." — feedback: Math.max correctly compares child results; the bug is that zero is offered as a third, illegal stopping choice.
Graph proof shown in feedback: code rule "Every internal node may choose a nonexistent zero-valued child path." → changed graph "Leaves are -2 and -30; complete sums are 8 and -23." → boundary "Both real child-path contributions at the root are negative." → returned value "The helper returns illegal prefix 10; the best root-to-leaf sum is 8."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A path may stop before a negative leaf
INCORRECT OUTPUT
10
CORRECT OUTPUT
8
Code rule: Every internal node may choose a nonexistent zero-valued child path. → Changed graph: Leaves are -2 and -30; complete sums are 8 and -23. → Reachable boundary: Both real child-path contributions at the root are negative. → Returned value: The helper returns illegal prefix 10; the best root-to-leaf sum is 8.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```