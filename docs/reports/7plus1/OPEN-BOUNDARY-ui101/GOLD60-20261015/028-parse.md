### I｜输入与作用域

- 任务为 `TASK-20260512-006`，ADMIN 发给 ME，优先级 P1、风险标记 low；关联线程 `adr-0033-trailing-slug-adoption`，创建时间为 2026-05-12 22:55（+08:00）。【原文：“sender: ADMIN”“recipient: ME”“priority: P1”“risk_level: low”】
- 范围是收编 TASK、REPORT、ISSUE 三类文件名的**可选 trailing-slug**；带与不带 slug 都必须合法。REVIEW 不增加 slug，保留既有 `-on-{subject_short}`。【原文：“新增可选 trailing-slug 段”“slug 缺失 / 存在均合规”“REVIEW 文件名不加 slug”】
- 输入依据包含现行 `filename.py:99-101` 的正则、codeflow 与 `D:\FCoP` 现场长文件名及实测结果。现状是 parser 拒绝这类名字，而 audit 的六个 scan 未检查这类问题；背景没有单独要求扩展 audit。【原文：“parse_task_filename 返回 None”“6 个 scan 全部不查这一类”】

### O｜产物与交付

| 必须交付 | 内容边界与短引文 |
|---|---|
| 文件名实现补丁 | 修改 `src/fcop/core/filename.py`，覆盖三类正则、dataclass、render、parse、build 与组件校验。【“Phase 1 · 协议规则补丁”】 |
| 单元测试 | 在 `tests/core/test_filename.py` 增加含 slug、无 slug 回归、显式 build、非法 slug 拒绝及现场样本测试。【“Phase 2 · 单元测试”】 |
| 协议文档 | `fcop-protocol.mdc` 的 File Naming 增加 Optional trailing slug 小节，包含中英双语、示例与不参与 routing 的说明；`fcop-rules.mdc` 增加版本日志。【“中英双语 + 示例”“版本日志新增 2.3.0 条目”】 |
| 部署文档 | 同步重生成 host-neutral 四件套，涉及 `.cursor/rules/*.mdc`、`AGENTS.md`、`CLAUDE.md`。【“部署的 host-neutral 4 件套……同步重生成”】 |
| ADR | 落盘 `adr/ADR-0033-trailing-slug-filename-adoption.md`，写明双现场涌现证据、A·协议收编决策、影响范围、向后兼容性证明，以及备选 B 被 Rule 5 锁死的推理；链接 essay D 与 codeflow emergence-log。【“含……背景……决策……影响范围 + 向后兼容性证明”“链接 essay D + codeflow emergence-log”】 |
| Release notes 草稿 | 起草 `fcop 1.2.0` 说明，涵盖两项协议版本、parse 多返回字段及旧 caller 兼容、下游升级后历史长文件名追溯性合规。【“起草……release notes”“旧 caller 不读 slug 即可”】 |

### A｜动作与语义

- 三类目标格式如下；既有主体、日期、序号与 SLOT 结构继续保留，仅增加末尾可选段。【原文：“新增可选 trailing-slug 段”】

  ```text
  TASK-{date}-{NNN}-{SENDER}-to-{RECIPIENT}[.{SLOT}][-{slug}].md
  REPORT-{date}-{NNN}-{REPORTER}-to-{RECIPIENT}[-{slug}].md
  ISSUE-{date}-{NNN}-{REPORTER}[-{slug}].md
  ```

- slug 采用 `[a-z0-9][a-z0-9-]*`：存在时至少一个字符，首字符为小写字母或数字，后续允许小写字母、数字、连字符；首字符不得为连字符，不接受大写或下划线。没有禁止末尾或连续连字符。【原文：“[a-z0-9][a-z0-9-]*”“非法 slug 拒绝(大写 / 起手 hyphen / 含 underscore)”】
- 在 `_ROLE` 后定义 `_SLUG`，TASK 正则在可选 SLOT 后加可选 slug；REPORT、ISSUE 按上述目标格式在 `.md` 前增加可选 slug。【原文：“在 `_ROLE` 后增加 `_SLUG`”“追加 `(?:-(_SLUG))?`”】
- `TaskFilename`、`ReportFilename`、`IssueFilename` **各自**增加 `slug: str | None = None`，同步 render；对应三个 parse 返回 slug，三个 build 增加可选 `slug` 关键字参数，`_check_components` 使用新增 `_SLUG_RE` 校验。【原文：“dataclass 加……字段; `render()` 同步”“返回 slug”“加 `slug` 关键字参数(可选)”】
- slug 仅作可读标签，不能改变 routing；routing 仍依赖既有 SENDER、RECIPIENT、SLOT。Rule 3 Metadata Integrity 保持不变，slug 不进入 frontmatter。【原文：“slug 不参与 routing”“Rule 3……保持不变(slug 不入 frontmatter)”】
- 工具如 `list_tasks` 继续默认显示完整文件名，不另改显示行为。【原文：“默认显示完整文件名(已是现状),不改”】

### P｜参与关系与授权

- ADMIN 已决定采用 A·协议收编，但**kickoff 时机仍待 ADMIN 决定**；ME 是执行接收方，须在 ADMIN 拍板后开始 Phase 1。ME 推荐并行不等于已获开工授权。【原文：“ADMIN 决策……A · 协议收编”“ADMIN 拍 → ME 开 Phase 1”“ME 推荐:并行”】
- codeflow PM 使用当前 pinned wheel，承担另一条 Phase A/B/C 工作线；本任务新版 release 不应自动升级该工作线。【原文：“codeflow PM 跑的是当前 wheel 版本”“不自动升”】
- codeflow Mode 1 闭环后，由 ADMIN 手动升级。该升级主体与时点不能转移给 ME 或提前到运行期间。【原文：“Mode 1 闭环后由 ADMIN 手动升”】
- 本 task 是 Rule 0.a.1“四步走”的第 1 步；原文没有给出另外三步，也没有指定独立复核人或最终验收接收人。【原文：“四步走(本 task 是第 1 步)”】

### R｜资源、数量与时间

- slug 长度建议不超过 40 字符，属于软限制，不能按硬上限拒绝更长但语法合法的 slug。【原文：“长度建议 ≤ 40 字符(soft limit,不强制)”】
- kickoff 选择保留为变量 \(K \in \{\text{并行},\text{串行}\}\)，由 ADMIN 决定；两项 ETA 是分支估计，不是同时生效的工期要求。【原文：“等 ADMIN 拍 kickoff 时机——两个选项”】

| 选项 | 启动条件与时间范围 |
|---|---|
| 并行 | ADMIN 选择后即可开始 Phase 1–4，与 codeflow Phase A/B/C 同时进行；约 3–4 工时，预计 2026-05-13 中午前完成。【“现在就开始 Phase 1-4”“~3-4 工时,5/13 中午前完成”】 |
| 串行 | 等 codeflow Mode 1 ALL GREEN 后再开；预计 2026-05-13 下午起、05-14 完成。前提条件不能被 ETA 取代。【“等 codeflow Mode 1 ALL GREEN 后再开”“5/13 下午起,5/14 完成”】 |

- “22+ 件”是既有涌现证据数量，不是要求新增文件的额度；三类文件名、三组 API 与部署四件套的覆盖范围见 O、A。【原文：“共 22+ 件(codeflow 端)”】

### V｜版本与依据

- 本次演化须为 MINOR additive，目标为 `fcop@1.2.0`；`fcop_rules_version` 从 `2.2.0` 升至 `2.3.0`，`fcop_protocol_version` 从 `2.0.0` 升至 `2.1.0`。任务头的 `protocol: fcop / version: 1` 是消息元数据，不能混作上述软件版本。【原文：“升级语义: MINOR additive”“2.2.0 → 2.3.0”“2.0.0 → 2.1.0”】
- slug 语法依据 REVIEW 已有 `subject_short` 约定；规则版本日志须注明 `per ADR-0033`。【原文：“沿用 REVIEW 的 subject_short 现成约定”“(per ADR-0033)”】
- ADR 的 emergence-log 引用须带来源，包括 codeflow PM 长文件名清单与 `D:\FCoP` regex 实测；essay D 是收编理由的引用依据。【原文：“emergence-log 引用要带出处”“essay D……‘类型 1 涌现’”】

### C｜完成、等待与升级条件

以下要求共同构成验收，不能以单个样本通过代替其余项：

- 新增测试与回归测试全部通过；覆盖 A 中三类解析、无 slug 兼容、显式 build 和非法值拒绝。【原文：“单测全绿(新增 + 回归)”】
- 现场样本 `TASK-20260512-025-PM-to-OPS-phase-a-fix-naming.md` 必须 fullmatch，并解析为 `date=20260512, seq=25, sender=PM, recipient=OPS, slot=None, slug="phase-a-fix-naming"`。【原文：“应解析为……”“groups 含 `slug='phase-a-fix-naming'`”】
- 旧样本 `TASK-20260512-006-ADMIN-to-ME.md` 仍解析成功，且 `slug=None`；总体保持无破坏、向后兼容。【原文：“仍 parse 通过, slug=None”“纯增量,向后兼容”】
- `fcop-rules.mdc`、`fcop-protocol.mdc`、`AGENTS.md`、`CLAUDE.md` 内容须一致，且受原文 diff 限制约束；该限制的局部冲突见 B。【原文：“内容一致(diff 只在版本号 + 新增的‘Optional trailing slug’节)”】
- ADR 必须落盘并带指定链接，O 中其他产物也须交付，不能仅完成 DoD 勾选项而省略实施步骤要求。【原文：“ADR-0033 落盘”“Phase 1”至“Phase 4”】
- 当前状态为 WAITING；未知的 kickoff 选择、未来测试结果与 Mode 1 是否 ALL GREEN 是待发生状态，不构成边界歧义。原文未另设失败后的停止阈值或升级处理流程。【原文：“status:WAITING — 等 ADMIN 拍 kickoff 时机”】

### B｜独立禁止、限制与局部待澄清点

- **禁止破坏性操作、禁止改名修复既有任务文件。** 协议收编不能转为批量改名；下游历史文件的合规收益以升级新版为条件。【原文：“已落盘文件不能改名”“Rule 7:无破坏性操作”“下游用户升级后……追溯性合规”】
- **不得扩大交付授权。** 明确要求是起草 release notes；原文没有明确授予发布包或替 ADMIN 升级下游的权限。【原文：“起草 `fcop 1.2.0` release notes”；升级关系见 P】
- **已落盘文件限制存在直接冲突。** 合规守则写“**不改任何已落盘文件**”，而 Phase 1、3 明确要求修改既有源码、规则文档并重生成部署文件。不能自行把前者缩窄成“只禁止改任务文件”；其适用对象需澄清，两侧明确要求均保留。【原文：“协议演化通过新文件 + ADR-0033,不改任何已落盘文件”】
- **slug 起手条件表述不一致。** 正式语法允许数字起手，但风险说明声称“slug 强制小写起手”。此外 `_ROLE` 允许连字符后的数字，因此如 `…-to-OPS-123.md` 可被读作角色 `OPS-123`，也可被读作角色 `OPS` 加 slug `123`；原文未给出消歧优先级。这影响解析和 routing 保持要求。【原文：“`_ROLE = [A-Z][A-Z0-9_]*(?:-[A-Z0-9_]+)*`”“`[a-z0-9][a-z0-9-]*`”“分界仍清楚因为 slug 强制小写起手”】
- **REPORT／ISSUE 正则修改位置措辞不精确。** 步骤写“在 `(_ROLE)\.md$` 前追加”，而目标格式明确 slug 位于最后一个角色之后、扩展名之前；不能照字面把 slug 放到角色之前。【原文：“在 `(_ROLE)\.md$` 前追加”；目标格式见 A】
- **文档 diff 限制与版本日志要求可能冲突。** 新增含 `per ADR-0033` 的版本日志不只是替换版本号，也不属于协议新增小节；原文未说明它是否被“diff 只在……”允许。另外，“内容一致”是否指协议内容同步而非四个文件全文相同，未明确。【原文：“版本日志新增 2.3.0 条目”“diff 只在版本号 + 新增的……节”】
- **证据计数口径未统一。** 背景将 22+ 件标为 codeflow 端，ADR 要求又称“双现场 22+ 件涌现证据”；不能据此断言两端各有 22+ 件。essay D、emergence-log 的具体链接及另外三步协议内容也未提供。【原文：“22+ 件(codeflow 端)”“codeflow + D:\FCoP 双现场 22+ 件”】