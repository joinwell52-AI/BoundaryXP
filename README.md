# BXP research-only paper distribution

**BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation**  
**《BXP：基于7+1关联表示的人工智能任务边界判定方法》**

Wei Zhu / 朱卫. English v1.2 / 中文r23. Distribution revision: **RESEARCH_ONLY_1**.

- [English PDF](BoundaryXP-manuscript.en.pdf) / [中文PDF](BoundaryXP-manuscript.zh-CN.pdf)
- [English Markdown](manuscript.en.md) / [中文Markdown](manuscript.zh-CN.md)
- **[Complete research evidence package](manuscript-with-materials.zip)**
- [Distribution scope](DISTRIBUTION.json)

This tag is a separate research distribution tree. It contains no product source or product Git ancestry. The ZIP supplies original case data, annotations, reports, protocols, mathematical operands and independent research checks; it excludes 58618 Core/service/UI code, runtime dependencies, product reducers and production prompts.

After extracting the evidence ZIP, run `python -B supplement/verify_current_package.py`. Product replay is not supplied. The 625-case compilation and 3,469 calculation items retain their original recorded bytes and outcomes.

本分发树只包含论文及研究附件，不包含58618工程源码。论文的数学及统计核验脚本与产品工程实现分别管理。原始研究材料及许可范围见ZIP中的说明。
