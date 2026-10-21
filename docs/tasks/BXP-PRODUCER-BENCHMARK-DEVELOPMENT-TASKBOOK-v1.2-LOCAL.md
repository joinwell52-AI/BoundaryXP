# BXP Producer Benchmark 开发任务书 v1.2（本地优先 / 无 GitHub 依赖版）

更新：2026-09-16  
状态：**READY_FOR_ADMIN_AUTHORIZATION / 开发任务书，非验收完成报告**  
仓库：`joinwell52-AI/BoundaryXP`  
唯一实施目录：`D:\boundx`  
记录的上游基线：`db6298990717c613ae5dc4cfb384c5ace3cc2090`；实际执行以本地 `D:\boundx` 当前任务分支与其本地 Git 提交记录为准  
产品基线：`1.3.0-preview.0`  
当前已实现线上合同：BXP-0001 `0.3.0-draft.2` / BXP-CALC `1.0.0-draft.3`  
目标协议：BXP-0001 `0.4.0-draft.1`  
L1：`core-ontology@1.1.0`  
L2：`software-ai@0.2.0`  
决定主体：ADMIN  

## 立即生效的执行环境决定

本任务 **不得依赖 GitHub Actions、GitHub Artifacts、GitHub Codespaces 或任何 GitHub 计费运行资源**。

当前开发、测试、Gold 评测、三路线实验、研究证据、回归、性能测试和最终验收全部在本机 `D:\\boundx` 完成。

固定原则：

```text
Local-first
Offline-capable
No GitHub Actions dependency
No GitHub artifact dependency
No cloud CI required for completion
```

GitHub 仅可在 ADMIN 之后明确要求时作为**代码镜像/人工审核载体**使用；GitHub 不得成为任何 Gate、测试、证据、验收或发布前置条件。即使 GitHub 完全不可用，本任务仍必须能够从 T01 连续完成到最终本地交付。

本任务不得为了获得 CI 绿灯而触发、等待或消费 GitHub Actions 分钟数；不得把大型实验结果上传为 GitHub Actions artifact。

来源主稿：Codex `BXP-PRODUCER-BENCHMARK-DEVELOPMENT-PLAN.md`，SHA-256：`67535675296d5a9cf42fda389cc83bc76d03566816610cb2afb382dd98bf53fb`。  
本 v1.1 经协议一致性、Gold、L3、Producer 公平性、许可证、研究方法、论文证据链和实施顺序审核后修订。原主稿必须保留，不覆盖。

---

# 0. 两条总原则

## 0.1 协议线：连续

BXP 协议不是重新开始。

当前上位规范是 BXP-0001 `0.4.0-draft.1`，实现必须与其吻合：

```math
\text{Task Semantics}
\rightarrow
IR_{7+1}
\rightarrow
FormalBoundaryModel
\rightarrow
BoundaryResult
\rightarrow
Admission
\rightarrow
DownstreamConformance
```

固定解释：

- 7+1 是标准语义 IR，不是协议终点；
- Formal Boundary Model 是可计算的形式模型；
- Boundary Result 是最终确定边界对象；
- Admission 是正式任务强制准入；
- Host 必须 fail-closed；
- `business_decision = null`；
- `execution_authorization = null`；
- Admission 不等于执行授权。

现有 0.3 实现只作为历史实现与兼容回归，不得反向定义 0.4，也不得只改版本号冒充 0.4。

## 0.2 研究线：全部从零开始

**从本任务开始，研究评价重新建立基线。**

以下历史材料：

- 旧 30 用例；
- 旧 120 用例；
- 旧 150 / 补跑；
- 旧 LLM/spaCy/HanLP 结果；
- 旧准确率；
- 旧评分；
- 旧“通过率”；
- 旧实验结论；

全部标记：

```text
HISTORICAL_NON_BASELINE
```

可以保留、引用、做历史比较，但**不得进入本次正式研究统计**。

正式研究只从以下顺序开始：

```text
Gold Candidate
→ ADMIN Review
→ ADMIN_GOLD_FROZEN
→ BXP 0.4 Implementation Freeze
→ Producer Benchmark
→ Stability Runs
→ Error Analysis
→ Paper Evidence
```

因此：

> 协议继承，研究清零。

---

# 1. 新研究基线：Core 100 + L3 100

## 1.1 原始制品

| 基线 | 用途 | SHA-256 |
|---|---|---|
| `BXP-0.4-CORE-GOLD-100.zip` | BXP Core Gold 候选 100 | `7583f5f77146b76b7cb2a9974e629a3f2de05c61fee0a271efc1e216b3352087` |
| `BXP-0.4-L3-GOLD-100.zip` | BXP + Enterprise L3 Gold 候选 100 | `d0f9d58f1cbc457a05ee51147c358f4026d4595ef5cb4f07741932ed62bb31c7` |

两套原 ZIP 必须以原字节保存到：

```text
research/bxp-0.4/source-artifacts/
```

不得原地修改。

## 1.2 200 个 case 的结构

Core 100：

- Semantic IR / Ambiguity：25
- Formal Boundary Model：25
- Boundary Result：25
- Admission / Version / Downstream：25

L3 100：

- Identity / Organization：25
- Job / Grade / Authority：25
- Delegation / Policy / Temporal：25
- L3 Version / Admission / Downstream：25

合计：

```math
100_{Core} + 100_{L3} = 200
```

---

# 2. Gold Freeze Gate

两套 Gold 当前都只能叫：

```text
GOLD_CANDIDATE_FOR_REVIEW
```

不能因为 ZIP 完整、JSON 可读、case 数量正确，就直接视为最终 Gold。

## 2.1 必须审定

T02 必须逐 case 审核：

- 原文是否足以支持 Producer 端到端测试；
- 7+1 Gold 是否唯一；
- Formal Model 是否与原文一致；
- 数学断言是否可执行；
- Boundary State 是否正确；
- Admission 是否正确；
- Downstream conformance 是否有完整对象；
- before/after case 是否同时具备版本快照；
- evidence span 是否已标注；
- expected digest 是否来自已冻结 canonicalization。

## 2.2 每个 case 必须增加适用层

审定台账必须包含：

```yaml
test_scope:
  producer: true|false
  ir: true|false
  formalization: true|false
  boundary: true|false
  admission: true|false
  downstream: true|false

producer_applicable: true|false
producer_input_complete: true|false
```

规则：

- `producer_applicable=false` 时，不得把该 case 算成 Producer 失败；
- 也不得从统计分母里静默删除，必须列 `N/A` 与原因；
- Formal/Core-only case 可以测试 Core，但不能冒充端到端 Producer case；
- Gold Formal Model 不能反推生成 Producer 输入。

## 2.3 Gold 缺陷处理

如果发现 Gold 自身问题：

```text
GOLD_DEFECT_CANDIDATE
```

处理方式：

1. 原 ZIP 不改；
2. 建 `reviewed-oracle/` overlay；
3. 记录 defect、理由和 ADMIN 决定；
4. 修订产生新 Gold version；
5. 已运行旧版 Gold 的实验不重写。

T02 通过后必须获得：

```text
ADMIN_GOLD_FROZEN
```

在此之前所有实验都只能是：

```text
PRE_GOLD_FREEZE
```

不得产生正式准确率结论。

---

# 3. L3 Enterprise Profile v2

L3 Gold 使用虚拟企业：

- 星衡智能科技有限公司 / Acme AI Systems Ltd.
- `com.acme-ai.enterprise@1.0.0`
- 24 名员工
- 10 条显式 authority binding
- 4 条 delegation
- 10 条 policy
- package digest：`9de990a5a197ba1abba79d1a7251e8be91c7aa479e31f75cf24fcb58e5aa8b17`

## 3.1 核心不变量

```math
Identity \neq JobTitle \neq Grade \neq Authority
```

```math
Authority(e,a,s,t)
\iff
ExplicitAuthorityBinding(e,a,s,t)
\lor
ValidDelegation(e,a,s,t)
```

明确禁止：

```math
JobTitle(e)=Manager
\not\Rightarrow
Authority(e,approve)
```

```math
Grade(e)=L4
\not\Rightarrow
Authority(e,approve)
```

```math
ManagerOf(x,y)
\not\Rightarrow
Authority(x)=Authority(y)
```

## 3.2 升级旧 L3 合同

旧任务书中的 L3 首版仅职员表，不含 authority / delegation / policy。

本任务必须显式定义新的：

```text
Enterprise L3 Profile v2
```

它允许声明式：

- employee identity
- alias
- department
- job title
- grade + track
- manager relation
- active/inactive
- employment type
- explicit authority binding
- delegation
- policy source/version
- temporal validity
- scope

不得静默扩展旧 schema。

---

# 4. 三条 Producer 路线

| 路线 | 定位 | 商用状态 |
|---|---|---|
| LLM | 高能力参考路线 | 取决于 provider / 服务合同 |
| spaCy | 本地 NLP 商用候选主路线 | 需核验具体 engine + model + data license |
| HanLP | 本地研究/测试/对照路线 | 默认 research-only，具体模型许可明确前不得进入商用默认路径 |

Gold 不是 Producer。

所有路线必须：

- 使用同一 source；
- 使用同一允许上下文；
- 使用同一 L1/L2；
- L3 suite 使用同一 L3 version + digest；
- 使用同一 BXP Core；
- 使用同一 evaluator；
- 不能看到 Gold expected output；
- 不得按 case ID 特判；
- 不得把 Gold 内容放进 prompt/context。

NLP 不得调用 LLM 补答案。

---

# 5. 本地 NLP 统一适配合同

spaCy 与 HanLP 不得各自复制 7+1 业务逻辑。

必须使用统一 Local NLP Provider Contract：

```text
source text
+ allowed semantic context
+ provider config
↓
local NLP observations
↓
shared semantic compiler / mapper
↓
Producer Candidate Contract
↓
BXP local validation
```

推荐本地进程接口：

```text
Node
→ strict JSON stdin
Python NLP process
→ strict JSON stdout
logs
→ stderr
```

要求：

- 不自动联网；
- 不自动下载模型；
- 不把 traceback 混进 stdout；
- tokenizer index 不得冒充 Unicode code-point evidence；
- evidence 最终必须重新定位原文；
- 模型未识别 ≠ 原文不存在；
- shared mapper 必须版本化；
- route-specific 修复必须披露，禁止 case-specific hardcode。

---

# 6. BXP 0.4 Wire Contract 与实现

正式 benchmark 之前必须实现 0.4。

## 6.1 Wire Contract Freeze

形成：

```text
BXP-0.4-WIRE-CONTRACT-MATRIX.md
```

必须冻结：

- 0.4 task schema
- Formal Model representation
- Boundary Result schema
- Boundary State
- canonical serialization
- boundary digest
- Admission record
- Admission binding
- operator profile identity
- L1/L2/L3 version binding
- 0.3/0.4 coexistence
- CLI/MCP/UI version dispatch

旧输入不得静默升级。

## 6.2 Formalizer

必须记录：

```text
formalizer_version
formalizer_digest
```

Formalizer 不得补造未知事实。

## 6.3 Operator Profile

必须记录：

```text
operator_profile_version
operator_profile_digest
```

算子为机制，不是协议核心。

同一：

```math
(M,O_v)
```

必须得到同一：

```math
B
```

## 6.4 Boundary State

固定：

```text
determined
underdetermined
inconsistent
invalid
```

---

# 7. Admission Binding

Admission 必须绑定精确事实源。

规范 identity 至少包含：

```math
D_A =
Hash(
ProtocolVersion,
Profile,
D_S,
D_{IR},
D_M,
FormalizerVersion,
OperatorProfileVersion,
D_B,
D_{L1},
D_{L2},
D_{L3}
)
```

Core suite：

```math
D_{L3} = null
```

L3 suite：

```math
D_{L3} = exact\ package\ digest
```

任何一个绑定项改变：

```math
D_A^{current} \neq D_A^{admitted}
\Rightarrow
Release=blocked
```

必须测试：

- ADMIN source change
- IR change
- Formal Model change
- formalizer change
- operator profile change
- L1 change
- L2 change
- L3 change
- employee status change
- authority revoked
- policy digest change
- delegation expiry
- stale cache
- UI PASS but binding mismatch

---

# 8. 旧 0.3 的定位

旧 0.3 不再作为 0.4 Gold 准确率基线。

但它仍必须作为：

```text
BACKWARD_REGRESSION
```

最终报告同时列：

```text
0.3 historical regression: PASS/FAIL
0.4 Core Gold: metrics
0.4 L3 Gold: metrics
```

不得为了 0.4 把 0.3 历史兼容行为破坏掉。

---

# 9. 研究从零开始的证据目录

```text
research/bxp-0.4/
  README.md

  source-artifacts/
    BXP-0.4-CORE-GOLD-100.zip
    BXP-0.4-L3-GOLD-100.zip

  protocol-baselines/
  implementation-baselines/

  gold/
    core-100/
    l3-100/

  l3/
    com.acme-ai.enterprise/

  producers/
    llm/
    spacy/
    hanlp/

  licenses/

  runs/
    <run-id>/

  comparisons/
  metrics/
  error-analysis/

  paper-evidence/

  holdout/
    SEALED_NOT_FOR_DEVELOPMENT/
```

以前的研究结果放：

```text
research/historical/
```

或原历史目录，统一标记：

```text
HISTORICAL_NON_BASELINE
```

---

# 10. Run 合同

每个 run 独立、不可覆盖。

例：

```text
RUN-20260916T160000+0800-SPACY-CORE100-R01
```

至少包含：

```text
RUN.json
environment.json
model.json
license-snapshot.json
inputs-manifest.json
raw/
candidates/
assembled/
formal-models/
boundary-results/
admission/
gold-diff.json
metrics.json
MANIFEST.json
```

`RUN.json` 至少记录：

```text
repository_commit
dirty_worktree_state
source_snapshot_digest

protocol_version
protocol_digest

gold_set
gold_version
gold_digest
gold_review_ledger_version

l1_version + digest
l2_version + digest
l3_version + digest | null

producer_route
producer_adapter_version

requested_model
actual_model
model_version
model_digest
provider

prompt_version
prompt_digest
parameters_digest

semantic_mapper_version
formalizer_version
formalizer_digest

operator_profile_version
operator_profile_digest

evaluation_time
started_at
completed_at

random_seed_if_any
repeat_index

environment
status
failure_reason
```

如果 provider 不公开精确模型权重：

```text
model_version = provider_not_disclosed
```

不得伪造可复现性。

---

# 11. 失败与重试

失败必须保存：

```text
CASE-042/
  attempt-01/
    status=FAILED
  attempt-02/
    status=SUCCESS
```

禁止：

- 用 attempt-02 覆盖 attempt-01；
- 只保留最好一次；
- 删除 timeout；
- 删除 parse error；
- 用另一条路线结果补空缺；
- 用 Gold 填 predicted output。

---

# 12. 正式研究实验设计

## 12.1 Exploratory Runs

Gold Freeze 前允许探索：

```text
PRE_GOLD_FREEZE
```

不计正式指标。

## 12.2 Primary Benchmark

Gold Freeze + BXP 0.4 implementation freeze 后：

```math
200\ cases \times 3\ routes = 600
```

即 600 个 case-route primary runs。

## 12.3 Stability Benchmark

正式稳定性实验：

```math
200\ cases \times 3\ routes \times 3\ repetitions = 1800
```

如果 Primary 与 Stability 都执行，总记录为：

```math
600 + 1800 = 2400
```

最终报告必须分别写：

- Primary 600
- Stability 1800

不能统称“600 项”后又声称每项跑了 3 次。

---

# 13. 正式 benchmark 的实施顺序

允许先建设 T03/T04 harness。

允许在 0.4 未完成时保存：

```text
PRE_IMPLEMENTATION
```

候选输出。

但**正式 0.4 benchmark 必须在以下全部通过之后执行**：

```text
ADMIN_GOLD_FROZEN
→ BXP_0_4_WIRE_CONTRACT_FROZEN
→ FORMALIZER_FROZEN
→ OPERATOR_PROFILE_FROZEN
→ L3_PROFILE_FROZEN
→ ADMISSION_GATE_PASS
→ PRIMARY_BENCHMARK
```

因此早期路线结果不能冒充 0.4 正式实验。

---

# 14. 指标体系

必须按：

- Core/L3
- route
- group
- applicable/N/A
- successful/failed
- covered/uncovered

分别报告分子和分母。

## 14.1 Semantic

- element Precision
- element Recall
- element F1
- slot-level micro/macro
- resolved/unresolved/absent accuracy
- confusion matrix
- evidence exact span
- false resolution
- missed forbidden boundary

## 14.2 Formalization

- entity identity
- scope
- modality
- negation
- numeric
- temporal
- logical
- relation
- authority
- delegation
- canonical constraint match

## 14.3 Boundary Result

- Boundary State Accuracy
- confusion matrix
- canonical Boundary diff

## 14.4 False Determination Rate

主 FDR：

```math
FDR=
\frac{
\#(Prediction=determined \land Gold\neq determined)
}{
\#(Gold\neq determined)
}
```

同时拆：

```text
FDR-underdetermined
FDR-inconsistent
FDR-invalid
```

FDR 分子非零必须逐例进入高优先级 error analysis。

## 14.5 Admission

- Admission Accuracy
- admitted precision/recall
- blocked precision/recall
- stale detection
- binding mismatch detection
- false reject
- false admit

## 14.6 False Admission Rate

```math
FAR=
\frac{
\#(Prediction=admitted \land Gold=blocked)
}{
\#(Gold=blocked)
}
```

FDR 与 FAR 不得被总 F1 掩盖。

## 14.7 性能

- cold start
- warm run
- model load
- NLP inference
- semantic mapping
- formalization
- Core evaluate
- total wall time
- median
- p95
- peak RSS（可可靠获取时）

---

# 15. 许可证门禁

不能写“只有 MIT 才能商用”。

商业候选判据应为：

```text
commercial-use-permitted
AND
redistribution-compatible-with-product-distribution
```

必须分别核验：

- framework license
- model license
- model data / training data license（可得时）
- dictionary/license
- dependency license
- redistribution restrictions

建立：

```text
research/bxp-0.4/licenses/
  NLP-LICENSE-MATRIX.json
  NLP-LICENSE-MATRIX.md
```

字段至少：

```text
engine
engine_version
engine_license

model
model_version
model_digest
model_license

model_source

commercial_use
redistribution
research_only

evidence
checked_at
notes
```

固定处置：

### spaCy

```text
commercial_candidate = true
```

但 exact model 未核清前：

```text
commercial_eligible = unknown
```

### HanLP

默认：

```text
research_only = true
commercial_eligible = false
```

除非 exact model license 有明确商业证据。

HanLP 研究模型不得进入商业发布包。

---

# 16. Paper Holdout

Core 100 + L3 100 会参与开发、修复、错误分析。

因此它们属于：

```text
DEVELOPMENT + CONFORMANCE BENCHMARK
```

不能在未来论文中假装成完全未见测试集。

必须增加：

```text
PAPER_HOLDOUT / SEALED_CHALLENGE_SET
```

规则：

- 在 Producer 适配和 0.4 实现基本冻结后制作；
- 开发期间 Producer/规则作者不可见 expected output；
- Holdout 不用于调参；
- 不根据 Holdout case 增加特判；
- 单独版本化、摘要化、封存；
- 最终论文主泛化结论优先报告 Holdout；
- 200 Gold 用于开发/conformance 报告。

这条从现在开始写进研究方法，避免未来测试集污染。

---

# 17. 错误归因

每个错误至少归入：

```text
SEMANTIC_RECOGNITION
SEGMENTATION
ENTITY_SPAN
DEPENDENCY_SRL
NEGATION
CONDITION
ANAPHORA
ELLIPSIS
AMBIGUITY
NUMBER_TIME_UNIT
7PLUS1_MAPPING
EVIDENCE
IDENTITY
L3_AUTHORITY
DELEGATION
FORMALIZATION
OPERATOR
BOUNDARY_AGGREGATION
ADMISSION_BINDING
DOWNSTREAM_CONFORMANCE
ADAPTER
RUNTIME
LICENSE_BLOCK
GOLD_INPUT_INSUFFICIENT
GOLD_DEFECT_CANDIDATE
```

必须区分：

- 模型错；
- mapper 错；
- formalizer 错；
- Core operator 错；
- Gold 输入不足；
- Gold 本身错误。

---

# 18. 开发任务

## T01 — 双 Gold 导入与原始制品冻结

完成：

- 原 ZIP 保留；
- hash 校验；
- 100+100；
- 25×4；
- 原 MANIFEST 校验；
- 旧用例标记 HISTORICAL_NON_BASELINE。

Gate：

```text
GOLD_SOURCE_ARTIFACTS_FROZEN
```

---

## T02 — 200 例审定台账

每 case 完成：

- source completeness
- test_scope
- producer_applicable
- reviewed IR
- reviewed formal model
- reviewed math predicates
- expected Boundary State
- expected Admission
- downstream object if applicable
- evidence span
- canonical equivalence rule
- defect/clarification history

Gate：

```text
ADMIN_GOLD_FROZEN
```

未签署不得发布正式准确率。

---

## T03 — 研究证据存储

实现：

- immutable run directory
- append-only attempts
- run manifest
- source snapshot
- hash verification
- resume rules
- no overwrite

Gate：

```text
RESEARCH_EVIDENCE_STORE_PASS
```

---

## T04 — 三路统一驱动器

要求：

- Gold isolation
- same input/context
- route isolation
- timeout isolation
- case applicability
- N/A handling
- retry no-overwrite
- run-id
- primary/stability modes

Gate：

```text
BENCHMARK_DRIVER_PASS
```

---

## T05 — LLM Producer

要求：

- fixed prompt version
- requested/actual model
- provider
- raw response
- parser errors
- no Gold leakage
- no silent fallback

早期输出：

```text
PRE_IMPLEMENTATION
```

正式输出在 0.4 freeze 后重跑。

---

## T06 — spaCy Local NLP

要求：

- local
- no auto download
- model version/digest
- POS/dependency/NER or available capabilities
- phrases / role / object / condition / negation / unit / time / ambiguity
- shared mapper
- exact evidence relocation
- license evidence

---

## T07 — HanLP Local NLP

要求：

- local
- research route
- explicit enabled tasks
- POS/dependency/SRL as available
- same output contract as spaCy
- exact model/license record
- no redistribution without license
- compare Chinese strengths/weaknesses by actual evidence

---

## T08 — BXP 0.4 Wire Contract + Formalizer

交付：

```text
BXP-0.4-WIRE-CONTRACT-MATRIX.md
```

实现：

- 0.4 schema/version
- Formal Model canonical representation
- formalizer version/digest
- evidence/scope binding
- no invented unknowns
- 0.3/0.4 dispatch

Gate：

```text
BXP_0_4_WIRE_CONTRACT_FROZEN
FORMALIZER_FROZEN
```

---

## T09 — Deterministic Boundary Engine

实现 Gold 所需的确定性 operator：

- set
- interval
- numeric
- logic
- dependency
- temporal
- ordering
- cardinality
- identity/equivalence
- scope/applicability
- version/provenance
- completion

Gate：

```text
OPERATOR_PROFILE_FROZEN
BOUNDARY_ENGINE_PASS
```

---

## T10 — Enterprise L3 Profile v2

实现：

- identity
- alias
- department
- job
- grade/track
- manager
- status
- employment type
- authority
- delegation
- policy
- temporal validity
- scope

禁止：

- job → authority
- grade → authority
- manager → authority
- contractor default approval

Gate：

```text
L3_PROFILE_FROZEN
L3_ENGINE_PASS
```

---

## T11 — Boundary Result / Admission / Downstream

实现：

- canonical Boundary Result
- boundary digest
- Admission binding
- stale detection
- host fail-closed
- downstream conformance
- pre-release atomic recheck

Gate：

```text
ADMISSION_GATE_PASS
```

---

## T12 — Comparator + Metrics

实现：

- fact-level matching
- canonical equivalence
- confusion matrix
- FDR
- FAR
- applicability-aware denominators
- failure coverage
- route/group/suite breakdown
- scorer versioning

Gate：

```text
SCORER_FROZEN
```

---

## T13 — ADMIN 报告与修订闭环

UI/报告显示：

- source
- 7+1
- formal model
- Boundary Result
- Admission
- route
- model
- timings
- case diff
- clarification
- re-run

不得让 UI 绕过 Admission。

---

## T14 — License Matrix

完成：

- spaCy engine/model
- HanLP engine/model
- dependencies
- dictionaries
- commercial use
- redistribution
- evidence links/files
- research-only flags

Gate：

```text
LICENSE_MATRIX_REVIEWED
```

---

## T15 — Primary 600

前置必须全部满足：

```text
ADMIN_GOLD_FROZEN
BXP_0_4_WIRE_CONTRACT_FROZEN
FORMALIZER_FROZEN
OPERATOR_PROFILE_FROZEN
L3_PROFILE_FROZEN
ADMISSION_GATE_PASS
SCORER_FROZEN
```

执行：

```math
200 \times 3 = 600
```

每个适用 case-route 必须有记录。

---

## T16 — Stability 1800

执行：

```math
200 \times 3 \times 3 = 1800
```

固定配置，禁止挑最好一次。

---

## T17 — 三路线比较

生成：

```text
SUMMARY.md
METRICS.json
CASE-MATRIX.csv
ERROR-TAXONOMY.md
LLM-vs-SPACY.md
SPACY-vs-HANLP.md
THREE-ROUTE.md
MANIFEST.json
```

不得只给一个总分或“冠军”。

---

## T18 — Paper Evidence

生成：

```text
DATASET-CARD.md
GOLD-PROVENANCE.md
PRODUCER-MODEL-CARDS.md
EXPERIMENT-METHODOLOGY.md
METRIC-DEFINITIONS.md
REPRODUCIBILITY.md
FAILURE-PRESERVATION.md
LICENSE-LIMITS.md
CLAIM-LIMITS.md
HOLDOUT-PROTOCOL.md
MANIFEST.json
```

---

## T19 — 0.3 回归 + 全量回归

必须运行：

- 0.3 historical regression
- 0.4 protocol tests
- Core Gold isolated tests
- L3 Gold isolated tests
- Producer adapter tests
- Admission stale/mismatch
- Unicode/evidence
- docs
- Windows
- CI supported platforms

---

## T20 — 本地验收与交付包

本任务最终验收不依赖 GitHub。

必须生成：

```text
D:\boundx\research\bxp-0.4\delivery\<delivery-id>\
  FINAL-REPORT.md
  TEST-SUMMARY.json
  GOLD-STATUS.json
  PRIMARY-RUNS.json
  STABILITY-RUNS.json
  LICENSE-MATRIX.json
  PAPER-EVIDENCE-MANIFEST.json
  SOURCE-STATE.json
  LOCAL-GIT-STATE.json
  MANIFEST.json
```

并生成一个本地可复制 ZIP：

```text
BXP-0.4-PRODUCER-BENCHMARK-DELIVERY-<id>.zip
```

### LOCAL-GIT-STATE.json 至少记录

```text
branch
HEAD
base_commit
working_tree_state
uncommitted_diff_digest (如有)
```

### 完成条件

- 所有 Gate 在本地通过；
- 所有命令可以从本地重新运行；
- 不需要 GitHub Actions；
- 不需要 GitHub artifact；
- 不需要云端 CI；
- 完整研究证据在本地可校验；
- 最终 ZIP 与 MANIFEST 的 SHA-256 可独立核验。

### 可选后续同步

只有 ADMIN 之后明确要求时，才允许：

```text
local git commit -> push -> Draft PR / GitHub review
```

这一步属于**可选同步动作**，不是本任务完成条件，也不得触发或等待 GitHub Actions。

---

# 19. 授权规则

ADMIN 签署本任务书后，视为对 T01–T20 的**连续开工授权**。

授权包括：

- implementation
- tests
- local experiments
- 本地 development branch
- 本地 git commit
- documentation
- evidence generation
- 本地验收包与 ZIP 生成

**不自动授权 push 或 Draft PR。** GitHub 同步必须由 ADMIN 之后单独明确要求；本任务不得因未 push 而停止。

不需要每个 T 再次请求开工。

以下事项仍必须停下请求 ADMIN：

- 修改 BXP 规范语义；
- 修改已经冻结的 Gold 标准答案；
- 购买第三方许可证；
- 下载新的、未在任务书范围内的模型；
- 使用真实客户 L3；
- 合并本地/远端 `main`；
- Release；
- npm/PyPI/public distribution；
- 修改 LICENSE；
- 公开发布论文/数据集。

---

# 20. 实施纪律

1. 先读 `README.md`、BXP 中英文规范、Producer Contract、历史相关任务书。
2. 本任务执行期间以 `D:\boundx` 的已记录本地基线、当前任务分支、Gold 固定摘要和任务书为事实源；不得依赖远端 GitHub 可用性。
3. 不用 PowerShell 修改中文文件。
4. 不以 dirty worktree 为理由 reset/clean 用户现场。
5. 禁止 destructive reset。
6. 文件即协议；确定程序只判断完整可观察事实。
7. 未知必须保留。
8. Producer 不得自行验收自己。
9. Gold 不从 Producer 输出反向生成。
10. 禁止为 case ID 加特判。
11. 失败不删除。
12. 修复后重跑生成新 run。
13. 不把 benchmark PASS 写成业务授权。
14. 不把 BXP Admission 写成执行授权。

---

# 20A. 本地测试与计算资源规则

所有测试必须使用本机命令完成。建议提供统一入口（具体名称可等价）：

```text
npm run test:local
npm run test:bxp04
npm run benchmark:core100
npm run benchmark:l3-100
npm run benchmark:primary
npm run benchmark:stability
npm run research:verify
```

若 Python Producer 需要虚拟环境，固定在本地并记录：

```text
python version
venv/conda identity
requirements lock
installed package versions
model paths
model digests
```

### 禁止

- 调用 GitHub Actions 作为测试执行器；
- 将 “Actions 通过” 作为 Gate；
- 等待 GitHub workflow 才继续 WP；
- 将实验原始输出依赖 GitHub artifact 保存；
- 因 GitHub 配额不足把任务标记 BLOCKED；
- 因没有云端 CI 拒绝本地验收。

### 本地 Gate 证据

每个 Gate 必须保存：

```text
command
cwd
started_at
completed_at
exit_code
stdout/stderr path
input digests
output digests
local HEAD
environment digest
```

由此替代云端 CI 作为本任务的可重放验收证据。

# 21. 最终报告必须回答

1. 哪些 Gold 已冻结？
2. 哪些 case 适用于 Producer？
3. Core 100 三路线结果如何？
4. L3 100 三路线结果如何？
5. 哪些失败是 Producer，哪些是 mapper，哪些是 Core？
6. FDR 是多少？
7. FAR 是多少？
8. spaCy/HanLP 的具体 model/license 是什么？
9. HanLP 是否仍 research-only？
10. 哪些结果来自 Primary，哪些来自 Stability？
11. 0.3 回归是否仍通过？
12. 哪些指标只对 development Gold 有效？
13. Holdout 是否仍 sealed？
14. 哪些论文结论当前不能支持？
15. 是否所有 Gate 都可在 GitHub 完全不可用时本地完成？

---

# 22. 最终回执格式

```text
TASKBOOK:
BXP Producer Benchmark Development Taskbook v1.1

BASELINE_MAIN:
db6298990717c613ae5dc4cfb384c5ace3cc2090

FINAL_HEAD:
<sha>

PROTOCOL:
BXP-0001 0.4.0-draft.1

RESEARCH_RESET:
CONFIRMED

GOLD:
core100=<version/digest/status>
l3_100=<version/digest/status>
admin_gold_frozen=<yes/no>

BXP_0_4:
wire_contract=<pass/fail>
formalizer=<version>
operator_profile=<version>
boundary_engine=<pass/fail>
admission_gate=<pass/fail>

L3:
profile=<version>
digest=<...>
pass=<yes/no>

PRIMARY_BENCHMARK:
planned=600
completed=<n>

STABILITY_BENCHMARK:
planned=1800
completed=<n>

LLM:
run_ids=<...>

SPACY:
run_ids=<...>
license_status=<...>

HANLP:
run_ids=<...>
research_only=true
license_status=<...>

FDR:
LLM=<...>
spaCy=<...>
HanLP=<...>

FAR:
LLM=<...>
spaCy=<...>
HanLP=<...>

ZERO_THREE_REGRESSION:
<pass/fail>

PAPER_EVIDENCE:
<path>

HOLDOUT:
sealed=<yes/no>

LICENSE_MATRIX:
<path>

TESTS:
<summary>

LOCAL_TEST_EVIDENCE:
<path>

LOCAL_DELIVERY_ZIP:
<path + sha256>

GITHUB_ACTIONS_USED:
NO

GITHUB_DEPENDENCY:
NO

REMOTE_SYNC:
NOT_REQUIRED

MERGED:
NO

RELEASED:
NO

ADMIN_DECISION_REQUIRED:
<none | exact items>
```

---

# 23. 一句话目标

> **协议上严格实现 BXP 0.4；研究上从零建立 Gold、三路线、证据、指标和论文方法学；所有开发、测试与验收本地完成，不依赖 GitHub 计算或配额。**
