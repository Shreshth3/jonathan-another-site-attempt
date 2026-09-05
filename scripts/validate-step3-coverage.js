const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;
const failures = [];
// Use the shipped claim generator so answer-pattern and authoring regressions
// are caught even when all stored graphs remain structurally valid.
sandbox.document = { querySelector: () => null };
let runtime = fs.readFileSync(path.join(root, "visual-library.js"), "utf8");
runtime = runtime.replace("  start();\n})();", `window.claimsFor = id => {
  problem = allProblems.find(item => item.id === id);
  problemIndex = allProblems.indexOf(problem);
  return structureTasks();
};\n})();`);
vm.runInNewContext(runtime, sandbox);
const patterns = new Set();

function transferTasks(problem) {
  if (problem.lesson.structureTasks) return problem.lesson.structureTasks;
  const tasks = problem.lesson.conceptTasks;
  const find = ids => tasks.find(task => ids.includes(task.id));
  const node = find(["core-rule", "concept-node", "concept-nodes", "node-rule"]);
  const edge = find(["relation-rule", "concept-edge", "concept-relations", "edge-rule", "two-way-tracks"]);
  const corrected = new Map([[node?.id, node?.remedial], [edge?.id, edge?.remedial]]);
  return [...new Map(tasks
    .map(task => corrected.get(task.id) || task.remedial)
    .filter(task => task?.canvas)
    .map(task => [JSON.stringify([task.input, task.canvas]), task])).values()];
}

function topologySignature(canvas) {
  const ids = canvas.nodes.map(node => String(node.id));
  const outgoing = Object.fromEntries(ids.map(id => [id, []]));
  const incoming = Object.fromEntries(ids.map(id => [id, []]));
  for (const edge of canvas.edges) {
    const from = String(edge.from), to = String(edge.to);
    outgoing[from].push(to);
    incoming[to].push(from);
    if (!canvas.directed) {
      outgoing[to].push(from);
      incoming[from].push(to);
    }
  }
  let colors = Object.fromEntries(ids.map(id => [id, `${incoming[id].length}/${outgoing[id].length}`]));
  for (let round = 0; round < ids.length; round++) {
    const descriptions = Object.fromEntries(ids.map(id => [id, [
      colors[id],
      incoming[id].map(next => colors[next]).sort().join(","),
      outgoing[id].map(next => colors[next]).sort().join(",")
    ].join("|")]));
    const palette = [...new Set(Object.values(descriptions))].sort();
    colors = Object.fromEntries(ids.map(id => [id, String(palette.indexOf(descriptions[id]))]));
  }
  const nodes = ids.map(id => `${incoming[id].length}/${outgoing[id].length}:${colors[id]}`).sort().join(";");
  return `${canvas.directed ? "directed" : "undirected"}|${ids.length}|${canvas.edges.length}|${nodes}`;
}

for (const problem of problems) {
  const transfers = transferTasks(problem);
  if (transfers.length !== 5) failures.push(`${problem.id}: expected 5 distinct Step 3 inputs, found ${transfers.length}`);
  const signatures = new Set(transfers.map(task => topologySignature(task.canvas)));
  if (signatures.size < 3) failures.push(`${problem.id}: expected at least 3 graph topologies, found ${signatures.size}`);
  const rounds = sandbox.window.claimsFor(problem.id);
  const claims = rounds.flatMap(round => round.claims);
  const yesCount = claims.filter(claim => claim.correct).length;
  if (claims.length !== 5 || yesCount < 2 || yesCount > 3) failures.push(`${problem.id}: expected five balanced Yes/No claims`);
  patterns.add(claims.map(claim => Number(claim.correct)).join(""));
  const membership = problem.graphRules.membershipClaim;
  if (!membership?.yes || !membership?.no || !membership?.misconception) failures.push(`${problem.id}: missing authored node-misconception claim pair`);
  const oldInputs = new Set([...problem.lesson.buildTasks, ...problem.lesson.conceptTasks, ...problem.lesson.conceptTasks.map(task => task.remedial)].map(task => task.input.replace(/\s/g, "")));
  for (const transfer of transfers) if (oldInputs.has(transfer.input.replace(/\s/g, ""))) failures.push(`${problem.id}: Step 3 repeats a Step 1 input`);
}
if (patterns.size < 10) failures.push(`Only ${patterns.size} Yes/No patterns across the library`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated 5 Step 3 inputs and at least 3 graph topologies for all ${problems.length} lessons.`);
