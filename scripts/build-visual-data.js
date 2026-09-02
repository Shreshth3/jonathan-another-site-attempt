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
const visualLessons = new Map(rawVisualLessons.map(item => [item.id, item]));

const step4Files = ["step4-specs-original.json", "step4-specs-variant.json", "step4-specs-new.json"];
const rawStep4Specs = step4Files.flatMap(name => {
  const file = path.resolve(__dirname, "..", name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
});
if (new Set(rawStep4Specs.map(item => item.id)).size !== rawStep4Specs.length) throw new Error("Step 4 specs contain duplicate problem IDs.");
const STEP4_DIAGNOSIS_LABEL_OVERRIDES = {
  "two-digits-four-way:wrong-three": "Digit 7 should have only p, q, and r, changing this input's returned value.",
  "two-digits-second-three-way:wrong-three": "Digit 4 should have only g and h, changing this input's returned value.",
  "failed-start-blocks-aac:diagonal-word": "The search needs diagonal moves to reach C, which changes the returned value here."
};
const step4Specs = new Map(rawStep4Specs.map(item => [item.id, resolveAuthoredStep4Cases(item)]));

function resolveAuthoredStep4Cases(spec) {
  if (!Array.isArray(spec.cases) || !spec.cases.length) return spec;
  const base = spec.cases[0];
  return {
    ...spec,
    cases: spec.cases.map((entry, index) => {
      if (index === 0) return entry;
      const resolved = { ...base, ...entry };
      resolved.canvas = expandCompactCanvas(entry.canvas || base.canvas);
      if (!entry.diagnoses) resolved.diagnoses = base.diagnoses.map(choice => {
        const label = entry.diagnosisLabels?.[choice.id] || STEP4_DIAGNOSIS_LABEL_OVERRIDES[`${entry.caseId}:${choice.id}`] || choice.label;
        return {
          ...choice,
          label,
          feedback: choice.id === base.correctDiagnosis
            ? `Correct. ${entry.rationale} The shown code returns ${entry.buggyOutput}; the real problem returns ${entry.correctOutput}.`
            : `No. ${label} The exact separating fact here is: ${entry.rationale}`
        };
      });
      if (!entry.graphProof) resolved.graphProof = {
        realGraph: `The exact drawing has ${resolved.canvas.nodes.length} nodes and ${resolved.canvas.edges.length} direct ${resolved.canvas.directed ? "arrows" : "edges"}.`,
        codeRule: base.graphProof.codeRule,
        separatingFeature: entry.rationale,
        outputConsequence: `The changed graph boundary makes the code return ${entry.buggyOutput}; the real graph returns ${entry.correctOutput}.`
      };
      return resolved;
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
  for (const fileName of step4Files) {
    const file = path.resolve(__dirname, "..", fileName);
    const authored = JSON.parse(fs.readFileSync(file, "utf8")).map(spec => ({
      id: spec.id,
      ...expandStep4Cases(spec.id, spec.cases?.[0] || spec, visualLessons.get(spec.id))
    }));
    fs.writeFileSync(file, `${JSON.stringify(authored, null, 2)}\n`);
  }
  console.log("Authored verified Step 4 cases from lesson inputs.");
  process.exit(0);
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
    statement: problem.statement,
    examples: problem.examples,
    constraints: problem.constraints,
    visualKind: visualSpec.visualKind,
    graphRules: {
      nodes: correctChoiceLabel(visualSpec.nodeQuestion),
      edges: correctChoiceLabel(visualSpec.edgeQuestion),
      nodeLabelFormat: visualSpec.nodeLabelFormat
    },
    counterexampleLesson: step2Specs.get(problem.id) || null,
    lesson: visualLessons.get(problem.id) || null,
    codeReasoning: step4Specs.get(problem.id) || null
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

const output = `window.DFS_VISUAL_DATA = ${JSON.stringify({ version: 3, problems: catalog })};\n`;
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
  console.log(`Built visual data for ${catalog.length} problems.`);
}
