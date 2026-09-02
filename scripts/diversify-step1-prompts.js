const fs = require("fs");
const path = require("path");

const files = ["visual-lessons-original.json", "visual-lessons-variant.json", "visual-lessons-new.json"];
let problemIndex = 0, changed = 0;
for (const name of files) {
  const file = path.resolve(__dirname, "..", name);
  const lessons = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const lesson of lessons) {
    lesson.buildTasks.forEach((task, buildIndex) => {
      task.prompt = `Practice case ${problemIndex + 1}.${buildIndex + 1}: Infer the graph from the raw input. Then answer from your drawing.`;
      changed++;
    });
    problemIndex++;
  }
  fs.writeFileSync(file, JSON.stringify(lessons, null, 2) + "\n");
}
console.log(`Diversified ${changed} Step 1 build prompts.`);
