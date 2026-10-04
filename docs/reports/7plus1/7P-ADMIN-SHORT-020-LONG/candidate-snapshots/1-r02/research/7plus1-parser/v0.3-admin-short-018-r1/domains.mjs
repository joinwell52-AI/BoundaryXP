import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
const states={删除:'DELETED',改名:'RENAMED',新增:'ADDED',移除:'REMOVED',deleted:'DELETED',renamed:'RENAMED',added:'ADDED',removed:'REMOVED'};
const count=s=>[...s].length;
export function closeQualifiedDomains(f){
 const cp=[...f.source.raw_text],{node,span,relation,unknown}=f.tools,nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const log={domains:[],qualifiers:[],identity:[],unresolved:[],output_sections:[]};f.semantic_decoding.qualified_domain_ir=log;
 const live=r=>r.state==='RESOLVED',aof=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id);
 const owner=n=>n.metadata.semantic_ownership?.semantic_owner_id;
 const artifactDomain=(before,type,anchor)=>[...new Map(f.relations.filter(r=>live(r)&&r.relation_type===type&&nm(r.tail_node_id)?.metadata.literal_tag==='FILEPATH'&&sp(nm(r.tail_node_id)).start<before&&(!anchor||owner(nm(r.tail_node_id))===owner(anchor))).map(r=>{const n=nm(r.tail_node_id);return [n.metadata.artifact_identity??n.surface,n];})).values()];
 const make=(list,body)=>{const expr={expr_id:id(f.source.sha256,'expr',body),...body};if(!list.some(e=>e.expr_id===expr.expr_id))list.push(expr);return expr.expr_id;};
 function edge(a,type,h,t,evidence=[]){const r=relation(a.cl,type,h,t,[a.sid,...evidence]);if(r){r.state='RESOLVED';delete r.unresolved_ref;r.evidence_tier='HARD';r.rule_refs=uniq([...r.rule_refs,'QUALIFIED_DOMAIN_TYPED_SOURCE_CERTIFICATE']);}return r;}
 function local(a,text,start,sense){return node(a.cl,'ENTITY',start,start+count(text),{sense,owner:a.cl.id,discourse:a.discourse});}
 function suspend(a,n,reason,candidates=[]){const uid=unknown(a.cl,'UNRESOLVED_COREFERENCE',reason,[n.node_id,...candidates.map(n=>n.node_id)]);n.state='UNRESOLVED';n.unresolved_ref=uid;for(const r of f.relations.filter(r=>live(r)&&r.tail_node_id===n.node_id)){r.state='UNRESOLVED';r.unresolved_ref=uid;}log.unresolved.push({node_id:n.node_id,candidate_ids:candidates.map(n=>n.node_id),reason,source_span_ids:n.source_span_ids,unresolved_id:uid});}
 function domain(a,n,base,member,property,quantifier,qualifier_expr_id,relations,owner_id){const d={domain_id:id(n.node_id,'qualified-domain',owner_id),endpoint_node_id:n.node_id,base_entity_id:base.node_id,member_selector:member?{node_id:member.node_id,surface:member.surface}:null,property_selector:property?{node_id:property.node_id,surface:property.surface}:null,quantifier,qualifier_expr_id:qualifier_expr_id??null,owner_node_id:owner_id,source_span_ids:uniq([a.sid,...n.source_span_ids,...base.source_span_ids,...member?.source_span_ids??[],...property?.source_span_ids??[]]),relation_ids:relations.filter(Boolean).map(r=>r.relation_id),proof_refs:[]};n.metadata.qualified_domain_id=d.domain_id;log.domains.push(d);return d;}
 // A local member reference is licensed by explicit 'in/其中', not adjacency.
 for(const n of [...f.semantic_nodes].filter(n=>n.node_type==='ENTITY')){
  const a=aof(n);if(!a||!boundaryDomain(a.discourse))continue;
  const zh=/^其中(所有|全部|每个|每项)(.+?)(?:的(.+))?$/u.exec(n.surface),en=/^(all|every)\s+(.+?)\s+in\s+(?:the\s+)?(?:manifest|list|catalog)$/iu.exec(n.surface);if(!zh&&!en)continue;
  const pat=f.relations.filter(r=>live(r)&&r.tail_node_id===n.node_id&&r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='review');if(pat.length!==1)continue;
  const refs=[...new Map(f.relations.filter(r=>live(r)&&r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='read'&&aof(nm(r.head_node_id))?.cl.sentence_id===a.cl.sentence_id&&sp(nm(r.tail_node_id)).start<sp(n).start&&nm(r.tail_node_id).metadata.literal_tag==='FILEPATH').map(r=>{const o=nm(r.tail_node_id);return [o.metadata.artifact_identity??o.surface,o];})).values()];
  // In either case a derived local inspection domain is not an independent input.
  for(const r of f.relations.filter(r=>live(r)&&r.relation_type==='SCOPE_MEMBER'&&r.tail_node_id===n.node_id)){r.state='REJECTED';r.rule_refs=uniq([...r.rule_refs,'DERIVED_CHECK_DOMAIN_NOT_EXTERNAL_INPUT']);}
  if(refs.length!==1){suspend(a,n,'Explicit member container is not uniquely certified',refs);continue;}
  const memberText=(zh??en)[2],propertyText=zh?.[3],start=sp(n).start;
  const member=local(a,memberText,start+count(n.surface.slice(0,n.surface.indexOf(memberText))),'MEMBER_SELECTOR'),property=propertyText?local(a,propertyText,start+count(n.surface.slice(0,n.surface.lastIndexOf(propertyText))),'PROPERTY_SELECTOR'):null;
  n.metadata.local_reference={referent_node_id:refs[0].node_id,source_span_ids:uniq([...n.source_span_ids,...refs[0].source_span_ids]),quantifier:'ALL',qualifier:n.surface};
  const r=edge(a,'PART_OF',n,refs[0]);if(!r){suspend(a,n,'Missing certified immediate container relation',refs);continue;}
  const d=domain(a,n,refs[0],member,property,'ALL',null,[pat[0],r],pat[0].head_node_id);
  const scope=make(f.expressions.set_expr_nodes,{kind:'ALL',base_entity_node_id:n.node_id,source_span_ids:d.source_span_ids,relation_ids:[pat[0].relation_id]});
  f.expression_plans.set(pat[0].head_node_id,{...f.expression_plans.get(pat[0].head_node_id),scope_expr_id:scope});d.scope_expr_id=scope;
 }
 // Report coverage and recorded change predicates are properties of confirmation,
 // never flat delete/rename execution events. The confirmation still owns its report.
 for(const st of f.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.sense==='REVIEW_CONFIRMED')){
  const a=aof(st),content=st.metadata.required_content;if(!a||!content)continue;
  if(content.predicate==='COVERS'&&/(?:清单|列表)中的每一项/u.test(content.object)){
   const ds=log.domains.filter(d=>d.quantifier==='ALL'&&sp(nm(d.endpoint_node_id)).start<sp(st).start&&owner(nm(d.endpoint_node_id))===owner(st));
   const inputs=artifactDomain(sp(st).start,'SCOPE_MEMBER',st);
   if(ds.length>1||!ds.length&&inputs.length!==1){suspend(a,st,'Review coverage list/member domain is not unique',ds.length?ds.map(d=>nm(d.endpoint_node_id)):inputs);continue;}
   let d=ds[0];
   if(!d){const text='每一项',at=sp(st).start+count(st.surface.slice(0,st.surface.indexOf(text))),m=local(a,text,at,'MEMBER_SELECTOR');d=domain(a,m,inputs[0],m,null,'ALL',null,[],st.node_id);}
   const r=edge(a,'CONJUNCTION',st,nm(d.endpoint_node_id));content.domain_id=d.domain_id;content.base_entity_id=d.base_entity_id;content.member_selector_id=d.member_selector.node_id;content.domain_relation_ids=[r.relation_id];content.quantifier='ALL';content.proof_refs=[];
  }
  if(content.predicate!=='RECORDS')continue;
  const match=/^(每个|每项|所有|全部)(删除|改名|新增|移除)(或|或者|且|并且|和)(删除|改名|新增|移除)的(.+?)(?:都|均)已记录$/u.exec(content.object);if(!match)continue;
  const start=f.source_spans.find(s=>s.span_id===content.source_span_ids[0]).start,memberText=match[5],member=local(a,memberText,start+count(content.object.slice(0,content.object.indexOf(memberText))),'MEMBER_SELECTOR');
  const qualifiers=[],rs=[];let cursor=count(match[1]);
  for(const [index,word] of [match[2],match[4]].entries()){
   const at=start+cursor,q=node(a.cl,'STATE',at,at+count(word),{sense:states[word],owner:st.node_id,discourse:a.discourse,syntactic_layer:'REVIEW_CONTENT_QUALIFIER',qualifier_owner_node_id:st.node_id,object_node_ids:[member.node_id],polarity:'POSITIVE'});
   const r=edge(a,'CONJUNCTION',st,q),expr=make(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:q.node_id,source_span_ids:[a.sid,...q.source_span_ids,...member.source_span_ids],relation_ids:[r.relation_id]});qualifiers.push(expr);rs.push(r);cursor+=count(word)+(index===0?count(match[3]):0);
  }
  const op=/或/u.test(match[3])?'OR':'AND',expr=make(f.expressions.condition_expr_nodes,{op,operand_expr_ids:qualifiers,source_span_ids:uniq([a.sid,...member.source_span_ids]),relation_ids:rs.map(r=>r.relation_id)});
  const r=edge(a,'CONJUNCTION',st,member),d=domain(a,member,member,member,null,'ALL',expr,[...rs,r],st.node_id);
  Object.assign(content,{domain_id:d.domain_id,base_entity_id:member.node_id,member_selector_id:member.node_id,qualifier_expr_id:expr,qualifier_owner_node_id:st.node_id,domain_relation_ids:d.relation_ids,quantifier:'ALL',proof_refs:[]});
  log.qualifiers.push({owner_state_node_id:st.node_id,domain_id:d.domain_id,expr_id:expr,operator:op,operand_expr_ids:qualifiers,source_span_ids:d.source_span_ids});
 }
 // Explicit document -> section syntax supplies a content owner even when the
 // retained linguistic graph did not mark this nominal as OUTPUT_CONTENT.
 for(const a of f.analyses){
  const match=/^(?:文档|报告|document|report)\s*(?:必须|须|must|shall)?\s*(?:包含|contains?|contain)\s*(.+?(?:章节|sections?))$/iu.exec(a.cl.span.quote);if(!match||!boundaryDomain(a.discourse))continue;
  const anchor=f.semantic_nodes.find(n=>n.metadata.clause_id===a.cl.id),outputs=artifactDomain(a.cl.span.start,'RESULT',anchor);if(outputs.length!==1)continue;
  const body=match[1],at=a.cl.span.start+count(a.cl.span.quote.slice(0,a.cl.span.quote.lastIndexOf(body))),n=local(a,body,at,'OUTPUT_SECTION');
  const contentScope={...a.discourse,kind:'OUTPUT_CONTENT',content_marker_span:{start:a.cl.span.start,end:at}};a.discourse=contentScope;
  const localNodes=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id);for(const x of localNodes)x.metadata.discourse=contentScope;
  n.metadata.output_section_certificate={owner_output_id:outputs[0].node_id,explicit_syntax:true,source_span_ids:[a.sid,...n.source_span_ids,...outputs[0].source_span_ids]};
  const r=edge(a,'PART_OF',n,outputs[0]);if(!r)continue;
  f.semantic_decoding.discourse.output_content_requirements.push({requirement_id:id(n.node_id,'explicit-section'),scope:'OUTPUT_CONTENT',source_span_ids:[a.sid,...outputs[0].source_span_ids],clause_id:a.cl.id,structural_path:a.discourse.structural_path,semantic_node_ids:localNodes.map(x=>x.node_id),relation_ids:[r.relation_id],owning_output_candidates:[outputs[0].node_id],owner_output_ids:[outputs[0].node_id],ownership_status:'UNIQUE_OUTPUT',ownership_evidence_relation_ids:[r.relation_id],content_parsing_status:'TYPED_OUTPUT_SECTION'});
  log.output_sections.push({section_node_id:n.node_id,output_node_id:outputs[0].node_id,relation_id:r.relation_id,source_span_ids:r.evidence_span_ids});
 }
 // Structural output-content nodes already recovered by the frozen frontend.
 for(const n of f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&n.metadata.semantic_ownership?.owner_category==='OUTPUT_CONTENT')){
  const a=aof(n),ids=n.metadata.semantic_ownership.owner_output_ids??[],outputs=ids.map(nm).filter(Boolean);if(!a||outputs.length!==1||!/(?:章节|sections?)/iu.test(a.cl.span.quote)||!/(?:包含|contain)/iu.test(a.cl.span.quote))continue;
  n.metadata.output_section_certificate={owner_output_id:outputs[0].node_id,explicit_syntax:true,source_span_ids:[a.sid,...n.source_span_ids,...outputs[0].source_span_ids]};const r=edge(a,'PART_OF',n,outputs[0]);if(r)log.output_sections.push({section_node_id:n.node_id,output_node_id:outputs[0].node_id,relation_id:r.relation_id,source_span_ids:r.evidence_span_ids});
 }
 // Identity requires one explicit prior input in the same governing scope.
 for(const alias of [...f.semantic_nodes].filter(n=>n.node_type==='ENTITY'&&/^(?:原始数据|原始文件|(?:the\s+)?source (?:data|file))$/iu.test(n.surface))){
  const a=aof(alias);if(!a||!boundaryDomain(a.discourse))continue;
  const uses=f.relations.filter(r=>live(r)&&r.tail_node_id===alias.node_id&&['PATIENT','FORBIDS','RESTRICTS','THEME'].includes(r.relation_type));if(!uses.length)continue;
  const domainInputs=artifactDomain(sp(alias).start,'SCOPE_MEMBER',alias);
  const readInputs=domainInputs.filter(n=>f.relations.some(r=>live(r)&&r.relation_type==='PATIENT'&&r.tail_node_id===n.node_id&&nm(r.head_node_id)?.metadata.sense==='read'));
  if(readInputs.length!==1){suspend(a,alias,'Generic source object has multiple or no explicit compatible input artifacts',readInputs);continue;}
  const target=readInputs[0],coref=edge(a,'COREFERENCE',alias,target);
  alias.metadata.referent_node_id=target.node_id;alias.metadata.source_identity={rule:'UNIQUE_EXPLICIT_INPUT_IN_GOVERNING_TASK_SCOPE',candidate_ids:[target.node_id],relation_id:coref.relation_id,source_span_ids:coref.evidence_span_ids};
  for(const old of uses){const e=nm(old.head_node_id),r=edge(a,old.relation_type,e,target,[...alias.source_span_ids,...coref.evidence_span_ids]);old.state='REJECTED';old.rule_refs=uniq([...old.rule_refs,'CERTIFIED_SOURCE_IDENTITY_REPLACEMENT']);
   const expr=make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:target.node_id,source_span_ids:uniq([a.sid,...alias.source_span_ids,...target.source_span_ids]),relation_ids:[r.relation_id]});f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),scope_expr_id:expr});e.metadata.source_identity_relation_ids=uniq([...(e.metadata.source_identity_relation_ids??[]),coref.relation_id]);
  }
  log.identity.push({alias_node_id:alias.node_id,target_node_id:target.node_id,relation_id:coref.relation_id,candidate_ids:[target.node_id],source_span_ids:coref.evidence_span_ids});
 }
 f.tools.attachContext();buildSemanticOwnership(f,'QUALIFIED_DOMAIN_R1_FINAL');return f;
}
// Close only evidence for already eligible plans. PART_OF never creates a slot.
export function closeDomainEvidence(f){
 const ir=f.semantic_decoding.qualified_domain_ir,nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),rm=new Map(f.relations.map(r=>[r.relation_id,r]));
 for(const p of f.fact_plans){
  const seeds=new Set(p.node_ids),contents=[...seeds].map(i=>nm.get(i)?.metadata.required_content).filter(Boolean);
  const domains=ir.domains.filter(d=>seeds.has(d.endpoint_node_id)||seeds.has(d.owner_node_id)||contents.some(c=>c.domain_id===d.domain_id));
  const ids=uniq([...p.relation_ids,...domains.flatMap(d=>d.relation_ids),...contents.flatMap(c=>c.domain_relation_ids??[]),...p.node_ids.flatMap(i=>nm.get(i)?.metadata.source_identity_relation_ids??[])]);
  const nodes=uniq([...p.node_ids,...ids.flatMap(i=>{const r=rm.get(i);return [r?.head_node_id,r?.tail_node_id];}),...domains.flatMap(d=>[d.base_entity_id,d.endpoint_node_id,d.member_selector?.node_id,d.property_selector?.node_id])]);
  p.relation_ids=ids;p.node_ids=nodes;p.source_span_ids=uniq([...p.source_span_ids,...nodes.flatMap(i=>nm.get(i)?.source_span_ids??[])]);
  const e=f.eligibility_decisions.find(e=>e.eligibility_decision_id===p.eligibility_decision_id);e.candidate_relation_ids=ids;e.candidate_node_ids=nodes;e.source_span_ids=p.source_span_ids;
 }
 return f;
}
export function attachDomainProof(c){
 const ir=c.nlp_signals.semantic_decoding.qualified_domain_ir,p=c.proof_dag.nodes;
 const find=(kind,key,value)=>p.find(n=>n.kind===kind&&n[key]===value)?.id;
 for(const d of ir.domains){d.proof_refs=uniq([find('SEMANTIC_NODE','semantic_node_id',d.endpoint_node_id),find('SEMANTIC_NODE','semantic_node_id',d.base_entity_id),find('SEMANTIC_NODE','semantic_node_id',d.member_selector?.node_id),find('SEMANTIC_NODE','semantic_node_id',d.property_selector?.node_id),find('CONDITION_EXPR','expr_id',d.qualifier_expr_id),...d.relation_ids.map(i=>find('RELATION','relation_id',i)),...d.source_span_ids.map(i=>find('SOURCE_SPAN','source_span_id',i))]);}
 for(const n of c.semantic_nodes.filter(n=>n.metadata.required_content?.domain_id)){const content=n.metadata.required_content,d=ir.domains.find(d=>d.domain_id===content.domain_id);content.proof_refs=uniq([...d.proof_refs,...content.domain_relation_ids.map(i=>find('RELATION','relation_id',i))]);}
}
