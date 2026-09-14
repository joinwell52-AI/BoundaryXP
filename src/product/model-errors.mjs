const failures = Object.freeze({
  MODEL_FAILED: '模型请求未完成；未自动重试。 / Model request failed; no automatic retry.',
  MODEL_QUOTA: '模型服务报告额度耗尽或用量受限；请检查服务商额度。未自动重试。 / Provider usage or quota limit reached; no automatic retry.',
  MODEL_AUTH: '模型服务身份验证失败；请检查本地凭据或重新登录。 / Provider authentication failed; check local credentials or sign in again.',
  MODEL_UNAVAILABLE: '所选模型不在当前可用目录中；未自动切换模型。 / Selected model is unavailable; no automatic fallback.',
  MODEL_NETWORK: '模型网络连接失败或服务暂不可用；未自动重试。 / Provider network or service unavailable; no automatic retry.',
});

export class ModelTransportError extends Error {
  constructor(code = 'MODEL_FAILED') {
    super(failures[code] ?? failures.MODEL_FAILED);
    this.name = 'ModelTransportError';
    this.code = Object.hasOwn(failures, code) ? code : 'MODEL_FAILED';
  }
}

export function cursorFailure(error) {
  if (error instanceof ModelTransportError) return error;
  const message = typeof error?.message === 'string' ? error.message.slice(0,8192) : '';
  if (error?.name === 'RateLimitError' || error?.status === 429
    || /out of usage|quota exceeded|usage limit|rate limit|insufficient credits/i.test(message)) return new ModelTransportError('MODEL_QUOTA');
  if (error?.name === 'AuthenticationError' || error?.status === 401) return new ModelTransportError('MODEL_AUTH');
  if (error?.name === 'NetworkError') return new ModelTransportError('MODEL_NETWORK');
  return new ModelTransportError();
}

export function publicModelFailure(error) {
  const safe = error instanceof ModelTransportError ? error : new ModelTransportError();
  const code = Object.hasOwn(failures, safe.code) ? safe.code : 'MODEL_FAILED';
  return { code, message: failures[code] };
}
