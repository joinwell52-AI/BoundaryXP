# Research-only verification guide

English v1.2 / Chinese r23. **RESEARCH_ONLY_1**.

Run from the extracted package directory:

```text
python -B supplement/verify_current_package.py
python -B evidence-r18/verify.py
node evidence-r22/rebuild_statistics.mjs
python -B evidence-r22/verify_resources.py
python -B analysis625/analyze.py
python -B analysis625/witness_checks.py
python -B repro-v0.8/verify.py
python -B supplement/verify_r17_clarifications.py
python -B supplement/verify_r9.py
python -B supplement/verify_r20_examples.py
python -B case-r17/verify_math.py
python -B case-r17/verify_screenshots.py
```

The screenshot check needs Pillow. The other listed research scripts use standard Python/Node facilities. No product source or runtime dependency bundle is supplied. Protocol checks run as `python -B review/check_revision.py verify --package` inside protocol-r14.

Manifest checks establish distributed-file identity. Annotation and LLM columns are reconstructed from retained sources. Calculator aggregates are read from retained audit records and bound to raw-result digests; they are not recomputed by the product reducer here. Mathematical scripts separately recompute the finite models and selected operands, including nine EN20-007 queries.

Historic product replay reports remain historical evidence. These scripts do not run the workbench, call a model, regenerate semantic analysis, or establish independent blinded accuracy. See [material scope](../MATERIAL-ACCESS.md).

本附件不含58618工程实现或运行依赖。保留的是独立研究脚本：文件摘要、统计、有限数学模型、指定操作数及截图来源核验。产品历史重放记录与当前独立数学复算分开说明；不得将保存汇总的核对称为产品重新运行。
