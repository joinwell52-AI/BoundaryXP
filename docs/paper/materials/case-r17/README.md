# EN20-007: original source, screenshots and independent mathematics

The original B-333 result, B-334 display, annotation, source tree and screenshots are preserved as research evidence. No live workbench or model is run by this package.

- [Five original English nodes](source.json)
- [Full original result](result.json): 7+1 claims, relations, operands, model judgments and program findings
- [Original annotation](annotation.json), [run identity](run-outcome.json) and [provenance](provenance.json)
- [Saved English report](report.en.md), [bilingual report](report.bilingual.md) and [original report](report-original.md)
- [Historical product-replay record](verification.json): a retained past result; the corresponding product implementation is not supplied

```text
python -B case-r17/verify_math.py
python -B case-r17/verify_screenshots.py
```

The first is an independent research check using rational lower bounds, interval relations and finite Boolean assignments. It recomputes the nine saved query statuses without product code; it does not reproduce the whole-task product reduction or every product result field. K1-K4 violate the EUR 6,000 cap or its related mathematical conditions; K5-K9 satisfy their stated queries. The minimum total is EUR 6,400 and the minimum excess EUR 400. The model's unresolved K1 answer remains recorded.

The screenshot check uses Pillow to verify the crops against the original real interface images. Source screenshots, text, coordinates and experimental identities are unchanged. No generated illustration replaces the interface.

本例仍属于625组中的EN20批次，不增加样本。原始输入、分析、译文、截图和历史产品重放记录均保持原字节。当前附件只附独立数学复算及截图核验脚本，已移除工程源码、界面覆盖文件与运行依赖。历史身份文件中的工程路径及摘要仅为来源记录。

[Material scope](../MATERIAL-ACCESS.md)
