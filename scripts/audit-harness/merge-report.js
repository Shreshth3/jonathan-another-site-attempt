// Merges findings/*.md into docs/site-audit-2026-09-02.md (Part 2 per-problem sections, Part 3 summary bullets)
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = "/Users/shreshth/git-repos/jonathan-another-site-attempt";
const FINDINGS = path.join(__dirname, "findings");
const REPORT = path.join(ROOT, "docs/site-audit-2026-09-02.md");
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "visual-data.js"), "utf8"), sb);
const problems = sb.window.DFS_VISUAL_DATA.problems;
const order = Object.fromEntries(problems.map((p, i) => [p.id, i]));
const titles = Object.fromEntries(problems.map(p => [p.id, p.title]));
const cats = Object.fromEntries(problems.map(p => [p.id, p.category]));

const sections = {}; // id -> markdown body (without the ## heading)
const summaries = []; // one-line bullets
const skipFiles = new Set((process.env.SKIP || "").split(",").filter(Boolean));
for (const file of fs.readdirSync(FINDINGS).filter(f => f.endsWith(".md")).sort()) {
  if (skipFiles.has(file)) continue;
  const text = fs.readFileSync(path.join(FINDINGS, file), "utf8");
  const [body, summaryPart] = text.split(/\n## One-line summary[^\n]*\n/i);
  const parts = body.split(/\n(?=## )/);
  for (const part of parts) {
    const m = part.match(/^## .*?\(`([a-z0-9-]+)`\)/);
    if (!m) continue;
    const id = m[1];
    if (!(id in order)) continue;
    const content = part.replace(/^## [^\n]*\n/, "").trim();
    sections[id] = (sections[id] ? sections[id] + "\n\n" : "") + content;
  }
  if (summaryPart) for (const line of summaryPart.split("\n")) if (/^\s*-\s*\[(BLOCKER|MAJOR|MINOR)\]/.test(line)) summaries.push(line.trim());
}
const missing = problems.filter(p => !sections[p.id]).map(p => p.id);
console.log("problems with sections:", Object.keys(sections).length, "missing:", missing.join(", ") || "none", "summary bullets:", summaries.length);

// Part 2
let part2 = "";
for (const p of problems) {
  part2 += `\n### ${p.title} (\`${p.id}\`, ${p.category})\n\n`;
  part2 += sections[p.id] ? sections[p.id].replace(/^### /gm, "#### ") + "\n" : "_No reviewer findings recorded._\n";
}

// Part 3
const rank = { BLOCKER: 0, MAJOR: 1, MINOR: 2 };
const parse = line => { const m = line.match(/^-\s*\[(BLOCKER|MAJOR|MINOR)\]\s*([a-z0-9-]+|all-7|[A-Za-z/-]+)?\s*(.*)$/); return m ? { sev: m[1], id: m[2] || "", rest: m[3] } : { sev: "MINOR", id: "", rest: line }; };
const parsed = summaries.map(l => ({ line: l, ...parse(l) }));
parsed.sort((a, b) => rank[a.sev] - rank[b.sev] || (order[a.id] ?? 999) - (order[b.id] ?? 999));
const counts = { BLOCKER: 0, MAJOR: 0, MINOR: 0 };
parsed.forEach(p => counts[p.sev]++);
const part3 = `Counts of per-problem findings from the reviewers: ${counts.BLOCKER} blocker, ${counts.MAJOR} major, ${counts.MINOR} minor (site-wide items from Part 1 are listed first and not repeated per problem).\n\n### Site-wide (from Part 1)\n${fs.readFileSync(path.join(__dirname, "PART1-SUMMARY.md"), "utf8").trim()}\n\n### Blockers\n${parsed.filter(p => p.sev === "BLOCKER").map(p => p.line).join("\n")}\n\n### Major\n${parsed.filter(p => p.sev === "MAJOR").map(p => p.line).join("\n")}\n\n### Minor\n${parsed.filter(p => p.sev === "MINOR").map(p => p.line).join("\n")}\n`;

let report = fs.readFileSync(REPORT, "utf8");
if (!report.includes("<!-- PER-PROBLEM -->") || !report.includes("<!-- SUMMARY -->")) throw new Error("placeholders missing — report already merged?");
report = report.replace("<!-- PER-PROBLEM -->", part2.trim()).replace("<!-- SUMMARY -->", part3.trim());
fs.writeFileSync(REPORT, report);
console.log("wrote", REPORT, report.length, "chars");
