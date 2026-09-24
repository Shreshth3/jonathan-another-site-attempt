#!/usr/bin/env node
"use strict";

// Step 2 must ask for the value the real problem returns. A matching JavaScript
// type is not enough: a list of visited nodes is not a list of complete paths.
// Keep this map independent from the lesson specs so changing a spec cannot
// silently weaken the contract.
const fs = require("fs");
const path = require("path");

const EXPECTED_CONTRACT = {
  "all-paths-from-source-to-target": "enumerated-paths",
  "battleships-in-a-board": "component-count",
  "course-schedule": "acyclic-completion-boolean",
  "detonate-the-maximum-bombs": "maximum-reached-count",
  "evaluate-division": "ordered-query-values",
  "find-if-path-exists-in-graph": "target-reachable-boolean",
  "flatten-nested-list-iterator": "iterator-output-sequence",
  "is-graph-bipartite": "valid-two-coloring-boolean",
  "keys-and-rooms": "all-reached",
  "kill-process": "reached-nodes",
  "letter-combinations-of-a-phone-number": "generated-terminal-strings",
  "longest-increasing-path-in-a-matrix": "longest-path-length",
  "minesweeper": "transformed-grid",
  "nested-list-weight-sum": "depth-weighted-value-sum",
  "nested-list-weight-sum-ii": "inverse-depth-weighted-value-sum",
  "network-delay-time": "maximum-shortest-path-weight-or-minus-one",
  "number-of-connected-components-in-an-undirected-graph": "component-count",
  "number-of-increasing-paths-in-a-grid": "path-count-modulo",
  "number-of-islands": "component-count",
  "number-of-provinces": "component-count",
  "possible-bipartition": "valid-two-coloring-boolean",
  "smallest-string-with-swaps": "component-sorted-string",
  "time-needed-to-inform-all-employees": "maximum-path-weight",
  "water-and-jug-problem": "target-state-reachable-boolean",
  "word-search": "target-word-path-exists-boolean",
  "who-keeps-their-job": "unreached-nodes",
  "busiest-shelf-level": "widest-level-index",
  "coins-on-level-k": "level-value-sum",
  "counting-constellations": "component-count",
  "counting-docked-boats": "border-component-count",
  "routes-past-the-coffee-cart": "enumerated-paths",
  "villages-without-wells": "components-without-source-count",
  "gas-pocket-survey": "transformed-grid",
  "gold-and-silver-lights": "selected-color-count",
  "dungeon-gold-run": "reached-node-value-sum",
  "flooded-campsite-trails": "target-reachable-boolean",
  "longest-freight-train": "maximum-component-size",
  "one-color-metro-ride": "same-color-target-reachable-boolean",
  "office-rumor-reach": "reached-count",
  "package-to-the-outpost": "shortest-path-weight",
  "perfect-size-campsites": "exact-size-component-count",
  "count-routes-to-summit": "path-count",
  "runes-on-the-castle-door": "generated-terminal-strings",
  "the-balance-lock": "generated-terminal-strings",
  "under-the-limit": "generated-terminal-strings",
  "save-the-date-phone-chain": "deadline-reached-count",
  "shut-the-garden-valve": "reached-node-value-sum",
  "biggest-study-group": "maximum-component-size",
  "kth-song-in-playlist": "kth-visited-node-or-minus-one",
  "museum-vault-keyring": "reached-count",
  "top-of-the-pile": "level-value-sum",
  "trusted-courier-networks": "component-count",
  "ten-kinds-of-people": "ordered-query-values",
  "codewars-array-deep-count": "recursive-item-count",
  "gfg-grid-path-exists": "target-reachable-boolean",
  "hackerrank-connected-cells": "maximum-component-size",
  "count-sub-islands": "qualified-component-count",
  "employee-importance": "reached-node-value-sum",
  "evaluate-boolean-binary-tree": "root-expression-value",
  "usaco-fence-planning": "minimum-component-bounding-perimeter",
  "find-all-groups-of-farmland": "component-bounding-boxes",
  "flood-fill": "transformed-grid",
  "kattis-getting-gold": "reached-selected-node-count",
  "ladder-takahashi": "maximum-reached-node-value",
  "structy-largest-component": "maximum-component-size",
  "max-area-of-island": "maximum-component-size",
  "structy-max-root-to-leaf-path-sum": "maximum-root-leaf-value-sum",
  "maximum-number-of-fish-in-a-grid": "maximum-component-value-sum",
  "usaco-milk-factory": "minimum-universally-reachable-node-or-minus-one",
  "structy-minimum-island": "minimum-component-size",
  "moocast": "maximum-reached-count",
  "path-sum": "target-root-leaf-sum-exists-boolean",
  "properties-graph": "component-count",
  "reachable-nodes-with-restrictions": "reached-count",
  "transitive-closure": "reachability-matrix",
  "structy-tree-sum": "reached-node-value-sum",
  "wheres-my-internet": "unreached-nodes"
};

const files = ["step2-specs-original.json", "step2-specs-variant.json", "step2-specs-new.json"];
const root = path.resolve(__dirname, "..");
const specs = files.flatMap(file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8")));
const problems = new Map(specs.map(spec => [spec.id, spec]));
const failures = [];
const engineSource = fs.readFileSync(path.join(root, "visual-library.js"), "utf8");
const counterResultSource = engineSource.slice(engineSource.indexOf("function counterResult("), engineSource.indexOf("function shortestCounterPath("));
const implementedResults = new Set([...counterResultSource.matchAll(/case\s+"([^"]+)"\s*:/g)].map(match => match[1]));
const acyclicSource = engineSource.slice(engineSource.indexOf("function counterIsAcyclic("), engineSource.indexOf("function shortestCounterPath("));
const outputMatcherSource = engineSource.slice(engineSource.indexOf("function counterOutputMatches("), engineSource.indexOf("function formatCounterOutput("));
const mistakenGraphSource = engineSource.slice(engineSource.indexOf("function mistakenGraph("), engineSource.indexOf("function coordinate("));
const divisionEvaluatorSource = engineSource.slice(engineSource.indexOf("function counterDivisionQueryValues("), engineSource.indexOf("function counterJugTarget("));
const ORDER_SENSITIVE_RESULTS = new Set(["ordered-query-values", "iterator-output-sequence", "transformed-grid", "reachability-matrix"]);
const FLAT_ORDER_SENSITIVE_RESULTS = new Set(["ordered-query-values", "iterator-output-sequence"]);

function semanticInput(input, collection, id) {
  return (input?.[collection] || []).find(item => item.id === id);
}

for (const [id, expected] of Object.entries(EXPECTED_CONTRACT)) {
  const spec = problems.get(id);
  if (!spec) {
    failures.push(`${id}: missing Step 2 spec`);
    continue;
  }
  const implemented = spec.input?.result;
  const declared = spec.input?.returnContract;
  if (implemented !== expected) failures.push(`${id}: expected implemented evaluator ${expected}; found ${implemented || "none"}`);
  if (declared !== undefined && declared !== expected) failures.push(`${id}: declared returnContract ${declared} does not match ${expected}`);
  if (implemented === expected && !implementedResults.has(implemented)) failures.push(`${id}: evaluator ${implemented} is declared but has no engine implementation`);

  if (implemented === "shortest-path-weight") {
    const targetField = spec.input?.resultConfig?.targetField;
    const weightMarker = spec.input?.resultConfig?.weightMarker;
    const target = semanticInput(spec.input, "fields", targetField);
    const weight = semanticInput(spec.input, "markers", weightMarker);
    if (!target || target.kind !== "node") failures.push(`${id}: shortest-path-weight resultConfig.targetField must name a node field`);
    if (!weight || weight.target !== "edge" || !["number", "integer"].includes(weight.kind)) failures.push(`${id}: shortest-path-weight resultConfig.weightMarker must name a numeric edge marker`);
  }
  if (implemented === "reached-node-value-sum") {
    const markerId = spec.input?.resultConfig?.valueMarker;
    if (!markerId) failures.push(`${id}: reached-node-value-sum must declare input.resultConfig.valueMarker`);
    else {
      const marker = semanticInput(spec.input, "markers", markerId);
      if (!marker || marker.target !== "node" || !["number", "integer"].includes(marker.kind)) failures.push(`${id}: valueMarker ${markerId} must name a numeric node marker`);
    }
  }
  if (["target-reachable-boolean", "same-color-target-reachable-boolean"].includes(implemented)) {
    const targetField = spec.input?.resultConfig?.targetField;
    const target = semanticInput(spec.input, "fields", targetField);
    if (!targetField || !target || target.kind !== "node") failures.push(`${id}: ${implemented} resultConfig.targetField must name a node field`);
  }
  if (implemented === "maximum-shortest-path-weight-or-minus-one") {
    const marker = semanticInput(spec.input, "markers", spec.input?.resultConfig?.weightMarker);
    if (!marker || marker.target !== "edge" || !["number", "integer"].includes(marker.kind)) failures.push(`${id}: network delay must select a numeric edge marker`);
  }
  if (implemented === "maximum-path-weight") {
    const marker = semanticInput(spec.input, "markers", spec.input?.resultConfig?.delayMarker);
    if (!marker || marker.target !== "node" || !["number", "integer"].includes(marker.kind)) failures.push(`${id}: maximum path time must select a numeric node marker`);
  }
  if (implemented === "deadline-reached-count") {
    const wait = semanticInput(spec.input, "markers", spec.input?.resultConfig?.waitMarker);
    const deadline = semanticInput(spec.input, "fields", spec.input?.resultConfig?.deadlineField);
    if (!wait || wait.target !== "node" || !["number", "integer"].includes(wait.kind)) failures.push(`${id}: deadline count must select a numeric node wait marker`);
    if (!deadline || !["number", "integer"].includes(deadline.kind)) failures.push(`${id}: deadline count must select a numeric deadline field`);
  }
  if (["level-value-sum", "kth-visited-node-or-minus-one"].includes(implemented) && spec.input?.resultConfig?.valueMarker) {
    const config = spec.input.resultConfig, marker = semanticInput(spec.input, "markers", config.valueMarker);
    const field = semanticInput(spec.input, "fields", implemented === "level-value-sum" ? config.depthField : config.positionField);
    const drawnNumbers = spec.drawingEditor?.mode === "array-number" && spec.input.fields?.some(item => item.id === spec.arrayInputField && item.kind === "json");
    if (!drawnNumbers && (!marker || marker.target !== "node" || !["number", "integer"].includes(marker.kind))) failures.push(`${id}: ${implemented} valueMarker must name a numeric node marker`);
    if (!field || field.kind !== "integer") failures.push(`${id}: ${implemented} parameter selector must name an integer field`);
  }
  if (implemented === "exact-size-component-count") {
    const field = semanticInput(spec.input, "fields", spec.input?.resultConfig?.sizeField);
    if (!field || field.kind !== "integer") failures.push(`${id}: exact-size-component-count sizeField must name an integer field`);
  }
  if (implemented === "target-root-leaf-sum-exists-boolean") {
    const config = spec.input?.resultConfig || {}, target = semanticInput(spec.input, "fields", config.targetField), marker = semanticInput(spec.input, "markers", config.valueMarker);
    if (!target || !["number", "integer"].includes(target.kind)) failures.push(`${id}: path-sum targetField must name a numeric field`);
    if (!marker || marker.target !== "node" || !["number", "integer"].includes(marker.kind)) failures.push(`${id}: path-sum valueMarker must name a numeric node marker`);
  }
  if (["components-without-source-count", "qualified-component-count", "reached-selected-node-count"].includes(implemented)) {
    const config = spec.input?.resultConfig || {}, markerId = config.sourceMarker || config.qualifierMarker || config.selectorMarker;
    const marker = semanticInput(spec.input, "markers", markerId), selected = config.sourceValue ?? config.qualifyingValue ?? config.selectedValue;
    if (!marker || marker.target !== "node" || selected === undefined) failures.push(`${id}: ${implemented} must select a node marker and matching value`);
  }
  if (implemented === "maximum-component-value-sum") {
    const marker = semanticInput(spec.input, "markers", spec.input?.resultConfig?.valueMarker);
    if (!marker || marker.target !== "node" || !["number", "integer"].includes(marker.kind)) failures.push(`${id}: maximum-component-value-sum must select a numeric node marker`);
  }
  if (implemented === "transformed-grid" || (implemented === "ordered-query-values" && spec.input?.resultConfig?.rowsField)) {
    const config = spec.input?.resultConfig || {}, rows = semanticInput(spec.input, "fields", config.rowsField), columns = semanticInput(spec.input, "fields", config.columnsField), values = semanticInput(spec.input, "markers", config.valueMarker);
    if (!rows || rows.kind !== "integer" || !columns || columns.kind !== "integer") failures.push(`${id}: grid evaluator must select integer row and column fields`);
    if (!values || values.target !== "node") failures.push(`${id}: grid evaluator must select a node value marker`);
    if (implemented === "ordered-query-values") { const target = semanticInput(spec.input, "fields", config.targetField); if (!target || target.kind !== "node") failures.push(`${id}: ordered query evaluator must select a target node field`); }
    if (id === "flood-fill") { const color = semanticInput(spec.input, "fields", config.newColorField); if (!color || !["integer", "number"].includes(color.kind)) failures.push(`${id}: transformed grid must select a numeric new-color field`); }
  }
  if (implemented === "ordered-query-values" && spec.input?.resultConfig?.ratioMarker) {
    const config = spec.input.resultConfig, target = semanticInput(spec.input, "fields", config.targetField), ratio = semanticInput(spec.input, "markers", config.ratioMarker);
    if (!target || target.kind !== "node") failures.push(`${id}: ratio query targetField must name a node field`);
    if (!ratio || ratio.target !== "edge" || !["number", "integer"].includes(ratio.kind)) failures.push(`${id}: ratioMarker must name a numeric edge marker`);
    if (!/ratioMarker/.test(divisionEvaluatorSource) || !/mode\s*===\s*"ratio"/.test(counterResultSource)) failures.push(`${id}: ordered-query-values engine has no ratio-query implementation`);
  }
  if (implemented === "target-state-reachable-boolean") {
    const config = spec.input?.resultConfig || {}, fields = [config.jug1CapacityField, config.jug2CapacityField, config.targetField].map(id => semanticInput(spec.input, "fields", id));
    if (fields.some(field => !field || field.kind !== "integer")) failures.push(`${id}: jug evaluator must select integer capacity and target fields`);
  }
  if (implemented === "target-word-path-exists-boolean") {
    const config = spec.input?.resultConfig || {}, rows = semanticInput(spec.input, "fields", config.rowsField), columns = semanticInput(spec.input, "fields", config.columnsField), word = semanticInput(spec.input, "fields", config.wordField), letters = semanticInput(spec.input, "markers", config.letterMarker);
    if (!rows || rows.kind !== "integer" || !columns || columns.kind !== "integer" || !word || word.kind !== "text" || !letters || letters.target !== "node" || letters.kind !== "text") failures.push(`${id}: word evaluator must select dimensions, target word, and node letters`);
  }
  if (implemented === "acyclic-completion-boolean" && spec.rounds?.some(round => round.bugs?.includes("wrong-start")) && !/bugs\.includes\("wrong-start"\)/.test(acyclicSource)) {
    failures.push(`${id}: wrong-start round is not implemented by the whole-graph acyclic evaluator`);
  }
}

for (const id of problems.keys()) {
  if (!EXPECTED_CONTRACT[id]) failures.push(`${id}: missing independent real-return contract`);
}

if ([...implementedResults].some(result => ORDER_SENSITIVE_RESULTS.has(result)) && !/counterInputSpec\(\)\.result|resultKind/.test(outputMatcherSource)) {
  failures.push("Step 2 output matcher is not result-aware, so it treats order-sensitive arrays like unordered node sets");
}
for (const id of ["flood-fill", "ten-kinds-of-people"]) {
  const spec = problems.get(id);
  if (spec?.rounds?.some(round => round.bugs?.includes("add-diagonals")) && !/resultConfig\?\.valueMarker/.test(mistakenGraphSource)) {
    failures.push(`${id}: add-diagonals must preserve the same-value rule instead of adding a second misconception`);
  }
}
for (const result of implementedResults) {
  if (FLAT_ORDER_SENSITIVE_RESULTS.has(result) && !outputMatcherSource.includes(`"${result}"`)) failures.push(`${result}: flat ordered output has no exact-order comparison branch`);
}

if (failures.length) {
  const message = `Step 2 real-return audit found ${failures.length} mismatch(es):\n${failures.map(item => `- ${item}`).join("\n")}`;
  if (process.argv.includes("--strict")) {
    console.error(message);
    process.exit(1);
  }
  console.warn(`${message}\nAudit mode only. Run with --strict for final acceptance.`);
} else {
  console.log(`Validated exact Step 2 return semantics for ${specs.length} problems.`);
}
