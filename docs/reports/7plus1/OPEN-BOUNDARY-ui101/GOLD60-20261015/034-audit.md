发现 2 处对象范围遗漏，建议最小补充：

1. **四件套的具体对象未保留。**候选 O-A 仅称“四件套”，其他位置也未完整定义。
   - 原文：“四件套(`.cursor/rules/*.mdc` + `AGENTS.md` + `CLAUDE.md`)”。
   - 建议：在 O-A 补上这些路径／文件名，明确版本读取所针对的对象。

2. **互惠回执的 REPORT 匹配范围被省略。**候选 O-G、P 将匹配对象写成“REPORT 或 follow-up TASK”，未保留 REPORT 的目录和文件模式。
   - 原文：“每条 `tasks/TASK-*.md` 是否有匹配的 `reports/REPORT-*.md` 或 follow-up TASK”。
   - 建议：明确写为“按 `thread_key` 匹配 `reports/REPORT-*.md` 或 follow-up TASK”，避免将其他位置的 REPORT 自动计入回执。

其余未发现明确语义偏差。已核对全部 7+1 视图及跨视图关系；15 个抽样名额、≥7 天和四层计数无计算错误。候选保留的读取限制等局部问题仍需保留；本次审阅不构成数学或业务验收。