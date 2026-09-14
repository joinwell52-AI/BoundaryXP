# Codex订阅链路交付检查点 / Subscription delivery checkpoint

日期 / Date: 2026-09-15

状态 / Status: ENGINEERING_CHECKPOINT — PENDING_GOLD_REVIEW。不宣称整体IMPLEMENTATION_COMPLETE；不合并、不发布。

## 本轮交付 / Delivered

- Codex App Server托管ChatGPT登录、目录查询、单次文本生成、取消、超时、严格JSON-RPC及异常工具请求拒绝。
- API/Cursor/Codex共用生产者指令、证据检查和唯一BXP Core；订阅入口不接受API密钥。
- 原模型设置增加Codex订阅选项及模型目录，连接测试和标准BXP按钮接通；不启用旧PM多轮流程。
- 明确主原文source_id=task，避免模型把文件名或摘要当作证据来源；运行记录包含提示版本及摘要。
- Cursor额度/身份/网络错误使用固定双语诊断，不透传供应商原始错误和凭据。

Managed subscription transport, bounded RPC, shared candidate generation and the original UI are connected. Evidence source IDs are explicit. Cursor failures have safe, actionable bilingual diagnostics.

## 真实检查 / Live evidence

Codex CLI 0.147.0，gpt-5.6-sol；托管ChatGPT登录、5项模型目录和HTTP连接检查均成功。用户微服务示例进行了两次7+1生成：第一次因SOURCE_REFERENCE拒绝；调整提示中的原文来源约定后，第二次计算成功，I/R/V保持unresolved，两项授权字段为null。该结果不等于业务通过或语义准确率证明。

Managed login, the five-model catalog and guarded HTTP connection check succeeded. Of two microservice candidate generations, the first was rejected for SOURCE_REFERENCE; the second reached Core after the evidence-source prompt clarification. I/R/V remained unresolved and both authority fields null. This is not business approval or extraction certification.

Cursor实际返回用量耗尽；没有购买额度、静默模型切换或把失败改记成功。.env本机路径修正只留在忽略文件，不提交密钥。

Cursor reported exhausted usage. No credits were purchased and no fallback model was selected. Local .env corrections and credentials remain untracked.

## 验证 / Validation

已跟踪Node/Core测试588项、UI154项、协议单测103项、冻结向量208项、Python135项和文档单测20项通过；文档本地链接检查通过。数量分开报告，不相加作为自然语言抽取成功数。并行行业测试未纳入上述Core数量。

Tracked Node/Core588, UI154, protocol103, frozen vectors208, Python135 and document tests20 pass separately. Local documentation links pass. Concurrent untracked industry tests are excluded, and these totals are not natural-language accuracy.

## 文件清单 / Files

- docs/CODEX-CONNECTION.md
- docs/CURSOR-CONNECTION.md
- docs/tasks/ADMIN-TEXT-REMAINING.md
- docs/tasks/ADMIN-CODEX-DELIVERY.md
- scripts/run-admin-acceptance.mjs
- src/__tests__/codex-provider.test.ts
- src/__tests__/codex-rpc.test.ts
- src/__tests__/cursor-provider.test.ts
- src/__tests__/model-errors.test.ts
- src/__tests__/product-acceptance-run.test.ts
- src/__tests__/product-model-pipeline.test.ts
- src/product/acceptance-run.mjs
- src/product/codex-provider.mjs
- src/product/codex-rpc.mjs
- src/product/cursor-provider.mjs
- src/product/model-errors.mjs
- src/product/model-pipeline.mjs
- src/product/producer-instructions.mjs
- ui-server.mjs（仅本轮模型接入改动 / transport changes only）
- ui/app.js

## 尚未完成 / Outstanding

固定150次语料运行仍为0/150；独立金标审阅0/120，最终字段/证据/关系评分尚未冻结。单例与目录检查不占用固定验收名额。全局Codex策略仍可能加载，实验接口兼容性及供应商内部能力不构成认证承诺。完整门槛见[剩余项](ADMIN-TEXT-REMAINING.md)。

Fixed-corpus runs remain 0/150 and independent review 0/120; final scoring is not frozen. Smoke tests are not substituted for acceptance cases. Global Codex policy may still load, and experimental API compatibility or provider-internal capabilities are not certified. The branch remains a Draft PR for ADMIN review.
