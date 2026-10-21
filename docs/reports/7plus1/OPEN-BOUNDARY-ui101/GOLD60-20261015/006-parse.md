### I｜输入与作用域

- 任务为 `TASK-20260427-006`，ADMIN 发给 ME，优先级 P0，关联 `ISSUE-20260427-007`；目标是 0.7.2 元数据一致性 hotfix。来源：“recipient: ME”“priority: P0”“全表面对齐 + 自动化守门”。
- 扫描范围覆盖包源码、两份包配置、规则与协议数据、本地部署副本及相关文档；列举的文档不是封闭清单。来源：A.1–11，“README / mcp/README / docs/releases/ 等任何提到……”。
- 已知核心缺陷：rules frontmatter 为 1.7.0，body/changelog 已为 1.8.0；本次属于 0.7.x 周期第三次同类遗漏。前两次用于根因与复盘依据，不自动扩展为重做历史任务。来源：“frontmatter 没跟着 body 一起 bump”“第三次”。

### O｜产物与交付

| 必须交付的对象 | 目标及约束 | 短引文 |
|---|---|---|
| `src/fcop/_version.py`、`mcp/src/fcop_mcp/_version.py` | 两者均为 0.7.2 | A.1–2：“→ 0.7.2” |
| 根 `pyproject.toml` version | 若为静态字段，须为 0.7.2 | A.3：“如果是静态字段” |
| `mcp/pyproject.toml` | version 为 0.7.2；description 中所提 fcop minor 保持 0.7.x；依赖为 `fcop>=0.7,<0.8` | A.4–6：“0.7.x”“（lockstep）” |
| `fcop-rules.mdc` | frontmatter `fcop_rules_version` 为 1.8.0 | A.7：“1.8.0（核心 bug）” |
| `fcop-protocol.mdc` | frontmatter `fcop_protocol_version` 为 1.6.0 | A.8：“→ 1.6.0” |
| `.cursor/rules/*.mdc`、`AGENTS.md`、`CLAUDE.md` | redeploy 后同步；部署副本的 rules 字段也须为 1.8.0 | A.9–10：“自动同步”；C.17：“也对齐到 1.8.0” |
| README、mcp/README、docs/releases/ 等文档 | 检查所有提到 “latest” 或显式 0.7.0 / 1.7.0 / 1.5.0 的位置，按正确真值更新不一致内容 | A.11：“检查 + 更新”；A 总则：“不是真值以外的旧目标，任何不一致都要修”¹ |
| 两道 consistency 测试 | 新增或补强规则元数据、包版本一致性测试，具体关系见 V | B：“新增/补强测试” |
| `ISSUE-20260427-007` | 记录 frontmatter 未随 body bump；根因是多处编辑漏一处，与 ISSUE-006 同类；最终 closed | C.16：“根因 = 多行编辑只编了 N-1 处”；C.18：“status: closed” |
| `REPORT-20260427-007` 与任务账本 | done report 入档；TASK-006 archived | C.18：“done report，archive task”；验收：“REPORT-007 入档” |
| `CHANGELOG.md` 的 `[0.7.2]` 段 | 同类 bug post-mortem、新增 consistency 测试守门 | D.19：“post-mortem + 新增的 consistency 测试守门” |
| `docs/releases/0.7.2.md` | 简短复盘，涵盖第三次同类 bug，以及测试现已阻挡该类问题 | D.20：“third time same-class bug; consistency tests now block this class” |
| 发版产物 | 两包发布至 PyPI；git tag `v0.7.2`、push、GitHub release | D.21：“upload PyPI”；D.23：“git tag v0.7.2 + push + `gh release create`” |

¹ A 总则的准确原文为：“正确目标（不是 0.7.1，而是真值），任何不一致都要修”。因此历史版本记载需要检查，但不能仅因含旧版本号就认定应改成最新版本。

### A｜必须执行的动作

- 扫描并修复上述全部表面的不一致；通过 `redeploy_rules` 同步本地规则及两份代理说明文件。来源：A：“全表面元数据扫描 + 修复”；C.17：“`redeploy_rules` 同步本地”。
- 新增或补强两道 consistency 测试，并复查已有 `tests/test_fcop/test_pyproject_pins.py` 的覆盖。来源：B.12–14：“新增/补强”“已有，复查覆盖”。
- 运行 `pytest -q` 与 `ruff check src/ mcp/src/ tests/`，均须全绿。来源：B.15：“全绿”。
- 完成 build、twine check、PyPI 上传；上传顺序必须是 **fcop → wait → fcop-mcp**。来源：D.21：“fcop 先、wait、fcop-mcp 后”。
- 使用 `uvx --refresh fcop-mcp@0.7.2` 做干净缓存冒烟，并完成标签、push 与 release 创建。来源：D.22–23。
- 建立、关闭、归档相关账本对象，撰写两处复盘材料。来源：C.16–18、D.19–20；产物身份见 O。

### P｜参与关系

- ADMIN 为指令发出者，ME 为任务接收者；原文没有指定其他执行人、独立复核人或验收签字人。来源：头部“sender: ADMIN”“recipient: ME”。
- PyPI 为两包上传目标，GitHub release 为发布交付对象；“fcop 先、fcop-mcp 后”约束的是包发布次序。来源：D.21、D.23。
- 背景中的“Phase 23 待 ADMIN 启 yank”是已被修正的历史文档内容，不是本次向 ADMIN 新增的执行义务。来源：“已被 REPORT-006 修正”。

### R｜资源、数量与时间范围

- 发版涉及 **2 个包**：fcop、fcop-mcp；要求 **build × 2、twine check × 2**。来源：D.21。
- 指定 **2 道 consistency 测试门禁**，对应两个测试文件；原文没有限定每个文件的测试用例数。来源：B.12–13；验收：“新增的两道 consistency 测试”。
- 依赖允许范围为 **`0.7 ≤ fcop 版本 < 0.8`**，包含下界、不含上界；本次实际发布和验收版本另须为 0.7.2。来源：A.6：“`fcop>=0.7,<0.8`”及验收版本组合。
- 优先级为 P0，但没有具体截止时间、预算或工时额度；上传间须 wait，但未给等待时长或结束判据。来源：“priority: P0”；D.21：“wait”。

### V｜版本与依据关系

- 正确目标是组合 **fcop-mcp 0.7.2 / fcop 0.7.2 / rules 1.8.0 / protocol 1.6.0**，不能将不同对象统一改成同一版本号。来源：验收中完整版本组合；A：“正确目标”。
- `tests/test_fcop/test_rules_metadata_consistency.py` 必须验证：
  - rules frontmatter 版本 **等于** body 中最高的 `## v1.X` / `## 1.X.0 changes` 标题版本；
  - protocol 文件作同类核对；
  - 任一 “X.Y.0 changes” 标题版本 **≤** 对应 frontmatter 版本，并由回归测试自动核验。  
  来源：B.12：“等于……最高的”；验收：“任何……≤ frontmatter 版本号”。
- `tests/test_fcop/test_package_version_consistency.py` 必须逐包验证：
  - `fcop._version.__version__` = 根 `pyproject.toml` 静态 version（若存在）；
  - `fcop_mcp._version.__version__` = `mcp/pyproject.toml` version。  
  来源：B.13：“等于”“如果是静态”。
- `fcop_report()` 的“包内”与“项目本地”两栏，须对上述四项**逐项相等且各自达到目标**；仅两栏彼此一致仍不足以验收。来源：验收：“且包内与‘项目本地’两栏数值一致”。
- 局部名称不一致：A.8 明确字段为 `fcop_protocol_version`，B.12 简写为 `protocol_version`；对应同一 protocol 元数据核验，但是否为字段别名未说明。来源：A.8、B.12。

### C｜完成、停止与升级条件

完成需同时满足全部要求，不能只以修复核心版本号或测试通过代替：

- pytest 全绿，两道新增 consistency 门禁也绿；ruff 全绿。来源：验收首条、B.15。
- `fcop_report()` 达到 V 中四项目标及两栏一致关系。来源：验收第二条。
- 整仓检索旧字段值 `fcop_rules_version: 1.7.0` 或 `fcop_protocol_version: 1.5.0`，**命中数为 0**；包含本机部署与源码数据表面，原文没有给历史记录例外。来源：验收：“整仓零命中（本机部署 + src/_data/ 双保险）”。
- 标题版本关系通过自动回归核验，所有文档、发布、冒烟及同步要求完成。来源：验收第四条及 A–D。
- ISSUE-007 closed、REPORT-007 入档、TASK-006 archived，三者分别满足。来源：验收末条。

原文未另设停止或升级流程；测试、冒烟、发布等未来结果尚未知，不属于边界歧义。

### B｜独立禁止与限制

- **不得 yank 0.7.1**；本次沿用背景所述 0.7.0 决策。来源：D.24：“0.7.1 不 yank（同 0.7.0 决策；版本号自动覆盖）”。
- 不得保留“实质对、元数据错”的状态；正文正确不能豁免 frontmatter、包配置、部署副本或相关文档的一致性要求。来源：红线：“不允许‘实质对、元数据错’二度发生”。
- “真的不要有 BUG 了”表达总体质量要求；具体可核验边界是上述全表面对齐、自动化守门及验收条件，原文未提供对所有潜在 bug 的穷尽判定方法。来源：背景 ADMIN 指令及紧随其后的“全表面对齐 + 自动化守门”。