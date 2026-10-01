import {boundaryDomain} from './discourse.mjs';

export function documentConstructions(f){
 const {node,relation,span,task}=f.tools,points=[...f.source.raw_text];
 const rejectEvent=(a,e,reason)=>{e.metadata.candidate_disposition='REJECTED';e.metadata.rejection_reason=reason;for(const r of f.relations.filter(r=>r.head_node_id===e.node_id)){r.state='REJECTED';delete r.unresolved_ref;}a.events=a.events.filter(x=>x!==e);};
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse))continue;
  const q=a.cl.span.quote;
  // Imperative authoring with an explicit document noun. No quoted/code content authorizes this.
  const m=/(编写|起草|撰写|落一份|write|draft|author)\s*(?:一份\s*)?([^，。；\n]*?(?:prompt|specification|document|文档|规范|提示词|说明书)(?:[^，。；\n]*))/iu.exec(q);
  if(m){const start=a.cl.span.start+[...q.slice(0,m.index)].length,predicateEnd=start+[...m[1]].length,objStart=a.cl.span.start+[...q.slice(0,m.index+m[0].length-m[2].length)].length;
   const existing=a.events.find(e=>{const s=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]);return s.start===start;});
   const e=existing??node(a.cl,'EVENT',start,predicateEnd,{sense:'write',modality:'REQUIRED',owner:a.cl.id,discourse:a.discourse,authored_document:true});
   if(!existing)a.events.push(e);e.metadata.authored_document=true;
   if(e.metadata.modality==='UNSTATED'&&/^\s*(?:请\s*)?$/u.test(q.slice(0,m.index))){e.metadata.modality='REQUIRED';if(e.metadata.modality_unresolved){f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==e.metadata.modality_unresolved);delete e.metadata.modality_unresolved;}}
   const obj=node(a.cl,'ENTITY',objStart,objStart+[...m[2]].length,{sense:'AUTHORED_DOCUMENT',owner:e.node_id,discourse:a.discourse});relation(a.cl,'RESULT',e,obj,[a.sid]);a.handled=true;
  }
  // A list-item header "new files:" owns only file children on its explicit indentation path.
  if(/(?:新建|创建|create|new)\s*(?:文件|files?)/iu.test(q)&&(/[:：]/u.test(a.discourse.source_span?.quote??q)||a.discourse.heading_marker_span)){
   const marker=/(新建|创建|create|new)/iu.exec(q),start=a.cl.span.start+[...q.slice(0,marker.index)].length;
   const children=f.analyses.filter(b=>b!==a&&b.discourse.structural_path?.includes(a.discourse.structure_id)&&boundaryDomain(b.discourse));
   const files=children.flatMap(b=>{const literal=/^\s*[-*+]\s+`([^`\n]+\.[a-z]{1,8})`\s*$/iu.exec(b.cl.span.quote);if(literal){const start=b.cl.span.start+[...b.cl.span.quote.slice(0,literal.index+literal[0].indexOf(literal[1]))].length;return [{b,n:node(b.cl,'ENTITY',start,start+[...literal[1]].length,{literal_tag:'FILEPATH',discourse:b.discourse})}];}return b.locals.filter(n=>n.metadata.literal_tag==='FILEPATH').map(n=>({b,n}));});
   if(files.length){const e=node(a.cl,'EVENT',start,start+[...marker[0]].length,{sense:'generate',modality:'REQUIRED',owner:a.cl.id,discourse:a.discourse,authored_document:true});if(!a.events.includes(e))a.events.push(e);
    for(const {b,n} of files)relation(a.cl,'RESULT',e,n,[a.sid,b.sid]);a.handled=true;
   }
  }
  // Recover a negative predicate's complete local complement, never a preposition as an object.
  const neg=/^\s*(?:[-*+]\s+)?(?:\*\*)?(不改|不动|不做|不实现|不修改|不发布|不发|不在)/u.exec(q);
  if(neg&&a.discourse.kind==='OUT_OF_SCOPE'){
   const operator=neg[1],start=a.cl.span.start+[...q.slice(0,neg.index+neg[0].length-operator.length)].length;
   let end=a.cl.span.end;const local=points.slice(start+[...operator].length,end).join(''),paren=local.search(/[（(]/u);if(paren>=0)end=start+[...operator].length+[...local.slice(0,paren)].length;
   let objStart=start+[...operator].length;while(objStart<end&&/[\s*`"“]/u.test(points[objStart]))objStart++;while(end>objStart&&/[\s*`"”]/u.test(points[end-1]))end--;
   if(end>objStart){for(const e of [...a.events])rejectEvent(a,e,'OUT_OF_SCOPE_COMPLEMENT_OWNERSHIP');
    const e=node(a.cl,'EVENT',start,start+[...operator].length,{sense:'exclude',modality:'FORBIDDEN',owner:a.cl.id,discourse:a.discourse});e.metadata.candidate_disposition='ACCEPTED';
    const obj=node(a.cl,'ENTITY',objStart,end,{sense:'EXCLUDED_TARGET',owner:e.node_id,discourse:a.discourse});relation(a.cl,'FORBIDS',e,obj,[a.sid]);a.events.push(e);a.handled=true;
   }
  }
 }
 // Frontmatter recipient is an explicit assignment, not approval authority from sender/title.
 for(const a of f.analyses.filter(a=>a.discourse.kind==='METADATA')){
  const m=/^recipient\s*[:：]\s*([A-Za-z][A-Za-z0-9_-]*)\s*$/u.exec(a.cl.span.quote);if(!m)continue;
  const start=a.cl.span.end-[...m[1]].length,n=node(a.cl,'ENTITY',start,a.cl.span.end,{sense:'DECLARED_RECIPIENT',participant_roles:['PERFORMER'],current_task_assignment:true,discourse:{...a.discourse,kind:'CURRENT_TASK',source_kind:'METADATA'}});
  relation(a.cl,'AGENT',task,n,[a.sid]);a.handled=true;
 }
 return f;
}
