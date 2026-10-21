# Codex执行回执 / Execution Receipt

## 当前增量 / Current increment — Cursor与默认初始化

Cursor SDK接入、动态模型目录、服务器内存凭据、双语行业名称与首次Host启动默认L1已实现；旧规则入口折叠隔离，主模型入口不静默回退。CLI包管理仍不自动启用。真实Cursor目录及受保护HTTP接口读取39个模型；真实生成验收仍为0/150，独立金标审阅0/120，Codex通道未实现。详见[Cursor接入说明](../CURSOR-CONNECTION.md)。

Cursor transport, dynamic catalog, server-memory credentials, bilingual industry labels and initial default L1 are implemented. Legacy rule controls are isolated. CLI package management does not implicitly activate packages. The live catalog returned 39 models; live generation acceptance and independent gold review remain pending. Codex transport is not implemented.

本次工作区Core289/289（含并行行业测试）、UI154/154、协议103/103、冻结向量208/208；本地链接94份文档278个链接无问题。新增SDK依赖后同步provenance manifest中的package.json/package-lock.json字节数与摘要，仅更新依赖来源记录，不修改协议正文、Schema或冻结向量。npm audit为0。首次默认初始化暴露CLI导入被隐式启用的问题，已将pack管理明确排除默认初始化，回归通过。

Workspace tests: Core289, UI154, protocol103, frozen vectors208 passed. Dependency provenance hashes were refreshed without changing normative protocol, schemas or frozen vectors. npm audit reported zero vulnerabilities. The first bootstrap regression exposed unintended CLI import activation; package management now explicitly opts out and the regression passes.

## 模型链路增量 / Model pipeline increment — 2026-09-14

原页面 `/legacy` 复用已有模型配置、连接测试及 Chat Completions / Responses 传输；新增标准面板经 `/api/admin-model` 准备上下文、严格解析模型候选、调用唯一 BXP Core 并显示三层报告。旧研究和 PM 控件仍明确为非 BXP。此入口当前使用 L1 与可选 L2，不发送 L3 职员目录；行业下拉从本地已安装包动态加载。模型请求需要明确点击，不自动重试，密钥不进入提示词或准备快照。Case Explorer 仅供查看用例。

The existing page reuses model settings, connection checks and both provider transports. The new standard panel prepares context, strictly validates candidates, evaluates through the sole Core and displays three layers. Legacy research/PM controls remain non-BXP. This entry currently selects L1 and optional L2, without L3 disclosure. Installed industries are dynamic. Explicit model invocation is required; there are no automatic retries. Keys are excluded from prompts and prepared snapshots. Case Explorer remains a viewer.

本次本地验证：Core 全工作区 284/284（包括另一任务尚未提交的行业测试）；UI 152/152；协议测试 103/103；冻结向量 208/208；Python 135/135；文档测试 20/20，93份文档、278个本地链接无失效。新增两个 HTTP 端到端测试使用模拟提供方，每种接口覆盖成功、伪造证据、错误快照、重复 JSON 键、Markdown 包装、提供方失败、截断和拒绝发送授权。模拟调用不是实际模型运行或抽取准确率证明。

Local validation: workspace Core 284/284 (including concurrent uncommitted industry tests), UI 152/152, protocol 103/103, frozen vectors 208/208, Python 135/135, documentation 20/20; 93 documents and 278 local links checked. Two new HTTP end-to-end tests use mocked providers, covering both transports and fail-closed scenarios. These are not real model runs or evidence of extraction accuracy. Independent gold review and live-model acceptance remain pending; no merge or release is authorized.

状态：PARTIAL_IMPLEMENTATION / PENDING_GOLD_REVIEW / BLOCKED_LIVE_MODEL。  
日期：2026-09-14；唯一仓库D:\boundx。  
基线origin/main：50b9882c7b3e5118e85fb6993ba365d8f054fe0b。  
代码检查点：c91e7ae；测试环境Windows、Node v24.16.0。

## WP实际状态

| WP | 状态 | 已有证据与剩余项 |
|---|---|---|
| WP0 | 完成 | 固定v2全文、原120文本、基线与标准来源；保留既有改动 |
| WP1 | 部分 / PENDING_GOLD_REVIEW | 产品合同已实现；120条源摘要/审阅索引存在，但八桶答案、关系与独立审阅未冻结 |
| WP2 | 完成 | 独立L1迁移、Node离线加载、Python兼容与隔离加载回归 |
| WP3 | 部分 | L2版本迁移、ID保留、122动作与计数/引用检查；新增15动作各8条词法/引文fixture，不等于完整八类语义端到端验收 |
| WP4 | 部分 | CSV/JSON构建、可选岗位映射、独立名册；原虚构fixture保留空role_ref，v2默认映射setup还需补齐 |
| WP5 | 部分 | 目录/受限ZIP、Registry、摘要与隔离；64固定组中的全部故障/安全矩阵尚未逐项完成 |
| WP6 | 部分 / BLOCKED_LIVE_MODEL | 四个MCP产品工具、固定prepare、两种回放与token核验；真实已授权Host运行0次 |
| WP7 | 部分 | 引文码点、快照、候选复核与唯一Core、跨入口一致；不能普遍证明语义蕴含或漏项，不冒称64组已齐 |
| WP8 | 本地流程已实现 | 首页入口、ADMIN页面、CSV预览/构建/导入/启用、候选导入与三层报告；兼容Host自动桥接未交付 |
| WP9 | 未完成 | 本地回归通过；64固定fixture矩阵、120审阅金标、150次真实模型运行与CI审核仍待完成 |

## 实际命令与计数

全部命令在本独立仓库重新执行。以下数量分开报告，不相加为“抽取通过数”。

| 命令/范围 | 真实结果 |
|---|---|
| npm test（含并行任务尚未提交的10个核心测试） | Core 261/261；协议测试103/103；冻结向量208/208 |
| node --test，仅git ls-files列出的src/__tests__/*.test.ts | 本实施已跟踪Core 251/251，不包含并行任务10个测试 |
| npm run test:ui（补齐首页与异步状态测试后重跑） | 151/151 |
| .venv/Scripts/python.exe -X utf8 -m unittest discover -s python -p test_*.py | 135/135 |
| npm run test:docs | 20/20；当时磁盘84文档、267本地链接、0问题，含并行任务文档，不作为PR专属文档数 |
| git diff --check | 通过 |
| git diff 50b9882 --name-only -- protocol LICENSE | 空；规范、协议Schema、冻结向量、LICENSE无差异 |

已跟踪Core复现方式：由git ls-files读取src/__tests__/*.test.ts，再作为参数传给node --test；不按磁盘glob纳入另一任务的新文件。CI针对提交树独立重跑，结果不得由本地通过推定。

首次UI回归出现23项Python桥接失败，定位为迁移后的semantic_data普通import在-I隔离模式不可见；3b32b33改为按本文件路径显式加载。随后UI147/147通过，再增加4个页面/异步状态测试后151/151通过。保留这一失败记录，不隐去首次失败。

## 语料与真实模型

- v2原始种子120条；审阅金标0条，review-index里的null/PENDING不是金标。
- 用户先前提交的补充原文60条，保留U139–U168、U199–U228，不补造缺失编号，不把附带结论自动当金标。
- 新增L2动作fixture120条，是15动作×中英×正例/否定/歧义/缺证据；当前主要证明词法候选和精确引文检查，不能冒称全部模态/歧义语义断言通过。
- 并行创建的行业200/1000批次未纳入本PR，本回执不确认其原文独立性、金标质量或覆盖率。
- 真实Host运行0/150，独立金标审阅0/120。Host及可取model ID尚无实测证据；未知值保持unknown。
- 不报告98%/95%精确率/召回率已达到，也不将模型失败或全未知从未来分母删除。

## 明确限制与下一步

1. 逐项补齐v2第12.3节64组fixture及全部断言，不以251个测试数替代64组覆盖。
2. 默认名册的行业角色映射、120条金标答案集合及独立审阅仍未完成；不根据当前输出倒推金标。
3. 后续395750c已扩展动作、实体、岗位、资源、依据、完成和风险词汇的受控检索，保留candidate_only与关联原因；召回完整性和解释蕴含仍未证明，真实引文不证明模型解释一定成立。
4. ZIP支持保守子集；生产多租户认证、强对抗本地文件系统并发和任意ZIP互操作不是已证明能力。
5. ADMIN页面为本地准备和候选导入，不假装自动调用Host。真实模型验收需可用已授权Host与独立审阅；不购服务、不读取凭据。
6. 本回执不宣称CI完成；推送后在Draft PR附实际矩阵结果。禁止自动合并或发布。

## Codex声明

本次只修改列于[文件清单](ADMIN-TEXT-SEMANTIC-PACKS-DELIVERY.md)的实施范围；并行行业文件保留不动。所有中文编辑使用apply_patch，未使用PowerShell改中文。BXP与两个授权字段的含义不变，未训练模型、未合并main、未移动标签、未发布或公开仓库。

This is a partial engineering delivery. Deterministic replays, package tests and local UI regressions do not replace independently reviewed gold labels or real Host runs. ADMIN review remains required.

## 六行业增量检查点 / Six-industry Increment

代码9c50eab响应ADMIN后续六行业要求，允许已安装L2动态选择并显式切换；仍限制一次一个行业，不自动启用。新增用例盘点工具不修改并行任务的语料，见[六行业核查](INDUSTRY-SIX-PACKS-INTEGRATION.md)。6000记录按行业精确原文去重后合计1284，不能记为6000个独立语义场景；各批次仍待金标审阅。

本轮重跑：已跟踪Core255/255，UI152/152，协议测试103/103，冻结向量208/208，Python135/135，文档20/20。另读测并行维护的五个新行业包，10/10个结构/词法测试通过；该10项及行业资产未被本实施擅自提交。磁盘文档87、本地链接275、问题0，其中包含并行文件，不冒充PR专属文档计数。

先前检查点5617ecc的[CI运行34839953430](https://github.com/joinwell52-AI/BoundaryXP/actions/runs/34839953430)在Ubuntu Node22、Ubuntu Node24、Windows Node24三组均通过。该结果不自动覆盖9c50eab及后续提交；最新CI以Draft PR #6对应head的实际结果为准。本地预览在http://127.0.0.1:64285/admin更新，仍不是完整Host实测验收。

## 上下文检索增量 / Context Retrieval Increment

395750c增加七类L2上下文、共享词边界匹配、跨类别同名ID消歧，检索规则更新为literal-ascii-v2。新prepare锁定新规则/Schema摘要，不重写历史快照。风险关联只提供候选，不产生B或执行授权；超过64KiB显式拒绝，不截断后冒称完整。

本轮重跑已跟踪Core260/260、UI152/152、协议测试103/103、208冻结向量全部通过、Python135/135、文档20/20。新增5项检索/边界/快照/引用测试。协议目录与LICENSE仍与基线无差异。616951c的[CI运行34840651652](https://github.com/joinwell52-AI/BoundaryXP/actions/runs/34840651652)三环境已通过；不将其冒称395750c的新CI证据。整体仍为PARTIAL_IMPLEMENTATION，真实Host与独立金标门槛不变。
