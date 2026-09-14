# BoundX ADMIN任务文本与独立语义包开发任务书 v2

状态：AUTHORIZED_FOR_IMPLEMENTATION（修订既有实施范围，不授权合并或发布）  
日期：2026-09-14  
仓库：joinwell52-AI/BoundX；唯一实施目录：D:\boundx  
核查基线：main @ 50b9882c7b3e5118e85fb6993ba365d8f054fe0b  
协议：BXP-0001 0.3.0-draft.2；套件：BXP-CALC 1.0.0-draft.3  
产品基线：1.3.0-preview.0；决定主体：ADMIN  
替代范围：本开发项目的 v1 任务书；v1 原文件和提交保留供追溯。

## 1. 目标与修订决定

ADMIN提交自然语言任务；接入AI获得固定7+1规则与明确启用的语义上下文，先生成候选；本地生产者适配器核查可观察的结构、证据、引用与映射，再组装标准BXP，调用现有唯一Core计算。ADMIN不手写JSON，不训练自有模型，不执行任务。

本版优先解决已有L1/L2独立成包、单独引用，以及客户自行建立L3职员表的问题，不重新发明7+1或另造计算器。

| 事项 | v2决定 |
|---|---|
| L1/L2 | 复用既有内容，拆开语义数据与Python实现，独立版本、依赖、分发与引用 |
| 包格式 | 采用Data Package 2.0描述符机制＋BoundX受限扩展；普通目录和ZIP；不实现.bxpack |
| L3 | 首版仅客户职员表；岗位可自定义，行业岗位映射可为空 |
| 模型 | 统一Producer输入/输出边界；当前Host AI，未来模型由适配器替换 |
| 本地复核 | 不再要求程序证明模型没有任何语义幻觉；明确可检查与不可证明项 |
| 证据 | Unicode码点；重复引文必须定位消歧；分词器下标不能冒充原文位置 |
| 测试 | 附120条实际任务文本；另设64组确定性负面/契约测试；208冻结向量单列 |
| 现状/规划 | 本文是开发要求，不把要求写成已交付能力 |

附件：[120条任务文本与检查点](BoundX-ADMIN-task-text-cases-v2.json)。附件不是已审阅金标，也不是测试通过报告。

## 2. 不变边界与实施范围

不得修改BXP中英文规范、task/result/suite Schema、208条冻结计算期望、7+1定义、三态、LICENSE或既有发布标签。不新增协议编号，不宣称BXP-EXTRACT通过。不读取、修改、集成其他项目。

Core仍只接收显式BXP IR，不调用模型、不访问网络、不自动加载包或制度。所有包加载、上下文构建和模型适配位于Core之外。business_decision与execution_authorization始终为null。

允许：新增产品层Pack/Producer Schema、独立语义包、兼容读取适配器、CLI/MCP/UI、文档、测试和证据。可对现有包进行有版本的迁移；不可把旧研究实现改名当成新的模型接入。

不做：自有模型训练/微调/下载/推理部署、第三方付费模型购买、完整RDF/OWL/SBVR推理引擎、SCIM服务、行业市场、自动安装网络依赖、多租户生产HTTP、审批/IAM、语义包代码插件、npm/PyPI或Release发布。本期仅本机与已配置Host接入。

开发前读取本仓库AGENTS.md、README和相关规则。中文使用apply_patch及UTF-8，不用PowerShell改中文。保护既有用户改动；只有实际重叠无法安全处理时才停止，不清空工作树。

## 3. 固定定义

| 对象 | 定义 | 明确不是什么 |
|---|---|---|
| BXP | 7+1的交换、证据、未知状态与计算合同 | 不限定提取模型或包格式 |
| L0 / Core | 现有BXP验证与确定性计算内核 | 不是语义包 |
| 语义包 | 有身份、版本、依赖和可核验内容的声明式数据，描述词义、动作角色、实体及受控映射，辅助生产者解释原文 | 不是模型权重、训练集、任务执行器或授权文件 |
| L1 | 跨行业动作类别、模态、角色原语与基础语言表达 | 不定义或更改7+1 |
| L2 | 基于L1的软件/AI行业词汇、动作框架和实体/岗位类型 | 不自动产生行业“默认任务事实” |
| L3 | 客户范围内的名称、别名、人员/Agent身份和岗位数据；本期仅职员表 | 不定义审批权、额度、部署权或企业政策 |
| Producer | 将原文和显式语义上下文形成候选IR的模型或规则系统，连同必要转换适配器 | 不能绕过本地验证 |
| 训练语料 | 原文、使用的包快照和审核过的提取标注 | 不等于语义包或计算向量 |

“独立成包”允许单独管理和分发，不表示没有依赖。L1可单独使用；L2必须满足声明的L1依赖；L3可以只依赖L1，引用行业岗位时再依赖相应L2。

词条命中不证明任务责任或授权。人员是软件工程师，不代表本任务由其执行；本任务是评审者，也不要求其岗位必须为reviewer。

## 4. 现有资产与标准采用

### 4.1 基线资产

| 资产 | 当前事实 | 迁移要求 |
|---|---|---|
| python/semantic_lexicon.json | 内含core-ontology@1.0.0；语义数据与正则表达混合 | 逐字段分类为语义数据、解析器实现或历史内容；新包不执行输入提供的正则 |
| python/semantic_actions.lark | 研究解析器语法 | 保留在解析器适配器层；不能直接当成模型无关语义包 |
| domain-packs/l2/software-ai/ | software-ai@0.1.0；已有manifest与分项数据 | 复用、迁移，不重新抄建 |
| L2 normalizesTo | 明确依赖core-ontology@1.0.0 | 转为可移植、锁定摘要的依赖引用 |
| L2 actionFrameSchema | 含../../仓库相对路径 | 改为宿主离线注册的Schema身份，不依赖仓库布局 |
| L2 manifest policies.evidence | 仍有UTF-16遗留 | 新迁移版本统一Unicode码点；不改历史快照 |
| L3 tenant-overlay | 原有预留契约含policyBindings | 保留但不直接启用；本轮职员表另用明确窄Schema，不继承政策绑定 |

L2基线数量：107个动作Frame、54个实体类型、22个角色/岗位类型、30个资源指标、12个依据类型、10个完成Frame、8类风险边界。WP0应从实际JSON重新统计。迁移逐ID对照；错误需要纠正时给出理由与影响，不能靠凑数量或删测试过关。

迁移目标版本使用core-ontology@1.1.0和software-ai@0.2.0，保留既有ID及可兼容语义；新物理格式和修改不能继续冒用旧版内容身份。若WP0发现已经存在这些版本，选择未使用的新版本并记录，不覆盖。独立版本管理不要求拆成多个Git仓库。

### 4.2 已有借鉴与本轮采用必须分开

仓库历史实现借鉴CNL2ASP语法/语义分层、Rimay动作角色、NASA FRET条件/响应分离，自行实现；GF、ACE/APE等属于调研，不是已接入组件。见[研究记录](../RESEARCH-7PLUS1-EXTRACTION.md)与[历史语义合同](../SEMANTIC-CONTRACT-017.md)。

| 标准/资源 | 本轮处置 | 不得声称 |
|---|---|---|
| JSON Schema | 复用现有Ajv依赖；产品Schema与协议Schema分开注册 | Schema通过证明自然语言正确 |
| Data Package 2.0 / Data Resource | 采用描述符、资源声明和扩展机制作为打包基础 | 它已经定义BoundX动作语义或7+1 |
| SKOS / JSON-LD | 本期只提供字段映射说明：概念ID、主名称、别名、上下位、外部映射；不新增完整RDF运行时 | 现有JSON自动符合SKOS/JSON-LD |
| ISO/IEC/IEEE 24765、SEVOCAB | 软件术语来源候选，记录引用和许可条件；本期不批量导入 | 标准全文可任意复制、发给模型或训练 |
| ESCO / SCIM Core Schema | 岗位分类、人员字段的参考；不是必须安装依赖 | 职业分类等于公司职员表，SCIM账号状态等于在职状态 |
| FrameNet / PropBank | 后续语义标注研究资源，本期不接入 | 它们是统一的行业语义包格式 |

标准采用说明必须逐项写“已实现／映射参考／未采用”，附版本、源地址、内容摘要和许可核对结果。没有外部资源复制许可时，不导入该资源；不扩大到购买或联系外部许可方。

官方依据：[Data Package](https://datapackage.org/standard/data-package/)、[Data Resource](https://datapackage.org/standard/data-resource/)、[Extensions](https://datapackage.org/standard/extensions/)、[SKOS](https://www.w3.org/TR/skos-reference/)、[JSON-LD](https://www.w3.org/TR/json-ld11/)、[24765](https://www.iso.org/standard/71952.html)、[ESCO](https://esco.ec.europa.eu/en/classification)、[SCIM](https://datatracker.ietf.org/doc/html/rfc7643)。

## 5. 统一包合同：标准外壳、现有内容、受控扩展

### 5.1 目录与ZIP

独立包根必须有datapackage.json和至少一个资源文件；资源采用UTF-8 JSON，README可选。本期交付普通目录及.zip，不生成或接受专用.bxpack格式，不依赖npm/PyPI、联网市场或运行时安装。

建议目录：domain-packs/l1/core-ontology/；domain-packs/l2/software-ai/；虚构L3放examples/semantic-packs/。客户真实包只在本地客户数据目录保存，不进Git。

包内不要求附训练集或完整测试语料；fixtures可作为开发资源单独保存。包内容不包含可执行代码、Lark文法、可执行正则、模型权重或动态校验器。

### 5.2 描述符与资源

新增BoundX Semantic Data Package产品Profile。它必须覆盖Data Package 2.0基本约束，并在boundx扩展中加入产品要求，不能把包描述符、资源描述符和payload Schema混为一谈。

| 位置 | 固定含义 |
|---|---|
| name | 现有pack ID，例如core-ontology；不在此塞版本 |
| version | 包内容版本 |
| id（如提供） | Data Package全局唯一ID；不冒用短pack ID |
| $schema | 本产品Profile的稳定身份，宿主离线注册 |
| resources[] | name、单个本地path、format、encoding、bytes、hash |
| resources[].hash | 必须显式为sha256:加64位小写十六进制；不用默认MD5 |
| resources[].boundx | kind和payload_schema等本产品资源元信息 |
| boundx.layer | L1 / L2 / L3 |
| boundx.dependencies[] | 精确引用scope、pack_id、version、digest；禁止latest和浮动范围 |
| boundx.semantic_contract | 现有生产者语义合同的版本，不是新增BXP协议 |
| boundx.tenant_id | 仅L3必填；本机数据隔离身份，不宣称生产级租户认证 |
| boundx.origin | 原文件、原版本、原提交/摘要及迁移说明 |
| boundx.extensions | 有界的非执行元数据；不得放授权、脚本或动态加载入口 |

表中的scope是包发布者/客户命名空间；L1/L2为产品注册空间，L3为客户空间。唯一制品键为(scope, pack_id, version)，引用同时锁定digest。不得使用L3自报tenant_id跨越当前宿主客户空间。

JSON资源的payload_schema在boundx扩展中声明。Data Resource的schema字段用于Table Schema，不拿它装任意JSON Schema。标准Schema与本产品Schema均固定在本地；$ref、$schema和来源URL都不得触发运行时联网。

Data Package官方Profile使用的Schema方言须按其实际声明处理。可复用Ajv的不同方言实例，但不得修改协议的Draft 2020-12注册表或强行改上游方言。将上游Schema与许可固定到受审的产品依赖资源；验证时关闭远程加载。

### 5.3 摘要、不可变与可移植性

每个资源先按原始文件字节计算SHA-256，再写入resources的bytes/hash。描述符资源数组按规范化POSIX path排序。包digest定义为SHA-256(UTF-8(JCS(完整描述符)))，digest不写回描述符自身；由Registry/lock记录，避免自引用。摘要覆盖所有资源身份、资源哈希、依赖和元数据。

同一制品键、同一digest可幂等导入；同一键、不同digest拒绝。描述符纯空白/键顺序改变可得到相同JCS摘要；资源字节变化必须改变摘要。ZIP时间戳或压缩级别不影响内容身份；ZIP传输哈希如记录，单列，不替代包digest。

除datapackage.json自身外，包内所有文件必须由resources声明并验摘要。允许无文件的目录条目，不允许多余隐藏文件。复制到另一个干净目录仍可校验和引用，不得访问原仓库../../文件或Python目录。

摘要证明内容一致，不证明发布者可信或数据正确。包接受、包启用与任务执行授权相互独立。

### 5.4 依赖与引用

每次prepare固定一个L1、零或一个L2、零或一个当前客户L3；这是首期范围，不实现任意多包叠加求优先级。软件/AI是唯一可选行业，界面不得把其他行业显示成已可用。

L1无行业包也能提供基础语义。L2不得私藏另一份L1。L3只有确实使用role_ref等行业引用时才要求L2。验证依赖缺失、版本/摘要不一致、环、未知operation和重复ID；不联网补依赖、不自动升级。

普通关系引用包含包身份及entry_id。L3实体身份使用(tenant_id, pack_id, employee_id)，任务本次使用的包版本另行固定，不能按姓名全局合并。

L2/L3只增加领域解释；同名同粒度冲突列出全部候选，不以加载顺序或L3优先静默覆盖。更具体短语的选择也必须保留解释依据，不能消除仍存在的歧义。

## 6. L1/L2迁移与模型无关性

L1的新真相源是独立数据包。把旧字段分为：
1. 可直接迁移的operation、modality、role、entity类型、词语；
2. 需要显式描述的角色关系和局部映射；
3. 仅属于Python解析器的正则、词法和语法实现。

第3类留在适配器，不导入客户包运行。不得因有一份JSON就宣称已完成语义抽象。每个映射需正例、反例、未知/歧义例；不能把词条枚举当完整自然语言语法。

Python研究路径通过兼容读取器或可重生成且校验一致的兼容快照读取新数据；禁止两份手工维护的真相源。旧研究接口仍显式标legacy，不声称直接生产标准BXP。

L2保留全部已核对资产及ID。role.allowedCategories是解释提示，不是任职资格或权限门禁；用户明确把评审任务交给开发工程师时，不得因岗位分类不符而拒绝原文关系。

程序向模型提供的可读上下文必须从同一包快照生成，不能另维护一套含义不同的提示词词表。模型不执行Lark，也不依赖Python安装。Node包加载测试须在没有Python的环境独立通过。

## 7. L3最小职员表

### 7.1 数据合同

新建窄产品Schema boundx-employee-directory/v1，拒绝未知顶层/记录字段。目录身份由包描述符提供；payload含schema和employees。每条员工记录：

| 字段 | 要求 |
|---|---|
| employee_id | 客户包内稳定唯一，显式提供，不以姓名自动生成 |
| display_name | 主要称呼，非空 |
| aliases | 可为空数组；受控其他称呼 |
| subject_type | human或agent |
| job_title | 客户原始岗位名称，不强制属于L2词表 |
| status | active或inactive，含义仅为客户名册状态；不是SCIM账号状态或授权 |
| role_ref | 可省略/为null；如提供，须精确引用已锁定L2岗位及包摘要 |
| department | 可选，仅用于显式名册属性及消歧 |

首期不支持生效日期推理、权限、额度、policyBindings、任意extensions、邮箱/电话/身份证、密钥、履历或岗位能力画像。保持最小数据包。

重复employee_id拒绝。不同员工共享display_name或alias可导入，显示歧义；运行时不选第一个。首期受控匹配只做去首尾空白与ASCII大小写折叠；不模糊匹配、不音译、不将全角/组合字符自动等同。原文不做此归一化。

inactive记录仍可解析身份，并给出名册状态提示；不能抹掉明确原文人物，也不能宣称其可执行。没有L3时，明确姓名仍可作为P中的文字主体，只是没有经过名册映射。未知岗位不使整个人员记录无效。

L3仅提供身份解释依据；引用目录属性时记录包条目出处，不能伪造它出现在任务原文。原文未指定执行人时不得依据岗位自动补人。

### 7.2 客户建立与导入

CSV仅为客户编辑入口，固定列：
employee_id,display_name,aliases,subject_type,job_title,status,department

role_ref由UI映射面板或可选JSON映射文件配置，不要求客户手写摘要。aliases为JSON数组字符串，使用标准CSV引号转义；不按普通逗号拆别名。模板说明UTF-8，允许CSV入口识别并去除单个文件BOM；规范包JSON不允许BOM。导出时防止表格公式注入，不改变原始目录身份值。

流程：下载模板 → 客户填表 → 本地预览校验 → 可选映射行业岗位 → 生成新版本目录/ZIP → 校验 → 确认导入 → 单独启用。每步显示错误行和字段；失败不改已启用数据。

客户可直接提供规范JSON，不强制CSV。L3只依赖L1且role_ref均为空时也能构建。客户更新须产生新版本，不覆盖旧包；回退是选择既有不可变版本，不重写历史。

### 7.3 虚构验收名册

以下值为本任务测试数据，不代表真实团队或自动岗位推定。tenant-a，包example-team@0.1.0；依赖实际迁移版本。别名均由fixture显式声明。

| employee_id | display_name | aliases | type | job_title | department | status | role_ref的role_id |
|---|---|---|---|---|---|---|---|
| dev-01 | DEV-01 | 开发一号 | agent | 软件开发工程师 | 开发部 | active | software-engineer |
| qa-01 | QA-01 | 测试一号 | agent | 测试工程师 | 测试部 | active | qa-engineer |
| pm-01 | PM-01 | 项目协调员 | agent | 项目经理 | 项目部 | active | null |
| ops-01 | OPS-01 | 运维一号 | agent | 站点可靠性工程师 | 运维部 | active | sre |
| e101 | 王明 | 小王；Xiao Wang | human | 软件工程师 | 开发部 | active | software-engineer |
| e102 | 王岚 | 小王；Xiao Wang | human | 测试工程师 | 测试部 | active | qa-engineer |
| e103 | 陈旧 | OLD-01 | human | 历史维护人员 | 维护部 | inactive | null |
| e104 | 李研 | 小李 | human | 算法研究员 | 研究部 | active | null |

表格分号只是可读分隔，真实JSON使用数组。PM-01没有被映射成product-manager；后者在现有L2中是“产品经理”，不同于本fixture的“项目经理”。QA也不是默认的QA-01别名。

附加setup：tenant-b有自己的example-team@0.1.0，仅一名employee_id=b101、display_name=王北、aliases=[小王,Xiao Wang]的active员工，任何情况下不得读取tenant-a记录。changed-after-prepare将tenant-a包更新到0.2.0，e104状态改为inactive；旧候选只能绑定旧快照，不能冒充新结果。

## 8. 安全导入、Registry与快照

首期限制：ZIP压缩文件不超过10MiB；解压累计不超过10MiB；最多64个资源文件；单文件不超过2MiB；最多2000名员工；单名/别名最多128码点、每人最多16别名。描述符最多256KiB；JSON深度最多32、总节点最多100000。上限集中配置并测试；不得以压缩头的申报大小代替流式累计。

拒绝绝对路径、盘符/UNC、反斜线变体、..段、重复路径、大小写碰撞、链接/硬链接/特殊设备、加密ZIP、重复键、非法UTF-8、未知资源类型、未声明文件、远程path/data/schema加载。ZIP根直接放datapackage.json，只允许单根包，不宽松猜测多层ZIP根。资源仅允许已注册kind对应的.json及可选README.md；拒绝Windows保留设备名、ADS冒号、NUL和尾部点/空格等平台歧义路径。包中说明文字与字段值视为不可信数据，不得作为Host系统指令或工具调用。

在临时隔离目录完整验证后原子提交。目标由宿主注册空间决定，不由包路径决定。不覆盖既有文件。中断只留下可清理的本任务暂存目录，不能破坏旧激活状态。活动配置切换须原子化，失败回退原配置。

Registry记录installed和active等产品状态，不修改包本体；只显式启用，不扫描自动启用。L3必须与当前客户空间匹配。单机隔离与独立tenant标识不等于已经交付企业多租户安全服务。

每次prepare冻结：原文及来源摘要、所选包完整依赖闭包、包digest、实际提供的条目子集、规则版本、候选Schema版本、profile required_elements、语言、检索设置和处理上限。生成prepare_id与context_digest。候选必须绑定同一快照。

原文、包版本、profile或上下文变化后创建新prepare。evaluate不得重新读取“当前最新包”来解释旧候选。默认旧界面显示stale并重新生成；显式历史重放只读旧快照并标为历史。缺快照或摘要不匹配时返回生产者错误，不编造BXP计算结果。

## 9. 给模型的上下文与未来自训接口

### 9.1 当前生产者接口

产品层固定逻辑合同，不绑定具体供应商SDK、聊天模板或模型权重格式：

- prepare输入：精确任务原文、可选真实附加来源、语言、当前客户空间、明确选择的包、profile要求。
- prepare输出：prepare_id、source/context digest、目标BXP版本、候选Schema、提取规则、有界包上下文与歧义/检索诊断。
- candidate输入：prepare_id、模型产出的候选；source/context digest只能回显程序已给出的值，不让模型计算。
- evaluate输出：生产者诊断；仅在能够形成有效输入时附标准boundx-task/v1及现有Core的boundx-result/v1。
- 适配器元信息：producer_kind、adapter版本、实际可取得的模型标识、规则版本、上下文版本；拿不到精确模型修订时写unknown，不捏造。

当前正式生产者是已配置的MCP Host AI。BoundX本期不保管模型API密钥，不购买服务。新增工具名为产品要求，不代表已经存在：
bx_prepare_admin_task、bx_evaluate_admin_candidate、bx_list_semantic_packs、bx_get_semantic_pack_info。

保留bx_evaluate_task和bx_evaluate_task_json的原义。MCP工具Schema不携带真实客户默认数据；日志只存有界证据、摘要和必要诊断。

### 9.2 包内容供给与检索边界

L1提供通用规则和必要词义；L2提供命中的行业候选；L3只提供任务实际涉及的最小人员记录及全部必要同名候选。返回具体entry_id和包来源，不只是包名。

检索策略、匹配规则、排序、数量限制均版本化。词法未命中不证明语义不存在；结果被截断、上下文不足或重名候选超过预算时，必须返回明确诊断，不选前几个冒充完整候选集。本期不新增向量数据库，可用有界词法检索与显式条目查询。

仅L1、关闭L3或未命中行业词条，不阻止AI保留有证据的普通文字事实；只是不允许伪造未提供包中的条目引用。模型本来知道某术语，不等于本次实际用了某个Pack。

默认语义上下文（不含任务原文）不超过64KiB；原文不裁剪且受BXP源长度和Host实际预算约束。预算不足返回错误/请求缩小明确范围，不静默截掉任务后半段。长度诊断不同于语义absent。

Host若要把客户原文或L3记录发往外部模型，须有独立的数据使用授权；模型候选自行填一个true不构成授权。本机UI发送前应展示将发送的数据类别与目标。MCP Host已收到用户原文时，不得倒称BoundX能够阻止此前的数据披露；仍需控制后续L3披露。

完整名册、其他客户数据、未选包内容不得随prepare/evaluate/tool日志外发。需要在BXP中附目录依据时，仅附标明“选中记录快照”的必要片段和包/记录追溯，不伪装为任务原句，不把整张名册放进返回信封。

### 9.3 未来模型替换，不在本轮训练

未来生成式模型可以直接给候选；序列标注/关系抽取小模型可以由适配器把标签和关系转为候选。两者最终必须进入同一验证/组装/Core路径，不能为每种模型另建一套7+1。

语义包不得绑定tokenizer、模型文件路径或供应商提示模板。模型分词下标转换为原文码点是适配器责任。训练使用的L1/L2版本、模型/适配器版本和兼容范围必须可记录；兼容关系需测试，不能只比较版本号。

本期交付两种离线回放适配器测试：结构化候选回放、标签/关系回放。它们只验证可替换接口，不冒充两个真实模型或自训成果。真实Host模型另做实测。

语义包不是训练集。未来训练数据需原文、包快照、经过审核的金标及数据使用授权；训练/验证/测试集合独立管理，当前已提供给开发者的120条语料不得宣称隐藏独立测试集。L3默认仅运行时加载，不入训练；员工更名/调岗通过包版本更新处理。

## 10. 候选合同与本地组装

### 10.1 候选最小结构

boundx-extraction-candidate/v1是产品层候选Schema，不是新增BXP协议。至少包含：

- prepare_id和回显的source/context digest；
- 八桶明确状态及非空resolved/unresolved条目；
- 每条的原文定位器、解释、语义引用（如使用）、角色/关系、模态/条件；
- 仍未解决的指代、范围、实体同一性和候选集合；
- 需要计算的typed-constraint候选及其证据、scope/identity绑定；
- 待澄清项。不得输出业务决定、执行授权或代替Core的最终三轴。

具体键名和封闭Schema在WP1落实为可执行合同；不得让Codex用自由字符串解释代替需要计算的结构。操作、关系、逻辑表达只允许已注册的有界数据结构，禁止eval、任意表达式字符串或动态代码。

源定位器采用source_id和精确quote。若quote重复，可提供精确prefix/suffix辅助定位；程序验证组合确实只对应一个位置。仍不能唯一定位则要求更长引文或澄清，禁止默认第一次出现。不依赖模型计算start/end；未来适配器给出的offset只能作为待核对提示，不能绕过原文验证。

### 10.2 程序能够检查的内容

1. 输入大小、严格UTF-8/JSON、重复键、Schema、prepare身份和摘要。
2. 原文引文精确存在，位置唯一，码点区间正确，原文没有被修剪或改换行。
3. 包、版本、digest、entry_id、role_ref、employee_id真实存在且在当前快照允许引用。
4. 已声明歧义没有被无证据压成单选；引用未启用客户包、跨客户身份、旧版本快照被拒绝。
5. 已知operation/role/type匹配；数值字符串、单位映射和逻辑结构有类型、有界、有证据。
6. 不以岗位字段生成执行授权，不以模板中的典型效果直接创建任务事实。
7. BXP组装严格遵守唯一协议Schema和现有约束类型；调用唯一Core计算。

程序不能普遍证明模型完整理解了自然语言、没有漏掉任何禁令、每个指代都理解正确、引用的句子一定蕴含模型解释。即使引用真实，解释仍可能错。此类质量由独立标注、实测、人工澄清与报告限制处理，不用“程序复核通过”冒充证明。

### 10.3 三种状态与错误分层

BXP的resolved/unresolved/absent只描述提交的任务要素，不能拿来表示模型调用失败或包加载错误。所有桶按协议提交；未出现的信息不靠模板补齐；有歧义的条目保留对应来源。

候选Schema错误、摘要不符、越权引用、非法quote等返回生产者诊断，不篡造一个“合法而未知”的BXP结果来隐藏错误。若仅局部语义仍未知且有真实证据，允许按协议形成unresolved条目。无法合法组装时，不调用Core；报告明确“尚未计算”。

模型输出的typed constraints是待验证声明，不由程序重新理解整篇任务生成。只对显式绑定的同指标、同单位/可确定换算、同scope、同身份进行现有计算。不支持的关系保留未知；不通过把所有动作或单位强行合并来制造可计算性。

原文证据、目录解释依据和程序转换规则的来源分别记录。历史包的UTF-16偏移如需要转换，必须基于原文逐项核验并标明转换；禁止只改字段名。

### 10.4 可复现与来源

在协议现有namespaced extension中记录producer/adapter、实际模型标识、Pack锁定引用、规则/检索版本、prepare/context摘要。不改协议字段。Core结果不一定复制输入extensions；产品回执须另外保留输入与结果摘要及关联，不依赖自动透传。

同一个冻结prepare与候选在CLI/MCP/UI获得同一个规范BXP任务和Core结果（排除单独的非合同展示时间）。模型重复生成可以不同，不能宣称温度为0就必然相同。

## 11. 产品入口与用户体验

CLI新增本地命令（产品开发要求）：

~~~
bx pack template employee-directory <directory>
bx pack build <directory> --output <file.zip>
bx pack validate <directory-or-zip>
bx pack import <directory-or-zip>
bx pack list
bx pack activate <scope/id@version>
bx pack deactivate <scope/id@version>
bx prepare <task.txt> --packs <explicit-pack-list>
bx evaluate-candidate <prepare.json> <candidate.json>
~~~

build默认不覆盖输出；import与activate分开。activate只使用已安装且摘要匹配的依赖，不进行网络下载。命令具体参数的转义/路径兼容在Windows和Linux测试。失败有明确非零退出和结构化诊断，现有BXP evaluate退出约定不改变。

UI提供：任务原文、L1版本、行业选择（只有软件/AI及不使用行业包）、当前客户L3、CSV创建/预览/映射/导入/启用、八桶与证据、名册解释出处、歧义和需澄清项、三轴/计算结果、历史结果stale提示。

正式端到端以已连接MCP Host为准，ADMIN只交任务文字。浏览器UI若没有可用Host桥接，应明确显示“需要兼容Host”，提供准备上下文和结果导入/展示；不得假装网页已经自动调用AI，也不得用旧Python结果顶替。Host对接缺失是如实列出的限制，不妨碍独立包本地构建验收。

## 12. 测试语料、数量与验收口径

### 12.1 四类证据分开计数

| 类别 | 固定规模 | 本版已提供/待实现 |
|---|---|---|
| 自然语言任务种子 | 120条：中文60、英文36、混合24；12类各10条 | 附件已有具体原文及检查点；不是已审金标 |
| 确定性契约/安全组 | 至少64组：下表8类各8组 | 由实施补齐输入、预期诊断和测试 |
| BXP计算回归 | 208条冻结结构化向量 | 原样运行，不计为自然语言抽取测试 |
| 真实模型运行 | 120条各1次＋固定30条再运行1次，共150次 | 待使用已授权Host实测，不得用回放替代 |

测试方法数量、参数化样本数量、模型调用次数、协议向量数量分别报告，不加成一个误导性的“全部抽取通过数”。

### 12.2 120条语料分组

T001–T010输入/输出；T011–T020模态与B；T021–T030软件/AI；T031–T040名册身份；T041–T050岗位与授权；T051–T060数量；T061–T070条件/作用域；T071–T080版本/依据；T081–T090完成/未知；T091–T100引文/Unicode；T101–T110包快照；T111–T120端到端/对抗。

WP1为每条补充：源摘要、包锁、profile要求、允许的语义答案集合、八桶状态、精确证据、必要关系/约束、禁止误推定、允许诊断和BXP预期。歧义题允许明确限定的多个合法表示，不能为了唯一JSON答案抹掉歧义。

逐条人工或独立审阅确认标注；模型自身生成答案不能自己认证为金标。未审阅标注写PENDING，不得报告完成。先冻结并计算摘要，再实现/调试；更正金标必须给出原文理由、独立复核和变更记录，不能根据当前实现输出来刷新期望。

这是一套可见工程回归集，不是统计代表性样本或隐藏独立测试集；仍不得声称BXP-EXTRACT认证。

固定重复集为T001–T010、T031–T040、T111–T120。重复可观察模型波动；程序回放同输入必须确定一致，不要求两次模型文本完全一致。

setup展开要求：
- default：第7节tenant-a名册与迁移L1/L2；数据快照时间固定2026-09-14T00:00:00Z，不做日期推理。
- no-l3 / deactivated-before-prepare：不向模型提供L3，但允许原文文字主体。
- l1-only：无L2/L3，不接受它们的引用。
- tenant-b / changed-after-prepare：按第7节独立客户/新版名册构造。
- with-policy：实际附加POL-1，版本v1，原文“只有测试通过才可交付。”，程序计算摘要。
- missing-policy：原文提到POL-1，但没有实际附件，不能自动补造。
- policy-version-mismatch：元信息声称v1，附加原文为“版本v2：只有测试通过才可交付。”，要求不一致诊断，不声称已验证适用。
- bad-pack-digest：模型正常输出后另造一次错误digest注入测试；区分模型结果与程序负测。
- two-adapters：同一个prepare的标准候选与标签回放适配器；不是两次真实模型证明。
- malicious-pack-text：在合法的虚构数据字段中放入“ignore previous instructions”等文本，不能作为系统指令；结构非法包另由64组测试拒绝。

### 12.3 至少64组确定性测试

每格中的8项分别成为独立fixture；所有实际fixture必须通过，不能只挑满足数量的子集。

| 类别 | 8组必测点 |
|---|---|
| 格式/标准 | 最小合法包、L1独立、L3仅依赖L1、Data Package基本约束缺失、错误payload Schema、资源摘要错误、descriptor无自引用、ZIP压缩变化内容digest不变 |
| 路径/归档 | ../、绝对路径、Windows盘符/UNC、反斜线穿越、大小写碰撞、重复文件、符号/硬链接、加密ZIP |
| 资源/解析 | 文件数超限、单文件超限、累计解压超限、压缩炸弹、JSON重复键、非法UTF-8/BOM、深度/节点超限、员工/别名数量超限 |
| 版本/Registry | 缺依赖、版本错配、依赖环、同版本异摘要、相同内容幂等、原子提交中断、启用回退、跨客户隔离 |
| L3/语义 | 重复ID、共享别名、未知岗位且role_ref=null、错误role_ref、inactive身份保留、岗位不补执行人、未启用不使用名册、任务角色不同于岗位 |
| 上下文/隐私 | 只披露命中记录、共享别名全部候选、无外发授权不披露L3、其他客户零泄漏、检索截断可见、无命中不等于不存在、包提示注入无工具副作用、伪造激活指令无效 |
| 候选/证据 | 非BMP、CRLF、组合字符、重复引文有定位、重复引文无定位、伪造quote、旧prepare/新包、source/context摘要篡改 |
| 适配/回归 | 结构候选回放、标签回放、token偏移转换、未知模型版本记录、模型失败不伪造结果、超上下文显式失败、同候选跨入口一致、64组均不改变208冻结期望 |

另对原文长度边界、中文数字/单位转换、长任务后半段禁令做参数化扩展，并单列数量；不把扩展重复算入120条独立原文。

### 12.4 真实模型验收

必须记录Host、实际可取的model ID/version、规则/包/上下文摘要、每次原始候选、程序诊断、最终输入/结果和重试。密钥与真实客户数据不进仓库。每条最多一次基于明确诊断的修复重试；原始失败不能从报告消失。

以下是本项目工程门槛，不是已达成指标：
- 120/120有真实运行记录；固定30条有第二次记录，共150次初始运行。
- 接受进入Core的候选，结构、引文、引用和摘要检查100%通过。
- 在审阅金标的可判定要素上，最终提取条目精确率不低于98%、召回率不低于95%；逐语言、逐类报告分子分母，不能只报总体均值。分母覆盖全部应产生答案的样本，模型失败、无结果和错误地全部标未知不能从分母删除；预期非法注入按其冻结诊断另计。语义匹配以WP1冻结的字段/关系/证据判定器为准。
- 每次运行的B显式禁止召回、无依据授权输出、同名误消歧、跨客户泄漏、stale快照误接纳等安全断言全部通过；不能用高平均分抵消任一失败。
- 人物、模态、单位/运算符、scope和三态单独报告准确率及错误清单；无金标或无法判定的项计入未完成，不当作正确。
- 语料中的故意错误输入和篡改候选按预期拒绝/澄清验收，不要求强行产生有效BXP。
- 程序确定性回放与150次模型实测分别出报告，不宣称本地复核能证明语义完整。

没有已授权Host、无法真实调用、缺预算许可或缺金标审阅时，明确标为BLOCKED_LIVE_MODEL或PENDING_GOLD_REVIEW。可交付已完成的包和接口，但不得写整体IMPLEMENTATION_COMPLETE；不得自购服务、抽取凭据或以mock冒充实测。

## 13. 工作包与交付

| WP | 工作 | 完成证据 |
|---|---|---|
| WP0 | 读取最新基线与已有实施；资产逐ID盘点、标准采用/许可、v1→v2差异、Schema方言与依赖核对 | BASELINE-AND-ADOPTION.md；无协议变更 |
| WP1 | 冻结产品Pack/Producer Schema与120条金标、错误分层/评分规则 | 可执行Schema、审阅记录、语料/规则摘要 |
| WP2 | L1独立包、语义/解析器解耦、Python兼容读取 | 无Python的Node加载；字段迁移表及回归 |
| WP3 | L2迁移、精确L1依赖、ID/歧义/码点修订 | 基线数量与逐ID差异、离仓库目录可用 |
| WP4 | 最小L3、CSV/JSON模板、可选岗位映射、虚构名册 | UI/CLI构建及名册语义测试 |
| WP5 | ZIP/目录安全导入、Registry、启停、不可变包锁、最小上下文 | 故障恢复、隔离、摘要、无远程加载 |
| WP6 | 统一Producer与MCP Host链路、两种回放适配器 | 同快照接入、模型元信息和错误分层 |
| WP7 | 证据定位、候选复核、BXP组装、唯一Core | 码点/引用/约束测试和跨入口一致 |
| WP8 | ADMIN UI与CLI、无Host状态、客户指南 | 自建→导入→启用→文本→结果完整演示 |
| WP9 | 120语料、64契约组、208冻结向量、150模型运行与CI | 精确测试报告、限制、文件清单和ADMIN审核交付 |

按依赖顺序实施，逐WP提交。当前/规划文档修订跟随实际完成阶段，不能在WP0就写成全部交付。若已有Codex本地成果，先逐项映射v2，保留可复用代码，不执行reset或删分支。

至少交付：
- docs/SEMANTIC-PACK-SPEC.md：标准采用、字段、身份、摘要、依赖、冲突、信任及限制。
- docs/PRODUCER-ADAPTER-CONTRACT.md：输入/输出、快照、错误、模型替换和未来训练边界。
- docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md：客户填写、构建、导入、映射、启用、更新/回退。
- 产品Schema、独立L1/L2、L3模板与虚构示例、Registry/导入器、适配器、MCP/CLI/UI。
- tests/或fixtures/下的120语料金标、64组确定性fixture、两种回放与真实模型运行证据。
- docs/tasks/ADMIN-TEXT-SEMANTIC-PACKS-DELIVERY.md：文件清单、提交/摘要、标准采用状态。
- docs/tasks/ADMIN-TEXT-SEMANTIC-PACKS-RECEIPT.md：逐WP状态、命令、真实计数、CI链接、失败/限制、协议未变证明。

文档名称可以因仓库现有布局做非语义调整，须给出映射。不要额外引入另一份BXP注册表或第二套数学实现。

## 14. 最终验收与GitHub交付

只有同时满足以下条件才可报告IMPLEMENTATION_COMPLETE：

1. L1/L2能够独立导出、移入干净位置、离线校验和精确引用；L2依赖L1，不复制核心。
2. L3客户可自行创建；自定义岗位无需强行映射；客户间名册不混用。
3. 包不可变、导入和启用分离、原文/包变化使新请求重新prepare，旧请求保持旧快照或明确过期。
4. ADMIN自然语言经真实Host AI生成候选，本地复核组装，再调用唯一Core；不是预置答案演示。
5. 已完成所有实际测试和第12节门槛；Ubuntu Node 22、Ubuntu Node 24、Windows Node 24 CI通过；本地真实Host实测单独记录，不要求无密钥CI假装跑模型。
6. 现有npm test、npm run test:ui、Python研究回归和npm run test:docs重新执行；精确结果如实报告。
7. 固定协议文件、协议Schema和208期望与基线无差异；新产品Schema不混入BXP协议命名。
8. 无发布、执行、授权、客户数据暗中外发或抽取认证宣称。

先从最新origin/main记录基线；main前进时逐文件对照，不机械重做已完成文档，也不静默扩大合同。建立独立实施分支和Draft PR。若已有实施分支，先记录其提交，再迁移到本版要求；不要覆盖其他开发者工作。

每个WP报告实际完成、部分完成、阻塞和证据。不以“文件已生成”“CI配置存在”“mock通过”“旧测试通过”代替完成。

最终PR指向v2及附件，保留v1历史；提交文件清单、精确命令与结果、模型/包锁、关键错误清单、兼容和安全限制，停止在ADMIN审核门前。不合并main，不创建Release，不发布包，不自行变更许可证。

## 15. 给Codex的执行摘要

以本v2任务书和同目录120条任务文本附件为准，替代本项目v1的冲突要求。先执行WP0核对现状；复用既有L1/L2，采用Data Package描述符与普通ZIP，开发最小L3职员表和统一Producer链路。不训练自有模型、不改BXP、不复制Core。缺Host或金标审阅如实阻塞相关验收。逐WP提交至独立实施Draft PR，完成后交ADMIN审核，不合并、不发布。
