const assert = require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.addInitScript(()=>{const original=window.setTimeout;window.setTimeout=function(fn,delay,...args){return original.call(this,fn,delay===45000?1000:delay,...args)}});
 const base=process.env.EDITOR_TEST_URL||'http://127.0.0.1:4182';
 const findings=[];let requestBody;
 let mode='error';
 await page.route('**/api/ai-help',async route=>{requestBody=route.request().postDataJSON();if(mode==='hang')return;await route.fulfill(mode==='error'?{status:503,body:'Service temporarily unavailable. Try again.'}:{status:200,contentType:'text/event-stream',body:'data: {"type":"response.output_text.delta","delta":"Check your return value."}\n\ndata: {"type":"response.completed"}\n\n'})});
 try{
 await page.goto(base+'/villages-without-wells?section=6');
 await page.locator('#coding-editor').fill('function countWellsToDig(){ return 123; }');
 await page.locator('#ai-help button').click();
 await page.waitForFunction(()=>!document.querySelector('#ai-help button').disabled);
 assert.match(await page.locator('.ai-help-answer').innerText(),/temporarily/);
 mode='success';await page.locator('#ai-help button').click();await page.waitForFunction(()=>!document.querySelector('#ai-help button').disabled);
 assert.match(await page.locator('.ai-help-answer').innerText(),/return value/);
 assert.match(requestBody.attempt.studentCode,/123/);assert.ok(requestBody.attempt.correctCode);
 console.log('PASS AI error retry and current code context');
 mode='hang';await page.locator('#ai-help button').click();await page.locator('#coding-editor').fill('function countWellsToDig(){ return 456; }');assert.equal(await page.locator('#ai-help button').isDisabled(),false);
 console.log('PASS edit aborts pending AI request and restores help');
 await page.locator('#coding-graph-disclosure summary').click();await page.locator('#graph-add-node').click();
 await page.waitForFunction(()=>document.querySelector('#ai-help button'));
 assert.equal(await page.locator('#ai-help button').isDisabled(),false);
 console.log('PASS scratch graph edit preserves AI help');
 await page.locator('#ai-help button').click();
 await page.waitForFunction(()=>!document.querySelector('#ai-help button').disabled);
 assert.match(await page.locator('.ai-help-answer').innerText(),/too long|timed out|try again/i);
 await page.locator('#ai-help').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/editor-audit/execution-ai-timeout.png',fullPage:true});
 mode='success';await page.locator('#ai-help button').click();await page.waitForFunction(()=>!document.querySelector('#ai-help button').disabled);
 assert.match(await page.locator('.ai-help-answer').innerText(),/return value/);
 assert.match(requestBody.attempt.studentCode,/456/);
 console.log('PASS hung AI request times out and successful retry uses current code');
 console.log(JSON.stringify(findings));fs.writeFileSync('tmp/editor-audit/execution-ai-results.json',JSON.stringify({findings},null,2));
 }finally{await page.close();await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
