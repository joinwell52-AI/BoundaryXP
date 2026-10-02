import fs from'node:fs';import{createHash}from'node:crypto';
import{sourceDocument}from'../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import{analyze,closeNlp}from'../../../../../research/7plus1-parser/v0.3-7p-closure-008/linguistic.mjs';
import{cases}from'./non-gold-declarations.mjs';
const d='docs/reports/7plus1/7P-CLOSURE-008/phase-b/non-gold';fs.mkdirSync(d,{recursive:true});
const digest=s=>createHash('sha256').update(s).digest('hex'),manifest={created_before_execution:true,cases:cases.map(c=>({...c,source_sha256:digest(c.text)})),inputs_module_sha256:digest(fs.readFileSync('docs/reports/7plus1/7P-CLOSURE-008/phase-b/non-gold-declarations.mjs'))};
const freeze=d+'/INPUTS-FROZEN.json';if(!fs.existsSync(freeze))fs.writeFileSync(freeze,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});else if(JSON.parse(fs.readFileSync(freeze)).inputs_module_sha256!==manifest.inputs_module_sha256)throw Error('FROZEN_INPUT_CHANGED');
try{for(const c of cases){const p=d+'/'+c.id+'.json';if(fs.existsSync(p))continue;try{const signals=await analyze(sourceDocument(c.text));fs.writeFileSync(p,JSON.stringify({...c,source_sha256:digest(c.text),signals},null,2)+'\n',{flag:'wx'});console.log(c.id);}catch(e){fs.writeFileSync(p,JSON.stringify({...c,error:String(e)},null,2)+'\n',{flag:'wx'});console.log(c.id+' FAILED');}}}finally{closeNlp();}
