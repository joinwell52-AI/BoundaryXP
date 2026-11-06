# BXP 0.4 配套资产冻结 r02

依据 `ADMIN-DECISION-BXP-0.4-CORE-PROFILE-STATUS-FREEZE.md`，本包完成 Canonical 7+1 projection 范围的配套资产冻结。建议 ADMIN 接受：

```ini
BXP_0_4_COMPANION_ASSETS_READY=true
PASS8_IMPLEMENTATION_AUTHORIZED=false
```

本目录是新修订 `protocol/versions/0.4.0-draft.1/companion-r02/`。上一级 r01 阻断包及其审计保持原字节，不能用上一级旧清单绑定本修订。未来 Pass 8 应绑定**本目录** `PROTOCOL-MANIFEST.json` 的精确摘要。

## 已冻结合同

- BXP 0.4 正文原 Git blob 字节副本；来源提交、blob ID、SHA-256 见 `BODY-PROVENANCE.json`。
- 正式 0.4 task/7+1 Schema：八个 elements 键必需，Profile ID 与 required_elements 显式提供；不注入默认值，不做类型或状态强制转换。
- Core Profile：`structural_elements=[I,O,A,P,R,V,C,B]`，`required_elements=[]`，V 不默认必需。槽位定义逐字引用 BXP 正文 §3；这些要求不是 Admission 政策。
- Profile family：五个独立 ID 共享 carrier，四种专用阶段的 required-elements 政策标为 NOT_FROZEN，不建立别名，不阻断 Core carrier。
- Operator Profile：固定既有 Pass 8 Spec 的槽位规则 ID／章节、状态归约、规范排序及 carrier 兼容性范围。没有实现投影代码或引入新的槽位规则。
- 状态规则：显式分配到槽位的 open 候选优先产生 unresolved；其次 resolved 候选产生 resolved；只有候选为空且问责完整才 absent。slot ambiguous 仅影响其显式候选槽位。问责不完整返回诊断，不伪造 absent。

Schema 将非空 resolved entries 与 open entries 区分；resolved 桶不能隐藏 open entry。显式证据支持的 none 若存在也必须保留为真实条目，不能产生空 resolved 桶。本次未从 Gold 选定 canonical none 事实，未构造 none 来填充测试。

Schema 的职责是结构验证；它不证明 evidence 的语义正确性或问责完整性声明的真实性。这些仍需未来消费者对真实 provenance/ledger 核验。

## 独立验证结果

| 验证 | 结果 | 范围 |
|---|---:|---|
| 100 案 carrier 兼容性 | 100/100 | 原版本、八槽位、状态词汇、值／证据可表示、family 注册 |
| 原 Core Profile 子集 | 25/25 | 只取原 ID 为 core-7plus1 的案例 |
| Gold 状态／表示兼容性 | 800/800 | 原 aggregate bucket 可保真表示，不是 reducer 输入 |
| 独立 synthetic candidate-ledger 机制 | 14/14 | 各 open 状态、混合状态、空候选、显式 ambiguous 槽位、缺问责和非法输入 |
| Schema 正反例 | 43/43 | 八槽位缺失／空 resolved、open 隐藏、0.3 版本、缺证据／Profile、权限字段等 |
| Schema 元 Schema 自检 | 通过 | JSON Schema draft 2020-12 |
| 确定性复验 | 通过 | 重读原件，重新计算所有验证结果并逐对象比较 |

测试台账在运行机制验证之前固定摘要，见 `STATUS-REDUCTION-MECHANISM-TESTS.json` 和审计目录 `FIXTURE-FREEZE.json`。验证脚本只位于本轮审计目录，未接入生产编译器或唯一 Core。

Gold representation adapter 将每个非 absent 聚合桶包装为一个保留 normalized/evidence 的表示条目，保留原 Profile ID 和原 JSON Pointer；absent 原值仍是 null。此包装仅验证载体表示能力，**不是自然语言投影，不是从原始候选台账重放 reducer**。用于 specialized carrier 结构验证的空 required_elements 测试值不构成该阶段政策冻结。

CASE-007 的后续条件性 V 政策明确标为 `LATER_STAGE_POLICY_NOT_PART_OF_CORE_PROJECTION`。四种专用 Profile 共 75 案的后续阶段预期均不执行、不计通过，也不据其结果改状态算法。

## 来源、完整性与停止边界

Core 100 JSON 原始 SHA-256：`d90d1a8fc4c2dd5e120a2a91a6616b901a25e579cbbbf3f15c14abb41cfabfef`。原包仍为 `GOLD_CANDIDATE_FOR_REVIEW`；冻结副本字节不等于 ADMIN 审定 Gold 内容。

原始 replacement ZIP、可选 L3 索引与旧审计的证据通过来源清单绑定。没有恢复旧案例活动入口、改写 75 案 Profile ID，或修改 Gold normalized/status。

4228 个受保护的历史文件前后摘要一致，包含 r01–r30、Pass 8 门禁审计、companion r01、历史 0.3、源码、测试及 fixtures。详细摘要与校验见 `ASSET-INTEGRITY.json`，最终文件摘要见 `PROTOCOL-MANIFEST.json` 与 `MANIFEST.json`。

本包没有计算 FormalBoundaryModel、BoundaryResult、Admission、下游符合性，也没有实现或启动 Pass 8。没有产品发布或协议整体符合性声明。完成后停止，等待 ADMIN Review 与下一次独立 Pass 8 授权。
