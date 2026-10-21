## I｜输入与作用域

- **唯一审计目标为 `D:\Bridgeflow`**，本次是 Mode 1 冲刺的周期性合规检查，核验是否维持 ALL GREEN、是否发生回退；`D:\codeflow-3` 是已纠正的错误目标，不属于本次审计对象。  
  来源：“正确目标是 **`D:\Bridgeflow`**”“周期性审计 checkpoint”。
- **开始跨项目审计前必须明确确认目标路径**，不得凭候选项目名称或存在 `fcop.json` 推断目标。  
  来源：“第 0 步应当是 **明确确认审计对象 path**”。
- **读取范围受限于文件名与 frontmatter**，明确排除 task、report、issue 正文。该限制与部分检查要求存在局部冲突，见 B。  
  来源：“只读文件名 + frontmatter，**不读 task body / report body / issue body**”。
- 原文的“基线快查”和三条 git log 是已有背景记录，不能直接替代本次核验。基线涉及 canonical `fcop/`、四件套、main 分支、`.fcop/`、`workspace/`、根目录事件账本、四个项目目录、7 个补丁脚本、12 个 smoke 目录、两组尾空格重名目录、两个 venv 及根目录 HANDOVER 文件。其“需查”“需核”“不一定违规”等限定必须保留。  
  来源：“基线快查(已扫)”“或合理 sandbox?需核”“应 .gitignore;不一定违规”。

## O｜产物与交付

交付一份覆盖下列 **11 章**的分级合规报告；每项均是检查义务，不代表已经确认违规。

| 章 | 必须覆盖的边界 | 短原文依据 |
|---|---|---|
| A 协议部署 | 读取四件套的 `fcop_rules_version`、`fcop_protocol_version`，与 `D:\FCoP` 仓库最新版本比较 P=E 漂移；统计 `.fcop/migrations/` 中归档旧规则的代数 | “与 D:\FCoP 仓库内最新版本对比”“有几代旧规则被归档” |
| B 目录结构 | 检查 `fcop/` 下 tasks、reports、issues、shared、log 五桶；识别 `fcop/{team}/` 多团队或扁平结构；检查 workspace slug | “五桶…齐全”“是否多团队…还是扁平”“slug 合规” |
| C 团队文档 | 检查 Layer 0–3 对应的 `TEAM-README`、`TEAM-ROLES`、`TEAM-OPERATING-RULES`、`roles/{ROLE}.md`；检查不存在 `roles/ADMIN.md` | “Layer 0 / 1 / 2 / 3 齐全”“不含 `roles/ADMIN.md`” |
| D 配置完整性 | 检查 `mode`、`team`、`roles`、`leader` 齐全且自洽；role code 不含 ADMIN、SYSTEM；`layer`、`can`、`cannot` 可缺省，出现则必须正确 | “齐全且自洽”“可选,有则需正确” |
| E 命名与元数据 | 检查 TASK、REPORT、ISSUE、REVIEW 四类命名及 AMEND、`*-v2.md` 等幽灵前缀；检查必填 `protocol/version/sender/recipient`；核验收发角色码属于配置 roles；按目录抽样并给合规率 | “命名 4 种合规”“角色码在 `fcop.json` roles 内”“每个 dir 取头 5 / 尾 5 / 中间随机 5” |
| F 路由 | 在 team 模式下，从 sender/recipient 分布推断 ADMIN↔leader 是否为唯一对外接口；检查非 leader 的 PM-to-ADMIN 等 leader 短路 | “team 模式下”“从 sender/recipient 分布推断”“是否存在 leader 短路” |
| G 互惠回执 | 对每条 `tasks/TASK-*.md`，按 `thread_key` 查匹配 REPORT 或 follow-up TASK；列出任务年龄至少 7 天且无回应者 | “每条”“或 follow-up TASK”“任务 ≥7 天无回应” |
| H 历史只增 | 检查同日同序号多文件冲突；统计 log 总条数及最近 30 天条数；对照 git diff 与 FCoP 账本，检查未挂任务的产物变更 | “同日同序号多文件”“总条数 / 最近 30 天”“未挂任务的产物变更” |
| I 工作区 | 列根目录非协议产物；逐条判断能否归入 `workspace/<slug>/`；列尾空格重复目录并提出处置建议 | “每条违规产物是否能归到”“重复目录…清单及处置建议” |
| J 新能力 | 统计 REVIEW 文件并检查 decision 五值合规；统计 risk_level 使用频次；检查 needs_human、human_approval 使用合规 | “decision 5 值合规检查”“字段使用频次”“使用合规” |
| K 双账本一致性 | 检查根目录 `fcop_events.jsonl` 应未被 git 跟踪；检查 `.scratch/`、venv、`_*` 临时文件是否被 `.gitignore` 覆盖；列 working tree 噪音 | “应 untracked”“是否在 .gitignore”“working tree 噪音清单” |

报告还必须满足：

- **指定文件名**：`REPORT-20260513-004-ME-to-ADMIN-bridgeflow-cross-project-fcop-audit.md`。原文没有明确该报告的落盘目录。  
  来源：验收中的同名文件。
- **四区呈现**：P0 为阻断 Mode 1 ALL GREEN 的硬违规；P1 为非致命协议偏离；P2 为卫生及改进建议；绿区为已合规关键点。原文示例分别包括缺失 AGENTS/frontmatter 非法、Rule 7.5 软约定违反/版本漂移、根目录 HANDOVER/典型 mtime 异常。  
  来源：“P0 / P1 / P2 三级 + 绿区”及各级说明。
- **逐条结论附事实出处**，以路径及文件名／字段名定位；无法核验可以标为 `unverified`，不得用推测替代证据。  
  来源：“每条结论必须附事实出处”“写 ‘unverified’ 也合法”。

## A｜允许、要求的动作

- 要求进行上述扫描、核验、对比、计数、配对和报告编写；目录整改仅要求归属判断和处置建议，没有授权在目标仓库实施整改。  
  来源：“按以下 11 章扫描”“是否能归到”“处置建议”。
- 本 carrier 必须由 FCoP 的 ME 出具，落在 `D:\FCoP\fcop\tasks\`。  
  来源：“本 carrier 落在…由 FCoP 的 ME 出具”。
- TASK-003 必须保留内容，以 TASK-004 这一“下一序号同前缀新文件”纠错；两者一起从 tasks 归档至 `log/tasks/`，共同保留线程证据链。归档要求不等于允许删除或改写旧账。  
  来源：“TASK-003 不删、不改”“用下一序号同前缀新文件修正”“二者…完整证据链留存”。
- **进入 commit 阶段时**，必须遵循 SOP v2 问题 7，使用显式路径 `git add`，并以 `git status --short` 二次确认；原文未给具体暂存文件集合。  
  来源：“commit 阶段严格走 SOP v2 问题 7”。

## P｜参与关系

| 主体／关系 | 边界 | 短原文依据 |
|---|---|---|
| ADMIN → ME | ADMIN 发出任务，ME 承接；任务优先级 P1，风险 low，与报告发现的 P0/P1/P2 分级不是同一字段 | `sender: ADMIN`、`recipient: ME`、`priority: P1`、`risk_level: low` |
| FCoP 的 ME → ADMIN | ME 出具 carrier 和面向 ADMIN 的报告；未指定独立复核人或额外审批人 | “由 FCoP 的 ME 出具”；报告名含 `ME-to-ADMIN` |
| 被审项目的 ADMIN ↔ leader | 仅在 team 模式下，核验其唯一对外接口关系；不能将当前审计 ME 自动等同为被审项目 leader | “team 模式下是否 ADMIN ↔ leader 唯一对外接口” |
| 各任务 → 回应 | 每条目标 TASK 都须核查同 thread_key 的 REPORT **或**后续 TASK，不要求两者同时存在 | “每条…或 follow-up TASK(按 `thread_key` 配对)” |

## R｜数量、资源与时间范围

- **抽样数量**：每目录头 5、尾 5、中间随机 5，名义合计 **15 个抽样名额／目录**；这不保证 15 个不同文件。目录集合、排序依据、小目录不足额、三组重叠及合规率分母的处理未规定，不能自行补成唯一口径。  
  来源：“每个 dir 取头 5 / 尾 5 / 中间随机 5 份,出抽样合规率”。
- **抽样不能取消独立全量义务**：E 的抽样要求不能自动缩减 G 的“每条 TASK”、I 的“每条违规产物”等明确逐成员要求。  
  来源：E“取样”；G“每条”；I“每条”。
- **哑火阈值含第 7 天**：条件为“任务年龄 ≥7 天”与“无回应”同时成立；具体年龄依据哪个时间字段、采用何时为统计截点未说明。  
  来源：“任务 ≥7 天无回应”。
- **归档统计有两个范围**：全部历史与最近 30 天；最近 30 天的截点及端点口径未说明。  
  来源：“总条数 / 最近 30 天”。
- **既有数量仅是基线**：7 个 `_patch_*.py`、12 个 `.smoke-*`、两个 venv、两组尾空格重复目录和“6+ 类违规”均不是本次扫描上限，也不是已核验最终统计。  
  来源：基线各行及“本次基线已发现 6+ 类违规”。
- 原文未规定审计截止时间、工时或费用额度；创建时间 `2026-05-13T07:22:00+08:00` 不等于截止时间。  
  来源：`created_at`；正文未列上述额度。

## V｜版本与依据

- 当前任务为 `TASK-20260513-004`，协议元数据为 `protocol: fcop`、`version: 1`，替代 TASK-003 的当前任务效力，但保留 TASK-003 历史。共同归档线程为 `bridgeflow-cross-project-audit-20260513`。  
  来源：`task_id`、`supersedes`、`thread_key` 及修正说明。
- 四件套版本比较以 **`D:\FCoP` 仓库内最新版本**为基准，不是任选网络版本；原文未给基准的确切版本号或提交。  
  来源：“与 D:\FCoP 仓库内最新版本对比”。
- 检查依据包括 Rule 0.c、4、4.5、5、6、7.5，v1.0 配置字段、v1.0/v1.1 能力、0.7.1+ `fcop_check()` 等价检查，以及 commit 阶段的 SOP v2 问题 7。原文未提供这些规范全文，不能臆造 decision 五个合法值、slug 语法、字段校验细则或 SOP 其余步骤。  
  来源：各章规则标注、“0.7.1+ `fcop_check()` 等价检查”“SOP v2 问题 7”。

## C｜完成、停止及升级条件

- 完成须交付指定报告，覆盖 11 章、分级及绿区、逐条事实出处；同时满足 Bridgeflow 零写入、适用的 commit 检查以及两份 TASK 联合归档要求。  
  来源：“输出格式”“验收”。
- **ALL GREEN 是被核验状态，不是要求审计把项目修到全绿**：原文将其描述为 `fcop_audit(scope=takeover)` 三色全绿且 `P0=P1=P2=0`；发现违规仍应如实交付报告。  
  来源：“验证…是否还在 ALL GREEN,有没有新出现的回退”。
- 无法验证的结论可标 `unverified`，但这不取消相应检查项。原文没有规定发现 P0 后立即停止、自动整改或升级审批的程序。  
  来源：“写 ‘unverified’ 也合法”；正文无另列停止／升级条件。

## B｜独立禁止、限制与局部不明确处

- **Bridgeflow 仓库内禁止写任何文件**，覆盖协议文件、业务文件及审计可能产生的其他文件；前文“禁止写 FCoP 协议文件”不构成对其他写入的许可。  
  来源：“不在 Bridgeflow 仓库下写任何文件”“绝不修改 Bridgeflow 任何文件”。
- 禁止读取 task/report/issue 正文，禁止删改 TASK-003，禁止无事实依据作结论；归档、核验及报告均受这些独立限制约束。  
  来源：“不读…body”“不删、不改”“不允许‘我以为是这样’”。

需保留的局部问题：

| 位置 | 不明确或冲突 |
|---|---|
| 跨项目读取限制 ↔ D、H、K 等检查 | “只读文件名 + frontmatter”若按字面适用于所有文件，则无法完整读取 `fcop.json`、`.gitignore` 或差异内容；原文未列例外。明确的正文禁读与各章检查义务均须保留，不能默认为已获扩展读取授权。 |
| D、E ↔ F | D 排除配置 roles 中的 ADMIN；E 要求 sender/recipient 均属于该 roles；F 又检查 ADMIN↔leader 路由。对含 ADMIN 的端点，原文没有说明外部角色例外，存在判定口径冲突。 |
| C 标题 ↔ 清单 | 标题称“三层”，但明确列 Layer 0、1、2、3 共四层；检查对象仍应完整保留这四层。 |
| E 抽样、G/H 时间统计 | 目录集合、排序、去重、样本不足处理、年龄字段及统计截点等未确定，见 R；这些是具体口径缺项。 |
| 基线 ↔ 后续核验 | smoke 目录同时被标为 Rule 7.5 问题并注明“合理 sandbox?需核”；venv、事件账本、HANDOVER 也有条件性判断。不得把这些待核状态直接固化为最终违规。 |

实际合规率、违规数量、是否存在回退及最终分级属于未来核验结果，**未知不等于任务边界不明**。