const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sourceRoot = path.resolve(__dirname, "../../jonathan-study-site");
const dataDir = path.join(sourceRoot, "data");
const problemFiles = fs.readdirSync(dataDir)
  .filter(name => /^(originals-|variants-final-|new-final-).*\.json$/.test(name))
  .sort();
const problems = problemFiles.flatMap(name => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8")));
const sourceSiteSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(sourceRoot, "site/problems.js"), "utf8"), sourceSiteSandbox);
const publishedProblems = new Map(sourceSiteSandbox.window.PROBLEMS.map(problem => [problem.id, problem]));

const rawVisualSpecs = ["visual-specs-original.json", "visual-specs-variant.json", "visual-specs-new.json"]
  .flatMap(name => JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", name), "utf8")));
if (new Set(rawVisualSpecs.map(item => item.id)).size !== rawVisualSpecs.length) throw new Error("Visual specs contain duplicate problem IDs.");
const visualSpecs = new Map(rawVisualSpecs.map(item => [item.id, item]));

const lessonFiles = ["visual-lessons-original.json", "visual-lessons-variant.json", "visual-lessons-new.json"];
const rawVisualLessons = lessonFiles.flatMap(name => {
  const file = path.resolve(__dirname, "..", name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
});
if (new Set(rawVisualLessons.map(item => item.id)).size !== rawVisualLessons.length) throw new Error("Visual lessons contain duplicate problem IDs.");
for (const lesson of rawVisualLessons) {
  const plan = visualSpecs.get(lesson.id)?.practicePlan;
  if (plan) lesson.practicePlan = plan;
}
const visualLessons = new Map(rawVisualLessons.map(item => [item.id, item]));

const step4Files = ["step4-specs-original.json", "step4-specs-variant.json", "step4-specs-new.json"];
const rawStep4Specs = step4Files.flatMap(name => {
  const file = path.resolve(__dirname, "..", name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
});
if (new Set(rawStep4Specs.map(item => item.id)).size !== rawStep4Specs.length) throw new Error("Step 4 specs contain duplicate problem IDs.");
const step4Specs = new Map(rawStep4Specs.map(item => [item.id, resolveAuthoredStep4Cases(item)]));

const rawStep5Specs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../step5-specs-variant.json"), "utf8"));
if (new Set(rawStep5Specs.map(item => item.id)).size !== rawStep5Specs.length) throw new Error("Step 5 specs contain duplicate problem IDs.");
const variantIds = new Set(problems.filter(problem => problem.category === "variant").map(problem => problem.id));
if (rawStep5Specs.length !== variantIds.size || rawStep5Specs.some(item => !variantIds.has(item.id))) throw new Error("Step 5 must cover exactly the variant category.");
const step5Specs = new Map(rawStep5Specs.map(item => [item.id, item]));
const rawStep6Specs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../step6-specs-variant.json"), "utf8"));
if (new Set(rawStep6Specs.map(item => item.id)).size !== rawStep6Specs.length) throw new Error("Step 6 specs contain duplicate problem IDs.");
if (rawStep6Specs.length !== variantIds.size || rawStep6Specs.some(item => !variantIds.has(item.id))) throw new Error("Step 6 must cover exactly the variant category.");
const step6Specs = new Map(rawStep6Specs.map(item => [item.id, item]));

// Parent groups follow the user's curriculum; siblings have a manually reviewed order.
const variantOrder = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../variant-order.json"), "utf8"));
const parentOrder = new Map(variantOrder.originalOrder.map((id, index) => [id, index]));
if (parentOrder.size !== variantOrder.originalOrder.length) throw new Error("Duplicate parent in variant curriculum order.");
if (new Set(variantOrder.groups.map(group => group.parentId)).size !== variantOrder.groups.length) throw new Error("Duplicate variant parent group.");
const variantListOrder = new Map();
const sourceVariants = new Map(problems.filter(problem => problem.category === "variant").map(problem => [problem.id, problem]));
for (const group of [...variantOrder.groups].sort((a, b) => parentOrder.get(a.parentId) - parentOrder.get(b.parentId))) {
  if (!parentOrder.has(group.parentId)) throw new Error(`Unknown curriculum parent: ${group.parentId}`);
  for (const entry of group.variants) {
    if (variantListOrder.has(entry.id)) throw new Error(`Duplicate ordered variant: ${entry.id}`);
    if (sourceVariants.get(entry.id)?.parentId !== group.parentId) throw new Error(`Variant parent mismatch: ${entry.id}`);
    if (!entry.reason?.trim()) throw new Error(`Missing manual difficulty rationale: ${entry.id}`);
    variantListOrder.set(entry.id, variantListOrder.size + 1);
  }
}
if (variantListOrder.size !== variantIds.size) throw new Error("Curriculum order must cover every variant exactly once.");

function resolveAuthoredStep4Cases(spec) {
  if (!Array.isArray(spec.cases) || !spec.cases.length) return spec;
  return {
    ...spec,
    cases: spec.cases.map(entry => {
      const required = ["caseId", "bugTitle", "misconception", "input", "code", "canvas", "outputFormat", "buggyOutput", "correctOutput", "correctDiagnosis", "diagnoses", "graphProof"];
      const missing = required.filter(field => entry[field] == null || entry[field] === "");
      if (missing.length) throw new Error(`${spec.id}/${entry.caseId || "unknown-case"}: Step 4 case must be standalone; missing ${missing.join(", ")}`);
      return { ...entry, canvas: expandCompactCanvas(entry.canvas) };
    })
  };
}

function expandCompactCanvas(canvas) {
  if (!canvas?.nodes?.length || (!Array.isArray(canvas.nodes[0]) && typeof canvas.nodes[0] === "object")) return canvas;
  return {
    directed: canvas.directed,
    nodes: canvas.nodes.map(value => Array.isArray(value) ? ({ id: String(value[0]), label: String(value[1]) }) : ({ id: String(value), label: String(value) })),
    edges: canvas.edges.map(value => Array.isArray(value) ? ({ from: String(value[0]), to: String(value[1]), ...(value[2] ? { label: String(value[2]) } : {}) }) : value)
  };
}

function parseLessonAnswer(task) {
  let value = task?.decision?.choices?.find(choice => choice.id === task.decision.correct)?.label?.trim();
  if (!value) throw new Error("missing exact answer");
  value = value.replace(/^Return\s+/i, "");
  if (/^true$/i.test(value)) return true;
  if (/^false$/i.test(value)) return false;
  if (/^[-+]?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  return JSON.parse(value);
}

function levelOrderTree(values) {
  if (!values.length || values[0] == null) return null;
  const nodes = values.map(value => value == null ? null : { val: value, left: null, right: null });
  let child = 1;
  for (const node of nodes) if (node) {
    node.left = nodes[child++] || null;
    node.right = nodes[child++] || null;
  }
  return nodes[0];
}

function parseStep4Input(problemId, source) {
  if (typeof source !== "string") return structuredClone(source);
  if (problemId === "codewars-array-deep-count") {
    const argument = source.match(/^deepCount\((.*)\)$/)?.[1];
    return { arr: vm.runInNewContext(`(${argument})`) };
  }
  const treeMatch = source.match(/^root level-order=(\[[^\n]+?\])(?:,\s*targetSum=([-+]?\d+))?$/);
  if (treeMatch) return { root: levelOrderTree(JSON.parse(treeMatch[1])), ...(treeMatch[2] ? { targetSum: Number(treeMatch[2]) } : {}) };
  const cleaned = source.replace(/\s+\([^)]*=.*\)\s*$/, "").replace(/(?:,|\n)\s*(?=[A-Za-z_$][\w$]*\s*=)/g, "; var ");
  const values = {};
  vm.runInNewContext(`var ${cleaned}; globalThis.__values = { ${[...cleaned.matchAll(/(?:^|; var )([A-Za-z_$][\w$]*)\s*=/g)].map(match => match[1]).join(",")} };`, values);
  const input = values.__values;
  if (problemId === "evaluate-division" && input.query) input.queries = [input.query];
  if (problemId === "routes-past-the-coffee-cart") Object.assign(input, { graph: input.roads, checkpoint: input.coffeeCart });
  if (problemId === "villages-without-wells") input.paths = input.roads;
  if (problemId === "gas-pocket-survey") {
    input.cave = input.cave.map(row => [...row]);
    const drill = source.match(/drill=\((\d+),(\d+)\)/);
    input.row = Number(drill[1]); input.col = Number(drill[2]);
  }
  if (problemId === "evaluate-boolean-binary-tree") input.root = levelOrderTree(input.values);
  if (problemId === "usaco-fence-planning") Object.assign(input, { positions: input.cows, pairs: input.friendships });
  if (problemId === "kattis-getting-gold") input.grid = input.dungeon;
  return input;
}

function executeStep4Code(problemId, code, input) {
  const sandbox = {};
  const functionName = code.match(/function\s+(\w+)\s*\(/)?.[1];
  if (!functionName && problemId !== "flatten-nested-list-iterator") throw new Error("cannot find callable function");
  vm.runInNewContext(`${code}\n;globalThis.__callable = ${functionName || "NestedIterator"};`, sandbox);
  if (!functionName && problemId === "flatten-nested-list-iterator") {
    const iterator = new sandbox.__callable(structuredClone(input.nestedList));
    const answer = [];
    while (iterator.hasNext()) answer.push(iterator.next());
    return answer;
  }
  const parameterNames = code.match(/function\s+\w+\s*\(([^)]*)\)/)?.[1].split(",").map(name => name.trim()) || [];
  const args = functionName === "solve" ? [input] : parameterNames.map(name => input[name]);
  return sandbox.__callable(...structuredClone(args));
}

function expandStep4Cases(problemId, spec, lesson) {
  if (!spec || !lesson) return spec;
  const base = { ...spec, caseId: "authored-deep-case" };
  delete base.cases;
  const candidates = [...(lesson.buildTasks || []), ...(lesson.conceptTasks || []).map(task => task.remedial).filter(Boolean)];
  const cases = [base];
  const baseInput = parseStep4Input(problemId, spec.input);
  for (const task of candidates) {
    if (cases.length === 3) break;
    try {
      const input = parseStep4Input(problemId, task.input);
      if (JSON.stringify(input) === JSON.stringify(baseInput)) continue;
      const correct = parseLessonAnswer(task);
      const buggy = executeStep4Code(problemId, spec.code, input);
      if (buggy === undefined) continue;
      const buggyOutput = JSON.stringify(buggy);
      const correctOutput = JSON.stringify(correct);
      const exposesBug = buggyOutput !== correctOutput;
      if (!exposesBug) continue;
      cases.push({
        ...spec,
        caseId: task.id,
        input: task.input,
        canvas: task.canvas,
        buggyOutput,
        correctOutput,
        diagnoses: spec.diagnoses.map(choice => ({ ...choice, feedback: choice.id === spec.correctDiagnosis
          ? `Yes. On this exact input, that graph mistake makes the code return ${buggyOutput} instead of ${correctOutput}.`
          : choice.feedback })),
        graphProof: {
          realGraph: `The input and drawing define this exact ${task.canvas.directed ? "directed" : "undirected"} graph with ${task.canvas.nodes.length} nodes and ${task.canvas.edges.length} edges.`,
          codeRule: spec.graphProof.codeRule,
          separatingFeature: `This input exposes ${spec.misconception}.`,
          outputConsequence: `The shown code returns ${buggyOutput}; the real problem returns ${correctOutput}.`
        }
      });
    } catch { /* Some lesson prompts are explanatory rather than executable output cases. */ }
  }
  return { cases };
}

if (process.argv.includes("--author-step4-cases")) {
  throw new Error("--author-step4-cases was removed because it repeated one bug across several inputs. Author distinct standalone cases in step4-specs-*.json instead.");
}

const step2Files = ["step2-specs-original.json", "step2-specs-variant.json", "step2-specs-new.json"];
const rawStep2Specs = step2Files.flatMap(name => {
  const file = path.resolve(__dirname, "..", name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
});
if (new Set(rawStep2Specs.map(item => item.id)).size !== rawStep2Specs.length) throw new Error("Step 2 specs contain duplicate problem IDs.");
const step2Specs = new Map(rawStep2Specs.map(item => [item.id, item]));

function correctChoiceLabel(question) {
  return question.choices.find(choice => choice.id === question.correct)?.label || "";
}

const catalog = problems.map(problem => {
  const publishedProblem = publishedProblems.get(problem.id);
  const visualSpec = visualSpecs.get(problem.id);
  if (!visualSpec) throw new Error(`Missing visual spec for ${problem.id}`);
  return {
    id: problem.id,
    title: problem.title,
    category: problem.category,
    difficulty: publishedProblem?.difficulty || problem.difficulty,
    curriculumOrder: publishedProblem?.curriculumOrder ?? problem.curriculumOrder ?? null,
    sourceLink: problem.sourceLink || null,
    statement: problem.statement + (problem.id === "nested-list-weight-sum-ii" ? "\n\nEmpty arrays do not increase `maxDepth`: only integer depth counts. For example, `[1,[[]]]` has `maxDepth = 1`." : ""),
    examples: problem.examples,
    constraints: problem.constraints,
    visualKind: visualSpec.visualKind,
    graphRules: {
      nodes: correctChoiceLabel(visualSpec.nodeQuestion),
      edges: correctChoiceLabel(visualSpec.edgeQuestion),
      nodeLabelFormat: visualSpec.nodeLabelFormat,
      membershipClaim: visualSpec.membershipClaim
    },
    counterexampleLesson: step2Specs.get(problem.id) || null,
    lesson: visualLessons.get(problem.id) || null,
    codeReasoning: step4Specs.get(problem.id) || null,
    ...(problem.category === "variant" ? { parentId: problem.parentId, variantListOrder: variantListOrder.get(problem.id), debuggingLesson: step5Specs.get(problem.id), codingLesson: step6Specs.get(problem.id) } : {})
  };
});

catalog.sort((a, b) => {
  const categoryOrder = { original: 0, variant: 1, new: 2 };
  return categoryOrder[a.category] - categoryOrder[b.category] || a.title.localeCompare(b.title);
});

function stableHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const diagnosisRefs = catalog.flatMap(problem => (problem.codeReasoning?.cases || [])
  .filter(codeCase => codeCase.diagnoses?.length === 3)
  .map(codeCase => ({ problem, codeCase })));
for (let start = 0; start < diagnosisRefs.length; start += 3) {
  const group = diagnosisRefs.slice(start, start + 3);
  const offset = stableHash(`step4:v3:${group.map(ref => `${ref.problem.id}:${ref.codeCase.caseId}`).join("|")}`) % 3;
  group.forEach((ref, index) => { ref.codeCase.answerSlot = (offset + index) % 3; });
}

const lessonQuestionRefs = catalog.flatMap(problem => {
  if (!problem.lesson) return [];
  return [
    ...(problem.lesson.buildTasks || []).map(task => task?.decision),
    ...(problem.lesson.conceptTasks || []).flatMap(task => [task, task?.remedial?.decision])
  ].filter(question => Array.isArray(question?.choices) && question.choices.length).map(question => ({ problem, question }));
});
lessonQuestionRefs.sort((a, b) => stableHash(`v3:${a.problem.id}:${a.question.id || a.question.prompt}`) - stableHash(`v3:${b.problem.id}:${b.question.id || b.question.prompt}`));
const lessonGroups = new Map();
lessonQuestionRefs.forEach(ref => {
  const group = lessonGroups.get(ref.question.choices.length) || [];
  group.push(ref);
  lessonGroups.set(ref.question.choices.length, group);
});
for (const group of lessonGroups.values()) group.forEach(({ question }, index) => { question.answerSlot = index % question.choices.length; });

const characterData = fs.readFileSync(path.resolve(__dirname, "../character-names.js"), "utf8");
const step5Engine = fs.readFileSync(path.resolve(__dirname, "step5-engine.js"), "utf8");
const step6Runtime = fs.readFileSync(path.resolve(__dirname, "step6-runtime.js"), "utf8");
const step6ParserLicense = fs.readFileSync(path.resolve(__dirname, "step6-acorn.LICENSE"), "utf8");
const step6Parser = `/* Acorn JavaScript parser\n${step6ParserLicense}\n*/\n` + fs.readFileSync(path.resolve(__dirname, "step6-acorn.js"), "utf8");
const output = `${characterData}\n${step5Engine}\n${step6Parser}\n${step6Runtime}\nwindow.DFS_VISUAL_DATA = ${JSON.stringify({ version: 3, problems: catalog })};\n`;
const outputPath = path.resolve(__dirname, "../visual-data.js");
if (process.argv.includes("--check")) {
  const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (existing !== output) {
    console.error("visual-data.js is stale. Run node scripts/build-visual-data.js.");
    process.exit(1);
  }
  console.log(`Generated visual data is current for ${catalog.length} problems.`);
} else {
  fs.writeFileSync(outputPath, output);
  const hash = require("crypto").createHash("sha256");
  hash.update(output);
  for (const name of ["visual-library.js", "graph.js", "styles.css"]) hash.update(fs.readFileSync(path.resolve(__dirname, "..", name)));
  const revision = hash.digest("hex").slice(0, 12);
  const indexPath = path.resolve(__dirname, "../index.html");
  const html = fs.readFileSync(indexPath, "utf8")
    .replace(/^.*<script src="\/character-names\.js[^\n]*\n/gm, "")
    .replace(/(\/(?:visual-data\.js|visual-library\.js|graph\.js|styles\.css))\?v=[^"\s]+/g, `$1?v=${revision}`);
  fs.writeFileSync(indexPath, html);
  console.log(`Built visual data for ${catalog.length} problems.`);
}
