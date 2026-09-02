const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA?.problems || [];
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function serve(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const requested = pathname === "/" || !path.extname(pathname) ? "index.html" : pathname.slice(1);
  const file = path.resolve(root, requested);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": mimeTypes[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
}

(async () => {
  const externalBaseUrl = process.env.STEP1_BASE_URL?.replace(/\/$/, "");
  const server = externalBaseUrl ? null : http.createServer(serve);
  if (server) await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = externalBaseUrl || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  try {
    for (const problem of problems) {
      await page.goto(`${baseUrl}/${encodeURIComponent(problem.id)}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#challenge .visual-build-question");
      const firstBuild = problem.lesson?.buildTasks?.[0];
      const result = await page.evaluate(() => ({
        challengeText: document.querySelector("#challenge")?.textContent || "",
        lockedContracts: document.querySelectorAll("#challenge .locked-contract, #challenge .feedback-scheme, #challenge .mini-graph").length,
        drawing: window.DFS_GRAPH?.getSnapshot?.() || { nodes: [], edges: [] }
      }));
      const forbidden = [
        ["CORRECT GRAPH MODEL", "correct-model box"],
        ["Use these exact names", "exact node-name list"],
        [problem.graphRules?.nodes, "correct node rule"],
        [problem.graphRules?.edges, "correct edge rule"],
        [firstBuild?.title, "authored hint title"],
        [firstBuild?.prompt, "authored hint prompt"]
      ];
      for (const [text, label] of forbidden) {
        if (String(text || "").trim() && result.challengeText.includes(String(text).trim())) errors.push(`${problem.id}: Step 1 shows ${label}`);
      }
      if (result.lockedContracts) errors.push(`${problem.id}: Step 1 renders ${result.lockedContracts} answer-model visual(s)`);
      const requiredGuide = problem.graphRules?.nodeLabelFormat?.instruction;
      const visibleGuide = String(requiredGuide || "").replace(/`/g, "");
      if (!visibleGuide || !result.challengeText.includes(visibleGuide)) errors.push(`${problem.id}: Step 1 hides the required node-name format`);
      if (result.drawing.nodes.length || result.drawing.edges.length) errors.push(`${problem.id}: Step 1 starts with a prewritten graph`);
    }
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`Verified blank, answer-free first builds for all ${problems.length} problems.`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
