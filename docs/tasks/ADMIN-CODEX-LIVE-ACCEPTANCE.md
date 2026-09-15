# Codex 真实运行回执 / Live execution receipt

日期：2026-09-15。任务依据：[v2入口](ADMIN-TEXT-SEMANTIC-PACKS-START-HERE.md)及其固定120条原文。状态：**PENDING_GOLD_REVIEW，不是 IMPLEMENTATION_COMPLETE**。独立分支、Draft PR #6；不合并、不发布。范围为默认L1、软件/AI L2和虚构L3职员表；其他行业资产未改动。

This is engineering evidence, not independently reviewed semantic acceptance. All runs use Codex subscription authentication, not Cursor or API keys. No task execution or business authorization is granted.

## 1. 实际运行与中断 / Runs and interruption

| 记录组 / Group | 本地忽略目录 / Local directory suffix | 实现 / Implementation | 结果 / Outcome |
|---|---|---|---|
| 初始批次 / Initial | `acceptance-runs/d5d2efc6-f6d9-4771-90cb-d71cffb749dd` | `885c63f`，提示0.2.0 | T001–T040完成；T041为CALL_STARTED后进程中断 |
| 显式续跑 / Continuation | `acceptance-runs/b9111f70-de25-420b-92cd-26fcd9738061` | `d06e0b4`，提示0.2.0 | T042–T120及固定30条复测，共109条完成 |
| 时间单位修复 / Unit repair | `acceptance-runs/e4ea23ff-d05b-4a2c-9924-040ce2bcdd38` | 提示0.3.0开发候选，随后提交`abf7632` | T054额外一次生成，Core判定[120,90]秒为空区间 |
| 中断补跑 / Recovery | `acceptance-runs/f5f0dd47-4b21-44d8-b8a5-2523fbe3c797` | `abf7632`，提示0.3.0 | T041额外一次生成，COMPUTED，确定性回放MATCHED |

上述目录均位于 `D:\boundx\.boundx\`，原始候选、快照和结果保留在本机，不提交密钥或原始运行数据。0.3.0提示摘要为 `3641e829f872f795b7394764c0a1519bee5eb2b9cd75588e53a1ad8c741e761d`。固定批次从03:46:06 UTC开始，续跑最终记录在05:04:20 UTC完成。

固定初始150个位置：**141 COMPUTED、8 REJECTED、1 CALL_STARTED**；149条完整真实输出，1条中断。补跑后120条独立原文均有模型返回，30条固定复测均有返回，但不回写初始分母、不抹掉中断或原始错误。T054修复和T041补跑是额外尝试；此前独立T001连接检查不混入本次150项。没有自动重试或换模型。

The initial denominator remains 150, including the interrupted call. Recovery provides the previously missing source observation without replacing its failed initial slot. Repair/recovery calls are additional attempts, not extra distinct cases or retroactive initial successes. Different implementation and prompt revisions are explicitly separated.

## 2. 初始运行分布 / Initial outcomes

| 语言 / Language | 记录 / Records | COMPUTED | 拒绝或中断 / Rejected or interrupted |
|---|---:|---:|---:|
| 中文 / zh-CN | 75 | 68 | 7 |
| 英文 / en | 45 | 45 | 0 |
| 混合 / mixed | 30 | 28 | 2 |

| 测试类别 / Test category | 记录 / Records | COMPUTED | 拒绝或中断 |
|---|---:|---:|---:|
| IO | 20 | 19 | 1 |
| MODALITY_B | 10 | 9 | 1 |
| L2_SOFTWARE_AI | 10 | 9 | 1 |
| L3_IDENTITY | 20 | 20 | 0 |
| ROLES_AUTHORITY | 10 | 9 | 1 |
| QUANTITIES | 10 | 9 | 1 |
| CONDITIONS_SCOPES | 10 | 10 | 0 |
| VERSIONS_SOURCES | 10 | 10 | 0 |
| COMPLETION_UNKNOWNS | 10 | 10 | 0 |
| EVIDENCE_UNICODE | 10 | 10 | 0 |
| PACK_SNAPSHOTS | 10 | 8 | 2 |
| END_TO_END_ADVERSARIAL | 20 | 18 | 2 |

类别不是行业；COMPUTED不是语义正确。141条可计算候选的同输入离线回放均MATCHED，未发现非null的业务裁决/执行授权字段；这不证明模型没有遗漏证据或错分任务责任。T106错误包摘要注入、T107标签适配器回放程序检查通过，均为0次模型调用。

## 3. 错误与修复 / Errors and repairs

| 用例 / Run | 原始诊断 / Original diagnostic | 处理 / Disposition |
|---|---|---|
| T002-1 | IDENTITY_AMBIGUOUS | 两个明确员工代号被误当共享别名；`6b5770b`修复。本地重检原候选通过，0次额外模型调用 |
| T012-1、T053-1、T112-2 | QUOTE_AMBIGUOUS | 重复引文缺充分定位；原始拒绝保留，不放宽证据规则 |
| T022-1、T119-2 | CANDIDATE_AMBIGUOUS | 多候选与已明确状态冲突；原始拒绝保留 |
| T104-1、T110-1 | STALE_PREPARE | 符合场景设计的旧快照拒绝，不绕过启用状态验证 |
| T041-1 | CALL_STARTED | 中断原件保留；单独补跑通过 |
| T054-1 | 原始COMPUTED但单位不可比较 | 原模型分开提交min/s，不能识别同数量空交集；新提示单独修复通过，不改Core |

剩余候选错误仍须按证据审阅；未根据当前模型结果刷新作者答案或自认金标。精确率98%、召回率95%和逐项安全语义门槛**尚未证明**。

Remaining candidate failures are not hidden or converted into successes. Schema/evidence validity is not extraction completeness. Independent semantic precision, recall, role assignment, prohibition recall and ambiguity correctness remain unverified.

## 4. 离线汇总与比较 / Offline artifacts

- 150位置原件汇总：`acceptance-collections/8a4b423b-af2f-4384-abc8-e7023757a8f7`，包含来源索引和摘要；1条中断，无缺失记录文件。
- 草稿比较：`draft-comparisons/14bf8fc9-54bd-416c-9320-99ec382f8f1e`；149有原始输出、1无输出、0不可读。历史模式重检144可计算、5拒绝、1缺失；额外的3条可计算来自身份修复及两条允许历史回放的旧快照，**不是原始运行结果被改成通过**。
- 当前精确草稿比较器整套完全匹配0；它包含措辞、解释和关系ID精确比较，不能解释为语义准确率0%。精确率/召回率保持null，独立审阅0/120。
- 固定30对中27对有可比较的结构/计算输出；结构完全一致0对、计算完全一致10对。跨实现版本且模型具体版本未知，不能据此宣称同版本模型确定性。

Collections and comparisons make zero model calls. The raw initial observations remain authoritative for initial outcome counts. Historical re-evaluation and exact draft comparisons are separate diagnostics, not new live successes or reviewed accuracy scores.

## 5. 模型与包 / Model and packages

149条完整初始记录的实际模型标识均为 `gpt-5.6-sol`，模型具体版本为unknown；中断记录实际返回模型为unknown。默认包如下，完整各场景锁定引用以record.prepared.packs为准：

| 包 / Pack | 版本 / Version | 摘要 / Digest |
|---|---|---|
| boundx/core-ontology | 1.1.0 | `9cb00ab845b08dc999aec4296c190cccd350e72f30d3f04c327c9c4ba204b17d` |
| boundx/software-ai | 0.2.0 | `ac9d037f5f6f26061de906fc76ac64fd3471cc03952160b17867928cf8ebb8c2` |
| tenant-a/example-team | 0.1.0 | `d25f1f0639c647ee475b391a98c15e4bf24b44eb29dc77922e3a9337eb4f3199` |
| tenant-b/example-team | 0.1.0 | `a32997103ac9c337ad45f879bf75fe3990a86a9575be3b356c60bdbd0519515a` |
| tenant-a/example-team（独立恶意文本场景） | 0.1.0 | `862af3c0288ead40318cc8f95ac350e02361381c3ef91a2e8fdd3130e673a644` |

恶意文本场景使用独立Registry；不是在同一Registry覆盖相同版本。L3关闭、tenant-b和prepare后变更等场景按任务书分别构造。名册中的岗位或状态均不构成执行授权。

## 6. 工程验证与交付 / Engineering validation

在D:\boundx重新运行：Core737/737、UI154/154、协议单测103/103、冻结向量208/208、Python135/135、文档单测20/20。方法数、冻结向量和模型调用分别计数，不相加为“抽取通过数”。命令：

```text
node --test <git ls-files列出的src/__tests__/*.test.ts>
node --test ui/*.test.mjs
node --test protocol/conformance/*.test.mjs
node protocol/conformance/run.mjs
.venv/Scripts/python.exe -X utf8 -m unittest discover -s python -p test_*.py
.venv/Scripts/python.exe -X utf8 -m unittest discover -s scripts -p test_*.py
.venv/Scripts/python.exe -X utf8 scripts/check-doc-links.py
git diff --check
git diff e4156a4 --name-only -- protocol LICENSE
```

最后一条输出为空。已提交实现`abf7632`的[CI运行34928443587](https://github.com/joinwell52-AI/BoundX/actions/runs/34928443587)通过；本回执的文档提交CI另查，不冒用之前CI。完整[文件清单](ADMIN-CODEX-LIVE-FILES.md)来自Draft PR #6；未提交并行行业/Case Explorer资产。

WP0、WP2–WP8工程实现已有代码和回归证据；WP1审阅金标/最终匹配器及WP9正式语义验收仍为部分完成。允许向ADMIN提交当前可审查工程成果，不得标记整体IMPLEMENTATION_COMPLETE。下一步是独立金标审阅、处理剩余候选错误并按已审答案评测；禁止自行将本轮作者草稿认证为金标。
