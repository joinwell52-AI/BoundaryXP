import {sourceDraft,sourcePresentation} from './source-advice.mjs';

export function renderAdminResult(host,result,ui){
 const {element,localized,attribute,editable,button,action,noticePair,download}=ui;
 const presentation=sourcePresentation(result,result.text);
 const seven=(p)=>{
  const labels={I:['输入与范围','Inputs and scope'],O:['交付结果','Outputs'],A:['任务动作','Task actions'],P:['责任与授权主体','Responsibility and approval actors'],R:['资源约束','Resources'],V:['版本与依据','Version and provenance'],C:['完成与停止','Completion and stopping']};
  const table=element('table',undefined,'boundary-table');
  for(const [id,names] of Object.entries(labels)){
   const values=p?.elements?.[id]??[],row=element('tr');row.dataset.state=values.length?'candidate':'unmapped';
   row.append(localized(element('th'),id+' · '+names[0],id+' · '+names[1]));const cell=element('td');
   if(!values.length)cell.append(localized(element('span'),'—（未识别）','— (not identified)'));
   const seen=new Set();for(const v of values){const key=v.text['zh-CN'].trim();if(seen.has(key))continue;seen.add(key);cell.append(localized(element('p'),v.text['zh-CN'],v.text.en));}
   row.append(cell);table.append(row);
  }
  host.append(table);
  const boundary=element('section',undefined,'known-prohibitions');boundary.dataset.boundary='B';
  boundary.append(localized(element('h3'),'B · 已知禁止边界（独立 +1）','B · Known prohibitions (independent +1)'));
  const bans=p?.elements?.B??[],list=element('ul'),seen=new Set();
  for(const v of bans){if(seen.has(v.text['zh-CN']))continue;seen.add(v.text['zh-CN']);list.append(localized(element('li'),v.text['zh-CN'],v.text.en));}
  if(bans.length)boundary.append(list,localized(element('p'),'以上禁令及其条件按原文保留；不需要绑定接口才能识别为禁止边界。','These prohibitions retain their source conditions. Recognizing a prohibition does not require an interface ID.'));
  else boundary.append(localized(element('p'),'未识别到明确禁止项；不代表其他动作已获授权。','No explicit prohibition identified; this does not authorize other actions.'));
  host.append(boundary);
  const frames=p?.technical?.projection?.contract?.actions??[];
  if(frames.length){
   const relations=element('details');relations.append(localized(element('summary'),'查看提取关系：动作、角色与条件','Extracted relationships: actions, roles and conditions'));
   const names={executor:['执行者','Executor'],input:['读取/来源','Input/source'],artifact:['生成产物','Produced artifact'],payload:['发送内容','Payload'],recipient:['接收人','Recipient'],approver:['审批人（未表示已获批）','Approver (grant not established)'],target:['动作对象','Action target'],interface:['调用对象','Invocation target']};
   for(const frame of frames){
    const box=element('section');box.append(element('blockquote',frame.source.quote));
    for(const r of frame.roles){const label=names[r.name]??[r.name,r.name];box.append(localized(element('p'),label[0]+'：'+r.value,label[1]+': '+r.value));}
    for(const s of frame.guard_sources)box.append(localized(element('p'),'保留的条件/上下文：'+s.quote,'Retained condition/context: '+s.quote));
    relations.append(box);
   }
   relations.append(localized(element('p'),'关系来自局部文法；未解析的条件不当作已满足。完整原句和未覆盖片段见技术详情。','Relationships come from local grammar; unparsed conditions are not assumed satisfied. Full sources and uncovered fragments are in technical details.'));host.append(relations);
  }
 };
 host.append(localized(element('h2'),'Layer 1 · 原文证据','Layer 1 · Original task'),element('blockquote',result.text));
 host.append(localized(element('h2'),'Layer 2 · 七要素 + B','Layer 2 · Seven elements + B'));
 if(result.pipeline){
  for(const stage of result.pipeline.stages){host.append(element('h3',stage.id));seven(stage.result?sourcePresentation(stage.result,result.text):null);}
 }else seven(presentation);
 host.append(localized(element('p'),'“未识别”表示当前解析没有得到明确取值，不能据此认定原文没有要求。','“Not identified” means the parser has no clear value, not that the original task lacks a requirement.'));
 host.append(localized(element('h2'),'Layer 3 · 计算结果与建议','Layer 3 · Calculation results and advice'));
 const findings=(presentation?.findings??[]).filter(f=>f.code!=='wp_composition_unverified');
 if(result.pipeline?.issues.length)host.append(localized(element('p',undefined,'task-risk attention'),'分段范围待确认：'+result.pipeline.issues.join(', '),'Stage scope needs clarification: '+result.pipeline.issues.join(', ')));
 for(const f of findings){
  const card=element('article',undefined,'task-risk '+(f.severity==='conflict'?'structural':'attention'));
  card.append(localized(element('h3'),f.title?.['zh-CN']??'需要明确的边界',f.title?.en??'Boundary to clarify'));
  if(f.scenario)card.append(localized(element('p'),f.scenario['zh-CN'],f.scenario.en));
  if(['guard_modal_conflict','modal_logical_conflict'].includes(f.code))card.append(localized(element('p'),'计算结果：这两条要求在上述情形下不能同时满足（Z3：UNSAT）。','Result: these two requirements cannot both be satisfied in that scenario (Z3: UNSAT).'));
  if(['source_bound_intersection','unbound_interval_comparison'].includes(f.proof?.operation)){
   card.append(localized(element('pre'),f.formula['zh-CN'],f.formula.en));
  }
  if(f.proof?.operation==='explicit_list_intersection'){
   const p=f.proof;card.append(element('pre','{'+p.targets.join(', ')+'} ∩ {'+p.forbidden.join(', ')+'} = {'+p.overlap.join(', ')+'}'));
  }
  if(f.proof?.operation==='membership_branch_coverage'){
   const p=f.proof;card.append(element('pre',p.subject+' ∈ {'+p.members.join(', ')+'} → '+p.then.map(s=>s.quote).join('；')+'\n'+p.subject+' ∉ {'+p.members.join(', ')+'} → '+(p.otherwise?.quote??'—')));
  }
  if(f.proof?.operation==='declared_file_source_difference'){
   const p=f.proof,available=[...p.declaredOutputs,...p.declaredExternalInputs];
   card.append(localized(element('p'),'计算：所需文件集合 − 已识别的文件来源集合','Calculation: required files − identified file sources'));
   card.append(element('pre','Δ = {'+p.input.join(', ')+'} − {'+available.join(', ')+'} = {'+p.missing.join(', ')+'}'));
  }
  card.append(localized(element('strong'),'建议','Advice'),localized(element('p'),f.suggestion['zh-CN'],f.suggestion.en));
  const detail=element('details');detail.append(localized(element('summary'),'查看对应原句与计算依据','Source clauses and calculation evidence'));
  if(f.assumption)detail.append(localized(element('p'),f.assumption['zh-CN'],f.assumption.en));
  const seen=new Set();for(const s of f.sources){const key=s.start+':'+s.end;if(seen.has(key))continue;seen.add(key);detail.append(element('blockquote',s.quote));}
  if(f.proof)detail.append(element('pre',JSON.stringify(f.proof,null,2)));card.append(detail);host.append(card);
 }
 if(!findings.length){
  if(presentation?.hasApplicableChecks)host.append(localized(element('p'),'本次已计算的约束中未发现冲突。已知禁令见上方 B；这不代表全文已验证或可以直接执行。','No conflict found in the constraints calculated here. Known prohibitions are listed above in B; this is not full-text verification or permission to execute.'));
  else host.append(localized(element('p'),'已提取上方任务关系；尚未得到可做数值、逻辑或依赖验证的约束，因此没有数学相容性结论。','Task relationships are shown above. No applicable numeric, logical or dependency constraints were obtained, so there is no mathematical compatibility conclusion.'));
 }
 for(const n of presentation?.calculationNotes??[]){
  if(findings.length&&!n.combined)continue;
  host.append(localized(element('p'),n.text['zh-CN'],n.text.en));
  if(n.localizedFormula)host.append(localized(element('pre'),n.localizedFormula['zh-CN'],n.localizedFormula.en));
  else if(n.formula)host.append(element('pre',n.formula));
  if(n.assumption)host.append(localized(element('p'),n.assumption['zh-CN'],n.assumption.en));
 }
 if(result.pipeline)host.append(localized(element('p'),'工作包编号不代表依赖；文件来源匹配不证明文件已存在或可用。全局预算与整体完成性尚未验证。','WP numbers do not define dependencies; source matches do not establish file existence or availability. Global budgets and overall completion remain unverified.'));
 const technical=element('details');technical.append(localized(element('summary'),'查看技术详情：分类、原句、公式与求解记录','Technical details: classification, source clauses, formulas and solver records'),element('pre',JSON.stringify(result,null,2)));host.append(technical);
 const draft=element('textarea');draft.id='suggested-task';draft.rows=7;attribute(draft,'aria-label','建议的完整任务文本');editable(draft,l=>sourceDraft(result,result.text,l));
 const draftBox=element('details');draftBox.append(localized(element('summary'),'查看原任务与具体补充建议','Original task and specific clarification advice'),draft,button('复制完整任务文本 / Copy complete task',action(async()=>{await navigator.clipboard.writeText(draft.value);noticePair('已复制原文与具体待确认事项。','Copied original task and specific clarification items.');})));host.append(draftBox);
 host.append(button('下载原始边界计算 JSON / Download original boundary JSON',()=>download('BoundX-admin-original.json',JSON.stringify(result,null,2),'application/json')));
}
