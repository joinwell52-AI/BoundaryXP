# 7P-ADMIN-ROOT-RESET-022-REVIEW

## Status

`WAITING_ADMIN_REVIEW`

No parser implementation is authorized by this file.

## Corrected normative method

Read:

`docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`

## Corrected benchmark contract

Read:

`docs/BoundaryXP-7plus1-ADMIN-ROOT-BENCHMARK-CONTRACT-v1.md`

## Corrected source sets

- `fixtures/7plus1/admin-root-standard-050-v1/CASES.md`
- `fixtures/7plus1/admin-root-natural-100-v1/CASES.md`

## Fixed method decision

```text
ADMIN Task
→ Candidate Semantic Graph
→ Deterministic Certification
→ Boundary IR
→ Root Canonical 7+1
```

The Parser:

- parses ADMIN authority only;
- does not generate PM execution plans;
- does not automatically decompose WP;
- reads explicit ADMIN WP headings only;
- blocks obvious multi-WP taskbooks without explicit WP headings;
- treats PM implementation detail as open for later refinement.

Historical 050/021 execution-heavy corpora remain evidence/regression material but are not the primary ADMIN Root benchmark.

Do not change parser code until ADMIN authorizes the next implementation/evaluation task.
