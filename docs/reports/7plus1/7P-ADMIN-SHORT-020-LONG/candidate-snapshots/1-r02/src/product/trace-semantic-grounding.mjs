import {createHash} from 'node:crypto';
export const sha=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
export const GROUNDING_POLICY=Object.freeze({version:'trace001-pass4-v1',top_k:3,max_tokens:512,batch_size:4,nli_entailment_min:0.90,
  acceptance:'exact pack lexical anchor + compatible syntactic slot + NLI support; literal types use deterministic parser',
  retrieval_is_truth:false,nli_is_boundary_resolution:false,L3:'NOT_SELECTED / NOT_AVAILABLE',LLM:'NOT_USED',authority_inference:false});
const within=(a,b)=>a&&b&&a.start>=b.start&&a.end<=b.end;
const intersects=(a,b)=>a&&b&&a.start<b.end&&b.start<a.end;
const clean=s=>s.trim().replace(/^`|`$/g,'');
export function literalValue(quote){
 const value=clean(quote);
 if(/^(?:ADR|TASK|I|A|R)-?\d+(?:\s*§[^\s]+)?$/u.test(value))return {type:'REFERENCE_IDENTIFIER',value,authority:'NOT_INFERRED'};
 if(/^(?:>=|<=|==|>|<|=)?\s*v?\d+\.\d+(?:\.(?:\d+|x|\*))?(?:[-+][\w.-]+)?$/u.test(value))return {type:'VERSION_EXPRESSION',value,operator:/^(>=|<=|==|>|<|=)/.exec(value)?.[0]??null};
 if(/^[0-9a-f]{7,40}$/u.test(value)&&/[a-f]/u.test(value)&&/\d/.test(value))return {type:'HASH_OR_HEX_IDENTIFIER',value,external_lookup:false};
 if(/^\d+(?:\.\d+)?$/u.test(value))return {type:'NUMBER_LITERAL',value};
 if(/^(?:==|!=|>=|<=|>|<|=|\+|→)$/u.test(value))return {type:'OPERATOR_SURFACE',value,final_relation:'NOT_INFERRED'};
 if(/^`[^`\r\n]+`$/u.test(quote.trim())){
   if(/^[\w.*-]+(?:\/[\w.*-]+)+\/?$/u.test(value)||/^[\w.*-]+\.(?:py|json|md|toml|ya?ml)$/u.test(value))return {type:'PATH_LITERAL',value,filesystem_access:false};
   return {type:'CODE_LITERAL',value,execution:false,interpretation:'EXACT_UNINTERPRETED_LITERAL'};
 }
 return null;
}
export function createGroundingInventory(text,p1,p2,p3,audit){
 const points=[...text],items=[],seen=new Set(),props=[...p2.propositions,...p2.structural_complement_attempt.propositions,...p2.elliptical_parenthetical_attempt.propositions,...p2.table_attempt.fragments];
 const A=audit.records.filter(r=>r.category==='A'),D=audit.records.filter(r=>r.category==='D'),E=audit.records.filter(r=>r.category==='E');
 const exact=e=>e?.source_id==='task'&&Number.isInteger(e.start)&&Number.isInteger(e.end)&&e.end>e.start&&e.quote===points.slice(e.start,e.end).join('');
 const argFields=['subject','predicate','object','modality','negation','negation_evidence','complement','reference_token','basis_reference','basis_references','temporal_surface','conditional_marker','temporal_marker','aspect_marker','quantifier_surface','comparison_surface','continuation_surface','parenthetical_surface','local_modifiers'];
 const contextsByProp=new Map();
 function add(id,kind,e,owner,field,contextSpans=[],extra={}){
   if(!exact(e))throw Error('GROUNDING_SOURCE_SPAN_INVALID:'+id);if(seen.has(id))throw Error('GROUNDING_DUPLICATE_ITEM');seen.add(id);
   const related=p3.links.filter(l=>l.proposition_id===owner||intersects(l.evidence,e));
   const ambiguities=A.filter(a=>(owner!==null&&a.affected_proposition===owner)||intersects(a.source_span,e));
   const contexts=[...new Map(contextSpans.filter(exact).filter(c=>!(c.start===e.start&&c.end===e.end)).map(c=>[`${c.start}:${c.end}`,c])).values()].sort((a,b)=>a.start-b.start||a.end-b.end);
   items.push({id,kind,source_span:e,owner_proposition_id:owner,field,context_spans:contexts,context_link_ids:related.map(l=>l.id),source_ambiguity_ids:ambiguities.map(a=>a.id),literal:literalValue(e.quote),...extra});
 }
 for(const p of props){
   const e=p.source_span??p.source_spans?.[1],contexts=[...(p.source_spans??[]),p.endpoint_provenance?.source_clause_span].filter(Boolean);
   for(const n of p1.document_tree.nodes)if(n.type==='SECTION'&&within(e,n.source_span)&&exact(n.heading_span))contexts.push(n.heading_span);
   // Only explicit links add antecedent evidence. Never traverse unresolved candidates.
   for(const l of p3.links.filter(l=>l.proposition_id===p.id&&l.status==='RESOLVED_CONTEXT'))for(const c of l.candidates.filter(c=>c.compatible))if(exact(c.evidence)&&['ANAPHORA','OMITTED_ARGUMENT','LIST_INHERITED_CONTEXT_SCOPE'].includes(l.kind))contexts.push(c.evidence);
   for(const l of p3.links.filter(l=>l.kind==='CONDITION_SCOPE'&&l.status==='RESOLVED_CONTEXT'))for(const c of l.candidates.filter(c=>c.compatible&&c.id===p.id))if(exact(c.structural_evidence?.condition_span))contexts.push(c.structural_evidence.condition_span);
   contextsByProp.set(p.id,contexts);
   add('prop:'+p.id,'PROPOSITION',e,p.id,null,contexts,{syntax_rule:p.rule??p.syntax_role??'STRUCTURAL_COMPLEMENT',frontend_provenance:p,structural_only:p.rule==='SYNTAX_CONNECTOR_FRAGMENT'});
   const walk=(v,f)=>{if(!v||typeof v!=='object')return;if(exact(v)){add(`slot:${p.id}:${f}`,'TYPED_SLOT',v,p.id,f,[e,...contexts]);return;}for(const [k,x] of Object.entries(v))walk(x,f+'.'+k);};
   for(const f of argFields)if(p[f])walk(p[f],f);
 }
 for(const [name,ext] of [['typed',p2.typed_endpoint_closure],['pre4',p2.pre_pass4_closure]])for(const n of ext.endpoint_nodes){
   const owner=n.proposition_id??ext.added_propositions.find(p=>within(n.evidence,p.source_span))?.id??null;
   const p=props.find(p=>p.id===owner);add('endpoint:'+name+':'+n.id,'TYPED_ENDPOINT',n.evidence,owner,n.type,p?[p.source_span,...(contextsByProp.get(p.id)??[])]:[],{frontend_provenance:n});
 }
 for(const r of A)add('ambiguity:'+r.id,'CONTEXT_NEED',r.source_span,r.affected_proposition,'A',[],{forced_status:'DEFERRED_SOURCE_AMBIGUITY',audit_record:r});
 for(const r of D)add('nonblocking:'+r.id,'CONTEXT_NEED',r.source_span,r.affected_proposition,'D',[],{forced_status:'NOT_APPLICABLE',audit_record:r});
 for(const r of E){const c=p1.source_accountability.clauses.find(c=>within(r.source_span,c.evidence));add('handoff:'+r.id,'GROUNDING_HANDOFF',c?.evidence??r.source_span,null,'E',[],{audit_record:r});}
 for(const i of items){i.pre_status=i.forced_status??(i.source_ambiguity_ids.length?'DEFERRED_SOURCE_AMBIGUITY':i.structural_only?'NOT_APPLICABLE':i.literal?'GROUNDED':null);i.eligibility=i.pre_status?'NO_MODEL_REQUIRED':'ELIGIBLE_FOR_CANDIDATE_OBSERVATION';}
 return {source_sha256:sha(text),policy:GROUNDING_POLICY,items,counts:{propositions:props.length,endpoints:p2.typed_endpoint_closure.endpoint_nodes.length+p2.pre_pass4_closure.endpoint_nodes.length,source_ambiguities:A.length,nonblocking_context_needs:D.length,grounding_handoffs:E.length,total:items.length},limitation:'Potentially boundary-relevant typed surfaces retained conservatively; no raw-source parsing or inferred boundary role.'};
}
const strings=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(strings):v&&typeof v==='object'?Object.values(v).flatMap(strings):[];
export function conceptCatalog(library,packs){
 return library.entries.map(entry=>{
   const pack=packs.find(p=>p.descriptor.name===entry.pack.pack_id);let definition;
   if(entry.kind==='ontology_operation')definition=pack.payloads.ontology.operations[entry.id];
   else if(entry.kind==='ontology_modality')definition=pack.payloads.ontology.modalities[entry.id];
   else if(entry.layer==='L1')definition=entry.id;
   else {const key={actions:'frames',entities:'entities',roles:'roles',resources:'resources',references:'references',completions:'completions',boundaries:'risks'}[entry.kind];definition=pack.payloads[entry.kind]?.[key]?.find(d=>d.id===entry.id);}
   const aliases=entry.kind==='ontology_operation'?[...definition.zh,...definition.en]:entry.kind==='ontology_modality'?definition:strings([definition?.aliases,definition?.triggers,definition?.label]);
   return {candidate_id:sha([entry.kind,entry.id,entry.pack.digest]),entry,definition,aliases:[...new Set(aliases??[])],label:definition?.label?.['zh-CN']??definition?.label??entry.id};
 });
}
function compatible(item,c){
 if(item.kind==='PROPOSITION'||item.kind==='GROUNDING_HANDOFF')return !c.entry.kind.includes('role');
 const f=item.field??'';
 if(/predicate|PREDICATE/.test(f))return ['actions','ontology_operation'].includes(c.entry.kind);
 if(/modality|negation/.test(f))return c.entry.kind==='ontology_modality';
 return !['actions','ontology_operation','ontology_role_kind','roles'].includes(c.entry.kind);
}
export function lexicalAnchors(item,c){
 const q=item.source_span.quote,anchors=[];
 for(const term of c.aliases){if(!term?.trim())continue;let at=0;while((at=q.toLowerCase().indexOf(term.toLowerCase(),at))>=0){const before=q[at-1]??'',after=q[at+term.length]??'';if(!(/[A-Za-z0-9_]/.test(term[0])&&/[A-Za-z0-9_]/.test(before))&&!(/[A-Za-z0-9_]/.test(term.at(-1))&&/[A-Za-z0-9_]/.test(after))){const start=item.source_span.start+[...q.slice(0,at)].length;anchors.push({source_id:'task',start,end:start+[...term].length,quote:q.slice(at,at+term.length),pack_alias:term});}at+=Math.max(1,term.length);}}
 return anchors;
}
export function candidateClaims(inventory,catalog,bge,e5){
 const b=new Map(bge.retrieval.map(x=>[x.query_id,x])),e=new Map(e5.retrieval.map(x=>[x.query_id,x])),claims=[],assessments=[];
 for(const item of inventory.items.filter(i=>!i.pre_status)){
   const bs=b.get(item.id),es=e.get(item.id),ids=new Set([...(bs?.candidates??[]),...(es?.candidates??[])].map(c=>c.candidate_id));
   for(const c of catalog)if(compatible(item,c)&&lexicalAnchors(item,c).length)ids.add(c.candidate_id);
   const candidates=[];
   for(const id of [...ids].sort()){const c=catalog.find(c=>c.candidate_id===id);if(!c)throw Error('UNKNOWN_PACK_CANDIDATE');const anchors=lexicalAnchors(item,c),ok=compatible(item,c);
     const claim_id=sha([item.id,id]);const rec={candidate_id:id,claim_id,type_compatible:ok,lexical_anchors:anchors,bge_score:bs?.candidates.find(x=>x.candidate_id===id)?.score??null,e5_score:es?.candidates.find(x=>x.candidate_id===id)?.score??null};
     candidates.push(rec);if(ok){
       // This tests a metalinguistic concept observation, not occurrence, permission,
       // or a requested action. Negated mentions are not rewritten as affirmative acts.
       const premise=[...item.context_spans.map(x=>x.quote),item.source_span.quote].join('\n');
       const hypothesis=`原文片段“${item.source_span.quote}”提及的概念是“${typeof c.label==='string'?c.label:c.entry.id}”。`;
       claims.push({id:claim_id,premise,hypothesis,item_id:item.id,candidate_id:id,source_provenance:{source_span:item.source_span,context_spans:item.context_spans,context_link_ids:item.context_link_ids},claim_kind:'CONCEPT_MENTION_NOT_BOUNDARY_FACT'});
     }
   }
   assessments.push({item_id:item.id,bge:bs??null,e5:es??null,candidates});
 }
 return {claims,assessments};
}
export function finalizeGrounding(inventory,catalog,prepared,nli){
 const signals=new Map((nli.predictions??[]).map(x=>[x.claim_id,x]));
 const rows=inventory.items.map(item=>{
   if(item.pre_status)return {...item,status:item.pre_status,grounded_concepts:[],literal_grounding:item.pre_status==='GROUNDED'?item.literal:null,reason:item.pre_status==='DEFERRED_SOURCE_AMBIGUITY'?'Source ambiguity carried; no model resolution attempted.':item.pre_status==='NOT_APPLICABLE'?'Structural or audited non-boundary/non-blocking need.':'Deterministic exact literal type; not a semantic-pack concept or boundary fact.'};
   const a=prepared.assessments.find(a=>a.item_id===item.id);if(!a)throw Error('GROUNDING_ITEM_OMITTED');
   const candidates=a.candidates.map(c=>({...c,concept:catalog.find(x=>x.candidate_id===c.candidate_id),nli:signals.get(c.claim_id)??null}));
   const supported=candidates.filter(c=>c.type_compatible&&c.lexical_anchors.length&&c.nli?.signal==='supporting'&&c.nli.confidence>=GROUNDING_POLICY.nli_entailment_min);
   // Distinct levels/kinds may coexist; competing concepts within the same kind
   // remain ambiguous instead of selecting the best embedding/NLI score.
   const kinds=new Map();for(const c of supported){const k=c.concept.entry.kind;const xs=kinds.get(k)??[];xs.push(c);kinds.set(k,xs);}
   const ambiguous=[...kinds.values()].some(xs=>xs.length>1),status=ambiguous?'AMBIGUOUS_GROUNDING':supported.length?'GROUNDED':'NO_SUPPORTED_GROUNDING';
   return {...item,status,candidates,grounded_concepts:ambiguous?[]:supported.map(c=>({reference:c.concept.entry,source_anchors:c.lexical_anchors,nli_claim_id:c.claim_id})),literal_grounding:null,
     reason:ambiguous?'Multiple supported same-kind concepts; no score tie-break.':supported.length?'Pack lexical evidence + slot compatibility + NLI signal; concept observation only.':'No candidate meets the fixed lexical/type/NLI conjunction. Retrieval alone cannot establish support.'};
 });
 const counts={GROUNDED:0,AMBIGUOUS_GROUNDING:0,NO_SUPPORTED_GROUNDING:0,DEFERRED_SOURCE_AMBIGUITY:0,NOT_APPLICABLE:0};for(const r of rows)counts[r.status]++;
 return {compiler_pass:4,invariant:'INV-GROUNDING-SOURCE-PACK-SIGNAL-ACCOUNTABILITY',policy:GROUNDING_POLICY,source_sha256:inventory.source_sha256,counts,rows,
   grounded_literal_count:rows.filter(r=>r.literal_grounding).length,grounded_pack_observation_count:rows.filter(r=>r.grounded_concepts.length).length,
   boundary_resolution:'NOT_PERFORMED',projection:'NOT_PERFORMED',LLM:'NOT_USED',L3:'NOT_SELECTED / NOT_AVAILABLE'};
}
