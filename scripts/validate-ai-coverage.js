// Exercise every failed-question path without making API calls.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(process.env.TEST_ASSETS || '.');
const hook = `
window.testAiCoverage = async () => {
  let count = 0;
  const verify = async (label) => {
    const button = document.querySelector('#ai-help button');
    if (!button) throw new Error(problem.id + ': missing AI button: ' + label);
    let payload;
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      payload = JSON.parse(options.body);
      return new Response('data: {"type":"response.output_text.delta","delta":"Your graph is incorrect."}\\n\\ndata: {"type":"response.completed"}\\n\\n', {headers:{'content-type':'text/event-stream'}});
    };
    try { await button.onclick(); } finally { window.fetch = originalFetch; }
    if (!payload?.attempt || payload.problem.title !== problem.title) throw new Error('Missing/wrong context: ' + label);
    if (!document.querySelector('.ai-help-answer').textContent.includes('Your graph is incorrect.')) throw new Error('Stream failed: ' + label);
    count++;
  };
  section = 1;
  for (let i = 0; i < mainTasks().length; i++) {
    progress.index = i; progress.remedialFor = null; render();
    const task = currentTask();
    if (task.kind === 'build') {
      selectedId = task.decision.choices.find(c => c.id !== task.decision.correct).id;
      checkBuild(task);
      await verify('build ' + i);
    } else {
      selectedId = task.choices.find(c => c.id !== task.correct).id;
      checkConcept(task);
      await verify('visual check ' + i);
      render();
      const repair = currentTask();
      selectedId = repair.decision.choices.find(c => c.id !== repair.decision.correct).id;
      checkBuild(repair);
      await verify('repair ' + i);
    }
  }
  section = 2;
  for (let i = 0; i < counterexampleRounds().length; i++) {
    counterProgress.index = i; render();
    window.DFS_GRAPH.setSnapshot({nodes:[],edges:[],directed:false});
    checkCounterexample(counterexampleRounds()[i]);
    await verify('counterexample ' + i);
  }
  section = 3;
  for (let i = 0; i < structureTasks().length; i++) {
    structureProgress.index = i; render();
    let round = structureTasks()[i];
    checkStructureClaims(round.claims, round.claims.map(c => !c.correct), round.task, i, 5);
    await verify('claim ' + i);
    render(); round = structureTasks()[i];
    window.DFS_GRAPH.setSnapshot({nodes:[{id:'invalid',label:'invalid',x:100,y:100}],edges:[],directed:!round.task.canvas.directed});
    checkStructureClaims(round.claims, round.claims.map(c => c.correct), round.task, i, 5);
    await verify('claim graph ' + i);
  }
  section = 4;
  for (let i = 0; i < reasoningRounds().length; i++) {
    reasoningProgress.index = i; render();
    const round = reasoningRounds()[i];
    selectedId = round.diagnoses.find(c => c.id !== round.correctDiagnosis).id;
    document.querySelector('#reasoning-output').value = '0';
    document.querySelector('#reasoning-correct-output').value = '0';
    checkReasoning(round);
    await verify('code reasoning ' + i);
  }
  return count;
};
`;
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1);
  const file = ['visual-library.js', 'visual-data.js', 'graph.js', 'styles.css'].includes(name) ? name : 'index.html';
  let body = fs.readFileSync(path.join(root, file), 'utf8');
  if (file === 'visual-library.js') body = body.replace('  start();\n})();', hook + '  start();\n})();');
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
  res.end(body);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.goto(base);
    const ids = await page.evaluate(() => window.DFS_VISUAL_DATA.problems.map(p => p.id));
    let count = 0;
    for (const [i, id] of ids.entries()) {
      await page.goto(base + '/' + id);
      count += await page.evaluate(() => window.testAiCoverage());
      if ((i + 1) % 15 === 0) console.log('Checked', i + 1, 'problems');
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('PASS:', count, 'failed-question paths across', ids.length, 'problems, including remedial questions.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
