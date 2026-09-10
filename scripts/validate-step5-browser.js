const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const specs = require('../step5-specs-variant.json');
const coding = require('../step6-specs-variant.json');
const engine = require('./step5-engine'); engine.setSpecs(specs);
const root = path.resolve(__dirname,'..');
const base = process.env.STEP5_REAL_URL || 'http://step5.test';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let requests=0, delayed=false;
  if(!process.env.STEP5_REAL_URL)await page.route(base+'/**',async route=>{
   const url=new URL(route.request().url());
   if(url.pathname==='/api/grade-debugging'){
    requests++;const attempt=route.request().postDataJSON();
    const spec=specs.find(s=>s.id===attempt.problemId), round=spec.cases.find(c=>c.id===attempt.caseId);
    assert.ok(engine.gradeEvidence(spec.id,round.id,attempt.input,attempt.correctOutput,attempt.buggyOutput).ok);
    if(delayed)await new Promise(r=>setTimeout(r,500));
    const correct=attempt.studentAnswer===round.correctAnswer;
    return route.fulfill({json:{correct,feedback:correct?'Your explanation is correct.':'Your explanation needs another try.',...(!correct?{correctAnswer:round.correctAnswer}:{})}});
   }
   const file=url.pathname.includes('.')?url.pathname.slice(1):'index.html';
   return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});
  });
  let count=0;
  async function fillEvidence(spec,round){
   const names=coding.find(c=>c.id===spec.id).parameters.map(p=>p.name);
   for(let i=0;i<names.length;i++)await page.locator('#debugging-input-'+i).fill(JSON.stringify(round.witness[names[i]]));
   await page.locator('#debugging-correct-output').fill(JSON.stringify(engine.execute(spec.id,round.witness,spec.correctRules)));
   await page.locator('#debugging-buggy-output').fill(JSON.stringify(engine.execute(spec.id,round.witness,engine.getRules(round,round.lines.map(l=>l.selected)))));
  }
  async function check(){await page.locator('#debugging-check').click();await page.waitForFunction(()=>!document.querySelector('#debugging-check')?.disabled,{},{timeout:55000});}
  for(const spec of specs){
   await page.goto(`${base}/${spec.id}?section=5`);
   assert.equal(await page.locator('[id^="debugging-input-"]').count(),coding.find(c=>c.id===spec.id).parameters.length);
   assert.equal(await page.locator('.debugging-repair select').count(),0);
   assert.doesNotMatch(await page.locator('#challenge').innerText(),/JSON|Use the menus/);
   for(const round of spec.cases){
    assert.equal(await page.locator('#debugging-reveal').count(),0);
    await fillEvidence(spec,round);
    if(count===0){
     const before=requests;
     await page.locator('#debugging-correct-output').fill('not a number');await check();
     assert.match(await page.locator('#feedback-slot').innerText(),/format/);assert.equal(requests,before);
     await fillEvidence(spec,round);
     await page.locator('#debugging-explanation').fill('It is wrong. Fix it.');await check();
     assert.equal(await page.locator('#debugging-reveal').count(),1);
     assert.equal(await page.locator('.debugging-saved-answer').count(),0);
     await page.locator('#debugging-reveal').click();assert.equal(await page.locator('.debugging-saved-answer').innerText(),round.correctAnswer);
    }
    await page.locator('#debugging-explanation').fill(round.correctAnswer);
    if(count===0){await page.reload();assert.equal(await page.locator('#debugging-explanation').inputValue(),round.correctAnswer);}
    await check();
    assert.match(await page.locator('#feedback-slot').getAttribute('class'),/is-correct/,round.id+': '+await page.locator('#feedback-slot').innerText());
    if(count===0){
     await page.locator('#debugging-explanation').fill('Changed answer');
     await page.reload();assert.equal(await page.locator('#debugging-explanation').inputValue(),'Changed answer');
     await page.locator('#debugging-explanation').fill(round.correctAnswer);await check();
     await page.screenshot({path:path.join(root,'tmp/step5-refresh/step5-desktop.png'),fullPage:true});
    }
    await page.locator('#debugging-check').click();count++;
   }
   assert.match(await page.locator('#challenge').innerText(),/Step 5 complete/);
  }
  if(!process.env.STEP5_REAL_URL){
   await page.goto(base+'/counting-constellations?section=5');await page.evaluate(()=>localStorage.clear());await page.reload();
   const spec=specs[0],round=spec.cases[0];await fillEvidence(spec,round);await page.locator('#debugging-explanation').fill(round.correctAnswer);
   delayed=true;await page.locator('#debugging-check').click();await page.locator('#debugging-explanation').fill('new answer');await page.waitForTimeout(800);
   assert.doesNotMatch(await page.locator('#feedback-slot').getAttribute('class')||'',/is-correct/);
   assert.equal(await page.locator('#debugging-check').isEnabled(),true);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/one-color-metro-ride?section=5');
  await page.screenshot({path:path.join(root,'tmp/step5-refresh/step5-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log(`Browser passed all ${count} Step 5 challenges; checked separate fields, hidden answer, grading, saved drafts, edits and completion (${process.env.STEP5_REAL_URL?'real Luna':'stub grader'}).`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
