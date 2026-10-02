import fs from'node:fs';import{createHash}from'node:crypto';
const d='docs/reports/7plus1/7P-REPAIR-007',read=p=>JSON.parse(fs.readFileSync(p)),get=n=>read(d+'/'+n),put=(n,v)=>fs.writeFileSync(d+'/'+n,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'}),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const summary=get('SLOT-SUMMARY.json'),before=read('docs/reports/7plus1/7P-REPAIR-006/SLOT-SUMMARY.json'),comp=get('COMPARISON.json'),baseline=get('CASE-IOA-JOINT-BASELINE.json'),tests=get('TESTS.json'),runs=get('RUNS.json'),verify=get('VERIFY.json'),fd=get('FIRST-DIVERGENCE.json'),full=tests.tests.find(x=>x.name==='full-regression'),mechanism=tests.tests.find(x=>x.name==='mechanism-frozen');
const rows=comp.cases.map(c=>{const slots=Object.fromEntries(['I','O','A'].map(k=>{const s=c.slots[k];return[k,{required:s.expected_reviews.length,full:s.expected_reviews.filter(e=>e.finding==='MATCH').length,complete:s.semantic_equivalent===true,actual_status:s.actual_status,expected_status:s.expected_status,blockers:[...s.expected_reviews.filter(e=>e.finding!=='MATCH'),...s.actual_reviews.filter(e=>['FALSE_DEFINED','WRONG_BINDING','WRONG_STATUS'].includes(e.decision))]}];}));return{sample_id:c.sample_id,source_sha256:c.source_sha256,slots,joint_complete:Object.values(slots).every(s=>s.complete),first_blocker:Object.entries(slots).find(([,s])=>!s.complete),trace_path:c.trace_path};});
const joint=rows.filter(r=>r.joint_complete).length;put('CASE-IOA-JOINT-AFTER.json',{authority:d+'/COMPARISON.json',sha256:sha(d+'/COMPARISON.json'),denominator:rows.length,joint,rows});
put('CASE-IOA-JOINT-DIFF.json',{before:baseline.joint,after:joint,denominator:rows.length,semantic_gate:joint>baseline.joint?'PASS':'SEMANTIC_GATE_NOT_MET',first_new_joint_case:rows.find(r=>r.joint_complete&&!baseline.rows.find(b=>b.sample_id===r.sample_id).joint_complete)??null,rows:rows.map(r=>({sample_id:r.sample_id,before:baseline.rows.find(b=>b.sample_id===r.sample_id),after:r})),no_substitute_item_count:true,no_comparator_weakening:true});
const s=summary.by_slot,b=before.by_slot,ref=runs.find(x=>x.sample_id==='REF-001').ref_assertions.every(a=>a.pass),checks={REF001:ref,FOCUSED_NEW:mechanism.exit_code===0,COMPAT_004_005_006:mechanism.counts.pass>=369,FULL_REGRESSION_ZERO_FAILURES:full.exit_code===0&&full.counts.fail===0,DETERMINISM:get('GRAPH-QUERY-RESULTS.json').status==='PASS',TABLE_NON_PROMOTION:get('TABLE-PROMOTION-AUDIT.json').status==='PASS',PROTECTED_ASSETS_UNCHANGED:verify.status==='PASS',I_MATCH:s.I.MATCH>=8,O_MATCH:s.O.MATCH>=6,A_MATCH:s.A.MATCH>=7,P_MATCH:s.P.MATCH>=9,R_MATCH:s.R.MATCH>=1,V_MATCH:s.V.MATCH>=12,C_MATCH:s.C.MATCH>=19,B_MATCH:s.B.MATCH>=14,I_FALSE_DEFINED:s.I.FALSE_DEFINED<=3,O_FALSE_DEFINED:s.O.FALSE_DEFINED<=1,A_FALSE_DEFINED:s.A.FALSE_DEFINED<=2,P_FALSE_DEFINED:s.P.FALSE_DEFINED===0,P_WRONG_BINDING:s.P.WRONG_BINDING===0,R_FALSE_DEFINED:s.R.FALSE_DEFINED===0,R_MISSING:s.R.MISSING===0,B_WRONG_BINDING:s.B.WRONG_BINDING<=6,A_WRONG_BINDING:s.A.WRONG_BINDING<=2,NO_INCREASE_FALSE_DEFINED:Object.keys(s).every(k=>s[k].FALSE_DEFINED<=b[k].FALSE_DEFINED),IDENTITY_GAP_CLOSED:fd.accepted_006_identity_gap_closed,AGGREGATE_MEMBER_CERTIFIED:get('AGGREGATE-MEMBER-IDENTITY-AUDIT.json').status==='PASS',CALL_DECLARATION_CERTIFIED:get('CALL-DECLARATION-BINDING-AUDIT.json').status==='PASS',CASE_IOA_JOINT_INCREASE:joint>baseline.joint};
const failed=Object.keys(checks).filter(k=>!checks[k]),pass=!failed.length,engineering=Object.keys(checks).filter(k=>k!=='CASE_IOA_JOINT_INCREASE').every(k=>checks[k]);
const results={TASK:'7P-REPAIR-007',START_HEAD:get('BASELINE.json').start_head,final_runtime:'research/7plus1-parser/v0.3-7p-repair-007/engine.mjs',implementation_sha256:sha(d+'/IMPLEMENTATION-FROZEN.json'),REF001:ref?'PASS':'FAIL',STANDARD_PARSED_BEFORE:before.STANDARD_PARSED,STANDARD_PARSED_AFTER:summary.STANDARD_PARSED,CASE_IOA_JOINT_BASELINE:baseline.joint+'/9',CASE_IOA_JOINT_AFTER:joint+'/9',before,after:summary,hard_acceptance_checks:checks,hard_acceptance_pass:pass,engineering_non_regression_pass:engineering,failed_gates:failed,SEMANTIC_PROGRESS:joint>baseline.joint?'PASS':'SEMANTIC_GATE_NOT_MET',FIRST_DIVERGENCE_MOVED:fd.first_divergence_moved,FIRST_DIVERGENCE_CLOSED:fd.first_divergence_closed,task_completion:pass?'ACCEPTANCE_CHECKS_PASSED_PENDING_ADMIN':'SEMANTIC_GATE_NOT_MET_NOT_COMPLETE',PARSER_MODIFIED:true,GOLD_MODIFIED:false,SOURCE_MODIFIED:false,BXP_PROTOCOL_MODIFIED:false,PACK_MODEL_THRESHOLD_MODIFIED:false,METHOD_MODIFIED:false,PRODUCTION_RUNTIME_CHANGED:false,PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW'};
put('RESULTS.json',results);put('REQUIRED-CHECKS.json',{checks,all_passed:pass,failed,semantic_full_equivalence:summary.STANDARD_PARSED,case_joint:joint+'/9',case_joint_policy:'Same case: every expected I/O/A entry full MATCH, no wrong binding/false defined/status error. Partial support and tests do not substitute.',SEMANTIC_GATE_NOT_MET:!checks.CASE_IOA_JOINT_INCREASE});
put('PERFORMANCE.json',{measured:true,replay_mode:'Sequential real parse7Plus1, persistent model worker; no full regression concurrent with replay. Durations are local runtime observations.',runs:runs.map(run=>({sample_id:run.sample_id,run_id:run.run_id,duration_ms:run.duration_ms,parse_performance:read(run.trace_path).compiler_v03.performance,models:run.model_signals.map(m=>({resource:m.resource,actually_loaded:m.actually_loaded})),diagnostics:run.model_diagnostics})),wall_sum_ms:runs.reduce((n,r)=>n+r.duration_ms,0),models_thresholds_changed:false});
const skipped=fs.readFileSync(full.log,'utf8').split(/\r?\n/u).filter(l=>l.includes('# SKIP'));put('SKIPPED-TESTS.json',{count:skipped.length,rows:skipped,status:'NOT_EXECUTED_NOT_PASS'});
const matrix=rows.map(r=>`| ${r.sample_id} | ${r.slots.I.full}/${r.slots.I.required} | ${r.slots.O.full}/${r.slots.O.required} | ${r.slots.A.full}/${r.slots.A.required} | ${r.slots.I.complete} | ${r.slots.O.complete} | ${r.slots.A.complete} | ${r.joint_complete} |`).join('\n'),table=Object.keys(s).map(k=>`| ${k} | ${b[k].MATCH} → ${s[k].MATCH} | ${s[k].MISSING} | ${s[k].FALSE_DEFINED} | ${s[k].WRONG_BINDING} | ${s[k].WRONG_STATUS} | ${s[k].PARTIAL_SUPPORT} |`).join('\n');
put('REPORT.md',`# 7P-REPAIR-007 — 身份闭合候选与语义验收

本轮任务**${pass?'门槛通过，等待 ADMIN':'未完成语义验收：SEMANTIC_GATE_NOT_MET'}**。同一样本 I/O/A 联合完整匹配 **${baseline.joint}/9 → ${joint}/9**；STANDARD_PARSED **${before.STANDARD_PARSED} → ${summary.STANDARD_PARSED}**。${joint===0?'没有首个 joint MATCH，因此不存在可交付的首个 joint MATCH 形成证明；身份机制认证不能替代该证明。':''} PRODUCTION_READY=false。

## 授权与实现

完整读取 007 任务书、v0.3 规范、006 封存报告、诊断、对比和真实 Trace/实现。分支 review/7plus1-parser，从 ${results.START_HEAD}（006 后继）开始；任务书和指针由 ADMIN 远端提交取得，没有自行重设计任务。

新增 cross-instruction-identity.mjs，位于 Frame Certification 后、Eligibility 前。已有解析动作、单一显式文件、backtick 枚举的符号成员建立稳定的 owner+symbol 身份；成员集合产生 ITEM→UNION，动作对象关系与作用域一致。原始聚合 mention 保留 provenance，成员不再只有一串文字。更新前/后保持同一工件身份。

已认证调用仅在兼容任务根、符号、文件上下文及候选唯一时链接集合成员与声明；同名不同文件、竞争成员或等权声明保持未决。COREFERENCE 和已有 CONJUNCTION/PATIENT 是原合同关系；不新增规范关系。成员行为按 member ID 分别记录主修改、调用、声明、参数表达式和双方原文/路径，禁止一条调用复制给多个成员。

当前结构支持独立一级任务标题隔离、显式文件标题限定及唯一候选；没有按文本距离绑定。未覆盖的非 backtick 集合、无唯一文件或条件依赖集合保持原前端状态。绑定声明证明的是身份与明确调用；代码体仍是 owned content，不执行、不从函数名猜枚举语义。实验副本 engine 与导出版本标记为 007；其余 006 模块字节保留。QI–QB、Eligibility、投影、模型、阈值、Pack、Gold/Source、BXP/v0.3 方法及生产入口/58618 不变。

## 实际验证

41 个预声明非 Gold 原文由真实 NLP 收集；17 项新身份断言、352 项保留机制断言及 16 项新增输入上的旧 Frame 断言合计 **${mechanism.counts.pass}/${mechanism.counts.tests}**。原 Parser 回归 ${tests.tests.find(x=>x.name==='original-parser-regression').counts.pass}/${tests.tests.find(x=>x.name==='original-parser-regression').counts.tests}。全量 **${full.counts.pass} pass / ${full.counts.fail} fail / ${full.counts.skipped} skipped**，skipped 不是 PASS。

开发期首次失败日志保留（对象—scope 关系、未决类型枚举及导出版本标签问题）；修复后冻结，没有覆盖首次记录。冻结后 10/10 原文模型重放，REF-001=${results.REF001}，BGE/E5/NLI 实际加载见 RUNS/PERFORMANCE。51 份保存信号复算的身份层、IR、Canonical 一致；这是确定性编译核验，不冒称独立模型复跑。

## 三个不同指标

下表分数仅是该槽已完整匹配的人工条目数/必需条目数，boolean 才表示槽位完全匹配。完整账本及逐项阻断在 CASE-IOA-JOINT-BASELINE/AFTER/DIFF；没有修改比较器、分母或 expected。

| STANDARD | I 条目 | O 条目 | A 条目 | I complete | O complete | A complete | Joint |
|---|---:|---:|---:|---|---|---|---|
${matrix}

全语料语义条目数量如下，不是案例通过率：

| 槽 | MATCH 前→后 | MISSING | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS | PARTIAL_SUPPORT |
|---|---:|---:|---:|---:|---:|---:|
${table}

仅在冻结重放后离线审阅 expected。Canonical、事实和表达式原样的条目才复用 006 判断；变化的 RESOLVED 独立复核。SWAI-001 的聚合 O/A 因增加成员关系有新事实 ID，但仍为 PARTIAL_SUPPORT，没有因为身份认证就改判完整扫描行为。未决、缺失、错误 resolved 分别保留。

## 首处分歧与未达门槛

006 的三个成员身份以及调用到声明缺口已认证闭合：SWAI-001 有 3 个成员、3 条成员连续性、3 条调用→声明和 3 条成员行为组合，全部含精确来源、文件拥有者及结构路径。完整链在四份身份/绑定/组合审计与 FIRST-DIVERGENCE 中。

下一处首要依赖缺口为 **DECLARED_BEHAVIOR_SEMANTICS_AND_ARGUMENT_INSTANTIATION**：冻结前端尚未把 helper 文件名枚举行为及形参—实际目录的对应转换成可证明的语义图。三个调用虽绑定 helper 身份，仍不能自动等同于相应 active/archived 文件集合并集扫描。测试的断言语义与命名要求也未完整类型化。不能按答案补槽，不能执行任务代码来推断边界；超出本轮身份机制的授权由 ADMIN 决定。

因此 CASE_IOA_JOINT_INCREASE=${checks.CASE_IOA_JOINT_INCREASE}，**${results.task_completion}**。专项/合同/全量测试即使通过，也不允许声明 007 已完成。此交付封存的是诊断候选；${verify.protected_files} 个原文件和旧封存不变，冻结 ${Object.keys(get('IMPLEMENTATION-FROZEN.json').files).length} 个实现/测试/输入文件。

## 停止

只推送 review/7plus1-parser，未 merge/release/tag、未切换生产入口。MANIFEST/SHA256SUMS/SEAL 固定候选与首次重放；完整 structured Trace 与实际 7+1 位于 replay/。停止，STATUS=WAITING_ADMIN_REVIEW。
`);console.log({joint:baseline.joint+'/9 -> '+joint+'/9',hard_acceptance:pass,failed,full:full.counts});
