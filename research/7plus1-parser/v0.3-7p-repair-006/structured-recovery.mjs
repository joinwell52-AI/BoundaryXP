import {id,uniq} from './identity.mjs';
import {boundaryDomain} from './discourse.mjs';

// Closed grammatical categories. Names/paths are source operands, never rule keys.
const artifactPattern=/(?:[\p{L}\p{N}_@.-]+\/)*[\p{L}\p{N}_@.-]+\.(?:md|rst|txt|json|ya?ml|csv|toml|py|mjs|js|ts|tsx|html|css|schema|ini|xml|sql)\b|\bREPORT-[A-Za-z0-9_-]+/gu;
const referencePattern=/https?:\/\/[^\s`<>|]+|(?:[\w.-]+\/)*[\w.-]+\.(?:md|json|ya?ml|schema|toml|py)\b|\b(?:ADR|TASK|REPORT|ISSUE|SPEC|POLICY)-[A-Za-z0-9_-]+\b|\b[a-f0-9]{7,40}\b|\bv?\d+\.(?:\d+|x)(?:\.(?:\d+|x))?(?:-[\w.]+)?\b/giu;
const actions={modify:/^(?:修改|修订|更新|改动|modify|update|revise)$/iu,create:/^(?:新建|新增|创建|生成|编写|撰写|写|写入|create|generate|write|add)$/iu,read:/^(?:读取|检查|核查|对比|审计|检查|read|inspect|check|compare|audit)$/iu};
const referenceMarkers=/(符合|遵循|按(?:照)?|依据|根据|参照|参考|见|对齐|基线|based on|according to|per\b|comply with|conforms? to|references?|baseline|commit)/giu;
const subtype=s=>/符合|遵循|comply|conform/iu.test(s)?'COMPLIES_WITH':/对齐/iu.test(s)?'VALIDATES_AGAINST':/见|参考|reference/iu.test(s)?'REFERENCES':/基线|baseline/iu.test(s)?'CURRENT_BASELINE':/commit/iu.test(s)?'PROVENANCE':'BASED_ON';
const headerRole=s=>/^(?:#|编号|id)$/iu.test(s)?'CRITERION_ID':/^(?:证据|evidence)$/iu.test(s)?'EVIDENCE':/^(?:项目|对象|接口|模块|文件|风险|item|subject|artifact|risk)$/iu.test(s)?'SUBJECT':/依据|参照|basis|reference/iu.test(s)?'BASIS':/标准|验收|acceptance|criteria/iu.test(s)?'ACCEPTANCE':/副作用|side.effect/iu.test(s)?'SIDE_EFFECT':/缓解|mitigation/iu.test(s)?'MITIGATION':/动作|action/iu.test(s)?'ACTION':/状态|现状|status|state/iu.test(s)?'STATUS':null;

export function structuredRecovery(f){
 const {node,relation,span,task,unknown}=f.tools,points=[...f.source.raw_text],getSpan=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const audit={version:'7P-REPAIR-002',artifact_roles:[],references:[],tables:[],completion:[],output_content:[],diagnostics:[]};
 f.semantic_decoding.structured_recovery=audit;f.structured_relation_authorizations=new Map();
 const text=(a,b)=>points.slice(a,b).join(''),at=(a,q,index)=>a+[...q.slice(0,index)].length;
 const mark=(r,proof)=>{if(r){r.rule_refs=uniq([...r.rule_refs,'STRUCTURED_RECOVERY']);f.structured_relation_authorizations.set(r.relation_id,proof);}return r;};
 const expr=body=>{const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.condition_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.condition_expr_nodes.push(e);return e.expr_id;};
 const ownerFor=(a,b)=>f.analyses.find(x=>x.cl.span.start<=a&&x.cl.span.end>=b)??f.analyses.find(x=>x.cl.span.start<=a&&x.cl.span.end>a);
 const cleanRange=(a,b)=>{while(a<b&&/[\s`*|]/u.test(points[a]))a++;while(b>a&&/[\s`*|。；;]/u.test(points[b-1]))b--;return [a,b];};
 const references=(a,start,end,head,relationType,evidence,proof=null)=>{
  const q=text(start,end),out=[];
  for(const m of q.matchAll(referencePattern)){const s=at(start,q,m.index),e=s+[...m[0]].length;
   // A commit provenance predicate requires its own hash argument. A later version or ADR
   // in a parenthesis is not the commit's object, even inside the same table cell.
   if(relationType==='PROVENANCE'&&(!/^[a-f0-9]{7,40}$/iu.test(m[0])||!/^[\s`*:#]*$/u.test(text(start,s)))){
    audit.diagnostics.push({code:'REFERENCE_ARGUMENT_TYPE_OR_ATTACHMENT_MISMATCH',relation_type:relationType,source_span_ids:[span(s,e),...evidence]});continue;
   }
   const n=node(a.cl,'REFERENCE',s,e,{sense:'STRUCTURED_REFERENCE',reference_kind:/^(ADR|TASK|REPORT|ISSUE|SPEC|POLICY)-/iu.exec(m[0])?.[1]?.toUpperCase()??(/https?:/iu.test(m[0])?'URI_REFERENCE':/^[a-f0-9]{7,40}$/iu.test(m[0])?'COMMIT':/^v?\d/u.test(m[0])?'VERSION':'FILE_REFERENCE'),reference_relation:relationType,discourse:a.discourse});
   const r=relation(a.cl,'BASIS',head,n,evidence);if(proof)mark(r,proof);
   audit.references.push({reference_node_id:n.node_id,head_node_id:head.node_id,relation_id:r.relation_id,relation_type:relationType,source_span_ids:uniq([...evidence,...n.source_span_ids]),...(proof?{structural_proof:proof}:{})});out.push(n);
  }return out;
 };

 // Frontmatter reference fields own scalar/array values through their markup block.
 const keys={ref_adr:'BASED_ON',ref_charter:'BASED_ON',ref_predecessor:'PREDECESSOR',references:'REFERENCES',related:'RELATED_REFERENCE',supersedes:'SUPERSEDES'};
 for(const annotation of f.discourse.annotations.filter(x=>x.kind==='METADATA')){
  const q=annotation.source_span.quote.trimEnd(),m=/^\s*(ref_[a-z_]+|references|related|supersedes)\s*:\s*(.*)$/iu.exec(q);if(!m||!keys[m[1].toLowerCase()])continue;
  const a=ownerFor(annotation.source_span.start,annotation.source_span.start+1);if(!a)continue;
  const start=at(annotation.source_span.start,q,m[0].length-m[2].length),proof={kind:'FRONTMATTER_REFERENCE_FIELD',structure_id:annotation.structure_id,field:m[1],source_span_ids:[span(annotation.source_span.start,start)]};
  references(a,start,annotation.source_span.end,task,keys[m[1].toLowerCase()],[a.sid,...proof.source_span_ids],proof);
  if(!m[2].trim())for(const child of f.discourse.annotations.filter(x=>x.source_span.start>=annotation.source_span.end&&x.kind==='METADATA')){
   if(!/^\s*[-*]\s+/u.test(child.source_span.quote))break;
   const b=f.analyses.find(x=>x.discourse.structure_id===child.structure_id);if(b)references(b,child.source_span.start,child.source_span.end,task,keys[m[1].toLowerCase()],[a.sid,b.sid],{...proof,child_structure_id:child.structure_id});
  }
 }
 // Explicit reference predicates use their clause domain; bare literals are not basis.
 for(const a of f.analyses.filter(a=>boundaryDomain(a.discourse))){
  const q=a.cl.span.quote,markers=[...q.matchAll(referenceMarkers)];
  for(const m of markers){const start=at(a.cl.span.start,q,m.index+m[0].length),end=a.cl.span.end;
   references(a,start,end,task,subtype(m[0]),[a.sid,span(at(a.cl.span.start,q,m.index),start)]);
  }
 }

 // Table recovery is a row bundle with header provenance. The TABLE gate stays closed.
 const anns=f.discourse.annotations;
 for(const row of anns.filter(x=>x.kind==='TABLE'&&x.cells?.length&&x.row_id!==x.header_row_id)){
  const header=anns.find(x=>x.row_id===row.header_row_id),roles=header?.cells.map(c=>headerRole(c.source_span.quote.replace(/[`*]/gu,'').trim()));
  const record={table_id:row.table_id,row_id:row.row_id,header_row_id:row.header_row_id,source_span_ids:[span(row.source_span.start,row.source_span.end)],cells:row.cells,roles:roles??[],relation_ids:[],status:'STRUCTURED_TABLE_UNRESOLVED'};audit.tables.push(record);
  if(header&&header.cells.length===row.cells.length&&roles.every(Boolean)&&roles.filter(r=>r==='CRITERION_ID').length===1&&roles.filter(r=>r==='ACCEPTANCE').length===1&&row.inherited_kind==='ACCEPTANCE'){
   record.status='ACCEPTANCE_ROW';record.criterion_cell=row.cells[roles.indexOf('ACCEPTANCE')];record.criterion_id_cell=row.cells[roles.indexOf('CRITERION_ID')];record.header_source_span_ids=header.cells.map(c=>span(c.source_span.start,c.source_span.end));continue;
  }
  if(!header||header.cells.length!==row.cells.length||roles.some(r=>!r)||roles.filter(r=>r==='SUBJECT').length!==1||!boundaryDomain({kind:row.inherited_kind})){record.reason='UNKNOWN_HEADER_OR_NON_CURRENT_OR_NON_UNIQUE_SUBJECT';continue;}
  const subjectCell=row.cells[roles.indexOf('SUBJECT')],a=ownerFor(subjectCell.source_span.start,subjectCell.source_span.start+1)??f.analyses.find(a=>a.discourse.row_id===row.row_id);if(!a){record.reason='ROW_WITHOUT_CLAUSE';continue;}
  const [ss,se]=cleanRange(subjectCell.source_span.start,subjectCell.source_span.end);if(ss>=se){record.reason='EMPTY_SUBJECT';continue;}
  const head=node(a.cl,'DISCOURSE',ss,se,{sense:'TABLE_ROW_SUBJECT',discourse:a.discourse,table_row_id:row.row_id});
  for(let i=0;i<row.cells.length;i++){
   if(roles[i]==='SUBJECT')continue;const cell=row.cells[i],h=header.cells[i],q=cell.source_span.quote,proof={kind:'TABLE_ROW_PROPOSITION',table_id:row.table_id,row_id:row.row_id,cell_id:cell.cell_id,column_id:cell.column_id,header_cell_id:h.cell_id,subject_node_id:head.node_id,source_span_ids:[span(subjectCell.source_span.start,subjectCell.source_span.end),span(h.source_span.start,h.source_span.end),span(cell.source_span.start,cell.source_span.end)]};
   if(roles[i]==='BASIS')references(a,cell.source_span.start,cell.source_span.end,head,'BASED_ON',proof.source_span_ids,proof);
   else if(['MITIGATION','STATUS','SIDE_EFFECT','ACTION'].includes(roles[i]))for(const m of q.matchAll(referenceMarkers))references(a,at(cell.source_span.start,q,m.index+m[0].length),cell.source_span.end,head,subtype(m[0]),proof.source_span_ids,proof);
   const [cs,ce]=cleanRange(cell.source_span.start,cell.source_span.end);
   if(cs<ce){const n=node(a.cl,'STATE',cs,ce,{sense:'TABLE_'+roles[i],discourse:a.discourse,structural_role:roles[i],table_provenance:proof,owner:head.node_id});record.cells[i]={...cell,semantic_node_id:n.node_id,header_role:roles[i]};}
  }
  record.relation_ids=audit.references.filter(x=>x.structural_proof?.row_id===row.row_id).map(x=>x.relation_id);record.status=record.relation_ids.length?'ROW_PROPOSITION_RECOVERED':'TYPED_ROW_WITHOUT_BOUNDARY_RELATION';
  f.relation_bundles.push({bundle_id:id(f.source.sha256,'row-bundle',row.row_id),clause_ids:uniq(f.analyses.filter(a=>a.discourse.row_id===row.row_id).map(a=>a.cl.id)),relation_ids:record.relation_ids,bundle_state:'RESOLVED',unresolved_refs:[]});
 }

 // Artifact roles require a local predicate and complete protected object, never file presence alone.
 for(const a of f.analyses){const q=a.cl.span.quote;
  const matches=[...q.matchAll(artifactPattern)];
  for(const m of matches){const start=at(a.cl.span.start,q,m.index),end=start+[...m[0]].length;
   let role=!boundaryDomain(a.discourse)?a.discourse.kind==='OUTPUT_CONTENT'?'OUTPUT_CONTENT_REFERENCE':'BACKGROUND_REFERENCE':'UNRESOLVED_ARTIFACT_ROLE';
   const governing=a.events.filter(e=>getSpan(e).end<=start&&e.metadata.candidate_disposition!=='REJECTED').sort((x,y)=>getSpan(y).end-getSpan(x).end)[0];
   let event=governing,mode=event&&Object.entries(actions).find(([,rx])=>rx.test(event.surface))?.[0];
   // A leading imperative may be absent from model vocabulary; only a closed verb category is recovered.
   if(boundaryDomain(a.discourse)&&!a.scope){
    const lead=/^\s*(?:[-*+]\s+|\d+[.)]\s+)?(?:\*\*)?(?:请\s*)?(新建|新增|创建|生成|编写|撰写|写入|写|修改|修订|更新|读取|检查|核查|对比|审计|create|generate|write|add|modify|update|revise|read|inspect|check|compare|audit)\s*/iu.exec(q);
    if(lead&&at(a.cl.span.start,q,lead[0].length)<=start){const ps=at(a.cl.span.start,q,lead[0].lastIndexOf(lead[1]));
     if(!governing){event=node(a.cl,'EVENT',ps,ps+[...lead[1]].length,{sense:'ARTIFACT_OPERATION',modality:'REQUIRED',discourse:a.discourse,owner:a.cl.id});a.events.push(event);mode=Object.entries(actions).find(([,rx])=>rx.test(lead[1]))?.[0];}
     else if(getSpan(governing).start===ps&&mode&&governing.metadata.modality==='UNSTATED'){governing.metadata.modality='REQUIRED';governing.metadata.imperative_source_span_id=span(ps,ps+[...lead[1]].length);if(governing.metadata.modality_unresolved){f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==governing.metadata.modality_unresolved);delete governing.metadata.modality_unresolved;}}
    }
   }
   const basis=audit.references.some(r=>r.source_span_ids.some(sid=>{const s=f.source_spans.find(s=>s.span_id===sid);return s.start===start&&s.end===end;}));
   if(basis&&role==='UNRESOLVED_ARTIFACT_ROLE')role='REFERENCE_ONLY';
   if(boundaryDomain(a.discourse)&&mode&&event&&['REQUIRED','PERMITTED'].includes(event.metadata.modality)&&!event.metadata.restrict&&!basis){
    const between=text(getSpan(event).end,start);
    if(!/[：:]/u.test(between)&&!/(?:例如|比如|such as|e\.g\.)/iu.test(between)){
     const artifact=f.relations.filter(r=>r.head_node_id===event.node_id&&r.state==='RESOLVED'&&['RESULT','PATIENT','THEME'].includes(r.relation_type)).map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)).find(n=>n.node_type==='ENTITY'&&getSpan(n).start===start&&getSpan(n).end===end)??node(a.cl,'ENTITY',start,end,{literal_tag:'FILEPATH',sense:'ARTIFACT',discourse:a.discourse,owner:event.node_id});
     const plan=f.expression_plans.get(event.node_id)??{},roles=mode==='modify'?['MODIFICATION_TARGET','UPDATED_OUTPUT']:mode==='read'?['READ_ONLY_INPUT']:plan.condition_expr_id?['CONDITIONAL_OUTPUT']:/^REPORT-/iu.test(m[0])?['REPORT_OUTPUT']:/\btest[_./-]|tests?\//iu.test(m[0])?['TEST_OUTPUT']:['GENERATED_OUTPUT'];
     artifact.metadata.artifact_roles=roles;artifact.metadata.artifact_identity=id(f.source.sha256,'artifact',m[0]);artifact.metadata.role_transition=mode==='modify'?{before:'EXISTING_INPUT',after:'UPDATED_OUTPUT',same_artifact:true}:null;
     // Replace partial/duplicate literal relations for the same explicitly delimited object only.
     const replaced=[];
     for(const r of f.relations.filter(r=>r.head_node_id===event.node_id&&['PATIENT','RESULT'].includes(r.relation_type))){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),s=getSpan(n);if(n.node_id!==artifact.node_id&&s.start>=start&&s.end<=end){r.state='REJECTED';replaced.push(r.tail_node_id);}}
     if(mode!=='read'){
      // An updated artifact is both patient and result; a single semantic node occupies both roles.
      relation(a.cl,'RESULT',event,artifact,[a.sid]);
     }else relation(a.cl,'PATIENT',event,artifact,[a.sid]);
     if(replaced.length&&plan.scope_expr_id){
      const r=f.relations.find(r=>r.head_node_id===event.node_id&&r.tail_node_id===artifact.node_id&&r.state==='RESOLVED'&&['RESULT','PATIENT'].includes(r.relation_type));
      const rewrite=eid=>{const old=f.expressions.set_expr_nodes.find(x=>x.expr_id===eid);if(!old)return eid;let body;
       if(old.kind==='ITEM'&&replaced.includes(old.entity_node_id))body={kind:'ITEM',entity_node_id:artifact.node_id,source_span_ids:artifact.source_span_ids,relation_ids:[r.relation_id]};
       else if(old.operand_expr_ids){const children=old.operand_expr_ids.map(rewrite);body={...old,operand_expr_ids:children,relation_ids:uniq([...old.relation_ids.filter(i=>f.relations.find(r=>r.relation_id===i)?.state!=='REJECTED'),r.relation_id])};delete body.expr_id;}else return eid;
       const next={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===next.expr_id))f.expressions.set_expr_nodes.push(next);return next.expr_id;
      };plan.scope_expr_id=rewrite(plan.scope_expr_id);f.expression_plans.set(event.node_id,plan);
     }
     if(mode!=='create'){
      const r=relation(a.cl,'SCOPE_MEMBER',event,artifact,[a.sid]),body={kind:'ITEM',entity_node_id:artifact.node_id,source_span_ids:artifact.source_span_ids,relation_ids:[r.relation_id]},e={expr_id:id(f.source.sha256,'expr',body),...body};
      if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===e.expr_id))f.expressions.set_expr_nodes.push(e);f.relation_scope_plans.set(r.relation_id,e.expr_id);
     }
     role=roles[0];a.handled=true;audit.artifact_roles.push({artifact_node_id:artifact.node_id,event_node_id:event.node_id,roles,source_span_ids:uniq([a.sid,...artifact.source_span_ids,...event.source_span_ids]),condition_expr_id:plan.condition_expr_id??null});continue;
    }
   }
   audit.artifact_roles.push({source_span_ids:[span(start,end)],roles:[role]});
  }
 }

 // Acceptance lists express conjunction by section/checklist semantics, not by nearest text.
 const acceptanceHeaders=anns.filter(x=>x.heading_marker_span&&x.kind==='ACCEPTANCE');
 for(const header of acceptanceHeaders){
  const children=anns.filter(x=>x.structure_id!==header.structure_id&&x.structural_path.includes(header.structure_id)&&x.kind==='ACCEPTANCE'&&/^\s*(?:[-*+]\s+(?:\[[ xX]\]\s*)?|\d+[.)]\s+|A\d+\s*[.:：])/u.test(x.source_span.quote));
  const atoms=[];
  for(const child of children){
   // A criterion owns its explicit list subtree, including indented continuation lines.
   // No neighboring unindented paragraph is borrowed. Nested criteria stay one parent operand.
   if(children.some(p=>p!==child&&child.structural_path.includes(p.structure_id)))continue;
   const a=f.analyses.find(a=>a.discourse.structure_id===child.structure_id);if(!a)continue;
   const subtree=anns.filter(x=>x.structural_path.includes(child.structure_id)),end=Math.max(child.source_span.end,...subtree.map(x=>x.source_span.end)),[s,e]=cleanRange(child.source_span.start,end),n=node(a.cl,'STATE',s,e,{sense:'ACCEPTANCE_CRITERION',discourse:a.discourse,owner:header.structure_id,completion_kind:'ATOMIC_COMPLETION',structural_path:child.structural_path,continuation_structure_ids:subtree.map(x=>x.structure_id),continuation_source_span_ids:subtree.map(x=>span(x.source_span.start,x.source_span.end))});
   atoms.push({a,n,expr:expr({op:'STATE_REF',state_node_id:n.node_id,source_span_ids:uniq([...n.source_span_ids,...n.metadata.continuation_source_span_ids]),relation_ids:[]})});
  }
  for(const row of audit.tables.filter(x=>x.status==='ACCEPTANCE_ROW'&&anns.find(y=>y.row_id===x.row_id)?.structural_path.includes(header.structure_id))){
   const cell=row.criterion_cell,a=f.analyses.find(a=>a.discourse.row_id===row.row_id);if(!a)continue;const [s,e]=cleanRange(cell.source_span.start,cell.source_span.end),n=node(a.cl,'STATE',s,e,{sense:'ACCEPTANCE_CRITERION',discourse:a.discourse,owner:header.structure_id,completion_kind:'ATOMIC_COMPLETION',table_provenance:{table_id:row.table_id,row_id:row.row_id,cell_id:cell.cell_id,column_id:cell.column_id,header_source_span_ids:row.header_source_span_ids},criterion_label:row.criterion_id_cell.source_span.quote.trim()});atoms.push({a,n,expr:expr({op:'STATE_REF',state_node_id:n.node_id,source_span_ids:uniq([...n.source_span_ids,...row.header_source_span_ids,...row.source_span_ids]),relation_ids:[]})});
  }
  if(!atoms.length)continue;
  const a=f.analyses.find(a=>a.discourse.structure_id===header.structure_id)??atoms[0].a,n=node(a.cl,'EVENT',header.source_span.start,header.source_span.end,{sense:'ACCEPTANCE_COMPLETION',modality:'REQUIRED',completion:true,discourse:a.discourse,owner:header.structure_id,completion_kind:/任一|任何一|any.of/iu.test(header.source_span.quote)?'ANY_OF':'ALL_OF'}),rs=atoms.map(x=>relation(a.cl,'COMPLETION_OF',x.n,n,[...x.n.source_span_ids,span(header.source_span.start,header.source_span.end)]));
  const condition=expr({op:n.metadata.completion_kind==='ANY_OF'?'OR':'AND',operand_expr_ids:atoms.map(x=>x.expr),source_span_ids:uniq([span(header.source_span.start,header.source_span.end),...atoms.flatMap(x=>x.n.source_span_ids)]),relation_ids:rs.map(r=>r.relation_id)});a.events.push(n);f.expression_plans.set(n.node_id,{condition_expr_id:condition});
  audit.completion.push({event_node_id:n.node_id,kind:n.metadata.completion_kind,condition_expr_id:condition,criterion_node_ids:atoms.map(x=>x.n.node_id),source_span_ids:uniq(rs.flatMap(r=>r.evidence_span_ids)),structural_path:header.structural_path});
  const count=/(\d+)\s*(?:条|项|criteria)/iu.exec(header.source_span.quote);
  if(count){n.metadata.counted_criteria_reference={kind:'COUNTED_CRITERIA_REFERENCE',declared_count:Number(count[1]),criterion_node_ids:atoms.map(x=>x.n.node_id),status:Number(count[1])===atoms.length?'RESOLVED':'COUNT_MISMATCH'};if(Number(count[1])!==atoms.length){const p=f.expression_plans.get(n.node_id);p.unresolved_ref=unknown(a.cl,'UNRESOLVED_SCOPE','Declared acceptance count differs from explicit structural criterion count',[n.node_id]);}}
 }
 // Explicit completion equality/count references preserve the whole criterion and its local operator.
 for(const a of f.analyses.filter(a=>boundaryDomain(a.discourse))){const q=a.cl.span.quote;
  const only=/^(?:只有(?:当)?|only (?:if|when)\s+)(.+?)(?:才(?:算|视为)?完成|then (?:the task is )?complete)$/iu.exec(q);
  if(only&&!a.events.some(e=>e.metadata.completion)){
   const offset=at(a.cl.span.start,q,only.index+only[0].indexOf(only[1])),connectors=[...only[1].matchAll(/并且|且|或(?:者)?|\bAND\b|\bOR\b/giu)],ops=uniq(connectors.map(m=>/或|OR/iu.test(m[0])?'OR':'AND'));
   if(ops.length>1){unknown(a.cl,'UNRESOLVED_SCOPE','Mixed completion operators need explicit grouping');continue;}
   const ranges=[];let begin=offset;for(const m of connectors){const end=at(offset,only[1],m.index);ranges.push([begin,end]);begin=end+[...m[0]].length;}ranges.push([begin,offset+[...only[1]].length]);
   const states=ranges.map(([s,e])=>node(a.cl,'STATE',s,e,{sense:'LOCAL_COMPLETION_OPERAND',discourse:a.discourse,owner:a.cl.id})),event=node(a.cl,'EVENT',a.cl.span.start,a.cl.span.end,{sense:'ONLY_IF_COMPLETION',completion:true,modality:'REQUIRED',discourse:a.discourse,owner:a.cl.id,completion_kind:'CONDITIONAL_COMPLETION'}),rs=states.map(s=>relation(a.cl,'COMPLETION_OF',s,event,[a.sid])),refs=states.map((s,i)=>expr({op:'STATE_REF',state_node_id:s.node_id,source_span_ids:s.source_span_ids,relation_ids:[rs[i].relation_id]})),condition=refs.length===1?refs[0]:expr({op:ops[0],operand_expr_ids:refs,source_span_ids:[a.sid],relation_ids:rs.map(r=>r.relation_id)});
   a.events.push(event);a.handled=true;f.expression_plans.set(event.node_id,{condition_expr_id:condition});audit.completion.push({event_node_id:event.node_id,kind:'CONDITIONAL_COMPLETION',condition_expr_id:condition,source_span_ids:[a.sid]});continue;
  }
  if(!/(?:才(?:算)?完成|才算(?:结束|成功)|以下条件均满足|acceptance criteria.*(?:all|satisfied)|(?:验收|acceptance).*(?:全满足|全部通过)|测试全绿|push\s*成功|P\d+\s*=\s*0)/iu.test(q))continue;
  if(a.discourse.kind==='ACCEPTANCE'||a.events.some(e=>e.metadata.completion)||/才(?:算)?完成/iu.test(q))continue;
  const n=node(a.cl,'EVENT',a.cl.span.start,a.cl.span.end,{sense:'EXPLICIT_COMPLETION',completion:true,modality:'REQUIRED',discourse:a.discourse,owner:a.cl.id,completion_kind:'ATOMIC_COMPLETION'}),s=node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'COMPLETION_REQUIREMENT',discourse:a.discourse,owner:n.node_id});
  const r=relation(a.cl,'COMPLETION_OF',s,n,[a.sid]),condition=expr({op:'STATE_REF',state_node_id:s.node_id,source_span_ids:[a.sid],relation_ids:[r.relation_id]});a.events.push(n);f.expression_plans.set(n.node_id,{condition_expr_id:condition});audit.completion.push({event_node_id:n.node_id,kind:'ATOMIC_COMPLETION',condition_expr_id:condition,source_span_ids:[a.sid]});
 }

 // Ownership is restricted to authored output groups. Locale siblings require a shared authoring head.
 const outputs=f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='RESOLVED').map(r=>({r,e:f.semantic_nodes.find(n=>n.node_id===r.head_node_id),n:f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)})).filter(x=>boundaryDomain(x.e.metadata.discourse)&&['REQUIRED','PERMITTED'].includes(x.e.metadata.modality));
 const explicit=outputs.filter(x=>x.e.metadata.authored_document),files=explicit.filter(x=>/\.[a-z]{1,8}$/iu.test(x.n.surface)&&!/[\s，]/u.test(x.n.surface)),candidatePool=files.length?files:explicit.length?explicit:outputs;
 const pool=[...new Map(candidatePool.map(x=>[x.n.node_id,x])).values()];
 const bilingual=pool.length===2&&pool[0].e.node_id===pool[1].e.node_id&&pool.every(x=>/\.(?:zh|en)\.md$/iu.test(x.n.surface))&&pool[0].n.surface.replace(/\.(?:zh|en)\.md$/iu,'.md')===pool[1].n.surface.replace(/\.(?:zh|en)\.md$/iu,'.md');
 const ownership=pool.length===1?'UNIQUE_OUTPUT':bilingual?'OUTPUT_SET':'UNRESOLVED_OUTPUT_SET',owners=ownership==='UNRESOLVED_OUTPUT_SET'?[]:pool.map(x=>x.n.node_id);
 // Authored section labels are content obligations, with a structural subtree as their payload.
 // They are not execution commands and never receive current-task eligibility.
 for(const section of anns.filter(a=>a.kind==='OUTPUT_CONTENT'&&/^\s*(?:#{1,6}\s+|\*\*§\s*\d+|§\s*\d+)/u.test(a.source_span.quote))){
  const a=f.analyses.find(a=>a.discourse.structure_id===section.structure_id);if(!a)continue;
  const subsequent=anns.filter(x=>x.source_span.start>section.source_span.start),next=subsequent.find(x=>(x.kind!=='OUTPUT_CONTENT'&&x.inherited_kind!=='OUTPUT_CONTENT'&&x.source_span.quote.trim())||/^\s*(?:#{1,6}\s+|\*\*§\s*\d+|§\s*\d+)/u.test(x.source_span.quote)),end=next?.source_span.start??points.length;
  const n=node(a.cl,'DISCOURSE',section.source_span.start,section.source_span.end,{sense:'OUTPUT_CONTENT_SECTION',modality:'REQUIRED',discourse:{...a.discourse,kind:'OUTPUT_CONTENT'},owner_output_ids:owners,authoring_relation_ids:pool.map(x=>x.r.relation_id)});
  const children=f.semantic_decoding.discourse.output_content_requirements.filter(r=>r.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s.start>=section.source_span.start&&s.start<end;}));
  f.semantic_decoding.discourse.output_content_requirements.push({requirement_id:id(f.source.sha256,'content-section',section.structure_id),scope:'OUTPUT_CONTENT',kind:'SECTION_CONTENT_REQUIREMENT',modality:'REQUIRED',clause_id:a.cl.id,structural_path:section.structural_path,source_span_ids:[...n.source_span_ids,span(section.source_span.start,end)],semantic_node_ids:[n.node_id],relation_ids:[],child_requirement_ids:children.map(x=>x.requirement_id),content_parsing_status:'STRUCTURED_CONTENT_REQUIREMENT'});
 }
 for(const req of f.semantic_decoding.discourse.output_content_requirements){req.ownership_status=ownership;req.owner_output_ids=owners;req.owning_output_candidates=pool.map(x=>x.n.node_id);req.ownership_evidence_relation_ids=owners.length?pool.map(x=>x.r.relation_id):[];req.content_components=req.semantic_node_ids.map(i=>f.semantic_nodes.find(n=>n.node_id===i)).filter(Boolean).map(n=>({node_id:n.node_id,type:n.node_type,scope:'OUTPUT_CONTENT',owner_output_ids:owners,source_span_ids:n.source_span_ids}));audit.output_content.push(req);}
 for(const r of audit.tables.filter(x=>x.status==='STRUCTURED_TABLE_UNRESOLVED'))audit.diagnostics.push({code:'STRUCTURED_TABLE_UNRESOLVED',row_id:r.row_id,reason:r.reason,source_span_ids:r.source_span_ids});
 return f;
}
