import Ajv from 'ajv';import {validateCandidateIR} from './contracts/candidate-ir-v1/validate.mjs';import {auditSchema} from './contracts/candidate-ir-v1/schema.mjs';
const auditCheck=new Ajv({strict:false,allErrors:true}).compile(auditSchema);
export function acceptCandidateIR(ir,audit,source){
 const check=validateCandidateIR(ir,source.text),errors=[...check.errors],rows=[];
 if(!auditCheck(audit))errors.push({code:'AUDIT_SCHEMA',errors:auditCheck.errors});
 const collections={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};
 const index=new Map(Object.entries(collections).flatMap(([k,kind])=>(ir[k]??[]).map(node=>[node.id,{kind,node}])));
 const src=new Map((audit.source_table??[]).map(s=>[s.id,s]));
 for(const s of src.values()){let at=-1;for(let n=0;n<s.occurrence;n++){at=source.text.indexOf(s.quote,at+1);if(at<0)break;}if(at<0)errors.push({code:'AUDIT_SOURCE_MISMATCH',id:s.id});}
 for(const r of audit.reviews??[]){if(index.get(r.target.id)?.kind!==r.target.kind)errors.push({code:'AUDIT_TARGET_MISMATCH',id:r.target.id});for(const ref of r.context_refs)if(index.get(ref.id)?.kind!==ref.kind)errors.push({code:'AUDIT_CONTEXT_REFERENCE',id:ref.id});for(const id of r.source_refs)if(!src.has(id))errors.push({code:'AUDIT_SOURCE_REFERENCE',id});}
 for(const [id,{kind,node}]of index){const reviews=(audit.reviews??[]).filter(r=>r.target.id===id&&r.target.kind===kind);const local=(ir.issues??[]).some(x=>x.kind!=='UNSPECIFIED'&&x.targets.some(t=>t.id===id))||(audit.issues??[]).some(x=>x.targets.some(t=>t.id===id));
  const semanticFields=Object.keys(node).filter(k=>!['id','source_refs','note'].includes(k));
  const supported=new Set(reviews.filter(r=>r.verdict==='SUPPORT').map(r=>r.field_path));
  const complete=supported.has('')||semanticFields.every(k=>supported.has(k)||supported.has('/'+k));
  const status=errors.some(e=>e.id===id)||reviews.some(r=>r.verdict==='CONTRADICT')?'REJECTED':local||!complete||reviews.some(r=>r.verdict==='UNCERTAIN')?'UNRESOLVED':'ACCEPTED';rows.push({id,collection:kind,status,reviews,...(!complete?{missing_review_fields:semanticFields.filter(k=>!supported.has(k)&&!supported.has('/'+k))}: {})});}
 // Dependency acceptance is monotone. A supported requirement cannot revive a
 // rejected endpoint/expression. Retain all nodes; this is a host acceptance overlay.
 const references=value=>{if(!value||typeof value!=='object')return [];if(value.kind&&value.id&&Object.keys(value).length===2)return [value.id];return Object.values(value).flatMap(references);};
 // A source/schema failure invalidates technical acceptance, even when the model
 // reviewer supported the interpretation. Do not display affected nodes as resolved.
 if(errors.length)for(const row of rows)if(row.status==='ACCEPTED')row.status='UNRESOLVED';
 const byId=new Map(rows.map(r=>[r.id,r]));let changed=true;
 while(changed){changed=false;for(const row of rows){if(row.status!=='ACCEPTED')continue;const blocked=references(index.get(row.id).node).filter(id=>id!==row.id&&byId.get(id)?.status!=='ACCEPTED');if(blocked.length){row.status='UNRESOLVED';row.blocked_dependencies=[...new Set(blocked)];changed=true;}}}
 const diagnostics=[...errors,...(audit.omissions??[]).map(x=>({code:'AUDIT_OMISSION',...x})),...(ir.coverage??[]).filter(x=>x.status==='GAP').map(x=>({code:'COVERAGE_GAP',...x}))];
 return {format:'boundx-candidate-ir-acceptance/1',source_sha256:source.sha256,rows,errors,diagnostics,technical_ok:errors.length===0,schemas:{proposal:{ok:check.ok},audit:{ok:!!auditCheck(audit)}},audit_agreement_is_not_correctness_proof:true,business_decision:null,execution_authorization:null};
}
