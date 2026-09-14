# L3职员表 / Employee Directory

当前实现：封闭JSON合同、CSV导入/导出、最小词法匹配和虚构目录。UI/CLI向导与Registry启用仍在实施，不声称全部流程已交付。

固定CSV列：employee_id,display_name,aliases,subject_type,job_title,status,department。aliases写JSON数组并按CSV双引号转义。允许入口单个BOM，保留原始姓名；重复employee_id拒绝，共享别名返回全部候选。导出含表格公式前缀的身份值时拒绝CSV并要求使用JSON，不暗改身份值。

job_title可自定义；role_ref可省略或null。岗位不是任务责任，不自动补执行人。inactive仍识别身份并显示名册状态；没有名册时仍允许原文文字主体。PM-01不等于product-manager，QA不是QA-01默认别名。

examples/semantic-packs含tenant-a 0.1.0/0.2.0与tenant-b 0.1.0虚构目录，当前示例role_ref均为空，演示只依赖L1的独立职员表。v2要求的可选L2角色映射验收需另补，不将这些空映射示例冒充已完成的全部名册setup。

Customer data stays local. Matching uses edge whitespace trimming and ASCII case folding only; no fuzzy matching, transliteration, Unicode normalization, job-based authorization or cross-tenant identity merging.
