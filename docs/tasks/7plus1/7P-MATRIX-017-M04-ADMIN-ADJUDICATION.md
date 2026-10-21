# 7P-MATRIX-017 — ADMIN M04 Orchestration Adjudication

## Decision

The 017 pre-implementation stop was correct.

For M04, the source:

> 两个检查阶段都完成后，汇总阶段开始。

proves a **join dependency** on both predecessor completions. It does **not** prove that WP1 and WP2 are permitted or required to execute in parallel.

Therefore the frozen M04 expectation is amended as follows:

### Removed expectation

```text
PARALLEL(WP1, WP2)
```

### Retained expectations

```text
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

All other M04 source and expected semantic contracts remain unchanged.

## Generic orchestration rule

For 017 and later:

1. `PARALLEL(WPi, WPj)` is a positive orchestration fact and requires positive source evidence that parallel/concurrent execution is allowed or intended.
2. The absence of a sequence edge is **not** evidence of parallelism.
3. A join that depends on both predecessor completions does not, by itself, determine the relative ordering of those predecessors.
4. When the source does not determine the relative order of two predecessor WPs, the certified DAG should contain neither `SEQUENCE` nor `PARALLEL` between them.
5. This underdetermined relation is not a parser failure; it is an intentionally uncertified orchestration relation.

This preserves the evidence-first rule and prevents the parser from inventing scheduling freedom.

## M03 contrast

M03 remains the positive PARALLEL case because its source explicitly states:

> 两个检查阶段可以并行。

So M03 must still certify `PARALLEL(WP1, WP2)`.

## Status

`ADMIN_MATRIX_CASE_ADJUDICATED`

The original frozen-case file remains preserved for audit. This adjudication is the authoritative override for the single M04 PARALLEL expectation.
