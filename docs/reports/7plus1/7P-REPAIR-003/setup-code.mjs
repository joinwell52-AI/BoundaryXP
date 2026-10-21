import fs from 'node:fs';
const root='research/7plus1-parser/v0.3-7p-repair-003';
function edit(file,fn){const p=root+'/'+file;fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('engine.mjs',s=>s.replace("import {structuredRecovery}","import {closeSemanticGraph} from './graph-closure.mjs';\nimport {structuredRecovery}").replace('structuredRecovery(f);','structuredRecovery(f);closeSemanticGraph(f);').replaceAll('v0.3-7p-repair-002-r03','v0.3-7p-repair-003').replaceAll("'0.3-7p-repair-002-r03'","'0.3-7p-repair-003'"));
edit('projection.mjs',s=>s.replace("import {id,SLOTS}","import {queryGraph} from './graph-queries.mjs';\nimport {id,SLOTS}").replace("ir.facts.filter(f=>map[f.fact_type]===slot)","queryGraph(slot,ir,nodes)"));
for(const p of ['history.mjs','export.mjs','web/native-app.js','README.md'])if(fs.existsSync(root+'/'+p))edit(p,s=>s.replaceAll('v0.3-7p-repair-002-r03','v0.3-7p-repair-003'));
