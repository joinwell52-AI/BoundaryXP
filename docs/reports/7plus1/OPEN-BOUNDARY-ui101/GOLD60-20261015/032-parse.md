### I｜输入与作用域

- 任务为 `TASK-20260513-002`，由 ADMIN 发给 ME；关联已归档的 `TASK-20260513-001` 和 `REPORT-20260513-001`，属于 `release-sop-v2` 线程。优先级 P1、风险 low。（依据：`sender: ADMIN`、`recipient: ME`、`related`、`priority: P1`、`risk_level: low`）
- 修改范围是 `docs/release-process.md` 的两处：阶段 4“发布后验证 + Rule 0.a.1 闭环”的 `archive + commit` 子段，以及“常见故障与回滚”。另有本任务 TASK、REPORT 文件的提交要求。（依据：“**两处**加新条款”“本意 3 个文件(docs + TASK-002 + REPORT-002)”）
- 事故输入：此前 `git add -A` 将 19 份 untracked 残留带入 `d2ed13c`，随后按 ADMIN 决策 revert + redo 修复；19 是历史事故数量，不是本次文件额度。（依据：“意外把 19 份 untracked 残留……塞进了 `commit d2ed13c`”）

### O｜产物与交付

| 产物 | 必须包含的内容 | 短原文依据 |
|---|---|---|
| 文档处 1 | 整段重写原 `git add -A && git commit -F ...` 命令；禁止 `git add -A`，显式列出全部拟入库文件；commit 前运行 `git status --short`，二次确认 staging 区仅有本意文件；以链接引用完整四次提交链，解释事故与修复依据 | “命令**整段重写**”“列出所有要入库的文件”“作为……链接” |
| 文档处 2 | 新增完整“问题 7”，题为 `问题 7:commit 意外携带 untracked 残留(`git add -A` 后悔药)`；涵盖现象、根因、立即修复 revert + redo，以及长期防范：显式路径、`.gitignore` 补 `.scratch/`、`fcop_events.jsonl`、`scripts/_*.txt`；直接引用四次提交链 | “新增 `问题 7`”“现象、根因、立即修复……长期防范” |
| 报告 | 写成 `REPORT-20260513-002-ME-to-ADMIN-add-git-add-explicit-paths-rule.md`；原文未另定报告结构 | “写 `REPORT-20260513-002-ME-to-ADMIN-add-git-add-explicit-paths-rule.md`” |
| 仓库交付状态 | 本任务形成干净的单个 commit，并成功 push 至 `origin main` | “push origin main 成功,main 历史保持单 commit 干净” |

两处文档须**各自**明确指向 `d2ed13c`、`cc60186`、`979bcd2`、`dfe68e3`，不能只在其中一处给依据。（依据：“**两处都**明确指向……作为依据(commit hash 短)”）

### A｜动作

- 将规则实际写入文件，不能以口头承诺代替；完成两处文档修改和报告编写。（依据：“口头沉淀不算数,必须落文件”）
- 本任务自身必须实践新规则：使用显式路径 `git add`；在 commit 前运行 `git status --short` 并确认 staging 区的文件集合恰为 docs、TASK-002、REPORT-002；随后完成 commit 和 push。（依据：“**Dogfood**”“commit 前……确认 staging 区只包含本意 3 个文件”）
- `revert + redo` 是故障条款须写明的修复方法；本任务自身的回滚手段为 `git revert`，原文没有要求现在执行回滚。（依据：“立即修复(revert + redo)”“回滚:`git revert` 即可”）

### P｜参与关系

- ADMIN 是任务发出方；ME 是任务接收、执行主体；报告命名明确指向 ME → ADMIN。（依据：`sender: ADMIN`、`recipient: ME`、报告名中的 `ME-to-ADMIN`）
- 历史事故的 revert + redo 由 ADMIN 决策；原文没有为本次任务另设复核人、审批环节或必须等待 ADMIN 确认的门槛。（依据：“ADMIN 决策 revert + redo”；本次验收清单）

### R｜资源、数量与时间

- 文档修改位置为 **2 处**；本次 commit 的文件集合为 **3 个文件**：
  \[
  \{\text{docs/release-process.md},\ \text{TASK-002 文件},\ \text{指定 REPORT-002 文件}\}
  \]
  必须全部包含，且不能额外包含其他文件。（依据：“两处”“只包含本意 3 个文件”）
- 本任务在 main 上的交付为 **1 个干净 commit**；历史四次提交只是依据，不是要求本次重演四次提交。（依据：“main 历史保持单 commit 干净”）
- 创建时间为 `2026-05-13T01:12:00+08:00`；没有给截止时间、工时或数值化响应时限。“立即修复”是故障条款中的定性要求。（依据：`created_at`、“立即修复”）

### V｜版本与依据

- 任务封装为 `protocol: fcop`、`version: 1`；背景对应已归档的 SOP v2 沉淀任务。封装版本不等于要求变更协议版本。（依据：头部字段、“SOP v2……(已归档)”）
- 两处规则共同依据 main 历史链：
  `d2ed13c`（误带残留）→ `cc60186`（revert）→ `979bcd2`（clean SOP）→ `dfe68e3`（artifacts + `.gitignore` tighten）。（依据：“这条完整的 main 历史作为依据”）
- 落文件要求援引 FCoP Rule 0.a；目标修改段包含 Rule 0.a.1 闭环。（依据：“根原则(Rule 0.a)”“阶段 4……Rule 0.a.1 闭环”）

### C｜完成、停止与升级条件

- 完成须同时满足：两处文档内容完整、两处各有全部四个短 hash 依据、指定报告已写、本次提交遵循显式路径与提交前检查、提交文件恰为指定三类文件、push 成功且 main 上本次交付只有一个干净 commit。（依据：全部“验收 / Acceptance”条目）
- 未规定独立的停止条件、失败升级路径或追加审批条件；提交与 push 是否成功属于未来待验收状态，不是边界歧义。

### B｜独立禁止与限制

- 文档规则与本任务实际提交均禁止使用 `git add -A`。（依据：“❌ 不要 `git add -A`”“不许再用 `-A`”）
- 不动协议、不发版，业务修改限定为维护者文档增加约束。（依据：“只改维护者文档,加约束、不动协议、不发版”）
- `.gitignore` 三类补项是必须写入“长期防范”的内容；原文未要求本次直接修改 `.gitignore`，且本次提交的三文件集合不包含它。（依据：“长期防范……`.gitignore` 补……”及三文件限制）
- **局部未明确项**：TASK-002 文件的完整路径、报告所在目录、四个 commit 链接的仓库 URL 均未给出；不得自行补定。它们不取消文件身份、报告文件名、三文件限制和链接依据要求。