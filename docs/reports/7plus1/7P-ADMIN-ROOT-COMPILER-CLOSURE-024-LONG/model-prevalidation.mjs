import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {prepareCandidates} from '../../../../research/7plus1-parser/v0.3-admin-root-024/candidates.mjs';
import {candidateModelEvidence} from '../../../../research/7plus1-parser/v0.3-admin-root-024/model-evidence.mjs';
import {compileCandidates} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
import {write} from './audit-tools.mjs';
const name=process.argv[2];if(!/^r\d{2}$/u.test(name))throw Error('REVISION_REQUIRED');
// Declare the full non-Gold input and hypothesis contract before any model run.
const cases=[
 {id:'PRE-1',text:'若温度超限必须停止风扇检查。',condition:true,modality:'REQUIRED'},
 {id:'PRE-2',text:'未经 AUDITOR 批准不得读取 opal.csv。',condition:true,modality:'FORBIDDEN'},
 {id:'PRE-3',text:'AUDITOR must read quartz.csv.',condition:false,modality:'REQUIRED'},
 {id:'PRE-4',text:'The task must not send mica.csv to COUNCIL.',condition:false,modality:'FORBIDDEN'}
];write('model-prevalidation/'+name+'/DECLARED-CASES.json',{non_gold:true,cases,thresholds:'FROZEN_P0_POLICY',no_case_changes_after_execution:true});
try{for(const item of cases){const d=sourceDocument(item.text),f=prepareCandidates(d,await analyze(d)),models=await candidateModelEvidence(f),r=compileCandidates(f,models);write('model-prevalidation/'+name+'/'+item.id+'.json',r);console.log(JSON.stringify({id:item.id,actually_loaded:models.models.map(m=>m.resource),diagnostics:models.diagnostics,unknown:r.compiler_v03.unresolved.length,gate:r.candidate_graph_gate_results.status,claims:models.relation_validation.map(v=>({relation_id:v.relation_id,hypothesis:v.hypothesis,antecedent:v.antecedent,modality:v.modality,nli:v.nli}))}));}}finally{await closeNlp();}
