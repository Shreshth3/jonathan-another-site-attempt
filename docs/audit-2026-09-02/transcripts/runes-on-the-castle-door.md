# Runes on the Castle Door (`runes-on-the-castle-door`) — variant, backtracking

## Problem statement (Description tab)

A castle door is locked by a row of spinning dials. Dial `i` can be turned to show any one of the runes (lowercase letters) in the string `dials[i]`.

To try a code, you set every dial to one rune and read the runes from left to right to form a word. But the door's magic fizzles if two dials that sit **next to each other** show the **same** rune, so in a valid code, every pair of neighboring runes must be different.

Return a list of **all** valid codes you could set. You may return them in any order. If no valid code exists, return an empty list.

### Examples
- Example 1: input `dials = ["ab","b","ac"]` → output `["aba","abc"]`. Dial 0 can show a or b, dial 1 only b, dial 2 a or c. Starting with b is invalid because dial 1 is also b. Starting with a gives "ab", then dial 2 can be a or c (both differ from b), giving "aba" and "abc".
- Example 2: input `dials = ["xy","x"]` → output `["yx"]`. "xx" is invalid because the two neighboring dials would match. "yx" is the only valid code.

### Graph rules (authored)
- Nodes: A legal partial code made from the first few dials; the root is the empty code.
- Edges: Choose one rune from the next dial that differs from the prefix's last rune.
- Node-name format shown in Step 1/3: Use `start` for the empty root. After that, use the partial rune string itself. Example: `ab`. (pattern `^(?:start|[a-z]+)$`)
- Step 2 node-label rule: `partial-string` — Use ε for the empty root, then lowercase partial strings like a or ab.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`two-dials`, facet "all valid codes")
Raw input shown:
```
dials=["ab","ab"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which complete code list is returned?**
Choices as displayed (top to bottom):
1. ["ab","ba"]
2. ["aa","ab","ba","bb"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["ab","ba"]"
    feedback: Correct. Only ab and ba use different adjacent runes.
- ❌ [bug] "["aa","ab","ba","bb"]"
    feedback: This emits equal-neighbor codes aa and bb instead of pruning them. (misconception: allow-equal-neighbors)
Graph the grader requires (hidden from student): DIRECTED · nodes: "start", "a", "b", "ab", "ba" · edges: start→a, start→b, a→ab, b→ba
"Why" shown after success: Only ab and ba use different adjacent runes.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — CONCEPT (`concept-picture`, facet "exact dial choices")
Raw input shown:
```
dials=["ab","ab"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches this raw input?**
Choices as displayed (top to bottom):
1. Picture A / start / a / b / ab / ba
2. Picture B / start / a / b / ab / ba
3. Picture C / start / a / b / ab / ba
4. Picture D / start / a / b / ab
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: start, a, b, ab, ba · edges: start→a, start→b, a→ab, b→ba
    feedback: Correct. Every entity and direct relation matches.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: start, a, b, ab, ba · edges: start→a, start→b, a→ab
    feedback: This drops one direct relation listed in the input. (misconception: omit-listed-relation)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: start, a, b, ab, ba · edges: a→start, b→start, ab→a, ba→b
    feedback: This reverses the direction of the listed relations. (misconception: reverse-arrows)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: start, a, b, ab · edges: start→a, start→b, a→ab
    feedback: This drops an entity that still exists in the input. (misconception: omit-input-entity)
"Why" shown after success: An exact picture keeps every entity, direct relation, direction, and edge label from the input.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q3 — CONCEPT (`concept-nodes`, facet "prefix state identity")
Raw input shown:
```
dials=["ab","b"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **What is a node in the code-building decision tree?**
Picture under review: DIRECTED · nodes: start, a, b, ab · edges: start→a, start→b, a→ab
Choices as displayed (top to bottom):
1. A / One rune character, no matter which dial offered it.
2. B / A legal partial code made from the first few dials; the root is the empty code.
3. C / Only a completed code using every dial.
4. D / One node per dial string.
Answer key + feedback per choice (data):
- ✅ CORRECT [partial-code] "A legal partial code made from the first few dials; the root is the empty code."
    feedback: Correct. Each level records one more dial choice.
- ❌ [rune] "One rune character, no matter which dial offered it."
    feedback: The same rune at different positions has different context. A node must remember the whole prefix. (misconception: forget-prefix)
- ❌ [full-code] "Only a completed code using every dial."
    feedback: Completed codes are leaves; partial-code nodes are needed to show the choices leading to them. (misconception: leaves-only)
- ❌ [dial] "One node per dial string."
    feedback: A dial offers choices, but the search state is which runes have been chosen so far. (misconception: dial-as-state)
"Why" shown after success: Correct. Each level records one more dial choice.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`forced-second`, facet "one-rune extensions")
Raw input shown:
```
dials=["ab","b"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which complete code list is returned?**
Choices as displayed (top to bottom):
1. ["ab","bb"]
2. ["ab"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["ab"]"
    feedback: Correct. Branch b→bb is invalid; a→ab remains.
- ❌ [bug] "["ab","bb"]"
    feedback: This appends b after prefix b without checking the previous rune. (misconception: skip-adjacent-equality-check)
Graph the grader requires (hidden from student): DIRECTED · nodes: "start", "a", "b", "ab" · edges: start→a, start→b, a→ab
"Why" shown after success: Branch b→bb is invalid; a→ab remains.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`concept-relations`, facet "one-rune extensions")
Raw input shown:
```
dials=["a","a"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **When does a partial code have an edge to a longer prefix?**
Picture under review: DIRECTED · nodes: start, a · edges: start→a
Choices as displayed (top to bottom):
1. A / Choose one rune from the next dial that differs from the prefix's last rune.
2. B / Choose only a rune that has never appeared anywhere earlier in the code.
3. C / If every rune repeats, jump to the following dial without adding a character.
4. D / Choose a rune from any remaining dial and mark that dial used.
Answer key + feedback per choice (data):
- ✅ CORRECT [legal-next-rune] "Choose one rune from the next dial that differs from the prefix's last rune."
    feedback: Correct. The edge appends one legal next-dial choice.
- ❌ [globally-new] "Choose only a rune that has never appeared anywhere earlier in the code."
    feedback: Only adjacent equal runes are banned. A rune may reappear after a different rune. (misconception: global-uniqueness)
- ❌ [skip-dial] "If every rune repeats, jump to the following dial without adding a character."
    feedback: A full code needs one rune from every dial. A blocked prefix has no child. (misconception: skip-blocked-dial)
- ❌ [any-later-dial] "Choose a rune from any remaining dial and mark that dial used."
    feedback: Dial order is fixed; an edge always advances to exactly the next dial. (misconception: reorder-dials)
"Why" shown after success: Correct. The edge appends one legal next-dial choice.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`no-code`, facet "exact dial choices")
Raw input shown:
```
dials=["a","a"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which complete code list is returned?**
Choices as displayed (top to bottom):
1. []
2. ["aa"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "[]"
    feedback: Correct. The only possible spelling aa has equal neighbors.
- ❌ [bug] "["aa"]"
    feedback: This treats reaching the final dial as success before validating the new adjacent pair. (misconception: accept-before-validating-extension)
Graph the grader requires (hidden from student): DIRECTED · nodes: "start", "a" · edges: start→a
"Why" shown after success: The only possible spelling aa has equal neighbors.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`concept-output`, facet "all valid codes")
Raw input shown:
```
dials = [ab,ab,a]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For dials ab, ab, a, which complete code list obeys the no-equal-neighbors rule?**
Choices as displayed (top to bottom):
1. A / Codes aba and baa
2. B / Only code baa
3. C / Only code aba
4. D / No codes
Answer key + feedback per choice (data):
- ✅ CORRECT [aba] "Only code `aba`"
    feedback: Correct. a→b→a changes rune at both boundaries.
- ❌ [aba-bab] "Codes `aba` and `baa`"
    feedback: This keeps `baa` after checking only the first neighboring pair and skipping the final a→a check. (misconception: allow-equal-final)
- ❌ [baa] "Only code `baa`"
    feedback: The last two neighboring runes are both a. (misconception: check-first-pair-only)
- ❌ [empty] "No codes"
    feedback: The branch a→b→a completes legally. (misconception: ban-repeated-anywhere)
"Why" shown after success: Correct. a→b→a changes rune at both boundaries.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`concept-bug`, facet "all valid codes")
Raw input shown:
```
dials = [ab,c,c]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For dials ab, c, c, how many complete codes are valid?**
Choices as displayed (top to bottom):
1. A / 2
2. B / 1
3. C / 0
4. D / 4
Answer key + feedback per choice (data):
- ✅ CORRECT [zero] "`0`"
    feedback: Correct. The last two forced c runes always match.
- ❌ [two] "`2`"
    feedback: Both possible starts still end with illegal c→c. (misconception: ignore-last-pair)
- ❌ [one] "`1`"
    feedback: This accepts the first two-dial prefix `ac` as a complete code before processing the final dial. (misconception: finish-one-dial-early)
- ❌ [four] "`4`"
    feedback: This counts the four legal nonempty partial prefixes `a`, `b`, `ac`, and `bc` instead of completed three-rune codes. (misconception: count-partial-prefixes)
"Why" shown after success: Correct. The last two forced c runes always match.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — BUILD (`one-dial`, facet "prefix state identity")
Raw input shown:
```
dials=["xy"]
```
Node-name guide shown: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab.
Drawing-tool title: "1 · Draw the graph"
Question shown: **Which complete code list is returned?**
Choices as displayed (top to bottom):
1. []
2. ["x","y"]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "["x","y"]"
    feedback: Correct. A one-rune code has no adjacent pair to violate the rule.
- ❌ [bug] "[]"
    feedback: This requires a previous rune before allowing any choice, so it prunes the first dial. (misconception: apply-neighbor-check-at-depth-zero)
Graph the grader requires (hidden from student): DIRECTED · nodes: "start", "x", "y" · edges: start→x, start→y
"Why" shown after success: A one-rune code has no adjacent pair to violate the rule.
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
Your choice: This drops one direct relation listed in the input.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Match every input detail"
Remedial raw input:
```
dials=["a","bc"]
```
Remedial question: **Which complete code list is returned?** · choices shown: ["ab","ac"] | ["a","b","c"]
Remedial answer key: ✅ "["ab","ac"]" — Correct. Both second-dial choices differ from a.; ❌ "["a","b","c"]" — This returns dial choices separately instead of complete root-to-leaf codes.
Remedial required graph (hidden): DIRECTED · nodes: "start", "a", "ab", "ac" · edges: start→a, a→ab, a→ac
Remedial result: PASSED

#### After answering concept `concept-nodes` wrong with choice [rune]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
A legal partial code made from the first few dials; the root is the empty code.
Your choice: The same rune at different positions has different context. A node must remember the whole prefix.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect entity identity"
Remedial raw input:
```
dials=["ab","c"]
```
Remedial question: **How many complete prefix-state leaves exist?** · choices shown: 2 | 1
Remedial answer key: ✅ "2" — Correct. The histories ac and bc are separate complete codes.; ❌ "1" — This merges ac and bc because both end in c, losing their different prefixes.
Remedial required graph (hidden): DIRECTED · nodes: "start", "a", "b", "ac", "bc" · edges: start→a, start→b, a→ac, b→bc
Remedial result: PASSED

#### After answering concept `concept-relations` wrong with choice [globally-new]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Choose one rune from the next dial that differs from the prefix's last rune.
Your choice: Only adjacent equal runes are banned. A rune may reappear after a different rune.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect direct relations"
Remedial raw input:
```
dials=["b","ab"]
```
Remedial question: **Which complete code list is returned?** · choices shown: ["ba","bb"] | ["ba"]
Remedial answer key: ✅ "["ba"]" — Correct. Only extension a is legal after b.; ❌ "["ba","bb"]" — This creates an edge from b to bb even though the new rune equals the previous rune.
Remedial required graph (hidden): DIRECTED · nodes: "start", "b", "ba" · edges: start→b, b→ba
Remedial result: PASSED

#### After answering concept `concept-output` wrong with choice [aba-bab]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
Only code aba
Your choice: This keeps baa after checking only the first neighboring pair and skipping the final a→a check.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from a fresh input"
Remedial raw input:
```
dials=["xy","x"]
```
Remedial question: **Which complete code list is returned?** · choices shown: ["yx"] | ["xx","yx"]
Remedial answer key: ✅ "["yx"]" — Correct. Starting x cannot extend with x; starting y can.; ❌ "["xx","yx"]" — This includes xx even though its neighboring runes are equal.
Remedial required graph (hidden): DIRECTED · nodes: "start", "x", "y", "yx" · edges: start→x, start→y, y→yx
Remedial result: PASSED

#### After answering concept `concept-bug` wrong with choice [two]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0
Your choice: Both possible starts still end with illegal c→c.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
dials=["ab","a"]
```
Remedial question: **Which complete code list is returned?** · choices shown: [] | ["ba"]
Remedial answer key: ✅ "["ba"]" — Correct. Runes may repeat on different branches; only neighbors within one code must differ.; ❌ "[]" — This marks rune a globally used after exploring the first branch and refuses to reuse a in the separate b branch.
Remedial required graph (hidden): DIRECTED · nodes: "start", "a", "b", "ba" · edges: start→a, start→b, b→ba
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `wrong-start` (authored level "Code starts halfway"; authored goal, NOT shown to student: "Make beginning from a nonempty prefix skip legal first-dial choices.")
Everything the student sees (text):
```
K
Kenneth's broken search

Kenneth uses the wrong empty code.

Your main goal: Expose Kenneth's mistake. Draw two graphs: first the correct graph, then Kenneth's graph using the mistake.

CHOOSE THE EMPTY CODE
empty code
OUTPUT
CORRECT OUTPUT
KENNETH’S OUTPUT
Drawing 1 of 2: Correct graph · Empty code: ε
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
2 · Kenneth's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY CODE / empty code", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | KENNETH’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "a" (only revealed in Drawing 2's title)
Probe — submitting the graph with Step 1's node names ("start", "a", "b", "ab", "ba"): REJECTED with "Use ε for the empty root, then lowercase partial strings like a or ab."
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"b\",\"ε\"]","buggy":"[\"a\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes a, ε, b · edges (in drawing order) ε→a, ε→b · start ε
Grader's expected answers: correct output `["a","b","ε"]` · character's output `["a"]` · character's graph must be exactly: DIRECTED · nodes: a, b, ε · edges: ε→a, ε→b
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `a, b, ε`; ❌ curly braces → `{a,b,ε}`; ✅ quoted numbers/strings → `["a","b","ε"]`; ❌ reversed order → `["ε","b","a"]`; ✅ spaces inside brackets → `[ "a" , "b" , "ε" ]`; ❌ unquoted labels (if non-numeric) → `[a,b,ε]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","b","ε"]
KENNETH'S OUTPUT
["a"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `last-branch` (authored level "Last rune only"; authored goal, NOT shown to student: "Offer several legal next runes so keeping only the last loses valid codes.")
Everything the student sees (text):
```
D
Diana's broken search

Diana follows only the last available branch and ignores earlier choices.

Your main goal: Expose Diana's mistake. Draw two graphs: first the correct graph, then Diana's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE EMPTY CODE
empty code
OUTPUT
CORRECT OUTPUT
DIANA’S OUTPUT
Drawing 1 of 2: Correct graph · Empty code: ε
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
2 · Diana's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY CODE / empty code", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | DIANA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"b\",\"ba\",\"ε\"]","buggy":"[\"b\",\"ba\",\"ε\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes ε, a, b, ba · edges (in drawing order) ε→a, ε→b, b→ba · start ε
Grader's expected answers: correct output `["a","b","ba","ε"]` · character's output `["b","ba","ε"]` · character's graph must be exactly: DIRECTED · nodes: a, b, ba, ε · edges: ε→a, ε→b, b→ba
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","b","ba","ε"]
DIANA'S OUTPUT
["b","ba","ε"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `shallow-search` (authored level "Three-dial door"; authored goal, NOT shown to student: "Require a legal code longer than one rune beyond the empty prefix.")
Everything the student sees (text):
```
A
Amanda's broken search

Amanda visits only the start and its direct neighboring choices.

Your main goal: Expose Amanda's mistake. Draw two graphs: first the correct graph, then Amanda's graph using the mistake.

CHOOSE THE EMPTY CODE
empty code
OUTPUT
CORRECT OUTPUT
AMANDA’S OUTPUT
Drawing 1 of 2: Correct graph · Empty code: ε
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
2 · Amanda's graph
Check my graph
→
```
Start field: label "CHOOSE THE EMPTY CODE / empty code", placeholder "Example: ε", prefilled "ε", readonly=true
Output labels: CORRECT OUTPUT | AMANDA’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"ab\",\"ε\"]","buggy":"[\"a\",\"ε\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes ε, a, ab · edges (in drawing order) ε→a, a→ab · start ε
Grader's expected answers: correct output `["a","ab","ε"]` · character's output `["a","ε"]` · character's graph must be exactly: DIRECTED · nodes: a, ab, ε · edges: ε→a, a→ab
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","ab","ε"]
AMANDA'S OUTPUT
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
dials=["b","ab"]
```
Node-name guide: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "start", "b", "ba" · edges: start→b, b→ba
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One rune character, no matter which dial offered it.”"
    feedback if wrong: The same rune at different positions has different context. A node must remember the whole prefix. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
- [YES is correct] (direct-vs-reach) "start can reach ba through b, but the graph still has no direct start→ba edge."
    feedback if wrong: Right. A multi-step route through b creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "start has exactly 1 outgoing direct edge."
    feedback if wrong: start has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
The same rune at different positions has different context. A node must remember the whole prefix. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
×
Right. A multi-step route through b creates reachability, not a new direct edge.
×
start has 1 outgoing direct edge.
```
Claims, variant 1 (answered wrong on purpose):
- [YES is correct] (local-degree) "b has exactly 1 outgoing direct edge."
    feedback if wrong: b has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only a completed code using every dial.”"
    feedback if wrong: Completed codes are leaves; partial-code nodes are needed to show the choices leading to them. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
- [YES is correct] (direct-vs-reach) "start can reach ba through b, but the graph still has no direct start→ba edge."
    feedback if wrong: Right. A multi-step route through b creates reachability, not a new direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
b has 1 outgoing direct edge.
×
Completed codes are leaves; partial-code nodes are needed to show the choices leading to them. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
×
Right. A multi-step route through b creates reachability, not a new direct edge.
```
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node per dial string.”"
    feedback if wrong: A dial offers choices, but the search state is which runes have been chosen so far. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
- [YES is correct] (direct-vs-reach) "start can reach ba through b, but the graph still has no direct start→ba edge."
    feedback if wrong: Right. A multi-step route through b creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "ba has exactly 0 outgoing direct edges."
    feedback if wrong: ba has 0 outgoing direct edges.
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
dials=["xy","x"]
```
Node-name guide: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "start", "x", "y", "yx" · edges: start→x, start→y, y→yx
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "start can reach yx through y, but the graph still has no direct start→yx edge."
    feedback if wrong: Right. A multi-step route through y creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "x has exactly 0 outgoing direct edges."
    feedback if wrong: x has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only a completed code using every dial.”"
    feedback if wrong: Completed codes are leaves; partial-code nodes are needed to show the choices leading to them. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
Result: PASSED

### S3 Q3
Raw input shown:
```
dials=["ab","a"]
```
Node-name guide: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "start", "a", "b", "ba" · edges: start→a, start→b, b→ba
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has start→b and b→ba, so it should also contain a direct start→ba edge."
    feedback if wrong: Two direct edges through b do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "b has exactly 2 outgoing direct edges."
    feedback if wrong: b has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “One rune character, no matter which dial offered it.”"
    feedback if wrong: The same rune at different positions has different context. A node must remember the whole prefix. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
Result: PASSED

### S3 Q4
Raw input shown:
```
dials=["a","bc"]
```
Node-name guide: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "start", "a", "ab", "ac" · edges: start→a, a→ab, a→ac
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "start can reach ac through a, but the graph still has no direct start→ac edge."
    feedback if wrong: Right. A multi-step route through a creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "ac has exactly 0 outgoing direct edges."
    feedback if wrong: ac has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “One node per dial string.”"
    feedback if wrong: A dial offers choices, but the search state is which runes have been chosen so far. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
Result: PASSED

### S3 Q5
Raw input shown:
```
dials=["ab","c"]
```
Node-name guide: Required node-name format: Use start for the empty root. After that, use the partial rune string itself. Example: ab. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "start", "a", "b", "ac", "bc" · edges: start→a, start→b, a→ac, b→bc
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "start can reach ac through a, but the graph still has no direct start→ac edge."
    feedback if wrong: Right. A multi-step route through a creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "ac has exactly 0 outgoing direct edges."
    feedback if wrong: ac has 0 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Only a completed code using every dial.”"
    feedback if wrong: Completed codes are leaves; partial-code nodes are needed to show the choices leading to them. Correct node rule: A legal partial code made from the first few dials; the root is the empty code.
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

### S4 case 1 — `authored-deep-case` · bug: Forbids a rune from appearing anywhere twice
Input shown:
```
REAL PROBLEM INPUT
dials: ["a", "b", "a"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const answers = [];
  function build(index, prefix, used) {
    if (index === input.dials.length) {
      answers.push(prefix);
      return;
    }
    for (const rune of input.dials[index]) {
      if (used.has(rune)) {
        continue;
      }
      used.add(rune);
      build(index + 1, prefix + rune, used);
      used.delete(rune);
    }
  }
  build(0, "", new Set());
  return answers;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "empty", "a", "ab", "aba" · edges: empty→a, a→ab, ab→aba
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid code strings" · expected buggy output `[]` · real correct output `["aba"]`
Diagnosis choices as displayed:
- A The used set rejects rune a on dial 3 even though only adjacent equal runes are forbidden.
- B The code never removes a rune after exploring its branch, changing this input's returned value.
- C The base case accepts an incomplete prefix before every dial is chosen for the shown graph.
Diagnosis answer key + feedback:
- ✅ [global-uniqueness] "The used set rejects rune a on dial 3 even though only adjacent equal runes are forbidden." — feedback: Correct. Repeating a after b is legal, so aba must be returned.
- ❌ [no-backtrack] "The code never removes a rune after exploring its branch, changing this input's returned value." — feedback: used.delete(rune) correctly restores branch state.
- ❌ [accepts-prefix] "The base case accepts an incomplete prefix before every dial is chosen for the shown graph." — feedback: It accepts only when index equals the number of dials.
Graph proof shown in feedback: code rule "An edge is rejected if its rune appeared anywhere earlier in the prefix." → changed graph "The legal prefix chain is empty→a→ab→aba because each new rune differs from the immediately previous rune." → boundary "The final a repeats a non-adjacent rune but not its neighbor b." → returned value "The only valid code is pruned, producing [] instead of ["aba"]."
Output-format probes: ✅ spaces after commas → `[]`; ✅ unquoted strings in array → `[]`; ✅ quoted numbers in array → `[]`; ❌ trailing period → `[].`
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
About your diagnosis: used.delete(rune) correctly restores branch state.
Code rule: An edge is rejected if its rune appeared anywhere earlier in the prefix. → Changed graph: The legal prefix chain is empty→a→ab→aba because each new rune differs from the immediately previous rune. → Reachable boundary: The final a repeats a non-adjacent rune but not its neighbor b.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forbids a rune from appearing anywhere twice
INCORRECT OUTPUT
[]
CORRECT OUTPUT
["aba"]
Code rule: An edge is rejected if its rune appeared anywhere earlier in the prefix. → Changed graph: The legal prefix chain is empty→a→ab→aba because each new rune differs from the immediately previous rune. → Reachable boundary: The final a repeats a non-adjacent rune but not its neighbor b. → Returned value: The only valid code is pruned, producing [] instead of ["aba"].
```

### S4 case 2 — `repeat-after-two-different-runes` · bug: Forbids a rune from appearing anywhere twice
Input shown:
```
REAL PROBLEM INPUT
dials: ["a", "b", "a", "c"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const answers = [];
  function build(index, prefix, used) {
    if (index === input.dials.length) {
      answers.push(prefix);
      return;
    }
    for (const rune of input.dials[index]) {
      if (used.has(rune)) {
        continue;
      }
      used.add(rune);
      build(index + 1, prefix + rune, used);
      used.delete(rune);
    }
  }
  build(0, "", new Set());
  return answers;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "empty", "a", "ab", "aba", "abac" · edges: empty→a, a→ab, ab→aba, aba→abac
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid code strings" · expected buggy output `[]` · real correct output `["abac"]`
Diagnosis choices as displayed:
- A The code forgets to remove b before selecting dial 3.
- B The used set rejects the second a even though b separates the two a runes.
- C The code returns ab before choosing from all four dials.
Diagnosis answer key + feedback:
- ✅ [global-uniqueness] "The used set rejects the second a even though b separates the two a runes." — feedback: Correct. Only equal adjacent runes are forbidden, so abac is legal.
- ❌ [no-backtrack] "The code forgets to remove b before selecting dial 3." — feedback: used.delete runs after each recursive branch; the active prefix intentionally still contains b.
- ❌ [accepts-prefix] "The code returns ab before choosing from all four dials." — feedback: A result is added only at index 4; the valid full result is pruned earlier.
Graph proof shown in feedback: code rule "The used set forbids any rune already anywhere in the prefix." → changed graph "The legal prefix path is empty→a→ab→aba→abac." → boundary "Dial 3 repeats a non-adjacent rune after b." → returned value "The code prunes abac and returns []; the correct array is ["abac"]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forbids a rune from appearing anywhere twice
INCORRECT OUTPUT
[]
CORRECT OUTPUT
["abac"]
Code rule: The used set forbids any rune already anywhere in the prefix. → Changed graph: The legal prefix path is empty→a→ab→aba→abac. → Reachable boundary: Dial 3 repeats a non-adjacent rune after b. → Returned value: The code prunes abac and returns []; the correct array is ["abac"].
```

### S4 case 3 — `two-of-four-valid-codes-pruned` · bug: Forbids a rune from appearing anywhere twice
Input shown:
```
REAL PROBLEM INPUT
dials: ["ab", "c", "ab"]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function solve(input) {
  const answers = [];
  function build(index, prefix, used) {
    if (index === input.dials.length) {
      answers.push(prefix);
      return;
    }
    for (const rune of input.dials[index]) {
      if (used.has(rune)) {
        continue;
      }
      used.add(rune);
      build(index + 1, prefix + rune, used);
      used.delete(rune);
    }
  }
  build(0, "", new Set());
  return answers;
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "empty", "a", "b", "ac", "bc", "aca", "acb", "bca", "bcb" · edges: empty→a, empty→b, a→ac, b→bc, ac→aca, ac→acb, bc→bca, bc→bcb
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "array of valid code strings" · expected buggy output `["acb","bca"]` · real correct output `["aca","acb","bca","bcb"]`
Diagnosis choices as displayed:
- A The code leaves a in used after finishing the a branch, so it cannot start the b branch.
- B The base case adds ac and bc before the third dial.
- C The used set removes aca and bcb because their final rune appeared on dial 1, even though c separates the repeats.
Diagnosis answer key + feedback:
- ✅ [global-uniqueness] "The used set removes aca and bcb because their final rune appeared on dial 1, even though c separates the repeats." — feedback: Correct. All four endings differ from adjacent c, so all four codes are legal.
- ❌ [no-backtrack] "The code leaves a in used after finishing the a branch, so it cannot start the b branch." — feedback: Backtracking removes a; the code does produce both acb and bca.
- ❌ [accepts-prefix] "The base case adds ac and bc before the third dial." — feedback: It adds only length-3 strings; the missing strings were pruned by global uniqueness.
Graph proof shown in feedback: code rule "The used set removes a repeated rune from any later dial, not just an adjacent repeat." → changed graph "The correct prefix tree has four leaves: aca, acb, bca, and bcb." → boundary "Two leaves repeat their first rune after middle rune c." → returned value "The code returns ["acb","bca"] instead of all four valid strings."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Forbids a rune from appearing anywhere twice
INCORRECT OUTPUT
["acb","bca"]
CORRECT OUTPUT
["aca","acb","bca","bcb"]
Code rule: The used set removes a repeated rune from any later dial, not just an adjacent repeat. → Changed graph: The correct prefix tree has four leaves: aca, acb, bca, and bcb. → Reachable boundary: Two leaves repeat their first rune after middle rune c. → Returned value: The code returns ["acb","bca"] instead of all four valid strings.
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```