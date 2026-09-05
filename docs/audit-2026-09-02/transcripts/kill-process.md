# Kill Process (`kill-process`) — original, tree

## Problem statement (Description tab)

Your computer is running `n` processes that form a tree. You are given two equal-length arrays: `pid[i]` is the ID of the `i`-th process, and `ppid[i]` is the ID of its **parent** process. Exactly one process is the root of the tree, and its parent ID is `0` (meaning it has no parent).

When you kill a process, every one of its child processes gets killed too — and their children, and so on, all the way down the tree.

Given an integer `kill` (guaranteed to be one of the IDs in `pid`), return a list of the IDs of **all** processes that end up killed when you kill process `kill`. The IDs may be returned in any order.

### Examples
- Example 1: input `pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5` → output `[5,10]`. Process 3 is the root with children 1 and 5, and process 5 has child 10. Killing 5 also kills 10.
- Example 2: input `pid = [1], ppid = [0], kill = 1` → output `[1]`. There is only one process, so killing it kills just itself.

### Graph rules (authored)
- Nodes: Processes 3, 1, and 5.
- Edges: 3→5, from parent process 3 down to child process 5.
- Node-name format shown in Step 1/3: Use the exact ID from the input only. Example: `15`. (pattern `^\d+$`)
- Step 2 node-label rule: `positive-integer` — Use positive integer IDs, matching the problem input.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-subtree`, facet "killed subtree")
Raw input shown:
```
pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [5,10]
2. [3,5,10]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[5,10]"
    feedback: Correct. Killing 5 spreads down to 10, not up to parent 3.
- ❌ [near-miss] "[3,5,10]"
    feedback: That result follows the include ancestor bug, not the exact picture. (misconception: include-ancestor)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "3", "10", "5" · edges: 3→1, 5→10, 3→5
"Why" shown after success: Killing 5 spreads down to 10, not up to parent 3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact pid rows")
Raw input shown:
```
pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 1 / 3 / 10 / 5
2. Picture B / 1 / 3 / 10 / 5
3. Picture C / 1 / 3 / 10 / 5
4. Picture D / 1 / 3 / 10
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 1, 3, 10, 5 · edges: 3→1, 5→10, 3→5
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 1, 3, 10, 5 · edges: 3→1, 5→10
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 1, 3, 10, 5 · edges: 1→3, 10→5, 5→3
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 1, 3, 10 · edges: 3→1
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-root`, facet "parent-to-child edges")
Raw input shown:
```
pid = [1,2,3], ppid = [0,1,1], kill = 1
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [1]
2. [1,2,3]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[1,2,3]"
    feedback: Correct. Both children lie below process 1.
- ❌ [near-miss] "[1]"
    feedback: That result follows the kill only selected process bug, not the exact picture. (misconception: kill-only-selected-process)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 1→3
"Why" shown after success: Both children lie below process 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`core-rule`, facet "process identity")
Raw input shown:
```
For `pid = [3,1,5]` and `ppid = [0,3,3]`, what are the real process nodes?
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For pid = [3,1,5] and ppid = [0,3,3], what are the real process nodes?**
Choices as displayed (top to bottom):
1. A / Processes 0, 3, 1, and 5.
2. B / Processes 3, 1, and 5.
3. C / Nodes 0, 1, and 2 because those are the array positions.
4. D / Only the process named by kill and its direct children.
Answer key + feedback per choice (data):
- ✅ CORRECT [pid-values] "Processes 3, 1, and 5."
    feedback: Correct. Each ID in `pid` names one running process.
- ❌ [include-zero] "Processes 0, 3, 1, and 5."
    feedback: Zero is a fake parent marker for the root process, not a running process in `pid`. (misconception: include-fake-root)
- ❌ [array-indices] "Nodes 0, 1, and 2 because those are the array positions."
    feedback: Array positions pair the two arrays. The actual node labels are the process IDs stored in `pid`. (misconception: index-as-process-id)
- ❌ [killed-only] "Only the process named by `kill` and its direct children."
    feedback: All processes form the tree before a kill is selected, including deeper descendants and unaffected branches. (misconception: partial-kill-subtree-as-graph)
"Why" shown after success: Correct. Each ID in `pid` names one running process.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`relation-rule`, facet "parent-to-child edges")
Raw input shown:
```
At an index where `pid[i] = 5` and `ppid[i] = 3`, what edge should be drawn?
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **At an index where pid[i] = 5 and ppid[i] = 3, what edge should be drawn?**
Choices as displayed (top to bottom):
1. A / 5→3 because the pid value appears before the ppid value.
2. B / A two-way line 3—5 because parent and child are related.
3. C / 3→5, from parent process 3 down to child process 5.
4. D / Draw an edge from array index i to process 5.
Answer key + feedback per choice (data):
- ✅ CORRECT [parent-child] "3→5, from parent process 3 down to child process 5."
    feedback: Correct. Killing a parent spreads along this direction to its child.
- ❌ [child-parent] "5→3 because the pid value appears before the ppid value."
    feedback: That reverses the family tree and would kill ancestors instead of descendants. (misconception: reverse-parent-edge)
- ❌ [two-way] "A two-way line 3—5 because parent and child are related."
    feedback: Kill effects flow downward only. Killing child 5 does not kill parent 3. (misconception: make-family-edge-undirected)
- ❌ [index-link] "Draw an edge from array index i to process 5."
    feedback: The arrays are parallel data, not graph nodes. Their values name both edge endpoints. (misconception: array-index-edge)
"Why" shown after success: Correct. Killing a parent spreads along this direction to its child.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-leaf`, facet "killed subtree")
Raw input shown:
```
pid = [1,2,3], ppid = [0,1,1], kill = 2
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. [2]
2. [1,2]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[2]"
    feedback: Correct. A leaf has no descendants, and killing it does not affect its parent.
- ❌ [near-miss] "[1,2]"
    feedback: That result follows the kill parent too bug, not the exact picture. (misconception: kill-parent-too)
Graph the grader requires (hidden from student): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 1→3
"Why" shown after success: A leaf has no descendants, and killing it does not affect its parent.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "killed subtree")
Raw input shown:
```
pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For edges 3→1, 3→5, and 5→10, which processes die when kill=5?**
Choices as displayed (top to bottom):
1. A / [5]
2. B / [5,10]
3. C / [3,5,10]
4. D / [3,1,5,10]
Answer key + feedback per choice (data):
- ✅ CORRECT [five-ten] "`[5,10]`"
    feedback: Correct. Process 10 is a descendant of 5.
- ❌ [five] "`[5]`"
    feedback: This misses the child process 10. (misconception: kill-only-selected)
- ❌ [three-five-ten] "`[3,5,10]`"
    feedback: Killing a child does not kill its parent 3. (misconception: include-ancestor)
- ❌ [all] "`[3,1,5,10]`"
    feedback: Sibling branch 1 is not below process 5. (misconception: kill-whole-tree)
"Why" shown after success: Correct. Process 10 is a descendant of 5.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-single`, facet "process identity")
Raw input shown:
```
pid = [7], ppid = [0], kill = 7
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [7]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[7]"
    feedback: Correct. The selected process itself always dies.
- ❌ [near-miss] "[]"
    feedback: That result follows the return descendants only bug, not the exact picture. (misconception: return-descendants-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "7" · edges: none
"Why" shown after success: The selected process itself always dies.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "killed subtree")
Raw input shown:
```
pid = [1], ppid = [0], kill = 1
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **With one process pid=[1], ppid=[0], what dies when process 1 is killed?**
Choices as displayed (top to bottom):
1. A / []
2. B / [1]
3. C / [0,1]
4. D / [0]
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "`[1]`"
    feedback: Correct. The selected process dies even with no children.
- ❌ [empty] "`[]`"
    feedback: The killed process itself must be included. (misconception: only-descendants)
- ❌ [zero-one] "`[0,1]`"
    feedback: 0 is a fake parent marker, not a process. (misconception: include-fake-parent)
- ❌ [zero] "`[0]`"
    feedback: The input process is 1; 0 is not killable here. (misconception: confuse-root-marker)
"Why" shown after success: Correct. The selected process dies even with no children.
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
pid = [4,8,9], ppid = [0,4,8], kill = 4
```
Remedial question: **What should the function return?** · choices shown: [4,8,9] | [4,8]
Remedial answer key: ✅ "[4,8,9]" — Correct. The effect continues through every descendant depth.; ❌ "[4,8]" — That result follows the stop at grandchildren bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "4", "8", "9" · edges: 4→8, 8→9
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [include-zero]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Processes 3, 1, and 5.
Your choice: Zero is a fake parent marker for the root process, not a running process in pid.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
pid = [2,6], ppid = [0,2], kill = 2
```
Remedial question: **What should the function return?** · choices shown: [0,2,6] | [2,6]
Remedial answer key: ✅ "[2,6]" — Correct. Zero is a parent marker, not a process node in pid.; ❌ "[0,2,6]" — That result follows the include ppid zero bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "2", "6" · edges: 2→6
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [child-parent]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3→5, from parent process 3 down to child process 5.
Your choice: That reverses the family tree and would kill ancestors instead of descendants.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
pid = [5,9], ppid = [0,5], kill = 9
```
Remedial question: **What should the function return?** · choices shown: [9] | [5,9]
Remedial answer key: ✅ "[9]" — Correct. Killing child 9 does not travel backward to parent 5.; ❌ "[5,9]" — That result follows the reverse parent child edge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "5", "9" · edges: 5→9
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [five]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[5,10]
Your choice: This misses the child process 10.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
pid = [1,2,3,4], ppid = [0,1,1,2], kill = 2
```
Remedial question: **What should the function return?** · choices shown: [2,3,4] | [2,4]
Remedial answer key: ✅ "[2,4]" — Correct. Process 3 is a sibling, not a descendant of 2.; ❌ "[2,3,4]" — That result follows the include sibling bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 1→3, 2→4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [empty]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[1]
Your choice: The killed process itself must be included.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
pid = [1,2,3], ppid = [0,1,2], kill = 1
```
Remedial question: **What should the function return?** · choices shown: [1,2,3] | [1,2]
Remedial answer key: ✅ "[1,2,3]" — Correct. Grandchild 3 must also be killed.; ❌ "[1,2]" — That result follows the collect only direct children bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Parent killed by child"; authored goal, NOT shown to student: "Start at a child so an illegal upward move would terminate its parent.")
Everything the student sees (text):
```
Y
Yara's broken search

Yara turns every arrow into a two-way connection.

Your main goal: Expose Yara's mistake. Draw two graphs: first the correct graph, then Yara's graph using the mistake.

CHOOSE THE PROCESS TO KILL
process to kill
OUTPUT
CORRECT OUTPUT
YARA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose process to kill
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
2 · Yara's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROCESS TO KILL / process to kill", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | YARA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1", "3", "10", "5"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2 · edges: 2—1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1`; ❌ curly braces → `{1}`; ❌ quoted numbers/strings → `["1"]`; ✅ spaces inside brackets → `[ 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
YARA'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong PID selected"; authored goal, NOT shown to student: "Use process 1 as the kill ID, but make the mistaken search begin at process 2; give them different subtrees.")
Everything the student sees (text):
```
L
Louis's broken search

Louis uses the wrong process to kill.

Your main goal: Expose Louis's mistake. Draw two graphs: first the correct graph, then Louis's graph using the mistake.

CHOOSE THE PROCESS TO KILL
process to kill
OUTPUT
CORRECT OUTPUT
LOUIS’S OUTPUT
Drawing 1 of 2: Correct graph · Choose process to kill
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
2 · Louis's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROCESS TO KILL / process to kill", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LOUIS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "2" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2,3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 2→1, 2→3 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2,3]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 2→1, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
LOUIS'S OUTPUT
[1,2,3]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `last-branch` (authored level "Earlier child survives"; authored goal, NOT shown to student: "Give the killed process multiple children so following only the last child is visibly wrong.")
Everything the student sees (text):
```
A
Ari's broken search

Ari follows only the last available branch and ignores earlier choices.

Your main goal: Expose Ari's mistake. Draw two graphs: first the correct graph, then Ari's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE PROCESS TO KILL
process to kill
OUTPUT
CORRECT OUTPUT
ARI’S OUTPUT
Drawing 1 of 2: Correct graph · Choose process to kill
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
2 · Ari's graph
Check my graph
→
```
Start field: label "CHOOSE THE PROCESS TO KILL / process to kill", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ARI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,3,4]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1→2, 1→3, 3→4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,3,4]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3, 4 · edges: 1→2, 1→3, 3→4
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
ARI'S OUTPUT
[1,3,4]
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
pid = [1,2,3], ppid = [0,1,2], kill = 1
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1→3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Processes 0, 3, 1, and 5.”"
    feedback if wrong: Zero is a fake parent marker for the root process, not a running process in `pid`. Correct node rule: One node for every process ID in pid.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
×
1 has 1 outgoing direct edge.
×
Zero is a fake parent marker for the root process, not a running process in
pid
. Correct node rule: One node for every process ID in pid.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "2 has exactly 2 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Nodes 0, 1, and 2 because those are the array positions.”"
    feedback if wrong: Array positions pair the two arrays. The actual node labels are the process IDs stored in `pid`. Correct node rule: One node for every process ID in pid.
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→3, so it should also contain a direct 1→3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
2 has 1 outgoing direct edge.
×
Array positions pair the two arrays. The actual node labels are the process IDs stored in
pid
. Correct node rule: One node for every process ID in pid.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→3, so it should also contain a direct 1→3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 1 outgoing direct edge."
    feedback if wrong: 3 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the process named by `kill` and its direct children.”"
    feedback if wrong: All processes form the tree before a kill is selected, including deeper descendants and unaffected branches. Correct node rule: One node for every process ID in pid.
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
pid = [4,8,9], ppid = [0,4,8], kill = 4
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "4", "8", "9" · edges: 4→8, 8→9
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "8 has exactly 1 outgoing direct edge."
    feedback if wrong: 8 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Nodes 0, 1, and 2 because those are the array positions.”"
    feedback if wrong: Array positions pair the two arrays. The actual node labels are the process IDs stored in `pid`. Correct node rule: One node for every process ID in pid.
- [YES is correct] (direct-vs-reach) "4 can reach 9 through 8, but the graph still has no direct 4→9 edge."
    feedback if wrong: Right. A multi-step route through 8 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
pid = [2,6], ppid = [0,2], kill = 2
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "2", "6" · edges: 2→6
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "6 has exactly 0 outgoing direct edges."
    feedback if wrong: 6 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Processes 0, 3, 1, and 5.”"
    feedback if wrong: Zero is a fake parent marker for the root process, not a running process in `pid`. Correct node rule: One node for every process ID in pid.
- [YES is correct] (direct-vs-reach) "2 and 6 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2→6 as one direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
pid = [5,9], ppid = [0,5], kill = 9
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "5", "9" · edges: 5→9
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the process named by `kill` and its direct children.”"
    feedback if wrong: All processes form the tree before a kill is selected, including deeper descendants and unaffected branches. Correct node rule: One node for every process ID in pid.
- [YES is correct] (direct-vs-reach) "5 and 9 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 5→9 as one direct edge.
- [YES is correct] (local-degree) "5 has exactly 1 outgoing direct edge."
    feedback if wrong: 5 has 1 outgoing direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
pid = [1,2,3,4], ppid = [0,1,1,2], kill = 2
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "2", "3", "4" · edges: 1→2, 1→3, 2→4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Nodes 0, 1, and 2 because those are the array positions.”"
    feedback if wrong: Array positions pair the two arrays. The actual node labels are the process IDs stored in `pid`. Correct node rule: One node for every process ID in pid.
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→4, so it should also contain a direct 1→4 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "4 has exactly 1 outgoing direct edge."
    feedback if wrong: 4 has 0 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: Only direct children are killed
Input shown:
```
REAL PROBLEM INPUT
pid = [1,3,5,10], ppid = [0,1,3,5], kill = 3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function killProcess(pid, ppid, kill) {
  const children = new Map();
  for (let index = 0; index < pid.length; index++) {
    if (!children.has(ppid[index])) {
      children.set(ppid[index], []);
    }
    children.get(ppid[index]).push(pid[index]);
  }
  return [kill, ...(children.get(kill) || [])];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "process 1", "process 3", "process 5", "process 10" · edges: process 1→process 3, process 3→process 5, process 5→process 10
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all killed process IDs" · expected buggy output `[3,5]` · real correct output `[3,5,10]`
Diagnosis choices as displayed:
- A The parent-child arrows should point from child to parent.
- B It should also kill process 1 because 1 is an ancestor of 3 in this case.
- C It takes one child step instead of the full descendant subtree.
Diagnosis answer key + feedback:
- ✅ [direct-children-only] "It takes one child step instead of the full descendant subtree." — feedback: Correct. Process 10 descends from 3 through process 5 and must also stop.
- ❌ [wrong-direction] "The parent-child arrows should point from child to parent." — feedback: No. Parent→child is exactly the useful direction for finding everything killed below 3.
- ❌ [include-parent] "It should also kill process 1 because 1 is an ancestor of 3 in this case." — feedback: No. Killing a child does not kill its parent.
Graph proof shown in feedback: code rule "The result includes the start and only nodes one outgoing edge away." → changed graph "The process tree contains the descendant chain 3→5→10." → boundary "A descendant exists two edges below the killed process." → returned value "Process 10 is omitted, producing [3,5] instead of [3,5,10]."
Output-format probes: ✅ spaces after commas → `[3, 5]`; ❌ reversed element order → `[5,3]`; ❌ quoted numbers in array → `["3","5"]`; ❌ trailing period → `[3,5].`
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
About your diagnosis: No. Parent→child is exactly the useful direction for finding everything killed below 3.
Code rule: The result includes the start and only nodes one outgoing edge away. → Changed graph: The process tree contains the descendant chain 3→5→10. → Reachable boundary: A descendant exists two edges below the killed process.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only direct children are killed
INCORRECT OUTPUT
[3,5]
CORRECT OUTPUT
[3,5,10]
Code rule: The result includes the start and only nodes one outgoing edge away. → Changed graph: The process tree contains the descendant chain 3→5→10. → Reachable boundary: A descendant exists two edges below the killed process. → Returned value: Process 10 is omitted, producing [3,5] instead of [3,5,10].
```

### S4 case 2 — `remedial-1` · bug: Only direct children are killed
Input shown:
```
REAL PROBLEM INPUT
pid = [4,8,9], ppid = [0,4,8], kill = 4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function killProcess(pid, ppid, kill) {
  const children = new Map();
  for (let index = 0; index < pid.length; index++) {
    if (!children.has(ppid[index])) {
      children.set(ppid[index], []);
    }
    children.get(ppid[index]).push(pid[index]);
  }
  return [kill, ...(children.get(kill) || [])];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "4", "8", "9" · edges: 4→8, 8→9
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all killed process IDs" · expected buggy output `[4,8]` · real correct output `[4,8,9]`
Diagnosis choices as displayed:
- A It takes one child step instead of the full descendant subtree.
- B The parent-child arrows should point from child to parent.
- C Killing a process should also kill its parent.
Diagnosis answer key + feedback:
- ✅ [direct-children-only] "It takes one child step instead of the full descendant subtree." — feedback: Correct. Killing process 4 must follow edges 4→8→9; the one-step result includes 8 but misses grandchild 9. Therefore the shown code returns [4,8], while the real problem returns [4,8,9].
- ❌ [wrong-direction] "The parent-child arrows should point from child to parent." — feedback: Keep parent→child arrows: descendants are found by moving downward from the killed process.
- ❌ [include-parent] "Killing a process should also kill its parent." — feedback: Do not move upward. Killing a child process never kills its parent.
Graph proof shown in feedback: code rule "The result includes the start and only nodes one outgoing edge away." → changed graph "Nodes: 4, 8, 9. Direct arrows: 4→8; 8→9." → boundary "Killing process 4 must follow edges 4→8→9; the one-step result includes 8 but misses grandchild 9." → returned value "The shown code returns [4,8]; the source-repo reference solution returns [4,8,9]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only direct children are killed
INCORRECT OUTPUT
[4,8]
CORRECT OUTPUT
[4,8,9]
Code rule: The result includes the start and only nodes one outgoing edge away. → Changed graph: Nodes: 4, 8, 9. Direct arrows: 4→8; 8→9. → Reachable boundary: Killing process 4 must follow edges 4→8→9; the one-step result includes 8 but misses grandchild 9. → Returned value: The shown code returns [4,8]; the source-repo reference solution returns [4,8,9].
```

### S4 case 3 — `remedial-5` · bug: Only direct children are killed
Input shown:
```
REAL PROBLEM INPUT
pid = [1,2,3], ppid = [0,1,2], kill = 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function killProcess(pid, ppid, kill) {
  const children = new Map();
  for (let index = 0; index < pid.length; index++) {
    if (!children.has(ppid[index])) {
      children.set(ppid[index], []);
    }
    children.get(ppid[index]).push(pid[index]);
  }
  return [kill, ...(children.get(kill) || [])];
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all killed process IDs" · expected buggy output `[1,2]` · real correct output `[1,2,3]`
Diagnosis choices as displayed:
- A The parent-child arrows should point from child to parent.
- B It takes one child step instead of the full descendant subtree.
- C Killing a process should also kill its parent.
Diagnosis answer key + feedback:
- ✅ [direct-children-only] "It takes one child step instead of the full descendant subtree." — feedback: Correct. Killing process 1 must follow the full chain 1→2→3; the one-step result stops before descendant 3. Therefore the shown code returns [1,2], while the real problem returns [1,2,3].
- ❌ [wrong-direction] "The parent-child arrows should point from child to parent." — feedback: Keep parent→child arrows: descendants are found by moving downward from the killed process.
- ❌ [include-parent] "Killing a process should also kill its parent." — feedback: Do not move upward. Killing a child process never kills its parent.
Graph proof shown in feedback: code rule "The result includes the start and only nodes one outgoing edge away." → changed graph "Nodes: 1, 2, 3. Direct arrows: 1→2; 2→3." → boundary "Killing process 1 must follow the full chain 1→2→3; the one-step result stops before descendant 3." → returned value "The shown code returns [1,2]; the source-repo reference solution returns [1,2,3]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Only direct children are killed
INCORRECT OUTPUT
[1,2]
CORRECT OUTPUT
[1,2,3]
Code rule: The result includes the start and only nodes one outgoing edge away. → Changed graph: Nodes: 1, 2, 3. Direct arrows: 1→2; 2→3. → Reachable boundary: Killing process 1 must follow the full chain 1→2→3; the one-step result stops before descendant 3. → Returned value: The shown code returns [1,2]; the source-repo reference solution returns [1,2,3].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```