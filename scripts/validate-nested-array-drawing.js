const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'visual-library.js'), 'utf8');
const engine = { structuredClone };
vm.runInNewContext(source.slice(source.indexOf('  function arrayNumberLabel('), source.indexOf('  function gradeCanvas(')) + '\nthis.grade = gradeArrayNumberCanvas; this.helpAttempt = arrayDrawingHelpAttempt;', engine);
const editorSource = fs.readFileSync(path.join(root, 'graph.js'), 'utf8');
vm.runInNewContext(editorSource.slice(editorSource.indexOf('  function normalizeArrayValue('), editorSource.indexOf('  function setNodeLabelRule(')) + '\nthis.normalize = normalizeArrayValue;', engine);
const specs = ['original','variant','new'].flatMap(g=>require(`../visual-specs-${g}.json`));
const lessons = ['original','variant','new'].flatMap(g=>require(`../visual-lessons-${g}.json`));
const nested = specs.filter(p=>p.visualKind==='nested');
assert.equal(nested.length, 8);
assert(!source.includes('How to use the drawing tool'));

function parseInput(text) {
  const start = text.indexOf('[');
  let depth = 0, quoted = false, escaped = false;
  for (let i=start; i<text.length; i++) {
    const ch = text[i];
    if (quoted) { if (escaped) escaped=false; else if(ch==='\\') escaped=true; else if(ch==='"') quoted=false; continue; }
    if(ch==='"')quoted=true;
    if(ch==='[')depth++;
    if(ch===']' && --depth===0)return JSON.parse(text.slice(start,i+1));
  }
  throw new Error(`Cannot parse input ${text}`);
}
function drawingOf(value) {
  const drawing={directed:true,nodes:[],edges:[]};
  function visit(item,parent){
    const id=drawing.nodes.length;
    drawing.nodes.push({id,label:Array.isArray(item)?'Array':JSON.stringify(item)});
    if(parent!==undefined)drawing.edges.push({from:parent,to:id,label:''});
    if(Array.isArray(item))item.forEach(child=>visit(child,id));
  }
  visit(value);return drawing;
}
function passes(r){return ['nodes','edges','direction','colors','labels'].every(k=>r[k]);}
function output(id, items, input){
  const values=[];let total=0;
  function visit(array,depth){for(const value of array){total++;if(Array.isArray(value))visit(value,depth+1);else values.push({value,depth});}}
  visit(items,1);
  const k=Number(input.match(/k\s*=\s*(\d+)/)?.[1]);
  if(id==='flatten-nested-list-iterator')return values.map(n=>n.value);
  if(id==='nested-list-weight-sum')return values.reduce((s,n)=>s+n.value*n.depth,0);
  if(id==='nested-list-weight-sum-ii'){const max=Math.max(0,...values.map(n=>n.depth));return values.reduce((s,n)=>s+n.value*(max-n.depth+1),0);}
  if(id==='coins-on-level-k')return values.filter(n=>n.depth===k).reduce((s,n)=>s+n.value,0);
  if(id==='kth-song-in-playlist')return values[k-1]?.value??-1;
  if(id==='top-of-the-pile'){const min=Math.min(...values.map(n=>n.depth));return values.filter(n=>n.depth===min).reduce((s,n)=>s+n.value,0);}
  if(id==='codewars-array-deep-count')return total;
  const counts={};for(const n of values)counts[n.depth]=(counts[n.depth]||0)+1;
  return Number(Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||a-b)[0]);
}
let builds=0,pictures=0;
for(const spec of nested){
  const lesson=lessons.find(p=>p.id===spec.id);
  assert.deepEqual(lesson.drawingEditor,spec.step1Drawing,`${spec.id}: regenerate drawing instructions`);
  assert.equal(lesson.drawingEditor.mode,'array-number');
  const options=lesson.drawingEditor;
  const tasks=[...lesson.buildTasks,...lesson.conceptTasks.map(t=>t.remedial)];
  assert.equal(tasks.length,9);
  for(const task of tasks){
    const items=parseInput(task.input), drawing=drawingOf(items);
    assert(passes(engine.grade(task.canvas,drawing,options)),`${spec.id}/${task.id}: raw-input graph rejected`);
    // Node creation order never matters; per-parent arrow order matters only in traversal lessons.
    drawing.nodes.reverse();
    if(!options.ordered)drawing.edges.reverse();
    assert(passes(engine.grade(task.canvas,drawing,options)),`${spec.id}/${task.id}: reordered graph`);
    const missing=structuredClone(drawing);missing.nodes.pop();
    assert(!passes(engine.grade(task.canvas,missing,options)),`${spec.id}/${task.id}: missing node accepted`);
    assert(!passes(engine.grade(task.canvas,{...drawing,directed:false},options)),`${spec.id}/${task.id}: undirected accepted`);
    if(drawing.edges.length){
      const wrong=structuredClone(drawing);const valueEdge=wrong.edges.find(e=>wrong.nodes.find(n=>n.id===e.to).label!=="Array");
      if(valueEdge){[valueEdge.from,valueEdge.to]=[valueEdge.to,valueEdge.from]; assert(!passes(engine.grade(task.canvas,wrong,options)),`${spec.id}/${task.id}: reversed arrow`);}
      const extra=structuredClone(drawing);extra.edges.push({...extra.edges[0]});
      assert(!passes(engine.grade(task.canvas,extra,options)),`${spec.id}/${task.id}: duplicate edge`);
      const labeled=structuredClone(drawing);labeled.edges[0].label='9';
      assert(!passes(engine.grade(task.canvas,labeled,options)),`${spec.id}/${task.id}: labeled arrow`);
    }
    for(const node of drawing.nodes)if(node.label!=='Array')assert.notEqual(engine.normalize(node.label,options),null,`${spec.id}: editor rejects ${node.label}`);
    const answer=task.decision.choices.find(c=>c.id===task.decision.correct).label.replace(/`/g,'').replace(/^Return\s+/i,'').trim();
    const result = /How many nodes/.test(task.decision.prompt) ? drawing.nodes.length : /How many direct/.test(task.decision.prompt) ? drawing.edges.length : output(spec.id,items,task.input);
    assert.deepEqual(JSON.parse(answer),result,`${spec.id}/${task.id}: wrong real output`);
    builds++;
  }
  for(const task of lesson.conceptTasks){
    if(task.kind!=='visual-options')continue;
    const drawing=drawingOf(parseInput(task.input));
    for(const choice of task.choices){
      assert.equal(passes(engine.grade(choice.model,drawing,options)),choice.id===task.correct,`${spec.id}/${choice.id}: ambiguous or wrong picture`);
      pictures++;
    }
  }
  if(options.valueKind!=='literal'){
    for(const n of [options.min,options.max,0])assert.equal(engine.normalize(String(n),options),String(n));
    for(const s of [String(options.min-1),String(options.max+1),'1.5','NaN','Array','"7"','true'])assert.equal(engine.normalize(s,options),null);
  }
}
const literal={valueKind:'literal'};
for(const value of ['"x"','"Array"','"a=b"','true','false','1.5','-2','""'])assert.equal(engine.normalize(value,literal),value);
for(const value of ['Array','null','{}','[]','NaN','Infinity','1e999'])assert.equal(engine.normalize(value,literal),null);
const same=drawingOf([[2],[2]]),wrong=structuredClone(same);wrong.edges.find(e=>e.to===4).from=1;
assert(!passes(engine.grade(same,wrong)), 'same labels at same depths but wrong parents');
const sequence=drawingOf([[1,2],3]);const reverse=structuredClone(sequence);reverse.edges.reverse();
assert(!passes(engine.grade(sequence,reverse,{ordered:true})), 'wrong playback order');
assert(passes(engine.grade(sequence,reverse)), 'unordered count allows sibling reordering');
const cycle=drawingOf([[],[]]);cycle.edges=[{from:1,to:2},{from:2,to:1}];
assert(!passes(engine.grade(drawingOf([[],[]]),cycle)), 'disconnected cycle');
assert(passes(engine.grade(drawingOf(['a=b','Array',true]),drawingOf(['a=b','Array',true]))), 'literal labels retain type and equals signs');
console.log(`Validated all ${nested.length} nested lessons: ${builds} builds/repairs, ${pictures} picture choices, exact outputs, order, duplicate values and editor limits.`);

const help = engine.helpAttempt({ task: { canvas: { directed: true, nodes: [{id:'root',label:'root=[]'},{id:'a',label:'root[0]=[]'},{id:'v',label:'root[0][0]=7'}], edges:[{from:'root',to:'a'},{from:'a',to:'v'}] } }, studentGraph: drawingOf([[7]]) });
assert.equal(help.task.canvas.nodeLabelMode, 'array-number');
assert.equal(JSON.stringify(help.task.canvas.nodes.map(n=>n.label)), JSON.stringify(['Array','Array','7']));
const {graphMistakes} = require('../netlify/functions/lib/ai-help.cjs');
assert.deepEqual(graphMistakes(help.task.canvas, help.studentGraph), [], 'AI help must not invent missing path labels or duplicate-name mistakes');
console.log('AI help uses typed labels and accepts repeated Array names.');
