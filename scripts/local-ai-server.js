// Local preview only. Serve a small allowlist so keys and source files stay private.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const keyFile = '/Users/shreshth/git-repos/code-feedback-vs-code/.env';
const keyLine = !process.env.OPENAI_API_KEY && fs.existsSync(keyFile)
  ? fs.readFileSync(keyFile, 'utf8').match(/^OPENAI_API_KEY\s*=\s*(.+)$/m) : null;
const apiKey = process.env.OPENAI_API_KEY || keyLine?.[1].trim().replace(/^(['"])(.*)\1$/, '$2');
const { handleAiHelp } = require('../netlify/functions/lib/ai-help.cjs');
const { handleGrade } = require('../netlify/functions/lib/grade-debugging.cjs');
const assets = { '/styles.css': 'text/css', '/visual-data.js': 'text/javascript', '/graph.js': 'text/javascript', '/visual-library.js': 'text/javascript' };
const server = http.createServer(async (req, res) => {
  const send = (status, message) => { res.writeHead(status, { 'Content-Type': 'text/plain' }); res.end(message); };
  if (!['localhost', '127.0.0.1'].includes((req.headers.host || '').split(':')[0])) return send(403, 'Local preview only.');
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (['/api/ai-help', '/api/grade-debugging'].includes(url.pathname)) {
    const controller = new AbortController();
    res.on('close', () => controller.abort());
    try {
      const request = new Request(url, {
        method: req.method, headers: req.headers, signal: controller.signal,
        ...(!['GET', 'HEAD'].includes(req.method) ? { body: req, duplex: 'half' } : {})
      });
      const response = await (url.pathname === '/api/grade-debugging' ? handleGrade : handleAiHelp)(request, { apiKey });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.flushHeaders();
      for await (const chunk of response.body) {
        if (!res.write(chunk)) await once(res, 'drain', { signal: controller.signal });
      }
      res.end();
    } catch {
      if (!res.destroyed) res.end();
    }
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, 'Use GET.');
  const isLesson = /^\/(?:visual\/)?[a-z0-9-]*$/.test(url.pathname);
  const file = assets[url.pathname] ? url.pathname.slice(1) : isLesson ? 'index.html' : null;
  if (!file) return send(404, 'Not found.');
  res.writeHead(200, { 'Content-Type': assets[url.pathname] || 'text/html', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(path.join(root, file)).pipe(res);
});
server.listen(port, '127.0.0.1', () => console.log(`Local AI preview: http://localhost:${port}/longest-freight-train?section=4`));
