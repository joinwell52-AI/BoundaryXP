import fs from 'node:fs';import{createHash}from'node:crypto';
const d='docs/reports/7plus1/7P-REPAIR-007',old='docs/reports/7plus1/7P-REPAIR-006',rt='research/7plus1-parser/v0.3-7p-repair-007';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),put=(n,v)=>fs.writeFileSync(d+'/'+n,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const c=read(old+'/COMPARISON.json');const rows=c.cases.map(c=>{const slots=Object.fromEntries(['I','O','A'].map(k=>{const s=c.slots[k];return[k,{required:s.expected_reviews.length,full:s.expected_reviews.filter(e=>e.finding==='MATCH').length,complete:s.semantic_equivalent===true,actual_status:s.actual_status,expected_status:s.expected_status,blockers:[...s.expected_reviews.filter(e=>e.finding!=='MATCH'),...s.actual_reviews.filter(e=>['FALSE_DEFINED','WRONG_BINDING','WRONG_STATUS'].includes(e.decision))]}];}));return{sample_id:c.sample_id,source_sha256:c.source_sha256,slots,joint_complete:Object.values(slots).every(s=>s.complete),first_blocker:Object.entries(slots).find(([,s])=>!s.complete)}});
put('CASE-IOA-JOINT-BASELINE.json',{authority:old+'/COMPARISON.json',sha256:sha(old+'/COMPARISON.json'),denominator:rows.length,joint:rows.filter(r=>r.joint_complete).length,rows});
const fd=read(old+'/FIRST-DIVERGENCE.json');console.log('006 divergence',JSON.stringify(fd));
for(const caseInfo of c.cases){const trace=read(caseInfo.trace_path);console.log(caseInfo.sample_id,'trace keys',Object.keys(trace));}
fs.cpSync('research/7plus1-parser/v0.3-7p-repair-006',rt,{recursive:true,errorOnExist:true,force:false});
for(const n of ['collect.mjs','non-gold-inputs.mjs'])if(!fs.existsSync(d+'/'+n))fs.writeFileSync(d+'/'+n,fs.readFileSync(old+'/'+n,'utf8').replaceAll('7P-REPAIR-006','7P-REPAIR-007').replaceAll('v0.3-7p-repair-006','v0.3-7p-repair-007'),{flag:'wx'});
console.log({joint_baseline:rows.filter(r=>r.joint_complete).length+'/9',copied:rt});
