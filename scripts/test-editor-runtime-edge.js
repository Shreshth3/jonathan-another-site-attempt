const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const failures = []; let count = 0;
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><title>Runtime edge audit</title>');
    for (const file of ['step6-acorn.js', 'step6-runtime.js']) await page.addScriptTag({ content: fs.readFileSync(__dirname + '/' + file, 'utf8') });
    async function check(name, body, verify, timeoutMs = 750) {
      count++;
      try {
        const result = await page.evaluate(options => Step6Runtime.createRunner().run(options), {code: 'async function solve(input) {\n' + body + '\n}', functionName: 'solve', args: [[1,2]], timeoutMs});
        verify(result); console.log('PASS', name);
      } catch (error) { failures.push(name + ': ' + error.message); }
    }
    const success = expected => r => { assert.equal(r.ok, true, JSON.stringify(r.error)); assert.deepEqual(r.value, expected); };
    const error = pattern => r => { assert.equal(r.ok, false); assert.match(r.error.message, pattern); assert.notEqual(r.error.name, 'Time limit'); };
    for (const [name, body, pattern] of [
      ['throw string', 'throw "missing node";', /missing node/],
      ['throw null', 'throw null;', /null/],
      ['throw undefined', 'throw undefined;', /undefined/],
      ['throw number zero', 'throw 0;', /0/],
      ['throw plain object', 'throw {message:"bad graph"};', /bad graph/],
      ['await rejected promise', 'await Promise.reject(new Error("rejected traversal"));', /rejected traversal/],
      ['unhandled rejection while pending', 'Promise.reject(new Error("lost traversal")); await new Promise(()=>{});', /lost traversal/],
      ['throw null-prototype object', 'throw Object.create(null);', /./],
      ['throw object with hostile stack getter', 'throw {get stack(){throw Error("stack getter")},message:"original failure"};', /original failure/],
      ['undefined output', 'return;', /undefined/],
      ['nested NaN', 'return [NaN];', /NaN/],
      ['nested BigInt', 'return {n:1n};', /BigInt/],
      ['circular output', 'const x=[]; x.push(x); return x;', /circular/],
      ['large output', 'return "x".repeat(100001);', /too large/],
      ['sparse output must not silently become nulls', 'return Array(3);', /undefined|sparse|empty/i],
      ['toJSON function output rejected', 'return {answer:4,toJSON(){return 5}};', /Return a number/],
      ['returned getter throws', 'return {get answer(){throw Error("getter failed")}};', /without getters/],
    ]) await check(name, body, error(pattern));
    for (const [name, body, expected] of [
      ['input mutation allowed', 'input.reverse(); return input;', [2,1]],
      ['shared child output', 'const x=[1]; return [x,x];', [[1],[1]]],
      ['null output', 'return null;', null],
      ['empty output', 'return "";', ''],
      ['boolean output', 'return false;', false],
      ['async result', 'await new Promise(r=>setTimeout(r,10)); return 4;', 4],
    ]) await check(name, body, success(expected));
    for (const [name, body, patterns] of [
      ['sparse log', 'console.log([,1,,]);', [/empty/, /1/]],
      ['symbol keys', 'console.log({[Symbol("node")]:7});', [/Symbol\("?node"?\)/, /7/]],
      ['format placeholders', 'console.log("node %s has %d paths", "A", 2);', [/node A has 2 paths/]],
      ['assert no message', 'console.assert(false);', [/Assertion failed/]],
      ['clear after log cap', 'for(let i=0;i<40;i++)console.log(i);console.clear();console.log("fresh");', [/^fresh$/]],
      ['profile methods', 'console.profile("dfs");console.profileEnd("dfs");console.timeStamp("done");console.log("done");', [/done/]],
    ]) await check(name, body + '\nreturn 42;', r => {success(42)(r); for(const pattern of patterns) assert.match(r.logs.join('\n'), pattern);});
    assert.equal(await page.locator('iframe').count(), 0);
    console.log(JSON.stringify({count, failures}, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
