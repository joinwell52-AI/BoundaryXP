import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
export function expressionCandidate(f,kind,body){
 body={...body,source_span_ids:uniq(body.source_span_ids),relation_ids:uniq(body.relation_ids)};
 const e={expr_id:id(f.source.sha256,'expr',body),...body};
 if(!f.expressions[kind].some(x=>x.expr_id===e.expr_id))f.expressions[kind].push(e);
 f.proposals.record('EXPRESSION',e.expr_id,{kind,expression:e},f.proposals.provider);return e.expr_id;
}
export function expressionPlanCandidate(f,node,body,relations=[],spans=[]){
 const plan={plan_id:id(node.node_id,'plan',body,relations),predicate_node_id:node.node_id,...body,candidate_relation_ids:uniq(relations),source_span_ids:uniq(spans),candidate_status:'PROPOSED'};
 if(!f.candidate_plan_sets.some(p=>p.plan_id===plan.plan_id))f.candidate_plan_sets.push(plan);return plan;
}
