const assert = require('node:assert/strict');
const fs = require('node:fs');
const engines = require('playwright');
const specs = require('../step6-specs-variant.json');
const base = process.env.EDITOR_BASE_URL || 'http://127.0.0.1:4182';
(async () => {
 const results=[]; fs.mkdirSync('tmp/editor-audit',{recursive:true});
 for (const name of ['chromium','firefox','webkit']) {
  let browser;
  try { browser = await engines[name].launch({headless:true,...(name==='chromium'?{channel:'chrome'}:{})}); }
  catch(e) { results.push({engine:name,unavailable:e.message.split('\n')[0]}); continue; }
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const editor=page.locator('#coding-editor'); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(label,fn)=>{try{await fn();results.push({engine:name,label,pass:true});}catch(e){results.push({engine:name,label,pass:false,error:e.message});await page.screenshot({path:`tmp/editor-audit/cross-${name}-${label.replace(/\W/g,'-')}.png`,fullPage:true});}};
  const fresh=async(code)=>{await page.goto(base+'/villages-without-wells?section=6');await editor.fill(code);await editor.focus()};
  const run=async()=>{await page.locator('#coding-input-0').fill('3');await page.locator('#coding-input-1').fill('[[0,1],[1,2]]');await page.locator('#coding-input-2').fill('[0]');await page.locator('#coding-run').click();await page.waitForFunction(()=>!document.querySelector('#coding-run').disabled);return page.locator('#coding-results').innerText()};
  await check('indent undo redo outdent',async()=>{await fresh('one();\ntwo();');await editor.press('ControlOrMeta+A');await editor.press('Tab');assert.equal(await editor.inputValue(),'  one();\n  two();');await editor.press('ControlOrMeta+z');assert.equal(await editor.inputValue(),'one();\ntwo();');await editor.press('ControlOrMeta+Shift+z');assert.equal(await editor.inputValue(),'  one();\n  two();');await editor.press('ControlOrMeta+A');await editor.press('Shift+Tab');assert.equal(await editor.inputValue(),'one();\ntwo();')});
  await check('word deletion undo',async()=>{await fresh('const graph = new Map();');await editor.press('ControlOrMeta+ArrowRight');await editor.press('Alt+Backspace');const changed=await editor.inputValue();assert.notEqual(changed,'const graph = new Map();');await editor.press('ControlOrMeta+z');assert.equal(await editor.inputValue(),'const graph = new Map();')});
  await check('set map output',async()=>{await fresh('function countWellsToDig() { console.log(new Set([1, 3]), new Map([["a", 2]])); return 7; }');const out=await run();assert.match(out,/Set.*1.*3/s);assert.match(out,/Map.*a.*2/s);assert.match(out,/Returned\s+7/);await page.locator('#coding-results').scrollIntoViewIfNeeded();await page.screenshot({path:`tmp/editor-audit/cross-${name}-console.png`,fullPage:true})});
  await check('runtime accurate line',async()=>{await fresh('function countWellsToDig() {\n const n = 1;\n throw new Error("line-three");\n}');const out=await run();assert.match(out,/line-three/);assert.match(out,/line 3/i)});
  await check('syntax error',async()=>{await fresh('function countWellsToDig() {\n return (\n}');assert.match(await run(),/SyntaxError|syntax/i)});
  await check('correct submit',async()=>{await fresh(specs.find(x=>x.id==='villages-without-wells').correctCode);await page.locator('#coding-submit').click();await page.waitForFunction(()=>!document.querySelector('#coding-run').disabled);assert.match(await page.locator('#coding-results').innerText(),/All tests passed/)});
  await check('mobile width 320',async()=>{await page.setViewportSize({width:320,height:740});await editor.scrollIntoViewIfNeeded();await page.screenshot({path:`tmp/editor-audit/cross-${name}-mobile.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),320)});
  await check('no browser errors',async()=>assert.deepEqual(errors,[]));
  await browser.close();
 }
 fs.writeFileSync('tmp/editor-audit/cross-browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));if(results.some(x=>x.pass===false))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
