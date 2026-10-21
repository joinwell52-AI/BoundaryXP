# 026E：现成语义解析路线可行性实验

实验已完成，停止等待 ADMIN Review。没有修改活动 Parser、Γ、生产入口、模型阈值、Pack 或既有封存；没有恢复 026 修复，也没有启动 027。

结论：本次测试的整句输入不能直接改善当前完整候选路径；测试的中文 Mengzi MRP 模型能提供局部有价值的语义边，但不足以替换现有路径。问题同时存在于自然语言解析/候选重建和 Γ 下游，不能把全部瓶颈归给 NLP。

## 决策与可比口径

- H1_FRAGMENTATION=FALSIFIED：这是当前固定实现/60 条开发诊断样本上的充分改进假设被否证，不是说逗号切分永远无影响。
- SEMANTIC_PARSER=NOT_FEASIBLE：仅针对本次模型作为足以支撑 BoundaryXP 当前需求的替代路线；不推论所有语义解析模型不可行。
- ORACLE_DOWNSTREAM_10=7/10：仅为手工来源审阅图的语义下游诊断检查；未修改 Γ。完整原入口 0/10，被 G8 拒绝。
- WAITING_ADMIN_REVIEW=true。

| 已声明来源语义断言 | A 现有切分 | B 整句同模型 | C 中文 MRP 原始图 |
|---|---:|---:|---:|
| 节点/完整层级恢复 | 631/670 | 630/670 | 464/670 |
| 谓词—论元关系恢复 | 259/331 | 244/331 | 112/331 |
| 条件/模态恢复 | 289/349 | 278/349 | 155/349 |
| 错误业务谓词提升 | 12 | 21 | 不适用：未投影业务动作 |
| 错误绑定诊断下界 | 10 | 25 | 42 |
| 直接精确节点对齐 | 2144/2144 | 2199/2199 | 1458/1649 |

C 的原始顶层/嵌入层污染另外为 10；不能把它与 A/B 的最终业务动作错误混为同一级指标。C 的 191 个无直接 anchor 抽象节点保留原图、请求和边来源，不伪造 span；非法 anchor 为 0。中文共同 58 条上的对照详见 SEMANTIC-PARSER-COMPARISON.json，排除两条英文后结论不变。错误计数为可审阅诊断下界，不是穷尽式正确率。

60 条来源及 10 条 Oracle 在任何模型输出前由固定分层算法选定，完整算法和 SHA 在 CORPUS-SELECTION.json。所有材料均为已暴露开发文本，不是新 Blind。自动结果并不等于语义通过。新增来源断言由 Codex 对原文审阅，尚待 ADMIN 确认；没有假称已获得人工 ADMIN 审定或新 Gold。

## A/B：底层句法增加，候选消费反而退步

原始 DEP/SRL 的局部结构支持为 A 281/331、B 288/331。该数字只是依存/SRL 路径支持，不是正确语义认证。进入未修改的候选消费者后，绑定论元 259→244，条件/模态 289→278，错误绑定 10→25。

既有冻结来源检查：A Root 0/20、Natural 0/20、控制 20/20；B Root 1/20、Natural 1/20、控制 11/20。B 新闭合 ROOT-049、NROOT-009，但原正确控制退步 BLIND-002、BLIND-003、BLIND-006、BLIND-008、BLIND-011、BLIND-013、BLIND-016、BLIND-018、BLIND-020。因此不能准入。

B 依任务保留整句标点，A 控制路径丢弃分隔符，存在这个明确实验差异。两组均调用同一冻结 HanLP/spaCy 权重和当前 synchronous compileNative，BGE/E5/NLI 未调用；不把这次结果包装成完整异步模型链的测试。A 保留既有格式化主 NLP 信号，B 额外保留完整 worker 原始请求/响应与中文 spaCy 次级信号；A 的次级原始响应未采集，不能假称拥有。

## C：已真实加载与调用，不只是下载

MRP2020_AMR_ZHO_MENGZI_BASE，CPU，153,644,745 参数，HanLP 2.1.3 + perin-parser 0.0.12 + torch 2.6.0+cpu。60 条运行，58 条含中文，187 个真实句级原始图，0 推理错误；ROOT-049/NROOT-038 的纯英文共 6 句标为 UNSUPPORTED_LANGUAGE。

完整下载 SHA-256：a5508fd1973ee751b505fba5164904fe470da309c40228361fc39bba503c565c；本地 model.pt、dataloader.pt、config/tokenizer、依赖源码摘要均在 MODEL-MANIFEST.json。模型与缓存不上传，不登记为生产批准模型。HanLP 代码 Apache-2.0、PERIN 已安装源码头 MPL-2.0；HanLP 公布的模型默认 CC-BY-NC-SA-4.0，未找到本归档独立放宽授权，训练数据具体授权未完全独立确立。来源链接及不确定项在 Manifest。

有局部真实恢复，例如 ROOT-016 的“结束→任务”、NROOT-018 的“删除/改名→接口”、NROOT-007 的“触发→构建”、NROOT-011 的“发布→版本”，以及 NROOT-001 的报告条件边。全部增量边/原始证据在 SEMANTIC-PARSER-COMPARISON.json，未据此增加规则。整体完整论元、跨句引用、输出所有权、模态和嵌入层级仍不足。模型没有直接输出 Boundary IR/7+1，没有把 AMR top 当业务动作。

原图 input 为分词后加空格串；对齐只利用真实 token span 的逐码点映射。抽象节点没有源 anchor 时明确保留无 anchor 状态。检查采用实际 ARG/operator 路径，不从原文额外填入 REQUIRED/FORBIDDEN。AMR 原始图与 BoundaryXP 类型图表达能力不同，因此表中 C 是保守结构恢复下界，不是通用 AMR F1。没有已证明的通用 C→Gc 适配器，不能声明现成模型即可完成主链。可选 D 未运行：C 已能运行并提供可对齐关系，不满足备用模型的触发条件。

## Oracle：Γ 也有独立问题

所有手工图使用既有 node/relation/expression 合同与精确原文；人工图仅为诊断，不混入自动模型指标，不作为 Gold。Oracle 构造稿 r001–r006 全部保留：包括原始 Gate 拒绝、性能字段 bool→number、STATE 合法论元签名、显式 qualifier/coreference、条件极性/量词与停止对象修正。它们是诊断图适配/来源标注修订，不是 Parser/Γ 修复；不得只看最终稿而隐去这些中间问题。

原始入口全 10 条因 G8 GENERIC_GENERATOR_NOT_A_RUNTIME_STAGE 终止：人工图不运行自动通用候选生成器。只读诊断适配器仅抑制最后的 assertNoBypass 抛错，让已计算的结果可查看；G8 FAIL 仍完整保留，没有伪造生成器运行收据。其他 11 个架构 Gate 和合同 Gate 全 10 条 PASS。语义下游算法与实际源码字节保持不变。

七条语义检查通过：ROOT-013、ROOT-015、ROOT-017、ROOT-014、NROOT-002、NROOT-007、NROOT-035。三条失败：

1. ROOT-023：“在用设备编号”是完整名词论元，Γ gamma.mjs:122 的开头“在”包络拒绝使核对动作失去该对象。
2. NROOT-001：“QA…复核后，PM…汇报”里的复核具有本地主句工作和时间前提两层用途，Γ gamma.mjs:59 将位于条件域的 EVENT 一律拒为非当前执行，丢失复核工作。
3. NROOT-038：“sent to QA for review”保留 review 的目的补语层，Γ gamma.mjs:58 拒绝该层后，手工审阅要求的 QA review 工作/角色没有被下游表达。该人工角色断言也须由 ADMIN 核验。

完整节点、边、Γ 决策、最终 7+1、Proof、检查失败及源码行摘要在 ORACLE-FAILURE-ANALYSIS.json 和 oracle/r006。不应因 Oracle 7/10 就声称下游充分；即使人工语义图正确，当前完整入口仍不能直接消费，语义认证也存在独立失败。

## 保存、基线与验证

2348 个原活动/封存文件逐字节 SHA 校验一致。活动026目录为此前已存在的本地未跟踪文件；Git HEAD 2843cac5…是任务指针，不伪称它是运行引擎提交。RUNTIME-SNAPSHOT-MANIFEST.json 记录真实转接模块字节；原样快照放在 EVIDENCE.zip 的 reproduction-snapshot/。模型、缓存、虚拟环境不在快照中。

120 份 A/B Trace 的架构 Gate 全 PASS，合同 Gate 119/120：B/ROOT-031 的 quantity metric 不符合现有 Schema，首次失败完整保留，未修复或重跑覆盖。这些是结构执行结果，不是语义 120/120。实验审计首轮错误地假定全部合同 PASS，真实断言失败在 audit-tests/r001 保留；修正审计为核对首次收据与实际 Trace 一致，不要求或改写失败输出。本轮没有跑完整 026 回归；仅执行任务规定的 60 条对照及 10 条下游隔离。16/50、9/100、200/200 是此前准入基线数字，未冒充本轮全量重测。

只读审阅更正保留原件：A/B 活动审阅为 review/r002；C 为 review/r003（区分丢失 qualifier 与错误对象绑定，并保留显式模态 graph operator 路径）；原先审阅仍在原目录。spaCy wheel 和解包目录 SHA 的审计口径更正见 AB-MODEL-AUDIT-r002.json。没有改首次模型输出以增加通过数。

全部原文、模型原始信号/图、首次错误、候选图、Γ、Canonical、Proof、Oracle 草稿与审阅材料以原字节保存在 EVIDENCE.zip；压缩只减少 Git 体积。本地同路径原文件亦保留。SHA256SUMS/Manifest/SEAL 负责核验，不包含模型权重。解包后各 JSON 引用路径与仓库相对路径一致。

停止在 WAITING_ADMIN_REVIEW；下一步由 ADMIN 决策，不自动继续修复、不 merge/release/tag、不切生产。
