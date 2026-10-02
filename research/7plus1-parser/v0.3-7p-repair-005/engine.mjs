import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from './linguistic.mjs';
import {nativeFrontend} from './frontend.mjs';import {resolveExpressions} from './expressions.mjs';import {produceEligibility,produceBoundaryIR,produceCoverage} from './eligibility.mjs';import {projectCanonical} from './projection.mjs';import {produceProof} from './proof.mjs';import {relationTypeAudit} from './relations.mjs';
import {contractGates} from './compiler/validation/gates.mjs';
import {semanticModelSignals} from './model-signals.mjs';
import {localizeCoverage} from './coverage-locality.mjs';
import {decodeCandidates} from './semantic-decoder.mjs';
import {finalizeDecodingTrace} from './decoding-trace.mjs';
import {preserveSourceSemantics} from './source-semantics.mjs';
import {semanticSoundness} from './semantic-soundness.mjs';
import {prepareDiscourse,finalDiscourse} from './discourse.mjs';
import {participantEligibility,prepareQuantityTargets} from './semantic-eligibility.mjs';
import {documentConstructions} from './document-constructions.mjs';
import {closeSemanticGraph} from './graph-closure.mjs';
import {closeEdges} from './edge-closure.mjs';
import {structuredRecovery} from './structured-recovery.mjs';
import {materializeCandidates,graphSnapshot} from './candidate-recall.mjs';
export function candidateGraph(doc,signals){const f=finalDiscourse(participantEligibility(semanticSoundness(resolveExpressions(prepareQuantityTargets(participantEligibility(documentConstructions(prepareDiscourse(preserveSourceSemantics(decodeCandidates(nativeFrontend(doc,signals)))))))))));structuredRecovery(f);closeSemanticGraph(f);return materializeCandidates(f);}
export function compileNative(doc,signals,options={}){
 const f=closeEdges(candidateGraph(doc,signals));f.semantic_decoding.candidate_recall.edge_output=graphSnapshot(f);f.tools.attachContext();finalizeDecodingTrace(f);produceEligibility(f);f.semantic_decoding.candidate_recall.eligibility_decisions=structuredClone(f.eligibility_decisions);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-7p-repair-005',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:f.structure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding},span_lattice:f.span_lattice,semantic_nodes:f.semantic_nodes,relations:f.relations,relation_bundles:f.relation_bundles,unresolved:f.unresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};c.proof_dag=produceProof(c,f.source_spans);
 const stage_availability=Object.fromEntries(['source','structure','nlp_signals','span_lattice','semantic_nodes','relations','relation_bundles','unresolved','eligibility_decisions','coverage','boundary_ir','canonical_7plus1','proof_dag'].map(k=>[k,['source','structure','nlp_signals'].includes(k)?'AVAILABLE':f.unresolved.length||f.coverage.some(c=>c.disposition==='COVERAGE_FAILURE')?'PARTIAL':'AVAILABLE']));
 if(['I','O','A','P','R','V','C','B'].some(k=>['PARSER_COVERAGE_FAILURE','UNRESOLVED'].includes(c.canonical_7plus1[k].status)))stage_availability.canonical_7plus1='PARTIAL';
 const gates=contractGates(c,{spans:f.source_spans,availability:stage_availability}),signature=relationTypeAudit(c);return {parser_revision:'v0.3-7p-repair-005',contract_version:'0.3-p2.2-scope-consistency-repair',parser_status:gates.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:gates,relation_type_audit:signature,native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS'],legacy_reverse_projection_edges:0,direct_raw_nlp_to_slot_edges:0,LLM:'NOT_USED'},first_divergence:f.unresolved.length?{stage:'RELATION_DECODE',reason:f.unresolved[0].reason,unresolved_id:f.unresolved[0].unresolved_id}:null};
}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),r=compileNative(doc,signals,options);r.compiler_v03.nlp_signals.semantic_model_signals=await semanticModelSignals(r);r.compiler_v03.performance.total_ms=performance.now()-start;return r;}
