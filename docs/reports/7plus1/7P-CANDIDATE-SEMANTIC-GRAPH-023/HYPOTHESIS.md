# 023 pre-implementation hypothesis

Method authority: v0.3.1, T_admin → Gc → Γ → (Gb, Gu) → Q.

Hypothesis: routing generic syntax producers into an authoritative candidate registry, then independently checking every relation and expression, removes the direct certification bypass without changing Q or Boundary Fact meanings.

Primary gate: G1–G12, including adversarial injection tests. Minimum expected delta: every certified relation has a source candidate and deterministic Γ decision; bypass counts fall to zero. Semantic corpus accuracy is diagnostic, not the architectural primary metric.

Falsification: a producer can insert a certified relation/fact/slot without a Γ receipt; Γ accepts model scores alone, incompatible or competing candidates; projection consumes uncertified facts; or candidate/provenance/decision lineage is missing.

Stop rule: preserve all measured failures. Do not patch corpus phrases or downstream outputs; report failed acceptance honestly and stop at WAITING_ADMIN_REVIEW. Previously sealed failing semantic tests remain failing unless this architectural candidate actually fixes their mechanism; never rewrite their assertions.

Isolation: new runtime at research/7plus1-parser/v0.3-candidate-semantic-023. Production scripts and old sealed runtimes remain unchanged. An injectable lab server demonstrates the same parser without switching the production entry.
