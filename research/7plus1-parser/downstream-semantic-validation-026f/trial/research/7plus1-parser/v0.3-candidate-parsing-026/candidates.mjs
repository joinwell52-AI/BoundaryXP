import {nativeFrontend} from './frontend.mjs';
import {prepareDiscourse} from '../v0.3-7p-composition-014/discourse.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {installCandidateStore} from './candidate-store.mjs';
import {genericRelationCandidates} from './generic-relations.mjs';
import {completeSpanLattice} from './span-lattice.mjs';
import {observeCandidateRuntime} from './runtime-observer.mjs';
import {referenceCandidates} from './reference-candidates.mjs';
import {conditionCandidates} from './condition-candidates.mjs';
import {structuralStateCandidates} from './structural-state-candidates.mjs';
import {quantityCandidates} from './quantity-candidates.mjs';
import {basisCandidates} from './basis-candidates.mjs';
import {scopeCandidates} from './scope-candidates.mjs';
import {localArgumentCandidates} from './local-argument-candidates.mjs';
import {nominalModalCandidates} from './nominal-modal-candidates.mjs';
import {temporalCandidates} from './temporal-candidates.mjs';
import {qualifierCandidates} from './qualifier-candidates.mjs';
import {coordinationCandidates} from './coordination-candidates.mjs';
import {outputContentCandidates} from './output-content-candidates.mjs';
import {modalCandidates} from './modal-candidates.mjs';
import {lexicalSpanCandidates} from './lexical-span-candidates.mjs';
import {nominalComponentCandidates} from './nominal-component-candidates.mjs';
import {conformanceCandidates} from './conformance-candidates.mjs';
import {syntaxOperatorCandidates} from './syntax-operator-candidates.mjs';
import {stateArgumentCandidates} from './state-argument-candidates.mjs';
import {contextCandidates} from './context-candidates.mjs';

export function prepareCandidates(doc,signals){
 const f=nativeFrontend(doc,signals);f.semantic_decoding={predicate_lattice_ir:f.predicate_lattice,document_structure_recovery_ir:f.document_structure_recovery_ir,literal_structure_recovery:f.literal_structure_recovery,original_nlp_literals:signals.literals};
 observeCandidateRuntime(f);prepareDiscourse(f);installCandidateStore(f);
 f.expressions={set_expr_nodes:[],condition_expr_nodes:[],quantity_expr_nodes:[]};f.expression_plans=new Map();f.relation_scope_plans=new Map();f.candidate_plan_sets=[];
 f.semantic_decoding.resource_target_ir={certificates:[],candidate_only:true};f.semantic_decoding.part_of_contract={certificates:[],rejected:[]};
 f.semantic_decoding.discourse.output_content_requirements=[];
 genericRelationCandidates(f);nominalModalCandidates(f);lexicalSpanCandidates(f);modalCandidates(f);coordinationCandidates(f);structuralStateCandidates(f);syntaxOperatorCandidates(f);outputContentCandidates(f);localArgumentCandidates(f);contextCandidates(f);temporalCandidates(f);referenceCandidates(f);basisCandidates(f);conformanceCandidates(f);scopeCandidates(f);nominalComponentCandidates(f);qualifierCandidates(f);proposeExpressions(f);conditionCandidates(f);stateArgumentCandidates(f);quantityCandidates(f);f.tools.attachContext();buildSemanticOwnership(f,'CANDIDATE_OWNERSHIP_EVIDENCE');completeSpanLattice(f);competitionGroups(f);recallAccountability(f);return f;
}
function proposeExpressions(f){
 f.proposals.provider='GENERIC_EXPRESSION_PROVIDER';
 const expr=(kind,body)=>{body={...body,source_span_ids:uniq(body.source_span_ids),relation_ids:uniq(body.relation_ids)};const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions[kind].some(x=>x.expr_id===e.expr_id))f.expressions[kind].push(e);f.proposals.record('EXPRESSION',e.expr_id,{kind,expression:e},f.proposals.provider);return e.expr_id;};
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),edge=(a,type,h,t,witness={})=>{const r=f.tools.relation(a.cl,type,h,t,[a.sid,...h.source_span_ids,...t.source_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_EXPRESSION_'+type,...witness,source_span_ids:r.evidence_span_ids});return r;};
 for(const a of f.analyses){
  const events=f.semantic_nodes.filter(n=>n.node_type==='EVENT'&&n.metadata.clause_id===a.cl.id);
  for(const e of events){
   if(e.metadata.sense==='complete')e.metadata.completion_candidate=true;if(e.metadata.sense==='stop')e.metadata.stop_candidate=true;
   for(const r of [...f.relations].filter(r=>r.head_node_id===e.node_id&&['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS'].includes(r.relation_type))){
    const n=nm(r.tail_node_id),scope=expr('set_expr_nodes',{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:uniq([a.sid,...n.source_span_ids]),relation_ids:[r.relation_id]});
    f.candidate_plan_sets.push({plan_id:id(e.node_id,scope),predicate_node_id:e.node_id,scope_expr_id:scope,candidate_relation_ids:[r.relation_id],source_span_ids:[a.sid,...n.source_span_ids],candidate_status:'PROPOSED'});
    if(['read','review','probe','query','analyze','compare'].includes(e.metadata.sense)){
     const input=edge(a,'SCOPE_MEMBER',f.tools.task,n,{rule:'INPUT_USE_SITE_CANDIDATE',dependency_relation_ids:[r.relation_id]});input.dependency_relation_ids=uniq([...(input.dependency_relation_ids??[]),r.relation_id]);const item=expr('set_expr_nodes',{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[input.relation_id]});f.relation_scope_plans.set(input.relation_id,item);
    }
    if(e.metadata.modality==='FORBIDDEN'&&r.relation_type!=='FORBIDS')edge(a,'FORBIDS',e,n,{rule:'EXPLICIT_NEGATION_ROLE_CANDIDATE',dependency_relation_ids:[r.relation_id]});
    if(e.metadata.restrict&&r.relation_type!=='RESTRICTS')edge(a,'RESTRICTS',e,n,{rule:'EXPLICIT_RESTRICTION_ROLE_CANDIDATE'});
   }
   if(e.metadata.stop_candidate)edge(a,'STOP_OF',e,f.tools.task,{rule:'SOURCE_STOP_PREDICATE'});
  }
  for(const r of f.relations.filter(r=>r.clause_id===a.cl.id&&r.relation_type==='SCOPE_MEMBER'))if(!f.relation_scope_plans.has(r.relation_id)){const n=nm(r.tail_node_id);f.relation_scope_plans.set(r.relation_id,expr('set_expr_nodes',{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]}));}
 }
 // Explicit local antecedent domain is retained in full. Unique binding is a
 // Γ decision, so this producer never populates selected_node_ids.
 for(const ref of f.semantic_nodes.filter(n=>n.node_type==='UNKNOWN_REFERENT')){const a=f.analyses.find(a=>a.cl.id===ref.metadata.clause_id),s=f.source_spans.find(s=>s.span_id===ref.source_span_ids[0]);if(!a||!s||ref.metadata.coreference_domain)continue;
  const domain=f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&f.source_spans.find(s=>s.span_id===n.source_span_ids[0])?.end<s.start&&f.analyses.find(b=>b.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id&&f.relations.some(r=>r.tail_node_id===n.node_id&&['SCOPE_MEMBER','RESULT','AGENT','RECIPIENT'].includes(r.relation_type)));
  ref.metadata.coreference_domain={candidate_node_ids:domain.map(n=>n.node_id),structural_path:[a.parent_structure_id,a.cl.id],source_span_ids:uniq([a.sid,...domain.flatMap(n=>n.source_span_ids)])};
  for(const target of domain)edge(a,'COREFERENCE',ref,target,{rule:'STRUCTURALLY_BOUNDED_COREFERENCE_DOMAIN',structural_path:[a.parent_structure_id,target.metadata.clause_id,a.cl.id]});
 }
}
export function competitionGroups(f){
 const buckets=new Map(),add=(type,key,member,spans)=>{const gid=id(f.source.sha256,'competition',type,key);if(!buckets.has(gid))buckets.set(gid,{competition_group_id:gid,kind:type,key,candidate_ids:[],source_span_ids:[]});const b=buckets.get(gid);b.candidate_ids.push(member);b.source_span_ids.push(...spans);};
 const sm=new Map(f.source_spans.map(s=>[s.span_id,s]));
 for(const n of f.semantic_nodes){const s=sm.get(n.source_span_ids[0]);add('NODE_TYPE_OR_SENSE',[n.metadata.clause_id,s.start,s.end],n.node_id,n.source_span_ids);}
 for(const r of f.relations){const t=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),s=sm.get(t.source_span_ids[0]);if(['AGENT','PATIENT','THEME','RESULT','RECIPIENT','FORBIDS','RESTRICTS'].includes(r.relation_type))add('ARGUMENT_ROLE',[r.head_node_id,s.start,s.end],r.candidate_relation_id,r.evidence_span_ids);if(r.relation_type==='COREFERENCE')add('COREFERENCE',r.head_node_id,r.candidate_relation_id,r.evidence_span_ids);if(r.relation_type==='LIMIT')add('QUANTITY_TARGET',[s.start,s.end,r.clause_id],r.candidate_relation_id,r.evidence_span_ids);if(r.relation_type==='CONDITION_OF')add('CONDITION_OWNER',r.head_node_id,r.candidate_relation_id,r.evidence_span_ids);}
 // Overlapping nominal extents are alternatives to the same local argument,
 // while disjoint coordinated members remain separate arguments.
 const argumentsByOwner=new Map();for(const r of f.relations.filter(r=>['AGENT','PATIENT','THEME','RESULT','RECIPIENT','FORBIDS','RESTRICTS','BASIS','CONFORMS_TO'].includes(r.relation_type))){const key=JSON.stringify([r.head_node_id,r.relation_type]);if(!argumentsByOwner.has(key))argumentsByOwner.set(key,[]);argumentsByOwner.get(key).push(r);}
 for(const [key,relations] of argumentsByOwner){const components=[];for(const r of relations){const s=sm.get(f.semantic_nodes.find(n=>n.node_id===r.tail_node_id).source_span_ids[0]),linked=components.filter(group=>group.some(other=>{const t=sm.get(f.semantic_nodes.find(n=>n.node_id===other.tail_node_id).source_span_ids[0]);return s.start<t.end&&t.start<s.end;}));if(!linked.length)components.push([r]);else{linked[0].push(r);for(const group of linked.slice(1)){linked[0].push(...group);components.splice(components.indexOf(group),1);}}}for(const group of components)if(group.length>1)for(const r of group)add('ARGUMENT_EXTENT',[key,group.map(r=>r.relation_id).sort()],r.candidate_relation_id,r.evidence_span_ids);}
 f.candidate_semantic_graph.competition_groups=[...buckets.values()].filter(b=>uniq(b.candidate_ids).length>1).map(b=>({...b,candidate_ids:uniq(b.candidate_ids),source_span_ids:uniq(b.source_span_ids)}));
 for(const group of f.candidate_semantic_graph.competition_groups)for(const cid of group.candidate_ids){const n=f.semantic_nodes.find(n=>n.node_id===cid),r=f.relations.find(r=>r.candidate_relation_id===cid);if(n){n.candidate_node_state='COMPETING';n.state='COMPETING';}if(r)r.candidate_status='COMPETING';}
 return f;
}
export function recallAccountability(f){
 const rows=f.analyses.map(a=>{
  const ns=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id),rs=f.relations.filter(r=>r.clause_id===a.cl.id);
  const roles=new Set(['AGENT','RECIPIENT','PATIENT','THEME','RESULT','FORBIDS','RESTRICTS']);
  // ARG0 is an argument too. A support verb's clausal argument is represented
  // by its governed predicate evidence, not by an invented patient entity.
  const governed=ns.filter(n=>n.node_type==='STATE'&&n.metadata.governed_predicate_token_ids?.length);
  const personMentions=a.cl.entities.filter(e=>['PERSON','PER'].includes(e.label));
  const personEvidence=personMentions.every(e=>ns.some(n=>n.node_type==='ENTITY'&&n.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s.start<=e.span.start&&s.end>=e.span.end;})));
  const expected={predicate:a.cl.tokens.some(t=>/^(VV|VERB)$/u.test(t.pos??'')),argument:a.cl.srl?.some(fr=>fr.some(r=>/^ARG[012]$/u.test(r[1])))??false,participant:personMentions.length>0,artifact:f.nlp_signals.literals.some(l=>['FILE','PATH'].includes(l.type)&&l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end),reference:f.nlp_signals.literals.some(l=>['REFERENCE','VERSION','COMMIT'].includes(l.type)&&l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end),condition:/^(若|如果|当(?!前)|未经|if\b|when\b|unless\b)/iu.test(a.cl.span.quote),quantity:/\d+\s*(分钟|小时|次|%|GB|MB|minutes?|times?)/iu.test(a.cl.span.quote),coreference:ns.some(n=>n.node_type==='UNKNOWN_REFERENT')};
  const actual={predicate:ns.some(n=>n.node_type==='EVENT'),argument:rs.some(r=>roles.has(r.relation_type))||governed.length>0,participant:personEvidence,artifact:ns.some(n=>n.metadata.literal_tag==='FILEPATH'),reference:ns.some(n=>n.node_type==='REFERENCE'),condition:ns.some(n=>n.node_type==='STATE'&&n.metadata.syntactic_layer==='CONDITION_ANTECEDENT'),quantity:rs.some(r=>r.relation_type==='LIMIT'),coreference:rs.some(r=>r.relation_type==='COREFERENCE')};
  const gaps=Object.keys(expected).filter(k=>expected[k]&&!actual[k]);return {clause_id:a.cl.id,source_span_ids:[a.sid],expected,actual,argument_evidence_relation_ids:rs.filter(r=>roles.has(r.relation_type)).map(r=>r.relation_id),governed_argument_state_ids:governed.map(n=>n.node_id),candidate_node_ids:ns.map(n=>n.node_id),candidate_relation_ids:rs.map(r=>r.candidate_relation_id),gaps,status:gaps.length?'CANDIDATE_COVERAGE_FAILURE':'ACCOUNTED'};
 });
 f.tools.setStage('CANDIDATE_GENERATION');for(const row of rows.filter(r=>r.gaps.length)){const a=f.analyses.find(a=>a.cl.id===row.clause_id);row.unresolved_id=f.tools.unknown(a.cl,'UNRESOLVED_RELATION','Candidate recall gap before Gamma: '+row.gaps.join(', '),[]);}
 f.candidate_recall_accountability=rows;return rows;
}
export function freezeCandidateGraph(f,models={}){
 const g=f.candidate_semantic_graph,nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));g.evidence=[];g.candidate_expressions=[];
 // Declare the frozen adapter's per-result ITEM after full clause provenance
 // attachment. Downstream transport may reference this exact expression only.
 for(const r of f.relations.filter(r=>r.relation_type==='RESULT')){const n=nm.get(r.tail_node_id),body={kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]},e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);}
 const evidence=(channel,body)=>{const e={evidence_id:id(g.graph_id,channel,body),channel,...body};if(!g.evidence.some(x=>x.evidence_id===e.evidence_id))g.evidence.push(e);return e.evidence_id;};
 // An orphan predicate is still a hypothesis with syntax evidence. Relation
 // creation must never be a prerequisite for preserving the source analysis.
 for(const a of f.analyses){evidence('SYNTAX',{clause_id:a.cl.id,tokens:a.cl.tokens,source_span_ids:[a.sid],rule_refs:['FULL_SOURCE_CLAUSE_ANALYSIS'],generic_evidence:[]});if(a.cl.srl?.length)evidence('SRL',{clause_id:a.cl.id,hints:a.cl.srl,source_span_ids:[a.sid]});evidence('DISCOURSE',{clause_id:a.cl.id,domain:a.discourse,source_span_ids:[a.sid]});}
 for(const r of f.relations){const a=f.analyses.find(a=>a.cl.id===r.clause_id),ns=[nm.get(r.head_node_id),nm.get(r.tail_node_id)],clauses=uniq([r.clause_id,...ns.map(n=>n.metadata.clause_id)]).map(i=>f.analyses.find(a=>a.cl.id===i)).filter(Boolean);r.source_span_ids=uniq([...r.evidence_span_ids,...clauses.map(a=>a.sid)]);r.evidence_span_ids=r.source_span_ids;r.candidate_state=r.candidate_status??r.state;r.candidate_status=r.candidate_state;r.discourse_domain=a?.discourse;r.provider_ids??=['SOURCE_SYNTAX'];r.head_candidate_node_id=r.head_node_id;r.tail_candidate_node_id=r.tail_node_id;r.syntax_evidence=clauses.map(a=>evidence('SYNTAX',{clause_id:a.cl.id,tokens:a.cl.tokens,rule_refs:r.rule_refs,source_span_ids:[a.sid],generic_evidence:r.generic_evidence??[]}));r.srl_evidence=clauses.filter(a=>a.cl.srl?.length).map(a=>evidence('SRL',{clause_id:a.cl.id,hints:a.cl.srl,source_span_ids:[a.sid]}));r.typed_evidence=ns.filter(n=>n.metadata.literal_id).map(n=>evidence('TYPED',{node_id:n.node_id,literal_id:n.metadata.literal_id,literal_tag:n.metadata.literal_tag,source_span_ids:n.source_span_ids}));r.discourse_evidence=clauses.map(a=>evidence('DISCOURSE',{domain:a.discourse,source_span_ids:[a.sid]}));r.coreference_evidence=r.relation_type==='COREFERENCE'?[evidence('COREFERENCE',{domain:ns[0].metadata.coreference_domain,source_span_ids:r.source_span_ids})]:[];r.embedding_evidence=ns.flatMap(n=>{const obs=models.observations?.find(x=>x.node_id===n.node_id);return obs?[evidence('RETRIEVAL',{...obs,source_span_ids:n.source_span_ids})]:[];});r.nli_evidence=(models.relation_validation??[]).filter(x=>x.relation_id===r.relation_id).map(v=>evidence('NLI',{...v,source_span_ids:r.source_span_ids}));const owner=['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type)?r.tail_node_id:r.head_node_id,localPlans=f.candidate_plan_sets.filter(p=>p.predicate_node_id===owner);r.scope_refs=uniq(localPlans.filter(p=>p.candidate_relation_ids.includes(r.relation_id)).map(p=>p.scope_expr_id));r.condition_refs=uniq(localPlans.map(p=>p.condition_expr_id));r.syntax_evidence_ids=r.syntax_evidence;r.srl_evidence_ids=r.srl_evidence;r.typed_evidence_ids=r.typed_evidence;r.discourse_evidence_ids=r.discourse_evidence;r.coreference_evidence_ids=r.coreference_evidence;r.model_evidence_ids=uniq([...r.embedding_evidence,...r.nli_evidence]);r.evidence_ids=uniq([...r.syntax_evidence,...r.srl_evidence,...r.typed_evidence,...r.discourse_evidence,...r.coreference_evidence,...r.model_evidence_ids]);}
 for(const [kind,rows] of Object.entries(f.expressions))for(const e of rows)g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'expression',e.expr_id),expression_id:e.expr_id,expression_type:kind,expression:structuredClone(e),source_span_ids:e.source_span_ids,relation_ids:e.relation_ids,candidate_state:'PROPOSED'});
 for(const n of f.semantic_nodes.filter(n=>n.metadata.coreference_domain)){const domain=n.metadata.coreference_domain,expression={reference_node_id:n.node_id,candidate_node_ids:domain.candidate_node_ids,selected_node_ids:[],structural_path:domain.structural_path},expression_id=id(g.graph_id,'coreference-domain',expression);g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'expression',expression_id),expression_id,expression_type:'coreference_candidates',expression,source_span_ids:domain.source_span_ids,relation_ids:f.relations.filter(r=>r.relation_type==='COREFERENCE'&&r.head_node_id===n.node_id).map(r=>r.relation_id),candidate_state:'COMPETING'});}
 for(const domain of f.semantic_decoding.source_ambiguity_candidates??[]){const expression_id=id(g.graph_id,'source-ambiguity',domain);g.candidate_expressions.push({candidate_expression_id:id(g.graph_id,'expression',expression_id),expression_id,expression_type:'source_ambiguity_candidates',expression:structuredClone(domain),source_span_ids:domain.source_span_ids,relation_ids:[],candidate_state:'COMPETING'});}
 g.candidate_normalizations=(models.normalization_candidates??[]).map(c=>({...structuredClone(c),evidence_ids:[evidence('NORMALIZATION',{...structuredClone(c),source_span_ids:c.source_span_ids})]}));
 g.scope_expression_candidates=structuredClone(f.semantic_decoding.scope_expression_candidates??[]);g.nominal_component_candidates=structuredClone(f.semantic_decoding.nominal_component_candidates??[]);g.state_argument_candidates=structuredClone(f.semantic_decoding.state_argument_candidates??[]);
 g.semantic_node_ids=f.semantic_nodes.map(n=>n.node_id);g.candidate_relation_ids=f.relations.map(r=>r.candidate_relation_id);g.candidate_expression_ids=g.candidate_expressions.map(e=>e.candidate_expression_id);g.evidence_ids=g.evidence.map(e=>e.evidence_id);g.unresolved_refs=f.unresolved.map(u=>u.unresolved_id);g.unresolved_evidence=structuredClone(f.unresolved);g.source_span_ids=uniq(f.semantic_nodes.flatMap(n=>n.source_span_ids));g.source_text=f.source.raw_text;g.source_sha256=f.source.sha256;g.source_spans=structuredClone(f.source_spans);g.structure=structuredClone(f.structure);g.span_lattice=structuredClone(f.span_lattice);g.candidate_plan_sets=structuredClone(f.candidate_plan_sets);g.candidate_recall_accountability=structuredClone(f.candidate_recall_accountability);g.structural_state_alternatives=structuredClone(f.semantic_decoding.structural_state_alternatives);g.condition_candidate_domains=structuredClone(f.semantic_decoding.condition_candidate_domains);g.structure_status=explicitTaskStructure(f);g.runtime_observation=f.candidate_runtime_observer.finish();g.phase='FROZEN_BEFORE_GAMMA';deepFreeze(g);return g;
}
export function deepFreeze(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))deepFreeze(v);Object.freeze(x);}return x;}
export function explicitTaskStructure(f){const declarations=f.doc.structure.nodes.filter(n=>n.type==='HEADING'&&/^\s*#{1,6}\s+WP[- ]\d+\b/iu.test(n.source_span.quote)).map(n=>({structure_id:n.id,source_span:n.source_span}));return {status:declarations.length?'EXPLICIT_MULTI_WP':'SINGLE_ROOT',declared_wp_scopes:declarations,automatic_wp_count:0,authority_source:'ADMIN_SOURCE_ONLY'};}
