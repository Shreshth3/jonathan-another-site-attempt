# Time Needed to Inform All Employees (`time-needed-to-inform-all-employees`) — original, tree

## Problem statement (Description tab)

A company has `n` employees, labeled from `0` to `n - 1`. The head of the company is employee `headID`.

You are given an array `manager` where `manager[i]` is the direct manager of employee `i`. The head has no manager, so `manager[headID] == -1`. These manager relationships form a tree with the head at the root.

The head wants to share an urgent piece of news with everyone. Spreading works like this: when employee `i` learns the news, it takes them `informTime[i]` minutes to tell **all** of their direct reports, and all of those reports hear it **at the same moment**. Employees with no reports have `informTime[i] == 0`.

Return the total number of minutes until every employee in the company has heard the news.

### Examples
- Example 1: input `n = 1, headID = 0, manager = [-1], informTime = [0]` → output `0`. The head is the only employee, so everyone already knows the news.
- Example 2: input `n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]` → output `1`. Employee 2 manages everyone else and needs 1 minute to inform them all at once.
- Example 3: input `n = 7, headID = 6, manager = [1,2,3,4,5,6,-1], informTime = [0,6,5,4,3,2,1]` → output `21`. The employees form a single chain, so the news travels one link at a time: 1 + 2 + 3 + 4 + 5 + 6 = 21 minutes.

### Graph rules (authored)
- Nodes: Employees 0 through 4, including reports whose `informTime` is 0.
- Edges: 1→4, from manager 1 down to direct report 4.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-star`, facet "slowest information path")
Raw input shown:
```
n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 5
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The head informs direct reports in parallel, so all hear after one minute.
- ❌ [near-miss] "5"
    feedback: That result follows the sum times for parallel reports bug, not the exact picture. (misconception: sum-times-for-parallel-reports)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 2→0, 2→1, 2→3, 2→4, 2→5
"Why" shown after success: The head informs direct reports in parallel, so all hear after one minute.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact manager rows")
Raw input shown:
```
n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4 / 5
2. Picture A / 0 / 1 / 2 / 3 / 4 / 5
3. Picture C / 0 / 1 / 2 / 3 / 4 / 5
4. Picture D / 0 / 1 / 2 / 3 / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 2→0, 2→1, 2→3, 2→4, 2→5
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 2→0, 2→1, 2→3, 2→4
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0→2, 1→2, 3→2, 4→2, 5→2
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 2→0, 2→1, 2→3, 2→4
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`core-rule`, facet "employee identity")
Raw input shown:
```
For `n = 5`, which nodes belong in the employee org chart?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n = 5, which nodes belong in the employee org chart?**
Choices as displayed (top to bottom):
1. A / Only employees with a positive informTime because only they delay the news.
2. B / Only the head employee; everyone else is an elapsed-time label.
3. C / Employees 0 through 4, including reports whose informTime is 0.
4. D / One node for each manager together with all direct reports as a department.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-employees] "Employees 0 through 4, including reports whose `informTime` is 0."
    feedback: Correct. A zero inform time means no waiting to pass news onward, not that the employee disappears.
- ❌ [managers-only] "Only employees with a positive `informTime` because only they delay the news."
    feedback: Leaf employees still must hear the news and can determine the finishing time. (misconception: omit-leaf-employees)
- ❌ [head-only] "Only the head employee; everyone else is an elapsed-time label."
    feedback: The news travels through employee nodes along the org chart. (misconception: reports-as-weights)
- ❌ [departments] "One node for each manager together with all direct reports as a department."
    feedback: Each employee has an individual arrival time and position in the reporting tree. (misconception: department-as-node)
"Why" shown after success: Correct. A zero inform time means no waiting to pass news onward, not that the employee disappears.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-chain`, facet "slowest information path")
Raw input shown:
```
n = 4, headID = 0, manager = [-1,0,1,2], informTime = [1,2,3,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 6
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Correct. The only path accumulates 1+2+3 minutes.
- ❌ [near-miss] "3"
    feedback: That result follows the take largest single manager time bug, not the exact picture. (misconception: take-largest-single-manager-time)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→3
"Why" shown after success: The only path accumulates 1+2+3 minutes.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "manager-to-report edges")
Raw input shown:
```
If `manager[4] = 1`, which arrow should appear in the useful traversal graph?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If manager[4] = 1, which arrow should appear in the useful traversal graph?**
Choices as displayed (top to bottom):
1. A / 4→1 because the manager array points employee 4 at boss 1.
2. B / A two-way line 1—4 because they can communicate with each other.
3. C / 1→4, from manager 1 down to direct report 4.
4. D / Draw head→4 directly because every employee eventually hears from the head.
Answer key + feedback per choice (data):
- ✅ CORRECT [manager-to-report] "1→4, from manager 1 down to direct report 4."
    feedback: Correct. News flows from a manager to all direct reports.
- ❌ [report-to-manager] "4→1 because the manager array points employee 4 at boss 1."
    feedback: That is how the input is read, but traversal must flip it so news can flow downward. (misconception: keep-manager-array-direction)
- ❌ [two-way-org] "A two-way line 1—4 because they can communicate with each other."
    feedback: This process models the one-way broadcast from manager to report, not general communication. (misconception: make-org-edge-undirected)
- ❌ [head-shortcut] "Draw head→4 directly because every employee eventually hears from the head."
    feedback: Employee 4 hears through its direct manager. Skipping intermediate managers loses their delays. (misconception: skip-management-levels)
"Why" shown after success: Correct. News flows from a manager to all direct reports.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-branch`, facet "manager-to-report edges")
Raw input shown:
```
n = 5, headID = 0, manager = [-1,0,0,1,2], informTime = [1,4,2,0,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 7
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. The branches run in parallel; the slow branch takes 1+4=5.
- ❌ [near-miss] "7"
    feedback: That result follows the sum parallel branch times bug, not the exact picture. (misconception: sum-parallel-branch-times)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→4
"Why" shown after success: The branches run in parallel; the slow branch takes 1+4=5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "slowest information path")
Raw input shown:
```
n = 1, headID = 0, manager = [-1], informTime = [4]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If the head is the only employee, when has everyone heard?**
Choices as displayed (top to bottom):
1. A / 1 minute
2. B / 4 minutes
3. C / -1 minutes
4. D / 0 minutes
Answer key + feedback per choice (data):
- ✅ CORRECT [zero] "0 minutes"
    feedback: Correct. The only employee knows at time 0.
- ❌ [one] "1 minute"
    feedback: No message edge needs to be crossed. (misconception: minimum-one-minute)
- ❌ [inform-time] "4 minutes"
    feedback: No report is waiting, so that delay is irrelevant. (misconception: always-add-head-time)
- ❌ [minus-one] "-1 minutes"
    feedback: The head already knows; the case is reachable. (misconception: no-reports-means-failure)
"Why" shown after success: Correct. The only employee knows at time 0.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "slowest information path")
Raw input shown:
```
n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Head 2 needs 1 minute and directly manages all five other employees. Total time?**
Choices as displayed (top to bottom):
1. A / 5 minutes
2. B / 6 minutes
3. C / 0 minutes
4. D / 1 minute
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "1 minute"
    feedback: Correct. All direct reports hear at the same time.
- ❌ [five] "5 minutes"
    feedback: Reports are informed in parallel, not one by one. (misconception: sum-direct-reports)
- ❌ [six] "6 minutes"
    feedback: The answer is time, not employee count. (misconception: count-employees)
- ❌ [zero] "0 minutes"
    feedback: The reports must wait for the head's one-minute informing time. (misconception: ignore-head-delay)
"Why" shown after success: Correct. All direct reports hear at the same time.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-single`, facet "employee identity")
Raw input shown:
```
n = 1, headID = 0, manager = [-1], informTime = [0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0"
    feedback: Correct. No edge must carry information.
- ❌ [near-miss] "1"
    feedback: That result follows the count head as one minute bug, not the exact picture. (misconception: count-head-as-one-minute)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0" · edges: none
"Why" shown after success: No edge must carry information.
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
n = 3, headID = 1, manager = [1,-1,1], informTime = [0,2,0]
```
Remedial question: **What should the function return?** · choices shown: 4 | 2
Remedial answer key: ✅ "2" — Correct. Both reports receive the news after the head's two-minute delay.; ❌ "4" — That result follows the sum direct reports bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0, 1→2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [managers-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Employees 0 through 4, including reports whose informTime is 0.
Your choice: Leaf employees still must hear the news and can determine the finishing time.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
n = 2, headID = 0, manager = [-1,0], informTime = [0,0]
```
Remedial question: **What should the function return?** · choices shown: 0 | 1
Remedial answer key: ✅ "0" — Correct. Edges do not automatically cost one; the manager's informTime is zero.; ❌ "1" — That result follows the count edge as unit time bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 0→1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [report-to-manager]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1→4, from manager 1 down to direct report 4.
Your choice: That is how the input is read, but traversal must flip it so news can flow downward.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
n = 2, headID = 1, manager = [1,-1], informTime = [0,3]
```
Remedial question: **What should the function return?** · choices shown: 0 | 3
Remedial answer key: ✅ "3" — Correct. Information flows from manager 1 to employee 0.; ❌ "0" — That result follows the reverse reporting edge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0 minutes
Your choice: No message edge needs to be crossed.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
n = 4, headID = 0, manager = [-1,0,0,1], informTime = [2,5,0,0]
```
Remedial question: **What should the function return?** · choices shown: 7 | 5
Remedial answer key: ✅ "7" — Correct. The slow route 0→1→3 costs 2+5.; ❌ "5" — That result follows the omit head delay bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [five]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1 minute
Your choice: Reports are informed in parallel, not one by one.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n = 3, headID = 0, manager = [-1,0,0], informTime = [4,0,0]
```
Remedial question: **What should the function return?** · choices shown: 8 | 4
Remedial answer key: ✅ "4" — Correct. The head informs both reports during the same four-minute interval.; ❌ "8" — That result follows the add parallel deliveries bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Message arrows reversed"; authored goal, NOT shown to student: "Start at the company head so reversing every manager-to-report arrow blocks the team.")
Everything the student sees (text):
```
A
Aaron's broken search

Aaron reads every from/to relationship backward.

Your main goal: Expose Aaron's mistake. Draw two graphs: first the correct graph, then Aaron's graph using the mistake.

CHOOSE THE COMPANY HEAD
company head
OUTPUT
CORRECT OUTPUT
AARON’S OUTPUT
Drawing 1 of 2: Correct graph · Choose company head
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
2 · Aaron's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPANY HEAD / company head", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AARON’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4", "5"): REJECTED with "The chosen company head must be the graph root."
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 1
Grader's expected answers: correct output `[0,1]` · character's output `[1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 0→1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1`; ❌ curly braces → `{0,1}`; ❌ quoted numbers/strings → `["0","1"]`; ❌ reversed order → `[1,0]`; ✅ spaces inside brackets → `[ 0 , 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
AARON'S OUTPUT
[1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Last report forgotten"; authored goal, NOT shown to student: "Make the final reporting edge the only route to one employee.")
Everything the student sees (text):
```
K
Kylie's broken search

Kylie builds every listed connection except the last one.

Your main goal: Expose Kylie's mistake. Draw two graphs: first the correct graph, then Kylie's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE COMPANY HEAD
company head
OUTPUT
CORRECT OUTPUT
KYLIE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose company head
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
2 · Kylie's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPANY HEAD / company head", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | KYLIE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
KYLIE'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Second-level team uninformed"; authored goal, NOT shown to student: "Put an employee under a manager who is below the head.")
Everything the student sees (text):
```
B
Brayden's broken search

Brayden stops after one hop instead of continuing.

Your main goal: Expose Brayden's mistake. Draw two graphs: first the correct graph, then Brayden's graph using the mistake.

CHOOSE THE COMPANY HEAD
company head
OUTPUT
CORRECT OUTPUT
BRAYDEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose company head
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
2 · Brayden's graph
Check my graph
→
```
Start field: label "CHOOSE THE COMPANY HEAD / company head", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | BRAYDEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
BRAYDEN'S OUTPUT
[0,1]
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
n = 2, headID = 1, manager = [1,-1], informTime = [0,3]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "1 and 0 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→0 as one direct edge.
- [YES is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the head employee; everyone else is an elapsed-time label.”"
    feedback if wrong: The news travels through employee nodes along the org chart. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. The mini-example lists 1→0 as one direct edge.
×
0 has 0 outgoing direct edges.
×
The news travels through employee nodes along the org chart. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each manager together with all direct reports as a department.”"
    feedback if wrong: Each employee has an individual arrival time and position in the reporting tree. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
- [YES is correct] (direct-vs-reach) "1 and 0 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→0 as one direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Each employee has an individual arrival time and position in the reporting tree. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
×
Correct. The mini-example lists 1→0 as one direct edge.
×
1 has 1 outgoing direct edge.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only employees with a positive `informTime` because only they delay the news.”"
    feedback if wrong: Leaf employees still must hear the news and can determine the finishing time. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
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
n = 4, headID = 0, manager = [-1,0,0,1], informTime = [2,5,0,0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 0→2, 1→3
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→3, so it should also contain a direct 0→3 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each manager together with all direct reports as a department.”"
    feedback if wrong: Each employee has an individual arrival time and position in the reporting tree. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
Result: PASSED

### S3 Q3
Raw input shown:
```
n = 3, headID = 0, manager = [-1,0,0], informTime = [4,0,0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the head employee; everyone else is an elapsed-time label.”"
    feedback if wrong: The news travels through employee nodes along the org chart. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0→1 edge."
    feedback if wrong: The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
n = 3, headID = 1, manager = [1,-1,1], informTime = [0,2,0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 1→0, 1→2
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→2 as one direct edge.
- [YES is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only employees with a positive `informTime` because only they delay the news.”"
    feedback if wrong: Leaf employees still must hear the news and can determine the finishing time. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
Result: PASSED

### S3 Q5
Raw input shown:
```
n = 2, headID = 0, manager = [-1,0], informTime = [0,0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 0→1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each manager together with all direct reports as a department.”"
    feedback if wrong: Each employee has an individual arrival time and position in the reporting tree. Correct node rule: One node for every employee ID, including employees whose informTime is 0.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→1 as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Branch times are added together
Input shown:
```
REAL PROBLEM INPUT
n = 5, headID = 0, manager = [-1,0,0,1,2], informTime = [1,5,1,0,0]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numOfMinutes(n, headID, manager, informTime) {
  const numberOfNodes = n;
  let total = 0;
  for (let employee = 0; employee < numberOfNodes; employee++) {
    if (informTime[employee] > 0) {
      total += informTime[employee];
    }
  }

  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "head 0, delay 1", "manager 1, delay 5", "manager 2, delay 1", "employee 3", "employee 4" · edges: head 0, delay 1→manager 1, delay 5, head 0, delay 1→manager 2, delay 1, manager 1, delay 5→employee 3, manager 2, delay 1→employee 4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Minutes until every employee is informed" · expected buggy output `7` · real correct output `6`
Diagnosis choices as displayed:
- A It sums delays from separate branches instead of taking the slowest root-to-leaf path.
- B Employees with informTime 0 should each add one minute, changing this input's returned value.
- C Information should travel from employee to manager, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [sum-branches] "It sums delays from separate branches instead of taking the slowest root-to-leaf path." — feedback: Correct. After minute 1, manager 2's branch needs one more minute while manager 1's branch needs five; those branches run together.
- ❌ [include-leaves] "Employees with informTime 0 should each add one minute, changing this input's returned value." — feedback: No. A zero means that employee adds no delay.
- ❌ [edge-direction] "Information should travel from employee to manager, changing this input's returned value." — feedback: No. It travels from each manager to direct reports.
Graph proof shown in feedback: code rule "All positive node delays are summed as if the branches ran one after another." → changed graph "The management tree branches at head 0 into paths 0→1→3 and 0→2→4." → boundary "The head has two branches that receive information concurrently." → returned value "The code adds 1+5+1=7, while the slowest path takes only 1+5=6 minutes."
Output-format probes: ❌ quoted number → `"7"`; ❌ trailing period → `7.`
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
About your diagnosis: No. A zero means that employee adds no delay.
Code rule: All positive node delays are summed as if the branches ran one after another. → Changed graph: The management tree branches at head 0 into paths 0→1→3 and 0→2→4. → Reachable boundary: The head has two branches that receive information concurrently.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Branch times are added together
INCORRECT OUTPUT
7
CORRECT OUTPUT
6
Code rule: All positive node delays are summed as if the branches ran one after another. → Changed graph: The management tree branches at head 0 into paths 0→1→3 and 0→2→4. → Reachable boundary: The head has two branches that receive information concurrently. → Returned value: The code adds 1+5+1=7, while the slowest path takes only 1+5=6 minutes.
```

### S4 case 2 — `build-branch` · bug: Branch times are added together
Input shown:
```
REAL PROBLEM INPUT
n = 5, headID = 0, manager = [-1,0,0,1,2], informTime = [1,4,2,0,0]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numOfMinutes(n, headID, manager, informTime) {
  const numberOfNodes = n;
  let total = 0;
  for (let employee = 0; employee < numberOfNodes; employee++) {
    if (informTime[employee] > 0) {
      total += informTime[employee];
    }
  }

  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1, 0→2, 1→3, 2→4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Minutes until every employee is informed" · expected buggy output `7` · real correct output `5`
Diagnosis choices as displayed:
- A Employees with informTime 0 should each add one minute, changing this input's returned value.
- B It sums delays from separate branches instead of taking the slowest root-to-leaf path.
- C Information should travel from employee to manager, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [sum-branches] "It sums delays from separate branches instead of taking the slowest root-to-leaf path." — feedback: Correct. After head 0 waits 1 minute, branches 0→1→3 and 0→2→4 proceed together; the slower branch takes 4 more minutes, not 4+2. Therefore the shown code returns 7, while the real problem returns 5.
- ❌ [include-leaves] "Employees with informTime 0 should each add one minute, changing this input's returned value." — feedback: No. A zero means that employee adds no delay.
- ❌ [edge-direction] "Information should travel from employee to manager, changing this input's returned value." — feedback: No. It travels from each manager to direct reports.
Graph proof shown in feedback: code rule "All positive node delays are summed as if the branches ran one after another." → changed graph "Nodes: 0, 1, 2, 3, 4. Direct arrows: 0→1; 0→2; 1→3; 2→4." → boundary "After head 0 waits 1 minute, branches 0→1→3 and 0→2→4 proceed together; the slower branch takes 4 more minutes, not 4+2." → returned value "The shown code returns 7; the source-repo reference solution returns 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Branch times are added together
INCORRECT OUTPUT
7
CORRECT OUTPUT
5
Code rule: All positive node delays are summed as if the branches ran one after another. → Changed graph: Nodes: 0, 1, 2, 3, 4. Direct arrows: 0→1; 0→2; 1→3; 2→4. → Reachable boundary: After head 0 waits 1 minute, branches 0→1→3 and 0→2→4 proceed together; the slower branch takes 4 more minutes, not 4+2. → Returned value: The shown code returns 7; the source-repo reference solution returns 5.
```

### S4 case 3 — `parallel-branches-with-three-managers` · bug: Branch times are added together
Input shown:
```
REAL PROBLEM INPUT
n = 6, headID = 0, manager = [-1,0,0,1,1,2], informTime = [2,3,4,0,0,0]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function numOfMinutes(n, headID, manager, informTime) {
  const numberOfNodes = n;
  let total = 0;
  for (let employee = 0; employee < numberOfNodes; employee++) {
    if (informTime[employee] > 0) {
      total += informTime[employee];
    }
  }

  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "head 0, delay 2", "manager 1, delay 3", "manager 2, delay 4", "employee 3", "employee 4", "employee 5" · edges: head 0, delay 2→manager 1, delay 3, head 0, delay 2→manager 2, delay 4, manager 1, delay 3→employee 3, manager 1, delay 3→employee 4, manager 2, delay 4→employee 5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Minutes until every employee is informed" · expected buggy output `9` · real correct output `6`
Diagnosis choices as displayed:
- A Employees with informTime 0 should each add one minute, changing this input's returned value.
- B Information should travel from employee to manager, changing this input's returned value.
- C It sums delays from separate branches instead of taking the slowest root-to-leaf path.
Diagnosis answer key + feedback:
- ✅ [sum-branches] "It sums delays from separate branches instead of taking the slowest root-to-leaf path." — feedback: Correct. After the head's two minutes, managers 1 and 2 work in parallel; only the slower four-minute branch controls the finish time. Therefore the shown code returns 9, while the real problem returns 6.
- ❌ [include-leaves] "Employees with informTime 0 should each add one minute, changing this input's returned value." — feedback: No. A zero means that employee adds no delay.
- ❌ [edge-direction] "Information should travel from employee to manager, changing this input's returned value." — feedback: No. It travels from each manager to direct reports.
Graph proof shown in feedback: code rule "All positive node delays are summed as if the branches ran one after another." → changed graph "Nodes: head 0, delay 2, manager 1, delay 3, manager 2, delay 4, employee 3, employee 4, employee 5. Direct arrows: head 0, delay 2→manager 1, delay 3; head 0, delay 2→manager 2, delay 4; manager 1, delay 3→employee 3; manager 1, delay 3→employee 4; manager 2, delay 4→employee 5." → boundary "After the head's two minutes, managers 1 and 2 work in parallel; only the slower four-minute branch controls the finish time." → returned value "The shown code returns 9; the source-repo reference solution returns 6."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Branch times are added together
INCORRECT OUTPUT
9
CORRECT OUTPUT
6
Code rule: All positive node delays are summed as if the branches ran one after another. → Changed graph: Nodes: head 0, delay 2, manager 1, delay 3, manager 2, delay 4, employee 3, employee 4, employee 5. Direct arrows: head 0, delay 2→manager 1, delay 3; head 0, delay 2→manager 2, delay 4; manager 1, delay 3→employee 3; manager 1, delay 3→employee 4; manager 2, delay 4→employee 5. → Reachable boundary: After the head's two minutes, managers 1 and 2 work in parallel; only the slower four-minute branch controls the finish time. → Returned value: The shown code returns 9; the source-repo reference solution returns 6.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```