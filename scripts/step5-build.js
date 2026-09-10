/* Authoritative Step 5 programs live in step5-programs-{a,b,c}.js.
 * Oracle fixtures were executed against data/variants-final-*.json in
 * ../jonathan-study-site: all 140 source tests and 1,250 seeded varied inputs.
 */
const fs = require('fs');
const path = require('path');
const engine = require('./step5-engine');
const programs = {...require('./step5-programs-a'),...require('./step5-programs-b'),...require('./step5-programs-c')};
const fixtures = require('./step5-oracle-fixtures.json');
const helps = {
 'counting-constellations':'Use {"sky": grid}. Each grid cell is 0 or 1. Rows must have the same length.',
 'counting-docked-boats':'Use {"marina": grid}. Cells are "B" or ".". Boats must be straight and cannot touch other boats, even at corners.',
 'longest-freight-train':'Use {"yard": grid}. Cells are "T" or ".". Trains must be straight and cannot touch other trains, even at corners.',
 'perfect-size-campsites':'Use {"park": grid, "k": size}. Cells are 0 or 1; k is a positive whole number.',
 'gas-pocket-survey':'Use {"cave": grid, "row": rowNumber, "col": columnNumber}. Cells are "U" or "G". Row and column numbers start at 0.',
 'coins-on-level-k':'Use {"items": nestedList, "k": depth}. Coin values are whole numbers from −100 to 100. k is 1–50.',
 'busiest-shelf-level':'Use {"items": nestedList}. Item IDs are whole numbers from −1000 to 1000. Include at least one integer.',
 'top-of-the-pile':'Use {"items": nestedList}. Weights are whole numbers from −100 to 100. Include at least one integer.',
 'kth-song-in-playlist':'Use {"playlist": nestedList, "k": position}. Song IDs are whole numbers from 0 to 100000. k is 1–1000.',
 'who-keeps-their-job':'Use {"ids": list, "bosses": list, "quitId": employeeID}. IDs are unique positive numbers. The lists line up by position. Use exactly one boss 0; all other bosses are IDs. The chart must be a tree.',
 'shut-the-garden-valve':'Use {"ids": list, "feeds": list, "liters": list, "shutId": sprinklerID}. The three lists line up by position. IDs are unique positive numbers; liters are 1–1000. Use one feed 0 and a tree.',
 'museum-vault-keyring':'Use {"vaults": listOfKeyLists, "startKeys": keyList}. Vault and key numbers start at 0. One inner list per vault; each list has no duplicate keys.',
 'dungeon-gold-run':'Use {"rooms": listOfKeyLists, "gold": list}. One key list and one gold amount (0–1000) per room. Room numbers start at 0. No duplicate keys inside one room.',
 'office-rumor-reach':'Use {"n": employeeCount, "friendships": pairList, "start": employeeNumber}. Employee numbers run from 0 to n−1. Each friendship is [person, person], listed once.',
 'flooded-campsite-trails':'Use {"n": campsiteCount, "trails": pairList, "flooded": numberList, "start": number, "finish": number}. Campsites run from 0 to n−1. Each trail is [camp, camp].',
 'one-color-metro-ride':'Use {"n": stationCount, "tracks": pairList, "colors": colorList, "source": number, "destination": number}. Stations run from 0 to n−1. Each track is [station, station] and has one matching "red" or "blue" color.',
 'villages-without-wells':'Use {"n": villageCount, "paths": pairList, "wells": villageList}. Villages run from 0 to n−1. Each path is [village, village]; wells lists distinct village numbers.',
 'biggest-study-group':'Use {"worked": matrix}. Use a square symmetric grid of 0s and 1s, with 1 on every diagonal cell.',
 'trusted-courier-networks':'Use {"trust": matrix, "k": threshold}. The square matrix is symmetric, has scores 0–10, and has 10 on the diagonal. k is 1–10.',
 'package-to-the-outpost':'Use {"n": warehouseCount, "roads": roadList, "hq": number, "target": number}. Warehouses run from 0 to n−1. Roads are [from, to, hours], with hours 1–100. The roads must form a tree.',
 'gold-and-silver-lights':'Use {"n": bulbCount, "wires": pairList}. Bulbs run from 0 to n−1. Each wire is [bulb, bulb]. The wiring must form one tree.',
 'save-the-date-phone-chain':'Use {"n": peopleCount, "headId": number, "caller": list, "waitDays": list, "deadline": day}. People run from 0 to n−1. caller[headId] is −1; all other callers form a tree. Waits are 0–100; deadline is 0–10000.',
 'count-routes-to-summit':'Use {"graph": neighborLists}. There are 2–10 camps, numbered from 0. Each inner list contains that camp’s direct destinations. No duplicate edges or cycles.',
 'routes-past-the-coffee-cart':'Use {"graph": neighborLists, "checkpoint": number}. There are 3–10 intersections, numbered from 0. Each inner list contains direct destinations. No duplicate edges or cycles. The checkpoint is neither 0 nor the final intersection.',
 'runes-on-the-castle-door':'Use {"dials": listOfStrings}. Use 1–6 dials; each string has 1–4 distinct lowercase letters.'
};
function reorder(options,seed) {return options.map((value,index)=>({value,score:((seed+index*137)*2654435761)>>>0})).sort((a,b)=>a.score-b.score).map(entry=>entry.value);}
const output=[];
for (const [id,lines] of Object.entries(programs)) {
 const correctRules=Object.fromEntries(lines.map(line=>[line.key,line.correct]));
 const tests=fixtures[id].map(test=>({input:test.input,expected:test.expected}));
 for (const line of lines) if(line.witness) {
   const witnesses=Array.isArray(line.witness)?line.witness:[line.witness];
   for(const input of witnesses){engine.validate(id,input);tests.push({input,expected:engine.execute(id,input,correctRules)});}
 }
 for(const test of tests){engine.validate(id,test.input);if(!engine.equal(id,test.expected,engine.execute(id,test.input,correctRules)))throw Error(id+': correct program disagrees with source fixture');}
 const cases=[];
 for (let index=0;index<lines.length;index++) {
   const changed=lines[index];
   for (const bug of changed.buggy ? Array.isArray(changed.buggy)?changed.buggy:[changed.buggy] : []) {
     const rules={...correctRules,[changed.key]:bug};
     const witness=tests.find(test=>!engine.equal(id,test.expected,engine.execute(id,test.input,rules)));
     if(!witness)throw Error(id+': no valid counterexample for '+changed.key+'='+bug);
     cases.push({id:id+'-'+changed.key+'-'+bug,title:'Debug challenge '+(cases.length+1),misconception:changed.key+'-'+bug,feedback:typeof changed.feedback==='object'?changed.feedback[bug]:changed.feedback,
       correctAnswer: (typeof changed.feedback==='object'?changed.feedback[bug]:changed.feedback) + '\n\nThe corrected rule is:\n' + changed.options.find(option => option.id === changed.correct).text,
       lines:lines.map((line,lineIndex)=>({key:line.key,selected:lineIndex===index?bug:line.correct,options:reorder(line.options,cases.length*23+lineIndex*41+id.length)})),witness:witness.input});
   }
 }
 if(cases.length<2||cases.length>4)throw Error(id+': expected 2–4 meaningful bugs');
 output.push({id,inputHelp:helps[id].replace(/^Use \{.*?\}\.\s*/, '')+' Explore means visit each reachable item once unless the shown code says otherwise.',source:'../jonathan-study-site/data/variants-final-*.json',correctRules,cases,tests});
}
if(output.length!==25)throw Error('Expected exactly 25 variant Step 5 programs');
const destination=path.join(__dirname,'..','step5-specs-variant.json');
const generated=JSON.stringify(output,null,2)+'\n';
if(process.argv.includes('--check')) {
 if(!fs.existsSync(destination)||fs.readFileSync(destination,'utf8')!==generated) throw Error('Step 5 specs are stale. Run node scripts/step5-build.js.');
} else fs.writeFileSync(destination,generated);
console.log('Built Step 5: '+output.length+' variants, '+output.reduce((n,p)=>n+p.cases.length,0)+' single-bug challenges.');
