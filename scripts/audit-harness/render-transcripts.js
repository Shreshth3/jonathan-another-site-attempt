// Renders each transcripts/<id>.json into a reviewer-friendly transcripts-md/<id>.md
const fs = require("fs");
const path = require("path");
const IN = path.join(__dirname, "transcripts");
const OUT = path.join(__dirname, "transcripts-md");
fs.mkdirSync(OUT, { recursive: true });

const fence = s => "```\n" + String(s ?? "").trim() + "\n```";
const canvasText = c => {
  if (!c) return "(none)";
  const label = id => c.nodes.find(n => String(n.id) === String(id))?.label ?? id;
  const joiner = c.directed ? "→" : "—";
  return `${c.directed ? "DIRECTED" : "UNDIRECTED"} · nodes: ${c.nodes.map(n => `"${n.label}"`).join(", ")} · edges: ${c.edges.map(e => `${label(e.from)}${joiner}${label(e.to)}${e.color ? ` [${e.color}]` : ""}${e.label ? ` (weight/label "${e.label}")` : ""}`).join(", ") || "none"}`;
};
const modelText = m => m ? `${m.directed ? "DIRECTED" : "UNDIRECTED"} · nodes: ${m.nodes.join(", ")} · edges: ${m.edges.join(", ") || "none"}` : "";

for (const file of fs.readdirSync(IN).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const t = JSON.parse(fs.readFileSync(path.join(IN, file), "utf8"));
  const L = [];
  L.push(`# ${t.title} (\`${t.id}\`) — ${t.category}, ${t.visualKind}`);
  L.push(`\n## Problem statement (Description tab)\n\n${t.statement}\n`);
  L.push(`### Examples\n${(t.examples || []).map((e, i) => `- Example ${i + 1}: input \`${e.input}\` → output \`${e.output}\`. ${e.explanation}`).join("\n")}\n`);
  L.push(`### Graph rules (authored)\n- Nodes: ${t.graphRules?.nodes}\n- Edges: ${t.graphRules?.edges}\n- Node-name format shown in Step 1/3: ${t.graphRules?.nodeLabelFormat?.instruction || "(none)"} (pattern \`${t.graphRules?.nodeLabelFormat?.pattern || "-"}\`)\n- Step 2 node-label rule: \`${t.nodeLabelRule?.rule}\` — ${t.nodeLabelRule?.description || ""}\n`);
  if (t.errors?.length) L.push(`### HARNESS-DETECTED ERRORS\n${t.errors.map(e => `- ${e}`).join("\n")}\n`);
  if (t.consoleErrors?.length) L.push(`### Browser console errors\n${t.consoleErrors.map(e => `- ${e}`).join("\n")}\n`);

  // ---- Step 1 ----
  const s1 = t.steps.step1 || {};
  L.push(`\n## STEP 1 · Visual proof (9 questions, in the order the student sees them)\n`);
  for (const q of s1.correctPass || []) {
    L.push(`### S1 Q${q.index + 1} — ${q.kind.toUpperCase()} (\`${q.taskId}\`, facet "${q.facet}")`);
    L.push(`Raw input shown:\n${fence(q.ui.promptCode)}`);
    if (q.ui.labelGuide) L.push(`Node-name guide shown: ${q.ui.labelGuide}`);
    L.push(`Drawing-tool title: "${q.ui.graphTitle}"`);
    L.push(`Question shown: **${q.ui.question}**`);
    if (q.data.shownModel) L.push(`Picture under review: ${modelText(q.data.shownModel)}`);
    L.push(`Choices as displayed (top to bottom):`);
    L.push(q.ui.choices.map((c, i) => `${i + 1}. ${c.replace(/\n/g, " / ")}`).join("\n"));
    L.push(`Answer key + feedback per choice (data):`);
    L.push(q.data.choices.map(c => `- ${c.id === q.data.correct ? "✅ CORRECT" : "❌"} [${c.id}] "${c.label}"${c.model ? ` — picture: ${modelText(c.model)}` : ""}\n    feedback: ${c.feedback}${c.misconception ? ` (misconception: ${c.misconception})` : ""}`).join("\n"));
    if (q.kind === "build") L.push(`Graph the grader requires (hidden from student): ${canvasText(q.data.canvas)}`);
    L.push(`"Why" shown after success: ${q.data.why}`);
    L.push(`Result when solved correctly through the UI: ${q.result?.passed ? "PASSED" : "**FAILED / DEAD END** " + (q.result?.note || (q.result?.checklist || []).join(" | "))}${q.choicesDisabledBeforeDrawing ? " · (answer buttons were disabled until a node was drawn)" : " · (answer buttons enabled before any drawing)"}\n`);
  }
  L.push(`Completion screen text: ${fence(s1.completionText)}`);
  L.push(`Progress strip after answering every concept question WRONG and then passing each remedial build: "${s1.progressLabelAfterRemedials}" · "${s1.attemptLabelAfterRemedials}"\n`);
  L.push(`### S1 remedial builds (shown after a wrong concept answer)`);
  for (const r of s1.remedialPass || []) {
    L.push(`#### After answering concept \`${r.conceptId}\` wrong with choice [${r.wrongChoice}]`);
    L.push(`Feedback shown:\n${fence(r.wrongFeedback)}`);
    L.push(`Button: "${(r.buttonAfterWrong || "").replace(/\n/g, " ")}" → remedial build "${r.remedial.title}"`);
    L.push(`Remedial raw input:\n${fence(r.remedial.ui.promptCode)}`);
    L.push(`Remedial question: **${r.remedial.ui.question}** · choices shown: ${r.remedial.ui.choices.join(" | ")}`);
    L.push(`Remedial answer key: ${(r.remedial.data.choices || []).map(c => `${c.id === r.remedial.data.correct ? "✅" : "❌"} "${c.label}" — ${c.feedback}`).join("; ")}`);
    L.push(`Remedial required graph (hidden): ${canvasText(r.remedial.data.canvas)}`);
    L.push(`Remedial result: ${r.remedial.result?.passed ? "PASSED" : "**FAILED** " + (r.remedial.result?.checklist || []).join(" | ")}\n`);
  }

  // ---- Step 2 ----
  const s2 = t.steps.step2 || {};
  L.push(`\n## STEP 2 · Counterexample lab (3 questions)\n`);
  for (const r of s2.rounds || []) {
    L.push(`### S2 Q${r.round + 1} — bug \`${r.bugs?.[0]}\` (authored level "${r.level}"; authored goal, NOT shown to student: "${r.goal}")`);
    L.push(`Everything the student sees (text):\n${fence(r.ui?.fullText)}`);
    L.push(`Start field: label "${(r.ui?.startFieldLabel || "").replace(/\n/g, " / ")}", placeholder "${r.ui?.startPlaceholder}", prefilled "${r.ui?.startValue}", readonly=${r.ui?.startReadonly}`);
    L.push(`Output labels: ${(r.ui?.outputLabels || []).join(" | ")} · Node-name guide shown: ${r.ui?.labelGuide || "NONE"} · edge drawing-order numbers visible: ${r.ui?.edgeOrderShown}`);
    if (r.mistakenStartLabel) L.push(`Authored wrong start used by the character: "${r.mistakenStartLabel}" (only revealed in Drawing 2's title)`);
    if (r.step1LabelProbe) L.push(`Probe — submitting the graph with Step 1's node names (${r.step1LabelProbe.labels.map(l => `"${l}"`).join(", ")}): ${r.step1LabelProbe.accepted ? "accepted" : `REJECTED with "${r.step1LabelProbe.parseError}"`}`);
    if (r.starterEval) L.push(`Minimal starter graph evaluation: ${JSON.stringify(r.starterEval)}`);
    if (r.graphUsed) L.push(`Graph the harness submitted as the correct graph: ${r.graphUsed.directed ? "DIRECTED" : "UNDIRECTED"} nodes ${r.graphUsed.nodes.join(", ")} · edges (in drawing order) ${r.graphUsed.edges.map(e => `${e[0]}${r.graphUsed.directed ? "→" : "—"}${e[1]}${e[2] ? ` [${e[2]}]` : ""}`).join(", ") || "none"} · start ${r.graphUsed.start}${r.graphUsed.checkpoint ? ` · amber checkpoint ${r.graphUsed.checkpoint}` : ""}`);
    if (r.expected) L.push(`Grader's expected answers: correct output \`${r.expected.correctOutput}\` · character's output \`${r.expected.buggyOutput}\` · character's graph must be exactly: ${modelText(r.expected.mistakenCanvas)}`);
    if (r.outputFormatProbes) L.push(`Output-format probes (what the "Correct output" field accepts): ${r.outputFormatProbes.map(p => `${p.accepted ? "✅" : "❌"} ${p.variant} → \`${p.value}\``).join("; ")}`);
    L.push(`Result: ${r.result?.passed ? "PASSED" : "**FAILED** — " + (r.result?.reason || (r.result?.checklist || []).join(" | "))}`);
    if (r.successText) L.push(`Success text:\n${fence(r.successText)}`);
    L.push("");
  }
  L.push(`Completion screen: ${fence(s2.completionText)}`);

  // ---- Step 3 ----
  const s3 = t.steps.step3 || {};
  L.push(`\n## STEP 3 · Graph structure (5 questions; claims are generated, "variant" changes after a wrong check)\n`);
  for (const r of s3.rounds || []) {
    L.push(`### S3 Q${r.round + 1}`);
    L.push(`Raw input shown:\n${fence(r.ui?.promptCode)}`);
    L.push(`Node-name guide: ${r.ui?.labelGuide || "NONE"} · drawing title "${r.ui?.graphTitle}" · claim buttons disabled until a node is drawn: ${r.claimButtonsDisabledBeforeDrawing}`);
    L.push(`Required graph (hidden): ${canvasText(r.data?.canvas)}`);
    const allVariants = [...(r.variants || []).map(v => ({ ...v, tag: `variant ${v.variant} (answered wrong on purpose)` })), { ...r.finalVariant, tag: `variant ${r.finalVariant?.variant} (answered correctly)` }];
    for (const v of allVariants) {
      L.push(`Claims, ${v.tag}:`);
      L.push((v.claims || []).map(c => `- [${c.correct ? "YES is correct" : "NO is correct"}] (${c.kind}) "${c.statement}"\n    feedback if wrong: ${c.feedback}`).join("\n"));
      if (v.wrongFeedback) L.push(`Feedback shown after answering all wrong:\n${fence(v.wrongFeedback)}`);
    }
    if (r.wrongGraphFeedback) L.push(`Feedback when claims are right but the graph is wrong:\n${fence(r.wrongGraphFeedback)}`);
    L.push(`Result: ${r.result?.passed ? "PASSED" : "**FAILED** " + (r.result?.feedback || "")}\n`);
  }
  L.push(`Completion screen: ${fence(s3.completionText)}`);

  // ---- Step 4 ----
  const s4 = t.steps.step4 || {};
  L.push(`\n## STEP 4 · Trace lab (${(s4.cases || []).length} code cases)\n`);
  for (const c of s4.cases || []) {
    L.push(`### S4 case ${c.case + 1} — \`${c.caseId}\` · bug: ${c.bugTitle}`);
    L.push(`Input shown:\n${fence(c.ui?.inputShown)}`);
    L.push(`Node-name guide shown: ${c.ui?.labelGuide || "NONE"} · drawing title "${c.ui?.graphTitle}" · output box disabled until drawing starts: ${c.outputDisabledBeforeDrawing} · output placeholder "${c.ui?.outputPlaceholder}"`);
    L.push(`Code shown:\n${fence(c.data?.code)}`);
    L.push(`Required graph (hidden from student; labels must match EXACTLY): ${canvasText(c.data?.canvas)}`);
    L.push(`Output field label: "${(c.ui?.outputLabel || "").replace(/\n/g, " ")}" · authored outputFormat (not shown): "${c.data?.outputFormat}" · expected buggy output \`${c.data?.buggyOutput}\` · real correct output \`${c.data?.correctOutput}\``);
    L.push(`Diagnosis choices as displayed:`);
    L.push((c.ui?.diagnoses || []).map(d => `- ${d.replace(/\n/g, " ")}`).join("\n"));
    L.push(`Diagnosis answer key + feedback:`);
    L.push((c.data?.diagnoses || []).map(d => `- ${d.id === c.data.correctDiagnosis ? "✅" : "❌"} [${d.id}] "${d.label}" — feedback: ${d.feedback}`).join("\n"));
    L.push(`Graph proof shown in feedback: code rule "${c.data?.graphProof?.codeRule}" → changed graph "${c.data?.graphProof?.realGraph}" → boundary "${c.data?.graphProof?.separatingFeature}" → returned value "${c.data?.graphProof?.outputConsequence}"`);
    if (c.outputFormatProbes) L.push(`Output-format probes: ${c.outputFormatProbes.map(p => `${p.accepted ? "✅" : "❌"} ${p.variant} → \`${p.value}\``).join("; ")}`);
    if (c.wrongDiagnosisFeedback) L.push(`Feedback after a wrong diagnosis:\n${fence(c.wrongDiagnosisFeedback)}`);
    L.push(`Result: ${c.result?.passed ? "PASSED" : "**FAILED** " + (c.result?.checklist || []).join(" | ")}`);
    if (c.result?.passed) L.push(`Success text:\n${fence(c.result.feedback)}`);
    L.push("");
  }
  L.push(`Completion screen: ${fence(s4.completionText)}`);
  fs.writeFileSync(path.join(OUT, file.replace(/\.json$/, ".md")), L.join("\n"));
}
console.log("rendered", fs.readdirSync(OUT).length, "files");
