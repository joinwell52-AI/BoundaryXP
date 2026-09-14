import { resolveEndpoint } from '../../ui/connection.mjs';
import { parseProductJson } from './contracts.mjs';
import { interruptible } from './interruptible.mjs';

export async function callHttpModel(config, messages, { signal: callerSignal, fetchImpl = fetch, maxOutputTokens = 6000 } = {}) {
  const signal = callerSignal ? AbortSignal.any([callerSignal, AbortSignal.timeout(180000)]) : AbortSignal.timeout(180000);
  const { url } = resolveEndpoint(config.url, config.protocol);
  const body = config.protocol === 'responses'
    ? { model: config.model, input: messages, max_output_tokens: maxOutputTokens, stream: false, store: false }
    : { model: config.model, messages, max_tokens: maxOutputTokens, stream: false };
  if (config.protocol === 'responses' && config.disableThinking === true) body.thinking = { type: 'disabled' };
  let reader;
  try {
    const response = await interruptible(() => fetchImpl(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + config.key },
      body: JSON.stringify(body), signal, redirect: 'error' }), signal, response => response.body?.cancel());
    if (!response.ok) {
      await interruptible(() => response.body?.cancel(), AbortSignal.timeout(2000)).catch(() => {});
      const hint = { 404: '请核对接口路径、模型名称及该账号的模型访问权限。', 401: '请核对密钥是否有效。',
        403: '请核对模型访问权限。', 429: '可能是限流或额度不足，请检查服务商控制台。' }[response.status] ?? '请检查服务商状态。';
      throw Error('模型服务返回 HTTP ' + response.status + '。' + hint + ' 未自动重试。');
    }
    if (!response.body) throw Error('模型返回了空响应。 / Empty model response.');
    reader = response.body.getReader();
    let size = 0;
    const chunks = [];
    for (;;) {
      const { value, done } = await interruptible(() => reader.read(), signal);
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000) throw Error('模型响应过大。 / Model response exceeds limit.');
      chunks.push(value);
    }
    signal.throwIfAborted();
    let raw;
    try { raw = parseProductJson(Buffer.concat(chunks), 2_000_000); }
    catch { throw Error('模型返回了无效响应。 / Invalid UTF-8 or strict JSON response.'); }
    let text;
    if (config.protocol === 'responses') {
      if (raw?.status !== 'completed') throw Error('模型未完整完成输出，请检查输出限制或手动整理。');
      if (!Array.isArray(raw.output) || raw.output.some(item => !item || !['message', 'reasoning'].includes(item.type))) throw Error('模型返回了非文本调用。 / Unexpected non-text output.');
      const parts = raw.output.filter(item => item.type === 'message').flatMap(item => {
        if (!Array.isArray(item.content)) throw Error('模型返回了无效文本结构。');
        return item.content;
      });
      if (parts.some(part => !part || part.type !== 'output_text' || typeof part.text !== 'string')) throw Error('模型拒绝输出或文本格式无效。 / Refused or invalid text output.');
      text = parts.map(part => part.text).join('\n');
    } else {
      if (raw?.choices?.[0]?.finish_reason !== 'stop') throw Error('模型输出被截断或未正常结束。');
      if (raw.choices[0].message?.refusal || raw.choices[0].message?.tool_calls?.length || raw.choices[0].message?.function_call) throw Error('模型拒绝输出或返回了工具调用。 / Refused or unexpected tool call.');
      text = raw.choices[0].message?.content;
    }
    if (typeof text !== 'string' || !text.trim()) throw Error('模型没有返回文本。');
    return { text, model: raw.model ?? config.model, usage: raw.usage ?? null };
  } finally {
    if (reader) {
      await interruptible(() => reader.cancel(), AbortSignal.timeout(2000)).catch(() => {});
      reader.releaseLock();
    }
  }
}
