# AI help rollout

AI help uses GPT-5.6 Luna for every failed question in all 75 problems, including Step 1 repair builds. The current local prompt is shared with the production function. The browser sends the submitted graph, answer key, selected answers, and grading feedback. The server adds independently verified graph mistakes. Responses stream as text, and edits invalidate the old reply.

Checks completed:

- 2,260 failed-question paths across 75 problems: buttons, complete attempt context, and streamed rendering with mocked responses.
- API validation, origin checks, input limits, missing-key handling, provider errors, stream cancellation, and separate streaming chunks.
- Independent graph mistakes are reported together without counting missing-node consequences twice.
- Browser retries and updated graph/output payloads.
- 75 lessons validate (25 original, 25 variant, 25 new).

The rollout's public assets are staged in `tmp/ai-rollout/publish`. They use the existing production files plus only the AI changes, preserving separate local lesson-authoring work. `visual-data.js` and `graph.js` match the previous live versions byte for byte. Under `docs/distractor-review-rubric.md`, no new or edited choices need blind review in this rollout: the deployed question/choice data is unchanged. Public assets contain no API key; only the five browser files are uploaded as static files. The function is bundled separately from `netlify/functions`.

Netlify's standard environment-variable scopes are used because this account rejects narrower scopes. The application reads the key only on the server and does not embed it in public files.

Published to https://sss-jonathan-attempt.netlify.app/ as deploy `6a9b78f456bb087edcd9b3f3`. All five served assets match the tested staging files. A production browser test received HTTP 200 with `text/event-stream` and observed 164 visible text updates without browser errors. AI explanations remain model-generated; these checks verify coverage, context delivery, and streaming rather than guaranteeing every generated statement is correct.
