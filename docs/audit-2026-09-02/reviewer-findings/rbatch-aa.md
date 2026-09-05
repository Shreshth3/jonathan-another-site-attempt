# Batch rbatch-aa findings

Problems: biggest-study-group, codewars-array-deep-count, count-routes-to-summit, count-sub-islands, counting-docked-boats, dungeon-gold-run, employee-importance.
Every Step 1 build key, every remedial key and every Step 4 buggy/correct output below was recomputed by hand; Step 4 code was also executed with node. Known systemic issues (Step 2 output format, all-same-answer Step 3 claims, wrong-start only shown in Drawing 2 title, etc.) are not repeated except where a concrete instance is listed.

## The Biggest Study Group (`biggest-study-group`)

### Step 1
- **[MINOR] Q7 and Q9 re-ask builds the student already answered.** Q7 "What largest study-group size is returned from this worked-together matrix?" uses the exact Q1 matrix (student already picked 4 in Q1); Q9 uses the exact Q3 matrix (already picked 2 in Q3). Neither tests anything new. Fix: use fresh matrices (the remedial inputs are unused elsewhere). (Q7 `concept-output`, Q9 `concept-counterexample`)
- **[MINOR] Q5 raw-input box contains an instruction line.** The code box shows the matrix followed by "Focus on one listed relation." — a literal student may read that as part of the input. Move it into the prompt or drop it. (Q5 `concept-edge`)
- **[MINOR] Q5 choice B does not answer the question asked.** Question: "Which matrix entries create edges between different students?" Choice B: "Each diagonal 1 must be drawn as a self-loop and counted as another group member." A self-loop is by definition not "between different students", so the option is dismissable from the wording alone, and it smuggles a node-count claim into an edge question. (Q5)
- Build keys (Q1 → 4, Q3 → 2, Q6 → 4, Q8 → 1) and all five remedial keys (2, 2, 3, 3, 1) verified correct.

### Step 2
- **[MINOR] "CHOOSE THE FIRST STUDENT IN THE GROUP" is a misleading name for the search start.** In a problem about "the largest study group", "first student in the group" reads as "first member of the biggest group", not "where the search begins". Suggest "Starting student". (all 3 rounds)
- **[MINOR] Q3 bug text uses untaught jargon.** "Liliana drops every connection touching a degree-one node." "Degree" is never defined in this lesson (Step 3 says "direct neighbors"). Rephrase: "drops every connection that touches a student who has only one teammate". (Q3 `skip-leaf-edges`)
- Q1 (`make-one-way`) / Q2 (`first-branch`): only the systemic issues apply.

### Step 3
- **[MINOR] Q5 self-edge claim conflicts with the visible diagonal 1.** Input `worked=[[1]]`; claim "0 can reach itself without using an edge, but the graph still has no direct 0—0 edge." keyed YES. The input literally shows worked[0][0]=1, and Step 1 Q5 offered "draw the diagonal as a self-loop" as a tempting option, so a literal student may answer NO ("there is a 0—0 entry"). Feedback ("A zero-step path makes 0 reachable from itself; it does not invent a self-edge.") never says the diagonal 1 is excluded by the "different i and j" rule. Add that sentence. (Q5)
- All degree and direct-vs-reach claims verified for the 5 inputs. Q1's "1 has exactly 2 direct neighbors" / "2 has exactly 1 direct neighbor" (both NO) usefully catch students who count the diagonal.

### Step 4
- **[MAJOR] Internal slug displayed as the "Reachable boundary" in cases 2 and 3.** Success text and wrong-diagnosis feedback show "→ Reachable boundary: self-entry-adds-member →". That is an unrendered key, not a sentence. Replace with prose like case 1's ("The self-entry is 1 as guaranteed by the input."). (cases `ring-and-pair`, `two-tied-pairs`)
- **[MINOR] Wrong choices carry a boilerplate tail the correct choice lacks.** In all three cases the two distractors end "…which changes how the shown graph is evaluated." / "…changing this input's returned value." while the correct choice has no tail — the answer is identifiable by shape.
- **[MINOR] Case 1 input notation differs from cases 2/3.** `worked: [[1, 1], [1, 1]]` vs `worked=[[1,1,0,...]]`.
- Buggy outputs 3 / 5 / 3 and correct outputs 2 / 4 / 2 verified. Hidden labels "0"…"6" match the Step 1 format.

### Cross-step / other
- Nothing further.

## Array Deep Count (`codewars-array-deep-count`)

### Step 1
- **[MINOR] Q3 feedback for Picture D describes a different mistake.** Picture D only reverses one arrow (`[0]=1→outer array`); the displayed feedback says "This changes whether direct relations are arrows or two-way links." Nothing became two-way. Say "This reverses the arrow between outer array and [0]=1." (Q3 `exact-picture`)
- **[MINOR] Picture labels never match the names the student must type.** Q3's pictures label nodes "Outer array", "1 at [0]", "Array at [1]", "2 at [1][0]", while the guide and grader require "outer array", "[0]=1", "[1] array", "[1][0]=2". The student learns names from pictures that are then rejected in builds. (Q3)
- **[MINOR] Q8 requires typing straight double quotes: `[0]="x"`.** The guide says "Copy values exactly, including quotes around text", but smart-quote autocorrect (iPad/macOS) yields `“x”` and the only feedback is the generic node checklist. Accept both quote styles or normalise them. (Q8 `build-4`)
- **[MINOR] Q7 and Q9 are the Description tab's Example 1 and Example 2, with answers printed there** (`[1, 2, [3, 4, [5]]]` → 7; `["x", "y", ["z"]]` → 4). (Q7 `predict-output`, Q9 `bug-trap`)
- Build keys (3, 3, 0, 1) and remedial keys (4, 3, 2, 3, 4) verified.

### Step 2
- **[MAJOR] Concrete instance: Step 1 names are rejected only after clicking Check.** Submitting "outer array", "[0]=1", "[1] array", "[1][0]=2" fails with "Use root, root[0], root[1], ... to name nested input items." The word "root" appears nowhere earlier in the lesson, and the heading "CHOOSE THE OUTER ARRAY" sits over a readonly field already containing "root" — nothing to choose. (all 3 rounds)
- **[MINOR] "CORRECT OUTPUT" is a list of paths, not a count.** The function returns a number in Step 1; here the field expects `["root","root[0]","root[0][0]"]`. This mismatch is more jarring here than in graph problems because the student has just spent nine questions predicting numbers.
- Bug descriptions (shallow-search, reverse-arrows, drop-last-edge) match what the grader simulates.

### Step 3
- **[MINOR] Empty-array membership claims on inputs with no empty array.** Q1 v2 (`[[1],2]`) and Q4 (`[1,1,[1]]`) use the rule "Only items inside non-empty arrays." with feedback "An empty inner array still counts as one element." For these inputs that rule yields the identical graph, so "it would be a mistake" is only true in general. Use the claim only on Q2's `[[],1]`. (Q1, Q4)
- All degree ("outgoing") and direct-vs-reach claims verified.

### Step 4
- **[BLOCKER] Case 1 requires hidden labels "outer", "1", "inner", "2", "empty".** Input `arr: [1, [2, []]]`; no guide is shown; the taught names are "outer array", "[0]=1", "[1] array", "[1][0]=2", "[1][1] array" — and cases 2 and 3 of this same step DO require the taught names. "inner"/"empty" cannot be guessed; the only feedback is "The drawing has every exact node ×". Fix: regenerate case 1's canvas with pattern-conformant labels. (case `authored-deep-case`)
- **[MINOR] Distractor "The empty array should contribute the number of its missing children for the shown graph." is meaningless** ("number of its missing children" = ?), and in case 2 (`[1,[2]]`) there is no empty array at all. (cases 1–3)
- **[MINOR] Mixed choice framing.** Distractors A/C are phrased as what the code "should" do (claims about the right answer); the correct choice B is phrased as what the code does wrong. A student hunting for "the bug" can discard A/C on form alone.
- Buggy outputs 2 / 2 / 0 and correct 4 / 3 / 3 verified.

### Cross-step / other
- Node naming changes four times across the lesson: pictures ("1 at [0]"), Step 1/3 typing ("[0]=1"), Step 2 ("root[0]"), Step 4 case 1 ("1", "inner", "empty").

## Routes to the Summit (`count-routes-to-summit`)

### Step 1
- **[MINOR] Remedial input `graph=[[],[0],[]]` contradicts the story.** The Description says trails "always lead uphill" from base camp 0; a trail 1→0 leads back down to base. The question "How many routes go from base 0 to summit 2?" (→ 0) is gradable, but the input breaks the rule the student was told to trust. Same input is reused as Step 3 Q2. (remedial after `concept-relations`)
- **[MINOR] Q2 "Why" text mentions edge labels.** "An exact picture keeps every entity, direct relation, direction, and edge label from the input." — this problem has no edge labels. (Q2 `concept-picture`)
- Build keys (2, 2, 1, 1), concept keys (Q7 → 3, Q9 → 1) and remedial keys (2, 3, 0, 3, 3) verified.

### Step 2
- **[MINOR] "CHOOSE THE BASE CAMP" over a readonly field "0".** Nothing to choose. (all 3 rounds)
- Q1–Q3 otherwise fine apart from systemic issues.

### Step 3
- Q2 uses the downhill input noted above. All 15 claims verified true/false as keyed; degree claims correctly say "outgoing".

### Step 4
- **[MAJOR] Cases 2 and 3 show wrong-node feedback copied from case 1.** Picking "Checking the target before visited lets the same completed route be counted more than once." displays "The target check is correct; the second valid route is lost earlier at shared node 3." In case 2 (`graph=[[1,2],[2],[3],[]]`) the shared node is 2 and node 3 is the summit; in case 3 (`[[1,2],[3,4],[4],[5],[5],[]]`) the shared node is 4 and node 3 is not shared at all. Fix per case. (cases `repair-2`, `repair-5`)
- **[MINOR] The correct choice is the only one naming input-specific nodes.** Case 1 "…prunes shared node 3…", case 2 "…shared node 2 when route 0→2 arrives after route 0→1→2", case 3 "…shared node 4 when route 0→2→4 arrives after route 0→1→4", versus two generic distractors. Guessable by specificity.
- **[MINOR] Distractor "Adding the recursive branch counts incorrectly combines separate valid routes." is too vague** for a struggling student to know what mistake it describes.
- Buggy outputs 1 / 1 / 2 and correct 2 / 2 / 3 verified. Hidden labels "0"…"5" match Step 1.

### Cross-step / other
- Case 1 input shown as `graph: [[1, 2], [3], [3], [4], []]`, cases 2/3 as `graph=[[1,2],...]`.

## Count Sub Islands (`count-sub-islands`)

### Step 1
- **[BLOCKER] Q9 (`build-4`) cannot be completed.** Input `grid1=[[0]], grid2=[[0]]`; the required graph has zero nodes, but the answer buttons stay disabled until a node is drawn. Drawing any node makes the drawing wrong; drawing nothing leaves the buttons disabled. The student is stuck at the last question (harness: "8 passed · 1 skipped"). Fix: enable the answer buttons for empty-graph builds, or use an input with at least one grid2 land cell (e.g. `grid1=[[0]], grid2=[[1]]` → 0).
- **[MINOR] Q8 repeats Q6 exactly.** Q6 build: `grid1=[[1,1],[1,1]], grid2=[[1,0],[0,1]]` → 2. Q8 concept: "If grid1 is all land and grid2 is [[1,0],[0,1]], how many sub-islands are there?" → 2. The Q7 remedial (`[[1,0],[0,1]]` twice) is the same picture a third time. (Q6 `build-3`, Q8 `bug-trap`)
- **[MINOR] Q7 and Q8 are the Description's Example 1 and Example 2**, whose answers (1, 2) are printed in the Description tab.
- Build keys (1, 0, 2, 0) and remedial keys (0, 2, 0, 2, 1) verified.

### Step 2
- **[MAJOR] Q3 (`wrong-start`): the student must draw the character's secret start cell "(0,1)" and must not start there.** On-screen bug text is only "Grayson uses the wrong island seed." The grader (visual-library.js line 656–659) rejects any drawing without node (0,1): "Also draw (0,1), the wrong island seed used by the broken search.", and rejects start (0,1). The student only learns this after clicking Check. State it up front: "Grayson always starts at (0,1)."
- **[MINOR] The accepted counterexample can violate the grid's own edge rule.** The harness passed with land at (0,0) and (0,1) and no edge between them — side-adjacent land cells must be joined by the problem's rule. The grader never checks coordinates against adjacency, so an impossible grid passes; conversely a careful student who keeps (0,0)—(0,1) joined must choose a start far from (0,1), which is never hinted. (Q3)
- **[MINOR] "island seed" is jargon** ("CHOOSE THE ISLAND SEED", "Choose island seed"). Use "starting land cell".

### Step 3
- **[MINOR] Membership claims where the wrong rule gives the same graph.** Q3 (`grid1=[[1,0,1]], grid2=[[1,0,1]]`): "It would be a mistake to use this node rule: “Only positions that are land in both grids.”" keyed YES, but here that rule yields exactly the same nodes. Q5 (`grid1=[[1,0],[0,1]], grid2=[[1,0],[0,1]]`): "It would be a mistake to use this node rule: “Every land cell in grid1.”" — same nodes again. A literal student can defensibly answer No for these inputs. (Q3, Q5)
- Degree and direct-vs-reach claims verified for all 5 inputs.

### Step 4
- **[MINOR] Distractor refers to a variable `seen` that is not in the shown code.** "The traversal should turn visited grid2 land into water instead of using seen on the shown input." The code uses `visited`. A literal student searches for `seen` and finds nothing. (cases 1–3)
- **[MINOR] Cases 1 and 2 are near-duplicates.** Both: 2×2 all-land grid2, one grid1 water cell at (1,1) (`grid1=[[1,1],[1,0]]` vs `[[1,0],[1,1]]`), same required graph, buggy 1 / correct 0. Case 2 is also identical to Step 1 Q4; case 3 identical to a Step 1 remedial.
- Buggy outputs 1 / 1 / 1 and correct 0 / 0 / 0 verified. Hidden "(r,c)" labels match Step 1.

### Cross-step / other
- Step 3's "Use this graph model" panel says "Both (0,2) and 0,2 work" while the guide says "Name each cell (row,column)". Harmless but inconsistent.

## Counting Docked Boats (`counting-docked-boats`)

### Step 1
- **[MINOR] Two input notations, one never explained.** Builds Q1/Q3/Q6/Q8, all remedials and all Step 3 inputs use string rows (`marina=["B...B",".....",...]`), while the Description, Q4/Q5/Q7/Q9 and every Step 4 case use arrays of characters (`[[".","B",...]]`). The string form is never defined; a literal student may not know "B...B" means five squares. (Q1 `case-1` etc.)
- **[MINOR] Q5 raw-input box contains "Focus on one listed relation."** after the marina, as if it were input. (Q5 `concept-edge`)
- Build keys (3, 2, 2, 1), concept keys (Q7 → 2, Q9 → 2) and remedial keys (1, 2, 2, 0, 2) verified.

### Step 2
- **[MAJOR] Q1 (`wrong-start`): hidden requirement to draw "(0,1)".** Bug text: "Katelyn runs the search from a different first boat cell." A valid graph without (0,1) is rejected with "Also draw (0,1), the wrong first boat cell used by the broken search." (harness probe) — the first time the cell is named. Worse, (0,1) is side-adjacent to (0,0): a student who starts at (0,0) and obeys the boat rule (touching B squares are one boat) cannot expose the bug at all; they must pick a start not touching (0,1), which nothing suggests.
- Q2 (`shallow-search`) / Q3 (`drop-last-edge`): only systemic issues.

### Step 3
- **[MINOR] Q1 v2 claim rests on a false premise.** "(0,0) can reach (2,2), so the graph should contain a direct edge between them." keyed NO — correct, but (0,0) cannot reach (2,2) at all (two isolated boats). A student answering No because "they aren't reachable" gets feedback about a different idea ("Reachability never creates a direct edge…"). (Q1)
- Other claims verified.

### Step 4
- **[MINOR] Choices and feedback refer to a `seen` set; the code uses `visited`.** Case 1: "The code forgets seen and counts each boat square separately…" / "The seen set correctly keeps this component together."; case 2: "The seen set correctly groups the three squares…"; case 3: "Seen prevents repeats…". No `seen` in the shown code. (cases 1–3)
- **[MINOR] Grammar:** case 2 feedback "all two links are vertical side links."
- **[MINOR] Case 3's correct choice restates the answer.** "The code counts the top-border singleton but misses the second boat whose right-border square is reached after its interior start." vs two short generic distractors — identifiable by length/specificity. (case `one-counted-one-missed`)
- Buggy outputs 0 / 0 / 1 and correct 1 / 1 / 2 verified. Hidden "(r,c)" labels match Step 1.

### Cross-step / other
- Nothing further.

## Gold in the Locked Dungeon (`dungeon-gold-run`)

### Step 1
- **[MINOR] Q7 and Q8 give the answer inside the question.** Q7: "From room 0, rooms 0,1,2,3 are reachable with gold 5,10,1,8; rooms 4 and 5 are locked away with 50 each. What total is collected?" — the student only has to add 5+10+1+8; the `rooms` list is irrelevant. Q8: "Room 0 has 7 gold and only a key back to room 0. Rooms 1 and 2 are unreachable. What total is collected?" — same. Ask from the raw input alone. (Q7 `concept-output`, Q8 `concept-counterexample`)
- **[MINOR] Q5 raw-input box contains "Focus on one listed relation."** (Q5 `concept-edge`)
- Build keys (15, 20, 45, 1) and remedial keys (22, 30, 6, 20, 33) verified.

### Step 2
- **[MAJOR] Q2 (`wrong-start`): hidden requirement to draw room "1".** Bug text: "Miguel ignores the chosen starting room and uses a different one." The grader requires node 1 ("Also draw 1, the wrong starting room used by the broken search.") and the room number is otherwise shown only in Drawing 2's title. The heading "CHOOSE THE STARTING ROOM" sits over a readonly "0", and the story says only room 0 is unlocked, so "Miguel starts in room 1" needs to be stated explicitly.
- **[MINOR] Q1 (`make-two-way`) needs Drawing 2 to be undirected.** "Haley walks backward across arrows that only point forward." suggests the arrows stay; the grader requires Haley's graph as UNDIRECTED (`1—0`), i.e. the student must switch "Directed edges" off for Drawing 2. Not stated.
- Concrete instance of the known label issue: Step 1 names "0:1g" are rejected with "Use numeric IDs 0, 1, 2, ... with no gaps."

### Step 3
- **[MINOR] Membership claims about zero-gold / unreachable rooms on inputs that have none.** Q1 v2 and Q4 use "Only rooms holding at least one piece of gold." but every room in `gold=[3,6,9,12,15]` / `[1,2,3,4,5]` has gold; Q2 (`rooms=[[1,2],[4],[4],[],[]]`) and Q5 (`[[3,1],[2],[3],[]]`) use "Only rooms already known to be reachable from room 0." but every room there is reachable. For the shown input the wrong rule gives the same graph. (Q1, Q2, Q4, Q5)
- Degree and direct-vs-reach claims verified.

### Step 4
- **[BLOCKER] Case 1 requires hidden labels "0", "1", "2" while cases 2 and 3 require "0:1g"-style labels.** No guide in Step 4; the taught format is `roomIndex:goldAmountg`. Writing "0:5g", "1:3g", "2:10g" in case 1 fails with only "The drawing has every exact node ×"; writing "0","1","2" in case 2 then fails again. (case `authored-deep-case` vs `case-1`, `case-2`)
- **[MAJOR] The shown code reads a field that does not exist and never touches `rooms`.** `for (const key of input.startKeys || [0])` — `startKeys` is not part of the problem input, so the code relies on the JS idiom "undefined || [0]" to mean "just room 0". A struggling student cannot know what `input.startKeys` is or that it is undefined; the case title "Uses only the starting keyring" uses a word ("keyring") the problem never defines; the feedback itself admits "The code never reads rooms at all". Replace with a solution that reads `rooms` but never enqueues the keys it finds. (cases 1–3)
- **[MAJOR] Internal slug displayed as the "Reachable boundary" in cases 2 and 3:** "→ Reachable boundary: ignore-found-keys →". (cases `case-1`, `case-2`)
- **[MINOR] Correct choice says "worklist"** ("never adds that room's newly found keys to the worklist") — no worklist exists in the code.
- Buggy outputs 5 / 1 / 2 and correct 18 / 15 / 20 verified.

### Cross-step / other
- Case 1 input shown as `rooms: [[1], [2], []]` / `gold: [5, 3, 10]`; cases 2/3 use Step 1's `rooms=[...], gold=[...]`.

## Employee Importance (`employee-importance`)

### Step 1
- **[MINOR] Q7 and Q9 are the Description's two examples with answers printed there, and the question text restates every number** ("Employee 1 has importance 5 and direct reports 2 and 3, each worth 3. What total is returned for id 1?"; "Employee 5 has importance -3 and report 6 has importance 2. What total is returned for id 5?"). Answerable without the input or a graph. (Q7 `predict-output`, Q9 `bug-trap`)
- Build keys (15, 20, 45, 1) and remedial keys (30, 22, 15, 20, 45) verified.

### Step 2
- **[MAJOR] Step 2 rejects id 0, which every other step uses as the root.** Label rule `positive-integer` (`/^[1-9]\d*$/`, visual-library.js line 688) → "Use positive integer IDs, like 1, 3, or 10." All four Step 1 builds, all five Step 3 inputs and Step 4 cases 2/3 use `id: 0`. A student who copies Step 1 (nodes 0, 1, 2) is rejected by a message that never says "0 is not allowed". The "0:1" format is rejected too. Either allow 0 or stop using id 0 elsewhere. (all 3 rounds)
- **[MAJOR] Q3 (`wrong-start`): hidden requirement to draw employee "2" and not to start there.** Bug text: "Stephen ignores the chosen requested employee and uses a different one." Grader: "Also draw 2, the wrong requested employee used by the broken search." / "Choose a requested employee different from the broken search's 2." Only discoverable after Check.
- Q1 (`reverse-arrows`) / Q2 (`shallow-search`): only systemic issues.

### Step 3
- All 15 claims verified true/false as keyed; degree claims say "outgoing". Fine.

### Step 4
- **[BLOCKER] Case 1 requires hidden labels "1", "2", "3" while cases 2 and 3 require "0:1"-style labels.** The taught format is `id:importance` ("1:5", "2:3", "3:4"), which fails case 1; the plain-id format then fails cases 2/3. No guide shown. (case `authored-deep-case` vs `case-1`, `case-2`)
- **[MAJOR] Case 3's correct choice describes edges the code never follows.** Input is the chain 0→1→2→3 with `id=0`; the keyed-correct choice reads "The loop follows edge 1→2 but never continues along 2→3, changing this input's returned value." Called with id 0, the code follows 0→1 and never follows 1→2. The success text itself says "the helper stops after 0→1". A literal student may reject the correct choice because "the code never follows 1→2". (Text evidently copied from case 1, whose ids are 1, 2, 3.) (case `case-2`)
- **[MINOR] Distractor "The boss's importance is added before the subordinate loop and should be added afterward in this case." is not a believable bug** — addition order cannot change a sum, and the feedback has to say exactly that. Its internal id `double-boss` describes a different mistake than the text. (cases 1–3)
- Buggy outputs 8 / 6 / 6 and correct 12 / 15 / 20 verified.

### Cross-step / other
- Id conventions: Description examples use 1–3 and 5–6; Step 1/3 and Step 4 cases 2–3 use 0–4 with "id:importance" labels; Step 2 forbids 0; Step 4 case 1 uses bare 1–3. Four conventions in one lesson.

## One-line summary of every finding in this batch
- [MINOR] biggest-study-group S1: Q7/Q9 reuse Q1/Q3 inputs whose answers the student already gave
- [MINOR] biggest-study-group S1: Q5 code box contains "Focus on one listed relation."
- [MINOR] biggest-study-group S1: Q5 choice B (diagonal self-loop) doesn't address "between different students"
- [MINOR] biggest-study-group S2: "CHOOSE THE FIRST STUDENT IN THE GROUP" misnames the search start
- [MINOR] biggest-study-group S2: Q3 bug text uses untaught term "degree-one node"
- [MINOR] biggest-study-group S3: Q5 "no direct 0—0 edge" claim on worked=[[1]] conflicts with visible diagonal 1
- [MAJOR] biggest-study-group S4: cases 2/3 display raw slug "Reachable boundary: self-entry-adds-member"
- [MINOR] biggest-study-group S4: distractors carry boilerplate tails the correct choice lacks
- [MINOR] biggest-study-group S4: case 1 input notation differs from cases 2/3
- [MINOR] codewars-array-deep-count S1: Q3 Picture D feedback ("arrows or two-way links") describes a different mistake than a reversed arrow
- [MINOR] codewars-array-deep-count S1: picture labels ("1 at [0]") never match the required typed names ("[0]=1")
- [MINOR] codewars-array-deep-count S1: Q8 requires straight double quotes in `[0]="x"`
- [MINOR] codewars-array-deep-count S1: Q7/Q9 are the Description examples with answers shown
- [MAJOR] codewars-array-deep-count S2: Step 1 names rejected ("Use root, root[0]…"); "root" never introduced; "CHOOSE THE OUTER ARRAY" over a readonly field
- [MINOR] codewars-array-deep-count S2: "CORRECT OUTPUT" expects a path list where Step 1 taught a number
- [MINOR] codewars-array-deep-count S3: empty-array membership claims on Q1/Q4 inputs that contain no empty array
- [BLOCKER] codewars-array-deep-count S4: case 1 hidden labels "outer","1","inner","2","empty" contradict taught format and cases 2/3
- [MINOR] codewars-array-deep-count S4: distractor "number of its missing children" is meaningless / references absent empty array
- [MINOR] codewars-array-deep-count S4: mixed "should"/"does" framing lets the correct choice be spotted by form
- [MINOR] count-routes-to-summit S1: remedial input graph=[[],[0],[]] (trail 1→0) contradicts "always uphill"; reused in S3 Q2
- [MINOR] count-routes-to-summit S1: Q2 "Why" mentions "edge label" though the problem has none
- [MINOR] count-routes-to-summit S2: "CHOOSE THE BASE CAMP" over a readonly field
- [MAJOR] count-routes-to-summit S4: cases 2/3 wrong-choice feedback says "lost earlier at shared node 3" (shared node is 2 / 4)
- [MINOR] count-routes-to-summit S4: only the correct choice names input-specific nodes
- [MINOR] count-routes-to-summit S4: distractor "Adding the recursive branch counts…" too vague
- [BLOCKER] count-sub-islands S1: Q9 build-4 (grid2=[[0]]) has an empty correct graph and answer buttons never enable — dead end
- [MINOR] count-sub-islands S1: Q8 concept repeats Q6 build input exactly (and the Q7 remedial again)
- [MINOR] count-sub-islands S1: Q7/Q8 are the Description examples with answers shown
- [MAJOR] count-sub-islands S2: Q3 wrong-start requires drawing secret cell (0,1) and not starting there; only revealed by the Check error
- [MINOR] count-sub-islands S2: Q3 passes with side-adjacent land cells left unconnected (grid rule not enforced)
- [MINOR] count-sub-islands S2: "island seed" jargon
- [MINOR] count-sub-islands S3: Q3/Q5 membership claims where the wrong rule yields the same nodes
- [MINOR] count-sub-islands S4: distractor mentions `seen` but code uses `visited`
- [MINOR] count-sub-islands S4: cases 1 and 2 are near-duplicates; cases 2/3 reuse Step 1 inputs
- [MINOR] counting-docked-boats S1: string-row marina notation ("B...B") never defined; array notation used elsewhere
- [MINOR] counting-docked-boats S1: Q5 code box contains "Focus on one listed relation."
- [MAJOR] counting-docked-boats S2: Q1 wrong-start requires drawing secret cell (0,1); start (0,0) can't expose it without breaking the boat rule
- [MINOR] counting-docked-boats S3: Q1 v2 claim "(0,0) can reach (2,2), so…" has a false premise
- [MINOR] counting-docked-boats S4: choices/feedback say "seen"; code uses `visited`
- [MINOR] counting-docked-boats S4: case 2 feedback grammar "all two links"
- [MINOR] counting-docked-boats S4: case 3 correct choice restates the answer vs terse distractors
- [MINOR] dungeon-gold-run S1: Q7/Q8 question text lists the reachable rooms and gold, so the input is unnecessary
- [MINOR] dungeon-gold-run S1: Q5 code box contains "Focus on one listed relation."
- [MAJOR] dungeon-gold-run S2: Q2 wrong-start requires drawing secret room 1; "CHOOSE THE STARTING ROOM" is readonly
- [MINOR] dungeon-gold-run S2: Q1 make-two-way needs Drawing 2 switched to undirected; not stated
- [MINOR] dungeon-gold-run S3: zero-gold / unreachable-room membership claims on inputs where every room has gold / is reachable
- [BLOCKER] dungeon-gold-run S4: case 1 hidden labels "0","1","2" vs cases 2/3 "0:1g" format; no guide
- [MAJOR] dungeon-gold-run S4: code uses nonexistent `input.startKeys || [0]` and never reads `rooms`; "keyring" undefined
- [MAJOR] dungeon-gold-run S4: cases 2/3 display raw slug "Reachable boundary: ignore-found-keys"
- [MINOR] dungeon-gold-run S4: correct choice says "worklist" though none exists in the code
- [MINOR] employee-importance S1: Q7/Q9 are the Description examples and restate every number in the question
- [MAJOR] employee-importance S2: label rule rejects id 0 ("Use positive integer IDs") though Steps 1/3/4 all use id 0
- [MAJOR] employee-importance S2: Q3 wrong-start requires drawing secret employee 2 and not starting there
- [BLOCKER] employee-importance S4: case 1 hidden labels "1","2","3" vs cases 2/3 "0:1" format; no guide
- [MAJOR] employee-importance S4: case 3 correct choice says "follows edge 1→2 but never continues along 2→3" — code called with id 0 follows 0→1 only
- [MINOR] employee-importance S4: "boss's importance added before the loop" distractor is not a believable bug
