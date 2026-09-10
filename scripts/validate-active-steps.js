const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'visual-data.js'), 'utf8'), box);
const variants = box.window.DFS_VISUAL_DATA.problems.filter(p => p.category === 'variant');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = process.env.SITE_URL || 'http://steps.test';
    if (!process.env.SITE_URL) await page.route(`${base}/**`, route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname.startsWith('/api/')) return route.fulfill({ status: 503, body: '' });
      const file = pathname.includes('.') ? pathname.slice(1) : 'index.html';
      return route.fulfill({ contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', body: fs.readFileSync(path.join(root, file)) });
    });
    for (const p of variants) {
      assert.equal(p.counterexampleLesson.rounds.length, 3, `${p.id}: authored pool preserved`);
      await page.goto(`${base}/${p.id}`);
      assert.deepEqual(await page.locator('[data-section]').allTextContents(), ['Step 1', 'Step 2', 'Step 6']);
      await page.locator('[data-section="2"]').click();
      assert.match(page.url(), /section=2/);
      assert.match(await page.locator('#evidence-label').innerText(), /of 2/i);
      await page.locator('#next-question-btn').click();
      await page.locator('#next-question-btn').click();
      assert.match(await page.locator('#challenge').innerText(), /0 passed · 2 skipped/);
      await page.locator('#start-after-counter').click();
      assert.match(page.url(), /section=6/);
      assert.equal(await page.locator('#coding-editor').count(), 1);
      await page.locator('[data-section="2"]').click();
      assert.match(page.url(), /section=2/);
      for (const section of [3, 4, 5]) {
        await page.goto(`${base}/${p.id}?section=${section}`);
        assert.equal(await page.locator('[aria-current="step"]').innerText(), 'Step 1');
      }
    }
    const id = variants[0].id;
    await page.evaluate(id => localStorage.setItem(`dfs-counterexamples:${id}:v4`, JSON.stringify({ index: 3, skipped: [2] })), id);
    await page.goto(`${base}/${id}?section=2`);
    assert.match(await page.locator('#challenge').innerText(), /Step 2 complete/);
    assert.doesNotMatch(await page.locator('#challenge').innerText(), /skipped/);
    assert.equal(await page.evaluate(id => JSON.parse(localStorage.getItem(`dfs-counterexamples:${id}:v4`)).index, id), 3, 'Loading preserves saved third-question history');
    await page.screenshot({ path: path.join(root, 'tmp/active-steps.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log(`Validated all ${variants.length} variants: steps 1/2/6, two questions, completion, back navigation, hidden links, and old progress.`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
