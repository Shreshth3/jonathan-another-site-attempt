const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('playwright');
const specs = require('../step6-specs-variant.json');
const engine = require('./step5-engine');
(async () => {
  let checks = 0;
  for (const spec of specs) for (const test of spec.tests) {
    const input = Object.fromEntries(spec.parameters.map((p,i) => [p.name,test.args[i]]));
    if ('scores' in input) input.trust = input.scores;
    engine.validate(spec.id,input); checks++;
    // A printed answer is not a correctly typed returned answer.
    if (typeof test.expected !== 'string') { assert.equal(engine.equal(spec.id,String(test.expected),test.expected),false); checks++; }
  }
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    const page=await browser.newPage();
    await page.setContent('<!doctype html><title>Final independent runner audit</title>');
    for(const file of ['step6-acorn.js','step6-runtime.js']) await page.addScriptTag({content:fs.readFileSync(__dirname+'/'+file,'utf8')});
    for(const [name,body,expected] of [
      ['shared child references','const x=[1]; return [x,x];',[[1],[1]]],
      ['null prototype dictionary','const x=Object.create(null); x.node=2; return x;',{node:2}],
      ['unicode values','console.log("🪴",new Set(["村", "🌳"]));return "村";','村'],
      ['nested graph structures','console.log(new Map([[0,new Set([1,2])]]));return 2;',2],
      ['circular graph logging','const a={node:1};a.next=a;console.log(a);return 1;',1],
      ['getter log has no side effect','const x={get a(){throw Error("getter ran")}};console.log(x);return 1;',1],
      ['log snapshot','let x=[1];console.log(x);x.push(2);return x;',[1,2]],
      ['awaited result','return await Promise.resolve(2);',2],
      ['empty output list','return [];',[]],
      ['null result','return null;',null],
      ['zero result','return 0;',0],
      ['false result','return false;',false],
    ]) {
      const result=await page.evaluate(options=>Step6Runtime.createRunner().run(options),{code:'async function solve(){'+body+'}',functionName:'solve',args:[]});
      assert.equal(result.ok,true,name+': '+JSON.stringify(result.error));assert.deepEqual(result.value,expected,name);
      if(name==='log snapshot')assert.equal(result.logs[0],'[1]');
      if(name==='circular graph logging')assert.match(result.logs[0],/Circular/);
      checks++;
    }
    for(const body of ['return Array(5);','return [undefined];','return {x:Infinity};','return new Set([1]);','return {get x(){return 1}};']) {
      const result=await page.evaluate(options=>Step6Runtime.createRunner().run(options),{code:'function solve(){'+body+'}',functionName:'solve',args:[]});
      assert.equal(result.ok,false,body);checks++;
    }
    for (const [name, body, shouldTimeout] of [
      ['ten thousand clears', 'for(let i=0;i<10000;i++){console.log(i);console.clear()}console.log("done");return 1;', false],
      ['pending async log flood', 'while(true){console.log(1);console.clear();await Promise.resolve()}', true],
      ['shared output expansion', 'const x=Array(100).fill(1);return Array(1000).fill(x);', false],
      ['non-enumerable getter log', 'console.log(Object.defineProperty({},"secret",{get(){throw Error("getter ran")}}));return 1;', false]
    ]) {
      const result = await page.evaluate(async ({body, shouldTimeout}) => {
        let messages=0, ticks=0;
        const count=e=>{if(e.data.type==='step6-log')messages++};
        window.addEventListener('message',count);
        const timer=setInterval(()=>ticks++,20);
        const started=performance.now();
        const output=await Step6Runtime.createRunner().run({code:'async function solve(){'+body+'}',functionName:'solve',args:[],timeoutMs:shouldTimeout ? 500 : 1500});
        clearInterval(timer);window.removeEventListener('message',count);
        return {output,messages,ticks,elapsed:performance.now()-started};
      },{body, shouldTimeout});
      assert.ok(result.messages <= 301, name + ': stream cap');
      if(name==='ten thousand clears')assert.deepEqual(result.output.logs,['done']);
      if(shouldTimeout){assert.equal(result.output.error.name,'Time limit');assert.ok(result.elapsed<2000);assert.ok(result.ticks>0);}
      else if(name==='shared output expansion'){assert.equal(result.output.ok,false);assert.match(result.output.error.message,/too large/);}
      else {assert.equal(result.output.ok,true,name);assert.equal(result.output.value,1);}
      console.log('STRESS',name,JSON.stringify({messages:result.messages,elapsed:result.elapsed}));
      checks++;
    }
    console.log(JSON.stringify({checks,failures:0}));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
