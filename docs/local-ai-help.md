# AI help

Every failed question in all four steps offers **Ask AI for help**, including Step 1 repair questions. Replies stream in. Editing an answer or graph clears the old reply; submitting again supplies the latest attempt.

The shared server implementation and tutor prompt are in `netlify/functions/lib/ai-help.cjs`. The production endpoint is `/api/ai-help`, served by `netlify/functions/ai-help.mjs`. It uses `gpt-5.6-luna`. `OPENAI_API_KEY` is a private Netlify environment variable read by the server; no key is included in public files. Requests have a size limit and timeout, with a per-IP limit of 20 requests per minute.

## Local preview

Run `node scripts/local-ai-server.js`, then open:

http://localhost:4173/longest-freight-train?section=4

The local server uses the same handler and prompt. It reads `OPENAI_API_KEY` or the canonical local key file. No packages need installing for the server. Use `PORT=4174` to choose another port.

## Checks

- `node scripts/validate-ai-graph-mistakes.js`
- `node scripts/validate-ai-endpoint.js`
- `node scripts/validate-ai-help.js` (requires Playwright and the local preview)
- `node scripts/validate-ai-coverage.js` (requires Playwright; tests every failed-question path without paid API calls)

Set `PLAYWRIGHT_MODULE` to a Playwright module path if it is installed elsewhere. `TEST_ASSETS` selects a prepared public directory for the coverage check.
