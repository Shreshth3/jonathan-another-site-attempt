# Batch ad findings

Problems: moocast, museum-vault-keyring, office-rumor-reach, one-color-metro-ride, package-to-the-outpost, path-sum, perfect-size-campsites.
Known systemic issues (SYSTEMIC-NOTES.md) are not repeated generically; only concrete per-problem instances are listed.
All Step 4 declared buggy outputs were re-run with node and match the shown code (moocast 3/4/5, path-sum true/true/true, package 2/2/2, office-rumor 1/2/1; museum/metro/campsites checked by hand).

Two patterns show up in almost every problem here and are NOT in the systemic notes; they are listed once per problem below:
- (P1) Step 3 "feedback if wrong" for YES-keyed direct-edge claims begins with the word "Correct." / "Right." and is shown next to a red × when the student answered NO.
- (P2) Step 4 cases 2/3 show a raw authoring slug in the "Reachable boundary:" slot of the on-screen proof chain (e.g. `initial-keys-only`, `ignore-track-colors`, `unweighted-route`).

---

## Moocast (`moocast`)

### Step 1
- **[MINOR] Picture D feedback describes a different mistake.** Q3 `exact-picture`, Picture D has edges `0→1, 1→0, 2→1` (the 1→2 arrow is reversed). Displayed feedback: "This changes whether direct relations are arrows or two-way links." Nothing about two-way links changed; one arrow was flipped. Fix: "This points the 1→2 transmission the wrong way; cow 2 (p=1) is too weak to reach cow 1."
- **[MINOR] Q8 and Q9 are the Description tab's Example 1 and Example 2 verbatim** (`[[1,3,5],[5,4,3],[7,2,1],[6,1,1]]` → 3 and `[[0,0,2],[3,0,3],[5,0,1]]` → 3), so both "predict" concept checks are answerable by flipping to the Description tab. Q9's input is also reused as the edge-rule remedial and as S3 Q5. Fix: use fresh cow lists.
- **[MINOR] Concept-question raw-input box contains the question, not an input.** Q5 and Q7 show `What does each radio node represent?` / `When should arrow i → j be drawn?` inside the code box under "Optional: draw this input before answering". (Known systemic, noted here only because "radio node" is also odd wording — the lesson never calls nodes "radio nodes" anywhere else.)

### Step 2
- **[MAJOR] Node-name rule flips from Step 1 with no warning.** Step 1/3 require `0: (0,0) p=2`; the harness probe shows submitting those names in Q1 is rejected with "Use numeric IDs 0, 1, 2, ... with no gaps." No guide is shown. Concrete instance of the systemic issue; for this problem the taught format is long and the student has just typed it 9+ times.
- **[MINOR] "Tyson forgets that the listed connections have a direction."** In Moocast nothing is "listed" — edges are computed from position and power. A literal student looks for a list of connections in the input. Fix: "Tyson treats every radio link as two-way."
- **[MINOR] Q3 says "Edge numbers show drawing order" but the transcript records `edge drawing-order numbers visible: false`** at the moment the screen is captured. If numbers only appear after edges are drawn, fine; otherwise the sentence points at nothing.

### Step 3
- **[MAJOR] (P1) Wrong-answer feedback starts with "Correct."** Q2 claim "0: (0,0) p=5 and 1: (3,4) p=1 are directly connected, not merely reachable through a longer route." — if the student answers No they see "× Correct. The mini-example lists 0: (0,0) p=5→1: (3,4) p=1 as one direct edge." Same on Q5. Fix: drop the leading "Correct."
- **[MINOR] Claims are very hard to read because the full label is repeated.** e.g. Q3: "The correct graph has 0: (0,0) p=3→1: (3,0) p=1 and 1: (3,0) p=1→2: (4,0) p=1, so it should also contain a direct 0: (0,0) p=3→2: (4,0) p=1 edge." Fix: refer to cows by index in claim text ("cow 0→cow 2").
- Answer keys for all 5 questions checked and correct.

### Step 4
- **[BLOCKER] Case 1 requires secret labels `0:p3`, `1:p1`, `2:p2`.** No guide is shown; Step 1/3 taught `0: (0,0) p=3`; Step 2 taught `0`. Neither works here. The student cannot pass without guessing this third format. Fix: accept bare index or show the required format.
- **[BLOCKER] Cases 2 and 3 require a DIFFERENT format from case 1** — bare `0`,`1`,`2`,`3` and `0`..`4`. A student who finally discovers `0:p4` from case 1 is rejected again in case 2. Fix: one format for all three cases.
- **[MINOR] Case 3 distractor B says "exclude the starting cow from seen"** — the code has no `seen`; it uses `visited`. Fix wording.
- **[MINOR] Case 2 distractor id `wrong-visited` text is about starting only at cow 0** — fine as a distractor, but its feedback "Trying every starting cow is required..." is the only place the student learns the loop over `startNode` is intentional; ok.
- Buggy outputs 3 / 4 / 5 and correct outputs 2 / 3 / 2 verified by running the code and by hand.

### Cross-step / other
- Four different node-name schemes in one lesson: `0: (0,0) p=2` (S1, S3), `0` (S2), `0:p3` (S4 case 1), `0` (S4 cases 2–3).

---

## The Night Guard's Keyring (`museum-vault-keyring`)

### Step 1
- **[MINOR] Q7 repeats Q1; Q9 repeats Q2.** Q7 shows the identical input `vaults = [[1],[2],[],[2,5],[],[]], startKeys = [0,3]` the student just built in Q1 (and answered "5"), asking "How many distinct vaults can the starting keyring eventually open?" → 5. Q9 shows Q2's input (answered "3") → 3. Two of the five concept checks test nothing new. Fix: fresh inputs.
- **[MINOR] Q7 distractor "7" has feedback that doesn't produce 7.** Feedback: "Vault 2 is reached from both chains but must be counted once." Adding the two chains {0,1,2} + {3,2,5} gives 6, not 7 — and 6 is already the "assume-all-open" distractor. 7 is not a believable single mistake. Fix: replace with a derivable value or fix feedback.
- **[MINOR] Q3 success "Why" mentions "edge label"**: "An exact picture keeps every entity, direct relation, direction, and edge label from the input." This problem has no edge labels.
- All 4 build keys and 5 remedial keys verified.

### Step 2
- Step 1's bare-number labels are accepted (probe passed). Bug texts are accurate. Q3 hidden wrong start `1` (systemic).
- **[MINOR] "CHOOSE THE INITIAL KEY"** — the real problem has a *list* `startKeys`; here the student may only give one. Not stated. Fix: "Choose ONE starting key."

### Step 3
- **[MAJOR] (P1) "Right."/"Correct." shown on a wrong answer.** Q2 "0 can reach 1 through 2, but the graph still has no direct 0→1 edge." → wrong-answer feedback "Right. A multi-step route through 2 creates reachability…"; Q3 and Q5 "…directly connected…" → "Correct. The mini-example lists 1→2 as one direct edge."
- **[MINOR] Feedback text is broken into separate lines around code spans.** Q1 on-screen: "Correct node rule: Every vault index / 0 / through / n−1 / , whether initially openable or not." (each on its own line). Looks like garbage to a student. Fix: render backticks inline.
- Q1 membership claim "Each physical key, even when two vaults contain a key for the same vault" is quoted for `vaults=[[],[0]]`, which has no duplicate keys (systemic).
- Keys for all 5 questions checked and correct.

### Step 4
- **[MAJOR] (P2) Raw slug shown to student.** Cases 2 and 3 success text: "→ Reachable boundary: initial-keys-only →". Fix: write a sentence ("Only vaults named in startKeys are ever opened").
- **[MINOR] Cases 2 and 3 reuse Step 1 Q1 and Q2 inputs** whose correct answers (5, 3) the student already gave, and all three cases show the same 9-line code with the same three diagnosis sentences in shuffled order. After case 1 the student just re-picks "opens initial keys but never reads…". Fix: vary the bug or the code.
- **[MINOR] The shown code contains no graph traversal at all** (it only sizes a Set of startKeys), so the "Code rule → Changed graph → Reachable boundary" chain has no code to point at; distractor "The code follows every found key backward…" is refuted by "It follows no vault edges at all." Fix: use a buggy DFS that opens vaults but forgets to push found keys.
- **[MINOR] Input format differs between cases**: case 1 `vaults: [[1], [2], []]` / `startKeys: [0]` on two lines; cases 2–3 `vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]`.
- Buggy outputs 1 / 2 / 1 and correct 3 / 5 / 3 verified.

### Cross-step / other
- Fine otherwise.

---

## Office Rumor (`office-rumor-reach`)

### Step 1
- **[MINOR] Q9 build choices are `1 | 2` for `n=1, friendships=[], start=0`.** With one employee no mistake yields 2, so the "decision" is a giveaway. Same for the `concept-counterexample` remedial (`n=5` star, choices `6 | 5` — nothing yields 6). Fix: use inputs where the bug value is possible.
- **[MINOR] Q8 question omits "Including the starter".** Q1/Q4/Q6/Q9/Q7 all say "Including employee 0 / the starter, how many…"; Q8 just says "How many employees hear the rumor?" for start=6. A student who reads the change as meaningful may answer 1. Fix: consistent wording.
- **[MINOR] `concept-edge` remedial ("Fresh proof · Read one direct relation") has no relations**: `n=3, friendships=[], start=0`. It cannot exercise the two-way-edge idea the student just got wrong. Fix: e.g. `friendships=[[2,0]], start=0`.
- **[MINOR] Q5 raw-input box contains an instruction line**: "Focus on one listed relation." appears inside the code box after the input.
- Q1 differs from Description Example 1 only by n=5 vs 6 (same answer 3). All keys verified.

### Step 2
- **[MINOR] Q2 "Naomi keeps the middle of the graph but disconnects every leaf."** "Leaf" is never defined for this problem (an employee with exactly one friend). With the natural 3-node chain, *both* ends are leaves so Naomi's graph has no edges at all — "keeps the middle" then keeps nothing. Fix: "Naomi deletes every friendship of anyone who has only one friend."
- Q3 hidden wrong start `1` (systemic). Step 1 labels accepted.

### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1, Q3, Q4: wrong-answer feedback "Correct. The mini-example lists 0—1 as one direct edge." / "Right. A multi-step route…".
- **[MINOR] Q5 claim asserts a false premise**: for `friendships=[]`, "0 can reach 1, so the graph should contain a direct edge between them." 0 cannot reach 1. Keyed NO is still right, but a literal student is stuck on the first half. Fix: "If 0 could reach 1, would that require a direct edge?" or pick a connected input.
- **[MINOR] Edge order reversed vs input** in Q2: "The correct graph has 4—0 and 0—1…" for input `[0,4]`.
- **[MINOR]** Code-span line-break rendering ("Each employee / 0 / through / n−1 / , including…") in Q1 feedback.
- Keys for all 5 questions verified.

### Step 4
- Buggy outputs 1 / 2 / 1 and correct 3 / 5 / 6 verified by running the code. Diagnosis keys correct; hidden labels are bare numbers matching Step 1.
- **[MINOR] Same three distractor ideas (counts-start / shallow / missing-reverse) in all three cases**; after case 1 the answer is recognisable by shape.

### Cross-step / other
- Fine otherwise.

---

## No Transfers, Please (`one-color-metro-ride`)

### Step 1
- **[MAJOR] Q2 `match-picture` captions give away the answer.** Choices are literally labelled "Picture A · correct colors, but arrows", "Picture C · four stations, but every track blue", "Picture D · omit station 3 and its last track", "Picture B · four stations and three two-way tracks". The student picks B by reading the captions, never looking at the pictures. Fix: caption pictures neutrally ("Picture A", …). (Q9's captions also describe each picture, but there the student still has to reason about which one exposes the bug — acceptable.)
- **[MAJOR] Hidden requirement: edges must be coloured red/blue.** The only guide shown is the node-name format. The hidden graph for every build carries `[red]`/`[blue]` on each edge, and the checklist item "Edge colors match the input" only appears after a failed check (S3/S4 transcripts). Nothing before the first failure tells the student to use the "Color" button, or which palette entries count as "red" and "blue". Fix: add "Colour each track red or blue with the Color button" to the guide.
- **[MINOR] Q7 has two "true" choices and asks "what should the function return".** C "true, because the mixed route 0—2—4—3—5 reaches 5" and D "true, because 0—1—3—5 is entirely red" both return true; only the justification differs. A student who reads the question literally has a coin flip. Fix: ask "Which reasoning is correct?" (as path-sum does).
- **[MINOR] Q4/Q7/Q9 raw-input box shows only `source = 0, destination = 2`** under "Optional: draw this input before answering" — there is nothing to draw (the picture is separate).
- All build keys and remedial keys verified (Q1 true, Q3 false, Q6 true, Q8 true; remedials false/false/true/true/false).

### Step 2
- **[MAJOR] What "CORRECT OUTPUT" means here is undiscoverable.** The real function returns true/false and needs a destination; Step 2 has no destination field and expects the *union of stations reachable by an all-red trip or an all-blue trip* from the source (e.g. `[0,1]` for 0—1 red, 1—2 blue). Nothing on screen defines this. Fix: label the field "Stations reachable without a transfer".
- **[MAJOR] Q2 Eva's graph must have edges coloured exactly `slate`.** Grader expects "edges: 0—1 [slate], 1—2 [slate]". The bug text says "Eva erases track colors" but never says which palette colour means "no colour". If Drawing 2 starts as a copy of Drawing 1 the student must recolour every edge to the right neutral swatch. Fix: say "give Eva's tracks the default grey (slate) colour", or accept any non-red/blue colour.
- **[MAJOR] Q1 Joel: student must know to draw a blue edge.** Joel's graph = correct graph minus blue edges; a red-only drawing produces identical outputs and fails with no explanation. The authored goal "Give the rider a complete blue route and no complete red route" is hidden. Fix: show the goal line.
- Q3 first-branch semantics depend on drawing order (systemic).

### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1 "3 and 1 are directly connected…" → wrong-answer feedback "Correct. The mini-example lists 3—1 as one direct edge."; Q4 → "Right. A multi-step route…".
- **[MINOR] Membership distractor "One red copy and one blue copy of every station" is a legitimate model** (layered graph) and the feedback rejects it with jargon: "That duplicates one real station. Color is an edge property in the committed model." A student who has seen the two-layer approach will answer Yes and be told they're wrong without a reason they can follow. Fix: "This lesson's model keeps one node per station and puts the colour on the track."
- **[MINOR] Step 3's "correct node rule" wording differs from Step 1's**: S3 says "One node for each station number, including stations with no track"; Step 1 rules say "Every station 0 through n−1, even if it has no track." Step 1 has no node-rule concept question at all, so the three wrong rules quoted in S3 are the first time the student sees them.
- Keys verified (Q2 "2 has exactly 4" NO — it has 3; Q3 "1 has exactly 1" NO — it has 2; etc.).

### Step 4
- **[MAJOR] (P2)** Case 2 success/feedback text: "→ Reachable boundary: ignore-track-colors →".
- **[MINOR] Case 1 is the Description's Example 2 verbatim** (`n=3, tracks=[[0,1],[1,2]], colors=["red","blue"], 0→2` → false); case 2 is Step 1 Q3; case 3 is the match-picture remedial and S3 Q4. Correct outputs are all already known; only the buggy `true` is new — and it is `true` in all three cases.
- **[MINOR] Distractor feedback says "The source enters seen immediately"** — the code uses `visited`, not `seen`.
- **[MINOR] Input format differs between cases** (case 1 `n: 3` / `tracks: […]` lines; cases 2–3 `n = 4` / `tracks = […]`).
- Buggy true ×3 and correct false ×3 verified. Edge colours are graded here too ("✓ Edge colors match the input") with no guide.

### Cross-step / other
- Fine otherwise.

---

## Package to the Outpost (`package-to-the-outpost`)

### Step 1
- **[MAJOR] Q4 feedback contradicts the problem statement.** Distractor D "Only warehouses on the first route found from headquarters to the outpost." → displayed feedback: "A later route may be faster, so every warehouse in the road network must remain available." The Description says "between any two warehouses there is exactly **one** possible route." There is never a later/faster route. The same sentence is shown in Step 3 (Q1 variant 2, Q4 membership feedback). Fix: "Even though there is only one route, you don't know which warehouses are on it until you search, so every warehouse must be a node."
- **[MINOR] Q4 distractor C feedback uses Dijkstra language**: "The algorithm stores the best time as state for one warehouse node" — there is no "best time" in a tree with one route. Also repeated in S3 Q1 variant 1, Q2, Q5.
- **[MINOR] Q6 distractor C feedback**: "A route with more roads can still be faster." — again implies multiple routes.
- **[MAJOR] Hidden requirement: every edge must carry its hours as a label, format unknown.** Hidden graphs require `0—1 (weight/label "4")`. The only guide shown is the node-name format; "Edge labels or weights match the input" appears only in the after-failure checklist (S3/S4). Nothing says whether to type `4`, `4h`, or `4 hours`, or how (the toolbar shows Edge width / Rename / Color). Fix: guide line "Label each road with just its hours number, e.g. 4".
- **[MINOR] Q1 and Q2 are the Description's Example 1 and Example 2 verbatim** (answers 9 and 6 printed on the Description tab). They are reused again as Step 4 cases 2 and 3.
- All build/remedial keys verified (9, 6, 5, 0; remedials 13, 4, 9, 11, 6).

### Step 2
- **[MAJOR] Q2 Bella (make-one-way): the student must draw the edge "backwards".** Bella's arrow goes from the first-clicked node to the second; with start 0 the only way to expose her is to click the *other* node first (harness drew `1—0`). The authored goal "List a road toward HQ so treating it as one-way blocks the package" is hidden, and Drawing 1 (undirected) shows no direction. A student who draws 0→1 gets Bella's output = correct output and a failure with no hint. Fix: show the goal line and say "Bella's arrow points from the node you clicked first to the node you clicked second."
- Weights are not needed in Step 2 (harness passed without them) but nothing says so after Step 1 demanded them.

### Step 3
- **[MAJOR] (P1)** Q1 variants 0/1, Q3, Q4: wrong-answer feedback begins "Right. A multi-step route through 3 creates reachability…".
- **[MAJOR]** Wrong feedback "A later route may be faster…" (see Step 1) shown on Q1 variant 2 and Q4.
- **[MINOR]** Code-span line-break rendering in Q1 feedback ("Every warehouse / 0 / through / n−1 / ; travel time…").
- Keys verified for all 5 questions.

### Step 4
- **[MAJOR] (P2)** Cases 2 and 3: "→ Reachable boundary: unweighted-route →".
- **[MINOR] All three buggy outputs are `2`** (hop counts of 2 in every case); after case 1 the student types 2 twice more. Fix: a case with a 3-hop route.
- **[MINOR]** Input format differs (case 1 multi-line `n: 3 / roads: …`; cases 2–3 `n=5, roads=…`).
- Buggy 2/2/2 and correct 7/9/6 verified by running the code. Hidden node labels are bare numbers (ok); edge weights are graded ("✓ Edge labels or weights match the input") with no guide.

### Cross-step / other
- Fine otherwise.

---

## Path Sum (`path-sum`)

### Step 1
- **[MAJOR] "levelOrderIndex" is ambiguous when the array contains `null`.** Q1 `[5,4,8,11,null,13,4]` requires `node 5: 13` and `node 6: 4` (the null at index 4 consumes a number); Q6 `[-2,null,-3]` requires `node 2: -3`. A student who numbers the *existing* nodes in level order writes `node 4: 13`, `node 5: 4`, `node 1: -3` and fails with only "every exact node ×". Same trap in the edge-rule remedial (`node 3: 3`), bug-trap remedial (`node 6: 5`), S3 Q1 (`node 6: 5`), S3 Q4 (`node 3: 3`), S4 case 2 (`node 3: 3`). Fix: guide text "use the position in the level-order array, counting null slots".
- **[MINOR] Q2 Picture D feedback describes a different mistake**: Picture D reverses one arrow (`node 1: 4→node 0: 5`); feedback says "This changes whether direct relations are arrows or two-way links."
- **[MINOR] Q5 distractor A is not a "link"**: question "Which links may a root-to-leaf path follow?"; A "A path may stop at any inner node as soon as its running sum hits targetSum." answers a different question.
- **[MINOR] Q3, Q7, Q9 are the Description's examples verbatim** (Example 2 → false; Example 1 with all four path sums listed → "one complete path has sum 22"; Example 2 → "neither complete path has sum 5").
- All build/remedial keys verified (true, false, true, true; remedials true, true, false, true, true).

### Step 2
- **[MAJOR] Q3 "Esmeralda drops every connection touching a degree-one tree node."** "Degree-one" is undefined jargon, and in a chain `root→L→LL` the root itself has degree one — a literal student cannot tell whether Esmeralda also deletes `root→L`. Office-rumor describes the same bug id as "disconnects every leaf". Fix: "Esmeralda deletes every edge that touches a leaf (a node with no children)."
- **[MAJOR] Node names must be `root, L, R, LL…`** — Step 1 taught `node 0: 5`; probe rejected with "Use root, L, R, LL, LR, ... to name tree positions." Only discovered after clicking Check. Output must be quoted and sorted `["L","LL","root"]` (root last). Concrete instance of the systemic issue.
- **[MINOR] Q1 "Mallory stops reading one relation too early"** — a nested object has no list of relations to "read"; "drops the last child arrow you drew" is clearer.

### Step 3
- **[MAJOR] (P1)** Q2 and Q5 "…directly connected…" → wrong-answer feedback "Correct. The mini-example lists node 0: 2→node 1: 3 as one direct edge."
- **[MINOR] Q2 and Q3 use the identical tree `[2,3,4]`** (only targetSum differs, which Step 3 ignores) — the student draws the same three nodes twice.
- **[MINOR] Correct node rule wording differs from Step 1**: S3 "Every existing tree node object, including root, inner nodes, and leaves." vs Step 1 Q4 "Every tree node object on the route, including root and leaf."
- Keys verified for all 5 questions.

### Step 4
- **[BLOCKER] Case 2's correct diagnosis is copied from case 1 and is false for the shown input.** Input `root level-order=[1,2,null,3], targetSum=3`; the keyed-correct choice reads "Node 3 makes prefix 5→3 equal 8, but node 3 still has child 1 and is not a leaf." There is no node 5, no prefix 8, and node 3 is the leaf. The shown proof chain also says "Code rule: Any visited node whose prefix sum is 8 returns true immediately." (target is 3). A literal student rejects the only correct option. Fix: "Node 2 makes prefix 1→2 equal 3, but node 2 still has child 3 and is not a leaf." and "…prefix sum is 3…".
- **[BLOCKER] Hidden node labels flip format between cases.** Case 1 requires bare values `5`, `3`, `1`, `10`; case 2 requires `node 0: 1`, `node 1: 2`, `node 3: 3`; case 3 requires bare `2`, `4`, `1`, `3`, `10`. No guide is shown. A student using Step 1's format fails case 1, switches to bare values, then fails case 2.
- **[MINOR] Case 1 and 3 inputs are nested objects, case 2 is level-order** — the level-order index needed for case 2 labels doesn't exist in the object form.
- **[MINOR]** Case 2 reuses the edge-rule remedial / S3 Q4 input; the student already knows the correct answer is false.
- Buggy true ×3 and correct false ×3 verified by running the code.

### Cross-step / other
- Three label schemes: `node i: v` (S1, S3, S4 case 2), `root/L/R` (S2), bare value (S4 cases 1 and 3).

---

## Perfect-Size Campsites (`perfect-size-campsites`)

### Step 1
- **[MINOR] Q1 is the Description's Example 1 verbatim** (answer 2 printed there).
- **[MINOR] Q3 success "Why" mentions "direction, and edge label"** — the grid graph has neither.
- All build/remedial keys verified (2, 2, 0, 1; remedials 2, 4, 1, 2, 3). Concept keys Q8 (=2: components 3,3,1,2) and Q9 (=3) verified.

### Step 2
- **[MAJOR] Q2 Patrick's hidden start is `(0,1)`.** "Patrick ignores the chosen first grass square and uses a different one." The student's own drawing must contain a node named exactly `(0,1)`, in a different patch from their chosen start, or the counterexample cannot work; the label is only revealed in Drawing 2's title. Fix: state "Patrick always starts at (0,1)" in the bug text.
- **[MINOR] "CHOOSE THE FIRST GRASS SQUARE" / reachable-set output** has no counterpart in the real problem (which scans every cell and returns a count) — the student has just spent Step 1 answering counts and is now asked for `["(0,0)"]` with no explanation of the switch.
- Step 1 `(r,c)` labels accepted (probe passed); outputs must be quoted strings (systemic).

### Step 3
- **[MAJOR] (P1)** Q1 variants 0/2 "(0,0) and (0,1) are directly connected…" → wrong-answer feedback "Correct. The mini-example lists (0,0)—(0,1) as one direct edge."; Q5 → "Correct. Node membership alone creates neither…".
- **[MINOR]** Code-span line-break rendering in Q1 feedback ("Each grass cell marked / 1 / ; non-grass / 0 / cells are not nodes.").
- **[MINOR] Q5 claim wording is odd**: "There is no direct edge between (0,0) and (0,2); merely naming both nodes does not make them reachable." — two statements joined; a student may answer Yes to the first half and No to the second.
- The after-failure "Use this graph model" panel says "Both (0,2) and 0,2 work" — good, but this is the only problem in the batch where such a panel appears; the other six give no model panel at all.
- Keys verified for all 5 questions.

### Step 4
- Buggy 0 / 0 / 0 and correct 2 / 5 / 2 verified by hand; hidden labels are `(r,c)` matching Step 1; diagnosis keys correct and case-specific.
- **[MINOR] All three buggy outputs are `0`**; after case 1 the student types 0 twice.
- **[MINOR]** Case 1 reuses Step 1 Q2/Q5 input. Distractor feedback in case 3 says "marked seen" — code uses `visited`.

### Cross-step / other
- Cleanest problem in the batch.

---

## One-line summary of every finding in this batch

- [MINOR] moocast S1: Q3 Picture D feedback ("arrows or two-way links") describes a different mistake than the reversed 1→2 arrow
- [MINOR] moocast S1: Q8/Q9 are Description Examples 1 and 2 verbatim; Q9 input reused in remedial and S3 Q5
- [MINOR] moocast S1: Q5/Q7 raw-input box holds the question; "radio node" wording unexplained
- [MAJOR] moocast S2: Step 1 format "0: (0,0) p=2" rejected with "Use numeric IDs 0, 1, 2…" and no guide shown
- [MINOR] moocast S2: "Tyson forgets that the listed connections have a direction" — nothing is listed in this problem
- [MINOR] moocast S2: Q3 says "Edge numbers show drawing order" while numbers not visible on capture
- [MAJOR] moocast S3: Q2/Q5 wrong-answer feedback begins "Correct." next to a red ×
- [MINOR] moocast S3: claims repeat full "0: (0,0) p=3" labels three times each and are hard to read
- [BLOCKER] moocast S4: case 1 requires secret labels 0:p3 / 1:p1 / 2:p2 (no guide; differs from S1, S2)
- [BLOCKER] moocast S4: cases 2–3 require bare 0..3 / 0..4, a different format from case 1
- [MINOR] moocast S4: case 3 distractor says "from seen"; code uses visited
- [MINOR] museum-vault-keyring S1: Q7 and Q9 repeat Q1 and Q2 inputs and answers (5, 3)
- [MINOR] museum-vault-keyring S1: Q7 distractor "7" feedback (double-count vault 2) actually yields 6
- [MINOR] museum-vault-keyring S1: Q3 "Why" mentions "edge label" though none exist
- [MINOR] museum-vault-keyring S2: "CHOOSE THE INITIAL KEY" allows one key while the problem has a startKeys list
- [MAJOR] museum-vault-keyring S3: Q2/Q3/Q5 wrong-answer feedback begins "Right."/"Correct."
- [MINOR] museum-vault-keyring S3: Q1 feedback renders "Every vault index / 0 / through / n−1" on separate lines
- [MAJOR] museum-vault-keyring S4: cases 2–3 show raw slug "Reachable boundary: initial-keys-only"
- [MINOR] museum-vault-keyring S4: cases 2–3 reuse S1 Q1/Q2 inputs; same code and same 3 diagnosis sentences in all cases
- [MINOR] museum-vault-keyring S4: shown code has no traversal at all, so graph-proof chain has nothing in the code to point at
- [MINOR] museum-vault-keyring S4: input format differs between case 1 and cases 2–3
- [MINOR] office-rumor-reach S1: Q9 (n=1) choices 1|2 and counterexample-remedial choices 6|5 contain impossible values
- [MINOR] office-rumor-reach S1: Q8 drops "Including the starter" used by every other question
- [MINOR] office-rumor-reach S1: concept-edge remedial "Read one direct relation" has friendships=[]
- [MINOR] office-rumor-reach S1: Q5 raw-input box contains "Focus on one listed relation."
- [MINOR] office-rumor-reach S2: Naomi "disconnects every leaf" — leaf undefined; 3-node chain loses all edges
- [MAJOR] office-rumor-reach S3: Q1/Q3/Q4 wrong-answer feedback begins "Correct."/"Right."
- [MINOR] office-rumor-reach S3: Q5 claim asserts false premise "0 can reach 1" for friendships=[]
- [MINOR] office-rumor-reach S3: Q2 edge written "4—0" for input [0,4]; Q1 feedback code-span line breaks
- [MINOR] office-rumor-reach S4: same three diagnosis shapes in all cases
- [MAJOR] one-color-metro-ride S1: Q2 picture captions state each picture's flaw, giving away the answer
- [MAJOR] one-color-metro-ride S1: edges must be coloured red/blue; no guide before first failure
- [MINOR] one-color-metro-ride S1: Q7 has two "true" choices while asking what the function returns
- [MINOR] one-color-metro-ride S1: Q4/Q7/Q9 raw-input box shows only "source = 0, destination = 2" under "draw this input"
- [MAJOR] one-color-metro-ride S2: "CORRECT OUTPUT" = union of one-colour reachable stations, no destination field, never explained
- [MAJOR] one-color-metro-ride S2: Eva's graph must use edge colour exactly "slate"; not stated
- [MAJOR] one-color-metro-ride S2: Joel round needs a blue edge; hidden goal, red-only drawing fails silently
- [MAJOR] one-color-metro-ride S3: Q1/Q4 wrong-answer feedback begins "Correct."/"Right."
- [MINOR] one-color-metro-ride S3: "red copy and blue copy of every station" is a valid model; feedback uses "committed model" jargon
- [MINOR] one-color-metro-ride S3: node-rule wording differs from Step 1; Step 1 has no node-rule question
- [MAJOR] one-color-metro-ride S4: case 2 shows raw slug "Reachable boundary: ignore-track-colors"
- [MINOR] one-color-metro-ride S4: case 1 is Description Example 2; buggy output true in all three cases
- [MINOR] one-color-metro-ride S4: feedback says "enters seen"; code uses visited; input format differs between cases
- [MAJOR] package-to-the-outpost S1: Q4 feedback "A later route may be faster" contradicts the one-route tree guarantee (also shown in S3 Q1/Q4)
- [MINOR] package-to-the-outpost S1: Q4/Q6 feedback uses "best time"/"more roads can still be faster" language from a non-tree problem
- [MAJOR] package-to-the-outpost S1: edge hours must be typed as labels (e.g. "4"); format and tool never shown before failure
- [MINOR] package-to-the-outpost S1: Q1/Q2 are Description Examples 1 and 2 verbatim, reused as S4 cases 2–3
- [MAJOR] package-to-the-outpost S2: Bella's arrow direction follows click order; must click non-HQ node first; goal hidden
- [MAJOR] package-to-the-outpost S3: Q1/Q3/Q4 wrong-answer feedback begins "Right."
- [MINOR] package-to-the-outpost S3: Q1 feedback code-span line breaks
- [MAJOR] package-to-the-outpost S4: cases 2–3 show raw slug "Reachable boundary: unweighted-route"
- [MINOR] package-to-the-outpost S4: buggy output is 2 in all three cases; input format differs between cases
- [MAJOR] path-sum S1: "levelOrderIndex" ambiguous with null slots (node 5: 13, node 6: 4, node 2: -3, node 3: 3, node 6: 5)
- [MINOR] path-sum S1: Q2 Picture D feedback describes a different mistake than the reversed arrow
- [MINOR] path-sum S1: Q5 distractor A is not a "link"
- [MINOR] path-sum S1: Q3/Q7/Q9 are Description examples verbatim
- [MAJOR] path-sum S2: Esmeralda "degree-one tree node" undefined; unclear whether a single-child root counts
- [MAJOR] path-sum S2: labels must be root/L/R/LL and output ["L","LL","root"]; Step 1 format rejected with no guide
- [MINOR] path-sum S2: Mallory "stops reading one relation too early" — nested object has no relation list
- [MAJOR] path-sum S3: Q2/Q5 wrong-answer feedback begins "Correct."
- [MINOR] path-sum S3: Q2 and Q3 use the identical tree [2,3,4]
- [MINOR] path-sum S3: correct node-rule wording differs from Step 1
- [BLOCKER] path-sum S4: case 2's correct choice "Node 3 makes prefix 5→3 equal 8…" and proof "prefix sum is 8" are copied from case 1 and false for [1,2,null,3], target 3
- [BLOCKER] path-sum S4: hidden labels are bare values in cases 1/3 (5,3,1,10 / 2,4,1,3,10) but "node 0: 1" style in case 2
- [MINOR] path-sum S4: case 1/3 inputs are nested objects, case 2 level-order; case 2 reuses remedial/S3 input
- [MINOR] perfect-size-campsites S1: Q1 is Description Example 1; Q3 "Why" mentions direction and edge label
- [MAJOR] perfect-size-campsites S2: Patrick's hidden start "(0,1)" must exist in the student's drawing; only shown in Drawing 2 title
- [MINOR] perfect-size-campsites S2: "first grass square"/reachable-set output has no counterpart in the count-returning problem
- [MAJOR] perfect-size-campsites S3: Q1/Q5 wrong-answer feedback begins "Correct."
- [MINOR] perfect-size-campsites S3: Q1 feedback code-span line breaks; Q5 claim joins two statements
- [MINOR] perfect-size-campsites S4: buggy output 0 in all three cases; case 1 reuses S1 Q2 input; "marked seen" vs visited
