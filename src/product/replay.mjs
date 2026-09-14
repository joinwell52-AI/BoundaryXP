import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { IDS, assert, candidateSchema, validateProduct, parseProductJson } from './contracts.mjs';
import { locateEvidence } from './evidence.mjs';

export function replayStructured(input) {
  const candidate = validateProduct(IDS.candidate, input);
  assert(candidate.producer.producer_kind === 'structured-replay', 'ADAPTER_KIND', 'Replay must not claim a live Host model run.');
  return candidate;
}

export function replayLabels(prepared, input) {
  const value = parseProductJson(JSON.stringify(input));
  assert(value && Object.keys(value).every(key => ['schema', 'tags', 'relations', 'scopes', 'clarifications', 'model_id'].includes(key))
    && value.schema === 'boundx-label-replay/v1' && Array.isArray(value.tags), 'ADAPTER_SCHEMA', 'Invalid label replay input.');
  assert(value.tags.length === CORE_ELEMENTS.length, 'ADAPTER_ELEMENTS', 'Exactly one tagged bucket per BXP element is required.');
  const elements = {};
  const bucketKeys = Object.keys(candidateSchema.$defs.bucket.properties);
  for (const tag of value.tags) {
    assert(tag && Object.keys(tag).every(key => key === 'element' || bucketKeys.includes(key))
      && CORE_ELEMENTS.includes(tag.element) && !Object.hasOwn(elements, tag.element), 'ADAPTER_ELEMENTS', 'Unknown or duplicate element tag.');
    const { element, ...bucket } = tag;
    elements[element] = bucket;
  }
  return validateProduct(IDS.candidate, {
    schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id, source_digest: prepared.source_digest,
    context_digest: prepared.context_digest, elements, constraints: value.relations,
    ...(value.scopes ? { scopes: value.scopes } : {}), clarifications: value.clarifications,
    producer: { producer_kind: 'labels-replay', adapter_version: '0.1.0', model_id: value.model_id ?? 'unknown' },
  });
}

export function tokenRangeLocator(source, tokens, start, end, source_id = 'task') {
  assert(typeof source === 'string' && source.length <= 200000 && Array.isArray(tokens) && tokens.length <= 100000
    && tokens.every(token => typeof token === 'string' && token.length > 0 && token.isWellFormed())
    && tokens.join('') === source, 'TOKEN_ALIGNMENT', 'Token pieces must reconstruct the exact source, without normalization.');
  assert(Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end > start && end <= tokens.length,
    'TOKEN_RANGE', 'Invalid token range.');
  const locator = { source_id, quote: tokens.slice(start, end).join(''),
    prefix: tokens.slice(0, start).join(''), suffix: tokens.slice(end).join('') };
  assert([...locator.quote].length <= 10000 && [...locator.prefix].length <= 10000 && [...locator.suffix].length <= 10000,
    'TOKEN_ALIGNMENT', 'Token context exceeds locator bounds; provide an explicit bounded quote locator.');
  locateEvidence({ [source_id]: source }, locator);
  return locator;
}
