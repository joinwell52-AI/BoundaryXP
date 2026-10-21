# 7P-ADMIN-SHORT-018-R2 — G1 Basis/Version and Resource Closure

## 0. Identity

- TASK: `7P-ADMIN-SHORT-018-R2`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Parent result: `ADMIN_SHORT_G0_METHOD_CLOSED`
- Parent commit: `64a1d3b9aecffb3314a796cff0ab7c30e939fb63`
- ADMIN G1 contract: `docs/tasks/7plus1/7P-ADMIN-SHORT-018-R2-ADMIN-CONTRACT.md`
- Diagnostic corpus: `fixtures/7plus1/admin-short-050-r02/CASES.md`
- Candidate baseline: sealed 018-R1 implementation
- PRODUCTION_READY=false

## 1. Purpose

Do G1 only.

Do not run G2, G3 or the 30-case holdout.

The sole objective is to prove that the current deterministic semantic method can close standardized ADMIN tasks involving:

- complete Basis + Version identity;
- task time/resource limits;
- exact role and negative-action binding around those semantics.

Target cases:

```text
ADM-001
ADM-010
ADM-026
ADM-032
ADM-048
```

Success target:

```text
G0 retained = 5/5
G1 = 5/5 FULL_ROOT_7PLUS1_CLOSED
```

## 2. Required reading

Read in full:

1. CURRENT-TASK
2. this taskbook
3. `7P-ADMIN-SHORT-018-R2-ADMIN-CONTRACT.md`
4. sealed 018-R1 REPORT / FINAL-OUTCOME / G0-GATE
5. R1 candidate implementation:
   - relations.mjs
   - domains.mjs
   - contract-gates.mjs
   - engine.mjs
6. 018 parent implementation:
   - root-frames.mjs
   - state-bindings.mjs
7. ADM-001/010/026/032/048 source texts
8. v0.3 method sections on Basis/Reference, Quantity, Condition, Participant and Prohibition

## 3. Freeze G1 baseline before coding

Before changing code, run the R1 candidate on ADM-001/010/026/032/048 and save:

- baseline Canonical 7+1;
- full Trace;
- slot statuses;
- exact missing/partial/wrong facts;
- first divergence per case.

Create:

`G1-BASELINE.json`

Do not derive implementation rules from expected slot strings alone; diagnose the semantic stage that loses or corrupts the source fact.

## 4. Gate A — BasisReference identity composition

Implement a generic typed BasisReference object or equivalent graph pattern.

It must represent:

```text
BasisReference {
  identifier_node_id
  version_node_id?
  reference_kind
  source_span_ids
  relation_ids
  proof_refs
}
```

### Required behavior

```text
RELEASE-6 + v3.0
SEARCH-SPEC-5 + v1.2
CHECK-19 + v2.4
→ one semantic V identity each
```

Do not emit:

- identifier-only + version-only duplicate V entries;
- version-only V when identifier is present;
- an input artifact solely because it is near a basis phrase.

### Independent controls

Freeze before implementation at least 8 controls:

1. Chinese basis + version;
2. English basis + version;
3. basis without version;
4. version token not governed by a basis phrase → must not become task V;
5. two basis identifiers with independent versions;
6. one identifier with two competing versions → UNRESOLVED unless syntax disambiguates;
7. file input next to basis phrase stays I;
8. “version in inspected data” remains an inspected property, not V.

Gate A passes only if all controls pass.

## 5. Gate B — Resource/Quantity target binding

Extend quantity composition only where source evidence certifies execution-resource semantics.

### Required task-time patterns

Support equivalent constructions:

```text
整个任务须在 40 分钟内完成
整个任务最多使用 20 分钟
within 30 minutes
不得超过 45 分钟
```

Compile to:

```text
R:
  metric = TIME
  comparator = LTE
  value = N
  unit = minute
  target = CURRENT_TASK / governed execution task
```

### Negative controls

Do not turn into R:

- 最近一小时的日志;
- 15 天内到期的证书;
- 85% coverage threshold;
- v2.4 version;
- “最多 3 个异常类别” if it constrains report content rather than execution resource.

### Independent controls

Freeze at least 8:

1. Chinese total-task time;
2. English within-N-minutes;
3. retry count;
4. memory limit;
5. observed one-hour window → not R task time;
6. percentage threshold → not R;
7. report-content count → not R;
8. task time + content number in same text → bind each correctly.

Gate B passes only if all controls pass.

## 6. Gate C — Negative action/object integrity

G1 cases contain prohibitions that must survive Basis/R repairs.

Certify generically:

- do not execute release;
- do not modify source code;
- do not modify release configuration;
- do not load model weights;
- do not initiate inference;
- do not adjust recall threshold;
- do not rebuild index;
- do not change configuration.

Requirements:

- forbidden predicate stays FORBIDDEN;
- object identity complete;
- forbidden objects do not automatically become I;
- no negation reversal;
- no positive A fact for the prohibited action.

Add at least 6 independent negative controls with different nouns/verbs.

## 7. Gate D — participant/flow retention

Do not regress actor/reviewer/recipient semantics while fixing G1.

At minimum verify:

- ADM-001 PM coordinator, OPS performer, QA reviewer, ADMIN recipient;
- ADM-010 QA performer, PM submitter, ADMIN recipient;
- ADM-026 DEV performer, PM coordinator, QA reviewer;
- ADM-032 DEV performer, QA reviewer, PM submitter, ADMIN recipient;
- ADM-048 QA reviewer, PM recipient.

No title/name-specific code.

## 8. G1 replay

Only after Gates A–D and independent controls pass, replay exactly:

- ADM-001
- ADM-010
- ADM-026
- ADM-032
- ADM-048

Success requires all five:

`FULL_ROOT_7PLUS1_CLOSED`

And aggregate:

```text
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
basis_split_or_version_only = 0
wrong_quantity_target = 0
compiler_unresolved_on_clear_G1_source = 0
```

## 9. Retention

Must rerun and retain:

- G0 ADM-003/006/012/021/047 = 5/5
- D01–D08 = 8/8
- REF-001 = 43/43
- R1 PART_OF/QualifiedDomain/compound qualifier/source identity controls
- original Parser regression

Do not count schema/contract PASS as semantic closure.

## 10. Stop rule

If G1 = 5/5:

terminal outcome:

`ADMIN_SHORT_G1_METHOD_CLOSED`

Stop and return to ADMIN.

Do not continue to G2.

If G1 remains below 5/5 after generic mechanisms and controls:

terminal outcome:

`ADMIN_SHORT_G1_ARCHITECTURE_GAP_REMAINS`

Stop. Do not start another phrase-specific repair loop.

## 11. Anti-overfit

Forbidden:

- case IDs;
- ADM filenames or participant names in runtime rules;
- source hashes;
- offsets;
- expected-answer runtime reads;
- literal switches for RELEASE-6 / SEARCH-SPEC-5 / CHECK-19;
- weakening V/R/B semantic audits to get a pass.

Run static and behavioral anti-overfit checks.

## 12. Candidate boundary

Create a new isolated candidate, e.g.:

`research/7plus1-parser/v0.3-admin-short-018-r2/`

Do not edit sealed R1 candidate files.

Production entry remains unchanged.

## 13. Required report package

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-018-R2/`

At minimum:

- REPORT.md
- ADMIN-CONTRACT-READBACK.json
- G1-BASELINE.json
- BASIS-REFERENCE-AUDIT.json
- QUANTITY-TARGET-AUDIT.json
- NEGATIVE-ACTION-AUDIT.json
- PARTICIPANT-FLOW-AUDIT.json
- NON-GOLD-CONTROLS.json
- G0-RETENTION.json
- G1-GATE.json
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

## 14. Regression and repeat

After candidate freeze:

- run focused R2 tests;
- run all new non-Gold controls;
- rerun G0;
- rerun G1 twice with fresh NLP;
- run D01–D08;
- run REF-001;
- run original Parser regression;
- run full repository regression only if G1=5/5;
- verify semantic repeatability EXACT for G0/G1/control set.

## 15. Git rules

- work only on `review/7plus1-parser`;
- preserve 018 and 018-R1 seals;
- preserve 50 source texts;
- preserve Gold and normative v0.3 bytes;
- no WP/Matrix;
- no Hybrid/models/Packs;
- no merge/release/tag;
- no production switch;
- stop at `WAITING_ADMIN_REVIEW`.

## 16. Final return

Return:

- TASK
- final commit
- terminal outcome
- Gate A/B/C/D
- G0 retention
- G1 full closure count
- partial_RESOLVED
- wrong binding
- unsupported RESOLVED
- basis split/version-only count
- wrong quantity target count
- D01–D08 retention
- REF-001 retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
