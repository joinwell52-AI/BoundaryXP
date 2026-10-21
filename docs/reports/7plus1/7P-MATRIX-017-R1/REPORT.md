# 7P-MATRIX-017-R1 — G0 failed; diagnostic implementation sealed

STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false

Implemented an isolated ordered-Block/WP matrix compiler using the unchanged R2 local compiler. Actual HanLP/spaCy entry analyzed exact source views. No rewritten short-task prompts, expected-driven synthesis, new models, Hybrid, or production switch. The original M04 expectation and all prior seals remain unchanged; ADMIN removes only M04 PARALLEL.

## Outcome

| check | result |
| --- | --- |
| Exact Blocks / WP tree | 4/4 / 4/4 |
| Local 7+1 / DAG / semantic matrix / global 7+1 | 0/4 / 0/4 / 0/4 / 0/4 |
| Matrix reference/equation integrity | 4/4 (not semantic completeness) |
| M03 explicit parallel | PASS |
| M04 no inferred parallel or sequence | PASS |
| G0 | FAIL |
| G1 / G2 / G3 | BLOCKED_BY_G0; diagnostic replay executed |
| D01–D08 / REF-001 | 8/8 / 43/43 |
| Focused / retained R2 / non-Gold orchestration | 14/14 / 19/19 / 6/6 |
| Original Parser regression | 4345 pass, 0 fail, 0 skip |
| Full repository | NOT_RUN — required after G3; G0 failed |
| Fresh repeatability | EXACT, 13/13 inputs |
| Anti-overfit / protected assets | PASS / PASS (11231 paths) |

## First divergence and semantic limits

The earliest source-ordered failure is M01 B2 (stage responsibility); local R2 does not recognize the preposed stage target. The first emitted diagnostic is B3 [21,39), “Action modality is not explicit”. READ retains correct dependency evidence but no certified directive modality. Stage completion additionally remains unresolved because the existing local completion-domain rule recognizes task/任务. Matrix structure alone cannot turn these absent I/C endpoints into certified O→I or C→Enable. See [ROOT-CAUSE-EVIDENCE.json](ROOT-CAUSE-EVIDENCE.json).

M01/M02 also misclassify generated plans as V in basis-adjunct constructions. M04 V preserves only v2.0 rather than the full rule identity; its 3 inherited USES_AS_BASIS edges have source relation evidence but fail endpoint semantic certification. They count as 3 unsupported RESOLVED edges under the strict gate. Root B cannot yet bind both source files. These are failures, not source ambiguity or success-by-abstention.

Wrong structural WP assignments=0; wrong emitted O→I identity=0; wrong emitted completion binding=0; cross-WP source contamination=0. The zero O→I/completion wrong-binding counts have **zero emitted links**, with **7 missing O→I links and 7 missing completion dependencies**. Do not interpret zeros as coverage success.

## Evidence

- [M01 readable result](case-review/M01/RESULT.md) · [full trace](final-first/M01/trace.json)
- [M02 readable result](case-review/M02/RESULT.md) · [full trace](final-first/M02/trace.json)
- [M03 readable result](case-review/M03/RESULT.md) · [full trace](final-first/M03/trace.json)
- [M04 readable result](case-review/M04/RESULT.md) · [full trace](final-first/M04/trace.json)

All slot-level expected/missing/partial/extra actual items are in [GLOBAL-7PLUS1-COMPARISON.json](GLOBAL-7PLUS1-COMPARISON.json); each matrix ID resolves to a typed item, exact global source span and local full proof/IR. Scope, condition and quantity IDs are explicitly namespaced by local run. [SEMANTIC-ERRORS.json](SEMANTIC-ERRORS.json) retains every mismatch. Candidate and first failed outputs are not overwritten.

Short retention is freshly executed and structurally exact against sealed R2, including the genuine “上述材料” ambiguity. It uses the accepted R2 contracts; historical raw REF A/C differences are not silently changed. Exact semantic replay excludes clock/performance envelopes only.

## Scope / publication

Only new R1 runtime, test and report artifacts are committed. No Parser production entry, Pack, model, threshold, Gold, Source, v0.3 method or old seal changes. No merge/release/tag. G0 failure stops further architecture work and long STANDARD. Integrity SEAL does not claim ADMIN or semantic acceptance.
