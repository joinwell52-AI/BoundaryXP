import {graphApi} from './migration/graph-api.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
// An explicit conformance test supplies a normative comparison reference;
// it does not assert that the inspected object actually conforms.
export function conformanceReferences(f){
 const {edge,expr}=graphApi(f),log=[];f.semantic_decoding.conformance_reference_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  const ts=a.cl.tokens;
  for(const t of ts.filter(t=>/^(符合|conform|conforms|comply|complies)$/iu.test(t.text))){
   const index=ts.indexOf(t),owners=[...new Map(a.events.filter(e=>e.metadata.sense==='review'&&ts.some(q=>q.id===e.metadata.token_id&&t.head===ts.indexOf(q))).map(e=>[e.node_id,e])).values()];
   if(owners.length!==1)continue;
   const args=ts.filter(q=>q.head===index&&/^(dobj|obj)$/u.test(q.dep??''));
   if(args.length!==1)continue;const q=args[0];
   const literal=f.nlp_signals.literals.find(l=>['REFERENCE','IDENTIFIER'].includes(l.type)&&l.span.start===q.start&&l.span.end===q.end);
   const frame=(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===index)),basis=frame?.find(r=>r[1]==='ARG1'&&r[2]>index);
   const nominal=/^(NN|NR|NOUN|PROPN)$/u.test(q.pos??'')&&basis&&ts.slice(basis[2],basis[3]).some(n=>n.id===q.id);
   if(!literal&&!nominal)continue;
   const [from,to]=literal?[q.start,q.end]:[ts[basis[2]].start,ts[basis[3]-1].end];
   const ref=f.tools.node(a.cl,'REFERENCE',from,to,{sense:'CONFORMANCE_REFERENCE',literal_tag:'REFERENCE',...(literal?{literal_id:literal.id}:{}),token_id:q.id,owner:owners[0].node_id,discourse:a.discourse,comparison_mode:'CHECK_CONFORMANCE',authority_inferred:false}),r=edge(a,'CONFORMS_TO',owners[0],ref);
   const subjects=ts.filter(n=>n.head===index&&n.dep==='nsubj');
   if(subjects.length===1){
    const nominalDomain=new Set([ts.indexOf(subjects[0])]);for(let size=-1;size!==nominalDomain.size;){size=nominalDomain.size;ts.forEach((n,i)=>{if(nominalDomain.has(n.head)&&/^(nmod(?::.*)?|compound(?::.*)?|case|det|amod|acl)$/u.test(n.dep??''))nominalDomain.add(i);});}
    const [phraseStart,end]=modifierPhrase(a.cl,subjects[0]),start=Math.min(phraseStart,...[...nominalDomain].map(i=>ts[i].start)),object=f.tools.node(a.cl,'ENTITY',start,end,{sense:'CONFORMANCE_CHECK_OBJECT',owner:owners[0].node_id,discourse:a.discourse,token_id:subjects[0].id,syntax_token_ids:[...nominalDomain].map(i=>ts[i].id),attachment_path:[a.cl.id,subjects[0].id,t.id,owners[0].node_id]});
    const withdrawn=f.relations.filter(x=>x.state==='SUPPORTED'&&x.head_node_id===owners[0].node_id&&x.relation_type==='PATIENT');
    for(const x of withdrawn){x.state='REJECTED';x.rejection_reason='CONFORMANCE_OBJECT_BASIS_SEPARATION';for(const sr of f.relations.filter(sr=>sr.state==='SUPPORTED'&&sr.relation_type==='SCOPE_MEMBER'&&sr.tail_node_id===x.tail_node_id))sr.state='REJECTED';}
    const argument=edge(a,'PATIENT',owners[0],object),scope=edge(a,'SCOPE_MEMBER',f.tools.task,object);
    const item=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:object.node_id,relation_ids:[argument.relation_id],source_span_ids:[a.sid,...object.source_span_ids]});f.expression_plans.set(owners[0].node_id,{...f.expression_plans.get(owners[0].node_id),scope_expr_id:item});
    argument.dependency_relation_ids=[r.relation_id];scope.dependency_relation_ids=[r.relation_id];
   }
   r.conformance_evidence={rule:'EXPLICIT_REVIEW_CONFORMANCE_COMPLEMENT',asserts_conformance:false,comparison_token_id:t.id,reference_token_id:q.id,structural_path:[a.parent_structure_id,a.cl.id,owners[0].node_id,t.id,q.id],source_span_ids:[a.sid,...ref.source_span_ids]};
   log.push({event_node_id:owners[0].node_id,reference_node_id:ref.node_id,relation_id:r.relation_id,...r.conformance_evidence});
  }
 }
 return f;
}
