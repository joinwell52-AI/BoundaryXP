import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProductHost } from '../product/host.mjs';
import { createApp } from '../../ui-server.mjs';
import { runAdminModel } from '../product/model-pipeline.mjs';
import { callCursor } from '../product/cursor-provider.mjs';

for (const language of ['en', 'zh-CN']) test(`Cursor candidate reaches Core and three-layer report: ${language} (mock SDK)`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-cursor-core-'));
  try {
    const host = createProductHost({ root });
    const task = JSON.parse(readFileSync(new URL(`../../examples/bxp/${language}-complete.json`, import.meta.url), 'utf8'));
    const sdkLoader = async () => ({ Cursor: { models: { list: async () => [{ id: 'test-model' }] } },
      Agent: { create: async () => ({ close() {}, send: async prompt => {
        const prepared = JSON.parse(JSON.parse(prompt).messages[1].content);
        return { wait: async () => ({ status: 'finished', result: JSON.stringify(candidateFor(task, prepared)), model: { id: 'test-model' } }) };
      } }) } });
    const result = await runAdminModel(host, { consent: true, config: { provider: 'cursor', key: 'test-key', model: 'test-model' },
      prepare: { source: task.source, profile: task.profile, packs: host.registry.active() } },
    { sendModel: (config, messages, options) => callCursor(config, messages, { ...options, sdkLoader }) });
    assert.equal(result.computed, true, JSON.stringify(result.diagnostics));
    assert.equal(result.result.business_decision, null);
    assert.equal(result.result.execution_authorization, null);
    for (const layer of [1, 2, 3]) assert.ok(result.report.includes('【Layer ' + layer + '：'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

function candidateFor(task, prepared) {
  const convert = value => {
    if (Array.isArray(value)) return value.map(convert);
    if (!value || typeof value !== 'object') return value;
    if (Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
    return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'normalized').map(([key, child]) => [key, convert(child)]));
  };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id,
    source_digest: prepared.source_digest, context_digest: prepared.context_digest,
    elements: convert(task.elements), constraints: convert(task.constraints),
    producer: { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}

for (const language of ['en', 'zh-CN']) test(`subscription candidate reaches the sole Core without an API credential: ${language}`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-subscription-core-'));
  try {
    const host = createProductHost({ root });
    const task = JSON.parse(readFileSync(new URL(`../../examples/bxp/${language}-complete.json`, import.meta.url), 'utf8'));
    const input = { consent: true, config: { provider: 'codex', model: 'subscription-fixture' },
      prepare: { source: task.source, profile: task.profile, packs: host.registry.active() } };
    let calls = 0;
    const sendModel = async (config, messages) => {
      calls++;
      assert.equal(config.key, undefined);
      assert.ok(messages[0].content.includes('source_id "task"'));
      return { text: JSON.stringify(candidateFor(task, JSON.parse(messages[1].content))), model: 'subscription-fixture' };
    };
    const result = await runAdminModel(host, input, { sendModel });
    assert.equal(result.computed, true);
    assert.equal(result.model, 'subscription-fixture');
    assert.equal(result.result.business_decision, null);
    assert.equal(result.result.execution_authorization, null);
    const rejected = await runAdminModel(host, { ...input, config: { ...input.config, key: 'do-not-send-this' } }, { sendModel });
    assert.equal(rejected.computed, false);
    assert.equal(rejected.diagnostics[0].code, 'MODEL_CONFIG');
    assert.equal(calls, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

for (const protocol of ['chat', 'responses']) test(`configured ${protocol} transport reaches sole Core; malformed candidates fail closed (mock provider)`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-model-'));
  const options = { root, tenant: 'test-model', allowDirectoryDisclosure: false };
  const host = createProductHost(options);
  const reference = host.registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology', import.meta.url)));
  host.registry.activate(reference);
  const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-complete.json', import.meta.url), 'utf8'));
  let mode = 'valid', calls = 0;
  const key = 'test-secret-not-for-prompt';
  const server = createApp({ productOptions: options, fetchImpl: async (url, request) => {
    calls++;
    assert.equal(request.headers.Authorization, 'Bearer ' + key);
    assert.ok(!request.body.includes(key));
    const body = JSON.parse(request.body);
    const messages = body.messages ?? body.input;
    const prepared = JSON.parse(messages[1].content);
    const candidate = candidateFor(task, prepared);
    if (mode === 'quote') candidate.elements.I.entries[0].evidence[0].quote = 'invented evidence';
    if (mode === 'snapshot') candidate.prepare_id = 'wrong';
    let text = JSON.stringify(candidate);
    if (mode === 'duplicate') text = '{"schema":"duplicate",' + text.slice(1);
    if (mode === 'markdown') text = '```json\n' + text + '\n```';
    if (mode === 'failure') throw Error(key);
    return new Response(JSON.stringify(protocol === 'chat'
      ? { model: 'mock-model', choices: [{ finish_reason: mode === 'truncated' ? 'length' : 'stop', message: { content: text } }] }
      : { model: 'mock-model', status: mode === 'truncated' ? 'incomplete' : 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text }] }] }));
  } });
  try {
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    const page = await fetch(origin + '/admin').then(response => response.text());
    const token = page.match(/name="boundx-token" content="([a-f0-9]+)"/)[1];
    const input = { consent: true, config: { protocol, url: 'https://example.com/v1', model: 'mock-model', key },
      prepare: { source: task.source, profile: task.profile, packs: [reference] } };
    const post = async (value = input) => (await fetch(origin + '/api/admin-model', { method: 'POST',
      headers: { origin, 'content-type': 'application/json', 'x-boundx-token': token }, body: JSON.stringify(value) })).json();
    const result = await post();
    assert.equal(result.computed, true, JSON.stringify(result));
    assert.equal(result.result.business_decision, null);
    assert.equal(result.result.execution_authorization, null);
    for (const layer of [1, 2, 3]) assert.ok(result.report.includes('【Layer ' + layer + '：'));
    assert.ok(!JSON.stringify(result).includes(key));
    for (mode of ['quote', 'snapshot', 'duplicate', 'markdown', 'failure', 'truncated']) {
      const rejected = await post();
      assert.equal(rejected.computed, false, mode);
      assert.equal(rejected.result, null, mode);
      assert.ok(!JSON.stringify(rejected).includes(key));
    }
    const before = calls;
    assert.equal((await post({ ...input, consent: false })).computed, false);
    assert.equal(calls, before);
    assert.equal(calls, 7);
  } finally {
    if (server.listening) await new Promise<void>(resolve => { server.close(() => resolve()); server.closeAllConnections(); });
    rmSync(root, { recursive: true, force: true });
  }
});
