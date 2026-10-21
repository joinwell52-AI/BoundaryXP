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

- Status: `unresolved`
- 审定值: 中文 essay #13、essay 11 英文先例、fcop-rules 词汇表和三处索引的当前内容；本案未提供这些文件正文。
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

- Status: `unresolved`
- 审定值: P1、低风险、约 400 行、单一 session 预估；“快速但不牺牲质量”不是可计算时限。
- Evidence: E001, E003
- Origin: SOURCE
- Normalization: relative_time_and_size_constraint
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
- 审定值: 文件、frontmatter 和三处索引可以核对；“完整翻译”“术语一致”“准确传达原意”依赖缺失的源文与词汇表，无法完整判定。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_dependent_translation_acceptance
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
\texttt{K.translation\_semantics=source\_dependent}
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
\texttt{D.size≈400\_lines}
$$

### Phi

$$
\texttt{Phi.source\_essay\_body=absent}
$$

$$
\texttt{Phi.glossary\_body=absent}
$$

$$
\texttt{Phi.translation\_accuracy=not\_computable}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 保留完整翻译与索引交付、保图与不动范围、相对时限以及源文依赖的验收限制。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{中文 essay \#13、术语表与先例英文文件的可核验内容，或可计算的翻译验收标准}
$$

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

### 3. 约束一致性

$$
Consistency=\text{PASS}
$$

### 4. 完成条件可判定性

$$
Decidable(K)=\text{FAIL}
$$

### 5. 合法解空间

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

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

### 7. 边界状态

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

## 6. Fixed Diff & Output Summary

[I] UNRESOLVED
[O] OK
[A] OK
[P] OK
[R] UNRESOLVED
[V] OK
[C] UNRESOLVED
[B] OK

## 7. Recommendation

提供需翻译正文和词汇表的只读快照，并将质量验收转为可复核规则后再发布。

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
| G7 | PASS | 7+1 完整且保留相对时限/源文缺失。 |
| G8 | PASS | 形式模型和结果可复放。 |
| G9 | PASS | 未把可写路径当作唯一执行方案。 |
| G10 | PASS | 无 Profile，正确未评估。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 通过；边界未充分确定，未生成 ADMIN_GOLD_FROZEN。
