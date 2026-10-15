以下边界针对 `TASK-20260513-013`；两组“验收标准”累计适用，重复项合并，未见后一组替代前一组的说明。

### I｜输入与作用域

| 边界 | 原文依据 |
|---|---|
| ADMIN 向 ME 下达本任务，优先级 P0、风险 medium；父任务为 TASK-20260513-012，关联该任务及 REPORT-20260513-012。 | `sender: ADMIN`、`recipient: ME`、`priority: P0`、`risk_level: medium`、`parent`、`related` |
| 工作范围覆盖发版前检查、准备、备份，以及此前统计的全部发版文件分类；需将散落在 SOP 中的枚举沉淀为独立、长期维护的清单。 | “都要详细”“那些文件，都要分类记录”“散落在 SOP §C/§G/§阶段 4.5” |
| 三条 ADMIN 原话共同构成依据：“一条龙发版+备份”、详细检查准备备份及分类、“未来标准”级认真态度。第三条是统领具体产出的态度坐标系，不独立扩展成未写明的新业务规则。 | “第 3 条不是新规则，是**态度坐标系**”“凌驾本 TASK 的所有具体产出之上” |
| 首次 mirror 已完成是既有前提；本任务规定之后的备份纪律，并要求本次提交、归档实际遵守。 | “首次 mirror 已经完成，之后只 append-only 推”“本次自身就是‘一条龙’实证” |

### O｜产物与交付

**1. 新建 `fcop/shared/RULES-release-file-inventory.md`。**

须覆盖发版涉及的全部文件，按 A–L 共 12 类组织，类别代号长期稳定。各类均需填写字段；原文实际列出七项：类别代号、类别名（zh / en）、描述、文件枚举、改动义务、锁版风险、SOP 对应行。文件须带 FCoP frontmatter。（引：“12 类别(A–L)”“全部填实”“文件本身带 FCoP frontmatter”；字段数量矛盾见 V。）

| 类别 | 必须保留的分类对象及范围——原文短引 |
|---|---|
| A 包源版本号 | “`_version.py` × 2” |
| B 协议规则文件 | “包内 `src/fcop/rules/_data/*.mdc` + `letter-to-admin.*.md`” |
| C 协议规则镜像 | “项目根 `.cursor/rules/*.mdc` + `AGENTS.md` + `CLAUDE.md`” |
| D 公网可见文档 | “`README*.md` × 3 + `docs/index.html` + `essays/README.md` + `CITATION.cff`” |
| E CHANGELOG | “`CHANGELOG.md`” |
| F Hardcoded 断言／测试 | “精确到行号：`server.py:779`、`test_rules.py:104`、`test_server.py:163/182/196`” |
| G ADR | “`adr/ADR-*.md` + `adr/README.md` 索引” |
| H 迁移指南 | “`docs/MIGRATION-*.md`” |
| I 包内样板与团队模板 | “`src/fcop/rules/_data/teams/` + `fcop/shared/TEAM-*.md`” |
| J CI／Workflow | “`.github/workflows/release.yml`” |
| K 备份链路 | “Git remote `backup` → `joinwell52-AI/FCoP-backup`” |
| L ADMIN 仪式 | “`.scratch/_*_msg.txt` + `fcop/tasks/` + `fcop/log/`” |

类别初稿中的通配符、目录是范围描述，最终“文件枚举”必须展开为精确路径，不能直接照抄通配符。（引：“12 类别(初稿)”“精确路径，不写通配符”）

字段填写还须保留：

- **改动义务条件**：`every release / on protocol change / on essay add / on team template change`；原文未分配各类别的具体取值。（引：字段“改动义务”）
- **锁版风险区分**：`none / CDN-cacheable / PyPI long_description ⚠ / Git tag ⚠ / Zenodo DOI ⚠`。（引：字段“锁版风险”）
- **SOP 对应位置**：精确关联 `§C.1 第 N 项 / §G 第 M 条 / §阶段 4.5`。（引：字段“SOP 对应行”）

**2. 升级 `fcop/shared/RULES-release-sync-checklist.md`。**

顶部加入三条带时间对应关系的 ADMIN 红线引用块、完整 inventory 指针；三条永久硬约束升级为四条，新增“一条龙发版+备份／发版即备份”。历史教训表补充 v2.0.0 后建立 FCoP-backup、TASK-013 来龙去脉、二级镜像原因及 ADMIN 红线来源。（引：“顶部：三条 ADMIN 红线引用块”“三硬约束 → 四硬约束”“历史教训表加一行”）

**3. 校正并扩展 `docs/release-process.md`。**

- §C 顶部增加 inventory 指针。（引：“§C 顶部加 inventory 指针”）
- §C.3 将 `test_server.py` 的相关断言由“若有”改为明确 **3 处**，位置为 163／182／196；将 `server.py` 唯一硬编码版本号位置明确为第 779 行。（引：“精确改为‘3 处’”“是唯一硬编码版本号位置”）
- §Release Steps 阶段 4 增加“§阶段 4.5 · 备份镜像同步”，包含两行推送命令及验证。（引：“§阶段 4.5 就位(2 行命令 + 验证)”）
- §G 增加第 6 条 backup remote 扫描，规定命令为 `git remote -v | Select-String '^backup'`。（引：“扫描 backup remote 仍配置”）

**4. TASK、REPORT 与归档证据。**

TASK 须完成升格，设计基调明确写出“未来标准”级严谨；REPORT 须包含双发输出及三方 SHA 字节级一致输出；TASK 与 REPORT 均须归档，归档也须双发。（引：“TASK 升格完成”“在 REPORT 里贴出三方 SHA 字节级一致的输出”“archive TASK + REPORT，同样走双发”）

### A｜动作及顺序

| 边界 | 原文依据 |
|---|---|
| 完成清单新建、两份既有文档升级，以及检查、扫描、自检、提交、推送、验证、归档。具体产物要求见 O，验收见 C。 | “三个具体产出”“验收标准” |
| 本次 TASK＋REPORT 的 closure commit 必须按顺序推送：origin（验收明确为 origin/main）→ backup main → backup `--tags`；origin 推送后须立即推 backup。“立即”无数值时限。 | “push origin → push backup main → push backup --tags”“push origin 之后立即 push backup” |
| 后续每次发版同步 backup 均采用非 force 的 `git push backup main` 加 `git push backup --tags`。备份同步必须作为发版最后一步。 | “SOP 钦定后者”“发版动作的最后一步必须是同步 backup remote” |
| TASK、REPORT 归档产生的同步义务独立保留，不能以 closure commit 已双发代替。 | “archive TASK + REPORT，同样走双发” |

### P｜参与关系

| 边界 | 原文依据 |
|---|---|
| ADMIN 是任务发出方与三条要求的来源；ME 是任务接收方。原文未另行指定执行分工、独立复核人或最终验收接收人。 | `sender: ADMIN`、`recipient: ME`；“通过自检” |
| 外部团队、IDE 厂商、学术论文是未来可引用性的质量参照，不是本次必须参与的评审或接收主体。 | “未来某天被一个外部团队、某个 IDE 厂商、某份学术论文引用” |
| 英文副版可由后续 TASK 跟进；本次中文主版优先，但清单类别名仍须双语。 | “中文主版优先”“en 副版可由后续 TASK 跟进”；“类别名(zh / en)” |

### R｜资源、数量及时间

- **结构数量**：12 类 A–L；硬约束由 3 条增至 4 条；§G 自检共 6 条；阶段 4.5 含 2 行命令及验证。（引：对应 O、C 来源）
- **明确对象数量**：A 类版本文件 2 个、D 类 README 文件 3 个；F 类给出 5 个行号定位，其中 `test_server.py` 占 3 处。不同类别的关系及完整文件总数无法仅凭原文确定，不据此推算总文件量。（引：A、D、F 类枚举）
- **备份资源**：remote 名为 `backup`，目标为 `joinwell52-AI/FCoP-backup`；main 与 tags 均在推送要求内。（引：K 类；“push backup main + push backup --tags”）
- **时间约束**：22:28／22:31／22:32 是原话时序；任务未给截止日期、工时或额度。执行相对顺序及“立即”要求见 A。（引：“ADMIN 三条原话(按时间顺序)”）

### V｜版本、依据与局部不确定性

| 边界或问题 | 原文依据 |
|---|---|
| 任务协议为 FCoP、协议版本 1；v2.0.0 用于历史教训和断言定位，原文未指定新发版目标版本号。 | `protocol: fcop`、`version: 1`；“v2.0.0 后建 FCoP-backup” |
| 命名须可稳定外部引用；表格结构稳定、字段定义一致、可自动校验；每个引用均须精确出处：文件路径＋行号，或 SOP 节＋子段。 | “`Inventory §C`”“每个引用必带精确出处”“Rule 0.c” |
| **字段数直接矛盾**：正文和验收均说“6 字段”，但表格实际列出 **7 项**。不能自行删除某项或默认为六项；七项内容要求全部保留，数量口径待裁定。 | “每类 6 字段固定”“12 类 6 字段”；实际字段表 |
| **文件枚举信息不足**：通配符、目录、部分裸文件名尚未给出完整路径；K 类是 remote 链路而非明确文件。需补充实际路径依据，并澄清 K 类如何填“文件枚举”，不能虚构文件。 | A–L 初稿；“文件枚举：精确路径” |
| **依赖正文未提供**：既有三条硬约束、§G 前五条扫描及实际文件内容不在本数据中；只能保留其引用义务，不能补造内容或宣称已通过。 | “三条永久硬约束”“§G 6 条扫描全部通过” |
| **证据口径局部未明**：“三方 SHA”未明确三个比较对象及 refs 范围；“closure commit 的输出写入 REPORT”与该提交包含 REPORT 的确切证据落点未交代。保留全部义务，不自行设计闭环流程。 | “本 TASK + REPORT 的 closure commit”“三方 SHA 字节级一致的输出” |

### C｜完成、停止及升级条件

- **完成须同时满足**：O 中全部产物要求、TASK 升格、ReadLints 干净、§G 六条自检通过、closure commit 按 A 双发并记录证据、TASK＋REPORT 归档并双发。（引：两组“验收标准”）
- **lint 条件**：本 TASK 不引入 lint 问题。（引：“ReadLints 干净(本 TASK 不引入 lint 问题)”）
- **扫描条件**：原文给出“0 hit + #4 1hit + #6 2hit”，按例外关系理解为其余四条各 0 hit、第 4 条 1 hit、第 6 条 2 hit；要求逐条成立，不能仅以合计 3 hit 替代。（引：“§G 6 条扫描全部通过自检”）
- **发版完成门槛**：任何遗漏 backup 同步的发版均未完成；单独 push origin 不足以完成。（引：“任何漏了 backup 同步的发版都算未完成”）
- **失败触发**：原文设定 origin 被 force push 导致 backup push 失败时触发警报、保住备份；未给警报渠道、接收人或后续处置规则。（引：“backup push 失败 → 触发警报，备份保住”）

扫描、lint、推送和 SHA 验证的实际结果是未来执行结果，并非原文边界不明。

### B｜独立禁止与限制

- 禁止以近似位置代替精确引用，禁止最终清单使用通配符枚举文件。（引：“禁止‘差不多在那一段’”“不写通配符”）
- 首次 mirror 完成后，后续备份只允许 append-only、非 force 推送；不得使用 `git push backup --mirror` 的强制覆盖路径。（引：“之后只 append-only 推”“SOP 钦定后者”）
- SHA 一致性验收不授权破坏备份来强行取得一致；抗 force push、防灾难是独立保留的限制。（引：“备份的哲学不是‘字节一致’，是‘防灾难’”“抗 force push 是备份层的核心价值”）
- 不得遗漏备份后仍认定发版完成；不得把本次归档排除在双发纪律之外。（引：C 的完成门槛；“archive TASK + REPORT 同样双发”）