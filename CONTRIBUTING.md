# 参与贡献 / Contributing

欢迎提问、质疑、反例、独立复现和改进建议。你无需先认可 7+1 方法，也不必先证明存在缺陷才能参与；中文、英文均可。下面的材料是帮助复核的建议，不是提问门槛。

Questions, criticism, counterexamples, independent reproductions and improvements are welcome in Chinese or English. You do not need to endorse the method or prove a defect before asking a question. The evidence suggestions below help review; they are not a barrier to participation.

## 先提一个问题 / Start an issue

| 入口 / Entry | 适合的内容 / Use for |
|---|---|
| [一般提问与建议 / Questions and ideas](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=04-question.yml) | 方法理解、使用疑问、功能建议 / Understanding, usage and proposals |
| [7+1 方法反例 / Method counterexample](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=01-method-counterexample.yml) | 表示能力、假设、推理或结论争议 / Representation, assumptions, reasoning or disputed findings |
| [MCP 使用问题 / MCP problem](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=02-mcp-problem.yml) | 安装、宿主接入、工具、导入、报告、导出或运行行为 / Installation, hosts, tools, imports, reports, exports or runtime behavior |
| [L2/L3 语义问题 / Semantic resource issue](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=03-semantic-resource.yml) | 术语歧义、缺项、映射、版本引用或字典格式 / Ambiguity, missing terms, mappings, versions or dictionary format |

也可[创建空白 Issue](https://github.com/joinwell52-AI/BoundaryXP/issues/new)，先描述疑问。请尽量搜索已有问题，再补充或关联相近讨论。公开 Issue 和 PR 会公开显示内容；仅提交你有权公开的最小样例，不上传密钥、账号信息、客户资料或个人运行日志。

You can also [open a blank issue](https://github.com/joinwell52-AI/BoundaryXP/issues/new) and start with your question. Search existing reports where possible and link related discussions. Issues and PRs are public: share only a minimal example you are allowed to publish, without credentials, account details, customer material or personal runtime history.

## 哪些证据有用 / Useful evidence

- **方法 / Method：** 指出论文或协议的具体版本、章节或主张；给出任务原文、相关 7+1 关系，以及你认为应得出的结论和理由。若尚无完整反例，可以先提出疑问。Identify the edition, section or claim, relevant source and relations, and your expected finding with reasoning; an initial question is enough to begin.
- **MCP / Implementation：** 尽可能注明包版本、宿主与系统，给出最小步骤、实际行为与预期行为；注明问题发生在语义解释、Core 核验还是界面/适配器。Include package version, host/OS, minimal steps and observed versus expected behavior if known, distinguishing interpretation, Core checks and presentation/adapter behavior.
- **L2/L3 / Resources：** 尽可能注明词库标识、版本和摘要，提供可公开的小段词条或原文，说明歧义、缺失信息或建议修订。Include identifiers, version/digest if available, a publishable excerpt, ambiguity or missing information, and a proposed correction.

研究案例、数学论证和工程回归各自有适用范围，均不表示 7+1 或 MCP 对所有任务百分之百正确。可复现的计算不自动证明输入表示或自然语言解释正确；反例和未决分歧应按原始证据讨论。业务裁决和执行授权由人及宿主负责。

Research cases, formal arguments and engineering checks have distinct scopes. None establishes universal correctness of 7+1 or MCP. Reproducible computation does not by itself validate its input representation or natural-language interpretation. Discuss counterexamples and unresolved disagreements against the original evidence. People and host systems retain business decisions and execution authority.

## 提交贡献 / Submit a contribution

欢迎贡献文档和翻译、可公开的最小案例、协议勘误、独立核验与统计改进、L2/L3 格式示例及有依据的词条建议。词库贡献请附来源与可公开使用的依据；加载资源或岗位名称不能建立权限事实。

Contribute documentation and translations, publishable minimal cases, protocol corrections, independent verification/statistical improvements, L2/L3 format examples and evidence-backed terminology proposals. Identify sources and the basis for sharing resource material; loading a resource or a role name does not establish authority.

1. 对较大的方法或行为变更，先用 Issue 说明问题、目标和证据；小的文档纠错可直接提 PR。For larger method/behavior changes, discuss the problem, goal and evidence in an issue first; small documentation fixes can go straight to a PR.
2. 从当前公开 `main` 建立分支，只提交相关文件，在 PR 中说明改变了什么、为什么，以及实际做过的验证。Branch from the current public `main`, keep the diff focused, and explain the change, rationale and checks actually performed.
3. 修改范围以本仓库已公开文件为准。Core 原实现源码保持私有；涉及私有实现的缺陷仍欢迎提 Issue，由维护者在对应实现中处理。Work on files published in this repository. Original Core source remains private; report implementation defects here for maintainer follow-up.
4. 保留冻结协议、任务原文、标注、失败、报告及论文附件的原始身份；在独立新增材料中提出纠正，不为配合结果而改写冻结证据。Preserve frozen protocols, sources, annotations, failures, reports and paper assets; propose corrections in separate new material rather than rewriting evidence to fit a result.
5. 不因贡献自动更改材料许可，不提交私有工程历史、现场配置、凭据或个人数据。Contributing does not automatically change material licenses; omit private implementation history, deployment configuration, credentials and personal data.

提交问题不要求先运行付费模型或构建私有工作台。维护者复核时应记录结论的版本、证据和范围，区分方法限制、实现缺陷、词库问题及待明确事项，不把报告提交或复现成功当作语义验收通过。

Filing an issue does not require paid model calls or a private workbench build. Review should record the version, evidence and scope, distinguishing method limitations, implementation defects, resource issues and unresolved questions. A submitted report or successful reproduction is not semantic acceptance.

[维护规则 / Maintenance rules](AGENTS.md) · [文档维护 / Documentation maintenance](docs/DEVELOPMENT.md) · [分发范围 / Publication scope](docs/PUBLICATION-SCOPE.md) · [材料使用条件 / Material access](docs/paper/materials/MATERIAL-ACCESS.md)
