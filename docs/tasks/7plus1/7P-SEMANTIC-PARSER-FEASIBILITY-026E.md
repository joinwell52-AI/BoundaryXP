# 7P-SEMANTIC-PARSER-FEASIBILITY-026E

## Status

ADMIN AUTHORIZED — BOUNDED FEASIBILITY EXPERIMENT UNDER 026

Parent task:

`7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG`

This experiment does **not** replace 026 and does not authorize production changes.

Its only question is:

> Can an existing non-LLM semantic parsing route recover the predicate–argument–scope structure that the current BoundaryXP candidate generator is failing to recover?

Do not repair the active parser during this experiment.
Do not tune rules to cases.
Do not create a new blind benchmark.
Do not train a new model.
Do not switch production.
Do not change the current accepted 026 baseline.

---

# 1. Baseline

Use the currently admitted 026 baseline as immutable control:

- Root-050 = 16/50
- Natural-100 = 9/100
- exposed development 200 = 200/200
- A/B disabled
- narrowed C enabled
- pre-Γ destructive counts = 0

All experiment code and outputs must live in a separate experiment directory.

---

# 2. Hypotheses

H1 — Input fragmentation hypothesis

The current parser loses important predicate/argument/scope structure because NLP input is split at commas and similar punctuation before semantic analysis.

H2 — Existing semantic parser hypothesis

A pretrained semantic graph parser can recover useful predicate–argument / embedding / reentrancy structure that current POS+DEP+SRL signals and handwritten candidate reconstruction miss.

H3 — Downstream sufficiency hypothesis

If a correct semantic graph is supplied, existing BoundaryXP Γ → Boundary IR → 7+1 can consume it with only a deterministic adapter, without requiring case-specific rules.

These hypotheses must be tested independently.

---

# 3. Fixed evaluation corpus

Use only already exposed development material.

Create a deterministic 60-case experiment set:

- 20 unresolved Root-050 cases
- 20 unresolved Natural-100 cases
- 20 already-correct exposed-200 cases as non-regression controls

Selection rule:

1. use the existing second-level root-cause ledger;
2. stratify unresolved cases across the largest root causes;
3. within each root-cause bucket, select case IDs in lexical order;
4. record the exact selection algorithm and resulting IDs before running any parser.

Do not hand-pick cases after seeing results.

No new blind set is authorized.

---

# 4. Arm A — Current segmented NLP control

Run the existing 026 NLP/candidate-input path unchanged.

Preserve:

- exact clause segmentation
- POS
- dependency
- SRL
- typed literals
- candidate nodes/relations/expressions

This is the control.

---

# 5. Arm B — Full-sentence existing NLP

Use the same currently approved NLP components and model bytes, but do **not** split a sentence at commas before NLP analysis.

Requirements:

- preserve protected technical literals;
- preserve sentence punctuation;
- feed the complete sentence to the same NLP model;
- map token/source spans back to original code-point offsets;
- do not change candidate-generation rules.

Purpose:

> isolate whether pre-NLP comma fragmentation is itself destroying useful syntax/SRL structure.

Compare Arm B against Arm A before any downstream parser changes.

---

# 6. Arm C — Pretrained semantic graph parser

Run an existing pretrained Chinese semantic graph parser independently from the active BoundaryXP parser.

Primary candidate to test:

HanLP Chinese AMR / MRP semantic parser exposed through the HanLP pretrained AMR resources, including the Chinese Mengzi-based MRP2020 AMR model or the Chinese-capable English/Chinese MRP2020 AMR model if locally runnable.

Before use, record:

- exact model name
- download/source
- code license
- model/data license if discoverable
- local model SHA-256
- runtime dependencies
- whether the model is used only for this research experiment

Model licensing does not imply production approval. Do not add this model to BoundaryXP's approved production model list.

Run it on full sentences, not comma fragments.

Preserve raw parser output.

Do not force AMR concepts directly into 7+1.

---

# 7. Optional Arm D — pretrained structured information extraction

Only if Arm C cannot run or cannot expose usable source-grounded relations, run one existing pretrained multilingual structured extraction model as a secondary comparison.

Permitted purpose only:

- event candidate extraction
- participant/argument candidate extraction
- relation candidate extraction

No task-specific training.

Record exact model/license/hash.

Do not use an LLM/chat model.

---

# 8. What to evaluate

Do not evaluate only final slot strings.

For every experiment case, independently review whether each arm recovers:

1. predicate identity
2. predicate layer:
   - main task
   - modifier/attributive
   - complement/content
   - condition
   - metadata/metalinguistic
3. actor/agent
4. patient/theme/object
5. result/deliverable relation
6. recipient
7. condition ownership
8. modality/negation scope
9. coordination/shared argument
10. coreference/reentrancy
11. source-span or source-alignment accountability

Use existing source assertions and root-cause ledgers where available.
For any newly reviewed semantic assertion, record human review evidence and do not silently overwrite prior evidence.

---

# 9. Candidate-recall comparison

For each arm report:

- required semantic nodes present / total
- required predicate–argument relations present / total
- required scope/condition/modal structures present / total
- false promoted business predicates
- wrong argument bindings
- missing source alignments
- ambiguous cases preserved as ambiguous

Important:

A semantic parser output counts as useful only if it recovers the correct semantic structure.
Producing a graph is not a PASS.

---

# 10. Full-sentence fragmentation decision

H1 is CONFIRMED if Arm B materially restores structures missing from Arm A across multiple root-cause families without introducing comparable new wrong bindings.

H1 is FALSIFIED if full-sentence NLP provides no meaningful improvement or merely moves the errors.

Report exact counts.

---

# 11. Semantic-parser feasibility decision

Classify Arm C as one of:

SEMANTIC_PARSER_FEASIBLE

Use only if all are true:

- improves correct predicate/argument/layer recovery across multiple root-cause families;
- does not collapse modifier/content/condition predicates into main-task actions at an unacceptable rate;
- source provenance can be reconstructed or safely retained;
- recovered structure can be mapped to BoundaryXP candidate node/relation/expression types without case-specific phrase rules.

SEMANTIC_PARSER_PROMISING_BUT_INSUFFICIENT

Use if it clearly improves predicate–argument structure but lacks one or more critical BoundaryXP needs such as:
- precise source alignment
- modality/negation scope
- condition ownership
- Chinese technical-domain robustness

SEMANTIC_PARSER_NOT_FEASIBLE

Use if it does not materially improve the missing semantic structures, produces excessive semantic pollution, or cannot be source-grounded enough for BoundaryXP proof/accountability.

Do not force a PASS.

---

# 12. Oracle downstream isolation test

Select 10 cases from the 60 before reviewing experiment results.

For these 10 only, manually construct a reviewed semantic intermediate using existing BoundaryXP node/relation/expression contracts.

This is a diagnostic oracle, not parser output and not benchmark score.

Feed the reviewed semantic intermediate into the downstream:

Γ
→ Eligibility
→ Boundary IR
→ Canonical 7+1
→ Proof/Coverage

Purpose:

- if reviewed semantics still produce wrong 7+1, the downstream method is also defective;
- if reviewed semantics produce correct 7+1 while automatic parsing fails, the primary bottleneck is Semantic Parsing P.

Report this separately as:

ORACLE_DOWNSTREAM_10

Do not mix oracle results into automatic parser metrics.

---

# 13. No parser repair during the experiment

During 026E:

- no new predicate rule
- no new STATE rule
- no new relation rule
- no Γ tuning
- no hardcoded case ID
- no new benchmark-specific lexicon
- no production entry changes

If a parser arm exposes a failure, record it.
Do not repair it inside this experiment.

---

# 14. Required outputs

Create:

`docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E/`

At minimum:

- REPORT.md
- CORPUS-SELECTION.json
- ARM-A-SEGMENTED.json
- ARM-B-FULL-SENTENCE.json
- ARM-C-SEMANTIC-GRAPH.json
- ARM-D-STRUCTURED-EXTRACTION.json if used
- SEMANTIC-ASSERTION-LEDGER.json
- FRAGMENTATION-COMPARISON.json
- SEMANTIC-PARSER-COMPARISON.json
- SOURCE-ALIGNMENT-AUDIT.json
- ORACLE-DOWNSTREAM-10.json
- MODEL-MANIFEST.json
- SHA256SUMS.txt

Preserve raw model outputs.

---

# 15. Final answer

Stop after the experiment.

Return exactly these decision results:

- H1_FRAGMENTATION = CONFIRMED / FALSIFIED / INCONCLUSIVE
- SEMANTIC_PARSER = FEASIBLE / PROMISING_BUT_INSUFFICIENT / NOT_FEASIBLE / NOT_RUN
- ORACLE_DOWNSTREAM_10 = x/10 correct
- best arm candidate-node recall
- best arm predicate–argument recall
- best arm scope/modality recovery
- source-alignment completeness
- false predicate promotion count
- wrong binding count
- exact model(s) used
- report path

Then:

`WAITING_ADMIN_REVIEW=true`

Do not resume 026 implementation automatically.
Do not start 027.
