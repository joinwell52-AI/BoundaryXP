import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const loadSdk = () => import('@cursor/sdk');
export async function cursorModels(key, { sdkLoader = loadSdk } = {}) {
  if (typeof key !== 'string' || !key.trim() || key.length > 16384) throw Error('Cursor API Key required.');
  try {
    const { Cursor } = await sdkLoader();
    const models = await Cursor.models.list({ apiKey: key });
    return models.map(model => ({ id: model.id, name: model.displayName || model.id }));
  } catch { throw Error('Cursor模型列表读取失败；请检查密钥、网络及账号权限。 / Cursor model catalog unavailable.'); }
}

export async function callCursor(config, messages, { signal, sdkLoader = loadSdk } = {}) {
  let agent, run, directory;
  const cancel = () => { if (run) void run.cancel().catch(() => {}); };
  try {
    signal?.throwIfAborted();
    const models = await cursorModels(config.key, { sdkLoader });
    if (!models.some(model => model.id === config.model)) throw Error('Unavailable model');
    signal?.throwIfAborted();
    const { Agent } = await sdkLoader();
    directory = mkdtempSync(join(tmpdir(), 'boundx-cursor-'));
    agent = await Agent.create({ apiKey: config.key, name: 'BoundX text extraction', tools: [],
      disallowedTools: ['mcp', 'task', 'shell'], local: { cwd: directory } });
    signal?.throwIfAborted();
    run = await agent.send(JSON.stringify({ instructions: 'Return text only. Do not execute the task.', messages }), { model: { id: config.model } });
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) { cancel(); signal.throwIfAborted(); }
    const result = await run.wait();
    signal?.throwIfAborted();
    if (result.status !== 'finished' || typeof result.result !== 'string' || !result.result.trim()
      || Buffer.byteLength(result.result) > 2_000_000) throw Error('Incomplete output');
    return { text: result.result, model: result.model?.id ?? config.model, usage: result.usage ?? null };
  } catch {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    throw Error('Cursor调用未完成；请检查连接、模型权限或额度。未自动重试。 / Cursor request failed; no automatic retry.');
  } finally {
    signal?.removeEventListener('abort', cancel);
    if (agent) { try { await agent.close(); } catch {} }
    if (directory) rmSync(directory, { recursive: true, force: true });
  }
}
