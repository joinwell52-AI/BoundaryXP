<p align="center"><strong>English</strong> · <a href="README.zh-CN.md">简体中文</a></p>

# BoundX

**Turn ADMIN task boundaries into computable objects. Clarify task boundaries before execution.**

[Quick start](QUICKSTART.en.md) · [Product manual — Chinese](docs/BOUNDX-PRODUCT-MANUAL.md) · [7+1 method — Chinese](docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md) · [Current status — Chinese](docs/SHORT-COMPILER-STATUS.md) · [Documentation](docs/README.md)

> **Status as of 2026-10-08: a runnable short-text compiler candidate exists; full product semantic acceptance has not passed.** This update brings the aligned documentation into `main`. Candidate code remains on [`review/7plus1-parser`](https://github.com/joinwell52-AI/BoundX/tree/review/7plus1-parser) and is not part of this merge. `main` does not currently provide the `7plus1` or `7plus1:ui` scripts. Release tags and local installations are unchanged.

## What is BoundX?

BoundX is the product implementation of BXP, the Boundary Xplain Protocol. It converts the objects, actions, participants, conditions, quantities, and prohibitions in a natural-language task into evidence-linked 7+1, for subsequent formal boundary calculation and downstream conformance checks.

**The immediate priority is correct 7+1 extraction and compilation.** An installer, a green UI, valid JSON, model self-review, and passing engineering tests do not replace semantic accuracy. The complete product also does not end at eight text buckets: correct 7+1 must support computable boundary structures.

BoundX does not choose ADMIN's authorization scope, plan on behalf of PM, or execute business actions mentioned in source text. Admission of a boundary for downstream use is not a business decision or execution authorization.

## Current candidate method: the LLM understands; code preserves and compiles

```text
ADMIN short-task source
→ Parsing Skill + LLM semantic analysis
→ Evidence-linked events, objects, roles, conditions, and scopes
→ Audit Skill + a new model session
→ Technical validation and Boundary IR
→ Deterministic 7+1 JSON + Chinese rendering + provenance and unresolved items
```

Both Skills actually enter requests through a same-source `INLINE_BUNDLE`; native Skill discovery/loading has not been verified. Earlier HanLP, spaCy, and NLI work remains research history, not the default parser or a mandatory prerequisite for this candidate. Code does not reinterpret the source through old NLP rules after the LLM has supplied the semantics.

See the [method manual](docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md) for contracts and limitations.

## 7+1 preserves relationships

| View | Meaning |
|---|---|
| I | Inputs and scope |
| O | Produced results and deliverables, preserving required, permitted, and conditional uses |
| A | Current required or permitted action instances |
| P | Event-specific performer, organizer, reviewer, approver, recipient, and collaborator relationships |
| R | Execution limits with their targets, units, comparisons, and counting scopes |
| V | Versions and bases that constrain a particular use |
| C | Root-task completion, stopping, and escalation conditions |
| B | Prohibitions and restrictions, retaining objects, quantifiers, scopes, conditions, and exceptions |

One report can be a generation result, a review object, and a delivery artifact without becoming three unrelated entities. Not required is not forbidden; permission is not obligation; unspecified details are not unrestricted authority; an unknown condition is not satisfied. Genuine ambiguity must remain local rather than being guessed away to fill every view.

## Installed user entry: fixed port 58618

The following command applies only to the development checkout whose candidate installation and entry restoration have already been completed, not to a fresh clone of `main`:

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

Address: `http://127.0.0.1:58618/`. The tested setup needs Node.js 22.18 or newer and a locally signed-in Codex installation with available usage. The candidate accepts nonempty ADMIN tasks up to 300 Unicode code points, primarily Chinese with technical identifiers, with UTF-8 upload, provenance, unresolved items, history, and exports.

**This starts an existing installation; it is not a fresh-clone installer.** See [quick start](QUICKSTART.en.md) for clean installation, selecting a version, and comparing CLI/UI results. Text is sent to the configured model service: a local UI is not offline inference. A port or PID in a report is not a live health guarantee.

`npm run ui` is a separate existing BXP application. The development branch checkout's `npm run 7plus1` and the pinned installed UI can be different versions and must not be mixed in validation.

## Delivery status

| Item | Recorded status |
|---|---|
| Fixed-entry candidate | `0.1.0-candidate.031-r1.2` / `031-r1-c3`; restoration to 58618 is documented, while semantic acceptance remains PARTIAL |
| Effective fixed-set results for that candidate | 52 accepted cases and one Q05 review item; includes explicitly recorded frozen-response replay and supplemental runs, not 53 perfect first outputs from the final build |
| Repeats and original N set | 15/15 designated observations and 8/8 original N-set reviews; limited, purpose-selected evidence, not population accuracy |
| New Q05 development package | Universal scope is represented structurally, but two runs selected different domains; targeted testing yielded 6 passes and 2 review items, full new-method testing remains incomplete, and it is not installed at 58618 |
| Engineering regression | The latest Q05 report records 6689 passes, 0 failures, and 17 skips; this is not semantic acceptance or a test result for this documentation-only main merge |
| Complete boundary product chain | End-to-end acceptance from the new LLM compiler through all BXP calculation and downstream checks remains outstanding |

The [status page](docs/SHORT-COMPILER-STATUS.md) centralizes versions, source reports, remaining defects, and budgets. **An older score cannot validate a changed Skill/schema, and an available candidate package is not a formal release.**

## Product sequence

```text
Finish reliable short-text 7+1 compilation
→ Connect the same structure to existing formalization and deterministic calculation
→ Check PM plans and Agent downstream content against the parent boundary
→ Extend to complete real tasks
```

7+1 is the semantic foundation; Boundary Result is the subsequent computational output. ADMIN defines the boundary and PM plans inside it. Conformance must detect both boundary violations and omitted required work, without turning BoundX into a business executor.

The 300-code-point limit is the current supported profile, not a permanent product limit. Future Gold-60 validation must use complete original TASK files, not shortened fragments or Gold answers supplied to the parser.

## Branches, versions, and existing capabilities

BXP protocol versions, method-document revisions, the root repository package, and short-text installation packages are distinct. Do not rename them all to “0.4” or relabel an older wire contract as newer conformance.

The repository retains the [existing main-branch BXP Core entry](src/bxp/index.mjs), [protocol documentation](protocol/README.md), and [structured examples](examples/README.md). Development-branch calculation extensions must be checked against their [corresponding source snapshot](https://github.com/joinwell52-AI/BoundX/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/src/bxp/index.mjs). Those capabilities do not prove that the new source-text pipeline is integrated end to end. This merge changes documentation only, not candidate code, package releases, tags, or local deployments.

## Data, license, and branding

User history, credentials, real enterprise identity/policy data, and model weights do not belong in public source packages. Cancellation, upgrades, rollback, and service recovery must respect ordinary authorization and version checks rather than bypassing denials.

The [LICENSE](LICENSE) and actual third-party terms govern redistribution; this documentation update changes neither license nor package release status. Existing [brand assets](assets/branding/README.md) are retained.

Further reading: [capability matrix — Chinese](docs/FUNCTIONS.md), [validation — Chinese](docs/VALIDATION.md), and [development branch current task — Chinese](https://github.com/joinwell52-AI/BoundX/blob/review/7plus1-parser/docs/tasks/7plus1/CURRENT-TASK.md). Historical experiments and results remain separate from current candidate claims. Test reports support the product; they are not the product itself.
