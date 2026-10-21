import {uniq} from './identity.mjs';import {boundaryDomain} from './discourse.mjs';
// Only a case/preposition dependency of a transfer/report predicate licenses
// the recipient argument. A prior person mention is never a fallback.
export function closeExplicitRecipients(f){
 const audit={version:'7P-COMPOSITION-013-R3',bindings:[],nearest_person_fallback:false};f.semantic_decoding.explicit_recipient=audit;
 const span=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const ts=a.cl.tokens;
  for(const marker of ts.filter(t=>/^(给|向|to)$/iu.test(t.text)&&/^(case|prep)$/u.test(t.dep))){
   let arg,verb;if(marker.dep==='case'){arg=ts[marker.head];verb=ts[arg?.head];}else{verb=ts[marker.head];arg=ts.find(t=>t.head===ts.indexOf(marker)&&/pobj|obj/u.test(t.dep));}
   const event=a.events.find(n=>n.metadata.token_id===verb?.id&&/^(send|report|submit|deliver|提交|汇报|报告|发送)$/iu.test(n.metadata.sense??n.surface));if(!arg||!event)continue;
   const attached=ts.filter(t=>t.head===ts.indexOf(arg)&&/det|nummod|compound|amod/u.test(t.dep)),start=Math.min(arg.start,...attached.map(t=>t.start)),end=Math.max(arg.end,...attached.map(t=>t.end)),text=[...f.source.raw_text].slice(start,end).join('');
   const rec={predicate_node_id:event.node_id,marker_span_id:f.tools.span(marker.start,marker.end),argument_span_id:f.tools.span(start,end),source_span_ids:[a.sid,f.tools.span(marker.start,marker.end),f.tools.span(start,end)],structural_path:a.discourse.structural_path,dependency_path:[marker.id,arg.id,verb.id],status:'UNRESOLVED'};audit.bindings.push(rec);
   const unresolved=/其中|上述|该|他们|它们|其|未知|未指定|待定|\b(?:them|him|her|someone|unknown|TBD|one of)\b/iu.test(text)||ts.some(t=>t.head===ts.indexOf(arg)&&/conj|cc/u.test(t.dep));
   const old=f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&span(n)?.start===arg.start&&span(n)?.end===arg.end);
   if(unresolved||old?.metadata.technical_type||!/^(?:N|PROPN)/u.test(arg.pos)){rec.reason='RECIPIENT_REFERENT_NOT_UNIQUELY_EXPLICIT';rec.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE',rec.reason,old?[old.node_id]:[]);continue;}
   const n=old??f.tools.node(a.cl,'ENTITY',start,end,{sense:'EXPLICIT_TRANSFER_RECIPIENT',discourse:a.discourse});n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'RECIPIENT']);n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TRANSFER_CASE_DEPENDENCY',source_span_ids:rec.source_span_ids};
   const r=f.tools.relation(a.cl,'RECIPIENT',event,n,rec.source_span_ids);r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'EXPLICIT_TRANSFER_RECIPIENT']);rec.node_id=n.node_id;rec.relation_id=r.relation_id;rec.status='CERTIFIED';
  }
 }
 return f;
}
