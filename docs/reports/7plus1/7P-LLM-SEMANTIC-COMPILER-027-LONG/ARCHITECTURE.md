# 027 v0.4 implementation architecture

Current authorization: `7P-LLM-SEMANTIC-COMPILER-027-LONG`. Method authority:
`docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md`.

The new runtime lives entirely in
`research/7plus1-parser/v0.4-llm-semantic-027/`. It does not import old 026
candidate generators, semantic decoders, Γ policies or projection results.

| Stage | Implementation | Responsibility |
|---|---|---|
| Source | source.mjs | Exact original text, codepoint coordinates, actual markup and literal recognizers |
| Port | semantic-parser-port.mjs | Typed model-independent parse/audit interfaces and strict schema validation |
| Provider | providers/codex.mjs | Authenticated automatic desktop CLI, isolated directory, tools disabled, exact receipts |
| Proposal | prompts/parser-v1.md | Semantic candidates only; no final 7+1 or certification |
| Independent audit | prompts/auditor-v1.md | Raw source and proposal only; misses, conflicts and optional candidates |
| Source alignment | source-linker.mjs | Exact quote, explicit occurrence/region/anchor disambiguation; never guesses offsets |
| Gc | candidate-graph.mjs | Preserve all proposals, alternatives, findings and origins |
| NLP evidence | nlp-evidence-adapter.mjs | Existing frozen dependency witnesses only; no parallel candidate graph |
| Γ | gamma-v04.mjs | Source, finite signature, typed ownership, competition and evidence checks |
| Eligibility | eligibility.mjs | Explicit finite boundary uses, carrying all dependencies and guards |
| Boundary IR | boundary-ir.mjs | Facts and unresolved dependencies without business authorization |
| Projection | projection.mjs | Fixed I/O/A/P/R/V/C/B queries; omissions are not ABSENT |
| Proof | proof.mjs | Actual source/provider/auditor/certification/eligibility/fact reachability |
| Coverage | coverage.mjs | Exactly one accounting record per actual source region in each pass |
| Replay | replay.mjs | Same graph, source, receipts and recorded NLP evidence, with no new model calls |
| Evaluation | evaluator.mjs | Offline references only; not accessible from the provider working directory |

Γ policies are certification constraints, not natural-language parsers. They do
not select a meaning by provider name or confidence, read external references,
derive Authority from roles, or generate missing predicates. Conflicting,
untyped, ungrounded or unsupported proposals remain rejected/unresolved.

The source regions are actual nonempty document lines. Full source is sent to
the LLM; there is no comma-based primary NLP segmentation. Document structure
includes lines/sections/list items/table rows/code regions. This implementation
does not claim a complete Markdown cell parser or complete cross-document
structural interpretation.

Proof reachability is not proof of semantic truth. Agreement of the two model
turns is also not truth. Source-derived offline comparisons, unresolved audit
suspicions and limitations are reported separately.

The root remains an ADMIN task. Internal organizer/executor refinements are not
automatic WPs. The ordinary production entry and 58618 are unchanged; the new
CLI is an isolated research entry for ADMIN review.

## Finite development policy variant

The untouched initial engine is retained as v1. `engine-policy-v2.mjs` evaluates
one predeclared finite variant against all 245 identical recorded proposals,
audits and NLP witnesses. It neither reruns a model nor changes Gc. Selection
requires reference failures to decrease, no existing case/check PASS to be
lost, unchanged Gc/source grounding and no increased Proof/Coverage gaps.

The variant adds four contract mechanisms:

1. A source-owned `COMPLEMENT` event can enter task-use eligibility only with
   a unique explicit `PART_OF` path through a required/permitted `ORGANIZE`
   owner. It cannot acquire a performer or bypass its own certification.
2. Negative destinations and negated role assertions do not create positive
   participants, while their semantic candidates remain available.
3. Scope/limit relations cannot cross unrelated expression-owner branches;
   execution resources cannot target a functional support/declaration event.
4. Argument-local ITEM scopes and output-content requirements remain distinct
   from input scopes. Every deterministic derived domain and transitive
   certification dependency has an explicit source/role proof path. Derived
   expression arrays never modify the candidate graph.

These are typed graph checks and lowering operations, rather than parsing
words or selecting answers. `POLICY-SELECTION.json` records admission or
rejection. The selected CLI and locked runner read `METHOD-FREEZE.json` and
pin the actual CLI binary digest/configuration. Rejected development variants
remain in the evidence inventory, never replacing first outputs.

## Known verification limits

Two provider turns use separate contexts; this is not an independently trained
truth oracle. Auditor additions without an independent witness are retained
as unsupported candidates. Ambiguous coreference is not repaired by proximity.
The finite contract does not prove every linguistic inference correct. The
existing offline references do not enumerate all possible nodes/relations, so
full graph precision/recall and complete semantic closure must remain unclaimed
unless separately established. A complete run and zero regression failures
are operational evidence, not semantic PASS.
