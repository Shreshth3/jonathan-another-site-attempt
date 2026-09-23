const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const specs = JSON.parse(fs.readFileSync(path.join(root, "step5-specs-variant.json"), "utf8"));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = JSON.parse(JSON.stringify(sandbox.window.DFS_VISUAL_DATA.problems));
const variants = problems.filter(problem => problem.category === "variant");
assert.equal(specs.length, 26, "Step 5 needs exactly 26 variant lessons");
assert.equal(new Set(specs.map(spec => spec.id)).size, 26, "Duplicate Step 5 lesson");
assert.deepEqual(specs.map(spec => spec.id).sort(), variants.map(problem => problem.id).sort());

let count = 0;
for (const spec of specs) {
  const context = spec.id;
  assert.ok(spec.inputHelp?.trim(), `${context}: missing input instructions`);
  assert.ok(spec.cases.length >= 2 && spec.cases.length <= 4, `${context}: expected 2–4 questions`);
  assert.equal(new Set(spec.cases.map(item => item.id)).size, spec.cases.length, `${context}: duplicate case IDs`);
  assert.equal(new Set(spec.cases.map(item => item.misconception)).size, spec.cases.length, `${context}: repeated misconception`);
  const changedRules = [];
  for (const item of spec.cases) {
    const label = `${context}/${item.id}`;
    assert.ok(item.correctAnswer?.trim(), `${label}: missing saved explanation and repair`);
    assert.ok(item.feedback?.trim(), `${label}: missing teaching feedback`);
    assert.ok(item.misconception?.trim(), `${label}: missing misconception`);
    assert.ok(item.lines.length >= 2, `${label}: missing pseudocode`);
    assert.equal(new Set(item.lines.map(line => line.key)).size, item.lines.length, `${label}: repeated line key`);
    for (const line of item.lines) {
      assert.ok(line.options.length >= 1, `${label}/${line.key}: missing code choices`);
      assert.equal(new Set(line.options.map(option => option.id)).size, line.options.length, `${label}/${line.key}: repeated option ID`);
      assert.equal(new Set(line.options.map(option => option.text)).size, line.options.length, `${label}/${line.key}: repeated option text`);
      assert.ok(line.options.some(option => option.id === line.selected), `${label}/${line.key}: missing starting choice`);
      assert.ok(line.options.some(option => option.id === spec.correctRules[line.key]), `${label}/${line.key}: missing correct choice`);
    }
    const changed = item.lines.filter(line => line.selected !== spec.correctRules[line.key]);
    assert.equal(changed.length, 1, `${label}: must contain exactly one bug`);
    changedRules.push(`${changed[0].key}:${changed[0].selected}`);
    count++;
  }
  assert.equal(new Set(changedRules).size, changedRules.length, `${context}: questions repeat the same mistake`);
  const built = variants.find(problem => problem.id === context).debuggingLesson;
  assert.equal(JSON.stringify(built), JSON.stringify(spec), `${context}: built lesson differs from source`);
}
for (const problem of problems.filter(problem => problem.category !== "variant")) {
  assert.equal(problem.debuggingLesson, undefined, `${problem.id}: Step 5 must be variant-only`);
}
console.log(`Validated Step 5 content: ${count} single-bug questions across 26 variants.`);
