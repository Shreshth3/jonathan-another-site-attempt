const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const specs=require('../step6-specs-variant.json');const debug=require('../step5-specs-variant.json');const engine=require('./step5-engine');engine.setSpecs(debug);
const root=path.resolve(__dirname,'..');
const plain=value=>Array.isArray(value)?'['+value.map(plain).join(', ')+']':String(value);
const inputText=(name,value)=>['sky','park','marina','yard','cave','worked','trust','scores'].includes(name)?value.map(row=>row.join(', ')).join('\n'):Array.isArray(value)&&!value.some(Array.isArray)?value.join(', '):plain(value);
(async()=>{const b=await chromium.launch();try{const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('http://plain.test/**',async route=>{const url=new URL(route.request().url());if(url.pathname.startsWith('/api/'))return route.fulfill({status:503,body:'offline'});const file=url.pathname.includes('.')?url.pathname.slice(1):'index.html';let body=fs.readFileSync(path.join(root,file),'utf8');if(file==='visual-library.js')body=body.replace('  start();\n})();','  window.plainTest={parseLessonValue,inputSample,counterOutputMatches,jsonAnswerMatches,parseCounterSemanticValue,parseCounterDrawing};\n  start();\n})();');return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});});
let pages=0,values=0;
for(const spec of specs){
 for(let step=1;step<=6;step++){
  await p.goto(`http://plain.test/${spec.id}?section=${step}`);pages++;
  const missing=await p.locator('#challenge input:not([type="hidden"]):not([readonly]), #challenge textarea').evaluateAll(nodes=>nodes.filter(n=>!['checkbox','range'].includes(n.type)&&!n.placeholder.trim()).map(n=>n.id));assert.deepEqual(missing,[],`${spec.id} step ${step}`);
  assert.doesNotMatch(await p.locator('#challenge').innerText(),/\bJSON\b/,`${spec.id} step ${step}`);
 }
 for(const test of spec.tests){
  for(let i=0;i<spec.parameters.length;i++){
   const raw=inputText(spec.parameters[i].name,test.args[i])||'[]';
   const parsed=await p.evaluate(({raw,name})=>plainTest.parseLessonValue(raw,name,plainTest.inputSample(name)),{raw,name:spec.parameters[i].name});assert.deepEqual(parsed,test.args[i],`${spec.id}: ${spec.parameters[i].name}`);values++;
  }
 }
 const test=spec.tests[0];await p.locator('#coding-editor').fill(spec.correctCode);
 for(let i=0;i<spec.parameters.length;i++)await p.locator('#coding-input-'+i).fill(inputText(spec.parameters[i].name,test.args[i])||'[]');
 await p.locator('#coding-run').click();await p.waitForFunction(()=>!document.querySelector('#coding-run').disabled);assert.match(await p.locator('#coding-results').innerText(),/Returned/,spec.id);
 const debugging=debug.find(d=>d.id===spec.id);
 for(const round of debugging.cases){
  for(const value of [engine.execute(spec.id,round.witness,debugging.correctRules),engine.execute(spec.id,round.witness,engine.getRules(round,round.lines.map(l=>l.selected)))]){
   const parsed=await p.evaluate(({raw,sample})=>plainTest.parseLessonValue(raw,'output',sample),{raw:plain(value),sample:debugging.tests[0].expected});assert.deepEqual(parsed,value,round.id);values++;
  }
 }
}
await p.goto('http://plain.test/trusted-courier-networks?section=2');
assert.deepEqual(await p.evaluate(()=>plainTest.parseCounterSemanticValue('10, 4\n4, 10',{id:'scores',kind:'json'},'scores')),[[10,4],[4,10]]);
await p.goto('http://plain.test/runes-on-the-castle-door?section=2');assert.deepEqual(await p.evaluate(()=>plainTest.parseCounterSemanticValue('ab, cd',{id:'dials',kind:'json'},'dials')),['ab','cd']);
assert.equal(await p.evaluate(()=>plainTest.counterOutputMatches('ac, ad',['ac','ad'])),true);
assert.equal(await p.evaluate(()=>plainTest.jsonAnswerMatches('ac, ad','["ac","ad"]')),true);
for(const raw of ['alert(1)','[1,,2]','[1,2','{"n":3}','[1]; alert(1)']){const result=await p.evaluate(raw=>{try{return plainTest.parseLessonValue(raw,'numbers',[1,2]);}catch{return 'rejected';}},raw);assert.equal(result,'rejected',raw);}
await p.goto('http://plain.test/gas-pocket-survey?section=6');await p.screenshot({path:path.join(root,'tmp/plain-inputs/grid-desktop.png'),fullPage:true});
await p.setViewportSize({width:390,height:844});await p.goto('http://plain.test/trusted-courier-networks?section=2');await p.locator('#counter-field-scores').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(root,'tmp/plain-inputs/grid-mobile.png')});
assert.deepEqual(errors,[]);console.log(`Passed ${pages} step pages, ${values} plain-value checks, all 25 custom runs, Step 2/4 list parsing and unsafe-text rejection.`);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
