// Light visual pass: a handful of screenshots (desktop + phone) of the real site served locally.
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("/Users/shreshth/git-repos/try-5.4-computer-use/node_modules/playwright");
const ROOT = "/Users/shreshth/git-repos/jonathan-another-site-attempt";
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });
const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  let file = path.join(ROOT, pathname.replace(/^\//, ""));
  if (!path.extname(file) || !fs.existsSync(file)) file = path.join(ROOT, "index.html");
  res.setHeader("content-type", contentTypes[path.extname(file)] || "application/octet-stream");
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const notes = [];
  const shoot = async (page, name) => { await page.screenshot({ path: path.join(OUT, name + ".png"), fullPage: true }); };
  // Desktop
  let ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  let page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`); await shoot(page, "01-picker-desktop");
  notes.push("picker text: " + (await page.locator("main.home").innerText()).slice(0, 400).replace(/\n/g, " | "));
  await page.goto(`http://127.0.0.1:${port}/find-if-path-exists-in-graph`); await shoot(page, "02-step1-build-desktop");
  // draw two nodes by clicking Add node twice, connect them by clicking node 0 then node 1 (real interactions)
  await page.getByRole("button", { name: /Add node/ }).click(); await page.getByRole("button", { name: /Add node/ }).click();
  await page.locator('.scratch-node[data-node-id="0"]').click(); await page.locator('.scratch-node[data-node-id="1"]').click();
  notes.push("status after connecting: " + await page.locator("#graph-status").innerText());
  await shoot(page, "03-step1-after-drawing-two-nodes");
  // rename via double click
  await page.locator('.scratch-node[data-node-id="1"]').dblclick();
  notes.push("rename box visible after dblclick: " + !(await page.locator("#graph-rename").isHidden()));
  await page.keyboard.press("Escape");
  // right-click menu
  await page.locator('.scratch-node[data-node-id="0"]').click({ button: "right" });
  notes.push("context menu items: " + (await page.locator("#graph-color-menu").innerText()).replace(/\n/g, " | "));
  await shoot(page, "04-step1-context-menu");
  await page.keyboard.press("Escape");
  await page.goto(`http://127.0.0.1:${port}/find-if-path-exists-in-graph?section=2`); await shoot(page, "05-step2-desktop");
  // Step 2 last-branch round: skip to round 2 (first-branch) and draw edges to check order badges
  await page.getByRole("button", { name: /Skip to next question/ }).click();
  await page.getByRole("button", { name: /Add node/ }).click(); await page.getByRole("button", { name: /Add node/ }).click(); await page.getByRole("button", { name: /Add node/ }).click();
  await page.locator('.scratch-node[data-node-id="0"]').click(); await page.locator('.scratch-node[data-node-id="1"]').click();
  await page.locator('.scratch-node[data-node-id="0"]').click(); await page.locator('.scratch-node[data-node-id="2"]').click();
  notes.push("edge order badges in first-branch round: " + (await page.locator(".scratch-edge-order").allTextContents()).join(","));
  await shoot(page, "06-step2-first-branch-with-edges");
  await page.goto(`http://127.0.0.1:${port}/network-delay-time?section=3`); await shoot(page, "07-step3-desktop");
  await page.goto(`http://127.0.0.1:${port}/network-delay-time?section=4`); await shoot(page, "08-step4-desktop");
  await page.goto(`http://127.0.0.1:${port}/flatten-nested-list-iterator`);
  await page.getByRole("button", { name: /Skip to next question/ }).click(); await shoot(page, "09-step1-concept-nested-pictures");
  await page.goto(`http://127.0.0.1:${port}/one-color-metro-ride`);
  for (let i = 0; i < 2; i++) await page.getByRole("button", { name: /Skip to next question/ }).click();
  await shoot(page, "10-step1-metro-concept");
  await ctx.close();
  // Phone
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`); await shoot(page, "11-picker-phone");
  await page.goto(`http://127.0.0.1:${port}/find-if-path-exists-in-graph`); await shoot(page, "12-step1-phone");
  notes.push("phone: mobile switcher visible: " + await page.locator("#mobile-switcher").isVisible() + "; horizontal overflow: " + await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth));
  await page.goto(`http://127.0.0.1:${port}/find-if-path-exists-in-graph?section=2`); await shoot(page, "13-step2-phone");
  await page.goto(`http://127.0.0.1:${port}/network-delay-time?section=4`); await shoot(page, "14-step4-phone");
  notes.push("phone step4 code overflow: " + await page.evaluate(() => { const c = document.querySelector(".code-window pre"); return c.scrollWidth > c.clientWidth + 1; }));
  await ctx.close();
  await browser.close(); server.close();
  fs.writeFileSync(path.join(OUT, "notes.txt"), notes.join("\n"));
  console.log(notes.join("\n"));
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
