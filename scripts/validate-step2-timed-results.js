#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const witnesses = [
  test("network-delay-time", "make-two-way", edgeGraph(["1", "2"], [["2", "1"]], "1", { "2\u00001": 4 }), [-1, 4]),
  test("network-delay-time", "drop-last-edge", edgeGraph(["1", "2", "3"], [["1", "2"], ["2", "3"]], "1", { "1\u00002": 2, "2\u00003": 5 }), [7, -1]),
  test("network-delay-time", "shallow-search", edgeGraph(["1", "2", "3"], [["1", "2"], ["2", "3"]], "1", { "1\u00002": 3, "2\u00003": 5 }), [8, -1]),
  test("time-needed-to-inform-all-employees", "reverse-arrows", nodeGraph(["0", "1", "2"], [["0", "1"], ["1", "2"]], "0", { "0": 2, "1": 3, "2": 0 }), [5, 0]),
  test("time-needed-to-inform-all-employees", "drop-last-edge", nodeGraph(["0", "1", "2"], [["0", "1"], ["1", "2"]], "0", { "0": 2, "1": 5, "2": 0 }), [7, 2]),
  test("time-needed-to-inform-all-employees", "shallow-search", nodeGraph(["0", "1", "2"], [["0", "1"], ["1", "2"]], "0", { "0": 4, "1": 3, "2": 0 }), [7, 4]),
  test("save-the-date-phone-chain", "shallow-search", deadlineGraph(["0", "1", "2"], [["0", "1"], ["1", "2"]], { "0": 2, "1": 2, "2": 0 }, 4), [3, 2]),
  test("save-the-date-phone-chain", "drop-last-edge", deadlineGraph(["0", "1", "2", "3"], [["0", "1"], ["1", "2"], ["2", "3"]], { "0": 1, "1": 1, "2": 1, "3": 0 }, 3), [4, 3]),
  test("save-the-date-phone-chain", "reverse-arrows", deadlineGraph(["0", "1"], [["0", "1"]], { "0": 2, "1": 0 }, 2), [2, 1])
];

function test(id, bug, graph, expected) { return { id, bug, graph, expected }; }
function edgeGraph(nodes, edges, start, weights) { return { directed: true, nodes, edges, start, edgeMarkers: { travelTime: weights } }; }
function nodeGraph(nodes, edges, start, delays) { return { directed: true, nodes, edges, start, nodeMarkers: { informTime: delays } }; }
function deadlineGraph(nodes, edges, waits, deadline) { return { directed: true, nodes, edges, start: "0", nodeMarkers: { waitDays: waits }, fields: { deadline } }; }
function edgeKey(from, to) { return `${from}\u0000${to}`; }

function alter(graph, bug) {
  const copy = { ...graph, edges: graph.edges.map(edge => [...edge]) };
  if (bug === "make-two-way") copy.directed = false;
  if (bug === "reverse-arrows") copy.edges = copy.edges.map(([from, to]) => [to, from]);
  if (bug === "drop-last-edge") copy.edges = copy.edges.slice(0, -1);
  return copy;
}

function arrivals(original, bug, marker) {
  const graph = alter(original, bug);
  const distance = Object.fromEntries(graph.nodes.map(node => [node, Infinity]));
  distance[graph.start] = 0;
  const pending = new Set(graph.nodes);
  while (pending.size) {
    const current = [...pending].sort((a, b) => distance[a] - distance[b])[0];
    pending.delete(current);
    if (!Number.isFinite(distance[current])) break;
    if (bug === "shallow-search" && current !== graph.start) continue;
    for (const [listedFrom, listedTo] of graph.edges) {
      const next = listedFrom === current ? listedTo : !graph.directed && listedTo === current ? listedFrom : null;
      if (next == null) continue;
      const weight = marker === "travelTime"
        ? Number(original.edgeMarkers[marker][edgeKey(listedFrom, listedTo)] ?? original.edgeMarkers[marker][edgeKey(listedTo, listedFrom)])
        : Number(original.nodeMarkers[marker][current]);
      distance[next] = Math.min(distance[next], distance[current] + weight);
    }
  }
  return distance;
}

function output(witness, bug) {
  if (witness.id === "network-delay-time") {
    const values = Object.values(arrivals(witness.graph, bug, "travelTime"));
    return values.every(Number.isFinite) ? Math.max(...values) : -1;
  }
  if (witness.id === "time-needed-to-inform-all-employees") return Math.max(0, ...Object.values(arrivals(witness.graph, bug, "informTime")).filter(Number.isFinite));
  return Object.values(arrivals(witness.graph, bug, "waitDays")).filter(value => Number.isFinite(value) && value <= witness.graph.fields.deadline).length;
}

const root = path.resolve(__dirname, "..");
const specs = ["step2-specs-original.json", "step2-specs-variant.json"].flatMap(file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8")));
const failures = [];
for (const id of new Set(witnesses.map(item => item.id))) {
  const authored = specs.find(spec => spec.id === id)?.rounds.map(round => round.bugs[0]);
  const tested = witnesses.filter(item => item.id === id).map(item => item.bug);
  if (JSON.stringify(authored) !== JSON.stringify(tested)) failures.push(`${id}: focused witnesses do not match authored rounds`);
}
for (const witness of witnesses) {
  const actual = [output(witness, ""), output(witness, witness.bug)];
  if (JSON.stringify(actual) !== JSON.stringify(witness.expected)) failures.push(`${witness.id}/${witness.bug}: expected ${witness.expected.join("→")}; got ${actual.join("→")}`);
  if (actual[0] === actual[1]) failures.push(`${witness.id}/${witness.bug}: mistake does not change the exact output`);
}
for (const id of new Set(witnesses.map(item => item.id))) {
  const pairs = witnesses.filter(item => item.id === id).map(item => item.expected.join("→"));
  if (new Set(pairs).size !== 3) failures.push(`${id}: exact output pairs must differ across all three rounds`);
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("Validated nine exact timed-output witnesses.");
