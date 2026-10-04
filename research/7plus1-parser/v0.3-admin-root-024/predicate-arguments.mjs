import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
// A nominal predicate's preceding nominal modifiers are its argument, not part
// of the predicate token. An explicit organization construction owns its actor.
export function predicateArguments(f){
 for(const a of f.analyses){
  for(const e of a.events.filter(e=>['review','analyze'].includes(e.metadata.sense))){
   if(f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type)))continue;
   const ts=a.cl.tokens,p=ts.find(t=>t.id===e.metadata.token_id),pi=ts.indexOf(p),arguments_=ts.filter(t=>t.head===pi&&t.end<=p.start&&/^compound:nn$/u.test(t.dep??'')&&/^(NN|NR|NOUN|PROPN)$/u.test(t.pos??'')&&!/^(只读|read-only)$/iu.test(t.text));
   if(arguments_.length!==1)continue;
   const q=arguments_[0],[start,end]=modifierPhrase(a.cl,q),n=f.tools.node(a.cl,'ENTITY',start,end,{token_id:q.id,syntax_token_ids:[q.id,p.id],argument_role:'PREPOSED_COMPOUND_PREDICATE_ARGUMENT',owner:e.node_id,attachment_path:[a.cl.id,q.id,p.id]});
   f.tools.relation(a.cl,e.metadata.modality==='FORBIDDEN'?'FORBIDS':'PATIENT',e,n,[a.sid]);
   if(e.metadata.modality!=='FORBIDDEN')f.tools.relation(a.cl,'SCOPE_MEMBER',f.tools.task,n,[a.sid]);
  }
  const c=a.compound;if(!c?.complement)continue;
  const t=c.complement,e=a.events.find(e=>e.metadata.token_id===t.id);if(!e)continue;
  let directional=(a.cl.srl??[]).find(frame=>frame.some(row=>row[1]==='PRED'&&row[2]===a.cl.tokens.indexOf(c.support)))?.find(row=>row[1]==='ARGM-DIR');
  if(!directional)directional=(a.cl.srl??[]).find(frame=>frame.some(row=>row[1]==='PRED'&&row[2]===a.cl.tokens.indexOf(t))&&frame.some(row=>row[1]==='Sup'))?.find(row=>row[1]==='ARG1');
  if(!directional&&/^(NN|NOUN)$/u.test(t.pos??''))directional=(a.cl.srl??[]).find(frame=>frame.some(row=>row[1]==='PRED'&&row[2]===a.cl.tokens.indexOf(c.support)))?.find(row=>row[1]==='ARG1'&&a.cl.tokens[row[3]-1]?.end<=t.start&&a.cl.tokens.slice(row[2],row[3]).some(q=>/^(NN|NR|NOUN|PROPN)$/u.test(q.pos??'')));
  if(!directional){const caseIndex=a.cl.tokens.findIndex(q=>q.text==='对'&&q.end<=c.support.start),endIndex=a.cl.tokens.indexOf(c.support);if(caseIndex>=0&&endIndex>caseIndex)directional=['SOURCE_PREPOSED_ARGUMENT','ARG1',caseIndex,endIndex];}
  if(!directional){const prep=a.cl.tokens.find(q=>q.head===a.cl.tokens.indexOf(t)&&q.dep==='prep'&&/^of$/iu.test(q.text)),object=prep&&a.cl.tokens.find(q=>q.head===a.cl.tokens.indexOf(prep)&&q.dep==='pobj');if(object){const [start,end]=modifierPhrase(a.cl,object),indices=a.cl.tokens.map((q,i)=>({q,i})).filter(({q})=>q.start>=start&&q.end<=end);if(indices.length)directional=['NOMINAL_OF_COMPLEMENT','ARG1',indices[0].i,indices.at(-1).i+1];}}
  if(directional){
   const ts=a.cl.tokens.slice(directional[2],directional[3]),first=ts.find(q=>q.dep!=='case'&&q.text!=='对'),last=ts.at(-1);
   if(first&&last&&first.start<last.end){const ids=[];
    for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&['PATIENT','FORBIDS'].includes(r.relation_type))){r.state='REJECTED';ids.push(r.tail_node_id);}
    for(const r of f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&ids.includes(r.tail_node_id)))r.state='REJECTED';
    const n=f.tools.node(a.cl,'ENTITY',first.start,last.end,{token_id:first.id,syntax_token_ids:ts.map(q=>q.id),argument_role:'SUPPORT_PREDICATE_DIRECTIONAL_ARGUMENT',owner:e.node_id,embedded_artifact_spans:f.nlp_signals.literals.filter(l=>l.type==='FILE'&&l.span.start>=first.start&&l.span.end<=last.end).map(l=>l.span)});
    f.tools.relation(a.cl,e.metadata.modality==='FORBIDDEN'?'FORBIDS':'PATIENT',e,n,[a.sid]);
    if(e.metadata.modality!=='FORBIDDEN')f.tools.relation(a.cl,'SCOPE_MEMBER',f.tools.task,n,[a.sid]);
   }
  }else if(/^(NN|NOUN)/u.test(t.pos??'')){
   const [start]=modifierPhrase(a.cl,t);
   if(start<t.start&&a.cl.tokens.some(q=>q.start>=start&&q.end<=t.start&&/^(NN|NR|NOUN|PROPN)/u.test(q.pos??''))){
    for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='PATIENT')){
     const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);
     if(n.metadata.sense==='EVENT_NOMINAL')r.state='REJECTED';
    }
    const ts=a.cl.tokens.filter(q=>q.start>=start&&q.end<=t.start),n=f.tools.node(a.cl,'ENTITY',start,t.start,{token_id:ts[0]?.id,syntax_token_ids:ts.map(q=>q.id),argument_role:'NOMINAL_PREDICATE_MODIFIER',owner:e.node_id});
    f.tools.relation(a.cl,e.metadata.modality==='FORBIDDEN'?'FORBIDS':'PATIENT',e,n,[a.sid]);
   }
  }
  const organizer=a.cl.tokens.find(q=>/^(组织|organize|organise)$/iu.test(q.text)&&q.end<t.start);
  if(organizer){
   const actors=a.cl.tokens.filter(q=>q.head===a.cl.tokens.indexOf(organizer)&&q.end<=organizer.start&&/^(NN|NR|NOUN|PROPN)/u.test(q.pos??''));
   if(actors.length===1){const q=actors[0],[start,end]=modifierPhrase(a.cl,q),n=f.tools.node(a.cl,'ENTITY',start,end,{token_id:q.id,syntax_token_ids:[q.id,organizer.id],argument_role:'ORGANIZATION_SUBJECT',owner:e.node_id});
    f.tools.relation(a.cl,'AGENT',e,n,[a.sid]);
   }
  }
 }
 return f;
}
