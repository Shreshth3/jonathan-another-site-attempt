# No Transfers, Please (`one-color-metro-ride`) — variant, undirected-graph

## Problem statement (Description tab)

A city metro has `n` stations, numbered `0` to `n - 1`. The list `tracks` describes the tracks: `tracks[i] = [u, v]` is a two-way track between stations `u` and `v`, and `colors[i]` is either `"red"` or `"blue"`, telling you which line that track belongs to.

You hate transferring between lines. Your whole trip, from start to end, must use tracks of **one single color**: either every track you ride is red, or every track you ride is blue.

Return `true` if you can travel from station `source` to station `destination` this way, and `false` otherwise. If `source` and `destination` are the same station, return `true`.

### Examples
- Example 1: input `n = 4, tracks = [[0,1],[1,3],[0,2],[2,3]], colors = ["red","red","blue","red"], source = 0, destination = 3` → output `true`. Using only red tracks, you can ride 0 -> 1 -> 3. So the trip works without ever touching a blue track.
- Example 2: input `n = 3, tracks = [[0,1],[1,2]], colors = ["red","blue"], source = 0, destination = 2` → output `false`. Red tracks alone only reach stations 0 and 1. Blue tracks alone leave you stuck at station 0. Reaching station 2 would require mixing colors, which is not allowed.

### Graph rules (authored)
- Nodes: Every station `0` through `n−1`, even if it has no track.
- Edges: One two-way u—v edge carrying exactly `colors[i]`.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-exact-map`, facet "exact input")
Raw input shown:
```
n = 5
tracks = [[0,1],[1,4],[0,2],[2,3],[3,4]]
colors = ["red","red","blue","blue","blue"]
source = 0, destination = 4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. Return false
2. Return true
Answer key + feedback per choice (data):
- ✅ CORRECT [true] "Return true"
    feedback: Correct. At least one complete one-color route exists.
- ❌ [false] "Return false"
    feedback: This misses both the all-red 0—1—4 route and the all-blue 0—2—3—4 route. (misconception: miss-valid-route)
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 [red], 1—4 [red], 0—2 [blue], 2—3 [blue], 3—4 [blue]
"Why" shown after success: There is an all-red route 0—1—4 and an all-blue route 0—2—3—4. Either one is enough.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`match-picture`, facet "exact input")
Raw input shown:
```
n = 4
tracks = [[0,1],[1,2],[2,3]]
colors = ["red","blue","blue"]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this input?**
Choices as displayed (top to bottom):
1. Picture A · correct colors, but arrows / 0 / 1 / 2 / 3
2. Picture C · four stations, but every track blue / 0 / 1 / 2 / 3
3. Picture B · four stations and three two-way tracks / 0 / 1 / 2 / 3
4. Picture D · omit station 3 and its last track / 0 / 1 / 2
Answer key + feedback per choice (data):
- ❌ [arrows] "Picture A · correct colors, but arrows" — picture: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1 [red], 1→2 [blue], 2→3 [blue]
    feedback: The endpoints and colors match, but the tracks are two-way, so arrows invent a restriction. (misconception: make-directed)
- ✅ CORRECT [exact] "Picture B · four stations and three two-way tracks" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1 [red], 1—2 [blue], 2—3 [blue]
    feedback: Correct. Every station, track, color, and direction matches.
- ❌ [all-blue] "Picture C · four stations, but every track blue" — picture: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1 [blue], 1—2 [blue], 2—3 [blue]
    feedback: The first color entry belongs to track [0,1], so that track must be red. (misconception: reuse-one-color)
- ❌ [drop-sink] "Picture D · omit station 3 and its last track" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [red], 1—2 [blue]
    feedback: Station 3 still exists and [2,3] is still an input track. (misconception: drop-last-station)
"Why" shown after success: The exact picture has all four stations, all three tracks, matching colors, and no arrows.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — BUILD (`build-mixed-map`, facet "one-color route")
Raw input shown:
```
n = 4
tracks = [[0,1],[1,2],[2,3]]
colors = ["red","blue","red"]
source = 0, destination = 3
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. Return false
2. Return true
Answer key + feedback per choice (data):
- ❌ [true] "Return true"
    feedback: This follows connectivity while ignoring that the only route changes colors twice. (misconception: combine-color-worlds)
- ✅ CORRECT [false] "Return false"
    feedback: Correct. No single color reaches from 0 to 3.
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [red], 1—2 [blue], 2—3 [red]
"Why" shown after success: The only route changes red → blue → red. The whole uncolored map is connected, but no one-color trip works.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q4 — CONCEPT (`no-color-mixing`, facet "one-color route")
Raw input shown:
```
source = 0, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **A student says: “0 connects to 2, so return true.” What is wrong?**
Picture under review: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [red], 1—2 [blue]
Choices as displayed (top to bottom):
1. A / The trip is invalid because 0 and 2 do not have one direct track
2. B / Station 1 belongs to the red map, so a blue track cannot touch it
3. C / The function should require both an all-red route and an all-blue route
4. D / The route changes color at station 1
Answer key + feedback per choice (data):
- ❌ [direct-only] "The trip is invalid because 0 and 2 do not have one direct track"
    feedback: The problem allows several tracks. The real issue is keeping one color. (misconception: require-direct-edge)
- ❌ [station-color] "Station 1 belongs to the red map, so a blue track cannot touch it"
    feedback: Colors belong to tracks, not stations. A station may touch both colors. (misconception: color-the-station)
- ✅ CORRECT [changes-color] "The route changes color at station 1"
    feedback: Correct. The only route transfers from red to blue.
- ❌ [need-both] "The function should require both an all-red route and an all-blue route"
    feedback: Either one-color map may succeed; both are not required. (misconception: require-both-colors)
"Why" shown after success: A path exists only in the combined map, so it requires an illegal transfer.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — CONCEPT (`two-way-tracks`, facet "two-way tracks")
Raw input shown:
```
n = 5
tracks = [[4,0]]
colors = ["blue"]
source = 0, destination = 4
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **A student drew tracks = [[4,0]] as an arrow. What is wrong?**
Picture under review: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 4→0 [blue]
Choices as displayed (top to bottom):
1. A / The arrow should point only from 0 to 4 because the trip starts at 0
2. B / The track is two-way, so the picture should use a line with no arrow
3. C / The track should be omitted because [4,0] does not begin at the source
4. D / The arrow is correct because [4,0] lists 4 before 0
Answer key + feedback per choice (data):
- ✅ CORRECT [two-way] "The track is two-way, so the picture should use a line with no arrow"
    feedback: Correct. Pair order names endpoints; it does not create direction.
- ❌ [reverse-arrow] "The arrow should point only from 0 to 4 because the trip starts at 0"
    feedback: The source does not change a track's direction. The track is two-way. (misconception: orient-from-source)
- ❌ [omit] "The track should be omitted because [4,0] does not begin at the source"
    feedback: The track exists regardless of which endpoint is written first. (misconception: drop-reverse-pair)
- ❌ [arrow-correct] "The arrow is correct because [4,0] lists 4 before 0"
    feedback: Pair order does not make an arrow in this problem. (misconception: infer-direction-from-order)
"Why" shown after success: [4,0] names the two endpoints of one two-way track.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-alternate-route`, facet "one-color route")
Raw input shown:
```
n = 6
tracks = [[0,1],[1,5],[0,2],[2,3],[3,4],[4,5],[1,2]]
colors = ["red","blue","blue","blue","blue","blue","red"]
source = 0, destination = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. Return false
2. Return true
Answer key + feedback per choice (data):
- ❌ [false] "Return false"
    feedback: This stops after the short mixed-color route and misses the longer all-blue route. (misconception: stop-after-first-route)
- ✅ CORRECT [true] "Return true"
    feedback: Correct. The longer route 0—2—3—4—5 is entirely blue.
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0—1 [red], 1—5 [blue], 0—2 [blue], 2—3 [blue], 3—4 [blue], 4—5 [blue], 1—2 [red]
"Why" shown after success: The short route 0—1—5 changes color, but the longer route 0—2—3—4—5 is entirely blue.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "one-color route")
Raw input shown:
```
source = 0, destination = 5
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Using this picture, what should the function return from 0 to 5?**
Picture under review: UNDIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0—1 [red], 1—3 [red], 3—5 [red], 0—2 [blue], 2—4 [blue], 4—3 [blue], 1—2 [red]
Choices as displayed (top to bottom):
1. A / false, because a route must exist in both color maps
2. B / false, because the first explored blue route does not reach 5
3. C / true, because the mixed route 0—2—4—3—5 reaches 5
4. D / true, because 0—1—3—5 is entirely red
Answer key + feedback per choice (data):
- ❌ [both] "false, because a route must exist in both color maps"
    feedback: Only one color needs a complete route. Red already succeeds. (misconception: require-both-colors)
- ✅ CORRECT [red-route] "true, because 0—1—3—5 is entirely red"
    feedback: Correct. This route keeps one color from start to finish.
- ❌ [blue-first] "false, because the first explored blue route does not reach 5"
    feedback: A failed blue search does not settle the answer; red still succeeds. (misconception: stop-after-first-color)
- ❌ [mixed-proof] "true, because the mixed route 0—2—4—3—5 reaches 5"
    feedback: That route is illegal. The answer is true for the separate all-red route. (misconception: justify-with-mixed-route)
"Why" shown after success: The route 0—1—3—5 stays red for the entire trip.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`build-same-station`, facet "boundary cases")
Raw input shown:
```
n = 5
tracks = [[0,1],[2,3]]
colors = ["red","blue"]
source = 2, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. Return true
2. Return false
Answer key + feedback per choice (data):
- ❌ [false] "Return false"
    feedback: This assumes every valid trip must use at least one track. Source already equals destination. (misconception: require-an-edge)
- ✅ CORRECT [true] "Return true"
    feedback: Correct. Staying at station 2 uses zero tracks and never mixes colors.
Graph the grader requires (hidden from student): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 [red], 2—3 [blue]
"Why" shown after success: Source already equals destination. Taking zero tracks never mixes colors, so the answer is true.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`counterexample`, facet "one-color route")
Raw input shown:
```
source = 0, destination = 2
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture best catches code that ignores colors and searches the combined map?**
Choices as displayed (top to bottom):
1. Picture C · a path exists only after mixing colors / 0 / 1 / 2
2. Picture A · an all-red path / 0 / 1 / 2
3. Picture B · destination disconnected / 0 / 1 / 2
4. Picture D · a direct blue path / 0 / 1 / 2
Answer key + feedback per choice (data):
- ❌ [all-red] "Picture A · an all-red path" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [red], 1—2 [red]
    feedback: Both correct and buggy code return true here, so this does not expose the bug. (misconception: test-happy-path)
- ❌ [disconnected] "Picture B · destination disconnected" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [blue]
    feedback: Both correct and buggy code return false here, so the bug stays hidden. (misconception: test-obvious-failure)
- ✅ CORRECT [mixed-only] "Picture C · a path exists only after mixing colors" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [red], 1—2 [blue]
    feedback: Correct. Combined search says true while the real one-color rule says false.
- ❌ [direct-blue] "Picture D · a direct blue path" — picture: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—2 [blue]
    feedback: Both correct and buggy code return true, so this cannot reveal color mixing. (misconception: test-another-happy-path)
"Why" shown after success: Only the mixed-only path makes the buggy combined search disagree with the correct answer.
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
#### After answering concept `match-picture` wrong with choice [arrows]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Picture B · four stations and three two-way tracks
Your choice: The endpoints and colors match, but the tracks are two-way, so arrows invent a restriction.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Prove exact input reading"
Remedial raw input:
```
n = 5
tracks = [[0,4],[1,2],[2,3]]
colors = ["blue","red","blue"]
source = 1, destination = 3
```
Remedial question: **What should the function return?** · choices shown: Return true | Return false
Remedial answer key: ❌ "Return true" — This combines the red and blue tracks into one illegal route.; ✅ "Return false" — Correct. The only 1-to-3 route changes colors.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—4 [blue], 1—2 [red], 2—3 [blue]
Remedial result: PASSED

#### After answering concept `no-color-mixing` wrong with choice [direct-only]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The route changes color at station 1
Your choice: The problem allows several tracks. The real issue is keeping one color.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Prove the no-transfer rule"
Remedial raw input:
```
n = 4
tracks = [[0,1],[1,2],[2,3]]
colors = ["blue","blue","red"]
source = 0, destination = 3
```
Remedial question: **What should the function return?** · choices shown: Return false | Return true
Remedial answer key: ✅ "Return false" — Correct. Blue reaches 2, but reaching 3 requires red.; ❌ "Return true" — This combines the blue prefix with the red final track.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [blue], 1—2 [blue], 2—3 [red]
Remedial result: PASSED

#### After answering concept `two-way-tracks` wrong with choice [reverse-arrow]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The track is two-way, so the picture should use a line with no arrow
Your choice: The source does not change a track's direction. The track is two-way.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Prove two-way travel"
Remedial raw input:
```
n = 4
tracks = [[3,1]]
colors = ["red"]
source = 1, destination = 3
```
Remedial question: **What should the function return?** · choices shown: Return false | Return true
Remedial answer key: ❌ "Return false" — This wrongly treats [3,1] as a one-way arrow.; ✅ "Return true" — Correct. The two-way track can be ridden from 1 to 3.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 3—1 [red]
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [both]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
true, because 0—1—3—5 is entirely red
Your choice: Only one color needs a complete route. Red already succeeds.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Prove the output from a fresh picture"
Remedial raw input:
```
n = 5
tracks = [[0,1],[1,4],[0,2],[2,4],[1,2]]
colors = ["red","blue","blue","blue","red"]
source = 0, destination = 4
```
Remedial question: **What should the function return?** · choices shown: Return true | Return false
Remedial answer key: ✅ "Return true" — Correct. 0—2—4 is entirely blue.; ❌ "Return false" — This notices a mixed short route but misses the all-blue route.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 [red], 1—4 [blue], 0—2 [blue], 2—4 [blue], 1—2 [red]
Remedial result: PASSED

#### After answering concept `counterexample` wrong with choice [all-red]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Picture C · a path exists only after mixing colors
Your choice: Both correct and buggy code return true here, so this does not expose the bug.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Build the counterexample"
Remedial raw input:
```
n = 4
tracks = [[0,1],[1,3],[0,2]]
colors = ["red","blue","blue"]
source = 0, destination = 3
```
Remedial question: **What should the correct function return?** · choices shown: Return true | Return false
Remedial answer key: ❌ "Return true" — This searches the combined graph and uses the mixed 0—1—3 route.; ✅ "Return false" — Correct. Neither single-color graph reaches 3.
Remedial required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [red], 1—3 [blue], 0—2 [blue]
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `red-only` (authored level "Blue line forgotten"; authored goal, NOT shown to student: "Give the rider a complete blue route and no complete red route.")
Everything the student sees (text):
```
J
Joel's broken search

Joel checks red routes but completely forgets that an all-blue route is also allowed.

Your main goal: Expose Joel's mistake. Draw two graphs: first the correct graph, then Joel's graph using the mistake.

CHOOSE THE SOURCE STATION
source station
OUTPUT
CORRECT OUTPUT
JOEL’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source station
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
2 · Joel's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE STATION / source station", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JOEL’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1 · edges (in drawing order) 0—1 [blue] · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: none
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1`; ❌ curly braces → `{0,1}`; ❌ quoted numbers/strings → `["0","1"]`; ❌ reversed order → `[1,0]`; ✅ spaces inside brackets → `[ 0 , 1 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
JOEL'S OUTPUT
[0]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `ignore-colors` (authored level "Illegal transfer"; authored goal, NOT shown to student: "Make the destination reachable only by switching track colors.")
Everything the student sees (text):
```
E
Eva's broken search

Eva erases track colors, so the search can illegally transfer between red and blue.

Your main goal: Expose Eva's mistake. Draw two graphs: first the correct graph, then Eva's graph using the mistake.

CHOOSE THE SOURCE STATION
source station
OUTPUT
CORRECT OUTPUT
EVA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source station
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
2 · Eva's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE STATION / source station", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | EVA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1]","buggy":"[0,1,2]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2 · edges (in drawing order) 0—1 [red], 1—2 [blue] · start 0
Grader's expected answers: correct output `[0,1]` · character's output `[0,1,2]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2 · edges: 0—1 [slate], 1—2 [slate]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1]
EVA'S OUTPUT
[0,1,2]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `first-branch` (authored level "Second same-color route"; authored goal, NOT shown to student: "Put a dead end before another same-color branch that reaches the destination.")
Everything the student sees (text):
```
C
Colin's broken search

Colin chooses the first route and forgets the other branches.

Your main goal: Expose Colin's mistake. Draw two graphs: first the correct graph, then Colin's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE SOURCE STATION
source station
OUTPUT
CORRECT OUTPUT
COLIN’S OUTPUT
Drawing 1 of 2: Correct graph · Choose source station
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
2 · Colin's graph
Check my graph
→
```
Start field: label "CHOOSE THE SOURCE STATION / source station", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | COLIN’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2,3]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: UNDIRECTED nodes 0, 1, 2, 3 · edges (in drawing order) 0—1 [red], 0—2 [red], 2—3 [red] · start 0
Grader's expected answers: correct output `[0,1,2,3]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1, 2, 3 · edges: 0—1 [red], 0—2 [red], 2—3 [red]
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2,3]
COLIN'S OUTPUT
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
n = 4
tracks = [[3,1]]
colors = ["red"]
source = 1, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 3—1 [red]
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each track, labeled by its two endpoints”"
    feedback if wrong: Tracks are the direct relations between station nodes, not the nodes themselves. Correct node rule: One node for each station number, including stations with no track
- [YES is correct] (direct-vs-reach) "3 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 3—1 as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 direct neighbor.
×
Tracks are the direct relations between station nodes, not the nodes themselves. Correct node rule: One node for each station number, including stations with no track
×
Correct. The mini-example lists 3—1 as one direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "0 has exactly 0 direct neighbors."
    feedback if wrong: 0 has 0 direct neighbors.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for each complete one-color route”"
    feedback if wrong: Routes are found by walking through the graph; they are not its basic nodes. Correct node rule: One node for each station number, including stations with no track
- [YES is correct] (direct-vs-reach) "3 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 3—1 as one direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
0 has 0 direct neighbors.
×
Routes are found by walking through the graph; they are not its basic nodes. Correct node rule: One node for each station number, including stations with no track
×
Correct. The mini-example lists 3—1 as one direct edge.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (membership) "Use this node rule for the graph: “One red copy and one blue copy of every station”"
    feedback if wrong: That duplicates one real station. Color is an edge property in the committed model. Correct node rule: One node for each station number, including stations with no track
- [NO is correct] (direct-vs-reach) "3 can reach 1, but there is no direct 3—1 edge."
    feedback if wrong: The mini-example lists 3—1 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
Feedback when claims are right but the graph is wrong:
```
Your three answers are right. Fix the graph below.
×
Every exact node is drawn
×
Every exact direct edge is drawn
✓
Edge direction matches
×
Edge colors match the input
```
Result: PASSED

### S3 Q2
Raw input shown:
```
n = 5
tracks = [[0,1],[1,4],[0,2],[2,4],[1,2]]
colors = ["red","blue","blue","blue","red"]
source = 0, destination = 4
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—1 [red], 1—4 [blue], 0—2 [blue], 2—4 [blue], 1—2 [red]
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "2 has exactly 4 direct neighbors."
    feedback if wrong: 2 has 3 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each complete one-color route”"
    feedback if wrong: Routes are found by walking through the graph; they are not its basic nodes. Correct node rule: One node for each station number, including stations with no track
- [NO is correct] (direct-vs-reach) "The correct graph has 0—1 and 1—4, so it should also contain a direct 0—4 edge."
    feedback if wrong: Two direct edges through 1 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q3
Raw input shown:
```
n = 4
tracks = [[0,1],[1,3],[0,2]]
colors = ["red","blue","blue"]
source = 0, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [red], 1—3 [blue], 0—2 [blue]
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 2 direct neighbors.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each track, labeled by its two endpoints”"
    feedback if wrong: Tracks are the direct relations between station nodes, not the nodes themselves. Correct node rule: One node for each station number, including stations with no track
- [NO is correct] (direct-vs-reach) "The correct graph has 1—0 and 0—2, so it should also contain a direct 1—2 edge."
    feedback if wrong: Two direct edges through 0 do not create a new shortcut. Only one-step relations defined by the problem become edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
n = 5
tracks = [[0,4],[1,2],[2,3]]
colors = ["blue","red","blue"]
source = 1, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—4 [blue], 1—2 [red], 2—3 [blue]
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One red copy and one blue copy of every station”"
    feedback if wrong: That duplicates one real station. Color is an edge property in the committed model. Correct node rule: One node for each station number, including stations with no track
- [YES is correct] (direct-vs-reach) "1 can reach 3 through 2, but the graph still has no direct 1—3 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "1 has exactly 1 direct neighbor."
    feedback if wrong: 1 has 1 direct neighbor.
Result: PASSED

### S3 Q5
Raw input shown:
```
n = 4
tracks = [[0,1],[1,2],[2,3]]
colors = ["blue","blue","red"]
source = 0, destination = 3
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [blue], 1—2 [blue], 2—3 [red]
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "3 has exactly 0 direct neighbors."
    feedback if wrong: 3 has 1 direct neighbor.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for each complete one-color route”"
    feedback if wrong: Routes are found by walking through the graph; they are not its basic nodes. Correct node rule: One node for each station number, including stations with no track
- [NO is correct] (direct-vs-reach) "The correct graph has 3—2 and 2—1, so it should also contain a direct 3—1 edge."
    feedback if wrong: Two direct edges through 2 do not create a new shortcut. Only one-step relations defined by the problem become edges.
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

### S4 case 1 — `authored-deep-case` · bug: Allows a transfer between line colors
Input shown:
```
REAL PROBLEM INPUT
n: 3
tracks: [[0, 1], [1, 2]]
colors: ["red", "blue"]
source: 0
destination: 2
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.tracks) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const visited = new Set([input.source]);
  const stack = [input.source];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.has(input.destination);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2" · edges: 0—1 [red], 1—2 [blue]
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The adjacency list drops each edge's color, so DFS freely changes from red to blue at station 1.
- B The code stores tracks only from the first station to the second, changing this input's returned value.
- C The code fails to handle source equal to destination, which changes how the shown graph is evaluated.
Diagnosis answer key + feedback:
- ✅ [color-blind-search] "The adjacency list drops each edge's color, so DFS freely changes from red to blue at station 1." — feedback: Correct. Connectivity in the uncolored graph is not a one-color trip.
- ❌ [directed-tracks] "The code stores tracks only from the first station to the second, changing this input's returned value." — feedback: Both directions are added for every track.
- ❌ [source-destination] "The code fails to handle source equal to destination, which changes how the shown graph is evaluated." — feedback: The source enters seen immediately, so that case would return true.
Graph proof shown in feedback: code rule "The code erases color labels and searches the combined graph." → changed graph "The only 0-to-2 route uses red edge 0—1 followed by blue edge 1—2." → boundary "A path exists only by transferring colors at the middle station." → returned value "The code returns true, while the no-transfer answer is false."
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
Edge colors match the input
×
The graph-level diagnosis is correct
✓
The incorrect solution's exact output is correct
About your diagnosis: Both directions are added for every track.
Code rule: The code erases color labels and searches the combined graph. → Changed graph: The only 0-to-2 route uses red edge 0—1 followed by blue edge 1—2. → Reachable boundary: A path exists only by transferring colors at the middle station.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Allows a transfer between line colors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: The code erases color labels and searches the combined graph. → Changed graph: The only 0-to-2 route uses red edge 0—1 followed by blue edge 1—2. → Reachable boundary: A path exists only by transferring colors at the middle station. → Returned value: The code returns true, while the no-transfer answer is false.
```

### S4 case 2 — `build-mixed-map` · bug: Allows a transfer between line colors
Input shown:
```
REAL PROBLEM INPUT
n = 4
tracks = [[0,1],[1,2],[2,3]]
colors = ["red","blue","red"]
source = 0, destination = 3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.tracks) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const visited = new Set([input.source]);
  const stack = [input.source];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.has(input.destination);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3" · edges: 0—1 [red], 1—2 [blue], 2—3 [red]
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The code stores tracks only from the first station to the second, changing this input's returned value.
- B The adjacency list drops each edge's color, so DFS freely changes from red to blue at station 1.
- C The code fails to handle source equal to destination, which changes how the shown graph is evaluated.
Diagnosis answer key + feedback:
- ✅ [color-blind-search] "The adjacency list drops each edge's color, so DFS freely changes from red to blue at station 1." — feedback: Exactly. The code erases color labels and searches the combined graph. The shown code returns true; the real problem returns false.
- ❌ [directed-tracks] "The code stores tracks only from the first station to the second, changing this input's returned value." — feedback: Both directions are added for every track.
- ❌ [source-destination] "The code fails to handle source equal to destination, which changes how the shown graph is evaluated." — feedback: The source enters seen immediately, so that case would return true.
Graph proof shown in feedback: code rule "The code erases color labels and searches the combined graph." → changed graph "Nodes are 0, 1, 2, 3; direct edges are 0—1, 1—2, 2—3." → boundary "ignore-track-colors" → returned value "The shown code returns true; the real problem returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Allows a transfer between line colors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: The code erases color labels and searches the combined graph. → Changed graph: Nodes are 0, 1, 2, 3; direct edges are 0—1, 1—2, 2—3. → Reachable boundary: ignore-track-colors → Returned value: The shown code returns true; the real problem returns false.
```

### S4 case 3 — `prove-exact-input` · bug: Allows a transfer between line colors
Input shown:
```
REAL PROBLEM INPUT
n = 5
tracks = [[0,4],[1,2],[2,3]]
colors = ["blue","red","blue"]
source = 1, destination = 3
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [firstValue, secondValue] of input.tracks) {
    graph[firstValue].push(secondValue);
    graph[secondValue].push(firstValue);
  }
  const visited = new Set([input.source]);
  const stack = [input.source];
  while (stack.length) {
    const node = stack.pop();
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
  return visited.has(input.destination);
}
```
Required graph (hidden from student; labels must match EXACTLY): UNDIRECTED · nodes: "0", "1", "2", "3", "4" · edges: 0—4 [blue], 1—2 [red], 2—3 [blue]
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "boolean" · expected buggy output `true` · real correct output `false`
Diagnosis choices as displayed:
- A The code stores tracks only from the first station to the second, changing this input's returned value.
- B The code fails to handle source equal to destination, which changes how the shown graph is evaluated.
- C The adjacency list erases colors, so DFS changes from red to blue at station 2 on route 1—2—3.
Diagnosis answer key + feedback:
- ✅ [color-blind-search] "The adjacency list erases colors, so DFS changes from red to blue at station 2 on route 1—2—3." — feedback: Exactly. No single color covers both edges, but the uncolored graph still connects source 1 to destination 3.
- ❌ [directed-tracks] "The code stores tracks only from the first station to the second, changing this input's returned value." — feedback: Both directions are added for every track.
- ❌ [source-destination] "The code fails to handle source equal to destination, which changes how the shown graph is evaluated." — feedback: The source enters seen immediately, so that case would return true.
Graph proof shown in feedback: code rule "The code erases color labels and searches the combined graph." → changed graph "Nodes are 0, 1, 2, 3, 4; direct edges are 0—4, 1—2, 2—3." → boundary "The only source-to-destination route changes color at station 2." → returned value "The shown code returns true; the real problem returns false."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Allows a transfer between line colors
INCORRECT OUTPUT
true
CORRECT OUTPUT
false
Code rule: The code erases color labels and searches the combined graph. → Changed graph: Nodes are 0, 1, 2, 3, 4; direct edges are 0—4, 1—2, 2—3. → Reachable boundary: The only source-to-destination route changes color at station 2. → Returned value: The shown code returns true; the real problem returns false.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```