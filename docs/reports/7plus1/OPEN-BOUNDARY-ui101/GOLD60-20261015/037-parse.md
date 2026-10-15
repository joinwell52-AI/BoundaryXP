## I｜输入与作用域

- 任务为 `TASK-20260513-007`，由 ADMIN 发给 ME，优先级 P1；父任务为 `TASK-20260513-006`，关联任务为 `005`、`006`。协议标识为 `fcop` v1，归属线程 `essay-13-evolution-reverse-absorption-publication`、会话 `sess-20260513-me-01`。（来源：任务头）
- 翻译对象为 essay #13《Evolution, Reverse Absorption / 演化，反向吸收》，中文源文件为 `essays/evolution-reverse-absorption.md`，401 行，已发表于 commit `523d81e`。任务同时覆盖三处索引的 row #13。（引文：“本任务交付英文版 + 移除‘pending’标注”）

## O｜产物与交付

| 产物 | 必须满足的边界 | 原文依据 |
|---|---|---|
| `essays/evolution-reverse-absorption.en.md` | 文件存在；完整英文翻译，体量接近中文版；frontmatter 合法，字段内容完整翻译，包括 `audience`、`length` 等 | “完整英文翻译…(~400 行)”；“frontmatter 字段完整翻译”；“frontmatter 合法” |
| 英文版全部章节标题 | 保留中英双语对照 | “所有章节标题保留双语对照” |
| 英文版两张 ASCII 图 | 原样保留，不翻译图中文字 | “两张 ASCII 图本身保留原样不翻译” |
| 英文版 ADMIN 引语段落 | 保留原中文，并加英文译注 | “保留原中文 + 加英文译注” |
| `README.md` row 13 | 删除 pending 注释，加入英文链接 | “把…注释删除并加链接” |
| `README.zh.md` row 13 | 删除 pending 注释，添加 `[GitHub English]` 链接 | “添加 `[GitHub English]` 链接” |
| `essays/README.md` row 13 | 删除 pending 注释，添加 `[English]` 链接 | “添加 `[English]` 链接” |
| `REPORT-20260513-007-ME-to-ADMIN.md` | 完成后写入账本 | “并写…落账本” |

三处索引须**分别**与 essay 11 在对应索引中的呈现方式一致；不是只更新其中一处，也不是仅删除 pending。（引文：“三处索引已更新到带英文链接的形式，与 essay 11 row 在各索引的呈现方式一致”）

## A｜动作

- 完成翻译、索引修订和术语核对；术语核对须查 essay 11 英文版及 `fcop-rules.mdc` 词汇表。（引文：“查 essay 11 英文版 + fcop-rules.mdc 词汇表”）
- 提交 commit，提交信息清楚描述交付物，并 push 到 `origin/main`。（引文：“commit 信息描述清楚交付物 + push 到 origin/main”）
- 完成后执行 `archive_task(TASK-20260513-007)`；对 `TASK-20260513-006` 的归档附有 ADMIN 同意条件，条件作用域见 C。（引文：“完成后… + …(如 ADMIN 同意)”）

## P｜参与关系

- ADMIN 为发令方，ME 为任务接收及执行主体；闭环报告方向为 ME → ADMIN。（来源：`sender: ADMIN`、`recipient: ME` 及报告文件名）
- ADMIN 的同意与闭环归档有关；原文没有另行指定翻译复核人、独立验收人，也没有要求交付前必须取得 ADMIN 审批。（引文：“如 ADMIN 同意”；其余参与角色未说明）

## R｜资源、数量与时间

- 核心变更对象为 **1 个新增英文文件 + 3 处指定索引行**；另有闭环报告及任务归档要求。两张 ASCII 图均须保留。（引文：“只新增 .en.md 文件 + 索引行修订”；“两张 ASCII 图”；“闭环”）
- 中文源文为 401 行，英文目标为约 400 行、体量接近；这是近似规模要求，未规定精确行数或容差，不能把行数接近当作完整翻译的替代条件。（引文：“完整英文翻译,体量与中文版接近(~400 行)”）
- 无硬性截止时间；按“快速但不牺牲质量”执行。“单一 session 内完成”为预估，不是明确的强制期限。（引文：“ADMIN 没给死期”；“预估单一 session 内完成”）

## V｜版本与依据

- 源文版本依据为已发表的 commit `523d81e`；原文未要求追随之后的源文变更。（引文：“已在 commit `523d81e` 发表”）
- 完整翻译标准沿用 essay 11：`looking-without-touching.md`（231 行）及 `looking-without-touching.en.md`（238 行）是先例，不是本任务的行数目标。（引文：“是完整翻译,而非摘要——本任务沿用同样标准”）
- 所有协议术语须与 `looking-without-touching.en.md`、`fcop-rules.mdc` 中的既有英文一致，包括 Reverse Absorption、Evolution、Emergence、Boundary 等。（引文：“所有协议术语…保持一致”）
- “反向吸收”首次出现须锚定为 `Reverse Absorption (反向吸收)`；后续允许单用英文，并非要求后续只能使用英文。（引文：“首次出现时给出英文锚定…后续可单用英文”）

## C｜完成、停止及升级条件

- 验收要求共同成立：英文文件存在且完整、frontmatter 合法；三处索引均符合要求；协议术语一致；所有内容准确传达原意并满足首次术语锚定；commit 信息清楚且已 push 到 `origin/main`。（来源：“验收标准”第 1—5 条）
- 完成后还须履行归档和报告闭环，不能以翻译文件完成替代整个任务闭环。（引文：“完成后…并写…落账本”）
- **局部歧义：**“`archive_task(007)` + `archive_task(006)`（如 ADMIN 同意）”中的同意条件，按紧邻位置可理解为只约束 `006`，也可能约束两项归档组合。原文明示存在同意条件，但其作用域未完全确定；写报告的要求明确。ADMIN 是否已经同意未给出，属于待知状态。
- 原文未规定额外停止条件或升级流程。

## B｜独立禁止与限制

- 不得以摘要代替完整翻译。（引文：“完整翻译,而非摘要”）
- 不翻译 ADR-0034；沿用 ADR 默认中文为主、英文为辅的风格。（引文：“ADR-0034 不翻译”）
- 不翻译或改写两张 ASCII 图，须原样保留。（同 O 的图形保留依据）
- 题图 `evolution-reverse-absorption-cover.png` 不需重做，且被列入“不动 / Out of scope”；不属于本次改动范围。（引文：“文字已经是英文,不需要重做”）
- 不创造新的协议术语，不改动既有产物语义。（引文：“不创造新术语”；“不改动既有产物的语义”）
- 原文将风险标为 `low`，并称工作为“append-only”，但明确允许三处索引行修订，因此不能将其解释为禁止这些修订。“只新增 .en.md 文件 + 索引行修订”若被理解为全任务文件变更的穷尽限制，会与闭环报告要求产生冲突；明确的报告义务仍须保留。