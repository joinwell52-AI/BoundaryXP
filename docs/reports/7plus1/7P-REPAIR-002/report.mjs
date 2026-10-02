import fs from'node:fs';import{createHash}from'node:crypto';
const dir='docs/reports/7plus1/7P-REPAIR-002',read=p=>JSON.parse(fs.readFileSync(p)),put=(n,x)=>fs.writeFileSync(dir+'/'+n,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'}),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const summary=read(dir+'/SLOT-SUMMARY.json'),comparison=read(dir+'/COMPARISON.json'),runs=read(dir+'/RUNS.json'),before=read('docs/reports/7plus1/7P-REPAIR-001/SLOT-SUMMARY.json'),tests=read(dir+'/TESTS.json');
const results={TASK:'7P-REPAIR-002',BASE:'13bd28fb25b02ee9358f20f2e1f2baa58df802f4',REF001:runs.find(r=>r.sample_id==='REF-001').ref_assertions.every(x=>x.pass)?'PASS':'FAIL',STANDARD_PARSED_BEFORE:'0/9',STANDARD_PARSED_AFTER:summary.STANDARD_PARSED,metrics:summary,SWAI003_ADR0003:comparison.cases.find(x=>x.sample_id==='SWAI-003').slots.V.expected_reviews.find(x=>x.entry_id==='SWAI-003:V3').finding,TABLE_CELL_DIRECT_PROMOTION:false,PARSER_MODIFIED:true,GOLD_MODIFIED:false,SOURCE_MODIFIED:false,BXP_PROTOCOL_MODIFIED:false,PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW',final_engine:'research/7plus1-parser/v0.3-7p-repair-002-r03/engine.mjs',implementation_sha256:hash(dir+'/IMPLEMENTATION-FROZEN.json')};put('RESULTS.json',results);
put('PERFORMANCE.json',{runs:runs.map(r=>({sample_id:r.sample_id,duration_ms:r.duration_ms,run_id:r.run_id,models:r.model_signals})),total_ms:runs.reduce((n,r)=>n+r.duration_ms,0),includes_real_model_loading:true,reused_gold_as_model_input:false,warning:'Only these actual timings; overlapping local regression loads make this unsuitable for latency promises.'});
const raw=runs.map(run=>{const r=read(run.trace_path),c=r.compiler_v03,u=c.unresolved.find(x=>x.unresolved_id===r.first_divergence?.unresolved_id);return {sample_id:run.sample_id,runtime_first_unresolved:r.first_divergence,source_clauses:c.nlp_signals.clauses.filter(x=>u?.related_clause_ids.includes(x.id)).map(x=>({clause_id:x.id,span:x.span})),unresolved_count:c.unresolved.length,note:'Runtime first unresolved is not automatically a confirmed semantic divergence; background candidates and real ambiguities are kept separately.'};});
const source=fs.readFileSync('fixtures/7plus1/standard/SWAI-001/source.md','utf8'),offset=source.indexOf('修 `src/fcop/project.py`'),start=[...source.slice(0,offset)].length;
put('FIRST-DIVERGENCE.json',{confirmed:{sample_id:'SWAI-001',stage:'ARTIFACT_ROLE_AND_ARGUMENT_RECOVERY',source_span:{start,end:start+[...'修 `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法'].length},expected_refs:['SWAI-001:I0','SWAI-001:O1'],finding:'MISSING',reason:'Module + three method targets and union-scan update are still not recovered as a complete current input/update relation. Reference-file recovery and C recovery do not fill this gap.'},runtime_diagnostics:raw});
put('GENERALIZATION-EVIDENCE.json',{non_gold_cases:69,continuation_mutations:5,reference_type_mutations:5,final_mechanism_tests:191,original_parser_tests:739,tests:'TESTS.json',categories:['artifact read/create/modify with five names each','frontmatter and body basis with five references each','two/three-column and unknown-header tables','acceptance list/table and AND/OR completion','explicit bilingual/single/ambiguous output ownership','five indented continuation mutations','five commit-versus-version attachment negative mutations'],gold_specific_runtime_rules:false,participant_blacklist_expansion:false,projection_sha256:hash('research/7plus1-parser/v0.3-7p-repair-002-r03/projection.mjs')});
const table=['| 槽 | MATCH before→after | MISSING before→after | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS |','|---|---:|---:|---:|---:|---:|',...'IOAPRVCB'.split('').map(k=>{const b=before.by_slot[k],a=summary.by_slot[k];return `| ${k} | ${b.MATCH} → ${a.MATCH} | ${b.MISSING} → ${a.MISSING} | ${b.FALSE_DEFINED} → ${a.FALSE_DEFINED} | ${b.WRONG_BINDING} → ${a.WRONG_BINDING} | ${b.WRONG_STATUS} → ${a.WRONG_STATUS} |`;})].join('\n');
put('REPORT.md',`# 7P-REPAIR-002 — WAITING_ADMIN_REVIEW

最终实现：\`research/7plus1-parser/v0.3-7p-repair-002-r03/\`。REF-001=${results.REF001}；STANDARD_PARSED=${summary.STANDARD_PARSED}，分母仅 9，SWAI-005 仍排除。程序运行、合同检查和语义匹配分开统计。

${table}

OUTPUT_CONTENT：MATCH 0 → ${summary.output_content_requirements.counts.MATCH}；MISSING 20 → ${summary.output_content_requirements.counts.MISSING}。只给已形成 REQUIRED 内容章节且有两个具体输出归属的条目计 MATCH，不用整段文本收录代替内部条件解析。

## ROOT_CAUSE / MECHANISM_CHANGE

- TABLE_SEMANTICS：001 的 TABLE 隔离门阻止了明确行语义。新层读取表头、行主体、单元格及精确路径，只给具备完整结构证明的 BASIS 关系限定例外；TABLE 全域仍不开放。SWAI-003 ADR-0003=${results.SWAI003_ADR0003}。不认识的表头保留 STRUCTURED_TABLE_UNRESOLVED。
- IO_ROLE_RESOLUTION：在局部谓词和完整文件对象之间建立 READ_ONLY_INPUT / MODIFICATION_TARGET / UPDATED_OUTPUT / GENERATED_OUTPUT 等角色；修改对象的 before/after 共用身份，补建 ITEM scope。I 只增加了一个完整 Gold MATCH，O 新增的两个测试交付仍是集合子集，未计整项 MATCH。该改善有限，不能宣称 I/O 覆盖关闭。
- REFERENCE_BASIS：frontmatter 结构字段、正文明确标记与表格行关系保存 BASED_ON / PREDECESSOR / REFERENCES / RELATED_REFERENCE / SUPERSEDES 等区别。commit provenance 要求紧邻的哈希类型参数，不能吞入括号版本号。未读外部 ADR/TASK。
- COMPLETION_LOGIC：验收列表/表格子项组成 ALL_OF/AND；显式 only-if 及 OR 保留局部操作数。列表 criterion 覆盖其真实结构子树，含缩进续行；声明条数与真实子项不符即未决，不拿验收数量填 R。
- OUTPUT_CONTENT_OWNERSHIP：独立内容要求绑定当前 authored output；同一作者头的明确双语 sibling 为 OUTPUT_SET，多候选保持未决。章节内容有独立 DISCOURSE 节点、子要求和 scope，未来 A/P/B 不升格当前槽。

源码集中在最终 revision 的 structured-recovery.mjs；eligibility.mjs 只增加受结构证明约束的依据准入与同对象多角色去重；engine.mjs 接线。projection/schema/model/Pack 未改，participant 技术词 blacklist 未扩充。全部变化通过语义节点和关系进入 IR。

## GENERALIZATION_EVIDENCE

最终专项 ${tests.tests.find(x=>x.name==='mechanism-final').counts.pass} pass / 0 fail；原 Parser ${tests.tests.find(x=>x.name==='original-parser-regression').counts.pass} pass / 0 fail。全量结果见 TESTS.json，skip 单列，未把 skip 算 PASS。69 条初始非 Gold 文本、5 条续行、5 条错误 commit 附着变体均有真实 NLP 信号，旧 41 条语义和 001 机制、history/export/共享入口回归保留。

## KNOWN_REMAINING_FAILURES

FIRST_DIVERGENCE：SWAI-001 的模块—方法集合仍未完整成为输入和更新交付。I/O 组合对象、条件交付、完整 reference 定位、带时间效力的 supersedes，以及大部分输出内部复合行为仍有缺口。SWAI-008 的 spec 输入恢复，但对比的另一对象仍被截断为 lifecycle，单独记 A WRONG_BINDING，不因 I 改善掩盖。

保持 P/R 防污染与 >=7 天阈值；REF-001 “上述材料”的真实歧义继续保留。源码支持但人工 Gold 未列的附加 reference 标为 UNLISTED_SOURCE_SUPPORTED；部分完成标 PARTIAL_SUPPORT，不贡献 MATCH。逐条实际 IR、人工条目与证据见 COMPARISON.json；缺口见 FAILURES.json。

## 候选记录及冻结

最初候选 runtime v0.3-7p-repair-002、首次 replay/ 及 FIRST-CANDIDATE-* 原字节保留；续行候选 runtime -r02、final-run/ 也保留。最终为 -r03 与 final-candidate/。中间候选不作为最终验收实现；其缺陷分别为列表续行遗漏及 commit 参数类型/附着过宽。最终冻结后仅进行测试与离线审阅，没有修改运行代码追分。

旧 58618 没有自动切换。停止旧端口服务后，新启动命令：

\`\`\`sh
cd D:\\boundx
node research/7plus1-parser/v0.3-7p-repair-002-r03/server.mjs
\`\`\`

CLI/server/UI 共用本 revision parse7Plus1；未做 UI 重构。旧复制 README 中的初始候选命令不代表最终交付入口，以上命令为本报告最终入口。

Parser 修改=true；Gold/Source/BXP/Pack/模型/阈值修改=false；PRODUCTION_READY=false。仅推送 review/7plus1-parser，不合并 main、不发版、不打 tag。完成封存后停止等待 ADMIN Review。
`);
console.log(JSON.stringify(results));
