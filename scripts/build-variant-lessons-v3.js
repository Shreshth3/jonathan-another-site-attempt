const fs = require("fs");
const path = require("path");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");
const vm = require("vm");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("visual-data.js", "utf8"), sandbox);
const runtimeProblems = sandbox.window.DFS_VISUAL_DATA.problems;
const walkthroughDir = path.resolve(__dirname, "../../jonathan-study-site/data/walkthroughs");
const walkthroughs = new Map(
  fs.readdirSync(walkthroughDir)
    .filter(name => /^wt-.*\.json$/.test(name))
    .flatMap(name => JSON.parse(fs.readFileSync(path.join(walkthroughDir, name), "utf8")))
    .map(item => [item.id, item.walkthrough])
);
const source = runtimeProblems.map(problem => ({ ...problem, diagram: walkthroughs.get(problem.id)?.diagram }));
const category = process.argv[2] === "new" ? "new" : "variant";
const specs = JSON.parse(fs.readFileSync(`visual-specs-${category}.json`, "utf8"));

const clean = value => String(value ?? "").replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
const clone = value => JSON.parse(JSON.stringify(value));

function fallbackCanvas(kind) {
  const directed = ["tree", "nested", "directed-graph", "backtracking"].includes(kind);
  return {
    directed,
    nodes: ["0", "1", "2", "3"].map(id => ({ id, label: id })),
    edges: [{ from: "0", to: "1" }, { from: "1", to: "2" }, { from: "0", to: "3" }]
  };
}

function diagramCanvas(problem) {
  const svg = problem.diagram?.svg || "";
  const nodes = [];
  const positions = new Map();
  for (const match of svg.matchAll(/<g data-id="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)) {
    const [, id, body] = match;
    const circle = body.match(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"/);
    const rect = body.match(/<rect[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/);
    const text = [...body.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map(x => clean(x[1])).filter(Boolean).join(" · ");
    let x = 0, y = 0;
    if (circle) [x, y] = [Number(circle[1]), Number(circle[2])];
    else if (rect) [x, y] = [Number(rect[1]) + Number(rect[3]) / 2, Number(rect[2]) + Number(rect[4]) / 2];
    nodes.push({ id, label: text || id });
    positions.set(id, { x, y });
  }
  if (nodes.length < 2) return fallbackCanvas(problem.visualKind);
  const labelCounts = new Map();
  for (const node of nodes) labelCounts.set(node.label, (labelCounts.get(node.label) || 0) + 1);
  for (const node of nodes) if (labelCounts.get(node.label) > 1) node.label = `${node.label} · ${node.id}`;
  const nearest = (x, y) => nodes.reduce((best, node) => {
    const p = positions.get(node.id); const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    return !best || d < best.d ? { id: node.id, d } : best;
  }, null)?.id;
  const edges = [];
  for (const line of svg.matchAll(/<line class="dg-edge"[^>]*x1="([\d.]+)"[^>]*y1="([\d.]+)"[^>]*x2="([\d.]+)"[^>]*y2="([\d.]+)"[^>]*>/g)) {
    const from = nearest(Number(line[1]), Number(line[2]));
    const to = nearest(Number(line[3]), Number(line[4]));
    if (from && to && from !== to && !edges.some(e => e.from === from && e.to === to)) edges.push({ from, to });
  }
  if (!edges.length) return fallbackCanvas(problem.visualKind);
  // Building is the thinking step, not a clicking marathon. Keep hand-built cases small.
  const compactNodes = nodes.slice(0, 8);
  const compactIds = new Set(compactNodes.map(node => node.id));
  const compactEdges = edges.filter(edge => compactIds.has(edge.from) && compactIds.has(edge.to)).slice(0, 10);
  return { directed: ["tree", "nested", "directed-graph", "backtracking"].includes(problem.visualKind), nodes: compactNodes, edges: compactEdges };
}

function variants(canvas) {
  const exact = clone(canvas);
  const missing = clone(canvas); missing.edges = missing.edges.slice(0, Math.max(0, missing.edges.length - 1));
  const alternate = clone(canvas);
  if (alternate.edges.length) {
    if (alternate.directed) [alternate.edges[0].from, alternate.edges[0].to] = [alternate.edges[0].to, alternate.edges[0].from];
    else {
      const existing = new Set(alternate.edges.flatMap(e => [`${e.from}|${e.to}`, `${e.to}|${e.from}`]));
      outer: for (const a of alternate.nodes) for (const b of alternate.nodes) if (a.id !== b.id && !existing.has(`${a.id}|${b.id}`)) { alternate.edges.push({ from: a.id, to: b.id }); break outer; }
    }
  }
  const boundary = { directed: canvas.directed, nodes: [clone(canvas.nodes[0])], edges: [] };
  return [exact, missing, alternate, boundary];
}

function choice(id, label, feedback, misconception = null) { return { id, label, feedback, misconception }; }

function topologyDecision(canvas, mode) {
  const n = canvas.nodes.length, e = canvas.edges.length;
  if (mode === 0) return {
    prompt: "How many separate entity nodes must be placed?",
    choices: [choice("exact", String(n), `Correct. The input names ${n} separate entities.`, null), choice("drop-leaf", String(Math.max(0,n-1)), "This drops the final or isolated entity even though entities do not need an edge to exist.", "drop-isolated-entity"), choice("endpoint-copies", String(Math.max(n+2,2*e)), "This creates a fresh node for each relation endpoint occurrence instead of reusing the same entity node.", "duplicate-endpoint-nodes"), choice("add-container", String(n+1), "This turns the input container into an extra entity node.", "container-as-node")], correct: "exact"
  };
  if (mode === 1) return {
    prompt: "How many direct relations belong in the finished picture?",
    choices: [choice("exact", String(e), `Correct. Exactly ${e} direct relations are listed.`, null), choice("restore-removed", String(e+1), "This carries over one relation from the earlier input instead of reading this fresh case.", "reuse-previous-edge"), choice("drop-one", String(e === 0 ? e+2 : e-1), e === 0 ? "This invents two relations by assuming the lone entities must be connected." : "This skips the final listed direct relation.", e === 0 ? "connect-by-position" : "stop-before-last-edge"), choice("double", String(e === 0 ? 3 : (e*2 === e+1 ? e+2 : e*2)), e === 0 ? "This invents a self-relation plus two traversal directions even though none are listed." : (canvas.directed ? "This invents a reverse arrow for every one-way relation." : "This counts both reading directions as two different edges."), e === 0 ? "invent-empty-case-edges" : (canvas.directed ? "make-directed-edge-two-way" : "double-undirected-edge"))], correct: "exact"
  };
  if (mode === 2) return {
    prompt: canvas.directed ? "Must the first listed relation keep its shown direction?" : "Should each shown relation work in both directions?",
    choices: canvas.directed
      ? [choice("yes","Yes—keep the arrow exactly as listed.","Correct. Reversing it changes which states can be reached.",null),choice("reverse","No—reverse every arrow before searching.","That follows the input backward and changes descendants into ancestors.","reverse-all-relations"),choice("both","No—make every arrow two-way.","That invents return moves the input never permits.","erase-direction"),choice("sort","Only keep arrows whose labels increase.","Node labels do not control the direction of a listed relation.","sort-controls-direction")]
      : [choice("yes","Yes—one line supports travel either way.","Correct. This relation is symmetric.",null),choice("listed","No—allow only the written endpoint order.","That treats an undirected pair as a one-way arrow.","pair-order-as-direction"),choice("source","Only relations leaving the chosen start are two-way.","The start changes the search, not the meaning of an edge.","source-controls-direction"),choice("twice","Draw two separate arrows for the two directions.","That duplicates one undirected relation instead of drawing one shared line.","duplicate-undirected-edge")],
    correct: "yes"
  };
  return {
    prompt: "What must the search do with this one isolated entity?",
    choices: [choice("keep","Keep it as a real one-node component/state.","Correct. A node can exist without any relation.",null),choice("drop","Drop it because it has no neighbor.","This loses a valid entity and gives the wrong boundary-case result.","drop-isolated-node"),choice("self","Add a self-relation so the node is valid.","The input lists no self-relation; isolation is allowed.","invent-self-edge"),choice("error","Reject the input as incomplete.","A one-entity input is a normal boundary case, not malformed data.","reject-singleton")], correct: "keep"
  };
}

function shuffledOptions(base, canvas) {
  const omit = clone(canvas); omit.nodes = omit.nodes.slice(0,-1); const ids = new Set(omit.nodes.map(n=>n.id)); omit.edges = omit.edges.filter(e=>ids.has(e.from)&&ids.has(e.to));
  const relation = clone(canvas); if (relation.edges.length) relation.edges.pop();
  const direction = clone(canvas); if (direction.edges.length) [direction.edges[0].from,direction.edges[0].to]=[direction.edges[0].to,direction.edges[0].from];
  return [
    choice("exact","Picture A","Correct. It keeps every entity and every direct relation.",null),
    choice("omit","Picture B","This drops a real final/isolated entity from the fresh input.","omit-entity"),
    choice("relation","Picture C","This misses the final direct relation.","omit-final-relation"),
    choice("direction","Picture D",canvas.directed?"This reverses the first arrow.":"This treats endpoint order as direction.",canvas.directed?"reverse-first-arrow":"direct-undirected-pair")
  ].map((c,i)=>({...c,model:[base,omit,relation,direction][i]}));
}

function normalizeQuestion(q) {
  return { prompt:q.prompt, choices:q.choices.map(c=>({id:c.id,label:c.label,feedback:c.feedback,misconception:c.misconception})), correct:q.correct };
}

const smallBuildBases = {
  "busiest-shelf-level": {input:"items = [1,[2,3],[[4]]]",canvas:{directed:true,nodes:[{id:"root",label:"outer []"},{id:"v1",label:"[0]=1"},{id:"a",label:"[1] box"},{id:"v2",label:"[1][0]=2"},{id:"v3",label:"[1][1]=3"},{id:"b",label:"[2] box"},{id:"c",label:"[2][0] box"},{id:"v4",label:"[2][0][0]=4"}],edges:[{from:"root",to:"v1"},{from:"root",to:"a"},{from:"a",to:"v2"},{from:"a",to:"v3"},{from:"root",to:"b"},{from:"b",to:"c"},{from:"c",to:"v4"}]}},
  "coins-on-level-k": {input:"items = [[3,2],5,[[4]]], k = 2",canvas:{directed:true,nodes:[{id:"root",label:"outer []"},{id:"a",label:"[0] box"},{id:"v3",label:"[0][0]=3"},{id:"v2",label:"[0][1]=2"},{id:"v5",label:"[1]=5"},{id:"b",label:"[2] box"},{id:"c",label:"[2][0] box"},{id:"v4",label:"[2][0][0]=4"}],edges:[{from:"root",to:"a"},{from:"a",to:"v3"},{from:"a",to:"v2"},{from:"root",to:"v5"},{from:"root",to:"b"},{from:"b",to:"c"},{from:"c",to:"v4"}]}},
  "counting-constellations": {input:'sky = [[1,0,1],[0,1,0],[0,0,1]]',canvas:{directed:false,nodes:[{id:"r0c0",label:"(0,0)=1"},{id:"r0c2",label:"(0,2)=1"},{id:"r1c1",label:"(1,1)=1"},{id:"r2c2",label:"(2,2)=1"}],edges:[{from:"r0c0",to:"r1c1"},{from:"r0c2",to:"r1c1"},{from:"r1c1",to:"r2c2"}]}},
  "top-of-the-pile": {input:"items = [[6],5,[4]]",canvas:{directed:true,nodes:[{id:"root",label:"outer []"},{id:"a",label:"[0] box"},{id:"v6",label:"[0][0]=6"},{id:"v5",label:"[1]=5"},{id:"b",label:"[2] box"},{id:"v4",label:"[2][0]=4"}],edges:[{from:"root",to:"a"},{from:"a",to:"v6"},{from:"root",to:"v5"},{from:"root",to:"b"},{from:"b",to:"v4"}]}}
};

const c = (id,label,feedback,misconception=null) => ({id,label,feedback,misconception});
const strongerPictureQuestions = {
  "counting-constellations": [
    {input:'sky = [[1,0,0,0,1],[0,1,0,0,0],[0,0,0,1,0],[0,0,0,0,1]]',prompt:"With diagonal touching allowed, how many constellations are in this sky?",correct:"three",choices:[c("three","3","Correct: the top-left pair and bottom-right pair are two groups, and the top-right star is alone."),c("five","5","This counts stars instead of connected star groups.","count-cells"),c("two","2","This finds the two diagonal pairs but drops the isolated top-right star.","drop-isolated-component"),c("one","1","This merges separate diagonal pairs even though no chain joins them.","merge-disconnected-groups")]},
    {input:'sky = [[0,1,0],[1,0,1],[0,1,0]]',prompt:"How many constellations are in the diamond-shaped sky?",correct:"one",choices:[c("one","1","Correct: all four stars connect through diagonal steps."),c("four","4","This checks side neighbors only and misses every diagonal connection.","side-only-search"),c("two","2","This pairs diagonals but fails to continue through already connected stars.","pair-without-transitive-search"),c("three","3","This explores from one top star only one diagonal direction, then starts two extra searches.","skip-one-diagonal-direction")]}
  ],
  "gold-and-silver-lights": [
    {input:"n=7, wires=[[0,1],[0,2],[1,3],[1,4],[2,6],[4,5]], goldStart=0",prompt:"Bulbs an even number of wires from bulb 0 are gold. How many bulbs are gold?",correct:"four",choices:[c("four","4","Correct: distances 0 and 2 contain bulbs 0, 3, 4, and 6."),c("three","3","This excludes the starting bulb even though distance 0 is even.","exclude-start"),c("two","2","This counts only bulbs at distance 2 under the first child and skips the other branch.","skip-branch"),c("seven","7","This counts every reachable bulb instead of only even-distance bulbs.","ignore-parity")]},
    {input:"n=6, wires=[[0,1],[1,2],[1,4],[0,3],[3,5]], goldStart=0",prompt:"Using even distance from bulb 0, how many bulbs are gold?",correct:"three",choices:[c("three","3","Correct: bulbs 0, 2, and 4 have even distance."),c("two","2","This forgets that the starting bulb at distance 0 is gold.","exclude-start"),c("four","4","This marks bulb 5 gold after resetting distance on the second branch.","reset-depth-per-branch"),c("six","6","This treats reachability as enough and ignores distance parity.","ignore-parity")]}
  ],
  "flooded-campsite-trails": [
    {input:"n=6, trails=[[0,3],[3,4],[4,5],[0,1],[1,2],[2,5]], flooded=[4], start=0, finish=5",prompt:"Can the hiker reach the finish without entering a flooded campsite?",correct:"true",choices:[c("true","true — use 0→1→2→5","Correct. The dry branch reaches campsite 5."),c("blocked-first","false — DFS first reaches flooded campsite 4","This returns after one failed branch instead of trying the other neighbor of 0.","return-after-first-branch"),c("any-flood","false — one flooded campsite invalidates the whole map","Flooding removes that node, not every trail elsewhere.","globalize-local-block"),c("avoid-finish","false — campsite 5 touches a route through flooded 4","A node may touch a flooded branch and still be reached by a separate dry branch.","taint-neighbor-of-flood") ]},
    {input:"n=4, trails=[[0,1],[1,2],[0,3],[3,2]], flooded=[2], start=0, finish=2",prompt:"What should the function return when the finish campsite itself is flooded?",correct:"false",choices:[c("false","false — the finish cannot be entered","Correct. Reaching a forbidden node is not a valid trip."),c("goal-first","true — check finish before checking flooded","This uses the wrong base-case order and accepts a forbidden destination.","goal-before-blocked-check"),c("path-exists","true — two graph paths reach campsite 2","Both routes end by entering the flooded finish.","ignore-restrictions"),c("one-dry-parent","true — campsite 1 is dry","A dry predecessor does not make its flooded neighbor enterable.","check-parent-not-destination") ]}
  ],
  "longest-freight-train": [
    {input:'yard=["T..","T.T","..T","..T"]',prompt:"This yard has two vertical trains. What longest train length is returned?",correct:"three",choices:[c("three","3","Correct: the right column contains a vertical run of three cars."),c("two","2","This returns the first train found and never compares the later run.","return-first-component"),c("five","5","This sums cars from two disconnected vertical trains.","sum-components"),c("one","1","This fails to continue from a car to its vertical neighbor.","no-recursion") ]},
    {input:'yard=["TTT.","....",".TTT"]',prompt:"What longest train length is returned?",correct:"three",choices:[c("three","3","Correct. Each separate run has length 3, so the maximum is 3."),c("six","6","This adds separate trains instead of taking their maximum.","sum-components"),c("two","2","This counts links between three cars instead of counting the cars.","count-edges"),c("one","1","This marks neighbors visited without adding their sizes.","visited-without-aggregation") ]}
  ],
  "one-color-metro-ride": [
    {input:'n=6, tracks=[[0,1],[1,3],[3,5],[0,2],[2,4],[4,3]], colors=["red","red","red","blue","blue","blue"], source=0, destination=5',prompt:"Can one route stay a single color from source to destination?",correct:"true",choices:[c("true","true — 0→1→3→5 stays red","Correct. One complete red route is enough."),c("blue-first","false — the blue search stops at station 3","This returns after a failed blue search and never tests the red graph.","return-after-first-color"),c("both","false — both colors must reach station 5","The rule requires at least one color, not both.","require-all-colors"),c("shortest","false — the shortest discovered route mixes colors","A longer valid one-color route still proves true.","judge-only-shortest-path") ]},
    {input:'n=5, tracks=[[0,1],[1,2],[2,3],[3,4]], colors=["red","blue","red","blue"], source=0, destination=4',prompt:"What should the function return?",correct:"false",choices:[c("false","false — every 0-to-4 route changes color","Correct. Neither color-specific graph reaches station 4."),c("combined","true — the uncolored graph is connected","This wrongly searches all tracks together.","ignore-colors"),c("edge-valid","true — every track has a valid color label","Each edge being colored does not make the whole route one color.","validate-edges-individually"),c("two-colors","true — the route uses only the two allowed colors","The trip must use one color, not merely colors from an allowed set.","allow-transfer") ]}
  ],
  "office-rumor-reach": [
    {input:"n=8, friendships=[[2,1],[1,0],[2,3],[3,4],[5,6]], start=2",prompt:"Including the starter, how many employees hear the rumor?",correct:"five",choices:[c("five","5","Correct: 2 reaches 1, 0, 3, and 4."),c("three","3","This counts only employee 2 and its direct friends 1 and 3.","direct-neighbors-only"),c("eight","8","This assumes one DFS crosses between disconnected friendship groups.","count-all-nodes"),c("four","4","This excludes the employee who starts the rumor.","exclude-source") ]},
    {input:"n=7, friendships=[[0,1],[1,2],[2,3],[3,4],[5,6]], start=6",prompt:"How many employees hear the rumor?",correct:"two",choices:[c("two","2","Correct: employees 6 and 5 form the starter's component."),c("one","1","This counts the starter but never follows the friendship to 5.","no-neighbor-traversal"),c("five","5","This returns the largest component instead of the starter's component.","largest-component"),c("seven","7","This counts every employee regardless of reachability.","count-all-nodes") ]}
  ],
  "perfect-size-campsites": [
    {input:'park=["GG..G","G...G","..G.G"], k=3',prompt:"Grass connects only by sides. How many grass components have exactly 3 cells?",correct:"two",choices:[c("two","2","Correct: the left patch and right column each have 3 cells."),c("three","3","This also counts the isolated center cell as perfect-sized.","ignore-target-size"),c("six","6","This returns the number of cells inside perfect components, not the component count.","sum-matching-cells"),c("one","1","This stops after finding the first matching component.","stop-after-first-match") ]},
    {input:'park=["GG..","....",".GG.","....","..GG"], k=2',prompt:"How many perfect-sized campsites are present?",correct:"three",choices:[c("three","3","Correct. There are three separate two-cell components."),c("six","6","This counts grass cells rather than components.","count-cells"),c("two","2","This skips the last grid row during the outer scan.","off-by-one-row-scan"),c("one","1","This merges disconnected pairs because they have the same size.","merge-equal-size-components") ]}
  ],
  "biggest-study-group": [
    {input:"n=7, friendships=[[0,1],[1,2],[2,3],[3,0],[4,5]]",prompt:"What is the size of the largest friendship component?",correct:"four",choices:[c("four","4","Correct: students 0,1,2,3 form the largest group."),c("three","3","This marks the start visited but forgets to include it in the component size.","exclude-component-start"),c("two","2","This returns the final non-isolated component rather than the maximum.","overwrite-maximum"),c("seven","7","This counts every student, including disconnected groups.","count-all-nodes") ]},
    {input:"n=5, friendships=[[0,1],[2,3]]",prompt:"What largest group size is returned?",correct:"two",choices:[c("two","2","Correct. The two pairs tie for largest; the isolated student has size 1."),c("four","4","This adds the sizes of two disconnected pairs.","sum-components"),c("one","1","This overwrites the maximum when the final isolated student is scanned.","overwrite-with-last-component"),c("five","5","This treats all declared students as one group.","ignore-connectivity") ]}
  ],
  "trusted-courier-networks": [
    {input:"trust=[[0,8,0,0,0,0],[8,0,7,0,0,0],[0,7,0,0,0,0],[0,0,0,0,9,0],[0,0,0,9,0,0],[0,0,0,0,0,0]], k=6",prompt:"How many trusted networks remain after keeping scores at least k?",correct:"three",choices:[c("three","3","Correct: {0,1,2}, {3,4}, and isolated office {5}."),c("two","2","This drops isolated office 5 instead of counting its one-node component.","drop-isolated-node"),c("one","1","This keeps zero-score matrix entries as edges and joins unrelated offices.","treat-zero-as-edge"),c("six","6","This counts offices rather than connected components.","count-nodes") ]},
    {input:"trust=[[0,5,0,0],[5,0,4,0],[0,4,0,6],[0,0,6,0]], k=4",prompt:"How many trusted networks are formed?",correct:"one",choices:[c("one","1","Correct. Scores 5, 4, and 6 form one chain across all offices."),c("two","2","This uses score > k and wrongly drops the score exactly equal to 4.","strict-threshold"),c("three","3","This counts qualifying edges instead of connected components.","count-edges"),c("four","4","This requires every pair in a component to have a direct qualifying edge.","require-clique") ]}
  ]
};

function lesson(spec) {
  const problem = source.find(p=>p.id===spec.id); if (!problem) throw new Error(`Missing ${spec.id}`);
  const smallBase = smallBuildBases[spec.id];
  const base = clone(smallBase?.canvas || diagramCanvas(problem)); const cases = variants(base);
  const facets = ["exact input", "direct relations", base.directed ? "arrow direction" : "two-way relation", "output boundary"];
  const baseInput = smallBase?.input || problem.diagram?.input || spec.pictureQuestions[0].input;
  const node = normalizeQuestion(spec.nodeQuestion), edge = normalizeQuestion(spec.edgeQuestion);
  const stronger = strongerPictureQuestions[spec.id];
  const pic1=normalizeQuestion(stronger?.[0] || spec.pictureQuestions[0]), pic2=normalizeQuestion(stronger?.[1] || spec.pictureQuestions[1]);
  const buildChecks = [node,edge,pic1,pic2];
  const candidateInputs = [baseInput,...(problem.examples || []).map(x=>x.input),stronger?.[0]?.input || spec.pictureQuestions[0].input,stronger?.[1]?.input || spec.pictureQuestions[1].input].filter(Boolean);
  const buildInputs = [...new Set(candidateInputs)].slice(0,4);
  while (buildInputs.length < 4) buildInputs.push(`${baseInput}\ncase = ${buildInputs.length + 1}`);
  const builds = cases.map((canvas,i)=>({
    id:`build-${i+1}`, title:["Build every real entity","Draw only direct relations","Build before predicting","Prove the tricky case"][i], facet:facets[i],
    prompt:"Use the raw input to complete the challenge. Then choose the result.", input:buildInputs[i], canvas,
    decision:buildChecks[i], why:buildChecks[i].choices.find(c=>c.id===buildChecks[i].correct).feedback
  }));
  const conceptSeeds = [cases[1],cases[2],cases[3],cases[0],cases[1]];
  const concepts = [
    {id:"concept-picture",title:"Match every detail",facet:facets[0],kind:"visual-options",prompt:"Which picture exactly matches this fresh case?",input:baseInput,choices:shuffledOptions(cases[0],cases[0]),correct:"exact",why:"The exact picture keeps all entities, direct relations, and the correct direction rule."},
    {id:"concept-node",title:"Name the real entities",facet:facets[0],kind:"choice",prompt:node.prompt,input:baseInput,choices:node.choices,correct:node.correct,why:node.choices.find(c=>c.id===node.correct).feedback},
    {id:"concept-edge",title:"Read one direct relation",facet:facets[1],kind:"choice",prompt:edge.prompt,input:baseInput+"\nFocus on one listed relation.",choices:edge.choices,correct:edge.correct,why:edge.choices.find(c=>c.id===edge.correct).feedback},
    {id:"concept-output",title:"Predict a fresh output",facet:facets[2],kind:"choice",prompt:pic1.prompt,input:(stronger?.[0]?.input || spec.pictureQuestions[0].input),choices:pic1.choices,correct:pic1.correct,why:pic1.choices.find(c=>c.id===pic1.correct).feedback},
    {id:"concept-counterexample",title:"Catch a realistic bug",facet:facets[3],kind:"choice",prompt:pic2.prompt,input:(stronger?.[1]?.input || spec.pictureQuestions[1].input),choices:pic2.choices,correct:pic2.correct,why:pic2.choices.find(c=>c.id===pic2.correct).feedback}
  ];
  const repairPool = [...new Set([...candidateInputs,...buildInputs])];
  const repairChecks = [edge,pic2,node,pic1,edge];
  concepts.forEach((c,i)=>{ const canvas=conceptSeeds[i], check=repairChecks[i]; const fresh=repairPool.find(x=>x.trim()!==String(c.input).trim()) || `${baseInput}\nboundaryCase = true`; c.remedial={id:`repair-${i+1}`,title:`Rebuild ${problem.title} from a fresh input`,prompt:"Use this fresh raw input to complete the challenge. Then choose the result.",input:fresh,canvas,decision:check,why:check.choices.find(x=>x.id===check.correct).feedback}; });
  return {id:spec.id,facets,buildTasks:builds,conceptTasks:concepts};
}

// Preserve the hand-authored golden metro lesson while rebuilding the other 24.
let goldenMetro = null;
if (category === "variant") try { goldenMetro = JSON.parse(fs.readFileSync("visual-lessons-variant.json", "utf8")).find(x => x.id === "one-color-metro-ride"); } catch {}
const output = normalizeGridNodeLabels(specs.map(spec => spec.id === "one-color-metro-ride" && goldenMetro ? goldenMetro : lesson(spec)), specs);
fs.writeFileSync(`visual-lessons-${category}.json`, JSON.stringify(output,null,2)+"\n");
console.log(`Built ${output.length} ${category} v3 lessons.`);
