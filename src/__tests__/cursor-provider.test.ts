import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { callCursor, cursorModels } from '../product/cursor-provider.mjs';
import { interruptible } from '../product/interruptible.mjs';

test('cancellation before the scheduled SDK call prevents starting it', async () => {
  const controller = new AbortController();
  const pending = interruptible(() => { assert.fail('Cancelled operation must not start'); }, controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('cancellation releases a stuck SDK wait and disposes a late result', async () => {
  const controller = new AbortController();
  let release, disposed = false;
  const pending = interruptible(() => new Promise(resolve => { release = resolve; }), controller.signal, () => { disposed = true; });
  await Promise.resolve();controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  release({});await new Promise(resolve => setImmediate(resolve));
  assert.equal(disposed, true);
});

test('Cursor uses exact catalog model, isolated workspace and no execution tools', async () => {
  let directory, closed = false;
  const sdkLoader = async () => ({ Cursor: { models: { list: async () => [{ id: 'test-model', displayName: 'Test' }] } },
    Agent: { create: async options => {
      directory = options.local.cwd;
      assert.ok(existsSync(directory));
      assert.deepEqual(options.tools, []);
      assert.deepEqual(options.disallowedTools, ['mcp', 'task', 'shell']);
      return { close: () => { closed = true; }, send: async (prompt, options) => {
        assert.ok(!prompt.includes('test-secret'));
        assert.equal(options.model.id, 'test-model');
        return { wait: async () => ({ status: 'finished', result: '{"candidate":true}', model: { id: 'test-model' } }) };
      } };
    } } });
  const result = await callCursor({ key: 'test-secret', model: 'test-model' }, [{ role: 'user', content: 'Task' }], { sdkLoader });
  assert.equal(result.text, '{"candidate":true}');
  assert.equal(closed, true);
  assert.equal(existsSync(directory), false);
});

test('Cursor rejects unavailable models and masks SDK errors without falling back', async () => {
  let created = false;
  const sdkLoader = async () => ({ Cursor: { models: { list: async () => [] } }, Agent: { create: async () => { created = true; } } });
  await assert.rejects(callCursor({ key: 'secret', model: 'missing' }, [], { sdkLoader }), /Cursor request failed/);
  assert.equal(created, false);
  await assert.rejects(cursorModels('secret', { sdkLoader: async () => { throw Error('secret'); } }), error => !error.message.includes('secret'));
});

test('Cursor rejects cancelled requests before contacting the SDK', async () => {
  const controller = new AbortController();controller.abort();
  await assert.rejects(callCursor({ key: 'secret', model: 'model' }, [], { signal: controller.signal,
    sdkLoader: async () => { assert.fail('SDK must not be loaded'); } }), { name: 'AbortError' });
});
