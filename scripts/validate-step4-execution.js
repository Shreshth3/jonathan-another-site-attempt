const fs = require("fs");
const vm = require("vm");

const dataSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("visual-data.js", "utf8"), dataSandbox);
const failures = [];

function topLevelAssignments(text) {
  const parts = [];
  let start = 0, depth = 0, quote = null, escaped = false;
  for (let index = 0; index <= text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
    } else if (["\"", "'", "`"].includes(char)) quote = char;
    else if (["[", "{", "("].includes(char)) depth++;
    else if (["]", "}", ")"].includes(char)) depth--;
    else if ((char === "," && depth === 0) || index === text.length) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  return parts.map(part => part.match(/^([A-Za-z_$][\w$]*)\s*=/)?.[1]).filter(Boolean);
}

function levelOrderTree(values) {
  if (!values.length || values[0] == null) return null;
  const nodes = values.map(value => value == null ? null : { val: value, left: null, right: null });
  let child = 1;
  for (const node of nodes) if (node) { node.left = nodes[child++] || null; node.right = nodes[child++] || null; }
  return nodes[0];
}

function explicitBooleanTree(input) {
  if (!input.values || !input.edges) return levelOrderTree(input.values || []);
  const nodes = input.values.map(val => ({ val, left: null, right: null }));
  const parents = new Set();
  for (const [from, to] of input.edges) {
    if (!nodes[from] || !nodes[to] || from === to || parents.has(to)) throw new Error("Invalid explicit Boolean tree");
    parents.add(to);
    if (!nodes[from].left) nodes[from].left = nodes[to];
    else if (!nodes[from].right) nodes[from].right = nodes[to];
    else throw new Error("Boolean operator has more than two children");
  }
  for (const node of nodes) {
    const leaf = node.val === 0 || node.val === 1;
    if (leaf ? node.left || node.right : !node.left || !node.right) throw new Error("Boolean leaf/operator shape disagrees with values");
  }
  return nodes[0];
}

function parseInput(problemId, source) {
  if (typeof source !== "string") return JSON.parse(JSON.stringify(source));
  if (problemId === "codewars-array-deep-count") return { arr: vm.runInNewContext(`(${source.match(/^deepCount\((.*)\)$/)?.[1]})`) };
  const treeMatch = source.match(/^root level-order=(\[[^\n]+?\])(?:,\s*targetSum=([-+]?\d+))?$/);
  if (treeMatch) return { root: levelOrderTree(JSON.parse(treeMatch[1])), ...(treeMatch[2] ? { targetSum: Number(treeMatch[2]) } : {}) };
  const cleaned = source.replace(/\s+\([^)]*=.*\)\s*$/, "").replace(/(?:,|\n)\s*(?=[A-Za-z_$][\w$]*\s*=)/g, "; var ");
  const values = {};
  vm.runInNewContext(`var ${cleaned}; globalThis.__values = { ${[...cleaned.matchAll(/(?:^|; var )([A-Za-z_$][\w$]*)\s*=/g)].map(match => match[1]).join(",")} };`, values);
  const input = values.__values;
  if (problemId === "evaluate-division" && input.query) input.queries = [input.query];
  if (problemId === "routes-past-the-coffee-cart") Object.assign(input, { graph: input.roads, checkpoint: input.coffeeCart });
  if (problemId === "villages-without-wells") input.paths = input.roads;
  if (problemId === "gas-pocket-survey") { input.cave = input.cave.map(row => [...row]); const drill = source.match(/drill=\((\d+),(\d+)\)/); input.row = Number(drill[1]); input.col = Number(drill[2]); }
  if (problemId === "evaluate-boolean-binary-tree") input.root = explicitBooleanTree(input);
  if (problemId === "usaco-fence-planning") Object.assign(input, { positions: input.cows, pairs: input.friendships });
  if (problemId === "kattis-getting-gold") input.grid = input.dungeon;
  return input;
}

for (const problem of dataSandbox.window.DFS_VISUAL_DATA.problems) {
 for (const spec of problem.codeReasoning?.cases || []) {
  const functionMatch = String(spec.code).match(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/);
  const functionName = functionMatch?.[1];
  const parameters = (functionMatch?.[2] || "").split(",").map(value => value.trim()).filter(Boolean);
  if (!functionName) { failures.push(`${problem.id}: Step 4 function name not found`); continue; }
  const sandbox = {};
  try {
    vm.runInNewContext(spec.code, sandbox, { timeout: 1000 });
    let actual;
    const input = parseInput(problem.id, spec.input);
    sandbox.__args = parameters.length === 1 && parameters[0] === "input" ? [input] : parameters.map(parameter => input[parameter]);
    vm.runInNewContext(`__result = ${functionName}(...__args);`, sandbox, { timeout: 1000 });
    actual = sandbox.__result;
    const expected = JSON.parse(spec.buggyOutput);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push(`${problem.id}/${spec.caseId}: code returned ${JSON.stringify(actual)}, declared ${spec.buggyOutput}`);
  } catch (error) {
    failures.push(`${problem.id}/${spec.caseId}: Step 4 execution failed (${error.message})`);
  }
 }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Executed every authored Step 4 case and matched every declared buggy output.");
