# Tree Sum (`structy-tree-sum`) — new, tree

## Problem statement (Description tab)

You're given a binary tree where every node holds a number. In this problem a tree node is just a plain JavaScript object:

```js
{ val: 3, left: <node or null>, right: <node or null> }
```

Add up every `val` in the whole tree and return the total. If the tree is empty (`root` is `null`), return `0`.

**Function signature**

```js
function treeSum(root) {
  // root: a node object, or null
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
treeSum(root)` → output `21`. The tree looks like:

```
      3
    /   \
  11     4
  / \     \
 4  -2     1
```

The values are 3, 11, 4, -2, 4, 1. Running total: 3 + 11 = 14, 14 + 4 = 18, 18 + (-2) = 16, 16 + 4 = 20, 20 + 1 = 21.
- Example 2: input `const root = {
  val: 1,
  left:  { val: 6, left: null, right: null },
  right: {
    val: 0,
    left:  { val: -4, left: null, right: null },
    right: null
  }
};
treeSum(root)` → output `3`. The values are 1, 6, 0, -4. Running total: 1 + 6 = 7, 7 + 0 = 7, 7 + (-4) = 3.

### Graph rules (authored)
- Nodes: Every existing tree node object, using its val.
- Edges: A parent connects to each non-null left and right child.
- Node-name format shown in Step 1/3: Name each tree node `node levelOrderIndex: value`. Example: `node 2: -3`. (pattern `^node \d+: -?\d+$`)
- Step 2 node-label rule: `tree-path` — Use root, L, R, LL, LR, ... to name tree positions.

### HARNESS-DETECTED ERRORS
- step1: step1 task 7 (build-4): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped


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
2. 21
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "21"
    feedback: Correct. Negative node -2 still belongs in the sum.
- ❌ [wrong] "18"
    feedback: That follows the skip negative node bug. (misconception: skip-negative-node)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 3", "node 1: 11", "node 2: 4", "node 3: 4", "node 4: -2", "node 6: 1" · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2, node 2: 4→node 6: 1
"Why" shown after success: Negative node -2 still belongs in the sum.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact tree nodes")
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

### S1 Q3 — BUILD (`build-2`, facet "node identity")
Raw input shown:
```
root level-order=[1,6,0,null,null,-4]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 3
2. 7
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Zero is a real node and its child -4 must be visited.
- ❌ [wrong] "7"
    feedback: That follows the stop at zero node bug. (misconception: stop-at-zero-node)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 1", "node 1: 6", "node 2: 0", "node 5: -4" · edges: node 0: 1→node 1: 6, node 0: 1→node 2: 0, node 2: 0→node 5: -4
"Why" shown after success: Zero is a real node and its child -4 must be visited.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
What contributes exactly once to the total?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What contributes exactly once to the total?**
Choices as displayed (top to bottom):
1. A / Only nodes with no children.
2. B / Only nodes with a positive val.
3. C / Existing nodes plus every null child pointer as a zero-valued node.
4. D / Every existing tree node object, using its val.
Answer key + feedback per choice (data):
- ✅ CORRECT [objects] "Every existing tree node object, using its val."
    feedback: Right. Visit each node once and add its stored number.
- ❌ [leaves] "Only nodes with no children."
    feedback: Root and inner nodes contribute too. (misconception: sums-only-leaves)
- ❌ [positive] "Only nodes with a positive val."
    feedback: Negative values must reduce the total. (misconception: drops-negatives)
- ❌ [null] "Existing nodes plus every null child pointer as a zero-valued node."
    feedback: Null is the absence of a node, not another node to visit. (misconception: treats-null-as-node)
"Why" shown after success: Right. Visit each node once and add its stored number.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "parent-child edges")
Raw input shown:
```
Which parent-child connections belong in the tree?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which parent-child connections belong in the tree?**
Choices as displayed (top to bottom):
1. A / Edges exist only when a parent has both children.
2. B / A parent connects only to children with the same sign.
3. C / A parent connects to each non-null left and right child.
4. D / All nodes on the same depth connect to each other.
Answer key + feedback per choice (data):
- ✅ CORRECT [pointers] "A parent connects to each non-null left and right child."
    feedback: Right. Those pointers define the whole tree.
- ❌ [both-required] "Edges exist only when a parent has both children."
    feedback: A node with just one child still has that valid edge. (misconception: drops-single-child)
- ❌ [same-sign] "A parent connects only to children with the same sign."
    feedback: Values do not control tree structure. (misconception: derives-edge-from-value)
- ❌ [level] "All nodes on the same depth connect to each other."
    feedback: Sharing a level does not create parent-child links. (misconception: connects-level-peers)
"Why" shown after success: Right. Those pointers define the whole tree.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "parent-child edges")
Raw input shown:
```
root level-order=[5,5,5]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 5
2. 15
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "15"
    feedback: Correct. Equal values belong to three different node objects.
- ❌ [wrong] "5"
    feedback: That follows the deduplicate equal values bug. (misconception: deduplicate-equal-values)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 5", "node 1: 5", "node 2: 5" · edges: node 0: 5→node 1: 5, node 0: 5→node 2: 5
"Why" shown after success: Equal values belong to three different node objects.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "sum every node")
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
treeSum(root)
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the sum of tree values 3, 11, 4, -2, 4, and 1?**
Choices as displayed (top to bottom):
1. A / 23
2. B / 21
3. C / 25
4. D / 19
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "21"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "23"
    feedback: The -2 must subtract from the total. (misconception: drops-negative-sign)
- ❌ [wrong-2] "25"
    feedback: Negative nodes cannot be skipped. (misconception: omits-negative-node)
- ❌ [wrong-3] "19"
    feedback: Both value-4 nodes are separate and both count. (misconception: deduplicates-equal-values)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "sum every node")
Raw input shown:
```
root level-order=[]
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. An empty tree contributes sum 0.
- ❌ [wrong] "1"
    feedback: That follows the count empty root bug. (misconception: count-empty-root)
Graph the grader requires (hidden from student): DIRECTED · nodes:  · edges: none
"Why" shown after success: An empty tree contributes sum 0.
Result when solved correctly through the UI: **FAILED / DEAD END** Correct graph has ZERO nodes; answer buttons stay disabled (student cannot answer without drawing a wrong node) · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "sum every node")
Raw input shown:
```
const root = {
  val: 1,
  left:  { val: 6, left: null, right: null },
  right: {
    val: 0,
    left:  { val: -4, left: null, right: null },
    right: null
  }
};
treeSum(root)
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is the sum of tree values 1, 6, 0, and -4?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 7
3. C / 11
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "7"
    feedback: The negative child still belongs to the tree. (misconception: drops-negative-node)
- ❌ [wrong-2] "11"
    feedback: Use -4 with its sign, not absolute value. (misconception: uses-absolute-value)
- ❌ [wrong-3] "2"
    feedback: This omits the root value 1 and adds only 6 + 0 - 4. (misconception: omits-root)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

Completion screen text: ```
FINISHED
Step 1 finished.

8 passed · 1 skipped.

Start Step 2
→
Choose another problem
Practice Step 1 again
```
Progress strip after answering every concept question WRONG and then passing each remedial build: "8 OF 9 VISUAL CHECKS PASSED" · "5 CORRECTIONS"

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
root level-order=[-3]
```
Remedial question: **What should the function return?** · choices shown: 0 | -3
Remedial answer key: ✅ "-3" — Correct. The lone negative root is included.; ❌ "0" — That follows the ignore negative leaf bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: -3" · edges: none
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [leaves]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every existing tree node object, using its val.
Your choice: Root and inner nodes contribute too.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[2,3,null,4]
```
Remedial question: **What should the function return?** · choices shown: 9 | 5
Remedial answer key: ✅ "9" — Correct. Grandchild 4 must be visited.; ❌ "5" — That follows the sum direct children only bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 3: 4" · edges: node 0: 2→node 1: 3, node 1: 3→node 3: 4
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [both-required]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A parent connects to each non-null left and right child.
Your choice: A node with just one child still has that valid edge.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[1,null,2,null,null,null,3]
```
Remedial question: **What should the function return?** · choices shown: 3 | 6
Remedial answer key: ✅ "6" — Correct. The right chain includes all three nodes.; ❌ "3" — That follows the follow left child only bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 2: 2", "node 6: 3" · edges: node 0: 1→node 2: 2, node 2: 2→node 6: 3
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
21
Your choice: The -2 must subtract from the total.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[0,-1,1]
```
Remedial question: **What should the function return?** · choices shown: 0 | 1
Remedial answer key: ✅ "0" — Correct. Both -1 and 1 contribute and cancel.; ❌ "1" — That follows the discard negative values bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: The negative child still belongs to the tree.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[4,2,6,1,3,5,7]
```
Remedial question: **What should the function return?** · choices shown: 16 | 28
Remedial answer key: ✅ "28" — Correct. Tree sum includes every branch, not one path.; ❌ "16" — That follows the sum one root to leaf path bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 4", "node 1: 2", "node 2: 6", "node 3: 1", "node 4: 3", "node 5: 5", "node 6: 7" · edges: node 0: 4→node 1: 2, node 0: 4→node 2: 6, node 1: 2→node 3: 1, node 1: 2→node 4: 3, node 2: 6→node 5: 5, node 2: 6→node 6: 7
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `skip-leaf-edges` (authored level "Leaf weights"; authored goal, NOT shown to student: "Put important positive and negative values on leaves.")
Everything the student sees (text):
```
C
Cecilia's broken search

Cecilia erases the outer leaves before searching.

Your main goal: Expose Cecilia's mistake. Draw two graphs: first the correct graph, then Cecilia's graph using the mistake.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
CECILIA’S OUTPUT
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
2 · Cecilia's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | CECILIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("node 0: 3", "node 1: 11", "node 2: 4", "node 3: 4", "node 4: -2", "node 6: 1"): REJECTED with "Use root, L, R, LL, LR, ... to name tree positions."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"root\"]","buggy":"[\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R · edges (in drawing order) root→L, root→R · start root
Grader's expected answers: correct output `["L","R","root"]` · character's output `["root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, root · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `L, R, root`; ❌ curly braces → `{L,R,root}`; ✅ quoted numbers/strings → `["L","R","root"]`; ❌ reversed order → `["root","R","L"]`; ✅ spaces inside brackets → `[ "L" , "R" , "root" ]`; ❌ unquoted labels (if non-numeric) → `[L,R,root]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","root"]
CECILIA'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Grandchild value"; authored goal, NOT shown to student: "Make a grandchild change the whole-tree total.")
Everything the student sees (text):
```
K
Kyler's broken search

Kyler stops after one hop instead of continuing.

Your main goal: Expose Kyler's mistake. Draw two graphs: first the correct graph, then Kyler's graph using the mistake.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
KYLER’S OUTPUT
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
2 · Kyler's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | KYLER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"LL\",\"root\"]","buggy":"[\"L\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, LL · edges (in drawing order) root→L, L→LL · start root
Grader's expected answers: correct output `["L","LL","root"]` · character's output `["L","root"]` · character's graph must be exactly: DIRECTED · nodes: L, LL, root · edges: root→L, L→LL
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","LL","root"]
KYLER'S OUTPUT
["L","root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Both subtrees count"; authored goal, NOT shown to student: "Give both root branches nonzero values that must be added.")
Everything the student sees (text):
```
M
Madeleine's broken search

Madeleine chooses the final listed route and never returns.

Your main goal: Expose Madeleine's mistake. Draw two graphs: first the correct graph, then Madeleine's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
MADELEINE’S OUTPUT
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
2 · Madeleine's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | MADELEINE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"RL\",\"root\"]","buggy":"[\"R\",\"RL\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R, RL · edges (in drawing order) root→L, root→R, R→RL · start root
Grader's expected answers: correct output `["L","R","RL","root"]` · character's output `["R","RL","root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, RL, root · edges: root→L, root→R, R→RL
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","RL","root"]
MADELEINE'S OUTPUT
["R","RL","root"]
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
root level-order=[0,-1,1]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes with a positive val.”"
    feedback if wrong: Negative values must reduce the total. Correct node rule: Every existing tree node object, using its val.
- [YES is correct] (direct-vs-reach) "node 0: 0 and node 2: 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge.
- [YES is correct] (local-degree) "node 1: -1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 1: -1 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Negative values must reduce the total. Correct node rule: Every existing tree node object, using its val.
×
Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge.
×
node 1: -1 has 0 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "node 2: 1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 2: 1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Existing nodes plus every null child pointer as a zero-valued node.”"
    feedback if wrong: Null is the absence of a node, not another node to visit. Correct node rule: Every existing tree node object, using its val.
- [YES is correct] (direct-vs-reach) "node 0: 0 and node 1: -1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 0→node 1: -1 as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
node 2: 1 has 0 outgoing direct edges.
×
Null is the absence of a node, not another node to visit. Correct node rule: Every existing tree node object, using its val.
×
Correct. The mini-example lists node 0: 0→node 1: -1 as one direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 0: 0 has exactly 2 outgoing direct edges."
    feedback if wrong: node 0: 0 has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes with no children.”"
    feedback if wrong: Root and inner nodes contribute too. Correct node rule: Every existing tree node object, using its val.
- [YES is correct] (direct-vs-reach) "node 0: 0 and node 2: 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge.
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
root level-order=[4,2,6,1,3,5,7]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 4", "node 1: 2", "node 2: 6", "node 3: 1", "node 4: 3", "node 5: 5", "node 6: 7" · edges: node 0: 4→node 1: 2, node 0: 4→node 2: 6, node 1: 2→node 3: 1, node 1: 2→node 4: 3, node 2: 6→node 5: 5, node 2: 6→node 6: 7
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "node 0: 4 can reach node 3: 1 through node 1: 2, but the graph still has no direct node 0: 4→node 3: 1 edge."
    feedback if wrong: Right. A multi-step route through node 1: 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "node 3: 1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 3: 1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Existing nodes plus every null child pointer as a zero-valued node.”"
    feedback if wrong: Null is the absence of a node, not another node to visit. Correct node rule: Every existing tree node object, using its val.
Result: PASSED

### S3 Q3
Raw input shown:
```
root level-order=[-3]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: -3" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "Because node 0: -3 can reach itself, the graph should contain a direct node 0: -3→node 0: -3 edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct node 0: -3→node 0: -3 self-edge.
- [NO is correct] (local-degree) "node 0: -3 has exactly 1 outgoing direct edge."
    feedback if wrong: node 0: -3 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes with a positive val.”"
    feedback if wrong: Negative values must reduce the total. Correct node rule: Every existing tree node object, using its val.
Result: PASSED

### S3 Q4
Raw input shown:
```
root level-order=[2,3,null,4]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 3: 4" · edges: node 0: 2→node 1: 3, node 1: 3→node 3: 4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 0: 2 has exactly 1 outgoing direct edge."
    feedback if wrong: node 0: 2 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only nodes with no children.”"
    feedback if wrong: Root and inner nodes contribute too. Correct node rule: Every existing tree node object, using its val.
- [YES is correct] (direct-vs-reach) "node 0: 2 can reach node 3: 4 through node 1: 3, but the graph still has no direct node 0: 2→node 3: 4 edge."
    feedback if wrong: Right. A multi-step route through node 1: 3 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
root level-order=[1,null,2,null,null,null,3]
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 2: 2", "node 6: 3" · edges: node 0: 1→node 2: 2, node 2: 2→node 6: 3
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 6: 3 has exactly 0 outgoing direct edges."
    feedback if wrong: node 6: 3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Existing nodes plus every null child pointer as a zero-valued node.”"
    feedback if wrong: Null is the absence of a node, not another node to visit. Correct node rule: Every existing tree node object, using its val.
- [YES is correct] (direct-vs-reach) "node 0: 1 can reach node 6: 3 through node 2: 2, but the graph still has no direct node 0: 1→node 6: 3 edge."
    feedback if wrong: Right. A multi-step route through node 2: 2 creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Negative node values are ignored
Input shown:
```
REAL PROBLEM INPUT
root: { val: 3, left: { val: -5, left: null, right: null }, right: { val: 2, left: null, right: null } }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function treeSum(root) {
  if (!root) {
    return 0;
  }
  const currentValue = root.val > 0 ? root.val : 0;
  return currentValue + treeSum(root.left) + treeSum(root.right);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "3", "-5", "2" · edges: 3→-5, 3→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `5` · real correct output `0`
Diagnosis choices as displayed:
- A Null children should contribute their parent's value instead of zero.
- B Only leaf values should be summed, so internal-node values are extra contributions.
- C The own-value guard replaces every negative node weight with zero.
Diagnosis answer key + feedback:
- ❌ [null-children] "Null children should contribute their parent's value instead of zero." — feedback: Null is not a tree node and correctly contributes zero.
- ✅ [drops-negative-values] "The own-value guard replaces every negative node weight with zero." — feedback: Exactly. Every existing node's val must be summed, including negatives.
- ❌ [leaf-only] "Only leaf values should be summed, so internal-node values are extra contributions." — feedback: The problem asks for every node, not only leaves.
Graph proof shown in feedback: code rule "Visited nodes with negative weights contribute zero." → changed graph "The tree has three nodes weighted 3, -5, and 2." → boundary "One real node has weight -5, changing the total from positive 5 to zero." → returned value "The helper returns 3+0+2=5; the whole-tree sum is 0."
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
About your diagnosis: Null is not a tree node and correctly contributes zero.
Code rule: Visited nodes with negative weights contribute zero. → Changed graph: The tree has three nodes weighted 3, -5, and 2. → Reachable boundary: One real node has weight -5, changing the total from positive 5 to zero.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Negative node values are ignored
INCORRECT OUTPUT
5
CORRECT OUTPUT
0
Code rule: Visited nodes with negative weights contribute zero. → Changed graph: The tree has three nodes weighted 3, -5, and 2. → Reachable boundary: One real node has weight -5, changing the total from positive 5 to zero. → Returned value: The helper returns 3+0+2=5; the whole-tree sum is 0.
```

### S4 case 2 — `build-1` · bug: Negative node values are ignored
Input shown:
```
REAL PROBLEM INPUT
root level-order=[3,11,4,4,-2,null,1]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function treeSum(root) {
  if (!root) {
    return 0;
  }
  const currentValue = root.val > 0 ? root.val : 0;
  return currentValue + treeSum(root.left) + treeSum(root.right);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "node 0: 3", "node 1: 11", "node 2: 4", "node 3: 4", "node 4: -2", "node 6: 1" · edges: node 0: 3→node 1: 11, node 0: 3→node 2: 4, node 1: 11→node 3: 4, node 1: 11→node 4: -2, node 2: 4→node 6: 1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `23` · real correct output `21`
Diagnosis choices as displayed:
- A The own-value guard replaces every negative node weight with zero.
- B Null children should contribute their parent's value instead of zero.
- C Only leaf values should be summed, so internal-node values are extra contributions.
Diagnosis answer key + feedback:
- ❌ [null-children] "Null children should contribute their parent's value instead of zero." — feedback: Null is not a tree node and correctly contributes zero.
- ✅ [drops-negative-values] "The own-value guard replaces every negative node weight with zero." — feedback: Correct. Replacing node -2 with zero adds two extra points to the six-node tree sum, changing 21 to 23.
- ❌ [leaf-only] "Only leaf values should be summed, so internal-node values are extra contributions." — feedback: The problem asks for every node, not only leaves.
Graph proof shown in feedback: code rule "Visited nodes with negative weights contribute zero." → changed graph "The six-node tree has edges 3→11, 3→4, 11→4, 11→-2, and 4→1 by node position." → boundary "The tree's node -2 is real payload; replacing it with zero raises the total by exactly two." → returned value "The shown code returns 23; the real problem returns 21."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Negative node values are ignored
INCORRECT OUTPUT
23
CORRECT OUTPUT
21
Code rule: Visited nodes with negative weights contribute zero. → Changed graph: The six-node tree has edges 3→11, 3→4, 11→4, 11→-2, and 4→1 by node position. → Reachable boundary: The tree's node -2 is real payload; replacing it with zero raises the total by exactly two. → Returned value: The shown code returns 23; the real problem returns 21.
```

### S4 case 3 — `build-2` · bug: Negative node values are ignored
Input shown:
```
REAL PROBLEM INPUT
root level-order=[1,6,0,null,null,-4]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function treeSum(root) {
  if (!root) {
    return 0;
  }
  const currentValue = root.val > 0 ? root.val : 0;
  return currentValue + treeSum(root.left) + treeSum(root.right);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "node 0: 1", "node 1: 6", "node 2: 0", "node 5: -4" · edges: node 0: 1→node 1: 6, node 0: 1→node 2: 0, node 2: 0→node 5: -4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `7` · real correct output `3`
Diagnosis choices as displayed:
- A Null children should contribute their parent's value instead of zero.
- B The own-value guard replaces every negative node weight with zero.
- C Only leaf values should be summed, so internal-node values are extra contributions.
Diagnosis answer key + feedback:
- ❌ [null-children] "Null children should contribute their parent's value instead of zero." — feedback: Null is not a tree node and correctly contributes zero.
- ✅ [drops-negative-values] "The own-value guard replaces every negative node weight with zero." — feedback: Correct. Replacing leaf -4 with zero adds four extra points, changing the full tree sum from 3 to 7.
- ❌ [leaf-only] "Only leaf values should be summed, so internal-node values are extra contributions." — feedback: The problem asks for every node, not only leaves.
Graph proof shown in feedback: code rule "Visited nodes with negative weights contribute zero." → changed graph "The four-node tree has root 1, children 6 and 0, and node 0 points to leaf -4." → boundary "Leaf -4 is the only negative payload, so dropping it raises the total from 3 to 7." → returned value "The shown code returns 7; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Negative node values are ignored
INCORRECT OUTPUT
7
CORRECT OUTPUT
3
Code rule: Visited nodes with negative weights contribute zero. → Changed graph: The four-node tree has root 1, children 6 and 0, and node 0 points to leaf -4. → Reachable boundary: Leaf -4 is the only negative payload, so dropping it raises the total from 3 to 7. → Returned value: The shown code returns 7; the real problem returns 3.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```