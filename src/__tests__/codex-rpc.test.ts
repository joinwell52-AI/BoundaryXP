import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { openCodexRpc } from '../product/codex-rpc.mjs';

function fixture(signal) {
  const child = new EventEmitter();
  child.stdin = new PassThrough();
  child.stdout = new PassThrough();
  let killed = false;
  child.kill = () => { killed = true; child.emit('exit', 0); };
  const rpc = openCodexRpc('/fixture', ['app-server'], { cwd: '/empty', signal, spawnImpl: (file, args, options) => {
    assert.equal(options.shell, false);
    assert.equal(options.windowsHide, true);
    return child;
  } });
  return { child, rpc, get killed() { return killed; } };
}

test('Codex RPC matches split UTF-8 frames and does not expose upstream errors', async () => {
  const { child, rpc } = fixture();
  const response = rpc.request('example', {});
  const bytes = Buffer.from('{"id":1,"result":{"text":"界痕🧪"}}\n');
  for (const byte of bytes) child.stdout.write(Buffer.from([byte]));
  assert.deepEqual(await response, { text: '界痕🧪' });
  const rejected = rpc.request('example', {});
  child.stdout.write('{"id":2,"error":{"code":-1,"message":"private-credential"}}\n');
  await assert.rejects(rejected, error => !error.message.includes('private-credential'));
  rpc.close();
});

for (const [name, bytes] of [
  ['duplicate JSON keys', Buffer.from('{"id":1,"id":2}\n')],
  ['invalid UTF-8', Buffer.from([0xff,10])],
  ['unrequested response', Buffer.from('{"id":99,"result":{}}\n')],
  ['server tool request', Buffer.from('{"id":7,"method":"item/tool/call","params":{}}\n')],
  ['oversized frame', Buffer.alloc(2_000_001,32)],
]) test(`Codex RPC closes on ${name}`, async () => {
  const harness = fixture();
  const pending = harness.rpc.request('example', {});
  harness.child.stdout.write(bytes);
  await assert.rejects(pending);
  assert.equal(harness.killed, true);
  harness.rpc.close();
});

test('cancellation rejects pending RPCs and closes the owned process', async () => {
  const controller = new AbortController();
  const harness = fixture(controller.signal);
  const pending = harness.rpc.request('example', {});
  controller.abort();
  await assert.rejects(pending);
  assert.equal(harness.killed, true);
  await assert.rejects(harness.rpc.request('late', {}));
  harness.rpc.close();
});
