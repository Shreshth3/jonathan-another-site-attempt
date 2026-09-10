const fs=require('node:fs');
const {chromium}=require('playwright');
const specs=require('../step6-specs-variant.json');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1280,height:1000}});const results=[];
 fs.mkdirSync('tmp/editor-audit',{recursive:true});
 for(const spec of specs){
 await page.goto('http://127.0.0.1:4182/'+spec.id+'?section=6');await page.locator('#coding-editor').fill(`function ${spec.functionName}(...args) { return JSON.stringify(args); }`);
 const fields=spec.parameters.map((_,i)=>page.locator('#coding-input-'+i));
 const base=[];for(const field of fields)base.push(await field.getAttribute('placeholder'));
 async function run(label,values){for(let i=0;i<fields.length;i++)await fields[i].fill(values[i]);await page.locator('#coding-run').click();await page.waitForFunction(()=>!document.querySelector('#coding-run').disabled);const output=await page.locator('#coding-results').innerText();results.push({id:spec.id,label,values,output});return output;}
 await run('placeholders',base);
 for(let i=0;i<fields.length;i++){
 const sample=spec.tests[0].args[i];const wrong=Array.isArray(sample)?'[true, null, "oops"]':'[1, 2]';const values=spec.tests[0].args.map(value=>JSON.stringify(value));values[i]=wrong;const output=await run('wrong type '+spec.parameters[i].name,values);
 if(spec.id==='villages-without-wells')await page.screenshot({path:'tmp/editor-audit/inputs-wrong-'+spec.parameters[i].name+'.png',fullPage:true});
 }
 }
 const spec=specs.find(s=>s.id==='villages-without-wells');await page.goto('http://127.0.0.1:4182/'+spec.id+'?section=6');await page.locator('#coding-editor').fill(`function ${spec.functionName}(...args) { return JSON.stringify(args); }`);
 for(const [label,values] of [['CRLF',['3','0, 1\r\n1, 2','0, 2']],['space separated edges',['3','0 1\n1 2','0']],['empty lists',['3','[]','[]']],['trailing comma',['3','[[0,1],]','[0,]']],['decimal n',['1.5','[]','[]']],['negative n',['-2','[]','[]']],['quote number',['"3"','[]','[]']]]){for(let i=0;i<3;i++)await page.locator('#coding-input-'+i).fill(values[i]);await page.locator('#coding-run').click();await page.waitForFunction(()=>!document.querySelector('#coding-run').disabled);results.push({id:spec.id,label,values,output:await page.locator('#coding-results').innerText()});}
 await page.screenshot({path:'tmp/editor-audit/inputs-boundaries.png',fullPage:true});await browser.close();const failures=results.filter(r=>(r.label==='placeholders'&&!r.output.includes('Returned'))||(r.label.startsWith('wrong type')&&r.output.includes('Returned'))||(['decimal n','negative n','quote number'].includes(r.label)&&r.output.includes('Returned')));if(failures.length)process.exitCode=1;fs.writeFileSync('tmp/editor-audit/inputs-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,placeholderFailures:results.filter(r=>r.label==='placeholders'&&!r.output.includes('Returned')),wrongTypeAccepted:results.filter(r=>r.label.startsWith('wrong type')&&r.output.includes('Returned')).length,extra:results.slice(-7)},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
