# Smallest String With Swaps (`smallest-string-with-swaps`) — original, undirected-graph

## Problem statement (Description tab)

You are given a string `s` and a list of index pairs called `pairs`, where each `pairs[i] = [a, b]` names two positions in the string (0-indexed).

You may swap the characters at the two positions of any pair, and you may do this **as many times as you like**, in any order, reusing pairs freely.

Return the lexicographically smallest string you can end up with. ("Lexicographically smallest" means the string that would come first in a dictionary.)

### Examples
- Example 1: input `s = "dcab", pairs = [[0,3],[1,2]]` → output `"bacd"`. Swap indexes 0 and 3 to get "bcad", then swap indexes 1 and 2 to get "bacd". Indexes {0, 3} form one group and {1, 2} form another, so the two groups sort their letters separately.
- Example 2: input `s = "dcab", pairs = [[0,3],[1,2],[0,2]]` → output `"abcd"`. The extra pair [0,2] links the two groups into one connected group {0, 1, 2, 3}, so all four letters can be fully sorted.
- Example 3: input `s = "cba", pairs = [[0,1],[1,2]]` → output `"abc"`. Indexes 0, 1, and 2 are all connected through chains of pairs, so the whole string can be sorted.

### Graph rules (authored)
- Nodes: String positions 0, 1, 2, and 3, each carrying its current letter.
- Edges: A two-way edge 0—3 because the letters at those positions may trade places in either direction.
- Node-name format shown in Step 1/3: Name each position `index:letter`. Example: `2:a`. Do not add spaces. (pattern `^\d+:[A-Za-z]$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-two-pairs`, facet "componentwise sorting")
Raw input shown:
```
s = "dcab", pairs = [[0,3],[1,2]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. "bacd"
2. "abcd"
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] ""bacd""
    feedback: Correct. Each pair is a separate component, so letters cannot cross between them.
- ❌ [near-miss] ""abcd""
    feedback: That result follows the swap across components bug, not the exact picture. (misconception: swap-across-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:d", "1:c", "2:a", "3:b" · edges: 0:d—3:b, 1:c—2:a
"Why" shown after success: Each pair is a separate component, so letters cannot cross between them.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact index pairs")
Raw input shown:
```
s = "dcab", pairs = [[0,3],[1,2]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 0:d / 1:c / 2:a / 3:b
2. Picture B / 0:d / 1:c / 2:a / 3:b
3. Picture C / 0:d / 1:c / 2:a / 3:b
4. Picture D / 0:d / 1:c / 2:a
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0:d, 1:c, 2:a, 3:b · edges: 0:d—3:b, 1:c—2:a
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0:d, 1:c, 2:a, 3:b · edges: 0:d—3:b
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0:d, 1:c, 2:a, 3:b · edges: 0:d→3:b, 1:c→2:a
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0:d, 1:c, 2:a · edges: 1:c—2:a
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-connected`, facet "two-way swap reach")
Raw input shown:
```
s = "dcab", pairs = [[0,3],[1,2],[0,2]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. "bacd"
2. "abcd"
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] ""abcd""
    feedback: Correct. All four positions join one component, allowing global sorting.
- ❌ [near-miss] ""bacd""
    feedback: That result follows the perform each pair once bug, not the exact picture. (misconception: perform-each-pair-once)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:d", "1:c", "2:a", "3:b" · edges: 0:d—3:b, 1:c—2:a, 0:d—2:a
"Why" shown after success: All four positions join one component, allowing global sorting.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`core-rule`, facet "all string positions")
Raw input shown:
```
For `s = "dcab"`, what should the swap-graph nodes represent?
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For s = "dcab", what should the swap-graph nodes represent?**
Choices as displayed (top to bottom):
1. A / The distinct letters d, c, a, and b, without their positions.
2. B / String positions 0, 1, 2, and 3, each carrying its current letter.
3. C / Each allowed swap pair should be one node.
4. D / Each group of mutually swappable positions should be one node.
Answer key + feedback per choice (data):
- ✅ CORRECT [indices] "String positions 0, 1, 2, and 3, each carrying its current letter."
    feedback: Correct. Swap pairs name positions, and letters can move among connected positions.
- ❌ [letters] "The distinct letters d, c, a, and b, without their positions."
    feedback: Pairs refer to indices. Losing positions makes it impossible to know which letters may swap. (misconception: letter-as-node)
- ❌ [pairs] "Each allowed swap pair should be one node."
    feedback: A pair is an edge between two position nodes. (misconception: swap-pair-as-node)
- ❌ [components] "Each group of mutually swappable positions should be one node."
    feedback: Those groups are components discovered from individual index nodes. (misconception: swap-component-as-node)
"Why" shown after success: Correct. Swap pairs name positions, and letters can move among connected positions.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`relation-rule`, facet "two-way swap reach")
Raw input shown:
```
How should a swap pair `[0,3]` be drawn?
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should a swap pair [0,3] be drawn?**
Choices as displayed (top to bottom):
1. A / A two-way edge 0—3 because the letters at those positions may trade places in either direction.
2. B / An arrow 0→3 because 0 is written first.
3. C / Connect the letters currently at positions 0 and 3 permanently.
4. D / Immediately draw direct edges between every pair of positions reachable through swap chains.
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way-swap] "A two-way edge 0—3 because the letters at those positions may trade places in either direction."
    feedback: Correct. Repeating swaps lets letters move throughout a connected component.
- ❌ [one-way-swap] "An arrow 0→3 because 0 is written first."
    feedback: A swap exchanges both positions; it is not a one-way move. (misconception: directed-swap)
- ❌ [letter-edge] "Connect the letters currently at positions 0 and 3 permanently."
    feedback: Letters move after swaps. The stable graph endpoints are positions, not current letter values. (misconception: edge-between-current-letters)
- ❌ [component-clique] "Immediately draw direct edges between every pair of positions reachable through swap chains."
    feedback: Those positions can eventually exchange letters, but the input only gives specific direct swap edges. (misconception: complete-swap-component)
"Why" shown after success: Correct. Repeating swaps lets letters move throughout a connected component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-no-pairs`, facet "all string positions")
Raw input shown:
```
s = "cba", pairs = []
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. "cba"
2. "abc"
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] ""cba""
    feedback: Correct. No position can exchange its character.
- ❌ [near-miss] ""abc""
    feedback: That result follows the sort whole string without swaps bug, not the exact picture. (misconception: sort-whole-string-without-swaps)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:c", "1:b", "2:a" · edges: none
"Why" shown after success: No position can exchange its character.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "componentwise sorting")
Raw input shown:
```
s = "dcab", pairs = [[0,3],[1,2]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For s="dcab", pairs=[[0,3],[1,2]], what smallest string can the two components make?**
Choices as displayed (top to bottom):
1. A / "abcd"
2. B / "bcad"
3. C / "dcab"
4. D / "bacd"
Answer key + feedback per choice (data):
- ✅ CORRECT [bacd] "`"bacd"`"
    feedback: Correct. Sort letters separately inside {0,3} and {1,2}.
- ❌ [abcd] "`"abcd"`"
    feedback: That moves letters between disconnected swap groups. (misconception: merge-components)
- ❌ [bcad] "`"bcad"`"
    feedback: This performs only the first useful swap and stops early. (misconception: single-swap-only)
- ❌ [dcab] "`"dcab"`"
    feedback: Both listed pairs allow useful swaps. (misconception: ignore-swaps)
"Why" shown after success: Correct. Sort letters separately inside {0,3} and {1,2}.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-repeat`, facet "componentwise sorting")
Raw input shown:
```
s = "baa", pairs = [[0,1]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. "aab"
2. "aba"
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] ""aba""
    feedback: Correct. Only positions 0 and 1 can swap; position 2 is fixed.
- ❌ [near-miss] ""aab""
    feedback: That result follows the move through isolated index bug, not the exact picture. (misconception: move-through-isolated-index)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0:b", "1:a", "2:a" · edges: 0:b—1:a
"Why" shown after success: Only positions 0 and 1 can swap; position 2 is fixed.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "componentwise sorting")
Raw input shown:
```
s = "dcab", pairs = [[0,3],[1,2],[0,2]]
```
Node-name guide shown: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Adding pair [0,2] connects all four indices. What smallest string results?**
Choices as displayed (top to bottom):
1. A / "bacd"
2. B / "acbd"
3. C / "dcab"
4. D / "abcd"
Answer key + feedback per choice (data):
- ✅ CORRECT [abcd] "`"abcd"`"
    feedback: Correct. All letters can move within one connected component.
- ❌ [bacd] "`"bacd"`"
    feedback: This still treats the old two components as separate. (misconception: ignore-bridge-pair)
- ❌ [acbd] "`"acbd"`"
    feedback: Connected swaps may be repeated, so the whole component can be fully sorted. (misconception: only-direct-swaps)
- ❌ [dcab] "`"dcab"`"
    feedback: The pairs permit several rearrangements. (misconception: no-transitive-swaps)
"Why" shown after success: Correct. All letters can move within one connected component.
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
s = "ba", pairs = [[0,1]]
```
Remedial question: **What should the function return?** · choices shown: "ab" | "ba"
Remedial answer key: ✅ ""ab"" — Correct. Sorting the one connected component puts a before b.; ❌ ""ba"" — That result follows the ignore allowed swap bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:b", "1:a" · edges: 0:b—1:a
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [letters]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
String positions 0, 1, 2, and 3, each carrying its current letter.
Your choice: Pairs refer to indices. Losing positions makes it impossible to know which letters may swap.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
s = "cba", pairs = [[0,2]]
```
Remedial question: **What should the function return?** · choices shown: "acb" | "abc"
Remedial answer key: ✅ ""abc"" — Correct. Position 1 remains b while positions 0 and 2 sort to a and c.; ❌ ""acb"" — That result follows the drop isolated position bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:c", "1:b", "2:a" · edges: 0:c—2:a
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [one-way-swap]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way edge 0—3 because the letters at those positions may trade places in either direction.
Your choice: A swap exchanges both positions; it is not a one-way move.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
s = "cba", pairs = [[0,1],[1,2]]
```
Remedial question: **What should the function return?** · choices shown: "abc" | "bac"
Remedial answer key: ✅ ""abc"" — Correct. Repeated swaps along the chain can permute all three positions.; ❌ ""bac"" — That result follows the allow only listed direct swaps once bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:c", "1:b", "2:a" · edges: 0:c—1:b, 1:b—2:a
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [abcd]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
"bacd"
Your choice: That moves letters between disconnected swap groups.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
s = "dcba", pairs = [[0,1],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: "abcd" | "cdab"
Remedial answer key: ✅ ""cdab"" — Correct. Each pair sorts independently to cd and ab.; ❌ ""abcd"" — That result follows the sort letters across components bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:d", "1:c", "2:b", "3:a" · edges: 0:d—1:c, 2:b—3:a
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [bacd]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
"abcd"
Your choice: This still treats the old two components as separate.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
s = "dcab", pairs = [[0,1],[1,2],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: "abcd" | "cadb"
Remedial answer key: ✅ ""abcd"" — Correct. Connectivity permits any number of swaps, not one pass over the pair list.; ❌ ""cadb"" — That result follows the apply pairs once in input order bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "0:d", "1:c", "2:a", "3:b" · edges: 0:d—1:c, 1:c—2:a, 2:a—3:b
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Swap allowed one direction"; authored goal, NOT shown to student: "List a pair backward from the direction the chosen position needs to travel.")
Everything the student sees (text):
```
L
Lucas's broken search

Lucas turns every two-way connection into a one-way arrow.

Your main goal: Expose Lucas's mistake. Draw two graphs: first the correct graph, then Lucas's graph using the mistake.

CHOOSE THE POSITION TO GROUP
position to group
OUTPUT
CORRECT OUTPUT
LUCAS’S OUTPUT
Drawing 1 of 2: Correct graph · Choose position to group
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
2 · Lucas's graph
Check my graph
→
```
Start field: label "CHOOSE THE POSITION TO GROUP / position to group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LUCAS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0:d", "1:c", "2:a", "3:b"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 1—0 · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 1→0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1`; ❌ curly braces → `{0,1}`; ❌ quoted numbers/strings → `["0","1"]`; ❌ reversed order → `[1,0]`; ✅ spaces inside brackets → `[ 0 , 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
LUCAS'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "Swap group cut short"; authored goal, NOT shown to student: "Connect one position to two swap chains so all interchangeable letters are found.")
Everything the student sees (text):
```
B
Brooklyn's broken search

Brooklyn follows only the first available branch and never comes back.

Your main goal: Expose Brooklyn's mistake. Draw two graphs: first the correct graph, then Brooklyn's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE POSITION TO GROUP
position to group
OUTPUT
CORRECT OUTPUT
BROOKLYN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose position to group
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
2 · Brooklyn's graph
Check my graph
→
```
Start field: label "CHOOSE THE POSITION TO GROUP / position to group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BROOKLYN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
BROOKLYN'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong position grouped"; authored goal, NOT shown to student: "Choose a nonfirst position in a different swap component from the first label.")
Everything the student sees (text):
```
Z
Zachary's broken search

Zachary uses the wrong position to group.

Your main goal: Expose Zachary's mistake. Draw two graphs: first the correct graph, then Zachary's graph using the mistake.

CHOOSE THE POSITION TO GROUP
position to group
OUTPUT
CORRECT OUTPUT
ZACHARY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose position to group
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
2 · Zachary's graph
Check my graph
→
```
Start field: label "CHOOSE THE POSITION TO GROUP / position to group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ZACHARY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 1—2 · start 0
Grader's expected answers: correct output `[0]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
ZACHARY'S OUTPUT
[1,2]
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
s = "cba", pairs = [[0,2]]
```
Node-name guide: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:c", "1:b", "2:a" · edges: 0:c—2:a
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "0:c has exactly 0 direct neighbors."
    feedback if wrong: 0:c has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “The distinct letters d, c, a, and b, without their positions.”"
    feedback if wrong: Pairs refer to indices. Losing positions makes it impossible to know which letters may swap. Correct node rule: One node for every string position, carrying that position's current character.
- [NO is correct] (direct-vs-reach) "0:c can reach 2:a, but there is no direct 0:c—2:a edge."
    feedback if wrong: The mini-example lists 0:c—2:a as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
0:c has 1 direct neighbor.
×
Pairs refer to indices. Losing positions makes it impossible to know which letters may swap. Correct node rule: One node for every string position, carrying that position's current character.
×
The mini-example lists 0:c—2:a as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "0:c can reach 2:a, but there is no direct 0:c—2:a edge."
    feedback if wrong: The mini-example lists 0:c—2:a as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1:b has exactly 1 direct neighbor."
    feedback if wrong: 1:b has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each allowed swap pair should be one node.”"
    feedback if wrong: A pair is an edge between two position nodes. Correct node rule: One node for every string position, carrying that position's current character.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists 0:c—2:a as one direct edge. A direct edge is different from a longer reachable route.
×
1:b has 0 direct neighbors.
×
A pair is an edge between two position nodes. Correct node rule: One node for every string position, carrying that position's current character.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "0:c can reach 2:a, but there is no direct 0:c—2:a edge."
    feedback if wrong: The mini-example lists 0:c—2:a as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "2:a has exactly 0 direct neighbors."
    feedback if wrong: 2:a has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each group of mutually swappable positions should be one node.”"
    feedback if wrong: Those groups are components discovered from individual index nodes. Correct node rule: One node for every string position, carrying that position's current character.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
✓
Edge direction matches
```
Result: PASSED

### S3 Q2
Raw input shown:
```
s = "cba", pairs = [[0,1],[1,2]]
```
Node-name guide: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:c", "1:b", "2:a" · edges: 0:c—1:b, 1:b—2:a
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each allowed swap pair should be one node.”"
    feedback if wrong: A pair is an edge between two position nodes. Correct node rule: One node for every string position, carrying that position's current character.
- [YES is correct] (direct-vs-reach) "0:c can reach 2:a through 1:b, but the graph still has no direct 0:c—2:a edge."
    feedback if wrong: Right. A multi-step route through 1:b creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1:b has exactly 2 direct neighbors."
    feedback if wrong: 1:b has 2 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
s = "dcba", pairs = [[0,1],[2,3]]
```
Node-name guide: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:d", "1:c", "2:b", "3:a" · edges: 0:d—1:c, 2:b—3:a
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2:b and 3:a are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2:b—3:a as one direct edge.
- [YES is correct] (local-degree) "1:c has exactly 1 direct neighbor."
    feedback if wrong: 1:c has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “The distinct letters d, c, a, and b, without their positions.”"
    feedback if wrong: Pairs refer to indices. Losing positions makes it impossible to know which letters may swap. Correct node rule: One node for every string position, carrying that position's current character.
Result: PASSED

### S3 Q4
Raw input shown:
```
s = "dcab", pairs = [[0,1],[1,2],[2,3]]
```
Node-name guide: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:d", "1:c", "2:a", "3:b" · edges: 0:d—1:c, 1:c—2:a, 2:a—3:b
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2:a has exactly 3 direct neighbors."
    feedback if wrong: 2:a has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each group of mutually swappable positions should be one node.”"
    feedback if wrong: Those groups are components discovered from individual index nodes. Correct node rule: One node for every string position, carrying that position's current character.
- [NO is correct] (direct-vs-reach) "The correct graph has 2:a—1:c and 1:c—0:d, so it should also contain a direct 2:a—0:d edge."
    feedback if wrong: Two direct edges through 1:c do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
s = "ba", pairs = [[0,1]]
```
Node-name guide: Required node-name format: Name each position index:letter. Example: 2:a. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0:b", "1:a" · edges: 0:b—1:a
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1:a has exactly 0 direct neighbors."
    feedback if wrong: 1:a has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each allowed swap pair should be one node.”"
    feedback if wrong: A pair is an edge between two position nodes. Correct node rule: One node for every string position, carrying that position's current character.
- [NO is correct] (direct-vs-reach) "0:b can reach 1:a, but there is no direct 0:b—1:a edge."
    feedback if wrong: The mini-example lists 0:b—1:a as one direct edge. A direct edge is different from a longer reachable route.
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

### S4 case 1 — `authored-deep-case` · bug: Swap pairs are treated as one-way
Input shown:
```
REAL PROBLEM INPUT
s = "ba", pairs = [[1,0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function smallestStringWithSwaps(s, pairs) {
  const text = s;
  const neighbors = Array.from({ length: text.length }, () => []);
  for (const [firstIndex, secondIndex] of pairs) {
    neighbors[firstIndex].push(secondIndex);
  }

  const visited = new Set();
  const answerCharacters = text.split("");
  for (let startIndex = 0; startIndex < text.length; startIndex++) {
    if (visited.has(startIndex)) continue;
    const connectedIndices = [];
    const stack = [startIndex];
    visited.add(startIndex);

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      connectedIndices.push(currentIndex);
      for (const nextIndex of neighbors[currentIndex]) {
        if (!visited.has(nextIndex)) {
          visited.add(nextIndex);
          stack.push(nextIndex);
        }
      }
    }

    const sortedCharacters = connectedIndices.map((index) => text[index]).sort();
    connectedIndices.sort((first, second) => first - second);
    for (let index = 0; index < connectedIndices.length; index++) {
      answerCharacters[connectedIndices[index]] = sortedCharacters[index];
    }
  }
  return answerCharacters.join("");
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "index 0: b", "index 1: a" · edges: index 1: a—index 0: b
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Lexicographically smallest reachable string" · expected buggy output `"ba"` · real correct output `"ab"`
Diagnosis choices as displayed:
- A Component characters should be sorted from largest to smallest.
- B A swap pair must connect both indexes in one component on the shown input.
- C The pair may be used only once, so components should not be formed in this case.
Diagnosis answer key + feedback:
- ✅ [directed-swap] "A swap pair must connect both indexes in one component on the shown input." — feedback: Correct. Positions 0 and 1 can exchange characters regardless of pair order.
- ❌ [sort-descending] "Component characters should be sorted from largest to smallest." — feedback: No. The smallest string places the smallest available character at the earliest index.
- ❌ [single-use] "The pair may be used only once, so components should not be formed in this case." — feedback: No. Swaps may be performed any number of times.
Graph proof shown in feedback: code rule "Only arrow 1→0 is stored, and component discovery starts at index 0." → changed graph "The pair forms one undirected component containing indexes 0 and 1." → boundary "The pair is written opposite the ascending scan direction." → returned value "The indexes are split into singleton groups, leaving ba instead of allowing ab."
Output-format probes: ❌ unquoted string → `ba`; ❌ single-quoted string → `'ba'`; ❌ trailing period → `"ba".`
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
About your diagnosis: No. The smallest string places the smallest available character at the earliest index.
Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0. → Changed graph: The pair forms one undirected component containing indexes 0 and 1. → Reachable boundary: The pair is written opposite the ascending scan direction.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Swap pairs are treated as one-way
INCORRECT OUTPUT
"ba"
CORRECT OUTPUT
"ab"
Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0. → Changed graph: The pair forms one undirected component containing indexes 0 and 1. → Reachable boundary: The pair is written opposite the ascending scan direction. → Returned value: The indexes are split into singleton groups, leaving ba instead of allowing ab.
```

### S4 case 2 — `build-connected` · bug: Swap pairs are treated as one-way
Input shown:
```
REAL PROBLEM INPUT
s = "dcab", pairs = [[0,3],[1,2],[0,2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function smallestStringWithSwaps(s, pairs) {
  const text = s;
  const neighbors = Array.from({ length: text.length }, () => []);
  for (const [firstIndex, secondIndex] of pairs) {
    neighbors[firstIndex].push(secondIndex);
  }

  const visited = new Set();
  const answerCharacters = text.split("");
  for (let startIndex = 0; startIndex < text.length; startIndex++) {
    if (visited.has(startIndex)) continue;
    const connectedIndices = [];
    const stack = [startIndex];
    visited.add(startIndex);

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      connectedIndices.push(currentIndex);
      for (const nextIndex of neighbors[currentIndex]) {
        if (!visited.has(nextIndex)) {
          visited.add(nextIndex);
          stack.push(nextIndex);
        }
      }
    }

    const sortedCharacters = connectedIndices.map((index) => text[index]).sort();
    connectedIndices.sort((first, second) => first - second);
    for (let index = 0; index < connectedIndices.length; index++) {
      answerCharacters[connectedIndices[index]] = sortedCharacters[index];
    }
  }
  return answerCharacters.join("");
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0:d", "1:c", "2:a", "3:b" · edges: 0:d—3:b, 1:c—2:a, 0:d—2:a
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Lexicographically smallest reachable string" · expected buggy output `"acbd"` · real correct output `"abcd"`
Diagnosis choices as displayed:
- A Component characters should be sorted from largest to smallest.
- B The pair may be used only once, so components should not be formed in this case.
- C A swap pair must connect both indexes in one component on the shown input.
Diagnosis answer key + feedback:
- ✅ [directed-swap] "A swap pair must connect both indexes in one component on the shown input." — feedback: Correct. Edges 0—3, 0—2, and 1—2 connect all four indexes; one-way storage prevents the ascending scan from collecting the full component for global sorting. Therefore the shown code returns "acbd", while the real problem returns "abcd".
- ❌ [sort-descending] "Component characters should be sorted from largest to smallest." — feedback: No. The smallest string places the smallest available character at the earliest index.
- ❌ [single-use] "The pair may be used only once, so components should not be formed in this case." — feedback: No. Swaps may be performed any number of times.
Graph proof shown in feedback: code rule "Only arrow 1→0 is stored, and component discovery starts at index 0." → changed graph "Nodes: 0:d, 1:c, 2:a, 3:b. Direct edges: 0:d—3:b; 1:c—2:a; 0:d—2:a." → boundary "Edges 0—3, 0—2, and 1—2 connect all four indexes; one-way storage prevents the ascending scan from collecting the full component for global sorting." → returned value "The shown code returns "acbd"; the source-repo reference solution returns "abcd"."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Swap pairs are treated as one-way
INCORRECT OUTPUT
"acbd"
CORRECT OUTPUT
"abcd"
Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0. → Changed graph: Nodes: 0:d, 1:c, 2:a, 3:b. Direct edges: 0:d—3:b; 1:c—2:a; 0:d—2:a. → Reachable boundary: Edges 0—3, 0—2, and 1—2 connect all four indexes; one-way storage prevents the ascending scan from collecting the full component for global sorting. → Returned value: The shown code returns "acbd"; the source-repo reference solution returns "abcd".
```

### S4 case 3 — `reverse-written-three-index-component` · bug: Swap pairs are treated as one-way
Input shown:
```
REAL PROBLEM INPUT
s = "cba", pairs = [[2,1],[1,0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function smallestStringWithSwaps(s, pairs) {
  const text = s;
  const neighbors = Array.from({ length: text.length }, () => []);
  for (const [firstIndex, secondIndex] of pairs) {
    neighbors[firstIndex].push(secondIndex);
  }

  const visited = new Set();
  const answerCharacters = text.split("");
  for (let startIndex = 0; startIndex < text.length; startIndex++) {
    if (visited.has(startIndex)) continue;
    const connectedIndices = [];
    const stack = [startIndex];
    visited.add(startIndex);

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      connectedIndices.push(currentIndex);
      for (const nextIndex of neighbors[currentIndex]) {
        if (!visited.has(nextIndex)) {
          visited.add(nextIndex);
          stack.push(nextIndex);
        }
      }
    }

    const sortedCharacters = connectedIndices.map((index) => text[index]).sort();
    connectedIndices.sort((first, second) => first - second);
    for (let index = 0; index < connectedIndices.length; index++) {
      answerCharacters[connectedIndices[index]] = sortedCharacters[index];
    }
  }
  return answerCharacters.join("");
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "index 0: c", "index 1: b", "index 2: a" · edges: index 2: a—index 1: b, index 1: b—index 0: c
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Lexicographically smallest reachable string" · expected buggy output `"cba"` · real correct output `"abc"`
Diagnosis choices as displayed:
- A A swap pair must connect both indexes in one component on the shown input.
- B Component characters should be sorted from largest to smallest.
- C The pair may be used only once, so components should not be formed in this case.
Diagnosis answer key + feedback:
- ✅ [directed-swap] "A swap pair must connect both indexes in one component on the shown input." — feedback: Correct. Both swap pairs join all three indexes, but one-way storage strands each index when the outer loop visits them from 0 upward. Therefore the shown code returns "cba", while the real problem returns "abc".
- ❌ [sort-descending] "Component characters should be sorted from largest to smallest." — feedback: No. The smallest string places the smallest available character at the earliest index.
- ❌ [single-use] "The pair may be used only once, so components should not be formed in this case." — feedback: No. Swaps may be performed any number of times.
Graph proof shown in feedback: code rule "Only arrow 1→0 is stored, and component discovery starts at index 0." → changed graph "Nodes: index 0: c, index 1: b, index 2: a. Direct edges: index 2: a—index 1: b; index 1: b—index 0: c." → boundary "Both swap pairs join all three indexes, but one-way storage strands each index when the outer loop visits them from 0 upward." → returned value "The shown code returns "cba"; the source-repo reference solution returns "abc"."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Swap pairs are treated as one-way
INCORRECT OUTPUT
"cba"
CORRECT OUTPUT
"abc"
Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0. → Changed graph: Nodes: index 0: c, index 1: b, index 2: a. Direct edges: index 2: a—index 1: b; index 1: b—index 0: c. → Reachable boundary: Both swap pairs join all three indexes, but one-way storage strands each index when the outer loop visits them from 0 upward. → Returned value: The shown code returns "cba"; the source-repo reference solution returns "abc".
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```