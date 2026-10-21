## I｜输入与作用域

- 本阶段任务为 `TASK-20260530-001`，ADMIN→ME，优先级 P1，线程 `fcop-352-remediation-20260530`。来源：“`sender: ADMIN`”“`recipient: ME`”“`priority: P1`”及对应任务、线程字段。
- 修复对象仅为 `TASK-20260524-008`、`TASK-20260524-009`，所属线程为 `ai-must-write-it-down-20260524`；问题是旧规则下 blocked REPORT 仍触发归档的误完成链。来源：“`TASK-20260524-008` / `009`”“blocked REPORT 仍 archive_task”。

## O｜产物与交付

- 008、009 **各有一条新 REPORT**，每条均带 `supersedes:`，指向对应旧 REPORT；两项合计要求两条修复 REPORT。来源：“各有一条新 REPORT，`supersedes` 指向旧 REPORT”。
- 本阶段任务须有一份 ME→ADMIN 汇总 REPORT。它与上述逐任务修复报告分别承担阶段汇总和旧报告替代关系。来源：“本阶段 TASK 有 ME→ADMIN 汇总 REPORT”。

## A｜动作

- 以追加新 REPORT 的方式修复旧误完成链，建立对应的 `supersedes` 关系。来源：“追加带 `supersedes:` 的新 REPORT”。
- 对范围内 **blocked 且仍开放**的 TASK，从 `fcop/log/tasks/` 恢复至 `fcop/tasks/`。这是目录位置恢复要求，不是将 blocked 改判为 done。来源：“将 blocked 且仍开放的 TASK 从……恢复至……”。

## P｜参与关系

- ADMIN 向 ME 下达本阶段任务；ME 向 ADMIN 提交阶段汇总。来源：头部发送、接收字段及“ME→ADMIN 汇总 REPORT”。
- 007 的 git push 等待 ADMIN 二次确认，但该事项独立于本阶段，不构成本阶段执行前提。来源：“不在范围”“仍 blocked，等 ADMIN 二次确认”。

## R｜资源、数量与时间

- 修复对象共 **2 个 TASK**；归档目录与恢复目标目录按 A 所列固定。来源：“008 / 009”及两处目录路径。
- 原文没有规定截止时间、工时、预算或其他额度；P1 是给定优先级，不能据此换算数值时限。来源：“`priority: P1`”；全文未列其他资源或时间限额。

## V｜版本与依据

- 消息协议为 `fcop`、版本 `1`；背景给定“FCoP 3.2.5 Redeploy 已通过”。二者分别是消息版本与所述部署版本。来源：头部协议字段及背景原句。
- 修复依据为 `FCoP更新.md` 第十五节；旧 Rule 0.a.1 是误完成链背景，Rule 5 是追加式修改约束，Rule 0.a.5 / 0.a.6 对应自动 finish / archive 限制。来源：“按……第十五节”“旧 Rule 0.a.1”“Rule 5 append-only”“Rule 0.a.5 / 0.a.6”。
- 上述文档、规则全文未提供，不能据名称补充额外要求。

## C｜完成、停止及升级条件

本阶段验收须同时满足：

1. 008、009 的 TASK 均回到 open 区。
2. 两者各有新 REPORT，且 `supersedes` 指向各自旧 REPORT。
3. 本阶段 TASK 有 ME→ADMIN 汇总 REPORT。

来源：“验收”下三项要求。达到这些验收条件不产生自动 finish / archive 的授权，见 B。

原文未另设本阶段停止或升级流程。恢复动作中的“blocked 且仍开放”是对象条件，验收则明确要求两项均恢复；若实际状态不符合该条件，原文未说明如何处理该差异，不能擅自扩大恢复权限或取消验收项。

## B｜独立禁止与限制

- **不得修改旧 TASK、旧 REPORT 正文**；追加新 REPORT 与移动 TASK 的要求不取消此限制。来源：“不修改旧 TASK/REPORT 正文（Rule 5 append-only）”。
- 不执行 007 的 git push；其仍 blocked，等待 ADMIN 二次确认。来源：“不在范围”及对应条目。
- 不处理 010、011 的归档修复；原文认定其 REPORT done、归档合理。来源：“010 / 011（REPORT done，归档合理）”。
- 本阶段不包含自动 finish / archive。来源：“自动 finish / archive（Rule 0.a.5 / 0.a.6）”。

具体旧 REPORT 的标识、文件名及新 REPORT 标识未给出，但对应关系明确：每个新修复 REPORT 必须指向该 TASK 的旧 REPORT；这些待确定标识不构成范围歧义。