import { sourceDigest } from '../bxp/index.mjs';
import { IDS, assert, parseProductJson, validateProduct } from './contracts.mjs';
import { resolveEndpoint } from '../../ui/connection.mjs';
import { publicModelFailure } from './model-errors.mjs';
import { PRODUCER_INSTRUCTIONS } from './producer-instructions.mjs';

export async function runAdminModel(host, input, { sendModel, fetchImpl, signal } = {}) {
  let stage = 'prepare';
  try {
    const value = parseProductJson(JSON.stringify(input));
    assert(value && Object.keys(value).every(key => ['config', 'prepare', 'consent'].includes(key)) && value.consent === true,
      'MODEL_CONSENT', 'Confirm sending the task and permitted semantic context to the configured provider.');
    const config = value.config;
    assert(config && Object.keys(config).every(key => ['provider', 'protocol', 'url', 'model', 'key', 'disableThinking'].includes(key))
      && [undefined, 'api', 'cursor', 'codex'].includes(config.provider)
      && typeof config.model === 'string' && config.model.trim() && config.model.length <= 256
      && (config.provider === 'codex' ? config.key === undefined || config.key === ''
        : typeof config.key === 'string' && config.key.trim() && config.key.length <= 16384),
      'MODEL_CONFIG', 'A bounded model ID and API key are required.');
    if (![ 'cursor', 'codex' ].includes(config.provider)) resolveEndpoint(config.url, config.protocol);
    assert(!signal?.aborted, 'MODEL_ABORTED', 'Request was cancelled before extraction.');
    const prepared = host.service.prepare(value.prepare);
    assert(!prepared.diagnostics.some(item => item.code === 'DIRECTORY_DISCLOSURE_NOT_AUTHORIZED'),
      'DIRECTORY_DISCLOSURE_NOT_AUTHORIZED', 'Directory disclosure requires server authorization; no model request was sent.');
    stage = 'model';
    const messages = [{ role: 'system', content: PRODUCER_INSTRUCTIONS },
      { role: 'user', content: JSON.stringify(prepared) }];
    const output = await sendModel(config, messages, { signal, fetchImpl });
    assert(!signal?.aborted, 'MODEL_ABORTED', 'Request was cancelled during extraction.');
    stage = 'candidate';
    const candidate = validateProduct(IDS.candidate, parseProductJson(output.text));
    assert(candidate.producer.producer_kind === 'host-ai', 'PRODUCER_KIND', 'Model output must identify a Host AI candidate, not a replay.');
    assert(candidate.prepare_id === prepared.prepare_id && candidate.source_digest === prepared.source_digest
      && candidate.context_digest === prepared.context_digest, 'SNAPSHOT_DIGEST', 'Model output belongs to another prepared context.');
    const model = typeof output.model === 'string' && output.model.length <= 256 && (!config.key || !output.model.includes(config.key)) ? output.model : 'unknown';
    candidate.producer = { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: model };
    stage = 'calculate';
    const result = host.invoke('bx_evaluate_admin_candidate', { candidate });
    return { ...result, stage: result.computed ? 'result' : 'candidate', model,
      model_output_digest: sourceDigest(output.text), prepare_id: prepared.prepare_id };
  } catch (error) {
    const failure = publicModelFailure(error);
    const code = stage === 'model' ? (signal?.aborted ? 'MODEL_ABORTED' : failure.code) : error.code ?? 'MODEL_INPUT';
    const message = stage === 'model' ? (signal?.aborted ? '模型调用已取消，尚未计算。 / Model request cancelled; not computed.' : failure.message)
      : stage === 'candidate' ? 'Model candidate failed strict structure or snapshot checks; no calculation result was produced.'
      : 'Preparation or local validation failed; check source, selected packages and model configuration.';
    return { schema: 'boundx-producer-result/v1', computed: false, stage, diagnostics: [{ code, message }], task: null, result: null,
      report: '尚未计算 / Not computed\n' + code + ': ' + message };
  }
}
