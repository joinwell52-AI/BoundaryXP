# BoundaryXP 7+1 · ADMIN Root Benchmark Contract v1

## 1. Purpose

This benchmark validates exactly one capability:

```text
ADMIN Task
→ Root Canonical 7+1
```

The task is issued by ADMIN to PM. The benchmark measures extraction of ADMIN's authority boundary, not PM execution planning.

## 2. Valid input classes

```text
ROOT_ADMIN_VALID
EXPLICIT_MULTI_WP
MULTI_WP_STRUCTURE_REQUIRED
EXECUTION_LEVEL
INVALID_OR_AMBIGUOUS_INPUT
```

Only `ROOT_ADMIN_VALID` belongs to the Single Root Parser primary accuracy metric.

## 3. ROOT_ADMIN_VALID

A valid root task may specify:

- objective and scope;
- final deliverable;
- allowed/required action classes;
- prohibitions and exclusions;
- resource/time/count bounds;
- normative basis/version;
- completion/stop conditions;
- organization-level constraints such as PM accountability or mandatory QA review.

It does not need to enumerate PM's implementation details.

Examples:

```text
请 PM 组织检查系统环境并形成 overall-review.md。
QA 必须复核最终结果。
不得修改被检查配置。
```

## 4. EXECUTION_LEVEL

Texts whose primary body is already a direct execution assignment such as:

```text
DEV 读取 A...
OPS 修改 B...
QA 执行 C...
```

are execution-level semantic cases.

They may remain valuable regression tests for roles/actions/conditions, but they are not primary evidence for ADMIN→PM Root Parser accuracy.

## 5. Multi-WP

If ADMIN explicitly declares:

```markdown
## WP-01 ...
## WP-02 ...
```

the Parser may read those declared scopes.

If a task is clearly multi-WP but lacks explicit WP headings:

```text
MULTI_WP_STRUCTURE_REQUIRED
BoundaryCertification = BLOCKED
```

The Parser must not create or infer WPs.

## 6. Historical benchmark correction

The previous two source sets mixed Root ADMIN tasks with execution-level tasks:

- `fixtures/7plus1/admin-short-050-r02/CASES.md`
- `fixtures/7plus1/admin-natural-blind-100/CASES.md`

A first-sentence structural audit found:

### old 50
- PM-led: 6
- direct-executor-led: 39
- neutral/root-like: 5

### old 100
- PM-led: 2
- direct-executor-led: 72
- neutral/root-like: 18
- other/conditional forms: 8

Therefore their historical scores remain valid for those exact source sets, but they must not be reported as the primary accuracy of the ADMIN→PM Root Parser.

## 7. Corrected benchmark sources

Primary Root benchmark:

- `fixtures/7plus1/admin-root-standard-050-v1/CASES.md`
- `fixtures/7plus1/admin-root-natural-100-v1/CASES.md`

Total:

```text
150 ROOT ADMIN source tasks
```

The natural set includes 5 deliberate ambiguity controls.

These source sets are source-only at creation time. Gold/Oracle must be authored from source semantics and frozen before any blind parser run.

## 8. Primary metrics

Report separately:

```text
Full Root Canonical 7+1 closure
wrong_binding
unsupported_RESOLVED
partial_RESOLVED
clear_source_unresolved
correct_typed_unresolved
source/proof completeness
```

Contract/schema PASS is not semantic PASS.

## 9. Non-metrics

Do not use these as substitutes for Root accuracy:

- execution-level corpus score;
- mechanism-only tests;
- shadow generated from known templates;
- general unit-test pass counts;
- number of RESOLVED slots.

## 10. Fixed interpretation

```text
ADMIN defines authority.
PM later refines execution.
7+1 Parser does not plan.
7+1 Parser does not decompose WP.
Root 7+1 is the ADMIN authority boundary.
```
