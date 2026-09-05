# Batch rbatch-rerun findings

Scope: possible-bipartition, smallest-string-with-swaps, time-needed-to-inform-all-employees, water-and-jug-problem, word-search. Known systemic issues (SYSTEMIC-NOTES.md) are only reported where the instance is concrete. Every Step 1 build/remedial answer key and every Step 4 declared buggy output in this batch was re-derived (bipartition and word-search code executed with node; the others traced by hand).

## Possible Bipartition (`possible-bipartition`)

### Step 1
- **[MINOR] Q1's success text gives away Q8.** Q1 (`n = 4, dislikes = [[1,2],[1,3],[2,4]]`) shows after success: "A valid split is {1,4} and {2,3}; group sizes need not be prescribed." Q8 then asks the same input "For dislikes [1,2],[1,3],[2,4], which split works?" and the correct choice is "Group {1,4} and group {2,3}". Q9 likewise reuses Q2's triangle after "People 2 and 3 also dislike each other, forcing a contradiction." → Use fresh inputs for predict-output / bug-trap. (S1 Q8, Q9)
- **[MINOR] Q9 correct choice is the only verdict among three procedures.** "put 1 alone, then put both 2 and 3 opposite 1", "color 1 and 3 differently, then reuse 1's color for 2", "mark each person visited before checking already-colored neighbors" are algorithm steps; "the triangle cannot be colored with only two groups" is a conclusion, so it stands out. D is jargon ("mark … visited", "already-colored neighbors") for this student. → Make all four choices verdict+reason. (S1 Q9)
- **[MINOR] Q3 Picture D feedback uses directed wording on an undirected graph.** Displayed feedback: "This drops an item that still exists even when it has no outgoing move." Person 4 has a dislike edge; "outgoing move" means nothing here. (S1 Q3)
- Answer keys: all 4 builds and 5 remedials verified correct.

### Step 2
- **[MAJOR] "CORRECT OUTPUT" for a true/false problem wants a list of people.** The function returns true/false, but the grader wants `[1,2]` (people the coloring reached from the "first person colored"). Nothing on screen says so; a literal student types `true`. → Relabel "People reached by the correct search" and add a format hint. (S2 all)
- **[MAJOR] Q2 requires drawing the identical graph twice.** Jasmine "keeps only the last branch it sees"; grader: "character's graph must be exactly: UNDIRECTED · nodes: 1, 2, 3, 4 · edges: 1—2, 1—3, 3—4" = drawing 1. But the prompt says "Draw two graphs: first the correct graph, then Jasmine's graph using the mistake." The student will change drawing 2 and fail. → Say "Jasmine's graph is the same picture; only her search differs — copy it exactly." (S2 Q2)
- **[MINOR] Start label duplicated:** "CHOOSE THE FIRST PERSON COLORED" followed by "first person colored". (S2 all)

### Step 3
- **[MINOR] Wrong-answer feedback starts with "Right."** After answering the direct-vs-reach claim wrong the × line reads "Right. A multi-step route through 2 creates reachability, not a new direct edge." (Q1 v0, v1, v2, Q5). → Drop the leading "Right."/"Correct." in the wrong-review list. (S3 Q1, Q5)
- **[MINOR] Degree feedback only restates the claim.** Claim "2 has exactly 2 direct neighbors." → feedback "2 has 2 direct neighbors." with no pointer to the two edges. (S3 Q1 v2, Q4, Q5)
- Claims verified true/false as keyed; membership rules here don't name absent values.

### Step 4
- **[BLOCKER] Hidden labels "person N" contradict the taught format.** Step 1/3 guide: "Use each node's 1-based number only. Example: 2." Step 4 shows no guide and the code uses bare numbers, yet every case requires exactly "person 1", "person 2", … : case 1 "person 1"–"person 5", case 2 "person 1"–"person 6" (person 6 isolated), case 3 "person 1"–"person 7" (person 7 isolated). A student drawing "1", "2", … only sees "× The drawing has every exact node". → Relabel canvases to bare numbers. (S4 cases 1–3)
- **[MAJOR] All three cases are the same question.** Identical code, same bug "A disconnected dislike group is ignored", identical diagnosis choices, same correct choice "It colors only person 1's connected component for the shown graph." Case 1's input is Step 1 Q4's input (answer false already shown). Cases 2–3 test nothing new. (S4 cases 2, 3)
- **[MINOR] "Changed graph" describes an unchanged graph.** Cases 2–3: "Changed graph: Nodes: person 1, … Direct edges: person 1—person 2; …" — the bug changes where coloring starts, not the graph. "the source-repo reference solution returns false" is jargon. (S4 cases 2, 3)
- **[MINOR] Distractors are phrased as fixes, the answer as a description.** "Person labels should be converted to zero-based indexes…" and "Each dislike should point only from the first person to the second." vs "It colors only…". (S4 all)
- Declared outputs verified by running the code: `true`,`true`,`true`; real answers `false`.

### Cross-step / other
- **[MINOR] Label format per step:** Step 1/3 "1"; Step 2 "1" (accepted); Step 4 "person 1".

## Smallest String With Swaps (`smallest-string-with-swaps`)

### Step 1
- **[MINOR] Q7 and Q9 repeat build questions whose answers were already shown.** Q7 (`s = "dcab", pairs = [[0,3],[1,2]]` → "bacd") = Q1's input/answer after "Each pair is a separate component…". Q9 (`[[0,3],[1,2],[0,2]]` → "abcd") = Q3's; its stem "Adding pair [0,2] connects all four indices." states the reason. (S1 Q7, Q9)
- **[MINOR] Q2 Picture D feedback "…even when it has no outgoing move"** on an undirected swap graph. (S1 Q2)
- Keys verified: "bacd", "abcd", "cba", "aba"; remedials "ab", "abc", "abc", "cdab", "abcd".

### Step 2
- **[MAJOR] Step 1's node names are rejected and there is no string.** Probe with "0:d","1:c","2:a","3:b" → "Use numeric IDs 0, 1, 2, ... with no gaps." Step 1 and Step 3 both say "Name each position index:letter … Do not add spaces." Step 2 shows no guide and wants bare "0","1". There is no `s` in Step 2, so "CHOOSE THE POSITION TO GROUP" refers to positions of a string that does not exist. → Show a Step 2 label guide and explain the drawing is only the swap graph. (S2 all)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1]` (positions reached), not a string.** The problem returns a string; nothing explains the switch. (S2 all)
- **[MINOR] Q3 Zachary's wrong position (1) is only revealed in Drawing 2's title;** the student must pick a graph where 0 and 1 reach different sets before knowing 1 is the wrong start. (S2 Q3)

### Step 3
- **[MAJOR] Membership claim names a letter absent from the input.** Input `s = "cba"`, claim: "Use this node rule for the graph: “The distinct letters d, c, a, and b, without their positions.”" There is no d. (S3 Q1 v0)
- **[MINOR] "Right."/"Correct." leading wrong-answer feedback:** Q2 "Right. A multi-step route through 1:b…", Q3 "Correct. The mini-example lists 2:b—3:a…". (S3 Q2, Q3)
- **[MINOR] Degree feedback restates the claim** ("2:a has 1 direct neighbor."). (S3 Q1 v2)

### Step 4
- **[BLOCKER] Hidden label format changes between cases and none is shown.** Case 1 requires "index 0: b", "index 1: a"; case 2 requires "0:d","1:c","2:a","3:b" (the Step 1 format); case 3 requires "index 0: c", "index 1: b", "index 2: a". A student who passes case 2 with the taught format fails cases 1 and 3 with only "× The drawing has every exact node". → Use `index:letter` on every canvas. (S4 cases 1, 3)
- **[MAJOR] Graph-proof "Code rule" is factually wrong in cases 2 and 3.** All three show "Code rule: Only arrow 1→0 is stored, and component discovery starts at index 0." Case 2 input `pairs = [[0,3],[1,2],[0,2]]` has no pair [1,0]; the stored arrows are 0→3, 1→2, 0→2. Case 3 stores 2→1 and 1→0. → Per-case rule: "Only the arrow first→second of each pair is stored." (S4 cases 2, 3)
- **[MAJOR] Three cases, one bug.** Same code, same bug "Swap pairs are treated as one-way", same correct choice "A swap pair must connect both indexes in one component on the shown input." Case 2's input is Step 1 Q3 (answer known). (S4 cases 2, 3)
- **[MINOR] Hard-to-parse text:** boundary "The pair is written opposite the ascending scan direction."; distractor "The pair may be used only once, so components should not be formed in this case." (S4 case 1)
- **[MINOR] Output must be a double-quoted string:** `ba` and `'ba'` rejected, only `"ba"`; placeholder "Example: false, 3, or [1, 2]" shows no string example. (S4 all)
- Declared outputs verified by trace: `"ba"`, `"acbd"`, `"cba"`.

### Cross-step / other
- **[MAJOR] One node, three label formats:** Step 1/3 "0:d"; Step 2 "0"; Step 4 "index 0: b" (cases 1, 3) or "0:d" (case 2).

## Time Needed to Inform All Employees (`time-needed-to-inform-all-employees`)

### Step 1
- **[MAJOR] Q7's input violates the problem statement, making the key debatable.** Description: "Employees with no reports have informTime[i] == 0." Q7 shows `n = 1, headID = 0, manager = [-1], informTime = [4]` and keys "0 minutes". A common accepted solution that records `time + informTime[i]` when visiting a node returns 4 on this input; the statement's own constraint excludes it. → Use `informTime = [0]` (the Description's Example 1) or say explicitly "the head's 4 minutes are never spent because nobody is waiting". (S1 Q7)
- **[MINOR] Q8 restates Q1 with the answer in the stem.** "Head 2 needs 1 minute and directly manages all five other employees. Total time?" is Q1's input, whose success text was "The head informs direct reports in parallel, so all hear after one minute." (S1 Q8)
- **[MINOR] Q5 wording/distractor.** "which arrow should appear in the useful traversal graph?" — "useful traversal graph" is undefined. Distractor A "4→1 because the manager array points employee 4 at boss 1." is a defensible model (walking up also solves it); its own feedback concedes "That is how the input is read". → Ask "which arrow lets the news flow downward?" (S1 Q5)
- Keys verified: 1, 6, 5, 0; remedials 2, 0, 3, 7, 4.

### Step 2
- **[MAJOR] Hidden rule: the chosen head must be the root of the drawing.** Probe rejected with "The chosen company head must be the graph root." Nothing before Check says the drawing must be a tree with no arrow into the chosen head. → State it under the start field. (S2 Q1)
- **[MAJOR] Q3 requires the identical graph twice.** Brayden "stops after one hop"; grader: "character's graph must be exactly: DIRECTED · nodes: 0, 1, 2 · edges: 0→1, 1→2" = drawing 1, but the prompt says "then Brayden's graph using the mistake." (S2 Q3)
- **[MAJOR] "CORRECT OUTPUT" wants `[0,1,2]` (employees reached), not minutes.** The problem returns a number; no hint. (S2 all)

### Step 3
- **[MINOR] Wrong-answer feedback begins "Correct."**: "× Correct. The mini-example lists 1→0 as one direct edge." shown after a wrong answer. (S3 Q1 v0, v1; Q4, Q5)
- **[MINOR] Q1 is trivial and its feedback only restates.** Two nodes, one edge: "0 has exactly 0 outgoing direct edges." → "0 has 0 outgoing direct edges." (S3 Q1)
- Claims verified as keyed.

### Step 4
- **[BLOCKER] Hidden labels are comma-containing phrases in cases 1 and 3, bare numbers in case 2.** Case 1 requires exactly "head 0, delay 1", "manager 1, delay 5", "manager 2, delay 1", "employee 3", "employee 4"; case 3 requires "head 0, delay 2", "manager 1, delay 3", "manager 2, delay 4", "employee 3", "employee 4", "employee 5"; case 2 requires "0"–"4". No guide shown. → Bare numbers everywhere. (S4 cases 1, 3)
- **[MAJOR] Case 3 proof text is unreadable because labels contain commas.** "Changed graph: Nodes: head 0, delay 2, manager 1, delay 3, manager 2, delay 4, employee 3, employee 4, employee 5. Direct arrows: head 0, delay 2→manager 1, delay 3; …" — the student cannot tell where one name ends. (S4 case 3)
- **[MAJOR] Three cases, one bug, and the code has no graph to reason about.** The 10-line loop sums positive `informTime`; all cases key "It sums delays from separate branches instead of taking the slowest root-to-leaf path." Case 2 input = Step 1 Q6 (answer 5 known). "Reachable boundary: The head has two branches that receive information concurrently." is not a boundary. (S4 cases 2, 3)
- **[MINOR] Both distractors end "…changing this input's returned value." and the correct choice does not** — predictable. (S4 all)
- Declared outputs verified: 7/6, 7/5, 9/6.

### Cross-step / other
- **[MAJOR] Label formats:** Step 1/3 "2"; Step 2 "2"; Step 4 "manager 2, delay 1" (cases 1, 3).

## Water and Jug Problem (`water-and-jug-problem`)

### Step 1
- **[BLOCKER] Builds are graded against arbitrary partial state graphs that contradict the lesson's own edge rule.** Q6's correct rule: an edge exists "When one legal fill, empty, or pour operation changes the first state into the second." gradeCanvas requires the sorted node list and edge list to match exactly, yet:
  - Q1 (2, 3, target 1) requires nodes (0,0),(2,0),(0,3),(2,3),(0,2),(2,1) and edges (0,0)→(2,0), (0,0)→(0,3), (2,0)→(2,3), (2,0)→(0,2), (0,3)→(2,3), (0,3)→(2,1). Legal moves it forbids: (2,0)→(0,0) (empty jug 1), (0,3)→(0,0), every move out of (2,3), (0,2), (2,1), and the reachable states (2,2), (1,3), (1,0), (0,1). Full graph: 10 nodes / 34 edges.
  - Q5 (1, 2, target 3) requires 4 nodes / 4 edges; omits pours (1,0)→(0,1), (0,2)→(1,1) and empties back to (0,0). Full graph: 6 nodes / 18 edges — exactly what Step 4 case 2 demands for the same input.
  - Q8 (3, 5, target 0) requires ONLY the node "(0,0)" with no edges, while the exact-picture remedial (3, 5, target 5) requires (0,0)→(3,0) and (0,0)→(0,5).
  - relation-rule remedial (2, 3, target 1) requires just "(0,3)", "(2,1)" with edge (0,3)→(2,1) and no (0,0) — the same input Q1 graded as 6 nodes.
  - core-rule remedial (2, 3, target 2) requires nodes (0,0),(2,0),(0,2) with the single edge (0,0)→(2,0): (0,2) is isolated with nothing leading to it.
  - bug-trap remedial (4, 8, target 3) requires node (4,8) with no edges although (4,0)→(4,8) and (0,8)→(4,8) are fills.
  The implicit convention (BFS-order forward edges, stop when the target appears) is never stated; the screen says only "1 · Draw the graph". A student who applies the taught rule fails every build. → Either grade the complete reachable graph (as Step 4 does) with "draw every legal move", or state exactly which moves to draw. (S1 Q1, Q2, Q5, Q8 + all remedials)
- **[MAJOR] Q7 and Q9 distractors are true statements.** Q7 "Which graph reasoning is correct for this case?" (3, 5, target 4) offers "neither jug has capacity 4" and "3+5 is not 4" — both literally true. Q9 (2, 6, target 5) offers "only because 5 is larger than jug 1". Choices are lowercase fragments with no verdict attached. → "The answer is true because…" / "false because…". (S1 Q7, Q9)
- **[MINOR] Q7/Q9 are the Description's Examples 1 and 2,** whose explanations give the reasoning ("Every reachable amount is a multiple of 2, so 5 liters is impossible" ≈ Q9's correct "every reachable amount remains even"). (S1 Q7, Q9)
- **[MINOR] Q3 Picture B feedback "This picture drops a connection that appears in the input."** — the input is three numbers; no connections appear in it. (S1 Q3)

### Step 2
- **[MAJOR] Outputs must be JSON arrays of quoted state strings** (`["(0,0)"]`); probes `(0,0)`, `{(0,0)}`, `[(0,0)]` rejected. No hint anywhere; the problem itself returns true/false. (S2 all)
- **[MINOR] "CHOOSE THE STARTING STATE" is read-only and prefilled "(0,0)".** Label says choose; the student cannot. (S2 all)
- **[MINOR] Q2 Austin's wrong start "(0,1)" is only revealed in Drawing 2's title.** (S2 Q2)

### Step 3
- **[BLOCKER] Degree claims are keyed to the hand-picked partial graph and are false under the problem's rules.**
  - Q1 (4, 6, 5): "(0,6) has exactly 1 outgoing direct edge." keyed YES — real moves from (0,6): fill→(4,6), empty→(0,0), pour→(4,2) = 3. "(4,2) has exactly 1 outgoing direct edge." keyed YES — real = 4. v2 feedback "(2,0) has 0 outgoing direct edges." — real = 4.
  - Q4 (2, 3, 2): "(2,0) has exactly 0 outgoing direct edges." keyed YES — real: (2,3), (0,0), (0,2) = 3.
  - Q5 (2, 3, 1): "(2,1) has exactly 0 outgoing direct edges." keyed YES — real: (2,3), (0,1), (2,0), (0,3) = 4.
  - Q3 (3, 5, 5) feedback "(0,5) has 0 outgoing direct edges." — real = 3.
  A student who knows the jug moves answers correctly and is marked wrong. (S3 Q1, Q3, Q4, Q5)
- **[BLOCKER] Required graphs are the same arbitrary fragments:** Q5 (2, 3, 1) wants only "(0,3)", "(2,1)" + one edge (no start state); Q4 wants an isolated (0,2); Q2 (4, 8, 3) wants an edgeless (4,8). (S3 Q2, Q4, Q5)
- **[MAJOR] Membership claim quotes capacities not in the input.** Input 4 and 6; claim: "It would be a mistake to use this node rule: “One node for capacity 3 and one node for capacity 5.”" (S3 Q1 v0)
- **[MINOR] "Right." leading wrong-answer feedback** (Q1 v0, v1). (S3 Q1)

### Step 4
- **[BLOCKER] Case 3 hidden labels have no parentheses.** Required: "0,0", "0,1", "0,2", "0,3", "1,0", "1,1", "1,2", "1,3" with 26 arrows. Step 1/3 guide: "Name a state (jug1Amount,jug2Amount). Example: (2,3)." and cases 1–2 require "(0,0)". `normalizeNodeLabel` strips parentheses only when `usesGridCellLabels()` (visualKind "grid" or kattis-getting-gold), so "(0,0)" ≠ "0,0" and case 3 cannot be passed with the taught format. The proof text "Nodes: 0,0, 0,1, 0,2, …" is unreadable too. → Relabel to "(0,0)". (S4 case 3)
- **[BLOCKER] Step 4 requires the COMPLETE state graph that Step 1 rejected.** Case 1 text: "The complete reachable state graph has four amount pairs … with every legal fill, empty, and pour transition shown." Case 2 (1, 2, target 3) requires 6 nodes / 18 arrows; Step 1 Q5, same input, required 4 nodes / 4 arrows. Case 3 requires 8 nodes / 26 arrows drawn exactly (verified complete by enumeration). Nothing says the convention changed. (S4 cases 1–3)
- **[MAJOR] The code is gcd arithmetic, not a search, and three cases share one bug.** Same correct choice "It rejects targets above the larger jug instead of above the two-jug total." in all three; case 2 input = Step 1 Q5. (S4 cases 2, 3)
- **[MINOR] Distractor states a false rule as a diagnosis:** "Filling a jug directly is not an allowed move, changing this input's returned value."; "The gcd test should require target to equal the gcd for the shown graph." is jargon. (S4 all)
- Declared outputs verified: `false` ×3 (target > larger jug); real answers `true`.

### Cross-step / other
- **[BLOCKER] Same input, different "correct" graphs:** (2, 3, 1) → 6 nodes (S1 Q1) vs 2 nodes (S1 relation remedial, S3 Q5); (1, 2, 3) → 4 nodes / 4 edges (S1 Q5) vs 6 nodes / 18 edges (S4 case 2).

## Word Search (`word-search`)

### Step 1
- **[BLOCKER] Builds grade a hidden directed "word-step" graph that contradicts the taught edge rule.** Q7's correct answer (and Step 3's "Use this graph model" panel) says EDGES = "Connections only between cells sharing a side". The required drawings are DIRECTED and keep only side-steps whose letters are consecutive letters of the word:
  - Q1 board [[A,B],[D,C]], "ABC": only (0,0)→(0,1), (0,1)→(1,1); side pairs (0,0)—(1,0), (1,0)—(1,1) must be left out.
  - Q4 board [[A,X],[X,B]], "AB": 4 nodes and NO edges, although every cell has two side neighbors.
  - Q2 board [[A,B]], "ABA": only (0,0)→(0,1); B→A omitted.
  - core-rule remedial [[A,A]], "AA": only (0,0)→(0,1) — (0,1)→(0,0) is an equally valid A→A step; the direction is arbitrary.
  The screen says only "1 · Draw the graph". A student drawing the side grid as taught fails every build. → State "draw an arrow for each move that spells the next letter", or grade the plain side grid. (S1 Q1, Q2, Q4, remedials)
- **[MINOR] Q8/Q9 answers are printed in the Description tab.** Example 1's explanation "walk right to 'B', right to 'C', down to 'C', down to 'E', then left to 'D'" is Q8's correct choice; Example 2's "walk down to 'E' and left to 'E'" is Q9's. (S1 Q8, Q9)
- **[MINOR] Q3 Picture B feedback "drops a connection that appears in the input"** — a board lists no connections. (S1 Q3)
- Keys verified: true, false, false, true; remedials true ×5.

### Step 2
- **[MAJOR] Step 1's directed drawing is rejected.** Probe → "Use two-way edges." Steps 1/3 required arrows; Step 2 silently requires undirected and only says so after Check. (S2 Q1)
- **[MAJOR] "CHOOSE THE WORD'S FIRST CELL" with no word or board.** Step 2 has no letters; the student invents bare coordinate nodes. "CORRECT OUTPUT" wants `["(0,0)","(0,1)"]` (cells reached), not true/false, and `[(0,0)]` is rejected. (S2 all)
- **[MINOR] Q1 Aidan: "diagonal" is decided from the coordinates in the labels,** so the two nodes must be named as real diagonal cells (e.g. (0,0) and (1,1)); not stated. (S2 Q1)

### Step 3
- **[BLOCKER] Keys/feedback contradict the on-screen graph model.** The panel shown after a wrong graph says EDGES = "Connections only between cells sharing a side", yet: Q1 [[A,B],[B,C]] v2 "(1,0) has exactly 2 outgoing direct edges." keyed NO, feedback "(1,0) has 1 outgoing direct edge." — (1,0) shares sides with (0,0) and (1,1). Q5 [[A,B,X],[B,C,X]] feedback "(0,2) has 0 outgoing direct edges." — (0,2) touches (0,1) and (1,2); the required graph omits (0,1)—(0,2), (1,1)—(1,2), (0,2)—(1,2). Q2 [[C,A,T]] feedback "(0,1) has 1 outgoing direct edge." — it touches two cells. (S3 Q1, Q2, Q5)
- **[BLOCKER] Q3 [[A,A]], "AA" requires (0,0)→(0,1) only;** (0,1)→(0,0) is equally an A→A move. Unguessable direction. (S3 Q3)
- **[MAJOR] Membership claims quote "such as C, CA, and CAT"** on boards with no CAT (Q1 [[A,B],[B,C]]) or no C at all (Q4 [[D],[O],[G]]). (S3 Q1 v2, Q4)
- **[MINOR] "Right." leading wrong-answer feedback** (Q1 v0, v1; Q4). (S3 Q1, Q4)

### Step 4
- **[BLOCKER] Step 4 requires the UNDIRECTED full side grid — the opposite of Steps 1/3.** Case 2 board [[B,A],[A,A]] requires exactly (0,0)—(0,1), (0,0)—(1,0), (0,1)—(1,1), (1,0)—(1,1) undirected; case 1 requires all 12 side edges of the 3×3 board. A student drawing Step 1-style arrows (A→A, A→B steps only) fails both the edge check and "The drawing uses the problem's direction". Nothing says the convention changed. (S4 cases 1–3)
- **[MAJOR] Three cases, one bug.** Same code, same bug "Cells stay blocked after a failed path", same correct choice "The visited set is global instead of belonging only to the current candidate path." Cases 2 and 3 are the same 2×2 board with B renamed to C. (S4 cases 2, 3)
- Declared outputs verified by running the code: `false` ×3; real answers `true`.

### Cross-step / other
- **[BLOCKER] Edge convention flips across steps:** Step 1/3 directed word-steps → Step 2 undirected → Step 4 undirected full grid.

## One-line summary of every finding in this batch
- [MINOR] possible-bipartition S1: Q1 success text "A valid split is {1,4} and {2,3}" gives away Q8; Q9 reuses Q2's input.
- [MINOR] possible-bipartition S1: Q9 correct choice is the only verdict among three procedure-style distractors.
- [MINOR] possible-bipartition S1: Q3 Picture D feedback says "no outgoing move" on an undirected graph.
- [MAJOR] possible-bipartition S2: "CORRECT OUTPUT" wants `[1,2]` for a true/false problem, no hint.
- [MAJOR] possible-bipartition S2: Q2 (last-branch) requires drawing 2 identical to drawing 1 while telling the student to draw "using the mistake".
- [MINOR] possible-bipartition S2: start label duplicated ("CHOOSE THE FIRST PERSON COLORED / first person colored").
- [MINOR] possible-bipartition S3: wrong-answer feedback starts with "Right."; degree feedback just restates the claim.
- [BLOCKER] possible-bipartition S4: hidden labels "person 1"–"person 7" vs taught "Use each node's 1-based number only"; no guide.
- [MAJOR] possible-bipartition S4: three cases share one bug/code/diagnosis; case 1 input = S1 Q4.
- [MINOR] possible-bipartition S4: "Changed graph" line lists an unchanged graph; "should"-phrased distractors stand out.
- [MINOR] smallest-string-with-swaps S1: Q7/Q9 repeat Q1/Q3 inputs whose answers were shown; Q9 stem states the reason.
- [MINOR] smallest-string-with-swaps S1: Q2 Picture D feedback "no outgoing move" on an undirected graph.
- [MAJOR] smallest-string-with-swaps S2: Step 1 labels "0:d" rejected ("Use numeric IDs 0, 1, 2, ... with no gaps."); no string exists in Step 2.
- [MAJOR] smallest-string-with-swaps S2: "CORRECT OUTPUT" wants `[0,1]` positions, not a string.
- [MINOR] smallest-string-with-swaps S2: Q3 wrong position (1) only revealed in Drawing 2's title.
- [MAJOR] smallest-string-with-swaps S3: Q1 v0 membership claim names letter d for input "cba".
- [MINOR] smallest-string-with-swaps S3: "Right."/"Correct." leading wrong-answer feedback; restating degree feedback.
- [BLOCKER] smallest-string-with-swaps S4: hidden labels "index 0: b" (cases 1, 3) vs "0:d" (case 2); no guide.
- [MAJOR] smallest-string-with-swaps S4: "Code rule: Only arrow 1→0 is stored" is false for cases 2 and 3.
- [MAJOR] smallest-string-with-swaps S4: three cases share one bug/code/diagnosis; case 2 input = S1 Q3.
- [MINOR] smallest-string-with-swaps S4: opaque boundary/distractor text; output must be `"ba"` with double quotes, placeholder shows no string example.
- [MAJOR] smallest-string-with-swaps cross-step: one node has three label formats across steps.
- [MAJOR] time-needed-to-inform-all-employees S1: Q7 input `informTime = [4]` for a leaf violates "Employees with no reports have informTime[i] == 0"; key 0 is debatable.
- [MINOR] time-needed-to-inform-all-employees S1: Q8 restates Q1 with the answer in the stem.
- [MINOR] time-needed-to-inform-all-employees S1: Q5 "useful traversal graph" undefined; distractor 4→1 is a defensible model.
- [MAJOR] time-needed-to-inform-all-employees S2: hidden rule "The chosen company head must be the graph root." only after Check.
- [MAJOR] time-needed-to-inform-all-employees S2: Q3 (shallow-search) requires identical drawing 2 while saying "using the mistake".
- [MAJOR] time-needed-to-inform-all-employees S2: "CORRECT OUTPUT" wants `[0,1,2]` employees, not minutes.
- [MINOR] time-needed-to-inform-all-employees S3: "Correct." leading wrong-answer feedback; Q1 trivial with restating feedback.
- [BLOCKER] time-needed-to-inform-all-employees S4: hidden labels "head 0, delay 1"/"manager 1, delay 5"/"employee 3" (cases 1, 3) vs "0" (case 2); no guide.
- [MAJOR] time-needed-to-inform-all-employees S4: case 3 proof text unreadable because labels contain commas.
- [MAJOR] time-needed-to-inform-all-employees S4: three cases share one bug; code has no graph; case 2 input = S1 Q6.
- [MINOR] time-needed-to-inform-all-employees S4: both distractors end "…changing this input's returned value."
- [MAJOR] time-needed-to-inform-all-employees cross-step: label format flips to "manager 2, delay 1" in Step 4.
- [BLOCKER] water-and-jug-problem S1: builds require arbitrary partial state graphs (Q1 6/6 of 10/34, Q5 4/4 of 6/18, Q8 single node, remedials with isolated/absent states) contradicting the taught "one legal move = edge" rule.
- [MAJOR] water-and-jug-problem S1: Q7/Q9 distractors "neither jug has capacity 4", "3+5 is not 4" are true statements; choices carry no verdict.
- [MINOR] water-and-jug-problem S1: Q7/Q9 are Description Examples 1–2 with the reasoning printed; Q3 feedback "connection that appears in the input".
- [MAJOR] water-and-jug-problem S2: outputs must be `["(0,0)"]` quoted JSON; no hint.
- [MINOR] water-and-jug-problem S2: "CHOOSE THE STARTING STATE" is read-only; Austin's start "(0,1)" only in Drawing 2 title.
- [BLOCKER] water-and-jug-problem S3: degree claims keyed to partial graphs are false under jug rules (e.g. "(0,6) has exactly 1 outgoing direct edge." keyed YES, real 3; "(2,0) has exactly 0" keyed YES, real 3; "(2,1) has exactly 0" keyed YES, real 4).
- [BLOCKER] water-and-jug-problem S3: required graphs are fragments (Q5 no (0,0); Q4 isolated (0,2); Q2 edgeless (4,8)).
- [MAJOR] water-and-jug-problem S3: Q1 membership claim quotes capacities 3 and 5 for input 4 and 6.
- [MINOR] water-and-jug-problem S3: "Right." leading wrong-answer feedback.
- [BLOCKER] water-and-jug-problem S4: case 3 hidden labels "0,0" without parentheses; normalization is grid-only so "(0,0)" never matches.
- [BLOCKER] water-and-jug-problem S4: requires the complete state graph (case 2: 6 nodes/18 arrows) that Step 1 rejected for the same input.
- [MAJOR] water-and-jug-problem S4: gcd code has no search; three cases share one bug; case 2 input = S1 Q5.
- [MINOR] water-and-jug-problem S4: distractor "Filling a jug directly is not an allowed move…" states a false rule; gcd distractor is jargon.
- [BLOCKER] water-and-jug-problem cross-step: same input has different "correct" graphs in S1/S3/S4.
- [BLOCKER] word-search S1: builds grade a hidden directed word-step graph (Q4 4 nodes/0 edges; Q1 omits side pairs) contradicting the taught "cells sharing a side" rule; [[A,A]] direction arbitrary.
- [MINOR] word-search S1: Q8/Q9 answers printed in Description examples; Q3 feedback "connection that appears in the input".
- [MAJOR] word-search S2: Step 1's directed drawing rejected with "Use two-way edges." only after Check.
- [MAJOR] word-search S2: "CHOOSE THE WORD'S FIRST CELL" with no word/board; output wants quoted cell list, not true/false.
- [MINOR] word-search S2: Q1 diagonal detection relies on coordinate labels; not stated.
- [BLOCKER] word-search S3: keys/feedback contradict the shown "sharing a side" model (e.g. "(1,0) has 1 outgoing direct edge." for [[A,B],[B,C]]; "(0,2) has 0" for [[A,B,X],[B,C,X]]).
- [BLOCKER] word-search S3: Q3 [[A,A]] requires (0,0)→(0,1) only; reverse is equally valid.
- [MAJOR] word-search S3: membership claims quote "C, CA, and CAT" on boards without them.
- [MINOR] word-search S3: "Right." leading wrong-answer feedback.
- [BLOCKER] word-search S4: requires undirected full side grid (case 2: four edges; case 1: twelve), opposite of Steps 1/3 arrows.
- [MAJOR] word-search S4: three cases share one bug; cases 2 and 3 are the same board with B renamed C.
- [BLOCKER] word-search cross-step: edge convention flips directed word-steps → undirected → undirected full grid.
