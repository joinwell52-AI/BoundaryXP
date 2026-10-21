# BoundX Real Gold 用例规范入口

本页是 BoundX Real Gold 用例规范的统一入口。一个正式 Real Gold Case 必须同时遵守以下三份规范：

1. [Real Gold 生成与审定标准](GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md)  
   定义：什么是正确 Gold，包括 Evidence、7+1、Formal Boundary Model、确定性计算、Boundary State、Policy / Admission、G1-G10 与冻结条件。

2. [Real Gold 生成执行方法（SOP）](GOLD-GENERATION-SOP.md)  
   定义：怎样从真实 TASK 逐步生成正确 Gold，包括 Source Freeze、Context、Evidence、7+1 审定、形式化、计算、Validator、Gate 与状态机。

3. [Real Gold 文件版式与双语展示规范](GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md)  
   定义：怎样把同一套 Gold 机器事实以人类易读的中英双语文档展示，包括 `GOLD.zh-CN.md`、`GOLD.en.md`、数学公式、Evidence 展示、Validator Replay 与 Gate 版式。

## 正式 Case 结构

```text
REAL-GOLD-xxx/
├─ source/
│  └─ TASK-....md
├─ context/
│  └─ ...
├─ GOLD.zh-CN.md
├─ GOLD.en.md
├─ GOLD.json
├─ EVIDENCE.json
├─ FORMAL-MODEL.json
├─ RESULT.json
├─ REVIEW.json
└─ MANIFEST.json
```

## 固定原则

```text
标准统一答案
SOP统一过程
展示规范统一人读格式
JSON只有一套机器事实源
原始TASK / quote / SHA-256 / span始终保留原文
GOLD.en.md只是英文说明版，不是英文输入测试用例
```

后续所有 Real Gold Case 以本页作为规范入口。