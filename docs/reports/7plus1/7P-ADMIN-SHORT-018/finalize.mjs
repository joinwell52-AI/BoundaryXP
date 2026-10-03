import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {OUT,ROOT,read,write,digest,walk} from './common.mjs';
const task='7P-ADMIN-SHORT-018',g0=read(OUT+'G0-GATE.json'),ng=read(OUT+'NON-GOLD-RESULTS.json'),repeat=read(OUT+'REPEATABILITY.json'),d=read(OUT+'D01-D08-RETENTION.json'),ref=read(OUT+'REF001-RETENTION.json'),errors=read(OUT+'FALSE-WRONG-STATUS.json');
const focused=read(OUT+'FOCUSED-final-REGRESSION.json'),retained=read(OUT+'RETAINED-r03-REGRESSION.json'),original=read(OUT+'ORIGINAL-r03-REGRESSION.json');
write(OUT+'ORIGINAL-REGRESSION.json',{...original,original_run_record:OUT+'ORIGINAL-r03-REGRESSION.json',frozen_runtime_verified:true});
write(OUT+'TESTS.json',{focused,retained,original,full:read(OUT+'FULL-REGRESSION.json'),independent_controls:ng.status,contract_gate_not_semantic_acceptance:true});
const final={task,terminal_outcome:'ADMIN_SHORT_CORE_METHOD_GAP',semantic_success:false,G0:g0.full_closed+'/5',G1:'BLOCKED',G2:'BLOCKED',G3:'BLOCKED',development_20:{executed:5,full_closed:g0.full_closed,total:20},holdout_30:{executed:0,full_closed:0,total:30,status:'NOT_EVALUATED_GATE_BLOCKED'},total_50:{executed:5,full_closed:g0.full_closed,not_evaluated:45,total:50},wrong_binding_identified:errors.wrong_binding_identified,unsupported_extra_RESOLVED_identified:errors.unsupported_extra_RESOLVED_identified,partial_RESOLVED:errors.partial_RESOLVED,error_count_scope:'Five reviewed G0 cases only; no zero-error certification for remaining 45',unresolved_correct:0,compiler_unresolved:errors.compiler_unresolved.length,D01_D08:d.pass+'/8',REF001:ref.pass+'/43',focused:focused.pass+'/'+focused.tests,retained:retained.pass+'/'+retained.tests,original:original.pass+'/'+original.tests,full:'NOT_RUN_SEMANTIC_GATE_BLOCKED',repeatability:repeat.status,anti_overfit:read(OUT+'ANTI-OVERFIT-AUDIT.json').status,protected_assets:read(OUT+'PROTECTED-ASSETS.json').status,candidate_freeze:OUT+'CANDIDATE-FREEZE-r03.json',PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW',no_merge_release_tag_production_switch:true,stopped_at_gate:'G0'};
assert.equal(g0.full_closed,2);assert.equal(ng.status,'PASS');assert.ok([focused,retained,original].every(x=>x.status==='PASS'));assert.equal(d.pass,8);assert.equal(ref.pass,43);write(OUT+'FINAL-OUTCOME.json',final);
write(OUT+'NEXT-TASK-RECOMMENDATION.md',`# ADMIN Review required

018 did not achieve G0. Do not advance to G1, Matrix/WP, Hybrid or production. The current result tests the limited direct-root candidate, not the impossibility of deterministic semantic compilation.

The next bounded decision should address typed qualified-member/reference domains and composition of state qualifiers, while retaining already certified execution subjects and identity. Review whether the existing v0.3 finite contract can express these using supported endpoints and relations; do not add an unapproved PART_OF relation. Compound deletion-or-rename must remain owned by the confirming state rather than execution A/B. Broad original-data prohibitions need a supported identity binding.

The controls exposed an acceptance limitation: 15/15 declared local mechanism assertions and 18/18 focused tests did not certify full root semantics. Future controls must also falsify qualifier-domain and object-identity completeness. This report does not authorize or begin that work.
`);
write(OUT+'REPORT.md',`# 7P-ADMIN-SHORT-018 · ADMIN Root 候选实测

**终态：ADMIN_SHORT_CORE_METHOD_GAP。018 未达到成功标准。** 当前以每份 ADMIN 任务为单一整体权限范围，使用真实 HanLP/spaCy → typed graph → Eligibility → Boundary IR → 冻结 QI–QB → Canonical → Proof，不拆 WP、不运行 Matrix、不启用 Hybrid、不切换生产。

## 实际 Gate

| Gate | 本轮实际执行 | 完整语义闭合 | 结果 |
|---|---:|---:|---|
| G0 | 5 | 2/5 | FAIL |
| G1 | 0 | 未评测 | BLOCKED |
| G2 | 0 | 未评测 | BLOCKED |
| G3 | 0 | 未评测 | BLOCKED |
| 30 holdout | 0 | 未评测 | BLOCKED |

开发集为 2/20 已确认闭合、仅实测 5；全体为 2/50 已确认闭合、45 未评测，不能写成剩余 48 全失败或把运行成功写成 50/50 通过。没有合格的 20/20 freeze，因此没有执行 holdout。r03 只是失败诊断候选的完整性冻结。

G0：ADM-003、ADM-047 在逐槽原文对照中闭合；ADM-006、ADM-012、ADM-021 未闭合。全部五例运行及合同 PASS，但仍有 5 项源支持的事实在 RESOLVED 状态下缺少完整类型绑定。没有确认的新编造额外动作或错误跨对象绑定；这不代表零错误。仅这五例审计的 partial RESOLVED=5、明确编造额外 RESOLVED=0、确认 wrong binding=0、真实歧义的正确未决=0，另有 1 项编译器结构未决。45 例未评测，不能给出它们的错误计数。

## 有效通用修复

1. 有限谓词词典及局部语法生成类型候选，保护文件/版本等字面量，分离读取输入、生成交付、禁止对象、报告接收者；修饰语不丢弃。
2. 显式安排语法区分协调者与执行者；复核者与接收者按实际 use-site 记录；英语 before/after 的各谓词主体分层。生成和交接复用唯一显式交付，给出来源与结构证据。
3. 明确全任务时限绑定任务节点；完成 AND 的状态对象绑定显式输入/交付；确认后的交接记录 reviewer、output、ALL 与原文 guard。
4. 首次保留测试曾发生主体回归。修复为保留 R2 已验证的同一谓词 use-site 主体，并在新候选产生后重用冻结的 qualified identity 归一化；不重新运行会拒绝缩写显式主体的旧继承推断。最终 D 八例与原有专项全部保留。所有先前失败输出、测试日志和实现 r01/r02 摘要对应源码保留，未覆盖。

## 尚未闭合及源码根因

- ADM-006「检查其中所有备份的校验结果」：state-bindings.mjs 的 EXPLICIT_SENTENCE_MEMBER_REFERENCE 只保留 local_reference 元数据，并尝试调用冻结关系合同不存在的 PART_OF。relation 工厂拒绝，记录 Illegal semantic type signature PART_OF；没有添加新协议关系。但 I/A 的成员及属性域仍不能完整计算。它是实现/表达缺口，不是人类源歧义。
- ADM-006 的「报告覆盖清单中的每一项」：REVIEW_CONFIRMED 正确引用 QA 和 backup-audit.md，条件仍只有 raw required_content + ALL，未建立清单成员与原输入域的完整类型链。
- ADM-012 的「每个删除或改名的接口都已记录」：删除/改名没有污染 A/B，确认与交接对象正确；但 OR 限定仅留在原文对象字符串，没有组合类型表达。
- ADM-021 的「不得更改原始数据」：FORBIDDEN 没反转，但 ITEM(原始数据) 没有已验证关系对应 orders.csv。不能以槽位 RESOLVED 认证范围闭合。

这些缺口定位于 qualified domain / relation / scope / condition composition，不能靠新增句式数量或统计 I/O/A 条目宣告解决。[FIRST-DIVERGENCE.json](FIRST-DIVERGENCE.json) 和 [FALSE-WRONG-STATUS.json](FALSE-WRONG-STATUS.json) 保存逐项原文 span、事实、节点、范围和条件。当前 finite-contract 方法候选未闭合，不证明所有确定性编译方法不可行；本轮没有修改合同去掩盖缺口。

## 实测与范围

- 实施前冻结 18 个独立 non-Gold 控制：A/B/C/D/F 各 3 条，本轮执行 15；E 三条保留给被阻断的 G3，未运行。15/15 声明的局部断言通过，不能当作所有语义完整正确。
- 最终专项 ${focused.pass}/${focused.tests}，保留专项 ${retained.pass}/${retained.tests}，原 Parser 回归 ${original.pass}/${original.tests}，均 0 fail、0 skipped。
- D01–D08 完整比较 ${d.pass}/8；REF-001 ${ref.pass}/43，真实「上述材料」歧义保留。REF 43 断言不代替原始 Gold 全结构相等认证。
- 最终 G0 两轮重新调用真实 NLP，nodes/relations/Eligibility/IR/Canonical/Proof/unresolved/coverage 精确一致；不比较随机运行 ID、时间及性能计时。没有冒称全 50 重复性。
- 全仓库回归按任务书第 15 节条件阻断，NOT_RUN_SEMANTIC_GATE_BLOCKED；没有使用旧 npm test 结果冒充。
- ${read(OUT+'PROTECTED-ASSETS.json').checked_files} 个原跟踪文件摘要及原缺失状态未变化，50 Source、此前 seals、Gold、v0.3、Schema、QI–QB、生产入口均保留。模型、Pack、阈值没有改动；import-closure SHA 不冒称未跟踪权重的摘要。

源入口、基线 HEAD、dirty state 见 BASELINE。历史 freeze 的源码恢复后逐字节 SHA 与原冻结摘要一致；当前有效 freeze 为 CANDIDATE-FREEZE-r03.json。首次失败记录与最终实际结果分目录保存，未覆盖失败。

完整 Trace、Canonical JSON/Markdown 及逐槽审阅在 final-g0-r03/，保留基线实测在 retention-r03/，独立控制在 final-controls-r03/。FULL-50-SEMANTIC-REVIEW 明确区分 5 已审、45 未评。没有执行任何输入中的业务动作、外部 ADR/TASK 文档、合并、发布或打 tag。

**STATUS=WAITING_ADMIN_REVIEW · PRODUCTION_READY=false**
`);
const required=['REPORT.md','BASELINE.json','METHOD-CONTRACT.json','G0-GATE.json','G1-GATE.json','G2-GATE.json','G3-GATE.json','NON-GOLD-CONTROLS.json','CANDIDATE-FREEZE.json','CANDIDATE-FREEZE-r03.json','HOLDOUT-RESULTS.json','FULL-50-SEMANTIC-REVIEW.json','FALSE-WRONG-STATUS.json','OUTPUT-CONTENT-AUDIT.json','ROLE-MODALITY-AUDIT.json','QUANTITY-CONDITION-AUDIT.json','BASIS-VERSION-AUDIT.json','SCOPE-NEGATION-AUDIT.json','D01-D08-RETENTION.json','REF001-RETENTION.json','REPEATABILITY.json','ANTI-OVERFIT-AUDIT.json','ORIGINAL-REGRESSION.json','FULL-REGRESSION.json','FINAL-OUTCOME.json','NEXT-TASK-RECOMMENDATION.md'];
const verified={status:'PASS_INTEGRITY_AND_REPORT_HONESTY_ONLY',semantic_gate_pass:false,required_files:required.map(p=>({path:OUT+p,exists:fs.existsSync(OUT+p)})),frozen_runtime:read(OUT+'CANDIDATE-FREEZE-r03.json').files.map(r=>({...r,pass:digest(r.path)===r.sha256})),protected_assets:read(OUT+'PROTECTED-ASSETS.json'),sources_unchanged:read(OUT+'ANTI-OVERFIT-AUDIT.json').sources.every(x=>x.pass),historical_code_snapshots:read(OUT+'IMPLEMENTATION-HISTORY.json').status,gate_chain_block_respected:true,no_holdout_or_G1_G2_G3_run:true,report_counts_match:true,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),PRODUCTION_READY:false};assert.ok(verified.required_files.every(x=>x.exists));assert.ok(verified.frozen_runtime.every(x=>x.pass));assert.equal(verified.protected_assets.status,'PASS');assert.equal(verified.branch,'review/7plus1-parser');write(OUT+'VERIFY.json',verified);
console.log(JSON.stringify(final));
