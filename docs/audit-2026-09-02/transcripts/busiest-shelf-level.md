# Busiest Shelf Level (`busiest-shelf-level`) — variant, nested

## Problem statement (Description tab)

A warehouse inventory is written as a **nested array**: each element is either an integer (an item ID) or another array (a container holding more stuff).

Elements directly in the top-level array are at depth `1`; each layer of nesting adds `1` to the depth. For example, in `[[1,2],3]`, the item `3` is at depth 1 and the items `1` and `2` are at depth 2.

The manager wants to know which nesting level is the most crowded.

Write a function `busiestDepth(items)` that returns the depth that contains the **largest number of items** (integers). If two or more depths are tied for the most items, return the **smallest** of those depths. You are guaranteed the nested array contains at least one integer.

### Examples
- Example 1: input `items = [[1,2],[3,[4,5]],6]` → output `2`. Depth 1 holds one item (6). Depth 2 holds three items (1, 2, 3). Depth 3 holds two items (4, 5). Depth 2 is the busiest.
- Example 2: input `items = [[7],8]` → output `1`. Depth 1 holds one item (8) and depth 2 holds one item (7). It is a tie, so we return the smaller depth: 1.

### Graph rules (authored)
- Nodes: Every array container and every integer item.
- Edges: Connect an array to each item or inner array written directly inside it.
- Node-name format shown in Step 1/3: Use `root=[]` for the outer list. Then use each index path and value, such as `root[1]=[]` or `root[1][0]=7`. (pattern `^root(?:\[\d+\])*(?:=\[\]|=-?\d+)$`)
- Step 2 node-label rule: `nested-path` — Use root, root[0], root[1], ... to name nested input items.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "busiest depth")
Raw input shown:
```
items=[1,[2,3],[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which depth contains the most integer items?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Depth 2 contains 2 integer items, more than any other depth; ties favor shallower depth.
- ❌ [bug] "3"
    feedback: This shifts integer depth when crossing an array container. (misconception: off-by-one-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=2, root[1]=[]→root[1][1]=3, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
"Why" shown after success: Depth 2 contains 2 integer items, more than any other depth; ties favor shallower depth.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact nesting")
Raw input shown:
```
items=[1,[2,3],[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
2. Picture B / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
3. Picture C / Outer array / 1 / at [0] / Array / at [1] / 2 / at [1][0] / 3 / at [1][1] / Array / at [2] / Array / at [2][0] / 4 / at [2][0][0]
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

### S1 Q3 — CONCEPT (`concept-node`, facet "item identity")
Raw input shown:
```
items = [1,[2,3],[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What needs its own node in the nested shelf picture?**
Choices as displayed (top to bottom):
1. A / Only the integers; arrays are just punctuation with no place in the picture.
2. B / Every array container and every integer item.
3. C / Only arrays, because the answer asks for a depth rather than an item count.
4. D / One node for depth 1, one for depth 2, and so on.
Answer key + feedback per choice (data):
- ✅ CORRECT [arrays-and-items] "Every array container and every integer item."
    feedback: Correct. Arrays create levels, and integers are the items counted at those levels.
- ❌ [items-only] "Only the integers; arrays are just punctuation with no place in the picture."
    feedback: Without array nodes, the picture loses the nesting that determines each item's depth. (misconception: omit-containers)
- ❌ [arrays-only] "Only arrays, because the answer asks for a depth rather than an item count."
    feedback: The winning depth depends on how many integer items sit there, so items must appear too. (misconception: omit-items)
- ❌ [one-per-depth] "One node for depth 1, one for depth 2, and so on."
    feedback: Many different boxes and items can share a depth. Collapsing them loses the counts. (misconception: collapse-level)
"Why" shown after success: Correct. Arrays create levels, and integers are the items counted at those levels.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-2`, facet "busiest depth")
Raw input shown:
```
items=[[],1,[2,[]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which depth contains the most integer items?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.
- ❌ [bug] "2"
    feedback: This chooses the deeper depth when tied instead of the required shallower depth. (misconception: prefer-deeper-tie)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=1", "root[2]=[]", "root[2][0]=2", "root[2][1]=[]" · edges: root=[]→root[0]=[], root=[]→root[1]=1, root=[]→root[2]=[], root[2]=[]→root[2][0]=2, root[2]=[]→root[2][1]=[]
"Why" shown after success: Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-edge`, facet "direct containment")
Raw input shown:
```
items = [1,[2,3],[[4]]]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When should the nesting picture connect a container to something below it?**
Choices as displayed (top to bottom):
1. A / Connect an array to each item or inner array written directly inside it.
2. B / Connect an array directly to every integer anywhere inside it.
3. C / Connect items that happen to sit at the same depth.
4. D / Connect to an inner array only when that array contains an integer.
Answer key + feedback per choice (data):
- ✅ CORRECT [direct-content] "Connect an array to each item or inner array written directly inside it."
    feedback: Correct. Each such edge moves from a box to one direct child; crossing it adds one level.
- ❌ [all-descendants] "Connect an array directly to every integer anywhere inside it."
    feedback: That creates shortcuts across nested boxes and makes deep items look too shallow. (misconception: skip-levels)
- ❌ [same-depth] "Connect items that happen to sit at the same depth."
    feedback: Sharing a depth does not mean one item contains another. Depth is measured through containers. (misconception: peer-edge)
- ❌ [nonempty-only] "Connect to an inner array only when that array contains an integer."
    feedback: Empty arrays still occupy a real nesting position, even though they add no item to the tally. (misconception: drop-empty-array)
"Why" shown after success: Correct. Each such edge moves from a box to one direct child; crossing it adds one level.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "busiest depth")
Raw input shown:
```
items=[[3,2],5,[[4]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which depth contains the most integer items?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Depth 2 contains 2 integer items, more than any other depth; ties favor shallower depth.
- ❌ [bug] "3"
    feedback: This shifts integer depth when crossing an array container. (misconception: off-by-one-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=3", "root[0][1]=2", "root[1]=5", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=3, root[0]=[]→root[0][1]=2, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
"Why" shown after success: Depth 2 contains 2 integer items, more than any other depth; ties favor shallower depth.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "busiest depth")
Raw input shown:
```
items = [1,[2,3],[[4],[5,6,7]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For items = [1,[2,3],[[4],[5,6,7]]], which depth has the most integer items?**
Choices as displayed (top to bottom):
1. A / Depth 3
2. B / Depth 2
3. C / Depth 1
4. D / Depth 4
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "Depth `3`"
    feedback: Correct. Depth 3 holds 4, 5, 6, and 7: four items.
- ❌ [two] "Depth `2`"
    feedback: Depth 2 has only 2 and 3; the inner boxes place 4–7 one level deeper. (misconception: ignore-inner-box)
- ❌ [one] "Depth `1`"
    feedback: Depth 1 holds only integer 1; boxes themselves are not counted as items. (misconception: count-containers)
- ❌ [four] "Depth `4`"
    feedback: The integers 4–7 are inside two boxes from the root, so they sit at depth 3, not 4. (misconception: off-by-one-depth)
"Why" shown after success: Correct. Depth 3 holds 4, 5, 6, and 7: four items.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-counterexample`, facet "busiest depth")
Raw input shown:
```
items = [[],1,[2,[]]]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For items = [[],1,[2,[]]], depths 1 and 2 each hold one item. Which depth is returned?**
Choices as displayed (top to bottom):
1. A / Depth 2
2. B / Depth 1
3. C / Depth 3
4. D / Depth 0
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "Depth `1`"
    feedback: Correct. Ties go to the smaller depth.
- ❌ [two] "Depth `2`"
    feedback: Depth 2 ties with depth 1 but loses the shallower-depth tiebreak. (misconception: prefer-deeper-tie)
- ❌ [three] "Depth `3`"
    feedback: The depth-3 box is empty, so it contributes no item. (misconception: count-empty-box)
- ❌ [zero] "Depth `0`"
    feedback: The outer array is the container; its direct integer 1 is at depth 1. (misconception: start-at-zero)
"Why" shown after success: Correct. Ties go to the smaller depth.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`case-4`, facet "busiest depth")
Raw input shown:
```
items=[7]
```
Node-name guide shown: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which depth contains the most integer items?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.
- ❌ [bug] "0"
    feedback: This shifts integer depth when crossing an array container. (misconception: off-by-one-depth)
Graph the grader requires (hidden from student): DIRECTED · nodes: "root=[]", "root[0]=7" · edges: root=[]→root[0]=7
"Why" shown after success: Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.
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
items=[1,[4,[6]]]
```
Remedial question: **Which depth contains the most integer items?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.; ❌ "2" — This chooses the deeper depth when tied instead of the required shallower depth.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [items-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every array container and every integer item.
Your choice: Without array nodes, the picture loses the nesting that determines each item's depth.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
items=[[-3,3],[0]]
```
Remedial question: **Which depth contains the most integer items?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. Depth 2 contains 3 integer items, more than any other depth; ties favor shallower depth.; ❌ "1" — This shifts integer depth when crossing an array container.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=-3", "root[0][1]=3", "root[1]=[]", "root[1][0]=0" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=-3, root[0]=[]→root[0][1]=3, root=[]→root[1]=[], root[1]=[]→root[1][0]=0
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [all-descendants]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Connect an array to each item or inner array written directly inside it.
Your choice: That creates shortcuts across nested boxes and makes deep items look too shallow.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
items=[[],[5]]
```
Remedial question: **Which depth contains the most integer items?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. Depth 2 contains 1 integer item, more than any other depth; ties favor shallower depth.; ❌ "1" — This shifts integer depth when crossing an array container.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=5" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Depth 3
Your choice: Depth 2 has only 2 and 3; the inner boxes place 4–7 one level deeper.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
items=[[1],2,[3]]
```
Remedial question: **Which depth contains the most integer items?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. Depth 2 contains 2 integer items, more than any other depth; ties favor shallower depth.; ❌ "1" — This shifts integer depth when crossing an array container.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=[]", "root[2][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Depth 1
Your choice: Depth 2 ties with depth 1 but loses the shallower-depth tiebreak.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
items=[0,[0,[9]]]
```
Remedial question: **Which depth contains the most integer items?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. Depth 1 contains 1 integer item, more than any other depth; ties favor shallower depth.; ❌ "2" — This chooses the deeper depth when tied instead of the required shallower depth.
Remedial required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=0", "root[1]=[]", "root[1][0]=0", "root[1][1]=[]", "root[1][1][0]=9" · edges: root=[]→root[0]=0, root=[]→root[1]=[], root[1]=[]→root[1][0]=0, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=9
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Buried shelf"; authored goal, NOT shown to student: "Nest an item deeply enough that a one-level scan misses it.")
Everything the student sees (text):
```
C
Chase's broken search

Chase never explores beyond the start's immediate neighbors.

Your main goal: Expose Chase's mistake. Draw two graphs: first the correct graph, then Chase's graph using the mistake.

CHOOSE THE OUTER SHELF
outer shelf
OUTPUT
CORRECT OUTPUT
CHASE’S OUTPUT
Drawing 1 of 2: Correct graph · Outer shelf: root
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
2 · Chase's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER SHELF / outer shelf", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | CHASE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=2", "root[1][1]=3", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4"): REJECTED with "Use root, root[0], root[1], ... to name nested input items."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[0][0]\"]","buggy":"[\"root\",\"root[0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[0][0] · edges (in drawing order) root→root[0], root[0]→root[0][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[0][0]"]` · character's output `["root","root[0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[0][0] · edges: root→root[0], root[0]→root[0][0]
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `root, root[0], root[0][0]`; ❌ curly braces → `{root,root[0],root[0][0]}`; ✅ quoted numbers/strings → `["root","root[0]","root[0][0]"]`; ❌ reversed order → `["root[0][0]","root[0]","root"]`; ✅ spaces inside brackets → `[ "root" , "root[0]" , "root[0][0]" ]`; ❌ unquoted labels (if non-numeric) → `[root,root[0],root[0][0]]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[0][0]"]
CHASE'S OUTPUT
["root","root[0]"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `reverse-arrows` (authored level "Inside-out shelves"; authored goal, NOT shown to student: "Build nesting where reversing container arrows strands the contents.")
Everything the student sees (text):
```
A
Amelia's broken search

Amelia builds all directed connections in the opposite direction.

Your main goal: Expose Amelia's mistake. Draw two graphs: first the correct graph, then Amelia's graph using the mistake.

CHOOSE THE OUTER SHELF
outer shelf
OUTPUT
CORRECT OUTPUT
AMELIA’S OUTPUT
Drawing 1 of 2: Correct graph · Outer shelf: root
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
2 · Amelia's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER SHELF / outer shelf", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | AMELIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\"]","buggy":"[\"root\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root[0], root · edges (in drawing order) root→root[0] · start root
Grader's expected answers: correct output `["root","root[0]"]` · character's output `["root"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0] · edges: root[0]→root
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]"]
AMELIA'S OUTPUT
["root"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Last cubby only"; authored goal, NOT shown to student: "Give the outer shelf multiple branches so keeping only the last one changes the scan.")
Everything the student sees (text):
```
D
Diego's broken search

Diego keeps only the last branch it sees.

Your main goal: Expose Diego's mistake. Draw two graphs: first the correct graph, then Diego's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE OUTER SHELF
outer shelf
OUTPUT
CORRECT OUTPUT
DIEGO’S OUTPUT
Drawing 1 of 2: Correct graph · Outer shelf: root
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
2 · Diego's graph
Check my graph
→
```
Start field: label "CHOOSE THE OUTER SHELF / outer shelf", placeholder "Example: root", prefilled "root", readonly=true
Output labels: CORRECT OUTPUT | DIEGO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"root\",\"root[0]\",\"root[1]\",\"root[1][0]\"]","buggy":"[\"root\",\"root[1]\",\"root[1][0]\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes root, root[0], root[1], root[1][0] · edges (in drawing order) root→root[0], root→root[1], root[1]→root[1][0] · start root
Grader's expected answers: correct output `["root","root[0]","root[1]","root[1][0]"]` · character's output `["root","root[1]","root[1][0]"]` · character's graph must be exactly: DIRECTED · nodes: root, root[0], root[1], root[1][0] · edges: root→root[0], root→root[1], root[1]→root[1][0]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["root","root[0]","root[1]","root[1][0]"]
DIEGO'S OUTPUT
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
items=[[-3,3],[0]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=-3", "root[0][1]=3", "root[1]=[]", "root[1][0]=0" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=-3, root[0]=[]→root[0][1]=3, root=[]→root[1]=[], root[1]=[]→root[1][0]=0
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][0]=0 through root[1]=[], but the graph still has no direct root=[]→root[1][0]=0 edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0][0]=-3 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0][0]=-3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for depth 1, one for depth 2, and so on.”"
    feedback if wrong: Many different boxes and items can share a depth. Collapsing them loses the counts. Correct node rule: Every array container and every integer item.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
×
root[0][0]=-3 has 0 outgoing direct edges.
×
Many different boxes and items can share a depth. Collapsing them loses the counts. Correct node rule: Every array container and every integer item.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "root=[] can reach root[0][0]=-3 through root[0]=[], but the graph still has no direct root=[]→root[0][0]=-3 edge."
    feedback if wrong: Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "root[0][1]=3 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0][1]=3 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the integers; arrays are just punctuation with no place in the picture.”"
    feedback if wrong: Without array nodes, the picture loses the nesting that determines each item's depth. Correct node rule: Every array container and every integer item.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through root[0]=[] creates reachability, not a new direct edge.
×
root[0][1]=3 has 0 outgoing direct edges.
×
Without array nodes, the picture loses the nesting that determines each item's depth. Correct node rule: Every array container and every integer item.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][1]=3, so it should also contain a direct root=[]→root[0][1]=3 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[1]=[] has exactly 2 outgoing direct edges."
    feedback if wrong: root[1]=[] has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only arrays, because the answer asks for a depth rather than an item count.”"
    feedback if wrong: The winning depth depends on how many integer items sit there, so items must appear too. Correct node rule: Every array container and every integer item.
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
items=[[],[5]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=5" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the integers; arrays are just punctuation with no place in the picture.”"
    feedback if wrong: Without array nodes, the picture loses the nesting that determines each item's depth. Correct node rule: Every array container and every integer item.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=5, so it should also contain a direct root=[]→root[1][0]=5 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[0]=[] has exactly 1 outgoing direct edge."
    feedback if wrong: root[0]=[] has 0 outgoing direct edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
items=[[1],2,[3]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=1", "root[1]=2", "root[2]=[]", "root[2][0]=3" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=1, root=[]→root[1]=2, root=[]→root[2]=[], root[2]=[]→root[2][0]=3
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[0]=[] and root[0]=[]→root[0][0]=1, so it should also contain a direct root=[]→root[0][0]=1 edge."
    feedback if wrong: Two direct edges through root[0]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "root[0][0]=1 has exactly 1 outgoing direct edge."
    feedback if wrong: root[0][0]=1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for depth 1, one for depth 2, and so on.”"
    feedback if wrong: Many different boxes and items can share a depth. Collapsing them loses the counts. Correct node rule: Every array container and every integer item.
Result: PASSED

### S3 Q4
Raw input shown:
```
items=[0,[0,[9]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=0", "root[1]=[]", "root[1][0]=0", "root[1][1]=[]", "root[1][1][0]=9" · edges: root=[]→root[0]=0, root=[]→root[1]=[], root[1]=[]→root[1][0]=0, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=9
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "root[0]=0 has exactly 0 outgoing direct edges."
    feedback if wrong: root[0]=0 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only arrays, because the answer asks for a depth rather than an item count.”"
    feedback if wrong: The winning depth depends on how many integer items sit there, so items must appear too. Correct node rule: Every array container and every integer item.
- [YES is correct] (direct-vs-reach) "root=[] can reach root[1][1]=[] through root[1]=[], but the graph still has no direct root=[]→root[1][1]=[] edge."
    feedback if wrong: Right. A multi-step route through root[1]=[] creates reachability, not a new direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
items=[1,[4,[6]]]
```
Node-name guide: Required node-name format: Use root=[] for the outer list. Then use each index path and value, such as root[1]=[] or root[1][0]=7. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "root=[]", "root[0]=1", "root[1]=[]", "root[1][0]=4", "root[1][1]=[]", "root[1][1][0]=6" · edges: root=[]→root[0]=1, root=[]→root[1]=[], root[1]=[]→root[1][0]=4, root[1]=[]→root[1][1]=[], root[1][1]=[]→root[1][1][0]=6
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "root=[] has exactly 3 outgoing direct edges."
    feedback if wrong: root=[] has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the integers; arrays are just punctuation with no place in the picture.”"
    feedback if wrong: Without array nodes, the picture loses the nesting that determines each item's depth. Correct node rule: Every array container and every integer item.
- [NO is correct] (direct-vs-reach) "The correct graph has root=[]→root[1]=[] and root[1]=[]→root[1][0]=4, so it should also contain a direct root=[]→root[1][0]=4 edge."
    feedback if wrong: Two direct edges through root[1]=[] do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Counts boxes as shelf items
Input shown:
```
REAL PROBLEM INPUT
items: [1, [2, 3], [[4]]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const counts = [];
  function visit(items, depth) {
    counts[depth] = (counts[depth] || 0) + items.length;
    for (const item of items) {
      if (Array.isArray(item)) {
        visit(item, depth + 1);
      }
    }
  }
  visit(input.items, 1);
  let bestDepth = 1;
  for (let depth = 2; depth < counts.length; depth++) {
    if ((counts[depth] || 0) > (counts[bestDepth] || 0)) {
      bestDepth = depth;
    }
  }

  return bestDepth;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root", "1", "box A", "2", "3", "box B", "box C", "4" · edges: root→1, root→box A, root→box B, box A→2, box A→3, box B→box C, box C→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "integer depth" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The code always returns the deepest occupied level for the shown graph.
- B The code resolves a tied count by choosing the deeper occupied level on this input.
- C The code adds every array element to the depth count, including inner boxes.
Diagnosis answer key + feedback:
- ✅ [counts-boxes] "The code adds every array element to the depth count, including inner boxes." — feedback: Correct. Only integer item nodes should make a shelf level busier.
- ❌ [deepest-wins] "The code always returns the deepest occupied level for the shown graph." — feedback: It compares counts across levels; the problem is what it counted, not automatically choosing the deepest.
- ❌ [tie-late] "The code resolves a tied count by choosing the deeper occupied level on this input." — feedback: Its strict greater-than keeps the shallower level on ties. The false tie was created by counting boxes.
Graph proof shown in feedback: code rule "At each depth, the code adds the number of child nodes whether they are items or boxes." → changed graph "The root contains item 1 and two boxes; the first box contains items 2 and 3, and the other branch reaches item 4." → boundary "Depth 1 contains one integer but three total children; depth 2 contains two integers." → returned value "The false 3-to-3 tie keeps depth 1, while item-only counting makes depth 2 busiest."
Output-format probes: ❌ quoted number → `"1"`; ❌ trailing period → `1.`
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
About your diagnosis: It compares counts across levels; the problem is what it counted, not automatically choosing the deepest.
Code rule: At each depth, the code adds the number of child nodes whether they are items or boxes. → Changed graph: The root contains item 1 and two boxes; the first box contains items 2 and 3, and the other branch reaches item 4. → Reachable boundary: Depth 1 contains one integer but three total children; depth 2 contains two integers.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts boxes as shelf items
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: At each depth, the code adds the number of child nodes whether they are items or boxes. → Changed graph: The root contains item 1 and two boxes; the first box contains items 2 and 3, and the other branch reaches item 4. → Reachable boundary: Depth 1 contains one integer but three total children; depth 2 contains two integers. → Returned value: The false 3-to-3 tie keeps depth 1, while item-only counting makes depth 2 busiest.
```

### S4 case 2 — `case-3` · bug: Counts boxes as shelf items
Input shown:
```
REAL PROBLEM INPUT
items=[[3,2],5,[[4]]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const counts = [];
  function visit(items, depth) {
    counts[depth] = (counts[depth] || 0) + items.length;
    for (const item of items) {
      if (Array.isArray(item)) {
        visit(item, depth + 1);
      }
    }
  }
  visit(input.items, 1);
  let bestDepth = 1;
  for (let depth = 2; depth < counts.length; depth++) {
    if ((counts[depth] || 0) > (counts[bestDepth] || 0)) {
      bestDepth = depth;
    }
  }

  return bestDepth;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[0][0]=3", "root[0][1]=2", "root[1]=5", "root[2]=[]", "root[2][0]=[]", "root[2][0][0]=4" · edges: root=[]→root[0]=[], root[0]=[]→root[0][0]=3, root[0]=[]→root[0][1]=2, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "integer depth" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The code adds every array element to the depth count, including inner boxes.
- B The code always returns the deepest occupied level for the shown graph.
- C The code resolves a tied count by choosing the deeper occupied level on this input.
Diagnosis answer key + feedback:
- ✅ [counts-boxes] "The code adds every array element to the depth count, including inner boxes." — feedback: Exactly. At each depth, the code adds the number of child nodes whether they are items or boxes. The shown code returns 1; the real problem returns 2.
- ❌ [deepest-wins] "The code always returns the deepest occupied level for the shown graph." — feedback: It compares counts across levels; the problem is what it counted, not automatically choosing the deepest.
- ❌ [tie-late] "The code resolves a tied count by choosing the deeper occupied level on this input." — feedback: Its strict greater-than keeps the shallower level on ties. The false tie was created by counting boxes.
Graph proof shown in feedback: code rule "At each depth, the code adds the number of child nodes whether they are items or boxes." → changed graph "Nodes are root=[], root[0]=[], root[0][0]=3, root[0][1]=2, root[1]=5, root[2]=[], root[2][0]=[], root[2][0][0]=4; direct arrows are root=[]→root[0]=[], root[0]=[]→root[0][0]=3, root[0]=[]→root[0][1]=2, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4." → boundary "count-container-nodes" → returned value "The shown code returns 1; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts boxes as shelf items
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: At each depth, the code adds the number of child nodes whether they are items or boxes. → Changed graph: Nodes are root=[], root[0]=[], root[0][0]=3, root[0][1]=2, root[1]=5, root[2]=[], root[2][0]=[], root[2][0][0]=4; direct arrows are root=[]→root[0]=[], root[0]=[]→root[0][0]=3, root[0]=[]→root[0][1]=2, root=[]→root[1]=5, root=[]→root[2]=[], root[2]=[]→root[2][0]=[], root[2][0]=[]→root[2][0][0]=4. → Reachable boundary: count-container-nodes → Returned value: The shown code returns 1; the real problem returns 2.
```

### S4 case 3 — `repair-3` · bug: Counts boxes as shelf items
Input shown:
```
REAL PROBLEM INPUT
items=[[],[5]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const counts = [];
  function visit(items, depth) {
    counts[depth] = (counts[depth] || 0) + items.length;
    for (const item of items) {
      if (Array.isArray(item)) {
        visit(item, depth + 1);
      }
    }
  }
  visit(input.items, 1);
  let bestDepth = 1;
  for (let depth = 2; depth < counts.length; depth++) {
    if ((counts[depth] || 0) > (counts[bestDepth] || 0)) {
      bestDepth = depth;
    }
  }

  return bestDepth;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "root=[]", "root[0]=[]", "root[1]=[]", "root[1][0]=5" · edges: root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "integer depth" · expected buggy output `1` · real correct output `2`
Diagnosis choices as displayed:
- A The code always returns the deepest occupied level for the shown graph.
- B The code adds every array element to the depth count, including inner boxes.
- C The code resolves a tied count by choosing the deeper occupied level on this input.
Diagnosis answer key + feedback:
- ✅ [counts-boxes] "The code adds every array element to the depth count, including inner boxes." — feedback: Exactly. At each depth, the code adds the number of child nodes whether they are items or boxes. The shown code returns 1; the real problem returns 2.
- ❌ [deepest-wins] "The code always returns the deepest occupied level for the shown graph." — feedback: It compares counts across levels; the problem is what it counted, not automatically choosing the deepest.
- ❌ [tie-late] "The code resolves a tied count by choosing the deeper occupied level on this input." — feedback: Its strict greater-than keeps the shallower level on ties. The false tie was created by counting boxes.
Graph proof shown in feedback: code rule "At each depth, the code adds the number of child nodes whether they are items or boxes." → changed graph "Nodes are root=[], root[0]=[], root[1]=[], root[1][0]=5; direct arrows are root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5." → boundary "count-container-nodes" → returned value "The shown code returns 1; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts boxes as shelf items
INCORRECT OUTPUT
1
CORRECT OUTPUT
2
Code rule: At each depth, the code adds the number of child nodes whether they are items or boxes. → Changed graph: Nodes are root=[], root[0]=[], root[1]=[], root[1][0]=5; direct arrows are root=[]→root[0]=[], root=[]→root[1]=[], root[1]=[]→root[1][0]=5. → Reachable boundary: count-container-nodes → Returned value: The shown code returns 1; the real problem returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```