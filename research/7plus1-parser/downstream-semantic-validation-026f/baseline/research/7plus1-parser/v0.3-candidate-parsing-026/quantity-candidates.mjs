import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {expressionCandidate as expr,expressionPlanCandidate as plan} from './expression-api.mjs';
const length=s=>[...s].length;
// Explicit comparison syntax and structural local targets. All targets survive
// as candidates; Γ owns their compatibility/cardinality decision.
export function quantityCandidates(f){
 f.proposals.provider='BOUNDED_QUANTITY_EXPRESSION_CANDIDATES';
 const points=[...f.source.raw_text],span=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 for(const a of f.analyses){const raw=a.cl.span.quote;
  for(const m of raw.matchAll(/(至少|至多|不得超过|不能超过|不超过|不少于|最多|超过|低于|小于|少于|大于|不足|恰好|正好|at least|at most|no more than|less than|more than|exactly|within)?\s*(?:尝试|重试|attempts?|retries?)?\s*(\d+(?:\.\d+)?)\s*(?:successful\s+)?(分钟|小时|秒|天|次|轮|GB|MB|%|minutes?|hours?|seconds?|days?|times?|attempts?|checks?)/giu)){
   const start=a.cl.span.start+length(raw.slice(0,m.index+m[0].indexOf(m[2]))),end=start+length(m[2]),v=f.tools.node(a.cl,'VALUE',start,end,{sense:'SCALAR',literal_tag:'NUMBER',owner:a.cl.id,discourse:a.discourse}),marker=m[1]??'',unit=m[3];
   const localStates=f.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.clause_id===a.cl.id&&n.metadata.syntactic_layer==='CONDITION_ANTECEDENT'&&span(n).start<=start&&span(n).end>=end),budget=f.semantic_nodes.filter(n=>n.metadata.sense==='EXECUTION_BUDGET_DECLARATION'&&n.metadata.clause_id===a.cl.id);
   let targets,rule;
   if(/整个任务|本任务|whole task|entire task/iu.test(raw)){targets=[f.tools.task];rule='EXPLICIT_WHOLE_TASK_QUANTITY';}
   else if(localStates.length){const procedural=uniq(localStates.flatMap(n=>n.metadata.quantity_target_candidates??[])).map(i=>f.semantic_nodes.find(n=>n.node_id===i));targets=procedural.length?procedural:localStates;rule=procedural.length?'EXPLICIT_PROCEDURAL_PREDICATE_QUANTITY':'EXPLICIT_QUANTIFIED_CONDITION_STATE';}
   else if(f.semantic_nodes.some(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='OUTPUT_CONTENT_REQUIREMENT')){targets=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='OUTPUT_CONTENT_REQUIREMENT');rule='EXPLICIT_OUTPUT_CONTENT_QUANTITY';}
   else if(budget.length){targets=budget;rule='EXPLICIT_LOCAL_EXECUTION_COUNT_BUDGET';}
   else{targets=a.events.filter(e=>['retry','complete','run','query','probe'].includes(e.metadata.sense));rule='EXPLICIT_LOCAL_QUANTITY_TARGET';}
   for(const target of targets){const r=f.tools.relation(a.cl,'LIMIT',target,v,[a.sid,...target.source_span_ids,...v.source_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule,source_marker:marker,target_candidate_ids:targets.map(n=>n.node_id),source_span_ids:r.evidence_span_ids,attachment_path:[a.parent_structure_id,a.cl.id,target.node_id]});
    const lower=/^(至少|不少于|超过|大于|at least|more than)$/iu.test(marker),inclusive=!/^(超过|低于|小于|少于|大于|不足|less than|more than)$/iu.test(marker),bound={inclusive,value:Number(m[2])},exact=/^(恰好|正好|exactly)$/iu.test(marker),q=expr(f,'quantity_expr_nodes',{metric:/分钟|小时|秒|天|minutes?|hours?|seconds?|days?/iu.test(unit)?'TIME':/GB|MB/iu.test(unit)?'MEMORY':unit==='%'?'PERCENT':'COUNT',target_node_ids:[target.node_id],...(exact?{lower_bound:bound,upper_bound:bound}:lower?{lower_bound:bound}:{upper_bound:bound}),unit,value_node_ids:[v.node_id],source_span_ids:[a.sid,...target.source_span_ids,...v.source_span_ids],relation_ids:[r.relation_id]});
    plan(f,target,{quantity_expr_id:q},[r.relation_id],[a.sid,...target.source_span_ids,...v.source_span_ids]);
   }
  }
 }
 return f;
}
