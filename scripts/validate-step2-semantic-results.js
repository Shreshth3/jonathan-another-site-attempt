#!/usr/bin/env node
"use strict";

// Small, independent witnesses for the Step 2 result adapters. Each case proves
// that one authored bug changes the exact value returned by the real problem.
const cases = [
  {
    id: "package/drop-last-edge",
    kind: "shortest-path-weight",
    resultConfig: { targetField: "target", weightMarker: "roadTime" },
    bug: "drop-last-edge",
    graph: { directed: false, nodes: ["0", "1", "2"], edges: [["0", "1"], ["1", "2"]], start: "0", fields: { target: "2" }, edgeMarkers: { roadTime: { "0\u00001": 2, "1\u00002": 4 } } },
    expected: [6, -1]
  },
  {
    id: "package/make-one-way",
    kind: "shortest-path-weight",
    resultConfig: { targetField: "target", weightMarker: "roadTime" },
    bug: "make-one-way",
    graph: { directed: false, nodes: ["0", "1"], edges: [["1", "0"]], start: "0", fields: { target: "1" }, edgeMarkers: { roadTime: { "0\u00001": 5 } } },
    expected: [5, -1]
  },
  {
    id: "package/wrong-start",
    kind: "shortest-path-weight",
    resultConfig: { targetField: "target", weightMarker: "roadTime" },
    bug: "wrong-start",
    mistakenStart: "1",
    graph: { directed: false, nodes: ["0", "1"], edges: [["0", "1"]], start: "0", fields: { target: "1" }, edgeMarkers: { roadTime: { "0\u00001": 7 } } },
    expected: [7, 0]
  },
  {
    id: "employee/reverse-arrows",
    kind: "reached-node-value-sum",
    resultConfig: { valueMarker: "importance" },
    bug: "reverse-arrows",
    graph: { directed: true, nodes: ["1", "2", "3"], edges: [["1", "2"], ["3", "1"]], start: "1", nodeMarkers: { importance: { "1": 5, "2": 4, "3": 2 } } },
    expected: [9, 7]
  },
  {
    id: "employee/shallow-search",
    kind: "reached-node-value-sum",
    resultConfig: { valueMarker: "importance" },
    bug: "shallow-search",
    graph: { directed: true, nodes: ["1", "2", "3"], edges: [["1", "2"], ["2", "3"]], start: "1", nodeMarkers: { importance: { "1": 5, "2": 4, "3": 3 } } },
    expected: [12, 9]
  },
  {
    id: "employee/wrong-start",
    kind: "reached-node-value-sum",
    resultConfig: { valueMarker: "importance" },
    bug: "wrong-start",
    mistakenStart: "2",
    graph: { directed: true, nodes: ["1", "2", "3"], edges: [["1", "2"], ["1", "3"]], start: "1", nodeMarkers: { importance: { "1": 5, "2": 2, "3": 1 } } },
    expected: [8, 2]
  }
];

function edgeKey(graph, from, to) {
  const ends = graph.directed ? [from, to] : [from, to].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return `${ends[0]}\u0000${ends[1]}`;
}

function changedGraph(graph, bug, mistakenStart) {
  const copy = { ...graph, edges: graph.edges.map(edge => [...edge]), start: graph.start };
  if (bug === "drop-last-edge") copy.edges = copy.edges.slice(0, -1);
  if (bug === "make-one-way") copy.directed = true;
  if (bug === "reverse-arrows") copy.edges = copy.edges.map(([from, to]) => [to, from]);
  if (bug === "wrong-start") copy.start = mistakenStart;
  return copy;
}

function reached(graph, shallow = false) {
  const adjacent = Object.fromEntries(graph.nodes.map(node => [node, []]));
  for (const [from, to] of graph.edges) {
    adjacent[from].push(to);
    if (!graph.directed) adjacent[to].push(from);
  }
  const seen = new Set([graph.start]);
  if (shallow) adjacent[graph.start].forEach(node => seen.add(node));
  else {
    const stack = [graph.start];
    while (stack.length) for (const next of adjacent[stack.pop()]) if (!seen.has(next)) { seen.add(next); stack.push(next); }
  }
  return graph.nodes.filter(node => seen.has(node));
}

function shortest(graph, markers, targetField) {
  const target = graph.fields[targetField];
  const distance = Object.fromEntries(graph.nodes.map(node => [node, Infinity]));
  distance[graph.start] = 0;
  const pending = new Set(graph.nodes);
  while (pending.size) {
    const current = [...pending].sort((a, b) => distance[a] - distance[b])[0];
    pending.delete(current);
    if (!Number.isFinite(distance[current]) || current === target) break;
    for (const [from, to] of graph.edges) {
      const next = from === current ? to : !graph.directed && to === current ? from : null;
      if (next == null) continue;
      distance[next] = Math.min(distance[next], distance[current] + markers[edgeKey(graph, from, to)]);
    }
  }
  return Number.isFinite(distance[target]) ? distance[target] : -1;
}

function result(test, buggy) {
  const graph = buggy ? changedGraph(test.graph, test.bug, test.mistakenStart) : test.graph;
  if (test.kind === "shortest-path-weight") return shortest(graph, test.graph.edgeMarkers[test.resultConfig.weightMarker], test.resultConfig.targetField);
  return reached(graph, buggy && test.bug === "shallow-search").reduce((sum, node) => sum + test.graph.nodeMarkers[test.resultConfig.valueMarker][node], 0);
}

const failures = [];
for (const test of cases) {
  const actual = [result(test, false), result(test, true)];
  if (JSON.stringify(actual) !== JSON.stringify(test.expected)) failures.push(`${test.id}: expected ${test.expected.join(" vs ")}; got ${actual.join(" vs ")}`);
  if (actual[0] === actual[1]) failures.push(`${test.id}: bug does not change the returned value`);
}
for (const family of ["package", "employee"]) {
  const pairs = cases.filter(test => test.id.startsWith(`${family}/`)).map(test => test.expected.join("→"));
  if (new Set(pairs).size !== 3) failures.push(`${family}: the three rounds need distinct exact output pairs`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Validated six exact Step 2 semantic-output witnesses.");
