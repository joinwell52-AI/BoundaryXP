# 7P-HYBRID-015 — short single-flow r02

Outcome: **HYBRID_GATE_UNSAFE**. STATUS=WAITING_ADMIN_REVIEW; PRODUCTION_READY=false.

当前指针为 015。ADMIN 在旧口径实验封存后更新任务与方法；本修订在读取 2991d215 的指令后另建，不改旧封存。现行验收为短单流程、无 WP 分解；原根目录 015 的九案结果只作 LONG_MULTI_WP_DIAGNOSTIC_ONLY，不用于新门槛。

REF-001 闭合 false→false；12 个主样本完整 7+1 0/12→0/12，同案 I/O/A 0/12→0/12。四条保义变体和四个额外探针另列，不放大主分母。

|Case|I control→hybrid|O|A|joint IOA|full|
|---|---|---|---|---|---|
|S01|false→false|false→false|false→false|false→false|false→false|
|S02|false→false|false→false|false→false|false→false|false→false|
|S03|false→false|false→false|false→false|false→false|false→false|
|S04|false→false|false→false|false→false|false→false|false→false|
|S05|false→false|false→false|false→false|false→false|false→false|
|S06|false→false|false→false|false→false|false→false|false→false|
|S07|false→false|false→false|false→false|false→false|false→false|
|S08|false→false|false→false|false→false|false→false|false→false|
|S09|false→false|false→false|false→false|false→false|false→false|
|S10|false→false|false→false|false→false|false→false|false→false|
|S11|false→false|false→false|false→false|false→false|false→false|
|S12|false→false|false→false|false→false|false→false|false→false|

输入与完整预期合同在任何短测之前冻结：12 条一目标/一流程文本，其中4英文；4条保义变体；4条结构/歧义探针。主文本采用共享有限核对流程模板，背景占一定篇幅；这是受控样本，不宣称 blind 泛化。REF 来源与人工 Gold 原字节不变。SHORT-SINGLE-WP-BENCHMARK.json 及 SUPPLEMENT-FREEZE.json 保存所有文本、预期和摘要。

实际模型为已安装 BGE-M3、multilingual-E5-large、mDeBERTa NLI 与 HanLP/spaCy，L1 core-ontology@1.1.0、L2 software-ai@0.2.0；无 LLM/下载/训练。首次使用新真实句法输出；重复进程复用同一冻结句法并重新调用全部检索/NLI。精确路径、版本、摘要和每次实际请求/响应见 MODEL-MANIFESTS、PROPOSAL-GENERATION-AUDIT 与 runs-*/<id>/proposals.json。

新准入 40，局部来源支持 15、部分支持 1、错误绑定 24。错误不依靠旧长文本裁定：中文局部集合排除被赋予全局禁止对象，英文总用时上限沿用 ITEM(duration) 禁止框架；REF 的补语片段跨过冒号及下一谓词。已有错误框架的替换/强化和新独立错误义务分开计数。十二道布尔检查通过并不保证语义。完整记录见 INDEPENDENT-ADMISSION-REVIEW。

主样本错误的 RESOLVED 事实：FALSE_DEFINED 0→0；WRONG_BINDING 32→32；slot 状态不符 96→96；缺失输出所有内容 24→24。未证明额外条目单列，未强算成 false-defined。逐项预期/实际、完整来源及作用域证据见 SEMANTIC-REVIEW。只有完整 typed endpoint/owner/scope/binding 证明才给 MATCH；C 的未绑定 SOURCE_STATE 文本仅部分支持，不假装完成解析。

有界反例 21165 项，错误准入 0；真实短输入仍出现错误的 RESOLVED 准入，因此不能以该反例 PASS 宣称安全。实际合同与签名 Gate 独立记录，不能代替语义验收。模型排序重复 EXACT，准入/IR/Canonical/Proof 重复 EXACT。

性能单独记录控制、BGE、E5、NLI、准入及总 hybrid shadow 时间；首次实际 syntax 单列。非生产速度结论，冷加载含于首次请求。专用既有测试已实跑；本任务未要求全仓库回归，未重跑全仓库，不引用旧结果冒充。

每个首次及重复输入保存原文、真实句法、原始模型信号、准入账本、完整 Trace、Canonical JSON 与 Markdown。Parser 候选在旧非 Gold 阶段已冻结，本短修订不改算法。Gold/Source/旧 seal/v0.3/010/QI–QB/模型/阈值/Pack/生产入口保持；检查见 VERIFY 与 ANTI-OVERFIT-AUDIT。封存见 MANIFEST/SHA256SUMS/SEAL。无 merge/release/tag/生产切换，停止等待 ADMIN。

## Late ADMIN readback gate

推送前收到 accfd794 新增的 008–014 lessons 与 pre-code HYPOTHESIS / PRIMARY-SEMANTIC-GATE 要求。已全文阅读新增规范并保留原字节。两份命名 gate 文件在此时补为 readback；不能事后声称实现前冻结，pre_code_named_gate_satisfied=false，需 ADMIN 审阅时序例外。此前完整预期合同与候选确已在短测前冻结；所有原始结果不改，不开第二轮 phrase/rule repair，不因回归 PASS 或组件数增加继续。同期 Git fetch/gc 与只读审阅可能影响局部时延，PERFORMANCE 是实际观测而非隔离基准。

Git 原字节规则仅覆盖两个 015 实验报告目录，避免既有 CRLF 原文在检出时破坏 seal；不改原文。
