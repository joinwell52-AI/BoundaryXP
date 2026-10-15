## I · 输入与作用域

- 任务为修复 FCoP 3.0 初始化的协议层 bug，覆盖 fresh init、audit、测试、文档、MCP tools 及 3.0.2 发布。背景为 3.0.0/3.0.1 已承诺 v3 五桶，但 `_apply_init` 未创建。（引文：“所有 3.0.x 全新初始化的项目都不合规”“MCP tools 同步纳入本 task”）
- 修改定位为 `src/fcop/project.py::_apply_init`，原文标注行号 924–931；既有项目不属于 fresh init 行为变更的影响范围，但本仓迁移另有明确要求。（引文：“修改…line 924-931”“已存在项目不受影响”“在本仓跑…migrate --to-v3”）
- 输入依据包括 ISSUE-20260522-001-ME 与 `.fcop/proposals/TASK-004-draft-fix-init-v3-topology.md`；后者的 **v2 草案版本**已获 ADMIN 确认，不应与 v2 项目拓扑混同。（引文：“完整草案见…（ADMIN 已确认 v2 版本）”）

## O · 产物与交付

| 产物 | 必须满足的边界及短引文 |
|---|---|
| 初始化代码 | `_apply_init` 删除 `self.tasks_dir`、`self.log_dir` 的 `mkdir`；引入并调用 `ensure_lifecycle_dirs(self._workspace_root / '_lifecycle')`；保留 `reports_dir`、`issues_dir`、`shared_dir`。（“删除…mkdir”“调用…”“保留…”） |
| 初始化测试文件 | 新建 `tests/test_init_v3_topology.py`，包含下列七项指定测试。（“新建…”，逐项要求见下） |
| audit 扫描器及测试 | 新建 `_scan_lifecycle_topology_compliance()`，满足 A 中的分级规则，并覆盖完整 v3、缺失 v3、残留 v2 桶的 v3、v2 项目。（“单元测试覆盖：v3 完整 / v3 缺 / v3 残留 v2 桶 / v2 项目”） |
| LETTER | `fcop/LETTER-TO-ADMIN.md` 保留 v3 承诺，增加“3.0.2 起 fresh init 立即兑现”。（“保留 v3 承诺，加一句…”） |
| 用户文档 | `README.md` 补 3.0 安装节、init / migrate 两条路径及升级指南；`docs/getting-started.md` 同步两条路径。（“补 3.0 安装节 + 两条路径…+ 升级指南”“同步两条路径”） |
| MCP 描述 | `mcps/user-fcop/tools/*.json` 中 `init_solo`、`init_project`、`create_custom_team` 三个描述均加入“v3 拓扑”。（“描述加‘v3 拓扑’字样”） |
| 发布记录 | `CHANGELOG.md` 增加 3.0.2 节，并引用 ISSUE-001、TASK-004、REPORT-004。（“加 3.0.2 节，引用…”） |
| 完成报告 | 写 `REPORT-20260522-004-ME-to-ADMIN`。（“完成后…写 REPORT…”） |

指定初始化测试：

| 测试名 | 必须验证 |
|---|---|
| `test_init_solo_creates_lifecycle()` | 五个 lifecycle 子桶存在 |
| `test_init_project_creates_lifecycle()` | dev-team 初始化后同上 |
| `test_init_custom_team_creates_lifecycle()` | 自定义团队初始化后同上 |
| `test_init_v3_does_not_create_tasks_dir()` | `tasks/` 不存在 |
| `test_init_v3_does_not_create_log_dir()` | `log/` 不存在 |
| `test_init_v3_keeps_reports_issues_shared()` | 三个保留桶均存在 |
| `test_is_v3_after_init()` | `Project.is_v3` 返回 `True` |

来源为 §4.2 对应逐项原文：“五子桶必须存在”“同上（dev-team）”“同上”“`tasks/` 不存在”“`log/` 不存在”“三桶必须存在”“返回 True”。

## A · 动作及条件关系

- **逐入口满足同一拓扑**：fresh `init_solo`、`init_project`、`create_custom_team` 每一个执行后，都须具备五个 lifecycle 子桶及三个保留桶，并且无 `tasks/`、`log/`。不能以三个入口合计覆盖替代逐入口达标。（引文：“fresh `init_solo` / `init_project` / `create_custom_team` 之后磁盘上有…”）
- **audit 条件分别成立**：

  | 条件 | 要求 |
  |---|---|
  | v3 协议号且缺 `_lifecycle/` | 报 P0 violation，并建议 `python -m fcop migrate --to-v3` 或重新 init |
  | v3 项目残留 `tasks/` 或 `log/` | 报 P1 hygiene warning |
  | v2 项目 | 此拓扑检查无 violation |

  两项 v3 条件若同时成立，应保留各自要求，原文没有规定互斥或以 P0 替代 P1。（引文：“v3 协议号但缺…→ P0 violation”“v3 项目残留…→ P1 hygiene warning”“v2 项目（无 violation）”）
- 完成后还须写报告、归档 TASK-004、关闭 ISSUE-20260522-001-ME，并在本仓执行 `python -m fcop migrate --to-v3`。这些是独立收尾义务；原文未规定四项之间的严格顺序。（引文：“完成后”下四项）

## P · 参与关系

- 指令由 ADMIN 发给 ME，优先级 P0，线程为 `fix-init-v3-topology-3.0.2`；ME 是任务接收者，完成报告面向 ADMIN。（引文：“sender: ADMIN”“recipient: ME”“priority: P0”“ME-to-ADMIN”）
- ADMIN 已确认草案 v2；但发布仍须另行取得 ADMIN 的 `mark_human_approved`，草案确认不能替代发布批准。（引文：“ADMIN 已确认 v2 版本”“发版前 ADMIN 必须 `mark_human_approved`”）
- CI 与 audit 自检构成技术门槛，ADMIN 人工批准构成发布门槛，三者不能相互替代。（引文：“CI 不绿不 merge”“自检通过”“后才发版”）

## R · 资源、数量与时间范围

- 改动必须落在 git 分支 `fix/init-v3-topology`。（引文：“改动落 git 分支…”）
- 每个 fresh init 入口要求 **5 个 lifecycle 子桶 + 3 个保留桶 = 8 个指定桶**；其中五桶为 `inbox`、`active`、`review`、`done`、`archive`。此计数不含父目录 `_lifecycle/`，也不表示禁止其他未提及目录。（引文：“`_lifecycle/{inbox,active,review,done,archive}/` + `reports/` + `issues/` + `shared/`”）
- 时间关系：CI 绿后才可 merge；测试全绿、takeover audit 通过及 ADMIN 批准均须在发布前满足；收尾事项置于“完成后”。无具体截止日期或耗时额度。（引文：“CI 不绿不 merge”“发布前”“完成后”）
- “立即兑现”描述 3.0.2 fresh init 即具备承诺拓扑，不构成可自行换算的数值时限。（引文：“3.0.2 起 fresh init 立即兑现”）

## V · 版本与依据

- 发布版本固定为 **3.0.2 patch**，用于兑现已有 spec 承诺，原文定性为非 breaking。（引文：“版本号 3.0.2（patch，对齐 spec 既有承诺，非 breaking）”）
- 按 spec §1.1 创建 v3 lifecycle 五桶，按 spec §6 不再创建 `tasks/`、`log/`，执行钦定 A1 与 v3+C 方案。（引文：“spec §1.1…MUST 有…”“按 spec §6 不再创建…”“A1”“v3+C”）
- 风险标记为 `risk_level: high`、`needs_human_approval: true`，原因涉及协议核心初始化路径、audit 与 LETTER。（引文：“risk_level: high”“协议核心初始化路径 + audit + LETTER”）
- 原文指定回滚方式为 `pip install fcop==3.0.1`，同时声明目录变更不可逆且只影响 fresh init；不能据此推导降级会恢复目录状态。（引文：“回滚：…”“删除目录改动不可逆但只影响 fresh init”）

## C · 完成、停止及审批条件

- 验收要求合取成立：`pytest tests/` 全绿且包含新增测试；三个 fresh init 入口分别满足拓扑；audit 按条件报 P0/P1；LETTER、README、docs、MCP 描述全部对齐；CHANGELOG 3.0.2 节落地。（引文：“验收标准”第 1–5 项）
- **发布必要条件**：上述交付与验收要求之外，还必须满足 `fcop_audit(scope=takeover)` 自检通过及 ADMIN 已 `mark_human_approved`。人工批准不豁免技术要求。（引文：“发布前：`pytest tests/` 全绿 + `fcop_audit(scope=takeover)` 自检通过”“ADMIN…后才发版”）
- CI 不绿时禁止 merge；未获 ADMIN 指定批准时禁止发布。原文未规定这些门槛失败后须停止所有修复工作，也未给出额外升级流程。（引文：“CI 不绿不 merge”“后才发版”）
- 收尾四项仍是任务义务，不能因验收或发布已完成而遗漏。（来源：A 的“完成后”四项）

## B · 独立禁止、限制与局部未明

- fresh init 不得创建 `tasks/`、`log/`；LETTER 不得回滚 v3 承诺；现有项目不应因此次 fresh init 改动受到影响。本仓迁移是另列的明确动作。（引文：“不再创建”“LETTER 不回滚 v3 承诺”“已存在项目不受影响”）
- **audit 局部未说明**：原文明确缺 `_lifecycle/` 须报 P0，但未明确父目录存在、仅缺部分子桶时的 audit 分级；初始化必须创建全部五桶的要求仍然明确。（位置：§4.3 与验收第 3 项）
- **回滚措辞局部不一致**：风险段称“删除目录改动不可逆”，代码段实际要求删除两个 `mkdir`、不再创建目录，未要求删除现存目录。不能将该风险表述扩展为清理既有项目目录的授权。（位置：§4.1 与“风险（Rule 7）”）
- 测试、CI、audit 是否通过，以及 ADMIN 将来是否批准，属于待发生结果，不是边界歧义；原文也未指定发布渠道或更细的发布操作。