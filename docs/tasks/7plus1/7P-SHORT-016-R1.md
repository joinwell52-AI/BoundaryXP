# 7P-SHORT-016-R1 — Resume G3 after D07 ADMIN Adjudication

## 0. Identity

- TASK: `7P-SHORT-016-R1`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Base: latest branch HEAD carrying sealed `7P-SHORT-016` result and ADMIN D07 adjudication
- Parent task: `7P-SHORT-016`
- Parent result: `ADMIN_CASE_CONTRACT_REVIEW_REQUIRED`
- ADMIN adjudication: `docs/tasks/7plus1/7P-SHORT-016-D07-ADMIN-ADJUDICATION.md`
- Frozen cases: `docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Purpose

Resume the short direct parser only.

Do not add Hybrid, WP decomposition, Matrix, long STANDARD tuning, new models, new Packs, or new relation proposal lanes.

G0/G1/G2 are already PASS and must remain PASS.

The only remaining 016 work is:

1. apply the generic D07 macro-goal refinement/subsumption adjudication;
2. complete D07 OUTPUT_CONTENT + completion semantics;
3. complete the English-equivalent D08 semantics;
4. after G3 PASS, run G4 REF-001;
5. only then run full regression and final certification for 016.

## 2. D07 contract authority

Read the ADMIN adjudication first.

Required semantics:

- “整理说明” is preserved internally as source-supported macro-goal / task-summary semantics;
- it is not a separate Canonical A if the explicit READ + GENERATE workflow fully refines it;
- “说明” is not a separate Canonical I;
- this must be implemented generically as semantic refinement/subsumption, not phrase suppression;
- deployment-guide.md content requirements belong to OUTPUT_CONTENT;
- completion is AND(output exists, section 1 present, section 2 present).

Do not edit the frozen D07 source or expected contract.

## 3. D08

D08 is the English equivalent and must independently close without Chinese-specific logic.

Required:

- policy.yaml = I;
- compliance-note.md = O;
- READ + GENERATE = current-task A;
- Olivia Chen = PERFORMER;
- R/V = ABSENT;
- Findings / Follow-up = OUTPUT_CONTENT owned by compliance-note.md;
- “contain” must not become an extra current-task A;
- C = AND(output exists, Findings present, Follow-up present);
- do not modify policy.yaml = B;
- all slot statuses correct.

## 4. G3 PASS gate

G3 passes only if:

```text
D01–D08 FULL_CASE_CLOSED = 8/8
D01–D08 same-case I/O/A = 8/8
wrong_binding = 0
unsupported_RESOLVED_extra = 0
duplicate_semantic_identity = 0
D07/D08 owned-output-content = complete
D07/D08 completion conjunction = complete
```

and G0/G1/G2 remain PASS.

If G3 fails, stop. Do not run G4.

## 5. G4 — REF-001

After G3 PASS:

Run existing REF-001 source and frozen expected artifacts.

Report separately:

- legacy meeting assertions;
- full Canonical comparison;
- unresolved correctness;
- especially the historical “上述材料” ambiguity.

Do not alter REF-001 Gold/Source.

G4 PASS requires:

- legacy assertions PASS;
- no semantic regression;
- no new wrong binding;
- known ambiguity remains correctly unresolved unless a complete unique referent proof now exists.

Full REF-001 exact closure should be reported honestly; if not closed, classify the remaining gap. Do not hide it with the legacy assertions.

## 6. Final validation

After G4:

- focused R1 tests;
- retained 016 G0–G3 tests;
- original Parser regression;
- full repository regression;
- repeat all D01–D08 + REF-001;
- anti-overfit;
- protected assets;
- SEAL.

## 7. Allowed outcomes

Exactly one:

- `SHORT_DIRECT_PARSER_VALIDATED`
- `G3_OUTPUT_CONTENT_GATE_FAILED`
- `G4_REF001_REGRESSION`
- `REF001_FULL_CLOSURE_GAP_REMAINS`
- `IMPLEMENTATION_GATE_FAILED`

Do not open Matrix/WP work unless `SHORT_DIRECT_PARSER_VALIDATED`.

## 8. Required report

Create:

`docs/reports/7plus1/7P-SHORT-016-R1/`

At minimum:

- REPORT.md
- ADMIN-ADJUDICATION-READBACK.json
- G3-GATE.json
- D07-SEMANTIC-REVIEW.json
- D08-SEMANTIC-REVIEW.json
- OUTPUT-CONTENT-AUDIT.json
- COMPLETION-AUDIT.json
- FULL-CASE-MATRIX.json
- G4-REF001.json
- REF001-FULL-CANONICAL-COMPARISON.json
- SEMANTIC-ERRORS.json
- DUPLICATE-IDENTITY-AUDIT.json
- SLOT-STATUS-AUDIT.json
- REPEATABILITY.json
- FULL-REGRESSION.json
- ANTI-OVERFIT-AUDIT.json
- FINAL-OUTCOME.json
- NEXT-TASK-RECOMMENDATION.md
- VERIFY.json
- MANIFEST.json
- SHA256SUMS.txt
- SEAL.md
- SEAL-VERIFICATION.json

## 9. Git rules

- work only on `review/7plus1-parser`;
- do not modify sealed 016 report;
- do not modify D01–D08 source/expected cases;
- do not modify REF-001 Source/Gold;
- do not merge/release/tag;
- do not switch production;
- stop at `WAITING_ADMIN_REVIEW`.

## 10. Final return

Return:

- TASK
- final commit
- terminal outcome
- G0/G1/G2/G3/G4 states
- D01–D08 full closure
- D01–D08 same-case I/O/A
- wrong-binding
- unsupported RESOLVED extras
- duplicate semantic identities
- D07 output-content/completion result
- D08 output-content/completion result
- REF-001 legacy assertions
- REF-001 full Canonical result
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
