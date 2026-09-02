const fs = require("fs");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");

const sharedFile = "visual-lessons-variant.json";
const payloadFile = "visual-lessons-variant-assigned.json";
const specs = JSON.parse(fs.readFileSync("visual-specs-variant.json", "utf8"));
const current = JSON.parse(fs.readFileSync(sharedFile, "utf8"));
const assigned = new Set([
  "office-rumor-reach", "package-to-the-outpost", "perfect-size-campsites", "count-routes-to-summit",
  "runes-on-the-castle-door", "save-the-date-phone-chain", "shut-the-garden-valve", "biggest-study-group",
  "kth-song-in-playlist", "museum-vault-keyring", "top-of-the-pile", "trusted-courier-networks"
]);

const clone = value => JSON.parse(JSON.stringify(value));
const canvas = (directed, labels, edges = []) => ({
  directed,
  nodes: labels.map(label => ({ id: String(label), label: String(label) })),
  edges: edges.map(([from, to, label]) => ({ from: String(from), to: String(to), ...(label == null ? {} : { label: String(label) }) }))
});
const choice = (id, label, feedback, misconception = null) => ({ id, label, feedback, misconception });
const bug = (label, feedback, misconception) => ({ label, feedback, misconception });
const task = (id, title, facet, input, model, prompt, answer, wrong, why) => ({
  id, title, facet,
  prompt: "Use the raw input to complete the challenge. Then choose the result.",
  input, canvas: model,
  decision: { prompt, choices: [choice("correct", answer, `Correct. ${why}`), choice("bug", wrong.label, wrong.feedback, wrong.misconception)], correct: "correct" },
  why
});

function omitEdge(model) { const copy = clone(model); copy.edges = copy.edges.slice(0, -1); return copy; }
function omitNode(model) { const copy = clone(model); const node = copy.nodes.pop(); copy.edges = copy.edges.filter(edge => edge.from !== node.id && edge.to !== node.id); return copy; }
function changeRelation(model) {
  const copy = clone(model);
  if (copy.directed) copy.edges = copy.edges.map(edge => ({ ...edge, from: edge.to, to: edge.from }));
  else copy.directed = true;
  return copy;
}

function exactConcept(facet, source) {
  return {
    id: "concept-picture", title: "Match every input detail", facet, kind: "visual-options",
    prompt: "Which picture exactly matches this raw input?", input: source.input,
    choices: [
      { ...choice("exact", "Picture A", "Correct. Every entity and direct relation matches."), model: clone(source.canvas) },
      { ...choice("missing-edge", "Picture B", "This drops one direct relation listed in the input.", "omit-listed-relation"), model: omitEdge(source.canvas) },
      { ...choice("wrong-relation", "Picture C", source.canvas.directed ? "This reverses the direction of the listed relations." : "This turns two-way relations into one-way arrows.", source.canvas.directed ? "reverse-arrows" : "make-undirected-edges-directed"), model: changeRelation(source.canvas) },
      { ...choice("missing-node", "Picture D", "This drops an entity that still exists in the input.", "omit-input-entity"), model: omitNode(source.canvas) }
    ],
    correct: "exact", why: "An exact picture keeps every entity, direct relation, direction, and edge label from the input."
  };
}

function conceptFromDecision(id, title, facet, kind, source, shown = true) {
  return {
    id, title, facet, kind: "choice", prompt: source.decision.prompt, input: source.input,
    ...(shown ? { shownModel: clone(source.canvas) } : {}), choices: clone(source.decision.choices), correct: source.decision.correct,
    why: source.why
  };
}

function conceptFromSpec(id, title, facet, question, input, shownModel) {
  return {
    id, title, facet, kind: "choice", prompt: question.prompt, input,
    ...(shownModel ? { shownModel: clone(shownModel) } : {}),
    choices: clone(question.choices), correct: question.correct,
    why: question.choices.find(item => item.id === question.correct).feedback
  };
}

function install(id, facets, cases) {
  if (cases.length !== 9) throw new Error(`${id}: expected nine cases`);
  const [b1,b2,b3,b4,r1,r2,r3,r4,r5] = cases;
  const spec = specs.find(item => item.id === id);
  if (!spec) throw new Error(`${id}: missing visual spec`);
  const concepts = [
    exactConcept(facets[0], b1),
    conceptFromSpec("concept-nodes", "Protect entity identity", facets[1], spec.nodeQuestion, b2.input, b2.canvas),
    conceptFromSpec("concept-relations", "Protect direct relations", facets[2], spec.edgeQuestion, b3.input, b3.canvas),
    conceptFromSpec("concept-output", "Predict from a fresh input", facets[3], spec.pictureQuestions[0], spec.pictureQuestions[0].input),
    conceptFromSpec("concept-bug", "Catch a near-miss implementation", facets[3], spec.pictureQuestions[1], spec.pictureQuestions[1].input)
  ];
  [r1,r2,r3,r4,r5].forEach((repair, index) => {
    concepts[index].remedial = {
      id: `repair-${index + 1}`, title: `Fresh proof · ${concepts[index].title}`,
      prompt: "Use this fresh raw input to complete the challenge. Then choose the result.",
      input: repair.input, canvas: clone(repair.canvas), decision: clone(repair.decision), why: repair.why
    };
  });
  records.set(id, { id, facets, buildTasks: [b1,b2,b3,b4], conceptTasks: concepts });
}

const records = new Map();

// These three records were already hand-authored and reviewed in the shared file.
for (const id of ["office-rumor-reach", "biggest-study-group", "trusted-courier-networks"]) {
  const record = current.find(item => item.id === id);
  if (!record) throw new Error(`Missing reviewed record ${id}`);
  records.set(id, clone(record));
}

install("package-to-the-outpost", ["exact roads", "warehouse identity", "two-way weighted roads", "unique-route time"], [
  task("route-branch", "Add one unique route", "unique-route time", "n=5, roads=[[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq=0, target=4", canvas(false,[0,1,2,3,4],[[0,1,"4"],[1,2,"3"],[0,3,"2"],[3,4,"7"]]), "What travel time is returned?", "9", bug("16", "This adds every road in the tree instead of only roads on the hq-to-target route.", "sum-all-tree-edges"), "The unique route 0—3—4 costs 2+7=9."),
  task("reverse-listed", "Use a road in either direction", "two-way weighted roads", "n=3, roads=[[1,0,5],[1,2,1]], hq=2, target=0", canvas(false,[0,1,2],[[1,0,"5"],[1,2,"1"]]), "What travel time is returned?", "6", bug("-1", "This treats roads as one-way in their written endpoint order, so it refuses 2→1.", "treat-roads-as-directed"), "The route 2—1—0 costs 1+5=6."),
  task("ignore-off-route", "Ignore an off-route branch", "exact roads", "n=4, roads=[[0,1,2],[1,2,3],[1,3,9]], hq=0, target=2", canvas(false,[0,1,2,3],[[0,1,"2"],[1,2,"3"],[1,3,"9"]]), "What travel time is returned?", "5", bug("14", "This adds the 9-hour branch to warehouse 3 even though that road is not on the route to 2.", "include-off-route-branch"), "Only roads 0—1 and 1—2 lie on the route, so 2+3=5."),
  task("same-warehouse", "Handle no driving", "warehouse identity", "n=3, roads=[[0,1,4],[1,2,6]], hq=1, target=1", canvas(false,[0,1,2],[[0,1,"4"],[1,2,"6"]]), "What travel time is returned?", "0", bug("10", "This traverses the whole tree even though the route starts and ends at warehouse 1.", "ignore-same-endpoint-base-case"), "The zero-road route from warehouse 1 to itself costs 0."),
  task("fresh-exact", "Fresh weighted fork", "exact roads", "n=4, roads=[[0,1,3],[0,2,8],[2,3,2]], hq=1, target=3", canvas(false,[0,1,2,3],[[0,1,"3"],[0,2,"8"],[2,3,"2"]]), "What travel time is returned?", "13", bug("10", "This starts at warehouse 0 and omits the first road from hq 1 to 0.", "assume-hq-zero"), "The route 1—0—2—3 costs 3+8+2=13."),
  task("fresh-node", "Keep every warehouse", "warehouse identity", "n=4, roads=[[0,1,1],[1,2,1],[2,3,1]], hq=0, target=3", canvas(false,[0,1,2,3],[[0,1,"1"],[1,2,"1"],[2,3,"1"]]), "How many warehouses are on the route, including both endpoints?", "4", bug("3", "This counts roads instead of warehouse nodes on the route.", "count-edges-not-route-nodes"), "The route contains warehouses 0,1,2,3."),
  task("fresh-relation", "Preserve road weights", "two-way weighted roads", "n=3, roads=[[0,1,2],[1,2,7]], hq=2, target=0", canvas(false,[0,1,2],[[0,1,"2"],[1,2,"7"]]), "What travel time is returned?", "9", bug("2", "This reuses the first road's weight for both road segments.", "reuse-first-edge-weight"), "Travel in reverse still uses the listed weights: 7+2=9."),
  task("fresh-output", "Fresh direct road", "unique-route time", "n=2, roads=[[0,1,11]], hq=0, target=1", canvas(false,[0,1],[[0,1,"11"]]), "What travel time is returned?", "11", bug("1", "This counts one road instead of adding its 11-hour weight.", "count-edges-not-hours"), "The single road costs 11 hours."),
  task("fresh-bug", "Catch early branch return", "unique-route time", "n=5, roads=[[0,1,4],[0,2,1],[2,3,2],[3,4,3]], hq=0, target=4", canvas(false,[0,1,2,3,4],[[0,1,"4"],[0,2,"1"],[2,3,"2"],[3,4,"3"]]), "What travel time is returned?", "6", bug("-1", "This explores dead-end branch 0—1 first and returns failure without trying branch 0—2.", "return-after-first-failed-branch"), "The other branch reaches 4 with cost 1+2+3=6.")
]);

install("perfect-size-campsites", ["exact grass cells", "cell identity", "four-way grass edges", "exact-size component count"], [
  task("two-perfect", "Count matching components", "exact-size component count", "park=[[1,1,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]], k=2", canvas(false,["0,0","0,1","1,1","0,3","1,3","3,0","3,1"],[["0,0","0,1"],["0,1","1,1"],["0,3","1,3"],["3,0","3,1"]]), "How many campsites have exactly k cells?", "2", bug("3", "This counts every grass component and ignores whether its size equals k.", "ignore-target-size"), "The component sizes are 3,2,2; two match k=2."),
  task("diagonal-separate", "Keep corners separate", "four-way grass edges", "park=[[1,0],[0,1]], k=1", canvas(false,["0,0","1,1"],[]), "How many campsites have exactly k cells?", "2", bug("0", "This joins the diagonal cells into one size-2 component, so neither seems to match k=1.", "connect-diagonal-cells"), "The two diagonal grass cells are separate one-cell campsites."),
  task("one-too-large", "Reject a near-size component", "exact grass cells", "park=[[1,1],[1,0]], k=2", canvas(false,["0,0","0,1","1,0"],[["0,0","0,1"],["0,0","1,0"]]), "How many campsites have exactly k cells?", "0", bug("1", "This accepts a component whose size 3 is at least k instead of exactly k.", "use-at-least-k"), "The only component has size 3, not exactly 2."),
  task("single-grass", "Handle one grass cell", "cell identity", "park=[[1]], k=1", canvas(false,["0,0"],[]), "How many campsites have exactly k cells?", "1", bug("0", "This drops a grass cell that has no grass neighbor.", "drop-isolated-grass-cell"), "The lone grass cell is one size-1 campsite."),
  task("fresh-exact", "Fresh three patches", "exact grass cells", "park=[[1,1,0],[0,0,0],[1,0,1]], k=1", canvas(false,["0,0","0,1","2,0","2,2"],[["0,0","0,1"]]), "How many campsites have exactly k cells?", "2", bug("3", "This includes the top size-2 component along with the two singletons.", "count-all-components"), "Only the two bottom one-cell patches match k=1."),
  task("fresh-node", "Fresh repeated rows", "cell identity", "park=[[1,1],[1,1]], k=4", canvas(false,["0,0","0,1","1,0","1,1"],[["0,0","0,1"],["0,0","1,0"],["0,1","1,1"],["1,0","1,1"]]), "How many grass nodes are in the matching campsite?", "4", bug("1", "This treats the whole campsite as one node instead of four cell nodes.", "component-as-node"), "Each grass position is a node; all four form one component."),
  task("fresh-relation", "Fresh vertical connection", "four-way grass edges", "park=[[1],[1],[1]], k=3", canvas(false,["0,0","1,0","2,0"],[["0,0","1,0"],["1,0","2,0"]]), "How many campsites match k?", "1", bug("3", "This checks horizontal neighbors only and splits the vertical run into three singletons.", "omit-vertical-neighbors"), "Vertical side edges join all three cells into one size-3 campsite."),
  task("fresh-output", "Fresh equal-size patches", "exact-size component count", "park=[[1,1,0,1,1]], k=2", canvas(false,["0,0","0,1","0,3","0,4"],[["0,0","0,1"],["0,3","0,4"]]), "How many campsites match k?", "2", bug("4", "This returns the number of grass cells inside matching campsites instead of the number of campsites.", "sum-matching-cells"), "There are two separate size-2 components."),
  task("fresh-bug", "Catch stop-after-first logic", "exact-size component count", "park=[[1,0,1,0,1]], k=1", canvas(false,["0,0","0,2","0,4"],[]), "How many campsites match k?", "3", bug("1", "This returns as soon as the first matching campsite is found.", "stop-after-first-match"), "All three isolated grass cells are matching size-1 campsites.")
]);

install("count-routes-to-summit", ["exact adjacency", "camp identity", "uphill arrows", "all summit routes"], [
  task("diamond", "Count both branches", "all summit routes", "graph=[[1,2],[3],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[0,2],[1,3],[2,3]]), "How many routes reach the summit?", "2", bug("1", "This stops after finding the first complete route.", "stop-after-first-route"), "Both 0→1→3 and 0→2→3 reach summit 3."),
  task("direct-plus-long", "Keep the direct route", "exact adjacency", "graph=[[1,3],[2],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[0,3],[1,2],[2,3]]), "How many routes reach the summit?", "2", bug("1", "This counts only the longer DFS branch and misses direct route 0→3.", "miss-direct-route"), "The direct route and 0→1→2→3 are different routes."),
  task("dead-end", "Ignore a dead-end branch", "uphill arrows", "graph=[[1,2],[3],[],[]]", canvas(true,[0,1,2,3],[[0,1],[0,2],[1,3]]), "How many routes reach the summit?", "1", bug("2", "This counts every branch leaving base camp, even branch 0→2 that never reaches the summit.", "count-dead-end-branch"), "Only 0→1→3 reaches summit 3."),
  task("single-route", "Handle one direct route", "camp identity", "graph=[[1],[]]", canvas(true,[0,1],[[0,1]]), "How many routes reach the summit?", "1", bug("0", "This requires an intermediate camp and ignores a direct base-to-summit trail.", "reject-direct-route"), "The one arrow is one complete route."),
  task("fresh-exact", "Fresh merge", "exact adjacency", "graph=[[1,2],[3],[3],[4],[]]", canvas(true,[0,1,2,3,4],[[0,1],[0,2],[1,3],[2,3],[3,4]]), "How many routes reach the summit?", "2", bug("1", "This marks merge camp 3 globally visited and blocks the second distinct prefix.", "global-visited-prunes-merge"), "Two routes share suffix 3→4 but have different prefixes."),
  task("fresh-node", "Fresh sink camp", "camp identity", "graph=[[2],[],[]]", canvas(true,[0,1,2],[[0,2]]), "How many camp nodes exist?", "3", bug("2", "This drops camp 1 because it has no outgoing trail and is not on a summit route.", "drop-unused-sink-camp"), "Every adjacency-list index names a camp."),
  task("fresh-relation", "Fresh one-way branch", "uphill arrows", "graph=[[],[0],[]]", canvas(true,[0,1,2],[[1,0]]), "How many routes go from base 0 to summit 2?", "0", bug("1", "This reverses arrow 1→0 so base 0 appears able to climb to 1.", "reverse-adjacency-arrow"), "Base 0 has no outgoing trail, so it cannot reach 2."),
  task("fresh-output", "Fresh three routes", "all summit routes", "graph=[[1,2,3],[3],[3],[]]", canvas(true,[0,1,2,3],[[0,1],[0,2],[0,3],[1,3],[2,3]]), "How many routes reach the summit?", "3", bug("2", "This misses the direct route 0→3.", "miss-zero-intermediate-route"), "Routes through 1, through 2, and directly to 3 all count."),
  task("fresh-bug", "Catch path merging", "all summit routes", "graph=[[1,2],[3,4],[4],[5],[5],[]]", canvas(true,[0,1,2,3,4,5],[[0,1],[0,2],[1,3],[1,4],[2,4],[3,5],[4,5]]), "How many routes reach the summit?", "3", bug("2", "This counts merge node 4 only once instead of keeping routes 0→1→4→5 and 0→2→4→5 distinct.", "merge-distinct-prefixes"), "There is one route through 3 and two different prefixes into 4.")
]);

install("runes-on-the-castle-door", ["exact dial choices", "prefix state identity", "one-rune extensions", "all valid codes"], [
  task("two-dials", "Build valid two-dial codes", "all valid codes", "dials=[\"ab\",\"ab\"]", canvas(true,["start","a","b","ab","ba"],[["start","a"],["start","b"],["a","ab"],["b","ba"]]), "Which complete code list is returned?", "[\"ab\",\"ba\"]", bug("[\"aa\",\"ab\",\"ba\",\"bb\"]", "This emits equal-neighbor codes aa and bb instead of pruning them.", "allow-equal-neighbors"), "Only ab and ba use different adjacent runes."),
  task("forced-second", "Prune a forced repeat", "one-rune extensions", "dials=[\"ab\",\"b\"]", canvas(true,["start","a","b","ab"],[["start","a"],["start","b"],["a","ab"]]), "Which complete code list is returned?", "[\"ab\"]", bug("[\"ab\",\"bb\"]", "This appends b after prefix b without checking the previous rune.", "skip-adjacent-equality-check"), "Branch b→bb is invalid; a→ab remains."),
  task("no-code", "Handle every branch pruned", "exact dial choices", "dials=[\"a\",\"a\"]", canvas(true,["start","a"],[["start","a"]]), "Which complete code list is returned?", "[]", bug("[\"aa\"]", "This treats reaching the final dial as success before validating the new adjacent pair.", "accept-before-validating-extension"), "The only possible spelling aa has equal neighbors."),
  task("one-dial", "Handle one dial", "prefix state identity", "dials=[\"xy\"]", canvas(true,["start","x","y"],[["start","x"],["start","y"]]), "Which complete code list is returned?", "[\"x\",\"y\"]", bug("[]", "This requires a previous rune before allowing any choice, so it prunes the first dial.", "apply-neighbor-check-at-depth-zero"), "A one-rune code has no adjacent pair to violate the rule."),
  task("fresh-exact", "Fresh asymmetric choices", "exact dial choices", "dials=[\"a\",\"bc\"]", canvas(true,["start","a","ab","ac"],[["start","a"],["a","ab"],["a","ac"]]), "Which complete code list is returned?", "[\"ab\",\"ac\"]", bug("[\"a\",\"b\",\"c\"]", "This returns dial choices separately instead of complete root-to-leaf codes.", "return-nodes-not-codes"), "Both second-dial choices differ from a."),
  task("fresh-node", "Keep prefixes distinct", "prefix state identity", "dials=[\"ab\",\"c\"]", canvas(true,["start","a","b","ac","bc"],[["start","a"],["start","b"],["a","ac"],["b","bc"]]), "How many complete prefix-state leaves exist?", "2", bug("1", "This merges ac and bc because both end in c, losing their different prefixes.", "merge-states-by-last-rune"), "The histories ac and bc are separate complete codes."),
  task("fresh-relation", "Fresh equality prune", "one-rune extensions", "dials=[\"b\",\"ab\"]", canvas(true,["start","b","ba"],[["start","b"],["b","ba"]]), "Which complete code list is returned?", "[\"ba\"]", bug("[\"ba\",\"bb\"]", "This creates an edge from b to bb even though the new rune equals the previous rune.", "add-illegal-equal-extension"), "Only extension a is legal after b."),
  task("fresh-output", "Fresh two valid leaves", "all valid codes", "dials=[\"xy\",\"x\"]", canvas(true,["start","x","y","yx"],[["start","x"],["start","y"],["y","yx"]]), "Which complete code list is returned?", "[\"yx\"]", bug("[\"xx\",\"yx\"]", "This includes xx even though its neighboring runes are equal.", "emit-pruned-branch"), "Starting x cannot extend with x; starting y can."),
  task("fresh-bug", "Catch global rune visited state", "all valid codes", "dials=[\"ab\",\"a\"]", canvas(true,["start","a","b","ba"],[["start","a"],["start","b"],["b","ba"]]), "Which complete code list is returned?", "[\"ba\"]", bug("[]", "This marks rune a globally used after exploring the first branch and refuses to reuse a in the separate b branch.", "global-used-runes-across-branches"), "Runes may repeat on different branches; only neighbors within one code must differ.")
]);

install("save-the-date-phone-chain", ["exact caller rows", "person identity", "caller-to-person timing edges", "deadline reach count"], [
  task("deadline-four", "Count callers by deadline", "deadline reach count", "n=6, headId=0, caller=[-1,0,0,1,1,2], waitDays=[2,3,1,0,0,0], deadline=4", canvas(true,[0,1,2,3,4,5],[[0,1,"+2"],[0,2,"+2"],[1,3,"+3"],[1,4,"+3"],[2,5,"+1"]]), "How many people know by the deadline?", "4", bug("6", "This counts every person in the phone tree without comparing their hearing day to deadline 4.", "ignore-deadline"), "People 0,1,2,5 hear on days 0,2,2,3; 3 and 4 hear on day 5."),
  task("head-only", "Keep the head at day zero", "person identity", "n=3, headId=2, caller=[2,2,-1], waitDays=[0,0,5], deadline=3", canvas(true,[2,0,1],[[2,0,"+5"],[2,1,"+5"]]), "How many people know by the deadline?", "1", bug("0", "This starts the head's day after their own wait instead of day 0.", "delay-head-start"), "The head counts on day 0; both reports hear on day 5."),
  task("parallel-calls", "Do not add sibling waits", "caller-to-person timing edges", "n=3, headId=0, caller=[-1,0,0], waitDays=[4,0,0], deadline=4", canvas(true,[0,1,2],[[0,1,"+4"],[0,2,"+4"]]), "How many people know by the deadline?", "3", bug("2", "This calls reports sequentially and pushes the second report to day 8.", "serialize-parallel-calls"), "The head calls both reports on day 4, so all three count."),
  task("deadline-zero", "Handle the earliest deadline", "deadline reach count", "n=4, headId=2, caller=[2,0,-1,2], waitDays=[1,0,2,0], deadline=0", canvas(true,[2,0,3,1],[[2,0,"+2"],[2,3,"+2"],[0,1,"+1"]]), "How many people know by the deadline?", "1", bug("3", "This compares each person's own waitDays value to the deadline instead of their accumulated hearing day.", "compare-own-wait-not-arrival-day"), "Only the head knows on day 0."),
  task("fresh-exact", "Fresh uneven tree", "exact caller rows", "n=5, headId=0, caller=[-1,0,0,1,2], waitDays=[1,4,2,0,0], deadline=4", canvas(true,[0,1,2,3,4],[[0,1,"+1"],[0,2,"+1"],[1,3,"+4"],[2,4,"+2"]]), "How many people know by day 4?", "4", bug("5", "This includes person 3 at day 5 because it checks a strict cutoff one day late.", "deadline-off-by-one"), "Everyone except person 3 hears by day 4."),
  task("fresh-node", "Fresh nonzero head", "person identity", "n=3, headId=1, caller=[1,-1,1], waitDays=[0,2,0], deadline=2", canvas(true,[1,0,2],[[1,0,"+2"],[1,2,"+2"]]), "How many person nodes are in the tree?", "3", bug("2", "This mistakes headId 1 for an array length boundary and drops person 2.", "use-head-id-as-node-count"), "All indices 0,1,2 are people."),
  task("fresh-relation", "Fresh caller direction", "caller-to-person timing edges", "n=2, headId=1, caller=[1,-1], waitDays=[0,3], deadline=3", canvas(true,[1,0],[[1,0,"+3"]]), "On what day does person 0 hear?", "3", bug("0", "This reverses the caller edge and treats person 0's zero wait as the edge cost.", "reverse-caller-edge"), "Caller 1 waits 3 days before calling person 0."),
  task("fresh-output", "Fresh exact-deadline arrival", "deadline reach count", "n=3, headId=0, caller=[-1,0,1], waitDays=[2,3,0], deadline=5", canvas(true,[0,1,2],[[0,1,"+2"],[1,2,"+3"]]), "How many people know by day 5?", "3", bug("2", "This uses day < deadline and excludes a person who hears exactly on day 5.", "use-strict-deadline"), "The deadline is inclusive, so person 2 counts."),
  task("fresh-bug", "Catch non-cumulative timing", "deadline reach count", "n=4, headId=0, caller=[-1,0,1,2], waitDays=[1,2,3,0], deadline=3", canvas(true,[0,1,2,3],[[0,1,"+1"],[1,2,"+2"],[2,3,"+3"]]), "How many people know by day 3?", "3", bug("4", "This compares each manager's individual wait to 3 and forgets to accumulate time down the chain.", "use-local-wait-only"), "People 0,1,2 hear on days 0,1,3; person 3 hears on day 6.")
]);

install("shut-the-garden-valve", ["exact sprinkler rows", "sprinkler identity and flow", "feed-to-child arrows", "shut-subtree flow sum"], [
  task("shut-middle", "Sum one shut subtree", "shut-subtree flow sum", "ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=2", canvas(true,["1:5","2:10","3:20","4:40"],[["1:5","2:10"],["1:5","3:20"],["2:10","4:40"]]), "How many liters per hour are saved?", "50", bug("40", "This sums only descendants and forgets shut sprinkler 2's own 10 L/h.", "exclude-shut-sprinkler"), "Sprinklers 2 and 4 stop, saving 10+40=50."),
  task("shut-root", "Shut the whole tree", "shut-subtree flow sum", "ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=1", canvas(true,["1:5","2:10","3:20","4:40"],[["1:5","2:10"],["1:5","3:20"],["2:10","4:40"]]), "How many liters per hour are saved?", "75", bug("70", "This omits the root sprinkler's own 5 L/h.", "sum-descendants-only"), "Every sprinkler is below 1, so 5+10+20+40=75."),
  task("shut-leaf", "Shut one leaf", "feed-to-child arrows", "ids=[5,9,2], feeds=[0,5,5], liters=[7,4,6], shutId=9", canvas(true,["5:7","9:4","2:6"],[["5:7","9:4"],["5:7","2:6"]]), "How many liters per hour are saved?", "4", bug("11", "This follows the feed edge backward and includes parent sprinkler 5.", "reverse-feed-direction"), "Leaf 9 stops alone."),
  task("single", "Handle one sprinkler", "sprinkler identity and flow", "ids=[42], feeds=[0], liters=[13], shutId=42", canvas(true,["42:13"],[]), "How many liters per hour are saved?", "13", bug("0", "This requires at least one outgoing feed edge before counting the shut sprinkler.", "drop-leaf-shut-node"), "The single sprinkler itself stops spraying 13 L/h."),
  task("fresh-exact", "Fresh branching pipes", "exact sprinkler rows", "ids=[10,20,30,40], feeds=[0,10,10,20], liters=[2,3,5,7], shutId=20", canvas(true,["10:2","20:3","30:5","40:7"],[["10:2","20:3"],["10:2","30:5"],["20:3","40:7"]]), "How many liters per hour are saved?", "10", bug("15", "This includes sibling sprinkler 30 even though it is not fed through 20.", "include-sibling-subtree"), "Sprinklers 20 and 40 save 3+7=10."),
  task("fresh-node", "Use IDs, not indexes", "sprinkler identity and flow", "ids=[30,10,20], feeds=[0,30,10], liters=[7,1,9], shutId=10", canvas(true,["30:7","10:1","20:9"],[["30:7","10:1"],["10:1","20:9"]]), "How many liters per hour are saved?", "10", bug("9", "This finds the row at array index 10 incorrectly and counts only child 20's flow.", "sprinkler-id-as-array-index"), "IDs 10 and 20 stop, saving 1+9=10."),
  task("fresh-relation", "Fresh downward flow", "feed-to-child arrows", "ids=[8,3,6], feeds=[0,8,3], liters=[4,5,2], shutId=3", canvas(true,["8:4","3:5","6:2"],[["8:4","3:5"],["3:5","6:2"]]), "How many liters per hour are saved?", "7", bug("9", "This walks upward to feeder 8 and adds its 4 L/h instead of descendant 6's 2 L/h.", "walk-to-ancestors"), "Shutting 3 stops 3 and child 6: 5+2=7."),
  task("fresh-output", "Fresh multi-level sum", "shut-subtree flow sum", "ids=[1,2,3], feeds=[0,1,2], liters=[6,7,8], shutId=1", canvas(true,["1:6","2:7","3:8"],[["1:6","2:7"],["2:7","3:8"]]), "How many liters per hour are saved?", "21", bug("13", "This stops after the direct child and misses grandchild sprinkler 3.", "sum-only-direct-children"), "All three flows stop: 6+7+8=21."),
  task("fresh-bug", "Catch flow-vs-count confusion", "shut-subtree flow sum", "ids=[4,5,6], feeds=[0,4,4], liters=[100,1,1], shutId=4", canvas(true,["4:100","5:1","6:1"],[["4:100","5:1"],["4:100","6:1"]]), "How many liters per hour are saved?", "102", bug("3", "This returns the number of stopped sprinklers instead of summing their flow values.", "count-nodes-not-liters"), "Three sprinklers stop, but their flows total 100+1+1=102.")
]);

install("kth-song-in-playlist", ["exact nesting", "folder and song identity", "direct containment edges", "depth-first play order"], [
  task("fourth-song", "Find a deep fourth song", "depth-first play order", "playlist=[[1,2],[3,[4,5]]], k=4", canvas(true,["root","A","1","2","B","3","C","4","5"],[["root","A"],["A","1"],["A","2"],["root","B"],["B","3"],["B","C"],["C","4"],["C","5"]]), "Which song ID is returned?", "4", bug("3", "This counts folder B as an item in the song position.", "count-folders-as-songs"), "Play order is 1,2,3,4,5; the fourth is 4."),
  task("empty-folders", "Skip empty folders", "folder and song identity", "playlist=[7,[[]],[8,[9]]], k=3", canvas(true,["root","7","A","empty","B","8","C","9"],[["root","7"],["root","A"],["A","empty"],["root","B"],["B","8"],["B","C"],["C","9"]]), "Which song ID is returned?", "9", bug("8", "This treats the empty inner folder as one playlist position and shifts later songs.", "count-empty-folder-as-song"), "The songs are 7,8,9; empty folders add no song."),
  task("left-to-right", "Preserve folder position", "direct containment edges", "playlist=[[1,[2]],3], k=2", canvas(true,["root","A","1","B","2","3"],[["root","A"],["A","1"],["A","B"],["B","2"],["root","3"]]), "Which song ID is returned?", "2", bug("3", "This plays all top-level songs before entering nested folders.", "breadth-first-play-order"), "Diving into the first folder yields 1 then 2 before top-level 3."),
  task("too-short", "Handle k beyond the playlist", "depth-first play order", "playlist=[[5],6], k=3", canvas(true,["root","A","5","6"],[["root","A"],["A","5"],["root","6"]]), "Which value is returned?", "-1", bug("6", "This returns the last song when the counter never reaches k.", "return-last-song-on-shortfall"), "Only two songs exist, fewer than k=3."),
  task("fresh-exact", "Fresh nested order", "exact nesting", "playlist=[3,[8,[5,9]],[],4], k=4", canvas(true,["root","3","A","8","B","5","9","empty","4"],[["root","3"],["root","A"],["A","8"],["A","B"],["B","5"],["B","9"],["root","empty"],["root","4"]]), "Which song ID is returned?", "9", bug("4", "This skips nested folder B and advances to top-level song 4 too early.", "skip-nested-folder"), "The order is 3,8,5,9,4."),
  task("fresh-node", "Keep repeated songs separate", "folder and song identity", "playlist=[2,[2]], k=2", canvas(true,["root","2a","A","2b"],[["root","2a"],["root","A"],["A","2b"]]), "Which song ID is returned?", "2", bug("-1", "This de-duplicates equal IDs and thinks only one occurrence exists.", "deduplicate-song-ids"), "Equal IDs in different positions are two song occurrences."),
  task("fresh-relation", "Fresh direct containment", "direct containment edges", "playlist=[[[2]],6], k=1", canvas(true,["root","A","B","2","6"],[["root","A"],["A","B"],["B","2"],["root","6"]]), "Which song ID is returned?", "2", bug("6", "This visits all top-level values before opening the first folder.", "ignore-folder-position"), "The first top-level item is a folder containing song 2."),
  task("fresh-output", "Fresh first-index check", "depth-first play order", "playlist=[10,[20,30]], k=1", canvas(true,["root","10","A","20","30"],[["root","10"],["root","A"],["A","20"],["A","30"]]), "Which song ID is returned?", "10", bug("20", "This treats k as zero-indexed and advances past the first song.", "zero-index-k"), "k is 1-indexed, so the first song is 10."),
  task("fresh-bug", "Catch early empty-folder return", "depth-first play order", "playlist=[[1],[],[2]], k=2", canvas(true,["root","A","1","empty","B","2"],[["root","A"],["A","1"],["root","empty"],["root","B"],["B","2"]]), "Which song ID is returned?", "2", bug("-1", "This returns failure after the empty middle folder instead of continuing.", "return-after-empty-folder"), "The second song appears in the final folder.")
]);

install("museum-vault-keyring", ["exact vault contents", "vault identity", "vault-to-key arrows", "distinct reachable vault count"], [
  task("two-starts", "Combine starting-key searches", "distinct reachable vault count", "vaults=[[1],[2],[],[2,5],[],[]], startKeys=[0,3]", canvas(true,[0,1,2,3,4,5],[[0,1],[1,2],[3,2],[3,5]]), "How many distinct vaults open?", "5", bug("6", "This adds reach counts from both starts and double-counts vault 2.", "double-count-overlapping-reach"), "The union is {0,1,2,3,5}; vault 4 stays sealed."),
  task("cycle", "Stop safely in a key cycle", "vault-to-key arrows", "vaults=[[1],[2],[0],[]], startKeys=[1]", canvas(true,[0,1,2,3],[[0,1],[1,2],[2,0]]), "How many distinct vaults open?", "3", bug("4", "This counts a repeated opening in the cycle as a new vault.", "count-revisited-vault"), "Vaults 1,2,0 open once each; vault 3 is unreachable."),
  task("locked-key", "Respect where a key is found", "exact vault contents", "vaults=[[],[0],[]], startKeys=[2]", canvas(true,[0,1,2],[[1,0]]), "How many distinct vaults open?", "1", bug("2", "This uses key 0 from locked vault 1 without opening vault 1 first.", "collect-keys-from-locked-vaults"), "Only starting key 2 is usable."),
  task("duplicate-start", "Count a vault once", "vault identity", "vaults=[[1],[]], startKeys=[0,0]", canvas(true,[0,1],[[0,1]]), "How many distinct vaults open?", "2", bug("3", "This counts vault 0 twice because startKeys repeats key 0.", "count-duplicate-start-keys"), "Distinct vaults 0 and 1 open once each."),
  task("fresh-exact", "Fresh two components", "exact vault contents", "vaults=[[1],[],[3],[]], startKeys=[2]", canvas(true,[0,1,2,3],[[0,1],[2,3]]), "How many distinct vaults open?", "2", bug("4", "This starts a search from every vault rather than startKeys.", "search-all-vault-components"), "Start key 2 opens vaults 2 and 3 only."),
  task("fresh-node", "Keep an empty vault node", "vault identity", "vaults=[[1],[],[]], startKeys=[0]", canvas(true,[0,1,2],[[0,1]]), "How many vault nodes exist?", "3", bug("2", "This drops empty unreachable vault 2 from the input model.", "drop-empty-unreachable-vault"), "Every list index is a vault."),
  task("fresh-relation", "Fresh key direction", "vault-to-key arrows", "vaults=[[],[0]], startKeys=[0]", canvas(true,[0,1],[[1,0]]), "How many distinct vaults open?", "1", bug("2", "This reverses arrow 1→0 and invents key 1 inside vault 0.", "reverse-key-arrow"), "Vault 0 is empty; vault 1 stays sealed."),
  task("fresh-output", "Fresh direct chain", "distinct reachable vault count", "vaults=[[2],[],[1]], startKeys=[0]", canvas(true,[0,1,2],[[0,2],[2,1]]), "How many distinct vaults open?", "3", bug("2", "This counts only direct keys from the starting vault.", "direct-keys-only"), "Opening 0 yields 2, then opening 2 yields 1."),
  task("fresh-bug", "Catch visited-key confusion", "distinct reachable vault count", "vaults=[[1,2],[2],[]], startKeys=[0]", canvas(true,[0,1,2],[[0,1],[0,2],[1,2]]), "How many distinct vaults open?", "3", bug("2", "This marks key 2 seen when discovered but fails to count vault 2 when opened.", "mark-key-seen-before-counting-vault"), "All three vaults open; duplicate discovery of key 2 changes nothing.")
]);

install("top-of-the-pile", ["exact nesting", "container and item identity", "direct containment edges", "shallowest occupied depth sum"], [
  task("top-item", "Stop at the first occupied depth", "shallowest occupied depth sum", "items=[[[5,6]],7,[8]]", canvas(true,["root","A","B","5","6","7","C","8"],[["root","A"],["A","B"],["B","5"],["B","6"],["root","7"],["root","C"],["C","8"]]), "What sum is returned?", "7", bug("15", "This adds every integer at every depth.", "sum-all-depths"), "Item 7 is the only integer at depth 1."),
  task("empty-top", "Pass through empty container levels", "direct containment edges", "items=[[],[[2,3]],[[4]]]", canvas(true,["root","empty","A","B","2","3","C","D","4"],[["root","empty"],["root","A"],["A","B"],["B","2"],["B","3"],["root","C"],["C","D"],["D","4"]]), "What sum is returned?", "9", bug("0", "This treats top-level arrays as occupied loose-item nodes and stops before reaching integers.", "container-counts-as-item"), "The shallowest integers 2,3,4 all occur at depth 3."),
  task("two-shallow", "Ignore deeper peers", "exact nesting", "items=[[6],5,[4]]", canvas(true,["root","A","6","5","B","4"],[["root","A"],["A","6"],["root","5"],["root","B"],["B","4"]]), "What sum is returned?", "5", bug("15", "This includes deeper items 6 and 4 after finding top-level item 5.", "continue-below-first-depth"), "Item 5 is alone at depth 1."),
  task("zero-sum", "Do not confuse zero with empty", "shallowest occupied depth sum", "items=[[],[6,-6],[[9]]]", canvas(true,["root","empty","A","6","-6","B","C","9"],[["root","empty"],["root","A"],["A","6"],["A","-6"],["root","B"],["B","C"],["C","9"]]), "What sum is returned?", "0", bug("9", "This treats sum zero as no shallow items and continues deeper.", "zero-sum-means-empty-depth"), "Items 6 and -6 occupy depth 2; their sum is 0."),
  task("fresh-exact", "Fresh shallow pair", "exact nesting", "items=[[1],2,3]", canvas(true,["root","A","1","2","3"],[["root","A"],["A","1"],["root","2"],["root","3"]]), "What sum is returned?", "5", bug("6", "This adds deeper item 1 to shallow items 2 and 3.", "sum-deeper-items"), "The shallowest depth contains 2 and 3."),
  task("fresh-node", "Keep equal items separate", "container and item identity", "items=[[4],[4]]", canvas(true,["root","A","4a","B","4b"],[["root","A"],["A","4a"],["root","B"],["B","4b"]]), "What sum is returned?", "8", bug("4", "This de-duplicates equal item values.", "deduplicate-equal-items"), "Both separate 4 items occur at depth 2."),
  task("fresh-relation", "Fresh direct containment", "direct containment edges", "items=[[[2]],3]", canvas(true,["root","A","B","2","3"],[["root","A"],["A","B"],["B","2"],["root","3"]]), "What sum is returned?", "3", bug("5", "This flattens deep item 2 into the root and adds it to 3.", "flatten-before-depth-search"), "Top-level 3 is shallower than nested 2."),
  task("fresh-output", "Fresh negative shallow sum", "shallowest occupied depth sum", "items=[-2,[10]]", canvas(true,["root","-2","A","10"],[["root","-2"],["root","A"],["A","10"]]), "What sum is returned?", "-2", bug("10", "This skips a negative shallow value and continues until finding a positive item.", "skip-negative-shallow-items"), "The first occupied depth contains -2, regardless of sign."),
  task("fresh-bug", "Catch first-item-only logic", "shallowest occupied depth sum", "items=[[1,2],[3]]", canvas(true,["root","A","1","2","B","3"],[["root","A"],["A","1"],["A","2"],["root","B"],["B","3"]]), "What sum is returned?", "6", bug("1", "This returns after the first integer at the shallowest occupied depth.", "stop-after-first-shallow-item"), "All integers 1,2,3 share depth 2." )
]);

if (records.size !== assigned.size) throw new Error(`Expected ${assigned.size} assigned records, found ${records.size}`);
const payload = normalizeGridNodeLabels([...records.values()], specs);
fs.writeFileSync(payloadFile, `${JSON.stringify(payload, null, 2)}\n`);

if (process.argv.includes("--merge")) {
  const latest = JSON.parse(fs.readFileSync(sharedFile, "utf8"));
  const replacement = new Map(payload.map(record => [record.id, record]));
  const merged = normalizeGridNodeLabels(latest.map(record => replacement.get(record.id) || record), specs);
  fs.writeFileSync(sharedFile, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Merged ${payload.length} assigned Variant records; preserved ${merged.length - payload.length} others.`);
} else {
  console.log(`Authored ${payload.length} assigned Variant records in ${payloadFile}; shared file unchanged.`);
}
