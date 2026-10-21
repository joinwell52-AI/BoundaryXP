import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Modal scope is proposed along an explicit coordinated predicate path.
// The original modal reading and all role extents remain available to Γ.
export function coordinationCandidates(f){
 f.proposals.provider='COORDINATED_MODAL_SCOPE_CANDIDATES';
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const ledger=f.semantic_decoding.coordinated_modal_candidates=[];
 for(const a of f.analyses){const ts=a.cl.tokens,events=[...a.events];
  for(const target of events){const p=ts.find(t=>t.id===target.metadata.token_id);if(!p)continue;
   const explicitLocal=ts.some(t=>t.head===ts.indexOf(p)&&/aux|neg/u.test(t.dep??'')&&/must|shall|may|can|not|必须|不得|应|须/u.test(t.text));
   if(explicitLocal)continue;
   const candidates=events.filter(e=>e.node_id!==target.node_id&&sp(e).end<sp(target).start&&['REQUIRED','PERMITTED','FORBIDDEN','NOT_REQUIRED'].includes(e.metadata.modality)&&e.metadata.syntactic_layer===target.metadata.syntactic_layer);
   for(const source of candidates){const q=ts.find(t=>t.id===source.metadata.token_id),markers=ts.filter(t=>t.start>=sp(source).end&&t.end<=sp(target).start&&/^(并|且|和|或|以及|and|or|nor)$/iu.test(t.text));if(!q||!markers.length)continue;
    const intervening=events.some(e=>sp(e).start>sp(source).end&&sp(e).end<sp(target).start&&e.metadata.token_id!==source.metadata.token_id&&e.metadata.syntactic_layer!==target.metadata.syntactic_layer);
    const path=p.head===ts.indexOf(q)&&/conj/u.test(p.dep??'')||markers.some(m=>m.head===ts.indexOf(p))&&q.start===a.cl.span.start;
    if(!path||intervening)continue;
    const event=f.tools.node(a.cl,'EVENT',sp(target).start,sp(target).end,{...target.metadata,modality:source.metadata.modality,modality_rule:'EXPLICIT_COORDINATED_MODAL_SCOPE',local_modal_license:{modality:source.metadata.modality,rule:'EXPLICIT_COORDINATED_MODAL_SCOPE',token_ids:[q.id,...markers.map(t=>t.id),p.id],source_node_id:source.node_id},source_predicate_license:{rule:'EXPLICIT_COORDINATED_PREDICATE',token_ids:[q.id,...markers.map(t=>t.id),p.id],source_span_ids:[a.sid]}});a.events.push(event);
    for(const r of [...f.relations].filter(r=>r.head_node_id===target.node_id&&r.relation_type!=='CONJUNCTION')){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),alt=f.tools.relation(a.cl,r.relation_type,event,n,r.evidence_span_ids);alt.generic_evidence??=[];for(const evidence of r.generic_evidence??[])if(!alt.generic_evidence.some(e=>JSON.stringify(e)===JSON.stringify(evidence)))alt.generic_evidence.push(structuredClone(evidence));alt.generic_evidence.push({rule:'COORDINATED_PREDICATE_LOCAL_ARGUMENT',original_relation_id:r.relation_id,token_ids:[q.id,p.id],source_span_ids:[a.sid]});}
    const r=f.tools.relation(a.cl,'CONJUNCTION',source,event,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_COORDINATED_MODAL_SCOPE',token_ids:[q.id,...markers.map(t=>t.id),p.id],source_span_ids:[a.sid]});
    ledger.push({event_node_id:event.node_id,source_node_id:source.node_id,marker_token_ids:markers.map(t=>t.id),source_span_ids:uniq([a.sid,...source.source_span_ids,...target.source_span_ids]),attachment_path:[a.parent_structure_id,a.cl.id,q.id,...markers.map(t=>t.id),p.id],candidate_only:true});
   }
  // A final shared object is a licensed coordination alternative for earlier
  // predicates too. It is not borrowed from an arbitrary neighboring clause.
  for(const target of events){const p=ts.find(t=>t.id===target.metadata.token_id);if(!p)continue;
   for(const source of events){const q=ts.find(t=>t.id===source.metadata.token_id);if(!q||q.start<=p.end||q.head!==ts.indexOf(p)||q.dep!=='conj')continue;
    const markers=ts.filter(t=>t.start>=p.end&&t.end<=q.start&&/^(并|且|和|或|以及|and|or|nor)$/iu.test(t.text));if(!markers.length)continue;
    for(const r of [...f.relations].filter(r=>r.head_node_id===source.node_id&&['PATIENT','THEME','RESULT','FORBIDS'].includes(r.relation_type))){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(sp(n).start<q.end)continue;const relation=f.tools.relation(a.cl,target.metadata.modality==='FORBIDDEN'?'FORBIDS':target.metadata.sense==='generate'?'RESULT':'PATIENT',target,n,[a.sid]);relation.generic_evidence??=[];relation.generic_evidence.push({rule:'EXPLICIT_FINAL_COORDINATED_ARGUMENT_DOMAIN',source_span_ids:[a.sid,...n.source_span_ids],token_ids:[p.id,...markers.map(t=>t.id),q.id],dependency_path:[p.id,q.id]});}
   }
  }
  }
 }
 return f;
}
