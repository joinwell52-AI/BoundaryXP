# BoundX短文本编译器：快速开始

[English](QUICKSTART.en.md) · [中文首页](README.zh-CN.md) · [版本与已知限制](docs/SHORT-COMPILER-STATUS.md)

文档日期：2026-10-08。当前为可运行的**候选版**，不是已经通过全部产品质量门的正式版。请先区分已安装用户入口、开发工作区和旧BXP应用，不要混用命令或成绩。

## 1. 已经完成本机安装：固定打开58618

在Windows命令提示符中运行：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

打开`http://127.0.0.1:58618/`。同一安装版本已经运行时，启动器只返回地址，不启动第二个服务。实际监听状态须在本机确认；维护报告中的旧PID不可拿来直接停止进程。

这个入口当前锁定完整安装候选`0.1.0-candidate.031-r1.2`、核心`031-r1-c3`和合同`031-r1.1`。配置与历史在`.boundx/short-compiler-031-r1/`，运行资源在其`versions/`目录，不混读开发工作区的Skill/Schema。

**这不是全新克隆后的自动安装命令。** 安装目录缺失、指针换版、端口被未知进程占用或资源摘要不一致会明确拒绝，不自动选择另一个端口，也不停止未知进程。实现见[固定启动器](product/short-compiler/launch-installed.mjs)，维护依据见[恢复回执](docs/reports/7plus1/031-R1-RESTORE-58618/REPORT.md)。

## 2. 使用前提和操作

需要Windows、Node.js 22.18或以上，以及本机已经安装、登录且有可用用量的Codex CLI。不要为本指南新增API key、切换收费通道或修改全局账号。任务文本会发送给配置的模型服务；本地页面不是离线推理。

粘贴或上传UTF-8的`.txt/.md`，非空且最多300个Unicode码点，点击“开始编译”。输入超限不能截断。示例仅用于演示，不是已运行的新验收案例：

```text
请PM核对data.csv的字段名，并生成check.md；不得修改data.csv。
```

查看动作、对象、角色、模态、条件、来源与未决；展开全过程可检查候选、审阅、技术校验和IR。导出JSON、同源中文或完整Trace。历史打开不重新调用模型；修改原文再编译是新的运行。

解析和独立审阅需要等待模型响应，界面显示真实阶段。刷新应恢复同一运行，不当作重新提交。取消只确认本机受控进程停止，不能由此证明云端停止计费。调用失败、未决、编译完成和产品验收通过是不同状态。

## 3. 新目录安装：使用完整候选包，不用开发目录拼资源

已核验的旧候选包见[031-R1交付页](docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/REPORT.md)及其[运行包](docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/delivery/BoundX-short-compiler-0.1.0-candidate.031-r1.2.zip)。它仍有已知Q05范围限制；下载包不代表语义验收通过。

以下仅适用于**新安装且58618没有被使用**的机器或环境。在解压后的包根目录执行：

```bat
node product/short-compiler/deploy.mjs install --home D:\boundx-short --port 58618
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

已有用户实例不要再次install，不要删目录重装或强抢端口。使用原安装home的启动方式。新安装home与`D:\boundx`工作区默认home不同，不能假定根仓库`npm run 7plus1:ui`会自动发现自选目录。

Q05新候选`0.1.0-candidate.031-r1.q05.1`已包含全称结构，但适用域和完整补测尚未闭合，不作为本指南的自动升级目标。区别见[状态页](docs/SHORT-COMPILER-STATUS.md)。

## 4. 网页与CLI比较必须同版

在**同一完整安装版本的包根目录**运行CLI：

```bat
npm run 7plus1 -- --input D:\boundx\task.txt --output D:\boundx\new-run-directory
```

输出目录必须是新目录，不能覆盖旧结果。命令会实际调用模型；查历史或纯程序回放应使用相应显式入口，不把它们计成新的模型能力验证。

特别注意：根开发仓库的`npm run 7plus1`当前直接调用工作区核心，可能已经是较新的Q05合同；根仓库`npm run 7plus1:ui`却锁定已安装候选。两者使用同一核心的实现谱系，**不保证此时同一版本**。不能拿一次工作区CLI与旧安装UI的结果宣称同版一致。

## 5. 停止、升级与回滚

先核对具体实例、版本、当前运行和备份，确认空闲后使用正常审批及停止方式。不得按进程名停止所有Node/Codex，不得绕过策略拒绝，也不要重新启用历史混版进程。

从获准且完整校验的新包执行：

```bat
node product/short-compiler/deploy.mjs upgrade --home D:\boundx-short --confirmed-idle
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

回滚同样在正常停止目标实例后执行：

```bat
node product/short-compiler/deploy.mjs rollback --home D:\boundx-short --confirmed-idle
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

这些是维护操作说明，不是本次文档更新自动启动升级的授权。已有固定工作区启动器还锁定具体版本，升级后必须同步其获准版本绑定，否则会拒绝；不能取消校验来强行启动。历史按原生成版本保留，不重新解析覆盖。

## 6. 既有BXP入口和main分支

`npm run ui`启动既有BXP应用，不是现在的短文本58618入口。结构化IR计算示例和`node cli.mjs protocol-info`也不等于直接解析自然语言。使用这些能力时参见[协议实现](protocol/IMPLEMENTATION.md)及[示例](examples/README.md)。

`main`和`review/7plus1-parser`是不同代码快照。当前固定短文本启动脚本在开发分支，不能告诉只克隆main的用户该命令一定存在。不自动切换用户已有脏工作区、不为了阅读文档合并候选代码。

## 7. 检查与故障提示

先检查版本清单、安装home、端口、登录和网络，再看具体错误。遇到`SKILL_CONTRACT_VERSION_MISMATCH`或摘要错误应恢复完整同版资源，不能复制一份新Schema到旧安装目录“补好”。遇到登录、额度或策略拒绝停止对应重试，不循环调用。

本轮文档只核对了命令与源码，不在用户电脑运行上述操作。测试和预算规则见[验证说明](docs/VALIDATION.md)，当前质量状态见[状态页](docs/SHORT-COMPILER-STATUS.md)。
