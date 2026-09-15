# 离线金标草稿工作区 / Offline gold draft workspace

此工具为独立审阅准备原文、包锁、上下文和可编辑候选，不读取模型输出、不调用模型、不自动填写答案或认证审阅。原120条语料及review-index保持不变。

This tool prepares source-bound annotation drafts without model calls or model-generated answers. The original corpus and review index are not modified. Draft checking does not certify semantic correctness or independent review.

## 使用 / Usage

```text
node scripts/prepare-admin-review.mjs --plan
node scripts/prepare-admin-review.mjs --create
node scripts/prepare-admin-review.mjs --create-io
node scripts/prepare-admin-review.mjs --create-authored
node scripts/prepare-admin-review.mjs --check <workspace-path> T001
node scripts/prepare-admin-review.mjs --check-all <workspace-path>
```

默认仅离线检查计划。`--create`在本项目忽略提交的`.boundx/gold-review/<随机ID>/`创建120个独立场景；每条包含Registry、prepared.json和draft.json。重复运行使用新目录，不覆盖已有标注。manifest逐条原子更新；进程中断后的BUILDING不代表创建完成，可保留用于故障检查。

The default prints a plan only. Creation writes a new private workspace with 120 isolated setups and an incrementally persisted manifest. Existing annotations are never overwritten. An interrupted BUILDING manifest is incomplete, not a successful export.

每条draft.json中的binding固定原文、语言、setup、原有检查点、包锁、profile、规则和Schema摘要。检查点是待审要求，不是答案。审阅者可编辑author_notes，并将allowed_answers从null填为1–16个明确的结构化候选替代表示；候选合同来自prepared.json内的candidate_schema。不得修改binding、binding_digest，或把review_status改成APPROVED。

The binding freezes source, setup, checkpoints, package/profile/rule identities and the Schema digest. Edit author_notes and allowed_answers only. Each answer follows the supplied candidate Schema and declares producer_kind structured-replay; alternatives must not be duplicate objects. No programmatic approval is supported.

`--check`先检查工作区身份与保存快照，再通过唯一候选复核/Core检查引用、引文、摘要、三态及约束。原文篡改、异快照答案、伪造证据和自称审阅完成不能通过。退出码0仅表示提交的候选结构检查全部通过；空答案或无效候选为非零。结果始终PENDING_GOLD_REVIEW，precision/recall为null。

Checking verifies bindings and candidate structure using the existing Core. Exit zero means structural checks passed, never semantic correctness. Missing answers, fabricated quotes or invalid candidates cannot count as reviewed cases. Precision and recall remain null.

## 证据与限制 / Evidence and limitations

### 首批答案草稿 / Initial authored answers

`--create-io`仍创建全新的120条工作区，但为T001–T010装入逐条编写的输入/输出候选；其余110条为空。原有工作区和审阅笔记不被覆盖。草稿见[IO答案源文件](../fixtures/admin-text/authored-io-drafts.mjs)，保留原文、引文、动作与参与角色解释、备选不确定性及双语理由。

`--create-io` creates a fresh 120-case workspace with authored IO candidates for T001–T010; the other 110 remain blank. Existing annotations are untouched. The linked source records exact text, quotes, actions, participant roles, unresolved alternatives and bilingual rationale.

这些答案由Codex编写，结构验证只检查其能否合法进入Core，不证明正确；不是独立审阅或冻结金标。当前采用原文文字主体，不声称已经补齐语义包身份映射、所有允许答案、typed关系或BXP预期；这些仍须审阅补充。发送不当作创建，接收者不当作执行人，未写出的资源、版本和停止条件不补造。

These Codex-authored candidates are neither independently reviewed nor frozen gold. Core validation checks structure, not correctness. Textual participants do not complete pack identity mappings, all acceptable alternatives, typed relations or expected BXP results. Transfer is distinct from creation; recipients are not senders, and absent resource/version/stopping requirements are not invented.

### 全量初稿 / Complete first drafts

`--create-authored`创建新的120条工作区，给全部固定原文装入逐条编写的初版答案；`--create`仍创建空标注，`--create-io`仍只填10条。草稿通过同一候选检查才保存；创建失败标记BUILD_FAILED，绝不标成审阅完成。新工作区不会覆盖之前的10条或120条空工作区。

`--create-authored` creates a fresh workspace with individually authored first candidates for all 120 fixed texts. The blank and IO-only modes retain their behavior. Candidates must pass structural checks before saving; failed builds remain BUILD_FAILED, never reviewed. Previous workspaces are untouched.

作者数据入口：[初稿索引](../fixtures/admin-text/authored-initial-drafts.mjs)；[模态与禁止](../fixtures/admin-text/authored-modality-drafts.mjs)、[行业/身份/职责](../fixtures/admin-text/authored-domain-drafts.mjs)、[数量/条件/依据/完成](../fixtures/admin-text/authored-boundary-drafts.mjs)、[Unicode/快照/对抗](../fixtures/admin-text/authored-safety-drafts.mjs)。所有条目保留双语解释，未通过生产模型输出倒推答案。

Authored data are linked by category above, with bilingual rationale. These were written from the source texts and checkpoints, not copied from production-model outputs.

14条指定身份用例增加显式作者ID映射并从原prepare获取完整包引用；共享“小王”保留e101/e102，不选第一个；客户B绑定b101，停用L3的用例不引用员工。映射缺失或快照不匹配会拒绝生成，不自动修补为别的身份。它们仍是作者提出的身份答案，不是独立身份审阅证明。

Fourteen designated identity cases use explicitly authored employee IDs with full references from the original prepare. Shared aliases retain e101/e102, tenant B uses b101, and disabled-L3 cases omit employee references. Missing identity or mismatched context fails instead of selecting another person. These remain proposed answers, not independent identity-review certification.

数量组已经包含精确十进制和整数区间、确定性分钟换秒；两个明确循环用例有依赖边；重复引文有前后文定位，POL-1用例引用实际附加原文。测试验证这些结构进入Core后的区间空集、依赖环和码点证据，不自动认证全文解释正确。其余复杂scope、交接、名册引用、允许替代表示、独立诊断与完整BXP预期仍未全部冻结。120条初稿不等于120条金标完成，独立审阅仍为0/120。

Quantity drafts include exact decimal/integer intervals and explicit minute-to-second conversion; two cycle cases include dependency edges. Repeated quotes use context locators, and POL-1 uses actual attachment text. Tests check these computations and codepoint evidence, not complete semantic correctness. Complex scopes, handoffs, directory references, alternative answers, diagnostic expectations and complete BXP expectations are not all frozen. All 120 first drafts remain pending independent review: 0/120 reviewed.

### 整批审计 / Whole-workspace audit

`--check-all`逐项核对固定120条，不读取模型答案、不修改标注。输出逐例状态及按语言、测试类别汇总的数量：`STRUCTURALLY_VALID`结构合法、`UNANNOTATED`未标注、`INVALID_ANSWERS`答案无效、`UNAVAILABLE`文件缺失或身份/快照损坏。每条始终占一个位置；未知答案数量为null，不把缺失项从分母删除。测试类别不是行业覆盖。

`--check-all` audits all 120 fixed cases without reading model outputs or editing annotations. It reports structural validity, unannotated cases, invalid answers and unavailable contexts, with language/category counts. Every case retains its slot. Unavailable answer counts are null; categories do not represent industry coverage.

工作区清单必须创建完成、包含120个唯一且与固定语料对应的ID/原文摘要，并保持未认证状态。不完整、重复或自称认证的清单不能通过单例或整批检查。整批结果始终`PENDING_GOLD_REVIEW`；只有全部结构合法时退出码为0，仍不代表独立审阅通过或正式验收完成。审计不输出原文、绝对路径或原始异常信息；文件摘要只证明一致性，不认证审阅者身份。

The manifest must be complete, contain exactly 120 unique corpus-bound IDs/source digests, and remain unverified. Incomplete, duplicate or self-certified manifests fail. Exit zero requires all candidates to be structurally valid, but never certifies independent review or acceptance. Reports omit source text, absolute paths and raw exceptions; hashes are consistency checks, not reviewer authentication.

- 不展示当前模型答案，避免直接按实现输出倒推金标；但语料本身是可见工程集，不能称为隐藏测试集。
- changed-after-prepare保留审阅的原始快照；候选检查显式使用历史回放，不模拟正式运行的stale验收。运行器仍负责该场景的激活切换测试。
- manifest和摘要用于一致性检查，不是签名或审阅者身份认证；能修改全部文件的人可重建摘要。
- 合法候选不保证解释正确；此工具不生成允许诊断、BXP预期或语义匹配规则。它们仍需单独编写、冻结及独立审阅，之后才能启用最终评分。
- Registry与草稿可能含上下文数据，留在私有本地目录；没有外发、自动提交、训练或执行动作。

Historical review is distinct from stale-run acceptance. Hashes detect inconsistent edits, not authenticated authorship. Semantic answer sets, diagnostic expectations, expected calculations and matching rules still require independent review and freezing before final scoring.

## 本轮验证 / Verification

7项新增测试实际构建全部120条离线草稿，检查原文、包锁、候选编辑与篡改拒绝，并覆盖tenant-b、附加政策及历史快照；没有真实模型调用。全量本地已跟踪Core 547/547、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20通过。真实生成和独立审阅数量不因这些测试增加。

Seven new tests include a complete 120-draft offline build. Tracked Core547, UI154, protocol103, frozen vectors208, Python135 and documentation20 pass locally. No live generation or independent review is claimed.
