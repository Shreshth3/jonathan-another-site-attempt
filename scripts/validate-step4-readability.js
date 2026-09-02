const fs = require("fs");

const files = [
  "step4-specs-original.json",
  "step4-specs-variant.json",
  "step4-specs-new.json",
];

const failures = [];
let codeCount = 0;

for (const file of files) {
  const problems = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const problem of problems) {
    for (const lessonCase of problem.cases) {
      if (typeof lessonCase.code !== "string") continue;
      codeCount++;

      const lines = lessonCase.code.split("\n");
      if (lessonCase.code.includes("?.")) {
        failures.push(`${problem.id}/${lessonCase.caseId}: code hides a bounds check with optional chaining`);
      }
      if (/\b(?:dr|dc|nr|nc|nx|ny|cur|dirs|seen|dfs|best|MOD)\b/.test(lessonCase.code)) {
        failures.push(`${problem.id}/${lessonCase.caseId}: code uses a cryptic traversal name`);
      }
      if (/\.reduce\(/.test(lessonCase.code)) {
        failures.push(`${problem.id}/${lessonCase.caseId}: code hides traversal work inside reduce`);
      }
      if (/return\s*\([^\n]*=[^=]/.test(lessonCase.code)) {
        failures.push(`${problem.id}/${lessonCase.caseId}: code assigns a value inside return`);
      }
      const boundsHelperCount = (
        lessonCase.code.match(/function isInBounds\s*\(/g) || []
      ).length;
      if (boundsHelperCount > 1) {
        failures.push(`${problem.id}/${lessonCase.caseId}: code repeats the bounds helper`);
      }
      if (
        problem.id === "kattis-getting-gold" &&
        !lessonCase.code.includes("isInBounds(grid, nextRow, nextColumn)")
      ) {
        failures.push(`${problem.id}/${lessonCase.caseId}: neighbor access needs an explicit bounds check`);
      }
      if (
        problem.id === "detonate-the-maximum-bombs" &&
        /\bnumberOfNodes\b/.test(lessonCase.code)
      ) {
        failures.push(`${problem.id}/${lessonCase.caseId}: a single neighbor is named like a count`);
      }
      if (
        problem.id === "usaco-fence-planning" &&
        /\blargestValue\b/.test(lessonCase.code)
      ) {
        failures.push(`${problem.id}/${lessonCase.caseId}: minimum perimeter has a maximum-style name`);
      }
      if (
        problem.id === "number-of-islands" &&
        /\b(?:xCoordinate|yCoordinate|xDifference|yDifference)\b/.test(lessonCase.code)
      ) {
        failures.push(`${problem.id}/${lessonCase.caseId}: grid positions need row and column names`);
      }
      for (const [index, line] of lines.entries()) {
        if (line.length > 90) {
          failures.push(
            `${problem.id}/${lessonCase.caseId}: code line ${index + 1} is ${line.length} characters long`,
          );
        }

        const statements = (line.match(/;/g) || []).length;
        const isForLoopHeader = line.trimStart().startsWith("for (");
        if (statements > (isForLoopHeader ? 2 : 1)) {
          failures.push(
            `${problem.id}/${lessonCase.caseId}: code line ${index + 1} squeezes together too many steps`,
          );
        }
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${codeCount} Step 4 snippets for beginner-readable layout.`);
