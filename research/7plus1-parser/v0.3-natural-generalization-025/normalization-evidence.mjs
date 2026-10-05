import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {nliProposition} from './nli-propositions.mjs';

// Optional pack normalization is distinct from the exact source predicate.
// No pack label assigns an argument role or a Canonical slot.
export function normalizationCandidates(f,concepts,observations){
 const rows=[],nm=i=>f.semantic_nodes.find(n=>n.node_id===i);
 for(const obs of observations){const event=nm(obs.node_id);if(!event)continue;
  const arguments_=f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===event.node_id&&['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS'].includes(r.relation_type)),nodes=arguments_.map(r=>nm(r.tail_node_id)),context=[event.surface,...nodes.map(n=>n.surface)].join(' ').toLowerCase();
  const retrieved=uniq([...(obs.bge??[]),...(obs.e5??[])].map(c=>c.candidate_id));
  const options=concepts.filter(c=>retrieved.includes(c.candidate_id)||c.aliases.some(a=>a.toLowerCase()===event.surface.toLowerCase()));
  const literalTypes=nodes.flatMap(n=>[n.metadata.entity_type,n.metadata.semantic_type,...n.metadata.entity_types??[],...n.metadata.literal_tag==='FILEPATH'?['file','document']:[]]).filter(Boolean);
  for(const concept of options){
   const alias=concept.aliases.find(a=>a.toLowerCase()===event.surface.toLowerCase()||a.length>event.surface.length&&context.includes(a.toLowerCase())),types=concept.entry.entityTypes??[],typeCompatible=!types.length||types.some(t=>literalTypes.includes(t)),primary=(obs.bge??[]).some(c=>c.candidate_id===concept.candidate_id),secondary=(obs.e5??[]).some(c=>c.candidate_id===concept.candidate_id),relation=arguments_[0],frame=relation?nliProposition(f,relation):null;
   const lexical=Boolean(alias),candidate_id=id(f.source.sha256,'normalization',event.node_id,concept.candidate_id),source_span_ids=uniq([...event.source_span_ids,...nodes.flatMap(n=>n.source_span_ids)]);
   // The alias substitutes only the action token of an already constructed
   // proposition; antecedent, modality, object and recipient remain intact.
   const consequent=frame?.status==='SUPPORTED_HYPOTHESIS_STRUCTURE'&&alias?frame.consequent.replace(event.surface,alias):null,hypothesis=consequent?(frame.antecedent?'在源条件“'+frame.antecedent+'”限定下，'+consequent:consequent):null;
   rows.push({candidate_id,node_id:event.node_id,endpoint_node_ids:nodes.map(n=>n.node_id),concept_id:concept.candidate_id,concept_operation:concept.entry.operation??concept.entry.id,concept_ref:concept.entry,concept_aliases:concept.aliases,source_predicate:event.surface,lexical_alias:alias??null,lexical_support:lexical,type_compatible:typeCompatible,endpoint_types:literalTypes,retrieval_primary:primary,retrieval_crosscheck:secondary,source_span_ids,premise:frame?.premise??null,hypothesis,antecedent:frame?.antecedent??null,consequent,condition_expr_id:frame?.condition_expr_id??null,modality:frame?.modality??null,candidate_state:lexical&&typeCompatible?'SUPPORTED':'INSUFFICIENT',reason:!lexical?'NO_SOURCE_LEXICAL_GATE':!typeCompatible?'INCOMPATIBLE_TYPED_ARGUMENT':'SOURCE_ALIAS_AND_TYPED_ARGUMENT'});
  }
 }
 return rows;
}

export function certifyNormalizations(g,policy){
 const rows=g.candidate_normalizations??[],decisions=[],nodes=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),spans=new Map(g.source_spans.map(s=>[s.span_id,s]));
 const sourceValid=row=>{const node=nodes.get(row.node_id),endpoints=(row.endpoint_node_ids??[]).map(i=>nodes.get(i)),types=endpoints.filter(Boolean).flatMap(n=>[n.metadata.entity_type,n.metadata.semantic_type,...n.metadata.entity_types??[],...n.metadata.literal_tag==='FILEPATH'?['file','document']:[]]).filter(Boolean),required=row.concept_ref.entityTypes??[],typeValid=endpoints.every(Boolean)&&(!required.length||required.some(t=>types.includes(t))),local=[node?.surface,...endpoints.map(n=>n?.surface)].filter(Boolean).join(' ').toLowerCase();return node&&typeValid&&node.surface===row.source_predicate&&(row.concept_aliases??[]).includes(row.lexical_alias)&&local.includes(row.lexical_alias.toLowerCase())&&row.source_span_ids.length>0&&row.source_span_ids.every(i=>{const s=spans.get(i);return s&&[...g.source_text].slice(s.start,s.end).join('')===s.text;})&&row.modality===node.metadata.modality&&(!row.condition_expr_id||row.antecedent&&row.hypothesis?.includes(row.antecedent));};
 for(const row of rows){
  const domain=rows.filter(x=>x.node_id===row.node_id&&x.lexical_support&&x.type_compatible&&sourceValid(x)),operations=uniq(domain.map(x=>x.concept_operation)),uncertain=operations.length>1;
  const nli=row.nli?.model_label==='entailment'&&row.nli.confidence>=policy.nli_entailment_min,evidenceSupported=row.retrieval_primary&&row.retrieval_crosscheck&&nli;
  const viable=domain.filter(x=>x.retrieval_primary&&x.retrieval_crosscheck&&x.nli?.model_label==='entailment'&&x.nli.confidence>=policy.nli_entailment_min),remaining=uniq(viable.map(x=>x.concept_operation));
  const decision=!row.lexical_support||!row.type_compatible||!sourceValid(row)?'REJECTED':uncertain&&(!evidenceSupported||remaining.length!==1)?'TYPED_UNRESOLVED':'CERTIFIED';
  decisions.push({gamma_decision_id:id(g.graph_id,'Gamma-normalization',row.candidate_id),candidate_id:row.candidate_id,node_id:row.node_id,concept_id:row.concept_id,decision,reason:decision==='REJECTED'?row.reason:decision==='TYPED_UNRESOLVED'?'COMPETING_NORMALIZATION_EVIDENCE_REMAINS':'SOURCE_LEXICAL_TYPE_DOMAIN_WITH_MODEL_CROSSCHECK_WHERE_AMBIGUOUS',source_span_ids:row.source_span_ids,evidence_ids:row.evidence_ids,model_evidence_participated:uncertain,source_predicate_preserved:true,no_direct_boundary_certification:true});
 }
 return decisions;
}
