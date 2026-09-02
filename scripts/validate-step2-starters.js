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
    "letter-combinations-of-a-phone-number", "runes-on-the-castle-door", "flatten-nested-list-iterator",
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

function starter(problem, round) {
  const isDirected = directed(problem), base = round.bugs[0], grid = isGrid(problem);
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
  if (["nested-path", "tree-path", "partial-string"].includes(rule)) {
    const outgoing = Object.fromEntries(graph.nodes.map(node => [node, []]));
    graph.edges.forEach(([from, to]) => outgoing[from].push(to));
    const root = graph.nodes.find(node => !graph.edges.some(([, to]) => to === node));
    if (!root) return graph;
    const rename = { [root]: rule === "nested-path" || rule === "tree-path" ? "root" : "ε" };
    const visit = node => outgoing[node].forEach((child, index) => {
      if (rule === "nested-path") rename[child] = `${rename[node]}[${index}]`;
      else if (rule === "tree-path") rename[child] = rename[node] === "root" ? ["L", "R"][index] : `${rename[node]}${["L", "R"][index]}`;
      else {
        const parent = rename[node] === "ε" ? "" : rename[node];
        const letter = ["a", "b", "c"].filter(value => value !== parent.at(-1))[index];
        rename[child] = `${parent}${letter}`;
      }
      visit(child);
    });
    visit(root);
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
  if (bugs.includes("add-diagonals")) for (let a=0;a<graph.nodes.length;a++) for(let b=a+1;b<graph.nodes.length;b++){const one=coordinate(graph.nodes[a]),two=coordinate(graph.nodes[b]);if(one&&two&&Math.abs(one[0]-two[0])===1&&Math.abs(one[1]-two[1])===1)edges.push([graph.nodes[a],graph.nodes[b],""]);}
  if (bugs.includes("remove-diagonals")) edges=edges.filter(([from,to])=>{const one=coordinate(from),two=coordinate(to);return !one||!two||!(Math.abs(one[0]-two[0])===1&&Math.abs(one[1]-two[1])===1);});
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
  const changed=changedGraph(graph,bugs,startOverride), mode=bugs.includes("shallow-search")?"shallow":bugs.includes("first-branch")?"first":bugs.includes("last-branch")?"last":"full";
  if(problem.id==="one-color-metro-ride"&&!bugs.includes("ignore-colors")&&!bugs.includes("red-only")){const seen=new Set([changed.start]);for(const color of ["red","blue"])for(const node of traverse(changed,changed.edges.filter(([, ,c])=>c===color),mode))seen.add(node);return graph.nodes.filter(node=>seen.has(node));}
  const seen=traverse(changed,changed.edges,mode);return graph.nodes.filter(node=>seen.has(node));
}

const roundCount = problems.reduce((total, problem) => total + problem.counterexampleLesson.rounds.length, 0);
if (roundCount !== 225) failures.push(`Expected 225 single-mistake Step 2 starters; found ${roundCount}`);

for (const problem of problems) for (const [index, round] of problem.counterexampleLesson.rounds.entries()) {
  if (!Array.isArray(round.bugs) || round.bugs.length !== 1) {
    failures.push(`${problem.id}/round-${index+1}: expected exactly one mistake`);
    continue;
  }
  const graph=applyLabelRule(problem,starter(problem,round));
  graph.start = String(round.startLabel);
  if (!graph.nodes.includes(graph.start)) { failures.push(`${problem.id}/round-${index+1}: authored start ${graph.start} is missing from starter`); continue; }
  const wrongStart=round.bugs.includes("wrong-start") ? String(round.mistakenStartLabel) : graph.start;
  if (round.bugs.includes("wrong-start") && !graph.nodes.includes(wrongStart)) { failures.push(`${problem.id}/round-${index+1}: authored mistaken start ${wrongStart} is missing from starter`); continue; }
  const correct=search(problem,graph), buggy=search(problem,graph,round.bugs,wrongStart);
  if(JSON.stringify(correct)===JSON.stringify(buggy)) failures.push(`${problem.id}/round-${index+1}: starter does not expose its bug (${JSON.stringify({correct,buggy})})`);
}

if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Validated all 225 single-mistake Step 2 starters.");
