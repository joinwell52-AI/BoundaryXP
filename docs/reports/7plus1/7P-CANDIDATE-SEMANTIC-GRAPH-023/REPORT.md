# 7P-CANDIDATE-SEMANTIC-GRAPH-023 — implementation diagnostic

状态：`WAITING_ADMIN_REVIEW`。**本轮没有达到任务书第 21 节的全部验收条件，不声明任务通过。** G1–G12 通过，但全量回归仍有 3 个失败；完整语义审阅和历史全部通用机制的迁移也没有闭环。

```ini
ARCHITECTURAL_ROUTING_G1_G12=PASS
CANDIDATE_SEMANTIC_GRAPH_MAIN_PATH=NOT_ACCEPTED
TASK_023_ACCEPTANCE=NOT_PASSED
FULL_REGRESSION=FAIL
SEMANTIC_REVIEW=PARTIAL_WITH_CONFIRMED_GAPS
BOUNDX_PRODUCTION_READY=false
ADMIN_ROOT_GENERALIZATION_COMPLETE=false
PRODUCTION_ENTRY_CHANGED=false
STATUS=WAITING_ADMIN_REVIEW
```

基线提交为 `1843a93be5f24c3ebb6d8cd9c9e5db49eaf44ca4`，分支为 `review/7plus1-parser`。先读取 CURRENT-TASK.md、023 任务书及 v0.3.1 规范全文。新实现位于 `research/7plus1-parser/v0.3-candidate-semantic-023/`；没有切换生产 npm 入口。规范、Gold、Source、旧运行源码和旧封存均未修改。最终 commit hash 由 Git 提交和推送回执记录，避免封存文件自引用。

## 实际实现与边界

023 新执行路径真实创建候选注册表 Gc；HanLP/spaCy 和 typed recognizers 产生节点、关系候选及来源证据；真实 BGE-M3/E5/NLI 调用仅追加候选证据。纯确定性 Γ 消费 Gc，对每条候选输出 CERTIFIED / REJECTED / TYPED_UNRESOLVED 决策。Eligibility、Boundary IR 和 Q 消费经 Γ 认证的结构，后续创建关系会触发拒绝。候选关系不是先从最终结果反构建；candidate proof 单独保留 Canonical → Fact → Γ decision → Candidate → Evidence → Source 路径。

语义数组递归冻结，Gc 顶层冻结；source/structure 为独立克隆。没有声称整个 Gc 的每个辅助数组都递归冻结，详见 CANDIDATE-GRAPH-CONTRACT.json。

复用了 014 的通用句法、条件、指代、话语与来源机制，创建候选专用 frontend / expressions / coreference。旧 016/018/021 中直接生成已解析关系的整个 preparation pipeline 没有被调用。旧的 whole-frame、artifact/content、role、reference/basis 和 scope 闭环模块仍原字节保留，**尚未全部迁移为 023 活动候选生产者**；这属于任务书第 8 节的迁移缺口，不能把保留历史文件等同于迁移完成。当前门禁证明新路径无绕过，并不证明所有旧通用能力已保留在新路径。

没有按 018/021 的短语、Case ID、人员或文件实体修补，也没有修改 Γ/Q 来追逐案例答案。两个重放后修改限于前端合同适配：补足 ownership evidence 的必填字段，预先声明 SCOPE_MEMBER 对象对应的 ITEM 表达式。二者均有可复用回归断言。初次失败记录保留，新冻结与重放使用 r05 独立目录。

## 实测结果

| 检查 | 实际结果 | 证据 |
| --- | --- | --- |
| G1–G12 | 全部 PASS；25 个机制案例、最终 200 个重放均检查 | GATES.json、各 trace 的 candidate_graph_gate_results |
| 新专项测试 | 35/35 PASS | test-runs/r05/result.json、output.log |
| 预声明机制集 | 25/25 PASS，案例集在语料重放前冻结 | MECHANISM-SUITE-r05.json、IMPLEMENTATION-FREEZE-r05.json |
| 首轮语料执行 | 189 输出、11 错误；全部首次结果保留 | ADMIN-FIRST-OUTPUTS.json、FIRST-OUTPUT-SEAL.json、replay/ |
| 最终语料执行 | Root-050 50、018 50、021 100，共 200 输出、0 运行错误 | ADMIN-FIRST-OUTPUTS-r05.json、FIRST-OUTPUT-SEAL-r05.json、replay-r05/ |
| 重复性 | 6/6 语义签名完全一致，重新调用真实 NLP/模型 | REPEATABILITY-r05.json、repeat-r05/ |
| 58618 通道 | PASS；解析 1 次，JSON/HTML/Markdown 导出同一历史快照，没有重新解析 | CHANNEL-58618-r05.json、channel-r05/ |
| 全量回归 | **6488 项，6468 PASS，3 FAIL，17 SKIP，0 CANCEL** | FULL-REGRESSION.json、test-runs/full-final/output.log |
| 字节保留 | 20985 个旧 tracked 路径、50 个 NLP 模型文件无变化；200 对保存原文完全一致 | PRESERVATION-AUDIT-r02.json |

全量失败是旧封存 021 的 `REF-N1`、`ROLE-P2`、`ROLE-N2`，在两次全量运行中均真实失败。失败断言分别涉及明确定义来源被保留为 unresolved、输入/输出/负责任角色缺失、合同与 quoted-role 检查。没有删除测试、降低断言、过滤失败或修改旧封存来获得 0 fail。任务书明确要求全量失败为 0，因此本轮只能提交未通过验收的实现诊断，不能用“旧失败”豁免验收。

58618 为临时隔离的候选检查服务，验证后已关闭；旧生产服务与 package.json 入口不变。这不是生产切换，也没有把旧服务的结果当作新候选结果。

## 最终 r05 的精确结构计数

| 字段 | 数量 |
| --- | ---: |
| candidate_nodes | 3189 |
| candidate_relations | 1574 |
| candidate_expressions | 1183 |
| certified_relations | 657 |
| rejected_relations | 316 |
| typed_unresolved_relations | 601 |
| relations_without_candidate | 0 |
| certified_relations_without_gamma_decision | 0 |
| native_rule_direct_certifications | 0 |
| model_direct_certifications | 0 |
| candidate_provenance_gaps | 0 |
| direct_nlp_to_slot_edges | 0 |
| direct_nlp_to_boundary_fact_edges | 0 |

所有数量以最终 200 个实际输出累计；不把节点/关系数量或 Γ 认证数量当作正确答案数量。完整逐案例计数见 CANDIDATE-RELATION-AUDIT.json。

## 模型与证据

MODEL-ROLE-AUDIT.json 保留实际加载路径、资源 manifest SHA-256、调用计数、输入输出摘要、Pack 与固定阈值。每个 trace 保存完整请求与返回信号。BGE、E5 和 NLI 各在最终 200 个 trace 中实际调用；中文 spaCy/HanLP 均有实际信号，机制集另含英文和混合文本。LLM 未使用；mDeBERTa-v3-base 主路径仍关闭。没有修改模型、Pack 内容和 POLICY 阈值。

模型资源版本/manifest 核对不等于完整权重字节前后核对：任务开始前没有采集 semantic-models 的全部权重字节基线，本轮不补写“已完成权重前后比较”。NLP 模型目录的已记录文件按 BASELINE 实际核对。不可上传的模型、缓存和凭据均不在 publication_paths。

## 语义诊断与最早偏离

全部最终原文、Canonical、未决项、Fact、scope、condition、quantity、源 span 和候选/Γ 引用链已保存；离线审阅脚本不进入 Parser。

**当前最早已确认的偏离是 `SEMANTIC_NODE`**：Root-050 的 ROOT-001 中 `[24,28)` 的 `操作系统` 明确属于“范围包括”列出的对象。原文和 HanLP tokens `clause:1:token:2` / `clause:1:token:3` 保留了它，但 Gc 没有这个实体端点。根节点中的整段 DISCOURSE 原文不能代替它。之后的“形成 environment-check.md”也缺少 RESULT 候选，是更晚的 CANDIDATE_GENERATION 缺口。最早偏离依据见 ROOT-SOURCE-REVIEW.json 和 FINAL-REVIEW-SUMMARY.json；不能倒推归咎于 Q。

Root-050 中 45 个案例发现至少一个明确诊断缺口；对最终 200 条的有限 soundness 检查发现 46 个错误 RESOLVED 的 operator-as-action 观察。它们是已确认问题观察，不是全量错误率。Γ 的类型/来源检查通过并不自动证明“请”等词已选对词义，NLI entailment 也没有被当作语义真值或最终正确性证明。

018 使用历史结构化 facts 的只读比较，输出 missing/different 对应的候选与 Γ 路径。021 的 Oracle 为 expected 数组，历史 matcher 不支持该形状，明确标记 ORACLE_SHAPE_UNSUPPORTED，保留原文、Oracle 位置及全量 actual inventory；没有编造 021 的完整语义评分。Root-050 为 source-only 部分检查，不是新建人工 Gold。

**逐案例完整人工语义裁定尚未完成**，不能声明所有 mismatch 已穷尽或 200/200 语义通过。ADMIN-REPLAY-MATRIX-r05.json / FIRST-DIVERGENCE-r05.json 是部分审阅；ROOT-SOURCE-REVIEW.json 进一步给出更早的实体端点缺口。无后缀的 matrix / first-divergence 属初次重放，原样保留，不作为最终准确率报告。

## 封存与停止

最终实现冻结摘要：`06964c34defb9c72f2fcfd933f12b85e79491ca65bd02a081ea2d5ae7ade62b7`。原始首次结果与最终结果分别封存，未覆盖；修复后的 Source 字节与首次保存的 200 条完全相同。第一次 preservation 脚本错误比较了 11 个失败 summary 中缺失的可选 SHA 字段，错误的审计也保留；r02 直接比较所有实际 source.md 字节，结果 PASS。

MANIFEST.json、SHA256SUMS.txt、SEAL.json 与 SEAL-VERIFICATION.json 封存本轮新实现、测试、原始输出及报告；校验 PASS 只表示完整性。只提交本轮 publication_paths，仓库原有 160 项 tracked dirty 状态不变，不夹带旧封存、生产入口或无关资产。

按用户授权仅推送 `review/7plus1-parser`，不 merge/release/tag，不切换生产。停在 `WAITING_ADMIN_REVIEW`；剩余回归失败、候选迁移及语义审阅缺口如上明示，不自动开始下一轮修复。
