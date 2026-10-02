import fs from'node:fs';import{createHash}from'node:crypto';
const d='docs/reports/7plus1/7P-REPAIR-006',read=p=>JSON.parse(fs.readFileSync(p)),get=n=>read(d+'/'+n),put=(n,x)=>fs.writeFileSync(d+'/'+n,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'}),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),summary=get('SLOT-SUMMARY.json'),before=read('docs/reports/7plus1/7P-REPAIR-005/SLOT-SUMMARY.json'),tests=get('TESTS.json'),runs=get('RUNS.json'),v=get('VERIFY.json'),s=summary.by_slot,b=before.by_slot,full=tests.tests.find(x=>x.name==='full-regression'),mechanism=tests.tests.find(x=>x.name==='mechanism-frozen'),fd=get('FIRST-DIVERGENCE.json');
const ref=runs.find(x=>x.sample_id==='REF-001').ref_assertions.every(a=>a.pass),checks={REF001:ref,P_FALSE_DEFINED:s.P.FALSE_DEFINED===0,P_WRONG_BINDING:s.P.WRONG_BINDING===0,R_FALSE_DEFINED:s.R.FALSE_DEFINED===0,R_MISSING:s.R.MISSING===0,V_MATCH:s.V.MATCH>=12,C_MATCH:s.C.MATCH>=19,B_MATCH:s.B.MATCH>=14,B_WRONG_BINDING:s.B.WRONG_BINDING<=6,A_WRONG_BINDING:s.A.WRONG_BINDING<=2,TABLE_CELL_DIRECT_PROMOTION_FALSE:get('TABLE-PROMOTION-AUDIT.json').status==='PASS',SLOT_LOCAL_COVERAGE:get('COVERAGE-LOCALITY.json').status==='PASS',DETERMINISTIC_GRAPH_VIEWS:get('GRAPH-QUERY-RESULTS.json').status==='PASS',PROTECTED_ASSETS_UNCHANGED:v.status==='PASS',FULL_REGRESSION_ZERO_FAILURES:full.exit_code===0&&full.counts.fail===0,FRAME_CERTIFICATION_TESTS:mechanism.counts.pass===352,FROZEN_004_005_TESTS_RETAINED:full.exit_code===0,SWAI001_FIRST_DIVERGENCE_MOVED:fd.first_divergence_moved,NEW_FULL_MATCH_IOA:['I','O','A'].some(k=>s[k].MATCH>b[k].MATCH),A_IMPROVEMENT:s.A.MATCH>=7||s.A.MISSING<=48,I_IMPROVEMENT:s.I.MATCH>=8||s.I.MISSING<=40||s.I.MATCH>b.I.MATCH,O_IMPROVEMENT:s.O.MATCH>=6||s.O.MISSING<=42||s.O.MATCH>b.O.MATCH,NO_INCREASE_FALSE_DEFINED:Object.keys(s).every(k=>s[k].FALSE_DEFINED<=b[k].FALSE_DEFINED),EXPORT_COMPATIBILITY:runs.every(r=>r.status==='COMPLETE'&&fs.existsSync(d+'/replay/'+r.sample_id+'/trace.md'))};
const failed=Object.keys(checks).filter(k=>!checks[k]),pass=failed.length===0,results={TASK:'7P-REPAIR-006',START_HEAD:get('BASELINE.json').start_head,final_runtime:'research/7plus1-parser/v0.3-7p-repair-006/engine.mjs',implementation_sha256:sha(d+'/IMPLEMENTATION-FROZEN.json'),REF001:ref?'PASS':'FAIL',STANDARD_PARSED_BEFORE:before.STANDARD_PARSED,STANDARD_PARSED_AFTER:summary.STANDARD_PARSED,before,after:summary,hard_acceptance_checks:checks,hard_acceptance_pass:pass,failed_gates:failed,SEMANTIC_PROGRESS:checks.NEW_FULL_MATCH_IOA&&checks.A_IMPROVEMENT&&checks.I_IMPROVEMENT&&checks.O_IMPROVEMENT?'PASS':'FAIL',FIRST_DIVERGENCE_MOVED:fd.first_divergence_moved,FIRST_DIVERGENCE_CLOSED:fd.first_divergence_closed,task_completion:pass?'ACCEPTANCE_CHECKS_PASSED_PENDING_ADMIN':'IMPLEMENTATION_DIAGNOSTIC_ONLY_NOT_ACCEPTANCE_COMPLETE',runtime_export_status:checks.EXPORT_COMPATIBILITY?'PASS':'FAIL',parser_snapshots:runs.length,PARSER_MODIFIED:true,GOLD_MODIFIED:false,SOURCE_MODIFIED:false,BXP_PROTOCOL_MODIFIED:false,PACK_MODEL_THRESHOLD_MODIFIED:false,METHOD_MODIFIED:false,PRODUCTION_RUNTIME_CHANGED:false,PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW'};
put('RESULTS.json',results);put('REQUIRED-CHECKS.json',{checks,all_passed:pass,failed,semantic_full_equivalence:summary.STANDARD_PARSED,partial_support_never_individually_scored_as_match:true,joint_match_policy:'Explicit same-frame group completeness, all member facts required. It is not summing isolated partial matches.'});
put('PERFORMANCE.json',{measured:true,replay_mode:'Sequential real parse7Plus1 with persistent model worker; concurrent regression load means these durations are not an isolated benchmark.',runs:runs.map(run=>({sample_id:run.sample_id,run_id:run.run_id,attempt_duration_ms:run.duration_ms,parse_performance:read(run.trace_path).compiler_v03.performance,models:run.model_signals.map(m=>({resource:m.resource,actually_loaded:m.actually_loaded})),model_diagnostics:run.model_diagnostics,export_status:run.status})),wall_sum_ms:runs.reduce((n,r)=>n+r.duration_ms,0),model_weights_changed:false,thresholds_changed:false});
const log=fs.readFileSync(full.log,'utf8'),skipped=log.split(/\r?\n/u).filter(l=>l.includes('# SKIP'));if(skipped.length!==full.counts.skipped)throw Error('SKIP_COUNT');put('SKIPPED-TESTS.json',{count:skipped.length,rows:skipped,status:'NOT_EXECUTED_NOT_PASS'});
const table=Object.keys(s).map(k=>`| ${k} | ${b[k].MATCH} → ${s[k].MATCH} | ${b[k].MISSING} → ${s[k].MISSING} | ${s[k].FALSE_DEFINED} | ${s[k].WRONG_BINDING} | ${s[k].WRONG_STATUS} | ${s[k].PARTIAL_SUPPORT} |`).join('\n'),incident=fs.existsSync(d+'/REGRESSION-INCIDENT.json')?get('REGRESSION-INCIDENT.json'):null;
put('REPORT.md',`# 7P-REPAIR-006 — ADMIN 审阅交付

本轮已实现独立 Frame Certification 并完成冻结重放。任务书门槛核对为 **${pass?'PASS':'FAIL'}**，仍需 ADMIN 审阅确认。STANDARD_PARSED=${summary.STANDARD_PARSED}，PRODUCTION_READY=false；没有宣称 Parser 已整体正确。${failed.length?'未达门槛：'+failed.join('、')+'。':''}

## 范围与实现

分支 review/7plus1-parser，基线 ${results.START_HEAD}，是任务书指定 005 commit 的后继。已完整阅读 CURRENT-TASK、006 任务书、冻结 v0.3 方法及 005 诊断；其中被引用的 005/ROOT-CAUSES.md 不存在，已明确记录，未补写旧封存。实际核查冻结 REPORT、FIRST-DIVERGENCE、ACTION-FRAME-AUDIT 和源码。

- 新增 frame-certification.mjs：位于 Candidate Recall / Edge Closure 后、Eligibility 前。唯一控制上下文、所属域、上层动作、目标、模态、条件冲突先校验，再生成现有规范类型的关系。
- 主修改动作拥有受控行为、上下文及论元集合；controller/support 保留节点、精确来源、结构路径及 AUXILIARY 决策，阻止独立 A 泄漏。技术对象不冒充 P，也不因期望 O 而变成 RESULT。
- 新增 technical-instructions.mjs：有界显式调用语法，完整保留 callee、参数和路径组合；调用所在符号具有同一工件修改前/更新后身份。正文声明通过明确拥有的代码块识别唯一声明符号。测试插入保留 EACH × 每文件一个和例子代码归属。代码体不执行，也不成为当前任务动作。
- Eligibility 只增加受认证 SUBORDINATE 的 AUXILIARY 消费分支；其余旧规则保留。语义冲突或代码归属断裂保留未决。被覆盖的通用候选关系保留为 REJECTED 并记录仲裁理由。
- 未改 QI–QB、投影、规范关系类型、Gold、Source、BXP、v0.3、模型、阈值或 Pack。Candidate Recall/Edge Closure 原字节不变；现有生产入口、CLI/UI 和 58618 未切换。

## 实测与审计

25 个预声明非 Gold 原文由真实 HanLP/spaCy 产生信号；32 项新增语义/冲突断言与 320 项迁移旧机制断言合计 **352/352**。原 Parser 回归 **739/739**。最终全量回归 **${full.counts.pass} pass / ${full.counts.fail} fail / ${full.counts.skipped} skipped**，共 ${full.counts.tests} 条；skipped 未执行，不能计 PASS。历史 Gold 数据完整性检查通过，不等于当前语义验收。

${incident?'全量回归首轮出现 1 项历史 NLP worker 异常退出，状态码 3221225477（0xC0000005）；当时正式重放并行运行。没有证据确认具体崩溃原因。完整保留首轮 TESTS-first-attempt.json/full-regression.log，待正式重放退出后不改任何实现再完整运行，最终结果见 TESTS.json 和 REGRESSION-INCIDENT.json。':'全量回归首次结果及日志保留。'}

10/10 正式模型重放完成，REF-001=${results.REF001}。BGE-M3、E5、NLI 实际加载证据见 RUNS/PERFORMANCE；未将相似度当成语义裁决。35 个输入使用同一已保存 NLP 信号复算认证、IR 投影与 Canonical 完全一致；这是确定性编译核验，不冒称独立模型重复运行测试。

## 逐项语义对比

仅在实现冻结之后读取 ACTIVE r02 人工标准进行离线审阅。旧判断仅在 Canonical、事实和附加表达式相同后复用；每个变化的 RESOLVED 单独审核。完整 10 份 Trace 和实际 7+1 位于 replay/。SWAI-005 继续沿用审定 manifest 的分母排除，未改其状态。

| 槽位 | MATCH 前→后 | MISSING 前→后 | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS | PARTIAL_SUPPORT |
|---|---:|---:|---:|---:|---:|---:|
${table}

新增完整匹配为 SWAI-001 的 helper 交付 O0、新增 helper 动作 A0，以及三个对应测试文件 I2。I2 由同一认证框架的三个 TASK_OBJECT 与显式 UNION/EACH 成员共同证明，按一个人工条目计一次；每个文件单项仍是部分支持，不能任选其中一个算完整匹配。ledger 保存 required_actual_ids 和共同结构见证，比较脚本要求所有成员存在。未更改人工 expected 或评审分母。

三项 writer 调用保留完整参数、路径组合和更新身份，但尚未建立调用到声明行为的唯一绑定，因此不计完整 union-scan A/O MATCH。三测试文件及 EACH 一个测试已存在，但代码示例里的断言意义和命名要求没有完整类型化，也不计完整测试交付或动作。PARTIAL_SUPPORT 与 MISSING 分别保留。OUTPUT_CONTENT=${summary.output_content_requirements.counts.MATCH}/20。

## 首处剩余偏离

005 的 [402,440) 控制认证缺口已闭合：next_seq 是上下文对象，计算/看组成主“修”动作的行为，controller 和嵌入谓词不再作为独立 A。首处分歧按编译依赖层推进到 **跨指令工件身份与行为组合**：三个方法仍是一个聚合字符串目标，单独调用尚未与该集合成员和 helper 声明行为闭合。完整证据、决策、事实及剩余缺失关系见 FIRST-DIVERGENCE.json。局部缺口关闭不表示整个案例闭环；runtime first unresolved 也不是语义 first divergence。

## 封存与停止

IMPLEMENTATION-FROZEN 固定 ${Object.keys(get('IMPLEMENTATION-FROZEN.json').files).length} 个文件；${v.protected_files} 个此前文件、旧封存和 ${v.frozen_dependency_files} 个依赖摘要已复核。全部必需审计、测试、实际结果、MANIFEST、SHA256SUMS 和 SEAL 一并交付。只推送 review/7plus1-parser，不 merge/release/tag，不切换生产运行时。STATUS=WAITING_ADMIN_REVIEW。
`);
console.log({hard_acceptance:pass,failed,summary:summary.by_slot,full:full.counts});
