# 7P-SHORT-016-R2 — ADMIN REF-001 Semantic Adjudication

## Purpose

This adjudication separates genuine parser defects from source-supported representation enrichment in REF-001.

It does not modify REF-001 Source or Gold.

## A. Identity

`编辑沈悦` and `沈悦` denote the same participant when the source establishes the role-qualified full identity and later uses the unique bare name.

Canonical participant identity must therefore be normalized to one semantic identity:

```text
沈悦 ≡ 编辑沈悦
```

The preferred display identity is the most informative source-supported form: `编辑沈悦`.

This is a generic role-qualified-name alias rule, not a REF-specific rewrite.

## B. Subject inheritance boundary

A unique task performer may support omitted subjects only when the local predicate is an execution action whose grammatical/semantic owner is the performer.

Do not inherit the performer into:

- declarative artifact state/basis propositions;
- output-format conformance where the grammatical subject is the artifact/format;
- task-level prohibition facts whose source does not locally identify an actor;
- completion/state propositions.

Therefore a global/current-task performer is not a blanket subject for every later predicate.

## C. Completion

The source sentence:

```text
只有唐宁确认纪要没有遗漏讨论事项，并且所有未明确负责人的事项都已正确标注，本次整理才算完成。
```

is a conjunction. Completion requires both source-supported operands.

The parser must preserve the logical form:

```text
AND(
  reviewer_confirms_no_omission,
  all_unassigned_items_correctly_marked
)
```

A local negative/existence interpretation of only the first operand is not equivalent.

## D. Scope representation

Adding an explicit ITEM scope to an action whose object identity is already explicit is allowed as representation enrichment **only if it is semantically equivalent and does not alter cardinality, condition, owner, or object identity**.

Comparator/audit must distinguish such equivalent enrichment from a true semantic mismatch.

## E. Coverage locality

A real unresolved coreference that only affects the B fact for `上述材料` must not by itself force unrelated I or A slots to `PARSER_COVERAGE_FAILURE`.

Coverage propagation must remain slot-local.

## Status

`ADMIN_REF001_SEMANTIC_ADJUDICATED`

No Gold/Source bytes are changed.
