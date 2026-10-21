// Explicit schema adaptation for consumer diagnosis only; never new model accuracy.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {technicalValidate} from '../llm-first-028/validate.mjs';import {compileBoundary} from '../llm-first-028/compile.mjs';import {contractVersion} from '../llm-first-028/contracts/schema.mjs';import {sha256} from '../llm-first-028/source.mjs';import {report,old} from './prepare.mjs';
const cases=[['Q04','c3-first'],['S00','c4-rest'],['T03','c5-rest']],results=[];
for(const [id,group] of cases){
 const original=path.join(old,'runs',group,id,'run/trace.json'),prior=JSON.parse(fs.readFileSync(original)),g=structuredClone(prior.proposal),a=structuredClone(prior.audit);g.contract_version=a.contract_version=contractVersion;g.claims.forEach(c=>c.artifact_use=null);
 const checks=technicalValidate(prior.source,g,a),compiled=compileBoundary(prior.source,g,a,checks);
 assert.ok(checks.rows.every(x=>x.status==='ACCEPTED'));assert.equal(compiled.canonical.artifact_dependencies.length,0);assert.ok(compiled.canonical.artifact_associations.length>0);
 for(const key of ['I','O','A','P','R','V','C','B']){
  const meaning=x=>x.entries.map(f=>[f.kind,f.event?.id,f.event?.modality,f.claim?.id,f.claim?.role,f.entity?.id,f.constraints.map(c=>[c.id,c.kind,c.direction,c.temporal])]);
  // Old final c5 fixes P; compiled source may predate c5 and gains only explicit governing P.
  if(key!=='P')assert.deepEqual(meaning(compiled.canonical.slots[key]),meaning(prior.canonical.slots[key]),id+key);
 }
 const dest=path.join(report,'offline-captured',id);fs.mkdirSync(dest,{recursive:true});
 fs.writeFileSync(path.join(dest,'trace.json'),JSON.stringify({execution_mode:'EXPLICIT_SCHEMA_ADAPTED_OLD_RESPONSE',real_calls:0,original:{path:original,sha256:sha256(fs.readFileSync(original))},adaptation:'contract_version and null artifact_use only; no semantic binding invented',source:prior.source,proposal:g,audit:a,technical:checks,...compiled},null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(dest,'7plus1.zh.md'),compiled.chinese,{flag:'wx'});
 results.push({id,origin_sha256:sha256(fs.readFileSync(original)),identity_associations:compiled.canonical.artifact_associations.map(x=>[x.producer_result_id,x.consumer_role_id]),availability_dependencies:0,existing_temporal:g.claims.filter(c=>c.kind==='TEMPORAL').map(c=>c.id),model_calls:0,new_method_validation:false});
}
fs.writeFileSync(path.join(report,'CAPTURED-RESPONSE-CHECK.json'),JSON.stringify(results,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(results));
