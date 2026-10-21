# ADMIN Root Standard 50 · v1

**输入合同：** 每例均为 ADMIN 发布给 PM 的 Root Task。正文定义授权边界，不提供 PM 的具体执行分工；Parser 不得自行拆 WP。

## ROOT-001 系统环境核查

请 PM 组织完成测试环境系统状态核查，范围包括操作系统、磁盘余量和关键服务进程，并形成 environment-check.md。QA 必须对检查结果复核，最终由 PM 向 ADMIN 提交报告。整个任务须在 40 分钟内完成，不得修改系统配置。

## ROOT-002 FCoP 落地检查

请 PM 组织核查当前项目的 FCoP 落地情况，重点覆盖任务记录与证据留存，并形成 fcop-review.md。检查依据为 FCoP v2.1。QA 复核缺失项后由 PM 向 ADMIN 汇报，不得补造历史记录。

## ROOT-003 MCP 权限审计

请 PM 组织对 mcp-config.json 中已启用 MCP 工具的访问权限进行只读审计，并形成 mcp-access.md。不得调用被审计工具，也不得改动 mcp-config.json；最终结果由 PM 向 ADMIN 汇报。

## ROOT-004 Skills 分配审计

请 PM 组织核查 skills-map.yaml 中的 Skills 分配是否符合已批准的角色能力边界，并形成 skills-audit.md。QA 必须复核角色与能力对应关系；禁止修改角色授权或安装新 Skill。

## ROOT-005 轨道机运行检查

请 PM 组织检查轨道机当前运行状态及最近一小时告警日志，并形成 orbit-review.md。若发现停机，任务应立即停止后续检查并向 PM 汇报；不得重启轨道机。

## ROOT-006 备份核验

请 PM 组织读取 backup-index.csv 并核验其中全部备份的校验结果，形成 backup-audit.md。QA 应确认报告覆盖清单中的每一项后再由 PM 提交给 ADMIN。不得恢复或删除备份。

## ROOT-007 权限最小化检查

请 PM 组织对 roles.csv 与 grants.csv 进行权限最小化核查，范围仅限测试环境，并形成 permission-review.md。生产环境不在本次范围内；不得修改授权。

## ROOT-008 证书有效期核查

请 PM 组织读取 certificates.csv，检查证书到期时间并形成 expiry-report.md。距到期不足 15 天的证书应在报告中单独标记；不得更换证书。

## ROOT-009 日志排查

请 PM 组织读取 app.log 与 error.log，定位重复报错并形成 incident-notes.md。单次查询最多重试 3 次，整个任务不得超过 30 分钟；若发现凭据泄露，应立即停止并通知 PM，不得向外部服务上传日志。

## ROOT-010 发布前只读检查

请 PM 组织依据 RELEASE-6 v3.0 对 release.yaml 与 build.log 进行发布前只读检查，并形成 release-check.md。此次任务不执行发布，不得修改源码或发布配置。

## ROOT-011 代码差异检查

请 PM 组织以 commit 6ab9c21 为基线检查当前代码差异，并形成 code-diff.md。报告必须列出新增接口和删除接口；本任务不要求修复问题，不得提交代码、合并分支或创建标签。

## ROOT-012 接口兼容性检查

请 PM 组织读取 api-old.json 与 api-new.json，检查公共接口兼容性并形成 compatibility.md。QA 应确认所有删除或改名接口均已记录；不得修改接口定义文件。

## ROOT-013 依赖许可证核查

请 PM 组织按 LICENSE-POLICY-4 核查 dependencies.lock 中直接依赖的许可证，并形成 license-review.csv。范围不含间接依赖；许可证信息缺失时标记为待确认，不得自动判为允许商用。

## ROOT-014 单元测试审阅

请 PM 组织审阅 unit-results.json 中的失败用例并形成 failures.md，同时收集失败原因说明。不得重新运行测试，也不得在本任务中修改实现。

## ROOT-015 配置一致性检查

请 PM 组织读取 staging.yaml 与 template.yaml，检查测试环境配置与模板的一致性并形成 config-diff.md。存在差异时逐项列出，不存在差异时明确写明无差异；不得同步或覆盖配置文件。

## ROOT-016 数据库结构检查

请 PM 组织依据 DB-SPEC-9 对 schema.sql 中的索引与约束声明进行离线检查，并形成 schema-review.md。不得连接生产数据库；QA 应确认两类检查都完成后任务结束。

## ROOT-017 构建产物校验

请 PM 组织读取 checksums.txt，核验 dist 目录中的全部压缩包，并形成 package-check.md。任何校验值不匹配时应停止核验并汇报；不得删除或重新生成压缩包。

## ROOT-018 技术文档审阅

请 PM 组织检查 install.md 的安装步骤是否符合 QUICKSTART-2，并形成 doc-review.md。只记录不一致项，不修改 install.md；PM 收到报告且 QA 复核通过后任务完成。

## ROOT-019 测试覆盖核查

请 PM 组织读取 coverage.json，检查支付模块的分支覆盖率并形成 coverage-review.md。低于 85% 的文件应列入报告；本任务不新增测试，也不修改阈值。

## ROOT-020 安全扫描复核

请 PM 组织读取 scan.json 并复核高危发现，形成 security-review.md。若确认存在可利用漏洞，应立即升级汇报；不得执行漏洞利用或删除扫描结果。

## ROOT-021 数据完整性核查

请 PM 组织读取 orders.csv，检查订单号缺失和重复情况并形成 data-quality.md。只有全部记录检查完且报告已生成才完成；不得更改原始数据，整个核查须在 45 分钟内完成。

## ROOT-022 脱敏结果检查

请 PM 组织依据 MASK-RULE-7 检查 masked-sample.csv 中姓名和手机号的脱敏结果，并形成 masking-review.md。不得读取未脱敏原表，也不得将样本发送给外部人员。

## ROOT-023 资产清单核对

请 PM 组织读取 assets.csv 与 inventory.csv，核对在用设备编号并形成 asset-diff.md。已报废设备不在范围内；不得创建、删除或修改资产记录。

## ROOT-024 报表数值复核

请 PM 组织读取 revenue.csv 与 monthly-report.xlsx，复核报表汇总金额并形成 finance-review.md。复核误差必须精确记录，不允许通过四舍五入隐藏差异。

## ROOT-025 迁移计划评审

请 PM 组织读取 migration-plan.md，检查回滚步骤与停机窗口说明并形成 migration-review.md。不得执行任何迁移或回滚操作；只有 QA 确认两类说明均完整后才能向 ADMIN 提交评审结论。

## ROOT-026 模型配置核验

请 PM 组织读取 model-config.json，核查模型路径、精度设置与设备配置并形成 model-config-review.md。不得加载模型权重或发起推理；整个任务最多使用 20 分钟。

## ROOT-027 模型调用证据检查

请 PM 组织读取 inference-trace.json，检查模型名称、输入摘要和输出摘要并形成 model-call-audit.md。没有调用证据的模型必须标记为未证实，不得因模型已下载而标为已调用。

## ROOT-028 评测结果审阅

请 PM 组织读取 evaluation.json，分别统计运行失败和语义错误并形成 evaluation-review.md。不得把运行成功等同于语义正确，也不得修改测试原文或标准答案。

## ROOT-029 提示词文档交付

请 PM 组织编写 prompt-guide.md，文档必须说明“遇到凭据时停止输出”。本任务只交付文档，不执行文档中的测试流程；QA 应确认文档包含该停止条件。

## ROOT-030 训练数据清单审计

请 PM 组织读取 training-index.csv，核查每项数据的来源与许可记录并形成 training-audit.md。来源或许可缺失的条目标为待确认；不得下载新数据或启动训练。

## ROOT-031 推理资源检查

请 PM 组织仅在测试环境执行推理健康检查并形成 inference-health.md。内存使用不得超过 2 GB，最多重试 2 次；若内存超限应立即停止，不得切换到生产环境。

## ROOT-032 检索配置复核

请 PM 组织依据 SEARCH-SPEC-5 v1.2 读取 retrieval.yaml，复核索引和过滤配置并形成 retrieval-review.md。不得调整召回阈值或重建索引；QA 复核通过后由 PM 向 ADMIN 汇报。

## ROOT-033 向量索引审计

请 PM 组织读取 index-manifest.json，检查索引文件的版本与校验值并形成 index-audit.md。检查范围排除 archive 目录；不得重新计算向量，发现校验失败时必须汇报。

## ROOT-034 模型许可证复核

请 PM 组织依据 AI-LICENSE-3 核查 model-licenses.csv 中的商用许可并形成 model-license-review.md。许可范围不明确时保持待确认，不得推断为可商用。

## ROOT-035 回归结果对比

请 PM 组织读取 before.json 与 after.json，对比失败用例及耗时变化并形成 regression-diff.md。必须分别列出新增失败和已消失失败；不得修改 Parser、模型或阈值。

## ROOT-036 综合检查

请 PM 组织检查服务状态、权限配置和日志留存情况，并形成 overall-check.md。团队内部如何分工由 PM 决定，QA 必须对最终检查结果复核；不得实际修复发现的问题。

## ROOT-037 报告合并审阅

请 PM 组织读取 dev-report.md 与 ops-report.md，形成 consolidated.md，并确保两份报告的全部风险项得到保留。QA 确认无遗漏后，PM 才能提交给 ADMIN。

## ROOT-038 审批后只读检查

请 PM 组织一次生产快照只读检查：只有负责人批准后才允许读取 production-snapshot.csv，并形成 snapshot-review.md。未经批准不得读取快照，也不得连接生产数据库。

## ROOT-039 报告接收边界

请 PM 组织读取 failures.csv 并形成 issue-review.md，最终报告发送给管理员林川。林川仅作为接收人，不负责审批；不得发送到外部邮箱。

## ROOT-040 停止与恢复边界

请 PM 组织检查 service.log 并形成 operation-review.md。发现高危告警时必须停止检查并通知 PM，只有 PM 明确批准后才能恢复；不得自行重启服务。

## ROOT-041 无需生成分支

请 PM 组织检查 changes.csv。存在差异时必须生成 difference-report.md 并提交；没有差异时无需生成该报告，只需向 PM 说明无差异。不得修改 changes.csv。

## ROOT-042 只读与可选动作

请 PM 组织任务时必须读取 package.json，可以查看 README.md，并生成 package-review.md。不得修改这两个文件；QA 必须复核报告。

## ROOT-043 输出内部结构

请 PM 组织生成 release-note.md，文档必须包含风险清单和回滚建议两个章节。只有文件已生成且两个章节都存在时任务才完成；不得执行回滚，也不得修改 release.yaml。

## ROOT-044 引用文字不执行

请 PM 组织生成 decision.md，并在文档中原样写入“已经批准发布”。本任务不具有发布审批职责，不得实际批准或执行发布；QA 应确认文字记录准确。

## ROOT-045 完成条件析取

请 PM 组织执行测试环境连通性检查并形成 connection-review.md。主链路检查通过或备用链路检查通过时即可完成；两者都失败时应停止并通知 PM。不得改变网络路由。

## ROOT-046 验收计数与次数限制

请 PM 组织执行备份读取检查，最多尝试 5 次。至少 2 次读取成功且 check-log.md 已生成时任务才完成；不得写入备份。

## ROOT-047 英文输入输出与禁止

PM must organize a review of servers.csv and deliver server-review.md. QA must review the report before PM sends it to ADMIN. The task must not modify servers.csv.

## ROOT-048 英文时限与依据

Using CHECK-19 version v2.4, PM must organize an inspection of routes.yaml and deliver route-audit.md within 30 minutes. The task must not change the configuration, and QA must review the report before delivery.

## ROOT-049 英文条件与停止

PM must organize a review of health.log. If a critical error is found, the task must stop and PM must be notified; otherwise health-summary.md must be produced. The service must not be restarted.

## ROOT-050 完整 ADMIN Root 任务

请 PM 组织检查系统环境、FCoP 落地情况、MCP 工具与 Skills 分配使用以及轨道机运行状态，并形成 overall-review.md。团队内部具体分工由 PM 决定，QA 必须复核最终检查结果；不得修改任何被检查配置，不得重启相关服务。

