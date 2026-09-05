# Save the Date (`save-the-date-phone-chain`) — variant, tree

## Problem statement (Description tab)

A family of `n` people, numbered `0` to `n - 1`, is planning a reunion. Person `headId` starts spreading the news, so the head already knows on day `0`.

The news travels along a fixed phone chain shaped like a family tree: `caller[i]` is the person whose job is to call person `i`. For the head, `caller[headId] = -1`, because nobody calls the head. Every other person is called by exactly one person, and the chain never loops.

People are a little slow. After person `p` hears the news, they wait `waitDays[p]` days and then call **everyone they are responsible for**, all on that same day. So person `i` hears the news on day `(day caller[i] heard) + waitDays[caller[i]]`.

The reunion is on day `deadline`. Return how many people know the news on or before day `deadline`. The head counts too.

### Examples
- Example 1: input `n = 6, headId = 0, caller = [-1,0,0,1,1,2], waitDays = [2,3,1,0,0,0], deadline = 4` → output `4`. Person 0 knows on day 0. Person 0 waits 2 days, so persons 1 and 2 hear on day 2. Person 1 waits 3 days, so persons 3 and 4 hear on day 5. Person 2 waits 1 day, so person 5 hears on day 3. By day 4, persons 0, 1, 2, and 5 know: that is 4 people.
- Example 2: input `n = 3, headId = 2, caller = [2,2,-1], waitDays = [0,0,5], deadline = 3` → output `1`. Person 2 knows on day 0 but waits 5 days, so persons 0 and 1 only hear on day 5. By day 3, only person 2 knows.

### Graph rules (authored)
- Nodes: Each of the n people, with `headId` as the root.
- Edges: `caller[i] → i`, from the caller to the listener.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`deadline-four`, facet "deadline reach count")
Raw input shown:
```
n=6, headId=0, caller=[-1,0,0,1,1,2], waitDays=[2,3,1,0,0,0], deadline=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many people know by the deadline?**
Choices as displayed (top to bottom):
1. 6
2. 4
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "4"
    feedback: Correct. People 0,1,2,5 hear on days 0,2,2,3; 3 and 4 hear on day 5.
- ❌ [bug] "6"
    feedback: This counts every person in the phone tree without comparing their hearing day to deadline 4. (misconception: ignore-deadline)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1 (weight/label "+2"), 0→2 (weight/label "+2"), 1→3 (weight/label "+3"), 1→4 (weight/label "+3"), 2→5 (weight/label "+1")
"Why" shown after success: People 0,1,2,5 hear on days 0,2,2,3; 3 and 4 hear on day 5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`head-only`, facet "person identity")
Raw input shown:
```
n=3, headId=2, caller=[2,2,-1], waitDays=[0,0,5], deadline=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many people know by the deadline?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The head counts on day 0; both reports hear on day 5.
- ❌ [bug] "0"
    feedback: This starts the head's day after their own wait instead of day 0. (misconception: delay-head-start)
Graph the grader requires (hidden from student): DIRECTED · nodes: "2", "0", "1" · edges: 2→0 (weight/label "+5"), 2→1 (weight/label "+5")
"Why" shown after success: The head counts on day 0; both reports hear on day 5.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact caller rows")
Raw input shown:
```
n=6, headId=0, caller=[-1,0,0,1,1,2], waitDays=[2,3,1,0,0,0], deadline=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / +2 / +2 / +3 / +3 / +1 / 0 / 1 / 2 / 3 / 4 / 5
2. Picture B / +2 / +2 / +3 / +3 / 0 / 1 / 2 / 3 / 4 / 5
3. Picture C / +2 / +2 / +3 / +3 / +1 / 0 / 1 / 2 / 3 / 4 / 5
4. Picture D / +2 / +2 / +3 / +3 / 0 / 1 / 2 / 3 / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0→1 (+2), 0→2 (+2), 1→3 (+3), 1→4 (+3), 2→5 (+1)
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0→1 (+2), 0→2 (+2), 1→3 (+3), 1→4 (+3)
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 1→0 (+2), 2→0 (+2), 3→1 (+3), 4→1 (+3), 5→2 (+1)
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1 (+2), 0→2 (+2), 1→3 (+3), 1→4 (+3)
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-nodes`, facet "person identity")
Raw input shown:
```
n=3, headId=2, caller=[2,2,-1], waitDays=[0,0,5], deadline=3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each node represent in the phone-chain tree?**
Picture under review: DIRECTED · nodes: 2, 0, 1 · edges: 2→0 (+5), 2→1 (+5)
Choices as displayed (top to bottom):
1. A / Only people who hear before the deadline.
2. B / Each of the n people, with headId as the root.
3. C / One node for each calendar day on which a call can happen.
4. D / Only people who call at least one listener.
Answer key + feedback per choice (data):
- ✅ CORRECT [people] "Each of the n people, with `headId` as the root."
    feedback: Correct. Wait days are values on people; calls are the links between them.
- ❌ [on-time-only] "Only people who hear before the deadline."
    feedback: Whether someone is on time depends on the chain above them and must be computed by traversal. (misconception: pre-filter-deadline)
- ❌ [call-days] "One node for each calendar day on which a call can happen."
    feedback: Days are accumulated timing state. The people receiving and making calls are the tree nodes. (misconception: time-as-node)
- ❌ [callers-only] "Only people who call at least one listener."
    feedback: Leaf listeners still count if they hear by the deadline. (misconception: omit-leaves)
"Why" shown after success: Correct. Wait days are values on people; calls are the links between them.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`parallel-calls`, facet "caller-to-person timing edges")
Raw input shown:
```
n=3, headId=0, caller=[-1,0,0], waitDays=[4,0,0], deadline=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many people know by the deadline?**
Choices as displayed (top to bottom):
1. 2
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. The head calls both reports on day 4, so all three count.
- ❌ [bug] "2"
    feedback: This calls reports sequentially and pushes the second report to day 8. (misconception: serialize-parallel-calls)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 0→1 (weight/label "+4"), 0→2 (weight/label "+4")
"Why" shown after success: The head calls both reports on day 4, so all three count.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-relations`, facet "caller-to-person timing edges")
Raw input shown:
```
n=3, headId=0, caller=[-1,0,0], waitDays=[4,0,0], deadline=4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For a non-head person i, which arrow does caller[i] define?**
Picture under review: DIRECTED · nodes: 0, 1, 2 · edges: 0→1 (+4), 0→2 (+4)
Choices as displayed (top to bottom):
1. A / caller[i] → i, from the caller to the listener.
2. B / i → caller[i], because i's row stores the caller.
3. C / A two-way edge because either person knows the other's number.
4. D / Connect any two people who happen to hear on the same day.
Answer key + feedback per choice (data):
- ✅ CORRECT [caller-to-listener] "`caller[i] → i`, from the caller to the listener."
    feedback: Correct. Time flows down the phone tree from the head toward listeners.
- ❌ [listener-to-caller] "`i → caller[i]`, because i's row stores the caller."
    feedback: That follows storage direction instead of call direction and walks back toward the head. (misconception: reverse-parent-array)
- ❌ [two-way-call] "A two-way edge because either person knows the other's number."
    feedback: The scheduled chain says who calls whom; information flows in one direction. (misconception: make-call-undirected)
- ❌ [same-day] "Connect any two people who happen to hear on the same day."
    feedback: Equal timing does not create a phone call. Only the caller array defines edges. (misconception: time-creates-edge)
"Why" shown after success: Correct. Time flows down the phone tree from the head toward listeners.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "deadline reach count")
Raw input shown:
```
n = 7, headId = 0, caller = [-1,0,0,1,1,2,2], waitDays = [1,2,4,0,0,0,0], deadline = 3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Using the caller wait times cumulatively, how many people hear by the deadline?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 5
3. C / 7
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [five] "`5`"
    feedback: Correct. People 0–4 hear on or before day 3.
- ❌ [three] "`3`"
    feedback: People hearing exactly on deadline day 3 also count. (misconception: strict-before-deadline)
- ❌ [seven] "`7`"
    feedback: People 5 and 6 hear on day 5, after the deadline. (misconception: count-all-people)
- ❌ [four] "`4`"
    feedback: The head already knows on day 0 and belongs in the count. (misconception: exclude-head)
"Why" shown after success: Correct. People 0–4 hear on or before day 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`deadline-zero`, facet "deadline reach count")
Raw input shown:
```
n=4, headId=2, caller=[2,0,-1,2], waitDays=[1,0,2,0], deadline=0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many people know by the deadline?**
Choices as displayed (top to bottom):
1. 1
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Only the head knows on day 0.
- ❌ [bug] "3"
    feedback: This compares each person's own waitDays value to the deadline instead of their accumulated hearing day. (misconception: compare-own-wait-not-arrival-day)
Graph the grader requires (hidden from student): DIRECTED · nodes: "2", "0", "3", "1" · edges: 2→0 (weight/label "+2"), 2→3 (weight/label "+2"), 0→1 (weight/label "+1")
"Why" shown after success: Only the head knows on day 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-bug`, facet "deadline reach count")
Raw input shown:
```
n = 4, headId = 2, caller = [2,0,-1,2], waitDays = [1,0,2,0], deadline = 0
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Using the caller wait times cumulatively, how many people hear by the deadline?**
Choices as displayed (top to bottom):
1. A / 0
2. B / 2
3. C / 1
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [one] "`1`"
    feedback: Correct. Only head person 2 knows by day 0.
- ❌ [zero] "`0`"
    feedback: The head starts informed on day 0 and counts. (misconception: exclude-head)
- ❌ [two] "`2`"
    feedback: No listener hears until after the head's wait. (misconception: call-immediately)
- ❌ [four] "`4`"
    feedback: A place in the phone tree does not mean a person hears before the deadline. (misconception: ignore-time)
"Why" shown after success: Correct. Only head person 2 knows by day 0.
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
Your choice: This drops one direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every input detail"
Remedial raw input:
```
n=5, headId=0, caller=[-1,0,0,1,2], waitDays=[1,4,2,0,0], deadline=4
```
Remedial question: **How many people know by day 4?** · choices shown: 4 | 5
Remedial answer key: ✅ "4" — Correct. Everyone except person 3 hears by day 4.; ❌ "5" — This includes person 3 at day 5 because it checks a strict cutoff one day late.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1 (weight/label "+1"), 0→2 (weight/label "+1"), 1→3 (weight/label "+4"), 2→4 (weight/label "+2")
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [on-time-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each of the n people, with headId as the root.
Your choice: Whether someone is on time depends on the chain above them and must be computed by traversal.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
n=3, headId=1, caller=[1,-1,1], waitDays=[0,2,0], deadline=2
```
Remedial question: **How many person nodes are in the tree?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. All indices 0,1,2 are people.; ❌ "2" — This mistakes headId 1 for an array length boundary and drops person 2.
Remedial required graph (hidden): DIRECTED · nodes: "1", "0", "2" · edges: 1→0 (weight/label "+2"), 1→2 (weight/label "+2")
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [listener-to-caller]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
caller[i] → i, from the caller to the listener.
Your choice: That follows storage direction instead of call direction and walks back toward the head.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
n=2, headId=1, caller=[1,-1], waitDays=[0,3], deadline=3
```
Remedial question: **On what day does person 0 hear?** · choices shown: 3 | 0
Remedial answer key: ✅ "3" — Correct. Caller 1 waits 3 days before calling person 0.; ❌ "0" — This reverses the caller edge and treats person 0's zero wait as the edge cost.
Remedial required graph (hidden): DIRECTED · nodes: "1", "0" · edges: 1→0 (weight/label "+3")
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: People hearing exactly on deadline day 3 also count.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
n=3, headId=0, caller=[-1,0,1], waitDays=[2,3,0], deadline=5
```
Remedial question: **How many people know by day 5?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. The deadline is inclusive, so person 2 counts.; ❌ "2" — This uses day < deadline and excludes a person who hears exactly on day 5.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1 (weight/label "+2"), 1→2 (weight/label "+3")
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [zero]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
1
Your choice: The head starts informed on day 0 and counts.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
n=4, headId=0, caller=[-1,0,1,2], waitDays=[1,2,3,0], deadline=3
```
Remedial question: **How many people know by day 3?** · choices shown: 4 | 3
Remedial answer key: ✅ "3" — Correct. People 0,1,2 hear on days 0,1,3; person 3 hears on day 6.; ❌ "4" — This compares each manager's individual wait to 3 and forgets to accumulate time down the chain.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1 (weight/label "+1"), 1→2 (weight/label "+2"), 2→3 (weight/label "+3")
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `shallow-search` (authored level "Caller's caller"; authored goal, NOT shown to student: "Put a person two calls away so direct contacts are not enough.")
Everything the student sees (text):
```
R
Reagan's broken search

Reagan stops after one hop instead of continuing.

Your main goal: Expose Reagan's mistake. Draw two graphs: first the correct graph, then Reagan's graph using the mistake.

CHOOSE THE HEAD CALLER
head caller
OUTPUT
CORRECT OUTPUT
REAGAN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose head caller
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
2 · Reagan's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEAD CALLER / head caller", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | REAGAN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4", "5"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
REAGAN'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Last invitation lost"; authored goal, NOT shown to student: "Make the final caller row bring one more person into the chain.")
Everything the student sees (text):
```
E
Eduardo's broken search

Eduardo builds every listed connection except the last one.

Your main goal: Expose Eduardo's mistake. Draw two graphs: first the correct graph, then Eduardo's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE HEAD CALLER
head caller
OUTPUT
CORRECT OUTPUT
EDUARDO’S OUTPUT
Drawing 1 of 2: Correct graph · Choose head caller
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
2 · Eduardo's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEAD CALLER / head caller", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EDUARDO’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
EDUARDO'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `reverse-arrows` (authored level "Phone chain backward"; authored goal, NOT shown to student: "Choose a caller link where reversing it stops news from flowing downward.")
Everything the student sees (text):
```
J
Jordyn's broken search

Jordyn reads every from/to relationship backward.

Your main goal: Expose Jordyn's mistake. Draw two graphs: first the correct graph, then Jordyn's graph using the mistake.

CHOOSE THE HEAD CALLER
head caller
OUTPUT
CORRECT OUTPUT
JORDYN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose head caller
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
2 · Jordyn's graph
Check my graph
→
```
Start field: label "CHOOSE THE HEAD CALLER / head caller", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JORDYN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
JORDYN'S OUTPUT
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
n=3, headId=0, caller=[-1,0,1], waitDays=[2,3,0], deadline=5
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1 (weight/label "+2"), 1→2 (weight/label "+3")
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each calendar day on which a call can happen.”"
    feedback if wrong: Days are accumulated timing state. The people receiving and making calls are the tree nodes. Correct node rule: Each of the n people, with `headId` as the root.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
1 has 1 outgoing direct edge.
×
Days are accumulated timing state. The people receiving and making calls are the tree nodes. Correct node rule: Each of the n people, with
headId
as the root.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 1 outgoing direct edge."
    feedback if wrong: 2 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who call at least one listener.”"
    feedback if wrong: Leaf listeners still count if they hear by the deadline. Correct node rule: Each of the n people, with `headId` as the root.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
2 has 0 outgoing direct edges.
×
Leaf listeners still count if they hear by the deadline. Correct node rule: Each of the n people, with
headId
as the root.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 0 outgoing direct edges."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who hear before the deadline.”"
    feedback if wrong: Whether someone is on time depends on the chain above them and must be computed by traversal. Correct node rule: Each of the n people, with `headId` as the root.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
×
Edge direction matches
×
Edge labels or weights match the input
```
Result: PASSED

### S3 Q2
Raw input shown:
```
n=4, headId=0, caller=[-1,0,1,2], waitDays=[1,2,3,0], deadline=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1 (weight/label "+1"), 1→2 (weight/label "+2"), 2→3 (weight/label "+3")
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who call at least one listener.”"
    feedback if wrong: Leaf listeners still count if they hear by the deadline. Correct node rule: Each of the n people, with `headId` as the root.
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "2 has exactly 2 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
n=5, headId=0, caller=[-1,0,0,1,2], waitDays=[1,4,2,0,0], deadline=4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0→1 (weight/label "+1"), 0→2 (weight/label "+1"), 1→3 (weight/label "+4"), 2→4 (weight/label "+2")
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 2 outgoing direct edges."
    feedback if wrong: 0 has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each calendar day on which a call can happen.”"
    feedback if wrong: Days are accumulated timing state. The people receiving and making calls are the tree nodes. Correct node rule: Each of the n people, with `headId` as the root.
- [YES is correct] (direct-vs-reach) "0 can reach 4 through 2, but the graph still has no direct 0→4 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
n=3, headId=1, caller=[1,-1,1], waitDays=[0,2,0], deadline=2
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "0", "2" · edges: 1→0 (weight/label "+2"), 1→2 (weight/label "+2")
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who hear before the deadline.”"
    feedback if wrong: Whether someone is on time depends on the chain above them and must be computed by traversal. Correct node rule: Each of the n people, with `headId` as the root.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
n=2, headId=1, caller=[1,-1], waitDays=[0,3], deadline=3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "1", "0" · edges: 1→0 (weight/label "+3")
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only people who call at least one listener.”"
    feedback if wrong: Leaf listeners still count if they hear by the deadline. Correct node rule: Each of the n people, with `headId` as the root.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Uses the listener's wait instead of the caller's
Input shown:
```
REAL PROBLEM INPUT
n: 3
headId: 0
caller: [-1, 0, 1]
waitDays: [2, 3, 0]
deadline: 4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const children = Array.from({ length: input.n }, () => []);
  for (let person = 0; person < input.n; person++) {
    if (person !== input.headId) {
      children[input.caller[person]].push(person);
    }
  }
  let onTime = 0;
  function spread(person, heardDay) {
    if (heardDay <= input.deadline) {
      onTime++;
    }
    for (const child of children[person]) {
      spread(child, heardDay + input.waitDays[child]);
    }
  }
  spread(input.headId, 0);
  return onTime;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of people informed by deadline" · expected buggy output `3` · real correct output `2`
Diagnosis choices as displayed:
- A The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph.
- B The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value.
- C The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call.
Diagnosis answer key + feedback:
- ✅ [wrong-wait-owner] "The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call." — feedback: Correct. Person 2 hears on day 5, not day 3.
- ❌ [deadline-strict] "The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph." — feedback: The deadline is inclusive, so <= is correct.
- ❌ [head-delay] "The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value." — feedback: The head already knows on day 0; their wait affects calls to children.
Graph proof shown in feedback: code rule "Each edge uses the destination's delay instead of its source's delay." → changed graph "The phone chain is 0→1→2. Caller 0 waits 2 days, then caller 1 waits 3 more." → boundary "The child delays 3 and 0 differ from the caller delays 2 and 3." → returned value "The code places person 2 on day 3 and counts all three; correctly person 2 hears on day 5, after the deadline."
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
About your diagnosis: The deadline is inclusive, so <= is correct.
Code rule: Each edge uses the destination's delay instead of its source's delay. → Changed graph: The phone chain is 0→1→2. Caller 0 waits 2 days, then caller 1 waits 3 more. → Reachable boundary: The child delays 3 and 0 differ from the caller delays 2 and 3.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses the listener's wait instead of the caller's
INCORRECT OUTPUT
3
CORRECT OUTPUT
2
Code rule: Each edge uses the destination's delay instead of its source's delay. → Changed graph: The phone chain is 0→1→2. Caller 0 waits 2 days, then caller 1 waits 3 more. → Reachable boundary: The child delays 3 and 0 differ from the caller delays 2 and 3. → Returned value: The code places person 2 on day 3 and counts all three; correctly person 2 hears on day 5, after the deadline.
```

### S4 case 2 — `deadline-four` · bug: Uses the listener's wait instead of the caller's
Input shown:
```
REAL PROBLEM INPUT
n=6, headId=0, caller=[-1,0,0,1,1,2], waitDays=[2,3,1,0,0,0], deadline=4
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const children = Array.from({ length: input.n }, () => []);
  for (let person = 0; person < input.n; person++) {
    if (person !== input.headId) {
      children[input.caller[person]].push(person);
    }
  }
  let onTime = 0;
  function spread(person, heardDay) {
    if (heardDay <= input.deadline) {
      onTime++;
    }
    for (const child of children[person]) {
      spread(child, heardDay + input.waitDays[child]);
    }
  }
  spread(input.headId, 0);
  return onTime;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1 (weight/label "+2"), 0→2 (weight/label "+2"), 1→3 (weight/label "+3"), 1→4 (weight/label "+3"), 2→5 (weight/label "+1")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of people informed by deadline" · expected buggy output `6` · real correct output `4`
Diagnosis choices as displayed:
- A The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call.
- B The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph.
- C The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [wrong-wait-owner] "The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call." — feedback: Exactly. Each edge uses the destination's delay instead of its source's delay. The shown code returns 6; the real problem returns 4.
- ❌ [deadline-strict] "The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph." — feedback: The deadline is inclusive, so <= is correct.
- ❌ [head-delay] "The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value." — feedback: The head already knows on day 0; their wait affects calls to children.
Graph proof shown in feedback: code rule "Each edge uses the destination's delay instead of its source's delay." → changed graph "Nodes are 0, 1, 2, 3, 4, 5; direct arrows are 0→1 (+2), 0→2 (+2), 1→3 (+3), 1→4 (+3), 2→5 (+1)." → boundary "listener-wait-time" → returned value "The shown code returns 6; the real problem returns 4."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses the listener's wait instead of the caller's
INCORRECT OUTPUT
6
CORRECT OUTPUT
4
Code rule: Each edge uses the destination's delay instead of its source's delay. → Changed graph: Nodes are 0, 1, 2, 3, 4, 5; direct arrows are 0→1 (+2), 0→2 (+2), 1→3 (+3), 1→4 (+3), 2→5 (+1). → Reachable boundary: listener-wait-time → Returned value: The shown code returns 6; the real problem returns 4.
```

### S4 case 3 — `head-only` · bug: Uses the listener's wait instead of the caller's
Input shown:
```
REAL PROBLEM INPUT
n=3, headId=2, caller=[2,2,-1], waitDays=[0,0,5], deadline=3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const children = Array.from({ length: input.n }, () => []);
  for (let person = 0; person < input.n; person++) {
    if (person !== input.headId) {
      children[input.caller[person]].push(person);
    }
  }
  let onTime = 0;
  function spread(person, heardDay) {
    if (heardDay <= input.deadline) {
      onTime++;
    }
    for (const child of children[person]) {
      spread(child, heardDay + input.waitDays[child]);
    }
  }
  spread(input.headId, 0);
  return onTime;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "2", "0", "1" · edges: 2→0 (weight/label "+5"), 2→1 (weight/label "+5")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of people informed by deadline" · expected buggy output `3` · real correct output `1`
Diagnosis choices as displayed:
- A The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph.
- B The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call.
- C The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [wrong-wait-owner] "The arrival day adds waitDays[child], but the caller's delay determines when that caller makes the call." — feedback: Exactly. Each edge uses the destination's delay instead of its source's delay. The shown code returns 3; the real problem returns 1.
- ❌ [deadline-strict] "The code uses <= and incorrectly includes people informed exactly on the deadline for the shown graph." — feedback: The deadline is inclusive, so <= is correct.
- ❌ [head-delay] "The head should first hear after waitDays[headId] instead of day 0, changing this input's returned value." — feedback: The head already knows on day 0; their wait affects calls to children.
Graph proof shown in feedback: code rule "Each edge uses the destination's delay instead of its source's delay." → changed graph "Nodes are 2, 0, 1; direct arrows are 2→0 (+5), 2→1 (+5)." → boundary "listener-wait-time" → returned value "The shown code returns 3; the real problem returns 1."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses the listener's wait instead of the caller's
INCORRECT OUTPUT
3
CORRECT OUTPUT
1
Code rule: Each edge uses the destination's delay instead of its source's delay. → Changed graph: Nodes are 2, 0, 1; direct arrows are 2→0 (+5), 2→1 (+5). → Reachable boundary: listener-wait-time → Returned value: The shown code returns 3; the real problem returns 1.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```