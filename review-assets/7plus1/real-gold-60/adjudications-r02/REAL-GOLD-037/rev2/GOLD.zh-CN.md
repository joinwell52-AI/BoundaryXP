# REAL-GOLD-037 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-037`
- 原始文件: `source/TASK-20260513-007-ADMIN-to-ME-translate-essay-13-to-english.md`
- SHA-256: `e7fcd353e476ecf70c0154480ac940eb9082fe3fd4c431baf804e54ace278f33`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 773) | SOURCE | directive, Chinese essay and translation precedent |
| E002 | [773, 1573) | SOURCE | required translation, indices and exclusions |
| E003 | [1573, 2097) | SOURCE | time, acceptance and risk |
| E004 | [2097, 2255) | SOURCE | closure |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: 已指名的中文 essay #13、essay 11 英文先例、fcop-rules 词汇表和三处索引；本案未附正文，实际内容须在执行时核验。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: translation_source_and_style_inputs
- Ontology binding: null
- 说明: 不补造原文、术语表或索引行。

### [O] 交付结果

- Status: `resolved`
- 审定值: 完整英文 essay 文件和三处带英文链接、移除 pending 的索引更新。
- Evidence: E001, E002
- Origin: SOURCE
- Normalization: translation_and_index_outputs
- Ontology binding: null
- 说明: 产物未生成。

### [A] 动作

- Status: `resolved`
- 审定值: 翻译 essay #13、保留 ASCII 图、为 ADMIN 引语加英文译注、更新三处索引、commit 与 push，并在后续归档/报告。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: translation_publication_workflow
- Ontology binding: null
- 说明: 审定不进行翻译或 Git 操作。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 指令；ME 执行。
- Evidence: E001, E004
- Origin: SOURCE
- Normalization: roles_without_authority
- Ontology binding: null
- 说明: 不推导远端权限。

### [R] 资源约束

- Status: `absent`
- 审定值: 原文未设可计算的执行时限或资源预算；P1 和低风险是元数据，约 400 行描述交付物体量，单一 session 仅为预估。
- Evidence: E001, E003
- Origin: SOURCE
- Normalization: no_binding_resource_limit
- Ontology binding: null
- 说明: 没有固定截止时间。

### [V] 版本与依据

- Status: `resolved`
- 审定值: essay 11 双语先例、fcop-rules 术语、已有中文 essay commit 523d81e。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_cited_translation_basis
- Ontology binding: null
- 说明: 引用内容未提供。

### [C] 完成条件

- Status: `unresolved`
- 审定值: 文件、frontmatter 和三处索引可以核对；原文另要求完整翻译、术语一致、准确传达原意，但没有给出可计算的语义质量阈值。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: qualitative_translation_acceptance
- Ontology binding: null
- 说明: 不以行数替代翻译正确性。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得翻译 ADR-0034、改 ASCII 图或重做题图；不得改既有产物语义。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: translation_scope_prohibitions
- Ontology binding: null
- 说明: 闭环归档需 ADMIN 同意的条件被保留。

## 4. 第三层：形式化边界模型

### E

$$
\texttt{E=\{essay13\_zh,essay11\_en,glossary,indexes,essay13\_en\}}
$$

### Sigma

$$
\texttt{Sigma.output=english\_translation}
$$

$$
\texttt{Sigma.indices=3}
$$

$$
\texttt{Sigma.ascii=preserve}
$$

$$
\texttt{Sigma.deadline=absent}
$$

$$
\texttt{Sigma.output\_size≈400\_lines}
$$

### Q

$$
\texttt{Q.translate}
$$

$$
\texttt{Q.annotate\_admin\_quotes}
$$

$$
\texttt{Q.update\_indices}
$$

$$
\texttt{Q.commit\_push}
$$

$$
\texttt{Q.report\_archive}
$$

$$
\texttt{Q.archive(parent\_006) only\_if ADMIN\_consents}
$$

### F

$$
\texttt{F.translate(ADR-0034)}
$$

$$
\texttt{F.alter(ASCII)}
$$

$$
\texttt{F.remake(cover)}
$$

$$
\texttt{F.change\_existing\_semantics}
$$

### K

$$
\texttt{K.file\_exists}
$$

$$
\texttt{K.frontmatter\_valid}
$$

$$
\texttt{K.index\_links=3}
$$

$$
\texttt{K.translation\_semantics=qualitative\_unquantified}
$$

### Relations

$$
\texttt{essay13\_en -> translates -> essay13\_zh}
$$

$$
\texttt{indexes -> link -> essay13\_en}
$$

$$
\texttt{ADMIN -> directs -> ME}
$$

### D

$$
\texttt{D.priority=P1}
$$

$$
\texttt{D.risk=low}
$$

$$
\texttt{D.output\_size≈400\_lines}
$$

### Phi

$$
\texttt{Phi.source\_essay\_body=not\_attached\_verify\_at\_execution}
$$

$$
\texttt{Phi.glossary\_body=not\_attached\_verify\_at\_execution}
$$

$$
\texttt{Phi.translation\_accuracy\_threshold=not\_specified}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 保留完整翻译与索引交付、保图与不动范围、无硬时限、父任务归档需 ADMIN 同意，以及未量化的翻译质量验收。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{翻译质量的可计算验收阈值}
$$

已指名的源文、先例和术语表是执行时要核验的输入，不因未附正文而自动成为任务规范缺项；真正未给出的是“准确传达原意”的可计算质量阈值。

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

完整翻译与保留两张 ASCII 图、不得翻译 ADR-0034 或重做题图可以同时满足；父任务归档另受 ADMIN 同意条件约束。

### 3. 约束一致性

$$
Consistency=\text{PASS}
$$

翻译、三处索引更新及提交要求之间没有已证实的相互否定；未量化质量阈值是信息缺口，不是冲突。

### 4. 完成条件可判定性

$$
Decidable(K)=\text{FAIL}
$$

文件、frontmatter、索引及术语对照可以检查，但原文没有给出可计算的“准确传达原意”判据，不能只靠文件存在宣布全部完成。

### 5. 合法解空间

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

取得并核验已指名的源文和术语后可以形成满足形式要求的译稿；本审定没有访问或翻译外部文件，也不保证其内容已满足质量标准。

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

合理的译文可能不止一种，执行路径不唯一；但“准确传达原意”的验收阈值未量化，两个可辩护的质量判据会改变可接受边界。

### 7. 边界状态

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

边界未定来自质量验收判据，而非把未附的外部文件内容臆测为任务缺项；不能据此改变已明确的翻译和索引范围。

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

没有 OperatorProfile；ADMIN/ME 称谓、低风险自评和原文要求 push 都不能单独证明写库或远端发布权限。

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

质量验收边界尚未确定时不得准入；即便补充阈值，仍需另行核验操作者资料，不能把审定视为执行授权。

## 6. Fixed Diff & Output Summary

[I] OK
[O] OK
[A] OK
[P] OK
[R] ABSENT（非必需）
[V] OK
[C] UNRESOLVED
[B] OK

## 7. Recommendation

执行前核验已指名正文、词汇表和索引；ADMIN 如需确定性验收，应明确翻译质量的可核对阈值。未获授权不执行 Git 操作。

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
| G5 | PASS | 未补造翻译内容。 |
| G6 | PASS | 未推导权限。 |
| G7 | PASS | 7+1 区分已指名的外部输入、非约束性预估与未量化的验收要求。 |
| G8 | PASS | 形式模型和结果可复放。 |
| G9 | PASS | 未把可写路径当作唯一执行方案。 |
| G10 | PASS | 无 Profile，正确未评估。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 通过；翻译质量阈值仍未量化，未生成 ADMIN_GOLD_FROZEN。
