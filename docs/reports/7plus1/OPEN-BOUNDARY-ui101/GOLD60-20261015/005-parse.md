**I｜输入与作用域**

- 来源为 ADMIN 发给 ME 的 `TASK-20260427-005`，协议 `fcop v1`、优先级 P2；关联 `ISSUE-20260427-006`、`TASK-20260427-004`。关联任务不因此整体纳入执行范围。（引文：`sender: ADMIN`、`recipient: ME`、`related: [...]`）
- 本次是 0.7.1 收尾：保留 PyPI 上的 **`fcop-mcp 0.7.0`，不 yank**，校准下列四处文档。正文“0.7.1 不 yank”结合标题和要求，指此次收尾不 yank 0.7.0。（引文：“决定不 yank `fcop-mcp 0.7.0`”“校准 4 处文档”）

**O｜产物与交付**

| 对象 | 必须达到的结果及来源 |
|---|---|
| `docs/releases/0.7.1.md` | 顶部 metadata 的 `"Yanked: ..."` 改为 `"kept on PyPI, not yanked"`；在 post-mortem 后新增 `"Why we did not yank `fcop-mcp 0.7.0`"` 一节，包含决策理由、PEP 592 行为表和重新考虑 yank 的条件。（引文：“在 post-mortem 后新增一节”“含 PEP 592 行为表 + 何时会反悔”） |
| `CHANGELOG.md` | 仅明确要求修改 `[0.7.1]` 对应内容：删除 `"is being yanked from PyPI"`，改为 `"kept on PyPI, not yanked"`，并指向 release notes。（引文：要求 2） |
| `docs/agents/issues/ISSUE-20260427-006-ME.md` | resolution 中的“待 ADMIN 走 twine yank 流程下架”改为“决定不 yank，理由记入 release notes”。（引文：要求 3） |
| `docs/releases/RELEASE-CHECKLIST.md` | Phase 6 的 yank 项从“必须”改成“按需，可选；可逆；记录决策”，列出何时 yank、何时跳过。（引文：要求 4） |
| 任务与报告记录 | TASK-005、REPORT-006 **各自都要入账并 archive**；不能以四处文档改完代替记录义务。（引文：“TASK-005 + REPORT-006 入账并 archive”） |
| 提交 | 本次 followup 独立形成一条 commit。（引文：“followup commit 单独一条”） |

**A｜动作**

- 执行上述指定文本替换、新增说明、增加引用、修订 checklist、记录入账及归档，并形成独立提交。（来源：O 各项）
- 对四处文档检查禁留文本；新节须按命令逐行说明 PEP 592 行为，只有笼统结论不满足要求。（引文：“grep 全空”“按命令逐行讲清”）
- 当前动作不包含实际 yank；未来重新考虑的条件不等于现在执行 yank 的授权。（引文：“决定不 yank”“再 yank 也来得及”）

**P｜参与关系**

- ADMIN 作出不 yank 的决策，ME 是本任务接收及执行主体。（引文：“ADMIN 复盘后判断”；`recipient: ME`）
- 原有“待 ADMIN”执行 yank 的依赖必须从指定内容中撤销；没有新增必须等待 ADMIN 启动的步骤。（引文：“待 ADMIN 走 twine yank 流程下架”改为“决定不 yank”）
- 原文未指定独立复核人、验收接收人或额外审批流程。

**R｜资源、数量与时间**

- 文档校准及残留检查覆盖指定的 **4 处文档**；另有 **2 项记录**须入账并归档，以及 **1 条独立 followup commit**。四处文档不是全部交付物的数量上限。（引文：“校准 4 处文档”“TASK-005 + REPORT-006”“单独一条”）
- 未给出截止时间、工时、费用额度或操作次数限制；P2 只明确优先级，不产生数值期限。

**V｜版本与依据**

- 被保留的包版本是 `fcop-mcp 0.7.0`；发布说明及 changelog 的修订版本是 `0.7.1`；通用流程修订位置是 checklist 的 **Phase 6**。背景的 **Phase 23** 是既有待办来源，不能与 Phase 6 混同。（引文：“Phase 23 yank”“`[0.7.1]`”“Phase 6 yank 项”）
- 决策理由须保留原文的区分：不钉版本的新装已落到 0.7.1；已装 0.7.0 的用户需要升级；ADMIN 判断未来主动钉 `==0.7.0` 的用户目前几乎不存在；yank 可逆。（引文：“新装路径自愈”“必须 `pip install -U`”“目前几乎不存在”“yank 可逆”）
- PEP 592 是新增行为表的指定依据。上述背景是 ADMIN 的判断，不能直接替代逐命令的规范说明。（引文：“含 PEP 592 行为表”“按命令逐行讲清”）

**C｜完成、停止与重新考虑条件**

- 完成条件是组合要求：O 中全部交付完成；四处文档中 `"being yanked"` 与 `"待 ADMIN.*yank"` 均无残留；新节逐命令讲清 PEP 592；两项记录入账并归档；issue 保持 closed；followup 提交独立。（引文：全部“验收”条款）
- 未来重新考虑 yank 的信号是“下载量回升”**或**“第二个用户报修”；原文表达届时仍可 yank，没有规定触发即必须 yank，也未授权自动执行。（引文：“下载量回升或第二个用户报修再 yank 也来得及”）
- 局部未明确：下载量回升的基准、幅度和观察窗口；PEP 592 表的完整命令清单；REPORT-006 的具体路径及入账、归档位置。不能自行补成既定边界。原文未另设停止条件。

**B｜独立禁止与限制**

- 本次不 yank `fcop-mcp 0.7.0`。（引文：“决定不 yank”）
- ISSUE-006 保持已关闭状态，仅修订 resolution 文本，不得借本任务重开或改动其状态。（引文：“不动 closed 状态（已闭），仅修订 resolution 文本”）
- followup commit 不得与 0.7.1 主提交混合。（引文：“不和 0.7.1 主提交混”）
- 四处文档不得保留验收列明的两类旧表述；这是四处共同适用的约束。（引文：“四处文档无……残留”）