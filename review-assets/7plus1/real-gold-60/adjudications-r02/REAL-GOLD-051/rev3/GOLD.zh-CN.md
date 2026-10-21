# REAL-GOLD-051 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-051`
- 原始文件: `source/TASK-20260522-008-ADMIN-to-ME.md`
- SHA-256: `41992f7d445357557a73e5d11ea727e45ec425052ae1a6356d62b338d741bf55`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 428) | SOURCE | background and related task |
| E002 | [428, 764) | SOURCE | two-banner link action and pending label |
| E003 | [764, 838) | SOURCE | prohibitions |
| E004 | [838, 958) | SOURCE | acceptance |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: 两份 README banner、install/bringup 双语 prompt 路径、inventory_drift。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: banner_link_inputs
- Ontology binding: null
- 说明: 路径未被实际访问。

### [O] 交付结果

- Status: `unresolved`
- 审定值: 两份 banner 各新增两条链接及报告归档；中文标签未定。
- Evidence: E002, E004
- Origin: SOURCE
- Normalization: pending_localized_label_output
- Ontology binding: null
- 说明: 审定稿不能补造未定的中文标签；原文没有给出最终字面值。

### [A] 动作

- Status: `resolved`
- 审定值: 在两 banner 的指定位置添加 install/bringup 链接，运行 drift，写报告归档。
- Evidence: E002, E004
- Origin: SOURCE
- Normalization: two_readme_link_update
- Ontology binding: null
- 说明: 审定不编辑。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 指出需求；ME 实施。
- Evidence: E001
- Origin: SOURCE
- Normalization: roles
- Ontology binding: null
- 说明: 不推导权限。

### [R] 资源约束

- Status: `absent`
- 审定值: 原文未设执行期限或资源预算；P2 是优先级，两份 README、各两链接及 banner 行位置属于编辑作用域。
- Evidence: E001, E002
- Origin: SOURCE
- Normalization: no_binding_resource_limit
- Ontology binding: null
- 说明: 不把文件数和编辑位置误作资源配额。

### [V] 版本与依据

- Status: `resolved`
- 审定值: TASK-007、README banner、inventory_drift。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: basis
- Ontology binding: null
- 说明: 引用未验证。

### [C] 完成条件

- Status: `unresolved`
- 审定值: 链接活、drift 清零和报告明确；中文标签未定使中文 banner 的交付文本不可唯一确定。
- Evidence: E002, E004
- Origin: SOURCE
- Normalization: label_dependent_acceptance
- Ontology binding: null
- 说明: 需确认标签。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得改其它 banner 链接顺序、第二排 badges、中段表或发版。
- Evidence: E003
- Origin: SOURCE
- Normalization: banner_scope_prohibitions
- Ontology binding: null
- 说明: 只加四链接。

## 4. 第三层：形式化边界模型

### E

$$
\texttt{E=\{README,README.zh,install\_prompts,bringup\_prompts,drift\}}
$$

### Sigma

$$
\texttt{Sigma.files=2}
$$

$$
\texttt{Sigma.links\_per\_file=2}
$$

$$
\texttt{Sigma.position=after\_getting\_started}
$$

$$
\texttt{Sigma.en\_hrefs=\{src/fcop/rules/\_data/agent-install-prompt.en.md,src/fcop/rules/\_data/agent-bringup-prompt.en.md\}}
$$

$$
\texttt{Sigma.zh\_hrefs=\{src/fcop/rules/\_data/agent-install-prompt.zh.md,src/fcop/rules/\_data/agent-bringup-prompt.zh.md\}}
$$

### Q

$$
\texttt{Q.insert\_links}
$$

$$
\texttt{Q.run\_drift}
$$

$$
\texttt{Q.report\_archive}
$$

### F

$$
\texttt{F.reorder\_other\_links}
$$

$$
\texttt{F.change\_badges}
$$

$$
\texttt{F.change\_middle\_table}
$$

$$
\texttt{F.release}
$$

### K

$$
\texttt{K.links\_live}
$$

$$
\texttt{K.drift=0}
$$

$$
\texttt{K.zh\_label=chosen}
$$

### Relations

$$
\texttt{README\_en -> links -> en\_prompts}
$$

$$
\texttt{README\_zh -> links -> zh\_prompts}
$$

$$
\texttt{label\_choice -> determines -> zh\_banner}
$$

### D

$$
\texttt{D.priority=P2}
$$

$$
\texttt{D.deadline=absent}
$$

### Phi

$$
\texttt{Phi.zh\_label=unresolved}
$$

$$
\texttt{Phi.OperatorProfile=absent}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 保留两份 README 各两条链接的语言对应路径、Getting started 后的插入点、中文标签原文待定及不改链接顺序/badges/中段表/发版的禁止边界；P2 不作资源预算。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{CHINESE\_BANNER\_LABELS\_UNSPECIFIED}
$$

两条中文 banner 链接标签在原文明确待定，没有可回放的最终字面值；英文标签与四个目标路径已明确。

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

计划添加链接与禁止边界无直接冲突；不改其它链接顺序、badges、中段表或发版仍是硬边界。

### 3. 约束一致性

$$
Consistency=\text{PASS}
$$

两份 README 各两条链接、指定插入点与中文标签待定可以同时成立；此处不存在约束自相矛盾。

### 4. 完成条件可判定性

$$
Decidable(K)=\text{FAIL}
$$

链接可访问与 drift 清零可检查，但中文标签的最终字面值未定，整体验收不能按唯一文本核对。

### 5. 合法解空间

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

存在遵守路径和位置要求的可行链接方案；可行不表示中文显示文案已经审定。

### 6. 边界唯一性

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=2,\quad BoundaryUnique=false
$$

$$
|\Omega_B|=\text{MANY}
$$

至少两种不同中文标签可能改变最终 banner 字面结果；边界唯一性与具体编辑执行路径唯一性分别计算。

### 7. 边界状态

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

中文标签被原文留待决定，影响交付文本，因此边界仍未确定；不能直接套用英文标签作为已确认的中文标签。

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

缺少 OperatorProfile；不从 ADMIN/ME 身份推断 README 编辑、报告归档或发布权限。

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

边界未确定，准入被阻断；确认中文标签后还须独立核对版本绑定与操作者权限。

## 6. Fixed Diff & Output Summary

[I] OK
[O] UNRESOLVED
[A] OK
[P] OK
[R] ABSENT（原文无资源预算或期限）
[V] OK
[C] UNRESOLVED
[B] OK

## 7. Recommendation

请确认中文标签后再写入 banner。

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | 源未改写。 |
| G2 | PASS | SHA 已绑定。 |
| G3 | PASS | 证据可回放。 |
| G4 | PASS | 仅 Source。 |
| G5 | PASS | 未补造标签。 |
| G6 | PASS | 未推导权限。 |
| G7 | PASS | 7+1 完整。 |
| G8 | PASS | 结果可复放。 |
| G9 | PASS | 标签歧义保留。 |
| G10 | PASS | 无 Profile，正确未评估。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 通过；未生成 ADMIN_GOLD_FROZEN。
