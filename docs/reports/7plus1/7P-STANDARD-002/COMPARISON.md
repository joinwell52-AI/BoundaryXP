# 7P-STANDARD-002 逐项语义对照

所有比较引用原始 actual fact、node、relation、expression 和精确 Unicode 码点 span；JSON 保留完整引用。MATCH 是条目匹配，不能代替槽位或样本通过。MISSING 也包括只解析了一部分；未决不算错误的 RESOLVED。人工标准不因结果改写。

## SWAI-001

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:I0 **MISSING**：src/fcop/project.py 中：。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:I1 **MISSING**：对应 active 与 log/archive 的 task/report/issue 文件集合。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:I2 **MISSING**：三个对应测试文件。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:O0 **MISSING**：私有 helper `_existing_filenames_for_seq`。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:O1 **MISSING**：三个 writer 的 union-scan 修复。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:O2 **MISSING**：三个 `seq_skips_archived` 回归测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-001:A0 **MISSING**：新增 `_existing_filenames_for_seq`。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:A1 **MISSING**：write_task 同时扫描 tasks_dir + log/tasks。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:A2 **MISSING**：write_report 同时扫描 reports_dir + log/reports。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:A3 **MISSING**：write_issue 同时扫描 issues_dir + log/issues。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:A4 **MISSING**：新增三项 archived-basename sequence 回归测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:92c246c79bdf04d056266bc7 / UNRESOLVED：REQUIRED 拿到 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2483,2499) `应该拿到 002 而不是 001`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:19c5c64bab9bf7e1ab434754 / RESOLVED：三个 generator [PERFORMER] → **FALSE_DEFINED**。代码 generator 被标为任务执行主体，不是 ME。 来源 [1161,1200) `report 同型（archive_task 会连带 report 一起归档）`
- actual P1 / p1:76b45502565014965d186234 / RESOLVED：we [PERFORMER] → **WRONG_BINDING**。docstring 的 we 没有身份绑定到 ME；不能把未解析作者声音视为已确认执行者。 来源 [1601,1659) `into account and we never reuse a basename that is already`
- actual P2 / p1:f3872883a5c1522bdb0318ae / RESOLVED：本身 [PERFORMER] → **FALSE_DEFINED**。next_sequence 本身的‘本身’不是责任主体。 来源 [2208,2230) `\`next_sequence()\` 本身不变`
- actual P3 / p1:e44464edb90c6f6bfcf1e56d / RESOLVED：## [PERFORMER] → **FALSE_DEFINED**。Markdown ## 不是参与者。 来源 [2708,2713) `## 不做`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:V0 **MISSING**：ISSUE-20260427-003-ME.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:V1 **MISSING**：TASK-20260427-002-ADMIN-to-ME.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:V2 **MISSING**：src/fcop/project.py 对应现状代码位置。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:C0 **MISSING**：三份新测试通过。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:C1 **MISSING**：原有 587 passed 不退。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:C2 **MISSING**：ruff clean。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:C3 **MISSING**：两件人工 rename 文件不被误伤。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-001:B0 **MISSING**：FORBIDDEN 引入 `.archived/<id>.tombstone`。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:B1 **MISSING**：FORBIDDEN 修改 `next_sequence()` 本身语义。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:B2 **MISSING**：O_EXCL 原子预占逻辑保持不变。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-001:B3 **MISSING**：retry 限保持不变。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:5ce3463d43f4d249c999e410 / RESOLVED：FORBIDDEN reuse a basename → **WRONG_BINDING**。禁止复用的 basename 丢失 already on disk 与 project ledger 限定；当前 ITEM(a basename) 不能等价于 active/archive union 约束。 来源 [1601,1659) `into account and we never reuse a basename that is already`

## SWAI-002

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-002:I0 **MISSING**：7 份 spec/schemas/*.schema.json。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-002:I1 **MISSING**：src/fcop 相关 schema/review 模块。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-002:I2 **MISSING**：0.7.x legacy TASK/REPORT/ISSUE。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:I3 **MISSING**：tests 与 public surface snapshot。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual I0 / p1:886bedf0aa94c63b6cb5726f / RESOLVED：/schemas/ → **WRONG_BINDING**。spec/schemas/ 被截成 /schemas/，没有七份 *.schema.json 的集合范围。 来源 [2282,2307) `\`spec/schemas/\` 是**协议权威**`
- actual I1 / p1:2dfc0c49c78845be215aeb36 / RESOLVED：/jsonschema_validator.py → **FALSE_DEFINED**。待新增 validator 模块被归为已有输入，且路径丢失 core。 来源 [2400,2446) `### 决议 2 · \`core/jsonschema_validator.py\` 是新模块`
- actual I2 / p1:13a049c2b88f8cc2264fb456 / RESOLVED：/schema.py → **WRONG_BINDING**。core/schema.py 截为 /schema.py，未保留 src/fcop 模块范围。 来源 [2450,2501) `不要往 \`core/schema.py\` 上叠——按 ADR-0001 那个模块是**协议常量**模块`

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-002:O0 **MISSING**：JSON Schema validator。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O1 **MISSING**：wheel 内 bundled schemas。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O2 **MISSING**：REVIEW dataclass。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O3 **MISSING**：ReviewDecision / ReviewSubjectType。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O4 **MISSING**：Project.write_review/read_review/list_reviews/archive_review。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O5 **MISSING**：schema/review 测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O6 **MISSING**：public surface snapshot。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O7 **MISSING**：CHANGELOG。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:O8 **MISSING**：REPORT-004。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-002:A0 **MISSING**：bundle 7 schemas。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:A1 **MISSING**：实现 jsonschema validator。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:A2 **MISSING**：实现 REVIEW 全链。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:A3 **MISSING**：更新 public surface。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:A4 **MISSING**：完成测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:A5 **MISSING**：按 3 commit 收口。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:2dfe94461bde96f7724b65c2 / UNRESOLVED：PERMITTED 审 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1604,1621) `这样每个任务都 atomic 可审`
- actual A1 / p1:0f96c052da18d5b756b39af9 / UNRESOLVED：PERMITTED 发货 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [8931,8963) `(c) 新 envelope（REVIEW）可发货 [本任务发]`
- actual A2 / p1:9ffd6f1652a1476b3fef1a8b / UNRESOLVED：PERMITTED 使用 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [8976,9024) `协议**第一次**可端到端使用——而且把原 Issue #2 的头号请求 REVIEW 发出来了`

### P expected=RESOLVED actual=UNRESOLVED

- SWAI-002:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:6867a2420d0794f0f651073d / RESOLVED：那 [PERFORMER] → **WRONG_BINDING**。指示词那未绑定为 ME，却直接成为 RESOLVED PERFORMER。 来源 [603,648) `REPORT-003 §6 列了 6 个剩余种子（TASK-004 ~ TASK-008）`
- actual P1 / p1:c008f3e663684a93caf43f34 / RESOLVED：Event [PERFORMER] → **FALSE_DEFINED**。Event 抽象不是任务责任主体。 来源 [1453,1603) `**Boundary（ADR-0020 enforce）、Event（ADR-0018 watcher）、Failure（ADR-0019 API）、migrate-workspace（ADR-0022 CLI）各开独立后续任务** —— 分别为 TASK-005 / 006 / 007 / 008`
- actual P2 / p1:c465f6a7a88a9de2b5740468 / RESOLVED：Schema [PERFORMER] → **FALSE_DEFINED**。Schema 抽象不是任务责任主体。 来源 [1881,1909) `### 决议 1 · Schema 怎么打进 wheel`
- actual P3 / p1:0192377ff577909c26b29111 / UNRESOLVED：它们 [PERFORMER] → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2935,2967) `它们由 \`Project.write_review\` 等内部使用`
- actual P4 / p1:e86f3b375f7ea1f1898e48cc / RESOLVED：### [PERFORMER] → **FALSE_DEFINED**。Markdown ### 不是参与者。 来源 [3991,4027) `### 决议 4 · \`Project.write_review\` 签名`
- actual P5 / p1:48ea7c595f6dfa0999e0ddd7 / RESOLVED：schema [PERFORMER] → **FALSE_DEFINED**。schema 不是任务责任主体。 来源 [8347,8376) `那是 schema 写错了（I5 禁止破 0.7.x） |`
- actual P6 / p1:34120c3d5c847d16b90978d9 / RESOLVED：我 [PERFORMER] → **WRONG_BINDING**。ADMIN 引述中的我未建立说话者身份关系，不能当 ME。 来源 [9404,9408) `我会拒吗`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE

- actual R0 / p1:ed4a521676c884ef83812241 / RESOLVED：一 → **FALSE_DEFINED**。一次 CI 与一次 snapshot 的实施组合不是人工审定的 R；quantity target 又绑定到让。 来源 [1804,1843) `让 R1 和 R2 共用一次 CI 循环 + 一次 snapshot bump`
- actual R1 / p1:d084b3866ecb8630376b5bcf / RESOLVED：3 → **FALSE_DEFINED**。每 schema 三个测试用例是验收数量，不是本批 R 资源约束；target=用 不完整。 来源 [6485,6511) `每份 ≥ 3 用例（合法 / 缺必填 / 非法枚举）`
- actual R2 / p1:e2b8758f50f916b0cda56dd2 / RESOLVED：4.0 → **FALSE_DEFINED**。jsonschema>=4.0 是依赖版本，错误作为 R 数量，并绑定到用。 来源 [8378,8489) `| 测试时 \`referencing\` 库不可用 | 已经是 \`jsonschema>=4.0\` 的 transitive dep（TASK-003 R1 / commit 3c35e0e 加的）—— 任务开始前已确认 |`

### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-002:V0 **MISSING**：ADR-0015。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:V1 **MISSING**：ADR-0016。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:V2 **MISSING**：ADR-0017。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:V3 **MISSING**：ADR-0001。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:V4 **MISSING**：ADR-0003。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-002:C0 **MISSING**：Acceptance A1–A10 全部满足。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:C1 **MISSING**：pytest 全绿后才 commit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-002:B0 **MISSING**：FORBIDDEN 把 validator 强制接入已有 write_task/write_report/write_issue。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:B1 **MISSING**：FORBIDDEN 实现 TASK-005～TASK-011 范围。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:B2 **MISSING**：FORBIDDEN 加入 v1.2 REVIEW 特性。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:B3 **MISSING**：FORBIDDEN 修改已有 dataclass 字段类型。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-002:B4 **MISSING**：public surface 不得出现 deleted/renamed。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:b540177b53ce1fc5325c9c3f / RESOLVED：FORBIDDEN 写 hook → **WRONG_BINDING**。局部不写自定义 hook 被泛化为不写所有 hook，丢失自定义限定；不是五条人工 B 的等价覆盖。 来源 [8296,8308) `不写自定义 hook |`

## SWAI-003

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-003:I0 **MISSING**：failure.schema.json。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:I1 **MISSING**：models.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:I2 **MISSING**：core/recovery.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:I3 **MISSING**：project.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:I4 **MISSING**：failure/recovery 测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:I5 **MISSING**：ADR-0019。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual I0 / p1:74ea6a0d8e52d28fcd5d4168 / RESOLVED：/7 → **FALSE_DEFINED**。3/7 进度比例被截成 /7 路径并作为输入。 来源 [7582,7618) `v1.0 7 抽象进度跨过 3/7（Failure 是后两个里风险大头）`

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-003:O0 **MISSING**：Failure / Recovery dataclasses。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O1 **MISSING**：FailureType / RecoveryAction / SessionRecoveryAction。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O2 **MISSING**：5 类 recovery reference implementation。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O3 **MISSING**：Project.report_failure。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O4 **MISSING**：Project.apply_recovery。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O5 **MISSING**：Project.recover_session。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O6 **MISSING**：event stub。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:O7 **MISSING**：ADR/REPORT 更新。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-003:A0 **MISSING**：实现 Failure/Recovery 模型。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:A1 **MISSING**：实现五类恢复。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:A2 **MISSING**：支持两类 session_id。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:A3 **MISSING**：recover_session 支持 resume/rollback/abort。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:A4 **MISSING**：schema 对齐。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:A5 **MISSING**：测试/public surface/ADR/REPORT 收口。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- actual A0 / p1:a9f01e7d8aea61e62adcb925 / UNRESOLVED：REQUIRED why → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [618,643) `## 1 · 为什么需要这个任务（why now）`
- actual A1 / p1:62eb45b0fb4d94418940fda8 / UNRESOLVED：REQUIRED 执行 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3230,3232) `执行`
- actual A2 / p1:d0d781731611bed30220709b / RESOLVED：PERMITTED 观察 test_project_report_failure → **WRONG_BINDING**。stub 事件可被测试观察，输出却以测试函数为观察对象并赋予 PERMITTED；没有实现/验证事件 stub 的动作结构。 来源 [5137,5187) `触发 stub 事件可被测试观察 | \`test_project_report_failure\` |`
- actual A3 / p1:ce2fc7a0381f9d730f8f19cd / UNRESOLVED：PERMITTED 拒 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5720,5790) `| A9 | session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒`
- actual A4 / p1:672f3a6d12e40af9e3f9a5c6 / RESOLVED：REQUIRED 后剩 → **FALSE_DEFINED**。完成后剩的片段后剩被同时作为谓词和对象，不能成为已确认动作。 来源 [7619,7623) `完成后剩`

### P expected=RESOLVED actual=UNRESOLVED

- SWAI-003:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:35294147c7c9a05a74b45812 / RESOLVED：### [PERFORMER] → **FALSE_DEFINED**。Markdown ### 不是参与者。 来源 [3582,3636) `### 决议 5 · \`session_id\` 形状与 0.7.x 历史 \`session_id\` 字段对齐`
- actual P1 / p1:608e285a3d30996aa65bfc6b / UNRESOLVED：它们 [PERFORMER] → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3142,3164) `它们走 \`report_failure\` 的`
- actual P2 / p1:34be56790362caeb2bd5ff52 / UNRESOLVED：这 [PERFORMER] → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3237,3251) `这意味着 v1.0 公开面：`
- actual P3 / p1:4f66c5e6a9e9c041991620af / RESOLVED：RETRY 计数 [PERFORMER] → **FALSE_DEFINED**。RETRY 计数不是任务责任主体。 来源 [4422,4481) `- RETRY 计数防无限重试 → host adapter 责任（per ADR §open-question 3）`
- actual P4 / p1:1a7e77460d14ca559db0c579 / RESOLVED：ESCALATE [PERFORMER] → **FALSE_DEFINED**。ESCALATE 枚举不是任务责任主体。 来源 [5720,5790) `| A9 | session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒`
- actual P5 / p1:983f4fc6f4a1a96f1da81c92 / RESOLVED：diff [PERFORMER] → **FALSE_DEFINED**。diff 不是任务责任主体。 来源 [7029,7041) `diff 全 added`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE

- actual R0 / p1:92008a67485d6f4c8d4c371e / RESOLVED：1 → **FALSE_DEFINED**。五类 Recovery 各至少一个测试用例不是本批 R；目标绑定为读。 来源 [5229,5289) `action=None)\` 5 类 Recovery 各 ≥ 1 用例（RETRY/RESUME/ROLLBACK 只读`
- actual R1 / p1:0997bc5e1ea2011c6b8fd619 / RESOLVED：8 → **FALSE_DEFINED**。八个单测用例不是本批 R 资源约束。 来源 [5548,5594) `不依赖 Project）单测 | \`test_core_recovery\` ≥ 8 用例 |`
- actual R2 / p1:d7b60fbfb49239186eef9874 / RESOLVED：12 → **FALSE_DEFINED**。十二个测试用例不是本批 R；数量目标被截为用。 来源 [6322,6440) `\`tests/test_fcop/test_core_recovery.py\`（≥ 12 用例） | \`feat(core): failure & recovery dataclasses + 5 类 reference impl\` |`
- actual R3 / p1:20fc0d9a5595b938c692029b / RESOLVED：10 → **FALSE_DEFINED**。十个测试用例不是本批 R；数量目标被截为用。 来源 [6543,6593) `\`tests/test_fcop/test_project_failure.py\`（≥ 10 用例）`

### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-003:V0 **MISSING**：ADR-0019。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:V1 **MISSING**：ADR-0015。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:V2 **MISSING**：failure.schema.json。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual V0 / p1:0e4a2fe5897402536a9759e0 / RESOLVED：ADR-0003 → **ADMIN_ADJUDICATION_CONFLICT**。原文明确写符合 ADR-0003；人工 V 清单未列 ADR-0003。保留双方原样，交 ADMIN 确认是否有意省略；不据此认定该引用是幻造。 来源 [7042,7055) `符合 ADR-0003 |`

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-003:C0 **MISSING**：A1–A12 全部满足。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:C1 **MISSING**：四个 commit 完成。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-003:B0 **MISSING**：Failure/Recovery 不写成文件 envelope。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-003:B1 **MISSING**：ROLLBACK 不实际执行 git revert。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:B2 **MISSING**：不实现真实 Event 推送。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:B3 **MISSING**：recover_session 不接受 RETRY / ESCALATE。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:B4 **MISSING**：不实现 DRIFT 自动检测。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:B5 **MISSING**：不实现完整 LLM session。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-003:B6 **MISSING**：不做 MIGRATION-1.0.md 本任务外内容。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:b6145629b8b33b441fafd1c3 / RESOLVED：FORBIDDEN 写 盘 → **WRONG_BINDING**。core/recovery reference implementation 的不写盘，丢失局部模块主体；不能泛化为整个任务不写盘。 来源 [1534,1537) `不写盘`
- actual B1 / p1:1fa7fedf5bbaf1606ba6c288 / RESOLVED：FORBIDDEN 抛 异常 → **WRONG_BINDING**。局部返回/幂等行为的不抛异常，丢失操作及重复调用范围；不是全局禁止所有异常。 来源 [7535,7541) `不抛异常 |`

## SWAI-004

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-004:I0 **MISSING**：legacy docs/agents workspace。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:I1 **MISSING**：目标 fcop/ workspace。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:I2 **MISSING**：fcop CLI。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:I3 **MISSING**：git tracked/untracked workspace 路径。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:I4 **MISSING**：advisory files。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-004:O0 **MISSING**：`fcop migrate-workspace`。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:O1 **MISSING**：dry-run/apply 能力。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:O2 **MISSING**：MIGRATED_FROM_DOCS_AGENTS.md breadcrumb。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:O3 **MISSING**：测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:O4 **MISSING**：ADR/REPORT 更新。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual O0 / p1:ea334c6999700973d55ae1af / RESOLVED：dry-run → **WRONG_BINDING**。dry-run summary 的标记被单独当交付物，不等价于 dry-run/apply 能力。 来源 [1785,1840) `输出 \`[dry-run]\` summary 含 source/target/strategy/entries`
- actual O1 / p1:50f22925320b34ed85fc5e1b / RESOLVED：/target/strategy/entries → **FALSE_DEFINED**。summary 字段 source/target/strategy/entries 被截成路径交付物。 来源 [1785,1840) `输出 \`[dry-run]\` summary 含 source/target/strategy/entries`
- actual O2 / p1:e18e09c3b9ce8305644219de / RESOLVED：ABORT → **WRONG_BINDING**。both-exist 分支的 ABORT 控制结果被无条件当交付物。 来源 [2043,2053) `输出 \`ABORT\``

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-004:A0 **MISSING**：实现 migrate-workspace 子命令。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:A1 **MISSING**：默认 dry-run。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:A2 **MISSING**：--apply 才移动。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:A3 **MISSING**：tracked path 使用 git mv。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:A4 **MISSING**：非 tracked 使用 fallback。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:A5 **MISSING**：advisor scan。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:A6 **MISSING**：保持 bare fcop legacy 行为。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:8e82381481a63c9c7c61d858 / UNRESOLVED：REQUIRED why → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [563,588) `## 1 · 为什么需要这个任务（why now）`
- actual A1 / p1:3a732519ecd9223b20b5288f / UNRESOLVED：PERMITTED 发现 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1417,1470) `| 6 | 留痕文件 \`MIGRATED_FROM_DOCS_AGENTS.md\` | 可发现 + 可回滚`
- actual A2 / p1:bf6c05748525eeb9f05433e0 / RESOLVED：REQUIRED 输出 dry-run、/target/strategy/entries → **WRONG_BINDING**。局部 summary 输出的字段列表被路径化，缺默认 dry-run 与 apply 才移动的组合结构。 来源 [1785,1840) `输出 \`[dry-run]\` summary 含 source/target/strategy/entries`
- actual A3 / p1:7b0f92e36f5fa8f0935a98d7 / UNRESOLVED：PERMITTED 见 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1948,1963) `\`git status\` 可见`
- actual A4 / p1:eb5c65a4bf771fd073057a30 / RESOLVED：REQUIRED 输出 ABORT → **WRONG_BINDING**。输出 ABORT 没有 both-exist 条件，也没有 exit 2 与不动盘联结。 来源 [2043,2053) `输出 \`ABORT\``
- actual A5 / p1:33b902f10ac4773b81e7289c / UNRESOLVED：PERMITTED 收口 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2515,2529) `3 commits 即可收口`

### P expected=RESOLVED actual=UNRESOLVED

- SWAI-004:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:04cfe3a1ab6b85fa0ea38937 / UNRESOLVED：这 [PERFORMER] → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [665,714) `这是 v1.0 把默认 workspace 从 \`docs/agents/\` 迁到 \`fcop/\``
- actual P1 / p1:af4366e8ded4d50c773f2364 / RESOLVED：apply [PERFORMER] → **FALSE_DEFINED**。--apply 开关不是参与者。 来源 [1168,1189) `\`--apply\` 才动盘 | UX 防呆`
- actual P2 / p1:e1968c0e9b25365849fc6927 / RESOLVED：fcop [PERFORMER] → **FALSE_DEFINED**。fcop CLI 名称不是 ME 执行主体。 来源 [2119,2167) `✅ bare \`fcop\`（无 subcommand）仍打印 0.5→0.6 legacy 信息`
- actual P3 / p1:ca7e1232c1ced45a8473c7cb / RESOLVED：legacy test [PERFORMER] → **FALSE_DEFINED**。legacy test 不是参与者。 来源 [2257,2354) `| R1 | CLI 模块 + migrate_workspace.py + 25 测试 + entry point bump + legacy test 放宽 | \`feat(cli):\` |`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-004:V0 **MISSING**：ADR-0022。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:V1 **MISSING**：ADR-0015。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-004:C0 **MISSING**：8 条 acceptance criteria 全部满足。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=UNRESOLVED

- SWAI-004:B0 **MISSING**：dry-run 不得修改磁盘。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:B1 **MISSING**：both-exist 必须 ABORT / exit 2 / 不动盘。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:B2 **MISSING**：advisor scan 不得自动修改 .gitignore/README 等。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-004:B3 **MISSING**：不实现 Project Phase 2。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-004:B4 **MISSING**：不新增 runtime dependency。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:59db589e5b2e7c96a5dbbbbb / RESOLVED：FORBIDDEN 依赖 Project → **WRONG_BINDING**。不依赖 Project 改造被泛化为禁止依赖 Project；没有 Phase 2 范围。 来源 [811,828) `不依赖 \`Project\` 改造）`
- actual B1 / p1:483010f7c986fc664bae3c41 / UNRESOLVED：FORBIDDEN 依赖 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [995,1016) `不依赖 Project 改造 | 范围控制`
- actual B2 / p1:978eb5eda2c6df95a496c3c8 / RESOLVED：FORBIDDEN 动 盘 → **WRONG_BINDING**。不动盘丢失 both-exist 分支条件；与 --apply 合法移动的条件边界不等价。 来源 [2039,2042) `不动盘`

## SWAI-005

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-005:I0 **MISSING**：fcop-mcp write-side 工具集合。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:I1 **MISSING**：project binding state。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:I2 **MISSING**：project_dir。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:I3 **MISSING**：fcop_report()。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:I4 **MISSING**：MCP tool schemas。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:I5 **MISSING**：USER HOME / system root path classes。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual I0 / p1:135c6b0512ff0e0a82780503 / RESOLVED：**:deny-list 跨 Windows / Unix 覆盖 + 测试通过 → **FALSE_DEFINED**。D2 实施验收标题被作为输入对象，并包含 Markdown 残片。 来源 [4019,4065) `**D2 实施**:deny-list 跨 Windows / Unix 覆盖 + 测试通过`
- actual I1 / p1:81acd4d590cb2f7431989131 / RESOLVED：**:测试套件 → **FALSE_DEFINED**。D5 测试验收标题被作为输入对象，并包含 Markdown 残片。 来源 [4159,4186) `**D5 实施**:测试套件 6 类用例全 GREEN`

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-005:O0 **MISSING**：explicit binding guard。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:O1 **MISSING**：protected-path deny-list。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:O2 **MISSING**：fcop_report project_path warning。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:O3 **MISSING**：schema binding_required 标记。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:O4 **MISSING**：回归测试。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:O5 **MISSING**：1.4 release notes / upgrade 提示。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-005:A0 **MISSING**：所有 write-side 工具增加 explicit binding guard。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-005:A1 **MISSING**：protected root 检查。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-005:A2 **MISSING**：report warning。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:A3 **MISSING**：schema metadata。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:A4 **MISSING**：测试。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-005:A5 **MISSING**：PM #50 reproduction。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:3ea36ee4fde8e694b5b5f9ae / RESOLVED：REQUIRED Run set_project_dir → **WRONG_BINDING**。面向工具用户的错误提示 Run set_project_dir 被当本任务执行动作；本任务要求实现 binding guard。 来源 [2969,2989) `Run set_project_dir(`
- actual A1 / p1:9f169441e0c72878f24ed70d / UNRESOLVED：REQUIRED 覆盖 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3375,3394) `### D5 · 测试用例(必须覆盖)`
- actual A2 / p1:0058ebc9dca0035f2c2861c6 / RESOLVED：REQUIRED 调 set_project_dir → **FALSE_DEFINED**。可能需要先调被升为 REQUIRED 调，改变源模态和适用层。 来源 [3841,3865) `可能需要先调 \`set_project_dir\``
- actual A3 / p1:958f3e5a0e76f56eba5c8d78 / RESOLVED：REQUIRED **:deny-list 跨 Windows / Unix 覆盖 + 测试通过 → **WRONG_BINDING**。deny-list 实施内容有部分支持，但谓词/对象合成了 Markdown ** 残片；没有 protected root 操作与局部参数绑定。 来源 [4019,4065) `**D2 实施**:deny-list 跨 Windows / Unix 覆盖 + 测试通过`
- actual A4 / p1:d340c958edaf4e1763d1e1e9 / RESOLVED：REQUIRED **:测试套件 → **WRONG_BINDING**。测试内容有部分支持，但 **:测试套件 被当完整动作；没有测试谓词及六类范围。 来源 [4159,4186) `**D5 实施**:测试套件 6 类用例全 GREEN`
- actual A5 / p1:ed6b655a6b795e4ed7fdf641 / RESOLVED：PERMITTED 打到 老脚本 → **FALSE_DEFINED**。风险可能打到老脚本是可能后果，不是 PERMITTED 执行动作。 来源 [4321,4366) `- **风险 R1**:Breaking-ish 行为变化可能打到老脚本(已有用户脚本可能`
- actual A6 / p1:adf4a6b334f81ee38cd9fbd0 / UNRESOLVED：PERMITTED 做 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5151,5160) `理论上可以慢慢做)`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-005:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:efad78d552072ad55edaf6b8 / RESOLVED：unbound_report [PERFORMER] → **FALSE_DEFINED**。unbound_report 软件工具不是任务执行主体。 来源 [1117,1177) `> "typical symptom: unbound_report shows a project path like`
- actual P1 / p1:67063f44168f96ead773a1fb / RESOLVED：WARNING [PERFORMER] → **FALSE_DEFINED**。WARNING 日志级别不是参与者。 来源 [2866,2925) `⚠️  WARNING: project_path is set to a protected system path`
- actual P2 / p1:7db18c2d7f2a82976a790c2d / RESOLVED：ConfigError [PERFORMER] → **FALSE_DEFINED**。ConfigError 异常类不是参与者。 来源 [3626,3663) `→ ConfigError 不写盘(D1 兜底 D2 deny-list)`
- actual P3 / p1:4d436aef04a7c4b2d462395d / RESOLVED：我 [PERFORMER] → **WRONG_BINDING**。引述中的我没有绑定任务 ME 身份。 来源 [5164,5187) `我推荐 (A) —— 这是 P0 安全 bug`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-005:V0 **MISSING**：fcop-mcp 1.4。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:V1 **MISSING**：PM #50 事故证据。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=UNRESOLVED

- SWAI-005:C0 **MISSING**：D1～D6 全部完成。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:C1 **MISSING**：PM #50 复现被拒写。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:C2 **MISSING**：USER HOME 保持 0 污染。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:C3 **MISSING**：全测试绿。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual C0 / p1:8581818754c0ff99e66e7784 / UNRESOLVED：完成 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [4988,5013) `ME 立即开工(预计 2~3 小时完成 D1~D5`

### B expected=RESOLVED actual=UNRESOLVED

- SWAI-005:B0 **MISSING**：未 explicit bind 时 FORBIDDEN cwd fallback。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:B1 **MISSING**：project_dir 精确等于 USER HOME/system roots 时 FORBIDDEN write。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:B2 **MISSING**：home 下合法子目录不得被误伤。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-005:B3 **MISSING**：FORBIDDEN 全局污染。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:f6bfd4972bd78c7bfd6168fe / UNRESOLVED：FORBIDDEN 默认 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1485,1500) `不允许默认 cwd 兜底**:`

## SWAI-006

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:I0 **MISSING**：docs/release-process.md 阶段 4。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:I1 **MISSING**：docs/release-process.md 常见故障区域。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:O0 **MISSING**：阶段4 commit 指令修订。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:O1 **MISSING**：新增“问题7”。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:O2 **MISSING**：REPORT-20260513-002...。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:O3 **MISSING**：干净 main commit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:A0 **MISSING**：把 git add -A 改为显式路径。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:A1 **MISSING**：commit 前运行 git status --short。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:A2 **MISSING**：写事故与恢复说明。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-006:A3 **MISSING**：引用 4 个历史 commit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:A4 **MISSING**：本任务自身 dogfood 显式路径。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-006:A5 **MISSING**：push origin main。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:ff3e895667ba04aa64214703 / RESOLVED：REQUIRED 落 文件 → **PARTIAL_SUPPORT**。必须落文件保留一般模态，但缺具体事故恢复说明、REPORT 与文档对象，不能覆盖完整条目。 来源 [823,852) `必须落文件**——这正是 FCoP 的根原则(Rule 0`
- actual A1 / p1:5cab600d2ff76b4bc46a596d / RESOLVED：REQUIRED 用 显式路径 → **PARTIAL_SUPPORT**。显式路径 REQUIRED 正确，证据确在本任务 Dogfood 条款；但事实没有 git add 及 commit 阶段的类型/作用域，不能只凭证据文字补足 IR。 来源 [1898,1952) `- [ ] **Dogfood**:本任务的 commit 阶段 **必须用显式路径** \`git add\``

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:P1 **MISSING**：ADMIN [RECIPIENT]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:1e9885a9a3d722c6f069f900 / RESOLVED：自己 [PERFORMER] → **WRONG_BINDING**。历史事故叙述的自己未解析到当前 ME。 来源 [445,470) `我自己在 \`Step 4 闭环 commit\` 阶`
- actual P1 / p1:6427ca9625d0c0fdf590381e / RESOLVED：我 [PERFORMER] → **WRONG_BINDING**。历史叙述的我未解析到当前 ME。 来源 [748,773) `汇报里我提了一句"下次应在 SOP 里加这条规则"`
- actual P2 / p1:2e0ae2ec8fe0ef977e69285a / RESOLVED：push origin main [PERFORMER] → **FALSE_DEFINED**。push origin main 命令不是参与者。 来源 [2064,2089) `- [ ] push origin main 成功`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:V0 **MISSING**：d2ed13c。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:V1 **MISSING**：cc60186。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:V2 **MISSING**：979bcd2。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:V3 **MISSING**：dfe68e3。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-006:C0 **MISSING**：两处文档均完成。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:C1 **MISSING**：4 个 commit hash 都作为依据。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:C2 **MISSING**：REPORT 完成。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:C3 **MISSING**：staging 仅含预期 3 个文件。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:C4 **MISSING**：push main 成功。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=UNRESOLVED

- SWAI-006:B0 **MISSING**：FORBIDDEN `git add -A`。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:B1 **MISSING**：不动协议。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-006:B2 **MISSING**：不发版。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:aa05ff0973ea1cc3b05e0a3b / UNRESOLVED：FORBIDDEN 用 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [342,383) `不用 \`-A\`"写进 \`docs/release-process.md\`(带依据)`

## SWAI-007

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:I0 **MISSING**：D:\codeflow-3 的 FCoP 部署。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I1 **MISSING**：fcop.json。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I2 **MISSING**：FCoP 目录结构。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I3 **MISSING**：team docs。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I4 **MISSING**：TASK/REPORT/ISSUE 文件名与 frontmatter。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I5 **MISSING**：reciprocity/history/workspace。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:I6 **MISSING**：rules/协议版本状态。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual I0 / p1:b152293ff28928b26972062b / RESOLVED：/ADMIN.md → **FALSE_DEFINED**。源明确要求没有 roles/ADMIN.md，却产生正向 /ADMIN.md 输入对象；路径也被截断。 来源 [2361,2400) `- [ ] **没有** \`roles/ADMIN.md\`(ADMIN 是真人`

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:O0 **MISSING**：P0/P1/P2 分级合规审计报告。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-007:A0 **MISSING**：完成 A～I 全部只读检查。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:A1 **MISSING**：TASK/REPORT 只读文件名和 frontmatter。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:A2 **MISSING**：所有结论附事实依据。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:A3 **MATCH**：给出合规建议。局部语义等价（不是字面相等）；槽位整体另查状态、剩余条目和额外事实。
- SWAI-007:A4 **MISSING**：以显式 git add 路径提交报告。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:6794fe702067942615388de0 / UNRESOLVED：PERMITTED 定位 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [460,482) `但只有 \`codeflow-3\` 携带可定位`
- actual A1 / p1:09d059dde38e6def4d5294e7 / UNRESOLVED：PERMITTED 选 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2580,2582) `可选`
- actual A2 / p1:36c50ef96b340f105f063a81 / RESOLVED：REQUIRED 给出 建议 → **MATCH**。给出建议与人工给出合规建议为语义同义表达：REQUIRED、建议对象正确，唯一局部证据明确为合规审计报告中的建议。此条匹配不补 ME 角色，不补其他审计动作。 来源 [3824,3836) `需在报告中说明并给出建议`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:P1 **MISSING**：ADMIN [RECIPIENT]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:c2ab7964d7eb4dd1ceb5d139 / RESOLVED：FCoP [PERFORMER] → **FALSE_DEFINED**。FCoP 协议/部署不是任务责任主体。 来源 [341,365) `codeflow 项目的 FCoP 是否完全合规`
- actual P1 / p1:f310a7bce02e6a00f408723c / RESOLVED：roles [PERFORMER] → **FALSE_DEFINED**。roles 目录不是参与者。 来源 [2510,2571) `- [ ] roles 含 v1.0 新增的 \`layer\`(worker / governance / admin)字段`

### R expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:R0 **MISSING**：哑火判定阈值：>= 7 天无回应。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:V0 **MISSING**：fcop 1.1.0。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:V1 **MISSING**：rules 2.2.0。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:V2 **MISSING**：protocol commentary 2.0.0。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:V3 **MISSING**：文中对应 Rule / ADR。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-007:C0 **MISSING**：A～I 均检查。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:C1 **MISSING**：报告按 P0/P1/P2 分级。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:C2 **MISSING**：每条结论有路径+行号/字段。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:C3 **MISSING**：未验证项明确写 unverified。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=UNRESOLVED

- SWAI-007:B0 **MISSING**：FORBIDDEN 在 codeflow-3 写任何文件。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:B1 **MISSING**：FORBIDDEN 自命 codeflow.PM / codeflow.AUDITOR 等角色。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:B2 **MISSING**：FORBIDDEN 阅读 codeflow TASK/REPORT 正文。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-007:B3 **MISSING**：FORBIDDEN 把未验证内容写成确定事实。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:11cde9274587cfd46b6fd012 / UNRESOLVED：FORBIDDEN 落任 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1176,1193) `不在 codeflow 仓库下落任`
- actual B1 / p1:cceac6251cc22364507769bc / RESOLVED：FORBIDDEN 入 roles → **WRONG_BINDING**。ADMIN 是真人、不入 roles 的实体分类事实，被改为没有主体的任务禁止入 roles。 来源 [2401,2411) `不入 roles/)`
- actual B2 / p1:46ae206e95ca096877e2845b / RESOLVED：FORBIDDEN 冒充 ADMIN → **UNLISTED_SOURCE_SUPPORTED**。不冒充 ADMIN 在原文明确存在；人工 B 的禁止自命 PM/AUDITOR 与此范围不相同。不因未列 expected 就称其幻造，也不用于匹配整个角色禁止项。 来源 [3058,3070) `不冒充 \`ADMIN\`)`

## SWAI-008

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:I0 **MISSING**：src/fcop/project.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I1 **MISSING**：src/fcop/cli/_main.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I2 **MISSING**：src/fcop/cli/migrate_v3.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I3 **MISSING**：src/fcop/lifecycle/migrate.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I4 **MISSING**：src/fcop/lifecycle/state.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I5 **MISSING**：fcop/fcop.json。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I6 **MISSING**：CHANGELOG.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I7 **MISSING**：git log。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I8 **MISSING**：spec/fcop-3.0-spec.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:I9 **MISSING**：fcop/LETTER-TO-ADMIN.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:O0 **MISSING**：一份 REPORT-003。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:O1 **MISSING**：回答 Q1～Q4。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:O2 **MISSING**：Evidence。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:O3 **MISSING**：下一步建议。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:O4 **MISSING**：附带发现。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-008:A0 **MISSING**：调查 _lifecycle 由谁生成。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:A1 **MISSING**：调查本仓为何没有 _lifecycle。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:A2 **MISSING**：对比 spec 与实现。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:A3 **MISSING**：审查 LETTER 的 Rule 0.c 风险。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:A4 **MISSING**：给 ADMIN 下一步选项。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:4d1e2af814ee08050d483b48 / UNRESOLVED：REQUIRED 生成 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [545,574) `### Q1 · \`_lifecycle/\` 应该由谁生成`
- actual A1 / p1:38ae22a210df7f2c0b150642 / RESOLVED：REQUIRED 跑 python -m → **FALSE_DEFINED**。调查问题还是设计上必须 ADMIN 显式跑，被当当前任务必须跑命令；把待调查假设升级为执行要求。 来源 [776,831) `- 还是设计上必须 ADMIN 显式跑 \`python -m fcop migrate --to-v3\` 才落`
- actual A2 / p1:aac17cc8739b94f4832c1d24 / UNRESOLVED：REQUIRED review → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1171,1177) `review`
- actual A3 / p1:bf81c07ca1ac9bc1e7e77824 / UNRESOLVED：REQUIRED 包含 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1575,1587) `REPORT 必须包含：`
- actual A4 / p1:4cab0345f4a754f39be380a5 / UNRESOLVED：REQUIRED 决定 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1860,1879) `由 ADMIN 决定是否新开 TASK`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:P1 **MISSING**：ADMIN [RECIPIENT]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:2b1986a3f3af687c32027d6a / RESOLVED：## [PERFORMER] → **FALSE_DEFINED**。Markdown ## 不是参与者。 来源 [1882,1904) `## 引用 / Citations rule`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:V0 **MISSING**：spec/fcop-3.0-spec.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:V1 **MISSING**：Rule 0.c。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:V2 **MISSING**：当前实现及 migration 事实。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:C0 **MISSING**：Q1～Q4 各有结论+证据。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:C1 **MISSING**：下一步建议完整。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:C2 **MISSING**：查不到的明确写“未验证”。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-008:B0 **MISSING**：FORBIDDEN 修改任何 .md / .py 源文件。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-008:B1 **MISSING**：FORBIDDEN 现场修复附带发现。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-008:B2 **MISSING**：FORBIDDEN 猜测未知事实。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:2325e833ad73250cb699c0c1 / RESOLVED：FORBIDDEN 修改 任何 → **WRONG_BINDING**。禁止修改的任何被当单个对象；丢失 .md/.py 源文件类型集合，不能等价于全部源文件禁改。 来源 [487,502) `本任务**禁止**修改任何 \``

## SWAI-009

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:I0 **MISSING**：src/fcop/rules/_data/。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:I1 **MISSING**：agent-install-prompt.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:I2 **MISSING**：README.md / README.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:I3 **MISSING**：MCP resource registry。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:I4 **MISSING**：release_audit.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:I5 **MISSING**：inventory_drift.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:O0 **MISSING**：agent-bringup-prompt.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:O1 **MISSING**：agent-bringup-prompt.en.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:O2 **MISSING**：README 双语索引。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:O3 **MISSING**：可选 MCP resources。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:O4 **MISSING**：REPORT-006。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-009:A0 **MISSING**：编写 bringup prompt。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-009:A1 **MISSING**：环境检查。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A2 **MISSING**：升级目标版本。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A3 **MISSING**：区分 MCP 工具和 Python API。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-009:A4 **MISSING**：加 anti-pattern。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A5 **MISSING**：ADMIN 选择后初始化。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A6 **MISSING**：物理验证。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A7 **MISSING**：audit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A8 **MISSING**：README 索引。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:A9 **MISSING**：条件允许时注册 MCP resource。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:abd31aa3b8192139e67e89d6 / UNRESOLVED：REQUIRED 吸收 ** → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1138,1157) `这次野外失败必须**反向吸收**为一份`
- actual A1 / p1:d893ec14ef2bb38cbbc0e2a4 / UNRESOLVED：PERMITTED 写 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1283,1317) `并按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、`
- actual A2 / p1:7bccfdf3c49623bdd3ea62db / UNRESOLVED：REQUIRED 发挥 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1283,1317) `并按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、`
- actual A3 / p1:548a7bbf5e265bc819e6a5e7 / UNRESOLVED：REQUIRED 一致 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1914,1925) `- 两个版本号必须一致`
- actual A4 / p1:b7c19f47acb23b8db2667a7b / RESOLVED：REQUIRED 挂到 mcp.json、fcop-mcp → **WRONG_BINDING**。待编写 prompt 中的 MCP 使用前提被扁平化为本任务配置 MCP 动作，没有 prompt 产物层。 来源 [2095,2133) `必须先把 fcop-mcp 挂到 Cursor 的 mcp.json 才能用`
- actual A5 / p1:b444f0b29376b62f811ca79a / UNRESOLVED：PERMITTED 走 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2210,2253) `可以走 Python API 兜底：\`from fcop import Project`
- actual A6 / p1:933fc7f77ccc2b40e8c76e7d / RESOLVED：REQUIRED 一步**必须**报告 结果 → **PARTIAL_SUPPORT**。报告结果在原文真实存在，但不是不得自动跳下一步；谓词混入一步和 Markdown，缺报告后停的顺序边。 来源 [3106,3123) `- 每完成一步**必须**报告结果`
- actual A7 / p1:7dcb9038928977f5feba64c7 / UNRESOLVED：PERMITTED 解析 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [4083,4148) `✅ MCP 资源 \`fcop://prompt/bringup\` / \`fcop://prompt/bringup.en\` 可解析`
- actual A8 / p1:bc74746c7f7be2c49151baf2 / RESOLVED：REQUIRED 触发 drift → **FALSE_DEFINED**。新增 prompt 不应该触发 drift 被输出为 REQUIRED 触发 drift，极性相反。 来源 [4297,4319) `（新增 prompt 不应该触发 drift`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:P1 **MISSING**：ADMIN [RECIPIENT / DECISION_MAKER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:78b140b6abfa1baa1001dd0e / RESOLVED：二者 [PERFORMER] → **WRONG_BINDING**。二者没有绑定到责任主体身份。 来源 [1070,1076) `二者不混用）`
- actual P1 / p1:6ce7b073852f0deb7c6fca3b / RESOLVED：自己 [PERFORMER] → **WRONG_BINDING**。自己没有绑定到任务 ME 或 ADMIN。 来源 [2567,2620) `- ❌ 找不到 API 时自己想象 \`fcop.project.Project.init_project(`
- actual P2 / p1:3b715410bdeb1099ca9450eb / RESOLVED：### [PERFORMER] → **FALSE_DEFINED**。Markdown ### 不是参与者。 来源 [3627,3648) `### 不做 / Out of scope`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE


### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:V0 **MISSING**：Python >= 3.10。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:V1 **MISSING**：fcop 与 fcop-mcp 目标版本必须一致。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:V2 **MISSING**：3.0.2 lifecycle bug 作为验证依据。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:C0 **MISSING**：8 条 Acceptance Criteria 全满足。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-009:B0 **MISSING**：不改 agent-install-prompt.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B1 **MISSING**：不动 LETTER-TO-ADMIN.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B2 **MISSING**：不做工具层 anti-pattern 防呆。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B3 **MISSING**：不发新版本。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B4 **MISSING**：不改协议规则。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B5 **MISSING**：agent 每步不得自动跳下一步。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-009:B6 **MISSING**：不得猜 API。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-009:B7 **MISSING**：init 不得替 ADMIN 默认选择。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:5b218a07364ca8304b72f7e4 / RESOLVED：FORBIDDEN 在 本 → **WRONG_BINDING**。不在本 task 的范围声明被截成禁止在本，丢失排除对象。 来源 [4849,4857) `不在本 task`

## SWAI-010

STANDARD_PARSED_SAMPLE=false

### I expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-010:I0 **MISSING**：TASK-20260522-006。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:I1 **MISSING**：agent bringup prompt 相关文件。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:I2 **MISSING**：README。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:I3 **MISSING**：MCP resource registry。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:I4 **MISSING**：release_audit.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:I5 **MISSING**：inventory_drift.py。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual I0 / p1:777c8968e66fb914c07f644a / RESOLVED：/_lifecycle/ → **WRONG_BINDING**。初始化后五个目录必须存在是待验证状态，被归为现有输入；截断成 /_lifecycle/ 且未保留五个子目录。 来源 [4793,4845) `- \`fcop/_lifecycle/\` 下五个子目录**必须**全部存在（这是 3.0.2 修复重点）`

### O expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-010:O0 **MISSING**：修订版 agent-bringup-prompt.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O1 **MISSING**：修订版 agent-bringup-prompt.en.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O2 **MISSING**：两种场景表。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O3 **MISSING**：§1～§6。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O4 **MISSING**：README 索引。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O5 **MISSING**：可选 MCP resources。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O6 **MISSING**：REPORT-007。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:O7 **MISSING**：TASK-006/TASK-007 archive。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### A expected=RESOLVED actual=UNRESOLVED

- SWAI-010:A0 **MISSING**：使用不锁版本的升级方式。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:A1 **MISSING**：每步执行后报告并停。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:A2 **MISSING**：明确 MCP/Python API 边界。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:A3 **MISSING**：ADMIN 决定初始化模式。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:A4 **MISSING**：实际 ls 做物理验证。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:A5 **MISSING**：fcop_audit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:A6 **MISSING**：P0 非零时停止并报告。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:A7 **MISSING**：README 索引。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:A8 **MISSING**：两项 audit。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:A9 **MISSING**：archive 006+007。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual A0 / p1:b99203cc09fe1c28aa9d7644 / UNRESOLVED：REQUIRED 信 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [550,592) `**物理验证文件清单** — agent 必须 \`ls\` 实际目录而不是只信工具返回`
- actual A1 / p1:a7a058cf09b37267411b73c1 / UNRESOLVED：REQUIRED 停 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [598,637) `**P0 不为零必须停** — 体检报告有 P0 时 agent 不准自决整改`
- actual A2 / p1:0b8f9d9e976477687bbd93da / UNRESOLVED：REQUIRED 写 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1362,1372) `笨模型必须把每步写死`
- actual A3 / p1:bdd6efb1d38d9d2f5f590f72 / UNRESOLVED：PERMITTED 写 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1452,1485) `按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、`
- actual A4 / p1:7b4240ea99764347f5d82a5d / RESOLVED：REQUIRED 挂到 mcp.json、fcop-mcp → **WRONG_BINDING**。prompt 内 MCP 调用前提被当本任务无层级配置动作。 来源 [2776,2827) `| 必须先把 fcop-mcp 挂到 Cursor 的 mcp.json（重启 Cursor 后生效）`
- actual A5 / p1:47c99d25922014ee93a3334f / RESOLVED：REQUIRED 调 init_solo、ME → **WRONG_BINDING**。solo 模式被当 AGENT，role_code=ME 被当 PATIENT；init_solo 例子丢失 ADMIN 选择才初始化条件。 来源 [3297,3334) `solo 模式应调 \`init_solo(role_code="ME")\``
- actual A6 / p1:8ec2bab753217b33a72a3987 / UNRESOLVED：REQUIRED 生成 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3605,3644) `- ❌ 看到工具返回 OK 就当成功——必须**物理验证**目录是否真的生成了`
- actual A7 / p1:ea6d8dd490b156de41fb2c0c / UNRESOLVED：REQUIRED 验证 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [4230,4242) `所以必须 \`ls\` 验证`
- actual A8 / p1:718c929a030d6e248989d907 / RESOLVED：REQUIRED 输出贴 ls → **PARTIAL_SUPPORT**。贴实际 ls 输出是物理验证的一部分；输出贴不是实际执行 ls、检查五桶全部存在的完整动作。 来源 [4247,4290) `**应该看到的物理文件清单**（agent 把实际 \`ls\` 输出贴给 ADMIN）：`
- actual A9 / p1:c42c77717ba832c5f20e6a83 / UNRESOLVED：REQUIRED 存在 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [4793,4845) `- \`fcop/_lifecycle/\` 下五个子目录**必须**全部存在（这是 3.0.2 修复重点）`
- actual A10 / p1:530c05071b2d8ab150b0d8ba / UNRESOLVED：REQUIRED 停下 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5172,5196) `agent **必须停下**让 ADMIN 决策`
- actual A11 / p1:7c53058fe5098e67dafbcb20 / UNRESOLVED：PERMITTED 决定 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5225,5238) `ADMIN 可以决定先放着`
- actual A12 / p1:69f4caeddbd3667838b88643 / RESOLVED：REQUIRED 一步**必须**报告 结果 → **PARTIAL_SUPPORT**。保留每步报告内容但缺停及不得自动推进；不能把报告一半视为组合要求。 来源 [5333,5350) `- 每完成一步**必须**报告结果`
- actual A13 / p1:1b1dcc9455d23411f9397915 / UNRESOLVED：PERMITTED 选 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5706,5713) `资源注册可选）`

### P expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-010:P0 **MISSING**：ME [PERFORMER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:P1 **MISSING**：ADMIN [RECIPIENT / DECISION_MAKER]。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual P0 / p1:ea9cb8b6084098413918ad5a / RESOLVED：prompt [PERFORMER] → **FALSE_DEFINED**。prompt 产物不是任务参与者。 来源 [502,532) `**不锁版本号** — \`pip install\` 拉最新版`
- actual P1 / p1:036f925c8a3d792f05134591 / RESOLVED：自己 [PERFORMER] → **WRONG_BINDING**。自己没有绑定 ME 或 ADMIN 决策角色。 来源 [3490,3543) `- ❌ 找不到 API 时自己想象 \`fcop.project.Project.init_project(`
- actual P2 / p1:98c6d97de2dc086887eb37ff / RESOLVED：pip show fcop fcop-mcp [PERFORMER] → **FALSE_DEFINED**。pip show 命令不是参与者。 来源 [2076,2107) `pip show fcop fcop-mcp    # 看现状`
- actual P3 / p1:dcbeacc701cf862207e73d1c / RESOLVED：### [PERFORMER] → **FALSE_DEFINED**。Markdown ### 不是参与者。 来源 [5900,5921) `### 不做 / Out of scope`

### R expected=ABSENT actual=PARSER_COVERAGE_FAILURE

- actual R0 / p1:10416b749bd2afe3bbb73eb3 / RESOLVED：6 → **FALSE_DEFINED**。anti-pattern >=6 条是产物验收数量，不是本批 R；target=含 丢失清单对象。 来源 [6345,6401) `✅ §3 边界声明含 MCP 工具 vs Python API 对照表 + anti-pattern ≥ 6 条`

### V expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-010:V0 **MISSING**：TASK-20260522-006 为 superseded predecessor。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:V1 **MISSING**：Python >= 3.10。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:V2 **MISSING**：当前规则采用“最新版”，不是固定 package version。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### C expected=RESOLVED actual=PARSER_COVERAGE_FAILURE

- SWAI-010:C0 **MISSING**：9 条 Acceptance Criteria 全满足。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。

### B expected=RESOLVED actual=UNRESOLVED

- SWAI-010:B0 **MISSING**：TASK-006 中固定 `==3.0.2` 要求已 superseded，不再有效。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B1 **MISSING**：FORBIDDEN 写死 `==X.Y.Z`。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:B2 **MISSING**：不改 agent-install-prompt.zh.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B3 **MISSING**：不动 LETTER-TO-ADMIN.md。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B4 **MISSING**：不改协议。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B5 **MISSING**：不发版。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B6 **MISSING**：不做工具层防呆。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B7 **MISSING**：agent 不得自动进入下一步。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:B8 **MISSING**：不得默认 init。只存在部分内容或错误绑定，未达到整个条目的模态/角色/范围/条件/数量等价。
- SWAI-010:B9 **MISSING**：不得把工具返回 OK 当物理成功。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- SWAI-010:B10 **MISSING**：P0 != 0 时不得自行整改。冻结 actual 中没有已确认的完整等价条目；不能从未决/证据文本补出未生产的语义。
- actual B0 / p1:286bb1f34510886ef334a475 / RESOLVED：FORBIDDEN 区分 场景 → **FALSE_DEFINED**。升级方式不区分场景表示两类场景同样用升级命令，并非禁止区分场景；否定极性/模态被错误映射。 来源 [2508,2513) `不区分场景`
- actual B1 / p1:124b4ee99bd7feeb23326186 / UNRESOLVED：FORBIDDEN 在 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3063,3075) `不在 Python 包里`
- actual B2 / p1:53d0b5e3a851e249ada46211 / UNRESOLVED：FORBIDDEN 自决 → **UNRESOLVED_NOT_EQUIVALENT**。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5544,5549) `不自决整改`
- actual B3 / p1:30cb9fa5bb5d51042d40cc86 / RESOLVED：FORBIDDEN 写 X.Y.Z → **WRONG_BINDING**。禁止锁版本 ==X.Y.Z 丢失 == 运算符与锁定操作，变成禁止写任意版本字符串。 来源 [6326,6339) `不写 \`==X.Y.Z\`）`

