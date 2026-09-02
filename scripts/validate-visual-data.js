const fs = require("fs");
const vm = require("vm");
const path = require("path");
const { spawnSync } = require("child_process");
const { usesGridCellLabels } = require("./normalize-grid-node-labels");

const freshness = spawnSync(process.execPath, [path.resolve(__dirname, "build-visual-data.js"), "--check"], { encoding: "utf8" });
if (freshness.status !== 0) {
  console.error((freshness.stderr || freshness.stdout).trim());
  process.exit(1);
}
const step2Starters = spawnSync(process.execPath, [path.resolve(__dirname, "validate-step2-starters.js")], { encoding: "utf8" });
if (step2Starters.status !== 0) {
  console.error((step2Starters.stderr || step2Starters.stdout).trim());
  process.exit(1);
}

const source = fs.readFileSync(path.resolve(__dirname, "../visual-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const data = sandbox.window.DFS_VISUAL_DATA;
const problems = data?.problems || [];
const errors = [];
for (const filename of ["step2-specs-original.json", "step2-specs-variant.json", "step2-specs-new.json"]) {
  const specs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", filename), "utf8"));
  for (const spec of specs) {
    if (spec.input && Object.prototype.hasOwnProperty.call(spec.input, "outputPlaceholder")) errors.push(`${spec.id}/step2 source: output placeholders are not allowed`);
  }
}
const uiSource = fs.readFileSync(path.resolve(__dirname, "../visual-library.js"), "utf8");
const renderBuildStart = uiSource.indexOf("function renderBuild(task)");
const renderBuildEnd = uiSource.indexOf("function checkBuild(task)", renderBuildStart);
if (renderBuildStart < 0 || renderBuildEnd < 0) {
  errors.push("Step 1 renderer could not be checked for answer giveaways");
  } else {
    const renderBuildSource = uiSource.slice(renderBuildStart, renderBuildEnd);
    const giveawayChecks = [
      ["task.title", "authored task titles"],
      ["task.prompt", "authored hint prompts"],
      ["exactNodeLabels(task.canvas)", "exact node labels"],
      ["renderLockedContract", "the correct graph-model contract"]
    ];
    for (const [needle, label] of giveawayChecks) {
      if (renderBuildSource.includes(needle)) errors.push(`Step 1 must not show ${label} before the student builds the graph`);
    }
    if (!renderBuildSource.includes("renderNodeLabelGuide(task)")) errors.push("Step 1 must show the required node-name format");
  }
const renderConceptStart = uiSource.indexOf("function renderConcept(task)");
const renderConceptEnd = uiSource.indexOf("function checkConcept(task)", renderConceptStart);
if (renderConceptStart < 0 || renderConceptEnd < 0) {
  errors.push("Step 1 concept renderer could not be checked for its drawing tool");
} else {
  const renderConceptSource = uiSource.slice(renderConceptStart, renderConceptEnd);
  if (!renderConceptSource.includes('after($("#graph-lab"))')) errors.push("Every Step 1 concept question must place the drawing tool before its answers");
  if (!renderConceptSource.includes("renderNodeLabelGuide(task)")) errors.push("Step 1 concept drawings must show the node-name format");
}
if (uiSource.includes('$("#graph-lab").hidden = task.kind !== "build"')) errors.push("Step 1 concept questions must not hide the drawing tool");
if (uiSource.includes("counterOutputPlaceholder") || /id="counter-(?:real|bug)-output"[^>]*placeholder=/.test(uiSource)) errors.push("Step 2 output fields must not contain placeholders");
const membershipStart = uiSource.indexOf("function nodeMembershipClaim(");
const membershipEnd = uiSource.indexOf("function directVsReachabilityClaim(", membershipStart);
if (membershipStart < 0 || membershipEnd < 0) {
  errors.push("Step 3 membership-claim renderer could not be checked");
} else {
  const membershipSource = uiSource.slice(membershipStart, membershipEnd);
  if (!membershipSource.includes("choice.misconception") || !membershipSource.includes("mistakenRule.misconception")) errors.push("Step 3 membership claims must test an authored misconception");
  if (/stays in the graph|has no outgoing direct edge|has no incoming direct edge/.test(membershipSource)) errors.push("Step 3 membership claims must not use trivial leaf-membership statements");
}
const ids = new Set();
const counts = { original: 0, variant: 0, new: 0 };
const lessonAnswerSlots = new Map();
const step2Sequences = [];
const step2Goals = new Set();
const step4Slots = [];
const allowedKinds = new Set(["grid", "directed-graph", "undirected-graph", "tree", "nested", "state", "backtracking"]);
const allowedStep2Bugs = new Set(["make-one-way", "make-two-way", "reverse-arrows", "add-diagonals", "remove-diagonals", "drop-last-edge", "skip-leaf-edges", "shallow-search", "first-branch", "last-branch", "wrong-start", "ignore-colors", "red-only"]);
const allowedPresentations = new Set(["smallest-witness", "repair-case", "exact-difference", "predict-first"]);
const sourceDataDir = path.resolve(__dirname, "../../jonathan-study-site/data");
const sourceProblems = fs.readdirSync(sourceDataDir)
  .filter(name => /^(originals-|variants-final-|new-final-).*\.json$/.test(name))
  .flatMap(name => JSON.parse(fs.readFileSync(path.join(sourceDataDir, name), "utf8")));
const sourceIds = new Set(sourceProblems.map(problem => problem.id));

function validateChoices(problem, taskLabel, choices, correct, min, max) {
  if (!Array.isArray(choices) || choices.length < min || choices.length > max) {
    errors.push(`${problem.id}/${taskLabel}: expected ${min === max ? min : `${min}-${max}`} choices`);
    return;
  }
  if (!choices.some(choice => choice.id === correct)) errors.push(`${problem.id}/${taskLabel}: correct choice is missing`);
  if (new Set(choices.map(choice => choice.id)).size !== choices.length) errors.push(`${problem.id}/${taskLabel}: duplicate choice ids`);
  if (new Set(choices.map(choice => choice.label)).size !== choices.length) errors.push(`${problem.id}/${taskLabel}: duplicate choice labels`);
  if (!Number.isInteger(choices.answerSlot)) { /* answerSlot belongs to the containing question */ }
  for (const choice of choices) {
    if (!choice.id || !choice.label || !choice.feedback) errors.push(`${problem.id}/${taskLabel}: every choice needs id, label, and specific feedback`);
    if (choice.id === correct && choice.misconception != null) errors.push(`${problem.id}/${taskLabel}/${choice.id}: correct choice misconception must be null`);
    if (choice.id !== correct && !choice.misconception) errors.push(`${problem.id}/${taskLabel}/${choice.id}: believable wrong choice needs a named misconception`);
  }
}

function validateAnswerSlot(problem, question, taskLabel) {
  if (!Number.isInteger(question.answerSlot) || question.answerSlot < 0 || question.answerSlot >= question.choices.length) errors.push(`${problem.id}/${taskLabel}: invalid generated answer slot`);
  else {
    const slots = lessonAnswerSlots.get(question.choices.length) || Array(question.choices.length).fill(0);
    slots[question.answerSlot]++;
    lessonAnswerSlots.set(question.choices.length, slots);
  }
}

function validateCanvas(problem, canvas, taskLabel, maxNodes = 9) {
  if (!canvas || typeof canvas.directed !== "boolean") {
    errors.push(`${problem.id}/${taskLabel}: canvas needs a boolean directed field`);
    return;
  }
  if (!Array.isArray(canvas.nodes)) errors.push(`${problem.id}/${taskLabel}: canvas nodes must be an array (empty is valid for an empty graph)`);
  if (Array.isArray(canvas.nodes) && canvas.nodes.length > maxNodes) errors.push(`${problem.id}/${taskLabel}: scratch build exceeds the ${maxNodes}-node cap`);
  if (!Array.isArray(canvas.edges)) errors.push(`${problem.id}/${taskLabel}: canvas edges must be an array`);
  const nodeIds = new Set();
  const nodeLabels = new Set();
  for (const node of canvas.nodes || []) {
    if (!String(node?.id ?? "").trim() || !String(node?.label ?? "").trim()) errors.push(`${problem.id}/${taskLabel}: every canvas node needs a nonempty id and label`);
    if (nodeIds.has(String(node.id))) errors.push(`${problem.id}/${taskLabel}: duplicate canvas node id ${node.id}`);
    if (nodeLabels.has(String(node.label).trim())) errors.push(`${problem.id}/${taskLabel}: duplicate canvas node label ${node.label}`);
    nodeIds.add(String(node.id));
    nodeLabels.add(String(node.label).trim());
    if (usesGridCellLabels(problem) && !/^\(\d+,\d+\)$/.test(String(node.label).trim())) {
      errors.push(`${problem.id}/${taskLabel}: grid-cell node label ${node.label} must use coordinate-only form (row,column)`);
    }
  }
  const edgeKeys = new Set();
  for (const edge of canvas.edges || []) {
    if (!nodeIds.has(String(edge.from)) || !nodeIds.has(String(edge.to))) errors.push(`${problem.id}/${taskLabel}: edge ${edge.from}→${edge.to} references a missing node id`);
    if (String(edge.from) === String(edge.to)) errors.push(`${problem.id}/${taskLabel}: self-loops are not supported by the scratch builder`);
    if (edge.color && !["red", "blue"].includes(edge.color)) errors.push(`${problem.id}/${taskLabel}: edge color must be red or blue`);
    if (edge.label != null && typeof edge.label !== "string") errors.push(`${problem.id}/${taskLabel}: edge label must be a string`);
    const pair = canvas.directed ? `${edge.from}→${edge.to}` : [String(edge.from), String(edge.to)].sort().join("—");
    if (edgeKeys.has(pair)) errors.push(`${problem.id}/${taskLabel}: duplicate edge ${pair}`);
    edgeKeys.add(pair);
  }
}

function canvasTopologySignature(canvas) {
  const outgoing = Object.fromEntries(canvas.nodes.map(node => [String(node.id), 0]));
  const incoming = Object.fromEntries(canvas.nodes.map(node => [String(node.id), 0]));
  for (const edge of canvas.edges) {
    outgoing[String(edge.from)]++;
    incoming[String(edge.to)]++;
    if (!canvas.directed) {
      outgoing[String(edge.to)]++;
      incoming[String(edge.from)]++;
    }
  }
  return JSON.stringify({
    directed: canvas.directed,
    nodes: canvas.nodes.length,
    edges: canvas.edges.length,
    outDegrees: Object.values(outgoing).sort((one, two) => one - two),
    inDegrees: canvas.directed ? Object.values(incoming).sort((one, two) => one - two) : [],
    colors: [...new Set(canvas.edges.map(edge => edge.color).filter(Boolean))].sort(),
    labels: canvas.edges.filter(edge => edge.label != null).length
  });
}

function validateBuildTask(problem, task, label, facets, ids, inheritedFacet = null) {
  const facet = task?.facet || inheritedFacet;
  for (const field of ["id", "title", "prompt", "input", "why"]) if (!String(task?.[field] ?? "").trim()) errors.push(`${problem.id}/${label}: missing ${field}`);
  if (ids.has(task?.id)) errors.push(`${problem.id}/${label}: duplicate lesson task id ${task?.id}`);
  ids.add(task?.id);
  if (!facets.includes(facet)) errors.push(`${problem.id}/${label}: facet "${facet}" is not in lesson.facets`);
  if (/\b(?:nodes?|edges?|arrows?|directed|undirected|two[- ]way|one[- ]way|adjacen\w*|diagonal\w*|side[- ]connected|cell identity|row identity|parent|child|containment|edge weight|edge color)\b|→|—/i.test(String(task?.prompt || ""))) {
    errors.push(`${problem.id}/${label}: Step 1 prompt gives away part of the graph model`);
  }
  validateCanvas(problem, task?.canvas, `${label}/canvas`);
  const format = problem.graphRules?.nodeLabelFormat;
  if (format?.pattern && task?.canvas?.nodes) {
    let matcher;
    try { matcher = new RegExp(format.pattern); } catch { errors.push(`${problem.id}: invalid node-label regex ${format.pattern}`); }
    if (matcher) for (const node of task.canvas.nodes) {
      if (!matcher.test(String(node.label))) errors.push(`${problem.id}/${label}: node label ${node.label} does not match the shown format`);
    }
  }
  if (!task?.decision?.prompt) errors.push(`${problem.id}/${label}: decision needs a prompt`);
  validateChoices(problem, `${label}/decision`, task?.decision?.choices, task?.decision?.correct, 2, 4);
  if (task?.decision?.choices) validateAnswerSlot(problem, task.decision, `${label}/decision`);
}

function validateLesson(problem) {
  const lesson = problem.lesson;
  const labelFormat = problem.graphRules?.nodeLabelFormat;
  if (!String(labelFormat?.instruction || "").trim()) errors.push(`${problem.id}: missing visible Step 1 node-label instruction`);
  if (!String(labelFormat?.pattern || "").trim()) errors.push(`${problem.id}: missing node-label validation pattern`);
  if (labelFormat?.showExactLabels) errors.push(`${problem.id}: node-label guide must explain the format without revealing the exact node list`);
  if (!lesson) {
    errors.push(`${problem.id}: missing v3 lesson. Add it to visual-lessons-${problem.category}.json using {id, facets[4], buildTasks[4], conceptTasks[5]}.`);
    return;
  }
  const facets = lesson.facets || [];
  if (facets.length !== 4 || new Set(facets).size !== 4 || facets.some(facet => !String(facet).trim())) errors.push(`${problem.id}: lesson.facets must contain exactly four unique names`);
  if (!Array.isArray(lesson.buildTasks) || lesson.buildTasks.length !== 4) errors.push(`${problem.id}: lesson.buildTasks must contain exactly four blank-graph builds`);
  if (!Array.isArray(lesson.conceptTasks) || lesson.conceptTasks.length !== 5) errors.push(`${problem.id}: lesson.conceptTasks must contain exactly five later checks`);
  const ids = new Set();
  const mainInputs = new Set();
  for (const [index, task] of (lesson.buildTasks || []).entries()) {
    validateBuildTask(problem, task, `build-${index + 1}`, facets, ids);
    if (mainInputs.has(task.input)) errors.push(`${problem.id}/build-${index + 1}: every main build needs a fresh input`);
    mainInputs.add(task.input);
  }
  for (const [index, task] of (lesson.conceptTasks || []).entries()) {
    const label = `concept-${index + 1}`;
    for (const field of ["id", "title", "facet", "prompt", "input", "why"]) if (!String(task?.[field] ?? "").trim()) errors.push(`${problem.id}/${label}: missing ${field}`);
    if (ids.has(task?.id)) errors.push(`${problem.id}/${label}: duplicate lesson task id ${task?.id}`);
    ids.add(task?.id);
    if (!facets.includes(task?.facet)) errors.push(`${problem.id}/${label}: facet "${task?.facet}" is not in lesson.facets`);
    if (!["choice", "visual-options"].includes(task?.kind)) errors.push(`${problem.id}/${label}: kind must be choice or visual-options`);
    validateChoices(problem, label, task?.choices, task?.correct, 4, 4);
    if (task?.choices) validateAnswerSlot(problem, task, label);
    if (task?.shownModel) validateCanvas(problem, task.shownModel, `${label}/shownModel`);
    if (task?.kind === "visual-options") for (const choice of task.choices || []) validateCanvas(problem, choice.model, `${label}/${choice.id}/model`);
    if (!task?.remedial) errors.push(`${problem.id}/${label}: wrong answers require a linked fresh remedial build`);
    else {
      validateBuildTask(problem, task.remedial, `${label}/remedial`, facets, ids, task.facet);
      if (task.remedial.input === task.input) errors.push(`${problem.id}/${label}/remedial: input must be fresh, not the revealed question input`);
    }
  }
  const step3Candidates = (lesson.conceptTasks || []).map(task => task.remedial).filter(task => task?.canvas);
  if (step3Candidates.length !== 5) errors.push(`${problem.id}/step3: expected five authored graph-check inputs`);
  if (new Set(step3Candidates.map(task => task.input)).size !== 5) errors.push(`${problem.id}/step3: all five graph-check inputs must be different`);
  if (new Set(step3Candidates.map(task => JSON.stringify([task.input, task.canvas]))).size !== 5) errors.push(`${problem.id}/step3: all five graph-check cases must be different`);
  const topologyCount = new Set(step3Candidates.map(task => canvasTopologySignature(task.canvas))).size;
  if (topologyCount < 3) errors.push(`${problem.id}/step3: expected at least three visibly different graph topologies; found ${topologyCount}`);
}

function validateCodeReasoning(problem) {
  const spec = problem.codeReasoning;
  if (!spec) {
    errors.push(`${problem.id}: missing Step 4 code-reasoning case`);
    return;
  }
  if (!Array.isArray(spec.cases)) {
    errors.push(`${problem.id}/step4: expected at least three distinct code cases`);
    return;
  }
  if (spec.cases.length < 3) errors.push(`${problem.id}/step4: expected at least three distinct code cases`);
  if (new Set(spec.cases.map(codeCase => codeCase.caseId)).size !== spec.cases.length) errors.push(`${problem.id}/step4: case ids must be unique`);
  if (new Set(spec.cases.map(codeCase => JSON.stringify(codeCase.input))).size !== spec.cases.length) errors.push(`${problem.id}/step4: every case needs a distinct input`);
  spec.cases.forEach((codeCase, index) => validateCodeReasoningCase(problem, codeCase, index));
}

function validateCodeReasoningCase(problem, spec, index) {
  const label = `step4/case-${index + 1}`;
  for (const field of ["bugTitle", "misconception", "input", "code", "outputFormat", "buggyOutput", "correctOutput", "correctDiagnosis"]) {
    if (!String(spec[field] ?? "").trim()) errors.push(`${problem.id}/${label}: missing ${field}`);
  }
  try { new Function(spec.code); } catch (error) { errors.push(`${problem.id}/${label}: code is not valid JavaScript (${error.message})`); }
  let buggy, correct;
  try { buggy = JSON.parse(spec.buggyOutput); } catch { errors.push(`${problem.id}/${label}: buggyOutput must be valid JSON text`); }
  try { correct = JSON.parse(spec.correctOutput); } catch { errors.push(`${problem.id}/${label}: correctOutput must be valid JSON text`); }
  if (JSON.stringify(buggy) === JSON.stringify(correct)) errors.push(`${problem.id}/${label}: buggy and correct outputs must differ`);
  validateCanvas(problem, spec.canvas, `${label}/canvas`, 16);
  if (!Array.isArray(spec.diagnoses) || spec.diagnoses.length !== 3) errors.push(`${problem.id}/${label}: diagnoses must contain exactly three choices`);
  else {
    if (new Set(spec.diagnoses.map(choice => choice.id)).size !== 3) errors.push(`${problem.id}/${label}: diagnosis ids must be unique`);
    if (new Set(spec.diagnoses.map(choice => choice.label)).size !== 3) errors.push(`${problem.id}/${label}: diagnosis labels must be unique`);
    if (!spec.diagnoses.some(choice => choice.id === spec.correctDiagnosis)) errors.push(`${problem.id}/${label}: correct diagnosis is missing`);
    for (const choice of spec.diagnoses) {
      if (!choice.id || !choice.label || !choice.feedback) errors.push(`${problem.id}/${label}: every diagnosis needs id, label, and feedback`);
      if (/This input exposes|\.\./.test(String(choice.feedback || ""))) errors.push(`${problem.id}/${label}/${choice.id}: diagnosis feedback contains generated placeholder prose`);
    }
  }
  for (const field of ["realGraph", "codeRule", "separatingFeature", "outputConsequence"]) {
    if (!String(spec.graphProof?.[field] ?? "").trim()) errors.push(`${problem.id}/${label}: graphProof is missing ${field}`);
    if (/This input exposes|\.\.|input and drawing define this exact|exact drawing matches every node/i.test(String(spec.graphProof?.[field] || ""))) errors.push(`${problem.id}/${label}: graphProof.${field} contains generated placeholder prose`);
  }
  step4Slots.push(spec.answerSlot);
}

function validateCounterexampleLesson(problem) {
  const spec = problem.counterexampleLesson;
  if (!spec) return errors.push(`${problem.id}: missing authored Step 2 spec`);
  for (const field of ["nodeNames", "startNode", "edges", "correctSearch", "mistakenSearch"]) if (!String(spec.vocabulary?.[field] || "").trim()) errors.push(`${problem.id}/step2: missing vocabulary.${field}`);
  const labelRules = new Set(["contiguous-zero", "contiguous-one", "positive-integer", "coordinate", "interior-coordinate", "state-pair", "identifier", "nested-path", "tree-path", "partial-string", "free"]);
  if (!labelRules.has(spec.nodeLabels?.rule) || !String(spec.nodeLabels?.description || "").trim()) errors.push(`${problem.id}/step2: missing or invalid nodeLabels rule`);
  if (spec.fixedStart && !String(spec.fixedStart).trim()) errors.push(`${problem.id}/step2: fixedStart must be a nonempty label`);
  if (spec.startRule && spec.startRule !== "graph-root") errors.push(`${problem.id}/step2: unsupported startRule ${spec.startRule}`);
  if (!spec.input) errors.push(`${problem.id}/step2: missing authored semantic input`);
  for (const field of ["name", "prompt", "result", "resultLabel"]) if (!String(spec.input?.[field] || "").trim()) errors.push(`${problem.id}/step2: input.${field} is required`);
  if (spec.input && Object.prototype.hasOwnProperty.call(spec.input, "outputPlaceholder")) errors.push(`${problem.id}/step2: output placeholders are not allowed`);
  if (spec.input && !["reached-nodes", "unreached-nodes"].includes(spec.input.result)) errors.push(`${problem.id}/step2: unsupported input.result ${spec.input.result}`);
  if (!Array.isArray(spec.rounds) || spec.rounds.length !== 3) return errors.push(`${problem.id}/step2: expected exactly three single-mistake rounds`);
  spec.rounds.forEach((round, index) => {
    if (!round.level || !round.goal) errors.push(`${problem.id}/step2/round-${index + 1}: level and goal are required`);
    if (!allowedPresentations.has(round.presentation)) errors.push(`${problem.id}/step2/round-${index + 1}: invalid presentation ${round.presentation}`);
    if (!Array.isArray(round.bugs) || round.bugs.length !== 1) errors.push(`${problem.id}/step2/round-${index + 1}: expected exactly one bug`);
    if (!String(round.startLabel || "").trim()) errors.push(`${problem.id}/step2/round-${index + 1}: fixed startLabel is required`);
    if (round.bugs?.includes("wrong-start")) {
      if (!String(round.mistakenStartLabel || "").trim()) errors.push(`${problem.id}/step2/round-${index + 1}: wrong-start needs mistakenStartLabel`);
      if (String(round.mistakenStartLabel) === String(round.startLabel)) errors.push(`${problem.id}/step2/round-${index + 1}: correct and mistaken starts must differ`);
    } else if (round.mistakenStartLabel) errors.push(`${problem.id}/step2/round-${index + 1}: mistakenStartLabel is only valid for wrong-start`);
    for (const bug of round.bugs || []) if (!allowedStep2Bugs.has(bug)) errors.push(`${problem.id}/step2/round-${index + 1}: unsupported bug ${bug}`);
    if (new Set(round.bugs || []).size !== (round.bugs || []).length) errors.push(`${problem.id}/step2/round-${index + 1}: repeated bug`);
    const goalKey = String(round.goal || "").trim().toLowerCase();
    if (step2Goals.has(goalKey)) errors.push(`${problem.id}/step2/round-${index + 1}: goal copy repeats another problem`);
    step2Goals.add(goalKey);
  });
  if (spec.fixedStart && spec.rounds.some(round => String(round.startLabel) !== String(spec.fixedStart))) errors.push(`${problem.id}/step2: every round start must match fixedStart ${spec.fixedStart}`);
  if (new Set(spec.rounds.map(round => round.goal)).size !== spec.rounds.length) errors.push(`${problem.id}/step2: round goals must be distinct`);
  if (new Set(spec.rounds.map(round => round.presentation)).size < 3) errors.push(`${problem.id}/step2: use at least three presentation styles`);
  step2Sequences.push({ id: problem.id, value: spec.rounds.map(round => round.bugs.join("+")).join("|") });
}

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

for (const problem of problems) {
  if (ids.has(problem.id)) errors.push(`Duplicate id: ${problem.id}`);
  ids.add(problem.id);
  counts[problem.category] = (counts[problem.category] || 0) + 1;
  for (const field of ["title", "statement"]) {
    if (!problem[field]) errors.push(`${problem.id}: missing ${field}`);
  }
  if (!allowedKinds.has(problem.visualKind)) errors.push(`${problem.id}: invalid visualKind`);
  if (!problem.graphRules?.nodes || !problem.graphRules?.edges) errors.push(`${problem.id}: missing graph rules`);
  if (!Array.isArray(problem.examples) || problem.examples.length < 2) errors.push(`${problem.id}: needs two examples`);
  validateLesson(problem);
  validateCounterexampleLesson(problem);
  validateCodeReasoning(problem);
}

if (problems.length !== 75) errors.push(`Expected 75 problems; found ${problems.length}`);
for (const category of Object.keys(counts)) if (counts[category] !== 25) errors.push(`Expected 25 ${category}; found ${counts[category]}`);
for (const id of sourceIds) if (!ids.has(id)) errors.push(`Missing source problem: ${id}`);
for (const id of ids) if (!sourceIds.has(id)) errors.push(`Unexpected problem: ${id}`);
for (const [choiceCount, slots] of lessonAnswerSlots) if (Math.max(...slots) - Math.min(...slots) > 1) errors.push(`V3 answer positions for ${choiceCount}-choice questions are unbalanced: ${slots.join(", ")}`);
for (let index = 1; index < step2Sequences.length; index++) if (step2Sequences[index].value === step2Sequences[index - 1].value) errors.push(`Adjacent Step 2 sequences repeat: ${step2Sequences[index - 1].id} and ${step2Sequences[index].id}`);
for (let index = 2; index < step4Slots.length; index++) if (step4Slots[index] === step4Slots[index - 1] && step4Slots[index] === step4Slots[index - 2]) errors.push(`Step 4 correct choice repeats three times at problems ${index - 1}-${index + 1}`);
const step4SlotCounts = [0, 1, 2].map(slot => step4Slots.filter(value => value === slot).length);
if (Math.max(...step4SlotCounts) - Math.min(...step4SlotCounts) > 1) errors.push(`Step 4 answer positions are unbalanced: ${step4SlotCounts.join(", ")}`);
const namesSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, "../character-names.js"), "utf8"), namesSandbox);
const characterNames = namesSandbox.window.DFS_CHARACTER_NAMES || [];
if (characterNames.length < 600 || new Set(characterNames.map(name => String(name).toLowerCase())).size !== characterNames.length) errors.push("character-names.js must contain at least 600 unique names");
const metro = problems.find(problem => problem.id === "one-color-metro-ride")?.lesson;
if (metro) {
  const expectedBuildIds = ["build-exact-map", "build-mixed-map", "build-alternate-route", "build-same-station"];
  const expectedConceptIds = ["match-picture", "no-color-mixing", "two-way-tracks", "predict-output", "counterexample"];
  if (JSON.stringify(metro.buildTasks.map(task => task.id)) !== JSON.stringify(expectedBuildIds) || JSON.stringify(metro.conceptTasks.map(task => task.id)) !== JSON.stringify(expectedConceptIds)) errors.push("one-color-metro-ride: golden v3 cadence no longer matches the approved no-transfers lesson");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${problems.length} visual lessons: 25 original, 25 variant, 25 new.`);
