// Read the saved program result. No model calls, source parsing or computation.
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const states={PARTIAL:'部分计算：存在缺口',CONFLICT:'发现约束冲突',CALCULATED_FRAGMENT:'受支持的明确约束已计算',UNKNOWN:'未知：未提供运行观测',TRUE:'成立',FALSE:'不成立',satisfiable:'存在可行组合',unsatisfiable:'不存在可行组合',NOT_APPLICABLE:'没有此类明确计算项',CALCULATED:'已计算',UNSUPPORTED:'超出受支持计算范围'};
export function renderBoundaryCalculations(container,trace,onEvidence=()=>{},onObserve=null){
 container.replaceChildren();container.append(el('h2','最终结果：7+1边界数学计算'));
 const c=trace?.boundary_calculations;
 if(!c){container.append(el('p',trace?'此历史记录没有保存本版计算阶段；未重算、未补造。':'等待IR与固定7+1生成后，计算程序直接消费同一IR。'));return;}
 if(c.format==='boundx-direct-ir-calculation/1'){
  const names=new Map([...(trace.ir.entities??[]),...(trace.ir.variables??[])].map(x=>[x.id,x.label]));
  container.append(el('h3',(states[c.status]??c.status)+'；联合求解：'+(states[c.joint?.base?.result]??c.joint?.base?.result??'未保存')));
  container.append(el('p','计算输入就是LLM候选IR；技术接受状态另存。以下是真实操作数与程序输出，不是模型自报结论。'));
  const math=c.mathematical_summary;
  if(math){container.append(el('h3','集合与完成公式的计算值'),el('p','外部输入文件：{'+math.input_files.map(x=>x.label).join('，')+'}，数量 '+math.input_count),el('p','文件产物：{'+math.output_artifacts.map(x=>x.label).join('，')+'}，数量 '+math.output_count),el('p','输入／产物交集：{'+math.intersection.map(x=>x.label).join('，')+'}；并集数量 '+math.union_count));for(const x of math.completions){container.append(el('p','完成公式 '+x.requirement_id+'：满足赋值 '+x.satisfied_count+'，违反赋值 '+x.violation_count+'；接受状态 '+x.status));if(x.premise_true_count!==undefined)container.append(el('p','完成前提：真 '+x.premise_true_count+'，假 '+x.premise_false_count+'；这些是公式赋值数，不是全模型解数量。'));}}
  if(c.joint?.base?.witness){const witness=c.joint.base.witness;container.append(el('h3','程序构造并核验的联合见证'),el('p','这是数学赋值，不是业务执行记录或授权。'));for(const x of witness.execution_trace??[])container.append(el('p','见证事件 '+x.event_id+'；环境 '+(names.get(x.roles.ENVIRONMENT?.id)??x.roles.ENVIRONMENT?.id??'未赋值')));for(const s of Object.values(witness.metric_schedule??{}))container.append(el('p','见证整体耗时 '+s.duration+' '+s.unit+'；各时间点见下方完整证书。'));const q=c.joint.base.quantified_verification;if(q)container.append(el('p','已核验这份构造执行中全部事件的全称约束；不证明任意未来执行自动合规。'));}
  for(const q of c.completion_queries??[])container.append(el('p','完成分支可满足性：假设任务完成为真，联合求解 '+(states[q.result]??q.result)+'；见证核验 '+(q.verification?.valid?'通过':'未通过')+'。这是可行完成分支，不是实际已完成。'));
  for(const r of c.joint?.base?.input_boundary_verification?.results??[])container.append(el('p','外部输入范围：实际使用={'+r.used.map(id=>names.get(id)??id).join('，')+'} ⊆ 允许={'+r.allowed.map(id=>names.get(id)??id).join('，')+'}；核验 '+({SATISFIED:'成立',VIOLATED:'违反',UNKNOWN:'未知'}[r.result]??r.result)+'。这是构造见证，实际执行需另提供观测。'));
  for(const [id,values]of Object.entries(c.finite_domains??{}))container.append(el('p','可选范围：'+(names.get(id)??id)+' = {'+values.map(x=>names.get(x)??x).join('，')+'}；数量 '+values.length));
  for(const x of c.intervals??[])container.append(el('p','区间 '+x.subject+'：'+JSON.stringify({lower:x.lower,upper:x.upper,unit:x.unit,empty:x.empty})));
  for(const gap of c.gaps??[])container.append(el('p','未完成：'+(gap.node_id??'整体')+' · '+gap.reason));
  const d=el('details');d.append(el('summary','程序输入公式、联合求解与原始计算结果'),el('pre',JSON.stringify(c,null,2)));container.append(d);return;
 }
 const labels=new Map((trace.ir.entities??[]).map(x=>[x.id,x.label]));labels.set('ROOT','根任务');
 for(const f of trace.ir.facts.filter(x=>x.kind==='EVENT'))labels.set(f.event.id,f.event.predicate+'（'+(f.roles??[]).map(r=>(r.role==='PERFORMER'?'执行者：':'')+(r.entity?.label??r.entity_id)).join('、')+'）');
 const name=id=>labels.get(id)??id;
 const atoms=new Map(c.boolean.atoms.map(x=>[x.id,x.meaning]));
  const atomText=a=>a?.kind==='PROPERTY_TEST'?(a.test.operator==='IMMEDIATE'?'立即执行 '+name(a.test.target_id)+'（不得无故延迟，非0秒期限）':name(a.test.target_id)+(a.test.property_path.length?'.'+a.test.property_path.join('.'):'')+' '+a.test.operator+' '+JSON.stringify(a.test.value)):a?.kind==='OUTPUT_BEHAVIOR'?'产物 '+name(a.artifact_id)+' 的内部行为 '+name(a.event_id):a?.kind==='STATE'?a.predicate+'('+a.args.map(name).join('、')+')':a?.event_id?'执行 '+name(a.event_id):a?.kind==='TASK_COMPLETE'?'任务完成':a?.kind==='TASK_STOP'?'任务停止':null;
 const formula=x=>typeof x==='boolean'?String(x):x.var?(atomText(atoms.get(x.var))??x.var):x.not?'非('+formula(x.not)+')':x.all?'('+x.all.map(formula).join(' 且 ')+')':x.any?'('+x.any.map(formula).join(' 或 ')+')':x.implies?'('+formula(x.implies[0])+' ⇒ '+formula(x.implies[1])+')':'未支持表达式';
 const row=(section,text,sources)=>{const p=el('p',text);if(sources?.length){const button=el('button','查看本条原文依据');button.className='secondary';button.onclick=()=>onEvidence(sources);p.append(document.createTextNode(' '),button);}section.append(p);};
 const section=title=>{const d=el('details');d.open=false;d.append(el('summary',title));container.append(d);return d;};
 const math=c.mathematical_results;
 if(math){
  const overview=el('section');overview.className='panel';
  overview.append(el('h3','这次算出了什么？'));
  const incomplete=math.coverage.unsupported_count>0||c.coverage.source_gaps>0||c.coverage.unresolved_facts>0||!math.sets.input.complete||!math.sets.output.complete;
  const conclusion=math.conflicts.length?'发现已证明的约束冲突':incomplete?'已得到部分结果，但仍有未计算或未明确项':math.unknown_frontier.length?'明确边界已计算；部分关系仍待证明':'明确边界已计算';
  overview.append(el('h3',conclusion));
  row(overview,'输入：'+math.sets.input.members.map(x=>x.label).join('、')+'（'+(math.sets.input.complete?'共':'已知')+math.sets.input.cardinality+'项）',math.sets.input.sources);
  row(overview,'产物：'+math.sets.output.members.map(x=>x.label).join('、')+'（'+(math.sets.output.complete?'共':'已知')+math.sets.output.cardinality+'项）',math.sets.output.sources);
  for(const x of math.intervals){const lower=x.lower?x.lower.value+(x.lower.inclusive?' ≤ ':' < '):'',upper=x.upper?(x.upper.inclusive?' ≤ ':' < ')+x.upper.value:'';row(overview,'时间／数量范围：'+lower+name(x.subject)+'的'+x.dimension+upper+' '+x.unit+'；'+(x.empty?'没有允许值，存在冲突':'允许区间非空'),x.proof.sources);}
  for(const x of math.completion){
   if(x.status!=='CALCULATED'){row(overview,'完成条件：暂未完成计算，请展开明细查看原因。');continue;}
   const meanings=new Map(x.atoms.map(a=>[a.id,a.state?a.state.predicate+'（'+a.state.args.map(name).join('、')+'）':a.test.operator+'（'+name(a.test.target_id)+'）']));
   const expression=f=>typeof f==='boolean'?(f?'成立':'不成立'):f.var?(meanings.get(f.var)??'未识别状态'):f.not?'不满足「'+expression(f.not)+'」':f.all?f.all.map(expression).join('，并且 '):f.any?'以下至少一项成立：'+f.any.map(expression).join('；'):'未支持表达式';
   const directions={IFF:'当且仅当以下条件成立，任务完成',NECESSARY:'任务完成必须满足以下条件；原文未声明这些条件已足够',SUFFICIENT:'以下条件成立即可完成；原文未声明它们是唯一完成途径'};
   row(overview,'完成条件：'+(directions[x.direction]??'请核对条件方向')+'：'+expression(x.formula),x.proof.sources);
   row(overview,'数学结果：完成前提有'+x.premise.total_assignments+'种真假组合，其中'+x.premise.solution_count+'种为真；完成关系有'+x.completion_relation.total_assignments+'种赋值，其中'+x.completion_relation.solution_count+'种满足。这里是逻辑枚举，不是任务成功率。');
  }
  row(overview,'先后关系：已保存'+math.dependency.edges.length+'条；'+(math.dependency.cycles.length?'发现'+math.dependency.cycles.length+'个循环':'未发现循环')+'。各关系仍须遵守其条件前提。',math.dependency.proof.sources);
  const forbidden=el('details');forbidden.open=true;forbidden.append(el('summary','禁止边界（'+math.boundary_atoms.negative.length+'项动作／对象约束）'));
  const exprs=new Map((trace.ir.expressions??[]).map(x=>[x.id,x]));
  const conditionText=(id,seen=new Set())=>{if(seen.has(id))return '条件引用循环';const x=exprs.get(id);if(!x)return '条件明细未提供';const next=new Set([...seen,id]);if(x.op==='STATE')return x.state.predicate+'（'+x.state.args.map(name).join('、')+'）';if(x.op==='TEST')return name(x.test.target_id)+' '+x.test.operator+' '+JSON.stringify(x.test.value);if(x.op==='NOT')return '非（'+x.operands.map(v=>conditionText(v,next)).join('、')+'）';if(['AND','OR'].includes(x.op))return x.operands.map(v=>conditionText(v,next)).join(x.op==='AND'?' 且 ':' 或 ');return '请展开条件明细';};
  for(const a of math.boundary_atoms.negative)row(forbidden,'禁止：'+a.operation+'；对象：'+(a.operands.map(x=>x.label).join('、')||'范围见原文')+'；'+(a.conditions.length?'适用前提：'+a.conditions.map(x=>conditionText(x.expression_id)).join('；'):'无条件适用'),a.sources);
  overview.append(forbidden);
  row(overview,'待处理：'+math.conflicts.length+'项已证明冲突；'+math.unknown_frontier.length+'项关系／事实尚未证明；'+math.coverage.unsupported_count+'项未支持计算；'+c.coverage.source_gaps+'项来源缺口。');
  if(math.joint){row(overview,'联合抽象边界：'+({satisfiable:'可满足，F非空；已构造并核验联合见证',unsatisfiable:'不可满足；已声明的约束不能同时成立',unknown:'尚未证明；存在合同或计算缺口'}[math.joint.base.result]??'尚未确定')+'；联合缺口 '+math.joint.gaps.length+'项。');for(const q of math.joint.completion)row(overview,'完成目标：'+(q.result==='satisfiable'?'存在满足全部已纳入约束的完成赋值':q.result==='unsatisfiable'?'完成目标与当前约束不相容':'尚未证明')+'；见证逐约束核验 '+(q.verification?.valid?'通过':'未通过或未生成'));for(const q of math.joint.trigger_branches)row(overview,'停止触发分支：'+(q.result==='satisfiable'?'存在满足边界的赋值':q.result==='unsatisfiable'?'与当前约束不相容':'尚未证明')+'；见证核验 '+(q.verification?.valid?'通过':'未通过或未生成'));}
  row(overview,'结论边界：以上是声明抽象约束的计算，不是实际工期预测或业务执行记录。没有运行观测，不能认定任务已完成，也不构成执行授权。');
  overview.append(el('p','下面可展开运算过程、真值表和具体待定原因；无需阅读JSON即可核对以上结果。'));container.append(overview);
  const final=section('数学计算结果：操作数 → 运算 → 计算值');
  const members=x=>'{'+x.members.map(v=>v.label).join('、')+'}';
  row(final,'输入集合 I = '+members(math.sets.input)+'；'+(math.sets.input.complete?'基数 ':'已知成员数，完整基数未确定：')+math.sets.input.cardinality,math.sets.input.sources);
  row(final,'产物集合 O = '+members(math.sets.output)+'；'+(math.sets.output.complete?'基数 ':'已知成员数，完整基数未确定：')+math.sets.output.cardinality,math.sets.output.sources);
  row(final,math.sets.intersection.status==='CALCULATED'?'I∩O = '+(math.sets.intersection.cardinality?members(math.sets.intersection):'∅')+'；I∪O的基数 = '+math.sets.union.cardinality:'交集尚未确定；已知成员 '+members(math.sets.intersection)+'；不能证明为空或给出精确总基数。',math.sets.proof.sources);
  for(const x of math.intervals){const value=(x.lower?.inclusive?'[':'(')+(x.lower?.value??'-∞')+','+(x.upper?.value??'+∞')+(x.upper?.inclusive?']':')');row(final,'区间交集：'+name(x.subject)+' ∈ '+value+' '+x.unit+'；'+(x.empty?'空集：冲突':'非空'),x.proof.sources);}
  for(const x of math.completion){
   if(x.status!=='CALCULATED'){row(final,'完成公式未算：'+x.reason,x.proof.sources);continue;}
   const meanings=new Map(x.atoms.map(a=>[a.id,a.state?a.state.predicate+'('+a.state.args.map(name).join('、')+')':a.test.operator+'('+name(a.test.target_id)+')']));
   const expression=f=>typeof f==='boolean'?String(f):f.var?(meanings.get(f.var)??f.var):f.not?'非('+expression(f.not)+')':f.all?'('+f.all.map(expression).join(' 且 ')+')':f.any?'('+f.any.map(expression).join(' 或 ')+')':'未支持';
   row(final,'完成前提 K = '+expression(x.formula),x.proof.sources);
   row(final,'前提真值枚举：'+x.premise.total_assignments+'种确定赋值；TRUE '+x.premise.solution_count+'种，FALSE '+x.premise.false_count+'种。');
   row(final,'完成关系 '+({IFF:'C ↔ K',SUFFICIENT:'K ⇒ C',NECESSARY:'C ⇒ K'}[x.direction]??x.direction)+'：'+x.completion_relation.total_assignments+'种赋值；满足 '+x.completion_relation.solution_count+'种，违反 '+x.completion_relation.violation_count+'种。计数不是准确率或发生概率。');
   const table=el('table'),head=el('tr');for(const title of [...x.premise.variables.map(id=>meanings.get(id)??id),'K'])head.append(el('th',title));table.append(head);
   for(let mask=0;mask<x.premise.membership.length;mask++){const tr=el('tr');for(let bit=0;bit<x.premise.variables.length;bit++)tr.append(el('td',String((mask>>(x.premise.variables.length-bit-1))&1)));tr.append(el('td',x.premise.membership[mask]));table.append(tr);}final.append(table);
  }
  row(final,'显式依赖图：'+math.dependency.edges.length+'条边；环集合 '+(math.dependency.cycles.length?'非空':'∅')+'。成功状态门保留在每条边的表达式中。',math.dependency.proof.sources);
  for(const a of math.boundary_atoms.negative)row(final,'禁止域：'+a.operation+' × {'+a.operands.map(x=>x.label).join('、')+'}；'+(a.conditions.length?'条件 '+a.conditions.map(x=>x.expression_id).join('、'):'无条件')+'；'+name(a.owner_id),a.sources);
  row(final,'已证明冲突 '+math.conflicts.length+'项；待定比较及事实 '+math.unknown_frontier.length+'项；未支持计算 '+math.coverage.unsupported_count+'项。没有冲突证明不等于全部比较已经证明一致。');
  row(final,'布尔分项求解：'+(states[math.boolean.result]??math.boolean.result??'未确定')+'。联合声明模型结果另列；计算不签发业务授权。');
  for(const s of math.scope_bindings??[]){row(final,(s.kind==='EXTERNAL_INPUT'?'外部输入排他范围':'逐操作允许环境')+'：{'+s.allowed.map(name).join('、')+'}；适用操作：'+s.subject_event_ids.map(name).join('、'));for(const c of s.checks)row(final,name(c.event_id)+'的外部消费：{'+c.requested.map(name).join('、')+'}；子集检验：'+c.result);}
  if(math.joint){
   const d=section('联合约束与见证：每一条如何核验');for(const gap of math.joint.gaps)row(d,'联合缺口：'+gap.reason);
   const q=math.joint.completion.find(x=>x.witness)??math.joint.base;
   if(q.witness){
    for(const [id,value]of Object.entries(q.witness.boolean)){
     const a=math.joint.problem.variable_meanings[id];
     const label=a?.kind==='STATE_AT_EVENT_START'?a.predicate+'在'+name(a.checked_event_id)+'开始时已成立':a?.kind==='STATE'?a.predicate+'（'+a.args.map(name).join('、')+'）':a?.kind==='ARTIFACT_READY_AT_USE'?'产物 '+name(a.artifact_id)+' 在 '+name(a.consumer_event_id)+' 使用处可用':a?.kind==='TASK_COMPLETE'?'任务完成':a?.event_id?name(a.event_id)+(a.kind==='EVENT_ACTIVATED'?'已激活':'已实现'):a?.kind==='PROPERTY_TEST'?'属性约束：'+atomText(a):id;
     row(d,label+' = '+(value?'真':'假'));
    }
    for(const x of math.joint.problem.intervals)row(d,name(x.subject)+'的'+x.dimension+' = '+q.witness.intervals[x.id]+' '+x.unit);
    for(const domain of math.joint.problem.domains??[]){const value=q.witness.domain_values?.[domain.variable_id??domain.id];if(value!==undefined)row(d,name(domain.event_id)+'的见证执行环境 = '+name(value)+'；成员核验成立');}
    for(const s of Object.values(q.witness.metric_schedule??{}))row(d,'时间见证：最早开始为0，最后结束为'+s.duration+' '+s.unit+'，故本见证总耗时为'+s.duration+' '+s.unit+'；保持源文先后及开始时前提。时间点是数学赋值，不是工期预测。');
    row(d,'核验：'+q.verification.checks.filter(x=>x.pass).length+'/'+q.verification.checks.length+'条通过；独立检查布尔、范围成员、开始时前提、区间、先后及总耗时。');
    const raw=el('details');raw.append(el('summary','联合见证的全部赋值与逐约束核验'),el('pre',JSON.stringify({witness:q.witness,verification:q.verification},null,2)));d.append(raw);
   }
  }
  if(math.unknown_frontier.length){const pending=section('还有哪些关系不能下结论？');const boundaryNames=new Map(Object.values(math.boundary_atoms).flat().map(a=>[a.fact_id,a.operation+'（'+a.operands.map(x=>x.label).join('、')+'）']));const reasons={OPERATION_RELATION_NOT_PROVEN:'尚未证明这两种操作是否等价、互斥或相容；不能仅凭名称下结论',UNACCEPTED_FACT:'该事实尚未被技术校验接受',ACTOR_RELATION_NOT_PROVEN:'参与主体关系尚未证明',OBJECT_RELATION_NOT_PROVEN:'对象归属关系尚未证明'};for(const x of math.unknown_frontier)row(pending,(x.left_atom?(boundaryNames.get(x.left_atom)??name(x.left_atom))+' 与 '+(boundaryNames.get(x.right_atom)??name(x.right_atom)):name(x.fact_id))+'：'+(reasons[x.reason]??'未证明：'+x.reason),x.proof?.sources??x.sources);}
 }else container.append(el('p','此历史结果未保存新版数学结果报告；没有自动重算或补造。'));
 container.append(el('p',states[c.status]??c.status),el('p','输入来自同一次IR；程序计算，不再调用LLM。可行组合不是实际完成，技术接受与计算均不构成业务授权。'));
 container.append(el('p','原文覆盖缺口 '+c.coverage.source_gaps+'；未决事实 '+c.coverage.unresolved_facts+'；尚未证明全部BXP符合性。'));
 const b=section('1. 条件与义务的布尔一致性');
 row(b,states[c.boolean.result]??states[c.boolean.status]??c.boolean.status);
 for(const x of c.boolean.components??[])if(x.status==='UNSUPPORTED')row(b,'未完成分量：'+x.reason+'；变量数 '+x.variables.length);
 for(const x of c.boolean.formulas)row(b,formula(x.formula),x.sources);
 const q=section('2. 数量限制与区间交集');
 const comparator={EQ:'=',LT:'<',LTE:'≤',GT:'>',GTE:'≥'};
 for(const x of c.quantities){
  const mode=x.distribution??x.quantity.distribution?.mode;
  row(q,name(x.quantity.target_id)+'：'+(mode==='EACH'?'每个成员分别满足；':mode==='AGGREGATE'?'集合合计满足；':'')+x.quantity.metric+' '+comparator[x.quantity.comparator]+' '+x.quantity.value+' '+x.quantity.unit+'；计数范围 '+name(x.quantity.count_scope)+(x.domain_id?'；成员域 '+x.domain_id:'')+(x.quantity.use==='WORK_PLAN'?'；计划安排，不是资源配额':'')+'；实际核验 '+(states[x.result]??x.result),x.sources);
  for(const member of x.members??[])row(q,'成员 '+name(member.member_id)+'：'+(states[member.result]??member.result),x.sources);
 }
 for(const x of c.intervals)row(q,'目标 '+name(x.subject)+'：合并下界 '+(x.lower?(x.lower.inclusive?'≥ ':'> ')+x.lower.value:'未设定')+'，上界 '+(x.upper?(x.upper.inclusive?'≤ ':'< ')+x.upper.value:'未设定')+' '+x.unit+'；'+(x.empty?'空区间，存在冲突':'区间非空，不代表实际已满足'),x.input_constraints.flatMap(v=>v.sources));
 if(!c.quantities.length)row(q,'没有已表达的数量约束。');
 const p=section('3. 条件、完成和停止的当前值');
 for(const x of c.conditions){
  row(p,name(x.target_id)+'；方向 '+({NECESSARY:'必要前提',SUFFICIENT:'充分触发',IFF:'充要条件',ORDER:'纯先后'})[x.direction]+'；'+(x.temporal==='AFTER'?'之后':x.temporal==='BEFORE'?'之前':'无时间先后')+'；前提当前值 '+(states[x.condition_value]??x.condition_value),x.sources);
  if(x.assessment){const a=x.assessment;row(p,'结果观测：'+(states[a.observed_outcome]??a.observed_outcome)+'；逻辑条件核验：'+(a.logical_result==='TRUE'?'本条逻辑条件满足':a.logical_result==='FALSE'?'观测违反本条逻辑条件':'未知，尚不能判断')+(a.temporal_result==='UNKNOWN'?'；实际先后尚需时间观测':'')+'。条件满足不证明动作已执行，不产生执行许可。',x.sources);}
 }
 if(!c.conditions.length)row(p,'没有已表达的条件或根任务转换。');
 const d=section('4. 明确阶段／事件先后与循环检查');
 row(d,'显式先后 '+c.dependency.prerequisite_edges+' 条；循环 '+c.dependency.cycles.length+' 个。产物可用性不会被改成整项事件先后。');
 for(const x of c.dependency.edges)row(d,name(x.from)+' → '+name(x.to),x.sources);
 for(const x of c.dependency.conditional_edges)row(d,'条件分支保留：'+name(x.from)+' → '+name(x.to)+'；未并入无条件先后图',x.sources);
 const s=section('5. 对象范围与产物可用性');
 for(const x of c.ranges)row(s,'范围目标 '+name(x.target_id)+'：'+(x.members?x.members.map(name).join('、'):states[x.result]??x.result)+'；范围外不等于获得许可',x.sources);
 for(const x of c.availability)row(s,name(x.artifact_id)+' → '+name(x.consumer_event_id)+'；要求 '+(x.availability==='COMPLETE_RESULT'?'完整结果可用':'被使用部分可用')+'；当前 '+(states[x.result]??x.result),x.sources);
 if(!c.ranges.length&&!c.availability.length)row(s,'没有已表达的可计算范围或产物可用性依赖。');
 if(c.conflicts.length){const conflicts=section('计算发现的冲突');for(const x of c.conflicts)row(conflicts,JSON.stringify(x));}
 if(c.unsupported.length){const u=section('未计算项目：不计为通过');for(const x of c.unsupported)row(u,x.fact_id+'：'+x.reason,x.sources);}
 const raw=el('details');raw.append(el('summary','开发详情：计算JSON'),el('pre',JSON.stringify(c,null,2)));container.append(raw);
 if(onObserve){
  const form=el('form');form.append(el('h3','输入实际观测，重新核对边界'),el('p','这些值由你提供，不是模型判断或程序采集的事实。未知留空。每次重算另存记录，原文、语义、7+1与原计算不变；不调用模型。'));
  const fields=[];
  const choice=(label,key,id,metadata={})=>{const line=el('label',label+' '),select=el('select');for(const [value,text]of [['','未知'],['true','是／成立'],['false','否／不成立']]){const o=el('option',text);o.value=value;select.append(o);}line.append(select);form.append(line,el('br'));fields.push({key,id,select,metadata});};
  for(const x of trace.ir.expressions.filter(x=>x.op==='STATE'))choice('状态：'+x.state.predicate+'（'+x.state.args.map(name).join('、')+'）'+(x.state.polarity==='NEGATIVE'?'；本条否定状态是否成立':''),'states',x.id);
  for(const x of c.conditions.filter(x=>x.assessment?.status==='CHECKED'))choice('结果：'+name(x.assessment.target_id)+'；'+({TASK_COMPLETE:'任务是否完成',TASK_STOP:'任务是否停止',EVENT_STATE:'事件状态是否成立',EVENT_EXECUTED:'动作是否已发生',OUTPUT_BEHAVIOR:'输出行为是否成立'}[x.assessment.outcome_kind]??x.assessment.outcome_kind),'outcomes',x.claim_id,{target_id:x.assessment.target_id,kind:x.assessment.outcome_kind,known:true});
  for(const x of c.quantities.filter(x=>x.quantity.distribution?.mode!=='EACH')){const line=el('label','实际数量：'+name(x.quantity.target_id)+' '+x.quantity.metric+'（'+x.quantity.unit+'） '),input=el('input');input.type='number';input.step='any';line.append(input);form.append(line,el('br'));fields.push({key:'quantities',id:x.claim_id,select:input,metadata:{target_id:x.quantity.target_id,count_scope:x.quantity.count_scope,unit:x.quantity.unit}});}
  const button=el('button','仅重算，不调用LLM');button.type='submit';const message=el('p'),resultBox=el('section');
  form.append(button,message,resultBox);form.onsubmit=async e=>{e.preventDefault();button.disabled=true;try{const input={states:{},outcomes:{},quantities:{}};for(const f of fields){if(f.select.value==='')continue;const value=f.key==='quantities'?Number(f.select.value):f.select.value==='true';input[f.key][f.id]=f.key==='states'?value:{...f.metadata,value};}const result=await onObserve(input);message.textContent='已保存观测 '+result.observation_id+'；用户自报，未独立验证。';renderBoundaryCalculations(resultBox,{...trace,boundary_calculations:result.calculation},onEvidence);const a=el('a','下载本次观测与计算');a.href=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));a.download=result.observation_id+'.json';resultBox.append(a);}catch(error){message.textContent='未接受本次观测：'+error.message;}finally{button.disabled=false;}};
  container.append(form);
 }
 if(container.dataset.runId){const download=el('a','导出原编译的完整计算JSON');download.href='/api/runs/'+container.dataset.runId+'/calculations.json';download.download='';container.append(download);}
}
