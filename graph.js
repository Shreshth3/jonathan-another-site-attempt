(() => {
  const params = new URLSearchParams(location.search);
  const lessonIds = new Set((window.DFS_VISUAL_DATA?.problems || []).map(problem => problem.id));
  const routeId = decodeURIComponent(location.pathname.replace(/^\/visual\//, "/").replace(/^\//, "").replace(/\/$/, ""));
  const enabled = params.get("graph") === "1" || params.get("visual") === "no-transfers" || lessonIds.has(routeId) || ["no-transfers-visual", "no-transfers"].includes(routeId);
  const colors = [
    { name: "Slate", value: "#8392a8" },
    { name: "Blue", value: "#72a7ff" },
    { name: "Green", value: "#57d39b" },
    { name: "Amber", value: "#f1b75b" },
    { name: "Red", value: "#ff7e82" },
    { name: "Purple", value: "#b69cff" }
  ];
  const widthStorageKey = "dfs-graph-edge-width-v1";
  const svgNS = "http://www.w3.org/2000/svg";
  let contextKey = "";
  let drawing = blankDrawing();
  let selected = null;
  let interaction = null;
  let connectFrom = null;
  let lastNodeClick = null;
  let renameTarget = null;
  let returnFocusTarget = null;
  let clearTimer = null;
  let defaultWidth = clamp(Number(readValue(widthStorageKey, "4")) || 4, 2, 8);

  let nodeLabelRule = "nonnegative-integer";
  let nodeLabelFormat = {};
  const api = { enabled, setContext, setSnapshot, setNodeLabelRule, getSnapshot: () => cloneDrawing(drawing) };
  window.DFS_GRAPH = api;
  if (!enabled) return;

  const lab = document.querySelector("#graph-lab");
  const board = document.querySelector("#graph-board");
  const svg = document.querySelector("#graph-svg");
  const empty = document.querySelector("#graph-empty");
  const directed = document.querySelector("#graph-directed");
  const widthInput = document.querySelector("#graph-edge-width");
  const widthOutput = document.querySelector("#graph-edge-width-value");
  const rename = document.querySelector("#graph-rename");
  const renameInput = document.querySelector("#graph-rename-input");
  const colorMenu = document.querySelector("#graph-color-menu");
  const colorButton = document.querySelector("#graph-color");
  const labelButton = document.querySelector("#graph-label");
  const clearButton = document.querySelector("#graph-clear");
  const status = document.querySelector("#graph-status");
  lab.hidden = false;
  widthInput.value = String(defaultWidth);
  updateWidthOutput();

  document.querySelector("#graph-add-node").addEventListener("click", addNode);
  clearButton.addEventListener("click", clearDrawing);
  labelButton.addEventListener("click", () => {
    if (!selected) return;
    connectFrom = null;
    openRename(selected.type, selected.id);
  });
  colorButton.addEventListener("click", () => {
    if (!selected) return;
    const rect = colorButton.getBoundingClientRect();
    openColorMenu(selected.type, selected.id, rect.left - board.getBoundingClientRect().left, rect.bottom - board.getBoundingClientRect().top + 8);
  });
  directed.addEventListener("change", () => {
    if (isLocked()) return;
    drawing.directed = directed.checked;
    saveDrawing();
    render();
    announce(drawing.directed ? "Directed arrows are on." : "Undirected edges are on.");
  });
  widthInput.addEventListener("input", () => {
    if (isLocked()) return;
    defaultWidth = clamp(Number(widthInput.value), 2, 8);
    drawing.edges.forEach(edge => { edge.width = defaultWidth; });
    writeValue(widthStorageKey, String(defaultWidth));
    updateWidthOutput();
    render();
  });
  board.addEventListener("pointerdown", onPointerDown);
  board.addEventListener("pointermove", onPointerMove);
  board.addEventListener("pointerup", onPointerUp);
  board.addEventListener("pointercancel", cancelInteraction);
  board.addEventListener("dblclick", onDoubleClick);
  board.addEventListener("contextmenu", onContextMenu);
  board.addEventListener("keydown", onKeyDown);
  svg.addEventListener("focusin", event => {
    const nodeElement = event.target.closest?.("[data-node-id]");
    const edgeElement = event.target.closest?.("[data-edge-id]");
    if (nodeElement) selectWithoutRender({ type: "node", id: Number(nodeElement.dataset.nodeId) });
    else if (edgeElement) selectWithoutRender({ type: "edge", id: Number(edgeElement.dataset.edgeId) });
  });
  board.addEventListener("click", event => {
    if (event.target === board || event.target === svg) select(null);
    if (!event.target.closest("#graph-color-menu")) closeColorMenu();
  });
  renameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") { event.preventDefault(); saveRename(); }
    if (event.key === "Escape") { event.preventDefault(); closeRename(true); }
  });
  renameInput.addEventListener("blur", () => { if (!rename.hidden) saveRename(); });
  window.addEventListener("resize", render);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(render).observe(board);

  function blankDrawing() {
    return { nodes: [], edges: [], directed: false, nextNodeId: 0, nextEdgeId: 0 };
  }

  function cloneDrawing(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function setContext(problemId, stepIndex) {
    if (!enabled) return;
    status.textContent = "";
    clearTimeout(announce.timer);
    const nextKey = `${problemId}:${stepIndex}`;
    contextKey = nextKey;
    try {
      const saved = JSON.parse(readValue(`dfs-drawing:v1:${contextKey}`, "null"));
      drawing = saved && Array.isArray(saved.nodes) && Array.isArray(saved.edges) ? saved : blankDrawing();
    } catch { drawing = blankDrawing(); }
    selected = null;
    interaction = null;
    connectFrom = null;
    lastNodeClick = null;
    directed.checked = drawing.directed;
    closeRename();
    closeColorMenu();
    render();
  }

  function setSnapshot(snapshot) {
    drawing = snapshot ? cloneDrawing(snapshot) : blankDrawing();
    if (contextKey) writeValue(`dfs-drawing:v1:${contextKey}`, JSON.stringify(drawing));
    selected = null;
    interaction = null;
    connectFrom = null;
    lastNodeClick = null;
    directed.checked = drawing.directed;
    closeRename();
    closeColorMenu();
    render();
  }

  function setNodeLabelRule(rule, format = {}) {
    nodeLabelRule = String(rule || "nonnegative-integer");
    nodeLabelFormat = format || {};
  }

  function addNode() {
    if (isLocked()) return;
    if (!contextKey) return;
    const bounds = boardBounds();
    const index = drawing.nodes.length;
    const roomy = nodePositionPreset()[index];
    const fallbackCol = index % 4;
    const fallbackRow = Math.floor(index / 4) % 4;
    const id = drawing.nextNodeId++;
    const label = nextNodeLabel(index);
    const x = roomy ? bounds.width * roomy[0] : 80 + fallbackCol * 150;
    const y = roomy ? bounds.height * roomy[1] : 80 + fallbackRow * 125;
    drawing.nodes.push({ id, label, x: clamp(x, 48, bounds.width - 48), y: clamp(y, 48, bounds.height - 48), r: 32, color: colors[0].value });
    if (drawing.nodes.length > 8) arrangeLargeDrawing();
    saveDrawing();
    render();
    select({ type: "node", id });
    announce(`Node ${label} added.`);
  }

  function nextNodeLabel(index) {
    const used = new Set(drawing.nodes.map(node => String(node.label)));
    const pattern = String(nodeLabelFormat.pattern || "");
    const firstUnused = makeLabel => { let value = 0; while (used.has(makeLabel(value))) value++; return makeLabel(value); };
    if (pattern === "^[A-Z]$") return firstUnused(value => String.fromCharCode(65 + value));
    if (pattern.startsWith("^root(?:")) return !used.has("root=[]") ? "root=[]" : firstUnused(value => `root[${value}]=[]`);
    if (pattern.startsWith("^(?:outer array")) return !used.has("outer array") ? "outer array" : firstUnused(value => `[${value}] array`);
    if (pattern === "^(?:empty prefix|[a-z]+)$") return !used.has("empty prefix") ? "empty prefix" : firstUnused(value => String.fromCharCode(97 + value));
    if (pattern === "^(?:start|[a-z]+)$") return !used.has("start") ? "start" : firstUnused(value => String.fromCharCode(97 + value));
    if (pattern === "^\\d+:(?:true|false|AND|OR)$") return firstUnused(value => value === 0 ? "0:AND" : `${value}:false`);
    if (pattern === "^node \\d+: -?\\d+$") return firstUnused(value => `node ${value}: 0`);
    if (pattern === "^\\d+:[A-Za-z]$") return firstUnused(value => `${value}:a`);
    if (pattern === "^\\d+:\\d+g$") return firstUnused(value => `${value}:0g`);
    if (pattern === "^\\d+:\\d+$") return firstUnused(value => `${value + 1}:0`);
    if (pattern === "^\\d+:-?\\d+$") return firstUnused(value => `${value + 1}:0`);
    if (pattern === "^row \\d+: \\{[^{}]*\\}$") return firstUnused(value => `row ${value}: {}`);
    if (pattern === "^\\d+:\\(-?\\d+,-?\\d+\\)$") return firstUnused(value => `${value}:(0,0)`);
    if (pattern === "^\\d+: \\(-?\\d+,-?\\d+\\) p=\\d+$") return firstUnused(value => `${value}: (0,0) p=0`);
    if (["contiguous-zero", "nonnegative-integer"].includes(nodeLabelRule)) {
      let value = 0; while (used.has(String(value))) value++; return String(value);
    }
    if (["contiguous-one", "positive-integer"].includes(nodeLabelRule)) {
      let value = 1; while (used.has(String(value))) value++; return String(value);
    }
    if (["coordinate", "state-pair", "interior-coordinate"].includes(nodeLabelRule)) {
      if (nodeLabelRule === "interior-coordinate") {
        let column = 1; while (used.has(`(1,${column})`)) column++; return `(1,${column})`;
      }
      let column = 0; while (used.has(`(0,${column})`)) column++; return `(0,${column})`;
    }
    if (nodeLabelRule === "identifier") {
      let value = 0; while (used.has(String.fromCharCode(97 + value))) value++; return String.fromCharCode(97 + value);
    }
    if (nodeLabelRule === "nested-path") {
      if (!used.has("root")) return "root";
      let value = 0; while (used.has(`root[${value}]`)) value++; return `root[${value}]`;
    }
    if (nodeLabelRule === "tree-path") {
      const labels = ["root", "L", "R", "LL", "LR", "RL", "RR", "LLL"];
      return labels.find(label => !used.has(label));
    }
    if (nodeLabelRule === "partial-string") {
      if (!used.has("ε")) return "ε";
      let value = 0; while (used.has(String.fromCharCode(97 + value))) value++; return String.fromCharCode(97 + value);
    }
    let value = index; while (used.has(String.fromCharCode(65 + value))) value++; return String.fromCharCode(65 + value);
  }

  function arrangeLargeDrawing() {
    const bounds = boardBounds();
    const columns = Math.ceil(Math.sqrt(drawing.nodes.length));
    const rows = Math.ceil(drawing.nodes.length / columns);
    drawing.nodes.forEach((node, index) => {
      const column = index % columns, row = Math.floor(index / columns);
      node.x = columns === 1 ? bounds.width / 2 : 66 + column * (bounds.width - 132) / (columns - 1);
      node.y = rows === 1 ? bounds.height / 2 : 66 + row * (bounds.height - 132) / (rows - 1);
    });
  }

  function nodePositionPreset() {
    const presets = [
      [[.12,.50],[.32,.20],[.32,.80],[.56,.20],[.56,.80],[.82,.50],[.82,.18],[.82,.82]],
      [[.12,.20],[.34,.78],[.55,.22],[.78,.78],[.88,.28],[.60,.52],[.34,.46],[.12,.82]],
      [[.50,.12],[.78,.22],[.88,.50],[.76,.80],[.50,.88],[.24,.80],[.12,.50],[.24,.22]],
      [[.22,.14],[.76,.14],[.22,.38],[.76,.38],[.22,.64],[.76,.64],[.22,.86],[.76,.86]],
      [[.10,.20],[.36,.20],[.64,.20],[.90,.20],[.10,.78],[.36,.78],[.64,.78],[.90,.78]],
      [[.12,.12],[.88,.88],[.88,.12],[.12,.88],[.50,.50],[.50,.16],[.50,.84],[.82,.50]],
      [[.16,.18],[.48,.14],[.78,.24],[.84,.54],[.68,.82],[.36,.84],[.16,.66],[.38,.46]],
      [[.50,.50],[.12,.18],[.50,.10],[.88,.18],[.90,.66],[.66,.88],[.28,.88],[.10,.62]]
    ];
    const key = contextKey.replace(/:(?:correct|mistaken)$/, "");
    const markers = [
      [":case-1:",0],[":case-2:",1],[":case-3:",2],[":case-4:",3],
      [":repair-1:",4],[":repair-2:",5],[":repair-3:",6],[":repair-4:",7],[":repair-5:",0],
      [":counterexample:0",4],[":counterexample:1",5],[":counterexample:2",6],
      [":structure-transfer",7],[":reasoning:main",3]
    ];
    const markerIndex = markers.find(([marker]) => key.includes(marker))?.[1];
    let hash = 2166136261;
    for (const char of key) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    let problemHash = 2166136261;
    for (const char of key.split(":")[0]) {
      problemHash ^= char.charCodeAt(0);
      problemHash = Math.imul(problemHash, 16777619);
    }
    const rotation = Math.abs(problemHash) % presets.length;
    return presets[markerIndex === undefined ? Math.abs(hash) % presets.length : (markerIndex + rotation) % presets.length];
  }

  function clearDrawing() {
    if (isLocked()) return;
    if (!drawing.nodes.length && !drawing.edges.length) return announce("The canvas is already empty.");
    if (clearButton.dataset.confirm !== "true") {
      clearButton.dataset.confirm = "true";
      clearButton.textContent = "Clear again";
      announce("Press Clear again to remove the whole graph.");
      clearTimeout(clearTimer);
      clearTimer = setTimeout(resetClearButton, 2500);
      return;
    }
    drawing = blankDrawing();
    selected = null;
    connectFrom = null;
    lastNodeClick = null;
    directed.checked = false;
    saveDrawing();
    render();
    resetClearButton();
    announce("Graph cleared.");
  }

  function resetClearButton() {
    clearButton.dataset.confirm = "false";
    clearButton.textContent = "Clear";
  }

  function onPointerDown(event) {
    if (isLocked()) return;
    if (event.target.closest("#graph-color-menu, #graph-rename")) return;
    closeColorMenu();
    if (event.button !== 0) return;
    const nodeElement = event.target.closest("[data-node-id]");
    const edgeElement = event.target.closest("[data-edge-id]");
    const point = svgPoint(event);
    const nodeId = nodeElement ? Number(nodeElement.dataset.nodeId) : null;
    const isDoubleClick = nodeId !== null && lastNodeClick?.id === nodeId && performance.now() - lastNodeClick.time < 450;
    if (nodeElement && (event.detail === 2 || isDoubleClick)) {
      interaction = null;
      connectFrom = null;
      lastNodeClick = null;
      event.preventDefault();
      openRename("node", nodeId);
      return;
    }
    if (nodeElement) {
      const id = nodeId;
      const node = findNode(id);
      interaction = { type: "move", id, dx: point.x - node.x, dy: point.y - node.y, startX: point.x, startY: point.y, moved: false, pointerId: event.pointerId };
      selectWithoutRender({ type: "node", id });
    } else if (edgeElement) {
      lastNodeClick = null;
      select({ type: "edge", id: Number(edgeElement.dataset.edgeId) });
      return;
    } else {
      const wasConnecting = connectFrom !== null;
      connectFrom = null;
      lastNodeClick = null;
      select(null);
      if (wasConnecting) announce("Edge canceled.");
      return;
    }
    board.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (isLocked()) return;
    if (!interaction || interaction.pointerId !== event.pointerId) return;
    const point = svgPoint(event);
    const bounds = boardBounds();
    if (Math.hypot(point.x - interaction.startX, point.y - interaction.startY) < 3) return;
    interaction.moved = true;
    const node = findNode(interaction.id);
    node.x = clamp(point.x - interaction.dx, node.r + 8, bounds.width - node.r - 8);
    node.y = clamp(point.y - interaction.dy, node.r + 8, bounds.height - node.r - 8);
    render();
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (isLocked()) return;
    if (!interaction || interaction.pointerId !== event.pointerId) return;
    const finished = interaction;
    interaction = null;
    board.releasePointerCapture?.(event.pointerId);
    if (finished.moved) {
      lastNodeClick = null;
      saveDrawing();
      render();
      return;
    }
    lastNodeClick = { id: finished.id, time: performance.now() };
    chooseConnectNode(finished.id);
  }

  function cancelInteraction() {
    interaction = null;
    lastNodeClick = null;
    render();
  }

  function createConnection(fromId, targetId) {
    const target = findNode(targetId);
    if (!target || target.id === fromId) return announce("Choose a different second node.");
    const duplicate = drawing.edges.some(edge => drawing.directed
      ? edge.from === fromId && edge.to === target.id
      : (edge.from === fromId && edge.to === target.id) || (edge.from === target.id && edge.to === fromId));
    if (duplicate) { render(); return announce("Those nodes are already connected."); }
    const edge = { id: drawing.nextEdgeId++, from: fromId, to: target.id, label: "", color: colors[1].value, width: defaultWidth };
    drawing.edges.push(edge);
    saveDrawing();
    render();
    select({ type: "edge", id: edge.id });
    focusItem("edge", edge.id);
    announce(`Connected ${findNode(fromId).label} to ${target.label}.`);
  }

  function chooseConnectNode(id) {
    if (connectFrom === null) {
      connectFrom = id;
      selected = { type: "node", id };
      announce("Now click the second node.");
      render();
      queueMicrotask(() => svg.querySelector(`.scratch-node[data-node-id="${id}"]`)?.focus());
      return;
    }
    const fromId = connectFrom;
    connectFrom = null;
    createConnection(fromId, id);
  }

  function onDoubleClick(event) {
    const nodeElement = event.target.closest("[data-node-id]");
    const edgeElement = event.target.closest("[data-edge-id]");
    if (!nodeElement && !edgeElement) return;
    event.preventDefault();
    if (nodeElement) openRename("node", Number(nodeElement.dataset.nodeId));
    else openRename("edge", Number(edgeElement.dataset.edgeId));
  }

  function openRename(type, id) {
    if (isLocked()) return;
    const item = type === "node" ? findNode(id) : findEdge(id);
    if (!item) return;
    connectFrom = null;
    lastNodeClick = null;
    renameTarget = { type, id };
    returnFocusTarget = { type, id };
    renameInput.value = item.label || "";
    const bounds = boardBounds();
    const from = type === "edge" ? findNode(item.from) : item;
    const to = type === "edge" ? findNode(item.to) : item;
    rename.style.left = `${clamp((from.x + to.x) / 2, 105, bounds.width - 105)}px`;
    rename.style.top = `${clamp((from.y + to.y) / 2 + (type === "node" ? item.r + 12 : 18), 64, bounds.height - 84)}px`;
    rename.querySelector("label").textContent = type === "node" ? "Node name" : "Edge label";
    rename.hidden = false;
    announce(type === "node" ? "Rename the node, then press Enter." : "Rename the edge, then press Enter.");
    requestAnimationFrame(() => { renameInput.focus(); renameInput.select(); });
  }

  function saveRename() {
    const item = renameTarget?.type === "node" ? findNode(renameTarget.id) : findEdge(renameTarget?.id);
    if (!item) return closeRename();
    const renamedType = renameTarget.type;
    const renamedId = renameTarget.id;
    const value = renameInput.value.trim().slice(0, 24);
    if (!value && renameTarget.type === "node") { announce("A node name cannot be empty."); renameInput.focus(); return; }
    item.label = value;
    saveDrawing();
    closeRename();
    render();
    focusItem(renamedType, renamedId);
    announce(renamedType === "edge" ? `Edge labeled ${value || "blank"}.` : `Node renamed ${value}.`);
  }

  function closeRename(restoreFocus = false) {
    if (!rename) return;
    rename.hidden = true;
    renameTarget = null;
    if (restoreFocus && returnFocusTarget) focusItem(returnFocusTarget.type, returnFocusTarget.id);
  }

  function onContextMenu(event) {
    const nodeElement = event.target.closest("[data-node-id]");
    const edgeElement = event.target.closest("[data-edge-id]");
    if (!nodeElement && !edgeElement) return;
    event.preventDefault();
    const rect = board.getBoundingClientRect();
    if (nodeElement) {
      const id = Number(nodeElement.dataset.nodeId);
      select({ type: "node", id });
      openColorMenu("node", id, event.clientX - rect.left, event.clientY - rect.top);
    } else {
      const id = Number(edgeElement.dataset.edgeId);
      select({ type: "edge", id });
      openColorMenu("edge", id, event.clientX - rect.left, event.clientY - rect.top);
    }
  }

  function openColorMenu(type, id, x, y) {
    if (isLocked()) return;
    returnFocusTarget = { type, id };
    colorMenu.innerHTML = "";
    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.className = "graph-menu-action";
    renameButton.textContent = type === "node" ? "Rename node" : "Rename edge";
    renameButton.addEventListener("click", event => {
      event.stopPropagation();
      closeColorMenu();
      openRename(type, id);
    });
    colorMenu.append(renameButton);
    colors.forEach(color => {
      const button = document.createElement("button");
      button.type = "button";
      button.title = color.name;
      button.setAttribute("aria-label", color.name);
      button.textContent = color.name;
      button.style.setProperty("--swatch", color.value);
      button.addEventListener("click", event => {
        event.stopPropagation();
        const item = type === "node" ? findNode(id) : findEdge(id);
        if (!item) return;
        item.color = color.value;
        saveDrawing();
        closeColorMenu();
        render();
        const edited = svg.querySelector(type === "node" ? `.scratch-node[data-node-id="${id}"]` : `.scratch-edge[data-edge-id="${id}"]`);
        edited?.focus();
        announce(`${type === "node" ? "Node" : "Edge"} color changed to ${color.name}.`);
      });
      colorMenu.append(button);
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "graph-delete-item";
    deleteButton.textContent = type === "node" ? "Delete node" : "Delete edge";
    deleteButton.addEventListener("click", event => {
      event.stopPropagation();
      deleteItem(type, id);
      closeColorMenu();
    });
    colorMenu.append(deleteButton);
    const bounds = boardBounds();
    colorMenu.style.left = `${clamp(x, 150, bounds.width - 150)}px`;
    colorMenu.style.top = `${clamp(y, 34, bounds.height - 34)}px`;
    colorMenu.hidden = false;
    colorMenu.querySelector("button")?.focus();
  }

  function closeColorMenu(restoreFocus = false) {
    if (colorMenu) colorMenu.hidden = true;
    if (restoreFocus && returnFocusTarget) focusItem(returnFocusTarget.type, returnFocusTarget.id);
  }

  function onKeyDown(event) {
    if (isLocked()) return;
    if (event.key === "Escape") {
      const focusTarget = returnFocusTarget || selected;
      closeColorMenu();
      closeRename();
      if (connectFrom !== null) {
        connectFrom = null;
        announce("First node cleared. Pick any first node.");
      }
      if (focusTarget) {
        select(focusTarget);
        focusItem(focusTarget.type, focusTarget.id);
      }
      return;
    }
    if (!selected || event.target.matches("input, textarea")) return;
    const item = selected.type === "node" ? findNode(selected.id) : findEdge(selected.id);
    if (!item) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeSelected();
      return;
    }
    if (selected.type === "node" && event.key === "Enter") {
      event.preventDefault(); chooseConnectNode(selected.id); return;
    }
    if ((selected.type === "edge" && (event.key === "Enter" || event.key === "F2")) || (selected.type === "node" && event.key === "F2")) {
      event.preventDefault(); openRename(selected.type, selected.id); return;
    }
    if (selected.type === "node" && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const amount = event.shiftKey ? 10 : 2;
      if (event.key === "ArrowLeft") item.x -= amount;
      if (event.key === "ArrowRight") item.x += amount;
      if (event.key === "ArrowUp") item.y -= amount;
      if (event.key === "ArrowDown") item.y += amount;
      clampNode(item); saveDrawing(); render(); focusItem("node", item.id);
    }
  }

  function removeSelected() {
    if (!selected) return;
    deleteItem(selected.type, selected.id);
  }

  function deleteItem(type, id) {
    if (type === "node") {
      const node = findNode(id);
      drawing.nodes = drawing.nodes.filter(item => item.id !== id);
      drawing.edges = drawing.edges.filter(edge => edge.from !== id && edge.to !== id);
      if (connectFrom === id) {
        connectFrom = null;
      }
      announce(`Node ${node?.label || ""} deleted.`);
    } else {
      drawing.edges = drawing.edges.filter(edge => edge.id !== id);
      announce("Edge deleted.");
    }
    selected = null; saveDrawing(); render();
    queueMicrotask(() => document.querySelector("#graph-add-node")?.focus());
  }

  function select(value) {
    selected = value;
    colorButton.disabled = !selected;
    labelButton.disabled = !selected;
    render();
  }

  function selectWithoutRender(value) {
    selected = value;
    colorButton.disabled = !selected;
    labelButton.disabled = !selected;
    svg.querySelectorAll(".scratch-node, .scratch-edge").forEach(element => element.classList.remove("selected"));
    if (value?.type === "node") svg.querySelector(`.scratch-node[data-node-id="${value.id}"]`)?.classList.add("selected");
    if (value?.type === "edge") svg.querySelector(`.scratch-edge[data-edge-id="${value.id}"]`)?.classList.add("selected");
  }

  function render() {
    if (!enabled || !svg || !contextKey) return;
    const bounds = boardBounds();
    if (board.clientWidth > 0) {
      const previous = drawing.viewport || {
        width: Math.max(bounds.width, ...drawing.nodes.map(node => node.x + node.r + 16)),
        height: Math.max(bounds.height, ...drawing.nodes.map(node => node.y + node.r + 16))
      };
      if (previous.width !== bounds.width || previous.height !== bounds.height) {
        for (const node of drawing.nodes) {
          const margin = node.r + 12;
          node.x = margin + (node.x - margin) * (bounds.width - margin * 2) / Math.max(1, previous.width - margin * 2);
          node.y = margin + (node.y - margin) * (bounds.height - margin * 2) / Math.max(1, previous.height - margin * 2);
          clampNode(node);
        }
      }
      drawing.viewport = bounds;
      if (contextKey) writeValue(`dfs-drawing:v1:${contextKey}`, JSON.stringify(drawing));
    }
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    svg.innerHTML = "";

    drawing.edges.forEach((edge, index) => renderEdge(edge, index));
    drawing.nodes.forEach(node => renderNode(node));
    empty.hidden = drawing.nodes.length > 0;
    directed.checked = drawing.directed;
    colorButton.disabled = !selected;
    labelButton.disabled = !selected;
  }

  function renderEdge(edge, index) {
    const from = findNode(edge.from), to = findNode(edge.to);
    if (!from || !to) return;
    const geometry = connectedGeometry(from, to, drawing.directed, edge.width);
    const colorName = colors.find(color => color.value.toLowerCase() === edge.color.toLowerCase())?.name || "colored";
    const relation = drawing.directed ? `Directed ${colorName} edge from ${from.label} to ${to.label}` : `Two-way ${colorName} edge between ${from.label} and ${to.label}`;
    const showsOrder = /:(first-branch|last-branch|drop-last-edge)(?::|$)/.test(contextKey);
    const edgeLabel = `${edge.label ? `${relation}, labeled ${edge.label}` : relation}${showsOrder ? `, drawing order ${index + 1}` : ""}`;
    const group = svgElement("g", { "data-edge-id": edge.id, class: selected?.type === "edge" && selected.id === edge.id ? "scratch-edge selected" : "scratch-edge", tabindex: isLocked() ? "-1" : "0", role: "button", "aria-disabled": isLocked(), "aria-label": `${edgeLabel}. Press F2 to rename or Delete to remove.` });
    group.append(svgElement("path", { class: "scratch-edge-hit", d: geometry.hitPath, "data-edge-id": edge.id }));
    group.append(svgElement("path", { class: "scratch-edge-line", d: geometry.linePath, stroke: edge.color, "stroke-width": edge.width, "stroke-linecap": drawing.directed ? "butt" : "round", "data-edge-id": edge.id }));
    if (geometry.arrowPoints) group.append(svgElement("polygon", { class: "scratch-edge-arrow", points: geometry.arrowPoints, fill: edge.color, "data-edge-id": edge.id }));
    if (edge.label) {
      const label = svgElement("text", { class: "scratch-edge-label", x: geometry.labelPoint.x, y: geometry.labelPoint.y - 9, "data-edge-id": edge.id });
      label.textContent = edge.label;
      group.append(label);
    }
    if (showsOrder) {
      const order = svgElement("text", { class: "scratch-edge-order", x: geometry.labelPoint.x, y: geometry.labelPoint.y + (edge.label ? 13 : -9), "data-edge-id": edge.id });
      order.textContent = `#${index + 1}`;
      group.append(order);
    }
    svg.append(group);
  }

  function renderNode(node) {
    const isSelected = selected?.type === "node" && selected.id === node.id;
    const enterAction = connectFrom === null ? "Press Enter to choose it as the first node." : "Press Enter to connect it as the second node.";
    const group = svgElement("g", { class: `scratch-node${isSelected ? " selected" : ""}`, "data-node-id": node.id, transform: `translate(${node.x} ${node.y})`, tabindex: isLocked() ? "-1" : "0", role: "button", "aria-disabled": isLocked(), "aria-label": `Node ${node.label}. ${enterAction} Press F2 to rename, arrows to move, or Delete to remove.` });
    group.append(svgElement("circle", { class: "scratch-node-body", r: node.r, fill: "#151e29", stroke: node.color, "data-node-id": node.id }));
    const text = svgElement("text", { class: "scratch-node-label", "data-node-id": node.id });
    // Keep the path and value visible: nested items often share the same prefix.
    const lines = node.label.match(/.{1,10}/g) || [""];
    lines.forEach((line, index) => {
      const part = svgElement("tspan", { x: 0, y: (index - (lines.length - 1) / 2) * 13 });
      part.textContent = line;
      text.append(part);
    });
    if (node.label.length > 7) text.style.fontSize = "11px";
    group.append(text);
    svg.append(group);
  }

  function connectedGeometry(from, to, isDirected, width) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    if (length - from.r - to.r < 34) {
      const angle = Math.atan2(dy, dx);
      const curveAngle = .72;
      const startRadius = from.r + 5;
      const endRadius = to.r + 7;
      const x1 = from.x + Math.cos(angle - curveAngle) * startRadius;
      const y1 = from.y + Math.sin(angle - curveAngle) * startRadius;
      const x2 = to.x + Math.cos(angle + Math.PI + curveAngle) * endRadius;
      const y2 = to.y + Math.sin(angle + Math.PI + curveAngle) * endRadius;
      const normalX = -dy / length, normalY = dx / length;
      const lift = Math.max(48, Math.min(90, (from.r + to.r) * .75));
      const cx = (from.x + to.x) / 2 - normalX * lift;
      const cy = (from.y + to.y) / 2 - normalY * lift;
      const hitPath = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      const labelPoint = quadraticPoint({ x: x1, y: y1 }, { x: cx, y: cy }, { x: x2, y: y2 }, .5);
      if (!isDirected) return { linePath: hitPath, hitPath, arrowPoints: null, labelPoint };
      return { ...directedGeometry({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: cx, y: cy }, width, hitPath), labelPoint };
    }
    const start = from.r + 7;
    const end = to.r + 7;
    const startPoint = { x: from.x + dx / length * start, y: from.y + dy / length * start };
    const endPoint = { x: to.x - dx / length * end, y: to.y - dy / length * end };
    const otherNodes = drawing.nodes.filter(node => node.id !== from.id && node.id !== to.id);
    const needsDetour = otherNodes.some(node => pointToSegmentDistance(node, startPoint, endPoint) < node.r + 10);
    if (needsDetour) {
      const control = safestCurveControl(startPoint, endPoint, otherNodes);
      const hitPath = `M ${startPoint.x} ${startPoint.y} Q ${control.x} ${control.y} ${endPoint.x} ${endPoint.y}`;
      const labelPoint = quadraticPoint(startPoint, control, endPoint, .5);
      if (!isDirected) return { linePath: hitPath, hitPath, arrowPoints: null, labelPoint };
      return { ...directedGeometry(startPoint, endPoint, control, width, hitPath), labelPoint };
    }
    const hitPath = pathLine({ x1: startPoint.x, y1: startPoint.y, x2: endPoint.x, y2: endPoint.y });
    const labelPoint = { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 };
    if (!isDirected) return { linePath: hitPath, hitPath, arrowPoints: null, labelPoint };
    return { ...directedGeometry(startPoint, endPoint, startPoint, width, hitPath), labelPoint };
  }

  function safestCurveControl(start, end, otherNodes) {
    const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy) || 1;
    const normal = { x: -dy / length, y: dx / length };
    const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const bounds = boardBounds();
    const candidates = [];
    for (const lift of [70, 100, 135, 175, 215]) for (const sign of [-1, 1]) {
      candidates.push({
        x: clamp(middle.x + normal.x * lift * sign, 38, bounds.width - 38),
        y: clamp(middle.y + normal.y * lift * sign, 38, bounds.height - 38)
      });
    }
    return candidates.map(control => ({ control, score: curveClearance(start, control, end, otherNodes) })).sort((one, two) => two.score - one.score)[0].control;
  }

  function curveClearance(start, control, end, otherNodes) {
    let clearance = Infinity;
    for (let step = 1; step < 30; step++) {
      const point = quadraticPoint(start, control, end, step / 30);
      for (const node of otherNodes) clearance = Math.min(clearance, Math.hypot(point.x - node.x, point.y - node.y) - node.r);
    }
    return clearance;
  }

  function quadraticPoint(start, control, end, amount) {
    const inverse = 1 - amount;
    return {
      x: inverse * inverse * start.x + 2 * inverse * amount * control.x + amount * amount * end.x,
      y: inverse * inverse * start.y + 2 * inverse * amount * control.y + amount * amount * end.y
    };
  }

  function pointToSegmentDistance(point, start, end) {
    const dx = end.x - start.x, dy = end.y - start.y, squared = dx * dx + dy * dy;
    const amount = squared ? Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / squared)) : 0;
    return Math.hypot(point.x - (start.x + amount * dx), point.y - (start.y + amount * dy));
  }

  function directedGeometry(start, tip, tangentFrom, width, hitPath) {
    const tangentX = tip.x - tangentFrom.x, tangentY = tip.y - tangentFrom.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const ux = tangentX / tangentLength, uy = tangentY / tangentLength;
    const arrowLength = Math.max(14, width * 2.25);
    const arrowHalfWidth = Math.max(7, width * 1.25);
    const base = { x: tip.x - ux * arrowLength, y: tip.y - uy * arrowLength };
    const shaftEnd = { x: base.x + ux, y: base.y + uy };
    const nx = -uy, ny = ux;
    const arrowPoints = `${tip.x},${tip.y} ${base.x + nx * arrowHalfWidth},${base.y + ny * arrowHalfWidth} ${base.x - nx * arrowHalfWidth},${base.y - ny * arrowHalfWidth}`;
    const isCurve = tangentFrom.x !== start.x || tangentFrom.y !== start.y;
    const linePath = isCurve
      ? `M ${start.x} ${start.y} Q ${tangentFrom.x} ${tangentFrom.y} ${shaftEnd.x} ${shaftEnd.y}`
      : pathLine({ x1: start.x, y1: start.y, x2: shaftEnd.x, y2: shaftEnd.y });
    return { linePath, hitPath, arrowPoints };
  }

  function pathLine(line) { return `M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`; }
  function findNode(id) { return drawing.nodes.find(node => node.id === Number(id)); }
  function findEdge(id) { return drawing.edges.find(edge => edge.id === Number(id)); }
  function distance(point, node) { return Math.hypot(point.x - node.x, point.y - node.y); }

  function svgPoint(event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX; point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    return matrix ? point.matrixTransform(matrix.inverse()) : { x: event.offsetX, y: event.offsetY };
  }

  function boardBounds() {
    return { width: Math.max(board?.clientWidth || 720, 320), height: Math.max(board?.clientHeight || 520, 420) };
  }

  function clampNode(node) {
    const bounds = boardBounds();
    node.x = clamp(node.x, node.r + 8, bounds.width - node.r - 8);
    node.y = clamp(node.y, node.r + 8, bounds.height - node.r - 8);
  }

  function saveDrawing() {
    if (contextKey) writeValue(`dfs-drawing:v1:${contextKey}`, JSON.stringify(drawing));
    window.dispatchEvent(new CustomEvent("dfs-graph-change"));
  }

  function updateWidthOutput() {
    widthOutput.value = `${defaultWidth}px`;
    widthOutput.textContent = `${defaultWidth}px`;
    widthInput.style.setProperty("--edge-preview", `${defaultWidth}px`);
  }

  function announce(message) {
    status.textContent = message;
    clearTimeout(announce.timer);
    announce.timer = setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 3500);
  }

  function isLocked() { return lab?.classList.contains("locked"); }

  function focusItem(type, id) {
    queueMicrotask(() => svg.querySelector(type === "node"
      ? `.scratch-node[data-node-id="${id}"]`
      : `.scratch-edge[data-edge-id="${id}"]`)?.focus());
  }

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function validColor(value) { return colors.some(color => color.value === value) ? value : colors[0].value; }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function readValue(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
  function writeValue(key, value) { try { localStorage.setItem(key, value); } catch {} }
})();
