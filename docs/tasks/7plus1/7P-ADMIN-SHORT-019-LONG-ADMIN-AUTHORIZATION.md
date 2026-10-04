# 7P-ADMIN-SHORT-019-LONG — ADMIN Authorization

## Decision

ADMIN authorizes a single long-running engineering task to make the standardized 50-case ADMIN short-task corpus reliably compile to Canonical 7+1.

The purpose is implementation completion, not another five-case research checkpoint.

The sealed R1 result remains the baseline:

```text
G0 = 5/5
PART_OF = PASS
QualifiedDomain = PASS
compound qualifier = PASS
source identity = PASS
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
D01–D08 = 8/8
REF-001 = 43/43
```

## Supersession

`7P-ADMIN-SHORT-018-R2` is preserved as a historical taskbook but is superseded as the active task by `7P-ADMIN-SHORT-019-LONG`.

The old 30-case holdout restriction is also superseded **for this engineering task**.

All 50 frozen ADMIN task briefs may now be used as an engineering acceptance corpus for diagnosis and generic repair.

This does not permit case-specific code.

Generalization must instead be demonstrated after implementation freeze using independent metamorphic / shadow controls that do not reuse case IDs, filenames, participant names, hashes, offsets, or expected runtime values.

## Authority

Codex may autonomously:

- redesign or extend internal semantic IR while preserving Canonical 7+1 meaning;
- add internal typed structures such as BasisReference, QualifiedDomain, ModalityExpr, ConditionExpr, CompletionExpr, OutputContent ownership, QuantityTarget and typed identity;
- add composition / binding / coreference / ownership / scope / condition / quantity resolution modules;
- extend candidate-only schemas and validators where needed for already-authorized v0.3 semantics;
- implement any relation already present in the normative v0.3 finite Relation Space if runtime support is missing;
- refactor candidate parser code when necessary;
- create and run independent controls, metamorphic tests, regression tests and semantic reviewers;
- iterate through failures without returning to ADMIN after every gate.

Codex does **not** need a new ADMIN decision for ordinary implementation gaps inside the existing v0.3 semantic method.

## Stop-and-return conditions

Codex must stop and return to ADMIN only if one of these becomes necessary:

1. changing the meaning of I/O/A/P/R/V/C/B;
2. changing the authoritative semantics of the v0.3 method;
3. introducing a new public semantic relation outside the normative v0.3 Relation Space rather than representing the meaning through existing relations/internal typed expressions;
4. changing any of the 50 frozen source tasks to make them easier;
5. weakening an acceptance oracle or semantic review because the parser disagrees;
6. using an LLM/hybrid answer generator as the final authority for Canonical 7+1;
7. a genuine architecture contradiction remains after a generic IR-level redesign and independent controls.

Normal parser bugs, missing bindings, missing AST forms, incomplete lexicons, missing ownership, incomplete coreference, and incomplete quantity/condition composition are **not** stop conditions. Codex should fix them autonomously.

## Corpus interpretation

For this task, ADMIN explicitly accepts all 50 frozen r02 cases as standardized ADMIN root-scope tasks for 7+1 compilation.

Do not reject them as Multi-WP and do not decompose them into WP0...WPn.

The separate future rule for clearly malformed multi-WP ADMIN taskbooks is out of scope here.

## Final success

The target terminal outcome is:

`ADMIN_SHORT_050_ROOT_7PLUS1_VALIDATED`

It requires all 50 source tasks to produce source-faithful Canonical 7+1 with zero partial/wrong/unsupported resolved facts, plus independent generalization controls, repeatability, anti-overfit and regression closure.

## Status

`ADMIN_LONG_IMPLEMENTATION_AUTHORIZED`
