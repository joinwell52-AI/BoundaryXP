# 7P-ADMIN-NATURAL-021-LONG — ADMIN Independent Natural Blind Authorization

## Decision

ADMIN authorizes an independent natural-language blind evaluation of the sealed 020 candidate using the separately authored and frozen 100-case source/oracle package.

This task evaluates whether the validated standardized semantic compiler transfers to naturally worded ADMIN short tasks that were not authored by the parser-development Codex and were not produced by the 019/020 shadow generator.

## Frozen evaluation assets

Source:
`fixtures/7plus1/admin-natural-blind-100/CASES.md`

Source blob SHA:
`15154b2f30453de830f8fd4d78c1a92cf52d9f1e`

Oracle:
`fixtures/7plus1/admin-natural-blind-100/ORACLE.json`

Oracle blob SHA:
`5410fb1d6d71333ff95f01f4d64b6dcf55103866`

Oracle freeze:
`fixtures/7plus1/admin-natural-blind-100/ORACLE-FREEZE.json`

Frozen 020 candidate SHA-256:
`42b1676906fd50576bee5023520584bf55096e047605330cb50d475bbe4ec9d7`

The 100 cases contain 95 clear root-scope tasks plus 5 deliberate ambiguity controls.

## Blind integrity

Before the **first run** on these 100 cases:

- do not change parser runtime;
- do not change model/config/thresholds;
- do not edit Source;
- do not edit Oracle;
- do not weaken the semantic reviewer;
- runtime parser must not read Oracle;
- Oracle may only be read by the post-parse evaluation/review harness.

The first execution result is the independent blind result and must be preserved permanently.

## Correctness

For ANB-001..ANB-095:

- all source-supported semantics in the frozen Oracle must be represented correctly;
- no partial RESOLVED;
- no wrong binding;
- no unsupported RESOLVED;
- no clear source fact left unresolved.

For ANB-096..ANB-100:

- the declared ambiguity must remain unresolved;
- no arbitrary candidate selection is allowed;
- all otherwise-clear semantics must still be represented correctly.

Contract/schema PASS alone is not semantic PASS.

## After the first blind run

If first blind = 100/100:

- preserve the result;
- perform candidate hardening and production-admission **preflight only**;
- do not switch production;
- terminal outcome may be `ADMIN_NATURAL_BLIND_100_VALIDATED`.

If first blind < 100/100:

- preserve exact failures and first divergences;
- the 100-case set becomes development evidence only after the blind result is sealed;
- Codex may autonomously repair generic semantic mechanisms;
- rerun all prior 020 suites and this 100-case set as regression;
- however, the repaired result may **not** be called independent-blind validation;
- terminal outcome must require a new ADMIN-authored blind set for final validation.

## Stop conditions

Stop for ADMIN only if:

- v0.3 public semantics must change;
- I/O/A/P/R/V/C/B meanings must change;
- a new public relation outside the normative relation space is required;
- a genuine architecture contradiction remains.

Ordinary parser implementation gaps should be repaired autonomously after preserving the first blind result.

## Prohibited

- no WP decomposition;
- no Matrix work;
- no LLM/hybrid answer generator as Canonical authority;
- no case-ID/hash/offset/literal fixture hardcoding;
- no production switch;
- no merge/release/tag.

## Status

`ADMIN_021_INDEPENDENT_NATURAL_BLIND_AUTHORIZED`
