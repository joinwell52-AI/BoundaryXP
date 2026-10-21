# 7P-ADMIN-SHORT-020-LONG — ADMIN Generalization Closure Authorization

## Decision

ADMIN authorizes one autonomous long-running engineering task to close the remaining generalization gaps of the ADMIN short-task 7+1 parser and prove that the result generalizes beyond the frozen 50-case development corpus.

Baseline:

- `7P-ADMIN-SHORT-019-LONG`
- commit `4d358fa5de5f224865fe7592459b06b9c6216204`
- 50/50 development cases closed
- 48/48 independent controls
- final shadow 92/100
- 8 shadow failures grouped into four generic semantic mechanisms
- G0 5/5
- D01–D08 8/8
- REF-001 43/43
- original parser 4400/4400
- full regression 6342 pass / 0 fail / 17 skipped
- repeatability 325/325 EXACT

## Engineering objective

Codex shall autonomously close the four known generalization mechanisms:

1. scope exclusion / restriction paraphrases;
2. predicate synonym normalization plus transfer/coordination flow composition;
3. completion-condition composition under paraphrased/shared predicates;
4. lower-bound retry quantity semantics (`GTE`) and typed retry targets.

Codex may make generic internal IR / resolver / normalizer / composition changes within the existing v0.3 semantics.

The 8 failed 019 shadow cases are now authorized as development regressions. They no longer count as independent evidence after repair.

## Generalization proof requirement

After closing the known gaps, Codex must prove generalization on **fresh unseen shadow suites**.

A final shadow suite is valid only if:

- its source texts and semantic oracle are frozen before parser execution;
- it does not copy the 50 main cases, the 019 shadow texts, or their literal identities;
- parser output is not used to author or modify the oracle;
- no runtime change occurs after the suite is opened if that suite is to count as blind evidence.

The final success requirement is **two consecutive fresh blind shadow suites, each 120/120, on the same frozen candidate with no tuning between them**.

If a blind suite fails, its inputs/results become permanent evidence and may be used as development material for a generic repair. After repair, the consecutive-pass count resets to zero and Codex must generate entirely new blind suites.

Codex may perform up to **three generic repair cycles after the initial 019 baseline**. If the required two consecutive 120/120 blind suites cannot be achieved within that budget, stop for ADMIN review with exact semantic first divergences.

## Authority

Codex may autonomously:

- refactor the isolated candidate parser;
- introduce internal lexical normalization layers;
- introduce/extend typed ScopeExpr, RestrictionExpr, QuantityExpr, RetryTarget, ConditionExpr, CompletionExpr, FlowExpr and equivalent internal structures;
- add deterministic synonym normalization where source meaning is preserved;
- add generic Chinese/English lexical coverage;
- add source-certified ownership/coreference/role/flow composition;
- create development controls, metamorphic tests, contrastive tests and fresh blind shadow suites;
- rerun the full 50-case corpus and all regressions;
- continue through ordinary parser bugs without returning to ADMIN.

## Not authorized

Do not:

- change I/O/A/P/R/V/C/B meanings;
- change frozen 50 source tasks;
- weaken semantic acceptance criteria;
- copy expected answers into runtime;
- introduce case IDs, source hashes, offsets, literal fixture filenames or participant names into runtime rules;
- use an LLM/hybrid answer generator as Canonical authority;
- train models or change Packs;
- modify production entry;
- merge/release/tag.

## Stop conditions

Stop before exhausting the repair-cycle budget only if:

- `METHOD_CONTRACT_REVIEW_REQUIRED`: v0.3 semantics itself must change;
- `ARCHITECTURE_REVIEW_REQUIRED`: a clear semantic class cannot be represented without contradictory internal semantics;
- `IMPLEMENTATION_GATE_FAILED`: candidate cannot be made executable/testable without violating protected assets.

Ordinary failed tests, missing synonyms, missing bindings, incomplete ASTs or incomplete quantity/condition composition are not stop conditions.

## Success outcome

`ADMIN_SHORT_GENERALIZATION_VALIDATED`

requires:

- frozen 50 development corpus = 50/50;
- old 019 shadow regression = 100/100;
- all authorized development controls pass;
- two consecutive fresh blind suites = 120/120 + 120/120 on one unchanged candidate;
- zero partial RESOLVED;
- zero wrong binding;
- zero unsupported RESOLVED;
- zero clear-source unresolved;
- G0, D01–D08, REF-001 retained;
- anti-overfit PASS;
- repeatability EXACT;
- original and full regression PASS.

## Status

`ADMIN_020_LONG_GENERALIZATION_AUTHORIZED`
