import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const out='docs/reports/7plus1/ADMIN-SHORT-050-r02/',root='fixtures/7plus1/admin-short-050-r02/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),write=(p,v)=>{if(fs.existsSync(out+'SEAL.json'))throw Error('Sealed');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');};
// Post-run reviewer findings. Never imported by the parser. One independently
// sufficient counterexample per case; this is not an exhaustive error count.
const findings=[
 ['QUANTITY_BINDING','R','40 分钟','明确的任务时限未进入 R，实际 R=ABSENT。'],
 ['BASIS_IDENTITY','V','FCoP 的 v2.1','依据只保留 v2.1，未形成 FCoP 与版本的完整身份。',true],
 ['INPUT_SCOPE','I','读取 mcp-config.json','未保留配置文件输入，却将“本次审计”作为 RESOLVED 输入。',true],
 ['OUTPUT_OMISSION','O','skills-audit.md','明确要求生成的文件没有 O 条目。'],
 ['INPUT_SCOPE','I','轨道机当前运行状态','检查对象及日志输入没有进入 I，实际 I=ABSENT。'],
 ['INPUT_SCOPE','I','backup-index.csv','明确读取的文件输入遗漏，I=ABSENT。'],
 ['BOUNDARY_PROHIBITION','B','不得修改授权','禁止动作已捕获，但明确对象“授权”未绑定，条目保持 UNRESOLVED。'],
 ['INPUT_SCOPE','I','certificates.csv','明确读取的证书清单遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','app.log 和 error.log','两个明确读取文件均未进入 I。'],
 ['BASIS_IDENTITY','V','读取 release.yaml 和 build.log','读取文件 release.yaml 被错误确认为 V；规范身份也只保留版本。',true],
 ['DISCOURSE_POLARITY','A','列出新增接口及删除接口','“删除接口”是报告内容/被列出的变更类别，却生成了 REQUIRED 删除接口动作。',true],
 ['INPUT_SCOPE','I','api-old.json 和 api-new.json','两个明确读取的接口定义均未进入 I。'],
 ['BASIS_IDENTITY','V','LICENSE-POLICY-4','V 被截断为 POLICY-4，改变了依据身份。',true],
 ['INPUT_SCOPE','I','unit-results.json','遗漏被检查的测试结果文件；I 仅出现“失败原因”。'],
 ['INPUT_SCOPE','I','staging.yaml 和 template.yaml','两份明确读取配置没有 I。'],
 ['BASIS_IDENTITY','V','DB-SPEC-9','V 同时生成 DB-SPEC-9 与截断的 SPEC-9，后者不是独立依据。',true],
 ['INPUT_SCOPE','I','checksums.txt','明确读取校验清单未进入 I。'],
 ['INPUT_SCOPE','I','install.md','明确读取的文档没有 I 条目。'],
 ['INPUT_SCOPE','I','coverage.json','明确读取的覆盖率文件没有 I 条目。'],
 ['INPUT_SCOPE','I','scan.json','明确读取的扫描结果遗漏，I=ABSENT。'],
 ['QUANTITY_BINDING','R','45 分钟','明确核查时限遗漏，R=ABSENT。'],
 ['INPUT_SCOPE','I','masked-sample.csv','明确读取的脱敏样本遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','PM 负责分配核对人员','参与人员被纳入 RESOLVED I，assets.csv 和 inventory.csv 均遗漏。',true],
 ['INPUT_SCOPE','I','revenue.csv 和 monthly-report.xlsx','两份明确读取文件没有 I 条目。'],
 ['INPUT_SCOPE','I','migration-plan.md','明确读取的计划文件遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','model-config.json','明确读取的模型配置没有 I 条目。'],
 ['INPUT_SCOPE','I','inference-trace.json','明确读取的推理证据文件遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','evaluation.json','明确读取评测结果遗漏，I=ABSENT。'],
 ['OUTPUT_OMISSION','O','编写 prompt-guide.md','明确文档交付没有 O 条目。'],
 ['INPUT_SCOPE','I','QA 负责复核','I 错收动作名“复核”，未收 training-index.csv。',true],
 ['PREDICATE_ARGUMENT','O','inference-health.md 并提交','交付物对象错误包含连接词“并”，却被 RESOLVED。',true],
 ['BASIS_IDENTITY','V','SEARCH-SPEC-5 的 v1.2','依据拆为 SPEC-5 与 v1.2；规范完整身份与版本绑定丢失。',true],
 ['INPUT_SCOPE','I','index-manifest.json','明确读取的索引清单遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','model-licenses.csv','明确读取的许可证清单遗漏，I=ABSENT。'],
 ['BOUNDARY_PROHIBITION','B','不得修改 Parser、模型或阈值','禁止修改仅保留阈值，未保留 Parser 和模型两个明确对象。'],
 ['OUTPUT_OMISSION','O','双方分别提交检查报告','两份报告交付未进入 O，实际 O=ABSENT。'],
 ['INPUT_SCOPE','I','dev-report.md 和 ops-report.md','两份明确读取报告遗漏，I=ABSENT。'],
 ['PARTICIPANT_ROLE','P','负责人丁岚批准检查申请后','审批者丁岚被解析为 PERFORMER；审批条件与 QA 执行责任没有保持。',true],
 ['DISCOURSE_POLARITY','A','不负责审批','明确否定的审批职责反而产生 REQUIRED 审批，且接收者被增添 PERFORMER。',true],
 ['INPUT_SCOPE','I','service.log','明确被检查的日志遗漏，I=ABSENT。'],
 ['INPUT_SCOPE','I','检查 changes.csv','明确检查文件遗漏，I=ABSENT。'],
 ['PARTICIPANT_ROLE','I','向 ADMIN 提交','接收者 ADMIN 被错误确认为 I。',true],
 ['CONDITION_COMPLETION','C','文件已生成且两个章节均存在','C 的 AND 指向两个 SOURCE_STATE 字面片段，无具体文件对象及两个章节的绑定；另把“包含回滚建议两个章节”提升为执行 A。',true],
 ['PARTICIPANT_ROLE','P','QA 确认文字记录准确后','明确 QA 复核与 PM 接收均未投影，P=ABSENT。'],
 ['CONDITION_COMPLETION','C','主链路检查通过或备用链路检查通过','完成 OR 未闭合，完成条目仍为 UNRESOLVED。'],
 ['QUANTITY_BINDING','R','最多尝试 5 次','明确尝试次数上限遗漏，R=ABSENT；与两次成功的验收条件亦未闭合。'],
 ['OUTPUT_OMISSION','O','generate server-review.md','明确英文生成交付没有 O 条目。'],
 ['QUANTITY_BINDING','R','within 30 minutes','明确英文时限遗漏，R=ABSENT；CHECK-19 v2.4 依据也没有 V。'],
 ['OUTPUT_OMISSION','O','otherwise generate health-summary.md','明确 otherwise 条件交付没有 O 条目。'],
 ['OUTPUT_OMISSION','O','提交 overall-review.md','最终交付遗漏，O=ABSENT；四类检查范围也未进入 I。']
];assert.equal(findings.length,50);
const manifest=read(root+'MANIFEST.json'),runs=read(out+'first/INDEX.json'),S=['I','O','A','P','R','V','C','B'];assert.equal(runs.length,50);
const ledger=manifest.cases.map((c,j)=>{const r=runs.find(x=>x.id===c.id),source=fs.readFileSync(c.source_path,'utf8'),[category,slot,quote,reason,falseResolved=false]=findings[j],a=[...source],at=source.indexOf(quote);assert.ok(at>=0,c.id+' quote');const start=[...source.slice(0,at)].length,end=start+[...quote].length;assert.equal(a.slice(start,end).join(''),quote);const view=read(out+'first/'+c.id+'/semantic-review-view.json'),trace=read(out+'first/'+c.id+'/trace.json');
return {case_id:c.id,title:c.title,source_sha256:c.source_sha256,run_status:r.status,contract:r.contract,semantic_review_status:'CONFIRMED_NOT_CLOSED',review_author:'ASSISTANT_SOURCE_VS_ACTUAL_REVIEW',admin_adjudication:'PENDING',official_gold:false,primary_counterexample:{category,slot,source_evidence:{start,end,quote},reason,false_resolved_observed:falseResolved,actual_slot_status:r.slots[slot].status,actual_entries:view[slot]},all_slots:r.slots,unresolved_count:r.unresolved,first_divergence:r.first_divergence,complete_trace:r.trace,review_limits:'One sufficient counterexample proves this case is not fully correct; this ledger does not claim every error was enumerated or that every unresolved is source ambiguity.',conditions:slot==='C'?trace.compiler_v03.boundary_ir.condition_expr_nodes:undefined};});
write(out+'SEMANTIC-REVIEW.json',ledger);
const categories=Object.fromEntries([...new Set(ledger.map(r=>r.primary_counterexample.category))].map(k=>[k,ledger.filter(r=>r.primary_counterexample.category===k).length]));
const stats={cases:50,runtime_success:runs.filter(r=>r.status==='EXECUTED').length,runtime_errors:runs.filter(r=>r.status==='ERROR').length,contract_pass:runs.filter(r=>r.contract==='PASS').length,confirmed_not_closed:ledger.length,full_semantic_pass_confirmed:0,at_least_one_wrong_resolved_cases:ledger.filter(r=>r.primary_counterexample.false_resolved_observed).length,primary_counterexample_categories:categories,unknown_or_coverage_cases:runs.filter(r=>S.some(s=>['UNRESOLVED','PARSER_COVERAGE_FAILURE'].includes(r.slots[s].status))).length,all_slots_resolved_or_absent:runs.filter(r=>S.every(s=>['RESOLVED','ABSENT'].includes(r.slots[s].status))).map(r=>r.id),official_accuracy:null,official_accuracy_reason:'Self-authored diagnostic suite, not independent ADMIN Gold or blind benchmark; no population-level accuracy claim'};write(out+'SUMMARY.json',stats);
const table='| Case | 场景 | 运行 | 合同 | 语义审阅 | 已确认的反例 |\n| --- | --- | --- | --- | --- | --- |\n'+ledger.map(r=>'| ['+r.case_id+'](first/'+r.case_id+'/canonical-7plus1.md) | '+r.title+' | '+r.run_status+' | '+r.contract+' | 未闭合 | '+r.primary_counterexample.reason+' |').join('\n')+'\n';write(out+'RESULTS.md','# 50 例逐条实际结果\n\n每例至少列出一个与原文直接对应的失败证据；这不是全部错误计数。审阅者为本次助手，待 ADMIN 复审，不作人工 Gold。\n\n'+table);
const base=read(out+'BASELINE.json'),changes=base.protected_files.filter(r=>(fs.existsSync(r.path)?hash(fs.readFileSync(r.path)):null)!==r.sha256);assert.equal(changes.length,0);write(out+'PROTECTED-ASSETS.json',{status:'PASS',checked:base.protected_files.length,changes,parser_modified:false,model_threshold_pack_schema_projection_modified:false,old_seals_unchanged:true,note:'Tracked working-tree bytes and preexisting missing states verified; not a new hash inventory of untracked model weights.'});
const sourceChanges=manifest.cases.filter(c=>hash(fs.readFileSync(c.source_path))!==c.source_sha256);assert.equal(sourceChanges.length,0);write(out+'SOURCE-VERIFICATION.json',{status:'PASS',count:50,rewritten_after_run:0,hashes_match:true});
write(out+'REPORT.md','# ADMIN 短任务书 50 例 · 首次诊断实测\n\n**当前短任务 Parser 仍不扎实，不能依据此前少数固定样本的通过宣称已解决。**\n\n本轮先编写并冻结 50 份较规范、较丰富的 ADMIN 整体任务书，再逐份实际运行封存 R2 短任务解析器。无需 ADMIN 拆 WP，未调用矩阵编译器，未给 Parser 注入预期、审阅提示或隐藏分工。每例 82–176 码点，47 份中文、3 份英文。原用户示例独立登记，不混入这 50 例。\n\n## 实测结论\n\n- 实际运行：50/50 成功，0 运行异常。\n- 合同 Gate：50/50 PASS。\n- 逐例原文对照：50/50 均发现至少一个明确语义缺口，完整语义通过确认数为 0。\n- 至少 '+stats.at_least_one_wrong_resolved_cases+' 例已定位错误或不完整的 RESOLVED，不只是保守未解析。此数是已列举下限，不是全部错误数。\n- 49 例存在 UNRESOLVED 或 COVERAGE_FAILURE；ADM-043 虽然各槽都为 RESOLVED/ABSENT、未决为 0，仍存在输出内容及完成条件绑定错误。\n\n这是一组助手按用户要求编写的诊断样本，并非独立人工 Gold 或 Blind 集；不能把上述 0/50 外推为总体准确率。每例失败均由原文证据和实际事实结构支撑，不靠全局 unresolved 数量判失败。\n\n## 关键证据\n\n1. ADM-011 把报告中“列出新增接口及删除接口”的删除类别转为 REQUIRED 删除接口动作。\n2. ADM-031 把输出文件识别为 `inference-health.md 并` 并给出 RESOLVED。\n3. ADM-039 把“不负责审批”反向解析为 REQUIRED 审批。\n4. ADM-042 把接收者 ADMIN 解析成输入 I。\n5. ADM-043 保留了 AND 外形，却没有把完成条件绑定到具体输出及两项章节内容；也把内容约束错作执行动作。\n6. ADM-050 整体 ADMIN 任务书的检查范围、最终交付和主要协作角色没有完整提取，不能以需要用户先拆 WP 为理由转嫁缺口。\n\n共性缺口包括：角色缩写与明确责任的绑定、读取/检查范围遗漏、依据标识与版本组合、并列论元、模态否定、OUTPUT_CONTENT、条件及数量与正确目标的绑定。优先修这些通用机制；不能按 50 份答案写分支。\n\n## 产物\n\n- [50 份完整用例](../../../../fixtures/7plus1/admin-short-050-r02/CASES.md)\n- [逐例结果表](RESULTS.md)\n- [语义审阅证据](SEMANTIC-REVIEW.json)\n- 每例 `first/ADM-xxx/` 保存原文、完整 Trace、Canonical JSON/Markdown、未决项、结构审阅视图及模型调用信息。\n- [输入冻结](INPUT-FREEZE.json)、[运行基线](BASELINE.json)、[保护资产核验](PROTECTED-ASSETS.json)。\n\n初版简单探针保留在 admin-short-050，用户要求更丰富后、首次 Parser 运行前已由 r02 替代；原文未依据解析结果调整。当前任务指针和此前封存保持不变。\n\n本輪仅设计和测试，没有修 Parser，没有执行任务书中的业务操作。未做重复运行或全仓回归，未将旧回归结果冒充本轮验证。当前输出是后续通用修复的失败基线，停止等待 ADMIN 对用例及诊断的审阅。\n');
console.log(JSON.stringify(stats));
