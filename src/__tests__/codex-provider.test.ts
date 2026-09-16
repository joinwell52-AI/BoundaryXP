import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { callCodex, codexModels } from '../product/codex-provider.mjs';

function fixture(mode = 'valid') {
  const calls = [];
  let listener, closed = false, directory;
  const rpcFactory = (executable, args, options) => {
    directory = options.cwd;
    assert.ok(existsSync(directory));
    assert.ok(args.includes('features.hooks=false'));
    return {
      notify(method) { calls.push(method); },
      subscribe(callback) { listener = callback; return () => { listener = null; }; },
      close() { closed = true; },
      async request(method, params) {
        calls.push(method);
        if (method === 'initialize') return {};
        if (method === 'account/read') return { account: { type: mode === 'api-key' ? 'apiKey' : 'chatgpt' } };
        if (method === 'model/list') return { data: [{ model: mode === 'unavailable' ? 'other' : 'fixture' }] };
        if (method === 'config/read') return { config: { mcp_servers: { fixture: {} } } };
        if (method === 'thread/start') {
          assert.deepEqual(params.environments, []);
          assert.deepEqual(params.dynamicTools, []);
          assert.deepEqual(params.selectedCapabilityRoots, []);
          assert.equal(params.config['mcp_servers.fixture.enabled'], false);
          assert.equal(params.allowProviderModelFallback, false);
          assert.equal(params.ephemeral, true);
          return { model: 'fixture', modelProvider: 'openai', thread: { id: 'thread' }, runtimeWorkspaceRoots: [],
            sandbox: { type: 'readOnly', networkAccess: false }, instructionSources: mode === 'project-instructions' ? ['/other/project/AGENTS.md'] : [] };
        }
        if (method === 'mcpServerStatus/list') return { data: [{ name: 'fixture', tools: mode === 'tools' ? { unsafe: {} } : {}, resources: [], resourceTemplates: [] }], nextCursor: null };
        if (method === 'turn/start') {
          assert.deepEqual(params.environments, []);
          queueMicrotask(() => {
            if (mode === 'tool-event') { listener?.({ method: 'item/started', params: { threadId: 'thread', item: { type: 'commandExecution' } } }); return; }
            listener?.({ method: 'item/completed', params: { threadId: 'thread', item: { type: 'agentMessage', text: 'OK' } } });
            listener?.({ method: 'turn/completed', params: { threadId: 'thread', turn: { id: mode === 'wrong-turn' ? 'other' : 'turn', status: mode === 'failed' ? 'failed' : 'completed' } } });
          });
          return { turn: { id: 'turn' } };
        }
        throw Error('Unexpected method');
      },
    };
  };
  return { rpcFactory, calls, get closed() { return closed; }, get directory() { return directory; } };
}
const messages = [{ role: 'system', content: 'No tools.' }, { role: 'user', content: 'Return OK.' }];

test('subscription catalog does not create a generation thread or start a turn', async () => {
  const harness = fixture();
  assert.deepEqual(await codexModels({ rpcFactory: harness.rpcFactory, executable: '/fixture' }), [{ id: 'fixture', name: 'fixture' }]);
  assert.ok(!harness.calls.includes('thread/start'));
  assert.equal(harness.closed, true);
});

test('subscription transport uses managed login, no environments and disabled MCP before text generation', async () => {
  const harness = fixture();
  const result = await callCodex({ model: 'fixture' }, messages, { rpcFactory: harness.rpcFactory, executable: '/fixture' });
  assert.deepEqual(result, { text: 'OK', model: 'fixture' });
  assert.equal(harness.closed, true);
  assert.equal(existsSync(harness.directory), false);
  assert.ok(!harness.calls.includes('account/login/start'));
});

for (const mode of ['api-key', 'unavailable', 'project-instructions', 'tools', 'tool-event', 'wrong-turn', 'failed']) test(`subscription transport fails closed: ${mode}`, async () => {
  const harness = fixture(mode);
  await assert.rejects(callCodex({ model: 'fixture' }, messages, { rpcFactory: harness.rpcFactory, executable: '/fixture' }));
  assert.equal(harness.closed, true);
  assert.equal(existsSync(harness.directory), false);
  if (['api-key', 'unavailable', 'project-instructions', 'tools'].includes(mode)) assert.ok(!harness.calls.includes('turn/start'));
});

test('cancelled subscription calls cannot spawn a process', async () => {
  await assert.rejects(callCodex({ model: 'fixture' }, messages, { executable: '/fixture', signal: AbortSignal.abort(),
    rpcFactory: () => assert.fail('No process permitted') }), { name: 'AbortError' });
});
