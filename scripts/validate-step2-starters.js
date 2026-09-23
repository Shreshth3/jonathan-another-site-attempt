const fs = require("fs");
const vm = require("vm");
const path = require("path");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, "../visual-data.js"), "utf8"), sandbox);
const problems = sandbox.window.DFS_VISUAL_DATA.problems;
const failures = [];

function coordinate(label) {
  const match = String(label).match(/^\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function directed(problem) { return problem.lesson.buildTasks[0].canvas.directed; }
function isGrid(problem) { return problem.visualKind === "grid" || problem.id === "kattis-getting-gold"; }
function requiresTree(problem) {
  return new Set([
    "kill-process", "time-needed-to-inform-all-employees", "who-keeps-their-job", "save-the-date-phone-chain",
    "shut-the-garden-valve", "evaluate-boolean-binary-tree", "structy-max-root-to-leaf-path-sum", "structy-tree-sum",
    "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "the-balance-lock", "flatten-nested-list-iterator",
    "busiest-shelf-level", "coins-on-level-k", "kth-song-in-playlist", "top-of-the-pile", "codewars-array-deep-count",
    "minimum-fuel-cost-to-report-to-the-capital", "minimum-time-to-collect-all-apples-in-a-tree",
    "count-good-nodes-in-binary-tree", "diameter-of-binary-tree", "lowest-common-ancestor-of-a-binary-tree",
    "path-sum", "binary-tree-level-order-traversal", "invert-binary-tree", "same-tree",
    "subtree-of-another-tree", "balanced-binary-tree", "maximum-depth-of-binary-tree",
    "merge-two-binary-trees", "binary-tree-right-side-view", "validate-binary-search-tree",
    "kth-smallest-element-in-a-bst", "construct-binary-tree-from-preorder-and-inorder-traversal",
    "serialize-and-deserialize-binary-tree", "all-paths-from-source-lead-to-destination",
      "nested-list-weight-sum", "nested-list-weight-sum-ii", "employee-importance",
    "gold-and-silver-lights", "usaco-milk-factory"
  ]).has(problem.id);
}

function jugGraphForTest(capOne,capTwo,reverse=false){const label=(a,b)=>`(${a},${b})`,nodes=[label(0,0)],seen=new Set(nodes),pending=[nodes[0]],edges=[];while(pending.length){const from=pending.shift(),[a,b]=coordinate(from),p1=Math.min(a,capTwo-b),p2=Math.min(b,capOne-a),next=[[capOne,b],[a,capTwo],[0,b],[a,0],[a-p1,b+p1],[a+p2,b-p2]];for(const [x,y] of next){const to=label(x,y);if(to===from||edges.some(edge=>edge[0]===from&&edge[1]===to))continue;edges.push([from,to]);if(!seen.has(to)){seen.add(to);nodes.push(to);pending.push(to);}}}if(reverse)edges.reverse();return{directed:true,nodes,edges,start:'(0,0)'};}

function starter(problem, round) {
  const isDirected = directed(problem), base = round.bugs[0], grid = isGrid(problem);
  if (base === "first-start-only") return { directed: true, nodes: ["0","1"], edges: [], starts: ["0","1"], start: "0" };
  if (base === "strict-threshold") return { directed: false, nodes: ["0","1"], edges: [["0","1"]], fields: { k: 2, scores: [[2,2],[2,2]] }, start: "0" };
  if (grid && base === "make-one-way") return { directed: false, nodes: ["(0,0)","(0,1)"], edges: [["(0,1)","(0,0)"]], start: "(0,0)" };
  if (problem.id === "evaluate-division") {
    if (base === "wrong-start") return { directed: true, nodes: ["a","b","c"], edges: [["a","c"],["c","a"],["b","c"],["c","b"]], start: "a" };
    return { directed: true, nodes: ["a","b","c"], edges: [["a","b"],["b","a"],["c","b"],["b","c"]], start: "a" };
  }
  if (problem.id === "water-and-jug-problem") {
    if (base === "first-branch") return jugGraphForTest(2,3,true);
    return jugGraphForTest(1,2,false);
  }
  if (problem.id === "word-search") {
    if (base === "add-diagonals") return { directed:false,nodes:["(0,0)","(0,1)","(1,0)","(1,1)"],edges:[["(0,0)","(0,1)"],["(0,0)","(1,0)"],["(0,1)","(1,1)"],["(1,0)","(1,1)"]],start:"(0,0)" };
    if (base === "first-branch") { const nodes=[];for(let r=0;r<3;r++)for(let c=0;c<2;c++)nodes.push(`(${r},${c})`);const edges=[];for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){const x=coordinate(nodes[a]),y=coordinate(nodes[b]);if(Math.abs(x[0]-y[0])+Math.abs(x[1]-y[1])===1)edges.push([nodes[a],nodes[b]]);}return {directed:false,nodes,edges,start:"(0,0)"}; }
    return { directed:false,nodes:["(0,0)","(0,1)","(0,2)"],edges:[["(0,0)","(0,1)"],["(0,1)","(0,2)"]],start:"(0,0)" };
  }
  if (["minesweeper","gas-pocket-survey","flood-fill","ten-kinds-of-people"].includes(problem.id)) {
    const full=(rows,columns,diagonal=false)=>{const nodes=[],edges=[];for(let r=0;r<rows;r++)for(let c=0;c<columns;c++)nodes.push(`(${r},${c})`);for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){const one=coordinate(nodes[a]),two=coordinate(nodes[b]),dr=Math.abs(one[0]-two[0]),dc=Math.abs(one[1]-two[1]);if(diagonal?Math.max(dr,dc)===1:dr+dc===1)edges.push([nodes[a],nodes[b]]);}return {directed:false,nodes,edges,start:"(0,0)"};};
    if (base === "wrong-start") return full(1,2,problem.id==="minesweeper");
    if (base === "shallow-search" || base === "drop-last-edge" || base === "first-branch") return full(1,3,false);
    return full(2,2,problem.id==="minesweeper");
  }
  if (problem.id === "evaluate-boolean-binary-tree") {
    if (base === "last-branch") return { directed: true, nodes: ["0:AND","1:false","2:true"], edges: [["0:AND","1:false"],["0:AND","2:true"]], start: "0:AND" };
    if (base === "drop-last-edge") return { directed: true, nodes: ["0:AND","1:true","2:false"], edges: [["0:AND","1:true"],["0:AND","2:false"]], start: "0:AND" };
    return { directed: true, nodes: ["0:AND","1:true","2:true"], edges: [["0:AND","1:true"],["0:AND","2:true"]], start: "0:AND" };
  }
  if (problem.id === "usaco-milk-factory") {
    if (base === "drop-last-edge") return { directed: true, nodes: ["1","2","3"], edges: [["1","2"],["3","2"]], start: "1" };
    return { directed: true, nodes: ["1","2"], edges: [["1","2"]], start: "1" };
  }
  if (problem.id === "all-paths-from-source-to-target" && base === "last-branch") return { directed: true, nodes: ["0","1","2","3"], edges: [["0","1"],["0","2"],["1","3"],["2","3"]], start: "0" };
  if (["detonate-the-maximum-bombs", "moocast"].includes(problem.id) && base === "make-two-way") return { directed: true, nodes: ["0","1","2"], edges: [["0","2"],["1","2"]], start: "0" };
  if (problem.id === "ladder-takahashi" && base === "last-branch") return { directed: false, nodes: ["A","B","C","D"], edges: [["A","D"],["A","B"],["B","C"]], start: "A" };
  if (problem.id === "gold-and-silver-lights") {
    if (base === "make-one-way") return { directed: false, nodes: ["A","B","C"], edges: [["B","A"],["B","C"]], start: "A" };
    if (base === "last-branch") return { directed: false, nodes: ["A","B","C","D"], edges: [["A","B"],["B","D"],["A","C"]], start: "A" };
  }
  if (problem.id === "top-of-the-pile" && base === "first-branch") return { directed: true, nodes: ["A","B","C","D"], edges: [["A","B"],["B","D"],["A","C"]], start: "A" };
  if (problem.id === "structy-max-root-to-leaf-path-sum" && base === "last-branch") return { directed: true, nodes: ["A","B","C","D"], edges: [["A","B"],["B","D"],["A","C"]], start: "A" };
  if (problem.id === "course-schedule") {
    if (base === "make-two-way") return { directed: true, nodes: ["0","1"], edges: [["0","1"]], start: "0" };
    if (base === "shallow-search") return { directed: true, nodes: ["0","1","2"], edges: [["0","1"],["1","2"],["2","0"]], start: "0" };
    return { directed: true, nodes: ["0","1","2","3"], edges: [["0","1"],["0","2"],["2","3"],["3","2"]], start: "0" };
  }
  if (["is-graph-bipartite", "possible-bipartition"].includes(problem.id)) {
    return { directed: false, nodes: ["0","1","2"], edges: [["0","1"],["1","2"],["2","0"]], start: "0" };
  }
  if (problem.id === "routes-past-the-coffee-cart") {
    if (base === "reverse-arrows") return { directed: true, nodes: ["0","1"], edges: [["1","0"]], start: "0" };
    if (base === "first-branch") return { directed: true, nodes: ["0","1","2","3"], edges: [["0","1"],["0","2"],["2","3"]], start: "0" };
    return { directed: true, nodes: ["0","1","2"], edges: [["0","1"],["1","2"]], start: "0" };
  }
  if (problem.id === "one-color-metro-ride") {
    if (base === "ignore-colors") return { directed: false, nodes: ["A","B","C"], edges: [["A","B","red"],["B","C","blue"]], start: "A" };
    if (base === "red-only") return { directed: false, nodes: ["A","B"], edges: [["A","B","blue"]], start: "A" };
    return { directed: false, nodes: ["A","B","C","D"], edges: [["A","B","red"],["A","C","red"],["C","D","red"]], start: "A" };
  }
  if (base === "add-diagonals") return { directed: isDirected, nodes: ["(0,0)","(1,1)"], edges: [], start: "(0,0)" };
  if (base === "remove-diagonals") return { directed: isDirected, nodes: ["(0,0)","(1,1)"], edges: [["(0,0)","(1,1)"]], start: "(0,0)" };
  if (base === "reverse-arrows") return { directed: true, nodes: ["A","B"], edges: [["B","A"]], start: "A" };
  if (base === "drop-last-edge") return grid ? { directed: isDirected, nodes: ["(0,0)","(0,1)","(0,2)"], edges: [["(0,0)","(0,1)"],["(0,1)","(0,2)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A","B","C"], edges: [["A","B"],["B","C"]], start: "A" };
  if (base === "skip-leaf-edges") return { directed: isDirected, nodes: ["A","B","C"], edges: isDirected ? [["A","B"],["A","C"]] : [["A","B"],["B","C"]], start: isDirected ? "A" : "B" };
  if (base === "wrong-start") return grid ? { directed: isDirected, nodes: ["(0,0)","(0,1)","(0,2)"], edges: [["(0,1)","(0,2)"]], start: "(0,1)" } : requiresTree(problem) ? { directed: isDirected, nodes: ["A","B","C"], edges: [["B","A"],["B","C"]], start: "B" } : { directed: isDirected, nodes: ["A","B","C"], edges: [["B","C"]], start: "B" };
  if (base === "last-branch") return grid ? { directed: isDirected, nodes: ["(0,0)","(0,1)","(1,0)","(2,0)"], edges: [["(0,0)","(0,1)"],["(0,0)","(1,0)"],["(1,0)","(2,0)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A","B","C","D"], edges: [["A","B"],["A","C"],["C","D"]], start: "A" };
  if (base === "make-one-way") return { directed: false, nodes: ["A","B"], edges: [["B","A"]], start: "A" };
  if (base === "make-two-way") return { directed: true, nodes: ["A","B"], edges: [["B","A"]], start: "A" };
  if (base === "shallow-search") return grid ? { directed: isDirected, nodes: ["(0,0)","(0,1)","(0,2)"], edges: [["(0,0)","(0,1)"],["(0,1)","(0,2)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A","B","C"], edges: [["A","B"],["B","C"]], start: "A" };
  return grid ? { directed: isDirected, nodes: ["(0,0)","(0,1)","(1,0)","(2,0)"], edges: [["(0,0)","(0,1)"],["(0,0)","(1,0)"],["(1,0)","(2,0)"]], start: "(0,0)" } : { directed: isDirected, nodes: ["A","B","C","D"], edges: [["A","B"],["A","C"],["C","D"]], start: "A" };
}

function addGridSemantics(problem,round,graph){
  if(problem.id==="villages-without-wells"){graph.nodeMarkers={hasWell:Object.fromEntries(graph.nodes.map(node=>[node,node===graph.start?'yes':'no']))};return graph;}
  if(["count-sub-islands","kattis-getting-gold","maximum-number-of-fish-in-a-grid"].includes(problem.id)){
    graph.nodeMarkers={};
    if(problem.id==="count-sub-islands"){const values=Object.fromEntries(graph.nodes.map(node=>[node,'yes']));values[graph.nodes.at(-1)]='no';graph.nodeMarkers.grid1Land=values;}
    if(problem.id==="kattis-getting-gold"){const values=Object.fromEntries(graph.nodes.map(node=>[node,'no']));values[graph.nodes.at(-1)]='yes';graph.nodeMarkers.containsGold=values;}
    if(problem.id==="maximum-number-of-fish-in-a-grid"){const values=Object.fromEntries(graph.nodes.map((node,index)=>[node,index===graph.nodes.length-1?10:1]));graph.nodeMarkers.fishCount=values;}
    return graph;
  }
  if(!["minesweeper","gas-pocket-survey","flood-fill","ten-kinds-of-people"].includes(problem.id))return graph;
  const rows=Math.max(...graph.nodes.map(node=>coordinate(node)[0]))+1,columns=Math.max(...graph.nodes.map(node=>coordinate(node)[1]))+1;
  graph.fields={rows,columns};graph.nodeMarkers={};
  if(problem.id==='minesweeper'){
    const values=Object.fromEntries(graph.nodes.map(node=>[node,'E']));
    if(round.bugs.includes('remove-diagonals'))values['(1,1)']='M';
    if(round.bugs.includes('wrong-start'))values['(0,0)']='M';
    graph.nodeMarkers.cellType=values;
  } else if(problem.id==='gas-pocket-survey'){
    const values=Object.fromEntries(graph.nodes.map(node=>[node,'U']));if(round.bugs.includes('add-diagonals'))values['(1,1)']='G';graph.nodeMarkers.caveCell=values;
  } else if(problem.id==='flood-fill'){
    const values=Object.fromEntries(graph.nodes.map(node=>[node,1]));graph.fields.newColor=9;
    if(round.bugs.includes('add-diagonals')){values['(0,1)']=2;values['(1,0)']=2;}
    if(round.bugs.includes('wrong-start'))values['(0,1)']=2;
    graph.nodeMarkers.pixelColor=values;
    graph.edges=graph.edges.filter(([a,b])=>values[a]===values[b]);
  } else {
    const values=Object.fromEntries(graph.nodes.map(node=>[node,'0']));
    if(round.bugs.includes('add-diagonals')){values['(0,0)']='1';values['(1,1)']='1';}
    if(round.bugs.includes('last-branch'))values['(1,1)']='1';
    graph.fields.queryTarget=round.bugs.includes('last-branch')?'(0,1)':graph.nodes.at(-1);
    graph.nodeMarkers.cellKind=values;graph.edges=graph.edges.filter(([a,b])=>values[a]===values[b]);
  }
  return graph;
}

function addFinalSemantics(problem,round,graph){
  if(problem.id === "counting-docked-boats") graph.fields={rows:1,columns:3};
  if(problem.id==='evaluate-division'){
    graph.fields={queryDenominator:'c'};graph.edgeMarkers={edgeRatio:{}};const pairValues={"a\u0000b":2,"a\u0000c":2,"b\u0000c":3};graph.edges.forEach(([a,b])=>{const ordered=[a,b].sort(),base=pairValues[`${ordered[0]}\u0000${ordered[1]}`]||2;graph.edgeMarkers.edgeRatio[`${a}\u0000${b}`]=a===ordered[0]?base:1/base;});
  }
  if(problem.id==='water-and-jug-problem'){
    graph.fields=round.bugs.includes('first-branch')?{jug1Capacity:2,jug2Capacity:3,targetAmount:5}:{jug1Capacity:1,jug2Capacity:2,targetAmount:3};
  }
  if(problem.id==='word-search'){
    const rows=Math.max(...graph.nodes.map(node=>coordinate(node)[0]))+1,columns=Math.max(...graph.nodes.map(node=>coordinate(node)[1]))+1,letters=Object.fromEntries(graph.nodes.map(node=>[node,'X']));graph.fields={rows,columns,targetWord:'ABC'};
    if(round.bugs.includes('add-diagonals')){letters['(0,0)']='A';letters['(1,1)']='B';graph.fields.targetWord='AB';}
    else if(round.bugs.includes('first-branch')){letters['(0,0)']='A';letters['(0,1)']='B';letters['(1,0)']='B';letters['(2,0)']='C';}
    else {letters['(0,0)']='A';letters['(0,1)']='B';letters['(0,2)']='C';}
    graph.nodeMarkers={cellLetter:letters};
  }
  return graph;
}

function labelsForRule(rule, count) {
  if (rule === "contiguous-zero") return Array.from({length: count}, (_, index) => String(index));
  if (["contiguous-one", "positive-integer"].includes(rule)) return Array.from({length: count}, (_, index) => String(index + 1));
  if (rule === "identifier") return Array.from({length: count}, (_, index) => String.fromCharCode(97 + index));
  if (rule === "state-pair") return Array.from({length: count}, (_, index) => `(0,${index})`);
  if (rule === "nested-path") return Array.from({length: count}, (_, index) => index ? `root[${index - 1}]` : "root");
  if (rule === "tree-path") return ["root", "L", "R", "LL", "LR", "RL", "RR", "LLL"].slice(0, count);
  if (rule === "partial-string") return ["ε", "a", "b", "aa", "ab", "ba", "bb", "aaa"].slice(0, count);
  return null;
}

function applyLabelRule(problem, graph) {
  const rule = problem.counterexampleLesson.nodeLabels.rule;
  if (problem.id === "evaluate-boolean-binary-tree") return graph;
  if (problem.id === "water-and-jug-problem") return graph;
  if (problem.id === "smallest-string-with-swaps") {
    const rename=Object.fromEntries(graph.nodes.map((node,index)=>[node,`${index}:${String.fromCharCode(122-index)}`]));
    return {...graph,nodes:graph.nodes.map(node=>rename[node]),edges:graph.edges.map(([a,b,c])=>[rename[a],rename[b],c]),start:rename[graph.start]};
  }
  if (problem.id === "usaco-fence-planning") {
    const rename=Object.fromEntries(graph.nodes.map((node,index)=>[node,`${index}:(${index*3},${index%2})`]));
    return {...graph,nodes:graph.nodes.map(node=>rename[node]),edges:graph.edges.map(([a,b,c])=>[rename[a],rename[b],c]),start:rename[graph.start]};
  }
  if (problem.id === "structy-max-root-to-leaf-path-sum") {
    const rename=Object.fromEntries(graph.nodes.map((node,index)=>[node,`node ${index}: ${index+1}`]));
    return {...graph,nodes:graph.nodes.map(node=>rename[node]),edges:graph.edges.map(([a,b,c])=>[rename[a],rename[b],c]),start:rename[graph.start]};
  }
  if (["nested-path", "tree-path", "partial-string", "weight-prefix"].includes(rule)) {
    const outgoing = Object.fromEntries(graph.nodes.map(node => [node, []]));
    graph.edges.forEach(([from, to]) => outgoing[from].push(to));
    const root = graph.nodes.find(node => !graph.edges.some(([, to]) => to === node));
    if (!root) return graph;
    const rename = { [root]: rule === "nested-path" || rule === "tree-path" ? "root" : rule === "weight-prefix" ? "start" : "ε" };
    const visit = node => outgoing[node].forEach((child, index) => {
      if (rule === "nested-path") rename[child] = `${rename[node]}[${index}]`;
      else if (rule === "tree-path") rename[child] = rename[node] === "root" ? ["L", "R"][index] : `${rename[node]}${["L", "R"][index]}`;
      else if (rule === "weight-prefix") rename[child] = rename[node] === "start" ? String([5, 2, 3][index]) : `${rename[node]},${[5, 2, 3][index]}`;
      else {
        const parent = rename[node] === "ε" ? "" : rename[node];
        const letter = ["a", "b", "c"].filter(value => value !== parent.at(-1))[index];
        rename[child] = `${parent}${letter}`;
      }
      visit(child);
    });
    visit(root);
    if (rule === "nested-path") for (const node of graph.nodes) rename[node] += outgoing[node].length ? "=[]" : `=${graph.nodes.indexOf(node) + 1}`;
    return {
      ...graph,
      nodes: graph.nodes.map(node => rename[node]),
      edges: graph.edges.map(([from, to, color]) => [rename[from], rename[to], color]),
      start: rename[graph.start]
    };
  }
  if (problem.counterexampleLesson.nodeLabels.rule === "interior-coordinate") {
    const rename = Object.fromEntries(graph.nodes.map(label => [label, `(${coordinate(label)[0] + 1},${coordinate(label)[1] + 1})`]));
    return {...graph, nodes: graph.nodes.map(label => rename[label]), edges: graph.edges.map(([from, to, color]) => [rename[from], rename[to], color]), start: rename[graph.start]};
  }
  const labels = labelsForRule(problem.counterexampleLesson.nodeLabels.rule, graph.nodes.length);
  if (!labels) return graph;
  const rename = Object.fromEntries(graph.nodes.map((label, index) => [label, labels[index]]));
  return {...graph, nodes: labels, edges: graph.edges.map(([from, to, color]) => [rename[from], rename[to], color]), start: rename[graph.start]};
}

function changedGraph(graph, bugs, startOverride=null) {
  let isDirected = graph.directed, edges = graph.edges.map(edge => [...edge]), start = graph.start;
  if (bugs.includes("make-one-way")) isDirected = true;
  if (bugs.includes("make-two-way")) isDirected = false;
  if (bugs.includes("reverse-arrows")) edges = edges.map(([from,to,color]) => [to,from,color]);
  if (bugs.includes("add-diagonals")) for (let a=0;a<graph.nodes.length;a++) for(let b=a+1;b<graph.nodes.length;b++){const one=coordinate(graph.nodes[a]),two=coordinate(graph.nodes[b]),values=graph.nodeMarkers?.pixelColor||graph.nodeMarkers?.cellKind,same=!values||values[graph.nodes[a]]===values[graph.nodes[b]];if(one&&two&&same&&Math.abs(one[0]-two[0])===1&&Math.abs(one[1]-two[1])===1)edges.push([graph.nodes[a],graph.nodes[b],""]);}
  if (bugs.includes("remove-diagonals")) edges=edges.filter(([from,to])=>{const one=coordinate(from),two=coordinate(to);return !one||!two||!(Math.abs(one[0]-two[0])===1&&Math.abs(one[1]-two[1])===1);});
  if (bugs.includes("strict-threshold")) edges=edges.filter(([a,b])=>graph.fields.scores[Number(a)][Number(b)]>graph.fields.k);
  if (bugs.includes("drop-last-edge")) edges=edges.slice(0,-1);
  if (bugs.includes("skip-leaf-edges")){const degree=Object.fromEntries(graph.nodes.map(node=>[node,0]));edges.forEach(([from,to])=>{degree[from]++;degree[to]++;});edges=edges.filter(([from,to])=>degree[from]>1&&degree[to]>1);}
  if (bugs.includes("wrong-start")) start=startOverride||graph.nodes[0];
  if (bugs.includes("red-only")) edges=edges.filter(([, ,color])=>color==="red");
  if (bugs.includes("ignore-colors")) edges=edges.map(([from,to])=>[from,to,"slate"]);
  const seen=new Set();edges=edges.filter(([from,to,color=""])=>{const ends=isDirected?[from,to]:[from,to].sort(),key=`${ends[0]}\u0000${ends[1]}\u0000${color}`;if(seen.has(key))return false;seen.add(key);return true;});
  return {...graph,directed:isDirected,edges,start};
}

function traverse(graph, edges, mode) {
  const adjacency=Object.fromEntries(graph.nodes.map(node=>[node,[]]));
  for(const [from,to] of edges){if(!adjacency[from].includes(to))adjacency[from].push(to);if(!graph.directed&&!adjacency[to].includes(from))adjacency[to].push(from);}
  const seen=new Set([graph.start]);
  if(mode==="shallow") adjacency[graph.start].forEach(node=>seen.add(node));
  else if(mode==="first"||mode==="last"){let current=graph.start;while(true){const choices=mode==="last"?[...adjacency[current]].reverse():adjacency[current];const next=choices.find(node=>!seen.has(node));if(!next)break;seen.add(next);current=next;}}
  else {const stack=[graph.start];while(stack.length)for(const next of adjacency[stack.pop()])if(!seen.has(next)){seen.add(next);stack.push(next);}}
  return seen;
}

function search(problem, graph, bugs=[], startOverride=null) {
  if (graph.starts) return [...new Set((bugs.includes("first-start-only") ? graph.starts.slice(0,1) : graph.starts).flatMap(start=>search(problem,{...graph,starts:null,start},bugs,start)))];
  const changed=changedGraph(graph,bugs,startOverride), mode=bugs.includes("shallow-search")?"shallow":bugs.includes("first-branch")?"first":bugs.includes("last-branch")?"last":"full";
  if(problem.id==="one-color-metro-ride"&&!bugs.includes("ignore-colors")&&!bugs.includes("red-only")){const seen=new Set([changed.start]);for(const color of ["red","blue"])for(const node of traverse(changed,changed.edges.filter(([, ,c])=>c===color),mode))seen.add(node);return graph.nodes.filter(node=>seen.has(node));}
  const seen=traverse(changed,changed.edges,mode);return graph.nodes.filter(node=>seen.has(node));
}

function adjacencyFor(graph, bugs=[]) {
  const changed=changedGraph(graph,bugs,graph.start), adjacency=Object.fromEntries(changed.nodes.map(node=>[node,[]]));
  for(const [from,to] of changed.edges){adjacency[from].push(to);if(!changed.directed)adjacency[to].push(from);}
  return {changed,adjacency};
}

function componentsFor(graph,bugs=[]){
  const {changed,adjacency}=adjacencyFor(graph,bugs),seen=new Set(),groups=[];
  for(const seed of changed.nodes){if(seen.has(seed))continue;const local=new Set([seed]),pending=[seed];while(pending.length){const node=pending.pop();let next=adjacency[node].filter(x=>!seen.has(x)&&!local.has(x));if(bugs.includes('shallow-search')&&node!==seed)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);for(const x of next){local.add(x);pending.push(x);}}local.forEach(x=>seen.add(x));groups.push([...local]);}return groups;
}

function pathsFor(graph,bugs=[]){
  const {changed,adjacency}=adjacencyFor(graph,bugs),target=[...graph.nodes].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true})).at(-1),paths=[];
  const walk=(node,path)=>{if(node===target){paths.push(path);return;}let next=adjacency[node].filter(x=>!path.includes(x));if(bugs.includes('shallow-search')&&path.length>1)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);next.forEach(x=>walk(x,[...path,x]));};walk(changed.start,[changed.start]);return paths;
}

function bipartiteFor(graph,bugs=[]){const {changed,adjacency}=adjacencyFor(graph,bugs),color={};for(const seed of changed.nodes){if(color[seed]!=null)continue;color[seed]=0;const pending=[seed];while(pending.length){const node=pending.pop();let next=adjacency[node];if(bugs.includes('shallow-search')&&node!==seed)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);for(const x of next){if(color[x]===color[node])return false;if(color[x]==null){color[x]=1-color[node];pending.push(x);}}}}return true;}
function acyclicFor(graph,bugs=[]){const {changed,adjacency}=adjacencyFor(graph,bugs),done=new Set(),active=new Set();const visit=(node,depth=0)=>{if(active.has(node))return false;if(done.has(node))return true;active.add(node);let next=adjacency[node];if(bugs.includes('shallow-search')&&depth>0)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);for(const x of next)if(!visit(x,depth+1))return false;active.delete(node);done.add(node);return true;};return bugs.includes('first-branch')||bugs.includes('last-branch')?visit(changed.start):changed.nodes.every(node=>visit(node));}
function longestFor(graph,bugs=[]){const {changed,adjacency}=adjacencyFor(graph,bugs);let best=changed.nodes.length?1:0;const walk=(node,seen)=>{best=Math.max(best,seen.size);let next=adjacency[node].filter(x=>!seen.has(x));if(bugs.includes('shallow-search')&&seen.size>1)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);next.forEach(x=>walk(x,new Set([...seen,x])));};changed.nodes.forEach(x=>walk(x,new Set([x])));return best;}

function exactResult(problem,graph,bugs=[],wrongStart=null){
  const kind=problem.counterexampleLesson.input.result, reached=search(problem,graph,bugs,wrongStart),groups=()=>componentsFor(graph,bugs);
  if(kind==='reached-count')return reached.length;
  if(kind==='border-component-count')return groups().filter(group=>group.some(node=>{const [r,c]=coordinate(node);return r===0||c===0||r===graph.fields.rows-1||c===graph.fields.columns-1;})).length;
  if(kind==='component-count')return groups().length;
  if(kind==='maximum-component-size')return Math.max(0,...groups().map(x=>x.length));
  if(kind==='components-without-source-count'){const c=problem.counterexampleLesson.input.resultConfig,v=graph.nodeMarkers[c.sourceMarker];return groups().filter(group=>!group.some(node=>String(v[node])===String(c.sourceValue))).length;}
  if(kind==='qualified-component-count'){const c=problem.counterexampleLesson.input.resultConfig,v=graph.nodeMarkers[c.qualifierMarker];return groups().filter(group=>group.every(node=>String(v[node])===String(c.qualifyingValue))).length;}
  if(kind==='reached-selected-node-count'){const c=problem.counterexampleLesson.input.resultConfig,v=graph.nodeMarkers[c.selectorMarker];return reached.filter(node=>String(v[node])===String(c.selectedValue)).length;}
  if(kind==='maximum-component-value-sum'){const c=problem.counterexampleLesson.input.resultConfig,v=graph.nodeMarkers[c.valueMarker];return Math.max(0,...groups().map(group=>group.reduce((sum,node)=>sum+Number(v[node]||0),0)));}
  if(kind==='minimum-component-size')return Math.min(Infinity,...groups().map(x=>x.length));
  if(kind==='maximum-reached-count')return Math.max(0,...graph.nodes.map(start=>search(problem,{...graph,start},bugs,start).length));
  if(kind==='enumerated-paths'||kind==='path-count') {const paths=pathsFor(graph,bugs);return kind==='path-count'?paths.length:paths;}
  if(kind==='path-count-modulo'){const {changed,adjacency}=adjacencyFor(graph,bugs),memo=new Map();const count=node=>{if(memo.has(node))return memo.get(node);let next=adjacency[node];if(bugs.includes('shallow-search'))next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);const value=1+next.reduce((n,x)=>n+count(x),0);memo.set(node,value);return value;};return changed.nodes.reduce((n,x)=>n+count(x),0)%1000000007;}
  if(kind==='longest-path-length')return longestFor(graph,bugs);
  if(kind==='valid-two-coloring-boolean')return bipartiteFor(graph,bugs);
  if(kind==='acyclic-completion-boolean')return acyclicFor(graph,bugs);
  if(kind==='maximum-reached-node-value')return Math.max(...reached.map(x=>Number((String(x).match(/-?\d+/)||[0])[0])));
  if(kind==='reachability-matrix'){const order=[...graph.nodes].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));return order.map(start=>{const found=new Set(search(problem,{...graph,start},bugs,start));return order.map(x=>found.has(x)?1:0);});}
  if(kind==='reached-node-value-sum')return reached.reduce((sum,node)=>sum+Number((String(node).match(/-?\d+(?:\.\d+)?(?=\s*$)/)||[1])[0]),0);
  if(kind==='generated-terminal-strings'){const {changed,adjacency}=adjacencyFor(graph,bugs),found=new Set(reached);return changed.nodes.filter(node=>found.has(node)&&adjacency[node].length===0&&node!==changed.start).map(node=>node==='ε'?'':node);}
  if(kind==='recursive-item-count')return Math.max(0,reached.length-1);
  if(kind==='root-expression-value'){const changed=changedGraph(graph,bugs,wrongStart),children=Object.fromEntries(changed.nodes.map(node=>[node,[]]));changed.edges.forEach(([a,b])=>children[a].push(b));const evalNode=node=>{if(/:true$/i.test(node))return true;if(/:false$/i.test(node))return false;let values=children[node].map(evalNode);if(bugs.includes('first-branch'))values=values.slice(0,1);if(bugs.includes('last-branch'))values=values.slice(-1);return /:OR$/i.test(node)?values.some(Boolean):values.length>0&&values.every(Boolean);};return evalNode(changed.start);}
  if(kind==='component-bounding-boxes')return groups().map(group=>{const points=group.map(coordinate),rows=points.map(x=>x[0]),cols=points.map(x=>x[1]);return [Math.min(...rows),Math.min(...cols),Math.max(...rows),Math.max(...cols)];}).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  if(kind==='minimum-universally-reachable-node-or-minus-one'){const order=[...graph.nodes].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));return order.find(candidate=>order.every(start=>search(problem,{...graph,start},bugs,start).includes(candidate)))||-1;}
  const nested=()=>reached.map(node=>{const match=String(node).match(/^(root(?:\[\d+\])*)=(-?\d+)$/);return match?{path:match[1],depth:(match[1].match(/\[/g)||[]).length,value:Number(match[2])}:null;}).filter(Boolean);
  if(kind==='iterator-output-sequence')return nested().sort((a,b)=>a.path.localeCompare(b.path,undefined,{numeric:true})).map(x=>x.value);
  if(kind==='depth-weighted-value-sum')return nested().reduce((sum,x)=>sum+x.depth*x.value,0);
  if(kind==='inverse-depth-weighted-value-sum'){const items=nested(),max=Math.max(0,...items.map(x=>x.depth));return items.reduce((sum,x)=>sum+(max-x.depth+1)*x.value,0);}
  if(kind==='widest-level-index'){const counts={};nested().forEach(x=>counts[x.depth]=(counts[x.depth]||0)+1);return Number(Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||a-b)[0]);}
  if(kind==='level-value-sum'){const items=nested(),depth=Math.min(...items.map(x=>x.depth));return items.filter(x=>x.depth===depth).reduce((sum,x)=>sum+x.value,0);}
  if(kind==='component-sorted-string'){const answer=[...graph.nodes].sort((a,b)=>Number(a.split(':')[0])-Number(b.split(':')[0])).map(x=>x.split(':')[1]);for(const group of groups()){const pos=group.map(x=>Number(x.split(':')[0])).sort((a,b)=>a-b),letters=group.map(x=>x.split(':')[1]).sort();pos.forEach((p,i)=>answer[p]=letters[i]);}return answer.join('');}
  if(kind==='selected-color-count'){const {changed,adjacency}=adjacencyFor(graph,bugs),depth={[changed.start]:0},pending=[changed.start];while(pending.length){const node=pending.shift();let next=adjacency[node].filter(x=>depth[x]==null);if(bugs.includes('shallow-search')&&depth[node]>0)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);next.forEach(x=>{depth[x]=depth[node]+1;pending.push(x);});}return Object.values(depth).filter(x=>x%2===0).length;}
  if(kind==='minimum-component-bounding-perimeter')return Math.min(...groups().map(group=>{const pts=group.map(x=>(String(x).match(/:\((-?\d+),(-?\d+)\)$/)||[]).slice(1).map(Number)),xs=pts.map(x=>x[0]),ys=pts.map(x=>x[1]);return 2*(Math.max(...xs)-Math.min(...xs)+Math.max(...ys)-Math.min(...ys));}));
  if(kind==='maximum-root-leaf-value-sum'){const {changed,adjacency}=adjacencyFor(graph,bugs),value=node=>Number((String(node).match(/:\s*(-?\d+)$/)||[0,0])[1]);const best=(node,depth=0)=>{let next=adjacency[node];if(bugs.includes('shallow-search')&&depth>0)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);return value(node)+(next.length?Math.max(...next.map(x=>best(x,depth+1))):0);};return best(changed.start);}
  if(kind==='transformed-grid'){
    const config=problem.counterexampleLesson.input.resultConfig,values=graph.nodeMarkers[config.valueMarker],layout=output=>Array.from({length:graph.fields.rows},(_,r)=>Array.from({length:graph.fields.columns},(_,c)=>output[`(${r},${c})`]));
    if(problem.id==='flood-fill'){const found=new Set(reached),output={...values};found.forEach(node=>output[node]=graph.fields.newColor);return layout(output);}
    const searchGraph=wrongStart?{...graph,start:wrongStart}:graph,{changed,adjacency}=adjacencyFor(searchGraph,bugs),hazard=problem.id==='minesweeper'?'M':'G',found=new Set(),pending=[[changed.start,0]];while(pending.length){const [node,depth]=pending.pop();if(found.has(node))continue;found.add(node);if(values[node]===hazard)continue;const count=adjacency[node].filter(x=>values[x]===hazard).length;if(count)continue;let next=adjacency[node].filter(x=>!found.has(x)&&values[x]!==hazard);if(bugs.includes('shallow-search')&&depth>=1)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);next.forEach(x=>pending.push([x,depth+1]));}const output={...values};found.forEach(node=>{if(values[node]===hazard)output[node]='X';else{const count=adjacency[node].filter(x=>values[x]===hazard).length;output[node]=count?String(count):(problem.id==='minesweeper'?'B':'S');}});return layout(output);
  }
  if(kind==='ordered-query-values'){
    const config=problem.counterexampleLesson.input.resultConfig,changed=changedGraph(graph,bugs,wrongStart),target=graph.fields[config.targetField];
    if(config.mode==='ratio'){const adjacency=Object.fromEntries(changed.nodes.map(node=>[node,[]])),ratios=graph.edgeMarkers[config.ratioMarker];changed.edges.forEach(([a,b])=>adjacency[a].push(b));const solve=(node,product,used,depth)=>{if(node===target)return product;let next=adjacency[node].filter(x=>!used.has(x));if(bugs.includes('shallow-search')&&depth>=1)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);for(const x of next){const answer=solve(x,product*Number(ratios[`${node}\u0000${x}`]),new Set([...used,x]),depth+1);if(answer!=null)return answer;}return null;};const answer=solve(changed.start,1,new Set([changed.start]),0);return[answer==null?-1:answer];}
    const values=graph.nodeMarkers[config.valueMarker];return [reached.includes(target)&&values[changed.start]===values[target]?(values[changed.start]==='1'?'decimal':'binary'):'neither'];
  }
  if(kind==='target-state-reachable-boolean'){const target=graph.fields[problem.counterexampleLesson.input.resultConfig.targetField];return reached.some(node=>{const [a,b]=coordinate(node);return a===target||b===target||a+b===target;});}
  if(kind==='target-word-path-exists-boolean'){const config=problem.counterexampleLesson.input.resultConfig,word=graph.fields[config.wordField],letters=graph.nodeMarkers[config.letterMarker],{changed,adjacency}=adjacencyFor(graph,bugs);const walk=(node,index,used)=>{if(letters[node]!==word[index])return false;if(index===word.length-1)return true;let next=adjacency[node].filter(x=>!used.has(x)&&letters[x]===word[index+1]);if(bugs.includes('shallow-search')&&index>=1)next=[];if(bugs.includes('first-branch'))next=next.slice(0,1);if(bugs.includes('last-branch'))next=next.slice(-1);return next.some(x=>walk(x,index+1,new Set([...used,x])));};return changed.nodes.some(node=>walk(node,0,new Set([node])));}
  return reached;
}

const roundCount = problems.reduce((total, problem) => total + problem.counterexampleLesson.rounds.length, 0);
if (roundCount !== 228) failures.push(`Expected 228 single-mistake Step 2 starters; found ${roundCount}`);

function resolveNode(nodes, requested) {
  if (nodes.includes(requested)) return requested;
  if (requested === "root=[]" || requested === "outer array") return nodes.find(node => node === "root" || node === "root=[]") || null;
  if (requested === "empty prefix" || requested === "start") return nodes.find(node => node === "ε") || null;
  if (requested === "0" || /^0:/.test(requested) || /^node 0:/.test(requested)) return nodes.find(node => node === "root") || nodes[0] || null;
  const nested = nodes.find(node => node === requested.replace(/=.*$/, "") || node.replace(/=.*$/, "") === requested);
  return nested || null;
}

for (const problem of problems) for (const [index, round] of problem.counterexampleLesson.rounds.entries()) {
  if (!Array.isArray(round.bugs) || round.bugs.length !== 1) {
    failures.push(`${problem.id}/round-${index+1}: expected exactly one mistake`);
    continue;
  }
  const graph=addFinalSemantics(problem,round,addGridSemantics(problem,round,applyLabelRule(problem,starter(problem,round))));
  const authoredStart = String(round.startLabel);
  graph.start = resolveNode(graph.nodes, authoredStart);
  if (!graph.start) { failures.push(`${problem.id}/round-${index+1}: authored start ${authoredStart} is missing from starter`); continue; }
  const authoredWrongStart=round.bugs.includes("wrong-start") ? String(round.mistakenStartLabel) : graph.start;
  const wrongStart=round.bugs.includes("wrong-start") ? resolveNode(graph.nodes, authoredWrongStart) : graph.start;
  if (round.bugs.includes("wrong-start") && !wrongStart) { failures.push(`${problem.id}/round-${index+1}: authored mistaken start ${authoredWrongStart} is missing from starter`); continue; }
  const correct=search(problem,graph), buggy=search(problem,graph,round.bugs,wrongStart);
  if(["reached-nodes","unreached-nodes"].includes(problem.counterexampleLesson.input.result)&&JSON.stringify(correct)===JSON.stringify(buggy)) failures.push(`${problem.id}/round-${index+1}: starter does not expose its bug (${JSON.stringify({correct,buggy})})`);
  const correctOutput=exactResult(problem,graph), buggyOutput=exactResult(problem,graph,round.bugs,wrongStart);
  if(JSON.stringify(correctOutput)===JSON.stringify(buggyOutput)) failures.push(`${problem.id}/round-${index+1}: starter changes reached nodes but not the real ${problem.counterexampleLesson.input.result} output (${JSON.stringify(correctOutput)})`);
}

if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Validated all 228 single-mistake Step 2 starters.");
