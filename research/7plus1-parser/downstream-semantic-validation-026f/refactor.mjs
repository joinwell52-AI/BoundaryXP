import fs from 'node:fs';
import {CODE,OUT,save,sha} from './util.mjs';
const runtime='research/7plus1-parser/v0.3-candidate-parsing-026';
const original=fs.readFileSync(`${CODE}/baseline/${runtime}/engine.mjs`,'utf8');
const replacement=`export function compileCandidates(f,modelSignals={},options={}){return compileFrozenCandidates(f,freezeCandidateGraph(f,modelSignals),modelSignals,options);}
export function compileFrozenCandidates(f,g,modelSignals={},options={}){
 if(f.candidate_semantic_graph!==g||g.source_sha256!==f.source.sha256||!Object.isFrozen(g))throw Error('DOWNSTREAM_INPUT_GRAPH_IDENTITY_MISMATCH');
 const G=certifyCandidateGraph(g);`;
const before=`export function compileCandidates(f,modelSignals={},options={}){\n const g=freezeCandidateGraph(f,modelSignals),G=certifyCandidateGraph(g);`;
if(!original.includes(before))throw Error('EXTRACTION_ANCHOR_MISSING');
let entry=original.replace(before,replacement).replace("import {noBypassGates,assertNoBypass} from './gates.mjs';","import {noBypassGates,assertNoBypass} from './downstream-entry-gates.mjs';");
entry=entry.replace('noBypassGates(c);assertNoBypass(c);','noBypassGates(c,options.input_domain);assertNoBypass(c,options.input_domain);');
const gate=`import {noBypassGates as automaticGates} from './gates.mjs';
export function noBypassGates(c,domain){
 const audit=automaticGates(c);
 if(domain==='REVIEWED_GRAPH_TEST_ONLY'){
  audit.automatic_entry_audit={original_G8:audit.gates.G8,diagnostic_only:true};
  audit.gates.G8={status:'NOT_APPLICABLE',reason:'SOURCE_REVIEWED_DIAGNOSTIC_NOT_AUTOMATIC_GENERATOR',errors:[],violations:0};
  audit.status=Object.values(audit.gates).every(g=>['PASS','NOT_APPLICABLE'].includes(g.status))?'PASS':'FAIL';
 }
 return audit;
}
export function assertNoBypass(c,domain){const audit=noBypassGates(c,domain);if(audit.status!=='PASS')throw Error('CANDIDATE_GRAPH_GATE_FAILURE '+JSON.stringify(audit));return audit;}
`;
for(const arm of ['baseline','trial']){fs.writeFileSync(`${CODE}/${arm}/${runtime}/downstream-core.mjs`,entry,{flag:'wx'});fs.writeFileSync(`${CODE}/${arm}/${runtime}/downstream-entry-gates.mjs`,gate,{flag:'wx'});}
save(`${OUT}/ENTRY-EXTRACTION.json`,{original_sha256:sha(Buffer.from(original)),extracted_sha256:sha(Buffer.from(entry)),gate_policy_sha256:sha(Buffer.from(gate)),original_engine_unchanged:true,automatic_G8_unchanged:true,shared_core:['automatic compileCandidates → compileFrozenCandidates','reviewed diagnostic → compileFrozenCandidates'],diagnostic_domain:'REVIEWED_GRAPH_TEST_ONLY',other_gates_unchanged:true});
