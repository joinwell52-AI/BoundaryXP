## I｜输入与作用域

- 将 v1.6.0 完整发版的 **9 处实战经验**沉淀为可复用 SOP v2，主要对象为 `docs/release-process.md`，供下次发版独立使用。依据：“把这 9 处经验吸收回……SOP v2”“不再依赖某个人的记忆”。
- 经验关联已归档任务 `TASK-20260512-009` 及 `REPORT-20260512-009`；原文只提供关联标识，未提供两份文件正文。依据：`related`。
- 本次是文档维护任务；SOP 中的构建、部署、打 tag、发布和验证，是需写明的未来发版步骤，不是本次发版指令。依据：“本次只改文档”。

## O｜产物与交付

| 产物 | 必须满足的边界 | 短原文依据 |
|---|---|---|
| `docs/release-process.md` | 完成下述全部改写和新增；9 处差异逐条有命令、文件路径或验证方法，且脱离本 TASK 仍可独立理解 | “9 处差异全部落到文件”“每条都有可执行步骤”“独立看懂” |
| docs 元信息 | 附一段说明本次仅涉及 docs；具体附在哪里未明确 | “只在改 SOP 时附一段元信息说本次只是 docs” |
| 总结报告 | 文件名为 `REPORT-20260513-001-ME-to-ADMIN-release-sop-v2-after-1-6-0.md` | “写……总结” |
| 归档结果 | 本 TASK 与本 REPORT 一起归档至 `fcop/log/`，形成 Rule 0.a.1 闭环 | “TASK + REPORT 一起 archive 到 `fcop/log/`” |
| 仓库交付 | 要求 commit，并 push 至 `origin main`；其状态前提及风险描述存在局部问题，见 C、B | “`git status` 干净后 commit + push origin main” |

## A｜动作与内容要求

以下均为**本次必须写入 SOP 的内容边界**；涉及未来发版的条件和顺序须保留。

| 项目 | 必须保留的要求 | 短原文依据 |
|---|---|---|
| 版本示例与核心约束 | 示例统一为 `1.x.y`，使用 `v1.6.0`／假想 `v1.7.0`；保留“核心约束”，去掉 ADR-0003 SemVer 子段的 `0.6.N` 残留措辞 | “统一升到 `1.x.y`”“核心约束……保留” |
| 检查清单 A：代码 | 说明 MCP 依赖按 MAJOR 锁定，实际范围为 `fcop>=1.0,<2.0`；要求双包 `_version.py` 对齐 | “MAJOR 锁说明 + `_version.py` 双包对齐” |
| 检查清单 B：测试与 CI | 明确 lint/mypy 的 release-gate 范围为 `src tests mcp/src`；`scripts/` 历史 lint 非阻塞 | “明确 release-gate 范围”“`scripts/` 标为‘非阻塞’” |
| 检查清单 C：文档 | 必查 `README.md` 的 Current release、`letter-to-admin.{zh,en}.md` 两种语言摘要块、`tests/test_fcop/test_rules.py` 硬断言 | “新增三连”“三个点必查” |
| 检查清单 D：Git | 保持不变；未提供原段落，无法在此展开其已有要求 | “D. Git — 不变” |
| P=E 同步 | 新增专段，作为发 tag 前最后一步；讲明 `redeploy_rules()` 与 Python API 两条路径，其中常规 API 路径为 `Project.deploy_protocol_rules(force=True)`；同步涉及 `.cursor/rules/*.mdc`、`AGENTS.md`、`CLAUDE.md` | “发 tag 前最后一步”“必须在 tag 前跑” |
| Rule 0.a.1 | 新增专段，将发版载体 `TASK-*-release-x-y-z.md`、配套 `REPORT-*`、archive 列为每次发版强制交付物 | “三件套”“不是可选” |
| 发布步骤 | 顺序为：①本地 build + smoke；②仅 RC 走 TestPyPI；③push tag 触发 `release.yml`；④闭环 | “阶段 1……阶段 4”“RC 才走 TestPyPI” |
| 发布后验证 | 写明 `release.yml` 成功后，公网 `pip install` 可能仍需等待 CDN 传播；说明 PyPI JSON API 比 pip 索引更早可见 | “可能要等几分钟”“更早可见” |
| 旧 MCP wheel 应对 | 当 `fcop_report()` 显示 MCP server 使用旧 `fcop@X.Y.Z`，且本地源码已为新版时，直接调用 Python API `Project(...).deploy_protocol_rules()` 绕过 MCP 工具 | “本地源码已是新版”“绕过 MCP 工具” |
| Node 20 弃用 | 在故障与回滚部分写入：`actions/checkout@v4` 等须在 2026-06-02 前升级至 Node24 兼容版。本次要求沉淀此步骤，未要求本次修改 workflow | “2026-06-02 前升级”“加……Node 20 弃用” |

## P｜参与关系

- ADMIN 发给 ME；ME 承担本次 SOP 改写、交付和报告，报告面向 ADMIN。依据：`sender: ADMIN`、`recipient: ME` 及报告名中的 `ME-to-ADMIN`。
- 下次发版执行者是 SOP 的使用者，必须能不读本 TASK 独立理解；原文未指定具体人员。依据：“被下次发版独立看懂”。
- 原文声明本任务不触发 `write_task` v1.1 的 `needs_human` 流程；未另行指定复核人或验收签署人。依据：“不触发……`needs_human` 流程(low risk)”。

## R｜资源、数量与时间

- 覆盖量为 **9/9 处差异**，不能只补部分；检查清单保留 A/B/C/D 四部分，其中 D 不变。依据：“9 处差异全部”“4 段(A/B/C/D)”。
- 文档漂移检查为 **3 类检查点**；其中 `letter-to-admin.{zh,en}.md` 要逐语言覆盖。依据：“三个点必查”“`{zh,en}`”。
- MCP 依赖允许范围为 **`[1.0, 2.0)`**，包含下界、不包含上界。依据：`fcop>=1.0,<2.0`。
- Node24 升级要求为 **2026-06-02 前**；CDN 的“几分钟”只是可能延迟，不是保证完成或强制等待时限。依据：“前升级”“可能要等几分钟”。
- 本任务标记 P1，创建于 `2026-05-13T00:55:00+08:00`；未给出本次 SOP 任务的完成期限、工时或预算。依据：`priority`、`created_at`。

## V｜版本与依据

- 经验基线为 v1.6.0，目标是 **SOP v2**；假想 v1.7.0 只作示例，不构成发布承诺或版本变更授权。依据：“实战 (v1.6.0)”“假想下次 `v1.7.0`”。
- 保留 ADR-0003 SemVer 核心约束，并落实 Rule 0.a.1 交付闭环；原文未提供这些规则的完整正文。依据：“ADR-0003 SemVer 子段”“Rule 0.a.1 闭环”。
- 当前 TASK 文件名演示 ADR-0033 trailing-slug，slug 为 `release-sop-v2-after-1-6-0`；此备注未提出额外重命名要求。依据：“文件名本身演示 ADR-0033 trailing-slug 语法”。
- 任务协议元信息为 `fcop`、版本 `1`；不得与 SOP v2 或软件版本混为一谈。依据：`protocol: fcop`、`version: 1`。

## C｜完成、回滚与待澄清局部

- 完成须同时满足：示例更新合格、9 项可执行内容齐全、SOP 可独立理解、仓库交付、指定 REPORT、TASK 与 REPORT 联合归档。依据：“验收 / Acceptance”全部条目。
- `0.6.0rc1`、`0.6.N` 不得继续作为示例，但允许在历史段落保留；该例外不取消 ADR-0003 子段清理要求。依据：“作为示例(可在历史段落保留)”。
- 若下次按新 SOP 发版出问题，可用 `git revert <commit>` 恢复旧 SOP；原文未要求现在回滚，也未规定其他停止或升级条件。依据：“如下次发版……出问题”“回滚只需……”。
- **状态顺序不清：**“`git status` 干净后 commit”未说明“干净”的含义和检查时点；通常完整干净意味着没有待提交变更，故不能擅自改成“commit 后干净”。
- **文件范围不一致：**“只改……一份维护者文档”与显式要求写 REPORT、归档 TASK/REPORT 的字面范围不一致；这些明确交付要求仍须保留。另，“附一段元信息”的落点未确定。

## B｜独立禁止与限制

- 不改代码、不改协议规则、不发新版本号、不改 `_version.py`。SOP 中要求未来双包版本对齐或执行规则同步，不解除本次限制。依据：“不动代码、不动协议规则、不发新版本号”“不改 `_version.py`”。
- 不改变 `CHANGELOG.md` 的语义内容；docs 元信息要求不等于允许改写发布记录。依据：“不动 `CHANGELOG.md` 的语义内容”。
- 未来发版不得把 `scripts/` 历史 lint 作为阻塞项；TestPyPI 阶段仅适用于 RC。依据：“历史 lint 不阻塞”“RC 才走 TestPyPI”。
- **推送描述矛盾：**验收明确要求“push origin main”，风险段却称“无……推 main”；推送也与同段“无网络”字面冲突。不能据此删除推送要求，也不能将风险段视为一致的授权判断。依据：“commit + push origin main”与“无网络 / 防火墙 / 删除数据 / 推 main / 公网发布”。