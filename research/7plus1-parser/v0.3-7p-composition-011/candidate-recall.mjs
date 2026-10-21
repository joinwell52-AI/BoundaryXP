import {id,uniq} from './identity.mjs';
import {modifierPhrase,modalityFor,isNominal} from './syntax-mechanisms.mjs';
import {scalar} from './semantic-decoder.mjs';
import {MODALS,COMPARATORS,SUPPORT_VERBS} from './grammar.mjs';
import {imperativePrefix,negativeImperativePrefix,directiveLayer} from './instruction-syntax.mjs';
const verbal=t=>/^(VV|VERB)$/u.test(t?.pos??'');
const controller=t=>/^(使|让|令|make|makes|let|lets|cause|causes)$/iu.test(t?.lemma??t?.text??'');
const operators=/^(包括|包含|是|有|在|须|需|必须|应|应该|可以|允许|不得|禁止|需要|要求|be|have|must|shall|may|can)$/iu;
const roleFor=t=>/^(生成|创建|写出|generate|create|produce)$/iu.test(t.lemma??t.text)?'RESULT':/^(发送|提交|send|submit)$/iu.test(t.lemma??t.text)?'THEME':'PATIENT';
export function graphSnapshot(f){return structuredClone({nodes:f.semantic_nodes.map(n=>({node_id:n.node_id,node_type:n.node_type,surface:n.surface,source_span_ids:[...n.source_span_ids],state:n.state,modality:n.metadata.modality,clause_id:n.metadata.clause_id,technical_type:n.metadata.technical_type,participant_eligibility:n.metadata.participant_eligibility,embedded_frame_id:n.metadata.embedded_frame_id})),relations:f.relations,set_expressions:f.expressions.set_expr_nodes});}
export function materializeCandidates(f){
 const {node,span,relation,unknown}=f.tools,cp=[...f.source.raw_text],slice=(s,e)=>cp.slice(s,e).join(''),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const audit={version:'7P-REPAIR-005',before:graphSnapshot(f),predicates:[],frames:[],operand_sets:[],literal_precedence:[],excluded:[]};f.semantic_decoding.candidate_recall=audit;
 const set=body=>{const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);return e.expr_id;};
 const entity=(a,start,end,metadata={})=>{const prior=f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&sp(n).start===start&&sp(n).end===end);const n=prior??node(a.cl,'ENTITY',start,end,{sense:'SYNTACTIC_ARGUMENT',owner:a.cl.id,discourse:a.discourse,...metadata});Object.assign(n.metadata,metadata);return n;};
 function precedence(n,reason,evidence){const before=structuredClone(n.metadata.participant_eligibility??null);n.metadata.participant_eligibility={eligible:false,reason,source_span_ids:uniq([...n.source_span_ids,...evidence])};delete n.metadata.participant_roles;if(n.metadata.literal_tag==='PERSON')delete n.metadata.literal_tag;audit.literal_precedence.push(structuredClone({node_id:n.node_id,before,after:n.metadata.participant_eligibility,technical_type:n.metadata.technical_type,evidence_span_ids:evidence}));}
 for(const n of f.semantic_nodes.filter(n=>n.node_type==='ENTITY')){const s=sp(n),typed=f.nlp_signals.literals.filter(l=>l.span.start===s.start&&l.span.end===s.end&&['FILE','PATH','VERSION','COMMIT','REFERENCE','URI'].includes(l.type)),symbol=/^[A-Za-z_$][\w$]*(?:[_.:][A-Za-z_$][\w$]*)+(?:\(\))?$/u.test(n.surface);
  if(typed.length||symbol||['SYMBOL','FILE','DIRECTORY','COMPOSITE_ARTIFACT'].includes(n.metadata.technical_type)){n.metadata.technical_type??=typed[0]?.type??'SYMBOL';precedence(n,'PROTECTED_TECHNICAL_TYPE_PRECEDES_NER',[...n.source_span_ids]);}}
 for(const a of f.analyses){
  const ts=a.cl.tokens,domain=a.discourse.kind;
  if(!['CURRENT_TASK','OUTPUT_CONTENT','DELIVERABLE_SPEC'].includes(domain)||a.structure_only||a.condition||a.basis||a.scope||a.state||a.discourse.interrogative_not_asserted){audit.excluded.push({clause_id:a.cl.id,domain,reason:'EXISTING_DISCOURSE_OR_STRUCTURAL_GATE',source_span_ids:[a.sid]});continue;}
  const quoted=[...a.cl.span.quote.matchAll(/“[^”]*”|「[^」]*」|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/gu)].map(m=>({start:a.cl.span.start+[...a.cl.span.quote.slice(0,m.index)].length,end:a.cl.span.start+[...a.cl.span.quote.slice(0,m.index+m[0].length)].length}));
  const grammatical=[...MODALS,...COMPARATORS].flatMap(([word])=>{const out=[];let i=a.cl.span.quote.indexOf(word);while(i>=0){const start=a.cl.span.start+[...a.cl.span.quote.slice(0,i)].length;out.push({start,end:start+[...word].length});i=a.cl.span.quote.indexOf(word,i+word.length);}return out;});
  const srlPred=new Set((a.cl.srl??[]).flatMap(row=>row.filter(x=>x[1]==='PRED').flatMap(x=>ts.slice(x[2],x[3]))));
  const candidates=ts.filter((t,i)=>{if([...quoted,...grammatical].some(q=>t.start>=q.start&&t.end<=q.end)||operators.test(t.text))return false;const alt=Object.values(a.cl.pos_alternatives??{}).filter(v=>/^(v|vv|verb)$/iu.test(v[i]??'')).length;return srlPred.has(t)||verbal(t)&&(/^(root|ccomp|xcomp|conj)$/iu.test(t.dep??'')||controller(ts[t.head])&&/^(dobj|obj|dep)$/u.test(t.dep??''))||alt>=2&&controller(ts[t.head])&&/^(dobj|obj|dep)$/u.test(t.dep??'')||alt&&/^(ccomp|xcomp)$/u.test(t.dep??'');});
  const localEvents=new Map();
  for(const t of candidates){
   const owner=a.events.find(e=>e.metadata.restriction_kind==='NO_CHANGE'&&sp(e).start<=t.start&&sp(e).end>=t.end);
   if(owner){audit.excluded.push({clause_id:a.cl.id,token_id:t.id,reason:'PREDICATE_ALREADY_OWNED_BY_INVARIANCE_FRAME',owner_node_id:owner.node_id,source_span_ids:owner.source_span_ids});continue;}
   let e=a.events.find(e=>e.metadata.token_id===t.id||e.metadata.predicate_owner_token_id===t.id||sp(e).start===t.start&&sp(e).end===t.end);const before=!!e;
   if(!e){const argumentOwner=f.semantic_nodes.find(n=>n.metadata.clause_id===a.cl.id&&n.node_type==='ENTITY'&&sp(n).start<=t.start&&sp(n).end>=t.end),purpose=f.semantic_nodes.find(n=>n.metadata.clause_id===a.cl.id&&n.metadata.purpose_only&&sp(n).start<=t.start&&sp(n).end>=t.end),recipientPurpose=f.relations.some(r=>r.clause_id===a.cl.id&&r.relation_type==='RECIPIENT'&&r.state==='RESOLVED'&&sp(f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)).end<=t.start)&&!ts.some(q=>q.start<t.start&&q.dep==='cc'),auxiliary=!controller(t)&&!controller(ts[t.head])&&(a.quantity_target||a.events.some(e=>e.metadata.completion)||SUPPORT_VERBS.includes(t.text)||argumentOwner||purpose||recipientPurpose||/^(acl|advcl|compound|nmod:prep)/u.test(t.dep??'')||!verbal(t));
    const prefix=slice(a.cl.span.start,t.start),modal=modalityFor(a.cl,t,t.start),layer=directiveLayer(a.discourse,t.start),imperative=layer.allowed&&!auxiliary&&!controller(t)&&verbal(t)&&/^root$/iu.test(t.dep??'')&&imperativePrefix(prefix),negative=layer.allowed&&!auxiliary&&!controller(t)&&verbal(t)&&/^root$/iu.test(t.dep??'')&&negativeImperativePrefix(prefix,t.text);
    e=node(a.cl,'EVENT',t.start,t.end,{sense:t.lemma??t.text,owner:a.cl.id,token_id:t.id,modality:auxiliary?'UNSTATED':modal?.ambiguous?'UNSTATED':modal?.modality??(negative?'FORBIDDEN':imperative?'REQUIRED':'UNSTATED'),discourse:a.discourse,candidate_origin:'EMBEDDED_PREDICATE_MATERIALIZATION',candidate_layer:auxiliary?'AUXILIARY_CONTEXT':'ACTION_CANDIDATE',context_owner_id:argumentOwner?.node_id??purpose?.node_id,...(imperative||negative?{modality_source_span_ids:[a.sid],modality_rule:negative?'EXPLICIT_NEGATIVE_IMPERATIVE':'EXPLICIT_DOCUMENT_IMPERATIVE'}:{})});if(!auxiliary)a.events.push(e);}
   if(e.metadata.modality==='UNSTATED'&&e.metadata.candidate_layer!=='AUXILIARY_CONTEXT'&&!e.metadata.purpose_only&&!e.metadata.conformance_target_node_ids&&!f.relations.some(r=>r.head_node_id===e.node_id&&r.relation_type==='CONFORMS_TO'&&r.state!=='REJECTED')&&!controller(t)&&verbal(t)&&/^root$/iu.test(t.dep??'')){
    const modal=modalityFor(a.cl,t,t.start),prefix=slice(a.cl.span.start,t.start),layer=directiveLayer(a.discourse,t.start),imperative=layer.allowed&&imperativePrefix(prefix),negative=layer.allowed&&negativeImperativePrefix(prefix,t.text);
    if(!modal?.ambiguous&&(modal||imperative||negative)){
     e.metadata.modality=modal?.modality??(negative?'FORBIDDEN':'REQUIRED');e.metadata.modality_source_span_ids=modal?.start!==undefined?[span(modal.start,modal.end)]:[a.sid];e.metadata.modality_rule=modal?'EXPLICIT_LOCAL_MODAL':negative?'EXPLICIT_NEGATIVE_IMPERATIVE':'EXPLICIT_DOCUMENT_IMPERATIVE';
     const retired=e.metadata.modality_unresolved;if(retired)f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==retired);delete e.metadata.modality_unresolved;
     (audit.modality_closure??=[]).push({event_node_id:e.node_id,retired_unresolved_id:retired,modality:e.metadata.modality,rule:e.metadata.modality_rule,source_span_ids:e.metadata.modality_source_span_ids});
    }
   }
   localEvents.set(t,e);audit.predicates.push({node_id:e.node_id,clause_id:a.cl.id,token_id:t.id,was_present:before,evidence_kind:srlPred.has(t)?'SRL_PRED':controller(ts[t.head])?'CONTROL_COMPLEMENT':'VERBAL_DEPENDENCY',dependency:t.dep,pos:t.pos,source_span_ids:[span(t.start,t.end),a.sid],structural_path:[...a.discourse.structural_path,a.cl.id,t.id,e.node_id]});
  }
  function operands(t){const nominal=q=>isNominal(q)||f.nlp_signals.literals.some(l=>l.span.start===q.start&&l.span.end===q.end),ti=ts.indexOf(t),srl=(a.cl.srl??[]).filter(row=>row.some(x=>x[1]==='PRED'&&x[2]===ti)).flatMap(row=>row.filter(x=>x[1]==='ARG1')),heads=ts.filter(q=>q.head===ti&&/^(dobj|obj)$/u.test(q.dep??'')&&nominal(q));
   const ranges=srl.length?srl.map(x=>[x[2],x[3],'SRL_ARG1']):heads.map(q=>{const [s,e]=modifierPhrase(a.cl,q),group=new Set([q]);let more=true;while(more){more=false;for(const n of ts)if(n.dep==='conj'&&nominal(n)&&group.has(ts[n.head])&&!group.has(n)){group.add(n);more=true;}}return[ts.findIndex(x=>x.start===s),Math.max(ts.findIndex(x=>x.end===e),...[...group].map(x=>ts.indexOf(x)))+1,'DEPENDENCY_OBJECT'];});
   const groups=[];for(const [lo,hi,kind]of ranges){const local=ts.slice(lo,hi);if(!local.length||local.some(q=>verbal(q)))continue;
    const pairs=local.filter(q=>q.dep==='conj'&&local.includes(ts[q.head])&&nominal(q)&&nominal(ts[q.head]));
    const members=uniq(pairs.flatMap(q=>[q.id,ts[q.head].id])).map(i=>ts.find(q=>q.id===i)).sort((x,y)=>x.start-y.start);
    const cc=local.filter(q=>q.dep==='cc'||/^(CC|CCONJ)$/u.test(q.pos??''));
    if(members.length>1&&cc.length){const quant=local.find(q=>/^(CD|NUM)$/u.test(q.pos??'')),count=quant?scalar(quant.text):null;
     if(count!=null&&count!==members.length){const e=localEvents.get(t),p=f.expression_plans.get(e.node_id)??{};p.unresolved_ref=unknown(a.cl,'UNRESOLVED_QUANTIFICATION','Coordinated candidate cardinality differs from explicit count',[e.node_id]);f.expression_plans.set(e.node_id,p);continue;}
     const common=local.filter(q=>isNominal(q)&&!members.includes(q)&&q.head===ti),objects=members.map(q=>{const [start,end]=modifierPhrase(a.cl,q);return entity(a,start,end,{token_id:q.id,technical_type:common.length?'TYPED_SOURCE_MEMBER':undefined,shared_head_span_ids:common.map(n=>span(n.start,n.end))});});
     if(common.length)objects.forEach(n=>precedence(n,'EXPLICIT_OBJECT_COORDINATION_PRECEDES_NER',[a.sid,...common.map(q=>span(q.start,q.end))]));
     groups.push({objects,kind,operator:cc.some(q=>/^(or|或|或者)$/iu.test(q.text))?'ANY':'UNION',source_span_ids:[span(local[0].start,local.at(-1).end)],shared_head_span_ids:common.map(q=>span(q.start,q.end))});
    }else{const [s,e]=[local[0].start,local.at(-1).end];if(local.some(q=>/^(CC|CCONJ)$/u.test(q.pos??''))){unknown(a.cl,'UNRESOLVED_RELATION','Coordination lacks a complete dependency member set',[localEvents.get(t).node_id]);continue;}const target=/^(其|它|该|上述|it|this|that|they)\b/iu.test(slice(s,e))?node(a.cl,'UNKNOWN_REFERENT',s,e,{owner:localEvents.get(t).node_id,discourse:a.discourse}):entity(a,s,e);groups.push({objects:[target],kind,operator:'ITEM',source_span_ids:[span(s,e)],shared_head_span_ids:[]});}
   }return groups;
  }
  const controllers=candidates.filter(controller);
  const descendants=t=>{let p=t,seen=new Set();while(!seen.has(p)){seen.add(p);if(controllers.includes(p))return p;const next=ts[p.head];if(!next||next===p)break;p=next;}return null;};
  for(const control of controllers){
   const ce=localEvents.get(control),embedded=candidates.filter(t=>t!==control&&descendants(t)===control),prev=f.analyses.filter(p=>p.cl.span.end<a.cl.span.start&&p.cl.sentence_id===a.cl.sentence_id&&p.discourse.domain_id===a.discourse.domain_id&&p.discourse.owner_structure_id===a.discourse.owner_structure_id).flatMap(p=>p.events).filter(e=>['REQUIRED','PERMITTED'].includes(e.metadata.modality));
   const nominal=t=>isNominal(t)||f.nlp_signals.literals.some(l=>l.span.start===t.start&&l.span.end===t.end);
   const controlled=ts.filter(t=>!embedded.includes(t)&&nominal(t)&&(embedded.some(v=>t.head===ts.indexOf(v)&&/^(nsubj|compound:nn|nmod:assmod)$/u.test(t.dep??''))||t.head===ts.indexOf(control)&&/^(dobj|obj|nsubj)$/u.test(t.dep??'')));
   const contexts=controlled.map(t=>{const [s,e]=modifierPhrase(a.cl,t);return /^(他|她|它|其|某人|未知|someone|it|they)/iu.test(slice(s,e))?node(a.cl,'UNKNOWN_REFERENT',s,e,{owner:ce.node_id,discourse:a.discourse}):entity(a,s,e,{token_id:t.id});});
   const modal=modalityFor(a.cl,control,control.start),explicit=modal&&!modal.ambiguous?modal.modality:null,initial=!slice(a.cl.span.start,control.start).trim();
   const valid=embedded.length>0&&contexts.length===1&&contexts[0].state==='RESOLVED'&&!['FORBIDDEN','NOT_REQUIRED'].includes(explicit)&&(explicit||initial||prev.length===1),frame={frame_id:id(f.source.sha256,'controlled-frame',a.cl.id,ce.node_id),frame_kind:'CAUSATIVE_OR_CONTROLLED',controller_event_id:ce.node_id,embedded_event_ids:embedded.map(t=>localEvents.get(t).node_id),controlled_subject_or_context_ids:contexts.map(n=>n.node_id),governing_action_ids:prev.length===1?[prev[0].node_id]:[],governing_target_ids:prev.length===1?f.relations.filter(r=>r.head_node_id===prev[0].node_id&&r.state==='RESOLVED'&&['PATIENT','THEME'].includes(r.relation_type)).map(r=>r.tail_node_id):[],governing_clause_id:a.cl.id,source_span_ids:uniq([a.sid,...contexts.flatMap(n=>n.source_span_ids),...(prev.length===1?prev[0].source_span_ids:[])]),structural_path:[...a.discourse.structural_path,a.cl.id,ce.node_id],state:valid?'RESOLVED':'UNRESOLVED',modality:valid?(explicit??(prev.length===1?prev[0].metadata.modality:'REQUIRED')):'UNSTATED'};
   if(!valid)frame.unresolved_ref=unknown(a.cl,'UNRESOLVED_RELATION','Controlled frame lacks unique subject, embedded predicate or licensed governing action',uniq([ce.node_id,...frame.embedded_event_ids,...frame.controlled_subject_or_context_ids]));
   ce.metadata.candidate_control_frame=frame.frame_id;frame.embedded_event_ids.forEach(nid=>{const e=f.semantic_nodes.find(n=>n.node_id===nid);e.metadata.embedded_frame_id=frame.frame_id;e.metadata.controlled_context_ids=frame.controlled_subject_or_context_ids;if(valid&&e.metadata.modality==='UNSTATED'){e.metadata.modality=frame.modality;e.metadata.modality_source_span_ids=frame.source_span_ids;const u=e.metadata.modality_unresolved;f.unresolved=f.unresolved.filter(x=>x.unresolved_id!==u);delete e.metadata.modality_unresolved;}if(!valid){const p=f.expression_plans.get(nid)??{};p.unresolved_ref=frame.unresolved_ref;f.expression_plans.set(nid,p);}});audit.frames.push(frame);
  }
  for(const [t,e]of localEvents){const frame=audit.frames.find(fr=>fr.embedded_event_ids?.includes(e.node_id)),groups=(e.metadata.candidate_origin||frame)&&e.metadata.candidate_layer!=='AUXILIARY_CONTEXT'?operands(t):[];
   const af={frame_id:id(e.node_id,'argument-frame'),frame_kind:'MULTI_ARGUMENT',event_node_id:e.node_id,primary_target_context_ids:frame?.controlled_subject_or_context_ids??[],source_input_ids:[],result_ids:[],recipient_ids:[],basis_ids:[],condition_ids:[],governing_action_ids:frame?.governing_action_ids??[],governing_target_ids:frame?.governing_target_ids??[],governing_clause_id:a.cl.id,source_span_ids:[a.sid,...e.source_span_ids],structural_path:[...a.discourse.structural_path,a.cl.id,e.node_id],state:'CANDIDATE'};
   // Existing certified local arguments remain authoritative; materialize only missing
   // endpoints and explicit coordinated sets. No global predicate-by-noun product.
   for(const g of groups){if(controller(t))continue;const role=roleFor(t),old=f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='RESOLVED'&&['PATIENT','THEME','RESULT'].includes(r.relation_type));
    if(old.length&&!g.objects.every(n=>old.some(r=>r.tail_node_id===n.node_id))&&!e.metadata.candidate_origin&&!frame)continue;
    for(const r of old)if(!g.objects.some(n=>n.node_id===r.tail_node_id)){r.state='REJECTED';r.rule_refs.push('005_STRONG_LOCAL_ARGUMENT_FRAME');}
    const rs=g.objects.map(n=>relation(a.cl,role,e,n,[...g.source_span_ids,...g.shared_head_span_ids]));
    if(g.objects.some(n=>n.node_type==='UNKNOWN_REFERENT')){af.unresolved_ref=g.objects.find(n=>n.unresolved_ref)?.unresolved_ref;af.state='UNRESOLVED';continue;}
    const leaves=g.objects.map((n,i)=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[rs[i].relation_id]}));
    // ANY in the contract takes an entity base, not a list: preserve alternative
    // member candidates unresolved rather than forge a group entity.
    let expr=leaves[0];if(g.operator==='UNION')expr=set({kind:'UNION',operand_expr_ids:leaves,source_span_ids:g.source_span_ids,relation_ids:rs.map(r=>r.relation_id)});
    if(g.operator==='ANY'){af.unresolved_ref=unknown(a.cl,'UNRESOLVED_SCOPE','Disjunctive operand candidate needs a supported alternative-set contract',[e.node_id,...g.objects.map(n=>n.node_id)]);af.state='UNRESOLVED';}
    const p=f.expression_plans.get(e.node_id)??{};p.scope_expr_id=expr;if(af.unresolved_ref)p.unresolved_ref=af.unresolved_ref;f.expression_plans.set(e.node_id,p);
    af[role==='RESULT'?'result_ids':'source_input_ids'].push(...g.objects.map(n=>n.node_id));af.source_or_operand_expr_id=expr;
    audit.operand_sets.push({event_node_id:e.node_id,operator:g.operator,member_node_ids:g.objects.map(n=>n.node_id),expr_id:expr,source_span_ids:g.source_span_ids,shared_head_span_ids:g.shared_head_span_ids,evidence_kind:g.kind,state:af.unresolved_ref?'UNRESOLVED':'RESOLVED',structural_path:af.structural_path});
   }
   const rows=f.relations.filter(r=>r.head_node_id===e.node_id&&r.state!=='REJECTED');for(const [role,slot]of Object.entries({RESULT:'result_ids',RECIPIENT:'recipient_ids',BASIS:'basis_ids'}))af[slot]=uniq([...af[slot],...rows.filter(r=>r.relation_type===role).map(r=>r.tail_node_id)]);af.condition_ids=f.relations.filter(r=>r.tail_node_id===e.node_id&&r.relation_type==='CONDITION_OF'&&r.state!=='REJECTED').map(r=>r.head_node_id);
   e.metadata.candidate_argument_frame=af.frame_id;audit.frames.push(af);
  }
 }
 for(const n of f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&/^[A-Za-z_$][\w$]*(?:[_.:][A-Za-z_$][\w$]*)+$/u.test(n.surface)))if(n.metadata.participant_eligibility?.eligible!==false){n.metadata.technical_type='SYMBOL';precedence(n,'PROTECTED_TECHNICAL_TYPE_PRECEDES_NER',n.source_span_ids);}
 audit.after_materialization=graphSnapshot(f);audit.edge_input=graphSnapshot(f);return f;
}
