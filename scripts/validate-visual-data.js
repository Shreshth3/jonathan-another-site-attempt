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
const step2SemanticResults = spawnSync(process.execPath, [path.resolve(__dirname, "validate-step2-semantic-results.js")], { encoding: "utf8" });
if (step2SemanticResults.status !== 0) {
  console.error((step2SemanticResults.stderr || step2SemanticResults.stdout).trim());
  process.exit(1);
}
const step2TargetResults = spawnSync(process.execPath, [path.resolve(__dirname, "validate-step2-target-results.js")], { encoding: "utf8" });
if (step2TargetResults.status !== 0) {
  console.error((step2TargetResults.stderr || step2TargetResults.stdout).trim());
  process.exit(1);
}
const step2TimedResults = spawnSync(process.execPath, [path.resolve(__dirname, "validate-step2-timed-results.js")], { encoding: "utf8" });
if (step2TimedResults.status !== 0) {
  console.error((step2TimedResults.stderr || step2TimedResults.stdout).trim());
  process.exit(1);
}
for (const scriptName of ["validate-step2-parameter-results.js", "validate-step2-marker-results.js"]) {
  const check = spawnSync(process.execPath, [path.resolve(__dirname, scriptName)], { encoding: "utf8" });
  if (check.status !== 0) {
    console.error((check.stderr || check.stdout).trim());
    process.exit(1);
  }
}
const step2GridAdjacency = spawnSync(process.execPath, [path.resolve(__dirname, "validate-step2-grid-adjacency.js")], { encoding: "utf8" });
if (step2GridAdjacency.status !== 0) {
  console.error((step2GridAdjacency.stderr || step2GridAdjacency.stdout).trim());
  process.exit(1);
}
for (const scriptName of ["validate-step4-execution.js", "validate-step4-correct-outputs.js", "validate-step4-readability.js"]) {
  const check = spawnSync(process.execPath, [path.resolve(__dirname, scriptName)], { encoding: "utf8" });
  if (check.status !== 0) {
    console.error((check.stderr || check.stdout).trim());
    process.exit(1);
  }
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
  if (/This node rule (?:works for every|fails for at least one) valid input/.test(membershipSource)) errors.push("Step 3 must not use the awkward generic node-rule claim");
  if (!membershipSource.includes("misconception") || !membershipSource.includes("In this input,")) errors.push("Step 3 membership claims must turn an authored misconception into a current-input statement");
}
const structureRenderStart = uiSource.indexOf("function renderStructureClaims(");
const structureRenderEnd = uiSource.indexOf("function structureFrame(", structureRenderStart);
const structureRenderSource = uiSource.slice(structureRenderStart, structureRenderEnd);
if (!structureRenderSource.includes("task.canvas.nodes.length === 0 || Boolean")) errors.push("Step 3 empty graphs must enable the Yes/No controls without a drawn node");
if (!structureRenderSource.includes("counterGraphChangeHandler();")) errors.push("Step 3 must initialize its claim controls for an already-valid empty graph");
const ids = new Set();
const counts = { original: 0, variant: 0, new: 0 };
const lessonAnswerSlots = new Map();
const step2Sequences = [];
const step2Goals = new Set();
const step4Slots = [];
const allowedKinds = new Set(["grid", "directed-graph", "undirected-graph", "tree", "nested", "state", "backtracking"]);
const allowedStep2Bugs = new Set(["strict-threshold", "first-start-only", "make-one-way", "make-two-way", "reverse-arrows", "add-diagonals", "remove-diagonals", "drop-last-edge", "skip-leaf-edges", "shallow-search", "first-branch", "last-branch", "wrong-start", "ignore-colors", "red-only"]);
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
  // A complete two-digit phone prefix tree needs 1 + 3 + 9 = 13 nodes.
  // Keep this exception narrow; other Step 1 drawings stay capped at nine.
  if (problem.id === 'letter-combinations-of-a-phone-number' && maxNodes === 9) maxNodes = 13;
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
    if (String(task?.input || "").trim() === String(task?.prompt || "").trim()) errors.push(`${problem.id}/${label}: input must be a concrete case, not a copy of the question`);
    if (!["choice", "visual-options"].includes(task?.kind)) errors.push(`${problem.id}/${label}: kind must be choice or visual-options`);
    validateChoices(problem, label, task?.choices, task?.correct, task.kind === "visual-options" ? 4 : 2, 4);
    if (task?.choices) validateAnswerSlot(problem, task, label);
    if (task?.shownModel) validateCanvas(problem, task.shownModel, `${label}/shownModel`);
    if (task?.kind === "visual-options") for (const choice of task.choices || []) validateCanvas(problem, choice.model, `${label}/${choice.id}/model`);
    if (!task?.remedial) errors.push(`${problem.id}/${label}: wrong answers require a linked fresh remedial build`);
    else {
      validateBuildTask(problem, task.remedial, `${label}/remedial`, facets, ids, task.facet);
      if (task.remedial.input === task.input) errors.push(`${problem.id}/${label}/remedial: input must be fresh, not the revealed question input`);
    }
  }
  const step3Candidates = lesson.structureTasks || (lesson.conceptTasks || []).map(task => task.remedial).filter(task => task?.canvas);
  step3Candidates.forEach((task, index) => validateCanvas(problem, task.canvas, `step3/case-${index + 1}/canvas`, 24));
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
    errors.push(`${problem.id}/step4: expected several distinct code cases`);
    return;
  }
  if (spec.cases.length < 3) errors.push(`${problem.id}/step4: expected at least three distinct misconception cases`);
  if (new Set(spec.cases.map(codeCase => codeCase.caseId)).size !== spec.cases.length) errors.push(`${problem.id}/step4: case ids must be unique`);
  if (new Set(spec.cases.map(codeCase => JSON.stringify(codeCase.input))).size !== spec.cases.length) errors.push(`${problem.id}/step4: every case needs a distinct input`);
  if (new Set(spec.cases.map(codeCase => codeCase.misconception)).size !== spec.cases.length) errors.push(`${problem.id}/step4: every case needs a distinct misconception`);
  const semanticCode = code => {
    const source = String(code).replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const preserved = new Set(["break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else", "false", "finally", "for", "function", "if", "in", "instanceof", "let", "new", "null", "of", "return", "switch", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "Array", "Boolean", "Infinity", "JSON", "Map", "Math", "NaN", "Number", "Object", "Set", "String"]);
    const names = new Map();
    let nextName = 0;
    return source.replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1|[A-Za-z_$][\w$]*/g, (token, quote, offset, whole) => {
      if (quote || preserved.has(token) || whole[offset - 1] === ".") return token;
      if (!names.has(token)) names.set(token, `v${nextName++}`);
      return names.get(token);
    }).replace(/\s+/g, "");
  };
  if (new Set(spec.cases.map(codeCase => semanticCode(codeCase.code))).size !== spec.cases.length) errors.push(`${problem.id}/step4: every case needs meaningfully different incorrect code, not comment-only changes`);
  if (new Set(spec.cases.map(codeCase => codeCase.correctDiagnosis)).size !== spec.cases.length) errors.push(`${problem.id}/step4: every case needs its own diagnosis id`);
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
  const labelFormat = problem.graphRules?.nodeLabelFormat;
  if (labelFormat?.pattern && spec.canvas?.nodes) {
    let matcher;
    try { matcher = new RegExp(labelFormat.pattern); } catch { errors.push(`${problem.id}: invalid node-label regex ${labelFormat.pattern}`); }
    if (matcher) for (const node of spec.canvas.nodes) {
      if (!matcher.test(String(node.label))) errors.push(`${problem.id}/${label}: node label ${node.label} does not match the shown format`);
    }
  }
  if (problem.id === "letter-combinations-of-a-phone-number" && !spec.canvas?.nodes?.some(node => node.label === "empty prefix")) errors.push(`${problem.id}/${label}: graph must include the empty prefix root`);
  if (problem.id === "runes-on-the-castle-door" && !spec.canvas?.nodes?.some(node => node.label === "start")) errors.push(`${problem.id}/${label}: graph must include the start root`);
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
  if (spec.input && !["reached-nodes", "unreached-nodes", "reached-count", "unreached-count", "all-reached", "any-unreached", "target-reachable-boolean", "same-color-target-reachable-boolean", "target-state-reachable-boolean", "target-word-path-exists-boolean", "reached-node-value-sum", "shortest-path-weight", "maximum-shortest-path-weight-or-minus-one", "maximum-path-weight", "deadline-reached-count", "border-component-count", "component-count", "maximum-component-size", "minimum-component-size", "maximum-reached-count", "path-count", "path-count-modulo", "enumerated-paths", "longest-path-length", "valid-two-coloring-boolean", "acyclic-completion-boolean", "maximum-reached-node-value", "reachability-matrix", "generated-terminal-strings", "recursive-item-count", "root-expression-value", "component-bounding-boxes", "minimum-universally-reachable-node-or-minus-one", "iterator-output-sequence", "depth-weighted-value-sum", "inverse-depth-weighted-value-sum", "widest-level-index", "level-value-sum", "exact-size-component-count", "kth-visited-node-or-minus-one", "target-root-leaf-sum-exists-boolean", "components-without-source-count", "qualified-component-count", "reached-selected-node-count", "maximum-component-value-sum", "component-sorted-string", "selected-color-count", "minimum-component-bounding-perimeter", "maximum-root-leaf-value-sum", "transformed-grid", "ordered-query-values"].includes(spec.input.result)) errors.push(`${problem.id}/step2: unsupported input.result ${spec.input.result}`);
  validateCounterSemanticInputs(problem.id, spec.input);
  if (spec.input?.result === "reached-node-value-sum") {
    const valueMarker = spec.input.resultConfig?.valueMarker;
    const marker = spec.input.markers?.find(candidate => candidate.id === valueMarker);
    if (!String(valueMarker || "").trim() || !marker || marker.target !== "node" || !["integer", "number"].includes(marker.kind) || marker.required === false) errors.push(`${problem.id}/step2: reached-node-value-sum needs resultConfig.valueMarker naming a required numeric node marker`);
  }
  if (spec.input?.result === "shortest-path-weight") {
    const targetField = spec.input.resultConfig?.targetField;
    const weightMarker = spec.input.resultConfig?.weightMarker;
    const target = spec.input.fields?.find(field => field.id === targetField);
    const weight = spec.input.markers?.find(marker => marker.id === weightMarker);
    if (!String(targetField || "").trim() || !target || target.kind !== "node" || target.required === false) errors.push(`${problem.id}/step2: shortest-path-weight needs resultConfig.targetField naming a required node field`);
    if (!String(weightMarker || "").trim() || !weight || weight.target !== "edge" || weight.kind !== "number" || weight.required === false || Number(weight.min) < 0) errors.push(`${problem.id}/step2: shortest-path-weight needs resultConfig.weightMarker naming a required nonnegative numeric edge marker`);
  }
  if (["target-reachable-boolean", "same-color-target-reachable-boolean"].includes(spec.input?.result)) {
    const targetField = spec.input.resultConfig?.targetField;
    const target = spec.input.fields?.find(field => field.id === targetField);
    if (!String(targetField || "").trim() || !target || target.kind !== "node" || target.required === false) errors.push(`${problem.id}/step2: ${spec.input.result} needs resultConfig.targetField naming a required node field`);
  }
  if (spec.input?.result === "transformed-grid" || (spec.input?.result === "ordered-query-values" && problem.id === "ten-kinds-of-people")) {
    const config = spec.input.resultConfig || {}, rowField = spec.input.fields?.find(field => field.id === config.rowsField), columnField = spec.input.fields?.find(field => field.id === config.columnsField), marker = spec.input.markers?.find(item => item.id === config.valueMarker);
    if (!rowField || rowField.kind !== "integer" || rowField.required === false || !columnField || columnField.kind !== "integer" || columnField.required === false) errors.push(`${problem.id}/step2: grid result needs required integer row and column fields`);
    if (!marker || marker.target !== "node" || marker.required === false) errors.push(`${problem.id}/step2: grid result needs a required node value marker`);
    if (spec.input.result === "ordered-query-values") { const target = spec.input.fields?.find(field => field.id === config.targetField); if (!target || target.kind !== "node" || target.required === false) errors.push(`${problem.id}/step2: ordered query result needs a required target node field`); }
    if (problem.id === "flood-fill") { const color = spec.input.fields?.find(field => field.id === config.newColorField); if (!color || !["integer", "number"].includes(color.kind) || color.required === false) errors.push(`${problem.id}/step2: flood fill needs a required numeric new-color field`); }
  }
  if (spec.input?.result === "ordered-query-values" && problem.id === "evaluate-division") {
    const config = spec.input.resultConfig || {}, target = spec.input.fields?.find(field => field.id === config.targetField), ratio = spec.input.markers?.find(item => item.id === config.ratioMarker);
    if (!target || target.kind !== "node" || target.required === false || !ratio || ratio.target !== "edge" || ratio.kind !== "number" || ratio.required === false || Number(ratio.min) <= 0) errors.push(`${problem.id}/step2: division query needs a denominator node and positive edge ratios`);
  }
  if (spec.input?.result === "target-state-reachable-boolean") {
    const config = spec.input.resultConfig || {}, fields = [config.jug1CapacityField, config.jug2CapacityField, config.targetField].map(id => spec.input.fields?.find(field => field.id === id));
    if (fields.some(field => !field || field.kind !== "integer" || field.required === false)) errors.push(`${problem.id}/step2: jug result needs required integer capacity and target fields`);
  }
  if (spec.input?.result === "target-word-path-exists-boolean") {
    const config = spec.input.resultConfig || {}, rows = spec.input.fields?.find(field => field.id === config.rowsField), columns = spec.input.fields?.find(field => field.id === config.columnsField), word = spec.input.fields?.find(field => field.id === config.wordField), letters = spec.input.markers?.find(item => item.id === config.letterMarker);
    if (!rows || rows.kind !== "integer" || !columns || columns.kind !== "integer" || !word || word.kind !== "text" || !letters || letters.target !== "node" || letters.kind !== "text") errors.push(`${problem.id}/step2: word search needs dimensions, a word, and cell letters`);
  }
  if (spec.input?.result === "maximum-shortest-path-weight-or-minus-one") {
    const markerId = spec.input.resultConfig?.weightMarker;
    const marker = spec.input.markers?.find(item => item.id === markerId);
    if (!markerId || !marker || marker.target !== "edge" || !["integer", "number"].includes(marker.kind) || marker.required === false || Number(marker.min) < 0) errors.push(`${problem.id}/step2: network delay needs a required nonnegative numeric edge marker`);
  }
  if (spec.input?.result === "maximum-path-weight") {
    const markerId = spec.input.resultConfig?.delayMarker;
    const marker = spec.input.markers?.find(item => item.id === markerId);
    if (!markerId || !marker || marker.target !== "node" || !["integer", "number"].includes(marker.kind) || marker.required === false || Number(marker.min) < 0) errors.push(`${problem.id}/step2: maximum path time needs a required nonnegative numeric node marker`);
  }
  if (spec.input?.result === "deadline-reached-count") {
    const config = spec.input.resultConfig || {};
    const wait = spec.input.markers?.find(item => item.id === config.waitMarker);
    const deadline = spec.input.fields?.find(item => item.id === config.deadlineField);
    if (!wait || wait.target !== "node" || !["integer", "number"].includes(wait.kind) || wait.required === false || Number(wait.min) < 0) errors.push(`${problem.id}/step2: deadline count needs a required nonnegative numeric node wait marker`);
    if (!deadline || !["integer", "number"].includes(deadline.kind) || deadline.required === false || Number(deadline.min) < 0) errors.push(`${problem.id}/step2: deadline count needs a required nonnegative deadline field`);
  }
  if (["level-value-sum", "kth-visited-node-or-minus-one"].includes(spec.input?.result) && spec.input.resultConfig?.valueMarker) {
    const config = spec.input.resultConfig, marker = spec.input.markers?.find(item => item.id === config.valueMarker);
    const fieldId = spec.input.result === "level-value-sum" ? config.depthField : config.positionField;
    const field = spec.input.fields?.find(item => item.id === fieldId);
    if (!marker || marker.target !== "node" || !["integer", "number"].includes(marker.kind)) errors.push(`${problem.id}/step2: ${spec.input.result} needs a numeric node value marker`);
    if (!field || field.kind !== "integer" || field.required === false || Number(field.min) < 1) errors.push(`${problem.id}/step2: ${spec.input.result} needs a required positive integer parameter field`);
  }
  if (spec.input?.result === "exact-size-component-count") {
    const field = spec.input.fields?.find(item => item.id === spec.input.resultConfig?.sizeField);
    if (!field || field.kind !== "integer" || field.required === false || Number(field.min) < 1) errors.push(`${problem.id}/step2: exact-size-component-count needs a required positive integer size field`);
  }
  if (spec.input?.result === "target-root-leaf-sum-exists-boolean") {
    const config = spec.input.resultConfig || {}, target = spec.input.fields?.find(item => item.id === config.targetField), marker = spec.input.markers?.find(item => item.id === config.valueMarker);
    if (!target || !["integer", "number"].includes(target.kind) || target.required === false) errors.push(`${problem.id}/step2: path sum needs a required numeric target field`);
    if (!marker || marker.target !== "node" || !["integer", "number"].includes(marker.kind) || marker.required === false) errors.push(`${problem.id}/step2: path sum needs a required numeric node value marker`);
  }
  if (["components-without-source-count", "qualified-component-count", "reached-selected-node-count"].includes(spec.input?.result)) {
    const config = spec.input.resultConfig || {};
    const markerId = config.sourceMarker || config.qualifierMarker || config.selectorMarker;
    const marker = spec.input.markers?.find(item => item.id === markerId);
    const selectedValue = config.sourceValue ?? config.qualifyingValue ?? config.selectedValue;
    if (!marker || marker.target !== "node" || marker.required === false || selectedValue === undefined) errors.push(`${problem.id}/step2: ${spec.input.result} needs a required node marker and selected value`);
  }
  if (spec.input?.result === "maximum-component-value-sum") {
    const marker = spec.input.markers?.find(item => item.id === spec.input.resultConfig?.valueMarker);
    if (!marker || marker.target !== "node" || !["integer", "number"].includes(marker.kind) || marker.required === false) errors.push(`${problem.id}/step2: maximum-component-value-sum needs a required numeric node marker`);
  }
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

function validateCounterSemanticInputs(problemId, input) {
  const fields = input?.fields || [];
  const markers = input?.markers || [];
  if (!Array.isArray(fields)) errors.push(`${problemId}/step2: input.fields must be an array`);
  if (!Array.isArray(markers)) errors.push(`${problemId}/step2: input.markers must be an array`);
  if (!Array.isArray(fields) || !Array.isArray(markers)) return;

  const validId = /^[a-z][a-zA-Z0-9]*$/;
  const ids = new Set();
  const validateCommon = (item, path, allowedKinds) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return errors.push(`${path} must be an object`);
    if (!validId.test(String(item.id || ""))) errors.push(`${path}.id must be a camelCase identifier`);
    else if (ids.has(item.id)) errors.push(`${problemId}/step2: semantic input id ${item.id} is duplicated`);
    else ids.add(item.id);
    if (!allowedKinds.has(item.kind)) errors.push(`${path}.kind ${item.kind} is unsupported`);
    for (const key of ["label", "prompt"]) if (!String(item[key] || "").trim()) errors.push(`${path}.${key} is required`);
    if (item.required !== undefined && typeof item.required !== "boolean") errors.push(`${path}.required must be true or false`);
    if (item.min !== undefined && typeof item.min !== "number") errors.push(`${path}.min must be a number`);
    if (item.max !== undefined && typeof item.max !== "number") errors.push(`${path}.max must be a number`);
    if (typeof item.min === "number" && typeof item.max === "number" && item.min > item.max) errors.push(`${path}.min cannot exceed max`);
    if (item.kind === "choice" || item.kind === "color") {
      if (!Array.isArray(item.choices) || item.choices.length < 2) errors.push(`${path}.choices must contain at least two choices`);
      else {
        const values = new Set();
        item.choices.forEach((choice, choiceIndex) => {
          if (!choice || typeof choice !== "object" || !String(choice.value ?? "").trim() || !String(choice.label || "").trim()) errors.push(`${path}.choices[${choiceIndex}] needs value and label`);
          else if (values.has(String(choice.value))) errors.push(`${path}.choices has duplicate value ${choice.value}`);
          else values.add(String(choice.value));
        });
      }
    } else if (item.choices !== undefined) errors.push(`${path}.choices is only valid for choice or color inputs`);
  };

  fields.forEach((field, index) => validateCommon(field, `${problemId}/step2/input.fields[${index}]`, new Set(["node", "integer", "number", "text", "choice", "json"])));
  markers.forEach((marker, index) => {
    const path = `${problemId}/step2/input.markers[${index}]`;
    validateCommon(marker, path, new Set(["integer", "number", "text", "choice", "color", "json"]));
    if (!new Set(["node", "edge"]).has(marker?.target)) errors.push(`${path}.target must be node or edge`);
  });
  const adjacency = input?.resultConfig?.adjacency;
  if (adjacency) {
    if (!["all", "equal-marker", "increasing-marker", "from-marker"].includes(adjacency.mode)) errors.push(`${problemId}/step2: resultConfig.adjacency.mode is unsupported`);
    if (adjacency.mode !== "all") {
      const marker = markers.find(item => item.id === adjacency.marker);
      if (!marker || marker.target !== "node" || marker.required === false) errors.push(`${problemId}/step2: marker-based adjacency needs a required node marker`);
    }
    if (adjacency.mode === "increasing-marker") {
      const marker = markers.find(item => item.id === adjacency.marker);
      if (!marker || !["integer", "number"].includes(marker.kind)) errors.push(`${problemId}/step2: increasing adjacency needs a numeric node marker`);
    }
    if (adjacency.mode === "from-marker" && (!Array.isArray(adjacency.fromValues) || !Array.isArray(adjacency.toExcludedValues))) errors.push(`${problemId}/step2: directional marker adjacency needs fromValues and toExcludedValues`);
  }
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

const counterSemanticFixtures = JSON.parse(fs.readFileSync(path.resolve(__dirname, "fixtures/step2-semantic-inputs.json"), "utf8"));
for (const fixture of counterSemanticFixtures) validateCounterSemanticInputs(`fixture/${fixture.id}`, fixture.input);

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
