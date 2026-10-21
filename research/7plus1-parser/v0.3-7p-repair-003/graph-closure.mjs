import {id,uniq} from './identity.mjs';
import {boundaryDomain} from './discourse.mjs';

// Closed predicate classes; technical names and document operands are always source data.
const predicates={MODIFY:/^(?:修|修改|修订|更新|更改|改动|修复|modify|update|revise|repair)$/iu,READ:/^(?:读|看|读取|检查|核查|对比|比较|扫描|审计|read|inspect|check|compare|scan|audit)$/iu,CREATE:/^(?:新建|创建|生成|编写|撰写|写出|写|产出|输出|交付|提交|create|generate|write|produce|deliver|submit)$/iu};
const lead=/^\s*(?:[-*+]\s+|\d+[.)]\s+)?(?:\*\*)?(?:(?:请|必须|应当|应|须|只|不得|禁止|严禁|不能)\s*)?(修复|修订|修改|更新|更改|改动|修|读取|检查|核查|对比|比较|扫描|审计|读|看|新建|创建|生成|编写|撰写|写出|写|产出|输出|交付|提交|modify|update|revise|repair|read|inspect|check|compare|scan|audit|create|generate|write|produce|deliver|submit)\s*/iu;
const connector=/^[\s`*]*(?:[、,，/+]|以及|和|与|及|vs\.?|versus|and|or)[\s`*]*$/iu;
const technical=/`([^`\n]+)`/gu;
export function closeSemanticGraph(f){
 const {node,span,relation,unknown}=f.tools,cp=[...f.source.raw_text],slice=(s,e)=>cp.slice(s,e).join(''),sp=n=>f.source_spans.find(x=>x.span_id===n.source_span_ids[0]);
 const audit={version:'7P-REPAIR-003',composition_edges:[],object_bundles:[],restrictions:[],content_graphs:[],unresolved:[]};f.semantic_decoding.graph_closure=audit;
 const offset=(a,q,i)=>a+[...q.slice(0,i)].length;
 const set=body=>{const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);return e.expr_id;};
 const item=(n,r)=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]});
 const entity=(a,s,e,kind)=>{const prior=f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&sp(n).start===s&&sp(n).end===e);const n=prior??node(a.cl,'ENTITY',s,e,{sense:'TECHNICAL_OBJECT',owner:a.cl.id,discourse:a.discourse});n.metadata.technical_type=kind;n.metadata.artifact_identity??=id(f.source.sha256,'artifact',n.surface);return n;};
 const edge=(a,child,parent,evidence,kind)=>{if(child.node_id===parent.node_id)return;const candidates=audit.composition_edges.filter(e=>e.child_node_id===child.node_id);if(candidates.some(e=>e.parent_node_id!==parent.node_id)){const u=unknown(a.cl,'UNRESOLVED_RELATION','Composition has multiple structurally compatible parents',[child.node_id,...candidates.map(x=>x.parent_node_id),parent.node_id]);audit.unresolved.push(u);return;}
  const e={edge_id:id(f.source.sha256,'PART_OF',child.node_id,parent.node_id),relation_type:'PART_OF',child_node_id:child.node_id,parent_node_id:parent.node_id,source_span_ids:uniq([...child.source_span_ids,...parent.source_span_ids,...evidence]),attachment_path:[...(a.discourse.structural_path??[]),a.cl.id,parent.node_id,child.node_id],evidence_kind:kind,state:'RESOLVED'};if(!audit.composition_edges.some(x=>x.edge_id===e.edge_id))audit.composition_edges.push(e);child.metadata.part_of=uniq([...(child.metadata.part_of??[]),parent.node_id]);child.metadata.composition_provenance=e;};
 const kind=q=>/\s/.test(q)?'COMMAND':/\.[a-z][a-z0-9]*$/iu.test(q)?'FILE':q.includes('/')?'DIRECTORY':'SYMBOL';
 const trim=(s,e)=>{while(s<e&&/[\s`*：:]/u.test(cp[s]))s++;while(e>s&&/[\s`*。；;：:]/u.test(cp[e-1]))e--;return [s,e];};
 const protectedObjects=(a,s,e)=>[...slice(s,e).matchAll(technical)].map(m=>{const start=offset(s,slice(s,e),m.index+1),end=start+[...m[1]].length;return entity(a,start,end,kind(m[1]));});
 function install(a,event,objects,mode,evidence){
  if(!objects.length)return;const isNegative=event.metadata.modality==='FORBIDDEN'||event.metadata.restrict;
  const role=isNegative?event.metadata.restrict?'RESTRICTS':'FORBIDS':mode==='CREATE'?'RESULT':'PATIENT';
  // Replace argument edges only within the explicitly reconstructed argument domain.
  const range=evidence.map(i=>f.source_spans.find(s=>s.span_id===i)),lo=Math.min(...range.map(s=>s.start)),hi=Math.max(...range.map(s=>s.end));
  for(const r of f.relations.filter(r=>r.head_node_id===event.node_id&&['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS','SCOPE_MEMBER'].includes(r.relation_type))){const old=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(sp(old).start>=lo&&sp(old).end<=hi&&!objects.some(n=>n.node_id===old.node_id))r.state='REJECTED';}
  const rs=objects.map(n=>relation(a.cl,role,event,n,evidence));for(const r of rs)r.state='RESOLVED';
  const exprs=objects.map((n,i)=>item(n,rs[i])),scope=exprs.length===1?exprs[0]:set({kind:'UNION',operand_expr_ids:exprs,source_span_ids:uniq(evidence),relation_ids:rs.map(r=>r.relation_id)});
  const plan=f.expression_plans.get(event.node_id)??{};plan.scope_expr_id=scope;f.expression_plans.set(event.node_id,plan);
  for(const n of objects){n.metadata.artifact_roles=isNegative?['RESTRICTION_TARGET']:mode==='MODIFY'?['MODIFICATION_TARGET','UPDATED_OUTPUT']:mode==='READ'?['READ_ONLY_INPUT']:[plan.condition_expr_id?'CONDITIONAL_OUTPUT':'GENERATED_OUTPUT'];
   if(!isNegative&&mode==='MODIFY'){n.metadata.role_transition={before:'EXISTING_INPUT',after:'UPDATED_OUTPUT',same_artifact:true};relation(a.cl,'RESULT',event,n,evidence);}
   if(!isNegative&&mode!=='CREATE'){const r=relation(a.cl,'SCOPE_MEMBER',event,n,evidence);r.state='RESOLVED';f.relation_scope_plans.set(r.relation_id,item(n,r));}
  }
  event.metadata.argument_graph={object_node_ids:objects.map(n=>n.node_id),source_span_ids:evidence,scope_expr_id:scope,complete:true};a.handled=true;
  audit.object_bundles.push({event_node_id:event.node_id,mode,object_node_ids:objects.map(n=>n.node_id),scope_expr_id:scope,source_span_ids:evidence,domain:a.discourse.kind});
 }
 for(const a of f.analyses){if(!boundaryDomain(a.discourse)&&a.discourse.kind!=='OUTPUT_CONTENT')continue;
  const q=a.cl.span.quote,m=lead.exec(q);let event,mode,start;
  if(m){const ps=offset(a.cl.span.start,q,m[0].lastIndexOf(m[1])),pe=ps+[...m[1]].length;mode=Object.entries(predicates).find(([,r])=>r.test(m[1]))?.[0];start=offset(a.cl.span.start,q,m[0].length);
   event=a.events.find(n=>sp(n).start===ps&&sp(n).end===pe);
   if(!event&&a.events.some(e=>sp(e).start<=ps&&sp(e).end>=pe))continue;
   if(!event&&mode!=='CREATE'&&!slice(start,a.discourse.source_span?.end??a.cl.span.end).includes('`')&&!/[：:]\s*$/u.test(q))continue;
   if(!event){event=node(a.cl,'EVENT',ps,pe,{sense:'ARTIFACT_OPERATION',owner:a.cl.id,modality:/不得|禁止|严禁|不能/u.test(m[0])?'FORBIDDEN':'REQUIRED',discourse:a.discourse});a.events.push(event);}
   // An imperative at clause start is explicit syntax, not inferred intent.
   if(event.metadata.modality==='UNSTATED'){event.metadata.modality='REQUIRED';const uid=event.metadata.modality_unresolved,index=f.unresolved.findIndex(u=>u.unresolved_id===uid);if(index>=0)f.unresolved.splice(index,1);delete event.metadata.modality_unresolved;for(const b of f.relation_bundles)if(b.unresolved_refs.includes(uid)){b.unresolved_refs=b.unresolved_refs.filter(i=>i!==uid);b.bundle_state=b.unresolved_refs.length?'UNRESOLVED':'RESOLVED';}(audit.resolved_candidates??=[]).push({unresolved_id:uid,event_node_id:event.node_id,evidence_span_id:span(ps,pe),rule:'EXPLICIT_LEADING_IMPERATIVE'});}
  }else{const eligible=a.events.filter(e=>['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality)&&Object.values(predicates).some(r=>r.test(e.surface)));if(eligible.length!==1)continue;event=eligible[0];mode=Object.entries(predicates).find(([,r])=>r.test(event.surface))?.[0];start=sp(event).end;}
  if(a.condition||!mode||event.metadata.completion||event.metadata.stop)continue;
  // Predicate layers remain local. Do not consume another predicate's complement.
  const next=a.events.filter(e=>e!==event&&sp(e).start>sp(event).end).sort((x,y)=>sp(x).start-sp(y).start)[0];let end=next?sp(next).start:a.cl.span.end;
  // Preserve protected technical spans split by upstream clause punctuation. The actual
  // document block, never arbitrary neighboring prose, supplies the enclosing range.
  const block=a.discourse.source_span;
  if((slice(start,end).match(/`/gu)??[]).length%2===1&&block&&block.end>end)end=block.end;
  const objects=protectedObjects(a,start,end),raw=slice(start,end),evidence=[span(start,end),...event.source_span_ids];
  if(/^(?:对比|比较|compare)$/iu.test(event.surface)){
   let quoted=false,split=null;for(let i=start;i<end;i++){if(cp[i]==='`')quoted=!quoted;if(!quoted&&cp[i]==='与'){split=i;break;}}
   if(split!==null){const ranges=[trim(start,split),trim(split+1,end)],groups=ranges.map(([s,e])=>entity(a,s,e,'COMPARISON_OPERAND'));
    for(let i=0;i<groups.length;i++)for(const member of objects.filter(n=>sp(n).start>=ranges[i][0]&&sp(n).end<=ranges[i][1]))edge(a,member,groups[i],evidence,'EXPLICIT_COMPARISON_OPERAND');
    install(a,event,groups,'READ',evidence);continue;
   }
  }
  if(objects.length){
   const first=objects[0],rest=objects.slice(1),between=rest.length?slice(sp(first).end,sp(rest[0]).start):'';
   const composition=/^[`\s]*(?:中(?:的)?|的|内(?:的)?|contains?)[\s`]*$/iu.test(between)&&rest.length>0;
   if(composition){for(const child of rest)edge(a,child,first,evidence,'EXPLICIT_PARENT_GENITIVE');first.metadata.member_node_ids=rest.map(n=>n.node_id);install(a,event,objects,mode,evidence);}
   else if(objects.length===1&&/^[\s`*]*(?:最近|当前|已有|现有|新的|new|existing|recent)?[\s`*]*$/iu.test(slice(start,sp(first).start))&&/^[\s`*。；;]*$/u.test(slice(sp(first).end,end))||objects.length>1&&objects.slice(1).every((n,i)=>connector.test(slice(sp(objects[i]).end,sp(n).start))))install(a,event,objects,mode,evidence);
  }else{
   // Complete nominal objects can be abstract deliverables. No filename requirement.
   const [s,e]=trim(start,end),candidate=slice(s,e);
   if(s<e&&mode==='CREATE'&&!/[：:；;，,。\n]/u.test(candidate)&&!a.cl.tokens.some(t=>t.start>=s&&t.end<=e&&/^(?:VV|VERB)$/u.test(t.pos??'')&&!/^(?:compound|amod)/u.test(t.dep??''))&&!/^(?:上述|这些|该|其|它|this|that|these|those)/iu.test(candidate))install(a,event,[entity(a,s,e,'ABSTRACT_DELIVERABLE')],mode,[span(s,e),...event.source_span_ids]);
  }
  // An open complement can consume only its actual document-list descendants.
  if(/[：:]\s*$/u.test(q)){const ann=f.discourse.annotations.find(x=>x.structure_id===a.discourse.structure_id),children=f.discourse.annotations.filter(x=>x.structure_id!==ann?.structure_id&&x.structural_path.includes(ann?.structure_id)&&/^\s*[-*+]\s/u.test(x.source_span.quote));
   // Explicit colon + strictly indented contiguous list is document syntax evidence.
   if(ann&&!children.length){const indent=/^\s*/u.exec(ann.source_span.quote)[0].length;for(const child of f.discourse.annotations.slice(f.discourse.annotations.indexOf(ann)+1)){if(!child.source_span.quote.trim())continue;const b=/^(\s*)[-*+]\s/u.exec(child.source_span.quote);if(!b||b[1].length<=indent)break;children.push(child);}}
   const parts=[],byChild=new Map();for(const child of children){const z=f.analyses.find(y=>y.discourse.structure_id===child.structure_id);if(!z)continue;const ns=protectedObjects(z,child.source_span.start,child.source_span.end);parts.push(...ns);byChild.set(child.structure_id,ns);
    const parent=children.filter(p=>p!==child&&child.structural_path.includes(p.structure_id)&&/[：:]\s*$/u.test(p.source_span.quote)).at(-1),parents=parent?byChild.get(parent.structure_id):null;
    if(parents?.length===1)for(const n of ns)edge(z,n,parents[0],[a.sid,z.sid,span(parent.source_span.start,parent.source_span.end)],'NESTED_LIST_ARGUMENT');
   }
   if(parts.length){install(a,event,parts,mode,[a.sid,...children.map(x=>span(x.source_span.start,x.source_span.end))]);for(const child of children){const z=f.analyses.find(y=>y.discourse.structure_id===child.structure_id);if(z&&/^\s*[-*+]\s+`[^`]+`\s*$/u.test(child.source_span.quote)){z.handled=true;for(const n of parts.filter(n=>n.metadata.clause_id===z.cl.id))n.metadata.open_complement_attachment={parent_clause_id:a.cl.id,parent_structure_id:ann.structure_id,child_structure_id:child.structure_id,source_span_ids:[a.sid,z.sid],rule:'COLON_INDENTED_LIST'};}}}
  }
 }
 // Explicit invariance is a restriction on change, not a fifth Action Modality.
 for(const a of f.analyses){if(!boundaryDomain(a.discourse)&&a.discourse.kind!=='OUTPUT_CONTENT')continue;const q=a.cl.span.quote;
  const m=/^(?:\s*[-*+]\s*)?(?:保持|保留)\s*(.+?)\s*不变\s*[。；;]?$/u.exec(q)??/^(?:\s*[-*+]\s*)?(.+?)\s*(?:保持不变|不变)\s*[。；;]?$/u.exec(q);if(!m)continue;
  const s=offset(a.cl.span.start,q,q.indexOf(m[1])),e=s+[...m[1]].length,[cs,ce]=trim(s,e);if(cs>=ce)continue;
  const target=entity(a,cs,ce,'INVARIANT_TARGET'),ev=node(a.cl,'EVENT',a.cl.span.start,a.cl.span.end,{sense:'change',owner:a.cl.id,modality:'PERMITTED',restrict:true,restriction_kind:'NO_CHANGE',discourse:a.discourse});
  // Superseded parses refer to the very same source predicate layer.
  for(const old of a.events){if(old===ev)continue;old.metadata.candidate_disposition='REJECTED';for(const r of f.relations.filter(r=>r.head_node_id===old.node_id))r.state='REJECTED';}a.events=[ev];install(a,ev,[target],'MODIFY',[a.sid]);audit.restrictions.push({event_node_id:ev.node_id,target_node_id:target.node_id,normalization:'RESTRICT(change(target))',source_span_ids:[a.sid]});
 }
 // Open-class predicates are admitted only inside an explicitly authored content domain,
 // with an explicit modal and dependency-supported object. No domain vocabulary list.
 for(const a of f.analyses.filter(a=>a.discourse.kind==='OUTPUT_CONTENT')){
  const q=a.cl.span.quote,modal=/(?:必须|应当|须|不得|禁止|不准|不能|不要|不)(?:\*\*)?/u.exec(q);if(!modal)continue;
  const after=offset(a.cl.span.start,q,modal.index+modal[0].length),t=a.cl.tokens.find(t=>t.start>=after&&/^(?:VV|VERB)$/u.test(t.pos??''));if(!t||!/^\s*$/u.test(slice(after,t.start)))continue;
  const ti=a.cl.tokens.indexOf(t),args=a.cl.tokens.filter(n=>n.head===ti&&/^(?:dobj|obj)$/u.test(n.dep??''));
  if(args.length!==1){unknown(a.cl,'UNRESOLVED_RELATION','Content predicate has no unique dependency-supported object',[]);continue;}
  let ev=a.events.find(e=>sp(e).start===t.start&&sp(e).end===t.end);if(ev&&f.relations.some(r=>r.head_node_id===ev.node_id&&r.state==='RESOLVED'&&['PATIENT','FORBIDS','RESTRICTS','RESULT'].includes(r.relation_type)))continue;
  const negative=/不得|禁止|不准|不能|不要|^不/u.test(modal[0]);ev??=node(a.cl,'EVENT',t.start,t.end,{sense:'CONTENT_PREDICATE',owner:a.cl.id,token_id:t.id,modality:negative?'FORBIDDEN':'REQUIRED',discourse:a.discourse});if(!a.events.includes(ev))a.events.push(ev);
  const root=args[0],indices=new Set([a.cl.tokens.indexOf(root)]);let changed=true;while(changed){changed=false;for(let i=0;i<a.cl.tokens.length;i++)if(!indices.has(i)&&indices.has(a.cl.tokens[i].head)&&/^(?:compound|nn|amod|det|nummod|nmod:assmod)$/u.test(a.cl.tokens[i].dep??'')){indices.add(i);changed=true;}}
  const parts=[...indices].map(i=>a.cl.tokens[i]),s=Math.min(...parts.map(t=>t.start)),e=Math.max(...parts.map(t=>t.end)),obj=entity(a,s,e,'CONTENT_OBJECT');relation(a.cl,negative?'FORBIDS':'PATIENT',ev,obj,[a.sid,span(offset(a.cl.span.start,q,modal.index),after)]);a.handled=true;
 }
 // Output-content uses the same typed graph; the existing domain gate excludes current A/P/B.
 for(const req of f.semantic_decoding.discourse.output_content_requirements){const a=f.analyses.find(a=>a.cl.id===req.clause_id);if(!a||req.kind==='SECTION_CONTENT_REQUIREMENT')continue;
  const ns=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id),rs=f.relations.filter(r=>r.clause_id===a.cl.id&&r.state!=='REJECTED');
  for(const n of ns){n.metadata.scope='OUTPUT_CONTENT';n.metadata.owner_output_ids=req.owner_output_ids??[];}
  req.semantic_node_ids=ns.map(n=>n.node_id);req.relation_ids=rs.map(r=>r.relation_id);req.condition_expr_ids=uniq(ns.flatMap(n=>f.expression_plans.get(n.node_id)?.condition_expr_id??[]));req.quantity_expr_ids=uniq(ns.flatMap(n=>f.expression_plans.get(n.node_id)?.quantity_expr_id??[]));
  req.unresolved_refs=f.unresolved.filter(u=>u.related_clause_ids.includes(a.cl.id)).map(u=>u.unresolved_id);req.content_parsing_status=rs.length?'TYPED_CONTENT_GRAPH':'UNSUPPORTED_CONTENT';
  const graph={requirement_id:req.requirement_id,scope:'OUTPUT_CONTENT',owner_output_ids:req.owner_output_ids??[],ownership_status:req.ownership_status,node_ids:req.semantic_node_ids,relation_ids:req.relation_ids,condition_expr_ids:req.condition_expr_ids,quantity_expr_ids:req.quantity_expr_ids,unresolved_refs:req.unresolved_refs,source_span_ids:req.source_span_ids};audit.content_graphs.push(graph);
 }
 // A document section is an ordinary constituent of its owning output artifact.
 for(const req of f.semantic_decoding.discourse.output_content_requirements.filter(r=>r.kind==='SECTION_CONTENT_REQUIREMENT'&&r.owner_output_ids?.length)){const a=f.analyses.find(a=>a.cl.id===req.clause_id),child=f.semantic_nodes.find(n=>n.node_id===req.semantic_node_ids[0]);for(const oid of req.owner_output_ids){const parent=f.semantic_nodes.find(n=>n.node_id===oid);if(parent&&child){if(req.ownership_status==='OUTPUT_SET'){const e={edge_id:id(child.node_id,parent.node_id,'PART_OF'),relation_type:'PART_OF',child_node_id:child.node_id,parent_node_id:parent.node_id,state:'RESOLVED',evidence_kind:'EXPLICIT_SHARED_OUTPUT_SET',source_span_ids:uniq([...req.source_span_ids,...parent.source_span_ids]),attachment_path:[...req.structural_path,oid,child.node_id]};audit.composition_edges.push(e);}else edge(a,child,parent,req.source_span_ids,'AUTHORED_SECTION');}}}
 return f;
}
