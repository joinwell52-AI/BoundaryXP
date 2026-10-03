// Offline evidence projection only. Never imported by the parser or proposal lane.
import {read,out,digest} from './common.mjs';
export const slots=[...'IOAPRVCB'];
export function traceEvidence(path){const t=read(path),c=t.compiler_v03;const nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),rm=new Map(c.relations.map(r=>[r.relation_id,r])),sm=new Map(t.source_spans.map(s=>[s.span_id,s]));
 const compact=n=>n&&({node_id:n.node_id,type:n.node_type,surface:n.surface,normalized:n.normalized,state:n.state,metadata:n.metadata,source_spans:n.source_span_ids.map(id=>sm.get(id))});
 const allExpr=[...(c.boundary_ir.set_expr_nodes??[]),...(c.boundary_ir.condition_expr_nodes??[]),...(c.boundary_ir.quantity_expr_nodes??[])];
 const expression=id=>{const seen=new Set(),go=i=>{if(!i||seen.has(i))return [];seen.add(i);const x=allExpr.find(e=>e.expr_id===i);return x?[x,...(x.children??x.child_expr_ids??x.operand_expr_ids??[]).flatMap(go)]:[];};return go(id);};
 const entries=slots.flatMap(slot=>c.canonical_7plus1[slot].entries.map(e=>({slot,entry:e,facts:e.boundary_fact_ids.map(id=>{const f=c.boundary_ir.facts.find(f=>f.boundary_fact_id===id);return {fact:f,nodes:f.node_ids.map(id=>compact(nm.get(id))),relations:f.relation_ids.map(id=>rm.get(id)),source_spans:f.source_span_ids.map(id=>sm.get(id)),scope:expression(f.scope_expr_id),condition:expression(f.condition_expr_id),quantity:expression(f.quantity_expr_id),eligibility:c.eligibility_decisions.find(d=>d.decision_id===f.eligibility_decision_id||d.eligibility_decision_id===f.eligibility_decision_id)};})})));
 return {path,sha256:digest(path),source:c.source,slots:c.canonical_7plus1,entries,output_content:c.nlp_signals.semantic_decoding.discourse.output_content_requirements,unresolved:c.unresolved,diagnostics:c.diagnostics,relation_count:c.relations.length,contract:t.contract_gate_results,first_divergence:t.first_divergence,allExpr,nm,rm,sm};
}
const identity=n=>n?.metadata.identity_name??n?.surface;
export function requirementReview(expected,slot,evidence){const wanted=expected.object??expected.identity,objects=expected.objects??(wanted?[wanted]:[]);const senses={READ:['read','读取'],CHECK:['check','核对','检查'],GENERATE:['generate','生成'],WRITE_FINDINGS:['write','写入'],SUBMIT:['send','提交'],FORBID_MODIFY:['modify','修改']};
 const factTypes={I:'TASK_OBJECT',O:'DELIVERABLE',A:'ACTION',P:'PARTICIPANT',R:'RESOURCE',V:'BASELINE',C:'COMPLETION',B:'FORBID'};
 const candidates=evidence.entries.filter(x=>x.slot===slot).flatMap(x=>x.facts.map(f=>({...f,canonical:x.entry}))).filter(x=>x.fact.fact_type===factTypes[slot]);
 const findings=candidates.map(x=>{const f=x.fact,p=evidence.nm.get(f.predicate_node_id),ns=f.object_node_ids.map(id=>evidence.nm.get(id)),persons=f.participant_node_ids.map(id=>evidence.nm.get(id));const checks={resolved:f.state==='RESOLVED',fact_type:true,source_exact:x.source_spans.every(s=>s&&[...evidence.source.raw_text].slice(s.start,s.end).join('')===s.text)};
 if(objects.length&&slot!=='P')checks.object_set=objects.every(o=>ns.some(n=>identity(n)===o||n?.metadata.source_aliases?.includes(o)))&&ns.every(n=>objects.includes(identity(n))||objects.some(o=>n?.metadata.source_aliases?.includes(o)));
 if(senses[expected.kind])checks.predicate=senses[expected.kind].includes(p?.metadata.sense)||senses[expected.kind].includes(p?.surface);
 if(['A','B'].includes(slot))checks.modality=p?.metadata.modality===expected.modality;
 if(['I','O','A','B'].includes(slot)){checks.owner=(p?[p]:ns).every(n=>n?.metadata.semantic_ownership?.owner_category==='CURRENT_TASK_ROOT');checks.scope=!!f.scope_expr_id&&x.scope.length>0&&(!objects.length||objects.every(o=>x.scope.some(s=>identity(evidence.nm.get(s.entity_node_id))===o)));}
 if(expected.agent)checks.performer=x.relations.some(r=>r?.relation_type==='AGENT'&&r.state==='RESOLVED'&&identity(evidence.nm.get(r.tail_node_id))===expected.agent);
 if(expected.recipient)checks.recipient=x.relations.some(r=>r?.relation_type==='RECIPIENT'&&r.state==='RESOLVED'&&identity(evidence.nm.get(r.tail_node_id))===expected.recipient);
 if(expected.basis)checks.basis=x.relations.some(r=>r?.relation_type==='BASIS'&&identity(evidence.nm.get(r.tail_node_id))===expected.basis);
 if(expected.version)checks.version=x.nodes.some(n=>n?.surface===expected.version)&&x.relations.some(r=>r?.relation_type==='BASIS');
 if(slot==='P'){checks.identity=persons.some(n=>identity(n)===expected.identity);checks.roles=persons.some(n=>identity(n)===expected.identity&&expected.roles.every(r=>n?.metadata.participant_roles?.includes(r)));}
 if(slot==='R'){checks.quantity=x.nodes.some(n=>Number(n?.surface)===expected.quantity);checks.operator=x.nodes.some(n=>n?.metadata.comparator===expected.operator);checks.task_budget=x.nodes.some(n=>n?.metadata.measure_of_task);checks.unit=x.quantity.some(q=>JSON.stringify(q).includes('minute')||JSON.stringify(q).includes('分钟'));}
 if(slot==='C'){checks.condition_AND=x.condition.some(q=>q.op==='AND');checks.typed_member_binding=x.condition.filter(q=>q.op==='STATE_REF').every(q=>{const n=evidence.nm.get(q.state_node_id);return n?.metadata.referent_set_certificate?.status==='CERTIFIED_REFERENT_SET';})&&x.condition.filter(q=>q.op==='STATE_REF').length===expected.members.length;}
 if(expected.distribution)checks.distribution=JSON.stringify(p?.metadata.distribution)===JSON.stringify(expected.distribution);
 const failed=Object.keys(checks).filter(k=>!checks[k]);return {canonical_entry_id:x.canonical.canonical_entry_id,boundary_fact_id:f.boundary_fact_id,checks,failed_checks:failed,evidence:x};});
 const match=findings.find(x=>x.failed_checks.length===0),partial=findings.filter(x=>!['object_set','identity','predicate'].some(k=>x.failed_checks.includes(k)));
 return {expected,finding:match?'MATCH':partial.length?'PARTIAL_SUPPORT':'MISSING',matched_fact_id:match?.boundary_fact_id??null,proof:match??null,partial_candidates:partial,evaluated_candidates:findings.map(({evidence,...x})=>x),policy:'Exact typed endpoints and relation/owner/scope proof. C typed member binding requires independent review; never credit complete C from an unbound source-state string.'};
}
