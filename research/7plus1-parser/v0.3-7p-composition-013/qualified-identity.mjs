import {id,uniq} from './identity.mjs';import {scalar} from './semantic-decoder.mjs';

// Source operands, syntactic qualification and an already certified owner are
// required together. Names and literal type alone never supply a boundary role.
export function certifyQualifiedIdentity(f){
 const audit={version:'7P-COMPOSITION-013-R2',members:[],protected:[],references:[],consumed_before:'ELIGIBILITY'};f.semantic_decoding.qualified_identity=audit;
 const nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),sm=new Map(f.source_spans.map(s=>[s.span_id,s])),cp=[...f.source.raw_text],sp=n=>sm.get(n.source_span_ids[0]);
 const set=body=>{const e={expr_id:id(f.source.sha256,'qualified-set',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);return e.expr_id;};
 const active=()=>f.relations.filter(r=>r.state!=='REJECTED');
 const nodeFor=l=>f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&sp(n)?.start===l.span.start&&sp(n)?.end===l.span.end);
 for(const l of f.nlp_signals.literals.filter(l=>['PATH','FILE','IDENTIFIER','VERSION','COMMIT','REFERENCE'].includes(l.type))){
  const n=nodeFor(l)??f.semantic_nodes.find(n=>n.node_type==='REFERENCE'&&sp(n)?.start===l.span.start&&sp(n)?.end===l.span.end);if(!n)continue;
  const owner=f.semantic_ownership.get(n.node_id),roles=active().filter(r=>r.tail_node_id===n.node_id&&['SCOPE_MEMBER','PATIENT','THEME','RESULT','FORBIDS','RESTRICTS','BASIS'].includes(r.relation_type));
  const rec={node_id:n.node_id,source_literal_id:l.id,source_span_ids:n.source_span_ids,complete_protected_span:l.span,semantic_owner_id:owner?.semantic_owner_id,status:owner?.status==='UNIQUE'?'CERTIFIED':'UNRESOLVED',qualified_identity:owner?.status==='UNIQUE'?id(f.source.sha256,'qualified-artifact',owner.semantic_owner_id,l.type,l.span.quote):null,role_relation_ids:roles.map(r=>r.relation_id),before_after:n.metadata.role_transition??null,lexical_role_projection:false};n.metadata.qualified_identity=rec;audit.protected.push(rec);
  if(n.node_type==='REFERENCE'){audit.references.push({...rec,basis_relation_ids:roles.filter(r=>r.relation_type==='BASIS').map(r=>r.relation_id),basis_from_identifier_alone:false});continue;}
  // A wildcard is a source-defined collection; it is not expanded by reading
  // the filesystem and the complete protected path is never replaced by a suffix.
  if(['PATH','FILE'].includes(l.type)&&/[*?]/u.test(l.span.quote)&&owner?.status==='UNIQUE'){
   n.metadata.collection={...(n.metadata.collection??{}),member_kind:'FILE',source_pattern:l.span.quote,enumerated:false};
   for(const r of roles.filter(r=>r.state==='RESOLVED'&&['PATIENT','THEME','FORBIDS','RESTRICTS','SCOPE_MEMBER'].includes(r.relation_type))){const expr=set({kind:'ALL',base_entity_node_id:n.node_id,source_span_ids:uniq([...n.source_span_ids,...r.evidence_span_ids]),relation_ids:[r.relation_id]});if(r.relation_type==='SCOPE_MEMBER')f.relation_scope_plans.set(r.relation_id,expr);else{
     const old=f.expression_plans.get(r.head_node_id)??{},prior=f.expressions.set_expr_nodes.find(s=>s.expr_id===old.scope_expr_id);if(!prior||prior.kind==='ITEM'&&prior.entity_node_id===n.node_id)f.expression_plans.set(r.head_node_id,{...old,scope_expr_id:expr});
    }rec.collection_expr_ids=uniq([...(rec.collection_expr_ids??[]),expr]);}
  }
 }
 for(const a of f.analyses){
  const literals=f.nlp_signals.literals.filter(l=>l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end),files=literals.filter(l=>['PATH','FILE'].includes(l.type)),symbols=literals.filter(l=>l.type==='IDENTIFIER');
  if(files.length!==1||symbols.length<1||!/(?:方法|函数|methods?|functions?)\s*$/iu.test(a.cl.span.quote))continue;
  const file=nodeFor(files[0]),members=symbols.map(nodeFor);if(!file||members.some(n=>!n))continue;
  const marker=a.cl.tokens.find(t=>t.text==='中'&&t.dep==='case'&&a.cl.tokens[t.head]?.start===files[0].span.start);if(!marker)continue;
  if(symbols.some(l=>l.span.start<marker.end))continue;
  const between=cp.slice(symbols[0].span.start,symbols.at(-1).span.end).join('');if(!/^(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*(?:、|,|，|和|与|and)?\s*)+$/iu.test(between))continue;
  const count=/([一二两三四五六七八九十]|\d+|one|two|three|four|five|six)\s*(?:个\s*)?(?:方法|函数|methods?|functions?)/iu.exec(a.cl.span.quote),requested=count?scalar(count[1].toLowerCase()):null;
  const governors=a.events.filter(e=>['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality)&&active().some(r=>r.head_node_id===e.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(r.relation_type)));
  if(governors.length!==1)continue;const ev=governors[0],owner=f.semantic_ownership.get(ev.node_id);if(!owner||owner.status!=='UNIQUE')continue;
  if(f.semantic_decoding.cross_instruction_identity.aggregates.some(r=>r.state==='CERTIFIED'&&r.governing_event_id===ev.node_id))continue;
  const rec={record_id:id(f.source.sha256,'qualified-members',a.cl.id,ev.node_id),status:'UNRESOLVED',predicate_node_id:ev.node_id,owner_file_node_ids:[file.node_id],member_node_ids:members.map(n=>n.node_id),requested_cardinality:requested,source_span_ids:uniq([a.sid,...file.source_span_ids,...members.flatMap(n=>n.source_span_ids)]),attachment_path:[...a.discourse.structural_path,a.discourse.structure_id,a.cl.id,file.node_id],semantic_owner_id:owner.semantic_owner_id};audit.members.push(rec);
  if(requested!==null&&requested!==members.length||new Set(members.map(n=>n.surface)).size!==members.length){rec.reason='EXPLICIT_MEMBER_CARDINALITY_NOT_CERTIFIABLE';rec.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_SCOPE',rec.reason,rec.member_node_ids);f.expression_plans.set(ev.node_id,{...f.expression_plans.get(ev.node_id),unresolved_ref:rec.unresolved_ref});continue;}
  if(members.some(n=>f.semantic_ownership.get(n.node_id)?.semantic_owner_id!==owner.semantic_owner_id)||f.semantic_ownership.get(file.node_id)?.semantic_owner_id!==owner.semantic_owner_id){rec.reason='QUALIFIED_MEMBER_OWNER_NOT_UNIQUE';continue;}
  const role=ev.metadata.modality==='FORBIDDEN'?'FORBIDS':'PATIENT',rs=[];
  for(const n of members){n.metadata.technical_type='SYMBOL';n.metadata.structural_ownership={file_node_id:file.node_id,source_span_ids:uniq([...file.source_span_ids,...n.source_span_ids]),structural_path:a.discourse.structural_path};n.metadata.qualified_member_identity=id(f.source.sha256,'qualified-member',owner.semantic_owner_id,file.surface,n.surface);const r=f.tools.relation(a.cl,role,ev,n,rec.source_span_ids);r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'QUALIFIED_MEMBER_IDENTITY']);rs.push(r);}
  // Replace only partial local method-list arguments. Keep the separately
  // typed file and RESULT role; file ownership is not a new member action.
  for(const r of active().filter(r=>r.head_node_id===ev.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(r.relation_type))){const n=nm.get(r.tail_node_id),s=n&&sp(n);if(s&&s.start>=symbols[0].span.start&&s.end<=a.cl.span.end&&!members.some(n=>n.node_id===r.tail_node_id))r.state='REJECTED';}
  const leaves=members.map((n,i)=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:uniq([...file.source_span_ids,...n.source_span_ids]),relation_ids:[rs[i].relation_id]}));rec.member_set_expr_id=set({kind:'UNION',operand_expr_ids:leaves,source_span_ids:rec.source_span_ids,relation_ids:rs.map(r=>r.relation_id)});rec.relation_ids=rs.map(r=>r.relation_id);rec.status='CERTIFIED';ev.metadata.qualified_member_certificate=rec;f.expression_plans.set(ev.node_id,{...f.expression_plans.get(ev.node_id),scope_expr_id:rec.member_set_expr_id});
 }
 return f;
}
