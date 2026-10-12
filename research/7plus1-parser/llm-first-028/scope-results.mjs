import {evaluateScopeMembership} from '../../../src/bxp/scope-domains.mjs';
export function buildScopeDomains(ir,atoms,activated){
 const facts=ir.facts??[],exprs=new Map(ir.expressions.map(x=>[x.id,x])),entities=new Map(ir.entities.map(x=>[x.id,x])),gaps=[],constraints=[],domains=[],bindings=[];
 const eventMap=new Map(facts.filter(f=>f.kind==='EVENT'&&f.status==='ACCEPTED').map(f=>[f.event.id,f.event]));
 const inScope=(id,owner,seen=[])=>{const event=eventMap.get(id);if(!event||seen.includes(id))return false;if(event.owner_id===owner)return true;return event.owner_id==='ROOT'?false:inScope(event.owner_id,owner,[...seen,id]);};
 const finite=(id,path=[])=>{if(path.includes(id))throw Error('SCOPE_CYCLE');const x=exprs.get(id);if(!x)throw Error('SCOPE_EXPRESSION_MISSING');
  if(x.op==='ITEM'){if(x.operands.length!==1||!entities.has(x.operands[0])||entities.get(x.operands[0]).type==='REFERENT'||entities.get(x.operands[0]).alternatives?.length)throw Error('SCOPE_IDENTITY_UNKNOWN');return x.operands;}
  if(x.op==='UNION')return [...new Set(x.operands.flatMap(v=>finite(v,[...path,id])))];
  if(x.op==='MEMBERS'){const g=entities.get(x.operands[0]);if(!Array.isArray(g?.members))throw Error('SCOPE_MEMBERS_UNKNOWN');return g.members;}
  throw Error('SCOPE_ALLOWED_FINITE_DOMAIN_REQUIRED');
 };
 for(const f of facts.filter(x=>x.kind==='SCOPE'&&x.status==='ACCEPTED')){const c=f.claim,b=c.scope_binding;
  if(!b){if(c.scope_id==='ROOT')gaps.push({fact_id:f.id,reason:'ROOT_SCOPE_CONSUMPTION_BINDING_REQUIRED'});continue;}
  let allowed;try{allowed=finite(c.expression_id);}catch(e){gaps.push({fact_id:f.id,reason:e.message});continue;}
  const subjects=atoms.filter(a=>inScope(a.event_id,c.scope_id)&&['REQUIRED','PERMITTED'].includes(a.mode)&& (b.subject_mode==='TASK_OPERATIONS'||b.subject_event_ids.includes(a.event_id)));
  if(b.subject_mode==='EVENTS'&&subjects.length!==b.subject_event_ids.length){gaps.push({fact_id:f.id,reason:'SCOPE_SUBJECT_CERTIFICATION_REQUIRED'});continue;}
  const row={fact_id:f.id,claim_id:c.id,kind:b.domain_kind,relation:b.relation,allowed,subject_event_ids:subjects.map(a=>a.event_id),sources:f.sources,checks:[]};
  for(const a of subjects){if(b.domain_kind==='EXECUTION_ENVIRONMENT')domains.push({id:c.id+':'+a.event_id,variable_id:'ENVIRONMENT_AT_EVENT:'+a.event_id,kind:b.domain_kind,event_id:a.event_id,allowed,guard:activated(a.event_id),sources:f.sources});
   else {const ids=a.semantic_signature?.external_input_ids;if(!Array.isArray(ids)){gaps.push({fact_id:a.fact_id,scope_claim_id:c.id,reason:'EXTERNAL_CONSUMPTION_SIGNATURE_REQUIRED'});continue;}
    const identityKnown=ids.every(id=>entities.has(id)&&entities.get(id).type!=='REFERENT'&&!entities.get(id).alternatives?.length);
    const result=evaluateScopeMembership(allowed,ids,{identityKnown});row.checks.push({event_id:a.event_id,requested:ids,...result});
    if(result.result==='UNKNOWN'){gaps.push({fact_id:a.fact_id,scope_claim_id:c.id,reason:'EXTERNAL_CONSUMPTION_IDENTITY_UNKNOWN'});continue;}
    constraints.push({id:'external-domain:'+c.id+':'+a.event_id,formula:{implies:[activated(a.event_id),result.result==='SATISFIED']},rule:'DECLARED_EXTERNAL_CONSUMPTION_SUBSET',fact_ids:[f.id,a.fact_id],sources:[...f.sources,...a.sources]});
   }
  }
  bindings.push(row);
 }
 return {gaps,constraints,domains,bindings};
}
