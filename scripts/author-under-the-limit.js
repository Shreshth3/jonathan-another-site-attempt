/* Authors "Under the Limit", an easier warm-up for The Balance Lock that is
 * only about recursion: list every combination whose sum is at most limit.
 * Every drawn graph, correct answer, and wrong answer below is computed by
 * running the reference solver or the named mistaken solver, never typed by hand.
 * Re-running replaces this problem's entries in place:
 *   node scripts/author-under-the-limit.js
 * then run step5-build.js, step6-build.js, and build-visual-data.js.
 */
const files = require("./author-variant-files");

const ID = "under-the-limit";

// ---------- Reference solver and single-mistake solvers ----------
// A combination only ever adds numbers that come later in nums, so each appears once.
function combos(nums, limit, mistake = null) {
  const found = [];
  const visit = (start, combo, sum) => {
    let grew = false;
    const record = () => { if (mistake !== "skip-empty" || combo.length) found.push(combo); };
    if (mistake !== "leaves-only") record();
    const first = mistake === "reuse-earlier" ? 0 : start;
    for (let i = first; i < nums.length; i++) {
      if (mistake === "reuse-earlier" && combo.includes(nums[i])) continue;
      const next = sum + nums[i];
      if (mistake === "bust-at-limit" ? next >= limit : mistake === "check-number-not-sum" ? nums[i] > limit : next > limit) {
        if (mistake === "stop-at-first-bust") break;
        continue;
      }
      grew = true;
      visit(mistake === "reuse-same" ? i : i + 1, [...combo, nums[i]], next);
    }
    if (mistake === "leaves-only" && !grew) record();
  };
  visit(0, [], 0);
  if (mistake === "merge-by-sum") return found.filter((combo, index) => found.findIndex(other => total(other) === total(combo)) === index);
  return found;
}
const total = combo => combo.reduce((sum, number) => sum + number, 0);

const label = combo => combo.length ? combo.join(",") : "start";
function canvas(nums, limit) {
  const nodes = [{ id: "start", label: "start" }], edges = [];
  const visit = (start, combo, sum) => {
    for (let i = start; i < nums.length; i++) {
      if (sum + nums[i] > limit) continue;
      const next = [...combo, nums[i]];
      nodes.push({ id: label(next), label: label(next) });
      edges.push({ from: label(combo), to: label(next) });
      visit(i + 1, next, sum + nums[i]);
    }
  };
  visit(0, [], 0);
  if (nodes.length > 9) throw Error(`${JSON.stringify(nums)}: ${nodes.length} nodes exceeds the Step 1 cap`);
  if (nodes.length !== combos(nums, limit).length) throw Error("canvas and solver disagree");
  return { directed: true, nodes, edges };
}
const inputText = (nums, limit) => `nums=${JSON.stringify(nums)}, limit=${limit}`;
const out = value => JSON.stringify(value);
// Output order and the order inside each combination do not matter; repeats do.
const canonical = list => JSON.stringify(list.map(combo => JSON.stringify([...combo].sort((a, b) => a - b))).sort());
const sameList = (a, b) => canonical(a) === canonical(b);
const count = list => String(list.length);
const codeText = combo => `\`[${combo.join(", ")}]\``;
const listLabel = list => list.length === 1 ? codeText(list[0]) : list.length === 2 ? `${codeText(list[0])} and ${codeText(list[1])}` : `${list.slice(0, -1).map(codeText).join(", ")}, and ${codeText(list.at(-1))}`;

// A two-choice decision whose wrong answer is what the named mistake really returns.
function decision(nums, limit, prompt, mistake, correctFeedback, bugFeedback, format = out) {
  const correct = combos(nums, limit), buggy = combos(nums, limit, mistake);
  if (sameList(correct, buggy) || format(correct) === format(buggy)) throw Error(`${mistake} does not change ${inputText(nums, limit)}`);
  return {
    prompt,
    choices: [
      { id: "correct", label: format(correct), feedback: `Correct. ${correctFeedback}`, misconception: null },
      { id: "bug", label: format(buggy), feedback: bugFeedback, misconception: mistake }
    ],
    correct: "correct"
  };
}
function build(id, title, facet, nums, limit, mistake, correctFeedback, bugFeedback) {
  return {
    id, title, facet,
    prompt: "Use the raw input to complete the challenge. Then choose the result.",
    input: inputText(nums, limit),
    canvas: canvas(nums, limit),
    decision: decision(nums, limit, "Which combination list is returned?", mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
function remedial(id, title, nums, limit, prompt, mistake, correctFeedback, bugFeedback, format) {
  return {
    id, title: `Fresh proof · ${title}`,
    prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
    input: inputText(nums, limit),
    canvas: canvas(nums, limit),
    decision: decision(nums, limit, prompt, mistake, correctFeedback, bugFeedback, format),
    why: correctFeedback
  };
}
// Each choice's label must be exactly what its mistake (or the correct solver) returns.
function checkChoices(nums, limit, choices, correctId, format) {
  const truth = format(combos(nums, limit));
  for (const choice of choices) {
    const shown = format(choice.id === correctId ? combos(nums, limit) : combos(nums, limit, choice.misconception));
    if (shown !== choice.label) throw Error(`${choice.id}: label ${choice.label} but its rule gives ${shown}`);
    if (choice.id !== correctId && shown === truth) throw Error(`${choice.id}: wrong choice equals the correct answer`);
  }
}

const nodeQuestion = {
  prompt: "What is a node in the combination tree?",
  correct: "combo",
  choices: [
    { id: "combo", label: "A combination whose sum is at most limit. The root is the empty combination.", feedback: "Correct. Every node is a combination under the limit, so every node is part of the answer.", misconception: null },
    { id: "number", label: "One node per number in nums.", feedback: "One number can be in many combinations. A node must remember the whole combination chosen so far.", misconception: "number-as-state" },
    { id: "sum", label: "One node per possible sum, so combinations with the same sum share a node.", feedback: "Different combinations can have the same sum, like `[1, 4]` and `[5]`. Each is its own answer, so each needs its own node.", misconception: "merge-by-sum" },
    { id: "full", label: "Only combinations that cannot take another number.", feedback: "Combinations along the way count too. `[]` and `[2]` are answers even when longer combinations extend them.", misconception: "leaves-only" }
  ]
};
const edgeQuestion = {
  prompt: "When does a combination have an edge to a longer combination?",
  correct: "later-number",
  choices: [
    { id: "later-number", label: "Add one number that comes later in nums than every number already chosen, if the new sum is still at most limit.", feedback: "Correct. Only adding later numbers builds each combination exactly once.", misconception: null },
    { id: "any-unused", label: "Add any number not already in the combination, if the new sum is at most limit.", feedback: "Adding an earlier number builds both `[4, 1]` and `[1, 4]`, the same combination twice. Only add numbers that come later.", misconception: "reuse-earlier" },
    { id: "same-again", label: "Add any number, even one already chosen, if the new sum is at most limit.", feedback: "Each number can be used at most once. Adding 1 after 1 builds `[1, 1]`, which reuses a number.", misconception: "reuse-same" },
    { id: "strict", label: "Add one later number if the new sum is below limit.", feedback: "A sum exactly at the limit still counts. Only going over is left out.", misconception: "bust-at-limit" }
  ]
};

// Picture check: the exact tree, a missing combination, a missing edge, and a reordered duplicate.
const pictureInput = [[1, 3, 5], 4];
const exactPicture = canvas(...pictureInput);
const pictureChoices = [
  { id: "exact", label: "Picture A", feedback: "Correct. Every combination under the limit and every one-number extension appears exactly once.", misconception: null, model: exactPicture },
  { id: "missing-node", label: "Picture D", feedback: "Combination `[3]` is missing. It is its own combination, even though `[1, 3]` also uses 3.", misconception: "omit-combination",
    model: { ...exactPicture, nodes: exactPicture.nodes.filter(node => node.id !== "3"), edges: exactPicture.edges.filter(edge => edge.to !== "3") } },
  { id: "missing-edge", label: "Picture B", feedback: "The direct extension 1→1,3 is missing.", misconception: "omit-direct-edge",
    model: { ...exactPicture, edges: exactPicture.edges.filter(edge => edge.to !== "1,3") } },
  { id: "reordered", label: "Picture C", feedback: "3,1 is the same combination as 1,3. Only add numbers that come later in nums, so each combination appears once.", misconception: "reuse-earlier",
    model: { ...exactPicture, nodes: [...exactPicture.nodes, { id: "3,1", label: "3,1" }], edges: [...exactPicture.edges, { from: "3", to: "3,1" }] } }
];
if (exactPicture.nodes.map(node => node.id).join() !== "start,1,1,3,3") throw Error("picture input drifted");

const outputQuestion = {
  id: "which-combinations", nums: [1, 2, 6], limit: 3,
  prompt: "For nums `[1, 2, 6]` with limit `3`, which combinations are returned?",
  correct: "four",
  choices: [
    { id: "four", feedback: "Correct. 1+2 = 3 lands exactly on the limit, and the empty combination has sum 0. 6 is over.", misconception: null },
    { id: "no-empty", feedback: "The empty combination has sum 0, which is at most 3, so it counts too.", misconception: "skip-empty" },
    { id: "strict", feedback: "1+2 = 3 is exactly the limit, which still counts. Only going over is left out.", misconception: "bust-at-limit" },
    { id: "reordered", feedback: "`[2, 1]` is the same combination as `[1, 2]`. Only add later numbers so each combination appears once.", misconception: "reuse-earlier" }
  ]
};
outputQuestion.choices.forEach(choice => { choice.label = listLabel(choice.misconception ? combos(outputQuestion.nums, outputQuestion.limit, choice.misconception) : combos(outputQuestion.nums, outputQuestion.limit)); });
checkChoices(outputQuestion.nums, outputQuestion.limit, outputQuestion.choices, outputQuestion.correct, listLabel);

const countQuestion = {
  id: "how-many", nums: [5, 1, 3], limit: 4,
  prompt: "For nums `[5, 1, 3]` with limit `4`, how many combinations are returned?",
  correct: "four",
  choices: [
    { id: "four", label: "`4`", feedback: "Correct. `[]`, `[1]`, `[1, 3]`, and `[3]` fit. 5 is over the limit.", misconception: null },
    { id: "one", label: "`1`", feedback: "This stops at 5, the first number that goes over. nums is not sorted, so 1 and 3 still fit.", misconception: "stop-at-first-bust" },
    { id: "three", label: "`3`", feedback: "This leaves out the empty combination. Its sum is 0, so it always counts.", misconception: "skip-empty" },
    { id: "two", label: "`2`", feedback: "This counts only combinations that cannot take another number, missing `[]` and `[1]`.", misconception: "leaves-only" }
  ]
};
checkChoices(countQuestion.nums, countQuestion.limit, countQuestion.choices, countQuestion.correct, list => `\`${count(list)}\``);

const lesson = {
  id: ID,
  facets: ["exact input numbers", "combination state identity", "later-number extensions", "every combination counts"],
  buildTasks: [
    build("all-combos", "Keep a sum that lands on the limit", "every combination counts", [1, 2, 4], 5, "bust-at-limit",
      "1+4 = 5 lands exactly on the limit, which still counts. 2+4 = 6 and 1+2+4 = 7 go over.", "This leaves out sums equal to 5. A sum exactly at the limit still counts; only going over is left out."),
    build("empty-counts", "Count the empty combination", "exact input numbers", [3, 6], 4, "skip-empty",
      "The empty combination has sum 0, which is at most 4. 6 is over the limit.", "This leaves out the empty combination. Its sum is 0, so it always counts."),
    build("not-just-leaves", "Keep the combinations along the way", "combination state identity", [2, 3, 4], 5, "leaves-only",
      "Every node is an answer, not just the ones at the bottom. `[]`, `[2]`, `[2, 3]`, `[3]`, and `[4]` all fit.", "This records a combination only when no more numbers fit, so it loses `[]` and `[2]`."),
    build("unsorted-bust", "Keep trying after a number goes over", "later-number extensions", [6, 1, 2], 4, "stop-at-first-bust",
      "6 is over 4, but 1 and 2 come after it and still fit.", "This stops trying numbers as soon as one goes over. nums is not sorted, so 1 and 2 are never tried.")
  ],
  conceptTasks: [
    {
      id: "concept-picture", title: "Match every input detail", facet: "exact input numbers", kind: "visual-options",
      prompt: "Which picture exactly matches this raw input?", input: inputText(...pictureInput),
      choices: pictureChoices, correct: "exact", why: "Every combination under the limit and every one-number extension appears exactly once.",
      remedial: remedial("repair-1", "Match every input detail", [2, 7], 5, "Which combination list is returned?", "skip-empty",
        "The empty combination has sum 0, so it counts. 7 is over 5.", "This leaves out the empty combination. Its sum is 0, so it always counts.")
    },
    {
      id: "concept-nodes", title: "Protect entity identity", facet: "combination state identity", kind: "choice",
      prompt: nodeQuestion.prompt, input: inputText([2, 4], 6), shownModel: canvas([2, 4], 6),
      choices: nodeQuestion.choices, correct: nodeQuestion.correct, why: nodeQuestion.choices[0].feedback,
      remedial: remedial("repair-2", "Protect entity identity", [1, 4, 5], 5, "How many combinations are returned?", "merge-by-sum",
        "`[]`, `[1]`, `[1, 4]`, `[4]`, and `[5]` are five different combinations, even though `[1, 4]` and `[5]` have the same sum.", "This merges `[1, 4]` and `[5]` because both sum to 5.", count)
    },
    {
      id: "concept-relations", title: "Protect direct relations", facet: "later-number extensions", kind: "choice",
      prompt: edgeQuestion.prompt, input: inputText([4, 1, 2], 6), shownModel: canvas([4], 6),
      choices: edgeQuestion.choices, correct: edgeQuestion.correct, why: edgeQuestion.choices[0].feedback,
      remedial: remedial("repair-3", "Protect direct relations", [3, 1, 2], 5, "How many combinations are returned?", "reuse-earlier",
        "Each combination appears once: `[]`, `[3]`, `[3, 1]`, `[3, 2]`, `[1]`, `[1, 2]`, and `[2]`.", "This also adds earlier numbers, so it counts `[1, 3]`, `[2, 3]`, and `[2, 1]` again in a different order.", count)
    },
    {
      id: "concept-output", title: "Predict from a fresh input", facet: "every combination counts", kind: "choice",
      prompt: outputQuestion.prompt, input: inputText(outputQuestion.nums, outputQuestion.limit),
      choices: outputQuestion.choices, correct: outputQuestion.correct, why: outputQuestion.choices[0].feedback,
      remedial: remedial("repair-4", "Predict from a fresh input", [2, 4], 6, "Which combination list is returned?", "bust-at-limit",
        "2+4 = 6 lands exactly on the limit, which still counts.", "This leaves out sums equal to 6. Only going over the limit is left out.")
    },
    {
      id: "concept-bug", title: "Catch a near-miss implementation", facet: "every combination counts", kind: "choice",
      prompt: countQuestion.prompt, input: inputText(countQuestion.nums, countQuestion.limit),
      choices: countQuestion.choices, correct: countQuestion.correct, why: countQuestion.choices[0].feedback,
      remedial: remedial("repair-5", "Catch a near-miss implementation", [2, 3], 6, "How many combinations are returned?", "reuse-same",
        "`[]`, `[2]`, `[2, 3]`, and `[3]` fit. Each number is used at most once.", "This lets a number be chosen again, adding `[2, 2]`, `[2, 2, 2]`, and `[3, 3]`.", count)
    }
  ],
  structureTasks: [[[1, 2], 3], [[4, 1], 4], [[2, 5, 1], 3], [[3, 4], 10], [[9, 1], 5]]
    .map(([nums, limit], index) => ({ id: `transfer-${index + 1}`, input: inputText(nums, limit), canvas: canvas(nums, limit) })),
  practicePlan: { version: "short-v1", step1: ["all-combos", "concept-nodes", "not-just-leaves", "concept-relations", "concept-bug"], step3: [0, 1, 4] }
};

const visualSpec = {
  id: ID,
  visualKind: "backtracking",
  pictureQuestions: [outputQuestion, countQuestion].map(({ id, nums, limit, prompt, correct, choices }) => ({ id, input: `nums = ${JSON.stringify(nums)}, limit = ${limit}`, prompt, correct, choices })),
  nodeQuestion, edgeQuestion,
  nodeLabelFormat: {
    instruction: "Use `start` for the empty combination. After that, list the chosen numbers in the order they appear in nums, separated by commas. Example: `2,3`.",
    pattern: "^(?:start|[1-9]\\d*(?:,[1-9]\\d*)*)$",
    showExactLabels: false
  },
  membershipClaim: { misconception: "leaves-only", no: "only combinations that cannot take another number should become nodes.", yes: "Every combination under the limit should have its own node." },
  practicePlan: lesson.practicePlan
};

const step2Spec = {
  id: ID,
  vocabulary: { nodeNames: "combinations", startNode: "empty combination", edges: "one-number extensions", correctSearch: "combinations reached", mistakenSearch: "combinations the flawed search reaches" },
  rounds: [
    { bugs: ["shallow-search"], level: "One number at most", presentation: "exact-difference", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["last-branch"], level: "Last number only", presentation: "predict-first", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["wrong-start"], level: "Starts mid-combination", presentation: "repair-case", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start", mistakenStartLabel: "2" }
  ],
  nodeLabels: { rule: "weight-prefix", description: "Use start for the empty combination, then comma-separated numbers like 2 or 2,3." },
  fixedStart: "start",
  input: {
    name: "empty combination", prompt: "Choose the empty combination", result: "generated-terminal-strings", resultLabel: "all combinations with sum at most limit",
    fields: [
      { id: "nums", kind: "json", label: "list of different positive numbers", prompt: "Enter nums as a list of different positive numbers", required: true },
      { id: "limit", kind: "integer", label: "limit", prompt: "Choose the limit", required: true, min: 1, max: 300 }
    ]
  }
};

// ---------- Step 4: three single-bug programs, outputs taken from running them ----------
function step4Case(caseId, bugTitle, misconception, nums, limit, code, correctDiagnosis, diagnoses, graphProof) {
  const buggy = new Function(`${code}\nreturn solve;`)()({ nums, limit });
  const correct = combos(nums, limit);
  if (sameList(buggy, correct)) throw Error(`${caseId}: input does not expose the bug`);
  if (!sameList(buggy, combos(nums, limit, misconception))) throw Error(`${caseId}: program and named mistake disagree`);
  return { id: ID, caseId, bugTitle, misconception, input: { nums, limit }, code, canvas: canvas(nums, limit), outputFormat: "list of every combination with sum at most limit",
    buggyOutput: out(buggy), correctOutput: out(correct), correctDiagnosis, diagnoses, graphProof };
}
const step4Loop = (first, check, extra = "") => `function solve(input) {
  const combos = [];
  function build(start, combo, sum) {
    combos.push(combo);
    for (let i = ${first}; i < input.nums.length; i++) {${extra}
      ${check}
      build(i + 1, [...combo, input.nums[i]], sum + input.nums[i]);
    }
  }
  build(0, [], 0);
  return combos;
}`;
const step4Spec = {
  id: ID,
  cases: [
    step4Case("authored-deep-case", "Records Only Combinations That Cannot Grow", "leaves-only", [1, 3], 5, `function solve(input) {
  const combos = [];
  function build(start, combo, sum) {
    let grew = false;
    for (let i = start; i < input.nums.length; i++) {
      if (sum + input.nums[i] > input.limit) continue;
      grew = true;
      build(i + 1, [...combo, input.nums[i]], sum + input.nums[i]);
    }
    if (!grew) combos.push(combo);
  }
  build(0, [], 0);
  return combos;
}`, "records-leaves", [
      { id: "records-leaves", label: "Claim about the code: it saves a combination only when no later number fits, so [] and [1] are never saved.", feedback: "Correct. Every combination under the limit is an answer, so save it before trying longer ones." },
      { id: "reuses-numbers", label: "Claim about the code: it can choose the same number twice.", feedback: "The next call starts at i + 1, so each number is used at most once." },
      { id: "equal-busts", label: "Claim about the code: it leaves out a sum equal to the limit.", feedback: "It skips only sums over the limit, so a sum equal to the limit is kept." }
    ], {
      realGraph: "The tree is start→1→1,3 and start→3. Every node is a combination under the limit.",
      codeRule: "A combination is saved only if no later number can be added to it.",
      separatingFeature: "start and 1 each have a child, so they are never saved.",
      outputConsequence: "The code returns [[1,3],[3]] instead of [[],[1],[1,3],[3]].",
      changedGraph: "Only nodes with no child are counted."
    }),
    step4Case("case-2", "Starts Every Loop at the Beginning", "reuse-earlier", [2, 1], 4, step4Loop("0", "if (sum + input.nums[i] > input.limit) continue;", "\n      if (combo.includes(input.nums[i])) continue;"), "restarts-at-zero", [
      { id: "restarts-at-zero", label: "Claim about the code: the loop starts at 0, so after choosing 1 it can add the earlier 2 and build [1,2] as well as [2,1].", feedback: "Correct. Start the loop at start so only later numbers are added and each combination appears once." },
      { id: "missing-empty", label: "Claim about the code: it never saves the empty combination.", feedback: "The first call saves [] before its loop." },
      { id: "equal-busts", label: "Claim about the code: it leaves out a sum equal to the limit.", feedback: "It skips only sums over the limit." }
    ], {
      realGraph: "The tree is start→2→2,1 and start→1. Each combination appears once.",
      codeRule: "Any number not already in the combination can be added, even an earlier one.",
      separatingFeature: "After choosing 1, the earlier number 2 is added again in the other order.",
      outputConsequence: "The code returns [[],[2],[2,1],[1],[1,2]], listing one combination twice.",
      changedGraph: "An extra edge 1→1,2 duplicates the combination 2,1."
    }),
    step4Case("case-3", "Leaves Out Sums Equal to the Limit", "bust-at-limit", [2, 4], 6, step4Loop("start", "if (sum + input.nums[i] >= input.limit) continue;"), "equal-busts", [
      { id: "equal-busts", label: "Claim about the code: >= skips 2,4 even though its sum 6 equals the limit, which still counts.", feedback: "Correct. Only a sum over the limit is left out, so [2,4] must be returned." },
      { id: "restarts-at-zero", label: "Claim about the code: it can add an earlier number and list a combination twice.", feedback: "The loop starts at start, so only later numbers are added." },
      { id: "records-leaves", label: "Claim about the code: it saves only combinations that cannot grow.", feedback: "It saves every combination at the top of build." }
    ], {
      realGraph: "The tree is start→2→2,4 and start→4. 2+4 = 6 equals the limit.",
      codeRule: "A number is skipped when the new sum is at least the limit.",
      separatingFeature: "2+4 lands exactly on the limit 6.",
      outputConsequence: "The code returns [[],[2],[4]] instead of [[],[2],[2,4],[4]].",
      changedGraph: "The edge into 2,4 is removed."
    })
  ]
};

// ---------- Source problem ----------
const solution = `// CONTRACT for collectCombos(nums, limit, startIndex, comboSoFar, sumSoFar, combos):
//     when this call returns, \`comboSoFar\` and every longer combination
//     that adds only numbers from index \`startIndex\` onward and keeps its
//     sum at most \`limit\` have been appended to \`combos\`.
const collectCombos = (nums, limit, startIndex, comboSoFar, sumSoFar, combos) => {
    // Process node: every combination we reach is under the limit, so it
    // is an answer — including the empty combination at the root.
    combos.push(comboSoFar);

    // Traverse neighbors: add one later number at a time. There is no
    // separate base case: when no later number fits, the loop adds nothing.
    for (let i = startIndex; i < nums.length; i++) {
        const newSum = sumSoFar + nums[i];
        if (newSum > limit) continue;

        // The recursive leap of faith, one level down: this call has the
        // SAME contract — when it returns, the combination with nums[i]
        // added and all of its longer combinations are in \`combos\`.
        // Trust it, do not trace it. Only adding later numbers means each
        // combination is built exactly once.
        collectCombos(nums, limit, i + 1, [...comboSoFar, nums[i]], newSum, combos);
    }
};

const combosUnderLimit = (nums, limit) => {
    const combos = [];

    // The recursive leap of faith: trust the contract. Starting from the
    // empty combination at index 0 collects every combination that fits.
    collectCombos(nums, limit, 0, [], 0, combos);

    return combos;
};`;
const examples = [
  { nums: [2, 3, 5], limit: 6, explanation: "Each single number is at most 6, and so is 2+3 = 5. The empty combination has sum 0, so it counts too. 2+5 = 7, 3+5 = 8, and 2+3+5 = 10 go over." },
  { nums: [4, 1], limit: 5, explanation: "4+1 = 5 lands exactly on the limit, which still counts." },
  { nums: [7], limit: 3, explanation: "7 is over the limit, so only the empty combination is left." }
];
const sourceProblem = {
  id: ID,
  title: "Under the Limit",
  category: "variant",
  parentId: "letter-combinations-of-a-phone-number",
  parentTitle: "Letter Combinations of a Phone Number",
  harderVersion: "the-balance-lock",
  difficulty: "Easy",
  twist: "A warm-up that is only about recursion: instead of letters from fixed dials, choose any group of the given numbers, keeping the sum at most a limit.",
  statement: "You are given a list `nums` of different positive whole numbers and a number `limit`.\n\nA **combination** is any group of numbers from `nums`, each used at most once. The empty combination `[]` counts too.\n\nReturn **all** combinations whose sum is **at most** `limit`. You may return the combinations in any order, and the numbers inside each combination in any order.",
  examples: examples.map(({ nums, limit, explanation }) => ({ input: `nums = ${JSON.stringify(nums)}, limit = ${limit}`, output: out(combos(nums, limit)), explanation })),
  constraints: ["1 <= nums.length <= 6", "nums contains different whole numbers from 1 to 50", "1 <= limit <= 300"],
  functionName: "combosUnderLimit",
  solution,
  tests: examples.map(({ nums, limit }) => ({ args: [nums, limit], expected: combos(nums, limit), unordered: true }))
};
{ // The reference JavaScript must agree with the solver, and the examples must say what we think.
  const reference = new Function(`${solution}\nreturn combosUnderLimit;`)();
  for (const test of sourceProblem.tests) if (!sameList(reference(...test.args), test.expected)) throw Error("reference solution disagrees");
  if (sourceProblem.examples.map(example => example.output).join(" ") !== "[[],[2],[2,3],[3],[5]] [[],[4],[4,1],[1]] [[]]") throw Error("statement examples drifted");
}

// ---------- Write every file ----------
files.writeSource("variants-final-6.json", sourceProblem);
files.upsert("visual-specs-variant.json", visualSpec);
files.upsert("visual-lessons-variant.json", lesson);
files.upsert("step2-specs-variant.json", step2Spec);
files.upsert("step4-specs-variant.json", step4Spec);
files.publish(sourceProblem, ["nums", "limit"]);
files.placeInOrder(ID, "Warm-up that is only about recursion: list every combination whose sum stays at most a limit.", { before: "runes-on-the-castle-door" });
{ // Step 5 oracle fixtures: the source examples plus seeded varied inputs.
  let seed = 20260924;
  const random = n => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) % n;
  const fixtures = sourceProblem.tests.map(test => ({ input: { nums: test.args[0], limit: test.args[1] }, expected: test.expected }));
  while (fixtures.length < 42) {
    const nums = [];
    for (let size = 1 + random(5); nums.length < size;) { const number = 1 + random(15); if (!nums.includes(number)) nums.push(number); }
    const limit = 3 + random(25);
    fixtures.push({ input: { nums, limit }, expected: combos(nums, limit) });
  }
  files.setFixtures(ID, fixtures);
}
console.log(`Authored ${ID}: ${lesson.buildTasks.length} builds, ${lesson.conceptTasks.length} checks, ${lesson.structureTasks.length} structure graphs.`);
