/* Authors "Balanced Brackets", a follow-up to Runes on the Castle Door.
 * Every drawn graph, correct answer, and wrong answer below is computed by
 * running the reference solver or the named mistaken solver, never typed by hand.
 * Re-running replaces this problem's entries in place:
 *   node scripts/author-balanced-brackets.js
 * then run step5-build.js, step6-build.js, and build-visual-data.js.
 */
const files = require("./author-variant-files");

const ID = "balanced-brackets";

// ---------- Reference solver and single-mistake solvers ----------
// A node is a prefix. Add "(" while fewer than n are used and the depth stays at most
// maxDepth; add ")" while it closes an open bracket. Complete strings have 2n brackets.
function strings(n, maxDepth, mistake = null) {
  const found = [];
  const visit = (prefix, opens, closes) => {
    if (mistake === "every-node") found.push(prefix);
    if (prefix.length === (mistake === "stop-at-n" ? n : 2 * n)) {
      if (mistake !== "every-node") found.push(prefix);
      return;
    }
    const depth = opens - closes;
    const roomForOpen = mistake === "no-open-cap" || opens < n;
    const shallowEnough = mistake === "ignore-max-depth" ? true
      : mistake === "depth-over-by-one" ? depth <= maxDepth
      : mistake === "depth-under-by-one" ? depth + 1 < maxDepth
      : depth < maxDepth;
    if (roomForOpen && shallowEnough) visit(prefix + "(", opens + 1, closes);
    if (mistake === "close-up-to-n" ? closes < n : closes < opens) visit(prefix + ")", opens, closes + 1);
  };
  visit("", 0, 0);
  return found;
}

const label = prefix => prefix || "start";
function canvas(n, maxDepth) {
  const nodes = [{ id: "start", label: "start" }], edges = [];
  const visit = (prefix, opens, closes) => {
    if (prefix.length === 2 * n) return;
    const children = [];
    if (opens < n && opens - closes < maxDepth) children.push([prefix + "(", opens + 1, closes]);
    if (closes < opens) children.push([prefix + ")", opens, closes + 1]);
    // With these two rules every prefix can be completed: there are no dead ends.
    if (!children.length) throw Error(`${prefix} is a dead end`);
    for (const [next, nextOpens, nextCloses] of children) {
      nodes.push({ id: next, label: next });
      edges.push({ from: label(prefix), to: next });
      visit(next, nextOpens, nextCloses);
    }
  };
  visit("", 0, 0);
  if (nodes.length > 9) throw Error(`n=${n}, maxDepth=${maxDepth}: ${nodes.length} nodes exceeds the Step 1 cap`);
  const leaves = nodes.filter(node => !edges.some(edge => edge.from === node.id)).map(node => node.id);
  if (JSON.stringify(leaves) !== JSON.stringify(strings(n, maxDepth))) throw Error("canvas leaves and solver disagree");
  return { directed: true, nodes, edges };
}
const inputText = (n, maxDepth) => `n=${n}, maxDepth=${maxDepth}`;
const out = value => JSON.stringify(value);
// Output order does not matter; repeats do.
const sameList = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const count = list => String(list.length);
const codeText = text => `\`${text}\``;
const listLabel = list => list.length === 1 ? codeText(list[0]) : list.length === 2 ? `${codeText(list[0])} and ${codeText(list[1])}` : `${list.slice(0, -1).map(codeText).join(", ")}, and ${codeText(list.at(-1))}`;

// Inputs kept fresh for the Step 6 code lab: nothing else may use them.
const codeLabInputs = [[3, 5], [4, 3], [4, 4], [5, 1], [5, 2], [5, 4], [5, 5]];
const usedInputs = [];
const use = (n, maxDepth) => {
  if (codeLabInputs.some(([a, b]) => a === n && b === maxDepth)) throw Error(`${inputText(n, maxDepth)} is reserved for the Step 6 code lab`);
  if (!Number.isInteger(n) || n < 1 || n > 5 || !Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > 5) throw Error(`${inputText(n, maxDepth)} is outside the constraints`);
  usedInputs.push([n, maxDepth]);
};

// A two-choice decision whose wrong answer is what the named mistake really returns.
function decision(n, maxDepth, prompt, mistake, correctFeedback, bugFeedback, format = out) {
  use(n, maxDepth);
  const correct = strings(n, maxDepth), buggy = strings(n, maxDepth, mistake);
  if (sameList(correct, buggy) || format(correct) === format(buggy)) throw Error(`${mistake} does not change ${inputText(n, maxDepth)}`);
  return {
    prompt,
    choices: [
      { id: "correct", label: format(correct), feedback: `Correct. ${correctFeedback}`, misconception: null },
      { id: "bug", label: format(buggy), feedback: bugFeedback, misconception: mistake }
    ],
    correct: "correct"
  };
}
function build(id, title, facet, n, maxDepth, mistake, correctFeedback, bugFeedback) {
  return {
    id, title, facet,
    prompt: "Use the raw input to complete the challenge. Then choose the result.",
    input: inputText(n, maxDepth),
    canvas: canvas(n, maxDepth),
    decision: decision(n, maxDepth, "Which string list is returned?", mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
function remedial(id, title, n, maxDepth, prompt, mistake, correctFeedback, bugFeedback, format) {
  return {
    id, title: `Fresh proof · ${title}`,
    prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
    input: inputText(n, maxDepth),
    canvas: canvas(n, maxDepth),
    decision: decision(n, maxDepth, prompt, mistake, correctFeedback, bugFeedback, format),
    why: correctFeedback
  };
}
// Each choice's label must be exactly what its mistake (or the correct solver) returns.
function checkChoices(n, maxDepth, choices, correctId, format) {
  use(n, maxDepth);
  const truth = format(strings(n, maxDepth));
  for (const choice of choices) {
    const shown = format(choice.id === correctId ? strings(n, maxDepth) : strings(n, maxDepth, choice.misconception));
    if (shown !== choice.label) throw Error(`${choice.id}: label ${choice.label} but its rule gives ${shown}`);
    if (choice.id !== correctId && shown === truth) throw Error(`${choice.id}: wrong choice equals the correct answer`);
  }
  if (new Set(choices.map(choice => choice.label)).size !== choices.length) throw Error("two choices show the same answer");
}

const nodeQuestion = {
  prompt: "What is a node in the bracket decision tree?",
  correct: "prefix",
  choices: [
    { id: "prefix", label: "A prefix: the brackets written so far, from left to right. The root `start` is the empty string.", feedback: "Correct. Each level adds one bracket, so a node remembers the whole string built so far.", misconception: null },
    { id: "depth", label: "One node per depth, so prefixes with the same number of open brackets share a node.", feedback: "Different prefixes can have the same depth: `(` and `(()` both have one bracket open. They lead to different strings, so each needs its own node.", misconception: "merge-by-depth" },
    { id: "full", label: "Only complete strings with 2n brackets.", feedback: "Complete strings are the leaves. The shorter prefixes are needed to show the choices that lead to them.", misconception: "leaves-only" },
    { id: "bracket", label: "Two nodes in total: one for `(` and one for `)`.", feedback: "The same bracket at a different place builds a different string. A node must remember the whole prefix, not just its last bracket.", misconception: "bracket-as-node" }
  ]
};
const edgeQuestion = {
  prompt: "When does a prefix have an edge to a longer prefix?",
  correct: "two-rules",
  choices: [
    { id: "two-rules", label: "Add `(` if fewer than n `(` are used and fewer than maxDepth brackets are open. Add `)` if fewer `)` than `(` are used so far.", feedback: "Correct. A new `(` keeps the depth at most maxDepth, and a new `)` always closes a bracket that is still open.", misconception: null },
    { id: "close-up-to-n", label: "Add `(` by the same rule. Add `)` whenever fewer than n `)` are used.", feedback: "Then `)` could come first, as in `)(`. That closes a bracket that was never opened, so the string is not balanced.", misconception: "close-up-to-n" },
    { id: "depth-at-most", label: "Add `(` if fewer than n `(` are used and at most maxDepth brackets are open. Add `)` if fewer `)` than `(` are used so far.", feedback: "If maxDepth brackets are already open, one more `(` makes the depth maxDepth + 1, which is too deep.", misconception: "depth-over-by-one" },
    { id: "no-cap", label: "Add `(` whenever fewer than maxDepth brackets are open. Add `)` if fewer `)` than `(` are used so far.", feedback: "Every answer has exactly n `(`. Without the n check, a string can use more `(` than `)`, like `((` when n is 1.", misconception: "no-open-cap" }
  ]
};

// Picture check: the exact tree, a missing string, a missing edge, and an unbalanced extra prefix.
const pictureInput = [2, 3];
use(...pictureInput);
const exactPicture = canvas(...pictureInput);
if (exactPicture.nodes.map(node => node.id).join(" ") !== "start ( (( (() (()) () ()( ()()") throw Error("picture input drifted");
if (!strings(2, 3, "close-up-to-n").some(text => text.startsWith("())"))) throw Error("picture C must come from the close-up-to-n mistake");
const pictureChoices = [
  { id: "exact", label: "Picture A", feedback: "Correct. Every prefix and every one-bracket extension appears exactly once.", misconception: null, model: exactPicture },
  { id: "missing-node", label: "Picture D", feedback: "`(())` is missing. It is a complete balanced string, so it needs its own node.", misconception: "omit-complete-string",
    model: { ...exactPicture, nodes: exactPicture.nodes.filter(node => node.id !== "(())"), edges: exactPicture.edges.filter(edge => edge.to !== "(())") } },
  { id: "missing-edge", label: "Picture B", feedback: "The direct extension from `(` to `()` is missing.", misconception: "omit-direct-edge",
    model: { ...exactPicture, edges: exactPicture.edges.filter(edge => edge.to !== "()") } },
  { id: "unbalanced", label: "Picture C", feedback: "After `()`, no bracket is open, so `())` closes a bracket that was never opened. A `)` is allowed only while a `(` is still open.", misconception: "close-up-to-n",
    model: { ...exactPicture, nodes: [...exactPicture.nodes, { id: "())", label: "())" }], edges: [...exactPicture.edges, { from: "()", to: "())" }] } }
];

const outputQuestion = {
  id: "which-strings", n: 1, maxDepth: 3,
  prompt: "For n = `1` and maxDepth = `3`, which strings are returned?",
  correct: "one",
  choices: [
    { id: "one", feedback: "Correct. With one `(` and one `)`, the only balanced string is `()`. maxDepth 3 never matters, because at most one bracket can be open.", misconception: null },
    { id: "closes-first", feedback: "`)(` starts with a `)` that closes nothing. A `)` is allowed only while a `(` is still open.", misconception: "close-up-to-n" },
    { id: "half", feedback: "`(` is only half a string. A complete string has n `(` and n `)`, so it is 2n = 2 brackets long.", misconception: "stop-at-n" },
    { id: "extra-open", feedback: "`((` uses two `(`, but n is 1. Every string has exactly n `(`, even when maxDepth would allow more.", misconception: "no-open-cap" }
  ]
};
outputQuestion.choices.forEach(choice => { choice.label = listLabel(choice.misconception ? strings(outputQuestion.n, outputQuestion.maxDepth, choice.misconception) : strings(outputQuestion.n, outputQuestion.maxDepth)); });
checkChoices(outputQuestion.n, outputQuestion.maxDepth, outputQuestion.choices, outputQuestion.correct, listLabel);

const countQuestion = {
  id: "how-many", n: 4, maxDepth: 2,
  prompt: "For n = `4` and maxDepth = `2`, how many strings are returned?",
  correct: "eight",
  choices: [
    { id: "eight", feedback: "Correct. Of the 14 balanced strings with four pairs, 8 never have more than 2 brackets open at once.", misconception: null },
    { id: "fourteen", feedback: "This counts every balanced string with four pairs. It ignores maxDepth, so strings like `((()))()` with 3 brackets open are counted too.", misconception: "ignore-max-depth" },
    { id: "one", feedback: "This stops a `(` that would make 2 brackets open. maxDepth 2 allows exactly 2 open at once; only a third is too deep.", misconception: "depth-under-by-one" },
    { id: "four", feedback: "This counts prefixes with 4 brackets. A complete string has n `(` and n `)`, so it is 2n = 8 brackets long.", misconception: "stop-at-n" }
  ]
};
countQuestion.choices.forEach(choice => { choice.label = codeText(count(choice.misconception ? strings(countQuestion.n, countQuestion.maxDepth, choice.misconception) : strings(countQuestion.n, countQuestion.maxDepth))); });
checkChoices(countQuestion.n, countQuestion.maxDepth, countQuestion.choices, countQuestion.correct, list => codeText(count(list)));
if (countQuestion.choices.map(choice => choice.label).join(" ") !== "`8` `14` `1` `4`") throw Error("count question drifted");

const lesson = {
  id: ID,
  facets: ["exact n and maxDepth", "prefix state identity", "open and close rules", "complete balanced strings"],
  buildTasks: [
    build("depth-limit", "Respect maxDepth", "open and close rules", 2, 1, "ignore-max-depth",
      "With maxDepth 1, the first `(` must close before the next one opens, so `(())` is never built.", "This ignores maxDepth. `(())` has 2 brackets open at once, more than maxDepth 1."),
    build("balanced-closes", "Close only an open bracket", "open and close rules", 1, 1, "close-up-to-n",
      "A `)` must close a `(` that is still open, so `()` is the only string.", "This adds `)` whenever fewer than n `)` are used. `)(` starts by closing a bracket that was never opened."),
    build("full-length", "Finish at 2n brackets", "complete balanced strings", 2, 2, "stop-at-n",
      "A complete string has 2 `(` and 2 `)`, so only the 4-bracket leaves `(())` and `()()` are returned.", "This returns a prefix as soon as it has n = 2 brackets. `((` and `()` are only halfway: a complete string has 2n = 4."),
    build("open-cap", "Use exactly n opening brackets", "exact n and maxDepth", 1, 2, "no-open-cap",
      "n is 1, so only one `(` is allowed. maxDepth 2 would allow a second, but there is none to use.", "This adds `(` whenever the depth allows it, so `((` uses two `(` when n is 1.")
  ],
  conceptTasks: [
    {
      id: "concept-picture", title: "Match every input detail", facet: "exact n and maxDepth", kind: "visual-options",
      prompt: "Which picture exactly matches this raw input?", input: inputText(...pictureInput),
      choices: pictureChoices, correct: "exact", why: "Every prefix and every one-bracket extension appears exactly once.",
      remedial: remedial("repair-1", "Match every input detail", 1, 4, "Which string list is returned?", "stop-at-n",
        "A complete string has 2n = 2 brackets, so the answer is `()`.", "This returns `(` because it has n = 1 bracket. A complete string has 2n = 2 brackets.")
    },
    {
      id: "concept-nodes", title: "Protect entity identity", facet: "prefix state identity", kind: "choice",
      prompt: nodeQuestion.prompt, input: inputText(2, 1), shownModel: canvas(2, 1),
      choices: nodeQuestion.choices, correct: nodeQuestion.correct, why: nodeQuestion.choices[0].feedback,
      remedial: remedial("repair-2", "Protect entity identity", 2, 2, "How many strings are returned?", "every-node",
        "The tree has 8 prefixes, but only the 2 complete strings `(())` and `()()` are returned.", "This returns every node, including the empty string at `start` and unfinished prefixes like `((`. Only complete strings with 2n brackets are answers.", count)
    },
    {
      id: "concept-relations", title: "Protect direct relations", facet: "open and close rules", kind: "choice",
      prompt: edgeQuestion.prompt, input: inputText(2, 2), shownModel: canvas(2, 2),
      choices: edgeQuestion.choices, correct: edgeQuestion.correct, why: edgeQuestion.choices[0].feedback,
      remedial: remedial("repair-3", "Protect direct relations", 2, 3, "How many strings are returned?", "close-up-to-n",
        "Only `(())` and `()()` are returned: every `)` closes a `(` that is still open.", "This adds `)` whenever fewer than n `)` are used, so it also counts unbalanced strings like `)(()` and `())(`.", count)
    },
    {
      id: "concept-output", title: "Predict from a fresh input", facet: "complete balanced strings", kind: "choice",
      prompt: outputQuestion.prompt, input: inputText(outputQuestion.n, outputQuestion.maxDepth),
      choices: outputQuestion.choices, correct: outputQuestion.correct, why: outputQuestion.choices[0].feedback,
      remedial: remedial("repair-4", "Predict from a fresh input", 1, 2, "Which string list is returned?", "close-up-to-n",
        "Only `()` is balanced. A `)` must close a `(` that is still open.", "This allows `)` first, building `)(`, which closes a bracket that was never opened.")
    },
    {
      id: "concept-bug", title: "Catch a near-miss implementation", facet: "open and close rules", kind: "choice",
      prompt: countQuestion.prompt, input: inputText(countQuestion.n, countQuestion.maxDepth),
      choices: countQuestion.choices, correct: countQuestion.correct, why: countQuestion.choices[0].feedback,
      remedial: remedial("repair-5", "Catch a near-miss implementation", 2, 2, "Which string list is returned?", "depth-under-by-one",
        "`(())` reaches depth 2, which maxDepth 2 allows. Only going deeper than maxDepth is left out.", "This refuses a `(` that would make 2 brackets open, so it loses `(())`. maxDepth 2 allows exactly 2 open at once.")
    }
  ],
  structureTasks: [[2, 4], [3, 1], [1, 5], [2, 5], [4, 1]]
    .map(([n, maxDepth], index) => { use(n, maxDepth); return { id: `transfer-${index + 1}`, input: inputText(n, maxDepth), canvas: canvas(n, maxDepth) }; }),
  practicePlan: { version: "short-v1", step1: ["depth-limit", "concept-nodes", "balanced-closes", "concept-relations", "concept-bug"], step3: [0, 1, 4] }
};
use(2, 1); use(2, 2);
{ // Step 3 transfers must use fresh inputs and at least three graph shapes.
  const stepOneInputs = new Set([...lesson.buildTasks, ...lesson.conceptTasks, ...lesson.conceptTasks.map(task => task.remedial)].map(task => task.input));
  if (lesson.structureTasks.some(task => stepOneInputs.has(task.input))) throw Error("a Step 3 transfer repeats a Step 1 input");
  const shape = model => `${model.nodes.length}:${model.edges.length}:${model.edges.filter(edge => edge.from === "(").length}`;
  if (new Set(lesson.structureTasks.map(task => shape(task.canvas))).size < 3) throw Error("Step 3 transfers need at least three graph shapes");
  const builds = lesson.buildTasks.map(task => task.input);
  if (new Set(builds).size !== builds.length) throw Error("every build needs a fresh input");
}

const visualSpec = {
  id: ID,
  visualKind: "backtracking",
  pictureQuestions: [outputQuestion, countQuestion].map(({ id, n, maxDepth, prompt, correct, choices }) => ({ id, input: `n = ${n}, maxDepth = ${maxDepth}`, prompt, correct, choices })),
  nodeQuestion, edgeQuestion,
  nodeLabelFormat: {
    instruction: "Use `start` for the empty string. After that, write the brackets chosen so far. Example: `(()`.",
    pattern: "^(?:start|[()]+)$",
    showExactLabels: false
  },
  membershipClaim: { misconception: "leaves-only", no: "only complete strings with 2n brackets should become nodes.", yes: "Every shorter prefix along the way should have its own node too." },
  practicePlan: lesson.practicePlan
};

// The mistaken start "((" can never lead to a string that begins with "()",
// and "()()..." is always an answer once n is at least 2.
const step2Spec = {
  id: ID,
  vocabulary: { nodeNames: "bracket prefixes", startNode: "empty string", edges: "one-bracket extensions", correctSearch: "prefixes reached", mistakenSearch: "prefixes the flawed search reaches" },
  rounds: [
    { bugs: ["shallow-search"], level: "One bracket at most", presentation: "exact-difference", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["wrong-start"], level: "Starts after ((", presentation: "repair-case", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start", mistakenStartLabel: "((" },
    { bugs: ["last-branch"], level: "Last bracket only", presentation: "predict-first", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" }
  ],
  nodeLabels: { rule: "bracket-prefix", description: "Use start for the empty string, then bracket prefixes like ( or (()." },
  fixedStart: "start",
  input: {
    name: "empty string", prompt: "Choose the empty string", result: "generated-terminal-strings", resultLabel: "all balanced strings no deeper than maxDepth",
    fields: [
      { id: "n", kind: "integer", label: "n", prompt: "Choose n, the number of ( in each string", required: true, min: 1, max: 5 },
      { id: "maxDepth", kind: "integer", label: "maxDepth", prompt: "Choose maxDepth, the most brackets open at once", required: true, min: 1, max: 5 }
    ]
  }
};

// ---------- Step 4: three single-bug programs, outputs taken from running them ----------
const step4Program = (openCheck, closeCheck) => `function solve(input) {
  const strings = [];
  function build(prefix, opens, closes) {
    if (prefix.length === 2 * input.n) {
      strings.push(prefix);
      return;
    }
    if (${openCheck}) {
      build(prefix + "(", opens + 1, closes);
    }
    if (${closeCheck}) {
      build(prefix + ")", opens, closes + 1);
    }
  }
  build("", 0, 0);
  return strings;
}`;
const correctOpen = "opens < input.n && opens - closes < input.maxDepth", correctClose = "closes < opens";
{ // The program with both correct checks must be the reference solver.
  const reference = new Function(`${step4Program(correctOpen, correctClose)}\nreturn solve;`)();
  for (let n = 1; n <= 5; n++) for (let maxDepth = 1; maxDepth <= 5; maxDepth++) if (out(reference({ n, maxDepth })) !== out(strings(n, maxDepth))) throw Error("Step 4 base program drifted");
}
function step4Case(caseId, bugTitle, misconception, n, maxDepth, [openCheck, closeCheck], correctDiagnosis, diagnoses, graphProof) {
  use(n, maxDepth);
  const code = step4Program(openCheck, closeCheck);
  const buggy = new Function(`${code}\nreturn solve;`)()({ n, maxDepth });
  const correct = strings(n, maxDepth);
  if (sameList(buggy, correct)) throw Error(`${caseId}: input does not expose the bug`);
  if (out(buggy) !== out(strings(n, maxDepth, misconception))) throw Error(`${caseId}: program and named mistake disagree`);
  if (!graphProof.outputConsequence.includes(out(buggy)) || !graphProof.outputConsequence.includes(out(correct))) throw Error(`${caseId}: graph proof quotes the wrong outputs`);
  return { id: ID, caseId, bugTitle, misconception, input: { n, maxDepth }, code, canvas: canvas(n, maxDepth), outputFormat: "list of every balanced string no deeper than maxDepth",
    buggyOutput: out(buggy), correctOutput: out(correct), correctDiagnosis, diagnoses, graphProof };
}
const step4Spec = {
  id: ID,
  cases: [
    step4Case("authored-deep-case", "Closes a Bracket That Was Never Opened", "close-up-to-n", 2, 2, [correctOpen, "closes < input.n"], "closes-nothing", [
      { id: "closes-nothing", label: "Claim about the code: it adds ) whenever fewer than n ) are used, so a string can start with ) and close a bracket that was never opened.", feedback: "Correct. A ) must close an open (, so the check is closes < opens." },
      { id: "too-deep", label: "Claim about the code: it lets more than maxDepth brackets be open at once.", feedback: "The ( check still requires opens - closes < maxDepth." },
      { id: "half-length", label: "Claim about the code: it saves strings before they have 2n brackets.", feedback: "It saves a string only when prefix.length === 2 * input.n." }
    ], {
      realGraph: "The tree is start→(, then (→((→(()→(()) and (→()→()(→()(). Every prefix can be completed.",
      codeRule: "A ) is added whenever fewer than n ) are used, even when no ( is open.",
      separatingFeature: "start and () have no open bracket, but the code still adds ) after them.",
      outputConsequence: `The code returns ${out(strings(2, 2, "close-up-to-n"))} instead of ${out(strings(2, 2))}.`,
      changedGraph: "Extra edges such as start→) and ()→()) build unbalanced strings."
    }),
    step4Case("depth-over-by-one", "Lets the Depth Go One Past maxDepth", "depth-over-by-one", 2, 1, ["opens < input.n && opens - closes <= input.maxDepth", correctClose], "one-too-deep", [
      { id: "one-too-deep", label: "Claim about the code: <= allows a ( while maxDepth brackets are already open, so (( reaches depth 2 when maxDepth is 1.", feedback: "Correct. Before adding (, fewer than maxDepth brackets must be open, so use < instead of <=." },
      { id: "closes-nothing", label: "Claim about the code: it adds ) even when no ( is open.", feedback: "It adds ) only when closes < opens." },
      { id: "extra-open", label: "Claim about the code: it can use more than n (.", feedback: "The ( check still requires opens < input.n." }
    ], {
      realGraph: "The tree is the chain start→(→()→()(→()(). With maxDepth 1, ( cannot follow (.",
      codeRule: "A ( is added while opens - closes is at most maxDepth, so the new depth can be maxDepth + 1.",
      separatingFeature: "At ( one bracket is open, which already equals maxDepth 1.",
      outputConsequence: `The code returns ${out(strings(2, 1, "depth-over-by-one"))} instead of ${out(strings(2, 1))}.`,
      changedGraph: "An extra edge (→(( lets the deeper string (()) be built."
    }),
    step4Case("no-open-cap", "Forgets That a String Has Only n Opening Brackets", "no-open-cap", 1, 4, ["opens - closes < input.maxDepth", correctClose], "extra-open", [
      { id: "extra-open", label: "Claim about the code: the ( check never compares opens with n, so (( uses two ( when n is 1.", feedback: "Correct. Every string has exactly n (, so a ( needs opens < n as well as the depth check." },
      { id: "one-too-deep", label: "Claim about the code: it lets the depth go one past maxDepth.", feedback: "It uses opens - closes < maxDepth, so the depth stays at most maxDepth." },
      { id: "half-length", label: "Claim about the code: it saves strings before they have 2n brackets.", feedback: "It saves a string only when prefix.length === 2 * input.n." }
    ], {
      realGraph: "The tree is the chain start→(→(). Only one ( is allowed because n is 1.",
      codeRule: "A ( is added whenever the depth is below maxDepth, however many ( are already used.",
      separatingFeature: "maxDepth 4 leaves room for a second (, but n is 1.",
      outputConsequence: `The code returns ${out(strings(1, 4, "no-open-cap"))} instead of ${out(strings(1, 4))}.`,
      changedGraph: "An extra edge (→(( builds a 2-bracket string with no ) in it."
    })
  ]
};

// ---------- Source problem ----------
const solution = `// CONTRACT for collectStrings(n, maxDepth, prefix, opens, closes, strings):
//     when this call returns, every complete string that starts with
//     \`prefix\` (which uses \`opens\` "(" and \`closes\` ")"), stays
//     balanced, and never has more than \`maxDepth\` brackets open has
//     been appended to \`strings\`.
const collectStrings = (n, maxDepth, prefix, opens, closes, strings) => {
    // Base case
    if (prefix.length === 2 * n) {
        strings.push(prefix);
        return;
    }

    // Traverse neighbors
    // Open: a string has only n "(" to use, and the new "(" must
    // leave at most maxDepth brackets open.
    if (opens < n && opens - closes < maxDepth) {
        // The recursive leap of faith, one level down: this call has
        // the SAME contract — when it returns, every complete string
        // that starts with \`prefix\` plus "(" is in \`strings\`.
        // Trust it, do not trace it.
        collectStrings(n, maxDepth, prefix + "(", opens + 1, closes, strings);
    }

    // Close: a ")" must close a "(" that is still open. This keeps
    // the string balanced, and it means no prefix is a dead end:
    // while any bracket is open, closing it is always allowed.
    if (closes < opens) {
        // The recursive leap of faith again: trust the contract for
        // \`prefix\` plus ")". The two calls together cover every
        // complete string that starts with \`prefix\` — exactly this
        // function's contract, kept.
        collectStrings(n, maxDepth, prefix + ")", opens, closes + 1, strings);
    }
};

const balancedStrings = (n, maxDepth) => {
    const strings = [];

    // The recursive leap of faith: trust the contract. Starting from
    // the empty string collects every answer.
    collectStrings(n, maxDepth, "", 0, 0, strings);

    return strings;
};`;
const examples = [
  { n: 3, maxDepth: 2, explanation: "These are the balanced strings with three pairs that never have more than 2 brackets open. `((()))` is left out: after its third `(`, 3 brackets are open at once." },
  { n: 3, maxDepth: 3, explanation: "A string with three `(` can never have more than 3 brackets open, so maxDepth rules nothing out. All five balanced strings count." },
  { n: 3, maxDepth: 1, explanation: "With maxDepth 1, each `(` must close before the next one opens, so only one string is left." }
];
examples.forEach(({ n, maxDepth }) => use(n, maxDepth));
const sourceProblem = {
  id: ID,
  title: "Balanced Brackets",
  category: "variant",
  parentId: "letter-combinations-of-a-phone-number",
  parentTitle: "Letter Combinations of a Phone Number",
  followsUp: "runes-on-the-castle-door",
  difficulty: "Medium",
  twist: "Builds on Runes on the Castle Door: every position offers the same two brackets, but which one may come next depends on the whole prefix so far: how many brackets are used and how many are still open.",
  statement: "You are given two whole numbers, `n` and `maxDepth`.\n\nReturn **every** string made of exactly `n` `(` and `n` `)` that is **balanced** and never more than `maxDepth` deep.\n\nA string is **balanced** when, reading from left to right, the number of `)` never exceeds the number of `(` so far. The **depth** at any point is the number of `(` so far minus the number of `)` so far: how many brackets are open at once. The depth must never be more than `maxDepth`.\n\nYou may return the strings in any order.",
  examples: examples.map(({ n, maxDepth, explanation }) => ({ input: `n = ${n}, maxDepth = ${maxDepth}`, output: out(strings(n, maxDepth)), explanation })),
  constraints: ["1 <= n <= 5", "1 <= maxDepth <= 5"],
  functionName: "balancedStrings",
  solution,
  tests: examples.map(({ n, maxDepth }) => ({ args: [n, maxDepth], expected: strings(n, maxDepth), unordered: true }))
};
{ // The reference JavaScript must agree with the solver everywhere, and the examples must say what we think.
  const reference = new Function(`${solution}\nreturn balancedStrings;`)();
  for (let n = 1; n <= 5; n++) for (let maxDepth = 1; maxDepth <= 5; maxDepth++) if (out(reference(n, maxDepth)) !== out(strings(n, maxDepth))) throw Error("reference solution disagrees");
  if (sourceProblem.examples.map(example => example.output).join(" ") !== '["(()())","(())()","()(())","()()()"] ["((()))","(()())","(())()","()(())","()()()"] ["()()()"]') throw Error("statement examples drifted");
  // Independent check: filter every arrangement of n "(" and n ")".
  for (let n = 1; n <= 5; n++) for (let maxDepth = 1; maxDepth <= 5; maxDepth++) {
    const all = [];
    for (let mask = 0; mask < 2 ** (2 * n); mask++) {
      const text = [...Array(2 * n)].map((_, i) => mask & (1 << (2 * n - 1 - i)) ? ")" : "(").join("");
      let depth = 0, ok = true;
      for (const char of text) { depth += char === "(" ? 1 : -1; if (depth < 0 || depth > maxDepth) ok = false; }
      if (ok && depth === 0) all.push(text);
    }
    if (!sameList(all, strings(n, maxDepth))) throw Error(`solver disagrees with brute force at n=${n}, maxDepth=${maxDepth}`);
  }
}

// ---------- Write every file ----------
files.writeSource("variants-final-7.json", sourceProblem);
files.upsert("visual-specs-variant.json", visualSpec);
files.upsert("visual-lessons-variant.json", lesson);
files.upsert("step2-specs-variant.json", step2Spec);
files.upsert("step4-specs-variant.json", step4Spec);
files.publish(sourceProblem, ["n", "maxDepth"]);
files.placeInOrder(ID, "Follow-up to the runes: the next allowed bracket depends on how many are still open, so carry that count down each branch.", { after: "the-balance-lock" });
{ // Step 5 oracle fixtures: the source examples plus every other allowed input not kept for Step 6.
  const fixtures = sourceProblem.tests.map(test => ({ input: { n: test.args[0], maxDepth: test.args[1] }, expected: test.expected }));
  for (let n = 1; n <= 5; n++) for (let maxDepth = 1; maxDepth <= 5; maxDepth++) {
    if (codeLabInputs.some(([a, b]) => a === n && b === maxDepth) || fixtures.some(test => test.input.n === n && test.input.maxDepth === maxDepth)) continue;
    use(n, maxDepth);
    fixtures.push({ input: { n, maxDepth }, expected: strings(n, maxDepth) });
  }
  files.setFixtures(ID, fixtures);
}
module.exports = { strings, codeLabInputs };
if (require.main === module) console.log(`Authored ${ID}: ${lesson.buildTasks.length} builds, ${lesson.conceptTasks.length} checks, ${lesson.structureTasks.length} structure graphs; ${usedInputs.length} input uses, none reserved for Step 6.`);
