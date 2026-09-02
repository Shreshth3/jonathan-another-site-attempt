const EXTRA_GRID_CELL_PROBLEMS = new Set(["kattis-getting-gold"]);
const PATH_LABELED_NESTED_PROBLEMS = new Set([
  "flatten-nested-list-iterator",
  "nested-list-weight-sum",
  "nested-list-weight-sum-ii",
  "kth-song-in-playlist",
  "top-of-the-pile"
]);

function coordinateFromNode(node) {
  const idMatch = String(node?.id ?? "").match(/^r(\d+)c(\d+)$/i);
  if (idMatch) return `(${idMatch[1]},${idMatch[2]})`;
  const labelMatch = String(node?.label ?? "").match(/^\(?\s*(\d+)\s*,\s*(\d+)\s*\)?/);
  return labelMatch ? `(${labelMatch[1]},${labelMatch[2]})` : null;
}

function normalizeCanvas(value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach(normalizeCanvas);
    return;
  }
  if (typeof value.directed === "boolean" && Array.isArray(value.nodes) && Array.isArray(value.edges)) {
    value.nodes.forEach(node => {
      const coordinate = coordinateFromNode(node);
      if (coordinate) node.label = coordinate;
    });
  }
  Object.values(value).forEach(normalizeCanvas);
}

function normalizeGridNodeLabels(lessons, specs) {
  const gridIds = new Set(specs
    .filter(spec => spec.visualKind === "grid" || EXTRA_GRID_CELL_PROBLEMS.has(spec.id))
    .map(spec => spec.id));
  lessons.filter(lesson => gridIds.has(lesson.id)).forEach(normalizeCanvas);
  normalizeNestedNodeLabels(lessons);
  return lessons;
}

function nestedLabelMap(canvas) {
  const nodes = canvas?.nodes || [];
  const edges = canvas?.edges || [];
  const root = nodes.find(node => /^(?:root|root=\[\])$/.test(String(node.label)));
  if (!root) return null;
  const outgoing = new Map(nodes.map(node => [String(node.id), []]));
  for (const edge of edges) outgoing.get(String(edge.from))?.push(String(edge.to));
  const nodeById = new Map(nodes.map(node => [String(node.id), node]));
  const labels = new Map([[String(root.id), "root=[]"]]);
  const visit = (parentId, path) => {
    for (const [index, childId] of (outgoing.get(parentId) || []).entries()) {
      if (labels.has(childId)) continue;
      const child = nodeById.get(childId);
      const oldLabel = String(child?.label || "");
      const childPath = `${path}[${index}]`;
      const isContainer = (outgoing.get(childId) || []).length > 0 || /^(?:empty|[A-Z]|L\d*)$/.test(oldLabel);
      const value = /^-?\d+[a-z]$/.test(oldLabel) ? oldLabel.slice(0, -1) : oldLabel;
      labels.set(childId, isContainer ? `${childPath}=[]` : `${childPath}=${value}`);
      if (isContainer) visit(childId, childPath);
    }
  };
  visit(String(root.id), "root");
  return labels.size === nodes.length ? labels : null;
}

function applyNestedLabelMap(canvas, labels) {
  if (!canvas || !labels) return;
  canvas.nodes = canvas.nodes.map(node => ({ ...node, id: labels.get(String(node.id)), label: labels.get(String(node.id)) }));
  canvas.edges = canvas.edges.map(edge => ({ ...edge, from: labels.get(String(edge.from)), to: labels.get(String(edge.to)) }));
}

function normalizeNestedLesson(lesson) {
  for (const task of lesson.buildTasks || []) {
    applyNestedLabelMap(task.canvas, nestedLabelMap(task.canvas));
  }
  for (const task of lesson.conceptTasks || []) {
    if (task.shownModel) applyNestedLabelMap(task.shownModel, nestedLabelMap(task.shownModel));
    if (task.choices?.some(choice => choice.model)) {
      const correct = task.choices.find(choice => choice.id === task.correct)?.model;
      const labels = nestedLabelMap(correct);
      for (const choice of task.choices) if (choice.model) applyNestedLabelMap(choice.model, labels);
    }
    if (task.remedial?.canvas) applyNestedLabelMap(task.remedial.canvas, nestedLabelMap(task.remedial.canvas));
  }
}

function normalizeNestedNodeLabels(lessons) {
  lessons.filter(lesson => PATH_LABELED_NESTED_PROBLEMS.has(lesson.id)).forEach(normalizeNestedLesson);
  return lessons;
}

function usesGridCellLabels(problem) {
  return problem?.visualKind === "grid" || EXTRA_GRID_CELL_PROBLEMS.has(problem?.id);
}

module.exports = { normalizeGridNodeLabels, normalizeNestedNodeLabels, nestedLabelMap, applyNestedLabelMap, usesGridCellLabels };
