// Final authoritative authoring pass for Astra's variant-content audit.
// Run after the older variant authoring scripts, before build-visual-data.js.
const fs = require('fs');
const clone = value => JSON.parse(JSON.stringify(value));
const read = name => JSON.parse(fs.readFileSync(name, 'utf8'));
const write = (name, value) => fs.writeFileSync(name, JSON.stringify(value, null, 2) + '\n');
const graph = (directed, labels, edges = []) => ({directed, nodes: labels.map(x => ({id:String(x),label:String(x)})), edges:edges.map(([a,b,label]) => ({from:String(a),to:String(b),...(label == null ? {} : {label:String(label)})}))});
const ids = n => Array.from({length:n},(_,i)=>i);
const adjacencyGraph = (a,directed=true,labels=ids(a.length)) => graph(directed, labels, a.flatMap((row,i)=>row.filter(j=>directed||i<j).map(j=>[labels[i],labels[j]])));
function gridGraph(rows, include, diagonal=false) {
  const labels=[],edges=[];
  rows.forEach((row,r)=>[...row].forEach((v,c)=>{if(include(v)){const a=`(${r},${c})`;labels.push(a); for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if((dr||dc)&&(diagonal||Math.abs(dr)+Math.abs(dc)===1)){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<rows.length&&nc>=0&&nc<rows[0].length&&include(rows[nr][nc])&&(nr<r||nr===r&&nc<c))edges.push([`(${nr},${nc})`,a]);}}}));
  return graph(false,labels,edges);
}
function nestedGraph(items) {
 const model=graph(true,['root=[]']);
 function visit(a,parent,path){a.forEach((v,i)=>{const key=`${path}[${i}]`, label=Array.isArray(v)?`${key}=[]`:`${key}=${v}`;model.nodes.push({id:label,label});model.edges.push({from:parent,to:label});if(Array.isArray(v))visit(v,label,key);});}
 visit(items,'root=[]','root');return model;
}
function runeGraph(dials) {
 const model=graph(true,['start']);
 function visit(prefix,i,parent){if(i===dials.length)return;for(const rune of dials[i])if(rune!==prefix.at(-1)){const next=prefix+rune;model.nodes.push({id:next,label:next});model.edges.push({from:parent,to:next});visit(next,i+1,next);}}
 visit('',0,'start');return model;
}
const label = value => typeof value==='string'?value:JSON.stringify(value);
function decision(prompt,answer,wrong,why,error,misconception='wrong-boundary') {
 return {prompt,correct:'correct',choices:[{id:'correct',label:label(answer),feedback:`Correct. ${why}`,misconception:null},{id:'bug',label:label(wrong),feedback:error,misconception}]};
}
function replaceTask(task,input,canvas,prompt,answer,wrong,why,error,misconception) {
 Object.assign(task,{input,canvas,decision:decision(prompt,answer,wrong,why,error,misconception),why});
}
function replaceConcept(task,input,prompt,answer,wrong,why,error,misconception) {
 const d=decision(prompt,answer,wrong,why,error,misconception);Object.assign(task,{input,...d,why});
}
function fixSpecs(specs) {
 const p=id=>specs.find(p=>p.id===id);
 const choice=(q,id)=>q.choices.find(c=>c.id===id);
 Object.assign(choice(p('counting-docked-boats').edgeQuestion,'straight-only'),{label:'Join horizontal boat neighbors only; never join vertical neighbors.',feedback:'A vertical boat also needs one edge between each pair of side-touching cells.',misconception:'horizontal-only'});
 const courier=choice(p('trusted-courier-networks').nodeQuestion,'trusted-offices');courier.label='Only offices with a qualifying trust score with another office.';
 for(const c of p('trusted-courier-networks').edgeQuestion.choices)if(c.id===p('trusted-courier-networks').edgeQuestion.correct)c.label='Connect different offices i and j when trust[i][j] >= k. Do not draw self-links.';
 const coins=p('coins-on-level-k').edgeQuestion;for(const c of coins.choices)if(/deepest box/.test(c.label)) {c.label=c.label.replace('deepest box','outermost box');c.feedback='That skips the immediate container and makes a deep coin appear too shallow.';}
 const valve=p('shut-the-garden-valve').edgeQuestion;valve.prompt='When feeds[i] is another sprinkler ID (not 0), which arrow belongs in the graph?';
 for(const id of ['who-keeps-their-job','dungeon-gold-run','routes-past-the-coffee-cart'])for(const q of p(id).pictureQuestions)q.prompt=id==='who-keeps-their-job'?'Which employee IDs remain, in increasing numeric order?':id==='dungeon-gold-run'?'How much gold can be collected starting in room 0?':'Which complete routes from 0 to the final intersection visit the checkpoint?';
}
function fixLessons(lessons,specs) {
 const p=id=>lessons.find(p=>p.id===id), s=id=>specs.find(p=>p.id===id);
 const c=(id,index)=>p(id).conceptTasks[index], r=(id,index)=>c(id,index).remedial, b=(id,index)=>p(id).buildTasks[index];
 // Remove the generic third option added by apply-site-audit-fixes. Two honest
 // alternatives are better than duplicate booleans, invented songs, or -1 counts.
 for(const lesson of lessons)for(const t of [...lesson.buildTasks,...lesson.conceptTasks.map(x=>x.remedial)])t.decision.choices=t.decision.choices.filter(x=>x.id!=='not-enough-information');
 for(const id of ['counting-docked-boats','trusted-courier-networks','coins-on-level-k','shut-the-garden-valve']) {
   c(id,2).prompt=s(id).edgeQuestion.prompt;c(id,2).choices=clone(s(id).edgeQuestion.choices);c(id,2).correct=s(id).edgeQuestion.correct;
 }
 c('trusted-courier-networks',1).choices=clone(s('trusted-courier-networks').nodeQuestion.choices);
 for(const id of ['who-keeps-their-job','dungeon-gold-run','routes-past-the-coffee-cart'])for(const i of [3,4])c(id,i).prompt=s(id).pictureQuestions[i-3].prompt;
 // Restore usable raw input wherever a previous pass extracted a variable name.
 for(const lesson of lessons)for(const t of lesson.conceptTasks)if(!/=/.test(t.input)&&!/^\s*\[/.test(t.input))t.input=lesson.buildTasks[2].input;
 c('counting-docked-boats',4).input='marina=["B.BB"]';
 c('runes-on-the-castle-door',3).input='dials=["ab","ab","a"]';c('runes-on-the-castle-door',4).input='dials=["ab","c","c"]';
 // Shelf: distinct count patterns and a new tie example.
 replaceTask(b('busiest-shelf-level',2),'items=[8,9,[[4]]]',nestedGraph([8,9,[[4]]]),'Which depth contains the most integer items?',1,3,'Depth 1 has two items; depth 3 has one.','This picks the deepest occupied level instead of the level with the most items.','deepest-not-busiest');
 c('busiest-shelf-level',4).prompt='Which depth is returned?';
 // Explain exact arithmetic instead of pretending every numeric perturbation is a bug.
 const coinCases=[[[1,[2,3],[[4]]],1,1,10],[[[],1,[2,[]]],2,2,3],[[[3,2],5,[[4]]],3,4,14],[[7],1,7,0],[[1,[4,[6]]],2,4,11],[[[-3,3],[0]],2,0,3],[[[],[5]],2,5,0],[[[1],2,[3]],2,4,6],[[0,[0,[9]]],3,9,0]];
 const coinTasks=[...p('coins-on-level-k').buildTasks,...p('coins-on-level-k').conceptTasks.map(t=>t.remedial)];
 coinCases.forEach(([items,k,truth,wrong],i)=>{const sumAll=items.flat(Infinity).reduce((a,v)=>a+v,0);const error=wrong===sumAll&&sumAll!==truth?'This adds coins from every level instead of only level k.':i===5?'This drops the negative coin -3 and counts only the positive 3.':'This treats the outer array as level 1, shifting every coin one level too deep.';replaceTask(coinTasks[i],`items=${JSON.stringify(items)}, k=${k}`,nestedGraph(items),'What is the sum at exactly level k?',truth,wrong,`Only integer coins at level ${k} contribute; their sum is ${truth}.`,error);});
 // Boats: retain whole multi-cell boats in repairs.
 for(const [i,rows,truth,wrong] of [[1,['BB..','....','...B'],2,3],[4,['.BB.','....','B...'],2,3]])replaceTask(r('counting-docked-boats',i),`marina=${JSON.stringify(rows)}`,gridGraph(rows,x=>x==='B'),'How many boats touch a border?',truth,wrong,'Each side-connected boat counts once. Both boats touch a border.','This counts individual B cells instead of whole boats.','count-cells');
 for(const t of [...p('counting-docked-boats').buildTasks,...p('counting-docked-boats').conceptTasks.map(x=>x.remedial)])for(const option of t.decision.choices)if(/either|or overlooks|count-cells-or/.test(option.feedback+' '+option.misconception)){option.feedback='This counts individual B cells instead of one count per border-touching boat.';option.misconception='count-cells';}
 // Coffee: full returned route lists, valid interior checkpoints, and dead ends.
 const coffeeCases=[[[[1,2],[3],[3],[4],[]],1,[[0,1,3,4]],[[0,1,3]]],[[[1],[2,3],[4],[4],[]],1,[[0,1,2,4],[0,1,3,4]],[[0,1,2,4]]],[[[1,2],[4],[3],[],[]],1,[[0,1,4]],[[0,1,4],[0,2,3]]],[[[1,2],[],[],[]],1,[],[[0,1]]],[[[1,2],[4],[4],[],[]],1,[[0,1,4]],[[0,1,4],[0,2,4]]],[[[1,2],[3],[3],[]],2,[[0,2,3]],[[0,1,3]]],[[[1],[2],[],[4],[]],1,[],[[0,1,2]]],[[[2,1],[3],[3],[4],[]],1,[[0,1,3,4]],[[0,1]]],[[[1,3],[2],[],[4],[]],2,[],[[0,1,2]]]];
 const coffeeTasks=[...p('routes-past-the-coffee-cart').buildTasks,...p('routes-past-the-coffee-cart').conceptTasks.map(t=>t.remedial)];
 coffeeCases.forEach(([a,k,truth,wrong],i)=>replaceTask(coffeeTasks[i],`graph=${JSON.stringify(a)}, checkpoint=${k}`,adjacencyGraph(a),'Which complete routes from 0 to the last intersection visit the checkpoint?',truth,wrong,truth.length?`Keep complete routes ending at ${a.length-1} that contain ${k}.`:`No complete route to ${a.length-1} visits checkpoint ${k}.`,i===1?'This returns after one successful branch and misses the other complete route.':i===4?'The route through 2 never visits checkpoint 1.':i===5?'This returns the route through 1, which skips checkpoint 2.':'A route must reach the customer and visit the checkpoint; a cart-only prefix or another dead end is not a complete delivery.'));
 c('routes-past-the-coffee-cart',2).input='graph=[[1,2],[3],[3],[]], checkpoint=1';
 // Well counting: the supplied singleton needs zero; skipping it is not counting villages.
 const well=b('villages-without-wells',3);well.decision.choices.find(x=>x.id!==well.decision.correct).feedback='This adds a new well to village 0 even though village 0 already has one.';
 replaceTask(r('villages-without-wells',2),'n=4, paths=[[0,1],[1,2]], wells=[2]',graph(false,ids(4),[[0,1],[1,2]]),'How many new wells are needed?',1,2,'The road chain shares the well at 2; isolated village 3 needs one.','This stops at direct neighbors and fails to carry water access through village 1 to village 0.','direct-only-water');
 for(const lessonId of ['villages-without-wells'])for(const task of [...p(lessonId).buildTasks,...p(lessonId).conceptTasks,...p(lessonId).conceptTasks.map(t=>t.remedial)])task.input=task.input.replace(/roads=/g,'paths=');
 // Gas: predict the full reveal and preserve a numbered boundary.
 const gas=(target,rows,row,col,truth,wrong,error)=>replaceTask(target,`cave=${JSON.stringify(rows)}, row=${row}, col=${col}`,gridGraph(rows,()=>true),'What complete cave grid is returned?',truth,wrong,'Safe cells spread only through side neighbors. Numbered cells stop spreading; untouched cells keep their original value.',error);
 gas(b('gas-pocket-survey',2),['UUU','UUG'],0,0,[['S','S','1'],['S','1','G']],[['S','U','U'],['U','U','G']],'This marks only the drill cell and never follows its safe neighbors.');
 gas(r('gas-pocket-survey',2),['UU','UU','UU'],2,0,[['S','S'],['S','S'],['S','S']],[['U','U'],['U','U'],['S','S']],'This follows horizontal edges only and leaves the upper rows unrevealed.');
 gas(r('gas-pocket-survey',3),['GUG','UUU'],0,1,[['G','2','G'],['U','U','U']],[['G','1','G'],['U','U','U']],'There are two side-adjacent gas cells, so counting only one gives the wrong digit.');
 c('gas-pocket-survey',4).input='cave=["UUU","UGU","UUU"], row=0, col=2';c('gas-pocket-survey',4).prompt='What does the drilled cell (0,2) become?';
 // Lights: silver count gives 2, not omitted-start count 3.
 replaceConcept(c('gold-and-silver-lights',4),'n=6, wires=[[0,1],[1,2],[1,4],[0,3],[3,5]], goldStart=0','How many bulbs are gold?',4,2,'Gold bulbs are 0, 2, 4, and 5.','This counts silver bulbs 1 and 3 instead of the gold bulbs.','count-silver');
 const lightCheck=c('gold-and-silver-lights',4);for(const o of lightCheck.choices)if(o.label==='2'){o.feedback='This counts the silver bulbs 1 and 3 instead of the four gold bulbs 0, 2, 4, and 5.';o.misconception='count-silver';}
 for(const i of [3,4])c('gold-and-silver-lights',i).prompt='How many bulbs are gold?';
 const light=(t,n,e,answer,wrong,why,error)=>replaceTask(t,`n=${n}, wires=${JSON.stringify(e)}, goldStart=0`,graph(false,ids(n),e),'How many bulbs are gold?',answer,wrong,why,error);
 light(b('gold-and-silver-lights',1),4,[[0,1],[1,2],[2,3]],2,4,'Bulbs 0 and 2 are gold.','This keeps the same color across each wire and marks every bulb gold.');
 light(r('gold-and-silver-lights',4),6,[[0,1],[1,2],[2,3],[3,4],[3,5]],4,2,'Gold bulbs are 0, 2, 4, and 5.','This counts the two silver bulbs 1 and 3.');
 // Dungeon: zero-valued rooms still unlock keys; collect each room only once.
 const dungeon=(i,a,g,truth,wrong,why,error)=>replaceTask(r('dungeon-gold-run',i),`rooms=${JSON.stringify(a)}, gold=${JSON.stringify(g)}`,adjacencyGraph(a,true,g.map((v,j)=>`${j}:${v}g`)),'How much gold is collected from room 0?',truth,wrong,why,error);
 dungeon(1,[[1],[2],[],[]],[4,0,7,20],11,4,'Room 1 adds no gold but contains the key to room 2. Locked room 3 still needs a node.','Skipping zero-gold room 1 also loses the key to room 2.');
 dungeon(3,[[1,2],[3],[3],[],[]],[2,3,5,7,30],17,24,'Rooms 0, 1, 2, and 3 open. Collect room 3 once; room 4 stays locked.','This adds room 3 twice because two branches contain its key.');
 dungeon(4,[[],[2],[1],[]],[9,4,6,12],9,31,'Only room 0 can open. It contains no key to the other rooms.','This totals gold in locked rooms as though their keys were already available.');
 c('dungeon-gold-run',2).why='An arrow i→k means room i contains a key that unlocks room k. It describes key access, not a one-way physical corridor.';
 for(const option of c('dungeon-gold-run',2).choices)if(option.id===c('dungeon-gold-run',2).correct)option.feedback='Correct. The arrow records which key becomes available; it does not forbid returning to an already opened room.';
 // Flood: keep the exact blocked/detour feature in each repair.
 const flood=(i,n,e,f,start,finish,truth,why,error)=>{const model=graph(false,ids(n),e);for(const node of model.nodes)if(f.includes(Number(node.id)))node.color='blue';replaceTask(r('flooded-campsite-trails',i),`n=${n}, trails=${JSON.stringify(e)}, flooded=${JSON.stringify(f)}, start=${start}, finish=${finish}`,model,'Can the hiker reach the finish using only dry campsites?',truth,!truth,why,error);};
 flood(1,5,[[0,1],[1,4],[0,2],[2,3],[3,4]],[1],0,4,true,'The dry detour 0–2–3–4 reaches the finish. Flooded campsite 1 remains a node.','Removing every campsite next to flooded 1 wrongly removes dry start 0 and finish 4.');
 flood(2,4,[[1,0],[1,2],[2,3]],[0],3,1,true,'The two-way dry route 3–2–1 works. The flooded spur to 0 is not needed.','This treats each written pair as a one-way arrow and cannot travel backward from 3.');
 flood(3,6,[[0,1],[1,2],[0,3],[3,4],[4,5]],[2],0,5,true,'The first dry branch stops before flooded 2; the other dry branch reaches 5.','Returning after the failed branch 0–1 misses the successful branch 0–3–4–5.');
 flood(4,4,[[0,1],[1,3],[0,2],[2,3]],[3],0,3,false,'Both paths end at flooded campsite 3, which cannot be entered.','Checking the destination before checking flooding wrongly accepts the blocked finish.');
 // Train: total and maximum must differ; include a truly empty yard.
 replaceTask(r('longest-freight-train',3),'yard=["TT..","....",".TTT"]',gridGraph(['TT..','....','.TTT'],x=>x==='T'),'What is the longest train length?',3,5,'The trains have lengths 2 and 3; keep the maximum 3.','This adds cars from two separate trains.','sum-components');
 replaceTask(r('longest-freight-train',4),'yard=["....","...."]',gridGraph(['....','....'],x=>x==='T'),'What is the longest train length?',0,1,'An empty yard has no train, so its longest length is 0.','Initializing the maximum to 1 invents a train in an empty yard.','empty-max-one');
 c('longest-freight-train',1).input='yard=["TT.","...","..T"]';c('longest-freight-train',2).input='yard=["TT",".."]';
 // Rumor: backward pairs, an unrelated larger group, and the starter itself.
 const rumor=(i,n,e,start,truth,wrong,why,error)=>replaceTask(r('office-rumor-reach',i),`n=${n}, friendships=${JSON.stringify(e)}, start=${start}`,graph(false,ids(n),e),'Including the starter, how many employees hear?',truth,wrong,why,error);
 rumor(2,4,[[0,1],[1,2]],2,3,1,'Friendships work both ways, so 2 reaches 1 and then 0.','This follows only the listed endpoint order and gets stuck at employee 2.');
 rumor(3,7,[[0,1],[1,2],[2,3],[4,5]],5,2,4,'Only the starter’s pair {4,5} hears.','This counts the larger component at employee 0 rather than the starter’s component.');
 rumor(4,4,[[0,1],[1,2]],1,3,2,'Employees 0, 1, and 2 hear, including starter 1.','This excludes the person who already knows and starts the rumor.');
 // Campsites: repairs retain mismatched sizes, diagonals, and multi-cell counts.
 const camp=(i,rows,k,answer,wrong,why,error,prompt='How many campsites have exactly k grass cells?')=>replaceTask(r('perfect-size-campsites',i),`park=${JSON.stringify(rows)}, k=${k}`,gridGraph(rows,x=>x===1),prompt,answer,wrong,why,error);
 camp(1,[[1,1,0],[0,0,0],[1,1,1]],2,5,2,'All five grass cells need nodes, including the size-3 component that will not count.','Filtering out nonmatching campsites before drawing loses three real grass cells.','How many grass-cell nodes are needed?');
 camp(2,[[1,0,0],[0,1,0],[0,0,1]],1,3,0,'Corner-touching cells are three separate size-1 campsites.','Joining diagonals merges them into a size-3 group, leaving no size-1 campsite.');
 camp(3,[[1,1,0,1],[0,0,0,0],[1,1,1,0]],2,1,3,'Only the size-2 pair counts; the singleton and size-3 patch do not.','This counts every component without checking its size.');
 camp(4,[[1,1,0],[0,0,0],[0,1,1]],2,2,4,'Two distinct size-2 campsites count as two campsites.','This adds the four grass cells rather than the two matching campsites.');
 // Summit: intermediate merges and real non-summit dead ends.
 c('count-routes-to-summit',1).input='graph=[[1],[3],[],[]]';c('count-routes-to-summit',2).input='graph=[[1],[2],[3],[]]';
 const summit=(i,a,truth,wrong,why,error,prompt='How many routes run from camp 0 to the final camp?')=>replaceTask(r('count-routes-to-summit',i),`graph=${JSON.stringify(a)}`,adjacencyGraph(a),prompt,truth,wrong,why,error);
 summit(1,[[1],[3],[],[]],4,3,'Every listed camp gets a node: intermediate camp 1 and unused camp 2 both remain.','Omitting an unused camp loses camp 2; it exists even though no complete route uses it.','How many camp nodes belong in the graph?');
 summit(2,[[1],[2],[3],[4],[]],1,4,'The input contains one route, following all four listed arrows.','Adding direct arrows from 0 to reachable camps 2, 3, and 4 invents three shortcut routes.');
 summit(3,[[1,2],[3],[3],[4],[]],2,1,'Both prefixes reach shared camp 3 and then continue to summit 4.','A global visited set suppresses the second valid route through camp 3.');
 summit(4,[[1,2],[4],[3],[],[]],1,2,'Only 0→1→4 ends at the summit. Camp 3 is a dead end.','Counting every leaf wrongly includes route 0→2→3.');
 // Runes: the repair itself must contain a legal nonadjacent repeat.
 c('runes-on-the-castle-door',2).input='dials=["a","b","ab"]';
 for(const [i,dials,truth,wrong] of [[2,['c','d','c'],['cdc'],[]],[3,['x','y','xy'],['xyx'],[]]])replaceTask(r('runes-on-the-castle-door',i),`dials=${JSON.stringify(dials)}`,runeGraph(dials),'Which complete rune codes are valid?',truth,wrong,'Only adjacent equal runes are forbidden; a rune can return after a different rune.','Banning every repeated rune removes the legal nonadjacent repeat.','global-repeat-ban');
 // Phone: late people remain nodes and zero-wait descendants can hear on day 0.
 const phoneModel=(caller,wait)=>graph(true,ids(caller.length),caller.flatMap((a,i)=>a<0?[]:[[a,i,wait[a]]]));
 replaceTask(r('save-the-date-phone-chain',1),'n=4, headId=0, caller=[-1,0,1,0], waitDays=[1,4,0,0], deadline=2',phoneModel([-1,0,1,0],[1,4,0,0]),'How many person nodes belong in the graph?',4,3,'All four people exist. Person 2 hears late on day 5 but still needs a node.','This leaves out late person 2 before the time calculation.');
 replaceConcept(c('save-the-date-phone-chain',4),'n=5, headId=1, caller=[1,-1,0,1,3], waitDays=[0,0,0,2,0], deadline=0','How many people know by the deadline?',4,1,'People 1, 0, 2, and 3 hear on day 0; person 4 hears on day 2.','This counts only the head and ignores zero-wait calls.');
 r('save-the-date-phone-chain',2).decision.choices.find(o=>o.id!==r('save-the-date-phone-chain',2).decision.correct).feedback='This uses listener 0’s wait of 0 instead of caller 1’s wait of 3 on the arrow 1→0.';
 // Sprinklers: skip feeder 0 and keep ancestors outside the stopped subtree.
 c('shut-the-garden-valve',1).input='ids=[1,2,3,4], feeds=[0,1,1,2], liters=[5,10,20,40], shutId=2';
 const valve=(i,input,idList,e,answer,wrong,why,error)=>replaceTask(r('shut-the-garden-valve',i),input,graph(true,idList,e),'How much flow stops?',answer,wrong,why,error);
 valve(1,'ids=[12,4,9], feeds=[0,12,4], liters=[8,3,6], shutId=4',['12:8','4:3','9:6'],[['12:8','4:3'],['4:3','9:6']],9,6,'Sprinklers 4 and 9 stop; upstream sprinkler 12 stays on.','This omits the selected sprinkler’s own 3 liters.');
 valve(4,'ids=[8,2,7,3], feeds=[0,8,8,2], liters=[20,4,9,6], shutId=2',['8:20','2:4','7:9','3:6'],[['8:20','2:4'],['8:20','7:9'],['2:4','3:6']],10,39,'Only sprinklers 2 and 3 stop, for 4+6=10.','Treating the feeder links as two-way reaches ancestor 8 and sibling 7, wrongly adding their 29 liters.');
 // Study groups: fresh sizes and two components in the sum-vs-max repair.
 const matrix=(n,e,score=1)=>{const a=ids(n).map(i=>ids(n).map(j=>i===j?(score===1?1:10):0));for(const [u,v]of e)a[u][v]=a[v][u]=score;return a;};
 const groupCheck=(i,n,e,truth,wrong,why,error)=>replaceConcept(c('biggest-study-group',i),`worked=${JSON.stringify(matrix(n,e))}`,'What is the largest study-group size?',truth,wrong,why,error);
 groupCheck(3,6,[[0,1],[1,2],[2,3],[3,4]],5,6,'The five-student chain is larger than isolated student 5.','This adds the isolated student to a group they cannot reach.');
 groupCheck(4,6,[[0,1],[1,2],[3,4],[4,5]],3,6,'There are two separate size-3 groups; the maximum is 3.','This sums disconnected groups instead of choosing the largest.');
 replaceTask(r('biggest-study-group',4),`worked=${JSON.stringify(matrix(6,[[0,1],[1,2],[2,3],[4,5]]))}`,graph(false,ids(6),[[0,1],[1,2],[2,3],[4,5]]),'What is the largest study-group size?',4,6,'The two component sizes are 4 and 2.','This adds both component sizes rather than taking the maximum.');
 b('biggest-study-group',2).decision.choices.find(o=>o.id!==b('biggest-study-group',2).decision.correct).feedback='Starting at endpoint student 0, this counts only 0 and direct neighbor 1, then stops before students 2 and 3.';
 // Playlist: no fictitious folder names, fresh ordering tests, real empty folders.
 b('kth-song-in-playlist',2).decision.choices.find(o=>o.id!==b('kth-song-in-playlist',2).decision.correct).feedback='Opening only one folder layer gives songs [1,3], so the second song is wrongly 3. Full recursive playback is [1,2,3].';
 c('kth-song-in-playlist',2).input='playlist=[[4,[]],7], k=2';
 const playlist=(i,a,k,truth,wrong,why,error)=>replaceTask(r('kth-song-in-playlist',i),`playlist=${JSON.stringify(a)}, k=${k}`,nestedGraph(a),'Which song is played at position k?',truth,wrong,why,error);
 playlist(0,[8,[3,[6,2]],[],5],4,2,5,'Playback is 8,3,6,2,5, so the fourth song is 2.','Opening only one folder layer skips 6 and 2 and reaches 5 too early.');
 playlist(2,[[4,[]],7],2,7,-1,'The empty folder still has its own containment edge but contributes no song.','Counting the empty folder as a song slot leaves no actual song at this guessed slot.');
 // Grade the graph detail explicitly, without a misleading order prediction.
 replaceTask(r('kth-song-in-playlist',2),'playlist=[[4,[]],7], k=2',nestedGraph([[4,[]],7]),'How many direct containment edges belong in the tree?',4,3,'The outer array has two children; its first folder has a song and an empty folder.','Dropping the empty folder also drops its required parent-child edge.');
 playlist(3,[[11,12],20],1,11,20,'Finish the first folder before playing the later top-level song 20.','Playing top-level songs first starts with 20.');
 playlist(4,[[3,[8]],6],2,8,3,'Playback is 3,8,6, making the second song 8.','Playing top-level song 6 first produces 6,3,8, whose second song is 3.');
 for(const t of p('kth-song-in-playlist').buildTasks){t.why=t.why.replace(/folderA/g,'root[0]').replace(/folderB/g,'root[1]');for(const o of t.decision.choices)o.feedback=o.feedback.replace(/folderA/g,'root[0]').replace(/folderB/g,'root[1]');}
 // Pile: a real zero-sum occupied layer and actual empty containers.
 const pileBug=b('top-of-the-pile',0).decision.choices.find(o=>o.id!==b('top-of-the-pile',0).decision.correct);pileBug.label='26';pileBug.feedback='This adds every integer: 5+6+7+8=26, instead of only the shallowest occupied level’s 7.';
 replaceTask(r('top-of-the-pile',1),'items=[[],[3],[[7]]]',nestedGraph([[],[3],[[7]]]),'What is the sum at the shallowest occupied level?',3,7,'The empty folder is still a node. Integer 3 is at depth 2, before integer 7 at depth 3.','Skipping the shallow integer while searching for the deepest value returns 7.');
 replaceTask(r('top-of-the-pile',4),'items=[[8,-8],[[5]]]',nestedGraph([[8,-8],[[5]]]),'What is the sum at the shallowest occupied level?',0,5,'Depth 2 contains 8 and -8. Their zero sum still counts as an occupied level.','Testing sum !== 0 skips the occupied zero-sum layer and returns the deeper 5.');
 // Couriers: valid diagonals, threshold equality and isolated offices.
 for(const t of p('trusted-courier-networks').conceptTasks){const match=t.input.match(/trust\s*=\s*(\[.*\])/);if(match){try{const a=JSON.parse(match[1]);a.forEach((row,i)=>row[i]=10);t.input=t.input.replace(match[1],JSON.stringify(a));}catch{}}}
 const courier=(target,n,e,k,truth,wrong,why,error)=>replaceTask(target,`trust=${JSON.stringify(matrix(n,e,k))}, k=${k}`,graph(false,ids(n),e),'How many trusted networks are there?',truth,wrong,why,error);
 courier(b('trusted-courier-networks',1),4,[[0,1],[1,2],[2,3]],5,1,4,'All three score-5 links qualify when k=5.','Using score > k removes all three equality links.');
 courier(r('trusted-courier-networks',2),3,[[0,1],[1,2]],4,1,3,'Both score-4 edges qualify at k=4 and form one chain.','A strict > comparison removes both equality edges.');
 courier(r('trusted-courier-networks',3),5,[[0,1],[2,3]],6,3,2,'The two pairs and isolated office 4 are three networks.','This drops isolated office 4 even though it is a real office.');
 courier(r('trusted-courier-networks',4),4,[[0,1],[0,2],[0,3]],8,1,4,'The three score-8 links qualify at k=8.','Using > instead of >= incorrectly removes the whole star.');
 c('trusted-courier-networks',2).input='trust=[[10,6,0],[6,10,5],[0,5,10]], k=6';
 // Vaults: fresh overlapping starts and a genuine cycle; empty keyring boundary.
 replaceConcept(c('museum-vault-keyring',3),'vaults=[[2],[2],[],[4],[]], startKeys=[0,1]','How many distinct vaults can open?',3,4,'The two starting vaults share vault 2. It counts only once; vaults 3 and 4 stay sealed.','Adding each starting search separately counts shared vault 2 twice.');
 replaceConcept(c('museum-vault-keyring',4),'vaults=[[1],[0,2],[],[]], startKeys=[]','How many distinct vaults can open?',0,3,'An empty keyring opens no vault, even though the map contains keys.','Starting a search at vault 0 invents a key that was never supplied.');
 replaceTask(r('museum-vault-keyring',3),'vaults=[[3],[2],[3],[],[]], startKeys=[0,1]',adjacencyGraph([[3],[2],[3],[],[]]),'How many distinct vaults open?',4,5,'Vaults 0,1,2,3 open; shared vault 3 counts once and vault 4 stays sealed.','Adding independent start counts counts vault 3 twice.');
 replaceTask(r('museum-vault-keyring',4),'vaults=[[2],[],[3],[0],[]], startKeys=[3]',adjacencyGraph([[2],[],[3],[0],[]]),'How many distinct vaults open?',3,5,'The cycle opens exactly vaults 3,0,2 once each. Vaults 1 and 4 remain sealed.','A cycle never grants keys to unrelated vaults 1 or 4.');
 // Fresh raw inputs and exact, single-cause answer feedback.
 replaceConcept(c('villages-without-wells',3),'n=7, paths=[[0,1],[2,3],[3,4],[5,6]], wells=[4,6]','How many new wells are needed?',1,5,'Only villages 0 and 1 are in a component without a well. One new well supplies both.','This gives one well to each village without its own well, even when a path already supplies it.','count-unsupplied-individuals');
 replaceConcept(c('villages-without-wells',4),'n=6, paths=[[0,1],[1,2],[2,0],[3,4]], wells=[]','How many new wells are needed?',3,6,'The cycle, the pair, and isolated village 5 each need one well.','This buys a separate well for every village instead of sharing along paths.','one-per-village');
 replaceConcept(c('gas-pocket-survey',3),'cave=["UGU","GUG"], row=0, col=0','What does the drilled cell become?',2,1,'The gas directly right and directly below gives the digit 2.','This stops after finding the first gas neighbor. Both side neighbors count.','stop-after-first');
 replaceTask(r('routes-past-the-coffee-cart',4),'graph=[[1,3],[2],[],[4],[5],[]], checkpoint=2',adjacencyGraph([[1,3],[2],[],[4],[5],[]]),'Which complete routes visit the checkpoint?',[],[[0,1,2]],'The checkpoint branch ends before customer 5. The route to 5 misses checkpoint 2.','This returns an unfinished checkpoint prefix instead of a complete route.','accept-incomplete-route');
 replaceTask(b('office-rumor-reach',3),'n=1, friendships=[], start=0',graph(false,[0]),'How many employees hear the rumor?',1,0,'The starter already knows the rumor, even without any friendships.','This forgets to count the starter.','omit-start');
 const songRepair=r('kth-song-in-playlist',0);for(const option of songRepair.decision.choices)if(option.id!==songRepair.decision.correct){option.label='-1';option.feedback='Opening just one folder layer gives [8,3,5]. There is no fourth song in that incorrect list.';option.misconception='flatten-one-layer';}
 replaceTask(r('count-routes-to-summit',1),'graph=[[2],[],[4],[],[]]',adjacencyGraph([[2],[],[4],[],[]]),'How many camp nodes belong in the graph?',5,3,'All five camps are input items. Camps 1 and 3 still exist even though the summit route does not use them.','This keeps only the three camps on route 0→2→4.','omit-unused-camps');
 replaceTask(r('count-routes-to-summit',4),'graph=[[1,2],[5],[3],[4],[],[]]',adjacencyGraph([[1,2],[5],[3],[4],[],[]]),'How many routes reach the final camp?',1,2,'Only 0→1→5 reaches the summit. The longer branch ends at camp 4.','This counts the non-summit dead end as another successful route.','count-every-leaf');
 replaceTask(r('kth-song-in-playlist',2),'playlist=[[9,[]],4,[]], k=2',nestedGraph([[9,[]],4,[]]),'How many direct containment edges belong in the tree?',5,3,'The outer folder has three children. Its first folder has two children, including an empty folder.','This deletes both empty folders and their two containment edges.','omit-empty-folders');
 const roadRepair=r('package-to-the-outpost',2);for(const option of roadRepair.decision.choices)if(option.id!==roadRepair.decision.correct){option.label='4';option.feedback='This reuses roads[0][2], which is 2, for both segments: 2+2=4. Each road keeps its own weight.';option.misconception='reuse-first-edge-weight';}
 // Final blind review: preserve the exact missed rule in each fresh repair.
 c('villages-without-wells',1).input='n=8, paths=[[0,1],[2,3],[3,4],[5,6]], wells=[4,6]';
 c('villages-without-wells',2).input='n=5, paths=[[0,2],[2,4]], wells=[4]';
 c('dungeon-gold-run',1).input='rooms=[[1,3],[2],[1],[],[5],[4]], gold=[5,0,1,8,50,50]';
 c('coins-on-level-k',1).input='items=[[3,-2],5,[[4]]], k=2';
 c('longest-freight-train',2).input='yard=["T..","T..","...","..T"]';
 c('perfect-size-campsites',1).input='park=[[1,1,0],[0,0,1]], k=1';
 c('one-color-metro-ride',1).input='n=3, tracks=[[0,1],[1,2]], colors=["red","blue"], source=0, destination=2';
 c('flooded-campsite-trails',2).input='n=4, trails=[[0,1],[1,2],[2,3]], flooded=[0], start=3, finish=1';
 c('office-rumor-reach',2).input='n=5, friendships=[[0,3],[3,1]], start=1';
 c('package-to-the-outpost',2).input='n=4, roads=[[0,1,3],[1,2,7],[1,3,2]], hq=2, target=0';
 const phoneWrong=b('save-the-date-phone-chain',3).decision.choices.find(o=>o.id!==b('save-the-date-phone-chain',3).decision.correct);phoneWrong.label='2';phoneWrong.feedback='Comparing each person’s own waitDays with deadline 0 counts only people 1 and 3. Arrival time instead depends on calls from their ancestors.';
 const playlistWrong=b('kth-song-in-playlist',0).decision.choices.find(o=>o.id!==b('kth-song-in-playlist',0).decision.correct);playlistWrong.label='5';playlistWrong.feedback='Playback is [1,2,3,4,5]. Using index k instead of k−1 picks index 4, song 5.';playlistWrong.misconception='zero-based-k';
 for(const task of p('trusted-courier-networks').buildTasks)for(const option of task.decision.choices)option.feedback=option.feedback.replace(/\s*\(or qualifying entries\)/g,'');
 replaceTask(r('counting-constellations',4),'sky=[[0,1,0,0],[0,0,1,0],[0,0,0,1]]',gridGraph([[0,1,0,0],[0,0,1,0],[0,0,0,1]],x=>x===1,true),'How many constellations are in this sky?',1,3,'The three stars form one chain of corner-touching neighbors.','Checking side neighbors only misses both diagonal links and counts three separate stars.','side-only-search');
 replaceConcept(c('counting-constellations',4),'sky=[[0,1,0],[1,0,1],[0,1,0]]','How many constellations are in this sky?',1,4,'All four stars connect through corner-touching steps.','Checking side neighbors only misses every diagonal link and counts four separate stars.','side-only-search');
 const summitCount=c('count-routes-to-summit',4).choices.find(o=>o.misconception==='count-reachable-nodes');summitCount.label='5';summitCount.feedback='This counts all five reachable camps, 0 through 4, instead of complete summit routes.';
 replaceConcept(c('top-of-the-pile',4),'items=[[],[[-5]],[6,-6],[]]','What is the sum at the shallowest occupied level?',0,-5,'The first occupied level contains 6 and -6, whose sum is zero.','Testing sum !== 0 skips this occupied level and returns the deeper -5.','zero-means-empty');
 replaceConcept(c('dungeon-gold-run',3),'rooms=[[1,2],[3],[3],[],[]], gold=[3,5,7,11,20]','How much gold can be collected starting in room 0?',26,37,'Rooms 0, 1, 2, and 3 contribute 3+5+7+11=26. Room 4 stays locked.','Adding each branch separately counts shared room 3 twice: 3+5+11+7+11=37.','count-shared-room-twice');
 replaceConcept(c('dungeon-gold-run',4),'rooms=[[],[2],[1]], gold=[7,3,3]','How much gold can be collected starting in room 0?',7,13,'Only room 0 opens. Its empty key list leaves rooms 1 and 2 locked.','This adds gold from all rooms, including the two locked rooms.','count-all-rooms');
 // Boolean results offer two outcomes. Explanations belong in feedback.
 for(const lesson of lessons)for(const task of lesson.conceptTasks){
  if(task.kind==='visual-options')continue;
  const booleanValue=option=>String(option.label).replace(/`/g,'').trim().match(/^(?:Return\s+)?(true|false)\b/i)?.[1].toLowerCase();
  const right=task.choices.find(option=>option.id===task.correct), truth=booleanValue(right);
  if(!truth)continue;
  const wrong=task.choices.find(option=>option.id!==task.correct&&booleanValue(option)&&booleanValue(option)!==truth);
  if(wrong){right.label=truth;wrong.label=booleanValue(wrong);task.choices=[right,wrong];}
 }
 // Rebuild every comparison picture from the same exact input. Each wrong
 // picture changes just one relation, direction, color, or item.
 const freshPictures=require('./author-variant-fresh-pictures')({graph,gridGraph,nestedGraph,runeGraph,adjacencyGraph,ids});
 for(const lesson of lessons){
  const task=lesson.conceptTasks[0],base=freshPictures[lesson.id];task.input=base.input;
  task.why='Every input item and every direct relation appears exactly once.';
  for(const option of task.choices){
   option.model=clone(base.canvas);
   if(option.id===task.correct){option.label='Picture A';option.feedback='Correct. Every input item and direct relation matches.';continue;}
   option.label='Picture '+({ 'all-blue':'B','drop-sink':'C','arrows':'D','missing-edge':'B','wrong-relation':'C','missing-node':'D' }[option.id]||'B');
   if(/node|drop-sink/.test(option.id)){
    const removed=option.model.nodes.pop();option.model.edges=option.model.edges.filter(edge=>edge.from!==removed.id&&edge.to!==removed.id);
    option.feedback=`Input item ${removed.label} is missing. It still needs its own node.`;option.misconception='omit-input-item';
   }else if(/relation|reverse|direction|color|all-blue|arrows/.test(option.id)){
    if(option.model.edges.some(edge=>edge.color) && option.id!=='arrows'){const edge=option.model.edges.find(edge=>edge.color);edge.color=edge.color==='red'?'blue':'red';option.feedback='One track has the wrong color. Check its color in the input.';option.misconception='wrong-edge-color';}
    else {option.model.directed=!base.canvas.directed;option.feedback=base.canvas.directed?'These input relations have a direction. Two-way links change the rule.':'These input relations are two-way. Arrows change the rule.';option.misconception='wrong-direction';}
   }else{
    const removed=option.model.edges.pop();
    if(removed){option.feedback=`The direct connection ${removed.from}${base.canvas.directed?'→':'—'}${removed.to} is missing.`;option.misconception='omit-direct-edge';}
    else {const removedNode=option.model.nodes.pop();option.feedback=`Input item ${removedNode.label} is missing.`;option.misconception='omit-input-item';}
   }
  }
 }
 // A fixed deterministic shuffle removes authoring-position clues.
 for(const lesson of lessons){let seed=[...lesson.id].reduce((n,ch)=>Math.imul(n^ch.charCodeAt(0),16777619)>>>0,2166136261);for(const t of [...lesson.buildTasks.map(t=>t.decision),...lesson.conceptTasks,...lesson.conceptTasks.map(t=>t.remedial.decision)]){t.choices.sort((a,b)=>a.id.localeCompare(b.id));for(let i=t.choices.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[t.choices[i],t.choices[j]]=[t.choices[j],t.choices[i]];}}}
}
// Five new exact builds for transfer practice. These are authored separately
// from Step 1 repairs, so seeing a repair never reveals a Step 3 drawing.
function addStructureTasks(lessons) {
 const directedCases=[[[1],[2],[4],[],[]],[[1,2],[4],[4],[],[5],[]],[[1,2,3],[4],[],[],[]],[[2],[],[1],[]],[[1,2],[3],[],[],[]]];
 const trees=[[[0,2],[2,1],[0,3],[3,4]],[[0,2],[2,1],[1,3],[3,4]],[[0,1],[0,2],[0,3],[0,4]],[[1,0],[2,1],[2,3],[3,4]],[[0,2],[2,1],[2,3],[3,4]]];
 const nested=[ [[],[2,2],7], [[3,[5]],8], [[4],[],[6,9]], [[1,[2]],[]], [[],[3,-3],[[8]]] ];
 const grids={
  'counting-constellations':[[[1,1,0],[0,0,0],[0,0,1]],[[1,0,0],[0,1,0],[0,0,1]],[[0,1,0],[1,1,0]],[[0,0,1],[0,1,0]],[[1,1,0,0],[0,0,0,1]]],
  'counting-docked-boats':[['.BB.','....','...B'],['BBB.','....','...B'],['BB..','....','...B'],['..B','..B','...'],['....','.BB.','....','B...']],
  'longest-freight-train':[['T...','T...','T..T'],['TTT.','....','...T'],['.TTT','....','T...'],['.T.','.T.','...'],['TT..','....','.TTT']],
  'perfect-size-campsites':[[[1,1,0],[0,0,0],[1,1,1]],[[1,1,1],[0,0,0]],[[0,1,0],[1,1,1]],[[0,1],[0,1]],[[1,1,0],[0,0,0],[0,1,1]]],
  'gas-pocket-survey':[['UG','UU'],['UUU','UUG'],['UU','GU'],['UU','UU'],['UUGU']]
 };
 for(const lesson of lessons) {
  const id=lesson.id;
  lesson.structureTasks=Array.from({length:5},(_,i)=>{
   let input,canvas;
   if(['busiest-shelf-level','coins-on-level-k','kth-song-in-playlist','top-of-the-pile'].includes(id)) {
    const a=clone(nested[i]); // distinct raw values for each lesson and round
    const offset=id==='coins-on-level-k'?10:id==='kth-song-in-playlist'?20:id==='top-of-the-pile'?30:0;
    const shift=x=>Array.isArray(x)?x.map(shift):x+offset;const items=shift(a);
    input=`${id==='kth-song-in-playlist'?'playlist':'items'}=${JSON.stringify(items)}`+(['coins-on-level-k','kth-song-in-playlist'].includes(id)?`, k=${i%2+1}`:'');canvas=nestedGraph(items);
   } else if(grids[id]) {
    let rows=clone(grids[id][i]); const blank=typeof rows[0]==='string'?(id==='gas-pocket-survey'?'U':'.').repeat(rows[0].length):Array(rows[0].length).fill(0); rows.push(blank); const key=id==='counting-constellations'?'sky':id==='counting-docked-boats'?'marina':id==='longest-freight-train'?'yard':id==='perfect-size-campsites'?'park':'cave';
    input=`${key}=${JSON.stringify(rows)}`+(id==='perfect-size-campsites'?', k=2':id==='gas-pocket-survey'?', row=0, col=0':'');
    canvas=gridGraph(rows,v=>id==='gas-pocket-survey'||v===1||v==='B'||v==='T',id==='counting-constellations');
   } else if(id==='runes-on-the-castle-door') {
    const d=[['ab','b','c'],['a','bc','a'],['abc','d'],['b','a','b'],['ac','c']][i];input=`dials=${JSON.stringify(d)}`;canvas=runeGraph(d);
   } else if(['who-keeps-their-job','shut-the-garden-valve','save-the-date-phone-chain'].includes(id)) {
    const edges=trees[i],n=Math.max(...edges.flat())+1;
    // Orient parent→child afresh, even when a physical pair is written backwards.
    const adj=ids(n).map(()=>[]);for(const[a,b]of edges){adj[a].push(b);adj[b].push(a)}const parent=Array(n).fill(-1),q=[0];parent[0]=-2;for(const a of q)for(const b of adj[a])if(parent[b]===-1){parent[b]=a;q.push(b)};
    const values=ids(n).map(j=>j+2),names=ids(n).map(j=>10+j*3);
    if(id==='save-the-date-phone-chain'){parent[0]=-1;const wait=values.map((v,j)=>adj[j].length===1&&j!==0?0:v);input=`n=${n}, headId=0, caller=${JSON.stringify(parent)}, waitDays=${JSON.stringify(wait)}, deadline=3`;canvas=graph(true,ids(n),parent.flatMap((a,j)=>a<0?[]:[[a,j,wait[a]]]));}
    else {const feeders=parent.map(a=>a<0?0:names[a]);input=`ids=${JSON.stringify(names)}, ${id==='who-keeps-their-job'?'bosses':'feeds'}=${JSON.stringify(feeders)}, `+(id==='who-keeps-their-job'?`quitId=${names[1]}`:`liters=${JSON.stringify(values)}, shutId=${names[1]}`);const labels=id==='who-keeps-their-job'?names:names.map((n,j)=>`${n}:${values[j]}`);canvas=graph(true,labels,parent.flatMap((a,j)=>a<0?[]:[[labels[a],labels[j]]]));}
   } else if(['routes-past-the-coffee-cart','count-routes-to-summit','dungeon-gold-run','museum-vault-keyring'].includes(id)) {
    let a=clone(directedCases[i]);
    if(id==='dungeon-gold-run'){const gold=ids(a.length).map(j=>j===1?0:j+3);input=`rooms=${JSON.stringify(a)}, gold=${JSON.stringify(gold)}`;canvas=adjacencyGraph(a,true,gold.map((g,j)=>`${j}:${g}g`));}
    else if(id==='museum-vault-keyring'){if(i===4)a=[[1],[2],[0],[],[]];input=`vaults=${JSON.stringify(a)}, startKeys=${JSON.stringify(i===4?[0,3]:[0,2])}`;canvas=adjacencyGraph(a);}
    else {input=`graph=${JSON.stringify(a)}`+(id==='routes-past-the-coffee-cart'?', checkpoint=1':'');canvas=adjacencyGraph(a);}
   } else {
    let edges=clone(trees[i]),n=Math.max(...edges.flat())+1;
    if(id==='gold-and-silver-lights'){edges.push([n-1,n]);n++;}
    if(['biggest-study-group','trusted-courier-networks','villages-without-wells','office-rumor-reach'].includes(id)){n++;if(id==='biggest-study-group'&&i===3)n++;if(i===4)edges=[[0,1],[1,2],[3,4]];}
    canvas=graph(false,ids(n),edges);
    if(['biggest-study-group','trusted-courier-networks'].includes(id)){const trust=id==='trusted-courier-networks',a=ids(n).map(j=>ids(n).map(k=>j===k?(trust?10:1):0));edges.forEach(([a1,b1],j)=>a[a1][b1]=a[b1][a1]=trust?(j===0?6:7):1);input=`${trust?'trust':'worked'}=${JSON.stringify(a)}`+(trust?', k=6':'');}
    else if(id==='villages-without-wells')input=`n=${n}, paths=${JSON.stringify(edges)}, wells=[2]`;
    else if(id==='office-rumor-reach')input=`n=${n}, friendships=${JSON.stringify(edges)}, start=2`;
    else if(id==='gold-and-silver-lights')input=`n=${n}, wires=${JSON.stringify(edges)}, goldStart=0`;
    else if(id==='flooded-campsite-trails'){input=`n=${n}, trails=${JSON.stringify(edges)}, flooded=[1], start=0, finish=${n-1}`;canvas.nodes[1].color='blue';}
    else if(id==='package-to-the-outpost'){const roads=edges.map(([a,b],j)=>[a,b,j+2]);input=`n=${n}, roads=${JSON.stringify(roads)}, hq=2, target=${n-1}`;canvas=graph(false,ids(n),roads);}
    else if(id==='one-color-metro-ride'){const colors=edges.map((_,j)=>j%2?'blue':'red');input=`n=${n}, tracks=${JSON.stringify(edges)}, colors=${JSON.stringify(colors)}, source=0, destination=${n-1}`;canvas.edges.forEach((e,j)=>e.color=colors[j]);}
    else throw Error('Missing structure author: '+id);
   }
   return {id:`transfer-${i+1}`,input,canvas};
  });
 }
}

function parseAssignments(text) { return require('vm').runInNewContext('({' + text.replace(/\b(\w+)\s*=/g, '$1:') + '})'); }
function fixStep4(specs) {
 const p=id=>specs.find(p=>p.id===id), c=(id,key)=>p(id).cases.find(c=>c.caseId===key);
 for(const task of p('kth-song-in-playlist').cases){
  const rename=text=>text.replace(/folder A/g,'folder root[0]').replace(/folder B/g,'folder root[0][1]');
  for(const [key,value]of Object.entries(task.graphProof))if(typeof value==='string')task.graphProof[key]=rename(value);
  for(const option of task.diagnoses){option.label=rename(option.label);option.feedback=rename(option.feedback);}
 }
 for(const task of p('save-the-date-phone-chain').cases) {
  const input=typeof task.input==='string'?parseAssignments(task.input):task.input;
  task.canvas=graph(true,ids(input.n),input.caller.flatMap((parent,child)=>parent<0?[]:[[parent,child,input.waitDays[parent]]]));
 }
 for(const task of p('flooded-campsite-trails').cases) {
  const input=typeof task.input==='string'?parseAssignments(task.input):task.input;
  for(const node of task.canvas.nodes)if(input.flooded.includes(Number(node.id)))node.color='blue';
 }
 // Exact drawings always represent the real problem, never an unannounced buggy model.
 for(const id of ['longest-freight-train','perfect-size-campsites'])for(const task of p(id).cases) {
   const input=typeof task.input==='string'?null:task.input;
   if(input)task.canvas=gridGraph(input.yard||input.park,v=>id==='longest-freight-train'?v==='T':v===1);
 }
 c('runes-on-the-castle-door','case-3').canvas=runeGraph(['a','b','bc']);
 for(const task of p('one-color-metro-ride').cases){const {n,tracks,colors}=task.input;task.canvas=graph(false,ids(n),tracks);task.canvas.edges.forEach((e,i)=>e.color=colors[i]);task.gradeColors=true;}
 for(const task of p('package-to-the-outpost').cases){task.canvas=graph(false,ids(task.input.n),task.input.roads);task.gradeLabels=true;}
 const shelf=c('busiest-shelf-level','case-3');shelf.bugTitle='Adds item values instead of counting items';shelf.graphProof.separatingFeature='Levels 1 and 2 both sum to 5, so the normal smaller-depth tie rule keeps depth 1. Counting items instead gives 1 versus 2.';
 const stop=c('busiest-shelf-level','repair-3');stop.bugTitle='Stops at a level with no integer items';stop.code=`function solve(input) {
  let level = input.items;
  let depth = 1;
  let largestCount = 0;
  let busiestDepth = 0;
  while (level.length) {
    const count = level.filter(item => !Array.isArray(item)).length;
    if (count === 0) break;
    if (count > largestCount) {
      largestCount = count;
      busiestDepth = depth;
    }
    level = level.filter(Array.isArray).flat();
    depth++;
  }
  return busiestDepth;
}`;
 stop.graphProof={codeRule:'The loop stops as soon as one level has zero integer items.',realGraph:'The outer array contains two boxes. One box contains integer item 5 at depth 2.',separatingFeature:'Stopping at depth 1 leaves the deeper item unexplored.',outputConsequence:'The code returns 0, meaning no occupied depth was found. Continuing finds depth 2 with one item, so the required depth is 2.'};
 for(const d of stop.diagnoses)d.label=d.label.replace(/boxes/g,'integer items');
 const stars=c('counting-constellations','omits-isolated-stars');stars.code=`function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  function isStar(row, column) {
    const inside = row >= 0 && row < sky.length
      && column >= 0 && column < sky[0].length;
    return inside && sky[row][column] === 1;
  }
  function visit(row, column) {
    const key = row + ',' + column;
    if (!isStar(row, column) || visited.has(key)) return;
    visited.add(key);
    for (const [rowChange, columnChange] of directions) {
      visit(row + rowChange, column + columnChange);
    }
  }
  let count = 0;
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      if (!isStar(row, column) || visited.has(row + ',' + column)) continue;
      const hasNeighbor = directions.some(([rowChange, columnChange]) =>
        isStar(row + rowChange, column + columnChange));
      if (!hasNeighbor) continue;
      count++;
      visit(row, column);
    }
  }
  return count;
}`;
 stars.graphProof.codeRule='The outer scan skips isolated stars before starting an otherwise complete component search.';
 const valve=c('shut-the-garden-valve','id-as-index');valve.code=`function solve(input) {
  const children = new Map(input.ids.map(id => [id, []]));
  for (let i = 0; i < input.ids.length; i++) {
    if (children.has(input.feeds[i])) children.get(input.feeds[i]).push(input.ids[i]);
  }
  function below(id) {
    let total = 0;
    for (const child of children.get(id)) {
      total += input.liters[input.ids.indexOf(child)] + below(child);
    }
    return total;
  }
  return input.liters[input.shutId - 1] + below(input.shutId);
}`;
 const playlist=p('kth-song-in-playlist');for(const task of playlist.cases)for(const [key,text]of Object.entries(task.graphProof))task.graphProof[key]=text.replace(/root→folderA→1→folderB→2/g,'root[0] contains song 1 and folder root[0][1], which contains song 2. DFS returns to root[0] after song 1, then opens its next child').replace(/folderA/g,'root[0]').replace(/folderB/g,'root[0][1]');
 for(const task of p('counting-docked-boats').cases)for(const d of task.diagnoses)if(/seen set correctly groups/i.test(d.feedback))d.feedback='The seen set would prevent recounting a visited boat, but the code never starts a search from this bottom-border boat.';
 for(const task of p('routes-past-the-coffee-cart').cases)if(typeof task.input==='string'){task.input=parseAssignments(task.input);task.input.graph=task.input.graph||task.input.roads;task.input.checkpoint=task.input.checkpoint??task.input.coffeeCart;delete task.input.roads;delete task.input.coffeeCart;}
 for(const task of p('villages-without-wells').cases)if(typeof task.input==='string'){task.input=parseAssignments(task.input);task.input.paths=task.input.paths||task.input.roads;delete task.input.roads;}
 // Replace complementary-color repetition with a missing-subtree boundary.
 const light=c('gold-and-silver-lights','case-3');light.input={n:5,wires:[[0,1],[0,2],[2,3],[2,4]]};light.canvas=graph(false,ids(5),light.input.wires);light.bugTitle='Returns after the first child branch';light.misconception='return-after-first-child';light.code=`function solve(input) {
  const graph = Array.from({length: input.n}, () => []);
  for (const [a, b] of input.wires) {
    graph[a].push(b);
    graph[b].push(a);
  }
  function countGold(bulb, parent, isGold) {
    let total = isGold ? 1 : 0;
    for (const next of graph[bulb]) {
      if (next === parent) continue;
      total += countGold(next, bulb, !isGold);
      return total;
    }
    return total;
  }
  return countGold(0, -1, true);
}`;light.buggyOutput='1';light.correctOutput='3';light.correctDiagnosis='returns-in-child-loop';light.diagnoses=[{id:'returns-in-child-loop',label:'The return inside the loop skips the second child branch.',feedback:'Correct. After visiting silver bulb 1, the call returns before reaching gold bulbs 3 and 4.'},{id:'wrong-root-color',label:'Bulb 0 starts silver.',feedback:'The final call passes true, so bulb 0 correctly starts gold.'},{id:'no-color-flip',label:'The code gives children the same color as their parent.',feedback:'The recursive call passes !isGold, so it correctly flips the color.'}];light.graphProof={realGraph:'Bulb 0 connects to leaf 1 and to branch 2→{3,4}.',codeRule:'A return inside the neighbor loop ends the search after its first child.',separatingFeature:'The entire branch containing gold bulbs 3 and 4 stays unvisited.',outputConsequence:'The code counts only gold bulb 0 and returns 1; visiting both branches counts 0,3,4 and returns 3.'};
 // Clarify that realGraph describes the student's correct model. Runtime uses
 // this field under that name; changedGraph supplies the buggy graph separately.
 const starCount=specs.find(p=>p.id==='counting-constellations').cases[1];
 starCount.code=`function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  let constellationCount = 0;
  function visit(row, column) {
    if (row < 0 || row >= sky.length || column < 0 || column >= sky[0].length) return;
    const cell = row + "," + column;
    if (sky[row][column] !== 1 || visited.has(cell)) return;
    visited.add(cell);
    constellationCount++;
    for (let rowStep = -1; rowStep <= 1; rowStep++) {
      for (let columnStep = -1; columnStep <= 1; columnStep++) {
        if (rowStep !== 0 || columnStep !== 0) {
          visit(row + rowStep, column + columnStep);
        }
      }
    }
  }
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      if (sky[row][column] === 1 && !visited.has(row + "," + column)) {
        visit(row, column);
      }
    }
  }
  return constellationCount;
}`;
 starCount.graphProof.codeRule='The answer increases inside visit for each newly visited star, instead of once when a new component search starts.';
 starCount.diagnoses.find(d=>d.id==='four-directions').feedback='The rowStep/columnStep loops follow all eight neighboring directions, including diagonals.';
 starCount.diagnoses.find(d=>d.id==='misses-isolated').feedback='The outer scan also starts visit on an isolated star, and visit counts it.';
 const effects = {
  'who-keeps-their-job': ['Report arrows are present, but the leaving set never expands along them.', 'The removed subtree has a hole at its root: the quitter stays.', 'The leaving set contains an array position instead of the matching employee node.'],
  'busiest-shelf-level': ['Box nodes incorrectly contribute to each level’s item count.', 'Node values replace node counts when levels are compared.', 'A box-only level becomes a false stopping boundary.'],
  'coins-on-level-k': ['Every integer node is assigned a depth one smaller than required.', 'The selected layer expands upward to include shallower coins.', 'Sibling coin nodes are excluded after the first match.'],
  'counting-constellations': ['The diagonal edges disappear, splitting the connected chain.', 'All real edges are explored, but each node contributes its own constellation count.', 'Isolated nodes are left out of the component scan.'],
  'counting-docked-boats': ['The boat stays connected, but its border status ignores every cell after the first.', 'Components without a top-row starting cell are never searched.', 'The graph beyond the first discovered boat is left unexamined.'],
  'routes-past-the-coffee-cart': ['Only the first branch from each intersection can contribute a route.', 'The checkpoint incorrectly becomes a terminal node.', 'The graph stays intact, but saved route records change when the current path changes.'],
  'villages-without-wells': ['Well information does not travel back through the component.', 'A mixed component is treated as unsupplied despite its reachable well.', 'Nodes with no road edges disappear from the scan.'],
  'gas-pocket-survey': ['Gas at a corner incorrectly becomes a direct danger neighbor.', 'Vertical reveal edges are never followed.', 'The starting gas node gets the safe label instead of the explosion label.'],
  'gold-and-silver-lights': ['The two alternating color groups exchange their gold and silver labels.', 'All reached bulbs inherit the root’s gold label.', 'Later child branches remain outside the visited part of the tree.'],
  'dungeon-gold-run': ['The search boundary contains the starting room but none of its outgoing key paths.', 'A shared room contributes once per incoming search path instead of once per room.', 'Every room keeps only its first usable key branch.'],
  'flooded-campsite-trails': ['The forbidden finish is allowed to act as a successful terminal node.', 'Reverse trail edges are missing, trapping the start.', 'A failed first branch prevents the search from entering later branches.'],
  'longest-freight-train': ['Only the first component contributes to the length comparison.', 'Vertical links disappear, splitting the train into single cars.', 'All components are found, but each new size replaces the previous best.'],
  'one-color-metro-ride': ['Red and blue edges become one combined travel network.', 'Nodes visited during the red search incorrectly block the fresh blue search.', 'The entire blue travel network is omitted.'],
  'office-rumor-reach': ['Each friendship loses its reverse direction.', 'The reached set stops one edge away from the starter.', 'The reached component is counted with its starting node removed.'],
  'package-to-the-outpost': ['Every road effectively costs one unit regardless of its weight.', 'Reverse road edges disappear from the usable map.', 'The counted roads expand from the target route to the whole reachable tree.'],
  'perfect-size-campsites': ['An invented diagonal edge merges two separate grass components.', 'The accepted component sizes expand from exactly k to every size above it.', 'Each accepted component contributes all its cells instead of one campsite.'],
  'count-routes-to-summit': ['A shared intermediate node becomes closed after the first route uses it.', 'All but the first outgoing branch are ignored.', 'Paths requiring an intermediate camp cannot contribute.'],
  'runes-on-the-castle-door': ['Legal edges that reuse an earlier, nonadjacent rune are pruned.', 'Only the first allowed child remains usable at each prefix.', 'An illegal repeated-neighbor edge survives once the prefix has two characters.'],
  'save-the-date-phone-chain': ['Each arrow carries its listener’s delay instead of its caller’s delay.', 'Sibling listener branches after the first are never reached.', 'Nodes arriving exactly on the deadline fall outside the accepted time boundary.'],
  'shut-the-garden-valve': ['The selected node contributes, but all downstream arrows are ignored.', 'The stopped set ends after one edge below the selected sprinkler.', 'The walk follows parent links instead of supply arrows toward children.', 'The selected node receives another sprinkler’s flow value.', 'The stopped subtree is counted without its root node.', 'The stopped nodes are compared by maximum value rather than added.', 'Only the first child branch contributes to the stopped total.', 'The selected subtree is replaced by the whole tree rooted at the main valve.'],
  'biggest-study-group': ['Each reached component is given one extra count for its starting self-entry.', 'Each candidate group contains only a student and their direct teammates.', 'The final component replaces the largest component found so far.'],
  'kth-song-in-playlist': ['Edges into deeper folders are not explored.', 'The playback order stays correct, but the requested position shifts forward by one.', 'Folder nodes incorrectly consume song positions.'],
  'museum-vault-keyring': ['Outgoing key arrows from opened vaults are never followed.', 'The search begins from only one node in the starting keyring.', 'Every key arrow gains an invented reverse arrow.'],
  'top-of-the-pile': ['Every integer leaf contributes, regardless of its layer.', 'The selected layer moves from the shallowest occupied depth to the deepest.', 'Only one node in the shallowest occupied layer contributes.'],
  'trusted-courier-networks': ['Edges whose scores equal k disappear.', 'Edges with scores above k disappear even though they qualify.', 'The result counts direct edges rather than connected groups.'],
 };
 for(const lesson of specs)lesson.cases.forEach((task,index)=>{
  if(!effects[lesson.id]?.[index])throw new Error(`Missing graph effect for ${lesson.id} case ${index}`);
  task.graphProof.changedGraph=effects[lesson.id][index];
 });
 specs.find(p=>p.id==='counting-docked-boats').cases[0].graphProof.separatingFeature='Both (1,1) and (2,1) are visited. Cell (2,1) touches the bottom border, although the first cell (1,1) is interior.';
}
function main() {
 const specs=read('visual-specs-variant.json');fixSpecs(specs);write('visual-specs-variant.json',specs);
 const step4=read('step4-specs-variant.json');fixStep4(step4);write('step4-specs-variant.json',step4);
 if(!process.argv.includes('--specs-only')){const lessons=read('visual-lessons-variant.json');fixLessons(lessons,specs);addStructureTasks(lessons);write('visual-lessons-variant.json',lessons);}
 console.log('Applied authoritative Astra variant content repairs.');
}
if(require.main===module)main();
module.exports={fixSpecs,fixLessons,fixStep4,addStructureTasks};
