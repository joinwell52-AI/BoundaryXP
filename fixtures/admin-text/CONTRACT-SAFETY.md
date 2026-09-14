# 64组契约测试 / 64 contract safety groups

[独立清单](contract-safety.json)对应v2任务书12.3的8类、每类8组。每个ID绑定一个独立测试，输入构建、变异及预期检查位于`src/__tests__/product-contract-safety.test.ts`；不能跳过失败fixture或用额外重复样本凑数。

The manifest maps the eight taskbook categories to eight independent scenarios each. Each ID has executable input construction and assertions. A separate inventory test rejects missing, duplicate or unbound scenarios.

| ID前缀 / Prefix | 范围 / Coverage |
|---|---|
| format | 最小包、独立L1、L3仅依赖L1、结构、payload Schema、摘要、自引用、压缩身份 |
| path | 穿越、绝对路径、盘符/UNC、反斜线、大小写、重复文件、链接、加密 |
| resource | 文件数、单文件、累计大小、压缩炸弹、重复JSON键、UTF-8/BOM、深度/节点、员工/别名数 |
| registry | 缺依赖、错版本、循环、同版异摘要、幂等、提交中断、启用回退、客户隔离 |
| semantic | 重复ID、共享别名、自定义岗位、错误角色引用、inactive、岗位不补人、停用、任务角色 |
| privacy | 最小披露、完整歧义、外发门禁、跨客户、上下文超限、无命中、包指令、伪造激活 |
| evidence | 非BMP、CRLF、组合字符、重复引文定位/未定位、伪造引文、旧快照、新摘要 |
| adapter | 两种回放、token转换、未知模型、模型失败、源长度超限、跨入口、208向量 |

```text
node --test src/__tests__/product-contract-safety.test.ts
```

计数为64个契约场景加1个清单完整性测试，共65项；场景内的多个参数不重复计入64。跨入口场景复用现有CLI/MCP/HTTP集成测试；向量场景执行现有208条冻结期望，不生成或改写期望。节点测试子进程移除继承的`NODE_TEST_CONTEXT`，避免测试运行器静默不执行子测试。

There are 64 scenario tests plus one inventory test. Parameter variants are not additional groups. Cross-entry and frozen-vector scenarios invoke existing executable checks without rewriting their expectations.

中断测试在独立子进程中于rename前退出，实际遗留staging/active临时文件；重新打开Registry后，旧活动文件字节不变，半成品不出现在已安装清单，并可重试导入。临时文件仅在测试临时目录内创建和清理。

The interruption fixture exits a child process before atomic rename. Reopening preserves the previous active-file bytes, ignores staging residue, and permits a later import. All mutations are confined to temporary directories.

这些是本地确定性契约测试，不是120条原文的金标，不是150次真实模型生成。包提示注入用例只检查本地包数据不成为执行指令；真实模型抗注入能力仍须独立验收。未知岗位、空匹配及回放不能作为抽取语义正确性的证明。

These deterministic checks do not certify model extraction or live prompt-injection resistance. Gold review and live generation remain separate acceptance gates.
