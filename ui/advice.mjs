import { prohibitedActions } from './local-task.mjs';
import { checkAdminText } from './admin-check.mjs';
const adminRules={
  I:['明确任务对象与范围','本地规则尚未确认对象与范围的对应。','任务对象为【资料、系统或其他对象】，范围为【具体清单或筛选条件】。'],
  O:['明确交什么结果','交付形式、内容或接收人尚需核对。','向【接收人】提交【产物形式及内容】，存放于【适用位置】。'],
  A:['明确允许做什么','不同操作不能自动互相替代；请明确本次允许的动作。','本次允许【操作范围】；需要扩大操作范围时，先提出申请。'],
  P:['明确谁负责','执行与交付职责需要有承担者。','由【负责人】负责执行或协调，并提交约定产物。'],
  R:['补充时间或费用上限','如任务涉及持续执行或费用，请明确适用上限。','适用的时间上限为【时长】，费用或调用上限为【预算或不适用】；超限前提出申请。'],
  V:['明确依据与资料来源','不同来源、版本或时间口径可能产生不同结果。','以【资料来源及适用版本或时间口径】为依据。'],
  C:['说清何时算完成','请明确交付依据，以及停止或需要澄清的情形。','以【交付证据】作为完成依据；遇到【停止或需澄清的情形】时说明情况。']
};
const adminEnglish={
 I:['Specify task objects and scope','Task objects are [data, systems or other objects], limited to [explicit list or filter].'],
 O:['Specify the deliverable','Submit [deliverable format and contents] to [recipient], at [applicable location].'],
 A:['Clarify permitted actions','Permitted actions are [scope of operations]. Request approval before expanding that scope.'],
 P:['Assign responsibility','[Owner] executes or coordinates the task and submits the agreed deliverable.'],
 R:['Set resource limits','Applicable time limit: [duration]. Cost or call limit: [budget or not applicable]. Request approval before exceeding limits.'],
 V:['Identify evidence sources','Use [source and applicable version or date convention] as the basis.'],
 C:['Clarify completion','Define the evidence sufficient for delivery and the conditions for stopping or requesting clarification.']
};
export const adminAdviceLayers={
 meaning:{title:'先确认：任务含义与范围',en:'First: clarify task meaning and scope'},
 execution:{title:'再补充：执行与交付细节',en:'Next: specify execution and delivery details'},
 general:{title:'按需完善：通用约束',en:'As applicable: general constraints'}
};
const meaningSlots=new Set(['slot-report-output','slot-accounts-operation','slot-accounts-scope','slot-accounts-filter']);
function layerAdvice(suggestions){
 const ranked=suggestions.map(a=>({...a,layer:!a.rule?'general':a.rule.startsWith('slot-')&&!meaningSlots.has(a.rule)?'execution':'meaning'}));
 return Object.keys(adminAdviceLayers).flatMap(layer=>ranked.filter(a=>a.layer===layer));
}
export function adminAdvice(document){
  const calculation=checkAdminText(document.text??'');
  const addressed=new Set(calculation.slots.checks.flatMap(c=>c.slots.map(s=>s.field)));
  const suggestions=Object.entries(adminRules).filter(([k])=>!document.parameters[k]&&!addressed.has(k)).map(([key,[title,why,suggestion]])=>({key,title,why,suggestion,en:{title:adminEnglish[key][0],suggestion:adminEnglish[key][1]},note:'规则未找到可靠对应，不等于原文一定没有要求。'}));
  if(!['stated','none_declared'].includes(prohibitedActions(document.text).status))suggestions.unshift({key:'prohibitions',title:'明确不能做什么／禁止事项',why:'允许做什么，不等于禁止事项已经明确。请列出本次任务不得进行的操作。',suggestion:'本次任务禁止【具体操作及对象】；适用范围及例外条件为【由 ADMIN 明确】。未写入的禁项不由工具自动补造。',en:{title:'Specify prohibited actions',suggestion:'Prohibited actions for this task: [specific operations and targets]. Scope and exceptions: [ADMIN to specify]. The tool does not invent additional prohibitions.'}});
  return layerAdvice([...calculation.findings,...suggestions]);
}
export function completeTask(document,language='zh-CN'){
 const additions=adminAdvice(document).map(a=>a.draft?.[language]??(language==='en'?a.en.suggestion:a.suggestion));
 return document.text+(additions.length?'\n\n'+(language==='en'?'Proposed additional requirements (ADMIN to confirm; replace placeholders):':'建议补充的要求（由 ADMIN 确认，请替换占位符）：')+'\n'+additions.map((s,i)=>`${i+1}. ${s}`).join('\n'):'');
}
const planEnglish={
 completion_difference:['Review additional completion conditions','Explain the original-task basis for added completion conditions. If unsupported, propose a revision or request clarification.'],
 completion_omission:['Check that original deliverables are retained','Retain the original delivery requirements in the overall plan. Identify equivalent wording explicitly.'],
 dependency_cycle:['Review circular dependencies','Distinguish reference information from mandatory prerequisites and propose an executable sequence.'],
 dependency_unknown:['Identify missing prerequisites','Specify who owns each missing prerequisite, what it supplies, and the evidence of completion.'],
 action_difference:['Explain additional actions','Explain why each additional action is necessary. Verify authorization for product changes; relevance alone is insufficient.'],
 parameter_difference:['Review changed scope or requirements','Explain changed wording against the original task. For additional requirements, give their basis or request confirmation.']
};
export function planAdvice(review){
  const groups=[
    ['completion_difference','核查新增的交付条件','不要把新增检查、修复或确认条件直接当成本次交付前提；请说明原任务依据，没有依据时提出调整或申请澄清。'],
    ['completion_omission','核对原任务的交付是否保留','请在整体规划中保留原任务的交付要求；若只是换了说法，请明确对应关系。'],
    ['dependency_cycle','调整循环等待','请检查这些任务是否互相等待；区分信息参考和必须完成的前置任务，提出可启动的顺序。'],
    ['dependency_unknown','补充等待对象','请明确缺失依赖是谁负责、提供什么以及什么证据表示已完成。'],
    ['action_difference','说明新增安排与任务的关系','分工细化可以合理，但新增动作仍需说明必要性；涉及产品修改时核对本次授权，不能用“相关”代替“必要”。'],
    ['parameter_difference','核对范围或要求是否改变','请对照原任务解释不同表述；等价转述不必改，实际增加的要求需说明依据或申请确认。']
  ];
  return groups.flatMap(([kind,title,suggestion])=>{const findings=review.findings.filter(f=>f.kind===kind);return findings.length?[{kind,title,suggestion,en:{title:planEnglish[kind][0],suggestion:planEnglish[kind][1]},quotes:[...new Set(findings.map(f=>f.source_quote||f.baseline_quote).filter(Boolean))],findings}]:[];});
}
export function conclusion(review){
 const groups=planAdvice(review),gaps=review.findings.filter(f=>['parameter_unmapped','projection_incomplete'].includes(f.kind)).length;
 return groups.length?{zh:`建议 PM 核对以下 ${groups.length} 类变化，说明保留或修改的理由；有待明确的要求应向 ADMIN 提出。当前计算不能认定这些变化都是错误。`,en:`Ask PM to review ${groups.length} categories of change and explain what to retain or revise. Unclear requirements should go to ADMIN. These observations do not establish that every change is wrong.`}:gaps?{zh:'当前资料有缺口，暂不足以评价规划是否保留任务边界。建议先核对原文对应和缺失信息，再计算。',en:'The current mapping is incomplete. Review source correspondences and missing information before assessing whether the plan preserves the task boundary.'}:{zh:'在当前已映射内容中未发现这些结构异常。建议保留现有安排，并核对原文、授权和未覆盖的语义；这不等于批准执行。',en:'No checked structural anomaly was found in the current mapping. Retain the plan for review of source text, authorization and uncovered semantics; this is not approval to execute.'};
}
export function planAssignments(plan){return plan.tasks.map(t=>({id:t.id,owner:[...new Set(t.document.actions.map(a=>a.actor))].join('、')||'负责人待核对',work:t.document.parameters.A||t.document.parameters.I||t.document.text,output:t.document.parameters.O||'交付物待核对',dependencies:t.depends_on}));}
