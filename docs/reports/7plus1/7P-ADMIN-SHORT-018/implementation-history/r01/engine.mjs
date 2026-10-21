import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {prepareNative as prepareR2} from '../v0.3-7p-short-direct-016-r2/engine.mjs';
import {produceEligibility,produceBoundaryIR,produceCoverage} from '../v0.3-7p-composition-014/eligibility.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {localizeTypedUnresolved} from '../v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {produceProof} from '../v0.3-7p-composition-014/proof.mjs';
import {relationTypeAudit} from '../v0.3-7p-composition-014/relations.mjs';
import {contractGates} from '../v0.3-7p-short-direct-016-r2/contract-gates.mjs';
import {closeAdminRoot,finalizeAdminRoles} from './root-frames.mjs';
import {closeRootStateBindings} from './state-bindings.mjs';
export function prepareNative(doc,signals){return closeRootStateBindings(closeAdminRoot(prepareR2(doc,signals)));}
export function compileNative(doc,signals,options={}){
 const f=prepareNative(doc,signals);produceEligibility(f);finalizeAdminRoles(f);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);localizeTypedUnresolved(f);
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-admin-short-018',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:f.structure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding},span_lattice:f.span_lattice,semantic_nodes:f.semantic_nodes,relations:f.relations,relation_bundles:f.relation_bundles,unresolved:f.unresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};c.proof_dag=produceProof(c,f.source_spans);
 const stage_availability=Object.fromEntries(['source','structure','nlp_signals','span_lattice','semantic_nodes','relations','relation_bundles','unresolved','eligibility_decisions','coverage','boundary_ir','canonical_7plus1','proof_dag'].map(k=>[k,['source','structure','nlp_signals'].includes(k)?'AVAILABLE':f.unresolved.length||f.coverage.some(c=>c.disposition==='COVERAGE_FAILURE')?'PARTIAL':'AVAILABLE']));
 const gates=contractGates(c,{spans:f.source_spans,availability:stage_availability});return {parser_revision:'v0.3-admin-short-018',contract_version:'0.3-p2.2-scope-consistency-repair',parser_status:gates.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:gates,relation_type_audit:relationTypeAudit(c),native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS'],legacy_reverse_projection_edges:0,direct_raw_nlp_to_slot_edges:0,LLM:'NOT_USED',WP_decomposition:false},first_divergence:f.unresolved.length?{stage:'RELATION_DECODE',reason:f.unresolved[0].reason,unresolved_id:f.unresolved[0].unresolved_id}:null};
}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),r=compileNative(doc,signals,options);r.compiler_v03.nlp_signals.semantic_model_signals={status:'NOT_USED',reason:'018 deterministic candidate; no hybrid lane authorized'};r.compiler_v03.performance.total_ms=performance.now()-start;return r;}
