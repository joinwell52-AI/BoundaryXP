## I｜输入与作用域

- **任务身份**：ADMIN 发给 ME 的 `TASK-20260512-009`，线程 `release-1-6-0`，优先级 P0，不可逆风险；创建于 `2026-05-12T23:47:00+08:00`，记录状态为从 Step 2 开始的 `IN_PROGRESS`。〔“recipient: ME”“priority: P0”“risk_level: irreversible”“IN_PROGRESS(Step 2 开始)”〕
- **发布范围**：本仓 `fcop`、`fcop-mcp` 的 **1.6.0 正式版**，覆盖本仓 P=E 修复、发布前检查、本地构建与冒烟、tag/push、Actions 发布以及发布后真 PyPI 验证。〔“一条龙走 1.6.0 正式版发布,含”及范围 1–7〕
- **历史 snapshot 漂移纳入发版阻塞检查**：虽然此前决定另起任务，当前必须在 Step 3 实测其性质并向 ADMIN 报告；检查 B 不通过不能发版。〔“等 codeflow Mode 1 收尾后再起独立 task”“直接阻塞发版”“实测确认……然后向 ADMIN 报告”〕
- **11 件历史 untracked 排除在发布范围外，也不阻塞发布**；这一例外只针对所述历史对象，不扩展到其他 Git 问题。〔“11 件历史 untracked 噪音”“不在发版范围”“不阻塞”〕

## O｜产物与交付

| 必须形成的产物或结果 | 短原文依据 |
|---|---|
| 本 TASK-009 任务记录；检查汇总报告交 ADMIN 续发裁决 | “落本 TASK-009”“汇总检查报告 → 等 ADMIN 拍续发” |
| 本仓根规则同步产物；如有 diff，提交 P=E 修复产物 | “同步项目根四件套到 protocol 2.4.0”“commit P=E 修复产物(如有 diff)” |
| 本地构建成功且 smoke install 通过 | “本地 build 成功 + smoke install 通过” |
| 注释 tag `v1.6.0`，消息 `Release 1.6.0`；main 和该 tag 推送到 origin | `git tag -a v1.6.0 -m "Release 1.6.0"`；`git push origin main v1.6.0` |
| PyPI 上两个包分别达到 1.6.0，均可见、可装；GitHub Release 阶段成功 | “fcop@1.6.0 + fcop-mcp@1.6.0 可见 + 可装”“github-release 全绿” |
| REPORT-009 与 TASK-009 归档闭环；报告含真实可装证据 | “REPORT-009 落 + archive 闭环”“REPORT-009 含 PyPI 真实可装确证” |

## A｜动作与条件关系

- **按明确步骤推进**：记录 TASK → A 代码检查 → B 测试/lint/mypy/snapshots → C CHANGELOG/ADR/README → D Git 状态 → 本地 build 与 smoke → 汇总并等待 ADMIN 续发 → ADMIN redeploy → ME 按 diff 条件提交 → ADMIN tag → ADMIN push → 等 Actions → 真 PyPI smoke → REPORT 与归档。这里保留原文顺序，不另行安排执行方案。〔“Rule 0.a.1 子步骤拆分”Step 1–13〕
- **snapshot 分支处置**：Step 3 实测确认后，若为工具签名合法演进，则重新生成 snapshot；若为代码 bug，则改代码恢复。不能预先认定属于哪一分支，也不能用直接再生成代替性质确认。〔“若……合法演进 → 重新生成 snapshot”“若……代码 bug 引起的 → 改代码恢复”〕
- **P=E 修复**：调用 `redeploy_rules()` 同步项目根规则，其中已知根 `fcop-protocol.mdc` 必须由 2.3.0 到 2.4.0；提交义务以有 diff 为条件，同步义务不以此为条件。〔“需 Step 8a……同步到 2.4.0”“如有 diff”〕
- **自动化依赖链**：push 触发 `release.yml`，依次 `verify → build → publish-fcop → publish-fcop-mcp → github-release`，各阶段均须成功。〔“触发 GitHub Actions release.yml”“全绿”〕
- **发布后验证**：必须使用真 PyPI、新环境安装并冒烟；验证 `fcop`、`fcop_mcp` 导入与版本 1.6.0，以及 `fcop-mcp --help` 正常。〔“真 PyPI 装新环境冒烟”“import fcop, fcop_mcp; print(version) = 1.6.0”“--help 输出正常”〕
- **若需回滚**：采用 `twine yank` 警告标记，并立即 bump 1.6.1 重发；不是删除或覆盖 1.6.0。原文未指定启动回滚的具体判据和执行人。〔“回滚方案 = twine yank……不删除……立刻 bump 1.6.1 重发”〕

## P｜参与与授权

| 主体 | 职责与权限边界 | 短原文依据 |
|---|---|---|
| ME | 任务落档、本地 A–D 检查、构建与冒烟、汇报、条件性提交 P=E 产物、发布后验证、报告与归档 | Step 1–7、8b、12–13 的“ME”“ME(本地)” |
| ADMIN | Step 7 续发裁决；通过 MCP 工具触发 redeploy；触发 tag、push、publish | “ME 汇报 → ADMIN 拍”“ADMIN 触发(MCP 工具)”“三步全部由 ADMIN 触发” |
| GitHub Actions | 执行自动 verify、build、两个包的 publish 和 GitHub Release | Step 11“GitHub Actions”；范围 6 自动化链 |

- **已有审批与后续闸门并存**：23:44 的 ADMIN 决策已满足不可逆风险的人工审批，等价 `mark_human_approved`，无需再写 REVIEW 走 `needs_human`；但不取消 Step 7 等待续发以及 ADMIN 触发敏感动作的独立要求。〔“人工审批前置满足”“无需再写 REVIEW”“等 ADMIN 拍续发”〕
- **publish 的触发与执行分开**：ADMIN 负责触发，Actions 执行发布；原文没有额外单列一次手动 publish 步骤。〔“publish……ADMIN 触发”“Actions 自动化……publish-fcop → publish-fcop-mcp”〕

## R｜资源、数量与时间

- **数量与逐项要求**：2 个包均须发布并可装；A/B/C/D 共 4 类检查全部通过；5 个 Actions 阶段全部成功。不能用其中一项成功替代其他项。〔“fcop@1.6.0 + fcop-mcp@1.6.0”“A/B/C/D 全绿”“verify→build→publish-fcop→publish-fcop-mcp→github-release 全绿”〕
- **指定执行资源**：本仓及项目根四件套、本地构建环境、真 PyPI 新环境、origin/main、GitHub Actions `release.yml`、ADMIN 触发的 MCP 工具。〔“项目根四件套”“ME(本地)”“真 PyPI 新环境”“git push origin main v1.6.0”“MCP 工具”〕
- **时间边界**：风险点须发版前澄清，检查失败须立刻停止并报告，回滚方案要求立即 bump 重发。“立刻”未量化；创建时间及 P0 不等于给定截止时间。〔“发版前必须澄清”“任一失败立刻停”“立刻报告 ADMIN”“立刻 bump 1.6.1 重发”〕
- 未规定预算、耗时上限、重试次数或环境容量。

## V｜版本与依据

- **程序依据**：`docs/release-process.md` 一条龙流程及 §Phase 1；Rule 7、8、9.5.1、0.a.1、0.c；ADR-0006、ADR-0024。它们被原文引用，但所给数据未包含其完整内容，不能补写额外规则。〔“按 docs/release-process.md”“§Phase 1”“协议合规守则”〕
- **ADMIN 决策依据**：23:33 的“X”收 ADR-0033 sprint metadata，对应 `a669ea3 + a8ff07c`；23:44 的“B,全部做掉;按一条龙要求发版,发版前全面检查”。〔“ADMIN 决策来源”〕
- **明确版本关系**：

| 对象 | 原文现状 | 要求 |
|---|---|---|
| wheel 内 `fcop-rules.mdc` | rules 2.4.0 | 已是所述版本 |
| wheel 内 `fcop-protocol.mdc` | protocol 2.4.0 | 已是所述版本 |
| 根 `.cursor/rules/fcop-protocol.mdc` | protocol 2.3.0 | 同步至 2.4.0 |
| 根 `.cursor/rules/fcop-rules.mdc` | rules 2.4.0 | 纳入 P=E 一致性验收 |

  〔R3 四项现状；“本仓 P=E 一致(.cursor/rules/ 全 2.4.0)”〕

## C｜完成、停止与升级

- **完成是全部条件的合取**：A–D 全绿、本地 build 与 smoke 通过、ADMIN redeploy 后 P=E 一致、Actions 五阶段全绿、两个 PyPI 包均可见可装、真 PyPI 新环境导入及版本验证通过、CLI help 正常、REPORT 与归档完成。〔DoD 全部勾选项〕
- **最终关闭条件**：Step 13 完成，且 REPORT-009 含 PyPI 真实可装确证；仅完成发布不能关闭任务。〔“closes_on: Step 13 完成 + REPORT-009 含 PyPI 真实可装确证”〕
- **失败闸门**：任一检查失败即暂停并立刻报告 ADMIN；snapshot 漂移导致 B 失败也适用。历史 11 件 untracked 按明确例外不构成阻塞。〔“任一失败暂停”“任一检查失败 = 立刻报告 ADMIN”；R1、R2〕
- **续发闸门**：完成本地检查与构建后须汇报，等待 ADMIN 拍续发；初始人工审批满足不能替代此闸门。〔Step 7〕

## B｜独立禁止、限制与局部未明

- **ME 不得自行决定 tag、push、publish，也不得自行触发 redeploy**。〔“ME 不自决”“redeploy_rules() ADMIN 触发”〕
- **不得掩盖检查失败，不得失败后径直续发**。〔“任一失败立刻停”“不掩盖”〕
- **PyPI 1.6.0 发布不可覆盖；yank 仅作警告标记，不删除版本**。〔“PyPI 不允许同版本号覆盖”“不删除,只是标红”〕
- **检查细则缺失**：给定文本只列 A–D 类别及 B 的 `tests/test_fcop_mcp` 全绿要求，未提供完整清单或所引流程正文，因此不能断言完整检查项目。〔“清单 A/B/C/D 全部跑过”“tests/test_fcop_mcp 全绿”〕
- **规则对象清单未全列**：“项目根四件套”与“.cursor/rules/ 全 2.4.0”均须保留，但 R3 仅点名两个根文件，其余成员未给出。〔范围 1、DoD、R3〕
- **snapshot 授权衔接未完全明确**：原文同时保留“之后另起独立 task”的旧决定与当前“ME 推荐处置”，并给出修复分支；未明确写出 ADMIN 已撤销旧决定或免除独立任务要求。确定义务仍是实测、报告及 B 全绿，不能据“推荐”推定授权已完整解决。〔R1〕
- **检查与最终提交的衔接未说明**：步骤表将全面检查和 build 放在 redeploy/条件性 commit 之前，未明确同步后本地检查是否重跑、检查报告是否必须覆盖最终提交；Actions 全绿要求仍然独立成立。〔Step 2–11〕

snapshot 的实际性质、未来是否产生 diff、检查和发布是否成功，均是待实测结果，不属于原文边界不明。