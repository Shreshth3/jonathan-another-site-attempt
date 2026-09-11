const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sourceRoot = path.resolve(__dirname, "../source/jonathan-study-site");
const sourceSandbox = { window: {} };
const sourceProblemsFile = path.join(sourceRoot, "site/problems.js");
vm.runInNewContext(fs.readFileSync(sourceProblemsFile, "utf8"), sourceSandbox);
const sourceProblems = new Map(sourceSandbox.window.PROBLEMS.map(problem => [problem.id, problem]));
const specFiles = ["step4-specs-original.json", "step4-specs-variant.json", "step4-specs-new.json"];
const specs = specFiles.flatMap(file => JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", file), "utf8")));
const failures = [];
let checkedCases = 0;

if (specs.length !== 75 || new Set(specs.map(spec => spec.id)).size !== 75) {
  failures.push(`Expected 75 unique Step 4 problem specs; found ${specs.length} specs and ${new Set(specs.map(spec => spec.id)).size} unique IDs`);
}

function levelOrderTree(values) {
  if (!values.length || values[0] == null) return null;
  const nodes = values.map(value => value == null ? null : { val: value, left: null, right: null });
  let child = 1;
  for (const node of nodes) if (node) {
    node.left = nodes[child++] || null;
    node.right = nodes[child++] || null;
  }
  return nodes[0];
}

function normalizeTree(node) {
  if (node == null) return null;
  return {
    ...node,
    left: normalizeTree(node.left),
    right: normalizeTree(node.right)
  };
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
  if (typeof source !== "string") {
    const input = structuredClone(source);
    if (["evaluate-boolean-binary-tree", "path-sum", "structy-max-root-to-leaf-path-sum", "structy-tree-sum"].includes(problemId)) input.root = normalizeTree(input.root);
    return input;
  }
  if (problemId === "codewars-array-deep-count") {
    const argument = source.match(/^deepCount\((.*)\)$/)?.[1];
    return { arr: vm.runInNewContext(`(${argument})`) };
  }
  const treeMatch = source.match(/^root level-order=(\[[^\n]+?\])(?:,\s*targetSum=([-+]?\d+))?$/);
  if (treeMatch) return { root: levelOrderTree(JSON.parse(treeMatch[1])), ...(treeMatch[2] ? { targetSum: Number(treeMatch[2]) } : {}) };
  const cleaned = source.replace(/\s+\([^)]*=.*\)\s*$/, "").replace(/(?:,|\n)\s*(?=[A-Za-z_$][\w$]*\s*=)/g, "; var ");
  const names = [...cleaned.matchAll(/(?:^|; var )([A-Za-z_$][\w$]*)\s*=/g)].map(match => match[1]);
  const sandbox = {};
  vm.runInNewContext(`var ${cleaned}; globalThis.__input = { ${names.join(",")} };`, sandbox);
  const input = sandbox.__input;
  if (problemId === "evaluate-division" && input.query) input.queries = [input.query];
  if (problemId === "routes-past-the-coffee-cart") Object.assign(input, { graph: input.roads, checkpoint: input.coffeeCart });
  if (problemId === "villages-without-wells") input.paths = input.roads;
  if (problemId === "gas-pocket-survey") {
    input.cave = input.cave.map(row => [...row]);
    const drill = source.match(/drill=\((\d+),(\d+)\)/);
    input.row = Number(drill[1]);
    input.col = Number(drill[2]);
  }
  if (problemId === "evaluate-boolean-binary-tree") input.root = explicitBooleanTree(input);
  if (problemId === "usaco-fence-planning") Object.assign(input, { positions: input.cows, pairs: input.friendships });
  if (problemId === "kattis-getting-gold") input.grid = input.dungeon;
  return input;
}

function sourceParameterNames(source) {
  const escapedName = source.functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.solution.match(new RegExp(`(?:function\\s+${escapedName}|(?:const|let|var)\\s+${escapedName}\\s*=)\\s*(?:function\\s*)?\\(([^)]*)\\)`));
  return (match?.[1] || "").split(",").map(name => name.trim()).filter(Boolean);
}

for (const spec of specs) {
  const source = sourceProblems.get(spec.id);
  if (!source?.solution || !source.functionName) {
    failures.push(`${spec.id}: source solution is missing`);
    continue;
  }
  for (const codeCase of spec.cases || []) {
    checkedCases++;
    try {
      const sandbox = {};
      vm.runInNewContext(`${source.solution}\n;globalThis.__callable = ${source.functionName};`, sandbox, { timeout: 1000 });
      const input = parseInput(spec.id, codeCase.input);
      let actual;
      if (source.functionName === "NestedIterator") {
        const iterator = new sandbox.__callable(structuredClone(input.nestedList));
        actual = [];
        while (iterator.hasNext()) actual.push(iterator.next());
      } else {
        const shownParameters = String(codeCase.code).match(/function\s+\w+\s*\(([^)]*)\)/)?.[1]
          .split(",").map(name => name.trim()).filter(Boolean) || [];
        const baseParameters = String(spec.cases[0].code).match(/function\s+\w+\s*\(([^)]*)\)/)?.[1]
          .split(",").map(name => name.trim()).filter(Boolean) || [];
        const parameters = shownParameters.length === 1 && shownParameters[0] === "input"
          ? (baseParameters.length === 1 && baseParameters[0] === "input" ? sourceParameterNames(source) : baseParameters)
          : shownParameters;
        actual = sandbox.__callable(...structuredClone(parameters.map(name => input[name])));
      }
      const expected = JSON.parse(codeCase.correctOutput);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        failures.push(`${spec.id}/${codeCase.caseId}: reference returned ${JSON.stringify(actual)}, declared ${codeCase.correctOutput}`);
      }
    } catch (error) {
      failures.push(`${spec.id}/${codeCase.caseId}: reference execution failed (${error.message})`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Matched ${checkedCases} Step 4 case outputs across all ${specs.length} problems to source-repo reference solutions.`);
