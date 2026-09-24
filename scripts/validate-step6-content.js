const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
execFileSync(process.execPath, [path.join(__dirname, 'step6-build.js'), '--check'], { stdio: 'pipe' });
const specs = require('../step6-specs-variant.json');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'visual-data.js'), 'utf8'), sandbox);
const problems = JSON.parse(JSON.stringify(sandbox.window.DFS_VISUAL_DATA.problems));
const variants = problems.filter(problem => problem.category === 'variant');
assert.equal(specs.length, 27);
assert.deepEqual(specs.map(spec => spec.id).sort(), variants.map(problem => problem.id).sort());
for (const problem of problems) {
  if (problem.category !== 'variant') { assert.equal(problem.codingLesson, undefined); continue; }
  const spec = specs.find(item => item.id === problem.id);
  assert.deepEqual(problem.codingLesson, spec, `${problem.id}: generated code lesson differs`);
  assert.ok(spec.tests.length >= 5 && spec.tests.length <= 10);
  assert.equal(new Set(spec.tests.map(test => JSON.stringify(test.args))).size, spec.tests.length);
  assert.equal(new Set(spec.parameters.map(parameter => parameter.name)).size, spec.parameters.length);
  assert.ok(spec.parameters.every(parameter => parameter.description?.trim()));
  assert.ok(spec.correctCode.includes(spec.functionName));
  assert.ok(spec.starterCode.includes(`${spec.functionName}(${spec.parameters.map(parameter => parameter.name).join(', ')})`));
  assert.ok(spec.tests.every(test => test.args.length === spec.parameters.length));
}
console.log(`Step 6 content passed: 27 variants, ${specs.reduce((total, spec) => total + spec.tests.length, 0)} fresh source-checked tests, correct parameter fields, and earlier categories unchanged.`);
