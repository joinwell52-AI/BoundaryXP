# 7P-ADMIN-SHORT-019-LONG

最终结果：`ADMIN_SHORT_050_CLOSED_SHADOW_GENERALIZATION_GAP`。这是任务内 50 个开发/接受样本闭环，独立变体仍有缺口；不宣称解析器已适用于所有短任务。

| 检查 | 实际结果 |
|---|---|
| 原文取得、字节保留 | 50/50 |
| 任务局部冻结 oracle | 597 个来源支持事实，修改候选前冻结；不是规范 Gold |
| 完整 Root 7+1 语义审阅 | 50/50 FULL_ROOT_7PLUS1_CLOSED |
| partial / wrong binding / unsupported RESOLVED | 0 / 0 / 0，限这 50 例的工程审阅 |
| 明确原文未决 | 0，限这 50 例 |
| 8 类独立控制 | 48/48，通过正例、反例及必须保留未决的歧义例 |
| 最终独立变体 | 92/100；8 项 GENERALIZATION_SHADOW_GAP |
| 旧 G0 | 5/5 |
| D01–D08 | 8/8 |
| REF-001 | 43/43，保留“上述材料”真实歧义 |
| R1 独立语义控制 | 18/18 |
| 候选专项测试 | 49 通过，0 失败，0 跳过 |
| 重定向旧语义回归 | 82 通过，0 失败，0 跳过；只改测试的 engine 导入 |
| 原 Parser 回归 | 4400 通过，0 失败，0 跳过；最终冻结一致性 true |
| 全仓回归 | 6342 通过，0 失败，17 跳过；跳过不计通过 |
| 最终冻结后两次真实 NLP 重跑 | 325/325 语义签名 EXACT，覆盖 50、48、最终 100、旧控制 27、试运行变体 100 |
| 反过拟合 | 静态 runtime 扫描及 25/25 身份更名变体通过 |

逐例最终答案在 `final-50/ADM-xxx/canonical-7plus1.json`，对应完整 Trace、原文、未决、Proof 摘要和 `semantic-review.json` 同目录。`FULL-50-SEMANTIC-REVIEW.json` 包含实际事实的主体、对象、参与者角色、scope、condition、quantity、来源及证明引用。审阅先对照原文，再核对实际语义结构；oracle 匹配与合同 PASS 不单独等于语义正确。审阅是工程接受结果，仍等待 ADMIN 独立复核。

独立变体分项为：身份更名 25/25，同义表达 22/25，极性对比 20/20，数量/条件 15/20，输出内容 10/10。三条同义表达缺口涉及范围排除、Basis/条件中的协调动作与完成条件的共享谓词；五条数量缺口为“至少重试”的明确下界目标未形成。完整失败原文、实际事实和首处偏离见 `SHADOW-FIRST-DIVERGENCE.json`。这些失败未用于冻结后的修复。

必须披露的执行偏差：初次 `CANDIDATE-FREEZE.json` 早于完整 82 项历史语义保留测试。该次保留测试真实结果为 64 通过、18 失败。第一套 shadow 试运行已产生，但其结果未用于修复；修复依据是预先存在的 014/016/018 保留构式。初次冻结、首次失败和试运行原始输出全部保留。完成旧语义保留后重新冻结为 `CANDIDATE-FREEZE-r02.json`，再生成一套新的 100 条独立变体，并且之后未改 runtime、模型、阈值或冻结验证协议。另将试运行那 100 个原始输入在最终候选上重新实际解析两次，保证所有运行过的变体输入都有最终候选重复性证据。见 `FREEZE-SEQUENCE-REVIEW.json`、`REPEATABILITY.json`。

`ORIGINAL-REGRESSION.json` 等顶层首次记录保持原样；首次原 Parser 回归虽为 4400/4400，但冻结文件一致性字段为 false，不能当作最终候选冻结证明。最终结果单独记录于 `test-runs/final-r02/`，旧失败不覆盖。全仓回归直接在 D:\boundx 执行，包含实际本地测试；不将其他目录测试作为证据。

修改位于隔离候选目录，细节见 `ARCHITECTURE-CHANGES.md` 和八类机制审计。沿用 v0.3 方法、R1 PART_OF / QualifiedDomain、确定性 QI–QB 投影。没有修 Gold、改原文、训练/替换模型、调整阈值或 Pack、执行业务、切生产入口、merge/release/tag。

本工作目录在任务开始时已有大量未提交改动与缺失文件。`PROTECTED-ASSETS-AUDIT.json` 核对全部 12993 个原有 tracked 路径的初始工作区字节/缺失状态，未把现有脏工作区混入本次提交。提交仅包含本次候选、测试、报告和原有未跟踪但实际必需的两份 Python 模型清单依赖。模型权重、缓存、凭据不上传。

完整迭代证据约 2 GB。原始文件本地保留，GitHub 通过 `archives/*.tar.gz` 无损交付；`ARCHIVE-INDEX.json` 按每个 tar 成员保存原路径、字节数和 SHA-256，全部解压读取校验。最终 50 例和专项测试必需的首次 NLP 控制 Trace 同时提供未压缩文件。读取历史失败或复跑历史脚本时，可按清单在仓库根目录解压对应档案，不需要任何模型答案。

Manifest / SHA256SUMS / SEAL 与复核结果均在本目录。最终冻结 runtime 和模型再次核验，原文与旧封存均未覆盖。交付状态：`STATUS=WAITING_ADMIN_REVIEW`，`PRODUCTION_READY=false`。
