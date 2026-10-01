/* Authors "Stack Pop Orders": push 1, 2, …, n onto a stack in order, popping at
 * any time the stack is not empty, and list every order the numbers can be
 * written down in. Every drawn graph, correct answer, and wrong answer below is
 * computed by running the reference solver or the named mistaken solver, never
 * typed by hand. Re-running replaces this problem's entries in place:
 *   node scripts/author-stack-pop-orders.js
 * then run step5-build.js, step6-build.js, and build-visual-data.js.
 */
const files = require("./author-variant-files");

const ID = "stack-pop-orders";

// ---------- Reference solver and single-mistake solvers ----------
// A state is out (numbers written down so far) and stack (bottom to top).
// The next number to push is one more than how many numbers have been pushed.
const nextNumber = (out, stack) => out.length + stack.length + 1;
function orders(n, mistake = null, out0 = [], stack0 = []) {
  if (mistake === "any-order") return anyOrder(n, out0, stack0);
  const found = [];
  const visit = (out, stack, next) => {
    const finished = mistake === "stop-when-empty" ? stack.length === 0 && out.length > 0 : out.length === n;
    if (finished) { found.push(out); return; }
    const canPop = stack.length > 0 && (mistake !== "pop-only-at-end" || next > n);
    if (canPop) {
      if (mistake === "pop-bottom") visit([...out, stack[0]], stack.slice(1), next);
      else visit([...out, stack.at(-1)], stack.slice(0, -1), next);
    }
    // "one-move-only" pops whenever it can and pushes only when it cannot pop.
    if (mistake === "one-move-only" && canPop) return;
    if (mistake === "push-limit" ? next < n : next <= n) visit(out, [...stack, next], next + 1);
  };
  visit(out0, stack0, nextNumber(out0, stack0));
  return found;
}
// The belief that the stack never matters: every ordering of the numbers not yet written.
function anyOrder(n, out0, stack0) {
  if (out0.length || stack0.length) throw Error("any-order is only defined from the start");
  const permutations = rest => rest.length ? rest.flatMap((x, i) => permutations(rest.filter((_, j) => j !== i)).map(p => [x, ...p])) : [[]];
  return permutations(Array.from({ length: n }, (_, i) => i + 1));
}

// ---------- Labels and canvases ----------
const stateLabel = (out, stack) => out.length || stack.length ? `out [${out.join(",")}] | stack [${stack.join(",")}]` : "start";
const LABEL_PATTERN = "^(?:start|(?!out \\[\\] \\| stack \\[\\]$)out \\[(?:[1-9](?:,[1-9])*)?\\] \\| stack \\[(?:[1-9](?:,[1-9])*)?\\])$";
function reachable(n, out0, stack0) {
  const target = stateLabel(out0, stack0);
  let found = false;
  const visit = (out, stack, next) => {
    if (stateLabel(out, stack) === target) found = true;
    if (found || out.length === n) return;
    if (stack.length) visit([...out, stack.at(-1)], stack.slice(0, -1), next);
    if (next <= n) visit(out, [...stack, next], next + 1);
  };
  visit([], [], 1);
  return found;
}
// The tree of states below (out0, stack0): pop the top first, then push the next number.
function canvas(n, out0 = [], stack0 = [], maxNodes = 9) {
  if (!reachable(n, out0, stack0)) throw Error(`out ${out0} / stack ${stack0} cannot happen for n=${n}`);
  const root = stateLabel(out0, stack0);
  const nodes = [{ id: root, label: root }], edges = [];
  const visit = (out, stack, next) => {
    if (out.length === n) return;
    const moves = [];
    if (stack.length) moves.push([[...out, stack.at(-1)], stack.slice(0, -1), next]);
    if (next <= n) moves.push([out, [...stack, next], next + 1]);
    for (const [childOut, childStack, childNext] of moves) {
      const label = stateLabel(childOut, childStack);
      if (nodes.some(node => node.id === label)) throw Error(`${label} is reached twice: the states must form a tree`);
      nodes.push({ id: label, label });
      edges.push({ from: stateLabel(out, stack), to: label });
      visit(childOut, childStack, childNext);
    }
  };
  visit(out0, stack0, nextNumber(out0, stack0));
  if (nodes.length > maxNodes) throw Error(`n=${n} from ${root}: ${nodes.length} nodes exceeds the cap of ${maxNodes}`);
  const finished = nodes.filter(node => node.label !== "start" && node.label.match(/^out \[([\d,]*)\]/)[1].split(",").filter(Boolean).length === n);
  if (finished.length !== orders(n, null, out0, stack0).length) throw Error("canvas and solver disagree");
  if (!nodes.every(node => new RegExp(LABEL_PATTERN).test(node.label))) throw Error("a canvas label does not match the shown format");
  return { directed: true, nodes, edges };
}

// ---------- Inputs and answer text ----------
const isPartial = (out, stack) => out.length > 0 || stack.length > 0;
const rawInput = (n, out = [], stack = []) => isPartial(out, stack) ? `n=${n}, out=${JSON.stringify(out)}, stack=${JSON.stringify(stack)}` : `n=${n}`;
// Spell out the in-progress state: what is written, what is on the stack, what comes next, and the first node's name.
function partialNote(n, out, stack) {
  const list = values => `[${values.join(", ")}]`;
  const next = out.length + stack.length + 1;
  const stackText = stack.length ? `the stack holds ${list(stack)} (bottom to top)` : "the stack is empty";
  const nextText = next <= n ? `${next} is the next number to push` : "every number has been pushed";
  return `Some moves are already done: out is ${list(out)}, ${stackText}, and ${nextText}. Name your first node "${stateLabel(out, stack)}" and draw only what can still happen from it.`;
}
const inputText = (n, out = [], stack = []) => isPartial(out, stack) ? `${rawInput(n, out, stack)}\n${partialNote(n, out, stack)}` : rawInput(n);
const resultPrompt = (out = [], stack = []) => isPartial(out, stack) ? "Which pop orders can still be finished from this state?" : "Which pop orders are returned?";
const out = value => JSON.stringify(value);
// The pop orders may come in any order; the numbers inside one pop order may not.
const canonical = list => JSON.stringify(list.map(order => JSON.stringify(order)).sort());
const sameList = (a, b) => canonical(a) === canonical(b);
const codeText = order => `\`[${order.join(", ")}]\``;
const listLabel = list => list.length === 0 ? "No pop orders: `[]`" : list.length === 1 ? codeText(list[0]) : list.length === 2 ? `${codeText(list[0])} and ${codeText(list[1])}` : `${list.slice(0, -1).map(codeText).join(", ")}, and ${codeText(list.at(-1))}`;
const count = list => `\`${list.length}\``;

// A two-choice decision whose wrong answer is what the named mistake really returns.
function decision(n, start, prompt, mistake, correctFeedback, bugFeedback, format = listLabel) {
  const [out0, stack0] = start;
  const correct = orders(n, null, out0, stack0), buggy = orders(n, mistake, out0, stack0);
  if (sameList(correct, buggy) || format(correct) === format(buggy)) throw Error(`${mistake} does not change ${rawInput(n, out0, stack0)}`);
  return {
    prompt,
    choices: [
      { id: "correct", label: format(correct), feedback: `Correct. ${correctFeedback}`, misconception: null },
      { id: "bug", label: format(buggy), feedback: bugFeedback, misconception: mistake }
    ],
    correct: "correct"
  };
}
function build(id, title, facet, n, start, mistake, correctFeedback, bugFeedback) {
  return {
    id, title, facet,
    prompt: "Use the raw input to complete the challenge. Then choose the result.",
    input: inputText(n, ...start),
    canvas: canvas(n, ...start),
    decision: decision(n, start, resultPrompt(...start), mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
function remedial(id, title, n, start, mistake, correctFeedback, bugFeedback) {
  return {
    id, title: `Fresh proof · ${title}`,
    prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
    input: inputText(n, ...start),
    canvas: canvas(n, ...start),
    decision: decision(n, start, resultPrompt(...start), mistake, correctFeedback, bugFeedback),
    why: correctFeedback
  };
}
// Each choice's label must be exactly what its mistake (or the correct solver) returns.
function checkChoices(n, start, choices, correctId, format) {
  const truth = format(orders(n, null, ...start));
  for (const choice of choices) {
    const shown = format(choice.id === correctId ? orders(n, null, ...start) : orders(n, choice.misconception, ...start));
    if (shown !== choice.label) throw Error(`${choice.id}: label ${choice.label} but its rule gives ${shown}`);
    if (choice.id !== correctId && shown === truth) throw Error(`${choice.id}: wrong choice equals the correct answer`);
  }
}

const nodeQuestion = {
  prompt: "What is a node in the pop-order tree?",
  correct: "state",
  choices: [
    { id: "state", label: "One state of the run: the numbers written in out so far, plus the numbers on the stack. The start state has both empty.", feedback: "Correct. A node remembers both out and the stack, because together they decide which moves come next.", misconception: null },
    { id: "out-only", label: "Only the numbers written in out so far. States with the same out share a node.", feedback: "Two states can have the same out but different stacks, like `out [1] | stack [2]` and `out [1] | stack [2,3]`. Different moves are possible from each, so each needs its own node.", misconception: "merge-by-out" },
    { id: "number", label: "One node per number from 1 to n.", feedback: "A number is pushed, waits on the stack, and is written down at different moments. A node must remember the whole state: out and the stack.", misconception: "number-as-node" },
    { id: "finished", label: "Only finished pop orders, where all n numbers are written.", feedback: "The states along the way are nodes too. Each finished pop order is reached by a path of moves through them.", misconception: "leaves-only" }
  ]
};
const edgeQuestion = {
  prompt: "When does a state have an edge to another state?",
  correct: "one-move",
  choices: [
    { id: "one-move", label: "When one move leads there: push the next number (if any number is still waiting), or pop the top number into out (if the stack is not empty).", feedback: "Correct. Each edge is one push or one pop, so a state has at most two edges going out.", misconception: null },
    { id: "any-push", label: "When you push any number that has not been pushed yet, or pop the top number into out.", feedback: "Numbers are pushed in order: 1, then 2, then 3. From `out [1,3] | stack [2]` the only number left to push is 4.", misconception: "any-order" },
    { id: "pop-any", label: "When you push the next number, or pop any number in the stack into out.", feedback: "Only the top number can come off the stack: the newest number still on it.", misconception: "pop-bottom" },
    { id: "pop-late", label: "When you push the next number, or pop the top number, but only after every number has been pushed.", feedback: "You may pop as soon as the stack is not empty. Waiting until every number is pushed allows only one order.", misconception: "pop-only-at-end" }
  ]
};

// Picture check: the exact tree, a missing finished state, a missing push, and an illegal pop from the bottom.
const pictureStart = [3, [2], [1]];
const exactPicture = canvas(...pictureStart);
const pictureLabels = {
  finished: stateLabel([2, 1, 3], []), pushed: stateLabel([2], [1, 3]), root: stateLabel([2], [1]), bottomPop: stateLabel([2, 1], [3])
};
const pictureChoices = [
  { id: "exact", label: "Picture A", feedback: "Correct. Every state the moves can reach appears once, with one edge for each push or pop.", misconception: null, model: exactPicture },
  { id: "missing-node", label: "Picture D", feedback: `The state \`${pictureLabels.finished}\` is missing. Popping 3 from \`${pictureLabels.bottomPop}\` writes all three numbers, so that finished state needs its own node.`, misconception: "omit-state",
    model: { ...exactPicture, nodes: exactPicture.nodes.filter(node => node.id !== pictureLabels.finished), edges: exactPicture.edges.filter(edge => edge.to !== pictureLabels.finished) } },
  { id: "missing-edge", label: "Picture B", feedback: `The move push 3 from \`${pictureLabels.root}\` to \`${pictureLabels.pushed}\` is missing.`, misconception: "omit-direct-edge",
    model: { ...exactPicture, edges: exactPicture.edges.filter(edge => edge.to !== pictureLabels.pushed) } },
  { id: "bottom-pop", label: "Picture C", feedback: `\`${pictureLabels.pushed}\` cannot move to \`${pictureLabels.bottomPop}\`: 1 is under 3, so only 3 can be popped there.`, misconception: "pop-bottom",
    model: { ...exactPicture, edges: [...exactPicture.edges, { from: pictureLabels.pushed, to: pictureLabels.bottomPop }] } }
];
if (exactPicture.nodes.map(node => node.id).join() !== [stateLabel([2], [1]), stateLabel([2, 1], []), stateLabel([2, 1], [3]), pictureLabels.finished, pictureLabels.pushed, stateLabel([2, 3], [1]), stateLabel([2, 3, 1], [])].join()) throw Error("picture input drifted");
if (!exactPicture.nodes.some(node => node.id === pictureLabels.bottomPop) || exactPicture.edges.some(edge => edge.from === pictureLabels.pushed && edge.to === pictureLabels.bottomPop)) throw Error("bottom-pop picture must add a new, illegal edge");

const outputQuestion = {
  id: "which-orders", n: 4, start: [[2], [1, 3]],
  prompt: "With n = 4, starting from out `[2]` and stack `[1, 3]`, which pop orders can still be finished?",
  correct: "three",
  choices: [
    { id: "three", feedback: "Correct. Pop 3, pop 1, then push and pop 4 gives `[2, 3, 1, 4]`. Pop 3, push and pop 4, then pop 1 gives `[2, 3, 4, 1]`. Push and pop 4 first, then pop 3 and 1, gives `[2, 4, 3, 1]`.", misconception: null },
    { id: "late", feedback: "This pops only after every number is pushed, so it must push 4 first. Popping 3 right away is allowed too.", misconception: "pop-only-at-end" },
    { id: "empty", feedback: "This stops as soon as the stack is empty. `[2, 3, 1]` has an empty stack, but 4 has not been pushed yet, so it is not finished.", misconception: "stop-when-empty" },
    { id: "one-move", feedback: "This makes only one move from each state, popping whenever it can. Pushing 4 is also allowed while 4 is waiting, and it leads to other orders.", misconception: "one-move-only" }
  ]
};
outputQuestion.choices.forEach(choice => { choice.label = listLabel(orders(outputQuestion.n, choice.misconception, ...outputQuestion.start)); });
checkChoices(outputQuestion.n, outputQuestion.start, outputQuestion.choices, outputQuestion.correct, listLabel);

const countQuestion = {
  id: "how-many", n: 4, start: [[], []],
  prompt: "For n = 4, how many pop orders are returned?",
  correct: "fourteen",
  choices: [
    { id: "fourteen", label: "`14`", feedback: "Correct. 14 of the 24 orderings of 1–4 can be made. An order like `[3, 1, 2, 4]` cannot: when 3 is popped first, 2 is still on top of 1, so 2 must come out before 1.", misconception: null },
    { id: "all", label: "`24`", feedback: "Not every ordering of 1–4 can be made. `[3, 1, 2, 4]` is impossible: after pushing 1, 2, 3 and popping 3, 2 is on top of 1, so 2 must come out before 1.", misconception: "any-order" },
    { id: "one", label: "`1`", feedback: "This counts only `[4, 3, 2, 1]`, as if every number must be pushed before any pop. You may pop as soon as the stack is not empty.", misconception: "pop-only-at-end" },
    { id: "nine", label: "`9`", feedback: "This counts a run as finished whenever the stack is empty, so it includes short lists like `[1]` and `[2, 1]` before the other numbers are pushed.", misconception: "stop-when-empty" }
  ]
};
checkChoices(countQuestion.n, countQuestion.start, countQuestion.choices, countQuestion.correct, count);

const lesson = {
  id: ID,
  facets: ["exact moves and states", "full state identity", "push and pop moves", "finished orders only"],
  buildTasks: [
    build("two-numbers", "Finish only when every number is written", "finished orders only", 2, [[], []], "stop-when-empty",
      "Popping 1 right away empties the stack, but 2 has not been pushed yet. A pop order is finished only when both numbers are in out.",
      "This stops as soon as the stack is empty. After push 1 and pop 1 the stack is empty, but 2 is still waiting, so `[1]` is not a finished pop order."),
    build("pop-early", "Pop before every push is done", "push and pop moves", 3, [[1], []], "pop-only-at-end",
      "From here you can push 2 and pop it right away, or push 3 on top of 2 first. Both `[1, 2, 3]` and `[1, 3, 2]` can be finished.",
      "This pops only after every number has been pushed, so it never pops 2 before pushing 3. Popping 2 right after pushing it is allowed."),
    build("top-comes-off", "Pop the top number", "push and pop moves", 4, [[3], [1, 2, 4]], "pop-bottom",
      "Every number has been pushed, so only pops are left. Each pop takes the top number: 4, then 2, then 1.",
      "This takes the number at the bottom of the stack first. A pop always takes the top number, the newest number still on the stack."),
    build("both-moves", "Try both moves", "exact moves and states", 4, [[2, 1], [3]], "one-move-only",
      "Both moves are allowed here: pop 3, or push 4 first. Each move starts its own branch, so both `[2, 1, 3, 4]` and `[2, 1, 4, 3]` are finished.",
      "This makes only one move from each state: it pops whenever it can. Pushing 4 before popping 3 is also allowed, and it leads to `[2, 1, 4, 3]`.")
  ],
  conceptTasks: [
    {
      id: "concept-picture", title: "Match every input detail", facet: "exact moves and states", kind: "visual-options",
      prompt: "Which picture exactly matches this raw input?", input: inputText(...pictureStart),
      choices: pictureChoices, correct: "exact", why: "Every state the moves can reach appears once, with one edge for each push or pop.",
      remedial: remedial("repair-1", "Match every input detail", 4, [[1, 2], [3]], "one-move-only",
        "Both moves are possible here: pop 3, or push 4. Each move starts its own branch, so `[1, 2, 3, 4]` and `[1, 2, 4, 3]` are both finished.",
        "This makes only one move from each state, popping whenever it can. Pushing 4 before popping 3 is also allowed, and it leads to `[1, 2, 4, 3]`.")
    },
    {
      id: "concept-nodes", title: "Protect entity identity", facet: "full state identity", kind: "choice",
      prompt: nodeQuestion.prompt, input: inputText(3, [1], [2]), shownModel: canvas(3, [1], [2]),
      choices: nodeQuestion.choices, correct: nodeQuestion.correct, why: nodeQuestion.choices[0].feedback,
      remedial: remedial("repair-2", "Protect entity identity", 4, [[2, 3], [1]], "stop-when-empty",
        "After 1 is popped, out is `[2, 3, 1]` and the stack is empty, but 4 has not been pushed yet. That state is a step along the way. Only `[2, 3, 1, 4]` and `[2, 3, 4, 1]` are finished.",
        "This treats the empty stack after popping 1 as finished, so it returns `[2, 3, 1]`, which is missing 4.")
    },
    {
      id: "concept-relations", title: "Protect direct relations", facet: "push and pop moves", kind: "choice",
      prompt: edgeQuestion.prompt, input: inputText(4, [1, 3], [2]), shownModel: canvas(4, [1, 3], [2]),
      choices: edgeQuestion.choices, correct: edgeQuestion.correct, why: edgeQuestion.choices[0].feedback,
      remedial: remedial("repair-3", "Protect direct relations", 3, [[], [1, 2, 3]], "pop-bottom",
        "All three numbers are on the stack and 3 is on top. Each pop takes the top number: 3, then 2, then 1.",
        "This pops the bottom number first. A pop always takes the top number, the newest number still on the stack.")
    },
    {
      id: "concept-output", title: "Predict from a fresh input", facet: "finished orders only", kind: "choice",
      prompt: outputQuestion.prompt, input: inputText(outputQuestion.n, ...outputQuestion.start),
      choices: outputQuestion.choices, correct: outputQuestion.correct, why: outputQuestion.choices[0].feedback,
      remedial: remedial("repair-4", "Predict from a fresh input", 4, [[3, 2], [1]], "pop-only-at-end",
        "1 is on top, so you may pop it now, before pushing 4. That gives `[3, 2, 1, 4]`. Pushing 4 first gives `[3, 2, 4, 1]`.",
        "This pops only after every number has been pushed. Popping 1 before pushing 4 is allowed too, and it gives `[3, 2, 1, 4]`.")
    },
    {
      id: "concept-bug", title: "Catch a near-miss implementation", facet: "finished orders only", kind: "choice",
      prompt: countQuestion.prompt, input: inputText(countQuestion.n),
      choices: countQuestion.choices, correct: countQuestion.correct, why: countQuestion.choices[0].feedback,
      remedial: remedial("repair-5", "Catch a near-miss implementation", 4, [[1, 2], []], "stop-when-empty",
        "The stack is empty, but 3 and 4 have not been pushed yet. Pushing and popping them gives `[1, 2, 3, 4]` and `[1, 2, 4, 3]`.",
        "This treats the empty stack as finished, so it returns `[1, 2]` before 3 and 4 are ever pushed.")
    }
  ],
  // Step 3 inputs: the full tree for n = 1 and four runs already in progress.
  structureTasks: [[1, [], []], [3, [], [1, 2]], [4, [4], [1, 2, 3]], [4, [2, 1], []], [4, [], [1, 2, 3]]]
    .map(([n, start, stack], index) => ({ id: `transfer-${index + 1}`, input: rawInput(n, start, stack), canvas: canvas(n, start, stack, 24) })),
  practicePlan: { version: "short-v1", step1: ["two-numbers", "concept-nodes", "pop-early", "concept-relations", "concept-output"], step3: [0, 1, 4] }
};
{ // Every Step 1 and Step 3 input is a different state, and every partial state can really happen.
  const inputs = [...lesson.buildTasks, ...lesson.conceptTasks, ...lesson.conceptTasks.map(task => task.remedial), ...lesson.structureTasks].map(task => task.input.split("\n")[0]);
  if (new Set(inputs).size !== inputs.length) throw Error("an input state repeats");
}

const visualSpec = {
  id: ID,
  visualKind: "backtracking",
  pictureQuestions: [outputQuestion, countQuestion].map(({ id, n, start, prompt, correct, choices }) => ({ id, input: isPartial(...start) ? `n = ${n}, out = ${JSON.stringify(start[0])}, stack = ${JSON.stringify(start[1])}` : `n = ${n}`, prompt, correct, choices })),
  nodeQuestion, edgeQuestion,
  nodeLabelFormat: {
    instruction: "Use `start` for the state before any move. Name every other state `out [...] | stack [...]`: first the numbers written in out so far, then the numbers on the stack from bottom to top. Example: `out [2] | stack [1,3]` means 2 has been written down, and 3 sits on top of 1. Write an empty list as `[]`, as in `out [2,3,1] | stack []`. When the input gives out and stack, your drawing starts from that state.",
    pattern: LABEL_PATTERN,
    showExactLabels: false
  },
  membershipClaim: { misconception: "leaves-only", no: "only finished pop orders should become nodes.", yes: "Every state of the run, finished or not, should have its own node." },
  practicePlan: lesson.practicePlan
};

const MISTAKEN_START = stateLabel([1], []);
const step2Spec = {
  id: ID,
  vocabulary: { nodeNames: "states", startNode: "start state", edges: "moves", correctSearch: "states reached", mistakenSearch: "states the flawed search reaches" },
  rounds: [
    { bugs: ["shallow-search"], level: "One move only", presentation: "exact-difference", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["last-branch"], level: "Last move only", presentation: "predict-first", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start" },
    { bugs: ["wrong-start"], level: "Starts after 1 is popped", presentation: "repair-case", goal: "Create a valid input where the mistaken search returns a different answer from the correct solution.", startLabel: "start", mistakenStartLabel: MISTAKEN_START }
  ],
  nodeLabels: { rule: "stack-state", description: "Use start for the first state, then out [...] | stack [...] like out [2] | stack [1,3]." },
  fixedStart: "start",
  input: {
    name: "start state", prompt: "Choose the start state", result: "generated-terminal-strings", resultLabel: "all pop orders",
    fields: [
      { id: "n", kind: "integer", label: "n", prompt: "Choose n", required: true, min: 1, max: 3 }
    ]
  }
};
{ // Each Step 2 mistake must change the answer for a small n the student can draw.
  const fromState = (n, out0, stack0) => orders(n, null, out0, stack0);
  const lastBranch = n => { let out = [], stack = []; while (out.length < n) { const next = nextNumber(out, stack); if (next <= n) stack = [...stack, next]; else { out = [...out, stack.at(-1)]; stack = stack.slice(0, -1); } } return [out]; };
  if (sameList(fromState(2, [], []), lastBranch(2))) throw Error("last-branch does not change n=2");
  if (sameList(fromState(2, [], []), fromState(2, [1], []))) throw Error("wrong-start does not change n=2");
  if (!reachable(2, [1], [])) throw Error("the mistaken start must exist for n=2");
}

// ---------- Step 4: three single-bug programs, outputs taken from running them ----------
const step4Base = `function solve(input) {
  const orders = [];
  function build(out, stack, next) {
    if (out.length === input.n) {
      orders.push(out);
      return;
    }
    if (stack.length > 0) {
      build([...out, stack[stack.length - 1]], stack.slice(0, -1), next);
    }
    if (next <= input.n) {
      build(out, [...stack, next], next + 1);
    }
  }
  build([], [], 1);
  return orders;
}`;
const swap = (from, to) => {
  if (!step4Base.includes(from)) throw Error(`Step 4 base code is missing ${from}`);
  return step4Base.replace(from, to);
};
function step4Case(caseId, bugTitle, misconception, n, code, correctDiagnosis, diagnoses, graphProof) {
  const buggy = new Function(`${code}\nreturn solve;`)()({ n });
  const correct = orders(n);
  if (sameList(buggy, correct)) throw Error(`${caseId}: input does not expose the bug`);
  if (!sameList(buggy, orders(n, misconception))) throw Error(`${caseId}: program and named mistake disagree`);
  return { id: ID, caseId, bugTitle, misconception, input: { n }, code, canvas: canvas(n, [], [], 22), outputFormat: "list of every pop order",
    buggyOutput: out(buggy), correctOutput: out(correct), correctDiagnosis, diagnoses, graphProof };
}
const step4Spec = {
  id: ID,
  cases: [
    step4Case("authored-deep-case", "Stops When the Stack Is Empty", "stop-when-empty", 2, swap("if (out.length === input.n) {", "if (stack.length === 0 && out.length > 0) {"), "stops-on-empty", [
      { id: "stops-on-empty", label: "Claim about the code: it saves out as soon as the stack is empty, so after push 1 and pop 1 it saves [1] before 2 is ever pushed.", feedback: "Correct. A pop order is finished only when all n numbers are in out, so check out.length === input.n." },
      { id: "pops-late", label: "Claim about the code: it pops only after every number has been pushed.", feedback: "The pop runs whenever the stack is not empty, before any later push." },
      { id: "push-off-by-one", label: "Claim about the code: it never pushes the last number, n.", feedback: "The push runs while next <= input.n, so n is pushed too." }
    ], {
      realGraph: "For n = 2 the tree is start → out [] | stack [1], which branches to out [1] | stack [] (pop 1) and out [] | stack [1,2] (push 2). The finished states are out [1,2] | stack [] and out [2,1] | stack [].",
      codeRule: "A state counts as finished as soon as its stack is empty and out is not empty.",
      separatingFeature: "out [1] | stack [] has an empty stack, but 2 has not been pushed yet.",
      outputConsequence: "The code returns [[1],[2,1]] instead of [[1,2],[2,1]].",
      changedGraph: "The branch below out [1] | stack [] is cut off, and that unfinished state is saved as an answer."
    }),
    step4Case("pop-only-at-end", "Pops Only After Every Push", "pop-only-at-end", 3, swap("if (stack.length > 0) {", "if (stack.length > 0 && next > input.n) {"), "pops-late", [
      { id: "pops-late", label: "Claim about the code: it pops only when next > input.n, so every number is pushed before the first pop and only [3,2,1] is saved.", feedback: "Correct. A pop is allowed whenever the stack is not empty, so remove the next > input.n condition." },
      { id: "stops-on-empty", label: "Claim about the code: it saves a pop order whenever the stack is empty.", feedback: "It saves out only when out.length === input.n." },
      { id: "push-off-by-one", label: "Claim about the code: it never pushes the last number, n.", feedback: "The push runs while next <= input.n, so n is pushed too." }
    ], {
      realGraph: "For n = 3 the tree has 22 states. Five of them are finished, one for each pop order.",
      codeRule: "A pop is tried only after every number has been pushed.",
      separatingFeature: "From out [] | stack [1], the pop edge to out [1] | stack [] is never followed.",
      outputConsequence: "The code returns [[3,2,1]] instead of [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1]].",
      changedGraph: "Only the path that pushes 1, 2, 3 and then pops three times is left."
    }),
    step4Case("push-limit", "Never Pushes n Itself", "push-limit", 1, swap("if (next <= input.n) {", "if (next < input.n) {"), "push-off-by-one", [
      { id: "push-off-by-one", label: "Claim about the code: next < input.n is false when next = n, so the last number is never pushed and no pop order is ever finished.", feedback: "Correct. The next number may be pushed while next <= input.n, including n itself." },
      { id: "pops-late", label: "Claim about the code: it pops only after every number has been pushed.", feedback: "The pop runs whenever the stack is not empty." },
      { id: "stops-on-empty", label: "Claim about the code: it saves a pop order whenever the stack is empty.", feedback: "It saves out only when out.length === input.n." }
    ], {
      realGraph: "For n = 1 the tree is start → out [] | stack [1] → out [1] | stack [].",
      codeRule: "A push happens only while next < n, so the number n is never pushed.",
      separatingFeature: "With n = 1, next starts at 1, and 1 < 1 is false, so even the first push is skipped.",
      outputConsequence: "The code returns [] instead of [[1]].",
      changedGraph: "The edge start → out [] | stack [1] is missing, so no other state is reached."
    })
  ]
};

// ---------- Source problem ----------
const solution = `// CONTRACT for collectOrders(n, out, stack, next, orders):
//     \`out\` holds the numbers written down so far, \`stack\` holds the
//     pushed numbers that are not written yet (bottom to top), and \`next\`
//     is the next number to push. When this call returns, every pop order
//     that can still be finished from this state has been appended to
//     \`orders\`.
const collectOrders = (n, out, stack, next, orders) => {
    // Base case: all n numbers are in out, so this pop order is finished.
    // An empty stack alone is not enough: some numbers may not have been
    // pushed yet.
    if (out.length === n) {
        orders.push(out);
        return;
    }

    // Traverse neighbors: there are at most two moves.
    // Move 1, pop: take the top number off the stack and write it in out.
    if (stack.length > 0) {
        const top = stack[stack.length - 1];
        // The recursive leap of faith, one level down: this call has the
        // SAME contract, so when it returns, every order that can be
        // finished after this pop is in \`orders\`. Trust it, do not trace
        // it. It gets new arrays, so it cannot change this call's state.
        collectOrders(n, [...out, top], stack.slice(0, -1), next, orders);
    }

    // Move 2, push: put the next number on top of the stack.
    if (next <= n) {
        // Leap of faith again: trust this call to collect every order
        // that can be finished after this push.
        collectOrders(n, out, [...stack, next], next + 1, orders);
    }
};

const popOrders = (n) => {
    const orders = [];

    // The recursive leap of faith: trust the contract. Starting with
    // nothing written, an empty stack, and 1 as the next number collects
    // every pop order.
    collectOrders(n, [], [], 1, orders);

    return orders;
};`;
const statement = [
  "A **stack** is a pile of numbers that only changes at its **top**: the top is the newest number still in the pile. To **push** a number means to put it on top of the stack. To **pop** means to take the top number off.",
  "You are given a whole number `n`. Start with an empty stack and an empty list called `out`. The numbers 1, 2, …, `n` must be pushed in that order. At each step, you may make either move:",
  "• **push**: put the next number on the stack, if some numbers have not been pushed yet.\n• **pop**: take the top number off the stack and write it at the end of `out`, if the stack is not empty.",
  "When all `n` numbers are in `out`, the list `out` is one **pop order**. Return a list of **all** possible pop orders. You may return them in any order.",
  "One run for `n = 3` (the stack is listed from bottom to top):\n1. push 1 → out `[]`, stack `[1]`\n2. push 2 → out `[]`, stack `[1, 2]`\n3. pop → 2 comes off the top: out `[2]`, stack `[1]`\n4. push 3 → out `[2]`, stack `[1, 3]`\n5. pop → 3 comes off the top: out `[2, 3]`, stack `[1]`\n6. pop → 1 comes off: out `[2, 3, 1]`, stack `[]`\nAll three numbers are in `out`, so `[2, 3, 1]` is a pop order."
].join("\n\n");
{ // The worked run in the statement must be a real run.
  let runOut = [], runStack = [], next = 1;
  for (const move of ["push", "push", "pop", "push", "pop", "pop"]) {
    if (move === "push") runStack = [...runStack, next++];
    else { runOut = [...runOut, runStack.at(-1)]; runStack = runStack.slice(0, -1); }
  }
  if (JSON.stringify([runOut, runStack]) !== "[[2,3,1],[]]" || !orders(3).some(order => JSON.stringify(order) === "[2,3,1]")) throw Error("the statement's worked run drifted");
}
const examples = [
  { n: 1, explanation: "Push 1, then pop 1." },
  { n: 2, explanation: "Pop 1 before pushing 2 to get `[1, 2]`. Push both numbers first, then pop twice, to get `[2, 1]`." },
  { n: 3, explanation: "`[3, 1, 2]` is missing because it is impossible: to pop 3 first, 1 and 2 must already be on the stack, with 2 on top of 1. So 2 comes off before 1." }
];
const sourceProblem = {
  id: ID,
  title: "Stack Pop Orders",
  category: "variant",
  parentId: "letter-combinations-of-a-phone-number",
  parentTitle: "Letter Combinations of a Phone Number",
  followsUp: "balanced-brackets",
  difficulty: "Hard",
  twist: "Instead of choosing one letter for each position, every step chooses between two moves, push or pop, and a branch must remember both the numbers written so far and the stack.",
  statement,
  examples: examples.map(({ n, explanation }) => ({ input: `n = ${n}`, output: out(orders(n)), explanation })),
  constraints: ["1 <= n <= 5"],
  functionName: "popOrders",
  solution,
  tests: examples.map(({ n }) => ({ args: [n], expected: orders(n), unordered: true }))
};
{ // The reference JavaScript must agree with the solver, and the examples must say what we think.
  const reference = new Function(`${solution}\nreturn popOrders;`)();
  for (let n = 1; n <= 5; n++) if (out(reference(n)) !== out(orders(n))) throw Error(`reference solution disagrees for n=${n}`);
  if ([1, 2, 3, 4, 5].map(n => orders(n).length).join() !== "1,2,5,14,42") throw Error("pop-order counts drifted");
  if (sourceProblem.examples.map(example => example.output).join(" ") !== "[[1]] [[1,2],[2,1]] [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1]]") throw Error("statement examples drifted");
  if (orders(3).some(order => order.join() === "3,1,2")) throw Error("[3,1,2] must be impossible");
  for (const testCase of step4Spec.cases) if (testCase.correctOutput !== out(reference(testCase.input.n))) throw Error("Step 4 output order must match the reference");
}

// ---------- Write every file ----------
files.writeSource("variants-final-9.json", sourceProblem);
files.upsert("visual-specs-variant.json", visualSpec);
files.upsert("visual-lessons-variant.json", lesson);
files.upsert("step2-specs-variant.json", step2Spec);
files.upsert("step4-specs-variant.json", step4Spec);
files.publish(sourceProblem, ["n"]);
files.placeInOrder(ID, "Hardest of the group: each step chooses push or pop, and a branch carries both the written numbers and the stack.", { after: "the-balance-lock" });
// Step 5 oracle fixtures: n has only five allowed values, so cover each one.
files.setFixtures(ID, [1, 2, 3, 4, 5].map(n => ({ input: { n }, expected: orders(n) })));
module.exports = { orders, stateLabel };
if (require.main === module) console.log(`Authored ${ID}: ${lesson.buildTasks.length} builds, ${lesson.conceptTasks.length} checks, ${lesson.structureTasks.length} structure graphs.`);
