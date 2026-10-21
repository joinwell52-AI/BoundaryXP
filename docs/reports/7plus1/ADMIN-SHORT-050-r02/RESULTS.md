# 50 例逐条实际结果

每例至少列出一个与原文直接对应的失败证据；这不是全部错误计数。审阅者为本次助手，待 ADMIN 复审，不作人工 Gold。

| Case | 场景 | 运行 | 合同 | 语义审阅 | 已确认的反例 |
| --- | --- | --- | --- | --- | --- |
| [ADM-001](first/ADM-001/canonical-7plus1.md) | 系统环境核查 | EXECUTED | PASS | 未闭合 | 明确的任务时限未进入 R，实际 R=ABSENT。 |
| [ADM-002](first/ADM-002/canonical-7plus1.md) | FCoP 落地检查 | EXECUTED | PASS | 未闭合 | 依据只保留 v2.1，未形成 FCoP 与版本的完整身份。 |
| [ADM-003](first/ADM-003/canonical-7plus1.md) | MCP 权限审计 | EXECUTED | PASS | 未闭合 | 未保留配置文件输入，却将“本次审计”作为 RESOLVED 输入。 |
| [ADM-004](first/ADM-004/canonical-7plus1.md) | Skills 分配审计 | EXECUTED | PASS | 未闭合 | 明确要求生成的文件没有 O 条目。 |
| [ADM-005](first/ADM-005/canonical-7plus1.md) | 轨道机运行检查 | EXECUTED | PASS | 未闭合 | 检查对象及日志输入没有进入 I，实际 I=ABSENT。 |
| [ADM-006](first/ADM-006/canonical-7plus1.md) | 备份核验 | EXECUTED | PASS | 未闭合 | 明确读取的文件输入遗漏，I=ABSENT。 |
| [ADM-007](first/ADM-007/canonical-7plus1.md) | 权限最小化检查 | EXECUTED | PASS | 未闭合 | 禁止动作已捕获，但明确对象“授权”未绑定，条目保持 UNRESOLVED。 |
| [ADM-008](first/ADM-008/canonical-7plus1.md) | 证书有效期核查 | EXECUTED | PASS | 未闭合 | 明确读取的证书清单遗漏，I=ABSENT。 |
| [ADM-009](first/ADM-009/canonical-7plus1.md) | 日志排查 | EXECUTED | PASS | 未闭合 | 两个明确读取文件均未进入 I。 |
| [ADM-010](first/ADM-010/canonical-7plus1.md) | 发布前只读检查 | EXECUTED | PASS | 未闭合 | 读取文件 release.yaml 被错误确认为 V；规范身份也只保留版本。 |
| [ADM-011](first/ADM-011/canonical-7plus1.md) | 代码差异检查 | EXECUTED | PASS | 未闭合 | “删除接口”是报告内容/被列出的变更类别，却生成了 REQUIRED 删除接口动作。 |
| [ADM-012](first/ADM-012/canonical-7plus1.md) | 接口兼容性检查 | EXECUTED | PASS | 未闭合 | 两个明确读取的接口定义均未进入 I。 |
| [ADM-013](first/ADM-013/canonical-7plus1.md) | 依赖许可证核查 | EXECUTED | PASS | 未闭合 | V 被截断为 POLICY-4，改变了依据身份。 |
| [ADM-014](first/ADM-014/canonical-7plus1.md) | 单元测试审阅 | EXECUTED | PASS | 未闭合 | 遗漏被检查的测试结果文件；I 仅出现“失败原因”。 |
| [ADM-015](first/ADM-015/canonical-7plus1.md) | 配置一致性检查 | EXECUTED | PASS | 未闭合 | 两份明确读取配置没有 I。 |
| [ADM-016](first/ADM-016/canonical-7plus1.md) | 数据库结构检查 | EXECUTED | PASS | 未闭合 | V 同时生成 DB-SPEC-9 与截断的 SPEC-9，后者不是独立依据。 |
| [ADM-017](first/ADM-017/canonical-7plus1.md) | 构建产物校验 | EXECUTED | PASS | 未闭合 | 明确读取校验清单未进入 I。 |
| [ADM-018](first/ADM-018/canonical-7plus1.md) | 技术文档审阅 | EXECUTED | PASS | 未闭合 | 明确读取的文档没有 I 条目。 |
| [ADM-019](first/ADM-019/canonical-7plus1.md) | 测试覆盖核查 | EXECUTED | PASS | 未闭合 | 明确读取的覆盖率文件没有 I 条目。 |
| [ADM-020](first/ADM-020/canonical-7plus1.md) | 安全扫描复核 | EXECUTED | PASS | 未闭合 | 明确读取的扫描结果遗漏，I=ABSENT。 |
| [ADM-021](first/ADM-021/canonical-7plus1.md) | 数据完整性核查 | EXECUTED | PASS | 未闭合 | 明确核查时限遗漏，R=ABSENT。 |
| [ADM-022](first/ADM-022/canonical-7plus1.md) | 脱敏结果检查 | EXECUTED | PASS | 未闭合 | 明确读取的脱敏样本遗漏，I=ABSENT。 |
| [ADM-023](first/ADM-023/canonical-7plus1.md) | 资产清单核对 | EXECUTED | PASS | 未闭合 | 参与人员被纳入 RESOLVED I，assets.csv 和 inventory.csv 均遗漏。 |
| [ADM-024](first/ADM-024/canonical-7plus1.md) | 报表数值复核 | EXECUTED | PASS | 未闭合 | 两份明确读取文件没有 I 条目。 |
| [ADM-025](first/ADM-025/canonical-7plus1.md) | 迁移计划评审 | EXECUTED | PASS | 未闭合 | 明确读取的计划文件遗漏，I=ABSENT。 |
| [ADM-026](first/ADM-026/canonical-7plus1.md) | 模型配置核验 | EXECUTED | PASS | 未闭合 | 明确读取的模型配置没有 I 条目。 |
| [ADM-027](first/ADM-027/canonical-7plus1.md) | 模型调用证据检查 | EXECUTED | PASS | 未闭合 | 明确读取的推理证据文件遗漏，I=ABSENT。 |
| [ADM-028](first/ADM-028/canonical-7plus1.md) | 评测结果审阅 | EXECUTED | PASS | 未闭合 | 明确读取评测结果遗漏，I=ABSENT。 |
| [ADM-029](first/ADM-029/canonical-7plus1.md) | 提示词文档交付 | EXECUTED | PASS | 未闭合 | 明确文档交付没有 O 条目。 |
| [ADM-030](first/ADM-030/canonical-7plus1.md) | 训练数据清单审计 | EXECUTED | PASS | 未闭合 | I 错收动作名“复核”，未收 training-index.csv。 |
| [ADM-031](first/ADM-031/canonical-7plus1.md) | 推理资源检查 | EXECUTED | PASS | 未闭合 | 交付物对象错误包含连接词“并”，却被 RESOLVED。 |
| [ADM-032](first/ADM-032/canonical-7plus1.md) | 检索配置复核 | EXECUTED | PASS | 未闭合 | 依据拆为 SPEC-5 与 v1.2；规范完整身份与版本绑定丢失。 |
| [ADM-033](first/ADM-033/canonical-7plus1.md) | 向量索引审计 | EXECUTED | PASS | 未闭合 | 明确读取的索引清单遗漏，I=ABSENT。 |
| [ADM-034](first/ADM-034/canonical-7plus1.md) | 模型许可证复核 | EXECUTED | PASS | 未闭合 | 明确读取的许可证清单遗漏，I=ABSENT。 |
| [ADM-035](first/ADM-035/canonical-7plus1.md) | 回归结果对比 | EXECUTED | PASS | 未闭合 | 禁止修改仅保留阈值，未保留 Parser 和模型两个明确对象。 |
| [ADM-036](first/ADM-036/canonical-7plus1.md) | PM 总体组织 | EXECUTED | PASS | 未闭合 | 两份报告交付未进入 O，实际 O=ABSENT。 |
| [ADM-037](first/ADM-037/canonical-7plus1.md) | 报告合并审阅 | EXECUTED | PASS | 未闭合 | 两份明确读取报告遗漏，I=ABSENT。 |
| [ADM-038](first/ADM-038/canonical-7plus1.md) | 审批后只读检查 | EXECUTED | PASS | 未闭合 | 审批者丁岚被解析为 PERFORMER；审批条件与 QA 执行责任没有保持。 |
| [ADM-039](first/ADM-039/canonical-7plus1.md) | 报告接收角色 | EXECUTED | PASS | 未闭合 | 明确否定的审批职责反而产生 REQUIRED 审批，且接收者被增添 PERFORMER。 |
| [ADM-040](first/ADM-040/canonical-7plus1.md) | 停止与恢复边界 | EXECUTED | PASS | 未闭合 | 明确被检查的日志遗漏，I=ABSENT。 |
| [ADM-041](first/ADM-041/canonical-7plus1.md) | 无需生成的分支 | EXECUTED | PASS | 未闭合 | 明确检查文件遗漏，I=ABSENT。 |
| [ADM-042](first/ADM-042/canonical-7plus1.md) | 只读与可选动作 | EXECUTED | PASS | 未闭合 | 接收者 ADMIN 被错误确认为 I。 |
| [ADM-043](first/ADM-043/canonical-7plus1.md) | 输出内部结构 | EXECUTED | PASS | 未闭合 | C 的 AND 指向两个 SOURCE_STATE 字面片段，无具体文件对象及两个章节的绑定；另把“包含回滚建议两个章节”提升为执行 A。 |
| [ADM-044](first/ADM-044/canonical-7plus1.md) | 引用文字不执行 | EXECUTED | PASS | 未闭合 | 明确 QA 复核与 PM 接收均未投影，P=ABSENT。 |
| [ADM-045](first/ADM-045/canonical-7plus1.md) | 完成条件析取 | EXECUTED | PASS | 未闭合 | 完成 OR 未闭合，完成条目仍为 UNRESOLVED。 |
| [ADM-046](first/ADM-046/canonical-7plus1.md) | 验收计数与额度 | EXECUTED | PASS | 未闭合 | 明确尝试次数上限遗漏，R=ABSENT；与两次成功的验收条件亦未闭合。 |
| [ADM-047](first/ADM-047/canonical-7plus1.md) | 英文输入输出与禁止 | EXECUTED | PASS | 未闭合 | 明确英文生成交付没有 O 条目。 |
| [ADM-048](first/ADM-048/canonical-7plus1.md) | 英文时限与依据 | EXECUTED | PASS | 未闭合 | 明确英文时限遗漏，R=ABSENT；CHECK-19 v2.4 依据也没有 V。 |
| [ADM-049](first/ADM-049/canonical-7plus1.md) | 英文条件与停止 | EXECUTED | PASS | 未闭合 | 明确 otherwise 条件交付没有 O 条目。 |
| [ADM-050](first/ADM-050/canonical-7plus1.md) | 完整 ADMIN 短任务书 | EXECUTED | PASS | 未闭合 | 最终交付遗漏，O=ABSENT；四类检查范围也未进入 I。 |
