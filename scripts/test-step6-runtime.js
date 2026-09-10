const fs = require('fs');
const assert = require('assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><title>Step 6 runtime checks</title>');
    await page.addScriptTag({ content: fs.readFileSync(__dirname + '/step6-acorn.js', 'utf8') });
    await page.addScriptTag({ content: fs.readFileSync(__dirname + '/step6-runtime.js', 'utf8') });
    const run = (code, args = [], timeoutMs = 1200) => page.evaluate(async ({ code, args, timeoutMs }) => Step6Runtime.createRunner().run({ code, functionName: 'solve', args, timeoutMs }), { code, args, timeoutMs });
    assert.deepEqual((await run('function solve(a, b) { return [a + b, {ok:true}]; }', [3, 4])).value, [7, {ok:true}]);
    const syntax = await run('function solve() {\n  const x = ;\n  return 1;\n}');
    assert.equal(syntax.ok, false); assert.equal(syntax.error.line, 2);
    // The runner and parser both honor only the student's strict-mode directive.
    assert.equal((await run('function solve(){ return 010; }')).value, 8);
    assert.equal((await run('function solve(){ with({x:2}){return x;} }')).value, 2);
    for (const body of ['return 010;', 'with({x:2}){return x;}']) {
      const strictError = await run('"use strict";\nfunction solve(){\n  ' + body + '\n}');
      assert.equal(strictError.ok, false);
      assert.equal(strictError.error.name, 'SyntaxError');
      assert.equal(strictError.error.line, 3);
      assert.ok(strictError.error.column > 0);
    }
    const runtime = await run('function solve() {\n  const x = 1;\n  missingThing();\n}');
    assert.equal(runtime.error.line, 3);
    for (const newline of ['\n', '\r\n', '\r']) {
      const source = ['function solve(){', ' throw new Error("line two");', '}'].join(newline);
      assert.equal((await run(source)).error.line, 2);
    }
    for (const schedule of ['setTimeout', 'queueMicrotask']) {
      const uncaught = await run('function solve(){\n ' + schedule + '(()=>{missing()},0);\n return new Promise(()=>{});\n}');
      assert.equal(uncaught.ok, false);
      assert.equal(uncaught.error.line, 2, schedule + ' errors must use student lines');
    }
    for (const expression of ['undefined', 'NaN', 'Infinity', '1n', 'new Map()', '(()=>{let a={};a.a=a;return a})()']) {
      assert.equal((await run('function solve() {return ' + expression + ';}')).ok, false, expression);
    }
    const eof = await run('function solve() {\n  return 1;'); assert.equal(eof.error.line, 2);
    const forged = await run('function solve() {postMessage({ok:true,value:999}); return 7;}'); assert.equal(forged.value, 7);
    const globalThrow = await run('const a=1;\nthrow new Error("top level");\nfunction solve(){return 1;}'); assert.equal(globalThrow.error.line, 2);
    const firstLine = await run('function solve(){bad();}'); assert.equal(firstLine.error.line, 1); assert.equal(firstLine.error.column, 18);
    const loop = await run('function solve() {while(true){}}', [], 150);
    assert.equal(loop.error.name, 'Time limit');
    assert.equal(loop.error.line, null);
    assert.equal(loop.error.column, null);
    const log = await run('function solve() {for(let i=0;i<200;i++) console.log("x".repeat(2000)); return 1;}');
    assert.equal(log.logs.length, 31); assert.match(log.logs[30], /limit reached/); assert.equal(log.logs[0].length, 1000);
    const missing = await run('function other(){return 1;}'); assert.match(missing.error.message, /required function name/);
    const asyncResult = await run('async function solve(x){return x+1;}', [2]); assert.equal(asyncResult.value, 3);
    const recurse = await run('function solve(){\n return solve();\n}'); assert.equal(recurse.ok, false); // Chrome may report the overflowing function entry or its recursive call.
    assert.ok([1, 2].includes(recurse.error.line), 'Recursion errors must point inside the recursive function');
    const dom = await run('function solve() {return typeof document;}'); assert.equal(dom.value, 'undefined');
    const storage = await run('function solve() {return typeof localStorage;}'); assert.equal(storage.value, 'undefined');
    const network = await run('async function solve() {await fetch("https://example.com");return true;}'); assert.equal(network.ok, false);
    const cancelled = await page.evaluate(async () => { const runner = Step6Runtime.createRunner(); const result = runner.run({code:'function solve(){while(true){}}', functionName:'solve',args:[]}); runner.cancel(); return result; });
    assert.equal(cancelled.cancelled, true);
    assert.equal(await page.locator('iframe').count(), 0);
    console.log('Step 6 runtime browser checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
