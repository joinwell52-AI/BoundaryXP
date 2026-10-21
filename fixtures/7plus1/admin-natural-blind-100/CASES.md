# ADMIN Natural Blind 100 · 021 Source Set

**Author:** ADMIN/ChatGPT, not the parser-development Codex.

**Purpose:** independent natural-language evaluation of the frozen 020 candidate.

**Important:** This file contains source tasks only. It is not a parser-derived artifact and must not be edited to accommodate parser output.

Cases ANB-001–ANB-095 are intended to be human-readable, mostly unambiguous ADMIN root-scope short tasks. ANB-096–ANB-100 are deliberate ambiguity controls where a correct parser should preserve unresolved semantics instead of guessing.

## ANB-001 服务状态核查

请 OPS 查看 test-services.json，核对测试环境中 6 个服务是否都处于预期状态，并生成 service-status.md。QA 复核报告后交给 PM；不得重启或停止任何服务。

## ANB-002 配置只读核对

DEV 读取 app-config.yaml 与 app-config.example.yaml，检查关键配置项是否一致，差异写入 config-review.md。只允许读取和记录，不得覆盖任一配置文件。

## ANB-003 证据清单检查

请审计员林乔检查 evidence-index.csv 中每条记录是否都有文件名、哈希和时间戳，生成 evidence-audit.md。缺少任一字段的条目必须单独列出，但不要补写原始记录。

## ANB-004 接口清单核查

DEV 查看 public-api.json，核对公开接口名称和版本标识，生成 api-audit.md。QA 只复核报告内容，不修改接口定义；PM 接收最终报告。

## ANB-005 日志只读排查

OPS 读取 gateway.log 和 gateway-error.log，定位过去 20 分钟内重复出现的 5xx 错误，并生成 gateway-notes.md。不得清理日志，也不得重启网关。

## ANB-006 依赖版本检查

DEV 检查 dependencies.lock 中的直接依赖版本，结果写入 dependency-review.md。范围不包含 transitive dependencies；不得执行升级或重新安装。

## ANB-007 构建结果核验

QA 读取 build-summary.json，确认主模块和两个插件的构建结果，生成 build-review.md。发现失败项时只记录原因，不得重新触发构建。

## ANB-008 文档链接检查

编辑周岚查看 README.md 与 docs/index.md 中的内部链接，生成 link-check.md。只记录失效链接，不修改任何 Markdown 文件。

## ANB-009 权限映射核查

安全员韩宁读取 role-map.csv 和 permission-map.csv，检查角色与权限的对应关系，输出 permission-audit.md。不得新增、删除或修改权限记录。

## ANB-010 快照一致性检查

OPS 比较 node-a.json 和 node-b.json 中的服务版本与启动参数，生成 node-diff.md。仅检查现有快照，不连接实际主机。

## ANB-011 发布说明审阅

QA 读取 release-note.md，检查版本号、变更摘要和回滚说明是否齐全，生成 release-note-review.md。不得发布版本，也不得修改 release-note.md。

## ANB-012 数据库脚本只读检查

DEV 查看 migration.sql，核查是否包含回滚段和事务边界，生成 migration-sql-review.md。不得连接数据库，不得执行脚本。

## ANB-013 备份清单核验

OPS 读取 backup-list.csv，检查所有条目的校验状态和生成时间，输出 backup-review.md。校验失败的条目单独列出；不得恢复或删除备份。

## ANB-014 测试结果审阅

QA 读取 unit-test.json 与 integration-test.json，统计失败用例并生成 test-review.md。不得重新运行测试，DEV 只负责对失败原因作文字说明。

## ANB-015 模型文件清单检查

DEV 查看 model-files.json，核对模型名称、文件路径和 SHA-256，生成 model-file-audit.md。不得加载权重，也不得启动推理。

## ANB-016 索引元数据核查

OPS 读取 index-meta.json，检查索引版本、分片数量和校验值，生成 index-meta-review.md。不得重建索引或重新计算向量。

## ANB-017 数据字段检查

分析员许宁读取 sample.csv，检查 id、timestamp、status 三列是否存在且非空，生成 sample-audit.md。不得修复或重写样本数据。

## ANB-018 API 变更记录

DEV 比较 api-before.json 与 api-after.json，生成 api-change.md，列出新增、移除和重命名的接口。这里只记录变化，不执行任何接口删除或改名。

## ANB-019 任务记录核查

PM 安排 DEV 检查 task-ledger.json 的状态记录是否完整，DEV 生成 task-ledger-review.md，QA 复核后由 PM 提交给 ADMIN。不得补造缺失历史。

## ANB-020 证书清单检查

OPS 读取 certs.csv，检查证书名称、域名和到期日，生成 cert-review.md。30 天内到期的证书要在报告中标注，但不得替换证书。

## ANB-021 按规范核验配置

DEV 依据 CFG-RULE-8 的 v2.3 版本读取 service.yaml，检查参数命名和默认值，生成 cfg-rule-review.md。不得修改 service.yaml。

## ANB-022 依据发布规范审阅

QA 按 RELEASE-CHECK-4 v1.7 检查 artifact.json 和 checksum.txt，生成 artifact-review.md。不得执行发布，也不得重新生成校验文件。

## ANB-023 安全规则核查

安全员方明依据 SEC-POLICY-12 的 v3.1 版本查看 scan-results.json，复核高危项，生成 security-audit.md。不得执行漏洞利用。

## ANB-024 英文规范核验

Using OPS-GUIDE-7 version v2.0, inspect host-state.json and create host-state-review.md. Do not change host settings or restart the host.

## ANB-025 规则版本绑定

请 DEV 依据 DATA-SPEC-5 v4.2 检查 dataset-index.csv 的字段定义，生成 dataset-spec-review.md。不得下载新数据。

## ANB-026 任务时限

OPS 检查 cache-status.json 并生成 cache-review.md，整个任务须在 25 分钟内完成。不得清空缓存或重启缓存服务。

## ANB-027 重试上限

DEV 对测试环境执行连接检查，单次检查失败时最多重试 4 次，并生成 connection-check.md。不得修改网络路由。

## ANB-028 内存上限

OPS 在测试环境运行一次健康检查，内存使用不得超过 1536 MB，输出 health-budget.md。不得切换到生产环境。

## ANB-029 时间窗口不是时限

OPS 查看最近 90 分钟的 audit.log，统计 error 与 warning 数量并生成 log-window.md。任务本身没有时间预算，不得删除日志。

## ANB-030 成功次数验收

OPS 最多尝试读取备份 6 次；至少 3 次读取成功且 backup-read.md 已生成时任务完成。不得写入备份。

## ANB-031 至少重试次数

在测试代理上执行探测，至少重试 2 次后再生成 probe-summary.md。不得修改代理配置。

## ANB-032 精确尝试次数

QA 对 sandbox 接口执行恰好 3 次可用性查询，并将结果写入 availability.md。不得调用生产接口。

## ANB-033 双数量目标

OPS 最多重试服务探测 5 次，且至少 2 次返回成功状态后生成 service-probe.md。不得重启服务。

## ANB-034 容量和时间同时存在

DEV 在 15 分钟内完成测试环境的模型健康检查，显存占用不得超过 4 GB，并生成 model-health.md。不得加载其他模型。

## ANB-035 分类阈值

QA 读取 coverage.json，低于 82% 的模块写入 coverage-risk.md。82% 是分类阈值，不得修改阈值或补测。

## ANB-036 条目数量属于内容

DEV 读取 issue-list.csv，生成 issue-summary.md，报告最多列出 20 个最高优先级问题。这个 20 不限制程序查询次数。

## ANB-037 重试与观察窗口

OPS 查看最近 10 分钟的 heartbeat.log；若读取失败，最多重试 3 次。生成 heartbeat-review.md，不得重启服务。

## ANB-038 英文时限

Inspect route-table.yaml and create route-review.md within 18 minutes. Do not edit the route table. Send the report to QA.

## ANB-039 英文重试下界

OPS must probe the test endpoint and retry at least 3 times before writing endpoint-probe.md. Do not change endpoint configuration.

## ANB-040 英文内存限制

Run a read-only model smoke check in staging with memory usage capped at 2 GB, then create smoke-note.md. Do not load a different model.

## ANB-041 协调者与执行者

PM 安排 DEV 读取 build-info.json 并生成 build-info-review.md；QA 复核报告，PM 最后提交给 ADMIN。PM 不负责具体检查。

## ANB-042 接收者不是审批者

DEV 生成 incident-review.md 后发送给平台主管陈洁。陈洁只是接收报告，不负责批准或复核；不得向外部邮箱发送。

## ANB-043 审批者与执行者分离

只有安全负责人刘靖批准后，QA 才能读取 prod-snapshot.json 并生成 prod-snapshot-review.md。刘靖不参与文件检查。

## ANB-044 复核后提交

OPS 生成 host-audit.md，QA 复核无遗漏后由 PM 提交给 ADMIN。OPS 不负责最终提交，ADMIN 仅作为接收者。

## ANB-045 说明者不是执行者

QA 检查 failure.json 并生成 failure-review.md；DEV 只解释失败原因，不修改实现。PM 汇总 QA 报告和 DEV 说明后提交给 ADMIN。

## ANB-046 可选动作

DEV 必须读取 package.json，可以查看 CHANGELOG.md，并生成 package-audit.md。不得修改这两个文件。

## ANB-047 无需动作

QA 检查 diff.csv；若没有差异，无需生成 difference.md，只向 PM 汇报“无差异”。不得修改 diff.csv。

## ANB-048 不要求修复

DEV 检查 parser-errors.json 并生成 parser-error-review.md，本任务不要求修复任何错误，也不得修改 Parser。

## ANB-049 不得审批

资料员叶澄生成 archive-list.md 并交给 PM。叶澄不负责审批归档，也不得删除任何历史文件。

## ANB-050 英文角色链

Nora reads service.csv and creates service-review.md. QA reviews the report, then Leo sends it to ADMIN. Nora is not an approver.

## ANB-051 条件停止

OPS 检查 service.log；若发现 critical 错误，立即停止检查并通知 PM，否则生成 service-summary.md。不得重启服务。

## ANB-052 条件输出

QA 查看 changes.csv。有差异时生成 change-report.md；没有差异时不生成文件，只向 PM 说明无差异。不得修改 changes.csv。

## ANB-053 恢复条件

OPS 检查 gateway.log。发现高危告警时停止；只有 PM 明确批准继续后才能恢复检查。最终生成 gateway-review.md。

## ANB-054 完成 AND

DEV 读取 items.csv 并生成 item-review.md。只有全部记录都检查完成且报告文件已生成，任务才完成。

## ANB-055 完成 OR

QA 执行测试环境连通性检查，主链路通过或备用链路通过时即可结束；两者都失败时通知 PM。不得调整路由。

## ANB-056 双检查均完成

QA 检查索引声明和约束声明，两类检查都完成后生成 schema-check.md。不得修改 schema.sql。

## ANB-057 复核作为提交前置

DEV 生成 api-review.md，只有 QA 确认报告包含所有删除和重命名接口后，PM 才能提交给 ADMIN。

## ANB-058 审批作为读取条件

未经负责人批准，不得读取 finance-snapshot.csv；批准后由 QA 读取并生成 finance-review.md。不得连接财务数据库。

## ANB-059 条件升级汇报

安全员周启检查 scan.json；若确认存在可利用漏洞，必须立即升级汇报给 PM。无论是否升级，都要生成 scan-review.md。

## ANB-060 英文条件链

Read health.log. If a fatal error appears, stop the inspection and notify PM; otherwise create health-summary.md. Do not restart the service.

## ANB-061 先后依赖

QA 先读取 qa-result.json 并生成 qa-note.md；PM 只能在 qa-note.md 生成后向 ADMIN 汇报。不得修改 qa-result.json。

## ANB-062 两输入完成后提交

DEV 读取 before.csv 和 after.csv 并生成 compare.md。QA 确认两份输入都已核对且报告已生成后，PM 提交报告。

## ANB-063 所有条目完成

OPS 读取 host-list.csv，逐项检查全部主机记录并生成 host-review.md。只有清单中的每项都有检查结果时才完成。

## ANB-064 至少数量完成

QA 审阅 10 个测试结果，至少 8 个结果完成复核且 qa-summary.md 已生成时任务完成。不得修改测试结果。

## ANB-065 复核内容条件

DEV 生成 license-review.md。QA 确认每个缺少许可证或来源不明的条目都已记录后，PM 才能发送报告。

## ANB-066 输出章节

请生成 rollback-note.md，文档必须包含“风险清单”“回滚前提”“验证步骤”三个章节。不得执行回滚。

## ANB-067 输出中的动作词

DEV 编写 operations-guide.md，文档中必须写明“重启服务前先确认维护窗口”。本任务不得实际重启服务。

## ANB-068 引用文字不执行

请生成 approval-record.md，并原样写入“已批准上线”。本任务不具有上线审批权限，也不得执行上线。

## ANB-069 报告分类内容

QA 生成 interface-review.md，报告必须分别列出新增接口、删除接口和重命名接口。不得修改接口定义。

## ANB-070 待确认标记

DEV 读取 license.csv 并生成 license-note.md。许可证范围不清楚的条目必须标记为“待确认”，不得自动判为可商用。

## ANB-071 输出中的停止条件

请编写 runbook.md，其中要说明“发现凭据泄露时停止处理并通知管理员”。编写文档不等于实际执行该停止流程。

## ANB-072 输出中的禁止词

生成 safety-guide.md，文档中必须包含“不得删除生产数据”这句话。本任务只交付文档，不访问生产数据。

## ANB-073 输出内数量

DEV 生成 top-risk.md，文档中只列出风险最高的 10 项。这个 10 是内容限制，不是重试次数。

## ANB-074 输出内条件分支

生成 deployment-guide.md，文档中说明：检查通过则继续部署，检查失败则停止。本任务不得实际部署。

## ANB-075 英文输出内容

Create operator-guide.md. The document must contain sections named “Risks” and “Rollback”. Do not perform a rollback.

## ANB-076 范围仅限测试环境

OPS 只检查测试环境的 service.yaml，生产环境不在本次范围内。生成 scope-review.md，不得修改任何配置。

## ANB-077 排除目录

DEV 检查 src 目录中的配置引用，但排除 src/legacy。结果写入 config-ref-review.md。不得删除 legacy 文件。

## ANB-078 包含与排除

QA 核对 active.csv 中的在用设备，已报废设备不包含在此次核对范围。生成 active-device-review.md。

## ANB-079 英文范围限制

Inspect only staging resources and exclude production resources from this review. Create staging-scope.md and make no configuration changes.

## ANB-080 只读限制

审计员查看 audit.db 的只读快照并生成 audit-snapshot.md。只允许离线读取，不得连接在线数据库。

## ANB-081 English simple audit

Read users.csv, verify that every active user has an owner, and create user-audit.md. Do not edit users.csv.

## ANB-082 English basis and time

Using SEC-CHECK-11 version v1.9, inspect findings.json and create findings-review.md within 22 minutes. Do not modify the findings.

## ANB-083 English role flow

Mia reads build.json and creates build-review.md. QA reviews the report before Noah sends it to ADMIN. Mia does not approve the release.

## ANB-084 English completion AND

Read inventory.csv and create inventory-review.md. The task is complete only when every item has been checked and the report exists.

## ANB-085 English optional read

You must read config.json, may inspect README.md, and must create config-note.md. Do not modify either file.

## ANB-086 English output content

Create incident-guide.md containing two sections: “Detection” and “Recovery”. Do not perform any recovery action.

## ANB-087 English retry count

Probe the staging endpoint at most 4 times and create probe-log.md. At least 2 probes must succeed before the task is complete.

## ANB-088 English exclusion scope

Review test-cluster.yaml only. Production clusters are outside the scope of this task. Create cluster-review.md.

## ANB-089 English conditional output

Inspect delta.csv. If differences exist, create delta-report.md; otherwise notify PM that there are no differences. Do not edit delta.csv.

## ANB-090 English approval guard

QA may read finance-export.csv only after Dana approves the request. Create finance-audit.md and do not connect to the production database.

## ANB-091 中英混合依据

DEV 按照 API-GUIDE-3 version v2.6 检查 api-map.json，生成 api-map-review.md。Do not modify api-map.json.

## ANB-092 中英混合流程

QA reads release.json 并生成 release-review.md；PM 在 QA review 通过后发送报告给 ADMIN。不得执行发布。

## ANB-093 中英混合数量

OPS 在 staging 执行 health probe，retry at least 2 times but no more than 5 times，生成 health-probe.md。不得重启服务。

## ANB-094 中英混合内容归属

请生成 incident-playbook.md，文档中必须写明 “stop processing and notify PM when credentials leak”。本任务只编写文档。

## ANB-095 中英混合范围

Inspect only 测试环境，exclude 生产环境，生成 env-scope-review.md。不得修改任何环境配置。

## ANB-096 真实歧义：两个输入后的泛称

DEV 读取 alpha.csv 和 beta.csv，然后检查“原始数据”并生成 source-review.md。这里“原始数据”未指明具体是哪一份文件；Parser 不应自行猜测。

## ANB-097 真实歧义：两个报告后的指代

QA 读取 dev-report.md 和 ops-report.md，随后要求“复核该报告并提交给 PM”。“该报告”没有唯一指向，必须保留未决而不是任选一份。

## ANB-098 真实歧义：两个版本

请按照 POLICY-X v1.2 或 v1.3 检查 policy.json 并生成 policy-review.md。未说明最终采用哪个版本，不得擅自选择。

## ANB-099 真实歧义：两个审批者

只有王宁或李澄批准后，QA 才能读取 snapshot.csv 并生成 snapshot-review.md。原文没有说明需要任一人还是两人共同批准，审批条件必须保持歧义。

## ANB-100 真实歧义：代词指向

DEV 检查 service-a.json 和 service-b.json，发现差异后“将它提交给 QA”。“它”可能指差异结果或其中一个服务对象，无法唯一确定时应保留未决。

