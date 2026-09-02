const fs=require("fs");
const { normalizeGridNodeLabels } = require("./normalize-grid-node-labels");
const file="visual-lessons-variant.json";
const lessons=JSON.parse(fs.readFileSync(file,"utf8"));
const specs=JSON.parse(fs.readFileSync("visual-specs-variant.json","utf8"));
const get=(problemId,conceptId)=>lessons.find(x=>x.id===problemId).conceptTasks.find(x=>x.id===conceptId);
const setPrompt=(problemId,conceptIds,prompt)=>conceptIds.forEach(id=>{get(problemId,id).prompt=prompt});

setPrompt("package-to-the-outpost",["concept-output","concept-bug"],"What total road time lies on the unique route from hq to target?");
setPrompt("perfect-size-campsites",["concept-output","concept-bug"],"How many side-connected grass components have exactly k cells?");
setPrompt("count-routes-to-summit",["concept-output","concept-bug"],"How many directed paths run from camp 0 to the summit at node n−1?");
setPrompt("save-the-date-phone-chain",["concept-output","concept-bug"],"Using the caller wait times cumulatively, how many people hear by the deadline?");
setPrompt("shut-the-garden-valve",["concept-output","concept-bug"],"How much total flow belongs to shutId and every sprinkler below it?");
setPrompt("kth-song-in-playlist",["concept-output","concept-bug"],"After recursively flattening folders left-to-right, which song is at position k?");
setPrompt("museum-vault-keyring",["concept-output","concept-bug"],"How many distinct vaults can the starting keyring eventually open?");
setPrompt("top-of-the-pile",["concept-output","concept-bug"],"What is the sum of all integers at the shallowest depth that contains any integer?");

const biggestOutput=get("biggest-study-group","concept-output");
biggestOutput.input="worked=[[1,1,0,1,0,0,0],[1,1,1,0,0,0,0],[0,1,1,1,0,0,0],[1,0,1,1,0,0,0],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0],[0,0,0,0,0,0,1]]";
biggestOutput.prompt="What largest study-group size is returned from this worked-together matrix?";
const biggestBug=get("biggest-study-group","concept-counterexample");
biggestBug.input="worked=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]";
biggestBug.prompt="What largest study-group size is returned from this worked-together matrix?";

fs.writeFileSync(file,JSON.stringify(normalizeGridNodeLabels(lessons, specs),null,2)+"\n");
console.log("Applied blind Variant review fixes.");
