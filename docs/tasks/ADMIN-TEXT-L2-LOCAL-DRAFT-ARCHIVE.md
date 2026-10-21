# 历史本地草稿：v1与L2增补（非执行入口）

> 历史／非规范（legacy / non-normative）。保留此前本地未提交的v1增补，不覆盖已有成果。以下旧状态和要求仅供追溯；v2入口及L2增补执行记录优先，不以本草稿授权开发。

状态：`AUTHORIZED_FOR_IMPLEMENTATION`  
适用仓库：`joinwell52-AI/BoundaryXP`  
实施目录：`D:\boundx`  
基线分支：`main`  
基线提交：`50b9882c7b3e5118e85fb6993ba365d8f054fe0b`  
固定协议：`BXP-0001 0.3.0-draft.2`  
固定计算套件：`BXP-CALC 1.0.0-draft.3`  
决定主体：ADMIN

## 1. 项目定义

这是BoundaryXP协议产品化之后的一个新开发项目。首个用户是ADMIN，首个输入是ADMIN提交的完整任务文本，首个行业范围是软件开发与AI任务。

本阶段不训练、不微调、不内置BoundaryXP自己的小模型。BoundaryXP把固定7+1规则及已启用语义包提供给接入AI，由AI先生成候选7+1；随后由本地程序复核证据、组装标准BXP任务并执行确定性计算。

固定链路：

```text
ADMIN任务文本
  + 7+1提取规则
  + L1通用语义包
  + L2软件开发/AI语义包
  + L3客户职员表
        ↓
接入AI生成7+1候选
        ↓
BoundaryXP程序复核原文证据、语义引用和三态
        ↓
组装boundx-task/v1
        ↓
现有BXP Core确定性计算
        ↓
输出boundx-result/v1及ADMIN可读边界报告
```

ADMIN不手写JSON。模型不计算最终结论。程序不重新做一遍开放式自然语言理解。

## 2. 本轮固定边界

### 2.1 协议不变

本轮不得修改：

- `protocol/BXP-0001.md`；
- `protocol/BXP-0001.zh-CN.md`；
- task/result/suite Schema；
- 208条冻结计算期望；
- I/O/A/P/R/V/C/B定义；
- `resolved | unresolved | absent`三态；
- `business_decision: null`；
- `execution_authorization: null`；
- LICENSE。

不新增`BXP-0002`。语义包标准、模型候选格式、职员表和导入方式均属于协议之上的产品合同。

### 2.2 本轮不做

- 不开发、训练或微调自有模型；
- 不把旧Python/Lark研究解析器改名后冒充AI；
- 不接入CodeFlowMu或FCoP；
- 不执行ADMIN任务；
- 不实现企业权限、审批、额度或IAM；
- 不把岗位映射解释为执行授权；
- 不开发其他行业L2包；
- 不允许语义包携带可执行代码；
- 不发布npm/PyPI、安装包、公开Release或新GitHub Release；
- 不宣称BXP-EXTRACT认证或自然语言准确率已获证明。

## 3. 四部分职责

| 部分 | 职责 | 不得承担 |
|---|---|---|
| 接入AI | 根据原文、7+1规则和语义包生成候选 | 不作最终验证、计算、业务决定或授权 |
| L1/L2/L3语义包 | 提供版本化的语言、行业和客户解释依据 | 不覆盖协议，不补造原文事实 |
| Producer/Assembler程序 | 定位证据、计算Unicode码点、验证语义引用、组装BXP | 不进行无证据猜测 |
| BXP Core | Schema、语义不变量和五类确定性计算 | 不调用模型，不执行任务 |

正式产品表述统一为“BXP Core + L1/L2/L3三层语义包”。BXP Core不是语义包，7+1由BXP协议定义，不由L1定义。

## 4. 三层语义包

### 4.1 L1通用语义包

L1是所有任务共享的通用语言基础，始终启用。它至少包含：

- READ、CREATE、SEND、EMIT、PROCESS、CHANGE、CALL等基础动作；
- REQUIRE、PERMIT、FORBID、NOT_REQUIRED等模态；
- 执行者、负责人、接收者、审批者、复核者等关系候选；
- 如果、除非、之前、之后、根据、至少、不超过等关系；
- 通用数量、条件、依据和完成表达；
- 中英文及混合语言别名。

将现有`python/semantic_lexicon.json`和`python/semantic_actions.lark`中的有效数据整理为正式L1数据包`core-ontology@1.0.0`。Python研究实现可以兼容读取，但不得继续成为唯一真相源。

### 4.2 L2软件开发/AI语义包

本轮只支持软件开发与AI行业。复用现有`software-ai@0.1.0`资产，包括：

- 源代码和版本控制；
- 分析、规划和评审；
- 实现、修改、重构和修复；
- 构建、测试和基准测试；
- 打包、发布、部署和回滚；
- 数据处理、训练、评估和推理；
- Agent委派、移交和交付评审；
- 安全、权限、凭据和漏洞检查。

不得无故减少现有107个动作Frame、54个实体类型、22个岗位、30个资源指标、12个依据类型、10个完成Frame和8类风险边界。

L2必须修正旧UTF-16说明，统一使用BXP规定的Unicode码点。典型行业效果不能在原文未出现时自动生成O、C或B；“评审/review”等多Frame表达必须保留歧义。

### 4.2.1 新增词帧范围 / Additional Frame Scope

以下增量纳入WP3，与双语正例、否定、歧义和缺证据测试一起实施，不另起协议、不扩展到其他行业。当前实际基线为107个动作Frame，不是约53个；最终数量从数据计算，不预设为70至80个。

These additions belong to WP3, together with bilingual positive, negation, ambiguity and missing-evidence tests. The existing baseline is 107 action frames. This extends producer vocabulary, not BXP semantics or execution authority.

| 范围 | 待新增Frame ID | 必须区分的语义 |
|---|---|---|
| 代码变更 | `code.autofix`、`code.transpile` | 自动修复/转译属于变更或产物形成，不能与只读lint/type-check混同；不得推断修复成功 |
| 依赖审计 | `dependency.audit` | 明确审计对象和范围；与`security.scan_dependency`重叠时声明歧义，不把扫描等同完整审计 |
| 数据库演进 | `database.migrate_schema`、`database.rollback_migration` | 区分结构迁移、回滚和一般`code.migrate`；不得推断已备份、可逆或已授权 |
| 工具与宿主命令 | `agent.invoke_tool`、`ops.exec_shell` | 工具调用映射既有L1 `CALL`及其角色合同；shell命令与一般工具调用分开，不执行命令 |
| 上下文检索 | `agent.retrieve_context`、`vector_index.search` | 复用既有L1读取语义；区分上下文检索、向量检索与索引写入，不推断来源可信 |
| 人机协作 | `agent.interrupt`、`agent.resume` | 只表示原文要求的中断/恢复动作，明确目标会话或任务，不赋予BoundaryXP运行时控制权 |
| 模型对齐 | `model.align`、`model.rlhf` | 区分通用对齐与明确RLHF过程；DPO不能当作RLHF同义词，不由方法名推断奖励、数据或训练成功 |
| 提示词与数据 | `prompt.optimize`、`data.chunk` | 优化不等于评测通过；分块不等于生成向量或写入索引 |

每个新增Frame必须有稳定ID、中英触发词、L1 operation及role/projection合同、合法实体引用和明确的证据要求。不得为了凑数量复制同义Frame。若无法与既有Frame区分，须在WP3交付表记录采用别名或显式多候选的原因；不得静默删除上述覆盖需求。不得仅为这些词帧发明新L1 operation或改变7+1定义。

### 4.2.2 配套实体、资源、完成与风险 / Supporting Vocabulary

- 实体补充：`tool`、`session`、`context`、`document`、`lora-adapter`、`tokenizer`、`guardrail`、`ast`、`sbom`。仅作为类型候选，不推断对象存在、内容或权限；Frame引用必须全部可解析。
- 依赖文件：纳入`Cargo.lock`、`go.sum`、`requirements.txt`识别，但先区分锁定文件、校验记录和依赖声明，不能把它们无条件都标为lockfile。
- 资源补充：GPU卡数、计算节点数、输入Token预算和输出Token预算分别建模；`card`与`node`不能无条件互换，不从Token数量猜测价格或成本上界。
- 完成表达：补充lint通过、评测指标达标和安全扫描结果。安全扫描通过、无高危漏洞、零漏洞不是无条件同义断言，必须保留显式严重级别、阈值、评测集/报告版本及任务作用域；信息缺失不得补造。一次检查通过不等于整项任务完成。
- 风险候选：补充`arbitrary-code-execution`、`model-data-poisoning`、`cross-tenant-leakage`、`unbounded-network-access`，并校验所有Frame引用。仅凭工具调用、微调、推理或采集动作，不能断言发生了无沙箱执行、污染、跨租户泄露或联网。
- 风险转B仍要求明确禁止原文或有证据的有效制度绑定。没有这些证据时只能提示风险/澄清，不能填入B。本轮L3只是职员表，不借此扩展企业制度绑定功能。

Entity matches are candidates, not facts. Keep GPU cards separate from nodes and input tokens separate from output tokens. Completion assertions retain explicit thresholds and scope. Risk classification alone never creates B; this stage does not add policy binding to the L3 employee directory.

### 4.2.3 数据完整性与版本 / Integrity and Versioning

- 修正当前Manifest中的UTF-16文字；所有当前证据采用Unicode码点`[start,end)`，历史研究记录不改写。
- 修复重复fixture ID：保留训练样例`zh-model`，微调样例使用`zh-model-fine-tune`，新增ID必须非空且唯一。
- 动作、实体、角色、资源、依据、完成和风险计数必须逐项与Manifest一致；已有计数校验须保留，不手写未经核验的覆盖声明。
- 扩充后的正式L2制品必须使用新的Pack版本并同步Manifest、payload、依赖示例及引用；不能把不同内容重新发布为同一`software-ai@0.1.0`。Pack版本调整不等于产品版本或BXP版本升级，也不授权创建Release。
- WP0核对已完成的文档收口和本地元数据/fixture修复，不重复改写原任务书、实施回执或历史验证结果。

### 4.3 L3客户自定义职员表

L3首版只有最简单的职员表。客户可以自行建立和导入，用来告诉接入AI任务文本中的人员、Agent代号和岗位对应关系。

L3不包含：

- 执行权限；
- 审批权；
- 发布权；
- 仓库权限；
- 金额额度；
- 企业制度；
- 密钥、Token、邮箱、电话或身份证等非必要敏感信息。

岗位只帮助模型形成P候选，不能证明本次任务已获授权。

## 5. 标准语义包定义

### 5.1 标准制品

统一导入制品使用`.bxpack`扩展名，物理格式为只包含UTF-8数据文件的ZIP。

标准结构：

```text
<pack-id>/
├─ manifest.json
├─ data/
├─ fixtures/
├─ checksums.json
└─ README.md
```

要求：

- `manifest.json`、`data/`、`fixtures/`、`checksums.json`必需；
- `README.md`可选；
- 不允许JavaScript、Python、Shell、PowerShell、二进制、宏、动态库、符号链接或任何可执行入口；
- 所有受管文件必须在Manifest中声明并具有SHA-256；
- 相同ID+version必须对应相同字节和摘要；
- 导入后不得用相同版本覆盖不同内容。

### 5.2 公共Manifest

新增产品Schema：`boundx-semantic-pack-manifest/v1`。

最小结构：

```json
{
  "schema": "boundx-semantic-pack-manifest/v1",
  "id": "example-team",
  "version": "0.1.0",
  "layer": "L3",
  "name": {
    "zh-CN": "示例团队职员表",
    "en": "Example team directory"
  },
  "locales": ["zh-CN"],
  "base_packs": [
    {
      "id": "software-ai",
      "version": "0.1.0"
    }
  ],
  "files": [
    {
      "path": "data/employees.json",
      "schema": "boundx-employee-directory/v1",
      "sha256": "<lowercase-hex>"
    }
  ],
  "capabilities": ["employee-directory"]
}
```

Manifest只描述制品身份、内容和依赖。Pack是否已导入、是否启用由本地Registry记录，不写回Pack，也不表示人员获得授权。

### 5.3 加载规则

1. L1由产品固定并始终启用。
2. L2和L3必须由ADMIN显式选择。
3. 禁止扫描目录后自动启用。
4. 加载前验证Schema、摘要、路径、大小、依赖和引用。
5. 未启用Pack不得影响候选、模型上下文或结果摘要。
6. 同一文本命中多个同粒度候选时返回全部候选和`unresolved`。
7. 每次生成都记录实际使用的Pack ID、版本和内容摘要。
8. L2/L3不得覆盖BXP Core和B禁止边界。

## 6. L3职员表标准

新增payload Schema：`boundx-employee-directory/v1`。

```json
{
  "schema": "boundx-employee-directory/v1",
  "pack_id": "example-team",
  "pack_version": "0.1.0",
  "employees": [
    {
      "employee_id": "dev-01",
      "display_name": "DEV-01",
      "aliases": ["开发工程师"],
      "subject_type": "agent",
      "job_title": "软件开发工程师",
      "role": {
        "pack_id": "software-ai",
        "pack_version": "0.1.0",
        "role_id": "software-engineer"
      },
      "status": "active"
    }
  ]
}
```

字段规则：

| 字段 | 规则 |
|---|---|
| `employee_id` | 客户范围内稳定且唯一，不得使用姓名作为主键 |
| `display_name` | ADMIN任务中使用的主要称呼 |
| `aliases` | 其他称呼或Agent代号 |
| `subject_type` | `human`或`agent` |
| `job_title` | 客户自己的岗位名称 |
| `role` | 精确引用已安装L2中的岗位ID |
| `status` | `active`或`inactive` |

可选字段限于`department`、`effective_from`、`effective_to`和有界`extensions`。

同一Pack中`employee_id`重复为无效。别名重复可以导入，但必须形成歧义；AI和程序均不得静默选择其中一人。`inactive`人员不得被解析为当前唯一执行者。

## 7. 客户如何建立L3

### 7.1 UI方式

提供“创建职员表语义包”向导：

1. 下载CSV模板；
2. 客户填写职员ID、显示名称、别名、人员类型、岗位和状态；
3. 上传CSV；
4. UI列出已安装L2岗位供客户映射；
5. 显示重复ID、重复别名、未知岗位和inactive记录；
6. 预览标准JSON；
7. 构建并导出`.bxpack`。

CSV固定列：

```text
employee_id,display_name,aliases,subject_type,job_title,role_id,status,department,effective_from,effective_to
```

`aliases`使用JSON数组字符串，不能使用不可逆的普通逗号拆分。

### 7.2 CLI方式

新增：

```text
bx pack template employee-directory <directory>
bx pack build <directory> --output <file.bxpack>
bx pack validate <file.bxpack>
```

模板建立和构建过程全部在本地完成，不自动上传客户数据。

## 8. 客户如何导入L3

UI流程：

```text
选择.bxpack
→ 临时隔离解包
→ 验证结构、路径、大小、摘要、Schema和依赖
→ 显示人员数量、岗位映射、重复别名和警告
→ ADMIN确认导入
→ 原子写入本地Pack仓库
→ ADMIN单独选择是否启用
```

CLI新增：

```text
bx pack import <file.bxpack>
bx pack list
bx pack activate <id>@<version>
bx pack deactivate <id>@<version>
```

导入和启用必须分开：

- import表示本地制品通过机器验证；
- activate表示该Pack可以参与后续AI候选生成；
- 二者都不表示职员获得任务授权。

导入安全最低要求：

- 解压后默认不超过10MiB、文件不超过64个；
- 拒绝绝对路径、`..`、重复路径、大小写碰撞和符号链接；
- 拒绝加密ZIP、压缩炸弹、未声明文件和可执行文件；
- 严格UTF-8 JSON并拒绝重复键；
- 临时目录完整验证后原子rename；
- 同ID+version+相同摘要允许幂等导入；
- 同ID+version+不同摘要必须拒绝。

## 9. 语义包如何提供给AI

本轮不把整个语义包无差别发送给AI。程序先在本地根据ADMIN原文检索最相关内容：

- L1匹配通用动作、模态、角色关系、条件和数量表达；
- L2匹配软件开发Frame、实体、岗位、资源、依据、完成和风险候选；
- L3只匹配原文实际出现的职员名、代号或别名。

然后构造有界的`extraction_context`，包含：

- 固定7+1生成规则；
- 相关语义条目；
- Pack ID、版本和摘要；
- 多候选歧义；
- 模型候选输出Schema；
- 禁止补造、禁止授权推断和未知保留要求。

L3完整职员表默认不离开本地。只向接入AI提供任务原文命中的最小职员记录。原文和L3数据是否可以发送给外部模型，由宿主和ADMIN承担独立数据授权；BoundaryXP不得暗中上传。

## 10. AI生成候选

BoundaryXP不内置模型，也不保存模型API密钥。第一种正式模式是接入AI作为Host，通过MCP与BoundaryXP协作。

Host内部流程：

```text
1. bx_prepare_admin_task(task_text, language, active_packs)
2. AI依据返回规则和语义上下文生成boundx-extraction-candidate/v1
3. bx_evaluate_admin_candidate(task_text, candidate, active_packs)
```

对ADMIN应表现为一次“计算任务边界”，不要求复制JSON或理解两步工具调用。

新增产品Schema：`boundx-extraction-candidate/v1`。每个候选至少包含：

- 目标桶I/O/A/P/R/V/C/B；
- 建议状态；
- 精确原文quote；
- 候选解释；
- Pack ID、版本和摘要；
- L1 operation、L2 Frame或L3 employee ID引用；
- 多候选时的全部candidate IDs；
- 需要ADMIN澄清的问题。

AI不得生成或决定：

- Unicode `start/end`；
- source/input digest；
- 最终validation/completeness/consistency；
- business decision；
- execution authorization。

## 11. 程序复核与计算

新增唯一Producer/Assembler，负责：

1. 保存ADMIN任务原文的精确字符和换行；
2. 精确定位AI提交的quote；
3. 按Unicode码点计算左闭右开的`start/end`；
4. 重复quote无法唯一定位时返回unresolved，不偷选第一次出现；
5. 计算来源摘要；
6. 验证Pack、Frame、role和employee引用；
7. 校验AI没有用语义包补造原文事实；
8. 完整组装八桶及三态；
9. 将明确约束转换为BXP已有typed constraints；
10. 在namespaced extension记录producer、模型标识和Pack来源；
11. 调用现有`evaluateBxpTask`；
12. 返回标准`boundx-result/v1`和ADMIN可读报告。

禁止复制第二套BXP计算器。程序复核只证明证据、引用、结构和计算成立，不证明AI已经完整理解全部自然语言。

## 12. 产品入口

### 12.1 MCP

新增：

- `bx_prepare_admin_task`；
- `bx_evaluate_admin_candidate`；
- `bx_list_semantic_packs`；
- `bx_get_semantic_pack_info`。

保留现有`bx_evaluate_task`和`bx_evaluate_task_json`，不改变语义。

### 12.2 UI

新增ADMIN任务文本模式：

- 输入完整任务原文；
- 显示使用的L1/L2/L3及版本；
- 展示AI生成的八桶、原文证据和语义来源；
- 展示resolved/unresolved/absent；
- 展示三轴结果和五类计算；
- 展示需要ADMIN补充的问题；
- 修改原文后必须重新生成和计算；
- 不提供“计算通过即执行”。

若浏览器无法直接获得Host AI，必须明确显示需要兼容Host接入；不得调用旧研究解析器冒充AI结果。本轮端到端验收以MCP Host为准。

### 12.3 CLI

新增Pack管理命令，并提供不调用模型的调试入口：

```text
bx prepare <task.txt> --packs <pack-list>
bx evaluate-candidate <task.txt> <candidate.json>
```

CLI不得声称自行调用AI。

## 13. 工作包

| WP | 内容 | 完成门禁 |
|---|---|---|
| WP0 | 收口当前/规划能力、L1/7+1归属、Python研究实现、UTF-16和私有Release文档口径 | 协议文件无变化，文档测试通过 |
| WP1 | 建立标准`.bxpack`、Manifest、摘要和安全校验 | 合法、非法、路径穿越、重复键和幂等用例通过 |
| WP2 | 将L1整理为正式`core-ontology@1.0.0`数据包 | Node主产品可加载，中英文fixtures通过 |
| WP3 | 产品化并接入软件开发/AI L2，实施4.2.1至4.2.3词帧及配套增量 | 数量与引用一致、ID唯一；逐Frame双语四类测试及风险不自动转B通过 |
| WP4 | 实现L3职员表Schema、CSV模板、UI/CLI构建器 | ID、岗位、inactive和重复别名测试通过 |
| WP5 | 实现Pack Registry、导入、启停、检索和最小上下文 | 未启用不生效，依赖固定，最小披露通过 |
| WP6 | 实现AI候选Schema和MCP两步生成流程 | Host AI可以从ADMIN原文生成候选，无需手写JSON |
| WP7 | 实现证据定位、BXP组装、Pack引用复核和Core调用 | 非BMP、重复引文、错误引用和三态通过 |
| WP8 | 完成ADMIN UI、CLI及跨入口一致性 | 同一原文和候选得到一致任务与结果 |
| WP9 | 全量回归、文档、交付清单和执行回执 | CI全绿、协议无漂移、提交ADMIN审核 |

按WP0至WP9顺序执行；每个工作包单独提交并记录测试。

## 14. 必测场景

至少覆盖：

1. L1中英文基础动作、模态和关系；
2. L2软件开发唯一Frame；
3. “评审/review”多Frame歧义；
4. L3职员ID、名称和别名命中；
5. 两名职员共享别名时返回unresolved；
6. inactive职员不被静默当作当前执行者；
7. 未知人员保持unresolved或无匹配；
8. 岗位映射不产生权限或授权；
9. 未启用L3时同一人员名称不被解析；
10. Pack依赖缺失、摘要不符和ID/version冲突拒绝；
11. ZIP路径穿越、符号链接、超限和可执行文件拒绝；
12. 中文、英文、混合文本和非BMP码点正确；
13. 重复引文不能唯一定位时不偷选；
14. AI引用不存在的Frame、role或employee时拒绝；
15. AI用语义包补造O、C、B或授权时产生诊断；
16. `business_decision`和`execution_authorization`始终为null；
17. BXP-CALC 208条冻结期望完全通过；
18. Ubuntu Node 22、Ubuntu Node 24和Windows Node 24 CI通过。

### 14.1 L2逐词帧双语测试门禁 / Per-frame Bilingual Test Gate

每个新增或语义发生变化的动作Frame至少覆盖以下四类，各含中文和英文，最低8条独立fixture。别名覆盖替代独立Frame时也必须逐项列出测试；不得只为整个包提供一组泛化样例。

| 类型 | 中文测试意图 | English test intent | 必须断言 |
|---|---|---|---|
| 正例 | 明确动作及必需论元 | Explicit action and required arguments | 预期Frame/operation/角色、精确原文quote、码点区间、Pack版本引用；不推断O/C或权限 |
| 否定 | 明确“禁止X”，并区分“不要求X” | Explicit prohibition, distinct from not-required | 禁止表达不能当作肯定待执行动作；有证据的禁止进入独立B，“不要求”不等于禁止 |
| 歧义 | 省略区分信息或匹配多个已声明候选 | Missing disambiguation or multiple declared candidates | 列出全部适用候选并保持未明确，不按顺序偷选；不能为测试而污染生产词表制造冲突 |
| 缺证据 | 必需对象缺失、quote缺失或不在原文 | Missing arguments or absent/nonmatching quote | 不补造实体、角色、产物、完成或B；错误候选拒绝/诊断，不能组装空证据的resolved条目 |

Each new or semantically changed action frame needs at least eight independent fixtures: Chinese and English for positive, negation, ambiguity and missing-evidence cases. Assert evidence, identity and expected diagnostics, not merely successful parsing. No EXTRACT accuracy or certification claim follows from these tests.

补充门禁：

1. 非BMP字符、重复引文和中英混合输入正确处理；无法定位唯一引文时不得偷选。
2. 新增Frame与既有107个Frame做触发词碰撞回归；重复Frame ID、fixture ID及悬空实体/角色/风险引用必须检测失败。
3. Manifest计数失配、未知Pack引用、未启用Pack影响上下文及同ID/version不同内容均有负向测试。
4. 每类新增风险分别测试“只有动作/风险线索”和“明确禁止证据”；前者不得自动生成B。以L3岗位信息补造授权也必须失败。
5. GPU卡数/节点数、输入/输出Token预算、无高危/零漏洞分别做不可误合并测试；完成条件缺少作用域或阈值时不得猜测。
6. 缺证据时区分候选层诊断和BXP合法状态：确实未提及才可为absent；有依据但未消歧保留unresolved；非法/无证据候选不得强行组装为合法resolved或空证据unresolved。
7. WP3使用固定离线fixture，不依赖实时模型；WP6至WP8选取工具调用、数据库迁移和检索的双语代表样例贯通候选、Assembler、唯一Core及适用入口。
8. 最终测试清单关联需求、Frame/别名、语言、测试类别、预期和结果；分别报告fixture数、自动化测试数及208条冻结向量，不合称自然语言准确率。

## 15. 首个端到端验收

使用虚构L3职员表，不提交真实客户个人数据。至少包含：

- `PM-01 → product-manager`；
- `DEV-01 → software-engineer`；
- `QA-01 → qa-engineer`；
- `OPS-01 → sre`；
- 一个inactive职员；
- 一组重复别名歧义。

验收任务：

```text
DEV-01修改登录接口，QA-01运行测试。测试通过后交给PM-01复核；不得发布，也不得修改BXP协议。
```

必须证明：

- AI使用L1理解关系、顺序和禁止表达；
- AI使用L2识别修改、测试、复核和发布Frame；
- AI使用L3识别DEV-01、QA-01和PM-01的岗位；
- 程序生成精确证据Span和标准BXP任务；
- B独立保留两项禁止边界；
- 缺失或不明确内容不会被语义包补齐；
- 结果不会产生执行授权。

## 16. 交付物

至少提交：

- 标准Pack容器和Manifest Schema；
- 正式L1数据包；
- 产品化L2软件开发/AI包；
- L3职员表Schema、CSV模板、虚构示例目录和示例`.bxpack`；
- Pack Registry、校验器、构建器、导入器和检索器；
- AI候选Schema与MCP工具；
- BXP Producer/Assembler；
- ADMIN UI和CLI入口；
- 客户建立、验证、导入及启用L3指南；
- 数据安全与隐私说明；
- 自动化测试与固定fixtures；
- L2增量映射表及逐词帧双语四类测试矩阵（含基线/最终计数、别名处理理由、Pack版本与已知覆盖限制）；
- `docs/tasks/ADMIN-TEXT-SEMANTIC-PACKS-DELIVERY.md`；
- `docs/tasks/ADMIN-TEXT-SEMANTIC-PACKS-RECEIPT.md`。

## 17. 完成判定

只有同时满足以下条件才能报告`IMPLEMENTATION_COMPLETE`：

1. ADMIN提交自然语言任务，不需要手写BXP JSON；
2. 接入AI实际获得7+1规则以及L1、L2、已启用L3上下文；
3. 客户可以自行建立、验证、构建、导入和启用L3职员表；
4. 导入与启用分离，未启用Pack不影响结果；
5. AI候选经过程序证据定位、Pack引用校验和BXP组装；
6. 现有唯一BXP Core完成验证和计算；
7. MCP、CLI和UI适用入口保持一致；
8. 新增及既有测试全部通过，CI全绿；
9. BXP协议、Schema和冻结计算向量未改变；
10. 没有发布、权限授予、客户数据暗中上传或抽取认证宣称。

## 18. Codex执行指令

1. 从最新`origin/main`确认基线；如main已前进，记录差异并确认未改变固定边界。
2. 建立独立实施分支，不直接写main。
3. 按WP0至WP9顺序执行，逐包提交。
4. 不得改变协议、刷新冻结期望或建立第二套BXP计算器。
5. 不得开发、训练或内置BoundaryXP自己的模型。
6. fixtures只使用虚构职员和Agent代号。
7. 完成后创建Draft PR，附文件清单、测试命令、精确结果、已知限制和协议未变证明。
8. 停止在ADMIN审核门前，不合并、不发布、不创建Release。
