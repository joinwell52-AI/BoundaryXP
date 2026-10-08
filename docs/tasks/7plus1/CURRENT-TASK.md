# 当前 BoundX 7+1 产品任务

**主任务：`7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG`。**
**当前优先维护事项：用户入口固定回58618。**

## 2026-10-08 维护执行回执

`PORT_58618_RESTORED=true`，`STOP_STATE=WAITING_ADMIN_REVIEW`。
实际本机127.0.0.1:58618监听PID30152，完整已安装候选`0.1.0-candidate.031-r1.2`/`031-r1-c3`/合同`031-r1.1`，35项资源摘要一致。Q05未安装，PARTIAL/REVIEW_REQUIRED及模型预算不变。
已核对备份、会话、历史、JSON/中文/完整Trace导出及冻结响应离线回放；专项5 PASS/0 FAIL。本维护真实模型调用0，不算新增语义验收。原58618/58621当时无监听者，本次无需停止旧服务；正常启动成功，没有绕过历史策略拒绝。固定启动：在D:\boundx执行`npm run 7plus1:ui`，同版本已运行时只返回地址，不重复启动。
报告：`docs/reports/7plus1/031-R1-RESTORE-58618/REPORT.md`。完整资源与旧记录保持原字节。UI仍是原候选页面，未新增PARTIAL/Q05专用横幅；具体已知限制见本维护报告和原语义报告。完成后不自动补测或升级。

## 2026-10-08 ADMIN最新要求：回到58618

执行维护追加：

`docs/tasks/7plus1/ADDENDUM-031-R1-RESTORE-58618.md`

创建提交：`8e3628db90711bc6ad020dc191e8cf36edfdddcb`。

本次只恢复固定用户入口，不重新设计编译器、不升级语义方法、不追加模型预算。以原58621对应的完整已安装候选`0.1.0-candidate.031-r1.2`为迁回对象，先核实本地指针与清单，不擅自覆盖另行授权的更新。Q05新包尚未完整验收且未安装，本次不自动安装。维护成功不改变PARTIAL/REVIEW_REQUIRED的语义状态。

目标地址：`http://127.0.0.1:58618/`。保留原UI，固定原有启动入口指向完整安装版本，不再新增端口或回退旧NLP。配置、历史、启动指针先备份；核对当前目标进程身份、版本和在途请求，不照抄历史PID。

此前恢复收到“blocked by policy”。用户最新意图不覆盖环境安全限制：只通过正常审批渠道获准后执行受控停止与启动；若仍拒绝，停止并单列POLICY_BLOCKED，不换命令/工具/资源绕过，不反复尝试。不得停止未知占用者或其他Codex/Node进程。

默认零真实模型调用。以实际页面/会话、完整资源摘要、历史/导出和明确标记的同源回放检查恢复，不仅以首页HTTP200判完成。最终给实际58618地址、版本、PID、重启命令和真实检查结果；未恢复不得宣称已恢复。此指针更新仅发布任务，没有操作用户本地进程。

## 语义研发状态保持不变

031-R1原候选`0.1.0-candidate.031-r1.2`：`SHORT_PRODUCT_031_R1=PARTIAL`、`SEMANTIC_ACCEPTANCE=REVIEW_REQUIRED`。报告：

`docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/REPORT.md`

Q05对象范围续作已封存，提交`3c878d6132ac3beb6bcd15d28c0d5a4287544c61`。报告：

`docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-Q05/REPORT.md`

Q05源码冻结`445e6c44256a9aaa6be13cb7439ce4ce6a716d32`；候选`0.1.0-candidate.031-r1.q05.1`未安装。全称结构和无模型正反检查通过，真实8次运行来源复核6 PASS/2 REVIEW_REQUIRED；Q05两次适用域不同，未改旧判定。旧52项不得计为新Schema/Skill验证成绩。

当前保守模型预算175/180，剩5；旧031独立239/240，均不重置。本维护事项不授权Q05补测、扩大模型调用、购买额度或改变模型/账号。

58621最后报告检查为ECONNREFUSED，不能从GitHub证明本机当前状态；恢复前由本地执行者核验。原58619不要求本轮清理。原58618此前混版及策略阻塞不得隐去。

## 主任务合同与权威

主任务书：`docs/tasks/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG.md`。
范围续作：`docs/tasks/7plus1/ADDENDUM-031-R1-Q05-OBJECT-RANGE-CLOSURE.md`。
规范：`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md`，按所选完整运行版本核对修订与摘要，不混用。
产品总要求：`docs/tasks/7plus1/SHORT-COMPILER-PRODUCT-DELIVERY-CONTRACT.md`。

仓库：`joinwell52-AI/BoundX`；工作及推送分支：`review/7plus1-parser`。
唯一核心：`research/7plus1-parser/llm-first-028/`；产品封装：`product/short-compiler/`。

主链不变：ADMIN原文→解析Skill/LLM→候选→审阅Skill/新会话→技术校验→Boundary IR→7+1 JSON及同源中文。LLM负责语义理解，程序保真消费。O沿用已批准的产生/交付用途，不补执行授权、不重开定义。

保护实际本地tracked/untracked工作与历史，历史160项仅作线索；不强制reset/clean，不吞入无关文件。中文用UTF-8 Python/Node编辑，不用PowerShell改写。候选运行资源必须与开发工作区隔离；不运行Gold-60/旧350、不扩长文本/WP/NLP/复杂求解或业务执行。

维护完成或遇到真实权限阻塞后停止`WAITING_ADMIN_REVIEW`。只推送review分支的必要改动，不merge/release/tag或公开部署；不自动开始后续语义补测。旧030、031及031-R1首次结果和封存不倒改。
