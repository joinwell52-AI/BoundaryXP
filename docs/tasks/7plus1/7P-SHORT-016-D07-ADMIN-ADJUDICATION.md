# 7P-SHORT-016 — ADMIN Contract Adjudication for D07

## Decision

The frozen D07 expected Canonical 7+1 contract remains **unchanged**.

Source:

> 王齐负责整理说明。读取 service.yaml，生成 deployment-guide.md。deployment-guide.md 必须包含“部署步骤”和“回滚说明”两个部分。不得修改 service.yaml。deployment-guide.md 已生成且这两个部分都存在后，本任务完成。

ADMIN adjudication:

1. **“整理说明” is a macro-goal / task-summary predicate, not an additional independent Canonical A entry.**
2. The following explicit workflow — `READ service.yaml` + `GENERATE deployment-guide.md` — is the source-supported refinement of that macro goal.
3. **“说明” is not an independent I entry.** It is a generic description of the deliverable purpose and must not be projected as a separate task object.
4. The macro goal may remain in internal semantic structure as AUXILIARY / GOAL / refined-by evidence, but Q must not duplicate it as an extra Canonical A when the detailed actions fully instantiate it.
5. `deployment-guide.md must contain 部署步骤 and 回滚说明` is OUTPUT_CONTENT owned by `deployment-guide.md`; it is not current-task A.
6. Completion is the conjunction:
   - output exists;
   - 部署步骤 is present;
   - 回滚说明 is present.

## Generic rule

When a short-task source has:

```text
macro assignment / responsibility summary
followed by
explicit concrete workflow that fully refines the same goal
```

the parser must preserve the macro predicate as source semantics but avoid duplicate Canonical projection if the concrete workflow is a complete refinement.

This is semantic subsumption/refinement, not string suppression.

No case ID, literal text, file name, source hash, or offset may be used in runtime logic.

## Status

`ADMIN_CONTRACT_ADJUDICATED`

The D07 frozen expected contract in `7P-SHORT-016-FROZEN-CASES.md` is authoritative and does not require amendment.
