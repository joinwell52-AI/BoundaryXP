**I｜输入与作用域**

- 修改对象为 `README.md` 与 `README.zh.md` 第 13–20 行的 `<p align="center">` 顶部 banner。（原文：“在……line 13-20 的……banner 内”）
- 背景要求两份 agent prompt 可从顶部直接访问；关联任务为 `TASK-20260522-007-ADMIN-to-ME`。（原文：“应该在这里就能点到”；“related: TASK-20260522-007-ADMIN-to-ME”）

**O｜产物与交付**

两份 README 各新增 2 条链接，共 **4 个链接入口**，目标对应如下。（原文：“双语 banner 各加 2 条链接”）

| 文件 | 新增标签 | 链接目标 |
|---|---|---|
| `README.md` | `Install prompt` | `src/fcop/rules/_data/agent-install-prompt.en.md` |
| `README.md` | `Bringup prompt` | `src/fcop/rules/_data/agent-bringup-prompt.en.md` |
| `README.zh.md` | 待定中文标签：安装 prompt | `src/fcop/rules/_data/agent-install-prompt.zh.md` |
| `README.zh.md` | 待定中文标签：启动项目 prompt | `src/fcop/rules/_data/agent-bringup-prompt.zh.md` |

来源：“`Install prompt` → …”；“`Bringup prompt` → …”；“README.zh.md 用 `.zh.md`”；“中文标签待定”。表内中文用途说明不是已确定标签。

- 另须交付 `REPORT-008`。（原文：“写 REPORT-008”）

**A｜动作**

- 在英文 `Getting started`、中文 `上手 FCoP` 之后插入上述两条链接；原文列示次序为 Install、Bringup，未另行明确两条新增链接之间的强制次序。（原文：“Getting started / 上手 FCoP 之后插入两条新链接”）
- 写报告并归档 `TASK-008`，均为独立要求。（原文：“写 REPORT-008，archive TASK-008”）

**P｜参与关系**

- ADMIN 发出任务，ME 接收；未另指执行者、复核者或验收接收人。（原文：“sender: ADMIN”；“recipient: ME”）

**R｜数量与时间资源**

- 新增数量按文件分别约束：英文 2 条、中文 2 条，不能只满足总计 4 条。（原文：“双语 banner 各加 2 条链接”）
- 优先级为 P2；未给期限、工时或额度。线程标识中的日期不能据此认定为截止时间。（原文：“priority: P2”；“thread_key: readme-banner-prompt-links-20260522”）

**V｜版本与依据**

- 消息采用 `fcop` 协议，协议版本为 `1`；该字段不是要求发布的项目版本。（原文：“protocol: fcop”；“version: 1”）
- 英文与中文链接目标分别使用 `.en.md`、`.zh.md`，对应关系见 O。（原文：“README.zh.md 用 `.zh.md`”）
- 原文未指定仓库分支、提交或基线版本。

**C｜完成、停止与升级条件**

验收要求须共同满足：

1. 两份 README 的 banner **各新增 2 条链接，且全部链路有效**。（原文：“各加 2 条链接，链路活”）
2. `inventory_drift.py` 的三类警告**分别清零**，不能只消除其中一类。（原文：“三类警告清零”）
3. `REPORT-008` 已写、`TASK-008` 已归档。（原文：“写 REPORT-008，archive TASK-008”）

原文未给停止或升级条件。链接是否有效、警告是否清零属于待验证结果，不是边界歧义。

**B｜独立禁止与限制**

- 不改变 banner 其余已有链接的相对顺序。（原文：“不改 banner 其它链接顺序”）
- 不改第二排 badges。（原文：“不动第二排 badges”）
- 不改中段 `"You want to…"` 表。（原文：“不改中段 ‘You want to…’ 表”）
- 不发布新版本。（原文：“不发新版本”）

**具体未定与缺项**

- 中文标签明确待定，应保留选择，不能擅定译名。（原文：“中文标签待定”）
- “三类警告”未列出类别；原文也未规定为清零可修改哪些额外文件，不能据此推定任意扩大修改范围。
- related 指向 `TASK-…007…`，归档对象明确为 `TASK-008`；两者关系未说明，不应擅自统一编号。
- 报告格式、存放位置、归档方式及“链路活”的检查方式未说明。