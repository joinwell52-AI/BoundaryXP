import {randomUUID} from 'node:crypto';import {performance} from 'node:perf_hooks';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {prepareNative as prepareR2} from '../v0.3-7p-short-direct-016-r2/engine.mjs';
import {prepareBasis,closeBasis,closeResources,closeFlows,certifyResourceEligibility,attachReferenceProof} from './composition.mjs';
import {produceEligibility,produceBoundaryIR,produceCoverage} from '../v0.3-7p-composition-014/eligibility.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {localizeTypedUnresolved,normalizeParticipantIdentity} from '../v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {produceProof} from '../v0.3-7p-composition-014/proof.mjs';
import {closeAdminRoot,finalizeAdminRoles} from './root-frames.mjs';
import {closeRootStateBindings} from '../v0.3-admin-short-018/state-bindings.mjs';
import {installPartOf,relationTypeAudit} from '../v0.3-admin-short-018-r1/relations.mjs';
import {closeQualifiedDomains,closeDomainEvidence,attachDomainProof} from '../v0.3-admin-short-018-r1/domains.mjs';
import {contractGates} from '../v0.3-admin-short-018-r1/contract-gates.mjs';
import {prepareOwnership,closeContentAndStructure,closeEmbeddedInputs} from './ownership.mjs';
import {closeConditions,prepareConditionLayers} from './conditions.mjs';
import {closeScopeIdentity} from './scope.mjs';
import {closeRoleDeclarations} from './roles.mjs';
import {closeTeamFlows} from './team-flow.mjs';
import {closePredicateSemantics} from './predicate-semantics.mjs';
import {closeArgumentEvidence,enrichFactEvidence} from './argument-evidence.mjs';
import {closeContentComponents} from './content-local.mjs';
import {closeLocalDomains} from './domain-local.mjs';
import {markRetainedContracts} from './retained-contracts.mjs';
import {closeContextDomains} from './context-domains.mjs';
export function prepareNative(doc,signals){const f=markRetainedContracts(installPartOf(prepareR2(doc,signals)));prepareOwnership(f);prepareBasis(f);prepareConditionLayers(f);closeAdminRoot(f);closeBasis(f);closeFlows(f);closeTeamFlows(f);closePredicateSemantics(f);closeResources(f);closeRootStateBindings(f);normalizeParticipantIdentity(f);closeQualifiedDomains(f);closeContentAndStructure(f);closeContentComponents(f);closeEmbeddedInputs(f);closeConditions(f);closeScopeIdentity(f);closeRoleDeclarations(f);closeArgumentEvidence(f);closeLocalDomains(f);closeContextDomains(f);synchronizeBundles(f);return f;}
function synchronizeBundles(f){const live=new Set(f.unresolved.map(u=>u.unresolved_id));for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(x=>live.has(x));b.relation_ids=f.relations.filter(r=>b.clause_ids.includes(r.clause_id)).map(r=>r.relation_id);b.bundle_state=b.unresolved_refs.length?'PARTIALLY_RESOLVED':'RESOLVED';}}
export function compileNative(doc,signals,options={}){
 const f=prepareNative(doc,signals);produceEligibility(f);certifyResourceEligibility(f);closeDomainEvidence(f);enrichFactEvidence(f);finalizeAdminRoles(f);produceBoundaryIR(f);produceCoverage(f);localizeCoverage(f);localizeTypedUnresolved(f);
 const c={metadata:{run_id:options.run_id??randomUUID(),compiler_version:'0.3-admin-short-019',created_at:options.created_at??new Date().toISOString(),source_sha256:f.source.sha256},source:f.source,structure:f.structure,nlp_signals:{...f.nlp_signals,semantic_decoding:f.semantic_decoding},span_lattice:f.span_lattice,semantic_nodes:f.semantic_nodes,relations:f.relations,relation_bundles:f.relation_bundles,unresolved:f.unresolved,eligibility_decisions:f.eligibility_decisions,coverage:f.coverage,boundary_ir:f.boundary_ir,canonical_7plus1:projectCanonical(f.boundary_ir,f.semantic_nodes,f.coverage,f.unresolved),proof_dag:{},diagnostics:f.diagnostics,performance:f.performance};c.proof_dag=produceProof(c,f.source_spans);attachDomainProof(c);attachReferenceProof(c);
 const stage_availability=Object.fromEntries(['source','structure','nlp_signals','span_lattice','semantic_nodes','relations','relation_bundles','unresolved','eligibility_decisions','coverage','boundary_ir','canonical_7plus1','proof_dag'].map(k=>[k,['source','structure','nlp_signals'].includes(k)?'AVAILABLE':f.unresolved.length||f.coverage.some(c=>c.disposition==='COVERAGE_FAILURE')?'PARTIAL':'AVAILABLE']));
const gates=contractGates(c,{spans:f.source_spans,availability:stage_availability});return {parser_revision:'v0.3-admin-short-019',contract_version:'0.3-normative-part-of-r1',parser_status:gates.status==='PASS'?(f.unresolved.length?'PARSED_WITH_UNRESOLVED':'PARSED'):'CONTRACT_FAILURE',compiler_v03:c,source_spans:f.source_spans,stage_availability,contract_gate_results:gates,relation_type_audit:relationTypeAudit(c),native_provenance:{input_stages:['SOURCE','NLP_SIGNALS','TYPED_RECOGNIZERS'],legacy_reverse_projection_edges:0,direct_raw_nlp_to_slot_edges:0,LLM:'NOT_USED',WP_decomposition:false},first_divergence:f.unresolved.length?{stage:'RELATION_DECODE',reason:f.unresolved[0].reason,unresolved_id:f.unresolved[0].unresolved_id}:null};
}
export async function parse7Plus1(input,options={}){const start=performance.now(),doc=sourceDocument(input,options),signals=await analyze(doc),r=compileNative(doc,signals,options);r.parser_revision='v0.3-admin-short-019';r.compiler_v03.nlp_signals.semantic_model_signals={status:'NOT_USED',reason:'019 deterministic semantic compiler candidate; no hybrid lane authorized'};r.compiler_v03.performance.total_ms=performance.now()-start;return r;}

