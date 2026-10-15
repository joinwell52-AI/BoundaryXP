## I｜输入与作用域

| 边界 | 原文依据 |
|---|---|
| 任务为 `TASK-20260509-004-ADMIN-to-ME`，只覆盖 **Schema 校验基础设施（横切）与 Audit / REVIEW（抽象 7）**，不是其余抽象的整体落地。 | “故意收窄”“端到端覆盖……2 个” |
| Schema 输入为 `spec/schemas/*.schema.json` 的 **7 份**文件；REVIEW 从首次实现起消费 `review.schema.json`。 | “加载 7 份”“`write_review` 从第一天起就用……校验” |
| 历史兼容验证范围为 `docs/agents/log/` 下**所有真实 0.7.x TASK、REPORT、ISSUE 文件**，须全部通过 ipc-envelope schema。 | A4：“所有真实……全部通过” |
| 源码涉及 `_data/schemas/`、`core/jsonschema_validator.py` 新建，以及 `models.py`、`core/filename.py`、`core/frontmatter.py`、`project.py`、`__init__.py` 的增量修改；另涉及测试、snapshot、CHANGELOG、报告及归档。 | §6：“触及……（新建）……（additive）”；A9、A10 |
| 后续 Boundary、Failure、Event、迁移 CLI 等不纳入本任务；具体排除项见 B。 | “各开独立后续任务” |

## O｜产物与交付

**1. Schema 基础设施**

- `src/fcop/_data/schemas/` 必须包含 7 份协议 schema 的**逐字节副本**，实际打入 wheel；采用复制及 hatchling `include` glob。包内目录是运行时权威路径，`spec/schemas/` 是协议权威。  
  来源：“作为 wheel 内权威路径”“CI 测断言两份字节一致”；§5：“简单复制 + hatchling `include` glob”。
- 新建兄弟模块 `core/jsonschema_validator.py`，import 时加载全部 7 份 schema，跨 `$ref` 使用 `referencing.Registry`。模块接口为：  
  来源：决议 2；A2：“import 时加载 7 份……跨 `$ref`……解析”。

```python
validate_envelope_frontmatter(fm: dict, envelope_type: str) -> list[ValidationIssue]
validate_record(record: dict, schema_name: str) -> list[ValidationIssue]

BUNDLED_SCHEMA_DIR: Path
SCHEMA_REGISTRY  # referencing.Registry 实例
SCHEMA_NAMES: tuple[str, ...]
```

**2. REVIEW 数据模型与读写能力**

`models.py` 新增 `Review`，必须 `frozen=True, slots=True`，字段完整如下；不得省掉可空字段或将元组改成其他容器。来源：决议 3：“字段对齐……”，所列 dataclass。

| 字段 | 类型及明确约束 |
|---|---|
| `path`、`filename` | `Path`、`str` |
| `review_id` | `str`；`REVIEW-{date}-{seq}-{reviewer}-on-{subject_short}` |
| `date`、`sequence` | `str`，`YYYYMMDD`；`int`，1 至 999，含两端 |
| `subject_type`、`subject_ref` | `ReviewSubjectType`；`str`，文件路径或 hash |
| `reviewer_role`、`reviewer_agent` | `str`；`str \| None` |
| `decision`、`rationale` | `ReviewDecision`；`str \| None` |
| `required_changes` | `tuple[str, ...]` |
| `decided_at`、`mtime` | 均为 `datetime` |
| `body`、`is_archived` | `str`、`bool` |

两个枚举均继承 `(str, Enum)`，成员与值分别为：

- `ReviewDecision`：`APPROVED / REJECTED / NEEDS_CHANGES / ABSTAINED`，对应 `approved / rejected / needs_changes / abstained`。
- `ReviewSubjectType`：`TASK / REPORT / ROLE_SWITCH / CODE_CHANGE`，对应 `task / report / role_switch / code_change`。

来源：决议 3：“外加两个新枚举”及字段注释。

`Project.write_review` 须保持以下签名及默认值；`self` 后参数均为仅限关键字参数。来源：决议 4 所列签名。

```python
def write_review(
    self,
    *,
    reviewer_role: str,
    subject_type: str | ReviewSubjectType,
    subject_ref: str,
    decision: str | ReviewDecision,
    rationale: str | None = None,
    required_changes: Iterable[str] = (),
    reviewer_agent: str | None = None,
    body: str = "",
    date: str | None = None,  # 默认今天，YYYYMMDD
) -> Review:
```

同时必须交付：

| 产物边界 | 原文依据 |
|---|---|
| `core/filename.py` 支持 `REVIEW-{date}-{seq}-{reviewer}-on-{subject}.md` 解析与 round-trip。 | A6：“解析……round-trip” |
| `core/frontmatter.py` 支持 review frontmatter parse/serialize；`rationale` 在 frontmatter，`body` 为补充性的自由 Markdown。 | A6；§5：“body……自由 Markdown” |
| `Project` 新增 `write_review`、`read_review`、`list_reviews`、`archive_review`，在临时项目中端到端跑通；首次 write 自动创建 `reviews/`。 | 决议 4；A7 |
| 顶层 `fcop` 导出 `Review`、两个枚举；公开面新增上述 4 方法、1 dataclass、2 enum，更新 `tests/test_fcop/snapshots/public_surface.json`。 | A5、A9；决议 5 |
| 交付 REPORT-004、TASK-004 归档、commit、push，以及 CHANGELOG 的一条 `Unreleased / Added`。 | A10 |

**3. 测试与证据**

| 必须覆盖的范围 | 原文依据 |
|---|---|
| 7 份 schema 专属 `test_*.py`，每份至少 3 个用例，覆盖合法、缺必填、非法枚举，并对齐 ADR-0016 checklist。 | A3：“× 7，每份 ≥ 3 用例” |
| `test_bundled_schemas_in_sync.py` 强制副本逐字节一致，任何 commit 的漂移应使 CI 失败。 | 决议 1：“任何 commit……漂移都会断 CI” |
| `test_validator_loads_all` 加手动 import 验证加载；`test_legacy_files_validate` 覆盖 I 中全部历史文件。 | A2、A4 |
| 顶层 import、filename round-trip、frontmatter、Project 四方法端到端及拒绝非法 REVIEW 的测试。 | A5—A8 所列证据 |
| `test_review_no_v12_features.py` 显式断言 B 中四项 v1.2 特性不存在。 | 决议 6：“显式 ASSERT 它们不存在” |
| snapshot 更新及 public-surface 测试，同时**完整 pytest 通过**；不能仅以单个 snapshot 测试替代完整测试。 | A9：“完整 pytest 通过” |

## A｜动作及顺序

原文规定 **3 个 commit**，不是可自由重组的轮数：

| 轮次 | 动作及交付组合 | 指定 commit 信息 |
|---|---|---|
| R1 | schema 同步入 wheel、新校验器、7 份 schema 测试、1 份同步测试、1 份历史文件测试。 | `feat(core): JSON Schema 校验器 + 7 抽象的测试套件` |
| R2 | Review、枚举、filename、frontmatter、四方法、测试及 snapshot；执行计划还将 CHANGELOG 放在此轮，冲突见 V。 | `feat(review): REVIEW envelope 落地（ADR-0017 最小面）` |
| R3 | REPORT-004、TASK-004 归档及 push。 | `close TASK-20260509-004：schema 校验器 + REVIEW 已发车` |

来源：§4：“执行计划（3 commit）”及完整轮次表。

- 任一轮首次测试失败，必须先修复再 commit；这一要求对三轮逐轮适用。来源：“任何一轮测试第一次没通过 → 修完再 commit”。
- 新校验器对现有 caller **仅 opt-in，现有调用保持不变**；与此同时，新 `write_review` 必须从第一天使用 schema 校验。这两个作用域不同，均须满足。来源：“仅 opt-in——现有 caller 完全不变”“`write_review` 从第一天起就用……校验”。
- 原文要求“立即开始 R1”；这是定性启动要求，不可换算成原文没有给出的分钟数或截止时间。

## P｜参与关系

| 边界 | 原文依据 |
|---|---|
| ADMIN 发出任务并作本任务决议，ME 为接收及执行主体，采用 Solo 模式。 | “sender: ADMIN”“recipient: ME”“Solo 模式任务” |
| Proposer、Executor、Reviewer 是原文的三个预飞检查视角；原文未指定三个独立人员，也未建立额外人工签批流程。Reviewer 段的拒收、停止条件仍有效，见 C、B。 | “三视角预飞检查”“需要在执行中盯的拒收条件” |
| `reviewer_role` 与可空的 `reviewer_agent` 是 REVIEW 模型中的身份字段；不能据此增设本任务参与人员。 | 决议 3、4 的字段与签名 |
| 已有英文文档是否补 `.zh.md` 由 ADMIN 另开任务安排，本任务不自行决定追补。 | “由 ADMIN 单开 TASK 安排” |

## R｜资源、数量与时间

- **7 份 schema，两个位置逐份字节一致**；不是要求 14 种不同 schema。来源：A1：“7 份……字节级副本”。
- R1 明列 **9 份测试文件 = 7 + 1 + 1**。7 份 schema 专属测试至少 **21 个用例**；Reviewer 又规定“任何测试文件 < 3 用例 → 拒”，据此 R1 这 9 份文件合计至少 **27 个用例**。此下限不涵盖 R2 的全部测试。来源：A3、§4 R1、§6 Reviewer。
- 公开面净新增 **7 项 = 4 方法 + 1 dataclass + 2 enum**，均为 added；共 **3 个 commit**。来源：决议 5；§5：“7 条 net 增加”；§4。
- 任务日期、Opened 均为 `2026-05-09`，优先级 P0，状态 `in_progress`；原文未给完成期限、工时或金额预算。来源：头部元数据及§7。
- `jsonschema>=4.0` 已由前置任务加入，`referencing` 被原文确认是可用的传递依赖；这属于输入前提，不是本次解析已验证的运行状态。来源：§5：“任务开始前已确认”；§6：“pyproject 已经……加了 jsonschema 依赖”。

## V｜版本、依据与局部冲突

| 边界 | 原文依据 |
|---|---|
| 任务封套为 `fcop` version 1、TASK；实现目标为协议 v1.0，须兼容 0.7.x 历史文件，不引入推迟到 v1.2 的功能。 | 头部；A4、A8；决议 6 |
| Charter 为 ADR-0015，定位其 execution roadmap step 2；前置任务为 TASK-20260509-003。 | `ref_charter`、`ref_predecessor`；§7 |
| ADR-0016 约束 schema 测试，ADR-0017 约束 REVIEW 最小设计；ADR-0001 约束 core 模块角色与 internal 定位，ADR-0003 约束公开面 additive-only。 | §1；决议 2、3、5 |
| 自本任务起，内部 TASK、REPORT、草拟 ADR、草拟 release notes 中文为主、关键术语英文括注；对外 spec、长文 ADR、README、homepage、getting-started 中英双语并出。已有英文文档暂留；R2/R3 commit 信息也须中文为主、关键术语带英文。 | §8：“新约定（自本任务起）” |

**原文需保留的局部问题：**

1. **后续任务编号冲突。** §1 按“分别”将 Event 对应 TASK-006、Failure 对应 TASK-007；决议 7 则将 Failure 对应 TASK-006、Event 对应 TASK-007。两者均明确排除于本任务，但编号不能自行统一。
2. **CHANGELOG 轮次冲突。** 决议 5 要求“R3 commit 时同步加”，§4 将 CHANGELOG 列入 R2。新增条目义务明确，归属轮次冲突。
3. **测试目录改动限制冲突。** §6 写 `tests/`“仅新文件”，但 A9、决议 5、R2 明确要求更新既有 snapshot。不能同时按字面满足；snapshot 更新义务不能省掉。
4. **测试文件量词较宽。** Reviewer 写“任何测试文件 < 3 用例 → 拒”，未明确是否连仓库中未改动的旧测试文件也计入；至少不能将本任务新增的同步、历史及 REVIEW 测试排除在外。
5. 本文未展开另外三个 Project 方法的签名、完整 review frontmatter schema、错误返回细节或完整归档语义；部分以 ADR/schema 为依据，但所引用文件内容未提供，不能自行补全。来源：§1、A6、A7 仅列功能与引用。

## C｜完成、拒收、停止与升级

- **完成须共同满足 A1—A10**，并履行三轮交付、语言、兼容及禁止性约束；仅实现 `write_review` 或仅通过部分测试不构成完成。来源：“验收标准（10 条）”及§4。
- `write_review` 必须同时执行以下约束：  
  来源：决议 4“校验合约”；A8。
  - `decision == needs_changes` 且 `required_changes` 为空：拒绝。
  - `decision` 不属于规定四值：拒绝，包括 `needs_human`。
  - `subject_type` 不属于规定四值：拒绝。
  - `reviewer_role` 使用现有 `validate_role_code(allow_reserved=True)` 校验。
  
  这些是必要约束，不能反推“只要通过这四项就必然接受”；仍须满足 `review.schema.json`。
- 0.7.x 文件校验失败，必须在 commit 前发现并按 schema 错误处理，不能以破坏历史兼容换取通过。来源：§5：“如果挂了，那是 schema 写错了（I5 禁止破 0.7.x）”。
- 任何测试文件不足 3 用例、已有 dataclass 字段类型被改、snapshot 出现 `DELETED` 或 `RENAMED`：拒收。来源：§6 Reviewer。
- 任何 `validate_*` 调用被接入 `write_task / write_report / write_issue` 路径：**停止并拆分**，转为单独的“校验强制化”任务，且须带 opt-in flag；不是当前任务可继续扩展的范围。来源：§6：“停下来拆分”。
- 原文没有定义其他升级时限、指定额外审批人或赋予未来测试结果；不得补造。

## B｜独立禁止与限制

| 禁止或限制 | 原文依据 |
|---|---|
| 不向 `core/schema.py` 叠加校验器；新模块中的函数和常量不进入顶层 `fcop.__all__`。此限制不取消 O 中 Review 及枚举的顶层导出。 | 决议 2：“不要往……叠”“这些不进……`__all__`” |
| 不采用自定义 hatchling build hook，也不以开发环境的包外相对路径读取代替选定的 wheel 打包方案。 | 决议 1：“采用方案 3”；§5：“不写自定义 hook” |
| 零删除，不改变已有签名或已有 dataclass 字段类型，公开面不得删除或重命名。 | §6：“零删除”；决议 5：“没有任何已有签名被改”；Reviewer |
| 不 commit 红 pytest；schema 两份副本不得漂移。 | §4：“绝不 commit 红 pytest”；决议 1 |
| v1.0 REVIEW 不得含 `decision: needs_human`、`human_approval` 子对象、`Project.mark_human_approved` API、admin-layer `manual_file_edit` 守卫。 | 决议 6：“不能包含” |
| 不实现 `Role.layer / can / cannot`、4 条 boundary 规则、`BOUNDARY_VIOLATED` 事件；列为 TASK-005。 | 决议 7 |
| 不实现 `Project.report_failure / recover_session`、`core/recovery.py`、Failure 事件；不实现 `Project.subscribe_events`、polling watcher、12 个事件类型。后续编号存在 V 所列冲突。 | 决议 7；§1 |
| 不实现 `fcop migrate-workspace`、`docs/agents/` detect+warn、`MIGRATION-1.0.md`；列为 TASK-008。 | 决议 7 |
| 不回复 GitHub Issue #2、不重新 emit `fcop deploy_rules` 使 mdc 引用新 schema、不打 v1.0.0 RC tag 或 bump Zenodo DOI；分别列为 TASK-009、010、011。 | 决议 7 |

以上仅为所给 ADMIN 原文的边界解释，不构成业务执行或额外授权。