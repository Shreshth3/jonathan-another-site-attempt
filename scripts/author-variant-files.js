/* Shared writers for scripts/author-*.js problem-authoring scripts.
 * Every writer replaces the problem's entry in place, so re-running an
 * authoring script is idempotent and leaves other problems untouched.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// Keep each file's existing style: some store non-ASCII text as \u escapes.
function upsert(file, entry) {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, "utf8");
  const list = JSON.parse(text);
  const index = list.findIndex(item => item.id === entry.id);
  if (index >= 0) list[index] = entry; else list.push(entry);
  let written = JSON.stringify(list, null, 2) + "\n";
  if (/\\u[0-9a-f]{4}/.test(text)) written = written.replace(/[\u007f-￿]/g, char => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
  fs.writeFileSync(full, written);
}

function writeSource(file, problem) {
  fs.writeFileSync(path.join(root, "source/jonathan-study-site/data", file), JSON.stringify([problem], null, 2) + "\n");
}

// The published source bank supplies reference solutions to the Step 4 checks.
function publish(problem, parameterNames) {
  const bankFile = path.join(root, "source/jonathan-study-site/site/problems.js");
  const bankText = fs.readFileSync(bankFile, "utf8");
  const { parentId, parentTitle, followsUp, easierVersion, harderVersion, twist, ...shared } = problem;
  const published = { ...shared, runner: { kind: "function", parameterNames } };
  const block = JSON.stringify(published, null, 2).split("\n").map(line => `  ${line}`).join("\n");
  const existing = new RegExp(`\\n  \\{\\n    "id": "${problem.id}",\\n[\\s\\S]*?\\n  \\}(?=,\\n  \\{\\n|\\n\\];\\n$)`);
  let text = bankText;
  if (existing.test(text)) text = text.replace(existing, `\n${block}`);
  else {
    if (!text.endsWith("\n  }\n];\n")) throw Error("Unexpected end of site/problems.js");
    text = `${text.slice(0, -"\n];\n".length)},\n${block}\n];\n`;
  }
  fs.writeFileSync(bankFile, text);
}

// Insert a one-line entry next to an existing variant, keeping the file's compact style.
function placeInOrder(id, reason, { before, after }) {
  const orderFile = path.join(root, "variant-order.json");
  const text = fs.readFileSync(orderFile, "utf8");
  if (JSON.parse(text).groups.some(group => group.variants.some(item => item.id === id))) return;
  const anchor = new RegExp(`\\n(\\s*)\\{ "id": "${before || after}", "reason": "[^"]*" \\}`);
  if (!anchor.test(text)) throw Error(`Cannot find ${before || after} in variant-order.json`);
  fs.writeFileSync(orderFile, text.replace(anchor, (line, indent) => before
    ? `\n${indent}{ "id": "${id}", "reason": "${reason}" },${line}`
    : `${line},\n${indent}{ "id": "${id}", "reason": "${reason}" }`));
}

function setFixtures(id, fixtures) {
  const fixtureFile = path.join(root, "scripts/step5-oracle-fixtures.json");
  const text = fs.readFileSync(fixtureFile, "utf8"), all = JSON.parse(text);
  all[id] = fixtures;
  fs.writeFileSync(fixtureFile, JSON.stringify(all) + (text.endsWith("\n") ? "\n" : ""));
}

module.exports = { root, upsert, writeSource, publish, placeInOrder, setFixtures };
