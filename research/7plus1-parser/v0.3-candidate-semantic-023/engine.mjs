import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {prepareCandidates,freezeCandidateGraph,deepFreeze} from './candidates.mjs';
import {candidateModelEvidence} from './model-evidence.mjs';
import {certifyCandidateGraph} from './gamma.mjs';
import {produceEligibility,produceBoundaryIR,produceCoverage} from '../v0.3-7p-composition-014/eligibility.mjs';
import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {produceProof} from '../v0.3-7p-composition-014/proof.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {localizeTypedUnresolved} from '../v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
import {contractGates} from '../v0.3-7p-short-direct-016-r2/contract-gates.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {noBypassGates,assertNoBypass} from './gates.mjs';
import {candidateProof} from './proof.mjs';

function applyGamma(f,g,G){
 if(f.candidate_semantic_graph!==g||G.consumed_graph_id!==g.graph_id)throw Error('GAMMA_GRAPH_IDENTITY_MISMATCH');
 f.semantic_nodes=structuredClone(g.semantic_nodes);const nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 for(const a of f.analyses){a.events=a.events.map(n=>nm.get(n.node_id));a.locals=a.locals.map(n=>nm.get(n.node_id));for(const k of ['state','quantity_target','local_condition'])if(a[k])a[k]=nm.get(a[k].node_id);if(a.local_condition_states)a.local_condition_states=a.local_condition_states.map(n=>nm.get(n.node_id));}
 f.relations=structuredClone(G.relations);deepFreeze(f.relations);
 f.unresolved=[...f.unresolved,...G.unresolved];
 // No post-Gamma producer can add a relation. Reusable syntax lives only before Γ.
 f.tools.relation=()=>{throw Error('POST_GAMMA_RELATION_CREATION_FORBIDDEN');};
 f.semantic_decoding.part_of_contract={certificates:[],rejected:[]};
 f.relation_bundles=f.analyses.map(a=>({bundle_id:id(f.source.sha256,'bundle',a.cl.id),clause_ids:[a.cl.id],relation_ids:f.relations.filter(r=>r.clause_id===a.cl.id).map(r=>r.relation_id),bundle_state:f.unresolved.some(u=>u.related_clause_ids.includes(a.cl.id))?'PARTIALLY_RESOLVED':'RESOLVED',unresolved_refs:f.unresolved.filter(u=>u.related_clause_ids.includes(a.cl.id)).map(u=>u.unresolved_id)}));
}
function closeBoundaryCertification(f,g,G){
 const ds=new Map(G.decisions.map(d=>[d.relation_id,d])),es=new Map(G.expression_decisions.map(d=>[d.expression_id,d])),ns=new Map(G.node_decisions.map(d=>[d.node_id,d]));
 for(const p of f.fact_plans){const failed=uniq([...p.relation_ids.filter(i=>ds.get(i)?.decision!=='CERTIFIED'),...p.node_ids.filter(i=>ns.get(i)?.decision!=='CERTIFIED'),...['scope_expr_id','condition_expr_id','quantity_expr_id'].filter(k=>p[k]&&es.get(p[k])?.decision!=='CERTIFIED').map(k=>p[k])]);
  if(failed.length&&!p.unresolved_ref){const cl=f.analyses.find(a=>p.source_span_ids.includes(a.sid))?.cl;p.unresolved_ref=f.tools.unknown(cl,'UNRESOLVED_RELATION','Gamma did not certify all boundary dependencies: '+failed.join(', '),p.node_ids);const e=f.eligibility_decisions.find(e=>e.eligibility_decision_id===p.eligibility_decision_id);e.unresolved_ref=p.unresolved_ref;}
 }
 const declared=new Set(g.candidate_expressions.filter(e=>e.expression_type!=='coreference_candidates').map(e=>e.expression_id));
 if(Object.values(f.expressions).flat().some(e=>!declared.has(e.expr_id)))throw Error('EXPRESSION_CREATED_AFTER_GAMMA');
}
export function compileCandidates(f,modelSignals={},options={}){
 const g=freezeCandidateGraph(f,modelSignals),G=certifyCandidateGraph(g);applyGamma(f,g,G);produceEligibility(f);closeBoundaryCertification(f,g,G);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);localizeTypedUnresolved(f);
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-candidate-semantic-023',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:f.structure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding,semantic_model_signals:modelSignals},span_lattice:f.span_lattice,semantic_nodes:f.semantic_nodes,relations:f.relations,relation_bundles:f.relation_bundles,unresolved:f.unresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};
 c.proof_dag=produceProof(c,f.source_spans);
 // Frozen downstream contract is checked on its unchanged fields. New stages are separate contracts.
 const stage_availability=Object.fromEntries(Object.keys(c).map(k=>[k,'AVAILABLE'])),compatibility=contractGates(c,{spans:f.source_spans,availability:stage_availability});
 c.candidate_semantic_graph=g;c.gamma_certification=G;c.task_structure=g.structure_status;
 c.boundary_certification=c.boundary_ir.facts.map(b=>({boundary_fact_id:b.boundary_fact_id,eligibility_decision_id:b.eligibility_decision_id,status:b.state==='RESOLVED'?'CERTIFIED':'TYPED_UNRESOLVED',candidate_relation_ids:b.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i)?.candidate_relation_id),gamma_decision_ids:uniq([...b.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i)?.gamma_decision_id),...b.node_ids.map(i=>G.node_decisions.find(d=>d.node_id===i)?.gamma_decision_id),...['scope_expr_id','condition_expr_id','quantity_expr_id'].map(k=>G.expression_decisions.find(d=>d.expression_id===b[k])?.gamma_decision_id)])}));
 c.candidate_proof=candidateProof(c);
 const gates=noBypassGates(c);assertNoBypass(c);
 for(const k of ['candidate_semantic_graph','gamma_certification','candidate_proof'])stage_availability[k]='AVAILABLE';
 return {parser_revision:'v0.3-candidate-semantic-023',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:compatibility,candidate_graph_gate_results:gates,parser_status:compatibility.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS','CANDIDATE_SEMANTIC_GRAPH','GAMMA'],legacy_reverse_projection_edges:0,LLM:'NOT_USED',WP_decomposition:false},first_divergence:f.unresolved.length?{stage:'GAMMA_CERTIFICATION',reason:f.unresolved[0].reason,unresolved_id:f.unresolved[0].unresolved_id}:null};
}
export function compileNative(doc,signals,options={}){return compileCandidates(prepareCandidates(doc,signals),{status:'NOT_USED_SYNCHRONOUS_MECHANISM_TEST',models:[],observations:[],relation_validation:[]},options);}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),f=prepareCandidates(doc,signals),models=await candidateModelEvidence(f),r=compileCandidates(f,models,options);r.compiler_v03.performance.total_ms=performance.now()-start;return r;}
