# Astra improvements audit

Reviewed September 4, 2026. Findings only: no app fixes or deployments.

## Variant Chrome audit — coverage complete

**Final scope: 25/25 Variant lessons fully exercised in Chrome.** This includes every step and every wrong-answer repair; blocked tasks and false passes are explained below. Tested lessons: After the Big Resignation, Busiest Shelf Level, Counting Constellations, Counting Docked Boats, Detour for Coffee, Dig New Wells, Gas Pocket Survey, Gold and Silver Lights, Gold in the Locked Dungeon, Hiking Around the Flood, Longest Freight Train, No Transfers Please, Office Rumor, Package to the Outpost, Perfect-Size Campsites, Routes to the Summit, Runes on the Castle Door, Coins on Level K, Save the Date, Shut the Valve, Biggest Study Group, Kth Song in Playlist, Top of the Pile, Trusted Courier Networks, and The Night Guard's Keyring (Museum Vault Keyring). Earlier findings from Original/New lessons are retained as historical notes, not unfinished work in the final scope.

### Variant completion checkpoint: Busiest Shelf Level

The two missing correct Step 1 choices now passed in Chrome: Picture A preserves the entire nesting tree, and every array plus every integer needs a node. The first build was replayed correctly with output 2. The missing Step 2 Chase case was tested using items=[1,[2,3]], with identical full directed trees in both drawings. Correct output 2 and wrong buggy output 2 produced only a cross for the buggy output; revising that output to 1 passed. Thus the feedback identifies the field but does not explain that Chase sees only the top-level integer. The hint still incorrectly requests a list despite requiring depth numbers (already covered by V01). All remaining Step 1 paths and Steps 3–4 were tested earlier; Amelia's impossible case and Diego's case are recorded below. All planned cases have now been exercised, though the UI cannot finish Amelia's exercise legitimately.

### Variant completion checkpoint: After the Big Resignation

The five previously missing correct Step 1 answers were submitted in Chrome and accepted: the exact chart (10→2, 10→7, 2→15), every employee as a node, boss→report arrows, sorted survivors [7,10], and leaf-case survivors [1,6,8]. All four graph builds were replayed successfully. The finish screen showed 9/9. Together with the earlier wrong-answer, repair, and Steps 2–4 records below, this completes this lesson's planned Chrome coverage. No new defect appeared in this replay.

The final Chrome pass exercised every authored task in the 25 Variant lessons: four Step 1 builds, five visual questions and all five wrong-answer repair builds per lesson; all three Step 2 counterexamples; all five Step 3 graph claims; and all three Step 4 code cases. Correct answers and representative believable mistakes were submitted. Where a grader rejects a correct answer or an authored goal is impossible, the failure is recorded as blocked—not passed. Deliberate incorrect submissions that turn green are recorded as false passes. This is complete task coverage, not a claim that every possible drawing or every distractor was tried.

Important exceptions: Busiest Shelf Level and Counting Constellations have impossible authored counterexamples (V01–V02). Longest Freight Train and Perfect-Size Campsites each reject correct graphs in two code cases (L63, L72). Hiking Around the Flood's stated blocked-branch goal disagrees with its grader (L61). Runes has incomplete-code and illegal-node false passes (V05, L76). These defects were reproduced; completion of the audit does not mean these lessons can be completed correctly by a student.

Subagents contributed earlier Chrome testing. They later stopped at a service usage limit, and the main reviewer completed the remaining Variant lessons alone. Earlier Original/New reviews below are historical and outside the final narrowed scope. Old “pending” or “in progress” ledger entries are dated checkpoints; later completion records supersede them.

The main risks are impossible exercises, valid answers marked wrong, graph rules that change between steps, and feedback that teaches the wrong reason. The final section is one short, priority-ordered bullet for each numbered finding. Repeated defects are grouped with their affected questions in the detailed sections.

## Earlier review history and evidence limits

Three subagents reviewed the original, variant, and new groups: all 75 lessons. Together they inspected 300 Step 1 builds, 375 visual checks, 375 repair builds, 225 Step 2 cases, the shared Step 3 generator and its 375 source builds, and 235 Step 4 cases. The group tables below show coverage. A source-content review means reading and reasoning about the question, answer, and grading contract; it does not mean every possible student input was tried.

After the request to favor computer use, the main reviewer and two subagents used actual Chrome tabs, clicking nodes, connecting edges, entering answers, and trying plausible mistakes. No hidden answer/state injection was used in these manual sessions. Live examples include bomb-node answers, reversed-arrow repairs, shelf counterexamples, constellation graph claims, Boolean code diagnoses, Flood Fill, and the checks recorded in each group's Chrome notes.

Before that change of approach, existing validators reported 75 structurally valid lessons and 235 matching Step 4 executions/reference outputs. An instrumented browser run finished Steps 1, 3, and 4 for six original lessons: All Paths, Battleships, Course Schedule, Detonate Bombs, Evaluate Division, and Find if Path Exists. A separate run submitted generated Step 2 examples for a few originals. Both runs were stopped when requested. Their cancellation messages are not app defects, and their remaining lessons are not counted as browser-tested. Passing a stored answer is also not independent proof that the answer is right; N01 demonstrates a faulty reference check.

**Final evidence limit:** all authored Variant tasks were exercised in Chrome as summarized above and in the submission records. Original/New coverage remains partial in Chrome and is not part of the final completion claim. No finite sample proves that every student-designed graph grades correctly. Source-only findings remain labeled as such; live findings record actual inputs and feedback. Findings describe the version observed during testing; later external changes may alter them. No app fixes were made.

## Priority and evidence

- **P0:** a valid task cannot be completed.
- **P1:** wrong answers, unfair grading, contradictory rules, or lost work.
- **P2:** unclear or weak teaching, poor feedback, or missing useful practice.
- **P3:** small wording or presentation issues.

Locations use problem URL IDs and authored case/check IDs so the fixing agent can find them. A lesson lives at `https://sss-jonathan-attempt.netlify.app/<problem-id>`; append `?section=2`, `3`, or `4` for that step. File/function references describe the workspace at the time of the earlier source review, including pre-existing uncommitted changes. Later Chrome observations are the strongest evidence for the displayed behavior; source-only findings still need verification when fixing a newer version.

Resource limits: the earlier extra automated browser processes were stopped. Parallel manual work used at most three agent Chrome tabs. The final solo pass reused one audit tab. Periodic system-wide memory-free readings during the final pass were 53%, 40%, and 45%; no additional browser workers were launched. These are point-in-time checks, not a continuous performance guarantee.

## How to read repeated findings

Some shared causes appear in several groups because their examples need different repairs. In particular O03/V20/N15 cover duplicate Boolean answers; O04/V21/N14 cover generic array corruption; O06/V19/N16 cover unexplained numeric choices; V08/N09/G07 cover values that disagree with the drawing; V16/N20 cover predictable Step 3 answers. Treat these as families of issues when planning fixes, while preserving each concrete example.

## Shared browser and grading findings

### G01 — P2: Step 4 never asks the student to predict the correct solution's output

Location: all Step 4 cases; `renderReasoningRound` and `checkReasoning`, `visual-library.js`.

The student draws the correct graph, enters only the incorrect code's return value, and selects a diagnosis. The real correct output is revealed after success. A student can therefore pass without independently translating the correct graph back into the original problem's answer. This is a teaching gap, not a claim that the current form rejects a correct-output field: that field does not exist. Consider asking for both results when their comparison is the lesson's goal. In N01, the bad correct answer is shown in feedback; it is not an answer the student currently submits.

### G02 — P1: Refresh loses the student's drawings and answers but keeps reassuring badges

Live Chrome reproduction: Counting Constellations, Step 2 round 3. Draw `(0,0)` and `(1,1)` with their two-way edge, duplicate that graph, choose start `(0,0)`, and enter 1 in both output boxes. After submission the graph and both predictions pass individually. Refresh the tab. Both graphs and the typed fields disappear, yet the page still shows `matching graph`, `predict the bug`, and `predict the truth` as proven, and remembers the correction count.

The shared `graph.js:setContext` always starts a blank drawing; progress storage saves counters rather than the work. This is particularly costly for two hand-drawn graphs and large marker forms. Save the complete draft per problem/case, restore it together, and tie badges to the current draft. Explain any intentional reset before losing work. This report did not modify user settings or clear browser storage during the manual Chrome tests.

### G03 — P2: Later steps have no simple route back to earlier learning

Live Chrome headers: Step 2 offers only `Next: Step 3`; Step 3 only `Next: Step 4`; Step 4 only `Back to Step 3`. The Step 4/Step 3 pair sends a student back and forth, without an in-lesson Step 1 or Step 2 button. The user can use browser history, revisit the picker, or edit the URL, but those are poor substitutes when a confused student needs the earlier explanation. Show a compact four-step navigation with the current step marked. Keep progress and drafts when switching.

### G04 — P2: Graph feedback reports broad failures without locating the small mistake

Live Chrome: Counting Constellations Step 3 question 1, input `[[1,0],[0,1]]`. Add a node (the editor calls it `0`), answer No, and submit. Feedback says both `Every exact node is drawn` and `Every exact direct edge is drawn` failed. It does not separate an invalid name from a missing node or tell the student which relationship needs checking. The shared grader makes `edges` false whenever `nodes` is false, so one naming typo can look like multiple graph mistakes, even with correct connections.

Give a small targeted hint: invalid label format, duplicate name, missing input item, extra node, or a particular edge to reconsider. Keep the full answer hidden before submission; useful error locations do not require giving away the whole model. This affects Steps 1, 3, and 4; Step 2's generic `drawing exactly shows the mistake` failure has the same limitation.

### G05 — P2: The small-screen layout puts a large optional editor before the question

Observed in Chrome at a 500×746 viewport. In Detonate the Maximum Bombs, the header and progress card use much of the screen; then the input, naming guide, toolbar, and drawing canvas appear before the question and choices. For optional visual checks, a student must scroll past a large empty tool before seeing what is being asked. The original problem is on a separate bottom tab, so checking its rules means switching views as well.

Preserve the required input → optional drawing → question order, but reduce unused editor height or offer a clearly labeled compact/expandable scratch area. Keep the question and relevant rule easy to consult while drawing. This is a tested small-screen issue; it is not a claim that every desktop layout has the same problem.

### G06 — P2: A failed Step 4 check clears a correct diagnosis unnecessarily

Location: `checkReasoning` failure branch. Every failed submission sets `selectedId=null` and unselects all diagnosis options, even when the diagnosis check passed and only an edge or output needs repair. Students must choose the same diagnosis again before rechecking. The live Boolean-tree test also showed the diagnosis selection disappearing after submission.

Keep unchanged correct answers selected while the student fixes the failed part. Clear an answer only when the question or input changes. The feedback should tell the student which part to fix instead of making them repeat unrelated work.

### G07 — P1: Step 2 can ignore a wrong weight written on the drawing

Source-confirmed in `checkCounterexample`: both graph checks use nodes, edges, direction, and colors, but omit the grader's `labels` result. Calculations instead read the separate semantic marker fields. Thus a road or ratio can have one value typed on its drawn edge and another in the marker form, without the graph check reporting the disagreement. The same risk applies to the second drawing.

This is the edge version of the node-value disagreements in V08/N09. Choose one authoritative value, render it on the graph, or compare the drawing's visible value against the field. Preserve any valid fraction/decimal equivalence.

Now confirmed in Chrome: Save the Date, Step 2 Jordyn/reverse. Correct drawing0→1 and buggy drawing1→0 both had weight7, while fields said head0 waits1day, listener1 waits0days, deadline1. Outputs2/1 passed with every graph check green. The drawn seven-day delay contradicts the one-day calculation. A replay with matching weight1 also passed. Derive labels from the fields or reject inconsistent labels.

---

## Original lesson audit

Scope: all 25 original lessons. This is a read-only audit; no app files were changed. Findings below refer to the generated runtime content in `visual-data.js` unless explicitly labeled as an authoring-only problem.

## Coverage and limits

- Read all 100 Step 1 build decisions, all 125 visual checks and their choices/feedback, and all 125 remedial build decisions.
- Independently checked the expected build/remedial outputs against the source repository's reference solutions: 206 of 225 compared directly; the other 19 needed manual interpretation because they return a count/prose instead of the function's exact type, use renamed parameters, or expose the empty-list depth disagreement described below. This was not 225 independent end-to-end browser solves.
- Read all 75 Step 2 case goals, result types, label rules, and problem-specific fields. Read relevant runtime validation and calculation functions. The parent agent owns current Chrome interaction; do not describe this as 75 completed human-like Step 2 solves.
- Read the shared Step 3 generation logic. It creates five checks from Step 1 remedials, and its membership answer is always No. Detailed current browser coverage is owned by the parent report.
- Read all 80 original Step 4 snippets, inputs, diagnoses, and declared outputs. Completed existing code-execution validators: all original shown-code outputs matched their declarations, and all original declared correct Step 4 outputs matched source-repo reference solutions. This establishes numerical agreement, not that the questions are pedagogically good or that source references are infallible.
- The earlier headless audit harness was stale and was stopped; none of its incomplete work is counted as successful new browser coverage.

Each row covers 4 Step 1 builds + 5 checks + 5 remedials, 3 Step 2 cases, 5 generated Step 3 checks, and the listed number of Step 4 cases. “Shared” means the shared findings still apply, not that the lesson was cleared of all possible issues.

| Problem ID | Step 4 cases | Specific findings below |
|---|---:|---|
| all-paths-from-source-to-target | 3 | O04, O08, O14 |
| battleships-in-a-board | 3 | O05, O08, O09 |
| course-schedule | 3 | O03, O08, O09, O13 |
| detonate-the-maximum-bombs | 3 | O01, O08, O09, O12, O15 |
| evaluate-division | 4 | O07, O09, O16 |
| find-if-path-exists-in-graph | 3 | O03, O08 |
| flatten-nested-list-iterator | 3 | O04, O08, O17 |
| is-graph-bipartite | 3 | O03, O09, O13 |
| keys-and-rooms | 3 | O03, O08 |
| kill-process | 3 | O04, O08 |
| letter-combinations-of-a-phone-number | 3 | O06, O08, O09, O17 |
| longest-increasing-path-in-a-matrix | 4 | O08, O18 |
| minesweeper | 3 | O04, O08, O09, O17 |
| nested-list-weight-sum | 3 | O05, O08 |
| nested-list-weight-sum-ii | 3 | O05, O08, O10, O11 |
| network-delay-time | 4 | O08 |
| number-of-connected-components-in-an-undirected-graph | 3 | O08 |
| number-of-increasing-paths-in-a-grid | 4 | O08, O18 |
| number-of-islands | 3 | O08, O19 |
| number-of-provinces | 3 | O08, O09 |
| possible-bipartition | 3 | O02, O03, O08, O13 |
| smallest-string-with-swaps | 3 | O04, O08, O19 |
| time-needed-to-inform-all-employees | 3 | O06, O08 |
| water-and-jug-problem | 3 | O03, O08, O10, O20 |
| word-search | 4 | O03, O08, O17 |

## Findings

### Additional live Chrome verification, September 4

Used one actual Chrome tab through computer use; closed it after finishing. No headless browser, page-code execution, or graph injection was used. Navigation skips below do not count as solved questions.

1. **O05, Nested List Weight Sum wrong-answer feedback — confirmed by submission.** Opened `/nested-list-weight-sum`, skipped forward through earlier tasks to the visual check for `nestedList=[[1,1],2,[1,1]]`. Selected `8` and pressed **Check answer**. The page displayed **Contradiction found. CORRECT CHOICE 10** and **Your choice: This gives the top-level 2 the same depth-2 weight as inner values.** That described mistake calculates 12, not 8. The UI then required **Build a fresh proof** and said the revealed answer does not count. This confirms the arithmetic-feedback defect is on the live deployed site, not merely local authoring data.

2. **O02, Possible Bipartition impossible bridge goal — confirmed by full manual graph submission.** Opened `/possible-bipartition?section=2`, skipped the first two cases, and reached Luke's final-link case. The live goal read **Make the last dislike edge connect a person not otherwise reached.** Manually pressed **Add node** twice to create nodes 1 and 2, clicked the two nodes to draw edge 1—2 (#1), and entered start 1. Switched to Luke's graph, pressed **Duplicate graph from #1**, selected the edge, and deleted it. Entered `true` for both real and buggy outputs and pressed **Check my graph**. These are the correct outputs: one edge can be two-colored, as can two isolated nodes. The page returned **The contradiction is not complete yet.** Its checklist passed internal consistency, problem graph rules, the exact buggy drawing, and **both predicted outputs**; only **The graph exposes the mistake** failed. Thus the student can follow the stated goal exactly and solve both outputs correctly but still be refused completion. The feedback supplies no explanation that a bridge cannot change bipartiteness and does not direct the student to an odd cycle.

These are two submitted live probes, not two complete lessons. No progress was reset, no app files were changed, and the audit tab was closed.

### O01 — P1: a correct bomb-node answer is marked wrong

Location: `detonate-the-maximum-bombs`, Step 1 `core-rule`, wrong choice `Only bombs that could be chosen as the first detonation should be nodes.` The statement allows choosing any bomb. Therefore this choice includes exactly all bombs, just like the intended answer. Its own feedback says, `Every bomb can be a start and can also be reached later in a chain, so every bomb needs a node.` That is evidence for the selected answer, not evidence against it. A thoughtful student can be punished for applying the statement correctly. Replace the option with an actually different node rule, such as keeping only bombs with a nonempty outgoing blast list.

### O02 — P1: a Step 2 goal cannot change the requested bipartition answer

Location: `possible-bipartition`, Step 2 `drop-last-edge` / “Final conflict omitted.” Goal: `Make the last dislike edge connect a person not otherwise reached.` The requested result is whether a valid bipartition exists. Connecting a previously unreached person by one edge is a bridge to a new person; removing that bridge never changes whether the graph is bipartite. If the rest is bipartite, the new person takes the opposite color; if the rest has an odd cycle, removing this bridge does not repair it. Thus a student following the literal goal can produce different reached nodes but identical true/false answers. The goal should require the last edge to close an odd cycle, as the analogous `is-graph-bipartite` case already does. Verify the exact failure message in Chrome and distinguish “nodes differ” from “function output differs.”

### O03 — P2: duplicated Boolean answers violate the distractor rules

Location: all nine build/remedial decisions in each of `course-schedule`, `find-if-path-exists-in-graph`, `is-graph-bipartite`, `keys-and-rooms`, `possible-bipartition`, `water-and-jug-problem`, and `word-search`: 63 decisions. Typical choices are `true`, `false`, and `false — use the false fallback without searching`; or `false`, `true`, and `true — return success before checking the graph`.

The prompt asks what the function returns. Two choices give the same output; the extra explanation is attached only to one wrong answer. This does not test three distinct outputs or three equally expressed reasoning claims. It also makes the bare opposite Boolean the only sensible competing answer, turning the third option into filler. Use two output choices, or make every option a full claim with a different realistic reason. This directly conflicts with rubric item 6.

### O04 — P2: many wrong outputs are mechanically corrupted rather than believable

Locations and concrete examples:

- `all-paths-from-source-to-target`: build decisions and several remedials append the first correct path a second time; `core-rule` and `relation-rule` remedials offer `[0]` where the return type is an array of paths. There is no distinct branching or visited-state mechanism behind that flat result.
- `flatten-nested-list-iterator`: nine decisions repeatedly append the first integer to the correct result. This is monotonous and often independent of the specific input's nesting mistake.
- `kill-process`: every build/remedial decision offers the correct process list with its first process duplicated, including `[9,9]` for a leaf kill. All nine third answers test the same generic extra-visit story.
- `smallest-string-with-swaps`: `build-no-pairs` offers `"cbaa"` for input `"cba"`; `build-repeat` offers `"abaa"` for `"baa"`; the first remedial offers `"abb"` for `"ba"`. Swaps preserve length and the multiset of letters. These choices can be discarded without reasoning about connected components. They distract from the intended graph concept.
- `minesweeper`: matrix-answer builds/remedials offer a copy of a whole output row appended to the board, changing its dimensions. Other remedials offer `no result — stop before visiting the start`. These are generic corruption, not realistic reveal-boundary outcomes.

Prefer real alternative algorithms: an incorrect global visited set, breadth-first flattening, one-level expansion, sorting only a subgroup, counting diagonal mines, or continuing through numbered squares. The existing repeated “adds the first reached item a second time” feedback should identify the code/graph mistake that would actually create it.

### O05 — P1: some feedback explains a different arithmetic result from the selected answer

- `nested-list-weight-sum`, Step 1 `predict-output`, input `[[1,1],2,[1,1]]`: wrong `8` says the top-level 2 was also given depth 2. That calculation is four ones ×2 plus 2×2 = **12**, not 8. Wrong `12` says top-level integers start at depth 2; shifting every integer down one level gives four ones ×3 plus 2×2 = **16**, not 12. The intended 10 is correct, but both explanations teach incorrect arithmetic. 8 could represent omitting the outer 2; 12 could represent flattening all values to depth 2.
- `nested-list-weight-sum-ii`, Step 1 `predict-output`, same input: wrong `12` is explained as giving deeper integers larger weights. The standard ordinary-depth error produces **10**, already another option. Specify exactly which wrong weights produce 12 or replace it.
- `battleships-in-a-board`, Step 1 `predict-output`, wrong `3 ships`: feedback says the vertical three cells form one ship, not three. Counting those three separately **and** the isolated X gives four ships. Three requires an additional omission or a different specific grouping, not the single mistake described.

### O06 — P2: arbitrary numbers have no credible mistake behind them

- `letter-combinations-of-a-phone-number`, Step 1 `predict-output` for `digits="23"`: wrong 8 is explained by `Digits 2 and 3 each map to three letters, not four.` Three×three=9; three×four=12; four×four=16. None explains 8. A realistic 8-answer bug would omit one combination, with a concrete reason.
- `time-needed-to-inform-all-employees`, Step 1 `predict-output` for a single employee with time 0: wrong choices are 1, 4, and -1 minutes. All three get essentially the same feedback. Four comes from no input quantity or plausible graph rule. Use a richer case if three distractors are required.
- Many numeric build/remedial third choices are the correct count plus one, even beyond the maximum possible count (for example two bombs with choices 2,1,3; one bomb with choices 1,0,2; a four-cell path with a five-cell answer). Counting a start twice can be a real bug, but repeating this default without a matching mechanism makes the questions easy to eliminate and gives little information about understanding.

### O07 — P1: several Division Step 4 “one-bug” snippets contain other independent failures

Location: `evaluate-division`, Step 4:

- `adds-ratios`: accepts only exactly two equations whose first source and second destination happen to match the query; it adds their numbers without checking that the middle variables connect, handles only the first query, and returns -1 for everything else. Fixing `+` to `*` does not make this a ratio-graph solution. Example independent failure: equations a/b=2 and c/d=3, query a/d would be returned as a connected product/sum despite disjoint variables.
- `no-identity-query`: rejects known self-queries but also implements only one direct forward equation, no reverse ratio, no path, and only the first query. Removing the self-query rejection still leaves several graph mistakes.
- `unknown-identity-is-one`: aside from same-name queries, it returns -1 even for a valid direct a/b query. There is no ratio traversal to repair after moving the known-variable check.

The declared outputs on shown inputs are correct; the defect is that these are partial ad hoc functions rather than one realistic broken solution each. Use a correct shared ratio traversal and change one rule per case. This is especially important because students are being asked for a graph-level diagnosis of code that mostly does not construct or traverse a graph.

### O08 — P2: large parts of Step 1 and Step 4 repeat templates and give thin feedback

Across all 25 originals, the first `exact-picture` check uses essentially identical choices and feedback: omit an edge, reverse direction, omit a node. The failure text says only `This picture drops a connection that appears in the input` or `This drops an item that still exists even when it has no outgoing move.` It does not name the missing endpoints or explain why the particular item exists. On some pictures the removed node actually has an outgoing relation, making the “no outgoing move” explanation irrelevant.

The four builds commonly repeat `What should the function return?`; the five visual checks frequently reuse the same raw input from build 1 and the node/edge examples. For example the All Paths diamond appears in build 1 and four main visual checks. This tests recall of a practiced answer as much as transfer.

The two added Step 4 cases in many originals have proof fields like `The input structure shown has 4 nodes and 4 direct connections` and `The chosen values make [bug title] change which nodes, paths, or values contribute.` Wrong-diagnosis feedback says `That is a different possible mistake` and repeats the correct bug title. Neither gives the case's missing/reversed boundary or identifies the concrete contradiction in the selected claim. This falls short of the required `code rule → changed graph → reachable boundary → returned value` explanation. Name the particular node/edge/path/value that changes for each case.

Step 4 answer phrasing also reveals the key: many added-case correct options are long explanatory sentences while both wrong options are terse titles of the other cases (often with odd title capitalization). Examples include All Paths `first-branch-only`, Kill Process `children-without-kill`, Increasing Paths `counts-cells-only`, and Swaps `sorts-whole-string`. Rewrite all options to comparable length and precision.

### O09 — P1: added Step 4 cases can be shallow, ambiguous, or contain a second bug

- `detonate-the-maximum-bombs/direct-hits-only`: `(otherX !== x || otherY !== y)` identifies “self” by coordinates, so a distinct bomb at the same center is also excluded. That is a second node-identity bug in addition to stopping at direct hits. Use array indices to exclude only the current bomb.
- `letter-combinations-of-a-phone-number/three-letters-for-seven-nine`: returns `[""]` for empty input because it lacks the required empty-input guard, an independent second bug beyond the omitted fourth letter.
- `minesweeper/counts-all-mines`: the snippet also never spreads a blank and writes `"0"` instead of `"B"` on a mine-free click. Replacing whole-board mine count with a local count still would not produce the shown correct board. `mine-click-becomes-blank` returns the unchanged board for every E click. Use the full working reveal procedure with one changed rule per case.
- `is-graph-bipartite/rejects-any-cycle`: the function checks only whether total edge count is less than total node count. This is not an actual “reject any cycle” algorithm on disconnected graphs: a triangle plus an isolated node passes 3<4. The diagnosis/title overstates what the code does. A genuine DFS cycle detector that wrongly rejects even cycles would isolate the intended mistake.
- `number-of-provinces/direct-from-zero`: on the identity-matrix input, the intended wrong count is 1, and the supposedly wrong diagnosis `only city 0's province is counted` accurately describes the observed behavior too. The accepted choice is a general statement about components rather than a precise description of counting the 1 entries in row 0. Choose an input with multiple direct neighbors and a farther city so “count direct neighbors” differs clearly from “count just the first component.”
- `course-schedule/edge-means-cycle`, `number-of-increasing-paths-in-a-grid/counts-cells-only`, and `number-of-islands/counts-land-cells` are one-line output shortcuts. They can be useful beginner checks, but are not all “deep” code reasoning after three earlier steps of the same concept. Consider replacing a shortcut with a realistic small DFS error while keeping the simpler check in Step 1.

### O10 — P2: authoritative files still contain wrong jug answers that are patched only during build

`visual-lessons-original.json`, water-and-jug remedials for `relation-rule`, `predict-output`, and `bug-trap` contain keys/feedback that contradict real reachability (2/2 target3 cannot be measured; 1/2 target3 and 1/3 target4 can). Runtime `visual-data.js` currently repairs these, so this is **not** a current student-facing wrong-answer finding. It is an authoring maintenance risk: a future agent reading the authoritative lesson file can preserve or propagate the wrong fact. Consolidate the correction into the actual authoring source and regenerate, instead of relying on late repair.

### O11 — P2: the source oracle disagrees with the inverse-depth lesson on empty lists

`nested-list-weight-sum-ii/build-empty-deep`: input `[1,[[]]]`; lesson returns 1, while the source-repo reference solution returned 3 in the independent comparison. The lesson is using the deepest integer, while the source function's breadth-first accumulation lets empty containers increase weight. This is not evidence that 1 should be changed to 3. The problem should explicitly define maximum integer depth; then repair or exclude the faulty source oracle from validation. Current source agreement checks do not exercise this edge case in Step 4, so “reference validated” misses it.

### O12 — P2: bomb practice inputs break the shown coordinate constraints

`detonate-the-maximum-bombs` statement constraints require `1 <= xi, yi, ri`, but most authored builds/remedials and several Step 4 inputs use coordinates `[0,0,...]`, `[4,0,...]`, etc. Translation leaves the geometric solution unchanged, so the intended exercise is easy to preserve: shift every center into the permitted positive coordinate range, or explicitly state that these practice examples also allow zero coordinates. Do not teach the student to ignore the provided input constraints.

### O13 — P2: several Step 2 goals target reached nodes but omit the property needed to change the real answer

- `course-schedule/first-branch`: goal asks for two unlocked branches, which can both remain acyclic. Missing a branch changes visits but not whether all courses can be completed. Require a hidden cycle on the skipped branch.
- `is-graph-bipartite/last-branch` and `possible-bipartition/last-branch`: goal says an earlier neighbor must be lost or matter, but a skipped tree branch does not change two-colorability. Require an odd-cycle conflict on the discarded part.
- `course-schedule/make-two-way`: says a reverse move “falsely unlocks a prerequisite.” The actual completion result is affected because making a prerequisite two-way creates a directed two-cycle. Teach that code-to-cycle-to-false chain instead of an unlocking story that does not state the graded output.

Students can satisfy the literal drawing instruction and still fail the output-difference requirement. Distinguish a changed traversal from a changed function result before asking them to invent an example.

### O14 — P2: an All Paths diagnosis does not quite describe its code

`all-paths-from-source-to-target/first-branch-only`: accepted claim says the search `returns as soon as one route reaches the target`. The code always takes adjacency index 0 and stops at a dead end even if that first path never reaches the target. It is not a full search with an early-success return. Use “follows only the first outgoing neighbor at every node” and explain that it never explores another branch even after failure.

### O15 — P2: bomb Step 2 loses the geometry that makes this problem different

Step 2 accepts numeric bomb IDs and arbitrary blast arrows but has no bomb centers/radii fields. Its goal asks for a small bomb inside a large bomb's range, but the student cannot supply or demonstrate those distances or radii. This reduces a geometric graph-building lesson to generic directed reachability; a hand-drawn graph need not be justified by any concrete bomb input. Add small center/radius inputs or clearly label this as a graph-only abstraction and do not claim it validates the real blast geometry.

### O16 — P3: Division's internal metadata still says weights are omitted

`evaluate-division.counterexampleLesson.vocabulary.edges` says `ratio arrows (weights omitted here)`. The same runtime spec requires an `edgeRatio` marker on every arrow and grades an ordered numerical division result. This is stale internal metadata; it was not confirmed as visible in the current browser. Remove “weights omitted here” so future authoring changes do not bring back the wrong instruction. This is a maintenance finding, not a confirmed student-facing contradiction.

### O17 — P2: inconsistent vocabulary and formatting increase avoidable work

- Phone Step 2 says use `ε`, while its fixed start and semantic parser use `empty prefix`; nested-list Step 2 describes `root`, while fixed start is `root=[]`. These may be normalized by the parser, but the instruction text should use the actual displayed accepted names consistently.
- `nested-list-weight-sum-ii/wrong-start` asks the student to “Select a nonfirst container” although the correct start is fixed at `root=[]`. The intended mistake is probably that the buggy traversal starts at `root[0]`; say that directly.
- Some Step 4 diagnoses read `makes take a square root`, `makes visit children`, `makes also kill`, or switch to Title Case inside a sentence. This distracts from code reasoning and makes weak options stand out.
- Step 4 added snippets have awkward multiline `for` headers with the initializer, condition, and update visibly split without indentation. It is legal JavaScript, but unnecessarily harder for a struggling student to scan.
- Flattening Step 4 `reverses-folder-contents` calls nested lists “folders” although the original task uses lists. Keep the analogy explicit or keep the original vocabulary.

### O18 — P2: increasing-grid Step 2 diagonal goals do not describe a complete matrix

`longest-increasing-path-in-a-matrix/add-diagonals` and `number-of-increasing-paths-in-a-grid/add-diagonals` ask for two diagonal cells with no side connection. Every position in the rectangular matrix is a node for these problems, unlike land-only islands. The spec supplies cell values but no row/column dimensions. The student can naturally submit just two diagonal nodes and never represent the other two positions of the 2×2 input. A valid full-matrix witness can be made with four cells and equal/blocking side values; ask for that and validate the rectangle, or explicitly state this exercise accepts a partial graph abstraction.

### O19 — P2: some prompts give away the graph conclusion

- `number-of-islands/predict-output`: “A bent patch of land stays side-connected throughout. How many islands is it?” The premise already says the whole patch is connected, so the student need not infer connectivity from the grid.
- `number-of-islands/bug-trap`: describes “a 2×2 land block, a diagonal lone land cell, and a separate two-cell pair” before asking how many islands. The words already partition the input into three groups.
- `smallest-string-with-swaps/bug-trap`: “Adding pair [0,2] connects all four indices.” Determining whether all indices connect is the useful graph step, but it is supplied. Ask the student to determine what changed from the raw pairs.

### O20 — P3: jug-node feedback uses a state impossible under the current capacities

`water-and-jug-problem/core-rule`, input capacities 1 and 3: the wrong “track only total” feedback compares states `(3,0)` and `(0,3)`. `(3,0)` exceeds jug 1's capacity. The general principle is right, but its example contradicts the displayed input. Use `(1,0)` and `(0,1)` with the same total and different next moves.

### O21 — P2: the bomb repair cannot expose the mistake that triggered it

Confirmed by the parent agent in live Chrome: choose reversed-arrow Picture C in `detonate-the-maximum-bombs/exact-picture`. The remedial input is `bombs=[[0,0,2],[2,0,5]]`. The centers are distance 2 apart and both radii reach the other center, so the correct graph has both A→B and B→A. Reversing all arrows leaves that graph unchanged. A student can keep the exact mistaken direction rule and pass the repair. Use a fresh asymmetric blast case to retest arrow direction. This also shows why a single generic remedial input for all four wrong-picture choices does not necessarily test the selected mistake.



---

## Variant lesson audit

This is a findings-only review of the 25 variant problems. No app files were changed. P0 means a student cannot pass valid work; P1 means wrong teaching/grading or contradictory requirements; P2 means a useful clarity or teaching improvement.

## Coverage and limits

Reviewed every variant's four Step 1 builds, five visual checks, and five remedial builds: 100 builds, 125 checks, 125 remedial builds. Reviewed all 75 Step 2 specifications and their shared grading functions. Inspected all 125 generated Step 3 claims. Reviewed inputs, outputs, and graph explanations for all 80 Step 4 cases (Shut the Garden Valve has eight; the other 24 have three). Existing execution and source-reference checks passed: declared buggy outputs match execution, and correct outputs match Jonathan's source solutions. That does not certify explanation quality, valid inputs, UI behavior, or independent correctness of the reference solution.

Short, read-only runtime probes confirmed the five results described under V01–V05 before the user asked to favor Chrome. No browser subprocess was started by this reviewer. Chrome interaction belongs to the main reviewer. This is not a claim that all variant questions were manually completed in Chrome, or that all Step 4 distractors were independently blind-solved.

| Problem ID | Step 1 | Step 2 | Step 3 | Step 4 |
|---|---:|---:|---:|---:|
| who-keeps-their-job | 4 + 5 + 5 | 3 | 5 | 3 |
| busiest-shelf-level | 4 + 5 + 5 | 3 | 5 | 3 |
| coins-on-level-k | 4 + 5 + 5 | 3 | 5 | 3 |
| counting-constellations | 4 + 5 + 5 | 3 | 5 | 3 |
| counting-docked-boats | 4 + 5 + 5 | 3 | 5 | 3 |
| routes-past-the-coffee-cart | 4 + 5 + 5 | 3 | 5 | 3 |
| villages-without-wells | 4 + 5 + 5 | 3 | 5 | 3 |
| gas-pocket-survey | 4 + 5 + 5 | 3 | 5 | 3 |
| gold-and-silver-lights | 4 + 5 + 5 | 3 | 5 | 3 |
| dungeon-gold-run | 4 + 5 + 5 | 3 | 5 | 3 |
| flooded-campsite-trails | 4 + 5 + 5 | 3 | 5 | 3 |
| longest-freight-train | 4 + 5 + 5 | 3 | 5 | 3 |
| one-color-metro-ride | 4 + 5 + 5 | 3 | 5 | 3 |
| office-rumor-reach | 4 + 5 + 5 | 3 | 5 | 3 |
| package-to-the-outpost | 4 + 5 + 5 | 3 | 5 | 3 |
| perfect-size-campsites | 4 + 5 + 5 | 3 | 5 | 3 |
| count-routes-to-summit | 4 + 5 + 5 | 3 | 5 | 3 |
| runes-on-the-castle-door | 4 + 5 + 5 | 3 | 5 | 3 |
| save-the-date-phone-chain | 4 + 5 + 5 | 3 | 5 | 3 |
| shut-the-garden-valve | 4 + 5 + 5 | 3 | 5 | 8 |
| biggest-study-group | 4 + 5 + 5 | 3 | 5 | 3 |
| kth-song-in-playlist | 4 + 5 + 5 | 3 | 5 | 3 |
| museum-vault-keyring | 4 + 5 + 5 | 3 | 5 | 3 |
| top-of-the-pile | 4 + 5 + 5 | 3 | 5 | 3 |
| trusted-courier-networks | 4 + 5 + 5 | 3 | 5 | 3 |

In the Step 1 column, counts mean builds + checks + remedial builds. Shared findings apply even when a row has no separate problem-specific defect below.

## Confirmed blocking and semantic defects

### V01 — P0: Busiest Shelf Level's reversed-arrow case has no answer that can pass

Location: `step2-specs-variant.json`, `busiest-shelf-level`, round 2, “Inside-out shelves”; `visual-library.js`, `counterResult` (`widest-level-index`, around line 1175), `counterOutputMatches` (around 1777).

Use nodes `root=[]`, `root[0]=5`, start `root=[]`, and edge root→item. Shape validation accepts this. The correct result is 1. Reversing the arrow strands every integer, so the result calculation has no occupied depth and returns `Number(undefined)`, which is `NaN`. A direct runtime probe produced `correct 1, buggy NaN`.

The number matcher requires `Number(studentText) === expected`. Nothing, including `NaN`, equals NaN. Therefore no typed answer can pass this round. This applies to every valid nesting tree under reversed containment, not only this witness. The main reviewer also confirmed it in live Chrome with `root[0]=7`: both drawings and correct output1 pass, while buggy0 and NaN are rejected. The live help incorrectly says “Type the list the real function returns.” Teach a defined buggy return value and make the displayed algorithm, formatter, and grader agree about it. Also provide the correct number-format help: `widest-level-index` is absent from the numeric-help list and currently falls through to list instructions.

### V02 — P0: Counting Constellations asks for an impossible counterexample

Location: `step2-specs-variant.json`, `counting-constellations`, round 3, “Distant stars falsely joined”; `validateExactGridAdjacency`, `mistakenGraph`.

The real problem already joins every side- or corner-touching star. Round 3 applies `add-diagonals`, asking for a corner link that incorrectly merges two groups. Every such link is already required in the correct graph. Validation rejects a drawing that omits it. A runtime probe with `(0,0)—(1,1)` returned 1 for both real and buggy counts. Adding existing edges cannot change components, so no valid witness can satisfy “outputs differ.” The main reviewer also reproduced this in live Chrome: two diagonal stars connected in both drawings, outputs 1 and 1. All five other checks passed; only “The graph exposes the mistake” failed. Replace this with a truly different star-grouping misconception.

### V03 — P1: Counting Docked Boats grades all boats, including undocked ones

Location: all three Step 2 rounds; `counterexampleLesson.input.result = component-count`; `counterResult` around line 1146.

The task asks for components that touch the grid border, but the adapter returns the number of all components. It collects neither grid dimensions nor a docked/border marker. The same isolated node `(1,1)` is interior in a 3×3 grid and on the bottom-right border in a 2×2 grid, so the submitted data cannot determine the requested answer. A probe accepted that node and returned 1. The correct result for the 3×3 interpretation is 0. Round 3 even asks students to make the final connection determine whether a boat reaches the border, which the grader cannot evaluate. Collect enough information to identify the border and count only qualifying components.

### V04 — P1: Boat and train counterexample goals break their own input guarantees

Location: `counting-docked-boats` Step 2 round 1 and `longest-freight-train` Step 2 round 1.

Both ask for two separate vehicles that touch at a corner. Both real statements explicitly forbid two different vehicles from touching, including diagonally. A student honoring the statement cannot build the requested witness; the shape validator accepts it anyway. The train probe with isolated `(0,0)` and `(1,1)` passed shape validation and returned 1 versus 2 after adding diagonals. The accepted input is invalid for the actual problem. Choose mistakes exposed by legal straight, separated vehicles. This also applies to any generated bent or branching vehicle shapes: side adjacency alone does not enforce straight one-cell-wide components.

### V05 — P1: Runes treats unfinished dead ends as complete returned codes

Location: `runes-on-the-castle-door`, all Step 2 rounds; `counterTerminalStrings`, around line 1392.

For `dials=["ab","b"]`, the full legal prefix graph has nodes `start,a,b,ab` and edges start→a, start→b, a→ab. The complete answer is `["ab"]`; `b` is an unfinished dead end because the second dial cannot repeat b. The runtime accepts this graph and returns `["b","ab"]`. With `last-branch` it returns `["b"]`, teaching the student to output an invalid one-letter code. The evaluator assumes “leaf” means “complete.” It needs the actual dial count and allowed runes, and must test completion separately from having children.

### V06 — P1: Runes cannot check whether the designed tree represents real dials

Location: Step 2 `nodeLabels: partial-string`, `validateProblemGraphShape` around line 1011.

Validation checks prefix-parent links, lowercase strings, maximum length, and adjacent repeats, but receives no dials. It can accept start→a, start→b, a→ac while omitting b→bc even though a second dial containing c would permit both. Thus a student can submit an incomplete correct graph and pass; missing-branch mistakes can be built into the supposedly correct input. Add the raw dial choices and require the complete legal prefix tree. This is separate from V05: even filtering leaves by length cannot detect missing legal branches without dial data.

### V07 — P1: Playlist results depend on the order edges were drawn

Location: `kth-song-in-playlist`, all Step 2 rounds; `counterMarkedTreeItems` around line 1331.

The real order comes from nested-array indexes. The evaluator builds child arrays in `graph.edges` order and walks them without sorting by index. Drawing root→`root[1]=20` before root→`root[0]=10` makes the correct traversal play 20 before 10, despite the labels representing `[10,20]`. With k=1, the real answer is 10. Drawing order should control the authored first/last-branch bug only where deliberately specified, not redefine the correct playlist.

Confirmed in Chrome with a valid two-folder playlist `[[1],[2]]`, k1. Created all five required nodes, but drew the root's folder1 edge before its folder0 edge. All graph checks passed. Real correct answer1 was rejected; changing it to2 produced “Counterexample confirmed” and “Correct function returns2.” The buggy last-drawn-branch output1 was accepted. Node paths and song fields still unambiguously represented index0/song1 and index1/song2.

### V08 — P1: Values can disagree between node names and extra value fields

Location: Step 2 `coins-on-level-k` (`coinValue`), `kth-song-in-playlist` (`songId`), `dungeon-gold-run` (`gold`), `shut-the-garden-valve` (`flow`); `parseCounterSemanticInputs` and `counterResult`.

The required names already encode values, such as `root[0]=7`, `0:5g`, and `7:10`. The form also asks students to enter those values separately. The sum/song evaluator uses markers rather than the value shown in the name, and the inspected validation does not reconcile them. A coin labeled 7 can be counted as 100. For coins and songs, markers are optional and can be omitted for a value node or supplied for a box. This permits wrong correct-output calculations and changes which objects count as items. Keep one source of truth, or reject inconsistent values and box/item assignments with a precise message.

### V09 — P1: Remaining employee IDs are accepted in the wrong order

Location: `who-keeps-their-job`, Step 2; `friendlyListMatches`, around 1759, and output help around 651.

The real task requires ascending numeric order, and Step 1 explicitly teaches that `[10,7]` is wrong when `[7,10]` is required. Step 2 sorts both submitted and expected arrays before comparing, so it accepts the same unsorted answer. Help says any allowed order is accepted without clarifying that this task has only one allowed ordering. Apply ordered comparison when the real output contract requires sorting.

### V10 — P1: Package to the Outpost accepts inputs outside its promised tree

Location: Step 2; `counterexampleRequiresTree` around 1075, and `shortest-path-weight`.

The source statement guarantees exactly n−1 roads and one route between every pair. The tree-required list omits this problem. As a result the ordinary graph validation can accept disconnected maps or cyclic maps, and the grader solves a shortest-path problem instead of the promised unique-route problem. Require a connected tree for the student's correct input. A broken graph may of course become disconnected after the stated bug; that is different from accepting an invalid original map.

## Wrong or ambiguous teaching content

### V11 — P1: A boat edge answer marked wrong is valid under the guarantees

Location: `counting-docked-boats`, Step 1 `concept-edge`, choice `straight-only`.

The rejected choice says to join horizontal neighbors for horizontal boats and vertical neighbors for vertical boats, deciding orientation first. Under the promised valid straight-boat layout, this creates exactly the same edges as joining all side-adjacent boat cells. There can be no perpendicular side neighbor from a separate boat. The method may be unnecessarily complicated, but it is not an incorrect edge model. Use a distractor that actually produces a different graph on valid input.

### V12 — P1: A courier node distractor includes every office because of diagonal scores

Location: `trusted-courier-networks`, Step 1 `concept-node`, choice `trusted-offices`.

It says “Only offices that have at least one trust score at or above k.” The statement guarantees `trust[i][i]=10`, and the shown k is 6. Every office has such a score, even an otherwise isolated one. The intended isolated-node omission does not happen under the literal wording. Say “with another office” or “off the diagonal,” and use an isolated office to expose the difference.

### V13 — P1: Courier visual checks contradict the required matrix diagonal

Location: `trusted-courier-networks`, Step 1 `concept-output` and `concept-counterexample` in `visual-lessons-variant.json`.

Both raw trust matrices contain zeros on the diagonal, while the statement guarantees every diagonal score is 10. Their component answers happen to remain valid when self-links are ignored, but a student checking assumptions encounters invalid examples. Repair the raw examples and keep self-link instructions explicit. The edge rule “trust[i][j]>=k” should also say i≠j when the strict grader omits self-loops.

### V14 — P1: The gold-bulb wrong-answer explanation does not produce its answer

Location: `gold-and-silver-lights`, Step 1 `concept-counterexample`, choice `two`.

Input: n=6, edges 0—1, 1—2, 1—4, 0—3, 3—5. Gold bulbs are {0,2,4,5}: four. The feedback for answer 2 says it forgot the starting bulb. Omitting the start gives 3, not 2. The correct choice has already been changed to 4, but this feedback still teaches the older count. Match each wrong number to the exact claimed error.

### V15 — P1: Step 3 feedback says “Yes” for false direction claims

Location: `directionClaim`; variant examples `counting-constellations`, `gas-pocket-survey`, `gold-and-silver-lights`, `flooded-campsite-trails`, `office-rumor-reach`, round 4.

Example: “The direct (0,1)—(0,2) connection works only from (0,1) to (0,2).” The stored answer is false, but feedback starts “Yes. This graph is undirected…” The main reviewer confirmed the contradiction in live Chrome: choosing Yes produced `× Yes. This graph is undirected...`. The rest explains the right rule, but the opening contradicts the verdict. Make the feedback explicitly reject one-way travel.

### V16 — P1: Every Step 3 membership answer is No

Location: `makeStructureClaims` and `nodeMembershipClaim` around 1893 and 1955.

All 25 variants' first claims are false because the factory always returns `correct:false`. The remaining pattern also gives exactly two Yes answers among the five claims. This creates a library-wide shortcut unrelated to understanding. Keep the required misconception-focused membership task, but vary whether the claim correctly rejects or incorrectly endorses that misconception, and vary the total Yes count.

### V17 — P2: Some Step 3 statements expose internal jargon instead of a clear misconception

Location: `count-routes-to-summit`, Step 3 round 1: “In this input, linear camps should be left out.” Its input is `graph=[[2],[],[]]`.

“Linear camps” is not a defined idea in the problem. It was produced from the identifier `omit-linear-camps`, rather than authored for this input. Say which kind of camp is being omitted, such as a camp with only one outgoing trail. The feedback should address that claim, not only repeat the whole node rule. Similarly, “well nodes” in `villages-without-wells` can sound like nodes for wells rather than villages that contain wells.

### V18 — P1: Busiest Shelf Level's code explanations confuse items, boxes, depths, and counts

Location: Step 4 cases `case-3` and `repair-3`.

`case-3` is titled “Adds box labels instead of counting boxes,” but integers are items; boxes are containers and should not be counted at all. Its explanation calls keeping the smaller depth a “wrong tie rule,” even though that tie rule is correct—the error is summing IDs. `repair-3` says “zero integer boxes,” calls integer 5 a box, and says 2 is the “correct maximum count.” For `items=[[],[5]]`, 2 is a depth and the item count is 1. These explanations directly blur the distinction the lesson should teach. Rename the quantities and explain that the buggy search stops before reaching the occupied depth.

## Repetition, weak distractors, and missing coverage

### V19 — P2: Many fallback wrong numbers have no specific student mistake

Location: widespread Step 1 builds/remedials, third choice `not-enough-information` now carrying another numeric answer.

Examples: `coins-on-level-k` single coin 7, k=1 offers 7/8/6; `shut-the-garden-valve` 50-liter subtree offers 50/40/51; `dungeon-gold-run` total15 offers15/6/16; `kth-song-in-playlist` song9 offers9/8/10; `perfect-size-campsites` zero matches offers0/1/−1. Feedback often just says the final calculation is off by 1. This is a result perturbation, not an identified algorithm mistake; some choices are impossible as counts or absent song IDs. Author each distractor by running a plausible wrong rule. Remove choices when there are only two meaningful answers.

### V20 — P2: Boolean questions repeat the same output with a generic invented explanation

Location: all four builds and five remedial builds for `flooded-campsite-trails` and `one-color-metro-ride`; also their output checks with multiple true/false explanations.

Typical choices are true / false / “false — use the false fallback without searching.” The final option is the same output as the second, with an arbitrary explanation. It violates the project's rule against repeated Boolean outputs, and students may interpret the task as selecting an output rather than diagnosing a reason. Ask for a route/reachable boundary or make the choices explicitly competing explanations instead.

### V21 — P2: Duplicate-result distractors are implausible on the provided trees

Location: `who-keeps-their-job` builds/remedials and `runes-on-the-castle-door` builds/remedials.

Examples: remaining sorted IDs `[7,10,7]` with a tree and unique employees; valid codes `["ab","ba","ab"]` where every prefix path is unique. Feedback says the first result was reached twice, without an actual repeated path or algorithm that causes it. The runes no-code case even offers `[0]`, which is not the promised string-list type. These are easy visual eliminations and weak preparation for plausible mistakes. Use wrong subtree boundaries, filtering mistakes, or legal-looking extra codes whose origin can be explained.

### V22 — P2: Several prompts give away the graph reasoning before asking

Location: `dungeon-gold-run` `concept-output` explicitly lists reached rooms and all collected values, and `concept-counterexample` states other rooms are unreachable; `routes-past-the-coffee-cart` output says three routes exist and two pass the cart, while its next check says the only customer route skips the checkpoint; `who-keeps-their-job` output/counterexample narrate the full org chart.

These can be appropriate worked examples, but as scored visual checks they reduce the skill to arithmetic or repeating the prompt. Show raw input and ask the student to infer the boundary. Keep the explanatory text for feedback.

### V23 — P2: The gas-survey builds never ask for the actual returned grid

Location: `gas-pocket-survey`, all four Step 1 builds and all five remedial builds.

Every decision asks only what label appears at the drilled cell, even when the case contains spreading. A student can pass by counting local gas neighbors without understanding recursive reveal, when to stop expanding, or which cells remain unchanged. Step 4 later asks for entire grids, creating a jump in skill. Include at least one small full-grid prediction with both safe expansion and numbered boundary cells.

### V24 — P2: “Fresh” remedial cases sometimes repeat a case the student already saw

Location: `longest-freight-train` repair-5 repeats build case-1 (`yard=["T..","...","..T"]`); `gold-and-silver-lights` repair-5 repeats case-3 (the five-node star); `shut-the-garden-valve` repair-2 repeats the later `concept-bug` input exactly; `kth-song-in-playlist` repair-3 repeats the later `concept-bug` input.

The first two are direct violations of the fresh-remedial goal; the latter two leak an answer to a later check. Use new raw data and preserve the intended mistake. Separately, all Step 3 inputs are taken from Step 1 remedial graphs, so a struggling student who saw all repairs gets no unseen graph-build transfer test in Step 3.

### V25 — P2: Closely repeated build cases use scarce practice slots

Location: `busiest-shelf-level` builds case-1 `[1,[2,3],[[4]]]` and case-3 `[[3,2],5,[[4]]]` both have the identical level-count pattern 1,2,1 and answer depth2. `routes-past-the-coffee-cart` has answer1 for all four build decisions and uses route counts even though the real function returns route lists. `trusted-courier-networks` all four builds use k6 and qualifying score7, so none tests equality at the boundary.

Use those slots for distinct reasoning: equal counts and tie handling, an empty valid route list versus multiple checkpoint routes, and a score exactly equal to k. Step 4 may cover some later, but that does not diversify the earlier builds.

### V26 — P2: Step 3 often checks easy generic graph facts instead of the lesson's important boundary

Location: `counting-docked-boats` round5 asks if one interior boat node reaches zero nodes; `runes-on-the-castle-door` round5 asks if a leaf reaches two nodes; `biggest-study-group` round5 uses a one-node input; `trusted-courier-networks` direction round has no edges.

The questions are mathematically answerable, but spend the fifth/fourth check on a near-trivial fact rather than docking qualification, incomplete versus complete prefixes, transitive group membership, or actual direction use. Preserve the required five categories while choosing inputs that expose the problem's particular misconception.

### V27 — P2: The single-start keyring editor omits the key feature of Museum Vault Keyring

Location: all Step 2 cases, `input.name: initial key`, `result: reached-count`.

The real task accepts `startKeys`, potentially several starting vaults or an empty keyring. Step 2 offers one chosen start, so students cannot design a counterexample about ignoring all but one starting key—the exact misconception later tested in Step 4. It can still represent a valid single-key subset of the task, so this is a coverage limitation rather than a wrong result on every accepted input. Support a list of starting keys and compute their union.

### V28 — P2: Trust-threshold counterexamples never expose trust-threshold mistakes

Location: `trusted-courier-networks`, all Step 2 rounds.

The editor takes already-selected edges with no trust matrix or k. It asks generic missing-edge/one-way/shallow-search questions, so it cannot test confusing `>=k` with `>k` or treating every positive score as trusted. These are central to this variant and are explicitly taught elsewhere. Accept scores and k so students can design that boundary themselves.

### V29 — P2: Two of the three gold-light code cases return the complementary color class

Location: `gold-and-silver-lights`, Step 4 `authored-deep-case` versus `case-3`.

One seeds bulb0 with silver; the other correctly colors but counts silver. Both use nearly identical stars and produce the count of all leaves instead of the center. The code errors are distinct, so this is not a duplicate-code defect, but two of three cases teach almost the same output distinction. A missing branch, disconnected assumptions, or failure to alternate across a longer path would test a broader skill.

### V30 — P2: Some feedback combines several possible mistakes instead of diagnosing one

Location: `counting-docked-boats` build/remedial `bug` choices use misconception `count-cells-or-check-one-border`; repair-1 answer3 says the student “either counts separate B cells or overlooks a border-touching component.”

For `marina=["BBB"]`, counting cells gives3, while overlooking a border component cannot give3. The feedback offers an unrelated second cause and does not tell the student which repair applies. Give each option one input-specific cause and the exact affected component.

### V31 — P2: Phone-chain edge feedback confuses reversed direction with using the wrong wait value

Location: `save-the-date-phone-chain`, Step 1 `concept-relations` remedial `repair-3`.

Input has head1, caller[0]=1, waits[1]=3 and waits[0]=0; question asks which day person0 hears. Correct is3. Wrong answer0 feedback says it reverses the edge and treats person0's wait as the edge cost. Reversing the sole edge makes person0 unreachable from head1; using the listener's wait on the correct edge gives0. These are distinct mistakes. Explain the listener-wait bug for0 and reserve reverse-direction feedback for an unreachable result.

### V32 — P2: Sprinkle edge wording implies adding the nonexistent feeder0

Location: `shut-the-garden-valve`, Step 1 `concept-relations`, prompt “For index i, what arrow is described by feeds[i] and ids[i]?” Correct choice is `feeds[i]→ids[i]` without excluding feeds[i]=0.

Zero means the main line, not a sprinkler node. Applying the stated rule at the root row adds 0→root, which the exact graph grader rejects. Say “for a sprinkler whose feeder is another sprinkler” or explicitly skip feeder0. The same exception belongs in the displayed general graph rule.

### V33 — P1: The smallest coffee build violates both size and checkpoint constraints

Location: `routes-past-the-coffee-cart`, Step1 build `case-4`: `roads=[[]], start=0, customer=0, coffeeCart=0`.

Jonathan's source and the runtime constraints require at least two intersections and an interior checkpoint (`1 <= checkpoint <= n−2`); in practice an interior checkpoint needs at least three. This build has one intersection and places the cart at both endpoints. Step2 explicitly rejects endpoint checkpoints, so the two steps disagree about valid inputs. Replace the build with a legal three-node route and state the actual minimum consistently.

### V34 — P2: Coordinate lessons create invalid default labels

Location: `counting-constellations`, Step3 drawing tool; shared editor behavior.

The main reviewer observed in live Chrome that Add node creates label `0`, while the visible requirement is `(row,column)`. A student following the ordinary add-node action creates a label the grader rejects. This adds rename work to every graph and makes the editor appear inconsistent with the instructions. The same problem was observed in Boolean Tree Step 4: Add node creates 0, 1, 2 while the guide requires index:value labels. Step 2 correctly creates coordinate defaults, so behavior also changes between steps. Use the lesson's name format for defaults, or ask for a valid name before adding the node.

### V35 — P2: “Try another check” is actually a retry of the same check

Location: `counting-constellations`, Step3, after a wrong answer; shared retry control.

The main reviewer confirmed in live Chrome that the action repeats the identical input and claim and keeps the drawing. That behavior is a reasonable retry, but the label promises another check. Say “Try again,” or supply a fresh equivalent question when saying “another.”



---

## New-problem audit

This is an issue report, not a fix. P1 means a wrong lesson or unfair grading; P2 means a confusing or weak exercise; P3 means polish. Findings below come from local runtime/authoring content and manual reasoning. Browser confirmation is owned by the main agent.

## Coverage and limits

Reviewed all 25 new problems: their statements/examples, all 100 Step 1 builds, 125 concept checks, 125 repair builds, all 75 Step 2 round descriptions and input contracts, and all 75 Step 4 inputs, declared outputs, diagnoses, and graph explanations. I manually checked the 225 build/repair graph node and edge lists against their inputs. Step 3 reuses the repair builds; I reviewed that generator and all 125 source builds, but did not individually play all 125 generated claims in a browser. I directly inspected selected Step 4 implementations, and ran the existing execution/reference validators before the user's preference for manual Chrome testing arrived. Both validators passed, but N01 shows why their pass does not prove correctness. No browser/test process was left running here.

The table's counts are inspected items, not a claim that each was played in the UI. Every row has 4 builds + 5 concept checks + 5 repairs, 3 Step 2 rounds, 5 Step 3 source builds, and 3 Step 4 cases.

| Problem ID | Specific findings, plus shared findings below |
|---|---|
| ten-kinds-of-people | N14, N17–N20, N27 |
| codewars-array-deep-count | N10, N16–N20, N25, N28 |
| gfg-grid-path-exists | N13, N15, N17–N20 |
| hackerrank-connected-cells | N12, N16–N20 |
| count-sub-islands | N16–N20, N24 |
| employee-importance | N09, N16–N20, N23 |
| evaluate-boolean-binary-tree | N01–N03, N15, N17–N20, N21 |
| usaco-fence-planning | N11, N16–N20 |
| find-all-groups-of-farmland | N07, N14, N17–N20 |
| flood-fill | N04, N14, N17–N20, N26 |
| kattis-getting-gold | N08, N16–N20, N22, N24 |
| ladder-takahashi | N16–N20 |
| structy-largest-component | N16, N18–N20, N29 |
| max-area-of-island | N16–N20 |
| structy-max-root-to-leaf-path-sum | N02, N16–N20 |
| maximum-number-of-fish-in-a-grid | N16–N20, N30 |
| usaco-milk-factory | N16–N20 |
| structy-minimum-island | N16–N20 |
| moocast | N05, N16–N20, N31 |
| path-sum | N02, N09, N15, N17–N20 |
| properties-graph | N06, N11, N16–N20 |
| reachable-nodes-with-restrictions | N11, N16–N20 |
| transitive-closure | N14, N17–N20 |
| structy-tree-sum | N02, N09, N16–N20, N32 |
| wheres-my-internet | N14, N17–N20 |

## Findings

### N01 — P1: Boolean Step 4's third case teaches a wrong real answer and does not expose its bug

Location: `step4-specs-new.json`, `evaluate-boolean-binary-tree`, `caseId: no-recursion`; same content in `visual-data.js`.

Input: `values=[3,1,2,0,1], edges=[[0,1],[0,2],[2,3],[2,4]]`. The drawn tree means `AND(true, OR(false, true))`, which is **true**. The shown buggy code reads `Boolean(root.left.val)` and `Boolean(root.right.val)`, producing `true && true`, also **true**. Yet the case declares `correctOutput: "false"`, `buggyOutput: "true"`, and teaches that the bug changed false to true. Step 1 case-4 correctly teaches true for this identical input. The main reviewer read this exact input and code in live Chrome. The false correct-output declaration is source-confirmed; the UI asks students only for the buggy output, so this is wrong teaching in the success explanation, not a rejected correct-output submission.

Expected: both real and buggy output are true on this input; choose another input to expose the missing recursion. Actual: the authoring data says the real answer is false. The independent reference validator misses it because its Boolean input parser builds a tree from `values` using a queue and ignores the explicitly supplied `edges`; this gives children to the node labeled as a true leaf. Add validation against the actual shown edges and require each case's real and buggy results to differ.

### N02 — P1: Tree numbering changes between steps without explaining the change

Locations: `visual-lessons-new.json`; `visual-library.js`, `validateProblemGraphShape`, numeric `tree-path` branch.

Boolean Step 1 case-3 and case-4 show children `3` and `4` under node `2`. Step 2 instead computes each parent as `Math.floor((index - 1) / 2)`, so nodes `3` and `4` must belong to node `1`. A student copying the same valid tree and names learned in Step 1 gets a parent error in Step 2. The guide merely says `levelOrderIndex`; it does not explain this alternate numbering scheme.

Related: `structy-tree-sum` repair-3 says `root level-order=[1,null,2,null,null,null,3]` and expects the chain 1→2→3, sum 6. That uses fixed complete-tree slots. Ordinary queue-based level-order input would make node 2 childless and leave the final 3 orphaned. The guide needs one explicit, consistent convention across `evaluate-boolean-binary-tree`, `path-sum`, `structy-tree-sum`, and `structy-max-root-to-leaf-path-sum`. Prefer explicit parent/child inputs when exact numbering is graded.

### N03 — P1: Boolean Step 4 rejects another true diagnosis

Location: `evaluate-boolean-binary-tree`, Step 4 `or-as-and`, diagnosis `other-and-as-or`.

The rejected choice says: “both internal operator values use the same boolean combination.” The shown code uses `leftChildValue && rightChildValue` for both operator cases, so this is true and describes the bug. Feedback says this is a different bug “not in this code.” The accepted OR-as-AND choice and this supposedly wrong choice overlap. Make the distractor specifically claim both operators use OR, or otherwise make its statement false. Confirmed in live Chrome: selecting that claim and entering false made the output check pass and the diagnosis check fail. The graph was unfinished, which produced separate graph failures; those do not explain the wrong diagnosis verdict.

### N04 — P1: Flood Fill Step 2 reverses the lesson's node rule

Locations: `flood-fill` graph rules and Step 1 canvases; `visual-library.js`, `validateProblemGraphShape`, `fullTypedGrid`.

The lesson teaches that only pixels with the original start color become nodes. E.g. Step 1 `image=[[1,1],[1,0]]` has three nodes. Step 2 requires **every** cell of the full image, including other colors, and connects equal-color neighbors even outside the start-color region. A student following the taught three-node model is rejected with “Draw every cell.” The full image is needed for the returned image, but the exercise must clearly distinguish the stored input from the particular search graph. Keep one node rule or explicitly explain the deliberate change before grading.

### N05 — P1: Moocast Step 2 never checks radio range

Location: `moocast` Step 2; `validateProblemGraphShape` and `counterResult`.

Cow labels contain coordinates and power, but validation does not derive arrows from them. The result simply uses the student's arrows. For example, label cows at `(0,0)`, `(100,0)`, `(200,0)`, all with power 1; draw arrows 0→1 and 2→1. Such transmissions are impossible, yet the shape passes the relevant source checks, and the “make two-way” round can treat this as a 2-versus-3 counterexample. The student can pass while getting the defining distance rule wrong. Derive the complete legal edge set from cow labels and compare it with the drawing.

### N06 — P1: Properties Graph Step 2 lacks k and never checks row overlap

Location: `properties-graph`, all Step 2 rounds; `step2-specs-new.json` input has only `component-count`.

Labels contain row sets, but there is no threshold `k` field and no overlap check in graph validation. Students can connect disjoint sets and have the drawing counted as correct. This tests generic graph traversal while bypassing the main problem skill: deciding an edge using at least k **distinct** shared values. Collect k, validate sets, derive legal edges, and compare them to the drawing.

Confirmed in Chrome, Ruben/drop-final-edge: drew row0:{1}—row1:{2} as the correct graph and two isolated nodes as the buggy graph, startrow0, outputs1/2. “Counterexample confirmed” accepted every check. The visible Constraints explicitly require1<=k<=m, so these disjoint sets cannot share an edge for any validk. A replay with matching sets and the same output pair also passed.

### N07 — P1: Farmland Step 2 accepts nonrectangular groups

Location: `find-all-groups-of-farmland`, all Step 2 rounds; sparse-grid shape validation.

Input promises that each group is a perfect rectangle. Validation only checks side adjacency. A student can draw the L at `(0,0),(0,1),(1,0)` with both legal side edges, and the result adapter reports `[0,0,1,1]` as its bounding box even though `(1,1)` is forest. In the last-branch round this can also become a successful counterexample. Check that every cell inside each component's rectangle exists, or clearly introduce a different problem.

### N08 — P1: Getting Gold Step 2 lets students invent trap safety

Location: `kattis-getting-gold`, all Step 2 rounds; `cellSafety` marker and `validateProblemGraphShape`.

The student manually supplies `clear`, `draft`, or `trap`, but the code never verifies these against neighboring traps. It also does not enforce all allowed arrows or prohibit arrows entering traps/leaving draft cells. The relevant grid check only checks physical side-neighbor distance; this directed lesson is omitted from the complete sparse-grid adjacency check. Therefore a wrong dungeon graph can be accepted as the “correct” starting graph. Derive draft status from traps, then derive outgoing arrows and compare them exactly. Use one consistent cell type so contradictory gold/trap markings cannot be entered.

### N09 — P1: Label values and scoring values can disagree silently

Locations: Step 2 `employee-importance`, `path-sum`, `structy-tree-sum`; `parseCounterSemanticInputs` and their result adapters.

Values must be entered twice: inside node names (e.g. `1:5`, `node 0: 5`) and in separate marker text boxes. Nothing compares the two. The displayed graph can show value 5 while the scorer uses marker value 100. A student who naturally sums the values shown on the graph can be marked wrong. Store the value once or reject the inconsistency with a precise message.

### N10 — P1: Deep Count Step 2 permits a number to contain children

Location: `codewars-array-deep-count`, nested-path graph validation.

The validator verifies that a parent path exists and has the right edge, but not that it represents an array. For example, `outer array → [0]=1 → [0][0]=2` has valid-looking paths, but a scalar 1 cannot contain another item. The item-count adapter just counts reachable nodes. Validate each parent's item type, and reject children under plain values. This also needs a useful explanation rather than a generic tree error.

### N11 — P2: Several lessons accept or supply inputs that violate their own constraints

`properties-graph`: Step 1 build-1/exact-picture use `[[1,2],[2,3],[8]]`; repair-5 uses `[[7,7],[7],[8]]`. Step 4 authored-deep-case uses `[[1,1],[1,2],[3]]`, and strict-threshold repeats build-1. These violate the stated common row length m. Pad with repeated values if the intended sets should stay unchanged.

`reachable-nodes-with-restrictions`: Step 2 is absent from `counterexampleRequiresTree()`, so disconnected graphs/cycles are not rejected even though the statement requires one tree. Node-label validation also allows `0 (restricted)`, contrary to the source-never-restricted rule. The normal traversal initially counts its start even when incident edges are removed, making this invalid input especially misleading.

`usaco-fence-planning`: Step 2 allows isolated cows and repeated positions despite the statement's “every cow moos with at least one other cow” and distinct-position rules. An isolated cow creates a zero-perimeter herd and can derail the intended example. Validate the stated input constraints or explicitly relax them in the lesson.

### N12 — P2: HackerRank's diagonal-mistake answer does not match its input

Location: `hackerrank-connected-cells`, Step 1 `predict-output`, choice `wrong-1`, value 4.

Feedback says “This misses a diagonally connected 1.” But all five cells of the large region are connected by side steps: `(0,0)→(0,1)→(1,1)→(1,2)→(2,2)`. A four-direction-only student still gets 5. The option 4 is not the stated bug's result. Use a region whose extra cell is reachable only diagonally, or author another explanation for 4.

### N13 — P2: GFG's diagonal-mistake answer still cannot escape the source

Location: `gfg-grid-path-exists`, Step 1 `bug-trap`, choice `wrong-2`.

Input `[[1,0,3],[0,0,3],[3,3,2]]`. The choice claims true because diagonal movement connects the source to the route. Its only in-bounds diagonal neighbor `(1,1)` is a wall, so even eight-direction movement cannot leave the source. Feedback merely says diagonal moves are forbidden and fails to address the picture. Replace the input/choice with an actual one-misconception witness. The neighboring “source is on an edge” choice is also weak: nothing in this problem suggests that being on the border establishes reachability.

### N14 — P2: Array and matrix distractors often violate the output's shape

Locations: all nine Step 1 build/repair output questions in `ten-kinds-of-people`, `flood-fill`, `transitive-closure`, `find-all-groups-of-farmland`, and `wheres-my-internet` (45 questions).

The generic third option often duplicates the first output entry. In Flood Fill and Transitive Closure it literally appends a row, although the returned grid must have the input dimensions. Ten Kinds returns one extra answer for a fixed query list. Empty farmland produces `[0]`, the wrong output type; empty offline lists can become `[0]`, a nonexistent house. Some duplicate-group mistakes are possible, but the same mechanical trick across every case is not a specific graph misconception. Replace each with a same-shape result produced by a clear, testable bug. Do not make the student eliminate choices solely by counting output rows.

### N15 — P2: Boolean questions repeat the same answer with a second explanation

Locations: all nine Step 1 build/repair output questions in `gfg-grid-path-exists`, `evaluate-boolean-binary-tree`, and `path-sum` (27 questions).

Choices include both `false` and `false — use the false fallback without searching`, or both `true` and `true — return success before checking the graph`. The prompt asks what the function returns, so these are the same output. The longer choice is also a conspicuous bad-answer cue. This violates the project's distractor rule against repeated Boolean outputs. Use two plain Boolean choices plus a separate reasoning question, or give each answer a distinct, meaningful explanation under an appropriate prompt.

### N16 — P2: 153 numeric choices are generic ±1 guesses with no diagnosed mistake

Locations: the nine build/repair questions in each of the 17 numeric-result new lessons: Deep Count, Connected Cells, Sub-islands, Employee Importance, Fence Planning, Getting Gold, Ladder Takahashi, Largest Component, Max Area, Max Root-to-leaf Sum, Fish, Milk Factory, Minimum Island, Moocast, Properties Graph, Reachable Nodes with Restrictions, Tree Sum.

The third choice has `misconception: off-by-one-result` and feedback “uses a final calculation that is off by 1.” This labels the symptom, not the thinking error. Examples include -1 for an empty Deep Count, an empty island grid, zero gold, or zero fish, and 11 as an unlisted highest floor when 10 is correct. Many can be dismissed without graph reasoning. Author a concrete operation that produces every wrong value, then explain that operation in feedback. Keep negative values where they are meaningful, e.g. genuine path sums and the Milk Factory -1 sentinel.

### N17 — P2: “Fresh” picture checks repeat the just-completed build

Location: Step 1 `exact-picture` in all new lessons except `structy-largest-component` (24 checks).

The raw input is identical to build-1/case-1. Most prompts call it a “fresh input,” even though the student already built and answered it. This measures recognition of the previous solution. Change both the raw input and separating detail while keeping the same learning target. Do not just relabel the same graph.

### N18 — P2: All 50 later concept questions reuse already-solved statement examples

Location: `predict-output` and `bug-trap` in all 25 new lessons.

These use the lesson statement's two worked examples (sometimes with rewritten formatting or question wording). Their answers and explanations are available in the problem text. Examples: both Tree Sum totals, both Moocast counts, both Ten Kinds query lists, both GFG reachability results. Even the advertised “fresh picture” task is therefore often a recall/copy task. Preserve worked examples for teaching, but give the assessment its own input and intended misconception.

### N19 — P2: Many node/edge checks show input that cannot expose the intended distinction

All but Largest Component reuse earlier build inputs for node-rule and edge-rule as well as exact-picture. More seriously, most edge-rule checks use an empty/singleton graph: Ten Kinds `grid=["1"]`; Deep Count `["x"]`; Connected Cells `[[0]]`; Sub-islands two `[[0]]` grids; Employee Importance one employee; Farmland `[[0]]`; Flood Fill `[[5]]`; Getting Gold boxed-in P; Max Area `[[0]]`; Max Root-to-leaf `[6]`; Fish `[[0]]`; Milk Factory n=1; Minimum Island one L; Moocast one cow; Path Sum `[1]`; Properties one row; Transitive Closure `[[0]]`; Tree Sum empty tree; Internet n=1. Students cannot use these drawings to compare competing adjacency rules. The generic rule question may still be answerable from the statement, but it does not test the advertised input-to-graph skill. Give each check a small witness where candidate rules differ.

### N20 — P2: Step 3 is predictable and recycles all five repair graphs

Locations: `structureSourceTasks`, `makeStructureClaims`, `nodeMembershipClaim` in `visual-library.js`; all 25 new lessons.

All five exact graphs come from Step 1's remedial pool. A student who needed those repairs sees the same graphs again. The first membership claim is always false (`correct: false`), and the answer pattern forces a small set of fixed Yes/No patterns. Repeated practice teaches “first answer No.” This is especially weak when Step 3 claims to be a fresh independent model check. Use fresh authored builds and balance meaningful true/false membership claims without revealing the model.

### N21 — P1: Boolean Step 2 asks for a false-result witness that its first bug cannot create

Location: `evaluate-boolean-binary-tree`, round 1, `skip-leaf-edges`, goal “Make leaf values essential to the 0 result.”

Removing all leaf edges makes the evaluator return false for an operator with no remaining operands. If the correct full tree already returns false, this does not expose an output difference. The useful witness instead has a true correct expression and a false buggy expression, e.g. AND(true,true). Rewrite the goal in Boolean terms and align it with the grader's required differing outputs. Other stale wording includes “0-to-leaf” in Max Root-to-leaf Sum/Path Sum and “both 0 branches” in Tree Sum; use “root.”

### N22 — P2: Getting Gold's third code case is too trivial for the deep reasoning step

Location: `kattis-getting-gold`, Step 4 `never-leaves-start`.

The only bug is an empty directions list. It returns zero because it cannot move at all. This neither checks the special draft boundary nor challenges the student's understanding of cautious traversal. Replace it with a distinct realistic gold-specific mistake, such as discarding gold on an entered draft square. Keep the other cases separate: expanding from a draft and walking through walls are already covered.

### N23 — P2: Employee Importance's overwrite case has no sibling branches

Location: `employee-importance`, Step 4 `overwrites-report-total`.

The shown input is a four-employee chain with values 2,4,6,8. Overwriting the total returns 8, but there are no earlier sibling totals to overwrite. The title, diagnosis, and explanation discuss reports replacing earlier reports; the student never sees that branch loss. Use a manager with at least two report subtrees and nonzero own importance so the lost contributions are visible and distinct from merely omitting the manager.

### N24 — P2: Some Step 4 feedback describes code or boundaries inaccurately

`count-sub-islands` authored-deep-case: `graphProof.codeRule` says the whole component is “erased,” but the current code uses a visited set and never changes grid2. The rejected mutation diagnosis gets “Either marking method works,” which does not tell the student the shown code does not mutate the grid.

`kattis-getting-gold` walks-through-walls: repeated feedback says “A wall is the only barrier between the start and gold.” The interior is open around a center trap; the real barrier is that both exits from P are draft squares. The buggy search escapes through the outer wall and goes around those draft boundaries. Explain that precise route; otherwise the student learns the wrong reason the correct search stops.

### N25 — P2: Deep Count's empty-array node choice is ambiguous

Location: `codewars-array-deep-count`, Step 1 node-rule choice `nonempty`.

“Only items inside non-empty arrays” does not mean empty array nodes are omitted: an empty array itself can be an item inside a nonempty outer array. Yet the choice is labeled `drops-empty-arrays` and feedback argues that an empty inner array still counts. Say “omit array items whose length is zero” if that is the intended misconception. Also give this check an actual empty **inner** array; its current input is the empty outer array.

### N26 — P2: Flood Fill's same-color bug check uses implausible alternatives

Location: `flood-fill`, Step 1 bug-trap, recoloring 0 to 0.

Wrong choices say change every 0 to 1, remove the starting pixel, or return an empty image. These do not probe the important same-color risk: using recoloring as the only visited mark fails to mark progress when the old and new colors match. Keep the unchanged output question simple, and use a separate code/behavior question for repeated traversal or nontermination.

### N27 — P2: Ten Kinds wrongly dismisses region compression as conceptually invalid

Location: `ten-kinds-of-people`, node-rule choice `regions`.

“One node for each finished same-digit region” is rejected with “Regions are results of connecting cells, not the starting nodes.” The intended **cell-level** exercise is fair, but region/component labeling is also a standard correct way to answer many connectivity queries. Make the prompt say “in this cell-level model, before grouping” and explain that a later compressed representation can be valid. Do not teach that an alternate correct graph model is universally wrong.

### N28 — P3: Deep Count's Step 4 depth explanation is off by one edge

Location: `codewars-array-deep-count`, Step 4 `one-nesting-layer`, input `[[[0]]]`.

The proof says value 0 sits “two array edges below the outer container.” Its path is outer→inner array→inner array→0: three containment edges. Say “inside two nested arrays” or “three edges below the outer array.” The numeric correct and buggy results, 3 and 2, are otherwise consistent.

### N29 — P2: Largest Component's minimum case hides the intended comparison

Location: `structy-largest-component`, Step 4 `chooses-smallest`.

The title suggests the result is the smaller component (sizes 2 and 4), but the accumulator starts at 0 and Math.min therefore returns 0 for every nonempty input. The actual observed result does not require comparing the two groups at all. Either teach the zero-sentinel interaction explicitly or choose a single comparison error whose returned 2 shows the smaller-component misconception.

### N30 — P2: Fish Step 4 includes a true behavior as a rejected diagnosis

Location: `maximum-number-of-fish-in-a-grid`, authored-deep-case, diagnosis `global-seen`.

“Using one seen set prevents a later start from catching the same pool again” accurately describes the code. It is good behavior, not the fault. The UI asks what graph-level behavior the code creates and prefixes all options “Claim about the code,” so a careful student can reasonably select it. Ask explicitly which behavior **causes the wrong returned value**, or rewrite the distractor to claim the shared seen set incorrectly skips a different pool.

### N31 — P2: Moocast's end-cow distractor has the wrong value

Location: `moocast`, Step 1 bug-trap, input `[[0,0,2],[3,0,3],[5,0,1]]`, wrong-1 value 2, misconception `chooses-end-cow`.

Either end cow reaches only itself: cow 0 cannot cover distance 3 with power 2, and cow 2 cannot cover distance 2 with power 1. Choosing an end cow returns 1, not 2. A plausible 2 would omit the broadcaster from the middle cow's reachable count. Change the explanation or replace the witness.

### N32 — P2: Tree Sum repair gives the wrong result for its stated bug

Location: `structy-tree-sum`, repair-3, intended right chain 1→2→3.

Wrong choice 3 is labeled `follow-left-child-only`. Following only the left child from this root returns 1, not 3. The value 3 instead fits stopping after the root's direct right child. This is independent of N02's ambiguous serialization. Fix both the input representation and the chosen bug/result pairing.

## Additional live Chrome evidence

After the manual-content pass, I used one Chrome tab and only clicked/typed through the UI. No state injection or browser scripts were used. The tab was reused for both checks.

**N04 confirmed — Flood Fill, Step 2, first round.** On the published site, drew `(0,0)` and `(1,1)` with no edge for the correct graph. Copied that graph using the visible button, then added the diagonal edge in Maddox's graph. Entered start `(0,0)`, rows `2`, columns `2`, new color `2`, and markers `(0,0)=1` and `(1,1)=1`. Entered correct output `[[2,0],[0,1]]` and buggy output `[[2,0],[0,2]]`. Clicking Check my graph produced one correction and the exact error: “Draw every cell in the 2 by 2 grid, from (0,0) through (1,1).” All subsequent checks were blocked. The visible task gave a node-name format and said to place matching colors diagonally; it did not explain that other-color pixels must also become nodes. This confirms the hidden change from the Step 1 start-color-only graph.

**N30 confirmed — Maximum Number of Fish, Step 4, first case.** The live input is `grid: [[2, 3]]`. Drew `(0,0)—(0,1)`, entered buggy output `2`, and selected C: “Claim about the code: using one seen set prevents a later start from catching the same pool again.” Clicking Check graph + reasoning passed exact nodes, exact edges, direction, and incorrect-solution output, but failed diagnosis. Exact feedback: “Each pool only needs one total; the wrong total is caused by ignoring weights.” The visible question was “What graph-level behavior does this code create?” The choice describes a real behavior, so the question should ask which behavior causes the wrong result.

**Additional UI confirmation:** Fish Step 4's Add node button initially generated label `0`, although the displayed required format is `(row,column)`. After renaming the first node to `(0,0)`, Add node generated `0` again for the second. Both needed manual renaming. Flood Fill Step 2 correctly generated coordinate labels automatically, so the same graph tool behaves differently between steps. Merge this with the shared node-default mismatch finding if the main report already has one.



## Additional findings from the exhaustive Chrome pass

### L01 — P1: All Paths rejects numeric path IDs but accepts quoted IDs

Location: `all-paths-from-source-to-target`, Step2, two-way mistake. Agent drew correct1→0 with source0, and buggy1—0. Correct output `[]`; buggy path `[[0,1]]` was rejected even though every other check passed. Changing only the buggy answer to `[["0","1"]]` passed. Success then displayed `[[0,1]]`, the very text previously rejected. Normalize node IDs in nested path arrays; accept the documented/displayed numeric format. This is a confirmed live grading failure, not a source-only concern.

### L02 — P1: The header's next-step button loses a just-passed final answer

Location: Step3, confirmed live in Course Schedule and Possible Bipartition. Submit the fifth exact graph and correct claim; observe success. Click header Next: Step4 instead of the bottom FinishStep3. Return to Step3: the last question is back with a blank graph and only four completed checks. Rebuilding and using the bottom Finish button saves completion. Successful grading should save the result immediately; two navigation buttons should not disagree about whether the student's work counts. Related to G02's refresh loss.

### L03 — P1: Bipartition rejects an equivalent node set on its chosen input

Location: Possible Bipartition Step1 node check, n5 with dislikes12,34,45,53. All five people appear in a pair. ChoiceA, only people appearing in a dislike pair, therefore selects the same five nodes as accepted choiceC. A is rejected with an explanation about people who have no dislikes, but no such person exists here. Use an input with an isolated person so the two rules actually disagree; do not call this particular result a contradiction.

### L04 — P1: Bipartition's equal-group-size feedback cannot explain its wrong answer

Location: Step1 build1, n4, dislikes12,13,24. Exact graph plus false is blamed on requiring equal group sizes. But the valid split is {1,4}/{2,3}: already equal size. The success feedback itself shows that split. Choose a genuinely unequal-size example for this misconception, or change the wrong-answer explanation.

### L05 — P2: The province repair repeats an earlier graph and does not test isolated cities

Location: Number of Provinces Step1 final repair. A student answers0 for the three-city identity matrix, revealing that they ignore isolated cities. The repair is the same connected three-city chain already solved in build3. There are no isolated cities, so the student's wrong rule can survive. Use a fresh input containing both a connected group and an isolated city.

### L06 — P2: The swap membership claim does not clearly distinguish letters from positions

Location: Smallest String With Swaps Step3 claim1, s=cba, pair02. The claim says each letter should become a separate node; Yes is rejected, No accepted. Each letter is unique here, so a student can reasonably mean one node for each letter occurrence, exactly one per position. Use repeated letters and ask explicitly whether equal-valued positions merge into one node. The intended distinction should be tested, not guessed from wording.

### L07 — P1: GFG's wrong-start goal requires adjacent walkable cells to be disconnected

Location: GFG grid-path Step2 first case. Agent confirmed the authored goal uses real source(0,0) and wrong start(0,1) in different components. Omitting01 as a wall is rejected for missing01; drawing01 isolated is rejected for missing adjacent connections; connecting00—01 passes graph/output checks but cannot expose the bug because both starts share a component. A workaround with a separate21—22 component, real source21 and target22, passes true/false—but ignores the authored source00. Change the wrong start to a nonadjacent cell or rewrite the allowed-source goal; enforce whichever contract is stated.

### L08 — P1: Picture feedback names an arrow mistake that the picture does not contain

Locations: Water and Jug Problem and Word Search, Step1 picture check, choiceC. In the jug case, C replaces (0,0)→(2,0) with an illegal (0,0)→(2,2) transition: filling both jugs at once. In Word Search, C replaces a horizontal edge with a diagonal edge. Both submissions received the same explanation about reversing one-way relations or turning two-way relations into one-way movement. Neither drawing makes that mistake. Describe the actual changed edge and its illegal operation; do not attach a stock explanation by choice letter.

### L09 — P2: Diagonal-move repairs contain no diagonal pair

Locations: Word Search Step1 picture repair (row CAT), edge check (single Z), and edge repair (column DOG); also GFG's corresponding edge-rule check/vertical repair. The wrong rule allows diagonal neighbors, but these one-dimensional inputs have no diagonal neighbors. Drawing with the wrong rule therefore produces the same exact graph and passes. Counting Constellations has the reverse problem: after missing diagonal connections, its final repair contains only distant stars00 and22, with no adjacent diagonal pair. Use a fresh two-dimensional input where the correct and mistaken rules produce different edges and outputs.

### L10 — P2: Word Search's backtracking repairs have no failed branch

Locations: Step1 repairs after the ABCCED and SEE route questions. Boards ABX/BCX and AB/BC both use wordABC. Both B choices successfully reach C, yet feedback discusses recovering from a failed B branch or unmarking cells after failure. The triggering wrong answers reused a C/E cell, but these repairs have no repeated letter in the word and do not distinguish legal paths from paths that permit reuse. Use an input that actually requires rejecting a repeated cell or recovering from a failed branch. The Step2 counterexample AB/BX/CX with wordABC demonstrates a useful failed-first-B case.

### L11 — P1: Coins calls the correct immediate-parent relation a mistake

Location: Coins on Level K, Step1 edge choiceD. It says to connect every coin to the deepest box containing it. That is its immediate containing box. The rejection then says a coin connects to its immediate box, while claiming the selected rule skips boxes. The explanation agrees with the chosen relationship instead of showing a contradiction. If the intended error is an ancestor shortcut, name the outermost box; if it is omitting box-to-box edges, say that explicitly.

### L12 — P1: Shelf's final code case contains two independent bugs

Location: Busiest Shelf Level, Step4 final case, items=[[],[5]]. The code stops at a level with no integers AND returns the largest item count rather than the required depth. It has no depth variable. Removing the premature stop still returns1, while the correct answer is depth2. Thus fixing the taught misconception does not fix the function. Keep only one realistic error in the snippet; test that repairing that error alone produces the correct result. This is separate from V18's misleading count/depth wording, also confirmed in the same live pass.

### L13 — P2: Islands questions use inputs that cannot distinguish their rules

Locations: Number of Islands, Step 1 membership and edge checks; Step 3 membership, direct-edge and direction claims. The all-land 2×2 membership example gives identical nodes for every-land and only-land-with-neighbors rules. Its singleton edge example has neither side nor diagonal edges. Step 3 asks cells-versus-components with just one land cell, direction with no edges, and direct-versus-indirect connections with no route at all. Wrong choices were rejected and correct choices passed in Chrome, but the drawings cannot explain why. Use a multi-cell island plus an isolated cell, an actual diagonal contact, a connected pair, and a three-node path respectively.

### L14 — P2: Islands repairs let the original mistake survive

Locations: Number of Islands, Step 1 repairs after the two island-count checks. After rejecting 9 because it counts individual cells in a connected patch, the repair presents three isolated cells: counting cells now gives the accepted answer3. After rejecting1 on corner-touching patches, the repair presents a vertical strip with no corner-only connection. Use fresh examples where the specific mistaken rule still produces a different graph or answer. All repair submissions passed in Chrome; the concern is what they actually test.

### L15 — P1: Code feedback describes the correct graph as the changed graph

Confirmed in Number of Islands Step 4 and also recorded for Word Search and Ten Kinds of People. In Islands' diagonal case, “Changed graph” says the two nodes have no edge, although the code adds a diagonal. In its water-counting case on an all-land2×2 grid, it says4nodes/4connections, although the buggy search has no water nodes. The cell-counting case likewise repeats the original graph rather than explaining that the code ignores connectivity. Describe the buggy graph or explicitly state that the graph is unchanged and only the counting/search rule changes. Then explain the actual reachable boundary rather than generic text about which values contribute.

### L16 — P2: Phone-chain membership repair contains no late person

Location: Save the Date, Step 1 membership repair. After rejecting “only people who hear before the deadline,” the repair uses head1, two listeners, head wait2, deadline2. All three are on time, so a student who still excludes late people can draw the expected graph and pass. Include at least one late listener while still requiring that person as a node.

### L17 — P2: Phone-chain final check repeats the immediately preceding build

Location: Save the Date, Step 1 final build and final visual check. Both use n4/head2/caller[2,0,-1,2]/wait[1,0,2,0]/deadline0 and ask how many know by the deadline. The first submission reveals and explains answer1 immediately before the same answer is requested again. Change the input or test a different boundary, such as zero-wait descendants who also hear on day0.

### L18 — P1: Valve's ID-lookup code case also misses grandchildren

Location: Shut the Valve, Step4 case4, ids[2,5], feeds[0,2], liters[7,11], shutId2. The code uses liters[shutId−1] for the starting sprinkler and then sums only direct children. The accepted diagnosis identifies the wrong ID lookup, but correcting it still leaves a solution that misses grandchildren. The two-node input hides that second bug. Use a complete downstream traversal with exactly one faulty lookup. Chrome confirmed output22 versus correct18 on the shown input; the defect is the extra independent mistake, not that arithmetic.

### L19 — P2: Valve's membership example makes the rejected subtree rule look correct

Location: Shut the Valve, Step1 membership check. The shut sprinkler is the root, so “only the shut sprinkler and its descendants” selects the same four nodes as the accepted all-sprinklers rule. The full-tree repair is better because it shuts a non-root sprinkler. Use that distinction in the original question too.

### L20 — P2: Valve's upstream-count repair has no upstream sprinkler

Location: Shut the Valve, Step1 final repair. After rejecting17 for including the upstream sprinkler30 in a10-liter subtree, it presents a star shut at its root and accepts102. Including upstream nodes cannot be exposed because no upstream node exists. Keep a non-root shut valve and at least one unaffected ancestor in the fresh repair.

### L21 — P2: Study Group's repair cannot distinguish adding groups from taking the largest

Location: Biggest Study Group, Step1 last check and repair. Wrong4 adds two disconnected pairs and is correctly rejected. The fresh repair has just one student and one component, so summing component sizes gives the accepted1. Use at least two separate components with different sizes so sum and maximum differ.

### L22 — P2: Study Group feedback misidentifies natural counting mistakes

Location: Biggest Study Group, Step1. For two pairs plus an isolated student, answer3 naturally counts groups, but feedback calls it an off-by-one calculation. For a four-student chain, wrong2 is described as counting a student and direct teammates without naming an endpoint; the largest direct neighborhood including self is3. Explain the actual alternative calculation, or name the chosen student when that matters. Where multiple mistakes produce the same number, say “One way to get this answer is…” rather than claiming to know the student's reasoning.

### L23 — P2: Study Group's output checks reuse answers already revealed by builds

Location: Biggest Study Group, Step1 two output-only visual checks. The seven-node largest4 example repeats the first build, and the pair/pair/isolated largest2 example repeats the second build. Other intervening checks also reuse the seven-row matrix. Keep useful shared-example scaffolding, but give the later output checks fresh component sizes so they measure transfer rather than recall.

### L24 — P2: Playlist's empty-folder edge question and repair have no empty folder

Location: Kth Song, Step1 edge check `[[1,[2]],3]` and repair `[[[2]],6]`. The wrong rule drops connections to children containing no songs, yet every folder contains a song in both inputs. It is rejected with an empty-folder explanation, although its drawing matches the accepted rule here. Include an empty folder in both examples.

### L25 — P1: Playlist's wrong-answer explanation predicts the wrong song

Location: Kth Song, Step1 build `[[1,[2]],3]`, k2. Answer3 is rejected as playing all top-level songs before opening folders. That rule produces3,1,2, whose second song is1. A shallow-only flatten instead produces1,3 and explains answer3; the lesson's own first Step4 code case demonstrates exactly that. Align the feedback with the actual calculation.

### L26 — P2: Playlist feedback uses unnamed folders and misleading path arrows

Locations: Kth Song, Step1 first build and Step4 shallow-flatten case. Feedback names folderA/folderB while the UI uses index paths. The code explanation writes root→folderA→1→folderB→2, but song1 has no edge to folderB. Use visible paths and explain returning to the parent before visiting the next child; do not present visitation order as a chain of graph edges.

### L27 — P2: Playlist order repairs avoid the nested-versus-top-level choice

Locations: Kth Song, Step1 last two repairs. `[10,[20,30]],k1` has its first song at top level, so both playback orders start10. `[[1],[],[2]],k2` has no top-level song competing with a nested folder. After an order mistake, give a fresh input where depth-first playback and the mistaken order select different songs.

### L28 — P1: Pile's all-integer feedback gives the wrong total

Location: Top of the Pile, Step1 first build `[[[5,6]],7,[8]]`. Wrong15 is described as adding every integer at every depth, but5+6+7+8=26. The selected15 sums only7+8. Either offer26 with the existing explanation or explain omitting the deepest layer. Chrome confirmed this exact rejection text.

### L29 — P2: Pile's empty-box repair contains no empty box

Location: Top of the Pile, Step1 membership repair. Omitting empty boxes is rejected, then the repair uses `[[4],[4]]`. Every box contains an integer, so the wrong rule creates the expected drawing. Include an empty box in the fresh input.

### L30 — P2: Pile's zero-sum repair never produces a zero sum

Location: Top of the Pile, Step1 final repair. After a student ignores a shallow6+(−6)=0 layer, the repair uses `[[1,2],[3]]`, whose shallow sum is6. Testing occupancy with `sum !== 0` still works on that repair. Use a fresh cancelling layer above a different deeper sum.

### L31 — P2: Courier's threshold repairs contain no score equal to k

Locations: Trusted Courier Networks, Step1 edge-rule repair and final repair. Both follow rejection of strict `> k`, but use only scores0,7,10 with k6. The mistaken strict comparison produces exactly the same graph as `>= k`. The edge question itself also has no score equal to6. Include a score exactly equal to k that connects otherwise separate groups.

### L32 — P2: Courier's isolated-office repair has no isolated office

Location: Trusted Courier Networks, Step1 first output-check repair. After rejecting2 for dropping isolatedoffice5, it presents two connected pairs and no isolated office. Omitting isolated offices still yields the accepted answer2. Retain an isolated office in the fresh example.

### L33 — P2: Properties' duplicate-counting repair contains no duplicates

Location: Properties Graph, Step1 edge check and repair. The question uses only `[[5]]`, so there is no pair of rows to compare. After rejecting repeated-occurrence counting, the repair uses three rows with no repeated value inside any row. Counting occurrences and counting distinct values give the same edges. Include duplicates that would falsely reach k under the wrong rule.

### L34 — P2: Properties' component repair has no connected edges to merge

Location: Properties Graph, Step1 first output-check repair. Wrong4 is explained as counting three edges plus an isolated row. The fresh input contains just two isolated rows, so that same calculation returns the accepted2. Include a connected chain of at least two edges plus an isolated row, so edges-plus-isolates differs from components.

### L35 — P2: Properties code cases bury a small decision in long scaffolding

Location: Properties Graph, Step4 cases2–3. The threshold case shows83lines; the edge-count return case shows87lines, including a full correct component traversal whose result is discarded. Long repeated contract comments add reading burden unrelated to the targeted mistake. Keep enough code for fair reasoning, but shorten or collapse trusted helpers and focus attention on graph construction, changed boundary, and returned quantity.

### L36 — P1: Restrictions code grader requires Red while instructions say Blue

Location: Reachable Nodes with Restrictions, Step4 first case, n4/edges01,12,03/restricted1. The UI says “Color every flooded or blocked node Blue.” The exact graph, output3 and correct diagnosis passed their checks, but coloring restrictednode1Blue failed the color check. Changing only that node to Red produced “Trace confirmed.” Other nodes remained default Slate. Match the grader and instruction, use “restricted” instead of unrelated “flooded,” and make later cases consistent about whether color is required.

### L37 — P1: Restrictions Step3 accepts routes through forbidden nodes without warning

Location: Reachable Nodes with Restrictions, Step3 final claim. For n6, edges01,12,03,34,45 and restricted4, it accepts that a search from1 reaches all6nodes and rejects No. A legal search reaches only0,1,2,3. Another claim says3reaches1throughrestricted2 and corrects only the proposed shortcut, not the forbidden route. If this step intentionally asks about the underlying tree while ignoring restrictions, say so explicitly beside each claim and contrast that with legal reachability. Otherwise grade according to the stated prohibition.

### L38 — P1: Restrictions' blocked-first-branch goal does not expose its stated bug

Location: Step2 Brennan. The goal says to put a blocked branch before a separate allowed route. Drawing0—1(restricted) first and0—2 second produces correct2 and buggy2; both predictions and both drawings pass, but exposure fails. The engine skips the blocked branch before choosing the first available branch. Adding another allowed child3 gives correct3/buggy2 and passes. Ask for two allowed branches, or change the buggy search so the advertised blocked-first case actually stops it.

### L39 — P2: Restrictions' final repair has no node behind its forbidden node

Location: Step1 final repair. The triggering mistake counts an unrestricted descendant behind a forbidden ancestor, but the repair makes the forbidden node a leaf. Walking through forbidden nodes and excluding only their own count still gives the accepted2. Put an allowed descendant behind the blocked node in the fresh example.

## Chrome submission logs — chronological checkpoints

The records below distinguish completed submissions from pending checks. A passed test does not mean the lesson is free of issues.

# Root full-Chrome audit ledger

Actual Chrome visible-control submissions only. No hidden state, graph injection, local browser harness, or skips counted as tests.

Owned lessons (19): number-of-provinces; possible-bipartition; smallest-string-with-swaps; time-needed-to-inform-all-employees; water-and-jug-problem; word-search; number-of-islands; save-the-date-phone-chain; shut-the-garden-valve; biggest-study-group; kth-song-in-playlist; top-of-the-pile; trusted-courier-networks; properties-graph; reachable-nodes-with-restrictions; transitive-closure; structy-tree-sum; wheres-my-internet; path-sum.

## Number of Provinces

Tab 381534192, published `/number-of-provinces`. Step 1 first pass completed visibly at 9/9, 9 corrections. Used Add node and actual keyboard/mouse edge controls. Every graph below was undirected, without diagonal self-loops. No skip used. Separate direct-correct pass for the five concept choices is still pending.

| Item | Input / drawn graph | Submitted mistake and feedback | Correct submission / result |
|---|---|---|---|
| Build 1 | Matrix [[1,1,0],[1,1,0],[0,0,1]]; nodes 0,1,2; edge0—1 | Output1 rejected; graph all passes; feedback calls this “connect through diagonal ones bug” | Output2, “Exact visual proof”; two provinces |
| Build 2 | 3×3 identity; nodes0,1,2, no edges | Output0 rejected; feedback “ignore diagonal only cities” | Output3, exact proof |
| Visual 1 exact picture | Same matrix as build1 | Chose PictureD, omitting isolated city2; feedback “This drops an item that still exists even when it has no outgoing move.” | Direct PictureA submission pending; correct graph exercised in repair below |
| Repair 1 | [[1,0,0],[0,1,1],[0,1,1]]; nodes0,1,2; edge1—2 | Triggered by missing-node answer above | Output2, exact proof |
| Visual 2 nodes | 4×4 identity | D “Only cities that have an off-diagonal1…” rejected; feedback isolated city is still a province | Direct A all-cities submission pending |
| Repair 2 | [[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]; nodes0..3; edge0—1 | Triggered by isolated-node omission | Output3, exact proof |
| Build 3 | [[1,1,0],[1,1,1],[0,1,1]]; nodes0,1,2; edges0—1,1—2 | Output2 rejected; feedback “count direct groups only” | Output1, exact proof |
| Visual 3 edges | [[1]] | A self-loop-at-every-city answer rejected; feedback diagonal is not a road changing connectivity | Direct D ignore self-entries submission pending |
| Repair 3 | [[1,1],[1,1]]; nodes0,1; edge0—1 | Triggered by self-loop misconception | Output1, exact proof |
| Visual 4 count | Same matrix as build1 | B3 rejected; feedback cities0,1 share a road and form one province | Direct C2 submission pending |
| Repair 4 | [[1,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,1]]; nodes0..3; edges0—1,0—3,1—2,2—3 | Triggered by counting cities | Output1, exact proof |
| Build 4 | [[1]]; node0 no edges | Output0 rejected, feedback “count only off diagonal edges” | Output1, exact proof |
| Visual 5 identity count | 3×3 identity | B0 rejected; feedback isolated city is still one-city province | Direct D3 submission pending |
| Repair 5 | Same matrix and chain as build3 | Triggered by ignoring isolated cities | Output1, exact proof |

New observations: repair5 is an exact repeat of already-solved build3, despite calling for a fresh proof. Repair5 also has no isolated city, so it does not distinguish the specific wrong rule that triggered it. Build1's output1 feedback names a diagonal-one bug without explaining how self-entries could join the disconnected city. These need integration into the detailed report after the full pass.

Pending: direct correct submissions for all five Step1 visual checks; all three Step2 cases; all five Step3 builds/claims; all three Step4 cases.

## Browser-control interruption

After the 9/9 completion screen, clicked “Practice Step1 again.” Chrome opened a confirm. `getJsDialog()` reported confirm; the documented accept method then timed out on browser focus. Subsequent snapshots and close commands also timed out. Other agents encountered similar dialogs concurrently. Browser controls were paused; this is a testing-tool interruption, not proof of an app failure. System memory remained around64% free. Root tried documented dialog accept/dismiss, native Chrome inspection, and session recovery. Do not count any uncompleted subsequent action as tested.

All other 18 owned lessons remain pending in this full pass.

## Resumed Chrome pass

Chrome recovered in fresh tab381534199. Memory67% free. No app changes.

Number of Provinces Step2: all3 cases passed, with wrong probes.
- Evan/written-order: correct0—1, buggy unchanged0—1, seed1, outputs1/1 rejected exact-bug/exposure. Changing buggy to0→1 passes exactgraph and bothoutputs1/1 but still fails exposure despite opposite-needed-trip goal. Reversed correct drawing insertion to1—0, buggy1→0, seed0, outputs1/2 passes. Missing instruction: whole-graph DFS city iteration order decides count; seed-based trip goal alone does not expose return-value difference.
- Riley/drop-last: triangle0—1,1—2,0—2, buggychain0—1—2, seed0, outputs1/1 passes all except exposure. Prompt says join cities in SAME province; redundant closing edge matches this reading but cannot change count. Corrected sourcechain0—1—2, buggyonly0—1 plusisolated2, outputs1/2 passes. Explain bridge must join previously separate groups.
- Jack/drop-leaf-edge: correct0—1; buggynodes0,1 noedge. Outputs1/1 rejects buggyoutput only;1/2 passes. Feedback only a cross, no explanation of isolated-city count. SVG edge Playwright press/click timedout but CUA accessibility click+DELETE worked immediately.

Step3 Q1 membership: fournodes0..3, edge0—1; Yes claim eachgroupbecomesnode rejected with exactnode rule; Tryanother retainsgraph; No passes.
Step3 Q2 shortcut: nodes0..2 edges0—1—2; Yes add0—2 rejected with useful one-step explanation; No passes.
Step3 Q3: nodes0..2 edge1—2. Yes to node2 degree0 rejected (feedback degree1), No passes.
Step3 Q4: nodes0,1 edge0—1. No to two-way claim rejected; Yes passes.
Step3 Q5: fournodecycle0—1,0—3,1—2,2—3. No to reach4 rejected; Yes passes. Feedback incorrectly says follow arrows in undirected graph.
Step4 all3 cases wrong-output/wrong-diagnosis then exactgraph/output/correctdiagnosis passed: Q1 nodes0..2 edge0—1, wrong2/A diagonalcount, correct1/B nofurtherDFS; correctproblem2. Q2 identity3 nodesnoedges, wrong3/Bdiagonalcount, correct1/C componentdefinition; correctproblem3. Q3 chain0—1—2, wrong2/Browcount, correct3/Cselfentriesnotprovinces; correctproblem1. Q2/3 expected diagnosis gives a true problem rule, not what shown code does; feedback code-rule label also contains problem rule rather than faulty rule and generic changed-boundary prose.
All Step2–4 items submitted and passed. Step1 directcorrect replay still in progress.

Native Chrome fallback: CUA restart click opens confirm; documented accept freezes even when only one agent resetting. Native app cannot see managed audit tab in Windowmenu. Opened separate visible Chrome tab using super+t and URL, then selected its Windowmenu entry. This visible profile has fresh Step1 progress. Root tested B1 correct2 (3nodes edge0—1), B2 correct3 (identity3), and first visualcorrect PictureA; all accepted. No app state injection used. Other4 directcorrectvisualchecks pending.

Native replay finished: visual2 Aallcities accepted; B3chain output1 exactpass; visual3 Dno-selfloops accepted; visual4 C2 accepted; B4singlecity output1 exactpass; visual5 D3 accepted. Finishvisualproof shows9/9cleanrun. Number of Provinces now has all4steps fully tested, including every Step1 correct-choice, wrong-choice and repair, all4build wrong/correctoutputs, all3Step2 wrong/correctgraphsoroutputs, all5Step3wrong/correctclaims with exactgraphs, all3Step4wrong/correctoutputsanddiagnoses with exactgraphs. 1/19 root lessons complete; other18 pending.

## Possible Bipartition — full Chrome pass

Using own visible Chrome tab381534207, claimTab allows supported browser controls and native fallback on same visible page. Safe two-path approach: submit correctvisualchoice, readsuccess, reload BEFORE Next, submitwrongthenrepair. No reset dialogs needed.

Step1 ALL completed9/9,9corrections:
- B1 n4 edges1—2,1—3,2—4: false rejected as equal-group-size bug, truepasses. Feedback is WRONG: validsplit{1,4}/{2,3} is already equal2/2, so equal-size requirement cannot explain false here.
- B2 triangle1—2,1—3,2—3: true rejected as onlyperson1 conflicts, falsepasses.
- Picturecheck B1input: correctAaccepted; reload; directedPictureCrejected. Repair1 n3chain1—2—3 truepasses.
- B3 n5 edges1—2 plus triangle3—4—5: true rejected as onlycomponent1, falsepasses.
- Nodescheck B3input: C all1..5accepted; reload; A onlypeopleinanypair rejected with isolatedpeoplefeedback. On THIS input EVERYpersonappears, so bothanswers selectexactly same5nodes; no isolatedperson exposes misconception. Repair2 n4 only1—2 truepasses.
- B4 n3 noedges: false rejected as requirebothgroupsconflictedge, truepasses.
- Edgescheck raw[2,4]: B mutualoppositegroup accepted; reload; Aonlyarrow2→4 rejected. Repair3 n2 reversedpair2—1, truepasses.
- Splitcheck B1input: B{1,4}/{2,3} accepted; reload; A{1,2}/{3,4} rejected namingconflict1—2. Repair4 4cycle1—2—3—4—1 truepasses.
- Trianglecheck: Ccannot2color accepted; reload; Aput2and3opposite1 rejected naming2—3 conflict. Repair5 n4 edges1—3,2—3,2—4 truepasses; feedback says followconflictsnotodd/evenlabels, although triggeringerror was uncheckedsamegroupedge. Repair graph bipartite so doesnot expose anyoddcycle.

Step2 ALL3 exercised:
- Isaiah onehop: correctnodes1..4 edges1—2,2—3,3—4,4—2 start1. Buggyonlyedge1—2 and outputs true/true rejected both exactsecondgraph and correctoutput. false/true fixesoutput but stillgraphfails; feedback says mistakechangesonlysearch (notstatedclearlybefore). Restored SAME4edges inbuggygraph; false/truepasses.
- Jasmine lastbranch: trianglenodes1..3 edgesdrawn1—2,1—3,2—3 start1; duplicatedsamegraph false/truepasses. Repeated afterreload, false/false rejectedbugoutputonly, false/truepasses. No code describes what 'keeps lastbranch' means, secondgraph mustremainunchanged.
- Luke droplast: requiredgoal lastedgeconnectpreviouslyunreachedperson. Correct1—2, buggytwonodesnoedge start1 outputs true/true passesallbutexposure. Thisgoal cannot alterbipartiteness (bridgecannotcreateoddcycle). Workaround correcttriangle1—2,1—3,2—3; bugstar1—2,1—3; false/truepasses despite lastedgeNOTconnectingpreviouslyunreachedperson. Confirms O02 with fullcurrent submission.

Step3 ALL5 exactgraphs and wrong/correctverdicts submitted: Q1 n4edge1—2, relationships-as-nodes Yesrejected/Nopass. Q2 chain1—2—3, '3reaches1withoutdirectedge' Norejected/Yespass. Q3 n2edge2—1 node1degree2 Yesrejected/Nopass(feedbackdegree1). Q4 4cycle, '4—1bothways' Norejected/Yespass. Q5 edges1—3,2—3,2—4 reachfrom2exact3 Yesrejected/Nopass(feedback4). Allpassed. HeaderNextStep4afterlastpass didNOT save5thcompletion; returning showedblanklastquestion. Rebuiltlastgraph/reansweredNo/passedthenbottomFinishStep3: completionconfirmed. Important navigation/persistence defect.

Step4 ALL3 exactgraphs, wrongoutputs+wrongdiagnoses, correctedoutputs+diagnoses, and bottomFinishStep4complete3/3:
- Q1 n5edge1—2 plus3—4—5triangle: wrongfalse/Coneway rejected; true/Aonlycomponent1 accepted, realfalse. WrongCfeedbackstatescorrectproblemissymmetric ratherthanpointsoutshowncodepushesbothdirections.
- Q2 n4edges1—2,1—3,2—4 degree.every(<2): wrongtrue/Aignoredcomponent rejected; false/Btwoneighborsallowed accepted, realtrue. Accepteddiagnosisstatescorrectproblemrule NOT behaviorofthecode; genericchangedgraph/boundarytext.
- Q3 triangle groupsassignmentwithoutconflictcheck: wrongfalse/Crejectsdegree2 rejected; true/Bneverrejectssamegroupneighbors accepted, realfalse. Correctreasoningbutgenericfeedbackdoesnotidentifywhichtriangleedgeendsupsamecolored.

Possible Bipartition fullbrowsercoverage COMPLETE; all4steps+everymaincorrect/wrongvisual+allrepairs. Root2/19 complete. Next Smallest String With Swaps initialStep1.

## Smallest String With Swaps — COMPLETE

All four steps actually submitted in visible Chrome tab381534207. Every mainvisualcorrect choice tested via correctsubmit→reload→wrongsubmit→repair. No skips. Nodes always exact index:letter; edgesundirected except indicatedbuggygraph.

Step1 order and tests:
- B1 dcab pairs03,12: wrongabcd rejected(crosscomponents), bacdpasses.
- Picture A exact03,12accepted; reloadCdirectedarrowsrejected. Repair1 ba pair01→abpasses.
- B2 dcab pairs03,12,02: wrongbacdrejected(onepassbug), abcdpasses.
- Nodecheck dcab: Bpositionscarryinglettersaccepted; Aletterswithoutpositionsrejected. Repair2 cba pair02→abcpasses.
- Edgecheck pair03: Atwowayswapaccepted; B0→3rejected. Repair3 cbachain01,12→abcpasses.
- B3 cba nopairs: wrongabc rejected(global sorting), cbapasses.
- Componentanswer dcab03,12: Dbacdaccepted; Aabcdrejected. Repair4 dcba pairs01,23→cdabpasses.
- B4 baa pair01: wrongaabrejected(isolatedposition), abapasses.
- Mergedcomponent dcab03,12,02: Dabcdaccepted; Abacdrejected(oldcomponents). Repair5 dcabchain01,12,23→abcdpasses.
- BottomFinish:9/9,9corrections.

Step2 all3 wrong/correctoutputs and exactbothdrawings:
- Lucas ba: correctedge1:a—0:b, buggy1:a→0:b, start0:b. ab/ab rejectsbugoutputonly; ab/bapasses.
- Brooklyn cba: edges0:c—1:b then0:c—2:a; samebuggraph(searchonly), start0:c. abc/abc rejectsbugoutputonly; abc/bcapasses.
- Zachary ba: correct0:b—1:a, bugtwoisolatednodes. ab/ab rejectsbugoutput; ab/bapasses. BottomFinish3/3.
- All3 instruct 'Type the list the real function returns' with list examples although actualreturn isstring. Barestringsab/ba accepted. Need string-specific help.

Step3 all5 exactgraphs, wrongandcorrectclaims:
- cba pair02: 'eachlettershouldbecomeaseparatenode' Yesrejected/Nopass. Ambiguous: withuniqueletters, oneperletter matchesoneperposition; authoredmisconceptionneeds repeatedletters and wording about merging identicalcharacters.
- cbachain01,12: add02shortcut Yesrejected/Nopass.
- dcba pairs01,23: 3:a degree0 Yesrejected/Nopass(feedback1).
- dcabchain01,12,23: edge0:d—1:c bothways Norejected/Yespass.
- ba pair01: reachfrom1:a2nodes Norejected/Yespass. Feedbacksaysfollowarrowsundirected. BottomFinishStep3 thenStartStep4.

Step4 all3 exactgraphs and wrong/correctprobes:
- ba pair10 one-waycode: wrongab/Busepaironce rejected; ba/Cstoredonewaypasses, realab. 'Changedgraph' feedbackdescribescorrectundirectedgraphinsteadofbug1→0. WrongBfeedbackonlystatesruleswapsrepeat, doesn'tpointtocodesDFS.
- dcab03,12,02 conditionalonepass: bacd/Boneway initiallyoutputpasses/diagnosisfails. Then acbd/Aonepass hasdiagnosispass/outputfail (realisticmistakeexecutingthirdswapevenwhenb<c). bacd/Apasses. Correctoutputabcd. This is NOT a graderbug: conditional comparison skipslastswap.
- dcab03,12 globalsortcode: bacd/Bonepass rejected; abcd/Cignorescomponents passes, realbacd.
- BottomFinishStep4:3/3,4corrections. Feedbackgenericallysays'changeswhichnodes,paths,orvaluescontribute' insteadofshowingactualcomponentboundary.

Root3/19 complete. Remaining16owned lessons untouched infullpass. Next Time Needed to Inform All Employees.

## Time Needed to Inform All Employees — COMPLETE

Exact employee-number nodes and manager→report arrows throughout. Every mainvisual correctsubmit→reload→wrongsubmit→repair; no skips.

Step1 ALL:
- B1 n6head2star to0,1,3,4,5 times[0,0,1,0,0,0]: wrong5 rejected(sumparallelreports), correct1pass.
- PictureAcorrectstar accepted; Creversed rejected. Repair1 n3head1 arrows1→0,1→2 times[0,2,0] output2pass.
- Nodecheck n5 manager[-1,0,0,1,2] times[1,4,2,0,0]: Call0..4 accepted; Aonlypositivetimes rejected. Repair2 n2head0 edge0→1 times[0,0] output0pass; feedbacktargetsedgecost ratherthannodeomission.
- B2 n4chain0→1→2→3 times[1,2,3,0]: wrong3 rejected(largestsingledelay; alsofitscountedges), correct6pass.
- Edgecheck manager[4]=1: C1→4 accepted; A4→1 rejected. Repair3 n2head1 edge1→0 times[0,3] output3pass.
- B3 n5manager[-1,0,0,1,2] times[1,4,2,0,0]: wrong7 rejected(sumbranches), correct5pass.
- Loneheadcheck n1time0: D0 accepted; A1 rejected. Repair4 n4 edges0→1,0→2,1→3 times[2,5,0,0] output7pass. This multilevelrepair doesnot directlyretest whetheranonlyheadneeds0time.
- Starcheck B1input: D1 accepted; A5 rejected(parallelnotserial). Repair5 n3head0star times[4,0,0] output4pass.
- B4 loneheadtime0: wrong1 rejected(countheadminute), correct0pass. BottomFinish9/9,9corrections.

Step2 ALL: same legalwitness chain0→1→2, head0, informingvalues0=1,1=4,2=0.
- Aaronreverse: secondgraph1→0,2→1. Correct5/bug0 accepted. Repeatedafterreloadforwrongprobe5/1: bugoutputrejected, then5/0accepted.
- Kyliedroplast: secondgraphonly0→1, keepall3nodes. 5/5 rejectedbugoutput;5/1accepted.
- Braydenonehop: secondgraphsamechain (searchonly).5/5rejectedbugoutput;5/1accepted. BottomFinish3/3.
- Sharedfeedback only sayswrongoutput, not whichnodeislastinformedorwhatdelaycounted. Singlemistakesdistinct but samechainanswersserveallexamples.

Step3 ALL5 exactgraphs and wrong/correctclaims:
- n2edge0→1times0: leafemployeesleftout Yesrejected/Nopass.
- n2head1edge1→0: directnotlongerroute Norejected/Yespass. Onlytwonodesmeansnodistractinglongerroute; weakdirect-vs-reachabilitytest.
- n4edges0→1,0→2,1→3: node0has2outedges Norejected/Yespass.
- n3star0→1,0→2: reverse2→0 Yesrejected/Nopass.
- n3star1→0,1→2: reachfrom1exact2 Yesrejected/Nopass(feedback3includingstart).
- BottomFinishStep3→StartStep4.

Step4 ALL3 wrong/correctoutputs+diagnoses with exactgraphs:
- n5branchtree times[1,5,1,0,0], sumpositivecode: wrong6/Bzerotimeadds1 rejected;7/Asumbranchtimespasses, real6. Concretefeedbackexplains1+5+1vs1+5.
- samebranchtree times[1,4,2,0,0], Math.mincode: wrong5/Asumbranches rejected;3/Bminimumaccepted, real5. Genericfeedbackcouldshowfast0→2→4takes3vsslow0→1→3takes5.
- n6head2star, timehead1, subtractheadtimecode: wrong1/Cfastestbranch rejected;0/Aremovesheadtimeaccepted, real1.
- BottomFinishStep4 verified3/3,3corrections.

Root4/19 complete. Remaining15owned lessons pending. Next Water and Jug Problem.

## Water and Jug Problem — COMPLETE

All4steps, everymaincorrect/wrongchoice, all4buildwrong/correctoutputs, all5repairs, all3counterexamples wrong/correct, all5structurewrong/correctclaims, all3codewrong/correct. No skips. Each graph contains every state reachable from00 and every non-self legal fill/empty/pour transition, directed. Independently derived and drawn via visible Addnode/Rename/connection controls.

Graph sets repeatedly built: capacities1,2→6states/18arrows;1,3→8states/26arrows;2,2→4states/10arrows;1,1→4states/10arrows. All exactnode/edge/direction checks passed. Capacities1,k states are x0or1,y0..k;2,2 states00,20,02,22. Every edge is onelegaloperation, excluding no-change operations.

Step1 actual order:
- B1 capacities1,2target1 false rejected(genericwronggraphresult),truepass.
- B2 2,2target1 true rejected,falsepass.
- Picture2,2target2 Aexact10arrowsaccepted; C rejected. C replaces00→20 with00→22 (simultaneousfill) but feedbackwrongly saysreversesonewayorturnstwowa yoneway. No edge was reversed! Repair1 1,2target2 truepass.
- Nodecheck1,3target2 Camountpairaccepted; Atotalonlyrejected. Feedback uses(3,0)vs(0,3), butjug1capacity1 makes(3,0)illegal (liveconfirmationO20). Repair2 1,3target3 truepass.
- B3 1,3target2 false rejected,truepass.
- Edgecheck2,2target4 Donelegaloperationaccepted; Carbitrarypartialpourrejectedwithgoodunmarkedjugsexplanation. Repair3 2,2target3 falsepass.
- Reachability3,5target4 Blegalmovesleave4accepted; Dpourchosenliterrejected (rightresultwrongreason); repair4 1,2target3 truepass.
- B4 2,2target4 false rejected,truepass.
- Evenness2,6target5 Deveryamountremains evenaccepted; Cfalseonlybecausetargetlargerjug1rejected. Ctext contains 'because only because'. Repair5 1,3target4 truepass.
- BottomFinish9/9,9corrections. Repeatedsame3completegraphs manytimes; mostsuccessfeedbackonlysaysreachable/notreachable withoutshowingawitnesspathorparityreason.

Step2:
- Hunteronehop1,2target3: fullgraphbothdrawings;true/truerejectsbugoutput;true/falsepasses.
- Austinfirstbranch initial1,2target2 fullgraph: true/true outputsacceptedbutexposurefails;true/falsebugoutputfails. Realisticwrongassumption thatreturningtovisitedstateimmediatelyendsfirstbranch; engineactuallyusesnextunvisitedneighbor, notstatedclearly. Changedto1,3target2 withorderedbranch00→10→01→03→13 (thenonlyvisitedneighbors). Fullgraphstillall26arrows, adjacencypriorities00first10;10firstunvisited01;01first03;03first13. Samebugdrawing. true/truerejectsbugoutput, true/falsepasses. Earlierbranchesnotvisitedincludeamount2states.
- Madelinelastbranch1,3target2: reverse outgoing-edge insertion order ofAustin'sgraph, soLASTavailablebranchfollows same00→10→01→03→13. Samegraphbothdrawings. true/truerejected, true/falsepasses. BottomFinish3/3.
- First/last cases test nearlysameerror, require manyedge-orderdetails but show no pseudocode and no missedstate/path feedback. Successonlysayssinglemistakechangesvalue; shouldshowbranchandmissedamount2.

Step3:
- 1,3target3 capacity-as-node Yesrejected/Nopass.
- 1,2target3 route01→10→12withoutdirect01→12 Norejected/Yespass.
- 1,3target4 state10has2outedges Yesrejected/Nopass(feedback3).
- 1,2target2 reciprocal10→12and12→10replacebyundirected Yesrejected/Nopass. Feedbackonly 'inputcreates10→12, directionmatters' ignores equallylegalreversearrowmentionedinclaim. Explain exactdirectedrepresentation versus equivalenttwo-wayreachability; do not implyreverseillegal.
- 2,2target3 reachfrom02exact4 Norejected/Yespass. BottomFinishStep3.

Step4:
- 1,1target2 earlytarget>maxbound: wrongtrue/Agcdequalityrejected;false/Bsinglejugboundaccepted, realtrue. Concretefeedbackidentifiestarget11.
- 1,3target2 equalcapacitytest: wrongtrue/Btotalboundrejected;false/Cpourcancreatenoncapacityamountaccepted,realtrue. Acceptedchoice is correctproblemfact ratherthancodebehavior; genericfeedbackomitswitness00→03→12.
- 2,2target1 target<=sumonly: wrongfalse/Cequalcapacityrejected;true/Acommondivisorreachabilityaccepted,realfalse. Acceptedchoiceagaincorrectrule, notshowncodebehavior; genericfeedbackomits parity explanation.
- BottomFinishStep4 verified3/3,3corrections.

Native screenshot inspected: talltwo-panel layout; aftersubmissiongraphscrollsmostlyaboveviewwhilefeedbackbelow, dense18arrowgraphcrossings; defaultnodeexamples(2,3)invalidformostshowncapacities; generatednewlabels(0,3),(0,4),(0,5)alsoinvaliduntilrenamed. Fullpassroot5/19 complete; next Word Search. Allthreeagents have now stopped on service usage limit, notcomputer-resourcepressure.

## Word Search — COMPLETE

All four steps tested in visible Chrome, including all four code cases. No skips. Every graph uses all board coordinates and all orthogonal, undirected neighbor edges. Both correct and wrong visual answers were submitted, with reload before advancing to test both paths; every repair was built and passed.

### Step 1

- Build1: board AB/DC, word ABC. Exact square graph; false rejected as straight-lines-only; true accepted.
- Build2: row AB, word ABA. Exact two-node graph; true rejected as cell reuse; false accepted.
- Picture: AB/DC, word ABC. Correct A accepted. C replaces the bottom horizontal edge with diagonal00—11, yet wrong feedback says it reverses arrows/turns two-way into one-way. All edges are undirected. Repair1 is row CAT, word CAT: true accepted. A one-row board cannot expose the diagonal misconception.
- Build3: AX/XB, word AB. Square graph; true rejected as diagonal movement, false accepted.
- Membership: AX/XB. A separate node per cell accepted; B one node per distinct letter rejected. Repair2 row AA, word AA: true accepted. This repair usefully distinguishes equal letters at different positions.
- Build4: single Z, word Z. False rejected as requiring an edge; true accepted.
- Edge check: single Z. Correct C side-neighbors accepted; A side-or-corner rejected. There is no diagonal pair in the chosen input, so it does not demonstrate the difference. Repair3 column D/O/G, word DOG: true accepted. It also has no diagonal pair, so the wrong rule still passes.
- Sample ABCCED route: C correct coordinate route accepted; D reuse the same C rejected. Repair4 ABX/BCX, word ABC: true accepted. Feedback says a failed B branch leads to trying another B, but BOTH B branches reach C successfully. No failed-first-branch behavior is exposed, and the triggering error was reuse, not branch abandonment.
- Sample SEE route: D right-side S, down E, left E accepted; A reuse E rejected. Repair5 AB/BC, word ABC: true accepted. Feedback teaches unmarking visited cells after a failed branch, but both B branches succeed and the word has no repeated letter. A solver that permits reuse can still return the same true result.
- Finished9/9,9 corrections. Board letters are forbidden in node labels; the drawing therefore proves positions/adjacency, not independently that the student preserved each letter, despite the 'exact board letters' badge.

### Step 2

- Aidan/add diagonals: 2×2 AX/XB, word AB, start00. Correct square graph; buggy graph adds BOTH diagonals. true/true rejected only the correct output; false/true accepted.
- Peyton/first branch: 3×2 AB/BX/CX, word ABC, start00. All six cells/seven orthogonal edges in both drawings. Edge00—01 drawn before00—10. First B at01 fails; second B at10 reaches C20. true/true rejected buggy output; true/false accepted. This genuinely tests the failed-first-branch case missing from the Step1 repairs.
- Jason/drop last: 1×2 AB, word AB, start00. Correct edge00—01; buggy graph retains both isolated nodes. true/true rejected buggy output; true/false accepted.
- All dimensions, letters and outputs entered through visible fields; bottom FinishStep2 verified3/3.

### Step 3

- Row AA: merge equal-letter cells claim Yes rejected, No accepted, exact two-node graph.
- AB/BC: add00—11 because reachable through10 claim Yes rejected, No accepted, exact square graph.
- Row CAT: middle cell has two direct neighbors; No rejected, Yes accepted.
- Column DOG: connection10—20 works only10→20; Yes rejected but feedback begins 'Yes. This graph is undirected ... works both ways.' No accepted. This is a live contradictory feedback prefix (same family as V15).
- ABX/BCX: search from X at02 reaches six nodes; No rejected, Yes accepted. Clarify this means unrestricted adjacency search, not matching word ABC from X. Feedback also incorrectly says follow the arrows in an undirected drawing.
- Bottom FinishStep3 used.

### Step 4

- Global visited: BAA/AAA/AAA, word AAB; full3×3 graph. Wrong true/A needs diagonals rejected; false/B global visited accepted; real true. Feedback correctly names valid02→01→00 route that earlier searches block.
- Diagonal code: AX/XB, word AB; square graph. Wrong false/A cells stay blocked rejected; true/C follows corners accepted; real false. 'Changed graph' feedback says four edges, describing the correct graph instead of the six-edge buggy graph.
- Reuse code: row AB, word ABA. Wrong false/B cells stay blocked rejected; true/A no current-path tracking accepted; real false. Generic feedback does not show00→01→00 or the reused cell.
- Top-left-only: XA/CB, word ABC; square graph. Wrong true/C reuse accepted rejected; false/B onlyboard00 accepted; real true. Feedback correctly identifies01→11→10 and explains that00 containsX.
- Bottom FinishStep4 verified4/4,4 corrections.

Root6/19 lessons complete. Next Number of Islands; the other12 assigned lessons are still pending. Team workers remain stopped by service usage limits.

## Number of Islands — FULL CHROME PASS

All four steps tested through Chrome, including correct and incorrect submissions, all five Step 1 repairs, and bottom completion buttons. Root 7/19; team 11/75 complete. Memory check: 51% available.

### Step 1

- Build 1: grid 110/000/101; four land nodes and edge 00—01. Wrong 4 rejected as counting land cells; correct 3 accepted.
- Picture check: A correct accepted, reload, D (missing isolated node22) rejected. Repair row101: two isolated nodes/output2 passed.
- Membership: all-land 2×2; D every land cell accepted, reload, B only land with neighbors rejected. Both choices produce the same four nodes here. Including water also produces the same nodes because this input has no water. Repair row01 with lone node01/output1 passed.
- Build 2: diagonal10/01; two isolated nodes. Wrong1 rejected; correct2 accepted.
- Edge check: singleton1; side-only accepted, reload, side-or-corner rejected. This input cannot distinguish the rules. Repair110/100 (shown as 11/10): intentionally added diagonal01—10; grader correctly flagged only exact edges while accepting output1. Removing the diagonal passed.
- Build 3: all-land2×2 square. Wrong4 rejected; correct1 accepted.
- Count check: bent patch11110/11010/11000/00000; correct1 accepted, reload, wrong9 rejected. Repair diagonal100/010/001/output3 accepted. This repair lets the original count-every-land-cell misconception produce the correct answer; use a connected patch plus an isolated cell instead.
- Count check: 11000/11000/00100/00011; correct3 accepted, reload, wrong1 rejected. Feedback only says water gaps prevent travel, without explaining corner contacts. Repair vertical111/output1 accepted, but has no diagonal contact to test the mistake.
- Build 4: singleton1. Wrong0 rejected as requiring a neighbor; correct1 accepted. Bottom Finish visual proof saved9/9.

### Step 2

- Savannah/add diagonals: correct isolated00 and11, buggy edge00—11, start00. Correct/buggy outputs2/2 rejected only buggy output;2/1 accepted.
- Brandon/one hop: row111 chain, start00, identical drawings.1/1 rejected only buggy output;1/2 accepted.
- Nevaeh/drop final edge: row11, correct edge00—01, buggy two isolated nodes.1/1 rejected only buggy output;1/2 accepted.
- These grid cases infer the input from the drawing; no independent grid/node/edge input fields appeared. Start field exists. Output fields started empty. Bottom Finish Step2 saved3/3.

### Step 3

- Membership grid01: claim each connected group becomes one node. Yes rejected, No accepted. With only one land cell, both models produce one node, weakening the intended distinction. Use a multi-cell island.
- Diagonal100/010/001: claim no direct00—11 edge and naming nodes does not create reachability. No rejected, Yes accepted. This does not contrast an indirect route with a direct edge; there is no route at all.
- Vertical111: middle node has3neighbors. Yes rejected with correct2 explanation; No accepted.
- Row101: directed-graph claim Yes rejected, No accepted. No edges exist, so direction has no visible consequence.
- L-shape11/10: from10 reaches3nodes. No rejected, Yes accepted. Feedback says follow arrows despite an undirected graph.
- Exact graphs accepted throughout; bottom Finish Step3 used.

### Step 4

- Diagonal code on10/01: correct graph two isolated nodes. Wrong2/water-bridges diagnosis rejected; correct buggy1/diagonal diagnosis accepted, real2. Changed-graph feedback describes the correct graph having no edge instead of buggy diagonal edge.
- Count cells on110/000/101: exact four nodes/one edge. Wrong3/diagonal diagnosis rejected; correct buggy4/no-merging diagnosis accepted, real3. Changed-graph feedback merely repeats the original4nodes/1edge; reachable-boundary text is generic. Explain that the code counts nodes, not components.
- Water flood-fill on all-land2×2: correct square. Wrong1/count-every-cell diagnosis rejected; correct buggy0/water-nodes diagnosis accepted, real1. Changed-graph feedback wrongly gives4nodes/4edges instead of zero water nodes; the boundary text does not explain no cell can start a flood fill.
- Bottom Finish Step4 saved3/3 with3corrections. Shown code and accepted buggy outputs agree in all three cases.

Next root lesson: Save the Date Phone Chain. Twelve root lessons remain, plus unfinished worker assignments.

## Save the Date — FULL CHROME PASS

All four steps tested in Chrome with correct and wrong submissions, all five repairs, and bottom completion buttons. Root8/19; team12/75 complete.

### Step 1

- B1: n6/head0/caller[-1,0,0,1,1,2]/wait[2,3,1,0,0,0]/deadline4. Exact five weighted arrows. Wrong6 rejected as ignoring deadline;4 accepted.
- B2: n3/head2/caller[2,2,-1]/wait[0,0,5]/deadline3. Wrong0 rejected as delaying head's initial hearing;1 accepted.
- Picture: B1 input; A correct accepted, reload, reversed C rejected accurately. Repair n5/head0/caller[-1,0,0,1,2]/wait[1,4,2,0,0]/deadline4, exact weighted tree/output4 accepted.
- Membership B2 input: B all people accepted, reload, A only early people rejected. Repair n3/head1/caller[1,-1,1]/wait[0,2,0]/deadline2, full weighted tree/output3 accepted. Everyone in this repair is on time, so excluding late people now makes no difference. Add a genuinely late listener to the repair.
- B3: n3/head0/caller[-1,0,0]/wait[4,0,0]/deadline4. Wrong2 rejected with useful sequential-calls explanation;3 accepted.
- Edge rule: A caller[i]→i accepted, reload, B reverse rejected. Raw input shown is only caller[i], while a prewritten picture from the prior case appears under review. Repair n2/head1/caller[1,-1]/wait[0,3]/deadline3, edge1→0 weight3/day3 accepted.
- Deadline count n7/head0/caller[-1,0,0,1,1,2,2]/wait[1,2,4,0,0,0]/deadline3: B5 accepted, reload, A3 rejected for excluding day3. Repair weighted chain0→1→2 weights2,3/deadline5/output3 accepted, meaningfully tests equality.
- B4: n4/head2/caller[2,0,-1,2]/wait[1,0,2,0]/deadline0. Wrong2 rejected with generic off-by-one wording, correct1 accepted.
- Last visual check repeats B4's entire input and asks the same output immediately afterward. C1 accepted, reload, A0 rejected head-count explanation. Repair n4 chain weights1,2,3/deadline3/output3 accepted.
- Saved9/9 via Finish visual proof.

### Step 2

- Reagan/one hop: student-designed chain0→1→2 with weights1,1, waits0=1/1=1/2=0, deadline2. Identical drawings.3/3 rejected buggy output,3/2 accepted.
- Eduardo/drop last: head0→1 weight1, waits0=1/1=0, deadline1; buggy two isolated nodes.2/2 rejected buggy output,2/1 accepted.
- Jordyn/reverse: head0→1, waits0=1/1=0/deadline1. Deliberately labeled BOTH correct and reversed edge7 instead of1.2/2 rejected only buggy output;2/1 ACCEPTED with every graph check green, despite contradicting the entered delay. This is a live false-positive, not a source inference. Reloaded same uncommitted question; rebuilt with consistent edge1 and outputs2/1, accepted again. Bottom Finish Step2 saved3/3.
- No independent person/edge/caller input fields; graph supplies those facts. Head/deadline/wait fields exist. Weight consistency is taught and graded in Step1 but not checked here. Either derive displayed weights from wait fields or validate them; do not show contradictory timing as an exact correct graph.

### Step 3

- Membership n3/head1: time values as nodes; Yes rejected, No accepted with exact weighted tree.
- Direct edge n2/head1:1 and0 directly connected; No rejected, Yes accepted.
- Degree chain0→1→2→3:1 has one outgoing direct edge; No rejected, Yes accepted.
- Direction five-person tree: reverse3→1 exists; Yes rejected, No accepted.
- Weight chain0→1(weight2)→2(weight3):1→2 weight4; Yes rejected, No accepted.
- Bottom Finish Step3 used. All drawings accepted with labels.

### Step 4

- Listener-delay bug: chain0→1→2, waits2,3,0/deadline4. Wrong2/A inclusive deadline blamed rejected; correct3/C listener delay accepted, real2. Actual buggy days0,3,3 versus correct0,2,5. Changed-graph paragraph describes correct caller delays, not buggy destination weights; the final explanation is useful.
- First listener: star0→1,2,3/wait0=1/deadline1. Wrong4/B head omitted rejected; correct2/C onlyfirst accepted, real4. Changed-graph paragraph says head calls all three, although code calls only1. Boundary says head has three siblings; these are sibling nodes relative to one another, not necessarily head's siblings. Say three listeners/direct children.
- Strict deadline: chain0→1→2/waits2,2,0/deadline2. Wrong2/C lateperson2 counted rejected; correct1/A equality rejected accepted, real2. Graph unchanged; final boundary explanation correctly identifies person1 exactly onday2.
- Exact weighted drawings accepted, but Step4 gives no edge-weight instruction or weight grading row. Bottom Finish Step4 saved3/3.

Next root lesson: Shut the Garden Valve. Eleven root lessons remain, plus unfinished worker assignments.

## Shut the Valve — FULL CHROME PASS

All four steps, all five Step1 repairs, and all eight code cases tested. Root9/19; team13/75. Step4 initially resumed at1/8 from older progress: tested cases2–8, saved8/8, then used Practice Step4 again and tested case1 both ways. Current saved replay is1/8, but actual coverage includes every case; no old progress was counted as new evidence. Native Chrome confirmed the practice reset. A stale browser-dialog flag was cleared after native acceptance; this was tooling, not an app defect.

### Step 1

- B1 ids1,2,3,4/feeds0,1,1,2/flows5,10,20,40/shut2: exact tree. Wrong40 rejected for omitting own10;50 accepted.
- B2 same tree/shut1: wrong70 rejected for omitting root5;75 accepted.
- Picture B1: correctA accepted, reload, missing-edgeB rejected. Repair ids10,20,30,40/feeds0,10,10,20/flows2,3,5,7/shut20, exact tree/output10 accepted.
- B3 ids5,9,2/feeds0,5,5/flows7,4,6/shut9: wrong11 rejected for upstream5;4 accepted.
- Membership B2 tree with shut=root: C all sprinklerIDs accepted, reload, D only shut node and descendants rejected. On this input D selects exactly the same four nodes. Repair ids30,10,20/feeds0,30,10/flows7,1,9/shut10, fulltree/output10 accepted and does distinguish retaining upstream30.
- B4 lone42:13: wrong0 rejected for requiring a child;13 accepted.
- Edge claim input is only feeds[i];ids[i]. D feeds[i]→ids[i] accepted without excluding feeds[i]=0. ReverseA rejected. Confirms V32 wording omission. Repair chain8:4→3:5→6:2/shut3/output7 accepted.
- Seven-node subtree count (ids1..7/feeds0,1,1,2,2,3,4/flows4,6,3,8,2,10,5/shut2): correct21 accepted, reload,16 rejected for missing grandchild7. Repair chain1:6→2:7→3:8/shut1/output21 accepted; properly tests two-hop boundary.
- Final count repeats membership repair's entire30→10→20 input/output10 (confirms V24). Correct10 accepted, reload, wrong17 rejected because upstream30 keeps running. Repair star4:100→5:1,6:1/shut4/output102 accepted. This root-shut repair cannot expose the selected mistake of including upstream nodes: none exists.
- Finish visual proof saved9/9.

### Step 2

- Briana/reverse:1:5→2:7, shut2:7, flows entered as1:5=5 and2:7=7. Reversed second graph.7/7 rejected buggy output;7/12 accepted.
- Omar/first branch:1:5→2:7 drawn first, then1:5→3:11, shut1:5, matching flows. Duplicate graph.23/23 rejected buggy output;23/12 accepted.
- Marley/wrong start:1:5→2:7, shut1:5, same graph, matching flows.12/12 rejected buggy output;12/7 accepted. Shown start2 correctly resolved to labeled node2:7.
- Redundant node:value=value flow entry is cumbersome; values already appear in required names. Outputs start empty. Finish Step2 saved3/3.

### Step 3

- Membership30→10→20: relationships as nodes claim Yes rejected, No accepted.
- Direct edge star4:100→5:1,6:1:4→6 directly connected; No rejected, Yes accepted.
- Degree10→20,30;20→40:30 haszero outgoingedges; No rejected, Yes accepted.
- Direction8→3→6:reverse6→3 claim Yes rejected, No accepted.
- Reachability1→2→3:from2 reaches3nodes; Yes rejected withcorrect2, No accepted.
- All exact labeled graphs accepted; Finish Step3 used.

### Step 4

- Case1 selected-only: basefour-node tree/shut2. Wrong50/A ID-as-index rejected;10/B no traversal accepted, real50. Tested after replay, not assumed from old1/8.
- Case2 direct-only: same tree/shut1. Wrong75/C ownflowomitted rejected;35/A onlydirectchildren accepted, real75. Feedback correctly names missedgrandchild4.
- Case3 upstream:10→20,30;20→40, weights2,3,5,7/shut20. Wrong10/C IDindex rejected;5/B feederwalk accepted, real10. Correctly contrasts upstream10 with downstream40.
- Case4 IDindex:ids2,5/feeds0,2/flows7,11/shut2. Wrong18/A upstreamwalk rejected;22/C liters[shutId-1] accepted, real18. ALSO code only adds direct children, with no recursion. Two-node input hides this second independent bug. Repairing lookup does not fix general grandchildren. Use an otherwise complete traversal with one wrong lookup.
- Case5 omitself:8:4→3:6→11:9/shut3. Wrong15/B direct-only rejected with useful explanation that recursion would continue if needed;9/A missingown accepted, real15.
- Case6 maxinsteadsum:10:5→4:12,7:9/shut10. Wrong26/A firstonly rejected;12/B maximum accepted, real26. Useful feedback: loop visits both, max discards smaller contributions.
- Case7 earlyreturn:1:2→2:5,3:7;3:7→4:11/shut1. Wrong25/A directonly rejected;7/C returninloop accepted, real25. Useful boundary{3,4} missing.
- Case8 rootstart:9:3→4:8,6:13/shut4. Wrong8/A walksup rejected;24/B wrongstart accepted, real8. Useful entiretree versusleaf boundary.
- Shown code and accepted outputs agree on all eight inputs. Changed-graph headings commonly describe the correct tree rather than changed search behavior (L15 family); boundary and arithmetic explanations are stronger here than generic lessons.

Next root lesson: Biggest Study Group. Ten root lessons remain, plus unfinished worker assignments.

## Biggest Study Group — FULL CHROME PASS

All four steps, four builds, five visual checks with both paths, five repairs, three counterexamples, five graph claims, and three code cases tested. Root10/19; team14/75. Bottom completion buttons used throughout.

### Step 1

- B1 seven students: cycle0—1—2—3—0, pair4—5, isolated6. Wrong7 rejected as counting all rows;4 accepted.
- Picture same input: A correct accepted, reload, D omitting6 rejected. Repair pair0—1 plus isolated2/output2 accepted. Good isolated-node repair.
- B2 pair0—1, pair2—3, isolated4. Wrong3 rejected merely as off-by-one, though it naturally counts the three components;2 accepted. Name the component-count misconception instead of a made-up arithmetic error.
- Membership B1: C each row/student accepted, reload, D only off-diagonal teammates rejected. Repair pair0—1 plus isolated2,3/output2 accepted. Correctly tests retaining isolated nodes in drawing.
- Edge rule B1: D off-diagonal1 creates undirected edge accepted, reload, C common partner means direct edge rejected. Repair chain0—1—2/output3 accepted. This exact drawing meaningfully distinguishes route from shortcut.
- B3 chain0—1—2—3: wrong2 rejected as student plus directteammates, but does not identify an endpoint; maximum direct neighborhood including self is3. Correct4 accepted. Specify endpoint0 if explaining2.
- Count check repeats B1: A4 accepted, reload, B3 rejected as omitting start. Three is also the number of groups, so feedback assumes a cause not uniquely implied by answer. Repair triangle0,1,2 plus pair3,4/output3 accepted.
- B4 isolated0,1,2: wrong0 rejected as dropping isolatedstudents;1 accepted.
- Last check repeats B2 pair/pair/isolated input: B2 accepted, reload, A4 rejected for adding disconnectedpairs. Repair singleton0/output1 accepted; this cannot expose adding all component sizes because only one component exists.
- Repeated seven-row matrix appears for build, picture, membership, edge and count; final count also repeats earlier build. Some reuse scaffolds understanding, but later output-only checks reveal no new reasoning.

### Step 2

- Catherine/oneway: pair drawn1—0 in that click order, start0; duplicate graph changed to directed1→0.2/2 rejected only buggyoutput;2/1 accepted. No raw matrix fields exist; arbitrary edgeclick order is used as “written direction” although a symmetric matrix lists both directions. Clarify the actual one-half-matrix bug and scanning order.
- Ricardo/firstbranch:star0—1 then0—2, start0, samegraph.3/3 rejected buggyoutput;3/2 accepted.
- Liliana/dropleafedges:pair0—1, start0, buggytwoisolates.2/2 rejected buggyoutput;2/1 accepted.
- Finish Step2 saved3/3.

### Step 3

- Pair0—1 plus isolates2,3: connectedgroupsasnodes Yes rejected, No accepted.
- Pair0—1 plus isolate2:0reaches1butnodirectedge Yes rejected, No accepted.
- Chain0—1—2:1hasone neighbor Yes rejected withcorrect2, No accepted.
- Triangle0,1,2 plus pair3,4:0—1worksbothways No rejected, Yes accepted; feedback correctly beginsYes here.
- Singleton0:from0reaches1node No rejected, Yes accepted. Feedback says followarrows though drawing has none and graph is undirected; same shared wording issue.
- Exact graphs accepted; Finish Step3 used.

### Step 4

- Doublecountstart:two-nodepair. Wrong2/Bhalfmatrix rejected;3/Cdiagonalextra accepted, real2. Correct option says “each row's diagonal” though code seeds only the component start; feedback is more precise and says startstudent. Rewrite option to match.
- Direct-rowcount:four-studentchain. Wrong4/Bselfomitted rejected;3/Arownotchain accepted, real4. This illustrates why Step1's wrong2 explanation needs an explicitly chosen endpoint.
- Lastcomponent:triangle0,1,2 thenisolated3. Wrong3/Bdiagonaldoublecount rejected;1/Aoverwritebest accepted, real3. Feedback correctly explains3→1 overwrite.
- All shown code outputs agree with acceptedvalues; graphs and wrongdiagnoses graded as expected. Finish Step4 saved3/3.

Next root lesson: Kth Song in Playlist. Nine root lessons remain, plus unfinished worker assignments.

## Kth Song in Playlist — FULL CHROME PASS

All four steps and wrong/correct paths tested; all five repairs; three counterexamples; five graphclaims; three codecases. Root11/19, team15/75. Bottom completion buttons used. Extra Step2 replay confirmed V07, so saved Step2 replay is now1/3 despite all three cases having been tested and completed earlier.

### Step 1

- B1 [[1,2],[3,[4,5]]],k4, full nine-node containment tree. Wrong3 rejected with “counts folder B as an item”; no folderB is named in the UI. Correct4 accepted. Counting all folder items consistently would not explain3; state an actual counting rule and path.
- Picture sameinput: A correct accepted, reload, C reversed containment rejected. Repair[3,[8,[5,9]],[],4],k4, full nine-node tree/output9 accepted.
- Membership[7,[[]],[8,[9]]],k3: B foldersandsongs accepted, reload, A songs-only rejected. Repair[2,[2]],k2/fullfour-node tree/output2 accepted; useful distinctoccurrences explanation.
- B2[7,[[]],[8,[9]]],k3: wrong8 rejected for treating emptyinnerfolder as one songposition;9 accepted.
- Edge rule[[1,[2]],3],k2: Cdirectcontainment accepted, reload, Ddropchildunlesscontainsasong rejected with emptyfolder explanation. No emptyfolder exists in this input. Repair[[[2]],6],k1 also has no emptyfolder and accepts2, so neither question norrepair distinguishes that wrongrule.
- B3[[1,[2]],3],k2: wrong3 rejected as top-levelsongsbeforefolders. That stated rule plays3,1,2 and gives1 at k2, not3. Actual shallow-flattening error yields1,3 and gives3, as Step4case1 demonstrates. Correct2 accepted.
- Count[3,[8,[5,9]],[],4],k4 repeats picture repair; correct9 accepted, reload,4 rejected becausefifth. Repair[10,[20,30]],k1/output10 accepted; firstsongalreadytoplevel so does not test nested-versus-toplevelorder.
- Last visualcheck[[[2]],6],k1 repeatsedge repair. C2 accepted, reload,A6 rejected becausefirstfoldermustopen. Repair[[1],[],[2]],k2/output2 accepted; no top-levelsong competes with nestedorder.
- B4[[5],6],k3: wrong6 rejected as returninglastsongonshortplaylist;-1 accepted. FinishStep1saved9/9.

### Step 2

- Ashlyn/lastbranch: invented[[1],[2]],k1, correct edge orderfolder0thenfolder1; duplicategraph.1/1 rejectedbuggyoutput;1/2 accepted.
- George/onehop:[[7]],k1, duplicategraph.7/7 rejectedbuggyoutput;7/-1 accepted. Prompt says morethanonefolderdeep; precise relevant rule is beyondonedirectedge fromroot.
- Reese/droplast:[7],k1, correctroot→song;buggyrootandsongisolated.7/7 rejectedbuggyoutput;7/-1 accepted. Songfields require awkward root[0]=7=7, duplicatingvaluealreadyinlabel.
- FinishStep2saved3/3 beforeextraorderprobe.
- EXTRA V07 Chrome confirmation: restartedStep2throughnativeconfirmation. Samevalid[[1],[2]],k1, but drewroot→folder1 before root→folder0; all labels still encodearrayindexorder. Duplicategraph. Enteredcorrect1,buggy1; grader accepted everygraphcheckandbuggyoutputbut REJECTED correct1. Changedcorrectoutputto2; “Counterexample confirmed. Correct function returns2; Ashlyn's function returns1.” Thus runtime uses edgecreationorder for the supposedly correct playlist, contradicting indexpaths. Advancedtoquestion2 tosaveevidence; allregularcasesalreadycovered.

### Step 3

- [2,[2]]: omitsongnodesclaim Yes rejected, No accepted.
- [[[2]],6]: folder0reachesdeep2soaddshortcut claim Yes rejected, No accepted, specifictwo-edgeexplanation.
- [10,[20,30]]:roothastwooutgoingedges No rejected, Yes accepted.
- [[1],[],[2]]:reverseemptyfolder→root Yes rejected, No accepted.
- [3,[8,[5,9]],[],4]:rootreaches9nodes No rejected, Yes accepted. Fullgraphs accepted; FinishStep3used.

### Step 4

- Shallowflatten[[1,[2]],3],k2:wrong2/Azeroindex rejected;3/Bdiscardnestedfolder accepted,real2. Feedback uses unknownfolderA/B and says pathroot→folderA→1→folderB→2, suggesting nonexistent song1→folderB edge rather than returntofolderA thennextchild. Use actualpaths and distinguish traversal sequence fromdirectgrapharrows.
- Zeroindex[10,20,30],k2:wrong20/Breverseorder rejected;30/Csongs[k] accepted,real20. Codealso usesk>=lengthconsistentwithsamezeroindexmisconception; explainbothboundaryandlookup when teachingfix.
- Countfolder[[],7,8],k2:wrong8/Afoldersnotsearched rejected;7/Cfoldertakesposition accepted,real8. Goodconcreteexplanation.
- Shownoutputsagreewithacceptedvalues; FinishStep4saved3/3.

Next root lesson: Top of the Pile. Eight root lessons remain, plus unfinished worker assignments.

## Top of the Pile — FULL CHROME PASS

All four steps and all wrong/correct paths tested, including five repairs. Root12/19; team16/75. Full labeled containment drawings accepted throughout. Bottom completion buttons saved each step.

### Step 1

- B1 `[[[5,6]],7,[8]]`: wrong15 rejected with “adds every integer at every depth.” Actual all-integer sum is26, not15.15 equals only7+8 and omits both deepest values. Correct7 accepted.
- B2 `[[],[[2,3]],[[4]]]`: wrong0 rejected as stopping before integers;9 accepted, all integers at depth3.
- Picture B1: A correct accepted, reload, D missingdeep8 rejected. Repair`[[1],2,3]`/output5 accepted; retains deep1 even though not summed.
- B3 `[[6],5,[4]]`: wrong15 rejected with accurate explanation including deeper6and4;5 accepted.
- Membership B2: D everyboxandinteger accepted, reload, B dropemptyboxes rejected. Repair`[[4],[4]]`/output8 accepted but has no emptybox, so the original omission rule can pass unchanged.
- B4 `[[],[6,-6],[[9]]]`: wrong9 rejected as treating zero sum as no items;0 accepted. Useful cancellation edge case.
- Edge rule B3: B directcontainment accepted, reload, C all-descendant shortcuts rejected. Repair`[[[2]],3]`/output3 accepted and meaningfully tests depth.
- Sum `[[[6],5],[[3,[8]]],[4]]`: correct9 accepted, reload, wrong2 rejected as returning depth. Repair`[-2,[10]]`/output-2 accepted, distinct from depth1.
- Zero-sum check `[[],[[-5]],[6,-6],[]]`: B0 accepted, reload, C−5 rejected as deeper. Repair`[[1,2],[3]]`/output6 accepted. No zero-sum occupied layer exists, so using nonzero sum to detect occupancy still passes.
- Finish Step1 saved9/9. Story calls integers item weights but exercises use negative weights; explain signed values or use a context where negative values are natural.

### Step 2

- Tanner/reverse: invented`[[7]]`; reverse all containment arrows.7/7 rejected buggyoutput;7/0 accepted. No rule explains what buggy search returns when no integer is reachable; original problem promises at leastoneinteger. Explicitly state the counterexample evaluator's fallback0.
- Makenzie/wrongroot:`[[7],3]`, identical graphs.3/3 rejected buggyoutput;3/7 accepted. Prompt literally says starts at `root[0]=value` though actual firstinnerbox is `root[0]=[]`; use resolvedlabel.
- Malachi/firstbranch:`[2,3]`, samegraph, root→2 drawn first.5/5 rejected buggyoutput;5/2 accepted.
- Finish Step2 saved3/3.

### Step 3

- `[[4],[4]]`: leaveboxesout Yes rejected, No accepted.
- `[-2,[10]]`: root-to10shortcut Yes rejected, No accepted withtwo-edgeexplanation.
- `[[1,2],[3]]`:secondinnerbox hasone outgoingedge No rejected, Yes accepted.
- `[[1],2,3]`:root→root[2]=3 exists No rejected, Yes accepted.
- `[[[2]],3]`:fromroot[0][0]=[] reaches3nodes Yes rejected withcorrect2, No accepted.
- Finish Step3 used.

### Step 4

- Sumall `[[[5]],7,[8]]`: wrong7/Cdepthzero rejected;20/Ballleaves accepted,real7. Title “Adds shallow items from every branch” underspecifies code that actually sums every leaf; a branch with multiple depths would distinguish those rules.
- Deepest `[[[5,6]],7,[8]]`: wrong7/Bfirstitemonly rejected;11/CMath.max accepted,real7. Specific depth1/2/3 and arithmetic feedback correct.
- Firstshallow `[[1],2,3]`: wrong5/Adeepest rejected;2/Cfindonlyone accepted,real5. Specific boundary explanation correct.
- All declared buggy values agree with shown code. Finish Step4 saved3/3.

Next root lesson: Trusted Courier Networks. Seven root lessons remain, plus unfinished worker assignments.

## Trusted Courier Networks — FULL CHROME PASS

All four steps, all five repairs, and all wrong/correct paths tested. Root13/19; team17/75. Bottom completion buttons used. Resource check:46% CPU idle; no swap activity in sampled interval. No extra workers or browsers started.

### Step 1

- B1 score7 links0—1—2 and3—4/k6. Wrong3 rejected as generic off-by-one though3counts directlinks;2 accepted.
- Picture sameinput: A correct accepted, reload, C one-way rejected. Repair score7star0—1,2,3 plus3—4/k6/output1 accepted.
- B2 score7chain0—1—2—3/k6. Wrong4 rejected as offices “or qualifying entries”; actual qualifying matrix entries include diagonal and symmetric pairs, so vague alternativecause. Correct1 accepted.
- Membership six-officematrix scores9,7,5,8,4/k6: C everyoffice accepted, reload, A onlyofficeswithascore>=k rejected. Diagonal10 qualifies for everyoffice, so A literally selects all nodes. Confirms V12 live. Repair score7triangle0,1,2 plusisolated3/k6/output2 accepted.
- Edge rule same six-officematrix: C>=k accepted, reload, B>k rejected for equality. No score6 exists here. Repair threeisolates withdiagonal10/offdiagonal0/k6/output3 accepted; still no equality case.
- B3 score7pairs0—1 and2—3 plusisolated4/k6. Wrong5 rejected as officecount;3 accepted.
- Countcheck sixnodes chain0—1—2(scores8,7), pair3—4(score9),isolated5/k6. Matrix diagonals are0, violating promised10 (V13 live). D3 accepted, reload,A2 rejected droppingisolated5. Repairtwo score7pairs/k6/output2 accepted, but noisolatedoffice to retest that omission.
- B4 trust[[10]],k6. Wrong0 rejected droppingisolatedoffice;1 accepted.
- Lastcountcheck four-node chain scores5,4,6/k4, again diagonal0 violatescontract. D1 accepted, reload,A2 rejected for>k. Repair score7five-node star/k6/output1 accepted; everyedge strictlyabovethreshold so>kstillpasses. Confirms V25 limitedboundarypractice and adds specificfailedrepairs.
- FinishStep1saved9/9.

### Step 2

- Cesar/droplast:pair0—1,start0,buggytwoisolates.1/1 rejectedbuggyoutput;1/2 accepted.
- Alana/oneway:pairdrawn1—0,start0,duplicatechangedtodirected1→0.1/1 rejectedbuggyoutput;1/2 accepted.
- Javier/onehop:chain0—1—2,start0,samegraph.1/1 rejectedbuggyoutput;1/2 accepted.
- No trustscores,threshold,ormatrixentry fields are present. All tests are generic componentsearch, not validating the defining threshold rule. “Written order” comes from drawing clicks, though a symmetric matrix contains both directions. Clarify abstraction or add realmatrix/threshold inputs.
- FinishStep2saved3/3.

### Step 3

- Triangle0,1,2 plusisolated3:weightsasnodes Yes rejected, No accepted.
- Five-node star:3reaches1via0withoutdirectedge No rejected, Yes accepted. Goodindirectroutecontrast.
- Star0—1,2,3 plus3—4:3hastwoneighbors No rejected, Yes accepted.
- Threeisolates:directedgraphclaim Yes rejected, No accepted. Noedgesmake directionvisuallyuntestable.
- Two pairs:from0reaches3nodes Yes rejectedwithcorrect2,No accepted. Feedback saysfollowarrowsinundirectedgraph.
- Exactgraphs accepted; FinishStep3used.

### Step 4

- Strict> threshold:chain0—1—2 withscores5/k5. Wrong1/Bdiagonalselfnetworks rejected;3/Astrictcomparison accepted,real1. Changedgraph sayscorrecttwoedges thoughbug erasesboth; finalsentencecorrectlyexplains3isolates.
- Exact===threshold:fiveoffices score7chain0—1—2 andpair3—4/k6. Wrong2/Aequalsscoresrejected diagnosis rejected;5/B===not>= accepted,real2. Wrongfeedback saysnoscore6ratherthanpointingout===explicitlyacceptsequality; improvecausalexplanation.
- Countedges:four-node score7chain/k6. Wrong1/Csymmetricdoublecount rejected;3/Blinecountnotcomponentcount accepted,real1. Goodexplanationthatuppertrianglecountsoncebutwrongthing.
- All showncodeoutputsagreewithacceptedvalues; FinishStep4saved3/3.

Next root lesson: Properties Graph. Six root lessons remain, plus unfinished worker assignments.

## Properties Graph — FULL CHROME PASS

All four steps, all five repairs, and both wrong/correct paths tested. Root14/19; team18/75. Bottom completion buttons used. Exact node labels use row index and deduplicated set; equal sets stay separate rows.

### Step 1

- B1 `[[1,2],[2,3],[8]],k1`: row0—row1,isolated2. Wrong1 rejected droppingisolatedrow;2 accepted. Unequalrowlength violatesstatedm (N11).
- Picture sameinput: A correct accepted, reload,Cnoedges rejected as stoppedreadingonerelationtooearly. There is no relationlist to read; edge is derived from overlap. Prefer missingcommonvalue2 explanation. Repair`[[1,2],[1,2]],k2`/oneedge/output1 accepted.
- Membership`[[1,2],[2,3],[3,4]],k1`: Dentirerow accepted, reload,Aoneintegernode rejected. Repair`[[1],[2],[1]],k1` with0—2/output2 accepted.
- B2`[[1,1],[1,2]],k2`:twoisolates. Wrong1 rejected duplicatematches;2 accepted.
- Edgecheck`[[5]],k1`: Cdistinctsharedvalues accepted, reload,Aduplicateoccurrences rejected. Singletonhasnorowpair. Repair`[[1,2,3],[2,3,4],[3,4,5]],k2`/chain/output1 accepted, but no duplicates exist, so duplicate-counting rule still passes.
- B3`[[1,2],[2,3],[3,4]],k1`/chain:wrong2 rejected “requireaclique”;1 accepted. Cliquegrouping should specify an actualpartitionrule if used tojustify2.
- Count sixrows`[[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]],k1`:D3 accepted, reload,B4 rejected countingthreeedgesplusisolatedrow. Repair`[[1],[2]],k1`/twoisolates/output2 accepted. Edgecountplusisolatesstillgives2, so repair does not test mergingconnectededges.
- Count`[[1,2,3],[2,3,4],[4,3,5]],k2`:A1 accepted, reload,C3 rejected “Directedge0-2isnotneededforconnectivity.” Naturalstrict>k mistakegives3; feedback doesnotidentifywhichlegaledgesremain. Repair`[[7,7],[7],[8]],k1`/0—1/output2 accepted; unequalrowlength again violatescontract.
- B4`[[5]],k1`:wrong0 rejected droppingisolatedrow;1 accepted. FinishStep1saved9/9.

### Step 2

- Maximus/oneway:row0{1},row1{1},edgefirst1then0,startrow0;duplicatechangedtodirected1→0.1/1 rejectedbuggyoutput;1/2 accepted.
- Jayda/onehop:sets{1,2},{2,3},{3,4},chain0—1—2,start0,samegraph.1/1 rejectedbuggyoutput;1/2 accepted.
- Ruben/droplast EXTRA FALSE-POSITIVE: disjointrow0{1},row1{2},correctdrawingedge0—1,buggytwoisolates,start0,outputs1/2. All graph/output checks accepted andCounterexampleconfirmed. VisibleConstraints confirmed1<=k<=m: no validk can allowthisedge. No kfield exists. This is N06 confirmedinChrome, not justsourceinspection.
- ReloadeduncommittedRubenquestion;validmatchingrowsets{1},{1},correctedgeandbuggyisolates.1/1 rejectedbuggyoutput;1/2 accepted. FinishStep2saved3/3.

### Step 3

- `[[1],[2],[1]],k1`:relationships-asnodes Yes rejected,No accepted.
- `[[1,2],[1,2]],k2`:reachablebutnodirectedge Yes rejected,No accepted.
- Three-rowk2chain:row2hastwoneighbors Yes rejectedwithcorrect1,No accepted.
- `[[1],[2]],k1`:two-waygraph No rejected,Yes accepted,despiteedgelessinput.
- `[[7,7],[7],[8]],k1`:fromrow0reaches2 No rejected,Yes accepted; unequalrowlengthcarriedintothisstep. Feedback saysfollowarrowsforundirectedgraph.
- FinishStep3used.

### Step 4

- Duplicatecount`[[1,1],[1,2],[3]],k2`:threeisolatescorrect. Wrong3/Bmergerows rejected;2/Aduplicatecounter accepted,real3. Unequalrowlengthinvalid. Changedgraphtextsaysthreeisolatesinsteadofbuggy0—1;finalsentencecorrectlyexplainsinventededge.
- Strictthreshold`[[1,2],[2,3],[8]],k1`:correct0—1plusisolate2. Wrong2/Cduplicates rejected;3/B>k accepted,real2.83linesofcodeandlongcontractcommentsfortinycomparisonbug; trimunrelatedscaffoldingorcollapsetrustedhelper. Unequalrowlengthagaininvalid.
- Returnedges`[[1,1],[1,2]],k2`:twoisolates. Wrong2/Bduplicates rejected;0/Cadjacencyhalf accepted,real2.87linesincludesanentirecorrectcomponentcountthatisdiscarded. Useclearshorthelpercontractandfocusreturnmistake; thisisreadabilitysuggestionnotincorrectexecution.
- All declaredbuggyoutputsagreewithcode. FinishStep4saved3/3.

Next root lesson: Reachable Nodes with Restrictions. Five root lessons remain, plus unfinished worker assignments.

## Reachable Nodes with Restrictions — FULL CHROME PASS

All four steps, all five repairs, and wrong/correct submissions tested. Root15/19; team19/75. Bottom completion buttons saved all steps. Extra probes found contradictory color grading and a misleading counterexample goal.

### Step 1

- B1 n5/edges01,12,03,34/restricted3:fullmarkedtree;wrong4 rejected walkingthroughrestricted3;3 accepted.
- B2 n3/chain0—1—2/restricted1:wrong2 rejected countingrestrictednode;1 accepted.
- Picture B1: A correct accepted,reload,Bmissingnode4 rejected. Repair n6/edges01,12,03,34,45/restricted4/output4 accepted;goodblockeddescendantcontext.
- Membership reversedpairchain0—1—2—3—4/restricted4:C allnodesmarked accepted,reload,Aeraseforbiddennodes rejected. Repair n4/star0→1,2,3(reallyundirected)/restricted1,2/output2 accepted.
- B3 reversedpairchain n5/restricted4:wrong1 rejected directededgeassumption;4 accepted.
- Edgecheck n2/pair01/restricted1:Ctwo-waybutblocked accepted,reload,Bjumpforbiddennode rejected. Repair n5chain/restricted2/output2 accepted;goodactualbypasscontrast.
- Count n7/edges01,12,31,40,05,56/restricted4,5:A4 accepted,reload,B6 rejected countingblocked4,5butstoppingbefore6. Repair n3/star01,02/restricted2/output2 accepted.
- B4 n2/pair01/restricted1:wrong0 rejected omitstart;1 accepted.
- Lastcount n7/edges01,02,05,04,32,65/restricted4,2,1:C3 accepted,reload,A4 rejected because3isbehind2. Repair n3/reversedpairs10,21/restricted2/output2 accepted, but restrictednodeisleafwithnothingbehindit, so walkingthroughrestrictednodeswithoutcountingthemcannotbeexposed.
- FinishStep1saved9/9.

### Step 2

- Corbin/wrongstart:node1createdfirst;tree0—2(restricted)—1—3. Correctstart0,buggystart1,samegraphs.1/1 rejectedbuggyoutput;1/2 accepted. Wording “different node0” is malformed; saydifferentstartingnode.
- Carmen/oneway:tree1—0—2(restricted),firstedgeclicked1then0;duplicatedirected.2/2 rejectedbuggyoutput;2/1 accepted.
- Brennan/firstbranch:followedgoalexactly,tree0—1(restricted)drawnfirstthen0—2. Predicted2/1:graphchecksallpass,butboth exposureandbuggyoutputfail. Changedto2/2:bothoutputsandgraphs pass,onlyexposurefails. Engine skipsblockedfirstbranchbeforeselectingfirstavailablebranch. Addedsecondallowedchild3 after2 inbothgraphs:3/2 accepted. Promptneedstwoallowedbranches,notmerelyblockedthenallowed. FinishStep2saved3/3.

### Step 3

- Star0withblocked1,2andallowed3:hideforbiddennodes Yes rejected,No accepted.
- Chain0—1—2(restricted)—3—4:claim3reaches1throughrestricted2soaddshortcut. Yes rejected,No accepted, but feedback onlyrejectsshortcutanddoesnotcorrectillegalreachabilitypremise.
- Star01,02restricted:0hastwodirectneighbors No rejected,Yes accepted. Distinguishgraphdegreefromlegalmoves.
- Reversedpairchain0—1—2restricted:connection1—0onlyworks1→0 Yes rejected;feedback starts “Yes. This graph is undirected...bothways,” despiteexpectedNo. No accepted.
- n6/edges01,12,03,34,45/restricted4:claimfrom1reaches6nodes. No rejectedwith“followthearrowsexactly...6”;Yes accepted. Legalrestrictedsearch reachesonly0,1,2,3 (4nodes). No instruction saysignore restrictions, directlyconflictingwithproblem'sNEVERstepforbiddenrule. Needexplicitstructuralversuslegalreachabilitydistinctionorgrade4.
- FinishStep3used.

### Step 4

- Traversethenfilter n4/edges01,12,03/restricted1:correctgraphfourmarkednodes. Wrong2/Bblockednodecounted rejected. Correct3/Awalkthrough acceptedforoutput/diagnosisbutcolorsfailed. UI says “Node colors: Color every flooded or blocked node Blue.” Coloredrestricted1Blue,stillcolorsfailed. Coloredthesame1Red;Traceconfirmed,real2. ScreenshotverifiedBlueborderbeforechange. ExactBlueinstructioncontradictsRedgrading. OthernodesleftdefaultSlate. Latercaseshavenocolorruleandpassdefaultcolors.
- nminusrestricted n5/edges01,12,03,34/restricted3:wrong3/Amissingreverse rejected;4/Bn-minusrestricted accepted,real3.76lineswithunusedcorrectrecursivehelpercouldbeshortened;genericchangedgraphtext.
- Directedbuilder n5/reversedchain/restricted4:wrong4/Cfilteronlyaftertraversal rejected;1/Bmissingreverse accepted,real4.76linesofscaffoldingforoneadjacencychange;explanationcorrectbutgeneric.
- Allshowncodeoutputsagreewithacceptedvalues; FinishStep4saved3/3 with5corrections (includingcolorprobes).

Next root lesson: Transitive Closure. Four root lessons remain, plus unfinished worker assignments.


---

# Full original Chrome audit — live ledger

This is the new exhaustive pass requested by the user. Earlier source review and sample probes do not count as completion here. Actual Chrome controls only; one tab. No skips count as passed. All unlisted items remain pending.

## Ownership

This agent: all-paths-from-source-to-target; battleships-in-a-board; course-schedule; detonate-the-maximum-bombs; evaluate-division; find-if-path-exists-in-graph; flatten-nested-list-iterator; is-graph-bipartite; keys-and-rooms; kill-process; letter-combinations-of-a-phone-number; longest-increasing-path-in-a-matrix; minesweeper; nested-list-weight-sum; nested-list-weight-sum-ii; network-delay-time; number-of-connected-components-in-an-undirected-graph; number-of-increasing-paths-in-a-grid.

Root owns the other seven originals. Do not combine these counts with root's work twice.

## All Paths From Source to Target

| Step/item | Manual input and action | Visible feedback | Status |
|---|---|---|---|
| 1/build-diamond | For `[[1,2],[3],[3],[]]`, added nodes0–3, enabled directed edges, drew0→1,0→2,1→3,2→3; selected `[[0,1,3],[0,2,3]]`, submitted | Exact visual proof; node labels, direct edges, direction, decision all passed | Correct pass |
| 1/build-direct-and-long | For `[[1,3],[2],[3],[]]`, added nodes0–3, drew0→1,0→3,1→2,2→3; selected `[[0,1,2,3],[0,3]]`, submitted | Exact visual proof; all four checks passed; direct edge is a complete path too | Correct pass |

| 1/exact-picture wrong | Selected reversed-arrow PictureC for diamond; Check answer | Contradiction; generic direction reversal feedback; correct PictureA revealed | Wrong choice tested |
| 1/remedial-1 | `[[2],[2],[]]`: nodes0–2, directed0→2,1→2; output `[[0,2]]` | Exact visual proof; all checks pass | Repair pass |
| 1/build-merge | `[[1,2],[3],[3],[4],[]]`: nodes0–4; edges0→1,0→2,1→3,2→3,3→4; both complete paths | Exact visual proof; all checks pass | Correct pass |
| 1/core-rule wrong | Selected “only indices0,1,2 because lists contain neighbors” | Correctly explains empty list does not remove node3 | Wrong choice tested |
| 1/remedial-2 | `[[],[0]]`: nodes0,1; edge1→0; output `[]` | Exact visual proof; source0 not target1 and no outgoing arrow | Repair pass |
| 1/build-single-edge | `[[1],[]]`: nodes0,1; edge0→1; output `[[0,1]]` | Exact visual proof; all checks pass | Correct pass |
| 1/relation-rule wrong | Selected add0→3 because eventually reachable | Correctly explains path versus direct edge | Wrong choice tested |
| 1/remedial-3 | `[[],[0],[]]`: nodes0–2; edge1→0; output `[]` | Exact visual proof | Repair pass; weakness below |
| 1/predict-output wrong | Selected only `[[0,1,3]]` for diamond | Correctly identifies missing0→2→3 branch | Wrong choice tested |
| 1/remedial-4 | `[[1,2],[2],[]]`: nodes0–2, edges0→1,0→2,1→2; both paths | Exact visual proof | Repair pass |
| 1/bug-trap wrong | Five-node input `[[4,3,1],[3,2,4],[3],[4],[]]`; chose3paths | Correctly says one route per first neighbor misses branching below1 | Wrong choice tested |
| 1/remedial-5 | `[[1,2],[3],[3],[4],[]]`: exact5nodes/5edges, chose2paths | Exact visual proof | Repair pass |

New live issue: relation-rule repair has no length-two path anywhere, so a student who turns all reachable pairs into direct edges produces the exact same graph. It does not expose the specific shortcut mistake that triggered it. This repeats the bomb remedial weakness on a different lesson.

Pending: all five main visual checks fresh correct pass; all Step2/3/4 cases. All4 builds and all5 wrong+repair branches completed. Remaining17 owned problems: all items pending.

Checkpoint: pressed **Finish visual proof** and observed **9 of9 visual checks passed / Step1 complete**. Then pressed **Practice Step1 again** to begin the fresh correct-answer pass. A native confirmation was returned; attempting acceptance coincided with a second agent's native confirmation and browser control stalled. This is an audit-tool/parallel-browser interruption, **not an app blocker or completed fresh pass**. After root coordinated recovery, this tab's dialog query returned undefined, but the DOM read still timed out on focus emulation. No subsequent item has been tested yet.

### Resumed Chrome — Step2

| Item | Student-created graph and actions | Feedback/outcome |
|---|---|---|
| make-two-way | Correct0,1 with1→0, fixedsource0. Duplicated into buggy drawing. First intentionally left directed toggle ON; supplied real`[]`, buggy`[[0,1]]` | Wrong drawing rejected. After toggleOFF, exactbuggydrawing passed but numeric buggy output still rejected. |
| make-two-way correct + format probe | Same undirected buggy1—0; tried`[]` (rejected), then`[["0","1"]]` | **Counterexample confirmed.** Displayed buggy answer`[[0,1]]`, the exact unquoted value rejected above. High-priority numeric/string grader defect. Semantics passed only with undocumented quoted-ID workaround. |
| shallow-search | Correctnodes0–2 and1→2,0→1, source0; duplicate same graph as explicitly shown heading. Real`[["0","1","2"]]`; wrongbuggy prefix`[["0","1"]]` | All checks except buggy output passed; feedback only checklist, no explanation of incomplete prefix. |
| shallow-search correct | Same drawings; corrected buggy`[]` | Counterexample confirmed; displayed real`[[0,1,2]]`, buggy`[]`. |
| last-branch | Nodes0–2; firstedge0→2, secondedge0→1; source0. Duplicated samegraph. Real`[["0","2"]]`; intentionally predicted buggy same completepath (wrongfirstbranch) | Only buggy output rejected; no case-specific explanation. |
| last-branch correct | Samegraphs, correctedbuggy`[]` | Counterexample confirmed; displayed real`[[0,2]]`, buggy`[]`. |

All3 Step2 cases now submitted wrong and corrected, with semantic solutions accepted using quoted-ID workaround. New UI issue: success still shows “predict the bug: not proven” / unchecked facet from preceding failed attempt until leaving the question. The main “Counterexample confirmed” contradicts the stale sidebar status. Step3/4 and fresh correct Step1checks remain pending.

### Step3 — all5 exact builds, wrong graphs, wrong claims, and correct submissions

Every row received3 submissions: correctverdict with naturalwronggraph; exactgraph with wrongverdict; exactgraph with correctverdict after **Try another check**. All final submissions visibly said **Answer and graph are correct**. Retry retained the drawing and repeated the same claim despite saying “another check.”

| Item/raw input | Wrong drawing tested | Wrong verdict feedback | Exact solution passed |
|---|---|---|---|
| membership `[[],[0]]` | Drew0→1 instead of1→0; No | Yes to paths-as-nodes rejected; feedback says one node per adjacency index | Nodes0,1;1→0; No |
| direct/reach `[[2],[2],[]]` | Omitted1→2; No | Yes to “1 reaches2 but no direct1→2” rejected; feedback identifies directedge | Nodes0–2;0→2,1→2; No |
| degree `[[],[0],[]]` | Omittedisolatednode2 but drewcorrect1→0; Yes | No to “1 hasexactly1 outgoingedge” rejected; feedback restates count1 | Nodes0–2;1→0; Yes |
| direction `[[1,2],[2],[]]` | Drewall3edges undirected; No | Yes to reverse1→0 rejected; feedback identifies0→1 | Nodes0–2;0→1,0→2,1→2; YesDirected; Noverdict |
| reach-count `[[1,2],[3],[3],[4],[]]` | Omitted3→4; Yes | No to “from2 reaches3nodes” rejected; feedback says include start | Nodes0–4;0→1,0→2,1→3,2→3,3→4; Yes |

New feedback inaccuracies: membership reverse-edge submission marks **Edge direction matches** green, even while the sole arrow points backward (apparently checks only Directedtoggle). Degreecheck omitting only isolatednode2 marks **Every exact direct edge is drawn** false even though the soleexpectededge1→0 is present. These checklists can send students to repair an already-correct aspect.

Current AllPaths coverage: Step1 all4builds+all5wrongchecks+all5repairs; Step2 all3 wrong/correct cases; Step3 all5 wronggraph/wrongclaim/correct cases. Step4 and fresh correct Step1checkpass remain pending.

### Step4 — all3 cases wrong and correct submissions complete

| Case | Exact graph built | Natural wrong submission | Correct submission and visible result |
|---|---|---|---|
| globalvisited | Input`[[1,2],[3],[3],[4],[]]`, nodes0–4, all5directedarrows | Outputbothpaths; diagnosisrequiresreversearrows for DFSreturn | Output`[[0,1,3,4]]`; sharedmergenodepermanentlyfinished. **Traceconfirmed**; numericarrayaccepted. Wrongfeedback correctly distinguishes callstack from reverseedges. |
| firstbranchonly | Input`[[1,2],[3],[3],[]]`, nodes0–3, all4arrows | Output`[]`; diagnosisoneedgeonly | Output`[[0,1,3]]`; onlyfirstoutgoingbranch. **Traceconfirmed**. Wrongfeedback just namescorrectbug; changedgraph/ boundary text is genericcounts and “chosenvaluesmake…” rather than specific missedroute. |
| directpathsonly | Input`[[1,3],[2],[3],[]]`, nodes0–3, all4arrows | Output`[[0,1,2,3]]`; diagnosisfirstbranchonly | Output`[[0,3]]`; checksimmediateneighborsonly. **Traceconfirmed**. Same genericfeedbackweakness. |

Pressed **FinishStep4**, observed **3of3codecasespassed / Step4complete / You solvedall3codecases**. Step2 numeric/string defect does not affect these Step4 numeric arrays. No field asks the student to provide the real correct output; it appears only in success feedback.

AllPaths main coverage complete across all4steps **except fresh correct-choice pass for5Step1visualchecks**, still awaiting safe replay method. No skips used in exhaustive AllPaths pass. All17 other ownedproblems stillpending.

## Course Schedule — Step1 first pass

All below used actualAddnode/Directed/endpointclick controls and submitted. Graphs described areexact; expectedoutputs independently derived fromcyclepresence.

| Item | Graph/input and submitted answer | Feedback/status |
|---|---|---|
| build-chain | n3,pairs[[1,0],[2,1]];0→1→2;true | Exactvisualproof |
| exact-picture wrong | Samechain; chose reversedPictureC | Directionreversalfeedback; wrongtested |
| remedial1 | n3,pairs[[1,0],[2,0]];0→1,0→2;true | Exactvisualproof |
| core-rule wrong | n6; choseonlycoursesinprerequisitepairs | Isolatedcoursesexistfeedback; wrongtested |
| remedial2 | n2,noedges;bothnodes;true | Exactvisualproof |
| build-two-cycle | n2,pairs[[1,0],[0,1]];bothdirectedarrows;false | Exactvisualproof |
| relation-rule wrong | Pair[3,1];chose3→1arrayorder | Prerequisitepoints towardunlockedcourse; wrongtested |
| remedial3 | n2,pair[[1,0]];0→1;true | Exactvisualproof |
| build-isolated | n3,pair[[1,0]];0→1plusnode2;true | Exactvisualproof |
| predict-output wrong | n2,pair[[1,0]];choseanyprerequisiteblocksgraduation | Prerequisitecanbefinishedfirst;wrongtested |
| remedial4 | n4,pairs[[1,0],[2,1],[0,2],[3,2]];0→1→2→0plus2→3;false | Exactvisualproof; repairfails toexposechosenmistake: “anyprerequisiteblocks” alsopredictsfalsehere |
| bug-trap wrong | Two-coursecycle;chosetakebothatthesametime | Prerequisitesmustbefinishedfirst;wrongtested |
| remedial5 | n3,pairs[[1,0],[2,0],[2,1]];0→1,0→2,1→2;true | Exactvisualproof |
| build-three-cycle (authoredIDbuild-self-loop) | n3,pairs[[1,0],[2,1],[0,2]];0→1→2→0;false | Exactvisualproof |

CourseStep1 all4builds+all5wrongchoices+all5repairspassed; freshcorrectmainvisualchoicespending. The newly found correct-submit→reload technique will be used on futurevisualchecks tocoverbothpathswithoutreset.

### Course Schedule Step 2 — all three actual Chrome cases

| Case | Student input and mistake | Feedback and correction |
|---|---|---|
| Noor / make-two-way | Nodes 0,1; correct 1→0; start0; buggy undirected 1—0. Real true, wrong buggy true. | Only buggy output failed. Changed buggy output to false: Counterexample confirmed, real true / bug false. |
| Jasper / shallow-search | Nodes 0,1,2; directed cycle 0→1→2→0 in both drawings; start0; real false, wrong buggy false. | Only buggy output failed. Changed bug to true: Counterexample confirmed, false / true. |
| Amara / first-branch | Nodes0,1,2; edges in order 0→1,0→2,2→0 in both drawings; start0; real false, wrong bug false. | All checks passed except buggy output. Changed bug to true: Counterexample confirmed, false / true. Earlier accidental missing return edge correctly failed counterexample and both outputs; not counted as intentional solution. |

All three cases had a submitted natural output mistake and confirmed correct solution. No skips. Generic success text only says that the mistake changes the return value; it does not explain which branch concealed the cycle.

### Course Schedule Step 3 — all five correct and wrong paths

Each row: first submitted wrong graph with correct verdict, then correct graph with wrong verdict, then retried correct graph/verdict. All five finished; visible five checks and Step 3 complete.

| Claim/input | Wrong graph | Wrong verdict feedback | Confirmed correct |
|---|---|---|---|
| Membership; n2, no prerequisites; only cycle nodes become nodes | Only node0; missing1 | Every course ID, including isolated courses, is a node | Nodes0,1; No |
| Direct edge; n2, [[1,0]]; reaches1 without direct0→1 | Both nodes but no edge | 0→1 is one direct edge, not a longer route | 0→1; No |
| Degree; n4, [[1,0],[2,1],[0,2],[3,2]]; node0 has2 outgoing | Correct endpoints, undirected | 0 has1 outgoing edge | 0→1→2→0 plus2→3; No |
| Direction; n3, [[1,0],[2,0],[2,1]]; input creates1→2 | Reversed just1→2 as2→1 | Input creates1→2; direction matters | 0→1,0→2,1→2; Yes |
| Reach boundary; n3, [[1,0],[2,0]]; start1 reaches1 node | Correct endpoints, undirected | Include start and follow arrows; reaches1 | 0→1,0→2; Yes |

Feedback issue repeated: missing isolated node marks both exact nodes and exact edges wrong despite there being no required edges. A reversed arrow marks “Edge direction matches” green; it apparently tests only directed mode. Mode failures were accurately flagged on the undirected attempts.

### Course Schedule Step 4 — all three code cases

| Case/input | Exact graph and wrong submission | Correct retry and feedback |
|---|---|---|
| Global visited / diamond n4 | 0→1,0→2,1→3,2→3; wrong true and reversed-arrow diagnosis | false; confuses older-branch visit with current path. Trace confirmed; real true. Specific feedback explains two acyclic branches merging at3. |
| Any prerequisite / chain n3 | 0→1→2; wrong true and merge-is-cycle diagnosis | false; selected “a one-way prerequisite can be completed; only a path returning to an active course is a cycle.” Trace confirmed; real true. |
| Only reversed pairs / three-course cycle | 0→1→2→0; wrong false and any-prerequisite-is-cycle diagnosis | true; selected “a cycle may pass through three or more courses without containing a reversed pair.” Trace confirmed; real false. |

Visible Step 4 complete, 3/3 code cases, three corrections. No skips. Cases2–3 ask what behavior this incorrect code creates, but the accepted answers instead describe correct reasoning / general graph facts. The feedback labels those facts “Code rule,” even though the shown incorrect code does not implement them. Generic “3 nodes and 2/3 direct connections” and “changes which nodes, paths, or values contribute” do not explain the actual failure. Recommend accepted diagnoses “rejects every nonempty prerequisite list” and “checks only opposite-arrow pairs, missing longer cycles,” followed by input-specific explanations.

Live persistence finding: after receiving correct feedback for Step3 claim5, clicking header Next: Step4 instead of bottom Finish Step3 lost the successful answer and drawing. Returning showed four of five checks, fresh blank last graph. Resubmitted and used Finish to save. Success should save immediately, or navigation should warn about unsaved success. This is separate from deliberate reload technique used for dual-path testing.

Course coverage checkpoint: Step1 4 builds, 5 wrong visual choices, 5 correct repairs; Step2 3 wrong/correct cases; Step3 5 wrong-graph/wrong-verdict/correct cases; Step4 3 wrong-output/wrong-diagnosis/correct cases. Pending: five fresh correct Step1 main choices. Remaining other16 owned originals still pending exhaustive testing.

## Keys and Rooms — full Chrome run

### Step 1 complete, all paths tested

Used correct answer → read success → reload same question → wrong answer → repair for every visual check. All four builds, all five correct main answers, all five wrong main answers, and all five repairs tested. Visible 9/9, five corrections, Step1 complete.

| Item | Exact input/action | Observed feedback/result |
|---|---|---|
| Build chain | [[1],[2],[3],[]]; 0→1→2→3; true | Exact visual proof; later keys continue route |
| Build disconnected | [[1],[0],[3],[]]; 0↔1,2→3; false | Exact visual proof; no reachable room gives access to2 |
| Picture check | [[1],[2],[3],[]]; correct A full chain; then wrong C reversed chain | Correct accepted; wrong says one-way relations reversed |
| Picture repair | [[1,2],[],[]]; 0→1,0→2; true | Exact visual proof |
| Build one-way lock | [[],[0]];1→0;false | Exact visual proof; key in locked1 cannot enter1 |
| Core rule | [[1],[],[]]; correct B all three room IDs; then wrong A only reachable0,1 | Both paths tested; explains omission would falsely pass all-rooms check |
| Core repair | [[1],[],[1]];0→1,2→1;false | Exact visual proof |
| Build singleton | [[]];node0;true | Exact visual proof;0 already unlocked |
| Relation | [[1],[]]; correct D 0→1; wrong C also draw arrows to rooms1 later unlocks | Correct accepted; C rejected with “Those rooms may be reachable by a path...” |
| Relation repair | [[1],[],[0]];0→1,2→0;false | Exact visual proof |
| Predict | [[1],[2],[3],[]]; correct B later keys continuechain; wrong A room0 lacks directkeys2,3 | Correct accepted; wrong explained later keys continue |
| Predict repair | [[1],[0,2],[3],[]];0↔1,1→2→3;true | Exact visual proof;cycle does not block extra key |
| Bug trap | [[1,3],[3,0,1],[2],[0]]; correct D room2 self-key inaccessible; wrong C allnumbers appear askeys | Correct accepted; wrong key only useful when containingroom accessible |
| Bug repair | [[1],[0],[3],[2]];0↔1,2↔3;false | Exact visual proof; locked component despite allnumbers appearing |

New relation distractor defect: C says “Also draw arrows from0 to every room that room1 can later unlock.” In the exact shown input room1 has no keys, so that adds no arrows. As an addition to0→1, it produces the correct drawing. Feedback falsely suggests there are later reachable rooms here. Use a three-room chain to expose shortcut creation, or use a definitely wrong concrete arrow. The repair has path2→0→1, so it can expose global shortcut addition, but not this exact selected statement about extras from0 through1.

Repeated output-choice weakness: all nine graph decisions expose only Boolean true/false, but add a third duplicated Boolean with silly fallback justification. The student can eliminate that by wording rather than reasoning.

### Keys and Rooms Step 2 — all three cases passed

| Case | Inputs, deliberate mistake, correction | Feedback |
|---|---|---|
| Elena/two-way | Two nodes,1→0, fixedstart0. Bug undirected1—0. Real false; wrong bugfalse→true | Only bug output failed; corrected returns false/true, Counterexample confirmed |
| Micah/missing-last-link | Three nodes, edges0→1#1,0→2#2. Bug initially duplicated both; realtrue,bugfalse. Removed bugedge0→2 | Only buggy drawing failed; corrected true/false, Counterexample confirmed |
| Gia/first-branch | Three nodes,0→1#1,0→2#2; both drawings same; realtrue, wrong bugtrue→false | Only bug output failed; corrected true/false, Counterexample confirmed |

Used Finish Step2. All3 wrong/correct cases, no skips. Generic success explanation supplies no specific key/room boundary. After successful correction, facet still showed “predict the bug:not proven” until Next.

### Keys and Rooms Step 3 — all five passed with both mistake types

Each row submitted wrong graph/correct verdict, then exact graph/wrong verdict, then exact graph/correct verdict. Finished all5 with bottom Finish button.

| Claim | Wrong graph | Correct graph/verdict; wrong-verdict teaching |
|---|---|---|
| Startroom omitted; [[1],[],[1]] | Missing2→1 |0→1,2→1;No; every room index becomesnode |
| Addshortcut1→3; [[1],[0,2],[3],[]] | Added1→3 |0↔1,1→2→3;No; twoedges don't create shortcut |
| Node2 has1outgoing; [[1],[0],[3],[2]] | Missing3→2 |0↔1,2↔3;Yes;node2has1outgoing |
| Arrow0→2; [[1,2],[],[]] | Undirected fork |0→1,0→2;Yes;direction matters |
| Start0 reaches3; [[1],[],[0]] | Undirected chain |0→1,2→0;No;start0 reaches2nodes |

All three grading checks responded as expected to these mistakes. Input repeats are substantial: every Step3 graph is a previously solved Step1 repair, despite completion calling them five different graphs. They are different from one another, but not fresh transfer examples.

### Keys and Rooms Step 4 — all three passed

| Case | Exact graph, wrong output/diagnosis | Correct retry and feedback |
|---|---|---|
| Reverse key / [[],[0]] |1→0; wrongfalse + starts0locked |true + invents reverse move. Traceconfirmed;realfalse. Specific invented0→1 explanation, but “Changed graph” section actually describes unchanged original graph. |
| Only room0keys / [[1],[2],[3],[]] |0→1→2→3; wrongtrue + everyroomneedskey |false + newlyfoundkeys neverfollowed. Traceconfirmed;realtrue. Generic node/edgecounts and contribution sentence instead of explicit visited{0,1} versus{0,1,2,3}. |
| Everyroomhasakey / [[1],[]] |0→1; wrongtrue + checksjustroom0keys |false + requireseveryroomkey. Traceconfirmed;realtrue. Specific, useful feedback: reachable empty room1 isvalid. |

Visible Step4 complete,3/3,threecorrections. Keys and Rooms is fully browser-tested under assigned checklist:4builds,5correct+wrongvisualchecks,5repairs,3wrong/correctcounterexamples,5wronggraph/wrongverdict/correctclaims,3wrongoutput/wrongdiagnosis/correctcodecases. No skips. Other15 owned originals pending; All Paths/Course only fresh correct Step1 main choices pending.

## Find if Path Exists in Graph

### Step1 fully tested:4builds,5correct/wrongchecks,5repairs

All drawings undirected and all declared n vertices included. Each visual correct submitted/read, reloaded, wrong submitted/read, repair solved. Finished9/9,5corrections, no skips.

| Item | Input/action | Feedback/result |
|---|---|---|
| Buildtriangle |n3;0—1,1—2,2—0;s0,d2;true |Exactproof;directandvia1routes |
| Picture |Sametriangle;correctA;wrongCdirectedtriangle |Correctaccepted;wrongone-waymovement |
| Picturerepair |n4;0—1—2 plus3;s0,d3;false |Exactproof;isolated3 |
| Builddisconnected |n6;0—1,0—2,3—5,5—4;s0,d5;false |Exactproof;differentcomponents |
| Corerule |n6,edges0—1—2;correctB all6;wrongA only0,1,2 |Explains3,4,5existdespitenoedges |
| Corerepair |n3;0—1 plus2;s2,d0;false |Exactproof;sourceisolatednotabsent |
| Relation |edge[1,2];correctCtwo-way;wrongAonly1→2 |Arrayorderdoesnotsetdirection |
| Relationrepair |n3,edges[[1,0],[2,1]],s0,d2;two-waychain;true |Exactproof;crossagainstwrittenorder |
| Buildreversepair |n2,edge[1,0],s0,d1;true |Exactproof |
| Predict |Triangle;s0,d2;correctD[2,0]two-way;wrongBcycleblocksDFS |Visitedtrackinghandlescycle |
| Predictrepair |n5;0—1—4,0—2—3—4;s0,d4;true |Exactproof;atleastonebranchreaches4 |
| Buildsamevertex |n3,noedges;s2,d2;true |Exactproof;zeroedgepath |
| Bugtrap |n6;0—1,0—2;3—5—4—3;s0,d5;correctBnoedgecrosses;wrongAconsecutivelabels2,3createbridge |Consecutivelabelsdonotcreateedges |
| Bugrepair |n4;0—1—2—3;s0,d3;true |Exactproof |

New repair defect: after selecting “consecutive labels create an implicit bridge,” remedial input is exactly the full consecutive-label chain0—1—2—3. The same mistaken consecutive-label rule produces the correct graph and true output. This repair cannot show that misconception has been corrected. Use a missing consecutive pair / nonconsecutive listed edge.

Repetition: triangle rawinput appears in build, exactpicture, and predictcheck; direction already tested by relation, relationrepair, reversepairbuild, and predict. Many questions test same two-way rule while multihop/no-shortcut reasoning gets little fresh work. Duplicate Boolean choices recur.

### Find Path Step2 — all three wrong/correct cases

| Case | Drawing/input | Wrong then correct |
|---|---|---|
| Lila/directed |Nodes0,1;correct1—0 clicked1then0;bug1→0;s0,d1 |realtrue,bugtrue rejected onlybugoutput;bugfalse confirmed |
| Ravi/firstbranch |Nodes0,1,2;0—1#1,0—2#2;bothdrawingssame;s0,d2 |realtrue,bugtrue rejected onlybugoutput;bugfalse confirmed |
| Esme/wrongstart |Nodes0,1,2;0—2 plusisolated1;bothsame;s0,d2;bugstart1 |realtrue,bugtrue rejected onlybugoutput;bugfalse confirmed |

All Counterexampleconfirmed true/false; usedFinishStep2. Generic explanations and stale success facets recur.

### Find Path Step3 — all five correct/wrong cases

Each case tested wronggraph/correctverdict, exactgraph/wrongverdict, exactgraph/correctverdict. Allfivefinished, no skips.

| Claim and input | Wrong graph | Exact result / wrong-verdict feedback |
|---|---|---|
| Merge0,1; n3,edge0—1,s2,d0 |Droppedisolated2 |0—1 plus2;No;one node perID |
| Add0—2shortcut; n4,0—1—2 plus3 |Added0—2 |chainplus3;No;twoedgesdon'tcreate shortcut |
| Node0degree1;n3,edges[1,0],[2,1] |Missing1—2 |0—1—2;Yes;0has1neighbor |
| 1—4worksbothways;n5,two-routecycle |Directedallfiveedges |undirected0—1—4—3—2—0;Yes;undirected meansbothways |
| Start1reaches3;n4,0—1—2—3 |Missing0—1 |fullchain;No;reaches4includingstart |

Last wrong-verdict feedback says “follow the arrows exactly” even though this lesson is undirected, a confusing shared-template term. Membership missingnode still incorrectly also flags exactedges even soleedgecorrect. Allfiveinputs already appeared as Step1 repairs.

### Find Path Step4 — all three code cases

| Case | Exactgraph; wrongoutput/diagnosis | Correct retry |
|---|---|---|
| One-waystorage |n3,1—0,2—1;s0,d2;wrongtrue + stopsfirstdeadend |false + storesfirst→secondonly;Traceconfirmed,realtrue |
| Directedgeonly |n5,0—1—4—3—2—0;s0,d4;wrongtrue + one-waystorage |false + searchneverleavesimmediateneighbors;Traceconfirmed,realtrue |
| Hardcodedstart0 |n3,noedges;s2,d2;wrongtrue + directedgeonly |false + ignoressuppliedsource;Traceconfirmed,realtrue |

FinishedStep4visible3/3,threecorrections. Lasttwo feedback sections give onlynode/edgecounts and genericcontributionwords, not actualboundaries (direct-only checks0neighbors1,2; wrongstart visits{0} instead of{2}). Case1 “Changedgraph” actuallydescribesthecorrectundirectedchain ratherthanbuggraph, though final explanation correctlyidentifies0hasnoneighbors.

Find Path fully tested under checklist. Overall owned18: Keys/FindPath full; AllPaths/Course allitems tested exceptfivefreshcorrectmainStep1choices each; other14ownedoriginals pending.

## Number of Connected Components in an Undirected Graph

### Step1 all paths complete

Correctthenreloadthenwrongthenrepair on all5visualchecks; all4builds, all5correct/wrongmainchecks,all5repairs,finished9/9,fivecorrections.

| Item | Input/actions | Feedback |
|---|---|---|
| Buildtwo |n5,0—1—2 and3—4;2 |Exactproof;twogroups |
| Buildchain |n5,0—1—2—3—4;1 |Exactproof;alllinked |
| Picture |n5two-groups;correctA;wrongBdrop3—4 |Correctaccepted;wrongdropslistedconnection |
| Picturerepair |n3,0—1plus2;2 |Exactproof |
| Buildisolated |n4,noedges;4 |Exactproof;eachowncomponent |
| Corerule |n5,0—1—2;correctCfivevertices;wrongDthreecomponentnodes |Mustfirstcontainindividualvertices |
| Corerepair |n5,0—1,2—3,isolated4;3 |Exactproof |
| Buildcycle |n3triangle;1 |Exactproof;cycleonecomponent |
| Relation |0—1—2;correctAno0—2;wrongBadd0—2 |Pathnotdirectedge |
| Relationrepair |n3,edges[1,0],[2,1];undirectedchain;1 |Exactproof |
| Predict |n5,0—1—2 and3—4;correctC2;wrongA3 |Mistakesthreelistededgesforthreegroups |
| Predictrepair |n6,triangles0—1—2—0 and3—4—5—3;2 |Exactproof |
| Bugtrap |n5chain;correctA1;wrongD2 |Middleedgeconnectsleftandright |
| Bugrepair |n4,triangle0,1,2plusisolated3;2 |Exactproof |

Question redundancy: predict repeats exact firstbuild's input/output; bugtrap repeats exact chainbuild's input/output. The last repair (triangle+isolated) changes task to isolation rather than teaching not to split a connected chain. Numeric wrong2's feedback assumes a specific invented middle cut not actually established by answer alone.


---

# Actual Chrome audit: variants

Only observed Chrome interactions count here. Earlier source-review findings are separate. Status remains IN PROGRESS.

## Scope

Own 19 lessons: who-keeps-their-job, busiest-shelf-level, coins-on-level-k, counting-constellations, counting-docked-boats, routes-past-the-coffee-cart, villages-without-wells, gas-pocket-survey, gold-and-silver-lights, dungeon-gold-run, flooded-campsite-trails, longest-freight-train, one-color-metro-ride, office-rumor-reach, package-to-the-outpost, perfect-size-campsites, count-routes-to-summit, runes-on-the-castle-door, museum-vault-keyring. Root tests the other six variants.

All unlisted items remain PENDING. No skips count as completed. Each lesson requires 4 builds, 5 checks (wrong and correct), 5 repairs, 3 Step2 cases, 5 Step3 cases, and every Step4 case.

## who-keeps-their-job

Live title is **After the Big Resignation**, unlike the local review title. Tab381534190 at the deployed site. All graphs built with visible Add node, Rename, Directed edges, and node selection controls. No injected answers or state.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S1 build quit-middle | ids10,2,7,15; bosses0,10,10,2; quit2. Draw10→2,10→7,2→15. Choose wrong[7,10,15]. | All graph rows✓; decision×. “This removes only the quitter and leaves their report15.” | Wrong-answer test complete |
| S1 build quit-middle | Same graph; revised answer[7,10]. | “Exact visual proof.” All4rows✓; “Employees2 and15 leave;7 and10 remain.” | PASS |
| S1 visual concept-picture | Same input; select PictureB missing2→15. | “Contradiction found”; reveals PictureA; “This drops a direct relation listed in the input.” Requires fresh proof. | Wrong test complete; correct main pass PENDING |
| S1 repair1 | ids3,8,1; bosses0,3,8; quit8. Initially missing8→1, answer[3]. | Nodes✓,edges×,direction✓,decision✓. No specific missing edge identified. | Wrong-graph test complete |
| S1 repair1 | Add8→1, keeping3→8; answer[3]. | “Exact visual proof”; all4rows✓. “Quitting8 removes8 and report1.” | PASS |

Observed interaction issue: rapidly clicking3→8 followed by8→1 opened rename on8, so the second edge was not created. Enter-key node selection avoids this. Coordinate/AX node references also change after graph edits; that latter detail is an automation limitation, not a student defect.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S1 build quit-leaf | ids6,1,8,3; bosses0,6,6,1; quit3. Draw6→1,6→8,1→3; answer[1,6,8]. | Exact proof, all4rows✓. Only leaf3 leaves. | PASS |
| S1 visual concept-node | Eight-employee input rooted4, quit9. Wrong: only managers become nodes. | Reveals every employee ID; explains individual contributors can leave with their boss. | Wrong test complete; correct main PENDING |
| S1 repair2 | ids50,4,6; bosses0,50,50; quit4. Draw50→4,50→6; answer[6,50]. | Exact proof, all4rows✓. Only leaf4 leaves. | PASS |
| S1 visual concept-edge | Same eight-employee input. Wrong: report→boss. | Explains storage direction would walk toward ancestors; reveals boss→report. | Wrong test complete; correct main PENDING |
| S1 repair3 | ids9,2,1; bosses0,9,2; quit2. Draw9→2→1; answer[9]. | Exact proof, all4rows✓. Downward subtree contains2 and1. | PASS |
| S1 build quit-root | ids4,9,2; bosses0,4,4; quit4. Draw4→9,4→2; answer[]. | Exact proof, all4rows✓. Every employee is in CEO4 subtree. | PASS |
| S1 visual concept-output | ids10,2,7,15; quit2. Wrong[10,7]. | “Right people but wrong numeric order;7 comes before10.” | Wrong test complete; correct main PENDING |
| S1 repair4 | ids11,2,30; bosses0,11,11; quit30. Draw11→2,11→30; answer[2,11]. | Exact proof, all4rows✓. Only30 leaves;2 sorts before11. | PASS |
| S1 build non-contiguous-ids | ids20,5,90,7; bosses0,20,20,5; quit5. Draw20→5,20→90,5→7; answer[20,90]. | Exact proof, all4rows✓. Employees5 and7 leave;20 and90 stay. | PASS |
| S1 visual concept-counterexample | ids6,1,8,3; quit3. Wrong[6,8]. | “Employee1 is above the quitter, so1 stays.” | Wrong test complete; correct main PENDING |
| S1 repair5 | ids[42],bosses[0],quit42. One directed node42, no edges; answer[]. | Exact proof, all4rows✓. Quitter always leaves even with no reports. | PASS |

Checkpoint: all4builds passed; all5visual wrong answers tested; all5repairs passed. Fresh correct-answer visual pass and all later steps remain pending.

Clicked Finish visual proof: observed9of9,7corrections, “Step1complete” and “You built four fresh inputs and checked five realistic mistakes.” Clicked PracticeStep1again for fresh correct-main pass; native confirmation appeared. Concurrent confirmation dialogs from other audit tabs stalled Chrome. Root is clearing the dialog. This is a shared browser-session issue, not marked as an app blocker. Work resumes from the visible state afterward.

## Paused: Chrome connection blocked

Root attempted dialog recovery, native inspection, connection resets, and supported new-tab APIs. Existing tabs time out on focus commands; new-tab APIs report that tabs cannot move between different profiles. Browser calls stopped on root instruction. Full scope remains outstanding; no untested item is counted as passed or app-blocked.

Resume state: existing tab381534190, who-keeps-their-job, after clicking PracticeStep1again. Read its visible state before acting. Complete fresh correct choices for all5mainvisualchecks (rebuild the4requiredgraphs as needed), then all3Step2cases, all5Step3cases, all3Step4cases. Continue every remaining assigned18lesson through allsteps. The six variants reassigned to root remain outside this reviewer’s Chrome ownership.

## Resumed: Chrome tab381534201

Opened who-keeps-their-job Step2 after connection recovery. Avoiding native restart confirmations; fresh Step1 correct-main pass still pending.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S2 Charles reverse arrows | Invented nodes1,2; correct1→2;quit1. Initially duplicate1→2 for Charles, outputs[] and[2]. | Correct graph, exposure, rules, both outputs✓; Charles drawing×. | Natural wrong-graph test complete |
| S2 Charles reverse arrows | Delete copied edge;draw2→1;outputs[]/[2]. | “Counterexample confirmed”; correct[];Charles[2]. | PASS |
| S2 Maria one-hop | Invented1→2→3,quit1; duplicate same graph as requested. Wrong outputs[]/[]. | Graphs and real output✓;Maria output×. | Natural wrong-output test complete |
| S2 Maria one-hop | Revise Maria output to[3]. | “Counterexample confirmed”; correct[];Maria[3]. | PASS |
| S2 Luis drops last edge | Invented1→2,quit1; copied graph then deleted sole edge. Wrong outputs[]/[1,2]. | Graphs and real output✓;Luis output×. | Natural wrong-output test complete |
| S2 Luis drops last edge | Revise Luis output to[2]. | “Counterexample confirmed”; correct[];Luis[2]. | PASS |

Additional live issue: after Charles's revised graph passes, matching-graph facet still says “not proven” until navigation, even though the case is confirmed. Wrong-output feedback for Maria/Luis gives only a cross next to the output label and no explanation of the reached boundary. Successful feedback is generic: “the single graph or search mistake changes the real function's returned value.”

Step2 finish screen verified3/3,3corrections, “Step2complete.”

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S3 claim1 membership | ids50,4,6;bosses0,50,50;quit4. Wrong onlynode50 + Yes to leaving out leaves. | Claim×; exact node rule includes employees managing nobody. | Wrong verdict tested |
| S3 claim1 graph | Same onlynode50, correct No. Then add4,6 and50→4,50→6. | First nodes×edges×direction✓; then “Answer and graph are correct.” | Wrong graph tested;PASS |
| S3 claim2 direct/reach | ids3,8,1;bosses0,3,8;quit8. Draw3→8→1 plus shortcut3→1. Wrong No to reachability without directedge. | Claim×; multistep route creates reachability, not directedge. | Wrong verdict tested |
| S3 claim2 graph | Correct Yes with shortcut retained; then remove3→1. | First nodes✓edges×direction✓; then answer+graph correct. | Wrong graph tested;PASS |
| S3 claim3 degree | ids9,2,1;bosses0,9,2;quit2. Reverse graph1→2→9. Wrong Yes to9having0outgoingedges. | Claim×;9has1outgoingedge. | Wrong verdict tested |
| S3 claim3 graph | Correct No, reversedgraphretained;then replace edges with9→2→1. | First nodes✓edges×direction✓;then answer+graph correct. | Wrong graph tested;PASS |
| S3 claim4 direction | ids11,2,30;bosses0,11,11;quit30. Undirected11—2,11—30. Wrong No to11→2. | Claim×;input creates11→2. | Wrong verdict tested |
| S3 claim4 graph | Correct Yes with undirectedgraph;then turnDirectedon. | First nodes✓edges✓direction×;then answer+graph correct. | Wrong graph tested;PASS |
| S3 claim5 boundary | ids42,bosses0,quit42. Wronggraph0→42;wrongYes tostart42reaches0. | Claim×;include start, reaches1. | Wrong verdict tested |
| S3 claim5 graph | Correct No,extra0retained;then delete0andincidentedge. | First nodes×edges×direction✓;then answer+graph correct. | Wrong graph tested;PASS |

Live feedback issue: Step3 says “Edge direction matches” for graph1→2→9 when every required arrow is reversed; it appears to mean only whether directed mode is enabled. The missing/extra-edge error is too generic to resolve that contradiction. Also “Every exact node is drawn” is marked× for extra node0 even though all required nodes are present; wording should explicitly cover extras.

Step3 finish verified5checks and “Step3complete.”

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S4 case1 removes-quitter-only | ids10,2,7,15;bosses0,10,10,2;quit2. Exact graph10→2,10→7,2→15. Wrong intendedoutput[7,10] and upward-traversal diagnosis. | Graph rows✓;diagnosis×output×. Explains code never traverses eitherdirection;only2entersleaving. | Natural mistake tested |
| S4 case1 correction | Output[7,10,15];diagnosis removesquitterbutneverfollowsedges. | Traceconfirmed;buggy[7,10,15],real[7,10]. | PASS |
| S4 case2 descendants-only | ids4,9,2;bosses0,4,4;quit4. Exact4→9,4→2. Wrong[] and direct-report-only diagnosis. | Graphrows✓;diagnosis×output×. Explains loopwouldexplorelowerlevels,onlychildrenenter gone. | Natural mistake tested |
| S4 case2 correction | Output[4];diagnosisforgetsthequitter. | Traceconfirmed;buggy[4],real[]. | PASS |
| S4 case3 ID/index | ids20,5,90,7;bosses0,20,20,5;quit5. Exact20→5,20→90,5→7. Wrong[20,90],correctindexdiagnosis. | Graph anddiagnosis✓;output×;code recordsindex3notID7. | Natural mistake tested |
| S4 case3 correction | Output[7,20,90];reselectcorrectindexdiagnosis. | Traceconfirmed;buggy[7,20,90],real[20,90]. | PASS |

Step4 finish verified3/3,3corrections, “You solved all3codecases.” Every employee Step2–4 item now has naturalwrong and correct UI submissions. Step1 fresh correct-main answers still pending.

Newliveissue: in S4case3, after a failed output submission, the already-correct diagnosis was silently deselected. Editing only the output left Check disabled despite feedbackstill sayingdiagnosis✓. Reselectingthe samecorrectdiagnosis enabledsubmission. Also S4“Changed graph” feedback describes the realgraph, not a changedgraph, andcase1“Reachable boundary” merelysays a descendant exists rather than specifyingthe code's reachedset. Realcorrectoutput is displayed afterpassing but neveraskedfor/graded.

## Busiest Shelf Level — live Chrome, in progress

All drawings below use a directed node for every array and integer, named by its exact index path and value; edges connect only direct children. No skipped items.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S1 build1 | items=[1,[2,3],[[4]]]. Full 8-node tree. Wrong depth1 (counting containers), then correct2. | Graph rows all✓; wrong result× with generic “final calculation ... off by1”; revised “Exact visual proof.” | Wrong + PASS |
| S1 visual1 | Same input. PictureD drops deepest integer4. | Contradiction; correctPictureA; explains missing entity. | Wrong tested; correct main pending |
| S1 repair1 | items=[1,[4,[6]]]. Full6-node tree, result1 because all occupied depths tie. | Exact visual proof, depth1 has1integer, shallower wins. | PASS |
| S1 visual2 membership | Same main input. A onlyintegers, arrayspunctuation. | Contradiction; arrays needed to retain nesting/depth. | Wrong tested; correct main pending |
| S1 repair2 | items=[[-3,3],[0]]. Full6-node tree, answer2. | Exact visual proof; depth2 has3integer items. | PASS |
| S1 build2 | items=[[],1,[2,[]]]. Full6-node tree; wrong2 then correct1. | Wrong result says deeper tie choice; correct accepted. | Wrong + PASS |
| S1 visual3 direct containment | Main input. CorrectA directchildren, submit; reload same question. Then wrongB allintegersanywhere. | Correct “Picture read correctly”; wrong explains shortcuts make deepitems shallow. | Correct + wrong tested |

| S1 repair3 | items=[[],[5]], full4-node tree, answer2. | Exact visual proof. | PASS |
| S1 build3 | items=[[3,2],5,[[4]]], full8-node tree. Wrong3 (deepest), then correct2. | Wrong feedback “shifts integer depth when crossing an array container”; correction accepted. | Wrong + PASS |
| S1 visual4 busiest depth | items=[1,[2,3],[[4],[5,6,7]]]. CorrectA depth3; reload; wrongB depth2. | Correct names4,5,6,7; wrong explains depth2 only2,3. | Correct + wrong |
| S1 repair4 | items=[[1],2,[3]], full6-node tree, answer2. | Exact visual proof. | PASS |
| S1 visual5 tie | items=[[],1,[2,[]]]. CorrectB depth1; reload; wrongA depth2. | Correct shallower tie rule; wrong explains loses tiebreak. | Correct + wrong |
| S1 repair5 | items=[0,[0,[9]]], full6-node tree, answer1. | Exact visual proof. | PASS |
| S1 build4 | items=[7], root→root[0]=7. Wrong0 then correct1. | Wrong “shifts integer depth”; revised accepted. | Wrong + PASS |
| S2 Amelia reverse | Student design items=[7], correct root=[]→root[0]=7, reversed second. Realoutput1; buggy0,NaN,[] tried. | All graph/validity/truth rows✓; only buggyoutput× for all3 entries. | APP-BLOCKED; visible skip used once |
| S2 Diego last branch | Design items=[1,2,[3]], full5-node tree; root→item1 edge1, root→item2 edge2, root→array edge3, array→3 edge4. Duplicate samegraph as heading instructs. Real1; wrongbug1 then correctbug2. | Wrong onlybugoutput×; then Counterexampleconfirmed real1,bug2. | Wrong + PASS |

S1 finish screen verified9/9,9corrections. Maincorrect1/2 still require replay; all other S1 paths tested. Reload immediately after a correct main answer safely preserves the current question and avoids native Restart confirmation.

S2 began with preexisting0/3,2corrections (root's earlier probes shared persisted progress). One skip from Amelia went straight to Diego; after Diego pass button was FinishStep2. Finish screen1passed,2skipped. The unshown case is PENDING, not tested; need safe replay. Amelia is app-blocked, not completed.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S3 claim1 membership | items=[[-3,3],[0]]. Wrong graph omits root[0][1]=3 (merges with -3), wrong Yes. Then correct No, same graph; then add distinct3 and parentedge. | Wrong verdict exactnode rule; corrected verdict nodes×edges×; corrected graph accepted. | Wrong verdict + wrong graph + PASS |
| S3 claim2 direct/reach | items=[[],[5]]. Full tree plus root→5 shortcut. Wrong Yes to shortcutclaim, then No, then delete shortcut. | Explains twoedges do not create shortcut; nodes✓edges×; corrected graph accepted. | Wrong verdict + wrong graph + PASS |
| S3 claim3 degree | items=[[1],2,[3]]. Fullnodes but omit root→2. Wrong No to root has3outgoing; then Yes; then restore edge. | Says roothas3; correctverdict edges×; corrected graph accepted. | Wrong verdict + wrong graph + PASS |
| S3 claim4 direction | items=[0,[0,[9]]]. Full tree drawn undirected. Wrong Yes to reversearrow item0→parent; then No; then enable directed. | Explains parent→item direction; correctverdict nodes✓edges✓direction×; corrected graph accepted. | Wrong verdict + wrong graph + PASS |
| S3 claim5 boundary | items=[1,[4,[6]]]. Fullnodes omit deepestedge to6. Wrong No to subtree root[1] reaches4nodes; then Yes; restore edge. | Include start, reaches4; correctverdict edges×; corrected graph accepted. | Wrong verdict + wrong graph + PASS |

S3 finish verified five ticks and Step3complete. Membership claim merges **-3 and3**, which are different values: less believable than repeated equal integers at different positions, and feedback only restates broad node rule instead of explaining position identity/sign distinction.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S4 case1 counts containers | items=[1,[2,3],[[4]]]. Exact8-node tree. Wrongoutput2 and deeper-tiebreak diagnosis. Then output1 and countsallarrayelements diagnosis. | Wrong diagnosis/output×; explains strictgreater keeps shallower, false tiecreatedbyboxes. Correct Traceconfirmed bug1,real2. | Wrong + PASS |
| S4 case2 sums labels | items=[[3,2],5,[[4]]]. Exact8-node tree. Wrongoutput2 and onlyfirstshelf diagnosis. Then output1 and sumlabels diagnosis. | Wrong diagnosis/output×; says loopmoves to `next`. Correct Traceconfirmed bug1,real2. | Wrong + PASS |
| S4 case3 stops at empty level | items=[[],[5]]. Exact4-node tree. Wrongoutput2 and flattenallatonce diagnosis. Then output0 and empty-levelstop diagnosis. | Wrong diagnosis/output×; says one flat perloop. Correct Traceconfirmed bug0,real2. | Wrong + PASS |

S4 finish verified3/3,3corrections, all3codecasessolved. Shelf remaining: S1 correctmain1/2 replay; one unshown S2case replay; Amelia S2 appblocked. AllS3/S4 finished.

### New live shelf code teaching defects

- **High: S4case3 contains two bugs.** Shown code returns `largestCount`, never tracks depth, in addition to its early break on zero integers. Removing only the advertised break would return1, still wrong for desired depth2. The case violates the single-misconception requirement. Feedback compounds it: “It returns0 instead of the correct maximum count2.” Maximum count is1;2 is the depth. Rewrite code to track/return depth, then isolate earlybreak; fix feedback nouns.
- **Medium: S4case2 falsely blames correct tie rule.** Code uses strict `>` and properly keeps shallowerlevel on ties. Success feedback says “the wrong tie rule keeps level1.” Only the summed-label metric is wrong; do not teach students to change a correct tie rule.
- **Medium: shelf terminology flips.** Case1 uses boxes for inner arrays, but case2 calls integers boxes and says “counts array containers as boxes”; case3 says “empty-box shelf” even though it contains two arraycontainers. Use array/container vs integer/item consistently.
- **Low: stale variable reference.** S4case2 wrong onlyfirstshelf feedback says loop moves to `next`; shown variable is `nextLevel`.

## Coins on Level K — live Chrome, in progress

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S1 build1 | items=[1,[2,3],[[4]]],k1. Full8-node directed tree. Wrong5, correct1. | Wrong includescoinsoneleveldeeper; corrected exactproof. | Wrong + PASS |
| S1 build2 | items=[[],1,[2,[]]],k2. Full6-node tree. Wrong3, correct2. | Wrong adds shallowercoins; corrected exactproof. | Wrong + PASS |
| S1 visual1 picture | Maininput k1. CorrectPictureA submit/reload; wrongPictureB missing deepestedge. | Correctpicture; wrong dropsdirectrelation. | Correct + wrong |
| S1 repair1 | items=[1,[4,[6]]],k2. Full6-node tree,answer4. | Exactproof. | PASS |
| S1 visual2 membership | items=[[3,2],5,[[4]]],k2. CorrectD allboxescoins submit/reload; wrongA onlytargetcoins. | Correct fullnestingtree; wrong says needrootstructure toknowdepth. | Correct + wrong |

| S1 repair2 | items=[[-3,3],[0]],k2. Full6-node tree,0. | Exactproof. | PASS |
| S1 build3 | items=[[3,2],5,[[4]]],k3. Full8-node tree,wrong14then4. | Wrong adds shallowercoins; corrected exactproof. | Wrong + PASS |
| S1 visual3 edges | CorrectA directchildren submit/reload; wrongD deepestcontainingbox. | Correct accepted; wrong says coin connects immediatebox, skippingouterboxes giveswrongdepth. | Correct + wrong |
| S1 repair3 | items=[[],[5]],k2. Full4-node tree,5. | Exactproof. | PASS |
| S1 visual4 sum | items=[[2,[3]],[[5],7],1],k2. CorrectA9 submit/reload; wrongD8 (3+5atdepth3). | Correct2+7; wrong mentions coin1atdepth1 rather than3+5atdepth3. | Correct + wrong |
| S1 repair4 | items=[[1],2,[3]],k2. Full6-node tree,4. | Exactproof. | PASS |
| S1 build4 | items=[7],k1. Root→coin7; wrong8then7. | Wrong treatsrootascoin1; corrected exactproof. | Wrong + PASS |
| S1 visual5 deep sum | items=[10,[20,[30,[40]]]],k4. CorrectB40 submit/reload; wrongC30. | Correctonly40; wrong30islevel3. | Correct + wrong |
| S1 repair5 | items=[0,[0,[9]]],k3. Full6-node tree,9. | Exactproof. | PASS |
| S2 Xavier drop finaledge | Studentdesign [7],k1, root→coin7; second same2nodes noedge. Coinfield root[0]=7=7. Real7,wrongbug7then0. | Wrong onlybugoutput×; corrected counterexampleconfirmed7/0. | Wrong + PASS |
| S2 Adam wrongouterbox | Studentdesign [[7]],k1, root→array→coin7; second duplicatesfullgraph. Coinfield root[0][0]=7=7. Real0,wrongbug0then7. | Wrong onlybugoutput×; corrected confirmed0/7. | Wrong + PASS |
| S2 Valeria shallow | Same [[7]],k2, duplicatefullgraph. Real7,wrongbug7then0. | Wrong onlybugoutput×; corrected confirmed7/0. | Wrong + PASS |

S1 complete9/9,9corrections: all4builds, all5correctmain, all5wrongmain, all5repairs tested. S2complete3/3,3corrections; all3wrong+correct. S3–4 pending. No skips or resets in coins.

New live coin issues: S1edgechoiceD “Connect every coin straight to the deepest box that contains it” names the **immediate parent**, not an ancestor shortcut; feedback repeats “A coin connects to its immediate box” and falsely frames this as skippingboxes. Rewrite distractor to an actual wrong ancestor, or explicitly test reversedarrow and omittedarrayedges. S1sumchoice8 naturally comes from depth3's3+5, but feedback discusses coin1atdepth1. S2 redundantcoinfield requires awkward `root[0]=7=7`; values already exist in strictnode names. Adam prompt literally says starts at `root[0]=value` while valid box is `root[0]=[]`; use concrete resolvedlabel.

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S3 claim1 membership | items=[[-3,3],[0]],k2. Full6-node tree plus isolated depth2. WrongYes, then correctNo, then deleteextra. | Wrongnode rule; correctverdict nodes×edges× even though exactedgespresent; corrected accepted. | Wrong verdict + wrong graph + PASS |
| S3 claim2 direct/reach | items=[[],[5]],k2. Fulltree+root→5shortcut. WrongNo,thenYes,then removeshortcut. | Explainsmultistepreach; correctverdict edges×; correctedaccepted. | Wrong verdict + wrong graph + PASS |
| S3 claim3 degree | items=[[1],2,[3]],k2. Omitarray[0]→coin1. WrongYes to0outgoing;thenNo;restoreedge. | Says1outgoing; correctverdict edges×; correctedaccepted. | Wrong verdict + wrong graph + PASS |
| S3 claim4 direction | items=[0,[0,[9]]],k3. Fullundirectedtree. WrongNo to parent→innerarray,thenYes,then directedon. | Directionmatters; correctverdict direction×; correctedaccepted. | Wrong verdict + wrong graph + PASS |
| S3 claim5 boundary | items=[1,[4,[6]]],k2. Fullnodesomitdeepestedge. WrongYes toinnerarrayreaches3;thenNo;restoreedge. | Reaches2includingstart; correctverdict edges×; correctedaccepted. | Wrong verdict + wrong graph + PASS |
| S4 case1 zerodepth | items=[[3,2],5,[[4]]],k2. Full8-node tree. Wrong5+boxsizes diagnosis; then4+zerodepth diagnosis. | Wrongdiagnosis/output×; onlynumbersadded. Traceconfirmedbug4,real5. | Wrong + PASS |
| S4 case2 cumulative | items=[1,[2,3],[[4]]],k2. Full8-node tree. Wrong5+zerodepth diagnosis;then6+depth≤k diagnosis. | Firstcalluses1; traceconfirmedbug6,real5. | Wrong + PASS |
| S4 case3 firstcoin | items=[[],[1,2]],k2. Full5-node tree. Wrong0+emptyarraysascoins;then1+firstmatchingcoin diagnosis. | Arraysrecursednotreturned; traceconfirmedbug1,real3. | Wrong + PASS |

Coins S3finish five ticks; S4finish3/3,3corrections. **Coins fully tested in actual Chrome across all requested paths**:4builds,5correctmain,5wrongmain,5repairs,3counterexampleswrong+correct,5claimswrongeverdict+wronggraph+correct,3codecaseswrong+correct. No skips. Additionalfeedbackissue: S3claim1 flags exactedgeswrong solely for an extra isolatednode; this misleadingly suggests changing already-correctedges. S4case1 wording “two edges below the root container's contents convention” is needlessly confusing; say twoedgesfromroot, while buggycode labels thosecoinsdepth1.

## Counting Constellations — live Chrome, in progress

| Item | Input / action | Observed feedback | Status |
|---|---|---|---|
| S1 build1 | sky=[[1,0,0],[0,1,0],[0,0,1]]. Nodes00,11,22; wrong noedges/output3; then00—11—22/output1. | Wrong fourdirection missesdiagonals; corrected exactproof. | Wrong + PASS |
| S1 build2 | sky=[[1,1,0],[0,1,0],[0,0,1]]. Nodes00,01,11,22; initially only00—01—11,output2; add00—11and11—22,output1. | Wrong fourdirection missesdiagonals; corrected exactproof. | Wrong + PASS |
| S1 visual1 picture | CorrectA fullundirecteddiagonalchain submit/reload; wrongC directedchain. | Wrong turnstworelationoneway. | Correct + wrong |
| S1 repair1 | sky=[[1,1,1]], nodes00—01—02,answer1. | Exactproof. | PASS |
| S1 build3 | sky=[[1,0,1],[0,0,0],[1,1,0]]. Nodes00,02,20,21 edge20—21. Wrong4then3. | Wrong countsstarcells; corrected exactproof. | Wrong + PASS |
| S1 visual2 membership | sky=[[1,0,1],[0,1,0],[0,0,1]]. CorrectD only1cells submit/reload;wrongC oneperconstellation. | Componentsaretodiscovernotstartingnodes. | Correct + wrong |

| S1 repair2 | sky=[[1,0],[0,1]],nodes00—11,answer1. | Exactproof. | PASS |
| S1 build4 | sky=[[1]],node00,wrong0then1. | Wrongdropsisolatedstar; correctedproof. | Wrong + PASS |
| S1 visual3 edges | CorrectB8directions submit/reload;wrongC anysamediagonalline. | Mustimmediateneighbors,gapsnotedges. | Correct + wrong |
| S1 repair3 | sky=[[1,0,0],[1,0,0],[1,1,1]]. Nodes00,10,20,21,22;edges00—10,10—20,10—21,20—21,21—22;answer1. | Exactproof. | PASS |
| S1 visual4 count | sky=[[1,0,0,0,1],[0,1,0,0,0],[0,0,0,1,0],[0,0,0,0,1]]. CorrectA3 submit/reload;wrongC2. | Twodiagonalpairsplusisolatedtopright;wrongdropsisolatedstar. | Correct + wrong |
| S1 repair4 | sky=[[0,1,0],[1,1,1],[0,1,0]]. Nodes01,10,11,12,21;8edges(alladjacentpairs);answer1. | Exactproof. | PASS |
| S1 visual5 diamond | sky=[[0,1,0],[1,0,1],[0,1,0]]. CorrectA1 submit/reload;wrongB4. | Wrongsideonlymissesalldiagonals. | Correct + wrong |
| S1 repair5 | sky=[[1,0,0],[0,0,0],[0,0,1]]. Nodes00,22,noedges,answer2. | Exactproof. | PASS |
| S2 Aaliyah adds corners | Resumed persistedcase. Correct00—11,duplicatebuggraph,start00,outputs1/1. | Allrows✓ except exposesmistake×. | APP-BLOCKED |
| S2 Aaliyah naturalwrong | Followingprompt'sinventedcorneridea: remove00—11fromcorrectgraph,outputs2/1. | “Connect every adjacent pair allowed by this problem's input rules.” Cannotrunsearch. | Wrong graph rejected; confirms contradiction |

Constellations S1complete9/9,9corrections,allrequestedpaths. S2 startedpreexisting0/3,1correction andlastcaseAaliyah; afterdocumentedblocker usedoneskip,screen0passed3skipped. Other2cases UNTESTED/PENDING replay, not counted. S3–4pending.

Live teaching issues: repair4 for missed isolatedstar has **no isolatedstar**, so cannotprove that misconception fixed. Repair5 for missingdiagonals has **no adjacentdiagonalpair**, so sideonlyrule stillpasses. Aaliyah S2 is impossible: eight-neighborcorrectgraph alreadycontains everycorneredge; addingcorners cannotchangecomponents. Replace with omittingdiagonals, or a genuinely different singlebug.

Live shelf issues: deep path labels visually truncate to root[1][0… / root[1][1… / root[2][0…, hiding the actual item values and distinguishing path tails. Build1 wronganswer1 gets generic off-by-one feedback, missing the plausible container-counting misconception, whereas build2 tie feedback is specific and helpful.


---

# Full Chrome ledger: new lessons

Only rows explicitly marked PASS/WRONG-PROBE/APP-BLOCKED are tested. Everything else is pending. No skip counts as a pass. One Chrome tab, actual clicks and typing, no injected graphs or state.

Chrome recovered and work resumed in fresh tab381534202. No native restarts used. Earlier connection pause was environmental, not a lesson failure.

Ownership: remaining 19 new lessons; root owns properties-graph, reachable-nodes-with-restrictions, transitive-closure, structy-tree-sum, wheres-my-internet, path-sum.

## ten-kinds-of-people

| Step/item | Input and actual action | Visible feedback | Status |
|---|---|---|---|
| 1/build-1 | grid=["110","010"], query[0,0,1,1]. Drew all6cell nodes; edges(0,0)—(0,1), (0,1)—(1,1), (0,2)—(1,2). Selected ["decimal"]. | Exact visual proof; all four checks passed. Why: two1cells connect through(0,1). | PASS |
| 1/exact-picture | Same input as build1. Selected PictureC, which omitted the0-column edge. | Contradiction found; correct PictureA revealed; “This stops reading the raw input one relation too soon.” Requires fresh proof. | WRONG-PROBE; direct correct-choice pass still pending |
| 1/repair-1 | grid=["100","110"], same query. All6nodes, edges00—10,10—11,01—02,02—12; answer["decimal"]. | Exact visual proof; all four checks pass; L-shaped1region connects endpoints. Earlier mistaken edges were rejected specifically under exact-edge check, while nodes/direction/answer passed. | PASS |
| 1/node-rule | grid=["00","01"], selected only1cells. | Rejects: “That erases the regions used by binary travelers.” Shows allcells answer, requiresrepair. | WRONG-PROBE; direct correct-choice pass pending |
| 1/repair-2 | grid=["01","00"], all4nodes, edges00—10—11, answer["binary"]. | Exact visual proof; 0route turns through(1,0). | PASS |
| 1/build-2 | grid=["10","01"], all4nodes/noedges, answer["neither"]. | Exact visual proof; equal diagonal cells are in different regions. | PASS |
| 1/edge-rule | singleton1input; chose same-digit side-or-corner rule. | Rejects: “Corner touching is diagonal and is not allowed here.” Requiresrepair. | WRONG-PROBE; direct correct-choice pass pending |
| 1/repair-3 | grid=["11","00"], all4nodes, horizontal edge in eachrow, answer["neither"]. | Exact visual proof; adjacent different characters do notconnect. | PASS |
| 1/build-3 | grid=["00","01"], queries00→10 and00→11, all4nodes, edges00—01,00—10; ["binary","neither"]. | Exact visual proof; firstpair shares0region, second has differentvalues. | PASS |
| 1/predict-output | grid=["1100"], queries00→03 and00→00; chose["neither","neither"]. | Rejects: “A zero-step trip on a 1 cell is valid for decimal.” Requiresrepair. | WRONG-PROBE; direct correct-choice pass pending |
| 1/repair-4 | grid=["101"], all3nodes/noedges; ["neither"]. | Exact visual proof; middle0 splits two1regions. | PASS |
| 1/bug-trap | grid=["110","010","011"], queries00→22 and20→02; chose["decimal","binary"]. | Rejects: “The two 0 endpoints sit in separate 0 regions.” Requiresrepair. | WRONG-PROBE; direct correct-choice pass pending |
| 1/repair-5 | grid=["111"], all3nodes, path00—01—02; ["decimal"]. | Exact visual proof; connectivity may use middlecell. | PASS |
| 1/build-4 | grid=["1"], one node (0,0), no edge; ["decimal"]. | Exact visual proof; a cell connects to itself by a zero-edge path. Finish visual proof button enabled. | PASS |
| 2/round-1 diagonals | Invented grid10/01, all4cells/no correct edges. Start00,target11; buggy graph has both same-digit diagonals. First predicted both outputs decimal, then changed correct output to neither. | Wrong attempt passed all checks except correct output. Revised attempt: Counterexample confirmed, correct["neither"], Leonardo["decimal"]. | WRONG-PROBE + PASS |
| 2/round-2 shallow | Invented grid111, path00—01—02, start00,target02, same graph copied. First predicted both decimal, then buggy neither. | Wrong attempt failed only Summer's output; correct graph and same-structure bug drawing passed. Revised: confirmed decimal versus neither. | WRONG-PROBE + PASS |
| 2/round-3 last branch | Grid111, start01,target00. Edge#1 connects01—00; edge#2 connects02—01. Same graph copied. First predicted both decimal, then buggy neither. | Wrong attempt failed only Santiago's output. Revised: confirmed decimal versus neither; Finish Step2 enabled. | WRONG-PROBE + PASS |

UI note from actual drawing: rapid repeated click on an endpoint shared between successive edges can open Rename instead of starting the next edge; make fresh state checks and avoid counting automation-created mistakes as content faults.

| 3/membership | grid=["01","00"], all4cells; edges00—10,11—10. Claim each connected group becomes a node. Submitted Yes then No. | Wrong: exact node rule is every cell, whether0or1. Retry retains same graph and same claim. No: Answer and graph are correct. | WRONG-PROBE + PASS |
| 3/direct versus reachable | grid=["100","110"], all6cells; edges00—10,11—10,01—02,12—02. Claim12 reaches01 through02 without direct12—01. No then Yes. | Wrong: multi-step route creates reachability, not new direct edge. Yes: Answer and graph are correct. | WRONG-PROBE + PASS |
| 3/degree | grid=["11","00"], all4cells; horizontal edge each row. Claim00 has2direct neighbors. Yes then No. | Wrong:00has1directneighbor. No: Answer and graph are correct. | WRONG-PROBE + PASS |
| 3/direction | grid=["101"],3nodes/noedges; checked Directed and Yes to directed claim. Then switched to undirected and No. | Wrong: graph is two-way even though example has no edges. Corrected: Answer and graph are correct. | WRONG-PROBE (graph+verdict) + PASS |
| 3/reachable count | grid=["111"],3nodes/path00—01—02. Claim search from01 reaches3. No then Yes. | Wrong: “Include the start, then follow the arrows exactly. The search reaches 3 nodes.” Yes: Answer and graph are correct. FinishStep3 enabled. | WRONG-PROBE + PASS |

Step3 UI improvements: “Try another check” actually retries the identical claim, not another check. Reachability feedback says “follow the arrows” in this undirected lesson. The direction claim uses an edgeless input, so no arrow behavior can be inspected; choose a connected pair instead.

| 4/diagonal travel | grid=["10","01"],query00→11. All4nodes/noedges. Selected C nested direction loops; first output["neither"], then["decimal"]. | Wrong output alone failed; graph and diagnosis passed. Corrected: Trace confirmed; correct output["neither"]. | WRONG-PROBE + PASS |
| 4/crosses digits | Same2x2input and correct edgeless graph. Output["decimal"]. First C diagonal diagnosis, then A ignores next digit. | Wrong diagnosis alone failed: “That is the lesson's other bug, but it is not in this code.” Corrected: Trace confirmed; correct output["neither"]. | WRONG-PROBE + PASS |
| 4/swapped labels | grid=["110","010"],query00→11. All6nodes; edges00—01,01—11,02—12. C swapped labels. First output["decimal"], then["binary"]. | Wrong output alone failed. Corrected: Trace confirmed; correct output["decimal"]. FinishStep4 clicked:3of3passed,3corrections. | WRONG-PROBE + PASS |

Step4 findings from actual feedback: all3 cases label the correct drawing as “Changed graph,” instead of describing the buggy graph. Diagonal case specifically says changed graph is4isolatednodes, although buggy graph adds2diagonals. Cross-digit case says changed graph4nodes0edges, although bug creates4sideedges. Swapped-label case should state graph unchanged. Also failed submission clears the diagnosis even when marked correct, so merely correcting the output leaves Submit disabled until the student reselects the diagnosis. Generic failure heading “Check the graph” appears when all graph checks pass and only output/diagnosis is wrong.

Pending: this lesson's fresh correct-choice Step1 pass (all5conceptchecks; all4builds/all5repairs already pass). All3 Step2 rounds, all5 Step3 cases, all3 Step4 cases passed with natural wrong-answer probes. Other18 owned lessons entirely pending full passes. Earlier targeted Flood Fill/Fish probes are documented separately in astra-new.md and do not count as full-lesson coverage.

## codewars-array-deep-count

All arrows below point from container to directly contained item. Node names use shown paths, with outer array root. No skip/reset used.

| Step/item | Input and actual action | Visible feedback | Status |
|---|---|---|---|
| 1/build-1 | [1,[2]]; nodes outer,[0]=1,[1]array,[1][0]=2;3containmentarrows; answer3. | Exact visual proof, all4checks pass; outer has2elements and inner1. | PASS |
| 1/build-2 | [[],[[]]]; nodes outer,[0]array,[1]array,[1][0]array;3arrows; answer3. | Exact visual proof; empty arrays occupy element slots. | PASS |
| 1/exact-picture | [1,[2]]; selectedB omitting nested2. | Reject: drops an item; revealsA; fresh proof required. | WRONG-PROBE; direct correct-choice pending |
| 1/repair-1 | [1,2,[3]];5nodes with4directcontainmentarrows; answer4. | Exact visual proof; nested array itself occupies outer slot. | PASS |
| 1/node-rule | []; selectedA only numbers/strings/booleans. | Reject: inner arrays are elements too. Reveals outer+innerarrays+values. | WRONG-PROBE; direct correct-choice pending |
| 1/repair-2 | [[1],2];4nodes, outer→[0]array→[0][0]=1, outer→[1]=2; answer3. | Exact visual proof; twoouter slots plus inner1. | PASS |
| 1/build-3 | []; outer node, Directed enabled, noedges, answer0. | Exact visual proof; argument container is not its own element. | PASS |
| 1/edge-rule | ["x"]; chose outerpointsdirectlytoeveryvalueeverydepth. | Reject: flattens which inner array contains each item. | WRONG-PROBE; direct correct-choice pending |
| 1/repair-3 | [[],1]; nodesouter,[0]array,[1]=1; outer→both; answer2. | Exact visual proof; emptyarray counts one outerelement. | PASS |

Live problem-pane finding: function signature is displayed with literal broken Markdown markers “`` js” and “``” instead of a proper code block.

| 1/predict-output | [1,2,[3,4,[5]]]; correct7, reload, wrong5. | Correct: Picture read correctly, generic “picture gives exactly this result.” Wrong: counts plain values but not2innerarrays. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-4 | [[[0]]];4nodes in containmentchain, answer3. | Exact visual proof; oneelement at each3levels. | PASS |
| 1/build-4 | ["x"]; outer→[0]="x", answer1. | Exact visual proof; string onlyelement. | PASS |
| 1/bug-trap | ["x","y",["z"]]; correct4, reload, wrong5. | Correct: Picture read correctly (generic). Wrong: outerarray notadded. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-5 | [1,1,[1]];5distinctoccurrence nodes,4containmentarrows, answer4. | Exact visual proof; repeatedvalues separateoccurrences, innerarray counts. | PASS |

| 2/shallow | Invented[[1]], outer→[0]array→[0][0]=1; copied samebuggraph. First outputs3/2(countroot), then2/1. | First fails bothoutputs only; graphvalid. Corrected: Counterexample confirmed2/1. | WRONG-PROBE + PASS |
| 2/reverse | Invented[1], outer→[0]=1; initiallycopiedunchangedbuggraph, outputs1/0. Then reversedbugarrow [0]=1→outer. | Wrongdrawing alone rejected. Corrected: confirmed1/0. | WRONG-PROBE + PASS |
| 2/drop last | Invented[1,2], outer→[0]=1(edge1),outer→[1]=2(edge2). Copied, deletedfirst instead oflast, outputs2/1. Then replacedremainingedge withouter→[0]=1. | Wrongdrawing alone rejected despite sameoutput. Corrected: confirmed2/1;FinishStep2enabled. | WRONG-PROBE + PASS |

| 3/membership | [[1],2],4nodes3containmentarrows; claim leavearraycontainersout. Yes thenNo. | Wrong: exactnoderule outer+innerarrays+plainvalues. No: Answer and graph are correct. | WRONG-PROBE + PASS |
| 3/direct edge | [[],1],3nodes2arrows; outerdirectlyconnects[0]array claim. No thenYes. | Wrong: outer→[0]array one directedge. Yes: correctgraph+answer. | WRONG-PROBE + PASS |
| 3/degree | [[[0]]],4nodechain;[0]array exactly1outgoingedge. No thenYes. | Wrong repeats1outgoingedge; Yes passes. | WRONG-PROBE + PASS |
| 3/direction | [1,1,[1]],5nodes4arrows; deliberatelyreversed outer→[2] and choseYes reverseexists. Retrycorrectedarrow andNo. | Wrong: inputcreatesouter→[2],directionmatters. Correctedgraph+answerpass. | WRONG-PROBE (graph+verdict) + PASS |
| 3/boundary | [1,2,[3]],5nodes4arrows; claimsearchfrom[0]=1 reaches2. Yes thenNo. | Wrong: include start andfollowarrows; reaches1. No passes. FinishStep3enabled. | WRONG-PROBE + PASS |

| 4/leaves only | [1,[2,[]]];5nodes4containmentarrows; A arraysnotcounted. Wrongoutput4, then2. | Outputonlyfails first; thenTraceconfirmed, correct4. | WRONG-PROBE + PASS |
| 4/count root | [1,[2]];4nodes3arrows; B top-levelcounts. Wrongoutput3,then4. | Outputonlyfails; thenTraceconfirmed, correct3. | WRONG-PROBE + PASS |
| 4/shallow | [[[0]]];4nodechain; output2. WrongC leavesonly, thenA one layeropened. | Diagnosisonlyfails; thenTraceconfirmed,correct3. Finished3of3cases/3corrections. | WRONG-PROBE + PASS |

Live code finding: shallow-case feedback says “The value 0 sits two array edges below the outer container.” Actual required and accepted graph has THREE arrows outer→[0]array→[0][0]array→[0][0][0]=0. Say three containment arrows, or distinguish the two intermediate array nodes. Both failure and success repeat the wrong depth (confirms source finding N28).

Pending for this lesson: correct-choice replay of exact-picture/node-rule/edge-rule ONLY. All4builds and5repairs pass; all5mainchecks wrong-probed and2also correct-probed; all3Step2cases,5Step3cases,and3Step4cases pass afterwrongprobe. Parent's safe method works: correct-submit, reload beforeNext, wrong-submit, repair (no native restart).

## gfg-grid-path-exists

| Step/item | Input and actual action | Visible feedback | Status |
|---|---|---|---|
| 1/build-1 | [[1,3,2],[0,0,0],[0,0,0]];nodes00,01,02,path00—01—02,true. | Exactvisualproof/all4checks;open3connectsendpoints. | PASS |
| 1/build-2 | [[1,0],[0,2]];nodes00,11,noedges,false. | Exactvisualproof;wallsseparate diagonalendpoints. | PASS |
| 1/exact-picture | build1input;correctAthenreloadwrongDdirectedarrows. | Correctpasses;wrongchangesarrowsversustwo-way;repairrequired. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-1 | [[1,3],[0,2]],nodes00,01,11,path00—01—11,true. | Exactvisualproof;3touchesbothendpointsbysides. | PASS |
| 1/build-3 | [[1,3,0],[0,3,2],[0,0,0]],nodes00,01,11,12,path00—01—11—12,true. | Exactvisualproof;turnsdownthenright. | PASS |
| 1/node-rule | build3input;correctDallnonwalls,thenreloadwrongConly3. | Correctevery nonwall canroute;wrongsource/destinationneededtoo. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-2 | [[1,0,2],[0,0,0],[0,0,0]];nodes00,02,noedges,false. | Exactvisualproof;0notnode. | PASS |
| 1/build-4 | [[1,2],[0,0]],nodes00,01,oneedge,true. | Exactvisualproof;sourceadjacentdestination. | PASS |
| 1/edge-rule | build4input;correctBsideadjacent,thenreloadwrongAsideorcorner. | Correctlegalup/down/left/right;wrongdiagonalnotallowed. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-3 | [[1,0,0],[3,0,0],[2,0,0]],nodes00,10,20,verticalpath,true. | Exactvisualproof;verticalsidemoveslegal. | PASS |
| 1/predict-output | [[1,3,0],[0,3,0],[0,3,2]],correctAside-connected3route;reloadwrongBmuststraight. | Correctgeneric;wrongwindingroutevalid. | CORRECT-PASS + WRONG-PROBE |
| 1/repair-4 | [[1,3],[3,2]],all4nodes/square4edges,true. | Exactvisualproof;eitherbranchreaches2. | PASS |
| 1/bug-trap | [[1,0,3],[0,0,3],[3,3,2]],correctAboxedsource;reloadwrongCdiagonalconnects. | Correctgeneric;wrong“Diagonal movement is never allowed.” | CORRECT-PASS + WRONG-PROBE |
| 1/repair-5 | [[1,0],[3,2]],nodes00,10,11,path00—10—11,true. | Exactvisualproof;downthenright. | PASS |

Live issues: edge-rule input has no usable diagonal pair and its repair3 is a straightverticalpath, also without any usable diagonal pair. A student still wrongly using8directions makes the exact same drawing and passes; repairfails to test the observed mistake. Bug-trapC claims diagonalswouldconnectsource, but00's onlydiagonal11iswall, soeven8directionscannotescape. Feedback onlysaysdiagonalforbidden instead of addressingthis (confirmsN13). Booleanbuilds repeatedlyoffer plainfalse plus “false fallbackwithoutsearching,” or plaintrue plus “returnsuccessbeforecheckinggraph”; duplicate returnedvalues mix answerformat with an implausibleprocedure.

| 2/wrong start authored goal | Goal explicitly requires real00reachestarget, wrong01doesnot. Drew00—10, source00,target10, copiedsame, true/false. Thenadded01isolated. Thenconnected00—01inbothgraphs, true/true. | Wall01rejected “Also draw (0,1), the wrong source cell used by the broken search.” Isolated01rejected “Connect every adjacent pair allowed by this problem's input rules.” Connected01passesallgraph/outputchecks butfails“graphexposesmistake.” | APP-BLOCKED authoredgoal; threeactualsubmissions |
| 2/wrong start alternate | Addedseparate21—22componenttobothgraphs, kept00—10and00—01. Changedsource21,target22;true/false. | Counterexampleconfirmed! Thussource00goalignoredbygrader. | Alternate legal PASS contradicting authoredgoal |
| 2/diagonals | Invented2x2grid1/2diagonal;correctnodes00,11/noedges;bugsameplus00—11;source00,target11. Firstfalse/false,thenfalse/true. | Firstbugoutputalonefails;correctedconfirmed. | WRONG-PROBE + PASS |
| 2/first branch | Invented3x3withtoprow3,1,2,allotherswalls. Nodes00,01,02;edge1 01—00(deadend),edge2 01—02(target),samebuggraph;source01,target02. Firsttrue/true,thentrue/false. | Bugoutputalonefails;correctedconfirmed. | WRONG-PROBE + PASS |

HIGH PRIORITY livefinding: Step2round1 written goal cannot be solved. Bothmandatedstarts00and01mustbenodes, andexactadjacency forcesedge00—01. Undirectedconnectedstartsalwayshavethesamereachableset. Fixwithnonadjacentfixedwrongstart, orallowwrongstartonwall. Graderletsstudentpassbychangingrealsourceawayfrom00, silentlyignoringtheinstruction. NoSkipused;alternatepassadvanced.

Step2UI: Duplicategraph button staysdisabledafterfirstcopy evenwhencorrectgraphischanged. Had tomanuallyrepeataddednodes/edgesinbuggraph. Allowrecopywithclearwarningorupdatecopybutton.

| 3/membership | [[1,0,2],[0,0,0],[0,0,0]],nodes00,02/noedges;wallnodesclaimYes→No. | Rejectexactnonwallnoderule;correctpasses. | WRONG-PROBE + PASS |
| 3/reachable | [[1,0,0],[3,0,0],[2,0,0]],path00—10—20;20reaches00via10withoutdirectedgeclaimNo→Yes. | Rejectmulti-steproutenotnewedge;correctpasses. | WRONG-PROBE + PASS |
| 3/degree | [[1,3],[3,2]],all4nodes/square4edges;10has2neighborsclaimNo→Yes. | Rejectstates2neighbors;correctpasses. | WRONG-PROBE + PASS |
| 3/direction | [[1,0],[3,2]],nodes00,10,11, initiallydirectedpath00→10→11;10—11onlyonewayclaimYes. Thenundirected+No. | Wrongfeedbackstarts“× Yes. This graph is undirected, so (1,0)—(1,1) works both ways.” Correctedpasses. | WRONG-PROBE (graph+verdict) + PASS |
| 3/boundary | [[1,3],[0,2]],path00—01—11;start00reaches2claimYes→No. | Rejectinclude start/reaches3;correctpasses. | WRONG-PROBE + PASS |

Step3directionfeedback contradicts its own verdict: rejects Yes yet begins “Yes.” for a false one-way claim. Change to “No. ...works both ways.”

| 4/diagonal | [[1,0],[0,2]],nodes00,11/noedges; Bdirectionloopsallowdiagonal;wrongfalse,thentrue. | Outputonlyfails;thenTraceconfirmed,trueversuscorrectfalse. | WRONG-PROBE + PASS |
| 4/walls | Sameinput/correctgraph;outputtrue;wrongB8directions,thenCmissingwallstop. | Diagnosisonlyfails,otherbugfeedback;thenTraceconfirmed,trueversusfalse. | WRONG-PROBE + PASS |
| 4/shallow | [[1,3,2],[0,0,0],[0,0,0]],path00—01—02;Amissingrecursion;wrongtrue,thenfalse. | Outputonlyfails;thenTraceconfirmed,falseversuscorrecttrue. Finished3/3,3corrections. | WRONG-PROBE + PASS |

Coverage complete for all assigned items in this lesson: Step1all4builds5repairs andall5maincorrect+wrongpaths;Step2all3tested(firstwritten-goalblockedbutalternate-sourceaccepted);Step3all5wrong+correct;Step4all3wrong+correct. NoSkip/restart. No replayneeded.


### L40 — P2: Clearing a copied Step 2 graph leaves the copy button disabled

Chrome reproduction: Counting Constellations, Hayden's Step 2 case. Duplicate graph #1, revise graph #1, return to graph #2 and confirm Clear again. Graph #2 is now empty, but the copy control still says “Graph #1 duplicated” and is disabled. The student cannot copy the revised first graph and must rebuild it manually. Reset the copied flag when clearing, or allow copying again with an overwrite confirmation.

### L41 — P1: Constellations' chosen first star does not define the buggy search's starting point

Chrome reproduction: Hayden's Step 2 case. Draw center (1,1) connected to (0,0) first and (2,2) second, choose first star (1,1), and copy the same graph. The goal explicitly asks for one star touching two branches. A search from that chosen center that follows only the first branch misses the other endpoint. Nevertheless, outputs 1/1 both pass individually and only “exposes the mistake” fails. The interface does not explain the global component-counting traversal or its start order. With three leaves (0,0), (0,2), (2,0) around (1,1), edges entered in that order, outputs 1/2 pass. Define the outer scan and neighbor order, and explain why the two-branch witness fails instead of offering a misleading start field and goal.

### Counting Constellations — additional Chrome checkpoint

Step 2 Vanessa: diagonal pair (0,0)—(1,1), buggy graph with the same two isolated nodes, start (0,0). Correct1/bug1 rejected only the buggy output; revise bug2 accepted. Hayden's two-branch and three-branch submissions are recorded in L41. Earlier Aaliyah impossible-case reproduction remains valid (V02). Steps 3 and 4 still await testing.

### L42 — P2: Constellations' isolated-star code contains a second counting bug

Step 4's third case increments once for each star that has a neighbor; it never visits or groups connected stars. The isolated-star input correctly produces buggy0/real2, but the code also counts every nonisolated star separately. A connected pair would produce2 instead of1 even though no isolated star exists. This repeats the previous case's cell-counting mistake instead of isolating the advertised isolated-node omission. Use a proper component traversal with only the isolated-component mistake introduced.

### Counting Constellations — full Chrome completion

All five Step 3 graphs were drawn exactly. Both verdict paths were submitted for membership (No), indirect reachability (Yes), isolated degree (Yes), direction (No), and start-inclusive reachability (No). Corrected submissions all passed; Finish showed Step3 complete. Direction feedback reproduced V15's contradictory “Yes. This graph is undirected.” Degree feedback merely repeats zero; boundary feedback says “arrows” for this undirected graph.

All three Step 4 cases were drawn and tested with wrong output/diagnosis then correct ones: side-only diagonal chain wrong1/B then3/C (real1); count-stars triangle wrong1/A then3/B (real1); isolated stars wrong1/B then0/C (real2). Finish showed3/3. The outputs agree with the displayed code. The “Changed graph” text repeatedly describes the correct graph, confirming L15 in this Variant. All planned coverage is now exercised; the earlier impossible Aaliyah exercise remains blocked (V02), not passed.

### L43 — P2: Boat repairs do not distinguish cells from components

Counting Docked Boats Step 1 membership: after rejecting “one completed boat per node,” the repair marina=["B.","..",".B"] contains only one-cell boats. The mistaken rule and the correct cell rule produce the same two nodes. The final count repair marina=["B..","...","..B"] similarly follows a rejected cell-counting answer with two isolated cells, so counting cells still gives the accepted2. Both exact drawings passed in Chrome. Use at least one multi-cell boat in each repair.

### L44 — P2: Boat feedback says an unvisited boat was grouped

Counting Docked Boats Step 4 case2 starts floods only from the top row, which is empty. Selecting the cell-counting diagnosis produces “The seen set correctly groups the three squares into one boat.” On this input the flood is never called and the set stays empty. Say that the traversal would avoid recounting visited cells, but the real error is never starting from this bottom-docked boat.

### Counting Docked Boats — full Chrome submission record

- Step1 builds: marina=["B...B",".....","..B..",".....","BB..."] wrong4 then correct3; ["BB.","...",".B."] wrong3 then2; ["B.B"] wrong1 then2; ["B"] wrong0 then1. All exact cell graphs passed after correction; wrong feedback matched offshore counting, cell counting, border merging, and isolated-boat omission.
- Step1 checks: exact Picture A passed, then reload and missing-edge B rejected; all-B-cells D passed, then one-boat-per-node A rejected; side-adjacency B passed, then orientation-specific D rejected despite being valid for straight boats (V11 confirmed live); border count2 passed then all-boats4 rejected; one-row B . B B count2 passed then cellcount3 rejected. Every wrong choice was followed by its required fresh drawing. Repairs ["BBB"]→1, ["B.","..",".B"]→2, ["B...B","B...B","B...."]→2, interior singleton→0, and opposite-corner singletons→2 all passed. Finish9/9,9corrections. L43 identifies ineffective repairs; the offshore repair's -1 option is also trivially impossible as a count (V19 family).
- Step2 Katelyn: correct isolated (0,0),(1,1), buggy diagonal edge; real2/wrongbug2 rejected, bug1 accepted. This forbidden corner-touching layout gets a green “follows the problem's graph rules” (V04 confirmed). Ian: horizontal chain (0,0)—(0,1)—(0,2), identical second graph, start(0,0), real1/wrongbug1 rejected, bug2 accepted. Ariana: (0,1)—(1,1), second graph omits the only edge, start(1,1), real1/bug1 rejected, bug2 accepted. No marina dimensions or border markers are requested, so the two graphs could be a 3×3 marina where the detached interior square is not docked, or a 2-row marina where it is; grading always returns component counts (V03). Finish3/3.
- Step3 all exact graphs and both verdict paths passed after correction: water membership No; disconnected opposite corners Yes; ["BBB"] endpoint has0neighbors No; vertical edge works both ways Yes; offshore singleton reaches0nodes No. Degree feedback just repeats1; boundary says “arrows” despite undirected graph. The direct-edge/reachability case contains no multi-step route, limiting its teaching value. Finish5/5.
- Step4 all exact graphs and wrong/correct predictions: first-square border test wrong1/B then0/A, real1; top-border-only wrong3/B then0/C, real1; first-boat early return wrong2/B then1/A, real2. All displayed code agrees with accepted outputs. Finish3/3,3corrections. L15's “Changed graph” labeling problem recurs; L44 records a separate inaccurate feedback claim.

### L45 — P2: Coffee's count-only repairs cannot detect truncated route lists

Step1 output check rejects [[0,1,3],[0,2,3]] because the routes stop at the cart rather than the customer. Its repair asks only for the number of routes on roads=[[3,1],[2],[3],[]], cart1: the truncated list [[0,1]] and complete list [[0,1,2,3]] both contain one route. The final check similarly rejects a cart-only dead end, then repairs with a simple successful chain and only its count. Both repairs passed in Chrome with1. Require the complete route list and retain a misleading cart-only branch so the same mistake cannot pass.

### L46 — P2: Coffee's edge check has no raw input to draw

Step1's third visual check displays only graph[i] above its blank optional drawing tool. There is no adjacency list or node count to turn into a picture. The conceptual rule question can be answered, but the offered “draw this input” task is impossible to follow. Supply a small actual directed input before asking how its list becomes arrows.

### L47 — P1: Coffee's displayed code input uses different field names

Step4 cases2 and3 label the real input roads=..., coffeeCart=2 (plus start/customer), while the shown function immediately reads input.graph.length and later input.checkpoint. These are not the displayed input's keys. Interpreting the displayed data literally would fail before reaching the advertised bug. Show graph and checkpoint consistently, or explicitly show the conversion. Step1 also alternates between these two naming schemes without explaining them.

### Detour for Coffee — full Chrome submission record

- Step1 builds: five-node merge/cart1 wrong2→1; four-node chain/cart1 wrong0→1; valid route plus dead end wrong2→1; singleton depot=cart=customer wrong0→1. The singleton violates visible n>=2 and checkpoint strictly between endpoints (V33 confirmed live). Build3 gives generic off-by-one feedback rather than explaining a possible dead-end error. All graphs were exact and all builds passed after correction.
- Step1 checks: correct pictureA, then reversed C; correct all-intersections C, then special-nodes-only B; correct adjacency A, then checkpoint-touching-only D; correct two complete route lists C, then truncated B; correct empty list C, then cart-dead-end A. Every correct and wrong answer was submitted. All five fresh graphs passed with counts1,1,0,1,1. L45–46 record repair/input gaps. Finish9/9,9corrections.
- Step2 Jennifer: correct0→1→2 with cart1 Amber; reversed second graph. Numeric real [[0,1,2]] rejected even with all graph checks green and buggy[] accepted. Changing only real output to [["0","1","2"]] passed; success renders [[0,1,2]]. This confirms L01's hidden quoted-ID requirement also affects this Variant. Melanie: edges0→2 first,0→1 second,2→3,1→3; cart1 Amber, copied graph. Real quoted013, wrongbug quoted013 rejected; bug[] passed. Alex:0→1→2→3,cart2 Amber,both graphs same; real quoted0123, wrongbug quoted01 rejected; bug[] passed. Finish3/3.
- Step3 five full graphs with both verdicts: relationships-as-nodes No; 0 reaches4 through2 Yes; node4 has1outgoing No; reverse1→0 No; starting2 reaches2nodes Yes. Corrected submissions all passed; Finish5/5. Wrong degree feedback merely restates zero instead of distinguishing its incoming edge.
- Step4 full drawings, wrong output/diagnosis then correct: firstbranch wrong[[0,2,3]]/A then[]/B, real[[0,2,3]]; stop-at-cart wrong[[0,2]]/A then[]/C, real[[0,2,3,4]]; sharedpath wrong[[0,2,3,4]]/B then[[0]]/A, real[[0,2,3,4]]. Finish3/3,3corrections. Numeric arrays work here, unlike Step2. Outputs match the intended graph/checkpoint input, but L47 documents the displayed key mismatch. L15's “Changed graph” label remains inaccurate for the unchanged route graph; saved-path mutation is not itself a changed reachable boundary.

### L48 — P1: Wells' singleton feedback describes an impossible calculation

Step1 build4 is n=1,roads=[],wells=[0]. Wrong answer1 gets “This counts individual villages without wells instead of one needed well per road component.” There are zero villages without wells, so that calculation gives0, not1. The plausible error is counting every component even when it already has water. Correct0 passed. Rewrite this case-specific explanation.

### L49 — P2: Wells' shortcut repair contains no paths

Step1 rejects adding a direct edge for every reachable pair, then gives n=3,roads=[],wells=[] as the repair. With no paths, there are no multi-step routes to distinguish from direct edges; the incorrect shortcut rule produces the same accepted drawing and answer3. Include a chain with at least three villages. The earlier membership check likewise warns about omitted isolated villages while its shown seven-node input has no isolated village; its subsequent repair does correctly include one.

### L50 — P1: Well flags require undocumented yes/no values

Step2 asks “Mark whether every village already has a well” and only explains “One per line: node=value.” In Jaden's case, 0=true/1=false and 0=1/1=0 both fail with “Choose a valid existing well,” without explaining the valid format. Plain0 gets “Use node=value.” Changing only the flags to 0=yes/1=no passes the same graph and outputs0/1. Explicitly state yes/no, or accept ordinary Boolean/numeric equivalents and name invalid values in the feedback. This field appears in all three cases.

### Dig New Wells — full Chrome submission record

- Step1 builds: components012/34,wells1,3 wrong3→0; chain0123,well3 wrong3→0; pairs01/23 plus4,well0 wrong4→2; singleton0,well0 wrong1→0. All exact graphs passed. L48 records false singleton feedback; the other wrong counts got appropriate individual-village explanations.
- Five checks: correct pictureA then directed C; correct all-villages A then path-listed-only B; correct two-way D then reachability-shortcut C; correct dry-cluster count1 then2; correct no-well two-cluster count2 then5. All correct and wrong paths submitted. Fresh repairs: branching5/lastwell→0,triangle012+isolated3/well0→1,three isolated/no wells→3,two pairs/well1→1,star5/well2→0; all passed. Finish9/9,9corrections. L49 covers nonseparating content. Edge check shows only [a,b], and count checks show precomputed clusters rather than raw paths, so optional “draw this input” cannot recover one exact original graph (L46 family).
- Step2 Jaden: correct0—1,well0,buggyisolates,start1; format probes in L50, accepted0/1. Autumn: correct edge clicked1then0,well1,buggy1→0,start0; real0/wrongbug0 rejected,bug1 accepted. Carson:0—1 first,0—2 last,well0,start0,same second graph; real0/wrongbug0 rejected,bug1 accepted. Finish3/3. All three success messages are generic and do not explain the newly dry component.
- Step3 full drawings and both verdicts: omit well nodes No; invent edge between disconnected0/1 No; node1 degree1 Yes;0—3two-way Yes;start0 reaches4 No (actually5). Finish5/5. “Well nodes” is ambiguous (V18); direct/reachability claim contains no actual path; degree feedback only repeats1; undirected reachability feedback says arrows.
- Step4 full graphs and wrong/correct cases: start-only well check wrong0/A then1/B,real0; every-village-needs-well wrong3/A then2/C,real0; skipisolates wrong2/C then0/A,real2. Finish3/3,3corrections. Middle case displays roads but code reads input.paths, confirming L47's input-name mismatch in another Variant. Intended outputs match code; “Changed graph” again describes the unchanged correct graph (L15).

### L51 — P2: Gas repairs avoid the mistakes they should retest

Step1 picture-direction repair is cave=["G"], with no edge to distinguish one-way and two-way movement. The count-all-gas repair uses cave=["GUG","UUU"],drill(1,1): both gas cells are diagonal, so the correct rule and stop-after-first-side-gas rule both return S. The final diagonal-count repair uses ["UUU","UUG"],drill(0,0), with no diagonal gas touching the drilled cell. Although its full grid drawing can distinguish extra diagonal edges, counting danger diagonally while drawing the right side graph still gives S and passes. Use a connected direction example, at least two side-adjacent gas cells for counting, and gas directly diagonal to the drill for the danger repair.

### L52 — P2: Gas's final check refers to an absent larger cave

Step1 final visual check shows only (0,2), then asks about “the larger cave picture.” The previous larger raw grid is no longer visible; the optional drawing is blank. The text states that gas is only diagonal, which gives away the requested S label without inspecting a picture. Repeat the actual cave and drill position here so the student can verify both adjacency and whether the reveal reaches that cell.

### L53 — P2: Gas Step 2 success displays the wrong cell types

Cooper's accepted string-grid answers [["S","1"],["1","G"]] and [["1","U"],["U","G"]] are displayed after success as [["S",1],[1,"G"]] and [[1,"U"],["U","G"]]. The statement requires digit characters, not numbers. Step4 displays the same sort of values with their quotes correctly. Preserve types when formatting Step2 outputs; students should be able to trust and reuse the shown JSON.

### L54 — P2: Gas's position graph is not the reveal traversal, but Step 3 blurs them

All cave cells and side edges are correctly graded as a position-adjacency graph. Step3 then accepts (0,0) reaching (1,1) through (0,1) on ["UU","GU"]. That route exists in the position graph, but a reveal started at (0,0) sees neighboring gas and stops immediately. Another claim discusses a two-way connection into G, which is adjacency for counting danger, not permission to recurse through gas. Explicitly distinguish the static neighbor graph from the input-dependent reveal search. Otherwise the lesson risks teaching that every side-connected cell is revealed. All verdicts were tested in Chrome; this is a teaching-contract issue rather than a wrong static graph result.

### Gas Pocket Survey — full Chrome submission record

- Step1 four exact full-cell side graphs: ["UG","GU"],drill00 wrong1→2;3×3centerG,drill00 wrong1→S;["GGU","UUU"],drill11 wrong2→1;singletonU wrong0→S. Specific wrong feedback correctly identifies first-neighbor, diagonal, and zero-label mistakes.
- Five checks submitted both ways: exactA then directedC; allpositionsD then onlyU A; sidesC then eightdirectionsA; two-gas countD2 thenB1; finalS A thenB1. Repairs singletonG→X,UGU/drill02→1,UU/GU drill01→S,GUG/UUU drill11→S,UUU/UUG drill00→S all passed exact drawings. Finish9/9,9corrections. L51–52 record weak repairs and missing context; Step1 tests drilled-cell labels rather than whole-grid spread.
- Step2 Cooper:2×2,gas11,drill00; complete square in correct graph, add both diagonals in buggy graph. Correct S1/1G; wrong samebug rejected,bug1U/UG accepted. Isabelle:1×3allU,drill00,same chain both; realSSS/wrongbugSSS rejected,bugSSU accepted. Dominic:1×2allU,drill00,bug deletes sole edge; realSS/wrongbugSS rejected,bugSU accepted. Each test supplied dimensions and every U/G value. Finish3/3. L53 records numeric rendering. These rounds successfully test full grids unlike Step1.
- Step3 full graphs and both verdicts: group-as-node No; indirect diagonal position reach Yes;cornerdegree3 No;onewaygasadjacency No;singletonstartcount1 Yes. Finish5/5. Fourth feedback says “Yes” after rejecting Yes (V15). L54 distinguishes graph reachability from actual reveal behavior.
- Step4 full2×2side graphs, wrong/correct: diagonalcount wrongS1/1G+A then1U/UG+B,realS1/1G; horizontalspread wrongSS/SS+A thenSS/UU+B,realSS/SS;gasdrill wrongSS/SS+A thenUS/UU+C,realUX/UU. All entries used quoted cell strings. Finish3/3,3corrections. Shown code agrees with outputs; diagnosis feedback was specific. L15's mislabeled “Changed graph” descriptions recur. The gas-drill label case is correct but much shallower than a graph-boundary reasoning case.

### L55 — P1: Lights' final wrong-answer feedback gives the wrong count

Step1 final check has gold bulbs0,2,4,5 (four total) and silver bulbs1,3 (two total). Choosing2 gets “This forgets that the starting bulb at distance0 is gold.” Omitting bulb0 actually gives3, not2. Explain that2 counts the silver color class, and reserve the omitted-start explanation for choice3. Correct4 passed in Chrome.

### L56 — P2: Lights' last-branch goal can be met without changing its output

Kyle Step2 asks for a branch that leaves bulbs uncolored. Tree0—1 first,0—2 last leaves silver1 uncolored but both real and buggy gold counts are1. The grader accepts both predictions and rejects only “exposes the mistake,” with no explanation. Adding3 under1 makes a missed gold bulb and outputs2/1 pass. Ask specifically for a missed gold bulb and explain why losing only silver bulbs is not a counterexample to this returned count.

### L57 — P2: Lights repeats omitted-start practice and gives the answer rule upfront

All four Step1 builds offer correct-minus-one with the same “forgot distance0” feedback. The first count check repeats it; the final repair repeats the exact five-node star already built earlier. Most prompts directly ask for even-distance counts, so students need not derive alternating color from wire constraints. Retain some early scaffolding, then test a fresh tree by asking for actual colors/count without restating the parity rule. Use varied mistakes such as failing to flip colors or confusing bulb number with distance. Step4's two complementary-color star cases also provide narrow variety (V29).

### Gold and Silver Lights — full Chrome submission record

- Step1 exact builds: tree01,12,13,34 wrong2→3;chain0123 wrong1→2;five-node0star wrong0→1;singleton0 wrong0→1. Every graph passed after correction.
- Five correct/wrong checks: pictureA then missingedgeB;allbulbsB thenonlygoldA;opposite-colorwireC thenjoin-distance2D;sevenbulbgold4 then3;sixbulbgold4 then2. Fresh repairs all passed:starplusdepth2→2;01,02,23→2;chain012→2;four-node0star→1;five-node0star→1. Finish9/9,9corrections. L55 and L57 record errors/repetition.
- Step2 Josiah: correct edges clicked1→0 and1→2 but undirected, buggy arrows same order; real2/wrongbug2 rejected,bug1 accepted. Mary:chain012,both drawings same; real2/wrongbug2 rejected,bug1 accepted. Kyle:three-node0star real1/bug1 fails exposure; add3under1 gives real2/bug1 accepted (L56). All three incorrectly instruct “Type the list the real function returns” although outputs are numbers, reproducing V01's shared numeric-help defect. Finish3/3.
- Step3 exact graphs and both verdicts:colors-as-nodes No;leaf2 reaches1via0 Yes;leaf2degree0 No;oneway0—1 No;start2chainreaches3 Yes. Finish5/5. One-way feedback starts “Yes” after rejecting Yes (V15); degree feedback merely repeats1.
- Step4 full graphs and wrong/correct submissions:wrongrootcolor five-node star wrong5/B then4/A,real1;unflippedcolor five-node branching tree wrong2/A then5/B,real3;countsilver six-node star wrong0/B then5/C,real1. Finish3/3,3corrections. All outputs agree with displayed code, and wrong diagnosis feedback is specific. “Changed graph” describes the correct color state rather than the buggy state (L15); two star cases confirm V29's narrow variety.

### L58 — P2: Dungeon's repairs remove the feature that caused the mistake

Step1 membership rejects omitting zero-gold rooms, but both its main input and repair gold=[3,6,9,12] have strictly positive gold everywhere. Counting-all-gold repair rooms=[[3,1],[2],[3],[]] makes every room reachable, so summing all rooms still gives accepted20. The self-key/double-collection repair rooms=[[1],[2],[4],[],[]] has no cycle or multiple path to any reachable room, so recursion without visited still gives accepted33. Include a zero-gold key-carrying room, an unreachable rich room, and a cycle or shared child in the respective repairs.

### L59 — P2: Dungeon wording confuses key dependencies with physical movement

Step1 edge feedback says “A key grants entry in one direction; room k need not contain a key back to i,” while the statement allows walking back and forth between already accessible rooms. Correct graph arrows describe acquiring permission to open a previously locked room, not one-way hallways or a need for a new reverse key. Explain that possessing key k found in i does not imply a locked i can be opened starting from k; returning to already opened i is a separate matter. Step2 Haley's backward-arrow wording should preserve this distinction.

### Gold in the Locked Dungeon — full Chrome submission record

- Step1 exact room:value drawings and wrong/correct builds: mergegraph/gold1..5 wrong6→15;chain/gold2,4,6,8 wrong6→20;two branches/gold3,6,9,12,15 wrong18→45;singletongold1 wrong0→1. Wrong feedback correctly describes one-hop sums or omitted starting gold.
- Five checks submitted both paths:pictureA/reversedC;allroomsB/positivegoldonlyA;keyarrowA/two-wayC;reachable24/allgold124;selfkey7/double14. Fresh graph repairs passed22,30,6,20,33 respectively. Finish9/9,9corrections. L58 records three nonseparating repairs; L59 records model wording. First sum check explicitly lists every reachable room and coin amount, reducing it to arithmetic rather than testing reachability.
- Step2 Haley: room1:5g→0:2g, buggyundirected, matched value fields; correct2/wrongbug2 rejected,bug7 accepted. Miguel: nodes created1:5g before0:2g,noedges,same second graph. Contradictory value field0:2g=20 with real20/bug5 accepted all checks, confirming V08 live. Reloaded and rebuilt consistent2/5 amounts; wrongbug2 rejected thenbug5 passed. Mya:0:2g→1:5g,bug omitsedge;real7/wrongbug7 rejected,bug2 passed. Finish3/3. Success gives only generic changed-output explanation.
- Step3 full graphs/both verdicts: keys-as-nodes No;indirect1→4shortcut No;isolatedroom3outdegree1 No;listed1→2 Yes;start0reaches4 Yes. Finish5/5. Degree feedback only states0; graph claims otherwise behaved as expected.
- Step4 full graphs and wrong/correct:onlyinitialkey chain gold5,3,10 wrong18/B→5/A,real18;sharedchild gold1,2,4,8 wrong15/B→23/C,real15;firstkey gold1,2,10,4 wrong17/B→7/A,real17. Finish3/3,3corrections. All displayed code and accepted outputs agree; wrong diagnoses received specific explanations. L15's “Changed graph” labeling persists for correct unchanged key graphs.

### L60 — P2: Flood's repairs no longer expose the student's mistake

Step1 membership repair for taking only a shortest-looking route is a single blocked chain, with no alternative route to retain. Edge repair for wrongly avoiding camps next to floods has no trails and no floods. First-branch failure repair puts the successful0→1→3 route first and the flooded0→2 branch second, so returning after the first branch succeeds. Flooded-finish repair changes the finish to dry4 in a star with flooded3, so checking finish before flood still passes. All four repairs passed exact drawings in Chrome. Preserve the triggering feature in each fresh input.

### L61 — P1: Nicole's flooded-first-branch goal contradicts its search grader

Step2 asks for a flooded dead end first and a dry finish second. Draw0—1 first,0—2 second, mark1Blue, start0,finish2, and copy the graph. Realtrue/bugfalse fails both exposure and buggy output. Realtrue/bugtrue passes both predictions but still fails exposure. Change only1 fromBlue toSlate in both graphs; realtrue/bugfalse now passes. Thus the graded algorithm skips the flooded neighbor before selecting its first branch. Rewrite the goal as a dry first branch leading to a later dead end, or change the stated bug and grader consistently. This is the Variant counterpart of L38.

### L62 — P2: Flood direction feedback calls a forbidden trail usable

Step3 claim4 uses flooded2 and trail0—2. The No verdict correctly rejects “works only from0to2,” but feedback says “Yes. This graph is undirected, so0—2 works both ways.” Besides the contradictory Yes (V15), “works” implies legal travel into2. Say the physical trail is undirected but the hiker cannot enter its flooded endpoint. The later reachability claim correctly excludes flooded3, so explicitly distinguish physical adjacency from allowed travel across these questions.

### Hiking Around the Flood — full Chrome submission record

- Step1 builds exact graphs with Blue flooded nodes:diamond flooded1 wrongfalse→true;chain0123 flooded2 wrongtrue→false;01,12,03 flooded1 wrongfalse→true;drysingleton start=finish wrongfalse→true. All color checks passed. Duplicated Boolean output choices reproduce V20.
- Five checks both paths:pictureA/missingedgeB;allcampsC/shortestrouteonlyB;two-wayD/avoidfloodneighborsB;drydetourD/firstbranchfailureA;floodedfinishfalseD/finishbeforefloodA. Repairs passed true,false,false,true,true, all required Blue nodes drawn. Finish9/9,9corrections. L60 records four ineffective repairs. Edge prompt only shows [a,b], not a complete raw graph (L46 family).
- Step2 Stephanie:0—2 plusisolatedBlue1,start0,finish2,copiedgraph;realtrue/wrongbugtrue rejected,bugfalse passed. Alejandro:correctedgeclicked1then0,bugarrow1→0,start0,finish1;realtrue/wrongbugtrue rejected,bugfalse passed. Nicole's required flooded-first witness failed as described inL61; making firstleafdry allowedtrue/false and completion. Finish3/3 via an alternate witness, not compliance with the impossible stated goal. All graphs tested through visible controls.
- Step3 all exact drawings and both verdicts:onlyfloodednodes No;drydetourshortcut No;emptygraphphysicaldegree0 Yes;onewayedge0—flooded2 No;starstart1dryreach4 Yes. Blue colors graded correctly. Finish5/5. L62 records travel wording; emptygraph degree feedback discusses flood behavior with no flood present.
- Step4 all exact graphs, default node colors permitted because these cases state no color requirement: floodedfinish wrongfalse/A→true/B,realfalse;onewaytrails wrongtrue/C→false/A,realtrue;firstbranchreturn wrongtrue/A→false/B,realtrue. Finish3/3,3corrections. Displayed code agrees with outputs. Final case's return occurs after recursing back to an already visited parent before reaching the flooded node; its broad first-branch diagnosis remains true, but the explanation could identify this boundary more precisely. L15's “Changed graph” description still names the unchanged correct graph.

### L63 — P0: Train Step 4 rejects the exact graphs of cases 2 and 3

**Case2, horizontal-only traversal:** Shown yard=[["T","."],["T","."],["T","."]]. The required graph has exactly (0,0),(1,0),(2,0), with two-way edges00—10 and10—20. Chrome shows precisely these nodes and edges. Correct code output1 and diagnosisA both pass, but exact nodes and exact edges both fail. Resubmitting after checking the drawing gives the same failure. The feedback itself confirms there are three T cells in column0, yet gives no missing/extra-node details.

**Case3, replace maximum with last component:** Shown yard=[["T","T","T",".","."],[".",".",".",".","."],[".",".","T","T","."]]. Exact nodes00,01,02,22,23 and edges00—01,01—02,22—23 are rejected in the same way. Correct output2 and diagnosisB pass. A second submission reproduces the rejection. The case's own explanation correctly describes the length3 train and later length2 train, agreeing with the submitted graph.

These are blockers for following the displayed task, not wrong student answers. Check the authored graph targets against the displayed inputs for both cases. No alternate hidden answer was guessed. Both were explicitly skipped only after reproducing the failures; Step4 ended “1 of3 passed /2 code cases skipped.” They are tested and blocked, never counted as passed.

### L64 — P2: Train's total-versus-maximum repair has only one train

Step1 rejects5 for adding lengths2 and3, then gives a single vertical length3 train as the repair. Adding all cars now equals the correct maximum3, so the same error passes. Retain two trains with different lengths. Its picture repair also removes all separated diagonal cars after that was the missed rule; the final repair repeats the first build exactly (V24).

### L65 — P2: Train graph claims lack distinguishing features

Step3 membership tests components-as-nodes using only two isolated one-car trains: both approaches have one node per component/car. The direction claim uses an edgeless graph and feedback explicitly admits there are no edges. Include a multi-car train in membership and a real coupling in direction. Neither the full authored pass nor its repairs tests the explicitly stated empty-yard result0. Add a meaningful empty-yard case without replacing the needed nonempty distinctions.

### Longest Freight Train — full Chrome submission record

- Step1 builds exact T-cell graphs:oppositecorners wrong2→1;topTTT+isolatedT wrong4→3;isolatedT+verticalpair wrong3→2;singletonT wrong0→1. Feedback correctly distinguishes totalcars or linkcount from maximumcars.
- Five checks both paths:pictureA/distantedgeB;TnodesD/horizontalneighboronlyC;sideedgesD/diagonalsA;verticalmax3/total5;twotriplesmax3/linkcount2. Repairs TTT→3,isolatedpair→1,vertical3+2→3,singlevertical3→3,oppositecorners→1 all passed. Finish9/9,9corrections. L64–65 record weaknesses; a diagonal-adjacency misconception cannot be exposed by a valid yard because distinct trains are guaranteed not to touch diagonally (V04).
- Step2 Devin:forbidden diagonal singletons00/11,correctnoedge,bugdiagonal;real1/wrongbug1 rejected,bug2 passed. “Correct graph follows problem rules” is green despite invalid corner contact (V04 confirmed live). Jada:horizontal3,bugomitsfinaledge;real3/wrongbug3 rejected,bug2 passed. Jesse:same horizontal3 in both graphs;real3/wrongbug3 rejected,bug2 passed. Finish3/3.
- Step3 full graphs/both verdicts:componentnodes No;indirectverticalshortcut No;middledegree2 Yes;edgelessgraphundirected Yes;start02reaches2 No(actually3). Finish5/5. L65 identifies ineffective claims; degree feedback only repeats2.
- Step4 case1 exactisolated00+pair02—03,wrong2/A→1/C,real2,passed. Case2 exactvertical3,wrong3/C→1/A;correctgraphrejected twice. Case3 exacthorizontal3+2,wrong3/A→2/B;correctgraphrejected twice. Outputs and diagnoses agree with displayed code; L63 documents the blocking graph targets. Used one explicit Skip for each demonstrated blocker. Final screen1/3passed,2skipped,7corrections. All authored cases were exercised, but the lesson cannot be completed honestly as displayed.

### L66 — P1: Metro code cases 2 and 3 accept wrong track colors

In No Transfers, Please, Step 4 case 2 declares tracks 0—1 red, 0—2 blue, 2—3 blue. The exact colored graph passed with output false and diagnosis B. Reloading and drawing all three tracks blue also produced “Trace confirmed.” The checklist omits color validation, unlike case 1. Case 3 declares both 0—1 and 1—2 blue. Its correct drawing passed with false/C; a second submission with 1—2 red also passed. This latter drawing has no valid single-color route, yet feedback says both edges are blue and the correct output is true. Require exact colors in both cases and restore the color instruction/checklist. This is a confirmed UI false pass, not a source-code inference.

### Variant completion checkpoint: No Transfers, Please

All four Step 1 builds were drawn exactly and tested with wrong and correct outputs. All five visual checks were tested correctly, then replayed with believable wrong choices and all five fresh repair builds passed. Step 1 finished 9/9. Repairs cover mixed-only routes, reversed endpoints, an alternate one-color route, and an exposing mixed route; the final repair asks only the correct output rather than also the buggy output.

Step 2: Joel used blue 0—1, correct true/bug false, with blue edge removed from his drawing. Eva used red 0—1 and blue 1—2, correct false/bug true, with Slate edges in her drawing. Colin used blue edges 0—1 first and 0—2 second, destination 2, identical drawings, correct true/bug false. Each wrong buggy prediction was rejected and each corrected prediction passed. Feedback only marks the wrong field and success gives a generic contradiction statement rather than explaining the particular search.

Step 3: all five exact colored graphs and both verdicts tested: separate station per color No; indirect 2-to-0 route Yes; station 3 degree zero No; two-way 1—2 Yes; red 0—1 called blue No. All passed after intended corrections. Step 4: all three exact graphs, wrong/correct outputs, and correct diagnoses tested. Cases 1 true/C (real false), 2 false/B (real true), 3 false/C (real true) passed. Additional wrong-color probes confirmed L66. All three cases repeat the existing L15 issue: “Changed graph” describes the correct input rather than clearly stating the buggy graph/search change. Final screen 3/3, with no skipped cases. Browser-control timeouts were recovered through direct Chrome controls and are not classified as site defects.

### L67 — P2: Office Rumor repairs do not expose the mistake just made

After choosing one-way friendship in Step 1, the repair uses n=3, friendships=[], start=0. It has no edges and returns 1 under either directed or undirected thinking. After returning the largest component (5) instead of starter 6's two-person component, the repair is one connected five-person star starting at 0: largest component, entire office, direct-friends-plus-starter, and correct component all return 5. Both repairs passed in Chrome. Use reverse-listed edges for direction and unequal disconnected components with a starter outside the largest component. The exclude-starter repair is a two-person component, but choices are 4/3/2: the mistaken answer 1 is unavailable, weakening that repair too.

### Variant completion checkpoint: Office Rumor

Step 1: all four exact builds tested wrong/correct (chain-of-three 2→3; chain-of-four 2→4; disconnected office 5→2; singleton 0→1). All five visual checks tested correctly and then replayed wrong with all five fresh builds passed: full picture A versus omitted separate friendship B; employee nodes C versus isolated omission D; two-way edge B versus one-way A; count5 C versus exclude-starter4 D; starter-component2 A versus largest-component5 C. Finished 9/9. L67 records weak repairs. The singleton's zero answer receives generic “off by 1” feedback instead of explaining the omitted starter. The [a,b]-only raw input also repeats L46's non-drawable optional scratch-input issue.

Step 2 all three graphs tested wrong/correct: Levi chain0—1—2 with identical drawings and outputs3/2; Naomi pair0—1 with edge removed in second drawing, outputs2/1; Oliver nodes0/1/2 and edge0—2, start0 versus1, identical drawings, outputs2/1. Wrong buggy outputs3/0/2 respectively were rejected and revisions passed. Success and error explanations remain generic.

Step 3 all five exact graphs and both verdicts tested: relationship-as-node No; direct2—3 Yes; star leaf degree1 Yes; one-way0—2 No; edgeless start1 reaches2 No. The one-way feedback says “Yes. This graph is undirected,” confirming V15 again. The edgeless undirected claim says “follow the arrows exactly,” although there are none. Step 4 all three exact graphs and wrong/correct predictions passed: reversed chain, wrong3→1/A (real3); one-hop code, wrong4→2/C (real4); subtract-starter code, wrong2→1/A (real2). All code/output pairs agree. L15's misleading “Changed graph” headings recur. No cases skipped.

### L68 — P1: Package counterexamples require an undisclosed unreachable output

Step 2 Ashton drops the last road; Bella makes the road one-way. Both goals intentionally make the buggy outpost unreachable, but the problem promises connected trees and defines only travel hours and the same-warehouse zero case. The counterexample instructions never define an unreachable sentinel or show code defining it. In Chrome, correct graph 0—1 with weight5, HQ0,target1, and Ashton's edgeless graph rejected buggy0 and accepted buggy-1. Bella's road listed1→0 similarly accepted only the revised -1. Explain explicitly that these buggy searches return -1 when no route exists; a student cannot infer a function's return convention from disconnection alone.

### L69 — P1: Package code cases 2 and 3 do not grade road weights

Step 4 case2 input roads=[[1,0,5],[2,1,1]],HQ0,target2. The exact weighted graph passed with -1/B. Reloaded, drew the same graph with every edge label blank, submitted -1/B, and received “Trace confirmed.” Case3 roads=[[0,1,2],[1,2,3],[0,3,9]] likewise passed both the exact weighted graph and a completely unweighted graph with14/C. Both omit the weight instruction/checklist shown in case1. Require exact weights: the student is supposed to explain 6 hours in case2 and 14 versus5 in case3, which an unweighted drawing cannot represent.

### L70 — P2: Package explanations imply a shortest-path problem that does not exist here

Step1 rejecting arrival-time nodes says the algorithm stores the “best time” for each warehouse. Rejecting unweighted roads says a route with more roads can still be faster. Step4 case1 offers “dFS chooses a longer branch even though a shorter route exists.” The statement guarantees a tree and exactly one route between any pair. These comments suggest competing routes or shortest-path optimization, distracting from the intended sum along one unique route. Explain accumulated time on that route; use a distractor grounded in this tree problem. The lowercase “dFS” should also be corrected.

### Variant completion checkpoint: Package to the Outpost

Step1 all four weighted builds wrong/correct: full-tree sum16→route9; reverse route-1→6; side-road sum14→5; same-HQ1→0. All five visual questions tested correctly and replayed wrong: exact picture A versus missing-edge B; warehouse nodes B versus arrival-time C; weighted edge B versus unweighted C; time12 B versus hops4 C; time2 B versus whole-tree12 C. All five fresh repair graphs passed (13 hours, four warehouse nodes,9 hours,11 hours,6 hours). The final repair omits the sum-all-roads answer10 and instead offers-1/7, so it weakly targets the preceding whole-tree-sum error. The [a,b,hours]-only scratch input repeats L46. Finished9/9.

Step2 all three correct and buggy drawings tested: Ashton correct pairweight5 with last edge removed, outputs5/-1; Bella reverse-listed1—0 turned into1→0, outputs5/-1; Cody pair0—1, wrong HQ1 equals target1, identical graphs, outputs5/0. Each wrong buggy output was rejected and revised output passed. L68 records the hidden -1 requirement; G07 and V10 remain relevant earlier findings. Step3 all exact weighted graphs and both verdicts tested: roads-as-nodes No; missing-direct-edge No; node1 degree0 No; two-way0—1 Yes; edge3—4 weight3 Yes. All passed. Step4 correct drawings and wrong/correct predictions tested: hop count7→2/B (real7); directed roads6→-1/B (real6); all-roads sum5→14/C (real5). All passed, plus omitted-weight probes confirmed L69. L15's “Changed graph” feedback issue recurs. No skipped cases.

### L71 — P2: Campsite repairs allow the original misconceptions to survive

Step1 membership asks whether to keep only cells in size-k components. Its main park=[[1,0],[0,1]],k=1 has only qualifying cells; the repair park=[[1,1],[1,1]],k=4 again has only qualifying cells and no forest. Neither exposes premature filtering, and the repair also cannot test exclusion of forest nodes. The diagonal-edge repair is a single vertical three-cell column: no diagonal candidate exists. After counting all four components instead of the two size-3 ones, the repair has two size-2 pairs with k=2, so counting every component passes. After counting six qualifying cells instead of three campsites, the repair uses three isolated cells,k=1, so counting qualifying cells still passes. All four repairs were drawn and passed in Chrome. Add nonqualifying components/forest, diagonal contacts, and k>1 as appropriate; repairs must separate correct and mistaken rules.

### L72 — P0: Campsites Step 4 cases 2 and 3 reject their exact input graphs

Case2 park=[[1,1,1],[0,0,0]],k=2 requires nodes(0,0),(0,1),(0,2) and edges(0,0)—(0,1)—(0,2). Submitted that exact graph with output1 and diagnosisC (>= rather than ==). Output and diagnosis passed, but nodes and edges both failed. Inspected every displayed node/edge label and resubmitted; identical rejection. The feedback itself confirms three top-row grass squares forming a size-3 campsite.

Case3 park=[[1,1,0],[0,0,0],[0,1,1]],k=2 requires nodes(0,0),(0,1),(2,1),(2,2), edges(0,0)—(0,1) and(2,1)—(2,2). Exact drawing with output4 and diagnosisA (adds size rather than1) again passed output/diagnosis but failed nodes/edges twice. Code and declared behavior agree; the hidden graph target does not agree with the visible input. Both are reproducible blocking grader failures, like L63. Align grading with the actual displayed grids, without weakening exact graph checks. Used one explicit Skip per demonstrated blocker only; final screen1/3 passed,2 skipped,7 corrections.

### Variant completion checkpoint: Perfect-Size Campsites

All four Step1 exact builds tested wrong/correct: all-components3→2; merged-diagonals0→2; at-least-k1→0; isolated-cell omission0→1. All five visual checks tested correct and then wrong, with all fresh repairs passed: exact picture A versus missing edge B; grass-cell nodes D versus prefiltered A; side edges A versus diagonals B; size3 count2 B versus all4 D; size2 count3 B versus cells6 C. Finished9/9. L71 records the weak repairs. The impossible negative campsite count-1 in a build is also a poor generic distractor.

Step2: Miley diagonal cells00/11,k1, correct2/bug0, diagonal added in second graph; Patrick adjacent00/01,k2, correct1/bug0,last edge removed; Katie T-shaped cells01/10/11/12,start11,k4, identical graphs, correct1/bug0. Wrong buggy outputs1/2/1 were rejected; revised outputs passed. The required “first grass square” has no stated role in this whole-grid counting function, and generic feedback does not explain the outer scan. Step3 all five exact graphs and both answers tested: components-as-nodes No; direct00—01 Yes; bottom cell degree2 No; two-way03—04 Yes; isolated00 reaches2 No. All passed; the last feedback again says “follow the arrows” for an undirected edgeless graph. Step4 case1 exact isolated diagonal cells, wrong2→0/A, real2, passed. Cases2–3 were fully exercised and blocked as L72 describes, not counted as successful passes. All authored cases tested; honest UI completion is impossible as displayed.

### L73 — P2: Summit questions and repairs lack the features needed to test their misconception

Step1 camp-membership input graph=[[1,3],[2],[3],[]] puts every camp on a successful route, so “only camps on successful routes” produces the same picture as the correct rule. The repair does introduce an unused camp, which is better; add one to the main question too. The edge repair graph=[[],[0],[]] cannot reach summit2 under either original or reversed arrows, and offers no multi-step successful route to expose the invented-shortcut choice. The shared-suffix repair graph=[[1,2,3],[3],[3],[]] merges only at the target; the Step4 global-visited code checks target before visited and therefore passes this repair without fixing that bug. Use a non-target merge with a shared final edge. The dead-end-as-summit repair graph=[[1,2],[3,4],[4],[5],[5],[]] has no non-summit leaf, so the same wrong leaf rule returns the accepted3. All these repair graphs passed in Chrome.

### L74 — P2: Summit's “linear camps” membership claim is undefined and not exposed by its input

Step3 claim “In this input, linear camps should be left out” uses graph=[[2],[],[]]. “Linear camps” is never defined, and there is no internal chain camp with one incoming and one outgoing trail. The expected No passed, while Yes received only a generic every-camp node rule. If the intended mistake is compressing intermediate camps, use a real chain 0→1→2 and say “Camp1 can be omitted because it has only one onward trail.” That tests a concrete identity mistake rather than unclear terminology.

### Variant completion checkpoint: Routes to the Summit

Step1 all four exact builds tested wrong/correct: diamond1→2; direct-plus-long route1→2; dead-end branch2→1; direct summit0→1. All five visual questions tested correct and replayed wrong: exact A versus reversed C; camp nodes A versus successful-route-only C; arrow A versus invented-shortcut D; route count3 A versus shared-prefix merge2 B; final count1 B versus non-summit-leaf2 A. All five fresh repair graphs passed, Step1 finished9/9. L73 records weak repairs and overlapping membership answers. Raw input “j; graph[i]” repeats L46's incomplete optional scratch input.

Step2 all three cases tested wrong/correct: Amy diamond with identical graphs, correct2/bug1; Angela single0→1 reversed in second graph, correct1/bug0; Damian single0→1 removed in second graph, correct1/bug0. All passed after rejecting wrong buggy outputs2/1/1. Step3 all five exact graphs and both verdicts tested: omit-linear-camps No; missing-direct1→0 No; summit outdegree0 Yes; reverse2→0 No; from1 reaches3 Yes. All passed; L74 records the unclear membership claim. Step4 all three exact graphs with wrong/correct predictions passed: shared non-target merge2→1/B (real2); first-neighbor-only2→1/A (real2); direct-summit-only3→1/B (real3). All code/output pairs agree. L15's misleading “Changed graph” heading repeats. No skipped cases.

### L75 — P2: Rune repairs do not expose the ban-on-all-repeats misconception

Step1's legal-extension question uses dials=["a","a"], where banning any repeated rune and banning only adjacent repeats both block the extension. Selecting “never appeared anywhere earlier” is rejected correctly as a general rule, but its repair dials=["b","ab"] again cannot distinguish those rules: both return["ba"]. The later aba question can expose this error, yet its repair dials=["xy","x"] again has only two dials, and both rules return["yx"]. Both repairs passed in Chrome. Use three or more dials with a legal nonadjacent repeat, such as a,b,a, in the repair itself.

### L76 — P1: Rune Step 4 case 3 requires an illegal-prefix node without saying the graph target changed

Input dials=["a","b","bc"] has correct legal prefix chain start→a→ab→abc; abb violates the adjacent-equal rule. This exact graph was rejected twice for both node and edge checks while output["abb","abc"] and diagnosisB passed. Inspected all node labels and directed edges to rule out drawing mistakes. Then deliberately added node abb and arrow ab→abb: the grader immediately returned “Trace confirmed.” The case is grading the buggy expansion graph, unlike cases1–2 and the rest of this lesson's legal-prefix graph requirements. Its own explanation says extending ab with b is invalid. Either grade the correct graph consistently or explicitly ask for and teach the buggy graph; never require an unannounced illegal node. Final UI says3/3 only because this deliberately wrong legal-model drawing was accepted.

### Variant completion checkpoint: Runes on the Castle Door

Step1 all four exact graphs tested wrong/correct: ["ab","ab"] all-four→["ab","ba"]; ["ab","b"] ["ab","bb"]→["ab"]; ["a","a"] ["aa"]→[]; single["xy"] []→["x","y"]. All five visual questions tested correct and replayed wrong; all fresh repairs passed: exact pictureA/missing-edgeB, prefix-stateB/completed-onlyC, extensionA/global-repeat-banB, aba-onlyC/no-codesD, no-complete-codeC/two-codesA. Finished9/9. L75 records weak repeat-rule repairs; several generic duplicate-list distractors and numeric[0] do not reflect a clearly taught misconception.

Step2 Kenneth deliberately tested the legal tree for ["ab","b"]: start→a,start→b,a→ab. True complete output["ab"] and buggy["ab"] were rejected only for the correct-output field, while the grader claimed this exposed a bug. Changing the supposed correct output to["ab","b"] passed. This is direct Chrome confirmation of V05: a dead-end incomplete prefix is accepted as a complete code, creating a false contradiction. The UI collects no dials, confirming the V06 clarity/validation gap. Diana's one-dial a/b tree passed correct["a","b"],bug["b"] after rejecting["a"]. Amanda's start→a→ab tree passed correct["ab"],bug[] after rejecting["a"]. All three cases exercised; Kenneth's green completion is a false pass, not a mathematically valid witness.

Step3 all five exact prefix graphs and both verdicts tested: completed-leaves-only No; indirect start→ba Yes; start degree3 No; start→a Yes; leafab reaches2 No. All passed. Step4 correct graphs and wrong/correct code outputs: global-repeat-ban ["aba"]→[]/C (real["aba"]), first-choice-only all-four→["ac"]/A (realfour codes), whole-prefix comparison ["abc"]→["abb","abc"]/B (real["abc"]). Cases1–2 passed exact graphs. Case3 rejected the exact graph twice and accepted the added illegal abb node (L76). Final3/3 reflects that false pass; no cases skipped. L15's “Changed graph” heading also recurs.

### L77 — P2: Vault practice repeats examples and removes multi-start overlap from its repair

Step1's count5 visual question repeats the first build's exact six-vault graph and starting keys[0,3]; its final count3 question repeats the second build's exact cycle and start[1]. Students have already seen both answers and explanations. After a wrong count6 on the multi-start example, the repair is a single-start chain0→2→1 with every vault reachable. Counting every vault or adding independent start counts now produces the accepted3; the repair no longer tests shared reachability across starts. The final cycle repair removes the cycle (though its diamond does still test duplicate discovery). Use a fresh multi-start graph with overlapping reachable sets and a sealed vault, and retain a real cycle when testing cycle handling. Empty startKeys is not exercised by the authored cases observed here; adding that boundary would improve coverage. V27 separately covers the single-key-only Step2 form.

### Variant completion checkpoint: The Night Guard's Keyring / Museum Vault Keyring

All four Step1 exact graphs tested wrong/correct: overlapping starts6→5; cycle4→3; isolated initial vault0→1; duplicate starting key3→2. All five visual questions tested correctly and replayed wrong, and all fresh repairs passed: exact pictureA/reversedC; every-vault nodesD/initial-onlyA; containing-vault arrowB/reverseA; union count5 A/all6 B; cycle count3 A/all4 B. Finished9/9. L77 records repeated examples and weak overlap repair. The empty initial vault's wrong0 receives generic “off by1” feedback rather than explaining that opening an empty vault still counts.

Step2 all three cases tested wrong/correct: Juliana0→1 with last edge removed, start0,correct2/bug1 (wrong0 rejected); Elias1→0 changed to undirected,start0,correct1/bug2 (wrong1 rejected); Shelby2→0 with isolated1,start2, identical graphs,correct2/bug1 (wrong2 rejected). The single initial-key field directly confirms V27; multiple or empty keyrings cannot be designed. Step3 all five exact graphs and both verdicts tested: keys-as-nodes No; missing-direct1→0 No; node0 outdegree1 Yes; arrow1→2 Yes; start2 reaches3 No(actual2). All passed. Step4 all three exact graphs and wrong/correct outputs tested: never-read-contents3→1/A(real3); first-start-only5→3/B(real5); two-way-keys1→2/A(real1). All passed; shown code agrees with outputs. L15's misleading “Changed graph” heading repeats. Final3/3, no skips.

## One list of all findings, highest priority first
- [P0] L63: Fix Train Step4 cases2–3 rejecting the exact graphs shown in their inputs.
- [P0] L72: Fix Campsites Step4 cases2–3 rejecting their exact grass-cell graphs.

- [P0] V01: Make the reversed-shelf case return a gradeable value and show number-format help.
- [P0] V02: Replace the impossible extra-diagonal constellation case.
- [P1] L66: Grade track colors in Metro Step 4 cases 2–3; both currently accept wrong-colored graphs.
- [P1] L69: Require road weights in Package Step 4 cases 2–3; blank labels currently pass.
- [P1] L76: Stop Rune Step4 case3 silently requiring illegal abb in the supposedly legal-prefix graph.
- [P1] L68: State Package's required -1 output when a buggy search cannot reach the outpost.
- [P1] L01: Accept numeric All Paths outputs, not only quoted node IDs.
- [P1] L07: Replace GFG's impossible adjacent-but-disconnected start goal.
- [P1] L02: Save the final passed answer before either next-step button navigates.
- [P1] L03: Give Bipartition's node check an isolated person so its choices differ.
- [P1] L04: Fix equal-group-size feedback on an already equally split graph.
- [P1] L08: Explain the actual bad picture edge, not an unrelated arrow mistake.
- [P1] L11: Stop treating a coin's deepest containing box as the wrong parent.
- [P1] L12: Give Shelf's final code case only one bug, not both early stopping and returning a count.
- [P1] L15: Make “Changed graph” feedback describe the buggy graph, not the correct one.
- [P1] L18: Remove the hidden no-grandchildren bug from Valve's ID-lookup code case.
- [P1] L25: Correct Playlist's explanation for the shallow-flattening answer3.
- [P1] L28: Fix Pile's claim that summing5,6,7,8 gives15 rather than26.
- [P1] L36: Align Restrictions' Blue instruction with its Red color grading.
- [P1] L37: Stop silently ignoring forbidden nodes in Restrictions' reachability claims.
- [P1] L38: Make Brennan's blocked-first-branch goal match the search that is graded.
- [P1] L41: Explain Constellations' actual search order and fix the misleading first-star goal.
- [P1] L47: Match Coffee's displayed input keys to the code's graph/checkpoint fields.
- [P1] L48: Correct Wells' explanation for counting an already-supplied singleton.
- [P1] L50: Explain or broaden the accepted yes/no format for existing-well flags.
- [P1] L55: Explain Lights' answer2 as counting silver, not merely omitting bulb0.
- [P1] L61: Fix Nicole's flooded-first goal to match a search that skips flooded neighbors.
- [P1] N01: Fix Boolean Step 4's wrong real answer and non-separating input.
- [P1] O01: Stop marking the valid “any starting bomb” node answer wrong.
- [P1] N03: Remove Boolean Step 4's second true diagnosis.
- [P1] V03: Count only border-touching boats, using explicit grid dimensions.
- [P1] V05: Exclude unfinished rune prefixes from returned complete codes.
- [P1] N04: Reconcile Flood Fill's conflicting node rules.
- [P1] N02: Use one tree numbering rule across all steps.
- [P1] V07: Use playlist indexes, not drawing order, for correct playback.
- [P1] V08: Prevent node labels and extra value fields from disagreeing.
- [P1] N09: Stop label values and scorer values disagreeing.
- [P1] G07: Step 2 can ignore a wrong weight written on the drawing
- [P1] G02: Refresh loses the student's drawings and answers but keeps reassuring badges
- [P1] O02: Replace the bipartition bridge goal with an odd-cycle witness.
- [P1] N21: Make Boolean Step 2's first goal achievable.
- [P1] V04: Stop requiring corner-touching boats/trains forbidden by the problem.
- [P1] V33: Replace the one-node coffee case that violates checkpoint constraints.
- [P1] N08: Derive Getting Gold safety and arrows from traps.
- [P1] N05: Validate Moocast arrows against radio range.
- [P1] N06: Collect k and validate Properties Graph overlaps.
- [P1] V06: Check rune graphs against actual dial choices and complete branching.
- [P1] N10: Reject children under scalar Deep Count items.
- [P1] N07: Reject nonrectangular Farmland inputs.
- [P1] V10: Require a valid tree for Outpost's correct input.
- [P1] V09: Enforce the required sorted employee output.
- [P1] V11: Replace the valid boat-orientation distractor.
- [P1] V12: Exclude self-scores from the intended courier-node distractor.
- [P1] O05: Fix feedback whose stated arithmetic does not produce the selected wrong answer.
- [P1] V14: Fix the gold-count feedback: omitting the start gives3, not2.
- [P1] V15: Remove “Yes” from feedback rejecting one-way claims.
- [P1] V18: Fix box/item/depth/count confusion in shelf code explanations.
- [P1] O07: Make each Division code case contain one real bug, not an incomplete special-case function.
- [P1] O09: Remove extra bugs and ambiguous diagnoses from added Step 4 cases.
- [P1] V13: Fix trust examples with invalid diagonal zeros and clarify self-links.
- [P1] V16: Vary Step3 membership answers and total Yes counts.
- [P2] G01: Step 4 never asks the student to predict the correct solution's output
- [P2] L13: Give Islands' rule questions inputs where the competing rules produce different drawings.
- [P2] L14: Make Islands' repairs expose the student's original counting or diagonal mistake.
- [P2] L16: Include a late listener in Phone Chain's membership repair.
- [P2] L17: Replace Phone Chain's immediately repeated final input and answer.
- [P2] L19: Make Valve's membership example distinguish a subtree from the whole tree.
- [P2] L20: Keep an upstream sprinkler in Valve's repair for counting upstream flow.
- [P2] L21: Give Study Group's sum-versus-maximum repair more than one component.
- [P2] L22: Explain actual counting mistakes in Study Group instead of vague off-by-one claims.
- [P2] L23: Give Study Group's later output checks fresh component sizes.
- [P2] L24: Include empty folders when testing whether their containment edges exist.
- [P2] L26: Use visible folder names and distinguish visitation order from graph edges.
- [P2] L27: Make Playlist's order repairs distinguish nested-first from top-level-first playback.
- [P2] L29: Include an empty box in Pile's repair for omitting empty boxes.
- [P2] L30: Include a zero-sum occupied layer in Pile's zero-sum repair.
- [P2] L31: Include scores exactly equal to k in Courier's strict-threshold repairs.
- [P2] L32: Keep an isolated office in Courier's isolated-office repair.
- [P2] L33: Put duplicate values in Properties' duplicate-counting repair.
- [P2] L34: Put connected edges in Properties' edge-count-versus-component repair.
- [P2] L35: Shorten unrelated scaffolding in Properties'83–87-line code cases.
- [P2] L39: Put an allowed descendant behind the forbidden node in Restrictions' final repair.
- [P2] L40: Re-enable graph copying after a copied Step 2 drawing is cleared.
- [P2] L42: Remove the extra cell-counting bug from Constellations' isolated-star code case.
- [P2] L43: Include multi-cell boats in the node-identity and cell-counting repairs.
- [P2] L44: Stop saying the top-border-only code groups a boat it never visits.
- [P2] L45: Grade full routes in Coffee's repairs for unfinished-route mistakes.
- [P2] L46: Give Coffee's optional edge drawing an actual adjacency-list input.
- [P2] L49: Use a real multi-step path in Wells' shortcut repair.
- [P2] L51: Make Gas's direction and danger-count repairs expose the missed rule.
- [P2] L52: Show the actual cave in Gas's final visual check.
- [P2] L53: Preserve digit-character quotes in Gas's Step 2 results.
- [P2] L54: Distinguish Gas's position adjacency from its stopping reveal search.
- [P2] L56: Make Lights' last-branch goal require a missed gold bulb.
- [P2] L57: Vary Lights' repeated omitted-start questions and reduce parity-rule giveaways.
- [P2] L58: Retain zero-gold rooms, locked gold, and repeat visits in Dungeon's matching repairs.
- [P2] L59: Describe Dungeon arrows as key dependencies, not one-way physical travel.
- [P2] L60: Keep detours, flood adjacency, failed first branches, and flooded finishes in their repairs.
- [P2] L62: Separate Flood's two-way physical trails from legal dry-only travel.
- [P2] L64: Keep multiple trains in the total-versus-maximum repair.
- [P2] L65: Add distinguishing Train membership/direction inputs and an empty-yard test.
- [P2] L67: Replace Office Rumor repairs that cannot expose direction, wrong-component, or starter-count mistakes.
- [P2] L70: Remove shortest-path wording from Package's unique-route tree lesson.
- [P2] L71: Make Campsite repairs expose premature filtering, diagonal merging, all-component counting, and cell-versus-campsite counting.
- [P2] L73: Give Summit questions and repairs unused camps, non-target merges, real shortcut opportunities, and non-summit dead ends.
- [P2] L74: Replace Summit's undefined “linear camps” claim with a concrete intermediate-camp example.
- [P2] L75: Use legal nonadjacent repeats in Rune repairs so a ban on every repeated letter cannot pass.
- [P2] L77: Replace repeated Vault examples and use fresh multi-start overlap, cycle, and empty-keyring practice.
- [P2] G03: Later steps have no simple route back to earlier learning
- [P2] G04: Graph feedback reports broad failures without locating the small mistake
- [P2] G05: The small-screen layout puts a large optional editor before the question
- [P2] G06: A failed Step 4 check clears a correct diagnosis unnecessarily
- [P2] N11: Enforce the lessons' stated input constraints.
- [P2] N12: Replace HackerRank's false diagonal-error explanation.
- [P2] N13: Replace GFG's impossible diagonal-success distractor.
- [P2] N14: Replace wrong-shape array and matrix distractors.
- [P2] N15: Remove duplicated Boolean-output choices.
- [P2] N16: Replace 153 generic ±1 distractors with specific mistakes.
- [P2] N17: Give 24 “fresh picture” checks actually fresh inputs.
- [P2] N18: Stop reusing worked-example answers in all 50 later checks.
- [P2] N19: Use inputs that expose each node/edge distinction.
- [P2] N20: Make Step 3 fresh and stop always answering No first.
- [P2] N22: Replace Gold's empty-direction-list case with deeper reasoning.
- [P2] N23: Give Employee Importance's overwrite case real sibling branches.
- [P2] N24: Correct misleading Sub-islands and Gold code explanations.
- [P2] N25: Clarify Deep Count's empty-array choice.
- [P2] N26: Replace Flood Fill's implausible same-color choices.
- [P2] N27: Distinguish the chosen cell model from valid region compression.
- [P2] N29: Make Largest Component's comparison case test its stated mistake.
- [P2] N30: Clarify Fish's true-but-not-faulty diagnosis choice.
- [P2] N31: Correct Moocast's end-cow output explanation.
- [P2] N32: Correct Tree Sum's left-only bug output.
- [P2] O03: Remove duplicate Boolean output choices from 63 original decisions.
- [P2] O04: Replace impossible or mechanically duplicated distractors with real student mistakes.
- [P2] O06: Replace unexplained numerical distractors and repair the phone-count feedback.
- [P2] O08: Replace repeated questions and generic feedback with case-specific reasoning.
- [P2] O10: Move runtime jug-answer corrections back into the authoritative authoring content.
- [P2] O11: Resolve the empty-list inverse-depth disagreement in the source reference.
- [P2] O12: Make bomb examples obey their stated coordinate constraints.
- [P2] O13: Require Step 2 examples to change the actual result, not merely visited nodes.
- [P2] O14: Describe the All Paths first-neighbor code accurately.
- [P2] O15: Ground bomb Step 2 arrows in actual centers and radii.
- [P2] O17: Make labels, code formatting, and diagnosis wording consistent and readable.
- [P2] O18: Make increasing-grid Step 2 examples represent complete rectangular matrices.
- [P2] O19: Remove prompt wording that states the graph conclusion before asking it.
- [P2] O21: Make the bomb remedial actually expose the arrow-reversal mistake.
- [P2] V17: Replace generated terms such as “linear camps” with clear claims.
- [P2] V19: Replace arbitrary off-by-one distractors with real mistakes.
- [P2] V20: Remove repeated Boolean outputs disguised as separate choices.
- [P2] V21: Replace unsupported duplicate-result distractors.
- [P2] V22: Move answer-giving prompt text into feedback.
- [P2] V23: Teach whole-grid gas spreading before requiring it in Step4.
- [P2] V24: Use fresh remedial inputs and unseen Step3 transfer graphs.
- [P2] V25: Diversify repeated shelf, coffee-route, and trust builds.
- [P2] V26: Use meaningful problem-specific boundaries in the five graph claims.
- [P2] V27: Support multiple starting keys in the keyring editor.
- [P2] V28: Let trust counterexamples use real scores and a threshold.
- [P2] V29: Broaden the near-duplicate complementary-color code cases.
- [P2] V30: Give each wrong boat answer one precise cause.
- [P2] V31: Separate reversed-phone-edge mistakes from listener-wait mistakes.
- [P2] V32: State the feeder0 exception before grading sprinkler edges.
- [P2] V34: Make new-node defaults follow the lesson's required name format.
- [P2] V35: Rename the same-question retry button or provide a new question.
- [P2] L05: Replace the repeated province repair with a fresh isolated-city test.
- [P2] L06: Use repeated letters to make the swap node-membership claim clear.
- [P2] L09: Give diagonal-move repairs a real adjacent diagonal pair.
- [P2] L10: Make Word Search repairs actually expose failed branches or cell reuse.
- [P3] N28: Correct Deep Count's containment-depth wording.
- [P3] O20: Use a jug-state example that fits the current capacities.
- [P3] O16: Remove Division's stale internal “weights omitted” metadata.
