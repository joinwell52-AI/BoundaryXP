import {evaluateExpression} from '../compile.mjs';
// Source-declared semantic assertions, only evaluation side; no exact runtime answers.
const verbs={读取:/读取|读入|阅读/,检查:/^(检查|检验|核查)/,形成:/形成|生成|产出/,生成:/生成|形成|产出/,复核:/复核|审查/,提交:/提交|递交/,核对:/核对|检查|校核/,写入:/写入|记录|生成|形成/,交付:/交付|交给|提交|发送|递交/,发送:/发送|交给|提交/,修改:/修改|更改/,删除:/删除|移除/,重启:/重启/,比较:/比较|对比/};
const same=(name,word)=>verbs[word]?.test(name)??name.includes(word);
export function evaluateDelivery(test,trace){
 const g=trace.proposal,idx=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x])),current=g.events.filter(e=>e.use==='CURRENT_TASK'),positive=current.filter(e=>['REQUIRED','PERMITTED'].includes(e.modality)),forbid=current.filter(e=>e.modality==='FORBIDDEN');
 const rows=new Map(trace.technical.rows.map(r=>[r.id,r])),out=[];
 const check=(name,pass,detail=null)=>out.push({name,pass:!!pass,detail});
 const role=(event,kind)=>g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===event.id&&c.role===kind);
 const label=id=>idx.get(id)?.label??'';
 const facts=trace.ir.facts, accepted=facts.filter(f=>f.status==='ACCEPTED');
 const p=(word,modality='REQUIRED')=>positive.filter(e=>same(e.predicate,word)&&e.modality===modality);
 const b=word=>forbid.filter(e=>same(e.predicate,word));
 const local=(e,roleName,name)=>role(e,roleName).some(c=>label(c.entity_id).includes(name));
 const hasSlot=(slot,name)=>accepted.some(f=>f.slots.includes(slot)&&f.entity?.label.includes(name));
 for(const [word,mode] of test.expect.actions){check('explicit_action:'+word,p(word,mode).length);check('compiled_action:'+word,facts.some(f=>f.slots.includes('A')&&same(f.event.predicate,word)&&f.event.modality===mode&&(f.status==='ACCEPTED'||test.id==='T09'&&word==='比较'&&f.status==='UNRESOLVED')));}
 check('no_unsupported_positive_events',positive.every(e=>test.expect.actions.some(([word])=>same(e.predicate,word))||test.expect.organizer&&/组织/.test(e.predicate)||test.expect.allowContentAction&&/写入|引用/.test(e.predicate)),positive);
 for(const [field,slot] of [['input','I'],['output','O'],['basis','V']]){for(const name of test.expect[field]??[])check('preserved_'+field+':'+name,hasSlot(slot,name));if(test.expect[field]?.length===0)check('no_'+field,trace.canonical.slots[slot].entries.length===0);}
 for(const word of test.expect.forbid??[]){check('forbid:'+word,b(word).length);check('compiled_forbid:'+word,accepted.some(f=>f.slots.includes('B')&&same(f.event.predicate,word)));}
 check('no_extra_forbid',forbid.every(e=>(test.expect.forbid??[]).some(w=>same(e.predicate,w))));
 for(const name of test.expect.people??[])check('participant:'+name,hasSlot('P',name));
 check('schema_source_signatures',trace.technical.schemas.proposal.ok&&trace.technical.schemas.audit.ok&&trace.technical.rows.every(r=>!r.errors.length),trace.technical.rows.filter(r=>r.errors.length));
 check('no_unexplained_gaps',!trace.canonical.gaps.length,trace.canonical.gaps);
 check('business_authorization_disabled',trace.canonical.business_decision===null&&trace.canonical.execution_authorization===null);
 for(const id of ['T01','T03','T06','T08'].includes(test.id)?[...p('生成'),...p('形成')]:[])check('result_identity:'+id.id,role(id,'RESULT').length);
 if(test.id==='T01'){
  check('organization_not_execution',p('检查').some(e=>local(e,'ORGANIZER','PM'))&&!p('检查').some(e=>local(e,'PERFORMER','PM')));
  check('QA_review_bound_report',p('复核').some(e=>(local(e,'REVIEWER','QA')||local(e,'PERFORMER','QA'))&&local(e,'OBJECT','env-review.md')));
  check('PM_submit_same_report_to_ADMIN',p('提交').some(e=>local(e,'PERFORMER','PM')&&local(e,'OBJECT','env-review.md')&&local(e,'RECIPIENT','ADMIN')));
  check('no_FCoP_as_basis',!trace.canonical.slots.V.entries.some(f=>f.entity?.label.includes('FCoP')));
 }
 if(test.id==='T02'){
  check('QA_not_default_PM',!g.entities.some(e=>e.type==='PERSON'&&e.label==='PM'));
  check('basis_on_check',p('核对').some(e=>local(e,'BASIS','CHECK-2')&&local(e,'INPUT_OBJECT','input.json')));
  check('forbidden_modification_of_same_input',b('修改').some(e=>g.claims.some(c=>c.event_id===e.id&&label(c.entity_id).includes('input.json'))));
  check('read_only_restriction_retained',trace.ir.facts.some(f=>JSON.stringify(f).includes('只读')));
 }
 if(test.id==='T03'){
  const produced=new Set(p('生成').flatMap(e=>role(e,'RESULT').map(c=>c.entity_id)));
  check('review_submit_stable_identity',p('复核').some(e=>role(e,'OBJECT').some(c=>produced.has(c.entity_id)))&&p('交付').some(e=>role(e,'OBJECT').some(c=>produced.has(c.entity_id))&&local(e,'RECIPIENT','ADMIN')));
  check('explicit_temporal_sequence',g.claims.some(c=>c.kind==='TEMPORAL'&&c.direction==='ORDER'));
  check('acceptance_triggers_completion',accepted.some(f=>f.slots.includes('C')&&f.kind==='COMPLETION'&&f.claim.direction==='SUFFICIENT'&&f.claim.scope_id==='ROOT'&&JSON.stringify(f.expression).includes('接收')));
 }
 if(test.id==='T04'){
  check('conditional_generation',p('生成').some(e=>g.claims.some(c=>c.event_id===e.id&&c.kind==='CONDITION'&&c.direction==='SUFFICIENT')));
  check('no_event_when_no_anomaly_NOT_REQUIRED',current.some(e=>same(e.predicate,'生成')&&e.modality==='NOT_REQUIRED'&&e.constraint_ids.length));
  check('unconditional_delete_forbid',b('删除').every(e=>e.constraint_ids.filter(id=>idx.get(id)?.kind==='CONDITION').every(id=>{const c=idx.get(id);return c.direction==='SUFFICIENT'&&evaluateExpression(g.expressions,c.expression_id)==='TRUE';})));
 }
 if(test.id==='T05'){
  const cond=g.claims.filter(c=>c.kind==='CONDITION'&&p('提交','PERMITTED').some(e=>e.id===c.event_id)&&c.direction==='NECESSARY');
  const deny=g.claims.filter(c=>c.kind==='CONDITION'&&b('提交').some(e=>e.id===c.event_id)&&c.direction==='SUFFICIENT');
  const states=g.expressions.filter(e=>e.op==='STATE');const approve=states.find(e=>/批准/.test(e.state.predicate)),passed=states.find(e=>/检查|通过/.test(e.state.predicate)&&e!==approve);
  check('two_distinct_condition_states',approve&&passed);
  const truth=(c,a,v)=>evaluateExpression(g.expressions,c.expression_id,{[approve?.id]:a,[passed?.id]:v});
  check('permission_AND_necessary',approve&&passed&&cond.some(c=>truth(c,true,true)==='TRUE'&&truth(c,false,true)==='FALSE'&&truth(c,true,false)==='FALSE'&&evaluateExpression(g.expressions,c.expression_id)==='UNKNOWN'));
  check('forbid_any_failed_prerequisite',approve&&passed&&deny.some(c=>truth(c,true,true)==='FALSE'&&truth(c,false,true)==='TRUE'&&truth(c,true,false)==='TRUE'));
  check('no_invented_approval_check_duty',!positive.some(e=>/批准|^检查/.test(e.predicate)));
 }
 if(test.id==='T06'){
  check('duration_8_LTE_generation',accepted.some(f=>f.slots.includes('R')&&f.claim.quantity.value===8&&f.claim.quantity.comparator==='LTE'&&same(f.event.predicate,'生成')&&/分钟/.test(f.claim.quantity.unit)));
  check('content_2_risks_in_output',accepted.some(f=>f.slots.includes('O')&&f.content_quantities?.some(c=>c.quantity.value===2&&c.quantity.comparator==='EQ'&&c.quantity.use==='OUTPUT_CONTENT'&&label(c.quantity.target_id).includes('report.md'))));
  check('content_not_execution_limit',!trace.canonical.slots.R.entries.some(f=>f.claim.quantity.value===2));
  check('failure_stops_root',accepted.some(f=>f.slots.includes('C')&&f.kind==='STOP'&&f.claim.scope_id==='ROOT'&&f.claim.direction==='SUFFICIENT'&&/失败/.test(JSON.stringify(f.expression))));
 }
 if(test.id==='T07'){
  const scopes=g.claims.filter(c=>c.kind==='SCOPE');const values=scopes.map(c=>evaluateExpression(g.expressions,c.expression_id));
  const environment=(id,name)=>new RegExp('^'+name+'(?:环境)?$').test(label(id));
  check('check_effective_scope_dev_stage_excludes_prod',values.some(set=>set instanceof Set&&[...set].some(id=>environment(id,'dev'))&&[...set].some(id=>environment(id,'stage'))&&![...set].some(id=>environment(id,'prod'))));
  check('forbid_all_environments_not_narrowed',b('修改').some(e=>g.claims.some(c=>c.event_id===e.id&&c.entity_id&&/任何|所有|全部/.test(label(c.entity_id)))));
  check('three_not_execution_count',!trace.canonical.slots.R.entries.some(f=>f.claim.quantity?.value===3));
 }
 if(test.id==='T08'){
  check('quoted_allowance_is_not_current_permission',!positive.some(e=>/删除/.test(e.predicate))&&g.events.some(e=>/删除/.test(e.predicate)&&e.layer==='QUOTED'&&e.use==='MENTION_ONLY'));
  check('forbid_cache_preserved',b('删除').some(e=>g.claims.some(c=>c.event_id===e.id&&label(c.entity_id)==='cache.db')));
 }
 if(test.id==='T09'){
  const refs=g.entities.filter(e=>e.type==='REFERENT'&&e.alternatives.length>=2);
  check('real_alpha_beta_competition',refs.some(e=>['alpha.csv','beta.csv'].every(name=>e.alternatives.some(id=>label(id)===name))));
  check('compare_not_wrongly_resolved',facts.some(f=>f.kind==='EVENT'&&same(f.event.predicate,'比较')&&f.status==='UNRESOLVED'));
  check('clear_reads_and_independent_send_preserved',accepted.some(f=>f.slots.includes('A')&&same(f.event.predicate,'读取'))&&accepted.some(f=>f.slots.includes('A')&&same(f.event.predicate,'发送')&&f.roles.some(c=>c.entity?.label==='readme.md')&&f.roles.some(c=>c.role==='RECIPIENT'&&c.entity?.label==='ADMIN')));
 }
 if(test.id==='T10'){
  check('retry_only_reading',accepted.some(f=>f.slots.includes('R')&&f.claim.quantity.value===2&&f.claim.quantity.comparator==='LTE'&&same(f.event.predicate,'读取'))&&!g.claims.some(c=>c.kind==='QUANTITY'&&c.quantity.value===2&&!p('读取').some(e=>e.id===c.event_id)));
  check('check_errors_from_worker_log',p('检查').some(e=>g.claims.some(c=>c.event_id===e.id&&label(c.entity_id).includes('错误记录'))));
  check('QA_reviews_result',p('复核').some(e=>local(e,'REVIEWER','QA')||local(e,'PERFORMER','QA')));
  check('unspecified_tool_does_not_poison_check',g.issues.some(i=>i.kind==='UNSPECIFIED')&&accepted.some(f=>f.slots.includes('A')&&same(f.event.predicate,'检查')));
 }
 return {id:test.id,end_to_end:out.every(x=>x.pass),checks:out,failures:out.filter(x=>!x.pass)};
}
