# 7P-ADMIN-SHORT-018-R1 — G0 Qualified-Domain and Identity Closure

## 0. Identity

- TASK: `7P-ADMIN-SHORT-018-R1`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Parent task: `7P-ADMIN-SHORT-018`
- Parent outcome: `ADMIN_SHORT_CORE_METHOD_GAP`
- Parent commit: `03b6dd6a85d5155226fe507e44e99ff5002c9166`
- ADMIN adjudication: `docs/tasks/7plus1/7P-ADMIN-SHORT-018-R1-ADMIN-ADJUDICATION.md`
- Diagnostic corpus: `fixtures/7plus1/admin-short-050-r02/CASES.md`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Purpose

Do not proceed to G1, G2, G3 or holdout.

The sole purpose is to determine whether the existing v0.3 semantic method can close G0 once the runtime contract is reconciled with the normative relation space and qualified semantic domains are represented explicitly.

Target:

```text
ADM-003
ADM-006
ADM-012
ADM-021
ADM-047
→ FULL_ROOT_7PLUS1_CLOSED = 5/5
```

No WP decomposition. No Matrix. No Hybrid. No model changes. No Pack changes.

## 2. Required reading

Read in full:

1. CURRENT-TASK
2. this taskbook
3. `7P-ADMIN-SHORT-018-R1-ADMIN-ADJUDICATION.md`
4. sealed 018 REPORT / FINAL-OUTCOME / G0-GATE / FIRST-DIVERGENCE / FALSE-WRONG-STATUS
5. 50-case source corpus
6. v0.3 normative sections on Relation Space, Graph Constraint Resolution, Scope, Condition, Coreference and OUTPUT_CONTENT
7. frozen runtime relation contract in 014
8. 018 candidate implementation and retained R2 short parser

## 3. First mandatory audit — method vs runtime contract

Before coding, create:

`METHOD-RUNTIME-CONTRACT-DIFF.json`

Compare the normative finite relation list with the candidate runtime `RELATION_CONTRACT`.

The report must explicitly record that v0.3 lists `PART_OF` and whether runtime implements it.

This task authorizes runtime support for **PART_OF only** among missing normative relation types identified by the current failure.

If additional missing relation types are discovered, report them but do not add them without separate ADMIN authorization unless they are already implemented through a provably equivalent typed structure.

## 4. Gate A — narrowly typed PART_OF

Add a candidate-only `PART_OF` relation contract consistent with v0.3.

Requirements:

- narrow node signatures;
- exact provenance;
- relation type audit;
- no nearest-noun heuristic;
- no arbitrary transitive closure;
- no automatic slot projection merely because PART_OF exists.

Use it only when explicit syntax/structure proves a composition/reference domain.

Independent non-Gold tests must include:

1. one source file + “其中所有条目...” → certified local member domain;
2. two possible source containers → UNRESOLVED;
3. output section PART_OF output artifact;
4. unrelated nearby noun → no PART_OF;
5. English “all entries in the manifest” equivalent.

Gate A must pass before ADM replay.

## 5. Gate B — QualifiedDomain IR

Implement an internal typed structure equivalent to:

```text
QualifiedDomain {
  domain_id
  base_entity_id
  member_selector
  property_selector
  quantifier
  qualifier_expr_id
  source_span_ids
  relation_ids
  proof_refs
}
```

Do not create a new Canonical slot.

### ADM-006 target

For:

```text
读取 backup-index.csv
检查其中所有备份的校验结果
```

certify:

```text
base = backup-index.csv
member_selector = backups
property_selector = validation_result
quantifier = ALL
```

The root I must remain the explicit source input `backup-index.csv`.

The CHECK action scope must be the qualified domain, not an opaque phrase treated as a separate input artifact.

### Report coverage target

For:

```text
QA 确认报告覆盖清单中的每一项后
```

the REVIEW_CONFIRMED state must refer to:

- the exact report output;
- the source list/member domain;
- quantifier ALL.

Raw text alone is not closure.

## 6. Gate C — compound qualifier expression owned by review state

Support a typed qualifier expression for:

```text
每个删除或改名的接口都已记录
```

Required semantics:

```text
domain = interfaces
quantifier = ALL
qualifier = OR(DELETED, RENAMED)
owner = REVIEW_CONFIRMED state
```

Requirements:

- DELETED/RENAMED are state qualifiers, not current execution actions;
- no DELETE/RENAME A or B fact is created merely from this phrase;
- OR is preserved structurally;
- reviewer, report owner and transfer condition remain intact.

Add at least 5 non-Gold tests:

- delete OR rename;
- added OR removed;
- AND qualifier;
- quoted “deleted” wording in report content;
- explicit real delete action as positive control to ensure action semantics still work.

## 7. Gate D — generic source-object identity

Support source-certified coreference such as:

```text
读取 orders.csv
...
不得更改原始数据
```

Expected:

```text
原始数据 ≡ orders.csv
```

only if exactly one compatible explicit source artifact exists in the governing task scope.

Requirements:

- use COREFERENCE or equivalent typed identity proof;
- do not use nearest token distance alone;
- do not merge if two compatible source inputs remain;
- do not merge an output with “原始数据”;
- preserve prohibition modality and exact source spans.

Add at least 6 non-Gold tests:

1. one input + 原始数据 → resolve;
2. two inputs + 原始数据 → UNRESOLVED;
3. one input + 原始文件 → resolve;
4. one input + source data → resolve;
5. output plus input + 原始数据 → input only;
6. unrelated “历史原始数据” in background → no current-task identity.

## 8. G0 replay

Only after Gates A–D pass, replay exactly:

- ADM-003
- ADM-006
- ADM-012
- ADM-021
- ADM-047

Success requires:

```text
FULL_ROOT_7PLUS1_CLOSED = 5/5
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
compiler_unresolved_on_clear_source = 0
```

All prior correct semantics must remain intact.

## 9. Retention gates

Must retain:

- D01–D08 = 8/8
- REF-001 = 43/43
- ADM-003 previously closed
- ADM-047 previously closed
- original Parser regression
- existing 018 focused tests

No regression may be hidden by semantic-equivalence exceptions unless an ADMIN adjudication already exists.

## 10. Stop rule

If G0 reaches 5/5:

terminal outcome:

`ADMIN_SHORT_G0_METHOD_CLOSED`

Stop and return to ADMIN.

Do **not** continue to G1 in this task.

If G0 remains below 5/5 after the authorized generic mechanisms:

terminal outcome:

`ADMIN_SHORT_G0_ARCHITECTURE_GAP_REMAINS`

Stop. Do not create another phrase/rule loop.

## 11. Anti-overfit rules

Forbidden:

- ADM case-ID branches;
- filenames specific to ADM-006/012/021;
- source hashes or offsets;
- expected-answer runtime reads;
- literal special cases for backup-index.csv, orders.csv, api-old.json, api-new.json;
- changing source text;
- changing semantic review to match output;
- adding an unapproved new relation type.

Independent controls must use different nouns, filenames, participants and word order.

## 12. Required report package

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-018-R1/`

At minimum:

- REPORT.md
- ADMIN-ADJUDICATION-READBACK.json
- METHOD-RUNTIME-CONTRACT-DIFF.json
- PART-OF-CONTRACT-AUDIT.json
- QUALIFIED-DOMAIN-AUDIT.json
- COMPOUND-QUALIFIER-AUDIT.json
- SOURCE-IDENTITY-AUDIT.json
- NON-GOLD-CONTROLS.json
- G0-GATE.json
- FULL-5-SEMANTIC-REVIEW.json
- FALSE-WRONG-STATUS.json
- D01-D08-RETENTION.json
- REF001-RETENTION.json
- REPEATABILITY.json
- ANTI-OVERFIT-AUDIT.json
- ORIGINAL-REGRESSION.json
- FULL-REGRESSION.json
- FINAL-OUTCOME.json
- NEXT-TASK-RECOMMENDATION.md
- VERIFY.json
- MANIFEST.json
- SHA256SUMS.txt
- SEAL.md
- SEAL-VERIFICATION.json

## 13. Regression

After candidate freeze:

- run focused R1 tests;
- run retained 018 tests;
- run D01–D08;
- run REF-001;
- run original Parser regression;
- run full repository regression only if G0=5/5;
- repeat the five G0 cases and independent controls and compare semantic signatures exactly.

## 14. Git rules

- work only on `review/7plus1-parser`;
- preserve 018 seal;
- preserve 50 source texts;
- preserve Gold and v0.3 method bytes;
- candidate-only runtime changes;
- no merge/release/tag;
- no production switch;
- stop at `WAITING_ADMIN_REVIEW`.

## 15. Final return

Return:

- TASK
- final commit
- terminal outcome
- method/runtime contract diff
- PART_OF gate
- QualifiedDomain gate
- compound qualifier gate
- source identity gate
- G0 full closure count
- partial_RESOLVED count
- wrong binding count
- unsupported RESOLVED count
- D01–D08 retention
- REF retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
