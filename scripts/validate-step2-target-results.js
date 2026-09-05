#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const cases = [
  ["find-if-path-exists-in-graph", "make-one-way", graph(false, ["0", "1"], [["1", "0"]], "0", "1"), true, false],
  ["find-if-path-exists-in-graph", "first-branch", graph(false, ["0", "1", "2"], [["0", "1"], ["0", "2"]], "0", "2"), true, false],
  ["find-if-path-exists-in-graph", "wrong-start", graph(false, ["0", "1", "2"], [["0", "2"]], "0", "2"), true, false, "1"],
  ["flooded-campsite-trails", "wrong-start", graph(false, ["0", "1", "2"], [["0", "2"]], "0", "2", { blocked: [] }), true, false, "1"],
  ["flooded-campsite-trails", "make-one-way", graph(false, ["0", "1"], [["1", "0"]], "0", "1", { blocked: [] }), true, false],
  ["flooded-campsite-trails", "first-branch", graph(false, ["0", "1", "2", "3"], [["0", "1"], ["0", "2"], ["0", "3"]], "0", "2", { blocked: ["3"] }), true, false],
  ["gfg-grid-path-exists", "wrong-start", graph(false, ["(0,0)", "(0,1)", "(1,0)"], [["(0,0)", "(1,0)"]], "(0,0)", "(1,0)"), true, false, "(0,1)"],
  ["gfg-grid-path-exists", "add-diagonals", graph(false, ["(0,0)", "(1,1)"], [], "(0,0)", "(1,1)"), false, true],
  ["gfg-grid-path-exists", "first-branch", graph(false, ["(0,0)", "(0,1)", "(1,0)"], [["(0,0)", "(0,1)"], ["(0,0)", "(1,0)"]], "(0,0)", "(1,0)"), true, false],
  ["one-color-metro-ride", "red-only", graph(false, ["0", "1"], [["0", "1", "blue"]], "0", "1"), true, false],
  ["one-color-metro-ride", "ignore-colors", graph(false, ["0", "1", "2"], [["0", "1", "red"], ["1", "2", "blue"]], "0", "2"), false, true],
  ["one-color-metro-ride", "first-branch", graph(false, ["0", "1", "2"], [["0", "1", "red"], ["0", "2", "red"]], "0", "2"), true, false]
];

function graph(directed, nodes, edges, start, target, extra = {}) {
  return { directed, nodes, edges, start, fields: { target }, ...extra };
}

function coordinate(label) {
  const match = String(label).match(/^\((\d+),(\d+)\)$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function changedGraph(source, bug, mistakenStart) {
  const copy = { ...source, edges: source.edges.map(edge => [...edge]) };
  if (bug === "make-one-way") copy.directed = true;
  if (bug === "wrong-start") copy.start = mistakenStart;
  if (bug === "red-only") copy.edges = copy.edges.filter(([, , color]) => color === "red");
  if (bug === "ignore-colors") copy.edges = copy.edges.map(([from, to]) => [from, to, "slate"]);
  if (bug === "add-diagonals") for (let a = 0; a < copy.nodes.length; a++) for (let b = a + 1; b < copy.nodes.length; b++) {
    const one = coordinate(copy.nodes[a]), two = coordinate(copy.nodes[b]);
    if (one && two && Math.abs(one[0] - two[0]) === 1 && Math.abs(one[1] - two[1]) === 1) copy.edges.push([copy.nodes[a], copy.nodes[b], ""]);
  }
  return copy;
}

function traverse(source, edges, firstBranch) {
  const adjacent = Object.fromEntries(source.nodes.map(node => [node, []]));
  for (const [from, to] of edges) {
    adjacent[from].push(to);
    if (!source.directed) adjacent[to].push(from);
  }
  const seen = new Set([source.start]);
  if (firstBranch) {
    let current = source.start;
    while (adjacent[current].find(node => !seen.has(node))) {
      current = adjacent[current].find(node => !seen.has(node));
      seen.add(current);
    }
  } else {
    const pending = [source.start];
    while (pending.length) for (const next of adjacent[pending.pop()]) if (!seen.has(next)) { seen.add(next); pending.push(next); }
  }
  return seen;
}

function reaches(id, source, bug, mistakenStart) {
  const current = changedGraph(source, bug, mistakenStart);
  let edges = current.edges;
  if (id === "flooded-campsite-trails") {
    const blocked = new Set(current.blocked || []);
    edges = edges.filter(([from, to]) => !blocked.has(from) && !blocked.has(to));
    if (blocked.has(current.start)) return false;
  }
  let seen;
  if (id === "one-color-metro-ride" && !["ignore-colors", "red-only"].includes(bug)) {
    seen = new Set([current.start]);
    for (const color of ["red", "blue"]) traverse(current, edges.filter(([, , edgeColor]) => edgeColor === color), bug === "first-branch").forEach(node => seen.add(node));
  } else seen = traverse(current, edges, bug === "first-branch");
  return seen.has(source.fields.target);
}

const root = path.resolve(__dirname, "..");
const specs = ["step2-specs-original.json", "step2-specs-variant.json", "step2-specs-new.json"].flatMap(file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8")));
const failures = [];
for (const id of new Set(cases.map(test => test[0]))) {
  const expectedBugs = cases.filter(test => test[0] === id).map(test => test[1]);
  const actualBugs = specs.find(spec => spec.id === id)?.rounds.map(round => round.bugs[0]);
  if (JSON.stringify(actualBugs) !== JSON.stringify(expectedBugs)) failures.push(`${id}: witness bugs do not match the three authored rounds`);
}
for (const [id, bug, witness, expectedCorrect, expectedBuggy, mistakenStart] of cases) {
  const actual = [reaches(id, witness, "", witness.start), reaches(id, witness, bug, mistakenStart)];
  if (actual[0] !== expectedCorrect || actual[1] !== expectedBuggy) failures.push(`${id}/${bug}: expected ${expectedCorrect}→${expectedBuggy}; got ${actual[0]}→${actual[1]}`);
  if (actual[0] === actual[1]) failures.push(`${id}/${bug}: mistake does not change the exact boolean output`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Validated twelve exact target-reachability witnesses.");
