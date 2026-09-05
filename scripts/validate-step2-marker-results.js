#!/usr/bin/env node
"use strict";
const fs = require("fs"), path = require("path"), failures = [];
const w = [
  x("villages-without-wells", "skip-leaf-edges", g(["0","1"], [["0","1"]], {"0":"yes","1":"no"}), [0,1]),
  x("villages-without-wells", "make-one-way", g(["0","1"], [["1","0"]], {"0":"yes","1":"no"}), [0,1]),
  x("villages-without-wells", "last-branch", g(["0","1","2"], [["0","1"],["0","2"]], {"0":"yes","1":"no","2":"no"}), [0,1]),
  x("count-sub-islands", "drop-last-edge", g(["(0,0)","(0,1)"], [["(0,0)","(0,1)"]], {"(0,0)":"yes","(0,1)":"no"}), [0,1]),
  x("count-sub-islands", "add-diagonals", g(["(0,0)","(1,1)"], [], {"(0,0)":"yes","(1,1)":"no"}), [1,0]),
  x("count-sub-islands", "shallow-search", g(["(0,0)","(0,1)","(0,2)"], [["(0,0)","(0,1)"],["(0,1)","(0,2)"]], {"(0,0)":"yes","(0,1)":"yes","(0,2)":"no"}), [0,1]),
  x("kattis-getting-gold", "drop-last-edge", g(["(1,1)","(1,2)"], [["(1,1)","(1,2)"]], {"(1,1)":"no","(1,2)":"yes"}, true, "(1,1)"), [1,0]),
  x("kattis-getting-gold", "first-branch", g(["(1,1)","(1,2)","(2,1)"], [["(1,1)","(1,2)"],["(1,1)","(2,1)"]], {"(1,1)":"no","(1,2)":"yes","(2,1)":"yes"}, true, "(1,1)"), [2,1]),
  x("kattis-getting-gold", "wrong-start", g(["(1,1)","(1,2)"], [], {"(1,1)":"yes","(1,2)":"no"}, true, "(1,1)"), [1,0], "(1,2)"),
  x("maximum-number-of-fish-in-a-grid", "drop-last-edge", g(["(0,0)","(0,1)","(0,2)"], [["(0,0)","(0,1)"],["(0,1)","(0,2)"]], {"(0,0)":1,"(0,1)":2,"(0,2)":10}), [13,10]),
  x("maximum-number-of-fish-in-a-grid", "shallow-search", g(["(0,0)","(0,1)","(0,2)"], [["(0,0)","(0,1)"],["(0,1)","(0,2)"]], {"(0,0)":5,"(0,1)":4,"(0,2)":3}), [12,9]),
  x("maximum-number-of-fish-in-a-grid", "add-diagonals", g(["(0,0)","(1,1)"], [], {"(0,0)":4,"(1,1)":7}), [7,11])
];
function x(id,bug,graph,expected,mistakenStart){return{id,bug,graph,expected,mistakenStart};}
function g(nodes,edges,marks,directed=false,start=nodes[0]){return{nodes,edges,marks,directed,start};}
function point(s){const m=s.match(/^\((\d+),(\d+)\)$/);return m&&[+m[1],+m[2]];}
function change(src,bug,start){const a={...src,edges:src.edges.map(e=>[...e]),start:start||src.start};if(bug==="make-one-way")a.directed=true;if(bug==="drop-last-edge")a.edges=a.edges.slice(0,-1);if(bug==="skip-leaf-edges"){const d=Object.fromEntries(a.nodes.map(n=>[n,0]));a.edges.forEach(([u,v])=>{d[u]++;d[v]++;});a.edges=a.edges.filter(([u,v])=>d[u]>1&&d[v]>1);}if(bug==="add-diagonals")for(let i=0;i<a.nodes.length;i++)for(let j=i+1;j<a.nodes.length;j++){const p=point(a.nodes[i]),q=point(a.nodes[j]);if(p&&q&&Math.abs(p[0]-q[0])===1&&Math.abs(p[1]-q[1])===1)a.edges.push([a.nodes[i],a.nodes[j]]);}return a;}
function groups(src,bug){const a=change(src,bug),adj=Object.fromEntries(a.nodes.map(n=>[n,[]]));a.edges.forEach(([u,v])=>{adj[u].push(v);if(!a.directed)adj[v].push(u);});const seen=new Set(),out=[];for(const seed of a.nodes){if(seen.has(seed))continue;const local=new Set([seed]),todo=[seed];while(todo.length){const n=todo.pop();let next=adj[n].filter(z=>!local.has(z)&&!seen.has(z));if(bug==="shallow-search"&&n!==seed)next=[];if(bug==="last-branch")next=next.slice(-1);next.forEach(z=>{local.add(z);todo.push(z);});}local.forEach(z=>seen.add(z));out.push([...local]);}return out;}
function reached(src,bug,start){const a=change(src,bug,start),adj=Object.fromEntries(a.nodes.map(n=>[n,[]]));a.edges.forEach(([u,v])=>{adj[u].push(v);if(!a.directed)adj[v].push(u);});const seen=new Set([a.start]);if(bug==="first-branch"){let n=a.start,next;while((next=adj[n].find(z=>!seen.has(z)))){seen.add(next);n=next;}}else{const todo=[a.start];while(todo.length)for(const z of adj[todo.pop()])if(!seen.has(z)){seen.add(z);todo.push(z);}}return [...seen];}
function out(t,bug){if(t.id==="villages-without-wells")return groups(t.graph,bug).filter(a=>!a.some(n=>t.graph.marks[n]==="yes")).length;if(t.id==="count-sub-islands")return groups(t.graph,bug).filter(a=>a.every(n=>t.graph.marks[n]==="yes")).length;if(t.id==="kattis-getting-gold")return reached(t.graph,bug,bug==="wrong-start"?t.mistakenStart:null).filter(n=>t.graph.marks[n]==="yes").length;return Math.max(0,...groups(t.graph,bug).map(a=>a.reduce((s,n)=>s+t.graph.marks[n],0)));}
const root=path.resolve(__dirname,".."),specs=["step2-specs-variant.json","step2-specs-new.json"].flatMap(f=>JSON.parse(fs.readFileSync(path.join(root,f),"utf8")));
for(const id of new Set(w.map(t=>t.id))){const a=specs.find(s=>s.id===id)?.rounds.map(r=>r.bugs[0]),b=w.filter(t=>t.id===id).map(t=>t.bug);if(JSON.stringify(a)!==JSON.stringify(b))failures.push(`${id}: witnesses do not match authored rounds`);}
for(const t of w){const a=[out(t,""),out(t,t.bug)];if(JSON.stringify(a)!==JSON.stringify(t.expected))failures.push(`${t.id}/${t.bug}: expected ${t.expected.join("→")}; got ${a.join("→")}`);if(a[0]===a[1])failures.push(`${t.id}/${t.bug}: output does not change`);}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}console.log("Validated twelve exact marker/component witnesses.");
