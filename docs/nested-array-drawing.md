# Nested-array drawing rollout

Step 1 uses Array / value nodes in all eight nested-array lessons:

- Flatten Nested List Iterator
- Nested List Weight Sum
- Nested List Weight Sum II
- Busiest Shelf Level
- Coins on Level K
- The K-th Song
- Top of the Pile
- Array Deep Count

Every array, including the outer array and empty arrays, gets an `Array` node. Each value occurrence gets a separate node. Duplicate values and Array labels are valid. Arrows point to direct children. Right-click or use **Type / value**; the expandable “How to use the drawing tool” section is removed.

The iterator and playlist lessons preserve each parent's arrow creation order. Automatic arrow numbers restart for each parent. Other lessons ignore child order. Node placement and creation order never affect grading.

Deep Count uses **Array / Value**, because its source problem also permits quoted text, Booleans, and decimal numbers. The other seven use **Array / Number**, with their own integer limits. Text such as `"Array"` remains distinct from an actual Array.

## Authoring and validation

```sh
node scripts/author-nested-array-drawing.js
node scripts/build-visual-data.js
node scripts/validate-visual-data.js
```

The focused authoring script writes `step1Drawing` in the three visual-spec files and regenerates each affected lesson's editor settings and wording. Run it after other lesson-authoring scripts. The normal validator includes `validate-nested-array-drawing.js`, so missing or stale settings fail validation. Old shelf-only script names remain compatibility entry points.

Hidden answer keys retain occurrence IDs; grading compares tree structure, values, direction, and child order where relevant. AI help receives normalized Array / value labels and the same drawing rules. Its unique-name checker skips this structural model so it cannot falsely report repeated Array names as errors.

## Checked

- Computer-use Chrome playthroughs: all eight lessons reached 9/9. Each included four main builds, five wrong-answer submissions, five fresh repair builds, and five blank optional scratch pads: 72 graded drawings and 40 repair paths total.
- Incorrect playlist arrow order was rejected. Deleting and reconnecting arrows in order passed. Reload retained the submitted graph.
- Right-click, toolbar, and keyboard type selection; negative numbers; decimal rejection in integer lessons; quoted strings, equals signs, Booleans and decimals in Deep Count; invalid literal rejection; cancellation; clearing; duplicate values; empty arrays; zero sums.
- A 390px screen showed no horizontal overflow in the seven newly adapted lessons; the shelf pilot was also checked on a narrow screen. Inspected desktop drawing and mobile type-menu screenshots. Restored the normal viewport afterward.
- All 24 Step 2–4 editor entry points across these lessons retained the old editor. Flood Fill also retained its editor. Browser console had no errors.
- Automated checks: all 72 authored build/repair graphs independently reconstructed from raw inputs; exact task outputs; all 32 picture choices; identity, direction, extra and missing edges, disconnected cycles, duplicate branches, order, input limits, and AI-help compatibility.
- All 75 lessons validate. Data comparison confirms the other 67 lessons and all Step 2–4 content are unchanged.

Two weighted-sum edge-count repairs used 101 despite their stated −100…100 limit. They now use 91, with the same topology and node/edge-count answers. Distractor review is recorded separately.

## Deployment

Published to https://sss-jonathan-attempt.netlify.app/ as deploy `6a9b7b87e6e7a08c7236e6f7`. All five live browser assets were downloaded and matched the tested staging files byte for byte. The existing AI-help function was deployed with the typed-label compatibility guard.

A browser test against the deployed build drew an exact shelf graph with repeated Array labels and submitted the wrong depth. The graph passed, and AI help streamed an answer-only explanation without inventing duplicate-node or missing-path mistakes. The primary production URL was then opened with a clean first question for review.
