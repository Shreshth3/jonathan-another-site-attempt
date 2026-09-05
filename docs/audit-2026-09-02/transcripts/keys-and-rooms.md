# Keys and Rooms (`keys-and-rooms`) — original, directed-graph

## Problem statement (Description tab)

You are given `n` rooms labeled from `0` to `n - 1`. Every room is locked except room `0`, which is where you start.

Inside each room there is a set of keys lying on the floor. `rooms[i]` is the list of keys found in room `i`, and each key is just a room number: a key with the number `j` on it lets you open room `j` whenever you want.

You can walk between rooms freely — the only thing stopping you is a locked door. When you enter a room, you pick up all of its keys and can then use them to open more rooms.

Return `true` if you can eventually enter every room, and `false` otherwise.

### Examples
- Example 1: input `rooms = [[1],[2],[3],[]]` → output `true`. Start in room 0 and grab the key to room 1. In room 1 grab the key to room 2, and in room 2 grab the key to room 3. Every room gets visited.
- Example 2: input `rooms = [[1,3],[3,0,1],[2],[0]]` → output `false`. The only key to room 2 is sitting inside room 2 itself, so we can never get in.

### Graph rules (authored)
- Nodes: Rooms 0, 1, and 2, including locked room 2 that no key reaches.
- Edges: Draw one arrow 0→1 because room 0 directly contains key 1.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-chain`, facet "reach all rooms")
Raw input shown:
```
rooms = [[1],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Keys found later continue the route until every room is reached.
- ❌ [near-miss] "false"
    feedback: That result follows the check only start room keys bug, not the exact picture. (misconception: check-only-start-room-keys)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→3
"Why" shown after success: Keys found later continue the route until every room is reached.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-locked`, facet "reach all rooms")
Raw input shown:
```
rooms = [[1],[0],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. true
2. false
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. Room 2 has a key, but no reachable room gives access to room 2.
- ❌ [near-miss] "true"
    feedback: That result follows the start search in every room bug, not the exact picture. (misconception: start-search-in-every-room)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→0, 2→3
"Why" shown after success: Room 2 has a key, but no reachable room gives access to room 2.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact room lists")
Raw input shown:
```
rooms = [[1],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3
2. Picture A / 0 / 1 / 2 / 3
3. Picture C / 0 / 1 / 2 / 3
4. Picture D / 0 / 1 / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 1→2, 2→3
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 1→2
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 1→0, 2→1, 3→2
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-back-key`, facet "key direction")
Raw input shown:
```
rooms = [[],[0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "false"
    feedback: Correct. A key stored in locked room 1 cannot help you enter room 1 from room 0.
- ❌ [near-miss] "true"
    feedback: That result follows the treat keys as undirected bug, not the exact picture. (misconception: treat-keys-as-undirected)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 1→0
"Why" shown after success: A key stored in locked room 1 cannot help you enter room 1 from room 0.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "room identity")
Raw input shown:
```
For `rooms = [[1],[],[]]`, which room nodes belong in the graph?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For rooms = [[1],[],[]], which room nodes belong in the graph?**
Choices as displayed (top to bottom):
1. A / Only rooms 0 and 1 because those are reachable from the unlocked room.
2. B / Rooms 0, 1, and 2, including locked room 2 that no key reaches.
3. C / One node for each key found inside a room.
4. D / Only locked rooms 1 and 2; room 0 is just the starting point.
Answer key + feedback per choice (data):
- ✅ CORRECT [all-room-indices] "Rooms 0, 1, and 2, including locked room 2 that no key reaches."
    feedback: Correct. Every array index is a room; reachability is what the search must discover.
- ❌ [reachable] "Only rooms 0 and 1 because those are reachable from the unlocked room."
    feedback: Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass. (misconception: omit-unreachable-room)
- ❌ [keys] "One node for each key found inside a room."
    feedback: A key names a destination room and creates an arrow; the rooms are the visited nodes. (misconception: key-as-node)
- ❌ [locked-only] "Only locked rooms 1 and 2; room 0 is just the starting point."
    feedback: The start is also a room node and must be marked visited. (misconception: exclude-start-room)
"Why" shown after success: Correct. Every array index is a room; reachability is what the search must discover.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-one-room`, facet "room identity")
Raw input shown:
```
rooms = [[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. false
2. true
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "true"
    feedback: Correct. Room 0 starts unlocked, so the only room is already visited.
- ❌ [near-miss] "false"
    feedback: That result follows the require at least one key bug, not the exact picture. (misconception: require-at-least-one-key)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0" · edges: none
"Why" shown after success: Room 0 starts unlocked, so the only room is already visited.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "key direction")
Raw input shown:
```
If room 0 contains key 1, but room 1 contains no key 0, what should be drawn?
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If room 0 contains key 1, but room 1 contains no key 0, what should be drawn?**
Choices as displayed (top to bottom):
1. A / One arrow 1→0 because key 1 was found in room 0.
2. B / A two-way line 0—1 because a key connects the rooms.
3. C / Also draw arrows from 0 to every room that room 1 can later unlock.
4. D / Draw one arrow 0→1 because room 0 directly contains key 1.
Answer key + feedback per choice (data):
- ✅ CORRECT [zero-to-one] "Draw one arrow 0→1 because room 0 directly contains key 1."
    feedback: Correct. Entering room 0 gives access to room 1, not automatically the reverse.
- ❌ [one-to-zero] "One arrow 1→0 because key 1 was found in room 0."
    feedback: The room holding the key is the arrow's start; the key number is its destination. (misconception: reverse-key-arrow)
- ❌ [two-way] "A two-way line 0—1 because a key connects the rooms."
    feedback: Keys are directional permissions. Room 1 has no key that opens room 0. (misconception: make-key-undirected)
- ❌ [key-chain-shortcut] "Also draw arrows from 0 to every room that room 1 can later unlock."
    feedback: Those rooms may be reachable by a path, but they are not direct keys lying in room 0. (misconception: turn-key-path-into-edge)
"Why" shown after success: Correct. Entering room 0 gives access to room 1, not automatically the reverse.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "reach all rooms")
Raw input shown:
```
rooms = [[1],[2],[3],[]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which graph reasoning is correct for this case?**
Choices as displayed (top to bottom):
1. A / room 0 lacks keys 2 and 3
2. B / keys found later continue the chain 0→1→2→3
3. C / there is no key back to room 0
4. D / all room links work both ways
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "keys found later continue the chain 0→1→2→3"
    feedback: Correct. Keys form the chain 0→1→2→3.
- ❌ [false-direct] "room 0 lacks keys 2 and 3"
    feedback: Keys found later continue the reachability chain. (misconception: check-only-room-zero)
- ❌ [false-return] "there is no key back to room 0"
    feedback: Returning to room 0 is unnecessary. (misconception: require-reverse-key)
- ❌ [true-undirected] "all room links work both ways"
    feedback: The answer is true, but keys are directed, not two-way. (misconception: treat-keys-undirected)
"Why" shown after success: Correct. Keys form the chain 0→1→2→3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "reach all rooms")
Raw input shown:
```
rooms = [[1,3],[3,0,1],[2],[0]]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In rooms=[[1,3],[3,0,1],[2],[0]], why is the answer false?**
Choices as displayed (top to bottom):
1. A / Room 3 is unreachable from room 0.
2. B / Room 0 is locked and has no starting key.
3. C / Every room opens because every number appears somewhere as a key.
4. D / Room 2 is unreachable because its only key is locked inside room 2.
Answer key + feedback per choice (data):
- ✅ CORRECT [room-two] "Room 2 is unreachable because its only key is locked inside room 2."
    feedback: Correct. A self-key cannot provide first entry.
- ❌ [room-three] "Room 3 is unreachable from room 0."
    feedback: Room 0 directly contains key 3. (misconception: miss-direct-key)
- ❌ [room-zero] "Room 0 is locked and has no starting key."
    feedback: Room 0 begins unlocked. (misconception: forget-start-unlocked)
- ❌ [all-open] "Every room opens because every number appears somewhere as a key."
    feedback: A key is useful only if its containing room can first be entered. (misconception: ignore-key-reachability)
"Why" shown after success: Correct. A self-key cannot provide first entry.
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
rooms = [[1,2],[],[]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "true" — Correct. Room 0 directly unlocks both other rooms.; ❌ "false" — That result follows the follow only first key bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [reachable]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Rooms 0, 1, and 2, including locked room 2 that no key reaches.
Your choice: Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
rooms = [[1],[],[1]]
```
Remedial question: **What should the function return?** · choices shown: true | false
Remedial answer key: ✅ "false" — Correct. Room 1 exists with no keys; room 2 also exists but cannot be entered.; ❌ "true" — That result follows the drop room with empty key list bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→1
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [one-to-zero]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Draw one arrow 0→1 because room 0 directly contains key 1.
Your choice: The room holding the key is the arrow's start; the key number is its destination.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
rooms = [[1],[],[0]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Room 2 stays locked even though it contains another key to room 1.; ❌ "true" — That result follows the reverse incoming key bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→0
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [false-direct]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
keys found later continue the chain 0→1→2→3
Your choice: Keys found later continue the reachability chain.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
rooms = [[1],[0,2],[3],[]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "true" — Correct. The 0↔1 cycle does not block the extra key from 1 to 2.; ❌ "false" — That result follows the stop when cycle seen bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→0, 1→2, 2→3
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [room-three]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Room 2 is unreachable because its only key is locked inside room 2.
Your choice: Room 0 directly contains key 3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
rooms = [[1],[0],[3],[2]]
```
Remedial question: **What should the function return?** · choices shown: false | true
Remedial answer key: ✅ "false" — Correct. Every room number appears in some key list, but rooms 2 and 3 are in a locked component.; ❌ "true" — That result follows the count all mentioned keys as reachable bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→0, 2→3, 3→2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Key works backward"; authored goal, NOT shown to student: "Put a key in a locked room so treating its arrow as two-way falsely opens it.")
Everything the student sees (text):
```
E
Elena's broken search

Elena forgets that the listed connections have a direction.

Your main goal: Expose Elena's mistake. Draw two graphs: first the correct graph, then Elena's graph using the mistake.

CHOOSE THE UNLOCKED ROOM
unlocked room
OUTPUT
CORRECT OUTPUT
ELENA’S OUTPUT
Drawing 1 of 2: Correct graph · Unlocked room: 0
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
2 · Elena's graph
Check my graph
→
```
Start field: label "CHOOSE THE UNLOCKED ROOM / unlocked room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | ELENA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3"): accepted
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
ELENA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `drop-last-edge` (authored level "Last key misplaced"; authored goal, NOT shown to student: "Make the final listed key the only way into one room.")
Everything the student sees (text):
```
M
Micah's broken search

Micah accidentally leaves the final direct link out of the graph.

Your main goal: Expose Micah's mistake. Draw two graphs: first the correct graph, then Micah's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE UNLOCKED ROOM
unlocked room
OUTPUT
CORRECT OUTPUT
MICAH’S OUTPUT
Drawing 1 of 2: Correct graph · Unlocked room: 0
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
2 · Micah's graph
Check my graph
→
```
Start field: label "CHOOSE THE UNLOCKED ROOM / unlocked room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MICAH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
MICAH'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Doorway not revisited"; authored goal, NOT shown to student: "Place keys for two room chains in the starting room.")
Everything the student sees (text):
```
G
Gia's broken search

Gia stops the whole search when its first branch ends.

Your main goal: Expose Gia's mistake. Draw two graphs: first the correct graph, then Gia's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE UNLOCKED ROOM
unlocked room
OUTPUT
CORRECT OUTPUT
GIA’S OUTPUT
Drawing 1 of 2: Correct graph · Unlocked room: 0
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
2 · Gia's graph
Check my graph
→
```
Start field: label "CHOOSE THE UNLOCKED ROOM / unlocked room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | GIA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0→1, 0→2, 2→3 · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 0→2, 2→3
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
GIA'S OUTPUT
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
rooms = [[1],[0,2],[3],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→0, 1→2, 2→3
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only locked rooms 1 and 2; room 0 is just the starting point.”"
    feedback if wrong: The start is also a room node and must be marked visited. Correct node rule: One node for every room index, including rooms no key can reach.
- [YES is correct] (direct-vs-reach) "0 can reach 2 through 1, but the graph still has no direct 0→2 edge."
    feedback if wrong: Right. A multi-step route through 1 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The start is also a room node and must be marked visited. Correct node rule: One node for every room index, including rooms no key can reach.
×
Right. A multi-step route through 1 creates reachability, not a new direct edge.
×
0 has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only rooms 0 and 1 because those are reachable from the unlocked room.”"
    feedback if wrong: Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass. Correct node rule: One node for every room index, including rooms no key can reach.
- [NO is correct] (direct-vs-reach) "The correct graph has 1→2 and 2→3, so it should also contain a direct 1→3 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3 has exactly 1 outgoing direct edge."
    feedback if wrong: 3 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass. Correct node rule: One node for every room index, including rooms no key can reach.
×
Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
3 has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 2 outgoing direct edges."
    feedback if wrong: 2 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each key found inside a room.”"
    feedback if wrong: A key names a destination room and creates an arrow; the rooms are the visited nodes. Correct node rule: One node for every room index, including rooms no key can reach.
- [NO is correct] (direct-vs-reach) "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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
rooms = [[1],[0],[3],[2]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→0, 2→3, 3→2
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "3 has exactly 1 outgoing direct edge."
    feedback if wrong: 3 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only rooms 0 and 1 because those are reachable from the unlocked room.”"
    feedback if wrong: Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass. Correct node rule: One node for every room index, including rooms no key can reach.
- [YES is correct] (direct-vs-reach) "3 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 3→2 as one direct edge.
Result: PASSED

### S3 Q3
Raw input shown:
```
rooms = [[1,2],[],[]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only locked rooms 1 and 2; room 0 is just the starting point.”"
    feedback if wrong: The start is also a room node and must be marked visited. Correct node rule: One node for every room index, including rooms no key can reach.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→1 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
rooms = [[1],[],[1]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each key found inside a room.”"
    feedback if wrong: A key names a destination room and creates an arrow; the rooms are the visited nodes. Correct node rule: One node for every room index, including rooms no key can reach.
- [YES is correct] (direct-vs-reach) "2 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 2→1 as one direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
rooms = [[1],[],[0]]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→0
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has 2→0 and 0→1, so it should also contain a direct 2→1 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "0 has exactly 2 outgoing direct edges."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only rooms 0 and 1 because those are reachable from the unlocked room.”"
    feedback if wrong: Room 2 still exists. Omitting it would make the all-rooms check incorrectly pass. Correct node rule: One node for every room index, including rooms no key can reach.
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

### S4 case 1 — `authored-deep-case` · bug: Keys are treated like two-way doors
Input shown:
```
REAL PROBLEM INPUT
rooms = [[],[0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canVisitAllRooms(rooms) {
  const graph = rooms.map((keys) => keys.slice());
  for (let room = 0; room < rooms.length; room++) {
    for (const key of rooms[room]) {
      graph[key].push(room);
    }
  }

  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size === rooms.length;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "room 0", "room 1" · edges: room 1→room 0 (weight/label "key 0")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every room can be visited" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Room 0 should begin locked like every other room.
- B It invents a reverse move for every key.
- C A key must be removed after one use on the shown input.
Diagnosis answer key + feedback:
- ✅ [reverse-keys] "It invents a reverse move for every key." — feedback: Correct. The key in locked room 1 can open room 0, but room 0 contains no key to room 1.
- ❌ [start-locked] "Room 0 should begin locked like every other room." — feedback: No. The problem says room 0 starts unlocked.
- ❌ [consume-key] "A key must be removed after one use on the shown input." — feedback: No. A room needs to be entered only once, and key consumption would not make room 1 reachable here.
Graph proof shown in feedback: code rule "Every key arrow is copied in reverse." → changed graph "The only key arrow is room 1→room 0; there is no arrow leaving room 0." → boundary "The only useful-looking connection points into the start room." → returned value "The invented 0→1 arrow makes both rooms appear reachable, changing false to true."
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
✓
Edge labels or weights match the input
×
The graph-level diagnosis is correct
✓
The incorrect solution's exact output is correct
About your diagnosis: No. The problem says room 0 starts unlocked.
Code rule: Every key arrow is copied in reverse. → Changed graph: The only key arrow is room 1→room 0; there is no arrow leaving room 0. → Reachable boundary: The only useful-looking connection points into the start room.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Keys are treated like two-way doors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every key arrow is copied in reverse. → Changed graph: The only key arrow is room 1→room 0; there is no arrow leaving room 0. → Reachable boundary: The only useful-looking connection points into the start room. → Returned value: The invented 0→1 arrow makes both rooms appear reachable, changing false to true.
```

### S4 case 2 — `remedial-2` · bug: Keys are treated like two-way doors
Input shown:
```
REAL PROBLEM INPUT
rooms = [[1],[],[1]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canVisitAllRooms(rooms) {
  const graph = rooms.map((keys) => keys.slice());
  for (let room = 0; room < rooms.length; room++) {
    for (const key of rooms[room]) {
      graph[key].push(room);
    }
  }

  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size === rooms.length;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→1
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every room can be visited" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A Room 0 should begin locked like every other room.
- B A key must be removed after one use on the shown input.
- C It invents a reverse move for every key.
Diagnosis answer key + feedback:
- ✅ [reverse-keys] "It invents a reverse move for every key." — feedback: Correct. Room 0 opens room 1, but room 2 is unreachable; reversing key 2→1 invents a path from reached room 1 into locked room 2. Therefore the shown code returns true, while the real problem returns false.
- ❌ [start-locked] "Room 0 should begin locked like every other room." — feedback: No. The problem says room 0 starts unlocked.
- ❌ [consume-key] "A key must be removed after one use on the shown input." — feedback: No. A room needs to be entered only once, and key consumption would not make room 1 reachable here.
Graph proof shown in feedback: code rule "Every key arrow is copied in reverse." → changed graph "Nodes: 0, 1, 2. Direct arrows: 0→1; 2→1." → boundary "Room 0 opens room 1, but room 2 is unreachable; reversing key 2→1 invents a path from reached room 1 into locked room 2." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Keys are treated like two-way doors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every key arrow is copied in reverse. → Changed graph: Nodes: 0, 1, 2. Direct arrows: 0→1; 2→1. → Reachable boundary: Room 0 opens room 1, but room 2 is unreachable; reversing key 2→1 invents a path from reached room 1 into locked room 2. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

### S4 case 3 — `remedial-3` · bug: Keys are treated like two-way doors
Input shown:
```
REAL PROBLEM INPUT
rooms = [[1],[],[0]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function canVisitAllRooms(rooms) {
  const graph = rooms.map((keys) => keys.slice());
  for (let room = 0; room < rooms.length; room++) {
    for (const key of rooms[room]) {
      graph[key].push(room);
    }
  }

  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    for (const next of graph[stack.pop()]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.size === rooms.length;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 2→0
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Boolean: whether every room can be visited" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A It invents a reverse move for every key.
- B Room 0 should begin locked like every other room.
- C A key must be removed after one use on the shown input.
Diagnosis answer key + feedback:
- ✅ [reverse-keys] "It invents a reverse move for every key." — feedback: Correct. Room 0 opens room 1, while locked room 2 holds a key back to 0; the invented reverse of 2→0 wrongly opens room 2. Therefore the shown code returns true, while the real problem returns false.
- ❌ [start-locked] "Room 0 should begin locked like every other room." — feedback: No. The problem says room 0 starts unlocked.
- ❌ [consume-key] "A key must be removed after one use on the shown input." — feedback: No. A room needs to be entered only once, and key consumption would not make room 1 reachable here.
Graph proof shown in feedback: code rule "Every key arrow is copied in reverse." → changed graph "Nodes: 0, 1, 2. Direct arrows: 0→1; 2→0." → boundary "Room 0 opens room 1, while locked room 2 holds a key back to 0; the invented reverse of 2→0 wrongly opens room 2." → returned value "The shown code returns true; the source-repo reference solution returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Keys are treated like two-way doors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: Every key arrow is copied in reverse. → Changed graph: Nodes: 0, 1, 2. Direct arrows: 0→1; 2→0. → Reachable boundary: Room 0 opens room 1, while locked room 2 holds a key back to 0; the invented reverse of 2→0 wrongly opens room 2. → Returned value: The shown code returns true; the source-repo reference solution returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```