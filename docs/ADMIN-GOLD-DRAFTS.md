# 离线金标草稿工作区 / Offline gold draft workspace

此工具为独立审阅准备原文、包锁、上下文和可编辑候选，不读取模型输出、不调用模型、不自动填写答案或认证审阅。原120条语料及review-index保持不变。

This tool prepares source-bound annotation drafts without model calls or model-generated answers. The original corpus and review index are not modified. Draft checking does not certify semantic correctness or independent review.

## 使用 / Usage

```text
node scripts/prepare-admin-review.mjs --plan
node scripts/prepare-admin-review.mjs --create
node scripts/prepare-admin-review.mjs --check <workspace-path> T001
```

默认仅离线检查计划。`--create`在本项目忽略提交的`.boundx/gold-review/<随机ID>/`创建120个独立场景；每条包含Registry、prepared.json和draft.json。重复运行使用新目录，不覆盖已有标注。manifest逐条原子更新；进程中断后的BUILDING不代表创建完成，可保留用于故障检查。

The default prints a plan only. Creation writes a new private workspace with 120 isolated setups and an incrementally persisted manifest. Existing annotations are never overwritten. An interrupted BUILDING manifest is incomplete, not a successful export.

每条draft.json中的binding固定原文、语言、setup、原有检查点、包锁、profile、规则和Schema摘要。检查点是待审要求，不是答案。审阅者可编辑author_notes，并将allowed_answers从null填为1–16个明确的结构化候选替代表示；候选合同来自prepared.json内的candidate_schema。不得修改binding、binding_digest，或把review_status改成APPROVED。

The binding freezes source, setup, checkpoints, package/profile/rule identities and the Schema digest. Edit author_notes and allowed_answers only. Each answer follows the supplied candidate Schema and declares producer_kind structured-replay; alternatives must not be duplicate objects. No programmatic approval is supported.

`--check`先检查工作区身份与保存快照，再通过唯一候选复核/Core检查引用、引文、摘要、三态及约束。原文篡改、异快照答案、伪造证据和自称审阅完成不能通过。退出码0仅表示提交的候选结构检查全部通过；空答案或无效候选为非零。结果始终PENDING_GOLD_REVIEW，precision/recall为null。

Checking verifies bindings and candidate structure using the existing Core. Exit zero means structural checks passed, never semantic correctness. Missing answers, fabricated quotes or invalid candidates cannot count as reviewed cases. Precision and recall remain null.

## 证据与限制 / Evidence and limitations

- 不展示当前模型答案，避免直接按实现输出倒推金标；但语料本身是可见工程集，不能称为隐藏测试集。
- changed-after-prepare保留审阅的原始快照；候选检查显式使用历史回放，不模拟正式运行的stale验收。运行器仍负责该场景的激活切换测试。
- manifest和摘要用于一致性检查，不是签名或审阅者身份认证；能修改全部文件的人可重建摘要。
- 合法候选不保证解释正确；此工具不生成允许诊断、BXP预期或语义匹配规则。它们仍需单独编写、冻结及独立审阅，之后才能启用最终评分。
- Registry与草稿可能含上下文数据，留在私有本地目录；没有外发、自动提交、训练或执行动作。

Historical review is distinct from stale-run acceptance. Hashes detect inconsistent edits, not authenticated authorship. Semantic answer sets, diagnostic expectations, expected calculations and matching rules still require independent review and freezing before final scoring.

## 本轮验证 / Verification

7项新增测试实际构建全部120条离线草稿，检查原文、包锁、候选编辑与篡改拒绝，并覆盖tenant-b、附加政策及历史快照；没有真实模型调用。全量本地已跟踪Core 547/547、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20通过。真实生成和独立审阅数量不因这些测试增加。

Seven new tests include a complete 120-draft offline build. Tracked Core547, UI154, protocol103, frozen vectors208, Python135 and documentation20 pass locally. No live generation or independent review is claimed.
