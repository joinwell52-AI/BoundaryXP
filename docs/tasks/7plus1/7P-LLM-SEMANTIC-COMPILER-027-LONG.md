# 7P-LLM-SEMANTIC-COMPILER-027-LONG

## ADMIN 授权：按 v0.4 新方法重建自然语言 → 7+1 主链

**状态：全新长任务。旧 026 / 026E / 026F / 026G 保留为历史证据，不继续在旧架构上补丁。**

本任务的唯一产品目标：

> **输入 ADMIN 自然语言任务，使用 Codex 作为第一参考 LLM 语义解析器，自动生成来源可追溯的 Candidate Semantic Graph，经 NLP 辅助取证、Coverage、Γ、Eligibility、Boundary IR 和确定性投影，得到正确的 Root Canonical 7+1。**

当前规范：

`docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md`

仓库：

`joinwell52-AI/BoundaryXP`

唯一工作及推送分支：

`review/7plus1-parser`

新实现根：

`research/7plus1-parser/v0.4-llm-semantic-027/`

新报告根：

`docs/reports/7plus1/7P-LLM-SEMANTIC-COMPILER-027-LONG/`

---

# 1. 方法冻结：这次不是 NLP + 规则拼语义

正式主链：

```text
ADMIN 原文
↓
Source Preservation + Typed Recognizer
↓
Codex / LLM Semantic Parser
↓
Candidate Semantic Graph
↓
独立 Coverage Auditor
↓
HanLP / spaCy / SRL / SDP / DEP / CON / NLI 辅助证据
↓
Γ：CERTIFIED / REJECTED / TYPED_UNRESOLVED
↓
Eligibility
↓
Boundary IR
↓
Deterministic 7+1
↓
Proof / Coverage
```

必须遵守：

- Codex 是主语义候选生成器；
- NLP 降为辅助证据，不再用几十个构式模块重建完整语义；
- Codex 不直接输出权威 7+1；
- Codex 不直接认证授权边界；
- Γ 不重新成为字符串模板自然语言解析器；
- 未说明的信息不得补造；
- 合理歧义必须保留竞争解释或未决。

---

# 2. 先建立模型无关 SemanticParserPort

实现稳定接口，不把 BoundaryXP 绑定死在 Codex：

```text
SemanticParserPort.parse(source, typed_spans, structure) -> CandidateGraphProposal
SemanticParserPort.audit(source, candidate_graph) -> CoverageAudit
```

Provider 至少支持：

```text
codex-local
replay
mock-for-tests
```

未来 Qwen / DeepSeek / Doubao 只能通过同一 Port 接入，不改 Candidate Graph / Γ / 7+1 合同。

禁止把 provider/model 名写进语义规则。

---

# 3. Codex 参考 Provider

优先使用用户当前已认证的本地 Codex 运行能力，不要求 OpenAI API Key。

执行前真实探测：

```text
codex --help
codex exec --help
```

以及当前可用的本地 Host/CLI 能力。

不得假设命令行参数；只使用实际帮助中存在的能力并封存版本和命令。

## 3.1 自动模式

如果本地 Codex CLI / Host 支持非交互执行：

- 在独立临时工作目录运行；
- 该目录只提供：
  - 原文；
  - strict output schema；
  - v0.4 candidate contract 摘要；
- 不复制 Gold、断言、case 根因报告、旧输出或期望 7+1；
- 尽可能使用受限文件访问/sandbox；
- 保存 exact command、Codex version、model configuration、stdout/stderr/exit code。

## 3.2 外部批处理降级

如果当前 Codex 无法被程序自动调用，可以实现 request/response JSONL 文件协议，并由本次 Codex 执行会话按同一固定 prompt 生成 response bundle。

这种模式标记：

`EXTERNAL_CODEX_BATCH`

不能称完全自动运行。

最终 PASS 需要可自动调用 Provider；否则最多 PARTIAL / ENV_BLOCKED，具体按真实原因报告。

---

# 4. LLM 输入与输出：只做语义，不填 7+1

Parser Prompt 输入：

- 原始 ADMIN 文本；
- document/sentence/clause IDs；
- protected typed spans；
- node/relation/expression 有限合同；
- source grounding 规则。

不得提供：

- I/O/A/P/R/V/C/B 的期望答案；
- benchmark Gold；
- case-specific 根因；
- 旧 parser 输出；
- “这条应该怎么修”的提示。

输出必须是严格结构化数据。

至少：

```text
nodes[]
  id
  type
  source_quote
  clause_id
  occurrence/context_anchor
  semantic_identity
  discourse_layer
  modality (如 EVENT)
  alternative_group_id

relations[]
  type
  head
  tail
  source_quotes[]
  ownership
  alternative_group_id

expressions[]
  kind
  operands
  owner
  source_quotes[]

unresolved[]
  kind
  alternatives
  source_quotes[]

coverage[]
  source_region
  disposition =
    BOUNDARY_SEMANTIC
    NON_BOUNDARY_CONTEXT
    AMBIGUOUS
    UNPARSED
```

LLM 不负责计算字符 offset。

---

# 5. Deterministic Source Linker

实现 source quote → 精确码点 span。

规则：

1. quote 必须是原文精确子串；
2. 重复 quote 必须用 clause_id / occurrence / context_anchor 消歧；
3. 找不到或多义不可唯一时不得猜 offset；
4. 抽象 STATE 可以引用多个真实 source spans；
5. 所有 candidate relation 必须能回溯到至少一个真实来源；
6. 不允许 LLM 改写后的 paraphrase 冒充 source quote。

指标：

```text
invented_source_quote = 0
invalid_source_span = 0
silent_ambiguous_alignment = 0
```

---

# 6. 两次职责分离的 Codex 调用

## Pass A — Semantic Parser

独立生成完整候选语义图。

必须回答：

- 谁做什么；
- 对什么做；
- 产生什么；
- 给谁；
- 依据什么；
- REQUIRED / PERMITTED / NOT_REQUIRED / FORBIDDEN；
- 条件和作用范围；
- 主句 / 条件 / 定语 / 补语 / 目的 / 引用 / OUTPUT_CONTENT / 背景；
- 指代和同一性；
- 竞争解释与未指定内容。

## Pass B — Coverage Auditor

使用独立 prompt 和上下文。

输入只有：

- 原文；
- Pass A 候选图；
- schema / audit contract。

输出：

- missed_semantics；
- unsupported_candidates；
- wrong_binding_suspicions；
- scope/modality conflicts；
- false promotion；
- ambiguity collapsed；
- source coverage gaps；
- optional additional candidate proposals。

Auditor 不能修改最终 7+1，也不能直接认证。

同一 Codex 两次一致只是证据之一，不等于真值。

---

# 7. NLP 只做辅助证据

复用现有：

- HanLP/spaCy；
- SRL；
- SDP；
- dependency；
- constituency；
- typed recognizer；
- BGE/E5（如已有稳定调用）；
- NLI/XNLI（已有候选命题时）。

NLP Evidence Adapter 只允许：

```text
SUPPORT
CONTRADICT
NO_EVIDENCE
```

不得用 NLP 再生成一套平行 Candidate Graph。

若 NLP 与 Codex 在会改变边界的事实上强冲突：

- 保留竞争；
- Γ 不得仅按 Codex confidence 认证；
- 必要时 TYPED_UNRESOLVED。

---

# 8. v0.4 Γ：从头收敛职责，不迁移旧自然语言补丁

新建 v0.4 Γ，不直接复制旧 026 的大量构式语义修补。

可以复用有限合同和通用确定性约束：

- Node/Relation signature；
- source grounding；
- discourse domain；
- participant eligibility；
- artifact role；
- basis/reference；
- modality/polarity；
- scope/condition ownership；
- quantity target；
- coreference；
- competition/cardinality；
- contradiction；
- evidence provenance；
- graph consistency。

禁止 Γ 使用 case ID、benchmark 实体、固定句子答案。

禁止通过越来越多字符串规则重新实现 Semantic Parser。

任何新增 Γ 规则必须回答：

```text
它验证什么不变量？
为什么这是认证，而不是自然语言理解？
```

---

# 9. Coverage：必须同时防幻觉和防遗漏

正确性定义不是“输出的都对”，而是：

```text
没有无依据事实
AND
没有漏掉明确边界事实
AND
真实歧义正确保留
AND
未指定内容不补造
```

每个 source region 必须归入：

- 已解析边界语义；
- 明确非边界上下文；
- typed unresolved；
- parser coverage failure。

不能用 ABSENT 掩盖漏解析。

---

# 10. 评测数据与隔离

不新建训练集，不训练。

复用已有 350 份已暴露材料：

- Root-050：50；
- Natural-100：100；
- 025 暴露开发集：200。

## 10.1 固定开发 / 锁定评测划分

在第一次 Codex parser 调用前，按 case ID 确定性划分并封存：

开发集：
- Root 35；
- Natural 70；
- exposed200 140；
- 共 245。

锁定评测：
- Root 15；
- Natural 30；
- exposed200 60；
- 共 105。

划分算法及 ID 在任何 prompt/schema 调整前冻结。

Parser Provider 的工作目录和 prompt 不得包含：

- Gold；
- assertions；
- expected slots；
- root-cause report；
- case-level repair note。

锁定105在方法冻结前不得用于调 prompt / schema / Γ。

它不是独立外部盲测，只是防止本任务内部持续追105条结果调优。

---

# 11. 先评语义图，再评 7+1

每个案例分别评：

### A. Source Semantic Graph

- semantic node recall；
- predicate-argument precision/recall；
- actor/object/result/recipient/basis binding；
- modality；
- condition/scope；
- hierarchy/discourse；
- coreference；
- quantity target；
- unsupported relation；
- false business-action promotion；
- missing clear semantic；
- ambiguity handling；
- source grounding。

### B. Certified Boundary

- Γ false certification；
- Γ false rejection；
- typed unresolved correctness；
- eligibility correctness。

### C. Canonical 7+1

- Root semantic closure；
- wrong binding；
- unsupported RESOLVED；
- false ABSENT；
- proof/coverage gaps。

不得只报最终槽位，必须指出错误首次出现在哪层。

---

# 12. Prompt / Schema / Policy 调整预算

允许 Codex 自主完成完整长任务，但禁止无限试错。

开发集最多允许：

- 4 次 Parser prompt/schema 主要版本；
- 3 次 Coverage Auditor 主要版本；
- 3 次 Γ evidence policy 主要版本。

纯 bug / schema 序列化修复不计入语义版本，但必须记录。

每个版本必须：

1. 先写假设；
2. 指定预期改善类别；
3. 跑完整245开发集；
4. 报新增正确、丢失正确、新增错误；
5. 至少验证跨表面形式的变化；
6. 不允许 case-specific prompt。

连续两版没有净改善，停止该方向。

---

# 13. 方法冻结和锁定105

达到开发集最佳稳定版本后：

1. freeze implementation SHA；
2. freeze parser prompt SHA；
3. freeze auditor prompt SHA；
4. freeze schema SHA；
5. freeze Γ policy SHA；
6. 才第一次运行锁定105；
7. 保存原始 Codex response 后再评测；
8. 看完105后不得在027中修改方法再重跑覆盖首次结果。

如果105失败：

`LLM_SEMANTIC_COMPILER_027=EVAL_FAILED`

保留真实失败，停止，不针对105调优。

---

# 14. 350份完整开发闭合

锁定105执行后，为了交付完整开发结果，可以汇总：

- 245开发集冻结版本输出；
- 105锁定首次输出。

不得把105失败修掉后重新声称首次350结果。

分别报告：

```text
Root-050
Natural-100
exposed200
```

以及所有语义错误类别。

---

# 15. PASS 标准

只有同时满足以下条件，才能：

`LLM_SEMANTIC_COMPILER_027=PASS`

1. Codex Provider 从 raw text 自动运行；
2. LLM 不直接输出权威7+1；
3. invented_source_quote = 0；
4. invalid_source_span = 0；
5. unsupported certified semantic = 0；
6. wrong binding = 0；
7. clear semantic miss = 0；
8. false business-action promotion = 0；
9. clear source unresolved = 0；
10. 真实歧义保持 unresolved；
11. Root-050 = 50/50；
12. Natural-100 = 100/100；
13. exposed200 确认语义缺陷 = 0；
14. Coverage gap = 0；
15. Proof gap = 0；
16. pre-Γ destructive final adjudication = 0；
17. full regression = 0 FAIL；
18. 无 case/entity/sentence hardcoding；
19. 生产入口未切换；
20. 锁定105首次评测满足同一语义验收标准。

PASS 只证明当前已检验范围，不声称所有自然语言已解决。

---

# 16. 其他终态

允许：

```text
LLM_SEMANTIC_COMPILER_027=PASS
LLM_SEMANTIC_COMPILER_027=PARTIAL
LLM_SEMANTIC_COMPILER_027=EVAL_FAILED
LLM_SEMANTIC_COMPILER_027=ENV_BLOCKED
LLM_SEMANTIC_COMPILER_027=ADMIN_BLOCKED
```

PARTIAL：
- 方法有跨类别显著改进；
- 但仍有明确语义缺陷；
- 提供真实边界，不无限补丁。

ENV_BLOCKED：
- 当前本地 Codex 无法自动被调用或必要运行能力不可用；
- 必须记录实际探测和失败；
- 不把环境阻塞冒充方法 FAIL。

ADMIN_BLOCKED：
- 仅真实规范冲突或需要 ADMIN 决定的语义边界。

---

# 17. 必须交付

代码至少包括：

```text
semantic-parser-port
providers/codex
source-linker
typed-recognizer adapter
parser prompt
coverage auditor prompt
candidate graph schema
nlp evidence adapter
gamma-v04
eligibility
boundary-ir
projection
proof
coverage
CLI / batch runner
evaluator
replay
```

用户可直接运行类似：

```text
boundx parse-boundary task.md --provider codex-local --json result.json
```

如果项目现有 CLI 命名体系不同，遵循现有体系，不强行增加错误入口。

报告至少：

- REPORT.md
- ARCHITECTURE.md
- PROVIDER-MANIFEST.json
- PROMPT-MANIFEST.json
- SCHEMA.json
- DEV-245.json
- LOCKED-105-FIRST-RUN.json
- SEMANTIC-METRICS.json
- BOUNDARY-METRICS.json
- CANONICAL-METRICS.json
- FAILURE-LEDGER.json
- MODEL-NLP-EVIDENCE-AUDIT.json
- SOURCE-GROUNDING-AUDIT.json
- COVERAGE-AUDIT.json
- FULL-REGRESSION.json
- MANIFEST.json
- SHA256SUMS.txt
- SEAL.json
- SEAL-VERIFICATION.json

原始 Codex request/response 需保留并可复现审计；不得包含凭据。

---

# 18. 提交、推送、停止

只推送：

`review/7plus1-parser`

禁止：

- merge；
- release；
- tag；
- production switch；
- 修改 026E/026F 旧封存；
- 把 v0.3.1 历史证据改成 v0.4 PASS。

完成后：

`WAITING_ADMIN_REVIEW=true`

不要自动开始028。

---

# 一句话执行指令

> **停止用传统 NLP + 构式规则拼完整语义；按 v0.4 让 Codex 直接从 ADMIN 原文提出来源可追溯的候选语义图，NLP 只做辅助取证，Coverage 查漏，Γ 只做确定性认证，再投影 7+1；把这条新主链在现有350份材料上完整实现、冻结、验证并交付，不能直接让 Codex 填最终7+1，也不能针对锁定105调优。**
