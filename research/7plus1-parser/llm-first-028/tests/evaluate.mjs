const aliases={读取:/读取|读入|阅读/,生成:/生成|形成|产出|制作/,形成:/形成|生成|产出/,复核:/复核|审查|审核/,检查:/^检查|^检验/,提交:/提交|递交/,修改:/修改|更改/,删除:/删除|移除/,重启:/重启/,比较:/比较|对比/};
const is=(predicate,w)=>aliases[w]?.test(predicate)??predicate.includes(w);
const label=(entity,name)=>entity?.label===name||entity?.label?.includes(name);
function inspectGraph(test,g){
 const findings=[],check=(name,ok,detail=null)=>{findings.push({name,pass:!!ok,detail});};
 const current=g.events.filter(e=>e.use==='CURRENT_TASK');
 const actions=current.filter(e=>['REQUIRED','PERMITTED'].includes(e.modality));
 const forbid=current.filter(e=>e.modality==='FORBIDDEN');
 const entities=new Map(g.entities.map(e=>[e.id,e]));
 const eventIndex=new Map(g.events.map(e=>[e.id,e]));
 const roles=role=>g.claims.filter(c=>c.kind==='ROLE'&&c.role===role&&actions.some(e=>e.id===c.event_id));
 const positiveObjects=roles('INPUT_OBJECT').map(c=>entities.get(c.entity_id)?.label);
 for(const [word,modality] of test.expect.actions)check(`action:${word}:${modality}`,actions.some(e=>is(e.predicate,word)&&e.modality===modality));
 const extras=actions.filter(e=>!test.expect.actions.some(([w])=>is(e.predicate,w))&&!(test.expect.organizer&&/组织/.test(e.predicate))&&!(test.expect.allowContentAction&&/引用/.test(e.predicate)));
 check('no_extra_current_actions',extras.length===0,extras);
 for(const [role,field] of [['INPUT_OBJECT','input'],['RESULT','output'],['BASIS','basis']]){
  for(const name of test.expect[field]??[])check(`${field}:${name}`,roles(role).some(c=>label(entities.get(c.entity_id),name)));
  if(test.expect[field])check(`no_extra_${field}`,roles(role).every(c=>test.expect[field].some(name=>label(entities.get(c.entity_id),name))||(test.expect.ambiguous&&['c.csv','该文件'].some(name=>label(entities.get(c.entity_id),name)))));
 }
 for(const word of test.expect.forbid??[])check(`forbid:${word}`,forbid.some(e=>is(e.predicate,word)));
 check('no_extra_forbid',forbid.every(e=>(test.expect.forbid??[]).some(w=>is(e.predicate,w))));
 for(const name of test.expect.people??[])check(`person:${name}`,g.claims.some(c=>c.kind==='ROLE'&&['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(c.role)&&label(entities.get(c.entity_id),name)&&actions.some(e=>e.id===c.event_id)));
 if(test.expect.notRequired)check('not_required_not_forbidden',current.some(e=>is(e.predicate,test.expect.notRequired)&&e.modality==='NOT_REQUIRED')&&!forbid.some(e=>is(e.predicate,test.expect.notRequired)));
 if(test.expect.necessary)check('necessary_condition_target',g.claims.some(c=>c.kind==='CONDITION'&&c.direction==='NECESSARY'&&is(eventIndex.get(c.event_id)?.predicate??'',test.expect.necessary)&&eventIndex.get(c.event_id)?.modality==='PERMITTED'&&eventIndex.get(c.event_id)?.constraint_ids.includes(c.id)));
 if(test.expect.completion)check('completion_direction',g.claims.some(c=>c.kind==='COMPLETION'&&c.scope_id==='ROOT'&&c.direction===test.expect.completion));
 if(test.expect.retry)check('retry_bound_to_read',g.claims.some(c=>c.kind==='QUANTITY'&&c.quantity.use==='EXECUTION_LIMIT'&&c.quantity.value===test.expect.retry&&c.quantity.comparator==='LTE'&&is(eventIndex.get(c.event_id)?.predicate??'','读取')&&c.quantity.target_id===c.event_id));
 if(test.expect.temporal)check('temporal_order',g.claims.filter(c=>c.kind==='TEMPORAL'&&c.direction==='ORDER').length>=test.expect.temporal);
 if(test.expect.beforeForbid)check('conditional_forbid',g.claims.some(c=>c.kind==='CONDITION'&&c.direction==='SUFFICIENT'&&eventIndex.get(c.event_id)?.modality==='FORBIDDEN'&&(c.temporal==='BEFORE'||g.expressions.find(x=>x.id===c.expression_id)?.op==='NOT'||g.expressions.find(x=>x.id===c.expression_id)?.state?.polarity==='NEGATIVE')));
 if(test.expect.noApproveObligation)check('no_approval_obligation',!actions.some(e=>/批准/.test(e.predicate)));
 if(test.expect.duration)check('duration_bound_to_generate',g.claims.some(c=>c.kind==='QUANTITY'&&c.quantity.use==='EXECUTION_LIMIT'&&c.quantity.value===test.expect.duration&&c.quantity.comparator==='LTE'&&/分钟|minute/.test(c.quantity.unit)&&is(eventIndex.get(c.event_id)?.predicate??'','生成')));
 if(test.expect.content)check('content_quantity_not_resource',g.claims.some(c=>c.kind==='QUANTITY'&&c.quantity.use==='OUTPUT_CONTENT'&&c.quantity.value===test.expect.content&&c.quantity.comparator==='EQ'&&label(entities.get(c.quantity.target_id),'top.md'))&&!g.claims.some(c=>c.kind==='QUANTITY'&&c.quantity.value===test.expect.content&&c.quantity.use==='EXECUTION_LIMIT'));
 if(test.expect.quote)check('quote_not_business_delete',!actions.some(e=>/删除/.test(e.predicate))&&g.events.some(e=>e.layer==='QUOTED'&&e.use==='MENTION_ONLY'&&/删除/.test(e.predicate)));
 if(test.expect.ambiguous){check('local_coreference_competition',g.entities.some(e=>e.type==='REFERENT'&&e.alternatives.length>=2&&['a.csv','b.csv'].every(name=>e.alternatives.some(id=>label(entities.get(id),name))))&&g.issues.some(i=>i.kind==='AMBIGUITY'));check('clear_reads_retained',roles('INPUT_OBJECT').filter(c=>is(eventIndex.get(c.event_id)?.predicate??'','读取')).length>=2);}
 if(test.expect.organizer){check('organizer_not_check_performer',g.claims.some(c=>c.role==='ORGANIZER'&&label(entities.get(c.entity_id),'PM'))&&!g.claims.some(c=>c.role==='PERFORMER'&&is(eventIndex.get(c.event_id)?.predicate??'','检查')&&label(entities.get(c.entity_id),'PM')));check('no_monitoring_command',!actions.some(e=>/监测|监控/.test(e.predicate)));}
 if(test.expect.unspecified)check('performer_unspecified',g.issues.some(i=>i.kind==='UNSPECIFIED'));
 // Verify action-object and performer bindings, not independent word presence.
 for(const e of actions){
  const bound=g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id);
  if(is(e.predicate,'生成')||is(e.predicate,'形成'))check(`result_binding:${e.id}`,bound.some(c=>c.role==='RESULT'));
  if(is(e.predicate,'复核')&&test.expect.people?.includes('QA'))check(`reviewer_binding:${e.id}`,bound.some(c=>['REVIEWER','PERFORMER'].includes(c.role)&&label(entities.get(c.entity_id),'QA')));
  if(is(e.predicate,'提交')&&test.expect.people?.includes('ADMIN'))check(`recipient_binding:${e.id}`,bound.some(c=>c.role==='RECIPIENT'&&label(entities.get(c.entity_id),'ADMIN')));
 }
 return findings;
}
export function evaluate(test,trace){
 const raw=inspectGraph(test,trace.proposal),compiled=[];
 const check=(name,ok,detail=null)=>compiled.push({name,pass:!!ok,detail});
 check('schema_and_sources_valid',trace.technical.schemas.proposal.ok&&trace.technical.schemas.audit.ok&&trace.technical.rows.every(r=>!r.errors.length),trace.technical.rows.filter(r=>r.errors.length));
 check('no_unexplained_coverage_gaps',trace.canonical.gaps.length===0,trace.canonical.gaps);
 const accepted=trace.ir.facts.filter(f=>f.status==='ACCEPTED');
 for(const [word,modality] of test.expect.actions){const matches=trace.ir.facts.filter(f=>f.kind==='EVENT'&&f.slots.includes('A')&&is(f.event.predicate,word)&&f.event.modality===modality);check(`preserved_action:${word}`,matches.some(f=>f.status==='ACCEPTED')||(test.expect.ambiguous&&word==='比较'&&matches.some(f=>f.status==='UNRESOLVED')));}
 for(const slot of ['I','O','V']){const field={I:'input',O:'output',V:'basis'}[slot];for(const name of test.expect[field]??[])check(`preserved_${slot}:${name}`,accepted.some(f=>f.slots.includes(slot)&&label(f.entity,name)));}
 for(const word of test.expect.forbid??[])check(`preserved_B:${word}`,accepted.some(f=>f.slots.includes('B')&&is(f.event.predicate,word)));
 if(test.expect.necessary)check('permission_keeps_condition',accepted.filter(f=>f.slots.includes('A')&&is(f.event.predicate,test.expect.necessary)&&f.event.modality==='PERMITTED').every(f=>f.constraints.some(c=>c.kind==='CONDITION'&&c.direction==='NECESSARY')));
 if(test.expect.completion)check('completion_accepted_with_direction',accepted.some(f=>f.slots.includes('C')&&f.claim.kind==='COMPLETION'&&f.claim.direction===test.expect.completion&&f.claim.scope_id==='ROOT'));
 if(test.expect.retry)check('retry_preserved_in_R',accepted.some(f=>f.slots.includes('R')&&f.claim.quantity.value===test.expect.retry&&f.claim.quantity.comparator==='LTE'&&is(f.event.predicate,'读取')));
 for(const person of test.expect.people??[])check(`participant_preserved:${person}`,accepted.some(f=>f.slots.includes('P')&&label(f.entity,person)));
 if(test.expect.beforeForbid)check('conditional_forbid_direction_preserved',accepted.some(f=>f.slots.includes('B')&&f.constraints.some(c=>c.kind==='CONDITION'&&c.direction==='SUFFICIENT')));
 if(test.expect.noApproveObligation)check('conditional_approver_role_preserved_without_action_obligation',accepted.some(f=>f.slots.includes('P')&&f.claim.role==='APPROVER'&&f.event.use==='MENTION_ONLY'&&f.event.modality==='UNSTATED'));
 if(test.expect.ambiguous)check('ambiguous_compare_local_only',trace.ir.facts.filter(f=>f.kind==='EVENT'&&is(f.event.predicate,'比较')).some(f=>f.status==='UNRESOLVED')&&trace.ir.facts.filter(f=>f.kind==='EVENT'&&is(f.event.predicate,'读取')).every(f=>f.status==='ACCEPTED'));
 if(test.expect.unspecified)check('unspecified_does_not_poison_task',accepted.some(f=>f.slots.includes('A')&&is(f.event.predicate,'检查')));
 if(test.expect.content){check('output_scope_does_not_become_input',trace.canonical.slots.I.entries.length===0);check('content_constraint_preserved_in_output',trace.canonical.slots.O.entries.some(f=>f.content_quantities?.some(q=>q.quantity.value===test.expect.content)));check('deadline_is_not_root_completion',trace.canonical.slots.C.entries.length===0);}
 check('business_authorization_null',trace.canonical.business_decision===null&&trace.canonical.execution_authorization===null);
 return {id:test.id,semantic:raw.every(f=>f.pass),end_to_end:raw.every(f=>f.pass)&&compiled.every(f=>f.pass),raw_checks:raw,compilation_checks:compiled,failures:[...raw.filter(f=>!f.pass).map(f=>({...f,attribution:'LLM_SEMANTIC_OR_SKILL_CONTRACT'})),...compiled.filter(f=>!f.pass).map(f=>({...f,attribution:f.name==='schema_and_sources_valid'?'SOURCE_SCHEMA_OR_AUDIT':f.name==='no_unexplained_coverage_gaps'?'MODEL_OMISSION_OR_AUDIT':'COMPILATION_OR_LOCAL_AUDIT'}))]};
}
