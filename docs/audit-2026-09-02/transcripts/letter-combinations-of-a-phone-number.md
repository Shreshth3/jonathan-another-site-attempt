# Letter Combinations of a Phone Number (`letter-combinations-of-a-phone-number`) — original, backtracking

## Problem statement (Description tab)

You are given a string `digits` containing digits from `2` through `9`.

On an old-school phone keypad, each digit maps to a few letters:

- `2` -> a, b, c
- `3` -> d, e, f
- `4` -> g, h, i
- `5` -> j, k, l
- `6` -> m, n, o
- `7` -> p, q, r, s
- `8` -> t, u, v
- `9` -> w, x, y, z

Return every possible string you could spell by picking one letter for each digit, in order. You may return the answers in any order. If `digits` is empty, return an empty list.

### Examples
- Example 1: input `digits = "23"` → output `["ad","ae","af","bd","be","bf","cd","ce","cf"]`. The first character comes from 2 (a, b, or c) and the second from 3 (d, e, or f). That gives 3 x 3 = 9 combinations.
- Example 2: input `digits = ""` → output `[]`. There are no digits, so there are no combinations to build.
- Example 3: input `digits = "2"` → output `["a","b","c"]`. A single 2 can be any one of its three letters.

### Graph rules (authored)
- Nodes: The partial string chosen so far, starting with the empty string at the root.
- Edges: Choose one letter from digit 3 and append it, producing `ad`, `ae`, or `af`.
- Node-name format shown in Step 1/3: Use `empty prefix` for the root. After that, use the partial letter string itself. Example: `ab`. (pattern `^(?:empty prefix|[a-z]+)$`)
- Step 2 node-label rule: `partial-string` — Use ε for the empty root, then lowercase partial strings like a or ab.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-two-digits`, facet "all leaf strings")
Raw input shown:
```
digits = "2"
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["a","b"]
2. ["a","b","c"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["a","b","c"]"
    feedback: Correct. Digit 2 has three complete one-letter combinations.
- ❌ [near-miss] "["a","b"]"
    feedback: That result follows the drop last keypad letter bug, not the exact picture. (misconception: drop-last-keypad-letter)
Graph the grader requires (hidden from student): DIRECTED · nodes: "empty prefix", "a", "b", "c" · edges: empty prefix→a, empty prefix→b, empty prefix→c
"Why" shown after success: Digit 2 has three complete one-letter combinations.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`exact-picture`, facet "exact digit string")
Raw input shown:
```
digits = "2"
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture B / empty prefix / a / b / c
2. Picture C / empty prefix / a / b / c
3. Picture A / empty prefix / a / b / c
4. Picture D / empty prefix / a / b
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: empty prefix, a, b, c · edges: empty prefix→a, empty prefix→b, empty prefix→c
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: empty prefix, a, b, c · edges: empty prefix→a, empty prefix→b
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: empty prefix, a, b, c · edges: a→empty prefix, b→empty prefix, c→empty prefix
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: empty prefix, a, b · edges: empty prefix→a, empty prefix→b
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`core-rule`, facet "prefix states")
Raw input shown:
```
In the choice tree for digits `23`, what should a node represent?
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **In the choice tree for digits 23, what should a node represent?**
Choices as displayed (top to bottom):
1. A / Only the digit 2 or digit 3, so the tree has two nodes.
2. B / Only complete two-letter answers such as ad and cf.
3. C / The partial string chosen so far, starting with the empty string at the root.
4. D / One shared node for each keypad letter, even when reached after different prefixes.
Answer key + feedback per choice (data):
- ✅ CORRECT [partial-string] "The partial string chosen so far, starting with the empty string at the root."
    feedback: Correct. Each tree level records one more chosen letter.
- ❌ [digit] "Only the digit 2 or digit 3, so the tree has two nodes."
    feedback: Each digit offers several choices. The search state must remember the letters already chosen. (misconception: digit-only-node)
- ❌ [complete-only] "Only complete two-letter answers such as `ad` and `cf`."
    feedback: Those are leaf nodes. Partial strings such as `a` are needed to show how backtracking reaches them. (misconception: omit-partial-states)
- ❌ [individual-letter] "One shared node for each keypad letter, even when reached after different prefixes."
    feedback: The same next letter after different prefixes creates different partial strings and different states. (misconception: letter-without-prefix)
"Why" shown after success: Correct. Each tree level records one more chosen letter.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-four-letter-digit`, facet "one-letter choices")
Raw input shown:
```
digits = "7"
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["p","q","r","s"]
2. ["p","q","r"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["p","q","r","s"]"
    feedback: Correct. Digit 7 maps to four letters, including s.
- ❌ [near-miss] "["p","q","r"]"
    feedback: That result follows the assume three letters per digit bug, not the exact picture. (misconception: assume-three-letters-per-digit)
Graph the grader requires (hidden from student): DIRECTED · nodes: "empty prefix", "p", "q", "r", "s" · edges: empty prefix→p, empty prefix→q, empty prefix→r, empty prefix→s
"Why" shown after success: Digit 7 maps to four letters, including s.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`relation-rule`, facet "one-letter choices")
Raw input shown:
```
What does an edge leaving partial string `a` mean while solving digits `23`?
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What does an edge leaving partial string a mean while solving digits 23?**
Choices as displayed (top to bottom):
1. A / Choose one letter from digit 3 and append it, producing ad, ae, or af.
2. B / Choose another letter from digit 2, producing aa, ab, or ac.
3. C / Replace a with a letter from digit 3, producing d, e, or f.
4. D / One edge from a to the set {ad,ae,af} as a single child node.
Answer key + feedback per choice (data):
- ✅ CORRECT [append-next-letter] "Choose one letter from digit 3 and append it, producing `ad`, `ae`, or `af`."
    feedback: Correct. At depth 1, digit 3 supplies the next character choices.
- ❌ [reuse-two] "Choose another letter from digit 2, producing `aa`, `ab`, or `ac`."
    feedback: After choosing `a` for digit 2, the next edge must use the next digit, 3. (misconception: reuse-current-digit)
- ❌ [replace-prefix] "Replace `a` with a letter from digit 3, producing `d`, `e`, or `f`."
    feedback: A choice extends the partial string; it does not erase earlier choices. (misconception: replace-instead-of-append)
- ❌ [jump-complete-set] "One edge from `a` to the set `{ad,ae,af}` as a single child node."
    feedback: Each letter choice is a separate branch and produces its own answer leaf. (misconception: merge-branches)
"Why" shown after success: Correct. At depth 1, digit 3 supplies the next character choices.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-order`, facet "exact digit string")
Raw input shown:
```
digits = "3"
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. ["a","b","c"]
2. ["d","e","f"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["d","e","f"]"
    feedback: Correct. Digit 3 maps to d, e, and f, not digit 2's letters.
- ❌ [near-miss] "["a","b","c"]"
    feedback: That result follows the use previous keypad row bug, not the exact picture. (misconception: use-previous-keypad-row)
Graph the grader requires (hidden from student): DIRECTED · nodes: "empty prefix", "d", "e", "f" · edges: empty prefix→d, empty prefix→e, empty prefix→f
"Why" shown after success: Digit 3 maps to d, e, and f, not digit 2's letters.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`predict-output`, facet "all leaf strings")
Raw input shown:
```
digits = "23"
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How many leaf strings appear in the choice tree for digits 23?**
Choices as displayed (top to bottom):
1. A / 6
2. B / 3
3. C / 8
4. D / 9
Answer key + feedback per choice (data):
- ✅ CORRECT [nine] "9"
    feedback: Correct. Three choices for 2 times three choices for 3.
- ❌ [six] "6"
    feedback: This adds 3+3 instead of combining every pair. (misconception: add-choice-counts)
- ❌ [three] "3"
    feedback: This follows only one branch for the second digit. (misconception: one-second-choice)
- ❌ [eight] "8"
    feedback: Digits 2 and 3 each map to three letters, not four. (misconception: wrong-keypad-count)
"Why" shown after success: Correct. Three choices for 2 times three choices for 3.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`bug-trap`, facet "all leaf strings")
Raw input shown:
```
digits = ""
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What result belongs at the root when digits = ""?**
Choices as displayed (top to bottom):
1. A / []
2. B / [""]
3. C / ["0"]
4. D / ["a","b","c"]
Answer key + feedback per choice (data):
- ✅ CORRECT [empty-array] "`[]`"
    feedback: Correct. No digits means no combinations.
- ❌ [empty-string] "`[""]`"
    feedback: The problem does not count an empty spelling as a phone combination. (misconception: emit-empty-combination)
- ❌ [zero] "`["0"]`"
    feedback: This invents a character for digit 0 even though the input contains no digit. (misconception: emit-zero-character)
- ❌ [all-letters] "`["a","b","c"]`"
    feedback: This incorrectly runs the digit-2 branch as a default when no digit exists. (misconception: default-to-digit-two)
"Why" shown after success: Correct. No digits means no combinations.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`build-empty`, facet "all leaf strings")
Raw input shown:
```
digits = ""
```
Node-name guide shown: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What should the function return?**
Choices as displayed (top to bottom):
1. []
2. [""]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. The problem defines empty input as no combinations.
- ❌ [near-miss] "[""]"
    feedback: That result follows the emit empty prefix bug, not the exact picture. (misconception: emit-empty-prefix)
Graph the grader requires (hidden from student): DIRECTED · nodes: "empty prefix" · edges: none
"Why" shown after success: The problem defines empty input as no combinations.
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
digits = "9"
```
Remedial question: **How many complete combinations are returned?** · choices shown: 3 combinations | 4 combinations
Remedial answer key: ✅ "4 combinations" — Correct. Digit 9 has w, x, y, and z.; ❌ "3 combinations" — That result follows the drop last keypad letter bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "empty prefix", "w", "x", "y", "z" · edges: empty prefix→w, empty prefix→x, empty prefix→y, empty prefix→z
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [digit]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The partial string chosen so far, starting with the empty string at the root.
Your choice: Each digit offers several choices. The search state must remember the letters already chosen.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
digits = "6"
```
Remedial question: **How many complete combinations are returned?** · choices shown: 3 combinations | 1 combination
Remedial answer key: ✅ "3 combinations" — Correct. The three different one-letter prefixes are three separate leaf states.; ❌ "1 combination" — That result follows the merge sibling prefixes bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "empty prefix", "m", "n", "o" · edges: empty prefix→m, empty prefix→n, empty prefix→o
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [reuse-two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Choose one letter from digit 3 and append it, producing ad, ae, or af.
Your choice: After choosing a for digit 2, the next edge must use the next digit, 3.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
digits = "7"
```
Remedial question: **How many complete combinations are returned?** · choices shown: 3 combinations | 4 combinations
Remedial answer key: ✅ "4 combinations" — Correct. Digit 7 has four legal one-letter extensions.; ❌ "3 combinations" — That result follows the assume three letters per key bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "empty prefix", "p", "q", "r", "s" · edges: empty prefix→p, empty prefix→q, empty prefix→r, empty prefix→s
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [six]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
9
Your choice: This adds 3+3 instead of combining every pair.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
digits = ""
```
Remedial question: **What should the function return?** · choices shown: [""] | []
Remedial answer key: ✅ "[]" — Correct. No digits means no combinations.; ❌ "[""]" — That counts the empty prefix as a finished phone combination.
Remedial required graph (hidden): DIRECTED · nodes: "empty prefix" · edges: none
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [empty-string]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[]
Your choice: The problem does not count an empty spelling as a phone combination.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
digits = "2"
```
Remedial question: **How many complete combinations are returned?** · choices shown: 3 unique combinations | 2 combinations
Remedial answer key: ✅ "3 unique combinations" — Correct. Digit 2 has a, b, and c.; ❌ "2 combinations" — That result follows a loop hard-coded to two letters per digit.
Remedial required graph (hidden): DIRECTED · nodes: "empty prefix", "a", "b", "c" · edges: empty prefix→a, empty prefix→b, empty prefix→c
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `reverse-arrows` (authored level "Choice arrows reversed"; authored goal, NOT shown to student: "Start at ε so reversing every choice arrow blocks all longer strings.")
Everything the student sees (text):
```
E
Emma's broken search

Emma reads every from/to relationship backward.

Your main goal: Expose Emma's mistake. Draw two graphs: first the correct graph, then Emma's graph using the mistake.

CHOOSE THE EMPTY PREFIX
empty prefix
OUTPUT
CORRECT OUTPUT
EMMA’S OUTPUT
Drawing 1 of 2: Correct graph · Empty prefix: ε
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
2 · Emma's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY PREFIX / empty prefix", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | EMMA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Probe — submitting the graph with Step 1's node names ("empty prefix", "a", "b", "c"): REJECTED with "Use ε for the empty root, then lowercase partial strings like a or ab."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"ε\"]","buggy":"[\"ε\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes a, ε · edges (in drawing order) ε→a · start ε
Grader's expected answers: correct output `["a","ε"]` · character's output `["ε"]` · character's graph must be exactly: DIRECTED · nodes: a, ε · edges: a→ε
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `a, ε`; ❌ curly braces → `{a,ε}`; ✅ quoted numbers/strings → `["a","ε"]`; ❌ reversed order → `["ε","a"]`; ✅ spaces inside brackets → `[ "a" , "ε" ]`; ❌ unquoted labels (if non-numeric) → `[a,ε]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","ε"]
EMMA'S OUTPUT
["ε"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `first-branch` (authored level "One keypad choice"; authored goal, NOT shown to student: "Give a prefix at least two next-letter choices so one combination is not enough.")
Everything the student sees (text):
```
J
Jacob's broken search

Jacob chooses the first route and forgets the other branches.

Your main goal: Expose Jacob's mistake. Draw two graphs: first the correct graph, then Jacob's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE EMPTY PREFIX
empty prefix
OUTPUT
CORRECT OUTPUT
JACOB’S OUTPUT
Drawing 1 of 2: Correct graph · Empty prefix: ε
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
2 · Jacob's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY PREFIX / empty prefix", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | JACOB’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"b\",\"ba\",\"ε\"]","buggy":"[\"a\",\"ε\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes ε, a, b, ba · edges (in drawing order) ε→a, ε→b, b→ba · start ε
Grader's expected answers: correct output `["a","b","ba","ε"]` · character's output `["a","ε"]` · character's graph must be exactly: DIRECTED · nodes: a, b, ba, ε · edges: ε→a, ε→b, b→ba
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","b","ba","ε"]
JACOB'S OUTPUT
["a","ε"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `drop-last-edge` (authored level "Final letter option dropped"; authored goal, NOT shown to student: "Make the last append arrow lead to a unique complete combination.")
Everything the student sees (text):
```
I
Isabella's broken search

Isabella builds every listed connection except the last one.

Your main goal: Expose Isabella's mistake. Draw two graphs: first the correct graph, then Isabella's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE EMPTY PREFIX
empty prefix
OUTPUT
CORRECT OUTPUT
ISABELLA’S OUTPUT
Drawing 1 of 2: Correct graph · Empty prefix: ε
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
2 · Isabella's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY PREFIX / empty prefix", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | ISABELLA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"ab\",\"ε\"]","buggy":"[\"a\",\"ε\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes ε, a, ab · edges (in drawing order) ε→a, a→ab · start ε
Grader's expected answers: correct output `["a","ab","ε"]` · character's output `["a","ε"]` · character's graph must be exactly: DIRECTED · nodes: a, ab, ε · edges: ε→a
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","ab","ε"]
ISABELLA'S OUTPUT
["a","ε"]
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
digits = "9"
```
Node-name guide: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "empty prefix", "w", "x", "y", "z" · edges: empty prefix→w, empty prefix→x, empty prefix→y, empty prefix→z
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only complete two-letter answers such as `ad` and `cf`.”"
    feedback if wrong: Those are leaf nodes. Partial strings such as `a` are needed to show how backtracking reaches them. Correct node rule: One node for each legal partial string, including the empty starting prefix.
- [YES is correct] (direct-vs-reach) "empty prefix and y are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists empty prefix→y as one direct edge.
- [YES is correct] (local-degree) "empty prefix has exactly 4 outgoing direct edges."
    feedback if wrong: empty prefix has 4 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Those are leaf nodes. Partial strings such as
a
are needed to show how backtracking reaches them. Correct node rule: One node for each legal partial string, including the empty starting prefix.
×
Correct. The mini-example lists empty prefix→y as one direct edge.
×
empty prefix has 4 outgoing direct edges.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One shared node for each keypad letter, even when reached after different prefixes.”"
    feedback if wrong: The same next letter after different prefixes creates different partial strings and different states. Correct node rule: One node for each legal partial string, including the empty starting prefix.
- [YES is correct] (direct-vs-reach) "empty prefix and x are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists empty prefix→x as one direct edge.
- [YES is correct] (local-degree) "z has exactly 0 outgoing direct edges."
    feedback if wrong: z has 0 outgoing direct edges.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The same next letter after different prefixes creates different partial strings and different states. Correct node rule: One node for each legal partial string, including the empty starting prefix.
×
Correct. The mini-example lists empty prefix→x as one direct edge.
×
z has 0 outgoing direct edges.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only the digit 2 or digit 3, so the tree has two nodes.”"
    feedback if wrong: Each digit offers several choices. The search state must remember the letters already chosen. Correct node rule: One node for each legal partial string, including the empty starting prefix.
- [YES is correct] (direct-vs-reach) "empty prefix and w are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists empty prefix→w as one direct edge.
- [YES is correct] (local-degree) "y has exactly 0 outgoing direct edges."
    feedback if wrong: y has 0 outgoing direct edges.
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
digits = "6"
```
Node-name guide: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "empty prefix", "m", "n", "o" · edges: empty prefix→m, empty prefix→n, empty prefix→o
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "empty prefix can reach o, but there is no direct empty prefix→o edge."
    feedback if wrong: The mini-example lists empty prefix→o as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "m has exactly 1 outgoing direct edge."
    feedback if wrong: m has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “One shared node for each keypad letter, even when reached after different prefixes.”"
    feedback if wrong: The same next letter after different prefixes creates different partial strings and different states. Correct node rule: One node for each legal partial string, including the empty starting prefix.
Result: PASSED

### S3 Q3
Raw input shown:
```
digits = "7"
```
Node-name guide: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "empty prefix", "p", "q", "r", "s" · edges: empty prefix→p, empty prefix→q, empty prefix→r, empty prefix→s
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "empty prefix can reach r, but there is no direct empty prefix→r edge."
    feedback if wrong: The mini-example lists empty prefix→r as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "q has exactly 1 outgoing direct edge."
    feedback if wrong: q has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only complete two-letter answers such as `ad` and `cf`.”"
    feedback if wrong: Those are leaf nodes. Partial strings such as `a` are needed to show how backtracking reaches them. Correct node rule: One node for each legal partial string, including the empty starting prefix.
Result: PASSED

### S3 Q4
Raw input shown:
```
digits = ""
```
Node-name guide: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "empty prefix" · edges: none
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "Because empty prefix can reach itself, the graph should contain a direct empty prefix→empty prefix edge."
    feedback if wrong: Self-reachability can use zero edges. The input does not define a direct empty prefix→empty prefix self-edge.
- [NO is correct] (local-degree) "empty prefix has exactly 1 outgoing direct edge."
    feedback if wrong: empty prefix has 0 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the digit 2 or digit 3, so the tree has two nodes.”"
    feedback if wrong: Each digit offers several choices. The search state must remember the letters already chosen. Correct node rule: One node for each legal partial string, including the empty starting prefix.
Result: PASSED

### S3 Q5
Raw input shown:
```
digits = "2"
```
Node-name guide: Required node-name format: Use empty prefix for the root. After that, use the partial letter string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "empty prefix", "a", "b", "c" · edges: empty prefix→a, empty prefix→b, empty prefix→c
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "empty prefix and c are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists empty prefix→c as one direct edge.
- [YES is correct] (local-degree) "empty prefix has exactly 3 outgoing direct edges."
    feedback if wrong: empty prefix has 3 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One shared node for each keypad letter, even when reached after different prefixes.”"
    feedback if wrong: The same next letter after different prefixes creates different partial strings and different states. Correct node rule: One node for each legal partial string, including the empty starting prefix.
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

### S4 case 1 — `authored-deep-case` · bug: The search stops after one digit
Input shown:
```
REAL PROBLEM INPUT
digits = "23"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function letterCombinations(digits) {
  if (!digits) {
    return [];
  }
  const letters = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };
  const answer = [];
  function build(index, text) {
    if (index === Math.min(1, digits.length)) {
      answer.push(text);
      return;
    }
    for (const letter of letters[digits[index]]) {
      build(index + 1, text + letter);
    }
  }
  build(0, "");
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "start", "a", "b", "c", "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf" · edges: start→a, start→b, start→c, a→ad, a→ae, a→af, b→bd, b→be, b→bf, c→cd, c→ce, c→cf
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all letter strings represented by the digits" · expected buggy output `["a","b","c"]` · real correct output `["ad","ae","af","bd","be","bf","cd","ce","cf"]`
Diagnosis choices as displayed:
- A It declares prefixes complete at depth 1 instead of at digits.length.
- B Digit 3 should have only d and e, changing this input's returned value.
- C Repeated letters require a visited set, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [fixed-depth] "It declares prefixes complete at depth 1 instead of at digits.length." — feedback: Correct. Every complete leaf for 23 has two letters, including one choice from digit 3.
- ❌ [wrong-three] "Digit 3 should have only d and e, changing this input's returned value." — feedback: No. Digit 3 correctly has three letters: d, e, and f.
- ❌ [needs-visited] "Repeated letters require a visited set, changing this input's returned value." — feedback: No. This is a choice tree, not a cyclic graph; equal choices on different branches remain valid.
Graph proof shown in feedback: code rule "The base case cuts every branch at depth 1." → changed graph "The complete choice tree has the root, three one-letter prefixes, and nine two-letter leaves for digits 23." → boundary "Each one-letter prefix has three required outgoing choices for digit 3." → returned value "Three incomplete prefixes are returned instead of the nine two-letter combinations."
Output-format probes: ✅ spaces after commas → `["a", "b", "c"]`; ❌ reversed element order → `["c","b","a"]`; ❌ unquoted strings in array → `[a,b,c]`; ❌ trailing period → `["a","b","c"].`
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
About your diagnosis: No. Digit 3 correctly has three letters: d, e, and f.
Code rule: The base case cuts every branch at depth 1. → Changed graph: The complete choice tree has the root, three one-letter prefixes, and nine two-letter leaves for digits 23. → Reachable boundary: Each one-letter prefix has three required outgoing choices for digit 3.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The search stops after one digit
INCORRECT OUTPUT
["a","b","c"]
CORRECT OUTPUT
["ad","ae","af","bd","be","bf","cd","ce","cf"]
Code rule: The base case cuts every branch at depth 1. → Changed graph: The complete choice tree has the root, three one-letter prefixes, and nine two-letter leaves for digits 23. → Reachable boundary: Each one-letter prefix has three required outgoing choices for digit 3. → Returned value: Three incomplete prefixes are returned instead of the nine two-letter combinations.
```

### S4 case 2 — `two-digits-four-way` · bug: The search stops after one digit
Input shown:
```
REAL PROBLEM INPUT
digits = "27"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function letterCombinations(digits) {
  if (!digits) {
    return [];
  }
  const letters = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };
  const answer = [];
  function build(index, text) {
    if (index === Math.min(1, digits.length)) {
      answer.push(text);
      return;
    }
    for (const letter of letters[digits[index]]) {
      build(index + 1, text + letter);
    }
  }
  build(0, "");
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "start", "a", "b", "c", "ap", "aq", "ar", "as", "bp", "bq", "br", "bs", "cp", "cq", "cr", "cs" · edges: start→a, start→b, start→c, a→ap, a→aq, a→ar, a→as, b→bp, b→bq, b→br, b→bs, c→cp, c→cq, c→cr, c→cs
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all letter strings represented by the digits" · expected buggy output `["a","b","c"]` · real correct output `["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"]`
Diagnosis choices as displayed:
- A Digit 7 should omit s and use only p, q, and r.
- B It declares prefixes complete at depth 1 instead of at digits.length.
- C Repeated letters require a visited set, changing this input's returned value.
Diagnosis answer key + feedback:
- ✅ [fixed-depth] "It declares prefixes complete at depth 1 instead of at digits.length." — feedback: Correct. The first digit creates three prefixes, but every prefix still has four required outgoing choices for digit 7. Therefore the shown code returns ["a","b","c"], while the real problem returns ["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"].
- ❌ [wrong-three] "Digit 7 should omit s and use only p, q, and r." — feedback: Use the complete fixed phone mapping for that digit; removing a mapped letter deletes valid combinations.
- ❌ [needs-visited] "Repeated letters require a visited set, changing this input's returned value." — feedback: No. This is a choice tree, not a cyclic graph; equal choices on different branches remain valid.
Graph proof shown in feedback: code rule "The base case cuts every branch at depth 1." → changed graph "Nodes: start, a, b, c, ap, aq, ar, as, bp, bq, br, bs, cp, cq, cr, cs. Direct arrows: start→a; start→b; start→c; a→ap; a→aq; a→ar; a→as; b→bp; b→bq; b→br; b→bs; c→cp; c→cq; c→cr; c→cs." → boundary "The first digit creates three prefixes, but every prefix still has four required outgoing choices for digit 7." → returned value "The shown code returns ["a","b","c"]; the source-repo reference solution returns ["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The search stops after one digit
INCORRECT OUTPUT
["a","b","c"]
CORRECT OUTPUT
["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"]
Code rule: The base case cuts every branch at depth 1. → Changed graph: Nodes: start, a, b, c, ap, aq, ar, as, bp, bq, br, bs, cp, cq, cr, cs. Direct arrows: start→a; start→b; start→c; a→ap; a→aq; a→ar; a→as; b→bp; b→bq; b→br; b→bs; c→cp; c→cq; c→cr; c→cs. → Reachable boundary: The first digit creates three prefixes, but every prefix still has four required outgoing choices for digit 7. → Returned value: The shown code returns ["a","b","c"]; the source-repo reference solution returns ["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"].
```

### S4 case 3 — `two-digits-second-three-way` · bug: The search stops after one digit
Input shown:
```
REAL PROBLEM INPUT
digits = "34"
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function letterCombinations(digits) {
  if (!digits) {
    return [];
  }
  const letters = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };
  const answer = [];
  function build(index, text) {
    if (index === Math.min(1, digits.length)) {
      answer.push(text);
      return;
    }
    for (const letter of letters[digits[index]]) {
      build(index + 1, text + letter);
    }
  }
  build(0, "");
  return answer;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "start", "d", "e", "f", "dg", "dh", "di", "eg", "eh", "ei", "fg", "fh", "fi" · edges: start→d, start→e, start→f, d→dg, d→dh, d→di, e→eg, e→eh, e→ei, f→fg, f→fh, f→fi
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of all letter strings represented by the digits" · expected buggy output `["d","e","f"]` · real correct output `["dg","dh","di","eg","eh","ei","fg","fh","fi"]`
Diagnosis choices as displayed:
- A Digit 4 should omit i and use only g and h.
- B Repeated letters require a visited set, changing this input's returned value.
- C It declares prefixes complete at depth 1 instead of at digits.length.
Diagnosis answer key + feedback:
- ✅ [fixed-depth] "It declares prefixes complete at depth 1 instead of at digits.length." — feedback: Correct. The one-letter d/e/f states are internal nodes; the real returned boundary is the nine two-letter leaves. Therefore the shown code returns ["d","e","f"], while the real problem returns ["dg","dh","di","eg","eh","ei","fg","fh","fi"].
- ❌ [wrong-three] "Digit 4 should omit i and use only g and h." — feedback: Use the complete fixed phone mapping for that digit; removing a mapped letter deletes valid combinations.
- ❌ [needs-visited] "Repeated letters require a visited set, changing this input's returned value." — feedback: No. This is a choice tree, not a cyclic graph; equal choices on different branches remain valid.
Graph proof shown in feedback: code rule "The base case cuts every branch at depth 1." → changed graph "Nodes: start, d, e, f, dg, dh, di, eg, eh, ei, fg, fh, fi. Direct arrows: start→d; start→e; start→f; d→dg; d→dh; d→di; e→eg; e→eh; e→ei; f→fg; f→fh; f→fi." → boundary "The one-letter d/e/f states are internal nodes; the real returned boundary is the nine two-letter leaves." → returned value "The shown code returns ["d","e","f"]; the source-repo reference solution returns ["dg","dh","di","eg","eh","ei","fg","fh","fi"]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
The search stops after one digit
INCORRECT OUTPUT
["d","e","f"]
CORRECT OUTPUT
["dg","dh","di","eg","eh","ei","fg","fh","fi"]
Code rule: The base case cuts every branch at depth 1. → Changed graph: Nodes: start, d, e, f, dg, dh, di, eg, eh, ei, fg, fh, fi. Direct arrows: start→d; start→e; start→f; d→dg; d→dh; d→di; e→eg; e→eh; e→ei; f→fg; f→fh; f→fi. → Reachable boundary: The one-letter d/e/f states are internal nodes; the real returned boundary is the nine two-letter leaves. → Returned value: The shown code returns ["d","e","f"]; the source-repo reference solution returns ["dg","dh","di","eg","eh","ei","fg","fh","fi"].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```