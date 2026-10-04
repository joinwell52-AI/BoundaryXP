import {id,uniq} from './identity.mjs';
import {scalar} from './semantic-decoder.mjs';

// Certificates are implementation metadata. Scope/condition nodes and relation
// signatures remain the frozen v0.3 types; neither a surface noun nor a score
// supplies an antecedent, governing condition, or semantic owner.
export function deicticSetDescriptor(surface){
 const q=surface.trim();
 const m=/^(?:(任何|所有|全部|每个|每项|各|任一|任意|any(?:\s+of)?|all(?:\s+of)?|each(?:\s+of)?|every)\s*)?(上述|前述|这些|那些|这几|这两|the\s+above|these|those|both)(.*)$/iu.exec(q);
 if(!m)return null;
 const entity_type=/文件|材料|资料|files?|materials?/iu.test(m[3])?'FILE':/项目|条目|items?/iu.test(m[3])?'ENTITY':null;
 // Event/state anaphora is not an artifact declaration set. Its existing
 // typed local resolver remains responsible; do not inject file candidates.
 if(!entity_type)return null;
 const count=/([一二两三四五六七八九十]|\d+|one|two|three|four|five|six)\s*(?:份|个|项|files?|items?|材料)/iu.exec(m[3]);
 return {quantifier:/^(?:任何|任一|任意|any)/iu.test(m[1]??'')?'ANY':/^(?:每|各|each|every)/iu.test(m[1]??'')?'EACH':'ALL',marker:m[2],entity_type,requested_cardinality:m[2].toLowerCase()==='both'||m[2]==='这两'?2:count?scalar(count[1].toLowerCase()):null};
}
export function certifySourceBindings(f){
 const audit={version:'7P-COMPOSITION-013-R1',referents:[],conditions:[],consumed_before:'ELIGIBILITY',no_nearest_text_selection:true};f.semantic_decoding.source_binding=audit;
 const nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),sm=new Map(f.source_spans.map(s=>[s.span_id,s])),cp=[...f.source.raw_text];
 const sp=n=>sm.get(n.source_span_ids[0])??f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),analysis=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id),owner=n=>f.semantic_ownership.get(n.node_id);
 const active=()=>f.relations.filter(r=>r.state!=='REJECTED');
 const set=body=>{const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);return e.expr_id;};
 const condition=body=>{const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.condition_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.condition_expr_nodes.push(e);return e.expr_id;};
 function compatibleOwner(a,b){
  if(!a||!b||a.status!=='UNIQUE'||b.status!=='UNIQUE')return false;
  if(a.semantic_owner_id===b.semantic_owner_id)return true;
  return a.owner_category==='ACCEPTANCE'&&b.owner_category==='CURRENT_TASK_ROOT';
 }
 const isFile=n=>n?.node_type==='ENTITY'&&(n.metadata.literal_tag==='FILEPATH'||['FILE','COMPOSITE_ARTIFACT','FILE_CLASS'].includes(n.metadata.technical_type));
 const expression=p=>f.expression_plans.get(p.node_id)??{};
 function markUnknown(a,n,reason,ids){const existing=f.unresolved.find(u=>u.unresolved_id===n.unresolved_ref);const uid=existing?.unresolved_id??f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE',reason,uniq([n.node_id,...ids]));if(existing){existing.reason=reason;existing.related_node_ids=uniq([...existing.related_node_ids,n.node_id,...ids]);}n.state='UNRESOLVED';n.unresolved_ref=uid;return uid;}
 // Dependency-supported partitive NP: a quantifier object plus its unique
 // "of" complement. A token such as "any" is not the full referent span.
 for(const old of [...f.semantic_nodes].filter(n=>n.node_type==='ENTITY'&&/^(?:any|all|each|every)$/iu.test(n.surface))){
  const a=analysis(old);if(!a)continue;const ti=a.cl.tokens.findIndex(t=>t.start===sp(old).start&&t.end===sp(old).end);if(ti<0)continue;
  const prep=a.cl.tokens.filter(t=>t.head===ti&&t.dep==='prep'&&t.text.toLowerCase()==='of');if(prep.length!==1)continue;
  const pi=a.cl.tokens.indexOf(prep[0]),heads=a.cl.tokens.filter(t=>t.head===pi&&t.dep==='pobj'&&/^(?:NOUN|PROPN)$/u.test(t.pos));if(heads.length!==1)continue;
  const hi=a.cl.tokens.indexOf(heads[0]),parts=a.cl.tokens.filter(t=>t.head===hi&&/^(?:det|amod|compound|nummod)$/u.test(t.dep));if(!parts.some(t=>/^(?:these|those)$/iu.test(t.text)))continue;
  const lo=sp(old).start,end=Math.max(heads[0].end,...parts.map(t=>t.end));if(!deicticSetDescriptor(cp.slice(lo,end).join('')))continue;
  const n=f.tools.node(a.cl,'ENTITY',lo,end,{sense:'QUANTIFIED_PARTITIVE_REFERENT',owner:a.cl.id,discourse:a.discourse,syntactic_evidence_token_ids:[a.cl.tokens[ti].id,prep[0].id,heads[0].id,...parts.map(t=>t.id)]});nm.set(n.node_id,n);f.semantic_ownership.set(n.node_id,{...owner(old),node_id:n.node_id,source_span_ids:n.source_span_ids});
  for(const r of active().filter(r=>r.tail_node_id===old.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(r.relation_type))){r.state='REJECTED';const next=f.tools.relation(a.cl,r.relation_type,nm.get(r.head_node_id),n,[a.sid,...n.source_span_ids]);next.state='RESOLVED';next.rule_refs=uniq([...next.rule_refs,'DEPENDENCY_PARTITIVE_REFERENT_SPAN']);}
 }
 const mentions=f.semantic_nodes.filter(n=>['ENTITY','UNKNOWN_REFERENT'].includes(n.node_type)&&(active().some(r=>r.tail_node_id===n.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(r.relation_type))||n.metadata.resolution?.selected_node_ids?.length&&f.analyses.some(a=>a.bindings.some(b=>b.target===n.node_id))));
 for(const mention of mentions){
  const d=deicticSetDescriptor(mention.surface),a=analysis(mention);if(!a)continue;
  if(!d){audit.referents.push({mention_node_id:mention.node_id,status:'NOT_DEICTIC',source_span_ids:mention.source_span_ids});continue;}
  const declarations=active().filter(r=>r.state==='RESOLVED'&&['SCOPE_MEMBER','RESULT'].includes(r.relation_type)&&r.tail_node_id!==mention.node_id).filter(r=>{
   const n=nm.get(r.tail_node_id),h=nm.get(r.head_node_id),b=n&&analysis(n);
   return n?.state==='RESOLVED'&&n.node_type==='ENTITY'&&sp(n)?.end<=sp(mention)?.start&&!deicticSetDescriptor(n.surface)&&(!d.entity_type||d.entity_type!=='FILE'||isFile(n))&&compatibleOwner(owner(mention),owner(n))&&b&&(!f.expression_plans.get(h?.node_id)?.condition_expr_id)&&(!h?.metadata.modality||['REQUIRED','PERMITTED'].includes(h.metadata.modality));
  });
  const groups=new Map();for(const r of declarations){
   // A declaration is a source proposition, not every preceding literal in a
   // section. Multiple independent declarations stay competing sets.
   const n=nm.get(r.tail_node_id),b=analysis(n),key=JSON.stringify([owner(n)?.semantic_owner_id,b.scope_group??r.clause_id,r.relation_type]);
   if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);
  }
  const domains=[...groups.values()].map(rs=>({member_node_ids:uniq(rs.map(r=>r.tail_node_id)),relation_ids:rs.map(r=>r.relation_id),clause_id:rs[0].clause_id,source_span_ids:uniq(rs.flatMap(r=>r.evidence_span_ids))}));
  const countCompatible=d.requested_cardinality===null||domains.length===1&&domains[0].member_node_ids.length===d.requested_cardinality;
  const row={mention_node_id:mention.node_id,status:domains.length===1&&countCompatible&&!mention.metadata.retain_ambiguity?'CERTIFIED_REFERENT_SET':'UNRESOLVED_REFERENT_SET',quantifier:d.quantifier,requested_cardinality:d.requested_cardinality,candidate_sets:domains,selected_member_node_ids:[],source_span_ids:uniq([...mention.source_span_ids,...domains.flatMap(x=>x.source_span_ids)]),structural_path:a.discourse.structural_path,semantic_owner_id:owner(mention)?.semantic_owner_id};
  const bindings=f.analyses.flatMap(b=>b.bindings).filter(b=>b.target===mention.node_id);
  const selected=mention.metadata.resolution?.selected_node_ids??[];
  const incoming=uniq([...active().filter(r=>r.tail_node_id===mention.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(r.relation_type)).map(r=>r.relation_id),...active().filter(r=>bindings.some(b=>b.event===r.head_node_id&&b.role===r.relation_type)&&selected.includes(r.tail_node_id)).map(r=>r.relation_id)]).map(i=>f.relations.find(r=>r.relation_id===i));
  if(row.status==='UNRESOLVED_REFERENT_SET'){
   const uid=markUnknown(a,mention,mention.metadata.retain_ambiguity?'Source explicitly retains competing referent interpretations':!countCompatible?'Requested cardinality does not identify the complete declaration set; no unique subset':domains.length?'Multiple compatible declaration sets; no structurally unique referent set':'No compatible explicit antecedent set',domains.flatMap(x=>x.member_node_ids));
   row.unresolved_ref=uid;
   for(const r of incoming){r.state='UNRESOLVED';r.unresolved_ref=uid;const p=expression(nm.get(r.head_node_id));row.prior_scope_expr_ids=uniq([...(row.prior_scope_expr_ids??[]),p.scope_expr_id]);delete p.scope_expr_id;p.unresolved_ref=uid;f.expression_plans.set(r.head_node_id,p);}
  }else{
   const domain=domains[0],members=domain.member_node_ids.map(i=>nm.get(i)),b=f.analyses.find(x=>x.cl.id===domain.clause_id),lo=Math.min(...members.map(n=>sp(n).start)),hi=Math.max(...members.map(n=>sp(n).end));
   const collection=f.tools.node(b.cl,'ENTITY',lo,hi,{sense:'CERTIFIED_REFERENT_COLLECTION',owner:id(owner(mention)?.semantic_owner_id,domain.member_node_ids),discourse:b.discourse,member_node_ids:domain.member_node_ids,cardinality:members.length,quantifier:d.quantifier,antecedent_relation_ids:domain.relation_ids,referent_source_span_ids:row.source_span_ids});nm.set(collection.node_id,collection);
   const core=f.tools.relation(a.cl,'COREFERENCE',mention,collection,row.source_span_ids);core.state='RESOLVED';delete core.unresolved_ref;core.rule_refs=uniq([...core.rule_refs,'CERTIFIED_REFERENT_SET']);
   const leaves=members.map(n=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[]}));collection.metadata.member_set_expr_id=set({kind:'UNION',operand_expr_ids:leaves,source_span_ids:domain.source_span_ids,relation_ids:[]});
   const oldUnknown=mention.unresolved_ref;mention.state='RESOLVED';delete mention.unresolved_ref;if(oldUnknown)f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==oldUnknown);
   row.selected_member_node_ids=domain.member_node_ids;row.collection_node_id=collection.node_id;row.coreference_relation_id=core.relation_id;
   for(const old of incoming){old.state='REJECTED';delete old.unresolved_ref;const ev=nm.get(old.head_node_id),r=f.tools.relation(a.cl,old.relation_type,ev,collection,row.source_span_ids);r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'CERTIFIED_REFERENT_SET']);
    const p=expression(ev);row.prior_scope_expr_ids=uniq([...(row.prior_scope_expr_ids??[]),p.scope_expr_id]);p.scope_expr_id=set({kind:d.quantifier==='ANY'?'ANY':'ALL',base_entity_node_id:collection.node_id,source_span_ids:row.source_span_ids,relation_ids:[r.relation_id]});if(p.unresolved_ref===oldUnknown)delete p.unresolved_ref;f.expression_plans.set(ev.node_id,p);row.scope_expr_id=p.scope_expr_id;
   }
   collection.metadata.referent_set_certificate=structuredClone(row);
  }
  mention.metadata.referent_set_certificate=structuredClone(row);audit.referents.push(row);
 }
 const stateIds=exprId=>{const e=f.expressions.condition_expr_nodes.find(e=>e.expr_id===exprId);if(!e)return [];return uniq([e.state_node_id,...(e.operand_expr_ids??[e.operand_expr_id]).filter(Boolean).flatMap(stateIds)]);};
 for(const a of f.analyses)for(const ev of a.events.filter(e=>!e.metadata.completion&&(e.metadata.modality==='FORBIDDEN'||e.metadata.restrict||f.expression_plans.get(e.node_id)?.condition_expr_id||/dry[- ]run|(?:测试|预览|只读|模拟)模式/iu.test(cp.slice(a.cl.span.start,sp(e).start).join(''))))){
  if(ev.metadata.candidate_disposition==='REJECTED')continue;
  const p=expression(ev),prior=p.condition_expr_id,targetOwner=owner(ev),candidates=[];
  // Existing source condition relations are evidence, not an automatic binding.
  for(const r of active().filter(r=>r.tail_node_id===ev.node_id&&r.relation_type==='CONDITION_OF')){
   const n=nm.get(r.head_node_id),b=analysis(n);if(!n||!b)continue;
   const structural=b.cl.sentence_id===a.cl.sentence_id||(a.discourse.structural_path??[]).includes(b.discourse.structure_id)||b.discourse.structure_id===a.discourse.structure_id;
   const licensedMixed=a.discourse.mixed_section&&b.cl.sentence_id===a.cl.sentence_id&&targetOwner?.owner_category==='CURRENT_TASK_ROOT'&&owner(n)?.owner_category==='BACKGROUND';
   if(structural&&(compatibleOwner(targetOwner,owner(n))||licensedMixed))candidates.push({state:n,relation:r,kind:licensedMixed?'EXPLICIT_MIXED_DIRECTIVE_CONDITION_ARGUMENT':'EXPLICIT_CONDITION_RELATION',path:[...(a.discourse.structural_path??[]),b.discourse.structure_id,a.discourse.structure_id]});
  }
  // A condition header governs only its explicit document-list descendants.
  for(const b of f.analyses.filter(b=>b.condition&&b.state&&/[：:]\s*$/u.test(b.cl.span.quote))){
   const anns=f.discourse.annotations,header=anns.find(x=>x.structure_id===b.discourse.structure_id),target=anns.find(x=>x.structure_id===a.discourse.structure_id);
   let explicitIndented=false;
   if(header&&target&&header.source_span.end<=target.source_span.start){const indent=/^[ \t]*/u.exec(header.source_span.quote)[0].length,between=anns.slice(anns.indexOf(header)+1,anns.indexOf(target)+1);explicitIndented=between.length>0&&between.every(x=>!x.source_span.quote.trim()||/^[ \t]+[-*+]\s/u.test(x.source_span.quote)&&/^[ \t]*/u.exec(x.source_span.quote)[0].length>indent);}
   if(!((a.discourse.structural_path??[]).includes(b.discourse.structure_id)||explicitIndented)||!compatibleOwner(targetOwner,owner(b.state)))continue;
   const r=f.tools.relation(a.cl,'CONDITION_OF',b.state,ev,[b.sid,a.sid]);candidates.push({state:b.state,relation:r,kind:'EXPLICIT_STRUCTURAL_CONDITION_PARENT',path:[b.discourse.structure_id,...a.discourse.structural_path,a.discourse.structure_id]});
  }
  // A leading named execution mode is a local qualifier of the negative
  // predicate. Mode vocabulary is a language primitive, not an entity switch.
  const block=a.discourse.source_span??a.cl.span,prefix=cp.slice(block.start,sp(ev).start).join('');
  const m=/^\s*(?:(?:[-*+]|\d+[.)]|✅)\s*|\*{1,2}|`)*(dry[- ]run|(?:测试|预览|只读|模拟)模式)(?:`|\*{1,2})*\s*(?:时|下|期间|mode)?\s*(?:不得|禁止|不准|不能|不|do\s+not|must\s+not)?\s*$/iu.exec(prefix);
  if(m){const lo=block.start+[...prefix.slice(0,m.index+ m[0].indexOf(m[1]))].length,hi=lo+[...m[1]].length,n=f.tools.node(a.cl,'STATE',lo,hi,{sense:'LOCAL_EXECUTION_MODE',owner:a.cl.id,polarity:'POSITIVE',discourse:a.discourse});nm.set(n.node_id,n);const r=f.tools.relation(a.cl,'CONDITION_OF',n,ev,[a.sid,f.tools.span(lo,hi)]);candidates.push({state:n,relation:r,kind:'EXPLICIT_LOCAL_MODE_QUALIFIER',path:[a.discourse.structure_id,a.cl.id,ev.node_id]});}
  // Multiple ungrouped conditional clauses cannot be collapsed to whichever
  // condition the previous local parser retained last.
  const siblingConditions=f.analyses.filter(b=>b.condition&&b.state&&b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.end<=sp(ev).start&&compatibleOwner(targetOwner,owner(b.state)));
  for(const b of siblingConditions)if(!candidates.some(x=>x.state.node_id===b.state.node_id)){const r=f.tools.relation(a.cl,'CONDITION_OF',b.state,ev,[b.sid,a.sid]);candidates.push({state:b.state,relation:r,kind:'EXPLICIT_SENTENCE_CONDITION',path:[b.discourse.structure_id,a.cl.id]});}
  // A dependency-marked temporal noun qualifier may be in an earlier
  // coordinated clause of the same explicit list item. Preserve its marker
  // and argument span; neither adjacency nor the noun's spelling licenses it.
  if(!candidates.length)for(const b of f.analyses.filter(b=>b.cl.sentence_id===a.cl.sentence_id&&b.discourse.structure_id===a.discourse.structure_id&&b.cl.span.end<=sp(ev).start)){
   for(const t of b.cl.tokens.filter(t=>t.text==='时'&&/^(?:case|mark)$/u.test(t.dep)&&/^(?:LC|ADP|SCONJ)$/u.test(t.pos))){
    const h=b.cl.tokens[t.head];if(!h||!/^(?:NN|NOUN|PROPN)$/u.test(h.pos))continue;
    const lead=cp.slice(b.cl.span.start,h.start).join('');if(!/^\s*(?:[-*+]|\d+[.)]|✅|`|\*)*\s*$/u.test(lead))continue;
    const n=f.tools.node(b.cl,'STATE',h.start,t.end,{sense:'EXPLICIT_LOCAL_TEMPORAL_QUALIFIER',owner:b.cl.id,polarity:'POSITIVE',discourse:b.discourse,syntactic_evidence_token_ids:[h.id,t.id]});nm.set(n.node_id,n);
    const r=f.tools.relation(a.cl,'CONDITION_OF',n,ev,[b.sid,a.sid,...n.source_span_ids]);candidates.push({state:n,relation:r,kind:'DEPENDENCY_TEMPORAL_QUALIFIER_SAME_STRUCTURAL_ITEM',path:[b.discourse.structure_id,b.cl.id,a.cl.id]});
   }
  }
  const unique=[...new Map(candidates.map(x=>[x.state.node_id,x])).values()],priorStates=prior?stateIds(prior):[];
  // Normalized positive operands under NOT and local AND/OR operands have
  // their own IDs. Certify their exact clause/span containment in an explicit
  // condition head; never replace a signed/grouped expression by that head.
  const represents=(i,x)=>{const n=nm.get(i),s=n&&sp(n),head=sp(x.state);return i===x.state.node_id||n?.metadata.clause_id===x.state.metadata.clause_id&&s&&head&&s.start>=head.start&&s.end<=head.end&&['LOCAL_CONDITION_OPERAND','POSITIVE_STATE'].includes(n.metadata.sense);};
  const priorSupported=prior&&priorStates.length>0&&priorStates.every(i=>unique.some(x=>represents(i,x)));
  const grouped=priorSupported&&unique.every(x=>priorStates.some(i=>represents(i,x)));
  const conditionalRequired=!!prior||unique.length>0;
  const row={predicate_node_id:ev.node_id,status:!conditionalRequired?'CERTIFIED_UNCONDITIONAL':unique.length===1||grouped?'CERTIFIED_CONDITIONAL':'UNRESOLVED_CONDITION_BINDING',prior_condition_expr_id:prior??null,candidate_state_node_ids:unique.map(x=>x.state.node_id),attachment_paths:unique.map(x=>x.path),candidate_evidence:unique.map(x=>({kind:x.kind,state_node_id:x.state.node_id,relation_id:x.relation.relation_id,source_span_ids:uniq([...x.state.source_span_ids,...ev.source_span_ids])})),source_span_ids:uniq([...ev.source_span_ids,...unique.flatMap(x=>x.state.source_span_ids)]),semantic_owner_id:targetOwner?.semantic_owner_id};
  if(row.status==='CERTIFIED_CONDITIONAL'){
   p.condition_expr_id=grouped?prior:condition({op:'STATE_REF',state_node_id:unique[0].state.node_id,source_span_ids:uniq([...unique[0].state.source_span_ids,...ev.source_span_ids]),relation_ids:[unique[0].relation.relation_id]});row.condition_expr_id=p.condition_expr_id;
  }else if(row.status==='UNRESOLVED_CONDITION_BINDING'){
   p.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_SCOPE','Constraint requires a unique structurally owned condition',uniq([ev.node_id,...unique.map(x=>x.state.node_id)]));row.unresolved_ref=p.unresolved_ref;
  }
  f.expression_plans.set(ev.node_id,p);ev.metadata.condition_binding_certificate=structuredClone(row);audit.conditions.push(row);
 }
 return f;
}
