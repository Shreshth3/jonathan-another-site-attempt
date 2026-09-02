const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sourceRoot = path.resolve(__dirname, "../../jonathan-study-site");
const sourceSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(sourceRoot, "site/problems.js"), "utf8"), sourceSandbox);
const sourceProblems = new Map(sourceSandbox.window.PROBLEMS.map(problem => [problem.id, problem]));
const specs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../step4-specs-original.json"), "utf8"));
const failures = [];

function parseInput(source) {
  if (typeof source !== "string") return structuredClone(source);
  const cleaned = source.replace(/(?:,|\n)\s*(?=[A-Za-z_$][\w$]*\s*=)/g, "; var ");
  const names = [...cleaned.matchAll(/(?:^|; var )([A-Za-z_$][\w$]*)\s*=/g)].map(match => match[1]);
  const sandbox = {};
  vm.runInNewContext(`var ${cleaned}; globalThis.__input = { ${names.join(",")} };`, sandbox);
  return sandbox.__input;
}

for (const spec of specs) {
  const source = sourceProblems.get(spec.id);
  if (!source?.solution || !source.functionName) {
    failures.push(`${spec.id}: source solution is missing`);
    continue;
  }
  for (const codeCase of spec.cases || []) {
    try {
      const sandbox = {};
      vm.runInNewContext(`${source.solution}\n;globalThis.__callable = ${source.functionName};`, sandbox, { timeout: 1000 });
      const input = parseInput(codeCase.input);
      let actual;
      if (source.functionName === "NestedIterator") {
        const iterator = new sandbox.__callable(structuredClone(input.nestedList));
        actual = [];
        while (iterator.hasNext()) actual.push(iterator.next());
      } else {
        const shownParameters = String(spec.cases[0].code).match(/function\s+\w+\s*\(([^)]*)\)/)?.[1]
          .split(",").map(name => name.trim()).filter(Boolean) || [];
        actual = sandbox.__callable(...structuredClone(shownParameters.map(name => input[name])));
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
console.log("Matched all 75 original Step 4 correct outputs to source-repo reference solutions.");
