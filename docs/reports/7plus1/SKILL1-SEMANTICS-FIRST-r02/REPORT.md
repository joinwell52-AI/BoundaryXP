# skill1：semantics-first-r02双语规程接入

2026-10-13。用户授权：在现有58618的解析方式中增加`skill1`，用于与原`Skill`比较；完整附件交给开发侧，运行阶段分别加载对应Skill及同版合同与必要输入。沿用现有核心和UI，不恢复MD，不启动附件的74份文本模型评测。

## 文件与版本

原始附件：`BoundX-Skills-semantics-first-r02-bilingual.zip`，SHA-256 `f0f7cdd20558ed791a2fd076b33a86e78897eb01e0a92a29f124796b8f3fdcdf`。

原ZIP及79个原包文件完整保留于 `review-assets/7plus1/skills/semantics-first-r02/`；其中76个受原manifest约束的文件逐项核对摘要通过。开发者可阅读完整说明、英文译版、语言用例和工具；这些资源不加入运行请求。

原包声明`candidate-ir/1.2`，没有附旧合同/Schema。当前实现使用`candidate-ir/1.4`。运行兼容副本位于 `research/7plus1-parser/llm-first-028/skill-profiles/semantics-first-r02/`。原件未改，兼容副本仅更新接口标记及当前已定义的DATA_USE来源/AT_USE可用性说明，变更与原/新摘要记在PROFILE.json；未重写六步语义方法，未新增Schema字段或算子。

候选产品为ui78 / `direct-ir-r05.1-test` / `candidate-ir/1.4`。旧Skill正文、当前共享合同、Schema、算子表、投影和数学消费者保持原字节；版本号调整及选择/来源记录不是语义准确性认证。

## 运行资源分离

| 方式 | 解析调用 | 审阅调用 |
|---|---|---|
| Skill / SKILL | 原解析Skill | 原审阅Skill |
| skill1 / SKILL1 | 新解析Skill兼容副本 | 新审阅Skill兼容副本 |

每个解析调用只有对应解析Skill、共享合同、算子定义、原文和输出Schema通道。审阅另提供候选及审阅所需两份Schema正文，使用独立新会话。修订沿用原有有界patch流程，不重新加载另一套Skill。

开发说明、expected、双语配对的另一篇原文、完整ZIP、英文译版、另一阶段Skill均不发送给运行模型。没有改全局Codex配置或安装个人Skill。运行加载仍如实标为INLINE_BUNDLE，不声称已验证原生Skill自动发现。

## 程序与UI

- 下拉新增`skill1`；原`Skill`继续可选，MD仅保留历史只读。
- 选择传到API、CLI、解析、审阅、patch/重审及所有资源不变检查。
- 历史、Trace及run-summary保存实际parse_method、资源profile、分阶段文件摘要；刷新保留所选方式，查看旧记录不改旧结果。
- 同一request_id的幂等核对包含模式及对应资源摘要，不会把另一方式的旧答案复用为新请求。
- 新资源纳入完整包清单和runtimeInventory，防止开发目录资源混读或运行中变更。

首次离线路由测试4通过、1失败：原有审阅后资源锁重算默认Skill，导致SKILL1出现METHOD_CHANGED_DURING_RUN。已修正为始终检查选定方式，资源锁没有关闭。首次失败保存在FIRST-ROUTING-FAILURE.json。修正后5项专项通过，未新增真实模型调用。

工程验证、冻结响应和测试provider仅验证路由、结构及消费者回归，不是新Skill的真实理解/审阅成绩。附件54份语言文本及20份继承用例没有运行；等待用户以相同原文、模型和推理强度进行实际对比。

本次不修复此前MANUAL-TEST-001发现的输入数学摘要和停止范围消费者缺陷，不将新增选项宣称为这些缺陷已经关闭。完整产品语义验收仍未通过。

## 使用

58618刷新后，在“解析方式”选择`Skill`或`skill1`，再点击开始编译。模型和推理强度不自动变化。CLI使用 `--parse-method SKILL1`。原版和新版的真实运行分别保留，不挑选或覆盖失败结果。

完整源码和开发包提交到私有`review/7plus1-parser`，不merge/release/tag，不依赖GitHub Actions。安装、运行包摘要及本地检查记录另存TESTS.json与DEPLOYMENT.json。business_decision与execution_authorization始终为null。
