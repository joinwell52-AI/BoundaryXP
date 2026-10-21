import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Scope-marked negative task declarations and deontic auxiliaries propose
// modal readings. They are never a directive to run the described operation.
export function modalCandidates(f){
 f.proposals.provider='EXPLICIT_TASK_MODAL_CANDIDATES';
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 f.semantic_decoding.explicit_modal_candidates=[];
 for(const a of f.analyses){const raw=a.cl.span.quote,ts=a.cl.tokens;
  const markers=[...raw.matchAll(/不要求|不需要|无需|只需|不得|禁止|严禁|不允许|必须|应当|应|须|才(?:能|允许)|(?:本任务|此次任务|本次任务|也|并|且)\s*不(?=执行|修改|新增|读取|参与|连接|运行|下载|训练)|^不(?=修改|执行|新增)|\b(?:must\s+not|need\s+not|must|shall|may|can)\b/giu)];
  for(const event of [...a.events]){if(!['MAIN','AFFECTED_ACTION'].includes(event.metadata.syntactic_layer??'MAIN'))continue;
   const p=ts.find(t=>t.id===event.metadata.token_id);if(!p)continue;
   for(const m of markers){const start=a.cl.span.start+[...raw.slice(0,m.index)].length,end=start+[...m[0]].length;if(end>sp(event).start)continue;
    const intervening=ts.filter(t=>t.start>=end&&t.end<=p.start),governing=intervening.every(t=>/^(AD|ADV|P|BA|NN|NR|PROPN|NOUN)$/u.test(t.pos??'')||/^(要求|需要|执行|进行|通过|在|以|向|给|将|把|才|能|only|then|to)$/iu.test(t.text));
    if(!governing||/[“”"。;；]/u.test([...f.source.raw_text].slice(end,p.start).join('')))continue;
    const modality=/不要求|不需要|无需|need\s+not/iu.test(m[0])?'NOT_REQUIRED':/不得|禁止|严禁|不允许|不$|must\s+not/iu.test(m[0])?'FORBIDDEN':/\bmay\b|\bcan\b|才允许/iu.test(m[0])?'PERMITTED':'REQUIRED';
    const alternative=f.tools.node(a.cl,'EVENT',sp(event).start,sp(event).end,{...event.metadata,modality,modality_rule:'EXPLICIT_TASK_MODAL_SCOPE',local_modal_license:{modality,rule:'EXPLICIT_TASK_MODAL_SCOPE',source_span_ids:[a.sid,f.tools.span(start,end)],token_ids:[p.id,...intervening.map(t=>t.id)]}});a.events.push(alternative);
    for(const r of [...f.relations].filter(r=>r.head_node_id===event.node_id&&r.relation_type!=='CONJUNCTION')){const tail=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),copy=f.tools.relation(a.cl,r.relation_type,alternative,tail,r.evidence_span_ids);copy.generic_evidence??=[];copy.generic_evidence.push({rule:'EXPLICIT_TASK_MODAL_ARGUMENT_SCOPE',source_span_ids:uniq([a.sid,f.tools.span(start,end)]),token_ids:[p.id]});}
    f.semantic_decoding.explicit_modal_candidates.push({predicate_node_id:alternative.node_id,operator_span_id:f.tools.span(start,end),modality,source_span_ids:uniq([a.sid,...alternative.source_span_ids]),candidate_only:true});
   }
  }
 }
 return f;
}
