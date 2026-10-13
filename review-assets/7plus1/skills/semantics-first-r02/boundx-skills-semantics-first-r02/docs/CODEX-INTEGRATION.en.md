# Codex integration: r02 language-aware semantic Skills

Procedure revision: `semantics-first-r02`. Candidate contract remains `candidate-ir/1.2`.

This package changes the instruction files and supplies evaluation materials. It does not implement new Schema fields, operators, solvers, or UI behavior. The existing six-step method and known program responsibilities remain in force. No new parser-model calls, deployment, merge, release, or tag are authorized by this document. Preserve unrelated edits, historical responses, and existing repairs.

## 1. Choose one instruction edition

The default files are:

```text
skills/boundx-semantic-parse/SKILL.md
skills/boundx-semantic-audit/SKILL.md
```

They are Chinese-written instructions that explicitly accept Chinese, English, and mixed source text. Do not automatically switch instruction editions when the input language changes.

Complete English editions are supplied at:

```text
translations/en/boundx-semantic-parse/SKILL.en.md
translations/en/boundx-semantic-audit/SKILL.en.md
```

These are alternatives, not required extra references. They are outside the default discovery path to prevent duplicate same-name Skills. If the administrator selects the English instruction profile, copy those bytes to the existing runtime locations under the name `SKILL.md`. Do not load both editions into the same request or run both to select a favorable result. Keep parse and audit instruction editions aligned by default, and record the digest of each loaded file. Mixed-edition profiles require separate validation.

Each English file contains one HTML comment retaining the Chinese version marker expected by the loader reviewed for r01. This is a static compatibility provision, not a claim of a successful local load.

The repository runtime destinations inherited from r01 are:

```text
research/7plus1-parser/llm-first-028/skills/boundx-semantic-parse/SKILL.md
research/7plus1-parser/llm-first-028/skills/boundx-semantic-audit/SKILL.md
```

Do not create a new root runtime entry merely because this package has a top-level `skills/` folder. Use UTF-8 without BOM and LF line endings. Use Python, Node, or an editor for Chinese text; do not rewrite it with PowerShell string replacements.

## 2. Establish the actual integration baseline

The inherited historical repository reference is `b2aad960c7cc8b1db6d52a3d8ad41767a490ec06`; it was not rechecked during this language-only revision. Inspect the actual local HEAD, contract, Schema, Skills, and pending changes before integrating. Do not overwrite newer fixes with the historical baseline. Do not reset, clean, or overwrite earlier traces. When the current contract differs from 1.2, explicitly reconcile the interface before any load.

## 3. Lock and isolate request resources

Continue the existing resource-delivery approach. Supply exactly one phase-specific instruction edition along with the existing same-version contract, operator definitions, complete original source, and required structured-output Schema. The audit also receives the complete candidate and whichever Schemas the reviewed host interface requires. Do not add the alternative edition, evaluation metadata, paired translation, expected answers, prior best traces, this chat, or author witnesses to model requests.

Instruction language and source language are separate properties. Do not translate source text before parsing. Preserve exact quotations, identifiers, case, Unicode, and versions. Schema keys and enum values do not change. Readable labels and reasons may follow the source language without changing evidence or identity. Explicit host display-language settings may change readable text only.

Resource consistency checks belong before the model call. Remove stale deployment claims from runtime instructions without pretending unimplemented consumers are implemented. Keep operator semantics separate from version-specific implementation capability.

## 4. Keep the inherited program work visible

A. **External input use:** connect allowed domains to data-use relations and source-supported origin relative to the task. `producer=null` is not an external-origin classifier. Do not substitute constant set equality for exclusivity. If a faithful extension is required, propose its contract, consumers, tests, and compatibility boundary before adoption.

B. **Data readiness:** distinguish needed content ready at use, the complete artifact ready, and the producer's whole task complete. Preserve current identity and version. Test no production, started-but-unready production, needed portions ready, and explicit full-artifact requirements.

C. **Acceptance dependencies:** distinguish identity, ownership, roles, field values, prerequisites, and calculation dependencies. A local scope gap should block full scope certification without invalidating unrelated identity or duration facts. Genuine dependencies on uncertain fields remain blocked. A supported group-members field does not support all group semantics, and a whole-node support cannot erase field-level contradiction.

D. **Revision consistency:** apply IR, coverage, issues, omissions, and audit applicability as a new-version transaction. Keep history immutable while resolving currently active gaps only through explicit evidence and independent review. Neither silently discard old omissions nor keep resolved gaps active forever. Bind patch base, replacement authorization, reference validity, and affected-node review.

E. **Projection and calculation:** apply the same modality rules to positive A/O, retained non-positive facts, B, and mathematical summaries. Prohibited delivery is not a required output. Internal artifact use is not new external input. Schema validity and a satisfying witness do not establish complete source coverage or universal parent-child conformance.

## 5. Validation sequence

**G0: static package and load checks.** Run `python tools/verify_package.py`. Check loaded file names, versions, digests, and exclusion of evaluation answers. This does not call a model, validate the product's full runtime, or prove translation equivalence.

**G1: no-model program checks.** Use evaluator-authored legal IR for A-E above. Preserve counterexamples for full-field support, member-only support, field contradiction, modality projection, localized gaps, extra external inputs, data readiness, and revision closure. Artificial IR is not an automatic parsing result. The program must not silently invent semantics to repair a model's omission.

**G2: frozen-profile live semantic checks, separately authorized.** The new set contains 24 author-intended Chinese/English pairs (48 source texts) and 6 mixed-language sources. The old 20 public r01 sources remain unchanged under `evaluation/legacy-r01/`. These are development material, not holdout evidence. All live-model outcomes are `NOT_RUN`.

Send only one source text per request. Evaluate each language against its own source before comparing normalized structures. Ignore incidental ID/order/display-language differences, not scope, modality, exception, identity, prerequisite, or data-use differences. Two equally wrong structures do not pass. Equal expression gaps are consistent limitations, not successful full expression.

Record source digests, actual resource digests, model settings, candidates, audits, patches, changes, request counts, retries, and elapsed times. Separate faithful interpretations, over/under-constraint, genuine clarification, expression gaps, missing consumers, and transport failures. The dataset size is not a model-call budget or authorization.

**G3: controlled deployment.** Only after the applicable quality gates and deployment authorization may a complete installation snapshot be updated. A new Skill edition does not inherit a historical model-generation pass. Keep service status, pipeline completion, semantic coverage, supported calculations, and execution authorization separate.

## 6. Required integration report

Report actual adopted digests, differences from the real local baseline, implemented and outstanding A-E items, before/after counterexample results, G0/G1 outcomes, and the live validation scope still requiring authorization. Do not answer only “all general capabilities added.” No changes to models, authentication, Host, L1-L3 packages, or complex work-package planning are required by this language revision.
