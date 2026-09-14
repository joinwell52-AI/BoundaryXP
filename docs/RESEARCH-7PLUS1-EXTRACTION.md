# 从任务原文得到 7+1：开源实现、论文与界痕的选择

调研日期：2026-09-11。本文讨论 **ADMIN 无模型、无 API 的文本抽取前端**。结论来自公开仓库的具体文法、类型结构、解释器代码和原始论文；不把求解器的正确性当作自然语言理解的正确性。

后续落实情况：[017 代码与测试](SEMANTIC-CONTRACT-017.md)。已在现有 Lark 上实现共享局部动作角色和条件文件供给检查；下文保留调研时的选择依据，GF 等上游仍未整包接入。

**建议采用“领域动作语义结构 + 中英局部文法 + 原文绑定 + 七要素投影”的实现路线。** Python 端优先借鉴 CNL2ASP 的文法与命题分层，借鉴 Rimay 的动作语义角色、FRET 的条件/响应分离和 GF 的中英共享抽象语法。已有 portion、Z3、NetworkX 继续负责结构化约束计算。

本次查到的项目中，没有发现能够直接输入任意中文/英文任务、可靠输出界痕全部 7+1 的成品库。已有成果解决了其中一些关键环节。**这次是选型研究，未把这些项目接入产品；当前实现及十条原文结果见 [016 更新](ADMIN-BOUNDARIES-016.md)。**

## 1. 哪些项目真正帮助取得 7+1

| 项目与论文 | 核对到的实现 | 对界痕的具体帮助 | 适用边界 |
| --- | --- | --- | --- |
| [CNL2ASP](https://github.com/dodaro/cnl2asp)；[Caruso 等，2023 预印本](https://arxiv.org/abs/2311.10505)，后发表于 TPLP 2024 | Python、Lark；实体定义、属性、条件、命题、转换器分层 | 同一句中的主体、对象、条件分别建模，再交给后端；最接近现有 Python 栈 | 接受规定的英文 CNL；ASP 命题不是现成的任务 7+1，也不是任意自然语言理解 |
| [NASA FRET](https://github.com/NASA-SW-VnV/fret)；[Formal Requirements Elicitation with FRET，2020](https://ceur-ws.org/Vol-2584/PT-paper4.pdf) | ANTLR 文法把需求分为 scope、condition、component、shall、timing、response，并生成形式语义和解释 | 拆开“适用阶段、触发条件、行为主体、时序、要求的结果”；帮助避免 Guard 混进 Action | FRETish 是受限英文；component 不等于审批人；response 不自动等于交付文件；时序默认值不能照搬为 ADMIN 的授权 |
| [Rimay](https://github.com/SNTSVV/Rimay)；[On Systematically Building a Controlled Natural Language for Functional Requirements，2020 预印本](https://arxiv.org/abs/2005.01355) | Xtext 文法；Actor、ConditionStructure、SystemResponse、不同 ActionPhrase；与/或响应分层 | 按动作类别区分源、目标、对象、产物，而不是把每个宾语都塞进 I/O | 金融领域英文 CNL；公开仓库不等于已核实再分发许可；本次未发现根目录许可证，先借鉴论文方法，不直接搬代码 |
| [GF core](https://github.com/GrammaticalFramework/gf-core) + [GF RGL](https://github.com/GrammaticalFramework/gf-rgl)；[GF 中文语法论文，2015](https://aclanthology.org/W15-3117/) | 共享抽象语法；中文、英文分别实现具体语法；存在 Chinese/English 源码和 Python 运行时绑定目录 | 中文“由…生成…”和英文“…generates…”可以归约为同一种语义节点；也能从节点生成规范句供核对 | 要自行定义任务领域语义和词汇；完整 GF 中文集成尚未实测。宽覆盖翻译中的统计消歧不能进入零模型通道 |
| [Attempto APE](https://github.com/Attempto/APE)；[Attempto Controlled English for Knowledge Representation，2008](https://attempto.ifi.uzh.ch/site/pubs/papers/reasoningweb2008_fuchs.pdf) | Prolog；tokenizer、grammar、指代消解器；产生 DRS 和其他逻辑表示 | 跨分句的“该接口”“它”需要可访问域和类型匹配；否定不能越过条件作用域 | ACE 有预先规定的解释规则，不保证任意英文作者的本意；不能把其“最近可访问先行词”规则直接当作中文身份确认 |

这是五条方案，其中 GF 由两个仓库组成。另核对了 ACE-in-GF 和 NALABS，见下文限制说明。固定的仓库提交及文件哈希保存在 [repositories.json](research/7plus1-20260911/repositories.json) 和 [source-index.json](research/7plus1-20260911/source-index.json)。

## 2. 值得借鉴的是哪些核心代码

**CNL2ASP：分开语法识别与语义构建。** [cnl2asp.py](https://github.com/dodaro/cnl2asp/blob/5bbafba249c434d10811a3d0eaa9f7f31b678f72/src/cnl2asp/cnl2asp.py) 使用 `Lark(..., propagate_positions=True)` 取得语法树，随后由 Transformer 构建 specification。[proposition.py](https://github.com/dodaro/cnl2asp/blob/5bbafba249c434d10811a3d0eaa9f7f31b678f72/src/cnl2asp/specification/proposition.py) 中，条件组件与新命题组件分开；新命题保存 subject、objects 等信息。界痕可以借鉴这种层次，不能把 ASP 的选择规则直接翻译成执行授权。

**FRET：条件有专门的语法位置。** [Requirement.g4](https://github.com/NASA-SW-VnV/fret/blob/cf0f913cc15c41705e803593297e89cd6056b839/fret-electron/app/parser/Requirement.g4) 的 scope、reqt_condition、component、timing、response 是不同产生式。它也有 freeform 分支，因而“文本被接受”与“文本已有形式语义”必须分别检查。界痕不能以解析器未抛错作为计算成功。

**Rimay：动作不是一个无结构字符串。** [Dsl_rimay.xtext](https://github.com/SNTSVV/Rimay/blob/7308c20125f6678333282e31cda75a82e68b4970/org.xtext.dsl_rimay/src/org/xtext/Dsl_rimay.xtext) 将条件与系统响应分开，建立 Actor 引用及动作短语类别，并分别构造 AND/OR 响应树。发送、取得、创建等动作具有不同的参数角色。这是区分 I/O/A/P 的方法来源；“属于同一动词类别”仍不证明两个业务动作等价。

**GF：语言不同，语义构造器相同。** [SentenceChi.gf](https://github.com/GrammaticalFramework/gf-rgl/blob/0f4dd88f9e7b33b66426929c7c102ce5fe0c6f82/src/chinese/SentenceChi.gf) 与 [SentenceEng.gf](https://github.com/GrammaticalFramework/gf-rgl/blob/0f4dd88f9e7b33b66426929c7c102ce5fe0c6f82/src/english/SentenceEng.gf) 实现共同的 Sentence 接口。[语言手册](https://www.grammaticalframework.org/doc/gf-refman.html) 说明解析会寻找可生成输入的语法树集合，不能默认只取第一棵就代表用户本意。GF 的通用句法树仍需要领域语义投影才能得到 7+1。

**APE：先保存未消解指代，再执行绑定。** [ace_to_drs.pl](https://github.com/Attempto/APE/blob/5f4d5354a45fb772763bf1a9543f508f15b28982/prolog/parser/ace_to_drs.pl) 提供未消解和消解后的 DRS；[refres.pl](https://github.com/Attempto/APE/blob/5f4d5354a45fb772763bf1a9543f508f15b28982/prolog/parser/refres.pl) 实现可访问域、类型一致性等规则。界痕适合借鉴“保留绑定过程和失败信息”，而不是静默选定指代对象。

## 3. 7+1 应该怎样得到

以下是**根据调研提出的界痕设计**，不是上述项目已经具备的共同功能，也不是本轮已接入的代码。

先计算带原文依据的语义关系，再投影出七要素和独立 B。不能让八个关键词扫描器各自决定字段内容。

```text
任务原文 + 显式 WP + 术语/别名定义
                   ↓
中英局部语法：条件、否定、并列、动作参数、完成断言
                   ↓
共享语义结构：动作、主体角色、对象、输入/产出、守卫、作用域、依据
                   ↓
类型检查 + 指代绑定 + 原文证据 + 未识别片段
                   ↓
七要素 I/O/A/P/R/V/C + 独立 B
                   ↓
portion / Z3 / 集合 / 依赖图 → 计算结果及具体建议
```

| 要素 | 从什么语义关系取得 | 必须防止的误提取 |
| --- | --- | --- |
| I 输入与范围 | 动作消费的输入、受作用对象、筛选谓词、明确的清单 | 不能把审批人或整段动作句作为输入；“所有”不等于集合无限 |
| O 交付结果 | 明确的创建/输出/提交关系，及其接收者、位置、条件 | “读取已生成的文件”不构成本阶段输出承诺；不编造退款成功记录 |
| A 任务动作 | 规范动词/接口、参数、模态、守卫、阶段 | 必须、允许、建议保持区别；禁止动词不混入允许动作 |
| P 责任与授权主体 | 执行者、协调者、审批者等具名角色关系 | 出现 CFO 只能说明相应审批角色，不能自动补成执行人 |
| R 资源约束 | 带指标、对象、阶段、单位和开闭关系的数值节点 | 同单位不是同指标；信用分阈值是条件，不是调用预算 |
| V 版本与依据 | 根据/依据/遵循所绑定的文档、版本、时间口径 | 提到依据不证明该文件真实有效；警报触发源不自动成为版本依据 |
| C 完成与停止 | 原文明确的完成断言、停止事件、超限处理 | 有输出不等于已定义整个任务完成；收到 HTTP 200 不自动等于业务成功 |
| B 已知禁止边界 | FORBID 节点及其对象、守卫、作用域 | 不要求有接口名才能承认禁令；不能去掉“未经审批”等限定条件 |

以如下短句说明角色绑定：

> 未经 CFO 授权，严禁调用 batch_refund。

应构建 `Forbid(Call(batch_refund), guard=Not(Approved(CFO)))`。其中 P 是 **审批主体 CFO**，B 是 **未获 CFO 授权时禁止调用该接口**；句子没有声明执行人、交付文件、时长或完成条件，不补造这些值。该表达式是设计示意，不是本次 CNL2ASP 探针的输出。

再看输入与输出：`Read(cleaned_orders.parquet)` 给 I 提供输入依据；只有原文出现与本阶段绑定的 `Produce(cleaned_orders.parquet)` 才给 O 提供产出承诺。这一结构差别成立后，跨 WP 的供给差集才有可靠输入。WP 编号本身不能生成依赖边，全局禁止项也不能因分段被丢弃。

### 用什么数学形式管理提取歧义

设文本为 T，语言文法为 G，原文明示的术语与角色定义为 Γ。解析器返回候选语义树集合：

$$
\mathcal{A}(T)=\operatorname{Parse}(G,T,\Gamma)
$$

七要素中的一个字段 k，是候选树 a 的类型化投影：

$$
S_k(a)=\pi_k(a),\qquad k\in\{I,O,A,P,R,V,C,B\}
$$

如果不同候选给出的字段关系不同，记录分歧集合：

$$
D_k(T)=\{\pi_k(a):a\in\mathcal{A}(T)\}
$$

例如，两个候选分别把“该文件”绑定到输入文件和输出文件，就显示这两个具体文件名及对应原句，请 ADMIN 澄清归属。不能用任意概率把其中一个变成确定事实。

这里的确定性是**对给定文法及定义的确定性求值**。候选只有一个，仍不证明文法覆盖了现实语言的所有解释；解析超时、候选截断和未覆盖子句必须单独记录。也不能把“没有候选”解释成“没有问题”。有限规范可以建立严格语义；自由文本映射到规范的正确性仍需逐例验证。

### 双语不应维护两套业务含义

共享语义节点和校验器；中文、英文只负责把各自句式归约到这些节点。领域动作参数也共享，例如发送动作包含 sender、payload、recipient，生成动作包含 producer、artifact，审批动作包含 approver、subject。中英词汇可指向同一个构造器，但业务别名只从明确声明或已确认的领域定义中取得。

采用 GF 的思想不等于立即替换全部 Python 前端。当前优先用已有 Lark 建立这些明确的局部语义构造器；GF 作为独立双语前端候选，先验证中文否定、条件、并列、专名和源码偏移能否满足要求，再决定是否引入编译器/运行时。界痕不要求 ADMIN 改写为 JSON；支持的原句自动提取，存在分歧的局部句子给出定向澄清建议。

## 4. 本次实际运行了什么

对 CNL2ASP 固定提交 `5bbafba249c434d10811a3d0eaa9f7f31b678f72` 的 **原版 grammar.lark**，使用本地 Python 3.10.11、Lark 1.3.1 做了六项语法探针。没有修改其文法，没有调用模型。

| 输入类型 | 结果 | 实际观察 |
| --- | --- | --- |
| 声明 merchant 及其 id | parsed | 得到实体定义、键字段节点 |
| 枚举 alpha/beta/primary 节点 | parsed | 得到枚举定义和列表节点 |
| 声明实体后，使用 Whenever…then… 关系句 | parsed | 得到独立 whenever_clause、then_clause、predicate_with_objects |
| 有实体定义的数值条件句 | parsed | 得到 comparison、constraint_proposition、whenever_clause |
| 普通英文 CFO/风控退款指令 | not_in_grammar | UnexpectedCharacters，第 1 行第 30 列 |
| 用户中文 CFO/风控退款原文片段 | not_in_grammar | UnexpectedCharacters，第 1 行第 1 列 |

前四项为本次构造的 CNL 或改名后的上游测试句式；第五项是本次构造的普通英文，第六项是用户原文片段。**4 条 parsed 只说明语法树形成，不表示 7+1 正确率为 4/6，也没有验证 ASP 转换或求解。** 单次解析观察为约 5–59 ms；这是小样本语法探针，未计文法构建，不是产品性能保证。

完整输入、语法树、失败位置及耗时见 [grammar-probe-results.json](research/7plus1-20260911/grammar-probe-results.json)。原版文法 SHA-256 为 `de40718261f29ebc020e1f212188d83846ed17a47ee2db45611041bfd731b3be`。复现时取得固定提交的文法，校验哈希，使用 `Lark(grammar, propagate_positions=True).parse(case_text)`，逐条输入 JSON 中的 text 即可。上游测试结构来源为 [test_cnl_propositions.py](https://github.com/dodaro/cnl2asp/blob/5bbafba249c434d10811a3d0eaa9f7f31b678f72/src/tests/test_cnl_propositions.py)，项目采用 Apache-2.0。

FRET、Rimay、APE、GF 本次进行了源码/论文核对，**未在本机完成其整套安装与端到端运行**。不能据此声称它们已经能解析界痕的业务原文。

## 5. 论文证据支持什么、不支持什么

- **Rimay** 使用需求语料与领域人员分析来建立动作类别和语法，报告在四份未见过的金融需求文档中，可表达 460 条中的 405 条，约 88%。这是文法表达覆盖结果，不是自由文本自动抽取准确率，更不是中文界痕的测试成绩。[原文方法与评价](https://arxiv.org/html/2005.01355v1)
- **FRET** 的形式化正确性针对 FRETish 的既定语义，且以文字和图示帮助核对需求。它支持“先明确语义再计算”，不支持“所有自然语言自动无损转换”。[原始工具论文](https://ceur-ws.org/Vol-2584/PT-paper4.pdf)
- **CNL2ASP** 定义可接受的英文句式并翻译为 ASP，实验比较了生成编码与人工 ASP 编码在所选问题上的求解表现；该结果不证明任意任务句式可解析。[原始论文](https://arxiv.org/html/2311.10505v1)
- **GF 中文论文** 给出了中英共享 AST 与中文资源语法实现；文中也区分了领域 CNL 与采用统计消歧的宽覆盖翻译。界痕可研究前者，不能把后者混入 ADMIN 零模型通道。[原始论文](https://aclanthology.org/W15-3117.pdf)
- **ACE/APE** 展示了规则化解释、指代和逻辑表示之间的衔接。预先规定的解释规则可以确定计算含义，但用户仍需要理解并确认这一含义。[原始论文](https://attempto.ifi.uzh.ch/site/pubs/papers/reasoningweb2008_fuchs.pdf)

## 6. 本轮排除的误用与代码推进顺序

**NALABS 不能整包当作零模型库。** 本次核对的 [NALABSpy/nalabs_rules.py](https://github.com/eduardenoiu/NALABS/blob/feaa2a4121034190ac14143a4675b0ee36a75503/NALABSpy/func_core/nalabs_rules.py) 明确执行 `spacy.load("en_core_web_sm")`。其中的词表统计可以单独研究，但这些统计不能替代 7+1 关系抽取。

**ACE-in-GF 不是已经完成的中英逻辑引擎。** [仓库](https://github.com/Attempto/ACE-in-GF) 包含中文语法，但 README 说明未实现到 DRS 的映射，并保留往返翻译的已知问题；本次也未找到根目录许可证。它是架构和测试方法参考，不作为可直接携带的产品依赖。

复用许可须按组件核对：FRET 所查文法文件声明 Apache-2.0；CNL2ASP 为 Apache-2.0；APE 提供 LGPLv3 文本；GF 编译器、运行时、RGL 和外部词典的许可并不相同。本次没有把外部源码加入界痕运行依赖；固定源码地址与哈希仅用于复核。

后续代码重点应收敛到以下四项：

1. **统一语义节点**：在现有 [task_projection.py](../python/task_projection.py)、[guard_constraints.py](../python/guard_constraints.py) 等模块之间统一动作、角色、输入输出、守卫与阶段关系，避免各模块各自解释同一原句。
2. **文法按关系组合**：以“读取、生成、发送、审批、禁止、完成”动作结构为中心组合条件、否定和并列，原文偏移贯穿每一步。不要通过复制新用例全文到匹配表扩大覆盖率。
3. **分段和指代有依据**：局部定义与全局 B 继承分别管理；别名不明不强行归并；输入来源不明报具体文件缺口，不从 WP 编号补造流程。
4. **逐层、双语、反例验收**：固定用户原文与人工复核的证据；分别检查原文切片、IR 关系和求解结果。增加中英等价句、否定翻转、角色交换、单位变化、阶段交换和不同指标的反例；统计字段精确率/召回率、完整关系匹配、误绑定和未覆盖率。现有工程测试计数不能替代这些语料指标。

**选择结果：近期保留 Python/Lark，借鉴 CNL2ASP 的分层实现，按 Rimay 的动作角色思路补齐 7+1 抽取，以 FRET 的解释回显校对语义；GF 做中英共用文法的独立可行性验证。** 核心开发对象是带证据的语义结构，不是再增加一个求解库。
