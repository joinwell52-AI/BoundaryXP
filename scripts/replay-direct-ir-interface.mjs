// Offline replay of saved model responses. No model or network calls.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {calculateDirectIR} from '../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
const [output,...files]=process.argv.slice(2);
if(!output||!files.length)throw Error('Usage: node scripts/replay-direct-ir-interface.mjs OUTPUT_DIRECTORY TRACE_JSON ...');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
fs.mkdirSync(output,{recursive:true});const results=[];
for(const file of files){
 const bytes=fs.readFileSync(file),trace=JSON.parse(bytes),before=JSON.stringify(trace.ir);
 assert.ok(trace.ir&&trace.technical&&trace.boundary_calculations,'Complete saved Trace required');
 const calculation=calculateDirectIR(trace.ir,trace.technical);
 assert.equal(JSON.stringify(trace.ir),before);assert.equal(digest(fs.readFileSync(file)),digest(bytes));
 const id=path.basename(path.dirname(file));
 const record={run_id:id,original_trace_sha256:digest(bytes),ir_sha256:digest(before),original_unchanged:true,new_model_calls:0,
  original:{status:trace.boundary_calculations.status,gaps:trace.boundary_calculations.gaps},
  replay:{status:calculation.status,gaps:calculation.gaps,horizons:calculation.problem.temporal_horizons,verification_valid:calculation.joint.base.verification?.valid??null,verification_checks:calculation.joint.base.verification?.checks?.length??0},
  replay_is_not_new_model_acceptance:true};
 fs.writeFileSync(path.join(output,id+'.calculation.json'),JSON.stringify(calculation,null,2)+'\n',{flag:'wx'});results.push(record);
}
fs.writeFileSync(path.join(output,'RESULTS.json'),JSON.stringify(results,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(results,null,2));
