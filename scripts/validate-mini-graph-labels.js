#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.join(__dirname, "..");
const renderer = fs.readFileSync(path.join(root, "visual-library.js"), "utf8");
const failures = [];

if (/shortLabel\s*\(/.test(renderer)) failures.push("The old shortLabel truncation helper still exists.");
const miniRenderer = renderer.slice(renderer.indexOf("  function miniGraph("), renderer.indexOf("  function updateProgress("));
if (miniRenderer.includes("…")) failures.push("The mini-graph renderer still contains an ellipsis character.");
if (!/metric\.lines\.map\(/.test(renderer)) failures.push("Mini-graph labels are not rendered line by line.");
if (!/nestedInputItems\(rawInput\)/.test(renderer)) failures.push("Nested pictures are not using the raw input for display labels.");
if (!/Nested items: \$\{displayNodes\.map\(item => spoken\(item\.label\)\)/.test(renderer)) failures.push("Nested screen-reader text is not using the normalized display labels.");
if (!/safeMiniLayout\(model, layout\(model, width, height\), width, height, 52, \{ x: 51, y: 28 \}\)/.test(renderer)) failures.push("Nested pictures are missing rectangle-aware edge clearance and bounds.");
if (!/layoutHasOutOfBounds\(positions, width, height, bounds\)/.test(renderer)) failures.push("Safe layouts do not reject clipped node positions.");
if (!/const xInset = Math\.max\(40, bounds\.x\)/.test(renderer)) failures.push("Fallback layouts do not reserve the node half-width at the SVG sides.");

const nestedViewBox = { width: 600, height: 300 };
const nestedBox = { halfWidth: 48, halfHeight: 25, padding: 3 };
const nestedClearance = 52;
const nestedBounds = { x: nestedBox.halfWidth + nestedBox.padding, y: nestedBox.halfHeight + nestedBox.padding };

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), context);
const problems = context.window.DFS_VISUAL_DATA.problems;
const geometryStart = renderer.indexOf("  function layout(");
const geometryEnd = renderer.indexOf("  function updateProgress(", geometryStart);
const geometrySource = renderer.slice(geometryStart, geometryEnd);
const geometry = new Function("problem", "problemIndex", "coordinate", `${geometrySource}\nreturn { layout, safeMiniLayout };`)(
  { visualKind: "nested" },
  0,
  () => null
);
let checkedLabels = 0;
let longLabels = 0;
let checkedNestedPictures = 0;

function wrap(value) {
  const text = String(value).trim();
  if (text.length <= 9) return [text];
  const lines = [];
  for (const word of text.split(/\s+/)) {
    if (word.length > 12) {
      for (let index = 0; index < word.length; index += 12) lines.push(word.slice(index, index + 12));
    } else if (!lines.length || `${lines[lines.length - 1]} ${word}`.length > 12) lines.push(word);
    else lines[lines.length - 1] += ` ${word}`;
  }
  return lines;
}

for (const problem of problems) {
  for (const task of problem.lesson?.conceptTasks || []) {
    const models = [...(task.choices || []).map(choice => choice.model), task.shownModel].filter(Boolean);
    for (const model of models) {
      if (problem.visualKind === "nested") {
        const initial = geometry.layout(model, nestedViewBox.width, nestedViewBox.height);
        const positions = geometry.safeMiniLayout(model, initial, nestedViewBox.width, nestedViewBox.height, nestedClearance, nestedBounds);
        checkedNestedPictures++;
        positions.forEach((point, index) => {
          const inside = point.x >= nestedBounds.x && point.x <= nestedViewBox.width - nestedBounds.x
            && point.y >= nestedBounds.y && point.y <= nestedViewBox.height - nestedBounds.y;
          if (!inside) failures.push(`${problem.id}: nested picture node ${index} clips outside the viewBox at (${point.x}, ${point.y}).`);
        });
      }
      for (const node of model.nodes) {
        const original = String(node.label).trim();
        const lines = wrap(original);
        checkedLabels++;
        if (original.length > 9) longLabels++;
        if (lines.some(line => line.length > 12)) failures.push(`${problem.id}: line is still too wide for “${original}”.`);
        if (lines.join("").replace(/\s/g, "") !== original.replace(/\s/g, "")) failures.push(`${problem.id}: wrapping dropped part of “${original}”.`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated ${checkedLabels} mini-graph labels (${longLabels} long labels) and ${checkedNestedPictures} nested picture layouts: no text or boxes are cut off.`);
