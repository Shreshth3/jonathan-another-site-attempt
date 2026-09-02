const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;
const failures = [];

function transferTasks(problem) {
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
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated 5 Step 3 inputs and at least 3 graph topologies for all ${problems.length} lessons.`);
