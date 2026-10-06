# 026F 隔离下游实验：不准入

本目录只包含来源复核诊断入口、实际下游核心快照和未准入的隔离修改。生产入口与活动 026 不指向这里。最终任务状态为 FAIL，审阅报告位于 `docs/reports/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F/REPORT.md`。

在仓库根目录使用 Node.js 24 与已有 Ajv 依赖。先把报告目录中的全部 EVIDENCE ZIP 解压到仓库根目录，保留 ZIP 内的完整相对路径。不需要模型下载，也不调用模型。

```text
node research/7plus1-parser/downstream-semantic-validation-026f/replay-frozen.mjs admin-replay-001
```

使用全新 revision 名称；已有目录会拒绝覆盖。该入口重放 22 份冻结诊断图，以及从证据中的 350 份自动路径 Trace 恢复完全相同的 Gc。自动路径检查 G8，诊断路径仅将自动生成器运行证明记为 NOT_APPLICABLE。保存实际完整 Trace 与 Canonical。自动路径同时核对八类实际语义输出与本轮封存结果一致。

例如末尾追加 `1` 可做一条诊断图和一条自动图的烟雾验证。该验证不替代全批比较。完整语义比较与独立原文审阅结果见封存矩阵；字节重复性和合同门禁不等于语义正确。

`bootstrap.py`、`setup-isolation.mjs`、`freeze-inputs.mjs`、`refactor.mjs` 等是首次实验的建立记录，会拒绝覆盖既有结果，不应在已封存目录再次执行。已有完整 baseline/trial 快照无需重建。历史与全量回归需要当时本地工作区的既有测试和资产；各测试 SHA、实际日志及跳过原因已封存，不声称本目录单独涵盖全部历史运行环境。
