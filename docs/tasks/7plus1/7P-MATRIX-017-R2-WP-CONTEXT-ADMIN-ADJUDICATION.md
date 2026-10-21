# 7P-MATRIX-017-R2 — ADMIN WP-Local Compilation Context Adjudication

## Decision

The 017-R1 failure does **not** invalidate the Semantic Matrix design.

The sealed evidence establishes:

- Blocks = 4/4;
- WP Tree = 4/4;
- matrix reference/equation integrity = 4/4;
- M03 explicit PARALLEL evidence is correct;
- M04 correctly avoids invented PARALLEL/SEQUENCE;
- the first failure is that the validated short parser is being invoked on a child-WP view without enough certified task-domain context.

ADMIN therefore authorizes one bounded interface extension:

```text
Local7Plus1(WPk) = ShortDirectParser(SourceView_k | CertifiedWPContext_k)
```

This is the long/medium-task form already intended by the v0.3 method's stateful parsing model. It is **not** permission to rewrite source text, synthesize expected facts, or bypass evidence gates.

## 1. CertifiedWPContext

The local compiler may receive a typed context object derived only from source-certified document/WP structure.

Allowed fields:

```text
wp_id
wp_label
root_task_id
source_block_ids
task_domain_span_ids
responsible_participant_id?
responsibility_span_ids
execution_domain
completion_target
completion_domain_span_ids
global_basis_refs[]
global_constraint_refs[]
upstream_artifact_refs[]
downstream_artifact_refs[]
orchestration_refs[]
```

Every non-null field must have exact source/proof lineage.

No expected-answer fields, case IDs, literal hashes, file-name switches, or hidden Gold access are allowed.

## 2. Stage responsibility

A construction equivalent to:

```text
第一阶段由张宁负责
Stage 1 is handled by Zhang Ning
```

certifies the responsible participant for the WP even when the stage target appears before the responsibility predicate.

This is a generic stage-assignment relation:

```text
RESPONSIBLE_FOR(participant, WPk)
```

It must not depend on the lexical order "负责 + 任务/工作".

## 3. WP execution modality

Inside a source-certified execution WP, an action clause with:

- a resolved execution predicate;
- a WP-responsible actor or explicit local actor;
- CURRENT_TASK / DELIVERABLE_SPEC execution discourse;
- no background/example/quote/output-content exclusion;
- no contrary modality;

may inherit `REQUIRED` from the WP task contract even if the individual sentence does not repeat "必须".

Example:

```text
第一阶段由张宁负责。张宁读取 inventory.csv，检查重复记录，并生成 issues.md。
```

The READ/CHECK/GENERATE actions are part of the assigned stage specification.

This is **WP-domain modality inheritance**, not blanket conversion of declarative sentences into commands.

## 4. Stage completion domain

Completion is not restricted to literal "任务/task".

Source references such as:

```text
第一阶段完成
API 检查完成
第二阶段才算完成
```

may bind to the unique certified WP domain.

The local completion item must preserve:

- target WP;
- completion condition;
- source span;
- condition strength;
- proof lineage.

## 5. Local output role vs orchestration stage role

The short parser identifies an artifact as a generated output.

The matrix layer, not the local parser, assigns orchestration stage role:

```text
generated output + consumed by later WP
→ INTERMEDIATE_OUTPUT

generated output + not consumed by later WP + source/global completion support
→ FINAL_OUTPUT
```

Do not require the local short parser to know final/intermediate status before dependency resolution.

Likewise, a downstream READ/CONSUME of the same certified artifact identity establishes a local input candidate; after unique producer certification it becomes `INTERMEDIATE_INPUT`.

## 6. O→I certification

An O→I edge requires:

1. certified upstream O semantic item;
2. certified downstream I semantic item;
3. same normalized artifact identity;
4. unique producer in the relevant task domain;
5. exact source/proof lineage on both endpoints.

No edge may be created merely from matching strings.

## 7. Completion dependency certification

`REQUIRES_COMPLETION` requires:

1. an explicit/equivalent source orchestration clause;
2. a certified predecessor C item bound to the predecessor WP;
3. a certified successor WP;
4. no competing predecessor-completion identity.

Sequence/parallel syntax alone is not a substitute for the C endpoint.

## 8. Root basis identity

A root basis with version must be certified as one composed semantic identity:

```text
BASIS(rule=AUDIT-RULE-3, version=v2.0)
```

A version token by itself is not a complete BASIS endpoint.

`USES_AS_BASIS` must remain UNRESOLVED until the root basis endpoint is complete.

## 9. Root global constraints and forward references

A root statement such as:

```text
两个源文件都只能读取，不得修改
```

may be held as a typed unresolved set constraint until the document supplies a unique certified member set.

It may resolve only when:

- the set cardinality is source-supported;
- exactly the required members are certified as source inputs in child WPs;
- no competing member set exists.

Do not invent members from file-name frequency.

## 10. Scope of authorization

Authorized:

- extend the local compiler interface with `CertifiedWPContext`;
- add generic stage-domain responsibility/modality/completion handling;
- add generic local-output-to-stage-role normalization;
- add certified O→I and C→Enable endpoint binding;
- tighten root V/B endpoint certification.

Not authorized:

- Hybrid/LLM/model proposal lanes;
- new semantic Packs;
- long STANDARD tuning;
- expected-driven source rewriting;
- case-specific patches;
- MILP/SMT;
- production switch.

## Status

`ADMIN_WP_LOCAL_CONTEXT_AUTHORIZED`

The sealed 017-R1 failure remains immutable evidence.
