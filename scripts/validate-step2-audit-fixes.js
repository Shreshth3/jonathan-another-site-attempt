#!/usr/bin/env node
"use strict";
// Exercise the actual Step 2 engine. Expected results below are small, independently
// worked examples, not a second implementation of the grader.
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const assert = require("assert/strict");
const root = path.resolve(__dirname, "..");
const sandbox = { window: { addEventListener() {} }, document: { querySelector: () => null, addEventListener() {} } };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
let source = fs.readFileSync(path.join(root, "visual-library.js"), "utf8");
source = source.replace("  start();\n})();", `  window.step2Test = {
  use(id) { problem = allProblems.find(item => item.id === id); if (!problem) throw new Error(id); },
  result: counterResult, values: validateCounterValues, shape: validateProblemGraphShape,
  expected: expectedCanvas, grade: gradeCanvas, matches: counterOutputMatches,
  format: formatCounterOutput, semantic: parseCounterSemanticValue,
  changed: mistakenGraph, real: counterReachability, explanation: counterBoundaryExplanation
};\n})();`);
vm.runInNewContext(source, sandbox);
const engine = sandbox.window.step2Test;
let count = 0;
const test = (label, run) => { try { run(); count++; } catch (error) { throw new Error(`${label}: ${error.message}`, { cause: error }); } };
const graph = (nodes, edges, options = {}) => ({ directed: false, nodes, edges, start: nodes[0], fields: {}, nodeMarkers: {}, edgeMarkers: {}, ...options });
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const valid = value => { engine.values(value); engine.shape(value); };
const use = id => engine.use(id);
const drawing = model => ({ directed: model.directed, nodes: model.nodes.map((label, id) => ({ id: String(id), label })), edges: model.edges.map(([from, to], id) => ({ id, from: String(model.nodes.indexOf(from)), to: String(model.nodes.indexOf(to)), label: "" })) });

test("Shelf reversal returns a gradeable zero", () => {
  use("busiest-shelf-level");
  const value = graph(["root=[]", "root[0]=7"], [["root=[]", "root[0]=7"]], { directed: true, start: "root=[]" });
  valid(value); same(engine.result(value), 1); same(engine.result(value, ["reverse-arrows"]), 0); assert(engine.matches("0", 0));
});
test("Constellation replacement has a valid witness", () => {
  use("counting-constellations");
  const value = graph(["(0,0)", "(1,1)"], [["(0,0)", "(1,1)"]]);
  valid(value); same(engine.result(value), 1); same(engine.result(value, ["drop-last-edge"]), 2);
});
test("Undocked boat stays uncounted", () => {
  use("counting-docked-boats"); const value = graph(["(1,1)"], [], { fields: { rows: 3, columns: 3 } });
  valid(value); same(engine.result(value), 0); value.fields.rows = 2; same(engine.result(value), 1);
});
test("Boat missing link creates two docked pieces", () => {
  use("counting-docked-boats"); const value = graph(["(0,0)", "(0,1)", "(0,2)"], [["(0,0)", "(0,1)"], ["(0,1)", "(0,2)"]], { fields: { rows: 3, columns: 3 } });
  valid(value); same(engine.result(value), 1); same(engine.result(value, ["drop-last-edge"]), 2); same(engine.result(value, ["shallow-search"]), 2);
});
test("Boat feedback explains every scan, not only the chosen start", () => {
  use("counting-docked-boats");
  const value = graph(["(0,0)", "(0,1)"], [["(0,0)", "(0,1)"]], { fields: { rows: 1, columns: 2 } });
  const explanation = engine.explanation(value, ["drop-last-edge"]);
  assert(explanation.includes('[["(0,0)"],["(0,1)"]]'));
  assert(explanation.includes("restarts at every still-unseen node"));
  assert(explanation.includes("touches the grid border"));
});
for (const id of ["battleships-in-a-board", "counting-docked-boats", "longest-freight-train"]) {
  test(`${id}: reject corner-touching vehicles`, () => { use(id); assert.throws(() => engine.values(graph(["(0,0)", "(1,1)"], [], { fields: { rows: 3, columns: 3 } })), /cannot touch/); });
  test(`${id}: reject bent vehicles`, () => { use(id); assert.throws(() => engine.values(graph(["(0,0)", "(0,1)", "(1,0)"], [], { fields: { rows: 3, columns: 3 } })), /straight/); });
}
test("Rune dead ends are not complete codes", () => {
  use("runes-on-the-castle-door"); const value = graph(["start", "a", "b", "ab"], [["start", "a"], ["start", "b"], ["a", "ab"]], { directed: true, start: "start", fields: { dials: ["ab", "b"] } });
  valid(value); same(engine.result(value), ["ab"]); same(engine.result(value, ["last-branch"]), []);
});
test("Rune missing legal branches rejected", () => {
  use("runes-on-the-castle-door"); const value = graph(["start", "a", "b", "ac"], [["start", "a"], ["start", "b"], ["a", "ac"]], { directed: true, start: "start", fields: { dials: ["ab", "c"] } });
  assert.throws(() => valid(value), /prefix bc/);
});
// Balance lock: dials [[2,6],[5]], limit 8. 2,5 totals 7 (safe); 6 is a dead end because 6+5 = 11 busts.
const balance = (nodes, edges, fields = { dials: [[2, 6], [5]], limit: 8 }) => graph(nodes, edges, { directed: true, start: "start", fields });
test("Balance lock dead ends are not complete codes", () => {
  use("the-balance-lock"); const value = balance(["start", "2", "6", "2,5"], [["start", "2"], ["start", "6"], ["2", "2,5"]]);
  valid(value); same(engine.result(value), [[2, 5]]); same(engine.result(value, ["last-branch"]), []); same(engine.result(value, ["shallow-search"]), []);
});
test("Balance lock keeps a total equal to the limit", () => {
  use("the-balance-lock"); const value = balance(["start", "3", "3,5"], [["start", "3"], ["3", "3,5"]], { dials: [[3], [5]], limit: 8 });
  valid(value); same(engine.result(value), [[3, 5]]);
});
test("Balance lock rejects a busted prefix", () => {
  use("the-balance-lock"); assert.throws(() => valid(balance(["start", "2", "6", "2,5", "6,5"], [["start", "2"], ["start", "6"], ["2", "2,5"], ["6", "6,5"]])), /6,5 is not a safe prefix/);
});
test("Balance lock requires safe dead ends", () => {
  use("the-balance-lock"); assert.throws(() => valid(balance(["start", "2", "2,5"], [["start", "2"], ["2", "2,5"]])), /safe prefix 6/);
});
test("Balance lock output order does not matter", () => {
  use("the-balance-lock"); assert(engine.matches("[[3,1],[2,5]]", [[2, 5], [3, 1]])); assert(!engine.matches("[[2,5]]", [[2, 5], [3, 1]])); assert(engine.matches("[]", [])); assert(!engine.matches("[[2,5]]", []));
});
test("Balance lock dials accept one plain row per dial", () => {
  use("the-balance-lock"); same(engine.semantic("3, 8\n2, 6", { id: "dials", kind: "json" }, "dials"), [[3, 8], [2, 6]]);
});
// Under the limit: nums [2,3,5], limit 6 → [], [2], [2,3], [3], [5]. Every combination is an answer.
const under = (nodes, edges, fields = { nums: [2, 3, 5], limit: 6 }) => graph(nodes, edges, { directed: true, start: "start", fields });
test("Under the limit returns every combination, including the empty one", () => {
  use("under-the-limit"); const value = under(["start", "2", "2,3", "3", "5"], [["start", "2"], ["2", "2,3"], ["start", "3"], ["start", "5"]]);
  valid(value); same(engine.result(value), [[], [2], [2, 3], [3], [5]]); same(engine.result(value, ["shallow-search"]), [[], [2], [3], [5]]); same(engine.result(value, ["last-branch"]), [[], [5]]);
});
test("Under the limit rejects a reordered duplicate and a missing combination", () => {
  use("under-the-limit");
  assert.throws(() => valid(under(["start", "2", "2,3", "3", "3,2", "5"], [["start", "2"], ["2", "2,3"], ["start", "3"], ["3", "3,2"], ["start", "5"]])), /3,2 is not a combination/);
  assert.throws(() => valid(under(["start", "2", "3", "5"], [["start", "2"], ["start", "3"], ["start", "5"]])), /combination 2,3/);
});
test("Under the limit output ignores both orders but not repeats", () => {
  use("under-the-limit"); const expected = [[], [2], [2, 3], [3], [5]];
  assert(engine.matches("[[5],[3,2],[3],[2],[]]", expected)); assert(!engine.matches("[[5],[3,2],[2,3],[3],[2],[]]", expected)); assert(!engine.matches("[[2],[2,3],[3],[5]]", expected));
});
// Balanced brackets: n 2, maxDepth 2 → (()) and ()(). Every prefix can be completed; only 4-bracket strings are answers.
const brackets = (nodes, edges, fields = { n: 2, maxDepth: 2 }) => graph(nodes, edges, { directed: true, start: "start", fields });
const bracketNodes = ["start", "(", "((", "(()", "(())", "()", "()(", "()()"];
const bracketEdges = [["start", "("], ["(", "(("], ["((", "(()"], ["(()", "(())"], ["(", "()"], ["()", "()("], ["()(", "()()"]];
test("Balanced brackets returns only complete strings", () => {
  use("balanced-brackets"); const value = brackets(bracketNodes, bracketEdges);
  valid(value); same(engine.result(value), ["(())", "()()"]); same(engine.result(value, ["shallow-search"]), []); same(engine.result(value, ["last-branch"]), ["()()"]); same(engine.result(value, ["wrong-start"], "(("), ["(())"]);
});
test("Balanced brackets maxDepth 1 allows only one open bracket", () => {
  use("balanced-brackets"); const fields = { n: 2, maxDepth: 1 };
  const value = brackets(["start", "(", "()", "()(", "()()"], [["start", "("], ["(", "()"], ["()", "()("], ["()(", "()()"]], fields);
  valid(value); same(engine.result(value), ["()()"]);
  assert.throws(() => valid(brackets(bracketNodes, bracketEdges, fields)), /: \(\( is not an allowed prefix/);
});
test("Balanced brackets rejects an unbalanced prefix and a missing prefix", () => {
  use("balanced-brackets");
  assert.throws(() => valid(brackets([...bracketNodes, "())"], [...bracketEdges, ["()", "())"]])), /: \(\)\) is not an allowed prefix/);
  assert.throws(() => valid(brackets(bracketNodes.filter(node => node !== "()("), bracketEdges.filter(([, to]) => to !== "()("))), /prefix \(\)\(\. /);
  assert.throws(() => engine.shape(brackets(["start", "(", "(()"], [["start", "("], ["(", "(()"]])), /: \(\(\) needs its prefix \(\(\./);
});
test("Balanced brackets output ignores order but not repeats, with or without quotes", () => {
  use("balanced-brackets"); const expected = ["(())", "()()"];
  assert(engine.matches('["()()","(())"]', expected)); assert(engine.matches("[()(), (())]", expected)); assert(engine.matches("(()), ()()", expected));
  assert(!engine.matches('["(())","(())","()()"]', expected)); assert(!engine.matches('["(())"]', expected)); assert(!engine.matches('["(())","()()",")("]', expected));
  assert(engine.matches("[]", [])); same(engine.format(expected), '["(())","()()"]');
});
test("Balanced brackets reads n and maxDepth as bounded whole numbers", () => {
  use("balanced-brackets"); const n = { id: "n", kind: "integer", min: 1, max: 5 };
  same(engine.semantic(" 3 ", n, "n"), 3); assert.throws(() => engine.semantic("6", n, "n"), /at most 5/); assert.throws(() => engine.semantic("0", n, "n"), /at least 1/); assert.throws(() => engine.semantic("1.5", n, "n"), /whole number/);
});
// Split the digits: digits "105", limit 20 → 1|0|5 and 10|5. 05 starts with 0 and 105 is over 20.
const split = (nodes, edges, fields = { digits: "105", limit: 20 }) => graph(nodes, edges, { directed: true, start: "start", fields });
const splitTree = () => split(["start", "1", "1|0", "1|0|5", "10", "10|5"], [["start", "1"], ["1", "1|0"], ["1|0", "1|0|5"], ["start", "10"], ["10", "10|5"]]);
test("Split the digits returns only cuts that use every digit", () => {
  use("split-the-digits"); const value = splitTree();
  valid(value); same(engine.result(value), [[1, 0, 5], [10, 5]]);
  same(engine.result(value, ["last-branch"]), [[10, 5]]); same(engine.result(value, ["shallow-search"]), []); same(engine.result(value, ["wrong-start"], "1"), [[1, 0, 5]]);
});
test("Split the digits dead ends are not answers but must be drawn", () => {
  use("split-the-digits"); const fields = { digits: "17", limit: 5 };
  const value = split(["start", "1"], [["start", "1"]], fields); valid(value); same(engine.result(value), []);
  assert.throws(() => valid(split(["start"], [], fields)), /partial cut 1\./);
});
test("Split the digits rejects leading zeros, pieces over the limit, and out-of-order digits", () => {
  use("split-the-digits");
  const zero = splitTree(); zero.nodes.push("1|05"); zero.edges.push(["1", "1|05"]);
  assert.throws(() => valid(zero), /05 starts with 0/);
  assert.throws(() => valid(split(["start", "1", "1|2", "12"], [["start", "1"], ["1", "1|2"], ["start", "12"]], { digits: "12", limit: 10 })), /12 is over the limit 10/);
  assert.throws(() => valid(split(["start", "1", "1|2", "2"], [["start", "1"], ["1", "1|2"], ["start", "2"]], { digits: "12", limit: 10 })), /does not follow the digits/);
  assert.throws(() => valid(split(["start", "1", "1|0", "1|0|5", "10"], [["start", "1"], ["1", "1|0"], ["1|0", "1|0|5"], ["start", "10"]])), /partial cut 10\|5/);
  assert.throws(() => valid(split(["start"], [], { digits: "12a", limit: 10 })), /1–6 characters/);
});
test("Split the digits output ignores the order of ways, not the order of pieces", () => {
  use("split-the-digits"); const expected = [[1, 0, 5], [10, 5]];
  assert(engine.matches("[[10,5],[1,0,5]]", expected)); assert(!engine.matches("[[5,0,1],[10,5]]", expected)); assert(!engine.matches("[[1,0,5]]", expected));
  assert(engine.matches("[]", [])); assert(!engine.matches("[[1]]", []));
});
test("Split the digits reads digits with or without quotes and keeps leading zeros", () => {
  // In the browser, window is the global object, so the bundled Acorn parser is window.acorn.
  sandbox.window.acorn ??= sandbox.acorn;
  use("split-the-digits"); const field = { id: "digits", kind: "json" };
  same(engine.semantic("1234", field, "digits"), "1234"); same(engine.semantic("\"0105\"", field, "digits"), "0105"); same(engine.semantic("0105", field, "digits"), "0105"); same(engine.semantic("'42'", field, "digits"), "42");
});
test("Playlist uses index order regardless of drawing order", () => {
  use("kth-song-in-playlist"); const value = graph(["root=[]", "root[0]=10", "root[1]=20"], [["root=[]", "root[1]=20"], ["root=[]", "root[0]=10"]], { directed: true, start: "root=[]", fields: { k: 1 }, nodeMarkers: { songId: { "root[0]=10": 10, "root[1]=20": 20 } } });
  valid(value); same(engine.result(value), 10); value.nodeMarkers.songId["root[0]=10"] = 100; assert.throws(() => valid(value), /shows 10/);
});
for (const [id, label, marker] of [["coins-on-level-k", "root[0]=7", "coinValue"], ["dungeon-gold-run", "0:5g", "gold"], ["employee-importance", "1:5", "importance"], ["structy-tree-sum", "node 0: 5", "nodeValue"], ["path-sum", "node 0: 5", "nodeValue"], ["shut-the-garden-valve", "1:5", "flow"]]) {
  test(`${id}: displayed values cannot disagree with fields`, () => { use(id); assert.throws(() => engine.values(graph([label], [], { nodeMarkers: { [marker]: { [label]: 100 } } })), /shows/); });
}
test("Employee output keeps required numeric order", () => { use("who-keeps-their-job"); assert(engine.matches("[7,10]", ["7", "10"])); assert(!engine.matches("[10,7]", ["7", "10"])); });
for (const id of ["package-to-the-outpost", "reachable-nodes-with-restrictions"]) test(`${id}: reject disconnected correct input`, () => { use(id); assert.throws(() => engine.shape(graph(["0", "1", "2"], [["0", "1"]])), /one tree/); });
test("Multiple keys use a union; the bug uses only the first", () => {
  use("museum-vault-keyring"); const value = graph(["0", "1", "2", "3"], [["0", "2"], ["1", "2"]], { directed: true, starts: ["0", "1"] });
  valid(value); same(engine.result(value), 3); same(engine.result(value, ["first-start-only"]), 2); value.starts = []; same(engine.result(value), 0);
});
test("Trust equality is accepted and exposes strict threshold", () => {
  use("trusted-courier-networks"); const value = graph(["0", "1"], [["0", "1"]], { fields: { k: 2, scores: [[2,2],[2,2]] } });
  valid(value); same(engine.result(value), 1); same(engine.result(value, ["strict-threshold"]), 2); value.fields.scores = [[2,1],[1,2]]; assert.throws(() => valid(value), /not allowed/);
});
test("Properties need real overlap and uniform row lengths", () => {
  use("properties-graph"); const value = graph(["row 0: {1}", "row 1: {2}"], [["row 0: {1}", "row 1: {2}"]], { fields: { k: 1 } });
  assert.throws(() => valid(value), /not allowed/); value.nodes[1] = "row 1: {2,2}"; assert.throws(() => engine.values(value), /same number/);
});
test("Farmland must fill its rectangle", () => { use("find-all-groups-of-farmland"); assert.throws(() => engine.values(graph(["(0,0)", "(0,1)", "(1,0)"], [])), /complete rectangle/); });
test("A scalar cannot contain children", () => { use("codewars-array-deep-count"); assert.throws(() => engine.shape(graph(["outer array", "[0]=1", "[0][0]=2"], [["outer array", "[0]=1"], ["[0]=1", "[0][0]=2"]], { directed: true, start: "outer array" })), /cannot contain/); });
test("Moocast rejects impossible long-range arrows", () => { use("moocast"); assert.throws(() => engine.values(graph(["0: (0,0) p=1", "1: (100,0) p=1"], [["0: (0,0) p=1", "1: (100,0) p=1"]], { directed: true })), /not allowed/); });
test("Bomb geometry determines all trigger arrows", () => {
  use("detonate-the-maximum-bombs"); const value = graph(["0", "1"], [["0", "1"]], { directed: true, nodeMarkers: { geometry: { "0": [1,1,3], "1": [3,1,1] } } }); valid(value); value.edges.push(["1", "0"]); assert.throws(() => valid(value), /not allowed/);
});
test("Getting Gold derives draft squares from traps", () => {
  use("kattis-getting-gold"); const value = graph(["(1,1)", "(1,2)"], [], { directed: true, nodeMarkers: { cellSafety: { "(1,1)": "clear", "(1,2)": "trap" }, containsGold: { "(1,1)": "yes", "(1,2)": "no" } } });
  assert.throws(() => valid(value), /must be marked draft/); value.nodeMarkers.cellSafety["(1,1)"] = "draft"; valid(value); same(engine.result(value), 1);
});
for (const id of ["longest-increasing-path-in-a-matrix", "number-of-increasing-paths-in-a-grid"]) test(`${id}: require complete rectangular cells and increasing diagonals`, () => {
  use(id); const value = graph(["(0,0)", "(1,1)"], [], { directed: true, fields: { rows: 2, columns: 2 }, nodeMarkers: { cellValue: { "(0,0)": 1, "(1,1)": 2 } } }); assert.throws(() => valid(value), /every cell/);
  value.nodes = ["(0,0)", "(0,1)", "(1,0)", "(1,1)"]; value.nodeMarkers.cellValue = { "(0,0)": 2, "(0,1)": 2, "(1,0)": 2, "(1,1)": 1 }; value.edges = [["(1,1)", "(0,1)"], ["(1,1)", "(1,0)"]]; valid(value); const changed = engine.changed(value, ["add-diagonals"]); assert(changed.edges.some(([from,to]) => from === "(1,1)" && to === "(0,0)")); assert(!changed.edges.some(([from,to]) => from === "(0,0)" && to === "(1,1)"));
});
test("Visible road weight must match its field; fractions stay equivalent", () => {
  use("package-to-the-outpost"); const value = graph(["0", "1"], [["0", "1"]], { fields: { target: "1" }, edgeMarkers: { roadTime: { "0\u00001": 0.5 } } });
  const actual = drawing(value); actual.edges[0].label = "7"; assert(!engine.grade(engine.expected(value), actual).labels); actual.edges[0].label = "1/2"; assert(engine.grade(engine.expected(value), actual).labels);
});
test("Gas feedback preserves digit strings", () => { use("gas-pocket-survey"); same(engine.format([["1", "S"]]), '[["1","S"]]'); });
test("Numeric source-to-target paths are accepted", () => { use("all-paths-from-source-to-target"); assert(engine.matches("[[0,1,2]]", [["0", "1", "2"]])); });
test("Well marker accepts explained yes/no and Boolean forms", () => { use("villages-without-wells"); const spec = { kind: "choice", choices: [{ value: "yes" }, { value: "no" }] }; same(engine.semantic("true", spec, "well"), "yes"); same(engine.semantic("0", spec, "well"), "no"); });
console.log(`Validated ${count} actual-engine Step 2 audit regressions.`);
