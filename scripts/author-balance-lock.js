/* Authors "The Balance Lock", a follow-up to Runes on the Castle Door.
 * Every drawn graph, correct answer, and wrong answer below is computed by
 * running the reference solver or the named mistaken solver, never typed by hand.
 * Re-running replaces this problem's entries in place:
 *   node scripts/author-balance-lock.js
 * then run step5-build.js, step6-build.js, and build-visual-data.js.
 */
const fs = require("fs");
const path = require("path");

const ID = "the-balance-lock";
const root = path.resolve(__dirname, "..");

// ---------- Reference solver and single-mistake solvers ----------
function safeCodes(dials, limit, mistake = null) {
  const codes = [];
  const visit = (index, code, total) => {
    if (index === dials.length) { codes.push(code); return; }
    if (mistake === "finish-one-dial-early" && index === dials.length - 1) { codes.push(code); return; }
    if (mistake === "stop-when-total-hits-limit" && index > 0 && total === limit) { codes.push(code); return; }
    for (const weight of dials[index]) {
      const next = total + weight;
      if (mistake === "bust-at-limit" ? next >= limit
        : mistake === "check-weight-not-total" ? weight > limit
        : mistake === "check-total-before-adding" ? total > limit
        : mistake === "skip-check-on-first-dial" ? index > 0 && next > limit
        : mistake === "skip-final-bust-check" ? index < dials.length - 1 && next > limit
        : mistake === "no-repeat-weights" ? next > limit || code.includes(weight)
        : next > limit) {
        if (mistake === "stop-dial-at-first-bust") break;
        continue;
      }
      visit(index + 1, [...code, weight], next);
    }
  };
  visit(0, [], 0);
  if (mistake === "merge-by-total") return codes.filter((code, index) => codes.findIndex(other => sum(other) === sum(code)) === index);
  return codes;
}
const sum = code => code.reduce((total, weight) => total + weight, 0);

const label = code => code.length ? code.join(",") : "start";
function canvas(dials, limit) {
  const nodes = [{ id: "start", label: "start" }], edges = [];
  const visit = (index, code, total) => {
    if (index === dials.length) return;
    for (const weight of dials[index]) {
      if (total + weight > limit) continue;
      const next = [...code, weight];
      nodes.push({ id: label(next), label: label(next) });
      edges.push({ from: label(code), to: label(next) });
      visit(index + 1, next, total + weight);
    }
  };
  visit(0, [], 0);
  if (nodes.length > 9) throw Error(`${JSON.stringify(dials)}: ${nodes.length} nodes exceeds the Step 1 cap`);
  return { directed: true, nodes, edges };
}
const inputText = (dials, limit) => `dials=${JSON.stringify(dials)}, limit=${limit}`;
const out = value => JSON.stringify(value);
const sameList = (a, b) => JSON.stringify(a.map(x => JSON.stringify(x)).sort()) === JSON.stringify(b.map(x => JSON.stringify(x)).sort());

// A two-choice decision whose wrong answer is what the named mistake really returns.
function decision(dials, limit, prompt, mistake, correctFeedback, bugFeedback, format = out) {
  const correct = safeCodes(dials, limit), buggy = safeCodes(dials, limit, mistake);
  if (sameList(correct, buggy)) throw Error(`${mistake} does not change ${inputText(dials, limit)}`);
  return {
    prompt,
    choices: [
      { id: "correct", label: format(correct), feedback: `Correct. ${correctFeedback}`, misconception: null },
      { id: "bug", label: format(buggy), feedback: bugFeedback, misconception: mistake }
    ],
    correct: "correct"
  };
}
const count = codes => String(codes.length);

// ---------- Step 1 lesson ----------
function build(id, title, facet, dials, limit, mistake, correctFeedback, bugFeedback) {
  return {
    id, title, facet,
    prompt: "Use the raw input to complete the challenge. Then choose the result.",
    input: inputText(dials, limit),
    canvas: canvas(dials, limit),
    decision: decision(dials, limit, "Which complete code list is returned?", mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
function remedial(id, title, dials, limit, prompt, mistake, correctFeedback, bugFeedback, format) {
  return {
    id, title: `Fresh proof · ${title}`,
    prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
    input: inputText(dials, limit),
    canvas: canvas(dials, limit),
    decision: decision(dials, limit, prompt, mistake, correctFeedback, bugFeedback, format),
    why: correctFeedback
  };
}
function checkChoices(dials, limit, choices, correctId, measure) {
  const truth = measure(safeCodes(dials, limit));
  for (const choice of choices) {
    const value = choice.mistake ? measure(safeCodes(dials, limit, choice.mistake)) : choice.value;
    if (choice.id === correctId && value !== truth) throw Error(`${choice.id}: correct choice disagrees with the solver`);
    if (choice.id !== correctId && value === truth) throw Error(`${choice.id}: wrong choice equals the correct answer`);
  }
}

const nodeQuestion = {
  prompt: "What is a node in the code-building decision tree?",
  correct: "partial-code",
  choices: [
    { id: "partial-code", label: "A safe partial code: the weights chosen on the first few dials, with total at most limit. The root is the empty code.", feedback: "Correct. Each level records one more dial choice, and the total comes from the weights on the path.", misconception: null },
    { id: "running-total", label: "One node per running total, so codes with the same total share a node.", feedback: "Different codes can reach the same total, like `3,4` and `4,3` when both dials offer 3 and 4. Each is its own answer, so each prefix needs its own node.", misconception: "merge-by-total" },
    { id: "full-code", label: "Only a completed code using every dial.", feedback: "Completed codes are leaves. Partial-code nodes are needed to show the choices leading to them.", misconception: "leaves-only" },
    { id: "weight", label: "One node per weight value, no matter which dial offered it.", feedback: "The same weight on different dials, or after different prefixes, is a different state. A node must remember the whole prefix.", misconception: "forget-prefix" }
  ]
};
const edgeQuestion = {
  prompt: "When does a partial code have an edge to a longer code?",
  correct: "safe-next-weight",
  choices: [
    { id: "safe-next-weight", label: "Choose one weight from the next dial whose new running total is still at most limit.", feedback: "Correct. The edge appends one next-dial weight that does not bust.", misconception: null },
    { id: "weight-only", label: "Choose any weight from the next dial that is at most limit by itself.", feedback: "The lock adds up every dial. A small weight can still push the running total over limit.", misconception: "check-weight-not-total" },
    { id: "strict", label: "Choose one weight from the next dial whose new running total is below limit.", feedback: "Landing exactly on limit is safe, like 21 in blackjack. Only going over busts.", misconception: "bust-at-limit" },
    { id: "skip-dial", label: "If every weight busts, skip to the following dial without adding a weight.", feedback: "A full code needs one weight from every dial. A prefix whose every choice busts has no child.", misconception: "skip-blocked-dial" }
  ]
};

// Picture check: the exact tree, a missing dead end, a missing edge, and a drawn bust.
const pictureInput = [[[1, 6], [2, 5]], 7];
const exactPicture = canvas(...pictureInput);
if (!exactPicture.nodes.some(node => node.id === "6")) throw Error("picture input needs dead end 6");
const pictureChoices = [
  { id: "exact", label: "Picture A", feedback: "Correct. Every safe prefix, including dead end 6, and every one-weight extension appears exactly once.", misconception: null, model: exactPicture },
  { id: "missing-node", label: "Picture D", feedback: "Prefix 6 is missing. Its total 6 is safe, so it is a node even though every next weight busts.", misconception: "omit-dead-end-prefix",
    model: { ...exactPicture, nodes: exactPicture.nodes.filter(node => node.id !== "6"), edges: exactPicture.edges.filter(edge => edge.to !== "6") } },
  { id: "missing-edge", label: "Picture B", feedback: "The direct extension 1→1,5 is missing.", misconception: "omit-direct-edge",
    model: { ...exactPicture, edges: exactPicture.edges.filter(edge => edge.to !== "1,5") } },
  { id: "busted-node", label: "Picture C", feedback: "6,2 totals 8, which is over limit 7. A busted prefix is pruned, so it gets no node.", misconception: "draw-busted-prefix",
    model: { ...exactPicture, nodes: [...exactPicture.nodes, { id: "6,2", label: "6,2" }], edges: [...exactPicture.edges, { from: "6", to: "6,2" }] } }
];

const outputQuestion = {
  id: "one-safe-code", dials: [[5, 1], [4, 7], [3]], limit: 9,
  prompt: "For dials `[5, 1]`, `[4, 7]`, `[3]` with limit `9`, which complete code list is safe?",
  correct: "one",
  choices: [
    { id: "one", label: "Only code `[1, 4, 3]`", feedback: "Correct. 1+4+3 = 8 is the only total that stays at most 9.", misconception: null, value: out([[1, 4, 3]]) },
    { id: "all-four", label: "All four codes", feedback: "Every single weight is at most 9, but the lock adds them. Only 1+4+3 = 8 stays at most 9.", misconception: "check-weight-not-total", mistake: "check-weight-not-total" },
    { id: "partial", label: "Codes `[1, 4, 3]` and `[5, 4]`", feedback: "5+4 = 9 lands on the limit after two dials, but the code is not finished. The last dial adds 3, and 12 busts.", misconception: "stop-when-total-hits-limit", mistake: "stop-when-total-hits-limit" },
    { id: "three", label: "Codes `[1, 4, 3]`, `[1, 7, 3]`, and `[5, 4, 3]`", feedback: "These keep every code whose first two dials are safe. The last dial still adds 3: 1+7+3 = 11 and 5+4+3 = 12 both bust.", misconception: "skip-final-bust-check", mistake: "skip-final-bust-check" }
  ]
};
checkChoices(outputQuestion.dials, outputQuestion.limit, outputQuestion.choices, outputQuestion.correct, out);
// Each list label must name exactly the codes its mistake returns.
const codeText = code => `\`[${code.join(", ")}]\``;
const listLabel = codes => {
  if (codes.length === 1) return `Only code ${codeText(codes[0])}`;
  if (codes.length === 4) return "All four codes";
  const parts = codes.map(codeText).sort();
  return `Codes ${parts.length === 2 ? parts.join(" and ") : `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`}`;
};
for (const choice of outputQuestion.choices) {
  const codes = choice.mistake ? safeCodes(outputQuestion.dials, outputQuestion.limit, choice.mistake) : JSON.parse(choice.value);
  if (listLabel(codes) !== choice.label) throw Error(`${choice.id}: label ${choice.label} does not match ${listLabel(codes)}`);
}

const countQuestion = {
  id: "no-safe-code", dials: [[4, 2], [5], [6, 9, 8]], limit: 12,
  prompt: "For dials `[4, 2]`, `[5]`, `[6, 9, 8]` with limit `12`, how many complete codes are safe?",
  correct: "zero",
  choices: [
    { id: "zero", label: "`0`", feedback: "Correct. The smallest possible total is 2+5+6 = 13, which is over 12.", misconception: null, value: "0" },
    { id: "six", label: "`6`", feedback: "Every single weight is at most 12, but the lock adds them. Every full total is at least 13, so every code busts.", misconception: "check-weight-not-total", mistake: "check-weight-not-total" },
    { id: "two", label: "`2`", feedback: "This accepts 4,5 and 2,5 as complete before the last dial adds its weight.", misconception: "finish-one-dial-early", mistake: "finish-one-dial-early" },
    { id: "four", label: "`4`", feedback: "This counts the four safe partial codes `4`, `2`, `4,5`, and `2,5` instead of completed three-weight codes.", misconception: "count-partial-prefixes", value: "4" }
  ]
};
checkChoices(countQuestion.dials, countQuestion.limit, countQuestion.choices, countQuestion.correct, count);
for (const choice of countQuestion.choices) if (choice.mistake && `\`${count(safeCodes(countQuestion.dials, countQuestion.limit, choice.mistake))}\`` !== choice.label) throw Error(`${choice.id}: count label drifted`);

const strip = ({ value, mistake, ...choice }) => choice;
const lesson = {
  id: ID,
  facets: ["exact dial weights", "prefix state identity", "safe one-weight extensions", "all safe codes"],
  buildTasks: [
    build("two-dials", "Keep codes that land on the limit", "all safe codes", [[2, 5], [3, 6]], 8, "bust-at-limit",
      "2,6 and 5,3 total exactly 8, which is safe. Only 5,6 goes over.", "This busts when the total reaches 8. Landing exactly on the limit is safe; only going over busts."),
    build("early-bust", "Prune a bust before the last dial", "safe one-weight extensions", [[9, 3], [4], [1, 6]], 12, "check-weight-not-total",
      "9,4 already totals 13, so that branch stops. 3,4,6 totals 13 and busts too, leaving 3,4,1.", "This compares each weight with 12 by itself. Every weight passes, but the lock adds them, so 9,4 busts at 13."),
    build("all-bust", "Handle every code busting", "exact dial weights", [[7, 10], [8]], 14, "check-total-before-adding",
      "7+8 = 15 and 10+8 = 18 both go over 14.", "This checks the total before adding the new weight, so the last dial's weight is never checked."),
    build("one-dial", "Check the first dial too", "prefix state identity", [[5, 12, 3]], 5, "skip-check-on-first-dial",
      "A one-dial code is just its weight. 5 lands on the limit and is safe; 12 busts.", "This checks only when an earlier weight exists, so it never checks the first dial and keeps 12.")
  ],
  conceptTasks: [
    {
      id: "concept-picture", title: "Match every input detail", facet: "exact dial weights", kind: "visual-options",
      prompt: "Which picture exactly matches this raw input?", input: inputText(...pictureInput),
      choices: pictureChoices, correct: "exact", why: "Every safe prefix and every one-weight extension appears exactly once.",
      remedial: remedial("repair-1", "Match every input detail", [[4], [3, 9]], 10, "Which complete code list is returned?", "check-total-before-adding",
        "4+3 = 7 is safe; 4+9 = 13 busts.", "This checks the total before adding the new weight, so it never checks the last dial and keeps 4,9.")
    },
    {
      id: "concept-nodes", title: "Protect entity identity", facet: "prefix state identity", kind: "choice",
      prompt: nodeQuestion.prompt, input: inputText([[2, 8], [5]], 9), shownModel: canvas([[2, 8], [5]], 9),
      choices: nodeQuestion.choices, correct: nodeQuestion.correct, why: nodeQuestion.choices[0].feedback,
      remedial: remedial("repair-2", "Protect entity identity", [[3, 4], [4, 3]], 10, "How many complete codes are returned?", "merge-by-total",
        "`3,4`, `3,3`, `4,4`, and `4,3` are four different codes, even though `3,4` and `4,3` have the same total.", "This merges 3,4 and 4,3 because both total 7, losing a separate code.", count)
    },
    {
      id: "concept-relations", title: "Protect direct relations", facet: "safe one-weight extensions", kind: "choice",
      prompt: edgeQuestion.prompt, input: inputText([[6], [5, 2], [1]], 9), shownModel: canvas([[6]], 9),
      choices: edgeQuestion.choices, correct: edgeQuestion.correct, why: edgeQuestion.choices[0].feedback,
      remedial: remedial("repair-3", "Protect direct relations", [[3], [8, 4], [2]], 9, "Which complete codes are safe?", "bust-at-limit",
        "3+4+2 = 9 lands exactly on the limit, which is safe. 3+8 = 11 busts.", "This busts when the total reaches 9. Only going over the limit busts.")
    },
    {
      id: "concept-output", title: "Predict from a fresh input", facet: "all safe codes", kind: "choice",
      prompt: outputQuestion.prompt, input: inputText(outputQuestion.dials, outputQuestion.limit),
      choices: outputQuestion.choices.map(strip), correct: outputQuestion.correct, why: outputQuestion.choices[0].feedback,
      remedial: remedial("repair-4", "Predict from a fresh input", [[2, 9], [6]], 8, "Which complete codes are safe?", "bust-at-limit",
        "2+6 = 8 lands exactly on the limit, which is safe. 9 busts on the first dial.", "This busts when the total reaches 8. Only going over the limit busts.")
    },
    {
      id: "concept-bug", title: "Catch a near-miss implementation", facet: "all safe codes", kind: "choice",
      prompt: countQuestion.prompt, input: inputText(countQuestion.dials, countQuestion.limit),
      choices: countQuestion.choices.map(strip), correct: countQuestion.correct, why: countQuestion.choices[0].feedback,
      remedial: remedial("repair-5", "Catch a near-miss implementation", [[8, 3], [3]], 6, "Which complete code list is returned?", "no-repeat-weights",
        "Different dials may offer the same weight. 3+3 = 6 is safe; 8 busts.", "This refuses to reuse weight 3 on a later dial. The lock limits only the total, not repeated weights.")
    }
  ],
  structureTasks: [
    [[[5, 2], [4], [3]], 10], [[[1], [9, 3], [2]], 6], [[[7, 2, 4], [5]], 9], [[[3], [3], [3]], 9], [[[6, 1], [8]], 8]
  ].map(([dials, limit], index) => ({ id: `transfer-${index + 1}`, input: inputText(dials, limit), canvas: canvas(dials, limit) })),
  practicePlan: { version: "short-v1", step1: ["two-dials", "concept-nodes", "early-bust", "concept-relations", "concept-bug"], step3: [0, 1, 4] }
};

const visualSpec = {
  id: ID,
  visualKind: "backtracking",
  pictureQuestions: [outputQuestion, countQuestion].map(({ id, dials, limit, prompt, correct, choices }) => ({ id, input: `dials = ${JSON.stringify(dials)}, limit = ${limit}`, prompt, correct, choices: choices.map(strip) })),
  nodeQuestion, edgeQuestion,
  nodeLabelFormat: {
    instruction: "Use `start` for the empty root. After that, list the chosen weights in dial order, separated by commas. Example: `4,2`.",
    pattern: "^(?:start|[1-9]\\d*(?:,[1-9]\\d*)*)$",
    showExactLabels: false
  },
  membershipClaim: { misconception: "leaves-only", no: "only complete-code leaves should become nodes.", yes: "A safe unfinished code should have its own node." },
  practicePlan: lesson.practicePlan
};

const step2Spec = {
  id: ID,
  vocabulary: { nodeNames: "safe partial codes", startNode: "empty code", edges: "one-weight extensions", correctSearch: "safe code prefixes reached", mistakenSearch: "prefixes the flawed lock search reaches" },
  rounds: [
    { bugs: ["last-branch"], level: "Last weight only", presentation: "predict-first", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["shallow-search"], level: "Two-dial lock", presentation: "exact-difference", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["wrong-start"], level: "Code starts halfway", presentation: "repair-case", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start", mistakenStartLabel: "5" }
  ],
  nodeLabels: { rule: "weight-prefix", description: "Use start for the empty root, then comma-separated weights like 4 or 4,2." },
  fixedStart: "start",
  input: {
    name: "empty code", prompt: "Choose the empty code", result: "generated-terminal-strings", resultLabel: "all safe complete codes",
    fields: [
      { id: "dials", kind: "json", label: "dial weights as a list of weight lists", prompt: "Enter dial weights as a list of weight lists", required: true },
      { id: "limit", kind: "integer", label: "limit", prompt: "Choose the limit", required: true, min: 1, max: 300 }
    ]
  }
};

// ---------- Source problem (statement, examples, reference JavaScript) ----------
const solution = `// CONTRACT for collectCodes(dials, limit, dialIndex, codeSoFar, totalSoFar, safeCodes):
//     when this call returns, every safe full code that starts with
//     \`codeSoFar\` (whose weights add up to \`totalSoFar\`) and continues
//     with weights from dial \`dialIndex\` onward has been appended to
//     \`safeCodes\`.
const collectCodes = (dials, limit, dialIndex, codeSoFar, totalSoFar, safeCodes) => {
    // Base case
    if (dialIndex === dials.length) {
        safeCodes.push(codeSoFar);
        return;
    }

    // Traverse neighbors
    const weights = dials[dialIndex];

    for (const weight of weights) {
        // Like going over 21 in blackjack: a total over the limit busts.
        // Every weight is positive, so later dials can only add more.
        // Prune this branch now instead of finishing a doomed code.
        const newTotal = totalSoFar + weight;
        if (newTotal > limit) continue;

        // The recursive leap of faith, one level down: this call has
        // the SAME contract — when it returns, every safe code that
        // starts with \`codeSoFar\` plus \`weight\` has been appended to
        // \`safeCodes\`. Trust it, do not trace it. Trying every weight
        // that does not bust, each with its guaranteed completions,
        // covers every safe code that starts with \`codeSoFar\` —
        // exactly this function's contract, kept.
        collectCodes(dials, limit, dialIndex + 1, [...codeSoFar, weight], newTotal, safeCodes);
    }
};

const allSafeCodes = (dials, limit) => {
    const safeCodes = [];

    // The recursive leap of faith: trust the contract. When this
    // call returns, \`safeCodes\` holds every safe code built from dial
    // 0 onward, starting from total 0 — the complete answer.
    collectCodes(dials, limit, 0, [], 0, safeCodes);

    return safeCodes;
};`;

const examples = [
  { dials: [[4, 9], [2, 7], [5]], limit: 12, explanation: "4+2+5 = 11 is safe. 4,7 totals 11 after two dials, but the last dial adds 5 for 16, which busts. 9,2,5 also reaches 16. 9,7 totals 16 after two dials, so that branch busts early and the last dial is never tried." },
  { dials: [[3, 8], [6, 1]], limit: 9, explanation: "3+6 = 9 and 8+1 = 9 land exactly on the limit, which is still safe. 3+1 = 4 is safe too. Only 8+6 = 14 goes over and busts." }
];
const sourceProblem = {
  id: ID,
  title: "The Balance Lock",
  category: "variant",
  parentId: "letter-combinations-of-a-phone-number",
  parentTitle: "Letter Combinations of a Phone Number",
  followsUp: "runes-on-the-castle-door",
  difficulty: "Medium",
  twist: "Builds on Runes on the Castle Door: each dial now offers numbered weights, and instead of checking only the previous choice, every code must keep a running total at or under a limit.",
  statement: "Past the rune door, the castle treasury is sealed by a balance lock: a row of dials. Dial `i` can be turned to show any one of the weights in `dials[i]`, a list of different positive whole numbers.\n\nTo try a code, you set every dial to one weight and read them from left to right. The lock works like a hand of blackjack: the weights add up, and if the total goes **over** `limit`, the lock busts. A code whose total is **at most** `limit` is safe.\n\nReturn a list of **all** safe codes. Each code is a list of the chosen weights, in dial order. You may return the codes in any order. If no code is safe, return an empty list.",
  examples: examples.map(({ dials, limit, explanation }) => ({ input: `dials = ${JSON.stringify(dials)}, limit = ${limit}`, output: JSON.stringify(safeCodes(dials, limit)), explanation })),
  constraints: ["1 <= dials.length <= 6", "1 <= dials[i].length <= 4", "dials[i] contains different whole numbers from 1 to 50", "1 <= limit <= 300"],
  functionName: "allSafeCodes",
  solution,
  tests: examples.map(({ dials, limit }) => ({ args: [dials, limit], expected: safeCodes(dials, limit), unordered: true }))
};
{ // The reference JavaScript must agree with the solver on every example.
  const allSafe = new Function(`${solution}\nreturn allSafeCodes;`)();
  for (const test of sourceProblem.tests) if (!sameList(allSafe(...test.args), test.expected)) throw Error("reference solution disagrees");
}
if (out(safeCodes([[4, 9], [2, 7], [5]], 12)) !== "[[4,2,5]]" || out(safeCodes([[3, 8], [6, 1]], 9)) !== "[[3,6],[3,1],[8,1]]") throw Error("statement examples drifted");

// ---------- Step 4: three single-bug programs, outputs taken from running them ----------
const step4Program = check => `function solve(input) {
  const codes = [];
  function build(dialIndex, code, total) {
    if (dialIndex === input.dials.length) {
      codes.push(code);
      return;
    }
    for (const weight of input.dials[dialIndex]) {
      ${check}
      build(dialIndex + 1, [...code, weight], total + weight);
    }
  }
  build(0, [], 0);
  return codes;
}`;
function step4Case(caseId, bugTitle, misconception, dials, limit, check, correctDiagnosis, diagnoses, graphProof) {
  const code = step4Program(check);
  const buggy = new Function(`${code}\nreturn solve;`)()({ dials, limit });
  const correct = safeCodes(dials, limit);
  if (sameList(buggy, correct)) throw Error(`${caseId}: input does not expose the bug`);
  if (!sameList(buggy, safeCodes(dials, limit, misconception))) throw Error(`${caseId}: program and named mistake disagree`);
  return { id: ID, caseId, bugTitle, misconception, input: { dials, limit }, code, canvas: canvas(dials, limit), outputFormat: "list of every safe code",
    buggyOutput: out(buggy), correctOutput: out(correct), correctDiagnosis, diagnoses, graphProof };
}
const step4Spec = {
  id: ID,
  cases: [
    step4Case("authored-deep-case", "Busts When the Total Reaches the Limit", "bust-at-limit", [[5, 3], [7]], 10,
      "if (total + weight >= input.limit) continue;", "equal-busts", [
        { id: "equal-busts", label: "Claim about the code: >= prunes 3,7 even though its total 10 equals the limit, which is safe.", feedback: "Correct. Only a total over the limit busts, so 3,7 must be returned." },
        { id: "no-running-total", label: "Claim about the code: it compares each weight with the limit instead of the running total.", feedback: "It adds total + weight before comparing, so it does use the running total." },
        { id: "accepts-prefix", label: "Claim about the code: the base case accepts a code before every dial has a weight.", feedback: "It accepts only when dialIndex equals the number of dials." }
      ], {
        realGraph: "The safe prefixes are start→5 and start→3→3,7. Prefix 5 is a dead end because 5+7 = 12 goes over 10.",
        codeRule: "An extension is pruned when its new total is at least the limit.",
        separatingFeature: "3+7 lands exactly on the limit 10.",
        outputConsequence: "The only safe code is pruned, producing [] instead of [[3,7]].",
        changedGraph: "Edges into prefixes whose total equals the limit are removed."
      }),
    step4Case("case-2", "Checks Each Weight Instead of the Running Total", "check-weight-not-total", [[8, 2], [6]], 9,
      "if (weight > input.limit) continue;", "weight-only", [
        { id: "weight-only", label: "Claim about the code: it compares only the new weight with the limit, so 8,6 survives although its total is 14.", feedback: "Correct. The lock adds the weights; the running total must be compared with the limit." },
        { id: "first-weight-only", label: "Claim about the code: it tries only the first weight on each dial.", feedback: "The loop continues through every weight on the dial." },
        { id: "shared-code", label: "Claim about the code: every branch shares and changes one code array.", feedback: "Each call builds a fresh array with the new weight added, so branches never share one array." }
      ], {
        realGraph: "The safe prefixes are start→8 and start→2→2,6. 8+6 = 14 busts, so 8 is a dead end.",
        codeRule: "An extension is kept whenever its own weight is at most the limit.",
        separatingFeature: "8 and 6 are each at most 9, but together they total 14.",
        outputConsequence: "The busted code 8,6 is returned: [[8,6],[2,6]] instead of [[2,6]].",
        changedGraph: "A busted edge 8→8,6 is added."
      }),
    step4Case("case-3", "Stops a Dial at Its First Bust", "stop-dial-at-first-bust", [[9, 1], [4]], 7,
      "if (total + weight > input.limit) break;", "break-on-bust", [
        { id: "break-on-bust", label: "Claim about the code: break stops trying the dial's later weights after 9 busts, so 1 is never tried.", feedback: "Correct. Dials are not sorted, so a later weight can still be safe. Use continue to skip only the busting weight." },
        { id: "equal-busts", label: "Claim about the code: it treats a total equal to the limit as a bust.", feedback: "It uses >, so a total equal to the limit is kept." },
        { id: "missing-return", label: "Claim about the code: the base case forgets to return, so it keeps reading past the last dial.", feedback: "The base case pushes the code and returns." }
      ], {
        realGraph: "The safe prefixes are start→1→1,4. 9 busts immediately.",
        codeRule: "The first busting weight ends the loop over the whole dial.",
        separatingFeature: "The busting weight 9 is listed before the safe weight 1.",
        outputConsequence: "The loop stops at 9, producing [] instead of [[1,4]].",
        changedGraph: "At each prefix, weights listed after the first busting weight get no edge."
      })
  ]
};

// ---------- Write every file ----------
// Keep each file's existing style: some store non-ASCII text as \u escapes.
function upsert(file, entry) {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, "utf8");
  const list = JSON.parse(text);
  const index = list.findIndex(item => item.id === ID);
  if (index >= 0) list[index] = entry; else list.push(entry);
  let written = JSON.stringify(list, null, 2) + "\n";
  if (/\\u[0-9a-f]{4}/.test(text)) written = written.replace(/[\u007f-\uffff]/g, char => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
  fs.writeFileSync(full, written);
}
const sourceFile = "source/jonathan-study-site/data/variants-final-5.json";
fs.writeFileSync(path.join(root, sourceFile), JSON.stringify([sourceProblem], null, 2) + "\n");
upsert("visual-specs-variant.json", visualSpec);
upsert("visual-lessons-variant.json", lesson);
upsert("step2-specs-variant.json", step2Spec);
upsert("step4-specs-variant.json", step4Spec);

// The published source bank supplies reference solutions to the Step 4 checks.
{
  const bankFile = path.join(root, "source/jonathan-study-site/site/problems.js");
  const bankText = fs.readFileSync(bankFile, "utf8");
  const { parentId, parentTitle, followsUp, twist, ...shared } = sourceProblem;
  const published = { ...shared, runner: { kind: "function", parameterNames: ["dials", "limit"] } };
  const block = JSON.stringify(published, null, 2).split("\n").map(line => `  ${line}`).join("\n");
  const existing = new RegExp(`,\\n  \\{\\n    "id": "${ID}"[\\s\\S]*?\\n  \\}(?=\\n\\];\\n$)`);
  const withoutOld = bankText.replace(existing, "");
  if (!withoutOld.endsWith("\n  }\n];\n")) throw Error("Unexpected end of site/problems.js");
  fs.writeFileSync(bankFile, `${withoutOld.slice(0, -"\n];\n".length)},\n${block}\n];\n`);
}
const orderFile = path.join(root, "variant-order.json");
const orderText = fs.readFileSync(orderFile, "utf8");
if (!JSON.parse(orderText).groups.some(group => group.variants.some(item => item.id === ID))) {
  const runesLine = /\n(\s*)\{ "id": "runes-on-the-castle-door", "reason": "[^"]*" \}/;
  if (!runesLine.test(orderText)) throw Error("Cannot find the runes entry in variant-order.json");
  const reason = "Follow-up to the runes: carry a running total down each branch and prune a code once it busts.";
  fs.writeFileSync(orderFile, orderText.replace(runesLine, (line, indent) => `${line},\n${indent}{ "id": "${ID}", "reason": "${reason}" }`));
}
// Step 5 oracle fixtures: the source examples plus seeded varied inputs.
{
  let seed = 20260923;
  const random = n => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) % n;
  const fixtures = sourceProblem.tests.map(test => ({ input: { dials: test.args[0], limit: test.args[1] }, expected: test.expected }));
  while (fixtures.length < 42) {
    const dials = Array.from({ length: 1 + random(4) }, () => {
      const dial = [];
      for (let size = 1 + random(3); dial.length < size;) { const weight = 1 + random(20); if (!dial.includes(weight)) dial.push(weight); }
      return dial;
    });
    const limit = 5 + random(41);
    fixtures.push({ input: { dials, limit }, expected: safeCodes(dials, limit) });
  }
  const fixtureFile = path.join(root, "scripts/step5-oracle-fixtures.json");
  const text = fs.readFileSync(fixtureFile, "utf8"), all = JSON.parse(text);
  all[ID] = fixtures;
  fs.writeFileSync(fixtureFile, JSON.stringify(all) + (text.endsWith("\n") ? "\n" : ""));
}
module.exports = { safeCodes };
if (require.main === module) console.log(`Authored ${ID}: ${lesson.buildTasks.length} builds, ${lesson.conceptTasks.length} checks, ${lesson.structureTasks.length} structure graphs.`);
