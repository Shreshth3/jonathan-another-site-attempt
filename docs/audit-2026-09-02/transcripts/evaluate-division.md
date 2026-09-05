# Evaluate Division (`evaluate-division`) — original, directed-graph

## Problem statement (Description tab)

You are given a list of known division facts. Each fact is a pair of variable names `equations[i] = [A, B]` together with a number `values[i]`, which tells you that `A / B = values[i]`. For example, `["a", "b"]` with the value `2.0` means `a / b = 2.0`.

You are also given a list of `queries`, where each query `[C, D]` asks: what is `C / D`?

Return an array with the answer to every query. If an answer cannot be figured out from the known facts (for example, one of the variables was never mentioned), answer `-1.0` for that query.

**Note:** the input is always valid. You will never divide by zero, and the given facts never contradict each other.

### Examples
- Example 1: input `equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]` → output `[6.00000,0.50000,-1.00000,1.00000,-1.00000]`. We know a / b = 2.0 and b / c = 3.0. So a / c = (a / b) * (b / c) = 6.0, and b / a = 1 / 2.0 = 0.5. The variables e and x were never mentioned, so those queries (and any query involving them) answer -1.0. a / a = 1.0 because a is a known variable.
- Example 2: input `equations = [["a","b"],["b","c"],["bc","cd"]], values = [1.5,2.5,5.0], queries = [["a","c"],["c","b"],["bc","cd"],["cd","bc"]]` → output `[3.75000,0.40000,5.00000,0.20000]`. a / c = 1.5 * 2.5 = 3.75, c / b = 1 / 2.5 = 0.4, and cd / bc is the reciprocal of bc / cd.
- Example 3: input `equations = [["a","b"]], values = [0.5], queries = [["a","b"],["b","a"],["a","c"],["x","y"]]` → output `[0.50000,2.00000,-1.00000,-1.00000]`. There is no path from a to c, and neither x nor y is a known variable.

### Graph rules (authored)
- Nodes: The distinct variables a, b, and c.
- Edges: a→b with weight 2, and b→a with weight 1/2.
- Node-name format shown in Step 1/3: Use the exact variable name from the input only. Example: `rate1`. (pattern `^[A-Za-z][A-Za-z0-9_]*$`)
- Step 2 node-label rule: `identifier` — Use lowercase variables of 1 to 5 letters or digits, like a or rate1.


## STEP 1 · Visual proof (9 questions, in the order the student sees them)

### S1 Q1 — BUILD (`build-chain`, facet "path products")
Raw input shown:
```
equations = [["a","b"],["b","c"]], values = [2,3], query = ["a","c"]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is this one query's value?**
Choices as displayed (top to bottom):
1. 6
2. 5
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "6"
    feedback: Correct. Following a→b→c multiplies 2×3.
- ❌ [near-miss] "5"
    feedback: That result follows the add ratios bug, not the exact picture. (misconception: add-ratios)
Graph the grader requires (hidden from student): DIRECTED · nodes: "a", "b", "c" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), b→c (weight/label "3"), c→b (weight/label "1/3")
"Why" shown after success: Following a→b→c multiplies 2×3.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q2 — BUILD (`build-reciprocal`, facet "reciprocal weighted edges")
Raw input shown:
```
equations = [["x","y"]], values = [4], query = ["y","x"]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is this one query's value?**
Choices as displayed (top to bottom):
1. 4
2. 0.25
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "0.25"
    feedback: Correct. The reverse edge carries the reciprocal 1/4.
- ❌ [near-miss] "4"
    feedback: That result follows the reuse forward weight bug, not the exact picture. (misconception: reuse-forward-weight)
Graph the grader requires (hidden from student): DIRECTED · nodes: "x", "y" · edges: x→y (weight/label "4"), y→x (weight/label "0.25")
"Why" shown after success: The reverse edge carries the reciprocal 1/4.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q3 — CONCEPT (`exact-picture`, facet "exact equations")
Raw input shown:
```
equations = [["a","b"],["b","c"]], values = [2,3], query = ["a","c"]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Which picture exactly matches the fresh input?**
Choices as displayed (top to bottom):
1. Picture A / 2 / 0.5 / 3 / 1/3 / a / b / c
2. Picture B / 2 / 0.5 / 3 / a / b / c
3. Picture C / 2 / 0.5 / 3 / 1/3 / a / b / c
4. Picture D / 2 / 0.5 / a / b
Answer key + feedback per choice (data):
- ✅ CORRECT [exact] "Picture A" — picture: DIRECTED · nodes: a, b, c · edges: a→b (2), b→a (0.5), b→c (3), c→b (1/3)
    feedback: Correct. Every node and direct connection matches the input.
- ❌ [missing-edge] "Picture B" — picture: DIRECTED · nodes: a, b, c · edges: a→b (2), b→a (0.5), b→c (3)
    feedback: This picture drops a connection that appears in the input. (misconception: omit-listed-connection)
- ❌ [wrong-relation] "Picture C" — picture: DIRECTED · nodes: a, b, c · edges: b→a (2), a→b (0.5), c→b (3), b→c (1/3)
    feedback: This reverses one-way relations or turns a two-way relation into one-way movement. (misconception: change-edge-direction)
- ❌ [missing-node] "Picture D" — picture: DIRECTED · nodes: a, b · edges: a→b (2), b→a (0.5)
    feedback: This drops an item that still exists even when it has no outgoing move. (misconception: drop-isolated-or-sink-node)
"Why" shown after success: An exact model preserves every item and every direct relation; it never adds reachability shortcuts.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q4 — BUILD (`build-unknown`, facet "variable identity")
Raw input shown:
```
equations = [["a","b"]], values = [2], query = ["a","z"]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is this one query's value?**
Choices as displayed (top to bottom):
1. -1
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "-1"
    feedback: Correct. Variable z never appears in the equation graph.
- ❌ [near-miss] "1"
    feedback: That result follows the unknown self or target equals one bug, not the exact picture. (misconception: unknown-self-or-target-equals-one)
Graph the grader requires (hidden from student): DIRECTED · nodes: "a", "b" · edges: a→b (weight/label "2"), b→a (weight/label "0.5")
"Why" shown after success: Variable z never appears in the equation graph.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q5 — CONCEPT (`core-rule`, facet "variable identity")
Raw input shown:
```
For equations `a/b = 2` and `b/c = 3`, what are the graph nodes?
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **For equations a/b = 2 and b/c = 3, what are the graph nodes?**
Choices as displayed (top to bottom):
1. A / Two nodes: the equation a/b and the equation b/c.
2. B / The distinct variables a, b, and c.
3. C / Two numeric nodes: 2 and 3.
4. D / Only the two variables named in the current query.
Answer key + feedback per choice (data):
- ✅ CORRECT [variables] "The distinct variables a, b, and c."
    feedback: Correct. Queries ask for a route between variable nodes.
- ❌ [equations] "Two nodes: the equation `a/b` and the equation `b/c`."
    feedback: Equations create weighted connections. Their variable names are the states DFS visits. (misconception: equation-as-node)
- ❌ [values] "Two numeric nodes: 2 and 3."
    feedback: The numbers are edge weights used during multiplication, not places the search visits. (misconception: weight-as-node)
- ❌ [query-only] "Only the two variables named in the current query."
    feedback: Intermediate variables such as b are needed to connect a query like a/c. (misconception: omit-intermediate-variable)
"Why" shown after success: Correct. Queries ask for a route between variable nodes.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q6 — BUILD (`build-known-self`, facet "variable identity")
Raw input shown:
```
equations = [["a","b"]], values = [2], query = ["a","a"]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "1 · Draw the graph"
Question shown: **What is this one query's value?**
Choices as displayed (top to bottom):
1. -1
2. 1
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "1"
    feedback: Correct. Known variable a divided by itself is the empty product 1.
- ❌ [near-miss] "-1"
    feedback: That result follows the reject zero edge path bug, not the exact picture. (misconception: reject-zero-edge-path)
Graph the grader requires (hidden from student): DIRECTED · nodes: "a", "b" · edges: a→b (weight/label "2"), b→a (weight/label "0.5")
"Why" shown after success: Known variable a divided by itself is the empty product 1.
Result when solved correctly through the UI: PASSED · (answer buttons were disabled until a node was drawn)

### S1 Q7 — CONCEPT (`relation-rule`, facet "reciprocal weighted edges")
Raw input shown:
```
How should the fact `a / b = 2` be drawn?
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **How should the fact a / b = 2 be drawn?**
Choices as displayed (top to bottom):
1. A / a→b and b→a, both with weight 2.
2. B / a→b with weight 2, and b→a with weight 1/2.
3. C / Only a→b with weight 2.
4. D / A plain two-way line between a and b with no number.
Answer key + feedback per choice (data):
- ✅ CORRECT [reciprocal] "a→b with weight 2, and b→a with weight 1/2."
    feedback: Correct. The reverse division is the reciprocal.
- ❌ [same-weight] "a→b and b→a, both with weight 2."
    feedback: Reversing a ratio also reverses its value: b/a is 1/2, not 2. (misconception: forget-reciprocal)
- ❌ [one-way] "Only a→b with weight 2."
    feedback: Queries may travel backward, so the reciprocal edge must also be available. (misconception: omit-reverse-division)
- ❌ [unweighted] "A plain two-way line between a and b with no number."
    feedback: Without weights, a path can show that variables connect but cannot compute their quotient. (misconception: drop-edge-weight)
"Why" shown after success: Correct. The reverse division is the reciprocal.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q8 — CONCEPT (`predict-output`, facet "path products")
Raw input shown:
```
equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **Given a/b=2 and b/c=3, what are [a/c,b/a,a/e,a/a,x/x]?**
Choices as displayed (top to bottom):
1. A / [5,0.5,-1,1,-1]
2. B / [6,0.5,-1,1,-1]
3. C / [6,2,-1,1,-1]
4. D / [6,0.5,-1,1,1]
Answer key + feedback per choice (data):
- ✅ CORRECT [correct] "`[6,0.5,-1,1,-1]`"
    feedback: Correct. Multiply the a→c path, use a reciprocal, and reject unknown variables.
- ❌ [add] "`[5,0.5,-1,1,-1]`"
    feedback: Path weights multiply; they do not add. (misconception: add-ratios)
- ❌ [no-reciprocal] "`[6,2,-1,1,-1]`"
    feedback: b/a is the reciprocal of a/b. (misconception: forget-reciprocal)
- ❌ [unknown-self] "`[6,0.5,-1,1,1]`"
    feedback: x/x is -1 because x never appears in the graph. (misconception: unknown-self-is-one)
"Why" shown after success: Correct. Multiply the a→c path, use a reciprocal, and reject unknown variables.
Result when solved correctly through the UI: PASSED · (answer buttons enabled before any drawing)

### S1 Q9 — CONCEPT (`bug-trap`, facet "path products")
Raw input shown:
```
equations = [["a","b"],["b","c"],["bc","cd"]], values = [1.5,2.5,5.0], queries = [["a","c"],["c","b"],["bc","cd"],["cd","bc"]]
```
Node-name guide shown: Required node-name format: Use the exact variable name from the input only. Example: rate1.
Drawing-tool title: "Optional: draw this input before answering"
Question shown: **If bc/cd=5, what should the picture give for cd/bc?**
Choices as displayed (top to bottom):
1. A / 5
2. B / 0.2
3. C / -1
4. D / -5
Answer key + feedback per choice (data):
- ✅ CORRECT [point-two] "`0.2`"
    feedback: Correct. Reverse travel uses 1/5.
- ❌ [five] "`5`"
    feedback: This reuses the forward weight instead of its reciprocal. (misconception: same-reverse-weight)
- ❌ [minus-one] "`-1`"
    feedback: Both variables are known and connected by a reverse edge. (misconception: treat-edge-one-way)
- ❌ [minus-five] "`-5`"
    feedback: Reversing a ratio does not change its sign. (misconception: negate-instead-of-reciprocal)
"Why" shown after success: Correct. Reverse travel uses 1/5.
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
equations = [["m","n"]], values = [5], query = ["m","n"]
```
Remedial question: **What is this one query's value?** · choices shown: 5 | 0.2
Remedial answer key: ✅ "5" — Correct. The query follows the forward m→n edge.; ❌ "0.2" — That result follows the reverse query bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "m", "n" · edges: m→n (weight/label "5"), n→m (weight/label "0.2")
Remedial result: PASSED

#### After answering concept `core-rule` wrong with choice [equations]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
The distinct variables a, b, and c.
Your choice: Equations create weighted connections. Their variable names are the states DFS visits.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the node rule"
Remedial raw input:
```
equations = [["a","b"],["c","d"]], values = [2,4], query = ["a","d"]
```
Remedial question: **What is this one query's value?** · choices shown: 8 | -1
Remedial answer key: ✅ "-1" — Correct. No path connects the two equation components.; ❌ "8" — That result follows the multiply across components bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "a", "b", "c", "d" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), c→d (weight/label "4"), d→c (weight/label "0.25")
Remedial result: PASSED

#### After answering concept `relation-rule` wrong with choice [same-weight]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
a→b with weight 2, and b→a with weight 1/2.
Your choice: Reversing a ratio also reverses its value: b/a is 1/2, not 2.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Protect the direct-relation rule"
Remedial raw input:
```
equations = [["p","q"],["q","r"]], values = [2,5], query = ["r","p"]
```
Remedial question: **What is this one query's value?** · choices shown: 0.1 | 10
Remedial answer key: ✅ "0.1" — Correct. r→q→p multiplies 1/5 by 1/2.; ❌ "10" — That result follows the ignore reciprocals bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "p", "q", "r" · edges: p→q (weight/label "2"), q→p (weight/label "0.5"), q→r (weight/label "5"), r→q (weight/label "0.2")
Remedial result: PASSED

#### After answering concept `predict-output` wrong with choice [add]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
[6,0.5,-1,1,-1]
Your choice: Path weights multiply; they do not add.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Predict from the picture"
Remedial raw input:
```
equations = [["a","b"],["b","c"],["c","d"]], values = [2,3,4], query = ["a","d"]
```
Remedial question: **What is this one query's value?** · choices shown: 9 | 24
Remedial answer key: ✅ "24" — Correct. The path product is 2×3×4.; ❌ "9" — That result follows the add ratios bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "a", "b", "c", "d" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), b→c (weight/label "3"), c→b (weight/label "1/3"), c→d (weight/label "4"), d→c (weight/label "0.25")
Remedial result: PASSED

#### After answering concept `bug-trap` wrong with choice [five]
Feedback shown:
```
Contradiction found.
CORRECT CHOICE
0.2
Your choice: This reuses the forward weight instead of its reciprocal.
This revealed answer does not count. Prove the idea on a fresh blank graph.
```
Button: "Build a fresh proof →" → remedial build "Fresh proof · Catch a near-miss implementation"
Remedial raw input:
```
equations = [["u","v"],["v","w"]], values = [3,2], query = ["w","u"]
```
Remedial question: **What is this one query's value?** · choices shown: 0.16666666666666666 | -1
Remedial answer key: ✅ "0.16666666666666666" — Correct. The reverse query succeeds only when reciprocal edges are stored.; ❌ "-1" — That result follows the store forward edges only bug, not the exact picture.
Remedial required graph (hidden): DIRECTED · nodes: "u", "v", "w" · edges: u→v (weight/label "3"), v→u (weight/label "1/3"), v→w (weight/label "2"), w→v (weight/label "0.5")
Remedial result: PASSED


## STEP 2 · Counterexample lab (3 questions)

### S2 Q1 — bug `drop-last-edge` (authored level "Final ratio arrow skipped"; authored goal, NOT shown to student: "Make the last listed ratio arrow necessary to connect one more variable.")
Everything the student sees (text):
```
I
Imani's broken search

Imani builds every listed connection except the last one.

Your main goal: Expose Imani's mistake. Draw two graphs: first the correct graph, then Imani's graph using the mistake. Edge numbers show drawing order.

CHOOSE THE QUERY NUMERATOR
query numerator
OUTPUT
CORRECT OUTPUT
IMANI’S OUTPUT
Drawing 1 of 2: Correct graph · Choose query numerator
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
2 · Imani's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUERY NUMERATOR / query numerator", placeholder "Example: a", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | IMANI’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: true
Probe — submitting the graph with Step 1's node names ("a", "b", "c"): accepted
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"b\",\"c\"]","buggy":"[\"a\",\"b\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes a, b, c · edges (in drawing order) a→b, b→c · start a
Grader's expected answers: correct output `["a","b","c"]` · character's output `["a","b"]` · character's graph must be exactly: DIRECTED · nodes: a, b, c · edges: a→b
Output-format probes (what the "Correct output" field accepts): ❌ no brackets, comma+space → `a, b, c`; ❌ curly braces → `{a,b,c}`; ✅ quoted numbers/strings → `["a","b","c"]`; ❌ reversed order → `["c","b","a"]`; ✅ spaces inside brackets → `[ "a" , "b" , "c" ]`; ❌ unquoted labels (if non-numeric) → `[a,b,c]`
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","b","c"]
IMANI'S OUTPUT
["a","b"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q2 — bug `shallow-search` (authored level "Ratio chain stopped"; authored goal, NOT shown to student: "Make one variable discoverable only through two known equations.")
Everything the student sees (text):
```
R
Remy's broken search

Remy stops after one hop instead of continuing.

Your main goal: Expose Remy's mistake. Draw two graphs: first the correct graph, then Remy's graph using the mistake.

CHOOSE THE QUERY NUMERATOR
query numerator
OUTPUT
CORRECT OUTPUT
REMY’S OUTPUT
Drawing 1 of 2: Correct graph · Choose query numerator
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
2 · Remy's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUERY NUMERATOR / query numerator", placeholder "Example: a", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | REMY’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\",\"b\",\"c\"]","buggy":"[\"a\",\"b\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes a, b, c · edges (in drawing order) a→b, b→c · start a
Grader's expected answers: correct output `["a","b","c"]` · character's output `["a","b"]` · character's graph must be exactly: DIRECTED · nodes: a, b, c · edges: a→b, b→c
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a","b","c"]
REMY'S OUTPUT
["a","b"]
Why it works: the same input produces different reachable sets under the broken and correct rules.
```

### S2 Q3 — bug `wrong-start` (authored level "Wrong query numerator"; authored goal, NOT shown to student: "Choose a start variable that is not listed first and has a different ratio component.")
Everything the student sees (text):
```
J
June's broken search

June ignores the chosen query numerator and uses a different one.

Your main goal: Expose June's mistake. Draw two graphs: first the correct graph, then June's graph using the mistake.

CHOOSE THE QUERY NUMERATOR
query numerator
OUTPUT
CORRECT OUTPUT
JUNE’S OUTPUT
Drawing 1 of 2: Correct graph · Choose query numerator
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
2 · June's graph
Check my graph
→
```
Start field: label "CHOOSE THE QUERY NUMERATOR / query numerator", placeholder "Example: a", prefilled "", readonly=false
Output labels: CORRECT OUTPUT | JUNE’S OUTPUT · Node-name guide shown: NONE · edge drawing-order numbers visible: false
Authored wrong start used by the character: "b" (only revealed in Drawing 2's title)
Minimal starter graph evaluation: {"exposes":true,"correct":"[\"a\"]","buggy":"[\"b\",\"c\"]"}
Graph the harness submitted as the correct graph: DIRECTED nodes a, b, c · edges (in drawing order) b→c · start a
Grader's expected answers: correct output `["a"]` · character's output `["b","c"]` · character's graph must be exactly: DIRECTED · nodes: a, b, c · edges: b→c
Result: PASSED
Success text:
```
Counterexample confirmed.
CORRECT OUTPUT
["a"]
JUNE'S OUTPUT
["b","c"]
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
equations = [["u","v"],["v","w"]], values = [3,2], query = ["w","u"]
```
Node-name guide: Required node-name format: Use the exact variable name from the input only. Example: rate1. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "u", "v", "w" · edges: u→v (weight/label "3"), v→u (weight/label "1/3"), v→w (weight/label "2"), w→v (weight/label "0.5")
Claims, variant 0 (answered wrong on purpose):
- [YES is correct] (direct-vs-reach) "u can reach w through v, but the graph still has no direct u→w edge."
    feedback if wrong: Right. A multi-step route through v creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "v has exactly 2 outgoing direct edges."
    feedback if wrong: v has 2 outgoing direct edges.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Two numeric nodes: 2 and 3.”"
    feedback if wrong: The numbers are edge weights used during multiplication, not places the search visits. Correct node rule: One node for every distinct variable appearing in the equations.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Right. A multi-step route through v creates reachability, not a new direct edge.
×
v has 2 outgoing direct edges.
×
The numbers are edge weights used during multiplication, not places the search visits. Correct node rule: One node for every distinct variable appearing in the equations.
```
Claims, variant 1 (answered wrong on purpose):
- [NO is correct] (membership) "Use this node rule for the graph: “Only the two variables named in the current query.”"
    feedback if wrong: Intermediate variables such as b are needed to connect a query like a/c. Correct node rule: One node for every distinct variable appearing in the equations.
- [NO is correct] (direct-vs-reach) "The correct graph has w→v and v→u, so it should also contain a direct w→u edge."
    feedback if wrong: Two direct edges through v do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "w has exactly 0 outgoing direct edges."
    feedback if wrong: w has 1 outgoing direct edge.
Feedback shown after answering all wrong:
```
Review these claims, then try another check.
×
Intermediate variables such as b are needed to connect a query like a/c. Correct node rule: One node for every distinct variable appearing in the equations.
×
Two direct edges through v do not create a new shortcut. Only one-step relations defined by the problem become edges.
×
w has 1 outgoing direct edge.
```
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has u→v and v→w, so it should also contain a direct u→w edge."
    feedback if wrong: Two direct edges through v do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "u has exactly 2 outgoing direct edges."
    feedback if wrong: u has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Two nodes: the equation `a/b` and the equation `b/c`.”"
    feedback if wrong: Equations create weighted connections. Their variable names are the states DFS visits. Correct node rule: One node for every distinct variable appearing in the equations.
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
equations = [["m","n"]], values = [5], query = ["m","n"]
```
Node-name guide: Required node-name format: Use the exact variable name from the input only. Example: rate1. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "m", "n" · edges: m→n (weight/label "5"), n→m (weight/label "0.2")
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "n can reach m, but there is no direct n→m edge."
    feedback if wrong: The mini-example lists n→m as one direct edge. A direct edge is different from a longer reachable route.
- [NO is correct] (local-degree) "n has exactly 0 outgoing direct edges."
    feedback if wrong: n has 1 outgoing direct edge.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the two variables named in the current query.”"
    feedback if wrong: Intermediate variables such as b are needed to connect a query like a/c. Correct node rule: One node for every distinct variable appearing in the equations.
Result: PASSED

### S3 Q3
Raw input shown:
```
equations = [["a","b"],["c","d"]], values = [2,4], query = ["a","d"]
```
Node-name guide: Required node-name format: Use the exact variable name from the input only. Example: rate1. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "a", "b", "c", "d" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), c→d (weight/label "4"), d→c (weight/label "0.25")
Claims, variant 2 (answered correctly):
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Two numeric nodes: 2 and 3.”"
    feedback if wrong: The numbers are edge weights used during multiplication, not places the search visits. Correct node rule: One node for every distinct variable appearing in the equations.
- [YES is correct] (direct-vs-reach) "a and b are directly connected, not merely reachable through a longer route."
    feedback if wrong: Correct. The mini-example lists a→b as one direct edge.
- [YES is correct] (local-degree) "a has exactly 1 outgoing direct edge."
    feedback if wrong: a has 1 outgoing direct edge.
Result: PASSED

### S3 Q4
Raw input shown:
```
equations = [["p","q"],["q","r"]], values = [2,5], query = ["r","p"]
```
Node-name guide: Required node-name format: Use the exact variable name from the input only. Example: rate1. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "p", "q", "r" · edges: p→q (weight/label "2"), q→p (weight/label "0.5"), q→r (weight/label "5"), r→q (weight/label "0.2")
Claims, variant 2 (answered correctly):
- [YES is correct] (direct-vs-reach) "r can reach p through q, but the graph still has no direct r→p edge."
    feedback if wrong: Right. A multi-step route through q creates reachability, not a new direct edge.
- [YES is correct] (local-degree) "p has exactly 1 outgoing direct edge."
    feedback if wrong: p has 1 outgoing direct edge.
- [YES is correct] (membership) "It would be a mistake to use this node rule: “Two nodes: the equation `a/b` and the equation `b/c`.”"
    feedback if wrong: Equations create weighted connections. Their variable names are the states DFS visits. Correct node rule: One node for every distinct variable appearing in the equations.
Result: PASSED

### S3 Q5
Raw input shown:
```
equations = [["a","b"],["b","c"],["c","d"]], values = [2,3,4], query = ["a","d"]
```
Node-name guide: Required node-name format: Use the exact variable name from the input only. Example: rate1. · drawing title "1 · Draw the graph" · claim buttons disabled until a node is drawn: true
Required graph (hidden): DIRECTED · nodes: "a", "b", "c", "d" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), b→c (weight/label "3"), c→b (weight/label "1/3"), c→d (weight/label "4"), d→c (weight/label "0.25")
Claims, variant 2 (answered correctly):
- [NO is correct] (direct-vs-reach) "The correct graph has c→b and b→a, so it should also contain a direct c→a edge."
    feedback if wrong: Two direct edges through b do not create a new shortcut. Only one-step relations defined by the problem become edges.
- [NO is correct] (local-degree) "c has exactly 3 outgoing direct edges."
    feedback if wrong: c has 2 outgoing direct edges.
- [NO is correct] (membership) "Use this node rule for the graph: “Only the two variables named in the current query.”"
    feedback if wrong: Intermediate variables such as b are needed to connect a query like a/c. Correct node rule: One node for every distinct variable appearing in the equations.
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

### S4 case 1 — `authored-deep-case` · bug: Reverse equations keep the same weight
Input shown:
```
REAL PROBLEM INPUT
equations = [["a","b"]], values = [2], queries = [["b","a"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function calcEquation(equations, values, queries) {
  const graph = new Map();
  function add(firstValue, secondValue, weight) {
    if (!graph.has(firstValue)) {
      graph.set(firstValue, []);
    }
    graph.get(firstValue).push([secondValue, weight]);
  }
  equations.forEach(([firstValue, secondValue], index) => {
    add(firstValue, secondValue, values[index]);
    add(secondValue, firstValue, values[index]);
  });
  function find(start, target) {
    if (!graph.has(start) || !graph.has(target)) {
      return -1;
    }
    const stack = [[start, 1]];
    const visited = new Set();
    while (stack.length) {
      const [node, total] = stack.pop();
      if (node === target) {
        return total;
      }
      if (visited.has(node)) {
        continue;
      }
      visited.add(node);
      for (const [next, weight] of graph.get(node)) {
        stack.push([next, total * weight]);
      }
    }
    return -1;
  }
  return queries.map(([firstValue, secondValue]) =>
    find(firstValue, secondValue),
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "a", "b" · edges: a→b (weight/label "×2"), b→a (weight/label "×1/2")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of query values" · expected buggy output `[2]` · real correct output `[0.5]`
Diagnosis choices as displayed:
- A Path values should be added instead of multiplied.
- B The reverse edge should carry the reciprocal weight.
- C Each variable needs an explicit weight-1 self-loop in this case.
Diagnosis answer key + feedback:
- ✅ [wrong-reciprocal] "The reverse edge should carry the reciprocal weight." — feedback: Correct. a/b=2 makes a→b weight 2 and b→a weight 1/2.
- ❌ [should-add] "Path values should be added instead of multiplied." — feedback: No. Chained ratios multiply.
- ❌ [missing-self-edge] "Each variable needs an explicit weight-1 self-loop in this case." — feedback: No. Self-queries can be handled when start equals target; that would not fix b/a.
Graph proof shown in feedback: code rule "Both directions receive weight 2." → changed graph "The two directed edges between a and b have reciprocal weights: 2 and 1/2." → boundary "The query walks against the written equation." → returned value "The path product is 2 instead of 1/2."
Output-format probes: ✅ spaces after commas → `[2]`; ❌ quoted numbers in array → `["2"]`; ❌ trailing period → `[2].`
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
About your diagnosis: No. Chained ratios multiply.
Code rule: Both directions receive weight 2. → Changed graph: The two directed edges between a and b have reciprocal weights: 2 and 1/2. → Reachable boundary: The query walks against the written equation.
```
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Reverse equations keep the same weight
INCORRECT OUTPUT
[2]
CORRECT OUTPUT
[0.5]
Code rule: Both directions receive weight 2. → Changed graph: The two directed edges between a and b have reciprocal weights: 2 and 1/2. → Reachable boundary: The query walks against the written equation. → Returned value: The path product is 2 instead of 1/2.
```

### S4 case 2 — `build-chain` · bug: Reverse equations keep the same weight
Input shown:
```
REAL PROBLEM INPUT
equations = [["a","b"],["b","c"]], values = [2,3], queries = [["c","a"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function calcEquation(equations, values, queries) {
  const graph = new Map();
  function add(firstValue, secondValue, weight) {
    if (!graph.has(firstValue)) {
      graph.set(firstValue, []);
    }
    graph.get(firstValue).push([secondValue, weight]);
  }
  equations.forEach(([firstValue, secondValue], index) => {
    add(firstValue, secondValue, values[index]);
    add(secondValue, firstValue, values[index]);
  });
  function find(start, target) {
    if (!graph.has(start) || !graph.has(target)) {
      return -1;
    }
    const stack = [[start, 1]];
    const visited = new Set();
    while (stack.length) {
      const [node, total] = stack.pop();
      if (node === target) {
        return total;
      }
      if (visited.has(node)) {
        continue;
      }
      visited.add(node);
      for (const [next, weight] of graph.get(node)) {
        stack.push([next, total * weight]);
      }
    }
    return -1;
  }
  return queries.map(([firstValue, secondValue]) =>
    find(firstValue, secondValue),
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "a", "b", "c" · edges: a→b (weight/label "2"), b→a (weight/label "0.5"), b→c (weight/label "3"), c→b (weight/label "1/3")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of query values" · expected buggy output `[6]` · real correct output `[0.16666666666666666]`
Diagnosis choices as displayed:
- A Path values should be added instead of multiplied.
- B Each variable needs an explicit weight-1 self-loop.
- C The reverse edge should carry the reciprocal weight.
Diagnosis answer key + feedback:
- ✅ [wrong-reciprocal] "The reverse edge should carry the reciprocal weight." — feedback: Correct. The reverse query c/a crosses two reciprocal edges: 1/3 then 1/2; the code wrongly reuses weights 3 and 2. Therefore the shown code returns [6], while the real problem returns [0.16666666666666666].
- ❌ [should-add] "Path values should be added instead of multiplied." — feedback: No. Chained ratios multiply.
- ❌ [missing-self-edge] "Each variable needs an explicit weight-1 self-loop." — feedback: A self-query can return 1 when start equals target. Self-loops do not repair an incorrect reciprocal edge.
Graph proof shown in feedback: code rule "Both directions receive weight 2." → changed graph "Nodes: a, b, c. Direct arrows: a→b (2); b→a (0.5); b→c (3); c→b (1/3)." → boundary "The reverse query c/a crosses two reciprocal edges: 1/3 then 1/2; the code wrongly reuses weights 3 and 2." → returned value "The shown code returns [6]; the source-repo reference solution returns [0.16666666666666666]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Reverse equations keep the same weight
INCORRECT OUTPUT
[6]
CORRECT OUTPUT
[0.16666666666666666]
Code rule: Both directions receive weight 2. → Changed graph: Nodes: a, b, c. Direct arrows: a→b (2); b→a (0.5); b→c (3); c→b (1/3). → Reachable boundary: The reverse query c/a crosses two reciprocal edges: 1/3 then 1/2; the code wrongly reuses weights 3 and 2. → Returned value: The shown code returns [6]; the source-repo reference solution returns [0.16666666666666666].
```

### S4 case 3 — `build-reciprocal` · bug: Reverse equations keep the same weight
Input shown:
```
REAL PROBLEM INPUT
equations = [["x","y"]], values = [4], queries = [["y","x"]]
```
Node-name guide shown: NONE · drawing title "1 · Draw the graph" · output box disabled until drawing starts: true · output placeholder "Example: false, 3, or [1, 2]"
Code shown:
```
function calcEquation(equations, values, queries) {
  const graph = new Map();
  function add(firstValue, secondValue, weight) {
    if (!graph.has(firstValue)) {
      graph.set(firstValue, []);
    }
    graph.get(firstValue).push([secondValue, weight]);
  }
  equations.forEach(([firstValue, secondValue], index) => {
    add(firstValue, secondValue, values[index]);
    add(secondValue, firstValue, values[index]);
  });
  function find(start, target) {
    if (!graph.has(start) || !graph.has(target)) {
      return -1;
    }
    const stack = [[start, 1]];
    const visited = new Set();
    while (stack.length) {
      const [node, total] = stack.pop();
      if (node === target) {
        return total;
      }
      if (visited.has(node)) {
        continue;
      }
      visited.add(node);
      for (const [next, weight] of graph.get(node)) {
        stack.push([next, total * weight]);
      }
    }
    return -1;
  }
  return queries.map(([firstValue, secondValue]) =>
    find(firstValue, secondValue),
  );
}
```
Required graph (hidden from student; labels must match EXACTLY): DIRECTED · nodes: "x", "y" · edges: x→y (weight/label "4"), y→x (weight/label "0.25")
Output field label: "2 · PREDICT THE EXACT RETURNED VALUE" · authored outputFormat (not shown): "Array of query values" · expected buggy output `[4]` · real correct output `[0.25]`
Diagnosis choices as displayed:
- A The reverse edge should carry the reciprocal weight.
- B Path values should be added instead of multiplied.
- C Each variable needs an explicit weight-1 self-loop.
Diagnosis answer key + feedback:
- ✅ [wrong-reciprocal] "The reverse edge should carry the reciprocal weight." — feedback: Correct. The reverse query y/x must use reciprocal weight 1/4, while the shown code stores 4 in both directions. Therefore the shown code returns [4], while the real problem returns [0.25].
- ❌ [should-add] "Path values should be added instead of multiplied." — feedback: No. Chained ratios multiply.
- ❌ [missing-self-edge] "Each variable needs an explicit weight-1 self-loop." — feedback: A self-query can return 1 when start equals target. Self-loops do not repair an incorrect reciprocal edge.
Graph proof shown in feedback: code rule "Both directions receive weight 2." → changed graph "Nodes: x, y. Direct arrows: x→y (4); y→x (0.25)." → boundary "The reverse query y/x must use reciprocal weight 1/4, while the shown code stores 4 in both directions." → returned value "The shown code returns [4]; the source-repo reference solution returns [0.25]."
Result: PASSED
Success text:
```
Trace confirmed.
MISCONCEPTION
Reverse equations keep the same weight
INCORRECT OUTPUT
[4]
CORRECT OUTPUT
[0.25]
Code rule: Both directions receive weight 2. → Changed graph: Nodes: x, y. Direct arrows: x→y (4); y→x (0.25). → Reachable boundary: The reverse query y/x must use reciprocal weight 1/4, while the shown code stores 4 in both directions. → Returned value: The shown code returns [4]; the source-repo reference solution returns [0.25].
```

Completion screen: ```
TRACED
Step 4 complete.

You solved all 3 code cases.

Choose another problem
→
Practice Step 4 again
```