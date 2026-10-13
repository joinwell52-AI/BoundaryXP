// Offline counterexample replay. Does not edit Trace, call a model, or operate a service.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {evaluateDirectObservations} from '../research/7plus1-parser/llm-first-028/direct-ir-observations.mjs';
const [traceFile,requirementId,outputFile]=process.argv.slice(2);
if(!outputFile)throw Error('Usage: node scripts/check-ir-prohibition-occurrences.mjs TRACE REQUIREMENT OUTPUT');
const bytes=fs.readFileSync(traceFile),trace=JSON.parse(bytes),hash=b=>createHash('sha256').update(b).digest('hex');
const req=trace.ir.requirements.find(r=>r.id===requirementId),pattern=trace.ir.events.find(e=>e.id===req?.subject?.id);
assert.ok(req?.modality==='FORBIDDEN'&&pattern&&!req.applicability,'This check requires an unconditional prohibition');
assert.ok(pattern.roles.every(r=>r.value.kind==='ENTITY'),'Concrete typed role fixture required');
const checks=[];
for(const event_id of [pattern.id,'synthetic-fresh-occurrence']){
 const roles={};for(const r of pattern.roles){if(roles[r.role])roles[r.role]=[roles[r.role],r.value].flat();else roles[r.role]=r.value;}
 const observation={events:[{event_id,owner_id:pattern.owner_id,operation:pattern.operation,occurred:true,roles}],closed_world:{events:true}};
 const actual=evaluateDirectObservations(trace.ir,trace.technical,observation).requirements.find(r=>r.requirement_id===requirementId);
 assert.equal(actual.result,'VIOLATED');checks.push({observation,actual});
}
assert.equal(hash(fs.readFileSync(traceFile)),hash(bytes));
const result={original_trace_sha256:hash(bytes),original_unchanged:true,new_model_calls:0,not_actual_business_execution:true,requirement_id:requirementId,checks};
fs.mkdirSync(path.dirname(outputFile),{recursive:true});fs.writeFileSync(outputFile,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
