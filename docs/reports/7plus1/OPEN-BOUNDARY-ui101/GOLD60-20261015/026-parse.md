### I｜输入与作用域

- 本任务为 `TASK-20260512-002`，追加并细化 TASK-001 的 fcop-mcp 1.4 write-side 守门修复；TASK-001 主体范围继续有效，最终范围须合并两份任务理解，不能以本任务替代前件。〔“不是 supersede，是 append”“两份 TASK 一起读 = 最终范围”〕
- 新增范围为 S1：项目配置存在性验证（P0，扩展 D1）；S2：HOME 精确拒绝及子目录例外（P0，细化 D2）；S3：所有候选 write-side 工具统一守门（P1，新增 D7）。工具集合以 TASK-001 D1 候选清单为准，不能缩成仅两个被观察工具。〔“追加 3 项细化”“TASK-001 D1 候选清单里所有 write-side 工具”〕
- PM #50 的观察是修复依据：`deploy_role_templates()` 已检查配置存在，`redeploy_rules()` 未检查并写入 cwd；这是原文提供的现场证据，并非本次独立验证结果。〔“PM #50 现场观测”“直接默默写到 cwd”〕

### O｜产物与交付

- 交付实现须包含统一守门公共助手 `_assert_writable_project()`，全部范围内 write-side 工具入口调用它；S1 的配置存在性检查位于第 2 步。函数签名 `_assert_writable_project(tool_name: str) -> Path`、入口“第一行”调用出现在实现建议中；公共助手存在及全部工具入口调用则被验收条款明确要求。〔“实现建议”“验收…8”“验收…10”〕
- D5 测试补充两类参数化验证：规范化后严格等于 HOME 拒绝、HOME 子目录放行；对每个工具运行同一组场景，验证守门行为一致。〔“对每个工具跑同一组场景”“验收…9”“验收…10”〕
- 完成报告允许二选一：与 TASK-001 共用 `REPORT-20260512-001-ME-to-ADMIN.md`，或单独写 `REPORT-002`；原文未选定。〔“共用…或单独写”〕
- release notes 提及“可选 strict mode”属于许可，非必交产物。〔“可在 release notes 提一句”〕

### A｜动作与条件关系

所有范围内 write-side 工具须按下列顺序走同一个守门函数；前一步失败即拒绝，不能继续正常写入。〔“都走同一个守门函数（S1 的三步检查）”〕

| 顺序 | 检查与分支 | 原文依据 |
|---|---|---|
| 1 | `project_dir` 已绑定；否则 `ConfigError` | “project_dir 已 bind? → 否 → ConfigError” |
| 2 | resolved 项目根内存在 `fcop.json`，或协议默认布局的 `fcop/fcop.json`；否则 `ConfigError` | “resolved project_dir 内确实存在…否则 reject” |
| 3 | 项目根不命中 deny-list；命中则 `SafetyError`，通过才正常执行 | “project_dir 不在 deny-list? → 否 → SafetyError” |

第 2 步失败的错误文案按原文给定模板保留工具名、解析路径和修正指引：

```text
WriteRefused: <tool_name> requires a valid FCoP project root,
but no fcop.json was found at <resolved_path> (or
<resolved_path>/fcop/fcop.json). Run init_solo() / init_project() /
create_custom_team() first if this is a new project, or call
set_project_dir(path=<correct_root>) to point to an existing one.
```

〔“错误文案”〕这里的初始化与重新绑定是错误消息向调用者提供的指引，不是本任务要求自动执行这些操作。

路径判定使用 `pathlib.Path.resolve()`，包含路径规范化及 symlink 解析；Windows 再作 `casefold()` 比较；跨平台 HOME 使用 `pathlib.Path.home()`。尾斜杠差异不能绕过 HOME 判定，`~` 展开后等于 HOME 也须拒绝。〔“规范化路径 + 解析 symlink”“Windows…casefold()”“跨平台 home…”及 S2 表〕

测试处理公共助手抽取导致的 mock 路径影响时，用 `monkeypatch` 替换助手，而非内部函数。〔“缓解：测试时用 monkeypatch 替换助手而非内部函数”〕

### P｜参与关系与决策权

- 元数据标明 `sender: ADMIN`、`recipient: ME`；正文要求 ADMIN 决定合并范围是否批准，并将 ME 开工关联于批准选项。PM #50 是现场观察来源，不是本任务的批准主体。〔元数据；“批准…合并范围，ME 开工”；“PM #50 现场观测”〕
- ADMIN 的待决选项为：A 批准两任务合并范围；B 再调整，例如加严 S2 或推迟 S3；C 两任务一起延后。“推荐 A”不等于已经批准，B 的例子也不是现行边界。〔“请 ADMIN 决”“我推荐 (A)”〕

### R｜数量、优先级与时间

- 本任务追加 3 项细化、3 条验收要求；连同 TASK-001 原有 7 条，合并验收共 **10 条**，原 7 条不能被替换或免除。〔“在…验收标准 7 条之上，追加 3 条”〕
- 总任务元数据为 P0、high risk；子项保留 S1/S2 为 P0、S3 为 P1 的区别。〔`priority: P0`、`risk_level: high`；各 S 标题〕
- ADMIN 输入时间为 2026-05-12 15:58（UTC+8），落款为同日 16:03（UTC+8）；这些是记录时间，未规定工期、截止时间、人员额度或其他资源预算。〔“ADMIN 输入时间…”；“— ME…16:03”〕

### V｜版本与依据

- 依据链为本任务修正 TASK-001，目标版本背景为 fcop-mcp 1.4；配置位置按协议默认布局判断。〔“Refines…TASK-20260512-001-ADMIN-to-ME.md”“fcop-mcp 1.4”“按协议默认布局”〕
- 更严格的 HOME 子目录限制留作 v1.5 提案；回滚沿用 TASK-001 R-rollback，降级至 v1.3.x。〔“留作 v1.5 提案”“降级回 v1.3.x 即可”〕

### C｜完成、停止与升级条件

- 完成验收须同时满足 TASK-001 原 7 条及本任务第 8—10 条：配置检查顺序与统一路径、规范化 HOME 判定及参数化测试、公共助手及逐工具一致性测试。〔“验收补丁”第 8—10 条〕
- 任一守门检查失败即按 A 中对应错误拒绝该次调用；通过全部检查才进入正常执行。〔S1 行为流程〕
- 生命周期描述为落盘时 `proposed`，与 TASK-001 一起 GREEN 后 `accepted`，`done` 时采用 O 中任一报告方式。〔“状态机”〕
- 原文提供回滚方式，但未规定自动触发回滚的条件；不得补造触发阈值。〔“回滚同 TASK-001 R-rollback”〕

### B｜独立禁止与限制

- 规范化后严格等于 HOME 的路径禁止作为项目根；任何 drive root（包括 `C:\`、`D:\`）以及列出的 Unix 路径 `/`、`/etc`、`/usr`、`/opt` 均拒绝。〔S2 精确判定表〕
- HOME 子目录不因位于 HOME 下而拒绝；`codeflow`、`some-real-project` 是放行示例。此例外只解除 HOME 身份带来的拒绝，仍须满足绑定、配置存在及其他适用 deny-list 条件。〔“子目录放行”；S1 三步检查〕
- 本任务不得为 `~/Desktop`、`~/Documents` 等 HOME 子目录扩展 deny-list；原文明确这些位置建项目合法但不推荐。〔“本 TASK 范围内不扩展这条 deny-list”〕
- 不允许仅修补 `redeploy_rules()` 而遗漏其他候选工具，也不允许守门失败后默默写入 cwd。〔“不只 redeploy_rules 补”“所有 write-side 工具”；S1 拒绝分支〕

**缺失与局部不一致：**

- 未提供 TASK-001，因此无法完整列明其工具候选清单、原 7 条验收、其余主体范围及完整回滚约定；本报告保留这些继承关系，不能据此声称已还原最终合并范围。
- 元数据 `status: done` 与正文“请 ADMIN 决”、推荐批准及落盘为 `proposed` 的叙述存在状态张力；没有实际批准或验收记录可供核对。
- 元数据发送者为 ADMIN，正文却以 ME 落款并向 ADMIN 请求决策，文档身份不一致；不能自行裁定哪一处代表实际发令或批准状态。
- 报告二选一、未来测试结果及是否批准属于尚未决定的选择或未来事实，本身不是边界歧义。