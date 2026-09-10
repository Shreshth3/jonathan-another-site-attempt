const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const specs = require('../step6-specs-variant.json');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
    const errors = [];
    let aiPayload;
    page.on('pageerror', error => errors.push(error.message));
    await page.route('http://step6.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname === '/api/ai-help') {
        aiPayload = route.request().postDataJSON();
        return route.fulfill({ contentType: 'text/event-stream', body: 'data: {"type":"response.output_text.delta","delta":"Check the return value."}\n\ndata: {"type":"response.completed"}\n\n' });
      }
      const file = pathname.includes('.') ? pathname.slice(1) : 'index.html';
      const filename = path.resolve(root, file);
      if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename)) return route.fulfill({ status: 404 });
      await route.fulfill({ contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', body: fs.readFileSync(filename) });
    });
    let tests = 0;
    for (const spec of specs) {
      await page.goto(`http://step6.test/${spec.id}?section=6`);
      assert.equal(await page.locator('[data-section="6"]').count(), 1, spec.id);
      assert.equal(await page.locator('.coding-inputs textarea').count(), spec.parameters.length, spec.id);
      assert.equal(await page.locator('#coding-graph-disclosure').count(), 1, `${spec.id}: graph scratchpad missing`);
      assert.equal(await page.locator('#coding-graph-disclosure').getAttribute('open'), null, `${spec.id}: graph scratchpad should start closed`);
      assert.equal(await page.locator('#graph-lab').isVisible(), false, `${spec.id}: closed graph scratchpad is visible`);
      for (let i = 0; i < spec.parameters.length; i++) assert.equal(await page.locator(`#coding-input-${i}`).inputValue(), '', `${spec.id}: blank field`);
      assert.equal(await page.locator('#ai-help button').count(), 1);
      if (spec === specs[0]) {
        await page.locator('#coding-graph-disclosure summary').click();
        assert.equal(await page.locator('#coding-graph-disclosure').getAttribute('open'), '', `${spec.id}: graph scratchpad did not open`);
        assert.equal(await page.locator('#graph-lab').isVisible(), true, `${spec.id}: opened graph scratchpad is hidden`);
        await page.locator('#graph-add-node').click();
        assert.equal(await page.locator('.scratch-node').count(), 1, `${spec.id}: graph editor did not add a node`);
        await page.locator('#graph-clear').click();
        await page.locator('#graph-clear').click();
        assert.equal(await page.locator('.scratch-node').count(), 0, `${spec.id}: graph editor did not clear its scratch node`);
      }
      await page.locator('#coding-editor').fill(spec.correctCode);
      await page.locator('#coding-submit').click();
      await page.waitForFunction(() => !document.querySelector('#coding-submit').disabled);
      assert.equal(await page.locator('.coding-test.is-correct').count(), spec.tests.length, `${spec.id}: ${await page.locator('#coding-results').innerText()}`);
      tests += spec.tests.length;
      for (let i = 0; i < spec.parameters.length; i++) await page.locator(`#coding-input-${i}`).fill(JSON.stringify(spec.tests[0].args[i]));
      await page.locator('#coding-run').click();
      await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
      assert.match(await page.locator('#coding-results').innerText(), /Returned/, spec.id);
    }
    const spec = specs.find(item => item.id === 'coins-on-level-k');
    await page.goto(`http://step6.test/${spec.id}?section=6`);
    const editor = page.locator('#coding-editor');
    await editor.fill(`function ${spec.functionName}(items, k) {\n  missingVariable();\n}`);
    await page.locator('#coding-input-0').fill('[1,[2]]');
    await page.locator('#coding-input-1').fill('2');
    await page.locator('#coding-run').click();
    await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
    assert.match(await page.locator('#coding-results').innerText(), /ReferenceError · line 2, column 3/);
    await page.locator('#ai-help button').click();
    await page.waitForFunction(() => document.querySelector('.ai-help-answer').textContent === 'Check the return value.');
    assert.equal(aiPayload.attempt.correctCode, spec.correctCode);
    assert.equal(aiPayload.attempt.studentCode, await editor.inputValue());
    assert.equal(aiPayload.attempt.runResult.error.line, 2);
    await editor.fill(`function ${spec.functionName}(items, k) {\n  return ; )\n}`);
    await page.locator('#coding-run').click();
    await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
    assert.match(await page.locator('#coding-results').innerText(), /SyntaxError · line 2/);
    await editor.fill(`function ${spec.functionName}(items, k) {\n  console.log('hello');\n  return k;\n}`);
    await page.locator('#coding-run').click();
    await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
    assert.match(await page.locator('#coding-results').innerText(), /hello/);
    await page.locator('#coding-input-1').fill('3');
    await page.locator('#ai-help button').click();
    await page.waitForFunction(() => document.querySelector('.ai-help-answer').textContent === 'Check the return value.');
    assert.equal(aiPayload.attempt.inputs[1].raw, '3');
    assert.equal(aiPayload.attempt.runResult, undefined, 'Stale results must not reach AI');
    await editor.fill(`function ${spec.functionName}() { while (true) {} }`);
    await page.locator('#coding-run').click();
    await page.waitForFunction(() => !document.querySelector('#coding-run').disabled);
    assert.match(await page.locator('#coding-results').innerText(), /Time limit/);
    await page.locator('#coding-run').click();
    await editor.fill(spec.correctCode);
    await page.waitForTimeout(1700);
    assert.equal(await page.locator('#coding-results').innerText(), '');
    await page.reload();
    assert.equal(await editor.inputValue(), spec.correctCode);
    assert.equal(await page.locator('#coding-input-1').inputValue(), '3');
    await page.locator('#coding-submit').click();
    await page.waitForFunction(() => !document.querySelector('#coding-submit').disabled);
    assert.equal(await page.locator('.coding-test.is-correct').count(), 8);
    const storageKey = `dfs-coding:${spec.id}:v1`;
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).passed, storageKey), true);
    await page.locator('#coding-input-1').fill('4');
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).passed, storageKey), true);
    await editor.fill(spec.correctCode + '\n// edited');
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).passed, storageKey), false);
    await page.locator('#coding-input-1').fill('bad JSON');
    await page.locator('#coding-run').click();
    assert.match(await page.locator('#coding-results').innerText(), /format of k/);
    await page.locator('#coding-input-1').fill('2');
    await page.reload();
    await page.screenshot({ path: '/tmp/step6-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('[data-section="6"]').isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No mobile page overflow');
    await page.screenshot({ path: '/tmp/step6-mobile.png', fullPage: true });
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#reset-btn').click();
    assert.equal(await editor.inputValue(), spec.starterCode);
    assert.equal(await page.locator('#coding-input-0').inputValue(), '');
    for (const id of ['flood-fill', 'ten-kinds-of-people']) {
      await page.goto(`http://step6.test/${id}?section=6`);
      assert.equal(await page.locator('[data-section="6"]').count(), 0);
      assert.equal(await page.locator('#coding-editor').count(), 0);
    }
    assert.deepEqual(errors, []);
    console.log(`Step 6 browser checks passed: ${specs.length} variants, ${tests} tests; run, errors/lines, logs, timeout/cancel, persistence, reset, mobile, fresh AI context.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
