# After the Big Resignation (`who-keeps-their-job`) — variant, tree

## Problem statement (Description tab)

A company keeps its org chart as two lists of the same length. `ids[i]` is the ID of an employee, and `bosses[i]` is the ID of that employee's direct boss. Exactly one employee has `bosses[i] = 0`, meaning they have no boss (they run the company). Every other employee has exactly one boss, and the chart never loops, so it forms a tree. All IDs are unique positive numbers.

Employee `quitId` suddenly quits. Company tradition says that when someone quits, every employee below them also leaves: their direct reports, their reports' reports, and so on all the way down.

Return a list of the IDs of the employees who **still work** at the company, sorted from smallest to largest. If everyone leaves, return an empty list.

### Examples
- Example 1: input `ids = [1,3,10,5], bosses = [0,1,1,3], quitId = 3` → output `[1,10]`. Employee 1 runs the company and manages 3 and 10. Employee 3 manages 5. When 3 quits, 5 leaves too. Employees 1 and 10 remain, sorted: [1,10].
- Example 2: input `ids = [7,2,9], bosses = [0,7,7], quitId = 7` → output `[]`. Employee 7 runs the company and manages 2 and 9. When 7 quits, everyone below leaves, so nobody remains.

### Graph rules (authored)
- Nodes: One employee ID, including employees who manage nobody.
- Edges: Boss → direct report, so a quitting boss leads downward through the team.
- Node-name format shown in Step 1/3: Use the exact ID from the input only. Example: `15`. (pattern `^\d+$`)
- Step 2 node-label rule: `positive-integer` — Use positive integer IDs, matching the problem input.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`quit-middle`, facet "quitting subtree")
Raw input shown:
```
ids=[10,2,7,15], bosses=[0,10,10,2], quitId=2
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which sorted IDs remain?**
Choices as displayed (top to bottom):
1. [7,10]
2. [7,10,15]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[7,10]"
    feedback: Correct. Employees 2 and 15 leave; 7 and 10 remain.
- ❌ [bug] "[7,10,15]"
    feedback: This removes only the quitter and leaves their report 15. (misconception: remove-quitter-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "10", "2", "7", "15" · edges: 10→2, 10→7, 2→15
"Why" shown after success: Employees 2 and 15 leave; 7 and 10 remain.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact org chart")
Raw input shown:
```
ids=[10,2,7,15], bosses=[0,10,10,2], quitId=2
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 10 / 2 / 7 / 15
2. Picture C / 10 / 2 / 7 / 15
3. Picture D / 10 / 2 / 7
4. Picture A / 10 / 2 / 7 / 15
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 10, 2, 7, 15 · edges: 10→2, 10→7, 2→15
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 10, 2, 7, 15 · edges: 10→2, 10→7
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 10, 2, 7, 15 · edges: 2→10, 10→7, 2→15
    feedback: This reverses one listed arrow. (misconception: reverse-listed-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 10, 2, 7 · edges: 10→2, 10→7
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`quit-leaf`, facet "quitting subtree")
Raw input shown:
```
ids=[6,1,8,3], bosses=[0,6,6,1], quitId=3
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which sorted IDs remain?**
Choices as displayed (top to bottom):
1. [6,8]
2. [1,6,8]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[1,6,8]"
    feedback: Correct. Leaf employee 3 has no reports, so only 3 leaves.
- ❌ [bug] "[6,8]"
    feedback: This incorrectly walks upward and removes the quitter's boss 1. (misconception: remove-ancestor)
Graph the grader requires (hidden from student): DIRECTED · nodes: "6", "1", "8", "3" · edges: 6→1, 6→8, 1→3
"Why" shown after success: Leaf employee 3 has no reports, so only 3 leaves.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-node`, facet "employee identity")
Raw input shown:
```
ids = [4,9,2,7,12,5,3,8], bosses = [0,4,4,9,9,2,7,7], quitId = 9
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the company picture, what should each node represent?**
Choices as displayed (top to bottom):
1. A / Only employees who manage at least one person.
2. B / One whole department below each manager.
3. C / One reporting relationship such as 10 → 20.
4. D / One employee ID, including employees who manage nobody.
Answer key + feedback per choice (data):
- ✅ CORRECT [employees] "One employee ID, including employees who manage nobody."
    feedback: Correct. Every employee can stay or leave, so every ID needs its own node.
- ❌ [bosses] "Only employees who manage at least one person."
    feedback: Individual contributors can also leave when a boss above them quits, so they cannot be omitted. (misconception: omit-leaves)
- ❌ [departments] "One whole department below each manager."
    feedback: A department is a group of employee nodes. Combining it early hides exactly who leaves. (misconception: collapse-subtree)
- ❌ [boss-links] "One reporting relationship such as `10 → 20`."
    feedback: That relationship is an edge. The employee IDs at its ends are the nodes. (misconception: swap-node-edge)
"Why" shown after success: Correct. Every employee can stay or leave, so every ID needs its own node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-edge`, facet "boss-to-report arrows")
Raw input shown:
```
ids = [4,9,2,7,12,5,3,8], bosses = [0,4,4,9,9,2,7,7], quitId = 9
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which arrow should the picture draw for one boss-report pair?**
Choices as displayed (top to bottom):
1. A / Direct report → boss, because the input names each worker's boss.
2. B / Two arrows between every boss and report.
3. C / Boss → direct report, so a quitting boss leads downward through the team.
4. D / A direct arrow from each boss to every person anywhere below them.
Answer key + feedback per choice (data):
- ✅ CORRECT [boss-to-report] "Boss → direct report, so a quitting boss leads downward through the team."
    feedback: Correct. Downward arrows let DFS collect the quitter and every person below them.
- ❌ [report-to-boss] "Direct report → boss, because the input names each worker's boss."
    feedback: That follows the input storage rather than the needed search direction. It would walk toward ancestors. (misconception: reverse-hierarchy)
- ❌ [both-directions] "Two arrows between every boss and report."
    feedback: Reporting is not a friendship. A quitter affects descendants, not bosses and siblings reached by walking backward. (misconception: make-undirected)
- ❌ [all-descendants] "A direct arrow from each boss to every person anywhere below them."
    feedback: Only direct reports are edges. DFS discovers deeper employees one reporting step at a time. (misconception: transitive-edge)
"Why" shown after success: Correct. Downward arrows let DFS collect the quitter and every person below them.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`quit-root`, facet "boss-to-report arrows")
Raw input shown:
```
ids=[4,9,2], bosses=[0,4,4], quitId=4
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which sorted IDs remain?**
Choices as displayed (top to bottom):
1. []
2. [2,9]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. Every employee is in CEO 4's subtree.
- ❌ [bug] "[2,9]"
    feedback: This removes the CEO but fails to recurse into direct reports. (misconception: remove-root-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "4", "9", "2" · edges: 4→9, 4→2
"Why" shown after success: Every employee is in CEO 4's subtree.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "quitting subtree")
Raw input shown:
```
ids = [10,2,7,15], bosses = [0,10,10,2], quitId = 2
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **The chart has 10 above 2 and 7, and 2 above 15. If employee 2 quits, which sorted IDs remain?**
Choices as displayed (top to bottom):
1. A / [10,7]
2. B / [7,10,15]
3. C / [7,10]
4. D / [10]
Answer key + feedback per choice (data):
- ✅ CORRECT [seven-ten] "`[7,10]`"
    feedback: Correct. Employee 2 and their report 15 leave; numeric sorting puts 7 before 10.
- ❌ [ten-seven] "`[10,7]`"
    feedback: Those are the right people but the wrong numeric order; 7 comes before 10. (misconception: string-sort)
- ❌ [seven-ten-fifteen] "`[7,10,15]`"
    feedback: Employee 15 reports below quitter 2, so 15 leaves too. (misconception: remove-quitter-only)
- ❌ [ten] "`[10]`"
    feedback: Employee 7 is the quitter's sibling, not their report, so 7 keeps the job. (misconception: remove-siblings)
"Why" shown after success: Correct. Employee 2 and their report 15 leave; numeric sorting puts 7 before 10.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`non-contiguous-ids`, facet "employee identity")
Raw input shown:
```
ids=[20,5,90,7], bosses=[0,20,20,5], quitId=5
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which sorted IDs remain?**
Choices as displayed (top to bottom):
1. [5,7,20,90]
2. [20,90]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[20,90]"
    feedback: Correct. Employees 5 and 7 leave; 20 and sibling 90 stay.
- ❌ [bug] "[5,7,20,90]"
    feedback: This treats quitId 5 as an array position, fails to find that position, and therefore removes nobody. (misconception: id-as-array-index)
Graph the grader requires (hidden from student): DIRECTED · nodes: "20", "5", "90", "7" · edges: 20→5, 20→90, 5→7
"Why" shown after success: Employees 5 and 7 leave; 20 and sibling 90 stay.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "quitting subtree")
Raw input shown:
```
ids = [6,1,8,3], bosses = [0,6,6,1], quitId = 3
```
Node-name guide shown: Required node-name format: Use the exact ID from the input only. Example: 15.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **The chart has 6 above 1 and 8, and 1 above leaf employee 3. If 3 quits, which sorted IDs remain?**
Choices as displayed (top to bottom):
1. A / [6,8]
2. B / [1,6]
3. C / [6]
4. D / [1,6,8]
Answer key + feedback per choice (data):
- ✅ CORRECT [one-six-eight] "`[1,6,8]`"
    feedback: Correct. A leaf has no reports, so only employee 3 leaves.
- ❌ [six-eight] "`[6,8]`"
    feedback: Employee 1 is above the quitter, so 1 stays. (misconception: remove-ancestor)
- ❌ [one-six] "`[1,6]`"
    feedback: Employee 8 is in another branch and is unaffected. (misconception: remove-other-branch)
- ❌ [six] "`[6]`"
    feedback: Quitting does not remove the whole level beneath the CEO. (misconception: remove-level)
"Why" shown after success: Correct. A leaf has no reports, so only employee 3 leaves.
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
ids=[3,8,1], bosses=[0,3,8], quitId=8
```
Remedial question: **Which sorted IDs remain?** · choices shown: [3] | [1,3]
Remedial answer key: ✅ "[3]" — Correct. Quitting 8 removes 8 and report 1.; ❌ "[1,3]" — This removes only employee 8 and misses descendant 1.
Remedial required graph (hidden): DIRECTED · nodes: "3", "8", "1" · edges: 3→8, 8→1
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [bosses]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One employee ID, including employees who manage nobody.
Your choice: Individual contributors can also leave when a boss above them quits, so they cannot be omitted.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
ids=[50,4,6], bosses=[0,50,50], quitId=4
```
Remedial question: **Which sorted IDs remain?** · choices shown: [50] | [6,50]
Remedial answer key: ✅ "[6,50]" — Correct. Only leaf 4 leaves.; ❌ "[50]" — This removes sibling 6 even though 6 is not below quitter 4.
Remedial required graph (hidden): DIRECTED · nodes: "50", "4", "6" · edges: 50→4, 50→6
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [report-to-boss]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Boss → direct report, so a quitting boss leads downward through the team.
Your choice: That follows the input storage rather than the needed search direction. It would walk toward ancestors.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
ids=[9,2,1], bosses=[0,9,2], quitId=2
```
Remedial question: **Which sorted IDs remain?** · choices shown: [9] | [1,9]
Remedial answer key: ✅ "[9]" — Correct. The downward subtree from 2 contains 2 and 1.; ❌ "[1,9]" — This reverses the reporting edge and fails to visit report 1.
Remedial required graph (hidden): DIRECTED · nodes: "9", "2", "1" · edges: 9→2, 2→1
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [ten-seven]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[7,10]
Your choice: Those are the right people but the wrong numeric order; 7 comes before 10.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
ids=[11,2,30], bosses=[0,11,11], quitId=30
```
Remedial question: **Which sorted IDs remain?** · choices shown: [11,2] | [2,11]
Remedial answer key: ✅ "[2,11]" — Correct. Only leaf 30 leaves, and 2 sorts before 11.; ❌ "[11,2]" — These are the right employees in lexicographic rather than numeric order.
Remedial required graph (hidden): DIRECTED · nodes: "11", "2", "30" · edges: 11→2, 11→30
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [six-eight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[1,6,8]
Your choice: Employee 1 is above the quitter, so 1 stays.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
ids=[42], bosses=[0], quitId=42
```
Remedial question: **Which sorted IDs remain?** · choices shown: [] | [42]
Remedial answer key: ✅ "[]" — Correct. The quitter themself always leaves, even with no reports.; ❌ "[42]" — This refuses to remove an employee with no outgoing report arrows.
Remedial required graph (hidden): DIRECTED · nodes: "42" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Upside-down org chart"; authored goal, NOT shown to student: "Find an org chart where reading every manager link backward changes who leaves.")
Everything the student sees (text):
```
C
Charles's broken search

Charles reads every from/to relationship backward.

Your main goal: Expose Charles's mistake. Draw two graphs: first the correct graph, then Charles's graph using the mistake.

WHICH EMPLOYEE QUITS?
quitting employee
OUTPUT
CORRECT OUTPUT
CHARLES’S OUTPUT
Drawing 1 of 2: Correct graph · Choose quitting employee
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
2 · Charles's graph
Check my graph
→
```
Start field: label "WHICH EMPLOYEE QUITS? / quitting employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CHARLES’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("10", "2", "7", "15"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[2]","buggy":"[]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2 · edges (in drawing order) 2→1 · start 1
Grader's expected answers: correct output `[2]` · character's output `[]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 1→2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `2`; ❌ curly braces → `{2}`; ❌ quoted numbers/strings → `["2"]`; ✅ spaces inside brackets → `[ 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[2]
CHARLES'S OUTPUT
[]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Manager's manager"; authored goal, NOT shown to student: "Use the smallest team where a report two levels down must also leave.")
Everything the student sees (text):
```
M
Maria's broken search

Maria stops after one hop instead of continuing.

Your main goal: Expose Maria's mistake. Draw two graphs: first the correct graph, then Maria's graph using the mistake.

WHICH EMPLOYEE QUITS?
quitting employee
OUTPUT
CORRECT OUTPUT
MARIA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose quitting employee
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
2 · Maria's graph
Check my graph
→
```
Start field: label "WHICH EMPLOYEE QUITS? / quitting employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | MARIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[]","buggy":"[3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 1→2, 2→3 · start 1
Grader's expected answers: correct output `[]` · character's output `[3]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 1→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[]
MARIA'S OUTPUT
[3]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Missing final hire"; authored goal, NOT shown to student: "Make the last boss-to-report link matter to the quitting subtree.")
Everything the student sees (text):
```
L
Luis's broken search

Luis builds every listed connection except the last one.

Your main goal: Expose Luis's mistake. Draw two graphs: first the correct graph, then Luis's graph using the mistake. Edge numbers show drawing order.

WHICH EMPLOYEE QUITS?
quitting employee
OUTPUT
CORRECT OUTPUT
LUIS’S OUTPUT
Drawing 1 of 2: Correct graph · Choose quitting employee
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
2 · Luis's graph
Check my graph
→
```
Start field: label "WHICH EMPLOYEE QUITS? / quitting employee", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LUIS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[]","buggy":"[3]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 1, 2, 3 · edges (in drawing order) 1→2, 2→3 · start 1
Grader's expected answers: correct output `[]` · character's output `[3]` · character's graph must be exactly: DIRECTED · nodes: 1, 2, 3 · edges: 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[]
LUIS'S OUTPUT
[3]
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
ids=[3,8,1], bosses=[0,3,8], quitId=8
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "3", "8", "1" · edges: 3→8, 8→1
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One whole department below each manager.”"
    feedback if wrong: A department is a group of employee nodes. Combining it early hides exactly who leaves. Correct node rule: One employee ID, including employees who manage nobody.
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 8, but the graph still has no direct 3→1 edge."
    feedback if wrong: Right. A multi-step route through 8 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 outgoing direct edge."
    feedback if wrong: 3 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
A department is a group of employee nodes. Combining it early hides exactly who leaves. Correct node rule: One employee ID, including employees who manage nobody.
×
Right. A multi-step route through 8 creates reachability, not a new direct edge.
×
3 has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "8 has exactly 1 outgoing direct edge."
    feedback if wrong: 8 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One reporting relationship such as `10 → 20`.”"
    feedback if wrong: That relationship is an edge. The employee IDs at its ends are the nodes. Correct node rule: One employee ID, including employees who manage nobody.
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 8, but the graph still has no direct 3→1 edge."
    feedback if wrong: Right. A multi-step route through 8 creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
8 has 1 outgoing direct edge.
×
That relationship is an edge. The employee IDs at its ends are the nodes. Correct node rule: One employee ID, including employees who manage nobody.
×
Right. A multi-step route through 8 creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 3→8 and 8→1, so it should also contain a direct 3→1 edge."
    feedback if wrong: Two direct edges through 8 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only employees who manage at least one person.”"
    feedback if wrong: Individual contributors can also leave when a boss above them quits, so they cannot be omitted. Correct node rule: One employee ID, including employees who manage nobody.
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
ids=[50,4,6], bosses=[0,50,50], quitId=4
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "50", "4", "6" · edges: 50→4, 50→6
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "50 can reach 4, but there is no direct 50→4 edge."
    feedback if wrong: The mini-example lists 50→4 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "50 has exactly 3 outgoing direct edges."
    feedback if wrong: 50 has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One reporting relationship such as `10 → 20`.”"
    feedback if wrong: That relationship is an edge. The employee IDs at its ends are the nodes. Correct node rule: One employee ID, including employees who manage nobody.
Result: PASSED

### S3 Q3
Raw input shown:
```
ids=[9,2,1], bosses=[0,9,2], quitId=2
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "9", "2", "1" · edges: 9→2, 2→1
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One whole department below each manager.”"
    feedback if wrong: A department is a group of employee nodes. Combining it early hides exactly who leaves. Correct node rule: One employee ID, including employees who manage nobody.
- [NO is correct] (direct-vs-reach) "The correct graph has 9→2 and 2→1, so it should also contain a direct 9→1 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
ids=[11,2,30], bosses=[0,11,11], quitId=30
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "11", "2", "30" · edges: 11→2, 11→30
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only employees who manage at least one person.”"
    feedback if wrong: Individual contributors can also leave when a boss above them quits, so they cannot be omitted. Correct node rule: One employee ID, including employees who manage nobody.
- [YES is correct] (direct-vs-reach) "11 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 11→2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q5
Raw input shown:
```
ids=[42], bosses=[0], quitId=42
```
Node-name guide: Required node-name format: Use the exact ID from the input only. Example: 15. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "42" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "Because 42 can reach itself, the graph should contain a direct 42→42 edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct 42→42 self-edge.
- [NO is correct] (local-degree) "42 has exactly 1 outgoing direct edge."
    feedback if wrong: 42 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One reporting relationship such as `10 → 20`.”"
    feedback if wrong: That relationship is an edge. The employee IDs at its ends are the nodes. Correct node rule: One employee ID, including employees who manage nobody.
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

### S4 case 1 — `authored-deep-case` · bug: Stops the resignation at one employee
Input shown:
```
REAL PROBLEM INPUT
ids: [10, 2, 7, 15]
bosses: [0, 10, 10, 2]
quitId: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const { ids, quitId } = input;
  const leaving = new Set();
  leaving.add(quitId);
  return ids
    .filter((id) => !leaving.has(id))
    .sort((firstValue, secondValue) => firstValue - secondValue);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "10", "2", "7", "15" · edges: 10→2, 10→7, 2→15
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sorted array of remaining employee IDs" · expected buggy output `[7,10,15]` · real correct output `[7,10]`
Diagnosis choices as displayed:
- A The code follows reports upward toward bosses instead of downward for the shown graph.
- B The code removes the quitter but never follows boss-to-report edges to remove descendants.
- C The code sorts employee IDs as strings instead of numbers, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [quitter-only] "The code removes the quitter but never follows boss-to-report edges to remove descendants." — feedback: Exactly. Employee 15 is below quitter 2, so 15 must leave too.
- ❌ [wrong-direction] "The code follows reports upward toward bosses instead of downward for the shown graph." — feedback: That is a believable tree bug, but this code never traverses either direction.
- ❌ [sort-strings] "The code sorts employee IDs as strings instead of numbers, changing this input's returned value." — feedback: The comparator is numeric. The extra employee, not the order, causes the failure.
Graph proof shown in feedback: code rule "Only node 2 enters the leaving set." → changed graph "10 points to direct reports 2 and 7; 2 points to direct report 15." → boundary "The quitting node has a descendant two levels from the root." → returned value "15 incorrectly remains, producing [7,10,15] instead of [7,10]."
Output-format probes: ✅ spaces after commas → `[7, 10, 15]`; ❌ reversed element order → `[15,10,7]`; ❌ quoted numbers in array → `["7","10","15"]`; ❌ trailing period → `[7,10,15].`
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
About your diagnosis: That is a believable tree bug, but this code never traverses either direction.
Code rule: Only node 2 enters the leaving set. → Changed graph: 10 points to direct reports 2 and 7; 2 points to direct report 15. → Reachable boundary: The quitting node has a descendant two levels from the root.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Stops the resignation at one employee
INCORRECT OUTPUT
[7,10,15]
CORRECT OUTPUT
[7,10]
Code rule: Only node 2 enters the leaving set. → Changed graph: 10 points to direct reports 2 and 7; 2 points to direct report 15. → Reachable boundary: The quitting node has a descendant two levels from the root. → Returned value: 15 incorrectly remains, producing [7,10,15] instead of [7,10].
```

### S4 case 2 — `quit-root` · bug: Stops the resignation at one employee
Input shown:
```
REAL PROBLEM INPUT
ids=[4,9,2], bosses=[0,4,4], quitId=4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const { ids, quitId } = input;
  const leaving = new Set();
  leaving.add(quitId);
  return ids
    .filter((id) => !leaving.has(id))
    .sort((firstValue, secondValue) => firstValue - secondValue);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "4", "9", "2" · edges: 4→9, 4→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sorted array of remaining employee IDs" · expected buggy output `[2,9]` · real correct output `[]`
Diagnosis choices as displayed:
- A The code follows reports upward toward bosses instead of downward for the shown graph.
- B The code sorts employee IDs as strings instead of numbers, changing this input's returned value.
- C The code removes the quitter but never follows boss-to-report edges to remove descendants.
Diagnosis answer key + feedback:
- ✅ [quitter-only] "The code removes the quitter but never follows boss-to-report edges to remove descendants." — feedback: Exactly. Removing root 4 must also remove reports 9 and 2, but the code leaves both.
- ❌ [wrong-direction] "The code follows reports upward toward bosses instead of downward for the shown graph." — feedback: That is a believable tree bug, but this code never traverses either direction.
- ❌ [sort-strings] "The code sorts employee IDs as strings instead of numbers, changing this input's returned value." — feedback: The comparator is numeric. The extra employee, not the order, causes the failure.
Graph proof shown in feedback: code rule "Only quitting node 4 enters the leaving set; reports 9 and 2 are never traversed." → changed graph "Nodes are 4, 9, 2; direct arrows are 4→9, 4→2." → boundary "Quitter 4 is the root and both other employees are descendants who must leave." → returned value "The shown code returns [2,9]; the real problem returns []."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Stops the resignation at one employee
INCORRECT OUTPUT
[2,9]
CORRECT OUTPUT
[]
Code rule: Only quitting node 4 enters the leaving set; reports 9 and 2 are never traversed. → Changed graph: Nodes are 4, 9, 2; direct arrows are 4→9, 4→2. → Reachable boundary: Quitter 4 is the root and both other employees are descendants who must leave. → Returned value: The shown code returns [2,9]; the real problem returns [].
```

### S4 case 3 — `non-contiguous-ids` · bug: Stops the resignation at one employee
Input shown:
```
REAL PROBLEM INPUT
ids=[20,5,90,7], bosses=[0,20,20,5], quitId=5
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const { ids, quitId } = input;
  const leaving = new Set();
  leaving.add(quitId);
  return ids
    .filter((id) => !leaving.has(id))
    .sort((firstValue, secondValue) => firstValue - secondValue);
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "20", "5", "90", "7" · edges: 20→5, 20→90, 5→7
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "sorted array of remaining employee IDs" · expected buggy output `[7,20,90]` · real correct output `[20,90]`
Diagnosis choices as displayed:
- A The code removes the quitter but never follows boss-to-report edges to remove descendants.
- B The code follows reports upward toward bosses instead of downward for the shown graph.
- C The code sorts employee IDs as strings instead of numbers, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [quitter-only] "The code removes the quitter but never follows boss-to-report edges to remove descendants." — feedback: Exactly. Employee 7 reports to quitter 5 and must also leave.
- ❌ [wrong-direction] "The code follows reports upward toward bosses instead of downward for the shown graph." — feedback: That is a believable tree bug, but this code never traverses either direction.
- ❌ [sort-strings] "The code sorts employee IDs as strings instead of numbers, changing this input's returned value." — feedback: The comparator is numeric. The extra employee, not the order, causes the failure.
Graph proof shown in feedback: code rule "Only quitting node 5 enters the leaving set; descendant 7 is never traversed." → changed graph "Nodes are 20, 5, 90, 7; direct arrows are 20→5, 20→90, 5→7." → boundary "Quitter 5 has direct report 7, while unrelated employees 20 and 90 remain." → returned value "The shown code returns [7,20,90]; the real problem returns [20,90]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Stops the resignation at one employee
INCORRECT OUTPUT
[7,20,90]
CORRECT OUTPUT
[20,90]
Code rule: Only quitting node 5 enters the leaving set; descendant 7 is never traversed. → Changed graph: Nodes are 20, 5, 90, 7; direct arrows are 20→5, 20→90, 5→7. → Reachable boundary: Quitter 5 has direct report 7, while unrelated employees 20 and 90 remain. → Returned value: The shown code returns [7,20,90]; the real problem returns [20,90].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```