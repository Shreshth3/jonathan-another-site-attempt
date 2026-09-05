# Coins on Level K (`coins-on-level-k`) — variant, nested

## Problem statement (Description tab)

A shipping company packs coins inside boxes, and boxes inside bigger boxes. This is written as a **nested array**: each element is either an integer (a coin's value) or another array (a smaller box).

The **depth** of an element works like this: elements sitting directly in the top-level array are at depth `1`. Every time you open a box and look inside, the depth goes up by `1`. For example, in `[3, [4, [5]]]`, the coin `3` is at depth 1, the coin `4` is at depth 2, and the coin `5` is at depth 3.

Customs only wants to tax the coins at one specific packing level.

Write a function `sumAtDepth(items, k)` that returns the **sum of all coin values at exactly depth `k`**. If there are no coins at depth `k`, return `0`.

### Examples
- Example 1: input `items = [[3,2],5,[[4]]], k = 2` → output `5`. The coins 3 and 2 are at depth 2 (inside one box). The coin 5 is at depth 1 and the coin 4 is at depth 3, so they are ignored. 3 + 2 = 5.
- Example 2: input `items = [1,[4,[6]]], k = 3` → output `6`. Only the coin 6 sits at depth 3. The coin 1 is at depth 1 and the coin 4 is at depth 2.

### Graph rules (authored)
- Nodes: Every array box and every integer coin, including coins outside the target level.
- Edges: A box points to each coin or smaller box directly inside it.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact level sum")
Raw input shown:
```
items=[1,[2,3],[[4]]], k=1
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned for exactly level k?**
Choices as displayed (top to bottom):
1. 1
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The integers at exactly depth 1 sum to 1.
- ❌ [bug] "5"
    feedback: This includes coins one level deeper than k. (misconception: include-deeper-level)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
"Why" shown after success: The integers at exactly depth 1 sum to 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "exact level sum")
Raw input shown:
```
items=[[],1,[2,[]]], k=2
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned for exactly level k?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. The integers at exactly depth 2 sum to 2.
- ❌ [bug] "3"
    feedback: This adds coins from shallower levels instead of only level k. (misconception: cumulative-through-k)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=1", "root[2]=[]", "root[2][0]=2", "root[2][1]=[]" · edges: root=[]→root[0]=[], root=[]→root[1]=1, root=[]→root[2]=[], root[2]=[]→root[2][0]=2, root[2]=[]→root[2][1]=[]
"Why" shown after success: The integers at exactly depth 2 sum to 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact nesting")
Raw input shown:
```
items=[1,[2,3],[[4]]], k=1
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
2. Picture C / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
3. Picture A / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
4. Picture D / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0]
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4 · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4 · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[]
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4 · edges: root[0]=1→root=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
    feedback: This reverses one listed arrow. (misconception: reverse-listed-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[] · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[]
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-node`, facet "coin identity")
Raw input shown:
```
items = [[3,2],5,[[4]]], k = 2
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which things become nodes in the boxes-and-coins picture?**
Choices as displayed (top to bottom):
1. A / Only coins whose final depth equals k.
2. B / Only positive-valued coins, since negative coins lower the sum.
3. C / One node for each numeric depth from 1 through k.
4. D / Every array box and every integer coin, including coins outside the target level.
Answer key + feedback per choice (data):
- ✅ CORRECT [boxes-coins] "Every array box and every integer coin, including coins outside the target level."
    feedback: Correct. The full nesting tree is needed to know which coins land exactly at level k.
- ❌ [target-coins] "Only coins whose final depth equals k."
    feedback: You do not know which coins are at depth k until you follow the box structure from the root. (misconception: pre-filter-answer)
- ❌ [positive-coins] "Only positive-valued coins, since negative coins lower the sum."
    feedback: Negative coins at depth k still contribute and must remain in the model. (misconception: drop-negative)
- ❌ [levels] "One node for each numeric depth from 1 through k."
    feedback: Depth labels are not the contents. Separate coins at one depth can have different parents and values. (misconception: depth-as-node)
"Why" shown after success: Correct. The full nesting tree is needed to know which coins land exactly at level k.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`case-3`, facet "exact level sum")
Raw input shown:
```
items=[[3,2],5,[[4]]], k=3
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned for exactly level k?**
Choices as displayed (top to bottom):
1. 4
2. 14
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The integers at exactly depth 3 sum to 4.
- ❌ [bug] "14"
    feedback: This adds coins from shallower levels instead of only level k. (misconception: cumulative-through-k)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=3", "root[0][1]=2", "root[1]=5", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=3, root[0]=[]→root[0][1]=2, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
"Why" shown after success: The integers at exactly depth 3 sum to 4.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-edge`, facet "direct containment")
Raw input shown:
```
items = [[3,2],5,[[4]]], k = 2
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does one parent-child edge mean in this nesting tree?**
Choices as displayed (top to bottom):
1. A / A box points to each coin or smaller box directly inside it.
2. B / Connect coins whose values add up to k.
3. C / Connect each item to the next item seen after flattening the arrays.
4. D / Connect every coin straight to the deepest box that contains it.
Answer key + feedback per choice (data):
- ✅ CORRECT [box-contains] "A box points to each coin or smaller box directly inside it."
    feedback: Correct. Following one box-to-child edge increases the child's depth by one.
- ❌ [coin-value] "Connect coins whose values add up to k."
    feedback: k is a depth, not a target coin sum. Coin values do not create connections. (misconception: k-as-sum)
- ❌ [flattened-order] "Connect each item to the next item seen after flattening the arrays."
    feedback: Flattened order erases which boxes contain which coins, so it cannot preserve depth. (misconception: flatten-first)
- ❌ [deepest-box] "Connect every coin straight to the deepest box that contains it."
    feedback: A coin connects to its immediate box. Skipping outer boxes gives the wrong depth. (misconception: skip-parent-boxes)
"Why" shown after success: Correct. Following one box-to-child edge increases the child's depth by one.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "exact level sum")
Raw input shown:
```
items = [[2,[3]],[[5],7],1], k = 2
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In [[2,[3]],[[5],7],1] with k=2, what sum comes from exactly level 2?**
Choices as displayed (top to bottom):
1. A / 9
2. B / 18
3. C / 6
4. D / 8
Answer key + feedback per choice (data):
- ✅ CORRECT [nine] "`9`"
    feedback: Correct. Coins 2 and 7 are at level 2, so 2 + 7 = 9.
- ❌ [eighteen] "`18`"
    feedback: That includes coins 3 and 5 from level 3 and coin 1 from level 1. (misconception: sum-all-coins)
- ❌ [six] "`6`"
    feedback: That counts 1, 2, and 3 while missing the separate level-2 coin 7. (misconception: flatten-by-order)
- ❌ [eight] "`8`"
    feedback: Coin 1 is at level 1, while level 2 contains 2 and 7. (misconception: count-top-and-seven)
"Why" shown after success: Correct. Coins 2 and 7 are at level 2, so 2 + 7 = 9.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "exact level sum")
Raw input shown:
```
items=[7], k=1
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What sum is returned for exactly level k?**
Choices as displayed (top to bottom):
1. 8
2. 7
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "7"
    feedback: Correct. The integers at exactly depth 1 sum to 7.
- ❌ [bug] "8"
    feedback: This adds 1 for the outer array container as though the container were a coin. (misconception: count-container-as-coin)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=7" · edges: root=[]→root[0]=7
"Why" shown after success: The integers at exactly depth 1 sum to 7.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "exact level sum")
Raw input shown:
```
items = [10,[20,[30,[40]]]], k = 4
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In [10,[20,[30,[40]]]] with k=4, which total is returned?**
Choices as displayed (top to bottom):
1. A / 100
2. B / 40
3. C / 30
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [forty] "`40`"
    feedback: Correct. Coin 40 is the only coin at level 4.
- ❌ [one-hundred] "`100`"
    feedback: That adds coins from every level instead of exactly level 4. (misconception: sum-all-depths)
- ❌ [thirty] "`30`"
    feedback: Coin 30 is at level 3, one level too shallow. (misconception: off-by-one-shallow)
- ❌ [zero] "`0`"
    feedback: The nested chain does reach level 4, where coin 40 sits. (misconception: stop-too-early)
"Why" shown after success: Correct. Coin 40 is the only coin at level 4.
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
items=[1,[4,[6]]], k=2
```
Remedial question: **What sum is returned for exactly level k?** · choices shown: 4 | 5
Remedial answer key: ✅ "4" — Correct. The integers at exactly depth 2 sum to 4.; ❌ "5" — This adds coins from shallower levels instead of only level k.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [target-coins]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every array box and every integer coin, including coins outside the target level.
Your choice: You do not know which coins are at depth k until you follow the box structure from the root.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
items=[[-3,3],[0]], k=2
```
Remedial question: **What sum is returned for exactly level k?** · choices shown: 1 | 0
Remedial answer key: ✅ "0" — Correct. The integers at exactly depth 2 sum to 0.; ❌ "1" — This adds 1 for a nested array container even though only integer coins contribute.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=-3", "root[0][1]=3", "root[1]=[]", "root[1][0]=0" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=-3, root[0]=[]→root[0][1]=3, root=[]→root[1]=[], root[1]=[]→root[1][0]=0
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [coin-value]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A box points to each coin or smaller box directly inside it.
Your choice: k is a depth, not a target coin sum. Coin values do not create connections.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
items=[[],[5]], k=2
```
Remedial question: **What sum is returned for exactly level k?** · choices shown: 5 | 6
Remedial answer key: ✅ "5" — Correct. The integers at exactly depth 2 sum to 5.; ❌ "6" — This includes coins one level deeper than k.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=5" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [eighteen]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
9
Your choice: That includes coins 3 and 5 from level 3 and coin 1 from level 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
items=[[1],2,[3]], k=2
```
Remedial question: **What sum is returned for exactly level k?** · choices shown: 6 | 4
Remedial answer key: ✅ "4" — Correct. The integers at exactly depth 2 sum to 4.; ❌ "6" — This adds coins from shallower levels instead of only level k.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=[]", "root[2][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [one-hundred]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
40
Your choice: That adds coins from every level instead of exactly level 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
items=[0,[0,[9]]], k=3
```
Remedial question: **What sum is returned for exactly level k?** · choices shown: 9 | 10
Remedial answer key: ✅ "9" — Correct. The integers at exactly depth 3 sum to 9.; ❌ "10" — This includes coins one level deeper than k.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=0", "root[1]=[]", "root[1][0]=0", "root[1][1]=[]", "root[1][1][0]=9" · edges: root=[]→root[0]=0, root=[]→root[1]=[], root[1]=[]→root[1][0]=0, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=9
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Lost last coin"; authored goal, NOT shown to student: "Place a needed coin behind the final containment link.")
Everything the student sees (text):
```
X
Xavier's broken search

Xavier stops reading one relation too early and drops the final edge.

Your main goal: Expose Xavier's mistake. Draw two graphs: first the correct graph, then Xavier's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
XAVIER’S OUTPUT
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
2 · Xavier's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | XAVIER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4"): REJECTED with "Use root, root[0], root[1], ... to name nested input items."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0]
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `root, root[0], root[0][0]`; ❌ curly braces → `{root,root[0],root[0][0]}`; ✅ quoted numbers/strings → `["root","root[0]","root[0][0]"]`; ❌ reversed order → `["root[0][0]","root[0]","root"]`; ✅ spaces inside brackets → `[ "root" , "root[0]" , "root[0][0]" ]`; ❌ unquoted labels (if non-numeric) → `[root,root[0],root[0][0]]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
XAVIER'S OUTPUT
["root","root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong box first"; authored goal, NOT shown to student: "Make starting inside the first small box change which coin levels are seen.")
Everything the student sees (text):
```
A
Adam's broken search

Adam uses the wrong outer box.

Your main goal: Expose Adam's mistake. Draw two graphs: first the correct graph, then Adam's graph using the mistake.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
ADAM’S OUTPUT
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
2 · Adam's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | ADAM’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
ADAM'S OUTPUT
["root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Deep coin"; authored goal, NOT shown to student: "Create a coin below the first nesting level so a shallow search fails.")
Everything the student sees (text):
```
V
Valeria's broken search

Valeria visits only the start and its direct neighboring nested items.

Your main goal: Expose Valeria's mistake. Draw two graphs: first the correct graph, then Valeria's graph using the mistake.

CHOOSE THE OUTER BOX
outer box
OUTPUT
CORRECT OUTPUT
VALERIA’S OUTPUT
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
2 · Valeria's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER BOX / outer box", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | VALERIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0], root[0]→root[0][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
VALERIA'S OUTPUT
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
items=[[],[5]], k=2
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=5" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "root[1][0]=5 has exactly 1 outgoing direct edge."
    feedback if wrong: root[1][0]=5 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only coins whose final depth equals k.”"
    feedback if wrong: You do not know which coins are at depth k until you follow the box structure from the root. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=5, so it should also contain a direct root=[]→root[1][0]=5 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
root[1][0]=5 has 0 outgoing direct edges.
×
You do not know which coins are at depth k until you follow the box structure from the root. Correct node rule: Every array box and every integer coin, including coins outside the target level.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only positive-valued coins, since negative coins lower the sum.”"
    feedback if wrong: Negative coins at depth k still contribute and must remain in the model. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=5, so it should also contain a direct root=[]→root[1][0]=5 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Negative coins at depth k still contribute and must remain in the model. Correct node rule: Every array box and every integer coin, including coins outside the target level.
×
Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
root[1]=[] has 1 outgoing direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=5 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=5 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0]=[] has exactly 0 outgoing direct edges."
    feedback if wrong: root[0]=[] has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each numeric depth from 1 through k.”"
    feedback if wrong: Depth labels are not the contents. Separate coins at one depth can have different parents and values. Correct node rule: Every array box and every integer coin, including coins outside the target level.
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
items=[[1],2,[3]], k=2
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=[]", "root[2][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=3
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only positive-valued coins, since negative coins lower the sum.”"
    feedback if wrong: Negative coins at depth k still contribute and must remain in the model. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][0]=1 through root[0]=[], but the graph still has no direct root=[]→root[0][0]=1 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[2]=[] has exactly 1 outgoing direct edge."
    feedback if wrong: root[2]=[] has 1 outgoing direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
items=[0,[0,[9]]], k=3
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=0", "root[1]=[]", "root[1][0]=0", "root[1][1]=[]", "root[1][1][0]=9" · edges: root=[]→root[0]=0, root=[]→root[1]=[], root[1]=[]→root[1][0]=0, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=9
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only coins whose final depth equals k.”"
    feedback if wrong: You do not know which coins are at depth k until you follow the box structure from the root. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=0 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=0 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[1][0]=0 has exactly 0 outgoing direct edges."
    feedback if wrong: root[1][0]=0 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
items=[1,[4,[6]]], k=2
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root[1]=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root[1]=[] has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each numeric depth from 1 through k.”"
    feedback if wrong: Depth labels are not the contents. Separate coins at one depth can have different parents and values. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [NO is correct] (direct-vs-reach) "The correct graph has root[1]=[]→root[1][1]=[] and root[1][1]=[]→root[1][1][0]=6, so it should also contain a direct root[1]=[]→root[1][1][0]=6 edge."
    feedback if wrong: Two direct edges through root[1][1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
items=[[-3,3],[0]], k=2
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=-3", "root[0][1]=3", "root[1]=[]", "root[1][0]=0" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=-3, root[0]=[]→root[0][1]=3, root=[]→root[1]=[], root[1]=[]→root[1][0]=0
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only positive-valued coins, since negative coins lower the sum.”"
    feedback if wrong: Negative coins at depth k still contribute and must remain in the model. Correct node rule: Every array box and every integer coin, including coins outside the target level.
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][1]=3 through root[0]=[], but the graph still has no direct root=[]→root[0][1]=3 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[0]=[] has 2 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: Starts depth counting at zero
Input shown:
```
REAL PROBLEM INPUT
items: [[3, 2], 5, [[4]]]
k: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumAtDepth(items, depth) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumAtDepth(item, depth + 1);
      } else if (depth === input.k) {
        total += item;
      }
    }
    return total;
  }
  return sumAtDepth(input.items, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root", "box A", "3", "2", "5", "box B", "box C", "4" · edges: root→box A, root→5, root→box B, box A→3, box A→2, box B→box C, box C→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number" · expected buggy output `4` · real correct output `5`
Diagnosis choices as displayed:
- A The outer array starts at depth 0, shifting every coin one level lower than the problem defines.
- B The code adds box sizes to the coin total, and that graph-level change determines the returned value.
- C The code stops when it sees an empty box and misses later coins, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [depth-origin] "The outer array starts at depth 0, shifting every coin one level lower than the problem defines." — feedback: Correct. Coins 3 and 2 are at problem depth 2, while the code calls that depth 1.
- ❌ [sum-boxes] "The code adds box sizes to the coin total, and that graph-level change determines the returned value." — feedback: Only plain numbers are added. The failure comes from the depth label.
- ❌ [skip-empty] "The code stops when it sees an empty box and misses later coins, changing this input's returned value." — feedback: There is no early return, and this input has no empty box.
Graph proof shown in feedback: code rule "The root call labels top-level contents depth 0." → changed graph "Coins 3 and 2 are two edges below the root container's contents convention and belong to level 2; coin 4 belongs to level 3." → boundary "The target-level coins and the deeper coin have different sums, 5 and 4." → returned value "The shifted test selects coin 4 and returns 4 instead of 5."
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
About your diagnosis: Only plain numbers are added. The failure comes from the depth label.
Code rule: The root call labels top-level contents depth 0. → Changed graph: Coins 3 and 2 are two edges below the root container's contents convention and belong to level 2; coin 4 belongs to level 3. → Reachable boundary: The target-level coins and the deeper coin have different sums, 5 and 4.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts depth counting at zero
INCORRECT OUTPUT
4
CORRECT OUTPUT
5
Code rule: The root call labels top-level contents depth 0. → Changed graph: Coins 3 and 2 are two edges below the root container's contents convention and belong to level 2; coin 4 belongs to level 3. → Reachable boundary: The target-level coins and the deeper coin have different sums, 5 and 4. → Returned value: The shifted test selects coin 4 and returns 4 instead of 5.
```

### S4 case 2 — `case-1` · bug: Starts depth counting at zero
Input shown:
```
REAL PROBLEM INPUT
items=[1,[2,3],[[4]]], k=1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumAtDepth(items, depth) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumAtDepth(item, depth + 1);
      } else if (depth === input.k) {
        total += item;
      }
    }
    return total;
  }
  return sumAtDepth(input.items, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number" · expected buggy output `5` · real correct output `1`
Diagnosis choices as displayed:
- A The code adds box sizes to the coin total, and that graph-level change determines the returned value.
- B The outer array starts at depth 0, shifting every coin one level lower than the problem defines.
- C The code stops when it sees an empty box and misses later coins, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [depth-origin] "The outer array starts at depth 0, shifting every coin one level lower than the problem defines." — feedback: Exactly. The root call labels top-level contents depth 0. The shown code returns 5; the real problem returns 1.
- ❌ [sum-boxes] "The code adds box sizes to the coin total, and that graph-level change determines the returned value." — feedback: Only plain numbers are added. The failure comes from the depth label.
- ❌ [skip-empty] "The code stops when it sees an empty box and misses later coins, changing this input's returned value." — feedback: There is no early return, and this input has no empty box.
Graph proof shown in feedback: code rule "The root call labels top-level contents depth 0." → changed graph "Nodes are root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4; direct arrows are root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4." → boundary "zero-based-depth" → returned value "The shown code returns 5; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts depth counting at zero
INCORRECT OUTPUT
5
CORRECT OUTPUT
1
Code rule: The root call labels top-level contents depth 0. → Changed graph: Nodes are root=[], root[0]=1, root[1]=[], root[1][0]=2, root[1][1]=3, root[2]=[], root[2][0]=[], root[2][0][0]=4; direct arrows are root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4. → Reachable boundary: zero-based-depth → Returned value: The shown code returns 5; the real problem returns 1.
```

### S4 case 3 — `case-2` · bug: Starts depth counting at zero
Input shown:
```
REAL PROBLEM INPUT
items=[[],1,[2,[]]], k=2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  function sumAtDepth(items, depth) {
    let total = 0;
    for (const item of items) {
      if (Array.isArray(item)) {
        total += sumAtDepth(item, depth + 1);
      } else if (depth === input.k) {
        total += item;
      }
    }
    return total;
  }
  return sumAtDepth(input.items, 0);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=1", "root[2]=[]", "root[2][0]=2", "root[2][1]=[]" · edges: root=[]→root[0]=[], root=[]→root[1]=1, root=[]→root[2]=[], root[2]=[]→root[2][0]=2, root[2]=[]→root[2][1]=[]
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number" · expected buggy output `0` · real correct output `2`
Diagnosis choices as displayed:
- A The code adds box sizes to the coin total, and that graph-level change determines the returned value.
- B The code stops when it sees an empty box and misses later coins, changing this input's returned value.
- C The outer array starts at depth 0, shifting every coin one level lower than the problem defines.
Diagnosis answer key + feedback:
- ✅ [depth-origin] "The outer array starts at depth 0, shifting every coin one level lower than the problem defines." — feedback: Exactly. The root call labels top-level contents depth 0. The shown code returns 0; the real problem returns 2.
- ❌ [sum-boxes] "The code adds box sizes to the coin total, and that graph-level change determines the returned value." — feedback: Only plain numbers are added. The failure comes from the depth label.
- ❌ [skip-empty] "The code stops when it sees an empty box and misses later coins, changing this input's returned value." — feedback: Empty boxes return normally; neither empty box stops traversal from reaching coin 2 in the other branch.
Graph proof shown in feedback: code rule "The root call labels top-level contents depth 0." → changed graph "Nodes are root=[], root[0]=[], root[1]=1, root[2]=[], root[2][0]=2, root[2][1]=[]; direct arrows are root=[]→root[0]=[], root=[]→root[1]=1, root=[]→root[2]=[], root[2]=[]→root[2][0]=2, root[2]=[]→root[2][1]=[]." → boundary "zero-based-depth" → returned value "The shown code returns 0; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Starts depth counting at zero
INCORRECT OUTPUT
0
CORRECT OUTPUT
2
Code rule: The root call labels top-level contents depth 0. → Changed graph: Nodes are root=[], root[0]=[], root[1]=1, root[2]=[], root[2][0]=2, root[2][1]=[]; direct arrows are root=[]→root[0]=[], root=[]→root[1]=1, root=[]→root[2]=[], root[2]=[]→root[2][0]=2, root[2]=[]→root[2][1]=[]. → Reachable boundary: zero-based-depth → Returned value: The shown code returns 0; the real problem returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```