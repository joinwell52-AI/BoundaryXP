import{ id,uniq }from './identity.mjs';
import{ boundaryDomain }from './discourse.mjs';
import{ graphSnapshot }from './candidate-recall.mjs';

// Identity evidence is structural/symbolic. This stage neither interprets a
// function body nor infers the behavior of a helper from its name.
const filePattern=/(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.(?:py|[cm]?js|ts|tsx|java|rs|go|cpp|h)\b/gu;
const symbolPattern=/`([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)`/gu;
export function closeInstructionIdentities(f){
 const {node,relation,span,unknown}=f.tools,cp=[...f.source.raw_text],anns=f.discourse.annotations;
 const audit={version:'7P-REPAIR-007',before:graphSnapshot(f),aggregates:[],continuity:[],call_bindings:[],compositions:[]};f.semantic_decoding.cross_instruction_identity=audit;
 const nodes=()=>new Map(f.semantic_nodes.map(n=>[n.node_id,n])),annFor=n=>n.metadata.discourse;
 const source=(s,e)=>span(s,e),offset=(base,q,i)=>base+[...q.slice(0,i)].length;
 const sectionRoot=a=>a.structural_path.filter(i=>/^\s*#\s+/u.test(anns.find(x=>x.structure_id===i)?.source_span.quote??''))[0]??'document';
 const compatible=(a,b)=>a&&b&&sectionRoot(a)===sectionRoot(b)&&boundaryDomain(a)&&boundaryDomain(b);
 const ownerHints=a=>uniq(a.structural_path.flatMap(i=>[...(anns.find(x=>x.structure_id===i)?.source_span.quote??'').matchAll(filePattern)].map(m=>m[0])));
 function aFor(n){return f.analyses.find(a=>a.cl.id===n.metadata.clause_id);}
 function endpoint(a,s,e,kind){let n=f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&n.surface===cp.slice(s,e).join('')&&n.source_span_ids.some(i=>{const p=f.source_spans.find(p=>p.span_id===i);return p.start===s&&p.end===e;}));
  if(!n)n=node(a.cl,'ENTITY',s,e,{sense:'IDENTITY_OPERAND',discourse:a.discourse});
  n.metadata.technical_type=kind;n.metadata.participant_eligibility={eligible:false,reason:'TYPED_IDENTITY_OPERAND',source_span_ids:n.source_span_ids};return n;
 }
 function expression(body){const e={expr_id:id(f.source.sha256,'identity-set',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);return e.expr_id;}
 function link(a,type,h,t,r){const e=relation(a.cl,type,h,t,r.source_span_ids);if(!e)return null;e.state='RESOLVED';delete e.unresolved_ref;e.rule_refs=uniq([...e.rule_refs,'CROSS_INSTRUCTION_IDENTITY',r.identity_link_id]);e.evidence_span_ids=uniq([...e.evidence_span_ids,...r.source_span_ids]);r.relation_ids.push(e.relation_id);return e;}
 function record(kind,a,b,sids){return{identity_link_id:id(f.source.sha256,kind,a,b),kind,state:'UNRESOLVED',source_span_ids:uniq(sids),structural_paths:[],relation_ids:[]};}
 // Only explicit backtick-enumerated method/function targets with one named
 // file owner qualify. The predicate must already be an admissible task action.
 for(const ann of anns){if(!boundaryDomain(ann)||ann.heading_marker_span)continue;const q=ann.source_span.quote;
  if(!/(?:方法|函数|\bmethods?\b|\bfunctions?\b)/iu.test(q)||!/(?:修(?:改)?|更新|modify|update|change)/iu.test(q))continue;
  const files=[...q.matchAll(filePattern)],symbols=[...q.matchAll(symbolPattern)];if(files.length!==1||symbols.length<2)continue;
  const list=q.slice(symbols[0].index,symbols.at(-1).index+symbols.at(-1)[0].length);
  if(!/^(?:`[A-Za-z_$][\w$.]*`\s*(?:\/|、|,|\band\b|和|与)?\s*)+$/iu.test(list))continue;
  const events=f.semantic_nodes.filter(n=>n.node_type==='EVENT'&&n.metadata.discourse?.structure_id===ann.structure_id&&/^(?:修|修改|更新|modify|update|change)$/iu.test(n.surface)&&['REQUIRED','PERMITTED'].includes(n.metadata.modality));
  if(events.length!==1)continue;const governor=events[0],a=aFor(governor);if(!a||f.expression_plans.get(governor.node_id)?.condition_expr_id)continue;
  const targetRelations=f.relations.filter(r=>r.head_node_id===governor.node_id&&r.state==='RESOLVED'&&['PATIENT','THEME'].includes(r.relation_type));if(targetRelations.length>1)continue;
  const group=targetRelations.length?nodes().get(targetRelations[0].tail_node_id):endpoint(a,offset(ann.source_span.start,q,symbols[0].index),offset(ann.source_span.start,q,symbols.at(-1).index+symbols.at(-1)[0].length),'SYMBOL_SET'),fm=files[0],file=endpoint(a,offset(ann.source_span.start,q,fm.index),offset(ann.source_span.start,q,fm.index+fm[0].length),'FILE');
  const rec=record('AGGREGATE_MEMBERS',group.node_id,governor.node_id,[...group.source_span_ids,...governor.source_span_ids,...file.source_span_ids]);rec.structural_paths=[ann.structural_path];rec.group_node_id=group.node_id;rec.governing_event_id=governor.node_id;rec.owner_file_node_id=file.node_id;rec.owner_file=file.surface;rec.section_root=sectionRoot(ann);rec.member_node_ids=[];
  for(const sm of symbols){const n=endpoint(a,offset(ann.source_span.start,q,sm.index+1),offset(ann.source_span.start,q,sm.index+1+sm[1].length),'SYMBOL');n.metadata.artifact_identity=id(f.source.sha256,'owned-symbol',rec.section_root,file.surface,n.surface);n.metadata.structural_ownership={file_node_id:file.node_id,group_node_id:group.node_id,source_span_ids:uniq([...file.source_span_ids,...n.source_span_ids]),structural_path:ann.structural_path};rec.member_node_ids.push(n.node_id);rec.source_span_ids=uniq([...rec.source_span_ids,...n.source_span_ids]);link(a,'CONJUNCTION',group,n,rec);}
  if(uniq(symbols.map(m=>m[1])).length!==symbols.length){rec.reason='DUPLICATE_ENUMERATED_MEMBER';rec.unresolved_ref=unknown(a.cl,'UNRESOLVED_COREFERENCE',rec.reason,rec.member_node_ids);audit.aggregates.push(rec);continue;}
  const memberArguments=rec.member_node_ids.map(i=>link(a,'PATIENT',governor,nodes().get(i),rec));
  rec.set_expr_id=expression({kind:'UNION',operand_expr_ids:rec.member_node_ids.map((i,j)=>expression({kind:'ITEM',entity_node_id:i,source_span_ids:nodes().get(i).source_span_ids,relation_ids:[memberArguments[j].relation_id]})),source_span_ids:rec.source_span_ids,relation_ids:memberArguments.map(r=>r.relation_id)});rec.state='CERTIFIED';group.metadata.aggregate_identity=rec;
  // Preserve the original target node and its predicate relation; the exact
  // enumerable scope replaces only the opaque target ITEM expression.
  f.expression_plans.set(governor.node_id,{...f.expression_plans.get(governor.node_id),scope_expr_id:rec.set_expr_id});audit.aggregates.push(rec);
 }
 const frames=f.semantic_decoding.frame_certification;
 for(const call of frames.call_sites.filter(x=>x.state==='CERTIFIED')){
  const nm=nodes(),owner=nm.get(call.owner_node_id),callee=nm.get(call.callee_node_id),main=nm.get(call.event_node_id),a=aFor(main),ann=annFor(main),hints=ownerHints(ann);
  const rec=record('MEMBER_CONTINUITY',owner.node_id,call.frame_id,call.source_span_ids);rec.call_frame_id=call.frame_id;rec.owner_node_id=owner.node_id;rec.structural_paths=[ann.structural_path];
  const groups=audit.aggregates.filter(g=>g.member_node_ids.some(i=>nm.get(i).surface===owner.surface)&&compatible(ann,annFor(nm.get(g.governing_event_id)))&&(!hints.length||hints.length===1&&hints[0]===g.owner_file));
  rec.candidates=groups.flatMap(g=>g.member_node_ids.filter(i=>nm.get(i).surface===owner.surface).map(i=>({member_node_id:i,aggregate_link_id:g.identity_link_id,owner_file:g.owner_file,state:g.state})));
  const matches=rec.candidates.filter(c=>c.state==='CERTIFIED');let chosen=null;
  if(rec.candidates.length===1&&matches.length===1){chosen=matches[0];const g=groups.find(g=>g.identity_link_id===chosen.aggregate_link_id),member=nm.get(chosen.member_node_id);rec.state='CERTIFIED';rec.member_node_id=member.node_id;rec.aggregate_link_id=g.identity_link_id;rec.owner_file=g.owner_file;rec.source_span_ids=uniq([...rec.source_span_ids,...g.source_span_ids]);rec.structural_paths.push(...g.structural_paths);link(a,'COREFERENCE',owner,member,rec);owner.metadata.artifact_identity=member.metadata.artifact_identity;owner.metadata.structural_ownership={...member.metadata.structural_ownership,identity_link_id:rec.identity_link_id};rec.same_artifact=true;rec.transition=owner.metadata.role_transition;
  }else{rec.reason=rec.candidates.length?'MEMBER_IDENTITY_NOT_UNIQUE':'NO_ADMISSIBLE_AGGREGATE_MEMBER';if(rec.candidates.length)rec.unresolved_ref=unknown(a.cl,'UNRESOLVED_COREFERENCE',rec.reason,rec.candidates.map(c=>c.member_node_id));}
  audit.continuity.push(rec);
  const binding=record('CALL_DECLARATION',callee.node_id,call.frame_id,call.source_span_ids);binding.call_frame_id=call.frame_id;binding.callee_node_id=callee.node_id;binding.structural_paths=[ann.structural_path];
  // A local call can bind without an aggregate only if its own structural
  // domain has exactly one explicit declaration owner for the matching symbol.
  const effectiveOwners=rec.state==='CERTIFIED'?[rec.owner_file]:hints;
  binding.candidates=frames.code_ownership.filter(d=>d.state==='CERTIFIED'&&d.frame_kind==='FUNCTION_DECLARATION'&&nm.get(d.declared_symbol_node_id)?.surface===callee.surface&&compatible(ann,annFor(nm.get(d.event_node_id)))&&(!effectiveOwners.length||effectiveOwners.length===1&&nm.get(d.file_node_ids[0]).surface===effectiveOwners[0])).map(d=>({declaration_frame_id:d.frame_id,symbol_node_id:d.declared_symbol_node_id,owner_file:nm.get(d.file_node_ids[0]).surface}));
  if(binding.candidates.length===1){const c=binding.candidates[0],decl=frames.code_ownership.find(d=>d.frame_id===c.declaration_frame_id),dn=nm.get(c.symbol_node_id);binding.state='CERTIFIED';binding.declaration_frame_id=decl.frame_id;binding.declared_symbol_node_id=dn.node_id;binding.owner_file=c.owner_file;binding.source_span_ids=uniq([...binding.source_span_ids,...decl.source_span_ids]);binding.structural_paths.push(decl.structural_path);binding.declared_behavior={code_span_id:decl.code_span_id,code_structure_ids:decl.code_structure_ids,interpreted:false,executed:false};link(a,'COREFERENCE',callee,dn,binding);callee.metadata.artifact_identity=dn.metadata.artifact_identity;callee.metadata.call_declaration_binding=binding;
  }else{binding.reason=binding.candidates.length?'DECLARATION_IDENTITY_NOT_UNIQUE':'NO_ADMISSIBLE_DECLARATION';if(binding.candidates.length)binding.unresolved_ref=unknown(a.cl,'UNRESOLVED_COREFERENCE',binding.reason,binding.candidates.map(c=>c.symbol_node_id));}
  audit.call_bindings.push(binding);
  if(rec.state==='CERTIFIED'&&binding.state==='CERTIFIED'){
   const group=audit.aggregates.find(g=>g.identity_link_id===rec.aggregate_link_id),governor=nm.get(group.governing_event_id),composition=record('MEMBER_BEHAVIOR',rec.member_node_id,call.frame_id,uniq([...rec.source_span_ids,...binding.source_span_ids]));composition.state='CERTIFIED';composition.structural_paths=[...rec.structural_paths,...binding.structural_paths];Object.assign(composition,{governing_event_id:governor.node_id,aggregate_link_id:group.identity_link_id,member_node_id:rec.member_node_id,call_frame_id:call.frame_id,call_event_id:call.event_node_id,behavior_node_id:call.behavior_node_id,declaration_frame_id:binding.declaration_frame_id,declared_symbol_node_id:binding.declared_symbol_node_id,argument_node_ids:call.argument_node_ids,argument_scope_expr_id:call.argument_scope_expr_id,behavior_semantics:'EXPLICIT_CALL_TO_OWNED_DECLARATION',helper_body_semantics:'NOT_INTERPRETED'});
   // Composition is member-indexed metadata, not an unqualified conjunction
   // of sibling actions. No new independent action or inferred output.
   governor.metadata.certified_behavior??={};governor.metadata.certified_behavior.member_behaviors??=[];governor.metadata.certified_behavior.member_behaviors.push(composition);main.metadata.certified_behavior.member_composition=composition;audit.compositions.push(composition);
  }
 }
 for(const r of [...audit.aggregates,...audit.continuity,...audit.call_bindings].filter(r=>r.state==='CERTIFIED'&&r.relation_ids.length))f.relation_bundles.push({bundle_id:id(f.source.sha256,'identity-bundle',r.identity_link_id),clause_ids:uniq(r.relation_ids.map(i=>f.relations.find(r=>r.relation_id===i).clause_id)),relation_ids:r.relation_ids,bundle_state:'RESOLVED',unresolved_refs:[]});
 audit.after=graphSnapshot(f);return f;
}
