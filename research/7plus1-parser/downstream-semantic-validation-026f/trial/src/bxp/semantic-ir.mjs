import { boundedJson } from './validation.mjs';
import { registeredValidator } from './schema-registry.mjs';
import { sourceDigest } from './evaluate.mjs';

const validateSchema = registeredValidator('semantic_ir');

export function validateSemanticIr(input) {
  const diagnostics = [];
  const report = () => ({ valid: diagnostics.length === 0, diagnostics,
    semantic_completeness: 'not_established', boundary_result: null, admission: null,
    business_decision: null, execution_authorization: null });
  const fail = (code, path) => diagnostics.push({ code, path });
  if (!boundedJson(input)) {
    fail('IR_JSON_INVALID', '');
    return report();
  }
  if (!validateSchema(input)) {
    fail('IR_SCHEMA_INVALID', validateSchema.errors?.[0]?.instancePath ?? '');
    return report();
  }
  const sources = new Map();
  input.sources.forEach((source, index) => {
    const path = `/sources/${index}`;
    if (sources.has(source.id)) fail('SOURCE_ID_DUPLICATE', `${path}/id`);
    sources.set(source.id, Array.from(source.text));
    if (sourceDigest(source.text) !== source.sha256) fail('SOURCE_DIGEST_MISMATCH', `${path}/sha256`);
  });
  if (input.sources.filter(source => source.role === 'task').length !== 1) fail('TASK_SOURCE_COUNT_INVALID', '/sources');
  const evidence = (spans, path) => spans.forEach((span, index) => {
    const points = sources.get(span.source_id);
    if (!points) fail('EVIDENCE_SOURCE_UNKNOWN', `${path}/${index}/source_id`);
    else if (span.end <= span.start || span.end > points.length
      || points.slice(span.start, span.end).join('') !== span.quote) fail('EVIDENCE_SPAN_INVALID', `${path}/${index}`);
  });
  const scopes = new Set();
  input.scopes.forEach((scope, index) => {
    if (scopes.has(scope.id)) fail('SCOPE_ID_DUPLICATE', `/scopes/${index}/id`);
    scopes.add(scope.id);
    evidence(scope.evidence, `/scopes/${index}/evidence`);
  });
  const entries = new Set();
  for (const [slot, bucket] of Object.entries(input.elements)) {
    const path = `/elements/${slot}`;
    if (bucket.status === 'absent' && (bucket.entries.length !== 0 || bucket.coverage !== 'assessed')) {
      fail('ABSENCE_NOT_ESTABLISHED', path);
    }
    if (bucket.status === 'resolved' && (bucket.coverage !== 'assessed' || bucket.entries.length === 0
      || bucket.entries.some(entry => entry.status !== 'resolved'))) fail('RESOLUTION_NOT_ESTABLISHED', path);
    bucket.entries.forEach((entry, index) => {
      const entryPath = `${path}/entries/${index}`;
      if (entries.has(entry.id)) fail('ENTRY_ID_DUPLICATE', `${entryPath}/id`);
      entries.add(entry.id);
      if (!scopes.has(entry.scope_id)) fail('ENTRY_SCOPE_UNKNOWN', `${entryPath}/scope_id`);
      evidence(entry.evidence, `${entryPath}/evidence`);
    });
  }
  return report();
}
