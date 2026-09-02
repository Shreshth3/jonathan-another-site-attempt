const fs = require("fs");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");
const file = "visual-lessons-variant.json";
const lessons = JSON.parse(fs.readFileSync(file, "utf8"));
const specs = JSON.parse(fs.readFileSync("visual-specs-variant.json", "utf8"));

const canvas = (directed, labels, edges=[]) => ({directed,nodes:labels.map(x=>({id:String(x),label:String(x)})),edges:edges.map(([from,to,label])=>({from:String(from),to:String(to),...(label==null?{}:{label:String(label)})}))});
const choice=(id,label,feedback,misconception=null)=>({id,label,feedback,misconception});
const task=(id,title,facet,input,model,prompt,answer,wrong,why)=>{let wrongLabel=String(wrong.label);if(wrongLabel===String(answer))wrongLabel=wrongLabel==="true"?"false":wrongLabel==="false"?"true":String((Number(wrongLabel)||0)+1);return{id,title,facet,prompt:"Use the raw input to complete the challenge. Then choose the result.",input,canvas:model,decision:{prompt,choices:[choice("correct",answer,`Correct. ${why}`),choice("bug",wrongLabel,wrong.feedback,wrong.misconception)],correct:"correct"},why}};
const clone=x=>JSON.parse(JSON.stringify(x));
function omitEdge(m){const x=clone(m);x.edges=x.edges.slice(0,-1);return x}
function changeRelation(m){const x=clone(m);if(x.edges.length){if(x.directed)[x.edges[0].from,x.edges[0].to]=[x.edges[0].to,x.edges[0].from];else x.directed=true}return x}
function omitNode(m){const x=clone(m),n=x.nodes.pop();x.edges=x.edges.filter(e=>e.from!==n.id&&e.to!==n.id);return x}
function install(id,facets,cases){
  const at=lessons.findIndex(x=>x.id===id), old=lessons[at]; if(at<0)throw Error(id);
  const [b1,b2,b3,b4,...repairs]=cases;
  const exact={id:"concept-picture",title:"Match every detail",facet:facets[0],kind:"visual-options",prompt:"Which picture exactly matches this raw input?",input:b1.input,choices:[
    {...choice("exact","Picture A","Correct. Every entity and direct relation matches.",null),model:clone(b1.canvas)},
    {...choice("missing-edge","Picture B","This drops a direct relation listed in the input.","omit-listed-relation"),model:omitEdge(b1.canvas)},
    {...choice("wrong-relation","Picture C",b1.canvas.directed?"This reverses one listed arrow.":"This turns a two-way relation into a one-way arrow.",b1.canvas.directed?"reverse-listed-arrow":"make-undirected-edge-directed"),model:changeRelation(b1.canvas)},
    {...choice("missing-node","Picture D","This drops an entity that still exists in the input.","omit-input-entity"),model:omitNode(b1.canvas)}
  ],correct:"exact",why:"The exact picture preserves every entity and every direct relation."};
  const concepts=[exact,...old.conceptTasks.slice(1)];
  concepts.forEach((concept,index)=>{concept.facet=facets[Math.min(index,facets.length-1)]});
  concepts.forEach((c,i)=>{const r=repairs[i];c.remedial={id:`repair-${i+1}`,title:`Fresh proof · ${c.title}`,prompt:"Use this fresh raw input to complete the challenge. Then choose the result.",input:r.input,canvas:clone(r.canvas),decision:clone(r.decision),why:r.why}});
  lessons[at]={id,facets,buildTasks:[b1,b2,b3,b4],conceptTasks:concepts};
}

const bug=(label,feedback,misconception)=>({label,feedback,misconception});

install("who-keeps-their-job",["exact org chart","employee identity","boss-to-report arrows","quitting subtree"],[
  task("quit-middle","Remove one subtree","quitting subtree","ids=[10,2,7,15], bosses=[0,10,10,2], quitId=2",canvas(true,[10,2,7,15],[[10,2],[10,7],[2,15]]),"Which sorted IDs remain?","[7,10]",bug("[7,10,15]","This removes only the quitter and leaves their report 15.","remove-quitter-only"),"Employees 2 and 15 leave; 7 and 10 remain."),
  task("quit-leaf","Remove a leaf only","quitting subtree","ids=[6,1,8,3], bosses=[0,6,6,1], quitId=3",canvas(true,[6,1,8,3],[[6,1],[6,8],[1,3]]),"Which sorted IDs remain?","[1,6,8]",bug("[6,8]","This incorrectly walks upward and removes the quitter's boss 1.","remove-ancestor"),"Leaf employee 3 has no reports, so only 3 leaves."),
  task("quit-root","Remove the full company","boss-to-report arrows","ids=[4,9,2], bosses=[0,4,4], quitId=4",canvas(true,[4,9,2],[[4,9],[4,2]]),"Which sorted IDs remain?","[]",bug("[2,9]","This removes the CEO but fails to recurse into direct reports.","remove-root-only"),"Every employee is in CEO 4's subtree."),
  task("non-contiguous-ids","Use IDs, not indexes","employee identity","ids=[20,5,90,7], bosses=[0,20,20,5], quitId=5",canvas(true,[20,5,90,7],[[20,5],[20,90],[5,7]]),"Which sorted IDs remain?","[20,90]",bug("[5,7,20,90]","This treats quitId 5 as an array position, fails to find that position, and therefore removes nobody.","id-as-array-index"),"Employees 5 and 7 leave; 20 and sibling 90 stay."),
  task("fresh-exact","Read a fresh chart","exact org chart","ids=[3,8,1], bosses=[0,3,8], quitId=8",canvas(true,[3,8,1],[[3,8],[8,1]]),"Which sorted IDs remain?","[3]",bug("[1,3]","This removes only employee 8 and misses descendant 1.","remove-quitter-only"),"Quitting 8 removes 8 and report 1."),
  task("fresh-node","Keep sibling IDs distinct","employee identity","ids=[50,4,6], bosses=[0,50,50], quitId=4",canvas(true,[50,4,6],[[50,4],[50,6]]),"Which sorted IDs remain?","[6,50]",bug("[50]","This removes sibling 6 even though 6 is not below quitter 4.","remove-siblings"),"Only leaf 4 leaves."),
  task("fresh-direction","Follow arrows downward","boss-to-report arrows","ids=[9,2,1], bosses=[0,9,2], quitId=2",canvas(true,[9,2,1],[[9,2],[2,1]]),"Which sorted IDs remain?","[9]",bug("[1,9]","This reverses the reporting edge and fails to visit report 1.","reverse-hierarchy"),"The downward subtree from 2 contains 2 and 1."),
  task("fresh-output","Sort numerically","quitting subtree","ids=[11,2,30], bosses=[0,11,11], quitId=30",canvas(true,[11,2,30],[[11,2],[11,30]]),"Which sorted IDs remain?","[2,11]",bug("[11,2]","These are the right employees in lexicographic rather than numeric order.","string-sort"),"Only leaf 30 leaves, and 2 sorts before 11."),
  task("fresh-boundary","Handle one employee","quitting subtree","ids=[42], bosses=[0], quitId=42",canvas(true,[42],[]),"Which sorted IDs remain?","[]",bug("[42]","This refuses to remove an employee with no outgoing report arrows.","require-child-before-removal"),"The quitter themself always leaves, even with no reports.")
]);

install("biggest-study-group",["exact matrix","student identity","two-way teamwork","largest component"],[
  task("ring-and-pair","Measure every group","largest component","worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]",canvas(false,[0,1,2,3,4,5,6],[[0,1],[0,3],[1,2],[2,3],[4,5]]),"What largest group size is returned?","4",bug("7","This counts every matrix row instead of one connected component.","count-all-students"),"The component sizes are 4, 2, and 1."),
  task("two-tied-pairs","Keep the maximum across a tie","largest component","worked=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]",canvas(false,[0,1,2,3,4],[[0,1],[2,3]]),"What largest group size is returned?","2",bug("4","This adds two disconnected groups just because they tie.","sum-tied-components"),"Both pairs have size 2; the isolated student has size 1."),
  task("chain","Follow teammates transitively","two-way teamwork","worked=[[1,1,0,0],[1,1,1,0],[0,1,1,1],[0,0,1,1]]",canvas(false,[0,1,2,3],[[0,1],[1,2],[2,3]]),"What largest group size is returned?","4",bug("2","This counts only a student and direct teammates.","direct-neighbors-only"),"The whole four-student chain is one component."),
  task("all-isolated","Keep isolated students","student identity","worked=[[1,0,0],[0,1,0],[0,0,1]]",canvas(false,[0,1,2],[]),"What largest group size is returned?","1",bug("0","This creates nodes only for off-diagonal 1s and drops isolated students.","omit-isolated-students"),"Each row still represents one student and one-person group."),
  task("fresh-exact","Read a fresh matrix","exact matrix","worked=[[1,1,0],[1,1,0],[0,0,1]]",canvas(false,[0,1,2],[[0,1]]),"What largest group size is returned?","2",bug("3","This treats diagonal 1s as links joining every row.","misread-diagonal"),"Students 0 and 1 form a pair; student 2 is alone."),
  task("fresh-node","Keep the final row","student identity","worked=[[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]",canvas(false,[0,1,2,3],[[0,1]]),"What largest group size is returned?","2",bug("1","This overwrites the earlier maximum while scanning later isolated rows.","overwrite-max-with-last"),"The first pair remains the largest group."),
  task("fresh-relation","Do not add transitive edges","two-way teamwork","worked=[[1,1,0],[1,1,1],[0,1,1]]",canvas(false,[0,1,2],[[0,1],[1,2]]),"How many students are in the one group?","3",bug("2","This stops after direct neighbors and misses the chain through student 1.","direct-neighbors-only"),"A path through 1 joins all three students."),
  task("fresh-output","Compare component sizes","largest component","worked=[[1,1,1,0,0],[1,1,1,0,0],[1,1,1,0,0],[0,0,0,1,1],[0,0,0,1,1]]",canvas(false,[0,1,2,3,4],[[0,1],[0,2],[1,2],[3,4]]),"What largest group size is returned?","3",bug("5","This sums disconnected component sizes.","sum-components"),"The triangle has size 3 and the pair has size 2."),
  task("fresh-boundary","Handle one student","student identity","worked=[[1]]",canvas(false,[0],[]),"What largest group size is returned?","1",bug("0","This ignores a row unless it has an off-diagonal teammate.","drop-singleton"),"The lone student is a valid group of size 1.")
]);

const networkShapes=[
  {n:5,e:[[0,1],[1,2],[3,4]]},{n:4,e:[[0,1],[1,2],[2,3]]},{n:5,e:[[0,1],[2,3]]},{n:1,e:[]},
  {n:5,e:[[0,1],[0,2],[0,3],[3,4]]},{n:4,e:[[0,1],[1,2],[2,0]]},{n:3,e:[]},{n:4,e:[[0,1],[2,3]]},{n:5,e:[[0,1],[0,2],[0,3],[0,4]]}
];
function components(shape,blocked=new Set()){
  const adj=Array.from({length:shape.n},()=>[]);for(const [a,b] of shape.e)if(!blocked.has(a)&&!blocked.has(b)){adj[a].push(b);adj[b].push(a)}
  const groups=[];let seen=new Set(blocked);for(let i=0;i<shape.n;i++)if(!seen.has(i)){let q=[i],g=[];seen.add(i);while(q.length){let x=q.shift();g.push(x);for(const y of adj[x])if(!seen.has(y)){seen.add(y);q.push(y)}}groups.push(g)}return groups;
}
function matrix(shape,score=1){return Array.from({length:shape.n},(_,i)=>Array.from({length:shape.n},(_,j)=>i===j?(score===7?10:score===1?1:0):shape.e.some(([a,b])=>(a===i&&b===j)||(a===j&&b===i))?score:0))}
function networkCases(cfg, shapes=networkShapes){return shapes.map((shape,i)=>{
  const model=canvas(false,Array.from({length:shape.n},(_,j)=>j),shape.e), result=cfg.result(shape,i), wrong=cfg.wrong(shape,i,result);
  return task(`case-${i+1}`,cfg.titles?.[i]||`Fresh ${cfg.noun} case`,cfg.facets[i%4],cfg.input(shape,i),model,cfg.prompt,result.label,bug(wrong.label,wrong.feedback,wrong.misconception),result.why);
})}

{
  const facets=["exact friendships","employee identity","two-way friendship","starter component"];
  install("office-rumor-reach",facets,networkCases({noun:"office rumor",facets,titles:["Cross a friendship chain","Reach the far end","Ignore another pair","Handle one employee"],input:s=>`n=${s.n}, friendships=${JSON.stringify(s.e)}, start=0`,prompt:"Including employee 0, how many employees hear the rumor?",result:s=>{const size=components(s)[0].length;return{label:String(size),why:`Employee 0's friendship component contains ${size} employee${size===1?"":"s"}.`}},wrong:(s,i,r)=>{const direct=1+s.e.filter(([a,b])=>a===0||b===0).length;const label=String(direct===Number(r.label)?s.n:direct);return{label,feedback:direct===Number(r.label)?"This counts every declared employee, including disconnected components.":"This counts only the starter and direct friends, stopping before friends-of-friends.",misconception:direct===Number(r.label)?"count-all-employees":"direct-friends-only"}}}));
}
{
  const facets=["exact roads","village identity","two-way roads","components without wells"];
  const wellsBy=[ [1,3],[3],[0],[0],[4],[0],[],[1],[2] ];
  install("villages-without-wells",facets,networkCases({noun:"village",facets,input:(s,i)=>`n=${s.n}, roads=${JSON.stringify(s.e)}, wells=${JSON.stringify(wellsBy[i].filter(x=>x<s.n))}`,prompt:"How many new wells are needed?",result:(s,i)=>{const wells=new Set(wellsBy[i].filter(x=>x<s.n));const count=components(s).filter(g=>!g.some(x=>wells.has(x))).length;return{label:String(count),why:`Exactly ${count} road component${count===1?"":"s"} ${count===1?"has":"have"} no existing well.`}},wrong:(s,i,r)=>{const wells=new Set(wellsBy[i].filter(x=>x<s.n));const villages=s.n-wells.size;const label=String(villages===Number(r.label)?components(s).length:villages);return{label,feedback:"This counts individual villages without wells instead of one needed well per road component.",misconception:"count-villages-not-components"}}}));
}
{
  const facets=["exact wires","bulb identity","two-way wires","even-distance count"];
  const goldTrees=[
    {n:5,e:[[0,1],[1,2],[1,3],[3,4]]},{n:4,e:[[0,1],[1,2],[2,3]]},{n:5,e:[[0,1],[0,2],[0,3],[0,4]]},{n:1,e:[]},
    {n:5,e:[[0,1],[0,2],[0,3],[3,4]]},{n:4,e:[[0,1],[0,2],[2,3]]},{n:3,e:[[0,1],[1,2]]},{n:4,e:[[0,1],[0,2],[0,3]]},{n:5,e:[[0,1],[0,2],[0,3],[0,4]]}
  ];
  install("gold-and-silver-lights",facets,networkCases({noun:"bulb",facets,input:s=>`n=${s.n}, wires=${JSON.stringify(s.e)}, goldStart=0`,prompt:"How many bulbs are an even number of wires from bulb 0?",result:s=>{let adj=Array.from({length:s.n},()=>[]);for(const[a,b]of s.e){adj[a].push(b);adj[b].push(a)}let d=Array(s.n).fill(-1),q=[0];d[0]=0;while(q.length){let x=q.shift();for(const y of adj[x])if(d[y]<0){d[y]=d[x]+1;q.push(y)}}let count=d.filter(x=>x%2===0).length;return{label:String(count),why:`The unique tree distances put ${count} bulb${count===1?"":"s"} at even distance, including bulb 0 at distance 0.`}},wrong:(s,i,r)=>{const withoutStart=Math.max(0,Number(r.label)-1);return{label:String(withoutStart===Number(r.label)?Number(r.label)+1:withoutStart),feedback:"This forgets that the starting bulb has even distance 0 and is gold.",misconception:"exclude-distance-zero"}}},goldTrees));
}
{
  const facets=["exact trails","campsite identity","two-way trails","avoid flooded nodes"];
  const floodCases=[
    {n:4,e:[[0,1],[1,3],[0,2],[2,3]],f:[1]},{n:4,e:[[0,1],[1,2],[2,3]],f:[2]},
    {n:4,e:[[0,1],[1,2],[0,3]],f:[1]},{n:1,e:[],f:[]},
    {n:5,e:[[0,1],[1,4],[0,2],[2,3],[3,4]],f:[1]},{n:4,e:[[0,1],[1,2],[2,3]],f:[1]},
    {n:3,e:[],f:[]},{n:4,e:[[0,1],[1,3],[0,2]],f:[2]},{n:5,e:[[0,4],[0,1],[0,2],[0,3]],f:[3]}
  ];
  const cases=floodCases.map((s,i)=>{const blocked=new Set(s.f),yes=!blocked.has(0)&&!blocked.has(s.n-1)&&components(s,blocked).some(g=>g.includes(0)&&g.includes(s.n-1));let feedback,misconception;if(yes&&s.n===1){feedback="This wrongly requires at least one trail even when start already equals finish.";misconception="require-nonempty-path"}else if(yes){feedback="This returns after exploring a flooded or dead branch instead of trying the remaining dry branch.";misconception="return-after-first-branch"}else if(s.e.length){feedback="This searches the original graph without removing the flooded campsite that cuts the route.";misconception="ignore-flooded-set"}else{feedback="This assumes that having no flooded campsites guarantees reachability, even with no trail to the finish.";misconception="restrictions-only-check"}return task(`case-${i+1}`,"Fresh flooded-trail map",facets[i%4],`n=${s.n}, trails=${JSON.stringify(s.e)}, flooded=${JSON.stringify(s.f)}, start=0, finish=${s.n-1}`,canvas(false,Array.from({length:s.n},(_,j)=>j),s.e),"Can the start reach the finish without entering a flooded campsite?",String(yes),bug(String(!yes),feedback,misconception),yes?"A complete dry path connects start to finish.":"Every possible route is cut off, absent, or enters a flooded campsite.")});
  install("flooded-campsite-trails",facets,cases);
}
{
  const facets=["exact trust scores","office identity","threshold edges","trusted components"];
  install("trusted-courier-networks",facets,networkCases({noun:"trust network",facets,input:s=>`trust=${JSON.stringify(matrix(s,7))}, k=6`,prompt:"How many trusted networks are formed?",result:s=>{const count=components(s).length;return{label:String(count),why:s.e.length?`The qualifying score-7 links form ${count} connected component${count===1?"":"s"}.`:s.n===1?"The lone office is one network, so the answer is 1.":`Each isolated office forms its own network, giving ${count} components.`}},wrong:(s,i,r)=>{if(!s.e.length)return{label:"0",feedback:"This drops isolated offices even though each one is its own network.",misconception:"drop-isolated-components"};const label=String(s.n===Number(r.label)?s.e.length:s.n);return{label,feedback:"This counts offices (or qualifying entries) rather than connected trust components.",misconception:"count-nodes-not-components"}}}));
}

const binaryGrids=[
  ["100","010","001"],["110","010","001"],["101","000","110"],["1"],["111"],["10","01"],["100","100","111"],["010","111","010"],["100","000","001"]
];
function gridModel(rows,mark,diagonal=false){
  const nodes=[],edges=[],dirs=diagonal?[[1,0],[0,1],[1,1],[1,-1]]:[[1,0],[0,1]];
  for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++)if(rows[r][c]===mark)nodes.push({id:`r${r}c${c}`,label:`(${r},${c})=${mark}`});
  const ids=new Set(nodes.map(n=>n.id));for(const n of nodes){let m=n.id.match(/r(\d+)c(\d+)/),r=+m[1],c=+m[2];for(const[dr,dc]of dirs){let id=`r${r+dr}c${c+dc}`;if(ids.has(id))edges.push({from:n.id,to:id})}}
  return{directed:false,nodes,edges};
}
function gridGroups(rows,mark,diagonal=false){const m=gridModel(rows,mark,diagonal);return components({n:m.nodes.length,e:m.edges.map(e=>[m.nodes.findIndex(n=>n.id===e.from),m.nodes.findIndex(n=>n.id===e.to)])})}
function gridCases(cfg, grids=binaryGrids){return grids.map((rows,i)=>{const model=gridModel(rows,"1",cfg.diagonal);const display=cfg.display||(cfg.noun==="rail-yard"?"T":null);if(display)model.nodes.forEach(n=>n.label=n.label.replace("=1",`=${display}`));const result=cfg.result(rows,i,model),wrong=cfg.wrong(rows,i,result,model);return task(`case-${i+1}`,cfg.titles?.[i]||`Fresh ${cfg.noun} grid`,cfg.facets[i%4],cfg.input(rows,i),model,cfg.prompt,result.label,bug(wrong.label,wrong.feedback,wrong.misconception),result.why)})}

{
  const facets=["exact star cells","cell identity","eight-way touching","constellation count"];
  install("counting-constellations",facets,gridCases({noun:"star",facets,diagonal:true,input:rows=>`sky=${JSON.stringify(rows.map(row=>[...row].map(Number)))}`,prompt:"How many constellations are in this sky?",result:rows=>{const count=gridGroups(rows,"1",true).length;return{label:String(count),why:`Side-or-corner touching joins the stars into ${count} constellation${count===1?"":"s"}.`}},wrong:(rows,i,r)=>{const side=gridGroups(rows,"1",false).length,label=String(side===Number(r.label)?rows.join("").split("1").length-1:side);return{label,feedback:side===Number(r.label)?"This counts individual star cells instead of connected constellations.":"This uses the four-direction island rule and misses diagonal star connections.",misconception:side===Number(r.label)?"count-star-cells":"omit-diagonals"}}}));
}
{
  const facets=["exact boat cells","cell identity","side adjacency","border component count"];
  const marinaGrids=[["10001","00000","00100","00000","11000"],["110","000","010"],["101"],["1"],["111"],["10","00","01"],["10001","10001","10000"],["000","010","000"],["100","000","001"]];
  const cases=marinaGrids.map((rows,i)=>{const model=gridModel(rows,"1",false);model.nodes.forEach(n=>n.label=n.label.replace("=1","=B"));const groups=gridGroups(rows,"1",false);let docked=0;for(const g of groups){if(g.some(idx=>{const id=model.nodes[idx].id,m=id.match(/r(\d+)c(\d+)/),r=+m[1],c=+m[2];return r===0||c===0||r===rows.length-1||c===rows[0].length-1}))docked++}let cells=model.nodes.length;let wrong=cells===docked?groups.length:docked===groups.length?cells:groups.length; if(wrong===docked)wrong=docked+1;return task(`case-${i+1}`,"Fresh marina","border component count",`marina=${JSON.stringify(rows.map(x=>x.replaceAll("1","B").replaceAll("0",".")))}`,model,"How many boats are docked?",String(docked),bug(String(wrong),cells!==docked?"This counts B cells (or all boats) instead of connected boats that touch a border.":"This misses that every cell in a one-row or one-column marina lies on the border.",cells!==docked?"count-cells-or-all-boats":"miss-degenerate-border"),`${docked} side-connected boat component${docked===1?"":"s"} ${docked===1?"touches":"touch"} a marina border.`)});
  install("counting-docked-boats",facets,cases);
}
{
  const facets=["exact train cars","cell identity","side adjacency","maximum component size"];
  const trainGrids=[["100","000","001"],["111","000","010"],["10001","00001","00000"],["1"],["111"],["10","00","01"],["10001","10001","10000"],["010","010","010"],["100","000","001"]];
  install("longest-freight-train",facets,gridCases({noun:"rail-yard",facets,input:rows=>`yard=${JSON.stringify(rows.map(x=>x.replaceAll("1","T").replaceAll("0",".")))}`,prompt:"What is the longest train length?",result:rows=>{const sizes=gridGroups(rows,"1",false).map(g=>g.length),best=Math.max(0,...sizes);return{label:String(best),why:`The longest valid straight train contains ${best} car${best===1?"":"s"}.`}},wrong:(rows,i,r,model)=>{const total=model.nodes.length,label=String(total===Number(r.label)?Math.max(0,Number(r.label)-1):total);return{label,feedback:total===Number(r.label)?"This counts links instead of car nodes, giving one less on a straight train.":"This adds cars from separate trains instead of taking the longest one.",misconception:total===Number(r.label)?"count-edges":"sum-separate-trains"}}},trainGrids));
}
{
  const facets=["exact cave cells","position identity","four-way danger","revealed drill label"];
  const caves=[{r:["UG","GU"],d:[0,0]},{r:["UUU","UGU","UUU"],d:[0,0]},{r:["GGU","UUU"],d:[1,1]},{r:["U"],d:[0,0]},{r:["G"],d:[0,0]},{r:["UGU"],d:[0,2]},{r:["UU","GU"],d:[0,1]},{r:["GUG","UUU"],d:[1,1]},{r:["UUU","UUG"],d:[0,0]}];
  const cases=caves.map((x,i)=>{const labels=[],edges=[];for(let r=0;r<x.r.length;r++)for(let c=0;c<x.r[r].length;c++)labels.push(`(${r},${c})=${x.r[r][c]}`);const model=canvas(false,labels,[]);const byPos=(r,c)=>labels.find(z=>z.startsWith(`(${r},${c})=`));for(let r=0;r<x.r.length;r++)for(let c=0;c<x.r[r].length;c++)for(const[dr,dc]of[[1,0],[0,1]])if(byPos(r+dr,c+dc))model.edges.push({from:byPos(r,c),to:byPos(r+dr,c+dc)});const[r,c]=x.d;if(x.r[r][c]==="G")return task(`case-${i+1}`,"Drill a gas cell","revealed drill label",`cave=${JSON.stringify(x.r)}, drill=(${r},${c})`,model,"What does the drilled cell become?","X",bug("G","This leaves the drilled gas pocket unchanged instead of marking the rupture X.","fail-to-rupture-drilled-gas"),"A drilled gas pocket changes from G to X and the reveal stops.");let count=0;for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]])if(x.r[r+dr]?.[c+dc]==="G")count++;const ans=count?String(count):"S",diag=(()=>{let q=0;for(const[dr,dc]of[[-1,-1],[-1,1],[1,-1],[1,1]])if(x.r[r+dr]?.[c+dc]==="G")q++;return q})();let wrong=count?String(Math.max(0,count-1)):(diag?String(diag):"0");if(wrong===ans)wrong="U";return task(`case-${i+1}`,"Survey a fresh drill cell","four-way danger",`cave=${JSON.stringify(x.r)}, drill=(${r},${c})`,model,"What label is written at the drilled cell?",ans,bug(wrong,count?"This stops after the first gas neighbor and misses another side direction.":diag?"This borrows the eight-neighbor Minesweeper rule and counts diagonal gas.":"This writes numeric zero instead of the required safe label S.",count?"stop-after-first-neighbor":diag?"count-diagonal-gas":"zero-instead-of-safe"),count?`Exactly ${count} side-adjacent gas cell${count===1?"":"s"} must be counted.`:"No side-adjacent gas exists, so the drill cell is safe S.")});
  install("gas-pocket-survey",facets,cases);
}

const nestedInputs=[ [1,[2,3],[[4]]], [[],1,[2,[]]], [[3,2],5,[[4]]], [7], [1,[4,[6]]], [[-3,3],[0]], [[],[5]], [[1],2,[3]], [0,[0,[9]]] ];
function nestedModel(value){const nodes=[],edges=[];function walk(v,path,parent){const id=path||"root",label=Array.isArray(v)?`${path||"root"}=[]`:`${path}=${v}`;nodes.push({id,label});if(parent)edges.push({from:parent,to:id});if(Array.isArray(v))v.forEach((child,i)=>walk(child,`${path||"root"}[${i}]`,id))}walk(value,"",null);return{directed:true,nodes,edges}}
function levelStats(value){const counts=new Map(),sums=new Map();function walk(v,d){if(Array.isArray(v))v.forEach(x=>walk(x,d+1));else{counts.set(d,(counts.get(d)||0)+1);sums.set(d,(sums.get(d)||0)+Number(v))}}walk(value,0);return{counts,sums}}
{
  const facets=["exact nesting","item identity","direct containment","busiest depth"];
  const cases=nestedInputs.map((value,i)=>{const st=levelStats(value),levels=[...st.counts.keys()],best=levels.sort((a,b)=>(st.counts.get(b)-st.counts.get(a))||a-b)[0]??1;let wrong=best+1;if(!st.counts.has(best+1))wrong=Math.max(0,best-1);if(wrong===best)wrong=best+1;return task(`case-${i+1}`,"Fresh shelf nesting","busiest depth",`items=${JSON.stringify(value)}`,nestedModel(value),"Which depth contains the most integer items?",String(best),bug(String(wrong),st.counts.get(wrong)===st.counts.get(best)?"This chooses the deeper depth when tied instead of the required shallower depth.":"This shifts integer depth when crossing an array container.",st.counts.get(wrong)===st.counts.get(best)?"prefer-deeper-tie":"off-by-one-depth"),`Depth ${best} contains ${st.counts.get(best)||0} integer item${st.counts.get(best)===1?"":"s"}, more than any other depth; ties favor shallower depth.`)});
  install("busiest-shelf-level",facets,cases);
}
{
  const facets=["exact nesting","coin identity","direct containment","exact level sum"];
  const cases=nestedInputs.map((value,i)=>{const st=levelStats(value),levels=[...st.sums.keys()].sort((a,b)=>a-b),k=levels[i%Math.max(1,levels.length)]||1,ans=st.sums.get(k)||0;let cumulative=[...st.sums].filter(([d])=>d<=k).reduce((s,[,v])=>s+v,0),wrong=cumulative===ans?(st.sums.get(k+1)||ans+1):cumulative;return task(`case-${i+1}`,"Fresh coin nesting","exact level sum",`items=${JSON.stringify(value)}, k=${k}`,nestedModel(value),"What sum is returned for exactly level k?",String(ans),bug(String(wrong),cumulative===ans?"This includes coins one level deeper than k.":"This adds coins from shallower levels instead of only level k.",cumulative===ans?"include-deeper-level":"cumulative-through-k"),`The integers at exactly depth ${k} sum to ${ans}.`)});
  install("coins-on-level-k",facets,cases);
}

const directedShapes=[
 {n:5,e:[[0,1],[0,2],[1,3],[2,3],[3,4]]},{n:4,e:[[0,1],[1,2],[2,3]]},{n:5,e:[[0,1],[0,2],[1,4],[2,3]]},{n:1,e:[]},{n:5,e:[[0,1],[1,4],[0,2],[2,4]]},{n:4,e:[[0,1],[0,2],[1,3],[2,3]]},{n:5,e:[[0,1],[1,2],[3,4]]},{n:4,e:[[0,3],[0,1],[1,2],[2,3]]},{n:5,e:[[0,1],[1,2],[2,4]]}
];
function directedModel(s,labels){return{directed:true,nodes:Array.from({length:s.n},(_,i)=>({id:String(i),label:String(labels?.[i]??i)})),edges:s.e.map(([from,to])=>({from:String(from),to:String(to)}))}}
function paths(s,start,target){const adj=Array.from({length:s.n},()=>[]);for(const[a,b]of s.e)adj[a].push(b);const out=[];function go(x,p,seen){if(x===target){out.push(p);return}for(const y of adj[x])if(!seen.has(y))go(y,[...p,y],new Set([...seen,y]))}go(start,[start],new Set([start]));return out}
{
  const facets=["exact directed roads","checkpoint identity","arrow direction","routes through cart"];
  const cases=directedShapes.map((s,i)=>{const cart=s.n===1?0:Math.min(1,s.n-1),all=paths(s,0,s.n-1),valid=all.filter(p=>p.includes(cart));let wrong=all.length;if(wrong===valid.length)wrong=Math.max(0,valid.length-1);return task(`case-${i+1}`,"Fresh delivery DAG","routes through cart",`roads=${JSON.stringify(Array.from({length:s.n},(_,n)=>s.e.filter(e=>e[0]===n).map(e=>e[1])))}, start=0, customer=${s.n-1}, coffeeCart=${cart}`,directedModel(s),"How many complete customer routes should be returned?",String(valid.length),bug(String(wrong),all.length!==valid.length?"This returns every start-to-customer route without filtering for the coffee cart.":"This stops after the first qualifying route and misses another branch.",all.length!==valid.length?"ignore-required-checkpoint":"stop-after-first-route"),`${valid.length} complete route${valid.length===1?"":"s"} reaches the customer after visiting checkpoint ${cart}.`)});
  install("routes-past-the-coffee-cart",facets,cases);
}
{
  const facets=["exact room keys","room identity","key-arrow direction","reachable gold sum"];
  const cases=directedShapes.map((s,i)=>{const gold=Array.from({length:s.n},(_,j)=>(j+1)*(i%3+1)),adj=Array.from({length:s.n},(_,n)=>s.e.filter(e=>e[0]===n).map(e=>e[1]));let seen=new Set([0]),q=[0];while(q.length){let x=q.shift();for(const y of adj[x])if(!seen.has(y)){seen.add(y);q.push(y)}}let ans=[...seen].reduce((sum,x)=>sum+gold[x],0),all=gold.reduce((a,b)=>a+b,0),direct=[0,...adj[0]].filter((x,k,a)=>a.indexOf(x)===k).reduce((sum,x)=>sum+gold[x],0);let wrong=all===ans?direct:all;if(wrong===ans)wrong=Math.max(0,ans-gold[0]);return task(`case-${i+1}`,"Fresh dungeon keys","reachable gold sum",`rooms=${JSON.stringify(adj)}, gold=${JSON.stringify(gold)}`,directedModel(s,gold.map((g,j)=>`${j}:${g}g`)),"How much gold is collected starting in room 0?",String(ans),bug(String(wrong),all!==ans?"This sums gold in rooms that no key chain from room 0 can open.":"This counts only room 0 and its direct keys, stopping before later rooms.",all!==ans?"count-unreachable-gold":"direct-rooms-only"),`The rooms reachable from 0 contain ${ans} total gold, counted once each.`)});
install("dungeon-gold-run",facets,cases);
}

// Final misconception audit for boundary cases where two bug formulas happen to tie.
function everyBuild(id){const p=lessons.find(x=>x.id===id);return [...p.buildTasks,...p.conceptTasks.map(x=>x.remedial)]}
for(const q of everyBuild("counting-constellations"))if(q.input==='sky=[[1]]'){
  q.decision.choices[1]={id:"bug",label:"0",feedback:"This drops an isolated star because it has no neighboring star.",misconception:"omit-isolated-star"};
}
for(const q of everyBuild("counting-constellations"))if(q.input==='sky=[[1,0,0],[0,0,0],[0,0,1]]'){
  q.decision.choices[1]={id:"bug",label:"1",feedback:"This joins the two stars merely because they lie on the same long diagonal, even though they do not touch.",misconception:"connect-any-same-diagonal"};
}
for(const q of everyBuild("routes-past-the-coffee-cart")){
  const [right,wrong]=q.decision.choices;
  if(right.label==="1"&&wrong.label==="0"){wrong.feedback="This reaches the customer after the coffee cart but forgets to append the completed route.";wrong.misconception="fail-to-record-complete-route"}
  if(right.label==="0"&&wrong.label==="1"){wrong.feedback="This saves a prefix that visits the coffee cart even though that prefix never reaches the customer.";wrong.misconception="record-incomplete-prefix"}
}
for(const q of everyBuild("villages-without-wells"))if(q.input.includes('n=3, roads=[], wells=[]')){
  q.decision.choices[1]={id:"bug",label:"0",feedback:"This returns early when the well list is empty instead of adding one well to each isolated village component.",misconception:"empty-wells-early-return"};
}
for(const q of everyBuild("counting-docked-boats")){
  q.decision.choices[1].feedback="This either counts separate B cells or overlooks a border-touching component instead of counting connected boats that touch any border.";
  q.decision.choices[1].misconception="count-cells-or-check-one-border";
}
for(const q of everyBuild("counting-docked-boats"))if(q.input==='marina=["BB.","...",".B."]'){
  q.decision.choices[1]={id:"bug",label:"3",feedback:"This counts the three B cells separately, but the two touching top cells are one boat.",misconception:"count-boat-cells"};
}
{
  const fixes=new Map([
    ['marina=["B...B",".....","..B..",".....","BB..."]',{label:"4",feedback:"This counts the fully offshore center boat along with the three boats that touch a border.",misconception:"count-offshore-boats"}],
    ['marina=["B.B"]',{label:"1",feedback:"This merges separate border cells into one boat merely because both touch the same border.",misconception:"merge-same-border-components"}],
    ['marina=["B"]',{label:"0",feedback:"This drops a one-cell boat because it has no neighboring B cell.",misconception:"drop-single-cell-boat"}],
    ['marina=["B.","..",".B"]',{label:"0",feedback:"This drops both one-cell boats because neither has a neighboring B cell.",misconception:"drop-single-cell-boats"}],
    ['marina=["B..","...","..B"]',{label:"0",feedback:"This drops both one-cell boats because neither has a neighboring B cell.",misconception:"drop-single-cell-boats"}]
  ]);
  for(const q of everyBuild("counting-docked-boats"))if(fixes.has(q.input))q.decision.choices[1]={id:"bug",...fixes.get(q.input)};
}
for(const q of everyBuild("coins-on-level-k"))if(q.input==='items=[7], k=1'){
  q.decision.choices[1]={id:"bug",label:"8",feedback:"This adds 1 for the outer array container as though the container were a coin.",misconception:"count-container-as-coin"};
}
for(const q of everyBuild("coins-on-level-k"))if(q.input==='items=[[-3,3],[0]], k=2'){
  q.decision.choices[1]={id:"bug",label:"1",feedback:"This adds 1 for a nested array container even though only integer coins contribute.",misconception:"count-container-as-coin"};
}
for(const q of everyBuild("gas-pocket-survey"))if(q.input==='cave=["GGU","UUU"], drill=(1,1)'){
  q.decision.choices[1]={id:"bug",label:"2",feedback:"This counts the diagonal gas at (0,0) along with the one side-adjacent gas cell.",misconception:"count-diagonal-gas"};
}
for(const q of everyBuild("gas-pocket-survey"))if(q.input==='cave=["UGU"], drill=(0,2)'){
  q.decision.choices[1]={id:"bug",label:"0",feedback:"This checks only down and right, so it misses the gas immediately to the drilled cell's left.",misconception:"skip-left-neighbor"};
}
for(const q of everyBuild("dungeon-gold-run"))if(q.input==='rooms=[[]], gold=[1]'){
  q.decision.choices[1]={id:"bug",label:"0",feedback:"This sums only newly unlocked rooms and forgets that room 0 is already open and its gold counts.",misconception:"exclude-start-room"};
}
{
  const lesson=lessons.find(item=>item.id==="longest-freight-train");
  const picture=lesson.conceptTasks.find(task=>task.id==="concept-picture");
  picture.choices[1].model.edges=[{from:"r0c0",to:"r2c2"}];
  picture.choices[1].feedback="This invents a diagonal connection between distant train cars.";
  picture.choices[1].misconception="connect-distant-cars";
  picture.choices[2].model.nodes.push({id:"r1c1",label:"(1,1)"});
  picture.choices[2].feedback="This adds an empty yard square as a train car.";
  picture.choices[2].misconception="include-empty-square";
  const output=lesson.conceptTasks.find(task=>task.id==="concept-output");
  output.input='yard=["T..","T.T","..T","..T"]';
  output.prompt="This yard has two vertical trains. What longest train length is returned?";
  const counterexample=lesson.conceptTasks.find(task=>task.id==="concept-counterexample");
  counterexample.input='yard=["TTT.","....",".TTT"]';
}
{
  const lesson=lessons.find(item=>item.id==="counting-constellations");
  lesson.conceptTasks.find(task=>task.id==="concept-node").input="sky=[[1,0,1],[0,1,0],[0,0,1]]";
  lesson.conceptTasks.find(task=>task.id==="concept-edge").input="sky=[[1,0,1],[0,1,0],[0,0,1]]";
  lesson.conceptTasks.find(task=>task.id==="concept-output").input="sky=[[1,0,0,0,1],[0,1,0,0,0],[0,0,0,1,0],[0,0,0,0,1]]";
  lesson.conceptTasks.find(task=>task.id==="concept-counterexample").input="sky=[[0,1,0],[1,0,1],[0,1,0]]";
}
{
  const lesson=lessons.find(item=>item.id==="counting-docked-boats");
  const output=lesson.conceptTasks.find(task=>task.id==="concept-output");
  output.input='marina=[[".","B","B",".",".","."],[".",".",".",".",".","."],["B",".","B",".","B","."],["B",".",".",".","B","."],["B",".",".",".",".","."]]';
  output.prompt="How many side-connected boats in this marina touch any border?";
  lesson.conceptTasks.find(task=>task.id==="concept-counterexample").input='marina=[["B",".","B","B"]]';
}
{
  const lesson=lessons.find(item=>item.id==="gas-pocket-survey");
  lesson.conceptTasks.find(task=>task.id==="concept-output").input='cave=[["U","G"],["G","U"]], row=0, col=0';
  lesson.conceptTasks.find(task=>task.id==="concept-counterexample").input='cave=[["U","U","U","U"],["U","G","U","U"],["U","U","U","U"]], row=0, col=3';
}

fs.writeFileSync(file,JSON.stringify(normalizeGridNodeLabels(lessons, specs),null,2)+"\n");
console.log("Installed semantic Variant overrides.");
