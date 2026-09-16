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
import { PRODUCER_INSTRUCTIONS, PRODUCER_PROMPT_VERSION } from '../product/producer-instructions.mjs';
import { CORE_ELEMENTS } from '../bxp/index.mjs';

test('producer guidance states exact unit and precision obligations without changing Core', () => {
  assert.equal(PRODUCER_PROMPT_VERSION, '0.5.0');
  for (const requirement of ['Core compares only equal units', 'exact factors 1/60/3600', 'preserving inclusive/exclusive operators and original quotes',
    'affected element unresolved', 'decimal strings', 'Never round source values', 'Do not merge different quantities']) assert.ok(PRODUCER_INSTRUCTIONS.includes(requirement));
});

test('producer guidance separates prohibition, provenance and guards from positive assignments', () => {
  for (const requirement of ['A purely prohibited action belongs in B', 'Quoted commands and quoted prohibitions being analyzed are input content',
    'without inventing a new A, O or prerequisite edge', 'input payload in I and its delivery in O',
    'remains a participant, not an input artifact', 'Populate C only for explicit completion', 'Retain conditional wording']) {
    assert.ok(PRODUCER_INSTRUCTIONS.includes(requirement));
  }
});

for (const [language, source, quote, prefix] of [
  ['zh-CN', '查看日志，不得修改日志。', '日志', '查看'],
  ['en', 'Read logs; do not modify logs.', 'logs', 'Read '],
]) test(`repeated evidence stays rejected until explicitly located: ${language}`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-locator-guidance-'));
  try {
    const host = createProductHost({ root });
    let locate = false;
    const input = { consent: true, config: { provider: 'codex', model: 'mock' },
      prepare: { source: { text: source, language }, profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: host.registry.active() } };
    const sendModel = async (config, messages) => {
      assert.ok(messages[0].content.includes('Check EVERY locator'));
      const prepared = JSON.parse(messages[1].content);
      const elements = Object.fromEntries(CORE_ELEMENTS.map(field => [field, { status: 'absent', entries: [] }]));
      elements.I = { status: 'resolved', entries: [{ id: 'logs', kind: 'input', text: quote,
        evidence: [{ source_id: 'task', quote, ...(locate ? { prefix } : {}) }] }] };
      return { text: JSON.stringify({ schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id,
        source_digest: prepared.source_digest, context_digest: prepared.context_digest, elements,
        constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
        producer: { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] }), model: 'mock' };
    };
    const rejected = await runAdminModel(host, input, { sendModel });
    assert.equal(rejected.computed, false);
    assert.equal(rejected.diagnostics[0].code, 'QUOTE_AMBIGUOUS');
    locate = true;
    const accepted = await runAdminModel(host, input, { sendModel });
    assert.equal(accepted.computed, true, JSON.stringify(accepted.diagnostics));
    assert.equal(accepted.task.elements.I.entries[0].evidence[0].quote, quote);
    assert.equal(accepted.result.execution_authorization, null);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

for (const [language, source] of [['zh-CN', '评审文档。'], ['en', 'Review the document.']]) test(`alternative interpretations require unresolved without deleting evidence: ${language}`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-alternative-guidance-'));
  try {
    const host = createProductHost({ root });
    let unresolved = false;
    const input = { consent: true, config: { provider: 'codex', model: 'mock' },
      prepare: { source: { text: source, language }, profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: host.registry.active() } };
    const sendModel = async (config, messages) => {
      assert.ok(messages[0].content.includes('not a list of every related semantic reference'));
      const prepared = JSON.parse(messages[1].content);
      const elements = Object.fromEntries(CORE_ELEMENTS.map(field => [field, { status: 'absent', entries: [] }]));
      elements.A = { status: unresolved ? 'unresolved' : 'resolved', ...(unresolved ? { reason_codes: ['AMBIGUOUS'] } : {}),
        entries: [{ id: 'review', kind: 'action', text: source, candidate_ids: ['design-review', 'delivery-review'], evidence: [{ source_id: 'task', quote: source }] }] };
      return { text: JSON.stringify({ schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id,
        source_digest: prepared.source_digest, context_digest: prepared.context_digest, elements,
        constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
        producer: { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] }), model: 'mock' };
    };
    const rejected = await runAdminModel(host, input, { sendModel });
    assert.equal(rejected.computed, false);
    assert.equal(rejected.diagnostics[0].code, 'CANDIDATE_AMBIGUOUS');
    unresolved = true;
    const accepted = await runAdminModel(host, input, { sendModel });
    assert.equal(accepted.computed, true, JSON.stringify(accepted.diagnostics));
    assert.equal(accepted.task.elements.A.status, 'unresolved');
    assert.deepEqual(accepted.task.extensions['org.boundx.producer'].provenance.find(entry => entry.element === 'A').candidate_ids, ['design-review', 'delivery-review']);
    assert.equal(accepted.result.business_decision, null);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

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
      assert.equal(messages[0].content, PRODUCER_INSTRUCTIONS);
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
