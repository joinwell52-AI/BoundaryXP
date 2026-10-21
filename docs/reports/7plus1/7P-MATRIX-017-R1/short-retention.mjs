import fs from 'node:fs';import assert from 'node:assert/strict';import {out,write,read,digest} from './common.mjs';
import {cases} from '../7P-SHORT-016-R2/common.mjs';import {compare} from '../7P-SHORT-016-R2/compare.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-7p-short-direct-016-r2/engine.mjs';
import {meetingAssertions} from '../../../../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/meeting-assertions.mjs';
const phase=process.argv[2];assert.ok(['short-first','short-repeat'].includes(phase)&&!fs.existsSync(out+phase));
const frozen=read(out+'IMPLEMENTATION-FREEZE.json');assert.equal(digest(frozen.local_engine),frozen.local_engine_sha256);
const fields=['semantic_nodes','relations','eligibility_decisions','boundary_ir','canonical_7plus1','proof_dag','unresolved','coverage'],rows=[];
try{for(const c of [...cases(),{id:'REF-001',source:fs.readFileSync('fixtures/7plus1/golden/REF-001/source.txt','utf8')}]){console.log('START '+phase+' '+c.id);const dir=out+phase+'/'+c.id+'/';write(dir+'source.txt',c.source);try{const doc=sourceDocument(c.source),signals=await analyze(doc),r=compileNative(doc,signals,{run_id:'017-retention:'+c.id,created_at:'2026-10-03T00:00:00.000Z'});write(dir+'trace.json',r);write(dir+'canonical-7plus1.json',r.compiler_v03.canonical_7plus1);
const comparison=c.id==='REF-001'?{assertions:meetingAssertions(r)}:compare(r,c);write(dir+'comparison.json',comparison);
const baseline=read('docs/reports/7plus1/7P-SHORT-016-R2/'+(c.id==='REF-001'?'ref-first/':'final-first/'+c.id+'/')+'trace.json').compiler_v03,g=r.compiler_v03;
const row={case_id:c.id,source_sha256:doc.source.sha256,contract:r.contract_gate_results.status,status:'EXECUTED',retained:c.id==='REF-001'?comparison.assertions.every(x=>x.pass):comparison.FULL_CASE_CLOSED,assertions_pass:comparison.assertions?.filter(x=>x.pass).length,baseline_fields:Object.fromEntries(fields.map(k=>[k,JSON.stringify(g[k])===JSON.stringify(baseline[k])]))};
if(phase==='short-repeat'){const prior=read(out+'short-first/'+c.id+'/trace.json').compiler_v03;row.repeat_fields=Object.fromEntries(fields.map(k=>[k,JSON.stringify(g[k])===JSON.stringify(prior[k])]));row.repeat=Object.values(row.repeat_fields).every(Boolean);}rows.push(row);
}catch(e){write(dir+'error.json',{message:e.message,stack:e.stack});rows.push({case_id:c.id,status:'ERROR',message:e.message});}write(out+phase+'/INDEX.json',rows);console.log(JSON.stringify(rows.at(-1)));}}finally{closeNlp();}
