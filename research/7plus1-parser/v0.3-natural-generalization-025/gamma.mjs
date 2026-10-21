import {RELATION_CONTRACT} from '../v0.3-admin-short-018-r1/relations.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {certifyNormalizations} from './normalization-evidence.mjs';
import {POLICY} from '../p0-semantic-repair-v0.1/normalization.mjs';

const inert=new Set(['BACKGROUND','RATIONALE','CODE','QUOTE','EXAMPLE','TABLE','METADATA','OUTPUT_CONTENT']);
const modalities=new Set(['REQUIRED','PERMITTED','NOT_REQUIRED','FORBIDDEN']);
const checks=['NODE_TYPE','RELATION_SIGNATURE','RELATION_DIRECTION','DISCOURSE_DOMAIN','PARTICIPANT_ELIGIBILITY','ARTIFACT_ROLE','REFERENCE_BASIS','SCOPE_OWNERSHIP','CONDITION_OWNERSHIP','QUANTITY_TARGET','MODALITY','CARDINALITY','COREFERENCE_UNIQUENESS','EVIDENCE_PROVENANCE','MODEL_EVIDENCE_COHERENCE','MUTUAL_EXCLUSION','GRAPH_CONSISTENCY'];
function exactSpans(g,ids){const points=[...g.source_text],sm=new Map(g.source_spans.map(s=>[s.span_id,s]));return ids.length>0&&ids.every(i=>{const s=sm.get(i);return s&&Number.isInteger(s.start)&&s.end>s.start&&s.end<=points.length&&points.slice(s.start,s.end).join('')===s.text;});}

// Pure Γ: no NLP/model calls, no text candidate creation, no slot writes.
export function certifyCandidateGraph(g){
 if(g.phase!=='FROZEN_BEFORE_GAMMA')throw Error('GAMMA_REQUIRES_FROZEN_GC');
 const nm=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),em=new Map(g.candidate_expressions.map(e=>[e.expression_id,e])),ev=new Map(g.evidence.map(e=>[e.evidence_id,e]));
 const expressions=[],decisions=[],relations=[],unresolved=[];
 const validExpression=(c,stack=[])=>{
  if(c.candidate_state==='COMPETING')return {valid:false,reason:'SOURCE_EXPLICITLY_LEAVES_ALTERNATIVE_SCOPES_UNRESOLVED'};
  if(stack.includes(c.expression_id))return {valid:false,reason:'CYCLIC_EXPRESSION'};
  if(!exactSpans(g,c.source_span_ids))return {valid:false,reason:'EXPRESSION_PROVENANCE_GAP'};
  const x=c.expression,childIds=uniq([...x.operand_expr_ids??[],x.operand_expr_id,x.base_expr_id,x.excluded_expr_id]);
  if(childIds.some(i=>!em.has(i)||!validExpression(em.get(i),[...stack,c.expression_id]).valid))return {valid:false,reason:'UNSUPPORTED_EXPRESSION_OPERAND'};
  const nodes=uniq([x.entity_node_id,x.base_entity_node_id,x.state_node_id,...x.target_node_ids??[],...x.value_node_ids??[],x.referent_node_id]);
  if(nodes.some(i=>!nm.has(i)))return {valid:false,reason:'DANGLING_EXPRESSION_NODE'};
  if([x.entity_node_id,x.base_entity_node_id].filter(Boolean).some(i=>nm.get(i)?.node_type!=='ENTITY'))return {valid:false,reason:'UNRESOLVED_SCOPE_ENTITY_TYPE'};
  if(c.expression_type==='quantity_expr_nodes'&&(!(x.target_node_ids?.length===1)||!x.lower_bound&&!x.upper_bound||[x.lower_bound,x.upper_bound].filter(Boolean).some(b=>!Number.isFinite(b.value))))return {valid:false,reason:'UNRESOLVED_QUANTITY_TARGET_OR_BOUND'};
  if(c.expression_type==='coreference_candidates'&&!(x.selected_node_ids?.length))return {valid:false,reason:'UNRESOLVED_COREFERENCE'};
  return {valid:true,reason:'TYPED_EXPRESSION_WITH_EXACT_PROVENANCE'};
 };
 for(const c of g.candidate_expressions){const v=validExpression(c);expressions.push({gamma_decision_id:id(g.graph_id,'Gamma-expression',c.candidate_expression_id),candidate_expression_id:c.candidate_expression_id,expression_id:c.expression_id,decision:v.valid?'CERTIFIED':'TYPED_UNRESOLVED',reason:v.reason,source_span_ids:c.source_span_ids});}
 for(const c of g.candidate_relations){
  const h=nm.get(c.head_node_id),t=nm.get(c.tail_node_id),sig=RELATION_CONTRACT[c.relation_type],results=Object.fromEntries(checks.map(k=>[k,{status:'PASS',reason:'NOT_APPLICABLE_TO_RELATION_TYPE'}]));
  const fail=(k,reason,kind='UNRESOLVED')=>{results[k]={status:'FAIL',reason,kind};};
  if(!h||!t)fail('NODE_TYPE','MISSING_ENDPOINT','REJECT');
  if(!sig||!sig.head_node_types.includes(h?.node_type)||!sig.tail_node_types.includes(t?.node_type))fail('RELATION_SIGNATURE','INCOMPATIBLE_TYPED_SIGNATURE','REJECT');
  if(h?.node_id===t?.node_id&&!['CONJUNCTION'].includes(c.relation_type))fail('RELATION_DIRECTION','SELF_RELATION','REJECT');
  const contentStructure=c.discourse_domain?.kind==='OUTPUT_CONTENT'&&['CONJUNCTION','PART_OF','LIMIT'].includes(c.relation_type)&&h?.node_type!=='EVENT'&&h?.metadata.semantic_ownership?.status==='UNIQUE'&&h?.metadata.content_owner_provenance?.requirement_ids?.length&&h?.metadata.semantic_ownership?.owner_output_ids?.length===1;
  if(inert.has(c.discourse_domain?.kind)&&!contentStructure)fail('DISCOURSE_DOMAIN','NON_CURRENT_DOMAIN_RETAINED_AS_CANDIDATE','REJECT');
  const negativeDestination=c.relation_type==='RECIPIENT'&&h?.metadata.modality==='FORBIDDEN'&&t?.metadata.argument_role==='PROHIBITED_RECIPIENT'&&c.argument_contract?.kind==='EXPLICIT_PROHIBITED_DESTINATION'&&c.argument_contract.marker_token_ids.length>0&&exactSpans(g,c.argument_contract.source_span_ids);
  if(negativeDestination)results.PARTICIPANT_ELIGIBILITY={status:'PASS',reason:'EXPLICIT_NEGATIVE_DESTINATION_IS_NOT_PARTICIPATION_ASSIGNMENT'};
  else if(['AGENT','RECIPIENT'].includes(c.relation_type)&&!t?.metadata.participant_eligibility?.eligible)fail('PARTICIPANT_ELIGIBILITY','SYNTAX_AGENT_DOES_NOT_PROVE_PARTICIPANT','REJECT');
  const explicitNotifiedPatient=c.relation_type==='PATIENT'&&h?.metadata.sense==='notify'&&t?.metadata.participant_eligibility?.eligible&&g.candidate_relations.some(r=>r.relation_type==='RECIPIENT'&&r.head_node_id===c.head_node_id&&r.tail_node_id===c.tail_node_id&&r.argument_inheritance?.rule==='EXPLICIT_PASSIVE_TYPED_SUBJECT');
  if(['PATIENT','RESULT','SCOPE_MEMBER','FORBIDS','RESTRICTS','THEME'].includes(c.relation_type)&&t?.metadata.participant_roles?.length&&!explicitNotifiedPatient)fail('ARTIFACT_ROLE','PARTICIPANT_CANNOT_AUTOMATICALLY_BE_ARTIFACT','REJECT');
  if(['BASIS','CONFORMS_TO'].includes(c.relation_type)&&(!c.syntax_evidence.length||t?.node_type!=='REFERENCE'))fail('REFERENCE_BASIS','NO_TYPED_REFERENCE_ATTACHMENT','REJECT');
  if(c.scope_refs.some(i=>!expressions.some(e=>e.expression_id===i&&e.decision==='CERTIFIED')))fail('SCOPE_OWNERSHIP','SCOPE_EXPRESSION_NOT_CERTIFIED');
  if(c.condition_refs.some(i=>!expressions.some(e=>e.expression_id===i&&e.decision==='CERTIFIED')))fail('CONDITION_OWNERSHIP','CONDITION_EXPRESSION_NOT_CERTIFIED');
  const leaves=(i,seen=[])=>{if(seen.includes(i))return [];const x=em.get(i)?.expression??{};return uniq([x.entity_node_id,x.base_entity_node_id,...uniq([...x.operand_expr_ids??[],x.base_expr_id,x.excluded_expr_id]).flatMap(j=>leaves(j,[...seen,i]))]);};
  if(['SCOPE_MEMBER','PATIENT','THEME','FORBIDS','RESTRICTS'].includes(c.relation_type)&&c.scope_refs.some(i=>!leaves(i).includes(t?.node_id)))fail('SCOPE_OWNERSHIP','SCOPE_ARGUMENT_DOES_NOT_MATCH_RELATION_OBJECT');
  if(['CONDITION_OF','COMPLETION_OF','APPROVAL_OF'].includes(c.relation_type)){
   const hs=g.structure.clauses.find(x=>x.clause_id===h?.metadata.clause_id),ts=g.structure.clauses.find(x=>x.clause_id===t?.metadata.clause_id);
   if(!hs||!ts||!c.evidence_span_ids.some(i=>hs.source_span_ids.includes(i))||!c.evidence_span_ids.some(i=>ts.source_span_ids.includes(i)))fail('CONDITION_OWNERSHIP','NO_EXPLICIT_ANTECEDENT_CONSEQUENT_SPANS');
  }
  if(c.relation_type==='LIMIT'&&!g.candidate_expressions.some(e=>e.expression_type==='quantity_expr_nodes'&&e.expression.target_node_ids.includes(h?.node_id)&&e.expression.value_node_ids.includes(t?.node_id)&&expressions.some(d=>d.expression_id===e.expression_id&&d.decision==='CERTIFIED')))fail('QUANTITY_TARGET','NO_CERTIFIED_QUANTITY_TARGET');
  if(h?.node_type==='EVENT'&&!modalities.has(h.metadata.modality))fail('MODALITY','UNSTATED_ACTION_MODALITY');
  if(c.relation_type==='FORBIDS'&&h?.metadata.modality!=='FORBIDDEN')fail('MODALITY','FORBID_WITHOUT_NEGATIVE_LICENSE','REJECT');
  if(c.relation_type==='RESTRICTS'){
   const local=h?.metadata.local_restriction,marker=nm.get(local?.marker_node_id),licensed=marker?.metadata.owner===h?.node_id&&marker?.metadata.mode===local?.kind&&exactSpans(g,marker.source_span_ids)&&g.candidate_relations.some(r=>r.head_node_id===marker.node_id&&r.tail_node_id===h.node_id&&r.relation_type==='CONJUNCTION'&&r.candidate_state==='SUPPORTED');
   if(!h?.metadata.restrict&&!licensed)fail('MODALITY','RESTRICTION_WITHOUT_EXPLICIT_LICENSE','REJECT');
  }
  const coref=c.relation_type==='COREFERENCE'?h:t?.node_type==='UNKNOWN_REFERENT'?t:null;
  if(coref){const r=coref.metadata.resolution,selected=r?.selected_node_ids??[],domain=r?.candidate_node_ids??[];if(!selected.length||c.relation_type==='COREFERENCE'&&!selected.includes(t.node_id)||selected.length>1&&r?.rule!=='EXPLICIT_TYPED_DECLARATION_SET')fail('COREFERENCE_UNIQUENESS',domain.length>1?'MULTIPLE_COMPATIBLE_ANTECEDENTS':'NO_UNIQUE_STRUCTURAL_ANTECEDENT');}
  if(c.candidate_state==='COMPETING')fail('CARDINALITY','COMPETING_CANDIDATES_RETAINED');
  if(c.relation_type==='PART_OF'){const contract=c.immediate_container_candidate;if(contract?.status!=='SUPPORTED'||contract.candidate_ids.length!==1||contract.candidate_ids[0]!==t?.node_id||!exactSpans(g,contract.source_span_ids))fail('CARDINALITY','NO_UNIQUE_EXPLICIT_IMMEDIATE_CONTAINER');}
  if(!exactSpans(g,c.source_span_ids)||!c.evidence_ids.length||c.evidence_ids.some(i=>!ev.has(i))||!c.syntax_evidence.some(i=>ev.get(i)?.tokens?.length||c.typed_evidence.length&&ev.get(i)?.rule_refs?.length))fail('EVIDENCE_PROVENANCE','SOURCE_SUPPORTED_SYNTAX_OR_TYPED_EVIDENCE_REQUIRED');
  const validation=(c.nli_evidence??[]).map(i=>ev.get(i)).filter(Boolean);
  for(const v of validation){
   // Scores can strengthen an existing interpretation, never substitute for
   // its source condition/modality/scope or choose a competing referent.
   const malformed=v.status!=='SUPPORTED_HYPOTHESIS_STRUCTURE'||!v.premise||!v.hypothesis||(c.condition_refs??[]).some(i=>v.condition_expr_id!==i||!v.antecedent)||h?.node_type==='EVENT'&&v.modality!==h.metadata.modality;
   if(malformed)fail('MODEL_EVIDENCE_COHERENCE','MODEL_HYPOTHESIS_DOES_NOT_PRESERVE_CANDIDATE_FRAME');
   else results.MODEL_EVIDENCE_COHERENCE={status:'PASS',reason:'MODEL_VALIDATION_PRESERVES_SOURCE_FRAME; SCORES_ARE_NOT_BOUNDARY_TRUTH',nli_evidence_ids:c.nli_evidence,embedding_evidence_ids:c.embedding_evidence,prediction:v.nli??null};
  }
  if(['COMPETING','INSUFFICIENT'].includes(c.candidate_state))fail('MODEL_EVIDENCE_COHERENCE',validation.length?'MODEL_EVIDENCE_CANNOT_REMOVE_SOURCE_OR_STRUCTURAL_UNCERTAINTY':'CANDIDATE_SUPPORT_IS_NOT_UNIQUE_OR_SUFFICIENT');
  const siblings=g.candidate_relations.filter(x=>x.head_node_id===c.head_node_id&&x.relation_type===c.relation_type&&x.candidate_relation_id!==c.candidate_relation_id&&x.candidate_state!=='REJECTED'&&(!['AGENT','RECIPIENT'].includes(c.relation_type)||nm.get(x.tail_node_id)?.metadata.participant_eligibility?.eligible));
  if(['AGENT','RECIPIENT'].includes(c.relation_type)&&new Set([t?.surface,...siblings.map(s=>nm.get(s.tail_node_id)?.surface)]).size>1&&!/和|与|、|\band\b/iu.test(ev.get(c.syntax_evidence[0])?.tokens?.map(t=>t.text).join(' ')??''))fail('CARDINALITY','MULTIPLE_PARTICIPANTS_WITHOUT_EXPLICIT_SET_LICENSE');
  if(siblings.some(x=>x.relation_type==='FORBIDS')&&h?.metadata.modality!=='FORBIDDEN')fail('MUTUAL_EXCLUSION','CONTRADICTORY_MODAL_RELATIONS');
  const owner=h?.metadata.semantic_ownership;if(owner?.status==='AMBIGUOUS')fail('GRAPH_CONSISTENCY','AMBIGUOUS_SEMANTIC_OWNER');
  if(!contentStructure&&owner?.negative_ownership_evidence?.some(e=>e.reason==='ENCLOSED_PREDICATE_HAS_NO_INDEPENDENT_MODAL_LICENSE'))fail('GRAPH_CONSISTENCY','ENCLOSED_PREDICATE_HAS_NO_MODAL_LICENSE','REJECT');
  if(c.candidate_state==='REJECTED')fail('GRAPH_CONSISTENCY','WITHDRAWN_SOURCE_HYPOTHESIS','REJECT');
  const failures=Object.values(results).filter(r=>r.status==='FAIL'),decision=failures.some(r=>r.kind==='REJECT')?'REJECTED':failures.length?'TYPED_UNRESOLVED':'CERTIFIED',did=id(g.graph_id,'Gamma',c.candidate_relation_id),uid=decision==='TYPED_UNRESOLVED'?id(did,'unresolved'):null;
  decisions.push({gamma_decision_id:did,candidate_relation_id:c.candidate_relation_id,graph_id:g.graph_id,relation_id:c.relation_id,decision,checks:results,source_span_ids:c.source_span_ids,evidence_ids:c.evidence_ids});
  relations.push({relation_id:c.relation_id,clause_id:c.clause_id,relation_type:c.relation_type,head_node_id:c.head_node_id,tail_node_id:c.tail_node_id,evidence_span_ids:c.source_span_ids,evidence_tier:decision==='CERTIFIED'?'STRONG':decision==='REJECTED'?'HARD':'AMBIGUOUS',state:decision==='CERTIFIED'?'RESOLVED':decision==='REJECTED'?'REJECTED':'UNRESOLVED',model_signal_refs:c.model_signal_refs,rule_refs:uniq([...c.rule_refs,'GAMMA_025',did]),...(uid?{unresolved_ref:uid}:{})});
  if(uid)unresolved.push({unresolved_id:uid,kind:coref?'UNRESOLVED_COREFERENCE':failures.some(r=>/SCOPE|CONDITION|QUANTITY/u.test(r.reason))?'UNRESOLVED_SCOPE':'UNRESOLVED_RELATION',origin_stage:'GAMMA_CERTIFICATION',source_span_ids:c.source_span_ids,related_span_candidate_ids:[],related_node_ids:[h?.node_id,t?.node_id].filter(Boolean),related_relation_ids:[c.relation_id],related_clause_ids:[c.clause_id],reason:failures.map(r=>r.reason).join('; '),evidence_tier:'AMBIGUOUS'});
 }
 const node_decisions=g.semantic_nodes.map(n=>({gamma_decision_id:id(g.graph_id,'Gamma-node',n.node_id),node_id:n.node_id,decision:!exactSpans(g,n.source_span_ids)||n.node_type==='UNKNOWN_REFERENT'&&!n.metadata.resolution?.selected_node_ids?.length?'TYPED_UNRESOLVED':'CERTIFIED',source_span_ids:n.source_span_ids}));
 return {graph_id:g.graph_id,consumed_graph_id:g.graph_id,consumed_candidate_ids:g.candidate_relation_ids,node_decisions,decisions,expression_decisions:expressions,normalization_decisions:certifyNormalizations(g,POLICY),relations,unresolved,certified_relation_ids:relations.filter(r=>r.state==='RESOLVED').map(r=>r.relation_id),rejected_relation_ids:relations.filter(r=>r.state==='REJECTED').map(r=>r.relation_id),typed_unresolved_relation_ids:relations.filter(r=>r.state==='UNRESOLVED').map(r=>r.relation_id)};
}

