// Plays every question of every lesson through the real UI (headless Chromium) and records
// exactly what the student sees, what the grader accepted, and any format-tolerance probes.
// Usage: node audit-harness.js [--ids a,b,c] [--workers 4] [--out DIR]
const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { chromium } = require("/Users/shreshth/git-repos/try-5.4-computer-use/node_modules/playwright");

const ROOT = "/Users/shreshth/git-repos/jonathan-another-site-attempt";
const args = process.argv.slice(2);
const argValue = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const OUT = argValue("--out") || path.join(__dirname, "transcripts");
const WORKERS = Number(argValue("--workers") || 4);
const ONLY = argValue("--ids") ? argValue("--ids").split(",") : null;
fs.mkdirSync(OUT, { recursive: true });

const dataSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "visual-data.js"), "utf8"), dataSandbox);
const ALL_PROBLEMS = dataSandbox.window.DFS_VISUAL_DATA.problems;
const SKIP_DONE = args.includes("--skip-done");
const PROBLEMS = (ONLY ? ALL_PROBLEMS.filter(p => ONLY.includes(p.id)) : ALL_PROBLEMS).filter(p => !SKIP_DONE || !fs.existsSync(path.join(OUT, `${p.id}.json`)));

// ---------- static server with internals exposed ----------
const INTERNALS_PATCH = `
  window.__DFS_INTERNALS = {
    state: () => ({ problem, problemIndex, progress, counterProgress, structureProgress, reasoningProgress, section, counterDrawings, counterDrawingMode, selectedId, answered }),
    mainTasks, currentTask, counterexampleRounds, counterexampleDirected, counterexampleRequiresTree, counterInputSpec,
    parseCounterDrawing, counterResult, mistakenGraph, expectedCanvas, gradeCanvas, formatReachedOutput,
    structureTasks, reasoningRounds, characterName, arrangeChoices, usesGridCellLabels, bugDescription, roundSuggestedStart
  };
`;
const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let file = path.join(ROOT, pathname.replace(/^\//, ""));
  if (!path.extname(file) || !fs.existsSync(file)) file = path.join(ROOT, "index.html");
  response.setHeader("content-type", contentTypes[path.extname(file)] || "application/octet-stream");
  let body = fs.readFileSync(file);
  if (path.basename(file) === "visual-library.js") {
    const src = body.toString("utf8");
    const marker = "window.DFS_VISUAL_LIBRARY = { start, gradeCanvas, layout };";
    if (!src.includes(marker)) throw new Error("internals marker missing");
    body = Buffer.from(src.replace(marker, INTERNALS_PATCH + marker));
  }
  response.end(body);
});

// ---------- helpers ----------
const colorHex = { slate: "#8392a8", red: "#ff7e82", blue: "#72a7ff", amber: "#f1b75b", green: "#57d39b", purple: "#b69cff" };
function canvasToSnapshot(canvas, extra = {}) {
  const n = canvas.nodes.length;
  const idOf = {};
  const nodes = canvas.nodes.map((node, i) => {
    idOf[String(node.id)] = i;
    const angle = -Math.PI / 2 + i * 2 * Math.PI / Math.max(n, 1);
    const color = extra.nodeColors?.[String(node.label)] || "#8392a8";
    return { id: i, label: String(node.label), x: Math.round(360 + Math.cos(angle) * 240), y: Math.round(260 + Math.sin(angle) * 190), r: 32, color };
  });
  const edges = canvas.edges.map((edge, i) => ({ id: i, from: idOf[String(edge.from)], to: idOf[String(edge.to)], label: String(edge.label || ""), color: colorHex[edge.color] || "#72a7ff", width: 4 }));
  return { nodes, edges, directed: Boolean(canvas.directed), nextNodeId: n, nextEdgeId: edges.length };
}
// graph = {directed, nodes:[labels], edges:[[from,to,color?]], start, checkpoint?}
function graphToSnapshot(graph, problemId) {
  const nodeColors = {};
  if (problemId === "routes-past-the-coffee-cart" && graph.checkpoint) nodeColors[graph.checkpoint] = colorHex.amber;
  return canvasToSnapshot({ directed: graph.directed, nodes: graph.nodes.map(l => ({ id: l, label: l })), edges: graph.edges.map(([from, to, color]) => ({ from, to, ...(color ? { color } : {}) })) }, { nodeColors });
}

async function evalIn(page, fnSource, arg) { return page.evaluate(`(${fnSource})(${JSON.stringify(arg)})`); }
async function setGraph(page, snapshot) {
  await page.evaluate(snap => { window.DFS_GRAPH.setSnapshot(snap); window.dispatchEvent(new CustomEvent("dfs-graph-change")); }, snapshot);
}
async function text(page, selector) { try { const el = await page.$(selector); return el ? (await el.innerText()).trim() : null; } catch { return null; } }
async function texts(page, selector) { return (await page.$$eval(selector, els => els.map(e => e.innerText.trim()))).filter(Boolean); }
async function feedback(page) { return (await text(page, "#feedback-slot")) || ""; }
async function checklist(page) {
  return page.$$eval("#feedback-slot .feedback-checklist li", items => items.map(li => `${li.classList.contains("passed") ? "✓" : li.classList.contains("failed") ? "×" : "•"} ${li.innerText.trim().replace(/^[✓×•—]\s*/, "")}`));
}
async function challengeText(page) { return (await text(page, "#challenge")) || ""; }
async function labelGuide(page) { return await text(page, ".node-label-guide"); }
async function graphTitle(page) { return await text(page, "#graph-lab-title"); }
async function clearProgress(page) { await page.evaluate(() => localStorage.clear()); }

// ---------- Step 2 starter (ported from scripts/validate-step2-starters.js) ----------
function coordinate(label) { const m = String(label).match(/^\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?$/); return m ? [Number(m[1]), Number(m[2])] : null; }
function isGrid(problem) { return problem.visualKind === "grid" || problem.id === "kattis-getting-gold"; }
const TREE_IDS = new Set(["kill-process", "time-needed-to-inform-all-employees", "who-keeps-their-job", "save-the-date-phone-chain", "shut-the-garden-valve", "evaluate-boolean-binary-tree", "structy-max-root-to-leaf-path-sum", "path-sum", "structy-tree-sum", "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "gold-and-silver-lights", "flatten-nested-list-iterator", "nested-list-weight-sum", "nested-list-weight-sum-ii", "busiest-shelf-level", "coins-on-level-k", "kth-song-in-playlist", "top-of-the-pile", "codewars-array-deep-count", "employee-importance", "usaco-milk-factory"]);
function starter(problem, round, isDirected) {
  const base = round.bugs[0], grid = isGrid(problem);
  if (problem.id === "routes-past-the-coffee-cart") {
    if (base === "reverse-arrows") return { directed: true, nodes: ["0", "1"], edges: [["1", "0"]], start: "0" };
    if (base === "first-branch") return { directed: true, nodes: ["0", "1", "2", "3"], edges: [["0", "1"], ["0", "2"], ["2", "3"]], start: "0" };
    return { directed: true, nodes: ["0", "1", "2"], edges: [["0", "1"], ["1", "2"]], start: "0" };
  }
  if (problem.id === "one-color-metro-ride") {
    if (base === "ignore-colors") return { directed: false, nodes: ["A", "B", "C"], edges: [["A", "B", "red"], ["B", "C", "blue"]], start: "A" };
    if (base === "red-only") return { directed: false, nodes: ["A", "B"], edges: [["A", "B", "blue"]], start: "A" };
    return { directed: false, nodes: ["A", "B", "C", "D"], edges: [["A", "B", "red"], ["A", "C", "red"], ["C", "D", "red"]], start: "A" };
  }
  if (base === "add-diagonals") return { directed: isDirected, nodes: ["(0,0)", "(1,1)"], edges: [], start: "(0,0)" };
  if (base === "remove-diagonals") return { directed: isDirected, nodes: ["(0,0)", "(1,1)"], edges: [["(0,0)", "(1,1)"]], start: "(0,0)" };
  if (base === "reverse-arrows") return { directed: true, nodes: ["A", "B"], edges: [["B", "A"]], start: "A" };
  if (base === "drop-last-edge") return grid ? { directed: isDirected, nodes: ["(0,0)", "(0,1)", "(0,2)"], edges: [["(0,0)", "(0,1)"], ["(0,1)", "(0,2)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A", "B", "C"], edges: [["A", "B"], ["B", "C"]], start: "A" };
  if (base === "skip-leaf-edges") return { directed: isDirected, nodes: ["A", "B", "C"], edges: isDirected ? [["A", "B"], ["A", "C"]] : [["A", "B"], ["B", "C"]], start: isDirected ? "A" : "B" };
  if (base === "wrong-start") return grid ? { directed: isDirected, nodes: ["(0,0)", "(0,1)", "(0,2)"], edges: [["(0,1)", "(0,2)"]], start: "(0,1)" } : TREE_IDS.has(problem.id) ? { directed: isDirected, nodes: ["A", "B", "C"], edges: [["B", "A"], ["B", "C"]], start: "B" } : { directed: isDirected, nodes: ["A", "B", "C"], edges: [["B", "C"]], start: "B" };
  if (base === "last-branch") return grid ? { directed: isDirected, nodes: ["(0,0)", "(0,1)", "(1,0)", "(2,0)"], edges: [["(0,0)", "(0,1)"], ["(0,0)", "(1,0)"], ["(1,0)", "(2,0)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A", "B", "C", "D"], edges: [["A", "B"], ["A", "C"], ["C", "D"]], start: "A" };
  if (base === "make-one-way") return { directed: false, nodes: ["A", "B"], edges: [["B", "A"]], start: "A" };
  if (base === "make-two-way") return { directed: true, nodes: ["A", "B"], edges: [["B", "A"]], start: "A" };
  if (base === "shallow-search") return grid ? { directed: isDirected, nodes: ["(0,0)", "(0,1)", "(0,2)"], edges: [["(0,0)", "(0,1)"], ["(0,1)", "(0,2)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A", "B", "C"], edges: [["A", "B"], ["B", "C"]], start: "A" };
  return grid ? { directed: isDirected, nodes: ["(0,0)", "(0,1)", "(1,0)", "(2,0)"], edges: [["(0,0)", "(0,1)"], ["(0,0)", "(1,0)"], ["(1,0)", "(2,0)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A", "B", "C", "D"], edges: [["A", "B"], ["A", "C"], ["C", "D"]], start: "A" };
}
function labelsForRule(rule, count) {
  if (rule === "contiguous-zero") return Array.from({ length: count }, (_, i) => String(i));
  if (["contiguous-one", "positive-integer"].includes(rule)) return Array.from({ length: count }, (_, i) => String(i + 1));
  if (rule === "identifier") return Array.from({ length: count }, (_, i) => String.fromCharCode(97 + i));
  if (rule === "state-pair") return Array.from({ length: count }, (_, i) => `(0,${i})`);
  if (rule === "nested-path") return Array.from({ length: count }, (_, i) => i ? `root[${i - 1}]` : "root");
  if (rule === "tree-path") return ["root", "L", "R", "LL", "LR", "RL", "RR", "LLL"].slice(0, count);
  if (rule === "partial-string") return ["ε", "a", "b", "aa", "ab", "ba", "bb", "aaa"].slice(0, count);
  return null;
}
function applyLabelRule(problem, graph) {
  const rule = problem.counterexampleLesson.nodeLabels.rule;
  if (["nested-path", "tree-path", "partial-string"].includes(rule)) {
    const outgoing = Object.fromEntries(graph.nodes.map(node => [node, []]));
    graph.edges.forEach(([from, to]) => outgoing[from].push(to));
    const root = graph.nodes.find(node => !graph.edges.some(([, to]) => to === node));
    if (!root) return graph;
    const rename = { [root]: rule === "nested-path" || rule === "tree-path" ? "root" : "ε" };
    const visit = node => outgoing[node].forEach((child, index) => {
      if (rule === "nested-path") rename[child] = `${rename[node]}[${index}]`;
      else if (rule === "tree-path") rename[child] = rename[node] === "root" ? ["L", "R"][index] : `${rename[node]}${["L", "R"][index]}`;
      else { const parent = rename[node] === "ε" ? "" : rename[node]; const letter = ["a", "b", "c"].filter(v => v !== parent.at(-1))[index]; rename[child] = `${parent}${letter}`; }
      visit(child);
    });
    visit(root);
    return { ...graph, nodes: graph.nodes.map(n => rename[n]), edges: graph.edges.map(([f, t, c]) => [rename[f], rename[t], c]), start: rename[graph.start] };
  }
  if (rule === "interior-coordinate") {
    const rename = Object.fromEntries(graph.nodes.map(l => [l, `(${coordinate(l)[0] + 1},${coordinate(l)[1] + 1})`]));
    return { ...graph, nodes: graph.nodes.map(l => rename[l]), edges: graph.edges.map(([f, t, c]) => [rename[f], rename[t], c]), start: rename[graph.start] };
  }
  const labels = labelsForRule(rule, graph.nodes.length);
  if (!labels) return graph;
  const rename = Object.fromEntries(graph.nodes.map((l, i) => [l, labels[i]]));
  return { ...graph, nodes: labels, edges: graph.edges.map(([f, t, c]) => [rename[f], rename[t], c]), start: rename[graph.start] };
}

// In-page: validate a candidate correct graph and compute expected outputs + mistaken canvas.
const EVAL_CANDIDATE = `(({ snapshot, roundIndex, chosenStart }) => {
  const I = window.__DFS_INTERNALS; const { problem } = I.state();
  const round = I.counterexampleRounds()[roundIndex];
  const parsed = I.parseCounterDrawing(snapshot, round, chosenStart);
  if (parsed.error) return { error: parsed.error };
  const graph = parsed.graph;
  const mistakenStart = round.bugs.includes("wrong-start") ? String(round.mistakenStartLabel) : graph.start;
  const correctOutput = I.counterResult(graph);
  const buggyOutput = I.counterResult(graph, round.bugs, mistakenStart);
  const singles = round.bugs.map(bug => I.counterResult(graph, [bug], mistakenStart));
  const exposes = JSON.stringify(correctOutput) !== JSON.stringify(buggyOutput)
    && singles.every(o => JSON.stringify(correctOutput) !== JSON.stringify(o))
    && (problem.id !== "routes-past-the-coffee-cart" || correctOutput.includes(graph.checkpoint) !== buggyOutput.includes(graph.checkpoint));
  const mistakenCanvas = I.expectedCanvas(I.mistakenGraph(graph, round.bugs, mistakenStart));
  return { graph, exposes, correctOutput, buggyOutput, correctText: I.formatReachedOutput(correctOutput), buggyText: I.formatReachedOutput(buggyOutput), mistakenCanvas, mistakenStart };
})`;

// In-page random candidate generator (returns a graph in {directed,nodes,edges,start,checkpoint?} form)
const RANDOM_CANDIDATE = `(({ roundIndex, seed }) => {
  const I = window.__DFS_INTERNALS; const { problem } = I.state();
  const round = I.counterexampleRounds()[roundIndex];
  let s = seed; const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const rule = problem.counterexampleLesson?.nodeLabels?.rule || "free";
  const directed = I.counterexampleDirected();
  const requiresTree = I.counterexampleRequiresTree();
  const grid = problem.visualKind === "grid" || problem.id === "kattis-getting-gold";
  const edgeRule = problem.graphRules.edges.toLowerCase();
  const allowsDiagonals = /diagonal|eight|8[\\s-]*direction|side or (?:a )?corner|touch(?:ing|es)?.*corner/.test(edgeRule) && !/never|not|only side|four/.test(edgeRule);
  const dag = ["all-paths-from-source-to-target", "count-routes-to-summit", "routes-past-the-coffee-cart"].includes(problem.id);
  const k = 2 + Math.floor(rnd() * 5); // 2..6 nodes
  let nodes = [], edges = [];
  const coord = l => { const m = String(l).match(/^\\((-?\\d+),(-?\\d+)\\)$/); return m ? [Number(m[1]), Number(m[2])] : null; };
  if (grid || rule === "coordinate" || rule === "interior-coordinate") {
    const off = rule === "interior-coordinate" ? 1 : 0;
    const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push("(" + (r + off) + "," + (c + off) + ")");
    while (nodes.length < k) { const c = pick(cells); if (!nodes.includes(c)) nodes.push(c); }
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const one = coord(nodes[a]), two = coord(nodes[b]); const dr = Math.abs(one[0] - two[0]), dc = Math.abs(one[1] - two[1]);
      const legal = allowsDiagonals ? Math.max(dr, dc) === 1 : dr + dc === 1;
      if (legal && rnd() < 0.7) edges.push(rnd() < 0.5 || !directed ? [nodes[a], nodes[b]] : [nodes[b], nodes[a]]);
    }
    if (directed) for (let i = edges.length - 1; i >= 0; i--) if (rnd() < 0.3) edges.push([edges[i][1], edges[i][0]]);
  } else if (rule === "state-pair") {
    const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push("(" + r + "," + c + ")");
    while (nodes.length < k) { const c = pick(cells); if (!nodes.includes(c)) nodes.push(c); }
    for (let a = 0; a < nodes.length; a++) for (let b = 0; b < nodes.length; b++) if (a !== b && rnd() < 0.3) edges.push([nodes[a], nodes[b]]);
  } else {
    nodes = Array.from({ length: k }, (_, i) => "N" + i);
    if (requiresTree) { for (let i = 1; i < k; i++) { const p = Math.floor(rnd() * i); edges.push([nodes[p], nodes[i]]); } }
    else if (dag) { for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) if (rnd() < 0.45) edges.push([nodes[a], nodes[b]]); }
    else { for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) if (a !== b && (directed || a < b) && rnd() < 0.35) edges.push([nodes[a], nodes[b]]); }
    // shuffle edge order (matters for branch-order bugs)
    for (let i = edges.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [edges[i], edges[j]] = [edges[j], edges[i]]; }
    if (problem.id === "evaluate-boolean-binary-tree") { // ensure every internal node has 2 children: build full binary tree
      nodes = ["N0"]; edges = []; let frontier = ["N0"]; let count = 1; const depth = 1 + Math.floor(rnd() * 2);
      for (let d = 0; d < depth; d++) { const next = []; for (const n of frontier) if (rnd() < 0.7 || d === 0) { const a = "N" + count++, b = "N" + count++; edges.push([n, a], [n, b]); next.push(a, b); } frontier = next; }
      nodes = ["N0", ...edges.map(e => e[1])];
    }
    if (rule === "tree-path" && problem.id !== "evaluate-boolean-binary-tree") { // binary: at most 2 children
      const childCount = {}; edges = edges.filter(([f]) => { childCount[f] = (childCount[f] || 0) + 1; return childCount[f] <= 2; });
      const reach = new Set(["N0"]); let changed = true; while (changed) { changed = false; for (const [f, t] of edges) if (reach.has(f) && !reach.has(t)) { reach.add(t); changed = true; } }
      nodes = nodes.filter(n => reach.has(n)); edges = edges.filter(([f, t]) => reach.has(f) && reach.has(t));
    }
    if (rule === "partial-string") { const childCount = {}; edges = edges.filter(([f]) => { childCount[f] = (childCount[f] || 0) + 1; return childCount[f] <= 3; }); const reach = new Set(["N0"]); let changed = true; while (changed) { changed = false; for (const [f, t] of edges) if (reach.has(f) && !reach.has(t)) { reach.add(t); changed = true; } } nodes = nodes.filter(n => reach.has(n)); edges = edges.filter(([f, t]) => reach.has(f) && reach.has(t)); }
    // apply label rule
    const rename = {};
    if (["nested-path", "tree-path", "partial-string"].includes(rule)) {
      const outgoing = Object.fromEntries(nodes.map(n => [n, []])); edges.forEach(([f, t]) => outgoing[f].push(t));
      const root = nodes.find(n => !edges.some(([, t]) => t === n)) || nodes[0];
      rename[root] = rule === "partial-string" ? "ε" : "root";
      const visit = n => outgoing[n].forEach((child, index) => {
        if (rule === "nested-path") rename[child] = rename[n] + "[" + index + "]";
        else if (rule === "tree-path") rename[child] = rename[n] === "root" ? ["L", "R"][index] : rename[n] + ["L", "R"][index];
        else { const parent = rename[n] === "ε" ? "" : rename[n]; const letter = ["a", "b", "c"].filter(v => v !== parent.at(-1))[index]; rename[child] = parent + letter; }
        visit(child);
      }); visit(root);
      if (Object.keys(rename).length !== nodes.length) return null;
    } else {
      const labels = rule === "contiguous-zero" || rule === "free" ? nodes.map((_, i) => String(i)) : ["contiguous-one", "positive-integer"].includes(rule) ? nodes.map((_, i) => String(i + 1)) : rule === "identifier" ? nodes.map((_, i) => String.fromCharCode(97 + i)) : nodes.map((_, i) => String(i));
      // random permutation of labels so the root isn't always the smallest label
      const perm = labels.slice(); for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      nodes.forEach((n, i) => { rename[n] = perm[i]; });
    }
    nodes = nodes.map(n => rename[n]); edges = edges.map(([f, t]) => [rename[f], rename[t]]);
  }
  if (problem.id === "one-color-metro-ride") edges = edges.map(([f, t]) => [f, t, rnd() < 0.5 ? "red" : "blue"]);
  let start = problem.counterexampleLesson.fixedStart || (nodes.includes(String(round.startLabel)) ? String(round.startLabel) : pick(nodes));
  if (problem.counterexampleLesson.startRule === "graph-root") { const root = nodes.find(n => !edges.some(([, t]) => t === n)); if (root) start = root; }
  if (round.bugs.includes("wrong-start")) { const ms = String(round.mistakenStartLabel); if (!nodes.includes(ms)) return null; if (start === ms) { const others = nodes.filter(n => n !== ms); if (!others.length) return null; start = pick(others); } }
  let checkpoint = null;
  if (problem.id === "routes-past-the-coffee-cart") { const sorted = [...nodes].sort((a, b) => Number(a) - Number(b)); const interior = sorted.slice(1, -1); if (!interior.length) return null; checkpoint = pick(interior); }
  return { directed, nodes, edges, start, checkpoint };
})`;

// ---------- Step runners ----------
async function runStep1(page, base, T) {
  await page.goto(base); await clearProgress(page); await page.reload();
  const out = { correctPass: [], remedialPass: [], errors: [] };
  // Pass A: answer everything correctly
  for (let i = 0; i < 9; i++) {
    const task = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const t = I.currentTask(); return { id: t.id, kind: t.kind, remedial: !!t.remedial, input: t.input, prompt: t.decision?.prompt || t.prompt, correct: t.decision?.correct || t.correct, choices: (t.decision?.choices || t.choices).map(c => ({ id: c.id, label: c.label, feedback: c.feedback, misconception: c.misconception, model: c.model ? { directed: c.model.directed, nodes: c.model.nodes.map(n => n.label), edges: c.model.edges.map(e => `${c.model.nodes.find(n => String(n.id) === String(e.from))?.label}${c.model.directed ? "→" : "—"}${c.model.nodes.find(n => String(n.id) === String(e.to))?.label}${e.color ? ` [${e.color}]` : ""}${e.label ? ` (${e.label})` : ""}`) } : undefined })), why: t.why, canvas: t.canvas, shownModel: t.shownModel ? { directed: t.shownModel.directed, nodes: t.shownModel.nodes.map(n => n.label), edges: t.shownModel.edges.map(e => `${t.shownModel.nodes.find(n => String(n.id) === String(e.from))?.label}${t.shownModel.directed ? "→" : "—"}${t.shownModel.nodes.find(n => String(n.id) === String(e.to))?.label}${e.color ? ` [${e.color}]` : ""}${e.label ? ` (${e.label})` : ""}`) } : undefined, title: t.title, facet: t.facet }; });
    const seen = { index: i, kind: task.kind === "build" ? "build" : "concept", taskId: task.id, title: task.title, facet: task.facet, ui: { promptCode: await text(page, ".prompt-code"), labelGuide: await labelGuide(page), graphTitle: await graphTitle(page), question: task.kind === "build" ? await text(page, ".visual-decision-prompt") : await text(page, ".challenge-body > h3"), choices: await texts(page, "[data-choice-id]"), miniGraphAria: await page.$$eval(".mini-graph", els => els.map(e => e.getAttribute("aria-label"))), checkButton: await text(page, "#visual-check"), fullText: await challengeText(page) }, data: { input: task.input, prompt: task.prompt, correct: task.correct, choices: task.choices, why: task.why, canvas: task.canvas, shownModel: task.shownModel } };
    if (task.kind === "build" && task.canvas.nodes.length === 0) {
      seen.choicesDisabledBeforeDrawing = await page.$$eval("[data-choice-id]", els => els.every(e => e.disabled));
      await setGraph(page, canvasToSnapshot(task.canvas));
      const stillDisabled = await page.$$eval("[data-choice-id]", els => els.every(e => e.disabled));
      seen.result = { passed: false, deadEnd: true, note: `Correct graph has ZERO nodes; answer buttons ${stillDisabled ? "stay disabled (student cannot answer without drawing a wrong node)" : "are enabled"}` };
      out.errors.push(`step1 task ${i} (${task.id}): correct graph is empty and the answer buttons stay disabled — question cannot be completed; skipped`);
      out.correctPass.push(seen);
      await page.click("#next-question-btn");
      continue;
    }
    if (task.kind === "build") {
      // choice buttons should be disabled before drawing
      seen.choicesDisabledBeforeDrawing = await page.$$eval("[data-choice-id]", els => els.every(e => e.disabled));
      await setGraph(page, canvasToSnapshot(task.canvas));
      await page.click(`[data-choice-id="${task.correct}"]`);
      await page.click("#visual-check");
      seen.result = { passed: (await feedback(page)).startsWith("Exact visual proof"), checklist: await checklist(page), feedback: await feedback(page) };
      if (!seen.result.passed) out.errors.push(`step1 task ${i} (${task.id}) correct canvas rejected: ${seen.result.checklist.join(" | ")}`);
    } else {
      seen.choicesDisabledBeforeDrawing = await page.$$eval("[data-choice-id]", els => els.every(e => e.disabled));
      await page.click(`[data-choice-id="${task.correct}"]`);
      await page.click("#visual-check");
      seen.result = { passed: (await feedback(page)).startsWith("Picture read correctly"), feedback: await feedback(page) };
      if (!seen.result.passed) out.errors.push(`step1 task ${i} (${task.id}) correct choice rejected`);
    }
    out.correctPass.push(seen);
    await page.click("#visual-check"); // next
  }
  out.completionText = await challengeText(page);
  // Pass B: answer concept questions wrong to exercise remedial builds
  await clearProgress(page); await page.reload();
  for (let i = 0; i < 9; i++) {
    const task = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const t = I.currentTask(); return { id: t.id, kind: t.kind, correct: t.decision?.correct || t.correct, choices: (t.decision?.choices || t.choices).map(c => c.id), canvas: t.canvas }; });
    if (task.kind === "build") {
      if (task.canvas.nodes.length === 0) { await page.click("#next-question-btn"); continue; }
      await setGraph(page, canvasToSnapshot(task.canvas)); await page.click(`[data-choice-id="${task.correct}"]`); await page.click("#visual-check"); await page.click("#visual-check");
      continue;
    }
    const wrong = task.choices.find(c => c !== task.correct);
    await page.click(`[data-choice-id="${wrong}"]`); await page.click("#visual-check");
    const wrongFeedback = await feedback(page);
    const btn = await text(page, "#visual-check");
    await page.click("#visual-check"); // Build a fresh proof
    const rem = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const t = I.currentTask(); return { id: t.id, remedial: !!t.remedial, kind: t.kind, input: t.input, prompt: t.decision?.prompt, correct: t.decision?.correct, choices: t.decision?.choices, why: t.why, canvas: t.canvas, title: t.title }; });
    const entry = { index: i, conceptId: task.id, wrongChoice: wrong, wrongFeedback, buttonAfterWrong: btn, remedial: { id: rem.id, isRemedial: rem.remedial, title: rem.title, ui: { promptCode: await text(page, ".prompt-code"), labelGuide: await labelGuide(page), graphTitle: await graphTitle(page), question: await text(page, ".visual-decision-prompt"), choices: await texts(page, "[data-choice-id]"), fullText: await challengeText(page) }, data: { input: rem.input, correct: rem.correct, choices: rem.choices, why: rem.why, canvas: rem.canvas } } };
    if (!rem.remedial || rem.kind !== "build") { out.errors.push(`step1 concept ${task.id}: remedial build did not appear`); out.remedialPass.push(entry); continue; }
    await setGraph(page, canvasToSnapshot(rem.canvas)); await page.click(`[data-choice-id="${rem.correct}"]`); await page.click("#visual-check");
    entry.remedial.result = { passed: (await feedback(page)).startsWith("Exact visual proof"), checklist: await checklist(page) };
    if (!entry.remedial.result.passed) out.errors.push(`step1 remedial for ${task.id}: correct canvas rejected: ${entry.remedial.result.checklist.join(" | ")}`);
    out.remedialPass.push(entry);
    await page.click("#visual-check");
  }
  out.progressLabelAfterRemedials = await text(page, "#evidence-label");
  out.attemptLabelAfterRemedials = await text(page, "#attempt-label");
  return out;
}

async function submitCounter(page, roundIndex, graph, evalResult, opts = {}) {
  // Draw correct graph in tab 1, mistaken in tab 2, fill start + outputs, click check.
  const { problem } = await page.evaluate(() => ({ problem: { id: window.__DFS_INTERNALS.state().problem.id, fixedStart: window.__DFS_INTERNALS.state().problem.counterexampleLesson.fixedStart } }));
  await page.click('[data-counter-drawing="correct"]');
  await setGraph(page, graphToSnapshot(graph, problem.id));
  await page.click('[data-counter-drawing="mistaken"]');
  const mistakenSnap = canvasToSnapshot(evalResult.mistakenCanvas, { nodeColors: problem.id === "routes-past-the-coffee-cart" && graph.checkpoint ? { [graph.checkpoint]: colorHex.amber } : {} });
  await setGraph(page, mistakenSnap);
  if (!problem.fixedStart) await page.fill("#counter-start", graph.start);
  else await page.dispatchEvent("#counter-start", "input");
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("dfs-graph-change")));
  await page.fill("#counter-real-output", opts.correctText ?? evalResult.correctText);
  await page.fill("#counter-bug-output", opts.buggyText ?? evalResult.buggyText);
  await page.click("#counter-check");
  const fb = await feedback(page);
  return { passed: fb.startsWith("Counterexample confirmed"), checklist: await checklist(page), feedback: fb };
}

async function runStep2(page, base, T) {
  await page.goto(`${base}?section=2`); await clearProgress(page); await page.reload();
  const out = { rounds: [], errors: [] };
  const problem = T.problem;
  const isDirected = await page.evaluate(() => window.__DFS_INTERNALS.counterexampleDirected());
  for (let r = 0; r < 3; r++) {
    const round = problem.counterexampleLesson.rounds[r];
    const ui = { characterHeading: await text(page, ".case-person h3"), mistakeText: await texts(page, ".case-mistake p"), mainGoal: await text(page, ".counter-main-goal"), startFieldLabel: await text(page, ".counter-input-field span"), startPlaceholder: await page.getAttribute("#counter-start", "placeholder"), startValue: await page.inputValue("#counter-start"), startReadonly: (await page.getAttribute("#counter-start", "readonly")) !== null, outputHeading: await text(page, "#counter-output-heading"), outputLabels: await texts(page, ".counter-output-fields label span"), graphTitle: await graphTitle(page), drawingTabs: await texts(page, "[data-counter-drawing]"), labelGuide: await labelGuide(page), checkButton: await text(page, "#counter-check"), edgeOrderShown: null, fullText: await challengeText(page) };
    const entry = { round: r, bugs: round.bugs, level: round.level, goal: round.goal, startLabel: round.startLabel, mistakenStartLabel: round.mistakenStartLabel, ui, attempts: [] };
    // candidate 1: starter
    let graph = applyLabelRule(problem, starter(problem, round, isDirected));
    graph.start = String(problem.counterexampleLesson.fixedStart || round.startLabel);
    if (problem.id === "routes-past-the-coffee-cart") graph.checkpoint = "1";
    if (problem.counterexampleLesson.startRule === "graph-root") { const root = graph.nodes.find(n => !graph.edges.some(([, t]) => t === n)); if (root && round.bugs[0] !== "wrong-start") graph.start = root; }
    let evalResult = await evalIn(page, EVAL_CANDIDATE, { snapshot: graphToSnapshot(graph, problem.id), roundIndex: r, chosenStart: graph.start });
    entry.starterEval = evalResult.error ? { error: evalResult.error } : { exposes: evalResult.exposes, correct: evalResult.correctText, buggy: evalResult.buggyText };
    if (evalResult.error || !evalResult.exposes) {
      // random search
      let found = null;
      for (let seed = 1; seed <= 600 && !found; seed++) {
        const cand = await evalIn(page, RANDOM_CANDIDATE, { roundIndex: r, seed: seed * 7919 + r * 31 });
        if (!cand) continue;
        const ev = await evalIn(page, EVAL_CANDIDATE, { snapshot: graphToSnapshot(cand, problem.id), roundIndex: r, chosenStart: cand.start });
        if (!ev.error && ev.exposes) found = { cand, ev };
      }
      if (!found) { entry.result = { passed: false, reason: "no valid exposing graph found in 600 random tries", lastError: evalResult.error }; out.errors.push(`step2 round ${r} (${round.bugs[0]}): could not find any valid exposing graph (starter error: ${evalResult.error || "does not expose"})`); out.rounds.push(entry); await page.click("#next-question-btn"); continue; }
      graph = found.cand; evalResult = found.ev;
    }
    entry.graphUsed = { directed: graph.directed, nodes: graph.nodes, edges: graph.edges, start: graph.start, checkpoint: graph.checkpoint || undefined };
    entry.expected = { correctOutput: evalResult.correctText, buggyOutput: evalResult.buggyText, mistakenStart: evalResult.mistakenStart, mistakenCanvas: { directed: evalResult.mistakenCanvas.directed, nodes: evalResult.mistakenCanvas.nodes.map(n => n.label), edges: evalResult.mistakenCanvas.edges.map(e => `${e.from}${evalResult.mistakenCanvas.directed ? "→" : "—"}${e.to}${e.color ? ` [${e.color}]` : ""}`) } };
    if (r === 0) {
      // Probe: use the exact node names Step 1 taught (first build canvas) as the correct graph in Step 2
      const step1Canvas = problem.lesson.buildTasks[0].canvas;
      const step1Graph = { directed: step1Canvas.directed, nodes: step1Canvas.nodes.map(n => String(n.label)), edges: step1Canvas.edges.map(e => [String(step1Canvas.nodes.find(n => String(n.id) === String(e.from))?.label), String(step1Canvas.nodes.find(n => String(n.id) === String(e.to))?.label)]), start: String(step1Canvas.nodes[0].label) };
      const s1eval = await evalIn(page, EVAL_CANDIDATE, { snapshot: graphToSnapshot(step1Graph, problem.id), roundIndex: r, chosenStart: step1Graph.start });
      entry.step1LabelProbe = { labels: step1Graph.nodes, directed: step1Graph.directed, parseError: s1eval.error || null, accepted: !s1eval.error };
      if (!s1eval.error) { /* also check the UI path */ }
      else {
        await page.click('[data-counter-drawing="correct"]'); await setGraph(page, graphToSnapshot(step1Graph, problem.id));
        await page.click('[data-counter-drawing="mistaken"]'); await setGraph(page, graphToSnapshot(step1Graph, problem.id));
        if (!problem.counterexampleLesson.fixedStart) await page.fill("#counter-start", step1Graph.start); else await page.dispatchEvent("#counter-start", "input");
        await page.evaluate(() => window.dispatchEvent(new CustomEvent("dfs-graph-change")));
        await page.fill("#counter-real-output", "[]"); await page.fill("#counter-bug-output", "[]"); await page.click("#counter-check");
        entry.step1LabelProbe.uiChecklist = await checklist(page);
      }
    }
    // Format probes on round 0: what output formats are accepted?
    if (r === 0) {
      const probes = [];
      const arr = evalResult.correctOutput;
      const variants = [
        ["no brackets, comma+space", arr.join(", ")],
        ["curly braces", `{${arr.join(",")}}`],
        ["quoted numbers/strings", JSON.stringify(arr.map(String))],
        ["reversed order", JSON.stringify([...arr].reverse().map(v => /^-?\d+$/.test(String(v)) ? Number(v) : String(v)))],
        ["spaces inside brackets", `[ ${arr.map(v => /^-?\d+$/.test(String(v)) ? v : JSON.stringify(String(v))).join(" , ")} ]`],
        ["unquoted labels (if non-numeric)", `[${arr.join(",")}]`]
      ];
      for (const [name, value] of variants) {
        if (name.startsWith("unquoted") && arr.every(v => /^-?\d+$/.test(String(v)))) continue;
        if (name.startsWith("reversed") && arr.length < 2) continue;
        const res = await submitCounter(page, r, graph, evalResult, { correctText: value, buggyText: "[\"deliberately-wrong\"]" });
        probes.push({ variant: name, value, accepted: res.checklist.find(c => c.includes("The correct output is predicted correctly"))?.startsWith("✓") || false });
      }
      entry.outputFormatProbes = probes;
    }
    ui.edgeOrderShown = await page.$$eval(".scratch-edge-order", els => els.length > 0);
    const res = await submitCounter(page, r, graph, evalResult);
    entry.result = res;
    entry.successText = res.passed ? await feedback(page) : null;
    entry.buttonAfter = await text(page, "#counter-check");
    if (!res.passed) out.errors.push(`step2 round ${r} (${round.bugs[0]}): UI rejected a graph the internals say exposes the bug: ${res.checklist.join(" | ")}`);
    out.rounds.push(entry);
    await page.click("#counter-check");
  }
  out.completionText = await challengeText(page);
  return out;
}

async function runStep3(page, base, T) {
  await page.goto(`${base}?section=3`); await clearProgress(page); await page.reload();
  const out = { rounds: [], errors: [] };
  for (let r = 0; r < 5; r++) {
    const round = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const s = I.state(); const t = I.structureTasks()[s.structureProgress.index]; return { input: t.input, claims: t.claims.map(c => ({ kind: c.kind, statement: c.statement, correct: c.correct, feedback: c.feedback, misconception: c.misconception })), canvas: t.task.canvas, variant: s.structureProgress.claimVariant }; });
    const entry = { round: r, ui: { promptCode: await text(page, ".structure-mini-example"), labelGuide: await labelGuide(page), graphTitle: await graphTitle(page), claims: await texts(page, ".student-claim blockquote"), legend: await texts(page, ".claim-verdict legend"), checkButton: await text(page, "#structure-check"), fullText: await challengeText(page) }, data: { input: round.input, claims: round.claims, canvas: round.canvas }, variants: [] };
    entry.claimButtonsDisabledBeforeDrawing = await page.$$eval("[data-claim-index]", els => els.every(e => e.disabled));
    await setGraph(page, canvasToSnapshot(round.canvas));
    // On round 0, answer wrong twice to capture two more claim variants and the retry flow
    if (r === 0) {
      for (let v = 0; v < 2; v++) {
        const cur = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const s = I.state(); const t = I.structureTasks()[s.structureProgress.index]; return { claims: t.claims.map(c => ({ kind: c.kind, statement: c.statement, correct: c.correct, feedback: c.feedback })), variant: s.structureProgress.claimVariant }; });
        for (let i = 0; i < cur.claims.length; i++) await page.click(`[data-claim-index="${i}"][data-claim-value="${!cur.claims[i].correct}"]`);
        await page.click("#structure-check");
        entry.variants.push({ variant: cur.variant, claims: cur.claims, wrongFeedback: await feedback(page), buttonAfter: await text(page, "#structure-check") });
        await page.click("#structure-check"); // Try another check → re-render, drawing resets
        await setGraph(page, canvasToSnapshot(round.canvas));
      }
    }
    const cur = await page.evaluate(() => { const I = window.__DFS_INTERNALS; const s = I.state(); const t = I.structureTasks()[s.structureProgress.index]; return { claims: t.claims.map(c => ({ kind: c.kind, statement: c.statement, correct: c.correct, feedback: c.feedback, misconception: c.misconception })), variant: s.structureProgress.claimVariant }; });
    entry.finalVariant = { variant: cur.variant, claims: cur.claims, uiClaims: await texts(page, ".student-claim blockquote") };
    // Probe: right claims, blank graph → what does the student see?
    if (r === 0) {
      await setGraph(page, { nodes: [{ id: 0, label: "0", x: 100, y: 100, r: 32, color: "#8392a8" }], edges: [], directed: false, nextNodeId: 1, nextEdgeId: 0 });
      for (let i = 0; i < cur.claims.length; i++) await page.click(`[data-claim-index="${i}"][data-claim-value="${cur.claims[i].correct}"]`);
      await page.click("#structure-check");
      entry.wrongGraphFeedback = await feedback(page);
      await setGraph(page, canvasToSnapshot(round.canvas));
    } else {
      for (let i = 0; i < cur.claims.length; i++) await page.click(`[data-claim-index="${i}"][data-claim-value="${cur.claims[i].correct}"]`);
    }
    await page.click("#structure-check");
    const fb = await feedback(page);
    entry.result = { passed: fb.startsWith("Claims and graph are correct"), feedback: fb, checklist: await checklist(page) };
    if (!entry.result.passed) out.errors.push(`step3 round ${r}: correct answers + exact canvas rejected: ${fb.slice(0, 200)}`);
    entry.buttonAfter = await text(page, "#structure-check");
    out.rounds.push(entry);
    await page.click("#structure-check");
  }
  out.completionText = await challengeText(page);
  return out;
}

async function runStep4(page, base, T) {
  await page.goto(`${base}?section=4`); await clearProgress(page); await page.reload();
  const out = { cases: [], errors: [] };
  const cases = T.problem.codeReasoning?.cases || [];
  for (let c = 0; c < cases.length; c++) {
    const round = cases[c];
    const entry = { case: c, caseId: round.caseId, bugTitle: round.bugTitle, ui: { inputShown: await text(page, ".trace-input"), graphTitle: await graphTitle(page), labelGuide: await labelGuide(page), codeLabel: await text(page, ".code-window-label"), outputLabel: await text(page, ".reasoning-output span"), outputPlaceholder: await page.getAttribute("#reasoning-output", "placeholder"), diagnosisLegend: await text(page, ".reasoning-rule legend"), diagnoses: await texts(page, ".reasoning-rule [data-choice-id]"), checkButton: await text(page, "#reasoning-check"), fullText: await challengeText(page) }, data: { input: round.input, code: round.code, canvas: round.canvas, outputFormat: round.outputFormat, buggyOutput: round.buggyOutput, correctOutput: round.correctOutput, correctDiagnosis: round.correctDiagnosis, diagnoses: round.diagnoses, graphProof: round.graphProof, misconception: round.misconception } };
    entry.outputDisabledBeforeDrawing = await page.$eval("#reasoning-output", e => e.disabled);
    await setGraph(page, canvasToSnapshot(round.canvas));
    // Probes on case 0: alternative output formats
    if (c === 0) {
      const probes = [];
      let parsed; try { parsed = JSON.parse(round.buggyOutput); } catch { parsed = undefined; }
      const variants = [];
      if (typeof parsed === "string") variants.push(["unquoted string", parsed], ["single-quoted string", `'${parsed}'`]);
      if (typeof parsed === "boolean") variants.push(["Capitalized boolean", parsed ? "True" : "False"]);
      if (Array.isArray(parsed)) { variants.push(["spaces after commas", JSON.stringify(parsed).replace(/,/g, ", ")]); if (parsed.length > 1) variants.push(["reversed element order", JSON.stringify([...parsed].reverse())]); if (parsed.every(v => typeof v === "string")) variants.push(["unquoted strings in array", `[${parsed.join(",")}]`]); if (parsed.every(v => typeof v === "number")) variants.push(["quoted numbers in array", JSON.stringify(parsed.map(String))]); }
      if (typeof parsed === "number") variants.push(["quoted number", JSON.stringify(String(parsed))]);
      variants.push(["trailing period", `${round.buggyOutput}.`]);
      for (const [name, value] of variants) {
        await page.fill("#reasoning-output", value);
        await page.click(`.reasoning-rule [data-choice-id="${round.diagnoses.find(d => d.id !== round.correctDiagnosis).id}"]`);
        await page.click("#reasoning-check");
        const cl = await checklist(page);
        probes.push({ variant: name, value, accepted: cl.find(x => x.includes("exact output"))?.startsWith("✓") || false });
        await setGraph(page, canvasToSnapshot(round.canvas));
      }
      entry.outputFormatProbes = probes;
      // wrong diagnosis feedback capture
      const wrongDiag = round.diagnoses.find(d => d.id !== round.correctDiagnosis);
      await page.fill("#reasoning-output", round.buggyOutput);
      await page.click(`.reasoning-rule [data-choice-id="${wrongDiag.id}"]`);
      await page.click("#reasoning-check");
      entry.wrongDiagnosisFeedback = await feedback(page);
      await setGraph(page, canvasToSnapshot(round.canvas));
    }
    await page.fill("#reasoning-output", round.buggyOutput);
    await page.click(`.reasoning-rule [data-choice-id="${round.correctDiagnosis}"]`);
    await page.click("#reasoning-check");
    const fb = await feedback(page);
    entry.result = { passed: fb.startsWith("Trace confirmed"), checklist: await checklist(page), feedback: fb };
    if (!entry.result.passed) out.errors.push(`step4 case ${c} (${round.caseId}): correct answers rejected: ${entry.result.checklist.join(" | ")}`);
    entry.buttonAfter = await text(page, "#reasoning-check");
    out.cases.push(entry);
    await page.click("#reasoning-check");
  }
  out.completionText = await challengeText(page);
  return out;
}

async function runProblem(browser, port, problem) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", e => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(`console: ${m.text()}`); });
  const base = `http://127.0.0.1:${port}/${problem.id}`;
  const T = { problem };
  const transcript = { id: problem.id, title: problem.title, category: problem.category, visualKind: problem.visualKind, statement: problem.statement, examples: problem.examples, constraints: problem.constraints, graphRules: problem.graphRules, nodeLabelRule: problem.counterexampleLesson?.nodeLabels, steps: {}, errors: [] };
  for (const [name, fn] of [["step1", runStep1], ["step2", runStep2], ["step3", runStep3], ["step4", runStep4]]) {
    try { transcript.steps[name] = await fn(page, base, T); transcript.errors.push(...(transcript.steps[name].errors || []).map(e => `${name}: ${e}`)); }
    catch (error) { transcript.steps[name] = { crashed: error.message.slice(0, 500) }; transcript.errors.push(`${name} harness crash: ${error.message.slice(0, 300)}`); try { await page.screenshot({ path: path.join(OUT, `${problem.id}-${name}-crash.png`) }); } catch {} }
  }
  transcript.consoleErrors = consoleErrors;
  await context.close();
  fs.writeFileSync(path.join(OUT, `${problem.id}.json`), JSON.stringify(transcript, null, 1));
  return transcript;
}

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const queue = [...PROBLEMS];
  const summary = [];
  const started = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async () => {
    while (queue.length) {
      const problem = queue.shift();
      const t0 = Date.now();
      try {
        const transcript = await runProblem(browser, port, problem);
        summary.push({ id: problem.id, errors: transcript.errors.length, seconds: Math.round((Date.now() - t0) / 1000) });
        console.log(`${problem.id}: ${transcript.errors.length} issue(s) in ${Math.round((Date.now() - t0) / 1000)}s${transcript.errors.length ? "\n   - " + transcript.errors.join("\n   - ") : ""}`);
      } catch (error) { console.log(`${problem.id}: HARNESS FAILURE ${error.message}`); summary.push({ id: problem.id, errors: -1 }); }
    }
  }));
  await browser.close();
  server.close();
  fs.writeFileSync(path.join(OUT, "_summary.json"), JSON.stringify(summary, null, 1));
  console.log(`Done ${summary.length} problems in ${Math.round((Date.now() - started) / 1000)}s`);
})();
