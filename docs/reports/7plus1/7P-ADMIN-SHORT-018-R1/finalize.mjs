import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {OUT,read,write,digest} from './common.mjs';
const gate=read(OUT+'G0-GATE.json'),errors=read(OUT+'FALSE-WRONG-STATUS.json'),ng=read(OUT+'NON-GOLD-RESULTS.json'),d=read(OUT+'D01-D08-RETENTION.json'),ref=read(OUT+'REF001-RETENTION.json'),repeat=read(OUT+'REPEATABILITY.json'),anti=read(OUT+'ANTI-OVERFIT-AUDIT.json');
const focused=read(OUT+'FOCUSED-REGRESSION.json'),retained=read(OUT+'RETAINED-REGRESSION.json'),original=read(OUT+'ORIGINAL-REGRESSION.json'),full=read(OUT+'FULL-REGRESSION.json');
const terminal=gate.full_closed===5?'ADMIN_SHORT_G0_METHOD_CLOSED':'ADMIN_SHORT_G0_ARCHITECTURE_GAP_REMAINS';
const outcome={TASK:'7P-ADMIN-SHORT-018-R1',terminal_outcome:terminal,method_runtime_contract_diff:'Normative v0.3 contains PART_OF; frozen 014 runtime lacked only PART_OF. Candidate reconciles this one enum and signature.',PART_OF:read(OUT+'PART-OF-CONTRACT-AUDIT.json').status,QualifiedDomain:read(OUT+'QUALIFIED-DOMAIN-AUDIT.json').status,compound_qualifier:read(OUT+'COMPOUND-QUALIFIER-AUDIT.json').status,source_identity:read(OUT+'SOURCE-IDENTITY-AUDIT.json').status,G0:gate.full_closed+'/5',partial_RESOLVED:errors.partial_RESOLVED,wrong_binding:errors.wrong_binding,unsupported_RESOLVED:errors.unsupported_RESOLVED,compiler_unresolved_on_clear_G0_source:errors.compiler_unresolved_on_clear_source,D01_D08:d.pass+'/8',REF001:ref.pass+'/43',focused:focused.pass+'/'+focused.tests,retained:retained.pass+'/'+retained.tests,original:original.pass+'/'+original.tests,full:full.status+' '+full.pass+'/'+full.tests,repeatability:repeat.status+' '+repeat.rows.length+'/'+repeat.rows.length,anti_overfit:anti.status,protected_assets:read(OUT+'PROTECTED-ASSETS.json').status,report_path:OUT+'REPORT.md',scope:'Five G0 cases only; 18 controls certify declared mechanisms, not complete general-input coverage',known_control_gap:'D6 heading 当前任务 has retained frontend coverage failure; background identity not merged; preserved and not repaired.',G1_G2_G3_holdout:'NOT_EXECUTED_NOT_AUTHORIZED',PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW',no_merge_release_tag_production_switch:true};
outcome.full_counts={tests:full.tests,pass:full.pass,fail:full.fail,skipped:full.skipped};
assert.equal(ng.status,'PASS');assert.equal(d.pass,8);assert.equal(ref.pass,43);assert.equal(repeat.status,'PASS');assert.equal(anti.status,'PASS');assert.ok([focused,retained,original,full].every(r=>r.status==='PASS'&&r.fail===0&&r.frozen_runtime_unchanged));
write(OUT+'TESTS.json',{focused,retained,original,full,independent_controls:ng.pass+'/'+ng.total,real_semantic_G0:gate.full_closed+'/5',contract_PASS_not_semantic_acceptance:true});write(OUT+'FINAL-OUTCOME.json',outcome);
write(OUT+'NEXT-TASK-RECOMMENDATION.md','# ADMIN Review required\n\nG0 的既有方法已在五个授权源上闭合。018 的 PART_OF 结论应按 ADMIN 裁定归为规范与运行合同不一致，不能继续当作 v0.3 缺少该关系的证据。\n\n本轮不启动 G1–G3、holdout、Matrix/WP、Hybrid 或生产切换。请 ADMIN 先审阅五例的全槽证据、内部 QualifiedDomain 与复核限定的所有权，以及验证适配器。之后再决定下一任务。\n\n独立背景反例 D6 的唯一身份排除检查通过，但原有前端对“当前任务”标题产生覆盖诊断；报告已保留原样，未声称该控制整篇语义闭合。若继续扩展结构化 ADMIN 任务覆盖，应由新的专项明确授权结构角色标题的问责合同，不在本轮追加修复。\n');
write(OUT+'REPORT.md',`# 7P-ADMIN-SHORT-018-R1 · G0 方法与运行合同闭环

**终态：${terminal}。G0 五例完整语义闭合 ${gate.full_closed}/5。停止等待 ADMIN Review。**

当前任务由 CURRENT-TASK 指向 R1；授权与裁定文件已完整阅读。候选仅放在 research/7plus1-parser/v0.3-admin-short-018-r1/，复用已封存 018 与 R2，并使用真实 HanLP/spaCy 信号。CLI/UI 生产入口不变；不拆 WP、不运行 Matrix/Hybrid、不改变模型、Pack、阈值或确定性 QI–QB。

## 规范与运行合同差异

v0.3 规范的有限关系空间明确列出 PART_OF。冻结 014 的 19 项运行合同只缺这一项。[METHOD-RUNTIME-CONTRACT-DIFF.json](METHOD-RUNTIME-CONTRACT-DIFF.json) 在编码前生成，记录完整列表及原文件 SHA。018 的失败仍是有效封存，但“规范本身没有 PART_OF”的方法判断已由 ADMIN 撤销。

本轮只在独立候选增加 ENTITY→ENTITY 的 PART_OF。证据必须来自同句显式读取的唯一容器，或显式文档章节的唯一交付归属；无近邻名词猜测、传递闭包或 PART_OF 自动入槽。候选私有 Schema 仅扩展这一枚举，原 Schema 原字节不动。

验证适配器先对**真实候选对象**执行扩展 Schema、关系类型和来源证书检查；再向冻结不变量验证器提供仅枚举形状适配的副本（PART_OF→CONJUNCTION），用于继续验证端点、来源、注册表、Proof 和覆盖等原约束。该副本不是生产者输出；实际 relations、BoundaryIR、Canonical、Proof 不发生这种替换。完整说明见 PART-OF-CONTRACT-AUDIT 与 G17。

## 授权机制与源码

- relations.mjs：候选 PART_OF 合同、显式结构/唯一候选证书及类型审计。
- domains.mjs：QualifiedDomain、复核拥有的 OR/AND 状态限定、唯一显式源输入 COREFERENCE，并补齐已有 Eligibility 的证据链。
- contract-gates.mjs：候选私有枚举验证和保留全部冻结不变量的验证适配器。
- engine.mjs：候选准备 → 既有 Eligibility → 证据闭包 → 既有 IR/QI–QB/Proof，不从最终槽位反推中间结构。

内部域保存 base/member/property/quantifier/qualifier、精确 spans、关系和 Proof 引用，没有新增 7+1 槽。复核内容使用明确的源 base 和 member selector，不自动增加 CHECK 的 property 作为报告覆盖要求。删除/改名是 REVIEW_CONFIRMED 下的状态限定，不是当前执行 A/B。

## 五例源文逐槽审阅

| Case | 本轮完整闭合 | 原缺口或保留点 |
|---|---|---|
| ADM-003 | PASS | 显式输入、OPS 检查/交付、PM 协调、QA 复核、禁止调用与改动均保留 |
| ADM-006 | PASS | I 仅 backup-index.csv；CHECK=ALL 备份的校验结果；复核覆盖所有源清单成员并约束 PM 交接 |
| ADM-012 | PASS | ALL 接口，OR(DELETED, RENAMED) 明确归属 QA 确认状态；报告交接及禁止修改保持 |
| ADM-021 | PASS | 原始数据通过唯一显式源输入身份对应 orders.csv，B 对象、关系与 ITEM scope 同步；45 分钟和完成 AND 保留 |
| ADM-047 | PASS | Nora、QA、PM、ADMIN 的各 use-site 角色及 review-before-send 关系保持 |

各例完整 Trace、实际 Canonical JSON/Markdown 和逐槽审阅在 final-g0/。FULL-5-SEMANTIC-REVIEW 逐项核对精确 I/O、A 的谓词/主体/对象、P 角色、B 的模态/范围、R/C 与条件所有权，且拒绝额外动作或编译器对明确源的未决。BEFORE-AFTER-EVIDENCE 保存原五处部分结果与当前链路，不覆盖旧封存。

本轮五例 partial RESOLVED=${errors.partial_RESOLVED}，wrong binding=${errors.wrong_binding}，unsupported RESOLVED=${errors.unsupported_RESOLVED}，明确 G0 源上的 compiler unresolved=${errors.compiler_unresolved_on_clear_source}。这些计数只覆盖五例，不是全 50 例或任意自然语言零错误证明。

## 实际验证

- 编码前固定 18 条独立 non-Gold 文本与断言；前置 A/B/C/D Gate 为 5/5、2/2、5/5、6/6；冻结后重跑 ${ng.pass}/18。
- R1 专项 ${focused.pass}/${focused.tests}、候选接入的保留专项 ${retained.pass}/${retained.tests}、原 Parser 回归 ${original.pass}/${original.tests} 均 0 fail、0 skipped。全仓库共 ${full.tests} 项，${full.pass} pass、${full.fail} fail、${full.skipped} skipped；跳过项不计实测通过，具体项和原原因保留在 FULL-REGRESSION 日志及 SKIPPED-TESTS.json。
- D01–D08 ${d.pass}/8；REF-001 ${ref.pass}/43，“上述材料”的真实歧义仍 UNRESOLVED。
- 五个 G0 和 18 条独立控制重新调用真实 NLP 两次，语义签名 ${repeat.rows.filter(r=>r.pass).length}/${repeat.rows.length} 精确一致；随机 run ID、时钟及性能计时不参与语义相等。
- 全仓库回归仅在 G0=5/5 后启动。CANDIDATE-FREEZE 的 129 个 import 文件和 4 个候选文件在最终测试前固定，之后未改动。
- ${read(OUT+'PROTECTED-ASSETS.json').checked_files} 个旧跟踪文件的摘要及原缺失状态一致。018 与以前 seals、50 Source、Gold、v0.3、QI–QB、模型/Pack 配置、生产入口保持不变。

## 保留的失败及限制

probe-controls-r01 首次结果不覆盖：A3 暴露章节归属缺口；C1–C3 曾被审计脚本误套 A/B 的外部输入断言。只纠正审计脚本的适用条件，验证源文和预先声明的期望不变；随后在 G0 重放前全部通过并冻结。

D6 的背景“历史原始数据”没有与当前输入合并，满足授权的身份排除断言；但保留前端仍对标题“# 当前任务”生成 No supported native semantic construction，导致覆盖失败。这一真实诊断保留在原 Trace 和 FIRST-DIVERGENCE，**没有把 D6 整篇宣称为语义通过**，也没有在 R1 中追加标题修复。双容器 A2、双输入 D2 仍正确未决，未以全降未决方式处理五个 G0。

G1/G2/G3/holdout 均未执行。本轮结果支持既有方法在授权 G0 上闭合；不支持生产就绪或全 50 例闭合。旧 018 失败结论不改写，使用本轮 ADMIN 裁定及新证据进行纠正。

STATUS=WAITING_ADMIN_REVIEW · PRODUCTION_READY=false
`);
const required=['REPORT.md','ADMIN-ADJUDICATION-READBACK.json','METHOD-RUNTIME-CONTRACT-DIFF.json','PART-OF-CONTRACT-AUDIT.json','QUALIFIED-DOMAIN-AUDIT.json','COMPOUND-QUALIFIER-AUDIT.json','SOURCE-IDENTITY-AUDIT.json','NON-GOLD-CONTROLS.json','G0-GATE.json','FULL-5-SEMANTIC-REVIEW.json','FALSE-WRONG-STATUS.json','D01-D08-RETENTION.json','REF001-RETENTION.json','REPEATABILITY.json','ANTI-OVERFIT-AUDIT.json','ORIGINAL-REGRESSION.json','FULL-REGRESSION.json','FINAL-OUTCOME.json','NEXT-TASK-RECOMMENDATION.md'];
const freeze=read(OUT+'CANDIDATE-FREEZE.json'),frozen=freeze.files.map(r=>({...r,pass:digest(r.path)===r.sha256}));assert.ok(frozen.every(r=>r.pass));assert.equal(digest(OUT+'checks.mjs'),freeze.checks_sha256);assert.equal(digest('tests/parser-admin-short-018-r1.test.mjs'),freeze.test_sha256);assert.equal(digest(OUT+'NON-GOLD-CONTROLS.json'),freeze.controls_sha256);
write(OUT+'VERIFY.json',{status:'PASS',branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),required_files:required.map(p=>({path:OUT+p,exists:fs.existsSync(OUT+p)})),frozen_runtime:frozen,controls_tests_checks_unchanged:true,all_regression_records_real:true,semantic_gate_is_separate:true,protected_assets:read(OUT+'PROTECTED-ASSETS.json'),G1_G2_G3_holdout_not_executed:true,STATUS:'WAITING_ADMIN_REVIEW'});
console.log(JSON.stringify(outcome));
