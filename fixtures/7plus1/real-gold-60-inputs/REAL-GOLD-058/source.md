---
protocol: fcop
version: 1
sender: ADMIN
recipient: ME
priority: P1
thread_key: ai-must-write-it-down-20260524
subject: 重试 Dev.to 发布认证头
---

## 背景
ADMIN 确认 `.env` 中 `DEVTO_API_KEY` 写的是 token 值本身，不是 key 名称。此前 Dev.to `GET /api/users/me` 与发布接口均返回 HTTP 403。

## 要求
- 不泄露 API key。
- 给 Dev.to API 请求补充明确 User-Agent 后重试认证检查与发布。
- 如仍失败，给出可操作判断。

## 验收
- 发布成功并返回 URL；或明确记录新的失败状态。