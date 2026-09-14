# API模型传输边界 / API model transport boundaries

Responses与Chat Completions共用`src/product/http-provider.mjs`。原页面、连接测试与标准BXP抽取仍调用同一个传输入口；此模块不执行任务，也不实现第二套计算器。

Responses and Chat Completions share one HTTP transport. Connection checks and standard BXP extraction use the same entry. It performs no task execution or boundary calculation.

- 响应原始字节最多2,000,000；严格解析UTF-8与JSON，拒绝BOM、重复键、不配对代理项及超限结构，不先替换坏字符再解析。
- 请求最长180秒；调用方可提前取消。读取中止、超限和错误时取消响应流并释放锁；迟到的fetch响应执行清理。无自动重试或规则回退。
- 只接受已完成的文本输出；拒绝工具调用、拒答内容及非字符串文本片段。文本仍须经过后续候选Schema、原文证据与快照验证。
- 不跟随HTTP重定向；密钥只放在请求授权头，不写入提示词。服务商错误正文不作为返回错误内容。

Raw responses are byte-bounded and strictly parsed. Cancellation interrupts pending fetch/body waits, with late-response cleanup. Only completed text is accepted; refusals, tool calls and invalid text segments fail closed. Redirects, automatic retries and rule fallbacks are disabled. Candidate validation remains mandatory after transport success.

测试使用合成响应和本地模拟网络，不证明真实模型抽取质量；Codex本地登录通道仍未实现。该增量不修改BXP协议、Schema或208条冻结期望。

Tests use synthetic responses and mocked network operations, not live-model acceptance. The Codex local-login transport remains unimplemented. BXP normative contracts and frozen expectations are unchanged.

本次本地验证：已跟踪Core381/381，UI154/154，协议单测103/103，冻结向量208/208；API传输及候选链路定向测试15/15。97份文档、281个本地链接无问题。此处不把其他任务未提交的22项行业测试纳入Core计数，也不使用旧CI代表本次提交。

Local verification: tracked Core381, UI154, protocol103 and frozen vectors208 passed; focused HTTP transport/pipeline checks15 passed. Documentation: 97 files, 281 local links, zero problems. Concurrent uncommitted industry tests and previous-commit CI are excluded from this evidence.
