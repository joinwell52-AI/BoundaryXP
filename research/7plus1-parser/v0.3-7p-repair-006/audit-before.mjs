import fs from 'node:fs';import {scopeEvidence} from './scope-consistency.mjs';
const old=new URL('../v0.3-p2.2-meeting-repair/',import.meta.url),rows=[];
for(const name of fs.readdirSync(new URL('replay-r03/',old)).filter(x=>x.endsWith('.json'))){const r=JSON.parse(fs.readFileSync(new URL('replay-r03/'+name,old))),c=r.compiler_v03;rows.push({case_id:name.slice(0,-5),facts:scopeEvidence(c.boundary_ir,c.semantic_nodes,c.relations)});}
fs.writeFileSync(new URL('BEFORE-SCOPE-AUDIT.json',import.meta.url),JSON.stringify(rows,null,2)+'\n',{flag:'wx'});
for(const row of rows)console.log(row.case_id,row.facts.filter(f=>!f.pass).map(f=>({type:f.fact_type,objects:f.objects.map(o=>o.text),scope:f.scope_objects.map(o=>o.text),errors:f.errors})));
