### I｜输入与作用域

- 针对 `ISSUE-20260427-003-ME.md`，修复 `src/fcop/project.py` 中 `write_task`、`write_report`、`write_issue` 三个方法的序号生成：同一类型的 active 与 archived 文件共同参与计算，防止归档后复用已有文件名。来源：“三个方法，使 next_seq 计算同时看 active 与 archived 两路径”。
- 三处问题均位于 retry 循环内，原文定位分别为 `1024–1026`、`1468–1473`、`1710–1715`。task 归档会连带 report；issue 即使目前没有归档函数，也必须同步修复。来源：“三处 bug 同型，都在 retry 循环内”“为对称与将来……同步修”。

### O｜产物与交付

- 在 `src/fcop/project.py` 增加私有辅助函数 `_existing_filenames_for_seq(*dirs: pathlib.Path) -> Iterator[str]`，并完成三个方法的调用替换。来源：“加一个私有辅助函数”及“修法”第 2–4 项。
- 在以下三个测试文件中**各新增一个测试点**，分别验证对应写入方法跳过已归档序号；测试名必须明确包含 `seq_skips_archived` 语义。来源：“各加一个测试点”“测试名字要明确包含……这样语义”。

| 测试文件 | 对应对象 |
|---|---|
| `tests/test_fcop/test_project_tasks.py` | task |
| `tests/test_fcop/test_project_reports.py` | report |
| `tests/test_fcop/test_project_issues.py` | issue |

- 原文未规定提交、PR、报告或其他交付形式。

### A｜动作

- 辅助函数必须遍历全部传入目录：非目录则跳过；对目录直接子项，只收集 `is_file()` 为真的文件，并产出 `entry.name`，即文件基本名；给定实现不递归扫描。来源：所给代码中的 `if not d.is_dir(): continue`、`d.iterdir()`、`if entry.is_file(): yield entry.name`。
- 三个方法分别使用以下输入，保持类型对应，不混用其他类型目录。来源：“修法”第 2–4 项。

| 方法 | active 输入 | archived 输入 |
|---|---|---|
| `write_task` | `tasks_dir` | `self.log_dir / "tasks"` |
| `write_report` | `reports_dir` | `self.log_dir / "reports"` |
| `write_issue` | `issues_dir` | `self.log_dir / "issues"` |

- 新测试需手工预存对应类型的归档 `001` 文件，再调用对应写入方法，验证得到 `002` 而非 `001`。来源：测试示例“预存入 log/tasks/TASK-{date}-001-...”“应该拿到 002 而不是 001”，结合三个测试文件“各加一个”的要求。

### P｜参与关系

- 指令发送者为 ADMIN，接收与执行主体为 ME，优先级为 P1。来源：`sender: ADMIN`、`recipient: ME`、`priority: P1`。
- 目录扫描范围由调用者负责，`next_sequence()` 保持纯函数职责。来源：“它是纯函数，决定扫哪是调用者职责”。
- 未指定独立复核人、验收接收人或其他参与者；不能从 ADMIN 身份额外推定审批流程。

### R｜资源、数量与时间范围

- 修改覆盖 **3 个写入方法、1 个新增辅助函数、3 个新增测试点**；每个方法扫描本类型的 **2 个路径**。来源：“三个方法”“一个私有辅助函数”“各加一个测试点”及三项调用要求。
- retry 次数限制沿用现值，原文未给出具体数值。来源：“retry 限不变”。
- 验收环境涉及 `D:\FCoP` 本仓及其中两件受保护文件；未给出工时、截止时间或其他资源额度。来源：“D:\FCoP 本仓……两件手工 rename 文件”。

### V｜版本与依据

- 消息协议为 `fcop`、协议版本为 `1`；该版本字段不能直接视为软件版本。来源：`protocol: fcop`、`version: 1`。
- 关联依据为：
  - ISSUE：`docs/agents/issues/ISSUE-20260427-003-ME.md`。
  - 上游任务：`docs/agents/tasks/TASK-20260427-002-ADMIN-to-ME.md`。
  - 三处源码定位及原文给出的修法、测试与验收标准。  
  来源：“关联”、头部 `references` 及对应正文。
- 上游任务括注“Rule 1 硬化 — 同仅进在 0.7.0”存在措辞不清，无法据此确定本次修复的版本准入或发布时间要求；明确关联的 `0.7.0` 信息保留，不补造含义。

### C｜完成、停止及升级条件

以下条件须**同时满足**，不能相互替代。来源：“验收标准”。

| 完成条件 | 短引文 |
|---|---|
| 三个新增测试全部通过 | “三份新测试绿” |
| 现有 587 个通过测试不发生回退 | “现有 587 passed 不退” |
| Ruff 检查干净 | “ruff clean” |
| 两件手工改名文件在运行中不被误伤 | “两件手工 rename 文件在运行中不被误伤” |

- 受保护对象分别位于 `tasks/` 与 `reports/`，标识为 `TASK-20260427-002`、`REPORT-20260427-002`，自身序号均为 `002`，与 `log/` 中 `001` 不冲突。来源：“他们在 tasks/ 与 reports/、本身序号 002”及“被抢救的他现场”。
- 原文未提供这两件文件的完整文件名，也未细化“误伤”的判定项；保护义务明确，具体核验对象需依据上述标识定位。
- 未规定专门的停止或升级流程。测试与运行结果尚未知属于待验收状态，不是边界歧义。

### B｜独立禁止与限制

- 不引入 `.archived/<id>.tombstone` 隐藏占位文件；候选 B 已被否决。来源：“不引入……隐藏占位文件”“被明确否决”。
- 保持 `O_EXCL` 原子预占逻辑不变。来源：“O_EXCL 原子预占逻辑不变”。
- 保持 retry 限制不变，见 R；保持 `next_sequence()` 本身及其语义不变。来源：“retry 限不变”“next_sequence() 本身不变”“不改……本身的语义”。
- 两件手工改名文件的保护要求独立成立，不能因测试通过而取消，见 C。