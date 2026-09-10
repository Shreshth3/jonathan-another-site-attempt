const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const engine=require('./step5-engine');
const specs=require('../step5-specs-variant.json');
execFileSync(process.execPath,[path.join(__dirname,'step5-build.js'),'--check'],{stdio:'pipe'});
engine.setSpecs(specs);
const json=JSON.stringify;
let sourceChecks=0,challengeChecks=0,repairChecks=0;
for(const spec of specs){
 for(const test of spec.tests){engine.validate(spec.id,test.input);assert(engine.equal(spec.id,engine.execute(spec.id,test.input,spec.correctRules),test.expected),spec.id+': source oracle mismatch');sourceChecks++;}
 for(const challenge of spec.cases){
  const frozen=challenge.lines.map(line=>line.selected), repaired=challenge.lines.map(line=>spec.correctRules[line.key]);
  const bugRules=engine.getRules(challenge,frozen), correct=engine.execute(spec.id,challenge.witness,spec.correctRules), buggy=engine.execute(spec.id,challenge.witness,bugRules);
  const grade=selection=>engine.grade(spec.id,challenge.id,json(challenge.witness),json(correct),json(buggy),selection);
  assert(!engine.equal(spec.id,correct,buggy),challenge.id+': witness must expose bug');
  assert.equal(grade(repaired).ok,true,challenge.id+': valid complete solution rejected');
  assert.equal(grade(frozen).checks.repair,false,challenge.id+': unchanged bug accepted');
  assert.equal(engine.grade(spec.id,challenge.id,json(challenge.witness),'null','null',repaired).ok,false,challenge.id+': wrong predictions accepted');
  assert.equal(engine.grade(spec.id,challenge.id,'{','0','0',repaired).ok,false,challenge.id+': malformed JSON accepted');
  assert.equal(engine.grade(spec.id,challenge.id,'{}','0','0',repaired).ok,false,challenge.id+': absent input fields accepted');
  const same=spec.tests.find(test=>engine.equal(spec.id,test.expected,engine.execute(spec.id,test.input,bugRules)));
  if(same){const result=engine.grade(spec.id,challenge.id,json(same.input),json(same.expected),json(same.expected),repaired);assert.equal(result.checks.counterexample,false);assert.equal(result.ok,false);}
  challengeChecks++;
 }
 // Try every combination of the authored choices, including changing several lines.
 // Grading must execute these selections and reject any that fail a valid fixture.
 const challenge=spec.cases[0], selections=[];
 function combinations(index,selected){if(index===challenge.lines.length){selections.push(selected);return;}for(const option of challenge.lines[index].options)combinations(index+1,[...selected,option.id]);}
 combinations(0,[]);
 const correct=engine.execute(spec.id,challenge.witness,spec.correctRules), buggy=engine.execute(spec.id,challenge.witness,engine.getRules(challenge,challenge.lines.map(line=>line.selected)));
 for(const selection of selections){
  const rules=engine.getRules(challenge,selection), expected=spec.tests.every(test=>engine.equal(spec.id,engine.execute(spec.id,test.input,rules),test.expected));
  const result=engine.grade(spec.id,challenge.id,json(challenge.witness),json(correct),json(buggy),selection);
  assert.equal(result.checks.repair,expected,spec.id+': repair choices were not executed');repairChecks++;
 }
}
const invalid=[
 ['count-routes-to-summit',{graph:[[1],[0]]}],
 ['routes-past-the-coffee-cart',{graph:[[1],[2],[]],checkpoint:0}],
 ['gold-and-silver-lights',{n:3,wires:[[0,1],[1,0]]}],
 ['who-keeps-their-job',{ids:[1,2,3],bosses:[0,3,2],quitId:2}],
 ['counting-docked-boats',{marina:[['B','.'],['.','B']]}],
 ['longest-freight-train',{yard:[['T','T'],['T','.']]}],
 ['trusted-courier-networks',{trust:[[10,4],[3,10]],k:4}],
 ['coins-on-level-k',{items:[true],k:1}],
 ['dungeon-gold-run',{rooms:[[2],[]],gold:[2,3]}],
 ['one-color-metro-ride',{n:2,tracks:[[0,1]],colors:[],source:0,destination:1}]
];
for(const [id,input]of invalid)assert.throws(()=>engine.validate(id,input),undefined,id+': invalid domain accepted');
for(const [id,input,expected] of [['coins-on-level-k',{items:[],k:1},0],['kth-song-in-playlist',{playlist:[],k:1},-1]]) {engine.validate(id,input);assert.equal(engine.execute(id,input,specs.find(s=>s.id===id).correctRules),expected);}
const unordered=specs.find(spec=>spec.id==='runes-on-the-castle-door');
// Other problem fields must never replace this problem's validated input.
const extraFields = [
 ['kth-song-in-playlist',{playlist:[7],k:1,items:[999]},7],
 ['dungeon-gold-run',{rooms:[[]],gold:[7],startKeys:[],vaults:[[0]]},7],
 ['shut-the-garden-valve',{ids:[1,2],feeds:[0,1],liters:[4,9],shutId:1,bosses:[2,0],quitId:2},13],
 ['trusted-courier-networks',{trust:[[10,0],[0,10]],k:5,worked:[[1,1],[1,1]]},2]
];
for(const [id,input,expected] of extraFields){
 engine.validate(id,input);
 const spec=specs.find(s=>s.id===id);
 assert(engine.equal(id,engine.execute(id,input,spec.correctRules),expected),id+': unrelated fields changed the answer');
}
const largestTrust={trust:Array.from({length:100},()=>Array(100).fill(10)),k:10};
engine.validate('trusted-courier-networks',largestTrust);
assert.equal(engine.execute('trusted-courier-networks',largestTrust,specs.find(s=>s.id==='trusted-courier-networks').correctRules),1,'The largest allowed trust matrix must work');
assert(engine.equal(unordered.id,['ab','ba'],['ba','ab']),'Unordered rune output should accept reordered answers');
assert(!engine.equal(unordered.id,['ab','ba'],['ab','ab']),'Duplicate answers must not replace missing answers');
assert(engine.equal('routes-past-the-coffee-cart',[[0,1,3],[0,2,3]],[[0,2,3],[0,1,3]]),'Route-list ordering should not matter');
assert(!engine.equal('routes-past-the-coffee-cart',[[0,1,3]],[[3,1,0]]),'Node order within each route must matter');
assert(!engine.equal('who-keeps-their-job',[1,10],[10,1]),'Remaining employee IDs must be sorted');
console.log(`Step 5 execution passed: ${sourceChecks} oracle inputs, ${challengeChecks} challenges, ${repairChecks} repair combinations, ${invalid.length} invalid-domain checks.`);
