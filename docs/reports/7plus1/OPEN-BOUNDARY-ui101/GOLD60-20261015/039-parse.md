## I｜输入与作用域

- 本任务为 `TASK-20260513-009`，ADMIN 发给 ME；父任务为 `TASK-20260513-008`，关联 `ISSUE-20260513-008 / -009 / -010`。三个上游 bug 均须修复，并作为父任务 sprint 的子任务纳入 fcop 2.0.0。〔“上述 3 个 ISSUE 的修复 **作为 sub-task** 加入 `2.0.0` sprint”〕
- ISSUE-008 覆盖合规归档被误报 `P1-002 misplaced_envelope` 的问题，背景注明有 4 个 sub-case，但未逐项给出内容。〔“归档文件被误报……（4 个 sub-case）”〕
- ISSUE-009 覆盖本地规则版本读取恒为 null 的问题；ISSUE-010 覆盖四个预设团队 PM 角色模板缺少三段内容的问题。〔“永远返回 `null`”；“缺 `supersedes` / `risk_level` / **REVIEW envelope** 三段”〕

## O｜产物与交付

| 产物 | 必须达到的结果及来源 |
|---|---|
| `src/fcop/project.py` | 完成 ISSUE-008、009 的扫描豁免、计数字段及版本读取修复。〔两个 ISSUE 的修复要点均指定该文件〕 |
| 四个团队的中英文 PM 模板 | 每份均补齐 `supersedes:` 用法、`risk_level:` 写入与升级路径、REVIEW envelope 写作时机与字段。〔“对齐 DEV/QA/OPS 模板的三段”〕 |
| 审计报告 | 新增 `violation_file_count`，按不同文件去重计数，并渲染到 frontmatter。〔“distinct file count）+ frontmatter 渲染”〕 |
| `CHANGELOG.md` | 在 `[2.0.0]` 的 **Fixed** 子节列出全部三个 ISSUE。〔“Fixed 子节列出三个 ISSUE”〕 |

## A｜动作与关联约束

- `_scan_misplaced_envelopes` 须添加以下三个路径模式的桶豁免，`_scan_ghost_prefixes` 须同步豁免；活动桶仍须正常扫描。〔“加桶豁免列表”；“同步加豁免”；“活动桶里仍正常扫”〕
  - `fcop/log/**`
  - `fcop/**/_archive/**`
  - `**/legacy-non-protocol/**`
- `_read_local_rules_version` 须先从 YAML frontmatter 读取 `fcop_rules_version:`；**找不到时**才回退到旧 `Rules version:` 哨兵，并保持老 1.x 项目兼容。〔“先按 YAML frontmatter 抓……找不到再 fallback”；“不破坏老 1.x 项目”〕
- 模板修复须逐团队、逐语言覆盖，不能只补部分团队或只补中文版。〔“4 个团队的 PM.md / PM.en.md 同时含……三段”〕

## P｜参与关系

- ADMIN 是指令发出者，ME 是任务接收者；codeflow 是问题上报来源，跨项目巡检 `TASK-20260513-003 / -004` 是问题发现背景。〔`sender: ADMIN`；`recipient: ME`；“在 codeflow 跨项目巡检……中，扇出了 3 份……ISSUE”〕
- 本任务从属于 2.0.0 sprint 父任务；原文未指定具体开发分工、独立复核人或验收接收人。〔`parent: TASK-20260513-008`；“作为 sub-task 加入”〕

## R｜数量、资源与时间范围

- 修复数量为 **3 个 ISSUE，全部纳入**，不能择一或部分完成。〔“加进去全部修复，合并为 2.0.0！”〕
- 模板范围为 `{dev,media,mvp,qa}-team × {PM.md, PM.en.md}`，共 **8 份模板**；每份都须覆盖上述三段内容。〔`src/fcop/teams/_data/{dev,media,mvp,qa}-team/roles/PM.{md,en.md}`〕
- 任务优先级为 **P1**，风险等级为 **medium**；仅规定归入 2.0.0 sprint，未给出截止时间、工时或预算。〔`priority: P1`；`risk_level: medium`；“加入 `2.0.0` sprint”〕

## V｜版本与依据

- 交付目标是 **fcop 2.0.0**；审计验收要求的本地规则版本是 **3.0.0**，二者分别对应产品版本与规则版本。〔“合并为 2.0.0”；`fcop_rules_version_local: 3.0.0`〕
- PM 模板以已有 DEV/QA/OPS 模板三段内容为对齐依据，验收另要求命中数与 `DEV.md` 相当；背景中的 v1.3.0 是待修复旧内容状态。〔“对齐 DEV/QA/OPS 模板”；“命中数与 DEV.md 相当”；“停留在 v1.3.0 时代”〕
- 回滚流程引用 **Rule 5**；其具体规则未随原文提供，不能补造。协议元数据为 `fcop`、版本 `1`。〔“按 Rule 5”；`protocol: fcop`；`version: 1`〕

## C｜完成、回滚与待明确处

以下验收条件须共同满足：

| 条件 | 来源 |
|---|---|
| `pytest` 全部通过，回归为 0 | “`pytest` 全过，回归 0” |
| 在含 `fcop/log/` 与 `_archive/` 的项目中审计得到 `P1-002 = 0`，同时活动桶仍正常扫描 | “如本仓 + codeflow”；“`P1-002 = 0`（活动桶里仍正常扫）” |
| 审计输出含 `fcop_rules_version_local: 3.0.0`，不能为 null | “`fcop_rules_version_local: 3.0.0`（非 null）” |
| 8 份 PM 模板逐份含三段，且命中数与 DEV.md 相当 | “同时含……三段（命中数与 DEV.md 相当）” |
| CHANGELOG 在指定版本、指定子节列全三个 ISSUE | “`[2.0.0]` 段在 **Fixed** 子节列出三个 ISSUE” |

- **条件回滚义务：**若任一项打破回归，按 Rule 5 追加 `TASK-010`，带 `supersedes: TASK-009`，撤回**该项改动**。原文未要求因此撤回其余修复。〔“若某一项打破回归……撤回该改动”〕
- **允许的旧版恢复方式：**可用 `pip install fcop==1.6.0` 回到上一 stable；这是可选恢复路径。〔“老版本仍可……回到上一个 stable”〕
- **局部未明确：**
  - “如本仓 + codeflow”以举例措辞出现，未明确两者是否都是必跑项目。
  - “命中数……相当”未给出计数口径及允许差值。
  - “找不到”未细化字段存在但为空或 YAML 解析失败时的处理。
  - `violation_file_count` 未明确汇总哪些违规类别。
  - 回滚中的 `TASK-010`、`TASK-009` 使用短编号，未明确完整标识的写法。

## B｜独立禁止与限制

- **不得另开 2.0.1 patch**；三项修复必须并入 2.0.0。〔“不开 `2.0.1` patch”〕
- 豁免不能关闭活动桶扫描；新版本解析不能破坏老 1.x 项目。〔“活动桶里仍正常扫”；“不破坏老 1.x 项目”〕
- 修复须保持原文要求的非破坏性性质：豁免列表为软扩展，frontmatter 解析向后兼容，模板补丁为内容追加。〔“三处修复都是非破坏性……模板补丁 = 内容追加”〕