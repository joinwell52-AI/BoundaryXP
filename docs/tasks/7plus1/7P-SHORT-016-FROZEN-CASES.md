# 7P-SHORT-016 — ADMIN Frozen Direct-Parser Cases

**Status:** FROZEN BEFORE IMPLEMENTATION  
**Scope:** short single-flow tasks only  
**WP decomposition:** forbidden  
**Hybrid proposal lane:** forbidden  
**Authority:** this file is the semantic expectation for D01–D08.

These are not copied from the existing Gold or long STANDARD corpus.

Runtime code must not read this file or depend on case IDs, literal hashes, names, file names, offsets, or expected values.

---

## Common semantic rules

For every case:

- Canonical slots are `I/O/A/P/R/V/C+B`.
- Empty positive slots use `ABSENT`, not a fabricated fact.
- Expected entries below are semantic identities, not required display strings.
- Duplicate mentions of the same semantic identity do not create duplicate Canonical entries.
- Every RESOLVED item must retain source/proof lineage.
- No unsupported RESOLVED extra is allowed.
- OUTPUT_CONTENT requirements remain owned by the output; they do not automatically become current-task A/P/B.
- `NOT_REQUIRED` does not become `FORBIDDEN`.

---

# D01 — Basic Chinese direct task

## Source

```text
张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT input.csv

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT report.md

A:
  status: RESOLVED
  entries:
    - REQUIRED READ input.csv
      agent: 张宁
    - REQUIRED GENERATE report.md
      agent: 张宁

P:
  status: RESOLVED
  entries:
    - 张宁 [PERFORMER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - OUTPUT_EXISTS(report.md)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY input.csv
```

---

# D02 — Basic English equivalent

## Source

```text
Emma Lee is responsible for this task. Read orders.csv and generate summary.md. Do not modify orders.csv. The task is complete when summary.md has been generated.
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT orders.csv

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT summary.md

A:
  status: RESOLVED
  entries:
    - REQUIRED READ orders.csv
      agent: Emma Lee
    - REQUIRED GENERATE summary.md
      agent: Emma Lee

P:
  status: RESOLVED
  entries:
    - Emma Lee [PERFORMER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - OUTPUT_EXISTS(summary.md)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY orders.csv
```

---

# D03 — Resource/time constraint

## Source

```text
周岚负责这项整理。读取 users.json，生成 user-summary.md。不得修改 users.json。本次任务总用时不得超过 20 分钟。user-summary.md 已生成后，本任务完成。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT users.json

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT user-summary.md

A:
  status: RESOLVED
  entries:
    - REQUIRED READ users.json
      agent: 周岚
    - REQUIRED GENERATE user-summary.md
      agent: 周岚

P:
  status: RESOLVED
  entries:
    - 周岚 [PERFORMER]

R:
  status: RESOLVED
  entries:
    - TIME_BUDGET
      operator: LTE
      value: 20
      unit: minute
      target: CURRENT_TASK

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - OUTPUT_EXISTS(user-summary.md)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY users.json
```

---

# D04 — Basis + version

## Source

```text
陈默负责本次核对。依据 API-SPEC-12 的 v1.8.0 版本核对 api.yaml，并生成 api-check.md。不得修改 api.yaml。api-check.md 已生成后，本任务完成。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT api.yaml

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT api-check.md

A:
  status: RESOLVED
  entries:
    - REQUIRED CHECK api.yaml
      agent: 陈默
      basis: API-SPEC-12
      version: v1.8.0
    - REQUIRED GENERATE api-check.md
      agent: 陈默

P:
  status: RESOLVED
  entries:
    - 陈默 [PERFORMER]

R:
  status: ABSENT

V:
  status: RESOLVED
  entries:
    - BASIS API-SPEC-12
      version: v1.8.0

C:
  status: RESOLVED
  entries:
    - OUTPUT_EXISTS(api-check.md)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY api.yaml
```

---

# D05 — Performer + recipient + reviewer

## Source

```text
赵一负责检查 audit.log 并生成 checklist.md。完成后，将 checklist.md 提交给复核人孙禾。只有孙禾确认 checklist.md 已包含全部检查结果时，本任务才算完成。不得修改 audit.log。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT audit.log

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT checklist.md

A:
  status: RESOLVED
  entries:
    - REQUIRED CHECK audit.log
      agent: 赵一
    - REQUIRED GENERATE checklist.md
      agent: 赵一
    - REQUIRED SUBMIT checklist.md
      agent: 赵一
      recipient: 孙禾

P:
  status: RESOLVED
  entries:
    - 赵一 [PERFORMER]
    - 孙禾 [RECIPIENT, REVIEWER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - REVIEW_CONFIRMED
      reviewer: 孙禾
      object: checklist.md
      requirement: contains_all_check_results

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY audit.log
```

---

# D06 — Conditional output / NOT_REQUIRED

## Source

```text
林秋负责本次检查。读取 changes.csv，生成 review.md。如果发现差异，另生成 diff.csv；如果没有差异，则无需生成 diff.csv。不得修改 changes.csv。review.md 已生成，并且所有发现的差异都已记录后，本任务完成。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT changes.csv

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT review.md
    - CONDITIONAL_OUTPUT diff.csv
      condition: DIFFERENCE_EXISTS

A:
  status: RESOLVED
  entries:
    - REQUIRED READ changes.csv
      agent: 林秋
    - REQUIRED GENERATE review.md
      agent: 林秋
    - REQUIRED GENERATE diff.csv
      agent: 林秋
      condition: DIFFERENCE_EXISTS

P:
  status: RESOLVED
  entries:
    - 林秋 [PERFORMER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - AND
      - OUTPUT_EXISTS(review.md)
      - ALL_FOUND_DIFFERENCES_RECORDED

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY changes.csv

Auxiliary:
  - NOT_REQUIRED GENERATE diff.csv
    condition: NOT DIFFERENCE_EXISTS
  - Auxiliary NOT_REQUIRED must not project to B.
```

---

# D07 — OUTPUT_CONTENT ownership

## Source

```text
王齐负责整理说明。读取 service.yaml，生成 deployment-guide.md。deployment-guide.md 必须包含“部署步骤”和“回滚说明”两个部分。不得修改 service.yaml。deployment-guide.md 已生成且这两个部分都存在后，本任务完成。
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT service.yaml

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT deployment-guide.md

A:
  status: RESOLVED
  entries:
    - REQUIRED READ service.yaml
      agent: 王齐
    - REQUIRED GENERATE deployment-guide.md
      agent: 王齐

P:
  status: RESOLVED
  entries:
    - 王齐 [PERFORMER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - AND
      - OUTPUT_EXISTS(deployment-guide.md)
      - OUTPUT_CONTENT_PRESENT(deployment-guide.md, 部署步骤)
      - OUTPUT_CONTENT_PRESENT(deployment-guide.md, 回滚说明)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY service.yaml

OwnedOutputContent:
  owner: deployment-guide.md
  requirements:
    - REQUIRED SECTION 部署步骤
    - REQUIRED SECTION 回滚说明

NonProjection:
  - “部署步骤” must not become a current-task ACTION named “部署”.
  - “回滚说明” must not become a current-task ACTION named “回滚”.
```

---

# D08 — English OUTPUT_CONTENT equivalent

## Source

```text
Olivia Chen is responsible for this task. Read policy.yaml and create compliance-note.md. compliance-note.md must contain a Findings section and a Follow-up section. Do not modify policy.yaml. The task is complete when the file exists and both sections are present.
```

## Expected Canonical semantics

```yaml
I:
  status: RESOLVED
  entries:
    - INPUT policy.yaml

O:
  status: RESOLVED
  entries:
    - GENERATED_OUTPUT compliance-note.md

A:
  status: RESOLVED
  entries:
    - REQUIRED READ policy.yaml
      agent: Olivia Chen
    - REQUIRED GENERATE compliance-note.md
      agent: Olivia Chen

P:
  status: RESOLVED
  entries:
    - Olivia Chen [PERFORMER]

R:
  status: ABSENT

V:
  status: ABSENT

C:
  status: RESOLVED
  entries:
    - AND
      - OUTPUT_EXISTS(compliance-note.md)
      - OUTPUT_CONTENT_PRESENT(compliance-note.md, Findings)
      - OUTPUT_CONTENT_PRESENT(compliance-note.md, Follow-up)

B:
  status: RESOLVED
  entries:
    - FORBIDDEN MODIFY policy.yaml

OwnedOutputContent:
  owner: compliance-note.md
  requirements:
    - REQUIRED SECTION Findings
    - REQUIRED SECTION Follow-up

NonProjection:
  - Findings is content, not a current-task action.
  - Follow-up is content, not a current-task action.
```

---

# REF-001 — Existing anchor

Use existing frozen files without modification:

- source: `fixtures/7plus1/golden/REF-001/source.txt`
- expected Canonical: `fixtures/7plus1/golden/REF-001/expected-7plus1.json`
- expected Boundary IR: `fixtures/7plus1/golden/REF-001/expected-boundary-ir.json`

REF-001 is **not** part of the D01–D08 8/8 denominator.

Its purpose is to verify that direct-parser repairs do not destroy the existing meeting-record semantics and to report full Canonical closure separately from legacy meeting assertions.
