const assert = require('node:assert/strict');
const { handleAiHelp } = require('../netlify/functions/lib/ai-help.cjs');
const url = 'http://localhost:4176/api/ai-help';
const payload = {
  section: 6,
  problem: { id: 'counting-constellations', title: 'Counting Constellations' },
  attempt: {
    kind: 'code', functionName: 'countConstellations',
    correctCode: 'function countConstellations(sky) { return countGroups(sky); }',
    studentCode: 'function countConstellations(sky) {\r\n  return missing;\r\n}',
    inputs: { sky: '[[1,0],[0,1]]' },
    runResult: { ok: false, error: { name: 'ReferenceError', message: 'missing is not defined', line: 2, column: 3 } },
    testResults: []
  }
};
const request = body => new Request(url, { method: 'POST', headers: { origin: 'http://localhost:4176' }, body: JSON.stringify(body) });

(async () => {
  let sent;
  const response = await handleAiHelp(request(payload), {
    apiKey: 'test-key',
    fetchApi: async (_, options) => {
      sent = JSON.parse(options.body);
      return new Response('data: {"type":"response.output_text.delta","delta":"Line 2 uses a name that has no value."}\n\ndata: {"type":"response.completed"}\n\n');
    }
  });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Line 2/);
  const context = JSON.parse(sent.input);
  assert.equal(context.attempt.studentCode, payload.attempt.studentCode);
  assert.equal(context.attempt.correctCode, payload.attempt.correctCode);
  assert.equal(context.attempt.runResult.error.line, 2);
  assert.deepEqual(context.numberedStudentCode, [
    { line: 1, code: 'function countConstellations(sky) {' },
    { line: 2, code: '  return missing;' },
    { line: 3, code: '}' }
  ]);
  assert.match(sent.instructions, /Do not say tests failed when they were never run/);
  assert.match(sent.instructions, /A different correct approach is fine/);
  assert.doesNotMatch(sent.instructions, /opening MUST/);
  assert.equal(context.verifiedGraphMistakes, undefined);
  assert.equal(sent.store, false);
  assert.equal(sent.stream, true);
  const invalid = await handleAiHelp(request({ ...payload, attempt: { studentCode: '' } }), { apiKey: 'test-key', fetchApi: () => { throw new Error('Must not call provider'); } });
  assert.equal(invalid.status, 400);
  console.log('Step 6 AI checks passed: correct/student code, exact line numbers, inputs, errors, streaming, and honest unrun-test guidance.');
})().catch(error => { console.error(error); process.exitCode = 1; });
