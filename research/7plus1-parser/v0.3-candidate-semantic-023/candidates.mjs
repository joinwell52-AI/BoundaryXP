import {nativeFrontend} from './frontend.mjs';
import {resolveExpressions} from './expressions.mjs';
import {prepareDiscourse} from '../v0.3-7p-composition-014/discourse.mjs';
import {participantEligibility,prepareQuantityTargets} from '../v0.3-7p-composition-014/semantic-eligibility.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';

export function prepareCandidates(doc,signals){
 const f=nativeFrontend(doc,signals);f.semantic_decoding={};
 prepareDiscourse(f);participantEligibility(f);prepareQuantityTargets(f);resolveExpressions(f);
 // Explicit same-sentence coordination must be proposed even when each event
 // independently carries a modal license. This is candidate recall, not certification.
 for(const a of f.analyses){if(!/^(?:并|且|and\b)/iu.test(a.cl.span.quote))continue;const prior=f.analyses.filter(p=>p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start).at(-1);if(prior?.events.length===1&&a.events.length===1)f.tools.relation(a.cl,'CONJUNCTION',prior.events[0],a.events[0],[prior.sid,a.sid]);}
 f.tools.attachContext();
 // Ownership annotations are evidence, never authority or automatic WP decomposition.
 const outputIds=uniq(f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='SUPPORTED').map(r=>r.tail_node_id));
 f.semantic_decoding.discourse.output_content_requirements=f.analyses.filter(a=>a.discourse.kind==='OUTPUT_CONTENT').map(a=>({requirement_id:id(f.source.sha256,'output-content',a.cl.id),clause_id:a.cl.id,scope:'OUTPUT_CONTENT',source_span_ids:[a.sid],semantic_node_ids:f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id).map(n=>n.node_id),owner_output_ids:[],ownership_evidence_relation_ids:[],owning_output_candidates:outputIds,ownership_status:'UNRESOLVED_OUTPUT_SET'}));
 buildSemanticOwnership(f,'CANDIDATE_EVIDENCE');
 // Eligibility's canonical deliverable ITEM is predeclared, not invented downstream.
 for(const r of f.relations.filter(r=>r.relation_type==='RESULT')){
  const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),p=f.expression_plans.get(r.head_node_id)??{},local=f.expressions.set_expr_nodes.find(e=>e.expr_id===p.scope_expr_id),quantified=local&&['ALL','ANY'].includes(local.kind)&&local.base_entity_node_id===n.node_id;
  const body={...(quantified?{kind:local.kind,base_entity_node_id:n.node_id}:{kind:'ITEM',entity_node_id:n.node_id}),source_span_ids:quantified?local.source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]},e={expr_id:id(f.source.sha256,'expr',body),...body};
  if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);
 }
 // One TASK_OBJECT fact owns one SCOPE_MEMBER endpoint. This compatibility
 // expression describes that already proposed edge; it does not infer a set
 // connector between distinct edges or license the candidate itself.
 for(const r of f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'))if(!f.relation_scope_plans.has(r.relation_id)){
  const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),body={kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]},e={expr_id:id(f.source.sha256,'expr',body),...body};
  if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);f.relation_scope_plans.set(r.relation_id,e.expr_id);
 }
 return f;
}

export function freezeCandidateGraph(f,modelSignals={models:[],observations:[],relation_validation:[]}){
 const g=f.candidate_semantic_graph,nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),sm=new Map(f.source_spans.map(s=>[s.span_id,s]));
 const evidence=(channel,body)=>{const e={evidence_id:id(g.graph_id,channel,body),channel,...body};if(!g.evidence.some(x=>x.evidence_id===e.evidence_id))g.evidence.push(e);return e.evidence_id;};
 for(const r of g.candidate_relations){
  r.candidate_relation_id=id(g.graph_id,'candidate',r.relation_id);r.candidate_state=r.state==='REJECTED'?'REJECTED':r.state==='INSUFFICIENT'?'INSUFFICIENT':r.state==='COMPETING'?'COMPETING':'SUPPORTED';
  const a=f.analyses.find(a=>a.cl.id===r.clause_id),ns=[nm.get(r.head_node_id),nm.get(r.tail_node_id)],tokenIds=uniq(ns.map(n=>n?.metadata.token_id));
  r.discourse_domain=a?.discourse??null;r.scope_refs=uniq([f.expression_plans.get(r.head_node_id)?.scope_expr_id,f.relation_scope_plans.get(r.relation_id)]);r.source_span_ids=[...r.evidence_span_ids];
  r.syntax_evidence=[evidence('SYNTAX',{clause_id:r.clause_id,model:a?.cl.model??null,token_ids:tokenIds,tokens:(a?.cl.tokens??[]).filter(t=>tokenIds.includes(t.id)),rule_refs:r.rule_refs,source_span_ids:r.source_span_ids})];
  r.srl_evidence=a?.cl.srl?.length?[evidence('SRL',{clause_id:r.clause_id,hints:a.cl.srl,source_span_ids:[a.sid]})]:[];
  r.typed_evidence=ns.filter(n=>n?.metadata.literal_id).map(n=>evidence('TYPED',{node_id:n.node_id,literal_id:n.metadata.literal_id,literal_tag:n.metadata.literal_tag??null,source_span_ids:n.source_span_ids}));
  r.discourse_evidence=a?[evidence('DISCOURSE',{clause_id:r.clause_id,domain:a.discourse,ownership:ns.map(n=>n?.metadata.semantic_ownership),source_span_ids:[a.sid]})]:[];
  r.embedding_evidence=[];for(const n of ns){const obs=modelSignals.observations?.find(x=>x.node_id===n?.node_id);if(obs)r.embedding_evidence.push(evidence('RETRIEVAL',{...obs,source_span_ids:n.source_span_ids}));}
  const validation=modelSignals.relation_validation?.find(x=>x.relation_id===r.relation_id);r.nli_evidence=validation?[evidence('NLI',{...validation,source_span_ids:r.source_span_ids})]:[];
  r.evidence_ids=uniq([...r.syntax_evidence,...r.srl_evidence,...r.typed_evidence,...r.discourse_evidence,...r.embedding_evidence,...r.nli_evidence]);
 }
 for(const [kind,rows] of Object.entries(f.expressions))for(const e of rows)g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'expression',e.expr_id),expression_id:e.expr_id,expression_type:kind,expression:structuredClone(e),source_span_ids:e.source_span_ids,relation_ids:e.relation_ids,candidate_state:'SUPPORTED'});
 for(const n of f.semantic_nodes.filter(n=>n.metadata.resolution||n.node_type==='UNKNOWN_REFERENT'))g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'coreference',n.node_id),expression_id:id(n.node_id,'coreference-set'),expression_type:'coreference_candidates',expression:{referent_node_id:n.node_id,...n.metadata.resolution},source_span_ids:n.source_span_ids,relation_ids:f.relations.filter(r=>r.head_node_id===n.node_id&&r.relation_type==='COREFERENCE').map(r=>r.relation_id),candidate_state:n.metadata.resolution?.selected_node_ids?.length?'SUPPORTED':'COMPETING'});
 g.semantic_node_ids=f.semantic_nodes.map(n=>n.node_id);g.candidate_relation_ids=g.candidate_relations.map(r=>r.candidate_relation_id);g.candidate_expression_ids=g.candidate_expressions.map(e=>e.candidate_expression_id);g.evidence_ids=g.evidence.map(e=>e.evidence_id);g.unresolved_refs=f.unresolved.map(u=>u.unresolved_id);g.source_span_ids=uniq(g.semantic_nodes.flatMap(n=>n.source_span_ids));g.source_sha256=f.source.sha256;
 g.source_text=f.source.raw_text;g.source_spans=structuredClone([...sm.values()]);g.structure=structuredClone(f.structure);g.structure_status=explicitTaskStructure(f);g.phase='FROZEN_BEFORE_GAMMA';
 // Γ consumes this actual registry, not a reconstruction from final semantics.
 for(const x of [g.semantic_nodes,g.candidate_relations,g.candidate_expressions,g.evidence])deepFreeze(x);Object.freeze(g);return g;
}
export function deepFreeze(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))deepFreeze(v);Object.freeze(x);}return x;}
export function explicitTaskStructure(f){
 const declarations=f.doc.structure.nodes.filter(n=>n.type==='HEADING'&&/^\s*#{1,6}\s+WP[- ]\d+\b/iu.test(n.source_span.quote)).map(n=>({structure_id:n.id,source_span:n.source_span}));
 // No block clustering: only explicit source WP markers are read.
 return {status:declarations.length?'EXPLICIT_MULTI_WP':'SINGLE_ROOT',declared_wp_scopes:declarations,automatic_wp_count:0,authority_source:'ADMIN_SOURCE_ONLY'};
}
