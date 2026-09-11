const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
const b=await chromium.launch({channel:'chrome',headless:true});
try {
const p=await b.newPage({viewport:{width:1500,height:1050}});
const base=process.env.GRAPH_BASE_URL || 'http://127.0.0.1:4185';
if(!process.env.GRAPH_BASE_URL) await p.route('**/who-keeps-their-job?*',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('index.html')}));
await p.goto(base+'/who-keeps-their-job?section=4');
assert.equal(await p.locator('.lesson-step-nav button').count(),6);
await p.locator('#coding-graph-disclosure summary').click();
await p.locator('#graph-add-node').click();
await p.locator('#coding-graph-input').fill('ids: 2, 5, 9\nbosses: 0, 2, 5\nquitId: 5');
await p.locator('#coding-graph-save').click();
await p.locator('#coding-graph-add').click();
await p.locator('#graph-add-node').click();
await p.locator('#graph-add-node').click();
await p.locator('#coding-graph-input').fill('Second example');
await p.locator('#coding-graph-save').click();
await p.locator('#coding-notes-disclosure summary').click();
await p.locator('#coding-notes').fill('Keep the root employee.');
await p.locator('#coding-editor').fill('function remainingEmployees(ids, bosses, quitId) { return []; }');
await p.reload();
await p.locator('#coding-graph-disclosure summary').click();
assert.equal(await p.locator('.coding-graph-case').count(),2);
assert.equal(await p.locator('.scratch-node').count(),1);
assert.match(await p.locator('#coding-graph-input').inputValue(),/quitId: 5/);
await p.getByRole('button',{name:'Graph 2',exact:true}).click();
assert.equal(await p.locator('.scratch-node').count(),2);
assert.equal(await p.locator('#coding-graph-input').inputValue(),'Second example');
await p.locator('#coding-notes-disclosure summary').click();
assert.equal(await p.locator('#coding-notes').inputValue(),'Keep the root employee.');
assert.match(await p.locator('#coding-editor').inputValue(),/return \[\]/);
await p.locator('#coding-notes').scrollIntoViewIfNeeded();
await p.screenshot({path:'tmp/scratchpads/merged-step4.png'});
console.log('PASS six steps, both saved graph examples and inputs, notes, and code preserved on screenshot route');
} finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
