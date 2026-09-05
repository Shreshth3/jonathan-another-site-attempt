# Gold in the Locked Dungeon (`dungeon-gold-run`) — variant, directed-graph

## Problem statement (Description tab)

You are exploring a dungeon with `n` rooms numbered `0` to `n - 1`. Every room is locked except room `0`, which is where you start.

`rooms[i]` is the list of keys lying in room `i`. A key with number `k` opens room `k`. Room `i` also holds `gold[i]` gold coins. When you enter a room, you take **all** of its keys and **all** of its gold.

You may walk back and forth between rooms as much as you like, and you may enter any room whose key you are carrying.

Return the total number of gold coins you can collect.

### Examples
- Example 1: input `rooms = [[1],[2],[]], gold = [5,3,10]` → output `18`. Start in room 0 (5 coins) and grab key 1. Enter room 1 (3 coins) and grab key 2. Enter room 2 (10 coins). Total: 5 + 3 + 10 = 18.
- Example 2: input `rooms = [[1],[],[1]], gold = [2,7,50]` → output `9`. Start in room 0 (2 coins) and grab key 1. Enter room 1 (7 coins), which has no keys. No key 2 exists anywhere, so the 50 coins in room 2 are out of reach. Total: 2 + 7 = 9.

### Graph rules (authored)
- Nodes: Each room index, including reachable zero-gold rooms and unreachable rooms.
- Edges: A one-way arrow `i → k`, because entering i lets you unlock room k.
- Node-name format shown in Step 1/3: Name each room `roomIndex:goldAmountg`. Example: `2:5g`. Do not add spaces. (pattern `^\d+:\d+g$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`case-1`, facet "reachable gold sum")
Raw input shown:
```
rooms=[[1,2],[3],[3],[4],[]], gold=[1,2,3,4,5]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How much gold is collected starting in room 0?**
Choices as displayed (top to bottom):
1. 6
2. 15
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "15"
    feedback: Correct. The rooms reachable from 0 contain 15 total gold, counted once each.
- ❌ [bug] "6"
    feedback: This counts only room 0 and its direct keys, stopping before later rooms. (misconception: direct-rooms-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:1g", "1:2g", "2:3g", "3:4g", "4:5g" · edges: 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g
"Why" shown after success: The rooms reachable from 0 contain 15 total gold, counted once each.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact room keys")
Raw input shown:
```
rooms=[[1,2],[3],[3],[4],[]], gold=[1,2,3,4,5]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0:1g / 1:2g / 2:3g / 3:4g / 4:5g
2. Picture C / 0:1g / 1:2g / 2:3g / 3:4g / 4:5g
3. Picture A / 0:1g / 1:2g / 2:3g / 3:4g / 4:5g
4. Picture D / 0:1g / 1:2g / 2:3g / 3:4g
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0:1g, 1:2g, 2:3g, 3:4g, 4:5g · edges: 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0:1g, 1:2g, 2:3g, 3:4g, 4:5g · edges: 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g
    feedback: This drops a direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0:1g, 1:2g, 2:3g, 3:4g, 4:5g · edges: 1:2g→0:1g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g
    feedback: This reverses one listed arrow. (misconception: reverse-listed-arrow)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0:1g, 1:2g, 2:3g, 3:4g · edges: 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: The exact picture preserves every entity and every direct relation.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`concept-node`, facet "room identity")
Raw input shown:
```
rooms = [[1,3],[2],[1],[],[5],[4]], gold = [5,10,1,8,50,50]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is one node in the dungeon graph?**
Choices as displayed (top to bottom):
1. A / Only rooms holding at least one piece of gold.
2. B / Each room index, including reachable zero-gold rooms and unreachable rooms.
3. C / Each key found in the dungeon.
4. D / Only rooms already known to be reachable from room 0.
Answer key + feedback per choice (data):
- ✅ CORRECT [rooms] "Each room index, including reachable zero-gold rooms and unreachable rooms."
    feedback: Correct. Gold is a value on a room; keys determine which room nodes can be reached.
- ❌ [positive-rooms] "Only rooms holding at least one piece of gold."
    feedback: A zero-gold room may contain a key leading to more gold, so it cannot be omitted. (misconception: drop-zero-gold)
- ❌ [keys] "Each key found in the dungeon."
    feedback: A key describes a directed connection. The room it opens is the destination node. (misconception: key-as-node)
- ❌ [reachable-only] "Only rooms already known to be reachable from room 0."
    feedback: Reachability is what DFS must discover after the whole room graph is modeled. (misconception: precompute-reachable)
"Why" shown after success: Correct. Gold is a value on a room; keys determine which room nodes can be reached.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`case-2`, facet "reachable gold sum")
Raw input shown:
```
rooms=[[1],[2],[3],[]], gold=[2,4,6,8]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How much gold is collected starting in room 0?**
Choices as displayed (top to bottom):
1. 20
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "20"
    feedback: Correct. The rooms reachable from 0 contain 20 total gold, counted once each.
- ❌ [bug] "6"
    feedback: This counts only room 0 and its direct keys, stopping before later rooms. (misconception: direct-rooms-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g" · edges: 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g
"Why" shown after success: The rooms reachable from 0 contain 20 total gold, counted once each.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-edge`, facet "key-arrow direction")
Raw input shown:
```
rooms = [[1,3],[2],[1],[],[5],[4]], gold = [5,10,1,8,50,50]
Focus on one listed relation.
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If room i contains key k, which connection is real?**
Choices as displayed (top to bottom):
1. A / A one-way arrow i → k, because entering i lets you unlock room k.
2. B / A one-way arrow k → i, because k is written as the key value.
3. C / A two-way edge between i and k, like a hallway.
4. D / Add i → k only when room k contains more gold than room i.
Answer key + feedback per choice (data):
- ✅ CORRECT [i-to-k] "A one-way arrow `i → k`, because entering i lets you unlock room k."
    feedback: Correct. Keys create directed travel from their containing room to the opened room.
- ❌ [k-to-i] "A one-way arrow `k → i`, because k is written as the key value."
    feedback: That reverses what the key does. The key found in i opens k. (misconception: reverse-key)
- ❌ [both] "A two-way edge between i and k, like a hallway."
    feedback: A key grants entry in one direction; room k need not contain a key back to i. (misconception: keys-undirected)
- ❌ [gold-condition] "Add `i → k` only when room k contains more gold than room i."
    feedback: Gold affects the total, not whether a key opens a room. (misconception: gold-controls-edge)
"Why" shown after success: Correct. Keys create directed travel from their containing room to the opened room.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`case-3`, facet "reachable gold sum")
Raw input shown:
```
rooms=[[1,2],[4],[3],[],[]], gold=[3,6,9,12,15]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How much gold is collected starting in room 0?**
Choices as displayed (top to bottom):
1. 18
2. 45
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "45"
    feedback: Correct. The rooms reachable from 0 contain 45 total gold, counted once each.
- ❌ [bug] "18"
    feedback: This counts only room 0 and its direct keys, stopping before later rooms. (misconception: direct-rooms-only)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:3g", "1:6g", "2:9g", "3:12g", "4:15g" · edges: 0:3g→1:6g, 0:3g→2:9g, 1:6g→4:15g, 2:9g→3:12g
"Why" shown after success: The rooms reachable from 0 contain 45 total gold, counted once each.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "reachable gold sum")
Raw input shown:
```
rooms = [[1,3],[2],[1],[],[5],[4]], gold = [5,10,1,8,50,50]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **From room 0, rooms 0,1,2,3 are reachable with gold 5,10,1,8; rooms 4 and 5 are locked away with 50 each. What total is collected?**
Choices as displayed (top to bottom):
1. A / 124
2. B / 24
3. C / 23
4. D / 15
Answer key + feedback per choice (data):
- ✅ CORRECT [twenty-four] "`24`"
    feedback: Correct. The reachable rooms contribute 5 + 10 + 1 + 8.
- ❌ [one-twenty-four] "`124`"
    feedback: That includes 100 gold from unreachable rooms 4 and 5. (misconception: count-unreachable)
- ❌ [twenty-three] "`23`"
    feedback: Room 2 is reachable and contributes its 1 gold even though its key points backward. (misconception: skip-cycle-room)
- ❌ [fifteen] "`15`"
    feedback: That stops after rooms 0 and 1 and misses keys leading to rooms 2 and 3. (misconception: direct-rooms-only)
"Why" shown after success: Correct. The reachable rooms contribute 5 + 10 + 1 + 8.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-counterexample`, facet "reachable gold sum")
Raw input shown:
```
rooms = [[0],[2],[1]], gold = [7,3,3]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Room 0 has 7 gold and only a key back to room 0. Rooms 1 and 2 are unreachable. What total is collected?**
Choices as displayed (top to bottom):
1. A / 14
2. B / 13
3. C / 7
4. D / 0
Answer key + feedback per choice (data):
- ✅ CORRECT [seven] "`7`"
    feedback: Correct. The self-key adds no new room, so only room 0 is looted.
- ❌ [fourteen] "`14`"
    feedback: A key back to room 0 must not count room 0's gold twice. (misconception: double-count-self-loop)
- ❌ [thirteen] "`13`"
    feedback: Rooms 1 and 2 cannot be entered from room 0. (misconception: count-all-rooms)
- ❌ [zero] "`0`"
    feedback: Room 0 is reachable immediately and its 7 gold is collected. (misconception: self-loop-invalidates-start)
"Why" shown after success: Correct. The self-key adds no new room, so only room 0 is looted.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`case-4`, facet "reachable gold sum")
Raw input shown:
```
rooms=[[]], gold=[1]
```
Node-name guide shown: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How much gold is collected starting in room 0?**
Choices as displayed (top to bottom):
1. 1
2. 0
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. The rooms reachable from 0 contain 1 total gold, counted once each.
- ❌ [bug] "0"
    feedback: This sums only newly unlocked rooms and forgets that room 0 is already open and its gold counts. (misconception: exclude-start-room)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0:1g" · edges: none
"Why" shown after success: The rooms reachable from 0 contain 1 total gold, counted once each.
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
rooms=[[1,2],[4],[4],[],[]], gold=[2,4,6,8,10]
```
Remedial question: **How much gold is collected starting in room 0?** · choices shown: 30 | 22
Remedial answer key: ✅ "22" — Correct. The rooms reachable from 0 contain 22 total gold, counted once each.; ❌ "30" — This sums gold in rooms that no key chain from room 0 can open.
Remedial required graph (hidden): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g", "4:10g" · edges: 0:2g→1:4g, 1:4g→4:10g, 0:2g→2:6g, 2:6g→4:10g
Remedial result: PASSED

#### After answering concept `concept-node` wrong with choice [positive-rooms]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Each room index, including reachable zero-gold rooms and unreachable rooms.
Your choice: A zero-gold room may contain a key leading to more gold, so it cannot be omitted.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Name the real entities"
Remedial raw input:
```
rooms=[[1,2],[3],[3],[]], gold=[3,6,9,12]
```
Remedial question: **How much gold is collected starting in room 0?** · choices shown: 30 | 18
Remedial answer key: ✅ "30" — Correct. The rooms reachable from 0 contain 30 total gold, counted once each.; ❌ "18" — This counts only room 0 and its direct keys, stopping before later rooms.
Remedial required graph (hidden): DIRECTED · nodes: "0:3g", "1:6g", "2:9g", "3:12g" · edges: 0:3g→1:6g, 0:3g→2:9g, 1:6g→3:12g, 2:9g→3:12g
Remedial result: PASSED

#### After answering concept `concept-edge` wrong with choice [k-to-i]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A one-way arrow i → k, because entering i lets you unlock room k.
Your choice: That reverses what the key does. The key found in i opens k.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Read one direct relation"
Remedial raw input:
```
rooms=[[1],[2],[],[4],[]], gold=[1,2,3,4,5]
```
Remedial question: **How much gold is collected starting in room 0?** · choices shown: 15 | 6
Remedial answer key: ✅ "6" — Correct. The rooms reachable from 0 contain 6 total gold, counted once each.; ❌ "15" — This sums gold in rooms that no key chain from room 0 can open.
Remedial required graph (hidden): DIRECTED · nodes: "0:1g", "1:2g", "2:3g", "3:4g", "4:5g" · edges: 0:1g→1:2g, 1:2g→2:3g, 3:4g→4:5g
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [one-twenty-four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
24
Your choice: That includes 100 gold from unreachable rooms 4 and 5.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict a fresh output"
Remedial raw input:
```
rooms=[[3,1],[2],[3],[]], gold=[2,4,6,8]
```
Remedial question: **How much gold is collected starting in room 0?** · choices shown: 20 | 14
Remedial answer key: ✅ "20" — Correct. The rooms reachable from 0 contain 20 total gold, counted once each.; ❌ "14" — This counts only room 0 and its direct keys, stopping before later rooms.
Remedial required graph (hidden): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g" · edges: 0:2g→3:8g, 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g
Remedial result: PASSED

#### After answering concept `concept-counterexample` wrong with choice [fourteen]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
7
Your choice: A key back to room 0 must not count room 0's gold twice.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a realistic bug"
Remedial raw input:
```
rooms=[[1],[2],[4],[],[]], gold=[3,6,9,12,15]
```
Remedial question: **How much gold is collected starting in room 0?** · choices shown: 45 | 33
Remedial answer key: ✅ "33" — Correct. The rooms reachable from 0 contain 33 total gold, counted once each.; ❌ "45" — This sums gold in rooms that no key chain from room 0 can open.
Remedial required graph (hidden): DIRECTED · nodes: "0:3g", "1:6g", "2:9g", "3:12g", "4:15g" · edges: 0:3g→1:6g, 1:6g→2:9g, 2:9g→4:15g
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `make-two-way` (authored level "Key used backward"; authored goal, NOT shown to student: "Use a key arrow whose reverse would unlock extra gold illegally.")
Everything the student sees (text):
```
H
Haley's broken search

Haley walks backward across arrows that only point forward.

Your main goal: Expose Haley's mistake. Draw two graphs: first the correct graph, then Haley's graph using the mistake.

CHOOSE THE STARTING ROOM
starting room
OUTPUT
CORRECT OUTPUT
HALEY’S OUTPUT
Drawing 1 of 2: Correct graph · Starting room: 0
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
2 · Haley's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING ROOM / starting room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | HALEY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0:1g", "1:2g", "2:3g", "3:4g", "4:5g"): REJECTED with "Use numeric IDs 0, 1, 2, ... with no gaps."
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
HALEY'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `wrong-start` (authored level "Wrong dungeon entrance"; authored goal, NOT shown to student: "List a locked room first so the declared starting room cannot be ignored.")
Everything the student sees (text):
```
M
Miguel's broken search

Miguel ignores the chosen starting room and uses a different one.

Your main goal: Expose Miguel's mistake. Draw two graphs: first the correct graph, then Miguel's graph using the mistake.

CHOOSE THE STARTING ROOM
starting room
OUTPUT
CORRECT OUTPUT
MIGUEL’S OUTPUT
Drawing 1 of 2: Correct graph · Starting room: 0
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
2 · Miguel's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING ROOM / starting room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MIGUEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
MIGUEL'S OUTPUT
[1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Key left behind"; authored goal, NOT shown to student: "Make the final key arrow unlock a room that changes the reachable gold.")
Everything the student sees (text):
```
M
Mya's broken search

Mya builds every listed connection except the last one.

Your main goal: Expose Mya's mistake. Draw two graphs: first the correct graph, then Mya's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE STARTING ROOM
starting room
OUTPUT
CORRECT OUTPUT
MYA’S OUTPUT
Drawing 1 of 2: Correct graph · Starting room: 0
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
2 · Mya's graph
Check my graph
→
```
Start field: label "CHOOSE THE STARTING ROOM / starting room", placeholder "Example: 0", prefilled "0", readonly=true
Output labels: CORRECT OUTPUT | MYA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
MYA'S OUTPUT
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
rooms=[[1],[2],[4],[],[]], gold=[3,6,9,12,15]
```
Node-name guide: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:3g", "1:6g", "2:9g", "3:12g", "4:15g" · edges: 0:3g→1:6g, 1:6g→2:9g, 2:9g→4:15g
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "4:15g has exactly 1 outgoing direct edge."
    feedback if wrong: 4:15g has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Each key found in the dungeon.”"
    feedback if wrong: A key describes a directed connection. The room it opens is the destination node. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [NO is correct] (direct-vs-reach) "The correct graph has 0:3g→1:6g and 1:6g→2:9g, so it should also contain a direct 0:3g→2:9g edge."
    feedback if wrong: Two direct edges through 1:6g do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
4:15g has 0 outgoing direct edges.
×
A key describes a directed connection. The room it opens is the destination node. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
×
Two direct edges through 1:6g do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (local-degree) "3:12g has exactly 1 outgoing direct edge."
    feedback if wrong: 3:12g has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only rooms already known to be reachable from room 0.”"
    feedback if wrong: Reachability is what DFS must discover after the whole room graph is modeled. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [NO is correct] (direct-vs-reach) "The correct graph has 1:6g→2:9g and 2:9g→4:15g, so it should also contain a direct 1:6g→4:15g edge."
    feedback if wrong: Two direct edges through 2:9g do not create a new shortcut. Only one-step relations defined by the problem become edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
3:12g has 0 outgoing direct edges.
×
Reachability is what DFS must discover after the whole room graph is modeled. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
×
Two direct edges through 2:9g do not create a new shortcut. Only one-step relations defined by the problem become edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only rooms holding at least one piece of gold.”"
    feedback if wrong: A zero-gold room may contain a key leading to more gold, so it cannot be omitted. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [YES is correct] (direct-vs-reach) "0:3g can reach 2:9g through 1:6g, but the graph still has no direct 0:3g→2:9g edge."
    feedback if wrong: Right. A multi-step route through 1:6g creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2:9g has exactly 1 outgoing direct edge."
    feedback if wrong: 2:9g has 1 outgoing direct edge.
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
rooms=[[1,2],[4],[4],[],[]], gold=[2,4,6,8,10]
```
Node-name guide: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g", "4:10g" · edges: 0:2g→1:4g, 1:4g→4:10g, 0:2g→2:6g, 2:6g→4:10g
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "4:10g has exactly 1 outgoing direct edge."
    feedback if wrong: 4:10g has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only rooms already known to be reachable from room 0.”"
    feedback if wrong: Reachability is what DFS must discover after the whole room graph is modeled. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [NO is correct] (direct-vs-reach) "The correct graph has 0:2g→2:6g and 2:6g→4:10g, so it should also contain a direct 0:2g→4:10g edge."
    feedback if wrong: Two direct edges through 2:6g do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
rooms=[[1,2],[3],[3],[]], gold=[3,6,9,12]
```
Node-name guide: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:3g", "1:6g", "2:9g", "3:12g" · edges: 0:3g→1:6g, 0:3g→2:9g, 1:6g→3:12g, 2:9g→3:12g
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Each key found in the dungeon.”"
    feedback if wrong: A key describes a directed connection. The room it opens is the destination node. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [YES is correct] (direct-vs-reach) "0:3g can reach 3:12g through 1:6g, but the graph still has no direct 0:3g→3:12g edge."
    feedback if wrong: Right. A multi-step route through 1:6g creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "2:9g has exactly 1 outgoing direct edge."
    feedback if wrong: 2:9g has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
rooms=[[1],[2],[],[4],[]], gold=[1,2,3,4,5]
```
Node-name guide: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:1g", "1:2g", "2:3g", "3:4g", "4:5g" · edges: 0:1g→1:2g, 1:2g→2:3g, 3:4g→4:5g
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “Only rooms holding at least one piece of gold.”"
    feedback if wrong: A zero-gold room may contain a key leading to more gold, so it cannot be omitted. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [NO is correct] (direct-vs-reach) "The correct graph has 0:1g→1:2g and 1:2g→2:3g, so it should also contain a direct 0:1g→2:3g edge."
    feedback if wrong: Two direct edges through 1:2g do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "3:4g has exactly 0 outgoing direct edges."
    feedback if wrong: 3:4g has 1 outgoing direct edge.
Result: PASSED

### S3 Q5
Raw input shown:
```
rooms=[[3,1],[2],[3],[]], gold=[2,4,6,8]
```
Node-name guide: Required node-name format: Name each room roomIndex:goldAmountg. Example: 2:5g. Do not add spaces. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g" · edges: 0:2g→3:8g, 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0:2g has exactly 2 outgoing direct edges."
    feedback if wrong: 0:2g has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only rooms already known to be reachable from room 0.”"
    feedback if wrong: Reachability is what DFS must discover after the whole room graph is modeled. Correct node rule: Each room index, including reachable zero-gold rooms and unreachable rooms.
- [YES is correct] (direct-vs-reach) "0:2g can reach 2:6g through 1:4g, but the graph still has no direct 0:2g→2:6g edge."
    feedback if wrong: Right. A multi-step route through 1:4g creates reachability, not a new direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Uses only the starting keyring
Input shown:
```
REAL PROBLEM INPUT
rooms: [[1], [2], []]
gold: [5, 3, 10]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  let total = 0;
  for (const key of input.startKeys || [0]) {
    if (opened.has(key)) {
      continue;
    }
    opened.add(key);
    total += input.gold[key];
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "total gold" · expected buggy output `5` · real correct output `18`
Diagnosis choices as displayed:
- A Opening a room adds its gold but never adds that room's newly found keys to the worklist.
- B The code collects a room's gold every time a duplicate key appears for the shown graph.
- C The code interprets a key in room i as an arrow back into i, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [no-key-expansion] "Opening a room adds its gold but never adds that room's newly found keys to the worklist." — feedback: Correct. Key 1 leads to key 2, so all three rooms open.
- ❌ [double-gold] "The code collects a room's gold every time a duplicate key appears for the shown graph." — feedback: The opened set prevents duplicate collection.
- ❌ [reverse-key-edge] "The code interprets a key in room i as an arrow back into i, changing this input's returned value." — feedback: The code never reads rooms at all, so no key edge is followed in either direction.
Graph proof shown in feedback: code rule "Only the initial key 0 is opened; outgoing key edges are ignored." → changed graph "Room 0 points to 1, and room 1 points to 2." → boundary "Most gold lies beyond a two-edge key chain." → returned value "Only 5 gold from room 0 is counted instead of 5+3+10=18."
Output-format probes: ❌ quoted number → `"5"`; ❌ trailing period → `5.`
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
About your diagnosis: The opened set prevents duplicate collection.
Code rule: Only the initial key 0 is opened; outgoing key edges are ignored. → Changed graph: Room 0 points to 1, and room 1 points to 2. → Reachable boundary: Most gold lies beyond a two-edge key chain.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses only the starting keyring
INCORRECT OUTPUT
5
CORRECT OUTPUT
18
Code rule: Only the initial key 0 is opened; outgoing key edges are ignored. → Changed graph: Room 0 points to 1, and room 1 points to 2. → Reachable boundary: Most gold lies beyond a two-edge key chain. → Returned value: Only 5 gold from room 0 is counted instead of 5+3+10=18.
```

### S4 case 2 — `case-1` · bug: Uses only the starting keyring
Input shown:
```
REAL PROBLEM INPUT
rooms=[[1,2],[3],[3],[4],[]], gold=[1,2,3,4,5]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  let total = 0;
  for (const key of input.startKeys || [0]) {
    if (opened.has(key)) {
      continue;
    }
    opened.add(key);
    total += input.gold[key];
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:1g", "1:2g", "2:3g", "3:4g", "4:5g" · edges: 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "total gold" · expected buggy output `1` · real correct output `15`
Diagnosis choices as displayed:
- A The code collects a room's gold every time a duplicate key appears for the shown graph.
- B Opening a room adds its gold but never adds that room's newly found keys to the worklist.
- C The code interprets a key in room i as an arrow back into i, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [no-key-expansion] "Opening a room adds its gold but never adds that room's newly found keys to the worklist." — feedback: Exactly. Only the initial key 0 is opened; outgoing key edges are ignored. The shown code returns 1; the real problem returns 15.
- ❌ [double-gold] "The code collects a room's gold every time a duplicate key appears for the shown graph." — feedback: The opened set prevents duplicate collection.
- ❌ [reverse-key-edge] "The code interprets a key in room i as an arrow back into i, changing this input's returned value." — feedback: The code never reads rooms at all, so no key edge is followed in either direction.
Graph proof shown in feedback: code rule "Only the initial key 0 is opened; outgoing key edges are ignored." → changed graph "Nodes are 0:1g, 1:2g, 2:3g, 3:4g, 4:5g; direct arrows are 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g." → boundary "ignore-found-keys" → returned value "The shown code returns 1; the real problem returns 15."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses only the starting keyring
INCORRECT OUTPUT
1
CORRECT OUTPUT
15
Code rule: Only the initial key 0 is opened; outgoing key edges are ignored. → Changed graph: Nodes are 0:1g, 1:2g, 2:3g, 3:4g, 4:5g; direct arrows are 0:1g→1:2g, 0:1g→2:3g, 1:2g→3:4g, 2:3g→3:4g, 3:4g→4:5g. → Reachable boundary: ignore-found-keys → Returned value: The shown code returns 1; the real problem returns 15.
```

### S4 case 3 — `case-2` · bug: Uses only the starting keyring
Input shown:
```
REAL PROBLEM INPUT
rooms=[[1],[2],[3],[]], gold=[2,4,6,8]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  let total = 0;
  for (const key of input.startKeys || [0]) {
    if (opened.has(key)) {
      continue;
    }
    opened.add(key);
    total += input.gold[key];
  }
  return total;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0:2g", "1:4g", "2:6g", "3:8g" · edges: 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "total gold" · expected buggy output `2` · real correct output `20`
Diagnosis choices as displayed:
- A The code adds room 0's gold again after following the key chain back to an already opened room.
- B The code interprets a key in room i as an arrow back into i, changing this input's returned value.
- C Opening a room adds its gold but never adds that room's newly found keys to the worklist.
Diagnosis answer key + feedback:
- ✅ [no-key-expansion] "Opening a room adds its gold but never adds that room's newly found keys to the worklist." — feedback: Exactly. Only the initial key 0 is opened; outgoing key edges are ignored. The shown code returns 2; the real problem returns 20.
- ❌ [double-gold] "The code adds room 0's gold again after following the key chain back to an already opened room." — feedback: This input is a one-way chain with no key returning to room 0, and the opened set would prevent a duplicate anyway.
- ❌ [reverse-key-edge] "The code interprets a key in room i as an arrow back into i, changing this input's returned value." — feedback: The code never reads rooms at all, so no key edge is followed in either direction.
Graph proof shown in feedback: code rule "Only the initial key 0 is opened; outgoing key edges are ignored." → changed graph "Nodes are 0:2g, 1:4g, 2:6g, 3:8g; direct arrows are 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g." → boundary "ignore-found-keys" → returned value "The shown code returns 2; the real problem returns 20."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Uses only the starting keyring
INCORRECT OUTPUT
2
CORRECT OUTPUT
20
Code rule: Only the initial key 0 is opened; outgoing key edges are ignored. → Changed graph: Nodes are 0:2g, 1:4g, 2:6g, 3:8g; direct arrows are 0:2g→1:4g, 1:4g→2:6g, 2:6g→3:8g. → Reachable boundary: ignore-found-keys → Returned value: The shown code returns 2; the real problem returns 20.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```