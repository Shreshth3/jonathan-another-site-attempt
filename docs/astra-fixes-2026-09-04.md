# Astra fixes — September 4, 2026

The fixes cover the shared app, all 25 variants, and the 50 original/new lessons. The original audit is retained unchanged as evidence of the earlier version.

## Shared app fixes

| Audit items | Change |
|---|---|
| G01, G06 | Step 4 asks for both outputs. A correct diagnosis stays selected when another part needs repair. |
| G02, L02, L40 | Save both drawings, typed answers, active drawing, and passed progress. Editing clears stale proof badges. Copying works again after clearing. |
| G03 | All four steps are available in the lesson header. |
| G04, V34 | New nodes use the lesson's naming style. Feedback points to missing/extra nodes, wrong edges, directions, colors, or weights. |
| G05 | Optional scratch pads start closed. Mobile navigation and graph controls fit a narrow screen. |
| G07, V08, N09 | Visible node values and edge weights must match the input fields. Equivalent fractions work. |
| V15–17, V26, N20 | Step 3 uses fresh graphs, authored node misconceptions, meaningful boundary claims, and varied Yes/No patterns. |
| L15, V35 | Step 4 explains the actual graph change. Retry buttons say they retry the same check. |

Long nested names now remain fully visible. Skipped code cases no longer earn a completed-library badge. Versioned assets and cache headers prevent a new page from loading old lesson data.

## Lesson fixes

- Step 2 computes each student's actual input. It checks grids, tree shapes, geometry, values, thresholds, dial choices, multiple starting keys, and the real returned answer.
- Impossible counterexamples were replaced with valid examples that expose one mistake.
- Step 4 graphs match the real input, including weights, track colors, and blocked nodes. Incorrect code and declared outputs agree.
- Wrong choices use specific mistakes, with matching explanations and fresh repairs. Boolean choices are not duplicated.
- The original/new lessons received fresh picture, rule, output, and repair questions. The variants received 25 fresh first-picture inputs as well as targeted repairs throughout.
- All 75 lessons have five separate Step 3 builds. None repeat Step 1 inputs; each lesson has at least three graph shapes and two or three Yes answers.
- Empty arrays do not increase inverse integer depth. The lesson states this explicitly; the old source implementation is not used as the oracle for this boundary.

See [the fresh variant review](astra-final-variant-review.md) for its findings and evidence limits. The [original/new fix ledger](original-new-astra-fix-ledger.md) records its detailed audit mapping.

## Checks

Automated checks cover all 75 lessons, all 235 Step 4 code executions and reference answers, all 225 Step 2 starter examples, 37 additional Step 2 regressions, semantic input/output fixtures, 344 independently reconstructed graphs, and mini-graph text/layout.

Actual Chrome playtests included correct answers, wrong answers, repairs, refreshes, step navigation, graph copying, weighted edges, track colors, and desktop/mobile layouts. Tested paths included Shelf, Runes, Couriers, Vaults, Metro, Boats, Boolean Trees, Constellations, Playlist, and Network Delay. These are sampled playtests; they do not claim every possible student drawing was manually tried.

## Regeneration

The final repair passes are authoritative and can be rerun:

```sh
node scripts/repair-original-new-audit.js
node scripts/author-original-new-structure.js
node scripts/author-original-new-fresh-checks.js
node scripts/author-original-new-fresh-rules.js
node scripts/fix-astra-variant-content.js
node scripts/author-membership-claims.js
node scripts/build-visual-data.js
node scripts/validate-visual-data.js
node scripts/validate-step3-coverage.js
node scripts/validate-authored-graphs.js
node scripts/validate-step2-audit-fixes.js
node scripts/validate-step4-execution.js
node scripts/validate-step4-correct-outputs.js
```

Do not run the old full `apply-site-audit-fixes.js` after these passes: its historical Step 2/4 rewrites predate these repairs. Its `--lessons-only` mode is for rebuilding the older lesson baseline before the final passes.

## Published result

Published to https://sss-jonathan-attempt.netlify.app/ (deploy `6a9b6ff8776d0dc191e291fe`). All five served files match the checked local files byte for byte. Cache headers and old share links were verified. A final live Chrome test completed the formerly blocked reversed-shelf case with correct output 1 and buggy output 0; both graphs and all checks passed. No browser errors appeared.
