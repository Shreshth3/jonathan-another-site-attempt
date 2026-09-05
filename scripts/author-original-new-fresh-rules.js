const fs=require('fs');
const {task:makeInput}=require('./author-original-new-structure');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
const gridNames={
 'battleships-in-a-board':'X cell','longest-increasing-path-in-a-matrix':'matrix cell','minesweeper':'board square','number-of-increasing-paths-in-a-grid':'grid cell','number-of-islands':'land cell','word-search':'board cell','ten-kinds-of-people':'grid cell','gfg-grid-path-exists':'non-wall cell','hackerrank-connected-cells':'1 cell','count-sub-islands':'land cell in grid2','find-all-groups-of-farmland':'farmland cell','flood-fill':'pixel with the original starting color','kattis-getting-gold':'non-wall square','max-area-of-island':'land cell','maximum-number-of-fish-in-a-grid':'positive-valued water cell','structy-minimum-island':'L cell'};
const nested=new Set(['flatten-nested-list-iterator','nested-list-weight-sum','nested-list-weight-sum-ii','codewars-array-deep-count']);
const trees=new Set(['path-sum','structy-tree-sum','structy-max-root-to-leaf-path-sum','evaluate-boolean-binary-tree']);
const edgeRules={
 'all-paths-from-source-to-target':'Draw an arrow for each directly listed neighbor.',
 'battleships-in-a-board':'Join X cells only when they share a side.',
 'course-schedule':'For [course, prerequisite], draw prerequisite → course.',
 'detonate-the-maximum-bombs':'Draw i→j when j’s center is within bomb i’s radius.',
 'evaluate-division':'An equation a/b=v gives a→b weight v and b→a weight 1/v.',
 'find-if-path-exists-in-graph':'Each listed pair gives one two-way connection.',
 'flatten-nested-list-iterator':'A list points to each item directly inside it.',
 'is-graph-bipartite':'Each neighbor pair gives one two-way conflict edge.',
 'keys-and-rooms':'A room points to each room named by a key inside it.',
 'kill-process':'A parent process points to each direct child.',
 'letter-combinations-of-a-phone-number':'Append one letter allowed by the next digit.',
 'longest-increasing-path-in-a-matrix':'A cell points to side-neighbors with strictly greater values.',
 'minesweeper':'Each square connects to its side and corner neighbors.',
 'nested-list-weight-sum':'A list points to the items directly inside it.',
 'nested-list-weight-sum-ii':'A list points to the items directly inside it.',
 'network-delay-time':'Each listed wire gives a one-way arrow with its travel time.',
 'number-of-connected-components-in-an-undirected-graph':'Each listed pair gives one two-way connection.',
 'number-of-increasing-paths-in-a-grid':'A cell points to side-neighbors with strictly greater values.',
 'number-of-islands':'Join land cells only when they share a side.',
 'number-of-provinces':'An off-diagonal 1 gives a two-way connection between those cities.',
 'possible-bipartition':'Each dislike pair gives one two-way conflict edge.',
 'smallest-string-with-swaps':'Each listed swap pair connects its two indexes in both directions.',
 'time-needed-to-inform-all-employees':'A manager points to each direct report.',
 'water-and-jug-problem':'One arrow represents one legal fill, empty, or pour.',
 'word-search':'Cells connect through shared sides, never through corners.'
};
function choice(id,label,feedback,misconception=null){return{id,label,feedback,misconception};}
function countGroups(g){const next=new Map(g.nodes.map(n=>[n.id,[]]));g.edges.forEach(e=>{next.get(e.from).push(e.to);next.get(e.to).push(e.from);});const visited=new Set();let groups=0;for(const n of g.nodes){if(visited.has(n.id))continue;groups++;const q=[n.id];while(q.length){const v=q.pop();if(visited.has(v))continue;visited.add(v);q.push(...next.get(v));}}return groups;}
function makeDecision(correct,wrong,why,prompt='How many nodes belong in this model?'){return{prompt,correct:'correct',choices:[choice('correct',String(correct),'Correct. '+why),choice('wrong',String(wrong),why,'omits-required-input-item')]};}
function mistakenEdgeCount(g,id,input) {
 if(id==='battleships-in-a-board')return g.edges.filter(e=>e.from.split(',')[0]===e.to.split(',')[0]).length;
 const keys=new Set(g.edges.map(e=>g.directed?`${e.from}>${e.to}`:[e.from,e.to].sort().join('|')));
 if(gridNames[id] && id!=='kattis-getting-gold') {
  const diagonal=(a,b)=>{const x=a.label.match(/\((\d+),(\d+)\)/),y=b.label.match(/\((\d+),(\d+)\)/);return x&&y&&Math.abs(+x[1]-y[1])===1&&Math.abs(+x[2]-y[2])===1;};
  if(['minesweeper','hackerrank-connected-cells'].includes(id))return g.edges.filter(e=>!diagonal(g.nodes.find(n=>n.id===e.from),g.nodes.find(n=>n.id===e.to))).length;
  // A diagonal edge has at most one increasing direction; ordinary cell moves are two-way.
  let added=0;for(let a=0;a<g.nodes.length;a++)for(let b=a+1;b<g.nodes.length;b++)if(diagonal(g.nodes[a],g.nodes[b])){if(id==='ten-kinds-of-people'){const values=JSON.parse(input.match(/grid=(\[[^;]*?\]), queries/)[1]),first=g.nodes[a].label.match(/\d+/g).map(Number),second=g.nodes[b].label.match(/\d+/g).map(Number);if(values[first[0]][first[1]]!==values[second[0]][second[1]])continue;}if(['longest-increasing-path-in-a-matrix','number-of-increasing-paths-in-a-grid'].includes(id)){const values=JSON.parse(input.match(/(?:grid|matrix)=(\[.*\])/)[1]),first=g.nodes[a].label.match(/\d+/g).map(Number),second=g.nodes[b].label.match(/\d+/g).map(Number);if(values[first[0]][first[1]]===values[second[0]][second[1]])continue;}added++;}
  return g.edges.length+added;
 }
 if(g.directed){for(const e of g.edges)keys.add(`${e.to}>${e.from}`);return keys.size;}
 const next=new Map(g.nodes.map(n=>[n.id,[]]));g.edges.forEach(e=>{next.get(e.from).push(e.to);next.get(e.to).push(e.from);});
 let links=0;for(const n of g.nodes){const seen=new Set(),stack=[n.id];while(stack.length){const v=stack.pop();if(seen.has(v))continue;seen.add(v);stack.push(...next.get(v));}links+=seen.size-1;}return links/2;
}
const specs=new Map([...read('visual-specs-original.json'),...read('visual-specs-new.json')].map(p=>[p.id,p]));
const failures=[];
for(const file of ['visual-lessons-original.json','visual-lessons-new.json']){
 const lessons=read(file);
 for(const p of lessons){
  const used=new Set([...p.buildTasks,...p.conceptTasks.slice(3),...p.conceptTasks.slice(3).map(t=>t.remedial)].map(t=>t.input));
  const pool=Array.from({length:20},(_,i)=>makeInput(p.id,i%5,Math.floor(i/5)+1)).filter((t,i,a)=>a.findIndex(o=>o.input===t.input)===i);
  function next(predicate=()=>true){const t=pool.find(t=>!used.has(t.input)&&t.canvas.nodes.length>1&&t.canvas.nodes.length<=(p.id==='letter-combinations-of-a-phone-number'?13:9)&&t.canvas.edges.length&&predicate(t));if(t)used.add(t.input);return t;}
  for(let i=0;i<3;i++){
   const separates=t=>i!==2||p.id==='evaluate-division'||mistakenEdgeCount(t.canvas,p.id,t.input)!==t.canvas.edges.length;
   const input=next(separates);if(!input){failures.push(`${p.id}/${i}: need another independent rule input`);continue;}
   const t=p.conceptTasks[i],g=input.canvas;t.input=input.input;
   if(i===0){
    const omitted=clone(g),node=omitted.nodes.pop();omitted.edges=omitted.edges.filter(e=>e.from!==node.id&&e.to!==node.id);
    const missing=clone(g),edge=missing.edges.pop();
    const altered=clone(g);altered.directed=!g.directed;if(!altered.directed){const seen=new Set();altered.edges=altered.edges.filter(e=>{const key=[e.from,e.to].sort().join('|');if(seen.has(key))return false;seen.add(key);return true;});}
    t.prompt='Which drawing matches every item and direct connection in this input?';
    t.choices=[{...choice('exact','Picture A','Every input item and direct relation is present.'),model:clone(g)},{...choice('missing-node','Picture B',`${node.label} is an input item and needs its own node.`,'omit-input-item'),model:omitted},{...choice('missing-edge','Picture C',`The direct relation ${edge.from} ${g.directed?'→':'—'} ${edge.to} is missing.`,'omit-direct-relation'),model:missing},{...choice('wrong-direction','Picture D',`The relation must be ${g.directed?'one-way':'two-way'} here.`,'change-direction'),model:altered}];t.correct='exact';t.why='An exact model keeps every input item and each direct relation.';
   }else if(i===1){
    const id=p.id,grid=gridNames[id],isNested=nested.has(id),isTree=trees.has(id);
    const nodeRules={'all-paths-from-source-to-target':'Use one node for every adjacency-list index.','course-schedule':'Use every course index from 0 through numCourses−1.','evaluate-division':'Use one node for each variable occurring in an equation.','keys-and-rooms':'Use every room index, including rooms with no keys.','kill-process':'Use every process ID listed in pid.','network-delay-time':'Use every numbered network node from 1 through n.','possible-bipartition':'Use every person numbered 1 through n.','smallest-string-with-swaps':'Use every string position, keeping equal letters separate.','time-needed-to-inform-all-employees':'Use every employee index, including zero-delay employees.','water-and-jug-problem':'Use each reachable pair of current jug amounts as a node.','ladder-takahashi':'Use floor 1 and every floor number mentioned by a ladder.','find-if-path-exists-in-graph':'Use every vertex from 0 through n−1.','number-of-connected-components-in-an-undirected-graph':'Use every vertex from 0 through n−1.','number-of-provinces':'Use one city node per matrix row.','is-graph-bipartite':'Use one vertex per adjacency-list index.','properties-graph':'Use one node per properties row, keeping identical rows separate.','usaco-milk-factory':'Use every station numbered 1 through n.','wheres-my-internet':'Use every house numbered 1 through n.'};
    const correct=nodeRules[id]|| (grid?`Use one node for each ${grid}.`:isNested?'Keep every container and every separate item occurrence.':isTree?'Use one node for every existing tree object.':id==='letter-combinations-of-a-phone-number'?'Use one node for every allowed partial string, including the empty prefix.':'Use one node for each input item, including items the search cannot reach.');
    const wrong=id==='evaluate-division'?'Use one node per equation.':id==='water-and-jug-problem'?'Merge states with the same total water into one node.':grid?'Use one node per connected region.':isNested?'Use only plain values.':isTree?'Use only the leaves.':id==='letter-combinations-of-a-phone-number'?'Use only finished strings.':g.directed?'Keep only items with at least one outgoing arrow.':'Use one node per listed connection.';
    t.prompt='What becomes a node for this input?';
    t.choices=[choice('correct',correct,'Each separate input item required by this model keeps its identity.'),choice('wrong',wrong,grid?'Region compression can be useful later, but this exercise requires separate cell nodes.':isNested?'Containers determine which item belongs inside which parent. Omitting them loses that nesting.':isTree?'Parents and branches are part of the given tree too.':'This changes the meaning of a node and drops required input items.','wrong-node-identity')];t.correct='correct';t.why=t.choices[0].feedback;
   }else{
    const spec=specs.get(p.id),correct=edgeRules[p.id]||spec.edgeQuestion.choices.find(c=>c.id===spec.edgeQuestion.correct).label;
    let wrong,feedback;
    if(p.id==='battleships-in-a-board'){wrong='Join ship cells across horizontal sides only.';feedback='Vertical side-neighbors in a ship also need a direct connection.';}
    else if(p.id==='evaluate-division'){wrong='Use the written ratio unchanged in both directions.';feedback='Reversing an equation requires the reciprocal ratio.';}
    else if(gridNames[p.id]&&p.id!=='kattis-getting-gold'){
     const eight=['minesweeper','hackerrank-connected-cells'].includes(p.id);
     wrong=eight?'Use only side neighbors; leave out corner neighbors.':'Also allow corner-neighbor moves when their cell values fit.';
     feedback=eight?'This problem includes corner neighbors as direct connections.':'This problem permits side steps only. A corner is not a legal direct step.';
    }else if(g.directed){wrong='Make every allowed direct connection work in both directions.';feedback='An allowed move in one direction does not automatically permit the reverse move.';}
    else {wrong='Add a direct connection between every pair joined by any multi-step route.';feedback='A route may use several existing edges. It does not create an extra direct edge.';}
    t.prompt='Which rule gives the direct connections for this input?';t.choices=[choice('correct',correct,'This preserves the problem’s direct-move rule.'),choice('wrong',wrong,feedback,'wrong-direct-edge-rule')];t.correct='correct';t.why='Direct edges describe one allowed move, not an entire route.';
   }
   // Keep a separate repair input; its exact drawing tests the just-missed rule.
   const repair=next(candidate=>separates(candidate)&&(i!==1||candidate.canvas.directed||gridNames[p.id]||candidate.canvas.edges.length!==candidate.canvas.nodes.length));if(!repair){failures.push(`${p.id}/${i}: need another independent repair input`);continue;}
   let wrongCount=repair.canvas.nodes.length-1,why=`There are ${repair.canvas.nodes.length} separate required input items; omitting one loses its identity.`;
   if(i===1){
    const rg=repair.canvas,from=new Set(rg.edges.map(e=>e.from));
    if(p.id==='evaluate-division'){wrongCount=rg.edges.length/2;why=`There are ${wrongCount} equations but ${rg.nodes.length} distinct variables. Nodes represent variables, not equation rows.`;}
    else if(p.id==='water-and-jug-problem'){wrongCount=new Set(rg.nodes.map(n=>n.label.match(/\d+/g).map(Number).reduce((a,b)=>a+b,0))).size;why=`There are ${rg.nodes.length} reachable amount pairs. Merging equal totals leaves only ${wrongCount} states and loses which jug holds the water.`;}
    else if(gridNames[p.id]){wrongCount=countGroups(rg);why=`There are ${rg.nodes.length} cell nodes. Grouping them gives ${wrongCount} regions, a different representation.`;}
    else if(nested.has(p.id)){wrongCount=rg.nodes.filter(n=>!/(?:=\[\]|array)$/.test(n.label)).length;why=`Plain values alone give ${wrongCount}; the containers also need nodes, making ${rg.nodes.length}.`;}
    else if(trees.has(p.id)||p.id==='letter-combinations-of-a-phone-number'){wrongCount=rg.nodes.filter(n=>!from.has(n.id)).length;why=`The ${wrongCount} leaves are only part of the model. Parent or prefix nodes bring the total to ${rg.nodes.length}.`;}
    else if(rg.directed){wrongCount=from.size;why=`Only ${wrongCount} nodes have outgoing arrows. Nodes without outgoing arrows still count, giving ${rg.nodes.length}.`;}
    else{wrongCount=rg.edges.length;why=`There are ${wrongCount} connections but ${rg.nodes.length} input items. Nodes represent the items.`;}
   }
   let proofDecision=makeDecision(repair.canvas.nodes.length,wrongCount,why);
   if(i===2){
    const correctCount=repair.canvas.edges.length,badCount=mistakenEdgeCount(repair.canvas,p.id,repair.input);
    why=`The stated direct-edge rule gives ${correctCount} connections. Applying the mistaken rule gives ${badCount}.`;
    proofDecision=makeDecision(correctCount,badCount,why,'How many direct connections belong in this exact graph?');
    if(p.id==='evaluate-division'){
     const edge=repair.canvas.edges.find(e=>Number(e.label)<1),ratio=Number(edge.label);
     why=`Reversing a ratio takes its reciprocal. This arrow needs ${ratio}, not ${1/ratio}.`;
     proofDecision=makeDecision(ratio,1/ratio,why,`What weight belongs on ${edge.from} → ${edge.to}?`);
    }
   }
   t.remedial={...t.remedial,input:repair.input,canvas:repair.canvas,prompt:'Build this different input exactly, then answer from your drawing.',decision:proofDecision,why};
  }
 }
 fs.writeFileSync(file,JSON.stringify(lessons,null,2)+'\n');
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
console.log('Authored fresh Original/New exact, node, and direct-edge checks.');
