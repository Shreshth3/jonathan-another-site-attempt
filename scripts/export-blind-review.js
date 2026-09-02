const fs = require("fs");
const path = require("path");

const category = process.argv[2];
if (!['original', 'variant', 'new'].includes(category)) {
  console.error('Usage: node scripts/export-blind-review.js <original|variant|new>');
  process.exit(1);
}

const lessons = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../visual-lessons-${category}.json`), 'utf8'));

function hash(value) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function hideAnswer(problemId, taskId, input, prompt, choices) {
  return {
    problemId,
    taskId,
    input,
    prompt,
    choices: choices
      .map(choice => ({ sourceId: choice.id, label: choice.label, model: choice.model }))
      .sort((a, b) => hash(`${problemId}:${taskId}:${a.sourceId}`) - hash(`${problemId}:${taskId}:${b.sourceId}`))
      .map((choice, index) => ({ slot: String.fromCharCode(65 + index), label: choice.label, model: choice.model }))
  };
}

const review = lessons.flatMap(lesson => [
  ...lesson.buildTasks.map(task => hideAnswer(lesson.id, task.id, task.input, task.decision.prompt, task.decision.choices)),
  ...lesson.conceptTasks.flatMap(task => [
    hideAnswer(lesson.id, task.id, task.input, task.prompt, task.choices),
    hideAnswer(lesson.id, task.remedial.id, task.remedial.input, task.remedial.decision.prompt, task.remedial.decision.choices)
  ])
]);

process.stdout.write(`${JSON.stringify(review, null, 2)}\n`);
