# Employee Importance (`employee-importance`) — new, directed-graph

## Problem statement (Description tab)

A company stores its staff as an array `employees`. Each employee is an object with three fields:

- `id`: the employee's unique id number
- `importance`: that employee's importance score (it can be negative)
- `subordinates`: an array of the ids of the people who report DIRECTLY to this employee

You are also given a number `id`.

Return the total importance of that employee PLUS everyone under them — their direct reports, their reports' reports, and so on all the way down.

### Examples
- Example 1: input `employees = [{id: 1, importance: 5, subordinates: [2, 3]}, {id: 2, importance: 3, subordinates: []}, {id: 3, importance: 3, subordinates: []}], id = 1` → output `11`. Employee 1 has importance 5 and two direct reports, employees 2 and 3, each with importance 3. Total: 5 + 3 + 3 = 11.
- Example 2: input `employees = [{id: 5, importance: -3, subordinates: [6]}, {id: 6, importance: 2, subordinates: []}], id = 5` → output `-1`. Employee 5 has importance -3 and one report (employee 6, importance 2). Total: -3 + 2 = -1.

### Graph rules (authored)
- Nodes: One employee record, identified by its id.
- Edges: The worker's id appears in the manager's subordinates list.
- Node-name format shown in Step 1/3: Name each employee `id:importance`. Example: `4:7`. Do not add spaces. (pattern `^\d+:-?\d+$`)
- Step 2 node-label rule: `positive-integer` — Use positive integer IDs, matching the problem input.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact employees")
Raw input shown:
```
employees=[{"id":0,"importance":1,"subordinates":[1,2]},{"id":1,"importance":2,"subordinates":[3]},{"id":2,"importance":3,"subordinates":[4]},{"id":3,"importance":4,"subordinates":[]},{"id":4,"importance":5,"subordinates":[]}], id=0
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What total importance is returned?**
Choices as displayed (top to bottom):
1. 15
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "15"
    feedback: Correct. Employee 0 and every reachable report contribute once, totaling 15.
- ❌ [bug] "6"
    feedback: This adds employee 0 and direct reports but stops before deeper reports. (misconception: direct-reports-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:1", "1:2", "2:3", "3:4", "4:5" · edges: 0:1→1:2, 0:1→2:3, 1:2→3:4, 2:3→4:5
"Why" shown after success: Employee 0 and every reachable report contribute once, totaling 15.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`case-2`, facet "employee identity")
Raw input shown:
```
employees=[{"id":0,"importance":2,"subordinates":[1]},{"id":1,"importance":4,"subordinates":[2]},{"id":2,"importance":6,"subordinates":[3]},{"id":3,"importance":8,"subordinates":[]}], id=0
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What total importance is returned?**
Choices as displayed (top to bottom):
1. 6
2. 20
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "20"
    feedback: Correct. Employee 0 and every reachable report contribute once, totaling 20.
- ❌ [bug] "6"
    feedback: This adds employee 0 and direct reports but stops before deeper reports. (misconception: direct-reports-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8" · edges: 0:2→1:4, 1:4→2:6, 2:6→3:8
"Why" shown after success: Employee 0 and every reachable report contribute once, totaling 20.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact employees")
Raw input shown:
```
employees=[{"id":0,"importance":1,"subordinates":[1,2]},{"id":1,"importance":2,"subordinates":[3]},{"id":2,"importance":3,"subordinates":[4]},{"id":3,"importance":4,"subordinates":[]},{"id":4,"importance":5,"subordinates":[]}], id=0
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0:1 / 1:2 / 2:3 / 3:4 / 4:5
2. Picture C / 0:1 / 1:2 / 2:3 / 3:4 / 4:5
3. Picture A / 0:1 / 1:2 / 2:3 / 3:4 / 4:5
4. Picture D / 0:1 / 1:2 / 2:3 / 3:4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0:1, 1:2, 2:3, 3:4, 4:5 · edges: 0:1→1:2, 0:1→2:3, 1:2→3:4, 2:3→4:5
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0:1, 1:2, 2:3, 3:4, 4:5 · edges: 0:1→1:2, 0:1→2:3, 1:2→3:4
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0:1, 1:2, 2:3, 3:4, 4:5 · edges: 1:2→0:1, 0:1→2:3, 1:2→3:4, 2:3→4:5
    feedback: This reverses one listed arrow. (misconception: reverse-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0:1, 1:2, 2:3, 3:4 · edges: 0:1→1:2, 0:1→2:3, 1:2→3:4
    feedback: This drops an entity that still appears in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`node-rule`, facet "employee identity")
Raw input shown:
```
What does one node in the company graph represent?
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does one node in the company graph represent?**
Choices as displayed (top to bottom):
1. A / One importance point.
2. B / One employee record, identified by its id.
3. C / One manager together with their entire team.
4. D / One subordinates array.
Answer key + feedback per choice (data):
- ✅ CORRECT [employee] "One employee record, identified by its id."
    feedback: Right. Importance is a value stored on that employee node.
- ❌ [score] "One importance point."
    feedback: Importance is data on a person, not a separate graph item. (misconception: uses-score-as-node)
- ❌ [team] "One manager together with their entire team."
    feedback: Reports must remain separate nodes so DFS can follow each level. (misconception: collapses-subtree)
- ❌ [report-list] "One subordinates array."
    feedback: The array describes outgoing relationships from an employee. (misconception: uses-adjacency-list-as-node)
"Why" shown after success: Right. Importance is a value stored on that employee node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`case-3`, facet "manager-to-report arrows")
Raw input shown:
```
employees=[{"id":0,"importance":3,"subordinates":[1]},{"id":1,"importance":6,"subordinates":[2,3]},{"id":2,"importance":9,"subordinates":[]},{"id":3,"importance":12,"subordinates":[4]},{"id":4,"importance":15,"subordinates":[]}], id=0
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What total importance is returned?**
Choices as displayed (top to bottom):
1. 45
2. 9
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "45"
    feedback: Correct. Employee 0 and every reachable report contribute once, totaling 45.
- ❌ [bug] "9"
    feedback: This adds employee 0 and direct reports but stops before deeper reports. (misconception: direct-reports-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:3", "1:6", "2:9", "3:12", "4:15" · edges: 0:3→1:6, 1:6→2:9, 1:6→3:12, 3:12→4:15
"Why" shown after success: Employee 0 and every reachable report contribute once, totaling 45.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`edge-rule`, facet "manager-to-report arrows")
Raw input shown:
```
What does a directed edge manager → worker mean?
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does a directed edge manager → worker mean?**
Choices as displayed (top to bottom):
1. A / The manager's id appears in the worker's subordinates list.
2. B / The worker's id appears in the manager's subordinates list.
3. C / The worker is anywhere below the manager, even several levels down.
4. D / The manager has a larger importance score than the worker.
Answer key + feedback per choice (data):
- ✅ CORRECT [direct-report] "The worker's id appears in the manager's subordinates list."
    feedback: Right. The arrow follows authority from manager to direct report.
- ❌ [reverse] "The manager's id appears in the worker's subordinates list."
    feedback: That would reverse the reporting direction. (misconception: reverses-management-edge)
- ❌ [all-below] "The worker is anywhere below the manager, even several levels down."
    feedback: Several reporting steps form a path, not one direct edge. (misconception: turns-path-into-edge)
- ❌ [score-order] "The manager has a larger importance score than the worker."
    feedback: Scores do not decide reporting relationships. (misconception: derives-edge-from-score)
"Why" shown after success: Right. The arrow follows authority from manager to direct report.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`predict-output`, facet "importance subtotal")
Raw input shown:
```
employees = [{id: 1, importance: 5, subordinates: [2, 3]}, {id: 2, importance: 3, subordinates: []}, {id: 3, importance: 3, subordinates: []}], id = 1
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Employee 1 has importance 5 and direct reports 2 and 3, each worth 3. What total is returned for id 1?**
Choices as displayed (top to bottom):
1. A / 5
2. B / 11
3. C / 6
4. D / 8
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "11"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "5"
    feedback: Direct and indirect reports must be included. (misconception: counts-manager-only)
- ❌ [wrong-2] "6"
    feedback: This adds only the reports and omits the manager. (misconception: omits-start-employee)
- ❌ [wrong-3] "8"
    feedback: Both report branches must be counted. (misconception: follows-one-report)
"Why" shown after success: Right. The picture gives exactly this result.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`case-4`, facet "importance subtotal")
Raw input shown:
```
employees=[{"id":0,"importance":1,"subordinates":[]}], id=0
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What total importance is returned?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Employee 0 and every reachable report contribute once, totaling 1.
- ❌ [bug] "0"
    feedback: This excludes the requested employee's own importance. (misconception: exclude-requested-employee)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:1" · edges: none
"Why" shown after success: Employee 0 and every reachable report contribute once, totaling 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`bug-trap`, facet "importance subtotal")
Raw input shown:
```
employees = [{id: 5, importance: -3, subordinates: [6]}, {id: 6, importance: 2, subordinates: []}], id = 5
```
Node-name guide shown: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Employee 5 has importance -3 and report 6 has importance 2. What total is returned for id 5?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 5
3. C / -3
4. D / -1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-1"
    feedback: Right. The picture gives exactly this result.
- ❌ [wrong-1] "2"
    feedback: The starting employee's negative score still counts. (misconception: drops-negative-manager)
- ❌ [wrong-2] "5"
    feedback: Importance values are added with their signs, not absolute values. (misconception: uses-absolute-values)
- ❌ [wrong-3] "-3"
    feedback: The reachable report's score must be included. (misconception: counts-manager-only)
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
employees=[{"id":0,"importance":2,"subordinates":[1,2]},{"id":1,"importance":4,"subordinates":[]},{"id":2,"importance":6,"subordinates":[3,4]},{"id":3,"importance":8,"subordinates":[]},{"id":4,"importance":10,"subordinates":[]}], id=0
```
Remedial question: **What total importance is returned?** · choices shown: 30 | 12
Remedial answer key: ✅ "30" — Correct. Employee 0 and every reachable report contribute once, totaling 30.; ❌ "12" — This adds employee 0 and direct reports but stops before deeper reports.
Remedial required graph (hidden): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8", "4:10" · edges: 0:2→1:4, 0:2→2:6, 2:6→3:8, 2:6→4:10
Remedial result: PASSED

#### After answering concept `node-rule` wrong with choice [score]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One employee record, identified by its id.
Your choice: Importance is data on a person, not a separate graph item.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
employees=[{"id":0,"importance":3,"subordinates":[1,3]},{"id":1,"importance":6,"subordinates":[2]},{"id":2,"importance":1,"subordinates":[]},{"id":3,"importance":12,"subordinates":[]}], id=0
```
Remedial question: **What total importance is returned?** · choices shown: 21 | 22
Remedial answer key: ✅ "22" — Correct. Employee 0 and every reachable report contribute once, totaling 22.; ❌ "21" — This adds employee 0 and direct reports but stops before deeper reports.
Remedial required graph (hidden): DIRECTED · nodes: "0:3", "1:6", "2:1", "3:12" · edges: 0:3→1:6, 1:6→2:1, 0:3→3:12
Remedial result: PASSED

#### After answering concept `edge-rule` wrong with choice [reverse]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The worker's id appears in the manager's subordinates list.
Your choice: That would reverse the reporting direction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the edge rule"
Remedial raw input:
```
employees=[{"id":0,"importance":1,"subordinates":[1]},{"id":1,"importance":2,"subordinates":[2]},{"id":2,"importance":3,"subordinates":[3]},{"id":3,"importance":4,"subordinates":[4]},{"id":4,"importance":5,"subordinates":[]}], id=0
```
Remedial question: **What total importance is returned?** · choices shown: 15 | 3
Remedial answer key: ✅ "15" — Correct. Employee 0 and every reachable report contribute once, totaling 15.; ❌ "3" — This adds employee 0 and direct reports but stops before deeper reports.
Remedial required graph (hidden): DIRECTED · nodes: "0:1", "1:2", "2:3", "3:4", "4:5" · edges: 0:1→1:2, 1:2→2:3, 2:3→3:4, 3:4→4:5
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
11
Your choice: Direct and indirect reports must be included.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh picture"
Remedial raw input:
```
employees=[{"id":0,"importance":2,"subordinates":[2,1]},{"id":1,"importance":4,"subordinates":[]},{"id":2,"importance":6,"subordinates":[3]},{"id":3,"importance":8,"subordinates":[]}], id=0
```
Remedial question: **What total importance is returned?** · choices shown: 12 | 20
Remedial answer key: ✅ "20" — Correct. Employee 0 and every reachable report contribute once, totaling 20.; ❌ "12" — This adds employee 0 and direct reports but stops before deeper reports.
Remedial required graph (hidden): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8" · edges: 0:2→2:6, 2:6→3:8, 0:2→1:4
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [wrong-1]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
-1
Your choice: The starting employee's negative score still counts.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
employees=[{"id":0,"importance":3,"subordinates":[1,3]},{"id":1,"importance":6,"subordinates":[2]},{"id":2,"importance":9,"subordinates":[4]},{"id":3,"importance":12,"subordinates":[]},{"id":4,"importance":15,"subordinates":[]}], id=0
```
Remedial question: **What total importance is returned?** · choices shown: 45 | 21
Remedial answer key: ✅ "45" — Correct. Employee 0 and every reachable report contribute once, totaling 45.; ❌ "21" — This adds employee 0 and direct reports but stops before deeper reports.
Remedial required graph (hidden): DIRECTED · nodes: "0:3", "1:6", "2:9", "3:12", "4:15" · edges: 0:3→1:6, 1:6→2:9, 2:9→4:15, 0:3→3:12
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Org-chart reversal"; authored goal, NOT shown to student: "Make reversed reporting arrows reach the wrong team.")
Everything the student sees (text):
```
S
Spencer's broken search

Spencer reads every from/to relationship backward.

Your main goal: Expose Spencer's mistake. Draw two graphs: first the correct graph, then Spencer's graph using the mistake.

CHOOSE THE REQUESTED EMPLOYEE
requested employee
OUTPUT
CORRECT OUTPUT
SPENCER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose requested employee
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
2 · Spencer's graph
Check my graph
→
```
Start field: label "CHOOSE THE REQUESTED EMPLOYEE / requested employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SPENCER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0:1", "1:2", "2:3", "3:4", "4:5"): REJECTED with "Use positive integer IDs, like 1, 3, or 10."
Minimal starter graph evaluation: {"exposes":true,"correct":"[1]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[1]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 1→2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1`; ❌ curly braces → `{1}`; ❌ quoted numbers/strings → `["1"]`; ✅ spaces inside brackets → `[ 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1]
SPENCER'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Indirect report"; authored goal, NOT shown to student: "Put an employee two levels below the requested manager.")
Everything the student sees (text):
```
A
Aliyah's broken search

Aliyah stops after one hop instead of continuing.

Your main goal: Expose Aliyah's mistake. Draw two graphs: first the correct graph, then Aliyah's graph using the mistake.

CHOOSE THE REQUESTED EMPLOYEE
requested employee
OUTPUT
CORRECT OUTPUT
ALIYAH’S OUTPUT
Drawing 1 of 2: Correct graph · Choose requested employee
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
2 · Aliyah's graph
Check my graph
→
```
Start field: label "CHOOSE THE REQUESTED EMPLOYEE / requested employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ALIYAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 1→2, 2→3 · start 1
Grader's expected answers: correct output `[1,2,3]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 1→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3]
ALIYAH'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Requested-id check"; authored goal, NOT shown to student: "List someone else first so only the requested id is valid.")
Everything the student sees (text):
```
S
Stephen's broken search

Stephen ignores the chosen requested employee and uses a different one.

Your main goal: Expose Stephen's mistake. Draw two graphs: first the correct graph, then Stephen's graph using the mistake.

CHOOSE THE REQUESTED EMPLOYEE
requested employee
OUTPUT
CORRECT OUTPUT
STEPHEN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose requested employee
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
2 · Stephen's graph
Check my graph
→
```
Start field: label "CHOOSE THE REQUESTED EMPLOYEE / requested employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | STEPHEN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
STEPHEN'S OUTPUT
[1,2,3]
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
employees=[{"id":0,"importance":2,"subordinates":[1,2]},{"id":1,"importance":4,"subordinates":[]},{"id":2,"importance":6,"subordinates":[3,4]},{"id":3,"importance":8,"subordinates":[]},{"id":4,"importance":10,"subordinates":[]}], id=0
```
Node-name guide: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8", "4:10" · edges: 0:2→1:4, 0:2→2:6, 2:6→3:8, 2:6→4:10
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "0:2 can reach 4:10 through 2:6, but the graph still has no direct 0:2→4:10 edge."
    feedback if wrong: Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0:2 has exactly 2 outgoing direct edges."
    feedback if wrong: 0:2 has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One manager together with their entire team.”"
    feedback if wrong: Reports must remain separate nodes so DFS can follow each level. Correct node rule: One employee record, identified by its id.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
×
0:2 has 2 outgoing direct edges.
×
Reports must remain separate nodes so DFS can follow each level. Correct node rule: One employee record, identified by its id.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "4:10 has exactly 0 outgoing direct edges."
    feedback if wrong: 4:10 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One subordinates array.”"
    feedback if wrong: The array describes outgoing relationships from an employee. Correct node rule: One employee record, identified by its id.
- [YES is correct] (direct-vs-reach) "0:2 can reach 3:8 through 2:6, but the graph still has no direct 0:2→3:8 edge."
    feedback if wrong: Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
4:10 has 0 outgoing direct edges.
×
The array describes outgoing relationships from an employee. Correct node rule: One employee record, identified by its id.
×
Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3:8 has exactly 0 outgoing direct edges."
    feedback if wrong: 3:8 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One importance point.”"
    feedback if wrong: Importance is data on a person, not a separate graph item. Correct node rule: One employee record, identified by its id.
- [YES is correct] (direct-vs-reach) "0:2 can reach 4:10 through 2:6, but the graph still has no direct 0:2→4:10 edge."
    feedback if wrong: Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
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
employees=[{"id":0,"importance":3,"subordinates":[1,3]},{"id":1,"importance":6,"subordinates":[2]},{"id":2,"importance":1,"subordinates":[]},{"id":3,"importance":12,"subordinates":[]}], id=0
```
Node-name guide: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:3", "1:6", "2:1", "3:12" · edges: 0:3→1:6, 1:6→2:1, 0:3→3:12
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2:1 has exactly 1 outgoing direct edge."
    feedback if wrong: 2:1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One subordinates array.”"
    feedback if wrong: The array describes outgoing relationships from an employee. Correct node rule: One employee record, identified by its id.
- [NO is correct] (direct-vs-reach) "The correct graph has 0:3→1:6 and 1:6→2:1, so it should also contain a direct 0:3→2:1 edge."
    feedback if wrong: Two direct edges through 1:6 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
employees=[{"id":0,"importance":1,"subordinates":[1]},{"id":1,"importance":2,"subordinates":[2]},{"id":2,"importance":3,"subordinates":[3]},{"id":3,"importance":4,"subordinates":[4]},{"id":4,"importance":5,"subordinates":[]}], id=0
```
Node-name guide: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:1", "1:2", "2:3", "3:4", "4:5" · edges: 0:1→1:2, 1:2→2:3, 2:3→3:4, 3:4→4:5
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 1:2→2:3 and 2:3→3:4, so it should also contain a direct 1:2→3:4 edge."
    feedback if wrong: Two direct edges through 2:3 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2:3 has exactly 0 outgoing direct edges."
    feedback if wrong: 2:3 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One manager together with their entire team.”"
    feedback if wrong: Reports must remain separate nodes so DFS can follow each level. Correct node rule: One employee record, identified by its id.
Result: PASSED

### S3 Q4
Raw input shown:
```
employees=[{"id":0,"importance":2,"subordinates":[2,1]},{"id":1,"importance":4,"subordinates":[]},{"id":2,"importance":6,"subordinates":[3]},{"id":3,"importance":8,"subordinates":[]}], id=0
```
Node-name guide: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8" · edges: 0:2→2:6, 2:6→3:8, 0:2→1:4
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One importance point.”"
    feedback if wrong: Importance is data on a person, not a separate graph item. Correct node rule: One employee record, identified by its id.
- [YES is correct] (direct-vs-reach) "0:2 can reach 3:8 through 2:6, but the graph still has no direct 0:2→3:8 edge."
    feedback if wrong: Right. A multi-step route through 2:6 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0:2 has exactly 2 outgoing direct edges."
    feedback if wrong: 0:2 has 2 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
employees=[{"id":0,"importance":3,"subordinates":[1,3]},{"id":1,"importance":6,"subordinates":[2]},{"id":2,"importance":9,"subordinates":[4]},{"id":3,"importance":12,"subordinates":[]},{"id":4,"importance":15,"subordinates":[]}], id=0
```
Node-name guide: Required node-name format: Name each employee id:importance. Example: 4:7. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:3", "1:6", "2:9", "3:12", "4:15" · edges: 0:3→1:6, 1:6→2:9, 2:9→4:15, 0:3→3:12
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1:6 has exactly 0 outgoing direct edges."
    feedback if wrong: 1:6 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One subordinates array.”"
    feedback if wrong: The array describes outgoing relationships from an employee. Correct node rule: One employee record, identified by its id.
- [NO is correct] (direct-vs-reach) "The correct graph has 1:6→2:9 and 2:9→4:15, so it should also contain a direct 1:6→4:15 edge."
    feedback if wrong: Two direct edges through 2:9 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Importance stops after direct reports
Input shown:
```
REAL PROBLEM INPUT
employees: [{ id: 1, importance: 5, subordinates: [2] }, { id: 2, importance: 3, subordinates: [3] }, { id: 3, importance: 4, subordinates: [] }]
id: 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function getImportance(employees, id) {
  const byId = new Map(employees.map((e) => [e.id, e]));
  const boss = byId.get(id);
  let total = boss.importance;
  for (const childId of boss.subordinates) {
    total += byId.get(childId).importance;
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "1", "2", "3" · edges: 1→2, 2→3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `8` · real correct output `12`
Diagnosis choices as displayed:
- A The loop adds direct reports but never continues to indirect reports, changing this input's returned value.
- B The boss's importance is added before the subordinate loop and should be added afterward in this case.
- C The code assumes employee ids are array indexes, which changes the returned value here.
Diagnosis answer key + feedback:
- ❌ [double-boss] "The boss's importance is added before the subordinate loop and should be added afterward in this case." — feedback: Addition order does not change the total; employee 3 is omitted.
- ✅ [one-level] "The loop adds direct reports but never continues to indirect reports, changing this input's returned value." — feedback: Exactly. The descendant chain must be traversed recursively or with a stack.
- ❌ [id-index] "The code assumes employee ids are array indexes, which changes the returned value here." — feedback: The Map correctly handles arbitrary ids; traversal depth is the bug.
Graph proof shown in feedback: code rule "Only the start node and its immediate outgoing neighbors contribute." → changed graph "The reporting graph is the directed chain 1→2→3 with weights 5, 3, and 4." → boundary "Employee 3 is two directed edges below employee 1." → returned value "The helper returns 5+3=8 instead of the full descendant total 12."
Output-format probes: ❌ quoted number → `"8"`; ❌ trailing period → `8.`
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
About your diagnosis: Addition order does not change the total; employee 3 is omitted.
Code rule: Only the start node and its immediate outgoing neighbors contribute. → Changed graph: The reporting graph is the directed chain 1→2→3 with weights 5, 3, and 4. → Reachable boundary: Employee 3 is two directed edges below employee 1.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Importance stops after direct reports
INCORRECT OUTPUT
8
CORRECT OUTPUT
12
Code rule: Only the start node and its immediate outgoing neighbors contribute. → Changed graph: The reporting graph is the directed chain 1→2→3 with weights 5, 3, and 4. → Reachable boundary: Employee 3 is two directed edges below employee 1. → Returned value: The helper returns 5+3=8 instead of the full descendant total 12.
```

### S4 case 2 — `case-1` · bug: Importance stops after direct reports
Input shown:
```
REAL PROBLEM INPUT
employees=[{"id":0,"importance":1,"subordinates":[1,2]},{"id":1,"importance":2,"subordinates":[3]},{"id":2,"importance":3,"subordinates":[4]},{"id":3,"importance":4,"subordinates":[]},{"id":4,"importance":5,"subordinates":[]}], id=0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function getImportance(employees, id) {
  const byId = new Map(employees.map((e) => [e.id, e]));
  const boss = byId.get(id);
  let total = boss.importance;
  for (const childId of boss.subordinates) {
    total += byId.get(childId).importance;
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:1", "1:2", "2:3", "3:4", "4:5" · edges: 0:1→1:2, 0:1→2:3, 1:2→3:4, 2:3→4:5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `6` · real correct output `15`
Diagnosis choices as displayed:
- A The boss's importance is added before the subordinate loop and should be added afterward in this case.
- B The loop adds direct reports but never continues to indirect reports, changing this input's returned value.
- C The code assumes employee ids are array indexes, which changes the returned value here.
Diagnosis answer key + feedback:
- ❌ [double-boss] "The boss's importance is added before the subordinate loop and should be added afterward in this case." — feedback: Addition order does not change the total; indirect reports are omitted.
- ✅ [one-level] "The loop adds direct reports but never continues to indirect reports, changing this input's returned value." — feedback: Correct. The one-level sum reaches employees 0, 1, and 2 but omits indirect reports 3 and 4, losing nine importance points.
- ❌ [id-index] "The code assumes employee ids are array indexes, which changes the returned value here." — feedback: The Map correctly handles arbitrary ids; traversal depth is the bug.
Graph proof shown in feedback: code rule "Only the start node and its immediate outgoing neighbors contribute." → changed graph "Employee 0 points to 1 and 2; employee 1 points to 3 and employee 2 points to 4." → boundary "Employees 3 and 4 are two edges below employee 0 and carry nine of the component's fifteen importance points." → returned value "The shown code returns 6; the real problem returns 15."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Importance stops after direct reports
INCORRECT OUTPUT
6
CORRECT OUTPUT
15
Code rule: Only the start node and its immediate outgoing neighbors contribute. → Changed graph: Employee 0 points to 1 and 2; employee 1 points to 3 and employee 2 points to 4. → Reachable boundary: Employees 3 and 4 are two edges below employee 0 and carry nine of the component's fifteen importance points. → Returned value: The shown code returns 6; the real problem returns 15.
```

### S4 case 3 — `case-2` · bug: Importance stops after direct reports
Input shown:
```
REAL PROBLEM INPUT
employees=[{"id":0,"importance":2,"subordinates":[1]},{"id":1,"importance":4,"subordinates":[2]},{"id":2,"importance":6,"subordinates":[3]},{"id":3,"importance":8,"subordinates":[]}], id=0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function getImportance(employees, id) {
  const byId = new Map(employees.map((e) => [e.id, e]));
  const boss = byId.get(id);
  let total = boss.importance;
  for (const childId of boss.subordinates) {
    total += byId.get(childId).importance;
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:2", "1:4", "2:6", "3:8" · edges: 0:2→1:4, 1:4→2:6, 2:6→3:8
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "JSON number" · expected buggy output `6` · real correct output `20`
Diagnosis choices as displayed:
- A The boss's importance is added before the subordinate loop and should be added afterward in this case.
- B The code assumes employee ids are array indexes, which changes the returned value here.
- C The loop follows edge 1→2 but never continues along 2→3, changing this input's returned value.
Diagnosis answer key + feedback:
- ❌ [double-boss] "The boss's importance is added before the subordinate loop and should be added afterward in this case." — feedback: Addition order does not change the total; indirect reports are omitted.
- ✅ [one-level] "The loop follows edge 1→2 but never continues along 2→3, changing this input's returned value." — feedback: Correct. The helper stops after employee 1, so it omits employees 2 and 3 and returns 2+4 instead of the full chain's 20.
- ❌ [id-index] "The code assumes employee ids are array indexes, which changes the returned value here." — feedback: The Map correctly handles arbitrary ids; traversal depth is the bug.
Graph proof shown in feedback: code rule "Only the start node and its immediate outgoing neighbors contribute." → changed graph "The reporting graph is the chain 0→1→2→3, carrying importance 2, 4, 6, and 8." → boundary "The reporting chain 0→1→2→3 is three edges deep, while the helper stops after 0→1." → returned value "The shown code returns 6; the real problem returns 20."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Importance stops after direct reports
INCORRECT OUTPUT
6
CORRECT OUTPUT
20
Code rule: Only the start node and its immediate outgoing neighbors contribute. → Changed graph: The reporting graph is the chain 0→1→2→3, carrying importance 2, 4, 6, and 8. → Reachable boundary: The reporting chain 0→1→2→3 is three edges deep, while the helper stops after 0→1. → Returned value: The shown code returns 6; the real problem returns 20.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```