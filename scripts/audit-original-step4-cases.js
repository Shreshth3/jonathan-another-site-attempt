const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../step4-specs-original.json");
const specs = JSON.parse(fs.readFileSync(file, "utf8"));

const labelOverrides = {
  "missing-direct-edge": "The source needs an extra direct arrow to the target for this result.",
  "wrong-direction": "The parent-child arrows should point from child to parent.",
  "include-parent": "Killing a process should also kill its parent.",
  "wrong-three": "The second digit's phone mapping should omit one of its listed letters.",
  "zero-based": "The only issue is that nesting depth should begin at 0.",
  "counts-cells": "The code counts every X cell as a separate ship.",
  "missing-self-edge": "Each variable needs an explicit weight-1 self-loop.",
  "wrong-source": "The search should start at the destination instead of the declared source.",
  "exclude-isolated": "Isolated nodes should not count as connected components.",
  "diagonal-word": "The word search needs diagonal moves to find the target word."
};

const feedbackOverrides = {
  "missing-direct-edge": "Do not invent a shortcut. A valid path may use several listed arrows to reach the target.",
  "wrong-direction": "Keep parent→child arrows: descendants are found by moving downward from the killed process.",
  "include-parent": "Do not move upward. Killing a child process never kills its parent.",
  "wrong-three": "Use the complete fixed phone mapping for that digit; removing a mapped letter deletes valid combinations.",
  "zero-based": "Changing the starting depth shifts every weight; it does not create the required inverse-depth weighting.",
  "counts-cells": "The code tests for a right neighbor; it is not counting every X. Count one start cell per complete ship instead.",
  "missing-self-edge": "A self-query can return 1 when start equals target. Self-loops do not repair an incorrect reciprocal edge.",
  "wrong-source": "Begin at the declared source. The fix is to store each undirected edge for both endpoints.",
  "exclude-isolated": "A lone node is a valid one-node component and must remain in the component count.",
  "diagonal-word": "Use only side neighbors. The valid route exists without a diagonal; failed attempts must release their cells."
};

const perCaseLabels = {
  "two-digits-four-way:wrong-three": "Digit 7 should omit s and use only p, q, and r.",
  "two-digits-second-three-way:wrong-three": "Digit 4 should omit i and use only g and h."
};

const rationaleOverrides = {
  "all-paths-from-source-to-target:build-diamond": "Paths 0→1→3 and 0→2→3 share target 3; visiting 3 through node 1 must not erase the second complete path through node 2.",
  "all-paths-from-source-to-target:build-direct-and-long": "The long route 0→1→2→3 reaches target 3 first, so the global set wrongly blocks the separate direct route 0→3.",
  "keys-and-rooms:remedial-2": "Room 0 opens room 1, but room 2 is unreachable; reversing key 2→1 invents a path from reached room 1 into locked room 2.",
  "keys-and-rooms:remedial-3": "Room 0 opens room 1, while locked room 2 holds a key back to 0; the invented reverse of 2→0 wrongly opens room 2.",
  "kill-process:remedial-1": "Killing process 4 must follow edges 4→8→9; the one-step result includes 8 but misses grandchild 9.",
  "kill-process:remedial-5": "Killing process 1 must follow the full chain 1→2→3; the one-step result stops before descendant 3.",
  "longest-increasing-path-in-a-matrix:remedial-3": "Values form the leftward increasing chain (0,2)=1→(0,1)=2→(0,0)=3, and the code creates none of those left edges.",
  "nested-list-weight-sum:build-mixed": "The outer integer 2 needs depth 1 and the four nested 1s need depth 2; starting at depth 0 removes one copy of every value from the weighted sum.",
  "nested-list-weight-sum:remedial-1": "Integer 2 is at depth 1 and integer 3 is at depth 2; the code instead weights them at depths 0 and 1.",
  "nested-list-weight-sum-ii:build-mixed": "The four nested 1s are deepest and need weight 1, while outer integer 2 needs weight 2; ordinary depth weights reverse that priority.",
  "nested-list-weight-sum-ii:remedial-1": "Outer integer 2 needs inverse weight 2 and nested integer 3 needs weight 1; ordinary depths assign the opposite weights.",
  "network-delay-time:build-unreachable": "The only arrow is 1→2, so source 2 cannot reach node 1; the code invents reverse edge 2→1 with weight 1.",
  "network-delay-time:remedial-3": "The only arrow is 2→1 with weight 5, so source 1 cannot reach node 2; the code invents 1→2.",
  "battleships-in-a-board:build-two-ships": "The board has singleton (0,0) and vertical ship (0,3)—(1,3)—(2,3); neither start has an X immediately to its right.",
  "battleships-in-a-board:build-separated": "Cells (0,0) and (0,2) are two separate singleton ships, and both are rejected because neither has a right neighbor.",
  "course-schedule:build-chain": "The acyclic arrows 0→1→2 are fully visited from course 0; the later outer-loop start at already-finished course 1 is falsely called a cycle.",
  "course-schedule:build-isolated": "After acyclic edge 0→1 is finished, the outer loop revisits course 1 and mistakes that completed node for an active-path cycle; isolated course 2 is harmless.",
  "find-if-path-exists-in-graph:build-reverse-travel": "Undirected pair [1,0] is the edge 0—1, but storing only arrow 1→0 strands source 0 away from destination 1.",
  "flatten-nested-list-iterator:build-deep": "The nesting path root→middle list→deep list→6 has two list edges; opening only the first list leaves [6] unflattened.",
  "flatten-nested-list-iterator:remedial-3": "Integer 3 lies behind two nested list nodes, root→list→list→3; one-level expansion returns [3] as a value instead of opening it.",
  "is-graph-bipartite:remedial-2": "Node 0 is isolated, while disconnected nodes 1,2,3 form an odd triangle; starting only at 0 never inspects the conflicting component.",
  "number-of-connected-components-in-an-undirected-graph:remedial-3": "Pairs [1,0] and [2,1] form one undirected component 0—1—2; one-way arrows point opposite the ascending outer scan and produce three false starts.",
  "number-of-increasing-paths-in-a-grid:remedial-3": "The increasing edges are (0,2)=1→(0,1)=2 and (0,1)=2→(0,0)=3, both pointing left and both omitted.",
  "number-of-increasing-paths-in-a-grid:remedial-4": "Middle value 1 has two increasing neighbors, left 2 and right 2; right-only generation keeps one edge and loses the path to the left 2.",
  "number-of-islands:remedial-4": "Land nodes (0,0), (1,1), and (2,2) share no sides, so they are three islands; diagonal moves invent a chain joining all three.",
  "number-of-provinces:build-isolated": "Cities 0,1,2 have no off-diagonal friendship edges, so all three are separate provinces; searching only from city 0 counts one.",
  "number-of-provinces:remedial-1": "City 0 is one province and edge 1—2 forms a second; the single DFS from 0 never starts inside component {1,2}.",
  "smallest-string-with-swaps:build-connected": "Edges 0—3, 0—2, and 1—2 connect all four indexes; one-way storage prevents the ascending scan from collecting the full component for global sorting.",
  "time-needed-to-inform-all-employees:build-branch": "After head 0 waits 1 minute, branches 0→1→3 and 0→2→4 proceed together; the slower branch takes 4 more minutes, not 4+2.",
  "water-and-jug-problem:build-sum": "Reachable state (1,2) holds the target total 3 across both jugs; the early max-capacity check rejects it before exploring any state edge."
};

function jugCanvas(capacityA, capacityB) {
  const states = [];
  for (let a = 0; a <= capacityA; a++) for (let b = 0; b <= capacityB; b++) states.push([a, b]);
  const key = ([a, b]) => `(${a},${b})`;
  const edgeSet = new Set();
  const edges = [];
  function add(from, to) {
    if (key(from) === key(to)) return;
    const edgeKey = `${key(from)}→${key(to)}`;
    if (edgeSet.has(edgeKey)) return;
    edgeSet.add(edgeKey);
    edges.push({ from: key(from), to: key(to) });
  }
  for (const [a, b] of states) {
    add([a,b], [capacityA,b]); add([a,b], [a,capacityB]);
    add([a,b], [0,b]); add([a,b], [a,0]);
    const toB = Math.min(a, capacityB - b); add([a,b], [a-toB,b+toB]);
    const toA = Math.min(b, capacityA - a); add([a,b], [a+toA,b-toA]);
  }
  return { directed: true, nodes: states.map(state => ({ id: key(state), label: key(state) })), edges };
}

function describeCanvas(canvas) {
  const nodeEntries = canvas.nodes.map(node => Array.isArray(node)
    ? [String(node[0]), String(node[1])]
    : typeof node === "object"
      ? [String(node.id), String(node.label)]
      : [String(node), String(node)]);
  const labels = new Map(nodeEntries);
  const edgeText = canvas.edges.map(edge => {
    const [from, to, detail] = Array.isArray(edge) ? edge : [edge.from, edge.to, edge.label];
    return `${labels.get(String(from)) || from}${canvas.directed ? "→" : "—"}${labels.get(String(to)) || to}${detail ? ` (${detail})` : ""}`;
  });
  return `Nodes: ${nodeEntries.map(([, label]) => label).join(", ")}. Direct ${canvas.directed ? "arrows" : "edges"}: ${edgeText.length ? edgeText.join("; ") : "none"}.`;
}

const division = specs.find(spec => spec.id === "evaluate-division");
const chain = division.cases.find(codeCase => codeCase.caseId === "build-chain");
chain.input = "equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2,3], queries = [[\"c\",\"a\"]]";
chain.buggyOutput = "[6]";
chain.correctOutput = "[0.16666666666666666]";
chain.rationale = "The reverse query c/a crosses two reciprocal edges: 1/3 then 1/2; the code wrongly reuses weights 3 and 2.";
const reciprocal = division.cases.find(codeCase => codeCase.caseId === "build-reciprocal");
reciprocal.input = "equations = [[\"x\",\"y\"]], values = [4], queries = [[\"y\",\"x\"]]";
reciprocal.correctOutput = "[0.25]";
reciprocal.rationale = "The reverse query y/x must use reciprocal weight 1/4, while the shown code stores 4 in both directions.";

const jug = specs.find(spec => spec.id === "water-and-jug-problem");
jug.cases.find(codeCase => codeCase.caseId === "build-sum").canvas = jugCanvas(1, 2);

for (const spec of specs) {
  const base = spec.cases[0];
  for (const codeCase of spec.cases.slice(1)) {
    const rationale = rationaleOverrides[`${spec.id}:${codeCase.caseId}`]
      || codeCase.rationale
      || codeCase.graphProof?.separatingFeature;
    codeCase.rationale = rationale;
    const current = new Map((codeCase.diagnoses || []).map(choice => [choice.id, choice]));
    codeCase.diagnoses = base.diagnoses.map(baseChoice => {
      const existing = current.get(baseChoice.id);
      const label = perCaseLabels[`${codeCase.caseId}:${baseChoice.id}`]
        || labelOverrides[baseChoice.id]
        || existing?.label
        || baseChoice.label;
      const feedback = baseChoice.id === base.correctDiagnosis
        ? `Correct. ${rationale} Therefore the shown code returns ${codeCase.buggyOutput}, while the real problem returns ${codeCase.correctOutput}.`
        : feedbackOverrides[baseChoice.id] || existing?.feedback || baseChoice.feedback;
      return { ...baseChoice, label, feedback };
    });
    codeCase.graphProof = {
      realGraph: describeCanvas(codeCase.canvas),
      codeRule: base.graphProof.codeRule,
      separatingFeature: rationale,
      outputConsequence: `The shown code returns ${codeCase.buggyOutput}; the source-repo reference solution returns ${codeCase.correctOutput}.`
    };
  }
}

fs.writeFileSync(file, `${JSON.stringify(specs, null, 2)}\n`);
console.log("Applied the fresh original Step 4 audit fixes.");
