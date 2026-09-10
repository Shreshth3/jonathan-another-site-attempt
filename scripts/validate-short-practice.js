const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'visual-data.js'), 'utf8'), box);
const data = box.window.DFS_VISUAL_DATA;
for (const p of data.problems) {
  const plan = p.lesson.practicePlan;
  if (p.category !== 'variant') { assert.equal(plan, undefined); continue; }
  assert.equal(plan.step1.length, 5);
  assert.equal(new Set(plan.step1).size, 5);
  assert.equal(plan.step1.filter(id => p.lesson.buildTasks.some(t => t.id === id)).length, 2);
  assert.equal(plan.step1.filter(id => p.lesson.conceptTasks.some(t => t.id === id)).length, 3);
  assert.deepEqual(Array.from(plan.step3), [0, 1, 4]);
}
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1100}});
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    await page.route('http://practice.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname.startsWith('/api/')) return route.fulfill({status:503,body:''});
      const file=pathname.includes('.')?pathname.slice(1):'index.html';
      let body=fs.readFileSync(path.join(root,file),'utf8');
      if(file==='visual-library.js') body=body.replace('  start();\n})();', '  window.practiceTest = { task: currentTask, mainTasks, structureTasks, progress: () => progress };\n  start();\n})();');
      await route.fulfill({contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html',body});
    });
    async function fresh() { await page.goto('http://practice.test/office-rumor-reach'); await page.evaluate(()=>localStorage.clear()); await page.reload(); }
    async function answer(wrong=false) {
      const task=await page.evaluate(()=>window.practiceTest.task());
      if(task.kind==='build') await page.evaluate(canvas=>{window.DFS_GRAPH.setSnapshot(canvas);window.dispatchEvent(new Event('dfs-graph-change'));},task.canvas);
      const q=task.kind==='build'?task.decision:task;
      const id=wrong?q.choices.find(c=>c.id!==q.correct).id:q.correct;
      await page.locator(`[data-choice-id="${id}"]`).click();
      await page.locator('#visual-check').click();
    }
    for(const p of data.problems.filter(item => item.category === "variant")) {
      await page.goto(`http://practice.test/${p.id}`);
      const counts=await page.evaluate(()=>[window.practiceTest.mainTasks().length,window.practiceTest.structureTasks().length]);
      assert.deepEqual(counts,p.category==='variant'?[5,3]:[9,5],p.id);
    }
    await fresh();
    for(let i=0;i<3;i++) {
      assert.equal(await page.locator('#fast-track-step2').count(),0);
      await answer();
      if(i<2) await page.locator('#visual-check').click();
    }
    assert.equal(await page.locator('#fast-track-step2').count(),1);
    await page.screenshot({path:path.join(root,'tmp/short-practice/shortcut.png')});
    await page.reload();
    assert.equal(await page.locator('#fast-track-step2').count(),1);
    await page.locator('#fast-track-step2').click();
    assert.match(page.url(),/section=2/);
    await page.goto('http://practice.test/office-rumor-reach');
    assert.equal(await page.evaluate(()=>window.practiceTest.progress().index),3);
    await answer(); await page.locator('#visual-check').click(); await answer();
    assert.match(await page.locator('#visual-check').innerText(),/Finish/);
    await page.locator('#visual-check').click();
    assert.match(await page.locator('#challenge').innerText(),/passed all 5/);
    await fresh(); await answer(true); await answer(); await page.locator('#visual-check').click(); await answer(); await page.locator('#visual-check').click(); await answer();
    assert.equal(await page.locator('#fast-track-step2').count(),0);
    await fresh();
    await page.locator('#next-question-btn').click();
    await answer(); await page.locator('#visual-check').click(); await answer();
    assert.equal(await page.locator('#fast-track-step2').count(),0);
    await page.goto('http://practice.test/office-rumor-reach?section=3');
    for (let i=0;i<3;i++) await page.locator('#next-question-btn').click();
    assert.match(await page.locator('#challenge').innerText(), /3 skipped/);
    await page.goto('http://practice.test/office-rumor-reach');
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#reset-btn').click();
    assert.equal(await page.locator('#fast-track-step2').count(),0);
    assert.equal(await page.evaluate(()=>window.practiceTest.progress().index),0);
    assert.deepEqual(errors,[]);
    console.log('Validated practice plans and active variant counts; browser checked shortcut, reload, continuation, mistakes, and skips.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
