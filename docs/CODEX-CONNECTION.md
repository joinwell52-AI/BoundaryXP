# Codex订阅接入 / Codex subscription connection

在原页面`/legacy`模型设置选择“Codex订阅登录”，读取可用模型、选择模型、测试连接，再使用标准BXP抽取按钮。不是把ChatGPT订阅变成API Key；不填写密钥、不读取或复制auth.json令牌。

Select Codex subscription in the existing model settings, load the catalog, choose a model, and test before using the standard BXP button. Managed ChatGPT sign-in is not an API key. BoundaryXP never reads or copies authentication tokens.

## 本机要求 / Local requirements

- 本机Codex CLI已通过`codex login`登录ChatGPT；用`codex login status`检查。CLI订阅可用额度仍适用。
- Windows可发现npm安装的原生codex.exe；其他安装位置或系统设置BOUNDARYXP_CODEX_EXECUTABLE为原生可执行文件的绝对路径，不接受cmd/bat/ps1启动脚本。
- 已实际验证CLI 0.147.0和gpt-5.6-sol。实验性App Server版本变化可能导致明确拒绝，不静默改用API或另一个模型。
- 使用`node --env-file-if-exists=.env ui-server.mjs`加载本仓库可选.env；服务器已有环境变量优先。页面不会收到服务器密钥。

Sign in with the local Codex CLI. Windows npm installations can be discovered; otherwise configure an absolute native executable path using BOUNDARYXP_CODEX_EXECUTABLE. CLI 0.147.0 and gpt-5.6-sol were exercised locally. Experimental API incompatibility fails closed. The UI launcher loads the repository's optional .env without returning credentials to the browser.

## 处理流程 / Processing

现有模型生产者指令和准备快照直接传给Codex：固定八桶、原文证据、包引用、Schema及摘要。主原文的source_id必须为task，附件只能使用实际提供的ID。返回候选仍由相同生产者校验和src/bxp/唯一Core处理，不增加第二套计算器。

The shared producer prompt and prepared snapshot supply the eight buckets, evidence, package references and candidate schema. Primary evidence always uses source_id task. Returned candidates enter the same validators and sole Core. Failed generation or evidence validation produces no fabricated result.

## 隔离和限制 / Isolation and limitations

临时空目录、ephemeral线程、environments=[]、空动态工具及能力根；关闭shell、web search、hooks、apps、plugins、memories及multi-agent，显式关闭配置的MCP服务器并检查其工具/资源目录为空。只读沙箱只是附加防线，不是禁用工具的替代。

An ephemeral thread in an empty directory has no execution environments, dynamic tools or selected capability roots. Shell, web search, hooks, apps, plugins, memories and multi-agent features are disabled. Configured MCP servers are disabled and their tool/resource inventories checked. Read-only sandboxing is an additional layer, not the tool-isolation mechanism.

本机Codex全局AGENTS.md策略可能仍由Codex加载；当前只允许该已知来源，拒绝项目指令文件。不能宣称空白系统上下文或完全消除了模型供应商的内部工具能力。任何工具事件、服务端工具请求、异常线程/回合或不完整输出都拒绝；不批准工具、不继续计算。

Codex may still load its global AGENTS.md policy. Only that known instruction source is allowed; project instruction files are rejected. This is not a claim of an empty system context or proof about provider-internal capabilities. Unexpected tool events, server requests, threads/turns or incomplete outputs fail closed.

目录读取20秒、生成180秒上限；取消关闭本次子进程，不自动重试、不静默模型回退。BoundaryXP不写订阅令牌；ephemeral不构成供应商零留存承诺。旧版PM多轮功能不通过此入口启用。

Catalog reads have a 20-second limit and generation 180 seconds. Cancellation closes the owned process. No automatic retry or model fallback occurs. Ephemeral does not promise provider-side zero retention. Legacy multi-turn PM features are not enabled through this transport.

## 真实验证 / Live checks

2026-09-15：订阅身份和5个模型目录正常；最小文本测试成功返回OK。用户提供的微服务示例第一次候选因SOURCE_REFERENCE被拒绝；补充主原文来源ID指令后，另一次生成进入Core，validation=valid、completeness=unresolved、consistency=undetermined，I/R/V保留未明确，两项授权始终null。原始失败未计作成功。

On 2026-09-15, managed login and a five-model catalog worked; the text test returned OK. The first microservice candidate failed source-reference validation. After clarifying the primary evidence ID in the shared prompt, another generation reached Core with valid structure, unresolved completeness and undetermined consistency. I/R/V remained unresolved and both authority fields remained null. The failed attempt is not counted as success.

这些是连接和单例冒烟验证，不是150次固定验收或独立金标成绩。最终语义验收仍需完整固定运行与独立审阅。

These are connection and single-example smoke checks, not the fixed 150-run acceptance or independent gold accuracy.

依据：[官方App Server文档](https://learn.chatgpt.com/docs/app-server)。
