const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;
const dataVersion = sandbox.window.DFS_VISUAL_DATA.version;
const failures = [];
const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let file = path.join(root, pathname.replace(/^\//, ""));
  if (!path.extname(file) || !fs.existsSync(file)) file = path.join(root, "index.html");
  response.setHeader("content-type", contentTypes[path.extname(file)] || "application/octet-stream");
  response.end(fs.readFileSync(file));
});

function check(condition, message) { if (!condition) failures.push(message); }

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("pageerror", error => failures.push(`browser error: ${error.message}`));

  for (const problem of problems) {
    const base = `http://127.0.0.1:${port}/${problem.id}`;

    await page.goto(base);
    check(await page.locator("#graph-lab").count() === 1, `${problem.id}/step1: graph lab missing`);
    const overlappingPictures = await page.evaluate(problemId => {
      const lesson = window.DFS_VISUAL_DATA.problems.find(item => item.id === problemId)?.lesson;
      const models = (lesson?.conceptTasks || []).flatMap(task => [task.shownModel, ...(task.choices || []).map(choice => choice.model)].filter(Boolean));
      const distance = (point, from, to) => {
        const dx = to.x - from.x, dy = to.y - from.y, squared = dx * dx + dy * dy;
        const amount = squared ? Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / squared)) : 0;
        return Math.hypot(point.x - (from.x + amount * dx), point.y - (from.y + amount * dy));
      };
      return models.filter(model => {
        const positions = window.DFS_VISUAL_LIBRARY.layout(model, 320, 180);
        const indexById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), index]));
        return model.edges.some(edge => {
          const fromIndex = indexById[String(edge.from)], toIndex = indexById[String(edge.to)];
          return positions.some((point, index) => index !== fromIndex && index !== toIndex && distance(point, positions[fromIndex], positions[toIndex]) < 20);
        });
      }).length;
    }, problem.id);
    check(overlappingPictures === 0, `${problem.id}/step1: ${overlappingPictures} mini graph edge(s) pass through unrelated nodes`);
    check(await page.evaluate(() => {
      const input = document.querySelector(".prompt-code"), graph = document.querySelector("#graph-lab"), question = document.querySelector(".visual-decision-prompt");
      return input && graph && question && Boolean(input.compareDocumentPosition(graph) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(graph.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), `${problem.id}/step1: input → graph → question order is broken`);

    const step1StorageKey = `dfs-visual:${problem.id}:v${dataVersion}-coffee-rollout`;
    await page.evaluate(key => localStorage.removeItem(key), step1StorageKey);
    await page.reload();
    let conceptCount = 0;
    let testedConceptReset = false;
    for (let taskIndex = 0; taskIndex < 9; taskIndex++) {
      const answers = page.locator(".choices, .visual-option-grid");
      if (await answers.count()) {
        conceptCount++;
        check(await page.locator("#graph-lab").isVisible(), `${problem.id}/step1/concept-${conceptCount}: drawing tool is hidden`);
        check(!(await page.locator("#graph-add-node").isDisabled()), `${problem.id}/step1/concept-${conceptCount}: drawing tool is locked`);
        check(await page.evaluate(() => {
          const input = document.querySelector(".prompt-code"), graph = document.querySelector("#graph-lab"), question = document.querySelector(".challenge-body > h3"), answers = document.querySelector(".choices, .visual-option-grid");
          return input && graph && question && answers
            && Boolean(input.compareDocumentPosition(graph) & Node.DOCUMENT_POSITION_FOLLOWING)
            && Boolean(graph.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING)
            && Boolean(question.compareDocumentPosition(answers) & Node.DOCUMENT_POSITION_FOLLOWING);
        }), `${problem.id}/step1/concept-${conceptCount}: input → drawing → question → answers order is broken`);
        check((await page.evaluate(() => window.DFS_GRAPH.getSnapshot().nodes.length)) === 0, `${problem.id}/step1/concept-${conceptCount}: scratch graph is not blank`);
        check(await page.locator('[data-choice-id]:not([disabled])').count() > 0, `${problem.id}/step1/concept-${conceptCount}: optional drawing was made mandatory`);
        if (!testedConceptReset) {
          await page.getByRole("button", { name: /Add node/ }).click();
          testedConceptReset = true;
        }
      }
      if (taskIndex < 8) await page.getByRole("button", { name: /Skip to next question/ }).click();
    }
    check(conceptCount === 5, `${problem.id}/step1: expected five concept questions with drawing tools, found ${conceptCount}`);

    await page.goto(`${base}?section=2`);
    check(problem.counterexampleLesson.rounds.length === 3, `${problem.id}/step2: expected exactly three questions`);
    check(problem.counterexampleLesson.rounds.every(round => round.bugs.length === 1), `${problem.id}/step2: a question contains more than one mistake`);
    check(await page.locator('[data-counter-drawing]').count() === 2, `${problem.id}/step2: two graph tabs missing`);
    check(await page.locator("#counter-nodes,#counter-edges,#counter-difference,#counter-starter").count() === 0, `${problem.id}/step2: duplicate graph form returned`);
    check(await page.locator("#counter-start").count() === 1, `${problem.id}/step2: start input missing`);
    const semanticInput = problem.counterexampleLesson.input;
    for (const field of semanticInput.fields || []) check(await page.locator(`#counter-field-${field.id}`).count() === 1, `${problem.id}/step2: semantic field ${field.id} is missing`);
    for (const marker of semanticInput.markers || []) check(await page.locator(`#counter-marker-${marker.id}`).count() === 1, `${problem.id}/step2: graph marker ${marker.id} is missing`);
    check(await page.locator(".counter-input-field").innerText().then(text => {
      const shown = text.toLowerCase();
      return shown.includes(semanticInput.prompt.toLowerCase()) && shown.includes(semanticInput.name.toLowerCase());
    }), `${problem.id}/step2: semantic input meaning is hidden`);
    if (!problem.counterexampleLesson.fixedStart) {
      const placeholder = (await page.locator("#counter-start").getAttribute("placeholder") || "").replace(/^Example:\s*/, "");
      check(new RegExp(problem.graphRules.nodeLabelFormat.pattern).test(placeholder), `${problem.id}/step2: placeholder does not use the shown node-name format`);
    }
    if (problem.counterexampleLesson.fixedStart) {
      check(await page.locator("#counter-start").getAttribute("readonly") !== null, `${problem.id}/step2: fixed real start is editable`);
      check(await page.locator("#counter-start").inputValue() === problem.counterexampleLesson.fixedStart, `${problem.id}/step2: fixed real start is wrong`);
    } else {
      check(await page.locator("#counter-start").inputValue() === "", `${problem.id}/step2: a suggestion is pretending to be a chosen value`);
      check((await page.locator("#graph-lab-title").innerText()).includes(`Choose ${semanticInput.name.toLowerCase()}`), `${problem.id}/step2: empty choice is shown as a real selected value`);
    }
    check(await page.locator("#counter-real-output").getAttribute("placeholder") === null, `${problem.id}/step2: correct output placeholder returned`);
    check(await page.locator("#counter-bug-output").getAttribute("placeholder") === null, `${problem.id}/step2: character output placeholder returned`);
    const realOutput = semanticInput.result !== "reached-nodes" || semanticInput.realOutput === true;
    const outputLabels = await page.locator(".counter-output-fields span").allTextContents();
    const outputHelp = await page.locator(".counter-output-help").innerText();
    check(realOutput || !/real function returns/i.test(outputHelp), `${problem.id}/step2: search-trace help falsely calls the node list the real function return`);
    check(outputLabels.includes(realOutput ? `Correct output · ${semanticInput.resultLabel}` : "Nodes the correct search reaches"), `${problem.id}/step2: correct output label has the wrong contract`);
    check(outputLabels.some(text => realOutput ? new RegExp(`[’']s output ·`).test(text) && text.endsWith(semanticInput.resultLabel) : /^Nodes .+[’']s search reaches$/.test(text)), `${problem.id}/step2: character output label has the wrong contract`);
    check(await page.getByRole("heading", { name: realOutput ? "Returned output from each search" : "Nodes reached by each search", exact: true }).count() === 1, `${problem.id}/step2: output section heading has the wrong contract`);
    check(await page.locator(".counter-output-section").evaluate(section => {
      const style = getComputedStyle(section);
      return parseFloat(style.marginTop) >= 12 && parseFloat(style.paddingTop) >= 12 && style.borderTopStyle !== "none";
    }), `${problem.id}/step2: inputs and outputs lack clear visual separation`);
    await page.locator('[data-counter-drawing="mistaken"]').click();
    check(await page.locator('[data-counter-drawing="mistaken"]').getAttribute("aria-pressed") === "true", `${problem.id}/step2: graph tab state is not announced`);

    await page.goto(`${base}?section=3`);
    const step3Inputs = [];
    let step3ClaimCount = 0;
    const expectedClaimKinds = ["membership", "direct-vs-reach", "local-degree", "direction", /^(?:reachable-count|edge-metadata)$/];
    for (let round = 0; round < 5; round++) {
      step3Inputs.push(await page.locator(".structure-mini-example").innerText());
      const claimTexts = await page.locator(".student-claim blockquote").allTextContents();
      step3ClaimCount += claimTexts.length;
      check(claimTexts.length === 1, `${problem.id}/step3/${round + 1}: expected one Yes/No claim`);
      check(!claimTexts.some(text => /stays in the graph|stays one node|has no (?:incoming|outgoing) direct edge|has (?:no|only one) direct neighbors?/i.test(text)), `${problem.id}/step3/${round + 1}: trivial membership claim returned`);
      const kind = await page.locator("[data-claim-kind]").getAttribute("data-claim-kind");
      const expectedKind = expectedClaimKinds[round];
      check(expectedKind instanceof RegExp ? expectedKind.test(kind) : kind === expectedKind, `${problem.id}/step3/${round + 1}: expected a ${expectedKind} claim, found ${kind}`);
      if (round === 0) {
        const membership = page.locator('[data-claim-kind="membership"]');
        check(Boolean(await membership.getAttribute("data-misconception")), `${problem.id}/step3: membership claim does not test a named misconception`);
        check(/^In this input,/.test(await membership.locator("blockquote").innerText()), `${problem.id}/step3: membership claim is not grounded in the current input`);
      }
      const yesNames = await page.locator('[data-claim-value="true"]').evaluateAll(buttons => buttons.map(button => button.getAttribute("aria-label")));
      check(yesNames.length === 1 && yesNames.every(Boolean), `${problem.id}/step3/${round + 1}: Yes button does not name its claim`);
      check(await page.locator(".claim-verdict[aria-labelledby]").count() === 1, `${problem.id}/step3/${round + 1}: claim is not linked to its controls`);
      check(await page.getByRole("button", { name: /Skip to next question/ }).isVisible(), `${problem.id}/step3/${round + 1}: skip button is hidden`);
      await page.getByRole("button", { name: /Skip to next question/ }).click();
    }
    check(new Set(step3Inputs).size === 5, `${problem.id}/step3: expected five distinct inputs`);
    check(step3ClaimCount === 5, `${problem.id}/step3: expected 5 total claims`);
    check((await page.locator("#challenge").innerText()).includes("0 passed · 5 skipped"), `${problem.id}/step3: skip totals are wrong`);
    check(await page.locator(".structure-victory.has-skips").count() === 1, `${problem.id}/step3: skipped work looks mastered`);

    await page.goto(`${base}?section=4`);
    check(await page.locator(".code-window").count() === 1, `${problem.id}/step4: expected one code case on the current screen`);
    check(await page.getByText("Incorrect solution", { exact: true }).count() === 1, `${problem.id}/step4: code label missing`);
    check(!(await page.locator("body").innerText()).includes("Use these exact node labels"), `${problem.id}/step4: correct graph giveaway returned`);
    check(await page.evaluate(() => {
      const input = document.querySelector(".trace-input"), graph = document.querySelector("#graph-lab"), code = document.querySelector(".code-window");
      return input && graph && code && Boolean(input.compareDocumentPosition(graph) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(graph.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), `${problem.id}/step4: input → graph → code order is broken`);
    check(await page.evaluate(() => {
      const behavior = document.querySelector(".reasoning-rule"), output = document.querySelector(".reasoning-output");
      return behavior && output && Boolean(output.compareDocumentPosition(behavior) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), `${problem.id}/step4: exact returned value must appear before graph-level behavior`);
    check(!(await page.locator("body").innerText()).includes("deep code cases passed"), `${problem.id}/step4: old deep-case progress copy returned`);
    check(!(await page.locator("body").innerText()).includes("Clean run"), `${problem.id}/step4: old clean-run copy returned`);
    check(await page.evaluate(() => {
      const code = document.querySelector(".code-window pre");
      return code.scrollWidth <= code.clientWidth + 1;
    }), `${problem.id}/step4: incorrect solution is horizontally clipped`);
    const shownStep4Cases = [`${await page.locator(".trace-input pre").innerText()}\n---CODE---\n${await page.locator(".code-window code").innerText()}`];
    for (let caseIndex = 1; caseIndex < problem.codeReasoning.cases.length; caseIndex++) {
      await page.getByRole("button", { name: /Skip to next question/ }).click();
      shownStep4Cases.push(`${await page.locator(".trace-input pre").innerText()}\n---CODE---\n${await page.locator(".code-window code").innerText()}`);
    }
    check(shownStep4Cases.length >= 3 && new Set(shownStep4Cases).size === shownStep4Cases.length, `${problem.id}/step4: the UI did not show several different code cases`);
  }

  await page.goto(`http://127.0.0.1:${port}/all-paths-from-source-to-target?section=2`);
  await page.evaluate(() => localStorage.setItem("dfs-counterexamples:all-paths-from-source-to-target:v4", JSON.stringify({ index: 4, skipped: [3] })));
  await page.reload();
  check((await page.locator("#evidence-label").innerText()).toLowerCase() === "3 of 3 questions completed", "step2: old fourth-round progress is not safely migrated");
  check((await page.locator("#challenge").innerText()).includes("Step 2 complete."), "step2: old fourth-round progress does not finish after three questions");
  check(!(await page.locator("#challenge").innerText()).includes("skipped"), "step2: removed fourth-round skip still affects completion totals");

  await page.goto(`http://127.0.0.1:${port}/routes-past-the-coffee-cart?section=2`);
  await page.locator('[data-counter-drawing="correct"]').click();
  await page.getByRole("button", { name: /Add node/ }).click();
  await page.locator('[data-counter-drawing="mistaken"]').click();
  const duplicate = page.getByRole("button", { name: "Duplicate graph from #1" });
  check(await duplicate.isEnabled(), "step2: duplicate should unlock after graph #1 starts");
  await duplicate.click();
  check(!(await page.getByRole("button", { name: "Graph #1 duplicated" }).isEnabled()), "step2: duplicate must become one-time to protect edits");
  check(await page.locator('[data-counter-drawing="mistaken"]').evaluate(element => element === document.activeElement), "step2: focus was lost after duplicating graph #1");
  check((await page.locator("#graph-status").innerText()).includes("copied"), "step2: graph duplication was not announced");
  check(await page.evaluate(() => {
    const status = document.querySelector("#graph-status").getBoundingClientRect();
    const tab = document.querySelector('[data-counter-drawing="correct"]').getBoundingClientRect();
    return status.bottom <= tab.top || status.top >= tab.bottom;
  }), "step2: graph duplication message covers the graph tabs");
  await page.getByRole("button", { name: "Restart" }).click();
  check((await page.locator("#graph-status").innerText()) === "", "step2: restart leaves a stale graph status message");

  await page.getByRole("button", { name: /Skip to next question/ }).click();
  await page.getByRole("button", { name: /Add node/ }).click();
  await page.getByRole("button", { name: /Add node/ }).click();
  await page.locator('.scratch-node[data-node-id="0"]').click();
  await page.locator('.scratch-node[data-node-id="1"]').click();
  check(await page.locator(".scratch-edge-order").filter({ hasText: "#1" }).count() === 1, "step2: edge drawing order is hidden for an order-sensitive mistake");
  await page.goto(`http://127.0.0.1:${port}/kill-process?section=2`);
  await page.getByRole("button", { name: /Skip to next question/ }).click();
  await page.getByRole("button", { name: /Skip to next question/ }).click();
  await page.evaluate(() => window.DFS_GRAPH.setSnapshot({
    directed: true, nextNodeId: 3, nextEdgeId: 2,
    nodes: [
      {id:0,label:"1",x:80,y:100,r:32,color:"#8392a8"},
      {id:1,label:"2",x:200,y:100,r:32,color:"#f1b75b"},
      {id:2,label:"3",x:320,y:100,r:32,color:"#8392a8"}
    ],
    edges: [
      {id:0,from:0,to:1,color:"#8392a8",width:4},
      {id:1,from:0,to:2,color:"#8392a8",width:4}
    ]
  }));
  await page.locator('[data-counter-drawing="mistaken"]').click();
  await page.getByRole("button", { name: "Duplicate graph from #1" }).click();
  await page.locator("#counter-start").fill("1");
  await page.locator("#counter-real-output").fill("1; 2; 3");
  await page.locator("#counter-bug-output").fill("[1, 3]");
  await page.getByRole("button", { name: /Check my graph/ }).click();
  const typedFeedback = await page.locator("#feedback-slot").innerText();
  check(await page.locator(".feedback.good").count() === 1, `step2: friendly list predictions did not pass (${typedFeedback.replace(/\s+/g, " ")})`);
  const resultLabels = await page.locator(".case-result-grid span").allTextContents();
  const resultValues = await page.locator(".case-result-grid strong").allTextContents();
  check(resultLabels[0] === "Correct function returns", "step2: successful exact-list feedback does not show the correct return first");
  check(/[’']s function returns$/.test(resultLabels[1]), "step2: successful exact-list feedback does not label the character's return");
  check(resultValues.every(value => /^\[.*\]$/.test(value)), "step2: successful feedback does not keep JSON list formatting");

  await page.goto(`http://127.0.0.1:${port}/find-if-path-exists-in-graph?section=2`);
  await page.getByRole("button", { name: /Add node/ }).click();
  await page.locator('[data-counter-drawing="mistaken"]').click();
  await page.getByLabel("Directed edges").check();
  check(!(await page.getByRole("button", { name: "Duplicate graph from #1" }).isEnabled()), "step2: duplicate can overwrite direction-only work in graph #2");

  await page.goto(`http://127.0.0.1:${port}/who-keeps-their-job?section=2`);
  check(!(await page.locator("#challenge").innerText()).includes("Use positive integer IDs"), "step2: Big Resignation still shows unnecessary node-name helper text");
  check(!(await page.locator("#challenge").innerText()).includes("real function return values"), "step2: Big Resignation still shows unnecessary output helper text");
  await page.getByRole("button", { name: /Add node/ }).click();
  check(await page.locator('.scratch-node[data-node-id="0"] text').textContent() === "1", "step2: Big Resignation still creates letter-named nodes");
  await page.evaluate(() => window.DFS_GRAPH.setSnapshot({directed:true,nextNodeId:1,nextEdgeId:0,nodes:[{id:0,label:"A",x:120,y:100,r:32,color:"#8392a8"}],edges:[]}));
  await page.locator('[data-counter-drawing="mistaken"]').click();
  await page.evaluate(() => window.DFS_GRAPH.setSnapshot({directed:true,nextNodeId:1,nextEdgeId:0,nodes:[{id:0,label:"A",x:120,y:100,r:32,color:"#8392a8"}],edges:[]}));
  await page.locator("#counter-start").fill("A");
  await page.locator("#counter-real-output").fill("[]");
  await page.locator("#counter-bug-output").fill("[]");
  await page.getByRole("button", { name: /Check my graph/ }).click();
  check((await page.locator("#feedback-slot").innerText()).includes("Step 1 node-name format"), "step2: Big Resignation accepts letter employee IDs");

  await page.goto(`http://127.0.0.1:${port}/flood-fill?section=3`);
  await page.evaluate(() => localStorage.removeItem("dfs-structure:flood-fill:v8"));
  await page.reload();
  const step3Answers = await page.evaluate(() => {
    const lesson = window.DFS_VISUAL_DATA.problems.find(problem => problem.id === "flood-fill").lesson;
    const input = document.querySelector(".structure-mini-example").textContent;
    const task = lesson.conceptTasks.map(concept => concept.remedial).find(remedial => remedial.input === input);
    const canvas = task.canvas;
    const nodeIndex = new Map(canvas.nodes.map((node, index) => [String(node.id), index]));
    window.DFS_GRAPH.setSnapshot({
      directed: canvas.directed,
      nextNodeId: canvas.nodes.length,
      nextEdgeId: canvas.edges.length,
      nodes: canvas.nodes.map((node, index) => ({ id: index, label: String(node.label), x: 100 + index % 4 * 110, y: 90 + Math.floor(index / 4) * 100, r: 32, color: "#8392a8" })),
      edges: canvas.edges.map((edge, index) => ({ id: index, from: nodeIndex.get(String(edge.from)), to: nodeIndex.get(String(edge.to)), color: edge.color || "#8392a8", width: 4, label: edge.label || "" }))
    });
    window.dispatchEvent(new Event("dfs-graph-change"));
    const outgoing = Object.fromEntries(canvas.nodes.map(node => [String(node.id), new Set()]));
    for (const edge of canvas.edges) {
      outgoing[String(edge.from)].add(String(edge.to));
      if (!canvas.directed) outgoing[String(edge.to)].add(String(edge.from));
    }
    return [...document.querySelectorAll(".student-claim blockquote")].map(element => {
      const statement = element.textContent;
      if (statement.startsWith("In this input,")) return false;
      if (statement.includes(" stays in the graph") || statement.includes(" stays one node")) return true;
      if (statement.includes("stay as two separate nodes")) return true;
      if (statement.includes("should be merged into one node")) return false;
      if (statement.includes("should be left out")) return false;
      if (statement.includes("should also contain a direct")) return false;
      if (statement.includes("but the graph still has no direct")) return true;
      if (statement.startsWith("There is no direct edge")) return true;
      if (statement.includes("so the graph should contain a direct")) return false;
      if (statement.includes("should contain a direct") && statement.includes("can reach itself")) return false;
      if (statement.includes("can reach itself without using an edge")) return true;
      if (statement.includes("are directly connected")) return true;
      if (statement.includes("but there is no direct")) return false;
      const degree = statement.match(/^(.*) has exactly (\d+) /);
      if (degree) {
        const node = canvas.nodes.find(item => String(item.label) === degree[1]);
        return outgoing[String(node.id)].size === Number(degree[2]);
      }
      throw new Error(`Unrecognized Step 3 claim: ${statement}`);
    });
  });
  const firstClaimBeforeRetry = await page.locator(".student-claim blockquote").innerText();
  const drawingBeforeRetry = await page.evaluate(() => window.DFS_GRAPH.getSnapshot());
  await page.locator(".student-claim").getByRole("button", { name: step3Answers[0] ? /^No:/ : /^Yes:/ }).click();
  await page.getByRole("button", { name: /Check graph \+ answer/ }).click();
  await page.getByRole("button", { name: /Try another check/ }).click();
  check(await page.locator(".student-claim blockquote").innerText() === firstClaimBeforeRetry, "step3: a wrong answer changed the claim");
  check(JSON.stringify(await page.evaluate(() => window.DFS_GRAPH.getSnapshot())) === JSON.stringify(drawingBeforeRetry), "step3: retry erased the student's graph");
  for (const [index, answer] of step3Answers.entries()) {
    await page.locator(".student-claim").nth(index).getByRole("button", { name: answer ? /^Yes:/ : /^No:/ }).click();
  }
  await page.getByRole("button", { name: /Check graph \+ answer/ }).click();
  check(await page.locator(".feedback.good").count() === 1, "step3: a correct graph and correct answer did not pass");
  check(await page.getByRole("button", { name: /Skip to next question/ }).isHidden(), "step3: skip stays available after a passed graph");
  await page.getByRole("button", { name: /Next question/ }).click();
  const advancedEvidence = await page.locator("#evidence-label").innerText();
  check(advancedEvidence.toLowerCase().startsWith("1 of 5"), `step3: successful question did not advance (${advancedEvidence})`);
  for (let index = 0; index < 4; index++) await page.getByRole("button", { name: /Skip to next question/ }).click();
  check((await page.locator("#challenge").innerText()).includes("1 passed · 4 skipped"), "skip: Step 3 completion does not separate passed and skipped questions");
  check(await page.locator(".victory.has-skips").count() === 1 && (await page.locator(".stamp").textContent()) === "Finished", "skip: partly skipped Step 3 still looks like a mastery win");

  await page.goto(`http://127.0.0.1:${port}/`);
  await page.evaluate(() => {
    localStorage.removeItem("dfs-reasoning:who-keeps-their-job:v3");
    localStorage.setItem("dfs-reasoning:who-keeps-their-job:v2", JSON.stringify({ index: 999, skipped: [0, 1, 998] }));
  });
  await page.reload();
  check(await page.locator('a[href="/who-keeps-their-job"].completed').count() === 0, "step4: old one-case progress falsely marks the picker card complete");
  await page.goto(`http://127.0.0.1:${port}/who-keeps-their-job?section=4`);
  check(await page.locator(".reasoning-victory").count() === 0, "step4: old one-case progress falsely completes the new multi-case lesson");
  check((await page.locator("#evidence-label").innerText()).toLowerCase().startsWith("0 of "), "step4: a skipped legacy case is counted as passed");
  await page.evaluate(() => {
    localStorage.removeItem("dfs-reasoning:who-keeps-their-job:v2");
    localStorage.removeItem("dfs-reasoning:who-keeps-their-job:v3");
  });
  await page.reload();
  const firstCodeInput = await page.locator(".trace-input pre").innerText();
  const firstCodeCase = await page.evaluate(() => {
    const round = window.DFS_VISUAL_DATA.problems.find(problem => problem.id === "who-keeps-their-job").codeReasoning.cases[0];
    const nodeIndex = new Map(round.canvas.nodes.map((node, index) => [String(node.id), index]));
    window.DFS_GRAPH.setSnapshot({
      directed: round.canvas.directed,
      nextNodeId: round.canvas.nodes.length,
      nextEdgeId: round.canvas.edges.length,
      nodes: round.canvas.nodes.map((node, index) => ({ id: index, label: String(node.label), x: 90 + index % 4 * 110, y: 90 + Math.floor(index / 4) * 100, r: 32, color: "#8392a8" })),
      edges: round.canvas.edges.map((edge, index) => ({ id: index, from: nodeIndex.get(String(edge.from)), to: nodeIndex.get(String(edge.to)), color: edge.color || "#8392a8", width: 4, label: edge.label || "" }))
    });
    window.dispatchEvent(new Event("dfs-graph-change"));
    return { diagnosis: round.correctDiagnosis, output: round.buggyOutput };
  });
  await page.locator(`[data-choice-id="${firstCodeCase.diagnosis}"]`).click();
  await page.locator("#reasoning-output").fill(firstCodeCase.output);
  await page.getByRole("button", { name: /Check graph \+ reasoning/ }).click();
  check(await page.locator(".trace-success").count() === 1, "step4: a correct Big Resignation graph, output, and diagnosis did not pass");
  await page.getByRole("button", { name: /Next code case/ }).click();
  check((await page.locator(".trace-input pre").innerText()) !== firstCodeInput, "step4: the next misconception reused the first input");
  await page.reload();
  check((await page.locator(".trace-input pre").innerText()) !== firstCodeInput, "step4: reload forgot the completed first misconception");
  const step4CaseCount = await page.evaluate(() => window.DFS_VISUAL_DATA.problems.find(problem => problem.id === "who-keeps-their-job").codeReasoning.cases.length);
  for (let index = 1; index < step4CaseCount; index++) await page.getByRole("button", { name: /Skip to next question/ }).click();
  check((await page.locator("#challenge").innerText()).includes("Step 4 skipped"), "step4: multiple misconception cases did not finish correctly");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Practice Step 4 again" }).click();
  check((await page.locator(".trace-input pre").innerText()) === firstCodeInput, "step4: restart did not return to the first code case");
  check((await page.locator("#evidence-label").innerText()).toLowerCase().startsWith("0 of "), "step4: restart kept old completion progress");

  await page.goto(`http://127.0.0.1:${port}/keys-and-rooms`);
  await page.evaluate(key => localStorage.removeItem(key), `dfs-visual:keys-and-rooms:v${dataVersion}-coffee-rollout`);
  await page.reload();
  for (let index = 0; index < 9; index++) await page.getByRole("button", { name: /Skip to next question/ }).click();
  check(await page.locator(".victory.has-skips").count() === 1 && (await page.locator(".stamp").textContent()) === "Finished", "skip: fully skipped Step 1 still looks like a mastery win");
  check((await page.locator("#challenge").innerText()).includes("0 passed · 9 skipped"), "skip: Step 1 completion does not clearly separate passed and skipped questions");

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`http://127.0.0.1:${port}/keys-and-rooms`);
  await page.evaluate(key => localStorage.removeItem(key), `dfs-visual:keys-and-rooms:v${dataVersion}-coffee-rollout`);
  await page.reload();
  while (!(await page.locator(".choices, .visual-option-grid").count())) await page.getByRole("button", { name: /Skip to next question/ }).click();
  check(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth), "mobile: Step 1 concept drawing causes horizontal overflow at 320px");
  check(await page.locator("#graph-add-node").isVisible() && !(await page.locator("#graph-add-node").isDisabled()), "mobile: Step 1 concept drawing tool is unusable at 320px");
  check(await page.locator('[data-choice-id]:not([disabled])').count() > 0, "mobile: optional Step 1 concept drawing became mandatory");
  await page.goto(`http://127.0.0.1:${port}/one-color-metro-ride?section=2`);
  check(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth && [...document.querySelectorAll(".graph-toolbar button")].every(button => button.scrollWidth <= button.clientWidth)), "mobile: Step 2 toolbar overflows at 320px");
  check(await page.locator(".counter-output-fields").evaluate(fields => getComputedStyle(fields).gridTemplateColumns.trim().split(/\s+/).length === 1), "mobile: Step 2 output fields do not stack at 320px");
  for (const step of [3, 4]) {
    await page.goto(`http://127.0.0.1:${port}/who-keeps-their-job?section=${step}`);
    await page.evaluate(step => localStorage.removeItem(step === 3 ? "dfs-structure:who-keeps-their-job:v8" : "dfs-reasoning:who-keeps-their-job:v3"), step);
    await page.reload();
    check(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth && document.querySelector(".test-pane").scrollWidth <= document.querySelector(".test-pane").clientWidth), `mobile: Step ${step} overflows at 320px`);
  }
  check(await page.locator(".code-window pre").evaluate(code => code.scrollWidth <= code.clientWidth + 1), "mobile: Step 4 code is horizontally clipped at 320px");

  await browser.close();
  server.close();
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("Rendered and checked Steps 1–4 for all 75 lessons, plus skip, duplicate, and mobile flows.");
})().catch(error => {
  server.close();
  console.error(error);
  process.exit(1);
});
