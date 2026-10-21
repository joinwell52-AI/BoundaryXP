## I｜输入与作用域

- 任务为 `TASK-20260512-008`，ADMIN 发给 ME，优先级 P1、风险 low、状态 READY；范围是 ADR-0033 sprint 的本地物理收口。原文：“sender: ADMIN”“recipient: ME”“物理产物仍在 working tree、未 commit”。
- 以原文声明的既有成果为输入：五个 Phase 已 ALL GREEN，working tree 已含 `fcop 1.6.0` 全部产物；本任务不重新实施五个 Phase。原文：“五个 Phase 已 ALL GREEN 闭环”“直接以新文法落档合规”。这些是原文前提，未作外部核验。
- 两次提交分别受以下白名单约束，不能用扩大提交范围来消除无关残留。原文：“双 atomic commit 闭环”“精确文件清单”。

**Commit #1：11 个路径，全部纳入**

| 类别 | 精确路径 |
|---|---|
| M | `CHANGELOG.md` |
| M | `adr/README.md` |
| M | `mcp/src/fcop_mcp/_version.py` |
| M | `src/fcop/_version.py` |
| M | `src/fcop/core/filename.py` |
| M | `src/fcop/rules/_data/fcop-protocol.mdc` |
| M | `tests/test_fcop/test_core_filename.py` |
| ?? | `adr/ADR-0033-trailing-slug-filename-adoption.md` |
| ?? | `fcop/log/tasks/TASK-20260512-006-ADMIN-to-ME.md` |
| ?? | `fcop/reports/REPORT-20260512-007-ME-to-ADMIN-adr-0033-trailing-slug.md` |
| ?? | `fcop/tasks/TASK-20260512-008-ADMIN-to-ME-adr-0033-sprint-commit.md` |

来源：“7 件 M”“3 件 ??”“+ 本 TASK-008”及 Commit #1 白名单。

**Commit #2：3 个路径变更，全部纳入**

| 状态／用途 | 精确路径 |
|---|---|
| 删除原位置 | `fcop/tasks/TASK-20260512-008-ADMIN-to-ME-adr-0033-sprint-commit.md` |
| 新增归档位置 | `fcop/log/tasks/TASK-20260512-008-ADMIN-to-ME-adr-0033-sprint-commit.md` |
| 新增本任务报告 | `fcop/reports/REPORT-20260512-008-ME-to-ADMIN-adr-0033-sprint-commit.md` |

来源：Commit #2 白名单中的“状态: deleted”“archive 落点”“本 task 的 REPORT”。

## O｜产物与交付

- 交付两个本地 atomic commit、归档后的 TASK-008 和 REPORT-008；REPORT-008 必须记入两个 commit hash。原文：“Commit #1 落盘 + commit hash 记入 REPORT-008”“Commit #2 落盘 + commit hash 记入 REPORT-008”。
- 原文给定两条提交标题：

  ```text
  feat(filename): adopt trailing-slug grammar (ADR-0033 · fcop 1.6.0)
  chore(fcop): rule 0.a.1 closure for ADR-0033 sprint (TASK-008 archive + REPORT-008)
  ```

  两个 message 均须符合 `<type>(<scope>): <subject>`、无 emoji，并包含出处。原文：“严格遵守仓库历史风格”“commit message 内容必带出处(commit hash + 文件路径 + ADR-0033)”。
- 对五类历史噪音，必须在 commit #2 末尾或 REPORT-008 末尾向 ADMIN 列出“建议另起 task 处理”；位置二选一，原文未选定。来源：“会在 commit #2 末尾或 REPORT-008 末尾向 ADMIN 列出”。

## A｜动作与顺序

必须保留以下顺序及两次提交的独立性：

`写 TASK-008 → 精确暂存并 commit #1 → 写 REPORT-008 → 将 TASK-008 从 tasks/ 归档到 log/tasks/ → 精确暂存并 commit #2`

来源：实施步骤 Step 1–5；协议要求“write_task → do → write_report → archive”。

TASK-008 须先以活动任务身份进入 commit #1，再在 commit #2 中记录原位置删除及归档位置新增，不能直接跳过第一次入历史。原文：“与产物同 batch 入历史”“commit #1 后从 tasks/ 移走”。

## P｜参与关系

- ADMIN 提案和决策，ME 执行；原文将任务文件视为两个视角的载体。来源：“本 task 由 ADMIN 提案、ME 执行,文件即代表两个视角”。
- REPORT-008 面向 ADMIN；历史噪音处理建议也交给 ADMIN，历史 patch 脚本去留由 ADMIN 评估。来源：报告路径中的 `ME-to-ADMIN`、“待 ADMIN 评估去留”。
- tag、push、PyPI 发布的后续授权归 ADMIN，本任务不取得这些授权。原文：“这些都需要 ADMIN 二次确认,本 sprint 不涉及”。未另行指定独立复核人或验收人。

## R｜数量、资源及时间

- 提交数量为 **2 次**。Commit #1 为 `7 + 3 + 1 = 11` 个路径；Commit #2 为 3 个路径变更，其中任务归档表现为一删一增。来源：两次提交范围及白名单。
- 两次白名单合计 **14 个路径变更项、13 个不同路径**；活动 TASK-008 路径跨两次提交重复出现。此数量不等同于最终保留文件数。
- 执行范围仅本地仓库；原文：“本次只本地落 commit”。
- 决策时间为 `2026-05-12 23:33`，创建时间为 `2026-05-12T23:35:00+08:00`；原文未给截止时间或耗时额度，P1 不转换为数值时限。

## V｜版本与依据

- 任务协议为 `fcop`、`version: 1`；产物版本为 `fcop 1.6.0`，二者不能混为同一版本字段。来源：头部元数据及“全部产物(`fcop` 1.6.0)”。
- TASK-008 文件名的 trailing slug `-adr-0033-sprint-commit` 按 1.6.0 新文法使用；原文将其称为“首次落盘自证”。
- 业务依据为 ADR-0033、REPORT-007 和 ADMIN 本次决策；执行约束引用 Rule 0.a.1、0.b、0.c、5、7、7.5。codeflow collection commit、6 件 atomic commit 风格及 PM #69 是参照，不能据此把本任务数量改成 6 件。来源：“类比”“参照”及协议合规守则。

## C｜完成、停止与待澄清处

**完成须同时满足：**

- 两次提交均已落盘，两个 hash 均进入 REPORT-008；这是显式关闭条件。原文：“closes_on:两个 commit hash 都进 REPORT-008”。
- 两次提交后，`git status` 只剩下文列明的五类范围外历史 untracked，不能残留本 sprint 未提交变更。原文：“只剩 ADR-0033 范围外的 5 类历史 untracked”。
- 提交信息、归档和全部禁止事项满足对应边界。来源：DoD 与协议合规守则。

**具体局部问题：**

1. **Commit #2 的 hash 回写与收口要求存在冲突。** REPORT-008 要进入 commit #2，又须记录 commit #2 自身最终 hash。该 hash 在提交生成后才确定；之后回写会留下已跟踪文件修改，违背最终状态要求，修改该提交又会改变 hash。原文未给出同时满足“两次提交”“两个 hash 都进报告”和“仅剩五类 untracked”的机制，不能自行增加第三次提交或放宽验收。
2. **步骤表的 clean 与 DoD 不一致。** Step 2 写“tree clean except #2 后续产物”，Step 5 写“tree clean”，但明确要求五类历史 untracked 保留。若 clean 指完整 `git status`，二者冲突；若仅指本 sprint 范围，则可兼容，原文没有明示该限定。
3. **message 出处中的 hash 指代未明确。** Rule 0.c 要求“commit hash + 文件路径 + ADR-0033”，但未说明引用哪个提交的 hash；给出的标题也未完整包含这些出处。不得自行认定其要求提交自身 hash。

原文未给其他停止或异常升级条件；上述问题不能通过擅自删改文件、扩大提交或发布来解决。

## B｜独立禁止与限制

| 对象 | 边界 | 短原文依据 |
|---|---|---|
| `.scratch/` | 两次 sprint 提交均不得混入；仅作为后续 `.gitignore` 改进候选 | “不加”“不混进本 sprint commit” |
| `fcop_events.jsonl` | 同上 | “运行时事件日志”“不加” |
| `mcp/fcop_events.jsonl` | 同上 | “同上”“不加” |
| `scripts/_*_commit_msg.txt` | 同上 | “历史 commit message 草稿”“不加” |
| `scripts/patch_*.py` | 不纳入本 sprint，去留待 ADMIN 单独评估 | “不加,待 ADMIN 评估去留” |
| TASK-006、REPORT-007、ADR-0033 | 纳入提交，但不得回头改内容；限制逐一适用于三者 | “不回头改它们的内容” |
| tag | 不打 tag；`v1.6.0` 延后由 ADMIN 单独触发 | “不打 tag”“推迟到 ADMIN 单独触发” |
| 远端及发布 | 不 push origin，不发布 PyPI | “不 push origin”“不发布 PyPI” |
| 项目根目录 | 不写业务代码，不新增根目录文件；既有 `CHANGELOG.md` 仍按白名单提交 | “不向项目根写业务代码”“无新文件落根” |

五类是路径类别，**不是五个文件**；后续评估建议不构成本次修改 `.gitignore`、清理噪音或删除脚本的授权。来源：“不在 ADR-0033 范围内,要单独评估”。