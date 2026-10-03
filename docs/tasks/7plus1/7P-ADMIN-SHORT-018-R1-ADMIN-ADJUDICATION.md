# 7P-ADMIN-SHORT-018-R1 — ADMIN G0 Method/Contract Adjudication

## Decision

The sealed 018 result is accepted as a valid failure.

It does **not** establish that the v0.3 7+1 method is wrong.

The first divergence exposes a concrete mismatch between the normative method and the frozen runtime relation contract:

- the normative v0.3 method explicitly lists `PART_OF` in the finite Relation Space;
- the frozen 014 runtime `RELATION_CONTRACT` does not expose `PART_OF`;
- 018 therefore attempted a method-authorized relation that the implementation contract rejected.

This is an implementation-contract gap and must be reconciled before concluding a method gap.

## Authorized scope

ADMIN authorizes one bounded G0 closure task to test whether the existing v0.3 method is sufficient for the three remaining semantic classes:

1. qualified member / property domains;
2. compound review qualifiers such as universal `delete OR rename`;
3. generic source-object identity such as `原始数据` referring to a unique explicit source input.

No G1–G3 or holdout work is authorized until G0 reaches 5/5.

## 1. PART_OF reconciliation

`PART_OF` is already normative in v0.3 and may be added to the candidate runtime relation contract with a narrowly typed signature and relation audit.

It must be used only with source-certified composition/reference evidence.

It must not become a generic nearest-noun attachment rule.

## 2. QualifiedDomain

ADMIN authorizes an internal typed semantic object equivalent to:

```text
QualifiedDomain {
  base_entity_id
  member_selector?
  property_selector?
  quantifier?
  qualifier_expr_id?
  source_span_ids[]
  proof_refs[]
}
```

This object is internal semantic IR. It is not a new 7+1 slot.

Examples:

```text
backup-index.csv
  → ALL backups
  → validation-result property

interfaces
  → ALL members
  → qualifier = DELETED OR RENAMED
```

The domain must remain attached to the correct action/review state.

## 3. Review-state ownership

Phrases inside:

```text
QA 确认 ...
```

that describe what the report must cover or record belong to the REVIEW_CONFIRMED state/condition.

They must not become current execution actions or prohibitions.

## 4. Generic source-object identity

A generic phrase such as:

```text
原始数据
原始文件
source data
source file
```

may corefer to a prior explicit input only when there is exactly one compatible source artifact in the governing task scope and the phrase is semantically compatible.

Use the existing `COREFERENCE` mechanism or an equivalent typed identity proof.

If multiple compatible source artifacts remain, the result must be UNRESOLVED rather than guessed.

## 5. Method verdict rule

If these normative/internal mechanisms close all five G0 cases with independent counterexamples and no unsupported RESOLVED facts, the previous `ADMIN_SHORT_CORE_METHOD_GAP` is reclassified as an implementation-contract gap for G0.

If G0 still cannot close after this bounded reconciliation, stop again for ADMIN architecture review.

## Status

`ADMIN_G0_METHOD_CONTRACT_RECONCILIATION_AUTHORIZED`

No Gold, Source, production entry, models, Packs, WP/Matrix runtime, or historical seal may be changed.
