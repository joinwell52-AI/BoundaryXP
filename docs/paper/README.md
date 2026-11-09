# 当前论文与研究附件

[English](README.en.md) · **简体中文**

**《BXP：基于7+1关联表示的人工智能任务边界判定方法》**  
朱卫（Wei Zhu）。英文v1.2 / 中文r23。分发修订：**RESEARCH_ONLY_1**。

预印本于2026-11-06首次在[GitHub Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23)发布，并于2026-11-09完成Zenodo公开存档。**DOI：[10.5281/zenodo.24072738](https://doi.org/10.5281/zenodo.24072738)。**

[Zenodo公开记录](https://zenodo.org/records/24072738) · [公开下载完整研究材料包](https://zenodo.org/records/24072738/files/manuscript-with-materials.zip?download=1) · [发布核验回执](ZENODO-PUBLICATION.json)。Zenodo文件无需GitHub权限即可下载；GitHub仓库仍保持私有。各材料保留原有使用条款。

[英文PDF](BoundaryXP-manuscript.en.pdf) · [英文正文](materials/manuscript.en.md) · [中文PDF](BoundaryXP-manuscript.zh-CN.pdf) · [中文正文](materials/manuscript.zh-CN.md) · **[完整研究材料包](manuscript-with-materials.zip)**

本论文附件仅包含研究材料：原文、标注及修订、7+1及共享关联、操作数、结果、报告、协议、截图，以及独立数学和统计核验脚本。**不含58618工程源码、Core/服务/界面实现、运行依赖、产品归约模块或生产提示模板。**

625组项目、3219个节点、3469项计算及625份报告保持原始字节。30个编号公式和两版各11段证明保持不变；正文中的附件范围与复核说明已同步修正。保存的产品汇总记录与独立数学复算分开说明，不将核对记录称为产品重放。

- [材料范围及访问](materials/MATERIAL-ACCESS.md)
- [原始项目与结果](materials/evidence-r18/README.md)
- [标注来源与统计核对](materials/evidence-r22/README.md)
- [报告索引](materials/reports625/INDEX.csv)
- [分类与数学见证](materials/analysis625/README.md)
- [有限数学实例](materials/repro-v0.8/README.md)
- [真实界面案例及独立复算](materials/case-r17/README.md)
- [双语BXP协议](materials/protocol-r14/README.md)
- [清理与核验回执](RESEARCH-ONLY-VERIFICATION.json)

解压完整材料包后运行`python -B supplement/verify_current_package.py`核对文件与统计。附带的独立研究脚本不加载58618源码、不调用模型。历史产品版本及摘要只作为来源记录，工程资产在论文目录之外独立管理。

[GitHub论文Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23)使用单独的研究分发树，自动源码压缩包也只包含论文分发材料。此次Zenodo发布及DOI同步不恢复旧工程历史，不改变工作台安装或GitHub仓库可见性。冻结附件中的日期、来源路径和发布准备状态保留其原始记录身份；当前发布状态以本页和Zenodo记录为准。
