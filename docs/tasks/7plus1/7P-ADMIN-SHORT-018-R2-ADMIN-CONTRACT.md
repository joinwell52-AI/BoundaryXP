# 7P-ADMIN-SHORT-018-R2 — ADMIN G1 Semantic Contract

## Scope

This contract authorizes **G1 only** for the ADMIN short-task hardening line.

The purpose is to validate two remaining core semantic families on standardized ADMIN tasks:

1. complete Basis + Version identity;
2. resource/limit binding to the correct target.

Do not enter G2/G3 or the 30-case holdout in this task.

The R1 candidate and its G0 result remain the baseline:

```text
G0 = 5/5
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
D01–D08 = 8/8
REF-001 = 43/43
```

## Common semantic rules

### Basis / Version

A source expression such as:

```text
依据 RELEASE-6 的 v3.0 版本
按 SEARCH-SPEC-5 的 v1.2 版本
Using CHECK-19 version v2.4
```

must compile to **one complete V identity**:

```text
BASIS(
  identifier = <rule/spec>,
  version = <version>
)
```

It must not become:

- version-only V;
- split duplicate V identities;
- an input merely because the basis happens to look like a file/token;
- an action.

### Resource / Limit

A source expression such as:

```text
整个任务须在 40 分钟内完成
整个任务最多使用 20 分钟
generate ... within 30 minutes
```

must compile to a typed R fact with:

- metric = TIME;
- comparator = LTE;
- exact numeric value;
- exact unit;
- target = the intended task/execution scope.

A time window used only as observed data (e.g. “最近一小时的日志”) is not a task time budget.

### Negative execution semantics

Phrases such as:

```text
不执行发布
不得加载模型权重
不得发起推理
不得调整阈值
不得重建索引
```

remain B facts and must not be converted into inputs or positive actions.

## ADM-001 — System environment check

Source authority: fixture ADM-001.

Required root semantics include at minimum:

- A:
  - PM coordinates/assigns OPS for the check;
  - OPS checks operating system, disk free space, service processes;
  - OPS generates `environment-check.md`;
  - QA reviews the report;
  - PM submits to ADMIN.
- O:
  - `environment-check.md`.
- P:
  - PM = coordinator / submitter;
  - OPS = performer;
  - QA = reviewer;
  - ADMIN = recipient.
- R:
  - TIME <= 40 minutes, target = entire task.
- B:
  - forbid modifying system configuration.

No task input file is required merely because the environment itself is inspected.

## ADM-010 — Release pre-check

Required root semantics include:

- I:
  - `release.yaml`;
  - `build.log`.
- O:
  - `release-check.md`.
- A:
  - QA reads the two inputs;
  - QA performs the release pre-check;
  - QA generates the report;
  - PM reports/submits to ADMIN after QA report submission.
- P:
  - QA = performer;
  - PM = submitter/coordinator;
  - ADMIN = recipient.
- V:
  - one identity: `RELEASE-6` + version `v3.0`.
- B:
  - do not execute release;
  - do not modify source code;
  - do not modify release configuration.

The basis must not be split and `release.yaml` must remain I, not V.

## ADM-026 — Model configuration verification

Required root semantics include:

- I:
  - `model-config.json`.
- O:
  - `model-config-review.md`.
- A:
  - DEV reads model-config.json;
  - checks model path, precision setting, device configuration;
  - generates model-config-review.md;
  - PM arranges QA review.
- P:
  - DEV = performer;
  - PM = coordinator;
  - QA = reviewer.
- R:
  - TIME <= 20 minutes, target = entire task.
- B:
  - do not load model weights;
  - do not initiate inference.

“model weights” and “inference” are forbidden-action objects, not positive inputs.

## ADM-032 — Retrieval configuration review

Required root semantics include:

- I:
  - `retrieval.yaml`.
- O:
  - `retrieval-review.md`.
- A:
  - DEV reads retrieval.yaml;
  - reviews index and filter configuration;
  - generates retrieval-review.md;
  - QA reviews;
  - PM reports to ADMIN after QA passes.
- P:
  - DEV = performer;
  - QA = reviewer;
  - PM = submitter;
  - ADMIN = recipient.
- V:
  - one identity: `SEARCH-SPEC-5` + version `v1.2`.
- B:
  - do not adjust recall threshold;
  - do not rebuild index.

No split duplicate basis identities.

## ADM-048 — English time + basis

Required root semantics include:

- I:
  - `routes.yaml`.
- O:
  - `route-audit.md`.
- A:
  - inspect routes.yaml;
  - generate route-audit.md;
  - QA reviews;
  - send report to PM after review.
- P:
  - QA = reviewer;
  - PM = recipient.
- V:
  - one identity: `CHECK-19` + version `v2.4`.
- R:
  - TIME <= 30 minutes, target = the task/check execution.
- B:
  - do not change the configuration.

The 30-minute limit is R, not C.

## G1 acceptance

G1 passes only if all five cases are independently reviewed as:

`FULL_ROOT_7PLUS1_CLOSED`

and:

```text
G0 retained = 5/5
G1 = 5/5
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
basis_split_or_version_only = 0
wrong_quantity_target = 0
D01–D08 retained = 8/8
REF-001 retained = 43/43
```

## Status

`ADMIN_G1_SEMANTIC_CONTRACT_FROZEN`
