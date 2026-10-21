// Replay immutable IR and its original acceptance without calling a model.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {calculateDirectIR} from '../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
const [output,...traces]=process.argv.slice(2);if(!output||!traces.length)throw Error('Usage: node scripts/replay-direct-ir-calculation.mjs OUTPUT_DIRECTORY TRACE...');
if(fs.existsSync(output))throw Error('REPLAY_OUTPUT_ALREADY_EXISTS');fs.mkdirSync(output,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex'),results=[];
for(const file of traces){
 const bytes=fs.readFileSync(file),trace=JSON.parse(bytes);if(!trace.ir||!trace.technical)throw Error('IR_AND_ACCEPTANCE_REQUIRED');
 const result=calculateDirectIR(trace.ir,trace.technical),id=path.basename(path.dirname(file));
 const artifact=path.join(output,id+'.calculation.json');fs.writeFileSync(artifact,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 if(hash(bytes)!==hash(fs.readFileSync(file)))throw Error('SOURCE_TRACE_CHANGED');
 results.push({run_id:id,trace_sha256:hash(bytes),ir_sha256:hash(JSON.stringify(trace.ir)),original_unchanged:true,original_status:trace.boundary_calculations?.status??null,replay_status:result.status,gaps:result.gaps,conditional_gaps:result.conditional_gaps??[],joint_result:result.joint.base.result,verification_valid:result.joint.base.verification?.valid??false,witness_branch_assumptions:result.joint.base.witness_branch_assumptions??[],counterexample_query_limit:result.counterexample_query_limit??null,calculation_sha256:hash(fs.readFileSync(artifact))});
}
const report={format:'boundx-ir-consumer-replay/1',model_calls:0,old_acceptance_preserved:true,new_model_semantic_validation:false,results};
fs.writeFileSync(path.join(output,'RESULTS.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(report));
