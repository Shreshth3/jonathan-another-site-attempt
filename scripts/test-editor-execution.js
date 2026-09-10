const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const specs = require('../step6-specs-variant.json');
const base = process.env.EDITOR_TEST_URL || 'http://127.0.0.1:4182';
(async () => {
 const browser = await chromium.launch({headless:true,channel:'chrome'});
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const failures=[], errors=[]; let checks=0;
 page.on('pageerror',error=>errors.push(error.message));
 fs.mkdirSync('tmp/editor-audit',{recursive:true});
 const check=async(name,fn)=>{try{await fn();checks++;console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message);console.error('FAIL '+name+': '+e.message);await page.screenshot({path:`tmp/editor-audit/execution-failure-${failures.length}.png`,fullPage:true})}};
 const idle=()=>page.waitForFunction(()=>!document.querySelector('#coding-run').disabled);
 const editor=()=>page.locator('#coding-editor');
 const code=async text=>{await editor().click();await editor().press('ControlOrMeta+A');await editor().pressSequentially(text,{delay:0})};
 const result=()=>page.locator('#coding-results').innerText();
 try {
 for(const spec of (process.env.EDITOR_QUICK ? [] : specs)){
  await check(spec.id+' correct submit via UI',async()=>{
   await page.goto(`${base}/${spec.id}?section=6`);
   await editor().fill(spec.correctCode);
   await page.locator('#coding-submit').click();await idle();
   assert.equal(await page.locator('.coding-test.is-correct').count(),spec.tests.length,await result());
   assert.match(await result(),/All tests passed/);
  });
 }
 const spec=specs.find(s=>s.id==='villages-without-wells');
 await page.goto(`${base}/${spec.id}?section=6`);
 await check('typed wrong answer fails clearly',async()=>{await code('function countWellsToDig(n, paths, wells) { return -999; }');await page.locator('#coding-submit').click();await idle();assert.equal(await page.locator('.coding-test.needs-work').count(),spec.tests.length);assert.match(await result(),/Expected[\s\S]*Returned[\s\S]*-999/);await page.screenshot({path:'tmp/editor-audit/execution-wrong-answer.png',fullPage:true})});
 await check('invalid input and recovery',async()=>{await page.locator('#coding-input-0').fill('banana');await page.locator('#coding-run').click();assert.match(await result(),/number|integer|format of n/i);assert.equal(await page.locator('#coding-input-0').evaluate(e=>e===document.activeElement),true);await page.locator('#coding-input-0').fill('3');await page.locator('#coding-input-1').fill('[[0,1],[1,2]]');await page.locator('#coding-input-2').fill('[0]');await page.locator('#coding-run').click();await idle();assert.match(await result(),/Returned\s+-999/)});
 await check('stop infinite run then recover',async()=>{await code('function countWellsToDig() { console.log("started"); while (true) {} }');await page.locator('#coding-run').click();assert.equal(await page.locator('#coding-submit').isDisabled(),true);await page.locator('#coding-stop').click();assert.match(await result(),/Stopped/);await code('function countWellsToDig() { return 4; }');await page.locator('#coding-run').click();await idle();assert.match(await result(),/Returned\s+4/)});
 await check('editing cancels active submit without stale results',async()=>{await code('async function countWellsToDig() { await new Promise(r => setTimeout(r, 1000)); return -1; }');await page.locator('#coding-submit').click();await editor().press('End');await editor().pressSequentially(' ');assert.equal(await page.locator('#coding-run').isDisabled(),false);await page.waitForTimeout(1200);assert.equal(await result(),'');assert.equal(await page.locator('iframe').count(),0)});
 await check('input edit cancels run',async()=>{await page.locator('#coding-run').click();await page.locator('#coding-input-0').fill('4');await page.waitForTimeout(1200);assert.equal(await result(),'');assert.equal(await page.locator('#coding-run').isDisabled(),false)});
 await check('reload preserves typed code and input',async()=>{const saved=await editor().inputValue();await page.reload();assert.equal(await editor().inputValue(),saved);assert.equal(await page.locator('#coding-input-0').inputValue(),'4')});
 await check('navigation cancels run and preserves draft',async()=>{const saved=await editor().inputValue();await page.locator('#coding-run').click();await page.goto(`${base}/flood-fill?section=6`);await page.goBack();assert.equal(await editor().inputValue(),saved);assert.equal(await page.locator('#coding-run').isDisabled(),false);assert.equal(await page.locator('iframe').count(),0)});
 await check('syntax error recovery',async()=>{await code('function countWellsToDig() {\n return (\n}');await page.locator('#coding-run').click();await idle();assert.match(await result(),/SyntaxError|syntax/i);await editor().fill(spec.correctCode);await page.locator('#coding-submit').click();await idle();assert.match(await result(),/All tests passed/);await page.screenshot({path:'tmp/editor-audit/execution-success.png',fullPage:true})});
 await check('saved pass returns after reload, edit clears pass',async()=>{await page.reload();assert.match(await result(),/saved solution passed/);await editor().press('End');await editor().pressSequentially(' ');await page.reload();assert.doesNotMatch(await result(),/saved solution passed/)});
 await check('reset cancel preserves code; accept clears it',async()=>{const saved=await editor().inputValue();page.once('dialog',d=>d.dismiss());await page.locator('#reset-btn').click();assert.equal(await editor().inputValue(),saved);page.once('dialog',d=>d.accept());await page.locator('#reset-btn').click();assert.equal(await editor().inputValue(),spec.starterCode);await page.reload();assert.equal(await editor().inputValue(),spec.starterCode)});
 assert.deepEqual(errors,[],'browser errors');
 } finally {fs.writeFileSync('tmp/editor-audit/execution-results.json',JSON.stringify({checks,failures,errors},null,2));await page.close();await browser.close()}
 fs.writeFileSync('tmp/editor-audit/execution-results.json',JSON.stringify({checks,failures,errors},null,2));
 if(failures.length)throw new Error(failures.join('\n'));
 console.log(`${checks} execution UI checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1});
