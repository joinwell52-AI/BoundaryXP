# BoundX BXP 产品统一交付 / Alignment delivery

状态：本地已验证，Draft PR 与远端 CI 待记录。 / Locally verified; remote CI pending.

## 基线与授权

- 仓库：joinwell52-AI/BoundX，PRIVATE。
- 基线：ae0bab1ac8a99e806327fc30b2b83c295826e5f0，分支 impl/bxp-product-alignment-v1。
- 授权任务书：PR #1，提交 a2fb068565605c0ac83ad6d6d4a973941ee270c6。
- 产品 1.3.0-preview.0；固定协议 0.3.0-draft.2；套件 1.0.0-draft.3。
- 协议正文、Schema、冻结向量、LICENSE 均未更改。不新增协议、不发布、不合并、不公开。

## 工作包提交与回滚点

| 包 | 提交 | 内容 |
|---|---|---|
| WP1 | 0d7abb2 | 唯一生产 Core、严格 JSON |
| WP2 | 435298b | 双语生产者指南和12例 |
| WP3 | 78639c5 | CLI 与 legacy 命名空间 |
| WP4 | ed720fc | MCP 与 Schema 资源 |
| WP5 | 2e9cf3a | BXP UI、Python/JS码点 |
| WP6 | 995768b | 产品文档、主出口与版本 |
| WP7 | 本 PR 后续提交 | 全量验证与审核交付 |

回滚基准为上述 baseline，功能工作包按相反顺序 revert；不 reset main、不改历史或重算冻结 expected。未执行回滚。

## 实际验证

| 命令 / Command | 结果 / Result |
|---|---|
| npm ci | 安装成功，审计0漏洞 |
| npm test | Core 54/54；Protocol 103/103；CALC 208/208 |
| npm run test:ui | 147/147 |
| .venv\\Scripts\\python.exe -m unittest discover -s python -p "test_*.py" | 133/133 |
| npm run test:docs | 14/14，链接检查通过 |

合计759个自动测试／冻结向量判定，新增76项，无跳过。其中新增集成相关53项、严格 raw18项、文档5项。另有真实浏览器人工 smoke：混合中文/English/emoji合法输入与重复键非法输入，实际显示三轴、独立B、null授权并清除旧结果；不计入自动测试数量。

CI 配置为 Ubuntu Node22/24 与 Windows Node24；每项运行全部Core/协议/向量/UI/Python/Docs，不仅协议。实际运行结果另行补录。

## 当前产品与兼容性

- Agent/其他生产者生成 boundx-task/v1；本地唯一 src/bxp/ 校验与计算；返回 boundx-result/v1。
- 包主出口 src/index.ts 仅导出 Core；旧函数改为 src/legacy/index.ts，不再从包根导出。
- CLI 主命令 evaluate/protocol-info；旧命令仅 legacy。
- MCP 主工具 bx_evaluate_task 与 bx_evaluate_task_json；旧工具仅 bx_legacy_*。
- UI 主页面导入/粘贴 BXP；旧研究界面 /legacy，旧 API /api/legacy/。
- Python 与 JS 研究证据均改为码点；旧代码单元偏移的缓存结果不自动升级，须重新计算。
- 两个授权字段始终 null；不把计算当作业务裁决、批准或执行许可。

## 已知限制 / Known limits

1. BXP-EXTRACT RESERVED；没有抽取金标、准确率或第二独立实现互操作认证。
2. 主 UI 为导入/粘贴模式，没有内置 Agent；Python/Lark 是有限覆盖 legacy 研究实现，不是已交付的 BXP SDK。
3. 原始 JSON 上限2 MB、深度64、节点100000、数值token1024字符；MCP总帧包含传输信封，所以可容纳的内部raw文本更小。严格拒绝重复键、非法UTF-8和数值往返损失；已解析对象无法恢复上游丢失信息。
4. UI仅127.0.0.1；不是生产多租户HTTP服务。主路径无模型、网络调用和客户原文持久化；旧PM研究功能仅显式配置调用时使用外部模型。
5. Profile不加载策略，显式作用域不触发执行或跨域联合求解；结果Schema校验不是独立数学证明。
6. 机器findings为英文；主UI为中英并列标签、状态建议和原始机器结果，证据不翻译。
7. 未发布包、Release、公开仓库、合并main或改变许可证；发布与实际业务处置仍需ADMIN另行决定。

## 完整文件清单 / File inventory

相对基线，A新增、M修改、R迁移（相似度由Git给出）。历史研究文档仅加非规范标签，保留原始结果。

```text
M	.github/workflows/protocol.yml
M	AGENTS.md
M	CHANGELOG.md
M	QUICKSTART.md
M	README.md
M	cli.mjs
M	docs/ADMIN-BOUNDARIES-016.md
M	docs/ADMIN-CALCULATION-010.md
M	docs/ADMIN-COMPUTATION-STATUS-012.md
M	docs/ADMIN-LOCAL-RULES.md
M	docs/ADMIN-MODEL-CHALLENGE-009.md
M	docs/ADMIN-PYTHON-011.md
M	docs/ADMIN-RESULTS-015.md
A	docs/AGENT-BXP-PRODUCER.md
M	docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md
M	docs/BOUNDX-PRODUCT-MANUAL.md
M	docs/DECOMPOSITION.md
M	docs/DOUBAO-PM-TEST.md
M	docs/FUNCTIONS.md
M	docs/INTRODUCTION.md
M	docs/QUANTITY-BINDING-018.md
M	docs/RESEARCH-7PLUS1-EXTRACTION.md
M	docs/SEMANTIC-CONTRACT-017.md
M	docs/SEVEN-PARAMETERS-EXAMPLE.md
M	docs/SOFTWARE-AI-DOMAIN-PACK.md
M	docs/THREE-TASK-CASE.md
M	docs/UI-ADVICE.md
M	docs/UI-GUIDE.md
M	docs/USER-CASES-017.md
M	docs/USER-CASES-018.md
M	docs/USER-CASES-019.md
M	docs/USER-PRODUCT-DESIGN.md
M	docs/USER-TASK-CASE.md
M	docs/VALIDATION.md
M	docs/WORK-PACKAGES-013.md
M	docs/article-brief.md
M	docs/cases-017/cases-90-100.md
M	docs/cases-017/en-41-60.md
M	docs/cases-017/long-81-89.md
M	docs/cases-017/mixed-61-80.md
M	docs/cases-017/zh-21-40.md
M	docs/cases-017/zh-numerals.md
M	docs/cases-017/zh-revised.md
M	docs/cases-018/cases-101-120.md
M	docs/cases-018/repaired-90-91.md
A	docs/tasks/BXP-ALIGNMENT-RECEIPT.md
M	docs/任务分解一致性设计.md
M	docs/原理与测试依据.md
M	domain-packs/README.md
M	domain-packs/l1/README.md
M	domain-packs/l3/README.md
A	examples/README.md
A	examples/bxp/en-b-absent.json
A	examples/bxp/en-complete.json
A	examples/bxp/en-conflict.json
A	examples/bxp/en-multi-source.json
A	examples/bxp/en-unresolved-scope.json
A	examples/bxp/en-unresolved.json
A	examples/bxp/zh-CN-b-absent.json
A	examples/bxp/zh-CN-complete.json
A	examples/bxp/zh-CN-conflict.json
A	examples/bxp/zh-CN-multi-source.json
A	examples/bxp/zh-CN-unresolved-scope.json
A	examples/bxp/zh-CN-unresolved.json
M	mcp.mjs
M	package-lock.json
M	package.json
M	protocol/IMPLEMENTATION.md
M	protocol/README.md
M	protocol/conformance/build-suite.mjs
M	protocol/conformance/conformance.test.mjs
M	protocol/conformance/hardening.test.mjs
A	protocol/conformance/raw-json.test.mjs
M	protocol/conformance/revision.test.mjs
M	protocol/conformance/run.mjs
M	protocol/provenance/build-manifest.mjs
M	protocol/provenance/manifest.json
M	python/admin_compute.py
M	python/metric_binding.py
M	python/semantic_contract.py
M	python/source_boundaries.py
M	python/source_constraints.py
M	python/task_projection.py
M	python/test_boundaries_016.py
M	python/test_chinese_quantities.py
M	python/test_domain_action_frames.py
M	python/test_guard_constraints.py
M	python/test_handover.py
M	python/test_long_scope.py
M	python/test_quantity_binding.py
M	python/test_semantic_contract.py
M	python/test_source_constraints.py
M	python/test_work_packages.py
M	python/work_packages.py
A	scripts/test_product_alignment.py
M	src/__tests__/boundx.test.ts
A	src/__tests__/bxp-cli.test.ts
A	src/__tests__/bxp-mcp.test.ts
A	src/__tests__/bxp-producer.test.ts
M	src/__tests__/decomposition-interfaces.test.ts
M	src/__tests__/decomposition.test.ts
R100	protocol/conformance/decimal.mjs	src/bxp/decimal.mjs
R098	protocol/conformance/evaluate.mjs	src/bxp/evaluate.mjs
A	src/bxp/index.mjs
A	src/bxp/raw-json.mjs
R095	protocol/conformance/validation.mjs	src/bxp/validation.mjs
M	src/index.ts
R100	src/decomposition-schema.ts	src/legacy/decomposition-schema.ts
R100	src/decomposition.ts	src/legacy/decomposition.ts
A	src/legacy/index.ts
R100	src/localization.ts	src/legacy/localization.ts
R100	src/schemas.ts	src/legacy/schemas.ts
M	ui-server.mjs
M	ui/admin-boundary.mjs
M	ui/admin-boundary.test.mjs
M	ui/admin-check.mjs
M	ui/admin-check.test.mjs
M	ui/admin-glossary.mjs
M	ui/admin-glossary.test.mjs
M	ui/admin-operators.mjs
M	ui/admin-operators.test.mjs
M	ui/admin-slots.mjs
M	ui/admin-slots.test.mjs
M	ui/app.js
A	ui/bxp-view.mjs
A	ui/bxp.css
A	ui/bxp.html
A	ui/bxp.mjs
A	ui/bxp.test.mjs
A	ui/codepoints.mjs
A	ui/codepoints.test.mjs
M	ui/grounding.mjs
M	ui/i18n.mjs
M	ui/index.html
M	ui/quantity-results.test.mjs
M	ui/semantic-contract.test.mjs
M	ui/server.test.mjs
M	ui/source-advice.test.mjs
M	ui/source-presentation.test.mjs
A	src/__tests__/bxp-integration.test.ts
A	docs/tasks/BXP-ALIGNMENT-DELIVERY.md
```

逐工作包计数与最终机器回执见 [执行回执](BXP-ALIGNMENT-RECEIPT.md)。

