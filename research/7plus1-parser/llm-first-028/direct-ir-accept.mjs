import Ajv from 'ajv';
import {validateCandidateIR} from './contracts/candidate-ir-v1/validate.mjs';
import {auditSchema} from './contracts/candidate-ir-v1/schema.mjs';
import {linkQuote,sha256} from './source.mjs';
import {compileCore} from '../../../src/bxp/ir-kernel/index.mjs';import {v2AuditSchema} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
const auditV2Check=new Ajv({strict:false,allErrors:true}).compile(v2AuditSchema);
const auditCheck=new Ajv({strict:false,allErrors:true}).compile(auditSchema);
const pathOf=p=>p.replace(/^\//,'').replaceAll('/','.');
const overlaps=(a,b)=>!a||!b||a===b||a.startsWith(b+'.')||b.startsWith(a+'.');
export function acceptedIRFields(row,paths){
 if(!row)return false;
 if(!row.field_status)return row.status==='ACCEPTED';
 return paths.every(p=>row.field_status[p]==='ACCEPTED'||Object.entries(row.field_status).some(([k,s])=>s==='ACCEPTED'&&(p===k||p.startsWith(k+'.'))));
}
export function acceptCandidateIR(ir,audit,source){
 let check;const selectedAuditCheck=ir.contract_version==='candidate-ir/2.0'?auditV2Check:auditCheck;
 if(ir.contract_version==='candidate-ir/2.0'){try{const core=compileCore(ir,{collectFrameErrors:true});for(const s of ir.source_table)linkQuote(source,s);check={ok:true,errors:core.frame_errors};}catch(e){check={ok:false,errors:[e.diagnostic??{code:'SOURCE_OR_CORE_INVALID',message:e.message}]};}}
 else check=validateCandidateIR(ir,source.text);
 const errors=[...check.errors],rows=[];
 if(!selectedAuditCheck(audit))errors.push({code:'AUDIT_SCHEMA',errors:selectedAuditCheck.errors});
 const collections={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};
 const index=new Map(Object.entries(collections).flatMap(([k,kind])=>(ir[k]??[]).map(node=>[node.id,{kind,node}])));
 const src=new Map((audit.source_table??[]).map(s=>[s.id,s]));
 for(const s of src.values()){let at=-1;for(let n=0;n<s.occurrence;n++){at=source.text.indexOf(s.quote,at+1);if(at<0)break;}if(at<0)errors.push({code:'AUDIT_SOURCE_MISMATCH',id:s.id});}
 for(const r of audit.reviews??[]){if(index.get(r.target.id)?.kind!==r.target.kind)errors.push({code:'AUDIT_TARGET_MISMATCH',id:r.target.id});for(const ref of r.context_refs)if(index.get(ref.id)?.kind!==ref.kind)errors.push({code:'AUDIT_CONTEXT_REFERENCE',id:ref.id});for(const id of r.source_refs)if(!src.has(id))errors.push({code:'AUDIT_SOURCE_REFERENCE',id});}
 for(const [id,{kind,node}] of index){
  const reviews=(audit.reviews??[]).filter(r=>r.target.id===id&&r.target.kind===kind);
  const issues=[...(ir.issues??[]).filter(x=>x.kind!=='UNSPECIFIED'),...(audit.issues??[])].filter(x=>x.targets.some(t=>t.id===id));
  const fields=Object.keys(node).filter(k=>!['id','source_refs','note'].includes(k)),field_status={};
  for(const field of fields){
   const supporting=reviews.some(r=>r.verdict==='SUPPORT'&&(!r.field_path||pathOf(r.field_path)===field));
   const explicitSupport=reviews.some(r=>r.verdict==='SUPPORT'&&pathOf(r.field_path)===field);
   const negative=reviews.filter(r=>r.verdict!=='SUPPORT'&&overlaps(pathOf(r.field_path),field)&&!(r.verdict==='UNCERTAIN'&&!r.field_path&&explicitSupport));
   const local=issues.some(x=>overlaps(pathOf(x.field_path),field));
   field_status[field]=errors.length?'UNRESOLVED':negative.some(r=>r.verdict==='CONTRADICT')?'REJECTED':!supporting||local||negative.length?'UNRESOLVED':'ACCEPTED';
  }
  // Whole-node uncertainty never implies positive support for unreviewed fields.
  rows.push({id,collection:kind,status:Object.values(field_status).includes('REJECTED')?'REJECTED':Object.values(field_status).every(s=>s==='ACCEPTED')?'ACCEPTED':'UNRESOLVED',field_status,reviews,...(fields.some(f=>!reviews.some(r=>r.verdict==='SUPPORT'&&(!r.field_path||pathOf(r.field_path)===f)))?{missing_review_fields:fields.filter(f=>!reviews.some(r=>r.verdict==='SUPPORT'&&(!r.field_path||pathOf(r.field_path)===f)))}:{})});
 }
 const byId=new Map(rows.map(r=>[r.id,r]));
 const references=(value,path='')=>{if(!value||typeof value!=='object')return [];if(value.kind&&value.id&&Object.keys(value).length===2)return [{ref:value,path}];return Object.entries(value).flatMap(([k,v])=>references(v,path?path+'.'+k:k));};
 let changed=true;while(changed){changed=false;for(const row of rows){
  for(const {ref,path} of references(index.get(row.id).node)){
   if(ref.id===row.id)continue;const target=index.get(ref.id),dep=byId.get(ref.id),field=path.split('.')[0];if(row.field_status[field]!=='ACCEPTED')continue;
   // A TASK reference consumes its identity/ownership, not all input/basis roles.
   const ready=target?.kind==='EVENT'&&target.node.kind==='TASK'?acceptedIRFields(dep,['kind','layer','use','owner_id']):dep?.status==='ACCEPTED';
   if(!ready){row.field_status[field]='UNRESOLVED';row.blocked_dependencies=[...new Set([...(row.blocked_dependencies??[]),ref.id])];changed=true;}
  }
  row.status=Object.values(row.field_status).includes('REJECTED')?'REJECTED':Object.values(row.field_status).every(s=>s==='ACCEPTED')?'ACCEPTED':'UNRESOLVED';
 }}
 const diagnostics=[...errors,...(audit.omissions??[]).map(x=>({code:'AUDIT_OMISSION',...x})),...(ir.coverage??[]).filter(x=>x.status==='GAP').map(x=>({code:'COVERAGE_GAP',...x})),...(audit.issues??[]).filter(x=>pathOf(x.field_path)==='coverage').map(x=>({code:'COVERAGE_REVIEW_ISSUE',...x}))];
 const audit_status=(audit.reviews??[]).length?'PERFORMED':'NOT_PERFORMED';
 if(ir.contract_version==='candidate-ir/2.0'&&audit_status==='NOT_PERFORMED')diagnostics.push({code:'AUDIT_NOT_PERFORMED',reason:'审阅没有给出节点裁定；不能将空审阅当作没有语义问题。'});
 const linkedSource={...source,sha256:source.sha256??sha256(source.text)},link=table=>(table??[]).flatMap(c=>{try{return [linkQuote(linkedSource,c)];}catch{return [];}});
 for(const sequence of ir.sequences??[])if(!(audit.reviews??[]).some(r=>r.target.id===sequence.template.id&&r.field_path==='sequence'&&r.verdict==='SUPPORT'))diagnostics.push({code:'SEQUENCE_REVIEW_REQUIRED',id:sequence.template.id});
 return {format:'boundx-candidate-ir-acceptance/1',source_sha256:linkedSource.sha256,source_links:link(ir.source_table),audit_source_links:link(audit.source_table),rows,errors,diagnostics,technical_ok:errors.length===0,audit_status,schemas:{proposal:{ok:check.ok},audit:{ok:!!selectedAuditCheck(audit)}},audit_agreement_is_not_correctness_proof:true,business_decision:null,execution_authorization:null};
}
