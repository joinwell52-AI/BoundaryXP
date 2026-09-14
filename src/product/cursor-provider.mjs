import { mkdtempSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { interruptible } from './interruptible.mjs';
import { cursorFailure, ModelTransportError } from './model-errors.mjs';

const loadSdk = () => import('@cursor/sdk');
export async function cursorModels(key, { sdkLoader = loadSdk, signal } = {}) {
  if (typeof key !== 'string' || !key.trim() || key.length > 16384) throw Error('Cursor API Key required.');
  try {
    const deadline = signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000);
    const { Cursor } = await interruptible(sdkLoader, deadline);
    const models = await interruptible(() => Cursor.models.list({ apiKey: key }), deadline);
    return models.map(model => ({ id: model.id, name: model.displayName || model.id }));
  } catch (error) { throw cursorFailure(error); }
}

export async function callCursor(config, messages, { signal: callerSignal, sdkLoader = loadSdk, removeWorkspace = rm } = {}) {
  const signal = callerSignal ? AbortSignal.any([callerSignal, AbortSignal.timeout(180000)]) : AbortSignal.timeout(180000);
  let agent, run, directory, output;
  const warnings = [];
  const cancel = () => { if (run) void run.cancel().catch(() => {}); };
  try {
    signal?.throwIfAborted();
    const models = await cursorModels(config.key, { sdkLoader, signal });
    if (!models.some(model => model.id === config.model)) throw new ModelTransportError('MODEL_UNAVAILABLE');
    signal?.throwIfAborted();
    const { Agent } = await interruptible(sdkLoader, signal);
    directory = mkdtempSync(join(tmpdir(), 'boundx-cursor-'));
    agent = await interruptible(() => Agent.create({ apiKey: config.key, name: 'BoundX text extraction', tools: [],
      disallowedTools: ['mcp', 'task', 'shell'], local: { cwd: directory } }), signal, late => late.close());
    signal?.throwIfAborted();
    run = await interruptible(() => agent.send(JSON.stringify({ instructions: 'Return text only. Do not execute the task.', messages }), { model: { id: config.model } }), signal, late => late.cancel());
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) { cancel(); signal.throwIfAborted(); }
    const result = await interruptible(() => run.wait(), signal);
    signal?.throwIfAborted();
    if (result.status === 'error') throw cursorFailure(result.error);
    if (result.status !== 'finished' || typeof result.result !== 'string' || !result.result.trim()
      || Buffer.byteLength(result.result) > 2_000_000) throw Error('Incomplete output');
    output = { text: result.result, model: result.model?.id ?? config.model, usage: result.usage ?? null };
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    throw cursorFailure(error);
  } finally {
    signal?.removeEventListener('abort', cancel);
    if (agent) { try { await interruptible(() => agent.close(), AbortSignal.timeout(2000)); } catch { warnings.push('CURSOR_CLOSE_INCOMPLETE'); } }
    if (directory) {
      try { await interruptible(() => removeWorkspace(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }), AbortSignal.timeout(2000)); }
      catch { warnings.push('CURSOR_WORKSPACE_CLEANUP_INCOMPLETE'); }
    }
  }
  if (warnings.length) output.warnings = warnings;
  return output;
}
