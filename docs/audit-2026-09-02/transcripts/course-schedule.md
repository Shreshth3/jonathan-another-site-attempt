# Course Schedule (`course-schedule`) — original, directed-graph

## Problem statement (Description tab)

You are given `numCourses` courses, labeled from `0` to `numCourses - 1`, and an array `prerequisites` where each entry `prerequisites[i] = [a, b]` means: **before you can take course `a`, you must first take course `b`**.

Return `true` if it is possible to finish every course, and `false` otherwise.

### Examples
- Example 1: input `numCourses = 2, prerequisites = [[1,0]]` → output `true`. There are 2 courses. To take course 1 you must first take course 0. So take course 0, then course 1. Everything can be finished.
- Example 2: input `numCourses = 2, prerequisites = [[1,0],[0,1]]` → output `false`. Course 1 requires course 0, but course 0 also requires course 1. Neither can be taken first, so it is impossible to finish.
- Example 3: input `numCourses = 3, prerequisites = [[1,0],[2,1]]` → output `true`. Take course 0, then course 1, then course 2.

### Graph rules (authored)
- Nodes: Courses 0 through 5, even if a course appears in no prerequisite pair.
- Edges: 1→3, because course 1 must happen before it unlocks course 3.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-chain`, facet "dependency direction")
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0],[2,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. The arrows form a chain with no way back to an active course.
- ❌ [near-miss] "false"
    feedback: That result follows the treat dependency as cycle bug, not the exact picture. (misconception: treat-dependency-as-cycle)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
"Why" shown after success: The arrows form a chain with no way back to an active course.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact prerequisites")
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0],[2,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2
2. Picture A / 0 / 1 / 2
3. Picture C / 0 / 1 / 2
4. Picture D / 0 / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 1→0, 2→1
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1 · edges: 0→1
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`core-rule`, facet "course identity")
Raw input shown:
```
For `numCourses = 6`, which nodes belong in the prerequisite graph?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For numCourses = 6, which nodes belong in the prerequisite graph?**
Choices as displayed (top to bottom):
1. A / Only courses that appear somewhere in prerequisites.
2. B / Each prerequisite pair [a,b] should be one node.
3. C / Courses 0 through 5, even if a course appears in no prerequisite pair.
4. D / Only courses that are part of a circular prerequisite chain.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-courses] "Courses 0 through 5, even if a course appears in no prerequisite pair."
    feedback: Correct. `numCourses` defines every course node.
- ❌ [pair-courses] "Only courses that appear somewhere in `prerequisites`."
    feedback: An isolated course still exists and can be taken; it is simply disconnected. (misconception: drop-isolated-course)
- ❌ [pairs] "Each prerequisite pair `[a,b]` should be one node."
    feedback: The pair describes a dependency between two course nodes; it is not itself a course. (misconception: pair-as-node)
- ❌ [blocked] "Only courses that are part of a circular prerequisite chain."
    feedback: Cycles are what the search must detect. We cannot know them before building all course nodes. (misconception: only-cycle-nodes)
"Why" shown after success: Correct. `numCourses` defines every course node.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-two-cycle`, facet "cycle detection")
Raw input shown:
```
numCourses = 2, prerequisites = [[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Each course depends on the other, so neither can be completed first.
- ❌ [near-miss] "true"
    feedback: That result follows the mark visited too early bug, not the exact picture. (misconception: mark-visited-too-early)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1, 1→0
"Why" shown after success: Each course depends on the other, so neither can be completed first.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "dependency direction")
Raw input shown:
```
What arrow should the prerequisite pair `[3,1]` create?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What arrow should the prerequisite pair [3,1] create?**
Choices as displayed (top to bottom):
1. A / 3→1, because 3 is written first in the pair.
2. B / A two-way line 1—3, because both courses are related.
3. C / 1→3, because course 1 must happen before it unlocks course 3.
4. D / No arrow; put 1 and 3 on the same level because they form one pair.
Answer key + feedback per choice (data):
- ✅ CORRECT [one-to-three] "1→3, because course 1 must happen before it unlocks course 3."
    feedback: Correct. The pair is written `[course, prerequisite]`.
- ❌ [three-to-one] "3→1, because 3 is written first in the pair."
    feedback: That follows array order instead of meaning. The prerequisite points toward the course it unlocks. (misconception: reverse-prerequisite-arrow)
- ❌ [two-way] "A two-way line 1—3, because both courses are related."
    feedback: Prerequisites are one-way. Taking 3 does not unlock its own prerequisite 1. (misconception: make-prerequisite-undirected)
- ❌ [same-level] "No arrow; put 1 and 3 on the same level because they form one pair."
    feedback: The pair explicitly creates a dependency arrow. Omitting it can hide a cycle. (misconception: pair-as-level)
"Why" shown after success: Correct. The pair is written `[course, prerequisite]`.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-isolated`, facet "course identity")
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Course 2 still exists, but it introduces no cycle.
- ❌ [near-miss] "false"
    feedback: That result follows the drop isolated course bug, not the exact picture. (misconception: drop-isolated-course)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 0→1
"Why" shown after success: Course 2 still exists, but it introduces no cycle.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "cycle detection")
Raw input shown:
```
numCourses = 2, prerequisites = [[1,0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / course 0 must wait for course 1
2. B / any prerequisite blocks graduation
3. C / take 1, then 0
4. D / take 0, then 1
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "take 0, then 1"
    feedback: Correct. The single arrow has no cycle.
- ❌ [false-reverse] "course 0 must wait for course 1"
    feedback: This reads `[1,0]` backward. (misconception: reverse-pair)
- ❌ [false-any-edge] "any prerequisite blocks graduation"
    feedback: A prerequisite is fine when it can be completed first. (misconception: edge-means-impossible)
- ❌ [true-any-order] "take 1, then 0"
    feedback: Course 1 cannot be taken before its prerequisite 0. (misconception: ignore-order)
"Why" shown after success: Correct. The single arrow has no cycle.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "cycle detection")
Raw input shown:
```
numCourses = 2, prerequisites = [[1,0],[0,1]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / simply start with course 0
2. B / simply start with course 1
3. C / 0 and 1 wait on each other
4. D / take both at the same time
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "0 and 1 wait on each other"
    feedback: Correct. The two arrows form a cycle.
- ❌ [true-zero-first] "simply start with course 0"
    feedback: Course 0 itself requires course 1. (misconception: ignore-one-prerequisite)
- ❌ [true-one-first] "simply start with course 1"
    feedback: Course 1 itself requires course 0. (misconception: ignore-other-prerequisite)
- ❌ [true-parallel] "take both at the same time"
    feedback: The rules require prerequisites to be finished first. (misconception: allow-simultaneous-cycle)
"Why" shown after success: Correct. The two arrows form a cycle.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-self-loop`, facet "cycle detection")
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0],[2,1],[0,2]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. The arrows return from course 2 to course 0, closing a cycle.
- ❌ [near-miss] "true"
    feedback: That result follows the mark visited too early bug, not the exact picture. (misconception: mark-visited-too-early)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2, 2→0
"Why" shown after success: The arrows return from course 2 to course 0, closing a cycle.
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
numCourses = 3, prerequisites = [[1,0],[2,0]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. A fork has no return arrow to course 0.; ❌ "false" — That result follows the confuse branch with cycle bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [pair-courses]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Courses 0 through 5, even if a course appears in no prerequisite pair.
Your choice: An isolated course still exists and can be taken; it is simply disconnected.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
numCourses = 2, prerequisites = []
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. Courses with no prerequisites can both be completed.; ❌ "false" — That result follows the require prerequisite edge bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: none
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [three-to-one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1→3, because course 1 must happen before it unlocks course 3.
Your choice: That follows array order instead of meaning. The prerequisite points toward the course it unlocks.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
numCourses = 2, prerequisites = [[1,0]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. The pair means 0 must come before 1; either orientation is acyclic here, but the exact picture is 0→1.; ❌ "false" — That result follows the reverse pair semantics bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 0→1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [false-reverse]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
take 0, then 1
Your choice: This reads [1,0] backward.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
numCourses = 4, prerequisites = [[1,0],[2,1],[0,2],[3,2]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. The 0→1→2→0 cycle remains even though course 3 is a harmless branch.; ❌ "true" — That result follows the stop after acyclic branch bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→0, 2→3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [true-zero-first]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0 and 1 wait on each other
Your choice: Course 0 itself requires course 1.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
numCourses = 3, prerequisites = [[1,0],[2,0],[2,1]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Two paths reaching course 2 do not form a cycle because no arrow returns to an active ancestor.; ❌ "false" — That result follows the treat shared descendant as cycle bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Prerequisite runs backward"; authored goal, NOT shown to student: "Choose an arrow where walking backward falsely unlocks a prerequisite.")
Everything the student sees (text):
```
N
Noor's broken search

Noor forgets that the listed connections have a direction.

Your main goal: Expose Noor's mistake. Draw two graphs: first the correct graph, then Noor's graph using the mistake.

CHOOSE THE COURSE TO INSPECT
course to inspect
OUTPUT
CORRECT OUTPUT
NOOR’S OUTPUT
Drawing 1 of 2: Correct graph · Choose course to inspect
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
2 · Noor's graph
Check my graph
→
```
Start field: label "CHOOSE THE COURSE TO INSPECT / course to inspect", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | NOOR’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0`; ❌ curly braces → `{0}`; ❌ quoted numbers/strings → `["0"]`; ✅ spaces inside brackets → `[ 0 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
NOOR'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong course opened"; authored goal, NOT shown to student: "Use course 0 as the chosen course, but make the mistaken search begin at course 1; give them different futures.")
Everything the student sees (text):
```
J
Jasper's broken search

Jasper runs the search from a different course to inspect.

Your main goal: Expose Jasper's mistake. Draw two graphs: first the correct graph, then Jasper's graph using the mistake.

CHOOSE THE COURSE TO INSPECT
course to inspect
OUTPUT
CORRECT OUTPUT
JASPER’S OUTPUT
Drawing 1 of 2: Correct graph · Choose course to inspect
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
2 · Jasper's graph
Check my graph
→
```
Start field: label "CHOOSE THE COURSE TO INSPECT / course to inspect", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JASPER’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "1" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 1→2 · start 0
Grader's expected answers: correct output `[0]` · character's output `[1,2]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 1→2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
JASPER'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "One elective only"; authored goal, NOT shown to student: "Let one course unlock two branches so both must be explored.")
Everything the student sees (text):
```
A
Amara's broken search

Amara stops the whole search when its first branch ends.

Your main goal: Expose Amara's mistake. Draw two graphs: first the correct graph, then Amara's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE COURSE TO INSPECT
course to inspect
OUTPUT
CORRECT OUTPUT
AMARA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose course to inspect
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
2 · Amara's graph
Check my graph
→
```
Start field: label "CHOOSE THE COURSE TO INSPECT / course to inspect", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | AMARA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
AMARA'S OUTPUT
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
numCourses = 2, prerequisites = [[1,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 0→1
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only courses that are part of a circular prerequisite chain.”"
    feedback if wrong: Cycles are what the search must detect. We cannot know them before building all course nodes. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→1 as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
0 has 1 outgoing direct edge.
×
Cycles are what the search must detect. We cannot know them before building all course nodes. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
×
Correct. The mini-example lists 0→1 as one direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0→1 edge."
    feedback if wrong: The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 1 outgoing direct edge."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only courses that appear somewhere in `prerequisites`.”"
    feedback if wrong: An isolated course still exists and can be taken; it is simply disconnected. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
×
1 has 0 outgoing direct edges.
×
An isolated course still exists and can be taken; it is simply disconnected. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0→1 edge."
    feedback if wrong: The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0 has exactly 2 outgoing direct edges."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Each prerequisite pair `[a,b]` should be one node.”"
    feedback if wrong: The pair describes a dependency between two course nodes; it is not itself a course. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
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
numCourses = 4, prerequisites = [[1,0],[2,1],[0,2],[3,2]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→0, 2→3
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→0, so it should also contain a direct 1→0 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only courses that appear somewhere in `prerequisites`.”"
    feedback if wrong: An isolated course still exists and can be taken; it is simply disconnected. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
Result: PASSED

### S3 Q3
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0],[2,0],[2,1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only courses that are part of a circular prerequisite chain.”"
    feedback if wrong: Cycles are what the search must detect. We cannot know them before building all course nodes. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
numCourses = 3, prerequisites = [[1,0],[2,0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each prerequisite pair `[a,b]` should be one node.”"
    feedback if wrong: The pair describes a dependency between two course nodes; it is not itself a course. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
- [YES is correct] (direct-vs-reach) "0 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→2 as one direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
numCourses = 2, prerequisites = []
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: none
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only courses that appear somewhere in `prerequisites`.”"
    feedback if wrong: An isolated course still exists and can be taken; it is simply disconnected. Correct node rule: One node for every course ID from 0 through numCourses−1, including isolated courses.
- [YES is correct] (direct-vs-reach) "There is no direct edge between 0 and 1; merely naming both nodes does not make them reachable."
    feedback if wrong: Correct. Node membership alone creates neither a direct edge nor a route.
- [YES is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 0 outgoing direct edges.
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

### S4 case 1 — `authored-deep-case` · bug: A merge is mistaken for a cycle
Input shown:
```
REAL PROBLEM INPUT
numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canFinish(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []);
  for (const [course, prerequisite] of prerequisites) {
    next[prerequisite].push(course);
  }
  const visited = new Set();
  function search(course) {
    if (visited.has(course)) {
      return false;
    }
    visited.add(course);
    for (const after of next[course]) {
      if (!search(after)) {
        return false;
      }
    }
    return true;
  }
  for (let column = 0; column < numCourses; column++) {
    if (!search(column)) {
      return false;
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "course 0", "course 1", "course 2", "course 3" · edges: course 0→course 1, course 0→course 2, course 1→course 3, course 2→course 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every course can be finished" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A It confuses a node seen on an older branch with a node on the current path.
- B The prerequisite arrows are reversed, which changes the returned value here.
- C The search should begin only at course 0, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [visited-vs-active] "It confuses a node seen on an older branch with a node on the current path." — feedback: Correct. Course 3 is a harmless merge. Only returning to a course still on the current DFS path proves a cycle.
- ❌ [wrong-edge-direction] "The prerequisite arrows are reversed, which changes the returned value here." — feedback: No. 0→1 correctly means course 0 must happen before course 1.
- ❌ [needs-one-start] "The search should begin only at course 0, changing this input's returned value." — feedback: No. A cycle could exist in a disconnected group, so all courses must be checked.
Graph proof shown in feedback: code rule "Any second arrival at a globally visited node is labeled a cycle." → changed graph "The arrows form a diamond 0→1→3 and 0→2→3, with no route back to an ancestor." → boundary "Two acyclic branches merge at course 3." → returned value "The second branch reaches course 3 and makes the code return false, although a valid course order exists."
Output-format probes: ❌ Capitalized boolean → `False`; ❌ trailing period → `false.`
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
About your diagnosis: No. 0→1 correctly means course 0 must happen before course 1.
Code rule: Any second arrival at a globally visited node is labeled a cycle. → Changed graph: The arrows form a diamond 0→1→3 and 0→2→3, with no route back to an ancestor. → Reachable boundary: Two acyclic branches merge at course 3.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A merge is mistaken for a cycle
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Any second arrival at a globally visited node is labeled a cycle. → Changed graph: The arrows form a diamond 0→1→3 and 0→2→3, with no route back to an ancestor. → Reachable boundary: Two acyclic branches merge at course 3. → Returned value: The second branch reaches course 3 and makes the code return false, although a valid course order exists.
```

### S4 case 2 — `build-chain` · bug: A merge is mistaken for a cycle
Input shown:
```
REAL PROBLEM INPUT
numCourses = 3, prerequisites = [[1,0],[2,1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canFinish(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []);
  for (const [course, prerequisite] of prerequisites) {
    next[prerequisite].push(course);
  }
  const visited = new Set();
  function search(course) {
    if (visited.has(course)) {
      return false;
    }
    visited.add(course);
    for (const after of next[course]) {
      if (!search(after)) {
        return false;
      }
    }
    return true;
  }
  for (let column = 0; column < numCourses; column++) {
    if (!search(column)) {
      return false;
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every course can be finished" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The prerequisite arrows are reversed, which changes the returned value here.
- B It confuses a node seen on an older branch with a node on the current path.
- C The search should begin only at course 0, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [visited-vs-active] "It confuses a node seen on an older branch with a node on the current path." — feedback: Correct. The acyclic arrows 0→1→2 are fully visited from course 0; the later outer-loop start at already-finished course 1 is falsely called a cycle. Therefore the shown code returns false, while the real problem returns true.
- ❌ [wrong-edge-direction] "The prerequisite arrows are reversed, which changes the returned value here." — feedback: No. 0→1 correctly means course 0 must happen before course 1.
- ❌ [needs-one-start] "The search should begin only at course 0, changing this input's returned value." — feedback: No. A cycle could exist in a disconnected group, so all courses must be checked.
Graph proof shown in feedback: code rule "Any second arrival at a globally visited node is labeled a cycle." → changed graph "Nodes: 0, 1, 2. Direct arrows: 0→1; 1→2." → boundary "The acyclic arrows 0→1→2 are fully visited from course 0; the later outer-loop start at already-finished course 1 is falsely called a cycle." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A merge is mistaken for a cycle
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Any second arrival at a globally visited node is labeled a cycle. → Changed graph: Nodes: 0, 1, 2. Direct arrows: 0→1; 1→2. → Reachable boundary: The acyclic arrows 0→1→2 are fully visited from course 0; the later outer-loop start at already-finished course 1 is falsely called a cycle. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

### S4 case 3 — `build-isolated` · bug: A merge is mistaken for a cycle
Input shown:
```
REAL PROBLEM INPUT
numCourses = 3, prerequisites = [[1,0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canFinish(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []);
  for (const [course, prerequisite] of prerequisites) {
    next[prerequisite].push(course);
  }
  const visited = new Set();
  function search(course) {
    if (visited.has(course)) {
      return false;
    }
    visited.add(course);
    for (const after of next[course]) {
      if (!search(after)) {
        return false;
      }
    }
    return true;
  }
  for (let column = 0; column < numCourses; column++) {
    if (!search(column)) {
      return false;
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every course can be finished" · expected buggy output `false` · real correct output `true`
Diagnosis choices as displayed:
- A The prerequisite arrows are reversed, which changes the returned value here.
- B The search should begin only at course 0, changing this input's returned value.
- C It confuses a node seen on an older branch with a node on the current path.
Diagnosis answer key + feedback:
- ✅ [visited-vs-active] "It confuses a node seen on an older branch with a node on the current path." — feedback: Correct. After acyclic edge 0→1 is finished, the outer loop revisits course 1 and mistakes that completed node for an active-path cycle; isolated course 2 is harmless. Therefore the shown code returns false, while the real problem returns true.
- ❌ [wrong-edge-direction] "The prerequisite arrows are reversed, which changes the returned value here." — feedback: No. 0→1 correctly means course 0 must happen before course 1.
- ❌ [needs-one-start] "The search should begin only at course 0, changing this input's returned value." — feedback: No. A cycle could exist in a disconnected group, so all courses must be checked.
Graph proof shown in feedback: code rule "Any second arrival at a globally visited node is labeled a cycle." → changed graph "Nodes: 0, 1, 2. Direct arrows: 0→1." → boundary "After acyclic edge 0→1 is finished, the outer loop revisits course 1 and mistakes that completed node for an active-path cycle; isolated course 2 is harmless." → returned value "The shown code returns false; the source-repo reference solution returns true."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A merge is mistaken for a cycle
INCORRECT OUTPUT
false
CORRECT OUTPUT
true
Code rule: Any second arrival at a globally visited node is labeled a cycle. → Changed graph: Nodes: 0, 1, 2. Direct arrows: 0→1. → Reachable boundary: After acyclic edge 0→1 is finished, the outer loop revisits course 1 and mistakes that completed node for an active-path cycle; isolated course 2 is harmless. → Returned value: The shown code returns false; the source-repo reference solution returns true.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```