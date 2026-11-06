# Annotation provenance and research-only statistics audit

The same 625 cases and original outcomes are retained. The 41 exact annotation-source files and seven statistical input originals are bound by [SOURCE-MANIFEST.json](SOURCE-MANIFEST.json). Product source/reducers and production prompt templates are not distributed.

- [Current annotations and retained aggregates](current-annotations.json): source/result/job bindings, rationales, recorded revisions and existing calculator aggregate records.
- [Historical rebuilt statistics](rebuilt-statistics.json): results previously recorded using the fixed product reducer; retained as historical output, not a claim of current product execution.
- [CAR36 role records](car36-roles.json): 180 comparisons, 177 agreements, retained with original role annotations.
- [Resource identity](run-resources.json) and [prompt digest index](prompt-index.json): request settings and historical resource identities. Templates are managed separately.

```text
node evidence-r22/rebuild_statistics.mjs
python -B evidence-r22/verify_resources.py
```

The first script reconstructs annotations and LLM judgments from retained inputs, audits existing calculator aggregates against result digests and decisive-check identities, and recounts cases and roles. It **does not execute or reimplement the product reducer**. The second checks retained configuration, resource digests and the separately supplied historical protocol text. It reports zero bundled production prompt originals, distinguishing that distribution choice from the historical finding of nine exact originals.

REAL10 includes the original rationale Markdown bound to the initial notes digest and the r02 rationale file. MP40 r03/r04/r05 records distinguish a verdict revision from label normalization. MT30-017 retains its OPS-only correction with unchanged case-level outcome. Actor identity, prior-output exposure and post-run revisions retain their original declarations; no new independent Gold claim is made.

原始标注来源、理由、修订及625行保存汇总均保留。当前研究入口重新读取标注和LLM终局，并核对保存的计算器整体记录；不再运行产品归约代码，不将结果记录核对说成产品重放。工程源码、运行依赖和生产提示模板均已从论文包移除。

[Material scope](../MATERIAL-ACCESS.md)
