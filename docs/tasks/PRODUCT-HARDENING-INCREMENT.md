# 产品代码补齐记录 / Product hardening increment

本记录是v2实施增量，不是整体完成声明，不替代原任务书或独立金标审阅。

This is an implementation increment, not an overall completion claim or independent gold review.

## WP9契约矩阵增量 / WP9 contract matrix increment

v2的8类×8组独立fixture已补齐，见[64组清单及执行说明](../../fixtures/admin-text/CONTRACT-SAFETY.md)。65/65通过：64个场景及1个清单完整性测试。跨入口复用实际CLI/MCP/HTTP集成检查，208冻结期望原样运行。不是64条新任务原文，也不计入真实模型运行。

The complete eight-by-eight deterministic matrix passes: 64 scenarios plus one inventory test. Existing cross-entry integration and 208 frozen expectations are executed, not regenerated. These are not live-model runs or new source-text cases.

本次修复产品层两个诊断缺口：Core严格JSON解析器已拒绝的节点超限现在报告STRUCTURE_LIMIT，而非混成JSON语法错误；描述符自引用在产品合同阶段显式拒绝，不再先落入无关资源计数错误。Core及协议没有改动。

Product-layer fixes distinguish structural-limit failures from malformed JSON and reject descriptor self-reference before resource enumeration. No Core or protocol contract changes.

本地全量回归：工作区Core392/392（包含另一任务22项行业测试）、UI154/154、协议103/103、冻结向量208/208、Python135/135、文档单测20/20。原子提交中断用例真实退出子进程，再重新打开Registry检查旧状态与重试；不存在把模拟模型请求算成真实生成的情况。

Local regression: workspace Core392 (including 22 concurrent industry tests), UI154, protocol103, frozen vectors208, Python135 and documentation20 passed. Interrupted commits use actual child-process exits and registry reopening. Mock requests are not counted as live generation.

## 本次实现 / Implemented

- 主模型面板接入可选L3，默认不选择；无宿主外发授权时拒绝整个模型请求，错误与结果保持分离。
- Cursor目录读取、创建、发送、等待均可取消；设置目录及生成等待上限，迟到会话/运行句柄有清理回调。
- L2实体、岗位、资源、依据、完成与风险使用离线结构校验；兼容现有数组别名和双语对象别名。禁止额外权限字段，检查完成词条引用的动作ID。
- 修复多行业双语对象别名不能被展开检索的问题，不改变原文或词条身份。
- 增加v2固定验收setup：明确角色映射、PM空映射、同名员工、inactive记录、tenant-b以及0.2.0变更名册。旧示例字节不改，测试在独立临时目录构建包。
- 首次L1初始化按客户活动文件判定，修复同一Registry第二个客户未获得L1的问题；已有显式停用仍保留。

The increment adds optional L3 model context with fail-closed disclosure, interruptible Cursor lifecycle, offline validation of six L2 payload types, bilingual alias retrieval, reproducible v2 directory setups, and per-tenant default initialization. No protocol meaning or frozen vectors are changed.

## 证据及限制 / Evidence and limits

此前检查点顺序回归：Core326/326（工作区，含并行行业测试），UI154/154，协议103/103，冻结向量208/208，Python135/135，文档20/20；95份文档279个本地链接无失效。此计数不相加成模型准确率。相较e4156a4，protocol与LICENSE无改动。

Earlier checkpoint checks: Core326, UI154, protocol103, frozen vectors208, Python135 and documentation20 passed; 95 documents and 279 local links checked. Workspace counts include concurrent industry tests and are not model accuracy. Protocol and license are unchanged relative to e4156a4.

新增回归涵盖六类有效载荷及字段错误、双语别名、L3外发许可、取消与迟到清理、固定名册角色映射、Cursor中英候选到Core和三层报告。Cursor生成测试注入SDK模拟响应；不算真实模型调用。

浏览器实查确认：自动加载12个已安装行业、L3默认不选择、Cursor切换隐藏API协议与URL、未连接时标准抽取按钮禁用、旧研究区默认折叠。

首次并发全量测试出现一次HTTP ECONNRESET；对应Core/CLI/MCP/HTTP集成测试单独复跑3/3通过，随后完整顺序回归通过。保留首次失败，不以旧成功覆盖它。

Mock SDK checks are not live-model evidence. Browser verification covered package loading, default-off L3, provider controls and disabled extraction before connection. A transient concurrent HTTP reset is recorded separately from successful isolated and sequential reruns.

独立审阅120条金标、150次真实生成验收和Codex生产者接入仍未完成。64组本地契约矩阵不能替代这些验收。不得据本增量宣称整体完成、语义准确率达标或BXP-EXTRACT认证。也不合并或发布。

Independent review of 120 gold cases, 150 live generation runs and Codex transport remain incomplete. The 64-group deterministic matrix does not replace these gates. No overall completion, extraction certification, merge or release is claimed.
