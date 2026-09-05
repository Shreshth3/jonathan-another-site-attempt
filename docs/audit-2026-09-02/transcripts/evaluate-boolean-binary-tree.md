# Evaluate Boolean Binary Tree (`evaluate-boolean-binary-tree`) — new, tree

## Problem statement (Description tab)

You are given a special binary tree as `root` (plain objects `{val, left, right}`, with `null` for missing children). In this tree, every node has either exactly two children or none at all.

- A node with **no children** holds `0` (meaning **false**) or `1` (meaning **true**).
- A node with **two children** holds `2` (meaning **OR**) or `3` (meaning **AND**).

Every node has a true/false value:

- A childless node's value is simply its own meaning: `0` is false, `1` is true.
- An OR node (holding `2`) is true when **at least one** of its two children's values is true.
- An AND node (holding `3`) is true only when **both** of its children's values are true.

Return the true/false value of the root node as a boolean.

### Examples
- Example 1: input `root = {val: 2, left: {val: 1}, right: {val: 3, left: {val: 0}, right: {val: 1}}}` → output `true`. The right child holds 3 (AND) and its children are 0 (false) and 1 (true): false AND true = false. The root holds 2 (OR) and its children's values are true (the left leaf holding 1) and false (the AND result): true OR false = true.
- Example 2: input `root = {val: 0}` → output `false`. The root has no children, so its value is its own meaning: 0 means false.

### Graph rules (authored)
- Nodes: One tree node: a leaf value or an OR/AND gate.
- Edges: A parent points to its left and right child.
- Node-name format shown in Step 1/3: Name each tree node `levelOrderIndex:value`, using `true`, `false`, `AND`, or `OR`. Example: `2:AND`. (pattern `^\d+:(?:true|false|AND|OR)$`)
- Step 2 node-label rule: `tree-path` — Use root, L, R, LL, LR, ... to name tree positions.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact tree")
Raw input shown:
```
values=[2,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What does the root evaluate to?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Evaluating children before their parent makes the root true.
- ❌ [bug] "false"
    feedback: This requires both children to be true at an OR node instead of accepting either one. (misconception: evaluate-or-as-and)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:OR", "1:true", "2:false" · edges: 0:OR→1:true, 0:OR→2:false
"Why" shown after success: Evaluating children before their parent makes the root true.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "node identity")
Raw input shown:
```
values=[3,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What does the root evaluate to?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Evaluating children before their parent makes the root false.
- ❌ [bug] "true"
    feedback: This accepts one true child at an AND node instead of requiring both children. (misconception: evaluate-and-as-or)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:AND", "1:true", "2:false" · edges: 0:AND→1:true, 0:AND→2:false
"Why" shown after success: Evaluating children before their parent makes the root false.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact tree")
Raw input shown:
```
values=[2,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0:OR / 1:true / 2:false
2. Picture A / 0:OR / 1:true / 2:false
3. Picture C / 0:OR / 1:true / 2:false
4. Picture D / 0:OR / 1:true
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0:OR, 1:true, 2:false · edges: 0:OR→1:true, 0:OR→2:false
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0:OR, 1:true, 2:false · edges: 0:OR→1:true
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0:OR, 1:true, 2:false · edges: 1:true→0:OR, 0:OR→2:false
    feedback: This reverses one listed arrow. (misconception: reverse-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0:OR, 1:true · edges: 0:OR→1:true
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-3`, facet "parent-to-child edges")
Raw input shown:
```
values=[2,0,3,1,1], edges=[[0,1],[0,2],[2,3],[2,4]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What does the root evaluate to?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Evaluating children before their parent makes the root true.
- ❌ [bug] "false"
    feedback: This requires both children to be true at an OR node instead of accepting either one. (misconception: evaluate-or-as-and)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:OR", "1:false", "2:AND", "3:true", "4:true" · edges: 0:OR→1:false, 0:OR→2:AND, 2:AND→3:true, 2:AND→4:true
"Why" shown after success: Evaluating children before their parent makes the root true.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`node-rule`, facet "node identity")
Raw input shown:
```
What should each circle in the evaluation tree represent?
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each circle in the evaluation tree represent?**
Choices as displayed (top to bottom):
1. A / Only leaves containing 0 or 1.
2. B / Only inner nodes containing 2 or 3.
3. C / One tree node: a leaf value or an OR/AND gate.
4. D / One node for each possible answer true and false.
Answer key + feedback per choice (data):
- ✅ CORRECT [tree-object] "One tree node: a leaf value or an OR/AND gate."
    feedback: Right. Its val tells whether it is data or an operator.
- ❌ [boolean-only] "Only leaves containing 0 or 1."
    feedback: Operator nodes are needed to combine the leaf results. (misconception: drops-gates)
- ❌ [gate-only] "Only inner nodes containing 2 or 3."
    feedback: The gates need leaf values as their base answers. (misconception: drops-leaves)
- ❌ [truth-result] "One node for each possible answer true and false."
    feedback: Many different tree objects can evaluate to the same boolean. (misconception: confuses-value-with-node)
"Why" shown after success: Right. Its val tells whether it is data or an operator.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-4`, facet "boolean evaluation")
Raw input shown:
```
values=[3,1,2,0,1], edges=[[0,1],[0,2],[2,3],[2,4]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What does the root evaluate to?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Evaluating children before their parent makes the root false.
- ❌ [bug] "true"
    feedback: This accepts one true child at an AND node instead of requiring both children. (misconception: evaluate-and-as-or)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:AND", "1:true", "2:OR", "3:false", "4:true" · edges: 0:AND→1:true, 0:AND→2:OR, 2:OR→3:false, 2:OR→4:true
"Why" shown after success: Evaluating children before their parent makes the root false.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`edge-rule`, facet "parent-to-child edges")
Raw input shown:
```
Which links become edges?
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which links become edges?**
Choices as displayed (top to bottom):
1. A / All OR gates connect together, and all AND gates connect together.
2. B / Every leaf points directly to the root gate.
3. C / Only child-to-parent links, because answers move upward.
4. D / A parent points to its left and right child.
Answer key + feedback per choice (data):
- ✅ CORRECT [children] "A parent points to its left and right child."
    feedback: Right. Each gate receives exactly the two child results below it.
- ❌ [same-op] "All OR gates connect together, and all AND gates connect together."
    feedback: Matching operator types do not create tree links. (misconception: connects-same-operators)
- ❌ [leaf-gate] "Every leaf points directly to the root gate."
    feedback: Leaves feed their immediate parent; deeper results rise step by step. (misconception: skips-levels)
- ❌ [reverse-only] "Only child-to-parent links, because answers move upward."
    feedback: The tree structure is still defined by parent left/right pointers. (misconception: confuses-evaluation-flow-with-edge)
"Why" shown after success: Right. Each gate receives exactly the two child results below it.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "boolean evaluation")
Raw input shown:
```
root = {val: 2, left: {val: 1}, right: {val: 3, left: {val: 0}, right: {val: 1}}}
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / the root OR accepts its true left child
2. B / evaluate the root OR as if it were AND
3. C / return only the right subtree's result
4. D / stop after evaluating the false right subtree
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "the root OR accepts its true left child"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "evaluate the root OR as if it were AND"
    feedback: The root is OR, so its true left child is enough. (misconception: treats-or-as-and)
- ❌ [wrong-2] "return only the right subtree's result"
    feedback: Both root children matter; OR accepts the true left subtree. (misconception: uses-only-right-branch)
- ❌ [wrong-3] "stop after evaluating the false right subtree"
    feedback: A false OR input does not erase the other true input. (misconception: short-circuits-or-on-false)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "boolean evaluation")
Raw input shown:
```
root = {val: 0}
```
Node-name guide shown: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / mistakenly decode stored 0 as true
2. B / a leaf returns its stored Boolean value
3. C / use a base case that returns true for every leaf
4. D / test whether the leaf object exists instead of reading val
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "a leaf returns its stored Boolean value"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "mistakenly decode stored 0 as true"
    feedback: The encoding is fixed: leaf 0 means false and leaf 1 means true. (misconception: swaps-leaf-values)
- ❌ [wrong-2] "use a base case that returns true for every leaf"
    feedback: A leaf must return its stored value, not one fixed default. (misconception: ignores-leaf-value)
- ❌ [wrong-3] "test whether the leaf object exists instead of reading val"
    feedback: The node exists, but its stored val is 0, so the result is false. (misconception: tests-node-existence)
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
values=[1], edges=[] (2=OR, 3=AND, 1=true, 0=false)
```
Remedial question: **What does the root evaluate to?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Evaluating children before their parent makes the root true.; ❌ "false" — This treats a leaf as an operator instead of returning the leaf's stored Boolean value.
Remedial required graph (hidden): DIRECTED · nodes: "0:true" · edges: none
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [boolean-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One tree node: a leaf value or an OR/AND gate.
Your choice: Operator nodes are needed to combine the leaf results.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
values=[0], edges=[] (2=OR, 3=AND, 1=true, 0=false)
```
Remedial question: **What does the root evaluate to?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. Evaluating children before their parent makes the root false.; ❌ "true" — This treats a leaf as an operator instead of returning the leaf's stored Boolean value.
Remedial required graph (hidden): DIRECTED · nodes: "0:false" · edges: none
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [same-op]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A parent points to its left and right child.
Your choice: Matching operator types do not create tree links.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
values=[2,0,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Remedial question: **What does the root evaluate to?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Evaluating children before their parent makes the root false.; ❌ "true" — This reverses the leaf encoding and treats stored 0 leaves as true.
Remedial required graph (hidden): DIRECTED · nodes: "0:OR", "1:false", "2:false" · edges: 0:OR→1:false, 0:OR→2:false
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
the root OR accepts its true left child
Your choice: The root is OR, so its true left child is enough.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
values=[3,1,1], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Remedial question: **What does the root evaluate to?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Evaluating children before their parent makes the root true.; ❌ "false" — This initializes an AND accumulator to false, so AND can never become true.
Remedial required graph (hidden): DIRECTED · nodes: "0:AND", "1:true", "2:true" · edges: 0:AND→1:true, 0:AND→2:true
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
a leaf returns its stored Boolean value
Your choice: The encoding is fixed: leaf 0 means false and leaf 1 means true.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
values=[2,3,0,1,1], edges=[[0,1],[0,2],[1,3],[1,4]] (2=OR, 3=AND, 1=true, 0=false)
```
Remedial question: **What does the root evaluate to?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Evaluating children before their parent makes the root true.; ❌ "false" — This requires both children to be true at an OR node instead of accepting either one.
Remedial required graph (hidden): DIRECTED · nodes: "0:OR", "1:AND", "2:false", "3:true", "4:true" · edges: 0:OR→1:AND, 0:OR→2:false, 1:AND→3:true, 1:AND→4:true
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `skip-leaf-edges` (authored level "Lost truth leaves"; authored goal, NOT shown to student: "Make leaf values essential to the root result.")
Everything the student sees (text):
```
S
Shawn's broken search

Shawn keeps the middle of the graph but disconnects every leaf.

Your main goal: Expose Shawn's mistake. Draw two graphs: first the correct graph, then Shawn's graph using the mistake.

CHOOSE THE ROOT GATE
root gate
OUTPUT
CORRECT OUTPUT
SHAWN’S OUTPUT
Drawing 1 of 2: Correct graph · Root gate: root
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
2 · Shawn's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT GATE / root gate", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | SHAWN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0:OR", "1:true", "2:false"): REJECTED with "Use root, L, R, LL, LR, ... to name tree positions."
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
SHAWN'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "One-child gate"; authored goal, NOT shown to student: "Give a gate two children whose values cannot be reduced to the last.")
Everything the student sees (text):
```
K
Khloe's broken search

Khloe keeps only the last branch it sees.

Your main goal: Expose Khloe's mistake. Draw two graphs: first the correct graph, then Khloe's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT GATE
root gate
OUTPUT
CORRECT OUTPUT
KHLOE’S OUTPUT
Drawing 1 of 2: Correct graph · Root gate: root
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
2 · Khloe's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT GATE / root gate", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | KHLOE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"error":"A Boolean operator node needs both a left and a right child."}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R, LL, LR, RL, RR · edges (in drawing order) root→L, root→R, L→LL, L→LR, R→RL, R→RR · start root
Grader's expected answers: correct output `["L","LL","LR","R","RL","root","RR"]` · character's output `["R","root","RR"]` · character's graph must be exactly: DIRECTED · nodes: L, LL, LR, R, RL, root, RR · edges: root→L, root→R, L→LL, L→LR, R→RL, R→RR
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","LL","LR","R","RL","root","RR"]
KHLOE'S OUTPUT
["R","root","RR"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Missing operand"; authored goal, NOT shown to student: "Put a required child on the final parent arrow.")
Everything the student sees (text):
```
T
Trenton's broken search

Trenton accidentally leaves the final direct link out of the graph.

Your main goal: Expose Trenton's mistake. Draw two graphs: first the correct graph, then Trenton's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE ROOT GATE
root gate
OUTPUT
CORRECT OUTPUT
TRENTON’S OUTPUT
Drawing 1 of 2: Correct graph · Root gate: root
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
2 · Trenton's graph
Check my graph
→
```
Start field: label "CHOOSE THE ROOT GATE / root gate", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | TRENTON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"error":"A Boolean operator node needs both a left and a right child."}
Graph the harness submitted as the correct graph: DIRECTED nodes root, L, R · edges (in drawing order) root→L, root→R · start root
Grader's expected answers: correct output `["L","R","root"]` · character's output `["L","root"]` · character's graph must be exactly: DIRECTED · nodes: L, R, root · edges: root→L
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["L","R","root"]
TRENTON'S OUTPUT
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
values=[0], edges=[] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:false" · edges: none
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "0:false has exactly 1 outgoing direct edge."
    feedback if wrong: 0:false has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each possible answer true and false.”"
    feedback if wrong: Many different tree objects can evaluate to the same boolean. Correct node rule: One tree node: a leaf value or an OR/AND gate.
- [NO is correct] (direct-vs-reach) "Because 0:false can reach itself, the graph should contain a direct 0:false→0:false edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct 0:false→0:false self-edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
0:false has 0 outgoing direct edges.
×
Many different tree objects can evaluate to the same boolean. Correct node rule: One tree node: a leaf value or an OR/AND gate.
×
Self-reachability can use zero edges. The input does not define a direct 0:false→0:false self-edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only leaves containing 0 or 1.”"
    feedback if wrong: Operator nodes are needed to combine the leaf results. Correct node rule: One tree node: a leaf value or an OR/AND gate.
- [NO is correct] (direct-vs-reach) "Because 0:false can reach itself, the graph should contain a direct 0:false→0:false edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct 0:false→0:false self-edge.
- [NO is correct] (local-degree) "0:false has exactly 1 outgoing direct edge."
    feedback if wrong: 0:false has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Operator nodes are needed to combine the leaf results. Correct node rule: One tree node: a leaf value or an OR/AND gate.
×
Self-reachability can use zero edges. The input does not define a direct 0:false→0:false self-edge.
×
0:false has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only inner nodes containing 2 or 3.”"
    feedback if wrong: The gates need leaf values as their base answers. Correct node rule: One tree node: a leaf value or an OR/AND gate.
- [NO is correct] (direct-vs-reach) "Because 0:false can reach itself, the graph should contain a direct 0:false→0:false edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct 0:false→0:false self-edge.
- [NO is correct] (local-degree) "0:false has exactly 1 outgoing direct edge."
    feedback if wrong: 0:false has 0 outgoing direct edges.
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
values=[2,0,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:OR", "1:false", "2:false" · edges: 0:OR→1:false, 0:OR→2:false
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only leaves containing 0 or 1.”"
    feedback if wrong: Operator nodes are needed to combine the leaf results. Correct node rule: One tree node: a leaf value or an OR/AND gate.
- [YES is correct] (direct-vs-reach) "0:OR and 2:false are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0:OR→2:false as one direct edge.
- [YES is correct] (local-degree) "0:OR has exactly 2 outgoing direct edges."
    feedback if wrong: 0:OR has 2 outgoing direct edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
values=[3,1,1], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:AND", "1:true", "2:true" · edges: 0:AND→1:true, 0:AND→2:true
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0:AND and 1:true are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0:AND→1:true as one direct edge.
- [YES is correct] (local-degree) "2:true has exactly 0 outgoing direct edges."
    feedback if wrong: 2:true has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each possible answer true and false.”"
    feedback if wrong: Many different tree objects can evaluate to the same boolean. Correct node rule: One tree node: a leaf value or an OR/AND gate.
Result: PASSED

### S3 Q4
Raw input shown:
```
values=[2,3,0,1,1], edges=[[0,1],[0,2],[1,3],[1,4]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:OR", "1:AND", "2:false", "3:true", "4:true" · edges: 0:OR→1:AND, 0:OR→2:false, 1:AND→3:true, 1:AND→4:true
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0:OR→1:AND and 1:AND→4:true, so it should also contain a direct 0:OR→4:true edge."
    feedback if wrong: Two direct edges through 1:AND do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0:OR has exactly 1 outgoing direct edge."
    feedback if wrong: 0:OR has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only inner nodes containing 2 or 3.”"
    feedback if wrong: The gates need leaf values as their base answers. Correct node rule: One tree node: a leaf value or an OR/AND gate.
Result: PASSED

### S3 Q5
Raw input shown:
```
values=[1], edges=[] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide: Required node-name format: Name each tree node levelOrderIndex:value, using true, false, AND, or OR. Example: 2:AND. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:true" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only leaves containing 0 or 1.”"
    feedback if wrong: Operator nodes are needed to combine the leaf results. Correct node rule: One tree node: a leaf value or an OR/AND gate.
- [YES is correct] (direct-vs-reach) "0:true can reach itself without using an edge, but the graph still has no direct 0:true→0:true edge."
    feedback if wrong: Correct. A zero-step path makes 0:true reachable from itself; it does not invent a self-edge.
- [YES is correct] (local-degree) "0:true has exactly 0 outgoing direct edges."
    feedback if wrong: 0:true has 0 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: AND gates are evaluated as OR
Input shown:
```
REAL PROBLEM INPUT
root: { val: 3, left: { val: 1 }, right: { val: 0 } }
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function evaluateTree(root) {
  if (!root.left && !root.right) {
    return root.val === 1;
  }
  const left = evaluateTree(root.left);
  const right = evaluateTree(root.right);
  if (root.val === 2) {
    return left || right;
  }
  return left || right;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "AND", "true", "false" · edges: AND→true, AND→false
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Leaf value 0 is converted to true by the base case, changing this input's returned value.
- B JavaScript short-circuiting skips evaluation of the right subtree on the shown input.
- C The fallback for operator 3 repeats left || right instead of requiring both values.
Diagnosis answer key + feedback:
- ❌ [leaf-inversion] "Leaf value 0 is converted to true by the base case, changing this input's returned value." — feedback: The leaf conversion is correct: only 1 becomes true.
- ❌ [short-circuit] "JavaScript short-circuiting skips evaluation of the right subtree on the shown input." — feedback: Both recursive calls happen before the boolean expression.
- ✅ [and-as-or] "The fallback for operator 3 repeats left || right instead of requiring both values." — feedback: Exactly. true AND false must return false.
Graph proof shown in feedback: code rule "Every internal node returns the OR of its child results." → changed graph "The root is an AND gate with one true leaf and one false leaf." → boundary "The children disagree, the case where AND and OR separate." → returned value "The helper returns true while the real AND root evaluates to false."
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
About your diagnosis: The leaf conversion is correct: only 1 becomes true.
Code rule: Every internal node returns the OR of its child results. → Changed graph: The root is an AND gate with one true leaf and one false leaf. → Reachable boundary: The children disagree, the case where AND and OR separate.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
AND gates are evaluated as OR
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every internal node returns the OR of its child results. → Changed graph: The root is an AND gate with one true leaf and one false leaf. → Reachable boundary: The children disagree, the case where AND and OR separate. → Returned value: The helper returns true while the real AND root evaluates to false.
```

### S4 case 2 — `case-2` · bug: AND gates are evaluated as OR
Input shown:
```
REAL PROBLEM INPUT
values=[3,1,0], edges=[[0,1],[0,2]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function evaluateTree(root) {
  if (!root.left && !root.right) {
    return root.val === 1;
  }
  const left = evaluateTree(root.left);
  const right = evaluateTree(root.right);
  if (root.val === 2) {
    return left || right;
  }
  return left || right;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:AND", "1:true", "2:false" · edges: 0:AND→1:true, 0:AND→2:false
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The fallback for operator 3 repeats left || right instead of requiring both values.
- B Leaf value 0 is converted to true by the base case, changing this input's returned value.
- C JavaScript short-circuiting skips evaluation of the right subtree on the shown input.
Diagnosis answer key + feedback:
- ❌ [leaf-inversion] "Leaf value 0 is converted to true by the base case, changing this input's returned value." — feedback: The leaf conversion is correct: only 1 becomes true.
- ❌ [short-circuit] "JavaScript short-circuiting skips evaluation of the right subtree on the shown input." — feedback: Both recursive calls happen before the boolean expression.
- ✅ [and-as-or] "The fallback for operator 3 repeats left || right instead of requiring both values." — feedback: Correct. AND node 0 has true and false children, but the repeated OR rule turns the required false result into true.
Graph proof shown in feedback: code rule "Every internal node returns the OR of its child results." → changed graph "AND node 0 points to leaf 1=true and leaf 2=false." → boundary "AND node 0 has children true and false, the exact pair where AND and OR disagree." → returned value "The shown code returns true; the real problem returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
AND gates are evaluated as OR
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every internal node returns the OR of its child results. → Changed graph: AND node 0 points to leaf 1=true and leaf 2=false. → Reachable boundary: AND node 0 has children true and false, the exact pair where AND and OR disagree. → Returned value: The shown code returns true; the real problem returns false.
```

### S4 case 3 — `case-4` · bug: AND gates are evaluated as OR
Input shown:
```
REAL PROBLEM INPUT
values=[3,0,2,1,1], edges=[[0,1],[0,2],[2,3],[2,4]] (2=OR, 3=AND, 1=true, 0=false)
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function evaluateTree(root) {
  if (!root.left && !root.right) {
    return root.val === 1;
  }
  const left = evaluateTree(root.left);
  const right = evaluateTree(root.right);
  if (root.val === 2) {
    return left || right;
  }
  return left || right;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:AND", "1:false", "2:OR", "3:true", "4:true" · edges: 0:AND→1:false, 0:AND→2:OR, 2:OR→3:true, 2:OR→4:true
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Leaf value 0 is converted to true by the base case, changing this input's returned value.
- B The fallback for operator 3 repeats left || right instead of requiring both values.
- C JavaScript short-circuiting skips evaluation of the right subtree on the shown input.
Diagnosis answer key + feedback:
- ❌ [leaf-inversion] "Leaf value 0 is converted to true by the base case, changing this input's returned value." — feedback: The leaf conversion is correct: only 1 becomes true.
- ❌ [short-circuit] "JavaScript short-circuiting skips evaluation of the right subtree on the shown input." — feedback: Both recursive calls happen before the boolean expression.
- ✅ [and-as-or] "The fallback for operator 3 repeats left || right instead of requiring both values." — feedback: Correct. Root AND combines false with a true OR subtree; using OR at the root changes false to true.
Graph proof shown in feedback: code rule "Every internal node returns the OR of its child results." → changed graph "Root 0 is AND with false leaf 1 and OR child 2; node 2 points to two true leaves." → boundary "Root AND sees false on the left and true from the right OR subtree, so replacing AND with OR flips the root." → returned value "The shown code returns true; the real problem returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
AND gates are evaluated as OR
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every internal node returns the OR of its child results. → Changed graph: Root 0 is AND with false leaf 1 and OR child 2; node 2 points to two true leaves. → Reachable boundary: Root AND sees false on the left and true from the right OR subtree, so replacing AND with OR flips the root. → Returned value: The shown code returns true; the real problem returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```