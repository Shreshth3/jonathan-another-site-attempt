// Authoring repairs from astraimprovements.md. Run after the lesson authors.
const fs = require('fs');
const vm = require('vm');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const original = read('visual-lessons-original.json');
const fresh = read('visual-lessons-new.json');
const specs = new Map([...read('visual-specs-original.json'), ...read('visual-specs-new.json')].map(p => [p.id, p]));
const find = id => [...original, ...fresh].find(p => p.id === id);
const tasks = p => [...p.buildTasks, ...p.conceptTasks.map(t => t.remedial)];
function decision(task, correct, wrong, bug, explanation) {
  task.decision = {prompt: 'What should the function return?', correct:'correct', choices:[
    {id:'correct',label:String(correct),feedback:`Correct. ${explanation}`,misconception:null},
    {id:'wrong',label:String(wrong),feedback:explanation,misconception:bug}
  ]};
  task.why = explanation;
}
function model(directed, labels, edges) {
  return {directed,nodes:labels.map(label=>({id:String(label),label:String(label)})),edges:edges.map(([from,to])=>({from:String(from),to:String(to)}))};
}
function gridModel(board) {
  const labels=[], edges=[];
  for(let r=0;r<board.length;r++)for(let c=0;c<board[r].length;c++) {
    labels.push(`(${r},${c})`);
    if(r+1<board.length)edges.push([`(${r},${c})`,`(${r+1},${c})`]);
    if(c+1<board[r].length)edges.push([`(${r},${c})`,`(${r},${c+1})`]);
  }
  return model(false,labels,edges);
}
function setWord(task, board, word, correct, wrong, bug, why) {
  task.input=`board = ${JSON.stringify(board)}, word = ${JSON.stringify(word)}`;
  task.canvas=gridModel(board); decision(task,correct,wrong,bug,why);
}
// Re-read corrected authoritative rule/output choices, retaining authored task IDs.
for(const p of [...original,...fresh]) {
  const spec=specs.get(p.id);
  for(let i=1;i<5;i++) {
    const source=i===1?spec.nodeQuestion:i===2?spec.edgeQuestion:spec.pictureQuestions[i-3];
    const t=p.conceptTasks[i];
    t.prompt=source.prompt;t.choices=clone(source.choices);t.correct=source.correct;
    if(source.input)t.input=source.input;
    t.why=t.choices.find(c=>c.id===t.correct).feedback;
    if(i<3 && (!t.input || t.input===t.prompt || !/[=\[]/.test(t.input))) t.input=p.buildTasks.find(b=>b.canvas.edges.length)?.input||p.buildTasks[0].input;
  }
  for(const t of tasks(p))t.decision.choices=t.decision.choices.filter(c=>c.id!=='not-enough-information');
}
const bip=find('possible-bipartition');
bip.conceptTasks[1].input='n=6, dislikes=[[1,2],[3,4],[4,5],[5,3]]';
const bipFirst=bip.buildTasks[0];bipFirst.input='n=4, dislikes=[[1,2],[1,3],[1,4]]';bipFirst.canvas=model(false,[1,2,3,4],[[1,2],[1,3],[1,4]]);
decision(bipFirst,'true','false','require-equal-group-sizes','The valid split is {1} and {2,3,4}. The two groups may have different sizes.');
const province=find('number-of-provinces').conceptTasks[4].remedial;
province.input='isConnected=[[1,1,0,0,0],[1,1,1,0,0],[0,1,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]';province.canvas=model(false,[0,1,2,3,4],[[0,1],[1,2]]);
decision(province,'3','1','ignore-isolated-cities','Cities 0,1,2 form one province. Isolated cities 3 and 4 each add another province.');
const word=find('word-search');
for(const t of tasks(word)) {
 const box={};vm.runInNewContext(t.input.replace(/,\s*(?=word\s*=)/,'; ')+'; result=board;',box);t.canvas=gridModel(box.result);
}
setWord(word.conceptTasks[0].remedial,[['C','X'],['X','A']],'CA','false','true','allow-diagonal-move','C and A touch only at a corner; there is no legal side step.');
word.conceptTasks[2].input='board=[["D","X"],["X","O"]], word="DO"';
setWord(word.conceptTasks[2].remedial,[['D','X'],['X','O']],'DO','false','true','allow-diagonal-move','D and O are diagonal. Corner moves are not legal.');
setWord(word.conceptTasks[3].remedial,[['A','B'],['B','X'],['C','X']],'ABC','true','false','stop-after-first-failed-branch','The right B is a dead end. Returning to A and trying the lower B reaches C.');
setWord(word.conceptTasks[4].remedial,[['A','B'],['X','C']],'ABCB','false','true','reuse-cell-in-one-path','After A→B→C, spelling the final B would reuse the only B cell. A path cannot reuse a cell.');
const wordExact=word.conceptTasks[0];wordExact.input=word.buildTasks[0].input;
const exactModel=word.buildTasks[0].canvas;
wordExact.choices.find(c=>c.id==='exact').model=clone(exactModel);
let altered=clone(exactModel);altered.edges.pop();wordExact.choices.find(c=>c.id==='missing-edge').model=altered;
altered=clone(exactModel);altered.edges.pop();altered.edges.push({from:'(0,0)',to:'(1,1)'});wordExact.choices.find(c=>c.id==='wrong-relation').model=altered;
wordExact.choices.find(c=>c.id==='wrong-relation').feedback='The diagonal (0,0)—(1,1) is not a side step. The bottom horizontal edge is missing.';
altered=clone(exactModel);const removed=altered.nodes.pop().id;altered.edges=altered.edges.filter(e=>e.from!==removed&&e.to!==removed);wordExact.choices.find(c=>c.id==='missing-node').model=altered;
// Full legal jug graph, authored here rather than patched at runtime.
function jugCanvas(aCap,bCap) {
 const queue=[[0,0]], seen=new Map([['0,0',[0,0]]]),edges=[],edgeKeys=new Set();
 for(let i=0;i<queue.length;i++) {
  const [a,b]=queue[i],from=`${a},${b}`,ab=Math.min(a,bCap-b),ba=Math.min(b,aCap-a);
  for(const next of [[aCap,b],[a,bCap],[0,b],[a,0],[a-ab,b+ab],[a+ba,b-ba]]) {
   const to=next.join(',');if(to===from)continue;
   if(!edgeKeys.has(from+'>'+to)){edgeKeys.add(from+'>'+to);edges.push({from,to});}
   if(!seen.has(to)){seen.set(to,next);queue.push(next);}
  }
 }
 return {directed:true,nodes:[...seen.keys()].map(id=>({id,label:`(${id})`})),edges};
}
const jug=find('water-and-jug-problem');
const jugInputs=[[1,2,1],[2,2,1],[1,3,2],[2,2,4],[1,2,2],[1,3,3],[2,2,3],[1,2,3],[1,3,4]];
const jugWhy=[
 'Filling the 1-liter jug reaches 1 directly.',
 'Two 2-liter jugs only hold even totals after legal moves; 1 cannot be measured.',
 'Fill the 3-liter jug and pour into the 1-liter jug to leave 2.',
 'Filling both 2-liter jugs holds 4 total; the target may use both jugs.',
 'Filling the 2-liter jug directly holds 2.',
 'Filling the 3-liter jug directly holds 3.',
 'Both capacities are 2. Legal moves cannot produce the odd total 3.',
 'Filling both jugs gives 1+2=3. The target need not fit inside one jug.',
 'Filling both jugs gives 1+3=4. The target may be their combined total.'
];
tasks(jug).forEach((t,i)=>{const[a,b,target]=jugInputs[i];t.input=`jug1Capacity=${a}, jug2Capacity=${b}, targetCapacity=${target}`;t.canvas=jugCanvas(a,b);const answer=i!==1&&i!==6;decision(t,String(answer),String(!answer),i===1||i===6?'allow-measured-partial-pour':'miss-legal-target-state',jugWhy[i]);});
const jq=jug.conceptTasks[0];jq.input='jug1Capacity=2, jug2Capacity=2, targetCapacity=2';const jm=jugCanvas(2,2);
for(const c of jq.choices){c.model=clone(jm);if(c.id==='missing-edge')c.model.edges.pop();if(c.id==='wrong-relation'){c.model.edges.shift();c.model.edges.push({from:'0,0',to:'2,2'});c.feedback='The arrow (0,0)→(2,2) fills both jugs at once. One move fills only one jug.';}if(c.id==='missing-node'){const id=c.model.nodes.pop().id;c.model.edges=c.model.edges.filter(e=>e.from!==id&&e.to!==id);}}
// Geometric cases: positive coordinates, complete arrows, separating direction repair.
const bombs=find('detonate-the-maximum-bombs');
for(const t of tasks(bombs)){
 const m=t.input.match(/bombs\s*=\s*(\[.*\])/);if(!m)continue;
 let a=JSON.parse(m[1]);if(a.some(([x,y])=>x<1||y<1))a=a.map(([x,y,r])=>[x+1,y+1,r]);
 t.input='bombs='+JSON.stringify(a);
 const labels=a.map((_,i)=>String.fromCharCode(65+i)),edges=[];
 a.forEach(([x,y,r],i)=>a.forEach(([xx,yy],j)=>{if(i!==j&&(x-xx)**2+(y-yy)**2<=r*r)edges.push([labels[i],labels[j]]);}));
 t.canvas=model(true,labels,edges);
}
const br=bombs.conceptTasks[0].remedial;br.input='bombs=[[2,2,1],[5,2,4],[10,2,1]]';br.canvas=model(true,['A','B','C'],[['B','A']]);decision(br,'2','1','reverse-blast-arrow','Only B reaches A. C is separate; the largest reaction starts at B and reaches 2 bombs.');
// Correct result for the authored first-start bomb mistake.
decision(bombs.conceptTasks[3].remedial,'3','1','always-start-first-bomb','Starting at A reaches only itself. Starting at B reaches A and C, so the maximum is 3.');
const inverse=find('nested-list-weight-sum-ii');for(const t of tasks(inverse))if(t.input.includes('[1,[[]]]'))t.why=t.decision.choices.find(c=>c.id===t.decision.correct).feedback='Correct. Maximum depth means deepest integer depth. Empty arrays do not make the integer 1 heavier.';
// Explicit numbering contract for fixed-slot binary-tree examples.
for(const id of ['path-sum','structy-tree-sum','structy-max-root-to-leaf-path-sum']) {
 const p=find(id);
 for(const t of [...tasks(p),...p.conceptTasks])if(t.input.includes('level-order=')&&!t.input.includes('fixed slots'))t.input += ' (fixed slots: children of index i are 2i+1 and 2i+2; null is an empty slot)';
}
find('codewars-array-deep-count').conceptTasks[1].input='deepCount([[],1])';
find('properties-graph').conceptTasks[2].input='properties=[[2,2,3],[2,4,4]], k=2';
find('gfg-grid-path-exists').conceptTasks[2].input='grid=[[1,3,0],[0,0,2],[0,0,0]]';
// Avoid calling unchanged worked inputs fresh. Separate assessment freshness is tracked explicitly.
for(const p of [...original,...fresh]) {
 for(const t of p.conceptTasks) {
  if(p.buildTasks.some(b=>b.input===t.input))t.prompt=t.prompt.replace(/fresh input/gi,'input');
  if(t.kind==='visual-options') {
   const correct=t.choices.find(c=>c.id===t.correct).model;
   for(const c of t.choices)if(c.id!==t.correct) {
    if(c.id==='wrong-relation' && ['word-search','water-and-jug-problem'].includes(p.id))continue;
    const wrong=c.model;if(!wrong)continue;
    const missing=correct.nodes.filter(n=>!wrong.nodes.some(w=>w.id===n.id));
    const missingEdges=correct.edges.filter(e=>!wrong.edges.some(w=>w.from===e.from&&w.to===e.to));
    const label=id=>correct.nodes.find(n=>n.id===id)?.label||id;
    if(missing.length)c.feedback=`Input item ${missing.map(n=>n.label).join(', ')} is missing. It still needs a node.`;
    else if(correct.directed!==wrong.directed)c.feedback=`These relations are ${correct.directed?'one-way arrows':'two-way links'}. This picture changes their direction rule.`;
    else if(missingEdges.length){const e=missingEdges[0];c.feedback=`The input requires ${label(e.from)} ${correct.directed?'→':'—'} ${label(e.to)}. This picture removes or changes that direct connection.`;}
   }
  }
 }
}
fs.writeFileSync('visual-lessons-original.json',JSON.stringify(original,null,2)+'\n');
fs.writeFileSync('visual-lessons-new.json',JSON.stringify(fresh,null,2)+'\n');
console.log('Applied Original/New audit authoring repairs.');
