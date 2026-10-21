# 023 Architecture evidence

Normative authority: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`.

Before: `v0.3-7p-composition-014/frontend.mjs::relation()` creates `state=RESOLVED` under `NATIVE_*`. Subsequent 016/018/021 preparation modules may create or rewrite resolved edges, then Eligibility consumes them. Optional model diagnostics run after boundary production in historical versions. There is no independent first-class Gc → Γ receipt for every edge.

After: the 023 candidate-only frontend creates a Gc registry before relation generation. HanLP/spaCy dependency and typed literal evidence propose candidates. The fork preserves generic syntactic primitives while relation states mean candidate support, not certification. Explicit expressions are materialized before Γ, including deliverable ITEM expressions that the frozen Eligibility adapter previously materialized itself. BGE/E5/NLI consume existing candidates and return evidence. Gc is frozen, consumed by pure Γ, and retained in the execution snapshot. Γ alone creates RESOLVED/REJECTED/UNRESOLVED relations. Post-Γ relation creation throws. Eligibility, Boundary IR, Q and the original downstream proof contract retain their meanings. A separate candidate lineage DAG extends the proof back through Γ and Gc without rewriting the frozen downstream schema.

Runtime: `research/7plus1-parser/v0.3-candidate-semantic-023/engine.mjs`.

The new candidate uses generic frontend/condition/coreference primitives from 014 rather than calling sealed 021's whole preparation pipeline, whose setters directly certify relations. Those historical modules and evidence remain byte-exact; they are not silently advertised as active 023 producers. Unported artifact, role, reference, content and scope mechanisms are visible candidate-generation/ownership coverage gaps in the replay. This implementation does not claim semantic equivalence or generalization closure simply because the routing gates pass.

Q imports remain the frozen deterministic projection. No Gold lookup, task-ID lookup, fixture text, person/file/entity hard-coding or Authority inference exists in the candidate runtime. No automatic WP clustering exists. Only explicit WP headings are read; richer multi-task structure diagnosis is not claimed implemented.

G1–G12 tests include injected native/model certification, an invented fact, slot tampering, evidence tampering, competing hypotheses, invalid signatures, deterministic Γ replay and actual model calls. Mechanism tests were frozen before corpus replay. Corpus failures are kept; neither Γ nor Q was tuned on the corpus.

The 58618 check uses an isolated candidate inspection server temporarily, then closes it. It demonstrates the same engine, separate candidate/evidence/Γ/certified stages and byte-identical history exports without rerunning the parser. Production npm scripts and old servers are unchanged.

Acceptance must additionally require zero full-regression failures. A routing PASS is not permission to claim the entire task accepted, production ready or source semantics correct.
