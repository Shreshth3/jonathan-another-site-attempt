const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;
const failures = [];
const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let file = path.join(root, pathname.replace(/^\//, ""));
  if (!path.extname(file) || !fs.existsSync(file)) file = path.join(root, "index.html");
  response.setHeader("content-type", contentTypes[path.extname(file)] || "application/octet-stream");
  response.end(fs.readFileSync(file));
});

function casesFor(problem) {
  const cases = problem.lesson.buildTasks.map(task => ({ label: `build:${task.id}`, context: `${problem.id}:${task.id}:main`, canvas: task.canvas }));
  for (const task of problem.lesson.conceptTasks) if (task.remedial?.canvas) {
    cases.push({ label: `repair:${task.remedial.id}`, context: `${problem.id}:${task.remedial.id}:${task.id}`, canvas: task.remedial.canvas });
  }
  if (problem.codeReasoning?.canvas) cases.push({ label: "step4", context: `${problem.id}:reasoning:main`, canvas: problem.codeReasoning.canvas });
  return cases;
}

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  for (const problem of problems) {
    await page.goto(`http://127.0.0.1:${port}/${problem.id}`);
    const collisions = await page.evaluate(cases => {
      const output = [];
      const addButton = document.querySelector("#graph-add-node");
      for (const item of cases) {
        window.DFS_GRAPH.setContext(item.context, 0);
        for (let index = 0; index < item.canvas.nodes.length; index++) addButton.click();
        const snapshot = window.DFS_GRAPH.getSnapshot();
        const expectedIndex = Object.fromEntries(item.canvas.nodes.map((node, index) => [String(node.id), index]));
        snapshot.nodes = snapshot.nodes.map((node, index) => ({ ...node, label: String(item.canvas.nodes[index].label), color: item.canvas.nodes[index].color || node.color }));
        snapshot.edges = item.canvas.edges.map((edge, index) => ({
          id: index,
          from: snapshot.nodes[expectedIndex[String(edge.from)]].id,
          to: snapshot.nodes[expectedIndex[String(edge.to)]].id,
          color: edge.color || "#8392a8",
          label: String(edge.label || ""),
          width: 4
        }));
        snapshot.nextEdgeId = snapshot.edges.length;
        snapshot.directed = item.canvas.directed;
        window.DFS_GRAPH.setSnapshot(snapshot);

        for (const path of document.querySelectorAll(".scratch-edge-line")) {
          const edgeId = Number(path.dataset.edgeId);
          const edge = snapshot.edges.find(candidate => candidate.id === edgeId);
          const length = path.getTotalLength();
          for (const node of snapshot.nodes) {
            if (node.id === edge.from || node.id === edge.to) continue;
            let nearest = Infinity;
            for (let step = 0; step <= 80; step++) {
              const point = path.getPointAtLength(length * step / 80);
              nearest = Math.min(nearest, Math.hypot(point.x - node.x, point.y - node.y));
            }
            if (nearest < node.r + 4) output.push({ label: item.label, edge: `${edge.from}-${edge.to}`, node: node.label, nearest: nearest.toFixed(1) });
          }
        }
      }
      return output;
    }, casesFor(problem));
    collisions.forEach(collision => failures.push(`${problem.id}/${collision.label}: edge ${collision.edge} crosses node ${collision.node} (${collision.nearest}px)`));
  }

  await browser.close();
  server.close();
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("Checked default scratch-graph edge routing for every authored Step 1 repair/build and Step 4 canvas.");
})().catch(error => {
  server.close();
  console.error(error);
  process.exit(1);
});
