/* Build Step 6 from the source site's actual JavaScript and fresh local inputs. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const engine = require('./step5-engine');
const inputs = require('./step6-inputs');
const root = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(root, '../jonathan-study-site');
const sourceFiles = fs.readdirSync(path.join(sourceRoot,'data')).filter(name=>/^variants-final-.*\.json$/.test(name)).sort();
const sources = sourceFiles.flatMap(name=>JSON.parse(fs.readFileSync(path.join(sourceRoot,'data',name),'utf8')).map(p=>({...p,sourceFile:name})));
const step5 = JSON.parse(fs.readFileSync(path.join(root,'step5-specs-variant.json'),'utf8'));
const previous = ['visual-specs-variant.json','visual-lessons-variant.json','step4-specs-variant.json','step5-specs-variant.json'].map(file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8')));
const descriptions = {
 sky:'A rectangular grid of 0s and 1s.', marina:'A rectangular grid of "B" and "." cells.',yard:'A rectangular grid of "T" and "." cells.',park:'A rectangular grid of 0s and 1s.',cave:'A rectangular grid of "G" and "U" cells.',row:'The starting row number, counting from 0.',col:'The starting column number, counting from 0.',
 items:'A list of integers and nested lists.',playlist:'A list of song IDs and nested lists.',ids:'A list of unique positive IDs.',bosses:'One boss ID per employee, in ids order. The root has boss 0.',feeds:'One upstream ID per sprinkler, in ids order. The root has feed 0.',liters:'One positive water amount per sprinkler, in ids order.',quitId:'The ID of the employee who quits.',shutId:'The ID of the valve to shut.',vaults:'One key list per vault. Vault numbers start at 0.',startKeys:'A list of starting keys.',rooms:'One key list per room. Room numbers start at 0.',gold:'One gold amount per room.',n:'The number of nodes, numbered 0 through n − 1.',friendships:'A list of undirected [person, person] pairs.',start:'The starting node number.',trails:'A list of undirected [camp, camp] pairs.',flooded:'A list of flooded campsite numbers.',finish:'The destination campsite number.',tracks:'A list of undirected [station, station] pairs.',colors:'One "red" or "blue" string per track, in tracks order.',source:'The starting station number.',destination:'The destination station number.',paths:'A list of undirected [village, village] pairs.',wells:'A list of village numbers that have wells.',worked:'A square, symmetric matrix of 0s and 1s, with 1s on the diagonal.',trust:'A square, symmetric matrix of scores 0–10, with 10s on the diagonal.',roads:'A list of [warehouse, warehouse, hours] roads forming a tree.',hq:'The headquarters warehouse number.',target:'The destination warehouse number.',wires:'A list of undirected [bulb, bulb] pairs forming a tree.',headId:'The person who starts the phone chain.',caller:'One caller number per person. Use −1 for the head.',waitDays:'One waiting time per person.',deadline:'The last allowed arrival day, including that day.',graph:'One list of direct destinations per node. The graph must have no cycles.',checkpoint:'The coffee-cart node number, between 1 and graph.length − 2.',dials:'A list of strings, one string of distinct lowercase letters per dial.'
};
const kDescriptions = {'coins-on-level-k':'The target depth. The outer list has depth 1.','kth-song-in-playlist':'The song position, counting from 1.','perfect-size-campsites':'The exact number of land cells a campsite must have.','trusted-courier-networks':'The minimum trust score, from 1 through 10.'};
// Fixed format examples, independent of student answers and grading cases.
const formatExamples = {
 sky:[[0,1],[0,0]], park:[[0,1],[0,0]], marina:[['.','B'],['.','.']], yard:[['.','T'],['.','.']], cave:[['U','G'],['U','U']], worked:[[1,0],[0,1]], trust:[[10,4],[4,10]],
 items:[6,[2,9]], playlist:[6,[2,9]], vaults:[[1],[]], rooms:[[1],[]], graph:[[1],[2],[]],
 friendships:[[0,1],[1,2]], trails:[[0,1],[1,2]], tracks:[[0,1],[1,2]], paths:[[0,1],[1,2]], wires:[[0,1],[1,2]], roads:[[0,1,6],[1,2,4]],
 colors:['red','blue'], dials:['xy','mn'], ids:[2,5,9], bosses:[0,2,5], feeds:[0,2,5], caller:[-1,0,1], liters:[6,8,3], gold:[6,8], waitDays:[2,4,0], wells:[0,2], flooded:[1], startKeys:[0,1],
 n:3, k:3, row:0, col:0, start:0, source:0, headId:0, hq:0, destination:2, finish:2, target:2, quitId:5, shutId:5, checkpoint:1, deadline:3
};
function formatPlaceholder(name, value) {
 const plain = item => typeof item === 'string' ? item : Array.isArray(item) ? '[' + item.map(plain).join(', ') + ']' : String(item);
 if (['sky','park','marina','yard','cave','worked','trust','scores'].includes(name)) return value.map(row => row.join(', ')).join('\n');
 return Array.isArray(value) && !value.some(Array.isArray) ? value.join(', ') : plain(value);
}
function oldInputs(problem,names) {
 const seen=new Set(problem.tests.map(test=>JSON.stringify(test.args)));
 function visit(value){
  if(!value)return;
  if(typeof value==='string'){
   // Authored raw inputs use simple assignments, with comma/semicolon separators.
   if(names.every(name=>new RegExp('\\b'+name+'\\s*=').test(value))){
    try {const context={};vm.runInNewContext(value.replace(/`/g,''),context,{timeout:50});if(names.every(name=>context[name]!==undefined))seen.add(JSON.stringify(names.map(name=>context[name])));}catch{}
   }
  } else if(typeof value==='object') {
   if(names.every(name=>Object.prototype.hasOwnProperty.call(value,name)))seen.add(JSON.stringify(names.map(name=>value[name])));
   Object.values(value).forEach(visit);
  }
 }
 visit(problem.examples);
 for(const collection of previous)visit(collection.find(p=>p.id===problem.id));
 return seen;
}
let bugsCaught=0;
const output=sources.map(problem=>{
 const match=problem.solution.match(new RegExp('(?:const|let|var)\\s+'+problem.functionName+'\\s*=\\s*\\(([^)]*)\\)'));
 if(!match)throw Error('Cannot read parameters for '+problem.id);
 const names=match[1].split(',').map(name=>name.trim());
 const spec=step5.find(p=>p.id===problem.id);
 const exampleInput=Object.fromEntries(names.map(name=>[name,formatExamples[name === 'scores' ? 'trust' : name]]));
 engine.validate(problem.id, {...exampleInput, ...('scores' in exampleInput ? {trust:exampleInput.scores} : {})});
 const used=oldInputs(problem,names);
 const tests=(inputs[problem.id]||[]).map((test,index)=>{
  if(test.args.length!==names.length)throw Error(problem.id+': wrong argument count for '+test.label);
  const key=JSON.stringify(test.args);
  if(used.has(key))throw Error(problem.id+': reused input: '+test.label);
  used.add(key);
  const input=Object.fromEntries(names.map((name,i)=>[name,test.args[i]]));
  engine.validate(problem.id,input);
  const context={args:JSON.parse(key)};
  vm.runInNewContext(problem.solution+'\nresult = '+problem.functionName+'(...args);',context,{timeout:1000});
  const expected=JSON.parse(JSON.stringify(context.result));
  const oracle=engine.execute(problem.id,input,spec.correctRules);
  if(!engine.equal(problem.id,expected,oracle))throw Error(problem.id+': source and oracle disagree: '+test.label);
  return {id:problem.id+'-test-'+(index+1),label:test.label,args:test.args,expected};
 });
 if(tests.length<5||tests.length>10)throw Error(problem.id+': expected 5–10 tests');
 const missed=[];
 for(const challenge of spec.cases){
  const rules=Object.fromEntries(challenge.lines.map(line=>[line.key,line.selected]));
  if(tests.some(test=>{const input=Object.fromEntries(names.map((name,i)=>[name,test.args[i]]));return !engine.equal(problem.id,test.expected,engine.execute(problem.id,input,rules));}))bugsCaught++;
  else missed.push(challenge.misconception);
 }
 if(missed.length)throw Error(problem.id+': tests miss known bugs: '+missed.join(', '));
 return {id:problem.id,functionName:problem.functionName,parameters:names.map(name=>({name,label:name,example:exampleInput[name],placeholder:formatPlaceholder(name,exampleInput[name]),description:name==='k'?kDescriptions[problem.id]:descriptions[name],help:name==='k'?kDescriptions[problem.id]:descriptions[name]})),starterCode:'function '+problem.functionName+'('+names.join(', ')+') {\n  // Write your solution here.\n\n}\n',correctCode:problem.solution,tests,source:'../jonathan-study-site/data/'+problem.sourceFile};
});
if(output.length!==25||Object.keys(inputs).length!==25)throw Error('Step 6 must cover exactly 25 variants');
const generated=JSON.stringify(output,null,2)+'\n';
const destination=path.join(root,'step6-specs-variant.json');
if(process.argv.includes('--check')){if(!fs.existsSync(destination)||fs.readFileSync(destination,'utf8')!==generated)throw Error('Step 6 specs are stale. Run node scripts/step6-build.js.');}
else fs.writeFileSync(destination,generated);
console.log('Built Step 6: '+output.length+' variants, '+output.reduce((n,p)=>n+p.tests.length,0)+' fresh tests, all '+bugsCaught+' Step 5 misconceptions caught.');
