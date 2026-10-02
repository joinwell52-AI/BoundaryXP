import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/reports/7plus1/7P-REPAIR-004',old='docs/reports/7plus1/7P-REPAIR-003',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),put=(n,x)=>fs.writeFileSync(dir+'/'+n,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const runs=read(dir+'/PARSER-RUNS.json'),tests=read(dir+'/TESTS.json'),summary=read(dir+'/SLOT-SUMMARY.json'),before=read(old+'/SLOT-SUMMARY.json'),s=summary.by_slot,verify=read(dir+'/VERIFY.json'),edges=read(dir+'/EDGE-RESOLUTION-AUDIT.json'),comparison=read(dir+'/COMPARISON.json');
const full=tests.tests.find(t=>t.name==='full-regression'),mechanism=tests.tests.find(t=>t.name==='mechanism-final'),regression=tests.tests.find(t=>t.name==='original-parser-regression');
for(const run of runs){const current=read(run.trace_path).compiler_v03.canonical_7plus1,prior=read(old+'/r03/replay/'+run.sample_id+'/trace.json').compiler_v03.canonical_7plus1;for(const slot of 'IOAPRVCB')assert.deepEqual(current[slot].entries,prior[slot].entries,'Canonical entries added/removed/changed: '+run.sample_id+':'+slot);}
const sw3=comparison.cases.find(c=>c.sample_id==='SWAI-003').slots.V.actual_reviews.filter(r=>r.decision==='MATCH'&&JSON.stringify(r).includes('ADR-0003'));
const checks={REF001:runs[0].ref_assertions.every(a=>a.pass),P_FALSE_DEFINED:s.P.FALSE_DEFINED===0,P_WRONG_BINDING:s.P.WRONG_BINDING===0,R_FALSE_DEFINED:s.R.FALSE_DEFINED===0,R_MISSING:s.R.MISSING===0,V_MATCH:s.V.MATCH>=12,C_MATCH:s.C.MATCH>=19,SWAI003_ADR0003:sw3.length>0,TABLE_CELL_DIRECT_PROMOTION_FALSE:read(dir+'/TABLE-PROMOTION-AUDIT.json').status==='PASS',SLOT_LOCAL_COVERAGE:read(dir+'/COVERAGE-LOCALITY.json').status==='PASS',DETERMINISTIC_GRAPH_VIEWS:read(dir+'/GRAPH-QUERY-RESULTS.json').status==='PASS',PROTECTED_ASSETS_UNCHANGED:verify.status==='PASS',FULL_REGRESSION_ZERO_FAILURES:full.exit_code===0&&full.counts.fail===0,ISOLATED_EDGE_CLOSURE:fs.existsSync('research/7plus1-parser/v0.3-7p-repair-004/edge-closure.mjs'),FOUR_OPERATOR_POSITIVE_NEGATIVE_TESTS:mechanism.status==='PASS',A_WRONG_BINDING:s.A.WRONG_BINDING<=2,A_IMPROVEMENT:s.A.MATCH>=7||s.A.MISSING<=48,I_IMPROVEMENT:s.I.MATCH>=8||s.I.MISSING<=40,O_IMPROVEMENT:s.O.MATCH>=6||s.O.MISSING<=42,B_MATCH:s.B.MATCH>=14,B_WRONG_BINDING:s.B.WRONG_BINDING<=6,OUTPUT_CONTENT_MATCH:summary.output_content_requirements.counts.MATCH>=3,NO_NEW_FALSE_DEFINED_PRVCB:[...'PRVCB'].every(k=>s[k].FALSE_DEFINED<=before.by_slot[k].FALSE_DEFINED)};
const all=Object.values(checks).every(Boolean),failed=Object.keys(checks).filter(k=>!checks[k]);
put('REQUIRED-CHECKS.json',{checks,all_passed:all,failed,semantic_full_equivalence:summary.STANDARD_PARSED,mechanism_coverage_limitations:read(dir+'/NON-GOLD-MECHANISM-RESULTS.json').rows.filter(r=>r.limitation).map(r=>({id:r.id,limitation:r.limitation})),test_pass_is_not_semantic_acceptance:true,operator_test_matrix:{CONTINUATION:{positive:['CONTINUATION','LIST','PARAPHRASE_1','PARAPHRASE_2'],negative:['NEIGHBOR','LIST_NEG','AMBIG_CONT']},FANOUT:{positive:['SHARED','EN_SHARED','TRIPLE'],negative:['PARTITION','EN_PARTITION']},RESULT_REUSE:{positive:['REUSE','READ_RESULTS'],negative:['AMBIGUOUS','AMBIGUOUS_CHECK','SECTION_CHECK']},BASIS_SHIELD:{positive:['BASIS_FILE','injected weak patient/scope candidate test'],negative:['BASIS_NEG']}}});
const first=read(old+'/FIRST-DIVERGENCE.json'),trace=read(dir+'/replay/SWAI-001/trace.json'),c=trace.compiler_v03,clause=c.nlp_signals.clauses?.find(x=>x.span?.start===402),span=trace.source_spans.find(x=>x.start===402&&x.end===440);assert(span);
const nodeIds=new Set(c.semantic_nodes.filter(n=>n.source_span_ids.includes(span.span_id)).map(n=>n.node_id));
put('FIRST-DIVERGENCE.json',{...first,status:'NOT_CLOSED',finding:'原首处分歧仍存在。闭合前候选图缺少嵌套谓词端点、受控动作及完整对象集合；新增补边没有闭合跨子句计算、双路径与各 writer 的作用关系。不得把未决或概括修复动作算成 A/O MATCH。',current_trace:'replay/SWAI-001/trace.json',source_sha256:c.source.sha256,source_span:span,candidate_nodes:c.semantic_nodes.filter(n=>nodeIds.has(n.node_id)),relevant_relations:c.relations.filter(r=>nodeIds.has(r.head_node_id)||nodeIds.has(r.tail_node_id)),edge_closure:c.nlp_signals.semantic_decoding.edge_closure,runtime_first_unresolved:trace.first_divergence,...(clause?{linguistic_clause:clause}:{}),generalization_evidence:['non-gold-results/PATTERN_A.json','non-gold-results/PATTERN_B.json'],no_source_specific_runtime_patch:true});
const perf=runs.map(run=>{const c=read(run.trace_path).compiler_v03;return {sample_id:run.sample_id,run_id:run.run_id,attempt_duration_ms:run.duration_ms,parse_performance:c.performance,models:run.model_signals.map(m=>({resource:m.resource,actually_loaded:m.actually_loaded})),export_status:run.original_export_status};});
put('PERFORMANCE.json',{measured:true,replay_mode:'Sequential actual parse7Plus1, persistent NLP/model worker; no Gold answers sent to Parser.',runs:perf,total_attempt_ms:runs.reduce((a,r)=>a+r.duration_ms,0),median_attempt_ms:[...runs.map(r=>r.duration_ms)].sort((a,b)=>a-b).slice(4,6).reduce((a,b)=>a+b,0)/2,isolated_edge_latency_ms:null,isolated_edge_latency_note:'Not instrumented; no invented stage timing.',export_note:'Original runtime Markdown export failed after each parser snapshot was saved. Report rendering performed offline; no parser rerun.'});
const results={TASK:'7P-REPAIR-004',START_HEAD:read(dir+'/BASELINE.json').start_head,SEMANTIC_BASE:read(dir+'/BASELINE.json').semantic_base,implementation_sha256:sha(dir+'/IMPLEMENTATION-FROZEN.json'),final_runtime:'research/7plus1-parser/v0.3-7p-repair-004/engine.mjs',REF001:checks.REF001?'PASS':'FAIL',STANDARD_PARSED_BEFORE:before.STANDARD_PARSED,STANDARD_PARSED_AFTER:summary.STANDARD_PARSED,before,after:summary,hard_acceptance_checks:checks,hard_acceptance_pass:all,failed_gates:failed,SEMANTIC_PROGRESS:'FAIL',FIRST_DIVERGENCE_CLOSED:false,task_completion:'IMPLEMENTATION_DIAGNOSTIC_ONLY_NOT_ACCEPTANCE_COMPLETE',runtime_export_status:'FAIL_REVISION_GUARD',parser_snapshots:10,original_export_failures:10,PARSER_MODIFIED:true,GOLD_MODIFIED:false,SOURCE_MODIFIED:false,BXP_PROTOCOL_MODIFIED:false,PACK_MODEL_THRESHOLD_MODIFIED:false,METHOD_MODIFIED:false,PRODUCTION_RUNTIME_CHANGED:false,PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW'};put('RESULTS.json',results);
const graphRows=edges.records.filter(r=>r.input_class==='FROZEN_STANDARD').map(r=>({sample_id:r.sample_id,new_or_rejected_edges:r.edges.length,typed_unresolved_decisions:r.decisions.length,edges:r.edges.map(e=>({operator:e.operator,state:e.resolution_state,relation_id:e.relation_id}))}));put('STANDARD-EDGE-DELTA.json',{records:graphRows,canonical_entries_and_facts_unchanged:true,evidence:'UNCHANGED-ENTRY-EVIDENCE.json'});
put('ROOT-CAUSES.md',`# 7P-REPAIR-004 根因与实施界限

本轮实现没有达到任务书的 I/O/A 实际进展硬门槛，不能验收为修复完成。35 个 non-Gold 输入与 37 条新增测试覆盖补边机制，但其中 7 个输入明确保留上游覆盖缺口，不能计为端到端语义通过。

- 挂载点：engine.mjs:18–20，在 candidateGraph 后、Eligibility 前执行 closeEdges；QI–QB 与 projection 原字节不变。
- shared complement / local ownership：edge-closure.mjs:55 的 nominalOperands 只接纳有类型或受保护的明确局部操作数。它不能恢复缺失的嵌套谓词，也不能凭含义把任意名词拼成作用域。
- 首处分歧：edge-closure.mjs:82–86 发现 ccomp/xcomp 端点缺失时保留 UNRESOLVED。SWAI-001 原片段的候选只有使等不完整端点；新增模块没有得到可安全闭合的完整动作/对象/控制图，实际 A/O 未改善。详见 FIRST-DIVERGENCE.json。
- 共享产物复用使用 coreference.mjs:5 的 edgeReferenceDomain；过滤 domain、owner、类型、来源顺序、基数和条件，不按最近产物猜测。多候选仍未决。
- 依据前置仅在真实 dependency-root 动词存在时恢复候选；BASIS non-Gold 中动词被标为名词，仍缺动作。没有增加同义词补猜策略。
- CONTENT non-Gold 暴露旧 discourse 分类未识别正文体裁，不能把它宣称为内部图隔离成功；保留原失败输入。CONTENT_EXPLICIT 验证已有明确体裁中的内部图隔离。
- 全部标准文本只新增/拒绝 ${graphRows.reduce((n,r)=>n+r.new_or_rejected_edges,0)} 条边审计记录，并增加 ${graphRows.reduce((n,r)=>n+r.typed_unresolved_decisions,0)} 条补边阶段未决诊断；其最终 Canonical/Fact/表达式与 003-r03 完全一致。没有把结构诊断当语义提升。
- export.mjs:5 仍识别旧 revision，导致 004 输出落入 legacy export 并读取不存在的 legacy_output.full_trace。正式 Parser JSON 已先落盘；原 ERROR/RUNS 保留，审阅 Markdown 用 report-only renderer 直接生成。冻结运行时导出缺陷没有被伪装为 PASS。

没有进一步改方法、Gold、模型、投影或生产入口。完整任务验收仍待上述失败项解决；当前只封存诊断候选，等待 ADMIN Review。
`);
const table=[...'IOAPRVCB'].map(k=>`| ${k} | ${s[k].MATCH} | ${s[k].MISSING} | ${s[k].FALSE_DEFINED} | ${s[k].WRONG_BINDING} | ${s[k].WRONG_STATUS} |`).join('\n');
put('REPORT.md',`# 7P-REPAIR-004 — 实施诊断交付

**未达到任务书验收门槛。** 四类 Edge Closure 已实现并冻结，测试和原资产完整性检查通过，但真实 10 份重放的最终语义没有改善：A/I/O 进展门槛均 FAIL。首处分歧 NOT_CLOSED，STANDARD_PARSED=0/9，PRODUCTION_READY=false。本交付不得称为 004 验收完成。

开始前完整阅读 CURRENT-TASK、004 任务书、v0.3 方法文档、003 报告/首处分歧/根因及最终源码。实际起点 ${results.START_HEAD} 是任务指定起点的后继，前一语义基线为 ${results.SEMANTIC_BASE}。

## 实现和范围

新增独立 edge-closure.mjs；通过已有 coreference 模块筛选唯一产物，隔离依据，保留分区对象与显式续接。新增边和拒绝边均保存身份、精确 span、结构路径、候选和原因。没有新规范关系类型，没有改 QI–QB。现有 58618 与生产入口未切换；旧封存、Source、Gold、BXP、v0.3 方法、模型、Pack、阈值原字节不变。工作区其他既有改动不纳入提交。

## 实测测试

- 新机制及沿用兼容断言：${mechanism.counts.pass} pass / ${mechanism.counts.fail} fail。
- 原有 Parser 回归：${regression.counts.pass} pass / ${regression.counts.fail} fail。
- 全量 node 回归：${full.counts.tests} tests，${full.counts.pass} pass，${full.counts.fail} fail，${full.counts.skipped} skipped。跳过项不计 PASS。
- Gold 数据完整性验证：${tests.tests.find(t=>t.name==='gold-data-validation').status}；这不是语义验收。
- 35 个 non-Gold 输入保存实际 NLP 信号、完整 Trace 和重复确定性检查；7 个已知上游覆盖缺口原样报告。机制断言通过不等于这 35 条全部语义通过。
- ${verify.protected_files} 个既有文件和 ${verify.frozen_dependency_files} 个依赖/模型指纹复核；详见 VERIFY.json。

## 真实重放和导出错误

REF-001 加 9 个正式 SWAI，共 10 份；SWAI-005 按 ACTIVE 审定排除。实际调用新 engine 的 parse7Plus1，BGE/E5/NLI 均实际加载，完整输入输出在各 trace.json。REF-001 全部语义断言 PASS，“上述材料”真实歧义保留。

首次批处理 RUNS.json 为 10 条 FAILED，错误发生在 Parser 返回并保存 trace.json 后的 Markdown 导出。不能将它改写为首次成功。PARSER-RUNS.json 单独记录已成功解析的原始快照及导出失败；replay/*/ERROR.json 保留错误。报告辅助脚本直接从这些原始 Trace 导出 Canonical 和 Markdown，未重跑或改写解析结果。冻结 runtime/export.mjs 的 revision guard 缺陷仍 FAIL，见 EXPORT-INCIDENT.json。

## 逐项语义结果

| Slot | MATCH | MISSING | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS |
| --- | ---: | ---: | ---: | ---: | ---: |
${table}

OUTPUT_CONTENT：MATCH=3、MISSING=17。PARTIAL_SUPPORT 不计 MATCH。相对 003-r03 上表所有计数不变。所有现有 Canonical 条目、Fact、Scope/Condition/Quantity 表达式逐项深比较完全一致，才复用原人工审阅映射；证据在 UNCHANGED-ENTRY-EVIDENCE.json 和 COMPARISON.json。没有用测试数量推导准确率。

失败硬门槛：${failed.join('、')}。要求 A≥7 或 missing≤48，实际 6/50；I≥8 或 missing≤40，实际 7/42；O≥6 或 missing≤42，实际 5/44。其余既有无回退门槛见 REQUIRED-CHECKS.json。

## 首处分歧与产物

SWAI-001 [402,440) 原片段仍缺完整嵌套动作、双路径对象及 writer 上下文关系。局部新诊断不等于闭合；FIRST-DIVERGENCE.json 保留 exact spans、实际节点/边、当前未决和独立 non-Gold 构式证据。

完整审计：EDGE-RESOLUTION-AUDIT、CONTINUATION、FANOUT、COREFERENCE、BASIS-SHIELD、TABLE-PROMOTION、GRAPH-QUERY-RESULTS、COVERAGE-LOCALITY、NON-GOLD-MECHANISM-RESULTS、PERFORMANCE。TESTS.json 对应本次实际日志，IMPLEMENTATION-FROZEN.json 对应最终冻结文件，MANIFEST/SHA256SUMS/SEAL 为交付完整性封存，**不是验收通过证明**。

STATUS=WAITING_ADMIN_REVIEW。仅推送 review/7plus1-parser；不 merge、release、tag，不替换生产运行时。
`);
console.log(JSON.stringify({hard_acceptance_pass:all,failed,full:full.counts,standard:summary.STANDARD_PARSED}));
