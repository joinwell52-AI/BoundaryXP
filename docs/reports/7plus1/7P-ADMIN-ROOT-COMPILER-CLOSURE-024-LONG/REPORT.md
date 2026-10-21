# 7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG

`ADMIN_ROOT_COMPILER_024_LONG=PASS`，交付状态 `WAITING_ADMIN_REVIEW`。此 PASS 仅对应任务书的 Standard Root-050 闭环、候选图架构、回归及受保护 holdout 诊断要求，**不表示通用自然语言已经解决，也不表示生产就绪**。

执行基线为 `7c7864ddc319cf5ac490ca780b56bdb91b4c2184`；023 实现基线为 `a61f8bd8e04e9f63cbeda38dc75a2979363f5d9d`。方法、7+1/BXP 定义、模型、阈值、Pack、历史 Gold 和旧封存均未改变。

## 最终结果

| 检查 | 实际结果 |
|---|---|
| Root-050 逐条来源语义闭环 | 50/50；源文独立审阅，ADMIN 复核待定，不是盲测 Gold 准确率 |
| Root-050 缺失节点、明确候选、错误绑定、错误 RESOLVED、明确源文未决、false ABSENT、操作符业务化、proof/来源问责缺口 | 各 0 |
| G1–G12 | 全部 PASS，50 条真实模型重放均 0 violations |
| 旁路认证 | NLP/Native/Model 直接认证及直接生成最终槽位/Fact 均 0 |
| 专项与构式变体 | 124 PASS / 0 FAIL / 0 SKIP |
| 历史 REF-N1 / ROLE-P2 / ROLE-N2 所在专项 | 37 PASS / 0 FAIL / 0 SKIP |
| 最终全量回归 | 6,612 tests：6,595 PASS / 0 FAIL / 17 SKIP；SKIP 逐项列于 FULL-REGRESSION.json |
| 实际模型重复性 | 6 条重复 Canonical/IR/Relation/Γ/Proof 一致；时钟和诊断浮点不作语义差异 |
| 隔离 58618 检查 | 实际解析 1 次；JSON/HTML/Markdown 导出相同快照，不重复解析；检查后关闭 |

Root-050 的候选节点 1,433、候选关系 1,252、候选表达式 822；Γ 认证关系 878、拒绝 374、typed-unresolved 0。每一已认证关系都有候选及 Γ 决策，候选来源缺口 0。这些数量是架构证据，闭环依据是 `ROOT-050-SOURCE-SEMANTIC-LEDGER.json` 的逐条原文、论元、作用域、条件、事实与证明链。

## 实际修改及入口

新增 `research/7plus1-parser/v0.3-admin-root-024/` 候选编译实现和 `tests/parser-admin-root-024.test.mjs`。链路为真实 HanLP/spaCy + Typed Recognizers → 深冻结候选图 Gc → Γ → Eligibility → BoundaryIR → 原有确定性 Q → Proof/Coverage。

通用修复涵盖名词范围及论元、支撑/组织谓词归属、被动与复合谓词、来源角色/收件人、版本依据、局部条件及否定分支、数量目标、ALL/ANY 与 AND/OR、列表/冒号内容归属、文档指代、停止/恢复引用、只读/仅限与局部方法修饰。`MIGRATION-CONTRACT-MAP.json` 列出旧机制来源、函数、不变量和候选化方式。所有跨层依赖、源 span 与候选来源均保留；没有按最终答案补槽或从 legacy 7+1 反推。

为关闭原有三条回归失败，按照任务书第 18 节修改了 021 的 `lexical.mjs`、`root-frames.mjs`、`roles.mjs` 共三份活动源文件，9 行新增、1 行替换；旧报告和封存字节未改。修复采用解释谓词、英文已产生/创建构式及源文类型化角色/引述隔离，不按测试 ID 或实体特判。

生产 `npm run 7plus1` / `npm run 7plus1:ui` 的 package scripts 未切换到 024。024 的 CLI 与隔离 UI 共用 `parse7Plus1()`；58618 验证是临时隔离通道，不是上线。

## 模型、冻结与泛化结果

实际使用冻结的 HanLP/spaCy、BGE-M3、multilingual-E5-large、mDeBERTa-MNLI-XNLI。L1 `core-ontology@1.1.0`、L2 `software-ai@0.2.0` 不变；L3 NOT_SELECTED，LLM NOT_USED，mDeBERTa-v3-base 主路径禁用。模型输入/输出、路径、manifest digest、候选证据与 Γ 检查在完整 Trace 和 `MODEL-EVIDENCE-AUDIT.json` 中；44 条归一化决策实际消费模型交叉证据，没有让模型分数直接认证边界。

非 Gold 预验证在 Root50 模型重放前完成。最终 Root50 为 fresh-model `root-model/r04`，50 条实际运行无错误且实现漂移为 0；开发重放的缓存 NLP 输出不冒充 fresh-model 最终验收。实现在首次读取 Natural100 前冻结，摘要：

`1fd5e85f2d8bfc8dac6564741ea71745f15439ed4f3b8e49e8a1dc2f6dd19966`

冻结记录覆盖 288 份代码/规则/Schema/Pack/协议文件及 136 份模型文件；交付前再次逐字节核对模型。Python 清单额外包含一个不被 Parser 调用的历史 `seal.py`，其原始字节以 `frozen-auxiliary-source-artifacts/p0-seal.py` 保留；不把该用户原有未跟踪历史文件混入活动代码提交。详情见 `PRESERVATION-AUDIT.json`。

**Natural-100 首次运行：100 条输出 / 0 runtime error；不能声称语义 100/100。** 原文、全部原始 Trace 与错误回执在只读审阅前独立封存。人工来源复核的 Case 数如下，类别可重叠：

| Natural-100 只读诊断 | Case 数 |
|---|---:|
| 确认的明确源文语义遗漏 | 78 |
| 包含错误 RESOLVED | 30 |
| 包含错误绑定 | 32 |
| 5 条歧义对照中正确的 typed ambiguity unresolved | 1 |
| proof 或 coverage 缺口 | 15（coverage 15；已认证来源证明链缺口 0） |
| 本次审阅未确认缺陷 | 22；不是 22 条盲测通过 |

Natural100 下一首处分歧为 `NROOT-001` 的候选生成：组织/负责关系被业务化，QA 独立复核/角色候选缺失，随后 Γ 错误接纳。共性缺口还包括“本次任务要求”的模态传播、局部输入和交付、条件批准/完成范围、英文否定名词与被动、数量目标、负角色/指代、混合语言。`NATURAL-100-DIAGNOSTIC.json` 包含全部 100 条原文、精确证据、实际 Canonical、Facts、候选、Γ、表达式、Gu 和逐条理由。

歧义对照中，`NROOT-098` 的版本竞争确有 typed unresolved；`096/097/099/100` 不能因为有 unresolved 就算通过。例如 099 条件读取被认证却丢失审批条件，097 的 UNKNOWN_REFERENT 被退休为普通 ENTITY。以上均如实保留，**看到 holdout 后没有修改实现或重新跑到通过**。

## 证据与交付范围

最终 Root50、Natural100、重复性和通道 Trace 直接保留。71 轮开发及前三轮模型重放、两轮预验证的全部原始证据通过 76 个无损 ZIP 交付，`RAW-EVIDENCE-ARCHIVE-INDEX.json` 列出全部 7,558 个成员及 SHA-256；原始失败未覆盖，本地原目录仍保留。报告中指向 `development/rNN/` 等路径的早期证据可从相应 ZIP 在本报告目录还原。

`LONG-RUN-ITERATION-LEDGER.json` 记录每轮不可变实现摘要、文件差异、原始结果、首个失败断言、机制类别及专项/全量回归证据；`ROOT-050-FIRST-DIVERGENCE-HISTORY.json` 保存分歧历史。早期来源断言数量由冻结输出进行只读回溯重评，明确标记为 retrospective，不冒充当时人工审定；个别只读审阅脚本兼容错误及后续补正也保留。最终完整语义审定以 fresh-model r04 来源账本为准。

原有用户工作区改动未回滚、未混入本提交；所有受保护的历史文件、Source、Gold、方法、Schema、Pack 和生产入口均核对不变。MANIFEST、SHA256SUMS、SEAL 和 SEAL-VERIFICATION 覆盖本轮实际交付，Git blob 也核对同一 SHA-256。

```ini
ADMIN_ROOT_COMPILER_024_LONG=PASS
WAITING_ADMIN_REVIEW=true
BOUNDX_PRODUCTION_READY=false
GENERAL_NATURAL_LANGUAGE_SOLVED=false
MERGE=false
RELEASE=false
TAG=false
PRODUCTION_ENTRY_SWITCH=false
START_025=false
```

完成后仅推送 `review/7plus1-parser`，停止等待 ADMIN Review。最终提交 hash 由交付回执返回，避免把自身 commit 写进自身摘要形成循环。
