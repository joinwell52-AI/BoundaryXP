# BXP-0001 · draft.2 update notes

Protocol version: **0.4.0-draft.2**. Document revision: **2026-10-27-r2**. Status: DRAFT_FOR_REVIEW. The English normative text and non-normative Chinese translation are synchronized.

At the user's explicit direction, the supplied content updates the existing draft.2. No draft.3 version directory is created. The supplied files retain their original draft.3 names and bytes in [source-artifacts](source-artifacts/README.md); those names identify input history, not the delivered protocol version.

## 1. Changes

| Change | Sections | Result |
|---|---|---|
| Mathematical evaluation versus overall assessment | §2, §6.1, §7, §9, §10, §15 | Evaluate produces mathematical content E; Assess uses fixed Θ to form B, with separate determinism requirements. |
| Exact query binding | §2, §6.1, §9, §10 | Fix kind, operands, parameters, domains, premises, mappings, dependencies and requiredness; required queries cannot be omitted to obtain a pass. |
| Partial carriers | §3.2–3.3 | Omit aggregate view state when accountability is incomplete; retain separate reduction metadata and diagnostics, without null or a fourth state. |
| Parent environment | §11.2 | Bind E_req to parent source, version and guards, and establish its inclusion in E_adm. |
| Causal claims | §11.3–11.4, §12 | Per-context solutions do not establish an executable strategy using then-available information; additional claims require corresponding contracts and evidence. |
| Local and joint checks | §5.3, §11.2 | Add total-resource and environment-inheritance examples; do not assign all parent deliveries indiscriminately to every child. |
| Semantic versus content identity | §2.2, §9 | SemCanon compares semantic boundaries; CanonObj binds content, with E, Θ and query coverage/completion in D_B. |

All 36 prior normative identifiers are retained. The additions are `BXP-STA-003`, `BXP-EVA-002`, `BXP-CMP-004` and `BXP-CMP-005`, for 40 total. The eight view definitions are unchanged.

## 2. Version-specific approval illustration

An old approval applies only to rc331. The current proposal deploys rc332, with no applicable approval in the fixed comparison context. Let d mean executing this deployment and a mean an approval fact applicable to the current version, target, action and conditions at the fixed time. The parent requires d⇒a; the current context states ¬a.

| Object | Candidate | Diagnosis |
|---|---|---|
| Original proposed plan | d∧¬a | Nonempty candidate, all realizations violate the parent: necessarily_violating. |
| Effective child contract inheriting the parent | (d⇒a)∧d∧¬a | Inconsistent candidate; vacuous preservation is prohibited. |
| Actual execution observations | Actions and approval fixed by evidence | Decide according to observation sufficiency; a proposal does not establish that execution occurred. |

Object kind, inheritance policy, time and scope must be fixed beforehand. The evaluator cannot switch models to prefer a label. Both candidate forms fail the corresponding release requirements, for different mathematical reasons. The [original supplied notes](source-artifacts/BXP-0001-v0.4.0-draft.3-CHANGELOG.zh-CN.md) are retained.

## 3. Per-context solutions and causal strategies

If a must be chosen before an unpredictable external b becomes known, the requirement a=b has a solution separately for every b, but no fixed advance choice of a works for every b. This is a one-step counterexample, not a definition of general interactive strategy. If b is available before the action, a decision depending on b may be possible.

Relational preservation is therefore retained with an explicit causal-claim scope. A release policy requiring causal realizability must block release when that evidence is unestablished.

## 4. Delivery and verification

The full English text, Chinese synchronization status, four companion descriptors, migration/provenance records, entry point, checker and download bundle are updated. File digests and original-byte preservation records are included.

Checks cover bilingual formulas/sections/identifiers, preservation of supplied Chinese §§2–13 and §15, view meanings, companion descriptors, links, finite resource/environment/approval/causality examples and historical bytes. These finite checks are not product conformance testing.

The paper, product code, runtime registry, complete wire Schemas and Gold do not migrate with this document update. Specialized implementation contracts still require separate design and validation.

## 5. Companion review corrections

The protocol version and document revision remain **0.4.0-draft.2 / 2026-10-27-r2**. The downstream descriptor now separates common, object-specific and conditional requirements under §11: concrete realizations and partial observations do not inherit candidate-specification coverage requirements; parent-environment binding applies to delegation/refinement comparisons; strategy evidence applies when causal realizability is claimed or required by release policy. The Profile-family index references this single applicability definition.

Standalone package reports return null for historical rule/view comparison counts and explicitly mark those comparisons as requiring the repository. Workspace reports compute the counts from the preserved previous version. Recorded workspace evidence remains distinct from a new package-mode run.

Normative uses of MUST, MUST NOT, SHOULD and MAY in the English body are consistently capitalized. Ordinary possibility statements and the explicitly non-normative examples retain ordinary wording. The mathematical blocks, numbered rules, Chinese body and eight view meanings are unchanged. The file manifest and download bundle are regenerated after verification.
