const copy={
 action_difference:['安排了原任务动作映射以外的工作','说明这项工作怎样服务于原目标；若涉及新增操作，指出授权依据或提出澄清。','Work is outside the original mapped action set','Explain how this work serves the original goal. For additional operations, cite authorization or request clarification.'],
 completion_difference:['增加或改变了交付前提','核对这句是否必须成为交付前提；若只是改进建议，建议写进报告，由 ADMIN 决定是否另开任务。','Delivery prerequisites were added or changed','Explain why this must be a delivery prerequisite. If it is an improvement recommendation, include it in the report for ADMIN to decide on further work.'],
 completion_omission:['原交付条件没有对应','指出原交付要求在新规划中的位置；如未保留，请补回或申请变更。','An original delivery condition has no match','Identify where the original requirement appears in the plan; restore it or request a change if omitted.'],
 dependency_unknown:['等待对象不在已提交任务中','补充等待对象的负责人、产出和完成证据；外部条件请明确其来源。','A prerequisite is missing from the submitted tasks','Identify the prerequisite owner, output and completion evidence, including the source of any external condition.'],
 dependency_cycle:['这些任务可能互相等待','核对环上的每条依赖，区分参考信息与必须完成的前置任务，给出可启动的顺序。','These tasks may wait on each other','Review each cycle edge, separate reference information from mandatory prerequisites, and provide a startable sequence.'],
 parameter_difference:['整体范围或要求的表述变了','说明新旧表述如何对应；实际增加的范围、资源或交付要求需说明依据。','Overall scope or requirement wording changed','Map the new wording to the original. Explain the basis for added scope, resources or delivery requirements.'],
 parameter_unmapped:['这份派单的边界信息尚未映射完整','先核对原文是否已经说明；存在缺口时补充到这份派单，不要把模型漏提取当作原文没有要求。','This assignment has incomplete boundary mappings','Check whether the source already states the requirement. Fill actual gaps in this assignment; extraction omissions are not missing requirements.'],
 projection_incomplete:['动作或完成条件还不能充分比较','核对这份派单的动作、完成条件及对应原句后再比较。','Actions or completion conditions cannot yet be fully compared','Map this assignment’s actions and completion conditions to source excerpts before comparing.'],
};
export function assignmentRisks(plan,review){
 const sections=[{id:'$root',label:'PM',document:plan.document,depends_on:[],findings:[]},...plan.tasks.map(t=>({...t,label:t.id,findings:[]}))];
 const unknown={id:'$unknown',label:'?',document:null,depends_on:[],findings:[]};
 for(const finding of review.findings){
  if(finding.kind==='dependency_cycle'){
   const cycle=finding.source_quote.split(' → '),matched=sections.filter(s=>s.id!=='$root'&&cycle.includes(s.id));
   for(const s of matched)s.findings.push(finding);if(!matched.length)unknown.findings.push(finding);continue;
  }
  const matches=sections.filter(s=>s.id!=='$root'&&(finding.location===s.id||finding.location.startsWith(s.id+'.')));
  // Prefix-overlapping IDs or the reserved root label cannot be attributed confidently.
  if(matches.length===1&&matches[0].id!=='plan')matches[0].findings.push(finding);
  else if(matches.length)unknown.findings.push(finding);
  else if(finding.location==='plan'||finding.location.startsWith('plan.'))sections[0].findings.push(finding);
  else unknown.findings.push(finding);
 }
 if(unknown.findings.length)sections.push(unknown);
 return sections.map(section=>({...section,risks:Object.entries(copy).flatMap(([kind,[zh,suggestion,en,enSuggestion]])=>{
  const findings=section.findings.filter(f=>f.kind===kind);if(!findings.length)return [];
  const title={zh,en};
  if(kind==='action_difference'){const action=section.document?.actions.find(a=>a.quote===findings[0].source_quote);if(action){title.zh=`需核对“${action.verb} ${action.target}”是否属于这份任务`;title.en=`Review whether “${action.verb} ${action.target}” belongs in this assignment`;}}
  if(kind==='dependency_unknown'){title.zh='等待对象未提供：'+findings.map(f=>f.source_quote).join(', ');title.en='Missing prerequisites: '+findings.map(f=>f.source_quote).join(', ');}
  return [{kind,title,suggestion:{zh:suggestion,en:enSuggestion},findings,quotes:[...new Set(findings.map(f=>f.source_quote||f.baseline_quote).filter(Boolean))],locations:findings.map(f=>f.location),incomplete:['parameter_unmapped','projection_incomplete'].includes(kind),severity:kind==='dependency_cycle'?'structural':['parameter_unmapped','projection_incomplete'].includes(kind)?'unknown':'attention'}];
 })}));
}
const owners=task=>[...new Set(task.document.actions.map(a=>a.actor))].sort();
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function compareAssignments(before,after){
 const rows=before.tasks.map(old=>{
  const next=after.tasks.find(t=>t.id===old.id);
  if(!next)return {id:old.id,status:'unmatched',changed:[],before:old,after:null};
  const changed=[];
  if(!same(owners(old),owners(next)))changed.push('owner');
  if(!same([...old.depends_on].sort(),[...next.depends_on].sort()))changed.push('dependencies');
  if(old.document.parameters.O!==next.document.parameters.O)changed.push('output');
  if(!same(old.document.completion,next.document.completion))changed.push('completion');
  if(!same(old.document.actions,next.document.actions))changed.push('actions');
  if(old.document.text!==next.document.text)changed.push('text');
  return {id:old.id,status:changed.length?'changed':'unchanged',changed,before:old,after:next};
 });
 for(const next of after.tasks)if(!before.tasks.some(t=>t.id===next.id))rows.push({id:next.id,status:'added',changed:[],before:null,after:next});
 return rows;
}
export function followUpText(entry,language='zh-CN'){
 const en=language==='en';const follow=entry.followUp;
 const latest=entry.followUps?.at(-1);
 if(latest&&latest.status!=='compared')return latest.reply?(en?'PM replied, but the new plan has not completed comparison. Acceptance is unverified.':'PM 已回复，但新规划尚未完成比较；是否按建议调整还未验证。'):(en?'The latest reminder has no completed PM reply yet.':'最近一次提醒尚无完整 PM 回应。');
 if(!follow){const attempt=entry.followUps?.at(-1);return attempt?.reply?(en?'PM replied, but the revised plan has not completed calculation. Acceptance is unverified.':'PM 已回复，但新规划尚未完成计算；是否按建议调整还未验证。'):attempt?(en?'A reminder was attempted; no completed PM reply is recorded.':'已尝试发送提醒，尚无完整 PM 回应。'):(en?'No reminder-and-revision round is recorded yet.':'尚未记录提醒后的重分配结果。');}
 const rows=compareAssignments(follow.before,entry.input),changed=rows.filter(r=>r.status==='changed').length,unchanged=rows.filter(r=>r.status==='unchanged').length,unmatched=rows.filter(r=>['unmatched','added'].includes(r.status)).length;
 return en?`PM replied. ${changed} same-ID assignments changed; ${unchanged} unchanged; ${unmatched} unmatched/new entries. Text or mapping changes do not prove acceptance or resolution.`:`PM 已回复。同编号任务中 ${changed} 项有变化、${unchanged} 项未变；另有 ${unmatched} 项无法对应或新出现。文字或映射变化不等于已采纳建议或风险已解决。`;
}
export function taskReminder(plan,review,language='zh-CN'){
 const en=language==='en';return (en?'Review each assignment below. State what you retain, change or ask ADMIN to clarify, with reasons. Return the complete revised plan and retain task IDs where possible. This reminder grants no new authority.':'请逐份派单回复下面的风险观察：保留、修改或申请 ADMIN 澄清，并说明理由。请提交完整修订规划，尽量沿用任务编号。本提醒不增加授权。')+'\n\n'+assignmentRisks(plan,review).filter(s=>s.risks.length).map(s=>`${s.id==='$root'?'PM':s.label}\n`+s.risks.map(r=>`${en?r.title.en:r.title.zh}\n${en?r.suggestion.en:r.suggestion.zh}\n${r.quotes.join('\n')}`).join('\n\n')).join('\n\n');
}
