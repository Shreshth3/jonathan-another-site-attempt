// Author concise, balanced Yes/No claims about node identity.
const fs = require('fs');
const vm = require('vm');
const sandbox = {window:{},document:{querySelector:()=>null}};
vm.runInNewContext(fs.readFileSync('visual-data.js','utf8'),sandbox);
let runtime = fs.readFileSync('visual-library.js','utf8');
runtime=runtime.replace('  start();\n})();', `window.membershipSeed=id=>{problem=allProblems.find(p=>p.id===id);problemIndex=allProblems.indexOf(problem);const source=structureSourceTasks();const task=problem.lesson.structureTasks?.[0]||source.transfers[0];return nodeMembershipClaim(task.canvas,source.node.choices.find(c=>c.id===source.node.correct),source.node,problemIndex);};\n})();`);
vm.runInNewContext(runtime,sandbox);
const positive = {};
function author(keys, text) { for(const key of keys.split('|'))positive[key]=text; }
author('treat-output-paths-as-nodes|path-as-node','A path should use existing nodes; it should not become an extra node.');
author('include-water-nodes','Water cells should stay outside the ship-cell graph.');
author('only-cycle-nodes','A course should still have a node when it belongs to no cycle.');
author('split-bomb-coordinates','A bomb’s center and radius should describe one bomb node.');
author('weight-as-node','A weight should label a connection rather than become another node.');
author('collapse-component|collapses-components|component-as-node|province-as-node|island-as-node|boat-as-node|region-as-node|confuses-components-with-nodes|confuses-region-with-node|counts-components-not-cells','Items in one connected group should keep their separate nodes.');
author('omit-list-containers|omit-list-nodes|omit-containers|omit-boxes|does-not-count-arrays','An array container should have its own node, even when it is empty.');
author('duplicate-adjacency-nodes','Repeated neighbor references should point to the same node.');
author('exclude-start-room','Holding the starting room’s key should not remove that room from the graph.');
author('include-fake-root','The parent marker 0 should not create an extra process node.');
author('omit-partial-states','The empty prefix should have a node before any letter is chosen.');
author('only-peak-nodes','Cells below a local peak should still have their own nodes.');
author('omit-integer-nodes','Each integer occurrence should have a node inside its containing array.');
author('edge-as-node|dislike-pair-as-node|street-as-node|pipe-as-node|swap-node-edge|swaps-nodes-and-edges|uses-pairs-as-nodes|road-as-node','A listed relationship should connect two nodes rather than become a node itself.');
author('letter-as-node','Equal letters at different string positions should remain separate nodes.');
author('reports-as-weights','A direct report should be an employee node rather than a waiting-time label.');
author('omit-leaf-employees','A zero waiting time should describe an employee; it should not erase their node.');
author('omit-leaves','An employee’s ID should remain its identity whether or not they manage anyone.');
author('capacity-as-state','A state node should record the water in both jugs together.');
author('merge-equal-letters','Equal letters in different cells should remain separate nodes.');
author('depth-as-node','Depth should describe an item’s position in the tree rather than create an extra node.');
author('remove-well-nodes','A village with a well should keep its node so paths through it remain visible.');
author('color-as-node','A bulb should have one node; its gold or silver color is a property.');
author('key-as-node','A key should define access between room nodes rather than become its own node.');
author('model-obstacles-only','Dry campsites should have nodes as well as flooded campsites.');
author('horizontal-only-nodes','Cells in a vertical train should each have their own node.');
author('duplicate-station-by-color','A station served by both colors should still have one station node.');
author('time-expanded-unneeded','Different possible arrival times should not create extra copies of a warehouse node.');
author('zero-passable','A non-grass square should stay outside the grass-cell graph.');
author('pre-filter-success','Camps outside successful summit routes should still have nodes.');
author('leaves-only','A legal unfinished prefix should have its own node.');
author('pre-filter-deadline','Someone who hears after the deadline should still have an employee node.');
author('matrix-cell-as-node','Each matrix row should identify one student, rather than one node per matrix entry.');
author('flatten-model-early','Playlist folders should keep their nodes before playback is flattened.');
author('key-instance-as-node','Two copies of the same key should refer to one vault node.');
author('treats-walls-as-walkable','A wall should stay outside the walkable-cell graph.');
author('uses-only-invalid-cells','A cell that passes the sub-island test should still have a land-cell node.');
author('collapses-subtree','A manager and a report should keep their separate employee nodes.');
author('confuses-value-with-node','Two tree positions with the same Boolean value should keep separate nodes.');
author('uses-scan-starts-as-nodes','A farmland group should contain one node per land cell, not just its first scanned cell.');
author('assumes-result-up-front','Cells should get nodes before the fill result is known.');
author('removes-draft-squares','A draft square should remain a node where the search may stop.');
author('drops-lower-endpoints','A ladder’s lower endpoint should have a node as well as its upper endpoint.');
author('counts-bounding-box','Water inside a land group’s bounding box should stay outside its land-cell graph.');
author('drops-negative-nodes|drops-negatives','A negative value should remain attached to its tree node.');
author('collapses-and-maxes-component','Neighboring fish cells should keep separate nodes with their own fish counts.');
author('collapses-pair','Two cows within radio range should keep their separate cow nodes.');
author('counts-only-leaf','Internal tree positions should have nodes as well as leaves.');
author('hides-restriction-boundaries','Restricted nodes should remain visible with their restriction marked.');
author('uses-matrix-entries-as-nodes','A matrix entry should describe a relation between vertex nodes.');
author('uses-pairs-as-nodes','Testing two rows for overlap should not create another node.');
const negatives = {
 'uses-pairs-as-nodes':'Each pair of rows tested for overlap should become its own node.',
 'swap-node-edge':'Each reporting relationship should become a node instead of an edge.',
 'reports-as-weights':'Direct reports should become waiting-time labels instead of employee nodes.',
 'horizontal-only-nodes':'Only train cells with a T directly left or right should become nodes.',
 'matrix-cell-as-node':'Each worked[i][j] matrix entry should become a separate student node.',
 'flatten-model-early':'Flatten the playlist first, then draw only its song nodes.',
 'time-expanded-unneeded':'A warehouse should have a separate node for every possible arrival time.',
 'pre-filter-success':'Only camps on a successful summit route should become nodes.',
 'pre-filter-deadline':'Only people who hear by the deadline should become nodes.',
 'confuses-value-with-node':'All tree positions with the same Boolean value should share one node.'
};
for(const group of ['original','variant','new']){
 const file=`visual-specs-${group}.json`, specs=JSON.parse(fs.readFileSync(file));
 for(const spec of specs){
  const claim=sandbox.window.membershipSeed(spec.id), key=spec.id==='who-keeps-their-job'?'swap-node-edge':spec.id==='time-needed-to-inform-all-employees'?'reports-as-weights':claim.misconception;
  if(!positive[key])throw new Error(`Missing authored Yes statement: ${spec.id}/${key}`);
  spec.membershipClaim={misconception:key,no:negatives[key]||claim.statement.replace(/^In this input, /,''),yes:positive[key]};
 }
 fs.writeFileSync(file,JSON.stringify(specs,null,2)+'\n');
}
console.log('Authored 75 balanced node-membership claim pairs.');
