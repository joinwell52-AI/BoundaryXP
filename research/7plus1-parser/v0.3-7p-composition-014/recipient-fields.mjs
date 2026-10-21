import {boundaryDomain} from './discourse.mjs';import {id} from './identity.mjs';
// Explicit role labels bind an identity to the task. Identifier spelling,
// report filenames and job titles are never used to infer Authority.
export function closeRecipientFields(f){
 const audit={fields:[]};f.semantic_decoding.recipient_fields=audit;
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse)&&a.discourse.kind!=='METADATA')continue;
  const q=a.cl.span.quote,m=/^\s*(?:报告接收者|汇报对象|report recipient|report_to|to|recipient)\s*[:：]\s*([^\r\n]+?)\s*$/iu.exec(q);if(!m)continue;if(/^\s*(?:to|recipient)\s*:/iu.test(q)&&a.discourse.kind!=='METADATA')continue;
  const value=m[1],start=a.cl.span.start+[...q.slice(0,m.index+m[0].indexOf(value))].length,end=start+[...value].length,record={field_id:id(f.source.sha256,'recipient-field',a.cl.id),source_span_ids:[a.sid,f.tools.span(start,end)],structural_path:a.discourse.structural_path,state:'UNRESOLVED'};audit.fields.push(record);
  // A task-envelope recipient already explicitly typed as PERFORMER is the
  // task assignee, not a newly inferred report recipient. Keep that role intact.
  if(/^\s*(?:to|recipient)\s*:/iu.test(q)&&f.semantic_nodes.some(n=>n.metadata.current_task_assignment&&n.metadata.participant_roles?.includes('PERFORMER')&&n.source_span_ids.some(id=>{const s=f.source_spans.find(s=>s.span_id===id);return s?.start===start&&s?.end===end;}))){record.state='NOT_REPORT_RECIPIENT';record.reason='EXPLICIT_TASK_ASSIGNMENT_ROLE_PRECEDES_GENERIC_FIELD_LABEL';continue;}
  if(/[\/\\.，、;；]|\band\b|\bor\b/iu.test(value)||!value.trim()){record.reason='RECIPIENT_VALUE_NOT_A_SINGLE_IDENTITY';record.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE',record.reason);continue;}
  const unstated=/^(?:未知|未指定|待定|unknown|TBD)$/iu.test(value),n=f.tools.node(a.cl,unstated?'UNKNOWN_REFERENT':'ENTITY',start,end,{sense:'DECLARED_REPORT_RECIPIENT',owner:record.field_id,discourse:a.discourse,participant_roles:['RECIPIENT'],current_task_assignment:!unstated,participant_eligibility:{eligible:!unstated,reason:'EXPLICIT_REPORT_RECIPIENT_FIELD'},source_role_field:record});record.node_id=n.node_id;
  if(unstated){record.reason='RECIPIENT_IDENTITY_UNSTATED';record.unresolved_ref=n.unresolved_ref;a.handled=true;continue;}
  // The existing signature requires an EVENT head. The explicit report noun
  // supplies a participation context, without asserting a report action.
  const label=/报告|汇报|report|recipient|to/iu.exec(q),labelStart=a.cl.span.start+[...q.slice(0,label.index)].length,labelLength=[...label[0]].length,context=f.tools.node(a.cl,'EVENT',labelStart,labelStart+labelLength,{sense:'REPORT_PARTICIPATION_CONTEXT',owner:record.field_id,discourse:a.discourse,modality:'UNSTATED',role_context_only:true});
  const r=f.tools.relation(a.cl,'RECIPIENT',context,n,record.source_span_ids);if(!r)throw Error('RECIPIENT_FIELD_SIGNATURE');record.context_event_node_id=context.node_id;record.relation_id=r.relation_id;record.state='CERTIFIED';a.handled=true;
 }
 return f;
}
