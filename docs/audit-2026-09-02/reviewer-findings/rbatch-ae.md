# Batch rbatch-ae findings

Problems reviewed: properties-graph, reachable-nodes-with-restrictions, routes-past-the-coffee-cart, runes-on-the-castle-door, save-the-date-phone-chain, shut-the-garden-valve, structy-largest-component.

Every Step 1 build key and every remedial key was recomputed by hand. Every Step 4 buggy output was re-run with node (`scratchpad/verify-step4.js`); all 21 declared buggy outputs match the code. Known systemic issues (Step 2 label scheme / output JSON format / wrong-start hidden / click-order direction, Step 3 same-answer parity, Step 1 question-in-code-box, Examples tab) are only mentioned where a problem-specific detail adds something.

---

## Properties Graph (`properties-graph`)

### Step 1
- **[MAJOR] Node names must be de-duplicated, but nothing says so.** Guide: "Name each row row index: {comma-separated set values}. Example: row 1: {2,3}." Q4 input `[[1,1],[1,2]]` requires the hidden label `row 0: {1}` (not `row 0: {1,1}`); the bug-trap remedial `[[7,7],[7],[8]]` requires `row 0: {7}`; Step 3 Q5 requires `row 0: {7}` too. A literal student copies the row as written and gets only "Every exact node label… ×". Fix: add "write each value once — row [1,1] is `row 0: {1}`" to the guide. (Q4 `build-2`, bug-trap remedial, S3 Q5)
- **[MINOR] Q7 and Q8 are the Description's Example 1 and Example 2 verbatim** (`[[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]], k=1` → 3 and `[[1,2,3],[2,3,4],[4,3,5]], k=2` → 1). Both answers are printed with explanations in the Description tab, so the two "predict" questions test reading, not the graph. (Q7 `predict-output`, Q8 `bug-trap`)

### Step 2
- **[MAJOR] The problem has no start node, but Step 2 invents one and asks for a reachable-row list.** Field "CHOOSE THE CHOSEN ROW / chosen row"; outputs "CORRECT OUTPUT" = `[0,1]` (rows reached) whereas the problem returns a component count. Q3 bug text has a stutter: "Ruben ignores the chosen chosen row and uses a different one." Fix: word the field "Which row does the search start from?" and label outputs "rows reached".
- **[MAJOR] Q1 "Maximus allows each two-way link to work only in its written order."** In this problem edges are never written in the input (they are computed from overlaps), so "written order" can only mean the order the student clicked the two endpoints, which is never said. Grader expected `1→0` for a link drawn 1-then-0. Fix: "…only from the node you clicked first to the node you clicked second."
- **[MINOR] Step 1 label format rejected** ("row 0: {1,2}" → "Use numeric IDs 0, 1, 2, ... with no gaps.") — instance of the known systemic issue; nothing on screen says the format changed.

### Step 3
- **[MINOR] Wrong-answer feedback begins with "Correct."** Under the × mark the student reads "Correct. The mini-example lists row 0: {1,2}—row 1: {1,2} as one direct edge." (Q1 variant 0, Q2, Q5). Drop the leading "Correct."
- **[MINOR] Feedback's "Correct node rule" contradicts Step 1 wording.** Step 1 taught "The entire row properties[i], treated as a set for comparison"; Step 3 feedback says "Correct node rule: Input row index i; properties[i] is payload carried by that node." ("payload" is jargon). (all membership claims)
- **[MINOR] Q4 claim has a false premise.** "row 0: {1} can reach row 1: {2}, so the graph should contain a direct edge between them." — row 0 cannot reach row 1 at all (k=1, no shared value). The keyed No is right, but the feedback ("Reachability never creates a direct edge") argues from a premise the student knows is false. (Q4 variant 2)

### Step 4
- **[BLOCKER] Three different hidden label formats across the three cases, none shown.** Case 1 requires `row 0`, `row 1`, `row 2`; case 2 requires `row 0: {1}`, `row 1: {1,2}` (Step 1 format); case 3 requires `0`, `1`, `2`, `3`. A student who uses the Step 1 format fails cases 1 and 3 with only "The drawing has every exact node ×". Fix: make all three canvases use the Step 1 format and show the guide.
- **[MAJOR] Distractor is literally true on these inputs.** Cases 1 and 2 offer "The edge test should use common > k instead of common >= k, changing this input's returned value." Running the code with `>` returns 3 (case 1) and 2 (case 2) — exactly the correct outputs — so a student who tests the idea finds it "fixes" the code. Feedback "At least k means >= k; the count of common values is wrong." does not address that it worked. Fix: use an input where `>` gives a different wrong answer, or drop "changing this input's returned value". (case 1 `authored-deep-case`, case 2 `build-2`)
- **[MAJOR] All three cases are the same bug, same code, same correct diagnosis text** ("Both copies of 1 in row 0 increment common…" in cases 1 and 2; "The two copies of 1 in row 0 both increment common…" in case 3). Case 2's input is Step 1 Q4's input. After case 1 the student pattern-matches.
- **[MINOR] Chain wording is meaningless for a counting problem.** "Reachable boundary: Row 0 repeats 1 twice while row 1 contains one 1." is not a boundary. (case 1)

### Cross-step / other
- Step 1 says nodes are `row i: {…}`, Step 2 wants `0,1,2`, Step 4 wants three formats (above). Four label schemes in one lesson.

---

## Reachable Nodes With Restrictions (`reachable-nodes-with-restrictions`)

### Step 1
- **[MINOR] Q3 picture lists show `3(restricted)` (no space)** while the guide/grader require `3 (restricted)`. A student copying the picture label into the drawing tool is rejected. (Q3 `exact-picture`, all four pictures)
- **[MINOR] Q7 and Q9 are Description Examples 1 and 2 verbatim** (answers 4 and 3 printed in the Description tab).
- **[MINOR] Q4 choice A is garbled:** "Only unrestricted nodes; erase restricted nodes and all context immediately." — "and all context immediately" means nothing. (Q4 `node-rule`)
- Build keys Q1 (3), Q2 (1), Q5 (4), Q8 (1) and all five remedials verified correct.

### Step 2
- **[MAJOR] Q1 bug text is gibberish:** "Corbin runs the search from a different node 0." and field "CHOOSE THE NODE 0 / node 0" (readonly "0"). The template pasted the start-name "node 0" into the sentence. Corbin actually starts at 1, visible only in Drawing 2's title. Fix: "Corbin starts the search at node 1 instead of node 0."
- **[MAJOR] Restrictions cannot be drawn at all.** Label rule is numeric-only; Step 1's `3 (restricted)` is rejected with "Use numeric IDs 0, 1, 2, ... with no gaps." Q3's authored level is "Restricted dead end" yet no node can be marked restricted; a student will try to reproduce the lesson's restricted nodes and be rejected without being told restrictions are simply absent from Step 2.
- **[MINOR] Q3 says "Edge numbers show drawing order."** but the harness saw no drawing-order numbers on the canvas.

### Step 3
- **[MAJOR] Reachability claims start from a restricted node.** Q1 variant 2: "1 (restricted) can reach 3 through 0, but the graph still has no direct 1 (restricted)—3 edge." (keyed YES). Q3: "2 (restricted) can reach 1 through 0, but the graph still has no direct 2 (restricted)—1 edge." (keyed YES). The lesson just drilled "You may NEVER step on a restricted node", so a literal student answers No ("a restricted node can't reach anything"). Debatable key. Fix: only generate reach claims between unrestricted nodes, or say "ignoring the restriction".
- **[MINOR] Edge order flipped vs input.** Q1 v0 writes "3—0" for input `[0,3]`; Q4 writes "0—1 and 1—2 (restricted)" for input `[[1,0],[2,1]]`.

### Step 4
- **[BLOCKER] Case 1 hidden label `1 restricted` (no parentheses).** Cases 2 and 3 require `3 (restricted)` / `1 (restricted)` (the taught format). Case 1 alone requires `0`, `1 restricted`, `2`, `3`. A student who writes `1 (restricted)` as taught fails case 1 with only "The drawing has every exact node ×". Fix: change case 1's canvas label to `1 (restricted)`.
- **[MAJOR] Same bug and identical three diagnosis choices in all three cases;** cases 2 and 3 are Step 1 Q1 and Q2 inputs (correct outputs 3 and 1 already answered there). Only the buggy number is new.
- **[MINOR] Jargon in case 1 chain:** "Allowed node 2 is separated from 0 by a forbidden articulation node."

### Cross-step / other
- Description node rule: "All nodes 0 through n−1, with restricted nodes clearly marked." — but Step 2 forbids marking them and Step 4 case 1 marks them differently.

---

## Detour for Coffee (`routes-past-the-coffee-cart`)

### Step 1
- **[MAJOR] Two vocabularies for the same input.** Description and concept questions use `graph = …, checkpoint = 3`; the four builds and every remedial use `roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=1` — `roads`, `start`, `customer`, `coffeeCart` appear nowhere in the problem statement. Fix: use `graph`/`checkpoint` everywhere.
- **[MAJOR] Q9 contradicts Step 2's rule.** Q9 `roads=[[]], start=0, customer=0, coffeeCart=0` is keyed 1 route, but Step 2's grader rejects graphs with "The coffee cart must be an interior intersection, not node 0 or the last node." A student who learned Q9 (cart may be node 0) is then told the opposite. Also debatable on its own: a zero-street "route" that "passes" a cart you never move to. (Q9 `case-4`)
- **[MINOR] Q7 and Q8 stems give the answer.** Q7: "The picture has three depot-to-customer routes; two pass intersection 3…" → only choice C has exactly two complete routes. Q8: "…the only customer route skips 2. What route list is returned?" → `[]` follows from the sentence. (Q7 `concept-output`, Q8 `concept-counterexample`)
- **[MINOR] Grammar in concept-edge remedial feedback:** "0 complete routes reaches the customer after visiting checkpoint 1."

### Step 2
- **[MAJOR] Hidden acceptance rule never shown.** Only after Check: "The coffee cart must be an interior intersection, not node 0 or the last node." "Last node" is undefined on this screen (the student is never told the customer is the highest-numbered node here). Fix: put this rule in the prompt.
- **[MAJOR] A different reachable set is not enough, and the student isn't told.** The harness's minimal graphs with different correct/buggy sets were rejected: Q2 `{"exposes":false,"correct":"[0,1,2,3]","buggy":"[0,1]"}`, Q3 `{"exposes":false,"correct":"[0,1,2],"buggy":"[0,1]"}`. The unshown authored goals require the buggy search to miss the amber cart. The screen says only "Expose Melanie's mistake." Fix: state "Melanie's search must fail to reach the coffee cart."
- **[MAJOR] "CORRECT OUTPUT" wants a flat reached set `[0,1,2,3]`,** while every Step 1 output was a list of routes like `[[0,1,3,5],[0,2,3,5]]`. Direct conflict for this problem; the student will type routes.
- **[MINOR] Q3 "Alex visits only the start and its direct neighboring choices."** — "neighboring choices" is odd; say "direct neighbors".

### Step 3
- **[MINOR] Markdown backticks leak.** Feedback prints "Every intersection / 0 / through / n−1 / , including the depot…" on separate lines, and the membership claim shows literal backticks: "Only intersection 0, the checkpoint, and intersection `n−1`." (Q1 all variants, Q2, Q5)
- Claims and keys otherwise correct; degree claims correctly say "outgoing".

### Step 4
- **[MAJOR] Shown input and shown code disagree in cases 2 and 3.** Input: `roads=[[1,2],[3],[3],[4],[]], start=0, customer=4, coffeeCart=2`; code reads `input.graph.length` and `input.checkpoint`. Run literally it throws "Cannot read properties of undefined (reading 'length')", not `[]`. Case 1 correctly shows `graph:` / `checkpoint:`. Fix: show `graph`/`checkpoint` in cases 2 and 3. (case 2 `case-1`, case 3 `case-2`)
- **[MAJOR] Same bug ×3 with the same two distractors** ("The checkpoint flag is shared globally…", "The target is computed as the wrong graph index…"); case 2 is Step 1 Q1's graph with the cart moved.
- Buggy outputs `[]`, `[]`, `[]` verified; hidden labels `0`–`4` match the taught format.

### Cross-step / other
- Title "Detour for Coffee" vs id "routes-past-the-coffee-cart" — fine. Cart-at-node-0 rule conflicts between Step 1 Q9 and Step 2 (above).

---

## Runes on the Castle Door (`runes-on-the-castle-door`)

### Step 1
- **[MINOR] Inputs lose their quotes in Q7/Q8:** `dials = [ab,ab,a]` and `dials = [ab,c,c]` vs `dials=["ab","ab"]` everywhere else. A literal student may think these are different data types.
- **[MINOR] Q2 "Why" mentions edge labels that don't exist:** "An exact picture keeps every entity, direct relation, direction, and edge label from the input."
- **[MINOR] concept-nodes remedial question is jargon:** "How many complete prefix-state leaves exist?" (answer 2 for `["ab","c"]`). Say "How many complete codes are there?"
- **[MINOR] concept-output remedial is Description Example 2** (`["xy","x"]` → `["yx"]`, answer printed in the Description).
- All build/remedial keys verified (`["ab","ba"]`, `["ab"]`, `[]`, `["x","y"]`; remedials `["ab","ac"]`, 2, `["ba"]`, `["yx"]`, `["ba"]`).

### Step 2
- **[MAJOR] Root node has three names across the lesson:** `start` (Step 1/3 guide), `ε` (Step 2: "Use ε for the empty root, then lowercase partial strings like a or ab."), `empty` (Step 4 hidden canvas). Fix: one name everywhere.
- **[MAJOR] Required output order puts the root LAST.** Expected `["a","b","ε"]`; the natural root-first `["ε","a","b"]` is rejected (harness: reversed order `["ε","b","a"]` ❌). Nothing explains the ε-last sort. (Q1–Q3)
- **[MAJOR] "Correct output" means the set of prefix nodes including the root** (`["a","ab","ε"]`), whereas Step 1's "output" was the list of complete codes (`["ab"]`). A student will type the code list.
- **[MINOR] Q1 bug text is gibberish:** "Kenneth uses the wrong empty code." Kenneth starts from prefix `a` (only in Drawing 2's title). Fix: "Kenneth starts building from the prefix a instead of the empty code."

### Step 3
- **[MINOR] Q1's three variants repeat the identical claim** "start can reach ba through b, but the graph still has no direct start→ba edge." — after two wrong tries the third check is not a fresh check.
- Claims/keys otherwise correct.

### Step 4
- **[BLOCKER] Hidden root label `empty`.** Case 1 requires `empty`, `a`, `ab`, `aba`; case 2 `empty`, `a`, `ab`, `aba`, `abac`; case 3 `empty`, `a`, `b`, `ac`, `bc`, `aca`, `acb`, `bca`, `bcb`. No guide is shown; Step 1 taught `start`, Step 2 `ε`. A student cannot guess `empty`. Fix: use `start` in the Step 4 canvases.
- **[MINOR] Dial numbering is 1-based in diagnosis text but 0-based in the Description.** "The used set rejects rune a on dial 3" (3-dial input; `dials[3]` doesn't exist), "Dial 3 repeats a non-adjacent rune after b" (0-based dial 3 is `c`), "their final rune appeared on dial 1" (0-based dial 1 is `c`). (cases 1–3)
- **[MAJOR] Same bug ×3;** every correct choice contains "used set", every case has the same "no-backtrack" and "accepts-prefix" distractors. Buggy outputs `[]`, `[]`, `["acb","bca"]` verified.

### Cross-step / other
- Root naming inconsistency (start / ε / empty) is the single biggest trap in this lesson.

---

## Save the Date (`save-the-date-phone-chain`)

### Step 1
- **[BLOCKER] Every graph requires exact edge labels, and no screen says so.** Q1's hidden canvas: `0→1 "+2"`, `0→2 "+2"`, `1→3 "+3"`, `1→4 "+3"`, `2→5 "+1"`; Q2: `2→0 "+5"`, `2→1 "+5"`; Q5: `"+4","+4"`; Q8: `"+2","+2","+1"`; all five remedials likewise. The only guide is "Use each node's 0-based number only. Example: 2." `gradeCanvas` compares the trimmed label string exactly, so `2` ≠ `+2` and an unlabeled arrow fails. The checklist line "Edge labels or weights match the input ×" appears only after a failed Check, and the code's hint `exactEdgeDetails` ("Use these exact edge labels: …") is defined but never called. Q1 is the first screen of the lesson; the picture question that shows "+2" labels is Q3. Fix: add "Label each arrow with the caller's wait, written like +2" to the guide, or drop label grading in Step 1.
- **[MAJOR] Q9 is Q8 again.** Q8 build `n=4, headId=2, caller=[2,0,-1,2], waitDays=[1,0,2,0], deadline=0` (answer 1) is immediately followed by concept Q9 with the identical input and answer 1. Q9 tests nothing new. (Q8 `deadline-zero`, Q9 `concept-bug`)
- **[MINOR] Q1 and Q2 are Description Examples 1 and 2 verbatim** (answers 4 and 1 printed in the Description).
- **[MINOR] concept-nodes remedial asks "How many person nodes are in the tree?" for `n=3`** — the answer is literally `n`; wrong-choice feedback "mistakes headId 1 for an array length boundary" is odd. (remedial after `concept-nodes`)
- Keys verified: Q1 4, Q2 1, Q5 3, Q7 5, Q8 1, Q9 1; remedials 4, 3, 3, 3, 3.

### Step 2
- Step 1 numeric names are accepted (good). Output is the reached-people set `[0,1,2]` rather than a count — instance of the systemic issue; no wait days exist in Step 2, so the lesson's timing idea disappears entirely for three rounds.
- Bug texts are clear ("Reagan stops after one hop", "Eduardo builds every listed connection except the last one", "Jordyn reads every from/to relationship backward").

### Step 3
- **[MAJOR] Edge labels still required, still no guide.** Failed-graph checklist shows "Edge labels or weights match the input ×" (Q1); required labels `+2`, `+3` (Q1), `+1,+2,+3` (Q2), `+1,+1,+4,+2` (Q3), `+2,+2` (Q4), `+3` (Q5).
- **[MINOR] Q1's three variants repeat the same claim** "The correct graph has 0→1 and 1→2, so it should also contain a direct 0→2 edge."
- **[MINOR] Backtick leak:** "Correct node rule: Each of the n people, with / headId / as the root." rendered on separate lines.

### Step 4
- **[BLOCKER] Cases 2 and 3 require edge labels with no guide; case 1 requires none.** Case 1 hidden edges `0→1`, `1→2` (unlabeled; label check is skipped); case 2 requires `+2,+2,+3,+3,+1`; case 3 requires `+5,+5`. The student who passes case 1 without labels then fails case 2 with "The drawing has every exact edge ×" (label mismatch is reported under the labels line only after nodes pass).
- **[MAJOR] Raw token leaks into student text:** "Reachable boundary: listener-wait-time" in the success text of cases 2 and 3 (and in the pre-success chain).
- **[MAJOR] Same bug ×3, identical three choices;** cases 2 and 3 are Step 1 Q1 and Q2 (Description Examples 1 and 2). Buggy outputs 3, 6, 3 verified.

### Cross-step / other
- Step 1/3/4 grade "+N" edge labels that the lesson never teaches how to write; Step 2 has no weights at all.

---

## Shut the Valve (`shut-the-garden-valve`)

### Step 1
- **[MAJOR] The same graph is drawn twice in a row, and it is the Description's example.** Q1 and Q2 both use `ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40]` (shutId 2 then 1); the hidden canvases are identical (`1:5, 2:10, 3:20, 4:40`); the answers 50 and 75 are Examples 1 and 2 in the Description. Q3 and Q5 show the same input a third and fourth time. Fix: give Q2 a fresh tree.
- **[MINOR] Q9's input equals the concept-nodes remedial input** (`ids=[30,10,20], feeds=[0,30,10], liters=[7,1,9], shutId=10`, answer 10 both times), and the correct answer "10" is also the shutId, inviting "it's the ID" confusion.
- Keys verified: Q1 50, Q2 75, Q4 4, Q6 13, Q8 21, Q9 10; remedials 10, 10, 7, 21, 102.

### Step 2
- **[MAJOR] Q3 requires a node named 2 and the student is never told.** "Marley runs the search from a different shut sprinkler." — the authored wrong start is `2` (only in Drawing 2's title) and the authored goal "Shut sprinkler 1, but make the mistaken search begin at sprinkler 2" is hidden. IDs here are free positive integers, so a student who reuses Step 1's `5, 9, 2` or shuts sprinkler 3 has no way to know what Marley does.
- **[MINOR] Step 1 format `1:5` rejected** with "Use positive integer IDs, like 1, 3, or 10." and "CORRECT OUTPUT" is a list of shut sprinkler IDs (`[1]`), not liters — instance of the systemic issues; nothing on screen prepares the student for either.

### Step 3
- **[MINOR] Wrong-answer feedback begins with "Correct."** ("Correct. The mini-example lists 4:100→5:1 as one direct edge." under ×, Q1 v0/v1/v2).
- Claims and keys otherwise correct.

### Step 4
- **[BLOCKER] Case 1 hidden labels are bare IDs `1`, `2`, `3`, `4`,** while cases 2 and 3 require the Step 1 format `1:5, 2:10, 3:20, 4:40` and `10:2, 20:3, 30:5, 40:7`. No guide on any case. A student using the taught format fails case 1; one who then switches to bare IDs fails case 2.
- **[MAJOR] Raw token leaks:** "Reachable boundary: ignore-downstream-subtree" in the success text of cases 2 and 3.
- **[MAJOR] The "trace" is a 5-line lookup, repeated three times.** Code is `return input.liters[input.ids.indexOf(input.shutId)]` — no graph is built or traversed, so drawing the graph has nothing to do with predicting the output. Case 2 is Step 1 Q2; case 3 is the concept-picture remedial. Buggy outputs 10, 5, 3 verified.
- **[MINOR] Padded distractors:** "…which changes how the shown graph is evaluated." appended to both wrong choices in case 1.

### Cross-step / other
- Labels: `1:5` (Step 1/3), `1` (Step 2), `1` then `1:5` (Step 4).

---

## Largest Component (`structy-largest-component`)

### Step 1
- **[MAJOR] No build ever has more than one component, and the wrong choice is always "count − 1".** Q1 `{"0":[1,2],"1":[0,3],"2":[0,4],"3":[1],"4":[2]}` → 5 vs 4; Q4 → 4 vs 3; Q6 → 5 vs 4; Q9 `{"0":[]}` → 1 vs 0; all five remedials → 5/4, 4/3, 5/4, 4/3, 5/4. "Largest component" is never exercised in a build, and "pick the bigger number" is always right. Fix: include a two-component input (e.g. the Description's Example 1) as a build.
- **[MINOR] Guide vs data mismatch.** Guide: "Use the exact object key from graph only. Example: 2." with a digits-only pattern, while the Description and Step 4 use keys `a`–`h`; Step 1 inputs mix quoted keys with unquoted neighbors (`"0":[1,2]`).
- **[MINOR] Q7 and Q8 are Description Examples 1 and 2 verbatim** (answers 3 and 2 printed there).

### Step 2
- **[MAJOR] Q1 "Chelsea keeps the middle of the graph but disconnects every leaf."** "Leaf" is never defined for a general graph in this lesson. On the harness's path A—B—C both ends are leaves, so Chelsea's graph must have zero edges and, because the seed A is itself a leaf, her output is `["A"]`. A student cannot predict that from the sentence. Fix: "Chelsea deletes every edge that touches a node with only one connection."
- **[MINOR] "CHOOSE THE COMPONENT SEED / component seed"** — the problem has no seed or start; the term is unexplained. Output is a node list (`["A","B","C"]`) though the problem returns a size.

### Step 3
- Claims and keys correct; only the systemic same-answer pattern applies (Q1, Q2, Q4, Q5 all-Yes, Q3 all-No).

### Step 4
- **[MINOR] Distractors are absurd, so the answer is obvious.** Case 2: "The isolated node e is accidentally counted as four nodes because its list is empty." / "String keys make b and d compare equal in the seen set." Case 3: "The isolated node h should be excluded from Object.keys and from all counts." (a "should", not a bug). Case 1 feedback refers to `seen` but the code's set is `visited`, and calls the function "The helper".
- **[MAJOR] Same bug ×3** ("components … returned instead of the maximum…"). Buggy outputs 2, 2, 3 verified; hidden labels `a`–`h` match the shown keys (though Step 1's guide said digits only).

### Cross-step / other
- Step 1 never shows a multi-component build; Step 4 is the first time the student must handle one while also predicting a buggy value.

---

## One-line summary of every finding in this batch

- [MAJOR] properties-graph S1: node labels must be de-duplicated sets (`row 0: {1}` for `[1,1]`) but the guide never says so (Q4, bug-trap remedial, S3 Q5)
- [MINOR] properties-graph S1: Q7/Q8 are Description Examples 1/2 with answers printed in the Description
- [MAJOR] properties-graph S2: invented "chosen row" start for a problem with no start; "Ruben ignores the chosen chosen row" typo
- [MAJOR] properties-graph S2: Q1 "only in its written order" — edges aren't written in this problem's input; means click order
- [MINOR] properties-graph S2: Step 1 label format rejected with no on-screen warning
- [MINOR] properties-graph S3: wrong-answer feedback starts with "Correct."
- [MINOR] properties-graph S3: "Correct node rule … payload carried by that node" contradicts Step 1 wording
- [MINOR] properties-graph S3: Q4 reach claim has a false premise (row 0 cannot reach row 1)
- [BLOCKER] properties-graph S4: hidden labels differ per case — `row 0` / `row 0: {1}` / `0` — no guide
- [MAJOR] properties-graph S4: distractor "use common > k … changing this input's returned value" is literally true and yields the correct answers (cases 1–2)
- [MAJOR] properties-graph S4: same bug/code/diagnosis in all 3 cases; case 2 = Step 1 Q4 input
- [MINOR] properties-graph S4: "Reachable boundary" chain text meaningless for a count problem
- [MINOR] reachable-nodes-with-restrictions S1: Q3 pictures show `3(restricted)` without the required space
- [MINOR] reachable-nodes-with-restrictions S1: Q7/Q9 are Description Examples 1/2 verbatim
- [MINOR] reachable-nodes-with-restrictions S1: Q4 choice "erase restricted nodes and all context immediately" is garbled
- [MAJOR] reachable-nodes-with-restrictions S2: "Corbin runs the search from a different node 0" / "CHOOSE THE NODE 0" gibberish; real start 1 hidden
- [MAJOR] reachable-nodes-with-restrictions S2: restrictions cannot be drawn (numeric-only labels) though the round is "Restricted dead end"
- [MINOR] reachable-nodes-with-restrictions S2: Q3 promises edge drawing-order numbers that weren't visible
- [MAJOR] reachable-nodes-with-restrictions S3: keyed-YES claims that a restricted node "can reach" another (Q1 v2, Q3) contradict the taught rule
- [MINOR] reachable-nodes-with-restrictions S3: claim edge order flipped vs input (Q1 v0, Q4)
- [BLOCKER] reachable-nodes-with-restrictions S4: case 1 hidden label `1 restricted` (no parentheses) vs taught `1 (restricted)` used in cases 2–3
- [MAJOR] reachable-nodes-with-restrictions S4: same bug and identical choices ×3; cases 2–3 reuse Step 1 Q1/Q2 inputs
- [MINOR] reachable-nodes-with-restrictions S4: "forbidden articulation node" jargon
- [MAJOR] routes-past-the-coffee-cart S1: builds use `roads/start/customer/coffeeCart`, Description and concepts use `graph/checkpoint`
- [MAJOR] routes-past-the-coffee-cart S1: Q9 keys cart-at-node-0 as a valid route while Step 2 rejects "cart … not node 0 or the last node"
- [MINOR] routes-past-the-coffee-cart S1: Q7/Q8 stems state the answer ("two pass intersection 3", "the only customer route skips 2")
- [MINOR] routes-past-the-coffee-cart S1: "0 complete routes reaches the customer" grammar in remedial feedback
- [MAJOR] routes-past-the-coffee-cart S2: hidden rule "cart must be an interior intersection, not node 0 or the last node" only appears as an error
- [MAJOR] routes-past-the-coffee-cart S2: differing reachable sets are rejected unless the buggy search misses the cart — never stated (Q2, Q3 exposes:false)
- [MAJOR] routes-past-the-coffee-cart S2: "CORRECT OUTPUT" wants a flat node set while Step 1 outputs were route lists
- [MINOR] routes-past-the-coffee-cart S2: "direct neighboring choices" wording
- [MINOR] routes-past-the-coffee-cart S3: backticks/markdown leak into feedback and claim text
- [MAJOR] routes-past-the-coffee-cart S4: cases 2–3 show `roads/coffeeCart` input but code reads `input.graph/input.checkpoint` (throws when run literally)
- [MAJOR] routes-past-the-coffee-cart S4: same bug and same two distractors ×3; case 2 reuses Step 1 Q1's graph
- [MINOR] runes-on-the-castle-door S1: Q7/Q8 inputs drop the quotes (`[ab,ab,a]`)
- [MINOR] runes-on-the-castle-door S1: Q2 "Why" mentions edge labels that don't exist
- [MINOR] runes-on-the-castle-door S1: remedial question "How many complete prefix-state leaves exist?" is jargon
- [MINOR] runes-on-the-castle-door S1: concept-output remedial is Description Example 2
- [MAJOR] runes-on-the-castle-door S2: root named `start` (S1/S3), `ε` (S2), `empty` (S4)
- [MAJOR] runes-on-the-castle-door S2: required output order puts ε last (`["a","b","ε"]`); root-first is rejected
- [MAJOR] runes-on-the-castle-door S2: "output" is the prefix-node set incl. root, not the code list taught in Step 1
- [MINOR] runes-on-the-castle-door S2: "Kenneth uses the wrong empty code" gibberish; real start `a` hidden
- [MINOR] runes-on-the-castle-door S3: Q1 variants repeat the identical reach claim three times
- [BLOCKER] runes-on-the-castle-door S4: hidden root label `empty` in all 3 cases, never shown (taught `start`)
- [MINOR] runes-on-the-castle-door S4: diagnosis text numbers dials 1-based ("dial 3", "dial 1") vs 0-based `dials[i]`
- [MAJOR] runes-on-the-castle-door S4: same bug ×3, "used set" in every correct choice
- [BLOCKER] save-the-date-phone-chain S1: every build requires exact edge labels `+2`, `+3`, `+1`, `+5`, `+4` with no instruction anywhere (guide only covers node names; hint code never called)
- [MAJOR] save-the-date-phone-chain S1: Q9 is the identical input and answer as Q8
- [MINOR] save-the-date-phone-chain S1: Q1/Q2 are Description Examples 1/2 verbatim
- [MINOR] save-the-date-phone-chain S1: remedial "How many person nodes are in the tree?" answer is just n
- [MINOR] save-the-date-phone-chain S2: reached-set output, no wait days at all in Step 2
- [MAJOR] save-the-date-phone-chain S3: edge labels graded ("Edge labels or weights match the input ×") with no guide
- [MINOR] save-the-date-phone-chain S3: Q1 variants repeat the same claim; backtick leak "with / headId / as the root"
- [BLOCKER] save-the-date-phone-chain S4: case 1 needs no labels but cases 2–3 require `+2,+2,+3,+3,+1` / `+5,+5` with no guide
- [MAJOR] save-the-date-phone-chain S4: raw token "Reachable boundary: listener-wait-time" shown in cases 2–3
- [MAJOR] save-the-date-phone-chain S4: same bug and identical choices ×3; cases 2–3 are Step 1 Q1/Q2
- [MAJOR] shut-the-garden-valve S1: Q1 and Q2 require the identical drawing (Description example) back-to-back; same input shown 4 times
- [MINOR] shut-the-garden-valve S1: Q9 input repeats the concept-nodes remedial; answer 10 equals shutId 10
- [MAJOR] shut-the-garden-valve S2: Q3 Marley starts at hidden node `2`; free positive-integer IDs mean the student may not even have a node 2
- [MINOR] shut-the-garden-valve S2: `1:5` format rejected; output is a list of IDs not liters
- [MINOR] shut-the-garden-valve S3: wrong-answer feedback starts with "Correct."
- [BLOCKER] shut-the-garden-valve S4: case 1 hidden labels bare `1,2,3,4` but cases 2–3 require `1:5…` / `10:2…`; no guide
- [MAJOR] shut-the-garden-valve S4: raw token "Reachable boundary: ignore-downstream-subtree" shown in cases 2–3
- [MAJOR] shut-the-garden-valve S4: 5-line non-traversing code repeated ×3; cases 2–3 reuse Step 1 inputs
- [MINOR] shut-the-garden-valve S4: distractors padded with "which changes how the shown graph is evaluated"
- [MAJOR] structy-largest-component S1: no build has more than one component; wrong choice is always count−1 so "bigger number" always wins
- [MINOR] structy-largest-component S1: guide "Example: 2" digits-only vs letter keys in Description/Step 4; mixed quoted/unquoted keys
- [MINOR] structy-largest-component S1: Q7/Q8 are Description Examples 1/2 verbatim
- [MAJOR] structy-largest-component S2: "disconnects every leaf" undefined; on a path the seed itself is a leaf so output collapses to `["A"]`
- [MINOR] structy-largest-component S2: "component seed" jargon; output is a node list though the problem returns a size
- [MINOR] structy-largest-component S4: absurd distractors ("e counted as four nodes", "b and d compare equal"); feedback names `seen`/"helper" that aren't in the code
- [MAJOR] structy-largest-component S4: same bug ×3
