# Current paper and research supplement

**English** · [简体中文](README.md)

**BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation**

Wei Zhu. English v1.2 / Chinese r23. Distribution revision: **RESEARCH_ONLY_1**.

Released as a preprint on GitHub on 2026-11-06. [Release and checksums](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23) · [Download the complete research package](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/manuscript-with-materials.zip). The repository remains private; access requires permission. This release has no DOI.

[English PDF](BoundaryXP-manuscript.en.pdf) · [English Markdown](materials/manuscript.en.md) · [Chinese PDF](BoundaryXP-manuscript.zh-CN.pdf) · [Chinese Markdown](materials/manuscript.zh-CN.md) · [Research ZIP in the repository](manuscript-with-materials.zip)

The supplement contains task sources, annotations and revisions, 7+1 representations and shared relations, operands, results, reports, protocol texts, screenshots, and independent mathematical/statistical verification scripts. **It excludes 58618 engineering source, Core/service/UI implementation, runtime dependencies, product reducer modules and production prompt templates.**

The original bytes of the 625 project groups, 3,219 task nodes, 3,469 calculation items and 625 reports are preserved. The 30 numbered formulas and 11 proof passages in each language edition remain unchanged. Auditing saved aggregate product records is distinguished from independent mathematical recomputation; the supplement does not claim to replay the product implementation.

- [Material scope and access](materials/MATERIAL-ACCESS.md)
- [Original projects and results](materials/evidence-r18/README.md)
- [Annotation sources and statistical audit](materials/evidence-r22/README.md)
- [Report index](materials/reports625/INDEX.csv)
- [Classification and mathematical witnesses](materials/analysis625/README.md)
- [Finite mathematical examples](materials/repro-v0.8/README.md)
- [Interface case and independent recomputation](materials/case-r17/README.md)
- [Bilingual BXP protocol](materials/protocol-r14/README.md)
- [Research-only package verification](RESEARCH-ONLY-VERIFICATION.json)
- [GitHub publication verification](GITHUB-RELEASE.json)

After extracting the research ZIP, run `python -B supplement/verify_current_package.py` to verify files and statistics. These independent scripts neither load 58618 source nor call models. Historical product versions and digests remain provenance records; engineering assets are managed separately.

The paper release tag uses a separate research distribution tree. GitHub's automatic source archives also contain only paper distribution materials. Private repository history has not been rewritten.
