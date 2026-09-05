# Batch rbatch-ag findings

Problems: `usaco-fence-planning`, `usaco-milk-factory`, `villages-without-wells`, `wheres-my-internet`.
All Step 4 buggy outputs were re-run with node and match the declared values. All Step 1 build/remedial answer keys were recomputed by hand and are correct unless noted below. Known systemic issues (Step 3 all-same-answer parity, Step 2 output JSON strictness, Step 2 no node guide, Examples tab hidden, etc.) are only mentioned where there is a concrete problem-specific instance.

Two generator-level issues that are NOT in SYSTEMIC-NOTES.md show up in all four problems; they are listed under each problem with the exact text:
- Step 3 membership claims flip polarity between questions: "It would be a mistake to use this node rule: “…”" (YES is correct) vs "Use this node rule for the graph: “…”" (NO is correct). Same wrong rule, opposite answer, and the second form reads as an instruction.
- Step 3 "feedback if wrong" for direct-vs-reach claims begins with "Correct." / "Right." and is shown next to a × mark after the student answers wrongly.

---

## Fence Planning (`usaco-fence-planning`)

### Step 1
- **[MAJOR] "Pick the smaller number" is right in every build and remedial.** Choices shown: Q1 `2 | 6` → 2; Q3 `12 | 10` → 10; Q6 `2 | 4` → 2; Q8 `4 | 2` → 2; remedials `14 | 16` → 14, `6 | 4` → 4, `10 | 12` → 10, `22 | 20` → 20, `12 | 14` → 12. Concept Q7 too (`10 / 16 / 8 / 6` → 6 is the smallest). Only Q9 breaks the pattern. A struggling student learns "click the smaller one" and never computes a perimeter. Fix: add distractors that are smaller than the answer (forgot the ×2 → half perimeter; zero-height → 0; other herd's perimeter when it is larger). (case-1, case-2, case-3, case-4, all remedials)
- **[MAJOR] Q8 tests nothing new.** Facet is "minimum herd perimeter" but the input `cows=[[5,7],[5,8]], friendships=[[0,1]]` has one herd, so there is no minimum to take. It is the same shape as Q6 (`cows=[[0,0],[1,0]]`): two cows, one edge, answer 2, distractor 4 with the same "padding" misconception. Fix: give Q8 two herds with different perimeters. (case-4)
- **[MINOR] Input variable names differ from the problem statement.** Description and signature use `positions` / `pairs`; every Step 1 and Step 3 raw input says `cows=` / `friendships=`; Q7/Q9 show a bare call `minFencePerimeter([...],[...])`. A literal student looking for "friendships" in the statement will not find it. Fix: use `positions=` / `pairs=` everywhere. (all builds)
- **[MINOR] Q4 raw-input box contains the question** "What belongs at each plotted node?" above a drawing tool titled "Optional: draw this input before answering" (systemic instance); "plotted node" is jargon. (node-rule)

### Step 2
- **[MAJOR] "Correct output" wants a list of cow IDs, but this lesson has only ever asked for a perimeter.** The student has answered "What minimum fence perimeter is returned?" nine times; now the field "CORRECT OUTPUT" with no hint expects `[0,1]`. Worse, Step 2 nodes are bare numbers with no coordinates, so a perimeter cannot even be computed here. Typing `2` or `10` is rejected with no explanation. Fix: label the box "Cows the search reaches, e.g. [0,1]". (Q1–Q3)
- **[MAJOR] "CHOOSE THE CHOSEN COW / chosen cow" describes something the real problem does not have.** `minFencePerimeter` loops over every cow; there is no start cow, so Christina's bug "uses the wrong chosen cow" cannot change the fence in the real problem, and the label is circular. The authored goal "Make two herds so starting at the wrong cow changes the fence" is hidden and no fence is computed. Fix: rename to "start cow" and explain in one line that Step 2 only compares which cows a search visits. (Q2)
- **[MAJOR] Node names flip-flop: Step 1 drilled `0:(0,0)`, Step 2 rejects it, Step 4 secretly requires it again.** Submitting `0:(0,0)` … `4:(9,8)` in Step 2 gives "Use numeric IDs 0, 1, 2, ... with no gaps." Then Step 4 (no guide shown) requires exactly `"0:(0,0)","1:(3,2)"` (case 1), `"0:(0,0)","1:(2,0)","2:(2,1)","3:(8,8)","4:(9,8)"` (case 2), `"0:(1,1)","1:(4,1)","2:(4,3)"` (case 3). A student who just learned to type `0`, `1` in Step 2 fails Step 4's "The drawing has every exact node ×" with no hint. Fix: show the node-name guide in Steps 2 and 4, or accept bare IDs in Step 4. (Q1 / S4 all cases)
- **[MINOR] Landen (make-one-way) depends on click order.** Harness drew the edge 1→0 (clicked 1 first) with start 0 so Landen reaches `[0]`. A student who clicks 0 first gets arrow 0→1, Landen reaches `[0,1]`, nothing is exposed, and no message says why. (systemic instance) (Q1)

### Step 3
- **[MAJOR] Membership claim polarity flips.** Q1/Q4: "It would be a mistake to use this node rule: “One mooing pair.”" → YES. Q2/Q3/Q5: "Use this node rule for the graph: “One whole herd.”" → NO. A student who learns "the node-rule line is No" in Q2 gets Q4 wrong. Fix: use one phrasing throughout, as a statement ("Each node should be one whole herd." → No).
- **[MAJOR] Wrong-answer feedback starts with "Correct."/"Right."** Q1 (all three variants), after answering No to "0:(2,5) and 1:(7,5) are directly connected…", the × line reads "Correct. The mini-example lists 0:(2,5)—1:(7,5) as one direct edge." Q4 direct-vs-reach: "Right. A multi-step route through 0:(0,0) creates reachability, not a new direct edge." Fix: strip the leading verdict word in wrong-answer feedback.
- **[MINOR] Q1 (2 nodes, 1 edge) is trivial and repeats itself.** All three variants use the identical claim "0:(2,5) and 1:(7,5) are directly connected, not merely reachable through a longer route." and a degree-1 claim; there is nothing to reason about.
- **[MINOR] Q3 writes edges backwards vs the input.** Claim: "The correct graph has 2:(4,0)—1:(2,2) and 1:(2,2)—3:(2,1)…" while the input lists `[1,2],[1,3]`. (systemic instance)
- Step 3 raw inputs are the five Step 1 remedial inputs; labels match the shown guide — fine.

### Step 4
- **[MAJOR] All three cases are the same case.** Same bug ("Fence side lengths are not doubled"), same code, same three diagnosis sentences (only the letters move: correct is B, C, then A). After case 1 the student knows the answer; cases 2–3 reuse Step 1 Q1/Q3 inputs whose correct perimeters (2 and 10) were already shown. CLAUDE.md asks for one deep problem-specific case; the other two test nothing. Fix: give cases 2–3 different bugs (e.g. padding, max instead of min) or drop them. (case-1, case-2)
- **[MAJOR] Cases 2–3 label the input `cows=` / `friendships=` but the code's parameters are `positions, pairs`.** Case 1 correctly shows `positions:` / `pairs:`. A literal student cannot see how `friendships` becomes `pairs`. (case-1, case-2)
- **[MINOR] Diagnosis choices mix three framings.** A is a proposed fix ("The code should choose the largest herd box rather than the smallest."), B describes the bug, C states a false requirement. A is not a description of anything the code does, so it reads as nonsense rather than a believable mistake. (all cases)
- **[MINOR] "The helper returns 5"** (case 1 proof chain) — there is no helper; the function itself returns 5.
- **[MINOR] Wrong-diagnosis checklist line "✓ The incorrect solution's exact output is correct"** — double negative; reads as if the output were wrong. (likely systemic)

### Cross-step / other
- Node-label format is taught (Step 1/3) → rejected (Step 2) → silently required (Step 4); see Step 2 above.
- Wording "cows/friendships" (Steps 1, 3, 4 cases 2–3) vs "positions/pairs" (Description, code, Step 4 case 1) is inconsistent across the whole lesson.

---

## Milk Factory (`usaco-milk-factory`)

### Step 1
- **[MAJOR] Q2 Picture D feedback is wrong.** Picture D is DIRECTED with edges 2→1, 3→2 (the belt [1,2] reversed), but the displayed feedback says "This changes whether direct relations are arrows or two-way links." It does not — every relation is still an arrow; one arrow is reversed. The student is told the wrong reason. Fix: "This reverses belt [1,2] into 2→1." (exact-picture)
- **[MAJOR] Q7 and Q8 re-ask Q1 and Q4.** Q7 input `n = 3, belts = [[1,2],[3,2]]` is Q1's input (and Example 1); Q1's success text already said "Stations 1 and 3 both send crates to station 2." Q8 input `[[2,1],[2,3]]` is Q4's input (Example 2). The question text even draws the arrows for the student ("For belts 1→2 and 3→2, which pickup station works?"). Two of five concept checks are pure recall. Fix: use fresh inputs (e.g. the remedial ones). (predict-output, bug-trap)
- **[MINOR] Q2 says "Which picture exactly matches this fresh input?"** but it is Q1's input, not fresh. (exact-picture)
- Build answer keys Q1=2, Q4=-1, Q6=3, Q9=1 and all five remedials verified correct; answers are not predictable by position or size — fine.

### Step 2
- **[BLOCKER] Step 2 rejects the problem's own valid inputs with an unexplained "tree" rule.** `usaco-milk-factory` is in `counterexampleRequiresTree()`, and for directed drawings the validator demands "A directed tree needs exactly one root with no incoming edge." and "Each child in this tree can have only one parent." The Description says only "Ignoring direction, the belts connect all the stations", which allows several sources. So the Example 1 shape 1→2, 3→2 — the input of Step 1 Q1 and Step 4 case 1, and the obvious counterexample for Ezekiel's "turns every arrow into a two-way connection" — is REJECTED (harness probe with nodes 1,2,3 confirmed the message). Nothing on screen states this rule. In the only shapes allowed (all arrows pointing away from one root) the real pickup answer is always -1, so the student cannot draw the situation the lesson is about. Fix: for this problem keep only the "n−1 edges + connected ignoring direction" checks and drop the one-root / one-parent checks, or print the rule above the drawing. (Q1–Q3)
- **[MAJOR] "Correct output" runs the search in the opposite direction from the problem.** The grader's set is what the test station can reach by following arrows (authored resultLabel "stations reachable by following arrows", never displayed). The problem and Step 4 are about which stations can reach the pickup station. Concrete: harness graph 2→1, test station 1: grader wants `[1]`; the stations that can send to 1 are `[1,2]` — which is exactly Ezekiel's expected buggy output. A student applying the problem's meaning types the buggy answer into the CORRECT box and is marked wrong with no hint. Fix: label the box "Stations reached by following arrows from the test station". (Q1–Q3)
- **[MAJOR] "test station" is never defined.** The Description talks about a "pickup station"; the field says "CHOOSE THE TEST STATION / test station" with no sentence saying the search starts there and follows arrows outward. (Q1–Q3)
- **[MINOR] Griffin's wrong start "2"** is only visible in Drawing 2's title; the bug text is just "Griffin uses the wrong test station." (systemic instance) (Q3)

### Step 3
- **[MAJOR] Membership polarity flips.** Q1/Q4: "Use this node rule for the graph: “Each conveyor belt.”" → NO; Q2/Q3/Q5: "It would be a mistake to use this node rule: “Only stations with no outgoing belt.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."/"Right."** Q3: "Correct. The mini-example lists 1→2 as one direct edge."; Q5: "Correct. The mini-example lists 2→4 as one direct edge."; Q2: "Right. A multi-step route through 2 creates reachability, not a new direct edge."
- **[MINOR] "1 and 2 are directly connected" on a directed graph** (Q3, Q5) hides direction; a student who drew 2→1 by mistake would still say Yes. Say "there is a direct 1→2 arrow".
- Degree claims correctly say "outgoing direct edges" — fine. Inputs reuse the five remedial builds — fine.

### Step 4
- **[MAJOR] The correct diagnosis names a line that is not in the code, and the line it names is the correct one.** Choice: "Adding next[b].push(a) lets station 1 travel backward through 2 to station 3." The code has no `next`; it builds `reverse`. With belt `[a,b]` = `[firstValue, secondValue]`, the legitimate reverse edge is `reverse[secondValue].push(firstValue)` = `reverse[b].push(a)`, and the BUGGY extra line is `reverse[firstValue].push(secondValue)` = `reverse[a].push(b)`. A student who checks the code sees this choice blaming the correct line. Fix: "Adding reverse[a].push(b) (the second push) lets …". (all 3 cases)
- **[MAJOR] All three cases are the same case.** Same bug ("Conveyor arrows are made two-way"), same code, identical diagnosis sentences (case 3 still says "station 1 travel backward through 2 to station 3" although the input has stations 1–4 and the bug path is 1→2→3 anyway), buggy output `1` every time. Cases 2–3 reuse Step 1 Q4/Q6 inputs whose answers (-1, 3) were shown. (build-2, build-3)
- **[MINOR] Input formatting differs between cases:** case 1 `n: 3 / belts: [[1, 2], [3, 2]]`, cases 2–3 `n=3, belts=[[2,1],[2,3]]`.
- **[MINOR] "The helper accepts smallest candidate 1"** (case 1 proof chain) — no helper exists.
- **[MINOR] "reverse graph" is used in choices A and the feedback** ("Starting there is correct: reverse edges reveal every station that can reach the candidate") without ever being explained; nothing earlier in the lesson introduced reversed edges.

### Cross-step / other
- Step 2 searches forward from the "test station"; Step 4's code searches the reverse graph from the "candidate"; the Description asks who can reach the pickup station. Three different framings of direction with no bridge sentence.
- Step 2's tree-only rule contradicts Step 1 Q1, Step 4 case 1 and the Description's Example 1 (see Step 2 BLOCKER).

---

## Dig New Wells (`villages-without-wells`)

### Step 1
- **[MAJOR] Builds are answerable by "pick the smaller number" and mostly have answer 0.** Q1 `3 | 0` → 0; Q2 `0 | 3` → 0; Q5 `4 | 2` → 2; Q8 `0 | 1` → 0; remedials `4 | 0` → 0, `1 | 3` → 1, `1 | 3` → 1, `4 | 0` → 0; only the edge-rule remedial (`0 | 3` → 3) breaks it. The distractor is always "count villages without wells" (a bigger number). Fix: add smaller-than-answer distractors (e.g. "0 because wells is non-empty", "forgot the isolated village"). (case-1 … case-4, remedials)
- **[MAJOR] Q1 and Q2 are the same test.** Both inputs (`n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]` and `n=4, roads=[[0,1],[1,2],[2,3]], wells=[3]`) have every cluster already supplied, answer 0, same distractor type. Q2's facet is "village identity" but there is no isolated village to identify. Q8 (`n=1, roads=[], wells=[0]`) is a third 0. Fix: make Q2 include an isolated village (e.g. n=5 with the same roads → 1). (case-2)
- **[MINOR] Vocabulary drifts.** Description: `paths`, "cluster"; builds: `roads=`; concept questions: `paths =`; success text: "Exactly 0 road components have no existing well." ("road components" is never defined). Title "Dig New Wells" vs Step 4 function `solve(input)` vs promised `countWellsToDig(n, paths, wells)`.
- **[MINOR] Q7 and Q9 do the graph work for the student.** "The map has clusters {0,1}, {2,3,4}, and {5,6}. Wells are at 4 and 6." / "Villages {0,1,2} form one cycle and {3,4} form another cluster." — the questions hand over the components, so only counting is tested.
- **[MINOR] Q6 raw-input box contains an instruction line** "Focus on one listed relation." after the input, inside the code box, so it looks like data. (concept-edge)

### Step 2
- **[MAJOR] Jaden's bug text does not describe what the grader wants drawn.** Shown: "Jaden erases the outer leaves before searching." The simulation (`skip-leaf-edges`) deletes every EDGE that touches a degree-1 node but KEEPS the nodes: for the harness graph 0—1—2 (start 0) "Jaden's graph must be exactly: nodes 0, 1, 2 · edges: none". A student who literally erases the leaf villages 0 and 2 fails Drawing 2 with no explanation; and the "erased" leaf 0 is still the start and outputs `[0]`. The phrasing is fixed for this problem (`problemIndex % 3`). Fix: use the accurate variant "drops every connection touching a degree-one node". (Q1)
- **[MINOR] "Correct output" is a village list after nine "How many new wells" questions.** Here the reached set (villages served by the chosen well) is at least meaningful, but the box gives no hint that a list, not a count, is wanted. (Q1–Q3)
- **[MINOR] "CHOOSE THE VILLAGE WITH A WELL"** — the problem has a `wells` list, but only one well can be chosen here; Autumn's wrong well "1" appears only in Drawing 2's title. (Q2)
- **[MINOR] Carson: "chooses the final listed route and never returns."** "listed" means drawing order; the goal text adds "Edge numbers show drawing order." but the harness recorded the order numbers as not visible on that screen. Verify they appear as soon as an edge is drawn. (Q3)

### Step 3
- **[MAJOR] Q2 claim has a false premise.** Input `n=3, roads=[], wells=[]` (no edges); claim: "0 can reach 1, so the graph should contain a direct edge between them." 0 cannot reach 1 at all. Keyed NO with feedback "Reachability never creates a direct edge. This input lists no direct relation between 0 and 1." — the student is right to say No but for a reason the feedback does not acknowledge, and a literal reader is left wondering whether the site thinks 0 can reach 1. Fix: on edgeless inputs generate "0 and 1 are directly connected" (No) instead. (Q2)
- **[MAJOR] Membership polarity flips.** Q1/Q2/Q4/Q5: "Use this node rule for the graph: “…”" → NO; Q3: "It would be a mistake to use this node rule: “Only villages not already listed in `wells`.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."** Q3 direct-vs-reach: "Correct. The mini-example lists 2—3 as one direct edge."
- **[MINOR] Q4 and Q5 use the identical claim** "The correct graph has 1—0 and 0—2, so it should also contain a direct 1—2 edge." (and both write 1—0 although the input lists [0,1]).
- **[MINOR] Backtick code spans in feedback captured as separate lines:** "Every village / 0 / through / n−1 / , even a village with no footpaths." Verify `<code>` renders inline inside the feedback list; if it wraps, the sentence is unreadable. (Q1)

### Step 4
- **[MAJOR] Cases 2–3 show `roads=` but the code reads `input.paths`.** Input: "n=5, roads=[[0,1],[1,2],[3,4]], wells=[1,3]"; code: `for (const [firstValue, secondValue] of input.paths)`. Case 1 correctly shows `paths:`. Also the function is `solve(input)` although the Description promised `countWellsToDig(n, paths, wells)`. A literal student cannot connect the input to the code. (case-1, case-2)
- **[MAJOR] All three cases are the same case.** Same bug ("Checks a well only at the component start"), same code, buggy `1` / correct `0` every time, identical distractors; cases 2–3 reuse Step 1 Q1/Q2 inputs whose answer (0) was shown. (case-1, case-2)
- **[MINOR] Distractor "The loop skips villages that have no path entry…"** cannot apply to any of the three inputs (no isolated village anywhere), so it is never a believable mistake here; and distractor "The graph stores each footpath in only one direction" is refuted by two adjacent `push` lines the student can see.
- **[MINOR] Input formatting differs:** case 1 `n: 3 / paths: … / wells: [2]` vs cases 2–3 `n=5, roads=…`.

### Cross-step / other
- `paths` vs `roads` vs `input.paths` naming runs through Steps 1, 3 and 4 (see above).

---

## Where's My Internet?? (`wheres-my-internet`)

### Step 1
- **[MAJOR] Q7 and Q8 are the Description's examples, and Q7 is also Q1.** Q7 input `n = 6, cables = [[1,2],[2,3],[3,4],[5,6]]` = Q1 input = Example 1; Q1's success text already said "Only houses in house 1's component are online." and the Description says the output is `[5, 6]`. Q8 is Example 2 verbatim ("For n=2 and cable [2,1]…") with its answer `[]` printed in the Description tab. Fix: use fresh inputs. (predict-output, bug-trap)
- **[MINOR] Q7 wording "For cables 1-2-3-4 and a separate cable 5-6"** uses a chain notation that a literal student can read as one cable named "1-2-3-4". Say "cables 1—2, 2—3, 3—4".
- **[MINOR] Q2 says "this fresh input"** but it is Q1's input.
- Build keys Q1=[5,6], Q4=[], Q6=[3,4], Q9=[] and all remedials verified; no positional or size pattern — fine.

### Step 2
- **[MAJOR] "Correct output" is the opposite set from the problem's output.** `findOfflineHouses` returns OFFLINE houses; the grader wants the houses reachable from house 1 (the ONLINE set). Concrete: harness graph 1—2, 1—3, 3—4: the real answer is `[]`, the grader wants `[1,2,3,4]`; Joaquin's box wants `[1,3,4]` (houses he reaches), not his offline list `[2]`. No hint on screen. Fix: label the boxes "Houses the search reaches from house 1". (Q1–Q3)
- **[MAJOR] Heaven (make-one-way) can only be exposed by drawing cables toward house 1, and nothing says so.** The start is locked at 1, and the mistaken arrow follows click order. Any cable the student draws starting from house 1 becomes 1→x, which Heaven still follows, so both outputs match and "Counterexample confirmed" never appears. The harness had to draw 2→1 (click 2 first). The authored goal "List a cable toward house 1 so direction must not matter" is hidden. Fix: show the goal line, or show the arrow direction rule ("Heaven's arrow points from the first house you clicked to the second"). (Q2)
- **[MINOR] "CHOOSE THE HOUSE 1 / house 1"** — the field is readonly and prefilled "1", so "Choose" is misleading; say "Start: house 1 (fixed)". (Q1–Q3)
- **[MINOR] "Joaquin keeps only the last branch it sees."** — "it" for a named person. (Q1)
- **[MINOR] Edge-order numbers.** Both Joaquin (Q1) and Aubree (Q3) say "Edge numbers show drawing order." but the harness recorded the numbers visible for Q1 and not for Q3. Verify they appear for drop-last-edge rounds. (Q3)

### Step 3
- **[MAJOR] Q5 claim has a false premise.** Input `n=4, cables=[]`; claim "1 can reach 2, so the graph should contain a direct edge between them." 1 cannot reach 2. Keyed NO; feedback "Reachability never creates a direct edge. This input lists no direct relation between 1 and 2." Same confusion as villages Q2. (Q5)
- **[MAJOR] Membership polarity flips.** Q1/Q2/Q4/Q5 "Use this node rule for the graph: “…”" → NO; Q3 "It would be a mistake to use this node rule: “One node for the online group and one for every offline group.”" → YES.
- **[MAJOR] Wrong-answer feedback begins "Correct."** Q3: "Correct. The mini-example lists 1—2 as one direct edge."
- **[MINOR] Q1 variant 1 writes edges backwards:** "The correct graph has 3—2 and 2—1…" for input `[[1,2],[2,3]]`. (systemic instance)

### Step 4
- **[MAJOR] All three cases are the same case.** Same bug ("Only houses directly cabled to house 1 go online"), same code, the identical correct sentence "The loop marks neighbor 2 but never follows edge 2—3, leaving an actually connected house offline." in all three (case 3's input lists the cable as `[3,2]`), identical distractors; cases 2–3 reuse Step 1 Q1/Q4 inputs whose answers were shown. (build-1, build-2)
- **[MINOR] Distractor "Each cable pair works only in its written direction, blocking reverse travel during the reachability search."** — the code has no search at all, and "reachability search" is jargon the lesson never used; a literal student rejects it for the wrong reason. Distractor "A house with no listed cable entry should be omitted from the offline result." is a false requirement, not a diagnosis, and only relevant in case 1 (house 4).
- **[MINOR] "The helper reports [3,4]"** (case 1) — no helper.
- **[MINOR] Input formatting differs:** case 1 `n: 4 / cables: [[1, 2], [2, 3]]` vs cases 2–3 `n=6, cables=[…]`.
- Required labels `"1"…"6"` match the format taught in Step 1 — fine.

### Cross-step / other
- Step 2's "output" (online set) vs the problem's output (offline list) is the biggest source of confusion in this lesson; see Step 2.

---

## One-line summary of every finding in this batch
- [MAJOR] usaco-fence-planning S1: correct answer is always the smaller number in all 9 builds/remedials (and concept Q7)
- [MAJOR] usaco-fence-planning S1: Q8 has one herd (no minimum to take) and duplicates Q6
- [MINOR] usaco-fence-planning S1: raw inputs say cows=/friendships= while statement/code say positions/pairs
- [MINOR] usaco-fence-planning S1: Q4 question text shown inside raw-input box; "plotted node" jargon
- [MAJOR] usaco-fence-planning S2: "Correct output" wants a cow-ID list after nine perimeter questions; no coordinates exist to compute a perimeter
- [MAJOR] usaco-fence-planning S2: "CHOOSE THE CHOSEN COW" / wrong-chosen-cow bug describes a concept the real problem does not have
- [MAJOR] usaco-fence-planning S2: `0:(0,0)` labels rejected in Step 2, then secretly required in Step 4 (`0:(0,0)`,`1:(3,2)` etc.) with no guide
- [MINOR] usaco-fence-planning S2: Landen's arrow direction depends on click order; clicking 0 first can never expose the bug
- [MAJOR] usaco-fence-planning S3: membership claims flip between "It would be a mistake to use…" (Yes) and "Use this node rule…" (No)
- [MAJOR] usaco-fence-planning S3: wrong-answer feedback begins "Correct."/"Right." (Q1, Q4)
- [MINOR] usaco-fence-planning S3: Q1 two-node graph repeats the same claim in all variants
- [MINOR] usaco-fence-planning S3: Q3 claim writes edges reversed vs input
- [MAJOR] usaco-fence-planning S4: all 3 cases same bug/code/choices; cases 2–3 reuse Step 1 inputs with revealed answers
- [MAJOR] usaco-fence-planning S4: cases 2–3 label input cows=/friendships= while code takes positions, pairs
- [MINOR] usaco-fence-planning S4: diagnosis choices mix fix/bug/requirement framings; choice A is not a diagnosis
- [MINOR] usaco-fence-planning S4: "The helper returns 5" — no helper exists
- [MINOR] usaco-fence-planning S4: checklist line "The incorrect solution's exact output is correct" is a confusing double negative
- [MAJOR] usaco-milk-factory S1: Q2 Picture D feedback says arrows became two-way links, but the picture only reverses one arrow
- [MAJOR] usaco-milk-factory S1: Q7/Q8 re-ask Q1/Q4 inputs (the Description's examples) with answers already shown
- [MINOR] usaco-milk-factory S1: Q2 calls Q1's input "fresh"
- [BLOCKER] usaco-milk-factory S2: tree-only validator rejects the problem's own Example 1 shape (1→2, 3→2) with "A directed tree needs exactly one root with no incoming edge."; rule never shown; allowed shapes always have answer -1
- [MAJOR] usaco-milk-factory S2: "Correct output" is forward reach from the test station, opposite to the problem's "who can reach the pickup"; the problem-correct set equals Ezekiel's buggy output
- [MAJOR] usaco-milk-factory S2: "test station" never defined
- [MINOR] usaco-milk-factory S2: Griffin's wrong start "2" only visible in Drawing 2 title
- [MAJOR] usaco-milk-factory S3: membership claim polarity flips between questions
- [MAJOR] usaco-milk-factory S3: wrong-answer feedback begins "Correct."/"Right." (Q2, Q3, Q5)
- [MINOR] usaco-milk-factory S3: "1 and 2 are directly connected" hides arrow direction
- [MAJOR] usaco-milk-factory S4: correct diagnosis cites `next[b].push(a)` — no `next` in code, and `reverse[b].push(a)` is the correct line; the bug is `reverse[a].push(b)`
- [MAJOR] usaco-milk-factory S4: all 3 cases same bug/code/identical diagnosis text; buggy output 1 every time; cases 2–3 reuse Step 1 inputs
- [MINOR] usaco-milk-factory S4: input formatting differs between case 1 and cases 2–3
- [MINOR] usaco-milk-factory S4: "The helper accepts smallest candidate 1" — no helper
- [MINOR] usaco-milk-factory S4: "reverse graph" used in choices/feedback without ever being introduced
- [MAJOR] villages-without-wells S1: builds answerable by "pick the smaller number"; answer is 0 in 6 of 9 builds/remedials
- [MAJOR] villages-without-wells S1: Q1 and Q2 test the same thing (all clusters supplied, answer 0); Q2 has no isolated village despite facet "village identity"
- [MINOR] villages-without-wells S1: paths/roads/"road components"/solve vs countWellsToDig vocabulary drift
- [MINOR] villages-without-wells S1: Q7/Q9 state the clusters in the question, leaving only counting
- [MINOR] villages-without-wells S1: Q6 raw-input box contains the instruction "Focus on one listed relation."
- [MAJOR] villages-without-wells S2: "Jaden erases the outer leaves" but grader keeps leaf nodes and deletes their edges (required: nodes 0,1,2, no edges)
- [MINOR] villages-without-wells S2: output box wants a village list after nine "how many wells" questions, no hint
- [MINOR] villages-without-wells S2: "CHOOSE THE VILLAGE WITH A WELL" allows one well; Autumn's wrong well only in Drawing 2 title
- [MINOR] villages-without-wells S2: Carson "final listed route" = drawing order; verify edge numbers show
- [MAJOR] villages-without-wells S3: Q2 claim "0 can reach 1, so…" on an edgeless input has a false premise
- [MAJOR] villages-without-wells S3: membership claim polarity flips (Q1/Q2/Q4/Q5 vs Q3)
- [MAJOR] villages-without-wells S3: Q3 wrong-answer feedback begins "Correct."
- [MINOR] villages-without-wells S3: Q4 and Q5 use the identical direct-vs-reach claim (edges written reversed)
- [MINOR] villages-without-wells S3: backtick code spans in feedback captured on separate lines; verify inline rendering
- [MAJOR] villages-without-wells S4: cases 2–3 show roads= but code reads input.paths; function is solve(input) not countWellsToDig
- [MAJOR] villages-without-wells S4: all 3 cases same bug/code, buggy 1 / correct 0 every time; cases 2–3 reuse Step 1 inputs
- [MINOR] villages-without-wells S4: isolated-village distractor applies to none of the inputs; directed-paths distractor refuted by visible code
- [MINOR] villages-without-wells S4: input formatting differs between case 1 and cases 2–3
- [MAJOR] wheres-my-internet S1: Q7 = Q1 input = Example 1 (answer already shown); Q8 = Example 2 verbatim
- [MINOR] wheres-my-internet S1: "cables 1-2-3-4" chain notation can be read as one cable
- [MINOR] wheres-my-internet S1: Q2 calls Q1's input "fresh"
- [MAJOR] wheres-my-internet S2: "Correct output" is the ONLINE set while the function returns OFFLINE houses (real answer [] vs required [1,2,3,4])
- [MAJOR] wheres-my-internet S2: Heaven (make-one-way) with start locked at 1 can only be exposed by clicking the other house first; no hint
- [MINOR] wheres-my-internet S2: "CHOOSE THE HOUSE 1" on a readonly prefilled field
- [MINOR] wheres-my-internet S2: "Joaquin keeps only the last branch it sees" — "it" for a person
- [MINOR] wheres-my-internet S2: edge-order numbers reported visible for Joaquin but not Aubree though both say "Edge numbers show drawing order."
- [MAJOR] wheres-my-internet S3: Q5 claim "1 can reach 2, so…" on an edgeless input has a false premise
- [MAJOR] wheres-my-internet S3: membership claim polarity flips (Q3 vs others)
- [MAJOR] wheres-my-internet S3: Q3 wrong-answer feedback begins "Correct."
- [MINOR] wheres-my-internet S3: Q1 variant 1 writes edges reversed vs input
- [MAJOR] wheres-my-internet S4: all 3 cases same bug/code/identical correct sentence; cases 2–3 reuse Step 1 inputs
- [MINOR] wheres-my-internet S4: distractor mentions a "reachability search" the code does not contain; isolated-house distractor only relevant in case 1
- [MINOR] wheres-my-internet S4: "The helper reports [3,4]" — no helper
- [MINOR] wheres-my-internet S4: input formatting differs between case 1 and cases 2–3
