const fs = require('fs');
const assert = require('assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const failures = [];
  let checked = 0;
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><title>Student console regression checks</title>');
    await page.addScriptTag({ content: fs.readFileSync(__dirname + '/step6-acorn.js', 'utf8') });
    await page.addScriptTag({ content: fs.readFileSync(__dirname + '/step6-runtime.js', 'utf8') });
    async function check(name, body, expected = []) {
      checked++;
      try {
        const result = await page.evaluate(code => Step6Runtime.createRunner().run({
          code, functionName: 'solve', args: [], timeoutMs: 1800,
        }), 'async function solve() {\n' + body + '\nreturn 42;\n}');
        assert.equal(result.ok, true, JSON.stringify(result.error));
        assert.equal(result.value, 42, 'logging must not change the answer');
        assert.ok(result.logs.every(line => typeof line === 'string' && line.length <= 1000));
        assert.ok(result.logs.length <= 31);
        const text = result.logs.join('\n');
        for (const pattern of expected) assert.match(text, pattern);
      } catch (error) { failures.push(name + ': ' + error.message); }
    }
    await check('well set and graph map', `
      console.log('wells', new Set([1, 3]));
      console.log(new Map([[1, [2, 3]], [2, []]]));`, [/wells/, /Set/, /1/, /3/, /Map/, /2/]);
    await check('nested graph state', `console.log({visited: new Set(['north']), graph: new Map([['root', new Set(['leaf'])]])});`, [/visited/, /north/, /graph/, /root/, /leaf/]);
    await check('empty collections distinguish object', `console.log(new Set(), new Map(), {});`, [/Set/, /Map/, /\{\}/]);
    await check('cyclic graph', `const a = {name:'root'}; a.parent=a; console.log(a);`, [/root/, /parent/, /circular/i]);
    await check('cyclic array and collections', `const a=[]; a.push('array',a); const s=new Set(['set']); s.add(s); const m=new Map([['map',1]]); m.set('self',m); console.log(a,s,m);`, [/array/, /set/, /map/, /circular/i]);
    await check('repeated shared child is not a cycle', `const child={name:'shared'}; console.log([child,child]);`, [/shared.*shared/]);
    await check('special primitives', `console.log(undefined, null, false, NaN, Infinity, -Infinity, 123n, Symbol('node'), function dfs(){});`, [/undefined/, /null/, /false/, /NaN/, /Infinity/, /123n/, /node/, /Function/]);
    await check('nested special primitives', `console.log({missing:undefined, distance:Infinity, big:123n, list:[undefined,NaN], callback:function walk(){}});`, [/missing.*undefined/, /distance.*Infinity/, /123n/, /NaN/, /Function/]);
    await check('Error is useful', `console.error(new TypeError('bad node'));`, [/TypeError/, /bad node/]);
    await check('Dates, regular expressions and typed lists', `console.log(new Date('2025-01-01T00:00:00Z'), /node/gi, new Uint8Array([4,8]));`, [/2025-01-01/, /node/, /4/, /8/]);
    await check('getters and toJSON do not run', `let called=0; const node={get parent(){called++; throw new Error('getter executed')}, toJSON(){called++; throw new Error('toJSON executed')}}; console.log(node); if(called) throw new Error('Logging executed student methods');`);
    await check('throwing proxy does not break solution', `const p=new Proxy({}, {ownKeys(){throw new Error('cannot inspect')}}); console.log('proxy',p); console.log('still running');`, [/proxy/, /still running/]);
    await check('revoked proxy does not break solution', `const p=Proxy.revocable({},{}); p.revoke(); console.log(p.proxy); console.log('still running');`, [/still running/]);
    await check('null prototype adjacency list', `const g=Object.create(null); g.root=['leaf']; console.log(g);`, [/root/, /leaf/]);
    await check('different log levels', `for(const level of ['log','info','warn','error','debug']) console[level](level,new Set([7]));`, [/log.*7/, /info.*7/, /warn.*7/, /error.*7/, /debug.*7/]);
    await check('extra console methods', `console.dir(new Set([5])); console.table(new Map([['root',8]])); console.trace('here'); console.assert(false,'bad node'); console.assert(true,'invisible');`, [/5/, /root/, /8/, /here/, /Assertion failed/, /bad node/]);
    await check('counters reset', `console.count('visits'); console.count('visits'); console.countReset('visits'); console.count('visits');`, [/visits: 1\nvisits: 2\nvisits: 1/]);
    await check('timers and groups', `console.time('dfs'); console.group('neighbors'); console.timeLog('dfs',new Set([3])); console.groupEnd(); console.groupCollapsed('next'); console.timeEnd('dfs'); console.groupEnd();`, [/neighbors/, /dfs: .*ms/, /Set.*3/, /next/]);
    await check('iterator inspection does not consume it', `const entries=new Map([['root',9]]).entries(); console.log(entries); const next=entries.next(); if(next.done || next.value[0]!=='root') throw new Error('iterator consumed'); const nodes=new Set([8]).values(); console.log(nodes); if(nodes.next().value!==8) throw new Error('set iterator consumed');`, [/Map Iterator/, /Set Iterator/]);
    await check('custom Error name', `const error=new Error('missing parent'); error.name='GraphError'; console.log(error);`, [/GraphError: missing parent/]);
    await check('async and top-level logging', `await Promise.resolve(); console.log('async',new Set([9]));`, [/async/, /9/]);
    await check('mutating after a log keeps earlier values', `const s=new Set(['before']); console.log(s); s.clear(); s.add('after'); console.log(s);`, [/before.*\n.*after/]);
    await check('many logs and long text are bounded', `for(let i=0;i<10000;i++) console.log(i,'x'.repeat(2000));`, [/0/, /x/]);
    await check('deep object cannot overflow formatter', `let obj={leaf:true}; for(let i=0;i<20000;i++) obj={next:obj}; console.log(obj); console.log('finished');`, [/finished/]);
    await check('large collections cannot stall formatter', `console.log(new Set(Array.from({length:100000},(_,i)=>i))); console.log('finished');`, [/Set/, /finished/]);
    for (const [name, tail, timeoutMs] of [
      ['timeout', 'while(true){}', 200],
      ['async throw', 'setTimeout(()=>{throw new Error("broken DFS")},0); return new Promise(()=>{});', 1800],
      ['normal throw', 'throw new Error("broken DFS");', 1800],
    ]) {
      const result = await page.evaluate(options => Step6Runtime.createRunner().run(options), {
        code: 'function solve(){console.log("visited",new Set([7]));' + tail + '}',
        functionName: 'solve', args: [], timeoutMs,
      });
      assert.equal(result.ok, false, name);
      assert.match(result.logs.join('\n'), /visited Set.*7/, name + ' keeps debugging logs');
      if (name === 'timeout') assert.equal(result.error.line, null);
      else assert.equal(result.error.line, 1);
      checked++;
    }
    for (const tail of ['return 42;', 'while(true){}']) {
      const result = await page.evaluate(options => Step6Runtime.createRunner().run(options), {
        code: 'function solve(){console.log("old"); console.clear(); console.log("fresh");' + tail + '}',
        functionName:'solve', args:[], timeoutMs:200,
      });
      assert.deepEqual(result.logs, ['fresh'], 'clear removes old logs even on timeout');
      checked++;
    }
    const output = await page.evaluate(() => Step6Runtime.createRunner().run({code:'function solve(){console.log(new Set([1])); return {text: \"hello\", values: [1,2]};}', functionName:'solve', args:[]}));
    assert.equal(output.display, '{"text":"hello","values":[1,2]}', 'returned answers retain exact JSON formatting');
    const wells = JSON.parse(fs.readFileSync(__dirname + '/../step6-specs-variant.json', 'utf8'))
      .find(problem => problem.id === 'villages-without-wells');
    const loggedSolution = wells.correctCode.replace('const villagesWithWells = new Set(wells);',
      "const villagesWithWells = new Set(wells); console.log('wells', villagesWithWells);");
    assert.notEqual(loggedSolution, wells.correctCode, 'the real well solution receives the reported log');
    for (const test of wells.tests) {
      const result = await page.evaluate(options => Step6Runtime.createRunner().run(options), {
        code: loggedSolution, functionName: wells.functionName, args: test.args,
      });
      assert.equal(result.ok, true, test.label);
      assert.deepEqual(result.value, test.expected, test.label);
      assert.match(result.logs[0], /wells Set/);
      for (const village of test.args[2]) assert.ok(result.logs[0].includes(String(village)));
      checked++;
    }
    assert.equal(await page.locator('iframe').count(), 0, 'each runner is removed');
  } finally { await browser.close(); }
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    throw new Error(`${failures.length}/${checked} console scenarios failed.`);
  }
  console.log(`Step 6 console checks passed: ${checked} browser scenarios.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
