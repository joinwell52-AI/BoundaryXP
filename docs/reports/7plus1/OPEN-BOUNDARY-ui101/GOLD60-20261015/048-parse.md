## I｜输入与作用域

| 边界 | 原文依据 |
|---|---|
| 本任务为 `TASK-20260522-005`，ADMIN 发给 ME，优先级 P0、风险 medium；目标是把发版清单落实为一键检查器，并接入发版 CI。 | “sender: ADMIN”“recipient: ME”“priority: P0”“risk_level: medium”；“可一键执行的检查器” |
| 发版资产范围以 `fcop/shared/RULES-release-file-inventory.md` §2 的 **12 类**为准；inventory drift 对照 Git 跟踪文件，Repo-orphan 仅覆盖符合发版资产模式的文件，不是所有仓库文件。 | “扫 inventory §2 列出的 12 类文件”；“对照 `git ls-files`”；“符合发版资产模式” |
| release sync 的输入依据为 `docs/release-process.md` §G 六条扫描，以及下列 R1–R12 明列要求。 | “§G 的 6 条 `rg` / `python` 扫描翻译成 Python”；“必做的扫描类别” |
| 相关任务／报告为 `TASK-20260522-004`、`REPORT-20260513-011`、`REPORT-20260513-013`；它们仅被关联，正文未提供，不能据此补造要求。 | `related: [...]` |

## O｜产物与交付

| 产物 | 边界与原文依据 |
|---|---|
| `scripts/release_audit.py` | 本仓发版 audit 入口，对应 `audit.release_sync_check(new_version, old_version)`；“本仓 utility,不打包进 wheel”。 |
| `scripts/inventory_drift.py` | 对应 `audit.inventory_drift()`，输出 Clipboard-orphan、Repo-orphan、Path-drift 三段；“对照 `git ls-files` 输出三段”。 |
| 检查报告 | release audit 输出靠拢 `fcop_audit()` 的 INSPECTION：`structured-findings` + `suggested-remediation`，修复建议应可复制到命令行执行；“命令行复制粘贴可执行”。 |
| 双语 finding | 两个脚本的每条 finding 均须有 `zh:`、`en:` 两行；“脚本输出中英文双语”“每条 finding 都有”。 |
| `release.yml` 修改 | 在 `verify` 现有“双包版本一致校验”后，依次追加 release sync audit 和 inventory drift scan；“之后追加两步”。 |
| inventory 文档更新 | §4 将“未来实现 P3”改成“v3.0.3 实现”，原第 299–311 行待办移入已实现，并链接两个脚本；§6 增加指定变更记录。 |
| 闭环记录 | 须完成 `task → 做 → REPORT-005 → archive`；“本 TASK 走完 Rule 0.a.1 四步循环”。 |

§6 指定记录为：

```text
| 2026-05-22 | v1.1 | §4 audit hook 落地为 scripts/release_audit.py 与 scripts/inventory_drift.py | TASK-20260522-005 |
```

## A｜动作与逐项检查边界

### release audit

接口须支持 `--new`、`--old`，默认扫全部；支持 `--only` 选择类别和 `--ci` 模式。原文示例选择为 `--only versions,changelog,public-docs`，不是要求固定选择这三类。R9 另须支持特定草案白名单。（依据：“扫一切”“只跑某几类”“CI 模式”“`--allow-proposed adr-NNNN,adr-MMMM`”。）

以下以 \(N=\texttt{--new}\)、\(O=\texttt{--old}\)、\(D=\) 检查时“今日”表示尚待调用确定的输入。

| ID／级别／inventory 类 | 必须满足的检查边界 | 短原文依据 |
|---|---|---|
| R1／P0／A | `src/fcop/_version.py` 与 `mcp/src/fcop_mcp/_version.py` 的版本值一致，且均为 \(N\)。 | “完全一致且 == `--new`” |
| R2／P0／A | `mcp/server.json` 顶层 `version` 和 `packages[]` 中每个成员的 `version` 均为 \(N\)。 | “顶层 `version` 与 `packages[].version` 都 == `--new`” |
| R3／P0／E | `CHANGELOG.md` 含目标版本的 `## [X.Y.Z] — YYYY-MM-DD` 标题，使用 em-dash，日期为 \(D\)。 | “em-dash,不是 hyphen”“日期为今日” |
| R4／P0／D | `README.md`、`README.zh.md`、`mcp/README.md`、`docs/index.html`、`essays/README.md` **逐文件**不得再含 \(O\) 字面量；CHANGELOG 历史段允许命中。 | “中不再含 `--old` 字面量”“允许 CHANGELOG 历史段命中” |
| R5／P0／D | 根目录英文 `README.md`、中文 `README.zh.md` 的对应近期发版表中，各有一行包含 \(N\)。 | “‘近期发版’表 / ‘Recent releases’表都含 `--new` 一行” |
| R6／P0／D | `CITATION.cff` 的 `version` 为 `v` 加 \(N\)，`date-released` 为 \(D\)。 | “`version` == `v--new`,`date-released` == 今日” |
| R7／P0／B | `src/fcop/rules/_data/letter-to-admin.{zh,en}.md` 两份均存在，且各自摘要块顶部含 `v` 加 \(N\)。 | “摘要块顶部含 `v--new`”“zh + en 双份必齐” |
| R8／P0／F | inventory §F 所列全部五处的 `vX.Y.Z` 字面量均为 `v` 加 \(N\)，包含 `server.py:779` 和四处 test 断言。 | “5 处行号(server.py:779 + 4 处 test 断言)” |
| R9／P1／G | `adr/ADR-*.md` 不得命中 `^Status: Proposed`；仅 `--allow-proposed` 指定的草案可豁免。 | “白名单豁免特定草案” |
| R10／P1／K | `git remote -v` 中具备匹配 `^backup\s` 的 fetch、push 两行。 | “两行(fetch + push)” |
| R11／P1／A | `mcp/pyproject.toml` 的 `dependencies` 含目标版本对应的同 MINOR pin：`fcop>={MAJOR}.{MINOR}.0,<{MAJOR}.{MINOR+1}.0`。 | “ADR-0002 同 MINOR pin” |
| R12／P1／B | inventory §B 的 `letter-to-admin`、`agent-install-prompt`、`internal-readme`、`fcop-spec-v*`，全部对应对象均须有 zh、en 配对。 | “全部存在 zh + en 配对”“任何一份单边 = P1” |

### inventory drift

以 inventory §2 每行“文件枚举”的路径／模式对照 `git ls-files`，递归匹配 12 类各自的资产模式。第一版允许模式匹配不完全精确，但三类检查仍须实现。（依据：“每行‘文件枚举’列举的精确路径”“递归匹配 12 类各自的路径模式”“不要求 100% 精确”。）

| 输出类别 | 检测条件与级别 | 短原文依据 |
|---|---|---|
| Clipboard-orphan | 清单列有、Git 跟踪文件中没有：P1。 | “清单有,仓库无”“→ P1” |
| Repo-orphan | Git 跟踪文件存在、符合发版资产模式、未纳入清单：P1 提示。 | “仓库有,但符合发版资产模式却不在清单” |
| Path-drift | 同名文件出现在不同路径，识别清单路径未同步：P0。 | “同名文件出现在不同路径”“→ P0” |

原文给出的实现思路是解析 Markdown 列表中 backtick 包围的相对路径，并接受 `adr/ADR-*.md`、`docs/MIGRATION-*.md` 等模式。（依据：“实现思路”“第一版接受正则模式”。）

### CI 组合关系

- `verify` 在 tag push 及 `workflow_dispatch dry_run=true` 时运行；新增步骤须位于既有“双包版本一致校验”之后。（依据：“在 tag push 时跑(以及 `workflow_dispatch dry_run=true`)”。）
- release audit 用 `steps.tag.outputs.version` 传 `--new`，用 `steps.last_tag.outputs.version` 传 `--old`，带 `--ci`；随后运行 `py -3.10 scripts/inventory_drift.py --ci`。（依据：要求 3 的两步 YAML。）
- 校验失败须阻止 publish job；这是已有门禁上补充扫描内容的要求。（依据：“CI 不通过则 tag push 不会触发 publish job”。）

## P｜参与关系

| 主体 | 关系与边界 | 原文依据 |
|---|---|---|
| ADMIN | 任务下达者；要求协议、工具、目录文件及双语检查覆盖。 | “ADMIN 钦定原话”“都不能错过” |
| ME | 本任务接收者，承担实现、验证、报告与归档闭环。 | “recipient: ME”；“本 TASK 走完…四步循环” |
| CI `verify`／`publish` | `verify` 执行检查，检查结果约束 `publish` 能否触发。 | “CI 不通过…不会触发 publish job” |
| 外部读者 | 双语脚本输出的阅读对象。 | “确保外部读者也能看懂 CI failure” |

原文未指定独立复核人、最终验收人或额外审批程序，不能补设此类参与义务。

## R｜资源、数量与时间范围

- 指定调用环境为 `py -3.10`；实现为两个仓库 utility 脚本，不计入 wheel。（依据：全部调用示例；“不打包进 wheel”。）
- 必做 release 检查为 **12 项：8 项 P0、4 项 P1**；另有 inventory drift 三类结果。inventory 的“12 类”与 R1–R12 并非一一对应，须分别保留覆盖义务。（依据：R1–R12 对应 inventory 列；“扫…12 类文件”。）
- R8 覆盖五处，R4 覆盖五个指定文件，R2 对 `packages[]` 全体成员成立，R12 对所列各组对象逐一成立，不得只检查代表项。（依据：对应检查行的“5 处”“都”“全部”。）
- R11 若目标版本为 `3.0.3`，所要求 pin 为 `fcop>=3.0.0,<3.1.0`，即下端包含、上端不包含。（依据：R11 公式。）
- R3、R6 的“今日”是检查时日期；原文未明确日期时区，也未给项目截止时间。ADMIN 引语的 `+08:00` 不能自动补作脚本日期规则。（依据：“日期为今日”“date-released == 今日”。）
- “任何一项不通过立即 `exit 1`”中的“立即”是失败处理要求，不换算为数值时限；其适用级别冲突见下文。（依据：目标第 2 条。）

## V｜版本与依据

- inventory 依据为 **2026-05-13 v1.0** 的 §2、§4，另引用 §B、§F；本次记录升级为 **2026-05-22 v1.1**，hook 标注“v3.0.3 实现”。（依据：“2026-05-13 v1.0 落档”；要求 4。）
- release sync 依据包括 `docs/release-process.md` §G；pin 依据 ADR-0002；双语文档暂缓依据 `Discipline level §5`；任务闭环与范围控制依据 Rule 0.a.1；workflow 风险依据 Rule 7。（依据：各处明确引用。）
- CLI 一般示例为 `--new 3.0.2 --old 3.0.1`，验收命令则为 `--new 3.0.3 --old 3.0.2`。示例不把通用检查器固定为某一版本。（依据：接口示例、验收 1。）
- 若 §G 扫描命令有 bug，须**先在本 TASK 修新脚本，再写 follow-up TASK 改 SOP §G**，保留权威源更新次序。（依据：“先…修脚本”“再…写一份 follow-up TASK 改 SOP §G”。）

## C｜完成、停止及升级条件

| 条件 | 边界与原文依据 |
|---|---|
| release audit 正向验收 | 按验收 1，指定 `--new 3.0.3 --old 3.0.2 --ci` 命令要求全绿；但其所述现状与检查规则冲突，不能直接认定可满足，见下文。 |
| R2 反向验收 | 故意将 `mcp/server.json` 版本退回 `3.0.1`，运行 R2 必须报红，并指出具体行号和修复命令。（“必须报红”“具体行号 + 修复命令”。） |
| drift 当前仓库验收 | 单独运行 `scripts/inventory_drift.py`，至多 P1、无 P0；允许新增 essay 未列入清单。（“至多 P1 警告”“无 P0”。） |
| CI 实际验证 | 必须先用 `workflow_dispatch dry_run=true` 验证；新两步实际跑过，日志须显示 R1–R12 全绿、`drift = 0`。（备注及验收 4。） |
| 文档与流程完成 | inventory §4、§6 更新，且完成 `REPORT-005` 与 archive 闭环。（验收 5、6。） |
| 范围外必要改动 | 必须停止，向 `.fcop/proposals/` 提交 `drop_suggestion`，另起新 TASK；必要性不免除此条件。（“任何超出本 TASK 范围的必要改动 → 停下”。） |

## B｜独立禁止与限制

- 不新增 `fcop` 库内 `_scan_*`；发版 audit 归 `scripts/`，不打包进 wheel。（依据：“不新增 `fcop` 库内的 `_scan_*`”；要求 1。）
- 不将 hook 嵌入 `release.yml` 之外的工作流，包括 test-fcop、test-fcop-mcp。（依据：“不把 audit hook 嵌进 `release.yml` 之外的工作流”。）
- 不改变 inventory §2 的 12 类划分；文档修改为 §4 实现更新及明确要求的 §6 记录。（依据：“不改…§2 的 12 类划分”；要求 4。）
- 本轮不把 inventory、`RULES-release-sync-checklist.md`、`docs/release-process.md` 翻成英文；这不免除脚本 finding 双语义务。（依据：“本轮先不翻成英文”“脚本本身输出双语”。）
- 不允许直接 push 到 main；dry-run 验证是独立前置义务，通过验证也不自动解除此禁令。（依据：“必须先用…验证;不允许直接 push 到 main”。）
- 不顺手修改其他文件；发现 SOP §G bug 时，依 V 中专门规则处理。（依据：“实现期间不要顺手改其他文件”；备注最后一条。）

## 原文局部冲突与未确定处

1. **验收 1 与目标版本检查直接冲突。** 它要求在“现状已对齐到 3.0.2”时，以 `--new 3.0.3 --old 3.0.2` 全绿；但 R1、R2 等要求等于 `3.0.3`，R4 还禁止指定公共文档含 `3.0.2`。“已对齐到 3.0.2”不能支持该全绿结论。不能擅自改命令、改验收现状或放宽检查。

2. **失败退出范围未统一。** 目标要求“任何一项不通过立即 `exit 1`”，接口说明却是“CI 模式(任何 P0 不通过 exit 1)”。后者未明确 P1 是否也退出，普通模式及 drift `--ci` 的退出策略也未完整规定；不能自行断言 P1 一律阻断或一律放行。

3. **两处 drift 验收强度不同。** 验收 3 允许当前仓库有 P1，验收 4 要求 CI `drift = 0`。两条都须保留；若指同一仓库状态且 `0` 指全部发现数量，则允许保留 P1 与 CI 零发现有冲突。“drift = 0”的具体计数口径未定义。

4. **若干接口和匹配细节未定。** `--only` 示例别名与 R1–R12 的完整映射、hook 名是否必须作为实际 Python API、摘要块“顶部”的定位规则均未明确。所谓“正则模式”举例实际采用 glob 风格，确切模式语法待明确；不能据此删去模式覆盖要求。

5. **被引用材料未随原文提供。** 12 类的完整枚举与模式、§F 四处 test 位置、§G 六条命令和规则全文均无法从本数据恢复。R5 虽名为 `mcp-readme-pair`，对象明确为根目录两份 README，应保留明确路径，不凭名称换成 MCP 文件。实际扫描结果、CI 日志是否达标属于待验证状态，不属于原文边界不明。