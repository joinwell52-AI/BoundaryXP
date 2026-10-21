import {id,uniq} from './identity.mjs';
import {VERBS} from './frontend.mjs';
// Only explicit operational headers license cross-cell arguments. Status, risk
// and arbitrary prose tables do not acquire task actions by visual adjacency.
const role=q=>/^(?:动作|操作|action|operation)$/iu.test(q)?'ACTION':/^(?:对象|作用对象|目标|文件|object|target|file)$/iu.test(q)?'OBJECT':/^(?:执行者|执行人|performer|executor)$/iu.test(q)?'PERFORMER':/^(?:条件|前提|condition|precondition)$/iu.test(q)?'CONDITION':null;
const modes=[['不需要','NOT_REQUIRED'],['无需','NOT_REQUIRED'],['need not','NOT_REQUIRED'],['不得','FORBIDDEN'],['禁止','FORBIDDEN'],['do not','FORBIDDEN'],['must not','FORBIDDEN'],['可以','PERMITTED'],['允许','PERMITTED'],['may','PERMITTED'],['必须','REQUIRED'],['须','REQUIRED'],['must','REQUIRED'],['shall','REQUIRED']];
function operation(q){let rest=q,mode;for(const [surface,m] of modes)if(rest.toLowerCase().startsWith(surface)){mode=m;rest=rest.slice(surface.length).trim();break;}const found=Object.entries(VERBS).find(([,words])=>words.some(w=>w.toLowerCase()===rest.toLowerCase()));return found?{sense:found[0],text:rest,mode}:null;}
export function closeTableInstructions(f){
 const {node,relation,span,unknown,task}=f.tools,cp=[...f.source.raw_text],audit={frames:[],unsupported:[]};f.semantic_decoding.table_instructions=audit;
 const clean=cell=>{let s=cell.source_span.start,e=cell.source_span.end;while(s<e&&/\s/u.test(cp[s]))s++;while(e>s&&/\s/u.test(cp[e-1]))e--;if(cp[s]==='`'&&cp[e-1]==='`'){s++;e--;}return {start:s,end:e,text:cp.slice(s,e).join('')};};
 const expression=(body,condition=false)=>{const value={expr_id:id(f.source.sha256,'expr',body),...body},registry=condition?f.expressions.condition_expr_nodes:f.expressions.set_expr_nodes;if(!registry.some(x=>x.expr_id===value.expr_id))registry.push(value);return value.expr_id;};
 for(const row of f.discourse.annotations.filter(a=>a.kind==='TABLE'&&a.row_id!==a.header_row_id)){
  if(f.doc.structure.nodes.find(n=>n.id===row.structure_id)?.type==='TABLE_ALIGNMENT')continue;
  const header=f.discourse.annotations.find(a=>a.row_id===row.header_row_id),roles=header?.cells.map(c=>role(clean(c).text));
  if(!roles?.includes('ACTION')||!roles.includes('OBJECT'))continue;
  const a=f.analyses.find(a=>a.discourse.row_id===row.row_id),eligible=['CURRENT_TASK','DELIVERABLE_SPEC','OUTPUT_CONTENT'].includes(row.inherited_kind);
  if(!a||!eligible)continue;
  const record={frame_id:id(f.source.sha256,'operational-table-row',row.row_id),table_id:row.table_id,row_id:row.row_id,header_row_id:row.header_row_id,structural_path:row.structural_path,source_span_ids:[span(row.source_span.start,row.source_span.end),...header.cells.map(c=>span(c.source_span.start,c.source_span.end))],state:'UNRESOLVED',relation_ids:[],cell_provenance:row.cells.map((c,i)=>({cell_id:c.cell_id,column_id:c.column_id,header_cell_id:c.header_cell_id,role:roles[i],cell_span_id:span(c.source_span.start,c.source_span.end),header_span_id:header.cells[i]?span(header.cells[i].source_span.start,header.cells[i].source_span.end):null}))};
  audit.frames.push(record);
  const fail=reason=>{record.reason=reason;record.unresolved_ref=unknown(a.cl,'UNRESOLVED_RELATION',reason);audit.unsupported.push(record.frame_id);};
  if(row.cells.length!==header.cells.length||roles.filter(r=>r==='ACTION').length!==1||roles.filter(r=>r==='OBJECT').length!==1||roles.filter(r=>r==='PERFORMER').length>1||roles.filter(r=>r==='CONDITION').length>1){fail('OPERATIONAL_TABLE_ROLE_CARDINALITY');continue;}
  const action=clean(row.cells[roles.indexOf('ACTION')]),target=clean(row.cells[roles.indexOf('OBJECT')]),op=operation(action.text);
  if(!op||!target.text||/[\n\r]|[，、;；+]|\s和\s|\s与\s|\band\b|\bor\b/iu.test(target.text)||/^(?:上述|该|其|它|this\b|that\b|these\b|those\b|it\b)/iu.test(target.text)){fail('OPERATION_OR_OBJECT_CELL_NOT_LOCALLY_COMPLETE');continue;}
  if(!op.mode&&row.inherited_kind!=='DELIVERABLE_SPEC'){fail('TABLE_ACTION_MODALITY_NOT_EXPLICIT');continue;}
  const mode=op.mode??'REQUIRED',predicateStart=action.end-[...op.text].length,domain={...a.discourse,kind:row.inherited_kind,table_frame_id:record.frame_id},event=node(a.cl,'EVENT',predicateStart,action.end,{sense:op.sense,owner:record.frame_id,modality:mode,discourse:domain,table_provenance:record,modality_source_span_ids:[span(action.start,action.end)]}),object=node(a.cl,'ENTITY',target.start,target.end,{sense:'TABLE_OPERATION_OBJECT',owner:record.frame_id,discourse:domain,table_provenance:record,technical_type:/[*?]/u.test(target.text)?'FILE_PATTERN':/\.[\p{L}\p{N}]+$/u.test(target.text)?'FILE':'SOURCE_OBJECT'});
  record.event_node_id=event.node_id;record.object_node_id=object.node_id;
  // The current task domain is authorized by header roles plus inherited
  // instruction scope, not by converting unrelated table clauses wholesale.
  const originalDiscourse=a.discourse;a.discourse=domain;
  const add=(kind,head,tail)=>{const r=relation(a.cl,kind,head,tail,record.source_span_ids);if(r){r.rule_refs=uniq([...r.rule_refs,record.frame_id,'EXPLICIT_OPERATIONAL_TABLE_HEADERS']);record.relation_ids.push(r.relation_id);}return r;};
  const argument=add(mode==='FORBIDDEN'?'FORBIDS':op.sense==='generate'?'RESULT':'PATIENT',event,object);
  const scope=expression({kind:object.metadata.technical_type==='FILE_PATTERN'?'ALL':'ITEM',...(object.metadata.technical_type==='FILE_PATTERN'?{base_entity_node_id:object.node_id}:{entity_node_id:object.node_id}),source_span_ids:uniq([...object.source_span_ids,...record.source_span_ids]),relation_ids:[argument.relation_id]});f.expression_plans.set(event.node_id,{scope_expr_id:scope});
  if(['REQUIRED','PERMITTED'].includes(mode)&&['read','review','modify'].includes(op.sense)){const r=add('SCOPE_MEMBER',task,object);f.relation_scope_plans.set(r.relation_id,expression({kind:object.metadata.technical_type==='FILE_PATTERN'?'ALL':'ITEM',...(object.metadata.technical_type==='FILE_PATTERN'?{base_entity_node_id:object.node_id}:{entity_node_id:object.node_id}),source_span_ids:object.source_span_ids,relation_ids:[r.relation_id]}));}
  if(['REQUIRED','PERMITTED'].includes(mode)&&op.sense==='modify'){object.metadata.artifact_roles=['MODIFICATION_TARGET','UPDATED_OUTPUT'];object.metadata.role_transition={before:'EXISTING_INPUT',after:'UPDATED_OUTPUT',same_artifact:true};add('RESULT',event,object);}
  if(roles.includes('PERFORMER')){const actorCell=clean(row.cells[roles.indexOf('PERFORMER')]);if(actorCell.text){if(/^(?:待定|未知|未指定|unknown|TBD)$/iu.test(actorCell.text)||/[，、;；]|\band\b|\bor\b/iu.test(actorCell.text))record.performer_unresolved_ref=unknown(a.cl,'UNRESOLVED_COREFERENCE','Table performer is unstated or has no unique local participant domain',[event.node_id]);else if(mode!=='NOT_REQUIRED'){const actor=node(a.cl,'ENTITY',actorCell.start,actorCell.end,{sense:'EXPLICIT_TABLE_PERFORMER',owner:record.frame_id,discourse:domain,participant_roles:['PERFORMER'],participant_eligibility:{eligible:true,reason:'EXPLICIT_PERFORMER_COLUMN'},table_provenance:record});add('AGENT',event,actor);}}}
  if(roles.includes('CONDITION')){const cell=clean(row.cells[roles.indexOf('CONDITION')]);if(cell.text){const state=node(a.cl,'STATE',cell.start,cell.end,{sense:'TABLE_PRECONDITION',owner:record.frame_id,discourse:domain,table_provenance:record,polarity:/未|没有|\bnot\b|\bno\b/iu.test(cell.text)?'NEGATIVE':'POSITIVE'}),r=add('CONDITION_OF',state,event),p=f.expression_plans.get(event.node_id);p.condition_expr_id=expression({op:'STATE_REF',state_node_id:state.node_id,source_span_ids:uniq([...state.source_span_ids,...record.source_span_ids]),relation_ids:[r.relation_id]},true);}}
  if(!a.events.includes(event))a.events.push(event);record.state='CERTIFIED';a.handled=true;
  for(const local of f.analyses.filter(x=>x.discourse.row_id===row.row_id)){if(!local.events.length){local.handled=true;local.table_role_accountability={frame_id:record.frame_id,source_span_ids:[local.sid,...record.source_span_ids]};}}
  record.source_discourse_kind=originalDiscourse.kind;
  f.relation_bundles.push({bundle_id:id(record.frame_id,'bundle'),clause_ids:[a.cl.id],relation_ids:record.relation_ids,bundle_state:'RESOLVED',unresolved_refs:[]});
 }
 return f;
}
