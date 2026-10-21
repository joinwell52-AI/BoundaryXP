import {nativeFrontend} from './frontend.mjs';
import {resolveExpressions} from './expressions.mjs';
import {prepareDiscourse} from '../v0.3-7p-composition-014/discourse.mjs';
import {participantEligibility,prepareQuantityTargets} from '../v0.3-7p-composition-014/semantic-eligibility.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {closeAdminRoot} from './migration/root-frames.mjs';
import {installLexicalContract} from './migration/lexical.mjs';
import {participantSyntax} from './participant-syntax.mjs';
import {predicateArguments} from './predicate-arguments.mjs';
import {artifactReferences} from './artifact-references.mjs';
import {prepareBasis,closeBasis,closeFlows,closeResources} from './migration/composition.mjs';
import {prepareOwnership,closeContentAndStructure,closeEmbeddedInputs} from './migration/ownership.mjs';
import {prepareConditionLayers,closeConditions} from './migration/conditions.mjs';
import {closeScopeIdentity} from './migration/scope.mjs';
import {closeRoleDeclarations} from './migration/roles.mjs';
import {closeTeamFlows} from './migration/team-flow.mjs';
import {closePredicateSemantics} from './migration/predicate-semantics.mjs';
import {closeContentComponents} from './migration/content-local.mjs';
import {temporalPredicates} from './temporal-predicates.mjs';
import {communicationArguments} from './communication-arguments.mjs';
import {propositionComplements} from './proposition-complements.mjs';
import {conditionalConsequents} from './conditional-consequents.mjs';
import {contentProvenance} from './content-provenance.mjs';
import {negativeRoles} from './negative-roles.mjs';
import {prepositionalExecution} from './prepositional-execution.mjs';
import {retryDomains} from './retry-domains.mjs';
import {passiveArguments} from './passive-arguments.mjs';
import {scopeMembershipIdentity} from './scope-membership-identity.mjs';
import {conformanceReferences} from './conformance-references.mjs';
import {organizationalContext} from './organizational-context.mjs';
import {transferSyntax} from './transfer-syntax.mjs';
import {ellipticalArguments} from './elliptical-arguments.mjs';
import {coreferenceContracts} from './coreference-contracts.mjs';
import {beforeSequence} from './before-sequence.mjs';
import {localModeQualifiers} from './local-mode-qualifiers.mjs';
import {conditionContracts} from './condition-contracts.mjs';
import {partOfCandidates} from './part-of-candidates.mjs';
import {qualifierProvenance} from './qualifier-provenance.mjs';
import {containerReferences} from './container-references.mjs';
import {qualifiedDomainCandidates} from './qualified-domain-candidates.mjs';
import {nominalCoordination} from './nominal-coordination.mjs';
import {quantifiedStateDomains} from './quantified-state-domains.mjs';
import {stateArguments} from './state-arguments.mjs';
import {actionDomainReferences} from './action-domain-references.mjs';
import {prepareOwnershipFrames,closeOwnershipFrames} from './ownership-frames.mjs';
import {nominalExecutionContracts} from './nominal-execution-contracts.mjs';
import {localQuantifierContracts} from './local-quantifier-contracts.mjs';
import {propositionStateContracts} from './proposition-state-contracts.mjs';
import {sourceMaterialAdjuncts,declarationAdjuncts,prohibitedOperationNominals,inputUseSiteContracts} from './adjunct-contracts.mjs';
import {artifactUseContracts} from './artifact-use-contracts.mjs';
import {localTransitionContracts} from './local-transition-contracts.mjs';
import {executionBudgetContracts} from './execution-budget-contracts.mjs';
import {proceduralPrerequisites} from './procedural-prerequisites.mjs';
import {scopePermissionContracts} from './scope-permission-contracts.mjs';
import {directiveDiscourse,directiveOwnership,quotedDirectiveRecipients} from './directive-contracts.mjs';
import {ambiguityDeclarations,referenceAmbiguityDomains} from './source-ambiguity-contracts.mjs';
import {implicitSubjectTemporalContracts} from './implicit-subject-temporal-contracts.mjs';
import {approvalDomainContracts} from './approval-domain-contracts.mjs';
import {roleObjectTypeContracts} from './role-object-type-contracts.mjs';

export function prepareCandidates(doc,signals){
 const f=nativeFrontend(doc,signals);f.semantic_decoding={predicate_lattice_ir:f.predicate_lattice,document_structure_recovery_ir:f.document_structure_recovery_ir};
 prepareDiscourse(f);directiveDiscourse(f);predicateArguments(f);participantEligibility(f);prepareQuantityTargets(f);f.tools.setStage('CANDIDATE_EXPRESSION');resolveExpressions(f);f.tools.setStage('CANDIDATE_GENERATION');prepareOwnershipFrames(f);
 installLexicalContract(f);prepareOwnership(f);prepareBasis(f);prepareConditionLayers(f);closeAdminRoot(f);prepositionalExecution(f);conditionalConsequents(f);closeBasis(f);conformanceReferences(f);closeFlows(f);closeTeamFlows(f);temporalPredicates(f);propositionComplements(f);closePredicateSemantics(f);closeResources(f);retryDomains(f);communicationArguments(f);passiveArguments(f);participantSyntax(f);artifactReferences(f);
 // Explicit same-sentence coordination must be proposed even when each event
 // independently carries a modal license. This is candidate recall, not certification.
 for(const a of f.analyses){if(!/^(?:并|且|and\b)/iu.test(a.cl.span.quote))continue;const prior=f.analyses.filter(p=>p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start).at(-1);if(prior?.events.length===1&&a.events.length===1)f.tools.relation(a.cl,'CONJUNCTION',prior.events[0],a.events[0],[prior.sid,a.sid]);}
 ambiguityDeclarations(f);
 implicitSubjectTemporalContracts(f);
 nominalExecutionContracts(f);
 executionBudgetContracts(f);
 artifactUseContracts(f);
 sourceMaterialAdjuncts(f);
 declarationAdjuncts(f);
 propositionStateContracts(f);
 f.tools.attachContext();
 organizationalContext(f);
 transferSyntax(f);artifactReferences(f);
 ellipticalArguments(f);
 beforeSequence(f);
 localModeQualifiers(f);
 // Ownership annotations are evidence, never authority or automatic WP decomposition.
 const outputIds=uniq(f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='SUPPORTED').map(r=>r.tail_node_id));
 f.semantic_decoding.discourse.output_content_requirements.push(...f.analyses.filter(a=>a.discourse.kind==='OUTPUT_CONTENT').map(a=>({requirement_id:id(f.source.sha256,'output-content',a.cl.id),clause_id:a.cl.id,scope:'OUTPUT_CONTENT',source_span_ids:[a.sid],semantic_node_ids:f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id).map(n=>n.node_id),owner_output_ids:[],ownership_evidence_relation_ids:[],owning_output_candidates:outputIds,ownership_status:'UNRESOLVED_OUTPUT_SET'})));
 closeContentAndStructure(f);closeContentComponents(f);closeEmbeddedInputs(f);
 f.semantic_decoding.qualified_domain_ir??={domains:[],candidate_provider:'NOT_MIGRATED_YET'};
 closeConditions(f);closeScopeIdentity(f);closeRoleDeclarations(f);negativeRoles(f);
 proceduralPrerequisites(f);
 scopePermissionContracts(f);
 inputUseSiteContracts(f);
 conditionContracts(f);containerReferences(f);qualifiedDomainCandidates(f);partOfCandidates(f);
 qualifierProvenance(f);
 nominalCoordination(f);
 quantifiedStateDomains(f);
 stateArguments(f);
 localQuantifierContracts(f);
 actionDomainReferences(f);
 localTransitionContracts(f);
 referenceAmbiguityDomains(f);
 quotedDirectiveRecipients(f);
 approvalDomainContracts(f);
 coreferenceContracts(f);
 closeOwnershipFrames(f);
 prohibitedOperationNominals(f);
 roleObjectTypeContracts(f);
 directiveOwnership(f);
 contentProvenance(f);
 scopeMembershipIdentity(f);
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
 g.candidate_normalizations=(modelSignals.normalization_candidates??[]).map(c=>({...structuredClone(c),evidence_ids:[evidence('NORMALIZATION',{...structuredClone(c),source_span_ids:c.source_span_ids})]}));
 for(const r of g.candidate_relations){
  const endpointClauses=uniq([nm.get(r.head_node_id)?.metadata.clause_id,nm.get(r.tail_node_id)?.metadata.clause_id]);
  const endpointWitnesses=endpointClauses.flatMap(i=>f.structure.clauses.find(c=>c.clause_id===i)?.source_span_ids??[]);
  r.evidence_span_ids=uniq([...r.evidence_span_ids,...endpointWitnesses]);
  r.endpoint_clause_provenance=endpointClauses.map(i=>({clause_id:i,source_span_ids:f.structure.clauses.find(c=>c.clause_id===i)?.source_span_ids??[],rule:'EXPLICIT_ENDPOINT_OWNING_CLAUSE'}));
  r.candidate_relation_id=id(g.graph_id,'candidate',r.relation_id);r.candidate_state=r.state==='REJECTED'?'REJECTED':r.state==='INSUFFICIENT'?'INSUFFICIENT':r.state==='COMPETING'?'COMPETING':'SUPPORTED';
  const a=f.analyses.find(a=>a.cl.id===r.clause_id),ns=[nm.get(r.head_node_id),nm.get(r.tail_node_id)],tokenIds=uniq(ns.flatMap(n=>{
   if(!n||n.metadata.sense==='TASK')return [];
   const primary=sm.get(n.source_span_ids[0]);
   return [n.metadata.token_id,...n.metadata.syntax_token_ids??[],...(a?.cl.tokens??[]).filter(t=>primary&&t.start<primary.end&&t.end>primary.start).map(t=>t.id)];
  }));
  r.discourse_domain=a?.discourse??null;r.scope_refs=uniq([f.expression_plans.get(r.head_node_id)?.scope_expr_id,f.relation_scope_plans.get(r.relation_id)]);r.condition_refs=uniq([f.expression_plans.get(r.head_node_id)?.condition_expr_id]);r.source_span_ids=[...r.evidence_span_ids];
  const syntaxClauses=uniq([r.clause_id,...endpointClauses]).map(i=>f.analyses.find(a=>a.cl.id===i)).filter(Boolean);
  const endpointTokens=syntaxClauses.flatMap(a=>a.cl.tokens.filter(t=>ns.some(n=>{const primary=n&&sm.get(n.source_span_ids[0]);return primary&&t.start<primary.end&&t.end>primary.start;})));
  r.syntax_evidence=syntaxClauses.map(a=>evidence('SYNTAX',{clause_id:a.cl.id,model:a.cl.model??null,token_ids:uniq([...tokenIds,...endpointTokens.map(t=>t.id)]),tokens:a.cl.tokens.filter(t=>tokenIds.includes(t.id)||endpointTokens.some(x=>x.id===t.id)),rule_refs:r.rule_refs,source_span_ids:uniq([a.sid,...r.source_span_ids])}));
  r.srl_evidence=a?.cl.srl?.length?[evidence('SRL',{clause_id:r.clause_id,hints:a.cl.srl,source_span_ids:[a.sid]})]:[];
  r.typed_evidence=ns.filter(n=>n?.metadata.literal_id).map(n=>evidence('TYPED',{node_id:n.node_id,literal_id:n.metadata.literal_id,literal_tag:n.metadata.literal_tag??null,source_span_ids:n.source_span_ids}));
  r.discourse_evidence=a?[evidence('DISCOURSE',{clause_id:r.clause_id,domain:a.discourse,ownership:ns.map(n=>n?.metadata.semantic_ownership),source_span_ids:[a.sid]})]:[];
  r.embedding_evidence=[];for(const n of ns){const obs=modelSignals.observations?.find(x=>x.node_id===n?.node_id);if(obs)r.embedding_evidence.push(evidence('RETRIEVAL',{...obs,source_span_ids:n.source_span_ids}));}
  const validation=modelSignals.relation_validation?.find(x=>x.relation_id===r.relation_id);r.nli_evidence=validation?[evidence('NLI',{...validation,source_span_ids:r.source_span_ids})]:[];
  r.evidence_ids=uniq([...r.syntax_evidence,...r.srl_evidence,...r.typed_evidence,...r.discourse_evidence,...r.embedding_evidence,...r.nli_evidence]);
 }
 for(const [kind,rows] of Object.entries(f.expressions))for(const e of rows)g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'expression',e.expr_id),expression_id:e.expr_id,expression_type:kind,expression:structuredClone(e),source_span_ids:e.source_span_ids,relation_ids:e.relation_ids,candidate_state:f.uncertain_expression_ids?.has(e.expr_id)?'COMPETING':'SUPPORTED'});
 for(const n of f.semantic_nodes.filter(n=>n.metadata.resolution||n.node_type==='UNKNOWN_REFERENT'))g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'coreference',n.node_id),expression_id:id(n.node_id,'coreference-set'),expression_type:'coreference_candidates',expression:{referent_node_id:n.node_id,...n.metadata.resolution},source_span_ids:n.source_span_ids,relation_ids:f.relations.filter(r=>r.head_node_id===n.node_id&&r.relation_type==='COREFERENCE').map(r=>r.relation_id),candidate_state:n.metadata.resolution?.selected_node_ids?.length?'SUPPORTED':'COMPETING'});
 g.semantic_node_ids=f.semantic_nodes.map(n=>n.node_id);g.candidate_relation_ids=g.candidate_relations.map(r=>r.candidate_relation_id);g.candidate_expression_ids=g.candidate_expressions.map(e=>e.candidate_expression_id);g.evidence_ids=g.evidence.map(e=>e.evidence_id);g.unresolved_refs=f.unresolved.map(u=>u.unresolved_id);g.source_span_ids=uniq(g.semantic_nodes.flatMap(n=>n.source_span_ids));g.source_sha256=f.source.sha256;
 g.source_text=f.source.raw_text;g.source_spans=structuredClone([...sm.values()]);g.structure=structuredClone(f.structure);g.structure_status=explicitTaskStructure(f);g.phase='FROZEN_BEFORE_GAMMA';
 // Γ consumes this actual registry, not a reconstruction from final semantics.
 deepFreeze(g);return g;
}
export function deepFreeze(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))deepFreeze(v);Object.freeze(x);}return x;}
export function explicitTaskStructure(f){
 const declarations=f.doc.structure.nodes.filter(n=>n.type==='HEADING'&&/^\s*#{1,6}\s+WP[- ]\d+\b/iu.test(n.source_span.quote)).map(n=>({structure_id:n.id,source_span:n.source_span}));
 // No block clustering: only explicit source WP markers are read.
 return {status:declarations.length?'EXPLICIT_MULTI_WP':'SINGLE_ROOT',declared_wp_scopes:declarations,automatic_wp_count:0,authority_source:'ADMIN_SOURCE_ONLY'};
}

