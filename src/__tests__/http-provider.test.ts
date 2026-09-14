import test from 'node:test';
import assert from 'node:assert/strict';
import { callHttpModel } from '../product/http-provider.mjs';

const config = { protocol: 'chat', url: 'https://example.test/v1', model: 'test-model', key: 'test-secret' };
const valid = { choices: [{ finish_reason: 'stop', message: { content: '候选文本 🧪' } }], model: 'returned-model' };

test('HTTP provider preserves Unicode and returns actual model metadata', async () => {
  const output = await callHttpModel(config, [], { fetchImpl: async (url, request) => {
    assert.equal(url, 'https://example.test/v1/chat/completions');
    assert.equal(request.redirect, 'error');
    assert.equal(JSON.parse(request.body).stream, false);
    assert.equal(request.body.includes(config.key), false);
    return new Response(JSON.stringify(valid));
  } });
  assert.equal(output.text, '候选文本 🧪');
  assert.equal(output.model, 'returned-model');
});

for (const [name, raw] of [
  ['duplicate envelope key', '{"choices":[],"choices":' + JSON.stringify(valid.choices) + '}'],
  ['invalid UTF-8', Buffer.from([0xff])],
  ['UTF-8 BOM', Buffer.from('\ufeff' + JSON.stringify(valid))],
  ['unpaired surrogate', '{"choices":[{"finish_reason":"stop","message":{"content":"\\ud800"}}]}'],
]) test(`HTTP provider rejects ${name}`, async () => {
  await assert.rejects(callHttpModel(config, [], { fetchImpl: async () => new Response(raw) }), /Invalid UTF-8 or strict JSON/);
});

test('HTTP provider cancels an over-limit response body and releases its lock', async () => {
  let cancelled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(2_000_001)); }, cancel() { cancelled = true; } });
  await assert.rejects(callHttpModel(config, [], { fetchImpl: async () => new Response(stream) }), /exceeds limit/);
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});

test('HTTP provider cancellation interrupts a pending body read', async () => {
  const controller = new AbortController();
  let started;
  const ready = new Promise(resolve => { started = resolve; });
  let cancelled = false;
  const stream = new ReadableStream({ pull() { started(); }, cancel() { cancelled = true; } });
  const pending = callHttpModel(config, [], { signal: controller.signal, fetchImpl: async () => new Response(stream) });
  await ready;
  await new Promise(resolve => setImmediate(resolve));
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});

test('HTTP provider disposes a fetch response arriving after cancellation', async () => {
  const controller = new AbortController();
  let release;
  let cancelled = false;
  const pending = callHttpModel(config, [], { signal: controller.signal, fetchImpl: () => new Promise(resolve => { release = resolve; }) });
  await Promise.resolve();
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  release(new Response(new ReadableStream({ cancel() { cancelled = true; } })));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(cancelled, true);
});

test('HTTP provider refuses a pre-cancelled request before fetch', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(callHttpModel(config, [], { signal: controller.signal, fetchImpl: () => assert.fail('No network call expected') }), { name: 'AbortError' });
});

test('Responses retains text segments but refuses malformed, refused or tool output', async () => {
  const responsesConfig = { ...config, protocol: 'responses' };
  const run = output => callHttpModel(responsesConfig, [], { fetchImpl: async () => new Response(JSON.stringify({ status: 'completed', output })) });
  assert.equal((await run([{ type: 'reasoning' }, { type: 'message', content: [{ type: 'output_text', text: '第一段' }, { type: 'output_text', text: 'Second' }] }])).text, '第一段\nSecond');
  for (const output of [
    [{ type: 'message', content: [{ type: 'output_text', text: { invalid: true } }] }],
    [{ type: 'message', content: [{ type: 'refusal', refusal: 'No' }] }],
    [{ type: 'function_call', name: 'shell', arguments: '{}' }],
  ]) await assert.rejects(run(output));
});

test('Chat output with tool requests or refusal is never accepted as a text candidate', async () => {
  for (const extra of [{ refusal: 'No' }, { tool_calls: [{ id: 'call' }] }, { function_call: { name: 'shell' } }]) {
    await assert.rejects(callHttpModel(config, [], { fetchImpl: async () => new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: 'candidate', ...extra } }] })) }), /Refused or unexpected tool call/);
  }
});
