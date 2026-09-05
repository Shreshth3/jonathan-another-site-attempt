# Office Rumor (`office-rumor-reach`) — variant, undirected-graph

## Problem statement (Description tab)

An office has `n` employees, numbered `0` to `n - 1`. You are given a list `friendships`, where each entry `[a, b]` means employees `a` and `b` are friends (friendship goes both ways).

One morning, employee `start` hears a juicy rumor. Every employee who hears the rumor immediately tells **all of their friends**, who then tell all of *their* friends, and so on until no new person can hear it.

Write a function `countWhoHear(n, friendships, start)` that returns the total number of employees who end up hearing the rumor, **including** the employee who started it.

### Examples
- Example 1: input `n = 6, friendships = [[0,1],[1,2],[3,4]], start = 0` → output `3`. Employee 0 tells friend 1, and 1 tells friend 2. Employees 3, 4, and 5 are not connected to 0 by any chain of friends, so they never hear it. In total 3 people (0, 1, 2) hear the rumor.
- Example 2: input `n = 4, friendships = [[1,2]], start = 0` → output `1`. Employee 0 has no friends, so the rumor stops immediately. Only 1 person (employee 0) ever hears it.

### Graph rules (authored)
- Nodes: Each employee `0` through `n−1`, including employees with no friends.
- Edges: A two-way edge a—b, since either friend can tell the other.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "exact friendships")
Raw input shown:
```
n=5, friendships=[[0,1],[1,2],[3,4]], start=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Including employee 0, how many employees hear the rumor?**
Choices as displayed (top to bottom):
1. 2
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Employee 0's friendship component contains 3 employees.
- ❌ [bug] "2"
    feedback: This counts only the starter and direct friends, stopping before friends-of-friends. (misconception: direct-friends-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 3—4
"Why" shown after success: Employee 0's friendship component contains 3 employees.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact friendships")
Raw input shown:
```
n=5, friendships=[[0,1],[1,2],[3,4]], start=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4
2. Picture C / 0 / 1 / 2 / 3 / 4
3. Picture D / 0 / 1 / 2 / 3
4. Picture A / 0 / 1 / 2 / 3 / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2, 3—4
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0—1, 1—2
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 1→2, 3→4
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 1—2
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`concept-node`, facet "employee identity")
Raw input shown:
```
n = 8, friendships = [[0,1],[1,2],[2,3],[3,0],[2,4],[5,6]], start = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should one node stand for in the office rumor graph?**
Choices as displayed (top to bottom):
1. A / Each friendship pair, because that is what appears in the input list.
2. B / One node for everyone who will eventually hear the rumor.
3. C / Each employee 0 through n−1, including employees with no friends.
4. D / Only employees named in at least one friendship pair.
Answer key + feedback per choice (data):
- ✅ CORRECT [employees] "Each employee `0` through `n−1`, including employees with no friends."
    feedback: Correct. An isolated employee is still a node and can hear only if they are the starter.
- ❌ [friendships] "Each friendship pair, because that is what appears in the input list."
    feedback: Friendship pairs are edges. Employee numbers are their endpoint nodes. (misconception: edge-as-node)
- ❌ [reachable-team] "One node for everyone who will eventually hear the rumor."
    feedback: That reachable group is the result of DFS, not a node known before the search. (misconception: component-as-node)
- ❌ [nonisolated] "Only employees named in at least one friendship pair."
    feedback: Employees with no friendships still exist among 0 through n−1. (misconception: omit-isolated)
"Why" shown after success: Correct. An isolated employee is still a node and can hear only if they are the starter.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-2`, facet "employee identity")
Raw input shown:
```
n=4, friendships=[[0,1],[1,2],[2,3]], start=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Including employee 0, how many employees hear the rumor?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. Employee 0's friendship component contains 4 employees.
- ❌ [bug] "2"
    feedback: This counts only the starter and direct friends, stopping before friends-of-friends. (misconception: direct-friends-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: Employee 0's friendship component contains 4 employees.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-edge`, facet "two-way friendship")
Raw input shown:
```
n = 8, friendships = [[0,1],[1,2],[2,3],[3,0],[2,4],[5,6]], start = 2
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How does friendship [a,b] appear in the graph?**
Choices as displayed (top to bottom):
1. A / Only an arrow a→b, following the pair's written order.
2. B / A two-way edge a—b, since either friend can tell the other.
3. C / Add an edge only after a and b share another mutual friend.
4. D / Directly join the starter to everyone a friendship chain can reach.
Answer key + feedback per choice (data):
- ✅ CORRECT [mutual] "A two-way edge a—b, since either friend can tell the other."
    feedback: Correct. Store b under a and a under b.
- ❌ [a-tells-b] "Only an arrow a→b, following the pair's written order."
    feedback: Friendship is mutual; the input order does not control rumor direction. (misconception: directed-friendship)
- ❌ [common-friend] "Add an edge only after a and b share another mutual friend."
    feedback: The listed pair itself is already a direct friendship. (misconception: require-triangle)
- ❌ [reachable-shortcut] "Directly join the starter to everyone a friendship chain can reach."
    feedback: Those people are reached through paths; inventing direct edges hides the traversal. (misconception: transitive-shortcut)
"Why" shown after success: Correct. Store b under a and a under b.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "two-way friendship")
Raw input shown:
```
n=5, friendships=[[0,1],[2,3]], start=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Including employee 0, how many employees hear the rumor?**
Choices as displayed (top to bottom):
1. 5
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Employee 0's friendship component contains 2 employees.
- ❌ [bug] "5"
    feedback: This counts every declared employee, including disconnected components. (misconception: count-all-employees)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
"Why" shown after success: Employee 0's friendship component contains 2 employees.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "starter component")
Raw input shown:
```
n=8, friendships=[[2,1],[1,0],[2,3],[3,4],[5,6]], start=2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Including the starter, how many employees hear the rumor?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 8
3. C / 5
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [five] "5"
    feedback: Correct: 2 reaches 1, 0, 3, and 4.
- ❌ [three] "3"
    feedback: This counts only employee 2 and its direct friends 1 and 3. (misconception: direct-neighbors-only)
- ❌ [eight] "8"
    feedback: This assumes one DFS crosses between disconnected friendship groups. (misconception: count-all-nodes)
- ❌ [four] "4"
    feedback: This excludes the employee who starts the rumor. (misconception: exclude-source)
"Why" shown after success: Correct: 2 reaches 1, 0, 3, and 4.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-counterexample`, facet "starter component")
Raw input shown:
```
n=7, friendships=[[0,1],[1,2],[2,3],[3,4],[5,6]], start=6
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many employees hear the rumor?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 5
4. D / 7
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2"
    feedback: Correct: employees 6 and 5 form the starter's component.
- ❌ [one] "1"
    feedback: This counts the starter but never follows the friendship to 5. (misconception: no-neighbor-traversal)
- ❌ [five] "5"
    feedback: This returns the largest component instead of the starter's component. (misconception: largest-component)
- ❌ [seven] "7"
    feedback: This counts every employee regardless of reachability. (misconception: count-all-nodes)
"Why" shown after success: Correct: employees 6 and 5 form the starter's component.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`case-4`, facet "starter component")
Raw input shown:
```
n=1, friendships=[], start=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Including employee 0, how many employees hear the rumor?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Employee 0's friendship component contains 1 employee.
- ❌ [bug] "2"
    feedback: This counts every declared employee, including disconnected components. (misconception: count-all-employees)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0" · edges: none
"Why" shown after success: Employee 0's friendship component contains 1 employee.
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
n=5, friendships=[[0,1],[0,2],[0,3],[3,4]], start=0
```
Remedial question: **Including employee 0, how many employees hear the rumor?** · choices shown: 4 | 5
Remedial answer key: ✅ "5" — Correct. Employee 0's friendship component contains 5 employees.; ❌ "4" — This counts only the starter and direct friends, stopping before friends-of-friends.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [friendships]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each employee 0 through n−1, including employees with no friends.
Your choice: Friendship pairs are edges. Employee numbers are their endpoint nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
n=4, friendships=[[0,1],[1,2],[2,0]], start=0
```
Remedial question: **Including employee 0, how many employees hear the rumor?** · choices shown: 3 | 4
Remedial answer key: ✅ "3" — Correct. Employee 0's friendship component contains 3 employees.; ❌ "4" — This counts every declared employee, including disconnected components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [a-tells-b]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A two-way edge a—b, since either friend can tell the other.
Your choice: Friendship is mutual; the input order does not control rumor direction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
n=3, friendships=[], start=0
```
Remedial question: **Including employee 0, how many employees hear the rumor?** · choices shown: 3 | 1
Remedial answer key: ✅ "1" — Correct. Employee 0's friendship component contains 1 employee.; ❌ "3" — This counts every declared employee, including disconnected components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: This counts only employee 2 and its direct friends 1 and 3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
n=4, friendships=[[0,1],[2,3]], start=0
```
Remedial question: **Including employee 0, how many employees hear the rumor?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. Employee 0's friendship component contains 2 employees.; ❌ "4" — This counts every declared employee, including disconnected components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: This counts the starter but never follows the friendship to 5.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
n=5, friendships=[[0,1],[0,2],[0,3],[0,4]], start=0
```
Remedial question: **Including employee 0, how many employees hear the rumor?** · choices shown: 6 | 5
Remedial answer key: ✅ "5" — Correct. Employee 0's friendship component contains 5 employees.; ❌ "6" — This counts every declared employee, including disconnected components.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Friend of a friend"; authored goal, NOT shown to student: "Use a friendship chain where the rumor must travel more than one hop.")
Everything the student sees (text):
```
L
Levi's broken search

Levi never explores beyond the start's immediate neighbors.

Your main goal: Expose Levi's mistake. Draw two graphs: first the correct graph, then Levi's graph using the mistake.

CHOOSE THE RUMOR STARTER
rumor starter
OUTPUT
CORRECT OUTPUT
LEVI’S OUTPUT
Drawing 1 of 2: Correct graph · Choose rumor starter
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
2 · Levi's graph
Check my graph
→
```
Start field: label "CHOOSE THE RUMOR STARTER / rumor starter", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LEVI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1, 1—2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
LEVI'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `skip-leaf-edges` (authored level "Quiet office leaf"; authored goal, NOT shown to student: "Make an employee with one friend depend on that single friendship.")
Everything the student sees (text):
```
N
Naomi's broken search

Naomi keeps the middle of the graph but disconnects every leaf.

Your main goal: Expose Naomi's mistake. Draw two graphs: first the correct graph, then Naomi's graph using the mistake.

CHOOSE THE RUMOR STARTER
rumor starter
OUTPUT
CORRECT OUTPUT
NAOMI’S OUTPUT
Drawing 1 of 2: Correct graph · Choose rumor starter
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
2 · Naomi's graph
Check my graph
→
```
Start field: label "CHOOSE THE RUMOR STARTER / rumor starter", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NAOMI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
NAOMI'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Different rumor starter"; authored goal, NOT shown to student: "Start the real search at employee 0, but make the mistaken search begin at employee 1 outside that friend group.")
Everything the student sees (text):
```
O
Oliver's broken search

Oliver runs the search from a different rumor starter.

Your main goal: Expose Oliver's mistake. Draw two graphs: first the correct graph, then Oliver's graph using the mistake.

CHOOSE THE RUMOR STARTER
rumor starter
OUTPUT
CORRECT OUTPUT
OLIVER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose rumor starter
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
2 · Oliver's graph
Check my graph
→
```
Start field: label "CHOOSE THE RUMOR STARTER / rumor starter", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | OLIVER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
OLIVER'S OUTPUT
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
n=4, friendships=[[0,1],[2,3]], start=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 2—3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only employees named in at least one friendship pair.”"
    feedback if wrong: Employees with no friendships still exist among 0 through n−1. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Employees with no friendships still exist among 0 through n−1. Correct node rule: Each employee
0
through
n−1
, including employees with no friends.
×
Correct. The mini-example lists 0—1 as one direct edge.
×
2 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "2 and 3 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2—3 as one direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each friendship pair, because that is what appears in the input list.”"
    feedback if wrong: Friendship pairs are edges. Employee numbers are their endpoint nodes. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Correct. The mini-example lists 2—3 as one direct edge.
×
1 has 1 direct neighbor.
×
Friendship pairs are edges. Employee numbers are their endpoint nodes. Correct node rule: Each employee
0
through
n−1
, including employees with no friends.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for everyone who will eventually hear the rumor.”"
    feedback if wrong: That reachable group is the result of DFS, not a node known before the search. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0 has exactly 2 direct neighbors."
    feedback if wrong: 0 has 1 direct neighbor.
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
n=5, friendships=[[0,1],[0,2],[0,3],[0,4]], start=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 0—4
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each friendship pair, because that is what appears in the input list.”"
    feedback if wrong: Friendship pairs are edges. Employee numbers are their endpoint nodes. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
- [NO is correct] (direct-vs-reach) "The correct graph has 4—0 and 0—1, so it should also contain a direct 4—1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=5, friendships=[[0,1],[0,2],[0,3],[3,4]], start=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 0—3, 3—4
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 2 through 0, but the graph still has no direct 3—2 edge."
    feedback if wrong: Right. A multi-step route through 0 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 3 direct neighbors."
    feedback if wrong: 0 has 3 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only employees named in at least one friendship pair.”"
    feedback if wrong: Employees with no friendships still exist among 0 through n−1. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=4, friendships=[[0,1],[1,2],[2,0]], start=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—0
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for everyone who will eventually hear the rumor.”"
    feedback if wrong: That reachable group is the result of DFS, not a node known before the search. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1—2 as one direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=3, friendships=[], start=0
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Each friendship pair, because that is what appears in the input list.”"
    feedback if wrong: Friendship pairs are edges. Employee numbers are their endpoint nodes. Correct node rule: Each employee `0` through `n−1`, including employees with no friends.
- [NO is correct] (direct-vs-reach) "0 can reach 1, so the graph should contain a direct edge between them."
    feedback if wrong: Reachability never creates a direct edge. This input lists no direct relation between 0 and 1.
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

### S4 case 1 — `authored-deep-case` · bug: Treats friendships as one-way
Input shown:
```
REAL PROBLEM INPUT
n: 3
friendships: [[1, 0], [2, 1]]
start: 0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.friendships) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set([input.start]);
  const stack = [input.start];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of employees reached" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A The code incorrectly counts the employee who starts the rumor for the shown graph.
- B The code tells only direct friends and never continues through their friends.
- C Each pair is stored only a→b, so start 0 cannot traverse the reverse-listed chain.
Diagnosis answer key + feedback:
- ✅ [missing-reverse-friendship] "Each pair is stored only a→b, so start 0 cannot traverse the reverse-listed chain." — feedback: Correct. Friendship lets 0 tell 1 and then 1 tell 2 regardless of pair order.
- ❌ [counts-start] "The code incorrectly counts the employee who starts the rumor for the shown graph." — feedback: The starter hears the rumor and must be included.
- ❌ [shallow-rumor] "The code tells only direct friends and never continues through their friends." — feedback: The stack does continue through newly reached employees; direction blocks it before that matters.
Graph proof shown in feedback: code rule "The listed pairs become arrows 1→0 and 2→1." → changed graph "The friendships form the undirected chain 0—1—2." → boundary "Every useful traversal from start 0 goes against the written pair order." → returned value "The code reaches only 0 and returns 1 instead of 3."
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
About your diagnosis: The starter hears the rumor and must be included.
Code rule: The listed pairs become arrows 1→0 and 2→1. → Changed graph: The friendships form the undirected chain 0—1—2. → Reachable boundary: Every useful traversal from start 0 goes against the written pair order.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Treats friendships as one-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: The listed pairs become arrows 1→0 and 2→1. → Changed graph: The friendships form the undirected chain 0—1—2. → Reachable boundary: Every useful traversal from start 0 goes against the written pair order. → Returned value: The code reaches only 0 and returns 1 instead of 3.
```

### S4 case 2 — `reverse-chain-plus-forward-leaf` · bug: Treats friendships as one-way
Input shown:
```
REAL PROBLEM INPUT
n: 5
friendships: [[1, 0], [2, 1], [3, 2], [0, 4]]
start: 0
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.friendships) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set([input.start]);
  const stack = [input.start];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 1—2, 2—3, 0—4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of employees reached" · expected buggy output `2` · real correct output `5`
Diagnosis choices as displayed:
- A Only the listed arrows are stored, so 0 reaches forward-listed friend 4 but cannot enter the reverse-listed chain 0—1—2—3.
- B The code wrongly includes starter 0, creating the extra count.
- C The stack stops after direct friend 4 and never processes 4's friends.
Diagnosis answer key + feedback:
- ✅ [missing-reverse-friendship] "Only the listed arrows are stored, so 0 reaches forward-listed friend 4 but cannot enter the reverse-listed chain 0—1—2—3." — feedback: Correct. Friendship is two-way, so all five employees should hear the rumor.
- ❌ [counts-start] "The code wrongly includes starter 0, creating the extra count." — feedback: Starter 0 really has heard the rumor; nodes 1,2,3 are the missing employees.
- ❌ [shallow-rumor] "The stack stops after direct friend 4 and never processes 4's friends." — feedback: The stack processes every reached node; missing reverse edges prevent reaching node 1.
Graph proof shown in feedback: code rule "Pairs create only arrows 1→0, 2→1, 3→2, and 0→4." → changed graph "The undirected graph is connected: chain 3—2—1—0 with leaf 4 at 0." → boundary "One edge points out of start, but the three-node chain points toward start." → returned value "The code reaches {0,4} and returns 2; the real rumor reaches all 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Treats friendships as one-way
INCORRECT OUTPUT
2
CORRECT OUTPUT
5
Code rule: Pairs create only arrows 1→0, 2→1, 3→2, and 0→4. → Changed graph: The undirected graph is connected: chain 3—2—1—0 with leaf 4 at 0. → Reachable boundary: One edge points out of start, but the three-node chain points toward start. → Returned value: The code reaches {0,4} and returns 2; the real rumor reaches all 5.
```

### S4 case 3 — `start-at-directed-sink` · bug: Treats friendships as one-way
Input shown:
```
REAL PROBLEM INPUT
n: 6
friendships: [[0, 1], [2, 1], [2, 3], [4, 3], [4, 5]]
start: 1
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.friendships) {
    graph[firstValue].push(secondValue);
  }
  const visited = new Set([input.start]);
  const stack = [input.start];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1, 1—2, 2—3, 3—4, 4—5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of employees reached" · expected buggy output `1` · real correct output `6`
Diagnosis choices as displayed:
- A The result is 1 only because the code should exclude starter 1.
- B Node 1 is a sink in the stored arrows even though it sits inside one undirected friendship chain.
- C The code reaches nodes 0 and 2 but refuses to spread beyond one hop.
Diagnosis answer key + feedback:
- ✅ [missing-reverse-friendship] "Node 1 is a sink in the stored arrows even though it sits inside one undirected friendship chain." — feedback: Correct. The real chain 0—1—2—3—4—5 lets the rumor reach everyone from 1.
- ❌ [counts-start] "The result is 1 only because the code should exclude starter 1." — feedback: The starter belongs in the reached set; five friends are missing because arrows are one-way.
- ❌ [shallow-rumor] "The code reaches nodes 0 and 2 but refuses to spread beyond one hop." — feedback: It reaches neither 0 nor 2: both stored arrows point into node 1.
Graph proof shown in feedback: code rule "The stored arrows are 0→1, 2→1, 2→3, 4→3, and 4→5." → changed graph "Ignoring listing order gives the single chain 0—1—2—3—4—5." → boundary "Start 1 has real neighbors but zero outgoing stored edges." → returned value "The code returns 1; undirected reachability returns 6."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Treats friendships as one-way
INCORRECT OUTPUT
1
CORRECT OUTPUT
6
Code rule: The stored arrows are 0→1, 2→1, 2→3, 4→3, and 4→5. → Changed graph: Ignoring listing order gives the single chain 0—1—2—3—4—5. → Reachable boundary: Start 1 has real neighbors but zero outgoing stored edges. → Returned value: The code returns 1; undirected reachability returns 6.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```