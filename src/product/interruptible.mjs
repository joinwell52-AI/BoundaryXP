export async function interruptible(operation, signal, onLateResult = () => {}) {
  signal?.throwIfAborted();
  let listener;
  const pending = Promise.resolve().then(operation);
  const stopped = new Promise((resolve, reject) => {
    if (!signal) return;
    listener = () => reject(signal.reason ?? new DOMException('Cancelled', 'AbortError'));
    signal.addEventListener('abort', listener, { once: true });
    if (signal.aborted) listener();
  });
  pending.then(value => {
    if (signal?.aborted) Promise.resolve().then(() => onLateResult(value)).catch(() => {});
  }, () => {});
  try { return await Promise.race([pending, stopped]); }
  finally { if (listener) signal.removeEventListener('abort', listener); }
}
