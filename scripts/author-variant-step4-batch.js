const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../step4-specs-variant.json");
const specs = JSON.parse(fs.readFileSync(file, "utf8"));
const byId = new Map(specs.map(spec => [spec.id, spec]));

function canvas(labels, edges, directed = false) {
  return {
    directed,
    nodes: labels.map(([id, label]) => ({ id, label })),
    edges: edges.map(([from, to]) => ({ from, to }))
  };
}

function addCases(id, additions, replaceDerived = false) {
  const spec = byId.get(id);
  const base = spec.cases[0];
  if (replaceDerived) spec.cases = [base];
  else {
    const authoredIds = new Set(additions.map(addition => addition.caseId));
    spec.cases = spec.cases.filter(codeCase => !authoredIds.has(codeCase.caseId));
  }
  for (const addition of additions) spec.cases.push({ ...base, ...addition });
}

addCases("counting-docked-boats", [
  {
    caseId: "bottom-border-after-interior-start",
    input: { marina: [[".", ".", ".", ".", "."], [".", ".", "B", ".", "."], [".", ".", "B", ".", "."], [".", ".", "B", ".", "."]] },
    canvas: canvas([["a", "(1,2)"], ["b", "(2,2)"], ["c", "(3,2)"]], [["a", "b"], ["b", "c"]]),
    buggyOutput: "0", correctOutput: "1",
    diagnoses: [
      { id: "start-only-border", label: "The code freezes docked status at the first square, so it misses the bottom-border square reached later.", feedback: "Correct. The scan starts at interior square (1,2), but the same boat reaches bottom-border square (3,2)." },
      { id: "diagonal-boats", label: "The flood joins corner-touching boats, merging separate boats in this marina.", feedback: "No boat squares touch diagonally here; all two links are vertical side links." },
      { id: "double-count", label: "The code counts all three squares as separate docked boats.", feedback: "The seen set correctly groups the three squares into one boat." }
    ],
    graphProof: { realGraph: "The vertical component (1,2)—(2,2)—(3,2) reaches the bottom border.", codeRule: "Docked status is recorded only from first-scanned node (1,2).", separatingFeature: "The first node is interior, while the last node of the same boat is on the border.", outputConsequence: "The code returns 0; the boat-level rule returns 1." }
  },
  {
    caseId: "one-counted-one-missed",
    input: { marina: [["B", ".", ".", ".", "."], [".", ".", ".", ".", "."], [".", ".", "B", "B", "B"], [".", ".", ".", ".", "."]] },
    canvas: canvas([["dock", "(0,0)"], ["a", "(2,2)"], ["b", "(2,3)"], ["c", "(2,4)"]], [["a", "b"], ["b", "c"]]),
    buggyOutput: "1", correctOutput: "2",
    diagnoses: [
      { id: "start-only-border", label: "The code counts the top-border singleton but misses the second boat whose right-border square is reached after its interior start.", feedback: "Correct. Boat (0,0) is counted, but the component beginning at (2,2) is wrongly rejected even though it reaches (2,4)." },
      { id: "diagonal-boats", label: "The code merges the two boats through a diagonal connection.", feedback: "The boats are far apart, and the flood uses only side moves." },
      { id: "double-count", label: "The code counts each square of the horizontal boat separately.", feedback: "Seen prevents repeats; the error is the frozen border flag." }
    ],
    graphProof: { realGraph: "There are two components: border singleton (0,0), and path (2,2)—(2,3)—(2,4) ending on the right border.", codeRule: "Each component's border status comes only from its first scanned square.", separatingFeature: "The second component starts inside the marina and reaches the border later.", outputConsequence: "The code counts only one docked boat; the correct count is two." }
  }
]);

addCases("flooded-campsite-trails", [
  {
    caseId: "flooded-finish-after-safe-branch",
    input: { n: 5, trails: [[4,3],[3,0],[4,1],[1,2]], flooded: [0,2], start: 4, finish: 0 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"],["4","4"]], [["4","3"],["3","0"],["4","1"],["1","2"]]),
    buggyOutput: "true", correctOutput: "false",
    diagnoses: [
      { id: "base-case-order", label: "The finish check accepts flooded node 0 before the flooded-node guard can reject it.", feedback: "Correct. Reaching finish 0 is not legal because 0 is flooded." },
      { id: "no-backtracking", label: "The search stops forever after exploring flooded dead end 2.", feedback: "The loop can continue after a false branch; the illegal success comes from finish 0." },
      { id: "directed-trails", label: "The code stores 4—3 as one-way and cannot return toward node 4.", feedback: "Every trail is stored in both directions." }
    ],
    graphProof: { realGraph: "Start 4 branches to 1—2 and 3—0; both leaves 2 and finish 0 are flooded.", codeRule: "Equality with finish is tested before membership in flooded.", separatingFeature: "The only finish node is itself forbidden.", outputConsequence: "The code accepts route 4—3—0 and returns true; the correct answer is false." }
  },
  {
    caseId: "flooded-finish-beyond-cycle",
    input: { n: 6, trails: [[0,1],[1,2],[2,0],[2,5],[0,3],[3,4]], flooded: [4,5], start: 0, finish: 5 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"],["4","4"],["5","5"]], [["0","1"],["1","2"],["2","0"],["2","5"],["0","3"],["3","4"]]),
    buggyOutput: "true", correctOutput: "false",
    diagnoses: [
      { id: "base-case-order", label: "The search walks through the safe cycle and accepts flooded finish 5 before checking its restriction.", feedback: "Correct. The cycle is harmless; the early finish check makes flooded node 5 an illegal success." },
      { id: "no-backtracking", label: "The cycle makes recursion loop forever because nodes are never marked seen.", feedback: "Safe nodes enter seen before their neighbors are explored, so the cycle terminates." },
      { id: "directed-trails", label: "The trail 2—5 is stored only from 2 to 5, changing reachability.", feedback: "Both directions are stored; direction is not the bug." }
    ],
    graphProof: { realGraph: "Safe nodes 0,1,2 form a cycle; 2 touches flooded finish 5, while branch 0—3 ends at flooded 4.", codeRule: "The finish test runs before the flooded test.", separatingFeature: "A safe region has an edge into a forbidden destination.", outputConsequence: "The shown code returns true on arrival at 5; legal reachability returns false." }
  }
]);

addCases("longest-freight-train", [{
  caseId: "two-car-first-four-car-later",
  input: { yard: [["T","T",".",".","."],[".",".",".",".","."],[".","T","T","T","."],[".","T",".",".","."]] },
  canvas: canvas([["a","(0,0)"],["b","(0,1)"],["c","(2,1)"],["d","(2,2)"],["e","(2,3)"],["f","(3,1)"]], [["a","b"],["c","d"],["d","e"],["c","f"]]),
  buggyOutput: "2", correctOutput: "4",
  diagnoses: [
    { id: "first-train-return", label: "The row scan returns the first two-car component before it discovers the later four-car component.", feedback: "Correct. The top train has 2 cars; the lower train has 4." },
    { id: "diagonal-cars", label: "The move list merges the two trains diagonally.", feedback: "The trains do not touch, and the moves contain only four side directions." },
    { id: "counts-water", label: "The size helper adds dot cells to the first train.", feedback: "Dot cells return 0 immediately; the early outer return is the bug." }
  ],
  graphProof: { realGraph: "The top edge is a size-2 component; the three lower edges form a size-4 component.", codeRule: "The outer loop returns after measuring its first T component.", separatingFeature: "A later component is twice as large as the first component.", outputConsequence: "The code returns 2, while the longest train has length 4." }
}]);

addCases("office-rumor-reach", [
  {
    caseId: "reverse-chain-plus-forward-leaf",
    input: { n: 5, friendships: [[1,0],[2,1],[3,2],[0,4]], start: 0 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"],["4","4"]], [["0","1"],["1","2"],["2","3"],["0","4"]]),
    buggyOutput: "2", correctOutput: "5",
    diagnoses: [
      { id: "missing-reverse-friendship", label: "Only the listed arrows are stored, so 0 reaches forward-listed friend 4 but cannot enter the reverse-listed chain 0—1—2—3.", feedback: "Correct. Friendship is two-way, so all five employees should hear the rumor." },
      { id: "counts-start", label: "The code wrongly includes starter 0, creating the extra count.", feedback: "Starter 0 really has heard the rumor; nodes 1,2,3 are the missing employees." },
      { id: "shallow-rumor", label: "The stack stops after direct friend 4 and never processes 4's friends.", feedback: "The stack processes every reached node; missing reverse edges prevent reaching node 1." }
    ],
    graphProof: { realGraph: "The undirected graph is connected: chain 3—2—1—0 with leaf 4 at 0.", codeRule: "Pairs create only arrows 1→0, 2→1, 3→2, and 0→4.", separatingFeature: "One edge points out of start, but the three-node chain points toward start.", outputConsequence: "The code reaches {0,4} and returns 2; the real rumor reaches all 5." }
  },
  {
    caseId: "start-at-directed-sink",
    input: { n: 6, friendships: [[0,1],[2,1],[2,3],[4,3],[4,5]], start: 1 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"],["4","4"],["5","5"]], [["0","1"],["1","2"],["2","3"],["3","4"],["4","5"]]),
    buggyOutput: "1", correctOutput: "6",
    diagnoses: [
      { id: "missing-reverse-friendship", label: "Node 1 is a sink in the stored arrows even though it sits inside one undirected friendship chain.", feedback: "Correct. The real chain 0—1—2—3—4—5 lets the rumor reach everyone from 1." },
      { id: "counts-start", label: "The result is 1 only because the code should exclude starter 1.", feedback: "The starter belongs in the reached set; five friends are missing because arrows are one-way." },
      { id: "shallow-rumor", label: "The code reaches nodes 0 and 2 but refuses to spread beyond one hop.", feedback: "It reaches neither 0 nor 2: both stored arrows point into node 1." }
    ],
    graphProof: { realGraph: "Ignoring listing order gives the single chain 0—1—2—3—4—5.", codeRule: "The stored arrows are 0→1, 2→1, 2→3, 4→3, and 4→5.", separatingFeature: "Start 1 has real neighbors but zero outgoing stored edges.", outputConsequence: "The code returns 1; undirected reachability returns 6." }
  }
]);

addCases("perfect-size-campsites", [
  {
    caseId: "five-diagonal-singletons",
    input: { park: [[1,0,1],[0,1,0],[1,0,1]], k: 1 },
    canvas: canvas([["a","(0,0)"],["b","(0,2)"],["c","(1,1)"],["d","(2,0)"],["e","(2,2)"]], []),
    buggyOutput: "0", correctOutput: "5",
    diagnoses: [
      { id: "adds-diagonals", label: "Diagonal moves merge five real singleton campsites into one size-5 component.", feedback: "Correct. With side-only edges, all five grass cells are separate size-1 campsites." },
      { id: "counts-forest", label: "The area helper counts the four forest cells as grass.", feedback: "Forest cells return 0; invented diagonal edges merge the grass cells." },
      { id: "counts-seen-zero", label: "Already-seen grass cells are counted again as size-1 campsites.", feedback: "A seen cell returns 0, which cannot equal k=1." }
    ],
    graphProof: { realGraph: "All five grass nodes are isolated under side-only adjacency.", codeRule: "Eight-direction recursion adds diagonal edges through the center node.", separatingFeature: "Five target-size singleton components become one non-target size-5 component.", outputConsequence: "The code returns 0 instead of 5." }
  },
  {
    caseId: "two-size-two-patches-touch-diagonally",
    input: { park: [[1,1,0],[0,0,1],[0,0,1]], k: 2 },
    canvas: canvas([["a","(0,0)"],["b","(0,1)"],["c","(1,2)"],["d","(2,2)"]], [["a","b"],["c","d"]]),
    buggyOutput: "0", correctOutput: "2",
    diagnoses: [
      { id: "adds-diagonals", label: "The diagonal move from (0,1) to (1,2) merges two size-2 campsites into one size-4 patch.", feedback: "Correct. Without that invented edge, both real components have the requested size 2." },
      { id: "counts-forest", label: "A forest cell between the two patches is counted as grass and joins them.", feedback: "Forest cells return 0; the direct diagonal move joins the patches." },
      { id: "counts-seen-zero", label: "The second campsite is skipped only because its cells were marked seen before any connection existed.", feedback: "They are marked seen through the invented diagonal connection, not before it." }
    ],
    graphProof: { realGraph: "Edges (0,0)—(0,1) and (1,2)—(2,2) form two separate size-2 components.", codeRule: "Eight-direction recursion adds edge (0,1)—(1,2).", separatingFeature: "Two target-size components touch only at a corner.", outputConsequence: "The code sees one size-4 component and returns 0; the correct count is 2." }
  }
], true);

addCases("runes-on-the-castle-door", [
  {
    caseId: "repeat-after-two-different-runes",
    input: { dials: ["a","b","a","c"] },
    canvas: canvas([["root","empty"],["a","a"],["ab","ab"],["aba","aba"],["abac","abac"]], [["root","a"],["a","ab"],["ab","aba"],["aba","abac"]], true),
    buggyOutput: "[]", correctOutput: "[\"abac\"]",
    diagnoses: [
      { id: "global-uniqueness", label: "The used set rejects the second a even though b separates the two a runes.", feedback: "Correct. Only equal adjacent runes are forbidden, so abac is legal." },
      { id: "no-backtrack", label: "The code forgets to remove b before selecting dial 3.", feedback: "used.delete runs after each recursive branch; the active prefix intentionally still contains b." },
      { id: "accepts-prefix", label: "The code returns ab before choosing from all four dials.", feedback: "A result is added only at index 4; the valid full result is pruned earlier." }
    ],
    graphProof: { realGraph: "The legal prefix path is empty→a→ab→aba→abac.", codeRule: "The used set forbids any rune already anywhere in the prefix.", separatingFeature: "Dial 3 repeats a non-adjacent rune after b.", outputConsequence: "The code prunes abac and returns []; the correct array is [\"abac\"]." }
  },
  {
    caseId: "two-of-four-valid-codes-pruned",
    input: { dials: ["ab","c","ab"] },
    canvas: canvas([["root","empty"],["a","a"],["b","b"],["ac","ac"],["bc","bc"],["aca","aca"],["acb","acb"],["bca","bca"],["bcb","bcb"]], [["root","a"],["root","b"],["a","ac"],["b","bc"],["ac","aca"],["ac","acb"],["bc","bca"],["bc","bcb"]], true),
    buggyOutput: "[\"acb\",\"bca\"]", correctOutput: "[\"aca\",\"acb\",\"bca\",\"bcb\"]",
    diagnoses: [
      { id: "global-uniqueness", label: "The used set removes aca and bcb because their final rune appeared on dial 1, even though c separates the repeats.", feedback: "Correct. All four endings differ from adjacent c, so all four codes are legal." },
      { id: "no-backtrack", label: "The code leaves a in used after finishing the a branch, so it cannot start the b branch.", feedback: "Backtracking removes a; the code does produce both acb and bca." },
      { id: "accepts-prefix", label: "The base case adds ac and bc before the third dial.", feedback: "It adds only length-3 strings; the missing strings were pruned by global uniqueness." }
    ],
    graphProof: { realGraph: "The correct prefix tree has four leaves: aca, acb, bca, and bcb.", codeRule: "The used set removes a repeated rune from any later dial, not just an adjacent repeat.", separatingFeature: "Two leaves repeat their first rune after middle rune c.", outputConsequence: "The code returns [\"acb\",\"bca\"] instead of all four valid strings." }
  }
], true);

addCases("trusted-courier-networks", [
  {
    caseId: "threshold-chain-with-strong-tail",
    input: { trust: [[10,7,0,0],[7,10,7,0],[0,7,10,8],[0,0,8,10]], k: 7 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"]], [["0","1"],["1","2"],["2","3"]]),
    buggyOutput: "3", correctOutput: "1",
    diagnoses: [
      { id: "greater-not-at-least", label: "Using > 7 deletes threshold edges 0—1 and 1—2, leaving only strong edge 2—3.", feedback: "Correct. Scores equal to 7 qualify, so the real graph is one chain." },
      { id: "counts-diagonal", label: "Diagonal score 10 creates four extra self-loop networks.", feedback: "The code skips next === node, so diagonal values never create traversal." },
      { id: "directed-trust", label: "The code keeps 2→3 but drops 3→2, splitting the strong pair.", feedback: "Both matrix entries are 8; the pair remains connected in both directions." }
    ],
    graphProof: { realGraph: "Threshold edges 0—1 and 1—2 plus strong edge 2—3 make one connected chain.", codeRule: "The strict comparison retains only score-8 edge 2—3.", separatingFeature: "Two threshold edges attach two otherwise isolated nodes to the strong pair.", outputConsequence: "The code returns 3 networks; the at-least-threshold rule returns 1." }
  },
  {
    caseId: "threshold-bridge-between-strong-pairs",
    input: { trust: [[10,9,0,0],[9,10,5,0],[0,5,10,9],[0,0,9,10]], k: 5 },
    canvas: canvas([["0","0"],["1","1"],["2","2"],["3","3"]], [["0","1"],["1","2"],["2","3"]]),
    buggyOutput: "2", correctOutput: "1",
    diagnoses: [
      { id: "greater-not-at-least", label: "The strict test removes threshold bridge 1—2 and splits two strong courier pairs.", feedback: "Correct. Trust 5 is allowed, so the bridge joins all four couriers." },
      { id: "counts-diagonal", label: "The four diagonal 10s are treated as separate networks.", feedback: "Self positions are skipped; the two components come from the missing bridge." },
      { id: "directed-trust", label: "The bridge exists only from courier 1 to courier 2, so reverse traversal fails.", feedback: "Both trust[1][2] and trust[2][1] equal 5; the strict comparison removes both." }
    ],
    graphProof: { realGraph: "Strong edges 0—1 and 2—3 are connected by qualifying threshold edge 1—2.", codeRule: "The code keeps the score-9 edges but rejects bridge score 5 because it is not greater than k.", separatingFeature: "One exactly-threshold bridge is the only connection between two strong clusters.", outputConsequence: "The code returns 2 networks instead of 1." }
  }
]);

fs.writeFileSync(file, `${JSON.stringify(specs, null, 2)}\n`);
console.log("Authored 13 corrected/new Step 4 variant cases.");
