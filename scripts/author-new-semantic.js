const fs = require("fs");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");

const target = "visual-lessons-new.json";
const existing = JSON.parse(fs.readFileSync(target, "utf8"));
const specs = new Map(JSON.parse(fs.readFileSync("visual-specs-new.json", "utf8")).map(x => [x.id, x]));
const clone = x => JSON.parse(JSON.stringify(x));
const ch = (id, label, feedback, misconception = null) => ({ id, label, feedback, misconception });
const cv = (directed, nodes, edges = []) => ({ directed, nodes: nodes.map(([id,label]) => ({id,label})), edges: edges.map(([from,to,label]) => ({from,to,...(label == null ? {} : {label:String(label)})})) });

function gridModel(matrix, keep, directions) {
  const nodes = [], edges = [], ids = new Set();
  matrix.forEach((row,r) => row.forEach((value,c) => { if (keep(value,r,c)) { const id=`r${r}c${c}`; ids.add(id); nodes.push([id,`(${r},${c})=${value}`]); } }));
  for (const [id] of nodes) {
    const [,rs,cs]=id.match(/^r(\d+)c(\d+)$/), r=Number(rs), c=Number(cs);
    for (const [dr,dc] of directions) { const other=`r${r+dr}c${c+dc}`; if (ids.has(other) && id < other) edges.push([id,other]); }
  }
  return cv(false,nodes,edges);
}
const four=[[1,0],[-1,0],[0,1],[0,-1]], eight=[...four,[1,1],[1,-1],[-1,1],[-1,-1]];
const allGrid = rows => gridModel(rows.map(row=>[...row]),()=>true,four).withSame;
function sameGrid(rows) {
  const matrix=rows.map(row=>[...row]);
  const model=gridModel(matrix,()=>true,[]); const byId=new Map(model.nodes.map(n=>[n.id,n.label.split("=").pop()]));
  for(const node of model.nodes){const [,rs,cs]=node.id.match(/^r(\d+)c(\d+)$/),r=+rs,c=+cs;for(const [dr,dc] of [[1,0],[0,1]]){const other=`r${r+dr}c${c+dc}`;if(byId.get(other)===byId.get(node.id))model.edges.push({from:node.id,to:other});}}
  return model;
}
function nestedModel(value) {
  const nodes=[],edges=[];
  const walk=(item,path,parent)=>{const id=path||"root", is=Array.isArray(item), label=is?(path?`${path} array`:`outer array`):`${path}=${JSON.stringify(item)}`;nodes.push([id,label]);if(parent)edges.push([parent,id]);if(is)item.forEach((child,i)=>walk(child,path?`${path}[${i}]`:`[${i}]`,id));}; walk(value,"",null); return cv(true,nodes,edges);
}
function subModel(g1,g2){const m=gridModel(g2,v=>v===1,four);m.nodes.forEach(n=>{const [,r,c]=n.id.match(/^r(\d+)c(\d+)$/);n.label=`(${r},${c}) g2=1 · g1=${g1[+r][+c]}`;});return m;}
function q(prompt, correct, wrong, bug, why){return {prompt,choices:[ch("correct",correct,`Correct. ${why}`),ch("wrong",wrong,`That follows the ${bug.replaceAll("-"," ")} bug.`,bug)],correct:"correct"};}
function cs(input, canvas, correct, wrong, bug, why, prompt="What should the function return?"){return {input,canvas,decision:q(prompt,correct,wrong,bug,why),why};}
function exactOptions(model){const omit=clone(model);const removed=omit.nodes.pop();omit.edges=omit.edges.filter(e=>e.from!==removed?.id&&e.to!==removed?.id);const missing=clone(model);missing.edges.pop();const relation=clone(model);if(relation.directed&&relation.edges.length){const keys=new Set(relation.edges.map(e=>`${e.from}>${e.to}`));const edge=relation.edges.find(e=>!keys.has(`${e.to}>${e.from}`));if(edge)[edge.from,edge.to]=[edge.to,edge.from];else{outer:for(const a of relation.nodes)for(const b of relation.nodes)if(a.id!==b.id&&!keys.has(`${a.id}>${b.id}`)){relation.edges.push({from:a.id,to:b.id});break outer;}}}else relation.directed=true;return [
  {...ch("exact","Picture A","Correct. It matches the raw input exactly."),model:clone(model)},
  {...ch("omit","Picture B","This drops an item that still belongs in the picture.","drop-final-node"),model:omit},
  {...ch("missing","Picture C","This stops reading the raw input one relation too soon.","drop-final-edge"),model:missing},
  {...ch("direction","Picture D","This changes whether direct relations are arrows or two-way links.","wrong-direction-rule"),model:relation}
];}
function normalized(question){return {prompt:question.prompt,choices:clone(question.choices),correct:question.correct};}
function promptInput(prompt){const code=[...prompt.matchAll(/`([^`]+)`/g)].map(match=>match[1]);return code.length?code.join("; "):prompt;}
function lesson(id, facets, cases){
  const spec=specs.get(id); if(!spec||cases.length!==9)throw new Error(`${id}: need spec and nine cases`);
  const builds=cases.slice(0,4).map((x,i)=>({id:`build-${i+1}`,title:["Build the ordinary case","Build the tempting mistake","Build every branch","Build the boundary case"][i],facet:facets[i],prompt:`Practice case ${i+1}: Infer the graph from the raw input. Then answer from your drawing.`,...clone(x)}));
  const seeds=[spec.nodeQuestion,spec.edgeQuestion,...spec.pictureQuestions].map(normalized);
  const concepts=[{id:"exact-picture",title:"Match every detail",facet:facets[0],kind:"visual-options",prompt:"Which picture exactly matches this fresh input?",input:cases[0].input,choices:exactOptions(cases[0].canvas),correct:"exact",why:"The exact picture keeps every item, direct relation, and direction rule."}];
  ["node-rule","edge-rule","predict-output","bug-trap"].forEach((cid,i)=>{const s=seeds[i];concepts.push({id:cid,title:["Protect the node rule","Protect the edge rule","Predict from a fresh picture","Catch a realistic bug"][i],facet:facets[Math.min(i+1,3)],kind:"choice",input:i<2?promptInput(s.prompt):spec.pictureQuestions[i-2].input,prompt:s.prompt,choices:s.choices,correct:s.correct,why:s.choices.find(c=>c.id===s.correct).feedback});});
  concepts.forEach((concept,i)=>{const source=cases[i+4];concept.remedial={id:`repair-${i+1}`,title:"Build a fresh proof",prompt:"Build this different raw input exactly. The revealed answer cannot help with this new case.",...clone(source)};});
  return {id,facets,buildTasks:builds,conceptTasks:concepts};
}

const records=[];

records.push(lesson("ten-kinds-of-people",["exact cells","cell identity","same-value side edges","query classification"],[
  cs('grid=["110","010"], queries=[[0,0,1,1]]',sameGrid(["110","010"]),'["decimal"]','["neither"]','search-direct-neighbors-only','The two 1 cells connect through (0,1).'),
  cs('grid=["10","01"], queries=[[0,0,1,1]]',sameGrid(["10","01"]),'["neither"]','["decimal"]','allow-diagonals','Equal diagonal cells are in different regions.'),
  cs('grid=["00","01"], queries=[[0,0,1,0],[0,0,1,1]]',sameGrid(["00","01"]),'["binary","neither"]','["binary","binary"]','ignore-value-mismatch','The first pair shares a 0-region; the second pair has different values.'),
  cs('grid=["1"], queries=[[0,0,0,0]]',sameGrid(["1"]),'["decimal"]','["neither"]','require-an-edge','A cell is connected to itself by a zero-edge path.'),
  cs('grid=["100","110"], queries=[[0,0,1,1]]',sameGrid(["100","110"]),'["decimal"]','["neither"]','stop-after-one-step','The L-shaped 1 region connects the endpoints.'),
  cs('grid=["01","00"], queries=[[0,0,1,1]]',sameGrid(["01","00"]),'["binary"]','["neither"]','miss-turning-path','The 0 route turns through (1,0).'),
  cs('grid=["11","00"], queries=[[0,0,1,0]]',sameGrid(["11","00"]),'["neither"]','["decimal"]','ignore-character-value','Adjacent cells with different characters do not connect.'),
  cs('grid=["101"], queries=[[0,0,0,2]]',sameGrid(["101"]),'["neither"]','["decimal"]','jump-across-other-value','The middle 0 splits the two 1 regions.'),
  cs('grid=["111"], queries=[[0,0,0,2]]',sameGrid(["111"]),'["decimal"]','["neither"]','check-direct-adjacency-only','Connectivity may use the middle cell.')
]));

records.push(lesson("codewars-array-deep-count",["exact nesting","occurrence identity","contains edges","deep count"],[
  cs('deepCount([1,[2]])',nestedModel([1,[2]]),'3','2','count-leaves-only','The outer array has two elements and the inner array has one.'),
  cs('deepCount([[],[[]]])',nestedModel([[],[[]]]),'3','2','ignore-empty-array-element','Both inner arrays occupy element slots, including the deepest empty array.'),
  cs('deepCount([])',nestedModel([]),'0','1','count-root-array','Only elements are counted; the argument container is not one of its own elements.'),
  cs('deepCount(["x"])',nestedModel(["x"]),'1','2','count-root-array','The one string is the only element.'),
  cs('deepCount([1,2,[3]])',nestedModel([1,2,[3]]),'4','3','count-plain-values-only','The nested array itself also occupies an outer slot.'),
  cs('deepCount([[1],2])',nestedModel([[1],2]),'3','2','ignore-inner-container','The outer slots are [1] and 2, plus inner value 1.'),
  cs('deepCount([[],1])',nestedModel([[],1]),'2','1','drop-empty-array','The empty array still counts as one outer element.'),
  cs('deepCount([[[0]]])',nestedModel([[[0]]]),'3','1','flatten-before-counting','There is one element at each of three nesting levels.'),
  cs('deepCount([1,1,[1]])',nestedModel([1,1,[1]]),'4','2','deduplicate-equal-values','Repeated values are separate occurrences, and the inner array also counts.')
]));

const open=m=>gridModel(m,v=>v!==0,four), ones8=m=>gridModel(m,v=>v===1,eight), land=m=>gridModel(m,v=>v===1,four);
records.push(lesson("gfg-grid-path-exists",["non-wall cells","cell identity","side edges","path existence"],[
  cs('grid=[[1,3,2],[0,0,0],[0,0,0]]',open([[1,3,2],[0,0,0],[0,0,0]]),'true','false','require-direct-source-target','The open 3 cell connects source to destination.'),
  cs('grid=[[1,0],[0,2]]',open([[1,0],[0,2]]),'false','true','allow-diagonals','Walls separate the diagonal endpoints.'),
  cs('grid=[[1,3,0],[0,3,2],[0,0,0]]',open([[1,3,0],[0,3,2],[0,0,0]]),'true','false','stop-at-turn','The route turns down and then right.'),
  cs('grid=[[1,2],[0,0]]',open([[1,2],[0,0]]),'true','false','require-an-intermediate-cell','The source touches the destination directly.'),
  cs('grid=[[1,3],[0,2]]',open([[1,3],[0,2]]),'true','false','miss-final-down-step','The 3 touches both endpoints by sides.'),
  cs('grid=[[1,0,2],[0,0,0],[0,0,0]]',open([[1,0,2],[0,0,0],[0,0,0]]),'false','true','walk-through-wall','The 0 cell is not a node.'),
  cs('grid=[[1,0,0],[3,0,0],[2,0,0]]',open([[1,0,0],[3,0,0],[2,0,0]]),'true','false','horizontal-only-search','Vertical side moves are legal.'),
  cs('grid=[[1,3],[3,2]]',open([[1,3],[3,2]]),'true','false','mark-before-exploring','Either side-connected branch reaches 2.'),
  cs('grid=[[1,0],[3,2]]',open([[1,0],[3,2]]),'true','false','require-straight-route','The route goes down then right.')
]));

records.push(lesson("hackerrank-connected-cells",["one-cells","cell identity","eight-way edges","largest region"],[
  cs('grid=[[1,0],[0,1]]',ones8([[1,0],[0,1]]),'2','1','use-four-directions','The diagonal 1 cells belong to one region.'),
  cs('grid=[[1,0,1]]',ones8([[1,0,1]]),'1','2','jump-across-zero','The zero splits the two cells.'),
  cs('grid=[[1,1,0],[0,1,1]]',ones8([[1,1,0],[0,1,1]]),'4','2','count-one-row-only','All four 1 cells connect, including diagonal contact.'),
  cs('grid=[[0]]',ones8([[0]]),'0','1','count-zero-cell','Zero cells are not graph nodes.'),
  cs('grid=[[1,0],[1,1]]',ones8([[1,0],[1,1]]),'3','2','miss-diagonal-or-branch','All three 1 cells share one region.'),
  cs('grid=[[1,0,1],[0,1,0]]',ones8([[1,0,1],[0,1,0]]),'3','1','use-four-directions','The center joins both top corners diagonally.'),
  cs('grid=[[1,1],[1,1]]',ones8([[1,1],[1,1]]),'4','3','exclude-start-cell','Region size includes the DFS starting cell.'),
  cs('grid=[[1,0,0],[0,0,1]]',ones8([[1,0,0],[0,0,1]]),'1','2','merge-distant-cells','The two 1 cells do not touch in any direction.'),
  cs('grid=[[1],[1],[1]]',ones8([[1],[1],[1]]),'3','1','horizontal-only-search','Vertical neighbors form one region.')
]));

records.push(lesson("count-sub-islands",["grid2 land","cell identity","side edges","full support"],[
  cs('grid1=[[1,1],[1,1]], grid2=[[1,0],[1,1]]',subModel([[1,1],[1,1]],[[1,0],[1,1]]),'1','0','reject-multi-cell-island','Every grid2 land cell is supported by grid1 land.'),
  cs('grid1=[[1,0],[1,1]], grid2=[[1,1],[1,1]]',subModel([[1,0],[1,1]],[[1,1],[1,1]]),'0','1','check-first-cell-only','The one grid2 island includes unsupported cell (0,1).'),
  cs('grid1=[[1,1],[1,1]], grid2=[[1,0],[0,1]]',subModel([[1,1],[1,1]],[[1,0],[0,1]]),'2','1','allow-diagonals','Diagonal land cells are separate islands.'),
  cs('grid1=[[0]], grid2=[[0]]',subModel([[0]],[[0]]),'0','1','count-grid1-not-grid2','Grid2 contains no island.'),
  cs('grid1=[[1,1,0]], grid2=[[1,1,1]]',subModel([[1,1,0]],[[1,1,1]]),'0','1','accept-partially-supported-island','One unsupported cell rejects the whole island.'),
  cs('grid1=[[1,0,1]], grid2=[[1,0,1]]',subModel([[1,0,1]],[[1,0,1]]),'2','1','merge-across-water','The two supported cells are separate islands.'),
  cs('grid1=[[1],[1],[0]], grid2=[[1],[1],[1]]',subModel([[1],[1],[0]],[[1],[1],[1]]),'0','1','stop-checking-before-last-cell','The bottom unsupported cell invalidates the connected island.'),
  cs('grid1=[[1,0],[0,1]], grid2=[[1,0],[0,1]]',subModel([[1,0],[0,1]],[[1,0],[0,1]]),'2','0','reject-single-cell-islands','Each single grid2 land cell is fully supported.'),
  cs('grid1=[[1,1],[0,1]], grid2=[[1,1],[0,0]]',subModel([[1,1],[0,1]],[[1,1],[0,0]]),'1','2','count-cells-not-islands','The two adjacent cells form one sub-island.')
]));

records.push(lesson("find-all-groups-of-farmland",["farmland cells","cell identity","side edges","rectangle bounds"],[
  cs('land=[[1,1],[1,1]]',land([[1,1],[1,1]]),'[[0,0,1,1]]','[[0,0,0,1],[1,0,1,1]]','split-by-row','All four cells form one rectangle.'),
  cs('land=[[1,0],[0,1]]',land([[1,0],[0,1]]),'[[0,0,0,0],[1,1,1,1]]','[[0,0,1,1]]','allow-diagonals','Diagonal cells are separate groups.'),
  cs('land=[[1,1,0],[0,0,1]]',land([[1,1,0],[0,0,1]]),'[[0,0,0,1],[1,2,1,2]]','[[0,0,1,2]]','use-global-bounding-box','Forest separates the two groups.'),
  cs('land=[[0]]',land([[0]]),'[]','[[0,0,0,0]]','treat-forest-as-farmland','There is no farmland cell.'),
  cs('land=[[1],[1],[1]]',land([[1],[1],[1]]),'[[0,0,2,0]]','[[0,0,1,0]]','off-by-one-bottom','The rectangle reaches row 2.'),
  cs('land=[[0,1,1]]',land([[0,1,1]]),'[[0,1,0,2]]','[[0,0,0,2]]','include-leading-forest','The top-left corner starts at column 1.'),
  cs('land=[[1,0,1]]',land([[1,0,1]]),'[[0,0,0,0],[0,2,0,2]]','[[0,0,0,2]]','bridge-through-forest','The middle forest cell splits the groups.'),
  cs('land=[[1,1],[0,0]]',land([[1,1],[0,0]]),'[[0,0,0,1]]','[[0,0,1,1]]','include-forest-row','The bottom boundary stays on row 0.'),
  cs('land=[[1]]',land([[1]]),'[[0,0,0,0]]','[]','drop-single-cell-group','A one-cell rectangle is valid.')
]));

function floodModel(image,sr,sc){const color=image[sr][sc];return gridModel(image,v=>v===color,four);}
records.push(lesson("flood-fill",["start-color pixels","cell identity","side edges","reachable repaint"],[
  cs('image=[[1,1],[1,0]], sr=0, sc=0, color=2',floodModel([[1,1],[1,0]],0,0),'[[2,2],[2,0]]','[[2,2],[2,2]]','paint-other-colors','Only the connected original-color region changes.'),
  cs('image=[[1,0],[0,1]], sr=0, sc=0, color=2',floodModel([[1,0],[0,1]],0,0),'[[2,0],[0,1]]','[[2,0],[0,2]]','allow-diagonals','The lower-right 1 is only diagonal.'),
  cs('image=[[1,1,0],[0,1,1]], sr=0, sc=0, color=3',floodModel([[1,1,0],[0,1,1]],0,0),'[[3,3,0],[0,3,3]]','[[3,3,0],[0,3,1]]','stop-one-step-early','The region continues through (1,1) to (1,2).'),
  cs('image=[[5]], sr=0, sc=0, color=5',floodModel([[5]],0,0),'[[5]]','[]','return-empty-on-same-color','The image stays unchanged when old and new colors match.'),
  cs('image=[[2,2],[0,2]], sr=1, sc=1, color=7',floodModel([[2,2],[0,2]],1,1),'[[7,7],[0,7]]','[[2,7],[0,7]]','miss-upward-branch','All three side-connected 2 pixels repaint.'),
  cs('image=[[1,2,1]], sr=0, sc=0, color=9',floodModel([[1,2,1]],0,0),'[[9,2,1]]','[[9,2,9]]','cross-different-color-wall','The 2 blocks the second 1.'),
  cs('image=[[3],[3],[4]], sr=0, sc=0, color=8',floodModel([[3],[3],[4]],0,0),'[[8],[8],[4]]','[[8],[3],[4]]','horizontal-only-search','Vertical side neighbors repaint.'),
  cs('image=[[1,1],[1,1]], sr=0, sc=1, color=0',floodModel([[1,1],[1,1]],0,1),'[[0,0],[0,0]]','[[1,0],[1,0]]','one-direction-only','The whole square is one connected region.'),
  cs('image=[[1,0],[1,0]], sr=0, sc=1, color=4',floodModel([[1,0],[1,0]],0,1),'[[1,4],[1,4]]','[[4,4],[4,4]]','use-wrong-start-color','The starting color is 0, so the 1 column stays unchanged.')
]));

function treeModel(values){const nodes=[],edges=[];values.forEach((value,i)=>{if(value!=null)nodes.push([`n${i}`,`node ${i}: ${value}`]);});const ids=new Set(nodes.map(x=>x[0]));values.forEach((value,i)=>{if(value==null)return;for(const child of [2*i+1,2*i+2])if(ids.has(`n${child}`))edges.push([`n${i}`,`n${child}`]);});return cv(true,nodes,edges);}
function propsModel(rows,k){const nodes=rows.map((row,i)=>[`p${i}`,`row ${i}: {${[...new Set(row)].join(",")}}`]),edges=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const a=new Set(rows[i]),b=new Set(rows[j]);if([...a].filter(x=>b.has(x)).length>=k)edges.push([`p${i}`,`p${j}`]);}return cv(false,nodes,edges);}
function plainGraph(n,edges,directed=false,labels={}){return cv(directed,Array.from({length:n},(_,i)=>[String(i),labels[i]||String(i)]),edges.map(e=>[String(e[0]),String(e[1])]));}
function closureModel(matrix){const edges=[];for(let i=0;i<matrix.length;i++)for(let j=0;j<matrix.length;j++)if(matrix[i][j])edges.push([i,j]);return plainGraph(matrix.length,edges,true);}
function restrictedModel(n,edges,restricted){const labels={};for(let i=0;i<n;i++)labels[i]=restricted.includes(i)?`${i} (restricted)`:String(i);const model=plainGraph(n,edges,false);model.nodes.forEach(node=>node.label=labels[+node.id]);return model;}

records.push(lesson("path-sum",["exact tree nodes","node identity","parent-child edges","root-to-leaf sum"],[
  cs('root level-order=[5,4,8,11,null,13,4], targetSum=20',treeModel([5,4,8,11,null,13,4]),'true','false','stop-before-leaf','Path 5→4→11 reaches a leaf and totals 20.'),
  cs('root level-order=[1,2,3], targetSum=5',treeModel([1,2,3]),'false','true','combine-sibling-values','No one root-to-leaf path totals 5.'),
  cs('root level-order=[-2,null,-3], targetSum=-5',treeModel([-2,null,-3]),'true','false','reject-negative-sums','The right root-to-leaf path totals -5.'),
  cs('root level-order=[1], targetSum=1',treeModel([1]),'true','false','require-an-edge','The root is also a leaf, so its value forms a complete path.'),
  cs('root level-order=[2,3,4], targetSum=6',treeModel([2,3,4]),'true','false','check-left-path-only','The right path 2→4 totals 6.'),
  cs('root level-order=[2,3,4], targetSum=5',treeModel([2,3,4]),'true','false','require-all-paths-match','The left path 2→3 is enough.'),
  cs('root level-order=[1,2,null,3], targetSum=3',treeModel([1,2,null,3]),'false','true','accept-nonleaf-prefix','1→2 totals 3 but node 2 has child 3, so it is not a leaf path.'),
  cs('root level-order=[0,-1,1], targetSum=-1',treeModel([0,-1,1]),'true','false','discard-zero-root','The complete left path totals 0 + -1.'),
  cs('root level-order=[3,1,1,1,null,null,5], targetSum=9',treeModel([3,1,1,1,null,null,5]),'true','false','merge-branches','The right path 3→1→5 alone totals 9.')
]));

records.push(lesson("properties-graph",["one node per row","row identity","distinct-overlap edges","component count"],[
  cs('properties=[[1,2],[2,3],[8]], k=1',propsModel([[1,2],[2,3],[8]],1),'2','1','drop-isolated-row','Rows 0 and 1 connect; row 2 is a separate component.'),
  cs('properties=[[1,1],[1,2]], k=2',propsModel([[1,1],[1,2]],2),'2','1','count-duplicate-values','The rows share only one distinct value.'),
  cs('properties=[[1,2],[2,3],[3,4]], k=1',propsModel([[1,2],[2,3],[3,4]],1),'1','2','require-a-clique','A chain still forms one component.'),
  cs('properties=[[5]], k=1',propsModel([[5]],1),'1','0','drop-isolated-row','A nonempty graph has one one-node component.'),
  cs('properties=[[1,2],[1,2]], k=2',propsModel([[1,2],[1,2]],2),'1','2','use-strictly-more-than-k','Sharing exactly k distinct values creates an edge.'),
  cs('properties=[[1],[2],[1]], k=1',propsModel([[1],[2],[1]],1),'2','3','ignore-nonadjacent-row-pair','Rows 0 and 2 connect even though their indexes are not adjacent.'),
  cs('properties=[[1,2,3],[2,3,4],[3,4,5]], k=2',propsModel([[1,2,3],[2,3,4],[3,4,5]],2),'1','2','ignore-transitive-connectivity','Edges 0-1 and 1-2 make one component.'),
  cs('properties=[[1],[2]], k=1',propsModel([[1],[2]],1),'2','1','connect-disjoint-rows','Rows with no shared property stay separate.'),
  cs('properties=[[7,7],[7],[8]], k=1',propsModel([[7,7],[7],[8]],1),'2','1','count-duplicate-as-extra-edge','Duplicate 7s do not change the one edge or the isolated third row.')
]));

records.push(lesson("reachable-nodes-with-restrictions",["all n nodes","node identity","two-way tree edges","restricted traversal"],[
  cs('n=5, edges=[[0,1],[1,2],[0,3],[3,4]], restricted=[3]',restrictedModel(5,[[0,1],[1,2],[0,3],[3,4]],[3]),'3','4','walk-through-restricted','Only 0,1,2 are reachable; node 4 is behind restricted 3.'),
  cs('n=3, edges=[[0,1],[1,2]], restricted=[1]',restrictedModel(3,[[0,1],[1,2]],[1]),'1','2','count-restricted-node','The search cannot enter node 1.'),
  cs('n=5, edges=[[1,0],[2,1],[3,2],[4,3]], restricted=[4]',restrictedModel(5,[[1,0],[2,1],[3,2],[4,3]],[4]),'4','1','treat-edges-as-directed','Every unrestricted tree edge is two-way regardless of pair order.'),
  cs('n=2, edges=[[0,1]], restricted=[1]',restrictedModel(2,[[0,1]],[1]),'1','0','omit-start-node','Starting node 0 counts even when its only neighbor is restricted.'),
  cs('n=6, edges=[[0,1],[1,2],[0,3],[3,4],[4,5]], restricted=[4]',restrictedModel(6,[[0,1],[1,2],[0,3],[3,4],[4,5]],[4]),'4','5','walk-through-restricted','Nodes 0,1,2,3 are reachable; 4 and 5 are blocked.'),
  cs('n=4, edges=[[0,1],[0,2],[0,3]], restricted=[1,2]',restrictedModel(4,[[0,1],[0,2],[0,3]],[1,2]),'2','4','ignore-restrictions','Only 0 and unrestricted child 3 count.'),
  cs('n=5, edges=[[0,1],[1,2],[2,3],[3,4]], restricted=[2]',restrictedModel(5,[[0,1],[1,2],[2,3],[3,4]],[2]),'2','3','count-first-restricted-node','Nodes 0 and 1 are reachable; restricted 2 is not.'),
  cs('n=3, edges=[[0,1],[0,2]], restricted=[2]',restrictedModel(3,[[0,1],[0,2]],[2]),'2','1','stop-after-restricted-neighbor','The legal branch to node 1 still runs.'),
  cs('n=3, edges=[[1,0],[2,1]], restricted=[2]',restrictedModel(3,[[1,0],[2,1]],[2]),'2','1','use-written-direction','The reversed pair still connects node 0 to unrestricted node 1.')
]));

records.push(lesson("transitive-closure",["matrix vertices","vertex identity","directed road edges","all reachability"],[
  cs('graph=[[0,1,0],[0,0,1],[0,0,0]]',closureModel([[0,1,0],[0,0,1],[0,0,0]]),'[[1,1,1],[0,1,1],[0,0,1]]','[[0,1,0],[0,0,1],[0,0,0]]','copy-direct-roads-only','Closure adds self reachability and the path 0→2.'),
  cs('graph=[[0,1],[0,0]]',closureModel([[0,1],[0,0]]),'[[1,1],[0,1]]','[[1,1],[1,1]]','make-roads-undirected','Node 1 cannot travel backward to 0.'),
  cs('graph=[[0,1],[1,0]]',closureModel([[0,1],[1,0]]),'[[1,1],[1,1]]','[[1,1],[0,1]]','miss-cycle-return','The two-node cycle makes both nodes mutually reachable.'),
  cs('graph=[[0]]',closureModel([[0]]),'[[1]]','[[0]]','forget-self-reachability','Every node reaches itself with zero roads.'),
  cs('graph=[[0,0],[0,0]]',closureModel([[0,0],[0,0]]),'[[1,0],[0,1]]','[[0,0],[0,0]]','omit-diagonal','Both isolated nodes still reach themselves.'),
  cs('graph=[[0,1,0],[0,0,0],[0,1,0]]',closureModel([[0,1,0],[0,0,0],[0,1,0]]),'[[1,1,0],[0,1,0],[0,1,1]]','[[1,1,1],[1,1,1],[1,1,1]]','merge-shared-destination','Sharing destination 1 does not connect sources 0 and 2.'),
  cs('graph=[[0,1,0],[0,0,1],[1,0,0]]',closureModel([[0,1,0],[0,0,1],[1,0,0]]),'[[1,1,1],[1,1,1],[1,1,1]]','[[0,1,0],[0,0,1],[1,0,0]]','direct-edges-only','A directed cycle reaches every node from every node.'),
  cs('graph=[[0,1,1],[0,0,0],[0,0,0]]',closureModel([[0,1,1],[0,0,0],[0,0,0]]),'[[1,1,1],[0,1,0],[0,0,1]]','[[1,1,1],[1,1,0],[1,0,1]]','reverse-outgoing-roads','The two sink nodes cannot return to 0.'),
  cs('graph=[[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,0,0]]',closureModel([[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,0,0]]),'[[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]]','[[1,1,0,0],[0,1,1,0],[0,0,1,1],[0,0,0,1]]','stop-after-one-edge','Closure follows the whole three-edge chain.')
]));

records.push(lesson("structy-tree-sum",["exact tree nodes","node identity","parent-child edges","sum every node"],[
  cs('root level-order=[3,11,4,4,-2,null,1]',treeModel([3,11,4,4,-2,null,1]),'21','18','skip-negative-node','Negative node -2 still belongs in the sum.'),
  cs('root level-order=[1,6,0,null,null,-4]',treeModel([1,6,0,null,null,-4]),'3','7','stop-at-zero-node','Zero is a real node and its child -4 must be visited.'),
  cs('root level-order=[5,5,5]',treeModel([5,5,5]),'15','5','deduplicate-equal-values','Equal values belong to three different node objects.'),
  cs('root level-order=[]',treeModel([]),'0','1','count-empty-root','An empty tree contributes sum 0.'),
  cs('root level-order=[-3]',treeModel([-3]),'-3','0','ignore-negative-leaf','The lone negative root is included.'),
  cs('root level-order=[2,3,null,4]',treeModel([2,3,null,4]),'9','5','sum-direct-children-only','Grandchild 4 must be visited.'),
  cs('root level-order=[1,null,2,null,null,null,3]',treeModel([1,null,2,null,null,null,3]),'6','3','follow-left-child-only','The right chain includes all three nodes.'),
  cs('root level-order=[0,-1,1]',treeModel([0,-1,1]),'0','1','discard-negative-values','Both -1 and 1 contribute and cancel.'),
  cs('root level-order=[4,2,6,1,3,5,7]',treeModel([4,2,6,1,3,5,7]),'28','16','sum-one-root-to-leaf-path','Tree sum includes every branch, not one path.')
]));

records.push(lesson("wheres-my-internet",["all houses","house identity","two-way cables","offline houses"],[
  cs('n=6, cables=[[1,2],[2,3],[3,4],[5,6]]',plainGraph(6,[[0,1],[1,2],[2,3],[4,5]],false,Object.fromEntries(Array.from({length:6},(_,i)=>[i,String(i+1)]))),'[5,6]','[]','assume-any-cable-gives-internet','Only houses in house 1’s component are online.'),
  cs('n=3, cables=[[2,1],[3,2]]',plainGraph(3,[[1,0],[2,1]],false,Object.fromEntries(Array.from({length:3},(_,i)=>[i,String(i+1)]))),'[]','[2,3]','treat-cables-as-directed','Cables work both ways.'),
  cs('n=4, cables=[[1,2]]',plainGraph(4,[[0,1]],false,Object.fromEntries(Array.from({length:4},(_,i)=>[i,String(i+1)]))),'[3,4]','[4]','report-one-per-component','Every offline house must be listed.'),
  cs('n=1, cables=[]',plainGraph(1,[],false,{0:'1'}),'[]','[1]','mark-source-offline','House 1 is the internet source.'),
  cs('n=5, cables=[[1,2],[2,3],[3,4],[4,5]]',plainGraph(5,[[0,1],[1,2],[2,3],[3,4]],false,Object.fromEntries(Array.from({length:5},(_,i)=>[i,String(i+1)]))),'[]','[5]','stop-before-last-cable','The chain reaches house 5.'),
  cs('n=5, cables=[[1,2],[3,4]]',plainGraph(5,[[0,1],[2,3]],false,Object.fromEntries(Array.from({length:5},(_,i)=>[i,String(i+1)]))),'[3,4,5]','[5]','ignore-disconnected-cabled-component','Houses 3 and 4 have a cable but no route to house 1.'),
  cs('n=4, cables=[[4,3],[3,2],[2,1]]',plainGraph(4,[[3,2],[2,1],[1,0]],false,Object.fromEntries(Array.from({length:4},(_,i)=>[i,String(i+1)]))),'[]','[2,3,4]','use-pair-order-as-direction','Reverse-listed cables still carry internet both ways.'),
  cs('n=4, cables=[]',plainGraph(4,[],false,Object.fromEntries(Array.from({length:4},(_,i)=>[i,String(i+1)]))),'[2,3,4]','[]','assume-declared-houses-online','Only source house 1 is online without cables.'),
  cs('n=3, cables=[[1,2],[2,3]]',plainGraph(3,[[0,1],[1,2]],false,Object.fromEntries(Array.from({length:3},(_,i)=>[i,String(i+1)]))),'[]','[3]','stop-before-final-cable','The final cable connects house 3 to house 1 through house 2.')
]));

function fishModel(grid){return gridModel(grid,v=>v>0,four);}
function milkModel(n,belts){const labels={};for(let i=0;i<n;i++)labels[i]=String(i+1);return plainGraph(n,belts.map(([a,b])=>[a-1,b-1]),true,labels);}
function cowModel(cows){const edges=[];for(let i=0;i<cows.length;i++)for(let j=0;j<cows.length;j++)if(i!==j){const dx=cows[i][0]-cows[j][0],dy=cows[i][1]-cows[j][1];if(dx*dx+dy*dy<=cows[i][2]*cows[i][2])edges.push([i,j]);}const labels=Object.fromEntries(cows.map((c,i)=>[i,`${i}: (${c[0]},${c[1]}) p=${c[2]}`]));return plainGraph(cows.length,edges,true,labels);}

records.push(lesson("max-area-of-island",["land cells","cell identity","side edges","largest area"],[
  cs('grid=[[1,1],[0,1]]',land([[1,1],[0,1]]),'3','2','count-one-row-only','All three side-connected land cells form one island.'),
  cs('grid=[[1,0],[0,1]]',land([[1,0],[0,1]]),'1','2','allow-diagonals','Diagonal contact does not join islands.'),
  cs('grid=[[1,1,0],[0,1,1]]',land([[1,1,0],[0,1,1]]),'4','3','stop-before-last-branch','The component continues to the lower-right cell.'),
  cs('grid=[[0]]',land([[0]]),'0','1','count-water-as-land','There is no land node.'),
  cs('grid=[[1],[1],[1]]',land([[1],[1],[1]]),'3','1','horizontal-only-search','Vertical side neighbors form one island.'),
  cs('grid=[[1,0,1]]',land([[1,0,1]]),'1','2','jump-across-water','Water separates the two cells.'),
  cs('grid=[[1,1],[1,1]]',land([[1,1],[1,1]]),'4','3','exclude-start-cell','Area includes the DFS starting cell.'),
  cs('grid=[[1,1,0],[0,0,1]]',land([[1,1,0],[0,0,1]]),'2','3','sum-separate-islands','The isolated lower-right cell is not part of the size-2 island.'),
  cs('grid=[[1,0],[1,1]]',land([[1,0],[1,1]]),'3','2','miss-turning-path','The L-shape is one side-connected component.')
]));

records.push(lesson("structy-max-root-to-leaf-path-sum",["exact tree nodes","node identity","parent-child edges","maximum complete path"],[
  cs('root level-order=[3,11,4,4,-2,null,1]',treeModel([3,11,4,4,-2,null,1]),'18','8','choose-rightmost-path','Path 3→11→4 is the maximum with sum 18.'),
  cs('root level-order=[2,-1,10,4,7]',treeModel([2,-1,10,4,7]),'12','8','stop-at-best-prefix','The complete right path 2→10 beats both left leaf paths.'),
  cs('root level-order=[-5,-2,-8]',treeModel([-5,-2,-8]),'-7','0','clamp-negative-path-to-zero','A root-to-leaf path is required even when every value is negative.'),
  cs('root level-order=[6]',treeModel([6]),'6','0','require-an-edge','The root is also a leaf.'),
  cs('root level-order=[1,2,3,10]',treeModel([1,2,3,10]),'13','4','stop-at-direct-child','Path 1→2→10 reaches the deeper leaf.'),
  cs('root level-order=[5,4,4,-10,8]',treeModel([5,4,4,-10,8]),'17','9','take-first-maximum-branch','The left-right leaf gives 5+4+8.'),
  cs('root level-order=[0,-1,1]',treeModel([0,-1,1]),'1','0','discard-zero-root','The right complete path totals 1.'),
  cs('root level-order=[2,3,null,4]',treeModel([2,3,null,4]),'9','5','accept-nonleaf-prefix','Node 3 is not a leaf; the path continues to 4.'),
  cs('root level-order=[4,2,6,1,9,5,3]',treeModel([4,2,6,1,9,5,3]),'15','13','greedy-larger-child-value','The best path is 4→2→9, not necessarily through child 6.')
]));

records.push(lesson("maximum-number-of-fish-in-a-grid",["positive water cells","cell identity","side edges","largest fish sum"],[
  cs('grid=[[2,1],[0,3]]',fishModel([[2,1],[0,3]]),'6','3','take-largest-cell-only','The three positive cells are side-connected and their fish add.'),
  cs('grid=[[2,0],[0,3]]',fishModel([[2,0],[0,3]]),'3','5','allow-diagonals','Diagonal water cells are separate components.'),
  cs('grid=[[1,2,0],[0,3,4]]',fishModel([[1,2,0],[0,3,4]]),'10','7','omit-upstream-cells','All four positive cells form one bent component.'),
  cs('grid=[[0]]',fishModel([[0]]),'0','1','count-land-cell','Land contains no fish and is not a graph node.'),
  cs('grid=[[5,0,2],[0,0,2]]',fishModel([[5,0,2],[0,0,2]]),'5','4','choose-most-cells-not-most-fish','The isolated 5 beats the two-cell component totaling 4.'),
  cs('grid=[[1,1],[1,1]]',fishModel([[1,1],[1,1]]),'4','1','take-maximum-cell','Fish are summed across the whole component.'),
  cs('grid=[[3],[4],[0]]',fishModel([[3],[4],[0]]),'7','4','horizontal-only-search','The two vertical water cells connect.'),
  cs('grid=[[2,0,2]]',fishModel([[2,0,2]]),'2','4','cross-land-gap','The zero splits the two fishing areas.'),
  cs('grid=[[1,2],[3,0]]',fishModel([[1,2],[3,0]]),'6','5','exclude-start-cell','The L-shaped component includes all three values.')
]));

records.push(lesson("usaco-milk-factory",["all stations","station identity","one-way belts","common reachable sink"],[
  cs('n=3, belts=[[1,2],[3,2]]',milkModel(3,[[1,2],[3,2]]),'2','-1','miss-common-sink','Stations 1 and 3 both send crates to station 2.'),
  cs('n=3, belts=[[2,1],[2,3]]',milkModel(3,[[2,1],[2,3]]),'-1','2','treat-belts-as-undirected','Neither leaf station can send a crate to the other.'),
  cs('n=4, belts=[[1,2],[2,3],[4,3]]',milkModel(4,[[1,2],[2,3],[4,3]]),'3','2','check-direct-belts-only','Station 1 reaches 3 through station 2, and station 4 reaches 3 directly.'),
  cs('n=1, belts=[]',milkModel(1,[]),'1','-1','require-an-incoming-belt','The only station already works for every station.'),
  cs('n=4, belts=[[1,4],[2,4],[3,4]]',milkModel(4,[[1,4],[2,4],[3,4]]),'4','1','choose-smallest-station','Every other station points to 4.'),
  cs('n=4, belts=[[1,2],[3,2],[2,4]]',milkModel(4,[[1,2],[3,2],[2,4]]),'4','2','stop-at-intermediate-merge','All crates continue from 2 to station 4.'),
  cs('n=3, belts=[[1,2],[2,3]]',milkModel(3,[[1,2],[2,3]]),'3','1','reverse-belts','The arrows flow toward station 3.'),
  cs('n=4, belts=[[1,2],[3,2],[3,4]]',milkModel(4,[[1,2],[3,2],[3,4]]),'-1','2','check-one-branch-only','Station 1 can reach 2, but station 4 cannot reach that candidate.'),
  cs('n=3, belts=[[3,2],[2,1]]',milkModel(3,[[3,2],[2,1]]),'1','3','pick-source-not-sink','Every station can follow arrows to station 1.')
]));

const minLand=m=>gridModel(m,v=>v==='L',four);
records.push(lesson("structy-minimum-island",["land cells","cell identity","side edges","smallest island"],[
  cs("grid=[['L','W'],['L','L']]",minLand([['L','W'],['L','L']]),'3','1','take-smallest-cell-value','The three L cells form one island of size 3.'),
  cs("grid=[['L','W'],['W','L']]",minLand([['L','W'],['W','L']]),'1','2','allow-diagonals','Diagonal land cells are separate size-1 islands.'),
  cs("grid=[['L','L','W'],['W','W','L']]",minLand([['L','L','W'],['W','W','L']]),'1','2','return-first-island','The later isolated cell is smaller than the first island.'),
  cs("grid=[['L']]",minLand([['L']]),'1','0','exclude-single-land-cell','The guaranteed land cell forms a size-1 island.'),
  cs("grid=[['L'],['L'],['W'],['L']]",minLand([['L'],['L'],['W'],['L']]),'1','2','ignore-last-component','The bottom isolated land cell is the minimum island.'),
  cs("grid=[['L','L'],['L','W']]",minLand([['L','L'],['L','W']]),'3','2','count-edges-not-cells','Area counts all three land cells.'),
  cs("grid=[['L','W','L']]",minLand([['L','W','L']]),'1','2','bridge-through-water','Water separates two size-1 islands.'),
  cs("grid=[['L','L'],['W','L']]",minLand([['L','L'],['W','L']]),'3','1','reset-size-at-turn','The bent side-connected cells form one island.'),
  cs("grid=[['L']]",minLand([['L']]),'1','0','exclude-start-cell','A single land cell has size 1.')
]));

records.push(lesson("moocast",["all cows","cow identity","sender-power arrows","largest relay reach"],[
  cs('cows=[[0,0,2],[2,0,2],[4,0,1]]',cowModel([[0,0,2],[2,0,2],[4,0,1]]),'3','2','count-direct-only','Cow 0 reaches 1, which relays to 2.'),
  cs('cows=[[0,0,1],[2,0,3]]',cowModel([[0,0,1],[2,0,3]]),'2','1','require-mutual-reach','Starting at cow 1 reaches cow 0 even though the reverse fails.'),
  cs('cows=[[0,0,1],[3,0,1],[6,0,1]]',cowModel([[0,0,1],[3,0,1],[6,0,1]]),'1','3','count-all-declared-cows','No cow reaches another.'),
  cs('cows=[[5,5,1]]',cowModel([[5,5,1]]),'1','0','exclude-starting-cow','The broadcast starts with one reached cow.'),
  cs('cows=[[0,0,3],[3,0,1],[4,0,1]]',cowModel([[0,0,3],[3,0,1],[4,0,1]]),'3','2','stop-after-first-transmission','Cow 0 reaches 1, and cow 1 reaches 2.'),
  cs('cows=[[0,0,2],[2,0,5],[7,0,1]]',cowModel([[0,0,2],[2,0,5],[7,0,1]]),'3','2','always-start-cow-zero-direct-only','Cow 0 relays through powerful cow 1 to cow 2.'),
  cs('cows=[[0,0,2],[3,0,3],[5,0,1]]',cowModel([[0,0,2],[3,0,3],[5,0,1]]),'3','1','always-start-at-index-zero','The best start is middle cow 1.'),
  cs('cows=[[0,0,2],[2,0,1]]',cowModel([[0,0,2],[2,0,1]]),'2','1','use-receiver-power','Only the sender cow 0 needs enough power.'),
  cs('cows=[[0,0,5],[3,4,1]]',cowModel([[0,0,5],[3,4,1]]),'2','1','use-strict-distance-bound','A cow exactly on the radius boundary is reachable.')
]));

const replacements=new Map(records.map(x=>[x.id,x]));
const output=existing.map(record=>replacements.get(record.id)||record);
for(const id of replacements.keys())if(!output.some(x=>x.id===id))throw new Error(`Missing target ${id}`);
for (const [problemId, taskIds] of Object.entries({
  "gfg-grid-path-exists": ["predict-output", "bug-trap"],
  "evaluate-boolean-binary-tree": ["predict-output", "bug-trap"],
  "path-sum": ["predict-output", "bug-trap"]
})) {
  const lessonRecord = output.find(item => item.id === problemId);
  for (const taskId of taskIds) {
    const task = lessonRecord.conceptTasks.find(item => item.id === taskId);
    task.prompt = "Which graph reasoning is correct for this case?";
    for (const item of task.choices) item.label = item.label.replace(/^(?:true|false)(?:\s+only)?\s*(?:—|because)?\s*/i, "");
  }
}
fs.writeFileSync(target,JSON.stringify(normalizeGridNodeLabels(output, [...specs.values()]),null,2)+"\n");
console.log(`Replaced ${records.length} New lessons with explicit semantic cases.`);
