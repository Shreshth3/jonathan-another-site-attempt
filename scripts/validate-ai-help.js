// Start local-ai-server.js first. This test uses fake replies; it spends no API credits.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.TEST_URL || 'http://localhost:4173';
    const requests = [];
    await page.route('**/api/ai-help', async route => {
      requests.push(route.request().postDataJSON());
      if (requests.length === 2) return route.fulfill({ status: 502, body: 'Please try again.' });
      const events = [
        { type: 'response.output_text.delta', delta: 'Add the missing ' },
        { type: 'response.output_text.delta', delta: 'train-car nodes.' },
        { type: 'response.completed' }
      ];
      await route.fulfill({ contentType: 'text/event-stream', body: events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('') });
    });
    await page.goto(`${base}/longest-freight-train?section=4`);
    assert.equal(await page.locator('#ai-help').count(), 0);
    await page.evaluate(() => {
      window.DFS_GRAPH.setSnapshot({ nodes: [{ id: 'n0', label: '(0,0)', x: 100, y: 100 }], edges: [], directed: false });
      window.dispatchEvent(new Event('dfs-graph-change'));
    });
    await page.locator('[data-choice-id]').first().click();
    await page.locator('#reasoning-output').fill('0');
    await page.locator('#reasoning-correct-output').fill('0');
    await page.locator('#reasoning-check').click();
    await page.locator('#ai-help button').click();
    await page.waitForFunction(() => document.querySelector('#ai-help button')?.textContent === 'Ask AI again');
    assert.equal(await page.locator('.ai-help-answer').innerText(), 'Add the missing train-car nodes.');
    assert.equal(requests[0].attempt.round.canvas.nodes.length, 3);
    assert.equal(requests[0].attempt.studentGraph.nodes.length, 1);
    await page.evaluate(() => {
      const graph = window.DFS_GRAPH.getSnapshot();
      graph.nodes.push({ id: 'n1', label: '(0,2)', x: 200, y: 100 });
      window.DFS_GRAPH.setSnapshot(graph);
      window.dispatchEvent(new Event('dfs-graph-change'));
    });
    assert.equal(await page.locator('#ai-help').count(), 0);
    await page.locator('#reasoning-output').fill('1');
    await page.locator('#reasoning-check').click();
    await page.locator('#ai-help button').click();
    await page.waitForFunction(() => document.querySelector('#ai-help button')?.textContent === 'Ask AI again');
    assert.equal(requests[1].attempt.studentGraph.nodes.length, 2);
    assert.equal(requests[1].attempt.studentBuggyOutput, '1');
    assert.equal(await page.locator('.ai-help-answer').innerText(), 'Please try again.');
    await page.locator('#ai-help button').click();
    await page.waitForFunction(() => document.querySelector('#ai-help button')?.textContent === 'Ask AI again');
    assert.equal(await page.locator('.ai-help-answer').innerText(), 'Add the missing train-car nodes.');
    assert.equal((await page.request.get(`${base}/.env`)).status(), 404);
    assert.equal((await page.request.get(`${base}/scripts/local-ai-server.js`)).status(), 404);
    assert.deepEqual(errors, []);
    console.log('PASS: answer-key context, streamed events, fresh graph/output, error retry, and private files.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
