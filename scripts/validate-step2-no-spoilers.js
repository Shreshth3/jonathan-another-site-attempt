const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'visual-data.js'), 'utf8'), box);
const variants = box.window.DFS_VISUAL_DATA.problems.filter(problem => problem.category === 'variant');
const objective = 'Create a valid input where the mistaken search returns a different answer from the correct solution.';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const transcripts = [];
  try {
    // The second pass exposes the preserved third question only inside this test.
    for (const questionCount of [2, 3]) {
      const page = await browser.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.route('http://step2-review.test/**', route => {
        const pathname = new URL(route.request().url()).pathname;
        if (pathname.startsWith('/api/')) return route.fulfill({ status: 503, body: '' });
        const filename = pathname.includes('.') ? pathname.slice(1) : 'index.html';
        let body = fs.readFileSync(path.join(root, filename), 'utf8');
        if (filename === 'visual-library.js' && questionCount === 3) {
          assert.match(body, /step2Questions: 2/);
          body = body.replace('step2Questions: 2', 'step2Questions: 3');
        }
        return route.fulfill({ body, contentType: filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.css') ? 'text/css' : 'text/html' });
      });
      for (const problem of variants) {
        assert.equal(problem.counterexampleLesson.rounds.length, 3, `${problem.id}: preserved pool`);
        for (const round of problem.counterexampleLesson.rounds) assert.equal(round.goal, objective, `${problem.id}: source task contains guidance beyond the objective`);
        await page.goto(`http://step2-review.test/${problem.id}?section=2`);
        for (let index = 0; index < questionCount; index++) {
          const label = `${problem.id}/question-${index + 1}`;
          const goal = await page.locator('.counter-main-goal').innerText();
          assert.ok(goal.includes(objective), `${label}: missing counterexample objective`);
          assert.match(goal, /Draw two graphs: first the correct graph/);
          assert.match(goal, /Predict the correct output and .+ output/i);
          assert.doesNotMatch(goal, /two (?:calls|levels|hops)|smallest|Make the last|Put a |Use a |Build a |Add a /i, `${label}: construction guidance returned`);
          assert.equal(await page.locator('.case-mistake p').count(), 1, `${label}: exactly one bug must be stated`);
          assert.ok((await page.locator('.case-mistake').innerText()).trim().length > 20, `${label}: missing bug description`);
          assert.equal(await page.locator('#feedback-slot').innerText(), '', `${label}: feedback leaked before submission`);
          assert.equal(await page.locator('#counter-real-output').inputValue(), '', `${label}: prefilled correct output`);
          assert.equal(await page.locator('#counter-bug-output').inputValue(), '', `${label}: prefilled buggy output`);
          assert.equal(await page.locator('[data-counter-drawing]').count(), 2, `${label}: missing drawing`);
          assert.match(await page.locator('#evidence-label').innerText(), new RegExp(`of ${questionCount}`, "i"));
          for (const mode of ['correct', 'mistaken']) {
            await page.locator(`[data-counter-drawing="${mode}"]`).click();
            const graph = await page.evaluate(() => window.DFS_GRAPH.getSnapshot());
            assert.equal(graph.nodes.length, 0, `${label}/${mode}: prewritten graph nodes`);
            assert.equal(graph.edges.length, 0, `${label}/${mode}: prewritten graph edges`);
          }
          if (problem.id === 'save-the-date-phone-chain' && index === 0 && questionCount === 2) {
            fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
            await page.screenshot({ path: path.join(root, 'tmp/step2-save-the-date-desktop.png'), fullPage: true });
            await page.setViewportSize({ width: 390, height: 844 });
            await page.screenshot({ path: path.join(root, 'tmp/step2-save-the-date-mobile.png'), fullPage: true });
            await page.setViewportSize({ width: 1280, height: 720 });
          }
          const round = problem.counterexampleLesson.rounds[index];
          if (round.bugs.includes('wrong-start')) assert.ok((await page.locator('.counter-drawing-rules').innerText()).includes(round.mistakenStartLabel), `${label}: missing required wrong start`);
          if (questionCount === 3) transcripts.push({ id: problem.id, question: index + 1, text: await page.locator('#challenge').innerText(), placeholders: await page.locator('#challenge input, #challenge textarea').evaluateAll(fields => fields.map(field => ({ id: field.id, placeholder: field.getAttribute('placeholder'), value: field.value }))) });
          await page.locator('#next-question-btn').click();
        }
        assert.match(await page.locator('#challenge').innerText(), /Step 2 (?:complete|finished)/);
        assert.equal(await page.locator('#start-after-counter').count(), 1);
      }
      await page.close();
    }
    assert.deepEqual(errors, [], 'browser errors');
    fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
    fs.writeFileSync(path.join(root, 'tmp/step2-no-spoilers-review.json'), JSON.stringify(transcripts, null, 2));
    console.log(`Verified ${variants.length} variants: all 50 active questions and 75 preserved questions have a clear objective, blank drawings/outputs, one stated bug, and working completion.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
