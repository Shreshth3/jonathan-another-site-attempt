const fs = require("fs");
const path = require("path");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");

const root = path.resolve(__dirname, "..");
const specs = JSON.parse(fs.readFileSync(path.join(root, "visual-specs-original.json"), "utf8"));
const byId = new Map(specs.map(spec => [spec.id, spec]));

const canvas = (directed, labels, edgeList = []) => ({
  directed,
  nodes: labels.map(label => ({ id: label === "" ? "start" : String(label), label: label === "" ? "empty prefix" : String(label) })),
  edges: edgeList.map(edge => {
    const [from, to, label] = edge;
    return { from: from === "" ? "start" : String(from), to: to === "" ? "start" : String(to), ...(label == null ? {} : { label: String(label) }) };
  })
});

const choice = (id, label, feedback, misconception = null) => ({ id, label, feedback, misconception });

function build(id, title, facet, prompt, input, model, answer, wrong, why) {
  return {
    id, title, facet, prompt, input, canvas: model,
    decision: {
      prompt: answer.prompt,
      choices: [
        choice("correct", answer.label, answer.feedback),
        choice("near-miss", wrong.label, wrong.feedback, wrong.misconception)
      ],
      correct: "correct"
    },
    why
  };
}

function cloneModel(model) { return JSON.parse(JSON.stringify(model)); }

function omitLastEdge(model) {
  const copy = cloneModel(model);
  copy.edges = copy.edges.slice(0, -1);
  return copy;
}

function omitLastNode(model) {
  const copy = cloneModel(model);
  const removed = copy.nodes.pop();
  copy.edges = copy.edges.filter(edge => edge.from !== removed?.id && edge.to !== removed?.id);
  return copy;
}

function changeRelation(model) {
  const copy = cloneModel(model);
  if (copy.directed) copy.edges = copy.edges.map(edge => ({ ...edge, from: edge.to, to: edge.from }));
  else copy.directed = true;
  return copy;
}

function fromOld(question, id, title, facet, why) {
  return {
    id, title, facet, kind: "choice", prompt: question.prompt,
    input: question.input || question.prompt,
    choices: question.choices,
    correct: question.correct,
    why
  };
}

function remedialFor(concept, sourceBuild, index) {
  return {
    id: `remedial-${index + 1}`,
    title: `Fresh proof · ${concept.title}`,
    prompt: `Build this different input exactly. Then answer without using the revealed choice.`,
    input: sourceBuild.input,
    canvas: cloneModel(sourceBuild.canvas),
    decision: JSON.parse(JSON.stringify(sourceBuild.decision)),
    why: sourceBuild.why
  };
}

function record(profile) {
  const spec = byId.get(profile.id);
  if (!spec) throw new Error(`Unknown original ${profile.id}`);
  const [b1, b2, b3, b4, r1, r2, r3, r4, r5] = profile.cases;
  const exact = {
    id: "exact-picture", title: "Match every input detail", facet: profile.facets[0], kind: "visual-options",
    prompt: "Which picture exactly matches the fresh input?", input: b1.input,
    choices: [
      { ...choice("exact", "Picture A", "Correct. Every node and direct connection matches the input."), model: cloneModel(b1.canvas) },
      { ...choice("missing-edge", "Picture B", "This picture drops a connection that appears in the input.", "omit-listed-connection"), model: omitLastEdge(b1.canvas) },
      { ...choice("wrong-relation", "Picture C", "This reverses one-way relations or turns a two-way relation into one-way movement.", "change-edge-direction"), model: changeRelation(b1.canvas) },
      { ...choice("missing-node", "Picture D", "This drops an item that still exists even when it has no outgoing move.", "drop-isolated-or-sink-node"), model: omitLastNode(b1.canvas) }
    ], correct: "exact", why: "An exact model preserves every item and every direct relation; it never adds reachability shortcuts."
  };
  const concepts = [
    exact,
    fromOld(spec.nodeQuestion, "core-rule", "Protect the node rule", profile.facets[1], spec.nodeQuestion.choices.find(c => c.id === spec.nodeQuestion.correct).feedback),
    fromOld(spec.edgeQuestion, "relation-rule", "Protect the direct-relation rule", profile.facets[2], spec.edgeQuestion.choices.find(c => c.id === spec.edgeQuestion.correct).feedback),
    fromOld(spec.pictureQuestions[0], "predict-output", "Predict from the picture", profile.facets[3], spec.pictureQuestions[0].choices.find(c => c.id === spec.pictureQuestions[0].correct).feedback),
    fromOld(spec.pictureQuestions[1], "bug-trap", "Catch a near-miss implementation", profile.facets[3], spec.pictureQuestions[1].choices.find(c => c.id === spec.pictureQuestions[1].correct).feedback)
  ];
  [r1, r2, r3, r4, r5].forEach((source, index) => { concepts[index].remedial = remedialFor(concepts[index], source, index); });
  return { id: profile.id, facets: profile.facets, buildTasks: [b1, b2, b3, b4], conceptTasks: concepts };
}

const yes = (prompt, feedback = "Correct. The completed picture proves this result.") => ({ prompt, label: "true", feedback });
const no = (prompt, feedback = "Correct. The completed picture shows why this case fails.") => ({ prompt, label: "false", feedback });
const wrongBool = (label, feedback, misconception) => ({ label, feedback, misconception });
const exactOutput = (prompt, label, feedback, wrongLabel, wrongFeedback, misconception) => ({
  answer: { prompt, label, feedback }, wrong: { label: wrongLabel, feedback: wrongFeedback, misconception }
});
const b = (id, title, facet, input, model, answerLabel, wrongLabel, misconception, why, prompt = "Build every item and direct relation from this input, then decide.", decisionPrompt = "What should the function return?") => build(
  id, title, facet, prompt, input, model,
  { prompt: decisionPrompt, label: answerLabel, feedback: `Correct. ${why}` },
  { label: wrongLabel, feedback: `That result follows the ${misconception.replaceAll("-", " ")} bug, not the exact picture.`, misconception },
  why
);

const profiles = [];

// Profiles are intentionally explicit: the grader must compare the student's picture
// with a known-correct model, not with an SVG guessed from prose.

profiles.push({ id: "all-paths-from-source-to-target", facets: ["exact adjacency", "vertex identity", "arrow direction", "all complete paths"], cases: [
  b("build-diamond", "Build a branching DAG", "exact adjacency", "graph = [[1,2],[3],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[0,2],[1,3],[2,3]]), "[[0,1,3],[0,2,3]]", "[[0,1,3]]", "stop-after-first-path", "Both branches reach target 3, so both complete paths belong in the result."),
  b("build-direct-and-long", "Keep the direct path", "all complete paths", "graph = [[1,3],[2],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[0,3],[1,2],[2,3]]), "[[0,1,2,3],[0,3]]", "[[0,1,2,3]]", "miss-direct-path", "The direct edge 0→3 is a complete path as well as the longer branch."),
  b("build-merge", "Revisit a merge by path", "vertex identity", "graph = [[1,2],[3],[3],[4],[]]", canvas(true,[0,1,2,3,4],[[0,1],[0,2],[1,3],[2,3],[3,4]]), "[[0,1,3,4],[0,2,3,4]]", "[[0,1,3,4]]", "global-visited-prunes-path", "A DAG may merge at node 3; both distinct prefixes still make valid paths."),
  b("build-single-edge", "Handle the smallest route", "all complete paths", "graph = [[1],[]]", canvas(true,[0,1],[[0,1]]), "[[0,1]]", "[]", "ignore-direct-target", "The single listed arrow already reaches the target."),
  b("fresh-exact", "Fresh split picture", "exact adjacency", "graph = [[2],[2],[]]", canvas(true,[0,1,2],[[0,2],[1,2]]), "[[0,2]]", "[[0,2],[0,1,2]]", "invent-unlisted-edge", "Only paths beginning at node 0 count, and 0 has only the direct arrow to 2."),
  b("fresh-node", "Fresh sink-node proof", "vertex identity", "graph = [[],[0]]", canvas(true,[0,1],[[1,0]]), "[]", "[[0]]", "treat-start-as-complete-without-target", "Source 0 is not target 1 and has no outgoing arrow."),
  b("fresh-direction", "Fresh one-way proof", "arrow direction", "graph = [[],[0],[]]", canvas(true,[0,1,2],[[1,0]]), "[]", "[[0,1,2]]", "reverse-arrows", "An arrow into node 0 cannot be followed out of node 0."),
  b("fresh-predict", "Fresh two-route proof", "all complete paths", "graph = [[1,2],[2],[]]", canvas(true,[0,1,2],[[0,1],[0,2],[1,2]]), "[[0,1,2],[0,2]]", "[[0,1,2]]", "miss-shorter-path", "Both the two-edge route and direct route end at target 2."),
  b("fresh-counterexample", "Catch shared visited state", "all complete paths", "graph = [[1,2],[3],[3],[4],[]]", canvas(true,[0,1,2,3,4],[[0,1],[0,2],[1,3],[2,3],[3,4]]), "2 paths", "1 path", "global-visited-prunes-merge", "Two routes may share a suffix without becoming the same path.", undefined, "How many complete paths should be returned?")
]});

profiles.push({ id: "battleships-in-a-board", facets: ["exact ship cells", "cell identity", "side adjacency", "component count"], cases: [
  b("build-two-ships", "Build two ships", "component count", "board = [[\"X\",\".\",\".\",\"X\"],[\".\",\".\",\".\",\"X\"],[\".\",\".\",\".\",\"X\"]]", canvas(false,["0,0","0,3","1,3","2,3"],[["0,3","1,3"],["1,3","2,3"]]), "2", "4", "count-every-x-cell", "The lone X is one component and the vertical run is a second ship."),
  b("build-one-horizontal", "Build one long ship", "side adjacency", "board = [[\"X\",\"X\",\"X\"]]", canvas(false,["0,0","0,1","0,2"],[["0,0","0,1"],["0,1","0,2"]]), "1", "3", "count-cells-not-components", "All three X cells connect through shared sides."),
  b("build-separated", "Respect water gaps", "exact ship cells", "board = [[\"X\",\".\",\"X\"]]", canvas(false,["0,0","0,2"],[]), "2", "1", "jump-across-water", "Water between the X cells prevents an edge."),
  b("build-empty", "Handle one-cell ship", "cell identity", "board = [[\"X\"]]", canvas(false,["0,0"],[]), "1", "0", "require-neighbor-for-ship", "A lone X is still a complete one-cell ship."),
  b("fresh-exact", "Fresh corner-separated ships", "exact ship cells", "board = [[\"X\",\".\"],[\".\",\"X\"]]", canvas(false,["0,0","1,1"],[]), "2", "1", "connect-diagonals", "Corner contact does not connect ship cells."),
  b("fresh-node", "Fresh water exclusion", "cell identity", "board = [[\".\",\"X\"]]", canvas(false,["0,1"],[]), "1", "2", "include-water-node", "Only the X cell belongs to the ship graph."),
  b("fresh-relation", "Fresh straight ship", "side adjacency", "board = [[\"X\",\"X\"]]", canvas(false,["0,0","0,1"],[["0,0","0,1"]]), "1", "2", "count-cells-not-ships", "The two side-connected X cells form one valid straight ship."),
  b("fresh-predict", "Fresh three ships", "component count", "board = [[\"X\",\".\",\"X\"],[\"X\",\".\",\".\"]]", canvas(false,["0,0","1,0","0,2"],[["0,0","1,0"]]), "2", "3", "count-every-x-cell", "The left pair is one ship; the top-right X is another."),
  b("fresh-counterexample", "Catch diagonal merging", "component count", "board = [[\"X\",\".\"],[\".\",\"X\"]]", canvas(false,["0,0","1,1"],[]), "2", "1", "eight-direction-dfs", "A DFS using eight directions would incorrectly merge these two ships.")
]});

profiles.push({ id: "course-schedule", facets: ["exact prerequisites", "course identity", "dependency direction", "cycle detection"], cases: [
  b("build-chain", "Build a legal chain", "dependency direction", "numCourses = 3, prerequisites = [[1,0],[2,1]]", canvas(true,[0,1,2],[[0,1],[1,2]]), "true", "false", "treat-dependency-as-cycle", "The arrows form a chain with no way back to an active course."),
  b("build-two-cycle", "Expose a two-course cycle", "cycle detection", "numCourses = 2, prerequisites = [[1,0],[0,1]]", canvas(true,[0,1],[[0,1],[1,0]]), "false", "true", "mark-visited-too-early", "Each course depends on the other, so neither can be completed first."),
  b("build-isolated", "Keep an isolated course", "course identity", "numCourses = 3, prerequisites = [[1,0]]", canvas(true,[0,1,2],[[0,1]]), "true", "false", "drop-isolated-course", "Course 2 still exists, but it introduces no cycle."),
  b("build-self-loop", "Catch a three-course cycle", "cycle detection", "numCourses = 3, prerequisites = [[1,0],[2,1],[0,2]]", canvas(true,[0,1,2],[[0,1],[1,2],[2,0]]), "false", "true", "mark-visited-too-early", "The arrows return from course 2 to course 0, closing a cycle."),
  b("fresh-exact", "Fresh fork", "exact prerequisites", "numCourses = 3, prerequisites = [[1,0],[2,0]]", canvas(true,[0,1,2],[[0,1],[0,2]]), "true", "false", "confuse-branch-with-cycle", "A fork has no return arrow to course 0."),
  b("fresh-node", "Fresh empty schedule", "course identity", "numCourses = 2, prerequisites = []", canvas(true,[0,1],[]), "true", "false", "require-prerequisite-edge", "Courses with no prerequisites can both be completed."),
  b("fresh-direction", "Fresh listed-pair proof", "dependency direction", "numCourses = 2, prerequisites = [[1,0]]", canvas(true,[0,1],[[0,1]]), "true", "false", "reverse-pair-semantics", "The pair means 0 must come before 1; either orientation is acyclic here, but the exact picture is 0→1."),
  b("fresh-predict", "Fresh hidden cycle", "cycle detection", "numCourses = 4, prerequisites = [[1,0],[2,1],[0,2],[3,2]]", canvas(true,[0,1,2,3],[[0,1],[1,2],[2,0],[2,3]]), "false", "true", "stop-after-acyclic-branch", "The 0→1→2→0 cycle remains even though course 3 is a harmless branch."),
  b("fresh-counterexample", "Catch global-visited cycle logic", "cycle detection", "numCourses = 3, prerequisites = [[1,0],[2,0],[2,1]]", canvas(true,[0,1,2],[[0,1],[0,2],[1,2]]), "true", "false", "treat-shared-descendant-as-cycle", "Two paths reaching course 2 do not form a cycle because no arrow returns to an active ancestor.")
]});

profiles.push({ id: "detonate-the-maximum-bombs", facets: ["exact bomb reach", "bomb identity", "one-way blast edges", "largest chain reaction"], cases: [
  b("build-one-way", "Build asymmetric blast reach", "one-way blast edges", "bombs = [[0,0,5],[4,0,1]]", canvas(true,["A","B"],[["A","B"]]), "2", "1", "require-mutual-reach", "Bomb A reaches B; B does not need to reach A for A to trigger both."),
  b("build-separated", "Build separated bombs", "exact bomb reach", "bombs = [[0,0,1],[4,0,1]]", canvas(true,["A","B"],[]), "1", "2", "compare-diameter-not-radius", "Neither center lies inside the other's radius."),
  b("build-chain", "Follow a full chain reaction", "largest chain reaction", "bombs = [[0,0,3],[3,0,3],[6,0,1]]", canvas(true,["A","B","C"],[["A","B"],["B","A"],["B","C"]]), "3", "2", "count-only-direct-blasts", "Starting at A reaches B, which then reaches C."),
  b("build-single", "Handle one bomb", "bomb identity", "bombs = [[2,7,4]]", canvas(true,["A"],[]), "1", "0", "count-only-triggered-neighbors", "The starting bomb itself counts in the detonation total."),
  b("fresh-exact", "Fresh asymmetric pair", "exact bomb reach", "bombs = [[0,0,2],[2,0,5]]", canvas(true,["A","B"],[["A","B"],["B","A"]]), "2", "1", "miss-boundary-reach", "A center exactly on the radius boundary is reachable, and B also reaches A."),
  b("fresh-node", "Fresh duplicate centers", "bomb identity", "bombs = [[0,0,1],[0,0,2]]", canvas(true,["A","B"],[["A","B"],["B","A"]]), "2", "1", "merge-same-coordinate-bombs", "Two input rows are two bombs even when their centers match."),
  b("fresh-direction", "Fresh one-way radius", "one-way blast edges", "bombs = [[0,0,1],[1,0,4],[5,0,1]]", canvas(true,["A","B","C"],[["A","B"],["B","A"],["B","C"],["C","B"]]), "3", "2", "discard-directed-reach", "Starting at A triggers B, and B reaches C."),
  b("fresh-predict", "Fresh best starting bomb", "largest chain reaction", "bombs = [[0,0,1],[3,0,3],[6,0,3]]", canvas(true,["A","B","C"],[["B","A"],["B","C"],["C","B"]]), "3", "2", "always-start-first-bomb", "Starting at B reaches both other bombs; starting at A would not."),
  b("fresh-counterexample", "Catch direct-only counting", "largest chain reaction", "bombs = [[0,0,2],[2,0,2],[4,0,1]]", canvas(true,["A","B","C"],[["A","B"],["B","A"],["B","C"]]), "3", "2", "count-only-outdegree", "A reaches only B directly, but B continues the chain to C.")
]});

profiles.push({ id: "evaluate-division", facets: ["exact equations", "variable identity", "reciprocal weighted edges", "path products"], cases: [
  b("build-chain", "Build a ratio chain", "path products", "equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2,3], query = [\"a\",\"c\"]", canvas(true,["a","b","c"],[["a","b","2"],["b","a","0.5"],["b","c","3"],["c","b","1/3"]]), "6", "5", "add-ratios", "Following a→b→c multiplies 2×3."),
  b("build-reciprocal", "Use the reciprocal edge", "reciprocal weighted edges", "equations = [[\"x\",\"y\"]], values = [4], query = [\"y\",\"x\"]", canvas(true,["x","y"],[["x","y","4"],["y","x","0.25"]]), "0.25", "4", "reuse-forward-weight", "The reverse edge carries the reciprocal 1/4."),
  b("build-unknown", "Keep unknown variables out", "variable identity", "equations = [[\"a\",\"b\"]], values = [2], query = [\"a\",\"z\"]", canvas(true,["a","b"],[["a","b","2"],["b","a","0.5"]]), "-1", "1", "unknown-self-or-target-equals-one", "Variable z never appears in the equation graph."),
  b("build-known-self", "Handle a known self-query", "variable identity", "equations = [[\"a\",\"b\"]], values = [2], query = [\"a\",\"a\"]", canvas(true,["a","b"],[["a","b","2"],["b","a","0.5"]]), "1", "-1", "reject-zero-edge-path", "Known variable a divided by itself is the empty product 1."),
  b("fresh-exact", "Fresh direct ratio", "exact equations", "equations = [[\"m\",\"n\"]], values = [5], query = [\"m\",\"n\"]", canvas(true,["m","n"],[["m","n","5"],["n","m","0.2"]]), "5", "0.2", "reverse-query", "The query follows the forward m→n edge."),
  b("fresh-node", "Fresh disconnected variables", "variable identity", "equations = [[\"a\",\"b\"],[\"c\",\"d\"]], values = [2,4], query = [\"a\",\"d\"]", canvas(true,["a","b","c","d"],[["a","b","2"],["b","a","0.5"],["c","d","4"],["d","c","0.25"]]), "-1", "8", "multiply-across-components", "No path connects the two equation components."),
  b("fresh-relation", "Fresh reciprocal chain", "reciprocal weighted edges", "equations = [[\"p\",\"q\"],[\"q\",\"r\"]], values = [2,5], query = [\"r\",\"p\"]", canvas(true,["p","q","r"],[["p","q","2"],["q","p","0.5"],["q","r","5"],["r","q","0.2"]]), "0.1", "10", "ignore-reciprocals", "r→q→p multiplies 1/5 by 1/2."),
  b("fresh-predict", "Fresh three-edge product", "path products", "equations = [[\"a\",\"b\"],[\"b\",\"c\"],[\"c\",\"d\"]], values = [2,3,4], query = [\"a\",\"d\"]", canvas(true,["a","b","c","d"],[["a","b","2"],["b","a","0.5"],["b","c","3"],["c","b","1/3"],["c","d","4"],["d","c","0.25"]]), "24", "9", "add-ratios", "The path product is 2×3×4."),
  b("fresh-counterexample", "Catch missing reciprocal edges", "reciprocal weighted edges", "equations = [[\"u\",\"v\"],[\"v\",\"w\"]], values = [3,2], query = [\"w\",\"u\"]", canvas(true,["u","v","w"],[["u","v","3"],["v","u","1/3"],["v","w","2"],["w","v","0.5"]]), "0.16666666666666666", "-1", "store-forward-edges-only", "The reverse query succeeds only when reciprocal edges are stored.")
]});

profiles.push({ id: "find-if-path-exists-in-graph", facets: ["exact edge list", "all n vertices", "two-way edges", "reachability"], cases: [
  b("build-triangle", "Build a connected triangle", "reachability", "n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2", canvas(false,[0,1,2],[[0,1],[1,2],[2,0]]), "true", "false", "search-direct-edge-only", "A route exists directly and through node 1."),
  b("build-components", "Keep components separate", "exact edge list", "n = 6, edges = [[0,1],[0,2],[3,5],[5,4]], source = 0, destination = 5", canvas(false,[0,1,2,3,4,5],[[0,1],[0,2],[3,5],[5,4]]), "false", "true", "assume-all-listed-vertices-connect", "Source 0 and destination 5 are in different components."),
  b("build-reverse-travel", "Use an undirected edge backward", "two-way edges", "n = 2, edges = [[1,0]], source = 0, destination = 1", canvas(false,[0,1],[[1,0]]), "true", "false", "treat-edge-as-directed", "The edge can be crossed from 0 to 1 even though the pair lists 1 first."),
  b("build-same-node", "Handle source equals destination", "all n vertices", "n = 3, edges = [], source = 2, destination = 2", canvas(false,[0,1,2],[]), "true", "false", "require-at-least-one-edge", "The zero-edge path already starts and ends at node 2."),
  b("fresh-exact", "Fresh chain", "exact edge list", "n = 4, edges = [[0,1],[1,2]], source = 0, destination = 3", canvas(false,[0,1,2,3],[[0,1],[1,2]]), "false", "true", "connect-isolated-destination", "Node 3 exists but has no edge to the chain."),
  b("fresh-node", "Fresh isolated endpoint", "all n vertices", "n = 3, edges = [[0,1]], source = 2, destination = 0", canvas(false,[0,1,2],[[0,1]]), "false", "true", "drop-isolated-source", "Source node 2 is isolated, not absent."),
  b("fresh-relation", "Fresh reverse chain", "two-way edges", "n = 3, edges = [[1,0],[2,1]], source = 0, destination = 2", canvas(false,[0,1,2],[[1,0],[2,1]]), "true", "false", "follow-pair-order-only", "Both undirected edges may be crossed against their written order."),
  b("fresh-predict", "Fresh detour", "reachability", "n = 5, edges = [[0,1],[1,4],[0,2],[2,3],[3,4]], source = 0, destination = 4", canvas(false,[0,1,2,3,4],[[0,1],[1,4],[0,2],[2,3],[3,4]]), "true", "false", "stop-after-first-failed-branch", "At least one branch reaches 4; a failed branch would not disprove reachability."),
  b("fresh-counterexample", "Catch direct-neighbor checks", "reachability", "n = 4, edges = [[0,1],[1,2],[2,3]], source = 0, destination = 3", canvas(false,[0,1,2,3],[[0,1],[1,2],[2,3]]), "true", "false", "check-only-source-neighbors", "The destination is three edges away but remains reachable.")
]});

profiles.push({ id: "flatten-nested-list-iterator", facets: ["exact nesting", "item identity", "parent-child containment", "left-to-right flattening"], cases: [
  b("build-mixed", "Build a mixed nested list", "left-to-right flattening", "nestedList = [[1,1],2,[1,1]]", canvas(true,["root","L1","1a","1b","2","L2","1c","1d"],[["root","L1"],["L1","1a"],["L1","1b"],["root","2"],["root","L2"],["L2","1c"],["L2","1d"]]), "[1,1,2,1,1]", "[2,1,1,1,1]", "emit-shallow-items-first", "Depth changes do not change the original left-to-right order."),
  b("build-deep", "Build a deep chain", "exact nesting", "nestedList = [1,[4,[6]]]", canvas(true,["root","1","L1","4","L2","6"],[["root","1"],["root","L1"],["L1","4"],["L1","L2"],["L2","6"]]), "[1,4,6]", "[6,4,1]", "reverse-depth-first-output", "DFS enters inner lists but yields integers in encounter order."),
  b("build-empty-inner", "Keep an empty list node", "item identity", "nestedList = [[],2]", canvas(true,["root","empty","2"],[["root","empty"],["root","2"]]), "[2]", "[[],2]", "emit-list-objects", "The empty list exists in the structure but contributes no integer."),
  b("build-empty-root", "Handle an empty root", "left-to-right flattening", "nestedList = []", canvas(true,["root"],[]), "[]", "[0]", "invent-default-value", "No integer appears anywhere in the input."),
  b("fresh-exact", "Fresh sibling lists", "exact nesting", "nestedList = [[1],[2]]", canvas(true,["root","A","1","B","2"],[["root","A"],["A","1"],["root","B"],["B","2"]]), "[1,2]", "[2,1]", "reverse-sibling-order", "The first child list is flattened before the second."),
  b("fresh-node", "Fresh repeated integers", "item identity", "nestedList = [1,[1]]", canvas(true,["root","1a","L","1b"],[["root","1a"],["root","L"],["L","1b"]]), "[1,1]", "[1]", "merge-equal-integer-occurrences", "Equal values in different positions are separate items."),
  b("fresh-relation", "Fresh containment proof", "parent-child containment", "nestedList = [[[3]],4]", canvas(true,["root","L1","L2","3","4"],[["root","L1"],["L1","L2"],["L2","3"],["root","4"]]), "[3,4]", "[4,3]", "flatten-breadth-first", "Containment edges preserve the deep 3 before the later top-level 4."),
  b("fresh-predict", "Fresh mixed depth", "left-to-right flattening", "nestedList = [1,[[2],3],4]", canvas(true,["root","1","L1","L2","2","3","4"],[["root","1"],["root","L1"],["L1","L2"],["L2","2"],["L1","3"],["root","4"]]), "[1,2,3,4]", "[1,3,2,4]", "emit-list-direct-integers-before-nested", "Nested list contents appear exactly where that list occurs."),
  b("fresh-counterexample", "Catch value de-duplication", "item identity", "nestedList = [[2],2,[2]]", canvas(true,["root","A","2a","2b","B","2c"],[["root","A"],["A","2a"],["root","2b"],["root","B"],["B","2c"]]), "[2,2,2]", "[2]", "use-set-for-output", "Flattening preserves repeated occurrences rather than unique values.")
]});

profiles.push({ id: "is-graph-bipartite", facets: ["exact adjacency", "all vertices", "two-way conflicts", "two-color consistency"], cases: [
  b("build-square", "Color an even cycle", "two-color consistency", "graph = [[1,3],[0,2],[1,3],[0,2]]", canvas(false,[0,1,2,3],[[0,1],[0,3],[1,2],[2,3]]), "true", "false", "reject-any-cycle", "An even cycle alternates cleanly between two groups."),
  b("build-triangle", "Expose an odd cycle", "two-color consistency", "graph = [[1,2],[0,2],[0,1]]", canvas(false,[0,1,2],[[0,1],[0,2],[1,2]]), "false", "true", "color-neighbors-without-conflict-check", "A triangle forces its third edge to join equal colors."),
  b("build-disconnected", "Check every component", "all vertices", "graph = [[1],[0],[3,4],[2,4],[2,3]]", canvas(false,[0,1,2,3,4],[[0,1],[2,3],[2,4],[3,4]]), "false", "true", "search-only-component-zero", "The component containing 0 is fine, but the separate triangle is not."),
  b("build-isolated", "Handle isolated vertices", "all vertices", "graph = [[],[]]", canvas(false,[0,1],[]), "true", "false", "require-every-node-to-have-opposite-neighbor", "Each isolated vertex can belong to either group without conflict."),
  b("fresh-exact", "Fresh path", "exact adjacency", "graph = [[1],[0,2],[1]]", canvas(false,[0,1,2],[[0,1],[1,2]]), "true", "false", "reject-three-vertex-component", "A path alternates colors with no conflict."),
  b("fresh-node", "Fresh hidden component", "all vertices", "graph = [[],[2,3],[1,3],[1,2]]", canvas(false,[0,1,2,3],[[1,2],[1,3],[2,3]]), "false", "true", "skip-index-with-empty-zero-component", "Node 0 is isolated, but nodes 1–3 form a non-bipartite triangle."),
  b("fresh-relation", "Fresh undirected conflict", "two-way conflicts", "graph = [[1],[0]]", canvas(false,[0,1],[[0,1]]), "true", "false", "require-two-directed-edges-in-model", "The symmetric adjacency entries describe one undirected conflict edge."),
  b("fresh-predict", "Fresh even cycle with tail", "two-color consistency", "graph = [[1,3],[0,2],[1,3,4],[0,2],[2]]", canvas(false,[0,1,2,3,4],[[0,1],[0,3],[1,2],[2,3],[2,4]]), "true", "false", "treat-tail-as-third-group", "The square alternates; the tail simply takes the color opposite node 2."),
  b("fresh-counterexample", "Catch one-component coloring", "all vertices", "graph = [[1],[0],[3,4],[2,4],[2,3]]", canvas(false,[0,1,2,3,4],[[0,1],[2,3],[2,4],[3,4]]), "false", "true", "start-dfs-only-at-zero", "A correct algorithm must start a color search in every uncolored component.")
]});

profiles.push({ id: "keys-and-rooms", facets: ["exact room lists", "room identity", "key direction", "reach all rooms"], cases: [
  b("build-chain", "Unlock a full chain", "reach all rooms", "rooms = [[1],[2],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[1,2],[2,3]]), "true", "false", "check-only-start-room-keys", "Keys found later continue the route until every room is reached."),
  b("build-locked", "Keep an unreachable room", "reach all rooms", "rooms = [[1],[0],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[1,0],[2,3]]), "false", "true", "start-search-in-every-room", "Room 2 has a key, but no reachable room gives access to room 2."),
  b("build-back-key", "Do not reverse a key", "key direction", "rooms = [[],[0]]", canvas(true,[0,1],[[1,0]]), "false", "true", "treat-keys-as-undirected", "A key stored in locked room 1 cannot help you enter room 1 from room 0."),
  b("build-one-room", "Handle one starting room", "room identity", "rooms = [[]]", canvas(true,[0],[]), "true", "false", "require-at-least-one-key", "Room 0 starts unlocked, so the only room is already visited."),
  b("fresh-exact", "Fresh fork of keys", "exact room lists", "rooms = [[1,2],[],[]]", canvas(true,[0,1,2],[[0,1],[0,2]]), "true", "false", "follow-only-first-key", "Room 0 directly unlocks both other rooms."),
  b("fresh-node", "Fresh empty-key room", "room identity", "rooms = [[1],[],[0]]", canvas(true,[0,1,2],[[0,1],[2,0]]), "false", "true", "drop-room-with-empty-key-list", "Room 1 exists with no keys; room 2 also exists but cannot be entered."),
  b("fresh-direction", "Fresh inward key", "key direction", "rooms = [[1],[],[0]]", canvas(true,[0,1,2],[[0,1],[2,0]]), "false", "true", "reverse-incoming-key", "The key 2→0 cannot be used while room 2 remains locked."),
  b("fresh-predict", "Fresh cycle plus exit", "reach all rooms", "rooms = [[1],[0,2],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[1,0],[1,2],[2,3]]), "true", "false", "stop-when-cycle-seen", "The 0↔1 cycle does not block the extra key from 1 to 2."),
  b("fresh-counterexample", "Catch key existence counting", "reach all rooms", "rooms = [[1],[0],[3],[2]]", canvas(true,[0,1,2,3],[[0,1],[1,0],[2,3],[3,2]]), "false", "true", "count-all-mentioned-keys-as-reachable", "Every room number appears in some key list, but rooms 2 and 3 are in a locked component.")
]});

profiles.push({ id: "kill-process", facets: ["exact pid rows", "process identity", "parent-to-child edges", "killed subtree"], cases: [
  b("build-subtree", "Build the killed subtree", "killed subtree", "pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5", canvas(true,[1,3,10,5],[[3,1],[5,10],[3,5]]), "[5,10]", "[3,5,10]", "include-ancestor", "Killing 5 spreads down to 10, not up to parent 3."),
  b("build-root", "Kill from the root", "parent-to-child edges", "pid = [1,2,3], ppid = [0,1,1], kill = 1", canvas(true,[1,2,3],[[1,2],[1,3]]), "[1,2,3]", "[1]", "kill-only-selected-process", "Both children lie below process 1."),
  b("build-leaf", "Kill a leaf only", "killed subtree", "pid = [1,2,3], ppid = [0,1,1], kill = 2", canvas(true,[1,2,3],[[1,2],[1,3]]), "[2]", "[1,2]", "kill-parent-too", "A leaf has no descendants, and killing it does not affect its parent."),
  b("build-single", "Handle one process", "process identity", "pid = [7], ppid = [0], kill = 7", canvas(true,[7],[]), "[7]", "[]", "return-descendants-only", "The selected process itself always dies."),
  b("fresh-exact", "Fresh chain", "exact pid rows", "pid = [4,8,9], ppid = [0,4,8], kill = 4", canvas(true,[4,8,9],[[4,8],[8,9]]), "[4,8,9]", "[4,8]", "stop-at-grandchildren", "The effect continues through every descendant depth."),
  b("fresh-node", "Fresh fake-root marker", "process identity", "pid = [2,6], ppid = [0,2], kill = 2", canvas(true,[2,6],[[2,6]]), "[2,6]", "[0,2,6]", "include-ppid-zero", "Zero is a parent marker, not a process node in pid."),
  b("fresh-direction", "Fresh parent direction", "parent-to-child edges", "pid = [5,9], ppid = [0,5], kill = 9", canvas(true,[5,9],[[5,9]]), "[9]", "[5,9]", "reverse-parent-child-edge", "Killing child 9 does not travel backward to parent 5."),
  b("fresh-predict", "Fresh branch", "killed subtree", "pid = [1,2,3,4], ppid = [0,1,1,2], kill = 2", canvas(true,[1,2,3,4],[[1,2],[1,3],[2,4]]), "[2,4]", "[2,3,4]", "include-sibling", "Process 3 is a sibling, not a descendant of 2."),
  b("fresh-counterexample", "Catch direct-child-only logic", "killed subtree", "pid = [1,2,3], ppid = [0,1,2], kill = 1", canvas(true,[1,2,3],[[1,2],[2,3]]), "[1,2,3]", "[1,2]", "collect-only-direct-children", "Grandchild 3 must also be killed.")
]});

profiles.push({ id: "letter-combinations-of-a-phone-number", facets: ["exact digit string", "prefix states", "one-letter choices", "all leaf strings"], cases: [
  b("build-two-digits", "Build every choice for digit 2", "all leaf strings", "digits = \"2\"", canvas(true,["","a","b","c"],[["","a"],["","b"],["","c"]]), "[\"a\",\"b\",\"c\"]", "[\"a\",\"b\"]", "drop-last-keypad-letter", "Digit 2 has three complete one-letter combinations."),
  b("build-four-letter-digit", "Use all four letters", "one-letter choices", "digits = \"7\"", canvas(true,["","p","q","r","s"],[["","p"],["","q"],["","r"],["","s"]]), "[\"p\",\"q\",\"r\",\"s\"]", "[\"p\",\"q\",\"r\"]", "assume-three-letters-per-digit", "Digit 7 maps to four letters, including s."),
  b("build-order", "Read digit 3 exactly", "exact digit string", "digits = \"3\"", canvas(true,["","d","e","f"],[["","d"],["","e"],["","f"]]), "[\"d\",\"e\",\"f\"]", "[\"a\",\"b\",\"c\"]", "use-previous-keypad-row", "Digit 3 maps to d, e, and f, not digit 2's letters."),
  b("build-empty", "Handle no digits", "all leaf strings", "digits = \"\"", canvas(true,[""],[]), "[]", "[\"\"]", "emit-empty-prefix", "The problem defines empty input as no combinations."),
  b("fresh-exact", "Fresh digit 9", "exact digit string", "digits = \"9\"", canvas(true,["","w","x","y","z"],[["","w"],["","x"],["","y"],["","z"]]), "4 combinations", "3 combinations", "drop-last-keypad-letter", "Digit 9 has w, x, y, and z."),
  b("fresh-node", "Fresh prefix choices", "prefix states", "digits = \"6\"", canvas(true,["","m","n","o"],[["","m"],["","n"],["","o"]]), "3 combinations", "1 combination", "merge-sibling-prefixes", "The three different one-letter prefixes are three separate leaf states."),
  b("fresh-relation", "Fresh four-way extension", "one-letter choices", "digits = \"7\"", canvas(true,["","p","q","r","s"],[["","p"],["","q"],["","r"],["","s"]]), "4 combinations", "3 combinations", "assume-three-letters-per-key", "Digit 7 has four legal one-letter extensions."),
  b("fresh-predict", "Fresh single digit", "all leaf strings", "digits = \"8\"", canvas(true,["","t","u","v"],[["","t"],["","u"],["","v"]]), "[\"t\",\"u\",\"v\"]", "[\"8t\",\"8u\",\"8v\"]", "keep-digit-in-output", "Outputs contain selected letters, not the original digit."),
  b("fresh-counterexample", "Catch missing fourth letter", "all leaf strings", "digits = \"9\"", canvas(true,["","w","x","y","z"],[["","w"],["","x"],["","y"],["","z"]]), "4 unique combinations", "3 combinations", "hardcode-three-letters-per-digit", "A loop hard-coded to three choices misses z on digit 9.")
]});

profiles.push({ id: "longest-increasing-path-in-a-matrix", facets: ["exact cell values", "cell identity", "increasing side moves", "longest path length"], cases: [
  b("build-chain", "Build an increasing chain", "longest path length", "matrix = [[1,2],[4,3]]", canvas(true,["0,0=1","0,1=2","1,0=4","1,1=3"],[["0,0=1","0,1=2"],["0,0=1","1,0=4"],["0,1=2","1,1=3"],["1,1=3","1,0=4"]]), "4", "3", "count-edges-not-nodes", "The path 1→2→3→4 contains four cells."),
  b("build-equals", "Reject equal-value moves", "increasing side moves", "matrix = [[2,2],[2,3]]", canvas(true,["0,0=2","0,1=2","1,0=2","1,1=3"],[["0,1=2","1,1=3"],["1,0=2","1,1=3"]]), "2", "3", "allow-equal-step", "Equal 2s do not form increasing edges."),
  b("build-diagonal", "Reject diagonal shortcuts", "cell identity", "matrix = [[1,9],[9,2]]", canvas(true,["0,0=1","0,1=9","1,0=9","1,1=2"],[["0,0=1","0,1=9"],["0,0=1","1,0=9"],["1,1=2","0,1=9"],["1,1=2","1,0=9"]]), "2", "3", "allow-diagonal-step", "The diagonal 1→2 is not a legal move."),
  b("build-single", "Handle one cell", "longest path length", "matrix = [[7]]", canvas(true,["0,0=7"],[]), "1", "0", "count-only-moves", "A one-cell path has length one even with no edge."),
  b("fresh-exact", "Fresh vertical rise", "exact cell values", "matrix = [[1],[2],[3]]", canvas(true,["0,0=1","1,0=2","2,0=3"],[["0,0=1","1,0=2"],["1,0=2","2,0=3"]]), "3", "2", "count-edges-not-cells", "All three cells form one increasing path."),
  b("fresh-node", "Fresh repeated values", "cell identity", "matrix = [[1,1]]", canvas(true,["0,0=1","0,1=1"],[]), "1", "2", "merge-or-connect-equal-values", "Two equal cells are distinct nodes but no increasing edge joins them."),
  b("fresh-relation", "Fresh downhill input", "increasing side moves", "matrix = [[3,2,1]]", canvas(true,["0,0=3","0,1=2","0,2=1"],[["0,1=2","0,0=3"],["0,2=1","0,1=2"]]), "3", "1", "follow-only-input-reading-direction", "Edges point from smaller to larger, so the path is 1→2→3."),
  b("fresh-predict", "Fresh branching maximum", "longest path length", "matrix = [[1,2],[2,3]]", canvas(true,["0,0=1","0,1=2","1,0=2","1,1=3"],[["0,0=1","0,1=2"],["0,0=1","1,0=2"],["0,1=2","1,1=3"],["1,0=2","1,1=3"]]), "3", "4", "combine-two-branches", "A path chooses one of the 2-valued branches; it cannot use both."),
  b("fresh-counterexample", "Catch global visited pruning", "longest path length", "matrix = [[1,2],[2,3]]", canvas(true,["0,0=1","0,1=2","1,0=2","1,1=3"],[["0,0=1","0,1=2"],["0,0=1","1,0=2"],["0,1=2","1,1=3"],["1,0=2","1,1=3"]]), "3", "2", "global-visited-skips-shared-tail", "Both branches may reach 3; memoization stores a length without deleting the node globally.")
]});

profiles.push({ id: "minesweeper", facets: ["exact board", "cell identity", "eight-neighbor reveal", "stop and expand rules"], cases: [
  b("build-number", "Reveal beside a mine", "stop and expand rules", "board = [[\"E\",\"M\"]], click = [0,0]", canvas(false,["0,0=E","0,1=M"],[["0,0=E","0,1=M"]]), "[[\"1\",\"M\"]]", "[[\"B\",\"M\"]]", "ignore-adjacent-mine-count", "The clicked cell touches one mine, so it becomes 1 and does not expand."),
  b("build-mine", "Click a mine", "cell identity", "board = [[\"E\",\"M\"]], click = [0,1]", canvas(false,["0,0=E","0,1=M"],[["0,0=E","0,1=M"]]), "[[\"E\",\"X\"]]", "[[\"E\",\"M\"]]", "leave-clicked-mine-unchanged", "A clicked mine changes to X immediately."),
  b("build-diagonal-count", "Count a diagonal mine", "eight-neighbor reveal", "board = [[\"M\",\"E\"],[\"E\",\"E\"]], click = [1,1]", canvas(false,["0,0=M","0,1=E","1,0=E","1,1=E"],[["0,0=M","0,1=E"],["0,0=M","1,0=E"],["0,0=M","1,1=E"],["0,1=E","1,0=E"],["0,1=E","1,1=E"],["1,0=E","1,1=E"]]), "clicked cell becomes 1", "clicked cell becomes B", "count-only-four-neighbor-mines", "Mines in all eight neighboring positions count, including corners."),
  b("build-empty-expand", "Expand a blank region", "stop and expand rules", "board = [[\"E\",\"E\"]], click = [0,0]", canvas(false,["0,0=E","0,1=E"],[["0,0=E","0,1=E"]]), "[[\"B\",\"B\"]]", "[[\"B\",\"E\"]]", "reveal-only-clicked-empty", "A zero-mine blank expands to its unrevealed neighbor."),
  b("fresh-exact", "Fresh three cells", "exact board", "board = [[\"E\",\"E\",\"M\"]], click = [0,0]", canvas(false,["0,0=E","0,1=E","0,2=M"],[["0,0=E","0,1=E"],["0,1=E","0,2=M"]]), "[[\"B\",\"1\",\"M\"]]", "[[\"B\",\"B\",\"M\"]]", "expand-through-numbered-cell", "The first cell expands, but the middle cell becomes 1 and stops."),
  b("fresh-node", "Fresh revealed cell", "cell identity", "board = [[\"B\",\"E\"]], click = [0,1]", canvas(false,["0,0=B","0,1=E"],[["0,0=B","0,1=E"]]), "[[\"B\",\"B\"]]", "[[\"B\",\"1\"]]", "count-revealed-blank-as-mine", "B is a revealed blank, not a mine."),
  b("fresh-relation", "Fresh diagonal expansion", "eight-neighbor reveal", "board = [[\"E\",\"E\"],[\"E\",\"E\"]], click = [0,0]", canvas(false,["0,0=E","0,1=E","1,0=E","1,1=E"],[["0,0=E","0,1=E"],["0,0=E","1,0=E"],["0,0=E","1,1=E"],["0,1=E","1,0=E"],["0,1=E","1,1=E"],["1,0=E","1,1=E"]]), "all four become B", "only three side-connected cells become B", "expand-four-directions-only", "Blank expansion considers diagonal neighbors too."),
  b("fresh-predict", "Fresh numbered stop", "stop and expand rules", "board = [[\"M\",\"E\",\"E\"]], click = [0,2]", canvas(false,["0,0=M","0,1=E","0,2=E"],[["0,0=M","0,1=E"],["0,1=E","0,2=E"]]), "right cell becomes B and middle becomes 1", "all empty cells become B", "ignore-number-boundary", "Expansion reaches the middle, records one adjacent mine, and stops there."),
  b("fresh-counterexample", "Catch four-neighbor mine counting", "eight-neighbor reveal", "board = [[\"M\",\"E\"],[\"E\",\"E\"]], click = [1,1]", canvas(false,["0,0=M","0,1=E","1,0=E","1,1=E"],[["0,0=M","0,1=E"],["0,0=M","1,0=E"],["0,0=M","1,1=E"],["0,1=E","1,0=E"],["0,1=E","1,1=E"],["1,0=E","1,1=E"]]), "clicked cell becomes 1", "clicked cell becomes B", "count-cardinal-mines-only", "The diagonal mine must contribute to the number.")
]});

profiles.push({ id: "nested-list-weight-sum", facets: ["exact nesting", "integer identity", "parent-child depth", "depth-weighted sum"], cases: [
  b("build-mixed", "Weight a mixed list", "depth-weighted sum", "nestedList = [[1,1],2,[1,1]]", canvas(true,["root","A","1a","1b","2","B","1c","1d"],[["root","A"],["A","1a"],["A","1b"],["root","2"],["root","B"],["B","1c"],["B","1d"]]), "10", "6", "start-root-depth-at-zero", "Top-level 2 has depth 1; four nested 1s each have depth 2."),
  b("build-deep", "Weight a deep integer", "parent-child depth", "nestedList = [1,[4,[6]]]", canvas(true,["root","1","A","4","B","6"],[["root","1"],["root","A"],["A","4"],["A","B"],["B","6"]]), "27", "11", "use-one-weight-for-all-depths", "The sum is 1×1 + 4×2 + 6×3."),
  b("build-zero", "Keep a zero integer", "integer identity", "nestedList = [0]", canvas(true,["root","0"],[["root","0"]]), "0", "1", "count-integers-not-values", "Zero is an integer node but contributes zero to the weighted sum."),
  b("build-empty", "Handle empty nesting", "exact nesting", "nestedList = [[]]", canvas(true,["root","empty"],[["root","empty"]]), "0", "1", "count-empty-list-as-integer", "An empty list contains no integer contribution."),
  b("fresh-exact", "Fresh siblings", "exact nesting", "nestedList = [2,[3]]", canvas(true,["root","2","A","3"],[["root","2"],["root","A"],["A","3"]]), "8", "10", "add-list-node-to-depth", "The values contribute 2×1 + 3×2."),
  b("fresh-node", "Fresh repeated values", "integer identity", "nestedList = [1,[1]]", canvas(true,["root","1a","A","1b"],[["root","1a"],["root","A"],["A","1b"]]), "3", "2", "merge-equal-integers", "The two 1s are separate occurrences at depths 1 and 2."),
  b("fresh-relation", "Fresh deep zero", "parent-child depth", "nestedList = [[[5]]]", canvas(true,["root","A","B","5"],[["root","A"],["A","B"],["B","5"]]), "15", "10", "count-list-depth-from-zero", "Integer 5 is at depth 3."),
  b("fresh-predict", "Fresh mixed depth", "depth-weighted sum", "nestedList = [[2],3]", canvas(true,["root","A","2","3"],[["root","A"],["A","2"],["root","3"]]), "7", "8", "weight-top-level-too-deep", "The sum is 2×2 + 3×1."),
  b("fresh-counterexample", "Catch flatten-then-sum", "depth-weighted sum", "nestedList = [1,[2,[3]]]", canvas(true,["root","1","A","2","B","3"],[["root","1"],["root","A"],["A","2"],["A","B"],["B","3"]]), "14", "6", "discard-depth-before-sum", "Depth weights change the sum from 1+2+3 to 1+4+9.")
]});

profiles.push({ id: "nested-list-weight-sum-ii", facets: ["exact nesting", "integer identity", "maximum-depth relation", "inverse-depth sum"], cases: [
  b("build-mixed", "Apply inverse weights", "inverse-depth sum", "nestedList = [[1,1],2,[1,1]]", canvas(true,["root","A","1a","1b","2","B","1c","1d"],[["root","A"],["A","1a"],["A","1b"],["root","2"],["root","B"],["B","1c"],["B","1d"]]), "8", "10", "use-normal-depth-weights", "Maximum depth is 2: top-level 2 weighs 2 and nested 1s weigh 1."),
  b("build-deep", "Weight deepest least", "maximum-depth relation", "nestedList = [1,[4,[6]]]", canvas(true,["root","1","A","4","B","6"],[["root","1"],["root","A"],["A","4"],["A","B"],["B","6"]]), "17", "27", "use-forward-weight-sum", "Weights are 3, 2, and 1, giving 3 + 8 + 6."),
  b("build-shallow", "Handle one depth", "inverse-depth sum", "nestedList = [2,3]", canvas(true,["root","2","3"],[["root","2"],["root","3"]]), "5", "10", "assume-extra-empty-depth", "With maximum depth 1, both integers have weight 1."),
  b("build-empty-deep", "Ignore empty depth", "maximum-depth relation", "nestedList = [1,[[]]]", canvas(true,["root","1","A","empty"],[["root","1"],["root","A"],["A","empty"]]), "1", "3", "empty-list-increases-integer-max-depth", "Only integer depths determine useful weights; the empty list contributes nothing."),
  b("fresh-exact", "Fresh two levels", "exact nesting", "nestedList = [2,[3]]", canvas(true,["root","2","A","3"],[["root","2"],["root","A"],["A","3"]]), "7", "8", "use-forward-depth", "Maximum depth 2 gives 2×2 + 3×1."),
  b("fresh-node", "Fresh repeated integer", "integer identity", "nestedList = [1,[1]]", canvas(true,["root","1a","A","1b"],[["root","1a"],["root","A"],["A","1b"]]), "3", "2", "deduplicate-equal-values", "The shallow 1 weighs 2 and the deep 1 weighs 1."),
  b("fresh-relation", "Fresh three levels", "maximum-depth relation", "nestedList = [[[4]]]", canvas(true,["root","A","B","4"],[["root","A"],["A","B"],["B","4"]]), "4", "12", "use-absolute-depth-not-inverse", "The only integer is deepest, so its inverse weight is 1."),
  b("fresh-predict", "Fresh mixed depth", "inverse-depth sum", "nestedList = [[2],3]", canvas(true,["root","A","2","3"],[["root","A"],["A","2"],["root","3"]]), "8", "7", "swap-forward-and-inverse-weights", "Maximum depth 2 gives nested 2 weight 1 and top-level 3 weight 2."),
  b("fresh-counterexample", "Catch fixed-weight logic", "inverse-depth sum", "nestedList = [1,[2,[3]]]", canvas(true,["root","1","A","2","B","3"],[["root","1"],["root","A"],["A","2"],["A","B"],["B","3"]]), "10", "14", "use-normal-depth-weights", "Inverse weights 3,2,1 give 3+4+3.")
]});

profiles.push({ id: "network-delay-time", facets: ["exact weighted arcs", "all n nodes", "one-way travel times", "maximum shortest time"], cases: [
  b("build-branch", "Build weighted shortest routes", "maximum shortest time", "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", canvas(true,[1,2,3,4],[[2,1,"1"],[2,3,"1"],[3,4,"1"]]), "2", "3", "sum-all-edge-times", "Shortest arrival times are 0,1,1,2; the slowest is 2."),
  b("build-unreachable", "Keep an unreachable node", "all n nodes", "times = [[1,2,1]], n = 2, k = 2", canvas(true,[1,2],[[1,2,"1"]]), "-1", "1", "reverse-directed-edge", "Starting at 2 cannot traverse the incoming edge from 1."),
  b("build-better-route", "Choose the cheaper route", "exact weighted arcs", "times = [[1,2,10],[1,3,2],[3,2,2]], n = 3, k = 1", canvas(true,[1,2,3],[[1,2,"10"],[1,3,"2"],[3,2,"2"]]), "4", "10", "use-first-or-direct-path", "Node 2 arrives in 4 through node 3, cheaper than the direct time 10."),
  b("build-single", "Handle the source alone", "maximum shortest time", "times = [], n = 1, k = 1", canvas(true,[1],[]), "0", "-1", "require-at-least-one-edge", "The only node receives the signal at time zero."),
  b("fresh-exact", "Fresh weighted chain", "exact weighted arcs", "times = [[1,2,3],[2,3,4]], n = 3, k = 1", canvas(true,[1,2,3],[[1,2,"3"],[2,3,"4"]]), "7", "4", "take-largest-single-edge", "Node 3 receives the signal after cumulative time 7."),
  b("fresh-node", "Fresh isolated node", "all n nodes", "times = [[1,2,1]], n = 3, k = 1", canvas(true,[1,2,3],[[1,2,"1"]]), "-1", "1", "drop-node-not-in-times", "Node 3 still exists and never receives the signal."),
  b("fresh-direction", "Fresh reverse arc", "one-way travel times", "times = [[2,1,5]], n = 2, k = 1", canvas(true,[1,2],[[2,1,"5"]]), "-1", "5", "treat-times-as-undirected", "The listed arc goes toward source 1, not away from it."),
  b("fresh-predict", "Fresh competing routes", "maximum shortest time", "times = [[1,2,5],[1,3,1],[3,2,1]], n = 3, k = 1", canvas(true,[1,2,3],[[1,2,"5"],[1,3,"1"],[3,2,"1"]]), "2", "5", "ignore-relaxation", "The route 1→3→2 delivers to node 2 at time 2."),
  b("fresh-counterexample", "Catch FIFO traversal", "maximum shortest time", "times = [[1,2,9],[1,3,1],[3,2,1],[2,4,1]], n = 4, k = 1", canvas(true,[1,2,3,4],[[1,2,"9"],[1,3,"1"],[3,2,"1"],[2,4,"1"]]), "3", "10", "mark-visited-before-shorter-path", "A later-discovered cheaper route to 2 must update 2 and then 4.")
]});

profiles.push({ id: "number-of-connected-components-in-an-undirected-graph", facets: ["exact edge list", "all n nodes", "two-way edges", "component count"], cases: [
  b("build-two", "Build two components", "component count", "n = 5, edges = [[0,1],[1,2],[3,4]]", canvas(false,[0,1,2,3,4],[[0,1],[1,2],[3,4]]), "2", "3", "count-edges-instead-of-components", "Nodes 0–2 form one component and nodes 3–4 form another."),
  b("build-connected", "Build one long component", "two-way edges", "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", canvas(false,[0,1,2,3,4],[[0,1],[1,2],[2,3],[3,4]]), "1", "5", "count-each-node", "Every node is linked through the chain."),
  b("build-isolated", "Count isolated nodes", "all n nodes", "n = 4, edges = []", canvas(false,[0,1,2,3],[]), "4", "0", "count-only-edge-components", "Each isolated node is its own component."),
  b("build-cycle", "Do not count a cycle twice", "component count", "n = 3, edges = [[0,1],[1,2],[2,0]]", canvas(false,[0,1,2],[[0,1],[1,2],[2,0]]), "1", "3", "count-dfs-back-edges", "A cycle is still one connected component."),
  b("fresh-exact", "Fresh pair and singleton", "exact edge list", "n = 3, edges = [[0,1]]", canvas(false,[0,1,2],[[0,1]]), "2", "1", "drop-isolated-node", "The connected pair and isolated node 2 make two components."),
  b("fresh-node", "Fresh high-index singleton", "all n nodes", "n = 5, edges = [[0,1],[2,3]]", canvas(false,[0,1,2,3,4],[[0,1],[2,3]]), "3", "2", "build-nodes-only-from-edges", "Node 4 exists despite never appearing in an edge."),
  b("fresh-relation", "Fresh reverse traversal", "two-way edges", "n = 3, edges = [[1,0],[2,1]]", canvas(false,[0,1,2],[[1,0],[2,1]]), "1", "3", "treat-pairs-as-directed", "Undirected edges connect all three nodes regardless of pair order."),
  b("fresh-predict", "Fresh two cycles", "component count", "n = 6, edges = [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]", canvas(false,[0,1,2,3,4,5],[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]), "2", "6", "count-cycle-edges", "Each triangle is one component."),
  b("fresh-counterexample", "Catch edge-count formulas", "component count", "n = 4, edges = [[0,1],[1,2],[2,0]]", canvas(false,[0,1,2,3],[[0,1],[1,2],[2,0]]), "2", "1", "assume-n-minus-edges", "The triangle is one component and isolated node 3 is another.")
]});

profiles.push({ id: "number-of-increasing-paths-in-a-grid", facets: ["exact cell values", "cell identity", "increasing side moves", "all increasing paths"], cases: [
  b("build-two", "Count two vertical cells", "all increasing paths", "grid = [[1],[2]]", canvas(true,["0,0=1","1,0=2"],[["0,0=1","1,0=2"]]), "3", "1", "count-only-multi-cell-paths", "The paths are [1], [2], and [1→2]."),
  b("build-equal", "Do not cross equal values", "increasing side moves", "grid = [[1,1]]", canvas(true,["0,0=1","0,1=1"],[]), "2", "3", "allow-equal-step", "Each cell is a one-cell path, but no strict edge joins them."),
  b("build-branch", "Count both branches", "all increasing paths", "grid = [[1,2],[2,3]]", canvas(true,["0,0=1","0,1=2","1,0=2","1,1=3"],[["0,0=1","0,1=2"],["0,0=1","1,0=2"],["0,1=2","1,1=3"],["1,0=2","1,1=3"]]), "10", "8", "merge-paths-at-shared-end", "Four singletons, four one-edge paths, and two different 1→2→3 paths total 10."),
  b("build-single", "Count a one-cell path", "cell identity", "grid = [[5]]", canvas(true,["0,0=5"],[]), "1", "0", "require-at-least-one-move", "Every cell alone is a valid increasing path."),
  b("fresh-exact", "Fresh horizontal rise", "exact cell values", "grid = [[1,2,3]]", canvas(true,["0,0=1","0,1=2","0,2=3"],[["0,0=1","0,1=2"],["0,1=2","0,2=3"]]), "6", "3", "count-only-paths-from-minimum", "There are three singleton, two length-two, and one length-three paths."),
  b("fresh-node", "Fresh duplicate values", "cell identity", "grid = [[2,2]]", canvas(true,["0,0=2","0,1=2"],[]), "2", "1", "merge-equal-valued-cells", "Equal-valued cells are distinct starting paths."),
  b("fresh-relation", "Fresh descending row", "increasing side moves", "grid = [[3,2,1]]", canvas(true,["0,0=3","0,1=2","0,2=1"],[["0,1=2","0,0=3"],["0,2=1","0,1=2"]]), "6", "3", "follow-only-left-to-right", "Increasing edges point right-to-left here; position order does not control movement."),
  b("fresh-predict", "Fresh V shape", "all increasing paths", "grid = [[2,1,2]]", canvas(true,["0,0=2","0,1=1","0,2=2"],[["0,1=1","0,0=2"],["0,1=1","0,2=2"]]), "5", "4", "merge-equal-end-values", "Three singletons plus two distinct paths from the center total five."),
  b("fresh-counterexample", "Catch global visited counting", "all increasing paths", "grid = [[1,2],[2,3]]", canvas(true,["0,0=1","0,1=2","1,0=2","1,1=3"],[["0,0=1","0,1=2"],["0,0=1","1,0=2"],["0,1=2","1,1=3"],["1,0=2","1,1=3"]]), "10", "8", "count-shared-suffix-once", "Paths that share the final cell remain different paths because their prefixes differ.")
]});

profiles.push({ id: "number-of-islands", facets: ["exact land cells", "cell identity", "four-way land edges", "island count"], cases: [
  b("build-three", "Build three islands", "island count", "grid = [[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"0\"],[\"1\",\"0\",\"1\"]]", canvas(false,["0,0","0,1","2,0","2,2"],[["0,0","0,1"]]), "3", "4", "count-land-cells", "The top pair is one island and the two bottom cells are separate islands."),
  b("build-diagonal", "Keep diagonal land separate", "four-way land edges", "grid = [[\"1\",\"0\"],[\"0\",\"1\"]]", canvas(false,["0,0","1,1"],[]), "2", "1", "connect-diagonal-land", "Diagonal contact does not form an edge."),
  b("build-solid", "Build one solid island", "exact land cells", "grid = [[\"1\",\"1\"],[\"1\",\"1\"]]", canvas(false,["0,0","0,1","1,0","1,1"],[["0,0","0,1"],["0,0","1,0"],["0,1","1,1"],["1,0","1,1"]]), "1", "4", "count-each-land-cell", "All four land cells connect through sides."),
  b("build-water", "Handle one land cell", "cell identity", "grid = [[\"1\"]]", canvas(false,["0,0"],[]), "1", "0", "require-neighbor-for-island", "A lone land cell is one island."),
  b("fresh-exact", "Fresh split row", "exact land cells", "grid = [[\"1\",\"0\",\"1\"]]", canvas(false,["0,0","0,2"],[]), "2", "1", "jump-across-water", "The water gap separates the land cells."),
  b("fresh-node", "Fresh lone land", "cell identity", "grid = [[\"0\",\"1\"]]", canvas(false,["0,1"],[]), "1", "2", "include-water-node", "Only the 1 cell belongs to the land graph."),
  b("fresh-relation", "Fresh L island", "four-way land edges", "grid = [[\"1\",\"1\"],[\"1\",\"0\"]]", canvas(false,["0,0","0,1","1,0"],[["0,0","0,1"],["0,0","1,0"]]), "1", "2", "fail-to-join-branching-land", "Both arms share the top-left land cell."),
  b("fresh-predict", "Fresh diagonal chain", "island count", "grid = [[\"1\",\"0\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", canvas(false,["0,0","1,1","2,2"],[]), "3", "1", "use-eight-direction-dfs", "Each land cell touches the next only at a corner."),
  b("fresh-counterexample", "Catch row-only movement", "four-way land edges", "grid = [[\"1\"],[\"1\"],[\"1\"]]", canvas(false,["0,0","1,0","2,0"],[["0,0","1,0"],["1,0","2,0"]]), "1", "3", "check-horizontal-neighbors-only", "Vertical side connections make one island.")
]});

profiles.push({ id: "number-of-provinces", facets: ["exact matrix", "all cities", "symmetric city links", "province count"], cases: [
  b("build-two", "Build two provinces", "province count", "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", canvas(false,[0,1,2],[[0,1]]), "2", "1", "connect-through-diagonal-ones", "Cities 0 and 1 form one province; city 2 forms another."),
  b("build-isolated", "Count isolated cities", "all cities", "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", canvas(false,[0,1,2],[]), "3", "0", "ignore-diagonal-only-cities", "Each city exists even when it connects only to itself in the matrix."),
  b("build-chain", "Use transitive connection", "symmetric city links", "isConnected = [[1,1,0],[1,1,1],[0,1,1]]", canvas(false,[0,1,2],[[0,1],[1,2]]), "1", "2", "count-direct-groups-only", "City 1 joins cities 0 and 2 into one province."),
  b("build-single", "Handle one city", "all cities", "isConnected = [[1]]", canvas(false,[0],[]), "1", "0", "count-only-off-diagonal-edges", "The city itself is one province."),
  b("fresh-exact", "Fresh pair and singleton", "exact matrix", "isConnected = [[1,0,0],[0,1,1],[0,1,1]]", canvas(false,[0,1,2],[[1,2]]), "2", "1", "merge-all-matrix-rows", "City 0 is separate from the connected pair 1–2."),
  b("fresh-node", "Fresh four cities", "all cities", "isConnected = [[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]", canvas(false,[0,1,2,3],[[0,1]]), "3", "1", "build-only-cities-with-off-diagonal-one", "Cities 2 and 3 are isolated but each forms a province."),
  b("fresh-relation", "Fresh symmetric link", "symmetric city links", "isConnected = [[1,1],[1,1]]", canvas(false,[0,1],[[0,1]]), "1", "2", "count-mirrored-entries-as-two-components", "The two symmetric 1s describe one undirected city connection."),
  b("fresh-predict", "Fresh connected square", "province count", "isConnected = [[1,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,1]]", canvas(false,[0,1,2,3],[[0,1],[0,3],[1,2],[2,3]]), "1", "2", "split-cycle-into-pairs", "The four links form one connected cycle."),
  b("fresh-counterexample", "Catch direct-row counting", "province count", "isConnected = [[1,1,0],[1,1,1],[0,1,1]]", canvas(false,[0,1,2],[[0,1],[1,2]]), "1", "2", "count-distinct-adjacency-rows", "Different rows can still belong to one transitive province.")
]});

profiles.push({ id: "possible-bipartition", facets: ["exact dislikes", "all people", "two-way conflict edges", "two-group consistency"], cases: [
  b("build-possible", "Split a conflict tree", "two-group consistency", "n = 4, dislikes = [[1,2],[1,3],[2,4]]", canvas(false,[1,2,3,4],[[1,2],[1,3],[2,4]]), "true", "false", "require-equal-group-sizes", "A valid split is {1,4} and {2,3}; group sizes need not be prescribed."),
  b("build-triangle", "Expose a conflict triangle", "two-group consistency", "n = 3, dislikes = [[1,2],[1,3],[2,3]]", canvas(false,[1,2,3],[[1,2],[1,3],[2,3]]), "false", "true", "check-only-conflicts-with-person-one", "People 2 and 3 also dislike each other, forcing a contradiction."),
  b("build-disconnected", "Check every conflict component", "all people", "n = 5, dislikes = [[1,2],[3,4],[4,5],[5,3]]", canvas(false,[1,2,3,4,5],[[1,2],[3,4],[4,5],[5,3]]), "false", "true", "color-only-component-containing-one", "The separate triangle 3–4–5 makes the full input impossible."),
  b("build-none", "Handle no dislikes", "all people", "n = 3, dislikes = []", canvas(false,[1,2,3],[]), "true", "false", "require-both-groups-to-have-conflict-edge", "People with no conflicts can be assigned freely."),
  b("fresh-exact", "Fresh path", "exact dislikes", "n = 3, dislikes = [[1,2],[2,3]]", canvas(false,[1,2,3],[[1,2],[2,3]]), "true", "false", "reject-three-person-chain", "People 1 and 3 can share a group opposite person 2."),
  b("fresh-node", "Fresh isolated person", "all people", "n = 4, dislikes = [[1,2]]", canvas(false,[1,2,3,4],[[1,2]]), "true", "false", "drop-or-reject-isolated-people", "People 3 and 4 create no conflict and can join either side."),
  b("fresh-relation", "Fresh reversed pair", "two-way conflict edges", "n = 2, dislikes = [[2,1]]", canvas(false,[1,2],[[2,1]]), "true", "false", "treat-dislike-as-one-way", "A dislike pair is a mutual separation constraint regardless of order."),
  b("fresh-predict", "Fresh even cycle", "two-group consistency", "n = 4, dislikes = [[1,2],[2,3],[3,4],[4,1]]", canvas(false,[1,2,3,4],[[1,2],[2,3],[3,4],[4,1]]), "true", "false", "reject-any-cycle", "An even cycle alternates between two groups."),
  b("fresh-counterexample", "Catch greedy fixed grouping", "two-group consistency", "n = 4, dislikes = [[1,3],[2,3],[2,4]]", canvas(false,[1,2,3,4],[[1,3],[2,3],[2,4]]), "true", "false", "assign-groups-by-person-number", "A valid coloring follows conflicts, not odd/even person labels.")
]});

profiles.push({ id: "smallest-string-with-swaps", facets: ["exact index pairs", "all string positions", "two-way swap reach", "componentwise sorting"], cases: [
  b("build-two-pairs", "Sort two swap components", "componentwise sorting", "s = \"dcab\", pairs = [[0,3],[1,2]]", canvas(false,["0:d","1:c","2:a","3:b"],[["0:d","3:b"],["1:c","2:a"]]), "\"bacd\"", "\"abcd\"", "swap-across-components", "Each pair is a separate component, so letters cannot cross between them."),
  b("build-connected", "Use transitive swaps", "two-way swap reach", "s = \"dcab\", pairs = [[0,3],[1,2],[0,2]]", canvas(false,["0:d","1:c","2:a","3:b"],[["0:d","3:b"],["1:c","2:a"],["0:d","2:a"]]), "\"abcd\"", "\"bacd\"", "perform-each-pair-once", "All four positions join one component, allowing global sorting."),
  b("build-no-pairs", "Keep fixed positions", "all string positions", "s = \"cba\", pairs = []", canvas(false,["0:c","1:b","2:a"],[]), "\"cba\"", "\"abc\"", "sort-whole-string-without-swaps", "No position can exchange its character."),
  b("build-repeat", "Preserve repeated letters", "componentwise sorting", "s = \"baa\", pairs = [[0,1]]", canvas(false,["0:b","1:a","2:a"],[["0:b","1:a"]]), "\"aba\"", "\"aab\"", "move-through-isolated-index", "Only positions 0 and 1 can swap; position 2 is fixed."),
  b("fresh-exact", "Fresh single pair", "exact index pairs", "s = \"ba\", pairs = [[0,1]]", canvas(false,["0:b","1:a"],[["0:b","1:a"]]), "\"ab\"", "\"ba\"", "ignore-allowed-swap", "Sorting the one connected component puts a before b."),
  b("fresh-node", "Fresh isolated middle", "all string positions", "s = \"cba\", pairs = [[0,2]]", canvas(false,["0:c","1:b","2:a"],[["0:c","2:a"]]), "\"abc\"", "\"acb\"", "drop-isolated-position", "Position 1 remains b while positions 0 and 2 sort to a and c."),
  b("fresh-relation", "Fresh transitive component", "two-way swap reach", "s = \"cba\", pairs = [[0,1],[1,2]]", canvas(false,["0:c","1:b","2:a"],[["0:c","1:b"],["1:b","2:a"]]), "\"abc\"", "\"bac\"", "allow-only-listed-direct-swaps-once", "Repeated swaps along the chain can permute all three positions."),
  b("fresh-predict", "Fresh two components", "componentwise sorting", "s = \"dcba\", pairs = [[0,1],[2,3]]", canvas(false,["0:d","1:c","2:b","3:a"],[["0:d","1:c"],["2:b","3:a"]]), "\"cdab\"", "\"abcd\"", "sort-letters-across-components", "Each pair sorts independently to cd and ab."),
  b("fresh-counterexample", "Catch one-pass swapping", "two-way swap reach", "s = \"dcab\", pairs = [[0,1],[1,2],[2,3]]", canvas(false,["0:d","1:c","2:a","3:b"],[["0:d","1:c"],["1:c","2:a"],["2:a","3:b"]]), "\"abcd\"", "\"cadb\"", "apply-pairs-once-in-input-order", "Connectivity permits any number of swaps, not one pass over the pair list.")
]});

profiles.push({ id: "time-needed-to-inform-all-employees", facets: ["exact manager rows", "employee identity", "manager-to-report edges", "slowest information path"], cases: [
  b("build-star", "Build a manager star", "slowest information path", "n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]", canvas(true,[0,1,2,3,4,5],[[2,0],[2,1],[2,3],[2,4],[2,5]]), "1", "5", "sum-times-for-parallel-reports", "The head informs direct reports in parallel, so all hear after one minute."),
  b("build-chain", "Add times along a chain", "slowest information path", "n = 4, headID = 0, manager = [-1,0,1,2], informTime = [1,2,3,0]", canvas(true,[0,1,2,3],[[0,1],[1,2],[2,3]]), "6", "3", "take-largest-single-manager-time", "The only path accumulates 1+2+3 minutes."),
  b("build-branch", "Choose the slower branch", "manager-to-report edges", "n = 5, headID = 0, manager = [-1,0,0,1,2], informTime = [1,4,2,0,0]", canvas(true,[0,1,2,3,4],[[0,1],[0,2],[1,3],[2,4]]), "5", "7", "sum-parallel-branch-times", "The branches run in parallel; the slow branch takes 1+4=5."),
  b("build-single", "Handle one employee", "employee identity", "n = 1, headID = 0, manager = [-1], informTime = [0]", canvas(true,[0],[]), "0", "1", "count-head-as-one-minute", "No edge must carry information."),
  b("fresh-exact", "Fresh two-level tree", "exact manager rows", "n = 3, headID = 1, manager = [1,-1,1], informTime = [0,2,0]", canvas(true,[0,1,2],[[1,0],[1,2]]), "2", "4", "sum-direct-reports", "Both reports receive the news after the head's two-minute delay."),
  b("fresh-node", "Fresh zero-time report", "employee identity", "n = 2, headID = 0, manager = [-1,0], informTime = [0,0]", canvas(true,[0,1],[[0,1]]), "0", "1", "count-edge-as-unit-time", "Edges do not automatically cost one; the manager's informTime is zero."),
  b("fresh-direction", "Fresh manager direction", "manager-to-report edges", "n = 2, headID = 1, manager = [1,-1], informTime = [0,3]", canvas(true,[0,1],[[1,0]]), "3", "0", "reverse-reporting-edge", "Information flows from manager 1 to employee 0."),
  b("fresh-predict", "Fresh uneven tree", "slowest information path", "n = 4, headID = 0, manager = [-1,0,0,1], informTime = [2,5,0,0]", canvas(true,[0,1,2,3],[[0,1],[0,2],[1,3]]), "7", "5", "omit-head-delay", "The slow route 0→1→3 costs 2+5."),
  b("fresh-counterexample", "Catch total-sum logic", "slowest information path", "n = 3, headID = 0, manager = [-1,0,0], informTime = [4,0,0]", canvas(true,[0,1,2],[[0,1],[0,2]]), "4", "8", "add-parallel-deliveries", "The head informs both reports during the same four-minute interval.")
]});

profiles.push({ id: "water-and-jug-problem", facets: ["exact capacities", "amount-pair states", "one legal move edges", "target reachability"], cases: [
  b("build-reachable", "Build a reachable target", "target reachability", "jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1", canvas(true,["(0,0)","(2,0)","(0,3)","(2,3)","(0,2)","(2,1)"],[["(0,0)","(2,0)"],["(0,0)","(0,3)"],["(2,0)","(2,3)"],["(2,0)","(0,2)"],["(0,3)","(2,3)"],["(0,3)","(2,1)"]]), "true", "false", "target-must-equal-capacity", "Pouring the 3-liter jug into the 2-liter jug leaves 1 liter."),
  b("build-gcd-fail", "Expose an unreachable amount", "target reachability", "jug1Capacity = 2, jug2Capacity = 4, targetCapacity = 3", canvas(true,["(0,0)","(2,0)","(0,4)","(2,4)","(0,2)","(2,2)"],[["(0,0)","(2,0)"],["(0,0)","(0,4)"],["(2,0)","(2,4)"],["(2,0)","(0,2)"],["(0,4)","(2,4)"],["(0,4)","(2,2)"],["(0,2)","(2,2)"]]), "false", "true", "allow-arbitrary-measured-pour", "All reachable amounts are even, so no state contains exactly 3."),
  b("build-sum", "Use both jugs", "exact capacities", "jug1Capacity = 1, jug2Capacity = 2, targetCapacity = 3", canvas(true,["(0,0)","(1,0)","(0,2)","(1,2)"],[["(0,0)","(1,0)"],["(0,0)","(0,2)"],["(1,0)","(1,2)"],["(0,2)","(1,2)"]]), "true", "false", "require-target-in-one-jug", "State (1,2) holds 3 liters total."),
  b("build-zero", "Handle target zero", "amount-pair states", "jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 0", canvas(true,["(0,0)"],[]), "true", "false", "require-at-least-one-move", "The initial state already holds zero liters."),
  b("fresh-exact", "Fresh direct fill", "exact capacities", "jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 5", canvas(true,["(0,0)","(3,0)","(0,5)"],[["(0,0)","(3,0)"],["(0,0)","(0,5)"]]), "true", "false", "search-only-pour-moves", "Filling the 5-liter jug reaches the target in one move."),
  b("fresh-node", "Fresh state distinction", "amount-pair states", "jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 2", canvas(true,["(0,0)","(2,0)","(0,2)"],[["(0,0)","(2,0)"]]), "true", "false", "track-total-only", "State (2,0) is directly reachable; amount pairs, not totals alone, define moves."),
  b("fresh-relation", "Fresh legal pour", "one legal move edges", "jug1Capacity = 2, jug2Capacity = 3, targetCapacity = 1", canvas(true,["(0,3)","(2,1)"],[["(0,3)","(2,1)"]]), "true", "false", "require-pour-to-empty-source", "A legal pour stops when the 2-liter destination fills, leaving 1 in the source."),
  b("fresh-predict", "Fresh unreachable odd target", "target reachability", "jug1Capacity = 4, jug2Capacity = 6, targetCapacity = 5", canvas(true,["(0,0)","(4,0)","(0,6)","(0,4)","(4,2)","(0,2)","(2,0)"],[["(0,0)","(4,0)"],["(0,0)","(0,6)"],["(4,0)","(0,4)"],["(0,6)","(4,2)"],["(4,2)","(0,2)"],["(0,2)","(2,0)"]]), "false", "true", "ignore-gcd-restriction", "Legal moves preserve even amounts, so 5 cannot be measured."),
  b("fresh-counterexample", "Catch arbitrary partial pours", "one legal move edges", "jug1Capacity = 4, jug2Capacity = 8, targetCapacity = 3", canvas(true,["(0,0)","(4,0)","(0,8)","(4,8)","(0,4)","(4,4)"],[["(0,0)","(4,0)"],["(0,0)","(0,8)"],["(4,0)","(0,4)"],["(0,8)","(4,4)"]]), "false", "true", "pour-chosen-one-liter", "Unmarked jugs cannot stop a pour after an arbitrary amount to leave exactly 3.")
]});

profiles.push({ id: "word-search", facets: ["exact board letters", "cell identity", "four-way next-letter moves", "single-path backtracking"], cases: [
  b("build-found", "Build a found word", "single-path backtracking", "board = [[\"A\",\"B\"],[\"D\",\"C\"]], word = \"ABC\"", canvas(true,["0,0=A","0,1=B","1,0=D","1,1=C"],[["0,0=A","0,1=B"],["0,1=B","1,1=C"]]), "true", "false", "search-only-straight-lines", "A→B→C turns downward using side-adjacent cells."),
  b("build-reuse", "Reject reusing one cell", "single-path backtracking", "board = [[\"A\",\"B\"]], word = \"ABA\"", canvas(true,["0,0=A","0,1=B"],[["0,0=A","0,1=B"]]), "false", "true", "reuse-cell-in-same-path", "The only A cell was already used before returning from B."),
  b("build-diagonal", "Reject diagonal letters", "four-way next-letter moves", "board = [[\"A\",\"X\"],[\"X\",\"B\"]], word = \"AB\"", canvas(true,["0,0=A","0,1=X","1,0=X","1,1=B"],[]), "false", "true", "allow-diagonal-move", "A and B touch only at a corner."),
  b("build-one", "Handle a one-letter word", "cell identity", "board = [[\"Z\"]], word = \"Z\"", canvas(true,["0,0=Z"],[]), "true", "false", "require-at-least-one-edge", "The starting cell alone matches the whole word."),
  b("fresh-exact", "Fresh horizontal word", "exact board letters", "board = [[\"C\",\"A\",\"T\"]], word = \"CAT\"", canvas(true,["0,0=C","0,1=A","0,2=T"],[["0,0=C","0,1=A"],["0,1=A","0,2=T"]]), "true", "false", "stop-before-last-letter", "All three letters form a side-adjacent path."),
  b("fresh-node", "Fresh repeated letters", "cell identity", "board = [[\"A\",\"A\"]], word = \"AA\"", canvas(true,["0,0=A","0,1=A"],[["0,0=A","0,1=A"]]), "true", "false", "merge-equal-letter-cells", "The two A cells are distinct positions and may be used once each."),
  b("fresh-relation", "Fresh vertical word", "four-way next-letter moves", "board = [[\"D\"],[\"O\"],[\"G\"]], word = \"DOG\"", canvas(true,["0,0=D","1,0=O","2,0=G"],[["0,0=D","1,0=O"],["1,0=O","2,0=G"]]), "true", "false", "check-horizontal-moves-only", "Vertical side moves are legal."),
  b("fresh-predict", "Fresh dead-end branch", "single-path backtracking", "board = [[\"A\",\"B\"],[\"B\",\"C\"]], word = \"ABC\"", canvas(true,["0,0=A","0,1=B","1,0=B","1,1=C"],[["0,0=A","0,1=B"],["0,0=A","1,0=B"],["0,1=B","1,1=C"],["1,0=B","1,1=C"]]), "true", "false", "stop-after-first-failed-b-branch", "If one B branch fails, backtracking tries the other B branch."),
  b("fresh-counterexample", "Catch global visited state", "single-path backtracking", "board = [[\"A\",\"B\"],[\"B\",\"C\"]], word = \"ABC\"", canvas(true,["0,0=A","0,1=B","1,0=B","1,1=C"],[["0,0=A","0,1=B"],["0,0=A","1,0=B"],["0,1=B","1,1=C"],["1,0=B","1,1=C"]]), "true", "false", "never-unmark-after-backtracking", "Visited cells belong only to the current path and must be unmarked when a branch returns.")
]});

if (profiles.length !== 25) throw new Error(`Expected 25 original profiles, found ${profiles.length}`);
const lessons = normalizeGridNodeLabels(profiles.map(record), specs);

// Keep Step 1 prompts model-neutral. The student must infer nodes, edges, and
// direction from the problem and raw input instead of receiving those rules here.
let practiceCase = 0;
for (const lesson of lessons) {
  for (const task of lesson.buildTasks) {
    practiceCase++;
    task.prompt = `Practice case ${practiceCase}: Infer the graph from the raw input. Then answer from your drawing.`;
  }
  for (const task of lesson.conceptTasks) {
    task.remedial.prompt = "Infer the graph from this new raw input yourself. Then answer from your drawing.";
  }
}

const division = lessons.find(lesson => lesson.id === "evaluate-division");
for (const task of [...division.buildTasks, ...division.conceptTasks.map(task => task.remedial)]) {
  task.decision.prompt = "What is this one query's value?";
}

const combinations = lessons.find(lesson => lesson.id === "letter-combinations-of-a-phone-number");
for (const index of [0, 1, 2, 4]) combinations.conceptTasks[index].remedial.decision.prompt = "How many complete combinations are returned?";
const emptyDigits = combinations.conceptTasks.find(task => task.id === "bug-trap");
const zeroChoice = emptyDigits.choices.find(choice => choice.id === "zero");
zeroChoice.label = '`["0"]`';
zeroChoice.feedback = "This invents a character for digit 0 even though the input contains no digit.";
zeroChoice.misconception = "emit-zero-character";

const minesweeper = lessons.find(lesson => lesson.id === "minesweeper");
for (const task of [...minesweeper.buildTasks, ...minesweeper.conceptTasks.map(task => task.remedial)]) {
  if (task.decision.choices.some(choice => !String(choice.label).startsWith("[["))) task.decision.prompt = "What visible change should happen in this case?";
}

const reasoningOnly = {
  "course-schedule": ["predict-output", "bug-trap"],
  "find-if-path-exists-in-graph": ["predict-output"],
  "is-graph-bipartite": ["predict-output", "bug-trap"],
  "keys-and-rooms": ["predict-output"],
  "possible-bipartition": ["bug-trap"],
  "water-and-jug-problem": ["predict-output", "bug-trap"]
};
for (const [problemId, taskIds] of Object.entries(reasoningOnly)) {
  const lesson = lessons.find(item => item.id === problemId);
  for (const taskId of taskIds) {
    const task = lesson.conceptTasks.find(item => item.id === taskId);
    task.prompt = "Which graph reasoning is correct for this case?";
    for (const item of task.choices) item.label = item.label.replace(/^`(?:true|false)`(?:\s+only|\s+because|[:,])?\s*/i, "").replace(/^because\s+/i, "");
  }
}

const bombs = lessons.find(lesson => lesson.id === "detonate-the-maximum-bombs");
const bombReasoning = {
  "predict-output": {
    two: "Starting at the radius-4 bomb reaches both bombs.",
    "one-both": "A chain counts only if both bombs can reach each other.",
    "two-either": "Either starting bomb reaches the other.",
    zero: "Different center coordinates prevent every detonation."
  },
  "bug-trap": {
    one: "Neither center lies within the other bomb’s radius.",
    "two-overlap": "Equal radii make bombs connect regardless of distance.",
    "two-sum": "Add both radii when deciding whether one bomb triggers the other.",
    zero: "A hand-chosen starting bomb does not count itself."
  }
};
for (const [taskId, labels] of Object.entries(bombReasoning)) {
  const task = bombs.conceptTasks.find(item => item.id === taskId);
  task.prompt = "Which detonation reasoning is correct for this case?";
  for (const item of task.choices) item.label = labels[item.id];
}

fs.writeFileSync(path.join(root, "visual-lessons-original.json"), `${JSON.stringify(lessons, null, 2)}\n`);
console.log(`Authored ${lessons.length} original v3 visual lessons.`);
