# BoundX semantic Skills for Chinese, English, and mixed-language tasks

Procedure revision: `semantics-first-r02`; predecessor: `semantics-first-r01`; interface: `candidate-ir/1.2`.

The existing six-step parser and bidirectional reviewer now have explicit language rules and complete, separate English instruction editions. This is an instruction package, not a new IR or a release with proven bilingual parsing accuracy.

## Choose one edition, not two parsers

`skills/boundx-semantic-parse/SKILL.md` and `skills/boundx-semantic-audit/SKILL.md` are the default Chinese-written instructions. They accept Chinese, English, and mixed sources directly.

`translations/en/boundx-semantic-parse/SKILL.en.md` and `translations/en/boundx-semantic-audit/SKILL.en.md` are complete English alternatives. When selected, copy them into the existing runtime locations as `SKILL.md`, following the integration document. Do not load both editions. One compatibility comment retains the marker used by the previously reviewed loader; the English instructional prose is separate.

Both editions preserve original source quotations and identifiers and use the same Schema. Source language is not the instruction language. English modality, conditional direction, quantifier scope, exceptions, passive actors, respectively-pairing, numeric limits, and date uncertainty require contextual interpretation rather than word substitution. Do not translate and replace SOURCE_DATA.

## Package contents

The integration and language-acceptance documents each have separate Chinese and English editions under `docs/`. The new evaluation material contains 24 author-intended Chinese/English semantic pairs (48 sources) and 6 mixed sources, with expected checks kept separate. The old 20 r01 development sources and expectations remain byte-identical under `evaluation/legacy-r01/`.

Only a selected source text may be sent as SOURCE_DATA. Never send the whole source collection, paired translation, metadata, expected checks, or prior standard answer. The runtime Skills do not contain the standard 001's filenames or solution witness.

## Validation and limitations

Run `python tools/verify_package.py` for offline package checks. Results are in `VALIDATION.json`. The script checks files, versions, digests, case metadata, and limited reference logic; it does not call a model or establish translation or parsing accuracy.

Live Chinese, English, and mixed-model validation: `NOT_RUN`. Product integration and deployment: not performed. English editions are author-written counterparts, not independently certified translations. No runtime Schema, consumer, solver, or model configuration has been changed. Existing expression and calculation gaps are not fixed by translating a Skill.

r01 remains unchanged. Provenance and inherited historical baseline are recorded under `docs/r01-provenance.json`; that baseline is not a claim about the latest repository HEAD. Reconcile current local changes before integration. Model-call budgets and deployment require separate authorization.
