# 7P-HYBRID-015 — Controlled Upstream Semantic Proposal Experiment

## Identity
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Start from sealed `7P-COMPOSITION-014` at `f03d09a099f06a4da2786a3c8e9dcd9fdb50dd37`
- Previous verdict: `SYSTEMIC_REPAIR_INSUFFICIENT`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Comparison contract: `fixtures/7plus1/standard-contract/v0.3-admin-20261002/`
- PRODUCTION_READY=false

This is a shadow experiment **inside the BoundX 7+1 Parser**. The product under test remains the parser whose output is Canonical 7+1. The deterministic R1–R4 parser remains the control. Do not add more phrase/rule repair.

## Read first
Read CURRENT-TASK, the 014 task/report/FINAL-OUTCOME/ARCHITECTURE-VERDICT, 009 hybrid option analysis, 010 scope-aware comparison contract, the 014 model-signals/semantic-decoder/semantic-ownership/source-binding/whole-composition code, and active L1/L2 pack + model manifests.

## Model boundary
Use only model resources already installed and already used by BoundX:
- bge-m3
- multilingual-e5-large
- current mDeBERTa NLI resource
- existing HanLP/spaCy syntax/NER/SRL
- current L1/L2 semantic packs

Freeze exact resource names, paths, versions and manifest hashes. No training, model download/upgrade, external hosted LLM/API, Gold/Source/v0.3/010-contract/QI-QB changes, or production switch.

If required local model resources are unavailable, stop with `MODEL_PROPOSER_UNAVAILABLE`.

## Proposal lane
Create an isolated candidate such as `research/7plus1-parser/v0.3-7p-hybrid-015/`.

Add an upstream **UNTRUSTED semantic proposal** lane inside the 7+1 parser frontend. A proposal must carry:
- proposal id/kind
- exact source spans + clause ids
- proposed node/relation/owner/scope/expression
- candidate endpoints
- syntax/SRL/NER evidence
- BGE/E5 retrieval candidates and scores
- NLI hypotheses/results
- model/pack provenance

Proposal kinds may cover node type, relation, semantic owner, discourse role, artifact role, reference/basis, condition owner, output-content owner, member set, coreference/referent set, participant role, composite frame.

Do not add new normative v0.3 relation types.

## Proposal generation
Use BGE-M3 and multilingual-E5 as independent upstream retrieval signals. Keep top-k candidates and disagreements. Use mDeBERTa NLI only on explicit typed hypotheses. Scores rank proposals; scores never determine truth.

## Deterministic admission
Before a proposal can enter the normal **7+1 parser candidate graph**, require deterministic parser checks for:
1. provenance integrity
2. type compatibility
3. relation signature
4. owner/discourse compatibility
5. scope ownership
6. artifact/reference role
7. referent uniqueness or typed unresolved
8. condition ownership
9. set/cardinality consistency
10. negative evidence
11. graph consistency
12. no equal-authority competing proposal

Ambiguity remains unresolved. Model proposals never write Boundary IR or Canonical 7+1 directly. Their only purpose is to improve parser candidate recall/ownership/binding before the existing deterministic parser stages.

## Experimental arms
A. Control: frozen 014 deterministic behavior.
B. Hybrid: same source/upstream inputs plus admitted model proposals, then the same deterministic **7+1 parser** Eligibility → Boundary IR → Canonical 7+1 pipeline.
C. Safety controls: independent non-Gold cases with deliberately misleading owner/role/scope/reference candidates; unsupported proposals must be rejected or unresolved.

## Non-Gold first
Before STANDARD evaluation, freeze at least 30 independent Chinese/English cases spanning:
- long/nested tasks
- CURRENT_TASK vs BACKGROUND
- OUTPUT_CONTENT
- ACCEPTANCE
- code/table ownership
- cross-section references
- file/member and wildcard sets
- basis/version references
- recipients
- conditions/prohibitions
- deictic referents
- distributive EACH
- ambiguous/insufficient evidence
- owner conflicts

Do not copy SWAI literals, paths or functions. Freeze expected mechanism contracts before running STANDARD hybrid results.

Measure proposal recall, post-admission precision, rejection reasons, typed-unresolved correctness, BGE/E5 disagreement, NLI distribution, and wrong admitted proposal count.

## STANDARD shadow evaluation
Only after non-Gold and safety controls pass, run all 9 STANDARD cases in Arm A and Arm B using the frozen 010 contract.

Compare:
- I/O/A item counts
- CASE_IOA_JOINT
- STANDARD_PARSED
- complete I/O/A slot count
- full slot completeness
- owned-content missing
- false-defined
- wrong-binding
- slot-status mismatch
- newly admitted proposals
- rejected bad baseline candidates

Every new MATCH must retain complete source/owner/scope/binding proof.

## Verdict rules
`HYBRID_PROPOSAL_VALIDATED` only if:
- safety controls pass;
- CASE_IOA_JOINT >= 1/9;
- no source-floor regression;
- false-defined and wrong-binding do not worsen.

`HYBRID_PROMISING_BUT_INSUFFICIENT` if joint stays 0/9 but at least one previously incomplete I/O/A slot becomes complete, missing requirements materially decrease, and soundness does not worsen.

`HYBRID_PROPOSAL_INSUFFICIENT` if case-level completeness does not materially improve.

`HYBRID_GATE_UNSAFE` if unsupported proposals produce wrong RESOLVED facts or semantic soundness materially worsens.

Do not recommend production adoption in this experiment. The experiment is successful only insofar as it improves **natural-language → Canonical 7+1 parsing**.

## Performance/repeatability
Run the hybrid proposal process at least twice on the same frozen inputs. Distinguish proposal ranking stability from admitted-semantic stability.

Measure separately:
- control deterministic compiler
- BGE proposal time
- E5 proposal time
- NLI time
- deterministic admission time
- total hybrid shadow time

## Required report
Create `docs/reports/7plus1/7P-HYBRID-015/` with at least:
- REPORT.md
- MODEL-MANIFESTS.json
- PACK-MANIFESTS.json
- PROPOSAL-SCHEMA.json
- PROPOSAL-GENERATION-AUDIT.json
- PROPOSAL-ADMISSION-AUDIT.json
- SAFETY-CONTROLS.json
- NON-GOLD-FROZEN-INPUTS.json
- NON-GOLD-RESULTS.json
- ARM-A-CONTROL.json
- ARM-B-HYBRID.json
- CASE-IOA-JOINT-BEFORE-AFTER.json
- FULL-CASE-BEFORE-AFTER.json
- FALSE-WRONG-STATUS-BEFORE-AFTER.json
- OWNED-CONTENT-BEFORE-AFTER.json
- PROPOSAL-REPEATABILITY.json
- PERFORMANCE.json
- ANTI-OVERFIT-AUDIT.json
- ARCHITECTURE-VERDICT.json
- FINAL-OUTCOME.json
- NEXT-TASK-RECOMMENDATION.md
- VERIFY.json / MANIFEST.json / SHA256SUMS.txt / SEAL.md / SEAL-VERIFICATION.json

Preserve first-run failures and model disagreements.

## Allowed outcomes
Exactly one:
- HYBRID_PROPOSAL_VALIDATED
- HYBRID_PROMISING_BUT_INSUFFICIENT
- HYBRID_PROPOSAL_INSUFFICIENT
- HYBRID_GATE_UNSAFE
- MODEL_PROPOSER_UNAVAILABLE
- V0_3_METHOD_LIMITATION_CONFIRMED

## Git rules
Work only on `review/7plus1-parser`. Do not modify sealed 014 evidence, Gold, Source, 010 contract or v0.3. Do not merge/release/tag or switch production. Stop at `WAITING_ADMIN_REVIEW`.

## Final return
Return task, commit, outcome, model manifests, non-Gold proposal metrics, safety result, CASE_IOA_JOINT control→hybrid, STANDARD_PARSED control→hybrid, complete I/O/A slot count, false-defined, wrong-binding, owned-content missing, repeatability, performance, architecture verdict, integrity confirmations, report path, and STATUS=WAITING_ADMIN_REVIEW.
