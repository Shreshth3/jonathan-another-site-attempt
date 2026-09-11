const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const specs = require('../step6-specs-variant.json');
const base = process.env.GRAPH_BASE_URL || 'http://scratchpads.test';
(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (!process.env.GRAPH_BASE_URL) await page.route(base + '/**', route => {
      const pathname = new URL(route.request().url()).pathname;
      const file = pathname.includes('.') ? pathname.slice(1) : 'index.html';
      const full = path.resolve(__dirname, '..', file);
      if (!fs.existsSync(full)) return route.fulfill({status: 404});
      return route.fulfill({contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', body: fs.readFileSync(full)});
    });
    for (const spec of specs) for (const section of [4, 6]) {
      await page.goto(base + '/' + spec.id + '?section=' + section);
      const graph = page.locator('#coding-graph-disclosure');
      const notesPanel = page.locator('#coding-notes-disclosure');
      const notes = page.locator('#coding-notes');
      assert.equal(await graph.evaluate(el => el.open), false);
      assert.equal(await notesPanel.evaluate(el => el.open), false);
      await notesPanel.locator('summary').click();
      assert.equal(await notes.inputValue(), section === 4 ? '' : 'Plan for ' + spec.id + '\nCheck the starting node.');
      await notes.fill('Plan for ' + spec.id + '\nCheck the starting node.');
      await graph.locator('summary').click();
      await page.evaluate(() => window.DFS_GRAPH.setSnapshot(null));
      await page.locator('#graph-add-node').click();
      assert.equal(await page.locator('.scratch-node').count(), 1);
      await notesPanel.locator('summary').click();
      assert.equal(await graph.evaluate(el => el.open), true);
      await page.reload();
      assert.equal(await graph.evaluate(el => el.open), false);
      assert.equal(await notesPanel.evaluate(el => el.open), false);
      await notesPanel.locator('summary').click();
      assert.equal(await notes.inputValue(), 'Plan for ' + spec.id + '\nCheck the starting node.');
      await graph.locator('summary').click();
      assert.equal(await page.locator('.scratch-node').count(), 1);
      console.log('PASS saved, separate, closed-by-default scratchpads: ' + spec.id + ' section ' + section);
    }
    const spec = specs[0];
    await page.goto(base + '/' + spec.id + '?section=6');
    await page.locator('#coding-editor').fill(spec.correctCode);
    await page.locator('#coding-submit').click();
    await page.waitForFunction(() => !document.querySelector('#coding-submit').disabled);
    const results = await page.locator('#coding-results').innerText();
    assert.ok(results.length > 0);
    await page.locator('#coding-notes-disclosure summary').click();
    await page.locator('#coding-notes').fill('New notes after running tests.');
    assert.equal(await page.locator('#coding-results').innerText(), results);
    await page.setViewportSize({width: 390, height: 844});
    await page.locator('#coding-graph-disclosure summary').click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    fs.mkdirSync('tmp/scratchpads', {recursive: true});
    await page.locator('#coding-notes').scrollIntoViewIfNeeded();
    await page.screenshot({path: 'tmp/scratchpads/mobile.png', fullPage: true});
    assert.deepEqual(errors, []);
    console.log('PASS notes preserve test results; mobile fits; no browser errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
