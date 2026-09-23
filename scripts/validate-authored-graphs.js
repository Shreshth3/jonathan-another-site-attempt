#!/usr/bin/env node
// Independent checks of the raw-input → exact-graph contract.
// Deliberately does not import authoring builders, answer keys, or app grading.
// Covers every variant plus Original/New grid and restriction cases in Steps 3/4.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const GRID_PROBLEMS = new Set([
  'flood-fill', 'gfg-grid-path-exists', 'ten-kinds-of-people', 'minesweeper',
  'word-search', 'kattis-getting-gold', 'number-of-islands', 'max-area-of-island',
  'structy-minimum-island', 'hackerrank-connected-cells',
  'maximum-number-of-fish-in-a-grid', 'find-all-groups-of-farmland',
  'count-sub-islands', 'longest-increasing-path-in-a-matrix',
  'number-of-increasing-paths-in-a-grid', 'battleships-in-a-board'
]);
const SIDES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const CORNERS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const numberLabels = count => Array.from({ length: count }, (_, i) => String(i));
const cellLabel = (row, column) => `(${row},${column})`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function parseInput(input) {
  if (input && typeof input === 'object') return input;
  // These are trusted repository fixtures containing JavaScript literals, not
  // user input. A fresh context and timeout prevent fixture state from leaking.
  const names = [...input.matchAll(/\b([A-Za-z]\w*)\s*=/g)].map(match => match[1]);
  if (!names.length) throw new Error('No named raw-input fields found');
  return vm.runInNewContext(`let ${input}; ({${names.join(',')}})`, {}, { timeout: 100 });
}

function graph(directed = false) {
  return { directed, nodes: [], edges: [] };
}

function addNode(model, label, metadata = {}) {
  model.nodes.push({ id: String(label), label: String(label), ...metadata });
}

function addEdge(model, from, to, weight, color) {
  model.edges.push({
    from: String(from), to: String(to),
    ...(weight == null ? {} : { label: String(weight) }),
    ...(color == null ? {} : { color })
  });
}

function addNumberedNodes(model, count) {
  for (const label of numberLabels(count)) addNode(model, label);
}

function deriveGrid(id, input) {
  const rows = input.sky || input.marina || input.yard || input.park || input.cave ||
    input.grid2 || input.image || input.board || input.dungeon || input.matrix ||
    input.land || input.grid;
  if (!Array.isArray(rows) || !rows.length) throw new Error('Missing nonempty grid');
  const increasing = id === 'longest-increasing-path-in-a-matrix' ||
    id === 'number-of-increasing-paths-in-a-grid';
  const goldDungeon = id === 'kattis-getting-gold';
  const model = graph(increasing || goldDungeon);
  const allPositions = increasing || ['word-search', 'minesweeper',
    'ten-kinds-of-people', 'gas-pocket-survey'].includes(id);

  function includesCell(value) {
    if (allPositions) return true;
    if (goldDungeon) return value !== '#';
    if (id === 'flood-fill') return value === rows[input.sr][input.sc];
    if (id === 'gfg-grid-path-exists') return value !== 0;
    if (id === 'maximum-number-of-fish-in-a-grid') return value > 0;
    if (id === 'battleships-in-a-board') return value === 'X';
    if (id === 'counting-docked-boats') return value === 'B';
    if (id === 'longest-freight-train') return value === 'T';
    return value === 1 || value === '1' || value === 'L';
  }

  const positions = [];
  rows.forEach((row, r) => [...row].forEach((value, c) => {
    if (includesCell(value)) {
      positions.push([r, c]);
      addNode(model, cellLabel(r, c));
    }
  }));
  const existing = new Set(model.nodes.map(node => node.label));
  const diagonal = ['counting-constellations', 'minesweeper',
    'hackerrank-connected-cells'].includes(id);
  const moves = diagonal ? [...SIDES, ...CORNERS] : SIDES;

  for (const [r, c] of positions) {
    const from = cellLabel(r, c);
    // Traps remain visible obstacles. Draft cells may be entered, then stop.
    if (goldDungeon && (rows[r][c] === 'T' ||
      SIDES.some(([dr, dc]) => rows[r + dr]?.[c + dc] === 'T'))) continue;
    for (const [dr, dc] of moves) {
      const rr = r + dr, cc = c + dc, to = cellLabel(rr, cc);
      if (!existing.has(to) || (!model.directed && from >= to)) continue;
      if (increasing && rows[rr][cc] <= rows[r][c]) continue;
      if (id === 'ten-kinds-of-people' && rows[rr][cc] !== rows[r][c]) continue;
      if (goldDungeon && rows[rr][cc] === 'T') continue;
      addEdge(model, from, to);
    }
  }
  return model;
}

function deriveNested(items) {
  const model = graph(true);
  function visit(value, location, parent) {
    const label = `${location}=${Array.isArray(value) ? '[]' : value}`;
    addNode(model, label);
    if (parent !== undefined) addEdge(model, parent, label);
    if (Array.isArray(value)) value.forEach((child, i) => visit(child, `${location}[${i}]`, label));
  }
  visit(items, 'root');
  return model;
}

function deriveRunes(dials) {
  const model = graph(true);
  addNode(model, 'start');
  function extend(prefix, index) {
    if (index === dials.length) return;
    for (const rune of dials[index]) {
      if (rune === prefix.at(-1)) continue;
      addNode(model, prefix + rune);
      addEdge(model, prefix || 'start', prefix + rune);
      extend(prefix + rune, index + 1);
    }
  }
  extend('', 0);
  return model;
}

// Balance lock: a node is a comma-joined prefix whose running total stays at most limit.
function deriveBalanceLock(dials, limit) {
  const model = graph(true);
  addNode(model, 'start');
  function extend(prefix, total, index) {
    if (index === dials.length) return;
    for (const weight of dials[index]) {
      if (total + weight > limit) continue;
      const next = prefix ? `${prefix},${weight}` : String(weight);
      addNode(model, next);
      addEdge(model, prefix || 'start', next);
      extend(next, total + weight, index + 1);
    }
  }
  extend('', 0, 0);
  return model;
}

function deriveVariant(id, input) {
  if (input.sky || input.marina || input.yard || input.park || input.cave) {
    return deriveGrid(id, input);
  }
  if (input.items || input.playlist) return deriveNested(input.items || input.playlist);
  if (id === 'the-balance-lock') return deriveBalanceLock(input.dials, input.limit);
  if (input.dials) return deriveRunes(input.dials);
  const model = graph();

  if (input.ids) {
    model.directed = true;
    const labels = input.ids.map((id, i) => input.liters ? `${id}:${input.liters[i]}` : String(id));
    labels.forEach(label => addNode(model, label));
    (input.bosses || input.feeds).forEach((parent, i) => {
      if (parent !== 0) addEdge(model, labels[input.ids.indexOf(parent)], labels[i]);
    });
  } else if (input.caller) {
    model.directed = true;
    addNumberedNodes(model, input.n);
    input.caller.forEach((parent, i) => {
      if (parent !== -1) addEdge(model, parent, i, input.waitDays[parent]);
    });
  } else if (input.rooms || input.vaults || input.graph) {
    model.directed = true;
    const adjacency = input.rooms || input.vaults || input.graph;
    const labels = numberLabels(adjacency.length).map((id, i) =>
      input.gold ? `${id}:${input.gold[i]}g` : id);
    labels.forEach(label => addNode(model, label));
    adjacency.forEach((neighbors, i) => neighbors.forEach(next => addEdge(model, labels[i], labels[next])));
  } else if (input.trust || input.worked) {
    const matrix = input.trust || input.worked;
    addNumberedNodes(model, matrix.length);
    matrix.forEach((row, i) => row.forEach((score, j) => {
      if (i < j && score >= (input.k ?? 1)) addEdge(model, i, j);
    }));
  } else {
    addNumberedNodes(model, input.n);
    const connections = input.paths || input.friendships || input.wires || input.trails || input.roads || input.tracks;
    if (!connections) throw new Error(`Uncovered variant input: ${id}`);
    connections.forEach(([from, to, weight], i) => addEdge(model, from, to, weight, input.colors?.[i]));
    for (const node of model.nodes) {
      if (input.flooded?.includes(Number(node.id))) node.color = 'blue';
    }
  }
  return model;
}

function deriveRestricted(input) {
  const model = graph();
  for (let i = 0; i < input.n; i++) {
    const restricted = input.restricted.includes(i);
    addNode(model, `${i}${restricted ? ' (restricted)' : ''}`, restricted ? { blocked: true } : {});
  }
  for (const [a, b] of input.edges) addEdge(model, model.nodes[a].id, model.nodes[b].id);
  return model;
}

function canonical(model, id) {
  const names = new Map(model.nodes.map(node => [String(node.id), String(node.label)]));
  if (names.size !== model.nodes.length) throw new Error('Duplicate node IDs');
  if (new Set(names.values()).size !== model.nodes.length) throw new Error('Duplicate node labels');
  const restrictionProblem = ['flooded-campsite-trails', 'reachable-nodes-with-restrictions'].includes(id);
  const nodes = model.nodes.map(node => {
    const color = node.color || (node.blocked ? 'blue' : '');
    // In the shipped drawing contract, blue represents a blocked input object.
    const blocked = Boolean(node.blocked || (restrictionProblem && ['red', 'blue'].includes(color)));
    return JSON.stringify([String(node.label), color, blocked]);
  }).sort();
  const edges = model.edges.map(edge => {
    let from = names.get(String(edge.from)), to = names.get(String(edge.to));
    if (from === undefined || to === undefined) throw new Error('Edge refers to a missing node');
    if (!model.directed && from > to) [from, to] = [to, from];
    return JSON.stringify([from, to, String(edge.label ?? ''), edge.color || '']);
  }).sort();
  return { directed: model.directed, nodes, edges };
}

function main() {
  const failures = [];
  let checked = 0;
  for (const group of ['original', 'variant', 'new']) {
    for (const section of ['visual-lessons', 'step4-specs']) {
      const file = `${section}-${group}.json`;
      for (const lesson of readJson(file)) {
        const grid = GRID_PROBLEMS.has(lesson.id);
        const restricted = lesson.id === 'reachable-nodes-with-restrictions';
        if (group !== 'variant' && !grid && !restricted) continue;
        for (const [index, task] of (lesson.structureTasks || lesson.cases).entries()) {
          const location = `${file} / ${lesson.id} / ${task.caseId || task.id || index + 1}`;
          try {
            const input = parseInput(task.input);
            const expected = restricted ? deriveRestricted(input) :
              group === 'variant' ? deriveVariant(lesson.id, input) : deriveGrid(lesson.id, input);
            const actual = canonical(task.canvas, lesson.id);
            const wanted = canonical(expected, lesson.id);
            for (const part of ['directed', 'nodes', 'edges']) {
              if (JSON.stringify(actual[part]) !== JSON.stringify(wanted[part])) {
                failures.push(`${location}: ${part}\n  expected ${JSON.stringify(wanted[part])}\n  actual   ${JSON.stringify(actual[part])}`);
              }
            }
            checked++;
          } catch (error) {
            failures.push(`${location}: ${error.message}`);
          }
        }
      }
    }
  }
  // Prevent accidental loss of the independently reviewed families.
  if (checked < 344) failures.push(`Only ${checked} graphs checked; expected at least 344.`);
  if (failures.length) {
    console.error(failures.join('\n'));
    console.error(`Authored graph validation failed: ${failures.length} differences across ${checked} graphs.`);
    process.exitCode = 1;
  } else {
    console.log(`Validated ${checked} authored graphs from raw inputs, including weights, colors, and blocked nodes.`);
  }
}

if (require.main === module) main();
module.exports = { parseInput, deriveGrid, deriveVariant, deriveRestricted, canonical };
