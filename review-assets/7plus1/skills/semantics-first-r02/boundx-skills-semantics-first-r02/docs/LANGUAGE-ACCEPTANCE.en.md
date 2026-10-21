# r02 language scope and evaluation criteria

## Unchanged method

The six-step procedure, one candidate IR, independent audit session, and programmatic acceptance/calculation responsibilities remain unchanged. No language field or bilingual duplicate node is introduced. Existing task sources and standard 001 are not rewritten. Language rules in r02 are additions, not claims about previously validated r01 capabilities.

## Separate instruction language from input language

Choose one fixed instruction edition, Chinese or English. That profile must process Chinese, English, and mixed sources directly. Do not switch instruction language automatically with source language. Claiming comparable behavior for both instruction editions requires an additional comparison of those profiles; translated text alone does not establish equal behavior.

## Compare source fidelity before cross-language agreement

First check each output against its own source. Then compare author-intended equivalent pairs for identity and version, actor and recipient, modality, domain, constrained use, condition direction and check time, data use, quantities, completion, and stopping.

Allow incidental ID renaming, order differences in unordered sets or conjunctions, and readable description language. Normalization must follow explicit equivalence rules; it must not erase negation, exceptions, conditions, source purpose, identity, or units. Preserve explicit paths and role identifiers. For nonliteral equivalent concepts across a pair, use explicit evaluator correspondences rather than string similarity.

Validate each quotation against its own unchanged source. An English-only source cannot justify an invented Chinese quotation; a Chinese filename in that English source must remain Chinese. JSON escaping is acceptable when decoded text is identical. Unicode normalization and case folding are not universal identity rules.

Two identically wrong or incomplete outputs do not pass. Matching expression gaps are matching limitations, not successful complete parsing. Distinguish source ambiguity, inadequate contract representation, and unobserved runtime values; missing business results need not prevent static rule expression.

## Dataset and reporting

BI01-BI24 each contain one Chinese and one English source; MX01-MX06 are mixed sources: 54 source texts in total. They are public development materials, not holdout tests. The old 20 r01 cases remain unchanged. Send only one selected source, not expected data, pair metadata, or the counterpart translation.

This revision creates materials and runs offline package checks only. No live model, Codex execution, BoundX run, or local deployment was performed. Dataset size is not a call budget. Report source fidelity, over/under-constraint, over-clarification, genuine ambiguity, contract gaps, consumer gaps, cross-language agreement, transport failures, latency, and requests separately.

Eight populated views, equal counts, or valid JSON do not establish semantic fidelity. Historical r01 or 001 results are not r02 English results.

## Limits of document-parity checks

`PARITY-MAP.json` links the corresponding sections and critical machine identifiers in the four author-written instruction files. The offline verifier checks those anchors and byte-level integrity; it does not prove translation equivalence, independently certify the English translation, or predict model behavior. Do not load both complete language editions as a substitute for quality validation.
