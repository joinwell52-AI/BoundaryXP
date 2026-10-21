import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {prepareCandidates,freezeCandidateGraph,deepFreeze} from './candidates.mjs';
import {candidateModelEvidence} from './model-evidence.mjs';
import {certifyCandidateGraph} from './gamma.mjs';
import {produceEligibility,produceBoundaryIR,produceCoverage} from './eligibility.mjs';
import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {produceProof} from '../v0.3-7p-composition-014/proof.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {localizeTypedUnresolved} from '../v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
import {contractGates} from '../v0.3-admin-short-018-r1/contract-gates.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {noBypassGates,assertNoBypass} from './downstream-entry-gates.mjs';
import {candidateProof} from './proof.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {contractNode,contractLattice} from './contract-transport.mjs';

function applyGamma(f,g,G){
 if(f.candidate_semantic_graph!==g||G.consumed_graph_id!==g.graph_id)throw Error('GAMMA_GRAPH_IDENTITY_MISMATCH');
 f.semantic_nodes=structuredClone(g.semantic_nodes);const nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const ns=new Map(G.node_decisions.map(d=>[d.node_id,d]));
 for(const n of f.semantic_nodes){const d=ns.get(n.node_id);n.state=d.decision==='CERTIFIED'?'RESOLVED':d.decision==='REJECTED'?'REJECTED':'UNRESOLVED';Object.assign(n.metadata,d.metadata_overrides);if(d.unresolved_ref)n.unresolved_ref=d.unresolved_ref;if(d.decision==='CERTIFIED'){delete n.unresolved_ref;delete n.metadata.modality_unresolved;}if(n.metadata.participant_candidate?.eligible){n.metadata.participant_eligibility={...n.metadata.participant_candidate,gamma_decision_id:d.gamma_decision_id};n.metadata.participant_roles=uniq(G.relations.filter(r=>r.state==='RESOLVED'&&r.tail_node_id===n.node_id&&['AGENT','RECIPIENT'].includes(r.relation_type)).flatMap(r=>{const h=nm.get(r.head_node_id);const proposal=g.candidate_relations.find(c=>c.relation_id===r.relation_id);return [proposal.generic_evidence?.find(e=>e.participant_role)?.participant_role??(r.relation_type==='RECIPIENT'?'RECIPIENT':h.node_type==='STATE'?(h.metadata.sense==='APPROVAL_OPERATOR'?'APPROVER':'COLLABORATOR'):h.metadata.sense==='review'?'REVIEWER':'PERFORMER')];}));}if(d.decision==='CERTIFIED'){n.metadata.completion=n.metadata.completion_candidate??n.metadata.completion;n.metadata.stop=n.metadata.stop_candidate??n.metadata.stop;}}
 f.tools.task=nm.get(f.tools.task.node_id);
 for(const a of f.analyses){a.events=a.events.filter(n=>ns.get(n.node_id)?.decision==='CERTIFIED').map(n=>nm.get(n.node_id));a.locals=a.locals.map(n=>nm.get(n.node_id));for(const k of ['state','quantity_target','local_condition'])if(a[k])a[k]=ns.get(a[k].node_id)?.decision==='CERTIFIED'?nm.get(a[k].node_id):null;if(a.local_condition_states)a.local_condition_states=a.local_condition_states.filter(n=>ns.get(n.node_id)?.decision==='CERTIFIED').map(n=>nm.get(n.node_id));a.handled=a.events.length>0||Boolean(a.state)||a.structure_only||G.certified_relation_ids.some(i=>g.candidate_relations.find(r=>r.relation_id===i)?.clause_id===a.cl.id);}
 f.expression_plans=new Map(G.expression_plans.map(p=>[p.predicate_node_id,Object.fromEntries(['scope_expr_id','condition_expr_id','quantity_expr_id'].filter(k=>p[k]).map(k=>[k,p[k]]))]));
 for(const a of f.analyses){const fields=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='EXPLICIT_COPULAR_FIELD'&&ns.get(n.node_id)?.decision==='CERTIFIED');if(fields.length===1){a.state=fields[0];a.handled=true;}}
 for(const a of f.analyses)if(!a.state&&a.local_condition_states?.length){a.state=a.local_condition_states[0];a.handled=true;}
 f.semantic_decoding.resource_target_ir.certificates=g.candidate_relations.filter(r=>r.relation_type==='LIMIT'&&G.certified_relation_ids.includes(r.relation_id)&&r.generic_evidence?.some(e=>e.rule==='EXPLICIT_LOCAL_EXECUTION_COUNT_BUDGET')).map(r=>({relation_id:r.relation_id,target_node_id:r.head_node_id,value_node_id:r.tail_node_id,rule:'EXPLICIT_LOCAL_EXECUTION_COUNT_BUDGET',quantity_expr_id:g.candidate_expressions.find(e=>e.expression_type==='quantity_expr_nodes'&&e.relation_ids.includes(r.relation_id))?.expression_id,gamma_decision_id:G.decisions.find(d=>d.relation_id===r.relation_id).gamma_decision_id,source_span_ids:r.source_span_ids}));
 // Materialize Γ's accepted state alternatives; source proposals remain frozen
 // in Gc. This is a downstream representation, never a pre-Γ decoder.
 f.semantic_decoding.output_content_ir={requirements:[]};
 f.semantic_decoding.state_argument_ir=f.semantic_nodes.filter(n=>n.metadata.state_argument_contract).map(n=>({state_node_id:n.node_id,...n.metadata.state_argument_contract,gamma_decision_id:ns.get(n.node_id).gamma_decision_id}));
 f.semantic_decoding.scope_restriction_ir=(g.scope_expression_candidates??[]).filter(p=>p.relation_ids.every(i=>G.certified_relation_ids.includes(i))).map(p=>({...p,event_node_id:p.predicate_node_id,...(p.kind==='INCLUDED'?{operator:'ONLY',included_node_id:p.object_node_id}:{excluded_node_id:p.object_node_id,excluded_surface:nm.get(p.object_node_id)?.surface}),gamma_decision_ids:p.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i).gamma_decision_id)}));
 f.semantic_decoding.nominal_component_ir=(g.nominal_component_candidates??[]).filter(p=>p.relation_ids.every(i=>G.certified_relation_ids.includes(i))).map(p=>({...p,gamma_decision_ids:p.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i).gamma_decision_id)}));
 for(const p of f.semantic_decoding.nominal_component_ir){const n=nm.get(p.argument_node_id);n.metadata.nominal_components=p.member_node_ids;n.metadata.nominal_component_set_expr_id=p.expression_id;}
 f.semantic_decoding.negative_role_declarations=f.semantic_nodes.filter(n=>n.metadata.sense==='NEGATIVE_RESPONSIBILITY_DECLARATION'&&ns.get(n.node_id)?.decision==='CERTIFIED').map(n=>({state_node_id:n.node_id,subject_node_id:n.metadata.negative_role_subject_id,negative_roles:n.metadata.negative_roles,source_span_ids:n.source_span_ids,gamma_decision_id:ns.get(n.node_id).gamma_decision_id}));
 for(const d of g.structural_state_alternatives??[]){if(ns.get(d.state_node_id)?.decision!=='CERTIFIED')continue;const a=f.analyses.find(a=>a.cl.id===d.clause_id);a.state=nm.get(d.state_node_id);a.handled=true;
  if(d.kind==='OUTPUT_CONTENT_REQUIREMENT'){const owned=G.relations.filter(r=>r.state==='RESOLVED'&&d.relation_ids.includes(r.relation_id)),owners=uniq(owned.map(r=>r.tail_node_id)),condition=f.expression_plans.get(d.state_node_id)?.condition_expr_id,body=g.candidate_expressions.find(e=>e.expression_id===condition)?.expression;f.semantic_decoding.output_content_ir.requirements.push({requirement_id:id(d.state_node_id,'content'),clause_id:d.clause_id,semantic_node_ids:[d.state_node_id,...d.member_node_ids],owner_output_ids:owners,ownership_status:owners.length===1?'UNIQUE_OUTPUT':'UNRESOLVED_OUTPUT_SET',content_modality:a.state.metadata.content_modality,member_node_ids:d.member_node_ids,member_source_texts:d.member_node_ids.map(i=>nm.get(i)?.surface),source_span_ids:d.source_span_ids,relation_ids:owned.map(r=>r.relation_id),condition_expr_id:condition??null,components:body?[{operator:body.op,condition_expr_id:condition,source_span_ids:body.source_span_ids}]:[],gamma_decision_id:ns.get(d.state_node_id).gamma_decision_id});}
 }
 // Eligibility consumes Gb + Gu. Rejections retain their complete identities
 // and source/proof lineage in frozen Gc and the Γ receipt, never as live facts.
 f.relations=structuredClone(G.relations.filter(r=>r.state!=='REJECTED'));for(const r of f.relations){const candidate=g.candidate_relations.find(c=>c.relation_id===r.relation_id),decision=G.decisions.find(d=>d.relation_id===r.relation_id);if(candidate.dependency_relation_ids)r.dependency_relation_ids=decision.dependency_operator==='ANY_EXPLICIT_INPUT_USE'?decision.certified_dependency_relation_ids:candidate.dependency_relation_ids.filter(i=>G.decisions.find(d=>d.relation_id===i)?.decision!=='REJECTED');}deepFreeze(f.relations);
 f.semantic_nodes=f.semantic_nodes.filter(n=>n.state!=='REJECTED');
 f.relation_scope_plans=new Map([...f.relation_scope_plans].filter(([i,expr])=>f.relations.some(r=>r.relation_id===i)&&G.expression_decisions.some(d=>d.expression_id===expr&&d.decision==='CERTIFIED')));
 f.unresolved=[...f.unresolved.filter(u=>G.unresolved_evidence_decisions.find(d=>d.unresolved_id===u.unresolved_id)?.disposition!=='DISCHARGED_BY_GAMMA'),...G.unresolved].map(u=>({...u,related_node_ids:u.related_node_ids.filter(i=>ns.get(i)?.decision!=='REJECTED'),related_relation_ids:u.related_relation_ids.filter(i=>G.decisions.find(d=>d.relation_id===i)?.decision!=='REJECTED')}));
 // Unused superseded candidate expressions remain in Gc/Gu, not as invalid
 // live BoundaryIR operands. Never discard an expression referenced by a plan.
 const live=new Set([...f.expression_plans.values(),...f.relation_scope_plans.values()].flatMap(p=>typeof p==='string'?[p]:[p.scope_expr_id,p.condition_expr_id,p.quantity_expr_id]).filter(Boolean));
 for(const key of Object.keys(f.expressions))f.expressions[key]=f.expressions[key].filter(e=>live.has(e.expr_id)||G.expression_decisions.some(d=>d.expression_id===e.expr_id&&d.decision==='CERTIFIED'));
 // No post-Gamma producer can add a relation. Reusable syntax lives only before Γ.
 f.tools.relation=()=>{throw Error('POST_GAMMA_RELATION_CREATION_FORBIDDEN');};
 f.semantic_decoding.part_of_contract={certificates:g.candidate_relations.filter(r=>r.relation_type==='PART_OF'&&G.certified_relation_ids.includes(r.relation_id)).map(r=>{const d=G.decisions.find(d=>d.relation_id===r.relation_id);return {...r.immediate_container_candidate,candidate_domain_ids:r.immediate_container_candidate.candidate_ids,candidate_ids:d.certified_owner_node_ids,relation_id:r.relation_id,certificate_id:id(r.relation_id,'Gamma-container'),gamma_decision_id:d.gamma_decision_id};}),rejected:g.candidate_relations.filter(r=>r.relation_type==='PART_OF'&&!G.certified_relation_ids.includes(r.relation_id)).map(r=>r.immediate_container_candidate)};
 f.relation_bundles=f.analyses.map(a=>({bundle_id:id(f.source.sha256,'bundle',a.cl.id),clause_ids:[a.cl.id],relation_ids:f.relations.filter(r=>r.clause_id===a.cl.id).map(r=>r.relation_id),bundle_state:f.unresolved.some(u=>u.related_clause_ids.includes(a.cl.id))?'PARTIALLY_RESOLVED':'RESOLVED',unresolved_refs:f.unresolved.filter(u=>u.related_clause_ids.includes(a.cl.id)).map(u=>u.unresolved_id)}));
 buildSemanticOwnership(f,'AFTER_GAMMA');
}
function closeBoundaryCertification(f,g,G){
 const ds=new Map(G.decisions.map(d=>[d.relation_id,d])),es=new Map(G.expression_decisions.map(d=>[d.expression_id,d])),ns=new Map(G.node_decisions.map(d=>[d.node_id,d]));
 for(const p of f.fact_plans){const failed=uniq([...p.relation_ids.filter(i=>ds.get(i)?.decision!=='CERTIFIED'),...p.node_ids.filter(i=>ns.get(i)?.decision!=='CERTIFIED'),...['scope_expr_id','condition_expr_id','quantity_expr_id'].filter(k=>p[k]&&es.get(p[k])?.decision!=='CERTIFIED').map(k=>p[k])]);
  if(failed.length&&!p.unresolved_ref){const cl=f.analyses.find(a=>p.source_span_ids.includes(a.sid))?.cl;p.unresolved_ref=f.tools.unknown(cl,'UNRESOLVED_RELATION','Gamma did not certify all boundary dependencies: '+failed.join(', '),p.node_ids);const e=f.eligibility_decisions.find(e=>e.eligibility_decision_id===p.eligibility_decision_id);e.unresolved_ref=p.unresolved_ref;}
 }
 const declared=new Set(g.candidate_expressions.filter(e=>e.expression_type!=='coreference_candidates').map(e=>e.expression_id));
 if(Object.values(f.expressions).flat().some(e=>!declared.has(e.expr_id)))throw Error('EXPRESSION_CREATED_AFTER_GAMMA');
}
function expressionDependencyClosure(f){
 const expressions=new Map(Object.values(f.expressions).flat().map(x=>[x.expr_id,x])),nodes=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),relations=new Map(f.relations.map(r=>[r.relation_id,r]));
 for(const p of f.fact_plans){
  const seen=new Set(),collect=i=>{if(!i||seen.has(i))return;seen.add(i);const x=expressions.get(i);if(!x)return;
   p.relation_ids=uniq([...p.relation_ids,...x.relation_ids]);p.source_span_ids=uniq([...p.source_span_ids,...x.source_span_ids]);
   for(const j of uniq([...x.operand_expr_ids??[],x.operand_expr_id,x.base_expr_id,x.excluded_expr_id]))collect(j);
  };for(const k of ['scope_expr_id','condition_expr_id','quantity_expr_id'])collect(p[k]);
  for(const i of p.node_ids){const n=nodes.get(i);collect(n?.metadata.nominal_component_set_expr_id);collect(n?.metadata.state_argument_contract?.scope_expr_id);collect(n?.metadata.state_argument_contract?.qualifier_expr_id);for(const key of n?.metadata.local_quantifier_scope_expr_ids??[])collect(key);}
  // A later provider can add a local role to an already proposed contextual
  // event. Every fact using that event must carry Γ's modal prerequisite,
  // including participant/condition facts with no copied patient relation.
  // This closes existing certified dependencies; it creates no new reading.
  let dependencyChanged=true;
  while(dependencyChanged){const before=p.relation_ids.length+p.node_ids.length;
   for(const i of p.node_ids){const context=nodes.get(i)?.metadata.context_modal_contract;if(!context?.gamma_source_structure_validated)continue;
    const propagation=[...relations.values()].find(r=>r.relation_type==='CONJUNCTION'&&r.head_node_id===context.governor_node_id&&r.tail_node_id===i&&r.state==='RESOLVED');
    if(!propagation)throw Error('CERTIFIED_CONTEXT_WITHOUT_CERTIFIED_MODAL_PREREQUISITE');
    p.relation_ids=uniq([...p.relation_ids,propagation.relation_id]);
   }
   for(let index=0;index<p.relation_ids.length;index++)p.relation_ids=uniq([...p.relation_ids,...relations.get(p.relation_ids[index])?.dependency_relation_ids??[]]);
   p.node_ids=uniq([...p.node_ids,...p.relation_ids.flatMap(i=>{const r=relations.get(i);return r?[r.head_node_id,r.tail_node_id]:[];})]);
   dependencyChanged=before!==p.relation_ids.length+p.node_ids.length;
  }
  p.source_span_ids=uniq([...p.source_span_ids,...p.node_ids.flatMap(i=>nodes.get(i)?.source_span_ids??[])]);
  const e=f.eligibility_decisions.find(e=>e.eligibility_decision_id===p.eligibility_decision_id);e.candidate_relation_ids=[...p.relation_ids];e.candidate_node_ids=[...p.node_ids];e.source_span_ids=[...p.source_span_ids];
 }
}
export function compileCandidates(f,modelSignals={},options={}){return compileFrozenCandidates(f,freezeCandidateGraph(f,modelSignals),modelSignals,options);}
export function compileFrozenCandidates(f,g,modelSignals={},options={}){
 if(f.candidate_semantic_graph!==g||g.source_sha256!==f.source.sha256||!Object.isFrozen(g))throw Error('DOWNSTREAM_INPUT_GRAPH_IDENTITY_MISMATCH');
 const G=certifyCandidateGraph(g);applyGamma(f,g,G);f.tools.setStage('ELIGIBILITY');produceEligibility(f);expressionDependencyClosure(f);f.tools.setStage('GAMMA_CERTIFICATION');closeBoundaryCertification(f,g,G);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);localizeTypedUnresolved(f);
 // Candidate dependency edges have already been consumed into fact/proof
 // closure. They are not fields of the frozen certified Relation schema.
 f.semantic_decoding.relation_dependency_ir=f.relations.filter(r=>r.dependency_relation_ids?.length).map(r=>({relation_id:r.relation_id,dependency_relation_ids:r.dependency_relation_ids,source_span_ids:r.evidence_span_ids}));
 f.semantic_decoding.unresolved_origin_ir=f.unresolved.map(u=>({unresolved_id:u.unresolved_id,origin_stage:u.origin_stage??null,source_span_ids:u.source_span_ids??[]}));
 f.semantic_decoding.source_partition_ir=f.structure.clauses.filter(c=>c.source_structure_partition).map(c=>({clause_id:c.clause_id,...c.source_structure_partition}));
 const contractStructure={...f.structure,clauses:f.structure.clauses.map(({source_structure_partition,...clause})=>clause)},contractUnresolved=f.unresolved.map(({origin_stage,source_span_ids,...u})=>u);
 const contractRelations=f.relations.filter(r=>r.state!=='REJECTED').map(({dependency_relation_ids,...relation})=>relation);
 const liveRelationIds=new Set(contractRelations.map(r=>r.relation_id));
 const contractBundles=f.relation_bundles.map(b=>({...b,relation_ids:b.relation_ids.filter(i=>liveRelationIds.has(i))}));
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-candidate-parsing-026',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:contractStructure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding,semantic_model_signals:modelSignals},span_lattice:contractLattice(f.span_lattice),semantic_nodes:f.semantic_nodes.filter(n=>n.state!=='REJECTED').map(n=>contractNode(n,G)),relations:contractRelations,relation_bundles:contractBundles,unresolved:contractUnresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};
 c.proof_dag=produceProof(c,f.source_spans);
 // Frozen downstream contract is checked on its unchanged fields. New stages are separate contracts.
 const stage_availability=Object.fromEntries(Object.keys(c).map(k=>[k,'AVAILABLE'])),compatibility=contractGates(c,{spans:f.source_spans,availability:stage_availability});
 c.candidate_semantic_graph=g;c.gamma_certification=G;c.task_structure=g.structure_status;
 c.boundary_certification=c.boundary_ir.facts.map(b=>({boundary_fact_id:b.boundary_fact_id,eligibility_decision_id:b.eligibility_decision_id,status:b.state==='RESOLVED'?'CERTIFIED':'TYPED_UNRESOLVED',candidate_relation_ids:b.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i)?.candidate_relation_id),gamma_decision_ids:uniq([...b.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i)?.gamma_decision_id),...b.node_ids.map(i=>G.node_decisions.find(d=>d.node_id===i)?.gamma_decision_id),...['scope_expr_id','condition_expr_id','quantity_expr_id'].map(k=>G.expression_decisions.find(d=>d.expression_id===b[k])?.gamma_decision_id)])}));
 c.candidate_proof=candidateProof(c);
 const gates=noBypassGates(c,options.input_domain);assertNoBypass(c,options.input_domain);
 for(const k of ['candidate_semantic_graph','gamma_certification','candidate_proof'])stage_availability[k]='AVAILABLE';
 const stageOrder=['STRUCTURE','NLP_SIGNAL','SPAN_LATTICE','SEMANTIC_NODE','CANDIDATE_GENERATION','CANDIDATE_EXPRESSION','EVIDENCE_ATTACHMENT','GAMMA_CERTIFICATION','ELIGIBILITY','BOUNDARY_IR','PROJECTION','PROOF','COVERAGE'];
 const earliest=[...f.unresolved].sort((a,b)=>stageOrder.indexOf(a.origin_stage)-stageOrder.indexOf(b.origin_stage))[0];
 return {parser_revision:'v0.3-candidate-parsing-026',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:compatibility,candidate_graph_gate_results:gates,parser_status:compatibility.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS','CANDIDATE_SEMANTIC_GRAPH','GAMMA'],legacy_reverse_projection_edges:0,LLM:'NOT_USED',WP_decomposition:false},first_divergence:earliest?{stage:earliest.origin_stage??'ORIGIN_NOT_RECORDED',reason:earliest.reason,unresolved_id:earliest.unresolved_id,confirmation:'UNREVIEWED_TYPED_UNRESOLVED',source_span_ids:earliest.source_span_ids??[]}:null};
}
export function compileNative(doc,signals,options={}){return compileCandidates(prepareCandidates(doc,signals),{status:'NOT_USED_SYNCHRONOUS_MECHANISM_TEST',models:[],observations:[],relation_validation:[]},options);}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),f=prepareCandidates(doc,signals),models=await candidateModelEvidence(f),r=compileCandidates(f,models,options);r.compiler_v03.performance.total_ms=performance.now()-start;return r;}
