# The Night Guard's Keyring (`museum-vault-keyring`) — variant, directed-graph

## Problem statement (Description tab)

You are the night guard at a museum with `n` vaults, numbered `0` to `n - 1`. Vault `i` can only be opened with key number `i`.

You start your shift holding a small keyring: the list `startKeys` tells you which key numbers you already have. Inside each vault there may be more keys lying around: `vaults[i]` is the list of key numbers found inside vault `i`. The moment you open a vault, you pick up every key inside it and may use those keys right away.

You can walk between vaults freely and open them in any order, as long as you have the matching key.

Return the total number of **different** vaults you are able to open.

### Examples
- Example 1: input `vaults = [[1],[2],[],[0]], startKeys = [0]` → output `3`. You start with key 0, so you open vault 0 and find key 1. With key 1 you open vault 1 and find key 2. With key 2 you open vault 2, which is empty. Key 3 does not exist anywhere, so vault 3 stays shut. You opened vaults 0, 1, and 2, which is 3 vaults.
- Example 2: input `vaults = [[],[0],[],[]], startKeys = [3]` → output `1`. You start with key 3 and open vault 3, which is empty. Key 0 is locked inside vault 1, but you never find key 1, so you can never get it. Only 1 vault gets opened.

### Graph rules (authored)
- Nodes: Every vault index `0` through `n−1`, whether initially openable or not.
- Edges: `i → j`, because after opening i you can open vault j.
- Node-name format shown in Step 1/3: Use each node's 0-based number only. Example: `2`. (pattern `^\d+$`)
- Step 2 node-label rule: `contiguous-zero` — Use numeric IDs 0, 1, 2, ... with no gaps.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`two-starts`, facet "distinct reachable vault count")
Raw input shown:
```
vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many distinct vaults open?**
Choices as displayed (top to bottom):
1. 5
2. 6
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "5"
    feedback: Correct. The union is {0,1,2,3,5}; vault 4 stays sealed.
- ❌ [bug] "6"
    feedback: This adds reach counts from both starts and double-counts vault 2. (misconception: double-count-overlapping-reach)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1, 1→2, 3→2, 3→5
"Why" shown after success: The union is {0,1,2,3,5}; vault 4 stays sealed.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`cycle`, facet "vault-to-key arrows")
Raw input shown:
```
vaults=[[1],[2],[0],[]], startKeys=[1]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many distinct vaults open?**
Choices as displayed (top to bottom):
1. 4
2. 3
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "3"
    feedback: Correct. Vaults 1,2,0 open once each; vault 3 is unreachable.
- ❌ [bug] "4"
    feedback: This counts a repeated opening in the cycle as a new vault. (misconception: count-revisited-vault)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→0
"Why" shown after success: Vaults 1,2,0 open once each; vault 3 is unreachable.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`concept-picture`, facet "exact vault contents")
Raw input shown:
```
vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture B / 0 / 1 / 2 / 3 / 4 / 5
2. Picture C / 0 / 1 / 2 / 3 / 4 / 5
3. Picture D / 0 / 1 / 2 / 3 / 4
4. Picture A / 0 / 1 / 2 / 3 / 4 / 5
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0→1, 1→2, 3→2, 3→5
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 0→1, 1→2, 3→2
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4, 5 · edges: 1→0, 2→1, 2→3, 5→3
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: 0, 1, 2, 3, 4 · edges: 0→1, 1→2, 3→2
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — CONCEPT (`concept-nodes`, facet "vault identity")
Raw input shown:
```
vaults=[[1],[2],[0],[]], startKeys=[1]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What should each node represent in the vault map?**
Picture under review: DIRECTED · nodes: 0, 1, 2, 3 · edges: 0→1, 1→2, 2→0
Choices as displayed (top to bottom):
1. A / Only vaults named in startKeys.
2. B / Each physical key, even when two vaults contain a key for the same vault.
3. C / One node for the entire starting keyring and one for each vault's key collection.
4. D / Every vault index 0 through n−1, whether initially openable or not.
Answer key + feedback per choice (data):
- ✅ CORRECT [vaults] "Every vault index `0` through `n−1`, whether initially openable or not."
    feedback: Correct. Starting keys choose roots, and discovered keys may reach other vault nodes.
- ❌ [start-vaults] "Only vaults named in `startKeys`."
    feedback: Those are only the starting points. Keys inside them may unlock many other vaults. (misconception: roots-only)
- ❌ [keys] "Each physical key, even when two vaults contain a key for the same vault."
    feedback: The key identifies a destination vault. Reachability is tracked by vault, not by duplicate key objects. (misconception: key-instance-as-node)
- ❌ [keyrings] "One node for the entire starting keyring and one for each vault's key collection."
    feedback: Collections describe outgoing edges; individual vault indexes are the search states. (misconception: collection-as-node)
"Why" shown after success: Correct. Starting keys choose roots, and discovered keys may reach other vault nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q5 — BUILD (`locked-key`, facet "exact vault contents")
Raw input shown:
```
vaults=[[],[0],[]], startKeys=[2]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many distinct vaults open?**
Choices as displayed (top to bottom):
1. 1
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Only starting key 2 is usable.
- ❌ [bug] "2"
    feedback: This uses key 0 from locked vault 1 without opening vault 1 first. (misconception: collect-keys-from-locked-vaults)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1", "2" · edges: 1→0
"Why" shown after success: Only starting key 2 is usable.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q6 — CONCEPT (`concept-relations`, facet "vault-to-key arrows")
Raw input shown:
```
vaults=[[],[0],[]], startKeys=[2]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If vault i contains key j, what arrow belongs in the graph?**
Picture under review: DIRECTED · nodes: 0, 1, 2 · edges: 1→0
Choices as displayed (top to bottom):
1. A / j → i, because the key is labeled j.
2. B / i → j, because after opening i you can open vault j.
3. C / A two-way edge i—j, since opening either vault reveals the connection.
4. D / Keep the edge only if i is named in startKeys.
Answer key + feedback per choice (data):
- ✅ CORRECT [i-to-j] "`i → j`, because after opening i you can open vault j."
    feedback: Correct. Keys make directed reachability from containing vault to unlocked vault.
- ❌ [j-to-i] "`j → i`, because the key is labeled j."
    feedback: The label tells which vault opens; the key is found in i, so travel is i to j. (misconception: reverse-key)
- ❌ [two-way] "A two-way edge i—j, since opening either vault reveals the connection."
    feedback: Vault j need not contain a key back to i. Key access is one-way. (misconception: make-keys-undirected)
- ❌ [start-only-edges] "Keep the edge only if i is named in `startKeys`."
    feedback: A later-opened vault's keys can continue the chain and must remain in the graph. (misconception: discard-deep-keys)
"Why" shown after success: Correct. Keys make directed reachability from containing vault to unlocked vault.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q7 — CONCEPT (`concept-output`, facet "distinct reachable vault count")
Raw input shown:
```
vaults = [[1],[2],[],[2,5],[],[]], startKeys = [0,3]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many distinct vaults can the starting keyring eventually open?**
Choices as displayed (top to bottom):
1. A / 5
2. B / 6
3. C / 7
4. D / 2
Answer key + feedback per choice (data):
- ✅ CORRECT [five] "`5`"
    feedback: Correct. The union is {0,1,2,3,5}.
- ❌ [six] "`6`"
    feedback: No opened vault contains key 4. (misconception: assume-all-open)
- ❌ [seven] "`7`"
    feedback: Vault 2 is reached from both chains but must be counted once. (misconception: double-count-shared-vault)
- ❌ [two] "`2`"
    feedback: Starting keys open roots that reveal more keys; they are not the only opened vaults. (misconception: start-keys-only)
"Why" shown after success: Correct. The union is {0,1,2,3,5}.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — BUILD (`duplicate-start`, facet "vault identity")
Raw input shown:
```
vaults=[[1],[]], startKeys=[0,0]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "1 · Draw the graph"
Question shown: **How many distinct vaults open?**
Choices as displayed (top to bottom):
1. 3
2. 2
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "2"
    feedback: Correct. Distinct vaults 0 and 1 open once each.
- ❌ [bug] "3"
    feedback: This counts vault 0 twice because startKeys repeats key 0. (misconception: count-duplicate-start-keys)
Graph the grader requires (hidden from student): DIRECTED · nodes: "0", "1" · edges: 0→1
"Why" shown after success: Distinct vaults 0 and 1 open once each.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q9 — CONCEPT (`concept-bug`, facet "distinct reachable vault count")
Raw input shown:
```
vaults = [[1],[2],[0],[]], startKeys = [1]
```
Node-name guide shown: Required node-name format: Use each node's 0-based number only. Example: 2.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many distinct vaults can the starting keyring eventually open?**
Choices as displayed (top to bottom):
1. A / 3
2. B / 4
3. C / 2
4. D / 1
Answer key + feedback per choice (data):
- ✅ CORRECT [three] "`3`"
    feedback: Correct. Vaults 1, 2, and 0 open once each.
- ❌ [four] "`4`"
    feedback: The key cycle never provides key 3. (misconception: cycle-reaches-all)
- ❌ [two] "`2`"
    feedback: That counts only newly discovered vaults 2 and 0 but forgets that starting vault 1 is open too. (misconception: exclude-start-vault)
- ❌ [one] "`1`"
    feedback: Vault 1 contains key 2, and that chain continues to vault 0. (misconception: start-only)
"Why" shown after success: Correct. Vaults 1, 2, and 0 open once each.
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
vaults=[[1],[],[3],[]], startKeys=[2]
```
Remedial question: **How many distinct vaults open?** · choices shown: 2 | 4
Remedial answer key: ✅ "2" — Correct. Start key 2 opens vaults 2 and 3 only.; ❌ "4" — This starts a search from every vault rather than startKeys.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 2→3
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [start-vaults]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Every vault index 0 through n−1, whether initially openable or not.
Your choice: Those are only the starting points. Keys inside them may unlock many other vaults.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
vaults=[[1],[],[]], startKeys=[0]
```
Remedial question: **How many vault nodes exist?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Every list index is a vault.; ❌ "2" — This drops empty unreachable vault 2 from the input model.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [j-to-i]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
i → j, because after opening i you can open vault j.
Your choice: The label tells which vault opens; the key is found in i, so travel is i to j.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
vaults=[[],[0]], startKeys=[0]
```
Remedial question: **How many distinct vaults open?** · choices shown: 2 | 1
Remedial answer key: ✅ "1" — Correct. Vault 0 is empty; vault 1 stays sealed.; ❌ "2" — This reverses arrow 1→0 and invents key 1 inside vault 0.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
5
Your choice: No opened vault contains key 4.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
vaults=[[2],[],[1]], startKeys=[0]
```
Remedial question: **How many distinct vaults open?** · choices shown: 3 | 2
Remedial answer key: ✅ "3" — Correct. Opening 0 yields 2, then opening 2 yields 1.; ❌ "2" — This counts only direct keys from the starting vault.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2, 2→1
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [four]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
3
Your choice: The key cycle never provides key 3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
vaults=[[1,2],[2],[]], startKeys=[0]
```
Remedial question: **How many distinct vaults open?** · choices shown: 2 | 3
Remedial answer key: ✅ "3" — Correct. All three vaults open; duplicate discovery of key 2 changes nothing.; ❌ "2" — This marks key 2 seen when discovered but fails to count vault 2 when opened.
Remedial required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Key in the last vault"; authored goal, NOT shown to student: "Make the final key arrow unlock one additional vault.")
Everything the student sees (text):
```
J
Juliana's broken search

Juliana accidentally leaves the final direct link out of the graph.

Your main goal: Expose Juliana's mistake. Draw two graphs: first the correct graph, then Juliana's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE INITIAL KEY
initial key
OUTPUT
CORRECT OUTPUT
JULIANA’S OUTPUT
Drawing 1 of 2: Correct graph · Choose initial key
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
2 · Juliana's graph
Check my graph
→
```
Start field: label "CHOOSE THE INITIAL KEY / initial key", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JULIANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("0", "1", "2", "3", "4", "5"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[0,1,2]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1, 2 · edges (in drawing order) 0→1, 1→2 · start 0
Grader's expected answers: correct output `[0,1,2]` · character's output `[0,1]` · character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `0, 1, 2`; ❌ curly braces → `{0,1,2}`; ❌ quoted numbers/strings → `["0","1","2"]`; ❌ reversed order → `[2,1,0]`; ✅ spaces inside brackets → `[ 0 , 1 , 2 ]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0,1,2]
JULIANA'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `make-two-way` (authored level "Key works backward"; authored goal, NOT shown to student: "Use an arrow whose reverse would open a vault without owning its key.")
Everything the student sees (text):
```
E
Elias's broken search

Elias forgets that the listed connections have a direction.

Your main goal: Expose Elias's mistake. Draw two graphs: first the correct graph, then Elias's graph using the mistake.

CHOOSE THE INITIAL KEY
initial key
OUTPUT
CORRECT OUTPUT
ELIAS’S OUTPUT
Drawing 1 of 2: Correct graph · Choose initial key
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
2 · Elias's graph
Check my graph
→
```
Start field: label "CHOOSE THE INITIAL KEY / initial key", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | ELIAS’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[0]","buggy":"[0,1]"}
Graph the harness submitted as the correct graph: DIRECTED nodes 0, 1 · edges (in drawing order) 1→0 · start 0
Grader's expected answers: correct output `[0]` · character's output `[0,1]` · character's graph must be exactly: UNDIRECTED · nodes: 0, 1 · edges: 1—0
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
[0]
ELIAS'S OUTPUT
[0,1]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Different starting key"; authored goal, NOT shown to student: "Give an initial key that is not the first vault listed.")
Everything the student sees (text):
```
S
Shelby's broken search

Shelby runs the search from a different initial key.

Your main goal: Expose Shelby's mistake. Draw two graphs: first the correct graph, then Shelby's graph using the mistake.

CHOOSE THE INITIAL KEY
initial key
OUTPUT
CORRECT OUTPUT
SHELBY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose initial key
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
2 · Shelby's graph
Check my graph
→
```
Start field: label "CHOOSE THE INITIAL KEY / initial key", placeholder "Example: 0", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | SHELBY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
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
SHELBY'S OUTPUT
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
vaults=[[],[0]], startKeys=[0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1" · edges: 1→0
Claims, variant 0 (answered wrong on purpose):
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One node for the entire starting keyring and one for each vault's key collection.”"
    feedback if wrong: Collections describe outgoing edges; individual vault indexes are the search states. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
1 has 1 outgoing direct edge.
×
Collections describe outgoing edges; individual vault indexes are the search states. Correct node rule: Every vault index
0
through
n−1
, whether initially openable or not.
×
The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only vaults named in `startKeys`.”"
    feedback if wrong: Those are only the starting points. Keys inside them may unlock many other vaults. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Those are only the starting points. Keys inside them may unlock many other vaults. Correct node rule: Every vault index
0
through
n−1
, whether initially openable or not.
×
The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
×
0 has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "1 has exactly 0 outgoing direct edges."
    feedback if wrong: 1 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Each physical key, even when two vaults contain a key for the same vault.”"
    feedback if wrong: The key identifies a destination vault. Reachability is tracked by vault, not by duplicate key objects. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [NO is correct] (direct-vs-reach) "1 can reach 0, but there is no direct 1→0 edge."
    feedback if wrong: The mini-example lists 1→0 as one direct edge. A direct edge is different from a longer reachable route.
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
vaults=[[2],[],[1]], startKeys=[0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→2, 2→1
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "0 can reach 1 through 2, but the graph still has no direct 0→1 edge."
    feedback if wrong: Right. A multi-step route through 2 creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only vaults named in `startKeys`.”"
    feedback if wrong: Those are only the starting points. Keys inside them may unlock many other vaults. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
Result: PASSED

### S3 Q3
Raw input shown:
```
vaults=[[1,2],[2],[]], startKeys=[0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 0→2, 1→2
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node for the entire starting keyring and one for each vault's key collection.”"
    feedback if wrong: Collections describe outgoing edges; individual vault indexes are the search states. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [YES is correct] (direct-vs-reach) "1 and 2 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 1→2 as one direct edge.
- [YES is correct] (local-degree) "2 has exactly 0 outgoing direct edges."
    feedback if wrong: 2 has 0 outgoing direct edges.
Result: PASSED

### S3 Q4
Raw input shown:
```
vaults=[[1],[],[3],[]], startKeys=[2]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 2→3
Claims, variant 2 (answered correctly):
- [NO is correct] (local-degree) "0 has exactly 2 outgoing direct edges."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Each physical key, even when two vaults contain a key for the same vault.”"
    feedback if wrong: The key identifies a destination vault. Reachability is tracked by vault, not by duplicate key objects. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [NO is correct] (direct-vs-reach) "0 can reach 1, but there is no direct 0→1 edge."
    feedback if wrong: The mini-example lists 0→1 as one direct edge. A direct edge is different from a longer reachable route.
Result: PASSED

### S3 Q5
Raw input shown:
```
vaults=[[1],[],[]], startKeys=[0]
```
Node-name guide: Required node-name format: Use each node's 0-based number only. Example: 2. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "0", "1", "2" · edges: 0→1
Claims, variant 2 (answered correctly):
- [YES is correct] (local-degree) "0 has exactly 1 outgoing direct edge."
    feedback if wrong: 0 has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only vaults named in `startKeys`.”"
    feedback if wrong: Those are only the starting points. Keys inside them may unlock many other vaults. Correct node rule: Every vault index `0` through `n−1`, whether initially openable or not.
- [YES is correct] (direct-vs-reach) "0 and 1 are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists 0→1 as one direct edge.
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

### S4 case 1 — `authored-deep-case` · bug: Never adds newly discovered keys
Input shown:
```
REAL PROBLEM INPUT
vaults: [[1], [2], []]
startKeys: [0]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  for (const key of input.startKeys) {
    if (key >= 0 && key < input.vaults.length) {
      opened.add(key);
    }
  }

  return opened.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2" · edges: 0→1, 1→2
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of vaults opened" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Duplicate starting keys make the same vault count multiple times for the shown graph.
- B The code follows every found key backward toward the vault that originally contained it during traversal.
- C The code opens initial keys but never reads an opened vault's contents to discover more keys.
Diagnosis answer key + feedback:
- ✅ [no-key-chain] "The code opens initial keys but never reads an opened vault's contents to discover more keys." — feedback: Correct. Starting key 0 unlocks the full 0→1→2 chain.
- ❌ [duplicate-start-key] "Duplicate starting keys make the same vault count multiple times for the shown graph." — feedback: The Set removes duplicates.
- ❌ [reverse-vault-edge] "The code follows every found key backward toward the vault that originally contained it during traversal." — feedback: It follows no vault edges at all.
Graph proof shown in feedback: code rule "Only startKeys become opened nodes." → changed graph "Vault 0 contains key 1, and vault 1 contains key 2." → boundary "Two reachable vaults require keys found after the shift begins." → returned value "The code counts only vault 0 rather than all three vaults."
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
About your diagnosis: The Set removes duplicates.
Code rule: Only startKeys become opened nodes. → Changed graph: Vault 0 contains key 1, and vault 1 contains key 2. → Reachable boundary: Two reachable vaults require keys found after the shift begins.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Never adds newly discovered keys
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: Only startKeys become opened nodes. → Changed graph: Vault 0 contains key 1, and vault 1 contains key 2. → Reachable boundary: Two reachable vaults require keys found after the shift begins. → Returned value: The code counts only vault 0 rather than all three vaults.
```

### S4 case 2 — `two-starts` · bug: Never adds newly discovered keys
Input shown:
```
REAL PROBLEM INPUT
vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  for (const key of input.startKeys) {
    if (key >= 0 && key < input.vaults.length) {
      opened.add(key);
    }
  }

  return opened.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3", "4", "5" · edges: 0→1, 1→2, 3→2, 3→5
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of vaults opened" · expected buggy output `2` · real correct output `5`
Diagnosis choices as displayed:
- A The code opens initial keys but never reads an opened vault's contents to discover more keys.
- B Duplicate starting keys make the same vault count multiple times for the shown graph.
- C The code follows every found key backward toward the vault that originally contained it during traversal.
Diagnosis answer key + feedback:
- ✅ [no-key-chain] "The code opens initial keys but never reads an opened vault's contents to discover more keys." — feedback: Exactly. Only startKeys become opened nodes. The shown code returns 2; the real problem returns 5.
- ❌ [duplicate-start-key] "Duplicate starting keys make the same vault count multiple times for the shown graph." — feedback: The Set removes duplicates.
- ❌ [reverse-vault-edge] "The code follows every found key backward toward the vault that originally contained it during traversal." — feedback: It follows no vault edges at all.
Graph proof shown in feedback: code rule "Only startKeys become opened nodes." → changed graph "Nodes are 0, 1, 2, 3, 4, 5; direct arrows are 0→1, 1→2, 3→2, 3→5." → boundary "initial-keys-only" → returned value "The shown code returns 2; the real problem returns 5."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Never adds newly discovered keys
INCORRECT OUTPUT
2
CORRECT OUTPUT
5
Code rule: Only startKeys become opened nodes. → Changed graph: Nodes are 0, 1, 2, 3, 4, 5; direct arrows are 0→1, 1→2, 3→2, 3→5. → Reachable boundary: initial-keys-only → Returned value: The shown code returns 2; the real problem returns 5.
```

### S4 case 3 — `cycle` · bug: Never adds newly discovered keys
Input shown:
```
REAL PROBLEM INPUT
vaults=[[1],[2],[0],[]], startKeys=[1]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const opened = new Set();
  for (const key of input.startKeys) {
    if (key >= 0 && key < input.vaults.length) {
      opened.add(key);
    }
  }

  return opened.size;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "0", "1", "2", "3" · edges: 0→1, 1→2, 2→0
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "number of vaults opened" · expected buggy output `1` · real correct output `3`
Diagnosis choices as displayed:
- A Duplicate starting keys make the same vault count multiple times for the shown graph.
- B The code opens initial keys but never reads an opened vault's contents to discover more keys.
- C The code follows every found key backward toward the vault that originally contained it during traversal.
Diagnosis answer key + feedback:
- ✅ [no-key-chain] "The code opens initial keys but never reads an opened vault's contents to discover more keys." — feedback: Exactly. Only startKeys become opened nodes. The shown code returns 1; the real problem returns 3.
- ❌ [duplicate-start-key] "Duplicate starting keys make the same vault count multiple times for the shown graph." — feedback: The Set removes duplicates.
- ❌ [reverse-vault-edge] "The code follows every found key backward toward the vault that originally contained it during traversal." — feedback: It follows no vault edges at all.
Graph proof shown in feedback: code rule "Only startKeys become opened nodes." → changed graph "Nodes are 0, 1, 2, 3; direct arrows are 0→1, 1→2, 2→0." → boundary "initial-keys-only" → returned value "The shown code returns 1; the real problem returns 3."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Never adds newly discovered keys
INCORRECT OUTPUT
1
CORRECT OUTPUT
3
Code rule: Only startKeys become opened nodes. → Changed graph: Nodes are 0, 1, 2, 3; direct arrows are 0→1, 1→2, 2→0. → Reachable boundary: initial-keys-only → Returned value: The shown code returns 1; the real problem returns 3.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```