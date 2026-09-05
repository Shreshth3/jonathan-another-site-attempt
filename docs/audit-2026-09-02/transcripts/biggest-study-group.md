# The Biggest Study Group (`biggest-study-group`) — variant, undirected-graph

## Problem statement (Description tab)

There are `n` students in a coding bootcamp, numbered `0` to `n - 1`. You are given an `n x n` matrix `worked`, where `worked[i][j] = 1` means student `i` and student `j` did a project together, and `worked[i][j] = 0` means they did not. The matrix is symmetric (`worked[i][j] = worked[j][i]`), and `worked[i][i]` is always `1`.

Students form **study groups** through chains of teammates: if `A` worked with `B`, and `B` worked with `C`, then `A`, `B`, and `C` all end up in the same study group — even if `A` and `C` never worked together directly.

Write a function `largestStudyGroup(worked)` that returns the number of students in the **largest** study group.

### Examples
- Example 1: input `worked = [[1,1,0],[1,1,0],[0,0,1]]` → output `2`. Students 0 and 1 worked together, forming a group of 2. Student 2 is alone in a group of 1. The largest group has 2 students.
- Example 2: input `worked = [[1,1,0,0],[1,1,1,0],[0,1,1,0],[0,0,0,1]]` → output `3`. Student 0 worked with 1, and 1 worked with 2, so {0, 1, 2} form one group of 3. Student 3 is alone. The largest group has 3 students.

### Graph rules (authored)
- Nodes: One student for each row index `0` through `n−1`.
- Edges: For different i and j, `worked[i][j] = 1` creates the undirected edge i—j.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`ring-and-pair`, facet "largest component")
Raw input shown:
```
worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest group size is returned?**
Choices as displayed (top to bottom):
1. 4
2. 7
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The component sizes are 4, 2, and 1.
- ❌ [bug] "7"
    feedback: This counts every matrix row instead of one connected component. (misconception: count-all-students)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5", "6" · edges: 0—1, 0—3, 1—2, 2—3, 4—5
"Why" shown after success: The component sizes are 4, 2, and 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact matrix")
Raw input shown:
```
worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4 / 5 / 6
2. Picture A / 0 / 1 / 2 / 3 / 4 / 5 / 6
3. Picture C / 0 / 1 / 2 / 3 / 4 / 5 / 6
4. Picture D / 0 / 1 / 2 / 3 / 4 / 5
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4, 5, 6 · edges: 0—1, 0—3, 1—2, 2—3, 4—5
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4, 5, 6 · edges: 0—1, 0—3, 1—2, 2—3
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5, 6 · edges: 0→1, 0→3, 1→2, 2→3, 4→5
    feedback: This turns a two-way relation into a one-way arrow. (misconception: make-undirected-edge-directed)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0—1, 0—3, 1—2, 2—3, 4—5
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`two-tied-pairs`, facet "largest component")
Raw input shown:
```
worked=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest group size is returned?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Both pairs have size 2; the isolated student has size 1.
- ❌ [bug] "4"
    feedback: This adds two disconnected groups just because they tie. (misconception: sum-tied-components)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
"Why" shown after success: Both pairs have size 2; the isolated student has size 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`concept-node`, facet "student identity")
Raw input shown:
```
worked = [[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each node mean in the study graph?**
Choices as displayed (top to bottom):
1. A / One node for each finished group of students.
2. B / One node for every 1 entry in the matrix.
3. C / One student for each row index 0 through n−1.
4. D / Only students whose row contains a 1 outside the diagonal.
Answer key + feedback per choice (data):
- ✅ CORRECT [students] "One student for each row index `0` through `n−1`."
    feedback: Correct. Even an isolated student's diagonal 1 represents that student node.
- ❌ [study-groups] "One node for each finished group of students."
    feedback: Groups are connected components discovered from student nodes. (misconception: component-as-node)
- ❌ [worked-pairs] "One node for every `1` entry in the matrix."
    feedback: Matrix entries describe relationships; row and column indexes identify the student endpoints. (misconception: matrix-cell-as-node)
- ❌ [nonisolated] "Only students whose row contains a 1 outside the diagonal."
    feedback: A student who worked only with themself is still a one-person study group. (misconception: omit-isolated)
"Why" shown after success: Correct. Even an isolated student's diagonal 1 represents that student node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`concept-edge`, facet "two-way teamwork")
Raw input shown:
```
worked = [[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which matrix entries create edges between different students?**
Choices as displayed (top to bottom):
1. A / worked[i][j] = 0 creates an edge because they are available to study together.
2. B / Each diagonal 1 must be drawn as a self-loop and counted as another group member.
3. C / Connect i and j when they have worked with any common third student.
4. D / For different i and j, worked[i][j] = 1 creates the undirected edge i—j.
Answer key + feedback per choice (data):
- ✅ CORRECT [worked-one] "For different i and j, `worked[i][j] = 1` creates the undirected edge i—j."
    feedback: Correct. Working together is mutual, and the diagonal self-entry adds no new neighbor.
- ❌ [zero-edge] "`worked[i][j] = 0` creates an edge because they are available to study together."
    feedback: Zero means no recorded work together, so no connection exists. (misconception: invert-matrix)
- ❌ [diagonal-loop] "Each diagonal 1 must be drawn as a self-loop and counted as another group member."
    feedback: The diagonal only says a student relates to themself; it does not add a new person or size. (misconception: count-self-loop)
- ❌ [shared-partner] "Connect i and j when they have worked with any common third student."
    feedback: A common partner gives a two-edge path, not a direct worked-together edge. (misconception: common-neighbor-edge)
"Why" shown after success: Correct. Working together is mutual, and the diagonal self-entry adds no new neighbor.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`chain`, facet "two-way teamwork")
Raw input shown:
```
worked=[[1,1,0,0],[1,1,1,0],[0,1,1,1],[0,0,1,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest group size is returned?**
Choices as displayed (top to bottom):
1. 4
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. The whole four-student chain is one component.
- ❌ [bug] "2"
    feedback: This counts only a student and direct teammates. (misconception: direct-neighbors-only)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1, 1—2, 2—3
"Why" shown after success: The whole four-student chain is one component.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "largest component")
Raw input shown:
```
worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What largest study-group size is returned from this worked-together matrix?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 3
3. C / 2
4. D / 7
Answer key + feedback per choice (data):
- ✅ CORRECT [four] "4"
    feedback: Correct: students 0,1,2,3 form the largest group.
- ❌ [three] "3"
    feedback: This marks the start visited but forgets to include it in the component size. (misconception: exclude-component-start)
- ❌ [two] "2"
    feedback: This returns the final non-isolated component rather than the maximum. (misconception: overwrite-maximum)
- ❌ [seven] "7"
    feedback: This counts every student, including disconnected groups. (misconception: count-all-nodes)
"Why" shown after success: Correct: students 0,1,2,3 form the largest group.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`all-isolated`, facet "student identity")
Raw input shown:
```
worked=[[1,0,0],[0,1,0],[0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What largest group size is returned?**
Choices as displayed (top to bottom):
1. 0
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Each row still represents one student and one-person group.
- ❌ [bug] "0"
    feedback: This creates nodes only for off-diagonal 1s and drops isolated students. (misconception: omit-isolated-students)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2" · edges: none
"Why" shown after success: Each row still represents one student and one-person group.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-counterexample`, facet "largest component")
Raw input shown:
```
worked=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What largest study-group size is returned from this worked-together matrix?**
Choices as displayed (top to bottom):
1. A / 4
2. B / 2
3. C / 1
4. D / 5
Answer key + feedback per choice (data):
- ✅ CORRECT [two] "2"
    feedback: Correct. The two pairs tie for largest; the isolated student has size 1.
- ❌ [four] "4"
    feedback: This adds the sizes of two disconnected pairs. (misconception: sum-components)
- ❌ [one] "1"
    feedback: This overwrites the maximum when the final isolated student is scanned. (misconception: overwrite-with-last-component)
- ❌ [five] "5"
    feedback: This treats all declared students as one group. (misconception: ignore-connectivity)
"Why" shown after success: Correct. The two pairs tie for largest; the isolated student has size 1.
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
worked=[[1,1,0],[1,1,0],[0,0,1]]
```
Remedial question: **What largest group size is returned?** · choices shown: 2 | 3
Remedial answer key: ✅ "2" — Correct. Students 0 and 1 form a pair; student 2 is alone.; ❌ "3" — This treats diagonal 1s as links joining every row.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [study-groups]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One student for each row index 0 through n−1.
Your choice: Groups are connected components discovered from student nodes.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
worked=[[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]
```
Remedial question: **What largest group size is returned?** · choices shown: 1 | 2
Remedial answer key: ✅ "2" — Correct. The first pair remains the largest group.; ❌ "1" — This overwrites the earlier maximum while scanning later isolated rows.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [zero-edge]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
For different i and j, worked[i][j] = 1 creates the undirected edge i—j.
Your choice: Zero means no recorded work together, so no connection exists.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
worked=[[1,1,0],[1,1,1],[0,1,1]]
```
Remedial question: **How many students are in the one group?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. A path through 1 joins all three students.; ❌ "2" — This stops after direct neighbors and misses the chain through student 1.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
4
Your choice: This marks the start visited but forgets to include it in the component size.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
worked=[[1,1,1,0,0],[1,1,1,0,0],[1,1,1,0,0],[0,0,0,1,1],[0,0,0,1,1]]
```
Remedial question: **What largest group size is returned?** · choices shown: 3 | 5
Remedial answer key: ✅ "3" — Correct. The triangle has size 3 and the pair has size 2.; ❌ "5" — This sums disconnected component sizes.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 1—2, 3—4
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
2
Your choice: This adds the sizes of two disconnected pairs.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
worked=[[1]]
```
Remedial question: **What largest group size is returned?** · choices shown: 0 | 1
Remedial answer key: ✅ "1" — Correct. The lone student is a valid group of size 1.; ❌ "0" — This ignores a row unless it has an off-diagonal teammate.
Remedial required graph (hidden): UNDIRECTED · nodes: "0" · edges: none
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Teamwork as an arrow"; authored goal, NOT shown to student: "Use a matrix link whose written direction would wrongly block a teammate.")
Everything the student sees (text):
```
C
Catherine's broken search

Catherine turns every two-way connection into a one-way arrow.

Your main goal: Expose Catherine's mistake. Draw two graphs: first the correct graph, then Catherine's graph using the mistake.

CHOOSE THE FIRST STUDENT IN THE GROUP
first student in the group
OUTPUT
CORRECT OUTPUT
CATHERINE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first student in the group
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
2 · Catherine's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STUDENT IN THE GROUP / first student in the group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | CATHERINE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4", "5", "6"): accepted
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
CATHERINE'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "More than one teammate"; authored goal, NOT shown to student: "Give one student separate teamwork branches that belong to the same group.")
Everything the student sees (text):
```
R
Ricardo's broken search

Ricardo follows only the first available branch and never comes back.

Your main goal: Expose Ricardo's mistake. Draw two graphs: first the correct graph, then Ricardo's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST STUDENT IN THE GROUP
first student in the group
OUTPUT
CORRECT OUTPUT
RICARDO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first student in the group
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
2 · Ricardo's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STUDENT IN THE GROUP / first student in the group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | RICARDO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1, 0—2, 2—3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1, 0—2, 2—3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
RICARDO'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `skip-leaf-edges` (authored level "Solo-looking teammate"; authored goal, NOT shown to student: "Make a degree-one student enlarge the biggest study group.")
Everything the student sees (text):
```
L
Liliana's broken search

Liliana drops every connection touching a degree-one node.

Your main goal: Expose Liliana's mistake. Draw two graphs: first the correct graph, then Liliana's graph using the mistake.

CHOOSE THE FIRST STUDENT IN THE GROUP
first student in the group
OUTPUT
CORRECT OUTPUT
LILIANA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first student in the group
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
2 · Liliana's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST STUDENT IN THE GROUP / first student in the group", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LILIANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1, 1—2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: none
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
LILIANA'S OUTPUT
[0]
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
worked=[[1,1,0],[1,1,0],[0,0,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each finished group of students.”"
    feedback if wrong: Groups are connected components discovered from student nodes. Correct node rule: One student for each row index `0` through `n−1`.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0 has exactly 0 direct neighbors."
    feedback if wrong: 0 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Groups are connected components discovered from student nodes. Correct node rule: One student for each row index
0
through
n−1
.
×
The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
×
0 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for every `1` entry in the matrix.”"
    feedback if wrong: Matrix entries describe relationships; row and column indexes identify the student endpoints. Correct node rule: One student for each row index `0` through `n−1`.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
×
1 has 1 direct neighbor.
×
Matrix entries describe relationships; row and column indexes identify the student endpoints. Correct node rule: One student for each row index
0
through
n−1
.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 0 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “Only students whose row contains a 1 outside the diagonal.”"
    feedback if wrong: A student who worked only with themself is still a one-person study group. Correct node rule: One student for each row index `0` through `n−1`.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0—1 edge."
    feedback if wrong: The mini-example lists 0—1 as one direct edge. A direct edge is different from a longer reachable route.
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
worked=[[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for every `1` entry in the matrix.”"
    feedback if wrong: Matrix entries describe relationships; row and column indexes identify the student endpoints. Correct node rule: One student for each row index `0` through `n−1`.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0—1 as one direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
worked=[[1,1,0],[1,1,1],[0,1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1, 1—2
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "2 can reach 0 through 1, but the graph still has no direct 2—0 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 direct neighbor."
    feedback if wrong: 0 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each finished group of students.”"
    feedback if wrong: Groups are connected components discovered from student nodes. Correct node rule: One student for each row index `0` through `n−1`.
Result: PASSED

### S3 Q4
Raw input shown:
```
worked=[[1,1,1,0,0],[1,1,1,0,0],[1,1,1,0,0],[0,0,0,1,1],[0,0,0,1,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 0—2, 1—2, 3—4
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only students whose row contains a 1 outside the diagonal.”"
    feedback if wrong: A student who worked only with themself is still a one-person study group. Correct node rule: One student for each row index `0` through `n−1`.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1—2 edge."
    feedback if wrong: The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "4 has exactly 2 direct neighbors."
    feedback if wrong: 4 has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
worked=[[1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for every `1` entry in the matrix.”"
    feedback if wrong: Matrix entries describe relationships; row and column indexes identify the student endpoints. Correct node rule: One student for each row index `0` through `n−1`.
- [YES is correct] (direct-vs-reach) "0 can reach itself without using an edge, but the graph still has no direct 0—0 edge."
    feedback if wrong: Correct. A zero-step path makes 0 reachable from itself; it does not invent a self-edge.
- [YES is correct] (local-degree) "0 has exactly 0 direct neighbors."
    feedback if wrong: 0 has 0 direct neighbors.
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

### S4 case 1 — `authored-deep-case` · bug: Counts the diagonal as another student
Input shown:
```
REAL PROBLEM INPUT
worked: [[1, 1], [1, 1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const visited = new Set();
  let largest = 0;
  for (let start = 0; start < input.worked.length; start++) {
    if (visited.has(start)) {
      continue;
    }
    let size = input.worked[start][start];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const student = stack.pop();
      size++;
      for (let next = 0; next < input.worked.length; next++) {
        if (
          next !== student &&
          input.worked[student][next] === 1 &&
          !visited.has(next)
        ) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    largest = Math.max(largest, size);
  }
  return largest;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1" · edges: 0—1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "largest group size" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student.
- B The code misses teammates connected through longer chains, which changes how the shown graph is evaluated.
- C The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [diagonal-double-count] "Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student." — feedback: Correct. The two-person component cannot have size 3.
- ❌ [direct-friends-only] "The code misses teammates connected through longer chains, which changes how the shown graph is evaluated." — feedback: The DFS follows every unseen teammate, including teammates reached through longer chains.
- ❌ [matrix-directed] "The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value." — feedback: It reads every value in every row.
Graph proof shown in feedback: code rule "The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1." → changed graph "There are exactly two student nodes joined by one edge; diagonal entries add no nodes." → boundary "The self-entry is 1 as guaranteed by the input." → returned value "It reports an impossible group of 3 instead of the two-node component."
Output-format probes: ❌ quoted number → `"3"`; ❌ trailing period → `3.`
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
About your diagnosis: The DFS follows every unseen teammate, including teammates reached through longer chains.
Code rule: The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. → Changed graph: There are exactly two student nodes joined by one edge; diagonal entries add no nodes. → Reachable boundary: The self-entry is 1 as guaranteed by the input.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts the diagonal as another student
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. → Changed graph: There are exactly two student nodes joined by one edge; diagonal entries add no nodes. → Reachable boundary: The self-entry is 1 as guaranteed by the input. → Returned value: It reports an impossible group of 3 instead of the two-node component.
```

### S4 case 2 — `ring-and-pair` · bug: Counts the diagonal as another student
Input shown:
```
REAL PROBLEM INPUT
worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const visited = new Set();
  let largest = 0;
  for (let start = 0; start < input.worked.length; start++) {
    if (visited.has(start)) {
      continue;
    }
    let size = input.worked[start][start];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const student = stack.pop();
      size++;
      for (let next = 0; next < input.worked.length; next++) {
        if (
          next !== student &&
          input.worked[student][next] === 1 &&
          !visited.has(next)
        ) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    largest = Math.max(largest, size);
  }
  return largest;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5", "6" · edges: 0—1, 0—3, 1—2, 2—3, 4—5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "largest group size" · expected buggy output `5` · real correct output `4`
Diagnosis choices as displayed:
- A The code misses teammates connected through longer chains, which changes how the shown graph is evaluated.
- B Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student.
- C The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [diagonal-double-count] "Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student." — feedback: Exactly. The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. The shown code returns 5; the real problem returns 4.
- ❌ [direct-friends-only] "The code misses teammates connected through longer chains, which changes how the shown graph is evaluated." — feedback: The DFS follows every unseen teammate, including teammates reached through longer chains.
- ❌ [matrix-directed] "The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value." — feedback: It reads every value in every row.
Graph proof shown in feedback: code rule "The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1." → changed graph "Nodes are 0, 1, 2, 3, 4, 5, 6; direct edges are 0—1, 0—3, 1—2, 2—3, 4—5." → boundary "self-entry-adds-member" → returned value "The shown code returns 5; the real problem returns 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts the diagonal as another student
INCORRECT OUTPUT
5
CORRECT OUTPUT
4
Code rule: The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. → Changed graph: Nodes are 0, 1, 2, 3, 4, 5, 6; direct edges are 0—1, 0—3, 1—2, 2—3, 4—5. → Reachable boundary: self-entry-adds-member → Returned value: The shown code returns 5; the real problem returns 4.
```

### S4 case 3 — `two-tied-pairs` · bug: Counts the diagonal as another student
Input shown:
```
REAL PROBLEM INPUT
worked=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const visited = new Set();
  let largest = 0;
  for (let start = 0; start < input.worked.length; start++) {
    if (visited.has(start)) {
      continue;
    }
    let size = input.worked[start][start];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const student = stack.pop();
      size++;
      for (let next = 0; next < input.worked.length; next++) {
        if (
          next !== student &&
          input.worked[student][next] === 1 &&
          !visited.has(next)
        ) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    largest = Math.max(largest, size);
  }
  return largest;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1, 2—3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "largest group size" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A The code misses teammates connected through longer chains, which changes how the shown graph is evaluated.
- B The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value.
- C Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student.
Diagnosis answer key + feedback:
- ✅ [diagonal-double-count] "Each row's diagonal 1 already represents the student, then the code adds another 1 for that same student." — feedback: Exactly. The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. The shown code returns 3; the real problem returns 2.
- ❌ [direct-friends-only] "The code misses teammates connected through longer chains, which changes how the shown graph is evaluated." — feedback: The DFS follows every unseen teammate, including teammates reached through longer chains.
- ❌ [matrix-directed] "The code reads only one half of the symmetric matrix and loses an edge, changing this input's returned value." — feedback: It reads every value in every row.
Graph proof shown in feedback: code rule "The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1." → changed graph "Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 2—3." → boundary "self-entry-adds-member" → returned value "The shown code returns 3; the real problem returns 2."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Counts the diagonal as another student
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: The DFS correctly counts every reached student, but it seeds each component size with the start student's diagonal 1. → Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—1, 2—3. → Reachable boundary: self-entry-adds-member → Returned value: The shown code returns 3; the real problem returns 2.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```