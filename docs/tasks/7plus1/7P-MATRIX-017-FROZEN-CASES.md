# 7P-MATRIX-017 — ADMIN Frozen Medium Multi-WP Cases

**Status:** FROZEN BEFORE IMPLEMENTATION  
**Scope:** medium tasks with 2–3 WPs  
**Hybrid:** forbidden  
**Long STANDARD:** forbidden as tuning source  
**Authority:** this file defines M01–M04 expected semantics.

The short parser is already validated. These cases test only segmentation, WP ownership, matrix construction, cross-WP dependency, and Global 7+1 projection.

---

# Common representation rules

For every case:

- `WP0` = root task contract, not the first execution step.
- Child WPs are siblings under WP0 in 017.
- Each child WP has a local 7+1.
- The semantic matrix has fixed columns `I/O/A/P/R/V/C/B`.
- Intermediate artifacts may be both an upstream `O` and downstream `I`.
- Final output is marked `FINAL_OUTPUT`.
- Cross-WP links must preserve semantic identity, source, condition, and proof.
- Global Canonical 7+1 is one final 7+1 with WP/stage metadata; it is not a flat string union.

---

# M01 — Two-stage sequential flow

## Source

```text
本任务分两个阶段。

第一阶段由张宁负责。张宁读取 inventory.csv，检查重复记录，并生成 issues.md。issues.md 已生成后，第一阶段完成。

第二阶段必须在第一阶段完成后开始。李凯读取 issues.md，根据其中的问题生成 remediation-plan.md。remediation-plan.md 已生成后，整个任务完成。

不得修改 inventory.csv。
```

## Expected Blocks

```text
B1 = 本任务分两个阶段。
B2 = 第一阶段由张宁负责。
B3 = 张宁读取 inventory.csv，检查重复记录，并生成 issues.md。
B4 = issues.md 已生成后，第一阶段完成。
B5 = 第二阶段必须在第一阶段完成后开始。
B6 = 李凯读取 issues.md，根据其中的问题生成 remediation-plan.md。
B7 = remediation-plan.md 已生成后，整个任务完成。
B8 = 不得修改 inventory.csv。
```

## Expected WP Tree

```text
WP0
├─ WP1  第一阶段：检查 inventory.csv 并生成 issues.md
└─ WP2  第二阶段：消费 issues.md 并生成 remediation-plan.md
```

## Expected Local 7+1

### WP1

```yaml
I:
  - inventory.csv [EXTERNAL_INPUT]
O:
  - issues.md [INTERMEDIATE_OUTPUT]
A:
  - READ inventory.csv
  - CHECK duplicate_records
  - GENERATE issues.md
P:
  - 张宁 [PERFORMER]
R: ABSENT
V: ABSENT
C:
  - OUTPUT_EXISTS(issues.md) [LOCAL_COMPLETION]
B:
  - FORBIDDEN MODIFY inventory.csv [GLOBAL_CONSTRAINT inherited from WP0]
```

### WP2

```yaml
I:
  - issues.md [INTERMEDIATE_INPUT, from=WP1.O]
O:
  - remediation-plan.md [FINAL_OUTPUT]
A:
  - READ issues.md
  - GENERATE remediation-plan.md
P:
  - 李凯 [PERFORMER]
R: ABSENT
V: ABSENT
C:
  - OUTPUT_EXISTS(remediation-plan.md) [GLOBAL_COMPLETION]
B: ABSENT
```

## Expected Dependency DAG

```text
PRODUCES_FOR(WP1.O.issues.md, WP2.I.issues.md)
CONSUMES_OUTPUT(WP2, WP1.O.issues.md)
REQUIRES_COMPLETION(WP2, WP1.C)
SEQUENCE(WP1, WP2)
```

## Expected Global 7+1

```yaml
I:
  - inventory.csv [wp=WP1, EXTERNAL_INPUT]
  - issues.md [wp=WP2, INTERMEDIATE_INPUT, produced_by=WP1]
O:
  - issues.md [wp=WP1, INTERMEDIATE_OUTPUT, consumed_by=WP2]
  - remediation-plan.md [wp=WP2, FINAL_OUTPUT]
A:
  - WP1: READ inventory.csv
  - WP1: CHECK duplicate_records
  - WP1: GENERATE issues.md
  - WP2: READ issues.md
  - WP2: GENERATE remediation-plan.md
P:
  - 张宁 [PERFORMER, wp=WP1]
  - 李凯 [PERFORMER, wp=WP2]
R: ABSENT
V: ABSENT
C:
  - WP1: OUTPUT_EXISTS(issues.md) [LOCAL_COMPLETION]
  - WP2: OUTPUT_EXISTS(remediation-plan.md) [GLOBAL_COMPLETION]
B:
  - FORBIDDEN MODIFY inventory.csv [GLOBAL_CONSTRAINT]
```

---

# M02 — Three-stage sequential flow with reviewed completion

## Source

```text
本任务分三个阶段。

第一阶段由林乔负责。林乔读取 source.yaml，检查配置项，并生成 check.md。check.md 已生成后，第一阶段完成。

第二阶段由周安负责，并且只能在第一阶段完成后开始。周安读取 check.md，根据检查结果生成 fix-plan.md。第二阶段只有在复核人顾辰确认 fix-plan.md 内容完整后才算完成。

第三阶段必须在第二阶段完成后开始。王宁读取 fix-plan.md，并生成 final-note.md。final-note.md 已生成后，整个任务完成。

不得修改 source.yaml。
```

## Expected WP Tree

```text
WP0
├─ WP1  检查
├─ WP2  修复计划
└─ WP3  最终说明
```

## Expected Local 7+1

### WP1

```yaml
I:
  - source.yaml [EXTERNAL_INPUT]
O:
  - check.md [INTERMEDIATE_OUTPUT]
A:
  - READ source.yaml
  - CHECK configuration_items
  - GENERATE check.md
P:
  - 林乔 [PERFORMER]
C:
  - OUTPUT_EXISTS(check.md) [LOCAL_COMPLETION]
B:
  - FORBIDDEN MODIFY source.yaml [GLOBAL_CONSTRAINT inherited]
R: ABSENT
V: ABSENT
```

### WP2

```yaml
I:
  - check.md [INTERMEDIATE_INPUT, from=WP1]
O:
  - fix-plan.md [INTERMEDIATE_OUTPUT]
A:
  - READ check.md
  - GENERATE fix-plan.md
P:
  - 周安 [PERFORMER]
  - 顾辰 [REVIEWER]
C:
  - REVIEW_CONFIRMED(顾辰, fix-plan.md, content_complete) [LOCAL_COMPLETION]
R: ABSENT
V: ABSENT
B: ABSENT
```

### WP3

```yaml
I:
  - fix-plan.md [INTERMEDIATE_INPUT, from=WP2]
O:
  - final-note.md [FINAL_OUTPUT]
A:
  - READ fix-plan.md
  - GENERATE final-note.md
P:
  - 王宁 [PERFORMER]
C:
  - OUTPUT_EXISTS(final-note.md) [GLOBAL_COMPLETION]
R: ABSENT
V: ABSENT
B: ABSENT
```

## Expected Dependency DAG

```text
WP1.O(check.md) → WP2.I(check.md)
WP1.C → ENABLE(WP2)
WP2.O(fix-plan.md) → WP3.I(fix-plan.md)
WP2.C(review_confirmed) → ENABLE(WP3)
SEQUENCE(WP1, WP2)
SEQUENCE(WP2, WP3)
```

## Expected Global 7+1

The Global 7+1 is the normalized union of the three local 7+1 sets with preserved `wp_id`, stage roles, and dependency links.

Mandatory identities:

```text
check.md:
  WP1.O = INTERMEDIATE_OUTPUT
  WP2.I = INTERMEDIATE_INPUT

fix-plan.md:
  WP2.O = INTERMEDIATE_OUTPUT
  WP3.I = INTERMEDIATE_INPUT

final-note.md:
  WP3.O = FINAL_OUTPUT
```

Global C must preserve:

```text
WP1 local completion
WP2 reviewed completion
WP3 global completion
```

---

# M03 — Parallel fork and join

## Source

```text
本任务包含两个可并行的检查阶段和一个汇总阶段。

API 检查由赵岚负责。赵岚读取 spec.md，生成 api-review.md。api-review.md 已生成后，API 检查完成。

安全检查由何清负责。何清读取 spec.md，生成 security-review.md。security-review.md 已生成后，安全检查完成。

两个检查阶段可以并行。汇总阶段只有在 API 检查和安全检查都完成后开始。陈路读取 api-review.md 和 security-review.md，生成 release-review.md。release-review.md 已生成后，整个任务完成。

不得修改 spec.md。
```

## Expected WP Tree

```text
WP0
├─ WP1  API 检查
├─ WP2  安全检查
└─ WP3  汇总
```

## Expected Local 7+1

### WP1

```yaml
I:
  - spec.md [EXTERNAL_INPUT]
O:
  - api-review.md [INTERMEDIATE_OUTPUT]
A:
  - READ spec.md
  - GENERATE api-review.md
P:
  - 赵岚 [PERFORMER]
C:
  - OUTPUT_EXISTS(api-review.md)
B:
  - FORBIDDEN MODIFY spec.md [GLOBAL_CONSTRAINT inherited]
R: ABSENT
V: ABSENT
```

### WP2

```yaml
I:
  - spec.md [EXTERNAL_INPUT]
O:
  - security-review.md [INTERMEDIATE_OUTPUT]
A:
  - READ spec.md
  - GENERATE security-review.md
P:
  - 何清 [PERFORMER]
C:
  - OUTPUT_EXISTS(security-review.md)
B:
  - FORBIDDEN MODIFY spec.md [GLOBAL_CONSTRAINT inherited]
R: ABSENT
V: ABSENT
```

### WP3

```yaml
I:
  - api-review.md [INTERMEDIATE_INPUT, from=WP1]
  - security-review.md [INTERMEDIATE_INPUT, from=WP2]
O:
  - release-review.md [FINAL_OUTPUT]
A:
  - READ api-review.md
  - READ security-review.md
  - GENERATE release-review.md
P:
  - 陈路 [PERFORMER]
C:
  - OUTPUT_EXISTS(release-review.md) [GLOBAL_COMPLETION]
R: ABSENT
V: ABSENT
B: ABSENT
```

## Expected Dependency DAG

```text
PARALLEL(WP1, WP2)

WP1.O(api-review.md) → WP3.I(api-review.md)
WP2.O(security-review.md) → WP3.I(security-review.md)

AND(
  WP1.C,
  WP2.C
) → ENABLE(WP3)
```

No WP1 semantic item may be incorrectly owned by WP2, and vice versa.

---

# M04 — Global basis and global prohibition

## Source

```text
本任务依据 AUDIT-RULE-3 的 v2.0 版本执行，分为两个检查阶段和一个汇总阶段。两个源文件都只能读取，不得修改。

第一阶段由方敏负责。方敏读取 accounts.csv，按照 AUDIT-RULE-3 v2.0 检查账号记录，并生成 account-review.md。account-review.md 已生成后，第一阶段完成。

第二阶段由许晨负责。许晨读取 permissions.csv，按照同一规则检查权限记录，并生成 permission-review.md。permission-review.md 已生成后，第二阶段完成。

两个检查阶段都完成后，汇总阶段开始。郭辰读取 account-review.md 和 permission-review.md，生成 audit-summary.md。audit-summary.md 已生成后，整个任务完成。
```

## Expected WP Tree

```text
WP0
├─ WP1  账号检查
├─ WP2  权限检查
└─ WP3  汇总
```

## Expected WP0 global contract

```yaml
V:
  - BASIS AUDIT-RULE-3
    version: v2.0
B:
  - FORBIDDEN MODIFY accounts.csv
  - FORBIDDEN MODIFY permissions.csv
```

These are global constraints/basis and must not be duplicated into unrelated child-local Canonical facts merely to satisfy inheritance.

## Expected Local 7+1

### WP1

```yaml
I:
  - accounts.csv [EXTERNAL_INPUT]
O:
  - account-review.md [INTERMEDIATE_OUTPUT]
A:
  - READ accounts.csv
  - CHECK account_records
  - GENERATE account-review.md
P:
  - 方敏 [PERFORMER]
V:
  - uses WP0.V AUDIT-RULE-3 v2.0
C:
  - OUTPUT_EXISTS(account-review.md)
B:
  - constrained_by WP0.B(accounts.csv)
R: ABSENT
```

### WP2

```yaml
I:
  - permissions.csv [EXTERNAL_INPUT]
O:
  - permission-review.md [INTERMEDIATE_OUTPUT]
A:
  - READ permissions.csv
  - CHECK permission_records
  - GENERATE permission-review.md
P:
  - 许晨 [PERFORMER]
V:
  - uses WP0.V AUDIT-RULE-3 v2.0
C:
  - OUTPUT_EXISTS(permission-review.md)
B:
  - constrained_by WP0.B(permissions.csv)
R: ABSENT
```

### WP3

```yaml
I:
  - account-review.md [INTERMEDIATE_INPUT, from=WP1]
  - permission-review.md [INTERMEDIATE_INPUT, from=WP2]
O:
  - audit-summary.md [FINAL_OUTPUT]
A:
  - READ account-review.md
  - READ permission-review.md
  - GENERATE audit-summary.md
P:
  - 郭辰 [PERFORMER]
C:
  - OUTPUT_EXISTS(audit-summary.md) [GLOBAL_COMPLETION]
R: ABSENT
V:
  - governed_by WP0.V
B: ABSENT
```

## Expected Dependency DAG

```text
PARALLEL(WP1, WP2)

WP1.O(account-review.md) → WP3.I(account-review.md)
WP2.O(permission-review.md) → WP3.I(permission-review.md)

AND(
  WP1.C,
  WP2.C
) → ENABLE(WP3)

USES_AS_BASIS(WP1, WP0.V)
USES_AS_BASIS(WP2, WP0.V)
USES_AS_BASIS(WP3, WP0.V)
```

## Expected Global 7+1

Global V contains one normalized basis identity:

```text
AUDIT-RULE-3 v2.0 [GLOBAL]
```

Global B contains exactly:

```text
FORBIDDEN MODIFY accounts.csv
FORBIDDEN MODIFY permissions.csv
```

Global O contains:

```text
account-review.md [INTERMEDIATE_OUTPUT]
permission-review.md [INTERMEDIATE_OUTPUT]
audit-summary.md [FINAL_OUTPUT]
```

Global I contains:

```text
accounts.csv [EXTERNAL_INPUT]
permissions.csv [EXTERNAL_INPUT]
account-review.md [INTERMEDIATE_INPUT, produced_by=WP1]
permission-review.md [INTERMEDIATE_INPUT, produced_by=WP2]
```

No duplicate Global V/B fact is allowed due to child inheritance.

---

# Final 017 acceptance

The parser must produce, for each M01–M04:

1. exact block structure;
2. correct WP0/WP1... ownership;
3. complete local 7+1;
4. correct semantic matrix;
5. correct dependency DAG;
6. correct single Global Canonical 7+1;
7. no unsupported orchestration edge;
8. no cross-WP contamination;
9. exact repeatability.
