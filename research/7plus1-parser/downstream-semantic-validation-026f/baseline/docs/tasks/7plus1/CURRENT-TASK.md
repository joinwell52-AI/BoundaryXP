# Current 7+1 Parser Task

**Active task:** `7P-SEMANTIC-PARSER-FEASIBILITY-026E`

Parent task:

`7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG`

Read and execute:

`docs/tasks/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E.md`

Normative method:

`docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`

Repository:

`joinwell52-AI/BoundaryXP`

Branch:

`review/7plus1-parser`

Execution rule:

> This is a bounded feasibility experiment inside 026. Pause further 026 parser repair. Do not change the admitted 026 baseline, do not tune parser rules, do not create a new blind benchmark, do not train a model, and do not switch production. Run the segmented control, full-sentence NLP arm, pretrained semantic-graph arm, and the oracle downstream isolation test exactly as specified. Stop after the experiment with WAITING_ADMIN_REVIEW=true. Do not automatically resume 026 and do not start 027.
