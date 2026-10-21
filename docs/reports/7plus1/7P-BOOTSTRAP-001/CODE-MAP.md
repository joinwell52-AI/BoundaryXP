# 当前 Parser 代码地图

58618 当前 adapter → 冻结 server.mjs → parse7Plus1() → SourceDocument → linguistic.mjs（HanLP/spaCy 与 typed literals）→ nativeFrontend → decodeCandidates → preserveSourceSemantics → resolveExpressions → semanticSoundness → Eligibility → BoundaryIR（scope一致性断言）→ deterministic projection → ProofDAG → 模型语义信号。完整实际导入及摘要见 RUNTIME-MAP.json。

本任务不迁移：Python worker 的ROOT由父目录深度决定、模型信号硬编码本地根、模块/历史/导出有冻结URL相对路径链。安全归位需要独立的路径/资源依赖迁移验收。这里保留唯一真实实现，不机械复制目录，不创建独立漂移的Parser。src/producer/7plus1/只建立canonical命名空间。

根 package.json 的7plus1脚本仍是旧P2入口，不冒称当前入口，也不在bootstrap偷改。58618原P3 adapter使用已封存P3隔离历史，任何新的测试不得写它；本任务真实完整解析通过同一冻结parse7Plus1()在新的报告目录留证。

已有 tests/parser-v03-p22-*.test.mjs 是原位置冻结回归；新专属测试放 src/__tests__/7plus1/，不会批量移动和改写旧封存。REF-001 来源为 ADMIN 已接受的会议；其他50条只盘点候选位置，不宣布确认。

src/bxp/ 不是Parser归位目录，本任务不改变BXP定义。model-signals→src/product/packages.mjs含现有静态协议导入，记录真实耦合而不在本次重新设计。
