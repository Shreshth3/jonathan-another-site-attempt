# Possible Bipartition (`possible-bipartition`) — original, undirected-graph

## Problem statement (Description tab)

You are given `n` people, labeled from `1` to `n`, and you want to split all of them into **two groups** (the groups can be any size).

You are also given an array `dislikes`, where each entry `dislikes[i] = [a, b]` means person `a` and person `b` dislike each other and are **not allowed to be in the same group**.

Return `true` if it is possible to split everyone into two groups this way, and `false` otherwise.

### Examples
- Example 1: input `n = 4, dislikes = [[1,2],[1,3],[2,4]]` → output `true`. Put people 1 and 4 in the first group, and people 2 and 3 in the second group. No two people in the same group dislike each other.
- Example 2: input `n = 3, dislikes = [[1,2],[1,3],[2,3]]` → output `false`. All three people dislike each other. With only two groups, some two of them must end up together, so no valid split exists.
- Example 3: input `n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]` → output `false`. The five people form a cycle of dislikes with an odd length. Going around the cycle alternating groups, person 5 would need to be in both groups at once — impossible.

### Graph rules (authored)
- Nodes: People 1, 2, 3, 4, and 5, including anyone absent from `dislikes`.
- Edges: One undirected edge 2—4, requiring people 2 and 4 to receive opposite group colors.
- Node-name format shown in Step 1/3: Use each node's 1-based number only. Example: `2`. (pattern `^[1-9]\d*$`)
- Step 2 node-label rule: `contiguous-one` — Use numeric IDs 1, 2, 3, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-possible`, facet "two-group consistency")
Raw input shown:
```
n = 4, dislikes = [[1,2],[1,3],[2,4]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. A valid split is {1,4} and {2,3}; group sizes need not be prescribed.
- ❌ [near-miss] "false"
    feedback: That result follows the require equal group sizes bug, not the exact picture. (misconception: require-equal-group-sizes)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2, 1—3, 2—4
"Why" shown after success: A valid split is {1,4} and {2,3}; group sizes need not be prescribed.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-triangle`, facet "two-group consistency")
Raw input shown:
```
n = 3, dislikes = [[1,2],[1,3],[2,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. People 2 and 3 also dislike each other, forcing a contradiction.
- ❌ [near-miss] "true"
    feedback: That result follows the check only conflicts with person one bug, not the exact picture. (misconception: check-only-conflicts-with-person-one)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3" · edges: 1—2, 1—3, 2—3
"Why" shown after success: People 2 and 3 also dislike each other, forcing a contradiction.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact dislikes")
Raw input shown:
```
n = 4, dislikes = [[1,2],[1,3],[2,4]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 1 / 2 / 3 / 4
2. Picture C / 1 / 2 / 3 / 4
3. Picture A / 1 / 2 / 3 / 4
4. Picture D / 1 / 2 / 3
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 2—4
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 1, 2, 3, 4 · edges: 1→2, 1→3, 2→4
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: UNDIRECTED · nodes: 1, 2, 3 · edges: 1—2, 1—3
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-disconnected`, facet "all people")
Raw input shown:
```
n = 5, dislikes = [[1,2],[3,4],[4,5],[5,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. The separate triangle 3–4–5 makes the full input impossible.
- ❌ [near-miss] "true"
    feedback: That result follows the color only component containing one bug, not the exact picture. (misconception: color-only-component-containing-one)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3", "4", "5" · edges: 1—2, 3—4, 4—5, 5—3
"Why" shown after success: The separate triangle 3–4–5 makes the full input impossible.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "all people")
Raw input shown:
```
For `n = 5`, which nodes belong in the dislike graph?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For n = 5, which nodes belong in the dislike graph?**
Choices as displayed (top to bottom):
1. A / Only people who appear in at least one dislike pair.
2. B / Exactly two nodes, one for each final group.
3. C / People 1, 2, 3, 4, and 5, including anyone absent from dislikes.
4. D / Each pair in dislikes should be a person node.
Answer key + feedback per choice (data):
- ✅ CORRECT [people-one-to-five] "People 1, 2, 3, 4, and 5, including anyone absent from `dislikes`."
    feedback: Correct. An isolated person can join either group and still belongs in the problem.
- ❌ [disliked-only] "Only people who appear in at least one dislike pair."
    feedback: People with no dislikes still exist, even though they do not constrain the split. (misconception: drop-isolated-person)
- ❌ [two-groups] "Exactly two nodes, one for each final group."
    feedback: The two groups are color assignments. Individual people are the graph nodes. (misconception: groups-as-nodes)
- ❌ [pairs] "Each pair in `dislikes` should be a person node."
    feedback: Each pair creates a conflict edge between two person nodes. (misconception: dislike-pair-as-node)
"Why" shown after success: Correct. An isolated person can join either group and still belongs in the problem.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-none`, facet "all people")
Raw input shown:
```
n = 3, dislikes = []
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. People with no conflicts can be assigned freely.
- ❌ [near-miss] "false"
    feedback: That result follows the require both groups to have conflict edge bug, not the exact picture. (misconception: require-both-groups-to-have-conflict-edge)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "1", "2", "3" · edges: none
"Why" shown after success: People with no conflicts can be assigned freely.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "two-way conflict edges")
Raw input shown:
```
What graph connection should dislike pair `[2,4]` create?
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What graph connection should dislike pair [2,4] create?**
Choices as displayed (top to bottom):
1. A / Only an arrow 2→4 because person 2 is written first.
2. B / One undirected edge 2—4, requiring people 2 and 4 to receive opposite group colors.
3. C / One edge 2—4 meaning people 2 and 4 must be placed together.
4. D / Connect person 2 to everyone except person 4.
Answer key + feedback per choice (data):
- ✅ CORRECT [undirected-conflict] "One undirected edge 2—4, requiring people 2 and 4 to receive opposite group colors."
    feedback: Correct. The conflict is mutual and must cross the two groups.
- ❌ [directed-dislike] "Only an arrow 2→4 because person 2 is written first."
    feedback: A listed dislike prevents the pair from sharing a group in either direction. (misconception: make-dislike-directed)
- ❌ [same-group] "One edge 2—4 meaning people 2 and 4 must be placed together."
    feedback: The edge means the opposite: its endpoints must be separated. (misconception: invert-dislike-constraint)
- ❌ [friends-complement] "Connect person 2 to everyone except person 4."
    feedback: Missing dislike pairs mean no restriction; they do not create friendship edges. (misconception: connect-non-dislikes)
"Why" shown after success: Correct. The conflict is mutual and must cross the two groups.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "two-group consistency")
Raw input shown:
```
n = 4, dislikes = [[1,2],[1,3],[2,4]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For dislikes [1,2],[1,3],[2,4], which split works?**
Choices as displayed (top to bottom):
1. A / Group {1,2} and group {3,4}
2. B / Group {1,4} and group {2,3}
3. C / Group {1,3} and group {2,4}
4. D / Group {1,2,3,4} and an empty group
Answer key + feedback per choice (data):
- ✅ CORRECT [valid] "Group {1,4} and group {2,3}"
    feedback: Correct. Every dislike edge crosses groups.
- ❌ [one-two] "Group {1,2} and group {3,4}"
    feedback: People 1 and 2 dislike each other. (misconception: put-dislike-together)
- ❌ [one-three] "Group {1,3} and group {2,4}"
    feedback: Both groups contain a listed dislike pair. (misconception: ignore-two-conflicts)
- ❌ [all-one] "Group {1,2,3,4} and an empty group"
    feedback: Several dislike edges stay inside the first group. (misconception: allow-empty-split-with-conflicts)
"Why" shown after success: Correct. Every dislike edge crosses groups.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "two-group consistency")
Raw input shown:
```
n = 3, dislikes = [[1,2],[1,3],[2,3]]
```
Node-name guide shown: Required node-name format: Use each node's 1-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / put 1 alone, then put both 2 and 3 opposite 1
2. B / color 1 and 3 differently, then reuse 1's color for 2
3. C / the triangle cannot be colored with only two groups
4. D / mark each person visited before checking already-colored neighbors
Answer key + feedback per choice (data):
- ✅ CORRECT [false] "the triangle cannot be colored with only two groups"
    feedback: Correct. A triangle needs three colors, but only two groups exist.
- ❌ [true-two-one] "put 1 alone, then put both 2 and 3 opposite 1"
    feedback: This satisfies edges from 1 but forgets to check the 2—3 edge inside the other group. (misconception: check-only-start-node-conflicts)
- ❌ [true-empty] "color 1 and 3 differently, then reuse 1's color for 2"
    feedback: That makes the dislike edge 1—2 stay inside one color group. (misconception: overwrite-neighbor-color)
- ❌ [true-third] "mark each person visited before checking already-colored neighbors"
    feedback: Visited status alone cannot detect that edge 2—3 joins equal colors. (misconception: visited-without-color-conflict-check)
"Why" shown after success: Correct. A triangle needs three colors, but only two groups exist.
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
n = 3, dislikes = [[1,2],[2,3]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. People 1 and 3 can share a group opposite person 2.; ❌ "false" — That result follows the reject three person chain bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3" · edges: 1—2, 2—3
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [disliked-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
People 1, 2, 3, 4, and 5, including anyone absent from dislikes.
Your choice: People with no dislikes still exist, even though they do not constrain the split.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
n = 4, dislikes = [[1,2]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. People 3 and 4 create no conflict and can join either side.; ❌ "false" — That result follows the drop or reject isolated people bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [directed-dislike]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
One undirected edge 2—4, requiring people 2 and 4 to receive opposite group colors.
Your choice: A listed dislike prevents the pair from sharing a group in either direction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
n = 2, dislikes = [[2,1]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. A dislike pair is a mutual separation constraint regardless of order.; ❌ "false" — That result follows the treat dislike as one way bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2" · edges: 2—1
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [one-two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Group {1,4} and group {2,3}
Your choice: People 1 and 2 dislike each other.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
n = 4, dislikes = [[1,2],[2,3],[3,4],[4,1]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. An even cycle alternates between two groups.; ❌ "false" — That result follows the reject any cycle bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2, 2—3, 3—4, 4—1
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [true-two-one]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
the triangle cannot be colored with only two groups
Your choice: This satisfies edges from 1 but forgets to check the 2—3 edge inside the other group.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n = 4, dislikes = [[1,3],[2,3],[2,4]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. A valid coloring follows conflicts, not odd/even person labels.; ❌ "false" — That result follows the assign groups by person number bug, not the exact picture.
Remedial required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—3, 2—3, 2—4
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-one-way` (authored level "Dislike made one-sided"; authored goal, NOT shown to student: "Order a dislike pair so the chosen person's conflict disappears under arrows.")
Everything the student sees (text):
```
I
Isaiah's broken search

Isaiah mistakes undirected links for arrows.

Your main goal: Expose Isaiah's mistake. Draw two graphs: first the correct graph, then Isaiah's graph using the mistake.

CHOOSE THE FIRST PERSON COLORED
first person colored
OUTPUT
CORRECT OUTPUT
ISAIAH’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first person colored
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
2 · Isaiah's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST PERSON COLORED / first person colored", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ISAIAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2]","buggy":"[1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2 · edges (in drawing order) 2—1 · start 1
Grader's expected answers: correct output `[1,2]` · character's output `[1]` · character's graph must be exactly: DIRECTED · nodes: 1, 2 · edges: 2→1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `1, 2`; ❌ curly braces → `{1,2}`; ❌ quoted numbers/strings → `["1","2"]`; ❌ reversed order → `[2,1]`; ✅ spaces inside brackets → `[ 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2]
ISAIAH'S OUTPUT
[1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Last conflict only"; authored goal, NOT shown to student: "Give one person several dislike neighbors and make an earlier neighbor matter.")
Everything the student sees (text):
```
J
Jasmine's broken search

Jasmine keeps only the last branch it sees.

Your main goal: Expose Jasmine's mistake. Draw two graphs: first the correct graph, then Jasmine's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST PERSON COLORED
first person colored
OUTPUT
CORRECT OUTPUT
JASMINE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first person colored
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
2 · Jasmine's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST PERSON COLORED / first person colored", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JASMINE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3,4]","buggy":"[1,3,4]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3, 4 · edges (in drawing order) 1—2, 1—3, 3—4 · start 1
Grader's expected answers: correct output `[1,2,3,4]` · character's output `[1,3,4]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 3—4
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3,4]
JASMINE'S OUTPUT
[1,3,4]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Final conflict omitted"; authored goal, NOT shown to student: "Make the last dislike edge connect a person not otherwise reached.")
Everything the student sees (text):
```
L
Luke's broken search

Luke accidentally leaves the final direct link out of the graph.

Your main goal: Expose Luke's mistake. Draw two graphs: first the correct graph, then Luke's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE FIRST PERSON COLORED
first person colored
OUTPUT
CORRECT OUTPUT
LUKE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose first person colored
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
2 · Luke's graph
Check my graph
→
```
Start field: label "CHOOSE THE FIRST PERSON COLORED / first person colored", placeholder "Example: 1", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | LUKE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[1,2,3]","buggy":"[1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 1, 2, 3 · edges (in drawing order) 1—2, 2—3 · start 1
Grader's expected answers: correct output `[1,2,3]` · character's output `[1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3 · edges: 1—2
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[1,2,3]
LUKE'S OUTPUT
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
n = 3, dislikes = [[1,2],[2,3]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3" · edges: 1—2, 2—3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each pair in `dislikes` should be a person node.”"
    feedback if wrong: Each pair creates a conflict edge between two person nodes. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1—3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 1 direct neighbor."
    feedback if wrong: 3 has 1 direct neighbor.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Each pair creates a conflict edge between two person nodes. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
×
3 has 1 direct neighbor.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only people who appear in at least one dislike pair.”"
    feedback if wrong: People with no dislikes still exist, even though they do not constrain the split. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
- [YES is correct] (direct-vs-reach) "3 can reach 1 through 2, but the graph still has no direct 3—1 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 direct neighbor.
×
People with no dislikes still exist, even though they do not constrain the split. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
×
Right. A multi-step route through 2 creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1—3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2 has exactly 2 direct neighbors."
    feedback if wrong: 2 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Exactly two nodes, one for each final group.”"
    feedback if wrong: The two groups are color assignments. Individual people are the graph nodes. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
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
n = 4, dislikes = [[1,2]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who appear in at least one dislike pair.”"
    feedback if wrong: People with no dislikes still exist, even though they do not constrain the split. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
- [NO is correct] (direct-vs-reach) "1 can reach 2, but there is no direct 1—2 edge."
    feedback if wrong: The mini-example lists 1—2 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "4 has exactly 1 direct neighbor."
    feedback if wrong: 4 has 0 direct neighbors.
Result: PASSED

### S3 Q3
Raw input shown:
```
n = 2, dislikes = [[2,1]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2" · edges: 2—1
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "2 can reach 1, but there is no direct 2—1 edge."
    feedback if wrong: The mini-example lists 2—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 2 direct neighbors."
    feedback if wrong: 1 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “Each pair in `dislikes` should be a person node.”"
    feedback if wrong: Each pair creates a conflict edge between two person nodes. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
Result: PASSED

### S3 Q4
Raw input shown:
```
n = 4, dislikes = [[1,2],[2,3],[3,4],[4,1]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—2, 2—3, 3—4, 4—1
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Exactly two nodes, one for each final group.”"
    feedback if wrong: The two groups are color assignments. Individual people are the graph nodes. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
- [NO is correct] (direct-vs-reach) "The correct graph has 3—4 and 4—1, so it should also contain a direct 3—1 edge."
    feedback if wrong: Two direct edges through 4 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 1 direct neighbor."
    feedback if wrong: 2 has 2 direct neighbors.
Result: PASSED

### S3 Q5
Raw input shown:
```
n = 4, dislikes = [[1,3],[2,3],[2,4]]
```
Node-name guide: Required node-name format: Use each node's 1-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "1", "2", "3", "4" · edges: 1—3, 2—3, 2—4
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "3 can reach 4 through 2, but the graph still has no direct 3—4 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "3 has exactly 2 direct neighbors."
    feedback if wrong: 3 has 2 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only people who appear in at least one dislike pair.”"
    feedback if wrong: People with no dislikes still exist, even though they do not constrain the split. Correct node rule: One node for every person ID from 1 through n, including people absent from dislikes.
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

### S4 case 1 — `authored-deep-case` · bug: A disconnected dislike group is ignored
Input shown:
```
REAL PROBLEM INPUT
n = 5, dislikes = [[1,2],[3,4],[4,5],[5,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function possibleBipartition(n, dislikes) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of dislikes) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const color = Array(numberOfNodes + 1).fill(0);
  const stack = [1];
  color[1] = 1;
  while (stack.length) {
    const person = stack.pop();
    for (const other of graph[person]) {
      if (color[other] === color[person]) {
        return false;
      }
      if (color[other] === 0) {
        color[other] = -color[person];
        stack.push(other);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "person 1", "person 2", "person 3", "person 4", "person 5" · edges: person 1—person 2, person 3—person 4, person 4—person 5, person 5—person 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a valid two-group split exists" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Person labels should be converted to zero-based indexes on the shown input.
- B Each dislike should point only from the first person to the second.
- C It colors only person 1's connected component for the shown graph.
Diagnosis answer key + feedback:
- ✅ [unchecked-component] "It colors only person 1's connected component for the shown graph." — feedback: Correct. The separate triangle among 3, 4, and 5 is an odd cycle, so no split works.
- ❌ [one-based] "Person labels should be converted to zero-based indexes on the shown input." — feedback: No. Arrays of length n+1 correctly support labels 1 through n.
- ❌ [directed-dislikes] "Each dislike should point only from the first person to the second." — feedback: No. A dislike prevents either person from sharing the other's group, so it is symmetric.
Graph proof shown in feedback: code rule "Two-coloring begins only at node 1." → changed graph "The dislike graph has edge 1—2 and a disconnected odd cycle 3—4—5—3." → boundary "The impossible odd cycle lies in another component." → returned value "The code approves the easy component and returns true, while the full graph cannot be bipartitioned."
Output-format probes: ❌ Capitalized boolean → `True`; ❌ trailing period → `true.`
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
About your diagnosis: No. Arrays of length n+1 correctly support labels 1 through n.
Code rule: Two-coloring begins only at node 1. → Changed graph: The dislike graph has edge 1—2 and a disconnected odd cycle 3—4—5—3. → Reachable boundary: The impossible odd cycle lies in another component.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A disconnected dislike group is ignored
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Two-coloring begins only at node 1. → Changed graph: The dislike graph has edge 1—2 and a disconnected odd cycle 3—4—5—3. → Reachable boundary: The impossible odd cycle lies in another component. → Returned value: The code approves the easy component and returns true, while the full graph cannot be bipartitioned.
```

### S4 case 2 — `odd-cycle-in-second-component` · bug: A disconnected dislike group is ignored
Input shown:
```
REAL PROBLEM INPUT
n = 6, dislikes = [[1,2],[3,4],[4,5],[5,3]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function possibleBipartition(n, dislikes) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of dislikes) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const color = Array(numberOfNodes + 1).fill(0);
  const stack = [1];
  color[1] = 1;
  while (stack.length) {
    const person = stack.pop();
    for (const other of graph[person]) {
      if (color[other] === color[person]) {
        return false;
      }
      if (color[other] === 0) {
        color[other] = -color[person];
        stack.push(other);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "person 1", "person 2", "person 3", "person 4", "person 5", "person 6" · edges: person 1—person 2, person 3—person 4, person 4—person 5, person 5—person 3
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a valid two-group split exists" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A It colors only person 1's connected component for the shown graph.
- B Person labels should be converted to zero-based indexes on the shown input.
- C Each dislike should point only from the first person to the second.
Diagnosis answer key + feedback:
- ✅ [unchecked-component] "It colors only person 1's connected component for the shown graph." — feedback: Correct. The checked 1—2 component is valid, but the separate 3—4—5 triangle makes a full bipartition impossible. Therefore the shown code returns true, while the real problem returns false.
- ❌ [one-based] "Person labels should be converted to zero-based indexes on the shown input." — feedback: No. Arrays of length n+1 correctly support labels 1 through n.
- ❌ [directed-dislikes] "Each dislike should point only from the first person to the second." — feedback: No. A dislike prevents either person from sharing the other's group, so it is symmetric.
Graph proof shown in feedback: code rule "Two-coloring begins only at node 1." → changed graph "Nodes: person 1, person 2, person 3, person 4, person 5, person 6. Direct edges: person 1—person 2; person 3—person 4; person 4—person 5; person 5—person 3." → boundary "The checked 1—2 component is valid, but the separate 3—4—5 triangle makes a full bipartition impossible." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A disconnected dislike group is ignored
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Two-coloring begins only at node 1. → Changed graph: Nodes: person 1, person 2, person 3, person 4, person 5, person 6. Direct edges: person 1—person 2; person 3—person 4; person 4—person 5; person 5—person 3. → Reachable boundary: The checked 1—2 component is valid, but the separate 3—4—5 triangle makes a full bipartition impossible. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

### S4 case 3 — `odd-cycle-after-longer-first-component` · bug: A disconnected dislike group is ignored
Input shown:
```
REAL PROBLEM INPUT
n = 7, dislikes = [[1,2],[2,3],[4,5],[5,6],[6,4]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function possibleBipartition(n, dislikes) {
  const numberOfNodes = n;
  const graph = Array.from({ length: numberOfNodes + 1 }, () => []);
  for (const [firstValue, secondValue] of dislikes) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const color = Array(numberOfNodes + 1).fill(0);
  const stack = [1];
  color[1] = 1;
  while (stack.length) {
    const person = stack.pop();
    for (const other of graph[person]) {
      if (color[other] === color[person]) {
        return false;
      }
      if (color[other] === 0) {
        color[other] = -color[person];
        stack.push(other);
      }
    }
  }
  return true;
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "person 1", "person 2", "person 3", "person 4", "person 5", "person 6", "person 7" · edges: person 1—person 2, person 2—person 3, person 4—person 5, person 5—person 6, person 6—person 4
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether a valid two-group split exists" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Person labels should be converted to zero-based indexes on the shown input.
- B It colors only person 1's connected component for the shown graph.
- C Each dislike should point only from the first person to the second.
Diagnosis answer key + feedback:
- ✅ [unchecked-component] "It colors only person 1's connected component for the shown graph." — feedback: Correct. The code successfully colors the path from person 1, then wrongly stops before checking the separate 4—5—6 triangle. Therefore the shown code returns true, while the real problem returns false.
- ❌ [one-based] "Person labels should be converted to zero-based indexes on the shown input." — feedback: No. Arrays of length n+1 correctly support labels 1 through n.
- ❌ [directed-dislikes] "Each dislike should point only from the first person to the second." — feedback: No. A dislike prevents either person from sharing the other's group, so it is symmetric.
Graph proof shown in feedback: code rule "Two-coloring begins only at node 1." → changed graph "Nodes: person 1, person 2, person 3, person 4, person 5, person 6, person 7. Direct edges: person 1—person 2; person 2—person 3; person 4—person 5; person 5—person 6; person 6—person 4." → boundary "The code successfully colors the path from person 1, then wrongly stops before checking the separate 4—5—6 triangle." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
A disconnected dislike group is ignored
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Two-coloring begins only at node 1. → Changed graph: Nodes: person 1, person 2, person 3, person 4, person 5, person 6, person 7. Direct edges: person 1—person 2; person 2—person 3; person 4—person 5; person 5—person 6; person 6—person 4. → Reachable boundary: The code successfully colors the path from person 1, then wrongly stops before checking the separate 4—5—6 triangle. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```