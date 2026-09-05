#!/usr/bin/env node
"use strict";

function edgeKey(from, to, directed) { return directed ? `${from}\0${to}` : [from, to].sort().join("\0"); }
function point(label) { const match = label.match(/^\((\d+),(\d+)\)$/); return match && [Number(match[1]), Number(match[2])]; }
function validate(graph, options = {}) {
  if (graph.directed && !options.mode) return graph.edges.every(([from, to]) => { const a = point(from), b = point(to); return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1; });
  const expected = new Set(), actual = new Set(graph.edges.map(([from, to]) => edgeKey(from, to, graph.directed)));
  const connects = (from, to) => {
    const values = options.values || {};
    if (options.mode === "equal-marker") return String(values[from]) === String(values[to]);
    if (options.mode === "increasing-marker") return Number(values[from]) < Number(values[to]);
    if (options.mode === "from-marker") return options.fromValues.includes(values[from]) && !options.toExcludedValues.includes(values[to]);
    return true;
  };
  for (let i = 0; i < graph.nodes.length; i++) for (let j = i + 1; j < graph.nodes.length; j++) {
    const from = graph.nodes[i], to = graph.nodes[j], a = point(from), b = point(to);
    const row = Math.abs(a[0] - b[0]), column = Math.abs(a[1] - b[1]);
    if ((options.diagonal ? Math.max(row, column) : row + column) !== 1) continue;
    if (graph.directed) { if (connects(from, to)) expected.add(edgeKey(from, to, true)); if (connects(to, from)) expected.add(edgeKey(to, from, true)); }
    else if (connects(from, to) || connects(to, from)) expected.add(edgeKey(from, to, false));
  }
  return expected.size === actual.size && [...expected].every(edge => actual.has(edge));
}

const fixtures = [
  ["number-of-islands rejects a missing side edge", { directed: false, nodes: ["(0,0)", "(0,1)"], edges: [] }, {}, false],
  ["number-of-islands accepts the exact side edge", { directed: false, nodes: ["(0,0)", "(0,1)"], edges: [["(0,0)", "(0,1)"]] }, {}, true],
  ["sparse side grid accepts separated nodes", { directed: false, nodes: ["(0,0)", "(0,2)"], edges: [] }, {}, true],
  ["side-only grid accepts diagonal nodes without an edge", { directed: false, nodes: ["(0,0)", "(1,1)"], edges: [] }, {}, true],
  ["eight-neighbor grid requires a diagonal edge", { directed: false, nodes: ["(0,0)", "(1,1)"], edges: [] }, { diagonal: true }, false],
  ["different pixel colors need no edge", { directed: false, nodes: ["(0,0)", "(0,1)"], edges: [] }, { mode: "equal-marker", values: { "(0,0)": 1, "(0,1)": 2 } }, true],
  ["equal pixel colors require an edge", { directed: false, nodes: ["(0,0)", "(0,1)"], edges: [] }, { mode: "equal-marker", values: { "(0,0)": 1, "(0,1)": 1 } }, false],
  ["increasing cells require only the low-to-high arrow", { directed: true, nodes: ["(0,0)", "(0,1)"], edges: [["(0,0)", "(0,1)"]] }, { mode: "increasing-marker", values: { "(0,0)": 2, "(0,1)": 5 } }, true],
  ["directed sparse graph without semantic direction stays valid", { directed: true, nodes: ["(0,0)", "(0,1)"], edges: [] }, {}, true],
  ["a draft square has no outgoing dungeon edge", { directed: true, nodes: ["(1,1)", "(1,2)"], edges: [["(1,2)", "(1,1)"]] }, { mode: "from-marker", values: { "(1,1)": "draft", "(1,2)": "clear" }, fromValues: ["clear"], toExcludedValues: ["trap"] }, true]
];
const failures = fixtures.filter(([, graph, options, expected]) => validate(graph, options) !== expected).map(([name]) => name);
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("Validated exact Step 2 grid adjacency fixtures.");
