## I｜输入与作用域

- **任务身份**：ADMIN 发给 ME 的 `TASK-20260522-006`，关联 `TASK-20260522-005`；协议 `fcop` v1，优先级 P1，风险标注 low。来源：“`sender: ADMIN`”“`recipient: ME`”“`related: [TASK-20260522-005]`”。
- **任务对象**：根据 3.0.2 发版后异机、弱模型 fresh-install 的现场失败，起草可复制使用的中英双语 bringup prompt，覆盖从零到能用。来源：“落一份 `agent-bringup-prompt` 双语档（zh + en）”“完整链路”。
- **层级区分**：本任务交付的是 prompt、资源入口、索引及验收记录；安装、升级、初始化和体检是 **prompt 必须规定的未来操作**，不能据此认定 ME 本次应实际执行这些操作。来源：“起草……双语防呆 prompt”“内容五段式”。

## O｜产物与交付

| 必须交付 | 边界及短引文 |
|---|---|
| 两份新 prompt | `src/fcop/rules/_data/agent-bringup-prompt.zh.md` 和 `.en.md`；两份均须五段式齐全，随 wheel 部署。来源：“新建文件（双语，跟随 wheel 部署）”。 |
| MCP 资源入口 | `fcop://prompt/bringup` → 中文文件；`fcop://prompt/bringup.en` → 英文文件。来源：“指向 zh.md”“指向 en.md”。允许延期例外见 C。 |
| 双语 README 索引 | `README.md`、`README.zh.md` 各加一行，放在“agent 安装”段落附近，指向 bringup prompt，表达换电脑或升级版本时使用。来源：“zh + en 两份 README 都加一行”。 |
| 条件性清单更新 | release audit 若触发所述文档 drift，同步更新 `RULES-release-file-inventory.md` §2。来源：“如果触发了……§2 同步更新”。 |
| 完成记录 | 写 `REPORT-006`，归档 `TASK-006`。来源：“写 REPORT-006，archive TASK-006”。原文未指定报告路径或模板。 |

## A｜动作与内容要求

以下五段要求适用于**中英两份 prompt**。

| 章节 | 必须写明的动作、条件与结果 |
|---|---|
| **§1 环境检查** | 执行 `python --version`，要求 Python ≥3.10；用 `pip show fcop fcop-mcp` 查看当前版本；向 ADMIN 报告后停止，由 ADMIN 决定是否升级。来源：“报告结果给 ADMIN 后停，等 ADMIN 决定是否升级”。 |
| **§2 升级到目标版本** | 给出 `pip install --upgrade --no-cache-dir "fcop==X.Y.Z" "fcop-mcp==X.Y.Z"`；给出 `python -c "import fcop, fcop_mcp; print('fcop:', fcop.__version__, '/ fcop-mcp:', fcop_mcp.__version__)"`；要求两个版本一致。来源：“升级到目标版本”“两个版本号必须一致”。 |
| **§3 抽象层边界** | 明确 `fcop_report()`、`init_solo()`、`init_project()`、`fcop_audit()` 是 MCP 工具，使用前须把 fcop-mcp 挂到 Cursor 的 `mcp.json`；`import fcop` 后没有这些函数属正常，不得猜名字。来源：“这是 MCP 工具不是 Python 函数”“不要瞎猜其它名字”。 |
| **§3 Python 兜底** | 没装 fcop-mcp 时，允许给出 `from fcop import Project; Project('.').init(mode='solo', role_code='ME')`。这是条件许可；其中 solo 初始化仍受 ADMIN 选择权约束。来源：“如果没装 fcop-mcp，可以走 Python API 兜底”；关联 P 中“任何 `init_*`”。 |
| **§3 anti-pattern** | 至少包含原文四项及解释：① `init_project(team="ME")`，ME 是角色码而非团队名；② `fcop.fcop_report()`，混淆 MCP 与 Python；③ PowerShell 使用 `head` / `grep`，应使用 `Select-Object -First` / `Select-String`；④ 想象不存在的 `fcop.project.Project.init_project(...)`。来源：“anti-pattern 清单（已知坑）”“≥ 4 条”。 |
| **§4 初始化** | 调 `fcop_report()` 获取 Phase 1 汇报；停止，等待 ADMIN 从 solo／预设团队／自定义中选择；选择后才能调对应 `init_*`。来源：“ADMIN 选完后再调对应 `init_*`”。 |
| **§5 验证与体检** | 再调 `fcop_report()` 进入 Phase 2，确认角色绑定；验证 `fcop/_lifecycle/` 下 intent、plan、execution、verification、archive **全部物理存在**；明确点名 3.0.2 修复重点；执行 `fcop_audit(scope="new")`，向 ADMIN 贴出 P0／P1／P2 计数。来源：“五桶……都已物理存在”“把 P0 / P1 / P2 计数贴给 ADMIN”。 |

**每个章节均须重申三项行为约束**，不能只在总则出现一次：

- 每完成一步必须报告结果，不得自动跳下一步。来源：“行为约束（每个章节都要重申）”“每完成一步必须报告结果”。
- 遇到不确定，优先读 `LETTER-TO-ADMIN.md` / `getting-started.md`，不得猜测。来源：“碰到不确定，优先读……不要瞎猜”。
- 初始化由 ADMIN 选择，agent 不得默认。来源：“任何 `init_*` 是 ADMIN 的选择题”。

**本次任务还须实际完成的验收动作**：

- 跑一次 `python scripts/release_audit.py`，检查文档相关 P0／P1，并按 O 中条件更新清单。来源：“跑一次……看是否触发文档相关 P0 / P1”。
- 跑一次 `python scripts/inventory_drift.py`，使三类警告清零。来源：“三类警告清零”。
- 完成报告和任务归档，见 O。

## P｜参与关系与决策权

- **ADMIN → ME**：ADMIN 下达起草任务，ME 是任务接收者；原文未另设独立复核人。来源：“`sender: ADMIN`”“`recipient: ME`”。
- **未来 agent → ADMIN**：agent 每步报告；环境检查后由 ADMIN 决定是否升级；初始化前由 ADMIN 作三选一决定。来源：“等 ADMIN 决定是否升级”“停下，等 ADMIN 三选一”。
- **选择必须先于初始化**：ADMIN 尚未选择时，不得执行对应初始化；Python 兜底代码不能成为默认 solo 的授权。来源：“agent 不准默认”“ADMIN 选完后再调对应 `init_*`”。
- **报告接收关系**：步骤结果及 P0／P1／P2 体检计数交给 ADMIN。来源：“报告结果给 ADMIN”“计数贴给 ADMIN”。原文未规定 REPORT-006 的单独审批流程。

## R｜数量、资源与时间

- 交付规模：**2 份 prompt，各 5 段；2 个资源映射；2 份 README 各 1 行索引**。来源：“双语”“五段式”“zh + en 两份 README 都加一行”。
- anti-pattern **至少 4 条**，原文列出的四类均属必含内容；五桶验证要求 **5/5 物理存在**。来源：“含 anti-pattern 清单 ≥ 4 条”“都已物理存在”。
- 运行环境与版本关系：Python ≥3.10；目标版本保留变量 \(T=X.Y.Z\)，升级命令要求 `fcop==T`、`fcop-mcp==T`，升级后验证二者一致。来源：“≥3.10”“两个版本号必须一致”。
- **无硬截止**；本次会话完成草稿和验收是建议，下次会话决定发版时间也是建议安排，不能转成硬性截止。来源：“无硬截止。建议本次会话内完成草稿+验收，下次会话决定何时发版”。

## V｜版本与依据

- 任务背景基线为 **3.0.2 发版后**；五桶验证须明确关联 3.0.2 修复，保留原文对 3.0.0／3.0.1 的历史问题描述。来源：“这是 3.0.2 修的关键 bug”“3.0.0 / 3.0.1……这五桶是空的”。
- **3.0.2 不是已经指定的安装目标**；目标版本在原文中仍为 `X.Y.Z`，不得自行固定。来源：“升级到目标版本”“fcop==X.Y.Z”。
- 资源暴露应与现有 `agent-install-prompt` 一致；注册位置依实际架构，在 `src/fcop/rules/__init__.py` 或 MCP resources 注册处，可能是 `mcp/src/fcop_mcp/server.py`。这是合法待定实现选择。来源：“视当前架构而定”。
- 不确定时的文档依据见 A；`LETTER-TO-ADMIN.md` 可读但不可改。来源：“优先读”“不动 `LETTER-TO-ADMIN.md`”。

## C｜完成、停止与条件处理

- **完成须组合满足**：双语文件存在且五段完整；边界与四类 anti-pattern 齐全；五桶及 3.0.2 说明齐全；资源入口满足下述二选一；两份 README 索引齐全；两项脚本验收及条件性清单更新完成；REPORT-006 和 TASK-006 归档完成。来源：“验收标准”1—8。
- **资源入口的明确例外**：本次可使两个 URI 可解析；也可在文档说明资源暴露留待下次 release，但本次两份文件仍必须进入 wheel。延期不免除文件交付。来源：“或文档说明留白到下次 release 处理，本次先把文件落进 wheel”。
- **prompt 停止条件**：每步报告后不得自动继续；§1 等待升级决定，§4 等待初始化选择。来源：“不准自动跳下一步”“等 ADMIN 决定”“等 ADMIN 三选一”。
- **不得自造验收阈值**：未来 `fcop_audit(scope="new")` 要求报告三档计数，未要求全部为零；本任务 `inventory_drift.py` 则明确要求三类警告清零。来源分别为“计数贴给 ADMIN”和“三类警告清零”。

**局部未说明之处：**

- §3 允许无 MCP 的 Python 兜底，但 §4／§5 仍要求 MCP 汇报与体检；原文未给出这些步骤的无 MCP 替代路径，也未豁免它们。
- 除升级和初始化两处明确等待 ADMIN 外，其他步骤停止后如何获准继续，未具体规定。
- `release_audit.py` 要检查文档相关 P0／P1，并规定触发 drift 时更新清单；其他发现的处置及该脚本统一通过阈值未明确。不能据此增加“所有 P0／P1 必须为零”的原文外条件。

## B｜独立禁止与限制

- 不修改 `agent-install-prompt.zh.md` 现有内容或定位，不把 bringup 内容混入其中。来源：“不改……现有内容”“不要混进 bringup 的内容”。
- 不修改 `LETTER-TO-ADMIN.md`。来源：“这次不重复改”。
- 不实现工具层 anti-pattern 防呆或错误参数报错改造；仅解决 prompt 层，更深演化留待 ADR／v3.1.x 候选。来源：“本 task 只解决 prompt 层”“留给 ADR 起草”。
- 本任务不发新版本，增补积累到下次 minor／patch。来源：“不发新版本”。
- 不修改协议规则 `fcop-rules.mdc` / `fcop-protocol.mdc`。来源：“不改协议规则……不动”。
- prompt 中须禁止自由发挥、猜 API、混用 MCP 与 Python、将角色码当团队名、自动跳步或替 ADMIN 默认初始化；具体逐项约束见 A、P。来源：“不准自由发挥”“agent 不替 ADMIN 默认”。