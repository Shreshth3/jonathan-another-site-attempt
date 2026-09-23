const fs = require("fs");
const vm = require("vm");

const failures = [];
const source = fs.readFileSync("visual-library.js", "utf8");
const graphSource = fs.readFileSync("graph.js", "utf8");
const index = fs.readFileSync("index.html", "utf8");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("visual-data.js", "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;

const expectedCounts = { original: 25, variant: 26, new: 25 };
if (problems.length !== 76) failures.push(`expected 76 problems, found ${problems.length}`);
for (const category of ["original", "variant", "new"]) {
  const count = problems.filter(problem => problem.category === category).length;
  if (count !== expectedCounts[category]) failures.push(`expected ${expectedCounts[category]} ${category} problems, found ${count}`);
}

for (const problem of problems) {
  const rounds = problem.counterexampleLesson?.rounds || [];
  if (rounds.length !== 3) failures.push(`${problem.id}: Step 2 must have exactly 3 single-mistake questions`);
  rounds.forEach((round, index) => {
    if (round.bugs?.length !== 1) failures.push(`${problem.id}/step2/${index + 1}: expected exactly one misconception`);
    if (!String(round.startLabel || "").trim()) failures.push(`${problem.id}/step2/${index + 1}: missing fixed start`);
    if (round.bugs?.includes("wrong-start")) {
      if (!round.mistakenStartLabel || round.mistakenStartLabel === round.startLabel) failures.push(`${problem.id}/step2/${index + 1}: wrong-start needs a different mistaken start`);
    } else if (round.mistakenStartLabel) failures.push(`${problem.id}/step2/${index + 1}: unexpected mistaken start`);
  });
  if (problem.lesson?.buildTasks?.length !== 4) failures.push(`${problem.id}: Step 1 needs 4 builds`);
  if (problem.lesson?.conceptTasks?.length !== 5) failures.push(`${problem.id}: Step 1 needs 5 visual checks`);
  if (!problem.codeReasoning) failures.push(`${problem.id}: Step 4 case missing`);
}

const forbiddenSource = [
  "counter-nodes", "counter-edges", "counter-difference", "counter-starter",
  "Boss rule", "Boss case", "two mistakes", "two bugs", "MINI-EXAMPLE INPUT",
  "Use these exact node labels", "STOP HERE—SPEND", "addCoffeeOverride",
  "Independent counterexample designer", "Counterexample designer with scaffolds"
];
for (const text of forbiddenSource) if (source.includes(text)) failures.push(`old UI text or control remains: ${text}`);
if (source.includes('const compact = problem.id === "routes-past-the-coffee-cart"')) failures.push("compact layout is still Coffee-only");
if (graphSource.includes('contextKey.includes("routes-past-the-coffee-cart")')) failures.push("graph diversity is still Coffee-only");
if (!graphSource.includes("const presets = [") || (graphSource.match(/^      \[\[/gm) || []).length < 8) failures.push("editable graph layout does not expose 8 presets");
if (!source.includes("const compact = true;")) failures.push("global compact layout is missing");
if (!source.includes("typedExpected")) failures.push("strict typed Step 2 output grading is missing");
if (!source.includes("Duplicate graph from #1")) failures.push("duplicate graph control is missing");
if (!source.includes('id="counter-start"') || !source.includes('<h4 id="counter-output-heading">') || !source.includes("Correct output")) failures.push("Step 2 input or output labels are missing");
if (index.includes("All problems")) failures.push("All problems button returned");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Validated the Coffee-style rollout across all 75 lessons.");
