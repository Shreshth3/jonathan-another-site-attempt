const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'visual-library.js'), 'utf8');
const engine = {};
vm.runInNewContext(source.slice(source.indexOf('  function arrayNumberLabel('), source.indexOf('  function gradeCanvas(')) + '\nthis.grade = gradeArrayCounterCanvas;', engine);
const passes = result => ['nodes', 'edges', 'direction', 'colors', 'labels'].every(key => result[key]);
function expectedOf(value) {
  const graph = { directed: true, nodes: [], edges: [] };
  function visit(item, id, parent) {
    graph.nodes.push({ id, label: `${id}=${Array.isArray(item) ? '[]' : JSON.stringify(item)}` });
    if (parent !== undefined) graph.edges.push({ from: parent, to: id });
    if (Array.isArray(item)) item.forEach((child, index) => visit(child, `${id}[${index}]`, id));
  }
  visit(value, 'root');
  return graph;
}
function drawingOf(expected) {
  const ids = new Map(expected.nodes.map((node, index) => [node.id, `arbitrary-${index * 7 + 23}`]));
  return {
    directed: expected.directed,
    nodes: expected.nodes.map(node => ({ id: ids.get(node.id), label: node.label.endsWith('=[]') ? 'Array' : node.label.split('=').at(-1) })).reverse(),
    edges: expected.edges.map(edge => ({ from: ids.get(edge.from), to: ids.get(edge.to), label: '' }))
  };
}
let checked = 0;
for (const value of [[], [2, 2], [[2], [2]], [[2, []], [2, [2, 3]], 2], [[], [], []], [-3, 0, 7]]) {
  const base = expectedOf(value);
  for (const kind of ['normal', 'reverse', 'drop-last', 'no-edges']) {
    const expected = structuredClone(base);
    if (kind === 'reverse') expected.edges.forEach(edge => { [edge.from, edge.to] = [edge.to, edge.from]; });
    if (kind === 'drop-last') expected.edges.pop();
    if (kind === 'no-edges') expected.edges = [];
    const drawing = drawingOf(expected);
    assert(passes(engine.grade(expected, drawing)), `${kind}: matching graph rejected`);
    assert(passes(engine.grade(expected, drawing, { ordered: true })), `${kind}: matching ordered graph rejected`);
    drawing.edges.reverse();
    assert(passes(engine.grade(expected, drawing)), `${kind}: unordered arrows rejected`);
    assert(!passes(engine.grade(expected, { ...drawing, directed: false })), 'two-way graph accepted');
    const wrong = structuredClone(drawing);
    wrong.nodes[0].label = 'NaN';
    assert(!passes(engine.grade(expected, wrong)), 'invalid number accepted');
    if (drawing.edges.length) {
      const extra = structuredClone(drawing); extra.edges.push({ ...extra.edges[0] });
      assert(!passes(engine.grade(expected, extra)), 'extra edge accepted');
      const missing = structuredClone(drawing); missing.edges[0].to = 'missing';
      assert(!passes(engine.grade(expected, missing)), 'dangling edge accepted');
      const labeled = structuredClone(drawing); labeled.edges[0].label = '4';
      assert(!passes(engine.grade(expected, labeled)), 'arrow label accepted');
    }
    checked++;
  }
}
const sequence = expectedOf([[1, 2], 3]);
const swapped = drawingOf(sequence); swapped.edges.reverse();
assert(!passes(engine.grade(sequence, swapped, { ordered: true })), 'wrong sibling order accepted');
assert(passes(engine.grade(sequence, swapped)), 'unordered sequence rejected');
const interleaved = drawingOf(sequence);
interleaved.edges = [interleaved.edges[0], interleaved.edges[3], interleaved.edges[1], interleaved.edges[2]];
assert(passes(engine.grade(sequence, interleaved, { ordered: true })), 'global creation order incorrectly graded');
const same = expectedOf([[2], [2]]), moved = drawingOf(same);
moved.edges[3].from = moved.edges[1].from;
assert(!passes(engine.grade(same, moved)), 'duplicate values hide wrong parent');
const reversed = drawingOf(sequence); reversed.edges.forEach(edge => { [edge.from, edge.to] = [edge.to, edge.from]; });
assert(!passes(engine.grade(sequence, reversed)), 'wrong arrow direction accepted');
for (const label of ['null', 'true', '"2"', '{}', '[]', 'Infinity', '', 'root[0]=2']) {
  const drawing = drawingOf(expectedOf([2])); drawing.nodes[0].label = label;
  assert(!passes(engine.grade(expectedOf([2]), drawing)), `invalid label ${label} accepted`);
}
const duplicateIds = drawingOf(sequence); duplicateIds.nodes[0].id = duplicateIds.nodes[1].id;
assert(!passes(engine.grade(sequence, duplicateIds)), 'duplicate IDs accepted');
console.log(`Validated ${checked} Array/number counterexample graphs, duplicates, order, malformed values and connections.`);
