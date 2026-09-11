(() => {
  const data = window.DFS_VISUAL_DATA;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  let aiRequest = null;
  function clearAiHelp() {
    aiRequest?.abort();
    aiRequest = null;
    $("#ai-help")?.remove();
  }
  window.addEventListener("dfs-graph-change", () => {
    clearAiHelp();
    if (section === 6) queueMicrotask(refreshCodingHelp);
  });
  document.addEventListener("input", event => {
    if (event.target.closest("#challenge")) {
      clearAiHelp();
      if (section === 6) queueMicrotask(refreshCodingHelp);
    }
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-choice-id], [data-claim-index]")) clearAiHelp();
  });

  function offerAiHelp(attempt) {
    clearAiHelp();
    const slot = $("#feedback-slot");
    if (!slot) return;
    const panel = document.createElement("div");
    panel.id = "ai-help";
    panel.className = "ai-help";
    panel.innerHTML = '<button type="button">Ask AI for help</button><p class="ai-help-answer" role="status" aria-live="polite" hidden></p>';
    slot.append(panel);
    const button = $("button", panel);
    const answer = $("p", panel);
    button.onclick = async () => {
      aiRequest?.abort();
      const controller = new AbortController();
      aiRequest = controller;
      button.disabled = true;
      button.textContent = "Asking Luna…";
      answer.hidden = false;
      answer.textContent = "Looking at your attempt…";
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      let output = "";
      let completed = false;
      let timedOut = false;
      const timeout = section === 6 ? setTimeout(() => { timedOut = true; controller.abort(); }, 45000) : null;
      try {
        let currentAttempt = typeof attempt === "function" ? attempt() : attempt;
        let graphRules = problem.graphRules;
        if (usesArrayNumberDrawing()) {
          currentAttempt = arrayDrawingHelpAttempt(currentAttempt);
          graphRules = {
            nodes: "Every array is labeled Array. Each separate value has its own node. Repeated Array labels and repeated values are valid; node IDs distinguish occurrences.",
            edges: "An Array points to each element directly inside it.",
            drawingEditor: arrayDrawingOptions(),
            privateIds: "Names like root[0] are internal IDs, never names students must type. Never show these IDs or ask students to rename nodes. Use Array, Number, and child positions. For drawing 2 apply the stated mistake, including reversed arrows or disconnected nodes."
          };
        }
        const context = JSON.stringify({
          problem: { id: problem.id, title: problem.title, statement: problem.statement, graphRules },
          section, attempt: currentAttempt,
          graderFeedback: [...slot.childNodes].filter(node => node !== panel).map(node => node.textContent).join("\n")
        });
        const response = await fetch("/api/ai-help", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: context, signal: controller.signal
        });
        if (!response.ok) throw new Error(await response.text());
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let pending = "";
        while (true) {
          const { value, done } = await reader.read();
          pending += decoder.decode(value, { stream: !done }).replace(/\r/g, "");
          let boundary;
          while ((boundary = pending.indexOf("\n\n")) >= 0) {
            const frame = pending.slice(0, boundary);
            pending = pending.slice(boundary + 2);
            const json = frame.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trim()).join("\n");
            if (!json || json === "[DONE]") continue;
            const event = JSON.parse(json);
            if (event.type === "response.output_text.delta") {
              output += event.delta;
              answer.textContent = output;
            }
            if (event.type === "response.completed") completed = true;
            if (["error", "response.failed", "response.incomplete"].includes(event.type)) throw new Error("AI help stopped. Please try again.");
          }
          if (done) break;
        }
        if (!completed || !output) throw new Error("AI help stopped. Please try again.");
      } catch (error) {
        if (controller.signal.aborted && !timedOut) return;
        if (timedOut) answer.textContent = "AI help took too long. Your code is still here. Please try again.";
        else answer.textContent = output ? `${output}\n\nThe answer was cut short. Please try again.` : error.message;
      } finally {
        clearTimeout(timeout);
        if ((!controller.signal.aborted || timedOut) && panel.isConnected) {
          button.disabled = false;
          button.textContent = "Ask AI again";
        }
      }
    };
  }

  const categoryNames = { original: "Original", variant: "Variants", new: "New" };
  const colorValues = { slate: "#8392a8", red: "#ff7e82", blue: "#72a7ff", amber: "#f1b75b" };
  const STEP3_MEMBERSHIP_OVERRIDES = {
    "battleships-in-a-board": "include-water-nodes",
    "is-graph-bipartite": "duplicate-adjacency-nodes",
    "minesweeper": "region-as-node",
    "nested-list-weight-sum": "omit-list-nodes",
    "network-delay-time": "weight-as-node",
    "time-needed-to-inform-all-employees": "omit-leaf-employees",
    "who-keeps-their-job": "omit-leaves",
    "coins-on-level-k": "depth-as-node",
    "counting-constellations": "component-as-node",
    "routes-past-the-coffee-cart": "street-as-node",
    "flooded-campsite-trails": "model-obstacles-only",
    "one-color-metro-ride": "duplicate-station-by-color",
    "office-rumor-reach": "edge-as-node",
    "runes-on-the-castle-door": "leaves-only",
    "shut-the-garden-valve": "pipe-as-node",
    "gold-and-silver-lights": "color-as-node",
    "museum-vault-keyring": "key-instance-as-node",
    "count-sub-islands": "uses-only-invalid-cells",
    "structy-max-root-to-leaf-path-sum": "drops-negative-nodes",
    "path-sum": "counts-only-leaf",
    "reachable-nodes-with-restrictions": "hides-restriction-boundaries",
    "properties-graph": "uses-pairs-as-nodes"
  };
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
  // Original/new source content is archived for a future return. Keep the full
  // reference bank to preserve variant parent links and stable lesson indices.
  const allProblems = data.problems;
  const activeCategories = [
    // "original", // ARCHIVED: not part of the current app.
    "variant",
    // "new", // ARCHIVED: not part of the current app.
  ];
  // Restore guide: docs/lesson-steps-2026-09-09.md. Full content stays below.
  const variantPractice = { sections: [1, 2, 6], step2Questions: 2 };
  let problem = null;
  let problemIndex = -1;
  let progress = null;
  let counterProgress = null;
  let structureProgress = null;
  let reasoningProgress = null;
  let debuggingProgress = null;
  let codingRunner = null;
  let codingRunVersion = 0;
  let codingResult = null;
  let counterDrawings = { correct: null, mistaken: null };
  let counterDrawingMode = "correct";
  let counterDuplicated = false;
  let counterGraphChangeHandler = null;
  let structureRetryDrawing = null;
  let section = 1;
  let selectedId = null;
  let answered = false;
  let pendingAdvance = null;
  let draftKey = null;
  let restoringDraft = false;
  const MANUAL_COMPLETION_KEY = "dfs-manual-completed:v1";
  const DEVICE_ID_KEY = "dfs-device-id:v1";
  let manualCompleted = {};
  let manualSyncStarted = false;
  let manualSyncPromise = null;
  let manualSyncStatus = "syncing";
  let manualChangedDuringSync = false;

  function start() {
    loadManualCompletionCache();
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
    if (!activeCategories.includes(problem.category)) return renderPicker("This lesson is archived. Choose a variant below.");
    progress = loadProgress();
    counterProgress = loadCounterProgress();
    structureProgress = loadStructureProgress();
    reasoningProgress = loadReasoningProgress();
    debuggingProgress = loadDebuggingProgress();
    section = availableSections().includes(Number(new URLSearchParams(location.search).get("section"))) ? Number(new URLSearchParams(location.search).get("section")) : 1;
    renderLessonShell();
    render();
  }

  function renderPicker(notice = "") {
    if (!manualSyncStarted) {
      manualSyncStarted = true;
      manualSyncPromise = loadManualCompletionFromCloud();
    }
    document.title = "Visual DFS Problem Library";
    document.body.className = "choosing-pair visual-picker-page";
    let savedTheme = "dark";
    try { savedTheme = localStorage.getItem("dfs-theme") || "dark"; } catch {}
    document.documentElement.dataset.theme = savedTheme;
    const picker = $("#pair-picker");
    picker.hidden = false;
    picker.innerHTML = `<button class="theme-toggle" id="visual-theme-toggle" aria-label="Switch theme"><svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg></button>
      <main class="home"><div class="problem-list-topbar"><div><strong>DFS Visual Proof Library</strong><span class="picker-subtitle">Check off anything you’ve completed.</span></div><span class="picker-sync-status ${manualSyncStatus === "offline" ? "offline" : ""}" role="status">${manualSyncStatus === "syncing" ? "Syncing progress…" : manualSyncStatus === "offline" ? "Offline · saved on this device" : "Progress saved online"}</span>${notice ? `<span class="picker-message" role="status">${esc(notice)}</span>` : ""}</div><div class="columns">${renderCategoryColumns()}</div></main>`;
    $("#visual-theme-toggle").onclick = () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("dfs-theme", theme); } catch {}
    };
    $$(".card-check-toggle").forEach(button => {
      button.onclick = () => toggleManualCompletion(button.dataset.problemId);
    });
  }

  function renderCategoryColumns() {
    return activeCategories.map(category => {
      const items = sortProblems(allProblems.filter(item => item.category === category));
      const manualCount = items.filter(item => isManuallyCompleted(item)).length;
      return `<section class="col-${category}" aria-labelledby="category-${category}"><div class="column-head"><span class="column-dot"></span><h2 id="category-${category}">${category}</h2><span class="column-count">${manualCount}/${items.length}</span></div><div class="card-list">${items.map(item => {
        const complete = isProblemComplete(item);
        const manuallyCompleted = isManuallyCompleted(item);
        return `<div class="card${complete || manuallyCompleted ? " completed" : ""}"><a class="card-link" href="/${encodeURIComponent(item.id)}"><span class="card-title">${esc(item.title)}</span>${complete ? `<span class="card-auto-status">Proven</span>` : ""}</a><button class="card-check-toggle${manuallyCompleted ? " checked" : ""}" type="button" data-problem-id="${esc(item.id)}" aria-pressed="${manuallyCompleted}" aria-label="${manuallyCompleted ? "Uncheck" : "Check off"} ${esc(item.title)}"><span aria-hidden="true">${manuallyCompleted ? "✓" : ""}</span></button></div>`;
      }).join("")}</div></section>`;
    }).join("");
  }

  function isManuallyCompleted(item) {
    return manualCompleted[item.id] === true;
  }

  function toggleManualCompletion(id) {
    manualChangedDuringSync = true;
    manualCompleted[id] = manualCompleted[id] !== true;
    saveManualCompletionCache();
    manualSyncStatus = "syncing";
    renderPicker();
    document.querySelector(`[data-problem-id="${CSS.escape(id)}"]`)?.focus();
    void saveManualCompletionToCloud();
  }

  function loadManualCompletionCache() {
    try {
      const saved = JSON.parse(localStorage.getItem(MANUAL_COMPLETION_KEY) || "{}");
      manualCompleted = Object.fromEntries(Object.entries(saved).filter(([id, value]) => value === true && allProblems.some(item => item.id === id)));
    } catch {
      manualCompleted = {};
    }
  }

  function saveManualCompletionCache() {
    try { localStorage.setItem(MANUAL_COMPLETION_KEY, JSON.stringify(manualCompleted)); } catch {}
  }

  function getDeviceId() {
    try {
      const saved = localStorage.getItem(DEVICE_ID_KEY);
      if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) return saved;
      const created = globalThis.crypto?.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
        const random = Math.random() * 16 | 0;
        const value = character === "x" ? random : random & 3 | 8;
        return value.toString(16);
      });
      localStorage.setItem(DEVICE_ID_KEY, created);
      return created;
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
        const random = Math.random() * 16 | 0;
        const value = character === "x" ? random : random & 3 | 8;
        return value.toString(16);
      });
    }
  }

  function completedProblemIds() {
    return Object.entries(manualCompleted).filter(([, value]) => value === true).map(([id]) => id);
  }

  async function loadManualCompletionFromCloud() {
    try {
      const response = await fetch(`/api/progress?deviceId=${encodeURIComponent(getDeviceId())}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Progress could not be loaded.");
      const saved = await response.json();
      if (saved.found && !manualChangedDuringSync) {
        manualCompleted = Object.fromEntries((Array.isArray(saved.completedProblemIds) ? saved.completedProblemIds : []).map(id => [id, true]));
        saveManualCompletionCache();
      } else {
        await writeManualCompletionToCloud();
      }
      manualSyncStatus = "saved";
    } catch {
      manualSyncStatus = "offline";
    } finally {
      manualSyncPromise = null;
      if (document.body.classList.contains("choosing-pair")) renderPicker();
    }
  }

  async function writeManualCompletionToCloud() {
    const response = await fetch(`/api/progress?deviceId=${encodeURIComponent(getDeviceId())}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedProblemIds: completedProblemIds() })
    });
    if (!response.ok) throw new Error("Progress could not be saved.");
  }

  async function saveManualCompletionToCloud() {
    if (manualSyncPromise) {
      await manualSyncPromise;
      if (manualSyncStatus === "offline") return;
    }
    try {
      await writeManualCompletionToCloud();
      manualSyncStatus = "saved";
      if (document.body.classList.contains("choosing-pair")) renderPicker();
    } catch {
      manualSyncStatus = "offline";
      if (document.body.classList.contains("choosing-pair")) renderPicker();
    }
  }

  function isProblemComplete(item) {
    try {
      if (item.category === "variant" && item.codingLesson && !JSON.parse(localStorage.getItem(`dfs-coding:${item.id}:v1`) || "{}").passed) return false;
      if (item.category === "variant" && item.debuggingLesson?.cases?.length) {
        const debugging = JSON.parse(localStorage.getItem(`dfs-debugging:${item.id}:v1`) || "{}");
        if (Number(debugging.index || 0) < item.debuggingLesson.cases.length || (debugging.skipped || []).length) return false;
      }
      const current = localStorage.getItem(`dfs-reasoning:${item.id}:v3`);
      const legacy = current ? null : localStorage.getItem(`dfs-reasoning:${item.id}:v2`);
      const reasoning = JSON.parse(current || legacy || "{}");
      if (legacy) reasoning.index = Math.min(Math.max(Number(reasoning.index) || 0, 0), 1);
      return Number(reasoning.index) >= (item.codeReasoning?.cases?.length || 0) && !(reasoning.skipped || []).length;
    } catch {
      return false;
    }
  }

  function sortProblems(items) {
    if (items.every(item => item.category === "variant")) {
      return [...items].sort((a, b) => a.variantListOrder - b.variantListOrder);
    }
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
    const nav = document.createElement("nav");
    nav.className = "lesson-step-nav";
    nav.setAttribute("aria-label", "Lesson steps");
    nav.innerHTML = availableSections().map(number => `<button type="button" data-section="${number}">Step ${sectionLabel(number)}</button>`).join("");
    $("#section-nav-btn").before(nav);
    nav.querySelectorAll("button").forEach(button => { button.onclick = () => switchSection(Number(button.dataset.section)); });
    document.addEventListener("input", saveFormDraft);
    document.addEventListener("click", () => queueMicrotask(saveFormDraft));
    window.addEventListener("pagehide", () => { if (pendingAdvance) pendingAdvance(); });
    $("#section-nav-btn").onclick = () => switchSection(adjacentSection());
    window.onpopstate = () => {
      saveFormDraft();
      pendingAdvance?.();
      section = availableSections().includes(Number(new URLSearchParams(location.search).get("section"))) ? Number(new URLSearchParams(location.search).get("section")) : 1;
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
    $("#challenge").oninput = null;
    $("#challenge").onchange = null;
    window.DFS_GRAPH?.setNodeLabelRule(usesArrayNumberDrawing() ? "array-number" : problem.counterexampleLesson?.nodeLabels?.rule || "free", usesArrayNumberDrawing() ? arrayDrawingOptions() : problem.graphRules?.nodeLabelFormat);
    draftKey = null;
    pendingAdvance = null;
    $$("[data-section]").forEach(button => {
      if (Number(button.dataset.section) === section) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    const optional = $(".optional-scratch");
    if (optional) { optional.before($("#graph-lab")); optional.remove(); }
    if (counterGraphChangeHandler) window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
    counterGraphChangeHandler = null;
    const activityLayout = $(".activity-layout");
    const graphLab = $("#graph-lab");
    if (activityLayout && graphLab && graphLab.parentElement !== activityLayout) activityLayout.append(graphLab);
    const isCounterexample = section === 2;
    const isStructure = section === 3;
    const isReasoning = section === 4;
    const isDebugging = section === 5;
    const isCoding = section === 6;
    const questionIndex = section === 1 ? progress.index : section === 2 ? counterProgress.index : section === 3 ? structureProgress.index : section === 4 ? reasoningProgress.index : debuggingProgress.index;
    const questionTotal = section === 1
      ? mainTasks().length
      : section === 2
        ? counterexampleRounds().length
        : section === 3
          ? structureTasks().length
          : section === 4 ? reasoningRounds().length : debuggingRounds().length;
    $("#next-question-btn").hidden = isCoding || questionIndex >= questionTotal;
    $("#next-question-btn").onclick = skipCurrentQuestion;
    document.title = `${problem.title} · ${isCoding ? "Code Lab" : isDebugging ? "Debug Lab" : isReasoning ? "Trace Lab" : isStructure ? "Graph Structure" : isCounterexample ? "Counterexample Lab" : "Visual Proof"}`;
    document.body.classList.toggle("counterexample-route", isCounterexample);
    document.body.classList.toggle("structure-route", isStructure);
    document.body.classList.toggle("reasoning-route", isReasoning);
    document.body.classList.toggle("debugging-route", isDebugging);
    document.body.classList.toggle("coding-route", isCoding);
    document.body.classList.toggle("has-step5", hasStep5());
    const graphActions = $("#graph-lab-actions");
    graphActions.hidden = true;
    graphActions.innerHTML = "";
    $("#section-kicker").textContent = isCoding ? `STEP ${sectionLabel(6)} · CODE LAB` : isDebugging ? "STEP 5 · DEBUG LAB" : isReasoning ? "STEP 4 · TRACE LAB" : isStructure ? "STEP 3 · GRAPH STRUCTURE" : isCounterexample ? "STEP 2 · COUNTEREXAMPLE LAB" : "STEP 1 · VISUAL PROOF";
    $("#section-title").hidden = true;
    $("#section-subtitle").hidden = true;
    $("#evidence-chip").hidden = true;
    $("#section-title").textContent = isReasoning ? "Run the code in your head." : isStructure ? "Test the graph rules." : "Build it. Read it. Prove it.";
    $("#section-subtitle").textContent = isReasoning
      ? "Turn the code into one graph rule, then predict its exact return value."
      : isStructure
      ? "Answer one useful Yes/No question, then build the exact graph."
      : "Answer each question and build exact graphs from fresh inputs.";
    const nextSection = adjacentSection();
    const back = nextSection < section;
    $("#section-nav-btn").innerHTML = `${back ? "Back to" : section === 1 ? "Skip to" : "Next:"} Step ${sectionLabel(nextSection)} <span>${back ? "←" : "→"}</span>`;
  }

  function switchSection(nextSection) {
    if (!availableSections().includes(nextSection)) return;
    saveFormDraft();
    if (pendingAdvance) pendingAdvance();
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
    if (pendingAdvance) { pendingAdvance(); render(); return; }
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
      if (answered) return;
      if (!structureProgress.skipped.includes(structureProgress.index)) structureProgress.skipped.push(structureProgress.index);
      structureProgress.index++;
      saveStructureProgress();
    } else if (section === 5) {
      saveFormDraft();
      if (!debuggingProgress.skipped.includes(debuggingProgress.index)) debuggingProgress.skipped.push(debuggingProgress.index);
      debuggingProgress.index++;
      saveDebuggingProgress();
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
    if (problem.category === "variant" && problem.lesson.practicePlan) {
      const tasks = new Map([...builds, ...concepts].map(task => [task.id, task]));
      return problem.lesson.practicePlan.step1.map(id => tasks.get(id));
    }
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

  let debuggingRequest = null;
  function render() {
    debuggingRequest?.abort();
    debuggingRequest = null;
    stopCodingRun();
    clearAiHelp();
    configureSectionShell();
    if (section === 2) return renderCounterexampleRound();
    if (section === 3) return renderStructureRound();
    if (section === 4) return renderReasoningRound();
    if (section === 5) return renderDebuggingRound();
    if (section === 6) return renderCodingLesson();
    selectedId = null;
    answered = false;
    updateProgress();
    const examplesTab = $('.tab[data-tab="examples"]');
    if (examplesTab) examplesTab.hidden = true;
    if (!problem.lesson) return renderMissingLesson();
    if (progress.index >= mainTasks().length) return renderComplete();
    const task = currentTask();
    window.DFS_GRAPH?.setContext(`${problem.id}:${task.id}:${progress.remedialFor || "main"}${usesArrayNumberDrawing() ? ":array-number-v1" : ""}`, 0);
    window.DFS_GRAPH?.setNodeLabelRule(usesArrayNumberDrawing() ? "array-number" : problem.counterexampleLesson?.nodeLabels?.rule || "free", usesArrayNumberDrawing() ? arrayDrawingOptions() : problem.graphRules?.nodeLabelFormat);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = task.kind === "build" ? "Draw the graph from the raw input" : "Optional: draw this input before answering";
    if (task.kind === "build") renderBuild(task);
    else renderConcept(task);
    renderFastTrack();
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
        const started = task.canvas.nodes.length === 0 || Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-choice-id]').forEach(button => { button.disabled = !started; });
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
      counterGraphChangeHandler();
    }
    $$('[data-choice-id]').forEach(button => { button.onclick = () => selectChoice(button.dataset.choiceId, "#visual-check"); });
    $("#visual-check").onclick = () => checkBuild(task);
    restoreFormDraft(task.id);
    focusPrompt();
  }

  function usesArrayNumberDrawing() {
    return (section === 1 || [2, 6].includes(section) && problem.category === "variant") && problem.lesson?.drawingEditor?.mode === "array-number";
  }

  function arrayDrawingOptions() {
    return section === 2 ? problem.counterexampleLesson.drawingEditor : problem.lesson.drawingEditor;
  }

  function renderNodeLabelGuide(task) {
    if (usesArrayNumberDrawing()) {
      const guide = arrayDrawingOptions();
      const valueName = guide.valueKind === "literal" ? "Value" : "Number";
      return `<div class="node-label-guide shelf-drawing-guide"><b>${section === 2 ? "Correct graph: two kinds of nodes" : "Two kinds of nodes"}</b><div class="shelf-node-key"><span class="shelf-array-key">Array</span><span>an array, even <code>[]</code></span><span class="shelf-number-key">7</span><span>${guide.valueKind === "literal" ? 'a value: number, quoted text, true, or false' : 'a number from the input'}</span></div><ol>${guide.instructions.map(line => `<li>${esc(line)}</li>`).join("")}</ol>${section === 2 ? "<p>For drawing 2, keep every node and apply the stated mistake. Arrows may change or leave nodes disconnected. If the mistake only changes the search, the two drawings stay the same.</p>" : ""}<p class="shelf-quick-help"><b>Add node → right-click → Array or ${valueName}.</b><br>Choose ${valueName}, type its value, then press Enter. <b>Type / value</b> also opens the menu.<br>For an arrow: click the parent, then the child. Drag nodes to move them.${guide.ordered ? '' : ' Placement and child order are not graded.'}</p></div>`;
    }
    const format = problem.graphRules?.nodeLabelFormat;
    const hasLabels = Boolean(task?.canvas?.edges?.some(edge => edge.label));
    const hasEdgeColors = Boolean(task?.canvas?.edges?.some(edge => edge.color));
    const hasNodeColors = Boolean(task?.canvas?.nodes?.some(node => node.color || node.blocked));
    const nodeColors = [...new Set((task?.canvas?.nodes || []).map(node => node.color || (node.blocked ? "blue" : "")).filter(Boolean))];
    const hasColors = hasEdgeColors || hasNodeColors;
    if (!format?.instruction && !hasLabels && !hasColors) return "";
    return `<div class="node-label-guide">${format?.instruction ? `<b>Required node-name format:</b> ${formatText(format.instruction)}` : ""}${hasLabels ? `<div><b>Edge weights:</b> ${problem.id === "save-the-date-phone-chain" || problem.id === "time-needed-to-inform-all-employees" ? "Label each arrow with the sending employee’s wait time." : "Label each edge with the matching number from the input."} Fractions and equal decimals both work. Select an edge, then use <b>Rename</b> or <kbd>F2</kbd>.</div>` : ""}${hasEdgeColors ? `<div><b>Edge colors:</b> Color every edge to match the input.</div>` : ""}${hasNodeColors ? `<div><b>Node colors:</b> Use ${nodeColors.map(color => `<b>${esc(color)}</b>`).join(" or ")} for the marked nodes in the input.</div>` : ""}</div>`;
  }

  function checkBuild(task) {
    clearAiHelp();
    if (!selectedId || answered) return;
    const result = gradeCanvas(task.canvas, window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false });
    const answerCorrect = selectedId === task.decision.correct;
    const checks = [
      [usesArrayNumberDrawing() ? "Every Array and value has its own node" : "Every exact node label, with no missing or extra node", result.nodes],
      [result.nodes ? (usesArrayNumberDrawing() && problem.lesson.drawingEditor.ordered ? "Every direct arrow and its child order match the input" : "Every exact direct edge, with no missing or extra edge") : "Edge check waits until the nodes are correct", result.nodes ? result.edges : null],
      [task.canvas.directed ? "Edges use the required arrow direction" : "Edges use the required two-way direction", result.direction],
      [result.nodes ? "Graph colors match the input" : "Graph color check waits until the node names are correct", result.nodes ? result.colors : null],
      [result.nodes ? "Edge labels or weights match the input" : "Edge labels or weights check waits until the node names are correct", result.nodes ? result.labels : null],
      ["The decision matches the finished picture", answerCorrect]
    ].filter(([label]) => !label.startsWith("Graph color") || task.canvas.edges.some(edge => edge.color) || task.canvas.nodes.some(node => node.color || node.blocked)).filter(([label]) => !label.startsWith("Edge labels") || task.canvas.edges.some(edge => edge.label));
    const correct = checks.every(([, pass]) => pass);
    if (!correct) {
      progress.mistakes++;
      saveProgress();
      updateProgress();
      const chosen = task.decision.choices.find(choice => choice.id === selectedId);
      const answerHelp = answerCorrect ? "" : `<div class="feedback-next"><b>About your answer:</b> ${formatText(chosen?.feedback || "Use the finished graph to decide again.")}</div>`;
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>${result.nodes && result.edges && result.direction && result.colors && result.labels ? "Your graph is right. Recheck the answer." : "Fix the marked graph details."}</b><ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass == null ? "waiting" : pass ? "passed" : "failed"}"><span>${pass == null ? "•" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${answerHelp}${result.hint ? `<p class="feedback-next">${esc(result.hint)}</p>` : ""}</div>`;
      offerAiHelp({ task, studentGraph: window.DFS_GRAPH?.getSnapshot(), selectedAnswer: selectedId, checks });
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
      ? `<div class="visual-option-grid">${choices.map((choice, index) => `<button class="visual-option" data-choice-id="${esc(choice.id)}" aria-pressed="false"><span>Picture ${String.fromCharCode(65 + index)}</span>${miniGraph(choice.model, task.input)}</button>`).join("")}</div>`
      : `<div class="choices">${choices.map((choice, index) => `<button class="choice" data-choice-id="${esc(choice.id)}" aria-pressed="false"><span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${formatText(choice.label)}</span></button>`).join("")}</div>`;
    const compact = true;
    const rawInput = task.input.trim() === task.prompt.trim() ? "Problem rule — use any small example in the optional drawing." : task.input;
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top"><span class="probe-type">${esc(task.title)}</span><span class="probe-id">VISUAL CHECK ${task.conceptOrdinal} OF 5</span></div>`}<div class="challenge-body"><div class="prompt-code">${esc(rawInput)}</div>${renderNodeLabelGuide(task)}<h3>${formatText(task.prompt)}</h3>${shown}${choiceHtml}<div id="feedback-slot" role="status" aria-live="polite"></div><div class="challenge-actions">${compact ? "" : '<span class="microcopy">Every choice represents a mistake a real student might make.</span>'}<button id="visual-check" class="primary-btn" disabled>Check answer <span>→</span></button></div></div>`;
    ($(".node-label-guide") || $(".prompt-code")).after($("#graph-lab"));
    $$('[data-choice-id]').forEach(button => { button.onclick = () => selectChoice(button.dataset.choiceId, "#visual-check"); });
    $("#visual-check").onclick = () => checkConcept(task);
    const scratch = document.createElement("details");
    scratch.className = "optional-scratch";
    scratch.innerHTML = '<summary>Optional drawing · open scratch pad</summary>';
    $("#graph-lab").before(scratch);
    scratch.append($("#graph-lab"));
    restoreFormDraft(task.id);
    focusPrompt();
  }

  function checkConcept(task) {
    clearAiHelp();
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
    $("#feedback-slot").innerHTML = `<div class="feedback"><b>Contradiction found.</b><div class="feedback-answer correct"><span>Correct choice</span>${task.kind === "visual-options" ? `Picture ${String.fromCharCode(65 + arrangeChoices(task.choices, task.correct, task.answerSlot).findIndex(choice => choice.id === task.correct))}` : formatText(correct.label)}</div><div class="feedback-why"><b>Your choice:</b> ${formatText(choice.feedback)}</div><div class="feedback-next">This revealed answer does not count. Prove the idea on a fresh blank graph.</div></div>`;
    offerAiHelp({ task, selectedAnswer: selectedId, scratchGraphUngraded: true, studentGraph: window.DFS_GRAPH?.getSnapshot() });
    const button = $("#visual-check");
    button.disabled = false;
    button.innerHTML = "Build a fresh proof <span>→</span>";
    button.onclick = render;
  }

  function renderFastTrack() {
    $("#step1-fast-track")?.remove();
    if (!progress.fastTrackEarned || problem.category !== "variant") return;
    const panel = document.createElement("div");
    panel.id = "step1-fast-track";
    panel.className = "feedback good";
    panel.innerHTML = '<p>First three correct, with no mistakes! You can move to Step 2 or keep practicing.</p><button class="primary-btn" id="fast-track-step2">Go to Step 2 <span>→</span></button>';
    $("#challenge").prepend(panel);
    $("#fast-track-step2").onclick = () => switchSection(2);
  }

  function makeContinueButton() {
    if (problem.category === "variant" && progress.index === 2 && progress.mistakes === 0 && !progress.skipped.length && !progress.remedialFor) progress.fastTrackEarned = true;
    updateProgress(progress.index + 1);
    lockCounterexampleEditor();
    $$('[data-choice-id]').forEach(button => { button.disabled = true; });
    const button = $("#visual-check");
    button.disabled = false;
    button.innerHTML = progress.index === mainTasks().length - 1 ? "Finish visual proof <span>→</span>" : "Next visual check <span>→</span>";
    pendingAdvance = () => {
      pendingAdvance = null;
      progress.index++;
      progress.remedialFor = null;
      saveProgress();
    };
    persistProgress(storageKey(), { ...progress, index: progress.index + 1, remedialFor: null });
    button.onclick = () => { pendingAdvance?.(); render(); };
    renderFastTrack();
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
    return (hash >>> 8) % Math.max(count, 1);
  }

  function counterexampleRounds() {
    const rounds = authoredCounterexampleRounds();
    return problem.category === "variant" ? rounds.slice(0, variantPractice.step2Questions) : rounds;
  }

  function authoredCounterexampleRounds() {
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
      "skip-leaf-edges": ["drops each edge that touches a leaf; the leaf node stays", "keeps every leaf node but removes its edge", "disconnects each leaf without deleting the leaf itself"],
      "shallow-search": [`visits only the start and its direct neighboring ${noun}`, "stops after one hop instead of continuing", "never explores beyond the start's immediate neighbors"],
      "first-branch": ["follows only the first available branch and never comes back", "chooses the first route and forgets the other branches", "stops the whole search when its first branch ends"],
      "last-branch": ["follows only the last available branch and ignores earlier choices", "chooses the final listed route and never returns", "keeps only the last branch it sees"],
      "wrong-start": [`uses the wrong ${chosenThing}`, `ignores the chosen ${chosenThing} and uses a different one`, `runs the search from a different ${chosenThing}`],
      "ignore-colors": ["erases track colors, so the search can illegally transfer between red and blue"],
      "red-only": ["checks red routes but completely forgets that an all-blue route is also allowed"],
      "strict-threshold": ["keeps a trust link only when its score is greater than k, losing scores equal to k"],
      "first-start-only": ["uses only the first starting key and ignores the rest"]
    };
    const choices = variants[bug] || ["uses a different graph rule"];
    return choices[problemIndex % choices.length];
  }

  function renderCounterexampleRound() {
    answered = false;
    if (counterGraphChangeHandler) window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
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
    window.DFS_GRAPH?.setNodeLabelRule(usesArrayNumberDrawing() ? "array-number" : problem.counterexampleLesson?.nodeLabels?.rule || "free", usesArrayNumberDrawing() ? arrayDrawingOptions() : problem.graphRules?.nodeLabelFormat);
    window.DFS_GRAPH?.setContext(`${problem.id}:counterexample:${done}:${round.bugs[0]}:correct${usesArrayNumberDrawing() ? ":array-number-v2" : ""}`, 0);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = "Drawing 1 of 2: Correct graph";
    $("#graph-direction-label").textContent = "Directed edges";
    $("#challenge").innerHTML = `<div class="challenge-body counterexample-case">
        <div class="case-person"><span class="case-avatar" aria-hidden="true">${esc(name[0])}</span><div><h3>${esc(name)}'s broken search</h3></div></div>
        <div class="case-mistake">${descriptions.map(description => `<p>${esc(name)} ${esc(description)}.</p>`).join("")}</div>
        <p class="drawing-target-note counter-main-goal"><b>Your main goal:</b> ${esc(round.goal || `Expose ${name}'s mistake.`)} Draw two graphs: first the correct graph, then ${esc(name)}'s graph using the mistake.${problem.category === "variant" ? ` Predict the correct output and ${esc(name)}’s output.</p><p class="drawing-target-note counter-drawing-rules"><b>Drawing rules:</b> Both drawings must match your input and the rules above.` : ""}${coffeeProblem ? " Color the coffee-cart intersection <b>Amber</b> in both." : ""}${problem.id === "flooded-campsite-trails" ? " Color flooded campsite nodes <b>Blue</b> in both drawings; searches cannot enter them. Flooded neighbors are skipped before choosing a branch." : ""}${["first-branch", "last-branch", "drop-last-edge"].includes(round.bugs[0]) ? " The first edge you draw is #1; the last edge has the largest number." : ""}${round.bugs.includes("wrong-start") ? ` ${esc(name)} starts at ${esc(displayCounterNodeName(round.mistakenStartLabel))} instead.` : ""}${round.bugs.includes("make-one-way") ? ` In ${esc(name)}'s graph, each arrow goes from the node you clicked first to the node you clicked second; turn <b>Directed edges</b> on.` : ""}${round.bugs.includes("make-two-way") ? ` In ${esc(name)}'s graph, turn <b>Directed edges</b> off.` : ""}${round.bugs.includes("ignore-colors") ? " In drawing 2, color every edge <b>Slate</b> to show that its track color was erased." : ""}</p>
        ${usesArrayNumberDrawing() ? renderNodeLabelGuide() : `<div class="node-label-guide"><b>Required node-name format:</b> ${formatText(problem.graphRules?.nodeLabelFormat?.instruction || problem.counterexampleLesson?.nodeLabels?.description || "Use the same names as Step 1.")}</div>`}
        <div class="counter-predictions">
          <label class="counter-field counter-input-field" ${usesArrayNumberDrawing() ? "hidden" : ""}><span>${esc(inputSpec.prompt)} <small>${esc(inputSpec.name)}${problem.counterexampleLesson.fixedStart ? `: ${esc(problem.counterexampleLesson.fixedStart)} (${problem.counterexampleLesson?.nodeLabels?.rule === "tree-path" ? "root index fixed; your value may differ" : "fixed"})` : ""}</small></span><input id="counter-start" autocomplete="off"${problem.counterexampleLesson.fixedStart ? ` value="${esc(problem.counterexampleLesson.fixedStart)}" readonly` : ` placeholder="Example: ${esc(problem.id === "museum-vault-keyring" ? "0, 2" : roundSuggestedStart(round))}"`}></label>
          ${["component-count", "border-component-count", "maximum-component-size", "minimum-component-size", "exact-size-component-count", "qualified-component-count", "components-without-source-count", "maximum-component-value-sum", "component-bounding-boxes", "minimum-component-bounding-perimeter"].includes(inputSpec.result) ? "<p class=\"counter-output-help\">This function scans all nodes in numeric name order, starting a new search at each still-unseen node. The chosen node is only for the reachability trace. Neighbors follow edge drawing order.</p>" : ""}
          ${inputSpec.markers?.some(marker => marker.target === "edge") || inputSpec.resultConfig?.waitMarker || inputSpec.resultConfig?.delayMarker ? "<p class=\"counter-output-help\">Label every drawn edge with its value too. For waiting times, use the sending node’s wait. Both drawings must agree with these fields.</p>" : ""}
          ${renderCounterSemanticInputs(inputSpec)}
          <section class="counter-output-section" aria-labelledby="counter-output-heading">
            <h4 id="counter-output-heading">${counterUsesRealOutput(inputSpec.result) ? "Returned output from each search" : "Nodes reached by each search"}</h4>
            <div class="counter-output-fields">
              <label class="counter-field"><span>${counterUsesRealOutput(inputSpec.result) ? `Correct output · ${esc(inputSpec.resultLabel)}` : "Nodes the correct search reaches"}</span><input id="counter-real-output" placeholder="${esc(outputPlaceholder())}" autocomplete="off" disabled></label>
              <label class="counter-field"><span>${counterUsesRealOutput(inputSpec.result) ? `${esc(name)}’s output · ${esc(inputSpec.resultLabel)}` : `Nodes ${esc(name)}’s search reaches`}</span><input id="counter-bug-output" placeholder="${esc(outputPlaceholder())}" autocomplete="off" disabled></label>
            </div>
            <p class="counter-output-help">${counterOutputHelp(inputSpec.result)}</p>
          </section>
        </div>
        <div id="feedback-slot" role="status" aria-live="polite"></div>
        <div class="challenge-actions"><button id="counter-check" class="primary-btn" disabled>Check my graph <span>→</span></button></div>
      </div>`;
    $(".counter-predictions").before($("#graph-lab"));
    if (usesArrayNumberDrawing()) $("#graph-lab").before($(".counter-semantic-inputs"));
    const predictionFields = [$("#counter-real-output"), $("#counter-bug-output")].filter(Boolean);
    const requiredFields = [$("#counter-start"), ...$$('[data-counter-semantic][data-required="true"]'), ...predictionFields].filter(Boolean);
    const updateButton = () => { $("#counter-check").disabled = requiredFields.some(field => !field.value.trim()); };
    requiredFields.forEach(field => field.addEventListener("input", updateButton));
    $("#counter-start").addEventListener("input", () => { syncCounterDrawingFlow(name); updateCounterDrawingTitle(name, round); updateButton(); });
    $("#counter-check").onclick = () => checkCounterexample(round);
    if (counterGraphChangeHandler) window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
    counterGraphChangeHandler = () => { if (section !== 2) return; syncCounterDrawingFlow(name); saveCounterDraft(true); };
    restoreCounterDraft();
    counterDraftFields().forEach(field => {
      field.addEventListener("input", () => saveCounterDraft(true));
      field.addEventListener("change", () => { saveCounterDraft(true); updateButton(); });
    });
    if (dualDrawings) renderCounterDrawingTabs(name, done);
    updateCounterDrawingTitle(name, round);
    updateButton();
    updateCounterProgress(done, total);
    saveCounterDraft();
    window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
    focusPrompt();
    $(".test-pane").scrollTop = 0;
  }

  function counterDraftKey() {
    return `dfs-step2-draft:${problem.id}:${counterProgress.index}:v2${usesArrayNumberDrawing() ? ":array-number-v2" : ""}`;
  }

  function counterDraftFields() {
    return $$("#counter-start, #counter-real-output, #counter-bug-output, [data-counter-semantic]");
  }

  function saveCounterDraft(invalidate = false) {
    if (section !== 2 || !$("#counter-start") || answered) return;
    counterDrawings[counterDrawingMode] = window.DFS_GRAPH?.getSnapshot() || null;
    const fields = Object.fromEntries(counterDraftFields().map(field => [field.id, field.value]));
    const draft = { drawings: counterDrawings, fields, mode: counterDrawingMode };
    const serialized = JSON.stringify(draft);
    if (invalidate && localStorage.getItem(counterDraftKey()) !== serialized) {
      counterProgress.skills = [false, false, false, false];
      saveCounterProgress();
      updateCounterProgress(counterProgress.index, counterexampleRounds().length);
      const feedback = $("#feedback-slot");
      if (feedback) feedback.innerHTML = "";
    }
    localStorage.setItem(counterDraftKey(), serialized);
  }

  function restoreCounterDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(counterDraftKey()) || "null");
      if (!draft) { counterProgress.skills = [false, false, false, false]; return; }
      if (draft.drawings) counterDrawings = draft.drawings;
      for (const field of counterDraftFields()) if (Object.hasOwn(draft.fields || {}, field.id)) field.value = draft.fields[field.id];
      counterDrawingMode = draft.mode === "mistaken" ? "mistaken" : "correct";
      const round = counterexampleRounds()[counterProgress.index];
      window.DFS_GRAPH?.setContext(`${problem.id}:counterexample:${counterProgress.index}:${round.bugs[0]}:${counterDrawingMode}${usesArrayNumberDrawing() ? ":array-number-v2" : ""}`, 0);
      window.DFS_GRAPH?.setSnapshot(counterDrawings[counterDrawingMode]);
    } catch { counterProgress.skills = [false, false, false, false]; }
  }

  function counterInputSpec() {
    return problem.counterexampleLesson?.input || {
      name: problem.counterexampleLesson?.vocabulary?.startNode || "start node",
      prompt: `Choose the ${problem.counterexampleLesson?.vocabulary?.startNode || "start node"}`,
      result: "reached-nodes",
      resultLabel: "reachable set"
    };
  }

  function renderCounterSemanticInputs(inputSpec) {
    const control = item => item.kind === "choice"
      ? `<select id="counter-field-${esc(item.id)}" data-counter-semantic data-required="${item.required !== false}"><option value="">Choose…</option>${item.choices.map(choice => `<option value="${esc(choice.value)}">${esc(choice.label)}</option>`).join("")}</select>`
      : item.kind === "json"
        ? `<textarea id="counter-field-${esc(item.id)}" data-counter-semantic data-required="${item.required !== false}" rows="3" autocomplete="off" spellcheck="false" placeholder="${esc(inputPlaceholder(item.id))}"></textarea>`
      : `<input id="counter-field-${esc(item.id)}" data-counter-semantic data-required="${item.required !== false}" autocomplete="off" inputmode="${["number", "integer"].includes(item.kind) ? "decimal" : "text"}" placeholder="${esc(inputPlaceholder(item.id))}">`;
    const fields = (inputSpec.fields || []).map(field => `<label class="counter-field"><span>${esc(field.prompt)} <small>${esc(field.label)}</small></span>${control(field)}</label>`).join("");
    const markers = (inputSpec.markers || []).map(marker => `<label class="counter-field"><span>${esc(marker.prompt)} <small>${esc(marker.label)}</small></span><textarea id="counter-marker-${esc(marker.id)}" placeholder="${esc(counterMarkerExample(marker))}" data-counter-semantic data-required="${marker.required !== false}" rows="3" autocomplete="off" spellcheck="false" aria-describedby="counter-marker-help-${esc(marker.id)}"></textarea><small id="counter-marker-help-${esc(marker.id)}">${marker.target === "node" ? "One per line: node=value" : "One per line: from->to=value"}</small></label>`).join("");
    return fields || markers ? `<div class="counter-semantic-inputs">${fields}${markers}</div>` : "";
  }

  function parseCounterSemanticValue(raw, spec, label) {
    const value = String(raw).trim();
    if (!value && spec.required !== false) throw new Error(`${label} is required.`);
    if (!value) return null;
    if (spec.kind === "json") {
      return parseLessonValue(value, label, inputSample(spec.id));
    }
    if (spec.kind === "integer" && !/^-?\d+$/.test(value)) throw new Error(`${label} must be a whole number.`);
    if (["integer", "number"].includes(spec.kind)) {
      const fraction = value.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
      const number = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(value);
      if (!Number.isFinite(number)) throw new Error(`${label} must be a number.`);
      if (spec.min != null && number < spec.min) throw new Error(`${label} must be at least ${spec.min}.`);
      if (spec.max != null && number > spec.max) throw new Error(`${label} must be at most ${spec.max}.`);
      return number;
    }
    if (spec.kind === "choice" && spec.choices.some(choice => choice.value === "yes")) {
      if (["true", "1", "yes"].includes(value.toLowerCase())) return "yes";
      if (["false", "0", "no"].includes(value.toLowerCase())) return "no";
    }
    if (spec.kind === "choice" && !spec.choices.some(choice => String(choice.value) === value)) throw new Error(`Choose a valid ${label}.`);
    return value;
  }

  function counterEdgeKey(graph, from, to) {
    const ends = graph.directed ? [from, to] : [from, to].sort((one, two) => one.localeCompare(two, undefined, { numeric: true }));
    return `${ends[0]}\u0000${ends[1]}`;
  }

  function parseCounterSemanticInputs(graph) {
    const inputSpec = counterInputSpec();
    graph.fields = {};
    graph.nodeMarkers = {};
    graph.edgeMarkers = {};
    for (const field of inputSpec.fields || []) {
      let value = parseCounterSemanticValue($(`#counter-field-${field.id}`)?.value, field, field.label);
      if (field.kind === "node" && value != null) {
        value = resolveCounterNode(graph.nodes, value);
        if (!value) throw new Error(`${field.label} must name a node in your graph.`);
      }
      graph.fields[field.id] = value;
    }
    for (const marker of inputSpec.markers || []) {
      const output = {};
      const lines = String($(`#counter-marker-${marker.id}`)?.value || "").split(/\n+/).map(line => line.trim()).filter(Boolean);
      for (const line of lines) {
        const separator = line.lastIndexOf("=");
        if (separator <= 0) throw new Error(`Use ${marker.target === "node" ? "node=value" : "from->to=value"} for ${marker.label}.`);
        const rawKey = line.slice(0, separator).trim();
        const value = parseCounterSemanticValue(line.slice(separator + 1), marker, marker.label);
        if (marker.target === "node") {
          const node = resolveCounterNode(graph.nodes, rawKey);
          if (!node) throw new Error(`${rawKey} is not a node in your graph.`);
          if (Object.hasOwn(output, node)) throw new Error(`Give ${marker.label} only once for ${node}.`);
          output[node] = value;
        } else {
          const ends = rawKey.split(/\s*(?:->|→|—|-)\s*/);
          if (ends.length !== 2) throw new Error(`Use from->to=value for ${marker.label}.`);
          const from = resolveCounterNode(graph.nodes, ends[0]), to = resolveCounterNode(graph.nodes, ends[1]);
          if (!from || !to) throw new Error(`${rawKey} must name two nodes in your graph.`);
          const key = counterEdgeKey(graph, from, to);
          if (!graph.edges.some(([edgeFrom, edgeTo]) => counterEdgeKey(graph, edgeFrom, edgeTo) === key)) throw new Error(`${rawKey} is not an edge in your graph.`);
          if (Object.hasOwn(output, key)) throw new Error(`Give ${marker.label} only once for ${rawKey}.`);
          output[key] = value;
        }
      }
      const requiredKeys = marker.target === "node" ? graph.nodes : graph.edges.map(([from, to]) => counterEdgeKey(graph, from, to));
      if (marker.required !== false && requiredKeys.some(key => output[key] == null)) throw new Error(`Give ${marker.label} for every ${marker.target}.`);
      (marker.target === "node" ? graph.nodeMarkers : graph.edgeMarkers)[marker.id] = output;
    }
  }

  function counterOutputHelp(resultKind) {
    if (resultKind === "unreached-nodes" && problem.id === "who-keeps-their-job") return "Type the remaining employee IDs as a list in ascending numeric order.";
    if (["widest-level-index", "depth-weighted-value-sum", "inverse-depth-weighted-value-sum", "border-component-count", "selected-color-count", "minimum-component-bounding-perimeter", "maximum-root-leaf-value-sum"].includes(resultKind)) return `Type one number.${resultKind === "widest-level-index" ? " If the broken scan reaches no integers, it returns 0." : ""}`;
    if (resultKind === "unreached-nodes") return "Type the list the real function returns. Any allowed output order is accepted.";
    if (["reached-count", "unreached-count", "reached-node-value-sum", "shortest-path-weight", "maximum-shortest-path-weight-or-minus-one", "maximum-path-weight", "deadline-reached-count", "component-count", "maximum-component-size", "minimum-component-size", "maximum-reached-count", "path-count", "path-count-modulo", "longest-path-length", "maximum-reached-node-value", "recursive-item-count", "minimum-universally-reachable-node-or-minus-one", "level-value-sum", "exact-size-component-count", "kth-visited-node-or-minus-one", "components-without-source-count", "qualified-component-count", "reached-selected-node-count", "maximum-component-value-sum"].includes(resultKind)) return "Type the number the real function returns. Example: <code>3</code>.";
    if (["all-reached", "any-unreached", "target-reachable-boolean", "same-color-target-reachable-boolean", "target-state-reachable-boolean", "target-word-path-exists-boolean", "target-root-leaf-sum-exists-boolean", "valid-two-coloring-boolean", "acyclic-completion-boolean", "root-expression-value"].includes(resultKind)) return "Type <code>true</code> or <code>false</code>, just like the real function returns.";
    if (["enumerated-paths", "reachability-matrix", "generated-terminal-strings", "component-bounding-boxes", "iterator-output-sequence", "transformed-grid", "ordered-query-values"].includes(resultKind)) return "Type the list the real function returns.";
    if (counterUsesRealOutput(resultKind)) return 'Type the list the real function returns. Examples: <code>[0,1,2]</code> or <code>["(0,0)","(0,1)"]</code>.';
    return 'Type the reached-node list used to trace the search. Examples: <code>[0,1,2]</code> or <code>["(0,0)","(0,1)"]</code>. Any order is accepted.';
  }

  function counterUsesRealOutput(resultKind) {
    return resultKind !== "reached-nodes" || counterInputSpec().realOutput === true;
  }

  function chosenCounterStart(round) {
    return String($("#counter-start")?.value || problem.counterexampleLesson.fixedStart || "").trim();
  }

  function roundSuggestedStart(round) {
    const requested = String(problem.counterexampleLesson.fixedStart || roundStart(round));
    const pattern = String(problem.graphRules?.nodeLabelFormat?.pattern || "");
    const number = Number((requested.match(/\d+/) || [0])[0]);
    if (pattern === "^[A-Z]$") return String.fromCharCode(65 + number);
    if (pattern === "^\\d+:[A-Za-z]$") return `${number}:a`;
    if (pattern === "^\\d+:\\d+g$") return `${number}:0g`;
    if (pattern === "^\\d+:\\d+$") return `${Math.max(1, number)}:0`;
    if (pattern === "^\\d+:-?\\d+$") return `${Math.max(1, number)}:0`;
    if (pattern === "^\\d+:(?:true|false|AND|OR)$") return `${number}:false`;
    if (pattern === "^node \\d+: -?\\d+$") return `node ${number}: 0`;
    if (pattern === "^row \\d+: \\{[^{}]*\\}$") return `row ${number}: {}`;
    if (pattern === "^\\d+:\\(-?\\d+,-?\\d+\\)$") return `${number}:(0,0)`;
    if (pattern === "^\\d+: \\(-?\\d+,-?\\d+\\) p=\\d+$") return `${number}: (0,0) p=0`;
    return requested;
  }

  function displayCounterNodeName(label) {
    if (usesArrayNumberDrawing()) return label === "root[0]" ? "the first element of the outer Array" : "the outer Array";
    const value = String(label || "");
    return /^root(?:\[\d+\])+$/.test(value) ? `${value}=value` : value;
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
    if (usesArrayNumberDrawing()) return mistaken && round.bugs.includes("wrong-start") ? "Start: first element of the outer Array" : "Start: outer Array";
    const subject = counterStartSubject();
    if (mistaken && round.bugs.includes("wrong-start")) return `Wrong ${subject.toLowerCase()}: ${displayCounterNodeName(round.mistakenStartLabel)}`;
    const start = chosenCounterStart(round);
    return start ? `${subject}: ${start}` : `Choose ${subject.toLowerCase()}`;
  }

  function usesDualCounterDrawings() {
    return true;
  }

  function personDrawingChanges(bugs) {
    return bugs.some(bug => ["make-one-way", "make-two-way", "reverse-arrows", "add-diagonals", "remove-diagonals", "drop-last-edge", "skip-leaf-edges", "ignore-colors", "red-only", "strict-threshold"].includes(bug));
  }

  function renderCounterDrawingTabs(name, roundIndex) {
    const actions = $("#graph-lab-actions");
    $("#graph-board").before(actions);
    actions.hidden = false;
    actions.innerHTML = `<button class="graph-tool ${counterDrawingMode === "correct" ? "active" : ""}" data-counter-drawing="correct" aria-pressed="${counterDrawingMode === "correct"}">1 · Correct graph</button><button class="graph-tool ${counterDrawingMode === "mistaken" ? "active" : ""}" data-counter-drawing="mistaken" aria-pressed="${counterDrawingMode === "mistaken"}">2 · ${esc(name)}'s graph</button>${counterDrawingMode === "mistaken" ? `<button id="counter-duplicate-graph" class="graph-tool counter-duplicate-graph" type="button">${counterDuplicated ? "Graph #1 duplicated" : "Duplicate graph from #1"}</button>` : ""}`;
    $$('[data-counter-drawing]', actions).forEach(button => {
      button.onclick = () => {
        const nextMode = button.dataset.counterDrawing;
        if (nextMode === counterDrawingMode) return;
        counterDrawings[counterDrawingMode] = window.DFS_GRAPH?.getSnapshot() || null;
        window.removeEventListener("dfs-graph-change", counterGraphChangeHandler);
        counterDrawingMode = nextMode;
        const round = counterexampleRounds()[roundIndex];
        window.DFS_GRAPH?.setContext(`${problem.id}:counterexample:${roundIndex}:${round.bugs[0]}:${nextMode}${usesArrayNumberDrawing() ? ":array-number-v2" : ""}`, 0);
        window.DFS_GRAPH?.setSnapshot(counterDrawings[nextMode]);
        const mistakenLabel = round.bugs.includes("wrong-start") ? "same graph · different start" : personDrawingChanges(round.bugs) ? "mistaken graph" : "graph (same structure)";
        $("#graph-lab-title").textContent = nextMode === "correct" ? `Drawing 1 of 2: Correct graph · ${counterStartTitle(round, false)}` : `Drawing 2 of 2: ${name}'s ${mistakenLabel} · ${counterStartTitle(round, true)}`;
        renderCounterDrawingTabs(name, roundIndex);
        saveCounterDraft();
        window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
        queueMicrotask(() => $(`[data-counter-drawing="${nextMode}"]`)?.focus());
      };
    });
    const duplicateButton = $("#counter-duplicate-graph");
    if (duplicateButton) {
      const mistakenHasWork = counterDrawingHasWork(counterDrawings.mistaken);
      duplicateButton.disabled = !counterDrawings.correct?.nodes?.length || mistakenHasWork;
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
    [$("#counter-real-output"), $("#counter-bug-output")].filter(Boolean).forEach(input => { input.disabled = answered || !unlocked; });
    const duplicateButton = $("#counter-duplicate-graph");
    if (duplicateButton) {
      if (!counterDrawingHasWork(counterDrawings.mistaken)) { counterDuplicated = false; duplicateButton.textContent = "Duplicate graph from #1"; }
      const mistakenHasWork = counterDrawingHasWork(counterDrawings.mistaken);
      duplicateButton.disabled = answered || !hasCorrect || mistakenHasWork;
      duplicateButton.title = mistakenHasWork ? "Clear graph #2 to duplicate graph #1." : "";
    }
  }

  function counterDrawingHasWork(drawing) {
    return Boolean(drawing?.nodes?.length || drawing?.edges?.length);
  }

  function roundStart(round) {
    return String(round.startLabel);
  }

  function parseArrayCounterDrawing(drawing, round) {
    const options = arrayDrawingOptions();
    if (!drawing?.nodes?.length || drawing.nodes.length > 24) throw new Error("Draw 1–24 nodes, including the outer Array.");
    if (!drawing.directed) throw new Error("Use arrows from each Array to its children.");
    if (drawing.edges.some(edge => String(edge.label || "").trim())) throw new Error("Leave arrow labels blank. Put each number on its Number node.");
    if (arrayTreeSignature(drawing, node => String(node.label), true) === null) throw new Error("Use one outer Array. Every other node needs one parent. Number nodes cannot have children; loops and extra arrows are not allowed.");
    const byId = new Map(drawing.nodes.map(node => [String(node.id), node]));
    const children = new Map([...byId.keys()].map(id => [id, []]));
    const childIds = new Set();
    drawing.edges.forEach(edge => { children.get(String(edge.from)).push(String(edge.to)); childIds.add(String(edge.to)); });
    const root = [...byId.keys()].find(id => !childIds.has(id));
    const labels = new Map(), nodes = [];
    function visit(id, path) {
      const node = byId.get(id), isArray = node.label === "Array";
      const number = Number(node.label);
      if (!isArray && (!/^-?\d+$/.test(node.label) || !Number.isSafeInteger(number) || number < options.min || number > options.max)) throw new Error(`Number nodes need whole numbers from ${options.min} to ${options.max}.`);
      const label = `${path}=${isArray ? "[]" : number}`;
      labels.set(id, label); nodes.push(label);
      return isArray ? children.get(id).map((child, index) => visit(child, `${path}[${index}]`)) : number;
    }
    const items = visit(root, "root");
    if (problem.id === "busiest-shelf-level" && nodes.every(node => node.endsWith("=[]"))) throw new Error("Busiest Shelf Level needs at least one Number node.");
    const graph = { directed: true, nodes, edges: drawing.edges.map(edge => [labels.get(String(edge.from)), labels.get(String(edge.to)), ""]), start: "root=[]", firstNode: "root=[]" };
    parseCounterSemanticInputs(graph);
    const typed = graph.fields[problem.counterexampleLesson.arrayInputField];
    if (JSON.stringify(typed) !== JSON.stringify(items)) throw new Error("Your correct drawing must match your nested array. Check every Array, number, and child order.");
    const marker = counterInputSpec().resultConfig?.valueMarker;
    if (marker) graph.nodeMarkers[marker] = Object.fromEntries(nodes.filter(node => !node.endsWith("=[]")).map(node => [node, Number(node.split("=")[1])]));
    if (round.bugs.includes("wrong-start") && !children.get(root).length) throw new Error("This mistaken search starts at the first element, so the outer Array needs an element.");
    return graph;
  }

  function parseCounterDrawing(drawing, round, chosenStart) {
    try {
      if (usesArrayNumberDrawing()) return { graph: parseArrayCounterDrawing(drawing, round) };
      const maxCounterNodes = problem.id === "water-and-jug-problem" ? 40 : 24;
      if (!drawing || drawing.nodes.length < (problem.counterexampleLesson.minNodes || 1) || drawing.nodes.length > maxCounterNodes) throw new Error(problem.counterexampleLesson.minNodes ? `Draw at least ${problem.counterexampleLesson.minNodes} nodes.` : `Draw 1–${maxCounterNodes} nodes.`);
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
      const requestedStart = normalizeLabel(chosenStart || "");
      let starts = null;
      if (problem.id === "museum-vault-keyring") {
        let keys;
        try { keys = parseLessonValue(requestedStart, "starting keys", [0, 2]); } catch { throw new Error("Enter starting keys like 0, 2. Use [] for no keys."); }
        if (!Array.isArray(keys) || keys.some(key => !["number", "string"].includes(typeof key))) throw new Error("Starting keys must be a list of vault IDs.");
        starts = keys.map(key => resolveCounterNode(nodes, String(key)));
        if (starts.some(key => !key)) throw new Error("Every starting key must name a drawn vault.");
      }
      const start = starts ? starts[0] || nodes[0] : resolveCounterNode(nodes, requestedStart);
      if (!requestedStart) throw new Error(`Choose the ${counterInputSpec().name}.`);
      if (!start) throw new Error(`Draw the chosen ${counterInputSpec().name}: ${requestedStart}.`);
      if (round.bugs.includes("wrong-start")) {
        const mistakenStart = resolveCounterNode(nodes, normalizeLabel(round.mistakenStartLabel));
        if (start === mistakenStart) throw new Error(`Choose a ${counterInputSpec().name} different from the broken search's ${displayCounterNodeName(round.mistakenStartLabel)}.`);
        if (!nodes.includes(mistakenStart)) throw new Error(`Also draw ${displayCounterNodeName(round.mistakenStartLabel)}, the wrong ${counterInputSpec().name} used by the broken search.`);
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
      const graph = { directed: requiredDirection, nodes, edges, start, ...(starts ? { starts } : {}), firstNode: rawLabels[0] };
      if (problem.id === "flooded-campsite-trails") graph.blocked = drawing.nodes.filter(node => semanticColor(node.color) === "blue").map(node => normalizeLabel(node.label));
      if (problem.id === "routes-past-the-coffee-cart") {
        const coffeeNodes = drawing.nodes.filter(node => semanticColor(node.color) === "amber");
        if (coffeeNodes.length !== 1) throw new Error("Color exactly one node Amber to mark the coffee cart.");
        graph.checkpoint = normalizeLabel(coffeeNodes[0].label);
      }
      parseCounterSemanticInputs(graph);
      validateCounterValues(graph);
      validateProblemGraphShape(graph);
      return { graph };
    } catch (error) {
      return { error: error.message || "Check the correct graph." };
    }
  }

  function resolveCounterNode(nodes, requested) {
    if (nodes.includes(requested)) return requested;
    const plain = nodes.find(node => node.replace(/ \(restricted\)$/, "") === requested);
    if (plain) return plain;
    const richIndex = requested.match(/^(?:node\s+|row\s+)?(\d+):/i);
    if (richIndex) {
      const index = richIndex[1];
      const rich = nodes.find(node => node.startsWith(`${index}:`) || node.startsWith(`node ${index}:`) || node.startsWith(`row ${index}:`));
      if (rich) return rich;
    }
    if (/^\d+$/.test(requested)) {
      const numbered = nodes.find(node => node.startsWith(`${requested}:`) || node.startsWith(`node ${requested}:`) || node.startsWith(`row ${requested}:`));
      if (numbered) return numbered;
      return nodes[Number(requested)] || null;
    }
    const nested = nodes.find(node => node.split("=")[0] === requested || node.replace(/ array$/, "") === requested);
    if (nested) return nested;
    if (/^(?:root|start|empty|empty prefix|outer array|ε)$/i.test(requested)) {
      return nodes.find(node => /^(?:root(?:=\[\])?|start|empty prefix|outer array|node 0:|0:)/i.test(node)) || null;
    }
    return null;
  }

  function validateCounterNodeLabels(nodes) {
    const shownFormat = problem.graphRules?.nodeLabelFormat;
    if (shownFormat?.pattern) {
      const matcher = new RegExp(shownFormat.pattern);
      if (nodes.some(node => !matcher.test(node))) throw new Error(`Use the Step 1 node-name format: ${shownFormat.instruction}`);
    }
    const rule = problem.counterexampleLesson?.nodeLabels?.rule || "free";
    const identity = node => {
      const text = String(node);
      if (/^[A-Z]$/.test(text)) return String(text.charCodeAt(0) - 65);
      if (text === "outer array") return "root";
      if (/^(?:\[\d+\])+(?: array|=.+)$/.test(text)) return `root${text.replace(/ array$|=.+$/, "")}`;
      if (/^root(?:\[\d+\])*=/.test(text)) return text.split("=")[0];
      const namedNumber = text.match(/^(?:node|row|index)\s*(\d+)(?::|\s)/i);
      if (namedNumber) return namedNumber[1];
      const leadingNumber = text.match(/^(\d+)(?::|\s|$)/);
      return leadingNumber ? leadingNumber[1] : text;
    };
    const identities = nodes.map(identity);
    const numeric = identities.map(Number);
    if (problem.id === "reachable-nodes-with-restrictions") {
      if (nodes.some(node => !/^\d+(?: \(restricted\))?$/.test(node))) throw new Error("Use node numbers, adding (restricted) only to blocked nodes.");
      const ids = nodes.map(node => Number(node.match(/^\d+/)[0])).sort((a, b) => a - b);
      if (ids.some((id, index) => id !== index)) throw new Error("Use numeric IDs 0, 1, 2, ... with no gaps.");
      return;
    }
    if (rule === "contiguous-zero" && [...numeric].sort((a, b) => a - b).some((node, index) => node !== index)) throw new Error("Use numeric IDs 0, 1, 2, ... with no gaps.");
    if (rule === "contiguous-one" && [...numeric].sort((a, b) => a - b).some((node, index) => node !== index + 1)) throw new Error("Use numeric IDs 1, 2, 3, ... with no gaps.");
    if (rule === "positive-integer" && identities.some(node => !/^[1-9]\d*$/.test(node))) throw new Error("Use positive integer IDs, like 1, 3, or 10.");
    if (["coordinate", "state-pair", "interior-coordinate"].includes(rule) && nodes.some(node => !/^\(\d+,\d+\)$/.test(node))) throw new Error(rule === "state-pair" ? "Use nonnegative jug states like (0,0)." : "Use grid coordinates like (0,0) or 0,0.");
    if (rule === "interior-coordinate" && nodes.some(node => coordinate(node).some(value => value < 1))) throw new Error("This board has a wall border. Use interior coordinates starting at (1,1).");
    if (rule === "identifier" && nodes.some(node => !/^[a-z0-9]{1,5}$/.test(node))) throw new Error("Use lowercase variables with 1 to 5 letters or digits, like a, 1a, or rate1.");
    if (rule === "nested-path" && (!identities.includes("root") || identities.some(node => !/^root(?:\[(?:0|[1-9]\d*)\])*$/.test(node)))) throw new Error("Use root, root[0], root[1], ... to name nested input items.");
    if (rule === "tree-path" && (numeric.some(node => !Number.isInteger(node) || node < 0) || !numeric.includes(0))) throw new Error("Use nonnegative Step 1 tree-node numbers and include root index 0.");
    if (rule === "partial-string") {
      const rootName = problem.id === "runes-on-the-castle-door" ? "start" : "empty prefix";
      if (!nodes.includes(rootName) || nodes.some(node => node !== rootName && !/^[a-z]+$/.test(node))) throw new Error(`Use ${rootName} for the empty root, then lowercase partial strings like a or ab.`);
    }
    const max = problem.counterexampleLesson?.nodeLabels?.max;
    if (max !== undefined && nodes.some(node => {
      if (["coordinate", "interior-coordinate", "state-pair"].includes(rule)) return coordinate(node).some(value => value > max);
      return Number(identity(node)) > max;
    })) throw new Error(`Node labels in this problem cannot be larger than ${max}.`);
  }

  function coffeeNodeLabel(drawing) {
    const nodes = drawing?.nodes?.filter(node => semanticColor(node.color) === "amber") || [];
    return nodes.length === 1 ? String(nodes[0].label).trim() : null;
  }

  function validateCounterValues(graph) {
    const paired = { "coins-on-level-k": "coinValue", "kth-song-in-playlist": "songId", "dungeon-gold-run": "gold", "shut-the-garden-valve": "flow", "employee-importance": "importance", "path-sum": "nodeValue", "structy-tree-sum": "nodeValue" };
    const marker = paired[problem.id];
    if (marker) {
      const values = graph.nodeMarkers[marker] || {};
      for (const node of graph.nodes) {
        const match = node.match(/(?:=|:\s*)(-?\d+)(?:g)?$/);
        if (match && (values[node] == null || Number(values[node]) !== Number(match[1]))) throw new Error(`${node} shows ${match[1]}. Give that same value in the ${marker} field.`);
        if (["coinValue", "songId"].includes(marker) && !match && values[node] != null) throw new Error(`${node} is a container, so leave it out of the ${marker} field.`);
      }
    }
    const exactEdges = (pairs, reason) => {
      const expected = new Set(pairs.map(([from, to]) => counterEdgeKey(graph, from, to)));
      const actual = new Set(graph.edges.map(([from, to]) => counterEdgeKey(graph, from, to)));
      if (actual.size !== graph.edges.length) throw new Error("Draw each direct connection only once.");
      const missing = pairs.find(([from, to]) => !actual.has(counterEdgeKey(graph, from, to)));
      const extra = graph.edges.find(([from, to]) => !expected.has(counterEdgeKey(graph, from, to)));
      if (extra) throw new Error(`${extra[0]} ${graph.directed ? "→" : "—"} ${extra[1]} is not allowed. ${reason}`);
      if (missing) throw new Error(`Missing connection: ${missing[0]} ${graph.directed ? "→" : "—"} ${missing[1]}. ${reason}`);
    };
    if (["moocast", "detonate-the-maximum-bombs"].includes(problem.id)) {
      const geometry = Object.fromEntries(graph.nodes.map(node => {
        const values = problem.id === "moocast" ? (node.match(/:\s*\((-?\d+),(-?\d+)\) p=(\d+)$/) || []).slice(1).map(Number) : graph.nodeMarkers.geometry[node];
        if (!Array.isArray(values) || values.length !== 3 || values.some(value => !Number.isInteger(value)) || values[2] <= 0 || (problem.id === "detonate-the-maximum-bombs" && values.some(value => value < 1 || value > 100000))) throw new Error(`Give valid whole-number coordinates and positive range for ${node}.`);
        return [node, values];
      }));
      const pairs = [];
      for (const from of graph.nodes) for (const to of graph.nodes) if (from !== to) {
        const [x, y, radius] = geometry[from], [otherX, otherY] = geometry[to];
        if ((x - otherX) ** 2 + (y - otherY) ** 2 <= radius ** 2) pairs.push([from, to]);
      }
      exactEdges(pairs, "Use the sending node's radius and the distance between the two positions.");
    }
    if (problem.id === "properties-graph") {
      const rows = graph.nodes.map(node => (node.match(/\{([^{}]*)\}/)?.[1] || "").split(",").map(value => value.trim()).filter(Boolean).map(Number));
      if (!rows[0]?.length || rows.some(row => row.length !== rows[0].length || row.some(value => !Number.isInteger(value) || value < 1 || value > 100))) throw new Error("Each row needs the same number of values, all whole numbers from 1 to 100. Repeated values are allowed.");
      if (graph.fields.k > rows[0].length) throw new Error("k cannot exceed the number of values in one row.");
      const pairs = [];
      rows.forEach((row, first) => rows.forEach((other, second) => {
        if (first < second && [...new Set(row)].filter(value => other.includes(value)).length >= graph.fields.k) pairs.push([graph.nodes[first], graph.nodes[second]]);
      }));
      exactEdges(pairs, "Count distinct shared values, then compare with k.");
    }
    if (problem.id === "trusted-courier-networks") {
      const scores = graph.fields.scores, size = graph.nodes.length;
      if (!Array.isArray(scores) || scores.length !== size || scores.some(row => !Array.isArray(row) || row.length !== size || row.some(value => !Number.isInteger(value) || value < 0))) throw new Error("Give one square matrix of nonnegative whole-number scores, with one row per office.");
      const pairs = [];
      for (let first = 0; first < size; first++) for (let second = 0; second < size; second++) {
        if (scores[first][second] !== scores[second][first]) throw new Error("Trust scores must be symmetric.");
        if (first === second && scores[first][second] < graph.fields.k) throw new Error("Each office's self-score must meet k; self-scores do not need loop edges.");
        if (first < second && scores[first][second] >= graph.fields.k) pairs.push([graph.nodes[first], graph.nodes[second]]);
      }
      exactEdges(pairs, "Connect different offices when their score is at least k.");
    }
    if (problem.id === "runes-on-the-castle-door") {
      const dials = graph.fields.dials;
      if (!Array.isArray(dials) || dials.length < 1 || dials.length > 6 || dials.some(dial => typeof dial !== "string" || !/^[a-z]+$/.test(dial) || new Set(dial).size !== dial.length)) throw new Error("Give 1–6 dial strings. Each dial needs lowercase letters with no duplicates.");
      const nodes = ["start"], pairs = [];
      const visit = (prefix, depth) => {
        if (depth === dials.length) return;
        for (const rune of dials[depth]) if (rune !== prefix.at(-1)) {
          const next = prefix + rune;
          nodes.push(next); pairs.push([prefix || "start", next]);
          if (nodes.length > 24) throw new Error("This dial set makes more than 24 nodes. Choose fewer rune choices for a small counterexample.");
          visit(next, depth + 1);
        }
      };
      visit("", 0);
      const missing = nodes.find(node => !graph.nodes.includes(node)), extra = graph.nodes.find(node => !nodes.includes(node));
      if (missing) throw new Error(`The dial choices also allow prefix ${missing}. Include every legal prefix, even incomplete dead ends.`);
      if (extra) throw new Error(`${extra} is not a legal prefix for these dials.`);
      exactEdges(pairs, "Extend by one rune from the next dial, without equal neighboring runes.");
    }
    const increasing = ["longest-increasing-path-in-a-matrix", "number-of-increasing-paths-in-a-grid"].includes(problem.id);
    if (increasing || problem.id === "counting-docked-boats") {
      const { rows, columns } = graph.fields;
      if (graph.nodes.some(node => { const [row, column] = coordinate(node); return row >= rows || column >= columns; })) throw new Error("A drawn cell is outside your grid dimensions.");
      if (increasing) {
        if (graph.nodes.length !== rows * columns) throw new Error(`Draw every cell of your ${rows} by ${columns} matrix.`);
        validateExactGridAdjacency(graph, false);
      }
    }
    if (["battleships-in-a-board", "counting-docked-boats", "longest-freight-train", "find-all-groups-of-farmland"].includes(problem.id)) {
      // Compute physical groups from coordinates, independently of the student's edges.
      const physical = { ...graph, directed: false, edges: [] };
      for (const from of graph.nodes) for (const to of graph.nodes) if (from < to) {
        const [r, c] = coordinate(from), [s, d] = coordinate(to);
        if (Math.abs(r - s) + Math.abs(c - d) === 1) physical.edges.push([from, to]);
      }
      const groups = counterComponents(physical), groupOf = {};
      groups.forEach((group, index) => group.forEach(node => { groupOf[node] = index; }));
      for (const group of groups) {
        const points = group.map(coordinate), rows = points.map(([row]) => row), cols = points.map(([, col]) => col);
        const height = Math.max(...rows) - Math.min(...rows) + 1, width = Math.max(...cols) - Math.min(...cols) + 1;
        if (problem.id === "find-all-groups-of-farmland") {
          if (height * width !== group.length) throw new Error("Every farmland group must fill a complete rectangle. Check for a missing corner.");
        } else if (height !== 1 && width !== 1) throw new Error("Each boat, ship, or train must be straight and one cell wide.");
      }
      if (problem.id !== "find-all-groups-of-farmland") for (const from of graph.nodes) for (const to of graph.nodes) {
        const [r, c] = coordinate(from), [s, d] = coordinate(to);
        if (groupOf[from] !== groupOf[to] && Math.max(Math.abs(r - s), Math.abs(c - d)) <= 1) throw new Error("Different vehicles cannot touch, even at a corner.");
      }
    }
    if (problem.id === "kattis-getting-gold") {
      const safety = graph.nodeMarkers.cellSafety, gold = graph.nodeMarkers.containsGold;
      for (const node of graph.nodes) {
        if (safety[node] === "trap") {
          if (gold[node] === "yes") throw new Error(`${node} cannot contain both a trap and gold.`);
          continue;
        }
        const [r, c] = coordinate(node);
        const draft = graph.nodes.some(other => { const [s, d] = coordinate(other); return safety[other] === "trap" && Math.abs(r - s) + Math.abs(c - d) === 1; });
        if (safety[node] !== (draft ? "draft" : "clear")) throw new Error(`${node} must be marked ${draft ? "draft: it has a side-neighbor trap" : "clear: no trap touches its side"}.`);
      }
      if (safety[graph.start] === "trap") throw new Error("The player cannot start on a trap.");
      validateExactGridAdjacency(graph, false);
    }
    if (problem.id === "reachable-nodes-with-restrictions" && graph.nodes.includes("0 (restricted)")) throw new Error("Node 0 is the source and cannot be restricted.");
    if (problem.id === "usaco-fence-planning") {
      const positions = graph.nodes.map(node => node.slice(node.indexOf(":")));
      if (new Set(positions).size !== positions.length) throw new Error("Every cow needs a distinct position.");
      if (graph.nodes.some(node => !graph.edges.some(([from, to]) => from === node || to === node))) throw new Error("Each cow must have at least one moo connection.");
    }
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
      const fullTypedGrid = ["minesweeper", "gas-pocket-survey", "flood-fill", "ten-kinds-of-people", "word-search"].includes(problem.id);
      if (fullTypedGrid) {
        const config = counterInputSpec().resultConfig || {}, rows = Number(graph.fields?.[config.rowsField]), columns = Number(graph.fields?.[config.columnsField]);
        const expectedNodes = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => `(${row},${column})`)).flat();
        if (graph.nodes.length !== expectedNodes.length || expectedNodes.some(node => !graph.nodes.includes(node))) throw new Error(`Draw every cell in the ${rows} by ${columns} grid, from (0,0) through (${rows - 1},${columns - 1}).`);
        const values = graph.nodeMarkers?.[config.valueMarker || config.letterMarker] || {}, expectedEdges = new Set();
        if (problem.id === "word-search" && Object.values(values).some(value => !/^[A-Za-z]$/.test(String(value)))) throw new Error("Give each board cell exactly one letter.");
        for (const node of expectedNodes) for (const other of expectedNodes) {
          const one = coordinate(node), two = coordinate(other), rowGap = Math.abs(one[0] - two[0]), columnGap = Math.abs(one[1] - two[1]);
          const adjacent = ["minesweeper"].includes(problem.id) ? Math.max(rowGap, columnGap) === 1 : rowGap + columnGap === 1;
          const sameKind = !["flood-fill", "ten-kinds-of-people"].includes(problem.id) || values[node] === values[other];
          if (adjacent && sameKind) expectedEdges.add(counterEdgeKey(graph, node, other));
        }
        const actualEdges = new Set(graph.edges.map(([from, to]) => counterEdgeKey(graph, from, to)));
        if (expectedEdges.size !== actualEdges.size || [...expectedEdges].some(edge => !actualEdges.has(edge))) throw new Error("Connect exactly the neighboring cells allowed by their original values.");
      }
      const completeSparseGrid = new Set(["battleships-in-a-board", "number-of-islands", "counting-constellations", "counting-docked-boats", "longest-freight-train", "perfect-size-campsites", "gfg-grid-path-exists", "hackerrank-connected-cells", "count-sub-islands", "find-all-groups-of-farmland", "max-area-of-island", "maximum-number-of-fish-in-a-grid", "structy-minimum-island"]);
      if (!fullTypedGrid && !graph.directed && completeSparseGrid.has(problem.id)) validateExactGridAdjacency(graph, allowsDiagonals);
    }
    if (problem.id === "water-and-jug-problem") {
      const config = counterInputSpec().resultConfig || {}, capOne = Number(graph.fields?.[config.jug1CapacityField]), capTwo = Number(graph.fields?.[config.jug2CapacityField]);
      const expected = jugStateGraph(capOne, capTwo), actualEdges = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`)), expectedEdges = new Set(expected.edges.map(([from, to]) => `${from}\u0000${to}`));
      if (graph.nodes.length !== expected.nodes.length || expected.nodes.some(node => !graph.nodes.includes(node))) throw new Error("Draw every jug state reachable from (0,0) for these capacities.");
      if (actualEdges.size !== expectedEdges.size || [...expectedEdges].some(edge => !actualEdges.has(edge))) throw new Error("Draw every legal fill, empty, and pour arrow between the reachable states.");
    }
    if (problem.id === "evaluate-division") {
      const config = counterInputSpec().resultConfig || {}, ratios = graph.edgeMarkers?.[config.ratioMarker] || {}, edges = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const [from, to] of graph.edges) {
        const reverse = `${to}\u0000${from}`, forwardRatio = Number(ratios[`${from}\u0000${to}`]), reverseRatio = Number(ratios[reverse]);
        if (!edges.has(reverse)) throw new Error(`Also draw ${to}→${from}, because every division fact works in both directions.`);
        if (!Number.isFinite(forwardRatio) || !Number.isFinite(reverseRatio) || Math.abs(forwardRatio * reverseRatio - 1) > 1e-9) throw new Error(`The ratios on ${from}→${to} and ${to}→${from} must be reciprocals.`);
      }
    }
    // Step 2 uses the same visible names as Step 1. General graph/tree checks below
    // enforce the shape without a second, conflicting hidden naming system.
    const labelRule = problem.counterexampleLesson?.nodeLabels?.rule;
    if (labelRule === "nested-path") {
      const pathOf = label => {
        const text = String(label);
        if (text === "outer array") return "root";
        if (/^(?:\[\d+\])+(?: array|=.+)$/.test(text)) return `root${text.replace(/ array$|=.+$/, "")}`;
        return text.split("=")[0];
      };
      const byPath = Object.fromEntries(graph.nodes.map(node => [pathOf(node), node]));
      const parent = path => path.replace(/\[\d+\]$/, "") || "root";
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) if (pathOf(node) !== "root") {
        const directParentPath = parent(pathOf(node));
        const directParent = byPath[directParentPath];
        if (!directParent) throw new Error(`${node} needs its parent ${directParentPath}.`);
        if (!/(?:=\[\]| array)$/.test(directParent) && directParent !== "outer array" && directParent !== "root") throw new Error(`${directParent} is a value, so it cannot contain ${node}. Use an array parent.`);
        if (!edgeKeys.has(`${directParent}\u0000${node}`)) throw new Error(`Connect ${directParent} directly to ${node}.`);
      }
      const childIndexes = new Map();
      for (const node of graph.nodes) if (pathOf(node) !== "root") {
        const match = pathOf(node).match(/^(.*)\[(\d+)\]$/), indexes = childIndexes.get(match[1]) || [];
        indexes.push(Number(match[2])); childIndexes.set(match[1], indexes);
      }
      for (const indexes of childIndexes.values()) {
        indexes.sort((a, b) => a - b);
        if (indexes.some((value, index) => value !== index)) throw new Error("Nested child indexes must start at 0 with no gaps.");
      }
    }
    if (labelRule === "tree-path" && graph.nodes.includes("root")) {
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
    if (labelRule === "tree-path" && !graph.nodes.includes("root")) {
      const indexOf = label => {
        const match = String(label).match(/^(?:node\s+)?(\d+):/i);
        return match ? Number(match[1]) : null;
      };
      const byIndex = new Map(graph.nodes.map(node => [indexOf(node), node]));
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) {
        const index = indexOf(node);
        if (index === 0 || problem.id === "evaluate-boolean-binary-tree") continue;
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = byIndex.get(parentIndex);
        if (!parent) throw new Error(`${node} needs its level-order parent at index ${parentIndex}.`);
        if (!edgeKeys.has(`${parent}\u0000${node}`)) throw new Error(`Connect ${parent} directly to ${node}.`);
      }
      const childCount = Object.fromEntries(graph.nodes.map(node => [node, 0]));
      for (const [from] of graph.edges) childCount[from]++;
      if (Object.values(childCount).some(count => count > 2)) throw new Error("A binary-tree node can have at most two children.");
      if (problem.id === "evaluate-boolean-binary-tree") for (const node of graph.nodes) {
        const operator = /:(?:AND|OR)$/.test(node);
        if (operator && childCount[node] !== 2) throw new Error("A Boolean operator node needs both a left and a right child.");
        if (!operator && childCount[node] !== 0) throw new Error("A Boolean true/false leaf cannot have children.");
      }
    }
    if (labelRule === "partial-string") {
      const rootName = problem.id === "runes-on-the-castle-door" ? "start" : "empty prefix";
      const edgeKeys = new Set(graph.edges.map(([from, to]) => `${from}\u0000${to}`));
      for (const node of graph.nodes) if (node !== rootName) {
        const directParent = node.length === 1 ? rootName : node.slice(0, -1);
        if (!graph.nodes.includes(directParent)) throw new Error(`${node} needs its prefix ${directParent}.`);
        if (!edgeKeys.has(`${directParent}\u0000${node}`)) throw new Error(`Connect ${directParent} directly to ${node}.`);
      }
      const limit = problem.id === "runes-on-the-castle-door" ? 6 : 4;
      if (graph.nodes.some(node => node !== rootName && (node.length > limit || (problem.id === "runes-on-the-castle-door" && /(.)\1/.test(node))))) throw new Error(problem.id === "runes-on-the-castle-door" ? "Rune strings use at most 6 letters and cannot repeat a neighboring rune." : "Phone-number prefixes use at most 4 letters.");
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
    if (problem.id !== "usaco-milk-factory" && graph.directed && Object.values(incoming).filter(count => count === 0).length !== 1) throw new Error("A directed tree needs exactly one root with no incoming edge.");
    if (problem.id !== "usaco-milk-factory" && graph.directed && Object.values(incoming).some(count => count > 1)) throw new Error("Each child in this tree can have only one parent.");
  }

  function validateExactGridAdjacency(graph, allowsDiagonals) {
    const config = counterInputSpec().resultConfig?.adjacency || { mode: "all" }, marker = config.marker ? graph.nodeMarkers?.[config.marker] || {} : {};
    if (graph.directed && config.mode === "all") return;
    const key = (from, to) => graph.directed ? `${from}\u0000${to}` : counterEdgeKey(graph, from, to);
    const expected = new Set(), actual = new Set(graph.edges.map(([from, to]) => key(from, to)));
    const connects = (from, to) => {
      if (config.mode === "equal-marker") return String(marker[from]) === String(marker[to]);
      if (config.mode === "increasing-marker") return Number(marker[from]) < Number(marker[to]);
      if (config.mode === "from-marker") return (config.fromValues || []).map(String).includes(String(marker[from])) && !(config.toExcludedValues || []).map(String).includes(String(marker[to]));
      return true;
    };
    for (let first = 0; first < graph.nodes.length; first++) for (let second = first + 1; second < graph.nodes.length; second++) {
      const one = graph.nodes[first], two = graph.nodes[second], a = coordinate(one), b = coordinate(two);
      const rowGap = Math.abs(a[0] - b[0]), columnGap = Math.abs(a[1] - b[1]);
      const adjacent = allowsDiagonals ? Math.max(rowGap, columnGap) === 1 : rowGap + columnGap === 1;
      if (!adjacent) continue;
      if (graph.directed) {
        if (connects(one, two)) expected.add(key(one, two));
        if (connects(two, one)) expected.add(key(two, one));
      } else if (connects(one, two) || connects(two, one)) expected.add(key(one, two));
    }
    if ([...expected].some(edge => !actual.has(edge))) throw new Error("Connect every adjacent pair allowed by this problem's input rules.");
    if ([...actual].some(edge => !expected.has(edge))) throw new Error("Remove edges between cells the input rules do not connect.");
    if (actual.size !== graph.edges.length) throw new Error("Draw each required grid edge exactly once.");
  }

  function counterexampleRequiresTree() {
    return new Set(["package-to-the-outpost", "reachable-nodes-with-restrictions", "kill-process", "time-needed-to-inform-all-employees", "who-keeps-their-job", "save-the-date-phone-chain", "shut-the-garden-valve", "evaluate-boolean-binary-tree", "structy-max-root-to-leaf-path-sum", "path-sum", "structy-tree-sum", "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "gold-and-silver-lights", "flatten-nested-list-iterator", "nested-list-weight-sum", "nested-list-weight-sum-ii", "busiest-shelf-level", "coins-on-level-k", "kth-song-in-playlist", "top-of-the-pile", "codewars-array-deep-count", "minimum-fuel-cost-to-report-to-the-capital", "minimum-time-to-collect-all-apples-in-a-tree", "count-good-nodes-in-binary-tree", "diameter-of-binary-tree", "lowest-common-ancestor-of-a-binary-tree", "binary-tree-level-order-traversal", "invert-binary-tree", "same-tree", "subtree-of-another-tree", "balanced-binary-tree", "maximum-depth-of-binary-tree", "merge-two-binary-trees", "binary-tree-right-side-view", "validate-binary-search-tree", "kth-smallest-element-in-a-bst", "construct-binary-tree-from-preorder-and-inorder-traversal", "serialize-and-deserialize-binary-tree", "all-paths-from-source-lead-to-destination", "employee-importance", "usaco-milk-factory"]).has(problem.id);
  }

  function expectedCanvas(graph) {
    return {
      directed: graph.directed,
      nodes: graph.nodes.map(label => ({ id: label, label, ...(graph.blocked?.includes(label) ? { color: "blue" } : {}) })),
      edges: graph.edges.map(([from, to, color]) => {
        const config = counterInputSpec().resultConfig || {};
        const marker = config.weightMarker || config.ratioMarker;
        const values = graph.edgeMarkers?.[marker] || {};
        const directKey = `${from}\u0000${to}`, reverseKey = `${to}\u0000${from}`;
        const delayMarker = config.waitMarker || config.delayMarker;
        const label = delayMarker ? graph.nodeMarkers?.[delayMarker]?.[from] : values[directKey] ?? values[reverseKey] ?? values[counterEdgeKey(graph, from, to)];
        return { from, to, ...(color ? { color } : {}), ...(label != null ? { label: String(label) } : {}) };
      })
    };
  }

  function runSearch(graph, bugs = [], startOverride = null) {
    if (Array.isArray(graph.starts)) {
      const starts = bugs.includes("first-start-only") ? graph.starts.slice(0, 1) : graph.starts;
      const reached = new Set(starts.flatMap(start => runSearch({ ...graph, starts: undefined, start }, bugs, start)));
      return graph.nodes.filter(node => reached.has(node));
    }
    const searchGraph = mistakenGraph(graph, bugs, startOverride);
    const directed = searchGraph.directed;
    let edges = searchGraph.edges;
    if (problem.id === "reachable-nodes-with-restrictions") edges = edges.filter(([from, to]) => !/ \(restricted\)$/.test(from) && !/ \(restricted\)$/.test(to));
    if (problem.id === "flooded-campsite-trails") {
      const blocked = new Set(searchGraph.blocked || []);
      edges = edges.filter(([from, to]) => !blocked.has(from) && !blocked.has(to));
      if (blocked.has(searchGraph.start)) return [];
    }
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

  function counterReachability(graph, bugs = [], startOverride = null) {
    const reached = runSearch(graph, bugs, startOverride);
    const reachedSet = new Set(reached);
    return { reached, unreached: graph.nodes.filter(node => !reachedSet.has(node)) };
  }

  function counterBoundaryExplanation(graph, bugs = [], startOverride = null) {
    if (usesArrayNumberDrawing()) {
      const reached = runSearch(graph, bugs, startOverride);
      const numbers = reached.filter(node => /^root(?:\[\d+\])+=-?\d+$/.test(node));
      return `The search reaches ${numbers.length} Number node${numbers.length === 1 ? "" : "s"}. ${bugs.includes("wrong-start") && problem.id === "coins-on-level-k" ? "For this mistaken search, the first element starts at depth 0; each arrow adds 1." : arrayDrawingOptions().instructions[2]} Returned output: ${formatCounterOutput(counterResult(graph, bugs, startOverride))}.`;
    }
    const result = counterInputSpec().result;
    if (["component-count", "border-component-count", "maximum-component-size", "minimum-component-size", "exact-size-component-count", "qualified-component-count", "components-without-source-count", "maximum-component-value-sum", "component-bounding-boxes", "minimum-component-bounding-perimeter", "component-sorted-string"].includes(result)) {
      const groups = counterComponents(graph, bugs);
      const rule = result === "border-component-count" ? "Count each scanned group that touches the grid border." : result === "maximum-component-size" ? "Return the largest group size." : result === "exact-size-component-count" ? "Count only groups whose size equals k." : `Apply the ${counterInputSpec().resultLabel || "output"} rule to these groups.`;
      return `The scan restarts at every still-unseen node. It finds these groups: ${formatCounterOutput(groups)}. ${rule}`;
    }
    return `From the chosen start, the search reaches ${formatCounterOutput(counterReachability(graph, bugs, startOverride).reached)}. Apply the ${counterInputSpec().resultLabel || "output"} rule to the input and search.`;
  }

  function counterResult(graph, bugs = [], startOverride = null) {
    const sets = counterReachability(graph, bugs, startOverride);
    switch (counterInputSpec().result) {
      case "unreached-nodes": return problem.id === "who-keeps-their-job" ? sets.unreached.sort((a, b) => Number(a) - Number(b)) : sets.unreached;
      case "reached-count": return sets.reached.length;
      case "unreached-count": return sets.unreached.length;
      case "all-reached": return sets.unreached.length === 0;
      case "any-unreached": return sets.unreached.length > 0;
      case "target-reachable-boolean":
      case "same-color-target-reachable-boolean": return sets.reached.includes(graph.fields?.[counterInputSpec().resultConfig?.targetField]);
      case "reached-node-value-sum": {
        const marker = counterInputSpec().resultConfig?.valueMarker;
        return sets.reached.reduce((sum, node) => sum + Number(graph.nodeMarkers?.[marker]?.[node] || 0), 0);
      }
      case "shortest-path-weight": return shortestCounterPath(graph, bugs, startOverride);
      case "maximum-shortest-path-weight-or-minus-one": {
        const distances = counterArrivalTimes(graph, bugs, startOverride, { edgeMarker: counterInputSpec().resultConfig?.weightMarker });
        return Object.values(distances).every(Number.isFinite) ? Math.max(...Object.values(distances)) : -1;
      }
      case "maximum-path-weight": {
        const distances = counterArrivalTimes(graph, bugs, startOverride, { nodeDelayMarker: counterInputSpec().resultConfig?.delayMarker });
        return Math.max(0, ...Object.values(distances).filter(Number.isFinite));
      }
      case "deadline-reached-count": {
        const config = counterInputSpec().resultConfig || {};
        const distances = counterArrivalTimes(graph, bugs, startOverride, { nodeDelayMarker: config.waitMarker });
        const deadline = Number(graph.fields?.[config.deadlineField]);
        return Object.values(distances).filter(time => Number.isFinite(time) && time <= deadline).length;
      }
      case "border-component-count": {
        const rows = Number(graph.fields.rows), columns = Number(graph.fields.columns);
        return counterComponents(graph, bugs).filter(group => group.some(node => {
          const [row, column] = coordinate(node);
          return row === 0 || column === 0 || row === rows - 1 || column === columns - 1;
        })).length;
      }
      case "component-count": return counterComponents(graph, bugs).length;
      case "maximum-component-size": return Math.max(0, ...counterComponents(graph, bugs).map(group => group.length));
      case "minimum-component-size": return Math.min(Infinity, ...counterComponents(graph, bugs).map(group => group.length));
      case "maximum-reached-count": return Math.max(0, ...graph.nodes.map(node => counterReachability({ ...graph, start: node }, bugs, node).reached.length));
      case "path-count": return counterPaths(graph, bugs).length;
      case "path-count-modulo": return counterAllIncreasingPathCount(graph, bugs) % 1000000007;
      case "enumerated-paths": return counterPaths(graph, bugs);
      case "longest-path-length": return counterLongestPath(graph, bugs);
      case "valid-two-coloring-boolean": return counterIsBipartite(graph, bugs);
      case "acyclic-completion-boolean": return counterIsAcyclic(graph, bugs);
      case "maximum-reached-node-value": return Math.max(...sets.reached.map(counterNodeNumber));
      case "reachability-matrix": {
        const orderedNodes = [...graph.nodes].sort((one, two) => String(one).localeCompare(String(two), undefined, { numeric: true }));
        return orderedNodes.map(node => {
        const reachable = new Set(counterReachability({ ...graph, start: node }, bugs, node).reached);
          return orderedNodes.map(target => reachable.has(target) ? 1 : 0);
        });
      }
      case "generated-terminal-strings": return counterTerminalStrings(graph, bugs, startOverride);
      case "recursive-item-count": return Math.max(0, sets.reached.length - 1);
      case "root-expression-value": return counterBooleanTree(graph, bugs, startOverride);
      case "component-bounding-boxes": return counterBoundingBoxes(graph, bugs);
      case "minimum-universally-reachable-node-or-minus-one": return counterUniversalNode(graph, bugs);
      case "iterator-output-sequence": return counterNestedIntegers(graph, bugs, startOverride).sort((one, two) => one.path.localeCompare(two.path, undefined, { numeric: true })).map(item => item.value);
      case "depth-weighted-value-sum": return counterNestedIntegers(graph, bugs, startOverride).reduce((sum, item) => sum + item.depth * item.value, 0);
      case "inverse-depth-weighted-value-sum": {
        const items = counterNestedIntegers(graph, bugs, startOverride), maxDepth = Math.max(0, ...items.map(item => item.depth));
        return items.reduce((sum, item) => sum + (maxDepth - item.depth + 1) * item.value, 0);
      }
      case "widest-level-index": {
        const counts = {}; counterNestedIntegers(graph, bugs, startOverride).forEach(item => { counts[item.depth] = (counts[item.depth] || 0) + 1; });
        return Number(Object.keys(counts).sort((one, two) => counts[two] - counts[one] || one - two)[0] ?? 0);
      }
      case "level-value-sum": {
        const config = counterInputSpec().resultConfig || {};
        const items = config.valueMarker ? counterMarkedTreeItems(graph, bugs, startOverride, config.valueMarker) : counterNestedIntegers(graph, bugs, startOverride);
        const depth = config.mode === "shallowest" ? Math.min(...items.map(item => item.depth)) : Number(graph.fields?.[config.depthField]);
        return items.filter(item => item.depth === depth).reduce((sum, item) => sum + item.value, 0);
      }
      case "exact-size-component-count": {
        const size = Number(graph.fields?.[counterInputSpec().resultConfig?.sizeField]);
        return counterComponents(graph, bugs).filter(group => group.length === size).length;
      }
      case "kth-visited-node-or-minus-one": {
        const config = counterInputSpec().resultConfig || {};
        const items = counterMarkedTreeItems(graph, bugs, startOverride, config.valueMarker);
        return items[Number(graph.fields?.[config.positionField]) - 1]?.value ?? -1;
      }
      case "target-root-leaf-sum-exists-boolean": return counterHasTargetPathSum(graph, bugs, startOverride);
      case "components-without-source-count": {
        const config = counterInputSpec().resultConfig || {}, sources = graph.nodeMarkers?.[config.sourceMarker] || {};
        return counterComponents(graph, bugs).filter(group => !group.some(node => String(sources[node]) === String(config.sourceValue))).length;
      }
      case "qualified-component-count": {
        const config = counterInputSpec().resultConfig || {}, qualifiers = graph.nodeMarkers?.[config.qualifierMarker] || {};
        return counterComponents(graph, bugs).filter(group => group.every(node => String(qualifiers[node]) === String(config.qualifyingValue))).length;
      }
      case "reached-selected-node-count": {
        const config = counterInputSpec().resultConfig || {}, selected = graph.nodeMarkers?.[config.selectorMarker] || {};
        return sets.reached.filter(node => String(selected[node]) === String(config.selectedValue)).length;
      }
      case "maximum-component-value-sum": {
        const values = graph.nodeMarkers?.[counterInputSpec().resultConfig?.valueMarker] || {};
        return Math.max(0, ...counterComponents(graph, bugs).map(group => group.reduce((sum, node) => sum + Number(values[node] || 0), 0)));
      }
      case "component-sorted-string": return counterSmallestSwapString(graph, bugs);
      case "selected-color-count": return counterGoldCount(graph, bugs, startOverride);
      case "minimum-component-bounding-perimeter": return counterMinimumPerimeter(graph, bugs);
      case "maximum-root-leaf-value-sum": return counterMaximumRootLeafSum(graph, bugs, startOverride);
      case "transformed-grid": return counterTransformedGrid(graph, bugs, startOverride);
      case "ordered-query-values": return counterInputSpec().resultConfig?.mode === "ratio" ? counterDivisionQueryValues(graph, bugs, startOverride) : counterGridQueryValues(graph, bugs, startOverride);
      case "target-state-reachable-boolean": return counterJugTarget(graph, bugs, startOverride);
      case "target-word-path-exists-boolean": return counterWordExists(graph, bugs);
      case "reached-nodes": return sets.reached;
      default: throw new Error(`Unsupported Step 2 result kind: ${counterInputSpec().result}`);
    }
  }

  function counterDivisionQueryValues(graph, bugs = [], startOverride = null) {
    const config = counterInputSpec().resultConfig || {}, changed = mistakenGraph(graph, bugs, startOverride), target = graph.fields?.[config.targetField], ratios = graph.edgeMarkers?.[config.ratioMarker] || {}, adjacency = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => adjacency[from].push(to));
    const solve = (node, product, used, depth) => {
      if (node === target) return product;
      let next = adjacency[node].filter(item => !used.has(item));
      if (bugs.includes("shallow-search") && depth >= 1) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      for (const item of next) {
        const ratio = ratios[counterEdgeKey(graph, node, item)];
        const found = solve(item, product * Number(ratio), new Set([...used, item]), depth + 1);
        if (found != null) return found;
      }
      return null;
    };
    const value = solve(changed.start, 1, new Set([changed.start]), 0);
    return [value == null ? -1 : value];
  }

  function counterJugTarget(graph, bugs = [], startOverride = null) {
    const target = Number(graph.fields?.[counterInputSpec().resultConfig?.targetField]);
    return runSearch(graph, bugs, startOverride).some(node => { const [one, two] = coordinate(node); return one === target || two === target || one + two === target; });
  }

  function jugStateGraph(capOne, capTwo) {
    const label = (one, two) => `(${one},${two})`, start = label(0, 0), seen = new Set([start]), pending = [start], edges = [];
    while (pending.length) {
      const from = pending.shift(), [one, two] = coordinate(from), pourOne = Math.min(one, capTwo - two), pourTwo = Math.min(two, capOne - one);
      const next = [[capOne, two], [one, capTwo], [0, two], [one, 0], [one - pourOne, two + pourOne], [one + pourTwo, two - pourTwo]];
      for (const pair of next) {
        const to = label(pair[0], pair[1]);
        if (to === from || edges.some(edge => edge[0] === from && edge[1] === to)) continue;
        edges.push([from, to]);
        if (!seen.has(to)) { seen.add(to); pending.push(to); }
      }
    }
    return { nodes: [...seen], edges };
  }

  function counterWordExists(graph, bugs = []) {
    const config = counterInputSpec().resultConfig || {}, word = String(graph.fields?.[config.wordField] || ""), letters = graph.nodeMarkers?.[config.letterMarker] || {}, { changed, adjacency } = counterAdjacency(graph, bugs);
    const walk = (node, index, used) => {
      if (letters[node] !== word[index]) return false;
      if (index === word.length - 1) return true;
      let next = adjacency[node].filter(item => !used.has(item) && letters[item] === word[index + 1]);
      if (bugs.includes("shallow-search") && index >= 1) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      return next.some(item => walk(item, index + 1, new Set([...used, item])));
    };
    return Boolean(word) && changed.nodes.some(node => walk(node, 0, new Set([node])));
  }

  function counterGridLayout(graph, values) {
    const points = graph.nodes.map(node => coordinate(node)), rows = Math.max(...points.map(point => point[0])) + 1, columns = Math.max(...points.map(point => point[1])) + 1;
    return Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => values[`(${row},${column})`]));
  }

  function counterRevealCells(graph, bugs = [], startOverride = null, hazardMarker) {
    const changed = mistakenGraph(graph, bugs, startOverride), values = graph.nodeMarkers?.[hazardMarker] || {}, adjacency = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => { adjacency[from].push(to); if (!changed.directed) adjacency[to].push(from); });
    const hazard = problem.id === "minesweeper" ? "M" : "G", reached = new Set(), pending = [[changed.start, 0]];
    while (pending.length) {
      const [node, depth] = pending.pop(); if (reached.has(node)) continue; reached.add(node);
      if (values[node] === hazard) continue;
      const hazardCount = adjacency[node].filter(next => values[next] === hazard).length;
      if (hazardCount) continue;
      let next = adjacency[node].filter(item => !reached.has(item) && values[item] !== hazard);
      if (bugs.includes("shallow-search") && depth >= 1) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      next.forEach(item => pending.push([item, depth + 1]));
    }
    return { changed, adjacency, reached, values, hazard };
  }

  function counterTransformedGrid(graph, bugs = [], startOverride = null) {
    const config = counterInputSpec().resultConfig || {};
    if (problem.id === "flood-fill") {
      const values = graph.nodeMarkers?.[config.valueMarker] || {}, reached = new Set(runSearch(graph, bugs, startOverride)), nextColor = graph.fields?.[config.newColorField];
      return counterGridLayout(graph, Object.fromEntries(graph.nodes.map(node => [node, reached.has(node) ? nextColor : values[node]])));
    }
    const reveal = counterRevealCells(graph, bugs, startOverride, config.valueMarker), output = { ...reveal.values };
    for (const node of reveal.reached) {
      if (reveal.values[node] === reveal.hazard) output[node] = "X";
      else {
        const count = reveal.adjacency[node].filter(next => reveal.values[next] === reveal.hazard).length;
        output[node] = count ? String(count) : problem.id === "minesweeper" ? "B" : "S";
      }
    }
    return counterGridLayout(graph, output);
  }

  function counterGridQueryValues(graph, bugs = [], startOverride = null) {
    const config = counterInputSpec().resultConfig || {}, changed = mistakenGraph(graph, bugs, startOverride), target = graph.fields?.[config.targetField], values = graph.nodeMarkers?.[config.valueMarker] || {}, reached = new Set(runSearch(graph, bugs, startOverride));
    return [reached.has(target) && values[changed.start] === values[target] ? values[changed.start] === "1" ? "decimal" : "binary" : "neither"];
  }

  function counterNestedIntegers(graph, bugs = [], startOverride = null) {
    const reached = new Set(runSearch(graph, bugs, startOverride));
    return graph.nodes.map(node => {
      const match = String(node).match(/^(root(?:\[\d+\])*)=(-?\d+)$/);
      return match && reached.has(node) ? { path: match[1], depth: (match[1].match(/\[/g) || []).length, value: Number(match[2]) } : null;
    }).filter(Boolean);
  }

  function counterMarkedTreeItems(graph, bugs = [], startOverride = null, markerId) {
    const changed = mistakenGraph(graph, bugs, startOverride), children = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => children[from].push(to));
    const values = graph.nodeMarkers?.[markerId] || {}, items = [], seen = new Set();
    const walk = (node, depth) => {
      if (seen.has(node)) return;
      seen.add(node);
      if (values[node] != null) items.push({ path: node, depth, value: Number(values[node]) });
      let next = children[node] || [];
      if (bugs.includes("shallow-search") && depth > 0) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      next = [...next].sort((one, two) => one.localeCompare(two, undefined, { numeric: true }));
      next.forEach(child => walk(child, depth + 1));
    };
    walk(changed.start, 0);
    return items;
  }

  function counterHasTargetPathSum(graph, bugs = [], startOverride = null) {
    const changed = mistakenGraph(graph, bugs, startOverride), children = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => children[from].push(to));
    const config = counterInputSpec().resultConfig || {}, values = graph.nodeMarkers?.[config.valueMarker] || {};
    const target = Number(graph.fields?.[config.targetField]);
    const matches = (node, sum) => {
      let next = children[node] || [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      const total = sum + Number(values[node] || 0);
      return next.length ? next.some(child => matches(child, total)) : total === target;
    };
    return Boolean(changed.start && matches(changed.start, 0));
  }

  function counterSmallestSwapString(graph, bugs = []) {
    const answer = [...graph.nodes].sort((one, two) => counterNodeNumber(one) - counterNodeNumber(two)).map(node => String(node).split(":").at(-1));
    for (const group of counterComponents(graph, bugs)) {
      const positions = group.map(counterNodeNumber).sort((a, b) => a - b), letters = group.map(node => String(node).split(":").at(-1)).sort();
      positions.forEach((position, index) => { answer[position] = letters[index]; });
    }
    return answer.join("");
  }

  function counterGoldCount(graph, bugs = [], startOverride = null) {
    const changed = mistakenGraph(graph, bugs, startOverride), adjacency = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => { adjacency[from].push(to); if (!changed.directed) adjacency[to].push(from); });
    const depth = { [changed.start]: 0 }, pending = [changed.start];
    while (pending.length) { const node = pending.shift(); let next = adjacency[node].filter(item => depth[item] == null); if (bugs.includes("shallow-search") && depth[node] > 0) next = []; if (bugs.includes("first-branch")) next = next.slice(0, 1); if (bugs.includes("last-branch")) next = next.slice(-1); next.forEach(item => { depth[item] = depth[node] + 1; pending.push(item); }); }
    return Object.values(depth).filter(value => value % 2 === 0).length;
  }

  function counterMinimumPerimeter(graph, bugs = []) {
    return Math.min(...counterComponents(graph, bugs).map(group => { const points = group.map(node => (String(node).match(/:\((-?\d+),(-?\d+)\)$/) || []).slice(1).map(Number)); const xs = points.map(point => point[0]), ys = points.map(point => point[1]); return 2 * (Math.max(...xs) - Math.min(...xs) + Math.max(...ys) - Math.min(...ys)); }));
  }

  function counterMaximumRootLeafSum(graph, bugs = [], startOverride = null) {
    const changed = mistakenGraph(graph, bugs, startOverride), adjacency = Object.fromEntries(changed.nodes.map(node => [node, []])); changed.edges.forEach(([from, to]) => adjacency[from].push(to));
    const value = node => Number((String(node).match(/:\s*(-?\d+)$/) || [0, 0])[1]);
    const best = (node, depth = 0) => { let next = adjacency[node]; if (bugs.includes("shallow-search") && depth > 0) next = []; if (bugs.includes("first-branch")) next = next.slice(0, 1); if (bugs.includes("last-branch")) next = next.slice(-1); return value(node) + (next.length ? Math.max(...next.map(item => best(item, depth + 1))) : 0); };
    return best(changed.start);
  }

  function counterTerminalStrings(graph, bugs = [], startOverride = null) {
    const changed = mistakenGraph(graph, bugs, startOverride);
    const reached = new Set(runSearch(graph, bugs, startOverride));
    const outgoing = Object.fromEntries(changed.nodes.map(node => [node, 0]));
    changed.edges.forEach(([from]) => outgoing[from]++);
    return changed.nodes.filter(node => reached.has(node) && (problem.id === "runes-on-the-castle-door" ? node.length === graph.fields.dials.length : outgoing[node] === 0) && node !== "start" && node !== "empty prefix").map(node => node === "ε" ? "" : node);
  }

  function counterBooleanTree(graph, bugs = [], startOverride = null) {
    const changed = mistakenGraph(graph, bugs, startOverride), children = Object.fromEntries(changed.nodes.map(node => [node, []]));
    changed.edges.forEach(([from, to]) => children[from].push(to));
    const evaluate = node => {
      const text = String(node);
      if (/:true$/i.test(text)) return true;
      if (/:false$/i.test(text)) return false;
      let values = children[node].map(evaluate);
      if (bugs.includes("first-branch")) values = values.slice(0, 1);
      if (bugs.includes("last-branch")) values = values.slice(-1);
      if (/:OR$/i.test(text)) return values.some(Boolean);
      return values.length > 0 && values.every(Boolean);
    };
    return evaluate(changed.start);
  }

  function counterBoundingBoxes(graph, bugs = []) {
    return counterComponents(graph, bugs).map(group => {
      const points = group.map(coordinate), rows = points.map(point => point[0]), columns = points.map(point => point[1]);
      return [Math.min(...rows), Math.min(...columns), Math.max(...rows), Math.max(...columns)];
    }).sort((one, two) => one[0] - two[0] || one[1] - two[1]);
  }

  function counterUniversalNode(graph, bugs = []) {
    const ordered = [...graph.nodes].sort((one, two) => String(one).localeCompare(String(two), undefined, { numeric: true }));
    return ordered.find(candidate => ordered.every(start => counterReachability({ ...graph, start }, bugs, start).reached.includes(candidate))) || -1;
  }

  function counterNodeNumber(label) {
    const match = String(label).match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  function counterAdjacency(graph, bugs = []) {
    const changed = mistakenGraph(graph, bugs, bugs.includes("wrong-start") ? graph.nodes[0] : graph.start);
    const adjacency = Object.fromEntries(changed.nodes.map(node => [node, []]));
    for (const [from, to] of changed.edges) {
      if (!adjacency[from].includes(to)) adjacency[from].push(to);
      if (!changed.directed && !adjacency[to].includes(from)) adjacency[to].push(from);
    }
    return { changed, adjacency };
  }

  function counterComponents(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    const globallySeen = new Set(), groups = [];
    for (const seed of changed.nodes) {
      if (globallySeen.has(seed)) continue;
      const local = new Set([seed]), pending = [seed];
      while (pending.length) {
        const current = pending.pop();
        let next = adjacency[current].filter(node => !local.has(node) && !globallySeen.has(node));
        if (bugs.includes("shallow-search") && current !== seed) next = [];
        if (bugs.includes("first-branch")) next = next.slice(0, 1);
        if (bugs.includes("last-branch")) next = next.slice(-1);
        for (const node of next) { local.add(node); pending.push(node); }
      }
      local.forEach(node => globallySeen.add(node));
      groups.push(changed.nodes.filter(node => local.has(node)));
    }
    return groups;
  }

  function counterTerminal(graph) {
    return [...graph.nodes].sort((one, two) => String(one).localeCompare(String(two), undefined, { numeric: true })).at(-1);
  }

  function counterPaths(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    const target = counterTerminal(graph), paths = [];
    const walk = (node, path) => {
      if (node === target) { if (!graph.checkpoint || path.includes(graph.checkpoint)) paths.push(path); return; }
      let next = adjacency[node].filter(item => !path.includes(item));
      if (bugs.includes("shallow-search") && path.length > 1) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      next.forEach(item => walk(item, [...path, item]));
    };
    walk(changed.start, [changed.start]);
    return paths;
  }

  function counterAllIncreasingPathCount(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    const memo = new Map();
    const count = node => {
      if (memo.has(node)) return memo.get(node);
      let next = adjacency[node];
      if (bugs.includes("shallow-search")) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      const value = 1 + next.reduce((sum, item) => sum + count(item), 0);
      memo.set(node, value); return value;
    };
    return changed.nodes.reduce((sum, node) => sum + count(node), 0);
  }

  function counterLongestPath(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    let longest = changed.nodes.length ? 1 : 0;
    const walk = (node, seen) => {
      longest = Math.max(longest, seen.size);
      let next = adjacency[node].filter(item => !seen.has(item));
      if (bugs.includes("shallow-search") && seen.size > 1) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      for (const item of next) walk(item, new Set([...seen, item]));
    };
    changed.nodes.forEach(node => walk(node, new Set([node])));
    return longest;
  }

  function counterIsBipartite(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    const colors = {};
    for (const seed of changed.nodes) {
      if (colors[seed] != null) continue;
      colors[seed] = 0; const pending = [seed];
      while (pending.length) {
        const node = pending.pop();
        let next = adjacency[node];
        if (bugs.includes("shallow-search") && node !== seed) next = [];
        if (bugs.includes("first-branch")) next = next.slice(0, 1);
        if (bugs.includes("last-branch")) next = next.slice(-1);
        for (const item of next) {
          if (colors[item] === colors[node]) return false;
          if (colors[item] == null) { colors[item] = 1 - colors[node]; pending.push(item); }
        }
      }
    }
    return true;
  }

  function counterIsAcyclic(graph, bugs = []) {
    const { changed, adjacency } = counterAdjacency(graph, bugs);
    const done = new Set(), active = new Set();
    const visit = (node, depth = 0) => {
      if (active.has(node)) return false;
      if (done.has(node)) return true;
      active.add(node);
      let next = adjacency[node];
      if (bugs.includes("shallow-search") && depth > 0) next = [];
      if (bugs.includes("first-branch")) next = next.slice(0, 1);
      if (bugs.includes("last-branch")) next = next.slice(-1);
      for (const item of next) if (!visit(item, depth + 1)) return false;
      active.delete(node); done.add(node); return true;
    };
    if (bugs.includes("first-branch") || bugs.includes("last-branch")) return visit(changed.start);
    return changed.nodes.every(node => visit(node));
  }

  function shortestCounterPath(graph, bugs = [], startOverride = null) {
    const searchGraph = mistakenGraph(graph, bugs, startOverride);
    const config = counterInputSpec().resultConfig || {};
    const target = graph.fields?.[config.targetField];
    const distance = Object.fromEntries(searchGraph.nodes.map(node => [node, Infinity]));
    distance[searchGraph.start] = 0;
    const pending = new Set(searchGraph.nodes);
    const weight = (from, to) => {
      const direct = graph.edgeMarkers?.[config.weightMarker]?.[counterEdgeKey(graph, from, to)];
      if (direct != null) return Number(direct);
      const reversed = graph.edgeMarkers?.[config.weightMarker]?.[counterEdgeKey(graph, to, from)];
      return reversed == null ? Infinity : Number(reversed);
    };
    while (pending.size) {
      const current = [...pending].sort((one, two) => distance[one] - distance[two])[0];
      pending.delete(current);
      if (!Number.isFinite(distance[current]) || current === target) break;
      for (const [from, to] of searchGraph.edges) {
        const neighbors = from === current ? [to] : !searchGraph.directed && to === current ? [from] : [];
        for (const next of neighbors) distance[next] = Math.min(distance[next], distance[current] + weight(from, to));
      }
    }
    return Number.isFinite(distance[target]) ? distance[target] : -1;
  }

  function counterArrivalTimes(graph, bugs = [], startOverride = null, config = {}) {
    const changed = mistakenGraph(graph, bugs, startOverride);
    const distance = Object.fromEntries(changed.nodes.map(node => [node, Infinity]));
    distance[changed.start] = 0;
    const pending = new Set(changed.nodes);
    const weight = (from, to) => {
      if (config.nodeDelayMarker) return Number(graph.nodeMarkers?.[config.nodeDelayMarker]?.[from] ?? Infinity);
      const markers = graph.edgeMarkers?.[config.edgeMarker] || {};
      const direct = markers[counterEdgeKey(graph, from, to)];
      if (direct != null) return Number(direct);
      const reversed = markers[counterEdgeKey(graph, to, from)];
      return reversed == null ? Infinity : Number(reversed);
    };
    while (pending.size) {
      const current = [...pending].sort((one, two) => distance[one] - distance[two])[0];
      pending.delete(current);
      if (!Number.isFinite(distance[current])) break;
      if (bugs.includes("shallow-search") && current !== changed.start) continue;
      let outgoing = changed.edges.flatMap(([from, to]) => from === current ? [[from, to]] : !changed.directed && to === current ? [[to, from]] : []);
      if (bugs.includes("first-branch")) outgoing = outgoing.slice(0, 1);
      if (bugs.includes("last-branch")) outgoing = outgoing.slice(-1);
      for (const [from, to] of outgoing) distance[to] = Math.min(distance[to], distance[current] + weight(from, to));
    }
    return distance;
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
        const marker = counterInputSpec().resultConfig?.valueMarker, values = graph.nodeMarkers?.[marker];
        const sameValue = !["flood-fill", "ten-kinds-of-people"].includes(problem.id) || values?.[graph.nodes[a]] === values?.[graph.nodes[b]];
        if (one && two && sameValue && Math.abs(one[0] - two[0]) === 1 && Math.abs(one[1] - two[1]) === 1) {
          const increasingMarker = counterInputSpec().resultConfig?.adjacency?.mode === "increasing-marker" ? counterInputSpec().resultConfig.adjacency.marker : null;
          if (increasingMarker) {
            const values = graph.nodeMarkers[increasingMarker], first = graph.nodes[a], second = graph.nodes[b];
            if (values[first] < values[second]) edges.push([first, second, ""]);
            if (values[second] < values[first]) edges.push([second, first, ""]);
          } else edges.push([graph.nodes[a], graph.nodes[b], ""]);
        }
      }
    }
    if (bugs.includes("remove-diagonals")) edges = edges.filter(([from, to]) => {
      const one = coordinate(from), two = coordinate(to);
      return !one || !two || !(Math.abs(one[0] - two[0]) === 1 && Math.abs(one[1] - two[1]) === 1);
    });
    if (bugs.includes("strict-threshold")) edges = edges.filter(([from, to]) => Number(graph.fields.scores[Number(from)][Number(to)]) > Number(graph.fields.k));
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
    clearAiHelp();
    const blank = { nodes: [], edges: [], directed: false };
    const dualDrawings = usesDualCounterDrawings();
    const drawing = window.DFS_GRAPH?.getSnapshot() || blank;
    if (dualDrawings) counterDrawings[counterDrawingMode] = drawing;
    const correctDrawing = dualDrawings ? (counterDrawings.correct || blank) : drawing;
    const mistakenDrawing = dualDrawings ? (counterDrawings.mistaken || blank) : null;
    const parsed = parseCounterDrawing(correctDrawing, round, $("#counter-start")?.value);
    const mistakenStartLabel = String(round.mistakenStartLabel || "");
    const mistakenStart = round.bugs.includes("wrong-start")
      ? resolveCounterNode(parsed.graph?.nodes || [], mistakenStartLabel)
      : parsed.graph?.start;
    const gradeCounter = usesArrayNumberDrawing() ? (expected, drawing) => gradeArrayCounterCanvas(expected, drawing, arrayDrawingOptions()) : gradeCanvas;
    const graphCheck = parsed.graph ? gradeCounter(expectedCanvas(parsed.graph), correctDrawing) : { nodes: false, edges: false, direction: false, colors: false, labels: false };
    const mistakenGraphCheck = parsed.graph && dualDrawings ? gradeCounter(expectedCanvas(mistakenGraph(parsed.graph, round.bugs, mistakenStart)), mistakenDrawing) : null;
    const coffeeDrawingMatches = problem.id !== "routes-past-the-coffee-cart" || coffeeNodeLabel(mistakenDrawing) === parsed.graph?.checkpoint;
    const correctReachability = parsed.graph ? counterReachability(parsed.graph) : null;
    const buggyReachability = parsed.graph ? counterReachability(parsed.graph, round.bugs, mistakenStart) : null;
    const correctOutput = parsed.graph ? counterResult(parsed.graph) : [];
    const buggyOutput = parsed.graph ? counterResult(parsed.graph, round.bugs, mistakenStart) : [];
    const singletonReachability = parsed.graph ? round.bugs.map(bug => counterReachability(parsed.graph, [bug], mistakenStart)) : [];
    const singletonOutputs = parsed.graph ? round.bugs.map(bug => counterResult(parsed.graph, [bug], mistakenStart)) : [];
    const realReturn = counterUsesRealOutput(counterInputSpec().result);
    const exposes = parsed.graph
      && (realReturn || JSON.stringify(correctReachability.reached) !== JSON.stringify(buggyReachability.reached))
      && JSON.stringify(correctOutput) !== JSON.stringify(buggyOutput)
      && singletonReachability.every(result => realReturn || JSON.stringify(correctReachability.reached) !== JSON.stringify(result.reached))
      && singletonOutputs.every(output => JSON.stringify(correctOutput) !== JSON.stringify(output))
      && (problem.id !== "routes-past-the-coffee-cart" || correctReachability.reached.includes(parsed.graph.checkpoint) !== buggyReachability.reached.includes(parsed.graph.checkpoint));
    const checks = parsed.graph ? [
      [graphCheck.hint || "The correct graph and visible values match the input", graphCheck.nodes && graphCheck.edges && graphCheck.direction && graphCheck.colors && graphCheck.labels],
      [problem.id === "routes-past-the-coffee-cart" ? "The mistake changes whether the coffee cart is reached" : "The graph exposes the mistake", Boolean(exposes)],
      ["The correct graph follows the problem's graph rules", true],
      ...(dualDrawings ? [[personDrawingChanges(round.bugs) ? (mistakenGraphCheck.hint || `${characterName(counterProgress.index * 7)}'s drawing exactly shows the mistake`) : "The second drawing matches because the mistake changes only the search", mistakenGraphCheck.nodes && mistakenGraphCheck.edges && mistakenGraphCheck.direction && mistakenGraphCheck.colors && mistakenGraphCheck.labels && coffeeDrawingMatches]] : []),
      ["Your prediction for the correct solution", counterOutputMatches($("#counter-real-output").value, correctOutput)],
      [`Your prediction for ${characterName(counterProgress.index * 7)}’s solution`, counterOutputMatches($("#counter-bug-output").value, buggyOutput)]
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
      const outputHints = [];
      if (parsed.graph && graphCheck.nodes && graphCheck.edges && graphCheck.direction) {
        if (!checks[predictionOffset][1]) outputHints.push(`Correct solution: ${counterBoundaryExplanation(parsed.graph)}`);
        if (!checks[predictionOffset + 1][1]) outputHints.push(`${characterName(counterProgress.index * 7)} ${bugDescription(round.bugs[0])}. ${counterBoundaryExplanation(parsed.graph, round.bugs, mistakenStart)}`);
        if (!exposes) outputHints.push("Both searches return the same result here. Add or change a part of the input that this mistake would miss or wrongly include.");
      }
      $("#feedback-slot").innerHTML = `<div class="feedback case-feedback"><b>The contradiction is not complete yet.</b><ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass === null ? "blocked" : pass ? "passed" : "failed"}"><span>${pass === null ? "—" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${outputHints.map(hint => `<p class="feedback-next">${esc(hint)}</p>`).join("")}</div>`;
      offerAiHelp({ round, input: parsed, studentGraph: correctDrawing, studentMistakenGraph: mistakenDrawing, expectedGraph: parsed.graph ? expectedCanvas(parsed.graph) : null, expectedMistakenGraph: parsed.graph ? expectedCanvas(mistakenGraph(parsed.graph, round.bugs, mistakenStart)) : null, correctReachability, buggyReachability, correctOutput, buggyOutput, studentCorrectOutput: $("#counter-real-output").value, studentBuggyOutput: $("#counter-bug-output").value, checks });
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#counter-check").innerHTML = "Run revised searches <span>→</span>";
      return;
    }
    saveCounterProgress();
    saveCounterDraft();
    answered = true;
    updateCounterProgress(counterProgress.index + 1, counterexampleRounds().length);
    counterDraftFields().forEach(field => { field.disabled = true; });
    lockCounterexampleEditor();
    const name = characterName(counterProgress.index * 7);
    const realOutput = counterUsesRealOutput(counterInputSpec().result);
    $("#feedback-slot").innerHTML = `<div class="feedback good case-feedback"><b>Counterexample confirmed.</b><div class="case-result-grid"><div><span>${realOutput ? "Correct function returns" : "Correct search reaches"}</span><strong>${esc(formatCounterOutput(correctOutput))}</strong></div><div><span>${esc(name)}'s ${realOutput ? "function returns" : "search reaches"}</span><strong>${esc(formatCounterOutput(buggyOutput))}</strong></div></div><div class="feedback-why"><b>Why it works:</b> ${esc(name)} ${esc(bugDescription(round.bugs[0]))}. Correct solution: ${esc(counterBoundaryExplanation(parsed.graph))} With the mistake: ${esc(counterBoundaryExplanation(parsed.graph, round.bugs, mistakenStart))} ${realOutput ? `Applying the problem’s output rule gives ${esc(formatCounterOutput(correctOutput))} instead of ${esc(formatCounterOutput(buggyOutput))}.` : "Those different reached sets expose the mistake."}</div></div>`;
    const button = $("#counter-check");
    button.disabled = false;
    button.innerHTML = counterProgress.index === counterexampleRounds().length - 1 ? "Finish Step 2 <span>→</span>" : "Open next question <span>→</span>";
    pendingAdvance = () => {
      pendingAdvance = null;
      if (counterProgress.index < counterexampleRounds().length - 1) counterProgress.skills = [false, false, false, false];
      counterProgress.index++;
      saveCounterProgress();
    };
    persistProgress(counterStorageKey(), { ...counterProgress, index: counterProgress.index + 1 });
    button.onclick = () => { pendingAdvance?.(); render(); };
  }

  function lockCounterexampleEditor() {
    counterDraftFields().forEach(field => { field.disabled = true; });
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
      const source = String(value).trim();
      let actual;
      try { actual = parseLessonValue(source, "output", expected); }
      catch {
        const body = source.replace(/^\s*[\[{]\s*|\s*[\]}]\s*$/g, "");
        actual = body ? body.split(/\s*[,;]\s*/).map(item => item.replace(/^['"]|['"]$/g, "")) : [];
      }
      if (!Array.isArray(actual) || actual.some(item => typeof item !== "string" && typeof item !== "number")) return false;
      const normalize = item => /^-?\d+(?:\.\d+)?$/.test(String(item).trim()) ? Number(item) : String(item).trim();
      const typedExpected = expected.map(normalize).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
      return JSON.stringify(actual.map(normalize).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))) === JSON.stringify(typedExpected);
    } catch {
      return false;
    }
  }

  function counterOutputMatches(value, expected) {
    if (Array.isArray(expected) && problem.id === "who-keeps-their-job") {
      try { return JSON.stringify(parseLessonValue(String(value), "output", expected).map(Number)) === JSON.stringify(expected.map(Number)); } catch { return false; }
    }
    if (Array.isArray(expected) && ["iterator-output-sequence", "ordered-query-values"].includes(counterInputSpec().result)) {
      try {
        const actual = parseLessonValue(String(value), "output", expected);
        if (counterInputSpec().resultConfig?.mode === "ratio") return Array.isArray(actual) && actual.length === expected.length && actual.every((item, index) => typeof item === "number" && Math.abs(item - expected[index]) <= 1e-9 * Math.max(1, Math.abs(expected[index])));
        return JSON.stringify(actual) === JSON.stringify(expected);
      }
      catch { return false; }
    }
    if (Array.isArray(expected) && expected.some(Array.isArray)) {
      try {
        const actual = parseLessonValue(String(value), "output", expected);
        if (["enumerated-paths", "component-bounding-boxes"].includes(counterInputSpec().result)) {
          const sortPaths = paths => [...paths].sort((one, two) => JSON.stringify(one).localeCompare(JSON.stringify(two), undefined, { numeric: true }));
          const normalize = item => Array.isArray(item) ? item.map(normalize) : /^-?\d+$/.test(String(item)) ? Number(item) : item;
          return JSON.stringify(sortPaths(normalize(actual))) === JSON.stringify(sortPaths(normalize(expected)));
        }
        return JSON.stringify(actual) === JSON.stringify(expected);
      } catch { return false; }
    }
    if (Array.isArray(expected)) return friendlyListMatches(value, expected);
    const source = String(value).trim();
    if (typeof expected === "number") return source !== "" && Number(source) === expected;
    if (typeof expected === "boolean") return source.toLowerCase() === String(expected);
    return source === String(expected);
  }

  function formatCounterOutput(output) {
    if (!Array.isArray(output)) return String(output);
    if (counterInputSpec().result === "transformed-grid") return JSON.stringify(output);
    const typed = item => Array.isArray(item) ? item.map(typed) : /^-?\d+(?:\.\d+)?$/.test(String(item)) ? Number(item) : String(item);
    return JSON.stringify(typed(output));
  }

  function jsonAnswerMatches(value, expectedJson) {
    try {
      const raw = String(value).trim();
      const expected = JSON.parse(String(expectedJson).trim());
      let parsed;
      if (/^(true|false)$/i.test(raw)) parsed = raw.toLowerCase() === "true";
      else {
        try { parsed = parseLessonValue(raw, "output", expected); }
        catch { parsed = typeof expected === "string" ? raw : null; }
      }
      const unordered = new Set(["all-paths-from-source-to-target", "kill-process", "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "find-all-groups-of-farmland"]);
      const normalizePathIds = item => Array.isArray(item) ? item.map(normalizePathIds) : typeof item === "string" && /^\d+$/.test(item) ? Number(item) : item;
      const normalize = value => {
        const item = problem.id === "all-paths-from-source-to-target" ? normalizePathIds(value) : value;
        return unordered.has(problem.id) && Array.isArray(item)
          ? item.map(canonicalJson).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
          : canonicalJson(item);
      };
      return JSON.stringify(normalize(parsed)) === JSON.stringify(normalize(expected));
    }
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
    const skipped = counterProgress.skipped.filter(index => index < counterexampleRounds().length).length;
    const passed = counterexampleRounds().length - skipped;
    $("#challenge").innerHTML = `<div class="challenge-body victory counter-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Disproven"}</div><h3>${skipped ? "Step 2 finished." : "Step 2 complete."}</h3>${skipped ? `<p>${passed} passed · ${skipped} skipped.</p>` : ""}<div class="completion-actions"><button id="start-after-counter" class="primary-btn">Start Step ${sectionLabel(adjacentSection())} <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-counter" class="ghost-btn">Practice Step 2 again</button></div></div>`;
    $("#start-after-counter").onclick = () => switchSection(adjacentSection());
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
    if (node.remedial?.canvas) {
      const nodeTransferKey = JSON.stringify([node.remedial.input, node.remedial.canvas]);
      const nodeTransferIndex = transfers.findIndex(task => JSON.stringify([task.input, task.canvas]) === nodeTransferKey);
      if (nodeTransferIndex > 0) transfers.unshift(transfers.splice(nodeTransferIndex, 1)[0]);
    }
    const metadataIndex = transfers.findIndex((task, index) => index > 0 && task.canvas.edges.some(edge => edge.color || edge.label));
    if (metadataIndex >= 0 && metadataIndex !== transfers.length - 1) {
      [transfers[metadataIndex], transfers[transfers.length - 1]] = [transfers[transfers.length - 1], transfers[metadataIndex]];
    }
    return { node, edge, transfers };
  }

  function structureCanvasScore(canvas) {
    return canvas.nodes.length + canvas.edges.length * 2 + canvas.edges.filter(edge => edge.color || edge.label).length;
  }

  function structureTasks() {
    const source = structureSourceTasks();
    if (Array.isArray(problem.lesson.structureTasks) && problem.lesson.structureTasks.length === 5) source.transfers = problem.lesson.structureTasks;
    const rounds = source.transfers.map((transfer, roundIndex) => ({
      kind: "claims-build",
      label: "GRAPH CHECK + BUILD",
      facet: "claims + exact graph",
      input: transfer.input,
      claims: makeStructureClaims({ ...source, transfer }, roundIndex),
      task: transfer
    }));
    return problem.category === "variant" && problem.lesson.practicePlan ? problem.lesson.practicePlan.step3.map(index => rounds[index]) : rounds;
  }

  function makeStructureClaims({ node, edge, transfer }, roundIndex) {
    const seed = problemIndex + roundIndex * 17;
    const nodeRule = node.choices.find(choice => choice.id === node.correct);
    const edgeRule = edge.choices.find(choice => choice.id === edge.correct);
    const canvas = transfer.canvas;
    const answerMasks = [3,5,6,9,10,12,17,18,20,24,7,11,13,14,19,21,22,25,26,28];
    const answerMask = answerMasks[stableChoiceSlot(`${problem.id}:claims`, answerMasks.length)];
    const shortSlot = problem.category === "variant" ? problem.lesson.practicePlan?.step3.indexOf(roundIndex) : undefined;
    const expectedAnswer = shortSlot >= 0
      ? Boolean((1 + stableChoiceSlot(`${problem.id}:short-claims`, 6)) & (1 << shortSlot))
      : Boolean(answerMask & (1 << roundIndex));
    const claimFactories = [
      () => {
        const check = nodeMembershipClaim(canvas, nodeRule, node, seed);
        if (expectedAnswer) {
          check.statement = check.positiveStatement || `In this input, the rule “${check.statement.replace(/^In this input, /, "").replace(/\.$/, "")}” would choose the wrong nodes.`;
          check.correct = true;
        }
        return {
        kind: "membership",
        label: "NODE CHECK",
        facet: "which nodes count",
        input: transfer.input,
          ...check
        };
      },
      () => ({
        kind: "direct-vs-reach",
        label: "DIRECT-EDGE CHECK",
        facet: "direct edges",
        input: transfer.input,
        ...directVsReachabilityClaim(canvas, edgeRule, edge, seed, expectedAnswer)
      }),
      () => ({
        kind: "local-degree",
        label: "LOCAL-STRUCTURE CHECK",
        facet: "local degree",
        input: transfer.input,
        ...degreeClaim(canvas, seed, expectedAnswer)
      }),
      () => ({
        kind: "direction",
        label: "DIRECTION CHECK",
        facet: "edge direction",
        input: transfer.input,
        ...directionClaim(canvas, seed, expectedAnswer)
      }),
      () => {
        const metadata = edgeMetadataClaim(canvas, seed);
        return {
          kind: metadata ? "edge-metadata" : "reachable-count",
          label: metadata ? "EDGE-DETAIL CHECK" : "SEARCH-BOUNDARY CHECK",
          facet: metadata ? "edge details" : "reachable nodes",
          input: transfer.input,
          ...(metadata ? edgeMetadataClaim(canvas, seed, expectedAnswer) : structureBoundaryClaim(transfer, seed, expectedAnswer))
        };
      }
    ];
    const claim = claimFactories[roundIndex % claimFactories.length]();
    if (problem.id === "gas-pocket-survey" || problem.id === "minesweeper") {
      claim.statement = `In the position-adjacency graph: ${claim.statement}`;
      claim.feedback += " These edges show neighboring cells. A reveal search still stops at gas or a numbered cell.";
    }
    if (["flooded-campsite-trails", "reachable-nodes-with-restrictions"].includes(problem.id) && roundIndex === 3) {
      claim.statement = claim.statement.replace(/connection works/g, "physical trail is drawn");
      claim.feedback = problem.id === "flooded-campsite-trails" ? "Physical trails are two-way. The hiker still cannot enter a flooded campsite." : "The input connection is two-way. A legal search still cannot enter a restricted node.";
    }
    return [claim];
  }

  function nodeMembershipClaim(canvas, nodeRule, nodeTask, seed) {
    const authored = problem.graphRules.membershipClaim;
    if (authored) return {
      statement: `In this input, ${authored.no[0].toLowerCase() + authored.no.slice(1)}`,
      positiveStatement: `In this input, ${authored.yes[0].toLowerCase() + authored.yes.slice(1)}`,
      correct: false, feedback: nodeRule.feedback || nodeRule.label,
      misconception: authored.misconception
    };
    const misconceptions = nodeTask.choices.filter(choice => choice.id !== nodeTask.correct && choice.misconception);
    const preferred = STEP3_MEMBERSHIP_OVERRIDES[problem.id];
    const mistakenRule = misconceptions.find(choice => choice.misconception === preferred) || misconceptions[seed % misconceptions.length];
    const misconception = mistakenRule.misconception;
    const candidate = canvas.nodes[seed % Math.max(canvas.nodes.length, 1)];
    const nextCandidate = canvas.nodes[(seed + 1) % Math.max(canvas.nodes.length, 1)];
    const words = value => value.replace(/-/g, " ").replace(/\bnodes?\b/g, "nodes");
    let statement;
    if (/museum-vault-keyring/.test(problem.id) && misconception === "key-instance-as-node") {
      statement = "In this input, each key should become a node instead of each vault.";
    } else if (misconception === "model-obstacles-only") {
      statement = "In this input, only flooded campsites should become nodes.";
    } else if (problem.id === "runes-on-the-castle-door" && misconception === "leaves-only") {
      statement = "In this input, only complete-code leaves should become nodes.";
    } else if (problem.id === "path-sum" && misconception === "counts-only-leaf") {
      statement = "In this input, only leaf nodes should belong to the graph.";
    } else if (problem.id === "battleships-in-a-board" && misconception === "include-water-nodes") {
      statement = "In this input, each water cell should also become a node.";
    } else if (problem.id === "kill-process" && misconception === "include-fake-root") {
      statement = "In this input, a made-up root process should be added as a node.";
    } else if (problem.id === "who-keeps-their-job" && misconception === "omit-leaves") {
      statement = "In this input, employees with no direct reports should be left out.";
    } else if (misconception === "uses-only-invalid-cells") {
      statement = "In this input, only cells that fail the sub-island test should become nodes.";
    } else if (misconception === "hides-restriction-boundaries") {
      statement = "In this input, restricted nodes should be hidden instead of drawn.";
    } else if (misconception === "duplicate-station-by-color") {
      statement = "In this input, each station should get a separate node for each track color.";
    } else if (misconception === "duplicate-adjacency-nodes") {
      statement = "In this input, each repeated adjacency reference should create another copy of that node.";
    } else if (misconception === "product-as-node") {
      statement = "In this input, the final weighted sum should become its own node.";
    } else if (misconception === "reports-as-weights") {
      statement = "In this input, direct reports should become edge weights instead of employee nodes.";
    } else if (misconception === "omit-linear-camps") {
      statement = "A camp with one incoming and one outgoing trail can be left out of the graph.";
    } else if (/^(?:omit|drop|drops|exclude|remove|removes)-/.test(misconception)) {
      let object = words(misconception.replace(/^(?:omit|drop|drops|exclude|remove|removes)-/, ""));
      if (object === "isolated") object = "isolated nodes";
      statement = `In this input, ${object} should be left out.`;
    } else if (/^only-/.test(misconception)) {
      statement = `In this input, only ${words(misconception.replace(/^only-/, ""))} should become nodes.`;
    } else if (/^(?:include|includes)-/.test(misconception)) {
      statement = `In this input, ${words(misconception.replace(/^(?:include|includes)-/, ""))} should be added as nodes.`;
    } else if (/does-not-count-arrays/.test(misconception)) {
      statement = "In this input, array containers should be left out.";
    } else if (/does-not-count-values/.test(misconception)) {
      statement = "In this input, plain values should be left out.";
    } else if (/counts-duplicates/.test(misconception)) {
      statement = "In this input, equal-looking values should be merged into one node.";
    } else if (/counts-only-leaves/.test(misconception)) {
      statement = "In this input, only leaf nodes should belong to the graph.";
    } else if (/forget-prefix/.test(misconception)) {
      statement = "In this input, partial prefixes should be left out of the state graph.";
    } else if (/filter|pre-filter/.test(misconception)) {
      statement = "In this input, only objects that pass the final test should become nodes.";
    } else if (/focuses-only-on-blockers/.test(misconception)) {
      statement = "In this input, only blocked objects should become nodes.";
    } else if (/split-bomb-coordinates/.test(misconception)) {
      statement = "In this input, each number inside a bomb coordinate should become its own node.";
    } else if (/fake-root|fake-parent/.test(misconception)) {
      statement = "In this input, a made-up root node should be added.";
    } else if (/wall|water|zero-passable|empty-passable/.test(misconception)) {
      const object = /wall/.test(misconception) ? "wall square" : /water/.test(misconception) ? "water square" : "blocked square";
      statement = `In this input, each ${object} should become a graph node.`;
    } else if (/bounding-box/.test(misconception)) {
      statement = "In this input, every position inside a group's bounding box should become a node.";
    } else if (/matrix-entr|adjacency-(?:array|list)|rows-as-nodes|range-as-node|scan-starts-as-nodes|traversal-event-as-node/.test(misconception)) {
      const object = /matrix/.test(misconception) ? "matrix entry" : /row/.test(misconception) ? "input row" : /range/.test(misconception) ? "number in the allowed range" : /scan/.test(misconception) ? "search starting point" : /traversal/.test(misconception) ? "search event" : "adjacency-list container";
      statement = `In this input, each ${object} should become a separate node.`;
    } else if (/letter-as-node|key-as-node|key-instance-as-node|digit-only-node|gas-only|capacity-as-state|dial-as-state|time-as-node|weight-as-node|score-as-node|depth-as-node|color-as-node/.test(misconception)) {
      const object = /letter/.test(misconception) ? "letter" : /key/.test(misconception) ? "key" : /digit/.test(misconception) ? "digit" : /gas/.test(misconception) ? "gas amount" : /capacity/.test(misconception) ? "jug capacity" : /dial/.test(misconception) ? "single dial value" : /time/.test(misconception) ? "time value" : /weight/.test(misconception) ? "weight" : /score/.test(misconception) ? "score" : /depth/.test(misconception) ? "depth" : "color";
      statement = `In this input, each ${object} should become a separate node.`;
    } else if (/swap-node-edge|swaps-nodes-and-edges|edge-as-node|pair-as-node|pairs-as-nodes|road-as-node|street-as-node|pipe-as-node|equation-as-node|dislike-pair-as-node|swap-pair-as-node/.test(misconception)) {
      statement = "In this input, each listed relationship should become a node instead of an edge.";
    } else if (/collapse-component|collapses-pair|collapses-components/.test(misconception) && canvas.edges.length) {
      const pair = canvas.edges[0];
      const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
      statement = `In this input, nodes ${labels[String(pair.from)]} and ${labels[String(pair.to)]} should be merged.`;
    } else if (/merge|collapse|deduplic|one-per|groups-as-nodes|components-as-nodes/.test(misconception) && candidate && nextCandidate && candidate !== nextCandidate) {
      statement = `In this input, nodes ${candidate.label} and ${nextCandidate.label} should be merged.`;
    } else if (/duplicate|copies|color-groups/.test(misconception) && candidate) {
      statement = `In this input, node ${candidate.label} should appear more than once.`;
    } else if (/path|route|answer|result|output|preselect|precompute|component|region|cluster|province|island|boat|collection|department|edge-as-node|pair-as-node|road-as-node|street-as-node|pipe-as-node|equation-as-node|product-as-node/.test(misconception)) {
      const object = /path|route/.test(misconception) ? "each possible path" : /component|region|cluster|province|island|boat/.test(misconception) ? "each connected group" : /edge|pair|road|street|pipe|equation/.test(misconception) ? "each listed relationship" : "the final answer";
      statement = `In this input, ${object} should become a separate node.`;
    } else if (/value|depth|level|status|color|time|weight|capacity|score/.test(misconception)) {
      statement = "In this input, each distinct property value should become a separate node.";
    } else {
      statement = `In this input, the ${words(misconception)} rule should decide what becomes a node.`;
    }
    return {
      statement,
      correct: false,
      feedback: `The exact node rule is: ${nodeRule.label}`,
      misconception
    };
  }

  function directVsReachabilityClaim(canvas, edgeRule, edgeTask, seed, forcedCorrect = null) {
    const shortcut = findMissingShortcut(canvas, seed);
    const truthful = forcedCorrect ?? stableChoiceSlot(`${problem.id}:relation:${seed}:direct`, 2) === 0;
    if (shortcut) return truthful ? {
      statement: `${shortcut.from} reaches ${shortcut.to} through ${shortcut.middle}, without a direct ${shortcut.from}${shortcut.arrow}${shortcut.to} edge.`,
      correct: true,
      feedback: `A multi-step route through ${shortcut.middle} creates reachability, not a new direct edge.`
    } : { ...shortcut, correct: false };
    const edge = canvas.edges[seed % Math.max(canvas.edges.length, 1)];
    if (!edge) {
      const [one, two] = canvas.nodes;
      const selfRelation = `${one?.label || "node"}${canvas.directed ? "→" : "—"}${one?.label || "node"}`;
      if (one && !two) return truthful ? {
        statement: `A search starting at ${one.label} includes ${one.label} immediately, but the graph has no direct ${selfRelation} edge.`,
        correct: true,
        feedback: `The starting node is reached before any edge is used. That does not create a self-edge.`
      } : {
        statement: `Because a search starts with ${one.label} already reached, the graph should contain a direct ${selfRelation} edge.`,
        correct: false,
        feedback: `A start node needs no edge to be reached. The input does not define a direct ${selfRelation} self-edge.`
      };
      if (one && two) return truthful ? {
        statement: `There is no direct edge between ${one.label} and ${two.label}; merely naming both nodes does not make them reachable.`,
        correct: true,
        feedback: `Node membership alone creates neither a direct edge nor a route.`
      } : {
        statement: `${one.label} and ${two.label} are separate nodes with no route between them, so the graph should still contain a direct edge between them.`,
        correct: false,
        feedback: `There is no direct relation between ${one.label} and ${two.label}, so no edge belongs between them.`
      };
      return { statement: edgeRule.label, correct: true, feedback: stripVerdictCue(edgeTask.why || edgeRule.feedback) };
    }
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const arrow = canvas.directed ? "→" : "—";
    return truthful ? {
      statement: `${labels[String(edge.from)]} and ${labels[String(edge.to)]} are directly connected, not merely reachable through a longer route.`,
      correct: true,
      feedback: `The mini-example has ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} as one direct edge.`
    } : {
      statement: `${labels[String(edge.from)]} can reach ${labels[String(edge.to)]}, but there is no direct ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} edge.`,
      correct: false,
      feedback: `The mini-example lists ${labels[String(edge.from)]}${arrow}${labels[String(edge.to)]} as one direct edge. A direct edge is different from a longer reachable route.`
    };
  }

  function structureNodeBlocked(node) {
    return Boolean(node?.blocked || (["reachable-nodes-with-restrictions", "flooded-campsite-trails"].includes(problem.id) && ["red", "blue"].includes(node?.color)));
  }

  function findMissingShortcut(canvas, seed = 0) {
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const adjacency = Object.fromEntries(canvas.nodes.map(node => [String(node.id), new Set()]));
    for (const edge of canvas.edges) {
      const from = String(edge.from), to = String(edge.to);
      if (structureNodeBlocked(canvas.nodes.find(node => String(node.id) === from)) || structureNodeBlocked(canvas.nodes.find(node => String(node.id) === to))) continue;
      adjacency[from]?.add(to);
      if (!canvas.directed) adjacency[to]?.add(from);
    }
    const shortcuts = [];
    for (const [from, neighbors] of Object.entries(adjacency)) for (const middle of neighbors) for (const to of adjacency[middle] || []) {
      if (from === to || neighbors.has(to)) continue;
      const arrow = canvas.directed ? "→" : "—";
      shortcuts.push({
        from: labels[from], middle: labels[middle], to: labels[to], arrow,
        statement: `${labels[from]} reaches ${labels[to]} through ${labels[middle]}, so add a direct ${labels[from]}${arrow}${labels[to]} edge.`,
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

  function degreeClaim(canvas, seed, forcedCorrect = null) {
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
    const correct = forcedCorrect ?? stableChoiceSlot(`${problem.id}:degree:${seed}:degree-fact`, 2) === 0;
    const target = correct ? chosen.count : chosen.count > 0 && seed % 2 ? chosen.count - 1 : chosen.count + 1;
    const noun = problem.id === "flooded-campsite-trails"
      ? `physical trail neighbor${target === 1 ? "" : "s"}`
      : canvas.directed
      ? `outgoing direct edge${target === 1 ? "" : "s"}`
      : `direct neighbor${target === 1 ? "" : "s"}`;
    return {
      statement: `${chosen.label} has exactly ${target} ${noun}.`,
      correct,
      feedback: `${chosen.label} has ${chosen.count} ${problem.id === "flooded-campsite-trails" ? `physical trail neighbor${chosen.count === 1 ? "" : "s"}; flooding blocks travel but does not erase the drawn trail` : canvas.directed ? `outgoing direct edge${chosen.count === 1 ? "" : "s"}` : `direct neighbor${chosen.count === 1 ? "" : "s"}`}.`
    };
  }

  function edgeMetadataClaim(canvas, seed, forcedCorrect = null) {
    const candidates = canvas.edges.filter(edge => edge.color || edge.label);
    if (!candidates.length) return null;
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const edge = candidates[seed % candidates.length];
    const arrow = canvas.directed ? "→" : "—";
    const correct = forcedCorrect ?? seed % 2 === 0;
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

  function directionClaim(canvas, seed, forcedCorrect = null) {
    const correct = forcedCorrect ?? seed % 2 === 0;
    const edge = canvas.edges[seed % Math.max(canvas.edges.length, 1)];
    if (!edge) return {
      statement: `This input creates a ${correct === canvas.directed ? "directed" : "two-way"} graph.`,
      correct,
      feedback: `The graph is ${canvas.directed ? "directed" : "two-way"}, even though this example has no edges.`
    };
    const labels = Object.fromEntries(canvas.nodes.map(node => [String(node.id), String(node.label)]));
    const from = labels[String(edge.from)], to = labels[String(edge.to)];
    if (!canvas.directed) return {
      statement: correct
        ? `The direct ${from}—${to} connection works both ways.`
        : `The direct ${from}—${to} connection works only from ${from} to ${to}.`,
      correct,
      feedback: `This graph is undirected, so ${from}—${to} works both ways.`
    };
    const reverseExists = canvas.edges.some(candidate => String(candidate.from) === String(edge.to) && String(candidate.to) === String(edge.from));
    return {
      statement: correct
        ? `The input creates the arrow ${from}→${to}.`
        : reverseExists
          ? `The arrows ${from}→${to} and ${to}→${from} can be replaced by one undirected edge without changing the exact graph.`
          : `The input creates the reverse arrow ${to}→${from}.`,
      correct,
      feedback: `The input creates ${from}→${to}. Direction matters.`
    };
  }

  function structureBoundaryClaim(task, seed, correct) {
    const canvas = task.canvas;
    if (problem.id === "runes-on-the-castle-door") {
      const match = task.input.match(/dials\s*=\s*(\[[^\]]*\])/);
      const dials = match ? JSON.parse(match[1]) : [];
      const outgoing = new Set(canvas.edges.map(edge => String(edge.from)));
      const prefix = canvas.nodes.find(node => !outgoing.has(String(node.id)) && !["start", "empty prefix", "ε"].includes(node.label) && node.label.length < dials.length);
      if (prefix) return {
        statement: `The dead-end prefix ${prefix.label} ${correct ? "is still incomplete" : "is a complete code"}.`, correct,
        feedback: `${prefix.label} has ${prefix.label.length} letters, but there are ${dials.length} dials. Reaching a dead end does not fill the remaining dials.`
      };
    }
    if (problem.id === "counting-docked-boats") {
      const match = task.input.match(/marina\s*=\s*(\[[^\]]*\])/);
      const rows = match ? JSON.parse(match[1]) : [];
      if (rows.length) {
        const onBorder = node => { const [r, c] = String(node.label).match(/\d+/g).map(Number); return r === 0 || c === 0 || r === rows.length - 1 || c === rows[0].length - 1; };
        const neighbors = new Map(canvas.nodes.map(node => [String(node.id), []]));
        for (const edge of canvas.edges) { neighbors.get(String(edge.from)).push(String(edge.to)); neighbors.get(String(edge.to)).push(String(edge.from)); }
        const groups = [], seen = new Set();
        for (const node of canvas.nodes) if (!seen.has(String(node.id))) {
          const queue = [String(node.id)]; seen.add(String(node.id));
          for (const id of queue) for (const next of neighbors.get(id)) if (!seen.has(next)) { seen.add(next); queue.push(next); }
          groups.push(queue.map(id => canvas.nodes.find(node => String(node.id) === id)));
        }
        const group = groups.find(group => !group.some(onBorder)) || groups[0];
        if (group) {
          const docked = group.some(onBorder), claimDocked = correct ? docked : !docked;
          return { statement: `The boat containing ${group[0].label} ${claimDocked ? "can" : "cannot"} reach a border cell through its own boat cells.`, correct,
            feedback: docked ? "This connected boat touches the marina border, so it is docked." : "Every cell in this boat stays inside the marina border. It is one boat, but it is not docked." };
        }
      }
    }
    return reachableCountClaim(canvas, seed, correct);
  }

  function reachableCountClaim(canvas, seed, correct) {
    if (!canvas.nodes.length) return {
      statement: `A search in this graph reaches exactly ${correct ? 0 : 1} nodes.`,
      correct,
      feedback: "The input creates an empty graph, so a search reaches 0 nodes."
    };
    const adjacency = Object.fromEntries(canvas.nodes.map(node => [String(node.id), new Set()]));
    const blocked = new Set(canvas.nodes.filter(structureNodeBlocked).map(node => String(node.id)));
    for (const edge of canvas.edges) {
      const from = String(edge.from), to = String(edge.to);
      if (blocked.has(from) || blocked.has(to)) continue;
      adjacency[from]?.add(to);
      if (!canvas.directed) adjacency[to]?.add(from);
    }
    const reachable = start => {
      if (blocked.has(start)) return 0;
      const seen = new Set([start]), queue = [start];
      while (queue.length) for (const next of adjacency[queue.shift()] || []) if (!seen.has(next)) { seen.add(next); queue.push(next); }
      return seen.size;
    };
    const choices = canvas.nodes.map(node => ({ label: String(node.label), count: reachable(String(node.id)) }));
    choices.sort((one, two) => two.count - one.count || one.label.localeCompare(two.label, undefined, { numeric: true }));
    const chosen = choices[seed % Math.min(choices.length, 3)];
    const claimed = correct ? chosen.count : chosen.count === canvas.nodes.length ? Math.max(0, chosen.count - 1) : chosen.count + 1;
    return {
      statement: `Starting at ${chosen.label}, ${blocked.size ? "a search that cannot enter blocked nodes" : "a graph search"} reaches exactly ${claimed} node${claimed === 1 ? "" : "s"}.`,
      correct,
      feedback: `${blocked.size ? "Skip blocked nodes, including a blocked start." : "Include the start."} Follow the direct edges in their allowed direction. The search reaches ${chosen.count} node${chosen.count === 1 ? "" : "s"}.`
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
    window.DFS_GRAPH?.setContext(`${problem.id}:structure-transfer:${roundIndex}`, 0);
    if (structureRetryDrawing) {
      window.DFS_GRAPH?.setSnapshot(structureRetryDrawing);
      structureRetryDrawing = null;
    }
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
        ${compact ? '<div class="challenge-actions"><button id="structure-check" class="primary-btn" disabled>Check graph + answer <span>→</span></button></div>' : '<div class="challenge-actions"><span class="microcopy">Answer the claim, then build the graph below.</span><a class="ghost-btn link-button" href="#graph-lab">Go to graph ↓</a></div>'}
      </div>`;
    const graphActions = $("#graph-lab-actions");
    graphActions.hidden = compact;
    graphActions.innerHTML = compact ? "" : `<span class="microcopy">When the answer and graph are ready:</span><button id="structure-check" class="primary-btn" disabled>Check answer + graph <span>→</span></button>`;
    if (compact) {
      $("#graph-lab-title").textContent = "1 · Draw the graph";
      const workspace = document.createElement("div");
      workspace.className = "structure-workspace";
      ($(".node-label-guide") || $(".structure-mini-example")).after(workspace);
      workspace.append($("#graph-lab"), $(".structure-claim-list"));
      counterGraphChangeHandler = () => {
        const started = task.canvas.nodes.length === 0 || Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-claim-index]').forEach(button => { if (answers[Number(button.dataset.claimIndex)] === null) button.disabled = !started; });
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
      counterGraphChangeHandler();
    }
    const update = () => { $("#structure-check").disabled = answers.some(answer => answer === null); };
    $$('[data-claim-index]').forEach(button => { button.onclick = () => {
      const index = Number(button.dataset.claimIndex);
      answers[index] = button.dataset.claimValue === "true";
      $$(`[data-claim-index="${index}"]`).forEach(item => { const chosen = item === button; item.classList.toggle("selected", chosen); item.setAttribute("aria-pressed", String(chosen)); });
      update();
    }; });
    $("#structure-check").onclick = () => checkStructureClaims(namedClaims, answers, task, roundIndex, total);
    restoreFormDraft(`structure:${roundIndex}`);
    focusPrompt();
    $(".test-pane").scrollTop = 0;
  }

  function structureFrame() {
    return [
      { label: "MODEL COURT", heading: "Judge this graph claim.", role: "CLAIM" },
      { label: "PEER REVIEW", heading: "Check this note against the exact graph.", role: "REVIEW" },
      { label: "GRAPH FACT-CHECK", heading: "Decide which statements survive the picture.", role: "NOTE" },
      { label: "WHITEBOARD CHECK", heading: "Test one important graph idea.", role: "IDEA" }
    ][problemIndex % 4];
  }

  function checkStructureClaims(claims, answers, task, roundIndex, total) {
    clearAiHelp();
    if (answered || answers.some(answer => answer === null)) return;
    const missed = claims.map((claim, index) => ({ ...claim, index })).filter(claim => answers[claim.index] !== claim.correct);
    const graph = gradeCanvas(task.canvas, window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false });
    const graphChecks = [
      ["Every exact node is drawn", graph.nodes],
      [graph.nodes ? "Every exact direct edge is drawn" : "Check node names before the direct edges", graph.nodes ? graph.edges : null],
      ["Edge direction matches", graph.direction],
      ["Graph colors match the input", graph.colors],
      ["Edge labels or weights match the input", graph.labels]
    ].filter(([label]) => !label.startsWith("Graph colors") || task.canvas.edges.some(edge => edge.color) || task.canvas.nodes.some(node => node.color || node.blocked))
      .filter(([label]) => !label.startsWith("Edge labels") || task.canvas.edges.some(edge => edge.label));
    const graphPassed = graphChecks.every(([, pass]) => pass);
    if (missed.length) {
      structureProgress.mistakes++;
      saveStructureProgress();
      updateStructureProgress(structureProgress.index, structureTasks());
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>Review ${missed.length === 1 ? "this claim" : "these claims"}, then try again.</b><ul class="feedback-checklist">${missed.map(claim => `<li class="failed"><span>×</span>${formatText(stripVerdictCue(claim.feedback))}</li>`).join("")}</ul></div>`;
      offerAiHelp({ task, claims, answers, studentGraph: window.DFS_GRAPH?.getSnapshot(), graphChecks });
      $$('[data-claim-index]').forEach(item => { item.disabled = true; });
      const button = $("#structure-check");
      button.disabled = false;
      button.innerHTML = "Try this check again <span>→</span>";
      button.onclick = () => {
        structureRetryDrawing = window.DFS_GRAPH?.getSnapshot() || null;
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
      $("#feedback-slot").innerHTML = `<div class="feedback"><b>Your answer is right. Fix the graph below.</b><ul class="feedback-checklist">${graphChecks.map(([label, pass]) => `<li class="${pass == null ? "waiting" : pass ? "passed" : "failed"}"><span>${pass == null ? "•" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${graph.hint ? `<p class="feedback-next">${esc(graph.hint)}</p>` : ""}</div>`;
      offerAiHelp({ task, claims, answers, studentGraph: window.DFS_GRAPH?.getSnapshot(), graphChecks });
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    answered = true;
    $("#next-question-btn").hidden = true;
    lockCounterexampleEditor();
    $$('[data-claim-index]').forEach(item => { item.disabled = true; });
    $("#feedback-slot").innerHTML = `<div class="feedback good court-ruling"><b>Answer and graph are correct.</b><div class="feedback-why">Your nodes, direct edges, direction, and edge details all match the mini-example.</div></div>`;
    const button = $("#structure-check");
    button.disabled = false;
    button.innerHTML = roundIndex + 1 === total ? "Finish Step 3 <span>→</span>" : "Next question <span>→</span>";
    updateStructureProgress(structureProgress.index + 1, structureTasks());
    persistProgress(structureStorageKey(), { ...structureProgress, index: structureProgress.index + 1 });
    pendingAdvance = () => { pendingAdvance = null; structureProgress.index++; saveStructureProgress(); };
    button.onclick = () => { pendingAdvance?.(); render(); };
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
    $("#challenge").innerHTML = `<div class="challenge-body victory structure-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Defined"}</div><h3>${skipped ? "Step 3 finished." : "Step 3 complete."}</h3><p>${skipped ? `${passed} passed · ${skipped} skipped.` : `You built ${total} different graphs and answered ${total} useful questions.`}</p><div class="completion-actions"><button id="start-reasoning" class="primary-btn">Start Step 4 <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-structure" class="ghost-btn">Practice Step 3 again</button></div></div>`;
    $("#start-reasoning").onclick = () => switchSection(4);
    $("#restart-structure").onclick = resetStructure;
  }

  function hasStep5() { return problem.category === "variant" && Boolean(problem.debuggingLesson?.cases?.length); }
  function hasStep6() { return problem.category === "variant" && Boolean(problem.codingLesson); }
  function availableSections() { if (problem.category === "variant") return variantPractice.sections; return hasStep6() ? [1, 2, 3, 4, 5, 6] : hasStep5() ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]; }
  function sectionLabel(number) {
    return problem.category === "variant" ? availableSections().indexOf(number) + 1 : number;
  }
  function adjacentSection() {
    const sections = availableSections();
    const index = sections.indexOf(section);
    return sections[index + 1] ?? sections[index - 1];
  }
  function debuggingRounds() { return hasStep5() ? problem.debuggingLesson.cases : []; }
  function debuggingStorageKey() { return `dfs-debugging:${problem.id}:v1`; }
  function loadDebuggingProgress() {
    const total = debuggingRounds().length;
    try {
      const value = JSON.parse(localStorage.getItem(debuggingStorageKey()) || "{}");
      const index = Math.min(Math.max(Math.floor(Number(value.index) || 0), 0), total);
      return { index, skipped: [...new Set((Array.isArray(value.skipped) ? value.skipped : []).filter(n => Number.isInteger(n) && n >= 0 && n < index))] };
    } catch { return { index: 0, skipped: [] }; }
  }
  function saveDebuggingProgress() { persistProgress(debuggingStorageKey(), debuggingProgress); }
  function resetDebugging() {
    if (debuggingProgress.index > 0 && !confirm("Restart Step 5 and clear its answers?")) return;
    clearSectionDrafts(5);
    debuggingProgress = { index: 0, skipped: [] };
    saveDebuggingProgress();
    render();
  }
  // Read values, not programs. Lists may omit their outer brackets; grids may
  // use one comma-separated row per line. Text cells do not need quotes.
  function parseLessonValue(raw, label, sample) {
    const text = String(raw).trim();
    if (!text) throw new Error(`Enter ${label}.`);
    if (text.length > 100000) throw new Error(`Please use a smaller ${label}.`);
    const leaves = value => Array.isArray(value) ? value.flatMap(leaves) : [value];
    const textValues = sample !== undefined && leaves(sample).some(value => typeof value === 'string');
    const read = (source, depth = 0) => {
      if (depth > 60) throw new Error();
      source = source.trim();
      if (source[0] === '[') {
        if (!source.endsWith(']')) throw new Error();
        const body = source.slice(1, -1), parts = [];
        let start = 0, level = 0, quote = '', escaped = false;
        for (let i = 0; i < body.length; i++) {
          const c = body[i];
          if (quote) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === quote) quote = ''; continue; }
          if (c === '"' || c === "'") { quote = c; continue; }
          if (c === '[') level++;
          if (c === ']') { level--; if (level < 0) throw new Error(); }
          if ((c === ',' || c === ';' || c === '\n') && level === 0) {
            const part = body.slice(start, i).trim();
            if (part) parts.push(read(part, depth + 1));
            else if (c === ',') throw new Error();
            start = i + 1;
          }
        }
        if (level || quote) throw new Error();
        const last = body.slice(start).trim();
        if (last) parts.push(read(last, depth + 1));
        return parts;
      }
      if (/^["']/.test(source)) {
        const node = window.acorn.parseExpressionAt(source, 0, {ecmaVersion: 2024});
        if (node.end !== source.length || node.type !== 'Literal' || typeof node.value !== 'string') throw new Error();
        return node.value;
      }
      if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(source)) {
        const value = Number(source); if (!Number.isFinite(value)) throw new Error();
        return textValues ? source : value;
      }
      if (/^(true|false)$/i.test(source)) return textValues ? source : source.toLowerCase() === 'true';
      if (source === 'null') return null;
      if (textValues && /^[\w. -]+$/.test(source)) return source;
      throw new Error();
    };
    try {
      let value;
      try { value = read(text); } catch (error) { if (!Array.isArray(sample)) throw error; }
      if (Array.isArray(sample) && !Array.isArray(value)) {
        const rows = text.split(/\r?\n/).map(row => row.trim()).filter(Boolean);
        const grid = Array.isArray(sample[0]);
        value = read('[' + (grid ? rows.map(row => row.startsWith('[') ? row : '[' + row + ']').join(',') : rows.join(',')) + ']');
      }
      return value;
    } catch { throw new Error(`Check the format of ${label}. Follow the example in that field.`); }
  }

  function inputSample(name) { return JSON.parse(debuggingInputExample(name === 'scores' ? 'trust' : name)); }
  function inputPlaceholder(name) {
    const value = inputSample(name);
    const plain = item => typeof item === 'string' ? item : Array.isArray(item) ? '[' + item.map(plain).join(', ') + ']' : String(item);
    if (['sky','park','marina','yard','cave','worked','trust','scores'].includes(name)) return value.map(row => row.map(String).join(', ')).join('\n');
    return Array.isArray(value) && !value.some(Array.isArray) ? value.map(String).join(', ') : plain(value);
  }
  function outputSample() { return problem.debuggingLesson.tests[0].expected; }
  function outputPlaceholder() {
    return debuggingOutputExample().replace(/"/g, '');
  }
  function counterMarkerExample(marker) {
    const node = problem.counterexampleLesson?.nodeLabels?.rule === 'coordinate' ? '(0,0)' : problem.counterexampleLesson?.nodeLabels?.rule === 'nested-path' ? 'root[0]' : problem.counterexampleLesson?.nodeLabels?.rule === 'positive-integer' ? '2' : '0';
    const value = marker.choices?.[0]?.value || '5';
    return `${node}${marker.target === 'edge' ? '->1' : ''}=${value}`;
  }

  function debuggingInputExample(name) {
    const examples = {
      sky: '[[0, 1], [0, 0]]', park: '[[0, 1], [0, 0]]', marina: '[[".", "B"], [".", "."]]', yard: '[[".", "T"], [".", "."]]',
      cave: '[["U", "G"], ["U", "U"]]', worked: '[[1, 0], [0, 1]]', trust: '[[10, 4], [4, 10]]',
      items: '[6, [2, 9]]', playlist: '[6, [2, 9]]', vaults: '[[1], []]', rooms: '[[1], []]', graph: '[[1], []]',
      friendships: '[[0, 1], [1, 2]]', trails: '[[0, 1], [1, 2]]', tracks: '[[0, 1], [1, 2]]', paths: '[[0, 1], [1, 2]]', wires: '[[0, 1], [1, 2]]', roads: '[[0, 1, 6], [1, 2, 4]]',
      colors: '["red", "blue"]', dials: '["xy", "mn"]', ids: '[2, 5, 9]', bosses: '[0, 2, 5]', feeds: '[0, 2, 5]', caller: '[-1, 0, 1]',
      liters: '[6, 8, 3]', gold: '[6, 8]', waitDays: '[2, 4, 0]', wells: '[0, 2]', flooded: '[1]', startKeys: '[0, 2]'
    };
    return examples[name] || (['row', 'col', 'start', 'source', 'headId', 'hq'].includes(name) ? '0' : '3');
  }

  function debuggingOutputExample() {
    const sample = problem.debuggingLesson.tests[0].expected;
    if (typeof sample === 'boolean') return 'true or false';
    if (typeof sample === 'number') return '42';
    if (Array.isArray(sample)) {
      if (problem.id === 'gas-pocket-survey') return '[["U", "2"], ["G", "1"]]';
      if (problem.id === 'routes-past-the-coffee-cart') return '[[0, 3, 5], [0, 2, 5]]';
      if (problem.id === 'runes-on-the-castle-door') return '["xm", "yn"]';
      return '[5, 9]';
    }
    return '"text"';
  }

  function renderDebuggingRound() {
    const rounds = debuggingRounds();
    const done = Math.min(debuggingProgress.index, rounds.length);
    const passed = done - debuggingProgress.skipped.length;
    $("#graph-lab").hidden = true;
    $("#evidence-label").textContent = `${passed} of ${rounds.length} repairs passed`;
    $("#attempt-label").textContent = "";
    $("#evidence-fill").style.width = `${100 * passed / Math.max(rounds.length, 1)}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(rounds.length));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    $("#facet-list").innerHTML = "";
    if (done >= rounds.length) {
      const skipped = debuggingProgress.skipped.length;
      $("#challenge").innerHTML = `<div class="challenge-body victory"><div class="stamp">${skipped ? "Finished" : "Repaired"}</div><h3>${skipped ? "Step 5 finished." : "Step 5 complete."}</h3><p>${passed} repairs passed${skipped ? ` · ${skipped} skipped` : ""}.</p><div class="completion-actions">${hasStep6() ? `<button id="start-coding" class="primary-btn">Start Step ${sectionLabel(6)} →</button>` : ""}<a class="ghost-btn link-button" href="/">Choose another problem →</a><button id="restart-debugging" class="ghost-btn">Practice Step 5 again</button></div></div>`;
      if ($("#start-coding")) $("#start-coding").onclick = () => switchSection(6);
      $("#restart-debugging").onclick = resetDebugging;
      return;
    }
    const round = rounds[done];
    const parameters = problem.codingLesson.parameters;
    const outputExample = outputPlaceholder();
    const frozen = round.lines.map(line => line.options.find(option => option.id === line.selected)?.text || "");
    $("#challenge").innerHTML = `<div class="challenge-body debugging-case">
      <span class="probe-type">CHALLENGE ${done + 1} OF ${rounds.length}</span>
      <h3>Break it. Then fix it.</h3>
      <p>This solution has one mistake. Find an input that proves it, then explain how to fix it.</p>
      <section class="code-window" aria-label="Frozen incorrect pseudocode"><div class="code-window-label">Incorrect pseudocode · stays unchanged</div><pre tabindex="0"><code>${renderCodeLines(frozen)}</code></pre></section>
      <h4>1 · Build an input where this code gives the wrong answer</h4>
      <p class="coding-hint">Enter each value separately. Lists use commas; grids can use one row per line. Text does not need quotes. Placeholders show the format only.</p>
      <div class="coding-inputs">${parameters.map((parameter, i) => `<label class="counter-field"><span>${esc(parameter.name)}</span><textarea id="debugging-input-${i}" rows="3" spellcheck="false" autocomplete="off" placeholder="${esc(inputPlaceholder(parameter.name))}" aria-describedby="debugging-parameter-help-${i}"></textarea><small id="debugging-parameter-help-${i}">${esc((parameter.description || parameter.help || '').replace(/JSON /gi, ''))}</small></label>`).join("")}</div>
      <details class="debugging-input-guide"><summary>Input rules</summary><div>${formatText(problem.debuggingLesson.inputHelp)}</div></details>
      <div class="debugging-outputs">
        <label class="counter-field"><span>2 · What should the correct solution return?</span><textarea id="debugging-correct-output" placeholder="${esc(outputExample)}" rows="2" autocomplete="off" spellcheck="false" aria-describedby="debugging-output-help"></textarea></label>
        <label class="counter-field"><span>3 · What does the incorrect code above return?</span><textarea id="debugging-buggy-output" placeholder="${esc(outputExample)}" rows="2" autocomplete="off" spellcheck="false" aria-describedby="debugging-output-help"></textarea></label>
      </div>
      <p id="debugging-output-help" class="counter-output-help">Write the exact returned value, using the format shown. Keep list order when the problem asks for an order.</p>
      <section class="debugging-repair" aria-labelledby="debugging-repair-title"><h4 id="debugging-repair-title">4 · Explain the mistake and how to fix it</h4><label class="counter-field"><span>What is wrong with the pseudocode above? How would you fix it?</span><textarea id="debugging-explanation" rows="6" maxlength="6000" placeholder="Explain in your own words." aria-describedby="debugging-explanation-help"></textarea></label><p id="debugging-explanation-help" class="coding-hint">Luna checks your explanation. You do not need to write code.</p></section>
      <div id="feedback-slot" role="status" aria-live="polite"></div>
      <div class="challenge-actions"><button id="debugging-check" class="primary-btn">Check input + repair <span>→</span></button></div>
    </div>`;
    restoreFormDraft(round.id);
    const button = $("#debugging-check");
    let passedThisAttempt = false;
    const clearResult = () => {
      debuggingRequest?.abort(); debuggingRequest = null;
      if (passedThisAttempt) {
        passedThisAttempt = false;
        pendingAdvance = null;
        saveDebuggingProgress();
      }
      $("#feedback-slot").innerHTML = "";
      button.disabled = false;
      button.innerHTML = "Check input + explanation <span>→</span>";
      saveFormDraft();
    };
    $("#challenge").oninput = clearResult;
    $("#challenge").onchange = clearResult;
    button.innerHTML = "Check input + explanation <span>→</span>";
    button.onclick = async () => {
      if (passedThisAttempt) { pendingAdvance?.(); render(); return; }
      saveFormDraft();
      const slot = $("#feedback-slot");
      slot.className = "debugging-feedback needs-work";
      slot.textContent = "";
      let attempt;
      try {
        attempt = {
          problemId: problem.id, caseId: round.id,
          input: Object.fromEntries(parameters.map((parameter, i) => [parameter.name, parseLessonValue($(`#debugging-input-${i}`).value, parameter.name, inputSample(parameter.name))])),
          correctOutput: parseLessonValue($("#debugging-correct-output").value, "the correct solution’s output", outputSample()),
          buggyOutput: parseLessonValue($("#debugging-buggy-output").value, "the incorrect code’s output", outputSample()),
          studentAnswer: $("#debugging-explanation").value.trim()
        };
        const result = window.DFS_STEP5.gradeEvidence(problem.id, round.id, attempt.input, attempt.correctOutput, attempt.buggyOutput);
        if (!result.ok) { slot.textContent = result.feedback; return; }
        if (!attempt.studentAnswer) { slot.textContent = "Explain the mistake and how you would fix it."; return; }
      } catch (error) { slot.textContent = error.message; return; }
      const controller = new AbortController();
      debuggingRequest = controller;
      const timeout = setTimeout(() => controller.abort(), 45000);
      button.disabled = true;
      button.textContent = "Luna is checking…";
      slot.textContent = "Your input and outputs are right. Checking your explanation…";
      try {
        const response = await fetch("/api/grade-debugging", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(attempt), signal: controller.signal });
        let result;
        try { result = await response.json(); }
        catch { throw new Error(response.status === 429 ? "Too many checks at once. Your answer is saved; try again in a minute." : "Luna could not check this time. Your answer is saved; please try again."); }
        if (debuggingRequest !== controller || !slot.isConnected) return;
        if (!response.ok || typeof result.correct !== "boolean") throw new Error(result.error || "Luna could not check this time. Please try again.");
        slot.className = `debugging-feedback ${result.correct ? "is-correct" : "needs-work"}`;
        slot.textContent = result.feedback;
        if (!result.correct) {
          const reveal = document.createElement("button");
          reveal.type = "button"; reveal.className = "ghost-btn"; reveal.id = "debugging-reveal";
          reveal.textContent = "Read the correct answer";
          reveal.onclick = () => { const answer = document.createElement("pre"); answer.className = "debugging-saved-answer"; answer.textContent = result.correctAnswer; reveal.replaceWith(answer); };
          slot.append(document.createElement("br"), reveal);
          return;
        }
        passedThisAttempt = true;
        persistProgress(debuggingStorageKey(), { ...debuggingProgress, index: done + 1 });
        pendingAdvance = () => { pendingAdvance = null; debuggingProgress.index = done + 1; saveDebuggingProgress(); };
        button.innerHTML = done + 1 < rounds.length ? "Next challenge <span>→</span>" : "Finish Step 5 <span>→</span>";
      } catch (error) {
        if (debuggingRequest === controller && slot.isConnected) slot.textContent = error.name === "AbortError" ? "Luna took too long. Your answer is saved; please try again." : error instanceof TypeError ? "Could not reach Luna. Your answer is saved; check your connection and try again." : error.message;
      } finally {
        clearTimeout(timeout);
        if (debuggingRequest === controller) { debuggingRequest = null; button.disabled = false; if (!passedThisAttempt) button.innerHTML = "Check input + explanation <span>→</span>"; }
      }
    };
    $(".test-pane").scrollTop = 0;
    focusPrompt();
  }

  function highlightEditorJavaScript(code) {
    const tokens = [];
    try {
      const lexer = window.acorn.tokenizer(code, {ecmaVersion: 2024, onComment: (_block, _text, start, end) => tokens.push({start, end, kind: 'comment'})});
      for (;;) {
        const token = lexer.getToken();
        if (token.type.label === 'eof') break;
        const label = token.type.label;
        const kind = token.type.keyword ? 'keyword' : ['string', 'template', '`', 'regexp'].includes(label) ? 'string' : ['num', 'bigint'].includes(label) ? 'number' : label === 'name' ? 'name' : 'operator';
        tokens.push({start: token.start, end: token.end, kind});
      }
    } catch { /* An unfinished line stays editable while its earlier tokens stay colored. */ }
    let cursor = 0, html = '';
    for (const token of tokens.sort((a, b) => a.start - b.start)) {
      html += esc(code.slice(cursor, token.start)) + `<span class="syntax-${token.kind}">${esc(code.slice(token.start, token.end))}</span>`;
      cursor = token.end;
    }
    return html + esc(code.slice(cursor)) + '\n';
  }

  function codingStorageKey() { return `dfs-coding:${problem.id}:v1`; }
  function stopCodingRun() {
    codingRunVersion++;
    codingRunner?.cancel();
  }
  function codingInputs() { return problem.codingLesson.parameters.map((parameter, i) => ({ name: parameter.name, raw: $(`#coding-input-${i}`)?.value || "" })); }
  function refreshCodingHelp() {
    if (section !== 6 || !$("#coding-editor")) return;
    offerAiHelp(() => ({ kind: "code", functionName: problem.codingLesson.functionName, parameters: problem.codingLesson.parameters, correctCode: problem.codingLesson.correctCode, studentCode: $("#coding-editor").value, inputs: codingInputs(), ...(codingResult || {}) }));
  }
  function codingValue(value) {
    if (value === undefined) return "undefined (nothing was returned)";
    try { return JSON.stringify(value, null, 2) ?? String(value); } catch { return String(value); }
  }
  function codingError(error) {
    return `${error?.name || "Error"}${error?.line ? ` · line ${error.line}${error.column ? `, column ${error.column}` : ""}` : ""}: ${error?.message || "The code could not run."}`;
  }
  function codingOutput(result) {
    return `${result.ok ? `<strong>Returned</strong><pre>${esc(result.display ?? codingValue(result.value))}</pre>` : `<pre class="coding-error">${esc(codingError(result.error))}</pre>`}${result.logs?.length ? `<strong>Console</strong><pre>${esc(result.logs.map(log => typeof log === "string" ? log : codingValue(log)).join("\n"))}</pre>` : ""}`;
  }
  function updateCodingProgress(passed, total) {
    $("#evidence-label").textContent = `${passed} of ${total} tests passed`;
    $("#evidence-fill").style.width = `${100 * passed / total}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
  }
  function resetCoding() {
    if (!confirm(`Clear your Step ${sectionLabel(6)} code and inputs?`)) return;
    stopCodingRun();
    try { localStorage.removeItem(codingStorageKey()); localStorage.removeItem(`dfs-form:v1:${problem.id}:6:solution:`); } catch {}
    render();
  }
  function renderCodingLesson() {
    const lesson = problem.codingLesson;
    codingResult = null;
    $("#graph-lab").hidden = true;
    $("#attempt-label").textContent = "";
    $("#facet-list").innerHTML = "";
    $('.tab[data-tab="examples"]').hidden = false;
    updateCodingProgress(0, lesson.tests.length);
    $("#challenge").innerHTML = `<div class="challenge-body coding-case">
      <h3>Write your solution.</h3><p>Write JavaScript, try your own input, then submit against ${lesson.tests.length} fresh tests.</p>
      <details id="coding-graph-disclosure" class="coding-graph-disclosure">
        <summary><span>Optional: draw the graph</span><small>Open a scratchpad</small></summary>
        <div class="coding-graph-disclosure-body"><p class="coding-hint">Sketch the problem graph here if a picture helps. This drawing is private and is not graded.</p><div id="coding-graph-slot"></div></div>
      </details>
      <label for="coding-editor" class="coding-editor-label">Your JavaScript</label>
      <p id="coding-editor-help" class="coding-hint">Keep the function name <code>${esc(lesson.functionName)}</code> and return your answer. Use <code>console.log</code> to inspect values. Tab indents; Shift+Tab unindents. Escape then Tab leaves the editor.</p>
      <div class="coding-editor-wrap"><pre id="coding-line-numbers" aria-hidden="true"></pre><div class="coding-editor-area"><pre id="coding-highlight" aria-hidden="true"></pre><textarea id="coding-editor" placeholder="${esc(lesson.starterCode)}" aria-describedby="coding-editor-help" rows="18" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(lesson.starterCode)}</textarea></div></div>
      <p id="coding-save-warning" class="coding-error" role="status" hidden></p>
      <h4>Try your own input</h4><p class="coding-hint">Enter one value per field. For a grid, put one row on each line. Lists use commas; text does not need quotes. “Run my input” shows what your code returns.</p>
      <div class="coding-inputs">${lesson.parameters.map((parameter, i) => `<label class="counter-field" for="coding-input-${i}"><span>${esc(parameter.name)}${parameter.label && parameter.label !== parameter.name ? ` · ${esc(parameter.label)}` : ""}</span><textarea id="coding-input-${i}" placeholder="${esc(parameter.placeholder || inputPlaceholder(parameter.name))}" rows="3" wrap="soft" spellcheck="false" aria-describedby="coding-input-help-${i}"></textarea><small id="coding-input-help-${i}">${esc(parameter.help || "Follow the format shown in this field.")}</small></label>`).join("")}</div>
      <div class="challenge-actions coding-actions"><button id="coding-run" class="ghost-btn">Run my input</button><button id="coding-submit" class="primary-btn">Submit ${lesson.tests.length} tests</button><button id="coding-stop" class="ghost-btn" hidden>Stop</button></div>
      <div id="coding-results" role="status" aria-live="polite"></div><div id="feedback-slot" role="status" aria-live="polite"></div>
    </div>`;
    const graphDisclosure = $("#coding-graph-disclosure");
    $("#coding-graph-slot").append($("#graph-lab"));
    window.DFS_GRAPH?.setContext(`${problem.id}:coding${usesArrayNumberDrawing() ? ":array-number-v2" : ""}`, 0);
    window.DFS_GRAPH?.setNodeLabelRule(usesArrayNumberDrawing() ? "array-number" : problem.counterexampleLesson?.nodeLabels?.rule || "free", usesArrayNumberDrawing() ? arrayDrawingOptions() : problem.graphRules?.nodeLabelFormat);
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = "Scratch graph";
    graphDisclosure.addEventListener("toggle", () => {
      if (graphDisclosure.open) requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    });
    restoreFormDraft("solution");
    const editor = $("#coding-editor");
    const numbers = $("#coding-line-numbers");
    const highlight = $("#coding-highlight");
    const syncEditorScroll = () => { numbers.scrollTop = editor.scrollTop; highlight.scrollTop = editor.scrollTop; highlight.scrollLeft = editor.scrollLeft; };
    const refreshLines = () => {
      numbers.textContent = Array.from({ length: editor.value.split("\n").length }, (_, i) => i + 1).join("\n");
      highlight.innerHTML = highlightEditorJavaScript(editor.value);
      syncEditorScroll();
    };
    refreshLines();
    editor.onscroll = syncEditorScroll;
    let escapeTab = false;
    editor.onkeydown = event => {
      if (event.key === "Escape") { escapeTab = true; return; }
      if (event.key === "Tab" && !escapeTab && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const value = editor.value;
        if (!event.shiftKey && start === end) {
          document.execCommand("insertText", false, "  ");
        } else {
          const first = value.slice(0, start).lastIndexOf("\n") + 1;
          // A selection ending at the next line's start does not include that line.
          const last = end > start && value[end - 1] === "\n" ? end - 1 : end;
          const newline = value.indexOf("\n", last);
          const finish = newline < 0 ? value.length : newline;
          const lines = value.slice(first, finish).split("\n");
          const removed = lines.map(line => event.shiftKey ? (line.match(/^(?: {1,2}|\t)/) || [""])[0].length : 0);
          const replacement = lines.map((line, i) => event.shiftKey ? line.slice(removed[i]) : "  " + line).join("\n");
          const firstDelta = event.shiftKey ? -Math.min(removed[0], start - first) : 2;
          const endLineStart = value.slice(0, end).lastIndexOf("\n") + 1;
          const endsAfterBlock = end > finish;
          const totalDelta = event.shiftKey
            ? -removed.reduce((sum, count, i) => sum + (i === removed.length - 1 && !endsAfterBlock ? Math.min(count, end - endLineStart) : count), 0)
            : lines.length * 2;
          if (replacement !== value.slice(first, finish)) {
            editor.setSelectionRange(first, finish);
            // Native insertion keeps indentation in the browser's undo history.
            document.execCommand("insertText", false, replacement);
            editor.setSelectionRange(start + firstDelta, Math.max(start + firstDelta, end + totalDelta));
          }
        }
      }
      escapeTab = false;
    };
    const setBusy = busy => {
      $("#coding-run").disabled = busy;
      $("#coding-submit").disabled = busy;
      $("#coding-stop").hidden = !busy;
    };
    $("#challenge").oninput = event => {
      stopCodingRun(); setBusy(false); refreshLines(); codingResult = null;
      $("#coding-results").textContent = "";
      if (event.target === editor) { persistProgress(codingStorageKey(), { passed: false }); updateCodingProgress(0, lesson.tests.length); }
      saveFormDraft();
    };
    $("#coding-stop").onclick = () => { stopCodingRun(); setBusy(false); codingResult = { stopped: true }; $("#coding-results").textContent = "Stopped. You can edit and try again."; refreshCodingHelp(); };
    const execute = async mode => {
      stopCodingRun();
      const version = codingRunVersion;
      const code = editor.value;
      const results = $("#coding-results");
      codingResult = null;
      if (mode === "submit") { persistProgress(codingStorageKey(), { passed: false }); updateCodingProgress(0, lesson.tests.length); }
      let args;
      if (mode === "run") {
        args = [];
        for (const [i, input] of codingInputs().entries()) {
          try { args.push(parseLessonValue(input.raw, input.name, lesson.parameters[i].example ?? inputSample(input.name))); }
          catch (error) {
            const message = error.message;
            results.innerHTML = `<pre class="coding-error">${esc(message)}</pre>`;
            codingResult = { inputError: message }; $(`#coding-input-${i}`).focus(); refreshCodingHelp(); return;
          }
        }
        try {
          const input = Object.fromEntries(lesson.parameters.map((parameter, i) => [parameter.name, args[i]]));
          if ('scores' in input) input.trust = input.scores;
          window.DFS_STEP5.validate(problem.id, input);
        } catch (error) {
          const message = 'Check your input: ' + error.message;
          results.innerHTML = `<pre class="coding-error">${esc(message)}</pre>`;
          codingResult = { inputError: message };
          const index = lesson.parameters.findIndex(parameter => new RegExp('\\b' + parameter.name + '\\b').test(error.message));
          if (index >= 0) $(`#coding-input-${index}`).focus();
          refreshCodingHelp(); return;
        }
      }
      setBusy(true); results.textContent = mode === "run" ? "Running your input…" : "Running tests…";
      refreshCodingHelp();
      try {
        if (!window.Step6Runtime) throw new Error("The code runner did not load. Refresh and try again.");
        codingRunner ||= window.Step6Runtime.createRunner();
        if (mode === "run") {
          const result = await codingRunner.run({ code, functionName: lesson.functionName, args });
          if (version !== codingRunVersion || section !== 6) return;
          codingResult = { args, runResult: result };
          results.innerHTML = `<section class="coding-run-result"><h4>Your input</h4>${codingOutput(result)}</section>`;
        } else {
          const testResults = [];
          for (const [i, test] of lesson.tests.entries()) {
            results.textContent = `Running test ${i + 1} of ${lesson.tests.length}…`;
            const result = await codingRunner.run({ code, functionName: lesson.functionName, args: test.args });
            if (version !== codingRunVersion || section !== 6) return;
            const passed = result.ok && window.DFS_STEP5.equal(problem.id, result.value, test.expected);
            testResults.push({ id: test.id, label: test.label, args: test.args, expected: test.expected, ...result, passed });
          }
          const passed = testResults.filter(test => test.passed).length;
          codingResult = { testResults };
          persistProgress(codingStorageKey(), { passed: passed === lesson.tests.length, code });
          updateCodingProgress(passed, lesson.tests.length);
          results.innerHTML = `<h4>${passed === lesson.tests.length ? "All tests passed!" : `${passed} of ${lesson.tests.length} tests passed`}</h4>${testResults.map((test, i) => `<details class="coding-test ${test.passed ? "is-correct" : "needs-work"}"${test.passed ? "" : " open"}><summary>${test.passed ? "✓ Passed" : "✗ Failed"} · Test ${i + 1}: ${esc(test.label)}</summary><strong>Input</strong><pre>${esc(lesson.parameters.map((parameter, n) => `${parameter.name} = ${codingValue(test.args[n])}`).join("\n"))}</pre><strong>Expected</strong><pre>${esc(codingValue(test.expected))}</pre>${codingOutput(test)}</details>`).join("")}`;
        }
      } catch (error) {
        if (version !== codingRunVersion || section !== 6) return;
        codingResult = { runResult: { ok: false, error: { name: error.name, message: error.message } } };
        results.innerHTML = `<pre class="coding-error">${esc(codingError(codingResult.runResult.error))}</pre>`;
      } finally {
        if (version === codingRunVersion && section === 6) { setBusy(false); refreshCodingHelp(); }
      }
    };
    $("#coding-run").onclick = () => execute("run");
    $("#coding-submit").onclick = () => execute("submit");
    try {
      const saved = JSON.parse(localStorage.getItem(codingStorageKey()) || "{}");
      if (saved.passed && saved.code === editor.value) { updateCodingProgress(lesson.tests.length, lesson.tests.length); $("#coding-results").textContent = "Your saved solution passed all tests. Run them again whenever you like."; }
    } catch {}
    refreshCodingHelp();
    $(".test-pane").scrollTop = 0;
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
    const name = characterName(50 + done);
    const diagnoses = arrangeChoices(round.diagnoses, round.correctDiagnosis, round.answerSlot);
    const displayInput = formatReasoningInput(round.input);
    const frame = reasoningFrame();
    const compact = true;
    const outputField = `<label class="counter-field reasoning-output"><span>2 · What does the incorrect code return?</span><textarea id="reasoning-output" rows="3" autocomplete="off" spellcheck="false" placeholder="${esc(outputPlaceholder())}" ${compact ? "disabled" : ""}></textarea></label><p id="reasoning-output-help" class="counter-output-help">Type the value the function returns. ${esc(friendlyOutputFormat(round.outputFormat))}</p>`;
    const diagnosisField = `<fieldset class="reasoning-rule"><legend>3 · What graph-level behavior does this code create?</legend><div class="choices">${diagnoses.map((choice, index) => `<button class="choice" data-choice-id="${esc(choice.id)}" aria-pressed="false" ${compact ? "disabled" : ""}><span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${esc(choice.label)}</span></button>`).join("")}</div></fieldset>`;
    const correctOutputField = `<label class="counter-field reasoning-output"><span>What should the correct solution return?</span><textarea id="reasoning-correct-output" placeholder="${esc(outputPlaceholder())}" rows="2" autocomplete="off" spellcheck="false" disabled></textarea></label>`;
    const reasoningQuestions = outputField + correctOutputField + diagnosisField;
    window.DFS_GRAPH?.setContext(`${problem.id}:reasoning:${round.caseId || done}`, 0);
    unlockCounterexampleEditor();
    $("#graph-lab").hidden = false;
    $("#graph-lab-title").textContent = `Draw the correct problem graph — not ${name}'s buggy graph`;
    $("#graph-direction-label").textContent = "Directed edges";
    $("#challenge").innerHTML = `${compact ? "" : `<div class="challenge-top reasoning-case-top"><span class="probe-type">${esc(frame.label)}</span><span class="probe-id">STEP 4 · ONE DEEP MISSION</span></div>`}
      <div class="challenge-body reasoning-case">
        ${compact ? "" : `<div class="coder-id"><span class="coder-avatar" aria-hidden="true">${esc(name[0])}</span><div><small>CODE UNDER REVIEW</small><h3>${esc(name)}'s incorrect ${esc(problem.title)} solution</h3></div></div><p class="reasoning-intro">${esc(frame.intro(name))}</p>`}
        <div class="trace-input"><span>REAL PROBLEM INPUT</span><pre>${esc(displayInput)}</pre></div>
        ${renderNodeLabelGuide(round)}
        <section class="code-window" aria-label="Incorrect JavaScript solution"><div class="code-window-label">Incorrect solution</div><pre tabindex="0"><code>${renderCodeLines(String(round.code).split("\n"))}</code></pre></section>
        ${reasoningQuestions}
        <div id="feedback-slot" role="status" aria-live="polite"></div>
        <div class="challenge-actions">${compact ? "" : '<span class="microcopy">Your graph, diagnosis, and the incorrect solution\'s output must all agree.</span>'}<button id="reasoning-check" class="primary-btn" disabled>Check graph + reasoning <span>→</span></button></div>
      </div>`;
    if (compact) {
      $("#graph-lab-title").textContent = "1 · Draw the graph";
      $(".trace-input").after($("#graph-lab"));
      counterGraphChangeHandler = () => {
        const started = round.canvas.nodes.length === 0 || Boolean(window.DFS_GRAPH?.getSnapshot()?.nodes?.length);
        $$('[data-choice-id]').forEach(button => { button.disabled = !started; });
        $("#reasoning-output").disabled = !started;
        $("#reasoning-correct-output").disabled = !started;
      };
      window.addEventListener("dfs-graph-change", counterGraphChangeHandler);
      counterGraphChangeHandler();
    }
    const update = () => { $("#reasoning-check").disabled = !selectedId || !$("#reasoning-output").value.trim() || !$("#reasoning-correct-output").value.trim(); };
    $$('[data-choice-id]').forEach(button => { button.onclick = () => { selectChoice(button.dataset.choiceId, "#reasoning-check"); update(); }; });
    $("#reasoning-output").addEventListener("input", update);
    $("#reasoning-correct-output").addEventListener("input", update);
    $("#reasoning-check").onclick = () => checkReasoning(round);
    restoreFormDraft(`reasoning:${round.caseId || done}`);
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
    return `<div class="reasoning-coach"><b>Code rule:</b> ${esc(proof.codeRule)} <span>→</span> <b>Graph effect:</b> ${esc(proof.changedGraph || round.diagnoses.find(choice => choice.id === round.correctDiagnosis)?.label?.replace(/^Claim about the code:\s*/i, "") || proof.codeRule)} <span>→</span> <b>Reachable boundary:</b> ${esc(proof.separatingFeature)}${includeOutcome ? ` <span>→</span> <b>Returned value:</b> ${esc(proof.outputConsequence)}` : ""}</div>`;
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
    clearAiHelp();
    const drawing = window.DFS_GRAPH?.getSnapshot() || { nodes: [], edges: [], directed: false };
    const graph = gradeCanvas(round.canvas, drawing);
    const checks = [
      ["The drawing has every exact node", graph.nodes],
      [graph.nodes ? "The drawing has every exact edge" : "Check node names before the direct edges", graph.nodes ? graph.edges : null],
      ["The drawing uses the problem's direction", graph.direction],
      ["Graph colors match the input", graph.colors],
      ["Edge labels or weights match the input", graph.labels],
      ["The graph-level diagnosis is correct", selectedId === round.correctDiagnosis],
      ["Your prediction for the incorrect code's exact output", jsonAnswerMatches($("#reasoning-output").value, round.buggyOutput)],
      ["Your prediction for the correct solution's exact output", jsonAnswerMatches($("#reasoning-correct-output").value, round.correctOutput)]
    ].filter(([label]) => !label.startsWith("Graph colors") || round.canvas.edges.some(edge => edge.color) || round.canvas.nodes.some(node => node.color || node.blocked)).filter(([label]) => !label.startsWith("Edge labels") || round.canvas.edges.some(edge => edge.label));
    if (!checks.every(([, pass]) => pass)) {
      reasoningProgress.mistakes++;
      reasoningProgress.attempts++;
      saveReasoningProgress();
      updateReasoningProgress(reasoningProgress.index, reasoningRounds());
      const selected = round.diagnoses.find(choice => choice.id === selectedId);
      const diagnosisHelp = selectedId && selectedId !== round.correctDiagnosis ? `<div class="feedback-next"><b>About your diagnosis:</b> ${esc(selected?.feedback || "Compare the code's graph behavior with the locked problem rule.")}</div>` : "";
      $("#feedback-slot").innerHTML = `<div class="feedback trace-feedback"><b>${!graph.nodes || !graph.edges || !graph.direction || !graph.colors || !graph.labels ? "Fix the marked graph details." : selectedId !== round.correctDiagnosis ? "Recheck what the code changes." : "Recheck the returned values."}</b><ul class="feedback-checklist">${checks.map(([label, pass]) => `<li class="${pass == null ? "waiting" : pass ? "passed" : "failed"}"><span>${pass == null ? "•" : pass ? "✓" : "×"}</span>${esc(label)}</li>`).join("")}</ul>${graph.hint ? `<p class="feedback-next">${esc(graph.hint)}</p>` : ""}${diagnosisHelp}${reasoningWalkthrough(round)}</div>`;
      offerAiHelp({ round, studentGraph: drawing, selectedDiagnosis: selectedId, studentBuggyOutput: $("#reasoning-output").value, studentCorrectOutput: $("#reasoning-correct-output").value, checks });
      $("#reasoning-check").disabled = false;
      $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#feedback-slot").tabIndex = -1;
      $("#feedback-slot").focus({ preventScroll: true });
      return;
    }
    answered = true;
    lockCounterexampleEditor();
    $("#reasoning-output").disabled = true;
    $("#reasoning-correct-output").disabled = true;
    $$('[data-choice-id]').forEach(button => { button.disabled = true; });
    $("#feedback-slot").innerHTML = `<div class="feedback good trace-success"><b>Trace confirmed.</b><div class="trace-summary"><div><span>Misconception</span><strong>${esc(round.bugTitle)}</strong></div><div><span>Incorrect output</span><strong>${esc(round.buggyOutput)}</strong></div><div><span>Correct output</span><strong>${esc(round.correctOutput)}</strong></div></div>${reasoningWalkthrough(round, true)}</div>`;
    $("#feedback-slot").scrollIntoView({ behavior: "smooth", block: "center" });
    $("#feedback-slot").tabIndex = -1;
    $("#feedback-slot").focus({ preventScroll: true });
    const button = $("#reasoning-check");
    button.disabled = false;
    button.innerHTML = reasoningProgress.index + 1 < reasoningRounds().length ? "Next code case <span>→</span>" : "Finish Step 4 <span>→</span>";
    updateReasoningProgress(reasoningProgress.index + 1, reasoningRounds());
    persistProgress(reasoningStorageKey(), { ...reasoningProgress, index: reasoningProgress.index + 1, attempts: 0, remedial: false });
    pendingAdvance = () => { pendingAdvance = null; reasoningProgress.index++; reasoningProgress.attempts = 0; reasoningProgress.remedial = false; saveReasoningProgress(); };
    button.onclick = () => { pendingAdvance?.(); render(); };
  }

  function updateReasoningProgress(done, rounds) {
    const total = Math.max(rounds.length, 1);
    const passed = done - reasoningProgress.skipped.filter(index => index < done).length;
    $("#evidence-label").textContent = `${passed} of ${total} code cases passed`;
    $("#attempt-label").textContent = reasoningProgress.mistakes ? `${reasoningProgress.mistakes} correction${reasoningProgress.mistakes === 1 ? "" : "s"}` : "";
    $("#evidence-fill").style.width = `${passed / total * 100}%`;
    $(".evidence-track").setAttribute("aria-valuemax", String(total));
    $(".evidence-track").setAttribute("aria-valuenow", String(passed));
    $("#facet-list").innerHTML = ["exact graph", "exact output", "code behavior", "why it fails"].map(label => `<span class="facet ${passed > 0 ? "proven" : ""}">${label}</span>`).join("");
    $("#evidence-chip").innerHTML = passed === total ? "<span>✓ Code understood</span>" : "<span class=\"pulse-dot\"></span><span>Debug session active</span>";
  }

  function renderReasoningComplete() {
    $("#graph-lab").hidden = true;
    const skipped = reasoningProgress.skipped.length;
    $("#challenge").innerHTML = `<div class="challenge-body victory reasoning-victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Skipped" : "Traced"}</div><h3>${skipped ? "Step 4 skipped." : "Step 4 complete."}</h3><p>${skipped ? `${skipped} code case${skipped === 1 ? "" : "s"} skipped.` : `You solved all ${reasoningRounds().length} code cases.`}</p><div class="completion-actions"><a class="primary-btn link-button" href="/">Choose another problem <span>→</span></a><button id="restart-reasoning" class="ghost-btn">Practice Step 4 again</button></div></div>`;
    $(".test-pane").scrollTop = 0;
    focusPrompt();
    if (hasStep5()) {
      const next = document.createElement("button");
      next.className = "primary-btn";
      next.textContent = "Start Step 5 →";
      next.onclick = () => switchSection(5);
      $("#challenge .completion-actions").prepend(next);
    }
    $("#restart-reasoning").onclick = resetReasoning;
  }

  // Canonical rooted-tree signatures distinguish identical labels by their children.
  // Unordered lessons sort children; traversal lessons preserve each parent’s arrow order.
  function arrayNumberLabel(node) {
    const label = String(node.label).trim();
    if (label === "outer array" || /^root(?:\[\d+\])*=\[\]$/.test(label) || /^(?:\[\d+\])+ array$/.test(label)) return "Array";
    const value = label.match(/^(?:root)?(?:\[\d+\])*=(.*)$/)?.[1] ?? label;
    try { return JSON.stringify(JSON.parse(value)); } catch { return value; }
  }

  function arrayTreeSignature(graph, labelOf, ordered = false) {
    const byId = new Map(graph.nodes.map(node => [String(node.id), node]));
    if (!byId.size || byId.size !== graph.nodes.length || graph.edges.length !== byId.size - 1) return null;
    const children = new Map([...byId.keys()].map(id => [id, []]));
    const parents = new Map([...byId.keys()].map(id => [id, 0]));
    for (const edge of graph.edges) {
      const from = String(edge.from), to = String(edge.to);
      if (!byId.has(from) || !byId.has(to) || from === to || labelOf(byId.get(from)) !== "Array") return null;
      children.get(from).push(to);
      parents.set(to, parents.get(to) + 1);
      if (parents.get(to) > 1) return null;
    }
    const roots = [...parents.keys()].filter(id => parents.get(id) === 0);
    if (roots.length !== 1 || labelOf(byId.get(roots[0])) !== "Array") return null;
    const visited = new Set();
    function visit(id) {
      if (visited.has(id)) return null;
      visited.add(id);
      const branches = children.get(id).map(visit);
      if (branches.includes(null)) return null;
      if (!ordered) branches.sort();
      return `[${JSON.stringify(labelOf(byId.get(id)))},[${branches.join(",")}]]`;
    }
    const signature = visit(roots[0]);
    return visited.size === byId.size ? signature : null;
  }

  function arrayDrawingHelpAttempt(attempt) {
    const copy = structuredClone(attempt);
    // Answer-key IDs stay private identifiers; all shown names use the same editor model.
    function adapt(value) {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value.nodes) && Array.isArray(value.edges)) {
        value.nodeLabelMode = "array-number";
        value.nodes.forEach(node => { if (node && typeof node === "object") node.label = arrayNumberLabel(node); });
        return;
      }
      Object.entries(value).forEach(([key, child]) => { if (key !== "studentGraph") adapt(child); });
    }
    adapt(copy);
    return copy;
  }

  function gradeArrayNumberCanvas(expected, drawing, options = {}) {
    const actualLabel = node => String(node.label).trim();
    const wanted = expected.nodes.map(arrayNumberLabel).sort();
    const actual = drawing.nodes.map(actualLabel).sort();
    const nodes = JSON.stringify(wanted) === JSON.stringify(actual);
    const signature = arrayTreeSignature(drawing, actualLabel, options.ordered);
    const edges = nodes && signature !== null && signature === arrayTreeSignature(expected, arrayNumberLabel, options.ordered);
    const direction = drawing.directed === expected.directed;
    const labels = drawing.edges.every(edge => !String(edge.label || "").trim());
    let hint = "";
    if (!nodes) hint = "Use one Array for each array (including empty arrays), and one node for each value. Keep repeated values as separate nodes.";
    else if (!direction) hint = "Turn on Directed edges. Arrows go from an Array to its children.";
    else if (!edges && options.ordered && arrayTreeSignature(drawing, actualLabel) === arrayTreeSignature(expected, arrayNumberLabel)) hint = "Your connections are right, but the arrow order is different. For each Array, draw arrows to its children in the input’s left-to-right order. Delete and reconnect those arrows to fix the order.";
    else if (!edges) hint = "Check which Array directly contains each child. Do not skip an Array, join siblings, or connect a child to two parents." + (options.ordered ? " For each Array, its numbered arrows must follow the input’s left-to-right order. Delete and reconnect arrows to fix their order." : "");
    else if (!labels) hint = "Leave arrows unlabeled. Put values on value nodes.";
    return { nodes, edges: edges && labels, direction, colors: true, labels, hint };
  }

  // Step 2 also draws mistaken graphs: these may be forests or have reversed arrows.
  // Match node roles and connections, not private path IDs or node creation order.
  function gradeArrayCounterCanvas(expected, drawing, options = {}) {
    const actualLabel = node => {
      const label = String(node.label).trim();
      if (label === "Array") return label;
      try {
        const value = JSON.parse(label);
        return typeof value === "number" && Number.isFinite(value) ? JSON.stringify(value) : null;
      } catch { return null; }
    };
    const wanted = expected.nodes.map(arrayNumberLabel).sort();
    const actual = drawing.nodes.map(actualLabel).sort();
    const nodes = !actual.includes(null) && JSON.stringify(wanted) === JSON.stringify(actual);
    const direction = drawing.directed === expected.directed;
    const labels = drawing.edges.every(edge => !String(edge.label || "").trim());

    function matches(ordered) {
      if (!nodes || expected.edges.length !== drawing.edges.length) return false;
      function prepare(graph, labelOf) {
        const ids = new Map(graph.nodes.map((node, index) => [String(node.id), index]));
        if (ids.size !== graph.nodes.length) return null;
        const outgoing = graph.nodes.map(() => []), incoming = graph.nodes.map(() => []);
        const adjacency = graph.nodes.map(() => new Map());
        for (const edge of graph.edges) {
          const from = ids.get(String(edge.from)), to = ids.get(String(edge.to));
          if (from === undefined || to === undefined) return null;
          const rank = ordered ? outgoing[from].length : 0;
          outgoing[from].push({ to, rank });
          incoming[to].push({ to: from, rank });
          if (!adjacency[from].has(to)) adjacency[from].set(to, []);
          adjacency[from].get(to).push(rank);
        }
        return { outgoing, incoming, adjacency, colors: graph.nodes.map(node => labelOf(node)) };
      }
      const one = prepare(expected, arrayNumberLabel), two = prepare(drawing, actualLabel);
      if (!one || !two) return false;
      // Refine both graphs together so identical colors always mean identical structure.
      for (let round = 0; round < expected.nodes.length; round++) {
        const palette = new Map();
        const previousCount = new Set([...one.colors, ...two.colors]).size;
        const refined = [one, two].map(graph => graph.colors.map((color, index) => {
          const neighbors = edges => edges.map(edge => JSON.stringify([edge.rank, graph.colors[edge.to]])).sort();
          const key = JSON.stringify([color, neighbors(graph.outgoing[index]), neighbors(graph.incoming[index])]);
          if (!palette.has(key)) palette.set(key, palette.size);
          return palette.get(key);
        }));
        [one.colors, two.colors] = refined;
        if (JSON.stringify([...one.colors].sort((a,b) => a-b)) !== JSON.stringify([...two.colors].sort((a,b) => a-b))) return false;
        if (palette.size === previousCount) break;
      }
      const edgeKey = (graph, from, to) => JSON.stringify(graph.adjacency[from].get(to) || []);
      const candidates = one.colors.map(color => two.colors.flatMap((other, index) => color === other ? [index] : []));
      const order = one.colors.map((_, index) => index).sort((a,b) => candidates[a].length - candidates[b].length || one.outgoing[b].length + one.incoming[b].length - one.outgoing[a].length - one.incoming[a].length);
      const mapping = new Map(), used = new Set();
      function assign(position) {
        if (position === order.length) return true;
        const from = order[position];
        for (const to of candidates[from]) {
          if (used.has(to) || edgeKey(one, from, from) !== edgeKey(two, to, to)) continue;
          let compatible = true;
          for (const [otherFrom, otherTo] of mapping) {
            if (edgeKey(one, from, otherFrom) !== edgeKey(two, to, otherTo) || edgeKey(one, otherFrom, from) !== edgeKey(two, otherTo, to)) { compatible = false; break; }
          }
          if (!compatible) continue;
          mapping.set(from, to); used.add(to);
          if (assign(position + 1)) return true;
          mapping.delete(from); used.delete(to);
        }
        return false;
      }
      return assign(0);
    }

    const edges = matches(Boolean(options.ordered));
    let hint = "";
    if (!nodes) hint = "Check your Array nodes and number nodes. Each array needs its own Array node, and each number needs its own node—even repeated numbers.";
    else if (!direction) hint = "Turn on Directed edges so your connections have arrows.";
    else if (!edges && options.ordered && matches(false)) hint = "Your connections are right, but the arrow order is different. For each node, delete and reconnect its arrows in the required order.";
    else if (!edges) hint = "Check each arrow against the rule for this drawing. Keep every input node, even when a mistaken rule leaves it disconnected.";
    else if (!labels) hint = "Leave arrows unlabeled. Put numbers on number nodes.";
    return { nodes, edges: edges && labels, direction, colors: true, labels, hint };
  }

  function gradeCanvas(expected, drawing) {
    if (usesArrayNumberDrawing()) return gradeArrayNumberCanvas(expected, drawing, problem.lesson.drawingEditor);
    const expectedLabels = expected.nodes.map(node => normalizeNodeLabel(node.label)).sort();
    const actualLabels = drawing.nodes.map(node => normalizeNodeLabel(node.label)).sort();
    const nodes = new Set(actualLabels).size === actualLabels.length && JSON.stringify(expectedLabels) === JSON.stringify(actualLabels);
    const expectedById = Object.fromEntries(expected.nodes.map(node => [String(node.id), normalizeNodeLabel(node.label)]));
    const actualById = Object.fromEntries(drawing.nodes.map(node => [String(node.id), normalizeNodeLabel(node.label)]));
    const key = (from, to, directed) => directed ? `${from}→${to}` : [from, to].sort().join("—");
    const expectedEdges = expected.edges.map(edge => ({ key: key(expectedById[String(edge.from)], expectedById[String(edge.to)], expected.directed), color: edge.color || "", label: String(edge.label || "").trim() })).sort((a, b) => a.key.localeCompare(b.key));
    const actualEdges = drawing.edges.map(edge => ({ key: key(actualById[String(edge.from)], actualById[String(edge.to)], expected.directed), color: semanticColor(edge.color), label: String(edge.label || "").trim() })).sort((a, b) => a.key.localeCompare(b.key));
    const edges = JSON.stringify(expectedEdges.map(edge => edge.key)) === JSON.stringify(actualEdges.map(edge => edge.key));
    const direction = drawing.directed === expected.directed;
    const edgeColors = edges && expectedEdges.every((edge, index) => !edge.color || edge.color === actualEdges[index].color);
    const expectedNodeColors = Object.fromEntries(expected.nodes.map(node => [normalizeNodeLabel(node.label), node.color || (node.blocked ? "blue" : "")]));
    const actualNodeColors = Object.fromEntries(drawing.nodes.map(node => [normalizeNodeLabel(node.label), semanticColor(node.color)]));
    const nodeColors = nodes && Object.entries(expectedNodeColors).every(([label, color]) => !color || actualNodeColors[label] === color);
    const colors = edgeColors && nodeColors;
    const labels = edges && expectedEdges.every((edge, index) => equivalentEdgeLabel(edge.label, actualEdges[index].label));
    let hint = "";
    const duplicate = actualLabels.find((label, index) => actualLabels.indexOf(label) !== index);
    const extra = actualLabels.find(label => !expectedLabels.includes(label));
    if (duplicate) hint = `Two nodes share the name ${duplicate}. Give each input item its own name.`;
    else if (extra) hint = `Check the node named ${extra}. Does its name and role match the input?`;
    else if (!nodes) hint = `Your drawing has ${actualLabels.length} node${actualLabels.length === 1 ? "" : "s"}. Check whether an input item is missing.`;
    else if (!direction) hint = `Set the drawing to ${expected.directed ? "directed arrows" : "two-way edges"}.`;
    else if (!edges) {
      const unexpected = actualEdges.find(edge => !expectedEdges.some(item => item.key === edge.key));
      const missing = expectedEdges.find(edge => !actualEdges.some(item => item.key === edge.key));
      hint = unexpected ? `Recheck ${unexpected.key}: is it a direct connection in the input?` : `Recheck the direct connection ${missing?.key}.`;
    } else if (!labels) {
      const edge = expectedEdges.find((edge, index) => !equivalentEdgeLabel(edge.label, actualEdges[index].label));
      hint = `Check the weight or label on ${edge.key} against the input.`;
    } else if (!colors) hint = "Check the marked node and edge colors against the input.";
    return { nodes, edges, direction, colors, labels, hint };
  }

  function equivalentEdgeLabel(expected, actual) {
    const clean = value => String(value || "").trim().replace(/^×\s*/, "");
    const number = value => {
      const text = clean(value);
      const fraction = text.match(/^([-+]?\d+(?:\.\d+)?)\s*\/\s*([-+]?\d+(?:\.\d+)?)$/);
      if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
      return text !== "" && Number.isFinite(Number(text)) ? Number(text) : null;
    };
    const one = number(expected), two = number(actual);
    if (one !== null && two !== null) return Math.abs(one - two) <= 1e-9 * Math.max(1, Math.abs(one), Math.abs(two));
    return clean(expected).toLowerCase() === clean(actual).toLowerCase();
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
      if (usesArrayNumberDrawing()) {
        const main = arrayNumberLabel(node);
        return { isContainer: main === "Array", label: { main, path: "" } };
      }
      const naturalLabel = nestedLabelParts(node.label, false, rawItems[index]);
      const isContainer = rawItems[index]
        ? rawItems[index].container
        : hasChildren.has(String(node.id)) || naturalLabel.container || /^(?:root|empty|[A-Z]|L\d+)$/.test(String(node.label).trim());
      return { isContainer, label: nestedLabelParts(node.label, isContainer, rawItems[index]) };
    });
    const displayById = Object.fromEntries(model.nodes.map((node, index) => [String(node.id), displayNodes[index].label]));
    const edges = model.edges.map((edge, index) => {
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
      const order = usesArrayNumberDrawing() && problem.lesson.drawingEditor.ordered
        ? `<text class="mini-edge-label" x="${(start.x + tip.x) / 2}" y="${(start.y + tip.y) / 2 - 7}">#${model.edges.slice(0, index + 1).filter(item => String(item.from) === String(edge.from)).length}</text>` : "";
      return line + arrow + order;
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

  function updateProgress(completed = progress.index) {
    const total = mainTasks().length;
    const done = Math.min(completed, total);
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
    $("#challenge").innerHTML = `<div class="challenge-body victory${skipped ? " has-skips" : ""}"><div class="stamp">${skipped ? "Finished" : "Proven"}</div><h3>${skipped ? "Step 1 finished." : "Step 1 complete."}</h3><p>${skipped ? `${passed} passed · ${skipped} skipped.` : `You passed all ${mainTasks().length} visual checks.`}</p><div class="completion-actions"><button id="start-counterexamples" class="primary-btn">Start Step 2 <span>→</span></button><a class="ghost-btn link-button" href="/">Choose another problem</a><button id="restart-visual" class="ghost-btn">Practice Step 1 again</button></div></div>`;
    $("#start-counterexamples").onclick = () => switchSection(2);
    $("#restart-visual").onclick = reset;
  }

  function renderMissingLesson() {
    $("#graph-lab").hidden = true;
    $("#challenge").innerHTML = `<div class="challenge-body"><h3>This lesson is still being authored.</h3><p>Its nine problem-specific visual checks are required before it can ship.</p><a class="primary-btn link-button" href="/">Choose another problem <span>→</span></a></div>`;
  }

  function persistProgress(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function clearSectionDrafts(number) {
    draftKey = null;
    pendingAdvance = null;
    const graphPrefix = `dfs-drawing:v1:${problem.id}:`;
    const sectionSuffix = { 2: "counterexample:", 3: "structure-transfer:", 4: "reasoning:" };
    try {
      for (const key of Object.keys(localStorage)) {
        const suffix = key.startsWith(graphPrefix) ? key.slice(graphPrefix.length) : null;
        const graphMatch = suffix !== null && (number === 1 ? !Object.values(sectionSuffix).some(prefix => suffix.startsWith(prefix)) : suffix.startsWith(sectionSuffix[number]));
        if (graphMatch || key.startsWith(`dfs-form:v1:${problem.id}:${number}:`)) localStorage.removeItem(key);
      }
    } catch {}
  }

  function restoreFormDraft(taskId) {
    draftKey = `dfs-form:v1:${problem.id}:${section}:${taskId}:${section === 1 ? progress.remedialFor || "main" : ""}`;
    restoringDraft = true;
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      for (const [id, value] of Object.entries(draft.fields || {})) {
        const field = document.getElementById(id);
        if (field) { field.value = value; field.dispatchEvent(new Event("input", { bubbles: true })); }
      }
      for (const selector of draft.choices || []) $(selector)?.click();
    } catch {}
    restoringDraft = false;
  }

  function saveFormDraft() {
    if (!draftKey || restoringDraft || section === 2) return;
    const fields = Object.fromEntries($$("#challenge textarea[id], #challenge input[id], #challenge select[id]").map(field => [field.id, field.value]));
    const choices = $$('[data-choice-id][aria-pressed="true"]').map(button => `[data-choice-id="${button.dataset.choiceId}"]`);
    choices.push(...$$('[data-claim-index][aria-pressed="true"]').map(button => `[data-claim-index="${button.dataset.claimIndex}"][data-claim-value="${button.dataset.claimValue}"]`));
    try {
      localStorage.setItem(draftKey, JSON.stringify({ fields, choices }));
      if (section === 6 && $("#coding-save-warning")) $("#coding-save-warning").hidden = true;
    } catch {
      const warning = section === 6 && $("#coding-save-warning");
      if (warning) {
        warning.hidden = false;
        warning.textContent = "Your browser could not save this code. Copy it before leaving or refreshing this page.";
      }
    }
  }

  function loadProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey()) || "{}");
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), mainTasks().length), mistakes: Math.max(Number(value.mistakes) || 0, 0), remedialFor: value.remedialFor || null, fastTrackEarned: value.fastTrackEarned === true, skipped: Array.isArray(value.skipped) ? value.skipped.map(Number) : [] };
    } catch { return { index: 0, mistakes: 0, remedialFor: null, skipped: [] }; }
  }
  function saveProgress() { localStorage.setItem(storageKey(), JSON.stringify(progress)); }
  function storageKey() { return `dfs-visual:${problem.id}:v${data.version}-coffee-rollout${problem.category === "variant" ? "-short-v1" : ""}${problem.lesson?.drawingEditor?.mode === "array-number" ? "-array-number-v1" : ""}`; }
  function loadCounterProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(counterStorageKey()) || "{}");
      const total = counterexampleRounds().length;
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
      const total = problem.category === "variant" ? 3 : 5;
      const skipped = [...new Set(Array.isArray(value.skipped) ? value.skipped.map(Number).filter(index => Number.isInteger(index) && index >= 0 && index < total) : [])];
      return { index: Math.min(Math.max(Number(value.index) || 0, 0), total), mistakes: Math.max(Number(value.mistakes) || 0, 0), claimVariant: 0, skipped };
    } catch { return { index: 0, mistakes: 0, claimVariant: 0, skipped: [] }; }
  }
  function saveStructureProgress() { localStorage.setItem(structureStorageKey(), JSON.stringify(structureProgress)); }
  function structureStorageKey() { return `dfs-structure:${problem.id}:v8${problem.category === "variant" ? "-short-v1" : ""}`; }
  function loadReasoningProgress() {
    try {
      const saved = localStorage.getItem(reasoningStorageKey());
      const legacy = !saved ? localStorage.getItem(`dfs-reasoning:${problem.id}:v2`) : null;
      const value = JSON.parse(saved || legacy || "{}");
      const maxIndex = legacy ? Math.min(reasoningRounds().length, 1) : reasoningRounds().length;
      const index = Math.min(Math.max(Number(value.index) || 0, 0), maxIndex);
      const skipped = [...new Set((Array.isArray(value.skipped) ? value.skipped : []).map(Number))]
        .filter(item => Number.isInteger(item) && item >= 0 && item < index && (!legacy || item === 0));
      return { index, mistakes: Math.max(Number(value.mistakes) || 0, 0), attempts: Math.max(Number(value.attempts) || 0, 0), remedial: false, skipped };
    } catch { return { index: 0, mistakes: 0, attempts: 0, remedial: false, skipped: [] }; }
  }
  function saveReasoningProgress() { localStorage.setItem(reasoningStorageKey(), JSON.stringify(reasoningProgress)); }
  function reasoningStorageKey() { return `dfs-reasoning:${problem.id}:v3`; }
  function resetCurrentSection() { if (section === 6) resetCoding(); else if (section === 5) resetDebugging(); else if (section === 4) resetReasoning(); else if (section === 3) resetStructure(); else if (section === 2) resetCounterexamples(); else reset(); }
  function reset() {
    if (progress.index > 0 && !confirm("Restart the entire visual proof from the first blank graph?")) return;
    clearSectionDrafts(1);
    progress = { index: 0, mistakes: 0, remedialFor: null, skipped: [] };
    saveProgress();
    render();
  }
  function resetCounterexamples() {
    if (counterProgress.index > 0 && !confirm("Restart Step 2 from the first counterexample?")) return;
    clearSectionDrafts(2);
    for (const key of Object.keys(localStorage)) if (key.startsWith(`dfs-step2-draft:${problem.id}:`)) localStorage.removeItem(key);
    counterProgress = { index: 0, mistakes: 0, hints: 0, skills: [false, false, false, false], skipped: [] };
    saveCounterProgress();
    render();
  }
  function resetStructure() {
    if (structureProgress.index > 0 && !confirm("Restart Step 3 from the first graph check?")) return;
    clearSectionDrafts(3);
    structureProgress = { index: 0, mistakes: 0, claimVariant: 0, skipped: [] };
    structureRetryDrawing = null;
    saveStructureProgress();
    render();
  }
  function resetReasoning() {
    if (reasoningProgress.index > 0 && !confirm("Restart the Step 4 code cases?")) return;
    clearSectionDrafts(4);
    reasoningProgress = { index: 0, mistakes: 0, attempts: 0, remedial: false, skipped: [] };
    saveReasoningProgress();
    render();
  }
  function setMobilePane(pane) {
    document.body.classList.toggle("show-problem", pane === "problem");
    $$("#mobile-switcher button").forEach(button => { const active = button.dataset.pane === pane; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  }
  function formatText(value) { return esc(value).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"); }
  function focusPrompt() { queueMicrotask(() => { const heading = $$("#challenge h3").find(item => item.getClientRects().length); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }); }

  window.DFS_VISUAL_LIBRARY = { start, gradeCanvas, layout };
  start();
})();
