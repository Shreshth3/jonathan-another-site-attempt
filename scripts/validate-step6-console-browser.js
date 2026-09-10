const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const spec = require('../step6-specs-variant.json').find(item => item.id === 'villages-without-wells');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    const base = process.env.CONSOLE_TEST_URL || 'http://console.test';
    if (!process.env.CONSOLE_TEST_URL) await page.route(base + '/**', route => {
      const pathname = new URL(route.request().url()).pathname;
      const file = pathname.includes('.') ? pathname.slice(1) : 'index.html';
      const filename = path.resolve(__dirname, '..', file);
      if (!fs.existsSync(filename)) return route.fulfill({ status: 404 });
      return route.fulfill({ contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', body: fs.readFileSync(filename) });
    });
    await page.goto(`${base}/${spec.id}?section=6`);
    const editor = page.locator('#coding-editor');
    const run = async code => {
      await editor.fill(code);
      await page.locator('#coding-run').click();
      await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
      return page.locator('#coding-results').innerText();
    };
    for (const [index, input] of [9, [[0,1],[1,2],[3,4],[6,7]], [0,2,6]].entries()) {
      await page.locator(`#coding-input-${index}`).fill(JSON.stringify(input));
    }
    const code = spec.correctCode.replace('const villagesWithWells = new Set(wells);', `const villagesWithWells = new Set(wells);
      console.log('wells', villagesWithWells);
      console.log('graph', new Map([[0, new Set([1, 2])]]));
      console.log('<img src=x onerror="globalThis.consoleInjected=true">');`);
    const result = await run(code);
    assert.match(result, /Returned\s+3/);
    assert.match(result, /wells Set\(3\) \{0, 2, 6\}/);
    assert.match(result, /Map\(1\) \{0 => Set\(2\) \{1, 2\}\}/);
    assert.equal(await page.locator('#coding-results img').count(), 0);
    await page.locator('#coding-submit').click();
    await page.waitForFunction(() => !document.querySelector('#coding-submit').disabled);
    assert.equal(await page.locator('.coding-test.is-correct').count(), spec.tests.length);
    assert.match(await run(`function countWellsToDig(){console.log('before crash', new Set([7])); throw new Error('oops');}`), /before crash Set\(1\) \{7\}/);
    assert.match(await run(`function countWellsToDig(){console.log('before loop', new Set([7])); while(true){} }`), /before loop Set\(1\) \{7\}/);
    await page.setViewportSize({ width: 390, height: 844 });
    await run(code);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    console.log(`Dig New Wells console UI passed: Run, all ${spec.tests.length} Submit tests, errors, timeout, safe text, mobile (${base}).`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
