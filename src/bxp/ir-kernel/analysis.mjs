import {queryCore} from './queries.mjs';
import {evaluateCore} from './evaluate.mjs';
import {inferQueryCapability} from './capabilities.mjs';

export function dependencies(core,reference,seen=new Set()){
 if(!reference||seen.has(reference.id))return seen;
 seen.add(reference.id);const n=core.nodes[reference.id];if(!n)return seen;
 const walk=x=>{if(!x||typeof x!=='object')return;if(x.kind&&x.id&&Object.keys(x).length===2){dependencies(core,x,seen);return;}for(const v of Object.values(x))if(Array.isArray(v))v.forEach(walk);else walk(v);};
 walk(n);return seen;
}
export function affectedFrameErrors(compiled,ids){
 const deps=new Set(ids.flatMap(id=>[...dependencies(compiled.core,{kind:'REQUIREMENT',id})]));
 return (compiled.frame_errors??[]).filter(e=>deps.has(e.node_id));
}
// Restrict only positive universal predicates to source-required events. This
// weakens the original rules; it must never produce a whole-task SAT claim.
function hasOpenDomain(core,r,seen=new Set()){
 if(r?.kind!=='EXPRESSION'||seen.has(r.id))return false;
 const n=core.nodes[r.id];if(n.operator==='TASK_EVENTS')return true;
 return n.arguments.some(a=>hasOpenDomain(core,a,new Set([...seen,r.id])));
}
function safeProjection(core,reference,mandatory,positive=true,seen=new Set()){
 if(!reference||seen.has(reference.id))return true;
 const n=core.nodes[reference.id];if(!n)return false;
 if(reference.kind==='EVENT')return n.kind==='TASK'||mandatory.has(n.id);
 if(reference.kind==='STATE')return !n.subject||safeProjection(core,n.subject,mandatory,positive,seen);
 if(reference.kind!=='EXPRESSION')return true;
 seen=new Set([...seen,n.id]);
 if(n.operator==='TASK_EVENTS')return false;
 if(n.operator==='FORALL'&&core.nodes[n.arguments[0].id]?.operator==='TASK_EVENTS')return positive&&safeProjection(core,n.arguments[1],mandatory,true,seen);
 if(n.operator==='NOT')return safeProjection(core,n.arguments[0],mandatory,!positive,seen);
 if(n.operator==='IMPLIES')return safeProjection(core,n.arguments[0],mandatory,!positive,seen)&&safeProjection(core,n.arguments[1],mandatory,positive,seen);
 if(['IFF','EQ','EXISTS','SELECT_EVENTS','COUNT_STARTED'].includes(n.operator)&&n.arguments.some(a=>hasOpenDomain(core,a)))return false;
 return n.arguments.every(a=>safeProjection(core,a,mandatory,positive,seen));
}
export async function analyzeCore(compiled,budget={}){
 const core=compiled.core,errors=compiled.frame_errors??[];
 const full=errors.length?{ir_status:'INVALID',compile_status:'FAILED',result:'NOT_RUN',verification:'NOT_RUN',diagnostics:errors}:await queryCore(compiled,{},budget);
 if(full.compile_status==='SUPPORTED')return {...full,full_query:full,parts:[],analysis_scope:'COMPLETE_DECLARED_QUERY'};
 const mandatory=new Map();
 for(const id of core.requirements){const r=core.nodes[id];if(r.kind==='EVENT_NORM'&&r.modality==='REQUIRED'&&!r.applicability&&r.subject?.kind==='EVENT'&&core.nodes[r.subject.id]?.kind==='ACTION'&&!affectedFrameErrors(compiled,[id]).length)mandatory.set(r.subject.id,id);}
 const eventIds=new Set(mandatory.keys());
 const plan={events:[...mandatory].map(([id])=>({id,task_id:core.nodes[id].owner_id,occurred:true})),completeness:{kind:'EXACT_SNAPSHOT',task_id:core.root_task,basis:'INTERNAL_VIEW_OF_NECESSARY_UNIVERSAL_INSTANCES_NOT_SOURCE_CLOSURE'}};
 const supported=[],unavailable=[];
 for(const id of core.requirements){
  const r=core.nodes[id],bad=affectedFrameErrors(compiled,[id]);
  if(bad.length){unavailable.push({id,diagnostics:bad});continue;}
  const polarity=r.modality!=='FORBIDDEN';
  if(!safeProjection(core,r.body,eventIds,polarity)||r.applicability&&!safeProjection(core,r.applicability,eventIds,false)||r.subject?.kind==='EVENT'&&core.nodes[r.subject.id]?.kind!=='TASK'&&!eventIds.has(r.subject.id)){
   unavailable.push({id,diagnostics:[{code:'OPEN_PROJECTION_NOT_NECESSARY',layer:'CAPABILITY',node_id:id}]});continue;
  }
  const cap=inferQueryCapability(core,{requirements:[id],plan});
  if(cap.status==='SUPPORTED')supported.push(id);else unavailable.push({id,diagnostics:cap.diagnostics});
 }
 const parts=[];
 if(supported.length){
  const answer=await queryCore(compiled,{requirements:supported,plan},budget);
  parts.push({...answer,query_scope:{kind:'NECESSARY_FRAGMENT',requirements:supported,source_required_events:[...mandatory].map(([event,requirement])=>({event,requirement})),projection:'POSITIVE_UNIVERSAL_WEAKENING',real_event_domain_closed:false},whole_task_sat_proven:false});
 }
 const contradiction=parts.find(p=>p.result==='UNSAT');
 const diagnostics=[...(full.diagnostics??[]),...unavailable.flatMap(x=>x.diagnostics)];
 return {ir_status:errors.length?'INVALID':compiled.semantic_gaps.length?'SEMANTIC_REVIEW_REQUIRED':'VALID',compile_status:'PARTIAL',query_kind:'ANALYZE',result:contradiction?'UNSAT':'NOT_RUN',verification:contradiction?.verification??'NOT_RUN',analysis_scope:contradiction?'NECESSARY_CONSTRAINT_CONFLICT':'PARTIAL_CONSTRAINT_ANALYSIS',global_infeasibility_from_necessary_constraints:!!contradiction,full_query:full,parts,unavailable,diagnostics,business_decision:null,execution_authorization:null};
}
