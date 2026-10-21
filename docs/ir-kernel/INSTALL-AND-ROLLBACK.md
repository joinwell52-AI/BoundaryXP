# 隔离候选使用

需要 Windows 上 Node >=22.18；本次实测 Node 24.16.0。Z3 使用锁定的官方 z3-solver 5.2.0 Node/WASM，MIT；许可和 WASM 摘要随证据保存。程序求解时不联网安装，也不调用模型。

在候选目录安装依赖：`npm ci --ignore-scripts --no-audit --no-fund`。已有 npm 缓存时可加 `--offline`；依赖准备好后运行无需网络。不要把 node_modules 提交到仓库。

运行结构化 IR（不是任务原文）：

```text
node scripts/ir-kernel.mjs --ir candidate.json --query query.json --out NEW_OUTPUT_DIRECTORY
```

输出原始候选、query、Core、source-map、7+1 JSON／中文、计算结果，以及求解结果中的 SMT-LIB、模型或冲突核。输出目录必须不存在，避免覆盖历史证据。source/label 不进入求解公式。

候选源码目录全组检查：`node scripts/verify-ir-kernel.mjs NEW_EVIDENCE_DIRECTORY`。此检查器排除启动 HTTP 监听的旧测试。隔离运行包内含内核检查，可执行 `node --test --test-concurrency=1 tests/ir-kernel/*.test.mjs`；原接口回归与完整检查器在源码候选中运行。无模型验收不会证明 LLM 已完整理解原文。

本包仅为 IR 内核隔离候选，不是 58618 的完整替换安装包。不要运行其中原产品的 UI 安装命令。此次没有升级、停启服务或改 current.json，所以没有线上回滚步骤要执行；停止使用该隔离目录即可回到原安装，保留候选证据。
