import {graphApi,length} from './migration/graph-api.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// Explicit support + nominal predicate contracts. No case/entity lookup.
export function nominalExecutionContracts(f){
 const {cp,nm,edge,expr}=graphApi(f),log=[];f.semantic_decoding.nominal_execution_contract_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse)||a.condition_layer)continue;const ts=a.cl.tokens,org=ts.find(t=>/^(组织|organize|organise)$/iu.test(t.lemma??t.text)),support=ts.find(t=>/^(完成|进行|执行|开展|做|perform|conduct)$/iu.test(t.lemma??t.text)),governor=org??support;if(!governor)continue;
  const license=a.organization_owner||ts.some(t=>t.end<=governor.start&&/^(请|要求|必须|must|please)$/iu.test(t.text));if(!license)continue;
  const candidates=ts.filter(t=>t.start>=governor.end&&['review','probe','query'].some(s=>PREDICATE_WORDS[s].includes((t.lemma??t.text).toLowerCase()))),p=candidates[0];if(!p)continue;
  const postposition=cp.slice(p.end,ts.find(t=>t.start>=p.end&&/^(并|and)$/iu.test(t.text))?.start??a.cl.span.end).join('').trim();if(/^(?:of\b|limited\b|to\b)/iu.test(postposition))continue;
  const sense=['review','probe','query'].find(s=>PREDICATE_WORDS[s].includes((p.lemma??p.text).toLowerCase()));
  const compound=ts.find(t=>t.end===p.start&&PREDICATE_WORDS.read.includes((t.lemma??t.text).toLowerCase()));
  const governing=support&&support.end<=p.start?support:governor,preposition=ts.filter(t=>t.end<=governing.start&&/^(在|in|at)$/iu.test(t.text)).at(-1);
  // Explicit 对/of preposed objects are already owned by the root contract;
  // nominal modifiers after 进行 cannot replace those file operands.
  if(ts.some(t=>t.end<=governing.start&&t.start>=governor.end&&t.text==='对'))continue;
  let start=governing.end,end=compound?.start??p.start;
  // A transitive predicate already has its postposed operand: leave it alone.
  const post=ts.filter(t=>t.start>=p.end&&(!ts.some(m=>m.start>=p.end&&m.end<=t.start&&/^(并|and)$/iu.test(m.text))));
  if(!compound&&/^(VV|VERB)$/u.test(p.pos??'')&&post.some(t=>/^(NN|NR|NOUN|PROPN)$/u.test(t.pos??'')))continue;
  const scalar=ts.filter(t=>t.start>=start&&t.end<=end&&/^(恰好|至少|最多|exactly|at least|at most)$/iu.test(t.text));if(scalar.length===1){const last=ts.filter(t=>t.start>=scalar[0].start&&t.end<=end&&(/^(CD|NUM|M)$/u.test(t.pos??'')||/^(恰好|至少|最多)$/u.test(t.text))).at(-1);if(last)start=last.end;}
  while(start<end&&/\s/u.test(cp[start]))start++;while(end>start&&/\s/u.test(cp[end-1]))end--;
  if(start>=end&&preposition){start=preposition.end;end=governing.start;while(start<end&&/\s/u.test(cp[start]))start++;while(end>start&&/[\s上中]/u.test(cp[end-1]))end--;}
  if(start>=end)continue;
  const article=/^(?:an?|the)\s+/iu.exec(cp.slice(start,end).join(''));if(article)start+=length(article[0]);
  const text=cp.slice(start,end).join('');if(/^(?:只读|离线|read-only|offline|an?|the)$/iu.test(text)||/^(?:请|本任务|任务)$/u.test(text)||/[，；。]/u.test(text))continue;
  const explicitCase=ts.find(t=>t.start>=start&&t.end<=end&&/^(在|in|at)$/iu.test(t.text));if(explicitCase&&!preposition)continue;
  const existing=a.events.find(e=>f.source_spans.find(s=>s.span_id===e.source_span_ids[0])?.start===p.start),oldEvents=a.events.filter(e=>e===existing||compound&&f.source_spans.find(s=>s.span_id===e.source_span_ids[0])?.start===compound.start);
  if(!oldEvents.length&&!/^(NN|NOUN)$/u.test(p.pos??''))continue;
  const retired=[];for(const e of oldEvents){for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&['PATIENT','THEME'].includes(r.relation_type))){r.state='REJECTED';r.rejection_reason='EXPLICIT_NOMINAL_ARGUMENT_OWNERSHIP';retired.push(r);}
   if(e!==existing){e.metadata.retired_by_admin_root='COMPOSITE_NOMINAL_CHECK_QUALIFIER';f.expression_plans.delete(e.node_id);a.events=a.events.filter(x=>x!==e);}}
  for(const r of retired)for(const old of f.relations.filter(x=>x.state==='SUPPORTED'&&x.relation_type==='SCOPE_MEMBER'&&x.tail_node_id===r.tail_node_id&&x.clause_id===a.cl.id)){old.state='REJECTED';old.rejection_reason='REPLACED_NOMINAL_ARGUMENT';}
  const e=existing??f.tools.node(a.cl,'EVENT',p.start,p.end,{sense,token_id:p.id,owner:a.cl.id,discourse:a.discourse});Object.assign(e.metadata,{sense,modality:'REQUIRED',modality_rule:'EXPLICIT_GOVERNED_NOMINAL_EXECUTION',token_id:p.id});delete e.metadata.modality_unresolved;delete e.unresolved_ref;if(!a.events.includes(e))a.events.push(e);
  const object=f.tools.node(a.cl,'ENTITY',start,end,{sense:'GOVERNED_NOMINAL_ARGUMENT',owner:e.node_id,discourse:a.discourse,syntax_token_ids:ts.filter(t=>t.start>=start&&t.end<=end).map(t=>t.id)}),r=edge(a,'PATIENT',e,object),input=edge(a,'SCOPE_MEMBER',f.tools.task,object),scope=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:object.node_id,relation_ids:[r.relation_id],source_span_ids:uniq([a.sid,...object.source_span_ids])});f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),scope_expr_id:scope});f.relation_scope_plans.set(input.relation_id,expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:object.node_id,relation_ids:[input.relation_id],source_span_ids:object.source_span_ids}));
  if(compound){const qualifier=f.tools.node(a.cl,'STATE',compound.start,compound.end,{sense:'NOMINAL_CHECK_OPERATION_QUALIFIER',owner:e.node_id,discourse:a.discourse,predicate_sense:'read',object_node_ids:[object.node_id]});edge(a,'CONJUNCTION',qualifier,e);edge(a,'CONJUNCTION',qualifier,object);}
  if(preposition&&preposition.end<governing.start){let s=preposition.end,t=governing.start;while(s<t&&/\s/u.test(cp[s]))s++;while(t>s&&/\s/u.test(cp[t-1]))t--;if(s<t){const location=f.tools.node(a.cl,'ENTITY',s,t,{sense:'EXECUTION_ENVIRONMENT',owner:e.node_id,discourse:a.discourse}),place=edge(a,'LOCATION',e,location),member=edge(a,'SCOPE_MEMBER',f.tools.task,location);f.relation_scope_plans.set(member.relation_id,expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:location.node_id,relation_ids:[member.relation_id],source_span_ids:location.source_span_ids}));place.argument_inheritance={rule:'EXPLICIT_CASE_MARKED_NOMINAL_LOCATION',structural_path:[a.cl.id,preposition.id,governing.id,p.id],candidate_node_ids:[location.node_id],source_span_ids:uniq([a.sid,...location.source_span_ids])};}}
  const stale=new Set(oldEvents.map(n=>n.node_id));const diagnostics=f.unresolved.filter(u=>u.related_node_ids.length&&u.related_node_ids.every(i=>stale.has(i))&&/modality|argument|object/i.test(u.reason));f.unresolved=f.unresolved.filter(u=>!diagnostics.includes(u));log.push({rule:'EXPLICIT_GOVERNED_NOMINAL_EXECUTION',event_node_id:e.node_id,argument_node_id:object.node_id,retired_relation_ids:retired.map(r=>r.relation_id),retired_diagnostics:structuredClone(diagnostics),source_span_ids:uniq([a.sid,...e.source_span_ids,...object.source_span_ids]),attachment_path:[a.cl.id,governor.id,governing.id,p.id],qualifier_token_id:compound?.id??null});a.handled=true;
 }
 return f;
}
