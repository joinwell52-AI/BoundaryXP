import {graphApi,length} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Source commentary on missing correspondence is a metalinguistic state.
// It declares uncertainty; it never supplies the missing correspondence.
export function ambiguityDeclarations(f){const {retire,edge}=graphApi(f),log=[];f.semantic_decoding.source_ambiguity_ir=log;
 for(const a of f.analyses){const text=a.cl.span.quote;
  const quote=/[“"]([^”"]+)[”"]/u.exec(text),annotation=quote&&/没有(?:说明|唯一指向)|指向不唯一|指哪一份|no unique referent/iu.test(text),continuation=/^(?:应保持(?:审批条件)?未决|未说明最终采用|但没有说明|but.*not specified)/iu.test(text);
  if(!annotation&&!continuation)continue;
  retire(a,'EXPLICIT_SOURCE_CORRESPONDENCE_COMMENTARY');
  const n=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'SOURCE_CORRESPONDENCE_UNSPECIFIED',owner:a.cl.id,discourse:a.discourse,source_ambiguity:true,quoted_term:quote?.[1]??null});a.state=n;edge(a,'CONJUNCTION',n,f.tools.task);
  log.push({clause_id:a.cl.id,term:quote?.[1]??null,source_span_ids:[a.sid],state_node_id:n.node_id});
 }
 return f;
}
export function referenceAmbiguityDomains(f){const {cp,nm,sp,edge,expr}=graphApi(f),log=f.semantic_decoding.source_ambiguity_ir??=[];
 for(const a of f.analyses){
  const declared=log.filter(x=>x.term).map(x=>x.term),refPattern=/(?:该报告|该文件|它|this report|that file|\bit\b)/giu;
  const ranges=[...a.cl.span.quote.matchAll(refPattern)].map(m=>({text:m[0],start:a.cl.span.start+length(a.cl.span.quote.slice(0,m.index)),end:a.cl.span.start+length(a.cl.span.quote.slice(0,m.index+m[0].length))}));
  for(const term of declared){const at=a.cl.span.quote.indexOf(term);if(at>=0&&!ranges.some(x=>x.text===term))ranges.push({text:term,start:a.cl.span.start+length(a.cl.span.quote.slice(0,at)),end:a.cl.span.start+length(a.cl.span.quote.slice(0,at+term.length))});}
  if(a.state?.metadata.source_ambiguity)continue;
  for(const range of ranges){
   const domain=[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='SCOPE_MEMBER').map(r=>nm(r.tail_node_id)).filter(n=>n?.metadata.literal_tag==='FILEPATH'&&sp(n).end<a.cl.span.start&&f.analyses.find(b=>b.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id).map(n=>[n.surface,n])).values()];
   if(domain.length<2)continue;
   const affected=a.events.filter(e=>e.metadata.modality!=='FORBIDDEN'&&f.relations.some(r=>r.state!=='REJECTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type)&&(()=>{const s=sp(nm(r.tail_node_id));return s.start<=range.start&&s.end>=range.end;})()));
   if(!affected.length&&!a.cl.quoted_directive)continue;
   const candidates=domain.map(n=>n.node_id),ref=f.tools.node(a.cl,'UNKNOWN_REFERENT',range.start,range.end,{sense:'SOURCE_REFERENCE',owner:a.cl.id,discourse:a.discourse});
   ref.metadata.resolution={rule:'TYPED_INPUT_DOMAIN_WITHOUT_UNIQUE_CORRESPONDENCE',candidate_node_ids:candidates,selected_node_ids:[],source_span_ids:uniq([a.sid,...domain.flatMap(n=>n.source_span_ids)]),structural_path:[a.parent_structure_id,a.cl.id],reason:'Multiple compatible source input endpoints; no unique correspondence'};
   for(const e of a.events.filter(e=>e.metadata.modality!=='FORBIDDEN')){
    const rs=f.relations.filter(r=>r.state!=='REJECTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type)),direct=rs.some(r=>{const s=sp(nm(r.tail_node_id));return s.start<=range.start&&s.end>=range.end;}),coordinated=a.cl.quoted_directive&&e.metadata.sense==='send'&&(/并|\band\b/iu.test(a.cl.span.quote)||a.cl.tokens.some(t=>t.start===range.start&&t.pos==='PN'&&t.head===a.cl.tokens.findIndex(t=>t.start===sp(e).start)));
    if(!direct&&!coordinated)continue;
    for(const r of rs){r.state='REJECTED';r.rejection_reason='SOURCE_REFERENCE_HAS_COMPETING_TYPED_DOMAIN';}
    const r=edge(a,e.metadata.sense==='send'?'THEME':'PATIENT',e,ref);r.state='COMPETING';r.unresolved_ref=ref.unresolved_ref;
    const replaced=new Set(rs.map(r=>r.relation_id));
    for(const dependency of f.relations)if(dependency.dependency_relation_ids?.some(i=>replaced.has(i)))dependency.dependency_relation_ids=uniq(dependency.dependency_relation_ids.map(i=>replaced.has(i)?r.relation_id:i));
    for(const expressions of Object.values(f.expressions))for(const x of expressions)if(x.relation_ids?.some(i=>replaced.has(i)))x.relation_ids=uniq(x.relation_ids.map(i=>replaced.has(i)?r.relation_id:i));
    for(const state of f.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.event_node_id===e.node_id)){state.metadata.object_node_ids=[ref.node_id];edge(a,'CONJUNCTION',state,ref).state='COMPETING';}
    const p=f.expression_plans.get(e.node_id)??{};delete p.scope_expr_id;f.expression_plans.set(e.node_id,p);
    log.push({clause_id:a.cl.id,term:range.text,reference_node_id:ref.node_id,event_node_id:e.node_id,candidate_node_ids:candidates,selected_node_ids:[],source_span_ids:ref.metadata.resolution.source_span_ids});
   }
  }
 }
 for(const basis of f.semantic_decoding.basis_reference_ir?.references??[]){
  if(basis.state!=='UNRESOLVED'||basis.candidate_version_node_ids.length<2)continue;
  for(const r of f.relations.filter(r=>r.relation_type==='BASIS'&&r.tail_node_id===basis.endpoint_node_id&&r.state!=='REJECTED')){r.state='COMPETING';r.source_ambiguity={kind:'BASIS_VERSION',candidate_node_ids:[...basis.candidate_version_node_ids],selected_node_ids:[],source_span_ids:basis.source_span_ids};}
 }
 return f;
}
