const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
function drawing(items) {
  const result = { nodes: [], edges: [], directed: true, nextNodeId: 0, nextEdgeId: 0 };
  function visit(value, parent) {
    const id = result.nextNodeId++;
    result.nodes.push({ id, label: Array.isArray(value) ? 'Array' : String(value), x: 80 + (id % 4) * 130, y: 80 + Math.floor(id / 4) * 130, r: 32, color: 'slate' });
    if (parent !== undefined) result.edges.push({ id: result.nextEdgeId++, from: parent, to: id, color: 'slate', label: '' });
    if (Array.isArray(value)) value.forEach(child => visit(child, id));
  }
  visit(items);
  return result;
}
const cases = [
  ['busiest-shelf-level', 'items', [ [[2,2]], null, 2, 0, 'shallow-search' ], [ [2,2], null, 1, 0, 'reverse-arrows' ]],
  ['coins-on-level-k', 'items', [ [2,2], 1, 4, 2, 'drop-last-edge' ], [ [2,2], 1, 4, 0, 'wrong-start' ]],
  ['kth-song-in-playlist', 'playlist', [ [2,3], 1, 2, 3, 'last-branch' ], [ [[2,2]], 1, 2, -1, 'shallow-search' ]],
  ['top-of-the-pile', 'items', [ [2,2], null, 4, 0, 'reverse-arrows' ], [ [2,2], null, 4, 2, 'wrong-start' ]]
];
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    let aiPayload;
    page.on('pageerror', error => errors.push(error.message));
    await page.route('http://nested.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname === '/api/ai-help') {
        aiPayload = route.request().postDataJSON();
        return route.fulfill({ contentType: 'text/event-stream', body: 'data: {"type":"response.output_text.delta","delta":"Check the Number nodes."}\n\ndata: {"type":"response.completed"}\n\n' });
      }
      const file = pathname.includes('.') ? pathname.slice(1) : 'index.html';
      const filename = path.resolve(root, file);
      if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename)) return route.fulfill({ status: 404 });
      return route.fulfill({ contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', body: fs.readFileSync(filename) });
    });
    const setDrawing = async graph => page.evaluate(graph => { window.DFS_GRAPH.setSnapshot(graph); window.dispatchEvent(new Event('dfs-graph-change')); }, graph);
    for (const [id, field, ...rounds] of cases) {
      await page.goto(`http://nested.test/${id}?section=2`);
      assert.equal(await page.locator('#counter-start').isVisible(), false, `${id}: path-based start field`);
      assert.equal(await page.locator('[data-counter-semantic]').count(), field === 'playlist' || id === 'coins-on-level-k' ? 2 : 1);
      assert.equal(await page.locator(`#counter-field-${field}`).evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('#graph-lab')) & Node.DOCUMENT_POSITION_FOLLOWING)), true, `${id}: input should precede drawing`);
      for (const [index, [items, k, correct, buggy, bug]] of rounds.entries()) {
        assert.doesNotMatch(await page.locator('#challenge').innerText(), /root\[|root=|root\b|node=value/);
        await page.locator(`#counter-field-${field}`).fill(JSON.stringify(items));
        if (k !== null) await page.locator('#counter-field-k').fill(String(k));
        const graph = drawing(items);
        await setDrawing(graph);
        await page.locator('[data-counter-drawing="mistaken"]').click();
        await page.locator('#counter-duplicate-graph').click();
        const mistaken = structuredClone(graph);
        if (bug === 'reverse-arrows') mistaken.edges.forEach(edge => { [edge.from, edge.to] = [edge.to, edge.from]; });
        if (bug === 'drop-last-edge') mistaken.edges.pop();
        await setDrawing(mistaken);
        await page.locator('#counter-real-output').fill(String(correct));
        await page.locator('#counter-bug-output').fill(String(buggy));
        if (index === 0) {
          await page.reload();
          assert.deepEqual(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes.map(node => node.label)), mistaken.nodes.map(node => node.label));
          assert.equal(await page.locator(`#counter-field-${field}`).inputValue(), JSON.stringify(items));
        }
        // An almost-correct second drawing must not pass just because its output is right.
        const badDrawing = structuredClone(mistaken);
        badDrawing.nodes.at(-1).label = '99';
        await setDrawing(badDrawing);
        await page.locator('#counter-check').click();
        assert.doesNotMatch(await page.locator('#feedback-slot').innerText(), /Counterexample confirmed/, `${id} ${bug}: accepted a changed number`);
        if (id === 'busiest-shelf-level' && index === 0) {
          await page.locator('#ai-help button').click();
          await page.waitForFunction(() => document.querySelector('.ai-help-answer').textContent === 'Check the Number nodes.');
          assert.equal(aiPayload.section, 2);
          assert.equal(aiPayload.problem.graphRules.drawingEditor.mode, 'array-number');
          assert.equal(aiPayload.problem.graphRules.drawingEditor.ordered, true);
          assert.equal(aiPayload.problem.graphRules.drawingEditor.globalOrder, true);
          assert.match(aiPayload.problem.graphRules.privateIds, /Never show these IDs/);
          for (const key of ['expectedGraph', 'expectedMistakenGraph']) {
            assert.equal(aiPayload.attempt[key].nodeLabelMode, 'array-number');
            assert.ok(aiPayload.attempt[key].nodes.every(node => node.label === 'Array' || /^-?\d+$/.test(node.label)));
          }
        }
        await setDrawing(mistaken);
        if (id === 'busiest-shelf-level' && index === 0) {
          await page.locator(`#counter-field-${field}`).fill('[[2,99]]');
          await page.locator('#counter-check').click();
          assert.match(await page.locator('#feedback-slot').innerText(), /must match your nested array/);
          await page.locator(`#counter-field-${field}`).fill(JSON.stringify(items));
        }
        await page.locator('#counter-check').click();
        assert.match(await page.locator('#feedback-slot').innerText(), /Counterexample confirmed/, `${id} ${bug}: ${await page.locator('#feedback-slot').innerText()}`);
        assert.doesNotMatch(await page.locator('#feedback-slot').innerText(), /root\[|root=/);
        await page.locator('#counter-check').click();
      }
    }
    await page.evaluate(() => localStorage.clear());
    for (const [id] of cases) {
      await page.goto(`http://nested.test/${id}?section=6`);
      await page.locator('#coding-graph-disclosure summary').click();
      assert.match(await page.locator('#graph-lab').getAttribute('class'), /array-number-editor/);
      await page.locator('#graph-add-node').click();
      assert.equal(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes[0].label), 'Array');
      await page.locator('.scratch-node').click({ button: 'right' });
      await page.locator('#graph-color-menu').getByRole('button', { name: 'Number', exact: true }).click();
      await page.locator('#graph-rename-input').fill('7');
      await page.locator('#graph-rename-input').press('Enter');
      assert.equal(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes[0].label), '7');
      await page.locator('[data-section="2"]').click();
      assert.equal(await page.locator('#counter-start').isVisible(), false);
      assert.match(await page.locator('#graph-lab').getAttribute('class'), /array-number-editor/);
      assert.equal(await page.locator('.scratch-node').count(), 0, `${id}: coding drawing leaked into Step 2`);
    }
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://nested.test/busiest-shelf-level?section=2');
    await page.locator('#graph-add-node').click();
    assert.equal(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes[0].label), 'Array');
    await page.locator('.scratch-node').click({ button: 'right' });
    await page.locator('#graph-color-menu').getByRole('button', { name: 'Number', exact: true }).click();
    await page.locator('#graph-rename-input').fill('7');
    await page.locator('#graph-rename-input').press('Enter');
    assert.equal(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes[0].label), '7');
    await page.locator('.scratch-node').click({ button: 'right' });
    await page.locator('#graph-color-menu').getByRole('button', { name: 'Array', exact: true }).click();
    assert.equal(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes[0].label), 'Array');
    await page.locator('#graph-add-node').click();
    await page.locator('.scratch-node[data-node-id="1"]').click({ button: 'right' });
    await page.locator('#graph-color-menu').getByRole('button', { name: 'Number', exact: true }).click();
    await page.locator('#graph-rename-input').fill('7');
    await page.locator('#graph-rename-input').press('Enter');
    await page.locator('.scratch-node[data-node-id="0"]').click();
    await page.locator('.scratch-node[data-node-id="1"]').click();
    assert.deepEqual(await page.evaluate(() => window.DFS_GRAPH.getSnapshot().edges.map(edge => [edge.from, edge.to])), [[0, 1]], 'click parent then child must create an arrow');
    await page.screenshot({ path: '/tmp/nested-step2-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile overflow');
    await page.screenshot({ path: '/tmp/nested-step2-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('Nested Step 2 browser checks passed: all 8 active questions, repeated numbers, reversed arrows, disconnected mistaken graph, wrong starts, fields/draft restore, type menu, no path labels, mobile.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
