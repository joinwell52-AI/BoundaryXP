import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {graphApi} from './migration/graph-api.mjs';
// Attestation owns an explicit proposition argument, not the actions mentioned
// inside that argument. SRL + local modal/subject evidence bounds the layer.
export function propositionComplements(f){
 const {edge,retire}=graphApi(f),log=[];f.semantic_decoding.proposition_complement_ir=log;
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse)||f.semantic_decoding.temporal_predicate_ir.some(x=>x.clause_id===a.cl.id))continue;
  const ts=a.cl.tokens,frames=(a.cl.srl??[]).filter(fr=>fr.some(r=>r[1]==='PRED'&&/^(确认|confirm|confirms|confirmed|确保|ensure|ensures)$/iu.test(ts[r[2]]?.text??'')));
  if(frames.length!==1)continue;const fr=frames[0],pr=fr.find(r=>r[1]==='PRED'),p=ts[pr[2]],arg=fr.find(r=>r[1]==='ARG1'&&r[2]>=pr[3]);if(!arg)continue;
  const start=ts[arg[2]]?.start,end=ts[arg[3]-1]?.end;if(!Number.isInteger(start)||!Number.isInteger(end)||end<=start||ts.some(t=>/^(后|时)$/u.test(t.text)&&t.start>=end))continue;
  const subjects=ts.filter(t=>t.head===pr[2]&&/^nsubj$/u.test(t.dep??'')),modal=ts.filter(t=>t.head===pr[2]&&/^(aux:modal|aux)$/u.test(t.dep??''));
  if(!subjects.length){const arg0=fr.find(r=>r[1]==='ARG0'&&r[3]===r[2]+1&&r[3]<=pr[2]),token=arg0&&ts[arg0[2]];if(token&&(/^(NR|PROPN)$/u.test(token.pos??'')||/^[A-Z][A-Z0-9_-]+$/u.test(token.text)))subjects.push(token);}
  let inherited=null;
  if(!subjects.length&&/^(并|且|and\b)/iu.test(a.cl.span.quote)){
   const previous=f.analyses.filter(b=>b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.end<a.cl.span.start).at(-1);
   if(previous){const domain=f.relations.filter(r=>r.clause_id===previous.cl.id&&r.relation_type==='AGENT'&&r.state==='SUPPORTED'&&previous.events.some(e=>e.node_id===r.head_node_id&&e.metadata.modality==='REQUIRED')).map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id));
    const identities=[...new Map(domain.filter(n=>n.metadata.participant_eligibility?.eligible).map(n=>[n.surface,n])).values()];
    if(identities.length===1)inherited={node:identities[0],clause:previous,rule:'EXPLICIT_COORDINATED_ATTESTATION_SUBJECT'};
   }
  }
  if(subjects.length!==1&&!inherited)continue;const subject=subjects[0];
  if(!modal.some(t=>/^(应|必须|须|应当|must|shall)$/iu.test(t.text))&&!inherited)continue;
  retire(a,'ATTESTATION_PROPOSITION_ARGUMENT_LAYER');
  const event=f.tools.node(a.cl,'EVENT',p.start,p.end,{sense:'confirm',token_id:p.id,modality:'REQUIRED',modality_rule:'EXPLICIT_ATTESTATION_MODAL',owner:a.cl.id,discourse:a.discourse});Object.assign(event.metadata,{modality:'REQUIRED'});delete event.metadata.modality_unresolved;delete event.unresolved_ref;a.events.push(event);
  const who=inherited?.node??f.tools.node(a.cl,'ENTITY',subject.start,subject.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:subject.id,owner:a.cl.id,discourse:a.discourse});who.metadata.participant_eligibility={eligible:true,reason:inherited?.rule??'ATTESTATION_NSUBJ',source_span_ids:uniq([a.sid,...who.source_span_ids,inherited?.clause.sid]),authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),'REVIEWER']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);const agent=edge(a,'AGENT',event,who);if(inherited)agent.argument_inheritance={rule:inherited.rule,candidate_node_ids:[who.node_id],structural_path:[a.parent_structure_id,inherited.clause.cl.id,a.cl.id],source_span_ids:uniq([a.sid,inherited.clause.sid,...who.source_span_ids])};
  const object=f.tools.node(a.cl,'ENTITY',start,end,{sense:'PROPOSITION_ARGUMENT',owner:event.node_id,discourse:a.discourse,syntax_token_ids:ts.slice(arg[2],arg[3]).map(t=>t.id),argument_role:'ATTESTED_PROPOSITION',attachment_path:[a.cl.id,p.id,'ARG1']});edge(a,'PATIENT',event,object);
  const nested=f.tools.node(a.cl,'STATE',start,end,{sense:'ATTESTED_PROPOSITION_CONTENT',owner:event.node_id,discourse:a.discourse,syntactic_layer:'PROPOSITION_COMPLEMENT',argument_role:'ATTESTATION_CONTENT',attachment_path:[a.cl.id,p.id,'ARG1'],quantifier:/所有|全部|每|均|都|all|every/iu.test(object.surface)?'ALL':null,polarity:/^(不|未|no\b|not\b)/iu.test(object.surface)?'NEGATIVE':'POSITIVE'});a.local_condition_states=[nested];const owns=edge(a,'CONJUNCTION',event,nested),content=edge(a,'CONJUNCTION',nested,object);
  const inner=[];for(const row of (a.cl.srl??[]).flat().filter(r=>r[1]==='PRED'&&r[2]>=arg[2]&&r[3]<=arg[3])){const l=ts[row[2]],r=ts[row[3]-1],n=f.tools.node(a.cl,'STATE',l.start,r.end,{sense:'NESTED_PROPOSITION_PREDICATE',owner:nested.node_id,discourse:a.discourse,syntactic_layer:'PROPOSITION_COMPLEMENT',attachment_path:[a.cl.id,p.id,'ARG1',l.id],syntax_token_ids:ts.slice(row[2],row[3]).map(t=>t.id)});inner.push(edge(a,'CONJUNCTION',nested,n).relation_id);}
  log.push({clause_id:a.cl.id,event_node_id:event.node_id,argument_node_id:object.node_id,content_state_id:nested.node_id,nested_relation_ids:inner,relation_ids:[owns.relation_id,content.relation_id,...inner],source_span_ids:uniq([a.sid,...object.source_span_ids,...modal.map(t=>f.tools.span(t.start,t.end))])});
 }
 return f;
}
