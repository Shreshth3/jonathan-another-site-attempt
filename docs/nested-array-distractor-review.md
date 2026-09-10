# Nested-array distractor review

Reviewed the eight lessons against `docs/distractor-review-rubric.md`, using a choice export without answer IDs, correctness flags, or feedback. The export sorted choices independently of their authored correct position. The structural validation separately checked every picture against the raw input.

| Lesson | Inferred output-check answers | Plausible competing mistakes |
| --- | --- | --- |
| Iterator | [7,8,9,10]; [7,8,9,12] | Reverse siblings; emit an empty array as a value |
| Weighted Sum | 70; 77 | Ignore depth; use plain value sum |
| Inverse Weighted Sum | 35; 75 | Use ordinary depth weights; ignore weights |
| Busiest Shelf | 3; 1 | Lose nesting; count containers; shift depth; prefer deeper ties |
| Coins on Level K | 9; 40 | Sum through k; use k+1; sum all levels; stop early; use k−1 |
| K-th Song | 9; 2 | Shift the position; skip nested songs; return k; treat nested-only songs as absent |
| Top of the Pile | 9; 0 | Return depth; sum all levels; sum deeper values; skip a zero-sum occupied level |
| Deep Count | 8; 8 | Count only leaves; include the outer array |

All eight picture checks compare the exact graph with a missing node, missing direct arrow, and wrong direction. The new labels preserve those distinctions. Empty arrays and repeated values remain separate occurrences. Ordered lessons display child-order numbers.

Changes from review:

- Balanced four two-choice membership checks: “Every Array and every separate value” versus “Every separate value, but no Array nodes.” This removes the large length difference without changing the tested misconception.
- Replaced Coins on Level K's poorly justified 6 with 10, the exact result of summing every level through k. Clarified that its 8 distractor sums level k+1.
- Corrected the K-th Song's 1 feedback: this returns k instead of the song ID, rather than an inaccurate folder-count explanation.
- Removed old path-label wording from picture feedback; preserved each missing-node/missing-arrow misconception.

The revised Coins distractor was replayed through its wrong-answer feedback in Chrome. Correct outputs and answer positions remain checked by the data validator; no answer letter was hard-coded by the editor change.
