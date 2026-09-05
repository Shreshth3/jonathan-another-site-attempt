#!/usr/bin/env node
"use strict";

const fs = require("fs"), path = require("path");
const failures = [];
const cases = [
  c("coins-on-level-k", "drop-last-edge", tree(["root=[]", "a", "b"], [["root=[]", "a"], ["root=[]", "b"]], "root=[]", { a: 3, b: 5 }, { k: 1 }), [8, 3]),
  c("coins-on-level-k", "wrong-start", tree(["root=[]", "root[0]", "coin4", "coin2"], [["root=[]", "root[0]"], ["root[0]", "coin4"], ["root=[]", "coin2"]], "root=[]", { coin4: 4, coin2: 2 }, { k: 1 }), [2, 4], "root[0]"),
  c("coins-on-level-k", "shallow-search", tree(["root=[]", "box", "coin"], [["root=[]", "box"], ["box", "coin"]], "root=[]", { coin: 7 }, { k: 2 }), [7, 0]),
  c("perfect-size-campsites", "add-diagonals", tree(["(0,0)", "(1,1)"], [], "(0,0)", {}, { k: 1 }, false), [2, 0]),
  c("perfect-size-campsites", "drop-last-edge", tree(["(0,0)", "(0,1)", "(0,2)"], [["(0,0)", "(0,1)"], ["(0,1)", "(0,2)"]], "(0,0)", {}, { k: 3 }, false), [1, 0]),
  c("perfect-size-campsites", "last-branch", tree(["(0,0)", "(0,1)", "(1,0)", "(1,1)"], [["(0,0)", "(0,1)"], ["(0,0)", "(1,0)"], ["(1,0)", "(1,1)"]], "(0,0)", {}, { k: 1 }, false), [0, 1]),
  c("kth-song-in-playlist", "last-branch", tree(["root=[]", "a", "b"], [["root=[]", "a"], ["root=[]", "b"]], "root=[]", { a: 10, b: 20 }, { k: 1 }), [10, 20]),
  c("kth-song-in-playlist", "shallow-search", tree(["root=[]", "box", "deep", "direct"], [["root=[]", "box"], ["box", "deep"], ["root=[]", "direct"]], "root=[]", { deep: 9, direct: 2 }, { k: 1 }), [9, 2]),
  c("kth-song-in-playlist", "drop-last-edge", tree(["root=[]", "first", "second"], [["root=[]", "first"], ["root=[]", "second"]], "root=[]", { first: 4, second: 8 }, { k: 2 }), [8, -1]),
  c("path-sum", "drop-last-edge", tree(["root", "left", "right"], [["root", "left"], ["root", "right"]], "root", { root: 5, left: 1, right: 2 }, { targetSum: 7 }), [true, false]),
  c("path-sum", "last-branch", tree(["root", "left", "right"], [["root", "left"], ["root", "right"]], "root", { root: 5, left: 3, right: 4 }, { targetSum: 8 }), [true, false]),
  c("path-sum", "skip-leaf-edges", tree(["root", "middle", "leaf"], [["root", "middle"], ["middle", "leaf"]], "root", { root: 5, middle: 2, leaf: 10 }, { targetSum: 5 }), [false, true])
];
function c(id, bug, graph, expected, mistakenStart) { return { id, bug, graph, expected, mistakenStart }; }
function tree(nodes, edges, start, values, fields, directed = true) { return { nodes, edges, start, directed, values, fields }; }
function point(label) { const m = label.match(/^\((\d+),(\d+)\)$/); return m && [Number(m[1]), Number(m[2])]; }
function changed(source, bug, start) {
  const graph = { ...source, edges: source.edges.map(edge => [...edge]), start: start || source.start };
  if (bug === "drop-last-edge") graph.edges = graph.edges.slice(0, -1);
  if (bug === "skip-leaf-edges") { const degree = Object.fromEntries(graph.nodes.map(n => [n, 0])); graph.edges.forEach(([a, b]) => { degree[a]++; degree[b]++; }); graph.edges = graph.edges.filter(([a, b]) => degree[a] > 1 && degree[b] > 1); }
  if (bug === "add-diagonals") for (let a = 0; a < graph.nodes.length; a++) for (let b = a + 1; b < graph.nodes.length; b++) { const x = point(graph.nodes[a]), y = point(graph.nodes[b]); if (x && y && Math.abs(x[0] - y[0]) === 1 && Math.abs(x[1] - y[1]) === 1) graph.edges.push([graph.nodes[a], graph.nodes[b]]); }
  return graph;
}
function ordered(source, bug, mistakenStart) {
  const graph = changed(source, bug, mistakenStart), kids = Object.fromEntries(graph.nodes.map(n => [n, []])), out = [], seen = new Set();
  graph.edges.forEach(([a, b]) => kids[a].push(b));
  const walk = (node, depth) => { if (seen.has(node)) return; seen.add(node); if (graph.values[node] != null) out.push({ node, depth, value: graph.values[node] }); let next = kids[node]; if (bug === "shallow-search" && depth > 0) next = []; if (bug === "last-branch") next = next.slice(-1); next.forEach(n => walk(n, depth + 1)); };
  walk(graph.start, 0); return out;
}
function components(source, bug) {
  const graph = changed(source, bug), adj = Object.fromEntries(graph.nodes.map(n => [n, []])); graph.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const global = new Set(), groups = [];
  for (const seed of graph.nodes) { if (global.has(seed)) continue; const local = new Set([seed]), pending = [seed]; while (pending.length) { const node = pending.pop(); let next = adj[node].filter(n => !local.has(n) && !global.has(n)); if (bug === "last-branch") next = next.slice(-1); next.forEach(n => { local.add(n); pending.push(n); }); } local.forEach(n => global.add(n)); groups.push([...local]); }
  return groups;
}
function pathSum(source, bug) { const graph = changed(source, bug), kids = Object.fromEntries(graph.nodes.map(n => [n, []])); graph.edges.forEach(([a, b]) => kids[a].push(b)); const walk = (n, sum) => { let next = kids[n]; if (bug === "last-branch") next = next.slice(-1); const total = sum + graph.values[n]; return next.length ? next.some(x => walk(x, total)) : total === graph.fields.targetSum; }; return walk(graph.start, 0); }
function output(test, bug) { if (test.id === "coins-on-level-k") return ordered(test.graph, bug, bug === "wrong-start" ? test.mistakenStart : null).filter(x => x.depth === test.graph.fields.k).reduce((s, x) => s + x.value, 0); if (test.id === "kth-song-in-playlist") return ordered(test.graph, bug)[test.graph.fields.k - 1]?.value ?? -1; if (test.id === "perfect-size-campsites") return components(test.graph, bug).filter(g => g.length === test.graph.fields.k).length; return pathSum(test.graph, bug); }
const root = path.resolve(__dirname, ".."), specs = ["step2-specs-variant.json", "step2-specs-new.json"].flatMap(f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8")));
for (const id of new Set(cases.map(x => x.id))) { const actual = specs.find(x => x.id === id)?.rounds.map(r => r.bugs[0]), expected = cases.filter(x => x.id === id).map(x => x.bug); if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push(`${id}: witnesses do not match authored rounds`); }
for (const test of cases) { const actual = [output(test, ""), output(test, test.bug)]; if (JSON.stringify(actual) !== JSON.stringify(test.expected)) failures.push(`${test.id}/${test.bug}: expected ${test.expected.join("→")}, got ${actual.join("→")}`); if (actual[0] === actual[1]) failures.push(`${test.id}/${test.bug}: output does not change`); }
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("Validated twelve exact parameterized-output witnesses.");
