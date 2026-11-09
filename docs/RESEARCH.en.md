# 7+1 and BXP research

**English** · [简体中文](RESEARCH.md)

## Current paper

**BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation**

Wei Zhu, Independent Researcher. **English v1.2 / Chinese r23, 2026-11-06. Preprint released on GitHub.**

[English PDF](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.en.pdf) · [Chinese PDF](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.zh-CN.pdf) · [Complete research package](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/manuscript-with-materials.zip) · [Release and checksums](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23) · [Materials guide](paper/README.en.md)

**Zenodo DOI: [10.5281/zenodo.24072738](https://doi.org/10.5281/zenodo.24072738).** Deposited on 2026-11-09. The [public record and all files](https://zenodo.org/records/24072738) do not require GitHub repository access. The publication date retains the first GitHub release date, 2026-11-06.

The distribution revision is `RESEARCH_ONLY_1`. The GitHub repository remains private. Public archival on Zenodo does not imply peer review or journal acceptance and grants no additional usage license.

Suggested citation: Zhu, W. (2026). *BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation* (Version 1.2; Chinese r23). Zenodo. https://doi.org/10.5281/zenodo.24072738.

## Research question and method

How can a proposed AI plan or task decomposition be checked against the original task's deliverables, permitted behavior, prohibitions and shared constraints? The method organizes requirements through seven semantic views and an independent prohibition view. Shared structure retains object identity, scope, conditions, dependencies and handoffs. BXP specifies common interpretation, formalization, mathematical evaluation and result-reference conventions.

The paper connects three responsibilities:

1. **Semantic organization and source correspondence:** retain claims, purposes, relations and unresolved questions; classification or quotation matching alone does not prove correct interpretation.
2. **Formalization and mathematical verification:** establish consistency, membership, equivalence and implication within supported fragments, under explicit conditions on sound and complete source correspondence, coverage, structural recovery, interpretation and exact encoding.
3. **Decomposition preservation:** account for parent-required environments, per-environment feasibility, branch activation and shared constraints. Local satisfaction does not imply preservation by the whole combination.

The formal guarantees are conditional. They do not establish lossless interpretation of arbitrary natural language. Source interpretation, model fidelity and calculation correctness have distinct verification responsibilities.

## Experiments and supplement

The paper uses **625 cases, 3,219 task nodes and 3,469 calculation items**. Current annotations and final LLM judgments agree on 625/625 cases; final LLM judgments and aggregate calculator judgments also agree on 625/625 cases. The aggregate outcomes are 259 violations, 246 within bounds and 120 incomplete-information cases.

Item-level results are separate: 3,457 agreements, nine differences and three incomplete calculations. Six differences concern label encoding; three concern actual calculation judgments, where the calculator is correct and the LLM item judgment is not. None changes the aggregate case outcome. Missing fixed exchange or tax rates explain the three incomplete items. One reference-ID error affects three checks. Aggregate agreement does not imply agreement on every local role or calculation, nor independent blind-test accuracy.

The supplement contains original tasks, current annotations and revisions, 7+1 reports, operands, saved results, bilingual protocol texts, genuine interface screenshots and independent mathematical/statistical verification scripts. **It excludes 58618 engineering source, runtime dependencies and production prompt templates.** Auditing saved product results is distinguished from independent mathematical recomputation; neither is described as replaying the product implementation.

The paper uses the reviewed BXP-0001 `0.4.0-draft.2` baseline. Historical runtime resources retain their recorded draft.1 identity. Protocol review and implementation conformance are separate; see the [implementation record](../protocol/IMPLEMENTATION.md).

## Relationship to the tool and MCP

The paper develops the method and its conditions; BoundaryXP implements it. In the tested workflow, an LLM jointly proposes semantics and operands, followed by shared Core checks. The paper's complete admission responsibilities do not imply full tool conformance. This preprint release does not alter any product installation or service.

The existing structured-input MCP adapter and planned integration of the natural-language workbench workflow are separate capabilities; see [MCP status](MCP.md).

[Project README](../README.md) · [Protocol](../protocol/README.md) · [Roadmap](ROADMAP.md)
