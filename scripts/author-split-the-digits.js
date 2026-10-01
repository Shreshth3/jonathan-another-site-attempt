/* Authors "Split the Digits", the hardest step after The Balance Lock:
 * cut a digit string into pieces whose numbers stay at most a limit.
 * Every drawn graph, correct answer, and wrong answer below is computed by
 * running the reference solver or the named mistaken solver, never typed by hand.
 * Re-running replaces this problem's entries in place:
 *   node scripts/author-split-the-digits.js
 * then run step5-build.js, step6-build.js, and build-visual-data.js.
 */
const files = require("./author-variant-files");

const ID = "split-the-digits";

// ---------- Reference solver and single-mistake solvers ----------
// A node is the list of pieces cut so far; an edge cuts one more piece.
function splits(digits, limit, mistake = null) {
  const found = [];
  const visitedPositions = new Set();
  const visit = (index, pieces) => {
    if (mistake === "visited-position") {
      if (visitedPositions.has(index)) return;
      visitedPositions.add(index);
    }
    if (mistake === "record-every-node") found.push(pieces);
    else if (index === digits.length) { found.push(pieces); return; }
    let grew = false;
    const longest = mistake === "lengths-one-two" ? Math.min(2, digits.length - index) : digits.length - index;
    for (let length = 1; length <= longest; length++) {
      const piece = digits.slice(index, index + length);
      // Every longer piece from here starts with the same "0", so stopping is safe.
      if (mistake === "reject-zero" ? piece[0] === "0" : mistake !== "allow-leading-zero" && length > 1 && piece[0] === "0") break;
      if (mistake === "compare-as-text") { if (piece > String(limit)) continue; }
      // Adding a digit never makes the number smaller, so stopping at the first piece over limit is safe.
      else if (mistake === "strict-limit" ? Number(piece) >= limit : Number(piece) > limit) break;
      grew = true;
      visit(index + length, [...pieces, Number(piece)]);
    }
    if (mistake === "dead-end-as-answer" && !grew) found.push(pieces);
  };
  visit(0, []);
  return found;
}

const label = pieces => pieces.length ? pieces.join("|") : "start";
function canvas(digits, limit) {
  const nodes = [{ id: "start", label: "start" }], edges = [];
  const visit = (index, pieces) => {
    for (let length = 1; index + length <= digits.length; length++) {
      const piece = digits.slice(index, index + length);
      if (length > 1 && piece[0] === "0") break;
      if (Number(piece) > limit) break;
      const next = [...pieces, piece];
      nodes.push({ id: label(next), label: label(next) });
      edges.push({ from: label(pieces), to: label(next) });
      visit(index + length, next);
    }
  };
  visit(0, []);
  if (nodes.length > 9) throw Error(`${digits}: ${nodes.length} nodes exceeds the Step 1 cap`);
  // Nodes that used every digit are exactly the answers.
  if (nodes.filter(node => node.id !== "start" && node.id.split("|").join("") === digits).length !== splits(digits, limit).length) throw Error("canvas and solver disagree");
  return { directed: true, nodes, edges };
}
const inputText = (digits, limit) => `digits="${digits}", limit=${limit}`;
const out = value => JSON.stringify(value);
// The order of the ways does not matter; the order of pieces inside one way does.
const sameList = (a, b) => JSON.stringify(a.map(way => JSON.stringify(way)).sort()) === JSON.stringify(b.map(way => JSON.stringify(way)).sort());
const count = list => String(list.length);
const codeText = way => `\`[${way.join(", ")}]\``;
const listLabel = list => list.length === 0 ? "No ways: `[]`" : list.length === 1 ? codeText(list[0]) : list.length === 2 ? `${codeText(list[0])} and ${codeText(list[1])}` : `${list.slice(0, -1).map(codeText).join(", ")}, and ${codeText(list.at(-1))}`;

// A two-choice decision whose wrong answer is what the named mistake really returns.
function decision(digits, limit, prompt, mistake, correctFeedback, bugFeedback, format = out) {
  const correct = splits(digits, limit), buggy = splits(digits, limit, mistake);
  if (sameList(correct, buggy) || format(correct) === format(buggy)) throw Error(`${mistake} does not change ${inputText(digits, limit)}`);
  return {
    prompt,
    choices: [
      { id: "correct", label: format(correct), feedback: `Correct. ${correctFeedback}`, misconception: null },
      { id: "bug", label: format(buggy), feedback: bugFeedback, misconception: mistake }
    ],
    correct: "correct"
  };
}
function build(id, title, facet, digits, limit, mistake, correctFeedback, bugFeedback) {
  return {
    id, title, facet,
    prompt: "Use the raw input to complete the challenge. Then choose the result.",
    input: inputText(digits, limit),
    canvas: canvas(digits, limit),
    decision: decision(digits, limit, "Which list of ways is returned?", mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
function remedial(id, title, digits, limit, prompt, mistake, correctFeedback, bugFeedback, format) {
  return {
    id, title: `Fresh proof · ${title}`,
    prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
    input: inputText(digits, limit),
    canvas: canvas(digits, limit),
    decision: decision(digits, limit, prompt, mistake, correctFeedback, bugFeedback, format),
    why: correctFeedback
  };
}
// Each choice's label must be exactly what its mistake (or the correct solver) returns.
function checkChoices(digits, limit, choices, correctId, format) {
  const truth = format(splits(digits, limit));
  for (const choice of choices) {
    const shown = format(choice.id === correctId ? splits(digits, limit) : splits(digits, limit, choice.misconception));
    if (shown !== choice.label) throw Error(`${choice.id}: label ${choice.label} but its rule gives ${shown}`);
    if (choice.id !== correctId && shown === truth) throw Error(`${choice.id}: wrong choice equals the correct answer`);
  }
  if (new Set(choices.map(choice => choice.label)).size !== choices.length) throw Error("two choices show the same answer");
}

const nodeQuestion = {
  prompt: "What is a node in the cutting tree?",
  correct: "cut",
  choices: [
    { id: "cut", label: "The pieces cut so far, in order. The root, `start`, has no pieces yet.", feedback: "Correct. The pieces cut so far also say how many digits are used, so each node knows where the next piece starts.", misconception: null },
    { id: "position", label: "One node per number of digits used so far, so `1|2` and `12` share a node.", feedback: "`1|2` and `12` both use two digits, but they are different ways to cut. Each leads to its own answers, so each needs its own node.", misconception: "visited-position" },
    { id: "full", label: "Only cuts that use every digit.", feedback: "Partial cuts count too. `1` has not used every digit, but the tree needs it to reach `1|2`.", misconception: "leaves-only" },
    { id: "digit", label: "One node per digit in digits.", feedback: "One digit can be part of many different pieces. A node must remember the whole cut so far.", misconception: "digit-as-node" }
  ]
};
const edgeQuestion = {
  prompt: "When does a partial cut have an edge to a longer cut?",
  correct: "next-piece",
  choices: [
    { id: "next-piece", label: "Cut the next piece, of any length, right after the last piece. Its number must be at most limit, and it must not start with `0` unless it is exactly `0`.", feedback: "Correct. Each edge cuts one more allowed piece from the digits that are left.", misconception: null },
    { id: "short", label: "Cut the next piece of 1 or 2 digits, if its number is at most limit and it does not start with `0` unless it is exactly `0`.", feedback: "Pieces can be longer. With limit 400, `314` is one allowed piece of 3 digits.", misconception: "lengths-one-two" },
    { id: "strict", label: "Cut the next piece, of any length, if its number is below limit and it does not start with `0` unless it is exactly `0`.", feedback: "A piece exactly equal to limit is allowed. Only a number over limit is left out.", misconception: "strict-limit" },
    { id: "leading", label: "Cut the next piece, of any length, if its number is at most limit. A piece like `05` counts as 5.", feedback: "A piece cannot start with `0` unless it is exactly `0`. `05` is not allowed, even though 5 is small.", misconception: "allow-leading-zero" }
  ]
};

// Picture check: the exact tree, a missing cut, a missing edge, and a piece with a leading zero.
const pictureInput = ["907", 95];
const exactPicture = canvas(...pictureInput);
if (exactPicture.nodes.map(node => node.id).join() !== "start,9,9|0,9|0|7,90,90|7") throw Error("picture input drifted");
const pictureChoices = [
  { id: "exact", label: "Picture A", feedback: "Correct. Every allowed partial cut and every one-piece cut appears exactly once.", misconception: null, model: exactPicture },
  { id: "missing-node", label: "Picture D", feedback: "Cut `90|7` is missing. 90 is at most 95, so after cutting 90 you can still cut 7.", misconception: "omit-cut",
    model: { ...exactPicture, nodes: exactPicture.nodes.filter(node => node.id !== "90|7"), edges: exactPicture.edges.filter(edge => edge.to !== "90|7") } },
  { id: "missing-edge", label: "Picture B", feedback: "The direct cut from `9` to `9|0` is missing.", misconception: "omit-direct-edge",
    model: { ...exactPicture, edges: exactPicture.edges.filter(edge => edge.to !== "9|0") } },
  { id: "leading-zero", label: "Picture C", feedback: "`9|07` should not be drawn: 07 starts with 0, so it is not an allowed piece. Only a lone 0 may start with 0.", misconception: "allow-leading-zero",
    model: { ...exactPicture, nodes: [...exactPicture.nodes, { id: "9|07", label: "9|07" }], edges: [...exactPicture.edges, { from: "9", to: "9|07" }] } }
];

const outputQuestion = {
  id: "which-ways", digits: "406", limit: 40,
  prompt: "For digits `\"406\"` with limit `40`, which ways are returned?",
  correct: "two",
  choices: [
    { id: "two", feedback: "Correct. 40 equals the limit, so it is allowed, and a lone 0 is allowed too. 06 starts with 0, and 406 is over 40.", misconception: null },
    { id: "leading", feedback: "06 starts with 0, so cutting 4 then 06 is not allowed, even though 6 is small.", misconception: "allow-leading-zero" },
    { id: "no-zero", feedback: "A piece that is exactly 0 is allowed, so cutting 4, 0, 6 works too.", misconception: "reject-zero" },
    { id: "strict", feedback: "40 equals the limit, which is allowed. Only a number over limit is left out.", misconception: "strict-limit" }
  ]
};
outputQuestion.choices.forEach(choice => { choice.label = listLabel(choice.misconception ? splits(outputQuestion.digits, outputQuestion.limit, choice.misconception) : splits(outputQuestion.digits, outputQuestion.limit)); });
checkChoices(outputQuestion.digits, outputQuestion.limit, outputQuestion.choices, outputQuestion.correct, listLabel);

const countQuestion = {
  id: "how-many", digits: "314", limit: 400,
  prompt: "For digits `\"314\"` with limit `400`, how many ways are returned?",
  correct: "four",
  choices: [
    { id: "four", label: "`4`", feedback: "Correct. `3|1|4`, `3|14`, `31|4`, and `314` all work. 314 is one piece of 3 digits, and it is at most 400.", misconception: null },
    { id: "three", label: "`3`", feedback: "This tries only pieces of 1 or 2 digits, so it misses the single piece 314.", misconception: "lengths-one-two" },
    { id: "one", label: "`1`", feedback: "This marks each position as visited, like a graph search. `3|14`, `31|4`, and `314` reach positions that `3|1|4` already visited, so they are skipped. Different cuts that reach the same position are different answers.", misconception: "visited-position" },
    { id: "eight", label: "`8`", feedback: "This counts every partial cut in the tree, including start. Only cuts that use every digit are answers.", misconception: "record-every-node" }
  ]
};
checkChoices(countQuestion.digits, countQuestion.limit, countQuestion.choices, countQuestion.correct, list => `\`${count(list)}\``);

const lesson = {
  id: ID,
  facets: ["exact digits and limit", "partial-cut identity", "allowed next pieces", "complete cuts only"],
  buildTasks: [
    build("zero-piece", "Keep a lone 0, but not 05", "allowed next pieces", "205", 30, "allow-leading-zero",
      "`2|0|5` and `20|5` work. A lone 0 is an allowed piece, but 05 starts with 0, and 205 is over 30.", "This also keeps `2|05`, reading 05 as 5. A piece cannot start with 0 unless it is exactly 0."),
    build("number-not-text", "Compare numbers, not text", "exact digits and limit", "394", 40, "compare-as-text",
      "`3|9|4` and `39|4` work: 9 and 39 are at most 40. 94 and 394 are over 40.", "This compares pieces as text. In dictionary order \"9\" comes after \"40\", so 9 looks too big, and \"394\" comes before \"40\", so 394 looks small enough."),
    build("every-length", "Try pieces of every length", "allowed next pieces", "251", 300, "lengths-one-two",
      "251 is one piece of 3 digits, and it is at most 300, so `[251]` is a way too.", "This tries only pieces of 1 or 2 digits, so it never cuts 251 as one piece."),
    build("dead-end", "A dead end is not a way", "complete cuts only", "2481", 6, "dead-end-as-answer",
      "After `2|4`, the next digit 8 is over 6, and every longer piece from there is bigger still. `2|4` is a dead end, and no way uses every digit.", "This records `2|4` because it cannot go further. A way must use every digit, and 8 and 1 are never used.")
  ],
  conceptTasks: [
    {
      id: "concept-picture", title: "Match every input detail", facet: "exact digits and limit", kind: "visual-options",
      prompt: "Which picture exactly matches this raw input?", input: inputText(...pictureInput),
      choices: pictureChoices, correct: "exact", why: "Every allowed partial cut and every one-piece cut appears exactly once.",
      remedial: remedial("repair-1", "Match every input detail", "1203", 15, "Which list of ways is returned?", "reject-zero",
        "A lone 0 is an allowed piece, so `1|2|0|3` and `12|0|3` work. 03 starts with 0, and 20 and 120 are over 15.", "This refuses every piece that starts with 0, even a lone 0, so every cut gets stuck at the 0.")
    },
    {
      id: "concept-nodes", title: "Protect entity identity", facet: "partial-cut identity", kind: "choice",
      prompt: nodeQuestion.prompt, input: inputText("12", 20), shownModel: canvas("12", 20),
      choices: nodeQuestion.choices, correct: nodeQuestion.correct, why: nodeQuestion.choices[0].feedback,
      remedial: remedial("repair-2", "Protect entity identity", "213", 30, "How many ways are returned?", "visited-position",
        "`2|1|3`, `2|13`, and `21|3` are three different ways, even though they reach the same positions in digits.", "This visits each position only once, so `2|13` and `21|3` are skipped after `2|1|3` reaches those positions first.", count)
    },
    {
      id: "concept-relations", title: "Protect direct relations", facet: "allowed next pieces", kind: "choice",
      prompt: edgeQuestion.prompt, input: inputText("324", 40), shownModel: canvas("324", 40),
      choices: edgeQuestion.choices, correct: edgeQuestion.correct, why: edgeQuestion.choices[0].feedback,
      remedial: remedial("repair-3", "Protect direct relations", "315", 15, "Which list of ways is returned?", "strict-limit",
        "15 equals the limit, so `3|15` works too. 31 and 315 are over 15.", "This leaves out a piece equal to 15. Only a number over limit is not allowed.")
    },
    {
      id: "concept-output", title: "Predict from a fresh input", facet: "allowed next pieces", kind: "choice",
      prompt: outputQuestion.prompt, input: inputText(outputQuestion.digits, outputQuestion.limit),
      choices: outputQuestion.choices, correct: outputQuestion.correct, why: outputQuestion.choices[0].feedback,
      remedial: remedial("repair-4", "Predict from a fresh input", "192", 25, "Which list of ways is returned?", "compare-as-text",
        "`1|9|2` and `19|2` work: 9 and 19 are at most 25. 92 and 192 are over 25.", "This compares pieces as text: \"9\" comes after \"25\" in dictionary order, and \"192\" comes before it.")
    },
    {
      id: "concept-bug", title: "Catch a near-miss implementation", facet: "complete cuts only", kind: "choice",
      prompt: countQuestion.prompt, input: inputText(countQuestion.digits, countQuestion.limit),
      choices: countQuestion.choices, correct: countQuestion.correct, why: countQuestion.choices[0].feedback,
      remedial: remedial("repair-5", "Catch a near-miss implementation", "1291", 5, "Which list of ways is returned?", "dead-end-as-answer",
        "After `1|2`, the digit 9 is over 5, so `1|2` is a dead end. 12 is over 5 too, so no way uses every digit.", "This records the dead end `1|2`. A way must use every digit.")
    }
  ],
  // The last case has a dead end, which Step 3's boundary claim asks about.
  structureTasks: [["1010", 10], ["271", 80], ["3333", 40], ["608", 70], ["1571", 6]]
    .map(([digits, limit], index) => ({ id: `transfer-${index + 1}`, input: inputText(digits, limit), canvas: structureCanvas(digits, limit) })),
  practicePlan: { version: "short-v1", step1: ["zero-piece", "concept-nodes", "dead-end", "concept-relations", "concept-bug"], step3: [0, 1, 4] }
};
// Step 3 graphs may be larger than Step 1 drawings (up to 24 nodes).
function structureCanvas(digits, limit) {
  const nodes = [{ id: "start", label: "start" }], edges = [];
  const visit = (index, pieces) => {
    for (let length = 1; index + length <= digits.length; length++) {
      const piece = digits.slice(index, index + length);
      if (length > 1 && piece[0] === "0") break;
      if (Number(piece) > limit) break;
      const next = [...pieces, piece];
      nodes.push({ id: label(next), label: label(next) });
      edges.push({ from: label(pieces), to: label(next) });
      visit(index + length, next);
    }
  };
  visit(0, []);
  if (nodes.length > 24) throw Error(`${digits}: ${nodes.length} nodes exceeds the Step 3 cap`);
  return { directed: true, nodes, edges };
}
{ // The dead-end case must really have an unfinished leaf.
  const last = lesson.structureTasks[4].canvas, parents = new Set(last.edges.map(edge => edge.from));
  if (!last.nodes.some(node => node.id !== "start" && !parents.has(node.id) && node.id.split("|").join("") !== "1571")) throw Error("Step 3 dead-end case drifted");
}

const visualSpec = {
  id: ID,
  visualKind: "backtracking",
  pictureQuestions: [outputQuestion, countQuestion].map(({ id, digits, limit, prompt, correct, choices }) => ({ id, input: `digits = "${digits}", limit = ${limit}`, prompt, correct, choices })),
  nodeQuestion, edgeQuestion,
  nodeLabelFormat: {
    instruction: "Use `start` before any cut. After that, write the pieces cut so far in order, joined by `|`. Example: `12|3`.",
    pattern: "^(?:start|\\d+(?:\\|\\d+)*)$",
    showExactLabels: false
  },
  membershipClaim: { misconception: "leaves-only", no: "only cuts that use every digit should become nodes.", yes: "A partial cut that has not used every digit should have its own node." },
  practicePlan: lesson.practicePlan
};

const step2Spec = {
  id: ID,
  vocabulary: { nodeNames: "partial cuts", startNode: "uncut start", edges: "one-piece cuts", correctSearch: "partial cuts reached", mistakenSearch: "cuts the flawed search reaches" },
  rounds: [
    { bugs: ["last-branch"], level: "Last cut only", presentation: "predict-first", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["wrong-start"], level: "Starts after cutting 1", presentation: "repair-case", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start", mistakenStartLabel: "1" },
    { bugs: ["shallow-search"], level: "One piece at most", presentation: "exact-difference", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" }
  ],
  nodeLabels: { rule: "piece-prefix", description: "Use start before any cut, then the pieces joined by | like 1 or 12|3." },
  fixedStart: "start",
  input: {
    name: "uncut start", prompt: "Choose the start, before any cut", result: "generated-terminal-strings", resultLabel: "every way to cut digits into allowed pieces",
    fields: [
      { id: "digits", kind: "json", label: "a string of 1–6 digits", prompt: "Enter digits, like 1234", required: true },
      { id: "limit", kind: "integer", label: "limit", prompt: "Choose the limit", required: true, min: 1, max: 1000 }
    ]
  }
};

// ---------- Source problem ----------
const solution = `// CONTRACT for collectSplits(digits, limit, startIndex, piecesSoFar, splits):
//     when this call returns, every way to cut the rest of \`digits\`
//     (from index \`startIndex\` onward) into allowed pieces has been
//     appended to \`splits\`, each one written after \`piecesSoFar\`.
const collectSplits = (digits, limit, startIndex, piecesSoFar, splits) => {
    // Base case: every digit is used, so the pieces are one complete way.
    if (startIndex === digits.length) {
        splits.push(piecesSoFar);
        return;
    }

    // Traverse neighbors: cut the next piece, one length at a time.
    for (let end = startIndex + 1; end <= digits.length; end++) {
        const piece = digits.slice(startIndex, end);

        // A longer piece that starts with "0", like "05", is not allowed.
        // Every longer piece from here starts with the same "0", so stop.
        if (piece.length > 1 && piece[0] === "0") break;

        // Adding a digit never makes the number smaller, so once a piece
        // is over the limit, every longer piece from here is over it too.
        if (Number(piece) > limit) break;

        // The recursive leap of faith, one level down: this call has the
        // SAME contract — when it returns, every way to finish the cut
        // after \`piece\` is in \`splits\`. Trust it, do not trace it.
        // Trying every allowed next piece covers every way that starts
        // with \`piecesSoFar\` — exactly this function's contract, kept.
        collectSplits(digits, limit, end, [...piecesSoFar, Number(piece)], splits);
    }
};

const splitUnderLimit = (digits, limit) => {
    const splits = [];

    // The recursive leap of faith: trust the contract. Starting with no
    // pieces at index 0 collects every way to cut all of \`digits\`.
    collectSplits(digits, limit, 0, [], splits);

    return splits;
};`;
const reference = new Function(`${solution}\nreturn splitUnderLimit;`)();
const examples = [
  { digits: "1234", limit: 30, explanation: "Every single digit is at most 30, and so are 12 and 23. 34, 123, 234, and 1234 are over 30, so no way can use them." },
  { digits: "105", limit: 20, explanation: "Cutting 1, 0, 5 works because a lone 0 is allowed. Cutting 1, 05 does not: 05 starts with 0. 105 is over 20." },
  { digits: "17", limit: 5, explanation: "1 is allowed, but then 7 is over 5. 17 is over 5 too. No way uses every digit, so the answer is empty." }
];
const sourceProblem = {
  id: ID,
  title: "Split the Digits",
  category: "variant",
  parentId: "letter-combinations-of-a-phone-number",
  parentTitle: "Letter Combinations of a Phone Number",
  followsUp: "the-balance-lock",
  difficulty: "Hard",
  twist: "The hardest step after The Balance Lock: each choice is how many digits the next piece takes, and a piece must be a number at most limit with no leading zero.",
  statement: "You are given a string `digits` made of the characters `0` to `9`, and a whole number `limit`.\n\nCut `digits` into one or more **pieces**. Keep the digits in order, and use every digit exactly once. Read each piece as a whole number. A piece is allowed only if its number is **at most** `limit` and it does not start with `0`, unless the piece is exactly `0`. So `0` is allowed, but `05` is not.\n\nReturn **every** way to cut `digits` into allowed pieces. Write each way as a list of its piece numbers, from left to right. You may return the ways in any order. If there is no way, return an empty list.",
  examples: examples.map(({ digits, limit, explanation }) => ({ input: `digits = "${digits}", limit = ${limit}`, output: out(reference(digits, limit)), explanation })),
  constraints: ["1 <= digits.length <= 6", "digits contains only the characters 0 to 9", "1 <= limit <= 1000"],
  functionName: "splitUnderLimit",
  solution,
  tests: examples.map(({ digits, limit }) => ({ args: [digits, limit], expected: reference(digits, limit), unordered: true }))
};
{ // The reference JavaScript must agree with the solver, and the examples must say what we think.
  for (const test of sourceProblem.tests) if (out(test.expected) !== out(splits(...test.args))) throw Error("reference solution disagrees");
  if (sourceProblem.examples.map(example => example.output).join(" ") !== "[[1,2,3,4],[1,23,4],[12,3,4]] [[1,0,5],[10,5]] []") throw Error("statement examples drifted");
  // Exhaustive agreement on every 1–4 digit string for a spread of limits.
  for (let length = 1; length <= 4; length++) for (let n = 0; n < 10 ** length; n++) for (const limit of [1, 5, 9, 10, 12, 30, 99, 100, 250, 1000]) {
    const digits = String(n).padStart(length, "0");
    if (out(reference(digits, limit)) !== out(splits(digits, limit))) throw Error(`reference and solver disagree on ${digits}, ${limit}`);
  }
}

// ---------- Step 4: three single-bug programs, outputs taken from running them ----------
function step4Case(caseId, bugTitle, misconception, digits, limit, code, correctDiagnosis, diagnoses, graphProof) {
  const buggy = new Function(`${code}\nreturn solve;`)()({ digits, limit });
  const correct = reference(digits, limit);
  if (sameList(buggy, correct)) throw Error(`${caseId}: input does not expose the bug`);
  if (out(buggy) !== out(splits(digits, limit, misconception))) throw Error(`${caseId}: program and named mistake disagree`);
  return { id: ID, caseId, bugTitle, misconception, input: { digits, limit }, code, canvas: canvas(digits, limit), outputFormat: "list of every way to cut digits into allowed pieces",
    buggyOutput: out(buggy), correctOutput: out(correct), correctDiagnosis, diagnoses, graphProof };
}
const step4Program = ({ before = "", entry = "", zeroCheck = '      if (piece.length > 1 && piece[0] === "0") break;\n', limitCheck = "      if (Number(piece) > input.limit) break;" }) => `function solve(input) {
  const splits = [];${before}
  function cut(index, pieces) {${entry}
    if (index === input.digits.length) {
      splits.push(pieces);
      return;
    }
    for (let end = index + 1; end <= input.digits.length; end++) {
      const piece = input.digits.slice(index, end);
${zeroCheck}${limitCheck}
      cut(end, [...pieces, Number(piece)]);
    }
  }
  cut(0, []);
  return splits;
}`;
const step4Spec = {
  id: ID,
  cases: [
    step4Case("authored-deep-case", "Lets a Piece Start With 0", "allow-leading-zero", "2057", 30, step4Program({ zeroCheck: "" }), "leading-zero", [
      { id: "leading-zero", label: "Claim about the code: it never checks for a leading 0, so it cuts 05 and returns [2,5,7].", feedback: "Correct. A piece longer than one digit must not start with 0. Stop when piece has more than one digit and starts with \"0\"." },
      { id: "equal-limit", label: "Claim about the code: it leaves out a piece equal to the limit.", feedback: "It uses >, so a piece equal to the limit is kept." },
      { id: "short-pieces", label: "Claim about the code: it tries only pieces of 1 or 2 digits.", feedback: "The loop moves end up to the last digit, so every length is tried." }
    ], {
      realGraph: "The tree is start→2→2|0→2|0|5→2|0|5|7 and start→20→20|5→20|5|7. 05 is not an allowed piece.",
      codeRule: "Any piece whose number is at most limit is cut, even one that starts with 0.",
      separatingFeature: "After 2, the next two digits are 05, which starts with 0.",
      outputConsequence: "The code returns [[2,0,5,7],[2,5,7],[20,5,7]] instead of [[2,0,5,7],[20,5,7]].",
      changedGraph: "An extra edge 2→2|05 leads on to 2|05|7."
    }),
    step4Case("visited-position", "Marks Each Position as Visited", "visited-position", "123", 30, step4Program({
      before: "\n  const visitedIndexes = new Set();",
      entry: "\n    if (visitedIndexes.has(index)) return;\n    visitedIndexes.add(index);"
    }), "visited-index", [
      { id: "visited-index", label: "Claim about the code: it enters each position only once, so 1|23 and 12|3 are dropped when they reach positions that 1|2|3 already used.", feedback: "Correct. Different cuts can reach the same position, and each one is its own answer. A cutting tree needs no visited set." },
      { id: "short-pieces", label: "Claim about the code: it tries only pieces of 1 or 2 digits.", feedback: "The loop moves end up to the last digit, so every length is tried." },
      { id: "equal-limit", label: "Claim about the code: it leaves out a piece equal to the limit.", feedback: "It uses >, so a piece equal to the limit is kept." }
    ], {
      realGraph: "The tree is start→1→1|2→1|2|3, 1→1|23, and start→12→12|3. 123 is over 30.",
      codeRule: "Each position in digits is entered at most once, no matter which cut reaches it.",
      separatingFeature: "1|2 and 12 both end at position 2, and 1|23 reaches the end that 1|2|3 reached first.",
      outputConsequence: "The code returns [[1,2,3]] instead of [[1,2,3],[1,23],[12,3]].",
      changedGraph: "Edges into cuts that reach an already-visited position are removed: 1→1|23 and start→12."
    }),
    step4Case("equal-limit", "Leaves Out a Piece Equal to the Limit", "strict-limit", "125", 25, step4Program({ limitCheck: "      if (Number(piece) >= input.limit) break;" }), "equal-limit", [
      { id: "equal-limit", label: "Claim about the code: >= stops at 25 even though 25 equals the limit, which is allowed.", feedback: "Correct. Only a number over limit is not allowed, so [1,25] must be returned." },
      { id: "leading-zero", label: "Claim about the code: it lets a piece start with 0.", feedback: "It stops when a piece has more than one digit and starts with \"0\"." },
      { id: "visited-index", label: "Claim about the code: it skips positions it has already visited.", feedback: "It keeps no visited set, so every cut is explored." }
    ], {
      realGraph: "The tree is start→1→1|2→1|2|5, 1→1|25, and start→12→12|5. 125 is over 25.",
      codeRule: "A piece is cut only if its number is below the limit.",
      separatingFeature: "The piece 25 equals the limit exactly.",
      outputConsequence: "The code returns [[1,2,5],[12,5]] instead of [[1,2,5],[1,25],[12,5]].",
      changedGraph: "The edge 1→1|25 is removed."
    })
  ]
};

// ---------- Write every file ----------
files.writeSource("variants-final-8.json", sourceProblem);
files.upsert("visual-specs-variant.json", visualSpec);
files.upsert("visual-lessons-variant.json", lesson);
files.upsert("step2-specs-variant.json", step2Spec);
files.upsert("step4-specs-variant.json", step4Spec);
files.publish(sourceProblem, ["digits", "limit"]);
files.placeInOrder(ID, "Hardest step: cut a digit string into pieces of any length, keeping each piece at most a limit with no leading zero.", { after: "the-balance-lock" });
{ // Step 5 oracle fixtures: the source examples plus seeded varied inputs.
  let seed = 20260930;
  // Use the generator's high bits: its low bits repeat with a short period.
  const random = n => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) >>> 16) % n;
  const fixtures = sourceProblem.tests.map(test => ({ input: { digits: test.args[0], limit: test.args[1] }, expected: test.expected }));
  const limits = [3, 7, 9, 10, 15, 20, 25, 30, 45, 60, 99, 100, 150, 250, 400, 1000];
  while (fixtures.length < 42) {
    let digits = "";
    for (let size = 1 + random(6); digits.length < size;) digits += String(random(4) === 0 ? 0 : random(10));
    // Every third input uses one of its own pieces as the limit, so a piece can land exactly on it.
    const start = random(digits.length), piece = digits.slice(start, start + 1 + random(3));
    const limit = fixtures.length % 3 === 0 && Number(piece) >= 1 && Number(piece) <= 1000 ? Number(piece) : limits[random(limits.length)];
    fixtures.push({ input: { digits, limit }, expected: reference(digits, limit) });
  }
  files.setFixtures(ID, fixtures);
}
console.log(`Authored ${ID}: ${lesson.buildTasks.length} builds, ${lesson.conceptTasks.length} checks, ${lesson.structureTasks.length} structure graphs.`);
