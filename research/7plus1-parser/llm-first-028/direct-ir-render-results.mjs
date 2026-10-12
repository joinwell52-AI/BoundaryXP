export function renderDirectCalculations(c){
 const m=c.mathematical_summary,lines=['## 程序边界计算结果','',`计算状态：${c.status}；联合求解：${c.joint.base.result}。`];
 if(m){const set=x=>'{'+x.map(v=>v.label).join('，')+'}';lines.push(`外部输入文件集合：${set(m.input_files)}；数量=${m.input_count}。`,`文件产物集合：${set(m.output_artifacts)}；数量=${m.output_count}。`,`输入与文件产物交集：${set(m.intersection)}；并集：${set(m.union)}；并集数量=${m.union_count}。`);for(const f of m.completions)lines.push(`完成公式 ${f.requirement_id}：满足赋值=${f.satisfied_count}，违反赋值=${f.violation_count}；接受状态=${f.status}。`,...(f.premise_true_count===undefined?[]:[`完成前提：真=${f.premise_true_count}，假=${f.premise_false_count}。这些是独立公式赋值数，不是全模型解数量。`]));}
 for(const x of c.intervals)lines.push(`数值允许区间 ${x.subject}：${x.lower?.inclusive?'[':'('}${x.lower?.value??'-∞'},${x.upper?.value??'+∞'}${x.upper?.inclusive?']':')'} ${x.unit}；空集=${x.empty}。`);
 if(c.joint.base.witness){lines.push('','### 程序联合见证','这是一份构造数学赋值，不是业务执行记录。');for(const schedule of Object.values(c.joint.base.witness.metric_schedule??{}))lines.push(`构造整体耗时=${schedule.duration} ${schedule.unit}；逐时间点与核验见完整Trace。`);lines.push(`见证逐约束核验=${c.joint.base.verification?.valid}。`);if(c.joint.base.quantified_verification)lines.push('全称约束覆盖本构造执行的全部实际事件；不证明任意未来执行自动合规。');}
 for(const x of c.priority_rules??[])lines.push(`优先响应 ${x.id}：触发后优先响应；没有追加数值延迟。`);
 for(const q of c.completion_queries??[])lines.push(`完成分支查询：假设${q.assumption.state_id}=true，结果=${q.result}，见证核验=${q.verification?.valid}。不是新增原文义务，也不是实际完成记录。`);
 if(c.gaps.length)lines.push('','### 未完成项',...c.gaps.map(x=>'- '+(x.node_id??'整体')+'：'+x.reason));
 lines.push('','技术接受、抽象可满足、实际完成和业务授权分别判断。business_decision=null；execution_authorization=null。');return lines.join('\n')+'\n';
}
