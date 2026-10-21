# ADMIN Root Natural 100 · v1

**输入合同：** 每例均为 ADMIN→PM Root Task。允许自然表达、组织约束、条件与歧义，但不把 DEV/OPS/QA 已分配好的执行计划当作 Root Task。NROOT-096～100 为真实歧义控制。

## NROOT-001 服务健康核查

本次任务由 PM 负责组织，对测试环境关键服务的运行状态进行核查，并形成 service-health.md。QA 对最终结果做独立复核后，PM 向 ADMIN 汇报。不得重启、停止或修改被检查服务。

## NROOT-002 配置一致性

请 PM 负责本次配置一致性检查，核对 app-config.yaml 与模板文件中的关键项，并形成 config-consistency.md。任务仅允许读取和记录差异，不得覆盖配置。

## NROOT-003 证据完整性

请 PM 组织检查 evidence-index.csv 中证据记录是否包含文件名、哈希和时间信息，最终交付 evidence-integrity.md。缺项应记录，不得补造证据。

## NROOT-004 API 清单核对

本次任务要求核对 public-api.json 中公开接口的名称与版本标识，并形成 api-list-review.md。由 PM 组织完成，QA 复核后提交；不得修改接口定义。

## NROOT-005 日志异常排查

请 PM 组织对 gateway.log 与 gateway-error.log 进行只读排查，关注最近 20 分钟重复 5xx，并形成 gateway-review.md。不得清理日志或重启网关。

## NROOT-006 依赖版本审阅

本次任务要求审阅 dependencies.lock 中直接依赖的版本状态并形成 dependency-audit.md，间接依赖不在范围内。由 PM 组织完成，不执行升级或重新安装。

## NROOT-007 构建结果检查

请 PM 组织核查 build-summary.json 中主模块和插件的构建结果，并形成 build-result-review.md。失败项只记录原因，不重新触发构建。

## NROOT-008 文档链接巡检

由 PM 组织检查 README.md 与 docs/index.md 的内部链接并形成 doc-link-review.md。只记录失效项，不修改文档。

## NROOT-009 权限映射复核

请 PM 组织读取 role-map.csv 和 permission-map.csv，检查角色与权限映射并形成 role-permission-review.md。不得新增、删除或修改权限记录。

## NROOT-010 快照差异

本次任务要求比较 node-a.json 与 node-b.json 中的服务版本和启动参数，形成 node-snapshot-diff.md。由 PM 组织，仅基于现有快照，不连接实际主机。

## NROOT-011 发布说明完整性

请 PM 组织审阅 release-note.md，检查版本、变更摘要与回滚说明是否完整，并形成 release-note-check.md。本任务不发布版本，也不修改原说明。

## NROOT-012 迁移脚本评审

本任务由 PM 组织对 migration.sql 做离线评审，检查回滚段与事务边界，形成 migration-script-review.md。不得连接数据库或执行脚本。

## NROOT-013 备份状态核验

请 PM 组织核验 backup-list.csv 中全部备份的校验状态与生成时间，并形成 backup-state-review.md。失败项单独列出；不得恢复或删除备份。

## NROOT-014 测试结果总结

本次任务要求基于 unit-test.json 与 integration-test.json 汇总失败情况并形成 test-summary.md。由 PM 组织，不重新运行测试，不修改实现。

## NROOT-015 模型文件核对

请 PM 组织核对 model-files.json 中模型名称、文件路径与 SHA-256，并形成 model-file-review.md。不得加载权重或启动推理。

## NROOT-016 索引元数据检查

本次任务要求检查 index-meta.json 中索引版本、分片数量和校验值，形成 index-meta-check.md。由 PM 组织，不重建索引，不重新计算向量。

## NROOT-017 样本字段完整性

请 PM 组织核查 sample.csv 的 id、timestamp、status 三列是否存在且非空，并形成 sample-field-review.md。不得修复或重写样本。

## NROOT-018 接口变更报告

本次任务要求比较 api-before.json 与 api-after.json，并形成 api-change-review.md，报告中分别列出新增、移除和重命名接口。不得实际执行接口删除或改名。

## NROOT-019 任务记录完整性

请 PM 负责检查 task-ledger.json 的状态记录是否完整，并形成 task-ledger-review.md。QA 必须复核最终报告；不得补造缺失历史。

## NROOT-020 证书到期检查

本次任务由 PM 组织检查 certs.csv 中证书名称、域名与到期日，形成 cert-expiry-review.md。30 天内到期的证书需单独标记，不得替换证书。

## NROOT-021 配置规范核验

请 PM 组织依据 CFG-RULE-8 v2.3 对 service.yaml 的参数命名和默认值进行核验，并形成 cfg-rule-review.md。只允许读取，不得修改 service.yaml。

## NROOT-022 发布规范核验

本次任务依据 RELEASE-CHECK-4 v1.7 对 artifact.json 与 checksum.txt 进行发布前核验，并形成 artifact-review.md。由 PM 组织，不执行发布，不重新生成校验文件。

## NROOT-023 安全规则复核

请 PM 组织依据 SEC-POLICY-12 v3.1 复核 scan-results.json 中的高危发现，并形成 security-audit.md。不得执行漏洞利用。

## NROOT-024 英文规则检查

Using OPS-GUIDE-7 version v2.0, PM must organize an inspection of host-state.json and deliver host-state-review.md. The task must not change host settings or restart the host.

## NROOT-025 数据规范审阅

请 PM 组织依据 DATA-SPEC-5 v4.2 检查 dataset-index.csv 的字段定义并形成 dataset-spec-review.md。不得下载新数据。

## NROOT-026 明确时限

请 PM 组织完成 cache-status.json 的状态检查并形成 cache-review.md，整个任务须在 25 分钟内完成。不得清空缓存或重启缓存服务。

## NROOT-027 查询重试上限

本任务由 PM 组织在测试环境完成连接核查并形成 connection-check.md。单次核查失败时最多重试 4 次，不得修改网络路由。

## NROOT-028 内存资源边界

请 PM 组织一次测试环境健康检查并形成 health-budget.md，内存使用不得超过 1536 MB。不得切换到生产环境。

## NROOT-029 观察窗口

本次任务要求查看 audit.log 最近 90 分钟的 error 与 warning 情况并形成 log-window.md。90 分钟是观察窗口，不是任务时限；不得删除日志。

## NROOT-030 尝试与验收

请 PM 组织备份读取检查并形成 backup-read.md，最多尝试 6 次；至少 3 次读取成功且报告已生成时任务完成。不得写入备份。

## NROOT-031 重试下界

本次任务要求在测试代理上完成探测并形成 probe-summary.md，至少重试 2 次后方可形成最终结果。不得修改代理配置。

## NROOT-032 精确查询次数

请 PM 组织在 sandbox 接口执行恰好 3 次可用性查询，并形成 availability.md。不得调用生产接口。

## NROOT-033 上下界组合

本次任务由 PM 组织服务探测并形成 service-probe.md，最多重试 5 次，且至少 2 次返回成功状态后才可完成。不得重启服务。

## NROOT-034 双资源限制

请 PM 组织完成测试环境模型健康检查并形成 model-health.md。任务须在 15 分钟内完成，显存占用不得超过 4 GB，不得加载其他模型。

## NROOT-035 分类阈值

本次任务要求根据 coverage.json 将低于 82% 的模块写入 coverage-risk.md。82% 只用于分类，不作为任务资源预算；不得修改阈值或补测。

## NROOT-036 输出内容数量

请 PM 组织读取 issue-list.csv 并形成 issue-summary.md，报告只列出优先级最高的 20 个问题。20 是报告内容限制，不是查询次数。

## NROOT-037 观察窗口加重试

本次任务要求查看 heartbeat.log 最近 10 分钟记录并形成 heartbeat-review.md。若读取失败，最多重试 3 次；不得重启服务。

## NROOT-038 英文时限

PM must organize an inspection of route-table.yaml and deliver route-review.md within 18 minutes. The route table must not be edited, and the final report must be sent to QA for review.

## NROOT-039 英文重试下界

PM must organize a probe of the test endpoint and deliver endpoint-probe.md. The probe must be retried at least 3 times before the report is written. Endpoint configuration must not be changed.

## NROOT-040 英文内存上限

PM must organize a read-only model smoke check in staging and deliver smoke-note.md. Memory usage must not exceed 2 GB, and no different model may be loaded.

## NROOT-041 PM组织边界

请 PM 负责组织本次 build-info.json 检查并形成 build-info-review.md。团队内部由谁执行具体检查由 PM 决定，QA 必须复核报告，最终由 PM 提交给 ADMIN。

## NROOT-042 仅接收不审批

请 PM 组织形成 incident-review.md，并将最终报告发送给平台主管陈洁。陈洁仅作为接收人，不负责审批或复核；不得发送到外部邮箱。

## NROOT-043 审批前置

本任务由 PM 组织；只有安全负责人刘靖批准后，才允许读取 prod-snapshot.json 并形成 prod-snapshot-review.md。刘靖不参与具体检查。

## NROOT-044 复核后提交

请 PM 组织形成 host-audit.md。QA 必须确认无遗漏后，才由 PM 向 ADMIN 提交；ADMIN 仅作为最终接收方。

## NROOT-045 原因说明与汇总

本次任务由 PM 组织检查 failure.json 并形成 failure-review.md，同时收集失败原因说明。PM 汇总后提交给 ADMIN；不得修改实现。

## NROOT-046 必选与可选输入

请 PM 组织任务时必须读取 package.json，可以查看 CHANGELOG.md，并形成 package-audit.md。不得修改这两个文件。

## NROOT-047 无需生成分支

本次任务由 PM 组织检查 diff.csv。若无差异，则无需生成 difference.md，只需向 PM 说明无差异；不得修改 diff.csv。

## NROOT-048 不要求修复

请 PM 组织检查 parser-errors.json 并形成 parser-error-review.md。本任务不要求修复任何错误，也不得修改 Parser。

## NROOT-049 接收与审批分离

请 PM 组织形成 archive-list.md 并完成归档清单交付。资料员叶澄可作为清单提供者，但不负责审批归档；不得删除历史文件。

## NROOT-050 英文角色约束

PM must organize a review of service.csv and deliver service-review.md. QA must review the report, and Leo may send the final report to ADMIN. Nora is not an approver.

## NROOT-051 条件停止

请 PM 组织检查 service.log。若发现 critical 错误，任务必须立即停止并通知 PM；否则应形成 service-summary.md。不得重启服务。

## NROOT-052 条件输出

本次任务由 PM 组织检查 changes.csv。有差异时应形成 change-report.md；没有差异时不生成文件，只需说明无差异。不得修改 changes.csv。

## NROOT-053 恢复条件

请 PM 组织检查 gateway.log 并形成 gateway-review.md。发现高危告警时必须停止，只有 PM 明确批准后才能恢复。

## NROOT-054 完成 AND

本任务要求读取 items.csv 并形成 item-review.md。只有全部记录检查完成且报告文件已生成时，任务才完成；由 PM 组织实施。

## NROOT-055 完成 OR

请 PM 组织测试环境连通性检查。主链路通过或备用链路通过时即可结束；两者都失败时必须通知 PM。不得调整路由。

## NROOT-056 双检查完成

本次任务要求检查索引声明与约束声明，两类检查都完成后形成 schema-check.md。由 PM 组织，不得修改 schema.sql。

## NROOT-057 QA验收前置

请 PM 组织形成 api-review.md。只有 QA 确认报告记录了所有删除和重命名接口后，PM 才能向 ADMIN 提交。

## NROOT-058 批准后读取

本任务由 PM 组织。未经负责人批准不得读取 finance-snapshot.csv；批准后方可进行只读检查并形成 finance-review.md。不得连接财务数据库。

## NROOT-059 条件升级

请 PM 组织复核 scan.json。若确认存在可利用漏洞，必须立即升级汇报；无论是否升级，都应形成 scan-review.md。

## NROOT-060 英文条件链

PM must organize a review of health.log. If a fatal error appears, the task must stop and PM must be notified; otherwise health-summary.md must be created. The service must not be restarted.

## NROOT-061 先后依赖

请 PM 组织读取 qa-result.json 并形成 qa-note.md。只有 qa-note.md 已生成后，PM 才能向 ADMIN 汇报。不得修改 qa-result.json。

## NROOT-062 双输入验收

本任务要求读取 before.csv 与 after.csv 并形成 compare.md。QA 确认两份输入均已核对且报告已生成后，PM 才能提交报告。

## NROOT-063 全称覆盖

请 PM 组织读取 host-list.csv，确保清单中每项主机记录都有检查结果，并形成 host-review.md。只有全部条目都有结果时才完成。

## NROOT-064 至少数量验收

本次任务要求审阅 10 个测试结果，至少 8 个完成复核且 qa-summary.md 已生成时任务完成。不得修改测试结果。

## NROOT-065 复核内容条件

请 PM 组织形成 license-review.md。QA 必须确认所有缺少许可证或来源不明的条目都已记录，之后方可发送最终报告。

## NROOT-066 输出章节

请 PM 组织生成 rollback-note.md，文档必须包含“风险清单”“回滚前提”“验证步骤”三个章节。不得执行回滚。

## NROOT-067 输出动作词

本次任务要求形成 operations-guide.md，其中必须写明“重启服务前先确认维护窗口”。该文字不构成本任务的重启授权；不得实际重启服务。

## NROOT-068 引用文字

请 PM 组织生成 approval-record.md，并原样写入“已批准上线”。本任务不具有上线审批权限，也不得执行上线。

## NROOT-069 分类内容

本次任务要求形成 interface-review.md，报告分别列出新增、删除和重命名接口。不得修改接口定义。

## NROOT-070 待确认标记

请 PM 组织读取 license.csv 并形成 license-note.md。许可证范围不清楚的条目必须标记为“待确认”，不得自动判为可商用。

## NROOT-071 输出中的停止条件

本次任务要求编写 runbook.md，其中说明“发现凭据泄露时停止处理并通知管理员”。这只是文档内容，不代表本任务实际执行该流程。

## NROOT-072 输出中的禁止语句

请 PM 组织生成 safety-guide.md，文档必须包含“不得删除生产数据”。本任务只交付文档，不访问生产数据。

## NROOT-073 输出内数量

本次任务要求形成 top-risk.md，只列出风险最高的 10 项。10 是内容限制，不是重试或资源约束。

## NROOT-074 输出内分支

请 PM 组织生成 deployment-guide.md，文档中说明：检查通过则继续部署，检查失败则停止。本任务不得实际部署。

## NROOT-075 英文输出内容

PM must organize the creation of operator-guide.md. The document must contain sections named “Risks” and “Rollback”. No rollback may actually be performed.

## NROOT-076 仅测试环境

请 PM 组织只检查测试环境中的 service.yaml，并形成 scope-review.md。生产环境不在本次范围内，不得修改任何配置。

## NROOT-077 排除目录

本次任务要求检查 src 目录中的配置引用并形成 config-ref-review.md，但明确排除 src/legacy。不得删除 legacy 文件。

## NROOT-078 设备范围

请 PM 组织核对 active.csv 中的在用设备并形成 active-device-review.md。已报废设备不属于此次核对范围。

## NROOT-079 英文范围

PM must organize a review limited to staging resources and exclude production resources. The deliverable is staging-scope.md, and no configuration changes are allowed.

## NROOT-080 离线只读

本次任务要求基于 audit.db 的只读快照进行离线审计并形成 audit-snapshot.md。不得连接在线数据库。

## NROOT-081 English basic audit

PM must organize a review of users.csv to verify that every active user has an owner and deliver user-audit.md. users.csv must not be edited.

## NROOT-082 English basis and time

Using SEC-CHECK-11 version v1.9, PM must organize an inspection of findings.json and deliver findings-review.md within 22 minutes. The findings must not be modified.

## NROOT-083 English review flow

PM must organize a review of build.json and deliver build-review.md. QA must review the report before Noah sends it to ADMIN. Mia must not be treated as a release approver.

## NROOT-084 English completion AND

PM must organize a review of inventory.csv and deliver inventory-review.md. The task is complete only when every item has been checked and the report exists.

## NROOT-085 English optional input

PM must organize the task so that config.json is read, README.md may be inspected, and config-note.md is produced. Neither file may be modified.

## NROOT-086 English output content

PM must organize creation of incident-guide.md with sections “Detection” and “Recovery”. No recovery action may actually be performed.

## NROOT-087 English count condition

PM must organize a staging probe with at most 4 attempts and deliver probe-log.md. At least 2 probes must succeed before completion.

## NROOT-088 English scope exclusion

PM must organize a review of test-cluster.yaml only. Production clusters are outside the task scope. The deliverable is cluster-review.md.

## NROOT-089 English conditional output

PM must organize an inspection of delta.csv. If differences exist, delta-report.md must be created; otherwise PM must record that there are no differences. delta.csv must not be edited.

## NROOT-090 English approval guard

PM must organize a review of finance-export.csv that may begin only after Dana approves the request. The deliverable is finance-audit.md, and the production database must not be accessed.

## NROOT-091 中英混合依据

请 PM 按照 API-GUIDE-3 version v2.6 组织检查 api-map.json，并形成 api-map-review.md。Do not modify api-map.json.

## NROOT-092 中英混合流程

请 PM 组织 review release.json 并形成 release-review.md；QA review 通过后，PM 才能 send the report to ADMIN。不得执行发布。

## NROOT-093 中英混合数量

请 PM 在 staging 组织 health probe，retry at least 2 times but no more than 5 times，并形成 health-probe.md。不得重启服务。

## NROOT-094 中英混合内容归属

请 PM 组织生成 incident-playbook.md，文档中必须写明“stop processing and notify PM when credentials leak”。本任务只编写文档。

## NROOT-095 中英混合范围

请 PM 组织 Inspect only 测试环境，exclude 生产环境，并形成 env-scope-review.md。不得修改任何环境配置。

## NROOT-096 真实歧义：两个来源

请 PM 组织读取 alpha.csv 与 beta.csv，并检查“原始数据”后形成 source-review.md。原文没有说明“原始数据”具体指哪一份文件；不得自行猜测。

## NROOT-097 真实歧义：两个报告

请 PM 组织读取 dev-report.md 与 ops-report.md，随后要求“复核该报告并提交”。“该报告”没有唯一指向，应保持未决。

## NROOT-098 真实歧义：版本选择

请 PM 按照 POLICY-X v1.2 或 v1.3 组织检查 policy.json 并形成 policy-review.md。未说明最终采用哪个版本，不得擅自选择。

## NROOT-099 真实歧义：审批逻辑

本任务要求只有王宁或李澄批准后才允许读取 snapshot.csv 并形成 snapshot-review.md，但没有说明是任一人批准即可还是两人共同批准，应保持审批条件未决。

## NROOT-100 真实歧义：代词

请 PM 组织检查 service-a.json 与 service-b.json，发现差异后要求“将它提交给 QA”。“它”的指向不唯一，应保持未决。

