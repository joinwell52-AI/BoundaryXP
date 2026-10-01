# 7P-STANDARD-003：当前人工审定与冻结 actual 对照

分母9，SWAI-005 不计分。002 的数字是 provisional；旧文件未改。证据、fact、relation、scope/condition/quantity 全部沿用原 actual，未重跑。O 嵌入内容单独列，不当当前 A/P/B。

## SWAI-001 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:I0 **MISSING** src/fcop/project.py 中：。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:I1 **MISSING** 对应 active 与 log/archive 的 task/report/issue 文件集合。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:I2 **MISSING** 三个对应测试文件。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:O0 **MISSING** 私有 helper `_existing_filenames_for_seq`。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:O1 **MISSING** 三个 writer 的 union-scan 修复。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:O2 **MISSING** 三个 `seq_skips_archived` 回归测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual UNRESOLVED

- SWAI-001:A0 **MISSING** 新增 `_existing_filenames_for_seq`。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:A1 **MISSING** write_task 同时扫描 tasks_dir + log/tasks。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:A2 **MISSING** write_report 同时扫描 reports_dir + log/reports。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:A3 **MISSING** write_issue 同时扫描 issues_dir + log/issues。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:A4 **MISSING** 新增三项 archived-basename sequence 回归测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:92c246c79bdf04d056266bc7 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 拿到。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2483,2499) "应该拿到 002 而不是 001"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:19c5c64bab9bf7e1ab434754 RESOLVED / **FALSE_DEFINED**：三个 generator [PERFORMER]。代码 generator 被标为任务执行主体，不是 ME。 来源 [1161,1200) "report 同型（archive_task 会连带 report 一起归档）"
- actual P1 p1:76b45502565014965d186234 RESOLVED / **WRONG_BINDING**：we [PERFORMER]。docstring 的 we 没有身份绑定到 ME；不能把未解析作者声音视为已确认执行者。 来源 [1601,1659) "into account and we never reuse a basename that is already"
- actual P2 p1:f3872883a5c1522bdb0318ae RESOLVED / **FALSE_DEFINED**：本身 [PERFORMER]。next_sequence 本身的‘本身’不是责任主体。 来源 [2208,2230) "`next_sequence()` 本身不变"
- actual P3 p1:e44464edb90c6f6bfcf1e56d RESOLVED / **FALSE_DEFINED**：## [PERFORMER]。Markdown ## 不是参与者。 来源 [2708,2713) "## 不做"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE


### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:V0 **MISSING** ISSUE-20260427-003-ME.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:V1 **MISSING** TASK-20260427-002-ADMIN-to-ME.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:V2 **MISSING** src/fcop/project.py 对应现状代码位置。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:C0 **MISSING** 三份新测试通过。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:C1 **MISSING** 原有 587 passed 不退。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:C2 **MISSING** ruff clean。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:C3 **MISSING** 两件人工 rename 文件不被误伤。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-001:B0 **MISSING** FORBIDDEN 引入 `.archived/<id>.tombstone`。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:B1 **MISSING** FORBIDDEN 修改 `next_sequence()` 本身语义。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:B2 **MISSING** O_EXCL 原子预占逻辑保持不变。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-001:B3 **MISSING** retry 限保持不变。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:5ce3463d43f4d249c999e410 RESOLVED / **WRONG_BINDING**：FORBIDDEN reuse a basename。禁止复用的 basename 丢失 already on disk 与 project ledger 限定；当前 ITEM(a basename) 不能等价于 active/archive union 约束。 来源 [1601,1659) "into account and we never reuse a basename that is already"

## SWAI-002 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-002:I0 **MISSING** 7 份 spec/schemas/*.schema.json。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-002:I1 **MISSING** src/fcop 相关 schema/review 模块。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-002:I2 **MISSING** 0.7.x legacy TASK/REPORT/ISSUE。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:I3 **MISSING** tests 与 public surface snapshot。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual I0 p1:886bedf0aa94c63b6cb5726f RESOLVED / **WRONG_BINDING**：/schemas/。spec/schemas/ 被截成 /schemas/，没有七份 *.schema.json 的集合范围。 来源 [2282,2307) "`spec/schemas/` 是**协议权威**"
- actual I1 p1:2dfc0c49c78845be215aeb36 RESOLVED / **FALSE_DEFINED**：/jsonschema_validator.py。待新增 validator 模块被归为已有输入，且路径丢失 core。 来源 [2400,2446) "### 决议 2 · `core/jsonschema_validator.py` 是新模块"
- actual I2 p1:13a049c2b88f8cc2264fb456 RESOLVED / **WRONG_BINDING**：/schema.py。core/schema.py 截为 /schema.py，未保留 src/fcop 模块范围。 来源 [2450,2501) "不要往 `core/schema.py` 上叠——按 ADR-0001 那个模块是**协议常量**模块"

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-002:O0 **MISSING** JSON Schema validator。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O1 **MISSING** wheel 内 bundled schemas。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O2 **MISSING** REVIEW dataclass。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O3 **MISSING** ReviewDecision / ReviewSubjectType。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O4 **MISSING** Project.write_review/read_review/list_reviews/archive_review。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O5 **MISSING** schema/review 测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O6 **MISSING** public surface snapshot。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O7 **MISSING** CHANGELOG。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:O8 **MISSING** REPORT-004。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual UNRESOLVED

- SWAI-002:A0 **MISSING** bundle 7 schemas。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:A1 **MISSING** 实现 jsonschema validator。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:A2 **MISSING** 实现 REVIEW 全链。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:A3 **MISSING** 更新 public surface。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:A4 **MISSING** 完成测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:A5 **MISSING** 按 3 commit 收口。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:2dfe94461bde96f7724b65c2 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 审。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1604,1621) "这样每个任务都 atomic 可审"
- actual A1 p1:0f96c052da18d5b756b39af9 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 发货。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [8931,8963) "(c) 新 envelope（REVIEW）可发货 [本任务发]"
- actual A2 p1:9ffd6f1652a1476b3fef1a8b UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 使用。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [8976,9024) "协议**第一次**可端到端使用——而且把原 Issue #2 的头号请求 REVIEW 发出来了"

### P：RESOLVED / actual UNRESOLVED

- SWAI-002:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:6867a2420d0794f0f651073d RESOLVED / **WRONG_BINDING**：那 [PERFORMER]。指示词那未绑定为 ME，却直接成为 RESOLVED PERFORMER。 来源 [603,648) "REPORT-003 §6 列了 6 个剩余种子（TASK-004 ~ TASK-008）"
- actual P1 p1:c008f3e663684a93caf43f34 RESOLVED / **FALSE_DEFINED**：Event [PERFORMER]。Event 抽象不是任务责任主体。 来源 [1453,1603) "**Boundary（ADR-0020 enforce）、Event（ADR-0018 watcher）、Failure（ADR-0019 API）、migrate-workspace（ADR-0022 CLI）各开独立后续任务** —— 分别为 TASK-005 / 006 / 007 / 008"
- actual P2 p1:c465f6a7a88a9de2b5740468 RESOLVED / **FALSE_DEFINED**：Schema [PERFORMER]。Schema 抽象不是任务责任主体。 来源 [1881,1909) "### 决议 1 · Schema 怎么打进 wheel"
- actual P3 p1:0192377ff577909c26b29111 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：它们 [PERFORMER]。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2935,2967) "它们由 `Project.write_review` 等内部使用"
- actual P4 p1:e86f3b375f7ea1f1898e48cc RESOLVED / **FALSE_DEFINED**：### [PERFORMER]。Markdown ### 不是参与者。 来源 [3991,4027) "### 决议 4 · `Project.write_review` 签名"
- actual P5 p1:48ea7c595f6dfa0999e0ddd7 RESOLVED / **FALSE_DEFINED**：schema [PERFORMER]。schema 不是任务责任主体。 来源 [8347,8376) "那是 schema 写错了（I5 禁止破 0.7.x） |"
- actual P6 p1:34120c3d5c847d16b90978d9 RESOLVED / **WRONG_BINDING**：我 [PERFORMER]。ADMIN 引述中的我未建立说话者身份关系，不能当 ME。 来源 [9404,9408) "我会拒吗"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE

- actual R0 p1:ed4a521676c884ef83812241 RESOLVED / **FALSE_DEFINED**：一。一次 CI 与一次 snapshot 的实施组合不是人工审定的 R；quantity target 又绑定到让。 来源 [1804,1843) "让 R1 和 R2 共用一次 CI 循环 + 一次 snapshot bump"
- actual R1 p1:d084b3866ecb8630376b5bcf RESOLVED / **FALSE_DEFINED**：3。每 schema 三个测试用例是验收数量，不是本批 R 资源约束；target=用 不完整。 来源 [6485,6511) "每份 ≥ 3 用例（合法 / 缺必填 / 非法枚举）"
- actual R2 p1:e2b8758f50f916b0cda56dd2 RESOLVED / **FALSE_DEFINED**：4.0。jsonschema>=4.0 是依赖版本，错误作为 R 数量，并绑定到用。 来源 [8378,8489) "| 测试时 `referencing` 库不可用 | 已经是 `jsonschema>=4.0` 的 transitive dep（TASK-003 R1 / commit 3c35e0e 加的）—— 任务开始前已确认 |"

### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-002:V0 **MISSING** ADR-0015。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:V1 **MISSING** ADR-0016。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:V2 **MISSING** ADR-0017。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:V3 **MISSING** ADR-0001。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:V4 **MISSING** ADR-0003。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-002:C0 **MISSING** Acceptance A1–A10 全部满足。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:C1 **MISSING** pytest 全绿后才 commit。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-002:B0 **MISSING** FORBIDDEN 把 validator 强制接入已有 write_task/write_report/write_issue。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:B1 **MISSING** FORBIDDEN 实现 TASK-005～TASK-011 范围。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:B2 **MISSING** FORBIDDEN 加入 v1.2 REVIEW 特性。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:B3 **MISSING** FORBIDDEN 修改已有 dataclass 字段类型。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-002:B4 **MISSING** public surface 不得出现 deleted/renamed。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:b540177b53ce1fc5325c9c3f RESOLVED / **WRONG_BINDING**：FORBIDDEN 写 hook。局部不写自定义 hook 被泛化为不写所有 hook，丢失自定义限定；不是五条人工 B 的等价覆盖。 来源 [8296,8308) "不写自定义 hook |"

## SWAI-003 (r02)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-003:I0 **MISSING** failure.schema.json。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:I1 **MISSING** models.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:I2 **MISSING** core/recovery.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:I3 **MISSING** project.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:I4 **MISSING** failure/recovery 测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:I5 **MISSING** ADR-0019。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual I0 p1:74ea6a0d8e52d28fcd5d4168 RESOLVED / **FALSE_DEFINED**：/7。3/7 进度比例被截成 /7 路径并作为输入。 来源 [7582,7618) "v1.0 7 抽象进度跨过 3/7（Failure 是后两个里风险大头）"

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-003:O0 **MISSING** Failure / Recovery dataclasses。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O1 **MISSING** FailureType / RecoveryAction / SessionRecoveryAction。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O2 **MISSING** 5 类 recovery reference implementation。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O3 **MISSING** Project.report_failure。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O4 **MISSING** Project.apply_recovery。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O5 **MISSING** Project.recover_session。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O6 **MISSING** event stub。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:O7 **MISSING** ADR/REPORT 更新。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual UNRESOLVED

- SWAI-003:A0 **MISSING** 实现 Failure/Recovery 模型。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:A1 **MISSING** 实现五类恢复。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:A2 **MISSING** 支持两类 session_id。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:A3 **MISSING** recover_session 支持 resume/rollback/abort。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:A4 **MISSING** schema 对齐。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:A5 **MISSING** 测试/public surface/ADR/REPORT 收口。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- actual A0 p1:a9f01e7d8aea61e62adcb925 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED why。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [618,643) "## 1 · 为什么需要这个任务（why now）"
- actual A1 p1:62eb45b0fb4d94418940fda8 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 执行。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3230,3232) "执行"
- actual A2 p1:d0d781731611bed30220709b RESOLVED / **WRONG_BINDING**：PERMITTED 观察 test_project_report_failure。stub 事件可被测试观察，输出却以测试函数为观察对象并赋予 PERMITTED；没有实现/验证事件 stub 的动作结构。 来源 [5137,5187) "触发 stub 事件可被测试观察 | `test_project_report_failure` |"
- actual A3 p1:ce2fc7a0381f9d730f8f19cd UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 拒。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5720,5790) "| A9 | session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒"
- actual A4 p1:672f3a6d12e40af9e3f9a5c6 RESOLVED / **FALSE_DEFINED**：REQUIRED 后剩。完成后剩的片段后剩被同时作为谓词和对象，不能成为已确认动作。 来源 [7619,7623) "完成后剩"

### P：RESOLVED / actual UNRESOLVED

- SWAI-003:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:35294147c7c9a05a74b45812 RESOLVED / **FALSE_DEFINED**：### [PERFORMER]。Markdown ### 不是参与者。 来源 [3582,3636) "### 决议 5 · `session_id` 形状与 0.7.x 历史 `session_id` 字段对齐"
- actual P1 p1:608e285a3d30996aa65bfc6b UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：它们 [PERFORMER]。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3142,3164) "它们走 `report_failure` 的"
- actual P2 p1:34be56790362caeb2bd5ff52 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：这 [PERFORMER]。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [3237,3251) "这意味着 v1.0 公开面："
- actual P3 p1:4f66c5e6a9e9c041991620af RESOLVED / **FALSE_DEFINED**：RETRY 计数 [PERFORMER]。RETRY 计数不是任务责任主体。 来源 [4422,4481) "- RETRY 计数防无限重试 → host adapter 责任（per ADR §open-question 3）"
- actual P4 p1:1a7e77460d14ca559db0c579 RESOLVED / **FALSE_DEFINED**：ESCALATE [PERFORMER]。ESCALATE 枚举不是任务责任主体。 来源 [5720,5790) "| A9 | session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒"
- actual P5 p1:983f4fc6f4a1a96f1da81c92 RESOLVED / **FALSE_DEFINED**：diff [PERFORMER]。diff 不是任务责任主体。 来源 [7029,7041) "diff 全 added"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE

- actual R0 p1:92008a67485d6f4c8d4c371e RESOLVED / **FALSE_DEFINED**：1。五类 Recovery 各至少一个测试用例不是本批 R；目标绑定为读。 来源 [5229,5289) "action=None)` 5 类 Recovery 各 ≥ 1 用例（RETRY/RESUME/ROLLBACK 只读"
- actual R1 p1:0997bc5e1ea2011c6b8fd619 RESOLVED / **FALSE_DEFINED**：8。八个单测用例不是本批 R 资源约束。 来源 [5548,5594) "不依赖 Project）单测 | `test_core_recovery` ≥ 8 用例 |"
- actual R2 p1:d7b60fbfb49239186eef9874 RESOLVED / **FALSE_DEFINED**：12。十二个测试用例不是本批 R；数量目标被截为用。 来源 [6322,6440) "`tests/test_fcop/test_core_recovery.py`（≥ 12 用例） | `feat(core): failure & recovery dataclasses + 5 类 reference impl` |"
- actual R3 p1:20fc0d9a5595b938c692029b RESOLVED / **FALSE_DEFINED**：10。十个测试用例不是本批 R；数量目标被截为用。 来源 [6543,6593) "`tests/test_fcop/test_project_failure.py`（≥ 10 用例）"

### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-003:V0 **MISSING** ADR-0019。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:V1 **MISSING** ADR-0015。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:V2 **MISSING** failure.schema.json。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:V3 **MATCH** ADR-0003。ADMIN 003 已接受 ADR-0003。actual 是 RESOLVED BASELINE，BASIS 指向 REFERENCE ADR-0003，证据为符合 ADR-0003；内容/依据绑定正确，计条目 MATCH。原冲突已关闭。
- actual V0 p1:0e4a2fe5897402536a9759e0 RESOLVED / **MATCH**：ADR-0003。ADMIN 003 已接受 ADR-0003。actual 是 RESOLVED BASELINE，BASIS 指向 REFERENCE ADR-0003，证据为符合 ADR-0003；内容/依据绑定正确，计条目 MATCH。原冲突已关闭。 来源 [7042,7055) "符合 ADR-0003 |"

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-003:C0 **MISSING** A1–A12 全部满足。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:C1 **MISSING** 四个 commit 完成。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-003:B0 **MISSING** Failure/Recovery 不写成文件 envelope。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-003:B1 **MISSING** ROLLBACK 不实际执行 git revert。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:B2 **MISSING** 不实现真实 Event 推送。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:B3 **MISSING** recover_session 不接受 RETRY / ESCALATE。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:B4 **MISSING** 不实现 DRIFT 自动检测。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:B5 **MISSING** 不实现完整 LLM session。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-003:B6 **MISSING** 不做 MIGRATION-1.0.md 本任务外内容。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:b6145629b8b33b441fafd1c3 RESOLVED / **WRONG_BINDING**：FORBIDDEN 写 盘。core/recovery reference implementation 的不写盘，丢失局部模块主体；不能泛化为整个任务不写盘。 来源 [1534,1537) "不写盘"
- actual B1 p1:1fa7fedf5bbaf1606ba6c288 RESOLVED / **WRONG_BINDING**：FORBIDDEN 抛 异常。局部返回/幂等行为的不抛异常，丢失操作及重复调用范围；不是全局禁止所有异常。 来源 [7535,7541) "不抛异常 |"

## SWAI-004 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-004:I0 **MISSING** legacy docs/agents workspace。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:I1 **MISSING** 目标 fcop/ workspace。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:I2 **MISSING** fcop CLI。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:I3 **MISSING** git tracked/untracked workspace 路径。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:I4 **MISSING** advisory files。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-004:O0 **MISSING** `fcop migrate-workspace`。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:O1 **MISSING** dry-run/apply 能力。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:O2 **MISSING** MIGRATED_FROM_DOCS_AGENTS.md breadcrumb。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:O3 **MISSING** 测试。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:O4 **MISSING** ADR/REPORT 更新。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual O0 p1:ea334c6999700973d55ae1af RESOLVED / **WRONG_BINDING**：dry-run。dry-run summary 的标记被单独当交付物，不等价于 dry-run/apply 能力。 来源 [1785,1840) "输出 `[dry-run]` summary 含 source/target/strategy/entries"
- actual O1 p1:50f22925320b34ed85fc5e1b RESOLVED / **FALSE_DEFINED**：/target/strategy/entries。summary 字段 source/target/strategy/entries 被截成路径交付物。 来源 [1785,1840) "输出 `[dry-run]` summary 含 source/target/strategy/entries"
- actual O2 p1:e18e09c3b9ce8305644219de RESOLVED / **WRONG_BINDING**：ABORT。both-exist 分支的 ABORT 控制结果被无条件当交付物。 来源 [2043,2053) "输出 `ABORT`"

### A：RESOLVED / actual UNRESOLVED

- SWAI-004:A0 **MISSING** 实现 migrate-workspace 子命令。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:A1 **MISSING** 默认 dry-run。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:A2 **MISSING** --apply 才移动。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:A3 **MISSING** tracked path 使用 git mv。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:A4 **MISSING** 非 tracked 使用 fallback。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:A5 **MISSING** advisor scan。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:A6 **MISSING** 保持 bare fcop legacy 行为。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:8e82381481a63c9c7c61d858 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED why。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [563,588) "## 1 · 为什么需要这个任务（why now）"
- actual A1 p1:3a732519ecd9223b20b5288f UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 发现。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1417,1470) "| 6 | 留痕文件 `MIGRATED_FROM_DOCS_AGENTS.md` | 可发现 + 可回滚"
- actual A2 p1:bf6c05748525eeb9f05433e0 RESOLVED / **WRONG_BINDING**：REQUIRED 输出 dry-run、/target/strategy/entries。局部 summary 输出的字段列表被路径化，缺默认 dry-run 与 apply 才移动的组合结构。 来源 [1785,1840) "输出 `[dry-run]` summary 含 source/target/strategy/entries"
- actual A3 p1:7b0f92e36f5fa8f0935a98d7 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 见。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1948,1963) "`git status` 可见"
- actual A4 p1:eb5c65a4bf771fd073057a30 RESOLVED / **WRONG_BINDING**：REQUIRED 输出 ABORT。输出 ABORT 没有 both-exist 条件，也没有 exit 2 与不动盘联结。 来源 [2043,2053) "输出 `ABORT`"
- actual A5 p1:33b902f10ac4773b81e7289c UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 收口。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2515,2529) "3 commits 即可收口"

### P：RESOLVED / actual UNRESOLVED

- SWAI-004:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:04cfe3a1ab6b85fa0ea38937 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：这 [PERFORMER]。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [665,714) "这是 v1.0 把默认 workspace 从 `docs/agents/` 迁到 `fcop/`"
- actual P1 p1:af4366e8ded4d50c773f2364 RESOLVED / **FALSE_DEFINED**：apply [PERFORMER]。--apply 开关不是参与者。 来源 [1168,1189) "`--apply` 才动盘 | UX 防呆"
- actual P2 p1:e1968c0e9b25365849fc6927 RESOLVED / **FALSE_DEFINED**：fcop [PERFORMER]。fcop CLI 名称不是 ME 执行主体。 来源 [2119,2167) "✅ bare `fcop`（无 subcommand）仍打印 0.5→0.6 legacy 信息"
- actual P3 p1:ca7e1232c1ced45a8473c7cb RESOLVED / **FALSE_DEFINED**：legacy test [PERFORMER]。legacy test 不是参与者。 来源 [2257,2354) "| R1 | CLI 模块 + migrate_workspace.py + 25 测试 + entry point bump + legacy test 放宽 | `feat(cli):` |"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE


### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-004:V0 **MISSING** ADR-0022。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:V1 **MISSING** ADR-0015。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-004:C0 **MISSING** 8 条 acceptance criteria 全部满足。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual UNRESOLVED

- SWAI-004:B0 **MISSING** dry-run 不得修改磁盘。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:B1 **MISSING** both-exist 必须 ABORT / exit 2 / 不动盘。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:B2 **MISSING** advisor scan 不得自动修改 .gitignore/README 等。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-004:B3 **MISSING** 不实现 Project Phase 2。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-004:B4 **MISSING** 不新增 runtime dependency。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:59db589e5b2e7c96a5dbbbbb RESOLVED / **WRONG_BINDING**：FORBIDDEN 依赖 Project。不依赖 Project 改造被泛化为禁止依赖 Project；没有 Phase 2 范围。 来源 [811,828) "不依赖 `Project` 改造）"
- actual B1 p1:483010f7c986fc664bae3c41 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：FORBIDDEN 依赖。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [995,1016) "不依赖 Project 改造 | 范围控制"
- actual B2 p1:978eb5eda2c6df95a496c3c8 RESOLVED / **WRONG_BINDING**：FORBIDDEN 动 盘。不动盘丢失 both-exist 分支条件；与 --apply 合法移动的条件边界不等价。 来源 [2039,2042) "不动盘"

## SWAI-006 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:I0 **MISSING** docs/release-process.md 阶段 4。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:I1 **MISSING** docs/release-process.md 常见故障区域。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:O0 **MISSING** 阶段4 commit 指令修订。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:O1 **MISSING** 新增“问题7”。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:O2 **MISSING** REPORT-20260513-002...。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:O3 **MISSING** 干净 main commit。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:A0 **MISSING** 把 git add -A 改为显式路径。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:A1 **MISSING** commit 前运行 git status --short。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:A2 **MISSING** 写事故与恢复说明。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-006:A3 **MISSING** 引用 4 个历史 commit。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:A4 **MISSING** 本任务自身 dogfood 显式路径。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-006:A5 **MISSING** push origin main。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:ff3e895667ba04aa64214703 RESOLVED / **PARTIAL_SUPPORT**：REQUIRED 落 文件。必须落文件保留一般模态，但缺具体事故恢复说明、REPORT 与文档对象，不能覆盖完整条目。 来源 [823,852) "必须落文件**——这正是 FCoP 的根原则(Rule 0"
- actual A1 p1:5cab600d2ff76b4bc46a596d RESOLVED / **PARTIAL_SUPPORT**：REQUIRED 用 显式路径。显式路径 REQUIRED 正确，证据确在本任务 Dogfood 条款；但事实没有 git add 及 commit 阶段的类型/作用域，不能只凭证据文字补足 IR。 来源 [1898,1952) "- [ ] **Dogfood**:本任务的 commit 阶段 **必须用显式路径** `git add`"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:P1 **MISSING** ADMIN [RECIPIENT]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:1e9885a9a3d722c6f069f900 RESOLVED / **WRONG_BINDING**：自己 [PERFORMER]。历史事故叙述的自己未解析到当前 ME。 来源 [445,470) "我自己在 `Step 4 闭环 commit` 阶"
- actual P1 p1:6427ca9625d0c0fdf590381e RESOLVED / **WRONG_BINDING**：我 [PERFORMER]。历史叙述的我未解析到当前 ME。 来源 [748,773) "汇报里我提了一句\"下次应在 SOP 里加这条规则\""
- actual P2 p1:2e0ae2ec8fe0ef977e69285a RESOLVED / **FALSE_DEFINED**：push origin main [PERFORMER]。push origin main 命令不是参与者。 来源 [2064,2089) "- [ ] push origin main 成功"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE


### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:V0 **MISSING** d2ed13c。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:V1 **MISSING** cc60186。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:V2 **MISSING** 979bcd2。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:V3 **MISSING** dfe68e3。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-006:C0 **MISSING** 两处文档均完成。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:C1 **MISSING** 4 个 commit hash 都作为依据。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:C2 **MISSING** REPORT 完成。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:C3 **MISSING** staging 仅含预期 3 个文件。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:C4 **MISSING** push main 成功。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual UNRESOLVED

- SWAI-006:B0 **MISSING** FORBIDDEN `git add -A`。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:B1 **MISSING** 不动协议。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-006:B2 **MISSING** 不发版。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:aa05ff0973ea1cc3b05e0a3b UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：FORBIDDEN 用。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [342,383) "不用 `-A`\"写进 `docs/release-process.md`(带依据)"

## SWAI-007 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:I0 **MISSING** D:\codeflow-3 的 FCoP 部署。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I1 **MISSING** fcop.json。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I2 **MISSING** FCoP 目录结构。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I3 **MISSING** team docs。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I4 **MISSING** TASK/REPORT/ISSUE 文件名与 frontmatter。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I5 **MISSING** reciprocity/history/workspace。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:I6 **MISSING** rules/协议版本状态。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual I0 p1:b152293ff28928b26972062b RESOLVED / **FALSE_DEFINED**：/ADMIN.md。源明确要求没有 roles/ADMIN.md，却产生正向 /ADMIN.md 输入对象；路径也被截断。 来源 [2361,2400) "- [ ] **没有** `roles/ADMIN.md`(ADMIN 是真人"

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:O0 **MISSING** P0/P1/P2 分级合规审计报告。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual UNRESOLVED

- SWAI-007:A0 **MISSING** 完成 A～I 全部只读检查。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:A1 **MISSING** TASK/REPORT 只读文件名和 frontmatter。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:A2 **MISSING** 所有结论附事实依据。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:A3 **MATCH** 给出合规建议。给出建议与人工给出合规建议为语义同义表达：REQUIRED、建议对象正确，唯一局部证据明确为合规审计报告中的建议。此条匹配不补 ME 角色，不补其他审计动作。
- SWAI-007:A4 **MISSING** 以显式 git add 路径提交报告。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:6794fe702067942615388de0 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 定位。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [460,482) "但只有 `codeflow-3` 携带可定位"
- actual A1 p1:09d059dde38e6def4d5294e7 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 选。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [2580,2582) "可选"
- actual A2 p1:36c50ef96b340f105f063a81 RESOLVED / **MATCH**：REQUIRED 给出 建议。给出建议与人工给出合规建议为语义同义表达：REQUIRED、建议对象正确，唯一局部证据明确为合规审计报告中的建议。此条匹配不补 ME 角色，不补其他审计动作。 来源 [3824,3836) "需在报告中说明并给出建议"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:P1 **MISSING** ADMIN [RECIPIENT]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:c2ab7964d7eb4dd1ceb5d139 RESOLVED / **FALSE_DEFINED**：FCoP [PERFORMER]。FCoP 协议/部署不是任务责任主体。 来源 [341,365) "codeflow 项目的 FCoP 是否完全合规"
- actual P1 p1:f310a7bce02e6a00f408723c RESOLVED / **FALSE_DEFINED**：roles [PERFORMER]。roles 目录不是参与者。 来源 [2510,2571) "- [ ] roles 含 v1.0 新增的 `layer`(worker / governance / admin)字段"

### R：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:R0 **MISSING** 哑火判定阈值：>= 7 天无回应。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:V0 **MISSING** fcop 1.1.0。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:V1 **MISSING** rules 2.2.0。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:V2 **MISSING** protocol commentary 2.0.0。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:V3 **MISSING** 文中对应 Rule / ADR。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-007:C0 **MISSING** A～I 均检查。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:C1 **MISSING** 报告按 P0/P1/P2 分级。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:C2 **MISSING** 每条结论有路径+行号/字段。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:C3 **MISSING** 未验证项明确写 unverified。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual UNRESOLVED

- SWAI-007:B0 **MISSING** FORBIDDEN 在 codeflow-3 写任何文件。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:B1 **MISSING** FORBIDDEN 自命 codeflow.PM / codeflow.AUDITOR 等角色。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:B2 **MISSING** FORBIDDEN 阅读 codeflow TASK/REPORT 正文。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-007:B3 **MISSING** FORBIDDEN 把未验证内容写成确定事实。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:11cde9274587cfd46b6fd012 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：FORBIDDEN 落任。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1176,1193) "不在 codeflow 仓库下落任"
- actual B1 p1:cceac6251cc22364507769bc RESOLVED / **WRONG_BINDING**：FORBIDDEN 入 roles。ADMIN 是真人、不入 roles 的实体分类事实，被改为没有主体的任务禁止入 roles。 来源 [2401,2411) "不入 roles/)"
- actual B2 p1:46ae206e95ca096877e2845b RESOLVED / **UNLISTED_SOURCE_SUPPORTED**：FORBIDDEN 冒充 ADMIN。不冒充 ADMIN 在原文明确存在；人工 B 的禁止自命 PM/AUDITOR 与此范围不相同。不因未列 expected 就称其幻造，也不用于匹配整个角色禁止项。 来源 [3058,3070) "不冒充 `ADMIN`)"

## SWAI-008 (r01)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:I0 **MISSING** src/fcop/project.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I1 **MISSING** src/fcop/cli/_main.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I2 **MISSING** src/fcop/cli/migrate_v3.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I3 **MISSING** src/fcop/lifecycle/migrate.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I4 **MISSING** src/fcop/lifecycle/state.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I5 **MISSING** fcop/fcop.json。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I6 **MISSING** CHANGELOG.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I7 **MISSING** git log。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I8 **MISSING** spec/fcop-3.0-spec.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:I9 **MISSING** fcop/LETTER-TO-ADMIN.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:O0 **MISSING** 一份 REPORT-003。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:O1 **MISSING** 回答 Q1～Q4。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:O2 **MISSING** Evidence。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:O3 **MISSING** 下一步建议。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:O4 **MISSING** 附带发现。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### A：RESOLVED / actual UNRESOLVED

- SWAI-008:A0 **MISSING** 调查 _lifecycle 由谁生成。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:A1 **MISSING** 调查本仓为何没有 _lifecycle。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:A2 **MISSING** 对比 spec 与实现。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:A3 **MISSING** 审查 LETTER 的 Rule 0.c 风险。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:A4 **MISSING** 给 ADMIN 下一步选项。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:4d1e2af814ee08050d483b48 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 生成。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [545,574) "### Q1 · `_lifecycle/` 应该由谁生成"
- actual A1 p1:38ae22a210df7f2c0b150642 RESOLVED / **FALSE_DEFINED**：REQUIRED 跑 python -m。调查问题还是设计上必须 ADMIN 显式跑，被当当前任务必须跑命令；把待调查假设升级为执行要求。 来源 [776,831) "- 还是设计上必须 ADMIN 显式跑 `python -m fcop migrate --to-v3` 才落"
- actual A2 p1:aac17cc8739b94f4832c1d24 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED review。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1171,1177) "review"
- actual A3 p1:bf81c07ca1ac9bc1e7e77824 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 包含。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1575,1587) "REPORT 必须包含："
- actual A4 p1:4cab0345f4a754f39be380a5 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 决定。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1860,1879) "由 ADMIN 决定是否新开 TASK"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:P1 **MISSING** ADMIN [RECIPIENT]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:2b1986a3f3af687c32027d6a RESOLVED / **FALSE_DEFINED**：## [PERFORMER]。Markdown ## 不是参与者。 来源 [1882,1904) "## 引用 / Citations rule"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE


### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:V0 **MISSING** spec/fcop-3.0-spec.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:V1 **MISSING** Rule 0.c。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:V2 **MISSING** 当前实现及 migration 事实。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:C0 **MISSING** Q1～Q4 各有结论+证据。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:C1 **MISSING** 下一步建议完整。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:C2 **MISSING** 查不到的明确写“未验证”。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-008:B0 **MISSING** FORBIDDEN 修改任何 .md / .py 源文件。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-008:B1 **MISSING** FORBIDDEN 现场修复附带发现。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-008:B2 **MISSING** FORBIDDEN 猜测未知事实。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:2325e833ad73250cb699c0c1 RESOLVED / **WRONG_BINDING**：FORBIDDEN 修改 任何。禁止修改的任何被当单个对象；丢失 .md/.py 源文件类型集合，不能等价于全部源文件禁改。 来源 [487,502) "本任务**禁止**修改任何 `"

## SWAI-009 (r02)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:I0 **MISSING** src/fcop/rules/_data/。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:I1 **MISSING** agent-install-prompt.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:I2 **MISSING** README.md / README.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:I3 **MISSING** MCP resource registry。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:I4 **MISSING** release_audit.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:I5 **MISSING** inventory_drift.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:O0 **MISSING** agent-bringup-prompt.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O1 **MISSING** agent-bringup-prompt.en.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O2 **MISSING** README 双语索引。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O3 **MISSING** 条件允许时的 MCP resource 注册。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O4 **MISSING** REPORT-006。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O5 **MISSING** TASK-006 archive。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:O:OCR-01 **MISSING** 环境检查。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-02 **MISSING** 版本检查/升级说明。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-03 **MISSING** MCP 工具 vs Python API 边界。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-04 **MISSING** anti-pattern 清单。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-05 **MISSING** ADMIN 选择初始化模式。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-06 **MISSING** 初始化后物理验证。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-07 **MISSING** audit 流程。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-08 **MISSING** 每一步报告后停下。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-09 **MISSING** 不确定时读文档而非猜 API。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-009:O:OCR-10 **MISSING** init 不替 ADMIN 默认选择。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。

### A：RESOLVED / actual UNRESOLVED

- SWAI-009:A0 **MISSING** 编写 zh bringup prompt。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A1 **MISSING** 编写 en bringup prompt。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A2 **MISSING** 在 README.md / README.zh.md 增加索引。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A3 **MISSING** 运行 release_audit.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A4 **MISSING** 运行 inventory_drift.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A5 **MISSING** 写 REPORT-006。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A6 **MISSING** archive TASK-006。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:A7 **MISSING** 注册 MCP resources。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:abd31aa3b8192139e67e89d6 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 吸收 **。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1138,1157) "这次野外失败必须**反向吸收**为一份"
- actual A1 p1:d893ec14ef2bb38cbbc0e2a4 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 写。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1283,1317) "并按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、"
- actual A2 p1:7bccfdf3c49623bdd3ea62db UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 发挥。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1283,1317) "并按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、"
- actual A3 p1:548a7bbf5e265bc819e6a5e7 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 一致。版本一致属于 OUTPUT_CONTENT 的 V，未决片段不作为当前 TASK 动作计分。 来源 [1914,1925) "- 两个版本号必须一致"
- actual A4 p1:b7c19f47acb23b8db2667a7b RESOLVED / **WRONG_BINDING**：REQUIRED 挂到 mcp.json、fcop-mcp。MCP 使用前提属于待编写 prompt 的内容。actual 无 OUTPUT_CONTENT 归属而进入当前 A；不能作为编写 prompt 或当前配置 MCP 的 MATCH。 来源 [2095,2133) "必须先把 fcop-mcp 挂到 Cursor 的 mcp.json 才能用"
- actual A5 p1:b444f0b29376b62f811ca79a UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：PERMITTED 走。Python API 兜底是未来 workflow 内容，未决片段不能补当前 TASK A。 来源 [2210,2253) "可以走 Python API 兜底：`from fcop import Project"
- actual A6 p1:933fc7f77ccc2b40e8c76e7d RESOLVED / **WRONG_BINDING**：REQUIRED 一步**必须**报告 结果。未来 agent 每步报告后停下是 O 内容约束；actual 扁平化为当前 REQUIRED 报告动作，且没有停的组合结构。 来源 [3106,3123) "- 每完成一步**必须**报告结果"
- actual A7 p1:7dcb9038928977f5feba64c7 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 解析。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [4083,4148) "✅ MCP 资源 `fcop://prompt/bringup` / `fcop://prompt/bringup.en` 可解析"
- actual A8 p1:bc74746c7f7be2c49151baf2 RESOLVED / **FALSE_DEFINED**：REQUIRED 触发 drift。新增 prompt 不应该触发 drift 被输出为 REQUIRED 触发 drift，极性相反。 来源 [4297,4319) "（新增 prompt 不应该触发 drift"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:78b140b6abfa1baa1001dd0e RESOLVED / **WRONG_BINDING**：二者 [PERFORMER]。二者没有绑定到责任主体身份。 来源 [1070,1076) "二者不混用）"
- actual P1 p1:6ce7b073852f0deb7c6fca3b RESOLVED / **WRONG_BINDING**：自己 [PERFORMER]。自己没有绑定到任务 ME 或 ADMIN。 来源 [2567,2620) "- ❌ 找不到 API 时自己想象 `fcop.project.Project.init_project("
- actual P2 p1:3b715410bdeb1099ca9450eb RESOLVED / **FALSE_DEFINED**：### [PERFORMER]。Markdown ### 不是参与者。 来源 [3627,3648) "### 不做 / Out of scope"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE


### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:V0 **MISSING** Python >= 3.10。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:V1 **MISSING** fcop 与 fcop-mcp 目标版本一致。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-009:V2 **MISSING** 3.0.2 lifecycle bug。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:C0 **MISSING** 原 8 条 Acceptance Criteria 全部满足。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-009:B0 **MISSING** 不改 agent-install-prompt.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:B1 **MISSING** 不动 LETTER-TO-ADMIN.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:B2 **MISSING** 不做工具层 anti-pattern 防呆。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:B3 **MISSING** 不发新版本。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-009:B4 **MISSING** 不改协议规则。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:5b218a07364ca8304b72f7e4 RESOLVED / **WRONG_BINDING**：FORBIDDEN 在 本。不在本 task 的范围声明被截成禁止在本，丢失排除对象。 来源 [4849,4857) "不在本 task"

## SWAI-010 (r02)

STANDARD_PARSED_SAMPLE=false

### I：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-010:I0 **MISSING** TASK-20260522-006。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:I1 **MISSING** agent bringup prompt 相关文件。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:I2 **MISSING** README。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:I3 **MISSING** MCP resource registry。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:I4 **MISSING** release_audit.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:I5 **MISSING** inventory_drift.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual I0 p1:777c8968e66fb914c07f644a RESOLVED / **WRONG_BINDING**：/_lifecycle/。未来初始化后的五桶物理存在是 prompt OUTPUT_CONTENT 要求；actual 将其作为当前输入，并截断成 /_lifecycle/。 来源 [4793,4845) "- `fcop/_lifecycle/` 下五个子目录**必须**全部存在（这是 3.0.2 修复重点）"

### O：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-010:O0 **MISSING** 修订版 agent-bringup-prompt.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O1 **MISSING** 修订版 agent-bringup-prompt.en.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O2 **MISSING** 两种新建场景表。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O3 **MISSING** §1～§6 内容。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O4 **MISSING** README 索引。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O5 **MISSING** 条件允许时 MCP resources。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O6 **MISSING** REPORT-007。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O7 **MISSING** TASK-006 / TASK-007 archive。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:O:OCR-01 **MISSING** 不锁固定版本号。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-02 **MISSING** 每步报告并停。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-03 **MISSING** MCP/Python API 边界。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-04 **MISSING** ADMIN 选择初始化模式。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-05 **MISSING** 实际 ls 物理验证。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-06 **MISSING** fcop_audit。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-07 **MISSING** P0 != 0 时停止并报告 ADMIN。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-08 **MISSING** 不把 tool 返回 OK 当成物理成功。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-09 **MISSING** 不猜 API。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。
- SWAI-010:O:OCR-10 **MISSING** 不自动整改 P0。actual O 没有带 OUTPUT_CONTENT 归属的此项约束；其他槽位的未来动作不算内容约束 MATCH。

### A：RESOLVED / actual UNRESOLVED

- SWAI-010:A0 **MISSING** 编写/修订 zh prompt。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A1 **MISSING** 编写/修订 en prompt。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A2 **MISSING** 加 README 索引。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A3 **MISSING** 运行 release_audit.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A4 **MISSING** 运行 inventory_drift.py。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A5 **MISSING** 写 REPORT-007。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A6 **MISSING** archive TASK-006 + TASK-007。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:A7 **MISSING** 注册 MCP resource。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual A0 p1:b99203cc09fe1c28aa9d7644 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 信。不只信工具返回是 O 内容约束，不是当前开发 TASK 的运行授权。 来源 [550,592) "**物理验证文件清单** — agent 必须 `ls` 实际目录而不是只信工具返回"
- actual A1 p1:a7a058cf09b37267411b73c1 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 停。P0 停止是未来 agent 的 O 内容要求；不作为当前 TASK A 评价。 来源 [598,637) "**P0 不为零必须停** — 体检报告有 P0 时 agent 不准自决整改"
- actual A2 p1:0b8f9d9e976477687bbd93da UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：REQUIRED 写。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1362,1372) "笨模型必须把每步写死"
- actual A3 p1:bdd6efb1d38d9d2f5f590f72 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 写。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [1452,1485) "按**笨模型可接受**的密度写——每步必须停下报告、不准自由发挥、"
- actual A4 p1:7b4240ea99764347f5d82a5d RESOLVED / **WRONG_BINDING**：REQUIRED 挂到 mcp.json、fcop-mcp。MCP 前提被无层级提升成当前配置动作；应归 OUTPUT_CONTENT 边界说明。 来源 [2776,2827) "| 必须先把 fcop-mcp 挂到 Cursor 的 mcp.json（重启 Cursor 后生效）"
- actual A5 p1:47c99d25922014ee93a3334f RESOLVED / **WRONG_BINDING**：REQUIRED 调 init_solo、ME。prompt 内 solo 示例被提升为当前调用；还把模式当 AGENT、ME 参数当 PATIENT。应保留 OUTPUT_CONTENT 中 ADMIN 选择模式的要求。 来源 [3297,3334) "solo 模式应调 `init_solo(role_code=\"ME\")`"
- actual A6 p1:8ec2bab753217b33a72a3987 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 生成。目录是否生成是未来物理验证内容，不是当前执行步骤。 来源 [3605,3644) "- ❌ 看到工具返回 OK 就当成功——必须**物理验证**目录是否真的生成了"
- actual A7 p1:ea6d8dd490b156de41fb2c0c UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 验证。实际 ls 是未来 workflow 的输出内容要求，当前 TASK 是写入此要求。 来源 [4230,4242) "所以必须 `ls` 验证"
- actual A8 p1:718c929a030d6e248989d907 RESOLVED / **WRONG_BINDING**：REQUIRED 输出贴 ls。贴实际 ls 输出属于未来 agent 行为。actual 当前 A 的输出贴 ls 没有 prompt 归属，不能匹配当前编写/修订动作，也未构成 O 的物理验证内容约束。 来源 [4247,4290) "**应该看到的物理文件清单**（agent 把实际 `ls` 输出贴给 ADMIN）："
- actual A9 p1:c42c77717ba832c5f20e6a83 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 存在。五桶存在应作为 O 的物理验证内容保留，不补当前 A。 来源 [4793,4845) "- `fcop/_lifecycle/` 下五个子目录**必须**全部存在（这是 3.0.2 修复重点）"
- actual A10 p1:530c05071b2d8ab150b0d8ba UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：REQUIRED 停下。停下等 ADMIN 属于 prompt 未来 P0 分支，不能建立当前 TASK 动作或参与者。 来源 [5172,5196) "agent **必须停下**让 ADMIN 决策"
- actual A11 p1:7c53058fe5098e67dafbcb20 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：PERMITTED 决定。ADMIN 可先放 P1/P2 是未来 workflow，不建立当前 DECISION_MAKER；该角色不在本批当前 P。 来源 [5225,5238) "ADMIN 可以决定先放着"
- actual A12 p1:69f4caeddbd3667838b88643 RESOLVED / **WRONG_BINDING**：REQUIRED 一步**必须**报告 结果。每步报告并停是 OUTPUT_CONTENT，不是当前 TASK 的直接动作。actual 缺内容归属及停的组合。 来源 [5333,5350) "- 每完成一步**必须**报告结果"
- actual A13 p1:1b1dcc9455d23411f9397915 UNRESOLVED / **UNRESOLVED_NOT_EQUIVALENT**：PERMITTED 选。保留 actual 未决状态；缺完整类型/论元/范围绑定，不以未决候选覆盖已明确的人工条目。 来源 [5706,5713) "资源注册可选）"

### P：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-010:P0 **MISSING** ME [PERFORMER]。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual P0 p1:ea9cb8b6084098413918ad5a RESOLVED / **FALSE_DEFINED**：prompt [PERFORMER]。prompt 产物不是任务参与者。 来源 [502,532) "**不锁版本号** — `pip install` 拉最新版"
- actual P1 p1:036f925c8a3d792f05134591 RESOLVED / **WRONG_BINDING**：自己 [PERFORMER]。自己没有绑定 ME 或 ADMIN 决策角色。 来源 [3490,3543) "- ❌ 找不到 API 时自己想象 `fcop.project.Project.init_project("
- actual P2 p1:98c6d97de2dc086887eb37ff RESOLVED / **FALSE_DEFINED**：pip show fcop fcop-mcp [PERFORMER]。pip show 命令不是参与者。 来源 [2076,2107) "pip show fcop fcop-mcp    # 看现状"
- actual P3 p1:dcbeacc701cf862207e73d1c RESOLVED / **FALSE_DEFINED**：### [PERFORMER]。Markdown ### 不是参与者。 来源 [5900,5921) "### 不做 / Out of scope"

### R：ABSENT / actual PARSER_COVERAGE_FAILURE

- actual R0 p1:10416b749bd2afe3bbb73eb3 RESOLVED / **FALSE_DEFINED**：6。anti-pattern >=6 条是产物验收数量，不是本批 R；target=含 丢失清单对象。 来源 [6345,6401) "✅ §3 边界声明含 MCP 工具 vs Python API 对照表 + anti-pattern ≥ 6 条"

### V：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-010:V0 **MISSING** TASK-20260522-006。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:V1 **MISSING** Python >= 3.10。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:V2 **MISSING** 最新版、不固定 package version。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### C：RESOLVED / actual PARSER_COVERAGE_FAILURE

- SWAI-010:C0 **MISSING** 原 9 条 Acceptance Criteria 全部满足。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。

### B：RESOLVED / actual UNRESOLVED

- SWAI-010:B0 **MISSING** FORBIDDEN 生成的 prompt 写死 `==X.Y.Z`。存在相关片段，但其槽位/模态/对象/作用域不等价；不从证据正文补造缺失结构。
- SWAI-010:B1 **MISSING** 不改 agent-install-prompt.zh.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:B2 **MISSING** 不动 LETTER-TO-ADMIN.md。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:B3 **MISSING** 不改协议规则。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:B4 **MISSING** 不发版。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- SWAI-010:B5 **MISSING** 不做工具层防呆。冻结 actual 没有完整等价的当前审定条目；本轮不补槽或重跑。
- actual B0 p1:286bb1f34510886ef334a475 RESOLVED / **FALSE_DEFINED**：FORBIDDEN 区分 场景。升级说明不区分场景是 O 内容中的同一升级方式，不是当前禁止区分场景。此错误还涉及否定/模态解释，不能认作当前 B。 来源 [2508,2513) "不区分场景"
- actual B1 p1:124b4ee99bd7feeb23326186 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：FORBIDDEN 在。不在 Python 包里是说明 MCP/API 边界的事实，非当前 TASK 禁止在的动作。 来源 [3063,3075) "不在 Python 包里"
- actual B2 p1:53d0b5e3a851e249ada46211 UNRESOLVED / **UNRESOLVED_OUTPUT_CONTENT**：FORBIDDEN 自决。未来 agent 不自决整改 P0 移入 O 内容约束；未决 B 不作为当前禁止项的候选答案。 来源 [5544,5549) "不自决整改"
- actual B3 p1:30cb9fa5bb5d51042d40cc86 RESOLVED / **WRONG_BINDING**：FORBIDDEN 写 X.Y.Z。当前 B 的合法目标是生成的 prompt，禁止其写死 ==X.Y.Z。actual 仅有 ITEM(X.Y.Z)，缺输出归属和 == 锁定操作；与新 B0 不等价。 来源 [6326,6339) "不写 `==X.Y.Z`）"

## SWAI-005

NEEDS_ADJUDICATION_SOURCE_CONFLICT。STANDARD_GOLD=false；STANDARD_PARSED_SAMPLE=false；未计任何 slot finding，未假定 ADMIN 选择 A。原文、旧 expected、历史引用和 actual 保留。
