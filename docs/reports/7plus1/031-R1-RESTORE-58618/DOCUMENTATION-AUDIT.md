# 仓库文档滞后核查（只读）

核查日期：2026-10-08。用户截图为main/README.zh-CN.md。实际读取远端main提交f7aae6421681be22eb2035504b824f4d169bf90c，以及review/7plus1-parser的维护前提交f039fb2639cadecc8fa6f00bbf6dad8cac48c55b。未合并main，未改README、历史协议或封存报告。机器可读证据见DOCUMENTATION-EVIDENCE.json。

结论：主分支文档主要描述早期BXP产品及三路Producer研究，已经不能作为当前短文本编译器的完整使用说明。协议规范、研究计划与当前候选产品是不同对象，不能简单删除历史文档或把候选说成正式发布。

| 优先级 | 文件及证据 | 滞后或缺口 | 应当澄清的当前口径 |
|---|---|---|---|
| P0 | main README.zh-CN.md:213–219；docs/BOUNDARYXP-PRODUCT-MANUAL.md:644–670 | LLM为参考路线，spaCy为本地NLP商用候选主路线 | 当前短文本主链是解析Skill/Codex→候选语义→审阅Skill/独立会话→技术校验→Boundary IR→确定性7+1；旧NLP研究应标历史或独立研究 |
| P0 | main QUICKSTART.md:11–18；README.zh-CN.md:276 | npm run ui，不固定端口，配置Producer/NLP模型 | 本机维护入口为cd D:\boundx后npm run 7plus1:ui；固定58618；完整已安装候选资源不混读开发区 |
| P0 | main docs/PRODUCER-ADAPTER-CONTRACT.md:3–5 | Producer直接给候选7+1，与当前语义候选合同不一致 | 两个Skill共享合同和Schema；LLM负责语义，程序不再用旧NLP猜语义或按词补槽；JSON合法和模型审阅不等于正确 |
| P1 | main README.zh-CN.md:353–372；docs/FUNCTIONS.md:5–12 | 状态表只有根产品1.3/BXP0.3/目标0.4，缺少当前可安装短文本候选 | 分开标根包版本、协议版本、语义合同、安装候选0.1.0-candidate.031-r1.2/031-r1-c3；候选仍PARTIAL/REVIEW_REQUIRED，Q05新包未安装；安装包存在不等于公开发布 |
| P1 | main README.zh-CN.md:306–324；docs/VALIDATION.md:13–15 | Core100+L3 100、600/1800研究计划占据唯一评测入口 | 不可当作当前短文本验收范围或已实测成绩；应链接030、031、031-R1/Q05的真实结果、重复运行及剩余问题。历史Real Gold、人工标准与新短文本也应分别标身份 |
| P1 | main README.zh-CN.md:413–426 | 首页文档导航没有当前v0.4手册、两个Skill、短文本使用说明和CURRENT-TASK | 增加当前产品入口与状态报告，再另列协议/研究/历史资料；不能让“完整产品手册”指向只有旧产品路线的说明 |
| P1 | main README.zh-CN.md:90–97 | 8槽位仅有简写，缺少近期O和用途绑定澄清 | 明示产生或交付结果都可入O，许可不能改成必交；提交不新增生成/修改/外部I；对象不能一律当I；NOT_REQUIRED不等于FORBIDDEN。详细语义应链接冻结手册，不在README重定义 |
| P1 | review README.md:13、23–37 | review首页也停在旧JSON输入BXP产品；review不存在README.zh-CN.md | 除main/review分支未合并外，活动分支的首页本身也未同步当前产品；不能仅换分支后宣称文档已更新 |
| P2 | review v0.4手册:250 | “当前实现任务”仍写028 | 方法章节仍是权威；实施任务标识应与031-R1及CURRENT-TASK一致，另行审定文档修订，不倒改封存快照 |
| P2 | review product/short-compiler/使用说明.md:7–10；ACCEPTANCE.md:7 | 仍举58619安装例，原58618写POLICY_BLOCKED | 旧安装包及历史拒绝证据不修改；当前维护报告说明本次无旧监听者、正常启动成功、固定58618。新使用入口应指向本维护结果 |

本次实际恢复只变更启动适配，不修改上述产品或方法文档。main的test:ui和test:docs确实存在于main/package.json，不能因review的命令集合不同而误报为main无效命令。Core不访问模型/网络仍是合理的职责边界；短文本编译器整体则使用Codex服务，需要CLI登录和额度，不能宣传成完全离线NLP。

建议后续单独授权一次文档同步：先写清“当前短文本候选产品及限制”，再保留“BXP协议与研究目标”和“不可修改的历史证据”。不自动合并、不改变许可证、不升级语义验收。
