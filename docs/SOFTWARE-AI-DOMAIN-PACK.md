# 软件工程与 AI 任务领域包 v0.1

> 历史／非规范研究或产品规划（legacy / non-normative）。本文中的旧接口、原始结果和未来能力不代表当前产品合同或本轮验证；当前入口以根 README 和产品手册为准。No BXP extraction certification or execution authority is implied.

首个领域包位于 `domain-packs/l2/software-ai/`，定位为三层语义包架构中的 L2 垂直包。它把软件工程与 AI 任务语言绑定到现有 `action / role / fact`，再投影到 I/O/A/P/R/V/C + B；不建立第二套语义系统。总体结构见 [L0 内核 + 三层语义包治理](../domain-packs/README.md)。

## 为什么不是普通关键词表

单个动词不足以决定任务含义。“评审”可能是设计评审，也可能是交付复核；“训练”涉及模型，但不等于模型已经产出或训练已经完成。因此基本单元是动作框架：

- 稳定 frame ID 与中英文触发词；
- 复用 L1 的 READ、CREATE、SEND、EMIT、PROCESS、CHANGE、CALL；
- 主论元、可选执行者/接收者及允许的实体类型；
- 可进入 7+1 的候选映射；
- 服从 L0 的原文证据、未知保留、不得推断效果/完成/授权。

## 首包范围

v0.1 覆盖 8 类 107 个动作框架：

| 类别 | 示例框架 |
|---|---|
| 源代码与版本控制 | 检查仓库、克隆、提交变更、合并分支 |
| 分析与规划 | 分析、任务分解、规划、设计评审 |
| 代码修改 | 实现、修改代码、重构、修复 |
| 构建与测试 | 安装依赖、编译、运行测试、基准测试 |
| 发布与部署 | 打包、发布版本、部署、回滚 |
| 数据与模型 | 数据收集/预处理/标注、训练、评估、推理 |
| Agent 协作 | 委派、移交、请求评审、交付评审 |
| 安全与权限 | 漏洞扫描、授予/撤销权限、轮换凭据 |

实体词条覆盖仓库、分支、变更集、需求、任务、计划、设计、源码、依赖、测试、制品、发布、服务、环境、数据集、模型、接口、报告、权限和凭据。角色词条覆盖开发、架构、测试、发布、SRE、数据、算法、安全、评审和 Agent。实体/角色命中只是受框架约束的候选，不是业务事实或授权。

## 语义资产清单

| 文件 | 数量 | 支撑维度 |
|---|---:|---|
| `actions.json` | 107 个动作 frame | A，并通过角色合同连接 I/O/P |
| `entities.json` | 54 个领域实体 | I/O 对象类型候选 |
| `roles.json` | 22 个岗位/角色 | P 候选，不授予权限 |
| `resources.json` | 30 个资源与指标 | R 的指标、值类型与单位候选 |
| `references.json` | 12 个版本/依据类型 | V 候选 |
| `completions.json` | 10 个完成断言 frame | C 候选，必须绑定任务范围 |
| `boundaries.json` | 8 类高风险动作 | B/人工复核候选；词条本身不生成 B |

## 7+1 候选投影

| 原文绑定 | 候选 |
|---|---|
| 动作原句 | A |
| 明示执行者 | P |
| READ 的 input；PROCESS 的 target（且没有更明确范围） | I |
| CREATE 的 artifact；SEND/EMIT 的 payload | O |
| 明示数值/资源、版本依据、完成表达、禁止项 | 分别由既有抽取器投影 R、V、C、B |

“由算法工程师训练 fraud-v2 模型”可产生 A、P、I，但不会凭行业常识产生“模型文件”O 或“训练完成”C。“打包 release.zip”明确绑定 artifact，才可形成 O 候选。

## 歧义、未知与证据

`评审/review` 被有意声明为多框架触发词。更具体的“评审设计/review design”或“验收交付/review delivery”可唯一绑定；裸“评审 proposal.md”返回 `domain_frame_ambiguous`。

缺少必要论元时返回 unresolved；未覆盖表达不回退为猜测。每个领域动作保留 quote、UTF-16 `[start,end)`、pack ID/version、frame ID 和受角色合同限制的实体类型候选。

## 文件

- `manifest.json`：L2、版本、显式加载、类别、歧义和边界。
- `actions.json`：动作 frame 只保存差异，并引用集中维护的 L1 role/projection contract；同时保存中英文触发词。
- `entities.json`：L2 实体类型、L1 元类型、别名和文件扩展名。
- `roles.json`：角色称呼、适用动作类别和禁止授权推断声明。
- `resources.json`：资源、容量、质量指标、值类型和单位。
- `references.json`：源码、依赖、运行时、数据、模型、Prompt、镜像和政策版本。
- `completions.json`：测试、构建、部署、发布、验收和模型指标完成断言。
- `boundaries.json`：危险动作分类及其转成 B 所需的显式证据条件。
- `fixtures.json`：词条回归数据例。
- `domain-packs/action-frame.schema.json`：动作包 JSON Schema。
- `python/domain_action_frames.py`：注册表、加载校验和实体候选匹配。

扩词应新增或修订 frame，不向主干正则散落同义词，也不在每个 frame 复制角色、7+1 投影和安全边界。加载器根据集中契约展开并校验。L3 私有包默认只增量扩展；同粒度碰撞显式 unresolved，不以层级覆盖。

## 当前限制

v0.1 是确定性 L2 词条层，不使用模型或网络，不做完整句法、指代消解、隐含论元恢复、跨句实体链接或行业全覆盖。当前代码显式启用该包；L1 目录化、多包组合、UI 热插拔和租户 L3 上传尚未实现。
