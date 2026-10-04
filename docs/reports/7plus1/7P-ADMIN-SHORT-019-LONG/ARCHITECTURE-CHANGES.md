# 019 候选的语义编译修改

本次仅新增 `research/7plus1-parser/v0.3-admin-short-019/` 候选及独立测试，不切换生产入口。沿用 v0.3 的 Eligibility → Boundary IR → 确定性 Canonical → Proof 链，并沿用 R1 的 PART_OF、QualifiedDomain、来源身份及其合同检查。没有重定义 I/O/A/P/R/V/C/B。

新增机制按语义所有权组织，不按 ADM 编号组织：

- `root-frames.mjs`：依存与显式谓词候选、局部主语/对象、协调动作、任务输入及参与者角色。保留 NOT_REQUIRED 和否定角色声明。
- `composition.mjs`：BasisReference 的标识、版本和定位引用；有类型的资源数量及目标；显式交付流和证据。
- `ownership.mjs`、`content-local.mjs`：当前任务、背景、条件、输出内容的所有权；输出章节 PART_OF、引号内容及内容分支。
- `conditions.mjs`：条件层与后件分离，AND/OR、检查对象的共享谓词、完成/停止/恢复及带数量的接受条件。
- `team-flow.mjs`、`roles.mjs`：实际执行者、复核者、接收者、协调者与负向职责；不按职级推导权限。
- `scope.mjs`、`domain-local.mjs`、`context-domains.mjs`：显式环境范围、排除集合、唯一输入/输出对象域、数量完整的集合和可证实身份绑定；不唯一时保留未决。
- `predicate-semantics.mjs`、`argument-evidence.mjs`：局部状态补语、完整对象域、对象—关系—作用域与精确来源证据。Proof 使用实际关系和来源，不从最终槽位反推。
- `retained-contracts.mjs`：保留已有前端正确识别的完成拒绝、分配/限定对象域、引用定位和真实来源歧义，避免新候选覆盖旧语义。

所有新增 runtime 文件、递归依赖、模型文件和验证协议的摘要见 `CANDIDATE-FREEZE-r02.json`。Python 动态读取的原有模型描述 JSON 通过 `DYNAMIC-DEPENDENCY-INVENTORY.json` 补记；该清单是在最终冻结后发现的库存遗漏，不冒称初次冻结已完整记录它。

NLP 为真实 HanLP / spaCy；未启用 BGE/E5/NLI 混合通道或 LLM。没有调整模型、阈值或 Pack。任务内所有业务描述只作 Parser 输入，没有执行业务操作。

这不是普遍自然语言正确性的证明。最终独立变体暴露的三项同义表达和五项重试下界缺口见 `SHADOW-FIRST-DIVERGENCE.json`，本轮不使用这些失败调候选。
