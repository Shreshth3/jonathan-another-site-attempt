# Path Sum (`path-sum`) — new, tree

## Problem statement (Description tab)

You are given a binary tree and a whole number `targetSum`.

The tree arrives as `root`, a plain object: every node looks like `{val, left, right}`, where `val` is a number and `left` / `right` are the child nodes, or `null` if that child is missing. If the tree is empty, `root` itself is `null`.

A **leaf** is a node with no children. A **root-to-leaf path** is the chain of nodes you pass through going from the top of the tree straight down to some leaf.

Return `true` if there is at least one root-to-leaf path whose values add up to exactly `targetSum`. Otherwise return `false`. (An empty tree has no paths, so the answer is `false`.)

### Examples
- Example 1: input `root = {val: 5, left: {val: 4, left: {val: 11, left: {val: 7}, right: {val: 2}}}, right: {val: 8, left: {val: 13}, right: {val: 4, right: {val: 1}}}} (children not shown are null), targetSum = 22` → output `true`. The four root-to-leaf paths are: 5 -> 4 -> 11 -> 7 (total 27), 5 -> 4 -> 11 -> 2 (total 22), 5 -> 8 -> 13 (total 26), and 5 -> 8 -> 4 -> 1 (total 18). The second path adds up to exactly 22, so the answer is true.
- Example 2: input `root = {val: 1, left: {val: 2}, right: {val: 3}}, targetSum = 5` → output `false`. There are two root-to-leaf paths: 1 -> 2 (total 3) and 1 -> 3 (total 4). Neither equals 5, so the answer is false.

### Graph rules (authored)
- Nodes: Every tree node object on the route, including root and leaf.
- Edges: From a parent to its existing left or right child.
- Node-name format shown in Step 1/3: Name each tree node `node levelOrderIndex: value`. Example: `node 2: -3`. (pattern `^node \d+: -?\d+$`)
- Step 2 node-label rule: `tree-path` — Use root, L, R, LL, LR, ... to name tree positions.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-1`, facet "exact tree nodes")
Raw input shown:
```
root level-order=[5,4,8,11,null,13,4], targetSum=20
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Path 5→4→11 reaches a leaf and totals 20.
- ❌ [wrong] "false"
    feedback: That follows the stop before leaf bug. (misconception: stop-before-leaf)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 5", "node 1: 4", "node 2: 8", "node 3: 11", "node 5: 13", "node 6: 4" · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 8, node 1: 4→node 3: 11, node 2: 8→node 5: 13, node 2: 8→node 6: 4
"Why" shown after success: Path 5→4→11 reaches a leaf and totals 20.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact tree nodes")
Raw input shown:
```
root level-order=[5,4,8,11,null,13,4], targetSum=20
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this fresh input?**
Choices as displayed (top to bottom):
1. Picture B / node 0: 5 / node 1: 4 / node 2: 8 / node 3: 11 / node 5: 13
2. Picture A / node 0: 5 / node 1: 4 / node 2: 8 / node 3: 11 / node 5: 13 / node 6: 4
3. Picture C / node 0: 5 / node 1: 4 / node 2: 8 / node 3: 11 / node 5: 13 / node 6: 4
4. Picture D / node 0: 5 / node 1: 4 / node 2: 8 / node 3: 11 / node 5: 13 / node 6: 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: node 0: 5, node 1: 4, node 2: 8, node 3: 11, node 5: 13, node 6: 4 · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 8, node 1: 4→node 3: 11, node 2: 8→node 5: 13, node 2: 8→node 6: 4
    feedback: Correct. It matches the raw input exactly.
- ❌ [omit] "Picture B" — picture: DIRECTED · nodes: node 0: 5, node 1: 4, node 2: 8, node 3: 11, node 5: 13 · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 8, node 1: 4→node 3: 11, node 2: 8→node 5: 13
    feedback: This drops an item that still belongs in the picture. (misconception: drop-final-node)
- ❌ [missing] "Picture C" — picture: DIRECTED · nodes: node 0: 5, node 1: 4, node 2: 8, node 3: 11, node 5: 13, node 6: 4 · edges: node 0: 5→node 1: 4, node 0: 5→node 2: 8, node 1: 4→node 3: 11, node 2: 8→node 5: 13
    feedback: This stops reading the raw input one relation too soon. (misconception: drop-final-edge)
- ❌ [direction] "Picture D" — picture: DIRECTED · nodes: node 0: 5, node 1: 4, node 2: 8, node 3: 11, node 5: 13, node 6: 4 · edges: node 1: 4→node 0: 5, node 0: 5→node 2: 8, node 1: 4→node 3: 11, node 2: 8→node 5: 13, node 2: 8→node 6: 4
    feedback: This changes whether direct relations are arrows or two-way links. (misconception: wrong-direction-rule)
"Why" shown after success: The exact picture keeps every item, direct relation, and direction rule.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-2`, facet "node identity")
Raw input shown:
```
root level-order=[1,2,3], targetSum=5
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. No one root-to-leaf path totals 5.
- ❌ [wrong] "true"
    feedback: That follows the combine sibling values bug. (misconception: combine-sibling-values)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 2: 3" · edges: node 0: 1→node 1: 2, node 0: 1→node 2: 3
"Why" shown after success: No one root-to-leaf path totals 5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
What contributes a value to a candidate path?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What contributes a value to a candidate path?**
Choices as displayed (top to bottom):
1. A / Only nodes whose val is positive.
2. B / Only leaf nodes.
3. C / Every tree node object on the route, including root and leaf.
4. D / Only nodes whose val equals targetSum.
Answer key + feedback per choice (data):
- ✅ CORRECT [tree-node] "Every tree node object on the route, including root and leaf."
    feedback: Right. Add each val along one complete root-to-leaf route.
- ❌ [positive] "Only nodes whose val is positive."
    feedback: Negative values cannot be skipped when they lie on the path. (misconception: drops-negative-values)
- ❌ [leaf] "Only leaf nodes."
    feedback: Root and inner-node values also belong in the sum. (misconception: counts-only-leaf)
- ❌ [target] "Only nodes whose val equals targetSum."
    feedback: The target is compared with the total, not individual nodes. (misconception: matches-individual-values)
"Why" shown after success: Right. Add each val along one complete root-to-leaf route.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`edge-rule`, facet "parent-child edges")
Raw input shown:
```
Which links may a root-to-leaf path follow?
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which links may a root-to-leaf path follow?**
Choices as displayed (top to bottom):
1. A / A path may stop at any inner node as soon as its running sum hits targetSum.
2. B / From a parent to its existing left or right child.
3. C / A path may move from child back to parent and down another branch.
4. D / The root connects directly to every leaf.
Answer key + feedback per choice (data):
- ✅ CORRECT [children] "From a parent to its existing left or right child."
    feedback: Right. The route begins at root and must end at a true leaf.
- ❌ [stop-sum] "A path may stop at any inner node as soon as its running sum hits targetSum."
    feedback: Success counts only when the matching route ends at a leaf. (misconception: stops-before-leaf)
- ❌ [either-direction] "A path may move from child back to parent and down another branch."
    feedback: A root-to-leaf path only moves downward. (misconception: allows-backtracking-in-path)
- ❌ [leaf-shortcut] "The root connects directly to every leaf."
    feedback: That skips inner nodes whose values must be included. (misconception: skips-intermediate-values)
"Why" shown after success: Right. The route begins at root and must end at a true leaf.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-3`, facet "parent-child edges")
Raw input shown:
```
root level-order=[-2,null,-3], targetSum=-5
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The right root-to-leaf path totals -5.
- ❌ [wrong] "false"
    feedback: That follows the reject negative sums bug. (misconception: reject-negative-sums)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: -2", "node 2: -3" · edges: node 0: -2→node 2: -3
"Why" shown after success: The right root-to-leaf path totals -5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "root-to-leaf sum")
Raw input shown:
```
root = {val: 5, left: {val: 4, left: {val: 11, left: {val: 7}, right: {val: 2}}}, right: {val: 8, left: {val: 13}, right: {val: 4, right: {val: 1}}}} (children not shown are null), targetSum = 22
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / require every complete path to sum to 22
2. B / check only the leftmost complete path, whose sum is 27
3. C / one complete path has sum 22
4. D / check only the shortest complete path, whose sum is 26
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "one complete path has sum 22"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "require every complete path to sum to 22"
    feedback: The function needs at least one matching complete path, not all paths. (misconception: requires-all-paths-match)
- ❌ [wrong-2] "check only the leftmost complete path, whose sum is 27"
    feedback: A failed first path does not stop the search; another complete path sums to 22. (misconception: checks-leftmost-path-only)
- ❌ [wrong-3] "check only the shortest complete path, whose sum is 26"
    feedback: Path length does not choose the branch; every complete root-to-leaf sum must be tested. (misconception: checks-shortest-path-only)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-4`, facet "root-to-leaf sum")
Raw input shown:
```
root level-order=[1], targetSum=1
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The root is also a leaf, so its value forms a complete path.
- ❌ [wrong] "false"
    feedback: That follows the require an edge bug. (misconception: require-an-edge)
Graph the grader requires (hidden from student): DIRECTED · nodes: "node 0: 1" · edges: none
"Why" shown after success: The root is also a leaf, so its value forms a complete path.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "root-to-leaf sum")
Raw input shown:
```
root = {val: 1, left: {val: 2}, right: {val: 3}}, targetSum = 5
```
Node-name guide shown: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / add the two leaf values 2 + 3
2. B / accept any complete path whose sum is at most 5
3. C / stop at an inner node when its running sum is below 5
4. D / neither complete path has sum 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "neither complete path has sum 5"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "add the two leaf values 2 + 3"
    feedback: Those leaves belong to different branches; one complete path must total 5. (misconception: combines-branches)
- ❌ [wrong-2] "accept any complete path whose sum is at most 5"
    feedback: The comparison must be exact; sums 3 and 4 do not equal 5. (misconception: uses-target-as-upper-bound)
- ❌ [wrong-3] "stop at an inner node when its running sum is below 5"
    feedback: A valid answer needs equality at a leaf, not merely a smaller partial sum. (misconception: accepts-partial-path)
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
root level-order=[2,3,4], targetSum=6
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. The right path 2→4 totals 6.; ❌ "false" — That follows the check left path only bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 2: 4" · edges: node 0: 2→node 1: 3, node 0: 2→node 2: 4
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [positive]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every tree node object on the route, including root and leaf.
Your choice: Negative values cannot be skipped when they lie on the path.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[2,3,4], targetSum=5
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The left path 2→3 is enough.; ❌ "false" — That follows the require all paths match bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 2: 4" · edges: node 0: 2→node 1: 3, node 0: 2→node 2: 4
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [stop-sum]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
From a parent to its existing left or right child.
Your choice: Success counts only when the matching route ends at a leaf.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[1,2,null,3], targetSum=3
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. 1→2 totals 3 but node 2 has child 3, so it is not a leaf path.; ❌ "true" — That follows the accept nonleaf prefix bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 3: 3" · edges: node 0: 1→node 1: 2, node 1: 2→node 3: 3
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
one complete path has sum 22
Your choice: The function needs at least one matching complete path, not all paths.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[0,-1,1], targetSum=-1
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The complete left path totals 0 + -1.; ❌ "false" — That follows the discard zero root bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
neither complete path has sum 5
Your choice: Those leaves belong to different branches; one complete path must total 5.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build a fresh proof"
Remedial raw input:
```
root level-order=[3,1,1,1,null,null,5], targetSum=9
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. The right path 3→1→5 alone totals 9.; ❌ "false" — That follows the merge branches bug.
Remedial required graph (hidden): DIRECTED · nodes: "node 0: 3", "node 1: 1", "node 2: 1", "node 3: 1", "node 6: 5" · edges: node 0: 3→node 1: 1, node 0: 3→node 2: 1, node 1: 1→node 3: 1, node 2: 1→node 6: 5
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Missing target leaf"; authored goal, NOT shown to student: "Put the only target-sum path behind the final child arrow.")
Everything the student sees (text):
```
M
Mallory's broken search

Mallory stops reading one relation too early and drops the final edge.

Your main goal: Expose Mallory's mistake. Draw two graphs: first the correct graph, then Mallory's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
MALLORY’S OUTPUT
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
2 · Mallory's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | MALLORY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("node 0: 5", "node 1: 4", "node 2: 8", "node 3: 11", "node 5: 13", "node 6: 4"): REJECTED with "Use root, L, R, LL, LR, ... to name tree positions."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"LL\",\"root\"]","buggy":"[\"L\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, LL · edges (in drawing order) root→L, L→LL · start root
Grader's expected answers: correct output `["L","LL","root"]` · character's output `["L","root"]` · character's graph must be exactly: DIRECTED · nodes: L, LL, root · edges: root→L
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `L, LL, root`; ❌ curly braces → `{L,LL,root}`; ✅ quoted numbers/strings → `["L","LL","root"]`; ❌ reversed order → `["root","LL","L"]`; ✅ spaces inside brackets → `[ "L" , "LL" , "root" ]`; ❌ unquoted labels (if non-numeric) → `[L,LL,root]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","LL","root"]
MALLORY'S OUTPUT
["L","root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "First path matters"; authored goal, NOT shown to student: "Make only the earlier root-to-leaf branch hit the target.")
Everything the student sees (text):
```
A
Aden's broken search

Aden follows only the last available branch and ignores earlier choices.

Your main goal: Expose Aden's mistake. Draw two graphs: first the correct graph, then Aden's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
ADEN’S OUTPUT
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
2 · Aden's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | ADEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"RL\",\"root\"]","buggy":"[\"R\",\"RL\",\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R, RL · edges (in drawing order) root→L, root→R, R→RL · start root
Grader's expected answers: correct output `["L","R","RL","root"]` · character's output `["R","RL","root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, RL, root · edges: root→L, root→R, R→RL
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","RL","root"]
ADEN'S OUTPUT
["R","RL","root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `skip-leaf-edges` (authored level "Leaf completes the sum"; authored goal, NOT shown to student: "Require a leaf value to finish the exact target total.")
Everything the student sees (text):
```
E
Esmeralda's broken search

Esmeralda drops every connection touching a degree-one tree node.

Your main goal: Expose Esmeralda's mistake. Draw two graphs: first the correct graph, then Esmeralda's graph using the mistake.

CHOOSE THE ROOT
root
OUTPUT
CORRECT OUTPUT
ESMERALDA’S OUTPUT
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
2 · Esmeralda's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT / root", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | ESMERALDA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"L\",\"R\",\"root\"]","buggy":"[\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R · edges (in drawing order) root→L, root→R · start root
Grader's expected answers: correct output `["L","R","root"]` · character's output `["root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, root · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","root"]
ESMERALDA'S OUTPUT
["root"]
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
root level-order=[3,1,1,1,null,null,5], targetSum=9
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 3", "node 1: 1", "node 2: 1", "node 3: 1", "node 6: 5" · edges: node 0: 3→node 1: 1, node 0: 3→node 2: 1, node 1: 1→node 3: 1, node 2: 1→node 6: 5
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 3→node 2: 1 and node 2: 1→node 6: 5, so it should also contain a direct node 0: 3→node 6: 5 edge."
    feedback if wrong: Two direct edges through node 2: 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "node 6: 5 has exactly 1 outgoing direct edge."
    feedback if wrong: node 6: 5 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes whose val is positive.”"
    feedback if wrong: Negative values cannot be skipped when they lie on the path. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through node 2: 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
node 6: 5 has 0 outgoing direct edges.
×
Negative values cannot be skipped when they lie on the path. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "node 3: 1 has exactly 1 outgoing direct edge."
    feedback if wrong: node 3: 1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only leaf nodes.”"
    feedback if wrong: Root and inner-node values also belong in the sum. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 3→node 1: 1 and node 1: 1→node 3: 1, so it should also contain a direct node 0: 3→node 3: 1 edge."
    feedback if wrong: Two direct edges through node 1: 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
node 3: 1 has 0 outgoing direct edges.
×
Root and inner-node values also belong in the sum. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
×
Two direct edges through node 1: 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "node 2: 1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 2: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes whose val equals targetSum.”"
    feedback if wrong: The target is compared with the total, not individual nodes. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 3→node 2: 1 and node 2: 1→node 6: 5, so it should also contain a direct node 0: 3→node 6: 5 edge."
    feedback if wrong: Two direct edges through node 2: 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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
root level-order=[2,3,4], targetSum=6
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 2: 4" · edges: node 0: 2→node 1: 3, node 0: 2→node 2: 4
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 1: 3 has exactly 0 outgoing direct edges."
    feedback if wrong: node 1: 3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only leaf nodes.”"
    feedback if wrong: Root and inner-node values also belong in the sum. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [YES is correct] (direct-vs-reach) "node 0: 2 and node 1: 3 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 2→node 1: 3 as one direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
root level-order=[2,3,4], targetSum=5
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 2", "node 1: 3", "node 2: 4" · edges: node 0: 2→node 1: 3, node 0: 2→node 2: 4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes whose val is positive.”"
    feedback if wrong: Negative values cannot be skipped when they lie on the path. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [NO is correct] (direct-vs-reach) "node 0: 2 can reach node 2: 4, but there is no direct node 0: 2→node 2: 4 edge."
    feedback if wrong: The mini-example lists node 0: 2→node 2: 4 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "node 0: 2 has exactly 1 outgoing direct edge."
    feedback if wrong: node 0: 2 has 2 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
root level-order=[1,2,null,3], targetSum=3
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 3: 3" · edges: node 0: 1→node 1: 2, node 1: 2→node 3: 3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "node 3: 3 has exactly 1 outgoing direct edge."
    feedback if wrong: node 3: 3 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only nodes whose val equals targetSum.”"
    feedback if wrong: The target is compared with the total, not individual nodes. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [NO is correct] (direct-vs-reach) "The correct graph has node 0: 1→node 1: 2 and node 1: 2→node 3: 3, so it should also contain a direct node 0: 1→node 3: 3 edge."
    feedback if wrong: Two direct edges through node 1: 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
root level-order=[0,-1,1], targetSum=-1
```
Node-name guide: Required node-name format: Name each tree node node levelOrderIndex: value. Example: node 2: -3. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "node 0: 0", "node 1: -1", "node 2: 1" · edges: node 0: 0→node 1: -1, node 0: 0→node 2: 1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "node 1: -1 has exactly 0 outgoing direct edges."
    feedback if wrong: node 1: -1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only leaf nodes.”"
    feedback if wrong: Root and inner-node values also belong in the sum. Correct node rule: Every existing tree node object, including root, inner nodes, and leaves.
- [YES is correct] (direct-vs-reach) "node 0: 0 and node 2: 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists node 0: 0→node 2: 1 as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: A matching internal prefix counts as a full path
Input shown:
```
REAL PROBLEM INPUT
root: { val: 5, left: { val: 3, left: { val: 1 }, right: null }, right: { val: 10 } }
targetSum: 8
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function hasPathSum(root, targetSum) {
  function search(node, sum) {
    if (!node) {
      return false;
    }
    const next = sum + node.val;
    if (next === targetSum) {
      return true;
    }
    return search(node.left, next) || search(node.right, next);
  }
  return search(root, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "5", "3", "1", "10" · edges: 5→3, 3→1, 5→10
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The running sum resets to zero before the right branch for the shown graph.
- B A null child should return true when the current sum matches for the shown graph.
- C The helper accepts a matching sum at an internal node before requiring the path to end at a leaf.
Diagnosis answer key + feedback:
- ❌ [sum-reset] "The running sum resets to zero before the right branch for the shown graph." — feedback: Each recursive call receives the proper prefix; the left internal prefix is accepted too soon.
- ❌ [null-base] "A null child should return true when the current sum matches for the shown graph." — feedback: Only reaching a real leaf can finish a valid path.
- ✅ [prefix-not-leaf] "The helper accepts a matching sum at an internal node before requiring the path to end at a leaf." — feedback: Exactly. The equality check belongs in a leaf-only condition.
Graph proof shown in feedback: code rule "Any visited node whose prefix sum is 8 returns true immediately." → changed graph "The complete root-to-leaf paths are 5→3→1 with sum 9 and 5→10 with sum 15." → boundary "Internal node 3 creates the target prefix before the path ends." → returned value "The helper returns true at node 3; no legal leaf path sums to 8, so the answer is false."
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
About your diagnosis: Each recursive call receives the proper prefix; the left internal prefix is accepted too soon.
Code rule: Any visited node whose prefix sum is 8 returns true immediately. → Changed graph: The complete root-to-leaf paths are 5→3→1 with sum 9 and 5→10 with sum 15. → Reachable boundary: Internal node 3 creates the target prefix before the path ends.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A matching internal prefix counts as a full path
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Any visited node whose prefix sum is 8 returns true immediately. → Changed graph: The complete root-to-leaf paths are 5→3→1 with sum 9 and 5→10 with sum 15. → Reachable boundary: Internal node 3 creates the target prefix before the path ends. → Returned value: The helper returns true at node 3; no legal leaf path sums to 8, so the answer is false.
```

### S4 case 2 — `repair-3` · bug: A matching internal prefix counts as a full path
Input shown:
```
REAL PROBLEM INPUT
root level-order=[1,2,null,3], targetSum=3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function hasPathSum(root, targetSum) {
  function search(node, sum) {
    if (!node) {
      return false;
    }
    const next = sum + node.val;
    if (next === targetSum) {
      return true;
    }
    return search(node.left, next) || search(node.right, next);
  }
  return search(root, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "node 0: 1", "node 1: 2", "node 3: 3" · edges: node 0: 1→node 1: 2, node 1: 2→node 3: 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Node 3 makes prefix 5→3 equal 8, but node 3 still has child 1 and is not a leaf.
- B The running sum resets to zero before the right branch for the shown graph.
- C A null child should return true when the current sum matches for the shown graph.
Diagnosis answer key + feedback:
- ❌ [sum-reset] "The running sum resets to zero before the right branch for the shown graph." — feedback: Each recursive call receives the proper prefix; the left internal prefix is accepted too soon.
- ❌ [null-base] "A null child should return true when the current sum matches for the shown graph." — feedback: Only reaching a real leaf can finish a valid path.
- ✅ [prefix-not-leaf] "Node 3 makes prefix 5→3 equal 8, but node 3 still has child 1 and is not a leaf." — feedback: Correct. Prefix 1→2 reaches target 3 at an internal node, but the required root-to-leaf path continues to 3 and totals 6.
Graph proof shown in feedback: code rule "Any visited node whose prefix sum is 8 returns true immediately." → changed graph "The tree is the chain 1→2→3; node 2 is internal even though prefix 1+2 matches the target." → boundary "The prefix 1→2 totals 3 at internal node 2, but the only complete leaf path continues to total 6." → returned value "The shown code returns true; the real problem returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A matching internal prefix counts as a full path
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Any visited node whose prefix sum is 8 returns true immediately. → Changed graph: The tree is the chain 1→2→3; node 2 is internal even though prefix 1+2 matches the target. → Reachable boundary: The prefix 1→2 totals 3 at internal node 2, but the only complete leaf path continues to total 6. → Returned value: The shown code returns true; the real problem returns false.
```

### S4 case 3 — `new-internal-six-prefix` · bug: A matching internal prefix counts as a full path
Input shown:
```
REAL PROBLEM INPUT
root: { val: 2, left: { val: 4, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }, right: { val: 10, left: null, right: null } }
targetSum: 6
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function hasPathSum(root, targetSum) {
  function search(node, sum) {
    if (!node) {
      return false;
    }
    const next = sum + node.val;
    if (next === targetSum) {
      return true;
    }
    return search(node.left, next) || search(node.right, next);
  }
  return search(root, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "2", "4", "1", "3", "10" · edges: 2→4, 4→1, 4→3, 2→10
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The target is subtracted in the wrong direction only on the right branch.
- B The helper returns true at internal node 4 when prefix 2+4 reaches 6, before checking its children.
- C The OR operator requires both child paths to match, hiding the valid left prefix.
Diagnosis answer key + feedback:
- ❌ [wrong-boundary] "The target is subtracted in the wrong direction only on the right branch." — feedback: The function adds node values to a running sum; it never subtracts the target on either branch.
- ✅ [prefix-not-leaf] "The helper returns true at internal node 4 when prefix 2+4 reaches 6, before checking its children." — feedback: Exactly. Complete leaf sums are 7, 9, and 12.
- ❌ [wrong-visited] "The OR operator requires both child paths to match, hiding the valid left prefix." — feedback: JavaScript || succeeds when either child succeeds; it does not require both children.
Graph proof shown in feedback: code rule "Any node with matching running sum ends the search successfully." → changed graph "The three root-to-leaf paths sum to 7, 9, and 12." → boundary "Sum 6 occurs only at internal node 4." → returned value "The helper returns true for an unfinished prefix; the correct answer is false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A matching internal prefix counts as a full path
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Any node with matching running sum ends the search successfully. → Changed graph: The three root-to-leaf paths sum to 7, 9, and 12. → Reachable boundary: Sum 6 occurs only at internal node 4. → Returned value: The helper returns true for an unfinished prefix; the correct answer is false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```