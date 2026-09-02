(() => {
  const data = window.DFS_VISUAL_DATA;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const categoryNames = { original: "Original", variant: "Variants", new: "New" };
  const colorValues = { slate: "#8392a8", red: "#ff7e82", blue: "#72a7ff", amber: "#f1b75b" };
  const GENERAL_STRUCTURE_CONTRACTS = {
    "all-paths-from-source-to-target": { node: "One node for every adjacency-list index, including sinks.", edge: "For every value j listed in graph[i], add the direct arrow i→j." },
    "course-schedule": { node: "One node for every course ID from 0 through numCourses−1, including isolated courses.", edge: "For each [course, prerequisite] pair, add prerequisite→course." },
    "evaluate-division": { node: "One node for every distinct variable appearing in the equations.", edge: "For a/b=value, add a→b with weight value and b→a with reciprocal weight 1/value." },
    "find-if-path-exists-in-graph": { node: "One node for every vertex ID from 0 through n−1, including isolated vertices.", edge: "Each listed pair [a,b] adds one two-way direct edge a—b." },
    "flatten-nested-list-iterator": { node: "One node for every list container and every integer occurrence, including empty lists.", edge: "Add a direct containment edge from each list to every item immediately inside it." },
    "is-graph-bipartite": { node: "One node for every adjacency-list index, including isolated nodes.", edge: "Each listed neighbor relation adds a direct undirected edge; coloring is checked after the graph is built." },
    "keys-and-rooms": { node: "One node for every room index, including rooms no key can reach.", edge: "If room i directly contains key j, add the arrow i→j." },
    "kill-process": { node: "One node for every process ID in pid.", edge: "For each nonzero ppid entry, add parent-process→child-process." },
    "letter-combinations-of-a-phone-number": { node: "One node for each legal partial string, including the empty starting prefix.", edge: "Append one allowed letter for the next digit to create one child state." },
    "nested-list-weight-sum": { node: "One node for every list container and every integer occurrence, including empty lists.", edge: "Add a direct containment edge from each list to every item immediately inside it." },
    "network-delay-time": { node: "One node for every network node ID from 1 through n, including nodes with no wire.", edge: "Each [source,target,time] entry adds source→target with that time as its edge weight." },
    "number-of-connected-components-in-an-undirected-graph": { node: "One node for every vertex ID from 0 through n−1.", edge: "Each input pair adds one two-way direct edge; do not add path shortcuts." },
    "number-of-provinces": { node: "One node for each matrix row and column index.", edge: "For different cities i and j, a 1 at isConnected[i][j] adds one two-way direct edge; ignore diagonal self-entries." },
    "possible-bipartition": { node: "One node for every person ID from 1 through n, including people absent from dislikes.", edge: "Each dislike pair [a,b] adds one undirected direct edge a—b." },
    "smallest-string-with-swaps": { node: "One node for every string position, carrying that position's current character.", edge: "Each allowed pair [a,b] adds one two-way direct edge between positions a and b." },
    "time-needed-to-inform-all-employees": { node: "One node for every employee ID, including employees whose informTime is 0.", edge: "For every employee with a manager, add manager→direct-report." }
  };
  const characterNames = [
    "Maya", "Theo", "Nia", "Felix", "Aisha", "Jonah", "Lena", "Mateo", "Priya", "Owen",
    "Zara", "Caleb", "Iris", "Miles", "Sofia", "Eli", "Noor", "Jasper", "Amara", "Leo",
    "Layla", "Finn", "Cleo", "Arjun", "Mina", "Ezra", "Rosa", "Kai", "Ada", "Nico",
    "Talia", "Hugo", "Imani", "Remy", "June", "Samir", "Mae", "Dante", "Anya", "Cole",
    "Lila", "Ravi", "Esme", "Beau", "Sana", "Axel", "Mira", "Dean", "Ines", "Jude",
    "Freya", "Zane", "Leila", "Otis", "Aya", "Marco", "Eden", "Rohan", "Nora", "Quinn",
    "Alma", "Kian", "Vera", "Toby", "Elena", "Micah", "Gia", "Ivan", "Mila", "Soren",
    "Dalia", "Max", "Yara", "Louis", "Ari", "Avery", "Brielle", "Cyrus", "Dev", "Elara"
  ];
  const generatedCharacterNames = Array.isArray(window.DFS_CHARACTER_NAMES) && window.DFS_CHARACTER_NAMES.length >= 600 ? window.DFS_CHARACTER_NAMES : characterNames;
  const characterSlots = { 0: 0, 7: 1, 14: 2, 21: 3, 30: 4, 31: 5, 32: 6, 50: 7 };
  const characterName = offset => {
    const uniqueIndex = problemIndex * 8 + (characterSlots[offset] ?? offset % 8);
    return generatedCharacterNames[uniqueIndex % generatedCharacterNames.length];
  };
  const allProblems = data.problems;
  let problem = null;
  let problemIndex = -1;
  let progress = null;
  let counterProgress = null;
  let structureProgress = null;
  let reasoningProgress = null;
  let counterDrawings = { correct: null, mistaken: null };
  let counterDrawingMode = "correct";
  let counterDuplicated = false;
  let counterGraphChangeHandler = null;
  let section = 1;
  let selectedId = null;
  let answered = false;

  function start() {
    if (/^\/visual\/?$/.test(location.pathname)) {
      history.replaceState({}, "", `/${location.search}${location.hash}`);
      return renderPicker();
    }
    const match = location.pathname.match(/^\/visual\/([^/]+)\/?$/) || location.pathname.match(/^\/([^/]+)\/?$/);
    if (!match) return renderPicker();
    let id = decodeURIComponent(match[1]);
    if (["no-transfers-visual", "no-transfers"].includes(id) || new URLSearchParams(location.search).get("visual") === "no-transfers") id = "one-color-metro-ride";
    problemIndex = allProblems.findIndex(item => item.id === id);
    if (problemIndex < 0) return renderPicker("That visual problem was not found. Choose one below.");
    problem = allProblems[problemIndex];
    progress = loadProgress();
    counterProgress = loadCounterProgress();
    structureProgress = loadStructureProgress();
    reasoningProgress = loadReasoningProgress();
    section = [2, 3, 4].includes(Number(new URLSearchParams(location.search).get("section"))) ? Number(new URLSearchParams(location.search).get("section")) : 1;
    renderLessonShell();
    render();
  }

  function renderPicker(notice = "") {
    document.title = "Visual DFS Problem Library";
    document.body.className = "choosing-pair visual-picker-page";
    let savedTheme = "dark";
    try { savedTheme = localStorage.getItem("dfs-theme") || "dark"; } catch {}
    document.documentElement.dataset.theme = savedTheme;
    const picker = $("#pair-picker");
    picker.hidden = false;
    picker.innerHTML = `<button class="theme-toggle" id="visual-theme-toggle" aria-label="Switch theme"><svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg></button>
      <main class="home"><div class="problem-list-topbar"><strong>DFS Visual Proof Library</strong>${notice ? `<span class="picker-message" role="status">${esc(notice)}</span>` : ""}</div><div class="columns">${renderCategoryColumns()}</div></main>`;
    $("#visual-theme-toggle").onclick = () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("dfs-theme", theme); } catch {}
    };
  }

  function renderCategoryColumns() {
    return ["original", "variant", "new"].map(category => {
      const items = sortProblems(allProblems.filter(item => item.category === category));
      return `<section class="col-${category}" aria-labelledby="category-${category}"><div class="column-head"><span class="column-dot"></span><h2 id="category-${category}">${category}</h2><span class="column-count">${items.length}</span></div><div class="card-list">${items.map(item => {
        const complete = isProblemComplete(item);
        return `<a class="card${complete ? " completed" : ""}" href="/${encodeURIComponent(item.id)}"${complete ? ` aria-label="${esc(item.title)}, completed"` : ""}><span class="card-title">${esc(item.title)}</span>${complete ? `<span class="card-check" aria-hidden="true" title="Completed">✓</span>` : ""}</a>`;
      }).join("")}</div></section>`;
    }).join("");
  }

  function isProblemComplete(item) {
    try {
      const reasoning = JSON.parse(localStorage.getItem(`dfs-reasoning:${item.id}:v2`) || "{}");
      return Number(reasoning.index) >= 1;
    } catch {
      return false;
    }
  }

  function sortProblems(items) {
    const rank = { Easy: 0, Medium: 1, Hard: 2 };
    return [...items].sort((a, b) => (rank[a.difficulty] ?? 1) - (rank[b.difficulty] ?? 1) || (a.curriculumOrder ?? 999) - (b.curriculumOrder ?? 999) || a.title.localeCompare(b.title));
  }

  function renderLessonShell() {
    document.title = `${problem.title} · Visual Proof`;
    document.body.className = "visual-route visual-library-route";
    $("#pair-picker").hidden = true;
    $(".topbar").hidden = false;
    $(".workspace").hidden = false;
    $("#mobile-switcher").hidden = false;
    $("#section-nav-btn").onclick = () => switchSection(section === 1 ? 2 : section === 2 ? 3 : section === 3 ? 4 : 3);
    window.onpopstate = () => {
      section = [2, 3, 4].includes(Number(new URLSearchParams(location.search).get("section"))) ? Number(new URLSearchParams(location.search).get("section")) : 1;
      render();
    };
    $(".brand").setAttribute("href", "/");
    $("#current-problem-label").textContent = problem.title;
    $("#problem-title").textContent = problem.title;
    $("#reset-btn").onclick = resetCurrentSection;
    $$(".tab").forEach(tab => { tab.onclick = () => renderProblemTab(tab.dataset.tab); });
    $$("#mobile-switcher button").forEach(button => { button.onclick = () => setMobilePane(button.dataset.pane); });
    renderProblemTab("description");
  }

  function renderProblemTab(name) {
    $$(".tab").forEach(tab => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    let html = `<p>${formatText(problem.statement)}</p>`;
    if (name === "examples") html = problem.examples.map((example, index) => `<article class="example-card"><strong>Example ${index + 1}</strong><div class="io-row"><span>Input</span> ${esc(example.input)}</div><div class="io-row"><span>Output</span> ${esc(example.output)}</div><p>${formatText(example.explanation)}</p></article>`).join("");
    if (name === "constraints") html = `<ul class="constraint-list">${problem.constraints.map(item => `<li>${esc(item)}</li>`).join("")}</ul>${problem.sourceLink ? `<p><a class="source-link" href="${esc(problem.sourceLink)}" target="_blank" rel="noreferrer">Open original problem ↗</a></p>` : ""}`;
    $("#problem-content").innerHTML = html;
  }

  function configureSectionShell() {
    if (counterGraphChangeHandler) window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
    counterGraphChangeHandler = null;
    const activityLayout = $(".activity-layout");
    const graphLab = $("#graph-lab");
    if (activityLayout && graphLab && graphLab.parentElement !== activityLayout) activityLayout.append(graphLab);
    const isCounterexample = section === 2;
    const isStructure = section === 3;
    const isReasoning = section === 4;
    const questionIndex = section === 1 ? progress.index : section === 2 ? counterProgress.index : section === 3 ? structureProgress.index : reasoningProgress.index;
    const questionTotal = section === 1
      ? mainTasks().length
      : section === 2
        ? counterexampleRounds().length
        : section === 3
          ? structureTasks().length
          : reasoningRounds().length;
    $("#next-question-btn").hidden = questionIndex >= questionTotal;
    $("#next-question-btn").onclick = skipCurrentQuestion;
    document.title = `${problem.title} · ${isReasoning ? "Trace Lab" : isStructure ? "Graph Structure" : isCounterexample ? "Counterexample Lab" : "Visual Proof"}`;
    document.body.classList.toggle("counterexample-route", isCounterexample);
    document.body.classList.toggle("structure-route", isStructure);
    document.body.classList.toggle("reasoning-route", isReasoning);
    const graphActions = $("#graph-lab-actions");
    graphActions.hidden = true;
    graphActions.innerHTML = "";
    $("#section-kicker").textContent = isReasoning ? "STEP 4 · TRACE LAB" : isStructure ? "STEP 3 · GRAPH STRUCTURE" : isCounterexample ? "STEP 2 · COUNTEREXAMPLE LAB" : "STEP 1 · VISUAL PROOF";
    $("#section-title").hidden = true;
    $("#section-subtitle").hidden = true;
    $("#evidence-chip").hidden = true;
    $("#section-title").textContent = isReasoning ? "Run the code in your head." : isStructure ? "Test the graph rules." : "Build it. Read it. Prove it.";
    $("#section-subtitle").textContent = isReasoning
      ? "Turn the code into one graph rule, then predict its exact return value."
      : isStructure
      ? "Check three subtle claims, then build the graph."
      : "Answer each question and build exact graphs from fresh inputs.";
    $("#section-nav-btn").innerHTML = isReasoning ? "Back to Step 3 <span>←</span>" : isStructure ? "Next: Step 4 <span>→</span>" : isCounterexample ? "Next: Step 3 <span>→</span>" : "Skip to Step 2 <span>→</span>";
  }

  function switchSection(nextSection) {
    section = nextSection;
    const url = new URL(location.href);
    if (section > 1) url.searchParams.set("section", String(section));
    else url.searchParams.delete("section");
    history.pushState({}, "", url);
    document.body.classList.remove("show-problem");
    setMobilePane("test");
    render();
  }

  function skipCurrentQuestion() {
    if (section === 1) {
      if (!progress.skipped.includes(progress.index)) progress.skipped.push(progress.index);
      progress.index = Math.min(progress.index + 1, mainTasks().length);
      progress.remedialFor = null;
      saveProgress();
    } else if (section === 2) {
      if (!counterProgress.skipped.includes(counterProgress.index)) counterProgress.skipped.push(counterProgress.index);
      counterProgress.index = Math.min(counterProgress.index + 1, counterexampleRounds().length);
      counterProgress.skills = [false, false, false, false];
      saveCounterProgress();
    } else if (section === 3) {
      if (!structureProgress.skipped.includes(structureProgress.index)) structureProgress.skipped.push(structureProgress.index);
      structureProgress.index++;
      saveStructureProgress();
    } else {
      if (!reasoningProgress.skipped.includes(reasoningProgress.index)) reasoningProgress.skipped.push(reasoningProgress.index);
      reasoningProgress.index++;
      reasoningProgress.attempts = 0;
      reasoningProgress.remedial = false;
      saveReasoningProgress();
    }
    render();
  }

  function mainTasks() {
    if (!problem.lesson) return [];
    const builds = problem.lesson.buildTasks.map((task, index) => ({ ...task, kind: "build", buildOrdinal: index + 1 }));
    const concepts = problem.lesson.conceptTasks.map((task, index) => ({ ...task, conceptOrdinal: index + 1 }));
    const patterns = [
      ["b", "b", "c", "b", "c", "b", "c", "c", "c"],
      ["b", "c", "b", "c", "c", "b", "c", "b", "c"],
      ["b", "c", "c", "b", "c", "b", "c", "c", "b"],
      ["b", "b", "c", "c", "b", "c", "c", "b", "c"]
    ];
    let buildIndex = 0, conceptIndex = 0;
    return patterns[problemIndex % patterns.length].map(kind => kind === "b" ? builds[buildIndex++] : concepts[conceptIndex++]);
  }

  function currentTask() {
    const task = mainTasks()[progress.index];
    return progress.remedialFor ? { ...task.remedial, facet: task.facet, kind: "build", remedial: true } : task;
  }

  function render() {
    configureSectionShell();
    if (section === 2) return renderCounterexampleRound();
    if (section === 3) return renderStructureRound();
    if (section === 4) return renderReasoningRound();
    selectedId = null;
    answered = false;
    updateProgress();
    const examplesTab = $('.tab[data-tab="examples"]');
    if (examplesTab) examplesTab.hidden = mainTasks().slice(0, progress.index).filter(task => task.kind === "build").length < 2;
    if (!problem.lesson) return renderMissingLesson();
    if (progress.index >= mainTasks().length) return renderComplete();
    const task = currentTask();
    window.DFS_GRAPH?.setContext(`${problem.id}:${task.id}:${progress.remedialFor || "main"}`, 0);
    window.DFS_GRAPH?.setNodeLabelRule(problem.counterexampleLesson?.nodeLabels?.rule || "free");
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = task.kind === "build" ? "Draw the graph from the raw input" : "Optional: draw this input before answering";
    if (task.kind === "build") renderBuild(task);
    else renderConcept(task);
    $(".test-pane").scrollTop = 0;
  }

  function renderBuild(task) {
    const choices = arrangeChoices(task.decision.choices, task.decision.correct, task.decision.answerSlot);
    const compact = true;
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top"><span class="probe-type">Graph build</span><span class="probe-id">${task.remedial ? "FRESH PROOF REQUIRED" : `BUILD ${task.buildOrdinal} OF 4`}</span></div>`}
      <div class="challenge-body visual-build-question">${compact ? "" : "<h3>Turn this raw input into a graph. Then answer from your finished drawing.</h3>"}<div class="prompt-code">${esc(task.input)}</div>${renderNodeLabelGuide(task)}
      ${compact ? "" : '<p class="drawing-target-note"><b>Your job:</b> Work out the graph model from the problem and input. The correct nodes and edges are not shown.</p><div class="build-rules"><div><span>1</span>Decide what each node represents and label it clearly</div><div><span>2</span>Decide which direct relationships become edges</div><div><span>3</span>Set any direction or edge details the input requires</div></div>'}
      <p class="visual-decision-prompt">${formatText(task.decision.prompt)}</p><div class="visual-answer-row" role="group" aria-label="Choose the result">${choices.map(choice => `<button class="visual-answer" data-choice-id="${esc(choice.id)}" aria-pressed="false">${formatText(choice.label)}</button>`).join("")}</div>
      <div id="feedback-slot" role="status" aria-live="polite"></div><div class="challenge-actions">${compact ? "" : '<span class="microcopy">Your answer counts only when the drawing is exact.</span>'}<button id="visual-check" class="primary-btn" disabled>Check graph + answer <span>→</span></button></div></div>`;
    if (compact) {
      $("#graph-lab-title").textContent = "1 · Draw the graph";
      ($(".node-label-guide") || $(".prompt-code")).after($("#graph-lab"));
      $$('[data-choice-id]').forEach(button => { button.disabled = true; });
      counterGraphChangeHandler = () => {
        const started = Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-choice-id]').forEach(button => { button.disabled = !started; });
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
    }
    $$('[data-choice-id]').forEach(button => { button.onclick = () => selectChoice(button.dataset.choiceId, "#visual-check"); });
    $("#visual-check").onclick = () => checkBuild(task);
    focusPrompt();
  }

  function renderNodeLabelGuide(task) {
    const format = problem.graphRules?.nodeLabelFormat;
    if (!format?.instruction) return "";
    return `<div class="node-label-guide"><b>Required node-name format:</b> ${formatText(format.instruction)}</div>`;
  }

  function checkBuild(task) {
    if (!selectedId || answered) return;
    const result = gradeCanvas(task.canvas, window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false });
    const answerCorrect = selectedId === task.decision.correct;
    const checks = [
      ["Every exact node label, with no missing or extra node", result.nodes],
      [result.nodes ? "Every exact direct edge, with no missing or extra edge" : "Edge check waits until the node names are correct", result.nodes ? result.edges : null],
      [task.canvas.directed ? "Edges use the required arrow direction" : "Edges use the required two-way direction", result.direction],
      [result.nodes ? "Edge colors match the input" : "Edge colors check waits until the node names are correct", result.nodes ? result.colors : null],
      [result.nodes ? "Edge labels or weights match the input" : "Edge labels or weights check waits until the node names are correct", result.nodes ? result.labels : null],
      ["The decision matches the finished picture", answerCorrect]
    ].filter(([label]) => !label.startsWith("Edge colors") || task.canvas.edges.some(edge => edge.color)).filter(([label]) => !label.startsWith("Edge labels") || task.canvas.edges.some(edge => edge.label));
    const correct = checks.every(([, pass]) => pass);
    if (!correct) {
      progress.mistakes++;
      saveProgress();
      updateProgress();
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>Not exact yet.</b> Recheck the problem and input. The correct model stays hidden.<ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass == null ? "waiting" : pass ? "passed" : "failed"}"><span>${pass == null ? "•" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul></div>`;
      $("#visual-check").innerHTML = "Check revised proof <span>→</span>";
      return;
    }
    answered = true;
    $("#feedback-slot").innerHTML = `<div class="feedback good"><b>Exact visual proof.</b><ul class="feedback-checklist">${checks.map(([label]) => `<li class="passed"><span>✓</span>${esc(label)}</li>`).join("")}</ul><div class="feedback-why"><b>Why:</b> ${formatText(task.why)}</div></div>`;
    makeContinueButton();
  }

  function usesGridCellLabels() {
    return problem.visualKind === "grid" || problem.id === "kattis-getting-gold";
  }

  function gridGraphScheme() {
    if (!usesGridCellLabels()) return "";
    return `<div class="feedback-scheme"><b>Use this graph model</b><p>Other graph models can be valid, but this checker expects this one.</p><dl><div><dt>Nodes</dt><dd>${formatText(problem.graphRules.nodes)}</dd></div><div><dt>Edges</dt><dd>${formatText(problem.graphRules.edges)}</dd></div><div><dt>Labels</dt><dd>Use only row and column numbers. Rows and columns start at 0. Both <code>(0,2)</code> and <code>0,2</code> work. Do not include the cell value.</dd></div></dl></div>`;
  }

  function renderConcept(task) {
    const choices = arrangeChoices(task.choices, task.correct, task.answerSlot);
    const shown = task.shownModel ? `<div class="shown-graph"><span class="visual-graph-label">Picture under review</span>${miniGraph(task.shownModel, task.input)}</div>` : "";
    const choiceHtml = task.kind === "visual-options"
      ? `<div class="visual-option-grid">${choices.map(choice => `<button class="visual-option" data-choice-id="${esc(choice.id)}" aria-pressed="false"><span>${formatText(choice.label)}</span>${miniGraph(choice.model, task.input)}</button>`).join("")}</div>`
      : `<div class="choices">${choices.map((choice, index) => `<button class="choice" data-choice-id="${esc(choice.id)}" aria-pressed="false"><span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${formatText(choice.label)}</span></button>`).join("")}</div>`;
    const compact = true;
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top"><span class="probe-type">${esc(task.title)}</span><span class="probe-id">VISUAL CHECK ${task.conceptOrdinal} OF 5</span></div>`}<div class="challenge-body"><div class="prompt-code">${esc(task.input)}</div>${renderNodeLabelGuide(task)}<h3>${formatText(task.prompt)}</h3>${shown}${choiceHtml}<div id="feedback-slot" role="status" aria-live="polite"></div><div class="challenge-actions">${compact ? "" : '<span class="microcopy">Every choice represents a mistake a real student might make.</span>'}<button id="visual-check" class="primary-btn" disabled>Check answer <span>→</span></button></div></div>`;
    ($(".node-label-guide") || $(".prompt-code")).after($("#graph-lab"));
    $$('[data-choice-id]').forEach(button => { button.onclick = () => selectChoice(button.dataset.choiceId, "#visual-check"); });
    $("#visual-check").onclick = () => checkConcept(task);
    focusPrompt();
  }

  function checkConcept(task) {
    if (!selectedId || answered) return;
    const choice = task.choices.find(item => item.id === selectedId);
    answered = true;
    if (selectedId === task.correct) {
      $("#feedback-slot").innerHTML = `<div class="feedback good"><b>Picture read correctly.</b><div class="feedback-why"><b>Why:</b> ${formatText(task.why)}</div></div>`;
      return makeContinueButton();
    }
    progress.mistakes++;
    progress.remedialFor = task.id;
    saveProgress();
    updateProgress();
    const correct = task.choices.find(item => item.id === task.correct);
    $("#feedback-slot").innerHTML = `<div class="feedback"><b>Contradiction found.</b><div class="feedback-answer correct"><span>Correct choice</span>${formatText(correct.label)}</div><div class="feedback-why"><b>Your choice:</b> ${formatText(choice.feedback)}</div><div class="feedback-next">This revealed answer does not count. Prove the idea on a fresh blank graph.</div></div>`;
    const button = $("#visual-check");
    button.disabled = false;
    button.innerHTML = "Build a fresh proof <span>→</span>";
    button.onclick = render;
  }

  function makeContinueButton() {
    const button = $("#visual-check");
    button.disabled = false;
    button.innerHTML = progress.index === 8 ? "Finish visual proof <span>→</span>" : "Next visual check <span>→</span>";
    button.onclick = () => {
      progress.index++;
      progress.remedialFor = null;
      saveProgress();
      render();
    };
  }

  function selectChoice(id, buttonSelector) {
    if (answered) return;
    selectedId = id;
    $$('[data-choice-id]').forEach(button => {
      const chosen = button.dataset.choiceId === id;
      button.classList.toggle("selected", chosen);
      button.setAttribute("aria-pressed", String(chosen));
    });
    $(buttonSelector).disabled = false;
  }

  function arrangeChoices(choices, correctId, desiredSlot = 0) {
    const correct = choices.find(choice => choice.id === correctId);
    const wrong = choices.filter(choice => choice.id !== correctId);
    wrong.splice(Math.min(desiredSlot, choices.length - 1), 0, correct);
    return wrong;
  }

  function stableChoiceSlot(text, count) {
    let hash = 2166136261;
    for (const char of String(text)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash) % Math.max(count, 1);
  }

  function counterexampleRounds() {
    if (problem.counterexampleLesson?.rounds?.length) return problem.counterexampleLesson.rounds;
    if (problem.id === "one-color-metro-ride") return [
      { bugs: ["ignore-colors"], level: "Transfer trap" },
      { bugs: ["red-only"], level: "Wrong-line trap" },
      { bugs: ["first-branch"], level: "Route-branch trap" }
    ];
    const directed = counterexampleDirected();
    const edgeRule = problem.graphRules.edges.toLowerCase();
    const grid = problem.visualKind === "grid" || problem.id === "kattis-getting-gold";
    const allowsDiagonals = /diagonal|eight|8[\s-]*direction|side or (?:a )?corner|touch(?:ing|es)?.*corner/.test(edgeRule) && !/never|not|only side|four/.test(edgeRule);
    const baseBug = grid
      ? (allowsDiagonals ? "remove-diagonals" : "add-diagonals")
      : (directed ? "make-two-way" : "make-one-way");
    const structuralChoices = grid
      ? [baseBug, "drop-last-edge", baseBug]
      : directed
        ? [baseBug, "reverse-arrows", "drop-last-edge"]
        : [baseBug, "skip-leaf-edges", "drop-last-edge"];
    const searchChoices = ["shallow-search", "last-branch", "wrong-start"];
    const structuralBug = structuralChoices[problemIndex % structuralChoices.length];
    const searchBug = searchChoices[Math.floor(problemIndex / 3) % searchChoices.length];
    const thirdChoices = ["first-branch", "wrong-start", "last-branch", "drop-last-edge"];
    let thirdBug = thirdChoices[problemIndex % thirdChoices.length];
    if (thirdBug === structuralBug || thirdBug === searchBug) thirdBug = "first-branch";
    return [
      { bugs: [structuralBug], level: roundLevel(structuralBug) },
      { bugs: [searchBug], level: roundLevel(searchBug) },
      { bugs: [thirdBug], level: roundLevel(thirdBug) }
    ];
  }

  function roundLevel(bug) {
    return ({
      "make-one-way": "Direction trap", "make-two-way": "Direction trap", "reverse-arrows": "Reversal trap",
      "add-diagonals": "Neighbor-rule trap", "remove-diagonals": "Missing-move trap", "drop-last-edge": "Missing-link trap",
      "skip-leaf-edges": "Leaf trap", "shallow-search": "Depth trap", "first-branch": "First-branch trap",
      "last-branch": "Last-branch trap", "wrong-start": "Wrong-start trap"
    })[bug] || "Graph-rule contradiction";
  }

  function counterexampleDirected() {
    if (problem.visualKind !== "grid") return problem.lesson.buildTasks[0].canvas.directed;
    return /strictly larger|one-way|arrow|from .+ to/i.test(problem.graphRules.edges);
  }

  function bugDescription(bug) {
    const noun = problem.visualKind === "grid" ? "squares" : problem.visualKind === "tree" ? "tree nodes" : problem.visualKind === "nested" ? "nested items" : problem.visualKind === "backtracking" ? "choices" : problem.visualKind === "state" ? "states" : "nodes";
    const chosenThing = problem.counterexampleLesson?.vocabulary?.startNode || "chosen node";
    const variants = {
      "make-one-way": ["turns every two-way connection into a one-way arrow", "allows each two-way link to work only in its written order", "mistakes undirected links for arrows"],
      "make-two-way": ["turns every arrow into a two-way connection", "walks backward across arrows that only point forward", "forgets that the listed connections have a direction"],
      "reverse-arrows": ["reverses every arrow before searching", "reads every from/to relationship backward", "builds all directed connections in the opposite direction"],
      "add-diagonals": ["adds diagonal moves that the real graph does not have", "treats corner-touching squares as direct neighbors", "allows diagonal steps even though only side moves are legal"],
      "remove-diagonals": ["removes legal diagonal connections", "keeps only side moves and loses corner neighbors", "forgets that diagonal neighbors are allowed"],
      "drop-last-edge": ["stops reading one relation too early and drops the final edge", "builds every listed connection except the last one", "accidentally leaves the final direct link out of the graph"],
      "skip-leaf-edges": [`drops every connection touching a degree-one ${noun.slice(0, -1)}`, "erases the outer leaves before searching", "keeps the middle of the graph but disconnects every leaf"],
      "shallow-search": [`visits only the start and its direct neighboring ${noun}`, "stops after one hop instead of continuing", "never explores beyond the start's immediate neighbors"],
      "first-branch": ["follows only the first available branch and never comes back", "chooses the first route and forgets the other branches", "stops the whole search when its first branch ends"],
      "last-branch": ["follows only the last available branch and ignores earlier choices", "chooses the final listed route and never returns", "keeps only the last branch it sees"],
      "wrong-start": [`uses the wrong ${chosenThing}`, `ignores the chosen ${chosenThing} and uses a different one`, `runs the search from a different ${chosenThing}`],
      "ignore-colors": ["erases track colors, so the search can illegally transfer between red and blue"],
      "red-only": ["checks red routes but completely forgets that an all-blue route is also allowed"]
    };
    const choices = variants[bug] || ["uses a different graph rule"];
    return choices[problemIndex % choices.length];
  }

  function renderCounterexampleRound() {
    const rounds = counterexampleRounds();
    const total = rounds.length;
    const done = Math.min(counterProgress.index, total);
    updateCounterProgress(done, total);
    if (done >= total) return renderCounterexampleComplete();

    const round = rounds[done];
    const name = characterName(done * 7);
    const descriptions = round.bugs.map(bugDescription);
    const coffeeProblem = problem.id === "routes-past-the-coffee-cart";
    const inputSpec = counterInputSpec();
    const dualDrawings = usesDualCounterDrawings();
    counterDrawings = { correct: null, mistaken: null };
    counterDrawingMode = "correct";
    counterDuplicated = false;
    window.DFS_GRAPH?.setNodeLabelRule(problem.counterexampleLesson?.nodeLabels?.rule || "free");
    window.DFS_GRAPH?.setContext(`${problem.id}:counterexample:${done}:${round.bugs[0]}:correct`, 0);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = "Drawing 1 of 2: Correct graph";
    $("#graph-direction-label").textContent = "Directed edges";
    $("#challenge").innerHTML = `<div class="challenge-body counterexample-case">
        <div class="case-person"><span class="case-avatar" aria-hidden="true">${esc(name[0])}</span><div><h3>${esc(name)}'s broken search</h3></div></div>
        <div class="case-mistake">${descriptions.map(description => `<p>${esc(name)} ${esc(description)}.</p>`).join("")}</div>
        <p class="drawing-target-note counter-main-goal"><b>Your main goal:</b> Expose ${esc(name)}'s mistake. Draw two graphs: first the correct graph, then ${esc(name)}'s graph using the mistake.${coffeeProblem ? " Color the coffee-cart intersection <b>Amber</b> in both." : ""}${["first-branch", "last-branch", "drop-last-edge"].includes(round.bugs[0]) ? " Edge numbers show drawing order." : ""}</p>
        <div class="counter-predictions">
          <label class="counter-field counter-input-field"><span>${esc(inputSpec.prompt)} <small>${esc(inputSpec.name)}</small></span><input id="counter-start" autocomplete="off" placeholder="Example: ${esc(roundSuggestedStart(round))}"${problem.counterexampleLesson.fixedStart ? ` value="${esc(problem.counterexampleLesson.fixedStart)}" readonly` : ""}></label>
          <section class="counter-output-section" aria-labelledby="counter-output-heading">
            <h4 id="counter-output-heading">Output</h4>
            <div class="counter-output-fields">
              <label class="counter-field"><span>Correct output</span><input id="counter-real-output" autocomplete="off" disabled></label>
              <label class="counter-field"><span>${esc(name)}’s output</span><input id="counter-bug-output" autocomplete="off" disabled></label>
            </div>
          </section>
        </div>
        <div id="feedback-slot" role="status" aria-live="polite"></div>
        <div class="challenge-actions"><button id="counter-check" class="primary-btn" disabled>Check my graph <span>→</span></button></div>
      </div>`;
    $(".counter-predictions").after($("#graph-lab"));
    const predictionFields = [$("#counter-real-output"), $("#counter-bug-output")].filter(Boolean);
    const requiredFields = [$("#counter-start"), ...predictionFields].filter(Boolean);
    const updateButton = () => { $("#counter-check").disabled = requiredFields.some(field => !field.value.trim()); };
    predictionFields.forEach(field => field.addEventListener("input", updateButton));
    $("#counter-start").addEventListener("input", () => { syncCounterDrawingFlow(name); updateCounterDrawingTitle(name, round); updateButton(); });
    $("#counter-check").onclick = () => checkCounterexample(round);
    if (counterGraphChangeHandler) window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
    counterGraphChangeHandler = () => syncCounterDrawingFlow(name);
    window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
    if (dualDrawings) renderCounterDrawingTabs(name, done);
    updateCounterDrawingTitle(name, round);
    focusPrompt();
    $(".test-pane").scrollTop = 0;
  }

  function counterInputSpec() {
    return problem.counterexampleLesson?.input || {
      name: problem.counterexampleLesson?.vocabulary?.startNode || "start node",
      prompt: `Choose the ${problem.counterexampleLesson?.vocabulary?.startNode || "start node"}`,
      result: "reached-nodes",
      resultLabel: "reachable set"
    };
  }

  function chosenCounterStart(round) {
    return String($("#counter-start")?.value || problem.counterexampleLesson.fixedStart || "").trim();
  }

  function roundSuggestedStart(round) {
    return String(problem.counterexampleLesson.fixedStart || roundStart(round));
  }

  function updateCounterDrawingTitle(name, round) {
    $("#graph-lab-title").textContent = counterDrawingMode === "correct"
      ? `Drawing 1 of 2: Correct graph · ${counterStartTitle(round, false)}`
      : `Drawing 2 of 2: ${name}'s graph · ${counterStartTitle(round, true)}`;
  }

  function counterStartSubject() {
    const value = String(counterInputSpec().name || "chosen node").trim();
    return value ? value[0].toUpperCase() + value.slice(1) : "Chosen node";
  }

  function counterStartTitle(round, mistaken) {
    const subject = counterStartSubject();
    if (mistaken && round.bugs.includes("wrong-start")) return `Wrong ${subject.toLowerCase()}: ${round.mistakenStartLabel}`;
    const start = chosenCounterStart(round);
    return start ? `${subject}: ${start}` : `Choose ${subject.toLowerCase()}`;
  }

  function usesDualCounterDrawings() {
    return true;
  }

  function personDrawingChanges(bugs) {
    return bugs.some(bug => ["make-one-way", "make-two-way", "reverse-arrows", "add-diagonals", "remove-diagonals", "drop-last-edge", "skip-leaf-edges", "ignore-colors", "red-only"].includes(bug));
  }

  function renderCounterDrawingTabs(name, roundIndex) {
    const actions = $("#graph-lab-actions");
    actions.hidden = false;
    actions.innerHTML = `<button class="graph-tool ${counterDrawingMode === "correct" ? "active" : ""}" data-counter-drawing="correct" aria-pressed="${counterDrawingMode === "correct"}">1 · Correct graph</button><button class="graph-tool ${counterDrawingMode === "mistaken" ? "active" : ""}" data-counter-drawing="mistaken" aria-pressed="${counterDrawingMode === "mistaken"}">2 · ${esc(name)}'s graph</button>${counterDrawingMode === "mistaken" ? `<button id="counter-duplicate-graph" class="graph-tool counter-duplicate-graph" type="button">${counterDuplicated ? "Graph #1 duplicated" : "Duplicate graph from #1"}</button>` : ""}`;
    $$('[data-counter-drawing]', actions).forEach(button => {
      button.onclick = () => {
        const nextMode = button.dataset.counterDrawing;
        if (nextMode === counterDrawingMode) return;
        counterDrawings[counterDrawingMode] = window.DFS_GRAPH?.getSnapshot() || null;
        counterDrawingMode = nextMode;
        const round = counterexampleRounds()[roundIndex];
        window.DFS_GRAPH?.setContext(`${problem.id}:counterexample:${roundIndex}:${round.bugs[0]}:${nextMode}`, 0);
        window.DFS_GRAPH?.setSnapshot(counterDrawings[nextMode]);
        const mistakenLabel = round.bugs.includes("wrong-start") ? "same graph · different start" : personDrawingChanges(round.bugs) ? "mistaken graph" : "graph (same structure)";
        $("#graph-lab-title").textContent = nextMode === "correct" ? `Drawing 1 of 2: Correct graph · ${counterStartTitle(round, false)}` : `Drawing 2 of 2: ${name}'s ${mistakenLabel} · ${counterStartTitle(round, true)}`;
        renderCounterDrawingTabs(name, roundIndex);
        queueMicrotask(() => $(`[data-counter-drawing="${nextMode}"]`)?.focus());
      };
    });
    const duplicateButton = $("#counter-duplicate-graph");
    if (duplicateButton) {
      const mistakenHasWork = counterDrawingHasWork(counterDrawings.mistaken);
      duplicateButton.disabled = counterDuplicated || !counterDrawings.correct?.nodes?.length || mistakenHasWork;
      if (mistakenHasWork && !counterDuplicated) duplicateButton.title = "Clear graph #2 to duplicate graph #1.";
      duplicateButton.onclick = () => {
        const graphTwoHasWork = counterDrawingHasWork(counterDrawings.mistaken);
        if (!counterDrawings.correct?.nodes?.length || graphTwoHasWork) return;
        window.DFS_GRAPH?.setSnapshot(counterDrawings.correct);
        counterDrawings.mistaken = window.DFS_GRAPH?.getSnapshot() || null;
        counterDuplicated = true;
        duplicateButton.textContent = "Graph #1 duplicated";
        duplicateButton.disabled = true;
        const status = $("#graph-status");
        if (status) status.textContent = "Graph #1 copied into graph #2.";
        syncCounterDrawingFlow(name);
        queueMicrotask(() => $('[data-counter-drawing="mistaken"]')?.focus());
      };
    }
    syncCounterDrawingFlow(name);
  }

  function syncCounterDrawingFlow(name) {
    const snapshot = window.DFS_GRAPH?.getSnapshot();
    if (snapshot) counterDrawings[counterDrawingMode] = snapshot;
    const hasCorrect = Boolean(counterDrawings.correct?.nodes?.length);
    const hasMistaken = Boolean(counterDrawings.mistaken?.nodes?.length);
    const unlocked = hasCorrect && hasMistaken && Boolean($("#counter-start")?.value.trim());
    [$("#counter-real-output"), $("#counter-bug-output")].filter(Boolean).forEach(input => { input.disabled = !unlocked; });
    const duplicateButton = $("#counter-duplicate-graph");
    if (duplicateButton && !counterDuplicated) {
      const mistakenHasWork = counterDrawingHasWork(counterDrawings.mistaken);
      duplicateButton.disabled = !hasCorrect || mistakenHasWork;
      duplicateButton.title = mistakenHasWork ? "Clear graph #2 to duplicate graph #1." : "";
    }
  }

  function counterDrawingHasWork(drawing) {
    return Boolean(drawing?.nodes?.length || drawing?.edges?.length || drawing?.directed);
  }

  function roundStart(round) {
    return String(round.startLabel);
  }

  function parseCounterDrawing(drawing, round, chosenStart) {
    try {
      if (!drawing || drawing.nodes.length < (problem.counterexampleLesson.minNodes || 1) || drawing.nodes.length > 8) throw new Error(problem.counterexampleLesson.minNodes ? `Draw at least ${problem.counterexampleLesson.minNodes} nodes.` : "Draw 1–8 nodes.");
      const requiredDirection = counterexampleDirected();
      if (drawing.directed !== requiredDirection) throw new Error(requiredDirection ? "Turn on directed arrows." : "Use two-way edges.");
      const labelRule = problem.counterexampleLesson?.nodeLabels?.rule || "free";
      const normalizeLabel = label => {
        const trimmed = String(label).trim();
        if (!["coordinate", "interior-coordinate", "state-pair"].includes(labelRule)) return trimmed;
        const pair = coordinate(trimmed);
        return pair ? `(${pair[0]},${pair[1]})` : trimmed;
      };
      const rawLabels = drawing.nodes.map(node => normalizeLabel(node.label));
      if (rawLabels.some(label => !label) || new Set(rawLabels).size !== rawLabels.length) throw new Error("Every node needs a unique label.");
      const nodes = [...rawLabels].sort((one, two) => one.localeCompare(two, undefined, { numeric: true }));
      const start = normalizeLabel(chosenStart || "");
      if (!start) throw new Error(`Choose the ${counterInputSpec().name}.`);
      if (!nodes.includes(start)) throw new Error(`Draw the chosen ${counterInputSpec().name}: ${start}.`);
      if (round.bugs.includes("wrong-start")) {
        const mistakenStart = normalizeLabel(round.mistakenStartLabel);
        if (start === mistakenStart) throw new Error(`Choose a ${counterInputSpec().name} different from the broken search's ${mistakenStart}.`);
        if (!nodes.includes(mistakenStart)) throw new Error(`Also draw ${mistakenStart}, the wrong ${counterInputSpec().name} used by the broken search.`);
      }
      validateCounterNodeLabels(nodes);
      if (problem.id === "routes-past-the-coffee-cart" && (nodes.some(label => !/^\d+$/.test(label)) || nodes.some((label, index) => label !== String(index)))) throw new Error("Coffee intersection IDs must start at 0 with no gaps.");
      const byId = Object.fromEntries(drawing.nodes.map(node => [String(node.id), normalizeLabel(node.label)]));
      const coloredMetro = problem.id === "one-color-metro-ride";
      const edges = drawing.edges.map(edge => {
        const color = coloredMetro ? semanticColor(edge.color) : "";
        if (coloredMetro && !["red", "blue"].includes(color)) throw new Error("Color every metro edge Red or Blue.");
        return [byId[String(edge.from)], byId[String(edge.to)], color];
      });
      const graph = { directed: requiredDirection, nodes, edges, start, firstNode: rawLabels[0] };
      if (problem.id === "routes-past-the-coffee-cart") {
        const coffeeNodes = drawing.nodes.filter(node => semanticColor(node.color) === "amber");
        if (coffeeNodes.length !== 1) throw new Error("Color exactly one node Amber to mark the coffee cart.");
        graph.checkpoint = normalizeLabel(coffeeNodes[0].label);
      }
      validateProblemGraphShape(graph);
      return { graph };
    } catch (error) {
      return { error: error.message || "Check the correct graph." };
    }
  }

  function validateCounterNodeLabels(nodes) {
    const rule = problem.counterexampleLesson?.nodeLabels?.rule || "free";
    const numeric = nodes.map(Number);
    if (rule === "contiguous-zero" && nodes.some((node, index) => node !== String(index))) throw new Error("Use numeric IDs 0, 1, 2, ... with no gaps.");
    if (rule === "contiguous-one" && nodes.some((node, index) => node !== String(index + 1))) throw new Error("Use numeric IDs 1, 2, 3, ... with no gaps.");
    if (rule === "positive-integer" && nodes.some(node => !/^[1-9]\d*$/.test(node))) throw new Error("Use positive integer IDs, like 1, 3, or 10.");
    if (["coordinate", "state-pair", "interior-coordinate"].includes(rule) && nodes.some(node => !/^\(\d+,\d+\)$/.test(node))) throw new Error(rule === "state-pair" ? "Use nonnegative jug states like (0,0)." : "Use grid coordinates like (0,0) or 0,0.");
    if (rule === "interior-coordinate" && nodes.some(node => coordinate(node).some(value => value < 1))) throw new Error("This board has a wall border. Use interior coordinates starting at (1,1).");
    if (rule === "identifier" && nodes.some(node => !/^[a-z0-9]{1,5}$/.test(node))) throw new Error("Use lowercase variables with 1 to 5 letters or digits, like a, 1a, or rate1.");
    if (rule === "nested-path" && (!nodes.includes("root") || nodes.some(node => !/^root(?:\[(?:0|[1-9]\d*)\])*$/.test(node)))) throw new Error("Use root, root[0], root[1], ... to name nested input items.");
    if (rule === "tree-path" && (!nodes.includes("root") || nodes.some(node => node !== "root" && !/^[LR]+$/.test(node)))) throw new Error("Use root, L, R, LL, LR, ... to name tree positions.");
    if (rule === "partial-string" && (!nodes.includes("ε") || nodes.some(node => node !== "ε" && !/^[a-z]+$/.test(node)))) throw new Error("Use ε for the empty root, then lowercase partial strings like a or ab.");
    const max = problem.counterexampleLesson?.nodeLabels?.max;
    if (max !== undefined && nodes.some(node => {
      if (["coordinate", "interior-coordinate", "state-pair"].includes(rule)) return coordinate(node).some(value => value > max);
      return Number(node) > max;
    })) throw new Error(`Node labels in this problem cannot be larger than ${max}.`);
  }

  function coffeeNodeLabel(drawing) {
    const nodes = drawing?.nodes?.filter(node => semanticColor(node.color) === "amber") || [];
    return nodes.length === 1 ? String(nodes[0].label).trim() : null;
  }

  function validateProblemGraphShape(graph) {
    if (problem.visualKind === "grid" || problem.id === "kattis-getting-gold") {
      const rule = problem.graphRules.edges.toLowerCase();
      const allowsDiagonals = /diagonal|eight|8[\s-]*direction|side or (?:a )?corner|touch(?:ing|es)?.*corner/.test(rule) && !/never|not|only side|four/.test(rule);
      for (const [from, to] of graph.edges) {
        const one = coordinate(from), two = coordinate(to);
        const rowGap = Math.abs(one[0] - two[0]), columnGap = Math.abs(one[1] - two[1]);
        const legalNeighbor = allowsDiagonals ? Math.max(rowGap, columnGap) === 1 : rowGap + columnGap === 1;
        if (!legalNeighbor) throw new Error(`${from} and ${to} are not direct neighbors under this problem's movement rule.`);
      }
    }
    const labelRule = problem.counterexampleLesson?.nodeLabels?.rule;
    if (labelRule === "nested-path") {
      const parent = label => label.replace(/\[\d+\]$/, "") || "root";
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) if (node !== "root") {
        const directParent = parent(node);
        if (!graph.nodes.includes(directParent)) throw new Error(`${node} needs its parent ${directParent}.`);
        if (!edgeKeys.has(`${directParent}\u0000${node}`)) throw new Error(`Connect ${directParent} directly to ${node}.`);
      }
      const childIndexes = new Map();
      for (const node of graph.nodes) if (node !== "root") {
        const match = node.match(/^(.*)\[(\d+)\]$/), indexes = childIndexes.get(match[1]) || [];
        indexes.push(Number(match[2])); childIndexes.set(match[1], indexes);
      }
      for (const indexes of childIndexes.values()) {
        indexes.sort((a, b) => a - b);
        if (indexes.some((value, index) => value !== index)) throw new Error("Nested child indexes must start at 0 with no gaps.");
      }
    }
    if (labelRule === "tree-path") {
      const parent = label => label.length === 1 ? "root" : label.slice(0, -1);
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) if (node !== "root") {
        const directParent = parent(node);
        if (!graph.nodes.includes(directParent)) throw new Error(`${node} needs its parent ${directParent}.`);
        if (!edgeKeys.has(`${directParent}\u0000${node}`)) throw new Error(`Connect ${directParent} directly to ${node}.`);
      }
      if (problem.id === "evaluate-boolean-binary-tree") for (const node of graph.nodes) {
        const children = [node === "root" ? "L" : `${node}L`, node === "root" ? "R" : `${node}R`].filter(child => graph.nodes.includes(child)).length;
        if (children === 1) throw new Error("A Boolean operator node needs both a left and a right child.");
      }
    }
    if (labelRule === "partial-string") {
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) if (node !== "ε") {
        const directParent = node.length === 1 ? "ε" : node.slice(0, -1);
        if (!graph.nodes.includes(directParent)) throw new Error(`${node} needs its prefix ${directParent}.`);
        if (!edgeKeys.has(`${directParent}\u0000${node}`)) throw new Error(`Connect ${directParent} directly to ${node}.`);
      }
      const limit = problem.id === "runes-on-the-castle-door" ? 6 : 4;
      if (graph.nodes.some(node => node !== "ε" && (node.length > limit || (problem.id === "runes-on-the-castle-door" && /(.)\1/.test(node))))) throw new Error(problem.id === "runes-on-the-castle-door" ? "Rune strings use at most 6 letters and cannot repeat a neighboring rune." : "Phone-number prefixes use at most 4 letters.");
    }
    if (problem.counterexampleLesson?.startRule === "graph-root") {
      const incoming = Object.fromEntries(graph.nodes.map(node => [node, 0]));
      graph.edges.forEach(([, to]) => incoming[to]++);
      if (incoming[graph.start] !== 0) throw new Error(`The chosen ${counterInputSpec().name} must be the graph root.`);
    }
    if (["all-paths-from-source-to-target", "count-routes-to-summit", "routes-past-the-coffee-cart"].includes(problem.id)) {
      const adjacency = Object.fromEntries(graph.nodes.map(node => [node, []]));
      graph.edges.forEach(([from, to]) => adjacency[from].push(to));
      const visiting = new Set(), done = new Set();
      const cyclic = node => { if (visiting.has(node)) return true; if (done.has(node)) return false; visiting.add(node); if (adjacency[node].some(cyclic)) return true; visiting.delete(node); done.add(node); return false; };
      if (graph.nodes.some(cyclic)) throw new Error("This problem's input must be a DAG, so it cannot contain a directed cycle.");
    }
    if (problem.id === "routes-past-the-coffee-cart" && [graph.nodes[0], graph.nodes.at(-1)].includes(graph.checkpoint)) throw new Error("The coffee cart must be an interior intersection, not node 0 or the last node.");
    if (!counterexampleRequiresTree() || graph.nodes.length <= 1) return;
    if (graph.edges.length !== graph.nodes.length - 1) throw new Error("This problem's input must form one tree: use exactly one fewer edge than nodes.");
    const neighbors = Object.fromEntries(graph.nodes.map(node => [node, []]));
    const incoming = Object.fromEntries(graph.nodes.map(node => [node, 0]));
    for (const [from, to] of graph.edges) { neighbors[from].push(to); neighbors[to].push(from); incoming[to]++; }
    const seen = new Set([graph.nodes[0]]), stack = [graph.nodes[0]];
    while (stack.length) for (const next of neighbors[stack.pop()]) if (!seen.has(next)) { seen.add(next); stack.push(next); }
    if (seen.size !== graph.nodes.length) throw new Error("This problem's input must form one connected tree.");
    if (graph.directed && Object.values(incoming).filter(count => count === 0).length !== 1) throw new Error("A directed tree needs exactly one root with no incoming edge.");
    if (graph.directed && Object.values(incoming).some(count => count > 1)) throw new Error("Each child in this tree can have only one parent.");
  }

  function counterexampleRequiresTree() {
    return new Set(["kill-process", "time-needed-to-inform-all-employees", "who-keeps-their-job", "save-the-date-phone-chain", "shut-the-garden-valve", "evaluate-boolean-binary-tree", "structy-max-root-to-leaf-path-sum", "path-sum", "structy-tree-sum", "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "gold-and-silver-lights", "flatten-nested-list-iterator", "nested-list-weight-sum", "nested-list-weight-sum-ii", "busiest-shelf-level", "coins-on-level-k", "kth-song-in-playlist", "top-of-the-pile", "codewars-array-deep-count", "minimum-fuel-cost-to-report-to-the-capital", "minimum-time-to-collect-all-apples-in-a-tree", "count-good-nodes-in-binary-tree", "diameter-of-binary-tree", "lowest-common-ancestor-of-a-binary-tree", "binary-tree-level-order-traversal", "invert-binary-tree", "same-tree", "subtree-of-another-tree", "balanced-binary-tree", "maximum-depth-of-binary-tree", "merge-two-binary-trees", "binary-tree-right-side-view", "validate-binary-search-tree", "kth-smallest-element-in-a-bst", "construct-binary-tree-from-preorder-and-inorder-traversal", "serialize-and-deserialize-binary-tree", "all-paths-from-source-lead-to-destination", "employee-importance", "usaco-milk-factory"]).has(problem.id);
  }

  function expectedCanvas(graph) {
    return {
      directed: graph.directed,
      nodes: graph.nodes.map(label => ({ id: label, label })),
      edges: graph.edges.map(([from, to, color]) => ({ from, to, ...(color ? { color } : {}) }))
    };
  }

  function runSearch(graph, bugs = [], startOverride = null) {
    const searchGraph = mistakenGraph(graph, bugs, startOverride);
    const directed = searchGraph.directed;
    let edges = searchGraph.edges;
    if (problem.id === "one-color-metro-ride") {
      if (bugs.includes("ignore-colors") || bugs.includes("red-only")) {
        const visited = traverseGraph(searchGraph, directed, edges, bugs.includes("first-branch"), false, bugs.includes("last-branch"));
        return graph.nodes.filter(node => visited.has(node));
      }
      const visited = new Set([graph.start]);
      for (const color of ["red", "blue"]) {
        traverseGraph(searchGraph, directed, edges.filter(([, , edgeColor]) => edgeColor === color), bugs.includes("first-branch"), false, bugs.includes("last-branch")).forEach(node => visited.add(node));
      }
      return graph.nodes.filter(node => visited.has(node));
    }
    const visited = traverseGraph(searchGraph, directed, edges, bugs.includes("first-branch"), bugs.includes("shallow-search"), bugs.includes("last-branch"));
    return graph.nodes.filter(node => visited.has(node));
  }

  function counterResult(graph, bugs = [], startOverride = null) {
    const reached = runSearch(graph, bugs, startOverride);
    if (counterInputSpec().result === "unreached-nodes") {
      const reachedSet = new Set(reached);
      return graph.nodes.filter(node => !reachedSet.has(node));
    }
    return reached;
  }

  function traverseGraph(graph, directed, edges, firstBranch = false, shallowSearch = false, lastBranch = false) {
    const adjacency = Object.fromEntries(graph.nodes.map(node => [node, []]));
    for (const [from, to] of edges) {
      if (!adjacency[from].includes(to)) adjacency[from].push(to);
      if (!directed && !adjacency[to].includes(from)) adjacency[to].push(from);
    }
    const visited = new Set([graph.start]);
    if (shallowSearch) adjacency[graph.start].forEach(node => visited.add(node));
    else if (firstBranch || lastBranch) {
      let current = graph.start;
      const nextUnvisited = () => lastBranch ? [...adjacency[current]].reverse().find(node => !visited.has(node)) : adjacency[current].find(node => !visited.has(node));
      while (nextUnvisited()) {
        current = nextUnvisited();
        visited.add(current);
      }
    } else {
      const stack = [graph.start];
      while (stack.length) for (const next of adjacency[stack.pop()]) if (!visited.has(next)) { visited.add(next); stack.push(next); }
    }
    return visited;
  }

  function mistakenGraph(graph, bugs, startOverride = null) {
    let directed = graph.directed;
    let edges = graph.edges.map(edge => [...edge]);
    let start = graph.start;
    if (bugs.includes("make-one-way")) directed = true;
    if (bugs.includes("make-two-way")) directed = false;
    if (bugs.includes("reverse-arrows")) edges = edges.map(([from, to, color]) => [to, from, color]);
    if (bugs.includes("add-diagonals")) {
      for (let a = 0; a < graph.nodes.length; a++) for (let b = a + 1; b < graph.nodes.length; b++) {
        const one = coordinate(graph.nodes[a]), two = coordinate(graph.nodes[b]);
        if (one && two && Math.abs(one[0] - two[0]) === 1 && Math.abs(one[1] - two[1]) === 1) edges.push([graph.nodes[a], graph.nodes[b], ""]);
      }
    }
    if (bugs.includes("remove-diagonals")) edges = edges.filter(([from, to]) => {
      const one = coordinate(from), two = coordinate(to);
      return !one || !two || !(Math.abs(one[0] - two[0]) === 1 && Math.abs(one[1] - two[1]) === 1);
    });
    if (bugs.includes("drop-last-edge")) edges = edges.slice(0, -1);
    if (bugs.includes("skip-leaf-edges")) {
      const degree = Object.fromEntries(graph.nodes.map(node => [node, 0]));
      edges.forEach(([from, to]) => { degree[from]++; degree[to]++; });
      edges = edges.filter(([from, to]) => degree[from] > 1 && degree[to] > 1);
    }
    if (bugs.includes("wrong-start")) start = startOverride || graph.nodes[0];
    if (bugs.includes("red-only")) edges = edges.filter(([, , color]) => color === "red");
    if (bugs.includes("ignore-colors")) edges = edges.map(([from, to]) => [from, to, "slate"]);
    const seenEdges = new Set();
    edges = edges.filter(([from, to, color = ""]) => {
      const ends = directed ? [from, to] : [from, to].sort();
      const key = `${ends[0]}\u0000${ends[1]}\u0000${color}`;
      if (seenEdges.has(key)) return false;
      seenEdges.add(key);
      return true;
    });
    return { ...graph, directed, edges, start };
  }

  function coordinate(label) {
    const match = String(label).match(/^\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?$/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  function checkCounterexample(round) {
    const blank = { nodes: [], edges: [], directed: false };
    const dualDrawings = usesDualCounterDrawings();
    const drawing = window.DFS_GRAPH?.getSnapshot() || blank;
    if (dualDrawings) counterDrawings[counterDrawingMode] = drawing;
    const correctDrawing = dualDrawings ? (counterDrawings.correct || blank) : drawing;
    const mistakenDrawing = dualDrawings ? (counterDrawings.mistaken || blank) : null;
    const parsed = parseCounterDrawing(correctDrawing, round, $("#counter-start")?.value);
    const mistakenStart = round.bugs.includes("wrong-start") ? String(round.mistakenStartLabel) : parsed.graph?.start;
    const graphCheck = parsed.graph ? gradeCanvas(expectedCanvas(parsed.graph), correctDrawing) : { nodes: false, edges: false, direction: false, colors: false, labels: false };
    const mistakenGraphCheck = parsed.graph && dualDrawings ? gradeCanvas(expectedCanvas(mistakenGraph(parsed.graph, round.bugs, mistakenStart)), mistakenDrawing) : null;
    const coffeeDrawingMatches = problem.id !== "routes-past-the-coffee-cart" || coffeeNodeLabel(mistakenDrawing) === parsed.graph?.checkpoint;
    const correctOutput = parsed.graph ? counterResult(parsed.graph) : [];
    const buggyOutput = parsed.graph ? counterResult(parsed.graph, round.bugs, mistakenStart) : [];
    const singletonOutputs = parsed.graph ? round.bugs.map(bug => counterResult(parsed.graph, [bug], mistakenStart)) : [];
    const exposes = parsed.graph
      && JSON.stringify(correctOutput) !== JSON.stringify(buggyOutput)
      && singletonOutputs.every(output => JSON.stringify(correctOutput) !== JSON.stringify(output))
      && (problem.id !== "routes-past-the-coffee-cart" || correctOutput.includes(parsed.graph.checkpoint) !== buggyOutput.includes(parsed.graph.checkpoint));
    const checks = parsed.graph ? [
      ["The correct graph is internally consistent", graphCheck.nodes && graphCheck.edges && graphCheck.direction && graphCheck.colors],
      [problem.id === "routes-past-the-coffee-cart" ? "The mistake changes whether the coffee cart is reached" : "The graph exposes the mistake", Boolean(exposes)],
      ["The correct graph follows the problem's graph rules", true],
      ...(dualDrawings ? [[personDrawingChanges(round.bugs) ? `${characterName(counterProgress.index * 7)}'s drawing exactly shows the mistake` : "The second drawing matches because the mistake changes only the search", mistakenGraphCheck.nodes && mistakenGraphCheck.edges && mistakenGraphCheck.direction && mistakenGraphCheck.colors && coffeeDrawingMatches]] : []),
      ["The correct output is predicted correctly", friendlyListMatches($("#counter-real-output").value, correctOutput)],
      [`${characterName(counterProgress.index * 7)}’s output is predicted correctly`, friendlyListMatches($("#counter-bug-output").value, buggyOutput)]
    ] : [
      [parsed.error, false],
      ["Fix the correct graph before its search can run", null],
      ["Fix the correct graph before it can be compared", null],
      ...(dualDrawings ? [[`Fix the correct graph before ${characterName(counterProgress.index * 7)}'s graph can be compared`, null]] : []),
      ["Fix the correct graph before predicting its output", null],
      [`Fix the correct graph before predicting ${characterName(counterProgress.index * 7)}'s output`, null]
    ];
    const predictionOffset = dualDrawings ? 4 : 3;
    counterProgress.skills = [checks[0][1] && checks[1][1], checks[2][1] && (!dualDrawings || checks[3][1]), checks[predictionOffset + 1][1], checks[predictionOffset][1]].map((passed, index) => passed || counterProgress.skills[index]);
    if (!checks.every(([, pass]) => pass)) {
      counterProgress.mistakes++;
      saveCounterProgress();
      updateCounterProgress(counterProgress.index, counterexampleRounds().length);
      $("#feedback-slot").innerHTML = `<div class="feedback case-feedback"><b>The contradiction is not complete yet.</b><ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass === null ? "blocked" : pass ? "passed" : "failed"}"><span>${pass === null ? "—" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul></div>`;
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#counter-check").innerHTML = "Run revised searches <span>→</span>";
      return;
    }
    saveCounterProgress();
    lockCounterexampleEditor();
    const name = characterName(counterProgress.index * 7);
    $("#feedback-slot").innerHTML = `<div class="feedback good case-feedback"><b>Counterexample confirmed.</b><div class="case-result-grid"><div><span>Correct output</span><strong>${esc(formatReachedOutput(correctOutput))}</strong></div><div><span>${esc(name)}'s output</span><strong>${esc(formatReachedOutput(buggyOutput))}</strong></div></div><div class="feedback-why"><b>Why it works:</b> the same input produces different reachable sets under the broken and correct rules.</div></div>`;
    const button = $("#counter-check");
    button.disabled = false;
    button.innerHTML = counterProgress.index === counterexampleRounds().length - 1 ? "Finish Step 2 <span>→</span>" : "Open next question <span>→</span>";
    button.onclick = () => {
      if (counterProgress.index < counterexampleRounds().length - 1) counterProgress.skills = [false, false, false, false];
      counterProgress.index++;
      saveCounterProgress();
      render();
    };
  }

  function lockCounterexampleEditor() {
    ["#counter-start", "#counter-bug-output", "#counter-real-output", "#graph-add-node", "#graph-label", "#graph-color", "#graph-clear", "#graph-directed", "#graph-edge-width", "[data-counter-drawing]"].forEach(selector => {
      const element = $(selector);
      if (element) element.disabled = true;
    });
    $$('[data-counter-drawing]').forEach(button => { button.disabled = true; });
    $("#graph-lab").classList.add("locked");
    $$("#graph-svg .scratch-node, #graph-svg .scratch-edge").forEach(element => {
      element.setAttribute("tabindex", "-1");
      element.setAttribute("aria-disabled", "true");
    });
  }

  function unlockCounterexampleEditor() {
    $("#graph-lab").classList.remove("locked");
    ["#graph-add-node", "#graph-clear", "#graph-directed", "#graph-edge-width"].forEach(selector => {
      const element = $(selector);
      if (element) element.disabled = false;
    });
  }

  function friendlyListMatches(value, expected) {
    try {
      const actual = JSON.parse(String(value).trim());
      if (!Array.isArray(actual) || actual.some(item => typeof item !== "string" && typeof item !== "number")) return false;
      const typedExpected = expected.map(item => /^-?\d+(?:\.\d+)?$/.test(String(item)) ? Number(item) : String(item));
      return JSON.stringify(actual) === JSON.stringify(typedExpected);
    } catch {
      return false;
    }
  }

  function formatReachedOutput(output) {
    const typed = output.map(item => /^-?\d+(?:\.\d+)?$/.test(String(item)) ? Number(item) : String(item));
    return JSON.stringify(typed);
  }

  function jsonAnswerMatches(value, expectedJson) {
    try { return JSON.stringify(canonicalJson(JSON.parse(String(value).trim()))) === JSON.stringify(canonicalJson(JSON.parse(String(expectedJson).trim()))); }
    catch { return false; }
  }
  function canonicalJson(value) {
    if (Array.isArray(value)) return value.map(canonicalJson);
    if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalJson(value[key])]));
    return value;
  }

  function updateCounterProgress(done, total) {
    const passed = done - counterProgress.skipped.filter(index => index < done).length;
    $("#evidence-label").textContent = `${passed} of ${total} questions completed`;
    const notes = [];
    if (counterProgress.mistakes) notes.push(`${counterProgress.mistakes} correction${counterProgress.mistakes === 1 ? "" : "s"}`);
    if (counterProgress.hints) notes.push(`${counterProgress.hints} scaffold${counterProgress.hints === 1 ? "" : "s"}`);
    $("#attempt-label").textContent = notes.join(" · ") || "Clean run";
    $("#evidence-fill").style.width = `${passed / total * 100}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    $("#facet-list").innerHTML = ["valid counterexample", "matching graph", "predict the bug", "predict the truth"].map((label, index) => `<span class="facet ${counterProgress.skills[index] ? "proven" : ""}" aria-label="${label}: ${counterProgress.skills[index] ? "proven" : "not proven"}">${label}</span>`).join("");
    $("#evidence-chip").innerHTML = done === total ? "<span>✓ Step 2 complete</span>" : "";
  }

  function renderCounterexampleComplete() {
    $("#graph-lab").hidden = true;
    const skipped = counterProgress.skipped.length;
    const passed = counterexampleRounds().length - skipped;
    $("#challenge").innerHTML = `<div class="challenge-body victory counter-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Disproven"}</div><h3>${skipped ? "Step 2 finished." : "Step 2 complete."}</h3>${skipped ? `<p>${passed} passed · ${skipped} skipped.</p>` : ""}<div class="completion-actions"><button id="start-structure" class="primary-btn">Start Step 3 <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-counter" class="ghost-btn">Practice Step 2 again</button></div></div>`;
    $("#start-structure").onclick = () => switchSection(3);
    $("#restart-counter").onclick = resetCounterexamples;
  }

  function structureSourceTasks() {
    const tasks = problem.lesson.conceptTasks;
    const find = ids => tasks.find(task => ids.includes(task.id));
    const node = correctStructureTask("node", find(["core-rule", "concept-node", "concept-nodes", "node-rule"]) || metroNodeTask());
    const edge = correctStructureTask("edge", find(["relation-rule", "concept-edge", "concept-relations", "edge-rule", "two-way-tracks"]));
    const correctedRemedials = new Map([[node.id, node.remedial], [edge.id, edge.remedial]]);
    const uniqueCandidates = [...new Map(tasks.map(task => correctedRemedials.get(task.id) || task.remedial)
      .filter(task => task?.canvas)
      .map(task => [JSON.stringify([task.input, task.canvas]), task])).values()];
    const start = problemIndex % uniqueCandidates.length;
    const transfers = [...uniqueCandidates.slice(start), ...uniqueCandidates.slice(0, start)];
    return { node, edge, transfers };
  }

  function structureCanvasScore(canvas) {
    return canvas.nodes.length + canvas.edges.length * 2 + canvas.edges.filter(edge => edge.color || edge.label).length;
  }

  function structureTasks() {
    const source = structureSourceTasks();
    return source.transfers.map((transfer, roundIndex) => ({
      kind: "claims-build",
      label: "GRAPH CHECK + BUILD",
      facet: "claims + exact graph",
      input: transfer.input,
      claims: makeStructureClaims({ ...source, transfer }, roundIndex),
      task: transfer
    }));
  }

  function makeStructureClaims({ node, edge, transfer }, roundIndex) {
    const seed = problemIndex + roundIndex * 17 + (structureProgress?.claimVariant || 0) * 79;
    const nodeRule = node.choices.find(choice => choice.id === node.correct);
    const edgeRule = edge.choices.find(choice => choice.id === edge.correct);
    const canvas = transfer.canvas;
    const nodeCheck = nodeMembershipClaim(canvas, nodeRule, node, seed);
    const relationCheck = directVsReachabilityClaim(canvas, edgeRule, edge, seed);
    const localCheck = degreeClaim(canvas, seed);
    const claims = [
      {
        kind: "membership",
        label: "NODE CHECK",
        facet: "which nodes count",
        input: transfer.input,
        statement: nodeCheck.statement,
        correct: nodeCheck.correct,
        feedback: nodeCheck.feedback,
        misconception: nodeCheck.misconception
      },
      {
        kind: "direct-vs-reach",
        label: "DIRECT-EDGE CHECK",
        facet: "direct edges",
        input: transfer.input,
        statement: relationCheck.statement,
        correct: relationCheck.correct,
        feedback: relationCheck.feedback
      },
      {
        kind: "local-degree",
        label: "LOCAL-STRUCTURE CHECK",
        facet: "local degree",
        input: transfer.input,
        statement: localCheck.statement,
        correct: localCheck.correct,
        feedback: localCheck.feedback
      }
    ];
    const shift = stableChoiceSlot(`${problem.id}:${seed}`, claims.length);
    return [...claims.slice(shift), ...claims.slice(0, shift)];
  }

  function nodeMembershipClaim(canvas, nodeRule, nodeTask, seed) {
    const misconceptions = nodeTask.choices.filter(choice => choice.id !== nodeTask.correct && choice.misconception);
    const mistakenRule = misconceptions[seed % misconceptions.length];
    const exposeAsWarning = stableChoiceSlot(`${problem.id}:membership:${seed}`, 2) === 0;
    const correction = `${stripVerdictCue(mistakenRule.feedback)} Correct node rule: ${nodeRule.label}`;
    return exposeAsWarning ? {
      statement: `It would be a mistake to use this node rule: “${mistakenRule.label}”`,
      correct: true,
      feedback: correction,
      misconception: mistakenRule.misconception
    } : {
      statement: `Use this node rule for the graph: “${mistakenRule.label}”`,
      correct: false,
      feedback: correction,
      misconception: mistakenRule.misconception
    };
  }

  function directVsReachabilityClaim(canvas, edgeRule, edgeTask, seed) {
    const shortcut = findMissingShortcut(canvas, seed);
    const truthful = stableChoiceSlot(`${problem.id}:relation:${seed}`, 2) === 0;
    if (shortcut) return truthful ? {
      statement: `${shortcut.from} can reach ${shortcut.to} through ${shortcut.middle}, but the graph still has no direct ${shortcut.from}${shortcut.arrow}${shortcut.to} edge.`,
      correct: true,
      feedback: `Right. A multi-step route through ${shortcut.middle} creates reachability, not a new direct edge.`
    } : { ...shortcut, correct: false };
    const edge = canvas.edges[seed % Math.max(canvas.edges.length, 1)];
    if (!edge) {
      const [one, two] = canvas.nodes;
      const selfRelation = `${one?.label || "node"}${canvas.directed ? "→" : "—"}${one?.label || "node"}`;
      if (one && !two) return truthful ? {
        statement: `${one.label} can reach itself without using an edge, but the graph still has no direct ${selfRelation} edge.`,
        correct: true,
        feedback: `Correct. A zero-step path makes ${one.label} reachable from itself; it does not invent a self-edge.`
      } : {
        statement: `Because ${one.label} can reach itself, the graph should contain a direct ${selfRelation} edge.`,
        correct: false,
        feedback: `Self-reachability can use zero edges. The input does not define a direct ${selfRelation} self-edge.`
      };
      if (one && two) return truthful ? {
        statement: `There is no direct edge between ${one.label} and ${two.label}; merely naming both nodes does not make them reachable.`,
        correct: true,
        feedback: `Correct. Node membership alone creates neither a direct edge nor a route.`
      } : {
        statement: `${one.label} can reach ${two.label}, so the graph should contain a direct edge between them.`,
        correct: false,
        feedback: `Reachability never creates a direct edge. This input lists no direct relation between ${one.label} and ${two.label}.`
      };
      return { statement: edgeRule.label, correct: true, feedback: stripVerdictCue(edgeTask.why || edgeRule.feedback) };
    }
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const arrow = canvas.directed ? "→" : "—";
    return truthful ? {
      statement: `${labels[String(edge.from)]} and ${labels[String(edge.to)]} are directly connected, not merely reachable through a longer route.`,
      correct: true,
      feedback: `Correct. The mini-example lists ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} as one direct edge.`
    } : {
      statement: `${labels[String(edge.from)]} can reach ${labels[String(edge.to)]}, but there is no direct ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} edge.`,
      correct: false,
      feedback: `The mini-example lists ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} as one direct edge. A direct edge is different from a longer reachable route.`
    };
  }

  function findMissingShortcut(canvas, seed = 0) {
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const adjacency = Object.fromEntries(canvas.nodes.map(node => [String(node.id), new Set()]));
    for (const edge of canvas.edges) {
      const from = String(edge.from), to = String(edge.to);
      adjacency[from]?.add(to);
      if (!canvas.directed) adjacency[to]?.add(from);
    }
    const shortcuts = [];
    for (const [from, neighbors] of Object.entries(adjacency)) for (const middle of neighbors) for (const to of adjacency[middle] || []) {
      if (from === to || neighbors.has(to)) continue;
      const arrow = canvas.directed ? "→" : "—";
      shortcuts.push({
        from: labels[from], middle: labels[middle], to: labels[to], arrow,
        statement: `The correct graph has ${labels[from]}${arrow}${labels[middle]} and ${labels[middle]}${arrow}${labels[to]}, so it should also contain a direct ${labels[from]}${arrow}${labels[to]} edge.`,
        feedback: `Two direct edges through ${labels[middle]} do not create a new shortcut. Only one-step relations defined by the problem become edges.`
      });
    }
    return shortcuts[seed % Math.max(shortcuts.length, 1)] || null;
  }

  function directRelationClaim(canvas, edgeRule, edgeTask) {
    const edge = canvas.edges[0];
    if (!edge) return { statement: edgeRule.label, correct: true, feedback: stripVerdictCue(edgeTask.why || edgeRule.feedback) };
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const arrow = canvas.directed ? "→" : "—";
    return {
      statement: `The correct graph contains the direct edge ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]}.`,
      correct: true,
      feedback: `That direct edge is defined by the mini-example input.`
    };
  }

  function degreeClaim(canvas, seed) {
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const adjacency = Object.fromEntries(canvas.nodes.map(node => [String(node.id), new Set()]));
    for (const edge of canvas.edges) {
      const from = String(edge.from), to = String(edge.to);
      adjacency[from]?.add(to);
      if (!canvas.directed) adjacency[to]?.add(from);
    }
    const counts = Object.entries(adjacency).map(([id, neighbors]) => ({ label: labels[id], count: neighbors.size }));
    if (!counts.length) return { statement: "This mini-example has no nodes.", correct: true, feedback: "The input produces an empty graph." };
    const chosen = counts[seed % counts.length];
    const correct = stableChoiceSlot(`${problem.id}:degree:${seed}`, 2) === 0;
    const target = correct ? chosen.count : chosen.count > 0 && seed % 2 ? chosen.count - 1 : chosen.count + 1;
    const noun = canvas.directed
      ? `outgoing direct edge${target === 1 ? "" : "s"}`
      : `direct neighbor${target === 1 ? "" : "s"}`;
    return {
      statement: `${chosen.label} has exactly ${target} ${noun}.`,
      correct,
      feedback: `${chosen.label} has ${chosen.count} ${canvas.directed ? `outgoing direct edge${chosen.count === 1 ? "" : "s"}` : `direct neighbor${chosen.count === 1 ? "" : "s"}`}.`
    };
  }

  function edgeMetadataClaim(canvas, seed) {
    const candidates = canvas.edges.filter(edge => edge.color || edge.label);
    if (!candidates.length) return null;
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const edge = candidates[seed % candidates.length];
    const arrow = canvas.directed ? "→" : "—";
    const correct = seed % 2 === 0;
    if (edge.color) {
      const actual = String(edge.color);
      const claimed = correct ? actual : actual.toLowerCase() === "red" ? "blue" : "red";
      return {
        statement: `The direct edge ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} is ${claimed}.`,
        correct,
        feedback: `That edge is ${actual} in the input.`
      };
    }
    const actual = String(edge.label);
    const number = Number(actual);
    const otherLabel = candidates.map(candidate => String(candidate.label || "")).find(label => label && label !== actual);
    const claimed = correct ? actual : Number.isFinite(number) ? String(number + 1) : otherLabel;
    return {
      statement: claimed
        ? `The direct edge ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} has label or weight ${claimed}.`
        : `The direct edge ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} has no label or weight.`,
      correct,
      feedback: `That edge's input label or weight is ${actual}.`
    };
  }

  function metroNodeTask() {
    return {
      id: "metro-node-contract",
      prompt: "What should one node represent in this lesson's graph model?",
      input: "A station may touch tracks of different colors.",
      correct: "station",
      answerSlot: 1,
      why: "A station keeps one identity. Track colors belong to edges, not to separate copies of the station.",
      choices: [
        { id: "station", label: "One node for each station number, including stations with no track", feedback: "Correct. Station identity comes from its number, while colors belong to tracks.", misconception: null },
        { id: "color-copy", label: "One red copy and one blue copy of every station", feedback: "That duplicates one real station. Color is an edge property in the committed model.", misconception: "duplicate-station-by-color" },
        { id: "track-node", label: "One node for each track, labeled by its two endpoints", feedback: "Tracks are the direct relations between station nodes, not the nodes themselves.", misconception: "turn-edges-into-nodes" },
        { id: "route-node", label: "One node for each complete one-color route", feedback: "Routes are found by walking through the graph; they are not its basic nodes.", misconception: "turn-output-routes-into-nodes" }
      ]
    };
  }

  function correctStructureTask(type, source) {
    const task = JSON.parse(JSON.stringify(source));
    const correctChoice = () => task.choices.find(choice => choice.id === task.correct);
    const general = GENERAL_STRUCTURE_CONTRACTS[problem.id]?.[type];
    if (general) {
      correctChoice().label = general;
      correctChoice().feedback = `Correct. ${general}`;
      task.why = general;
    }
    if (problem.id === "properties-graph" && type === "node") {
      correctChoice().label = "Input row index i; properties[i] is payload carried by that node.";
      correctChoice().feedback = "Correct. Row index i is the identity, so equal-looking rows are still separate nodes.";
      task.why = "There is exactly one node per input row index. The row values are data used to decide edges.";
    }
    if (problem.id === "path-sum" && type === "node") {
      correctChoice().label = "Every existing tree node object, including root, inner nodes, and leaves.";
      correctChoice().feedback = "Correct. The graph contains the whole input tree; a candidate route selects some of those nodes later.";
      task.prompt = "Which objects belong as nodes before any candidate path is tested?";
      task.why = "Build the whole input tree first. Path rules decide which of its nodes are used by one candidate route.";
    }
    if (problem.id === "word-search" && type === "edge") {
      correctChoice().label = "A direct edge only between two cell positions that share a side.";
      correctChoice().feedback = "Correct. Side contact creates graph adjacency; the no-reuse rule belongs to the search state.";
      task.why = "Edges capture one physical move. Remembering used cells is a separate backtracking rule, not another edge rule.";
    }
    if (problem.id === "kattis-getting-gold" && type === "node") {
      correctChoice().label = "Every non-wall square, including each trap as an obstacle node with no movement edges.";
      correctChoice().feedback = "Correct. The committed picture keeps every non-wall input square, while edges prevent entry into traps.";
      task.why = "Trap squares stay visible as obstacle nodes, but traversal can never enter or leave them.";
    }
    if (problem.id === "kattis-getting-gold" && type === "edge") {
      correctChoice().label = "A safe walkable square points to walkable side neighbors; trap nodes have no edges, and draft squares have no outgoing arrows.";
      correctChoice().feedback = "Correct. A draft square can be entered before stopping, but a trap cannot be entered at all.";
      task.why = "One arrow means one legal side step. Trap nodes are isolated, and a square beside a trap cannot expand farther.";
      correctGoldTransfer(task.remedial);
    }
    return task;
  }

  function correctGoldTransfer(task) {
    task.input = 'dungeon=["#####","#P..#","#T.G#","#####"]';
    task.canvas = {
      directed: true,
      nodes: ["(1,1)", "(1,2)", "(1,3)", "(2,1)", "(2,2)", "(2,3)"].map(label => ({ id: label, label })),
      edges: [
        ["(1,2)", "(1,1)"], ["(1,2)", "(1,3)"], ["(1,2)", "(2,2)"],
        ["(1,3)", "(1,2)"], ["(1,3)", "(2,3)"],
        ["(2,3)", "(1,3)"], ["(2,3)", "(2,2)"]
      ].map(([from, to]) => ({ from, to }))
    };
  }

  function renderStructureRound() {
    const rounds = structureTasks();
    const done = Math.min(structureProgress.index, rounds.length);
    updateStructureProgress(done, rounds);
    selectedId = null;
    answered = false;
    document.body.classList.remove("structure-transfer");
    if (done >= rounds.length) return renderStructureComplete();
    const round = rounds[done];
    renderStructureClaims(round, done, rounds.length);
  }

  function renderStructureClaims(round, roundIndex, total) {
    document.body.classList.add("structure-transfer");
    window.DFS_GRAPH?.setContext(`${problem.id}:structure-transfer:${roundIndex}`, structureProgress.claimVariant || 0);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = "Build the correct graph for this mini-example";
    $("#graph-direction-label").textContent = "Directed edges";
    const task = round.task;
    const answers = Array(round.claims.length).fill(null);
    const namedClaims = round.claims.map((claim, index) => ({ ...claim, name: characterName(30 + index) }));
    const frame = structureFrame();
    const compact = true;
    const claimCards = compact
      ? namedClaims.map((claim, index) => `<article class="student-claim structure-single-claim coffee-claim" data-claim-kind="${esc(claim.kind)}"${claim.misconception ? ` data-misconception="${esc(claim.misconception)}"` : ""}><blockquote id="structure-claim-${index}">${formatText(claim.statement)}</blockquote><fieldset class="claim-verdict" aria-labelledby="structure-claim-${index} structure-verdict-${index}"><legend id="structure-verdict-${index}">Correct?</legend><div><button type="button" data-claim-index="${index}" data-claim-value="true" aria-label="Yes: ${esc(claim.statement)}" aria-pressed="false" disabled>Yes</button><button type="button" data-claim-index="${index}" data-claim-value="false" aria-label="No: ${esc(claim.statement)}" aria-pressed="false" disabled>No</button></div></fieldset></article>`).join("")
      : namedClaims.map((claim, index) => `<article class="student-claim structure-single-claim" data-claim-kind="${esc(claim.kind)}"${claim.misconception ? ` data-misconception="${esc(claim.misconception)}"` : ""}><div class="student-id"><span class="student-avatar" aria-hidden="true">${esc(claim.name[0])}</span><div><small>${esc(frame.role)} ${index + 1}</small><b>${esc(claim.name)}:</b></div></div><blockquote id="structure-claim-${index}">${formatText(claim.statement)}</blockquote><fieldset class="claim-verdict" aria-labelledby="structure-claim-${index} structure-verdict-${index}"><legend id="structure-verdict-${index}">Is ${esc(claim.name)} correct?</legend><div><button type="button" data-claim-index="${index}" data-claim-value="true" aria-label="Yes: ${esc(claim.statement)}" aria-pressed="false">Yes</button><button type="button" data-claim-index="${index}" data-claim-value="false" aria-label="No: ${esc(claim.statement)}" aria-pressed="false">No</button></div></fieldset></article>`).join("");
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top structure-case-top"><span class="probe-type">${esc(frame.label)}</span><span class="probe-id">CHECK ${roundIndex + 1} OF ${total}</span></div>`}
      <div class="challenge-body structure-claim-check">
        ${compact ? "" : `<h3>${esc(frame.heading)}</h3>`}
        <div class="prompt-code structure-mini-example">${esc(round.input)}</div>
        ${renderNodeLabelGuide(task)}
        <div class="structure-claim-list">${claimCards}</div>
        <div id="feedback-slot" role="status" aria-live="polite"></div>
        ${compact ? '<div class="challenge-actions"><button id="structure-check" class="primary-btn" disabled>Check graph + answers <span>→</span></button></div>' : '<div class="challenge-actions"><span class="microcopy">Answer all three claims, then build the graph below.</span><a class="ghost-btn link-button" href="#graph-lab">Go to graph ↓</a></div>'}
      </div>`;
    const graphActions = $("#graph-lab-actions");
    graphActions.hidden = compact;
    graphActions.innerHTML = compact ? "" : `<span class="microcopy">When the claims and graph are ready:</span><button id="structure-check" class="primary-btn" disabled>Check claims + graph <span>→</span></button>`;
    if (compact) {
      $("#graph-lab-title").textContent = "1 · Draw the graph";
      const workspace = document.createElement("div");
      workspace.className = "structure-workspace";
      ($(".node-label-guide") || $(".structure-mini-example")).after(workspace);
      workspace.append($("#graph-lab"), $(".structure-claim-list"));
      counterGraphChangeHandler = () => {
        const started = Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-claim-index]').forEach(button => { if (answers[Number(button.dataset.claimIndex)] === null) button.disabled = !started; });
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
    }
    const update = () => { $("#structure-check").disabled = answers.some(answer => answer === null); };
    $$('[data-claim-index]').forEach(button => { button.onclick = () => {
      const index = Number(button.dataset.claimIndex);
      answers[index] = button.dataset.claimValue === "true";
      $$(`[data-claim-index="${index}"]`).forEach(item => { const chosen = item === button; item.classList.toggle("selected", chosen); item.setAttribute("aria-pressed", String(chosen)); });
      update();
    }; });
    $("#structure-check").onclick = () => checkStructureClaims(namedClaims, answers, task, roundIndex, total);
    focusPrompt();
    $(".test-pane").scrollTop = 0;
  }

  function structureFrame() {
    return [
      { label: "MODEL COURT", heading: "Judge these three graph claims together.", role: "CLAIM" },
      { label: "PEER REVIEW", heading: "Check three classmates' notes against one exact graph.", role: "REVIEW" },
      { label: "GRAPH FACT-CHECK", heading: "Decide which statements survive the picture.", role: "NOTE" },
      { label: "WHITEBOARD CHECK", heading: "Test membership, direct edges, and local degree.", role: "IDEA" }
    ][problemIndex % 4];
  }

  function checkStructureClaims(claims, answers, task, roundIndex, total) {
    if (answered || answers.some(answer => answer === null)) return;
    const missed = claims.map((claim, index) => ({ ...claim, index })).filter(claim => answers[claim.index] !== claim.correct);
    const graph = gradeCanvas(task.canvas, window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false });
    const graphChecks = [
      ["Every exact node is drawn", graph.nodes],
      ["Every exact direct edge is drawn", graph.edges],
      ["Edge direction matches", graph.direction],
      ["Edge colors match the input", graph.colors],
      ["Edge labels or weights match the input", graph.labels]
    ].filter(([label]) => !label.startsWith("Edge colors") || task.canvas.edges.some(edge => edge.color))
      .filter(([label]) => !label.startsWith("Edge labels") || task.canvas.edges.some(edge => edge.label));
    const graphPassed = graphChecks.every(([, pass]) => pass);
    if (missed.length) {
      structureProgress.mistakes++;
      saveStructureProgress();
      updateStructureProgress(structureProgress.index, structureTasks());
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>Review ${missed.length === 1 ? "this claim" : "these claims"}, then try another check.</b><ul class="feedback-checklist">${missed.map(claim => `<li class="failed"><span>×</span>${formatText(claim.feedback)}</li>`).join("")}</ul></div>`;
      $$('[data-claim-index]').forEach(item => { item.disabled = true; });
      const button = $("#structure-check");
      button.disabled = false;
      button.innerHTML = "Try another check <span>→</span>";
      button.onclick = () => {
        structureProgress.claimVariant++;
        saveStructureProgress();
        render();
      };
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#feedback-slot").tabIndex = -1;
      $("#feedback-slot").focus({ preventScroll: true });
      queueMicrotask(() => button.focus({ preventScroll: true }));
      return;
    }
    if (!graphPassed) {
      structureProgress.mistakes++;
      saveStructureProgress();
      updateStructureProgress(structureProgress.index, structureTasks());
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>Your three answers are right. Fix the graph below.</b><ul class="feedback-checklist">${graphChecks.map(([label, pass]) => `<li class="${pass ? "passed" : "failed"}"><span>${pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${gridGraphScheme()}</div>`;
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    answered = true;
    lockCounterexampleEditor();
    $$('[data-claim-index]').forEach(item => { item.disabled = true; });
    $("#feedback-slot").innerHTML = `<div class="feedback good court-ruling"><b>Claims and graph are correct.</b><div class="feedback-why">Your nodes, direct edges, direction, and edge details all match the mini-example.</div></div>`;
    const button = $("#structure-check");
    button.disabled = false;
    button.innerHTML = roundIndex + 1 === total ? "Finish Step 3 <span>→</span>" : "Next question <span>→</span>";
    button.onclick = advanceStructure;
  }

  function stripVerdictCue(value) { return String(value || "").replace(/^(correct|right)\.\s*/i, ""); }

  function advanceStructure() {
    structureProgress.index++;
    saveStructureProgress();
    render();
  }

  function updateStructureProgress(done, rounds) {
    const total = rounds.length;
    const passed = done - structureProgress.skipped.filter(index => index < done).length;
    $("#evidence-label").textContent = `${passed} of ${total} graph checks passed`;
    $("#attempt-label").textContent = structureProgress.mistakes ? `${structureProgress.mistakes} correction${structureProgress.mistakes === 1 ? "" : "s"}` : "Clean run";
    $("#evidence-fill").style.width = `${passed / total * 100}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    $("#facet-list").innerHTML = rounds.map((round, index) => `<span class="facet ${index < done && !structureProgress.skipped.includes(index) ? "proven" : ""}" aria-label="${round.facet}: ${index < done && !structureProgress.skipped.includes(index) ? "proven" : "not proven"}">${esc(round.facet)}</span>`).join("");
    $("#evidence-chip").innerHTML = passed === total ? "<span>✓ Graph understood</span>" : "<span class=\"pulse-dot\"></span><span>Checking structure</span>";
  }

  function renderStructureComplete() {
    $("#graph-lab").hidden = true;
    const skipped = structureProgress.skipped.length;
    const total = structureTasks().length;
    const passed = total - skipped;
    $("#challenge").innerHTML = `<div class="challenge-body victory structure-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Defined"}</div><h3>${skipped ? "Step 3 finished." : "Step 3 complete."}</h3><p>${skipped ? `${passed} passed · ${skipped} skipped.` : `You built ${total} different graphs and checked ${total * 3} useful claims.`}</p><div class="completion-actions"><button id="start-reasoning" class="primary-btn">Start Step 4 <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-structure" class="ghost-btn">Practice Step 3 again</button></div></div>`;
    $("#start-reasoning").onclick = () => switchSection(4);
    $("#restart-structure").onclick = resetStructure;
  }

  function reasoningRounds() {
    return problem.codeReasoning?.cases || [];
  }

  function renderReasoningRound() {
    const rounds = reasoningRounds();
    const done = Math.min(reasoningProgress.index, rounds.length);
    updateReasoningProgress(done, rounds);
    selectedId = null;
    answered = false;
    if (!rounds.length) {
      $("#graph-lab").hidden = true;
      $("#challenge").innerHTML = `<div class="challenge-body"><h3>This code case is still being authored.</h3><p>Step 4 will not ship until its real input, incorrect solution, output, and graph proof are checked.</p></div>`;
      return;
    }
    if (done >= rounds.length) return renderReasoningComplete();
    const round = rounds[done];
    const name = characterName(50);
    const diagnoses = arrangeChoices(round.diagnoses, round.correctDiagnosis, round.answerSlot);
    const displayInput = formatReasoningInput(round.input);
    const frame = reasoningFrame();
    const compact = true;
    const outputField = `<label class="counter-field reasoning-output"><span>2 · Predict the exact returned value</span><textarea id="reasoning-output" rows="3" autocomplete="off" spellcheck="false" placeholder="Example: false, 3, or [1, 2]" ${compact ? "disabled" : ""}></textarea></label>${compact ? "" : `<p id="reasoning-output-help" class="counter-output-help">Type the value the function returns. ${esc(friendlyOutputFormat(round.outputFormat))}</p>`}`;
    const diagnosisField = `<fieldset class="reasoning-rule"><legend>3 · What graph-level behavior does this code create?</legend><div class="choices">${diagnoses.map((choice, index) => `<button class="choice" data-choice-id="${esc(choice.id)}" aria-pressed="false" ${compact ? "disabled" : ""}><span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${esc(choice.label)}</span></button>`).join("")}</div></fieldset>`;
    const reasoningQuestions = outputField + diagnosisField;
    window.DFS_GRAPH?.setContext(`${problem.id}:reasoning:${round.caseId || done}`, 0);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = `Draw the correct problem graph — not ${name}'s buggy graph`;
    $("#graph-direction-label").textContent = "Directed edges";
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top reasoning-case-top"><span class="probe-type">${esc(frame.label)}</span><span class="probe-id">STEP 4 · ONE DEEP MISSION</span></div>`}
      <div class="challenge-body reasoning-case">
        ${compact ? "" : `<div class="coder-id"><span class="coder-avatar" aria-hidden="true">${esc(name[0])}</span><div><small>CODE UNDER REVIEW</small><h3>${esc(name)}'s incorrect ${esc(problem.title)} solution</h3></div></div><p class="reasoning-intro">${esc(frame.intro(name))}</p>`}
        <div class="trace-input"><span>REAL PROBLEM INPUT</span><pre>${esc(displayInput)}</pre></div>
        <section class="code-window" aria-label="Incorrect JavaScript solution"><div class="code-window-label">Incorrect solution</div><pre tabindex="0"><code>${renderCodeLines(String(round.code).split("\n"))}</code></pre></section>
        ${reasoningQuestions}
        <div id="feedback-slot" role="status" aria-live="polite"></div>
        <div class="challenge-actions">${compact ? "" : '<span class="microcopy">Your graph, diagnosis, and the incorrect solution\'s output must all agree.</span>'}<button id="reasoning-check" class="primary-btn" disabled>Check graph + reasoning <span>→</span></button></div>
      </div>`;
    if (compact) {
      $("#graph-lab-title").textContent = "1 · Draw the graph";
      $(".trace-input").after($("#graph-lab"));
      counterGraphChangeHandler = () => {
        const started = Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-choice-id]').forEach(button => { button.disabled = !started; });
        $("#reasoning-output").disabled = !started;
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
    }
    const update = () => { $("#reasoning-check").disabled = !selectedId || !$("#reasoning-output").value.trim(); };
    $$('[data-choice-id]').forEach(button => { button.onclick = () => { selectChoice(button.dataset.choiceId, "#reasoning-check"); update(); }; });
    $("#reasoning-output").addEventListener("input", update);
    $("#reasoning-check").onclick = () => checkReasoning(round);
    focusPrompt();
    $(".test-pane").scrollTop = 0;
  }

  function reasoningFrame() {
    const frames = [
      { label: "CODE REVIEW", intro: name => `${name} changed one important graph rule. Find the changed rule, then predict its consequence without tracing every line.` },
      { label: "FAILED TEST INVESTIGATION", intro: name => `A test failed in ${name}'s solution. Predict the returned value first, then explain which graph-level behavior caused it.` },
      { label: "BUG REPORT", intro: name => `Turn ${name}'s code into a short bug report: identify the graph change and the exact value it returns.` },
      { label: "DEBUGGING MEMO", intro: name => `${name}'s code builds or searches the wrong graph. Connect the rule, the changed reachable boundary, and the returned value.` }
    ];
    return frames[problemIndex % frames.length];
  }

  function formatReasoningInput(input) {
    if (typeof input === "string") return input;
    const compact = value => {
      if (Array.isArray(value)) return `[${value.map(compact).join(", ")}]`;
      if (value && typeof value === "object") return `{ ${Object.entries(value).map(([key, item]) => `${key}: ${compact(item)}`).join(", ")} }`;
      return typeof value === "string" ? JSON.stringify(value) : String(value);
    };
    return Object.entries(input || {}).map(([key, value]) => `${key}: ${compact(value)}`).join("\n");
  }

  function highlightJavaScript(line) {
    const pattern = /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|default|else|for|function|if|let|new|of|return|switch|throw|try|var|while)\b|\b(?:true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
    let html = "";
    let cursor = 0;
    for (const match of line.matchAll(pattern)) {
      html += esc(line.slice(cursor, match.index));
      const token = match[0];
      const kind = token.startsWith("//") ? "comment" : /^["'`]/.test(token) ? "string" : /^(true|false|null|undefined)$/.test(token) ? "literal" : /^\d/.test(token) ? "number" : "keyword";
      html += `<span class="syntax-${kind}">${esc(token)}</span>`;
      cursor = match.index + token.length;
    }
    return html + esc(line.slice(cursor));
  }

  function renderCodeLines(lines) { return lines.map((line, index) => `<span class="code-line"><span class="code-line-number" aria-hidden="true">${index + 1}</span><span>${highlightJavaScript(line) || " "}</span></span>`).join(""); }

  function exactNodeLabels(canvas) {
    return (canvas?.nodes || []).map(node => String(node.label)).join(", ") || "none";
  }

  function exactEdgeDetails(canvas) {
    const edges = (canvas?.edges || []).filter(edge => edge.label);
    if (!edges.length) return "";
    const labels = Object.fromEntries((canvas.nodes || []).map(node => [String(node.id), String(node.label)]));
    const joiner = canvas.directed ? " → " : " — ";
    return ` Use these exact edge labels: ${esc(edges.map(edge => `${labels[String(edge.from)] || edge.from}${joiner}${labels[String(edge.to)] || edge.to}: ${edge.label}`).join("; "))}.`;
  }

  function exactColorDetails(canvas) {
    const edges = (canvas?.edges || []).filter(edge => edge.color);
    if (!edges.length) return "";
    const labels = Object.fromEntries((canvas.nodes || []).map(node => [String(node.id), String(node.label)]));
    const joiner = canvas.directed ? " → " : " — ";
    return ` Color them exactly: ${esc(edges.map(edge => `${labels[String(edge.from)] || edge.from}${joiner}${labels[String(edge.to)] || edge.to} is ${edge.color}`).join("; "))}.`;
  }

  function friendlyOutputFormat(value) {
    return String(value || "").replace(/\bJSON\b\s*/gi, "").trim();
  }

  function reasoningWalkthrough(round, includeOutcome = false) {
    const proof = round.graphProof;
    return `<div class="reasoning-coach"><b>Code rule:</b> ${esc(proof.codeRule)} <span>→</span> <b>Changed graph:</b> ${esc(proof.realGraph)} <span>→</span> <b>Reachable boundary:</b> ${esc(proof.separatingFeature)}${includeOutcome ? ` <span>→</span> <b>Returned value:</b> ${esc(proof.outputConsequence)}` : ""}</div>`;
  }

  function lessonStep(number, title, copy, visual) {
    return `<article class="teach-step"><div class="teach-step-head"><span>${number}</span><div><small>REASONING MOVE ${number}</small><h4>${esc(title)}</h4></div></div><p>${copy}</p>${visual}</article>`;
  }

  function metroGraphSvg(mode) {
    const stored = mode === "stored" || mode === "search";
    const search = mode === "search";
    const edgeOne = stored ? "#8392a8" : "#ff7e82";
    const edgeTwo = stored ? "#8392a8" : "#72a7ff";
    const labelOne = stored ? "ordinary edge" : "RED · R";
    const labelTwo = stored ? "ordinary edge" : "BLUE · B";
    return `<svg class="teach-metro-svg" viewBox="0 0 520 180" role="img" aria-labelledby="metro-title-${mode} metro-desc-${mode}"><title id="metro-title-${mode}">${stored ? "The graph stored by the buggy code" : "The colored metro input"}</title><desc id="metro-desc-${mode}">${stored ? "Stations zero, one, and two form one colorless path." : "Station zero connects to one by a red track. Station one connects to two by a blue track."}</desc>
      <line x1="100" y1="92" x2="260" y2="92" stroke="${edgeOne}" stroke-width="9" stroke-linecap="round"/><line x1="260" y1="92" x2="420" y2="92" stroke="${edgeTwo}" stroke-width="9" stroke-linecap="round"/>
      <text x="180" y="62" text-anchor="middle" class="teach-edge-label">${labelOne}</text><text x="340" y="62" text-anchor="middle" class="teach-edge-label">${labelTwo}</text>
      ${[0,1,2].map((label, index) => `<g><circle cx="${100 + index * 160}" cy="92" r="30" class="teach-node ${search ? "reached" : ""}"/><text x="${100 + index * 160}" y="99" text-anchor="middle" class="teach-node-label">${label}</text>${search ? `<circle cx="${78 + index * 160}" cy="70" r="13" class="teach-order"/><text x="${78 + index * 160}" y="75" text-anchor="middle" class="teach-order-label">${index + 1}</text>` : ""}</g>`).join("")}
      <text x="100" y="151" text-anchor="middle" class="teach-caption">SOURCE</text><text x="420" y="151" text-anchor="middle" class="teach-caption">DESTINATION</text>
    </svg>`;
  }

  function metroLayers() {
    return `<div class="metro-layers"><div><b><span class="line-key red">R</span> Red-only trip</b><div class="tiny-route"><span class="on">0</span><i class="red"></i><span class="on">1</span><i class="off"></i><span>2</span></div><small>Stops at station 1</small></div><div><b><span class="line-key blue">B</span> Blue-only trip</b><div class="tiny-route"><span class="on">0</span><i class="off"></i><span>1</span><i class="blue"></i><span>2</span></div><small>Cannot leave station 0</small></div></div>`;
  }

  function colorTransferWalkthrough() {
    return `<section class="deep-reasoning-lesson metro-replay"><header><span>VISUAL REPLAY</span><h3>Do not trace every line. Follow four graph-level moves.</h3><div class="reasoning-chain"><b>colored input</b><i>→</i><b>stored graph</b><i>→</i><b>reachable set</b><i>→</i><b>return value</b></div></header>
      ${lessonStep(1, "Keep the two worlds separate", `The real input is <b>red, then blue</b>. A trip from 0 to 2 would have to transfer at station 1.`, metroGraphSvg("input") + metroLayers())}
      ${lessonStep(2, "Compress the code into one graph rule", `Look at what gets pushed into <code>graph</code>: only station numbers. <b><code>input.colors</code> is never read.</b> The bug does not choose a bad color—it forgets colors exist.`, `<div class="teach-code-compare"><pre><code><mark>graph[a].push(b);\ngraph[b].push(a);</mark></code></pre><div class="discarded-data"><span>colors: [red, blue]</span><b>UNUSED ×</b></div></div>${metroGraphSvg("stored")}`)}
      ${lessonStep(3, "Run reachability on the graph the code built", `Now use the plain path, not the metro rule. DFS reaches 1 from 0, then reaches 2 from 1. Think in sets: <b><code>seen = {0, 1, 2}</code></b>.`, metroGraphSvg("search") + `<div class="reach-timeline"><span>start <b>{0}</b></span><i>→</i><span>one hop <b>{0,1}</b></span><i>→</i><span>two hops <b>{0,1,2}</b></span></div>`)}
      ${lessonStep(4, "Translate the set into the return value", `The last line asks whether destination 2 is in <code>seen</code>. It is. That makes the broken function return <b>true</b>, even though the real no-transfer answer is <b>false</b>.`, `<div class="return-card"><code>seen.has(input.destination)</code><span>destination = 2</span><span>2 ∈ {0,1,2}</span><strong>true</strong></div><div class="lesson-bottom-line">Colors erased <i>→</i> edges combined <i>→</i> station 2 reached <i>→</i> <b>returns true</b></div>`)}
    </section>`;
  }

  function goldGrid(mode) {
    const rows = ["#####", "#P.G#", "#.T.#", "#####"];
    const drafts = new Set(["1,2", "2,1", "2,3"]);
    const buggyPath = new Set(["1,1", "1,2", "1,3"]);
    const correctReach = new Set(["1,1", "1,2", "2,1"]);
    const cells = rows.flatMap((row, r) => [...row].map((value, c) => {
      const key = `${r},${c}`;
      const classes = [value === "#" ? "wall" : value === "P" ? "player" : value === "G" ? "gold" : value === "T" ? "trap" : "floor"];
      if (drafts.has(key)) classes.push("draft");
      if (mode === "buggy" && buggyPath.has(key)) classes.push("buggy-path");
      if (mode === "correct" && correctReach.has(key)) classes.push("correct-reach");
      const shown = drafts.has(key) && value === "." ? "D" : value === "." ? "·" : value;
      const note = drafts.has(key) ? "draft" : value === "P" ? "start" : value === "G" ? "gold" : value === "T" ? "trap" : "";
      return `<div class="gold-cell ${classes.join(" ")}" aria-label="row ${r}, column ${c}: ${note || (value === "#" ? "wall" : "floor")}"><span>${shown}</span>${note ? `<small>${note}</small>` : ""}</div>`;
    })).join("");
    const label = mode === "buggy" ? "Buggy route from P through the top draft square to G" : mode === "correct" ? "Correct reachable region stops at draft squares" : "Dungeon with the three trap-adjacent draft squares marked D";
    return `<div class="gold-grid" role="img" aria-label="${label}">${cells}</div>`;
  }

  function trapBoundaryWalkthrough() {
    return `<section class="deep-reasoning-lesson gold-replay"><header><span>VISUAL REPLAY</span><h3>Do not trace every loop. Find the stopping boundary, then test whether the code honors it.</h3><div class="reasoning-chain"><b>mark drafts</b><i>→</i><b>find missing check</b><i>→</i><b>add bad edge</b><i>→</i><b>count gold</b></div></header>
      ${lessonStep(1, "Mark the three draft squares", `A draft square is <b>beside</b> the trap—not the trap itself. The three <b>D</b> squares touch T by a side. G touches T only diagonally, so G is not a draft square.`, goldGrid("draft") + `<div class="visual-legend"><span><i class="draft"></i>D = feels a draft</span><span><i class="trap"></i>T = trap</span><span><i class="gold"></i>G = gold</span></div>`)}
      ${lessonStep(2, "Draw the real stopping boundary", `The real search may <b>enter</b> a draft square, but it may not expand from one. From P, the correct reachable set is only <b>{P, top D, bottom D}</b>.`, goldGrid("correct") + `<div class="stop-flow"><span>P</span><i>→</i><span class="draft">top D</span><b>STOP</b><span>P</span><i>→</i><span class="draft">bottom D</span><b>STOP</b></div>`)}
      ${lessonStep(3, "Compress the buggy code into one question", `The highlighted condition checks the <b>next</b> cell. It blocks walls and T. It never asks whether the <b>current</b> square feels a draft.`, `<div class="teach-code-compare gold-code"><pre><code><mark>grid[nr][nc] !== '#'\n&& grid[nr][nc] !== 'T'\n&& !seen.has(key)</mark></code></pre><div class="missing-check"><small>MISSING QUESTION</small><b>Is the current square beside T?</b></div></div>`)}
      ${lessonStep(4, "Watch one illegal exploration edge appear", `At top D = (1,2), the right neighbor G is not a wall or trap. The buggy condition therefore creates the forbidden step <b>(1,2) → (1,3)</b>. It goes around the trap; it never enters T.`, goldGrid("buggy") + `<div class="illegal-edge"><span>(1,2) · D</span><i>ILLEGAL EXPANSION →</i><span>(1,3) · G</span></div>`)}
      ${lessonStep(5, "Translate reachability into the counter", `When G is removed from the stack, <code>gold++</code> runs once. There is only one G, so the broken function returns <b>1</b>. The real stopping rule would collect <b>0</b>.`, `<div class="gold-count-compare"><div><span>CORRECT REACHABLE</span><b>P + two D squares</b><strong>gold = 0</strong></div><div class="buggy"><span>BUGGY REACHABLE</span><b>P + drafts + G</b><strong>gold = 1</strong></div></div><div class="lesson-bottom-line">Draft check missing <i>→</i> bad D→G edge <i>→</i> G reached <i>→</i> <b>returns 1</b></div>`)}
    </section>`;
  }

  function deepWorkPrompt() {
    if (problem.id === "one-color-metro-ride") return "Study each picture below. Check the red and blue edge colors, then explain how the code turns them into one colorless graph.";
    if (problem.id === "kattis-getting-gold") return "Study each grid below. Mark every draft square, then check exactly where the buggy search creates an illegal outgoing edge.";
    return "Study the help below. Check every node, direct edge, direction, color, and weight before trying again.";
  }

  function graphFixPrompt() {
    if (problem.id === "one-color-metro-ride") return "Fix the picture carefully. Both direct tracks and their red/blue colors must match the input.";
    if (problem.id === "kattis-getting-gold") return "Fix the picture carefully. Draft squares may be entered, but they must have no outgoing exploration arrows.";
    return "Fix the picture carefully. Code reasoning is easier when every direct edge and its color or weight is visible.";
  }

  function checkReasoning(round) {
    const drawing = window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false };
    const graph = gradeCanvas(round.canvas, drawing);
    const checks = [
      ["The drawing has every exact node", graph.nodes],
      ["The drawing has every exact edge", graph.edges],
      ["The drawing uses the problem's direction", graph.direction],
      ["Edge colors match the input", graph.colors],
      ["Edge labels or weights match the input", graph.labels],
      ["The graph-level diagnosis is correct", selectedId === round.correctDiagnosis],
      ["The incorrect solution's exact output is correct", jsonAnswerMatches($("#reasoning-output").value, round.buggyOutput)]
    ].filter(([label]) => !label.startsWith("Edge colors") || round.canvas.edges.some(edge => edge.color)).filter(([label]) => !label.startsWith("Edge labels") || round.canvas.edges.some(edge => edge.label));
    if (!checks.every(([, pass]) => pass)) {
      reasoningProgress.mistakes++;
      reasoningProgress.attempts++;
      saveReasoningProgress();
      updateReasoningProgress(reasoningProgress.index, reasoningRounds());
      const selected = round.diagnoses.find(choice => choice.id === selectedId);
      const diagnosisHelp = selectedId && selectedId !== round.correctDiagnosis ? `<div class="feedback-next"><b>About your diagnosis:</b> ${esc(selected?.feedback || "Compare the code's graph behavior with the locked problem rule.")}</div>` : "";
      $("#feedback-slot").innerHTML = `<div class="feedback trace-feedback"><b>Check the graph and try again.</b><ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass ? "passed" : "failed"}"><span>${pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${diagnosisHelp}${reasoningWalkthrough(round)}</div>`;
      selectedId = null;
      $$('[data-choice-id]').forEach(item => { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
      $("#reasoning-check").disabled = true;
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#feedback-slot").tabIndex = -1;
      $("#feedback-slot").focus({ preventScroll: true });
      return;
    }
    answered = true;
    lockCounterexampleEditor();
    $("#reasoning-output").disabled = true;
    $$('[data-choice-id]').forEach(button => { button.disabled = true; });
    $("#feedback-slot").innerHTML = `<div class="feedback good trace-success"><b>Trace confirmed.</b><div class="trace-summary"><div><span>Misconception</span><strong>${esc(round.bugTitle)}</strong></div><div><span>Incorrect output</span><strong>${esc(round.buggyOutput)}</strong></div><div><span>Correct output</span><strong>${esc(round.correctOutput)}</strong></div></div>${reasoningWalkthrough(round, true)}</div>`;
    $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
    $("#feedback-slot").tabIndex = -1;
    $("#feedback-slot").focus({ preventScroll: true });
    const button = $("#reasoning-check");
    button.disabled = false;
    button.innerHTML = reasoningProgress.index + 1 < reasoningRounds().length ? "Next code case <span>→</span>" : "Finish Step 4 <span>→</span>";
    button.onclick = () => { reasoningProgress.index++; reasoningProgress.attempts = 0; reasoningProgress.remedial = false; saveReasoningProgress(); render(); };
  }

  function updateReasoningProgress(done, rounds) {
    const total = Math.max(rounds.length, 1);
    const passed = done - reasoningProgress.skipped.filter(index => index < done).length;
    $("#evidence-label").textContent = "";
    $("#attempt-label").textContent = "";
    $("#evidence-fill").style.width = `${passed / total * 100}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    $("#facet-list").innerHTML = ["exact graph", "exact output", "code behavior", "why it fails"].map(label => `<span class="facet ${passed === total ? "proven" : ""}">${label}</span>`).join("");
    $("#evidence-chip").innerHTML = passed === total ? "<span>✓ Code understood</span>" : "<span class=\"pulse-dot\"></span><span>Debug session active</span>";
  }

  function renderReasoningComplete() {
    $("#graph-lab").hidden = true;
    const skipped = reasoningProgress.skipped.length;
    $("#challenge").innerHTML = `<div class="challenge-body victory reasoning-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Skipped" : "Traced"}</div><h3>${skipped ? "Step 4 skipped." : "Step 4 complete."}</h3><p>${skipped ? `${skipped} code case${skipped === 1 ? "" : "s"} skipped.` : `You solved all ${reasoningRounds().length} code cases.`}</p><div class="completion-actions"><a class="primary-btn link-button" href="/">Choose another problem <span>→</span></a><button id="restart-reasoning" class="ghost-btn">Practice Step 4 again</button></div></div>`;
    $(".test-pane").scrollTop = 0;
    focusPrompt();
    $("#restart-reasoning").onclick = resetReasoning;
  }

  function gradeCanvas(expected, drawing) {
    const expectedLabels = expected.nodes.map(node => normalizeNodeLabel(node.label)).sort();
    const actualLabels = drawing.nodes.map(node => normalizeNodeLabel(node.label)).sort();
    const nodes = new Set(actualLabels).size === actualLabels.length && JSON.stringify(expectedLabels) === JSON.stringify(actualLabels);
    const expectedById = Object.fromEntries(expected.nodes.map(node => [String(node.id), normalizeNodeLabel(node.label)]));
    const actualById = Object.fromEntries(drawing.nodes.map(node => [String(node.id), normalizeNodeLabel(node.label)]));
    const key = (from, to, directed) => directed ? `${from}→${to}` : [from, to].sort().join("—");
    const expectedEdges = expected.edges.map(edge => ({ key: key(expectedById[String(edge.from)], expectedById[String(edge.to)], expected.directed), color: edge.color || "", label: String(edge.label || "").trim() })).sort((a, b) => a.key.localeCompare(b.key));
    const actualEdges = drawing.edges.map(edge => ({ key: key(actualById[String(edge.from)], actualById[String(edge.to)], expected.directed), color: semanticColor(edge.color), label: String(edge.label || "").trim() })).sort((a, b) => a.key.localeCompare(b.key));
    const edges = nodes && JSON.stringify(expectedEdges.map(edge => edge.key)) === JSON.stringify(actualEdges.map(edge => edge.key));
    const direction = drawing.directed === expected.directed;
    const colors = edges && expectedEdges.every((edge, index) => !edge.color || edge.color === actualEdges[index].color);
    const labels = edges && expectedEdges.every((edge, index) => edge.label === actualEdges[index].label);
    return { nodes, edges, direction, colors, labels };
  }

  function normalizeNodeLabel(value) {
    const label = String(value).trim();
    if (!usesGridCellLabels()) return label;
    const coordinate = label.match(/^(?:\(\s*(\d+)\s*,\s*(\d+)\s*\)|(\d+)\s*,\s*(\d+))$/);
    return coordinate ? `(${coordinate[1] ?? coordinate[3]},${coordinate[2] ?? coordinate[4]})` : label;
  }

  function semanticColor(value) {
    const normalized = String(value || "").toLowerCase();
    return Object.keys(colorValues).find(name => colorValues[name] === normalized) || "";
  }

  function miniGraph(model, rawInput = "") {
    if (problem.visualKind === "nested") return nestedMiniGraph(model, rawInput);
    const width = 520, height = 240;
    const metrics = model.nodes.map(node => miniNodeMetrics(node.label));
    const clearance = Math.max(...metrics.map(metric => metric.width / 2), 20) + 5;
    const bounds = {
      x: Math.max(...metrics.map(metric => metric.width / 2)) + 4,
      y: Math.max(...metrics.map(metric => metric.height / 2)) + 4
    };
    const positions = safeMiniLayout(model, layout(model, width, height), width, height, clearance, bounds);
    const byId = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), positions[index]]));
    const metricById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), metrics[index]]));
    const edges = model.edges.map(edge => {
      const from = byId[String(edge.from)], to = byId[String(edge.to)];
      if (!from || !to) return "";
      const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1;
      const ux = dx / length, uy = dy / length;
      const fromBoundary = miniNodeBoundary(metricById[String(edge.from)], ux, uy) + 4;
      const toBoundary = miniNodeBoundary(metricById[String(edge.to)], ux, uy) + 4;
      const start = { x: from.x + ux * fromBoundary, y: from.y + uy * fromBoundary };
      const tip = { x: to.x - ux * toBoundary, y: to.y - uy * toBoundary };
      const color = colorValues[edge.color] || "#8392a8";
      const line = `<line x1="${start.x}" y1="${start.y}" x2="${tip.x}" y2="${tip.y}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
      const arrow = model.directed ? `<polygon points="${tip.x},${tip.y} ${tip.x - ux * 13 - uy * 7},${tip.y - uy * 13 + ux * 7} ${tip.x - ux * 13 + uy * 7},${tip.y - uy * 13 - ux * 7}" fill="${color}"/>` : "";
      const label = edge.label ? `<text class="mini-edge-label" x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 7}">${esc(edge.label)}</text>` : "";
      return line + arrow + label;
    }).join("");
    const nodes = model.nodes.map((node, index) => {
      const position = positions[index], metric = metrics[index];
      const shape = metric.round
        ? `<circle cx="${position.x}" cy="${position.y}" r="${metric.width / 2}"/>`
        : `<rect x="${position.x - metric.width / 2}" y="${position.y - metric.height / 2}" width="${metric.width}" height="${metric.height}" rx="${metric.height / 2}"/>`;
      const firstY = position.y - (metric.lines.length - 1) * 7;
      const label = metric.lines.map((line, lineIndex) => `<tspan x="${position.x}" y="${firstY + lineIndex * 14}">${esc(line)}</tspan>`).join("");
      return `<g class="mini-node${metric.round ? " is-round" : " is-wide"}">${shape}<text>${label}</text></g>`;
    }).join("");
    const edgeJoiner = model.directed ? " to " : " connected to ";
    const accessibleEdges = model.edges.map(edge => `${model.nodes.find(node => String(node.id) === String(edge.from))?.label ?? edge.from}${edgeJoiner}${model.nodes.find(node => String(node.id) === String(edge.to))?.label ?? edge.to}${edge.color ? `, ${edge.color}` : ""}${edge.label ? `, label ${edge.label}` : ""}`).join("; ");
    const accessibleLabel = `Nodes: ${model.nodes.map(node => node.label).join(", ")}. ${model.directed ? "Arrows" : "Edges"}: ${accessibleEdges || "none"}.`;
    return `<svg class="mini-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(accessibleLabel)}"><g class="mini-edges">${edges}</g><g class="mini-nodes">${nodes}</g></svg>`;
  }

  function miniLabelLines(value) {
    const text = String(value).trim();
    if (text.length <= 9) return [text];
    const lines = [];
    for (const word of text.split(/\s+/)) {
      if (word.length > 12) {
        for (let index = 0; index < word.length; index += 12) lines.push(word.slice(index, index + 12));
      } else if (!lines.length || `${lines[lines.length - 1]} ${word}`.length > 12) {
        lines.push(word);
      } else {
        lines[lines.length - 1] += ` ${word}`;
      }
    }
    return lines;
  }

  function miniNodeMetrics(value) {
    const lines = miniLabelLines(value);
    const longest = Math.max(...lines.map(line => line.length), 1);
    const round = lines.length === 1 && longest <= 4;
    return { lines, round, width: round ? 40 : Math.max(58, longest * 7.2 + 18), height: round ? 40 : lines.length * 14 + 16 };
  }

  function miniNodeBoundary(metric, ux, uy) {
    if (metric.round) return metric.width / 2;
    return Math.min(Math.abs(ux) > .001 ? metric.width / 2 / Math.abs(ux) : Infinity, Math.abs(uy) > .001 ? metric.height / 2 / Math.abs(uy) : Infinity);
  }

  function nestedMiniGraph(model, rawInput = "") {
    const width = 600, height = 300;
    const positions = safeMiniLayout(model, layout(model, width, height), width, height, 52, { x: 51, y: 28 });
    const byId = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), positions[index]]));
    const hasChildren = new Set(model.edges.map(edge => String(edge.from)));
    const rawItems = nestedInputItems(rawInput);
    const displayNodes = model.nodes.map((node, index) => {
      const naturalLabel = nestedLabelParts(node.label, false, rawItems[index]);
      const isContainer = rawItems[index]
        ? rawItems[index].container
        : hasChildren.has(String(node.id)) || naturalLabel.container || /^(?:root|empty|[A-Z]|L\d+)$/.test(String(node.label).trim());
      return { isContainer, label: nestedLabelParts(node.label, isContainer, rawItems[index]) };
    });
    const displayById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), displayNodes[index].label]));
    const edges = model.edges.map(edge => {
      const from = byId[String(edge.from)], to = byId[String(edge.to)];
      if (!from || !to) return "";
      const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1;
      const ux = dx / length, uy = dy / length;
      const boundary = Math.min(Math.abs(ux) > .001 ? 48 / Math.abs(ux) : Infinity, Math.abs(uy) > .001 ? 25 / Math.abs(uy) : Infinity) + 3;
      const start = { x: from.x + ux * boundary, y: from.y + uy * boundary };
      const tip = { x: to.x - ux * boundary, y: to.y - uy * boundary };
      const color = colorValues[edge.color] || "#8392a8";
      const line = `<line x1="${start.x}" y1="${start.y}" x2="${tip.x}" y2="${tip.y}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
      const arrow = model.directed ? `<polygon points="${tip.x},${tip.y} ${tip.x - ux * 13 - uy * 7},${tip.y - uy * 13 + ux * 7} ${tip.x - ux * 13 + uy * 7},${tip.y - uy * 13 - ux * 7}" fill="${color}"/>` : "";
      return line + arrow;
    }).join("");
    const nodes = model.nodes.map((node, index) => {
      const { isContainer, label } = displayNodes[index];
      const position = positions[index];
      const mainY = label.path ? position.y - 5 : position.y + 4;
      return `<g class="nested-mini-node ${isContainer ? "is-container" : "is-value"}"><rect x="${position.x - 48}" y="${position.y - 25}" width="96" height="50" rx="${isContainer ? 12 : 25}"/><text class="nested-mini-main" x="${position.x}" y="${mainY}">${esc(label.main)}</text>${label.path ? `<text class="nested-mini-path" x="${position.x}" y="${position.y + 13}">${esc(label.path)}</text>` : ""}</g>`;
    }).join("");
    const relation = model.directed ? "contains" : "is connected to";
    const spoken = label => label ? `${label.main}${label.path ? ` ${label.path}` : ""}` : "unknown item";
    const accessibleEdges = model.edges.map(edge => `${spoken(displayById[String(edge.from)])} ${relation} ${spoken(displayById[String(edge.to)])}`).join("; ");
    const accessibleLabel = `Nested items: ${displayNodes.map(item => spoken(item.label)).join(", ")}. Direct containment: ${accessibleEdges || "none"}.`;
    return `<svg class="mini-graph nested-mini-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(accessibleLabel)}"><g class="mini-edges">${edges}</g><g class="nested-mini-nodes">${nodes}</g></svg>`;
  }

  function nestedInputItems(input) {
    const text = String(input || "");
    const start = text.indexOf("[");
    if (start < 0) return [];
    let depth = 0, end = -1, quote = "";
    for (let index = start; index < text.length; index++) {
      const character = text[index];
      if (quote) {
        if (character === quote && text[index - 1] !== "\\") quote = "";
        continue;
      }
      if (character === '"' || character === "'") { quote = character; continue; }
      if (character === "[") depth++;
      if (character === "]" && --depth === 0) { end = index + 1; break; }
    }
    if (end < 0) return [];
    try {
      const json = text.slice(start, end).replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, contents) => JSON.stringify(contents.replace(/\\'/g, "'")));
      const value = JSON.parse(json);
      if (!Array.isArray(value)) return [];
      const items = [];
      const visit = (item, path) => {
        items.push({ container: Array.isArray(item), main: Array.isArray(item) ? (path ? "Array" : "Outer array") : String(item), path: path ? `at ${path}` : "" });
        if (Array.isArray(item)) item.forEach((child, index) => visit(child, `${path}[${index}]`));
      };
      visit(value, "");
      return items;
    } catch { return []; }
  }

  function nestedLabelParts(value, forceContainer = false, rawItem = null) {
    if (rawItem) return { ...rawItem, container: forceContainer || rawItem.container };
    const text = String(value).trim();
    const rooted = text.match(/^root((?:\[\d+\])*)=(.*)$/);
    if (rooted) {
      const path = rooted[1];
      const item = rooted[2].trim();
      const container = forceContainer || item === "[]";
      return { main: path ? (container ? "Array" : item) : "Outer array", path: path ? `at ${path}` : "", container };
    }
    const positionedArray = text.match(/^((?:\[\d+\])+)(?:\s+array)$/i);
    if (positionedArray) return { main: "Array", path: `at ${positionedArray[1]}`, container: true };
    const positionedValue = text.match(/^((?:\[\d+\])+)=?(.*)$/);
    if (positionedValue && positionedValue[2]) return { main: positionedValue[2].trim(), path: `at ${positionedValue[1]}`, container: forceContainer };
    if (/^outer array$/i.test(text)) return { main: "Outer array", path: "", container: true };
    return { main: forceContainer ? "Array" : text, path: forceContainer ? `label ${text}` : "integer item", container: forceContainer };
  }
  function layout(model, width, height) {
    const count = model.nodes.length;
    if (count === 1) return [{ x: width / 2, y: height / 2 }];
    const coordinates = model.nodes.map(node => coordinate(node.label));
    if (coordinates.every(Boolean)) {
      const rows = coordinates.map(([row]) => row), columns = coordinates.map(([, column]) => column);
      const minRow = Math.min(...rows), maxRow = Math.max(...rows), minColumn = Math.min(...columns), maxColumn = Math.max(...columns);
      const positions = coordinates.map(([row, column]) => ({
        x: 42 + (column - minColumn) / Math.max(maxColumn - minColumn, 1) * (width - 84),
        y: 34 + (row - minRow) / Math.max(maxRow - minRow, 1) * (height - 68)
      }));
      return safeMiniLayout(model, positions, width, height);
    }
    if (["tree", "nested", "backtracking"].includes(problem.visualKind)) {
      const indexById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), index]));
      const children = Array.from({ length: count }, () => []);
      const incoming = Array(count).fill(0);
      for (const edge of model.edges) {
        const from = indexById[String(edge.from)], to = indexById[String(edge.to)];
        if (from === undefined || to === undefined) continue;
        children[from].push(to);
        incoming[to]++;
        if (!model.directed) children[to].push(from);
      }
      const roots = incoming.map((value, index) => value === 0 ? index : -1).filter(index => index >= 0);
      const levels = Array(count).fill(-1), queue = roots.length ? [...roots] : [0];
      queue.forEach(root => { levels[root] = 0; });
      while (queue.length) {
        const current = queue.shift();
        for (const next of children[current]) if (levels[next] < 0) { levels[next] = levels[current] + 1; queue.push(next); }
      }
      const deepest = Math.max(...levels, 0);
      levels.forEach((level, index) => { if (level < 0) levels[index] = deepest + 1; });
      const rows = Array.from({ length: Math.max(...levels) + 1 }, () => []);
      levels.forEach((level, index) => rows[level].push(index));
      const positions = Array(count);
      rows.forEach((row, level) => row.forEach((index, column) => {
        positions[index] = { x: width * (column + 1) / (row.length + 1), y: 28 + level * (height - 56) / Math.max(rows.length - 1, 1) };
      }));
      return safeMiniLayout(model, positions, width, height);
    }
    const variant = problemIndex % 4;
    let positions;
    if (variant === 1) positions = Array.from({ length: count }, (_, index) => ({ x: 55 + index / Math.max(count - 1, 1) * (width - 110), y: index % 2 ? height * .73 : height * .27 }));
    else if (variant === 2) positions = Array.from({ length: count }, (_, index) => ({ x: index < Math.ceil(count / 2) ? width * .23 : width * .77, y: 40 + (index % Math.ceil(count / 2)) * (height - 80) / Math.max(Math.ceil(count / 2) - 1, 1) }));
    else if (variant === 3) positions = Array.from({ length: count }, (_, index) => index === 0 ? { x: width / 2, y: height / 2 } : ({ x: width / 2 + Math.cos(-Math.PI / 2 + (index - 1) * Math.PI * 2 / Math.max(count - 1, 1)) * width * .34, y: height / 2 + Math.sin(-Math.PI / 2 + (index - 1) * Math.PI * 2 / Math.max(count - 1, 1)) * height * .32 }));
    else positions = circularLayout(count, width, height);
    return safeMiniLayout(model, positions, width, height);
  }

  function safeMiniLayout(model, positions, width, height, clearance = 20, bounds = { x: 20, y: 20 }) {
    const unsafe = layoutHasNodeEdgeOverlap(model, positions, clearance) || layoutHasOutOfBounds(positions, width, height, bounds);
    return unsafe ? collisionFreeMiniLayout(model, width, height, clearance, bounds) : positions;
  }

  function collisionFreeMiniLayout(model, width, height, clearance = 20, bounds = { x: 20, y: 20 }) {
    const xInset = Math.max(40, bounds.x);
    const yInset = Math.max(32, bounds.y);
    const slots = Array.from({ length: 15 }, (_, index) => ({
      x: xInset + (index % 5) * (width - xInset * 2) / 4,
      y: yInset + Math.floor(index / 5) * (height - yInset * 2) / 2
    }));
    const signature = JSON.stringify([model.nodes.map(node => node.id), model.edges.map(edge => [edge.from, edge.to])]);
    let baseSeed = [...signature].reduce((value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0, 2166136261);
    for (let attempt = 0; attempt < 600; attempt++) {
      let seed = (baseSeed + Math.imul(attempt + 1, 2654435761)) >>> 0;
      const shuffled = [...slots];
      for (let index = shuffled.length - 1; index > 0; index--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const swap = seed % (index + 1);
        [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
      }
      const candidate = shuffled.slice(0, model.nodes.length);
      if (!layoutHasNodeEdgeOverlap(model, candidate, clearance) && !layoutHasOutOfBounds(candidate, width, height, bounds)) return candidate;
    }
    return circularLayout(model.nodes.length, width, height, bounds);
  }

  function circularLayout(count, width, height, bounds = { x: 20, y: 20 }) {
    const rx = Math.min(width * (count > 4 ? .34 : .32), width / 2 - bounds.x);
    const ry = Math.min(height * (count > 4 ? .32 : .29), height / 2 - bounds.y);
    return Array.from({ length: count }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      return { x: width / 2 + Math.cos(angle) * rx, y: height / 2 + Math.sin(angle) * ry };
    });
  }

  function layoutHasNodeEdgeOverlap(model, positions, clearance = 20) {
    const indexById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), index]));
    return model.edges.some(edge => {
      const fromIndex = indexById[String(edge.from)], toIndex = indexById[String(edge.to)];
      const from = positions[fromIndex], to = positions[toIndex];
      if (!from || !to) return false;
      return positions.some((point, index) => index !== fromIndex && index !== toIndex && pointToSegmentDistance(point, from, to) < clearance);
    });
  }

  function layoutHasOutOfBounds(positions, width, height, bounds) {
    return positions.some(point => point.x < bounds.x || point.x > width - bounds.x || point.y < bounds.y || point.y > height - bounds.y);
  }

  function pointToSegmentDistance(point, from, to) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const lengthSquared = dx * dx + dy * dy;
    const amount = lengthSquared ? Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared)) : 0;
    return Math.hypot(point.x - (from.x + amount * dx), point.y - (from.y + amount * dy));
  }

  function updateProgress() {
    const total = 9;
    const done = Math.min(progress.index, total);
    const passed = done - progress.skipped.filter(index => index < done).length;
    $("#evidence-label").textContent = `${passed} of ${total} visual checks passed`;
    $("#attempt-label").textContent = progress.mistakes ? `${progress.mistakes} correction${progress.mistakes === 1 ? "" : "s"}` : "Clean run";
    $("#evidence-fill").style.width = `${passed / total * 100}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    const facets = problem?.lesson?.facets || ["exact picture", "direct connections", "problem rule", "boundary cases"];
    const passedTasks = mainTasks().slice(0, done).filter((_, index) => !progress.skipped.includes(index));
    $("#facet-list").innerHTML = facets.map(facet => `<span class="facet ${passedTasks.some(task => task.facet === facet) ? "proven" : ""}">${esc(facet)}</span>`).join("");
    $("#evidence-chip").innerHTML = done === total ? "<span>✓ Visual proof complete</span>" : "<span class=\"pulse-dot\"></span><span>Checking pictures</span>";
  }

  function renderComplete() {
    $("#graph-lab").hidden = true;
    const skipped = progress.skipped.length;
    const passed = mainTasks().length - skipped;
    $("#challenge").innerHTML = `<div class="challenge-body victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Proven"}</div><h3>${skipped ? "Step 1 finished." : "Step 1 complete."}</h3><p>${skipped ? `${passed} passed · ${skipped} skipped.` : `You built four fresh inputs and checked five realistic mistakes.`}</p><div class="completion-actions"><button id="start-counterexamples" class="primary-btn">Start Step 2 <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-visual" class="ghost-btn">Practice Step 1 again</button></div></div>`;
    $("#start-counterexamples").onclick = () => switchSection(2);
    $("#restart-visual").onclick = reset;
  }

  function renderMissingLesson() {
    $("#graph-lab").hidden = true;
    $("#challenge").innerHTML = `<div class="challenge-body"><h3>This lesson is still being authored.</h3><p>Its nine problem-specific visual checks are required before it can ship.</p><a class="primary-btn link-button" href="/">Choose another problem <span>→</span></a></div>`;
  }

  function loadProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey()) || "{}");
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), 9), mistakes: Math.max(Number(value.mistakes) || 0, 0), remedialFor: value.remedialFor || null, skipped: Array.isArray(value.skipped) ? value.skipped.map(Number) : [] };
    } catch { return { index: 0, mistakes: 0, remedialFor: null, skipped: [] }; }
  }
  function saveProgress() { localStorage.setItem(storageKey(), JSON.stringify(progress)); }
  function storageKey() { return `dfs-visual:${problem.id}:v${data.version}-coffee-rollout`; }
  function loadCounterProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(counterStorageKey()) || "{}");
      const total = problem.counterexampleLesson?.rounds?.length || 3;
      const skipped = Array.isArray(value.skipped)
        ? [...new Set(value.skipped.map(Number).filter(index => Number.isInteger(index) && index >= 0 && index < total))]
        : [];
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), total), mistakes: Math.max(Number(value.mistakes) || 0, 0), hints: Math.max(Number(value.hints) || 0, 0), skills: Array.isArray(value.skills) && value.skills.length === 4 ? value.skills.map(Boolean) : [false, false, false, false], skipped };
    } catch { return { index: 0, mistakes: 0, hints: 0, skills: [false, false, false, false], skipped: [] }; }
  }
  function saveCounterProgress() { localStorage.setItem(counterStorageKey(), JSON.stringify(counterProgress)); }
  function counterStorageKey() { return `dfs-counterexamples:${problem.id}:v4`; }
  function loadStructureProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(structureStorageKey()) || "{}");
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), 5), mistakes: Math.max(Number(value.mistakes) || 0, 0), claimVariant: Math.max(Number(value.claimVariant) || 0, 0), skipped: Array.isArray(value.skipped) ? value.skipped.map(Number) : [] };
    } catch { return { index: 0, mistakes: 0, claimVariant: 0, skipped: [] }; }
  }
  function saveStructureProgress() { localStorage.setItem(structureStorageKey(), JSON.stringify(structureProgress)); }
  function structureStorageKey() { return `dfs-structure:${problem.id}:v7`; }
  function loadReasoningProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(reasoningStorageKey()) || "{}");
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), reasoningRounds().length), mistakes: Math.max(Number(value.mistakes) || 0, 0), attempts: Math.max(Number(value.attempts) || 0, 0), remedial: false, skipped: Array.isArray(value.skipped) ? value.skipped.map(Number) : [] };
    } catch { return { index: 0, mistakes: 0, attempts: 0, remedial: false, skipped: [] }; }
  }
  function saveReasoningProgress() { localStorage.setItem(reasoningStorageKey(), JSON.stringify(reasoningProgress)); }
  function reasoningStorageKey() { return `dfs-reasoning:${problem.id}:v2`; }
  function resetCurrentSection() { if (section === 4) resetReasoning(); else if (section === 3) resetStructure(); else if (section === 2) resetCounterexamples(); else reset(); }
  function reset() {
    if (progress.index > 0 && !confirm("Restart the entire visual proof from the first blank graph?")) return;
    progress = { index: 0, mistakes: 0, remedialFor: null, skipped: [] };
    saveProgress();
    render();
  }
  function resetCounterexamples() {
    if (counterProgress.index > 0 && !confirm("Restart Step 2 from the first counterexample?")) return;
    counterProgress = { index: 0, mistakes: 0, hints: 0, skills: [false, false, false, false], skipped: [] };
    saveCounterProgress();
    render();
  }
  function resetStructure() {
    if (structureProgress.index > 0 && !confirm("Restart Step 3 from the first graph check?")) return;
    structureProgress = { index: 0, mistakes: 0, claimVariant: 0, skipped: [] };
    saveStructureProgress();
    render();
  }
  function resetReasoning() {
    if (reasoningProgress.index > 0 && !confirm("Restart the Step 4 code cases?")) return;
    reasoningProgress = { index: 0, mistakes: 0, attempts: 0, remedial: false, skipped: [] };
    saveReasoningProgress();
    render();
  }
  function setMobilePane(pane) {
    document.body.classList.toggle("show-problem", pane === "problem");
    $$("#mobile-switcher button").forEach(button => { const active = button.dataset.pane === pane; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  }
  function formatText(value) { return esc(value).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"); }
  function focusPrompt() { queueMicrotask(() => { const heading = $("#challenge h3"); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }); }

  window.DFS_VISUAL_LIBRARY = { start, gradeCanvas, layout };
  start();
})();
