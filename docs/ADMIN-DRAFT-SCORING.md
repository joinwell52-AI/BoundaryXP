# 草稿比较器 / Draft comparison

这是用于审阅准备的确定性比较器，不是已冻结的WP1语义判定器，不启用正式98%/95%门槛，也不把未审草稿当作金标。

This deterministic draft comparator is not the frozen WP1 semantic matcher. It does not activate acceptance thresholds or treat unreviewed drafts as gold labels.

```text
node scripts/score-admin-draft.mjs <workspace-path> T001 <candidate.json>
node scripts/score-admin-draft.mjs <workspace-path> T001 --missing
```

工作区由[离线审阅工具](ADMIN-GOLD-DRAFTS.md)生成，allowed_answers需先填写明确候选。命令读取文件并调用现有候选复核与唯一Core，没有模型调用、自动修复、自动补齐或回写金标。CLI退出码0表示生成了比较报告，不表示样本正确；NOT_SCORED或输入文件读取失败返回非零。

Use an offline review workspace with authored answer alternatives. Exit zero means a comparison report was produced, not that a prediction is correct. Missing annotations remain NOT_SCORED. Neither observations nor expectations are rewritten.

## 匹配规则 / Matching rules

- 每个完整答案替代表示分别报告，不把不同答案的正确部分拼成一个虚假全对答案，不挑选较小分母自动给最终成绩。
- 每个桶按status、条目内容（忽略局部entry id）和原始解释/语义引用精确匹配。原文、Unicode码点证据、normalized数据及引用均不模糊归一化。
- 使用多重集一对一计数：同一预测重复两次只能匹配一次，额外条目计误报。
- 关系与scope整体另做精确比较，保留标识符和顺序；条目分数高不能掩盖关系不一致。
- 三态、原因码和显式B召回单列；不把无B样本当作B召回成功。
- 临时条目指标列于provisional_alternatives；顶层precision/recall始终null，independent_review_verified与acceptance_passed始终false。

Alternatives are never combined. Entries match exactly as multisets; local entry IDs alone are ignored, while evidence and semantic interpretation remain significant. Relations/scopes and state/reason equality are separate. This conservative matcher does not recognize arbitrary paraphrases or equivalent reordered relations.

## 失败分母 / Failure denominators

### 证据诊断 / Evidence diagnostics

比较器0.2.0在每个答案的八桶字段下增加`evidence`计数：按来源ID、原始引文及Core定位后的Unicode码点区间进行多重集匹配。重复引文不同位置不等同；跨桶引用不互相抵消；重复预测保留误报。候选不能提交UTF-16位置冒充定位，仍由原有生产者定位规则核验。

Matcher 0.2.0 adds per-field evidence counts for each answer alternative. Source identity, exact quote and Core-located Unicode codepoint spans must match as multisets. Different occurrences, buckets and duplicate predictions remain distinct. Existing producer rules, not model-supplied offsets, locate evidence.

这些逐桶计数仅诊断条目证据，不证明引用蕴含该解释。即使引文全匹配，错误解释仍导致条目不匹配；原有关系检查和整体匹配条件不变。缺失输出保留预期证据分母，非法输出的预测数未知时为null。版本与摘要变化后，批量工具拒绝混合旧版报告。

These per-field diagnostics cover entry evidence, not semantic entailment. Correct citations cannot excuse incorrect interpretations. Relation and whole-answer checks remain unchanged. Missing output retains expected evidence; unparseable predictions have null counts. Matcher identity changes, so mixed-version batches are rejected.

### 约束诊断 / Constraint diagnostics

比较器0.3.0为每个完整答案增加`constraints`，分别统计五类已注册约束及其证据，不复制协议枚举。完整约束按含ID的精确内容进行多重集匹配；证据必须同时匹配父约束ID及原文定位，不能借另一约束的引文抵消误报。`scopes_exact`单列scope差异。非法或缺失输出保留分母。

Matcher 0.3.0 adds per-alternative `constraints` counts for each registered family without redefining protocol enums. Full constraints match exactly, including IDs, as multisets. Evidence matches require the parent constraint ID and exact source span. `scopes_exact` reports scope differences separately. Missing or rejected output retains denominators.

这些是保守草稿诊断，不是冻结语义评分：约束重排可能逐项匹配，但原有`relations_exact`仍保留顺序检查，整体不会因此通过。依赖方向、数值、单位或身份变化不能靠引用正确获得关系匹配。测试中的人工约束仅验证比较器机制，不是原文语义金标。

These remain conservative draft diagnostics, not frozen semantic scoring. Reordered constraints may match individually while the existing order-sensitive `relations_exact` and whole-answer check still fail. Correct citations do not excuse changed direction, values, units or identities. Synthetic constraint fixtures test comparison mechanics, not source-text gold semantics.

显式缺失输出保留每个答案的完整expected数量，所有应有条目计false_negative；不能匹配本来absent的桶来掩盖整次失败。非法JSON、伪造引文、异快照候选同样保留应有条目分母。无法解析的输出其predicted/false_positive为null，不能编造零误报；结构可解析但被拒绝的条目全部为未匹配预测。错误地全标unresolved不匹配期望resolved条目。

Missing or rejected observations retain every expected item as a false negative. Unparseable output has unknown predicted/false-positive counts, not fabricated zero errors. All-unknown output does not match resolved expectations. Unreadable or oversized files fail explicitly rather than silently becoming successful empty samples.

## 仍待完成 / Still required

正式评分仍需独立审阅答案集合、允许诊断、关系/人物/模态/单位/scope断言，冻结匹配版本与摘要，并按全部固定运行逐语言、类别汇总。该比较器逐例保留语言与类别，但不宣称完成这些统计验收。对故意非法注入需冻结独立的诊断预期，不能把本工具的所有REJECTED一概当通过。

Final scoring still requires independently reviewed semantic answers and diagnostic expectations, a frozen matching policy and complete per-language/category aggregation over the required runs. Rejected adversarial cases are not automatically passes. Historical draft comparison does not replace live stale-snapshot or safety acceptance.

## 验证 / Verification

新增7项比较器测试覆盖局部ID变化、缺失输出、全未知、重复预测、非法JSON/UTF-8、异快照、伪造证据、多答案混合、空标注及关系变化；原120草稿集成测试增加文件评分和缺失输出路径。已跟踪Core 554/554、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20通过。没有真实模型生成或独立金标审阅。

Seven new tests and the existing 120-draft integration cover comparison and file entry points. Local tracked Core554, UI154, protocol103, frozen208, Python135 and documentation20 pass. These are deterministic engineering checks, not live-model or reviewed semantic scores.
