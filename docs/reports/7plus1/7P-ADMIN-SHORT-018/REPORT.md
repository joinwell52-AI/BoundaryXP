# 7P-ADMIN-SHORT-018 · ADMIN Root 候选实测

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
- 最终专项 18/18，保留专项 64/64，原 Parser 回归 4359/4359，均 0 fail、0 skipped。
- D01–D08 完整比较 8/8；REF-001 43/43，真实「上述材料」歧义保留。REF 43 断言不代替原始 Gold 全结构相等认证。
- 最终 G0 两轮重新调用真实 NLP，nodes/relations/Eligibility/IR/Canonical/Proof/unresolved/coverage 精确一致；不比较随机运行 ID、时间及性能计时。没有冒称全 50 重复性。
- 全仓库回归按任务书第 15 节条件阻断，NOT_RUN_SEMANTIC_GATE_BLOCKED；没有使用旧 npm test 结果冒充。
- 11910 个原跟踪文件摘要及原缺失状态未变化，50 Source、此前 seals、Gold、v0.3、Schema、QI–QB、生产入口均保留。模型、Pack、阈值没有改动；import-closure SHA 不冒称未跟踪权重的摘要。

源入口、基线 HEAD、dirty state 见 BASELINE。历史 freeze 的源码恢复后逐字节 SHA 与原冻结摘要一致；当前有效 freeze 为 CANDIDATE-FREEZE-r03.json。首次失败记录与最终实际结果分目录保存，未覆盖失败。

完整 Trace、Canonical JSON/Markdown 及逐槽审阅在 final-g0-r03/，保留基线实测在 retention-r03/，独立控制在 final-controls-r03/。FULL-50-SEMANTIC-REVIEW 明确区分 5 已审、45 未评。没有执行任何输入中的业务动作、外部 ADR/TASK 文档、合并、发布或打 tag。

**STATUS=WAITING_ADMIN_REVIEW · PRODUCTION_READY=false**
