# BXP-IR-KERNEL-CLOSURE-001 隔离候选报告

日期：2026-10-13。状态：**WAITING_ADMIN_REVIEW**。

WP0—WP5已实施并完成声明范围内的无模型检查，交付 `kernel/1.0-candidate.1` / `candidate-ir/2.0` 的隔离候选。有限事件快照、布尔、整数、精确有理数时间及有限身份选择可以联合计算；旧IR的开放域、动态域和隐式模式仍有明确迁移限制。此次不是完整产品语义验收，也没有升级58618。

## 实际运行包与使用

运行包目录：`D:\boundx\.boundx\ir-kernel-implementation-v1\packages\kernel-candidate-r03`。该目录在干净状态执行 `npm ci --offline --ignore-scripts --no-audit --no-fund` 成功，包含固定依赖、核心、合同、原Skill资源及内核检查。manifest摘要：`45cd0021f8270d9382e122196274ff722eb89e9787b1b8da677599cdac482c89`。

离线完整运行包ZIP：`D:\boundx\.boundx\ir-kernel-implementation-v1\packages\BoundaryXP-IR-Kernel-1.0-candidate.1-win32.zip`，20,789,632字节，SHA-256 `2c9bc0ea9690c4d1b8b794f288312c6e6a9f71ece340ecb465aa95e05a16ffa7`，归档CRC检查通过。它包含已安装依赖；解压后可直接执行上述CLI，无需模型或监听服务。运行包中的说明、接口及程序检查已冻结；完整验收报告与历史证据由本源码目录单独交付。

源码候选：`D:\boundx\.boundx\ir-kernel-implementation-v1\candidate`，本地分支 `work/ir-kernel-closure-001`。本任务不合并或发布，提交号以Git提交回执为准。

在运行包目录执行以下命令，可重现三次调用满足共同上限的示例：

```text
node scripts/ir-kernel.mjs --ir D:/boundx/.boundx/ir-kernel-implementation-v1/evidence/solver-r02/REFERENCE-IR.json --query D:/boundx/.boundx/ir-kernel-implementation-v1/evidence/solver-r02/QUERY-3.json --out D:/boundx/.boundx/ir-kernel-implementation-v1/evidence/my-first-kernel-run
```

输出目录须为新的目录。替换为QUERY-4.json可检查第四次调用。此接口接收结构化IR；原文生成仍属于LLM路径。安装与退出候选的方法见 [INSTALL-AND-ROLLBACK.md](INSTALL-AND-ROLLBACK.md)。当前生产58618保留ui82，无需执行线上回滚。

## 工作包结果

| WP | 已实现与检查 | 证据范围 |
|---|---|---|
| WP0 | 主仓库／安装基线、五份001/002/004原Trace冻结及旧消费者回放 | 原始失败保留；不把ui82已有修复计成本轮增量 |
| WP1 | 加载、唯一根、owner、类型、引用、binder、角色、精确值、Core及source-map | 原始有类型IR独立参考覆盖有限布尔及基础有限数值／量词；不宣称所有组合的形式化等价证明 |
| WP2 | 2.0注册表、选择器、发生计数、完整收件、窄例外、序列与停止活动 | 53个算子接口逐项样本和类型门；支持性按整棵查询推导，定性立即等限制明确保留 |
| WP3 | 独立本地Z3进程、精确联合编译、Core模型复核、SMT-LIB与冲突核 | SAT为MODEL_CHECKED；一般UNSAT为BACKEND_RESULT；取消／超时／内存限制不报无解 |
| WP4 | 2.0旧入口委托同Core；精确issue/coverage权限；失败回滚；审阅摘要绑定 | 1.4显式兼容路径仍保留，不声称旧模式已全部迁移；相同补丁不重审 |
| WP5 | 生成／变形／差分、冻结回放、Windows干净包、离线进程检查、容量与取消 | 最终内核38/38、原接口115/115；干净包内核38/38。新增真实语言验收未运行 |

完整K01—K26逐项范围和证据见 [PROGRAM-ACCEPTANCE.json](PROGRAM-ACCEPTANCE.json)。CHECKED_IN_DECLARED_SCOPE表示这些验收性质实际运行，不表示所有任意合法IR在有限预算内均可求解。

## 计算证据

| 输入／查询 | 实际结果 | 复核等级 |
|---|---|---|
| 三次调用，包括失败调用，所有调用者合法，共同上限3 | SAT | MODEL_CHECKED |
| 相同快照加入第四次调用 | UNSAT | BACKEND_RESULT，保存冲突核和断言来源 |
| 先检查P可行，再求P∧¬A，P允许四次而A至多三次 | SAT，给出越界反例 | MODEL_CHECKED |
| 后端约束被故意删除，导致模型违反Core | 验证失败 | 不返回已检查SAT |
| 32MiB进程堆预算、20,000断言压力 | UNKNOWN／RESOURCE_LIMIT_MEMORY | 子进程已退出 |
| 压力后重新启动独立求解进程 | SAT | MODEL_CHECKED |

原始人工结构夹具、Core、source-map、query、SMT-LIB、模型与冲突核位于 [solver证据](evidence/solver/EVIDENCE-RESULTS.json)。这些夹具不是LLM生成成绩。

结构生成种子1—256：原始布尔IR独立参考、Core、根改名／节点重排及否定变异均核对；1—12另与旧布尔求解器进行共同片段差分。固定组合另覆盖集合身份去重、实例状态、必要条件在动作开始时、总期限、产物可用性及停止区间。没有未解决的生成seed失败；固定反例和期望失败作为检查保留。有限测试不等于穷举所有自然语言或证明整个语言完备。

## 原始回放与剩余缺口

五份历史候选完整保留。新Core默认全约束查询对001和002报告开放事件域，对004 skill1报告动态枚举域，对004 Skill报告尚未迁移的隐式模式局部变量。没有补快照、删限制或从标准MD抄答案把它们改成新内核PASS。

旧1.4消费者的独立回放：001保持CALCULATED；002 Skill因本任务前已有ui82修复得到CALCULATED，但仍有未认证的条件禁止分支；其余三份保持PARTIAL。详见 [LLM-VS-PROGRAM-ISSUES.md](LLM-VS-PROGRAM-ISSUES.md)。新合同下的真实解析／审阅／修订能力仍为NOT_RUN。

能力边界：开放事件域全域SAT、动态枚举／符号实例索引、旧隐式模式迁移、定性立即的数值求解、条件或非REQUIRED总耗时联合求解尚未支持。程序返回具体诊断，不将不支持等同于源语义错误或UNSAT。下一次真实模型验收及生产集成不能省略这些检查。

## 安装、历史与授权状态

最终干净包检查在禁用Node进程联网API的条件下运行，CLI得到SAT／MODEL_CHECKED，38项内核检查全通过；未改主机防火墙或网络配置。首次包遗漏协议Schema造成的两组加载失败与后续r03成功分别保存。

被测模型调用0；58618停启／升级0；新监听端口0；merge、release、tag、对外发布0。58618仍为 `0.1.0-candidate.031-r1.2-ui.82`，只读核对时监听PID为3552，安装manifest未变化。业务裁决与执行授权均为null。

最后收尾再次只读核对，58618没有LISTEN记录，Get-NetTCPConnection返回CmdletizationQuery_NotFound；安装指针仍为上述ui82。本任务未执行任何服务停启，未据此恢复服务。前述PID3552是较早核对的快照，不是当前运行声明；最终监听状态见 `evidence/FINAL-RUNTIME-CHECK.json`。

源码差异检查通过；用户原始PLAN中的Markdown换行空格、Z3原始SMT导出的注释尾空格按冻结材料保留，未为了消除样式提示改写原字节。提交在本地隔离分支保存；此次未推送远端。

主工作区新增的未跟踪测试文件完整保留且不并入候选；初始状态条目、原Skill和冻结历史核对结果见 [BASELINE.md](BASELINE.md)。主目录未整体暂存。本轮终态：**隔离内核候选交付，等待ADMIN审阅；生产和新模型语义验收未完成。**
