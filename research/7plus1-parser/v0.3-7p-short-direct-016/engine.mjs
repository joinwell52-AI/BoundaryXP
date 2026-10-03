import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {nativeFrontend} from '../v0.3-7p-composition-014/frontend.mjs';import {resolveExpressions} from '../v0.3-7p-composition-014/expressions.mjs';import {produceEligibility,produceBoundaryIR,produceCoverage} from '../v0.3-7p-composition-014/eligibility.mjs';import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';import {produceProof} from '../v0.3-7p-composition-014/proof.mjs';import {relationTypeAudit} from '../v0.3-7p-composition-014/relations.mjs';
import {contractGates} from '../v0.3-7p-composition-014/compiler/validation/gates.mjs';
import {semanticModelSignals} from '../v0.3-7p-composition-014/model-signals.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {decodeCandidates} from '../v0.3-7p-composition-014/semantic-decoder.mjs';
import {finalizeDecodingTrace} from '../v0.3-7p-composition-014/decoding-trace.mjs';
import {preserveSourceSemantics} from '../v0.3-7p-composition-014/source-semantics.mjs';
import {semanticSoundness} from '../v0.3-7p-composition-014/semantic-soundness.mjs';
import {prepareDiscourse,finalDiscourse} from '../v0.3-7p-composition-014/discourse.mjs';
import {participantEligibility,prepareQuantityTargets} from '../v0.3-7p-composition-014/semantic-eligibility.mjs';
import {documentConstructions} from '../v0.3-7p-composition-014/document-constructions.mjs';
import {closeSemanticGraph} from '../v0.3-7p-composition-014/graph-closure.mjs';
import {closeEdges} from '../v0.3-7p-composition-014/edge-closure.mjs';
import {structuredRecovery} from '../v0.3-7p-composition-014/structured-recovery.mjs';
import {materializeCandidates,graphSnapshot} from '../v0.3-7p-composition-014/candidate-recall.mjs';
import {certifyFrames} from '../v0.3-7p-composition-014/frame-certification.mjs';
import {closeInstructionIdentities} from '../v0.3-7p-composition-014/cross-instruction-identity.mjs';
import {closeDeclaredBehavior} from '../v0.3-7p-composition-014/declared-behavior.mjs';
import {closeOwnedTestContracts} from '../v0.3-7p-composition-014/owned-test-contract.mjs';
import {closeInstantiatedInputScope} from '../v0.3-7p-composition-014/instantiated-input-scope.mjs';
import {closeTableInstructions} from '../v0.3-7p-composition-014/table-instructions.mjs';
import {closeRecipientFields} from '../v0.3-7p-composition-014/recipient-fields.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {certifySourceBindings} from '../v0.3-7p-composition-014/source-binding.mjs';
import {certifyQualifiedIdentity} from '../v0.3-7p-composition-014/qualified-identity.mjs';
import {closeExplicitRecipients} from '../v0.3-7p-composition-014/explicit-recipient.mjs';
import {constructDistribution} from '../v0.3-7p-composition-014/distributive-construction.mjs';
import {certifyWholeFrames} from '../v0.3-7p-composition-014/whole-composition.mjs';
import {closeShortFrames} from './short-frames.mjs';
export function candidateGraph(doc,signals){const f=finalDiscourse(participantEligibility(semanticSoundness(resolveExpressions(prepareQuantityTargets(participantEligibility(documentConstructions(prepareDiscourse(preserveSourceSemantics(decodeCandidates(nativeFrontend(doc,signals)))))))))));structuredRecovery(f);closeSemanticGraph(f);return materializeCandidates(f);}
export function prepareNative(doc,signals){
 const f=closeEdges(candidateGraph(doc,signals));closeTableInstructions(f);buildSemanticOwnership(f,'PRE_FRAME');f.semantic_decoding.candidate_recall.edge_output=graphSnapshot(f);certifyFrames(f);closeInstructionIdentities(f);closeDeclaredBehavior(f);closeOwnedTestContracts(f);closeInstantiatedInputScope(f);closeRecipientFields(f);f.tools.attachContext();buildSemanticOwnership(f,'PRE_ELIGIBILITY');certifyQualifiedIdentity(f);closeExplicitRecipients(f);certifySourceBindings(f);f.tools.attachContext();buildSemanticOwnership(f,'PRE_CERTIFIED_BINDING');constructDistribution(f);buildSemanticOwnership(f,'PRE_DISTRIBUTIVE_CERTIFICATION');certifyWholeFrames(f);closeShortFrames(f);f.tools.attachContext();buildSemanticOwnership(f,'SHORT_DIRECT_FINAL');finalizeDecodingTrace(f);return f;
}
export function compileNative(doc,signals,options={}){
 const f=prepareNative(doc,signals);produceEligibility(f);f.semantic_decoding.candidate_recall.eligibility_decisions=structuredClone(f.eligibility_decisions);f.semantic_decoding.frame_certification.eligibility_decisions=structuredClone(f.eligibility_decisions);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-7p-short-direct-016',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:f.structure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding},span_lattice:f.span_lattice,semantic_nodes:f.semantic_nodes,relations:f.relations,relation_bundles:f.relation_bundles,unresolved:f.unresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};c.proof_dag=produceProof(c,f.source_spans);
 const stage_availability=Object.fromEntries(['source','structure','nlp_signals','span_lattice','semantic_nodes','relations','relation_bundles','unresolved','eligibility_decisions','coverage','boundary_ir','canonical_7plus1','proof_dag'].map(k=>[k,['source','structure','nlp_signals'].includes(k)?'AVAILABLE':f.unresolved.length||f.coverage.some(c=>c.disposition==='COVERAGE_FAILURE')?'PARTIAL':'AVAILABLE']));
 if(['I','O','A','P','R','V','C','B'].some(k=>['PARSER_COVERAGE_FAILURE','UNRESOLVED'].includes(c.canonical_7plus1[k].status)))stage_availability.canonical_7plus1='PARTIAL';
 const gates=contractGates(c,{spans:f.source_spans,availability:stage_availability}),signature=relationTypeAudit(c);return {parser_revision:'v0.3-7p-short-direct-016',contract_version:'0.3-p2.2-scope-consistency-repair',parser_status:gates.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:gates,relation_type_audit:signature,native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS'],legacy_reverse_projection_edges:0,direct_raw_nlp_to_slot_edges:0,LLM:'NOT_USED'},first_divergence:f.unresolved.length?{stage:'RELATION_DECODE',reason:f.unresolved[0].reason,unresolved_id:f.unresolved[0].unresolved_id}:null};
}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),r=compileNative(doc,signals,options);r.compiler_v03.nlp_signals.semantic_model_signals={status:'NOT_USED',reason:'016 deterministic semantic path; optional post-parse diagnostics disabled'};r.compiler_v03.performance.total_ms=performance.now()-start;return r;}
