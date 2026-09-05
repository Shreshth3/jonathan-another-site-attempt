const fs = require("fs");
const vm = require("vm");

const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const files = {
  lessons: ["visual-lessons-original.json", "visual-lessons-variant.json", "visual-lessons-new.json"],
  visualSpecs: ["visual-specs-original.json", "visual-specs-variant.json", "visual-specs-new.json"],
  step2: ["step2-specs-original.json", "step2-specs-variant.json", "step2-specs-new.json"],
  step4: ["step4-specs-original.json", "step4-specs-variant.json", "step4-specs-new.json"]
};

function findProblem(groups, id) {
  for (const group of groups) {
    const found = group.find(problem => problem.id === id);
    if (found) return found;
  }
  throw new Error(`Missing problem: ${id}`);
}

function relabelCanvas(canvas, labelsById) {
  for (const node of canvas.nodes) {
    const label = labelsById[String(node.id)];
    if (label !== undefined) node.label = label;
  }
}

const lessonGroups = files.lessons.map(read);

function lessonGraphTasks(problem) {
  return [...problem.buildTasks, ...problem.conceptTasks.map(task => task.remedial).filter(Boolean)];
}

for (const group of lessonGroups) for (const problem of group) {
  // Rule checks still need a concrete input for the optional scratch drawing.
  const duplicateConcepts = problem.conceptTasks.filter(task => task.input.trim() === task.prompt.trim());
  duplicateConcepts.forEach((task, index) => { task.input = problem.buildTasks[(index + 2) % problem.buildTasks.length].input; });

  // If the question names an exact fresh case, show that same case above the scratch pad.
  for (const task of problem.conceptTasks) {
    const snippets = [...task.prompt.matchAll(/`([^`]+)`/g)].map(match => match[1]);
    if (snippets.length && !snippets.some(snippet => task.input.includes(snippet))) task.input = snippets.join("; ");
  }


}

function jugCanvas(firstCapacity, secondCapacity) {
  const start = [0, 0];
  const queue = [start];
  const seen = new Map([[start.join(","), start]]);
  const edgeKeys = new Set();
  const edges = [];
  const moves = ([a, b]) => {
    const toSecond = Math.min(a, secondCapacity - b);
    const toFirst = Math.min(b, firstCapacity - a);
    return [[firstCapacity, b], [a, secondCapacity], [0, b], [a, 0], [a - toSecond, b + toSecond], [a + toFirst, b - toFirst]];
  };
  while (queue.length) {
    const state = queue.shift();
    const from = state.join(",");
    for (const next of moves(state)) {
      const to = next.join(",");
      if (to === from) continue;
      const edgeKey = `${from}>${to}`;
      if (!edgeKeys.has(edgeKey)) {
        edgeKeys.add(edgeKey);
        edges.push({ from, to });
      }
      if (!seen.has(to)) {
        seen.set(to, next);
        queue.push(next);
      }
    }
  }
  return {
    directed: true,
    nodes: [...seen.keys()].map(id => ({ id, label: `(${id})` })),
    edges
  };
}

function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }

// Use one complete, stated jug-state model everywhere. Small capacities keep it drawable.
const waterJug = findProblem(lessonGroups, "water-and-jug-problem");
const jugCases = [[1, 2, 1], [2, 2, 1], [1, 3, 2], [2, 2, 4], [1, 2, 2], [1, 3, 3], [2, 2, 3], [1, 2, 3], [1, 3, 4]];
lessonGraphTasks(waterJug).forEach((task, index) => {
  const [first, second, target] = jugCases[index];
  task.title = `Measure ${target} liter${target === 1 ? "" : "s"} with ${first}- and ${second}-liter jugs`;
  task.input = `jug1Capacity = ${first}, jug2Capacity = ${second}, targetCapacity = ${target}`;
  task.canvas = jugCanvas(first, second);
  const answer = target <= first + second && target % gcd(first, second) === 0;
  const correctChoice = task.decision.choices.find(choice => String(choice.label).replace(/`/g, "").trim().toLowerCase() === String(answer));
  if (correctChoice) {
    task.decision.correct = correctChoice.id;
    correctChoice.misconception = null;
    correctChoice.feedback = `Correct. Legal jug moves ${answer ? "can" : "cannot"} measure ${target} liter${target === 1 ? "" : "s"}.`;
    for (const choice of task.decision.choices) if (choice !== correctChoice) {
      if (!choice.misconception) choice.misconception = "misreads-jug-reachability";
      choice.feedback = `That answer does not match the complete legal-move graph for capacities ${first} and ${second}.`;
    }
  }
  task.why = `The complete reachable-state graph shows that ${target} liter${target === 1 ? " is" : "s are"} ${answer ? "reachable" : "not reachable"}.`;
});
const jugPicture = waterJug.conceptTasks.find(task => task.id === "exact-picture");
jugPicture.input = "jug1Capacity = 2, jug2Capacity = 2, targetCapacity = 2";
const exactJugCanvas = jugCanvas(2, 2);
const cloneCanvas = canvas => JSON.parse(JSON.stringify(canvas));
const exactJugChoice = jugPicture.choices.find(choice => choice.id === "exact");
exactJugChoice.model = cloneCanvas(exactJugCanvas);
const missingJugEdge = cloneCanvas(exactJugCanvas);
missingJugEdge.edges.pop();
jugPicture.choices.find(choice => choice.id === "missing-edge").model = missingJugEdge;
const wrongJugRelation = cloneCanvas(exactJugCanvas);
wrongJugRelation.edges.shift();
wrongJugRelation.edges.push({ from: "0,0", to: "2,2" });
jugPicture.choices.find(choice => choice.id === "wrong-relation").model = wrongJugRelation;
const missingJugNode = cloneCanvas(exactJugCanvas);
const removedJugNode = missingJugNode.nodes.pop().id;
missingJugNode.edges = missingJugNode.edges.filter(edge => edge.from !== removedJugNode && edge.to !== removedJugNode);
jugPicture.choices.find(choice => choice.id === "missing-node").model = missingJugNode;

// Word Search always uses every board cell with an undirected side-neighbor edge.
const wordSearch = findProblem(lessonGroups, "word-search");
for (const task of lessonGraphTasks(wordSearch)) {
  const sandbox = {};
  vm.runInNewContext(`${task.input.replace(/,\s*(?=word\s*=)/, "; ")}; globalThis.value = board;`, sandbox);
  const board = sandbox.value;
  const nodes = [];
  const edges = [];
  for (let row = 0; row < board.length; row++) for (let column = 0; column < board[row].length; column++) {
    const id = `${row},${column}`;
    nodes.push({ id, label: `(${id})` });
    if (column + 1 < board[row].length) edges.push({ from: id, to: `${row},${column + 1}` });
    if (row + 1 < board.length && column < board[row + 1].length) edges.push({ from: id, to: `${row + 1},${column}` });
  }
  task.canvas = { directed: false, nodes, edges };
}
const wordPicture = wordSearch.conceptTasks.find(task => task.id === "exact-picture");
const wordNodes = [
  { id: "0,0=A", label: "(0,0)" }, { id: "0,1=B", label: "(0,1)" },
  { id: "1,0=D", label: "(1,0)" }, { id: "1,1=C", label: "(1,1)" }
];
const wordEdges = [
  { from: "0,0=A", to: "0,1=B" }, { from: "0,0=A", to: "1,0=D" },
  { from: "0,1=B", to: "1,1=C" }, { from: "1,0=D", to: "1,1=C" }
];
const wordExactCanvas = { directed: false, nodes: wordNodes, edges: wordEdges };
wordPicture.choices.find(choice => choice.id === "exact").model = cloneCanvas(wordExactCanvas);
const wordMissingEdge = cloneCanvas(wordExactCanvas); wordMissingEdge.edges.pop();
wordPicture.choices.find(choice => choice.id === "missing-edge").model = wordMissingEdge;
const wordWrongRelation = cloneCanvas(wordExactCanvas); wordWrongRelation.edges.pop(); wordWrongRelation.edges.push({ from: "0,0=A", to: "1,1=C" });
wordPicture.choices.find(choice => choice.id === "wrong-relation").model = wordWrongRelation;
const wordMissingNode = cloneCanvas(wordExactCanvas); wordMissingNode.nodes.pop(); wordMissingNode.edges = wordMissingNode.edges.filter(edge => edge.from !== "1,1=C" && edge.to !== "1,1=C");
wordPicture.choices.find(choice => choice.id === "missing-node").model = wordMissingNode;

// Make every answer choice a complete conclusion, not a stray true fact.
const bipartite = findProblem(lessonGroups, "is-graph-bipartite");
for (const task of bipartite.conceptTasks) for (const choice of task.choices) {
  if (choice.id === "false-diagonal") choice.label = "return false because nodes 0 and 2 share a path";
}
const rooms = findProblem(lessonGroups, "keys-and-rooms");
rooms.conceptTasks.find(task => task.id === "relation-rule").input = "rooms = [[1],[]]";
for (const task of rooms.conceptTasks) for (const choice of task.choices) {
  if (choice.id === "false-direct") choice.label = "return false because room 0 lacks direct keys to rooms 2 and 3";
  if (choice.id === "false-return") choice.label = "return false because there is no key back to room 0";
}
const provincesLesson = findProblem(lessonGroups, "number-of-provinces");
provincesLesson.conceptTasks.find(task => task.id === "core-rule").input = "isConnected = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]";
for (const task of waterJug.conceptTasks) for (const choice of task.choices) {
  choice.label = choice.label.replace(/^return\s+(?:true|false)\s+because\s+/i, "");
  if (["predict-output", "bug-trap"].includes(task.id)) {
    const result = /^true/i.test(choice.id) ? "true" : "false";
    choice.label = `return ${result} because ${choice.label.charAt(0).toLowerCase()}${choice.label.slice(1)}`;
  }
}
const waterCore = waterJug.conceptTasks.find(task => task.id === "core-rule");
for (const choice of waterCore.choices) choice.label = choice.label.replace("capacity 3 and one node for capacity 5", "capacity 1 and one node for capacity 3");

// Verified wrong graph: C cannot reach B because its radius is only 1.
const bombs = findProblem(lessonGroups, "detonate-the-maximum-bombs");
for (const task of [...bombs.buildTasks, ...bombs.conceptTasks.map(task => task.remedial)]) {
  if (!task?.input?.includes("[[0,0,1],[1,0,4],[5,0,1]]")) continue;
  task.canvas.edges = task.canvas.edges.filter(edge => !(["2", "C"].includes(String(edge.from)) && ["1", "B"].includes(String(edge.to))));
}
const bombTopologyCase = bombs.conceptTasks[4].remedial;
bombTopologyCase.input = "bombs = [[0,0,3],[2,0,1],[6,0,1]]";
bombTopologyCase.canvas = {
  directed: true,
  nodes: ["A", "B", "C"].map(label => ({ id: label, label })),
  edges: [{ from: "A", to: "B" }]
};
const bombTwo = bombTopologyCase.decision.choices.find(choice => String(choice.label).trim() === "2");
if (bombTwo) {
  bombTopologyCase.decision.correct = bombTwo.id;
  bombTwo.misconception = null;
  bombTwo.feedback = "Correct. Bomb A reaches B, but neither B nor C can continue the chain.";
  for (const choice of bombTopologyCase.decision.choices) if (choice !== bombTwo && !choice.misconception) choice.misconception = "invents-extra-blast-edge";
}
bombTopologyCase.why = "Only A→B exists, so the largest detonation reaches 2 bombs.";

const flooded = findProblem(lessonGroups, "flooded-campsite-trails");
for (const task of lessonGraphTasks(flooded)) {
  const match = task.input.match(/flooded\s*=\s*(\[[^\]]*\])/);
  const blocked = new Set(match ? JSON.parse(match[1]) : []);
  for (const node of task.canvas.nodes) node.blocked = blocked.has(Number(node.label));
}

const inform = findProblem(lessonGroups, "time-needed-to-inform-all-employees");
for (const task of inform.conceptTasks) if (task.input.includes("informTime = [4]")) {
  task.input = task.input.replace("informTime = [4]", "informTime = [0]");
  task.why = "The only employee is the head and has no reports, so everyone is informed after 0 minutes.";
  for (const choice of task.choices) {
    if (choice.id === task.correct) choice.feedback = `Correct. ${task.why}`;
    else choice.feedback = "A head with no reports has no one else to inform, so the total time is 0.";
  }
}

const busiest = findProblem(lessonGroups, "busiest-shelf-level");
const fixTieText = value => typeof value === "string"
  ? value
      .replace(/contains (\d+) integer items?, more than any other depth; ties favor shallower depth/gi, (_, count) => `contains ${count} integer ${count === "1" ? "item" : "items"}; when counts tie, the shallower depth wins`)
      .replace(/has more items than any other depth/gi, "is the earliest depth tied for the largest item count")
  : value;
for (const task of lessonGraphTasks(busiest)) {
  task.why = fixTieText(task.why);
  for (const choice of task.decision.choices) choice.feedback = fixTieText(choice.feedback);
}

for (const task of waterJug.conceptTasks) if (task.id === "core-rule") {
  task.prompt = "What should one node in this jug-search graph record?";
  task.input = "jug1Capacity = 1, jug2Capacity = 3, targetCapacity = 2";
}

const gridPath = findProblem(lessonGroups, "gfg-grid-path-exists");
const gridPredict = gridPath.conceptTasks.find(task => task.id === "predict-output");
gridPredict.choices.find(choice => choice.id === "wrong-2").label = "return false because only diagonal moves could connect the route";
gridPredict.choices.find(choice => choice.id === "wrong-3").label = "return false because cells marked 3 cannot be intermediate steps";
const gridTrap = gridPath.conceptTasks.find(task => task.id === "bug-trap");
gridTrap.choices.find(choice => choice.id === "wrong-1").label = "return true because the lower 3 region touches the destination";
gridTrap.choices.find(choice => choice.id === "wrong-2").label = "return true because diagonal movement connects the source to the route";
gridTrap.choices.find(choice => choice.id === "wrong-3").label = "return true because the source is on an edge";

const findPath = findProblem(lessonGroups, "find-if-path-exists-in-graph");
const findPathTrap = findPath.conceptTasks.find(task => task.id === "bug-trap");
findPathTrap.input = "n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5";
findPathTrap.prompt = "Can source 0 reach destination 5 in this graph?";

const bipartiteLesson = findProblem(lessonGroups, "is-graph-bipartite");
const bipartiteTrap = bipartiteLesson.conceptTasks.find(task => task.id === "bug-trap");
const bipartiteCorrect = bipartiteTrap.choices.find(choice => choice.id === bipartiteTrap.correct);
bipartiteCorrect.label = "two colors cannot satisfy the triangle 0—1—2";
bipartiteCorrect.feedback = "Correct. The three edges in triangle 0—1—2 force a same-color conflict.";
bipartiteTrap.why = "The odd triangle 0—1—2 cannot be split into two valid color groups.";

const divisionLesson = findProblem(lessonGroups, "evaluate-division");
const divisionFeedback = {
  "exact-picture": "The query is m/n, so it follows the forward m→n edge with weight 5, not the reverse edge.",
  "core-rule": "The query variables are in separate components, so no path exists and their values cannot be multiplied together.",
  "relation-rule": "Reverse travel uses reciprocal weights, so r/q/p gives 1/10, not 10.",
  "predict-output": "Ratios along the path multiply: 2×3×4 = 24; adding them gives the wrong result.",
  "bug-trap": "The variables are connected by reciprocal edges, so the reverse query returns 1/6 rather than -1."
};
for (const task of divisionLesson.conceptTasks) {
  const wrong = task.remedial?.decision.choices.find(choice => choice.id === "near-miss");
  if (wrong && divisionFeedback[task.id]) wrong.feedback = divisionFeedback[task.id];
}

const increasingLesson = findProblem(lessonGroups, "longest-increasing-path-in-a-matrix");
const increasingTrap = increasingLesson.conceptTasks.find(task => task.id === "bug-trap");
increasingTrap.choices.find(choice => choice.id === "23456").feedback = "That sequence needs at least one diagonal jump; no choice of those 2 and 3 cells makes every step share a side.";
increasingTrap.remedial.decision.choices.find(choice => choice.id === "near-miss").feedback = "That counts the two arrows instead of the three cells on the longest path.";
const increasingPrediction = increasingLesson.conceptTasks.find(task => task.id === "predict-output");
increasingPrediction.prompt = "For `[[9,9,4],[6,6,8],[2,1,1]]`, what is the longest increasing-path length?";
for (const choice of increasingPrediction.choices) if (!/cells$/i.test(choice.label)) choice.label = `${choice.label} cells`;

const minesLesson = findProblem(lessonGroups, "minesweeper");
const minesRelation = minesLesson.conceptTasks.find(task => task.id === "relation-rule").remedial;
const minesWrong = minesRelation.decision.choices.find(choice => choice.id === "near-miss");
minesWrong.label = "only the clicked cell becomes B";
minesWrong.feedback = "That stops after the first blank instead of continuing through all eight neighboring directions.";
minesWrong.misconception = "stop-after-first-blank";

const allPathsLesson = findProblem(lessonGroups, "all-paths-from-source-to-target");
const allPathsRelation = allPathsLesson.conceptTasks.find(task => task.id === "relation-rule").remedial;
const allPathsWrong = allPathsRelation.decision.choices.find(choice => choice.id === "near-miss");
allPathsWrong.label = "[[0]]";
allPathsWrong.feedback = "That treats the source alone as a complete path, but a returned path must end at target node 2.";
allPathsWrong.misconception = "treat-source-as-target";

const nestedWeightLesson = findProblem(lessonGroups, "nested-list-weight-sum");
const nestedMixed = nestedWeightLesson.buildTasks.find(task => task.id === "build-mixed");
const nestedDepthWrong = nestedMixed.decision.choices.find(choice => choice.id === "near-miss");
nestedDepthWrong.label = "4";
nestedDepthWrong.feedback = "That starts top-level integers at depth 0, so the top-level 2 adds nothing and the four nested 1s add only 4.";

const packageLesson = findProblem(lessonGroups, "package-to-the-outpost");
packageLesson.conceptTasks.find(task => task.id === "concept-nodes").choices.find(choice => choice.id === "best-route").feedback = "Warehouses off the chosen route still belong to the road graph; a route does not define which warehouse nodes exist.";

const largest = findProblem(lessonGroups, "structy-largest-component");
const largestCases = [
  { groups: [["0", "1", "2"], ["a", "b"]], links: [["0", "1"], ["1", "2"], ["a", "b"]], answer: "3", wrong: "2" },
  { groups: [["0", "1"], ["a", "b", "c", "d"]], links: [["0", "1"], ["a", "b"], ["b", "c"], ["c", "d"]], answer: "4", wrong: "6" },
  { groups: [["0"], ["a", "b"], ["x", "y", "z"]], links: [["a", "b"], ["x", "y"], ["y", "z"]], answer: "3", wrong: "2" },
  { groups: [["left", "right"], ["solo"]], links: [["left", "right"]], answer: "2", wrong: "1" }
];
largest.buildTasks.forEach((task, index) => {
  const spec = largestCases[index];
  const nodes = spec.groups.flat();
  const neighbors = Object.fromEntries(nodes.map(node => [node, []]));
  for (const [from, to] of spec.links) { neighbors[from].push(to); neighbors[to].push(from); }
  task.input = `graph=${JSON.stringify(neighbors)}`;
  task.canvas = { directed: false, nodes: nodes.map(label => ({ id: label, label })), edges: spec.links.map(([from, to]) => ({ from, to })) };
  const correct = task.decision.choices.find(choice => choice.id === task.decision.correct);
  const wrong = task.decision.choices.find(choice => choice.id !== task.decision.correct && choice.id !== "not-enough-information");
  correct.label = spec.answer;
  correct.feedback = `Correct. The component sizes are ${spec.groups.map(group => group.length).join(", ")}; the largest is ${spec.answer}.`;
  wrong.label = spec.wrong;
  wrong.feedback = index === 1 ? "That adds separate components together instead of choosing the largest one." : "That picks a smaller component instead of the largest one.";
  wrong.misconception = index === 1 ? "merge-separate-components" : "choose-smaller-component";
  task.why = correct.feedback.replace(/^Correct\. /, "");
});

// Verified answer-key corrections.
const booleanTree = findProblem(lessonGroups, "evaluate-boolean-binary-tree");
for (const task of booleanTree.buildTasks) {
  if (!task.input.includes("values=[3,1,2,0,1]")) continue;
  const oldCorrect = task.decision.choices.find(choice => choice.id === task.decision.correct);
  const trueChoice = task.decision.choices.find(choice => /^true$/i.test(choice.label.replace(/`/g, "").trim()));
  if (trueChoice) {
    task.decision.correct = trueChoice.id;
    trueChoice.misconception = null;
    trueChoice.feedback = "Correct. AND(true, OR(false, true)) is true.";
    if (oldCorrect && oldCorrect !== trueChoice) oldCorrect.misconception = "evaluates-parent-before-children";
    for (const choice of task.decision.choices) if (choice !== trueChoice && !choice.misconception) choice.misconception = "evaluates-parent-before-children";
  }
  task.why = "The root is AND(true, OR(false, true)), so the result is true.";
}
for (const task of lessonGraphTasks(booleanTree)) for (const choice of task.decision.choices) if (choice.id !== task.decision.correct && /^(?:Correct|Right)\b/i.test(choice.feedback)) {
  choice.feedback = "That answer evaluates the Boolean tree incorrectly. Work from the leaves up to the root.";
}

const goldLights = findProblem(lessonGroups, "gold-and-silver-lights");
for (const task of goldLights.conceptTasks) {
  if (!task.input.includes("[3,5]")) continue;
  const oldCorrect = task.choices.find(choice => choice.id === task.correct);
  const four = task.choices.find(choice => /\b4\b/.test(choice.label));
  if (four) {
    task.correct = four.id;
    four.misconception = null;
    four.feedback = "Correct. Bulbs 0, 2, 4, and 5 are all an even distance from bulb 0.";
    if (oldCorrect && oldCorrect !== four) oldCorrect.misconception = "misses-even-distance-branch";
    for (const choice of task.choices) if (choice !== four && !choice.misconception) choice.misconception = "misses-even-distance-branch";
  }
  task.why = "Bulbs 0, 2, 4, and 5 are an even number of wires from bulb 0, so there are 4 gold bulbs.";
}
for (const task of goldLights.conceptTasks) for (const choice of task.choices) if (choice.id !== task.correct && /^(?:Correct|Right)\b/i.test(choice.feedback)) {
  choice.feedback = "That misses at least one bulb whose distance from bulb 0 is even.";
}

for (const task of lessonGraphTasks(bombs)) for (const choice of task.decision.choices) if (choice.id !== task.decision.correct && /^(?:Correct|Right)\b/i.test(choice.feedback)) {
  choice.feedback = "That invents a blast connection not shown by the exact bomb ranges.";
}

// Rebuild these choices after any corrected answer keys above.


for (let index = 0; index < files.lessons.length; index++) write(files.lessons[index], lessonGroups[index]);

if (process.argv.includes("--lessons-only")) { console.log("Applied lesson-only legacy authoring corrections."); process.exit(0); }

const visualSpecGroups = files.visualSpecs.map(read);
const largestComponent = findProblem(visualSpecGroups, "structy-largest-component");
largestComponent.nodeLabelFormat = {
  instruction: "Use the exact object key from graph. Example: `a` or `2`.",
  pattern: "^[A-Za-z0-9_]+$",
  showExactLabels: false
};
const propertiesSpec = findProblem(visualSpecGroups, "properties-graph");
propertiesSpec.nodeLabelFormat.instruction = "Name each row `row index: {comma-separated set values}`. Write repeated values once: `[1,1]` becomes `row 0: {1}`. Do not add spaces inside the braces.";
for (let index = 0; index < files.visualSpecs.length; index++) write(files.visualSpecs[index], visualSpecGroups[index]);

const step2Groups = files.step2.map(read);
const restrictions = findProblem(step2Groups, "reachable-nodes-with-restrictions");
restrictions.nodeLabels.description = "Use 0, 1, 2, ... with no gaps. Add ` (restricted)` to any blocked node, like `1 (restricted)`.";
restrictions.input.prompt = "Start the search at";
restrictions.input.name = "node 0 (fixed)";
for (const group of step2Groups) for (const problem of group) {
  if (problem.id === "longest-increasing-path-in-a-matrix") problem.rounds[0].goal = "Place two cells diagonally adjacent with no side connection, so the mistaken search invents a move.";
  if (problem.id === "number-of-increasing-paths-in-a-grid") problem.rounds[0].goal = "Place two cells diagonally adjacent with no side connection, so the mistaken search invents a path.";
  let rootName = null;
  if (problem.nodeLabels?.rule === "nested-path") rootName = problem.id === "codewars-array-deep-count" ? "outer array" : "root=[]";
  if (problem.nodeLabels?.rule === "tree-path") rootName = problem.id === "evaluate-boolean-binary-tree" ? "0:AND" : "node 0: 0";
  if (problem.id === "letter-combinations-of-a-phone-number") rootName = "empty prefix";
  if (problem.id === "runes-on-the-castle-door") rootName = "start";
  if (!rootName) continue;
  const oldRoot = problem.nodeLabels?.rule === "partial-string" ? "ε" : "root";
  if (problem.nodeLabels?.rule === "tree-path") problem.fixedStart = rootName;
  else if (problem.fixedStart === oldRoot) problem.fixedStart = rootName;
  for (const round of problem.rounds) {
    if (round.startLabel === oldRoot || (problem.nodeLabels?.rule === "tree-path" && ["0", "0:AND", "node 0: 0"].includes(round.startLabel))) round.startLabel = rootName;
    round.goal = oldRoot === "root" ? round.goal.replace(/\broot\b(?!\[|=)/g, rootName) : round.goal.replaceAll(oldRoot, rootName);
    if (problem.nodeLabels?.rule === "tree-path") round.goal = round.goal.replace(/^Start at 0\b/, `Start at ${rootName}`);
  }
}
for (let index = 0; index < files.step2.length; index++) write(files.step2[index], step2Groups[index]);

const step4Groups = files.step4.map(read);
for (const group of step4Groups) for (const problem of group) {
  // Keep every reviewed, distinct Step 4 misconception case.
  for (const codeCase of problem.cases) for (const choice of codeCase.diagnoses) {
    choice.label = choice.label
      .replace(/,?\s*changing this input's returned value\.?/gi, "")
      .replace(/\s+for the shown graph/gi, "")
      .replace(/\bshould\b/gi, "must");
  }
}

const labelMaps = {
  "keys-and-rooms": { "0": "0", "1": "1" },
  "kill-process": { "1": "1", "3": "3", "5": "5", "10": "10" },
  "network-delay-time": { "1": "1", "2": "2", "3": "3", "4": "4" },
  "course-schedule": { "0": "0", "1": "1", "2": "2", "3": "3" },
  "find-if-path-exists-in-graph": { "0": "0", "1": "1", "2": "2" },
  "number-of-provinces": { "0": "0", "1": "1", "2": "2" },
  "possible-bipartition": { "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7" },
  "letter-combinations-of-a-phone-number": { root: "empty prefix" },
  "smallest-string-with-swaps": { "0": "0:b", "1": "1:a" },
  "time-needed-to-inform-all-employees": { "0": "0", "1": "1", "2": "2", "3": "3", "4": "4" },
  "detonate-the-maximum-bombs": { "0": "A", "1": "B", "2": "C" },
  "flatten-nested-list-iterator": { root: "root=[]", "1": "root[0]=1", listA: "root[1]=[]", "2": "root[1][0]=2", listB: "root[1][1]=[]", "3": "root[1][1][0]=3", "4": "root[2]=4" },
  "nested-list-weight-sum": { root: "root=[]", "1": "root[0]=1", L1: "root[1]=[]", "4": "root[1][0]=4", L2: "root[1][1]=[]", "6": "root[1][1][0]=6" },
  "nested-list-weight-sum-ii": { root: "root=[]", "1": "root[0]=1", L1: "root[1]=[]", "4": "root[1][0]=4", L2: "root[1][1]=[]", "6": "root[1][1][0]=6" },
  "busiest-shelf-level": { root: "root=[]", one: "root[0]=1", a: "root[1]=[]", two: "root[1][0]=2", three: "root[1][1]=3", b: "root[2]=[]", c: "root[2][0]=[]", four: "root[2][0][0]=4" },
  "coins-on-level-k": { root: "root=[]", a: "root[0]=[]", "3": "root[0][0]=3", "2": "root[0][1]=2", "5": "root[1]=5", b: "root[2]=[]", c: "root[2][0]=[]", "4": "root[2][0][0]=4" },
  "dungeon-gold-run": { "0": "0:5g", "1": "1:3g", "2": "2:10g" },
  "shut-the-garden-valve": { "1": "1:5", "2": "2:10", "3": "3:20", "4": "4:40" },
  "codewars-array-deep-count": { outer: "outer array", one: "[0]=1", inner: "[1] array", two: "[1][0]=2", empty: "[1][1] array" },
  "employee-importance": { e1: "1:5", e2: "2:3", e3: "3:4" },
  "evaluate-boolean-binary-tree": { r: "0:AND", l: "1:true", q: "2:false" },
  "structy-max-root-to-leaf-path-sum": { r: "node 0: 5", l: "node 1: -10", q: "node 2: -20" },
  "moocast": { c0: "0: (0,0) p=3", c1: "1: (2,0) p=1", c2: "2: (4,0) p=2" },
  "path-sum": { r: "node 0: 5", a: "node 1: 3", b: "node 3: 1", c: "node 2: 10" },
  "properties-graph": { r0: "row 0: {1}", r1: "row 1: {1,2}", r2: "row 2: {3}" },
  "reachable-nodes-with-restrictions": { n0: "0", n1: "1 (restricted)", n2: "2", n3: "3" },
  "runes-on-the-castle-door": { root: "start" },
  "structy-tree-sum": { r: "node 0: 3", l: "node 1: -5", q: "node 2: 2" }
};

for (const [id, labels] of Object.entries(labelMaps)) {
  const problem = findProblem(step4Groups, id);
  relabelCanvas(problem.cases[0].canvas, labels);
}

// A key name is not an edge weight, so do not secretly grade it as one.
const keys = findProblem(step4Groups, "keys-and-rooms").cases[0];
for (const edge of keys.canvas.edges) delete edge.label;

const islands = findProblem(step4Groups, "number-of-islands").cases[0];
const countLand = islands.diagnoses.find(choice => choice.id === "count-land");
countLand.label = "It merges every land cell into one island even when no path joins them.";
countLand.feedback = "No. The code only adds corner moves; it does not merge land with no path at all.";
const bipartiteCase = findProblem(step4Groups, "is-graph-bipartite").cases[0];
const anyCycle = bipartiteCase.diagnoses.find(choice => choice.id === "any-cycle");
if (anyCycle) {
  anyCycle.label = "The code is wrong because it needs to reject every cycle, including an even cycle.";
  anyCycle.feedback = "No. Even cycles are bipartite. The bug is failing to compare a node's color with an already-colored neighbor.";
}

// Fix the two remaining verified Step 4 answer-text blockers.
const ladder = findProblem(step4Groups, "ladder-takahashi").cases[0];
const ladderCorrect = ladder.diagnoses.find(choice => choice.id === ladder.correctDiagnosis);
ladderCorrect.label = "The pair [4,1] is stored only as 4→1, so the code cannot climb from floor 1 to floor 4.";
ladderCorrect.feedback = "Exactly. Every ladder needs both directions, so floor 1 must connect back to floor 4.";
ladder.graphProof.separatingFeature = "The missing 1→4 direction traps the search at floor 1.";
const missingFloor = ladder.diagnoses.find(choice => choice.id === "missing-floor-nodes");
missingFloor.label = "The code never creates floor 1 as a node, so the search cannot visit it.";
missingFloor.feedback = "No. The seen set creates floor 1. The missing reverse ladder edge is the problem.";

const propertiesCase = findProblem(step4Groups, "properties-graph").cases[0];
const strictThreshold = propertiesCase.diagnoses.find(choice => choice.id === "threshold-strict");
strictThreshold.label = "The test uses common > k because ‘at least k’ excludes equality.";
strictThreshold.feedback = "No. ‘At least k’ includes equality, so >= k is the correct threshold.";

const milk = findProblem(step4Groups, "usaco-milk-factory").cases[0];
const milkCorrect = milk.diagnoses.find(choice => choice.id === milk.correctDiagnosis);
milkCorrect.label = "The extra reverse[firstValue].push(secondValue) line makes every belt work both ways.";
milkCorrect.feedback = "Exactly. The real reverse graph needs only reverse[secondValue].push(firstValue).";

// Keep all three diagnosis choices visually parallel, so wording does not reveal the key.
for (const group of step4Groups) for (const problem of group) for (const codeCase of problem.cases) for (const choice of codeCase.diagnoses) {
  let claim = choice.label.replace(/claim about the code:\s*/gi, "").trim();
  claim = claim.replace(/^The code\s+/i, "").replace(/^It\s+/i, "");
  const proposal = claim.match(/^(.+?)\s+(?:needs? to|must|should)\s+(.+)$/i);
  if (proposal) claim = `makes ${proposal[1].charAt(0).toLowerCase()}${proposal[1].slice(1)} ${proposal[2]}`;
  claim = claim.charAt(0).toLowerCase() + claim.slice(1);
  choice.label = `Claim about the code: ${claim}`;
}
findProblem(step4Groups, "nested-list-weight-sum-ii").cases[0].diagnoses.find(choice => choice.id === "zero-based").label = "Claim about the code: starts depth at 0 instead of 1.";
findProblem(step4Groups, "number-of-provinces").cases[0].diagnoses.find(choice => choice.id === "matrix-directed").label = "Claim about the code: reads the matrix as one-way roads.";
findProblem(step4Groups, "possible-bipartition").cases[0].diagnoses.find(choice => choice.id === "one-based").label = "Claim about the code: converts person labels to zero-based indexes.";
findProblem(step4Groups, "time-needed-to-inform-all-employees").cases[0].diagnoses.find(choice => choice.id === "include-leaves").label = "Claim about the code: adds one minute for each employee whose informTime is 0.";
findProblem(step4Groups, "employee-importance").cases[0].diagnoses.find(choice => choice.id === "double-boss").label = "Claim about the code: adds the boss's importance twice.";
findProblem(step4Groups, "smallest-string-with-swaps").cases[0].diagnoses.find(choice => choice.id === "single-use").label = "Claim about the code: uses each swap pair only once instead of forming connected components.";
findProblem(step4Groups, "evaluate-division").cases[0].diagnoses.find(choice => choice.id === "wrong-reciprocal").label = "Claim about the code: stores the same weight on the reverse edge instead of its reciprocal.";
findProblem(step4Groups, "find-if-path-exists-in-graph").cases[0].diagnoses.find(choice => choice.id === "one-way-storage").label = "Claim about the code: stores each undirected edge only from its first endpoint to its second.";
findProblem(step4Groups, "number-of-connected-components-in-an-undirected-graph").cases[0].diagnoses.find(choice => choice.id === "directed-storage").label = "Claim about the code: stores each undirected pair in only the first endpoint's adjacency list.";
findProblem(step4Groups, "smallest-string-with-swaps").cases[0].diagnoses.find(choice => choice.id === "directed-swap").label = "Claim about the code: stores each swap pair in only one direction, splitting a real component.";
const connectedCellsCase = findProblem(step4Groups, "hackerrank-connected-cells").cases[0];
connectedCellsCase.diagnoses.find(choice => choice.id === "global-seen").label = "Claim about the code: sharing visited between component searches prevents the second cell from being counted.";
connectedCellsCase.diagnoses.find(choice => choice.id === "best-init").label = "Claim about the code: largestValue starts at zero instead of one.";
connectedCellsCase.diagnoses.find(choice => choice.id === "drops-diagonals").label = "Claim about the code: directions lists only side moves, so corner-touching land cells become separate components.";
const maxIslandCase = findProblem(step4Groups, "max-area-of-island").cases[0];
maxIslandCase.diagnoses.find(choice => choice.id === "seen-across-islands").label = "Claim about the code: clears visited before measuring each island.";
maxIslandCase.diagnoses.find(choice => choice.id === "corner-merge").label = "Claim about the code: nonzero rowChange and columnChange create a diagonal edge between corner-touching land cells.";
maxIslandCase.diagnoses.find(choice => choice.id === "best-sum").label = "Claim about the code: adds every island area into largestValue instead of taking the maximum.";
const subIslandsCase = findProblem(step4Groups, "count-sub-islands").cases[0];
for (const choice of subIslandsCase.diagnoses) choice.label = choice.label.replace(/\bseen\b/g, "visited");
subIslandsCase.diagnoses.find(choice => choice.id === "mutates-grid2").label = "Claim about the code: changes visited grid2 land into water instead of storing its coordinates in the visited set.";
const dockedCase = findProblem(step4Groups, "counting-docked-boats").cases[0];
for (const choice of dockedCase.diagnoses) {
  choice.label = choice.label.replace(/\bseen\b/g, "visited");
  choice.feedback = choice.feedback.replace(/\bseen\b/g, "visited");
}
const metroCase = findProblem(step4Groups, "one-color-metro-ride").cases[0];
for (const choice of metroCase.diagnoses) choice.feedback = choice.feedback.replace(/\bseen\b/g, "visited");
const dungeonCase = findProblem(step4Groups, "dungeon-gold-run").cases[0];
dungeonCase.code = dungeonCase.code.replace("for (const key of input.startKeys || [0])", "for (const key of [0])");

for (let index = 0; index < files.step4.length; index++) write(files.step4[index], step4Groups[index]);

console.log("Applied the 2026-09-02 audit data corrections.");
