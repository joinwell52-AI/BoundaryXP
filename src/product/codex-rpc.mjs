import { spawn } from 'node:child_process';
import { parseProductJson } from './contracts.mjs';

export function openCodexRpc(executable, args, { cwd, signal, spawnImpl = spawn } = {}) {
  signal?.throwIfAborted();
  const child = spawnImpl(executable, args, { cwd, windowsHide: true, shell: false, stdio: ['pipe', 'pipe', 'ignore'] });
  let nextId = 1, buffer = Buffer.alloc(0), stopped = false;
  const pending = new Map();
  const listeners = new Set();
  const failure = () => Error('Codex transport unavailable or rejected an unexpected message.');
  function stop() {
    if (stopped) return;
    stopped = true;
    for (const item of pending.values()) item.reject(failure());
    pending.clear();
    for (const listener of listeners) listener({ method: 'boundx/transportClosed' });
    child.kill();
  }
  child.on('error', stop);
  child.on('exit', stop);
  child.stdin.on('error', stop);
  child.stdout.on('error', stop);
  child.stdout.on('data', chunk => {
    if (stopped) return;
    buffer = Buffer.concat([buffer, chunk]);
    if (buffer.length > 2_000_000) { stop(); return; }
    let newline;
    while ((newline = buffer.indexOf(10)) >= 0 && !stopped) {
      const line = buffer.subarray(0, newline);
      buffer = buffer.subarray(newline + 1);
      let message;
      try { message = parseProductJson(line); } catch { stop(); return; }
      if (message.method && Object.hasOwn(message, 'id')) { stop(); return; }
      if (Object.hasOwn(message, 'id')) {
        const waiting = pending.get(message.id);
        if (!waiting) { stop(); return; }
        pending.delete(message.id);
        if (message.error) waiting.reject(failure());
        else waiting.resolve(message.result);
      } else if (typeof message.method === 'string') {
        for (const listener of listeners) listener(message);
      } else { stop(); return; }
    }
  });
  signal?.addEventListener('abort', stop, { once: true });
  if (signal?.aborted) stop();
  const send = message => {
    if (stopped) throw failure();
    child.stdin.write(JSON.stringify(message) + '\n');
  };
  return {
    request(method, params) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        try { send({ id, method, params }); } catch { pending.delete(id); reject(failure()); }
      });
    },
    notify(method) { send({ method }); },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    close() { signal?.removeEventListener('abort', stop); stop(); },
  };
}
