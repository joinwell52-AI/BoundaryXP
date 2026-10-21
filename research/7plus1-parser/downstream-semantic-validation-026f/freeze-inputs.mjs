import fs from 'node:fs';
import {CODE,OUT,OLD,read,save,sha} from './util.mjs';
import {oracleGraph} from './reviewed-builder.mjs';
import {fixtures} from './baseline/research/7plus1-parser/semantic-parser-feasibility-026e/oracle-fixtures.mjs';
import {freezeCandidateGraph} from './baseline/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs';
const selection=read(`${OLD}/CORPUS-SELECTION.json`);
const models={status:'REVIEWED_GRAPH_TEST_ONLY',models:[],observations:[],relation_validation:[]};
export function pack(f,g){
 const maps=Object.fromEntries(['expression_plans','relation_scope_plans','structured_relation_authorizations'].filter(k=>f[k] instanceof Map||f[k] instanceof Set).map(k=>[k,{kind:f[k] instanceof Map?'Map':'Set',values:[...f[k]]}]));
 const fields=Object.fromEntries(Object.entries(f).filter(([k,v])=>!['tools','doc','candidate_runtime_observer','proposals','candidate_semantic_graph'].includes(k)&&!(v instanceof Map)&&!(v instanceof Set)));
 return JSON.parse(JSON.stringify({source:f.source,fields,maps,graph:g}));
}
const contrasts=[
 {id:'S01',source:'核对在用设备编号。',frames:[{p:'核对',sense:'compare',args:[['PATIENT','在用设备编号']]}]},
 {id:'S02',source:'在库房核对设备编号。',frames:[{p:'核对',sense:'compare',args:[['PATIENT','设备编号'],['LOCATION','库房']]}]},
 {id:'S03',source:'Check identifiers of devices in use.',frames:[{p:'Check',sense:'compare',args:[['PATIENT','identifiers of devices in use']]}]},
 {id:'S04',source:'在设备间核对库房编号。',frames:[{p:'核对',sense:'compare',args:[['PATIENT','库房编号'],['LOCATION','设备间']]}]},
 {id:'S05',source:'QA必须复核报告，复核通过后PM才可提交报告。',frames:[{p:'复核',sense:'review',actor:'QA',participantRole:'REVIEWER',args:[['PATIENT','报告']],condition:'复核通过后',independentTaskUse:'QA必须复核报告'},{p:'提交',sense:'send',actor:'PM',modal:'PERMITTED',args:[['PATIENT','报告',1]],condition:'复核通过后'}]},
 {id:'S06',source:'历史记录显示QA曾复核报告，本次只统计日志。',frames:[{p:'复核',sense:'review',actor:'QA',args:[['PATIENT','报告']],domain:'BACKGROUND'},{p:'统计',sense:'SOURCE_EVENT',args:[['PATIENT','日志']]}]},
 {id:'S07',source:'QA must review the report; PM may submit the report only after the review passes.',frames:[{p:'review',sense:'review',actor:'QA',participantRole:'REVIEWER',args:[['PATIENT','the report']],condition:'the review passes',independentTaskUse:'QA must review the report'},{p:'submit',sense:'send',actor:'PM',modal:'PERMITTED',args:[['PATIENT','the report',1]],condition:'the review passes'}]},
 {id:'S08',source:'只有审批通过后PM才可执行部署。',frames:[{p:'审批',sense:'approve',type:'STATE',layer:'CONDITION_ANTECEDENT',modal:'UNSTATED',args:[['THEME','通过']]},{p:'执行',sense:'run',actor:'PM',modal:'PERMITTED',args:[['PATIENT','部署']],condition:'审批通过后'}]},
 {id:'S09',source:'报告必须发送给QA用于复核。',frames:[{p:'发送',sense:'send',voice:'PASSIVE',args:[['PATIENT','报告'],['RECIPIENT','QA']]},{p:'复核',sense:'SOURCE_PURPOSE',type:'STATE',layer:'PURPOSE_COMPLEMENT',actor:'QA',participantRole:'REVIEWER',modal:'UNSTATED',args:[['THEME','报告']],purposeOwner:'发送'}]},
 {id:'S10',source:'报告必须发送给QA用于复核，QA必须复核该报告。',frames:[{p:'发送',sense:'send',voice:'PASSIVE',args:[['PATIENT','报告'],['RECIPIENT','QA']]},{p:'复核',sense:'SOURCE_PURPOSE',type:'STATE',layer:'PURPOSE_COMPLEMENT',actor:'QA',participantRole:'REVIEWER',modal:'UNSTATED',args:[['THEME','报告']],purposeOwner:'发送'},{p:['复核',1],sense:'review',actor:['QA',1],participantRole:'REVIEWER',args:[['PATIENT','该报告']]}]},
 {id:'S11',source:'报告必须发送给QA存档。',frames:[{p:'发送',sense:'send',voice:'PASSIVE',args:[['PATIENT','报告'],['RECIPIENT','QA']]},{p:'存档',sense:'SOURCE_PURPOSE',type:'STATE',layer:'PURPOSE_COMPLEMENT',modal:'UNSTATED',args:[['THEME','报告']],purposeOwner:'发送'}]},
 {id:'S12',source:'文档中引用一段复核说明。',frames:[{p:'引用',sense:'SOURCE_EVENT',args:[['PATIENT','一段复核说明']]},{p:'复核',sense:'SOURCE_PURPOSE',type:'STATE',layer:'OUTPUT_CONTENT',modal:'UNSTATED',args:[],domain:'OUTPUT_CONTENT'}]}
].map(r=>({...r,inputs:[],notes:['Predeclared downstream contrast; source reviewed by Codex, not ADMIN Gold.']}));
const ledger=[],manifest=[];
for(const key of selection.oracle_ids){
 const row=selection.cases.find(x=>x.id===key),spec=structuredClone(fixtures.find(x=>x.id===key));
 if(key==='NROOT-038')Object.assign(spec.frames.at(-1),{type:'STATE',sense:'SOURCE_PURPOSE',modal:'UNSTATED',purposeOwner:'sent',args:[['THEME','final report']],uniqueReference:null});
 if(key==='NROOT-001')spec.frames.find(f=>f.p==='复核').independentTaskUse='QA 对最终结果做独立复核';
 ledger.push({id:key,source:row.source,source_sha256:row.source_sha256,reviewer:'CODEX_PENDING_ADMIN',annotation_changed:key==='NROOT-038',review_reason:key==='NROOT-038'?'Recipient and review purpose are explicit; an independent REQUIRED QA action is not. STATE purpose, QA REVIEWER role, no approval inferred.':key==='NROOT-001'?'Whole current-task sentence assigns QA independent review and PM reporting; review assertion and temporal report guard have distinct uses. Not a general inference from after.':'Old graph/expected checked against original source and v0.3.1; no semantic correction.',old_spec:fixtures.find(x=>x.id===key),reviewed_spec:spec});
 write(row,spec,'original');
}
for(const spec of contrasts){const row={...spec,source_sha256:sha(Buffer.from(spec.source)),segmented:segments(spec.source)};ledger.push({id:spec.id,source:spec.source,source_sha256:row.source_sha256,reviewer:'CODEX_PENDING_ADMIN',reviewed_spec:spec,annotation_changed:false});write(row,spec,'contrast');}
function segments(source){const cp=[...source],clauses=[];let start=0;for(let i=0;i<=cp.length;i++)if(i===cp.length||/[，,。;；]/u.test(cp[i])){if(i>start){const quote=cp.slice(start,i).join('');clauses.push({id:'manual-clause-'+clauses.length,span:{start,end:i,quote},sentence_id:'manual-sentence-0',delimiter:cp[i]??''});}start=i+1;}return clauses;}
function write(row,spec,group){
 const f=oracleGraph(row,spec);f.proposals.provider='REVIEWED_GRAPH_TEST_ONLY';
 for(const [index,frame]of spec.frames.entries()){
  const n=f.semantic_nodes.find(n=>n.metadata.oracle_index===index),a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);
  if(frame.domain){n.metadata.discourse={...n.metadata.discourse,kind:frame.domain};a.discourse={...a.discourse,kind:frame.domain};for(const r of f.relations.filter(r=>r.head_node_id===n.node_id))r.discourse_domain={...a.discourse};}
  if(frame.independentTaskUse){const cp=[...row.source],start=row.source.indexOf(frame.independentTaskUse),range={start:[...row.source.slice(0,start)].length,end:[...row.source.slice(0,start+frame.independentTaskUse.length)].length};const sid=f.tools.span(range.start,range.end);n.metadata.local_task_use_evidence={predicate_token_id:n.metadata.token_id,source_span_ids:[sid],owning_clause_id:a.cl.id,structural_path:[a.parent_structure_id,a.cl.id],use:'CURRENT_TASK_ASSERTION',reviewer:'CODEX_SOURCE_REVIEW',not_model_output:true};}
  if(frame.purposeOwner){const owner=f.semantic_nodes.find(x=>x.surface===frame.purposeOwner&&x.node_type==='EVENT');n.metadata.owner=owner.node_id;n.metadata.attachment_path=[a.parent_structure_id,a.cl.id,owner.node_id];n.metadata.purpose_only=true;const r=f.tools.relation(a.cl,'CONJUNCTION',n,owner,[a.sid,...n.source_span_ids,...owner.source_span_ids]);r.generic_evidence=[{rule:'LOCAL_PURPOSE_ATTACHMENT',source_span_ids:r.evidence_span_ids,structural_path:n.metadata.attachment_path}];}
 }
 const g=freezeCandidateGraph(f,models),p=`${OUT}/inputs/${row.id}`,expected={frames:spec.frames,quantity:spec.quantity??null,actor:spec.actor??null,inputs:spec.inputs,basis:spec.basis??[],comparison:'Typed predicate/role/modality/local-condition/scope and complete proof; exact source spans. Not display text.',provider:'CODEX_SOURCE_REVIEW_PENDING_ADMIN',no_extra_current_actions:true};
 save(`${p}/source.md`,row.source);save(`${p}/input.json`,pack(f,g));save(`${p}/expected.json`,expected);
 manifest.push({id:row.id,group,source_sha256:sha(Buffer.from(row.source)),input_sha256:sha(fs.readFileSync(`${p}/input.json`)),expected_sha256:sha(fs.readFileSync(`${p}/expected.json`)),nodes:g.semantic_nodes.length,relations:g.candidate_relations.length});
}
save(`${OUT}/SOURCE-REVIEW-LEDGER.json`,{reviewer:'CODEX_NOT_ADMIN',spec:'v0.3.1',counts:{original:10,contrasts:12},rows:ledger});
save(`${OUT}/INPUT-FREEZE.json`,{frozen_before_gamma_repair:true,rows:manifest,faults:[{id:'F01',change:'one relation tail_node_id → absent node',expected:'Γ endpoint/provenance validation failure; no accepted fact'},{id:'F02',change:'one source span start shifted by one codepoint',expected:'Γ/provenance validation failure; no accepted fact'},{id:'F03',change:'remove one condition relation from its declared expression relation_ids',expected:'Γ expression dependency validation failure; never unconditional RESOLVED'},{id:'F04',change:'remove the local object dependency head witness',expected:'Γ ownership rejection/unresolved; no certified object action'},{id:'F05',change:'add a competing compatible reference candidate while retaining claimed unique selection',expected:'Γ unresolved coreference; cannot certify selected antecedent from claim'}]});
console.log('Frozen',manifest.length,'source-reviewed graphs');
