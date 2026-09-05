# Step 4 review: new problems

Review standard: each accepted case changes one real rule, runs as JavaScript, has a small input where the wrong and correct outputs differ, and uses the exact problem graph. Performance-only changes and harmless changes are excluded.

| Problem | Correct-solution rule | Accepted mistake inventory / represented case IDs | Important exclusions |
|---|---|---|---|
| 10 Kinds of People | Regions use four-direction moves and never cross between `0` and `1`; the region digit chooses the answer word. | diagonal neighbor (`authored-deep-case`); cross terrain (`crosses-terrain`); swap binary/decimal words (`swapped-labels`) | Reordering queries; DFS versus BFS |
| Array Deep Count | Count every member at every depth; an inner array counts once, but the outer container does not. | omit nested arrays (`authored-deep-case`); count outer array (`counts-outer-array`); open only one nested layer (`one-nesting-layer`) | Eager versus recursive implementation |
| Grid Path Exists | Start at the source, avoid walls, and follow four-direction paths to the destination. | diagonal wall crossing (`authored-deep-case`); traverse walls (`walks-through-walls`); direct destination only (`direct-only`) | DFS versus BFS; neighbor order |
| Connected Cells | Use all eight neighbors, measure each filled region, and return the largest size. | omit diagonals (`authored-deep-case`); omit the current cell (`forgets-current-cell`); add separate regions (`adds-all-regions`) | Which tied region is visited first |
| Count Sub Islands | Fully explore each grid-2 island and accept it only if every one of its cells is land in grid 1. | inspect only the first cell (`authored-deep-case`); ignore grid 1 (`ignores-grid1`); merge diagonal islands (`diagonal-islands`) | Mutating a grid instead of using `visited`, if semantics stay correct |
| Employee Importance | Map IDs to employees and sum the requested employee plus every transitive report. | direct reports only (`authored-deep-case`); subtract requested employee (`omits-manager`); overwrite the running total (`overwrites-report-total`) | A defensive visited set on valid tree input |
| Evaluate Boolean Binary Tree | Recursively evaluate children; node 2 is OR, node 3 is AND, and leaves are 0/1. | AND as OR (`authored-deep-case`); OR as AND (`or-as-and`); read operator labels as child truth values (`no-recursion`) | Short-circuit evaluation |
| Fence Planning | For every friendship component, find its bounding rectangle perimeter and return the smallest perimeter. | omit perimeter doubling (`authored-deep-case`); compute area (`uses-area`); choose largest component fence (`chooses-largest-herd`) | Swapping x and y, which leaves perimeter unchanged |
| Find Farmland | Explore each four-direction rectangle and return inclusive top-left and bottom-right coordinates. | add one to endpoints (`authored-deep-case`); return size instead of endpoint on a non-origin rectangle (`reports-size`); merge diagonal groups (`merges-diagonals`) | Any allowed ordering of groups; tests use reference order |
| Flood Fill | Recolor exactly the four-connected component containing the start. | include diagonals (`authored-deep-case`); allow only down/right spread (`down-right-only`); cross into other colors (`crosses-colors`) | Early return when old and new colors match—it is correct |
| Getting Gold | Count reachable gold; a square beside a trap may be entered but cannot be expanded. | expand from a draft square (`authored-deep-case`); walk through walls (`walks-through-walls`); never leave start (`never-leaves-start`) | DFS versus BFS; direction order |
| Ladder Takahashi | Treat ladders as undirected, traverse the whole component of floor 1, and return its largest floor label. | one-way ladders (`authored-deep-case`); highest endpoint globally (`global-highest`); only direct ladders (`direct-only`) | Allocating by floor number is a performance issue, not a small-case correctness bug |
| Largest Component | Measure each component once and return the maximum node count. | count components (`authored-deep-case`); omit each search’s starting node (`omits-start-node`); keep the smaller size (`chooses-smallest`) | Neighbor iteration order |
| Max Area of Island | Measure every four-connected island and keep the maximum area. | merge diagonals (`authored-deep-case`); add separate islands (`adds-islands`); omit each current cell (`forgets-current-cell`) | Mutating visited land to water if done consistently |
| Max Root-to-Leaf Path Sum | A valid path ends at a leaf and chooses the higher of exactly one child branch. | stop before a negative leaf (`authored-deep-case`); add both branches (`adds-both-branches`); choose smaller branch (`chooses-smaller-path`) | A visited set on a proper tree |
| Maximum Fish | Sum fish values within each four-connected pool and return the richest pool. | count pool cells instead of fish weights (`authored-deep-case`); add separate pools (`adds-pools`); omit each cell's fish value (`omits-cell-fish`) | Traversal order |
| Milk Factory | Follow directed belts from every sender, include zero-edge self-reachability, and find a station reached by all. | make belts two-way (`authored-deep-case`); direct senders only (`direct-senders-only`); exclude self (`excludes-self`) | Reversing the graph can be correct if the entire test is reversed consistently |
| Minimum Island | Measure every four-connected `L` island and keep the minimum positive size. | choose largest (`authored-deep-case`); initialize the minimum to zero (`zero-minimum-sentinel`); omit current cells (`forgets-current-cell`) | Scan order |
| Moocast | Build directed sender-radius edges, try every starting cow, include the starter, and keep the largest reach. | make links two-way (`authored-deep-case`); only cow 0 starts (`only-cow-zero`); reject exact-radius links (`strict-radius`) | Squared distance versus square root |
| Path Sum | Subtract each node value and accept only when one root-to-leaf branch ends at zero. | accept an internal prefix (`authored-deep-case`); require both branches (`requires-both-branches`); prune a negative remaining target (`prunes-negative-sums`) | Either running-sum or remaining-sum style |
| Properties Graph | Intersections count distinct values, `>= k` creates an undirected edge, and the answer is component count. | duplicates inflate intersection (`authored-deep-case`); reject equality (`strict-threshold`); count links instead of components (`counts-links`) | Pair-loop order |
| Reachable Nodes With Restrictions | Start at 0, do not enter restricted nodes, follow undirected edges, and count only reached nodes. | restricted bridge (`authored-deep-case`); count all unrestricted nodes (`counts-all-unrestricted`); store edges one way (`one-way-edges`) | Checking restriction before or after visited, when both happen before counting |
| Transitive Closure | For each start, use a fresh directed search; zero or more edges means every diagonal entry is 1. | omit self reach (`authored-deep-case`); direct roads only (`direct-only`); make roads two-way (`undirected-roads`) | Floyd–Warshall versus repeated DFS |
| Tree Sum | Add every node value and both subtree totals; null contributes zero. | ignore negatives (`authored-deep-case`); keep only the larger branch (`takes-largest-branch`); count leaves only (`leaves-only`) | Recursion versus an explicit stack |
| Where’s My Internet? | Treat cables as undirected, search the full component of house 1, and list every unreached house. | direct cables only (`authored-deep-case`); store cables one way (`one-way-cables`); start at nonexistent house 0 (`starts-at-house-zero`) | Output is already required in ascending house order |

## Adversarial re-review fixes

- Rewrote Employee Importance's omission case so it removes only the requested employee, rather than accidentally removing every employee weight.
- Moved Find Farmland's size case away from the origin, making size-versus-endpoint distinct from the existing exclusive-endpoint bug.
- Replaced Path Sum's second leaf-boundary case with the distinct positive-values-only mistake: pruning a negative remaining sum.
- Replaced Fence Planning's degenerate zero-height area witness with a true 2×1 rectangle (area 2 versus perimeter 6).
- Corrected Maximum Fish wording: the code counts pool area, not water cells.

A fresh pass found no remaining blocker or major correctness, realism, diagnosis, canvas, or proof issue.

## Review result

All 25 problems now have three cases. Within each problem, the three cases use different misconceptions, different inputs, and different canvases. The two added cases use separate incorrect programs rather than replaying the original bug on another input.
