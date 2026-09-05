// Fresh Step 1 assessments, independently solved using the source reference and
// an executable, separately authored misconception. Never invent output offsets.
const fs=require('fs'),vm=require('vm'),path=require('path');
const {task:makeInput}=require('./author-original-new-structure');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
const sourceBox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../../jonathan-study-site/site/problems.js'),'utf8'),sourceBox);
const sources=new Map(sourceBox.window.PROBLEMS.map(p=>[p.id,p]));
const codeSpecs=new Map([...read('step4-specs-original.json'),...read('step4-specs-new.json')].map(p=>[p.id,p]));
function parse(id,text){
 if(id==='codewars-array-deep-count')return{arr:JSON.parse(text.slice(10,-1))};
 const tree=text.match(/^root level-order=(\[[^\n]+?\])(?:,\s*targetSum=([-+]?\d+))?/);
 if(tree){const values=JSON.parse(tree[1]),nodes=values.map(val=>val===null?null:{val,left:null,right:null});nodes.forEach((n,i)=>{if(n){n.left=nodes[2*i+1]||null;n.right=nodes[2*i+2]||null;}});return{root:nodes[0]||null,targetSum:Number(tree[2])};}
 const clean=text.replace(/\s+\([^)]*(?:=|fixed slots)[^)]*\)\s*$/,'').replace(/,\s*(?=[A-Za-z_$][\w$]*\s*=)/g,'; var ');
 const keys=[...clean.matchAll(/(?:^|; var )([A-Za-z_$][\w$]*)\s*=/g)].map(m=>m[1]),box={};
 vm.runInNewContext(`var ${clean}; result={${keys.join(',')}}`,box);
 const input=clone(box.result);
 if(id==='evaluate-boolean-binary-tree'){const nodes=input.values.map(val=>({val,left:null,right:null}));input.edges.forEach(([a,b])=>{if(!nodes[a].left)nodes[a].left=nodes[b];else nodes[a].right=nodes[b];});input.root=nodes[0];}
 if(id==='number-of-connected-components-in-an-undirected-graph')input.numNodes=input.n;
 if(id==='wheres-my-internet')input.cables=input.connections;
 if(id==='usaco-milk-factory')input.belts=input.edges;
 if(id==='usaco-fence-planning'){input.positions=input.cows;input.pairs=input.friendships;}
 if(id==='kattis-getting-gold')input.grid=input.dungeon;
 return input;
}
function parameters(code,name){const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return(code.match(new RegExp(`(?:function\\s+${esc}|(?:const|let|var)\\s+${esc}\\s*=)\\s*(?:function\\s*)?\\(([^)]*)\\)`))?.[1]||'').split(',').map(x=>x.trim()).filter(Boolean);}
function execute(code,name,args){const box={args:clone(args)};vm.runInNewContext(`${code}\n; result=${name}(...args);`,box,{timeout:1000});return clone(box.result);}
function correct(id,input){const source=sources.get(id);
 if(id==='flatten-nested-list-iterator'){const values=[];function walk(x){if(Array.isArray(x))x.forEach(walk);else values.push(x);}walk(input.nestedList);return values;}
 if(id==='nested-list-weight-sum-ii'){const leaves=[];function visit(a,d){for(const x of a)Array.isArray(x)?visit(x,d+1):leaves.push([x,d]);}visit(input.nestedList,1);const max=Math.max(0,...leaves.map(x=>x[1]));return leaves.reduce((s,[v,d])=>s+v*(max-d+1),0);}
 return execute(source.solution,source.functionName,parameters(source.solution,source.functionName).map(p=>input[p]));
}
function wrong(code,input){const m=code.match(/function\s+([\w$]+)\s*\(([^)]*)\)/);if(!m)return;const args=m[2].split(',').map(x=>x.trim());return execute(code,m[1],args.length===1&&args[0]==='input'?[input]:args.map(p=>input[p]));}
function resultShape(x){if(Array.isArray(x))return x.length?'array:'+resultShape(x[0]):'array';return typeof x;}
const behaviorOverrides={
 'fewest-hops':'The code chooses routes by the number of edges instead of total travel time.',
 'counts-nodes-minus-edges':'The code returns the number of nodes minus the number of edges, even when a component contains a cycle.',
 'rejects-any-dislike-chain':'The code rejects a person with two or more dislike neighbors, without checking whether two groups are still possible.',
 'must-fill-exact-jug':'The code accepts only targets equal to one jug’s capacity and ignores targets created by pouring or combining both jugs.',
 'starts-top-left-only':'The code tries only the top-left cell as the beginning of the word.',
 'children-without-kill':'The code collects descendants but leaves out the process chosen for termination.',
 'direct-hits-only':'The code counts only the starting bomb and its direct hits; it never follows another blast.',
 'starts-at-zero':'The code ignores the supplied source and starts at node 0.',
 'rejects-any-cycle':'The code rejects every cycle, including even cycles that allow two colors.',
 'one-pass-swaps':'The code uses each listed swap only once instead of allowing repeated swaps within a connected group.',
 'shortest-branch':'The code returns the fastest reporting branch instead of waiting for the slowest one.'
};
function cleanReason(c){
 let reason=behaviorOverrides[c.caseId]||c.graphProof.codeRule;
 if(c.id==='all-paths-from-source-to-target'&&c.caseId==='authored-deep-case')reason='The code skips a node already reached by another prefix, losing distinct routes that merge there.';
 if(c.id==='evaluate-division'&&c.caseId==='authored-deep-case')reason='The code copies each given ratio onto both directions instead of using its reciprocal in reverse.';
 if(c.id==='number-of-connected-components-in-an-undirected-graph'&&c.caseId==='authored-deep-case')reason='The code stores each undirected pair only in its written direction and scans starting nodes in ascending order.';
 if(c.id==='find-if-path-exists-in-graph'&&c.caseId==='authored-deep-case')reason='The code stores each undirected pair only in its written direction.';
 return reason.replace(/^The /,'the ').replace(/\.$/,'');
}

const failures=[],coverage=[];
for(const file of ['visual-lessons-original.json','visual-lessons-new.json']){
 const lessons=read(file);
 for(const p of lessons){
  const used=new Set(),usedBugs=new Set();
  for(const index of [3,4]){
   let selected;
   for(const seed of [index,...Array.from({length:10},(_,i)=>i).filter(i=>i!==index)]){
    const build=makeInput(p.id,seed%5,seed<5?1:2);if(used.has(build.input)||build.canvas.nodes.length>(p.id==='letter-combinations-of-a-phone-number'?13:9))continue;
    let input,expected;try{input=parse(p.id,build.input);expected=correct(p.id,input);}catch(error){failures.push(`${p.id}: solver ${error.message}`);break;}
    for(const c of codeSpecs.get(p.id).cases){
     if(usedBugs.has(c.caseId))continue;
     try{const actual=wrong(c.code,input);if(JSON.stringify(actual)===JSON.stringify(expected)||actual===undefined)continue;
      if(typeof actual!==typeof expected||Array.isArray(actual)!==Array.isArray(expected))continue;
      // A matrix mistake must preserve shape; a paths mistake must still return paths.
      if(Array.isArray(expected)&&expected.length&&Array.isArray(expected[0])&&(!Array.isArray(actual)||actual.some(x=>!Array.isArray(x))))continue;
      let repair;
      for(const otherSeed of Array.from({length:10},(_,i)=>i)) {
        const candidate=makeInput(p.id,otherSeed%5,otherSeed<5?1:2);
        if(candidate.input===build.input||used.has(candidate.input)||candidate.canvas.nodes.length>(p.id==='letter-combinations-of-a-phone-number'?13:9))continue;
        try {
          const data=parse(p.id,candidate.input),truth=correct(p.id,data),mistake=wrong(c.code,data);
          if(JSON.stringify(truth)===JSON.stringify(mistake)||typeof truth!==typeof mistake||Array.isArray(truth)!==Array.isArray(mistake))continue;
          repair={build:candidate,expected:truth,actual:mistake};break;
        } catch {}
      }
      if(!repair)continue;
      selected={build,expected,actual,c,repair};break;
     }catch{}
    }
    if(selected)break;
   }
   if(!selected){failures.push(`${p.id}/${index}: no fresh separating misconception`);continue;}
   const {build,expected,actual,c,repair}=selected;used.add(build.input);used.add(repair.build.input);usedBugs.add(c.caseId);
   const target=p.conceptTasks[index];
   target.input=build.input;target.prompt='What should the correct function return for this input?';
   target.choices=[{id:'correct',label:JSON.stringify(expected),feedback:`Correct. Applying the problem's graph rules gives ${JSON.stringify(expected)}.`,misconception:null},{id:'bug-output',label:JSON.stringify(actual),feedback:`This is the result when ${cleanReason(c)}. That rule gives ${JSON.stringify(actual)}; applying the stated rule gives ${JSON.stringify(expected)}.`,misconception:c.caseId}];
   target.correct='correct';target.why=target.choices[0].feedback;
   target.remedial={...target.remedial,input:repair.build.input,canvas:repair.build.canvas,
     prompt:'Draw this different input, then use the same rule to check your understanding.',
     decision:{prompt:'What should the correct function return?',correct:'correct',choices:[
       {id:'correct',label:JSON.stringify(repair.expected),feedback:`Correct. The stated rule returns ${JSON.stringify(repair.expected)}.`,misconception:null},
       {id:'bug-output',label:JSON.stringify(repair.actual),feedback:`This repeats the same mistake: ${cleanReason(c)}. That gives ${JSON.stringify(repair.actual)} instead of ${JSON.stringify(repair.expected)}.`,misconception:c.caseId}
     ]},why:`${cleanReason(c)} changes the result to ${JSON.stringify(repair.actual)}. The stated rule returns ${JSON.stringify(repair.expected)}.`};
   coverage.push({problem:p.id,task:target.id,bug:c.caseId,input:build.input,correct:expected,incorrect:actual});
  }
 }
 fs.writeFileSync(file,JSON.stringify(lessons,null,2)+'\n');
}
fs.writeFileSync('docs/original-new-fresh-checks.json',JSON.stringify(coverage,null,2)+'\n');
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exitCode=1;}
console.log(`Independently solved ${coverage.length}/100 fresh Step 1 output checks.`);
