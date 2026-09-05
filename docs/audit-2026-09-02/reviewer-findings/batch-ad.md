# Batch AD findings

Problems: number-of-islands, number-of-provinces, possible-bipartition, smallest-string-with-swaps, time-needed-to-inform-all-employees, water-and-jug-problem, who-keeps-their-job.

Note: the harness crashed on all four steps of possible-bipartition, smallest-string-with-swaps, time-needed-to-inform-all-employees and water-and-jug-problem ("Target page, context or browser has been closed"; Step 1 progress strip recorded as "undefined · undefined"). Those four transcripts contain only the Description tab. For them I reviewed the authored data directly (`visual-lessons-original.json`, `step2-specs-original.json`, `step4-specs-original.json`) and ran every Step 4 code snippet with node. Their on-screen text, Step 3 generated claims and grader behaviour are NOT verified and the harness run must be repeated.

Every Step 1 build/remedial answer key and every Step 4 buggy/correct output in this batch was worked or executed by me; unless a finding below says otherwise, the keys are right.

---

## Number of Islands (`number-of-islands`)

### Step 1
- **[MAJOR] Q7 and Q8 are the Description's Example 1 and Example 2, and the prompts give the answer away.** Q7 shows Example 1's grid (Description: "→ output 1") and asks "A bent patch of land stays side-connected throughout. How many islands is it?" — "stays side-connected throughout" is the answer. Q8 shows Example 2's grid ("→ output 3") and asks "A 2×2 land block, a diagonal lone land cell, and a separate two-cell pair are pictured. How many islands?" — it lists three separate patches, and nothing is "pictured" (only the raw grid is shown). Fix: fresh grids, no narration of the shape. (S1 Q7 `predict-output`, Q8 `bug-trap`)
- **[MINOR] Slug-generated feedback on every build/remedial distractor.** "That result follows the count land cells bug", "…the require neighbor for island bug", "…the use eight direction dfs bug", "…the check horizontal neighbors only bug", "…the fail to join branching land bug", "…the jump across water bug", "…the include water node bug". A struggling student cannot parse "the use eight direction dfs bug". Fix: write a sentence per distractor. (Q1, Q4, Q6, Q9, all 5 remedials)
- Keys: all 4 builds and 5 remedials verified correct.

### Step 2
- **[MAJOR] "CORRECT OUTPUT" box means something different from the problem's output.** The Description says "Return how many islands", and every Step 1 question asked "What should the function return?" with numbers. Here the grader wants the list of reached cells as a quoted JSON array, e.g. `["(0,0)"]`; `1`, `(0,0)`, `{(0,0)}` and `[(0,0)]` are all rejected (harness probes). No hint is shown. Fix: label the boxes "Land cells the correct search reaches, e.g. ["(0,0)","(0,1)"]". (S2 Q1–Q3)
- **[MAJOR] Q3 Nevaeh: the wrong start "(0,1)" is never stated before Drawing 2.** Bug text is only "Nevaeh uses the wrong first land cell." The grader always makes her start at (0,1). A student whose own "first land cell" is (0,1) (natural for a one-row strip) can never expose her, and a student who omits cell (0,1) from the graph cannot either. Fix: "Nevaeh always starts at (0,1) instead of the cell you chose." (S2 Q3 `wrong-start`)

### Step 3
- **[MAJOR] Q1 variant 1 claim has a false premise.** On grid [["1","0","0"],["0","1","0"],["0","0","1"]] the claim reads "(0,0) can reach (1,1), so the graph should contain a direct edge between them." — (0,0) cannot reach (1,1) at all (no edges). It is keyed NO, and the feedback "Reachability never creates a direct edge. This input lists no direct relation between (0,0) and (1,1)." never says the premise is false. A literal student does not know what they are agreeing/disagreeing with. Fix: generate this claim only when the two nodes really are reachable. (S3 Q1 v1 `direct-vs-reach`)
- **[MINOR] Wrong-answer feedback starts with "Correct."/"Right."** Shown under a × after a wrong answer: Q1 v0 "Correct. Node membership alone creates neither a direct edge nor a route."; Q2 "Right. A multi-step route through (1,0) creates reachability, not a new direct edge."; Q3 "Correct. Node membership alone…"; Q4 "Correct. A zero-step path makes (0,1) reachable from itself…". Fix: strip the verdict word from `feedback if wrong`.
- **[MINOR] Label guidance contradicts itself.** Guide above the drawing: "Name each cell (row,column)… Do not add spaces or the cell value." Graph-wrong feedback below: "LABELS: … Both (0,2) and 0,2 work." Harmless (grid labels are normalised) but a literal student sees two rules.

### Step 4
- **[MAJOR] Distractor "The answer should equal the number of land cells in this case." is true for all three cases.** Inputs have 2, 3 and 4 diagonal land cells and the real answers are 2, 3 and 4. A student who picks it is literally right, and the feedback "No. Adjacent land cells may form one island; components, not cells, are counted." argues about other inputs, not "this case". Fix: make it a claim about the code, e.g. "It counts every land cell as its own island". (S4 cases 1–3, choice `count-land`)
- **[MAJOR] Three identical cases.** Same 8-direction code, same bug title "Diagonal land is joined into one island", same three diagnosis choices (only reordered), buggy output `1` every time; inputs are diagonal chains of length 2, 3, 4 (case 2's grid is also Step 1's remedial and Step 3 Q1). After case 1 the student copies. Fix: three different bugs. (S4 cases 1–3)
- **[MINOR] Mixed framing makes the answer stand out.** The correct choice describes the code ("It creates edges between corner-touching land cells."); both distractors are "should" statements ("Water cells should be traversed as bridge nodes.", "The answer should equal…"). The only "It …" sentence is the answer.
- **[MINOR] Proof-chain wording.** Case 1 "Changed graph: The two land nodes share only a corner, so the four-neighbor land graph has no edge between them." describes the *correct* graph, not the changed one. Cases 2–3 "Returned value: The shown code returns 1; the source-repo reference solution returns 3." — "source-repo reference solution" is authoring jargon. Fix: "The correct answer is 3."
- Hidden node labels are "(0,0)"-style and are normalised for grid problems, so no secret-label problem here. Buggy outputs verified (1, 1, 1).

### Cross-step / other
- **[MINOR] Heavy input reuse.** [["1","0"],["0","1"]] is Step 1 Q4 and Step 4 case 1; the 3×3 diagonal grid is a Step 1 remedial, Step 3 Q1 and Step 4 case 2; [["1"],["1"],["1"]], [["1","0","1"]], [["0","1"]], [["1","1"],["1","0"]] are each a Step 1 remedial and a Step 3 question.

---

## Number of Provinces (`number-of-provinces`)

### Step 1
- **[MAJOR] Q7 and Q9 repeat inputs the student already built, and both are Description examples.** Q7 (`predict-output`) uses [[1,1,0],[1,1,0],[0,0,1]] — the same matrix as Q1 (build, answered "2"), Q3 (exact-picture) and Description Example 1 ("→ output 2"). Q9 (`bug-trap`) uses the 3×3 identity matrix — same as Q2 (build, answered "3") and Example 2 ("→ output 3"). Both can be answered from the Description tab or memory. Fix: fresh matrices.
- **[MINOR] Jargon / odd wording in prompts.** Q9 "What is the province count for a 3×3 identity matrix?" — "identity matrix" is never explained (the matrix is shown anyway). Q7 "For matrix […], how many provinces are shown?" — nothing is shown but numbers.
- **[MINOR] Q6 distractor B is defensible.** "Draw a separate arrow i→j for every 1, including a second reverse arrow from the mirrored entry." — two opposite arrows behave exactly like one two-way road; feedback "The matrix is symmetric and represents one undirected road per city pair." does not say why the pair of arrows is wrong. Fix: make it clearly wrong (e.g. "only one arrow i→j, from the upper triangle").
- **[MINOR] Slug-generated feedback:** "the connect through diagonal ones bug", "the ignore diagonal only cities bug", "the count direct groups only bug", "the count only off diagonal edges bug", "the merge all matrix rows bug", "the build only cities with off diagonal one bug", "the count mirrored entries as two components bug", "the split cycle into pairs bug", "the count distinct adjacency rows bug".
- Keys: all builds/remedials verified correct.

### Step 2
- **[MAJOR] Q1 Evan "allows each two-way link to work only in its written order."** A matrix has no "written order" for a road (both [i][j] and [j][i] are 1), and the student draws their own graph, so the grader actually uses the order the student clicked the two endpoints (harness: edge drawn 1→0 became arrow 1→0; the required Evan graph was DIRECTED 1→0). Nothing on screen says click order matters and no edge numbers are shown for this round. A student who drew 0—1 starting at 0 gets an arrow 0→1, Evan reaches [0,1] = correct, "no counterexample", with no explanation. Fix: "Evan turns every road into an arrow from the city you clicked first to the city you clicked second." (S2 Q1 `make-one-way`)
- **[MAJOR] Q3 Jack "erases the outer leaves before searching."** The grader keeps every leaf city and deletes only the roads touching it: for the path 0—1—2 Jack's graph must be exactly nodes 0,1,2 with no edges. A student who literally erases the leaf cities 0 and 2 fails the drawing check. "Outer leaves" (degree-1 cities) is also jargon. Fix: "Jack deletes every road that touches a city with only one road; the cities stay." (S2 Q3 `skip-leaf-edges`)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1]` (cities reached), not the province count** the student has been answering with all through Step 1. Rejected probes: `0, 1`, `{0,1}`, `["0","1"]`, `[1,0]`. No hint shown. (S2 Q1–Q3)
- **[MINOR] Q2 Riley's substitute city is hidden and "province seed city" is jargon.** "Riley ignores the chosen province seed city and uses a different one." — the different one is 1 (only shown in Drawing 2's title); if the student's own seed city is 1 no counterexample exists. Fix: "Riley always starts at city 1" and call it "the city the search starts from".

### Step 3
- **[MAJOR] Membership claim keyed NO is true for the shown input.** Q1 variant 1 and Q5 ask "Use this node rule for the graph: “Only cities that have an off-diagonal `1` connecting them to another city.”" on [[1,1,0],[1,1,1],[0,1,1]] and on the 4-cycle matrix — every city there has an off-diagonal 1, so that rule produces exactly the correct node set. A literal student who tests the rule on the input says Yes and is marked wrong. Fix: only quote a wrong node rule on inputs where it changes the node set (Q2/Q3, which have an isolated city). (S3 Q1 v1, Q5 `membership`)
- **[MINOR] Wrong-answer feedback starts with a verdict word:** Q1 v0 "Right. A multi-step route through 1 creates reachability…"; Q2/Q3/Q4 "Correct. The mini-example lists 1—2 as one direct edge." ("mini-example" is also jargon).
- **[MINOR] Third wording of the node rule.** Feedback says "Correct node rule: One node for each matrix row and column index." while Step 1 Q4's correct choice was "Cities 0, 1, 2, and 3—one node for each row and column."

### Step 4
- **[BLOCKER] Case 1 hidden node labels are "city 0", "city 1", "city 2".** Step 1/3 taught "Use each node's 0-based number only. Example: 2.", cases 2 and 3 of this same step require "0","1","2", and Step 4 shows no guide. The student draws 0,1,2, gets "× The drawing has every exact node" and no hint. Fix: change case 1's canvas labels to "0","1","2". (S4 case 1 `authored-deep-case`)
- **[MAJOR] Three identical cases.** Same code (`return visited.size > 0 ? 1 : 0` — always 1), same bug "Only city 0's province is counted", same three choices; cases 2 and 3 are Step 1's build-isolated and exact-picture remedial inputs whose answers (3, 2) the student already gave. (S4 cases 1–3)
- **[MINOR] Feedback talks about "friendship".** "No. Friendship is mutual and the matrix is symmetric." (all cases) and case 2 "Cities 0,1,2 have no off-diagonal friendship edges" — the lesson is about cities and roads; "friendship" comes from the old LeetCode framing and is never introduced.
- **[MINOR] Mixed framing / tacked-on phrases.** Distractors "Diagonal 1 entries should each add another province for the shown graph." and "The matrix should be read as one-way roads, changing this input's returned value." are "should" statements; the answer is the only sentence describing what the code does.
- Buggy outputs verified (1, 1, 1); correct outputs 2, 3, 2 verified.

### Cross-step / other
- **[MINOR] Every Step 3 input is a Step 1 remedial input**, and Step 4 cases 2–3 are Step 1 inputs; the identity matrix appears in Step 1 Q2, Q9 and Step 4 case 2.

---

## After the Big Resignation (`who-keeps-their-job`)

### Step 1
- **[MAJOR] Q7 and Q9 re-ask builds the student just passed, with the tree narrated.** Q7 uses Q1/Q2's input (ids=[10,2,7,15]…) and says "The chart has 10 above 2 and 7, and 2 above 15. If employee 2 quits, which sorted IDs remain?" — the student already chose "[7,10]" in Q1. Q9 uses Q3's input and says "The chart has 6 above 1 and 8, and 1 above leaf employee 3." — the student already chose "[1,6,8]" in Q3. Neither the raw input nor a drawing is needed. Fix: fresh inputs, no narration. (S1 Q7 `concept-output`, Q9 `concept-counterexample`)
- **[MINOR] Q8 distractor "[5,7,20,90]" includes the quitter** in "who still works", with feedback "This treats quitId 5 as an array position, fails to find that position, and therefore removes nobody." — "array position" is code jargon for this student.
- **[MINOR] Q4 distractor cites IDs not in the input.** "One reporting relationship such as `10 → 20`." while the shown ids are [4,9,2,7,12,5,3,8]; Step 3 re-quotes the same "10 → 20" on inputs [50,4,6] and [42].
- Keys: all builds/remedials verified.

### Step 2
- **[MINOR] Here "CORRECT OUTPUT" really is the problem's answer (remaining IDs; `result: "unreached-nodes"`), but the success text still says "Why it works: the same input produces different reachable sets under the broken and correct rules."** The boxes show `[2]` / `[]` — remaining employees, not reachable sets. Also inconsistent with every other problem in this batch, where the same box means "nodes reached". Fix: "…produce different lists of remaining employees."
- **[MINOR] Bug wording.** Q1 "Charles reads every from/to relationship backward." — the lesson's words are boss/report, not from/to. Q3 "Luis builds every listed connection except the last one." — there is no list; it means the last edge the student draws ("Edge numbers show drawing order." is appended, but a student may still look for a "list"). Q2 "Maria stops after one hop" — "hop" undefined. Fix: "the last edge you draw", "boss→report arrow", "one level down".

### Step 3
- **[MINOR] Q5 one-node input (ids=[42]) self-edge claim:** "Because 42 can reach itself, the graph should contain a direct 42→42 edge." — keyed NO; nothing in the lesson taught "reach itself".
- **[MINOR] Wrong-answer feedback starts with "Right."/"Correct."** (Q1 v0 and v1 "Right. A multi-step route through 8…", Q4 "Correct. The mini-example lists 11→2 as one direct edge.").
- All 15 claims otherwise verified true/false as keyed; degree claims correctly say "outgoing direct edge".

### Step 4
- **[MAJOR] Three identical cases whose inputs are Step 1's Q1, Q6 and Q8 builds.** Same 8-line code, same bug "Stops the resignation at one employee", same three choices; the correct output of each case was already the student's Step 1 answer, and the buggy output is always "that answer plus the quitter's reports". (S4 cases 1–3)
- **[MINOR] Code and input presentation.** The code is `function solve(input) { const { ids, quitId } = input; …` — object destructuring, never explained, and `bosses` is never read; case 1 shows the input as three lines "ids: [10, 2, 7, 15] / bosses: [0, 10, 10, 2] / quitId: 2" while cases 2–3 show "ids=[4,9,2], bosses=[0,4,4], quitId=4". The "Changed graph" line ("10 points to direct reports 2 and 7; 2 points to direct report 15.") is just the correct graph because the code builds none.
- **[MINOR] Distractor feedback jargon.** "The comparator is numeric. The extra employee, not the order, causes the failure."
- Hidden labels match the taught format; buggy outputs verified ([7,10,15], [2,9], [7,20,90]).

---

## One-line summary of every finding in this batch
- [MAJOR] number-of-islands S1: Q7/Q8 are Description Examples 1–2 and their prompts state the answer ("stays side-connected throughout", "three patches… are pictured").
- [MINOR] number-of-islands S1: slug feedback "the use eight direction dfs bug" etc. on every build/remedial distractor.
- [MAJOR] number-of-islands S2: "CORRECT OUTPUT" wants `["(0,0)"]` cell list, not the island count the student has been answering.
- [MAJOR] number-of-islands S2: Q3 Nevaeh's fixed start (0,1) is never stated; no counterexample if the student picks (0,1).
- [MAJOR] number-of-islands S3: Q1 v1 claim "(0,0) can reach (1,1), so…" has a false premise on the diagonal grid; feedback doesn't say so.
- [MINOR] number-of-islands S3: wrong-answer feedback begins "Correct."/"Right." (Q1, Q2, Q3, Q4).
- [MINOR] number-of-islands S3: guide says "(row,column)… no spaces" while graph-wrong feedback says "Both (0,2) and 0,2 work."
- [MAJOR] number-of-islands S4: distractor "The answer should equal the number of land cells in this case." is true for all three inputs.
- [MAJOR] number-of-islands S4: three identical cases (same code, bug, choices; diagonal chains 2/3/4).
- [MINOR] number-of-islands S4: only the correct choice is an "It …" description; distractors are "should" statements.
- [MINOR] number-of-islands S4: "Changed graph" text describes the correct graph; "source-repo reference solution" jargon.
- [MINOR] number-of-islands cross: same grids reused across Step 1 remedials, Step 3 and Step 4.
- [MAJOR] number-of-provinces S1: Q7/Q9 reuse Q1/Q2's matrices (= Description Examples 1–2, answers shown).
- [MINOR] number-of-provinces S1: "identity matrix" jargon (Q9); "how many provinces are shown?" (Q7).
- [MINOR] number-of-provinces S1: Q6 distractor "two opposite arrows" is behaviourally equivalent and defensible.
- [MINOR] number-of-provinces S1: slug feedback ("the count mirrored entries as two components bug" …).
- [MAJOR] number-of-provinces S2: Evan "only in its written order" — matrix has no written order; grader uses click order, never stated.
- [MAJOR] number-of-provinces S2: Jack "erases the outer leaves" but the grader requires leaf cities kept and only their roads removed.
- [MAJOR] number-of-provinces S2: "CORRECT OUTPUT" wants `[0,1]` city list, not the province count.
- [MINOR] number-of-provinces S2: Riley's substitute city 1 hidden; "province seed city" jargon.
- [MAJOR] number-of-provinces S3: "Only cities that have an off-diagonal 1" rule keyed NO on inputs where it yields the correct node set (Q1 v1, Q5).
- [MINOR] number-of-provinces S3: wrong-answer feedback begins "Right."/"Correct."; "mini-example" jargon.
- [MINOR] number-of-provinces S3: third wording of node rule ("One node for each matrix row and column index").
- [BLOCKER] number-of-provinces S4: case 1 requires secret labels "city 0/1/2" while cases 2–3 and Step 1/3 use "0/1/2".
- [MAJOR] number-of-provinces S4: three identical cases; cases 2–3 are Step 1 inputs with answers already given.
- [MINOR] number-of-provinces S4: feedback says "Friendship is mutual" / "friendship edges" — lesson is about cities and roads.
- [MINOR] number-of-provinces S4: "should" distractors with "changing this input's returned value" tail; answer is the only "It …".
- [MINOR] number-of-provinces cross: every Step 3 input and Step 4 cases 2–3 are Step 1 inputs.
- [MAJOR] who-keeps-their-job S1: Q7/Q9 re-ask Q1/Q3's inputs with the tree narrated; drawing and input irrelevant.
- [MINOR] who-keeps-their-job S1: Q8 distractor includes the quitter; "array position" jargon in feedback.
- [MINOR] who-keeps-their-job S1: Q4 distractor cites "10 → 20", IDs not in the input (re-quoted in Step 3).
- [MINOR] who-keeps-their-job S2: output box is the real answer (remaining IDs) but success text says "different reachable sets"; inconsistent with other problems.
- [MINOR] who-keeps-their-job S2: bug wording "from/to relationship", "listed connection except the last one", "one hop".
- [MINOR] who-keeps-their-job S3: Q5 one-node self-edge claim "Because 42 can reach itself…".
- [MINOR] who-keeps-their-job S3: wrong-answer feedback begins "Right."/"Correct.".
- [MAJOR] who-keeps-their-job S4: three identical cases whose inputs are Step 1 Q1/Q6/Q8 builds.
- [MINOR] who-keeps-their-job S4: `const { ids, quitId } = input` destructuring unexplained; input shown in two formats; "Changed graph" is the correct graph.
- [MINOR] who-keeps-their-job S4: "The comparator is numeric." jargon.
- [MAJOR] time-needed harness: all four steps crashed; nothing verified in the UI.
- [MAJOR] time-needed S1: predict-output input informTime=[4] for a head with no reports contradicts the Description ("informTime[i] == 0").
- [MAJOR] time-needed S1: bug-trap = build-star = Description Example 2 (narrated); predict-output = Example 1.
- [MINOR] time-needed S1: "-1 minutes" nonsense distractor; feedback uses "reachable".
- [MINOR] time-needed S1: "useful traversal graph" jargon in relation-rule prompt.
- [MINOR] time-needed S1: drawings carry no times so they cannot help answer any build.
- [MINOR] time-needed S1: slug feedback ("the count edge as unit time bug" …).
- [MAJOR] time-needed S2: "Correct output" for a minutes problem wants `[0,1,2]` employee list.
- [BLOCKER] time-needed S4: cases 1 and 3 require secret labels "head 0, delay 1", "manager 1, delay 5", "employee 3"…; case 2 uses plain IDs.
- [MAJOR] time-needed S4: case 3 proof text unreadable ("Nodes: head 0, delay 2, manager 1, delay 3, …").
- [MAJOR] time-needed S4: three identical cases; code never builds a graph; case 2 = Step 1 build-branch.
- [MINOR] time-needed S4: "should" distractors with "changing this input's returned value" tail.
- [MINOR] time-needed cross: graphRules are input-specific ("1→4, from manager 1 down to direct report 4").
- [MAJOR] water-and-jug harness: all four steps crashed; nothing verified in the UI.
- [BLOCKER] water-and-jug S1: hidden graphs are arbitrary partial subgraphs (no empties, unstated stopping rule; remedial-3 lacks (0,0); remedial-2 has isolated (0,2); build-sum vs Step 4 case 2 require different graphs for the same input).
- [MAJOR] water-and-jug S1: predict-output/bug-trap are Description Examples 1–2; correct choice paraphrases the Description; fragment choices.
- [MINOR] water-and-jug S1: slug feedback incl. "the ignore gcd restriction bug".
- [MAJOR] water-and-jug S2: "Correct output" for a true/false problem wants `["(0,0)","(1,0)"]` state list.
- [MAJOR] water-and-jug S2: wrong-start round needs a state unreachable from the fixed start (0,0), impossible in a real jug graph; legality never checked.
- [MINOR] water-and-jug S2: make-two-way witness needs a partially-filled state; no hint.
- [MAJOR] water-and-jug S3 (predicted): degree claims keyed against the partial canvases contradict the jug move rule.
- [BLOCKER] water-and-jug S4: case 3 requires "0,0" labels without parentheses; cases 1–2 and Step 1/3 use "(0,0)"; not normalised for state problems.
- [MAJOR] water-and-jug S4: exact drawings of 10/18/26 arrows (with empties) for code that never uses a graph, after Step 1 taught 4-edge partial graphs.
- [MINOR] water-and-jug S4: gcd unexplained; "for the shown graph" tail; three identical cases.
